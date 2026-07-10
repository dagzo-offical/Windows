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
    help=(
        "Butun tizim bo‘ylab Tor orqali yo‘naltiruvchi, "
        "fail-closed himoya vositasi (kill switch)."
    ),
    no_args_is_help=True,
    add_completion=False,
)
config_app = typer.Typer(help="Sozlamalar buyruqlari.")
app.add_typer(config_app, name="config")

console = Console()
err_console = Console(stderr=True)

_RESOURCE_DIR = Path(__file__).resolve().parents[2]  # repo root (config/, systemd/)

# Presentation-only labels (Uzbek). These map internal identifiers to display
# text; the underlying enum values and identifiers are unchanged.
_PROTECTION_LABELS = {
    ProtectionState.PROTECTED: "HIMOYALANGAN",
    ProtectionState.LOCKED: "BLOKLANGAN",
    ProtectionState.DEGRADED: "CHEKLANGAN",
    ProtectionState.UNLOCKED: "OCHILGAN",
    ProtectionState.UNKNOWN: "NOMA’LUM",
}


def _yesno(value: bool) -> str:
    return "Ha" if value else "Yo‘q"


def _load(config_path: Path) -> Config:
    try:
        return load_config(config_path)
    except TorGuardError as exc:
        _fail(exc)
        raise  # unreachable; keeps type-checkers happy


def _fail(exc: TorGuardError) -> None:
    err_console.print(f"[bold red]xatolik:[/] {exc.message}")
    if exc.hint:
        err_console.print(f"[dim]maslahat: {exc.hint}[/]")
    raise typer.Exit(exc.exit_code)


def _render_report(report: StartReport) -> None:
    table = Table(title="Tor Guard — ishga tushirish bosqichlari", show_lines=False)
    table.add_column("bosqich")
    table.add_column("holat")
    table.add_column("tafsilot", overflow="fold")
    palette = {
        StepStatus.OK: "[green]OK[/]",
        StepStatus.FAIL: "[bold red]XATO[/]",
        StepStatus.SKIP: "[yellow]O‘TKAZILDI[/]",
        StepStatus.INFO: "[cyan]MA’LUMOT[/]",
    }
    for step in report.steps:
        table.add_row(step.name, palette[step.status], step.detail)
    console.print(table)


@app.callback()
def _main(
    ctx: typer.Context,
    log_level: str = typer.Option("INFO", help="Konsol/fayl log darajasi."),
) -> None:
    configure_logging(log_level)


@app.command()
def version() -> None:
    """Tor Guard versiyasini chop etadi."""
    console.print(f"tor-guard {__version__}")


# --- lifecycle --------------------------------------------------------------
@app.command()
def start(
    config: Path = typer.Option(CONFIG_PATH, "--config", "-c"),
    no_leak_checks: bool = typer.Option(
        False, help="Faol sizib chiqish tekshiruvlarini o‘tkazib yuborish."
    ),
) -> None:
    """Kill switchni qo‘llaydi, Tor’ni ishga tushiradi, tekshiradi va
    himoyalangan deb belgilaydi."""
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
            Panel.fit(
                "[bold green]HIMOYALANGAN[/] — trafik Tor orqali yo‘naltirilmoqda",
                border_style="green",
            )
        )
    else:
        console.print(
            Panel.fit(
                f"[bold red]BLOKLANGAN[/] — oddiy internet bloklangan, himoyalanmagan "
                f"(yakuniy holat: "
                f"{_PROTECTION_LABELS.get(report.final_state, report.final_state.value)})",
                border_style="red",
            )
        )
        raise typer.Exit(ExitCode.LOCKED)


