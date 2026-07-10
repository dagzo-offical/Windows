"""Ruleset validation via ``nft -c`` (check mode) — no state change.

Every ruleset is validated *before* it is applied (invariant I8). ``nft -c -f``
parses and semantically checks the ruleset without touching the live firewall.
"""

from __future__ import annotations

import tempfile
from dataclasses import dataclass
from pathlib import Path

from ..exceptions import FirewallError
from ..logging_config import get_logger
from ..subprocess_runner import CommandRunner, SubprocessRunner

_log = get_logger("firewall.validator")


@dataclass(frozen=True)
class ValidationResult:
    ok: bool
    message: str


class RulesetValidator:
    def __init__(self, runner: CommandRunner | None = None, nft_path: str = "nft") -> None:
        self._runner = runner or SubprocessRunner()
        self._nft = nft_path

    def validate_text(self, ruleset: str) -> ValidationResult:
        """Write *ruleset* to a private temp file and run ``nft -c -f``."""
        tmp_dir = Path(tempfile.mkdtemp(prefix="tor-guard-nft-"))
        tmp = tmp_dir / "candidate.nft"
        try:
            tmp.write_text(ruleset, encoding="utf-8")
            tmp.chmod(0o600)
            result = self._runner.run([self._nft, "-c", "-f", str(tmp)], check=False)
        finally:
            try:
                tmp.unlink(missing_ok=True)
                tmp_dir.rmdir()
            except OSError:
                pass
        if result.ok:
            return ValidationResult(True, "ruleset syntactically and semantically valid")
        msg = result.stderr.strip() or result.stdout.strip() or "unknown nft error"
        _log.error("ruleset validation failed: %s", msg)
        return ValidationResult(False, msg)

    def validate_or_raise(self, ruleset: str) -> None:
        outcome = self.validate_text(ruleset)
        if not outcome.ok:
            raise FirewallError(f"nftables ruleset rejected: {outcome.message}")


__all__ = ["RulesetValidator", "ValidationResult"]
