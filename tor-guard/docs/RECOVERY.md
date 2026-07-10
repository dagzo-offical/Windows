# Recovery

Tor Guard is fail-closed: when something goes wrong you lose Internet access,
not your anonymity. This guide restores networking safely.

## 1. Understand the state first

```bash
tor-guard status      # PROTECTED / LOCKED / DEGRADED / UNLOCKED
tor-guard doctor      # what specifically is unhealthy
journalctl -u tor-guard-firewall -u tor-guard-monitor --no-pager | tail
```

- `LOCKED` is **by design** when Tor is unhealthy. Fixing Tor (or waiting for
  the monitor to restart it) usually returns you to `PROTECTED`.
- A failed external-IP check reports *verification unavailable*, which is **not**
  proof of a leak or of breakage.

## 2. Restore clearnet on purpose (normal path)

```bash
sudo tor-guard unlock-clearnet
# or restore a specific verified backup:
sudo tor-guard unlock-clearnet --backup /var/lib/tor-guard/backups/ruleset-<ts>.nft
```

This is a separate, explicit, audited action. It removes Tor Guard's tables
(and optionally restores a captured backup) — it never blindly flushes the
whole ruleset, and it preserves unrelated administrator rules.

## 3. Offline recovery (CLI broken / no login shell)

From a **local console** (not SSH, which the kill switch may block):

```bash
sudo bash /path/to/tor-guard/scripts/emergency-recover.sh --status   # preview
sudo bash /path/to/tor-guard/scripts/emergency-recover.sh            # remove tables
```

`emergency-recover.sh` is deliberately short and auditable. It:

- deletes **only** `tor_guard_nat`, `tor_guard_filter`, `tor_guard6`, and
  `tor_guard_lock`;
- **never** runs `nft flush ruleset`;
- prints how to restart DHCP/networking if DNS is still down.

If networking is still broken afterwards:

```bash
sudo systemctl restart systemd-networkd  # or: sudo dhclient <iface>
sudo systemctl restart NetworkManager    # NM-managed hosts
```

## 4. Recovering from a failed install/update

The installer is transactional. A failed install rolls back its recorded
actions automatically; if rollback can't fully restore, it engages the
emergency lock (host **locked**, not open). To finish cleanup manually:

```bash
sudo bash scripts/emergency-recover.sh          # drop any Tor Guard tables
sudo tor-guard uninstall || true                # remove manifest-owned files
```

The installation manifest (`/var/lib/tor-guard/manifest.json`) lists exactly
what Tor Guard owns, so recovery never touches your other configuration.

## 5. Disable at boot

```bash
sudo tor-guard disable      # stop starting at boot (does NOT unlock clearnet)
```

To fully return to a normal host: `disable`, then `unlock-clearnet`, then
`uninstall`.

## Failure-state summary

See the authoritative table in
[`SECURITY_INVARIANTS.md`](SECURITY_INVARIANTS.md#failure-state-table-authoritative).
Every listed failure resolves to *blocked* or *locked*, never to clearnet.
