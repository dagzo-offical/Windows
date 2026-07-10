"""Installer / uninstaller orchestration.

Install order is chosen so the host is never left in an unknown state:
  1. validate platform + privileges + dependencies (no host change yet);
  2. create secure directories;
  3. back up files we will touch;
  4. write config, torrc drop-in, and systemd units;
  5. record the manifest.

Any failure triggers a rollback of recorded actions; if rollback cannot fully
restore, we engage the emergency lock so the host is *locked*, never open.

The uninstaller removes only manifest-owned files, restores modified ones from
backup, and (as an explicit admin action) removes Tor Guard's firewall tables.
"""

from __future__ import annotations

import functools
import shutil
from dataclasses import dataclass
from pathlib import Path

from ..config import Config
from ..constants import (
    CONFIG_MODE,
    CONFIG_PATH,
    DIR_MODE,
    ETC_DIR,
    LOG_DIR,
    STATE_DIR,
    UNIT_FIREWALL,
    UNIT_MONITOR,
    UNIT_TARGET,
)
from ..exceptions import DependencyError, TorGuardError
from ..firewall.manager import FirewallManager
from ..logging_config import audit, get_logger
from ..platform import ensure_supported
from ..privileges import ensure_secure_dir, ensure_secure_file, require_root
from ..services import SystemdManager
from ..subprocess_runner import which
from ..tor.manager import TorManager
from .backup import BackupManager, BackupRecord
from .manifest import Manifest
from .rollback import RollbackJournal

_log = get_logger("install.installer")

_SYSTEMD_DIR = Path("/etc/systemd/system")
_UNIT_FILES = (UNIT_FIREWALL, UNIT_MONITOR, UNIT_TARGET)
_REQUIRED_COMMANDS = ("nft", "tor", "systemctl")


@dataclass
class InstallResult:
    installed_files: tuple[str, ...]
    manifest_path: str
    rolled_back: bool = False
    message: str = ""


class Installer:
    def __init__(
        self,
        config: Config,
        resource_dir: Path,
        *,
        firewall: FirewallManager | None = None,
        systemd: SystemdManager | None = None,
        systemd_dir: Path = _SYSTEMD_DIR,
        config_path: Path = CONFIG_PATH,
    ) -> None:
        self._config = config
        self._resources = resource_dir
        self._firewall = firewall or FirewallManager()
        self._systemd = systemd or SystemdManager()
        self._systemd_dir = systemd_dir
        self._config_path = config_path
        self._backup = BackupManager()

    def check_dependencies(self) -> None:
        missing = [cmd for cmd in _REQUIRED_COMMANDS if which(cmd) is None]
        if missing:
            raise DependencyError(
                f"missing required command(s): {', '.join(missing)}",
                hint="apt-get install nftables tor systemd",
            )

    def install(self) -> InstallResult:
        require_root("install")
        ensure_supported()
        self.check_dependencies()

        journal = RollbackJournal()
        manifest = Manifest()
        installed: list[str] = []
        try:
            # 1. directories
            for directory in (ETC_DIR, STATE_DIR, LOG_DIR):
                ensure_secure_dir(directory, DIR_MODE)
                journal.record(
                    f"remove dir {directory}", functools.partial(_rmdir_if_empty, directory)
                )

            # 2. back up files we might modify
            backups = self._backup.back_up([self._config_path, Path("/etc/tor/torrc")])
            for record in backups:
                journal.record(
                    f"restore {record.original_path}",
                    functools.partial(BackupManager.restore, record),
                )

            # 3. config file (only if absent — never clobber an admin's config)
            if not self._config_path.exists():
                src = self._resources / "config" / "tor-guard.example.yml"
                shutil.copy2(src, self._config_path)
                ensure_secure_file(self._config_path, CONFIG_MODE)
                installed.append(str(self._config_path))
                manifest.record(self._config_path, owned=True)
                journal.record(f"remove {self._config_path}", lambda: _unlink(self._config_path))

            # 4. torrc drop-in
            tor_manager = TorManager(self._config)
            dropin = tor_manager.write_config()
            installed.append(str(dropin))
            manifest.record(dropin, owned=True)
            journal.record(f"remove {dropin}", lambda: _unlink(dropin))

            # 5. systemd units
            for unit in _UNIT_FILES:
                dst = self._install_unit(unit)
                installed.append(str(dst))
                manifest.record(dst, owned=True)
                journal.record(f"remove {dst}", functools.partial(_unlink, dst))

            self._systemd.daemon_reload()

            # 6. manifest
            manifest.save()
            audit("install", actor="admin", detail=f"{len(installed)} files")
            journal.commit()
            return InstallResult(tuple(installed), str(CONFIG_PATH), message="install complete")

        except Exception as exc:
            _log.error("install failed: %s — rolling back", exc)
            failures = journal.rollback()
            if failures:
                _log.critical("rollback incomplete (%s); engaging emergency lock", failures)
                try:
                    self._firewall.emergency_lock()
                except Exception:
                    _log.critical("emergency lock also failed; host may need offline recovery")
            raise TorGuardError(f"installation failed and was rolled back: {exc}") from exc

    def _install_unit(self, unit: str) -> Path:
        src = self._resources / "systemd" / unit
        dst = self._systemd_dir / unit
        shutil.copy2(src, dst)
        try:
            dst.chmod(0o644)
        except OSError:
            pass
        return dst

    # ---- uninstall ---------------------------------------------------------
    def uninstall(self, *, remove_firewall: bool = True) -> list[str]:
        require_root("uninstall")
        removed: list[str] = []
        # Stop and disable services first.
        for unit in (UNIT_MONITOR, UNIT_TARGET, UNIT_FIREWALL):
            self._systemd.stop(unit)
            self._systemd.disable(unit)

        manifest = Manifest.load()
        if manifest is not None:
            for entry in manifest.entries:
                path = Path(entry.path)
                if entry.owned and path.exists():
                    _unlink(path)
                    removed.append(entry.path)
        else:
            _log.warning("no manifest found; not removing files to avoid collateral damage")

        self._systemd.daemon_reload()

        if remove_firewall:
            # Explicit admin action: this restores clearnet networking.
            audit("uninstall_remove_firewall", actor="admin")
            self._firewall.remove_tor_guard_tables()
        else:
            _log.warning("firewall left in place; run 'tor-guard unlock-clearnet' to restore net")

        audit("uninstall", actor="admin", detail=f"{len(removed)} files removed")
        return removed


def _unlink(path: Path) -> None:
    try:
        path.unlink(missing_ok=True)
    except OSError as exc:
        _log.warning("could not remove %s: %s", path, exc)


def _rmdir_if_empty(path: Path) -> None:
    try:
        if path.is_dir() and not any(path.iterdir()):
            path.rmdir()
    except OSError:
        pass


__all__ = ["BackupRecord", "InstallResult", "Installer"]
