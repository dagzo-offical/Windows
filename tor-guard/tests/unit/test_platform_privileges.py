from __future__ import annotations

import pytest

from tor_guard.exceptions import PlatformError, PrivilegeError
from tor_guard.platform import PlatformInfo, detect_platform, is_supported
from tor_guard.privileges import assert_not_world_writable, require_root


def _write_os_release(tmp_path, content):
    path = tmp_path / "os-release"
    path.write_text(content)
    return path


def test_parse_ubuntu_2404(tmp_path):
    path = _write_os_release(
        tmp_path, 'ID=ubuntu\nVERSION_ID="24.04"\nPRETTY_NAME="Ubuntu 24.04"\n'
    )
    info = detect_platform(path)
    assert info.distro_id == "ubuntu"
    assert is_supported(info)


def test_debian12_supported(tmp_path):
    path = _write_os_release(tmp_path, 'ID=debian\nVERSION_ID="12"\n')
    assert is_supported(detect_platform(path))


def test_kali_supported_any_version(tmp_path):
    path = _write_os_release(tmp_path, "ID=kali\nVERSION_ID=2025.1\n")
    assert is_supported(detect_platform(path))


def test_fedora_unsupported(tmp_path):
    path = _write_os_release(tmp_path, 'ID=fedora\nVERSION_ID="40"\n')
    assert not is_supported(detect_platform(path))


def test_old_ubuntu_unsupported(tmp_path):
    path = _write_os_release(tmp_path, 'ID=ubuntu\nVERSION_ID="20.04"\n')
    assert not is_supported(detect_platform(path))


def test_missing_os_release_raises(tmp_path):
    with pytest.raises(PlatformError):
        detect_platform(tmp_path / "does-not-exist")


def test_require_root_raises_when_not_root(monkeypatch):
    monkeypatch.setattr("tor_guard.privileges.is_root", lambda: False)
    with pytest.raises(PrivilegeError):
        require_root("start")


def test_world_writable_rejected(tmp_path):
    f = tmp_path / "secret"
    f.write_text("x")
    f.chmod(0o666)
    with pytest.raises(PrivilegeError, match="world-writable"):
        assert_not_world_writable(f)


def test_non_world_writable_ok(tmp_path):
    f = tmp_path / "secret"
    f.write_text("x")
    f.chmod(0o600)
    assert_not_world_writable(f)  # no raise


def test_is_supported_direct():
    assert is_supported(PlatformInfo("ubuntu", "22.04", "Ubuntu", "Linux"))
