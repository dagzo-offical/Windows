# Sozlamalar

Sozlamalar `/etc/tor-guard/tor-guard.yml` da joylashgan (rejim `0600`, root
egaligida). U qat’iy tekshiriladi: noma’lum kalitlar, noto‘g‘ri portlar va
noto‘g‘ri CIDR’lar rad etiladi, xavfli yashirin ruxsatlar rad qilinadi.
Tekshirish:

```bash
tor-guard config validate
tor-guard config show      # amaldagi, tekshirilgan qiymatlar
```

## Ma’lumotnoma

| Kalit | Turi | Standart | Izohlar |
|-----|------|---------|-------|
| `mode` | `strict` \| `lan-compatible` | `strict` | STRICT barcha LAN/IPv6’ni bloklaydi; LAN-COMPATIBLE `allowed_lan_cidrs`’ni ham ruxsat etadi. |
| `tor_user` | satr | `debian-tor` | Maxsus Tor xizmat hisobi; uning **uid**’i to‘g‘ridan-to‘g‘ri chiqishga ruxsat etilgan yagona identifikator. |
| `socks_port` | 1–65535 | `9050` | Loopback SOCKS porti. Farqli bo‘lishi shart. |
| `trans_port` | 1–65535 | `9040` | Loopback TransPort (shaffof TCP). |
| `dns_port` | 1–65535 | `5353` | Loopback DNSPort. |
| `control_port` | 1–65535 | `9051` | ControlPort (cookie autentifikatsiyasi). |
| `allowed_lan_cidrs` | IPv4 CIDR ro‘yxati | `[]` | **strict rejimida bo‘sh bo‘lishi shart.** Ommaviy CIDR’lar rad etiladi. |
| `interfaces` | satr ro‘yxati | `[]` | Ixtiyoriy tavsiyaviy interfeys ruxsat-ro‘yxati. |
| `monitor_interval` | butun ≥ 1 | `10` | Monitor tekshiruvlari orasidagi soniyalar. |
| `health_timeout` | butun ≥ 1 | `15` | Har bir tekshiruv uchun vaqt chegarasi. |
| `bootstrap_timeout` | butun ≥ 1 | `120` | Tor 100% ulanish bosqichini kutishning maksimal soniyalari. |
| `external_ip_endpoints` | https URL ro‘yxati | `["https://check.torproject.org/api/ip"]` | Uch holatli tekshiruv; ulanib bo‘lmaslik ≠ sizib chiqish. |
| `log_level` | DEBUG…CRITICAL | `INFO` | |
| `auto_restart_tor` | bool | `true` | Monitor Tor’ni qayta ishga tushiradi (hech qachon oddiy internetni ochmaydi). |
| `backup_dir` | yo‘l | `/var/lib/tor-guard/backups` | |
| `state_dir` | yo‘l | `/var/lib/tor-guard` | |
| `lock_file` | yo‘l | `/run/tor-guard.lock` | |
| `test_mode` | bool | `false` | `start` paytida faol sizib chiqish tekshiruvlarini o‘tkazib yuboradi (faqat CI/dev). |

## Rejimlar

### STRICT (tavsiya etiladigan standart)

Internet faqat Tor orqali. RFC1918, link-local (`169.254/16`), loopback tarmog‘i,
multicast/broadcast, CGNAT/maxsus oraliqlar va **barcha IPv6**’ni bloklaydi.
`allowed_lan_cidrs` bo‘sh bo‘lishi shart.

### LAN-COMPATIBLE

Internet uchun xuddi shu chiqish siyosati, lekin aniq ko‘rsatilgan quyi tarmoqlar
to‘g‘ridan-to‘g‘ri ochiladi (masalan, mahalliy printer yoki NAS). Namuna:

```yaml
mode: lan-compatible
allowed_lan_cidrs:
  - 192.168.1.0/24
```

Qoidalar:
- kamida bitta CIDR talab qilinadi;
- faqat IPv4 CIDR’lar (IPv6 doim bloklangan);
- ommaviy/global CIDR’lar rad etiladi (ular Tor’ni chetlab o‘tar edi).

## O‘zgarishlarni qo‘llash

```bash
sudoedit /etc/tor-guard/tor-guard.yml
sudo tor-guard reload     # torrc’ni qayta yaratadi + firewall’ni atomik qayta qo‘llaydi
```

`reload` hech qachon ochiq oyna yaratmaydi: yangi qoidalar to‘plami eskisini
bitta atomik `nft -f` tranzaksiyasida almashtiradi.

## Sirlar

Ochiq matndagi sirlar saqlanmaydi. Tor boshqaruviga kirish **cookie
autentifikatsiyasi**dan foydalanadi (`CookieAuthentication 1`); cookie — Tor
tomonidan yaratilgan, root o‘qiy oladigan fayl bo‘lib, hech qachon
loglashtirilmaydi. Loglar cookie’lar, hashlar va haqiqiy ommaviy IP’ga
o‘xshaydigan hamma narsani tozalaydigan redactor orqali o‘tadi.
