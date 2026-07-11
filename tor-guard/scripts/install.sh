#!/usr/bin/env bash
#
# Tor Guard installer bootstrap.
# Installs system dependencies, the Python package, and the Tor Guard files.
# Refuses to run on unsupported platforms and leaves the host unchanged on error.
#
set -Eeuo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
readonly REPO_DIR

log()  { printf '[install] %s\n' "$*"; }
die()  { printf '[install] XATOLIK: %s\n' "$*" >&2; exit 1; }

require_root() {
  [ "$(id -u)" -eq 0 ] || die "root sifatida ishga tushirilishi kerak (sudo ishlating)"
}

check_platform() {
  [ -r /etc/os-release ] || die "/etc/os-release o‘qib bo‘lmadi"
  # shellcheck disable=SC1091
  . /etc/os-release
  case "${ID:-}" in
    ubuntu)
      case "${VERSION_ID:-}" in
        22.04|24.04) : ;;
        *) die "qo‘llab-quvvatlanmaydigan Ubuntu ${VERSION_ID:-?} (22.04 yoki 24.04 kerak)";;
      esac ;;
    debian)
      case "${VERSION_ID:-}" in
        12*) : ;;
        *) die "qo‘llab-quvvatlanmaydigan Debian ${VERSION_ID:-?} (12 kerak)";;
      esac ;;
    kali) : ;;
    *) die "qo‘llab-quvvatlanmaydigan distributiv '${ID:-unknown}'";;
  esac
  log "platforma OK: ${PRETTY_NAME:-$ID}"
}

install_deps() {
  log "tizim dependency’lari o‘rnatilmoqda (nftables, tor, python3)"
  export DEBIAN_FRONTEND=noninteractive
  apt-get update -qq
  apt-get install -y --no-install-recommends nftables tor python3 python3-pip python3-venv
}

install_package() {
  log "tor-guard Python paketi o‘rnatilmoqda"
  python3 -m pip install --break-system-packages "${REPO_DIR}" \
    || python3 -m pip install "${REPO_DIR}"
}

run_installer() {
  log "'tor-guard install' bajarilmoqda"
  tor-guard install --resource-dir "${REPO_DIR}"
}

main() {
  require_root
  check_platform
  install_deps
  install_package
  run_installer
  log "tayyor. /etc/tor-guard/tor-guard.yml ni ko‘rib chiqing, so‘ng bajaring: sudo tor-guard start"
  log "yuklanishda yoqish uchun: sudo tor-guard enable"
}

main "$@"
