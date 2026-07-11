# Nosozliklarni bartaraf etish

Quyidagilardan boshlang:

```bash
tor-guard status
tor-guard doctor
journalctl -u tor-guard-firewall -u tor-guard-monitor -u tor --no-pager | tail -50
tor-guard logs -n 100
```

## `start`dan keyin internet yo‘q

Agar `status` `LOCKED` ko‘rsatsa — bu kutilgan holat: bu fail-closed xatti-harakat,
xato emas. Tor nima uchun nosog‘lomligini tekshiring:

- `tor-guard doctor` → `tor:transport`, `tor:dnsport`, `tor:circuit`’ga qarang.
- `systemctl status tor` va `journalctl -u tor` → ulanish bosqichi xatolari,
  noto‘g‘ri `User`, port to‘qnashuvlari.
- Senzuralangan tarmoqda Tor bridge’larsiz ulanish bosqichini o‘tay olmasligi
  mumkin. Tor 100%’ga yetguncha Tor Guard bloklangan qoladi — dizayn bo‘yicha.

## `start` "bootstrap" bosqichida bekor bo‘ladi

Tor `bootstrap_timeout` ichida 100%’ga yetmadi. Vaqt chegarasini oshiring, tor
uid uchun ulanishni tekshiring yoki torrc drop-in’da bridge’larni sozlang. Bu
vaqtda host bloklangan qoladi.

## `start` "kerakli Tor portlari mavjud emas" bosqichida bekor bo‘ladi

TransPort/DNSPort ulanishlarni qabul qilmayapti. Drop-in
`/etc/tor/torrc.d/10-tor-guard.conf` sizning sozlama portlaringizga mos
kelishini va `tor --verify-config` o‘tishini tekshiring. `sudo tor-guard reload`
ni qayta ishga tushiring.

## "external-connectivity: tekshiruv mavjud emas"

Tekshiruv endpointiga ulanib bo‘lmadi. Bu **ma’lumot xarakterida**, sizib chiqish
emas. Agar portlar va kanal sog‘lom bo‘lsa, siz hali ham himoyalangansiz (holat
`DEGRADED` ko‘rsatishi mumkin). Boshqa `external_ip_endpoints` yozuvini sinab
ko‘ring.

## DNS aniqlanmayapti

- Sozlamadagi `dns_port` torrc drop-in’ga mos kelishini tasdiqlang.
- `dig @127.0.0.1 -p 5353 example.com` Tor orqali aniqlanishi kerak.
- To‘g‘ridan-to‘g‘ri resolverlar (`/etc/resolv.conf` `8.8.8.8`ga ishora qiluvchi)
  ataylab Tor DNSPort’ga yo‘naltiriladi; bu kutilgan holat.

## Docker/VM konteynerlari tarmoqni yo‘qotdi

Shaffof yo‘naltirib bo‘lmaydigan konteyner chiqishi tashlanadi (fail-closed).
Agar sizga Tor orqali konteyner interneti kerak bo‘lsa, bu ma’lum chekka holat —
[`LIMITATIONS.md`](LIMITATIONS.md)ga qarang. LAN-COMPATIBLE rejimini faqat
ishonchli mahalliy quyi tarmoqlar uchun ishlating.

## Firewall qoidalari "qaytaverib turibdi"

Bu butunlik monitori o‘z ishini bajaryapti (invariant I10). O‘zgartirish kiritish
uchun sozlamani tahrirlang va `tor-guard reload` qiling yoki avval `disable` +
`unlock-clearnet` qiling.

## SSH orqali kirish bloklandi

Kill switch xavfli tarmoqlarda mashinaga SSH’ni bloklashi mumkin. **Mahalliy
konsoldan** tiklang:

```bash
sudo bash scripts/emergency-recover.sh
```

Qarang: [`RECOVERY.md`](RECOVERY.md).

## Qayta o‘rnatish / qayta tiklash

```bash
sudo bash scripts/emergency-recover.sh
sudo tor-guard uninstall
sudo bash scripts/install.sh
```

## Diagnostika to‘plamini yig‘ish

```bash
tor-guard doctor
```

Diagnostika yig‘uvchi (qo‘llab-quvvatlash to‘plamlari uchun ishlatiladi) sirlarni
yashiradi va hech qachon haqiqiy ommaviy IP’ingizni kiritmaydi.
