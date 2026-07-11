"""Privilege and file-permission helpers.

Root is required only for state-changing operations (firewall, services). Query
commands (``status``, ``config show``) run unprivileged. We also centralise the
"is this path safe" checks so no module accepts a world-writable secret file.
"""

from __future__ import annotations

import os
import pwd
import stat
from pathlib import Path

from .exceptions import DependencyError, PrivilegeError

WORLD_WRITABLE = stat.S_IWOTH


def is_root() -> bool:
    return os.geteuid() == 0


def require_root(action: str) -> None:
    """Raise :class:`PrivilegeError` if not effectively root."""
    if not is_root():
        raise PrivilegeError(
            f"'{action}' root huquqlarini talab qiladi",
            hint=f"bajaring: sudo tor-guard {action}",
        )


def resolve_uid(username: str) -> int:
    """Return the numeric uid for *username* or raise :class:`DependencyError`.

    The Tor uid is a *stable* identity used in nftables rules (never a PID),
    per security invariant I5.
    """
    try:
        return pwd.getpwnam(username).pw_uid
    except KeyError as exc:
        raise DependencyError(
            f"'{username}' xizmat hisobi mavjud emas",
            hint="'tor' ni o‘rnating, u debian-tor foydalanuvchisini yaratadi",
        ) from exc


def assert_not_world_writable(path: Path) -> None:
    """Raise if *path* is world-writable (invariant I16)."""
    try:
        mode = path.stat().st_mode
    except OSError:
        return
    if mode & WORLD_WRITABLE:
        raise PrivilegeError(
            f"hamma yozishi mumkin bo‘lgan (world-writable) yo‘ldan foydalanish rad etildi: {path}",
            hint=f"chmod o-w {path}",
        )


def ensure_secure_dir(path: Path, mode: int = 0o700) -> None:
    """Create *path* if needed and enforce restrictive ownership/permissions."""
    path.mkdir(parents=True, exist_ok=True)
    try:
        path.chmod(mode)
        if is_root():
            os.chown(path, 0, 0)
    except OSError:
        # Non-fatal in unprivileged/test contexts; still verify not world-writable.
        pass
    assert_not_world_writable(path)


def ensure_secure_file(path: Path, mode: int = 0o600) -> None:
    """Enforce restrictive permissions on an existing file."""
    if not path.exists():
        return
    try:
        path.chmod(mode)
        if is_root():
            os.chown(path, 0, 0)
    except OSError:
        pass
    assert_not_world_writable(path)


__all__ = [
    "assert_not_world_writable",
    "ensure_secure_dir",
    "ensure_secure_file",
    "is_root",
    "require_root",
    "resolve_uid",
]
