# CyberSecurity Platform

Bitta platformada to'rtta kiberxavfsizlik o'quv moduli — o'zbek va ingliz tillarida, AI yordamchi bilan.

## Modullar

| Modul | Papka | Mavzu | Rang |
|-------|-------|-------|------|
| **Windows** | `windows/` | Windows ichki tuzilishi, kernel, Active Directory, xavfsizlik | 🔵 ko'k |
| **Kali Linux** | `kali/` | Kali Linux asoslari va pentest vositalari (Nmap, Metasploit) | 🟣 binafsha |
| **Network** | `network/` | Tarmoq xavfsizligi — OSI, TCP/IP, firewall, hujumlar | 🔷 cyan |
| **Web-Pentest** | `web-pentest/` | Veb penetratsion test — OWASP, SQLi, XSS, Burp Suite | 🔴 qizil |

## Ishga tushirish

Butun platformani (hub + barcha modullar) bitta portda:

```bash
python CyberSecurity.py            # http://localhost:8080
python CyberSecurity.py 3000       # boshqa port
python CyberSecurity.py --no-browser
```

Bir modulni alohida ishga tushirish:

```bash
python windows/Windows.py          # port 8080
python kali/Kali.py                # port 8083
python network/Network.py          # port 8081
python web-pentest/Web-Pentest.py  # port 8082
```

> **Maslahat:** `CyberSecurity.py` orqali ishga tushirilganda barcha modullar bitta origin'da bo'ladi, shuning uchun AI kalitlari va o'rganish progressi modullar o'rtasida ulashiladi.

## AI yordamchi

Har bir modulda AI chat mavjud. Kalitni **Profil → AI Kalitlar** bo'limidan qo'shing (Groq, OpenAI, Anthropic yoki Gemini). Kalitlar faqat brauzeringizning `localStorage`'ida saqlanadi va barcha modullar bitta kalit to'plamidan foydalanadi.

## Texnologiya

- Oldindan kompilyatsiya qilingan React (`lib/bundle.js`, `React.createElement` — Babel'siz)
- Barcha kutubxonalar lokal (`lib/react.js`, `lib/react-dom.js`) — internet talab qilinmaydi
- Progress va sozlamalar `localStorage`'da saqlanadi

---

*Ta'lim maqsadida — faqat ruxsat berilgan tizimlarda amaliyot qiling.*
