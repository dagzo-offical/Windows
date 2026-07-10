"""External connectivity verification with a *tri-state* result.

Invariant I15: an unreachable check endpoint is reported as
``verification unavailable`` — never as proof that clearnet is safe, and never as
proof that Tor is broken. We distinguish three outcomes explicitly.

We never log the host's real public IP. When a leak is detected we record only
the fact of the leak, not the address.
"""

from __future__ import annotations

import json
import urllib.error
import urllib.request
from collections.abc import Callable
from dataclasses import dataclass
from enum import Enum

from ..logging_config import get_logger

_log = get_logger("network.routes")

# Injectable fetcher: (url, timeout) -> body text. Raises on transport failure.
Fetcher = Callable[[str, float], str]


class VerifyState(str, Enum):
    CONFIRMED_TOR = "confirmed-tor"
    LEAK_DETECTED = "leak-detected"
    UNAVAILABLE = "verification-unavailable"


@dataclass(frozen=True)
class VerifyResult:
    state: VerifyState
    endpoint: str
    detail: str = ""

    @property
    def is_tor(self) -> bool:
        return self.state is VerifyState.CONFIRMED_TOR

    @property
    def is_leak(self) -> bool:
        return self.state is VerifyState.LEAK_DETECTED


def _urllib_fetch(url: str, timeout: float) -> str:
    # Reject any non-HTTPS scheme (defence in depth; config already enforces it).
    if not url.startswith("https://"):
        raise ValueError(f"refusing non-https URL: {url}")
    request = urllib.request.Request(url, headers={"User-Agent": "tor-guard/1.0"})  # noqa: S310
    with urllib.request.urlopen(request, timeout=timeout) as response:  # noqa: S310  # nosec B310
        return str(response.read().decode("utf-8", errors="replace"))


def _interpret_torproject(body: str) -> bool | None:
    """Return True if IsTor, False if not, None if unrecognised."""
    try:
        data = json.loads(body)
    except ValueError:
        # Fallback to the HTML page wording.
        lowered = body.lower()
        if "congratulations. this browser is configured to use tor" in lowered:
            return True
        if "you are not using tor" in lowered:
            return False
        return None
    if isinstance(data, dict) and "IsTor" in data:
        return bool(data["IsTor"])
    return None


class ExternalIPVerifier:
    def __init__(
        self,
        endpoints: tuple[str, ...],
        *,
        timeout: float = 15.0,
        fetcher: Fetcher = _urllib_fetch,
    ) -> None:
        if not endpoints:
            raise ValueError("at least one verification endpoint is required")
        self._endpoints = endpoints
        self._timeout = timeout
        self._fetch = fetcher

    def verify(self) -> VerifyResult:
        """Try each endpoint; a definitive answer wins, else UNAVAILABLE."""
        last_error = ""
        for endpoint in self._endpoints:
            try:
                body = self._fetch(endpoint, self._timeout)
            except (urllib.error.URLError, OSError, ValueError) as exc:
                last_error = str(exc)
                _log.info("verification endpoint unreachable: %s", endpoint)
                continue
            verdict = _interpret_torproject(body)
            if verdict is True:
                return VerifyResult(VerifyState.CONFIRMED_TOR, endpoint)
            if verdict is False:
                # LEAK: do not log or store the real IP.
                _log.error("LEAK: external check reports traffic is NOT via Tor")
                return VerifyResult(
                    VerifyState.LEAK_DETECTED, endpoint, "endpoint reports non-Tor exit"
                )
            last_error = "unrecognised response"
        return VerifyResult(VerifyState.UNAVAILABLE, self._endpoints[0], last_error)


__all__ = ["ExternalIPVerifier", "Fetcher", "VerifyResult", "VerifyState"]
