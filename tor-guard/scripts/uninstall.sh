#!/usr/bin/env bash
#
# Tor Guard uninstaller bootstrap.
# Removes only Tor-Guard-owned files (via the manifest) and, unless
# --keep-firewall is passed, removes the firewall lock (restoring clearnet).
#
set -Eeuo pipefail

log() { printf '[uninstall] %s\n' "$*"; }
die() { printf '[uninstall] ERROR: %s\n' "$*" >&2; exit 1; }

[ "$(id -u)" -eq 0 ] || die "must run as root (use sudo)"

KEEP_FIREWALL=0
for arg in "$@"; do
  case "$arg" in
    --keep-firewall) KEEP_FIREWALL=1 ;;
    *) die "unknown argument: $arg" ;;
  esac
done

if command -v tor-guard >/dev/null 2>&1; then
  if [ "$KEEP_FIREWALL" -eq 1 ]; then
    log "removing files, keeping firewall lock in place"
    tor-guard uninstall --keep-firewall
  else
    log "removing files and firewall lock (clearnet will be restored)"
    tor-guard uninstall
  fi
else
  die "tor-guard CLI not found; use scripts/emergency-recover.sh to restore networking"
fi

log "removing the Python package"
python3 -m pip uninstall -y tor-guard || log "pip uninstall skipped"

log "done"
