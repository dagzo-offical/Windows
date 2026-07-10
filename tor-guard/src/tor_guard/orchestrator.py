"""High-level start/stop/verify orchestration.

Implements the exact ``start`` sequence from the specification. The ordering is
security-critical: the firewall lock is applied *before* Tor is (re)started, so
there is never a clearnet window (invariant I2). If any required check fails, we
remain locked and report the precise failure — we never fall open.
"""

from __future__ import annotations

import time
from collections.abc import Callable
from dataclasses import dataclass, field
from enum import Enum

from .context import AppContext
from .exceptions import (
    BootstrapTimeout,
    DependencyError,
    TorError,
    TorGuardError,
)
from .logging_config import audit, get_logger
from .network.routes import VerifyState
from .platform import ensure_supported
from .privileges import require_root
from .state import ProtectionState
from .tor.bootstrap import parse_bootstrap, wait_for_bootstrap
from .tor.controller import TorController

_log = get_logger("orchestrator")


class StepStatus(str, Enum):
    OK = "ok"
    FAIL = "fail"
    SKIP = "skip"
    INFO = "info"


@dataclass
class StepResult:
    name: str
    status: StepStatus
    detail: str = ""


@dataclass
class StartReport:
    steps: list[StepResult] = field(default_factory=list)
    protected: bool = False
    final_state: ProtectionState = ProtectionState.LOCKED

    def add(self, name: str, status: StepStatus, detail: str = "") -> StepResult:
        result = StepResult(name, status, detail)
        self.steps.append(result)
        return result

    @property
    def failed_steps(self) -> list[StepResult]:
        return [s for s in self.steps if s.status is StepStatus.FAIL]


