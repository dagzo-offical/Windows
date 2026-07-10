from __future__ import annotations

from tests.conftest import FakeRunner
from tor_guard.config import parse_config
from tor_guard.services import SystemdManager
from tor_guard.tor.manager import render_torrc


def test_is_active_parsing():
    runner = FakeRunner(responses={"is-active": (0, "active", "")})
    assert SystemdManager(runner).is_active("tor.service")


def test_is_active_false():
    runner = FakeRunner(responses={"is-active": (3, "inactive", "")})
    assert not SystemdManager(runner).is_active("tor.service")


def test_stop_does_not_raise_on_failure():
    runner = FakeRunner(default=(1, "", "not loaded"))
    SystemdManager(runner).stop("x.service")  # check=False internally


def test_render_torrc_has_loopback_listeners():
    cfg = parse_config("mode: strict")
    torrc = render_torrc(cfg)
    assert "SocksPort 127.0.0.1:9050" in torrc
    assert "TransPort 127.0.0.1:9040" in torrc
    assert "DNSPort 127.0.0.1:5353" in torrc
    assert "ControlPort 127.0.0.1:9051" in torrc
    assert "CookieAuthentication 1" in torrc


def test_render_torrc_uses_config_user():
    cfg = parse_config("mode: strict\ntor_user: custom-tor")
    assert "User custom-tor" in render_torrc(cfg)
