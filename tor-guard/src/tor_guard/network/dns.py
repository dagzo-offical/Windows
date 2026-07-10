"""DNS-through-Tor validation using a tiny standard-library DNS client.

We build and parse minimal DNS A-record queries (no third-party dependency) so we
can:
  * confirm Tor's ``DNSPort`` resolves names (positive check);
  * confirm a *direct* query to an external resolver fails (leak check).

Limitation documented in ``docs/LIMITATIONS.md``: application-level DoH/DoT is
opaque TCP on 443/853 and is redirected through Tor rather than blocked; we
cannot force such apps onto Tor's resolver.
"""

from __future__ import annotations

import secrets
import socket
import struct
from collections.abc import Callable
from dataclasses import dataclass

from ..constants import LOOPBACK4
from ..logging_config import get_logger

_log = get_logger("network.dns")

# Injectable UDP round-trip: (payload, host, port, timeout) -> response bytes.
UdpQueryFn = Callable[[bytes, str, int, float], bytes]


def build_query(name: str, *, txid: int | None = None) -> bytes:
    """Build a minimal DNS A-record query packet."""
    txid = txid if txid is not None else secrets.randbelow(0xFFFF)
    header = struct.pack(">HHHHHH", txid, 0x0100, 1, 0, 0, 0)  # RD=1
    qname = (
        b"".join(
            bytes([len(label)]) + label.encode("idna") for label in name.rstrip(".").split(".")
        )
        + b"\x00"
    )
    question = qname + struct.pack(">HH", 1, 1)  # QTYPE=A, QCLASS=IN
    return header + question


def parse_answers(response: bytes) -> list[str]:
    """Parse A records out of a DNS response. Returns dotted-quad strings."""
    if len(response) < 12:
        return []
    _txid, flags, qd, an, _ns, _ar = struct.unpack(">HHHHHH", response[:12])
    if an == 0 or (flags & 0x000F) != 0:  # non-zero RCODE => error
        return []
    offset = 12
    for _ in range(qd):  # skip question section
        while offset < len(response) and response[offset] != 0:
            offset += response[offset] + 1
        offset += 5  # null byte + QTYPE + QCLASS
    addrs: list[str] = []
    for _ in range(an):
        if offset + 12 > len(response):
            break
        offset += 2  # name pointer
        rtype, _rclass, _ttl, rdlen = struct.unpack(">HHIH", response[offset : offset + 10])
        offset += 10
        if rtype == 1 and rdlen == 4:  # A record
            addrs.append(".".join(str(b) for b in response[offset : offset + 4]))
        offset += rdlen
    return addrs


def _udp_query(payload: bytes, host: str, port: int, timeout: float) -> bytes:
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
        sock.settimeout(timeout)
        sock.sendto(payload, (host, port))
        data, _ = sock.recvfrom(4096)
        return data


@dataclass(frozen=True)
class DnsResult:
    ok: bool
    addresses: tuple[str, ...]
    detail: str = ""


class DnsValidator:
    def __init__(self, *, timeout: float = 5.0, query_fn: UdpQueryFn = _udp_query) -> None:
        self._timeout = timeout
        self._query = query_fn

    def resolve_via(self, name: str, host: str, port: int) -> DnsResult:
        payload = build_query(name)
        try:
            response = self._query(payload, host, port, self._timeout)
        except OSError as exc:
            return DnsResult(False, (), f"query failed: {exc}")
        addrs = parse_answers(response)
        return DnsResult(bool(addrs), tuple(addrs), "" if addrs else "no answers")

    def validate_tor_dns(self, dns_port: int, *, name: str = "check.torproject.org") -> DnsResult:
        """Positive check: Tor's DNSPort resolves *name*."""
        result = self.resolve_via(name, LOOPBACK4, dns_port)
        if result.ok:
            _log.info("Tor DNSPort resolved a name successfully (%d addr)", len(result.addresses))
        else:
            _log.warning("Tor DNSPort failed to resolve: %s", result.detail)
        return result


__all__ = ["DnsResult", "DnsValidator", "build_query", "parse_answers"]
