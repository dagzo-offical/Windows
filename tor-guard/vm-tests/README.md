# VM integration & leak testing

These environments run the **destructive** integration and leak tests in
disposable virtual machines — never on a workstation. Each distribution has a
`Vagrantfile` that boots a clean VM, installs Tor Guard, activates protected
mode, runs the leak suite, simulates Tor failure and firewall tampering, and
collects results under `vm-tests/<distro>/results/`.

## Supported targets

| Directory        | Box                     | OS                    |
|------------------|-------------------------|-----------------------|
| `ubuntu-2404/`   | `bento/ubuntu-24.04`    | Ubuntu 24.04 LTS      |
| `ubuntu-2204/`   | `bento/ubuntu-22.04`    | Ubuntu 22.04 LTS      |
| `debian-12/`     | `debian/bookworm64`     | Debian 12             |
| `kali/`          | `kalilinux/rolling`     | Kali (Debian-based)   |

## Requirements

- Vagrant + VirtualBox (or libvirt with an adjusted provider block)
- The tests are gated by `TOR_GUARD_DISPOSABLE_VM=1`, which `provision.sh` sets.

## Run

```bash
cd vm-tests/ubuntu-2404
vagrant up            # boots, provisions, runs the full suite
cat results/*.txt     # inspect leak/failure-simulation results
vagrant destroy -f    # throw the VM away
```

## What the provisioner checks

1. `tor-guard install` + `config validate`
2. `tor-guard start` reaches **protected**
3. `test-leaks` — direct IPv4/IPv6, UDP DNS, external UDP, QUIC, alternate
   resolver all blocked; exit confirmed via Tor
4. **Tor-failure simulation** — after `systemctl stop tor`, clearnet must be
   unreachable (fail-closed)
5. **Firewall-tamper simulation** — flush a chain, wait for the monitor to
   re-assert the ruleset, then `verify`
6. `unlock-clearnet` restores networking

Real public IP is never printed in results — only pass/fail and probe names.

> Note: containers cannot faithfully emulate every host-firewall scenario
> (namespaces, kernel netfilter behaviour). Use full VMs for authoritative
> results, as the specification requires.
