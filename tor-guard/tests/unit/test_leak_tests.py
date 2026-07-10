from __future__ import annotations

from tor_guard.network.dns import DnsValidator
from tor_guard.network.leak_tests import LeakTester, Severity
from tor_guard.network.routes import ExternalIPVerifier, VerifyState


def _verifier(state: VerifyState):
    body = {
        VerifyState.CONFIRMED_TOR: '{"IsTor": true}',
        VerifyState.LEAK_DETECTED: '{"IsTor": false}',
        VerifyState.UNAVAILABLE: "garbage",
    }[state]
    return ExternalIPVerifier(("https://x",), fetcher=lambda u, t: body)


def _blocking_tcp(*_a):
    raise OSError("blocked by firewall")


def _blocking_udp(*_a):
    raise OSError("blocked by firewall")


class _FakeSocket:
    def close(self):
        pass


def _open_tcp(family, host, port, timeout):
    # pretend a connection succeeded -> a leak (no real socket touched)
    return _FakeSocket()


def test_all_blocked_is_pass():
    tester = LeakTester(
        _verifier(VerifyState.CONFIRMED_TOR),
        DnsValidator(query_fn=lambda *a: (_ for _ in ()).throw(OSError())),
        tcp_connect=_blocking_tcp,
        udp_sendrecv=_blocking_udp,
    )
    report = tester.run_all()
    # tor connectivity confirmed + all direct paths blocked
    assert not report.leaked
    ipv6 = next(r for r in report.results if r.name == "ipv6-tcp")
    assert ipv6.passed and ipv6.severity is Severity.CRITICAL


def test_ipv6_open_is_a_leak():
    tester = LeakTester(
        _verifier(VerifyState.CONFIRMED_TOR),
        tcp_connect=_open_tcp,
        udp_sendrecv=_blocking_udp,
    )
    result = tester.probe_ipv6_tcp()
    assert not result.passed
    assert result.severity is Severity.CRITICAL


def test_non_tor_exit_is_critical_leak():
    tester = LeakTester(
        _verifier(VerifyState.LEAK_DETECTED), tcp_connect=_blocking_tcp, udp_sendrecv=_blocking_udp
    )
    result = tester.probe_tor_connectivity()
    assert not result.passed


def test_unavailable_verification_is_not_a_leak():
    tester = LeakTester(
        _verifier(VerifyState.UNAVAILABLE), tcp_connect=_blocking_tcp, udp_sendrecv=_blocking_udp
    )
    result = tester.probe_tor_connectivity()
    assert result.passed
    assert result.severity is Severity.INFO


def test_direct_udp_reply_is_a_leak():
    def udp_ok(payload, host, port, timeout):
        return b"\x00" * 32  # got a reply => not blocked

    tester = LeakTester(
        _verifier(VerifyState.CONFIRMED_TOR), tcp_connect=_blocking_tcp, udp_sendrecv=udp_ok
    )
    assert not tester.probe_external_udp().passed
