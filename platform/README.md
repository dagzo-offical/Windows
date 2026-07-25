# CyberSecurity Platform — Backend (auth · admin · lab)

Bu — o'quv platformasining **backend** qismi: foydalanuvchi **ro'yxatdan o'tishi/kirishi**, **administrator paneli** (kim qaysi modul/lab/terminalga kira olishini boshqarish), **virtual mashinalarni restart qilish** va **brauzer terminali** orqali zaif VM'larni buzish.

> ⚠️ Bularning hammasi **server (backend)** talab qiladi — statik GitHub Pages'da ishlamaydi. Uni o'z kompyuteringizda yoki serveringizda `docker compose` bilan ishga tushiring.

## Ishga tushirish

```bash
cd platform
docker compose up -d --build
```

So'ng brauzerda: **http://localhost:8080**

- Birinchi **ro'yxatdan o'tgan** foydalanuvchi avtomatik **administrator** bo'ladi (darhol faol).
- Keyingi ro'yxatdan o'tganlar **"pending"** (kutish) holatida — administrator ularni **tasdiqlashi** va **ruxsat berishi** kerak.

To'xtatish / tozalash:
```bash
docker compose down            # to'xtatadi (foydalanuvchilar saqlanadi — named volume)
docker compose down -v         # foydalanuvchilarni ham o'chiradi
```

## Nima ishlaydi

| Qism | Tavsif |
|---|---|
| **Ro'yxatdan o'tish / Kirish** | Parollar `scrypt` bilan hash qilinadi; sessiya — HMAC bilan imzolangan cookie. |
| **Admin panel** (`/admin`) | Foydalanuvchilarni tasdiqlash/bloklash, rol (admin/user), va **ruxsatlarni** (modul/lab/terminal) bosib berish/olish. |
| **Ruxsat nazorati** | Foydalanuvchi faqat admin **ruxsat bergan** modullarni ochadi; qolganlari `403`. |
| **VM restart** | Admin panelidan zaif mashinalarni (`docker restart`) qayta ishga tushirish. |
| **Web Terminal** (`/terminal`) | `terminal` ruxsati bo'lganlar uchun brauzerdagi to'liq terminal (ttyd) — VM'larni shu yerdan buzadi. |

## Virtual mashinalar (lab)

Platforma bilan birga 4 ta **haqiqiy zaif mashina** ishga tushadi (izolyatsiya qilingan Docker tarmog'ida):

| Mashina | IP | Kirish |
|---|---|---|
| web-01 (acme.lab) | 172.20.0.10 | web zaifligi → root; ichki tarmoqqa **pivot** |
| linux-02 | 172.20.0.20 | FTP/SSH → SUID → root |
| smb-03 | 172.20.0.30 | SMB null-session → root |
| internal-04 | 10.10.10.20 | **faqat web-01 orqali pivot** |

Terminaldan hujum: `docker exec` shart emas — **Web Terminal**ni oching (dashboard'da) va:
```bash
nmap -sn 172.20.0.0/24
```
To'liq yechim: [`../lab/WALKTHROUGH.md`](../lab/WALKTHROUGH.md).

## Foydalanuvchi oqimi

1. `/register` — ro'yxatdan o'tadi (birinchi = admin).
2. Admin `/admin`da uni **tasdiqlaydi** va kerakli **ruxsatlarni** beradi (masalan: `network`, `ejpt`, `terminal`).
3. Foydalanuvchi `/dashboard`da faqat **ochilgan** narsalarni ko'radi va ishlatadi.

## Xavfsizlik eslatmalari

- Bu — **o'quv** platformasi. Ishlab chiqarishda: HTTPS (reverse proxy), kuchli sessiya sozlamalari, va `docker.sock`ni ehtiyotkorlik bilan ishlating (u host Docker'ni boshqaradi).
- Zaif VM'lar **ataylab** zaif — faqat izolyatsiya qilingan lab tarmog'ida saqlang, internetga ochmang.

## Fayl tuzilishi

```
platform/
├── server.js            # pure-Node backend (auth, admin, RBAC, VM restart, terminal proxy)
├── public/              # frontend: login, register, dashboard, admin
├── Dockerfile
├── docker-compose.yml   # backend + attacker(ttyd) + 4 VM
└── data/                # users.json, secret (volume)
```
