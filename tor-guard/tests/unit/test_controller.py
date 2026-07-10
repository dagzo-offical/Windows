from __future__ import annotations

import pytest

from tor_guard.exceptions import TorError
from tor_guard.tor.controller import TorController


class FakeConn:
    def __init__(self, replies):
        self._replies = list(replies)
        self.sent = []

    def sendline(self, line):
        self.sent.append(line)

    def recv_reply(self):
        return self._replies.pop(0)

    def close(self):
        pass


def _factory(replies):
    def make(host, port, timeout):
        return FakeConn(replies)

    return make


def test_authenticate_and_getinfo(tmp_path):
    cookie = tmp_path / "control.authcookie"
    cookie.write_bytes(b"\x01\x02\x03\x04")
    replies = [
        (250, ["OK"]),  # AUTHENTICATE
        (250, ["status/circuit-established=1", "OK"]),  # GETINFO
    ]
    controller = TorController(cookie_paths=(cookie,), connection_factory=_factory(replies))
    controller.authenticate()
    assert controller.circuit_established() is True
    # cookie hex sent
    assert controller._conn.sent[0].startswith("AUTHENTICATE 01020304")


def test_auth_failure_raises(tmp_path):
    cookie = tmp_path / "c"
    cookie.write_bytes(b"\x00")
    controller = TorController(
        cookie_paths=(cookie,), connection_factory=_factory([(515, ["Bad auth"])])
    )
    with pytest.raises(TorError, match="authentication failed"):
        controller.authenticate()


def test_missing_cookie_raises(tmp_path):
    controller = TorController(cookie_paths=(tmp_path / "absent",))
    with pytest.raises(TorError, match="cookie not found"):
        controller.authenticate()
