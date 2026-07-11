# O‘zgarishlar tarixi (Changelog)

Tor Guard’dagi barcha muhim o‘zgarishlar shu yerda hujjatlashtiriladi. Format
taxminan [Keep a Changelog](https://keepachangelog.com/) ga amal qiladi; bu
loyiha semantik versiyalashdan foydalanadi.

## [1.0.0] — 2026-07-10

Dastlabki nashr.

### Qo‘shildi
- Ubuntu 24.04/22.04, Debian 12 va Kali (systemd + nftables) uchun fail-closed,
  butun tizim bo‘ylab Tor transparent-proxy kill switch.
- Ikki ish rejimi: STRICT (standart) va qat’iy CIDR tekshiruvi bilan
  LAN-COMPATIBLE.
- Atomik nftables qoidalar to‘plamini yaratish va qo‘llash (`nft -f`), har bir
  qo‘llashdan oldin ishga tushiriladigan sintaksis/semantik tekshiruvchi
  (`nft -c`) bilan.
- Mos keluvchi TCP’ni Tor TransPort’ga va DNS’ni Tor DNSPort’ga shaffof
  yo‘naltirish; qolgan hamma narsa uchun default-deny.
- IPv6 firewall darajasida bloklangan (marshrutdan mustaqil); umumiy chiquvchi
  UDP va QUIC bloklangan; to‘g‘ridan-to‘g‘ri DNS bloklangan.
- Maxsus-Tor-uid chiqish istisnosi (barqaror uid bo‘yicha, hech qachon PID emas).
- Avtomatik qayta-tasdiqlash bilan firewall butunligi monitoringi; avtomatik
  qayta ishga tushirish bilan Tor ishdan chiqishini boshqarish — hech qachon
  oddiy internetni tiklamasdan.
- Tor o‘rnatilmagan bo‘lsa ham ishlaydigan favqulodda bloklash.
- Aniq, audit qilinadigan `unlock-clearnet` (zaxiradan tiklash yoki toza olib
  tashlash; hech qachon `nft flush ruleset` emas).
- Tor boshqaruvi: torrc drop-in yaratish, cookie-autentifikatsiyali ControlPort
  klienti, 100%-ulanish bosqichi shartligi, port/kanal holat tekshiruvlari.
- Vaqt tamg‘ali zaxiralar, fayl hashlash, manifest va rollback bilan
  tranzaksion o‘rnatuvchi; faqat o‘ziga tegishli fayllarni olib tashlaydigan mos
  o‘chiruvchi.
- Oflayn tiklash skripti (`scripts/emergency-recover.sh`) va to‘liq
  `docs/RECOVERY.md`.
- Typer/Rich CLI: `install, uninstall, enable, disable, start, stop, restart,
  status, doctor, verify, logs, emergency-lock, unlock-clearnet, reload,
  config show, config validate, test-leaks`.
- To‘g‘ri tartib (tarmoqdan oldin firewall, firewall’dan keyin Tor, Tor’dan
  keyin monitor) va sandbox direktivalari bilan mustahkamlangan systemd
  birliklari.
- Sir/haqiqiy-IP’ni yashirish (redaction) bilan strukturali loglash va alohida
  audit log.
- Sizib chiqish testlari to‘plami (to‘g‘ridan-to‘g‘ri IPv4/IPv6, UDP/TCP DNS,
  tashqi UDP, QUIC, muqobil resolver, Tor-chiqishni tasdiqlash) va to‘rtala
  qo‘llab-quvvatlanadigan distributiv uchun disposable-VM tizimi.
- 136 birlik testi; jonli `nft -c` tekshiruvi; statik tahlil, shellcheck,
  systemd tekshiruvi va unit/integratsiya matritsasi uchun CI.

### Xavfsizlik
- To‘liq tahdid modeli (`docs/THREAT_MODEL.md`), test bog‘lanishi bilan
  xavfsizlik invariantlari (`docs/SECURITY_INVARIANTS.md`) va rasmiy nosozlik-
  holat jadvali.
- Aniq anonimlik ogohlantirishlari va hujjatlashtirilgan cheklovlar
  (`docs/LIMITATIONS.md`).

### Ma’lum cheklovlar
- Ilova darajasidagi DoH/DoT bloklanmaydi, balki Tor orqali yo‘naltiriladi.
- Ixtiyoriy konteyner/namespace trafigini to‘liq shaffof proksilashda chekka
  holatlar mavjud (fail-closed, hech qachon sizib chiqmaydi).
- IPv6-Tor-orqali yo‘li yo‘q (IPv6 bloklangan).
