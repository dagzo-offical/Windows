from __future__ import annotations

import shutil
import subprocess

import pytest

from tor_guard.firewall.generator import (
    expected_table_names,
    generate_emergency,
    generate_protected,
)
from tor_guard.firewall.models import RulesetParams
from tor_guard.state import Mode

STRICT = RulesetParams(mode=Mode.STRICT, tor_uid=107, trans_port=9040, dns_port=5353)
LAN = RulesetParams(
    mode=Mode.LAN_COMPATIBLE,
    tor_uid=107,
    trans_port=9040,
    dns_port=5353,
    allowed_lan_cidrs=("192.168.1.0/24",),
)


def _nft_check(text: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["nft", "-c", "-f", "/dev/stdin"], input=text, text=True, capture_output=True
    )


def test_default_drop_policy():
    text = generate_protected(STRICT).text
    # every filter base chain must be policy drop (invariant I1)
    assert text.count("policy drop") >= 5


def test_tor_uid_exception_is_by_uid_not_pid():
    text = generate_protected(STRICT).text
    assert "meta skuid 107 accept" in text
    assert "pid" not in text.lower()


def test_dns_redirect():
    text = generate_protected(STRICT).text
    assert "udp dport 53 redirect to :5353" in text
    assert "tcp dport 53 redirect to :5353" in text
    # direct DNS also explicitly dropped in filter output
    assert "tcp dport 53 drop" in text
    assert "udp dport 53 drop" in text


def test_tcp_redirect_to_transport():
    assert "meta l4proto tcp redirect to :9040" in generate_protected(STRICT).text


def test_ipv6_blocked():
    text = generate_protected(STRICT).text
    assert "table ip6 tor_guard6" in text
    assert "meta nfproto ipv6 drop" in text


def test_udp_blocked():
    assert "meta l4proto udp drop" in generate_protected(STRICT).text


def test_strict_drops_local_nets():
    text = generate_protected(STRICT).text
    assert "10.0.0.0/8" in text and "192.168.0.0/16" in text
    assert "no direct local-net egress" in text


def test_lan_mode_accepts_configured_cidr():
    text = generate_protected(LAN).text
    assert "ip daddr { 192.168.1.0/24 } accept" in text
    assert "no direct local-net egress" not in text


def test_atomic_replace_idiom_present():
    text = generate_protected(STRICT).text
    # add -> delete -> define, so other tables are never flushed
    assert "add table ip tor_guard_nat" in text
    assert "delete table ip tor_guard_nat" in text
    assert "flush ruleset" not in text


def test_forward_chain_blocks_bypass():
    text = generate_protected(STRICT).text
    assert "hook forward" in text
    # forward policy drop => containers/VMs cannot bypass
    assert text.count("hook forward") == 2  # inet + ip6


def test_emergency_ruleset_no_tor():
    text = generate_emergency().text
    assert "tor_guard_lock" in text
    assert "policy drop" in text
    assert "9040" not in text  # no dependency on Tor ports


def test_deterministic_hash():
    a = generate_protected(STRICT)
    b = generate_protected(STRICT)
    assert a.sha256 == b.sha256
    assert generate_protected(LAN).sha256 != a.sha256


def test_expected_tables():
    assert expected_table_names(Mode.STRICT)


def test_invalid_uid_rejected():
    with pytest.raises(ValueError):
        RulesetParams(mode=Mode.STRICT, tor_uid=-5, trans_port=9040, dns_port=5353)


@pytest.mark.skipif(shutil.which("nft") is None, reason="nft not installed")
@pytest.mark.parametrize("params", [STRICT, LAN])
def test_generated_ruleset_passes_nft_check(params):
    result = _nft_check(generate_protected(params).text)
    assert result.returncode == 0, result.stderr


@pytest.mark.skipif(shutil.which("nft") is None, reason="nft not installed")
def test_emergency_passes_nft_check():
    result = _nft_check(generate_emergency().text)
    assert result.returncode == 0, result.stderr
