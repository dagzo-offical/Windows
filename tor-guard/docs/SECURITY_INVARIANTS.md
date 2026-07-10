# Tor Guard — Security Invariants

These invariants MUST hold across startup, runtime, shutdown, failure, and
recovery. Each maps to code and to a test.

## Core principle

**FAIL CLOSED — NEVER FAIL OPEN.** Any ambiguity, error, or missing check
resolves to *blocked*, never to clearnet.

## Invariants

| # | Invariant | Enforced by | Test |
|---|-----------|-------------|------|
| I1 | Default-deny outbound while active: any packet not explicitly redirected/allowed is dropped. | `firewall/generator.py` (policy `drop` on output/forward) | `tests/unit/test_generator.py::test_default_drop_policy`, leak `test_direct_tcp` |
| I2 | Firewall applied **before** Tor starts/restarts (no clearnet window). | `cli.py start` ordering; `systemd` `Before=`/`After=` | `tests/unit/test_start_sequence.py` |
| I3 | Stopping/crashing Tor does not remove the kill switch. | No `ExecStop` flush; `manager.stop()` never flushes. | `tests/unit/test_manager_stop_keeps_lock.py` |
| I4 | Stopping Tor Guard does not restore clearnet automatically. | `cli.py stop` leaves ruleset; only `unlock-clearnet` restores. | `tests/unit/test_stop_keeps_firewall.py` |
| I5 | Only the dedicated Tor uid may egress directly (not by PID). | `meta skuid <tor-uid>` rule | `tests/unit/test_generator.py::test_tor_uid_exception` |
| I6 | All host DNS is redirected to `DNSPort` or dropped (UDP/TCP 53, external resolvers). | NAT redirect rules + drop | `tests/unit/test_generator.py::test_dns_redirect`, leak `test_dns_*` |
| I7 | IPv6 is blocked at the firewall (not just sysctl). | `table ip6` policy drop | `tests/unit/test_generator.py::test_ipv6_blocked`, leak `test_ipv6_tcp` |
| I8 | General outbound UDP (incl. QUIC/443-udp) is dropped; only necessary local UDP (DHCP/DNS-to-Tor) allowed. | UDP drop rule + explicit exceptions | `tests/unit/test_generator.py::test_udp_blocked` |
| I9 | Rulesets load atomically from one validated file (`nft -f`), never a sequence of mutating commands. | `firewall/manager.py::apply` | `tests/unit/test_manager.py::test_atomic_apply` |
| I10 | Integrity monitoring detects removal/modification of Tor Guard's tables/chains/policies and restores the locked ruleset. | `firewall/integrity.py`, `monitor/daemon.py` | `tests/unit/test_integrity.py` |
| I11 | Automatic recovery may restart Tor but never restores direct Internet. | `monitor/daemon.py` recovery path | `tests/unit/test_daemon.py::test_recovery_never_unlocks` |
| I12 | Config invalid → no networking change at all. | `config.py` validates before any apply; `cli.py` order | `tests/unit/test_config.py`, `test_start_sequence.py` |
| I13 | `emergency-lock` works even if Tor is absent/broken. | Static known-good ruleset, no Tor dependency. | `tests/unit/test_generator.py::test_emergency_ruleset_no_tor` |
| I14 | Docker/Podman/libvirt/bridge/namespace/forwarded traffic cannot bypass. | `prerouting` + `forward` chains policy drop + redirect | `tests/unit/test_generator.py::test_forward_blocked`, leak docker/netns |
| I15 | External-IP verification failure is reported as *verification unavailable*, never as proof of safety or of breakage. | `network/routes.py`, `diagnostics/doctor.py` tri-state result | `tests/unit/test_leak_result.py` |
| I16 | No world-writable files/dirs/sockets/logs; state/backup dirs `0700`, config `0600`. | `privileges.py`, `install/installer.py` | `tests/unit/test_privileges.py` |

## Failure-state table (authoritative)

| Failure | Required behavior | Code path |
|---------|-------------------|-----------|
| Tor not installed | Remain locked | `tor/manager.ensure_installed` raises; firewall stays |
| Tor fails to start | Remain locked | `cli.start` aborts after firewall applied |
| Tor bootstrap < 100% | Remain locked | `tor/bootstrap.wait_for_bootstrap` timeout → abort |
| Tor crashes | Remain/return locked | monitor detects; restarts Tor; firewall untouched |
| DNSPort unavailable | Block affected traffic | firewall already drops direct 53; degraded state |
| TransPort unavailable | Block affected traffic | firewall drops direct TCP; degraded state |
| SOCKSPort unavailable | Degraded; no direct fallback | `state=DEGRADED`, firewall intact |
| nftables rule removed | Restore locked rules / remain locked | `integrity` + monitor re-apply |
| IPv6 route appears | IPv6 still blocked | `ip6` table policy drop is route-independent |
| external-IP check unavailable | Report *verification unavailable* | tri-state `VerifyResult.UNAVAILABLE` |
| configuration invalid | Do not modify networking | validate-before-apply |
| installer interrupted | Roll back or leave known locked | `install/rollback.py` + emergency-lock |
| monitor crashes | Firewall remains active | monitor holds no teardown responsibility |
| reboot | Protected/locked restored before clearnet | firewall unit `Before=network-pre.target` |
| uninstall fails | No unknown partial firewall state | uninstall emergency-locks on error |

## Explicit non-invariants (do not claim)

Tor Guard does **not** guarantee anonymity against a compromised host/kernel, a
root-level attacker on the box, global passive adversaries, application-level
identity disclosure, personal-account correlation, browser fingerprinting,
malicious documents, endpoint telemetry, or behavioral correlation. It reduces
*accidental real-IP/DNS exposure*. See `docs/LIMITATIONS.md`.
