# hard-ctf — «Orbit Ops» (zanjirli web CTF, HARD)

Bitta **haqiqiy ko'rinishli** ichki «fleet control plane» konsoli, ichida **4 ta zanjirli
(chained) web zaiflik**. Har biri keyingisiga yo'l ochadi. Sof **Python 3** (standart
kutubxona) — **Docker/pip/internet kerak emas**, to'liq **oflayn** ishlaydi.

- **Port:** `8086` (brauzer/Burp uchun ochiq) · **Daraja:** HARD · **Flaglar:** 4
- Portal («CTF» moduli) flaglarni server tomonda tekshiradi; bu server faqat **nishon**.

## Ishga tushirish

```bash
cd lab/hard-ctf
./start-hard-ctf.sh          # 0.0.0.0:8086 — ekranda LAN manzilini chiqaradi
# yoki:  python3 ctf_server.py --host 0.0.0.0 --port 8086
./test-hard-ctf.sh           # 4 zaiflikni to'liq attack-chain bilan tekshiradi
```

Ishga tushgach `http://<LAN-IP>:8086` manzili chiqadi — o'quvchilar shu manzilga
brauzer + Burp bilan ulanadi. Firewall bloklasa: `sudo ufw allow 8086/tcp`.

## Zaifliklar zanjiri (yechim — qisqa)

| # | Zaiflik | Endpoint | Kalit texnika | Flag beradi |
|---|---|---|---|---|
| 1 | **Filtered UNION SQLi** | `GET /api/v1/node?id=` | Probel/kalit-so'z filtri → **`/**/`** komenti bilan bypass; `UNION SELECT` bilan `secrets` jadvalini o'qish (→ **`deploy_token`** ham sizadi) | 1-flag |
| 2 | **SSRF** | `GET /api/v1/fetch?url=` | `localhost`/`127.0.0.1`/**decimal** bloklangan → **hex `0x7f000001`** yoki **octal `0177.0.0.1`** bilan loopback'ga o'tish; host-only `/internal/metrics` | 2-flag |
| 3 | **LFI / path traversal** | `GET /internal/logs?file=` (SSRF orqali) | Katalogdan chiqish **`../secret/deploy.cfg`**; `/etc/passwd` ham (soxta) o'qiladi | 3-flag |
| 4 | **OS command injection** | `POST /api/v1/deploy` | 1-bosqichdagi **`token`** kerak; `image` tegi shell buyrug'iga qo'shiladi → **`; cat /root/flag.txt #`** | 4-flag (master) |

Zanjir: **SQLi → token** (4-bosqich uchun) · **SSRF → ichki API** (3-bosqichga kirish).

Recon: `/docs.html` public API'ni, `/robots.txt` esa `host-only` `/internal/` oilasini
oshkor qiladi. `/internal/*` to'g'ridan-to'g'ri **401** qaytaradi — faqat SSRF orqali.

## Xavfsizlik dizayni (muhim)

Bu server **native** (Docker'siz) ishlagani uchun zaifliklarning **ta'siri qamalgan**,
lekin **mantig'i haqiqiy** (foydalanuvchi xuddi real payloadni yozadi):

- **LFI** soxta **jail** katalogiga qamalgan (temp'da quriladi). `../` traversal ishlaydi va
  soxta `/etc/passwd`, config, flagni beradi — lekin xostning **haqiqiy** fayllariga
  (masalan real `/etc/shadow`, SSH kalitlari) **chiqmaydi**.
- **Command injection** ichki **simulyatsiya** shell orqali bajariladi (real host buyrug'i
  **ishga tushmaydi**) — `cat/ls/id/...` faqat jail fayllarini ko'radi. Zaiflik namoyish
  etiladi, lekin mashinaga zarar yetmaydi.
- **SSRF** faqat **loopback**'ga so'rov yuboradi — tashqi xostlarga chiqmaydi (oflayn +
  server SSRF-proksi sifatida suiste'mol qilinmaydi).

⚠️ **Ataylab zaif** — faqat izolyatsiya qilingan o'quv tarmog'ida, ruxsat berilgan
foydalanuvchilar uchun. Internetga ochmang.

## Portlar (butun platforma)

| Xizmat | Port |
|---|---|
| Platforma (login/portal) | 8000 |
| Burp Suite proksi | 8080 |
| Medium CTF — Nimbus Reports | 8085 |
| **HARD CTF — Orbit Ops** | **8086** |
