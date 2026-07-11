"""Leak tests (disposable VM only, protected mode active).

Run AFTER `tor-guard start` has reached protected state. Each probe asserts the
fail-closed expectation. Real public IP is never asserted or printed.

Invoke with:
    sudo TOR_GUARD_DISPOSABLE_VM=1 pytest tests/leak -v
"""

from __future__ import annotations

import os

import pytest

from tor_guard.config import load_config
from tor_guard.network.dns import DnsValidator
from tor_guard.network.leak_tests import LeakTester, Severity
from tor_guard.network.routes import ExternalIPVerifier

_OPT_IN = os.environ.get("TOR_GUARD_DISPOSABLE_VM") == "1"

pytestmark = pytest.mark.skipif(
    not _OPT_IN,
    reason="destructive leak tests: set TOR_GUARD_DISPOSABLE_VM=1 in a disposable VM",
)


@pytest.fixture(scope="module")
def tester() -> LeakTester:
    config = load_config()
    verifier = ExternalIPVerifier(config.external_ip_endpoints, timeout=config.health_timeout)
    return LeakTester(verifier, DnsValidator(), dns_port=config.dns_port)


@pytest.mark.leak
def test_no_critical_leaks(tester: LeakTester):
    report = tester.run_all()
    critical_failures = [
        r for r in report.results if not r.passed and r.severity is Severity.CRITICAL
    ]
    # Report names only, never observations that could carry an IP.
    assert not critical_failures, [r.name for r in critical_failures]


@pytest.mark.leak
def test_ipv6_blocked(tester: LeakTester):
    assert tester.probe_ipv6_tcp().passed


@pytest.mark.leak
def test_direct_dns_blocked(tester: LeakTester):
    assert tester.probe_direct_dns_udp().passed


@pytest.mark.leak
def test_external_udp_blocked(tester: LeakTester):
    assert tester.probe_external_udp().passed


@pytest.mark.leak
def test_quic_blocked(tester: LeakTester):
    assert tester.probe_quic().passed
