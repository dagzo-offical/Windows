# Tor Guard — Architecture

## 1. Purpose

Tor Guard enforces **fail-closed**, system-wide transparent Tor routing on a
single Linux workstation. When active, all supported outbound TCP is
transparently redirected into Tor's `TransPort`, DNS is redirected to Tor's
`DNSPort`, and everything else is dropped. If Tor stops, crashes, fails
validation, or the firewall is tampered with, outbound Internet connectivity
**remains blocked** — traffic never silently falls back to the real network.

## 2. Trust boundaries

```
                    ┌─────────────────────────────────────────────┐
                    │ Untrusted: the Internet / Tor exit nodes     │
                    └───────────────────▲─────────────────────────┘
                                        │ (only via Tor relays,
                                        │  only from the tor uid)
   ┌────────────────────────────────────┼────────────────────────┐
   │ Host (semi-trusted)                │                         │
   │                                    │                         │
   │  ┌──────────────┐   redirect   ┌───┴────────┐                │
   │  │ user apps    │──────────────▶│  Tor daemon│                │
   │  │ (untrusted   │  nftables NAT │  (tor uid) │                │
   │  │  wrt egress) │  → TransPort  └────────────┘                │
   │  └──────────────┘                                            │
   │         │ DNS → DNSPort                                       │
   │  ┌──────▼───────────────────────────────────────────────┐    │
   │  │ nftables kill switch (TRUSTED, root-owned)           │    │
   │  │  default-deny output + NAT redirect + integrity      │    │
   │  └──────────────────────────────────────────────────────┘    │
   │                                                              │
   │  ┌────────────────┐    ┌────────────────────────────────┐    │
   │  │ tor-guard CLI  │    │ monitor daemon (unprivileged    │    │
   │  │ (root, brief)  │    │  read-only, root only to        │    │
   │  │                │    │  re-assert firewall)            │    │
   │  └────────────────┘    └────────────────────────────────┘    │
   └──────────────────────────────────────────────────────────────┘
```

**Trust levels**

| Component                 | Trust    | Runs as        | Notes |
|---------------------------|----------|----------------|-------|
| nftables ruleset          | Trusted  | kernel (root)  | The security control. |
| `tor-guard` CLI privileged ops | Trusted | root (briefly) | Applies/validates firewall, manages services. |
| Tor daemon                | Semi     | `debian-tor`   | Only uid allowed direct egress. |
| Monitor daemon            | Semi     | root (minimal caps) | Read-only checks; re-asserts firewall on tamper. |
| User applications         | Untrusted (egress) | any uid | Forced through Tor or dropped. |
| Internet / exit nodes     | Untrusted| —              | See threat model non-goals. |

## 3. Component map

CLI (`cli.py`, Typer) → orchestrates the following services, which are wired by a
small dependency-injection `Context` (`context.py`) so each is unit-testable with
fake collaborators:

- **config** — load + strict-validate YAML into a frozen `Config` dataclass.
- **platform** — verify OS is supported (Ubuntu 22.04/24.04, Debian 12, Kali).
- **privileges** — assert root, drop-privilege helpers, file-permission checks.
- **subprocess_runner** — the *only* place `subprocess` is called; no `shell=True`,
  argv arrays, timeouts, redaction.
- **firewall/** — `generator` (build a `Ruleset` model → nft text),
  `validator` (`nft -c -f`), `manager` (atomic apply via `nft -f`, backup/restore,
  emergency-lock), `integrity` (hash + structural checks).
- **tor/** — `manager` (systemd + torrc), `controller` (ControlPort cookie auth),
  `bootstrap` (parse bootstrap %), `health` (circuit/SOCKS checks).
- **network/** — `dns` (DNS-through-Tor validation), `routes` (route/leak sanity),
  `leak_tests` (active leak probes), `interfaces` (enumerate NICs/bridges).
- **monitor/** — `daemon` (event loop) + `checks` (individual health probes).
- **install/** — `installer`, `backup`, `rollback`, `manifest`.
- **diagnostics/** — `doctor` (aggregate health), `report` (redacted bundle).
- **state** — persisted `SystemState` (protected / locked / degraded / unlocked).

## 4. Packet flow (STRICT mode, IPv4)

```
outbound packet from app
        │
        ▼
[nftables output/NAT chains]
        │
 ┌──────┴───────────────────────────────────────────────────────────┐
 │ 1. loopback (lo)                         → ACCEPT                  │
 │ 2. meta skuid == tor                     → ACCEPT (Tor's own egr.) │
 │ 3. ct state established,related          → ACCEPT                  │
 │ 4. udp dport 53 / tcp dport 53 (non-tor) → REDIRECT :DNSPort       │
 │ 5. tcp new, dst not local                → REDIRECT :TransPort     │
 │ 6. dst in RFC1918 / link-local / mcast   → (STRICT) DROP           │
 │                                             (LAN-COMPAT) ACCEPT if │
 │                                             in configured CIDRs    │
 │ 7. udp (any other)                       → DROP                    │
 │ 8. everything else (default policy)      → DROP                    │
 └───────────────────────────────────────────────────────────────────┘

IPv6: table ip6 with output/forward/input policy DROP, no exceptions
      except loopback → hard block, no bypass.
```

The redirect targets are Tor's `TransPort` (`127.0.0.1:9040`) and `DNSPort`
(`127.0.0.1:5353`). Redirection uses `nat`/`REDIRECT` in the `output` hook for
locally generated traffic and the `prerouting` hook for forwarded traffic
(Docker/VM), so container and namespace traffic is captured too.

## 5. Startup ordering (the critical invariant)

```
tor-guard-firewall.service   (oneshot, RemainAfterExit)
   └─ applies kill switch (default-deny + redirect) BEFORE anything egresses
        │  Before=network-pre.target tor.service
        ▼
tor.service                  (After=/Requires firewall lock)
        │
        ▼
tor-guard-monitor.service    (After=tor.service; watches health + integrity)
```

The firewall unit is ordered `Before=network-pre.target`, guaranteeing the
kill switch exists before the network stack brings interfaces up — there is no
window of clearnet at boot. Failure of `tor.service` or the monitor never
removes the firewall (they do not `ExecStop` the ruleset).

See `docs/SECURITY_INVARIANTS.md` and `docs/THREAT_MODEL.md`.
