# eJPT Practice — Mock Imtihon Moduli

**eJPT (INE Junior Penetration Tester, 2026)** imtihoniga tayyorgarlik uchun to'liq statik (backend yo'q), interaktiv mock-imtihon va mashq testlari ilovasi. Butun interfeys **o'zbek tilida** (texnik atamalar — `nmap`, `Metasploit`, `payload` va h.k. — inglizcha qoldirilgan). Bu — CyberSecurity o'quv platformasining bir moduli.

## Jonli havola

Platforma GitHub Pages'da joylashtirilganda:

```
https://dagzo-offical.github.io/Windows/ejpt/
```

> GitHub Pages'ni yoqish: repo **Settings → Pages → Source: Deploy from a branch → Branch: `main` / `root` → Save**. Bir necha daqiqada yuqoridagi havola faollashadi. (Modul har qanday statik hostingda ham ishlaydi.)

Boshqa foydalanuvchilar ham shu havola orqali mustaqil foydalanadi — har kimning natijasi/progressi o'z brauzerida (`localStorage`) alohida saqlanadi.

## Xususiyatlar

- **Imtihon rejimi (Mock Exam):** 45 ta savol domen vazniga mos aralashtiriladi. Taymer (48 soat / 90 daqiqa / 60 daqiqa), savollar orasida oldinga-orqaga yurish, savolni **belgilab qo'yish** (flag for review) va palitradan sakrash. Ball faqat **yakunda** ko'rsatiladi. 70% → «O'tdingiz». Tugallanmagan imtihon `localStorage`da saqlanadi va davom ettiriladi.
- **Mashq rejimi (Practice):** domen(lar)ni tanlab, cheksiz mashq. Har savoldan keyin **darhol** to'g'ri/noto'g'ri + izoh.
- **Savol turlari:** `mcq` (variant tanlash), `direct` (javob yozish), `flag` (flag topib kiritish). Javob taqqoslash — **katta-kichik harfga sezgir emas** va bo'sh joylar trim qilinadi. Imtihonda variantlar tartibi aralashtiriladi.
- **Natija va tahlil:** umumiy ball (SVG halqa), o'tdi/o'tmadi, **domenlar bo'yicha breakdown** (kuchsiz sohani ko'rsatadi), noto'g'ri javoblar review'i (savol + to'g'ri javob + izoh), sarflangan vaqt.
- **Saqlash:** natijalar tarixi va mashq statistikasi `localStorage`da (hammasi `try/catch` bilan). «Tarixni tozalash» tugmasi bor.

## Domenlar va vaznlar

| Domen | Vazn | Savol kaliti (JSON `domain`) |
|---|---|---|
| Host & Network Penetration Testing | 35% | `host_network_pentest` |
| Assessment Methodologies | 25% | `assessment_methodologies` |
| Host & Network Auditing | 25% | `host_network_auditing` |
| Web Application Penetration Testing | 15% | `web_app_pentest` |

Savol bazasida hozircha **166 ta** savol bor (`data/questions.json`).

## Lokal ishga tushirish

`fetch` ishlashi uchun oddiy HTTP server kerak (`file://` orqali ochilmaydi):

```bash
# repo ildizida
python3 -m http.server 8000
# so'ng brauzerda oching:
#   http://localhost:8000/ejpt/
```

## Yangi savol qo'shish

`data/questions.json` — bu bitta JSON massiv. Yangi savolni quyidagi sxema bo'yicha qo'shing:

```json
{
  "id": "am-050",
  "domain": "assessment_methodologies",
  "type": "mcq",
  "difficulty": "easy",
  "tools": ["nmap"],
  "scenario": "$ nmap -sV -p 22 10.10.10.5\n22/tcp open ssh OpenSSH 8.2p1",
  "question": "22-portda qaysi servis versiyasi ishlamoqda?",
  "options": ["OpenSSH 7.6p1", "OpenSSH 8.2p1", "Dropbear", "Telnet"],
  "answer": "OpenSSH 8.2p1",
  "explanation": "nmap -sV chiqishida 22/tcp qatorida 'OpenSSH 8.2p1' ko'rsatilgan."
}
```

Sxema qoidalari:

- `id` — noyob (masalan `web-030`).
- `domain` — yuqoridagi 4 ta kalitdan biri.
- `type` — `mcq` | `direct` | `flag`.
- `difficulty` — `easy` | `medium` | `hard`.
- `tools` — massiv (masalan `["metasploit","meterpreter"]`); teglar sifatida ko'rinadi.
- `scenario` — real ko'rinishli tool chiqishi; qatorlarni `\n` bilan ajrating. Windows yo'llarida `\\` ishlating (masalan `C:\\Users\\...`).
- `mcq` uchun `options` (3–4 ta) va `answer` variantlardan biriga **aynan** teng bo'lsin.
- `direct`/`flag` uchun `options` **bo'lmaydi**; `answer` — kutilgan qiymat/flag.
- `explanation` — o'zbekcha, qisqa, «nega shu javob» tushuntiradi.

> Domen vaznini saqlash uchun yangi savollarni taxminan 35/25/25/15 nisbatida qo'shing. JSON'ni tekshirish uchun: `node -e "JSON.parse(require('fs').readFileSync('ejpt/data/questions.json','utf8'))"`.

## Dizayn tizimi

- **Shriftlar:** `Space Grotesk` (UI) + `JetBrains Mono` (kod/terminal/raqam) — Google Fonts.
- **Ranglar:** fon `#020409`; aksentlar Orange `#ff6b2b` (hujum/exploit) + Blue `#2d7aff` (recon/web); to'g'ri `#3ddc84`, xato `#ff4d5e`.
- **Diagramma/ikonka:** faqat inline SVG — tashqi rasm yo'q. Build step yo'q — vanilla HTML/CSS/JS, GitHub Pages'da to'g'ridan-to'g'ri ishlaydi.
- To'liq responsive (mobil-birinchi).

## Fayl tuzilishi

```
ejpt/
├── index.html          # ilova qobig'i (shell)
├── css/styles.css      # dizayn tizimi
├── js/app.js           # butun mantiq (rejimlar, holat, localStorage)
├── data/questions.json # savol bazasi
└── README.md
```

## Eslatma

Barcha ssenariylar, IP manzillar va flag qiymatlari **o'quv maqsadida to'qilgan** — hech qanday real tizimga tegishli emas. «eJPT» va «INE» — INE Security'ning tovar belgilari; bu ilova mustaqil, norasmiy mashq vositasi.
