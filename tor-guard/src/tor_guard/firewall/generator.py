"""Deterministic nftables ruleset generation.

The generator renders a *complete* ruleset as text. It is applied atomically by
the manager via a single ``nft -f`` transaction. We never build firewall state
with a sequence of mutating commands (invariant I9).

Only Tor Guard's own tables are touched. We use the standard idempotent
add/delete/redefine idiom so replacing our ruleset never disturbs the admin's
other tables and never runs ``nft flush ruleset``.

Two entry points:
  * :func:`generate_protected` — the full transparent-proxy kill switch;
  * :func:`generate_emergency` — the most restrictive known-good lockdown that
    needs no Tor at all (invariant I13).
"""

from __future__ import annotations

import hashlib

from ..constants import (
    LINK_LOCAL4,
    LOOPBACK_NET4,
    MULTICAST4,
    RFC1918,
    SPECIAL4,
    TABLE_INET,
    TABLE_IP6,
)
from ..state import Mode
from .models import GeneratedRuleset, RulesetParams

# nftables table names. NAT must be per-family; filter uses inet to cover v4+v6.
_NAT_TABLE = f"{TABLE_INET}_nat"
_FILTER_TABLE = f"{TABLE_INET}_filter"
_EMERGENCY_TABLE = f"{TABLE_INET}_lock"

_NON_INTERNET_V4 = (LOOPBACK_NET4, LINK_LOCAL4, MULTICAST4, *RFC1918, *SPECIAL4)


