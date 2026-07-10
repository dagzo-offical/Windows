from __future__ import annotations

from tor_guard.network.interfaces import bridge_interfaces, list_interfaces
from tor_guard.tor.health import TorHealthChecker


# --- interfaces -------------------------------------------------------------
def _make_iface(sysfs, name, operstate="up", bridge=False):
    d = sysfs / name
    d.mkdir(parents=True)
    (d / "operstate").write_text(operstate)
    if bridge:
        (d / "bridge").mkdir()


def test_lists_interfaces(tmp_path):
    _make_iface(tmp_path, "lo")
    _make_iface(tmp_path, "eth0")
    _make_iface(tmp_path, "docker0", bridge=True)
    names = {i.name for i in list_interfaces(tmp_path)}
    assert names == {"lo", "eth0", "docker0"}


def test_detects_bridges(tmp_path):
    _make_iface(tmp_path, "eth0")
    _make_iface(tmp_path, "docker0", bridge=True)
    _make_iface(tmp_path, "virbr0")  # by name prefix
    bridges = set(bridge_interfaces(tmp_path))
    assert "docker0" in bridges
    assert "virbr0" in bridges
    assert "eth0" not in bridges


def test_loopback_flag(tmp_path):
    _make_iface(tmp_path, "lo")
    lo = list_interfaces(tmp_path)[0]
    assert lo.is_loopback


def test_missing_sysfs_returns_empty(tmp_path):
    assert list_interfaces(tmp_path / "nope") == []


# --- Tor health -------------------------------------------------------------
def test_all_ports_reachable():
    class FakeSock:
        def close(self):
            pass

    def connect(host, port, timeout):
        return FakeSock()

    checker = TorHealthChecker(connect=connect)
    health = checker.check(socks_port=9050, trans_port=9040, dns_port=5353)
    assert health.all_ports_ok
    # no controller factory => circuit unknown => not "healthy"
    assert not health.healthy


def test_unreachable_port():
    def connect(host, port, timeout):
        raise OSError("connection refused")

    checker = TorHealthChecker(connect=connect)
    health = checker.check(socks_port=9050, trans_port=9040, dns_port=5353)
    assert not health.all_ports_ok
    assert not health.trans.reachable


def test_healthy_with_circuit():
    class FakeSock:
        def close(self):
            pass

    class FakeController:
        def authenticate(self):
            pass

        def circuit_established(self):
            return True

        def close(self):
            pass

    checker = TorHealthChecker(
        connect=lambda h, p, t: FakeSock(),
        controller_factory=FakeController,
    )
    health = checker.check(socks_port=9050, trans_port=9040, dns_port=5353)
    assert health.healthy
    assert health.control_ok


def test_control_failure_is_swallowed():
    class FakeSock:
        def close(self):
            pass

    class BadController:
        def authenticate(self):
            raise RuntimeError("no control")

        def close(self):
            pass

    checker = TorHealthChecker(
        connect=lambda h, p, t: FakeSock(),
        controller_factory=BadController,
    )
    health = checker.check(socks_port=9050, trans_port=9040, dns_port=5353)
    assert health.all_ports_ok
    assert not health.circuit_established  # never raised
