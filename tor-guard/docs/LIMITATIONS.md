# Limitations

Tor Guard reduces **accidental** exposure of your real IP and DNS. It is not an
anonymity system. Understand these limits before relying on it.

## Hard non-goals (never claimed)

Tor Guard does **not** protect against:

- a compromised host or kernel (rootkit, malicious driver);
- a root-level attacker on the machine — root can remove any host control,
  including Tor Guard;
- global passive adversaries and traffic-correlation attacks (a fundamental Tor
  limitation);
- application-level identity disclosure — logging into your real accounts
  de-anonymizes you regardless of routing;
- browser/TLS fingerprinting — use the **Tor Browser** for browsing;
- malicious documents or malware execution;
- endpoint telemetry and behavioral correlation across sessions.

## Technical limitations

### Encrypted DNS (DoH/DoT)
Applications doing DNS-over-HTTPS (`:443`) or DNS-over-TLS (`:853`) send opaque
TCP that is **redirected through Tor**, not blocked. So it does not leak your
real IP, but Tor Guard cannot force those apps to use Tor's own resolver — the
resolver choice stays with the app. Prefer apps that honour the system resolver,
or disable in-app DoH.

### QUIC / HTTP/3
QUIC runs over UDP, which Tor cannot transparently proxy. Tor Guard blocks it as
generic UDP; browsers transparently fall back to TCP. Apps that are UDP-only
will simply fail (fail-closed).

### General UDP
Only strictly necessary local UDP is allowed (DHCP; DNS redirected to Tor).
Everything else outbound UDP is dropped. UDP-based applications will not work
through Tor Guard.

### Containers / VMs / namespaces
Forwarded traffic (Docker, Podman, libvirt bridges) is captured by the
`prerouting` redirect and the `forward` chain's default-drop, so it cannot
bypass. But transparent proxying of container traffic has edge cases (REDIRECT
target address selection, custom container networks). Where redirection is
imperfect, the traffic is **dropped, not leaked**. A root user creating a custom
routing table or namespace with its own egress path is out of scope (that is an
adversarial-root scenario).

### IPv6
IPv6 is blocked entirely at the firewall (route-independent), not merely via
sysctl. There is no IPv6-over-Tor path in this release. IPv6-only destinations
are unreachable while protected.

### External-IP verification
Verification through `check.torproject.org` (or configured endpoints) can be
unavailable (network, rate limiting, censorship). Tor Guard reports this as
*verification unavailable* — it never treats it as proof that you are safe, nor
as proof that Tor is broken.

### Captive portals / hostile Wi-Fi
The kill switch blocks the captive-portal login page too. You must
`unlock-clearnet`, complete the portal, then re-`start`. This is intentional:
silently allowing portal traffic would be a bypass.

### Time-to-detect on tampering
If the nftables rules are removed out-of-band, there is a window up to one
`monitor_interval` (default 10s) before the monitor re-asserts them. During that
window the default-drop policy of the surviving base chains still applies where
present; a full flush is re-applied on the next tick.

## Operational guidance

- Do not log into personal accounts you want kept separate.
- Use the Tor Browser for web browsing (fingerprinting resistance).
- Treat Tor Guard as a safety net against mistakes, not a cloak of invisibility.
