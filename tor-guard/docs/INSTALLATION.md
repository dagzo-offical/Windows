# O‘rnatish

## Talablar

- Quyidagilardan biri: Ubuntu 24.04, Ubuntu 22.04, Debian 12, joriy Kali
  (Debian asosidagi)
- systemd, root kirishi, chiquvchi tarmoq (Tor tarmog‘iga ulanish uchun)
- Python 3.11+

O‘rnatuvchi qo‘llab-quvvatlanmaydigan platformalarni aniqlaydi va **host’ni
o‘zgartirmasdan** to‘xtaydi.

## Tez o‘rnatish

```bash
git clone https://github.com/dagzo-offical/windows.git
cd windows/tor-guard
sudo bash scripts/install.sh
```

`scripts/install.sh`:

1. platformani tekshiradi (`/etc/os-release`);
2. `nftables`, `tor`, `python3`, `python3-pip`’ni o‘rnatadi;
3. `tor-guard` Python paketini o‘rnatadi;
4. `tor-guard install`’ni ishga tushiradi, u:
   - `/etc/tor-guard`, `/var/lib/tor-guard`, `/var/log/tor-guard` papkalarini
     yaratadi (rejim `0700`, root egaligida);
   - mavjud `/etc/tor/torrc` va sozlamalarni zaxiralaydi;
   - `/etc/tor-guard/tor-guard.yml`’ni o‘rnatadi (faqat mavjud bo‘lmasa —
     sizning sozlamangiz hech qachon ustidan yozilmaydi);
   - Tor drop-in `/etc/tor/torrc.d/10-tor-guard.conf`’ni yozadi;
   - systemd birliklarini o‘rnatadi;
   - toza o‘chirish uchun o‘rnatish manifestini yozib qo‘yadi.

Agar biror o‘rnatish bosqichi muvaffaqiyatsiz bo‘lsa, o‘rnatuvchi yozib olingan
amallarni oldingi holatga qaytaradi; agar qaytarish to‘liq tiklay olmasa,
favqulodda bloklashni yoqadi, shunda host **bloklangan, hech qachon ochiq emas**.

## Sozlash

```bash
sudoedit /etc/tor-guard/tor-guard.yml
sudo tor-guard config validate
```

Qarang: [`CONFIGURATION.md`](CONFIGURATION.md).

## Faollashtirish

```bash
sudo tor-guard start     # firewall qo‘llash -> Tor’ni ishga tushirish -> tekshirish -> PROTECTED
sudo tor-guard status
```

`start` to‘liq ketma-ketlikni bajaradi: root tekshiruvi → platforma → sozlama →
dependency’lar → zaxira → qoidalar to‘plamini tekshirish → **kill switchni
qo‘llash** → Tor’ni ishga tushirish → 100% ulanish bosqichini kutish → portlarni
tekshirish → Tor chiqishini tasdiqlash → to‘g‘ridan-to‘g‘ri/IPv6/UDP bloklanganini
tasdiqlash → himoyalangan deb belgilash. Agar biror kerakli bosqich muvaffaqiyatsiz
bo‘lsa, u **bloklangan** qoladi va aniq nosozlikni chop etadi.

## Yuklanishda yoqish

```bash
sudo tor-guard enable
```

Bu `tor-guard.target`’ni yoqadi. Firewall birligi `Before=network-pre.target`
tartibida joylashgan, shuning uchun kill switch interfeyslar ko‘tarilishidan
oldin mavjud bo‘ladi — yuklanishda oddiy internet oynasi yo‘q.

## Qo‘lda o‘rnatish (bootstrap skriptisiz)

```bash
sudo apt-get install -y nftables tor python3 python3-pip
sudo python3 -m pip install --break-system-packages .
sudo tor-guard install --resource-dir "$(pwd)"
```

## O‘chirish (uninstall)

```bash
sudo bash scripts/uninstall.sh            # fayllar + firewall’ni olib tashlaydi (tarmoqni tiklaydi)
sudo bash scripts/uninstall.sh --keep-firewall   # fayllarni olib tashlaydi, blokni saqlaydi
```

O‘chirish faqat manifestga tegishli fayllarni olib tashlaydi; u hech qachon
begona administrator sozlamalarini o‘chirmaydi.
