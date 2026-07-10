#!/usr/bin/env bash
#
# Shared VM provisioner: install Tor Guard, activate protected mode, run leak
# tests and failure simulations, then collect results. Runs INSIDE a disposable
# VM only (set TOR_GUARD_DISPOSABLE_VM=1). Invoked by the per-distro Vagrantfiles.
#
set -Eeuo pipefail

REPO_DIR="${1:-/vagrant}"
RESULT_DIR="${2:-/vagrant/results}"
export TOR_GUARD_DISPOSABLE_VM=1

mkdir -p "$RESULT_DIR"
exec > >(tee "$RESULT_DIR/provision.log") 2>&1

echo "[provision] $(. /etc/os-release; echo "$PRETTY_NAME")"

bash "$REPO_DIR/tor-guard/scripts/install.sh"
tor-guard config validate | tee "$RESULT_DIR/config-validate.txt"

echo "[provision] activating protected mode"
if tor-guard start | tee "$RESULT_DIR/start.txt"; then
  echo "[provision] protected"
else
  echo "[provision] start did not reach protected (see start.txt)"
fi

tor-guard status | tee "$RESULT_DIR/status.txt" || true

echo "[provision] leak tests"
tor-guard test-leaks --i-understand | tee "$RESULT_DIR/leaks.txt" || true

echo "[provision] failure simulation: stop Tor, expect no clearnet"
systemctl stop tor.service || true
if timeout 8 curl -s https://example.com >/dev/null 2>&1; then
  echo "FAIL: clearnet reachable after Tor stop" | tee -a "$RESULT_DIR/failure-sim.txt"
else
  echo "PASS: no clearnet after Tor stop" | tee -a "$RESULT_DIR/failure-sim.txt"
fi

echo "[provision] firewall tamper simulation"
nft flush chain inet tor_guard_filter output 2>/dev/null || true
sleep 15  # allow the monitor to detect and restore
tor-guard verify | tee "$RESULT_DIR/verify-after-tamper.txt" || true

echo "[provision] restoring clearnet"
tor-guard unlock-clearnet --yes || true

echo "[provision] done — results in $RESULT_DIR"