def _sha256(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def _atomic_wrap(table_family: str, table_name: str, body: str) -> str:
    """Wrap a table body in the idempotent atomic-replace idiom."""
    return (
        f"add table {table_family} {table_name}\n"
        f"delete table {table_family} {table_name}\n"
        f"table {table_family} {table_name} {{\n{body}}}\n"
    )


def _lan_return_rules(cidrs: tuple[str, ...], indent: str) -> str:
    if not cidrs:
        return ""
    joined = ", ".join(cidrs)
    return f"{indent}ip daddr {{ {joined} }} accept\n"


def generate_protected(params: RulesetParams) -> GeneratedRuleset:
    """Render the full protected-mode ruleset for *params*."""
    uid = params.tor_uid
    trans = params.trans_port
    dns = params.dns_port
    lan_mode = params.mode is Mode.LAN_COMPATIBLE
    lan = params.allowed_lan_cidrs if lan_mode else ()

    # --- NAT table (IPv4): transparent redirect to Tor Trans/DNS ports -------
    nat_body = (
        "\tchain output {\n"
        "\t\ttype nat hook output priority -100; policy accept;\n"
        f'\t\tmeta skuid {uid} accept comment "tor\'s own egress: no redirect"\n'
        '\t\toifname "lo" accept\n'
        f"\t\tip daddr {LOOPBACK_NET4} accept\n"
        f"{_lan_return_rules(lan, chr(9) + chr(9))}"
        f"\t\tudp dport 53 redirect to :{dns}\n"
        f"\t\ttcp dport 53 redirect to :{dns}\n"
        f"\t\tmeta l4proto tcp redirect to :{trans}\n"
        "\t}\n"
        "\tchain prerouting {\n"
        "\t\ttype nat hook prerouting priority -100; policy accept;\n"
        '\t\tiifname "lo" accept\n'
        f"\t\tip daddr {LOOPBACK_NET4} accept\n"
        f"{_lan_return_rules(lan, chr(9) + chr(9))}"
        f"\t\tudp dport 53 redirect to :{dns}\n"
        f"\t\ttcp dport 53 redirect to :{dns}\n"
        f"\t\tmeta l4proto tcp redirect to :{trans}\n"
        "\t}\n"
    )

    # --- Filter table (inet): default-deny; blocks IPv6 and non-Tor egress ---
    # STRICT: local nets are dropped (only Tor path allowed).
    # LAN-COMPAT: explicitly configured CIDRs are accepted.
    strict_drop_local = ""
    if not lan_mode:
        strict_drop_local = (
            f"\t\tip daddr {{ {', '.join(_NON_INTERNET_V4)} }} "
            'drop comment "strict: no direct local-net egress"\n'
        )

    filter_body = (
        # ----- INPUT -----
        "\tchain input {\n"
        "\t\ttype filter hook input priority 0; policy drop;\n"
        '\t\tmeta nfproto ipv6 drop comment "block all IPv6"\n'
        '\t\tiifname "lo" accept\n'
        "\t\tct state established,related accept\n"
        "\t\tct state invalid drop\n"
        + (
            '\t\tudp sport 67 udp dport 68 accept comment "DHCP offer/ack"\n'
            if params.allow_dhcp
            else ""
        )
        + "\t}\n"
        # ----- FORWARD (containers/VMs cannot bypass) -----
        "\tchain forward {\n"
        "\t\ttype filter hook forward priority 0; policy drop;\n"
        "\t\tmeta nfproto ipv6 drop\n"
        "\t\tct state established,related accept\n"
        "\t\tct state invalid drop\n"
        "\t}\n"
        # ----- OUTPUT (the kill switch) -----
        "\tchain output {\n"
        "\t\ttype filter hook output priority 0; policy drop;\n"
        '\t\tmeta nfproto ipv6 drop comment "block all IPv6 egress"\n'
        '\t\toifname "lo" accept\n'
        f'\t\tmeta skuid {uid} accept comment "tor reaches relays directly"\n'
        "\t\tct state established,related accept\n"
        "\t\tct state invalid drop\n"
        + (
            '\t\tudp sport 68 udp dport 67 accept comment "DHCP request"\n'
            if params.allow_dhcp
            else ""
        )
        + _lan_return_rules(lan, "\t\t")
        + strict_drop_local
        + '\t\tudp dport 53 drop comment "no direct DNS (redirected in nat)"\n'
        + '\t\ttcp dport 53 drop comment "no direct DNS"\n'
        + '\t\tmeta l4proto udp drop comment "block non-Tor UDP incl. QUIC"\n'
        + "\t}\n"
    )

    # --- IPv6 table: hard block, route-independent (invariant I7) ------------
    ip6_body = (
        "\tchain output {\n"
        "\t\ttype filter hook output priority 0; policy drop;\n"
        '\t\toifname "lo" accept\n'
        "\t}\n"
        "\tchain input {\n"
        "\t\ttype filter hook input priority 0; policy drop;\n"
        '\t\tiifname "lo" accept\n'
        "\t}\n"
        "\tchain forward {\n"
        "\t\ttype filter hook forward priority 0; policy drop;\n"
        "\t}\n"
    )

    text = (
        "#!/usr/sbin/nft -f\n"
        "# Tor Guard protected ruleset — generated, do not edit by hand.\n"
        f"# mode={params.mode.value} trans={trans} dns={dns} tor_uid={uid}\n\n"
        + _atomic_wrap("ip", _NAT_TABLE, nat_body)
        + "\n"
        + _atomic_wrap("inet", _FILTER_TABLE, filter_body)
        + "\n"
        + _atomic_wrap("ip6", TABLE_IP6, ip6_body)
    )
    return GeneratedRuleset(
        text=text,
        sha256=_sha256(text),
        table_names=(_NAT_TABLE, _FILTER_TABLE, TABLE_IP6),
    )


def generate_emergency() -> GeneratedRuleset:
    """Render the most restrictive lockdown: drop all egress except loopback.

    Needs no Tor, no config beyond built-in defaults. Used by ``emergency-lock``
    and as the safe fallback when anything is uncertain (invariant I13).
    """
    body = (
        "\tchain input {\n"
        "\t\ttype filter hook input priority -300; policy drop;\n"
        '\t\tiifname "lo" accept\n'
        "\t\tct state established,related accept\n"
        "\t}\n"
        "\tchain forward {\n"
        "\t\ttype filter hook forward priority -300; policy drop;\n"
        "\t}\n"
        "\tchain output {\n"
        "\t\ttype filter hook output priority -300; policy drop;\n"
        '\t\toifname "lo" accept\n'
        "\t\tct state established,related accept\n"
        "\t}\n"
    )
    text = (
        "#!/usr/sbin/nft -f\n"
        "# Tor Guard EMERGENCY lockdown — all egress dropped except loopback.\n\n"
        + _atomic_wrap("inet", _EMERGENCY_TABLE, body)
    )
    return GeneratedRuleset(text=text, sha256=_sha256(text), table_names=(_EMERGENCY_TABLE,))


def expected_table_names(mode: Mode) -> tuple[str, ...]:
    """Tables the integrity checker should find in protected mode."""
    del mode  # same set for both modes
    return (_NAT_TABLE, _FILTER_TABLE, TABLE_IP6)


__all__ = [
    "expected_table_names",
    "generate_emergency",
    "generate_protected",
]
