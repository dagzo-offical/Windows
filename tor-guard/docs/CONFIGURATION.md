# Configuration

Configuration lives at `/etc/tor-guard/tor-guard.yml` (mode `0600`, root-owned).
It is validated strictly: unknown keys, malformed ports, and malformed CIDRs are
rejected, and dangerous implicit allowances are refused. Validate with:

```bash
tor-guard config validate
tor-guard config show      # effective, validated values
```

## Reference

| Key | Type | Default | Notes |
|-----|------|---------|-------|
| `mode` | `strict` \| `lan-compatible` | `strict` | STRICT blocks all LAN/IPv6; LAN-COMPATIBLE also allows `allowed_lan_cidrs`. |
| `tor_user` | string | `debian-tor` | Dedicated Tor service account; its **uid** is the only identity allowed direct egress. |
| `socks_port` | 1–65535 | `9050` | Loopback SOCKS listener. Must be distinct. |
| `trans_port` | 1–65535 | `9040` | Loopback TransPort (transparent TCP). |
| `dns_port` | 1–65535 | `5353` | Loopback DNSPort. |
| `control_port` | 1–65535 | `9051` | ControlPort (cookie auth). |
| `allowed_lan_cidrs` | list of IPv4 CIDR | `[]` | **Must be empty in strict mode.** Public CIDRs rejected. |
| `interfaces` | list of string | `[]` | Optional advisory interface allow-list. |
| `monitor_interval` | int ≥ 1 | `10` | Seconds between monitor checks. |
| `health_timeout` | int ≥ 1 | `15` | Per-check timeout. |
| `bootstrap_timeout` | int ≥ 1 | `120` | Max seconds to wait for Tor 100% bootstrap. |
| `external_ip_endpoints` | list of https URL | `["https://check.torproject.org/api/ip"]` | Tri-state verification; unreachable ≠ leak. |
| `log_level` | DEBUG…CRITICAL | `INFO` | |
| `auto_restart_tor` | bool | `true` | Monitor restarts Tor (never opens clearnet). |
| `backup_dir` | path | `/var/lib/tor-guard/backups` | |
| `state_dir` | path | `/var/lib/tor-guard` | |
| `lock_file` | path | `/run/tor-guard.lock` | |
| `test_mode` | bool | `false` | Skips active leak probes during `start` (CI/dev only). |

## Modes

### STRICT (recommended default)

Internet only via Tor. Blocks RFC1918, link-local (`169.254/16`), loopback net,
multicast/broadcast, CGNAT/special ranges, and **all IPv6**. `allowed_lan_cidrs`
must be empty.

### LAN-COMPATIBLE

Same egress policy for the Internet, but the explicitly listed subnets are
reachable directly (e.g. a local printer or NAS). Example:

```yaml
mode: lan-compatible
allowed_lan_cidrs:
  - 192.168.1.0/24
```

Rules:
- at least one CIDR is required;
- only IPv4 CIDRs (IPv6 is always blocked);
- public/global CIDRs are rejected (they would bypass Tor).

## Applying changes

```bash
sudoedit /etc/tor-guard/tor-guard.yml
sudo tor-guard reload     # re-render torrc + re-apply firewall atomically
```

`reload` never creates an open window: the new ruleset replaces the old one in a
single atomic `nft -f` transaction.

## Secrets

No plaintext secrets are stored. Tor control access uses **cookie
authentication** (`CookieAuthentication 1`); the cookie is a root-readable file
created by Tor and never logged. Logs pass through a redactor that scrubs
cookies, hashes, and anything resembling the real public IP.
