"""Installation manifest: a hashed record of every file Tor Guard owns.

The uninstaller uses the manifest to remove *only* files Tor Guard created or
modified — never unrelated administrator configuration (requirement §13).
"""

from __future__ import annotations

import hashlib
import json
from dataclasses import asdict, dataclass, field
from datetime import UTC, datetime
from pathlib import Path

from ..constants import APP_VERSION, MANIFEST_PATH


@dataclass(frozen=True)
class ManifestEntry:
    path: str
    sha256: str
    mode: int
    owned: bool  # True: created by us (safe to remove); False: we modified it


@dataclass
class Manifest:
    version: str = APP_VERSION
    created_at: str = field(default_factory=lambda: datetime.now(UTC).isoformat())
    entries: list[ManifestEntry] = field(default_factory=list)

    def record(self, path: Path, *, owned: bool) -> ManifestEntry:
        digest = _hash_file(path)
        mode = path.stat().st_mode & 0o777 if path.exists() else 0
        entry = ManifestEntry(str(path), digest, mode, owned)
        self.entries.append(entry)
        return entry

    def to_json(self) -> str:
        return json.dumps(
            {
                "version": self.version,
                "created_at": self.created_at,
                "entries": [asdict(e) for e in self.entries],
            },
            indent=2,
            sort_keys=True,
        )

    @classmethod
    def from_json(cls, text: str) -> Manifest:
        raw = json.loads(text)
        manifest = cls(
            version=raw.get("version", APP_VERSION), created_at=raw.get("created_at", "")
        )
        manifest.entries = [ManifestEntry(**e) for e in raw.get("entries", [])]
        return manifest

    def save(self, path: Path = MANIFEST_PATH) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(self.to_json(), encoding="utf-8")
        try:
            path.chmod(0o600)
        except OSError:
            pass

    @classmethod
    def load(cls, path: Path = MANIFEST_PATH) -> Manifest | None:
        try:
            return cls.from_json(path.read_text(encoding="utf-8"))
        except (OSError, ValueError):
            return None


def _hash_file(path: Path) -> str:
    if not path.exists():
        return ""
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(65536), b""):
            digest.update(chunk)
    return digest.hexdigest()


__all__ = ["Manifest", "ManifestEntry"]
