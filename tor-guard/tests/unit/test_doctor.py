from __future__ import annotations

from tor_guard.config import parse_config
from tor_guard.diagnostics.doctor import Doctor, Status
from tor_guard.firewall.integrity import IntegrityChecker, IntegrityReport
from tor_guard.network.routes import ExternalIPVerifier, VerifyState
from tor_guard.tor.health import PortHealth, TorHealth


class FakeIntegrity(IntegrityChecker):
    def __init__(self, ok):
        self._ok = ok

    def check(self):
        return IntegrityReport(ok=self._ok, missing_tables=() if self._ok else ("x",))


class FakeHealth:
    def __init__(self, ok):
        self._ok = ok

    def check(self, *, socks_port, trans_port, dns_port):
        return TorHealth(
            socks=PortHealth("socks", socks_port, self._ok),
            trans=PortHealth("trans", trans_port, self._ok),
            dns=PortHealth("dns", dns_port, self._ok),
            circuit_established=self._ok,
            control_ok=self._ok,
        )


def _verifier(state):
    body = {
        VerifyState.CONFIRMED_TOR: '{"IsTor": true}',
        VerifyState.LEAK_DETECTED: '{"IsTor": false}',
        VerifyState.UNAVAILABLE: "garbage",
    }[state]
    return ExternalIPVerifier(("https://x",), fetcher=lambda u, t: body)


def _doctor(integrity_ok, tor_ok, verify_state, monkeypatch=None):
    if monkeypatch is not None:
        # env may lack the tor binary; doctor's dependency check is not under test here
        monkeypatch.setattr("tor_guard.diagnostics.doctor.which", lambda cmd: "/usr/bin/" + cmd)
    cfg = parse_config("mode: strict")
    return Doctor(
        cfg,
        integrity=FakeIntegrity(integrity_ok),
        tor_health=FakeHealth(tor_ok),
        verifier=_verifier(verify_state),
    )


def test_all_healthy_no_failures(monkeypatch):
    report = _doctor(True, True, VerifyState.CONFIRMED_TOR, monkeypatch).run()
    assert not report.has_failures


def test_integrity_fail_flagged():
    report = _doctor(False, True, VerifyState.CONFIRMED_TOR).run()
    assert report.has_failures
    assert any(f.check == "firewall-integrity" and f.status is Status.FAIL for f in report.findings)


def test_leak_is_failure():
    report = _doctor(True, True, VerifyState.LEAK_DETECTED).run()
    assert any(f.check == "external-verify" and f.status is Status.FAIL for f in report.findings)


def test_unavailable_is_info_not_failure():
    report = _doctor(True, True, VerifyState.UNAVAILABLE).run()
    verify = next(f for f in report.findings if f.check == "external-verify")
    assert verify.status is Status.INFO
    # verification-unavailable must not, on its own, be a doctor failure
    assert not any(
        f.check == "external-verify" and f.status is Status.FAIL for f in report.findings
    )


def test_skip_external():
    report = _doctor(True, True, VerifyState.CONFIRMED_TOR).run(check_external=False)
    assert not any(f.check == "external-verify" for f in report.findings)
