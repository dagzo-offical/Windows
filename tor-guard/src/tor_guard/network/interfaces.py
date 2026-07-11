"""Network interface enumeration and bridge/namespace discovery.

Used by diagnostics and the leak framework to warn about bypass surfaces
(Docker/libvirt bridges, veth pairs, extra namespaces) mentioned in the threat
model (T9/T10).
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from ..logging_config import get_logger

_log = get_logger("network.interfaces")

_SYS_CLASS_NET = Path("/sys/class/net")
_BRIDGE_PREFIXES = ("docker", "br-", "virbr", "lxcbr", "podman", "cni")


@dataclass(frozen=True)
class Interface:
    name: str
    is_up: bool
    is_bridge: bool
    is_loopback: bool


def list_interfaces(sysfs: Path = _SYS_CLASS_NET) -> list[Interface]:
    interfaces: list[Interface] = []
    if not sysfs.is_dir():
        return interfaces
    for entry in sorted(sysfs.iterdir()):
        name = entry.name
        operstate = _read(entry / "operstate")
        is_bridge = (entry / "bridge").is_dir() or name.startswith(_BRIDGE_PREFIXES)
        interfaces.append(
            Interface(
                name=name,
                is_up=operstate in {"up", "unknown"},
                is_bridge=is_bridge,
                is_loopback=name == "lo",
            )
        )
    return interfaces


def bridge_interfaces(sysfs: Path = _SYS_CLASS_NET) -> list[str]:
    return [i.name for i in list_interfaces(sysfs) if i.is_bridge]


def _read(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8").strip()
    except OSError:
        return ""


__all__ = ["Interface", "bridge_interfaces", "list_interfaces"]
