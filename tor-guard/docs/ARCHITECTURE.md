# Tor Guard — Arxitektura

## 1. Maqsad

Tor Guard bitta Linux ish stansiyasida **fail-closed**, butun tizim bo‘ylab
shaffof Tor marshrutlashni ta’minlaydi. Faol paytda barcha qo‘llab-quvvatlanadigan
chiquvchi TCP shaffof ravishda Tor `TransPort`iga yo‘naltiriladi, DNS Tor
`DNSPort`iga yo‘naltiriladi, qolgan hamma narsa tashlanadi. Agar Tor to‘xtasa,
ishdan chiqsa, tekshiruvdan o‘tmasa yoki firewall buzib o‘zgartirilsa, chiquvchi
internet ulanishi **bloklangan qoladi** — trafik hech qachon jimgina haqiqiy
tarmoqqa qaytmaydi.

## 2. Ishonch chegaralari

```
                    ┌─────────────────────────────────────────────┐
                    │ Ishonchsiz: Internet / Tor chiqish tugunlari │
                    └───────────────────▲─────────────────────────┘
                                        │ (faqat Tor relaylari orqali,
                                        │  faqat tor uid'dan)
   ┌────────────────────────────────────┼────────────────────────┐
   │ Host (yarim-ishonchli)             │                         │
   │                                    │                         │
   │  ┌──────────────┐   redirect   ┌───┴────────┐                │
   │  │ user apps    │──────────────▶│  Tor xizmat│                │
   │  │ (chiqish     │  nftables NAT │  (tor uid) │                │
   │  │  bo'yicha    │  → TransPort  └────────────┘                │
   │  │  ishonchsiz) │                                            │
   │  └──────────────┘                                            │
   │         │ DNS → DNSPort                                       │
   │  ┌──────▼───────────────────────────────────────────────┐    │
   │  │ nftables kill switch (ISHONCHLI, root egaligida)     │    │
   │  │  default-deny output + NAT redirect + butunlik       │    │
   │  └──────────────────────────────────────────────────────┘    │
   │                                                              │
   │  ┌────────────────┐    ┌────────────────────────────────┐    │
   │  │ tor-guard CLI  │    │ monitor xizmati (imtiyozsiz     │    │
   │  │ (root, qisqa)  │    │  read-only, firewall'ni qayta   │    │
   │  │                │    │  tasdiqlash uchungina root)     │    │
   │  └────────────────┘    └────────────────────────────────┘    │
   └──────────────────────────────────────────────────────────────┘
```

**Ishonch darajalari**

| Komponent                 | Ishonch  | Ishlaydi        | Izohlar |
|---------------------------|----------|----------------|-------|
| nftables qoidalar to‘plami | Ishonchli | yadro (root)  | Xavfsizlik nazorati. |
| `tor-guard` CLI imtiyozli amallari | Ishonchli | root (qisqa) | Firewall’ni qo‘llaydi/tekshiradi, xizmatlarni boshqaradi. |
| Tor xizmati               | Yarim    | `debian-tor`   | To‘g‘ridan-to‘g‘ri chiqishga ruxsat etilgan yagona uid. |
| Monitor xizmati           | Yarim    | root (minimal caps) | Read-only tekshiruvlar; buzishda firewall’ni qayta tasdiqlaydi. |
| Foydalanuvchi ilovalari   | Ishonchsiz (chiqish) | har qanday uid | Tor orqali majburlanadi yoki tashlanadi. |
| Internet / chiqish tugunlari | Ishonchsiz | —          | Tahdid modeli non-goal’lariga qarang. |

## 3. Komponentlar xaritasi

CLI (`cli.py`, Typer) → quyidagi xizmatlarni boshqaradi; ular kichik
dependency-injection `Context` (`context.py`) orqali bog‘langan, shuning uchun
har biri soxta hamkorlar bilan alohida testlanadi:

- **config** — YAML’ni yuklab, qat’iy tekshirib, muzlatilgan `Config` dataclass’ga
  aylantiradi.
- **platform** — OS qo‘llab-quvvatlanishini tekshiradi (Ubuntu 22.04/24.04,
  Debian 12, Kali).
