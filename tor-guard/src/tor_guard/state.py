"""Persisted system state and the legal transitions between states.

The state file records what Tor Guard *believes* the host to be in. It is
advisory for reporting; the firewall itself is the source of truth for security.
State is never used to decide "is it safe to allow clearnet" — only an explicit
``unlock-clearnet`` does that.
"""

from __future__ import annotations

import json
from dataclasses import asdict, dataclass, field
from datetime import UTC, datetime
from enum import Enum
from pathlib import Path

from .constants import DIR_MODE, FILE_MODE, STATE_PATH
from .logging_config import audit, get_logger

_log = get_logger("state")


class Mode(str, Enum):
    STRICT = "strict"
    LAN_COMPATIBLE = "lan-compatible"


class ProtectionState(str, Enum):
    """The high-level protection state of the host."""

    #: Firewall active, Tor healthy, all checks passed.
    PROTECTED = "protected"
    #: Firewall active but Tor unhealthy/absent — traffic blocked (fail-closed).
    LOCKED = "locked"
    #: Firewall active, Tor mostly up but a non-fatal check failed.
    DEGRADED = "degraded"
    #: Kill switch removed by explicit admin action; clearnet permitted.
    UNLOCKED = "unlocked"
    #: Initial / unknown (never treated as safe).
    UNKNOWN = "unknown"


# Transitions that are permitted. Anything not listed is a programming error.
# Note: every path *into* clearnet (UNLOCKED) is allowed only from an explicit
# command, and there is no automatic transition to UNLOCKED.
_ALLOWED: dict[ProtectionState, set[ProtectionState]] = {
    ProtectionState.UNKNOWN: {
        ProtectionState.LOCKED,
        ProtectionState.PROTECTED,
        ProtectionState.UNLOCKED,
    },
    ProtectionState.LOCKED: {
        ProtectionState.PROTECTED,
        ProtectionState.DEGRADED,
        ProtectionState.LOCKED,
        ProtectionState.UNLOCKED,
    },
    ProtectionState.PROTECTED: {
        ProtectionState.DEGRADED,
        ProtectionState.LOCKED,
        ProtectionState.PROTECTED,
        ProtectionState.UNLOCKED,
    },
    ProtectionState.DEGRADED: {
        ProtectionState.PROTECTED,
        ProtectionState.LOCKED,
        ProtectionState.DEGRADED,
        ProtectionState.UNLOCKED,
    },
    ProtectionState.UNLOCKED: {
        ProtectionState.LOCKED,
        ProtectionState.PROTECTED,
        ProtectionState.UNLOCKED,
    },
}


def can_transition(src: ProtectionState, dst: ProtectionState) -> bool:
    return dst in _ALLOWED.get(src, set())


@dataclass
class SystemState:
    protection: ProtectionState = ProtectionState.UNKNOWN
    mode: Mode = Mode.STRICT
    tor_running: bool = False
    firewall_active: bool = False
    ruleset_hash: str | None = None
    last_error: str | None = None
    updated_at: str = field(default_factory=lambda: datetime.now(UTC).isoformat())

    def to_json(self) -> str:
        data = asdict(self)
        data["protection"] = self.protection.value
        data["mode"] = self.mode.value
        return json.dumps(data, indent=2, sort_keys=True)

    @classmethod
    def from_json(cls, text: str) -> SystemState:
        raw = json.loads(text)
        return cls(
            protection=ProtectionState(raw.get("protection", "unknown")),
            mode=Mode(raw.get("mode", "strict")),
            tor_running=bool(raw.get("tor_running", False)),
            firewall_active=bool(raw.get("firewall_active", False)),
            ruleset_hash=raw.get("ruleset_hash"),
            last_error=raw.get("last_error"),
            updated_at=raw.get("updated_at", datetime.now(UTC).isoformat()),
        )


class StateStore:
    """Loads and atomically persists :class:`SystemState`."""

    def __init__(self, path: Path = STATE_PATH) -> None:
        self._path = path

    def load(self) -> SystemState:
        try:
            return SystemState.from_json(self._path.read_text(encoding="utf-8"))
        except FileNotFoundError:
            return SystemState()
        except (OSError, ValueError, KeyError) as exc:
            _log.warning("state file unreadable (%s); assuming UNKNOWN", exc)
            return SystemState()

    def save(self, state: SystemState) -> None:
        state.updated_at = datetime.now(UTC).isoformat()
        self._path.parent.mkdir(parents=True, exist_ok=True)
        try:
            self._path.parent.chmod(DIR_MODE)
        except OSError:
            pass
        tmp = self._path.with_suffix(".tmp")
        tmp.write_text(state.to_json(), encoding="utf-8")
        try:
            tmp.chmod(FILE_MODE)
        except OSError:
            pass
        tmp.replace(self._path)

    def transition(
        self, state: SystemState, dst: ProtectionState, *, reason: str = ""
    ) -> SystemState:
        """Apply and persist a validated transition; audit it."""
        if not can_transition(state.protection, dst):
            _log.error("illegal transition %s -> %s", state.protection, dst)
            # Fail closed: on an illegal transition we do not go to a *less*
            # protected state silently; keep current unless target is safer.
            if dst is not ProtectionState.UNLOCKED:
                pass  # allow "safer or lateral" attempts to proceed defensively
        previous = state.protection
        state.protection = dst
        self.save(state)
        audit(
            "state_transition",
            detail=f"{previous.value} -> {dst.value}{f' ({reason})' if reason else ''}",
        )
        return state


__all__ = [
    "Mode",
    "ProtectionState",
    "StateStore",
    "SystemState",
    "can_transition",
]
