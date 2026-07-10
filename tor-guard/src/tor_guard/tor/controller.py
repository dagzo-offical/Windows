"""Minimal Tor control-protocol client with cookie authentication.

We use ControlPort cookie authentication (invariant 11: no plaintext secrets;
use protected control auth). The control cookie is a root-readable file created
by Tor; we hex-encode it for ``AUTHENTICATE``. The socket layer is injectable so
the protocol logic is unit-testable without a live Tor.
"""

from __future__ import annotations

import socket
from pathlib import Path
from typing import Protocol

from ..constants import DEFAULT_CONTROL_PORT, LOOPBACK4
from ..exceptions import TorError
from ..logging_config import get_logger

_log = get_logger("tor.controller")

_DEFAULT_COOKIE_PATHS = (
    Path("/run/tor/control.authcookie"),
    Path("/var/run/tor/control.authcookie"),
    Path("/var/lib/tor/control_auth_cookie"),
)


class ControlConnection(Protocol):
    """A line-oriented duplex connection to Tor's ControlPort."""

    def sendline(self, line: str) -> None: ...
    def recv_reply(self) -> tuple[int, list[str]]: ...
    def close(self) -> None: ...


class _SocketConnection:
    """Real TCP ControlPort connection."""

    def __init__(self, host: str, port: int, timeout: float) -> None:
        self._sock = socket.create_connection((host, port), timeout=timeout)
        self._buf = b""

    def sendline(self, line: str) -> None:
        self._sock.sendall(line.encode("ascii") + b"\r\n")

    def _readline(self) -> str:
        while b"\r\n" not in self._buf:
            chunk = self._sock.recv(4096)
            if not chunk:
                raise TorError("control connection closed unexpectedly")
            self._buf += chunk
        line, _, self._buf = self._buf.partition(b"\r\n")
        return line.decode("ascii", errors="replace")

    def recv_reply(self) -> tuple[int, list[str]]:
        """Read a full control reply. Returns (status_code, lines)."""
        lines: list[str] = []
        while True:
            raw = self._readline()
            if len(raw) < 4:
                raise TorError(f"malformed control reply: {raw!r}")
            code = int(raw[:3])
            separator = raw[3]
            lines.append(raw[4:])
            if separator == " ":  # final line of the reply
                return code, lines
            # '-' (mid) or '+' (data) lines continue

    def close(self) -> None:
        try:
            self._sock.close()
        except OSError:
            pass


def find_cookie(paths: tuple[Path, ...] = _DEFAULT_COOKIE_PATHS) -> Path | None:
    for path in paths:
        if path.is_file():
            return path
    return None


class TorController:
    def __init__(
        self,
        host: str = LOOPBACK4,
        port: int = DEFAULT_CONTROL_PORT,
        *,
        timeout: float = 10.0,
        cookie_paths: tuple[Path, ...] = _DEFAULT_COOKIE_PATHS,
        connection_factory: None | type[_SocketConnection] = None,
    ) -> None:
        self._host = host
        self._port = port
        self._timeout = timeout
        self._cookie_paths = cookie_paths
        self._factory = connection_factory or _SocketConnection
        self._conn: ControlConnection | None = None

    def _connect(self) -> ControlConnection:
        try:
            return self._factory(self._host, self._port, self._timeout)
        except OSError as exc:
            raise TorError(
                f"cannot reach Tor ControlPort {self._host}:{self._port}: {exc}"
            ) from exc

    def authenticate(self) -> None:
        cookie_path = find_cookie(self._cookie_paths)
        if cookie_path is None:
            raise TorError(
                "Tor control auth cookie not found",
                hint="ensure torrc has 'CookieAuthentication 1' and Tor is running",
            )
        try:
            cookie = cookie_path.read_bytes()
        except OSError as exc:
            raise TorError(f"cannot read control cookie {cookie_path}: {exc}") from exc
        conn = self._connect()
        self._conn = conn
        conn.sendline(f"AUTHENTICATE {cookie.hex()}")
        code, lines = conn.recv_reply()
        if code != 250:
            raise TorError(f"Tor control authentication failed ({code}): {' '.join(lines)}")
        _log.debug("authenticated to Tor control port")

    def getinfo(self, key: str) -> str:
        if self._conn is None:
            self.authenticate()
        assert self._conn is not None  # nosec B101  (type narrowing; authenticate() sets it)
        self._conn.sendline(f"GETINFO {key}")
        code, lines = self._conn.recv_reply()
        if code != 250:
            raise TorError(f"GETINFO {key} failed ({code}): {' '.join(lines)}")
        for line in lines:
            if line.startswith(f"{key}="):
                return line[len(key) + 1 :]
        return ""

    def bootstrap_phase(self) -> str:
        return self.getinfo("status/bootstrap-phase")

    def circuit_established(self) -> bool:
        return self.getinfo("status/circuit-established").strip() == "1"

    def close(self) -> None:
        if self._conn is not None:
            self._conn.close()
            self._conn = None

    def __enter__(self) -> TorController:
        self.authenticate()
        return self

    def __exit__(self, *exc: object) -> None:
        self.close()


__all__ = ["ControlConnection", "TorController", "find_cookie"]
