"""Transactional rollback for installation/update.

A :class:`RollbackJournal` records reversible actions as they succeed. If any
step fails, :meth:`rollback` undoes them in reverse order. On a rollback we leave
the host in a *known* state — either the original configuration or a locked
firewall — never an unknown partial firewall (failure table: "installer
interrupted → roll back or leave known locked state").
"""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass, field

from ..logging_config import get_logger

_log = get_logger("install.rollback")


@dataclass
class _Action:
    description: str
    undo: Callable[[], None]


@dataclass
class RollbackJournal:
    actions: list[_Action] = field(default_factory=list)
    _rolled_back: bool = False

    def record(self, description: str, undo: Callable[[], None]) -> None:
        _log.debug("journal: %s", description)
        self.actions.append(_Action(description, undo))

    def commit(self) -> None:
        """Discard the journal after a successful operation."""
        self.actions.clear()

    def rollback(self) -> list[str]:
        """Undo recorded actions in reverse order; return any failures."""
        if self._rolled_back:
            return []
        self._rolled_back = True
        failures: list[str] = []
        for action in reversed(self.actions):
            try:
                _log.info("rolling back: %s", action.description)
                action.undo()
            except Exception as exc:
                failures.append(f"{action.description}: {exc}")
                _log.error("rollback step failed: %s", exc)
        self.actions.clear()
        return failures


__all__ = ["RollbackJournal"]