- **privileges** — root’ni tasdiqlaydi, imtiyoz-tushirish yordamchilari,
  fayl-ruxsat tekshiruvlari.
- **subprocess_runner** — `subprocess` chaqiriladigan *yagona* joy; `shell=True`
  yo‘q, argv massivlari, vaqt chegaralari, yashirish (redaction).
- **firewall/** — `generator` (`Ruleset` modelini → nft matn quradi),
  `validator` (`nft -c -f`), `manager` (`nft -f` orqali atomik qo‘llash,
  backup/restore, emergency-lock), `integrity` (hash + strukturaviy tekshiruvlar).
- **tor/** — `manager` (systemd + torrc), `controller` (ControlPort cookie
  autentifikatsiyasi), `bootstrap` (ulanish bosqichi %ini tahlil qiladi),
  `health` (kanal/SOCKS tekshiruvlari).
- **network/** — `dns` (DNS-Tor-orqali tekshiruv), `routes` (marshrut/sizib
  chiqish tekshiruvi), `leak_tests` (faol sizib chiqish tekshiruvlari),
  `interfaces` (NIC/bridge’larni sanaydi).
- **monitor/** — `daemon` (hodisalar sikli) + `checks` (alohida holat
  tekshiruvlari).
- **install/** — `installer`, `backup`, `rollback`, `manifest`.
- **diagnostics/** — `doctor` (yig‘ma holat), `report` (yashirilgan to‘plam).
- **state** — saqlanadigan `SystemState` (protected / locked / degraded /
  unlocked).

## 4. Paket oqimi (STRICT rejimi, IPv4)

```
ilovadan chiquvchi paket
        │
        ▼
[nftables output/NAT zanjirlari]
        │
 ┌──────┴───────────────────────────────────────────────────────────┐
 │ 1. loopback (lo)                         → ACCEPT                  │
 │ 2. meta skuid == tor                     → ACCEPT (Tor'ning o'z chiq.) │
 │ 3. ct state established,related          → ACCEPT                  │
 │ 4. udp dport 53 / tcp dport 53 (tor emas)→ REDIRECT :DNSPort       │
 │ 5. tcp new, dst mahalliy emas            → REDIRECT :TransPort     │
 │ 6. dst RFC1918 / link-local / mcast'da   → (STRICT) DROP           │
 │                                             (LAN-COMPAT) sozlangan │
 │                                             CIDR'da bo'lsa ACCEPT  │
 │ 7. udp (boshqa har qanday)               → DROP                    │
 │ 8. qolgan hamma narsa (standart siyosat) → DROP                    │
 └───────────────────────────────────────────────────────────────────┘

IPv6: output/forward/input siyosati DROP bo'lgan table ip6, loopback'dan
      tashqari istisnosiz → qat'iy blok, chetlab o'tish yo'q.
```

Yo‘naltirish maqsadlari — Tor `TransPort` (`127.0.0.1:9040`) va `DNSPort`
(`127.0.0.1:5353`). Yo‘naltirish mahalliy yaratilgan trafik uchun `output`
hook’ida va forward qilingan trafik (Docker/VM) uchun `prerouting` hook’ida
`nat`/`REDIRECT`’dan foydalanadi, shuning uchun konteyner va namespace trafigi
ham ushlanadi.

## 5. Ishga tushirish tartibi (kritik invariant)

```
tor-guard-firewall.service   (oneshot, RemainAfterExit)
   └─ har qanday chiqishdan OLDIN kill switch (default-deny + redirect) qo'llaydi
        │  Before=network-pre.target tor.service
        ▼
tor.service                  (After=/Requires firewall lock)
        │
        ▼
tor-guard-monitor.service    (After=tor.service; holat + butunlikni kuzatadi)
```

Firewall birligi `Before=network-pre.target` tartibida joylashgan, bu tarmoq
steki interfeyslarni ko‘tarishidan oldin kill switch mavjudligini kafolatlaydi —
yuklanishda oddiy internet oynasi yo‘q. `tor.service` yoki monitor ishdan
chiqishi hech qachon firewall’ni olib tashlamaydi (ular qoidalar to‘plamini
`ExecStop` qilmaydi).

Qarang: `docs/SECURITY_INVARIANTS.md` va `docs/THREAT_MODEL.md`.
