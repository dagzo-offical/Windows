# Tor Guard

**Fail-closed, system-wide Tor transparent-proxy kill switch for Linux workstations.**

Tor Guard forces all supported outbound TCP through Tor, routes DNS through
Tor, and blocks everything that cannot be routed through Tor. If Tor stops,
crashes, fails validation, or the firewall is tampered with, outbound Internet
connectivity **stays blocked** — traffic never silently falls back to your real
network.

> ## ⚠️ Anonymity disclaimer — read this first
>
> Tor Guard reduces **accidental** exposure of your real IP address and DNS
> queries. It is **not** an anonymity guarantee. It **cannot** protect you
> against a compromised host or kernel, a root-level attacker on the machine,
> global passive adversaries, traffic-correlation attacks, browser/TLS
> fingerprinting, malicious documents, malware, endpoint telemetry, logging
> into personal accounts, or other operational-security mistakes. For browsing,
> use the Tor Browser. See [`docs/LIMITATIONS.md`](docs/LIMITATIONS.md) and
> [`docs/THREAT_MODEL.md`](docs/THREAT_MODEL.md).

## Supported systems

- Ubuntu 24.04 LTS, Ubuntu 22.04 LTS, Debian 12, current Kali (Debian-based)
- Init: **systemd** · Firewall: **nftables only** · Python **3.11+**

The installer refuses to run on anything else, leaving the host unchanged.

## Architecture at a glance

```
 user apps ──┬─ TCP ───▶ nftables NAT ─redirect─▶ Tor TransPort (127.0.0.1:9040) ─▶ Tor ─▶ Internet
             └─ DNS ───▶ nftables NAT ─redirect─▶ Tor DNSPort  (127.0.0.1:5353)
 everything else (IPv6, UDP/QUIC, direct TCP, direct DNS) ─────▶ DROP  (default-deny)
 only the dedicated tor uid may egress directly (to reach relays)
```

The kill switch is a dedicated set of nftables tables applied atomically. A
monitor daemon re-asserts the ruleset if it is tampered with and restarts Tor if
it dies — but it **never** restores clearnet. Full design:
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md),
[`docs/SECURITY_INVARIANTS.md`](docs/SECURITY_INVARIANTS.md).

## Installation

```bash
sudo bash scripts/install.sh          # installs deps + package + files
sudoedit /etc/tor-guard/tor-guard.yml # review configuration
sudo tor-guard start                  # apply kill switch, start Tor, verify
sudo tor-guard enable                 # persist across reboot (fail-closed at boot)
```

Full guide: [`docs/INSTALLATION.md`](docs/INSTALLATION.md).

## Basic usage

```bash
tor-guard status            # protection state and mode
tor-guard doctor            # non-destructive health check
tor-guard verify            # confirm protection is intact
tor-guard test-leaks --i-understand   # active leak probes (disposable VM)
sudo tor-guard restart      # re-apply firewall + Tor with no open window
sudo tor-guard stop         # stop services — CLEARNET STAYS BLOCKED
sudo tor-guard emergency-lock         # most-restrictive lockdown (no Tor needed)
sudo tor-guard unlock-clearnet        # explicit, audited restore of clearnet
```

### Protected vs Locked vs Unlocked

| State       | Meaning                                                           |
|-------------|------------------------------------------------------------------|
| `PROTECTED` | Firewall active, Tor healthy, exit confirmed via Tor.            |
| `LOCKED`    | Firewall active, Tor unhealthy/absent — **all egress blocked**. |
| `DEGRADED`  | Firewall active, Tor up, but a non-fatal check failed.          |
| `UNLOCKED`  | Kill switch removed by explicit admin action — clearnet allowed. |

Stopping Tor Guard or Tor leaves you in `LOCKED`, not `UNLOCKED`. Only
`unlock-clearnet` restores direct networking.

## Operating modes

- **STRICT** (default, recommended): Internet only via Tor; LAN, link-local,
  multicast, broadcast, and IPv6 all blocked.
- **LAN-COMPATIBLE**: same, but explicitly configured `allowed_lan_cidrs` may be
  reached directly. No implicit LAN allowance; public CIDRs are rejected.

See [`docs/CONFIGURATION.md`](docs/CONFIGURATION.md).

## If networking breaks (recovery)

From a local console:

```bash
sudo bash scripts/emergency-recover.sh        # removes only Tor Guard's tables
```

It never runs `nft flush ruleset`, so your other firewall rules survive. Full
procedure: [`docs/RECOVERY.md`](docs/RECOVERY.md).

## Testing

```bash
make test          # unit tests (no root/network needed)
make all           # ruff + mypy(strict) + bandit + shellcheck + tests
make nft-check     # generate and validate the ruleset with `nft -c`
```

Destructive integration and leak tests run only in disposable VMs
(`vm-tests/`), gated by `TOR_GUARD_DISPOSABLE_VM=1`. See
[`docs/TESTING.md`](docs/TESTING.md).

## Known limitations

Application-level DoH/DoT (encrypted DNS to :443/:853) is redirected through Tor
rather than blocked; root on the host can remove Tor Guard; QUIC is blocked as
generic UDP (browsers fall back to TCP). Full list:
[`docs/LIMITATIONS.md`](docs/LIMITATIONS.md).

## License

MIT — see [`LICENSE`](LICENSE).
