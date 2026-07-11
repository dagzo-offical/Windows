"""Configuration loading and strict schema validation.

Design choices:
  * a frozen dataclass is the in-memory representation, so config is immutable
    once validated;
  * validation is total: unknown top-level keys are rejected, ports and CIDRs
    are parsed and range-checked, and dangerous implicit allowances are refused;
  * defaults are safe (STRICT mode, no LAN allowance, IPv6 blocked).
"""

from __future__ import annotations

import ipaddress
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import yaml

from .constants import (
    BACKUP_DIR,
    CONFIG_PATH,
    DEFAULT_BOOTSTRAP_TIMEOUT,
    DEFAULT_CONTROL_PORT,
    DEFAULT_DNS_PORT,
    DEFAULT_HEALTH_TIMEOUT,
    DEFAULT_MONITOR_INTERVAL,
    DEFAULT_SOCKS_PORT,
    DEFAULT_TOR_USER,
    DEFAULT_TRANS_PORT,
    LOCK_PATH,
    STATE_DIR,
)
from .exceptions import ConfigError
from .state import Mode

_VALID_LOG_LEVELS = {"DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"}

# The complete set of accepted top-level keys. Anything else is rejected so a
# typo like `moode:` cannot silently fall back to an unsafe default.
_KNOWN_KEYS = {
    "mode",
    "tor_user",
    "socks_port",
    "trans_port",
    "dns_port",
    "control_port",
    "allowed_lan_cidrs",
    "interfaces",
    "monitor_interval",
    "health_timeout",
    "bootstrap_timeout",
    "external_ip_endpoints",
    "log_level",
    "auto_restart_tor",
    "backup_dir",
    "state_dir",
    "lock_file",
    "test_mode",
}


def _validate_port(value: Any, name: str) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise ConfigError(f"{name} butun son bo‘lishi kerak, berilgan: {value!r}")
    if not (1 <= value <= 65535):
        raise ConfigError(f"{name} ruxsat etilgan oraliqdan tashqarida (1-65535): {value}")
    return int(value)


def _validate_cidrs(value: Any) -> tuple[str, ...]:
    if value is None:
        return ()
    if not isinstance(value, list):
        raise ConfigError("allowed_lan_cidrs ro‘yxat bo‘lishi kerak")
    out: list[str] = []
    for item in value:
        if not isinstance(item, str):
            raise ConfigError(f"CIDR satr bo‘lishi kerak, berilgan: {item!r}")
        try:
            network = ipaddress.ip_network(item, strict=False)
        except ValueError as exc:
            raise ConfigError(f"noto‘g‘ri CIDR '{item}': {exc}") from exc
        if network.version != 4:
            raise ConfigError(f"faqat IPv4 LAN CIDR ruxsat etiladi (IPv6 bloklangan): {item}")
        if network.is_global:
            raise ConfigError(
                f"allowed_lan_cidrs’da public CIDR rad etildi " f"(Tor’ni chetlab o‘tardi): {item}"
            )
        out.append(str(network))
    return tuple(out)


def _validate_interfaces(value: Any) -> tuple[str, ...]:
    if value is None:
        return ()
    if not isinstance(value, list) or not all(isinstance(i, str) and i for i in value):
        raise ConfigError("interfaces bo‘sh bo‘lmagan satrlar ro‘yxati bo‘lishi kerak")
    for name in value:
        if len(name) > 15 or not all(c.isalnum() or c in "._-@" for c in name):
            raise ConfigError(f"noto‘g‘ri interfeys nomi: {name!r}")
    return tuple(value)


def _validate_endpoints(value: Any) -> tuple[str, ...]:
    default = ("https://check.torproject.org/api/ip",)
    if value is None:
        return default
    if not isinstance(value, list) or not all(isinstance(i, str) for i in value):
        raise ConfigError("external_ip_endpoints URL manzillar ro‘yxati bo‘lishi kerak")
    for url in value:
        if not url.startswith("https://"):
            raise ConfigError(f"external_ip_endpoints https URL bo‘lishi kerak: {url}")
    return tuple(value) or default


def _positive_int(value: Any, name: str, *, minimum: int = 1) -> int:
    if isinstance(value, bool) or not isinstance(value, int) or value < minimum:
        raise ConfigError(f"{name} butun son bo‘lishi kerak (>= {minimum}), berilgan: {value!r}")
    return int(value)


