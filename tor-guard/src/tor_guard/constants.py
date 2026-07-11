"""Central constants: paths, table/chain names, defaults, exit codes.

Nothing here is secret. Ports and users are *defaults*; the real values always
come from validated configuration (:mod:`tor_guard.config`).
"""

from __future__ import annotations

from pathlib import Path
from typing import Final

APP_NAME: Final = "tor-guard"
APP_VERSION: Final = "1.0.0"

# --- Filesystem layout (all root-owned, non-world-writable) -----------------
ETC_DIR: Final = Path("/etc/tor-guard")
CONFIG_PATH: Final = ETC_DIR / "tor-guard.yml"
STATE_DIR: Final = Path("/var/lib/tor-guard")
STATE_PATH: Final = STATE_DIR / "state.json"
BACKUP_DIR: Final = STATE_DIR / "backups"
MANIFEST_PATH: Final = STATE_DIR / "manifest.json"
LOCK_PATH: Final = Path("/run/tor-guard.lock")
LOG_DIR: Final = Path("/var/log/tor-guard")
LOG_PATH: Final = LOG_DIR / "tor-guard.log"
AUDIT_LOG_PATH: Final = LOG_DIR / "audit.log"

RULESET_LIVE_PATH: Final = STATE_DIR / "active.nft"

# Directory / file permission modes (octal) enforced everywhere.
DIR_MODE: Final = 0o700
FILE_MODE: Final = 0o600
CONFIG_MODE: Final = 0o600

# --- nftables identity ------------------------------------------------------
# A single dedicated table keeps integrity checks and teardown precise; we never
# touch the user's other tables and never run `nft flush ruleset`.
TABLE_INET: Final = "tor_guard"
TABLE_IP6: Final = "tor_guard6"
CHAIN_OUTPUT: Final = "output"
CHAIN_PREROUTING: Final = "prerouting"
CHAIN_NAT_OUTPUT: Final = "nat_output"
CHAIN_FORWARD: Final = "forward"
CHAIN_INPUT: Final = "input"

# --- Tor defaults (overridable via config) ----------------------------------
DEFAULT_TOR_USER: Final = "debian-tor"
DEFAULT_SOCKS_PORT: Final = 9050
DEFAULT_TRANS_PORT: Final = 9040
DEFAULT_DNS_PORT: Final = 5353
DEFAULT_CONTROL_PORT: Final = 9051
LOOPBACK4: Final = "127.0.0.1"
LOOPBACK6: Final = "::1"

# systemd unit names
UNIT_FIREWALL: Final = "tor-guard-firewall.service"
UNIT_MONITOR: Final = "tor-guard-monitor.service"
UNIT_TARGET: Final = "tor-guard.target"
UNIT_TOR: Final = "tor.service"

# --- Timeouts (seconds) -----------------------------------------------------
DEFAULT_BOOTSTRAP_TIMEOUT: Final = 120
DEFAULT_HEALTH_TIMEOUT: Final = 15
DEFAULT_MONITOR_INTERVAL: Final = 10
SUBPROCESS_DEFAULT_TIMEOUT: Final = 30

# Networks that STRICT mode treats as non-Internet and (unless LAN-compatible)
# drops. Used by the ruleset generator.
RFC1918: Final = ("10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16")
LINK_LOCAL4: Final = "169.254.0.0/16"
LOOPBACK_NET4: Final = "127.0.0.0/8"
MULTICAST4: Final = "224.0.0.0/4"
BROADCAST4: Final = "255.255.255.255/32"
SPECIAL4: Final = ("100.64.0.0/10", "192.0.0.0/24", "198.18.0.0/15")

# Supported distributions: (ID, VERSION_ID-prefix or None for any)
SUPPORTED_DISTROS: Final = (
    ("ubuntu", "24.04"),
    ("ubuntu", "22.04"),
    ("debian", "12"),
    ("kali", None),
)


class ExitCode:
    """Process exit codes used by the CLI (stable, documented)."""

    OK: Final = 0
    GENERIC_ERROR: Final = 1
    NOT_ROOT: Final = 2
    UNSUPPORTED_PLATFORM: Final = 3
    MISSING_DEPENDENCY: Final = 4
    INVALID_CONFIG: Final = 5
    FIREWALL_ERROR: Final = 6
    TOR_ERROR: Final = 7
    VERIFICATION_FAILED: Final = 8
    LOCKED: Final = 9
