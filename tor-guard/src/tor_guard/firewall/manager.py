"""Firewall lifecycle: backup, validate, atomically apply, restore, lock.

This is the only module that mutates the live firewall. Every apply goes through
validate → write private file → ``nft -f`` (one atomic transaction). We never run
``nft flush ruleset`` and only ever add/delete Tor Guard's own tables.
"""

from __future__ import annotations

import tempfile
from datetime import UTC, datetime
from pathlib import Path

from ..constants import BACKUP_DIR, DIR_MODE, FILE_MODE, RULESET_LIVE_PATH
from ..exceptions import FirewallError
from ..logging_config import audit, get_logger
from ..privileges import ensure_secure_dir
from ..subprocess_runner import CommandRunner, SubprocessRunner
from .generator import generate_emergency, generate_protected
from .models import GeneratedRuleset, RulesetParams
from .validator import RulesetValidator

_log = get_logger("firewall.manager")


class FirewallManager:
    def __init__(
        self,
        runner: CommandRunner | None = None,
        validator: RulesetValidator | None = None,
        *,
        nft_path: str = "nft",
        backup_dir: Path = BACKUP_DIR,
        live_path: Path = RULESET_LIVE_PATH,
    ) -> None:
        self._runner = runner or SubprocessRunner()
        self._validator = validator or RulesetValidator(self._runner, nft_path)
        self._nft = nft_path
        self._backup_dir = backup_dir
        self._live_path = live_path

    # ---- inspection --------------------------------------------------------
    def dump_ruleset(self) -> str:
        """Return the full live ruleset (``nft list ruleset``)."""
        return self._runner.run([self._nft, "list", "ruleset"], check=False).stdout

    def table_exists(self, family: str, name: str) -> bool:
        result = self._runner.run([self._nft, "list", "table", family, name], check=False)
        return result.ok

    # ---- backup / restore --------------------------------------------------
    def backup_current(self) -> Path:
        """Save the current full ruleset to a timestamped file; return its path."""
        ensure_secure_dir(self._backup_dir, DIR_MODE)
        stamp = datetime.now(UTC).strftime("%Y%m%dT%H%M%SZ")
        path = self._backup_dir / f"ruleset-{stamp}.nft"
        content = self.dump_ruleset()
        path.write_text(content, encoding="utf-8")
        try:
            path.chmod(FILE_MODE)
        except OSError:
            pass
        _log.info("backed up current ruleset to %s (%d bytes)", path, len(content))
        return path

    def _apply_text(self, text: str, *, description: str) -> None:
        """Validate then atomically apply *text* via a single ``nft -f``."""
        self._validator.validate_or_raise(text)
        tmp_dir = Path(tempfile.mkdtemp(prefix="tor-guard-apply-"))
        tmp = tmp_dir / "ruleset.nft"
        try:
            tmp.write_text(text, encoding="utf-8")
            tmp.chmod(FILE_MODE)
            result = self._runner.run([self._nft, "-f", str(tmp)], check=False)
            if not result.ok:
                raise FirewallError(
                    f"failed to apply {description}: "
                    f"{result.stderr.strip() or 'nft returned non-zero'}"
                )
        finally:
            try:
                tmp.unlink(missing_ok=True)
                tmp_dir.rmdir()
            except OSError:
                pass
        # Persist the applied ruleset for reload / integrity reference.
        ensure_secure_dir(self._live_path.parent, DIR_MODE)
        self._live_path.write_text(text, encoding="utf-8")
        try:
            self._live_path.chmod(FILE_MODE)
        except OSError:
            pass
        _log.info("applied %s atomically", description)

    # ---- protected mode ----------------------------------------------------
    def apply_protected(self, params: RulesetParams) -> GeneratedRuleset:
        ruleset = generate_protected(params)
        self._apply_text(ruleset.text, description=f"protected ruleset ({params.mode.value})")
        audit("firewall_applied", detail=f"protected/{params.mode.value} sha={ruleset.sha256[:12]}")
        return ruleset

    # ---- emergency lock ----------------------------------------------------
    def emergency_lock(self) -> GeneratedRuleset:
        """Apply the most restrictive ruleset. Works without Tor (invariant I13)."""
        ruleset = generate_emergency()
        self._apply_text(ruleset.text, description="EMERGENCY lockdown")
        audit("emergency_lock", detail=f"sha={ruleset.sha256[:12]}")
        _log.warning("EMERGENCY lock engaged: all egress dropped except loopback")
        return ruleset

    # ---- clearnet restore (explicit, audited) ------------------------------
    def restore_from_backup(self, backup_path: Path) -> None:
        """Restore a previously captured ruleset. Used by ``unlock-clearnet``.

        We validate the backup, then remove our own tables and re-apply the
        backup content. We never blindly ``flush ruleset``.
        """
        if not backup_path.is_file():
            raise FirewallError(f"backup not found: {backup_path}")
        content = backup_path.read_text(encoding="utf-8")
        # Remove Tor Guard tables first so a stale kill switch cannot linger.
        self.remove_tor_guard_tables()
        if content.strip():
            self._apply_text(content, description=f"restored backup {backup_path.name}")
        audit("clearnet_restored", actor="admin", detail=str(backup_path))
        _log.warning("clearnet restored from backup %s", backup_path)

    def remove_tor_guard_tables(self) -> None:
        """Delete only Tor Guard's tables (never the admin's other tables)."""
        for family, name in (
            ("ip", "tor_guard_nat"),
            ("inet", "tor_guard_filter"),
            ("ip6", "tor_guard6"),
            ("inet", "tor_guard_lock"),
        ):
            if self.table_exists(family, name):
                result = self._runner.run([self._nft, "delete", "table", family, name], check=False)
                if not result.ok:
                    _log.warning(
                        "could not delete table %s %s: %s", family, name, result.stderr.strip()
                    )
        _log.info("removed Tor Guard tables")


__all__ = ["FirewallManager"]
