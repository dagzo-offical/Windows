from __future__ import annotations

from tor_guard.install.backup import BackupManager
from tor_guard.install.manifest import Manifest
from tor_guard.install.rollback import RollbackJournal


def test_manifest_roundtrip(tmp_path):
    f = tmp_path / "file.conf"
    f.write_text("content")
    manifest = Manifest()
    entry = manifest.record(f, owned=True)
    assert entry.sha256
    path = tmp_path / "manifest.json"
    manifest.save(path)
    loaded = Manifest.load(path)
    assert loaded is not None
    assert loaded.entries[0].path == str(f)
    assert loaded.entries[0].owned is True


def test_backup_and_restore_preserves_content(tmp_path):
    original = tmp_path / "torrc"
    original.write_text("original content")
    original.chmod(0o640)
    mgr = BackupManager(tmp_path / "backups")
    records = mgr.back_up([original])
    assert records[0].existed
    original.write_text("modified")
    BackupManager.restore(records[0])
    assert original.read_text() == "original content"


def test_backup_nonexistent_then_restore_removes(tmp_path):
    missing = tmp_path / "not-there"
    mgr = BackupManager(tmp_path / "backups")
    records = mgr.back_up([missing])
    assert not records[0].existed
    # simulate our install creating it
    missing.write_text("we created this")
    BackupManager.restore(records[0])
    assert not missing.exists()  # restore = remove what we added


def test_rollback_undoes_in_reverse():
    order = []
    journal = RollbackJournal()
    journal.record("a", lambda: order.append("undo-a"))
    journal.record("b", lambda: order.append("undo-b"))
    failures = journal.rollback()
    assert failures == []
    assert order == ["undo-b", "undo-a"]


def test_rollback_continues_past_failure():
    order = []
    journal = RollbackJournal()
    journal.record("ok", lambda: order.append("ok"))

    def boom():
        raise RuntimeError("nope")

    journal.record("boom", boom)
    failures = journal.rollback()
    assert len(failures) == 1
    assert order == ["ok"]  # earlier action still ran


def test_commit_clears_journal():
    journal = RollbackJournal()
    journal.record("x", lambda: None)
    journal.commit()
    assert journal.rollback() == []
