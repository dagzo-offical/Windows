from __future__ import annotations

import pytest

from tor_guard.exceptions import DependencyError, SubprocessError
from tor_guard.subprocess_runner import SubprocessRunner


def test_runs_and_captures():
    result = SubprocessRunner().run(["true"])
    assert result.ok and result.returncode == 0


def test_captures_stdout():
    result = SubprocessRunner().run(["printf", "hello"])
    assert result.stdout == "hello"


def test_nonzero_raises_when_check():
    with pytest.raises(SubprocessError):
        SubprocessRunner().run(["false"])


def test_nonzero_ok_when_no_check():
    result = SubprocessRunner().run(["false"], check=False)
    assert not result.ok


def test_missing_binary_is_dependency_error():
    with pytest.raises(DependencyError):
        SubprocessRunner().run(["this-binary-does-not-exist-xyz"])


def test_empty_argv_rejected():
    with pytest.raises(SubprocessError):
        SubprocessRunner().run([])


def test_timeout(monkeypatch):
    with pytest.raises(SubprocessError, match="vaqt tugadi"):
        SubprocessRunner().run(["sleep", "5"], timeout=0.1)
