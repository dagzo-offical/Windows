"""Dependency-injection container.

A single place that constructs the collaborators the CLI and orchestrator need
from a validated :class:`Config`. Tests build an :class:`AppContext` with fakes;
production uses the real implementations. This keeps the orchestrator logic pure
and unit-testable (no hidden globals).

Deviation from the reference layout: ``context.py`` and ``orchestrator.py`` are
added to keep the CLI thin and the start/stop logic testable in isolation.
"""

from __future__ import annotations

from dataclasses import dataclass

from .config import Config
from .firewall.integrity import IntegrityChecker
from .firewall.manager import FirewallManager
from .firewall.models import RulesetParams
from .network.dns import DnsValidator
from .network.routes import ExternalIPVerifier
from .privileges import resolve_uid
from .services import SystemdManager
from .state import StateStore
from .subprocess_runner import CommandRunner, SubprocessRunner
from .tor.health import TorHealthChecker
from .tor.manager import TorManager


@dataclass
class AppContext:
    config: Config
    runner: CommandRunner
    firewall: FirewallManager
    integrity: IntegrityChecker
    tor: TorManager
    tor_health: TorHealthChecker
    systemd: SystemdManager
    dns: DnsValidator
    verifier: ExternalIPVerifier
    state_store: StateStore

    def ruleset_params(self) -> RulesetParams:
        """Resolve the Tor uid and build validated ruleset parameters."""
        uid = resolve_uid(self.config.tor_user)
        return RulesetParams(
            mode=self.config.mode,
            tor_uid=uid,
            trans_port=self.config.trans_port,
            dns_port=self.config.dns_port,
            allowed_lan_cidrs=(
                self.config.allowed_lan_cidrs if self.config.mode.value == "lan-compatible" else ()
            ),
        )


def build_context(config: Config, runner: CommandRunner | None = None) -> AppContext:
    runner = runner or SubprocessRunner()
    systemd = SystemdManager(runner)
    return AppContext(
        config=config,
        runner=runner,
        firewall=FirewallManager(runner),
        integrity=IntegrityChecker(runner),
        tor=TorManager(config, runner, systemd),
        tor_health=TorHealthChecker(timeout=config.health_timeout),
        systemd=systemd,
        dns=DnsValidator(timeout=config.health_timeout),
        verifier=ExternalIPVerifier(config.external_ip_endpoints, timeout=config.health_timeout),
        state_store=StateStore(),
    )


__all__ = ["AppContext", "build_context"]
