"""``tor-guard`` command-line interface (Typer + Rich).

The CLI is intentionally thin: it parses arguments, builds the DI context, calls
the orchestrator/services, and renders results. All security logic lives in the
lower layers so it can be unit-tested without a terminal.
"""

from __future__ import annotations

import sys
from pathlib import Path

import typer
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

from . import __version__
from .config import Config, load_config, parse_config
from .constants import CONFIG_PATH, ExitCode
from .context import build_context
from .exceptions import TorGuardError
from .logging_config import audit, configure_logging
from .orchestrator import Orchestrator, StartReport, StepStatus
from .state import ProtectionState, StateStore

app = typer.Typer(
    name="tor-guard",
    help="Fail-closed system-wide Tor transparent-proxy kill switch.",
    no_args_is_help=True,
    add_completion=False,
)
config_app = typer.Typer(help="Configuration commands.")
app.add_typer(config_app, name="config")

console = Console()
err_console = Console(stderr=True)

_RESOURCE_DIR = Path(__file__).resolve().parents[2]  # repo root (config/, systemd/)


def _load(config_path: Path) -> Config:
    try:
        return load_config(config_path)
    except TorGuardError as exc:
        _fail(exc)
        raise  # unreachable; keeps type-checkers happy


def _fail(exc: TorGuardError) -> None:
    err_console.print(f"[bold red]error:[/] {exc.message}")
    if exc.hint:
        err_console.print(f"[dim]hint: {exc.hint}[/]")
    raise typer.Exit(exc.exit_code)


def _render_report(report: StartReport) -> None:
    table = Table(title="Tor Guard — start sequence", show_lines=False)
    table.add_column("step")
    table.add_column("status")
    table.add_column("detail", overflow="fold")
    palette = {
        StepStatus.OK: "[green]OK[/]",
        StepStatus.FAIL: "[bold red]FAIL[/]",
        StepStatus.SKIP: "[yellow]SKIP[/]",
        StepStatus.INFO: "[cyan]INFO[/]",
    }
    for step in report.steps:
        table.add_row(step.name, palette[step.status], step.detail)
    console.print(table)


@app.callback()
def _main(
    ctx: typer.Context,
    log_level: str = typer.Option("INFO", help="Console/file log level."),
) -> None:
    configure_logging(log_level)


@app.command()
def version() -> None:
    """Print the Tor Guard version."""
    console.print(f"tor-guard {__version__}")


# --- lifecycle --------------------------------------------------------------
@app.command()
def start(
    config: Path = typer.Option(CONFIG_PATH, "--config", "-c"),
    no_leak_checks: bool = typer.Option(False, help="Skip active leak probes."),
) -> None:
    """Apply the kill switch, start Tor, verify, and mark protected."""
    cfg = _load(config)
    orchestrator = Orchestrator(build_context(cfg))
    try:
        report = orchestrator.start(run_leak_checks=not no_leak_checks)
    except TorGuardError as exc:
        _fail(exc)
        return
    _render_report(report)
    if report.protected:
        console.print(
            Panel.fit("[bold green]PROTECTED[/] — traffic routed through Tor", border_style="green")
        )
    else:
        console.print(
            Panel.fit(
                f"[bold red]LOCKED[/] — clearnet blocked, not protected "
                f"(final: {report.final_state.value})",
                border_style="red",
            )
        )
        raise typer.Exit(ExitCode.LOCKED)


@app.command()
def stop(
    config: Path = typer.Option(CONFIG_PATH, "--config", "-c"),
    keep_tor: bool = typer.Option(False, help="Leave Tor running."),
) -> None:
    """Stop monitoring (and Tor). The firewall STAYS locked."""
    cfg = _load(config)
    orchestrator = Orchestrator(build_context(cfg))
    try:
        orchestrator.stop(stop_tor=not keep_tor)
    except TorGuardError as exc:
        _fail(exc)
    console.print(
        Panel.fit(
            "[bold yellow]Services stopped. Clearnet remains BLOCKED.[/]\n"
            "Run [bold]tor-guard unlock-clearnet[/] to restore direct networking.",
            border_style="yellow",
        )
    )


@app.command()
def restart(config: Path = typer.Option(CONFIG_PATH, "--config", "-c")) -> None:
    """Restart: re-apply firewall and Tor without an open window."""
    start(config=config, no_leak_checks=False)


@app.command()
def enable(config: Path = typer.Option(CONFIG_PATH, "--config", "-c")) -> None:
    """Enable Tor Guard systemd units (persist across reboot)."""
    cfg = _load(config)
    ctx = build_context(cfg)
    try:
        ctx.systemd.enable("tor-guard.target", now=False)
        console.print("[green]enabled[/] tor-guard.target (starts fail-closed at boot)")
    except TorGuardError as exc:
        _fail(exc)


