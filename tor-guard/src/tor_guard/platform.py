"""Platform validation: OS, init system, and firewall backend.

The installer and every state-changing command call :func:`ensure_supported`
first. On an unsupported platform we refuse to touch the host (fail-closed by
inaction).
"""

from __future__ import annotations

import os
import platform as _platform
from dataclasses import dataclass
from pathlib import Path

from .constants import SUPPORTED_DISTROS
from .exceptions import PlatformError
from .subprocess_runner import which

_OS_RELEASE = Path("/etc/os-release")


@dataclass(frozen=True)
class PlatformInfo:
    distro_id: str
    version_id: str
    pretty_name: str
    kernel: str

    @property
    def is_linux(self) -> bool:
        return self.kernel.lower().startswith("linux") or os.name == "posix"


def _parse_os_release(text: str) -> dict[str, str]:
    data: dict[str, str] = {}
    for raw in text.splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        data[key.strip()] = value.strip().strip('"').strip("'")
    return data


def detect_platform(os_release_path: Path = _OS_RELEASE) -> PlatformInfo:
    """Read ``/etc/os-release`` and return a :class:`PlatformInfo`."""
    try:
        text = os_release_path.read_text(encoding="utf-8")
    except OSError as exc:
        raise PlatformError(
            f"cannot read {os_release_path}: {exc}",
            hint="Tor Guard supports systemd-based Ubuntu/Debian/Kali only",
        ) from exc
    data = _parse_os_release(text)
    return PlatformInfo(
        distro_id=data.get("ID", "").lower(),
        version_id=data.get("VERSION_ID", ""),
        pretty_name=data.get("PRETTY_NAME", data.get("NAME", "unknown")),
        kernel=_platform.system(),
    )


def is_supported(info: PlatformInfo) -> bool:
    for distro, version_prefix in SUPPORTED_DISTROS:
        if info.distro_id != distro:
            continue
        if version_prefix is None or info.version_id.startswith(version_prefix):
            return True
    return False


def has_systemd() -> bool:
    return Path("/run/systemd/system").is_dir() or which("systemctl") is not None


def has_nftables() -> bool:
    return which("nft") is not None


def ensure_supported(info: PlatformInfo | None = None) -> PlatformInfo:
    """Raise :class:`PlatformError` unless OS + systemd + nftables are present."""
    info = info or detect_platform()
    if not info.is_linux:
        raise PlatformError(f"Tor Guard requires Linux, found {info.kernel}")
    if not is_supported(info):
        supported = ", ".join(f"{d} {v or '(any)'}" for d, v in SUPPORTED_DISTROS)
        raise PlatformError(
            f"unsupported OS: {info.pretty_name} ({info.distro_id} {info.version_id})",
            hint=f"supported: {supported}",
        )
    if not has_systemd():
        raise PlatformError("systemd not detected; Tor Guard requires systemd")
    if not has_nftables():
        raise PlatformError(
            "nftables (nft) not found",
            hint="install the 'nftables' package",
        )
    return info


__all__ = [
    "PlatformInfo",
    "detect_platform",
    "ensure_supported",
    "has_nftables",
    "has_systemd",
    "is_supported",
]
