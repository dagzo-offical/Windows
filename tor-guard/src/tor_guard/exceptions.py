"""Exception hierarchy.

All Tor Guard failures derive from :class:`TorGuardError` so the CLI can map any
of them to a fail-closed action and a stable exit code. Nothing here ever
signals "fall back to clearnet" — errors mean *stay locked*.
"""

from __future__ import annotations

from .constants import ExitCode


class TorGuardError(Exception):
    """Base class for all Tor Guard errors."""

    exit_code: int = ExitCode.GENERIC_ERROR

    def __init__(self, message: str, *, hint: str | None = None) -> None:
        super().__init__(message)
        self.message = message
        self.hint = hint


class PrivilegeError(TorGuardError):
    """Operation requires root and it was not available."""

    exit_code = ExitCode.NOT_ROOT


class PlatformError(TorGuardError):
    """Running on an unsupported OS / init / firewall backend."""

    exit_code = ExitCode.UNSUPPORTED_PLATFORM


class DependencyError(TorGuardError):
    """A required external program or service account is missing."""

    exit_code = ExitCode.MISSING_DEPENDENCY


class ConfigError(TorGuardError):
    """Configuration is missing, malformed, or fails schema validation."""

    exit_code = ExitCode.INVALID_CONFIG


class SubprocessError(TorGuardError):
    """A subprocess failed, timed out, or the binary was absent."""


class FirewallError(TorGuardError):
    """nftables ruleset generation, validation, or application failed."""

    exit_code = ExitCode.FIREWALL_ERROR


class IntegrityError(FirewallError):
    """The live firewall no longer matches the expected Tor Guard ruleset."""


class TorError(TorGuardError):
    """Tor daemon / control / bootstrap failure."""

    exit_code = ExitCode.TOR_ERROR


class BootstrapTimeout(TorError):  # noqa: N818  (reads naturally; still a TorError)
    """Tor did not reach 100% bootstrap within the configured timeout."""


class VerificationError(TorGuardError):
    """A post-start verification check failed (leak detected, etc.)."""

    exit_code = ExitCode.VERIFICATION_FAILED


class LockedError(TorGuardError):
    """The system is intentionally in a locked state and cannot proceed."""

    exit_code = ExitCode.LOCKED