@app.command()
def stop(
    config: Path = typer.Option(CONFIG_PATH, "--config", "-c"),
    keep_tor: bool = typer.Option(False, help="Tor’ni ishlab turgan holda qoldirish."),
) -> None:
    """Kuzatuvni (va Tor’ni) to‘xtatadi. Firewall BLOKLANGAN holatda QOLADI."""
    cfg = _load(config)
    orchestrator = Orchestrator(build_context(cfg))
    try:
        orchestrator.stop(stop_tor=not keep_tor)
    except TorGuardError as exc:
        _fail(exc)
    console.print(
        Panel.fit(
            "[bold yellow]Xizmatlar to‘xtatildi. Oddiy internet BLOKLANGAN holatda qolmoqda.[/]\n"
            "To‘g‘ridan-to‘g‘ri tarmoqni tiklash uchun "
            "[bold]tor-guard unlock-clearnet[/] buyrug‘ini bajaring.",
            border_style="yellow",
        )
    )


@app.command()
def restart(config: Path = typer.Option(CONFIG_PATH, "--config", "-c")) -> None:
    """Qayta ishga tushirish: firewall va Tor’ni ochiq oyna qoldirmasdan qayta qo‘llaydi."""
    start(config=config, no_leak_checks=False)


@app.command()
def enable(config: Path = typer.Option(CONFIG_PATH, "--config", "-c")) -> None:
    """Tor Guard systemd birliklarini yoqadi (qayta yuklashdan keyin ham saqlanadi)."""
    cfg = _load(config)
    ctx = build_context(cfg)
    try:
        ctx.systemd.enable("tor-guard.target", now=False)
        console.print(
            "[green]yoqildi[/] tor-guard.target (tizim yuklanishida fail-closed ishga tushadi)"
        )
    except TorGuardError as exc:
        _fail(exc)


@app.command()
def disable(config: Path = typer.Option(CONFIG_PATH, "--config", "-c")) -> None:
    """systemd birliklarini o‘chiradi. Oddiy internetni OCHMAYDI."""
    cfg = _load(config)
    ctx = build_context(cfg)
    ctx.systemd.disable("tor-guard.target")
    console.print(
        "[yellow]birliklar o‘chirildi. unlock-clearnet bajarilmaguncha "
        "firewall bloklangan holatda qoladi.[/]"
    )


# --- status / diagnostics ---------------------------------------------------
@app.command()
def status(config: Path = typer.Option(CONFIG_PATH, "--config", "-c")) -> None:
    """Joriy himoya holati va rejimni ko‘rsatadi."""
    state = StateStore().load()
    colour = {
        ProtectionState.PROTECTED: "green",
        ProtectionState.LOCKED: "red",
        ProtectionState.DEGRADED: "yellow",
        ProtectionState.UNLOCKED: "red",
        ProtectionState.UNKNOWN: "dim",
    }[state.protection]
    label = _PROTECTION_LABELS.get(state.protection, state.protection.value.upper())
    table = Table(show_header=False)
    table.add_row("Himoya holati", f"[{colour}]{label}[/]")
    table.add_row("Rejim", state.mode.value)
    table.add_row("Firewall faol", _yesno(state.firewall_active))
    table.add_row("Tor xizmati ishlamoqda", _yesno(state.tor_running))
    table.add_row("Yangilangan", state.updated_at)
    if state.last_error:
        table.add_row("Oxirgi xatolik", state.last_error)
    console.print(Panel(table, title="Tor Guard holati", border_style=colour))


@app.command()
def doctor(config: Path = typer.Option(CONFIG_PATH, "--config", "-c")) -> None:
    """Buzmaydigan (read-only) holat tekshiruvini bajaradi."""
    from .diagnostics.doctor import Doctor, Status

    cfg = _load(config)
    report = Doctor(cfg).run()
    table = Table(title="tor-guard doctor — holat tekshiruvi")
    table.add_column("tekshiruv")
    table.add_column("holat")
    table.add_column("tafsilot", overflow="fold")
    palette = {
        Status.OK: "[green]OK[/]",
        Status.FAIL: "[red]XATO[/]",
        Status.WARN: "[yellow]OGOHLANTIRISH[/]",
        Status.INFO: "[cyan]MA’LUMOT[/]",
    }
    for finding in report.findings:
        table.add_row(finding.check, palette[finding.status], finding.detail)
    console.print(table)
    if report.has_failures:
        raise typer.Exit(ExitCode.VERIFICATION_FAILED)


