# Changelog

All notable changes to Tor Guard are documented here. Format loosely follows
[Keep a Changelog](https://keepachangelog.com/); this project uses semantic
versioning.

## [1.0.0] — 2026-07-10

Initial release.

### Added
- Fail-closed, system-wide Tor transparent-proxy kill switch for
  Ubuntu 24.04/22.04, Debian 12, and Kali (systemd + nftables).
- Two operating modes: STRICT (default) and LAN-COMPATIBLE with strict CIDR
  validation.
- Atomic nftables ruleset generation and application (`nft -f`), with a
  syntax/semantic validator (`nft -c`) run before every apply.
- Transparent redirect of eligible TCP to Tor's TransPort and DNS to Tor's
  DNSPort; default-deny for everything else.
- IPv6 blocked at the firewall (route-independent); general outbound UDP and
  QUIC blocked; direct DNS blocked.
- Dedicated-Tor-uid egress exception (by stable uid, never PID).
- Firewall integrity monitoring with automatic re-assertion; Tor crash handling
  with automatic restart — never restoring clearnet.
- Emergency lockdown that works without Tor installed.
- Explicit, audited `unlock-clearnet` (backup restore or clean removal; never
  `nft flush ruleset`).
- Tor management: torrc drop-in generation, cookie-authenticated ControlPort
  client, 100%-bootstrap gating, listener/circuit health checks.
- Transactional installer with timestamped backups, file hashing, manifest, and
  rollback; matching uninstaller that removes only owned files.
- Offline recovery script (`scripts/emergency-recover.sh`) and full
  `docs/RECOVERY.md`.
- Typer/Rich CLI: `install, uninstall, enable, disable, start, stop, restart,
  status, doctor, verify, logs, emergency-lock, unlock-clearnet, reload,
  config show, config validate, test-leaks`.
- Hardened systemd units with correct ordering (firewall before network,
  Tor after firewall, monitor after Tor) and sandboxing directives.
- Structured logging with secret/real-IP redaction and a separate audit log.
- Leak-test framework (direct IPv4/IPv6, UDP/TCP DNS, external UDP, QUIC,
  alternate resolver, Tor-exit confirmation) and disposable-VM harness for
  all four supported distributions.
- 136 unit tests; live `nft -c` validation; CI for static analysis, shellcheck,
  systemd verification, and the unit/integration matrix.

### Security
- Full threat model (`docs/THREAT_MODEL.md`), security invariants with
  test mapping (`docs/SECURITY_INVARIANTS.md`), and an authoritative
  failure-state table.
- Explicit anonymity disclaimers and documented limitations
  (`docs/LIMITATIONS.md`).

### Known limitations
- Application-level DoH/DoT is redirected through Tor, not blocked.
- Full transparent proxying of arbitrary container/namespace traffic has edge
  cases (fails closed, never leaks).
- No IPv6-over-Tor path (IPv6 is blocked).
