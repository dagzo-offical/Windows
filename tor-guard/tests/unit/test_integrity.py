from __future__ import annotations

from tests.conftest import FakeRunner
from tor_guard.firewall.integrity import IntegrityChecker

_GOOD_FILTER = """table inet tor_guard_filter {
  chain input { type filter hook input priority 0; policy drop; }
  chain forward { type filter hook forward priority 0; policy drop; }
  chain output { type filter hook output priority 0; policy drop; }
}"""
_GOOD_IP6 = """table ip6 tor_guard6 {
  chain input { type filter hook input priority 0; policy drop; }
  chain forward { type filter hook forward priority 0; policy drop; }
  chain output { type filter hook output priority 0; policy drop; }
}"""
_GOOD_NAT = (
    "table ip tor_guard_nat { chain output { type nat hook output priority -100; policy accept; } }"
)


def _runner(filter_dump=_GOOD_FILTER, ip6_dump=_GOOD_IP6, nat_dump=_GOOD_NAT):
    def handler(argv):
        joined = " ".join(argv)
        if "tor_guard_filter" in joined:
            return (0, filter_dump, "") if filter_dump is not None else (1, "", "No such table")
        if "tor_guard6" in joined:
            return (0, ip6_dump, "") if ip6_dump is not None else (1, "", "No such table")
        if "tor_guard_nat" in joined:
            return (0, nat_dump, "") if nat_dump is not None else (1, "", "No such table")
        return (0, "", "")

    return FakeRunner(handler=handler)


def test_intact_when_all_present_and_drop():
    report = IntegrityChecker(_runner()).check()
    assert report.ok
    assert "butunligi saqlangan" in report.summary


def test_missing_filter_table_detected():
    report = IntegrityChecker(_runner(filter_dump=None)).check()
    assert not report.ok
    assert any("tor_guard_filter" in t for t in report.missing_tables)


def test_weak_policy_detected():
    weak = _GOOD_FILTER.replace("policy drop", "policy accept")
    report = IntegrityChecker(_runner(filter_dump=weak)).check()
    assert not report.ok
    assert report.weak_policies


def test_missing_ip6_detected():
    report = IntegrityChecker(_runner(ip6_dump=None)).check()
    assert not report.ok
