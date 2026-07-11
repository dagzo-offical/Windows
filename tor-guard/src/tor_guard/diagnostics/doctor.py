"""``tor-guard doctor`` — aggregate, non-destructive health assessment.

Collects platform, dependency, config, firewall-integrity, Tor-health, and
external-verification signals into a single report. Read-only; it never changes
networking. External-IP verification is reported tri-state (invariant I15).
"""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum

from ..config import Config
from ..firewall.integrity import IntegrityChecker
from ..network.routes import ExternalIPVerifier, VerifyState
from ..platform import detect_platform, is_supported
from ..subprocess_runner import which
from ..tor.health import TorHealthChecker


class Status(str, Enum):
    OK = "ok"
    WARN = "warn"
    FAIL = "fail"
    INFO = "info"


@dataclass(frozen=True)
class Finding:
    check: str
    status: Status
    detail: str


@dataclass
class DoctorReport:
    findings: list[Finding] = field(default_factory=list)

    def add(self, check: str, status: Status, detail: str) -> None:
        self.findings.append(Finding(check, status, detail))

    @property
    def has_failures(self) -> bool:
        return any(f.status is Status.FAIL for f in self.findings)


class Doctor:
    def __init__(
        self,
        config: Config,
        *,
        integrity: IntegrityChecker | None = None,
        tor_health: TorHealthChecker | None = None,
        verifier: ExternalIPVerifier | None = None,
    ) -> None:
        self._config = config
        self._integrity = integrity or IntegrityChecker()
        self._tor_health = tor_health or TorHealthChecker()
        self._verifier = verifier

    def run(self, *, check_external: bool = True) -> DoctorReport:
        report = DoctorReport()

        # platform
        info = detect_platform()
        if is_supported(info):
            report.add("platform", Status.OK, info.pretty_name)
        else:
            report.add("platform", Status.FAIL, f"qo‘llab-quvvatlanmaydi: {info.pretty_name}")

        # dependencies
        for cmd in ("nft", "tor", "systemctl"):
            report.add(
                f"dependency:{cmd}",
                Status.OK if which(cmd) else Status.FAIL,
                "mavjud" if which(cmd) else "mavjud emas",
            )

        # firewall integrity
        integrity = self._integrity.check()
        report.add(
            "firewall-integrity",
            Status.OK if integrity.ok else Status.FAIL,
            integrity.summary,
        )

        # tor health
        tor = self._tor_health.check(
            socks_port=self._config.socks_port,
            trans_port=self._config.trans_port,
            dns_port=self._config.dns_port,
        )
        report.add(
            "tor:transport",
            Status.OK if tor.trans.reachable else Status.FAIL,
            f"port {tor.trans.port}",
        )
        report.add(
            "tor:dnsport", Status.OK if tor.dns.reachable else Status.FAIL, f"port {tor.dns.port}"
        )
        report.add(
            "tor:socksport",
            Status.OK if tor.socks.reachable else Status.WARN,
            f"port {tor.socks.port}",
        )
        report.add(
            "tor:circuit",
            Status.OK if tor.circuit_established else Status.WARN,
            "o‘rnatilgan" if tor.circuit_established else "kanal yo‘q / boshqaruv mavjud emas",
        )

        # external verification (tri-state)
        if check_external:
            verifier = self._verifier or ExternalIPVerifier(
                self._config.external_ip_endpoints, timeout=self._config.health_timeout
            )
            result = verifier.verify()
            if result.state is VerifyState.CONFIRMED_TOR:
                report.add("external-verify", Status.OK, "chiqish Tor orqali tasdiqlandi")
            elif result.state is VerifyState.LEAK_DETECTED:
                report.add("external-verify", Status.FAIL, "trafik Tor orqali EMAS (sizib chiqish)")
            else:
                report.add(
                    "external-verify",
                    Status.INFO,
                    "tekshiruv mavjud emas (bu sizib chiqish yoki nosozlik dalili emas)",
                )

        return report


__all__ = ["Doctor", "DoctorReport", "Finding", "Status"]
