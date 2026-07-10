from __future__ import annotations

import pytest

from tor_guard.config import parse_config
from tor_guard.context import AppContext
from tor_guard.exceptions import DependencyError
from tor_guard.firewall.models import RulesetParams
from tor_guard.network.routes import VerifyResult, VerifyState
from tor_guard.orchestrator import Orchestrator, StepStatus
from tor_guard.state import ProtectionState, StateStore
from tor_guard.tor.health import PortHealth, TorHealth


class FakeFirewall:
    def __init__(self):
        self.applied = 0
        self.emergency = 0
        self.tables = set()

    def backup_current(self):
        from pathlib import Path

        return Path("/tmp/backup.nft")

    def apply_protected(self, params):
        self.applied += 1
        self.tables.add(("inet", "tor_guard_filter"))

    def emergency_lock(self):
        self.emergency += 1
        self.tables.add(("inet", "tor_guard_filter"))

    def table_exists(self, family, name):
        return (family, name) in self.tables

    def remove_tor_guard_tables(self):
        self.tables.clear()


class FakeTor:
    def __init__(self, installed=True, uid=107):
        self._installed = installed
        self.uid = uid
        self.restarts = 0
        self.stops = 0

    def ensure_installed(self):
        if not self._installed:
            raise DependencyError("Tor not installed")
        return self.uid

    def write_config(self):
        from pathlib import Path

        return Path("/etc/tor/torrc.d/10-tor-guard.conf")

    def restart(self):
        self.restarts += 1

    def stop(self):
        self.stops += 1


class FakeHealth:
    def __init__(self, healthy=True):
        self._healthy = healthy

    def check(self, *, socks_port, trans_port, dns_port):
        ok = self._healthy
        return TorHealth(
            socks=PortHealth("socks", socks_port, ok),
            trans=PortHealth("trans", trans_port, ok),
            dns=PortHealth("dns", dns_port, ok),
            circuit_established=ok,
            control_ok=ok,
        )


class FakeVerifier:
    def __init__(self, state=VerifyState.CONFIRMED_TOR):
        self._state = state

    def verify(self):
        return VerifyResult(self._state, "https://x")


class FakeSystemd:
    def stop(self, unit):
        pass


def _ctx(
    tmp_path,
    *,
    tor_installed=True,
    healthy=True,
    verify=VerifyState.CONFIRMED_TOR,
    cfg_text="mode: strict\ntest_mode: true",
):
    cfg = parse_config(cfg_text)
    fw = FakeFirewall()
    return AppContext(
        config=cfg,
        runner=None,  # unused on these paths
        firewall=fw,
        integrity=None,
        tor=FakeTor(installed=tor_installed),
        tor_health=FakeHealth(healthy),
        systemd=FakeSystemd(),
        dns=None,
        verifier=FakeVerifier(verify),
        state_store=StateStore(tmp_path / "state.json"),
    )


@pytest.fixture(autouse=True)
def _no_priv(monkeypatch):
    monkeypatch.setattr("tor_guard.orchestrator.require_root", lambda action: None)
    monkeypatch.setattr("tor_guard.orchestrator.ensure_supported", lambda: None)


def _override_params(ctx):
    ctx.ruleset_params = lambda: RulesetParams(  # type: ignore[method-assign]
        mode=ctx.config.mode,
        tor_uid=107,
        trans_port=ctx.config.trans_port,
        dns_port=ctx.config.dns_port,
    )


def _orch(ctx):
    """Orchestrator with an instant, successful bootstrap poll (no live Tor)."""
    from tor_guard.tor.bootstrap import parse_bootstrap

    return Orchestrator(
        ctx,
        bootstrap_poll=lambda: parse_bootstrap("PROGRESS=100"),
        sleep=lambda _: None,
    )


def test_happy_path_marks_protected(tmp_path):
    ctx = _ctx(tmp_path)
    _override_params(ctx)
    report = _orch(ctx).start(run_leak_checks=False)
    assert report.protected
    assert report.final_state is ProtectionState.PROTECTED
    assert ctx.firewall.applied == 1
    assert ctx.tor.restarts == 1


def test_firewall_applied_before_tor(tmp_path):
    ctx = _ctx(tmp_path)
    _override_params(ctx)
    order = []
    orig_apply = ctx.firewall.apply_protected
    orig_restart = ctx.tor.restart
    ctx.firewall.apply_protected = lambda p: (order.append("fw"), orig_apply(p))[1]
    ctx.tor.restart = lambda: (order.append("tor"), orig_restart())[1]
    _orch(ctx).start(run_leak_checks=False)
    assert order == ["fw", "tor"]  # invariant I2


def test_tor_not_installed_stays_locked(tmp_path):
    ctx = _ctx(tmp_path, tor_installed=False)
    _override_params(ctx)
    report = _orch(ctx).start(run_leak_checks=False)
    assert not report.protected
    assert report.final_state is ProtectionState.LOCKED
    # firewall never applied, but emergency lock ensured host is locked
    assert ctx.firewall.emergency == 1
    assert any(s.name == "dependencies" and s.status is StepStatus.FAIL for s in report.steps)


def test_leak_detected_stays_locked(tmp_path):
    ctx = _ctx(tmp_path, verify=VerifyState.LEAK_DETECTED)
    _override_params(ctx)
    report = _orch(ctx).start(run_leak_checks=False)
    assert not report.protected
    assert report.final_state is ProtectionState.LOCKED


def test_verification_unavailable_is_degraded_not_open(tmp_path):
    ctx = _ctx(tmp_path, verify=VerifyState.UNAVAILABLE)
    _override_params(ctx)
    report = _orch(ctx).start(run_leak_checks=False)
    assert not report.protected
    assert report.final_state is ProtectionState.DEGRADED  # fail-closed, not clearnet


def test_unhealthy_listeners_stays_locked(tmp_path):
    ctx = _ctx(tmp_path, healthy=False)
    _override_params(ctx)
    report = _orch(ctx).start(run_leak_checks=False)
    assert report.final_state is ProtectionState.LOCKED


def test_stop_keeps_firewall(tmp_path):
    ctx = _ctx(tmp_path)
    _override_params(ctx)
    ctx.firewall.tables.add(("inet", "tor_guard_filter"))
    Orchestrator(ctx).stop(stop_tor=True)
    # firewall tables NOT removed (invariants I3, I4)
    assert ("inet", "tor_guard_filter") in ctx.firewall.tables
    assert ctx.tor.stops == 1
