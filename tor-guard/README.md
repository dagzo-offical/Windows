# Tor Guard

**Linux ish stansiyalari uchun fail-closed, butun tizim bo‘ylab Tor transparent-proxy kill switch.**

Tor Guard barcha qo‘llab-quvvatlanadigan chiquvchi TCP trafigini Tor orqali
majburlaydi, DNS’ni Tor orqali yo‘naltiradi va Tor orqali yo‘naltirib
bo‘lmaydigan hamma narsani bloklaydi. Agar Tor to‘xtasa, ishdan chiqsa,
tekshiruvdan o‘tmasa yoki firewall buzib o‘zgartirilsa, chiquvchi internet
ulanishi **bloklangan holatda qoladi** — trafik hech qachon jimgina sizning
haqiqiy tarmog‘ingizga qaytmaydi.

> ## ⚠️ Anonimlik haqida ogohlantirish — avval buni o‘qing
>
> Tor Guard haqiqiy IP manzilingiz va DNS so‘rovlaringizning **tasodifiy**
> oshkor bo‘lishini kamaytiradi. Bu anonimlik **kafolati EMAS**. U sizni
> buzilgan host yoki yadro, mashinada root darajasidagi hujumchi, global passiv
> raqiblar, trafik korrelyatsiyasi hujumlari, brauzer/TLS barmoq izlari, zararli
> hujjatlar, zararli dasturlar, endpoint telemetriyasi, shaxsiy hisoblarga
> kirish yoki boshqa operatsion-xavfsizlik xatolaridan himoya qila **olmaydi**.
> Internetni ko‘rish uchun Tor Browser’dan foydalaning. Qarang:
> [`docs/LIMITATIONS.md`](docs/LIMITATIONS.md) va
> [`docs/THREAT_MODEL.md`](docs/THREAT_MODEL.md).

## Qo‘llab-quvvatlanadigan tizimlar

- Ubuntu 24.04 LTS, Ubuntu 22.04 LTS, Debian 12, joriy Kali (Debian asosidagi)
- Init: **systemd** · Firewall: **faqat nftables** · Python **3.11+**

O‘rnatuvchi boshqa har qanday tizimda ishlashdan bosh tortadi va host’ni
o‘zgarishsiz qoldiradi.

## Arxitektura umumiy ko‘rinishda

```
 user apps ──┬─ TCP ───▶ nftables NAT ─redirect─▶ Tor TransPort (127.0.0.1:9040) ─▶ Tor ─▶ Internet
             └─ DNS ───▶ nftables NAT ─redirect─▶ Tor DNSPort  (127.0.0.1:5353)
 boshqa hamma narsa (IPv6, UDP/QUIC, to‘g‘ridan-to‘g‘ri TCP, to‘g‘ridan-to‘g‘ri DNS) ─────▶ DROP  (default-deny)
 faqat maxsus tor uid to‘g‘ridan-to‘g‘ri chiqishi mumkin (relaylarga ulanish uchun)
```

Kill switch — atomik tarzda qo‘llaniladigan maxsus nftables jadvallari to‘plami.
Monitor xizmati qoidalar to‘plami buzib o‘zgartirilsa uni qayta o‘rnatadi va Tor
ishdan chiqsa uni qayta ishga tushiradi — lekin **hech qachon** oddiy internetni
tiklamaydi. To‘liq dizayn:
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md),
[`docs/SECURITY_INVARIANTS.md`](docs/SECURITY_INVARIANTS.md).

## O‘rnatish

```bash
sudo bash scripts/install.sh          # dependency’lar + paket + fayllarni o‘rnatadi
sudoedit /etc/tor-guard/tor-guard.yml # sozlamalarni ko‘rib chiqing
sudo tor-guard start                  # kill switchni qo‘llaydi, Tor’ni ishga tushiradi, tekshiradi
sudo tor-guard enable                 # qayta yuklashda ham saqlanadi (yuklanishda fail-closed)
```

