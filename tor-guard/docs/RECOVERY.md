# Tiklash

Tor Guard fail-closed: biror narsa noto‘g‘ri ketganda siz internet kirishini
yo‘qotasiz, anonimligingizni emas. Bu qo‘llanma tarmoqni xavfsiz tiklaydi.

## 1. Avval holatni tushuning

```bash
tor-guard status      # PROTECTED / LOCKED / DEGRADED / UNLOCKED
tor-guard doctor      # aynan nima nosog‘lom
journalctl -u tor-guard-firewall -u tor-guard-monitor --no-pager | tail
```

- Tor nosog‘lom bo‘lganda `LOCKED` — bu **dizayn bo‘yicha**. Tor’ni tuzatish
  (yoki monitor uni qayta ishga tushirishini kutish) odatda sizni `PROTECTED`
  holatiga qaytaradi.
- Muvaffaqiyatsiz tashqi-IP tekshiruvi *tekshiruv mavjud emas* deb xabar qiladi,
  bu sizib chiqish yoki nosozlik dalili **emas**.

## 2. Oddiy internetni ataylab tiklash (oddiy yo‘l)

```bash
sudo tor-guard unlock-clearnet
# yoki muayyan tekshirilgan zaxirani tiklash:
sudo tor-guard unlock-clearnet --backup /var/lib/tor-guard/backups/ruleset-<ts>.nft
```

Bu alohida, aniq, audit qilinadigan amal. U Tor Guard jadvallarini olib tashlaydi
(va ixtiyoriy ravishda saqlangan zaxirani tiklaydi) — hech qachon butun qoidalar
to‘plamini ko‘r-ko‘rona tozalamaydi va begona administrator qoidalarini saqlaydi.

## 3. Oflayn tiklash (CLI buzilgan / login shell yo‘q)

**Mahalliy konsoldan** (SSH emas, uni kill switch bloklashi mumkin):

```bash
sudo bash /path/to/tor-guard/scripts/emergency-recover.sh --status   # ko‘rib chiqish
sudo bash /path/to/tor-guard/scripts/emergency-recover.sh            # jadvallarni olib tashlash
```

`emergency-recover.sh` ataylab qisqa va audit qilinadigan. U:

- **faqat** `tor_guard_nat`, `tor_guard_filter`, `tor_guard6` va
  `tor_guard_lock`’ni o‘chiradi;
- **hech qachon** `nft flush ruleset` bajarmaydi;
- agar DNS hali ham ishlamasa, DHCP/tarmoqni qayta ishga tushirish yo‘lini chop
  etadi.

Agar shundan keyin ham tarmoq buzilgan bo‘lsa:

```bash
sudo systemctl restart systemd-networkd  # yoki: sudo dhclient <iface>
sudo systemctl restart NetworkManager    # NM boshqaradigan hostlar
```

## 4. Muvaffaqiyatsiz o‘rnatish/yangilanishdan tiklash

O‘rnatuvchi tranzaksion. Muvaffaqiyatsiz o‘rnatish o‘zining yozib olingan
amallarini avtomatik oldingi holatga qaytaradi; agar qaytarish to‘liq tiklay
olmasa, favqulodda bloklashni yoqadi (host **bloklangan**, ochiq emas).
Tozalashni qo‘lda yakunlash uchun:

```bash
sudo bash scripts/emergency-recover.sh          # har qanday Tor Guard jadvalini olib tashlash
sudo tor-guard uninstall || true                # manifestga tegishli fayllarni olib tashlash
```

O‘rnatish manifesti (`/var/lib/tor-guard/manifest.json`) Tor Guard nimaga
egaligini aynan sanab beradi, shuning uchun tiklash hech qachon boshqa
sozlamalaringizga tegmaydi.

## 5. Yuklanishda o‘chirish

```bash
sudo tor-guard disable      # yuklanishda ishga tushishni to‘xtatadi (oddiy internetni OCHMAYDI)
```

Host’ni to‘liq oddiy holatga qaytarish uchun: `disable`, so‘ng
`unlock-clearnet`, so‘ng `uninstall`.

## Nosozlik-holat xulosasi

Rasmiy jadvalga qarang:
[`SECURITY_INVARIANTS.md`](SECURITY_INVARIANTS.md#failure-state-table-authoritative).
Sanab o‘tilgan har bir nosozlik *bloklangan* yoki *bloklangan holat*ga olib
keladi, hech qachon oddiy internetga emas.
