"""Timestamped backups of host files Tor Guard is about to change.

Each backup preserves content, records a SHA-256, and remembers the original
mode/uid/gid so a rollback can restore ownership faithfully (requirement §13).
"""

from __future__ import annotations

import hashlib
import json
import os
import shutil
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path

from ..constants import BACKUP_DIR, DIR_MODE
from ..exceptions import TorGuardError
from ..logging_config import get_logger
from ..privileges import ensure_secure_dir

_log = get_logger("install.backup")

_MIN_FREE_BYTES = 5 * 1024 * 1024  # refuse to back up with < 5 MiB free


@dataclass(frozen=True)
class BackupRecord:
    original_path: str
    backup_path: str
    sha256: str
    mode: int
    uid: int
    gid: int
    existed: bool


class BackupManager:
    def __init__(self, backup_dir: Path = BACKUP_DIR) -> None:
        self._root = backup_dir

    def _session_dir(self) -> Path:
        stamp = datetime.now(UTC).strftime("%Y%m%dT%H%M%SZ")
        path = self._root / stamp
        ensure_secure_dir(path, DIR_MODE)
        return path

    def _check_space(self, needed: int) -> None:
        ensure_secure_dir(self._root, DIR_MODE)
        usage = shutil.disk_usage(self._root)
        if usage.free < max(_MIN_FREE_BYTES, needed * 2):
            raise TorGuardError(f"zaxira uchun disk maydoni yetarli emas: {usage.free} bayt bo‘sh")

    def back_up(self, paths: list[Path]) -> list[BackupRecord]:
        session = self._session_dir()
        records: list[BackupRecord] = []
        total = sum(p.stat().st_size for p in paths if p.exists())
        self._check_space(total)
        for path in paths:
            records.append(self._back_up_one(path, session))
        (session / "backup-index.json").write_text(
            json.dumps([r.__dict__ for r in records], indent=2), encoding="utf-8"
        )
        _log.info("%d ta fayl zaxiralandi: %s", len(records), session)
        return records

    def _back_up_one(self, path: Path, session: Path) -> BackupRecord:
        if not path.exists():
            return BackupRecord(str(path), "", "", 0, 0, 0, existed=False)
        stat = path.stat()
        dest = session / (path.as_posix().strip("/").replace("/", "__"))
        shutil.copy2(path, dest)
        try:
            dest.chmod(0o600)
        except OSError:
            pass
        return BackupRecord(
            original_path=str(path),
            backup_path=str(dest),
            sha256=_hash(path),
            mode=stat.st_mode & 0o777,
            uid=stat.st_uid,
            gid=stat.st_gid,
            existed=True,
        )

    @staticmethod
    def restore(record: BackupRecord) -> None:
        """Restore one file from its backup, including mode and ownership."""
        original = Path(record.original_path)
        if not record.existed:
            # File did not exist before us; removing our version is the restore.
            if original.exists():
                original.unlink()
            return
        shutil.copy2(record.backup_path, original)
        try:
            original.chmod(record.mode)
            os.chown(original, record.uid, record.gid)
        except OSError as exc:
            _log.warning("%s uchun ruxsatlarni to‘liq tiklab bo‘lmadi: %s", original, exc)


def _hash(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(65536), b""):
            digest.update(chunk)
    return digest.hexdigest()


__all__ = ["BackupManager", "BackupRecord"]
