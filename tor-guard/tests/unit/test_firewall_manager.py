from __future__ import annotations

from pathlib import Path

import pytest

from tests.conftest import FakeRunner
from tor_guard.exceptions import FirewallError
from tor_guard.firewall.manager import FirewallManager
from tor_guard.firewall.models import RulesetParams
from tor_guard.firewall.validator import RulesetValidator
from tor_guard.state import Mode

PARAMS = RulesetParams(mode=Mode.STRICT, tor_uid=107, trans_port=9040, dns_port=5353)


def _manager(tmp_path: Path, runner: FakeRunner) -> FirewallManager:
    return FirewallManager(
        runner,
        RulesetValidator(runner),
        backup_dir=tmp_path / "backups",
        live_path=tmp_path / "active.nft",
    )


def test_apply_protected_is_atomic_single_nft_f(tmp_path):
    runner = FakeRunner()
    mgr = _manager(tmp_path, runner)
    mgr.apply_protected(PARAMS)
    # Exactly one apply transaction (nft -f), preceded by a check (nft -c -f).
    applies = [c for c in runner.calls if "-f" in c and "-c" not in c]
    checks = [c for c in runner.calls if "-c" in c and "-f" in c]
    assert len(applies) == 1
    assert len(checks) == 1
    assert not runner.find("flush ruleset")


def test_apply_rejected_when_validation_fails(tmp_path):
    runner = FakeRunner(responses={"-c -f": (1, "", "syntax error")})

    # handler distinguishes check vs apply
    def handler(argv):
        if "-c" in argv:
            return (1, "", "bad rule")
        return (0, "", "")

    runner.handler = handler
    mgr = _manager(tmp_path, runner)
    with pytest.raises(FirewallError, match="rejected"):
        mgr.apply_protected(PARAMS)
    # never reached apply
    assert not [c for c in runner.calls if "-f" in c and "-c" not in c]


def test_apply_failure_raises(tmp_path):
    def handler(argv):
        if "-c" in argv:
            return (0, "", "")
        if argv[:2] == ("nft", "-f") or (
            argv[0].endswith("nft") and "-f" in argv and "-c" not in argv
        ):
            return (1, "", "kernel rejected")
        return (0, "", "")

    runner = FakeRunner(handler=handler)
    mgr = _manager(tmp_path, runner)
    with pytest.raises(FirewallError, match="failed to apply"):
        mgr.apply_protected(PARAMS)


def test_emergency_lock_applies_without_tor(tmp_path):
    runner = FakeRunner()
    mgr = _manager(tmp_path, runner)
    ruleset = mgr.emergency_lock()
    assert "tor_guard_lock" in ruleset.text
    assert [c for c in runner.calls if "-f" in c and "-c" not in c]


def test_backup_current_writes_file(tmp_path):
    runner = FakeRunner(responses={"list ruleset": (0, "table inet x {}", "")})
    mgr = _manager(tmp_path, runner)
    path = mgr.backup_current()
    assert path.exists()
    assert "table inet x" in path.read_text()


def test_remove_tables_only_targets_our_tables(tmp_path):
    runner = FakeRunner(responses={"list table": (0, "", "")})
    mgr = _manager(tmp_path, runner)
    mgr.remove_tor_guard_tables()
    deletes = runner.find("delete table")
    names = {" ".join(c) for c in deletes}
    assert all("tor_guard" in n for n in names)
    assert not runner.find("flush ruleset")


def test_restore_missing_backup_raises(tmp_path):
    mgr = _manager(tmp_path, FakeRunner())
    with pytest.raises(FirewallError, match="backup not found"):
        mgr.restore_from_backup(tmp_path / "nope.nft")
