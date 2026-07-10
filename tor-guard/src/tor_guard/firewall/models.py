"""Typed inputs to the nftables ruleset generator.

Keeping the generator's inputs in a small frozen model makes rule generation a
pure function of validated data — trivial to unit-test and impossible to feed
unvalidated strings (invariant: no untrusted interpolation into nft text).
"""

from __future__ import annotations

from dataclasses import dataclass, field

from ..state import Mode


@dataclass(frozen=True)
class RulesetParams:
    """Everything the generator needs, already validated and resolved."""

    mode: Mode
    tor_uid: int
    trans_port: int
    dns_port: int
    allowed_lan_cidrs: tuple[str, ...] = ()
    #: Extra local UDP allowances are intentionally minimal; DHCP is built in.
    allow_dhcp: bool = True
    #: Loopback-only Tor listeners; used to sanity-check ports are private.
    loopback: str = "127.0.0.1"

    def __post_init__(self) -> None:
        if not (0 <= self.tor_uid <= 0xFFFFFFFF):
            raise ValueError(f"implausible tor_uid: {self.tor_uid}")
        for port in (self.trans_port, self.dns_port):
            if not (1 <= port <= 65535):
                raise ValueError(f"port out of range: {port}")
        if self.mode is Mode.STRICT and self.allowed_lan_cidrs:
            raise ValueError("strict mode must not carry LAN CIDRs")


@dataclass(frozen=True)
class GeneratedRuleset:
    """A rendered ruleset plus its identity."""

    text: str
    sha256: str
    table_names: tuple[str, ...] = field(default_factory=tuple)
