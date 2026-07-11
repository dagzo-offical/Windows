# Cheklovlar

Tor Guard haqiqiy IP va DNS’ingizning **tasodifiy** oshkor bo‘lishini
kamaytiradi. Bu anonimlik tizimi emas. Unga tayanishdan oldin bu cheklovlarni
tushuning.

## Qat’iy non-goal’lar (hech qachon da’vo qilinmagan)

Tor Guard quyidagilardan himoya qil**maydi**:

- buzilgan host yoki yadro (rootkit, zararli drayver);
- mashinada root darajasidagi hujumchi — root har qanday host boshqaruvini,
  jumladan Tor Guard’ni ham olib tashlashi mumkin;
- global passiv raqiblar va trafik-korrelyatsiya hujumlari (Tor’ning tub
  cheklovi);
- ilova darajasidagi identifikatsiya oshkorligi — haqiqiy hisoblaringizga
  kirish, marshrutdan qat’i nazar, sizni deanonimlashtiradi;
- brauzer/TLS barmoq izlari — internetni ko‘rish uchun **Tor Browser**’dan
  foydalaning;
- zararli hujjatlar yoki zararli dasturlar ishga tushishi;
- endpoint telemetriyasi va seanslar bo‘ylab xulq-atvor korrelyatsiyasi.

## Texnik cheklovlar

### Shifrlangan DNS (DoH/DoT)
DNS-over-HTTPS (`:443`) yoki DNS-over-TLS (`:853`) ishlatuvchi ilovalar noaniq
TCP yuboradi, u bloklanmaydi, balki **Tor orqali yo‘naltiriladi**. Shunday qilib,
u haqiqiy IP’ingizni oshkor qilmaydi, lekin Tor Guard bu ilovalarni Tor’ning
o‘z resolveridan foydalanishga majburlay olmaydi — resolver tanlovi ilovada
qoladi. Tizim resolverini hurmat qiladigan ilovalarni afzal ko‘ring yoki ilova
ichidagi DoH’ni o‘chiring.

### QUIC / HTTP/3
QUIC UDP ustidan ishlaydi, Tor uni shaffof proksilay olmaydi. Tor Guard uni
umumiy UDP sifatida bloklaydi; brauzerlar shaffof ravishda TCP’ga qaytadi. Faqat
UDP’dan foydalanadigan ilovalar oddiygina ishlamaydi (fail-closed).

### Umumiy UDP
Faqat qat’iy zarur mahalliy UDP ruxsat etiladi (DHCP; DNS Tor’ga yo‘naltiriladi).
Qolgan barcha chiquvchi UDP tashlanadi. UDP asosidagi ilovalar Tor Guard orqali
ishlamaydi.

### Konteynerlar / VM’lar / namespace’lar
Forward qilingan trafik (Docker, Podman, libvirt bridge’lari) `prerouting`
redirect va `forward` zanjirining default-drop’i tomonidan ushlanadi, shuning
uchun chetlab o‘ta olmaydi. Ammo konteyner trafigini shaffof proksilashda chekka
holatlar mavjud (REDIRECT manzil tanlovi, maxsus konteyner tarmoqlari).
Yo‘naltirish nomukammal joyda trafik **tashlanadi, sizib chiqmaydi**. O‘z chiqish
yo‘liga ega maxsus marshrutlash jadvali yoki namespace yaratayotgan root
foydalanuvchi ko‘lam tashqarisida (bu — dushman-root stsenariysi).

### IPv6
IPv6 firewall darajasida to‘liq bloklangan (marshrutdan mustaqil), faqat sysctl
orqali emas. Bu nashrda IPv6-Tor-orqali yo‘li yo‘q. Himoyalangan holatda faqat
IPv6 manzillar mavjud emas (yetib bo‘lmaydi).

### Tashqi-IP tekshiruvi
`check.torproject.org` (yoki sozlangan endpointlar) orqali tekshiruv mavjud
bo‘lmasligi mumkin (tarmoq, tezlik cheklovi, senzura). Tor Guard buni *tekshiruv
mavjud emas* deb xabar qiladi — buni hech qachon xavfsizligingiz dalili sifatida
ham, Tor buzilgani dalili sifatida ham qabul qilmaydi.

### Captive portallar / xavfli Wi-Fi
Kill switch captive-portal kirish sahifasini ham bloklaydi.
`unlock-clearnet` qilishingiz, portalni yakunlashingiz, so‘ng qayta `start`
qilishingiz kerak. Bu ataylab: portal trafigiga jimgina ruxsat berish chetlab
o‘tish bo‘lardi.

### Buzishni aniqlash vaqti
Agar nftables qoidalari tashqaridan olib tashlansa, monitor ularni qayta
tasdiqlashidan oldin bir `monitor_interval` (standart 10s) gacha oyna mavjud.
Bu oyna davomida omon qolgan asosiy zanjirlarning default-drop siyosati mavjud
joyda hali ham amal qiladi; keyingi tsiklda to‘liq to‘plam qayta qo‘llanadi.

## Operatsion tavsiyalar

- Alohida saqlashni istagan shaxsiy hisoblaringizga kirmang.
- Veb-brauzing uchun Tor Browser’dan foydalaning (barmoq izlariga qarshilik).
- Tor Guard’ni ko‘rinmaslik pardasi emas, xatolarga qarshi xavfsizlik to‘ri deb
  hisoblang.
