# Tor Guard — Tahdid Modeli

## 1. Ko‘lam va maqsad

Tor Guard — bitta Linux ish stansiyasi uchun **fail-closed shaffof Tor kill
switch**. Uning maqsadi — qo‘llab-quvvatlanadigan chiquvchi trafikni Tor orqali
majburlash va Tor orqali yo‘naltirib bo‘lmaydigan hamma narsani bloklash orqali
*foydalanuvchining haqiqiy ommaviy IP manzili va DNS so‘rovlarining tasodifiy
oshkor bo‘lishini kamaytirish*.

Bu anonimlik kafolati **EMAS**. §5 non-goal’larga qarang.

## 2. Aktivlar

- **A1** Host’ning haqiqiy ommaviy IPv4/IPv6 manzili.
- **A2** DNS so‘rovlari (foydalanuvchi aniqlaydigan nomlar).
- **A3** Oddiy internetga yetib boradigan chiquvchi ulanish metama’lumotlari (dst
  IP/port, vaqt).
- **A4** Firewall butunligi (kill switch’ning o‘zi).
- **A5** Tor sozlamalari (torrc, boshqaruv autentifikatsiya cookie’si).
- **A6** Host’ga administrator kirishi.
- **A7** Tizim holati (himoyalangan/bloklangan bayroqlar, zaxiralar, manifest).

## 3. Raqiblar va tahdidlar

| ID | Tahdid | Vektor | Yumshatish | Qoldiq xavf |
|----|--------|--------|------------|---------------|
| T1 | Tor xizmati ishdan chiqishi | seans o‘rtasida jarayon o‘ladi | Firewall Tor’dan mustaqil; monitor Tor’ni qayta ishga tushiradi; chiqish bloklangan qoladi (I3, I11) | Ulanishning qisqa yo‘qolishi (dizayn bo‘yicha) |
| T2 | Tor ulanish bosqichi muvaffaqiyatsizligi | tarmoq/senzura | `start` 100% ulanish bosqichigacha bloklangan qoladi (I2) | Tor ishlaguncha foydalanuvchida internet yo‘q — mo‘ljallangan |
| T3 | DNS sizib chiqishi | ilova resolverni to‘g‘ridan-to‘g‘ri so‘raydi | 53→DNSPort yo‘naltirish, qolganlarini tashlash (I6) | Ilova darajasidagi DoH/DoT :443 ga — §4 ga qarang |
| T4 | IPv6 sizib chiqishi | dual-stack chiqish | `ip6` jadval drop, faqat sysctl emas (I7) | IPv6 chiqishi uchun yo‘q |
| T5 | UDP/QUIC chetlab o‘tishi | UDP/443 ustidan HTTP/3 | Zarur bo‘lmagan chiquvchi UDP’ni tashlash (I8) | Mahalliy DHCP/DNS-Tor’ga UDP ataylab ruxsat etilgan |
| T6 | To‘g‘ridan-to‘g‘ri TCP chetlab o‘tishi | ilova xom soket ochadi | Default-deny + faqat redirect (I1) | Faol paytda yo‘q |
| T7 | Ishga tushirish/o‘chirish poygasi | yuklanishda/to‘xtashda oddiy internet oynasi | Firewall `Before=network-pre.target`; stop blokni saqlaydi (I2, I4) | Aniqlangani yo‘q |
| T8 | Firewall qoidasini o‘chirish | admin/skript qoidalarni tozalaydi | Butunlik monitori qayta qo‘llaydi (I10) | Oyna ≤ monitor intervali |
| T9 | Docker/VM bridge chetlab o‘tishi | konteyner chiqishi bridge orqali | `forward`/`prerouting` drop+redirect (I14) | Root tomonidan o‘z marshrutlash jadvali bilan maxsus netns — §4 ga qarang |
| T10 | Tarmoq namespace chetlab o‘tishi | veth bilan `ip netns` | prerouting/forward ushlaydi; noma’lum interfeyslarni bloklash | Root chetlab o‘tishni yaratishi mumkin — ko‘lam tashqarisida (T13 ga qarang) |
| T11 | Zararli mahalliy (root bo‘lmagan) jarayon | har qanday chiqishga urinadi | Xuddi shu firewall’ga bo‘ysunadi; qoidalarni o‘zgartira olmaydi | Ruxsat etilgan Tor yo‘li orqali yashirin kanallar |
| T12 | Imtiyozli mahalliy hujumchi (root) | Tor Guard’ni o‘chiradi | — | **Ko‘lam tashqarisida**: root har qanday host boshqaruvini bekor qilishi mumkin |
| T13 | Buzilgan host/yadro | rootkit | — | **Ko‘lam tashqarisida** |
| T14 | Buzilgan Tor chiqish tuguni | chiqish trafigini ko‘radi | HTTPS/onion ishlating; Tor’ning o‘z kafolatlari | Standart Tor chiqish xavfi |
| T15 | Brauzer barmoq izlari | JS/TLS barmoq izi | — | **Ko‘lam tashqarisida**; Tor Browser ishlating |
| T16 | Shaxsiy-hisob korrelyatsiyasi | foydalanuvchi haqiqiy hisobga kiradi | — | **Ko‘lam tashqarisida**; opsec mas’uliyati |
| T17 | Zararli dastur/endpoint telemetriyasi | Tor orqali serverga bog‘lanadi | Trafik hali ham Tor orqali, biz tomonidan deanonimlashtirilmaydi | Korrelyatsiya mumkin |
| T18 | Trafik-korrelyatsiya hujumi | global passiv raqib | — | **Ko‘lam tashqarisida** (Tor’ning o‘z cheklovi) |
| T19 | Xavfli Wi-Fi / captive portal | L2’da MITM | Kill switch oddiy internetni, jumladan portalni ham bloklaydi | Portal kirishi avval `unlock-clearnet` talab qiladi |
| T20 | Tizim yangilanishi xizmatlarni qayta tartiblaydi | apt tartibni o‘zgartiradi | Birliklar mahkamlangan + `doctor` tekshiradi; butunlik monitori | Yangilanish birlikni o‘chirishi mumkin — `doctor` aniqlaydi |

