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

## Xavfsizlik dizayni

Bu ilova **native** (Docker'siz) ishlagani uchun zaifliklar **ta'siri qamalgan**, lekin
**mantig'i haqiqiy** (foydalanuvchi xuddi real payloadni yozadi):

- **LFI** soxta **jail** katalogiga qamalgan — `../` traversal ishlaydi, soxta
  `/etc/passwd`/secret'ni beradi, lekin xostning haqiqiy fayllariga chiqmaydi.
- **Command Injection** ichki **simulyatsiya** shell orqali — real host buyrug'i
  bajarilmaydi (`cat/ls/id/...` faqat jail fayllarini ko'radi).
- **SSTI** cheklangan **baholovchi** (Python `eval` EMAS) — RCE/sandbox-escape imkoni yo'q.
- **SQLi** vaqtinchalik SQLite'da; **File Upload** faqat nomni tekshiradi (fayl bajarilmaydi).

⚠️ **Ataylab zaif** — faqat izolyatsiya qilingan o'quv tarmog'ida. Internetga ochmang.

## Rejalar

Keyingi batch'larda qo'shiladi: Reflected/Stored XSS, SSRF, XXE, CSRF, Insecure
Deserialization, Race Condition, Broken Auth va boshqalar — har biri alohida mashq va flag bilan.
