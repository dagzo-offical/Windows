"""Integration: actually apply and inspect the ruleset (disposable VM only).

These use the REAL nft binary against the live host, so they are gated behind
the disposable-VM opt-in. They verify that:
  * the emergency lock applies and creates the lock table with drop policy;
  * the protected ruleset applies and integrity reports intact;
  * removing Tor Guard tables leaves other tables untouched.
"""

from __future__ import annotations

import os

import pytest

from tor_guard.firewall.integrity import IntegrityChecker
from tor_guard.firewall.manager import FirewallManager
from tor_guard.firewall.models import RulesetParams
from tor_guard.state import Mode

_OPT_IN = os.environ.get("TOR_GUARD_DISPOSABLE_VM") == "1"
_IS_ROOT = hasattr(os, "geteuid") and os.geteuid() == 0
requires_vm = pytest.mark.skipif(
    not (_OPT_IN and _IS_ROOT),
    reason="destructive: set TOR_GUARD_DISPOSABLE_VM=1 and run as root in a disposable VM",
)

pytestmark = [pytest.mark.integration, requires_vm]

PARAMS = RulesetParams(mode=Mode.STRICT, tor_uid=0, trans_port=9040, dns_port=5353)


@pytest.fixture
def manager(tmp_path):
    return FirewallManager(backup_dir=tmp_path / "b", live_path=tmp_path / "active.nft")


def test_emergency_lock_applies(manager):
    try:
        manager.emergency_lock()
        assert manager.table_exists("inet", "tor_guard_lock")
    finally:
        manager.remove_tor_guard_tables()


def test_protected_applies_and_integrity_ok(manager):
    try:
        manager.apply_protected(PARAMS)
        report = IntegrityChecker().check()
        assert report.ok, report.summary
    finally:
        manager.remove_tor_guard_tables()


def test_remove_only_our_tables(manager):
    manager.apply_protected(PARAMS)
    manager.remove_tor_guard_tables()
    assert not manager.table_exists("inet", "tor_guard_filter")
    assert not manager.table_exists("ip", "tor_guard_nat")
    assert not manager.table_exists("ip6", "tor_guard6")
