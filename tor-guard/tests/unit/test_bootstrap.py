from __future__ import annotations

import pytest

from tor_guard.exceptions import BootstrapTimeout
from tor_guard.tor.bootstrap import parse_bootstrap, wait_for_bootstrap


def test_parse_control_reply():
    line = (
        'status/bootstrap-phase=NOTICE BOOTSTRAP PROGRESS=50 TAG=loading_status SUMMARY="Loading"'
    )
    status = parse_bootstrap(line)
    assert status is not None
    assert status.percent == 50
    assert status.summary == "Loading"


def test_parse_log_line():
    status = parse_bootstrap("Bootstrapped 100% (done): Done")
    assert status is not None and status.complete


def test_parse_none():
    assert parse_bootstrap("no percentage here") is None


def test_percent_clamped():
    assert parse_bootstrap("PROGRESS=250").percent == 100


def test_wait_succeeds():
    seq = iter([parse_bootstrap("PROGRESS=10"), parse_bootstrap("PROGRESS=100")])
    result = wait_for_bootstrap(
        lambda: next(seq),
        timeout=10,
        interval=0,
        sleep=lambda _: None,
        now=_fake_clock([0, 1, 2]),
    )
    assert result.complete


def test_wait_times_out():
    ticks = _fake_clock([0, 1, 2, 11])
    with pytest.raises(BootstrapTimeout):
        wait_for_bootstrap(
            lambda: parse_bootstrap("PROGRESS=30"),
            timeout=10,
            interval=0,
            sleep=lambda _: None,
            now=ticks,
        )


def _fake_clock(values):
    it = iter(values)
    last = [0.0]

    def now():
        try:
            last[0] = next(it)
        except StopIteration:
            last[0] += 100
        return last[0]

    return now
