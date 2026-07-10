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
die()  { printf '[install] ERROR: %s\n' "$*" >&2; exit 1; }

require_root() {
  [ "$(id -u)" -eq 0 ] || die "must run as root (use sudo)"
}

check_platform() {
  [ -r /etc/os-release ] || die "cannot read /etc/os-release"
  # shellcheck disable=SC1091
  . /etc/os-release
  case "${ID:-}" in
    ubuntu)
      case "${VERSION_ID:-}" in
        22.04|24.04) : ;;
        *) die "unsupported Ubuntu ${VERSION_ID:-?} (need 22.04 or 24.04)";;
      esac ;;
    debian)
      case "${VERSION_ID:-}" in
        12*) : ;;
        *) die "unsupported Debian ${VERSION_ID:-?} (need 12)";;
      esac ;;
    kali) : ;;
    *) die "unsupported distribution '${ID:-unknown}'";;
  esac
  log "platform OK: ${PRETTY_NAME:-$ID}"
}

install_deps() {
  log "installing system dependencies (nftables, tor, python3)"
  export DEBIAN_FRONTEND=noninteractive
  apt-get update -qq
  apt-get install -y --no-install-recommends nftables tor python3 python3-pip python3-venv
}

install_package() {
  log "installing the tor-guard Python package"
  python3 -m pip install --break-system-packages "${REPO_DIR}" \
    || python3 -m pip install "${REPO_DIR}"
}

run_installer() {
  log "running 'tor-guard install'"
  tor-guard install --resource-dir "${REPO_DIR}"
}

main() {
  require_root
  check_platform
  install_deps
  install_package
  run_installer
  log "done. Review /etc/tor-guard/tor-guard.yml, then run: sudo tor-guard start"
  log "enable at boot with: sudo tor-guard enable"
}

main "$@"
