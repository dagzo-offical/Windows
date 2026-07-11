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
die() { printf '[recover] XATOLIK: %s\n' "$*" >&2; exit 1; }

[ "$(id -u)" -eq 0 ] || die "root sifatida ishga tushirilishi kerak"
command -v nft >/dev/null 2>&1 || die "nft topilmadi"

# family:table pairs that Tor Guard may create.
TABLES=(
  "ip tor_guard_nat"
  "inet tor_guard_filter"
  "ip6 tor_guard6"
  "inet tor_guard_lock"
)

show_status() {
  log "joriy Tor Guard jadvallari:"
  local found=0
  for entry in "${TABLES[@]}"; do
    # shellcheck disable=SC2086
    if nft list table $entry >/dev/null 2>&1; then
      printf '  mavjud: %s\n' "$entry"
      found=1
    fi
  done
  [ "$found" -eq 1 ] || log "  (mavjud emas)"
}

remove_tables() {
  for entry in "${TABLES[@]}"; do
    # shellcheck disable=SC2086
    if nft list table $entry >/dev/null 2>&1; then
      log "jadval o‘chirilmoqda: $entry"
      # shellcheck disable=SC2086
      nft delete table $entry || log "$entry o‘chirib bo‘lmadi (davom etilmoqda)"
    fi
  done
  log "Tor Guard jadvallari olib tashlandi. To‘g‘ridan-to‘g‘ri tarmoq tiklanishi kerak."
  log "Agar DNS hali ham ishlamasa, tarmoqni qayta ishga tushiring:  systemctl restart systemd-networkd || dhclient"
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
