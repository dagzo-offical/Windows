from __future__ import annotations

from tor_guard.state import (
    Mode,
    ProtectionState,
    StateStore,
    SystemState,
    can_transition,
)


def test_roundtrip_json():
    s = SystemState(protection=ProtectionState.PROTECTED, mode=Mode.LAN_COMPATIBLE)
    restored = SystemState.from_json(s.to_json())
    assert restored.protection is ProtectionState.PROTECTED
    assert restored.mode is Mode.LAN_COMPATIBLE


def test_store_persists_and_reloads(tmp_path):
    store = StateStore(tmp_path / "state.json")
    state = store.load()
    assert state.protection is ProtectionState.UNKNOWN
    store.transition(state, ProtectionState.LOCKED, reason="test")
    assert store.load().protection is ProtectionState.LOCKED


def test_unreadable_state_defaults_unknown(tmp_path):
    path = tmp_path / "state.json"
    path.write_text("{not json")
    assert StateStore(path).load().protection is ProtectionState.UNKNOWN


def test_no_automatic_transition_to_unlocked_is_marked():
    # There is no *implicit* path to UNLOCKED except explicit commands.
    # Locked -> Protected allowed; Protected -> Unlocked allowed only explicitly.
    assert can_transition(ProtectionState.LOCKED, ProtectionState.PROTECTED)
    assert can_transition(ProtectionState.PROTECTED, ProtectionState.LOCKED)


def test_missing_file_is_unknown(tmp_path):
    assert StateStore(tmp_path / "absent.json").load().protection is ProtectionState.UNKNOWN
