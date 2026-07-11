"""Shared test fixtures and fakes.

Fakes let us exercise security logic without root, systemd, Tor, or real
sockets. The real ``nft`` binary IS used where available to validate rulesets
(check mode only — never applied to the test host).
"""

from __future__ import annotations

import shutil
from collections.abc import Callable, Sequence
from dataclasses import dataclass, field

import pytest

from tor_guard.subprocess_runner import CommandResult


@dataclass
class FakeRunner:
    """A scriptable :class:`CommandRunner`.

    ``responses`` maps a substring of the joined argv to a
    ``(returncode, stdout, stderr)`` tuple. ``calls`` records every invocation.
    """

    responses: dict[str, tuple[int, str, str]] = field(default_factory=dict)
    default: tuple[int, str, str] = (0, "", "")
    calls: list[tuple[str, ...]] = field(default_factory=list)
    handler: Callable[[Sequence[str]], tuple[int, str, str]] | None = None

    def run(
        self,
        argv: Sequence[str],
        *,
        timeout: float = 30,
        check: bool = True,
        input_text: str | None = None,
    ) -> CommandResult:
        args = tuple(str(a) for a in argv)
        self.calls.append(args)
        joined = " ".join(args)
        if self.handler is not None:
            code, out, err = self.handler(args)
        else:
            code, out, err = self.default
            for key, value in self.responses.items():
                if key in joined:
                    code, out, err = value
                    break
        result = CommandResult(argv=args, returncode=code, stdout=out, stderr=err)
        if check and code != 0:
            from tor_guard.exceptions import SubprocessError

            raise SubprocessError(f"fake command failed: {joined}: {err}")
        return result

    def find(self, needle: str) -> list[tuple[str, ...]]:
        return [c for c in self.calls if needle in " ".join(c)]


@pytest.fixture
def fake_runner() -> FakeRunner:
    return FakeRunner()


@pytest.fixture
def have_nft() -> bool:
    return shutil.which("nft") is not None


@pytest.fixture
def tmp_state_path(tmp_path):
    return tmp_path / "state.json"
