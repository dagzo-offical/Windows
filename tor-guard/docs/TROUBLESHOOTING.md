# Troubleshooting

Start with:

```bash
tor-guard status
tor-guard doctor
journalctl -u tor-guard-firewall -u tor-guard-monitor -u tor --no-pager | tail -50
tor-guard logs -n 100
```

## No Internet after `start`

Expected if `status` shows `LOCKED` — that is fail-closed behavior, not a bug.
Check why Tor is unhealthy:

- `tor-guard doctor` → look at `tor:transport`, `tor:dnsport`, `tor:circuit`.
- `systemctl status tor` and `journalctl -u tor` → bootstrap errors, wrong
  `User`, port conflicts.
- On a censored network, Tor may not bootstrap without bridges. Tor Guard stays
  locked until Tor reaches 100% — by design.

## `start` aborts at "bootstrap"

Tor didn't reach 100% within `bootstrap_timeout`. Raise the timeout, check
connectivity for the tor uid, or configure bridges in a torrc drop-in. The host
stays locked meanwhile.

## `start` aborts at "required Tor listeners unavailable"

TransPort/DNSPort aren't accepting connections. Verify the drop-in
`/etc/tor/torrc.d/10-tor-guard.conf` matches your config ports and that
`tor --verify-config` passes. Re-run `sudo tor-guard reload`.

## "external-connectivity: verification unavailable"

The check endpoint was unreachable. This is **informational**, not a leak. If
listeners and circuit are healthy, you are still protected (state may show
`DEGRADED`). Try a different `external_ip_endpoints` entry.

## DNS doesn't resolve

- Confirm `dns_port` in config matches the torrc drop-in.
- `dig @127.0.0.1 -p 5353 example.com` should resolve via Tor.
- Direct resolvers (`/etc/resolv.conf` pointing at `8.8.8.8`) are intentionally
  redirected to Tor's DNSPort; that's expected.

## Docker/VM containers lost networking

Container egress that can't be transparently redirected is dropped (fail-closed).
If you need container Internet through Tor, this is a known edge case — see
[`LIMITATIONS.md`](LIMITATIONS.md). Use LAN-COMPATIBLE mode only for local
subnets you trust.

## Firewall rules "keep coming back"

That's the integrity monitor doing its job (invariant I10). To make changes,
edit config and `tor-guard reload`, or `disable` + `unlock-clearnet` first.

## Locked out over SSH

The kill switch can block SSH to the box on hostile networks. Recover from a
**local console**:

```bash
sudo bash scripts/emergency-recover.sh
```

See [`RECOVERY.md`](RECOVERY.md).

## Reinstall / reset

```bash
sudo bash scripts/emergency-recover.sh
sudo tor-guard uninstall
sudo bash scripts/install.sh
```

## Collecting a diagnostics bundle

```bash
tor-guard doctor
```

The diagnostics collector (used by support bundles) redacts secrets and never
includes your real public IP.
