from __future__ import annotations

from typer.testing import CliRunner

from tor_guard.cli import app

runner = CliRunner()


def test_version():
    result = runner.invoke(app, ["version"])
    assert result.exit_code == 0
    assert "tor-guard" in result.stdout


def test_config_validate_ok(tmp_path):
    cfg = tmp_path / "c.yml"
    cfg.write_text("mode: strict\n")
    result = runner.invoke(app, ["config", "validate", "-c", str(cfg)])
    assert result.exit_code == 0
    assert "valid" in result.stdout


def test_config_validate_bad(tmp_path):
    cfg = tmp_path / "c.yml"
    cfg.write_text("mode: nonsense\n")
    result = runner.invoke(app, ["config", "validate", "-c", str(cfg)])
    assert result.exit_code != 0


def test_config_validate_missing_file(tmp_path):
    result = runner.invoke(app, ["config", "validate", "-c", str(tmp_path / "nope.yml")])
    assert result.exit_code != 0


def test_config_show(tmp_path):
    cfg = tmp_path / "c.yml"
    cfg.write_text("mode: strict\n")
    result = runner.invoke(app, ["config", "show", "-c", str(cfg)])
    assert result.exit_code == 0
    assert "mode" in result.output
    assert "STRICT" in result.output


def test_test_leaks_refuses_without_flag(tmp_path):
    cfg = tmp_path / "c.yml"
    cfg.write_text("mode: strict\n")
    result = runner.invoke(app, ["test-leaks", "-c", str(cfg)])
    assert result.exit_code != 0


def test_logs_no_file(monkeypatch, tmp_path):
    monkeypatch.setattr("tor_guard.constants.LOG_PATH", tmp_path / "absent.log")
    result = runner.invoke(app, ["logs"])
    assert result.exit_code == 0


def test_help_lists_commands():
    result = runner.invoke(app, ["--help"])
    assert result.exit_code == 0
    for cmd in ("start", "stop", "emergency-lock", "unlock-clearnet", "status"):
        assert cmd in result.stdout
