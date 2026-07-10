"""The fail-closed monitoring daemon.

Loop (every ``monitor_interval`` seconds):
  1. Check firewall integrity. If lost, **immediately re-apply the locked
     ruleset** (invariant I10) — this is the highest priority and runs even if
     Tor is fine.
  2. Check Tor health. If Tor is down and auto-restart is enabled, restart Tor.
     The firewall is *never* touched to "help" Tor (invariant I11).
  3. Update the persisted protection state for reporting.

Crucially, the daemon has no code path that removes the kill switch. If the
daemon itself crashes, the firewall stays exactly as it was (invariant: monitor
crash → firewall remains active).
"""

from __future__ import annotations

import signal
import time
from collections.abc import Callable

from ..config import Config
from ..firewall.manager import FirewallManager
from ..firewall.models import RulesetParams
from ..logging_config import audit, get_logger
from ..state import ProtectionState, StateStore
from .checks import HealthChecker, HealthSnapshot

_log = get_logger("monitor.daemon")


class MonitorDaemon:
    def __init__(
        self,
        config: Config,
        checker: HealthChecker,
        firewall: FirewallManager,
        ruleset_params: RulesetParams,
        state_store: StateStore,
        *,
        restart_tor: Callable[[], None],
        sleep: Callable[[float], None] = time.sleep,
    ) -> None:
        self._config = config
        self._checker = checker
        self._firewall = firewall
        self._params = ruleset_params
        self._state = state_store
        self._restart_tor = restart_tor
        self._sleep = sleep
        self._running = False

    def install_signal_handlers(self) -> None:
        signal.signal(signal.SIGTERM, self._handle_stop)
        signal.signal(signal.SIGINT, self._handle_stop)

    def _handle_stop(self, *_: object) -> None:
        _log.info("monitor received stop signal; exiting (firewall stays locked)")
        self._running = False

    def tick(self) -> HealthSnapshot:
        """Run one monitoring cycle and take corrective action if needed."""
        snapshot = self._checker.snapshot(check_tor=True)

        # --- Priority 1: firewall integrity (re-lock, never unlock) ----------
        if not snapshot.firewall_intact:
            _log.error(
                "integrity lost: %s — re-applying locked ruleset", snapshot.integrity.summary
            )
            audit("integrity_restore", detail=snapshot.integrity.summary)
            try:
                self._firewall.apply_protected(self._params)
            except Exception as exc:
                _log.critical("re-apply failed (%s); engaging emergency lock", exc)
                self._firewall.emergency_lock()

        # --- Priority 2: Tor health (restart only; never open clearnet) ------
        if not snapshot.tor_healthy and self._config.auto_restart_tor:
            _log.warning("Tor unhealthy; restarting Tor (firewall untouched)")
            audit("tor_restart", detail="monitor detected unhealthy Tor")
            try:
                self._restart_tor()
            except Exception as exc:
                _log.error("Tor restart failed: %s", exc)

        self._persist_state(snapshot)
        return snapshot

    def _persist_state(self, snapshot: HealthSnapshot) -> None:
        state = self._state.load()
        state.firewall_active = snapshot.firewall_intact
        state.tor_running = snapshot.tor_healthy
        if not snapshot.firewall_intact:
            target = ProtectionState.LOCKED
        elif snapshot.tor_healthy:
            target = ProtectionState.PROTECTED
        else:
            target = ProtectionState.LOCKED  # firewall up, Tor down => locked (fail-closed)
        if state.protection is not ProtectionState.UNLOCKED:
            self._state.transition(state, target, reason="monitor")
        else:
            # Respect an explicit admin unlock; do not silently re-lock here.
            self._state.save(state)

    def run(self) -> None:
        self._running = True
        _log.info("monitor daemon started (interval=%ds)", self._config.monitor_interval)
        while self._running:
            try:
                self.tick()
            except Exception as exc:
                _log.error("monitor tick error: %s", exc)
            self._sleep(self._config.monitor_interval)
        _log.info("monitor daemon stopped")


__all__ = ["MonitorDaemon"]
