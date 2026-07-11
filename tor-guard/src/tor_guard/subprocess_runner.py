"""The single, guarded gateway for running external programs.

Rules enforced here so no other module has to remember them:
  * never ``shell=True``;
  * argv is always a list of ``str`` (no interpolation of untrusted text);
  * an explicit timeout is mandatory (defaulted, never unbounded);
  * stdout and stderr are captured;
  * return codes are checked (unless ``check=False``);
  * a missing binary raises :class:`DependencyError`, not a traceback;
  * command lines are redacted before logging.
"""

from __future__ import annotations

import shutil
import subprocess
from collections.abc import Sequence
from dataclasses import dataclass
from typing import Protocol

from .constants import SUBPROCESS_DEFAULT_TIMEOUT
from .exceptions import DependencyError, SubprocessError
from .logging_config import get_logger, redact

_log = get_logger("subprocess")


@dataclass(frozen=True)
class CommandResult:
    """Outcome of a completed subprocess."""

    argv: tuple[str, ...]
    returncode: int
    stdout: str
    stderr: str

    @property
    def ok(self) -> bool:
        return self.returncode == 0


class CommandRunner(Protocol):
    """Injectable interface so callers can be tested with a fake runner."""

    def run(
        self,
        argv: Sequence[str],
        *,
        timeout: float = SUBPROCESS_DEFAULT_TIMEOUT,
        check: bool = True,
        input_text: str | None = None,
    ) -> CommandResult: ...


class SubprocessRunner:
    """Production :class:`CommandRunner` backed by :mod:`subprocess`."""

    def run(
        self,
        argv: Sequence[str],
        *,
        timeout: float = SUBPROCESS_DEFAULT_TIMEOUT,
        check: bool = True,
        input_text: str | None = None,
    ) -> CommandResult:
        if not argv:
            raise SubprocessError("bo‘sh buyruq")
        args = [str(a) for a in argv]

        program = args[0]
        # Resolve relative program names to an absolute path and fail cleanly if
        # the binary is absent, so callers get DependencyError not FileNotFound.
        resolved = program if "/" in program else shutil.which(program)
        if resolved is None:
            raise DependencyError(
                f"kerakli dastur topilmadi: {program}",
                hint=f"'{program}' ni ta’minlaydigan paketni o‘rnating",
            )
        args[0] = resolved

        _log.debug("exec: %s", redact(" ".join(args)))
        try:
            completed = subprocess.run(  # noqa: S603  (argv list, no shell)
                args,
                capture_output=True,
                text=True,
                timeout=timeout,
                input=input_text,
                check=False,
            )
        except subprocess.TimeoutExpired as exc:
            raise SubprocessError(
                f"buyruq {timeout}s dan keyin vaqt tugadi: {redact(program)}"
            ) from exc
        except OSError as exc:
            raise SubprocessError(f"bajarib bo‘lmadi {redact(program)}: {exc}") from exc

        result = CommandResult(
            argv=tuple(args),
            returncode=completed.returncode,
            stdout=completed.stdout or "",
            stderr=completed.stderr or "",
        )
        if check and not result.ok:
            raise SubprocessError(
                f"buyruq muvaffaqiyatsiz ({result.returncode}): {redact(program)}: "
                f"{redact(result.stderr.strip()) or '<stderr yo‘q>'}"
            )
        return result


def which(program: str) -> str | None:
    """Return the absolute path of *program* or ``None``."""
    return shutil.which(program)


__all__ = [
    "CommandResult",
    "CommandRunner",
    "SubprocessRunner",
    "which",
]
