# CyberSecurity Platform — Backend (auth · admin · lab)

Bu — o'quv platformasining **backend** qismi: foydalanuvchi **ro'yxatdan o'tishi/kirishi**, **administrator paneli** (kim qaysi modul/lab/terminalga kira olishini boshqarish), **virtual mashinalarni restart qilish** va **brauzer terminali** orqali zaif VM'larni buzish.

> ⚠️ Bularning hammasi **server (backend)** talab qiladi — statik GitHub Pages'da ishlamaydi. Uni o'z kompyuteringizda yoki serveringizda `docker compose` bilan ishga tushiring.

## Ishga tushirish (bir buyruq)

```bash
cd platform
./start.sh          # Docker'ni tekshiradi, quradi, ishga tushiradi, URL beradi
```

To'xtatish: `./stop.sh`

Yoki qo'lda:
```bash
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

Platforma bilan birga **6 ta haqiqiy zaif mashina** ishga tushadi (izolyatsiya qilingan Docker tarmog'ida). Har biri **turli daraja** va **turli zaiflik** — lekin oqim bir xil: **web/xizmat zaifligi → SSH cred/hash → SSH → oddiy user → root**.

| Mashina | Daraja | IP | Zaiflik → kirish |
|---|---|---|---|
| web-easy (shopzone) | 🟢 easy | 172.20.0.40 | ochiq `config.old` (info disclosure) → SSH → `sudo bash` → root |
| linux-02 (backend) | 🟢 easy | 172.20.0.20 | anon FTP + zaif SSH → SUID `find` → root |
| web-01 (acme.lab) | 🟡 medium | 172.20.0.10 | web SQLi → parol **hash** sizadi → john bilan crack → SSH → root; **pivot nuqtasi** |
| smb-03 (fileserver) | 🟡 medium | 172.20.0.30 | SMB null-session → cred → yoziladigan root skript → root |
| web-hard (monitorpanel) | 🔴 hard | 172.20.0.50 | **LFI** → SSH cred sizadi → SSH → `perl` **cap_setuid** → root |
| internal-04 (vault) | 🔴 hard | 10.10.10.20 | **faqat web-01 orqali pivot** → command injection → final |

Jami **11 ta flag**. Terminaldan hujum: `docker exec` shart emas — **Web Terminal**ni oching (dashboard'da) va:
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
├── docker-compose.yml   # backend + attacker(ttyd) + 6 VM
└── data/                # users.json, secret (volume)
```
