# Tor Guard — Threat Model

## 1. Scope & goal

Tor Guard is a **fail-closed transparent Tor kill switch** for a single Linux
workstation. Its goal is to *reduce accidental exposure of the user's real
public IP address and DNS queries* by forcing supported outbound traffic through
Tor and blocking everything that cannot be routed through Tor.

It is **not** an anonymity guarantee. See §5 non-goals.

## 2. Assets

- **A1** Real public IPv4/IPv6 address of the host.
- **A2** DNS queries (names the user resolves).
- **A3** Outbound connection metadata (dst IP/port, timing) reaching clearnet.
- **A4** Firewall integrity (the kill switch itself).
- **A5** Tor configuration (torrc, control auth cookie).
- **A6** Administrator access to the host.
- **A7** System state (protected/locked flags, backups, manifest).

## 3. Adversaries & threats

| ID | Threat | Vector | Mitigation | Residual risk |
|----|--------|--------|------------|---------------|
| T1 | Tor daemon crash | process dies mid-session | Firewall independent of Tor; monitor restarts Tor; egress stays blocked (I3, I11) | Brief loss of connectivity (by design) |
| T2 | Tor bootstrap failure | network/censorship | `start` remains locked until 100% bootstrap (I2) | User has no Internet until Tor works — intended |
| T3 | DNS leak | app queries resolver directly | Redirect 53→DNSPort, drop others (I6) | App-level DoH/DoT to :443 — see §4 |
| T4 | IPv6 leak | dual-stack egress | `ip6` table drop, not sysctl-only (I7) | None for IPv6 egress |
| T5 | UDP/QUIC bypass | HTTP/3 over UDP/443 | Drop non-essential outbound UDP (I8) | Local DHCP/DNS-to-Tor UDP allowed intentionally |
| T6 | Direct TCP bypass | app opens raw socket | Default-deny + redirect only (I1) | None while active |
| T7 | Startup/shutdown race | clearnet window at boot/stop | Firewall `Before=network-pre.target`; stop keeps lock (I2, I4) | None identified |
| T8 | Firewall rule deletion | admin/script flushes rules | Integrity monitor re-applies (I10) | Window ≤ monitor interval |
| T9 | Docker/VM bridge bypass | container egress via bridge | `forward`/`prerouting` drop+redirect (I14) | Custom netns with own routing table by root — see §4 |
| T10 | Network namespace bypass | `ip netns` with veth | prerouting/forward capture; block unknown ifaces | Root can craft evasion — out of scope (see T13) |
| T11 | Malicious local (non-root) process | tries any egress | Subject to same firewall; cannot change rules | Covert channels via allowed Tor path |
| T12 | Privileged local attacker (root) | disables Tor Guard | — | **Out of scope**: root can undo any host control |
| T13 | Compromised host/kernel | rootkit | — | **Out of scope** |
| T14 | Compromised Tor exit node | sees exit traffic | Use HTTPS/onion; Tor's own guarantees | Standard Tor exit risk |
| T15 | Browser fingerprinting | JS/TLS fingerprint | — | **Out of scope**; use Tor Browser |
| T16 | Personal-account correlation | user logs into real account | — | **Out of scope**; opsec responsibility |
| T17 | Malware/endpoint telemetry | phones home via Tor | Traffic still Tor-routed, not de-anonymized by us | Correlation possible |
| T18 | Traffic-correlation attack | global passive adversary | — | **Out of scope** (Tor's own limitation) |
| T19 | Hostile Wi-Fi / captive portal | MITM on L2 | Kill switch blocks clearnet incl. portal | Portal login needs `unlock-clearnet` first |
| T20 | System update reorders services | apt changes ordering | Units pinned + `doctor` verifies; integrity monitor | Update could disable unit — `doctor` detects |

## 4. Known limitations that widen the attack surface

- **Application-level encrypted DNS (DoH/DoT)** to port 443/853 looks like normal
  TCP and is *redirected through Tor*, not blocked — so it does not leak the real
  IP, but the resolver choice is the app's. We cannot force such apps to use
  Tor's resolver. Documented in `docs/LIMITATIONS.md`.
- **Root on the host** can remove Tor Guard. This is fundamental (T12/T13).
- **Custom routing tables / policy routing by root** (e.g. exotic `ip rule`
  setups, VRF) may escape a purely `output`-hook design; we add `forward` +
  `prerouting` coverage but cannot defeat an adversarial root.
- **QUIC** is blocked as generic UDP; browsers fall back to TCP.

## 5. Explicit non-goals

Tor Guard makes **no claim** of protection against, and must never be described
as protecting against:

- a compromised host or kernel;
- a root-level attacker on the machine;
- global passive adversaries / traffic-correlation attacks;
- application-level identity disclosure (logging into real accounts);
- browser or TLS fingerprinting;
- malicious documents / malware execution;
- endpoint telemetry;
- behavioral correlation across sessions.

It reduces **accidental** real-IP and DNS exposure. That is the entire promise.