## 4. Hujum yuzasini kengaytiradigan ma’lum cheklovlar

- **Ilova darajasidagi shifrlangan DNS (DoH/DoT)** 443/853 portiga oddiy TCP’ga
  o‘xshaydi va bloklanmaydi, balki *Tor orqali yo‘naltiriladi* — shuning uchun u
  haqiqiy IP’ni oshkor qilmaydi, lekin resolver tanlovi ilovaniki. Biz bunday
  ilovalarni Tor resolverini ishlatishga majburlay olmaymiz.
  `docs/LIMITATIONS.md`da hujjatlashtirilgan.
- **Host’dagi root** Tor Guard’ni olib tashlashi mumkin. Bu tub masala
  (T12/T13).
- **Root tomonidan maxsus marshrutlash jadvallari / siyosat marshrutlashi**
  (masalan, ekzotik `ip rule` sozlamalari, VRF) sof `output`-hook dizaynidan
  qochishi mumkin; biz `forward` + `prerouting` qamrovini qo‘shamiz, lekin
  dushman-root’ni yenga olmaymiz.
- **QUIC** umumiy UDP sifatida bloklanadi; brauzerlar TCP’ga qaytadi.

## 5. Aniq non-goal’lar

Tor Guard quyidagilardan himoya qilishga **hech qanday da’vo** qilmaydi va hech
qachon ulardan himoya qiladi deb ta’riflanmasligi kerak:

- buzilgan host yoki yadro;
- mashinada root darajasidagi hujumchi;
- global passiv raqiblar / trafik-korrelyatsiya hujumlari;
- ilova darajasidagi identifikatsiya oshkorligi (haqiqiy hisoblarga kirish);
- brauzer yoki TLS barmoq izlari;
- zararli hujjatlar / zararli dasturlar ishga tushishi;
- endpoint telemetriyasi;
- seanslar bo‘ylab xulq-atvor korrelyatsiyasi.

U **tasodifiy** haqiqiy-IP va DNS oshkorligini kamaytiradi. Va’da butunlay
shundan iborat.