@app.command()
def disable(config: Path = typer.Option(CONFIG_PATH, "--config", "-c")) -> None:
    """Disable systemd units. Does NOT unlock clearnet."""
    cfg = _load(config)
    ctx = build_context(cfg)
    ctx.systemd.disable("tor-guard.target")
    console.print("[yellow]disabled units. Firewall stays locked until unlock-clearnet.[/]")


# --- status / diagnostics ---------------------------------------------------
@app.command()
def status(config: Path = typer.Option(CONFIG_PATH, "--config", "-c")) -> None:
    """Show current protection state and mode."""
    state = StateStore().load()
    colour = {
        ProtectionState.PROTECTED: "green",
        ProtectionState.LOCKED: "red",
        ProtectionState.DEGRADED: "yellow",
        ProtectionState.UNLOCKED: "red",
        ProtectionState.UNKNOWN: "dim",
    }[state.protection]
    table = Table(show_header=False)
    table.add_row("protection", f"[{colour}]{state.protection.value.upper()}[/]")
    table.add_row("mode", state.mode.value)
    table.add_row("firewall active", str(state.firewall_active))
    table.add_row("tor running", str(state.tor_running))
    table.add_row("updated", state.updated_at)
    if state.last_error:
        table.add_row("last error", state.last_error)
    console.print(Panel(table, title="Tor Guard status", border_style=colour))


@app.command()
def doctor(config: Path = typer.Option(CONFIG_PATH, "--config", "-c")) -> None:
    """Run non-destructive health diagnostics."""
    from .diagnostics.doctor import Doctor, Status

    cfg = _load(config)
    report = Doctor(cfg).run()
    table = Table(title="tor-guard doctor")
    table.add_column("check")
    table.add_column("status")
    table.add_column("detail", overflow="fold")
    palette = {
        Status.OK: "[green]OK[/]",
        Status.FAIL: "[red]FAIL[/]",
        Status.WARN: "[yellow]WARN[/]",
        Status.INFO: "[cyan]INFO[/]",
    }
    for finding in report.findings:
        table.add_row(finding.check, palette[finding.status], finding.detail)
    console.print(table)
    if report.has_failures:
        raise typer.Exit(ExitCode.VERIFICATION_FAILED)


@app.command()
def verify(config: Path = typer.Option(CONFIG_PATH, "--config", "-c")) -> None:
    """Verify protection is intact without changing the firewall."""
    cfg = _load(config)
    report = Orchestrator(build_context(cfg)).verify()
    _render_report(report)
    if report.failed_steps:
        raise typer.Exit(ExitCode.VERIFICATION_FAILED)


@app.command(name="test-leaks")
def test_leaks(
    config: Path = typer.Option(CONFIG_PATH, "--config", "-c"),
    i_understand: bool = typer.Option(
        False, "--i-understand", help="Required: makes real network attempts."
    ),
) -> None:
    """Run the active leak-test suite (real network attempts; opt-in)."""
    if not i_understand:
        err_console.print(
            "[red]Refusing to run without --i-understand[/] "
            "(these probes make real outbound attempts)."
        )
        raise typer.Exit(ExitCode.GENERIC_ERROR)
    from .network.leak_tests import LeakTester

    cfg = _load(config)
    ctx = build_context(cfg)
    report = LeakTester(ctx.verifier, ctx.dns, dns_port=cfg.dns_port).run_all()
    table = Table(title="leak tests")
    table.add_column("probe")
    table.add_column("result")
    table.add_column("observation", overflow="fold")
    for result in report.results:
        colour = "green" if result.passed else "bold red"
        table.add_row(result.name, f"[{colour}]{result.status}[/]", result.observation)
    console.print(table)
    if report.leaked:
        console.print("[bold red]LEAK DETECTED[/]")
        raise typer.Exit(ExitCode.VERIFICATION_FAILED)


@app.command()
def logs(lines: int = typer.Option(50, "--lines", "-n")) -> None:
    """Show recent Tor Guard log lines."""
    from .constants import LOG_PATH

    if not LOG_PATH.exists():
        console.print("[dim]no log file yet[/]")
        return
    content = LOG_PATH.read_text(encoding="utf-8").splitlines()
    for line in content[-lines:]:
        console.print(line)