@app.command()
def verify(config: Path = typer.Option(CONFIG_PATH, "--config", "-c")) -> None:
    """Firewall’ni o‘zgartirmasdan himoya butunligini tekshiradi."""
    cfg = _load(config)
    report = Orchestrator(build_context(cfg)).verify()
    _render_report(report)
    if report.failed_steps:
        raise typer.Exit(ExitCode.VERIFICATION_FAILED)


@app.command(name="test-leaks")
def test_leaks(
    config: Path = typer.Option(CONFIG_PATH, "--config", "-c"),
    i_understand: bool = typer.Option(
        False, "--i-understand", help="Majburiy: haqiqiy tarmoq urinishlarini amalga oshiradi."
    ),
) -> None:
    """Faol sizib chiqish (leak) test to‘plamini bajaradi
    (haqiqiy tarmoq urinishlari; ixtiyoriy)."""
    if not i_understand:
        err_console.print(
            "[red]--i-understand bo‘lmasa bajarish rad etildi[/] "
            "(bu tekshiruvlar haqiqiy tashqi urinishlar qiladi)."
        )
        raise typer.Exit(ExitCode.GENERIC_ERROR)
    from .network.leak_tests import LeakTester

    cfg = _load(config)
    ctx = build_context(cfg)
    report = LeakTester(ctx.verifier, ctx.dns, dns_port=cfg.dns_port).run_all()
    table = Table(title="sizib chiqish testlari")
    table.add_column("tekshiruv")
    table.add_column("natija")
    table.add_column("kuzatuv", overflow="fold")
    for result in report.results:
        colour = "green" if result.passed else "bold red"
        badge = "MUVAFFAQIYATLI" if result.passed else "MUVAFFAQIYATSIZ"
        table.add_row(result.name, f"[{colour}]{badge}[/]", result.observation)
    console.print(table)
    if report.leaked:
        console.print("[bold red]SIZIB CHIQISH ANIQLANDI[/]")
        raise typer.Exit(ExitCode.VERIFICATION_FAILED)


@app.command()
def logs(lines: int = typer.Option(50, "--lines", "-n")) -> None:
    """Tor Guard’ning so‘nggi log qatorlarini ko‘rsatadi."""
    from .constants import LOG_PATH

    if not LOG_PATH.exists():
        console.print("[dim]hozircha log fayli yo‘q[/]")
        return
    content = LOG_PATH.read_text(encoding="utf-8").splitlines()
    for line in content[-lines:]:
        console.print(line)


# --- firewall lock / unlock -------------------------------------------------
@app.command(name="emergency-lock")
def emergency_lock() -> None:
    """Eng cheklovchi favqulodda bloklashni darhol qo‘llaydi (Tor’siz ham ishlaydi)."""
    from .firewall.manager import FirewallManager

    try:
        FirewallManager().emergency_lock()
    except TorGuardError as exc:
        _fail(exc)
    console.print(
        Panel.fit(
            "[bold red]FAVQULODDA BLOKLASH YOQILDI[/] — "
            "loopback’dan tashqari barcha chiquvchi trafik bloklandi",
            border_style="red",
        )
    )


