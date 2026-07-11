# Testlash

Uch daraja, ularning ta’sir doirasiga mos.

## 1. Birlik (unit) testlar — hamma joyda xavfsiz

Root yo‘q, tarmoq yo‘q, firewall o‘zgarishlari yo‘q. Haqiqiy `nft` binari yaratilgan
qoidalar to‘plamini tekshirish uchun **faqat check rejimida** (`nft -c`)
ishlatiladi.

```bash
make test                     # yoki: PYTHONPATH=src pytest tests/unit
make test-cov                 # coverage bilan
```

Qamrov xavfsizlik uchun kritik modullarga qaratilgan (qoidalar to‘plami generatori,
butunlik tekshiruvchisi, sozlama tekshiruvi, holat mashinasi, orchestrator
fail-closed yo‘llari, sizib chiqish natijasining uch holati).

Ular nimani qamrab oladi (tanlab):

- sozlama tahlili, qat’iy sxema, port/CIDR tekshiruvi, rejim qoidalari;
- qoidalar to‘plamini yaratish: default-drop, DNS redirect, Tor-uid istisnosi,
  IPv6 blok, UDP blok, atomik almashtirish idiomasi, LAN-rejim CIDR’lari; hamda
  **jonli `nft -c`**;
- firewall manager: bitta-tranzaksiyali atomik qo‘llash, qo‘llashdan-oldin-tekshirish,
  favqulodda bloklash, jadval olib tashlash hech qachon qoidalar to‘plamini
  tozalamasligi;
- butunlik: yo‘q jadvallar va zaiflashtirilgan siyosatlar aniqlanadi;
- Tor ulanish bosqichini tahlil qilish va vaqt tugashi; boshqaruv cookie
  autentifikatsiyasi; holat tekshiruvlari;
- DNS paketini qurish/tahlil qilish; tashqi-IP uch holati; sizib chiqish
  tekshiruvi mantig‘i;
- orchestrator: firewall-Tor’dan-oldin tartibi, "Tor yo‘q → bloklangan", "sizib
  chiqish → bloklangan", "tekshiruv mavjud emas → cheklangan, ochiq emas", "stop
  firewall’ni saqlaydi";
- monitor: butunlik yo‘qolishi → qayta qo‘llash, Tor tushib qolishi → qayta ishga
  tushirish, lekin hech qachon ochmaslik;
- o‘rnatuvchi backup/restore/rollback/manifest; platforma aniqlash; imtiyozlar.

## 2. Integratsiya testlari — faqat disposable VM

Haqiqiy firewall holatini o‘zgartiradi. `TOR_GUARD_DISPOSABLE_VM=1` **va** root
orqasida cheklangan; aks holda o‘tkazib yuboriladi.

```bash
sudo TOR_GUARD_DISPOSABLE_VM=1 pytest tests/integration -m integration -v
```

## 3. Sizib chiqish testlari — disposable VM, himoyalangan rejim faol

Haqiqiy chiquvchi urinishlar qiladi. `tor-guard start`dan keyin ishga tushiring.
Haqiqiy ommaviy IP hech qachon chop etilmaydi — faqat pass/fail va tekshiruv
nomlari.

```bash
sudo TOR_GUARD_DISPOSABLE_VM=1 pytest tests/leak -m leak -v
# yoki CLI to‘plami:
sudo tor-guard test-leaks --i-understand
```

Tekshiruvlar: to‘g‘ridan-to‘g‘ri IPv4/IPv6 TCP, UDP DNS, TCP DNS, tashqi UDP,
QUIC, muqobil resolver va Tor-ulanishni tasdiqlash. Kutiladi: Tor orqali
yo‘naltirilgan trafik muvaffaqiyatli; har bir to‘g‘ridan-to‘g‘ri/qo‘llab-
quvvatlanmaydigan yo‘l muvaffaqiyatsiz.

## To‘liq VM matritsasi

`vm-tests/` Ubuntu 24.04/22.04, Debian 12 va Kali uchun Vagrant muhitlarini
ta’minlaydi. Har biri toza VM’ni yuklaydi, Tor Guard’ni o‘rnatadi, himoyalangan
rejimni faollashtiradi, sizib chiqish to‘plamini ishga tushiradi, Tor
nosozligini va firewall buzilishini simulyatsiya qiladi hamda natijalarni yig‘adi.
Qarang: [`../vm-tests/README.md`](../vm-tests/README.md).

```bash
cd vm-tests/ubuntu-2404 && vagrant up && cat results/*.txt && vagrant destroy -f
```

## Statik tahlil va sifat darvozalari

```bash
make lint        # ruff
make format      # black + ruff --fix
make typecheck   # mypy (strict)
make security    # bandit
make shellcheck  # shellcheck skriptlari + vm provisioner
make nft-check   # qoidalar to‘plamini yaratish + nft -c bilan tekshirish
make all         # VM testlaridan tashqari hammasi
```

CI (`.github/workflows/`) statik darvozalarni, shellcheck’ni, systemd birligi
tekshiruvini, `nft -c` tekshiruvini, coverage bilan unit matritsasini
(3.11/3.12) va cheklangan integratsiya ishini ishga tushiradi.

## Nima bajarildi va nimaga VM kerak

Unit to‘plami, `nft -c` tekshiruvi va barcha statik darvozalar har qanday
muhitda (va CI’da) ishlaydi. **Integratsiya va sizib chiqish testlari root,
systemd va ishlaydigan Tor bilan disposable VM talab qiladi** — ular ta’minlangan
va cheklangan bo‘lib, rasmiy natijalar uchun o‘sha yerda ishga tushirilishi
kerak. Konteyner muhitlari har bir host-firewall stsenariysini to‘liq taqlid
qila olmaydi.
