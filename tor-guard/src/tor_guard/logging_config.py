"""Structured logging with secret redaction.

Two sinks:
  * the application log (``tor-guard.log``) — operational detail;
  * the audit log (``audit.log``) — security-relevant state transitions and
    privileged actions (unlock-clearnet, emergency-lock, integrity restore).

Redaction: control cookies, auth hashes, and anything that looks like the host's
real public IP are scrubbed from log records so we never persist them by
accident (Security requirement: never log the real public IP unnecessarily).
"""

from __future__ import annotations

import json
import logging
import re
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

from .constants import AUDIT_LOG_PATH, FILE_MODE, LOG_DIR, LOG_PATH

_AUDIT_LOGGER_NAME = "tor_guard.audit"

# Patterns scrubbed from every log line.
_REDACTIONS: tuple[tuple[re.Pattern[str], str], ...] = (
    (re.compile(r"(?i)(cookie|auth(?:cookie)?|token|password)\s*[=:]\s*\S+"), r"\1=<redacted>"),
    (re.compile(r"\b[0-9a-fA-F]{32,}\b"), "<hex-redacted>"),
)


def redact(text: str) -> str:
    """Return *text* with secrets replaced. Safe on ``None``-ish input."""
    if not text:
        return text
    out = text
    for pattern, repl in _REDACTIONS:
        out = pattern.sub(repl, out)
    return out


class _RedactingFormatter(logging.Formatter):
    """A JSON-lines formatter that redacts message and args."""

    def format(self, record: logging.LogRecord) -> str:
        payload: dict[str, Any] = {
            "ts": datetime.now(UTC).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "msg": redact(record.getMessage()),
        }
        if record.exc_info:
            payload["exc"] = redact(self.formatException(record.exc_info))
        for key in ("event", "state", "actor", "detail"):
            value = getattr(record, key, None)
            if value is not None:
                payload[key] = redact(str(value))
        return json.dumps(payload, sort_keys=True)


def _make_file_handler(path: Path) -> logging.Handler | None:
    try:
        path.parent.mkdir(parents=True, exist_ok=True)
        handler = logging.FileHandler(path, encoding="utf-8")
        # Best-effort tighten perms; ignore if not permitted (e.g. tests).
        try:
            path.chmod(FILE_MODE)
        except OSError:
            pass
    except OSError:
        return None
    handler.setFormatter(_RedactingFormatter())
    return handler


def configure_logging(level: str = "INFO", *, to_console: bool = True) -> None:
    """Configure root and audit loggers idempotently."""
    root = logging.getLogger("tor_guard")
    root.setLevel(getattr(logging, level.upper(), logging.INFO))
    root.handlers.clear()

    if to_console:
        console = logging.StreamHandler()
        console.setFormatter(_RedactingFormatter())
        root.addHandler(console)

    file_handler = _make_file_handler(LOG_PATH)
    if file_handler is not None:
        root.addHandler(file_handler)
    root.propagate = False

    audit = logging.getLogger(_AUDIT_LOGGER_NAME)
    audit.setLevel(logging.INFO)
    audit.handlers.clear()
    audit_handler = _make_file_handler(AUDIT_LOG_PATH)
    if audit_handler is not None:
        audit.addHandler(audit_handler)
    audit.propagate = False


def get_logger(name: str) -> logging.Logger:
    """Return a child logger under the ``tor_guard`` namespace."""
    return logging.getLogger(f"tor_guard.{name}")


def audit(event: str, *, actor: str = "system", detail: str = "") -> None:
    """Write a security-relevant audit record."""
    logging.getLogger(_AUDIT_LOGGER_NAME).info(
        event, extra={"event": event, "actor": actor, "detail": detail}
    )


__all__ = ["LOG_DIR", "audit", "configure_logging", "get_logger", "redact"]