class Orchestrator:
    def __init__(
        self,
        ctx: AppContext,
        *,
        bootstrap_poll: Callable[[], object | None] | None = None,
        sleep: Callable[[float], None] = time.sleep,
    ) -> None:
        self._ctx = ctx
        # Injectable so start() is unit-testable without a live Tor ControlPort.
        self._bootstrap_poll = bootstrap_poll
        self._sleep = sleep

    # -- START ---------------------------------------------------------------
    def start(self, *, run_leak_checks: bool = True) -> StartReport:
        report = StartReport()
        ctx = self._ctx
        cfg = ctx.config

        # 1-4: preconditions (no host change yet)
        require_root("start")
        report.add("root", StepStatus.OK)
        ensure_supported()
        report.add("platform", StepStatus.OK)
        report.add("config", StepStatus.OK, f"mode={cfg.mode.value}")
        try:
            tor_uid = ctx.tor.ensure_installed()
            report.add("dependencies", StepStatus.OK, f"tor uid={tor_uid}")
        except DependencyError as exc:
            report.add("dependencies", StepStatus.FAIL, exc.message)
            return self._lock_and_return(report, "kerakli dependency mavjud emas")

        params = ctx.ruleset_params()

        # 5: backup
        try:
            backup = ctx.firewall.backup_current()
            report.add("backup", StepStatus.OK, str(backup))
        except TorGuardError as exc:
            report.add("backup", StepStatus.FAIL, exc.message)
            return self._lock_and_return(report, "zaxira nusxa muvaffaqiyatsiz")

        # 6-7: validate + atomically apply the kill switch BEFORE Tor
        try:
            ctx.firewall.apply_protected(params)
            report.add("firewall", StepStatus.OK, "bloklovchi qoidalar to‘plami qo‘llandi")
        except TorGuardError as exc:
            report.add("firewall", StepStatus.FAIL, exc.message)
            return self._lock_and_return(report, "firewall qo‘llash muvaffaqiyatsiz")

        # 8: (re)start Tor now that egress is locked down
        try:
            ctx.tor.write_config()
            ctx.tor.restart()
            report.add("tor-start", StepStatus.OK)
        except TorGuardError as exc:
            report.add("tor-start", StepStatus.FAIL, exc.message)
            return self._lock_and_return(report, "Tor ishga tushmadi")

        # 9: wait for bootstrap == 100%
        try:
            self._wait_bootstrap()
            report.add("bootstrap", StepStatus.OK, "100%")
        except (BootstrapTimeout, TorError) as exc:
            report.add("bootstrap", StepStatus.FAIL, str(exc))
            return self._lock_and_return(report, "Tor ulanish bosqichini yakunlamadi")

        # 10: validate listeners
        health = ctx.tor_health.check(
            socks_port=cfg.socks_port, trans_port=cfg.trans_port, dns_port=cfg.dns_port
        )
        report.add(
            "trans-port",
            StepStatus.OK if health.trans.reachable else StepStatus.FAIL,
            health.trans.detail,
        )
        report.add(
            "dns-port",
            StepStatus.OK if health.dns.reachable else StepStatus.FAIL,
            health.dns.detail,
        )
        report.add(
            "socks-port",
            StepStatus.OK if health.socks.reachable else StepStatus.INFO,
            health.socks.detail,
        )
        if not (health.trans.reachable and health.dns.reachable):
            return self._lock_and_return(report, "kerakli Tor portlari mavjud emas")

        # 11: confirm Tor-routed external connectivity (tri-state)
        verify = ctx.verifier.verify()
        if verify.state is VerifyState.CONFIRMED_TOR:
            report.add("external-connectivity", StepStatus.OK, "chiqish Tor orqali")
        elif verify.state is VerifyState.LEAK_DETECTED:
            report.add("external-connectivity", StepStatus.FAIL, "trafik Tor orqali EMAS")
            return self._lock_and_return(report, "sizib chiqish aniqlandi")
        else:
            report.add("external-connectivity", StepStatus.INFO, "tekshiruv mavjud emas")

        # 12-14: confirm direct/IPv6/UDP blocked (leak probes)
        if run_leak_checks and not cfg.test_mode:
            self._run_block_checks(report)
            if report.failed_steps:
                return self._lock_and_return(report, "sizib chiqish tekshiruvi muvaffaqiyatsiz")

        # 15: mark protected
        if verify.state is VerifyState.CONFIRMED_TOR:
            state = ctx.state_store.load()
            state.mode = cfg.mode
            ctx.state_store.transition(state, ProtectionState.PROTECTED, reason="start")
            report.protected = True
            report.final_state = ProtectionState.PROTECTED
            audit("protected", detail=f"mode={cfg.mode.value}")
        else:
            # Firewall is up and everything blocked correctly, but we could not
            # positively confirm the Tor exit. Fail-closed but degraded, not open.
            state = ctx.state_store.load()
            ctx.state_store.transition(state, ProtectionState.DEGRADED, reason="verify-unavailable")
            report.final_state = ProtectionState.DEGRADED
        return report

    def _run_block_checks(self, report: StartReport) -> None:
        """Best-effort active checks that direct/v6/UDP paths are blocked."""
        from .network.leak_tests import LeakTester

        tester = LeakTester(
            self._ctx.verifier,
            self._ctx.dns,
            dns_port=self._ctx.config.dns_port,
            timeout=self._ctx.config.health_timeout,
        )
        for probe, label in (
            (tester.probe_ipv6_tcp, "ipv6-blocked"),
            (tester.probe_direct_dns_udp, "direct-dns-blocked"),
            (tester.probe_external_udp, "udp-blocked"),
        ):
            result = probe()
            report.add(
                label,
                StepStatus.OK if result.passed else StepStatus.FAIL,
                result.observation,
            )

    def _wait_bootstrap(self) -> None:
        cfg = self._ctx.config
        if self._bootstrap_poll is not None:
            wait_for_bootstrap(
                self._bootstrap_poll,  # type: ignore[arg-type]
                timeout=cfg.bootstrap_timeout,
                sleep=self._sleep,
            )
            return

        controller = TorController(port=cfg.control_port, timeout=cfg.health_timeout)

        def poll() -> object | None:
            try:
                return parse_bootstrap(controller.bootstrap_phase())
            except TorError:
                return None

        try:
            wait_for_bootstrap(
                poll,  # type: ignore[arg-type]
                timeout=cfg.bootstrap_timeout,
                sleep=self._sleep,
            )
        finally:
            controller.close()

    def _lock_and_return(self, report: StartReport, reason: str) -> StartReport:
        """Ensure the host is locked and record the failure."""
        _log.error("ishga tushirish bekor qilindi: %s (host bloklangan holatda qoladi)", reason)
        try:
            # Guarantee at least the emergency lock is present.
            if not self._ctx.firewall.table_exists("inet", "tor_guard_filter"):
                self._ctx.firewall.emergency_lock()
        except TorGuardError as exc:
            _log.critical("blokni ta’minlab bo‘lmadi: %s", exc)
        state = self._ctx.state_store.load()
        state.last_error = reason
        self._ctx.state_store.transition(state, ProtectionState.LOCKED, reason=reason)
        report.final_state = ProtectionState.LOCKED
        report.protected = False
        return report

    # -- STOP ----------------------------------------------------------------
    def stop(self, *, stop_tor: bool = True) -> None:
        """Stop services but KEEP the firewall locked (invariants I3, I4)."""
        require_root("stop")
        self._ctx.systemd.stop("tor-guard-monitor.service")
        if stop_tor:
            self._ctx.tor.stop()
        state = self._ctx.state_store.load()
        if state.protection is not ProtectionState.UNLOCKED:
            self._ctx.state_store.transition(state, ProtectionState.LOCKED, reason="stop")
        audit("stop", detail="xizmatlar to‘xtatildi; firewall bloklangan holatda qoladi")

    # -- VERIFY --------------------------------------------------------------
    def verify(self) -> StartReport:
        """Re-run the safety checks without changing the firewall."""
        report = StartReport()
        ctx = self._ctx
        integrity = ctx.integrity.check()
        report.add(
            "firewall-integrity",
            StepStatus.OK if integrity.ok else StepStatus.FAIL,
            integrity.summary,
        )
        health = ctx.tor_health.check(
            socks_port=ctx.config.socks_port,
            trans_port=ctx.config.trans_port,
            dns_port=ctx.config.dns_port,
        )
        report.add("trans-port", StepStatus.OK if health.trans.reachable else StepStatus.FAIL)
        report.add("dns-port", StepStatus.OK if health.dns.reachable else StepStatus.FAIL)
        verify = ctx.verifier.verify()
        if verify.state is VerifyState.CONFIRMED_TOR:
            report.add("external-verify", StepStatus.OK, "chiqish Tor orqali")
        elif verify.state is VerifyState.LEAK_DETECTED:
            report.add("external-verify", StepStatus.FAIL, "sizib chiqish")
        else:
            report.add("external-verify", StepStatus.INFO, "mavjud emas")
        report.protected = integrity.ok and health.all_ports_ok
        return report


__all__ = ["Orchestrator", "StartReport", "StepResult", "StepStatus"]
