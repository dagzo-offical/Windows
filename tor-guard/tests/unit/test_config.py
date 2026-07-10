from __future__ import annotations

import pytest

from tor_guard.config import parse_config
from tor_guard.exceptions import ConfigError
from tor_guard.state import Mode


def test_defaults_are_strict_and_safe():
    cfg = parse_config("")
    assert cfg.mode is Mode.STRICT
    assert cfg.allowed_lan_cidrs == ()
    assert cfg.socks_port == 9050
    assert cfg.auto_restart_tor is True


def test_unknown_key_rejected():
    with pytest.raises(ConfigError, match="unknown configuration keys"):
        parse_config("moode: strict")


@pytest.mark.parametrize("port", [0, -1, 70000, 99999])
def test_invalid_ports_rejected(port):
    with pytest.raises(ConfigError):
        parse_config(f"socks_port: {port}")


def test_ports_must_be_distinct():
    with pytest.raises(ConfigError, match="distinct"):
        parse_config("socks_port: 9040\ntrans_port: 9040")


def test_bool_is_not_a_port():
    with pytest.raises(ConfigError):
        parse_config("socks_port: true")


def test_strict_rejects_lan_cidrs():
    with pytest.raises(ConfigError, match="empty in strict"):
        parse_config("mode: strict\nallowed_lan_cidrs: ['192.168.0.0/24']")


def test_lan_compatible_requires_cidrs():
    with pytest.raises(ConfigError, match="requires at least one"):
        parse_config("mode: lan-compatible")


def test_lan_compatible_rejects_public_cidr():
    with pytest.raises(ConfigError, match="public CIDR"):
        parse_config("mode: lan-compatible\nallowed_lan_cidrs: ['8.8.8.0/24']")


def test_lan_compatible_rejects_ipv6_cidr():
    with pytest.raises(ConfigError, match="IPv4"):
        parse_config("mode: lan-compatible\nallowed_lan_cidrs: ['fd00::/8']")


def test_lan_compatible_valid():
    cfg = parse_config("mode: lan-compatible\nallowed_lan_cidrs: ['192.168.1.0/24']")
    assert cfg.mode is Mode.LAN_COMPATIBLE
    assert cfg.allowed_lan_cidrs == ("192.168.1.0/24",)


def test_invalid_cidr_rejected():
    with pytest.raises(ConfigError, match="invalid CIDR"):
        parse_config("mode: lan-compatible\nallowed_lan_cidrs: ['not-a-cidr']")


def test_invalid_log_level():
    with pytest.raises(ConfigError, match="invalid log_level"):
        parse_config("log_level: LOUD")


def test_non_https_endpoint_rejected():
    with pytest.raises(ConfigError, match="https"):
        parse_config("external_ip_endpoints: ['http://insecure.example']")


def test_malformed_yaml():
    with pytest.raises(ConfigError, match="malformed YAML"):
        parse_config("mode: [unclosed")


def test_root_must_be_mapping():
    with pytest.raises(ConfigError, match="must be a mapping"):
        parse_config("- just\n- a\n- list")


def test_invalid_tor_user():
    with pytest.raises(ConfigError, match="tor_user"):
        parse_config("tor_user: 'bad user!'")


def test_bad_interface_name():
    with pytest.raises(ConfigError, match="interface"):
        parse_config("interfaces: ['this-name-is-way-too-long-for-an-iface']")
