from __future__ import annotations

from tor_guard.config import parse_config
from tor_guard.firewall.integrity import IntegrityReport
from tor_guard.firewall.models import RulesetParams
from tor_guard.monitor.checks import HealthSnapshot
from tor_guard.monitor.daemon import MonitorDaemon
from tor_guard.state import ProtectionState, StateStore
from tor_guard.tor.health import PortHealth, TorHealth


class FakeChecker:
    def __init__(self, integrity_ok, tor_ok):
        self._integrity_ok = integrity_ok
        self._tor_ok = tor_ok

    def snapshot(self, *, check_tor=True):
        integrity = IntegrityReport(
            ok=self._integrity_ok, missing_tables=() if self._integrity_ok else ("inet x",)
        )
        tor = TorHealth(
            socks=PortHealth("socks", 9050, self._tor_ok),
            trans=PortHealth("trans", 9040, self._tor_ok),
            dns=PortHealth("dns", 5353, self._tor_ok),
            circuit_established=self._tor_ok,
            control_ok=self._tor_ok,
        )
        from tor_guard.monitor.checks import CheckLevel, CheckResult

        results = (CheckResult("x", CheckLevel.OK if self._integrity_ok else CheckLevel.FAIL, ""),)
        return HealthSnapshot(integrity=integrity, tor=tor, results=results)


class FakeFirewall:
    def __init__(self):
        self.reapplied = 0
        self.emergency = 0

    def apply_protected(self, params):
        self.reapplied += 1

    def emergency_lock(self):
        self.emergency += 1


def _daemon(tmp_path, integrity_ok, tor_ok, restart_calls):
    cfg = parse_config("mode: strict")
    params = RulesetParams(mode=cfg.mode, tor_uid=107, trans_port=9040, dns_port=5353)
    fw = FakeFirewall()
    daemon = MonitorDaemon(
        cfg,
        FakeChecker(integrity_ok, tor_ok),
        fw,
        params,
        StateStore(tmp_path / "state.json"),
        restart_tor=lambda: restart_calls.append(1),
        sleep=lambda _: None,
    )
    return daemon, fw


def test_integrity_loss_reapplies_firewall(tmp_path):
    restarts = []
    daemon, fw = _daemon(tmp_path, integrity_ok=False, tor_ok=True, restart_calls=restarts)
    daemon.tick()
    assert fw.reapplied == 1  # invariant I10


def test_tor_down_restarts_but_never_unlocks(tmp_path):
    restarts = []
    daemon, fw = _daemon(tmp_path, integrity_ok=True, tor_ok=False, restart_calls=restarts)
    daemon.tick()
    assert restarts == [1]  # Tor restarted
    assert fw.reapplied == 0  # firewall untouched (invariant I11)
    # firewall up but tor down => LOCKED, never open
    store = StateStore(tmp_path / "state.json")
    assert store.load().protection is ProtectionState.LOCKED


def test_healthy_marks_protected(tmp_path):
    restarts = []
    daemon, _ = _daemon(tmp_path, integrity_ok=True, tor_ok=True, restart_calls=restarts)
    daemon.tick()
    store = StateStore(tmp_path / "state.json")
    assert store.load().protection is ProtectionState.PROTECTED


def test_recovery_never_unlocks(tmp_path):
    restarts = []
    daemon, _fw = _daemon(tmp_path, integrity_ok=False, tor_ok=False, restart_calls=restarts)
    daemon.tick()
    store = StateStore(tmp_path / "state.json")
    # even with everything broken, state is LOCKED, never UNLOCKED
    assert store.load().protection is ProtectionState.LOCKED
