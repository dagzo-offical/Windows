#!/usr/bin/env bash
#
# Run Tor Guard integration + leak tests INSIDE a disposable VM.
# This script is destructive to networking; it refuses to run unless the
# TOR_GUARD_DISPOSABLE_VM=1 opt-in flag is set (do NOT run on a workstation).
#
set -Eeuo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
readonly REPO_DIR

log() { printf '[vm-test] %s\n' "$*"; }
die() { printf '[vm-test] ERROR: %s\n' "$*" >&2; exit 1; }

[ "$(id -u)" -eq 0 ] || die "must run as root"
[ "${TOR_GUARD_DISPOSABLE_VM:-0}" = "1" ] \
  || die "refusing to run outside a disposable VM; set TOR_GUARD_DISPOSABLE_VM=1"

log "1/7 installing"
bash "${REPO_DIR}/scripts/install.sh"

log "2/7 validating config"
tor-guard config validate

log "3/7 starting protected mode"
tor-guard start || die "start did not reach protected"

log "4/7 status"
tor-guard status

log "5/7 leak tests"
tor-guard test-leaks --i-understand || die "leak tests reported a leak"

log "6/7 simulating Tor failure (must stay locked)"
systemctl stop tor.service
if timeout 8 curl -s https://example.com >/dev/null 2>&1; then
  die "LEAK: clearnet reachable after Tor stopped"
fi
log "   good: no clearnet after Tor stopped"

log "7/7 restoring"
tor-guard unlock-clearnet --yes

log "integration test complete"
