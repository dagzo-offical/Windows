"""Entrypoint for the monitor systemd service (``python3 -m tor_guard.monitor.run``)."""

from __future__ import annotations

import sys

from ..config import load_config
from ..context import build_context
from ..logging_config import configure_logging, get_logger
from ..monitor.checks import HealthChecker
from ..monitor.daemon import MonitorDaemon

_log = get_logger("monitor.run")


def main() -> int:
    try:
        config = load_config()
    except Exception as exc:
        # Config invalid: do NOT change networking. Exit non-zero; the firewall
        # unit keeps the lock regardless of the monitor.
        print(f"tor-guard monitor: cannot start: {exc}", file=sys.stderr)
        return 1

    configure_logging(config.log_level, to_console=False)
    ctx = build_context(config)
    checker = HealthChecker(
        ctx.integrity,
        ctx.tor_health,
        socks_port=config.socks_port,
        trans_port=config.trans_port,
        dns_port=config.dns_port,
    )
    daemon = MonitorDaemon(
        config,
        checker,
        ctx.firewall,
        ctx.ruleset_params(),
        ctx.state_store,
        restart_tor=ctx.tor.restart,
    )
    daemon.install_signal_handlers()
    _log.info("tor-guard monitor starting")
    daemon.run()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
