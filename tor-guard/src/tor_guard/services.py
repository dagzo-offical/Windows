"""Thin, testable wrapper over ``systemctl``.

Deviation from the reference layout: a shared ``services`` module is used by both
``tor.manager`` and ``install.installer`` so systemd interaction lives in one
place. All calls go through the guarded subprocess runner.
"""

from __future__ import annotations

from dataclasses import dataclass

from .exceptions import TorGuardError
from .logging_config import get_logger
from .subprocess_runner import CommandRunner, SubprocessRunner

_log = get_logger("services")


@dataclass(frozen=True)
class UnitStatus:
    name: str
    active: bool
    enabled: bool
    substate: str


class SystemdManager:
    def __init__(self, runner: CommandRunner | None = None, systemctl: str = "systemctl") -> None:
        self._runner = runner or SubprocessRunner()
        self._systemctl = systemctl

    def _run(self, *args: str, check: bool = True) -> str:
        return self._runner.run([self._systemctl, *args], check=check).stdout.strip()

    def is_active(self, unit: str) -> bool:
        return (
            self._runner.run([self._systemctl, "is-active", unit], check=False).stdout.strip()
            == "active"
        )

    def is_enabled(self, unit: str) -> bool:
        return (
            self._runner.run([self._systemctl, "is-enabled", unit], check=False).stdout.strip()
            == "enabled"
        )

    def status(self, unit: str) -> UnitStatus:
        substate = self._runner.run(
            [self._systemctl, "show", "-p", "SubState", "--value", unit], check=False
        ).stdout.strip()
        return UnitStatus(
            name=unit,
            active=self.is_active(unit),
            enabled=self.is_enabled(unit),
            substate=substate,
        )

    def start(self, unit: str) -> None:
        _log.info("systemctl start %s", unit)
        self._run("start", unit)

    def stop(self, unit: str) -> None:
        _log.info("systemctl stop %s", unit)
        self._run("stop", unit, check=False)

    def restart(self, unit: str) -> None:
        _log.info("systemctl restart %s", unit)
        self._run("restart", unit)

    def enable(self, unit: str, *, now: bool = False) -> None:
        args = ["enable"] + (["--now"] if now else []) + [unit]
        self._run(*args)

    def disable(self, unit: str) -> None:
        self._run("disable", unit, check=False)

    def daemon_reload(self) -> None:
        self._run("daemon-reload")

    def ensure_active(self, unit: str) -> None:
        if not self.is_active(unit):
            raise TorGuardError(f"systemd birligi faol emas: {unit}")


__all__ = ["SystemdManager", "UnitStatus"]
