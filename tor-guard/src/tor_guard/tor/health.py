"""Tor listener and circuit health checks.

These confirm the loopback listeners (SOCKS/Trans/DNS) actually accept
connections and that Tor has an established circuit. A failed check never causes
a fallback to clearnet — it downgrades state to LOCKED/DEGRADED (fail-closed).
"""

from __future__ import annotations

import socket
from collections.abc import Callable
from dataclasses import dataclass

from ..constants import LOOPBACK4
from ..logging_config import get_logger
from .controller import TorController

_log = get_logger("tor.health")

# A connect() factory so tests can inject a fake without touching real sockets.
ConnectFn = Callable[[str, int, float], socket.socket]


def _default_connect(host: str, port: int, timeout: float) -> socket.socket:
    return socket.create_connection((host, port), timeout=timeout)


@dataclass(frozen=True)
class PortHealth:
    name: str
    port: int
    reachable: bool
    detail: str = ""


@dataclass(frozen=True)
class TorHealth:
    socks: PortHealth
    trans: PortHealth
    dns: PortHealth
    circuit_established: bool
    control_ok: bool

    @property
    def all_ports_ok(self) -> bool:
        return self.socks.reachable and self.trans.reachable and self.dns.reachable

    @property
    def healthy(self) -> bool:
        return self.all_ports_ok and self.circuit_established


class TorHealthChecker:
    def __init__(
        self,
        *,
        host: str = LOOPBACK4,
        timeout: float = 5.0,
        connect: ConnectFn = _default_connect,
        controller_factory: Callable[[], TorController] | None = None,
    ) -> None:
        self._host = host
        self._timeout = timeout
        self._connect = connect
        self._controller_factory = controller_factory

    def _probe_port(self, name: str, port: int) -> PortHealth:
        try:
            sock = self._connect(self._host, port, self._timeout)
            sock.close()
            return PortHealth(name, port, True)
        except OSError as exc:
            _log.warning("Tor %s porti %d ga ulanib bo‘lmadi: %s", name, port, exc)
            return PortHealth(name, port, False, str(exc))

    def check(self, *, socks_port: int, trans_port: int, dns_port: int) -> TorHealth:
        socks = self._probe_port("socks", socks_port)
        trans = self._probe_port("trans", trans_port)
        dns = self._probe_port("dns", dns_port)

        circuit = False
        control_ok = False
        if self._controller_factory is not None:
            try:
                controller = self._controller_factory()
                controller.authenticate()
                control_ok = True
                circuit = controller.circuit_established()
                controller.close()
            except Exception as exc:
                _log.warning("Tor boshqaruv holat tekshiruvi muvaffaqiyatsiz: %s", exc)

        return TorHealth(
            socks=socks,
            trans=trans,
            dns=dns,
            circuit_established=circuit,
            control_ok=control_ok,
        )


__all__ = ["PortHealth", "TorHealth", "TorHealthChecker"]
