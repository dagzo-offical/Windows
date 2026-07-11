"""Diagnostics bundle collector for bug reports (redacted).

Collects non-sensitive system facts and Tor Guard state into a text bundle.
Secrets and the host's real public IP are never included; all text passes
through the redactor before being written.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path

from ..constants import APP_VERSION
from ..logging_config import redact
from ..network.interfaces import list_interfaces
from ..platform import detect_platform
from ..state import StateStore
from ..subprocess_runner import CommandRunner, SubprocessRunner


@dataclass
class DiagnosticsReport:
    text: str

    def write(self, path: Path) -> Path:
        path.write_text(self.text, encoding="utf-8")
        try:
            path.chmod(0o600)
        except OSError:
            pass
        return path


class DiagnosticsCollector:
    def __init__(self, runner: CommandRunner | None = None) -> None:
        self._runner = runner or SubprocessRunner()

    def collect(self) -> DiagnosticsReport:
        lines: list[str] = []
        lines.append(f"# Tor Guard diagnostics — {datetime.now(UTC).isoformat()}")
        lines.append(f"version: {APP_VERSION}")

        info = detect_platform()
        lines.append(f"platform: {info.pretty_name} ({info.distro_id} {info.version_id})")
        lines.append(f"kernel: {info.kernel}")

        state = StateStore().load()
        lines.append(f"protection: {state.protection.value}")
        lines.append(f"mode: {state.mode.value}")
        lines.append(f"firewall_active: {state.firewall_active}")
        lines.append(f"tor_running: {state.tor_running}")

        lines.append("\n## interfaces")
        for iface in list_interfaces():
            flags = []
            if iface.is_bridge:
                flags.append("bridge")
            if iface.is_loopback:
                flags.append("loopback")
            lines.append(f"- {iface.name} up={iface.is_up} {' '.join(flags)}")

        lines.append("\n## nftables tables (names only)")
        result = self._runner.run(["nft", "list", "tables"], check=False)
        lines.append(result.stdout.strip() or "(none / nft unavailable)")

        text = redact("\n".join(lines)) + "\n"
        return DiagnosticsReport(text=text)


__all__ = ["DiagnosticsCollector", "DiagnosticsReport"]
