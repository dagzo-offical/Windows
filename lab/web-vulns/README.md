# web-vulns — Web Vulns Lab (amaliy mashq maydoni)

Web-Pentest darslaridagi zaifliklarni **amalda** sinash uchun **oflayn**, sof **Python 3**
(kutubxonasiz) zaif web-ilova. Har mashqda **REAL ekspluatatsiya qilinadigan** zaiflik bor;
yechilsa **flag** beriladi. Brauzer + **Burp** bilan hujum qiling, flagni `/flag_check` da
topshiring.

- **Port:** `8087` · **Daraja:** aralash · Docker/pip/internet **kerak emas**

## Ishga tushirish

```bash
cd lab/web-vulns
./start-lab.sh          # 0.0.0.0:8087  (yoki: python3 app.py --port 9000)
```

Ekranda LAN manzili chiqadi (`http://<LAN-IP>:8087`) — o'quvchilar shu manzilga ulanadi.
Bosh sahifada mashqlar ro'yxati; `/flag_check` da progres + **hintlar**.

## Mashqlar (batch 1)

| # | Zaiflik | Yo'l | Yechim (qisqa) |
|---|---|---|---|
| 1 | **SQL Injection** | `/sqli` | login: `admin'-- -` → admin sifatida kirish |
| 2 | **IDOR** | `/idor` → `?id=` | `id=1337` (egalik tekshirilmaydi) |
| 3 | **Path Traversal / LFI** | `/lfi?file=` | `../secret/flag.txt` |
| 4 | **OS Command Injection** | `/cmdi?host=` | `127.0.0.1; cat /flag` |
| 5 | **SSTI** | `/ssti?name=` | `{{7*7}}`→49 tasdiq, so'ng `{{flag}}` |
| 6 | **File Upload** | `/upload` | filtr faqat `.php` ni bloklaydi → `.phtml` / `.pHp` |

## Mashqlar (batch 2 — 3 mavzu × 3 daraja)

Har bir mavzu **oson / o'rta / qiyin** darajada. Texnikasi real (Burp bilan bajariladi),
ta'siri xavfsiz qamalgan. Darsliklar: L38 (NoSQL), L39 (JWT), L40 (Business Logic).

| # | Zaiflik | Daraja | Yo'l | Yechim (qisqa) |
|---|---|---|---|---|
| 7 | **NoSQL — Auth bypass** | oson | `/nosql` | `password[$ne]=x` yoki `{"$ne":null}` operator obyekti |
| 8 | **NoSQL — Blind regex** | o'rta | `/nosql/blind` | `password[$regex]=^M…` bilan parolni belgima-belgi chiqarish |
| 9 | **NoSQL — $where leak** | qiyin | `/nosql/search` | `filter={"public":{"$ne":true}}` yoki `{"$where":"1==1"}` |
| 10 | **JWT — alg:none** | oson | `/jwt` | `alg:none`, `role:admin`, imzo bo'sh |
| 11 | **JWT — weak secret** | o'rta | `/jwt/hs` | HS256 sirini (`secret`) buzib, admin token qayta imzolash |
| 12 | **JWT — embedded JWK** | qiyin | `/jwt/jwk` | header ichiga o'z kalitni joylab, o'sha kalit bilan imzolash |
| 13 | **Logic — negative qty** | oson | `/biz` | manfiy miqdor → manfiy jami («refund») |
| 14 | **Logic — coupon stack** | o'rta | `/biz/coupon` | bitta kuponni ko'p marta qo'llash → narx ≤ 0 |
| 15 | **Logic — workflow bypass** | qiyin | `/biz/premium` | `/biz/confirm?item=premium&paid=1` (forced browsing) |

## Mashqlar (batch 3 — 2 mavzu × 3 daraja)

