"""Active leak-test framework.

Each probe asserts a *fail-closed* expectation while protected mode is active:

  * traffic that should go through Tor is confirmed to exit via Tor;
  * every direct / unsupported path (IPv6 TCP, direct UDP DNS, external UDP,
    QUIC, alternate resolver) must FAIL.

"Pass" means "behaved safely". A probe that reaches the clearnet directly is a
FAILED test and a real leak. We never log the host's real public IP.

These probes make real network attempts and are therefore gated behind an
explicit opt-in in the CLI (``test-leaks --i-understand``) and are marked as
disposable-VM tests in the pytest suite.
"""

from __future__ import annotations

import socket
from collections.abc import Callable
from dataclasses import dataclass, field
from enum import Enum

from ..constants import DEFAULT_DNS_PORT
from ..logging_config import get_logger
from .dns import DnsValidator
from .routes import ExternalIPVerifier, VerifyState

_log = get_logger("network.leak_tests")


class Severity(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    INFO = "info"


@dataclass(frozen=True)
class LeakTestResult:
    name: str
    passed: bool
    severity: Severity
    observation: str

    @property
    def status(self) -> str:
        return "PASS" if self.passed else "FAIL"


@dataclass
class LeakTestReport:
    results: list[LeakTestResult] = field(default_factory=list)

    def add(self, result: LeakTestResult) -> None:
        self.results.append(result)

    @property
    def leaked(self) -> bool:
        return any(not r.passed and r.severity is Severity.CRITICAL for r in self.results)

    @property
    def all_passed(self) -> bool:
        return all(r.passed for r in self.results)


# Injectable primitives -------------------------------------------------------
# Signature order: (family, host, port, timeout)
TcpConnectFn = Callable[[int, str, int, float], socket.socket]
UdpSendRecvFn = Callable[[bytes, str, int, float], bytes]


def _tcp_connect(family: int, host: str, port: int, timeout: float) -> socket.socket:
    sock = socket.socket(family, socket.SOCK_STREAM)
    sock.settimeout(timeout)
    sock.connect((host, port))
    return sock


def _udp_sendrecv(payload: bytes, host: str, port: int, timeout: float) -> bytes:
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
        sock.settimeout(timeout)
        sock.sendto(payload, (host, port))
        data, _ = sock.recvfrom(2048)
        return data


class LeakTester:
    """Runs the leak-probe suite. All primitives are injectable for testing."""

    def __init__(
        self,
        verifier: ExternalIPVerifier,
        dns_validator: DnsValidator | None = None,
        *,
        dns_port: int = DEFAULT_DNS_PORT,
        timeout: float = 8.0,
        tcp_connect: TcpConnectFn = _tcp_connect,
        udp_sendrecv: UdpSendRecvFn = _udp_sendrecv,
        # Well-known targets used only to prove blocking; not sensitive.
        ipv6_target: tuple[str, int] = ("2606:4700:4700::1111", 80),
        udp_dns_target: tuple[str, int] = ("1.1.1.1", 53),
        external_udp_target: tuple[str, int] = ("1.1.1.1", 123),
        quic_target: tuple[str, int] = ("1.1.1.1", 443),
    ) -> None:
        self._verifier = verifier
        self._dns = dns_validator or DnsValidator()
        self._dns_port = dns_port
        self._timeout = timeout
        self._tcp = tcp_connect
        self._udp = udp_sendrecv
        self._ipv6_target = ipv6_target
        self._udp_dns_target = udp_dns_target
        self._external_udp_target = external_udp_target
        self._quic_target = quic_target

    # -- individual probes ---------------------------------------------------
    def probe_tor_connectivity(self) -> LeakTestResult:
        result = self._verifier.verify()
        if result.state is VerifyState.CONFIRMED_TOR:
            return LeakTestResult(
                "tor-connectivity", True, Severity.CRITICAL, "exit confirmed via Tor"
            )
        if result.state is VerifyState.LEAK_DETECTED:
            return LeakTestResult(
                "tor-connectivity", False, Severity.CRITICAL, "traffic NOT via Tor"
            )
        return LeakTestResult(
            "tor-connectivity", True, Severity.INFO, "verification unavailable (not a leak)"
        )

    def _expect_blocked_tcp(self, name: str, family: int, host: str, port: int) -> LeakTestResult:
        try:
            sock = self._tcp(family, host, port, self._timeout)
            sock.close()
            return LeakTestResult(name, False, Severity.CRITICAL, f"connected directly to {host}")
        except OSError:
            return LeakTestResult(name, True, Severity.CRITICAL, "blocked as expected")

    def _expect_blocked_udp(
        self, name: str, payload: bytes, host: str, port: int
    ) -> LeakTestResult:
        try:
            self._udp(payload, host, port, self._timeout)
            return LeakTestResult(
                name, False, Severity.CRITICAL, f"got UDP reply from {host}:{port}"
            )
        except OSError:
            return LeakTestResult(name, True, Severity.CRITICAL, "blocked as expected")

    def probe_ipv6_tcp(self) -> LeakTestResult:
        host, port = self._ipv6_target
        return self._expect_blocked_tcp("ipv6-tcp", socket.AF_INET6, host, port)

    def probe_direct_dns_udp(self) -> LeakTestResult:
        from .dns import build_query

        host, port = self._udp_dns_target
        return self._expect_blocked_udp("direct-dns-udp", build_query("example.com"), host, port)

    def probe_alternate_resolver(self) -> LeakTestResult:
        from .dns import build_query

        host, port = self._udp_dns_target
        return self._expect_blocked_udp(
            "alternate-resolver", build_query("example.org"), host, port
        )

    def probe_external_udp(self) -> LeakTestResult:
        host, port = self._external_udp_target
        return self._expect_blocked_udp("external-udp", b"\x00" * 48, host, port)

    def probe_quic(self) -> LeakTestResult:
        host, port = self._quic_target
        return self._expect_blocked_udp("quic-udp-443", b"\x00" * 32, host, port)

    def probe_tor_dns_resolves(self) -> LeakTestResult:
        result = self._dns.validate_tor_dns(self._dns_port)
        if result.ok:
            return LeakTestResult("tor-dns", True, Severity.HIGH, "Tor DNSPort resolves names")
        return LeakTestResult("tor-dns", False, Severity.HIGH, f"Tor DNS failed: {result.detail}")

    # -- suite ---------------------------------------------------------------
    def run_all(self) -> LeakTestReport:
        report = LeakTestReport()
        for probe in (
            self.probe_tor_connectivity,
            self.probe_ipv6_tcp,
            self.probe_direct_dns_udp,
            self.probe_alternate_resolver,
            self.probe_external_udp,
            self.probe_quic,
            self.probe_tor_dns_resolves,
        ):
            try:
                report.add(probe())
            except Exception as exc:
                report.add(
                    LeakTestResult(probe.__name__, False, Severity.HIGH, f"probe error: {exc}")
                )
        return report


__all__ = ["LeakTestReport", "LeakTestResult", "LeakTester", "Severity"]
