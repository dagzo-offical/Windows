# VM integratsiya va sizib chiqish testlari

Bu muhitlar **destruktiv** integratsiya va sizib chiqish testlarini disposable
(bir martalik) virtual mashinalarda ishga tushiradi — hech qachon ish
stansiyasida emas. Har bir distributiv toza VM’ni yuklaydigan, Tor Guard’ni
o‘rnatadigan, himoyalangan rejimni faollashtiradigan, sizib chiqish to‘plamini
ishga tushiradigan, Tor nosozligini va firewall buzilishini simulyatsiya
qiladigan hamda natijalarni `vm-tests/<distro>/results/` ostida yig‘adigan
`Vagrantfile`ga ega.

## Qo‘llab-quvvatlanadigan maqsadlar

| Papka            | Box                     | OS                    |
|------------------|-------------------------|-----------------------|
| `ubuntu-2404/`   | `bento/ubuntu-24.04`    | Ubuntu 24.04 LTS      |
| `ubuntu-2204/`   | `bento/ubuntu-22.04`    | Ubuntu 22.04 LTS      |
| `debian-12/`     | `debian/bookworm64`     | Debian 12             |
| `kali/`          | `kalilinux/rolling`     | Kali (Debian asosidagi) |

## Talablar

- Vagrant + VirtualBox (yoki moslashtirilgan provayder bloki bilan libvirt)
- Testlar `TOR_GUARD_DISPOSABLE_VM=1` bilan cheklangan, uni `provision.sh`
  o‘rnatadi.

## Ishga tushirish

```bash
cd vm-tests/ubuntu-2404
vagrant up            # yuklaydi, provisiya qiladi, to‘liq to‘plamni ishga tushiradi
cat results/*.txt     # sizib chiqish/nosozlik-simulyatsiya natijalarini ko‘rish
vagrant destroy -f    # VM’ni tashlab yuborish
```

## Provisioner nimani tekshiradi

1. `tor-guard install` + `config validate`
2. `tor-guard start` **protected**ga yetadi
3. `test-leaks` — to‘g‘ridan-to‘g‘ri IPv4/IPv6, UDP DNS, tashqi UDP, QUIC,
   muqobil resolver barchasi bloklangan; chiqish Tor orqali tasdiqlangan
4. **Tor-nosozlik simulyatsiyasi** — `systemctl stop tor`dan keyin oddiy
   internet mavjud bo‘lmasligi kerak (fail-closed)
5. **Firewall-buzilish simulyatsiyasi** — zanjirni tozalash, monitor qoidalar
   to‘plamini qayta tasdiqlashini kutish, so‘ng `verify`
6. `unlock-clearnet` tarmoqni tiklaydi

Haqiqiy ommaviy IP natijalarda hech qachon chop etilmaydi — faqat pass/fail va
tekshiruv nomlari.

> Eslatma: konteynerlar har bir host-firewall stsenariysini (namespace’lar,
> yadro netfilter xatti-harakati) to‘liq taqlid qila olmaydi. Rasmiy natijalar
> uchun, spetsifikatsiya talab qilganidek, to‘liq VM’lardan foydalaning.