Darsliklar: L53 (Subdomain Takeover), L54 (CSP Bypass). CSP labi **haqiqiy brauzer CSP'sini**
majbur qiladi (payloadni Chrome/Firefox'da sinang); takeover provayder fingerprintlarini simulyatsiya qiladi.

| # | Zaiflik | Daraja | Yo'l | Yechim (qisqa) |
|---|---|---|---|---|
| 16 | **Subdomain Takeover — S3** | oson | `/takeover/easy` | `NoSuchBucket` dangling bucket → provider=s3, resource=bucket |
| 17 | **Subdomain Takeover — GitHub** | o'rta | `/takeover/medium` | «There isn't a GitHub Pages site here» → provider=github, resource=`<user>` |
| 18 | **Subdomain Takeover — Heroku** | qiyin | `/takeover/hard` | takeover-safe 404'larni chetlab, «No such app» → provider=heroku |
| 19 | **CSP Bypass — unsafe-inline** | oson | `/csp/easy` | `'unsafe-inline'` bor → inline `<script>` ishlaydi |
| 20 | **CSP Bypass — JSONP** | o'rta | `/csp/medium` | `script-src 'self'` → `/csp/jsonp?callback=<JS>` orqali |
| 21 | **CSP Bypass — unsafe-eval** | qiyin | `/csp/hard` | random nonce + `'unsafe-eval'` → `?x=` eval-gadget |

CSP labida: bajarilgan JS `window.CSP_FLAG_TOKEN` ni `/csp/<tier>/win?t=` ga yuboradi (Image/fetch),
so'ng sahifani yangilaganda flag chiqadi. Payload CSP'ni aylanib o'tmasa — brauzer uni bloklaydi.

## Xavfsizlik dizayni

Bu ilova **native** (Docker'siz) ishlagani uchun zaifliklar **ta'siri qamalgan**, lekin
**mantig'i haqiqiy** (foydalanuvchi xuddi real payloadni yozadi):

- **LFI** soxta **jail** katalogiga qamalgan — `../` traversal ishlaydi, soxta
  `/etc/passwd`/secret'ni beradi, lekin xostning haqiqiy fayllariga chiqmaydi.
- **Command Injection** ichki **simulyatsiya** shell orqali — real host buyrug'i
  bajarilmaydi (`cat/ls/id/...` faqat jail fayllarini ko'radi).
- **SSTI** cheklangan **baholovchi** (Python `eval` EMAS) — RCE/sandbox-escape imkoni yo'q.
- **SQLi** vaqtinchalik SQLite'da; **File Upload** faqat nomni tekshiradi (fayl bajarilmaydi).
- **NoSQL** — soxta hujjatlar ustida sof-Python operator-baholovchi; `$where` real JavaScript EMAS
  (faqat tavtologiya tan olinadi) — RCE imkoni yo'q.
- **JWT** — stdlib `hmac`/`hashlib` bilan HS256; zaifliklar (alg:none, zaif sir, o'rnatilgan JWK)
  ataylab, lekin faqat lab tokenlariga ta'sir qiladi.
- **Business Logic** — sof arifmetika va holat; host yoki tashqi tizimga ta'sir yo'q.
- **Subdomain Takeover** — soxta DNS/provider muhiti **simulyatsiyasi**; haqiqiy DNS/bulut
  provayderiga tegilmaydi (real takeover DNS + bulut hisob talab qiladi).
- **CSP Bypass** — `?name=` **ataylab** tozalanmasdan aks etadi (in'ektsiya nuqtasi), lekin bu
  faqat izolyatsiya qilingan lab; CSP sarlavhasi haqiqiy — brauzer uni majburlaydi.

⚠️ **Ataylab zaif** — faqat izolyatsiya qilingan o'quv tarmog'ida. Internetga ochmang.

## Rejalar

Keyingi batch'larda qo'shiladi: Reflected/Stored XSS, SSRF, XXE, CSRF, Insecure
Deserialization, Race Condition, Broken Auth va boshqalar — har biri alohida mashq va flag bilan.
