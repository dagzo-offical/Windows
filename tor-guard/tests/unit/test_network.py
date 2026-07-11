from __future__ import annotations

import struct

from tor_guard.network.dns import DnsValidator, build_query, parse_answers
from tor_guard.network.routes import ExternalIPVerifier, VerifyState


# --- DNS --------------------------------------------------------------------
def test_build_query_wellformed():
    q = build_query("example.com", txid=0x1234)
    assert q[:2] == b"\x12\x34"
    assert b"\x07example\x03com\x00" in q


def test_parse_answers_extracts_a_record():
    # header: id, flags(0x8180 = response, no error), qd=1, an=1
    header = struct.pack(">HHHHHH", 1, 0x8180, 1, 1, 0, 0)
    question = b"\x03www\x07example\x03com\x00" + struct.pack(">HH", 1, 1)
    answer = (
        b"\xc0\x0c"  # name pointer
        + struct.pack(">HHIH", 1, 1, 60, 4)  # type A, class IN, ttl, rdlen
        + bytes([93, 184, 216, 34])
    )
    addrs = parse_answers(header + question + answer)
    assert addrs == ["93.184.216.34"]


def test_parse_answers_error_rcode():
    header = struct.pack(">HHHHHH", 1, 0x8183, 1, 0, 0, 0)  # RCODE=3 (NXDOMAIN)
    assert parse_answers(header) == []


def test_dns_validator_uses_injected_query():
    header = struct.pack(">HHHHHH", 1, 0x8180, 1, 1, 0, 0)
    question = b"\x04test\x00" + struct.pack(">HH", 1, 1)
    answer = b"\xc0\x0c" + struct.pack(">HHIH", 1, 1, 60, 4) + bytes([10, 0, 0, 1])

    def fake_query(payload, host, port, timeout):
        assert host == "127.0.0.1"
        return header + question + answer

    v = DnsValidator(query_fn=fake_query)
    result = v.validate_tor_dns(5353)
    assert result.ok
    assert result.addresses == ("10.0.0.1",)


def test_dns_validator_handles_failure():
    def fake_query(*_a):
        raise OSError("blocked")

    result = DnsValidator(query_fn=fake_query).validate_tor_dns(5353)
    assert not result.ok


# --- external IP verification (tri-state) -----------------------------------
def test_confirmed_tor():
    v = ExternalIPVerifier(("https://x",), fetcher=lambda u, t: '{"IsTor": true, "IP": "1.2.3.4"}')
    assert v.verify().state is VerifyState.CONFIRMED_TOR


def test_leak_detected_does_not_leak_ip_in_result():
    v = ExternalIPVerifier(("https://x",), fetcher=lambda u, t: '{"IsTor": false, "IP": "9.9.9.9"}')
    result = v.verify()
    assert result.state is VerifyState.LEAK_DETECTED
    assert "9.9.9.9" not in result.detail  # real IP never recorded


def test_unavailable_when_unreachable():
    def boom(url, timeout):
        raise OSError("network down")

    v = ExternalIPVerifier(("https://x",), fetcher=boom)
    assert v.verify().state is VerifyState.UNAVAILABLE


def test_unavailable_is_not_leak_or_safe():
    v = ExternalIPVerifier(("https://x",), fetcher=lambda u, t: "garbage")
    result = v.verify()
    assert result.state is VerifyState.UNAVAILABLE
    assert not result.is_tor and not result.is_leak
