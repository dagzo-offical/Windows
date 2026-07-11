"""Tor daemon and configuration management.

Responsibilities:
  * confirm Tor is installed and the service account exists;
  * render a Tor Guard drop-in torrc fragment with the required listeners
    (SOCKSPort, TransPort, DNSPort, ControlPort + cookie auth);
  * start/restart Tor via systemd *after* the firewall lock is in place.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from ..config import Config
from ..constants import LOOPBACK4, UNIT_TOR
from ..exceptions import DependencyError, TorError
from ..logging_config import get_logger
from ..privileges import resolve_uid
from ..services import SystemdManager
from ..subprocess_runner import CommandRunner, SubprocessRunner, which

_log = get_logger("tor.manager")

TORRC_DROPIN = Path("/etc/tor/torrc.d/10-tor-guard.conf")
TORRC_MAIN = Path("/etc/tor/torrc")


@dataclass(frozen=True)
class TorPorts:
    socks: int
    trans: int
    dns: int
    control: int


def render_torrc(config: Config) -> str:
    """Render the Tor Guard torrc fragment from validated config."""
    lb = LOOPBACK4
    return (
        "# Managed by Tor Guard — do not edit; regenerated on reload.\n"
        f"User {config.tor_user}\n"
        f"SocksPort {lb}:{config.socks_port}\n"
        f"TransPort {lb}:{config.trans_port} IsolateClientAddr IsolateClientProtocol\n"
        f"DNSPort {lb}:{config.dns_port}\n"
        f"ControlPort {lb}:{config.control_port}\n"
        "CookieAuthentication 1\n"
        "CookieAuthFileGroupReadable 1\n"
        "AutomapHostsOnResolve 1\n"
        "VirtualAddrNetworkIPv4 10.192.0.0/10\n"
        "AvoidDiskWrites 1\n"
    )


class TorManager:
    def __init__(
        self,
        config: Config,
        runner: CommandRunner | None = None,
        systemd: SystemdManager | None = None,
        *,
        dropin_path: Path = TORRC_DROPIN,
        main_torrc: Path = TORRC_MAIN,
    ) -> None:
        self._config = config
        self._runner = runner or SubprocessRunner()
        self._systemd = systemd or SystemdManager(self._runner)
        self._dropin = dropin_path
        self._main = main_torrc

    @property
    def ports(self) -> TorPorts:
        c = self._config
        return TorPorts(c.socks_port, c.trans_port, c.dns_port, c.control_port)

    def ensure_installed(self) -> int:
        """Verify Tor binary + service account exist; return the Tor uid.

        Raises :class:`DependencyError` if Tor is not installed — the caller must
        then remain locked (failure table: "Tor not installed → remain locked").
        """
        if which("tor") is None:
            raise DependencyError(
                "Tor xizmati o‘rnatilmagan",
                hint="apt-get install tor",
            )
        return resolve_uid(self._config.tor_user)

    def write_config(self) -> Path:
        """Write the drop-in torrc fragment and ensure it is included."""
        self._dropin.parent.mkdir(parents=True, exist_ok=True)
        content = render_torrc(self._config)
        self._dropin.write_text(content, encoding="utf-8")
        try:
            self._dropin.chmod(0o644)
        except OSError:
            pass
        self._ensure_included()
        _log.info("Tor drop-in sozlamasi yozildi: %s", self._dropin)
        return self._dropin

    def _ensure_included(self) -> None:
        """Make sure the main torrc pulls in our drop-in directory."""
        include_line = f"%include {self._dropin.parent}/*.conf"
        try:
            existing = self._main.read_text(encoding="utf-8")
        except OSError:
            return
        if str(self._dropin.parent) in existing or "%include" in existing:
            return
        try:
            with self._main.open("a", encoding="utf-8") as handle:
                handle.write(f"\n{include_line}\n")
        except OSError as exc:
            _log.warning(
                "%s faylini drop-in’ni qo‘shish uchun yangilab bo‘lmadi: %s", self._main, exc
            )

    def verify_config(self) -> None:
        """Run ``tor --verify-config`` to reject a broken torrc before start."""
        result = self._runner.run(["tor", "--verify-config"], check=False)
        if not result.ok:
            raise TorError(
                f"tor o‘z sozlamalarini rad etdi: {result.stderr.strip() or result.stdout.strip()}"
            )

    def restart(self) -> None:
        self._systemd.restart(UNIT_TOR)

    def start(self) -> None:
        self._systemd.start(UNIT_TOR)

    def stop(self) -> None:
        """Stop Tor. NOTE: does not touch the firewall (invariant I3)."""
        self._systemd.stop(UNIT_TOR)

    def is_running(self) -> bool:
        return self._systemd.is_active(UNIT_TOR)


__all__ = ["TORRC_DROPIN", "TorManager", "TorPorts", "render_torrc"]
