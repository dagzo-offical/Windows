# Testing

Three tiers, matching their blast radius.

## 1. Unit tests — safe anywhere

No root, no network, no firewall changes. The real `nft` binary is used in
**check mode only** (`nft -c`) to validate generated rulesets.

```bash
make test                     # or: PYTHONPATH=src pytest tests/unit
make test-cov                 # with coverage
```

Coverage focuses on the security-critical modules (ruleset generator, integrity
checker, config validation, state machine, orchestrator fail-closed paths, leak
result tri-state).

What they cover (selection):

- config parsing, strict schema, port/CIDR validation, mode rules;
- ruleset generation: default-drop, DNS redirect, Tor-uid exception, IPv6 block,
  UDP block, atomic replace idiom, LAN-mode CIDRs; plus **live `nft -c`**;
- firewall manager: single-transaction atomic apply, validation-before-apply,
  emergency lock, table removal never flushing the ruleset;
- integrity: missing tables and weakened policies detected;
- Tor bootstrap parsing and timeout; control cookie auth; health probes;
- DNS packet build/parse; external-IP tri-state; leak-probe logic;
- orchestrator: firewall-before-Tor ordering, "Tor absent → locked", "leak →
  locked", "verification unavailable → degraded, not open", "stop keeps
  firewall";
- monitor: integrity loss → re-apply, Tor down → restart but never unlock;
- installer backup/restore/rollback/manifest; platform detection; privileges.

## 2. Integration tests — disposable VM only

Change real firewall state. Gated behind `TOR_GUARD_DISPOSABLE_VM=1` **and**
root; skipped otherwise.

```bash
sudo TOR_GUARD_DISPOSABLE_VM=1 pytest tests/integration -m integration -v
```

## 3. Leak tests — disposable VM, protected mode active

Make real outbound attempts. Run after `tor-guard start`. Real public IP is
never printed — only pass/fail and probe names.

```bash
sudo TOR_GUARD_DISPOSABLE_VM=1 pytest tests/leak -m leak -v
# or the CLI suite:
sudo tor-guard test-leaks --i-understand
```

Probes: direct IPv4/IPv6 TCP, UDP DNS, TCP DNS, external UDP, QUIC, alternate
resolver, and Tor-connectivity confirmation. Expected: Tor-routed traffic
succeeds; every direct/unsupported path fails.

## Full VM matrix

`vm-tests/` provides Vagrant environments for Ubuntu 24.04/22.04, Debian 12, and
Kali. Each boots a clean VM, installs Tor Guard, activates protected mode, runs
the leak suite, simulates Tor failure and firewall tampering, and collects
results. See [`../vm-tests/README.md`](../vm-tests/README.md).

```bash
cd vm-tests/ubuntu-2404 && vagrant up && cat results/*.txt && vagrant destroy -f
```

## Static analysis & quality gates

```bash
make lint        # ruff
make format      # black + ruff --fix
make typecheck   # mypy (strict)
make security    # bandit
make shellcheck  # shellcheck scripts + vm provisioner
make nft-check   # generate + validate ruleset with nft -c
make all         # everything except VM tests
```

CI (`.github/workflows/`) runs the static gates, shellcheck, systemd unit
verification, `nft -c` validation, the unit matrix (3.11/3.12) with coverage,
and the gated integration job.

## What was executed vs. what needs a VM

The unit suite, `nft -c` validation, and all static gates run in any
environment (and in CI). The **integration and leak tests require a disposable
VM with root, systemd, and a working Tor** — they are provided and gated, and
must be run there for authoritative results. Container runtimes cannot
faithfully emulate every host-firewall scenario.
