"""Tor bootstrap progress parsing and waiting.

Tor reports bootstrap progress on its ControlPort (``GETINFO
status/bootstrap-phase``) and in its logs (``Bootstrapped NN%``). We treat the
system as protected only when Tor reaches 100% (invariant I2 / failure table:
"Tor bootstrap < 100% → remain locked").
"""

from __future__ import annotations

import re
import time
from collections.abc import Callable
from dataclasses import dataclass

from ..exceptions import BootstrapTimeout
from ..logging_config import get_logger

_log = get_logger("tor.bootstrap")

_BOOTSTRAP_RE = re.compile(r"(?:Bootstrapped|PROGRESS=)\s*(\d{1,3})\s*%?")
_SUMMARY_RE = re.compile(r'SUMMARY="([^"]*)"')


@dataclass(frozen=True)
class BootstrapStatus:
    percent: int
    summary: str

    @property
    def complete(self) -> bool:
        return self.percent >= 100


def parse_bootstrap(line: str) -> BootstrapStatus | None:
    """Parse a bootstrap percentage from a control reply or log line."""
    match = _BOOTSTRAP_RE.search(line)
    if not match:
        return None
    percent = int(match.group(1))
    percent = max(0, min(100, percent))
    summary_match = _SUMMARY_RE.search(line)
    summary = summary_match.group(1) if summary_match else ""
    return BootstrapStatus(percent=percent, summary=summary)


def wait_for_bootstrap(
    poll: Callable[[], BootstrapStatus | None],
    *,
    timeout: float,
    interval: float = 1.0,
    sleep: Callable[[float], None] = time.sleep,
    now: Callable[[], float] = time.monotonic,
) -> BootstrapStatus:
    """Poll *poll* until bootstrap reaches 100% or *timeout* elapses.

    Raises :class:`BootstrapTimeout` on timeout — the caller must then remain
    locked (never fall open).
    """
    deadline = now() + timeout
    last = BootstrapStatus(0, "starting")
    while now() < deadline:
        status = poll()
        if status is not None:
            last = status
            _log.debug("bootstrap %d%% %s", status.percent, status.summary)
            if status.complete:
                _log.info("Tor ulanish bosqichi yakunlandi (100%%)")
                return status
        sleep(interval)
    raise BootstrapTimeout(
        f"Tor {timeout}s ichida ulanish bosqichini yakunlamadi "
        f"(oxirgi: {last.percent}% {last.summary})"
    )


__all__ = ["BootstrapStatus", "parse_bootstrap", "wait_for_bootstrap"]
