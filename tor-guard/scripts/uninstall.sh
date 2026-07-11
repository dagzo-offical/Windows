#!/usr/bin/env bash
#
# Tor Guard uninstaller bootstrap.
# Removes only Tor-Guard-owned files (via the manifest) and, unless
# --keep-firewall is passed, removes the firewall lock (restoring clearnet).
#
set -Eeuo pipefail

log() { printf '[uninstall] %s\n' "$*"; }
die() { printf '[uninstall] XATOLIK: %s\n' "$*" >&2; exit 1; }

[ "$(id -u)" -eq 0 ] || die "root sifatida ishga tushirilishi kerak (sudo ishlating)"

KEEP_FIREWALL=0
for arg in "$@"; do
  case "$arg" in
    --keep-firewall) KEEP_FIREWALL=1 ;;
    *) die "noma’lum argument: $arg" ;;
  esac
done

if command -v tor-guard >/dev/null 2>&1; then
  if [ "$KEEP_FIREWALL" -eq 1 ]; then
    log "fayllar olib tashlanmoqda, firewall bloki joyida qoldirilmoqda"
    tor-guard uninstall --keep-firewall
  else
    log "fayllar va firewall bloki olib tashlanmoqda (oddiy internet tiklanadi)"
    tor-guard uninstall
  fi
else
  die "tor-guard CLI topilmadi; tarmoqni tiklash uchun scripts/emergency-recover.sh dan foydalaning"
fi

log "Python paketi olib tashlanmoqda"
python3 -m pip uninstall -y tor-guard || log "pip uninstall o‘tkazib yuborildi"

log "tayyor"
