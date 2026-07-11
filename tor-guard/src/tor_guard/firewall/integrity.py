"""Firewall integrity verification.

The monitor calls :meth:`IntegrityChecker.check` periodically. If Tor Guard's
tables, chains, or default-drop policies are missing or altered, integrity is
considered lost and the caller re-applies the locked ruleset (invariant I10).

We verify *structure and policy*, not a byte-for-byte hash of ``nft list
ruleset`` — the kernel reformats output and counters change, so a raw hash would
false-positive. Instead we assert the required tables exist and each critical
base chain still has ``policy drop``.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field

from ..logging_config import get_logger
from ..subprocess_runner import CommandRunner, SubprocessRunner

_log = get_logger("firewall.integrity")

# (family, table, chains-that-must-be-policy-drop)
_REQUIRED = (
    ("inet", "tor_guard_filter", ("input", "forward", "output")),
    ("ip6", "tor_guard6", ("input", "forward", "output")),
    ("ip", "tor_guard_nat", ()),  # nat chains are policy accept by design
)


@dataclass(frozen=True)
class IntegrityReport:
    ok: bool
    missing_tables: tuple[str, ...] = field(default_factory=tuple)
    weak_policies: tuple[str, ...] = field(default_factory=tuple)
    detail: str = ""

    @property
    def summary(self) -> str:
        if self.ok:
            return "firewall butunligi saqlangan"
        parts = []
        if self.missing_tables:
            parts.append(f"yo‘q jadvallar: {', '.join(self.missing_tables)}")
        if self.weak_policies:
            parts.append(f"drop bo‘lmagan siyosatlar: {', '.join(self.weak_policies)}")
        return "; ".join(parts) or self.detail or "butunlik yo‘qolgan"


class IntegrityChecker:
    def __init__(self, runner: CommandRunner | None = None, nft_path: str = "nft") -> None:
        self._runner = runner or SubprocessRunner()
        self._nft = nft_path

    def _table_dump(self, family: str, name: str) -> str | None:
        result = self._runner.run([self._nft, "list", "table", family, name], check=False)
        return result.stdout if result.ok else None

    @staticmethod
    def _policy_is_drop(dump: str, chain: str) -> bool:
        # Match:  chain output {  type filter hook output priority 0; policy drop;
        pattern = re.compile(
            rf"chain\s+{re.escape(chain)}\s*\{{.*?policy\s+drop\s*;",
            re.DOTALL,
        )
        return bool(pattern.search(dump))

    def check(self) -> IntegrityReport:
        missing: list[str] = []
        weak: list[str] = []
        for family, table, drop_chains in _REQUIRED:
            dump = self._table_dump(family, table)
            if dump is None:
                missing.append(f"{family} {table}")
                continue
            for chain in drop_chains:
                if not self._policy_is_drop(dump, chain):
                    weak.append(f"{family} {table}:{chain}")
        ok = not missing and not weak
        report = IntegrityReport(ok=ok, missing_tables=tuple(missing), weak_policies=tuple(weak))
        if not ok:
            _log.error("butunlik tekshiruvi muvaffaqiyatsiz: %s", report.summary)
        return report


__all__ = ["IntegrityChecker", "IntegrityReport"]