@dataclass(frozen=True)
class Config:
    mode: Mode = Mode.STRICT
    tor_user: str = DEFAULT_TOR_USER
    socks_port: int = DEFAULT_SOCKS_PORT
    trans_port: int = DEFAULT_TRANS_PORT
    dns_port: int = DEFAULT_DNS_PORT
    control_port: int = DEFAULT_CONTROL_PORT
    allowed_lan_cidrs: tuple[str, ...] = ()
    interfaces: tuple[str, ...] = ()
    monitor_interval: int = DEFAULT_MONITOR_INTERVAL
    health_timeout: int = DEFAULT_HEALTH_TIMEOUT
    bootstrap_timeout: int = DEFAULT_BOOTSTRAP_TIMEOUT
    external_ip_endpoints: tuple[str, ...] = ("https://check.torproject.org/api/ip",)
    log_level: str = "INFO"
    auto_restart_tor: bool = True
    backup_dir: Path = BACKUP_DIR
    state_dir: Path = STATE_DIR
    lock_file: Path = LOCK_PATH
    test_mode: bool = False

    def __post_init__(self) -> None:
        # Ports must be distinct — overlapping listeners would break redirection.
        ports = {
            "socks_port": self.socks_port,
            "trans_port": self.trans_port,
            "dns_port": self.dns_port,
            "control_port": self.control_port,
        }
        if len(set(ports.values())) != len(ports):
            raise ConfigError(f"Tor portlari bir-biridan farqli bo‘lishi kerak: {ports}")
        if self.mode is Mode.LAN_COMPATIBLE and not self.allowed_lan_cidrs:
            raise ConfigError(
                "lan-compatible rejimi allowed_lan_cidrs’da kamida bitta yozuvni talab qiladi",
                hint="ishonchli quyi tarmoqlarni ko‘rsating, masalan ['192.168.1.0/24']",
            )
        if self.mode is Mode.STRICT and self.allowed_lan_cidrs:
            raise ConfigError(
                "strict rejimida allowed_lan_cidrs bo‘sh bo‘lishi kerak",
                hint=(
                    "mahalliy quyi tarmoqlarga ruxsat berish uchun "
                    "rejimni 'lan-compatible'ga o‘zgartiring"
                ),
            )


def _from_mapping(raw: dict[str, Any]) -> Config:
    unknown = set(raw) - _KNOWN_KEYS
    if unknown:
        raise ConfigError(f"noma’lum sozlama kalitlari: {sorted(unknown)}")

    mode_raw = raw.get("mode", "strict")
    try:
        mode = Mode(str(mode_raw).lower())
    except ValueError as exc:
        raise ConfigError(
            f"noto‘g‘ri rejim '{mode_raw}' ('strict' yoki 'lan-compatible' kutilgan)"
        ) from exc

    tor_user = raw.get("tor_user", DEFAULT_TOR_USER)
    if (
        not isinstance(tor_user, str)
        or not tor_user
        or not all(c.isalnum() or c in "._-" for c in tor_user)
    ):
        raise ConfigError(f"noto‘g‘ri tor_user: {tor_user!r}")

    log_level = str(raw.get("log_level", "INFO")).upper()
    if log_level not in _VALID_LOG_LEVELS:
        raise ConfigError(
            f"noto‘g‘ri log_level '{log_level}'; "
            f"quyidagilardan biri kutilgan {_VALID_LOG_LEVELS}"
        )

    auto_restart = raw.get("auto_restart_tor", True)
    if not isinstance(auto_restart, bool):
        raise ConfigError("auto_restart_tor mantiqiy (boolean) qiymat bo‘lishi kerak")
    test_mode = raw.get("test_mode", False)
    if not isinstance(test_mode, bool):
        raise ConfigError("test_mode mantiqiy (boolean) qiymat bo‘lishi kerak")

    return Config(
        mode=mode,
        tor_user=tor_user,
        socks_port=_validate_port(raw.get("socks_port", DEFAULT_SOCKS_PORT), "socks_port"),
        trans_port=_validate_port(raw.get("trans_port", DEFAULT_TRANS_PORT), "trans_port"),
        dns_port=_validate_port(raw.get("dns_port", DEFAULT_DNS_PORT), "dns_port"),
        control_port=_validate_port(raw.get("control_port", DEFAULT_CONTROL_PORT), "control_port"),
        allowed_lan_cidrs=_validate_cidrs(raw.get("allowed_lan_cidrs")),
        interfaces=_validate_interfaces(raw.get("interfaces")),
        monitor_interval=_positive_int(
            raw.get("monitor_interval", DEFAULT_MONITOR_INTERVAL), "monitor_interval"
        ),
        health_timeout=_positive_int(
            raw.get("health_timeout", DEFAULT_HEALTH_TIMEOUT), "health_timeout"
        ),
        bootstrap_timeout=_positive_int(
            raw.get("bootstrap_timeout", DEFAULT_BOOTSTRAP_TIMEOUT), "bootstrap_timeout"
        ),
        external_ip_endpoints=_validate_endpoints(raw.get("external_ip_endpoints")),
        log_level=log_level,
        auto_restart_tor=auto_restart,
        backup_dir=Path(str(raw.get("backup_dir", BACKUP_DIR))),
        state_dir=Path(str(raw.get("state_dir", STATE_DIR))),
        lock_file=Path(str(raw.get("lock_file", LOCK_PATH))),
        test_mode=test_mode,
    )


def load_config(path: Path = CONFIG_PATH) -> Config:
    """Load, parse, and strictly validate configuration from *path*."""
    try:
        text = path.read_text(encoding="utf-8")
    except FileNotFoundError as exc:
        raise ConfigError(
            f"sozlama fayli topilmadi: {path}",
            hint="'tor-guard install' ni bajaring yoki config/tor-guard.example.yml ni nusxalang",
        ) from exc
    except OSError as exc:
        raise ConfigError(f"sozlama faylini o‘qib bo‘lmadi {path}: {exc}") from exc
    return parse_config(text)


def parse_config(text: str) -> Config:
    """Parse and validate YAML *text* into a :class:`Config`."""
    try:
        raw = yaml.safe_load(text)
    except yaml.YAMLError as exc:
        raise ConfigError(f"noto‘g‘ri YAML: {exc}") from exc
    if raw is None:
        raw = {}
    if not isinstance(raw, dict):
        raise ConfigError("sozlama ildizi (root) mapping bo‘lishi kerak")
    return _from_mapping(raw)


__all__ = ["Config", "load_config", "parse_config"]