# --- firewall lock / unlock -------------------------------------------------
@app.command(name="emergency-lock")
def emergency_lock() -> None:
    """Immediately apply the most restrictive lockdown (works without Tor)."""
    from .firewall.manager import FirewallManager

    try:
        FirewallManager().emergency_lock()
    except TorGuardError as exc:
        _fail(exc)
    console.print(
        Panel.fit(
            "[bold red]EMERGENCY LOCK ENGAGED[/] — all egress dropped except loopback",
            border_style="red",
        )
    )


@app.command(name="unlock-clearnet")
def unlock_clearnet(
    backup: Path | None = typer.Option(None, "--backup", help="Verified backup to restore."),
    yes: bool = typer.Option(False, "--yes", help="Skip the interactive confirmation."),
) -> None:
    """Restore direct networking. SEPARATE, EXPLICIT, AUDITED action."""
    from .firewall.manager import FirewallManager

    err_console.print(
        Panel.fit(
            "[bold red]WARNING[/]: this restores DIRECT clearnet networking.\n"
            "Your real IP and DNS will no longer be forced through Tor.",
            border_style="red",
        )
    )
    if not yes and not typer.confirm("Proceed with restoring clearnet?"):
        console.print("aborted")
        raise typer.Exit(ExitCode.OK)

    manager = FirewallManager()
    audit("unlock_clearnet_requested", actor="admin")
    try:
        if backup is not None:
            manager.restore_from_backup(backup)
        else:
            manager.remove_tor_guard_tables()
    except TorGuardError as exc:
        _fail(exc)

    state = StateStore().load()
    StateStore().transition(state, ProtectionState.UNLOCKED, reason="unlock-clearnet")
    console.print(
        Panel.fit(
            "[bold]clearnet restored[/] — Tor Guard is no longer protecting egress",
            border_style="yellow",
        )
    )


@app.command()
def reload(config: Path = typer.Option(CONFIG_PATH, "--config", "-c")) -> None:
    """Re-render config/torrc and re-apply the firewall atomically."""
    cfg = _load(config)
    ctx = build_context(cfg)
    try:
        ctx.tor.write_config()
        ctx.firewall.apply_protected(ctx.ruleset_params())
        console.print("[green]reloaded[/] firewall + Tor config (atomic; no open window)")
    except TorGuardError as exc:
        _fail(exc)


# --- install / uninstall ----------------------------------------------------
@app.command()
def install(
    config: Path = typer.Option(CONFIG_PATH, "--config", "-c"),
    resource_dir: Path = typer.Option(_RESOURCE_DIR, help="Repo dir with config/ and systemd/."),
) -> None:
    """Install directories, config, torrc drop-in, and systemd units."""
    from .install.installer import Installer

    # Load config if present, else use safe defaults for the installer.
    try:
        cfg = load_config(config)
    except TorGuardError:
        cfg = parse_config("mode: strict")
    try:
        result = Installer(cfg, resource_dir).install()
    except TorGuardError as exc:
        _fail(exc)
        return
    console.print(f"[green]installed[/] {len(result.installed_files)} file(s)")
    for path in result.installed_files:
        console.print(f"  • {path}")


@app.command()
def uninstall(
    config: Path = typer.Option(CONFIG_PATH, "--config", "-c"),
    keep_firewall: bool = typer.Option(False, help="Do not remove the firewall lock."),
) -> None:
    """Remove Tor Guard files. Removes the firewall unless --keep-firewall."""
    from .install.installer import Installer

    try:
        cfg = load_config(config)
    except TorGuardError:
        cfg = parse_config("mode: strict")
    removed = Installer(cfg, _RESOURCE_DIR).uninstall(remove_firewall=not keep_firewall)
    console.print(f"[green]removed[/] {len(removed)} file(s)")


# --- config subcommands -----------------------------------------------------
@config_app.command("show")
def config_show(config: Path = typer.Option(CONFIG_PATH, "--config", "-c")) -> None:
    """Print the effective, validated configuration."""
    cfg = _load(config)
    table = Table(show_header=False)
    for key, value in vars(cfg).items():
        table.add_row(key, str(value))
    console.print(Panel(table, title=f"config: {config}"))


@config_app.command("validate")
def config_validate(config: Path = typer.Option(CONFIG_PATH, "--config", "-c")) -> None:
    """Validate configuration and report the first error, if any."""
    try:
        load_config(config)
    except TorGuardError as exc:
        _fail(exc)
    console.print("[green]configuration valid[/]")


def main() -> int:
    try:
        app()
    except SystemExit as exc:  # Typer/Click uses SystemExit for exit codes
        return int(exc.code) if isinstance(exc.code, int) else 0
    return ExitCode.OK


if __name__ == "__main__":
    sys.exit(main())
