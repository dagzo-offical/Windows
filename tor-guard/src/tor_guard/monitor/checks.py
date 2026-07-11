"""Composable health checks used by the monitor daemon and ``doctor``.

Each check returns a small immutable result. None of them ever *change*
networking — they only observe. The daemon decides what corrective action to
take, and the only corrective actions permitted are "restart Tor" and "re-apply
the locked firewall" (invariant I11: never restore clearnet automatically).
"""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum

from ..firewall.integrity import IntegrityChecker, IntegrityReport
from ..tor.health import TorHealth, TorHealthChecker


class CheckLevel(str, Enum):
    OK = "ok"
    WARN = "warn"
    FAIL = "fail"


@dataclass(frozen=True)
class CheckResult:
    name: str
    level: CheckLevel
    detail: str

    @property
    def ok(self) -> bool:
        return self.level is CheckLevel.OK


@dataclass(frozen=True)
class HealthSnapshot:
    integrity: IntegrityReport
    tor: TorHealth | None
    results: tuple[CheckResult, ...]

    @property
    def firewall_intact(self) -> bool:
        return self.integrity.ok

    @property
    def tor_healthy(self) -> bool:
        return self.tor is not None and self.tor.healthy

    @property
    def any_fail(self) -> bool:
        return any(r.level is CheckLevel.FAIL for r in self.results)


class HealthChecker:
    """Runs firewall-integrity and Tor-health checks and summarises them."""

    def __init__(
        self,
        integrity: IntegrityChecker,
        tor_health: TorHealthChecker,
        *,
        socks_port: int,
        trans_port: int,
        dns_port: int,
    ) -> None:
        self._integrity = integrity
        self._tor_health = tor_health
        self._socks = socks_port
        self._trans = trans_port
        self._dns = dns_port

    def snapshot(self, *, check_tor: bool = True) -> HealthSnapshot:
        integrity = self._integrity.check()
        results: list[CheckResult] = []

        if integrity.ok:
            results.append(CheckResult("firewall-integrity", CheckLevel.OK, integrity.summary))
        else:
            results.append(CheckResult("firewall-integrity", CheckLevel.FAIL, integrity.summary))

        tor: TorHealth | None = None
        if check_tor:
            tor = self._tor_health.check(
                socks_port=self._socks, trans_port=self._trans, dns_port=self._dns
            )
            results.append(
                CheckResult(
                    "tor-trans-port",
                    CheckLevel.OK if tor.trans.reachable else CheckLevel.FAIL,
                    tor.trans.detail or f"port {tor.trans.port}",
                )
            )
            results.append(
                CheckResult(
                    "tor-dns-port",
                    CheckLevel.OK if tor.dns.reachable else CheckLevel.FAIL,
                    tor.dns.detail or f"port {tor.dns.port}",
                )
            )
            results.append(
                CheckResult(
                    "tor-socks-port",
                    CheckLevel.OK if tor.socks.reachable else CheckLevel.WARN,
                    tor.socks.detail or f"port {tor.socks.port}",
                )
            )
            results.append(
                CheckResult(
                    "tor-circuit",
                    CheckLevel.OK if tor.circuit_established else CheckLevel.WARN,
                    "circuit established" if tor.circuit_established else "no circuit",
                )
            )

        return HealthSnapshot(integrity=integrity, tor=tor, results=tuple(results))


__all__ = ["CheckLevel", "CheckResult", "HealthChecker", "HealthSnapshot"]
