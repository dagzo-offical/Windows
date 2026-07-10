# Installation

## Prerequisites

- One of: Ubuntu 24.04, Ubuntu 22.04, Debian 12, current Kali (Debian-based)
- systemd, root access, outbound network (to reach the Tor network)
- Python 3.11+

The installer detects unsupported platforms and stops **without changing the
host**.

## Quick install

```bash
git clone https://github.com/dagzo-offical/windows.git
cd windows/tor-guard
sudo bash scripts/install.sh
```

`scripts/install.sh`:

1. verifies the platform (`/etc/os-release`);
2. installs `nftables`, `tor`, `python3`, `python3-pip`;
3. installs the `tor-guard` Python package;
4. runs `tor-guard install`, which:
   - creates `/etc/tor-guard`, `/var/lib/tor-guard`, `/var/log/tor-guard`
     (mode `0700`, root-owned);
   - backs up any existing `/etc/tor/torrc` and configuration;
   - installs `/etc/tor-guard/tor-guard.yml` (only if absent — your config is
     never clobbered);
   - writes the Tor drop-in `/etc/tor/torrc.d/10-tor-guard.conf`;
   - installs the systemd units;
   - records an installation manifest for a clean uninstall.

If any install step fails, the installer rolls back the recorded actions; if
rollback cannot fully restore, it engages the emergency lock so the host is
**locked, never open**.

## Configure

```bash
sudoedit /etc/tor-guard/tor-guard.yml
sudo tor-guard config validate
```

See [`CONFIGURATION.md`](CONFIGURATION.md).

## Activate

```bash
sudo tor-guard start     # apply firewall -> start Tor -> verify -> PROTECTED
sudo tor-guard status
```

`start` runs the full sequence: root check → platform → config → dependencies →
backup → validate ruleset → **apply kill switch** → start Tor → wait for 100%
bootstrap → validate listeners → confirm Tor exit → confirm direct/IPv6/UDP
blocked → mark protected. If any required step fails, it stays **locked** and
prints the exact failure.

## Enable at boot

```bash
sudo tor-guard enable
```

This enables `tor-guard.target`. The firewall unit is ordered
`Before=network-pre.target`, so the kill switch exists before interfaces come up
— there is no clearnet window at boot.

## Manual install (without the bootstrap script)

```bash
sudo apt-get install -y nftables tor python3 python3-pip
sudo python3 -m pip install --break-system-packages .
sudo tor-guard install --resource-dir "$(pwd)"
```

## Uninstall

```bash
sudo bash scripts/uninstall.sh            # removes files + firewall (restores net)
sudo bash scripts/uninstall.sh --keep-firewall   # remove files, keep the lock
```

Uninstall removes only manifest-owned files; it never deletes unrelated
administrator configuration.