To‘liq qo‘llanma: [`docs/INSTALLATION.md`](docs/INSTALLATION.md).

## Asosiy foydalanish

```bash
tor-guard status            # himoya holati va rejim
tor-guard doctor            # buzmaydigan holat tekshiruvi
tor-guard verify            # himoya butunligini tasdiqlaydi
tor-guard test-leaks --i-understand   # faol sizib chiqish tekshiruvlari (disposable VM)
sudo tor-guard restart      # firewall + Tor’ni ochiq oyna qoldirmasdan qayta qo‘llaydi
sudo tor-guard stop         # xizmatlarni to‘xtatadi — ODDIY INTERNET BLOKLANGAN HOLATDA QOLADI
sudo tor-guard emergency-lock         # eng cheklovchi bloklash (Tor kerak emas)
sudo tor-guard unlock-clearnet        # oddiy internetni aniq, audit qilinadigan tiklash
```

### Himoyalangan / Bloklangan / Ochilgan holatlar

| Holat       | Ma’nosi                                                             |
|-------------|--------------------------------------------------------------------|
| `PROTECTED` | Firewall faol, Tor sog‘lom, chiqish Tor orqali tasdiqlangan.       |
| `LOCKED`    | Firewall faol, Tor nosog‘lom/yo‘q — **barcha chiquvchi trafik bloklangan**. |
| `DEGRADED`  | Firewall faol, Tor ishlayapti, lekin halokatsiz tekshiruv muvaffaqiyatsiz. |
| `UNLOCKED`  | Kill switch aniq administrator amali bilan olib tashlangan — oddiy internetga ruxsat. |

Tor Guard yoki Tor’ni to‘xtatish sizni `UNLOCKED` emas, `LOCKED` holatida
qoldiradi. To‘g‘ridan-to‘g‘ri tarmoqni faqat `unlock-clearnet` tiklaydi.

## Ish rejimlari

- **STRICT** (standart, tavsiya etiladi): internet faqat Tor orqali; LAN,
  link-local, multicast, broadcast va IPv6 — barchasi bloklangan.
- **LAN-COMPATIBLE**: xuddi shunday, lekin aniq sozlangan `allowed_lan_cidrs`
  to‘g‘ridan-to‘g‘ri ochilishi mumkin. Yashirin LAN ruxsati yo‘q; ommaviy
  (public) CIDR’lar rad etiladi.

Qarang: [`docs/CONFIGURATION.md`](docs/CONFIGURATION.md).

## Agar tarmoq buzilsa (tiklash)

Mahalliy konsoldan:

```bash
sudo bash scripts/emergency-recover.sh        # faqat Tor Guard jadvallarini olib tashlaydi
```

U hech qachon `nft flush ruleset` bajarmaydi, shuning uchun boshqa firewall
qoidalaringiz saqlanib qoladi. To‘liq tartib:
[`docs/RECOVERY.md`](docs/RECOVERY.md).

## Testlash

```bash
make test          # birlik (unit) testlar (root/tarmoq kerak emas)
make all           # ruff + mypy(strict) + bandit + shellcheck + testlar
make nft-check     # qoidalar to‘plamini yaratadi va `nft -c` bilan tekshiradi
```

Destruktiv integratsiya va sizib chiqish testlari faqat disposable VM’larda
(`vm-tests/`), `TOR_GUARD_DISPOSABLE_VM=1` bilan ishlaydi. Qarang:
[`docs/TESTING.md`](docs/TESTING.md).

## Ma’lum cheklovlar

Ilova darajasidagi DoH/DoT (shifrlangan DNS :443/:853 ga) bloklanmaydi, balki
Tor orqali yo‘naltiriladi; host’dagi root Tor Guard’ni olib tashlashi mumkin;
QUIC umumiy UDP sifatida bloklanadi (brauzerlar TCP’ga qaytadi). To‘liq ro‘yxat:
[`docs/LIMITATIONS.md`](docs/LIMITATIONS.md).

## Litsenziya

MIT — [`LICENSE`](LICENSE) ga qarang.