@app.command(name="unlock-clearnet")
def unlock_clearnet(
    backup: Path | None = typer.Option(
        None, "--backup", help="Tiklash uchun tekshirilgan zaxira nusxa."
    ),
    yes: bool = typer.Option(False, "--yes", help="Interaktiv tasdiqlashni o‘tkazib yuborish."),
) -> None:
    """To‘g‘ridan-to‘g‘ri tarmoqni tiklaydi. ALOHIDA, OSHKORA, AUDIT QILINADIGAN amal."""
    from .firewall.manager import FirewallManager

    err_console.print(
        Panel.fit(
            "[bold red]OGOHLANTIRISH[/]: bu TO‘G‘RIDAN-TO‘G‘RI "
            "oddiy internet ulanishini tiklaydi.\n"
            "Sizning haqiqiy IP manzilingiz va DNS so‘rovlaringiz "
            "endi Tor orqali majburlanmaydi.",
            border_style="red",
        )
    )
    if not yes and not typer.confirm("Oddiy internetni tiklashni davom ettirasizmi?"):
        console.print("bekor qilindi")
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
            "[bold]oddiy internet tiklandi[/] — "
            "Tor Guard endi chiquvchi trafikni himoya qilmaydi",
            border_style="yellow",
        )
    )


@app.command()
def reload(config: Path = typer.Option(CONFIG_PATH, "--config", "-c")) -> None:
    """Sozlamalar/torrc’ni qayta yaratadi va firewall’ni atomik tarzda qayta qo‘llaydi."""
    cfg = _load(config)
    ctx = build_context(cfg)
    try:
        ctx.tor.write_config()
        ctx.firewall.apply_protected(ctx.ruleset_params())
        console.print(
            "[green]qayta yuklandi[/] firewall + Tor sozlamalari (atomik; ochiq oyna yo‘q)"
        )
    except TorGuardError as exc:
        _fail(exc)


# --- install / uninstall ----------------------------------------------------
@app.command()
def install(
    config: Path = typer.Option(CONFIG_PATH, "--config", "-c"),
    resource_dir: Path = typer.Option(
        _RESOURCE_DIR, help="config/ va systemd/ joylashgan repo papkasi."
    ),
) -> None:
    """Papkalar, sozlamalar, torrc drop-in va systemd birliklarini o‘rnatadi."""
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
    console.print(f"[green]o‘rnatildi[/] {len(result.installed_files)} ta fayl")
    for path in result.installed_files:
        console.print(f"  • {path}")


@app.command()
def uninstall(
    config: Path = typer.Option(CONFIG_PATH, "--config", "-c"),
    keep_firewall: bool = typer.Option(False, help="Firewall blokini o‘chirmaslik."),
) -> None:
    """Tor Guard fayllarini o‘chiradi. --keep-firewall berilmasa firewall’ni ham o‘chiradi."""
    from .install.installer import Installer

    try:
        cfg = load_config(config)
    except TorGuardError:
        cfg = parse_config("mode: strict")
    removed = Installer(cfg, _RESOURCE_DIR).uninstall(remove_firewall=not keep_firewall)
    console.print(f"[green]o‘chirildi[/] {len(removed)} ta fayl")


# --- config subcommands -----------------------------------------------------
@config_app.command("show")
def config_show(config: Path = typer.Option(CONFIG_PATH, "--config", "-c")) -> None:
    """Amaldagi, tekshirilgan sozlamalarni chop etadi."""
    cfg = _load(config)
    table = Table(show_header=False)
    for key, value in vars(cfg).items():
        table.add_row(key, str(value))
    console.print(Panel(table, title=f"sozlamalar: {config}"))


@config_app.command("validate")
def config_validate(config: Path = typer.Option(CONFIG_PATH, "--config", "-c")) -> None:
    """Sozlamalarni tekshiradi va birinchi xatolikni (agar bo‘lsa) xabar qiladi."""
    try:
        load_config(config)
    except TorGuardError as exc:
        _fail(exc)
    console.print("[green]sozlamalar to‘g‘ri[/]")


def main() -> int:
    try:
        app()
    except SystemExit as exc:  # Typer/Click uses SystemExit for exit codes
        return int(exc.code) if isinstance(exc.code, int) else 0
    return ExitCode.OK


if __name__ == "__main__":
    sys.exit(main())
