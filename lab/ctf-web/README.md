# ctf-web — «Nimbus Reports» (web CTF, MEDIUM)

Bitta **haqiqiy ko'rinishli** SaaS sayti, ichida **4 ta web zaiflik**. SSH/root yo'q — sof web
qatlami. Brauzer + **Burp Suite** bilan buziladi; path'lar **gobuster** bilan topiladi
(`-x php,txt`). Portalda («CTF» moduli) flaglar topshiriladi.

- **IP:** `10.10.20.60`  ·  **host port:** `8085` (brauzer/Burp uchun ochiq)
- **Daraja:** MEDIUM  ·  **Flaglar:** 4 (har zaiflik uchun bittadan)

## Zaifliklar, path'lar va flaglar

| # | Zaiflik | Endpoint | Topish (wordlist) | Yechim (qisqa) | Flag |
|---|---|---|---|---|---|
| 1 | **IDOR** / broken access | `POST /download.php` | `common.txt` | `report_id` 1..12 emas, **Burp bilan `report_id=0`** | `EJPT{id0r_burp_r3p0rt_z3r0}` |
| 2 | **Information disclosure** (encoded) | `/storage-backup/` (open listing) | **`directory-list-2.3-medium`** (common'da yo'q) | ochiq katalogdagi `.sql.txt` → **base64 dekod** | `EJPT{3nc0d3d_b4ckup_l34k}` |
| 3 | **Reflected XSS** + WAF bypass | `/search.php?q=` | `common.txt` | `<script>`/`onerror` bloklangan → `<svg onload=...>` bilan `fetch('/flag.php')` (same-origin) | `EJPT{w4f_byp4ss_x55_r3fl3ct}` |
| 4 | **SSRF** + decimal bypass | `/fetch.php?url=` | `common.txt` | `127.0.0.1` bloklangan → `http://2130706433/admin-metrics.php` | `EJPT{ssrf_d3c1m4l_2_l0c4l}` |

Chalg'ituvchi (zaif emas) sahifalar: `/`, `about.php`, `pricing.php`, `blog.php`, `help.php`,
`login.php`, `contact.php` — haqiqiy SaaS saytdek to'liq kontent. **Zaif sahifalar ham hech qanday
"nima qilish kerak" matnini ko'rsatmaydi** (WAF banneri yo'q; qidiruv/import — oddiy funksiyalar;
filtrlar jim ishlaydi) — foydalanuvchi zaiflikni o'zi aniqlaydi.

## Ichki tuzilishi (maintainer uchun)

- Flaglar `entrypoint.sh` da yoziladi: IDOR → `/opt/ctf/reports/0.txt` (1..12 = bir xil dummy);
  XSS → `/opt/ctf/xflag.txt` (`flag.php` faqat `Sec-Fetch-Site: same-origin` ga beradi);
  SSRF → `/opt/ctf/ssrf.txt` (`admin-metrics.php` faqat `REMOTE_ADDR=127.0.0.1` ga beradi);
  info-disc → `/var/www/html/storage-backup/…sql.txt` (base64).
- `download.php` hisobotlarni **webroot'dan tashqarida** (`/opt/ctf/reports`) `(int)report_id` bo'yicha
  beradi — diapazon tekshirilmaydi (0 ham ishlaydi), path traversal (int cast) yopiq.
- `storage-backup/` uchun `Options +Indexes` (Dockerfile) — ochiq katalog ro'yxati.

## Ishga tushirish (lab tarkibida)

```bash
cd platform && docker compose up -d --build ctf-web    # yoki butun stack
# brauzerda:  http://localhost:8085   (yoki http://<host-ip>:8085 tarmoqdan)
```

⚠️ **Ataylab zaif** — faqat izolyatsiya qilingan lab tarmog'ida, ruxsat berilgan
foydalanuvchilar uchun. Internetga ochmang.
