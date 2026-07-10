#!/usr/bin/env bash
#
# OFFLINE RECOVERY — restore direct networking from a local console when the
# tor-guard CLI is unavailable or broken. Readable and auditable by design.
#
# It removes ONLY Tor Guard's own nftables tables. It never runs
# `nft flush ruleset`, so unrelated administrator rules are preserved.
#
# Usage (as root, from a local console):
#   scripts/emergency-recover.sh            # remove Tor Guard tables
#   scripts/emergency-recover.sh --status   # show what would be removed
#
set -Eeuo pipefail

log() { printf '[recover] %s\n' "$*"; }
die() { printf '[recover] ERROR: %s\n' "$*" >&2; exit 1; }

[ "$(id -u)" -eq 0 ] || die "must run as root"
command -v nft >/dev/null 2>&1 || die "nft not found"

# family:table pairs that Tor Guard may create.
TABLES=(
  "ip tor_guard_nat"
  "inet tor_guard_filter"
  "ip6 tor_guard6"
  "inet tor_guard_lock"
)

show_status() {
  log "current Tor Guard tables:"
  local found=0
  for entry in "${TABLES[@]}"; do
    # shellcheck disable=SC2086
    if nft list table $entry >/dev/null 2>&1; then
      printf '  present: %s\n' "$entry"
      found=1
    fi
  done
  [ "$found" -eq 1 ] || log "  (none present)"
}

remove_tables() {
  for entry in "${TABLES[@]}"; do
    # shellcheck disable=SC2086
    if nft list table $entry >/dev/null 2>&1; then
      log "deleting table: $entry"
      # shellcheck disable=SC2086
      nft delete table $entry || log "could not delete $entry (continuing)"
    fi
  done
  log "Tor Guard tables removed. Direct networking should be restored."
  log "If DNS still fails, restart networking:  systemctl restart systemd-networkd || dhclient"
}

main() {
  if [ "${1:-}" = "--status" ]; then
    show_status
    exit 0
  fi
  show_status
  remove_tables
}

main "$@"
