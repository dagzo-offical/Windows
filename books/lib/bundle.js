"use strict";
// ─────────────────────────────────────────────────────────────
// KUTUBXONA (LIBRARY) — CyberSecurity kitoblari
// Original bilingual (UZ/EN) adaptations of open-licensed books.
// ─────────────────────────────────────────────────────────────
const {useState,useEffect,useRef,createContext,useContext}=React;

const LANG_KEY="bk_lang", LAST_KEY="bk_last";

const LangCtx=createContext("uz");
function useLang(){return useContext(LangCtx);}
function t(lang,uz,en){return lang==="en"?en:uz;}

// ── Icons ─────────────────────────────────────────────────────
const ICONS={
  book:"M4 4c0-1.1.9-2 2-2h13a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a2 2 0 0 0-2 2V4zm4 0v2h8V4H8z",
  home:"M12 3l9 8h-3v9h-4v-6h-4v6H6v-9H3l9-8z",
  chevron:"M9 6l6 6-6 6",
  arrowL:"M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z",
  arrowR:"M4 11h12.17l-5.59-5.59L12 4l8 8-8 8-1.41-1.41L16.17 13H4z",
  check:"M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z",
  info:"M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z",
  alert:"M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z",
  code:"M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z",
  cpu:"M9 3H7c-2.2 0-4 1.8-4 4v2h2V7c0-1.1.9-2 2-2h2V3zm8 0h-2v2h2c1.1 0 2 .9 2 2v2h2V7c0-2.2-1.8-4-4-4zM3 15v2c0 2.2 1.8 4 4 4h2v-2H7c-1.1 0-2-.9-2-2v-2H3zm18 0v2c0 1.1-.9 2-2 2h-2v2h2c2.2 0 4-1.8 4-4v-2h-2zM7 7h10v10H7z",
  terminal:"M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10zM6 10l1.4-1.4L11 12.2l-3.6 3.6L6 14.4l2.2-2.2L6 10zm6 4.5h5V16h-5z",
  layers:"M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z",
  tool:"M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z",
  external:"M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z",
  globe:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
  shield:"M12 2L4 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-8-3z",
  bug:"M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5c-.49 0-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-2h4v2zm0-4h-4v-2h4v2z",
  search:"M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z",
  users:"M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
  mail:"M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
  phone:"M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z",
  shieldCheck:"M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z",
  eye:"M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z",
  lock:"M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z",
  key:"M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z",
  database:"M12 3C7.58 3 4 4.79 4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7c0-2.21-3.58-4-8-4zm0 2c3.87 0 6 1.5 6 2s-2.13 2-6 2-6-1.5-6-2 2.13-2 6-2zm0 14c-3.87 0-6-1.5-6-2v-1.5c1.26.83 3.5 1.5 6 1.5s4.74-.67 6-1.5V17c0 .5-2.13 2-6 2z",
  hash:"M20 10V8h-4V4h-2v4h-4V4H8v4H4v2h4v4H4v2h4v4h2v-4h4v4h2v-4h4v-2h-4v-4h4zm-6 4h-4v-4h4v4z",
  fingerprint:"M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67-.09.18-.26.28-.44.28zM3.5 9.72c-.1 0-.2-.03-.29-.09-.23-.16-.28-.47-.12-.7.99-1.4 2.25-2.5 3.75-3.27C9.98 4.04 14 4.03 17.15 5.65c1.5.77 2.76 1.86 3.75 3.25.16.22.11.54-.12.7-.23.16-.54.11-.7-.12-.9-1.26-2.04-2.25-3.39-2.94-2.87-1.47-6.54-1.47-9.4.01-1.36.7-2.5 1.7-3.4 2.96-.08.14-.23.21-.39.21z",
};
function Icon({name,size=16,style={}}){const d=ICONS[name]||ICONS.book;return React.createElement("svg",{width:size,height:size,viewBox:"0 0 24 24",fill:"currentColor",style:{flexShrink:0,...style}},React.createElement("path",{d}));}

// ── Inline rich-text: **bold** and `code` ─────────────────────
function rich(s){
  if(s==null)return null;
  if(typeof s!=="string")return s;
  const out=[]; const re=/(\*\*[^*]+\*\*|`[^`]+`)/g; let last=0,m;
  while((m=re.exec(s))){
    if(m.index>last)out.push(s.slice(last,m.index));
    const tok=m[0];
    if(tok.startsWith("**"))out.push(React.createElement("b",{key:out.length},tok.slice(2,-2)));
    else out.push(React.createElement("code",{key:out.length},tok.slice(1,-1)));
    last=re.lastIndex;
  }
  if(last<s.length)out.push(s.slice(last));
  return out;
}

// ═══════════════════════════════════════════════════════════════
//  BOOK DATA — original bilingual reverse-engineering course.
//  All prose is original explanation of universal RE concepts;
//  Dennis Yurichev's CC BY-SA 4.0 book is credited as the source.
// ═══════════════════════════════════════════════════════════════
const RE_BOOK={
  id:"re",
  titleUz:"Teskari injeneriya — boshlang'ichlar uchun",
  titleEn:"Reverse Engineering for Beginners",
  author:"Dennis Yurichev",
  origTitle:"Reverse Engineering for Beginners",
  coverAbbr:"RE", coverBy:"Yurichev", coverIcon:"cpu",
  noteUz:"Bu — o'zbek tilidagi original moslashma; asosiy tushunchalar CC BY-SA 4.0 litsenziyasi asosida qayta yozilgan va muallif ko'rsatilgan.",
  noteEn:"This is an original Uzbek adaptation; the core concepts are rewritten under the CC BY-SA 4.0 license with attribution to the author.",
  license:"CC BY-SA 4.0",
  source:"https://beginners.re/",
  challenges:"https://challenges.re/",
  descUz:"Mashina kodini o'qishdan tortib, assembler tili, stek va professional vositalargacha — teskari injeneriyaga bosqichma-bosqich kirish. Dennis Yurichevning ochiq litsenziyali kitobi asosida, o'zbek tilida qayta yozildi.",
  descEn:"A step-by-step introduction to reverse engineering — from reading machine code to assembly language, the stack and professional tools. Adapted in Uzbek from Dennis Yurichev's open-licensed book.",
  chapters:[
    // ── 0: Preface & license ───────────────────────────────────
    { uz:"Muqaddima va litsenziya", en:"Preface & license", subUz:"Bu kitob nima va u qanday qonuniy tarzda tayyorlandi", subEn:"What this book is and how it was prepared legally",
      blocks:[
        {t:"p",uz:"Xush kelibsiz! Bu — **teskari injeneriya** (reverse engineering, RE) bo'yicha boshlang'ich kurs. Maqsad — dasturning ichki ishlashini, uning **manba kodi** bo'lmasa ham, tayyor **ikkilik fayl** (binary) orqali tushunishni o'rgatish.",
              en:"Welcome! This is a beginner course on **reverse engineering** (RE). The goal is to teach you how to understand how a program works internally — even without its **source code** — by examining the finished **binary**."},
        {t:"colophon"},
        {t:"note",uz:"**Litsenziya haqida.** Ushbu material Dennis Yurichevning \"Reverse Engineering for Beginners\" kitobi asosida tayyorlandi. Original kitob **Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0)** litsenziyasida — ya'ni muallif ko'rsatilgan holda tarjima va moslashtirishga ruxsat beradi. Shuning uchun ushbu o'zbekcha moslashma ham xuddi shu litsenziyada tarqatiladi.",
              en:"**About the license.** This material is based on Dennis Yurichev's \"Reverse Engineering for Beginners\". The original book is under the **Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0)** license — it permits translation and adaptation with attribution. Accordingly, this Uzbek adaptation is shared under the same license."},
        {t:"p",uz:"Kitobning to'liq, chuqurroq va 1000 sahifadan ortiq inglizcha asl nusxasini rasmiy saytdan bepul yuklab olishingiz mumkin: **beginners.re**. Bu yerdagi o'zbekcha kurs esa asosiy tushunchalarni sodda, ikki tilli va bosqichma-bosqich yetkazishga qaratilgan.",
              en:"You can download the full, deeper, 1000+ page English original for free from the official site: **beginners.re**. This Uzbek course focuses on delivering the core concepts simply, bilingually and step by step."},
        {t:"h",n:"§",uz:"Kimlar uchun?",en:"Who is this for?"},
        {t:"ul",uz:["Xavfsizlik va pentest bilan shug'ullanuvchilar — zararli dasturlarni tahlil qilish uchun.","Dasturchilar — kompilyator kodni qanday \"pastga\" o'giradigan tushunish uchun.","CTF va talabalar — assembler va past darajali dasturlashni o'rganish uchun."],
              en:["Security and pentest practitioners — to analyze malware.","Developers — to understand how a compiler lowers code to machine level.","CTF players and students — to learn assembly and low-level programming."]},
        {t:"note",warn:true,uz:"**Ogohlantirish.** Teskari injeneriyani faqat **o'zingizga tegishli yoki ruxsat berilgan** dasturlarda amaliyot qiling. Ba'zi dasturlarning litsenziya shartlari RE'ni taqiqlaydi, qonunlar davlatga qarab farq qiladi. Bu material faqat ta'lim maqsadida.",
              en:"**Warning.** Only practice reverse engineering on software you **own or are authorized** to analyze. Some software licenses forbid RE, and laws vary by country. This material is for educational purposes only."},
      ]},
    // ── 1: What is RE ──────────────────────────────────────────
    { uz:"Teskari injeneriya nima?", en:"What is reverse engineering?", subUz:"Tayyor mahsulotdan uning ishlash prinsipiga qaytish", subEn:"Going from a finished product back to how it works",
      blocks:[
        {t:"p",uz:"**Teskari injeneriya** — bu tayyor bir narsani ajratib, uni qanday qilinganini va qanday ishlashini, hujjatlarsiz tushunish jarayoni. Muhandis odatda g'oyadan mahsulot yasaydi; teskari injener esa **mahsulotdan g'oyaga** qaytadi.",
              en:"**Reverse engineering** is the process of taking a finished thing apart to understand how it was made and how it works — without documentation. An engineer normally builds a product from an idea; a reverse engineer goes **from the product back to the idea**."},
        {t:"p",uz:"Dasturiy ta'minotda bu ko'pincha shuni anglatadi: bizda faqat **mashina kodi** (protsessor bajaradigan noldan va birlardan iborat ikkilik fayl) bor, lekin manba kod yo'q. Bizning vazifamiz — shu ikkilik fayldan dastur mantiqini tiklab, tushunish.",
              en:"In software this usually means: we only have the **machine code** (the binary of zeros and ones the processor executes), but no source code. Our task is to reconstruct and understand the program's logic from that binary."},
        {t:"h",n:"1.1",uz:"Nega buni o'rganish kerak?",en:"Why learn this?"},
        {t:"ul",uz:[
          "**Zararli dastur tahlili** — virus yoki troyan aynan nima qilishini bilish uchun uni teskari injeneriya qilishadi.",
          "**Zaiflik izlash** — dasturdagi xavfsizlik teshiklarini kodni ko'rmasdan topish.",
          "**Muvofiqlik (interoperability)** — yopiq format yoki protokol bilan ishlaydigan dastur yozish.",
          "**Eski dasturlarni tiklash** — manba kodi yo'qolgan dasturni tuzatish yoki yangilash.",
          "**O'rganish** — kompilyator va protsessor \"pardaning ortida\" qanday ishlashini ko'rish."],
          en:[
          "**Malware analysis** — reverse a virus or trojan to learn exactly what it does.",
          "**Vulnerability research** — find security holes without seeing the source.",
          "**Interoperability** — write software that works with a closed format or protocol.",
          "**Recovering old software** — fix or update a program whose source was lost.",
          "**Learning** — see how the compiler and processor work \"behind the curtain\"."]},
        {t:"h",n:"1.2",uz:"Ikki asosiy yondashuv",en:"Two main approaches"},
        {t:"p",uz:"**Statik tahlil** — dasturni **ishga tushirmasdan** o'rganish: ikkilik faylni disassembler bilan assembler tiliga ochib, kodini o'qib chiqamiz. **Dinamik tahlil** — dasturni **ishga tushirib**, debugger bilan qadam-baqadam kuzatib, xotira va registrlar qanday o'zgarishini ko'ramiz. Ko'pincha ikkalasi birga qo'llaniladi.",
              en:"**Static analysis** — studying the program **without running it**: we open the binary with a disassembler into assembly and read the code. **Dynamic analysis** — **running** the program under a debugger, stepping through it, and watching how memory and registers change. In practice both are used together."},
        {t:"note",uz:"Keyingi boblarda avval kompilyator kodni qanday hosil qilishini, so'ng assembler tilini, keyin esa haqiqiy misollarni (oddiy funksiya, \"Hello, world!\", stek) ko'rib chiqamiz.",
              en:"In the next chapters we first look at how the compiler produces code, then at assembly language, and then at real examples (a simple function, \"Hello, world!\", the stack)."},
      ]},
    // ── 2: How compilation works ───────────────────────────────
    { uz:"Kompilyatsiya qanday ishlaydi", en:"How compilation works", subUz:"Manba koddan mashina kodigacha bo'lgan yo'l", subEn:"The path from source code to machine code",
      blocks:[
        {t:"p",uz:"Teskari injeneriyani tushunish uchun avval **to'g'ri** yo'nalishni — dastur qanday **quriladi** — bilish kerak. C tilidagi manba kod bir necha bosqichdan o'tib, ishga tushadigan faylga aylanadi:",
              en:"To understand reverse engineering, you first need to know the **forward** direction — how a program is **built**. C source code passes through several stages to become a runnable file:"},
        {t:"pipe",steps:[
          {ic:"code",tUz:"Manba",tEn:"Source",sUz:"hello.c",sEn:"hello.c"},
          {ic:"cpu",tUz:"Kompilyator",tEn:"Compiler",sUz:"assembler'ga",sEn:"to assembly"},
          {ic:"terminal",tUz:"Assembler",tEn:"Assembler",sUz:"obyekt fayl",sEn:"object file"},
          {ic:"layers",tUz:"Linker",tEn:"Linker",sUz:"bajariluvchi",sEn:"executable"}]},
        {t:"p",uz:"**Kompilyator** (masalan GCC yoki Clang) yuqori darajali C kodini protsessorga yaqin bo'lgan **assembler tili**ga o'giradi. **Assembler** esa assembler matnini **mashina kodi**ga (baytlar) aylantirib, obyekt fayl hosil qiladi. Nihoyat **linker** bir nechta obyekt fayl va kutubxonalarni birlashtirib, yakuniy bajariluvchi faylni yasaydi.",
              en:"The **compiler** (e.g. GCC or Clang) translates high-level C code into **assembly language**, which is close to the processor. The **assembler** then converts the assembly text into **machine code** (bytes), producing an object file. Finally the **linker** combines several object files and libraries into the final executable."},
        {t:"h",n:"2.1",uz:"Assembler va mashina kodi",en:"Assembly and machine code"},
        {t:"p",uz:"**Mashina kodi** — protsessor to'g'ridan-to'g'ri bajaradigan sonlar ketma-ketligi. Uni odam o'qishi qiyin. **Assembler tili** — o'sha mashina kodining odam o'qiy oladigan ko'rinishi: har bir buyruq `mov`, `add`, `call` kabi qisqa **mnemonika** bilan yoziladi. Bittasi ikkinchisiga deyarli bir-bir mos keladi.",
              en:"**Machine code** is the sequence of numbers the processor executes directly. It is hard for a human to read. **Assembly language** is a human-readable form of that same machine code: each instruction is written with a short **mnemonic** like `mov`, `add`, `call`. One maps almost one-to-one to the other."},
        {t:"h",n:"2.2",uz:"Teskari injeneriya — bu jarayonni orqaga qaytarish",en:"RE reverses this process"},
        {t:"p",uz:"Teskari injenerlar aynan shu quvurni **orqaga** yuritadi: bajariluvchi fayldan boshlab, **disassembler** yordamida mashina kodini yana assembler tiliga ochadi. Zamonaviy **dekompilyatorlar** (masalan Ghidra) esa yana bir qadam oldinga o'tib, assembler'dan taxminiy C-ga o'xshash kod (\"psevdokod\") tiklaydi.",
              en:"Reverse engineers run this exact pipeline **backwards**: starting from the executable, a **disassembler** turns the machine code back into assembly. Modern **decompilers** (e.g. Ghidra) go one step further and reconstruct approximate C-like code (\"pseudocode\") from the assembly."},
        {t:"pipe",steps:[
          {ic:"layers",tUz:"Bajariluvchi",tEn:"Executable",sUz:"a.out",sEn:"a.out"},
          {ic:"search",tUz:"Disassembler",tEn:"Disassembler",sUz:"assembler",sEn:"assembly"},
          {ic:"code",tUz:"Dekompilyator",tEn:"Decompiler",sUz:"psevdo-C",sEn:"pseudo-C"}]},
      ]},
    // ── 3: Assembly basics ─────────────────────────────────────
    { uz:"Assembler tili asoslari", en:"Assembly basics", subUz:"Registrlar, xotira va asosiy buyruqlar", subEn:"Registers, memory and core instructions",
      blocks:[
        {t:"p",uz:"Protsessor (CPU) juda oddiy, lekin juda tez ishlar bajaradi: xotiradan sonlarni oladi, ular ustida amal bajaradi va natijani qaytaradi. Bu ishlar uchun uning ichida **registrlar** — o'ta tez, kichik xotira kataklari bor.",
              en:"The processor (CPU) does very simple things very fast: it fetches numbers from memory, performs an operation on them, and stores the result. For this work it has **registers** inside — extremely fast, tiny storage cells."},
        {t:"h",n:"3.1",uz:"Registrlar (x86-64)",en:"Registers (x86-64)"},
        {t:"p",uz:"64-bitli x86-64 protsessorda 16 ta asosiy umumiy registr bor: `rax`, `rbx`, `rcx`, `rdx`, `rsi`, `rdi`, `rbp`, `rsp` va `r8`–`r15`. Har birining 32-bitli qismi ham bor (`rax` ning pastki yarmi — `eax`). `rsp` alohida rol o'ynaydi — u **stek ko'rsatkichi** (buni 6-bobda ko'ramiz).",
              en:"A 64-bit x86-64 processor has 16 main general-purpose registers: `rax`, `rbx`, `rcx`, `rdx`, `rsi`, `rdi`, `rbp`, `rsp` and `r8`–`r15`. Each also has a 32-bit part (the lower half of `rax` is `eax`). `rsp` plays a special role — it is the **stack pointer** (we'll see this in chapter 6)."},
        {t:"h",n:"3.2",uz:"Xotira va bayt tartibi",en:"Memory and byte order"},
        {t:"p",uz:"Xotira — raqamlangan **manzillar**ga ega baytlar qatori. x86 va ARM protsessorlari sonlarni **little-endian** tartibida saqlaydi: sonning eng kichik bayti eng kichik manzilda turadi. Masalan `0x12345678` xotirada `78 56 34 12` tarzida yotadi — RE'da buni bilish shart, aks holda baytlarni noto'g'ri o'qiysiz.",
              en:"Memory is an array of bytes with numbered **addresses**. x86 and ARM processors store numbers in **little-endian** order: the least-significant byte sits at the lowest address. For example `0x12345678` lies in memory as `78 56 34 12` — you must know this in RE, otherwise you'll read bytes wrong."},
        {t:"h",n:"3.3",uz:"Eng ko'p uchraydigan buyruqlar",en:"The most common instructions"},
        {t:"code",lang:"asm",cap:{uz:"Asosiy x86-64 buyruqlari",en:"Core x86-64 instructions"},lines:[
          "mov  rax, 5      ; rax registriga 5 ni yoz (o'zlashtirish)",
          "add  rax, rbx    ; rax = rax + rbx",
          "sub  rax, 1      ; rax = rax - 1",
          "cmp  rax, 10     ; rax va 10 ni solishtir (bayroq o'rnatadi)",
          "je   label       ; agar teng bo'lsa -> label ga sakra",
          "jmp  label       ; shartsiz sakrash",
          "call func        ; func funksiyasini chaqir",
          "ret              ; funksiyadan qaytish",
          "push rax         ; rax ni stekka joyla",
          "pop  rbx         ; stekdan rbx ga ol"]},
        {t:"p",uz:"Bu o'nga yaqin buyruq bilan siz assembler kodining katta qismini o'qiy olasiz. `mov` — ko'chirish/o'zlashtirish, `cmp`+`je`/`jne` — shart va shartli sakrash (if/else ga aylanadi), `call`/`ret` — funksiya chaqirish va qaytish.",
              en:"With these ~10 instructions you can already read much of assembly code. `mov` is copy/assign, `cmp`+`je`/`jne` is a comparison and conditional jump (which becomes if/else), and `call`/`ret` are function call and return."},
        {t:"note",uz:"Assembler protsessor arxitekturasiga bog'liq: x86-64, ARM, MIPS va RISC-V har biri o'z buyruqlar to'plamiga ega. Biz asosan x86-64 va ba'zan ARM misollarini ko'ramiz, chunki ular eng keng tarqalgan.",
              en:"Assembly depends on the processor architecture: x86-64, ARM, MIPS and RISC-V each have their own instruction set. We mostly use x86-64 and occasionally ARM examples, as they are the most widespread."},
      ]},
    // ── 4: The simplest function ───────────────────────────────
    { uz:"Eng oddiy funksiya", en:"The simplest function", subUz:"Bitta son qaytaradigan funksiya assemblerda", subEn:"A function that returns one value, in assembly",
      blocks:[
        {t:"p",uz:"RE'ni o'rganishning eng yaxshi yo'li — eng kichik dasturdan boshlash. Mana C tilidagi eng oddiy funksiya: u shunchaki **42** sonini qaytaradi.",
              en:"The best way to learn RE is to start with the tiniest program. Here is the simplest function in C: it just returns the number **42**."},
        {t:"code",lang:"c",cap:{uz:"Manba kod — C",en:"Source — C"},lines:[
          "int f()",
          "{",
          "    return 42;",
          "}"]},
        {t:"p",uz:"Buni GCC bilan x86-64 uchun kompilyatsiya qilsak, natija hayratlanarli darajada qisqa:",
              en:"Compiling this with GCC for x86-64, the result is surprisingly short:"},
        {t:"code",lang:"asm",cap:{uz:"Natija — x86-64 assembler",en:"Output — x86-64 assembly"},lines:[
          "f:",
          "    mov  eax, 42   ; qaytish qiymatini eax ga joyla",
          "    ret            ; chaqiruvchiga qayt"]},
        {t:"h",n:"4.1",uz:"Bu yerda nima bo'lyapti?",en:"What is happening here?"},
        {t:"p",uz:"Faqat ikki buyruq. `mov eax, 42` — `eax` registriga 42 ni yozadi. `ret` — funksiyadan qaytadi. Savol: nega aynan `eax`? Chunki x86-64 da **kelishuv** (calling convention) bor: funksiya qaytaradigan butun son qiymati **har doim** `rax` registrida (uning 32-bitli qismi `eax`) qaytariladi. Chaqiruvchi funksiya natijani aynan shu yerdan oladi.",
              en:"Only two instructions. `mov eax, 42` writes 42 into the `eax` register. `ret` returns from the function. Question: why `eax`? Because x86-64 has a **calling convention**: an integer value returned by a function is **always** returned in the `rax` register (its 32-bit part `eax`). The caller reads the result from exactly there."},
        {t:"h",n:"4.2",uz:"Xuddi shu funksiya ARM64 da",en:"The same function on ARM64"},
        {t:"code",lang:"asm",cap:{uz:"Natija — ARM64 assembler",en:"Output — ARM64 assembly"},lines:[
          "f:",
          "    mov  w0, #42   ; qaytish qiymatini w0 ga joyla",
          "    ret            ; qayt"]},
        {t:"p",uz:"Mantiq bir xil, faqat nomlar boshqacha: ARM64 da qaytish qiymati `x0` (32-bitli qismi `w0`) registrida bo'ladi. Ko'rib turganingizdek, **kelishuvni bilish** — RE'ning kaliti: qiymatlar qayerdan kelib, qayerga borishini shu qoidalar belgilaydi.",
              en:"The logic is identical, only the names differ: on ARM64 the return value goes in register `x0` (32-bit part `w0`). As you can see, **knowing the calling convention** is the key to RE: these rules determine where values come from and go to."},
        {t:"note",uz:"Sinab ko'ring: `godbolt.org` (Compiler Explorer) saytida C kodini yozib, uning turli protsessorlar uchun assembler natijasini jonli ko'rishingiz mumkin. Bu RE'ni o'rganishning eng tez yo'li.",
              en:"Try it: on `godbolt.org` (Compiler Explorer) you can type C code and see its assembly output for various processors live. It's the fastest way to learn RE."},
      ]},
    // ── 5: Hello world ─────────────────────────────────────────
    { uz:"\"Hello, world!\" — birinchi haqiqiy dastur", en:"\"Hello, world!\" — the first real program", subUz:"Matn qatorlari, argumentlar va funksiya chaqiruvi", subEn:"Strings, arguments and a function call",
      blocks:[
        {t:"p",uz:"Klassik birinchi dastur — ekranga matn chiqarish. Bu oddiy ko'rinsa-da, u RE uchun uchta muhim tushunchani ochib beradi: **matn qatorlari xotirada qanday saqlanadi**, **funksiyaga argument qanday uzatiladi** va **kutubxona funksiyasi qanday chaqiriladi**.",
              en:"The classic first program prints text to the screen. Though it looks trivial, it reveals three important RE concepts: **how strings are stored in memory**, **how an argument is passed to a function**, and **how a library function is called**."},
        {t:"code",lang:"c",cap:{uz:"Manba kod — C",en:"Source — C"},lines:[
          "#include <stdio.h>",
          "",
          "int main()",
          "{",
          "    printf(\"Hello, world!\\n\");",
          "    return 0;",
          "}"]},
        {t:"code",lang:"asm",cap:{uz:"Natija — x86-64 (System V ABI)",en:"Output — x86-64 (System V ABI)"},lines:[
          "        .rodata",
          "msg:    .string \"Hello, world!\"   ; matn faqat o'qiladigan sohada",
          "",
          "main:",
          "    lea   rdi, [msg]   ; 1-argument (matn manzili) -> rdi",
          "    call  puts         ; puts(msg) ni chaqir",
          "    mov   eax, 0       ; return 0",
          "    ret"]},
        {t:"h",n:"5.1",uz:"Matn qayerda?",en:"Where is the string?"},
        {t:"p",uz:"\"Hello, world!\" matni kodning ichida emas, balki alohida **`.rodata`** (read-only data — faqat o'qiladigan ma'lumot) sohasida saqlanadi. Kodda esa faqat shu matnning **manzili** ishlatiladi. RE'da matnlarni topish juda foydali — ular ko'pincha dastur nima qilishini birinchi bo'lib oshkor qiladi.",
              en:"The \"Hello, world!\" string is not stored inside the code but in a separate **`.rodata`** (read-only data) section. The code only uses the **address** of that string. Finding strings in RE is very useful — they are often the first thing to reveal what a program does."},
        {t:"h",n:"5.2",uz:"Argument qanday uzatiladi?",en:"How is the argument passed?"},
        {t:"p",uz:"`lea rdi, [msg]` buyrug'i matn manzilini `rdi` registriga yozadi. System V kelishuvida (Linux/macOS) funksiyaning **birinchi argumenti `rdi`** registrida uzatiladi (keyingilari — `rsi`, `rdx`, `rcx`, `r8`, `r9`). So'ng `call puts` standart kutubxonaning `puts` funksiyasini chaqiradi. (Kompilyator bitta matnli `printf` ni ko'pincha tezroq `puts` ga almashtiradi.)",
              en:"The instruction `lea rdi, [msg]` writes the string's address into `rdi`. In the System V convention (Linux/macOS) a function's **first argument is passed in `rdi`** (the next ones in `rsi`, `rdx`, `rcx`, `r8`, `r9`). Then `call puts` calls the standard library's `puts`. (The compiler often replaces a single-string `printf` with the faster `puts`.)"},
        {t:"note",uz:"Kelishuv operatsion tizimga ham bog'liq: Windows x64 da birinchi to'rt argument `rcx`, `rdx`, `r8`, `r9` registrlarida uzatiladi — Linux'dan farq qiladi. RE qilayotganda qaysi ABI ekanini bilish muhim.",
              en:"The convention also depends on the OS: on Windows x64 the first four arguments go in `rcx`, `rdx`, `r8`, `r9` — different from Linux. When reversing, it matters which ABI you're looking at."},
      ]},
    // ── 6: The stack ───────────────────────────────────────────
    { uz:"Stek (Stack)", en:"The stack", subUz:"Funksiyalar, qaytish manzillari va lokal o'zgaruvchilar", subEn:"Functions, return addresses and local variables",
      blocks:[
        {t:"p",uz:"**Stek** — xotiraning maxsus sohasi bo'lib, u \"oxirgi kirgan — birinchi chiqadi\" (LIFO) tamoyilida ishlaydi. U dasturning eng muhim mexanizmlaridan biri: funksiya chaqiruvlari, lokal o'zgaruvchilar va qaytish manzillari aynan shu yerda saqlanadi. `rsp` registri har doim stekning **cho'qqisini** ko'rsatib turadi.",
              en:"The **stack** is a special region of memory that works on a \"last in, first out\" (LIFO) principle. It is one of a program's most important mechanisms: function calls, local variables and return addresses are all kept here. The `rsp` register always points to the **top** of the stack."},
        {t:"h",n:"6.1",uz:"push va pop",en:"push and pop"},
        {t:"p",uz:"Ikkita asosiy amal bor. `push rax` — `rax` qiymatini stek cho'qqisiga joylaydi va `rsp` ni siljitadi. `pop rbx` — cho'qqidagi qiymatni olib, `rbx` ga yozadi. Qizig'i: x86 da stek xotirada **pastga** — kichik manzillar tomon o'sadi.",
              en:"There are two basic operations. `push rax` places the value of `rax` on top of the stack and moves `rsp`. `pop rbx` takes the value from the top and writes it into `rbx`. Interestingly, on x86 the stack grows **downward** in memory — toward lower addresses."},
        {t:"h",n:"6.2",uz:"call va ret stek orqali ishlaydi",en:"call and ret work through the stack"},
        {t:"p",uz:"`call func` bajarilganda protsessor avval **qaytish manzilini** (chaqiruvdan keyingi buyruq manzili) stekka joylaydi, so'ng funksiyaga sakraydi. Funksiya oxiridagi `ret` esa stekdan o'sha manzilni olib, o'sha yerga qaytadi. Mana shuning uchun stek buzilishi (masalan, **bufer to'lib ketishi**) juda xavfli — u qaytish manzilini o'zgartirib, dastur oqimini o'g'irlashi mumkin.",
              en:"When `call func` executes, the processor first places the **return address** (the address of the instruction after the call) on the stack, then jumps to the function. The `ret` at the end of the function takes that address off the stack and returns there. This is exactly why stack corruption (e.g. a **buffer overflow**) is so dangerous — it can overwrite the return address and hijack the program's flow."},
        {t:"stack",capUz:"Funksiya chaqirilgandagi stek (yuqori = cho'qqi, rsp)",capEn:"The stack during a function call (top = rsp)",rows:[
          {addr:"rsp →",uz:"lokal o'zgaruvchi 2",en:"local variable 2",hi:true},
          {addr:"rsp+8",uz:"lokal o'zgaruvchi 1",en:"local variable 1",hi:true},
          {addr:"rsp+16",uz:"saqlangan rbp",en:"saved rbp"},
          {addr:"rsp+24",uz:"qaytish manzili  ← ret shu yerga qaytadi",en:"return address  ← ret returns here"},
          {addr:"rsp+32",uz:"chaqiruvchi funksiya ma'lumotlari",en:"caller's data"}]},
        {t:"h",n:"6.3",uz:"Stek freymi (stack frame)",en:"The stack frame"},
        {t:"p",uz:"Har bir funksiya stekda o'ziga ajratilgan bo'lakka — **stek freymi**ga ega bo'ladi. Ko'pincha funksiya boshida `push rbp` va `mov rbp, rsp` ko'rasiz — bu freymni sozlash (**prolog**). Oxirida esa `leave`/`pop rbp` va `ret` — freymni yig'ishtirish (**epilog**). Bu naqshni tanish RE'da funksiyalar chegarasini topishga yordam beradi.",
              en:"Each function gets its own slice of the stack — a **stack frame**. You'll often see `push rbp` and `mov rbp, rsp` at the start of a function — setting up the frame (the **prologue**). At the end you'll see `leave`/`pop rbp` and `ret` — tearing it down (the **epilogue**). Recognizing this pattern helps you find function boundaries in RE."},
      ]},
    // ── 7: Control flow ─────────────────────────────────────────
    { uz:"Shartlar: if/else assemblerda", en:"Control flow: if/else in assembly", subUz:"Kompilyator qarorni qanday buyruqqa aylantiradi", subEn:"How the compiler turns a decision into instructions",
      blocks:[
        {t:"p",uz:"Yuqori darajali tilda `if/else` yozamiz, lekin protsessorda \"if\" degan buyruq yo'q. Kompilyator uni ikkita oddiy amalga aylantiradi: **solishtirish** (`cmp`) va **shartli sakrash** (`je`, `jne`, `jg`, `jl` va h.k.).",
              en:"In a high-level language we write `if/else`, but the processor has no \"if\" instruction. The compiler turns it into two simple operations: a **comparison** (`cmp`) and a **conditional jump** (`je`, `jne`, `jg`, `jl`, etc.)."},
        {t:"code",lang:"c",cap:{uz:"Manba kod — C",en:"Source — C"},lines:[
          "int max(int a, int b)",
          "{",
          "    if (a > b)",
          "        return a;",
          "    else",
          "        return b;",
          "}"]},
        {t:"code",lang:"asm",cap:{uz:"Natija — x86-64 assembler",en:"Output — x86-64 assembly"},lines:[
          "max:",
          "    cmp  edi, esi     ; a (edi) ni b (esi) bilan solishtir",
          "    jle  .use_b       ; agar a <= b bo'lsa, .use_b ga sakra",
          "    mov  eax, edi     ; aks holda: qaytish qiymati = a",
          "    ret",
          ".use_b:",
          "    mov  eax, esi     ; qaytish qiymati = b",
          "    ret"]},
        {t:"h",n:"7.1",uz:"O'qish tartibi",en:"How to read it"},
        {t:"p",uz:"`cmp edi, esi` hech narsani saqlamaydi — u faqat ayirmani hisoblab, protsessorning **bayroqlar registri**ni (flags) yangilaydi. Keyingi `jle` shu bayroqlarga qarab qaror qabul qiladi: \"agar edi <= esi bo'lsa, sakra\". Diqqat qiling: manba koddagi `if (a > b)` shart **teskarisiga** (`jle`, ya'ni <=) aylandi — bu juda keng tarqalgan naqsh, chunki kompilyator \"shart yolg'on bo'lsa qayerga sakrash kerak\"ni kodlaydi.",
              en:"`cmp edi, esi` doesn't store anything — it just computes the difference and updates the processor's **flags register**. The next `jle` decides based on those flags: \"if edi <= esi, jump\". Notice that the source condition `if (a > b)` was flipped to its **opposite** (`jle`, i.e. <=) — this is a very common pattern, because the compiler encodes \"where to jump when the condition is false\"."},
        {t:"note",uz:"Shartli sakrash buyruqlari: `je`/`jne` (teng/teng emas), `jg`/`jge` (katta/katta yoki teng), `jl`/`jle` (kichik/kichik yoki teng) — ishorali sonlar uchun; ishorasiz sonlar uchun `ja`/`jae`/`jb`/`jbe` ishlatiladi.",
              en:"Conditional jumps: `je`/`jne` (equal/not equal), `jg`/`jge` (greater/greater-or-equal), `jl`/`jle` (less/less-or-equal) — for signed numbers; for unsigned numbers `ja`/`jae`/`jb`/`jbe` are used."},
      ]},
    // ── 8: Loops ─────────────────────────────────────────────────
    { uz:"Sikllar assemblerda", en:"Loops in assembly", subUz:"for va while — orqaga sakrovchi shart", subEn:"for and while — a jump that goes backward",
      blocks:[
        {t:"p",uz:"Sikl (loop) — assemblerda bu shunchaki **orqaga sakraydigan** shartli sakrash. Kompilyator uchun `for`, `while` va `do-while` deyarli bir xil ko'rinishga tushadi.",
              en:"A loop is, in assembly, simply a conditional jump that **jumps backward**. For the compiler, `for`, `while` and `do-while` all end up looking almost identical."},
        {t:"code",lang:"c",cap:{uz:"Manba kod — massiv yig'indisi",en:"Source — sum an array"},lines:[
          "int sum(int *arr, int n)",
          "{",
          "    int total = 0;",
          "    for (int i = 0; i < n; i++)",
          "        total += arr[i];",
          "    return total;",
          "}"]},
        {t:"code",lang:"asm",cap:{uz:"Natija — soddalashtirilgan x86-64",en:"Output — simplified x86-64"},lines:[
          "sum:",
          "    xor  eax, eax     ; total = 0",
          "    xor  ecx, ecx     ; i = 0",
          ".loop:",
          "    cmp  ecx, esi     ; i < n ?",
          "    jge  .done        ; agar i >= n bo'lsa, chiq",
          "    add  eax, [rdi + rcx*4]  ; total += arr[i]",
          "    inc  ecx          ; i++",
          "    jmp  .loop        ; sikl boshiga qayt",
          ".done:",
          "    ret"]},
        {t:"h",n:"8.1",uz:"Naqshni tanish",en:"Recognizing the pattern"},
        {t:"p",uz:"Har qanday sikl uchta qismdan iborat: **boshlang'ich qiymat** (`i = 0`), **shart tekshiruvi** (`cmp` + shartli sakrash) va **orqaga sakrash** (`jmp .loop`). RE'da assemblerni ko'rganda, agar bitta blok o'ziga **orqaga** sakrasa — bu sikl. `[rdi + rcx*4]` kabi yozuv esa massiv elementiga **indeks orqali** kirishni bildiradi (8-bobda batafsil).",
              en:"Every loop has three parts: an **initial value** (`i = 0`), a **condition check** (`cmp` + conditional jump) and a **backward jump** (`jmp .loop`). When reading assembly in RE, if a block jumps **backward** to itself — that's a loop. Notation like `[rdi + rcx*4]` means accessing an array element **by index** (covered in detail in chapter 8)."},
        {t:"note",uz:"Optimallashtirilgan kodda kompilyator siklni \"yozib tashlashi\" (**loop unrolling**) yoki tartibini o'zgartirishi mumkin — bu RE'ni qiyinlashtiradi, lekin mantiq bir xil qoladi.",
              en:"In optimized code the compiler may \"unroll\" the loop (**loop unrolling**) or reorder it — this makes RE harder, but the logic stays the same."},
      ]},
    // ── 9: Function arguments ────────────────────────────────────
    { uz:"Funksiya argumentlari chuqurroq", en:"Function arguments in depth", subUz:"Registrlar tugaganda nima bo'ladi", subEn:"What happens when the registers run out",
      blocks:[
        {t:"p",uz:"5-bobda birinchi argument `rdi` da uzatilishini ko'rgan edik. Lekin funksiyada 6 tadan ortiq argument bo'lsa-chi? Yoki operatsion tizim boshqacha bo'lsa?",
              en:"In chapter 5 we saw the first argument passed in `rdi`. But what if a function has more than 6 arguments? Or the operating system is different?"},
        {t:"h",n:"9.1",uz:"System V (Linux/macOS) va Windows x64",en:"System V (Linux/macOS) vs Windows x64"},
        {t:"p",uz:"Ikkala asosiy kelishuv butun son argumentlarini turlicha registrlarga joylaydi:",
              en:"The two major conventions place integer arguments in different registers:"},
        {t:"code",lang:"text",cap:{uz:"Argumentlar tartibi — ikkita ABI",en:"Argument order — two ABIs"},lines:[
          "                1-arg   2-arg   3-arg   4-arg   5-arg   6-arg",
          "System V (Linux):  rdi     rsi     rdx     rcx     r8      r9",
          "Windows x64:       rcx     rdx     r8      r9      stek    stek"]},
        {t:"p",uz:"Windows'da atigi 4 ta registr ishlatiladi, 5-argumentdan boshlab **stekka** joylanadi. Ikkala tizimda ham 6 (yoki 4) dan ortiq argument bo'lsa, qolganlari stek orqali uzatiladi. Bu farqni bilish — qaysi ikkilik fayl (Windows .exe yoki Linux ELF) ekanini RE'da darhol tan olishga yordam beradi.",
              en:"Windows uses only 4 registers; from the 5th argument onward, values go on the **stack**. In both systems, once you exceed 6 (or 4) arguments, the rest are passed via the stack. Knowing this difference helps you instantly recognize which binary (Windows .exe or Linux ELF) you're looking at in RE."},
        {t:"h",n:"9.2",uz:"Lokal o'zgaruvchilar va stek",en:"Local variables and the stack"},
        {t:"p",uz:"Funksiya ichidagi lokal o'zgaruvchilar odatda **stek freymida** saqlanadi, `rbp` (yoki `rsp`) dan nisbiy manzil bilan: masalan `[rbp-4]`, `[rbp-8]`. Disassemblerda ko'plab `[rbp-N]` yozuvlarini ko'rsangiz — bu funksiyaning lokal o'zgaruvchilari, ular soni funksiya qanchalik murakkabligini bildiradi.",
              en:"Local variables inside a function are usually kept in the **stack frame**, addressed relative to `rbp` (or `rsp`): e.g. `[rbp-4]`, `[rbp-8]`. When you see many `[rbp-N]` references in a disassembler, those are the function's local variables — their count hints at how complex the function is."},
      ]},
    // ── 10: Arrays and pointers ───────────────────────────────────
    { uz:"Massivlar va ko'rsatkichlar", en:"Arrays and pointers", subUz:"Manzil arifmetikasi assemblerda", subEn:"Address arithmetic in assembly",
      blocks:[
        {t:"p",uz:"Yuqori darajada `arr[i]` deb yozamiz, lekin protsessor buni tushunmaydi — u faqat **manzillarni** biladi. Kompilyator `arr[i]` ni manzil hisob-kitobiga aylantiradi: **boshlang'ich manzil + (indeks × element o'lchami)**.",
              en:"At a high level we write `arr[i]`, but the processor doesn't understand that — it only knows **addresses**. The compiler turns `arr[i]` into an address calculation: **base address + (index x element size)**."},
        {t:"code",lang:"c",cap:{uz:"Manba kod",en:"Source"},lines:[
          "int get(int *arr, int i)",
          "{",
          "    return arr[i];",
          "}"]},
        {t:"code",lang:"asm",cap:{uz:"Natija",en:"Output"},lines:[
          "get:",
          "    mov  eax, [rdi + rsi*4]  ; eax = *(arr + i*4)",
          "    ret                       ; int = 4 bayt, shuning uchun *4"]},
        {t:"h",n:"10.1",uz:"Ko'rsatkichni ochish (dereference)",en:"Dereferencing a pointer"},
        {t:"p",uz:"Ko'rsatkichni \"ochish\" (`*ptr`) — bu shunchaki registrdagi manzil bo'yicha xotiradan o'qish: `mov eax, [rax]`. Kvadrat qavs `[...]` assemblerda har doim \"shu manzildagi qiymatni ol\" degani. Manzilning o'zini olish uchun (C'dagi `&x`) esa `lea` (load effective address) ishlatiladi — bu 2-bobda ko'rgan `lea rdi, [msg]` bilan bir xil.",
              en:"Dereferencing a pointer (`*ptr`) is simply reading from memory at the address held in a register: `mov eax, [rax]`. Square brackets `[...]` in assembly always mean \"take the value at this address\". To get the address itself (`&x` in C), `lea` (load effective address) is used — the same `lea rdi, [msg]` we saw in chapter 2."},
        {t:"note",uz:"Elementning o'lchami (`*4`, `*8`) turi haqida ma'lumot beradi: `*4` — `int` yoki `float` (4 bayt), `*8` — `long` yoki ko'rsatkich (64-bitli tizimda 8 bayt). Bu RE'da o'zgaruvchi turini taxmin qilishga yordam beradi.",
              en:"The element size (`*4`, `*8`) hints at the type: `*4` means `int` or `float` (4 bytes), `*8` means `long` or a pointer (8 bytes on a 64-bit system). This helps you guess variable types in RE."},
      ]},
    // ── 11: Structures ─────────────────────────────────────────────
    { uz:"Strukturalar assemblerda", en:"Structures in assembly", subUz:"Nomlangan maydonlar — sobit ofsetlarga aylanadi", subEn:"Named fields become fixed offsets",
      blocks:[
        {t:"p",uz:"C'dagi `struct` — protsessor uchun umuman mavjud emas. Kompilyator har bir maydonga **sobit ofset** (siljish) beradi va ular bilan oddiy manzil arifmetikasi orqali ishlaydi.",
              en:"A C `struct` doesn't exist for the processor at all. The compiler assigns each field a **fixed offset** and works with them via plain address arithmetic."},
        {t:"code",lang:"c",cap:{uz:"Manba kod",en:"Source"},lines:[
          "struct User {",
          "    int   id;      // ofset 0",
          "    int   age;     // ofset 4",
          "    char *name;    // ofset 8 (8 bayt tekislash)",
          "};",
          "",
          "int get_age(struct User *u)",
          "{",
          "    return u->age;",
          "}"]},
        {t:"code",lang:"asm",cap:{uz:"Natija",en:"Output"},lines:[
          "get_age:",
          "    mov  eax, [rdi + 4]  ; u->age, chunki age ofset 4 da",
          "    ret"]},
        {t:"h",n:"11.1",uz:"Nega bu RE uchun muhim",en:"Why this matters for RE"},
        {t:"p",uz:"Manba kodsiz siz `struct` nomlarini yoki maydon nomlarini ko'rmaysiz — faqat `[rdi+4]`, `[rdi+8]` kabi ofsetlarni ko'rasiz. Teskari injener vazifasi — shu ofsetlarni kuzatib, ular qanday ma'lumot ekanini (id? yosh? ko'rsatkichmi?) **qayta tiklash**. Ko'plab funksiyalar bir xil ofsetlarga murojaat qilsa — bu bitta strukturaning turli maydonlariga ishora qiladi.",
              en:"Without source code you don't see `struct` or field names — only offsets like `[rdi+4]`, `[rdi+8]`. The reverse engineer's job is to track those offsets and **reconstruct** what kind of data they hold (an id? an age? a pointer?). If many functions reference the same offsets, they're pointing at fields of the same structure."},
        {t:"note",uz:"**Tekislash (alignment)** ham muhim: 64-bitli tizimda ko'rsatkichlar 8 baytga tekislanadi, shuning uchun `name` maydoni 6 emas, 8-ofsetdan boshlanadi (orada 4 bayt \"padding\" bo'shliq qoladi).",
              en:"**Alignment** matters too: on a 64-bit system pointers are aligned to 8 bytes, so the `name` field starts at offset 8, not 6 (leaving 4 bytes of \"padding\" in between)."},
      ]},
    // ── 12: File formats ────────────────────────────────────────────
    { uz:"Fayl formatlari: PE va ELF", en:"File formats: PE and ELF", subUz:"Bajariluvchi fayl ichida nima bor", subEn:"What's inside an executable file",
      blocks:[
        {t:"p",uz:"Bajariluvchi fayl — shunchaki mashina kodi emas, balki tuzilgan **konteyner**: kod, ma'lumot va operatsion tizim uchun ko'rsatmalarni o'z ichiga oladi. Windows'da bu format **PE** (Portable Executable), Linux'da — **ELF** (Executable and Linkable Format).",
              en:"An executable file isn't just machine code — it's a structured **container**: it holds code, data, and instructions for the operating system. On Windows this format is **PE** (Portable Executable); on Linux it's **ELF** (Executable and Linkable Format)."},
        {t:"h",n:"12.1",uz:"Umumiy tuzilma",en:"Common structure"},
        {t:"p",uz:"Ikkala format ham tushunchada juda o'xshash: bosh qism (**header**) fayl haqida umumiy ma'lumot beradi, so'ng **sohalar (sections)** keladi:",
              en:"Both formats are conceptually very similar: a **header** describes the file, followed by **sections**:"},
        {t:"ul",uz:[
          "**.text** (yoki .code) — bajariluvchi mashina kodi.",
          "**.data** — boshlang'ich qiymati bor global o'zgaruvchilar.",
          "**.rodata** (yoki .rdata) — faqat o'qiladigan ma'lumot (masalan matn qatorlari — 5-bobni eslang).",
          "**.bss** — boshlang'ich qiymati yo'q global o'zgaruvchilar (faylda joy egallamaydi, faqat hajmi yoziladi)."],
          en:[
          "**.text** (or .code) — the executable machine code.",
          "**.data** — global variables that have an initial value.",
          "**.rodata** (or .rdata) — read-only data (e.g. string literals — recall chapter 5).",
          "**.bss** — global variables with no initial value (takes no space in the file, only its size is recorded)."]},
        {t:"h",n:"12.2",uz:"Kirish nuqtasi va importlar",en:"Entry point and imports"},
        {t:"p",uz:"Header'da **kirish nuqtasi** (entry point) manzili bor — operatsion tizim dasturni ishga tushirganda aynan shu yerdan boshlaydi (odatda `main`ning o'zi emas, balki uni ishga tayyorlaydigan kichik runtime kodi). Shuningdek fayl **importlar jadvali**ni saqlaydi — dastur qaysi tashqi kutubxona funksiyalarini (masalan `puts`, `CreateFileW`) chaqirishini. Bu jadval zararli dastur tahlilida juda muhim: qaysi funksiyalar import qilinganini ko'rish orqali dastur nima qila olishi haqida tezkor xulosa chiqarish mumkin.",
              en:"The header contains the **entry point** address — where the OS starts execution when it launches the program (usually not `main` itself, but a small runtime that prepares it). The file also holds an **import table** — which external library functions the program calls (e.g. `puts`, `CreateFileW`). This table is crucial in malware analysis: seeing which functions are imported gives a quick clue about what a program is capable of."},
        {t:"note",uz:"Amaliyot: Linux'da `file dastur_nomi` fayl turini, `readelf -h dastur_nomi` esa ELF header'ini ko'rsatadi. Windows'da shu maqsadda **PE-bear** yoki **CFF Explorer** kabi bepul vositalar ishlatiladi.",
              en:"In practice: on Linux, `file program_name` shows the file type, and `readelf -h program_name` shows the ELF header. On Windows, free tools like **PE-bear** or **CFF Explorer** serve the same purpose."},
      ]},
    // ── 13: First CrackMe ───────────────────────────────────────────
    { uz:"Birinchi CrackMe", en:"Your first CrackMe", subUz:"Amaliy mashq: seriya raqami tekshiruvi mantig'ini tiklash", subEn:"Practical exercise: reconstructing a serial-check's logic",
      blocks:[
        {t:"p",uz:"**CrackMe** — teskari injeneriya mashq qilish uchun maxsus yaratilgan, kichik va qonuniy dastur (ko'pincha \"to'g'ri kalitni toping\" turida). Bu bobda haqiqiy CrackMe'ning **mantiqini** — kodni emas — qanday kuzatib borishni ko'ramiz.",
              en:"A **CrackMe** is a small, legal program specifically created for reverse-engineering practice (often a \"find the correct key\" type). In this chapter we walk through how to trace the **logic** — not the actual code — of a typical CrackMe."},
        {t:"h",n:"13.1",uz:"Tipik vazifa",en:"A typical task"},
        {t:"p",uz:"Dastur ishga tushganda \"Seriya raqamini kiriting\" deb so'raydi. Siz biror son kiritasiz, dastur esa \"Noto'g'ri\" yoki \"To'g'ri!\" deydi. Manba kod yo'q — faqat ikkilik fayl. Vazifa: **qaysi son \"To'g'ri\" natija berishini topish.**",
              en:"When run, the program asks \"Enter the serial number\". You type a number, and the program says \"Wrong\" or \"Correct!\". There's no source code — only the binary. The task: **find which number produces \"Correct\".**"},
        {t:"h",n:"13.2",uz:"Qadamlar (statik+dinamik)",en:"Steps (static + dynamic)"},
        {t:"ul",uz:[
          "**1) Matnlarni toping.** \"Noto'g'ri\" va \"To'g'ri!\" matnlari .rodata sohasida (5-bob). Disassemblerda ularga **havola qiluvchi kodni** toping — bu tekshiruv joylashgan funksiyaga olib boradi.",
          "**2) Solishtiruv buyrug'ini toping.** O'sha funksiya ichida deyarli albatta bitta `cmp` (yoki bir nechta) bo'ladi — kiritilgan son bilan **kutilgan qiymat** solishtiriladi.",
          "**3) Kutilgan qiymatni o'qing.** Agar `cmp eax, 12345` kabi son ko'rinsa — bu to'g'ridan-to'g'ri javob. Ko'pincha esa qiymat oldindan hisoblanadi (masalan belgilar yig'indisi) — bu holda **algoritmni** tushunish kerak.",
          "**4) Debugger bilan tasdiqlang.** GDB/x64dbg orqali dasturni to'xtatib, `cmp` bajarilgan paytda registrlarni ko'ring — taxminingiz to'g'riligini tekshiring."],
          en:[
          "**1) Find the strings.** \"Wrong\" and \"Correct!\" live in .rodata (chapter 5). In the disassembler, find the code that **references** them — it leads you to the check function.",
          "**2) Find the comparison.** Inside that function there's almost always one `cmp` (or a few) — the entered number gets compared against **an expected value**.",
          "**3) Read the expected value.** If you see something like `cmp eax, 12345` — that's the direct answer. Often the value is computed beforehand (e.g. a sum of characters) — in that case you need to understand **the algorithm**.",
          "**4) Confirm with a debugger.** Pause the program with GDB/x64dbg right when `cmp` executes, and check the registers — verify your guess."]},
        {t:"note",warn:true,uz:"CrackMe'lar maxsus shu maqsad uchun yaratilgan, ruxsat berilgan mashq materiallari (masalan **crackmes.one** saytida). Haqiqiy tijorat dasturlarining litsenziya tekshiruvini chetlab o'tish — litsenziya shartlarini buzadi va ko'p joyda noqonuniy.",
              en:"CrackMes are purpose-built, authorized practice material (e.g. on **crackmes.one**). Bypassing a real commercial program's license check violates its license terms and is illegal in many places."},
      ]},
    // ── 14: Tools ───────────────────────────────────────────────
    { uz:"Vositalar va keyingi qadamlar", en:"Tools and next steps", subUz:"Disassembler, dekompilyator va debugger'lar", subEn:"Disassemblers, decompilers and debuggers",
      blocks:[
        {t:"p",uz:"Endi teskari injeneriyaning amaliy vositalari bilan tanishamiz. Ular ikki katta guruhga bo'linadi: **statik** (dasturni ishga tushirmasdan) va **dinamik** (ishga tushirib, kuzatib).",
              en:"Now let's meet the practical tools of reverse engineering. They fall into two big groups: **static** (without running the program) and **dynamic** (running and observing it)."},
        {t:"h",n:"7.1",uz:"Statik tahlil vositalari",en:"Static analysis tools"},
        {t:"ul",uz:[
          "**Ghidra** — NSA yaratgan bepul va ochiq kodli platforma. Kuchli **dekompilyatori** bor (assembler'ni C-ga o'xshash kodga o'giradi). Boshlash uchun eng yaxshi tanlov.",
          "**IDA (Free/Pro)** — sanoat standarti disassembler. Bepul versiyasi ham o'rganish uchun yetarli.",
          "**radare2 / rizin** — bepul, ochiq kodli, buyruq qatorida ishlaydigan kuchli vosita.",
          "**objdump** — Linux'da har doim mavjud: `objdump -d fayl` bajariluvchi faylni tez disassemble qiladi."],
          en:[
          "**Ghidra** — a free, open-source platform built by the NSA. It has a powerful **decompiler** (turns assembly into C-like code). The best choice to start with.",
          "**IDA (Free/Pro)** — the industry-standard disassembler. The free version is enough to learn.",
          "**radare2 / rizin** — a free, open-source, powerful command-line tool.",
          "**objdump** — always available on Linux: `objdump -d file` quickly disassembles an executable."]},
        {t:"h",n:"7.2",uz:"Dinamik tahlil vositalari",en:"Dynamic analysis tools"},
        {t:"ul",uz:[
          "**GDB** — Linux'ning standart debuggeri. Dasturni to'xtatib, registrlar va xotirani ko'rish uchun.",
          "**x64dbg** — Windows uchun qulay, ochiq kodli debugger.",
          "**GDB + pwndbg/GEF** — xavfsizlik tahlili uchun kengaytmalar bilan jihozlangan GDB."],
          en:[
          "**GDB** — the standard debugger on Linux. Pause a program and inspect registers and memory.",
          "**x64dbg** — a convenient, open-source debugger for Windows.",
          "**GDB + pwndbg/GEF** — GDB equipped with extensions for security analysis."]},
        {t:"h",n:"7.3",uz:"Birinchi amaliyot",en:"Your first practice"},
        {t:"code",lang:"asm",cap:{uz:"Linux'da o'zingiz sinab ko'ring",en:"Try it yourself on Linux"},lines:[
          "$ gcc -O1 hello.c -o hello      # dasturni kompilyatsiya qil",
          "$ objdump -d hello | less       # mashina kodini assemblerda ko'r",
          "$ gdb ./hello                   # debugger ostida ishga tushir",
          "  (gdb) break main              # main da to'xta",
          "  (gdb) run                     # ishga tushir",
          "  (gdb) info registers          # registrlarni ko'r"]},
        {t:"h",n:"7.4",uz:"Qayerga borish kerak?",en:"Where to go next?"},
        {t:"p",uz:"Bu kurs asoslarni berdi. Chuqurroq o'rganish uchun Dennis Yurichevning to'liq **1000+ sahifali** bepul kitobini o'qing — unda x86, ARM, MIPS misollari, shartlar, sikllar, strukturalar, C++ va boshqalar batafsil yoritilgan. Amaliyot uchun esa mualliflning **challenges.re** mashqlar to'plamini sinab ko'ring.",
              en:"This course gave you the basics. To go deeper, read Dennis Yurichev's full **1000+ page** free book — it covers x86, ARM, MIPS examples, conditionals, loops, structures, C++ and much more in detail. For practice, try the author's **challenges.re** set of exercises."},
        {t:"colophon"},
      ]},
  ],
};

// ═══════════════════════════════════════════════════════════════
//  BOOK DATA — Social Engineering (human-factor security).
//  Original, defence-and-awareness oriented material written to help
//  people RECOGNISE and RESIST manipulation. Based on widely taught,
//  factual security-awareness concepts; open references are credited.
// ═══════════════════════════════════════════════════════════════
const SE_BOOK={
  id:"se",
  titleUz:"Ijtimoiy injeneriya — inson omili xavfsizligi",
  titleEn:"Social Engineering — the human factor",
  author:"Original (ochiq manbalar asosida)",
  authorUz:"Original material (ochiq manbalar asosida)",
  authorEn:"Original material (based on open references)",
  license:"CC BY-SA 4.0",
  coverAbbr:"SE", coverBy:"Himoya", coverIcon:"users",
  refs:[
    {label:"CISA — Avoiding Social Engineering & Phishing Attacks",href:"https://www.cisa.gov/news-events/news/avoiding-social-engineering-and-phishing-attacks"},
    {label:"NIST SP 800-50 (Security Awareness)",href:"https://csrc.nist.gov/"},
    {label:"OWASP — Social Engineering",href:"https://owasp.org/"},
  ],
  noteUz:"Bu — himoya va xabardorlik uchun yozilgan original material. Maqsad — hujumlarni tanib olib, ulardan himoyalanish; hech kimni aldash uchun emas. Ochiq manbalar (CISA, NIST, OWASP) asosida, CC BY-SA 4.0 litsenziyasida.",
  noteEn:"This is original material written for defence and awareness. Its purpose is to recognise and resist attacks — not to deceive anyone. Based on open references (CISA, NIST, OWASP), under the CC BY-SA 4.0 license.",
  descUz:"Odamni ishontirib maxfiy ma'lumot yoki kirish olish — 'inson xakerlik'. Fishing, vishing, pretexting va manipulyatsiya psixologiyasini tanib olib, ulardan himoyalanishni o'rgatuvchi himoya-yo'nalishidagi kitob.",
  descEn:"Manipulating a person into giving up secrets or access — 'hacking humans'. A defence-focused book that teaches you to recognise phishing, vishing, pretexting and the psychology of manipulation — and to protect against them.",
  chapters:[
    // ── 0: Preface & ethics ────────────────────────────────────
    { uz:"Muqaddima va axloq", en:"Preface & ethics", subUz:"Bu kitob nima uchun — va nima uchun EMAS", subEn:"What this book is for — and what it is NOT for",
      blocks:[
        {t:"p",uz:"Eng mustahkam texnik himoya ham bitta narsa oldida ojiz qolishi mumkin: **aldangan odam**. **Ijtimoiy injeneriya** (social engineering) — bu texnik zaiflikdan emas, balki **inson psixologiyasidan** foydalanib, maxfiy ma'lumot yoki tizimga kirishni qo'lga kiritish san'ati.",
              en:"Even the strongest technical defence can fail against one thing: **a deceived person**. **Social engineering** is the art of obtaining confidential information or access by exploiting **human psychology** rather than a technical flaw."},
        {t:"colophon"},
        {t:"note",warn:true,uz:"**Bu kitob himoya uchun.** Maqsad — bu hujumlar qanday ishlashini tushunib, ularni **tanib olish va ulardan himoyalanish**. Ijtimoiy injeneriyani real odamlarga qarshi ishlatish — bu **firibgarlik** (jinoyat) va axloqqa zid. Faqat yozma **ruxsat berilgan** test (masalan, ish beruvchi kompaniya buyurtmasi) qonuniy hisoblanadi.",
              en:"**This book is for defence.** The goal is to understand how these attacks work in order to **recognise and defend against them**. Using social engineering against real people is **fraud** (a crime) and unethical. Only **authorised** testing in writing (e.g. commissioned by the target organisation) is legal."},
        {t:"h",n:"§",uz:"Nega buni o'rganish kerak?",en:"Why learn this?"},
        {t:"ul",uz:[
          "Ko'pgina yirik buzilishlar (breach) texnik zaiflikdan emas, balki bitta **fishing xatidan** boshlanadi.",
          "O'zingizni, oilangizni va jamoangizni aldov va firibgarlikdan himoya qilish uchun.",
          "Tashkilotda **xavfsizlik madaniyati** va xabardorlikni yaratish uchun."],
          en:[
          "Many major breaches start not from a technical flaw but from a single **phishing email**.",
          "To protect yourself, your family and your team from deception and fraud.",
          "To build a **security culture** and awareness inside an organisation."]},
        {t:"p",uz:"Keyingi boblarda: ijtimoiy injeneriya nima, **nega u ishlaydi** (psixologiya), asosiy hujum turlari (fishing, vishing, pretexting) va eng muhimi — **himoya usullari**.",
              en:"In the next chapters: what social engineering is, **why it works** (psychology), the main attack types (phishing, vishing, pretexting), and most importantly — **defence methods**."},
      ]},
    // ── 1: What is SE ──────────────────────────────────────────
    { uz:"Ijtimoiy injeneriya nima?", en:"What is social engineering?", subUz:"Nishon — texnika emas, odam", subEn:"The target is the human, not the technology",
      blocks:[
        {t:"p",uz:"**Ijtimoiy injeneriya** — odamni ishontirib, aldab yoki bosim o'tkazib, uni o'zi qilmasligi kerak bo'lgan narsani qildirish: parolni aytish, havolani bosish, pul o'tkazish yoki begonani binoga kiritish. Hujumchi **firewall'ni emas, odamni** \"buzadi\".",
              en:"**Social engineering** is convincing, deceiving or pressuring a person into doing something they shouldn't: revealing a password, clicking a link, transferring money, or letting a stranger into a building. The attacker \"hacks\" the **human, not the firewall**."},
        {t:"h",n:"1.1",uz:"Hujum bosqichlari",en:"The attack lifecycle"},
        {t:"p",uz:"Ko'pchilik ijtimoiy injeneriya hujumlari bir xil bosqichlardan o'tadi. Buni bilish — hujumni erta bosqichda payqashga yordam beradi:",
              en:"Most social engineering attacks go through the same stages. Knowing them helps you spot an attack early:"},
        {t:"pipe",steps:[
          {ic:"search",tUz:"Ma'lumot to'plash",tEn:"Recon",sUz:"OSINT, ijtimoiy tarmoq",sEn:"OSINT, socials"},
          {ic:"users",tUz:"Ishonch qurish",tEn:"Build trust",sUz:"aloqa, rol o'ynash",sEn:"rapport, role"},
          {ic:"alert",tUz:"Ekspluatatsiya",tEn:"Exploit",sUz:"so'rov, bosim",sEn:"the ask, pressure"},
          {ic:"arrowR",tUz:"Chiqish",tEn:"Exit",sUz:"iz qoldirmay",sEn:"no trace"}]},
        {t:"p",uz:"**1) Ma'lumot to'plash (recon):** hujumchi nishon haqida ochiq ma'lumot yig'adi — ish joyi, hamkasblar, qiziqishlar (ko'pincha ijtimoiy tarmoqlardan). **2) Ishonch qurish:** o'zini hamkasb, IT-yordam yoki bank xodimi qilib ko'rsatadi. **3) Ekspluatatsiya:** kerakli narsani so'raydi — odatda shoshilinchlik bilan. **4) Chiqish:** shubha uyg'otmay yo'qoladi.",
              en:"**1) Recon:** the attacker gathers open information about the target — workplace, colleagues, interests (often from social media). **2) Build trust:** they pose as a colleague, IT support or a bank employee. **3) Exploit:** they make the request — usually with urgency. **4) Exit:** they disappear without raising suspicion."},
        {t:"note",uz:"Eng kuchli qurol — **ochiq ma'lumot (OSINT)**. Ijtimoiy tarmoqlarda kam ma'lumot ulashish — birinchi himoya qatlami.",
              en:"The strongest weapon is **open information (OSINT)**. Sharing less on social media is your first layer of defence."},
      ]},
    // ── 2: Psychology ──────────────────────────────────────────
    { uz:"Nega u ishlaydi — psixologiya", en:"Why it works — psychology", subUz:"Miyamizning yorliqlaridan qanday foydalaniladi", subEn:"How our mental shortcuts get abused",
      blocks:[
        {t:"p",uz:"Ijtimoiy injeneriya ishlaydi, chunki miyamiz tez qaror qabul qilish uchun **yorliqlardan** (mental shortcuts) foydalanadi. Hujumchilar aynan shu avtomatik reaksiyalarni ishga soladi. Ularni bilsangiz — o'zingizda payqay olasiz.",
              en:"Social engineering works because our brains use **mental shortcuts** to decide quickly. Attackers deliberately trigger these automatic reactions. If you know them, you can catch them in yourself."},
        {t:"h",n:"2.1",uz:"Asosiy ta'sir tamoyillari",en:"Key principles of influence"},
        {t:"ul",uz:[
          "**Avtoritet** — biz \"boshliq\", \"politsiya\" yoki \"IT-bo'lim\" degan odamga bo'ysunishga moyilmiz.",
          "**Shoshilinchlik va tanqislik** — \"faqat bugun\", \"24 soat ichida\" — o'ylashga vaqt qoldirmaydi.",
          "**O'zaro yordam (reciprocity)** — kimdir bizga yaxshilik qilsa, qarzdek his qilamiz.",
          "**Ijtimoiy dalil** — \"hamma shunday qildi\" degan tuyg'u qarshilikni sindiradi.",
          "**Yoqtirish** — xushmuomala, tanish yoki 'o'ziniki'dek odamga ko'proq ishonamiz.",
          "**Qo'rquv va qiziquvchanlik** — 'hisobingiz buzildi!' yoki 'siz yutdingiz!' — kuchli tugmalar."],
          en:[
          "**Authority** — we tend to obey someone who claims to be 'the boss', 'the police' or 'IT'.",
          "**Urgency & scarcity** — 'today only', 'within 24 hours' — leaves no time to think.",
          "**Reciprocity** — when someone does us a favour, we feel indebted.",
          "**Social proof** — the feeling that 'everyone did it' breaks down resistance.",
          "**Liking** — we trust a polite, familiar or 'one of us' person more.",
          "**Fear & curiosity** — 'your account was hacked!' or 'you won!' are powerful triggers."]},
        {t:"note",uz:"**Himoya qoidasi:** agar biror xabar sizni **shoshiltirayotgan**, **qo'rqitayotgan** yoki juda yaxshi taklif qilayotgan bo'lsa — bu aynan to'xtab, tekshirish kerak bo'lgan payt. His-tuyg'u bosimi — birinchi ogohlantiruvchi belgi.",
              en:"**Defence rule:** if a message is **rushing** you, **frightening** you, or offering something too good — that is exactly the moment to stop and verify. Emotional pressure is the first warning sign."},
      ]},
    // ── 3: Phishing ────────────────────────────────────────────
    { uz:"Fishing (Phishing)", en:"Phishing", subUz:"Soxta xatlar orqali hujum — va uni tanib olish", subEn:"Attacks via fake messages — and how to spot them",
      blocks:[
        {t:"p",uz:"**Fishing** — eng keng tarqalgan ijtimoiy injeneriya hujumi. Hujumchi ishonchli tashkilot (bank, ijtimoiy tarmoq, ish joyi) nomidan soxta xat yuborib, parol, karta ma'lumoti yoki bosishni so'raydi. Turlari: oddiy **fishing** (ommaviy), **spear phishing** (aniq shaxsga moslangan), **whaling** (rahbarlarga qaratilgan).",
              en:"**Phishing** is the most common social engineering attack. The attacker sends a fake message impersonating a trusted organisation (a bank, social network, workplace) to ask for a password, card details or a click. Types: plain **phishing** (mass), **spear phishing** (tailored to a specific person), **whaling** (aimed at executives)."},
        {t:"h",n:"3.1",uz:"Soxta xatni tanib oling",en:"Recognise a fake message"},
        {t:"p",uz:"Quyida oddiy fishing xati va uning **xavf belgilari** (izohlarda). Ta'lim maqsadida — buni yozish uchun emas, **payqash** uchun:",
              en:"Below is a simple phishing email with its **red flags** (in the comments). For education — to **spot** it, not to write it:"},
        {t:"code",lang:"email",cap:{uz:"Fishing xati — xavf belgilarini toping",en:"Phishing email — spot the red flags"},lines:[
          "Kimdan: security@paypa1-support.com   # domen soxta: 'paypa1' (L emas, 1 raqami)",
          "Mavzu: SHOSHILINCH: hisobingiz bloklandi!  # sun'iy shoshilinchlik",
          "",
          "Hurmatli mijoz,                        # umumiy murojaat, ismingiz yo'q",
          "",
          "Hisobingizda shubhali kirish aniqlandi.",
          "24 soat ichida tasdiqlamasangiz, hisob o'chiriladi.  # qo'rqitish + muddat",
          "",
          "[ Hisobni tasdiqlash ]                 # havola boshqa saytga olib boradi",
          "                                       # (ustiga bosmasdan turib tekshiring)"]},
        {t:"h",n:"3.2",uz:"Himoya",en:"Defence"},
        {t:"ul",uz:[
          "**Yuboruvchi manzilini** diqqat bilan tekshiring — harflar almashtirilgan bo'lishi mumkin.",
          "**Havola ustiga bosmasdan** sichqonchani olib boring (hover) — haqiqiy manzilni ko'rasiz.",
          "Shoshilinchlik va qo'rquvga **berilmang** — bank hech qachon parolni xatda so'ramaydi.",
          "Shubha bo'lsa — havoladan emas, **rasmiy sayt yoki ilova**ga o'zingiz kirib tekshiring.",
          "Ish joyida — bunday xatlarni **IT/xavfsizlik bo'limiga xabar qiling**."],
          en:[
          "Check the **sender address** carefully — letters may be swapped.",
          "**Hover** over links without clicking — you'll see the real destination.",
          "Don't **give in** to urgency and fear — a bank never asks for your password by email.",
          "If in doubt — go to the **official site or app yourself**, not via the link.",
          "At work — **report** such messages to IT/security."]},
      ]},
    // ── 4: Vishing & smishing ──────────────────────────────────
    { uz:"Vishing va Smishing", en:"Vishing & smishing", subUz:"Telefon va SMS orqali aldov", subEn:"Deception by phone and SMS",
      blocks:[
        {t:"p",uz:"Aldov faqat xatda emas. **Vishing** — telefon qo'ng'irog'i orqali (voice + phishing), **smishing** — SMS orqali. Hujumchi qo'ng'iroq raqamini soxtalashtirishi (**caller-ID spoofing**) va ekranda haqiqiy bank raqami ko'rinishi mumkin.",
              en:"Deception isn't only in email. **Vishing** is via a phone call (voice + phishing), **smishing** is via SMS. The attacker can spoof the calling number (**caller-ID spoofing**) so a real-looking bank number appears on your screen."},
        {t:"h",n:"4.1",uz:"Tipik ssenariy",en:"A typical scenario"},
        {t:"p",uz:"\"Bank xavfsizlik xizmati\"dan qo'ng'iroq: *\"Hisobingizdan shubhali to'lov amalga oshirilmoqda. Uni bekor qilish uchun telefoningizga kelgan **tasdiq kodini** ayting.\"* Aslida hujumchi aynan shu daqiqada sizning hisobingizga kirishga urinmoqda va OTP kod unga o'sha kirishni tasdiqlash uchun kerak.",
              en:"A call from the \"bank security team\": *\"A suspicious payment is being made from your account. To cancel it, tell us the **confirmation code** sent to your phone.\"* In reality the attacker is trying to log into your account at that very moment, and the OTP code is what they need to confirm that login."},
        {t:"note",warn:true,uz:"**Oltin qoida:** **tasdiq kodini (OTP) hech kimga aytmang** — hatto 'bank' so'rasa ham. Haqiqiy bank hech qachon telefonda to'liq parol yoki OTP so'ramaydi.",
              en:"**Golden rule:** **never share a confirmation code (OTP) with anyone** — even a 'bank'. A real bank never asks for your full password or OTP over the phone."},
        {t:"h",n:"4.2",uz:"Himoya",en:"Defence"},
        {t:"ul",uz:[
          "Qo'ng'iroqni **uzib**, kartangiz orqasidagi **rasmiy raqamga o'zingiz qo'ng'iroq qiling**.",
          "Ekrandagi raqamga ishonmang — u soxtalashtirilgan bo'lishi mumkin.",
          "Shoshilinch bosim — **firibgarlik belgisi**. Vaqt so'rang, o'ylang.",
          "SMS'dagi havolalarni bosmang; rasmiy ilovadan tekshiring."],
          en:[
          "**Hang up** and **call the official number** on the back of your card yourself.",
          "Don't trust the number on screen — it can be spoofed.",
          "Urgent pressure is a **sign of fraud**. Ask for time, think.",
          "Don't click links in SMS; check via the official app."]},
      ]},
    // ── 5: Pretexting & other ──────────────────────────────────
    { uz:"Pretexting va boshqa usullar", en:"Pretexting & other techniques", subUz:"Soxta rol, o'lja va jismoniy hujumlar", subEn:"False roles, bait and physical attacks",
      blocks:[
        {t:"p",uz:"Ijtimoiy injeneriya faqat ekranda emas — u jismoniy dunyoda ham bor. Mana asosiy usullar (barchasini **tanib olish** uchun):",
              en:"Social engineering isn't only on a screen — it exists in the physical world too. Here are the main techniques (all to **recognise**):"},
        {t:"ul",uz:[
          "**Pretexting** — hujumchi ishonchli **soxta ssenariy va shaxs** o'ylab topadi (masalan, 'yangi IT xodimiman'), keyin shu rolda ma'lumot so'raydi.",
          "**Baiting (o'lja)** — qiziqtiruvchi narsa qoldiriladi: 'Maosh' deb yozilgan **USB fleshka** yoki bepul yuklab olish. Ochsangiz — zararli dastur.",
          "**Quid pro quo** — 'yordam' evaziga narsa so'raladi: soxta 'IT yordam' qo'ng'iroq qilib, 'tuzatish' uchun parol so'raydi.",
          "**Tailgating / piggybacking** — begona odam xodim ortidan **eshikdan birga** kiradi ('qo'lim band, eshikni ushlab turing').",
          "**Dumpster diving** — axlatdan tashlangan hujjat va qog'ozlardan ma'lumot terish.",
          "**Shoulder surfing** — yelka ortidan parol yoki PIN kodni ko'rib olish."],
          en:[
          "**Pretexting** — the attacker invents a believable **false scenario and identity** (e.g. 'I'm the new IT guy'), then requests information in that role.",
          "**Baiting** — something tempting is left behind: a **USB stick** labelled 'Salary', or a free download. Open it and it's malware.",
          "**Quid pro quo** — something is asked in exchange for 'help': a fake 'IT support' call asks for your password to 'fix' something.",
          "**Tailgating / piggybacking** — a stranger walks in **through the door behind** an employee ('my hands are full, hold the door').",
          "**Dumpster diving** — collecting information from documents and papers thrown in the trash.",
          "**Shoulder surfing** — reading a password or PIN over your shoulder."]},
        {t:"note",uz:"Umumiy himoya: **shaxsni tasdiqlang** ('sizga qayta qo'ng'iroq qilaman'), begonani binoga kiritmang, maxfiy hujjatlarni **maydalab** tashlang, PIN terganda ekranni to'sing.",
              en:"General defence: **verify identity** ('I'll call you back'), don't let strangers into the building, **shred** confidential documents, and shield the screen when entering a PIN."},
      ]},
    // ── 6: Defence & awareness ─────────────────────────────────
    { uz:"Himoya va xabardorlik", en:"Defence & awareness", subUz:"Shaxsiy odatlar va tashkiliy choralar", subEn:"Personal habits and organisational measures",
      blocks:[
        {t:"p",uz:"Ijtimoiy injeneriyaga qarshi eng yaxshi himoya — **texnologiya emas, odat va madaniyat**. Quyidagilar hujumlarning katta qismini to'xtatadi.",
              en:"The best defence against social engineering is **not technology, but habits and culture**. The following stop a large share of attacks."},
        {t:"h",n:"6.1",uz:"Shaxsiy odatlar",en:"Personal habits"},
        {t:"ul",uz:[
          "**Sekinlashing.** Shoshilinch so'rov — to'xtab, tekshirish signali.",
          "**Tasdiqlang.** Har doim ma'lum, rasmiy kanal orqali qayta aloqa qiling (havoladan emas).",
          "**MFA (ikki bosqichli tasdiq)** yoqing — parol o'g'irlansa ham himoya qatlami qoladi.",
          "**Parol menejeri** ishlating; har saytga alohida, kuchli parol.",
          "**OTP va parolni** hech kimga aytmang.",
          "Ijtimoiy tarmoqda **kam ma'lumot** ulashing."],
          en:[
          "**Slow down.** An urgent request is a signal to stop and verify.",
          "**Verify.** Always call back through a known, official channel (not the link).",
          "Enable **MFA (two-factor)** — a layer of protection remains even if a password is stolen.",
          "Use a **password manager**; a unique, strong password per site.",
          "**Never** share an OTP or password with anyone.",
          "Share **less information** on social media."]},
        {t:"h",n:"6.2",uz:"Tashkilotda",en:"In an organisation"},
        {t:"ul",uz:[
          "Aniq **siyosat va protseduralar** (masalan, pul o'tkazmasini ikkinchi kanal orqali tasdiqlash).",
          "**Eng kam imtiyoz** (least privilege) — har kimga faqat kerakli ruxsat.",
          "Oson **xabar berish** yo'li — shubhali xatni bir tugma bilan xabar qilish.",
          "**Xavfsizlik madaniyati** — xato qilishdan qo'rqmaslik, darhol xabar berish."],
          en:[
          "Clear **policies and procedures** (e.g. confirm any money transfer via a second channel).",
          "**Least privilege** — everyone gets only the access they need.",
          "An easy **reporting** path — flag a suspicious email with one button.",
          "A **security culture** — not being afraid to make a mistake, reporting immediately."]},
        {t:"note",uz:"Ko'p kompaniyalar xodimlarni **simulyatsiyalangan fishing** (test xatlari) bilan o'qitadi — bu jazolash uchun emas, xatoda o'rganish uchun. Bu — himoya-yo'nalishidagi eng samarali usullardan biri.",
              en:"Many companies train staff with **simulated phishing** (test emails) — not to punish, but to learn from mistakes safely. It's one of the most effective defensive methods."},
      ]},
    // ── 7: BEC ────────────────────────────────────────────────────
    { uz:"BEC — rahbar nomidan firibgarlik", en:"BEC — CEO fraud", subUz:"Eng qimmatga tushadigan ijtimoiy injeneriya hujumi", subEn:"The most expensive social engineering attack",
      blocks:[
        {t:"p",uz:"**BEC** (Business Email Compromise) — kompaniyalarga har yili milliardlab dollar zarar keltiradigan hujum turi. Hujumchi rahbar, moliya bo'limi yoki ishonchli hamkor nomidan **soxta email** yuborib, xodimni pul o'tkazishga yoki maxfiy ma'lumot yuborishga ko'ndiradi.",
              en:"**BEC** (Business Email Compromise) is a category of attack that costs companies billions of dollars every year. The attacker sends a **fake email** posing as an executive, the finance department, or a trusted partner, convincing an employee to transfer money or send sensitive information."},
        {t:"h",n:"7.1",uz:"Tipik ssenariy",en:"A typical scenario"},
        {t:"pipe",steps:[
          {ic:"search",tUz:"Kuzatish",tEn:"Recon",sUz:"rahbar kim, qachon sayohatda",sEn:"who's the exec, when traveling"},
          {ic:"mail",tUz:"Soxta xat",tEn:"Fake email",sUz:"domen o'xshash yoki buzilgan",sEn:"lookalike or hacked domain"},
          {ic:"alert",tUz:"Shoshilinch so'rov",tEn:"Urgent request",sUz:"\"hoziroq o'tkazing, maxfiy\"",sEn:"\"transfer now, confidential\""},
          {ic:"arrowR",tUz:"Pul yo'qoladi",tEn:"Money is gone",sUz:"qaytarib bo'lmaydi",sEn:"unrecoverable"}]},
        {t:"p",uz:"Hujumchi avval OSINT orqali (keyingi kitobda batafsil) kompaniya rahbarining kim ekanini, u qachon sayohatda bo'lishini biladi. Keyin rahbar **sayohatda, telefonga chiqolmaydigan** paytda, moliya bo'limi xodimiga \"Men hozir muzokarada, shoshilinch — quyidagi hisobga $50,000 o'tkazing, bu maxfiy shartnoma\" mazmunidagi xat yuboradi.",
              en:"The attacker first learns via OSINT (covered in the next book) who the company's executive is and when they'll be traveling. Then, while the executive is **traveling and unreachable by phone**, they email a finance employee: \"I'm in a negotiation right now, urgent — transfer $50,000 to the account below, this is a confidential deal.\""},
        {t:"h",n:"7.2",uz:"Nega ishlaydi",en:"Why it works"},
        {t:"p",uz:"Bu — 2-bobdagi ta'sir tamoyillarining aynan qo'llanilishi: **avtoritet** (rahbar buyurmoqda), **shoshilinchlik** (\"hozir\"), va **tekshirish imkoniyati yo'q** (rahbar \"band\"). Xodim shubhalansa ham, rahbarga qarshi chiqishdan qo'rqadi.",
              en:"This is a direct application of the influence principles from chapter 2: **authority** (the boss is ordering it), **urgency** (\"right now\"), and **no way to verify** (the boss is \"busy\"). Even if the employee has doubts, they're afraid to push back on the boss."},
        {t:"note",warn:true,uz:"**Oltin qoida:** har qanday pul o'tkazmasi so'rovini, hatto \"rahbardan\" kelsa ham, **ikkinchi kanal orqali** (telefon qo'ng'irog'i, shaxsan) tasdiqlang — email orqali javob yozib emas. Ko'plab tashkilotlarda katta summalar uchun **ikki kishi tasdig'i** talab qilinadi — bu yakka xodimni himoya qiladi.",
              en:"**Golden rule:** verify any money-transfer request — even one that appears to be from the boss — through **a second channel** (a phone call, in person), not by replying to the email. Many organizations require **two-person approval** for large sums — this protects any single employee."},
      ]},
    // ── 8: Physical security ────────────────────────────────────────
    { uz:"Jismoniy xavfsizlik", en:"Physical security", subUz:"Ijtimoiy injeneriya ekrandan tashqarida", subEn:"Social engineering beyond the screen",
      blocks:[
        {t:"p",uz:"Eng kuchli raqamli himoya ham **ochiq eshik** oldida ojiz. Jismoniy ijtimoiy injeneriya — binoga, xonaga yoki cheklangan hududga ruxsatsiz kirish uchun ishonch va rolni ishlatish.",
              en:"Even the strongest digital defence is powerless against **an open door**. Physical social engineering means using trust and role-play to gain unauthorized access to a building, room or restricted area."},
        {t:"h",n:"8.1",uz:"Keng tarqalgan usullar",en:"Common techniques"},
        {t:"ul",uz:[
          "**Tailgating** — begona odam xodim ortidan, badge ko'rsatmasdan, eshikdan birga kiradi (\"qo'lim band, ushlab turing\").",
          "**Rol o'ynash** — kuryer, ta'mirchi, yangi xodim yoki auditor sifatida kiyinib, ishonch qozonish.",
          "**Badge klonlash** — ba'zi eski RFID kartalarni maxsus qurilma bilan nusxalash mumkin (fizik yaqinlikda).",
          "**\"Piggybacking\" bilan farqi** — tailgating (xodim bilmaydi), piggybacking (xodim ataylab, xushmuomalalik yuzasidan eshikni ushlaydi)."],
          en:[
          "**Tailgating** — a stranger enters right behind an employee, without showing a badge, riding on the held door (\"my hands are full, hold it\").",
          "**Role-play** — dressing as a courier, repair technician, new hire or auditor to gain trust.",
          "**Badge cloning** — some older RFID cards can be copied with a special device (at close physical range).",
          "**Difference from \"piggybacking\"** — tailgating is unnoticed by the employee; piggybacking is when the employee knowingly, out of politeness, holds the door."]},
        {t:"h",n:"8.2",uz:"Himoya",en:"Defence"},
        {t:"ul",uz:[
          "Har bir kirishda **badge/karta talab qiling** — hatto tanish yuz bo'lsa ham.",
          "Xushmuomalalikdan qo'rqmang: **\"Kechirasiz, badge'ingizni ko'rsata olasizmi?\"** — bu normal, ishning bir qismi.",
          "Ish stolida qog'oz, parol yozuvlari qoldirmang (**clean desk** siyosati).",
          "Shubhali odamni ko'rsangiz — **xavfsizlik xizmatiga xabar bering**, o'zingiz to'xtatishga urinmang."],
          en:[
          "**Require a badge/card** at every entry — even for a familiar face.",
          "Don't be afraid to be polite about it: **\"Sorry, could you show your badge?\"** — this is normal, part of the job.",
          "Don't leave papers or written passwords on your desk (**clean desk** policy).",
          "If you see someone suspicious — **report it to security**, don't try to stop them yourself."]},
      ]},
    // ── 9: Deepfakes ──────────────────────────────────────────────
    { uz:"Deepfake va ovoz taqlidi", en:"Deepfakes & voice cloning", subUz:"Sun'iy intellekt — yangi ijtimoiy injeneriya quroli", subEn:"AI — a new social engineering weapon",
      blocks:[
        {t:"p",uz:"Sun'iy intellekt ijtimoiy injeneriyaga yangi, xavotirli o'lchov qo'shdi: **deepfake** video va **ovoz klonlash**. Endi hujumchiga kimningdir ovozini taqlid qilish uchun bir necha soniyalik audio namuna yetarli.",
              en:"Artificial intelligence has added a new, worrying dimension to social engineering: **deepfake** video and **voice cloning**. Now an attacker needs only a few seconds of audio sample to imitate someone's voice."},
        {t:"h",n:"9.1",uz:"Real xavf",en:"The real danger"},
        {t:"p",uz:"2019-2024 yillarda dunyo bo'ylab kompaniyalar rahbar ovozi (yoki hatto video qo'ng'iroqda yuzi) klonlangan holda firibgarlikka uchradi — moliya xodimi \"ishonchli\" ovozni eshitib, katta summani o'tkazib yubordi. Ijtimoiy tarmoqdagi ochiq intervyu yoki videolar bunday klonlash uchun yetarli material beradi.",
              en:"Between 2019 and 2024, companies worldwide were defrauded via cloned executive voices (or even faces on a video call) — a finance employee heard a \"trusted\" voice and transferred a large sum. Public interviews or videos on social media provide more than enough material for such cloning."},
        {t:"note",warn:true,uz:"Bu 7-bobdagi BEC xavfini yanada kuchaytiradi: endi hujumchi shunchaki yozmaydi — **qo'ng'iroq qiladi**, va ovoz aynan tanish eshitiladi.",
              en:"This amplifies the BEC risk from chapter 7: the attacker no longer just writes — they **call**, and the voice sounds exactly familiar."},
        {t:"h",n:"9.2",uz:"Himoya",en:"Defence"},
        {t:"ul",uz:[
          "**Ovoz yoki video — yagona dalil emas.** Muhim so'rovlarni (pul, parol) boshqa kanal orqali tasdiqlang.",
          "Oila yoki jamoada **maxfiy \"kod so'z\"** kelishib oling — shoshilinch qo'ng'iroqda shu so'zni so'rang.",
          "G'ayrioddiy so'rov (\"darhol pul yubor\", \"OTP ayt\") — ovoz kimniki bo'lishidan qat'iy nazar, to'xtab tekshiring qoidasi (4-bob) shu yerda ham ishlaydi.",
          "Kompaniyalar uchun: yuqori-summali operatsiyalarga **ko'p bosqichli tasdiq** joriy qiling, faqat ovozga ishonmang."],
          en:[
          "**Voice or video is not sole proof.** Verify important requests (money, passwords) through another channel.",
          "Agree on a **secret \"code word\"** with family or your team — ask for it on an urgent call.",
          "For an unusual request (\"send money now\", \"tell me the OTP\") — the stop-and-verify rule from chapter 4 applies regardless of whose voice it is.",
          "For companies: introduce **multi-step approval** for high-value transactions; don't trust voice alone."]},
      ]},
    // ── 10: Protecting family ──────────────────────────────────────
    { uz:"Oila va keksalarni himoya qilish", en:"Protecting family & the elderly", subUz:"Eng zaif nishonlar — va ularga yordam", subEn:"The most vulnerable targets — and how to help them",
      blocks:[
        {t:"p",uz:"Ijtimoiy injeneriya faqat kompaniyalarga qaratilmagan — u eng ko'p oddiy odamlarga, ayniqsa **keksa yoshdagilar** va texnologiyadan uzoq odamlarga qaratiladi. Ular ko'proq **hurmat va ishonchga** asoslangan hujumlarga moyil.",
              en:"Social engineering doesn't only target companies — it most often targets ordinary people, especially **the elderly** and those less familiar with technology. They are more susceptible to attacks built on **respect and trust**."},
        {t:"h",n:"10.1",uz:"Keng tarqalgan sxemalar",en:"Common schemes"},
        {t:"ul",uz:[
          "**\"Nevarangiz muammoda\"** — qo'ng'iroq qiluvchi o'zini nevara yoki qarindosh qilib ko'rsatib, shoshilinch pul so'raydi.",
          "**Soxta \"texnik yordam\"** — \"kompyuteringiz virusga chalingan\", masofaviy kirish yoki to'lov so'raydi.",
          "**Soxta pensiya/nafaqa qo'ng'irog'i** — \"hujjatingizni yangilash uchun\" shaxsiy ma'lumot so'raydi.",
          "**Romantik firibgarlik** — onlayn tanishuv orqali ishonch qozonib, pul so'rash."],
          en:[
          "**\"Your grandchild is in trouble\"** — the caller poses as a grandchild or relative, urgently asking for money.",
          "**Fake \"tech support\"** — \"your computer has a virus\", asking for remote access or payment.",
          "**Fake pension/benefits call** — asking for personal data \"to update your file\".",
          "**Romance scams** — building trust via online dating, then asking for money."]},
        {t:"h",n:"10.2",uz:"Oilaviy himoya",en:"Family-level defence"},
        {t:"ul",uz:[
          "Oilangizdagi keksa a'zolar bilan **oldindan gaplashing**: \"hech qachon shoshilinch pul yoki kod so'ralganda darhol bermang, menga qo'ng'iroq qiling\".",
          "**Kod so'z** o'rnating (9-bobdagi kabi) — haqiqiy qarindosh ekanini tasdiqlash uchun.",
          "Ularga **shoshilinchlik = xavf belgisi** ekanini sodda tilda tushuntiring.",
          "Agar shubhali holat sodir bo'lsa — **ayblamang**, xotirjam yordam bering; qo'rqib, keyingi safar xabar bermasligi mumkin."],
          en:[
          "**Talk with older family members in advance**: \"if you're ever asked for urgent money or a code, don't give it — call me first\".",
          "Set up a **code word** (as in chapter 9) to confirm it's really a relative.",
          "Explain simply that **urgency = a warning sign**.",
          "If something suspicious happens — **don't blame them**, help calmly; fear of blame may stop them reporting next time."]},
      ]},
    // ── 11: Job scams ────────────────────────────────────────────────
    { uz:"Ish va rekruting firibgarligi", en:"Job & recruitment scams", subUz:"Soxta ish taklifi — pul yoki ma'lumot o'g'irlash usuli", subEn:"A fake job offer as a way to steal money or data",
      blocks:[
        {t:"p",uz:"Ish qidirish — hissiy jihatdan zaif payt, va hujumchilar buni biladi. **Soxta ish taklifi** orqali pul yoki shaxsiy ma'lumot o'g'irlash so'nggi yillarda keskin oshdi.",
              en:"Job hunting is an emotionally vulnerable time, and attackers know it. Stealing money or personal data via **fake job offers** has sharply increased in recent years."},
        {t:"h",n:"11.1",uz:"Tipik sxemalar",en:"Typical schemes"},
        {t:"ul",uz:[
          "**\"Uydan ishlash\" firibgarligi** — oson yuqori maosh va'da qilib, \"jihoz uchun\" oldindan to'lov so'raydi.",
          "**Soxta suhbat** — real kompaniya nomidan, lekin haqiqiy bo'lmagan HR bilan messenjerda \"suhbat\", so'ng shaxsiy hujjat (pasport, karta) so'raladi.",
          "**Ortiqcha chek firibgarligi** — sizga \"jihoz uchun\" katta chek yuboriladi, undan qaytim so'raladi; asl chek keyin qaytariladi (bekor bo'ladi) va siz zararga qolasiz.",
          "**Malakangizni \"tekshirish\"** — ishga qabul qilishdan oldin ijtimoiy tarmoq parolingizni yoki bank ma'lumotingizni so'rash — hech qachon qonuniy emas."],
          en:[
          "**\"Work from home\" scam** — promising easy high pay, then asking for upfront payment \"for equipment\".",
          "**Fake interview** — a messenger \"interview\" claiming to be from a real company but with a fake HR contact, followed by a request for personal documents (passport, card).",
          "**Overpayment check scam** — you're sent a large check \"for equipment\", asked to refund the difference; the original check later bounces and you're left with the loss.",
          "**\"Verifying\" your credentials** — asking for your social media password or bank details before hiring — never legitimate."]},
        {t:"note",uz:"**Belgilar:** ish uchun oldindan to'lov so'ralishi, faqat messenjer orqali suhbat (hech qanday rasmiy sayt yoki qo'ng'iroq yo'q), juda yuqori maosh oson mehnat evaziga, va shoshilinch \"hoziroq qaror qiling\" bosimi.",
              en:"**Red flags:** being asked to pay upfront for a job, an interview only via messenger (no official site or call), unusually high pay for easy work, and urgent \"decide right now\" pressure."},
        {t:"p",uz:"Himoya: kompaniyani **mustaqil ravishda** (rasmiy sayt, LinkedIn) tekshiring, hech qachon ishga oldindan pul to'lamang, va shaxsiy hujjatlarni faqat rasmiy, tasdiqlangan kanal orqali yuboring.",
              en:"Defence: verify the company **independently** (official site, LinkedIn), never pay upfront for a job, and only send personal documents through an official, verified channel."},
      ]},
    // ── 12: Awareness programs ───────────────────────────────────────
    { uz:"Xavfsizlik xabardorligi dasturi", en:"Building a security awareness program", subUz:"Tashkilotda madaniyat qanday quriladi", subEn:"How to build a culture in an organization",
      blocks:[
        {t:"p",uz:"Yagona treningda hamma narsani o'rgatib bo'lmaydi. Samarali **xavfsizlik xabardorligi dasturi** — bu davomiy jarayon, bir martalik tadbir emas.",
              en:"A single training session can't teach everything. An effective **security awareness program** is a continuous process, not a one-time event."},
        {t:"h",n:"12.1",uz:"Dastur elementlari",en:"Program elements"},
        {t:"ul",uz:[
          "**Muntazam trening** — yiliga bir marta emas, muntazam qisqa modullar (masalan har chorakda).",
          "**Simulyatsiyalangan fishing** — davriy test xatlari, natijalarni jazolamasdan tahlil qilish.",
          "**Aniq xabar berish yo'li** — bitta tugma bilan shubhali xat haqida IT'ga xabar berish.",
          "**Rahbariyat namunasi** — xavfsizlik qoidalariga rahbarlar ham amal qilishi kerak, aks holda madaniyat shakllanmaydi.",
          "**O'lchash** — necha foiz xodim simulyatsiyada aldangani, necha foizi xabar bergani kuzatiladi."],
          en:[
          "**Regular training** — not once a year, but short recurring modules (e.g. quarterly).",
          "**Simulated phishing** — periodic test emails, with results analysed rather than punished.",
          "**A clear reporting path** — flagging a suspicious email to IT with one button.",
          "**Leadership example** — executives must follow security rules too, or the culture never forms.",
          "**Measurement** — tracking what percentage of staff fell for a simulation vs. reported it."]},
        {t:"h",n:"12.2",uz:"Jazolash o'rniga o'rgatish",en:"Teach, don't punish"},
        {t:"note",uz:"Eng samarali dasturlar **jazo emas, o'rganish** madaniyatiga tayanadi: xodim simulyatsiyada aldansa, darhol qisqa, do'stona tushuntirish ko'rsatiladi — nima uchun bu fishing ekani, keyingi safar nimaga e'tibor berish kerak. Qo'rquv xodimlarni xato haqida **yashirishga**, aksincha, ochiqlik esa **tezroq xabar berishga** undaydi.",
              en:"The most effective programs rely on a culture of **learning, not punishment**: when an employee falls for a simulation, they immediately get a short, friendly explanation — why it was phishing, what to watch for next time. Fear makes employees **hide** mistakes; openness makes them **report faster**."},
      ]},
    // ── 13: Cases & next steps ──────────────────────────────────
    { uz:"Real hodisalar va keyingi qadamlar", en:"Real cases & next steps", subUz:"Ko'p uchraydigan sxemalar va qayerdan o'rganish", subEn:"Common schemes and where to learn more",
      blocks:[
        {t:"p",uz:"Ijtimoiy injeneriya — nazariy emas, **kunlik** tahdid. Mana eng ko'p uchraydigan sxemalar (umumiy, ta'lim maqsadida) — ularni tanib olsangiz, oldini olasiz:",
              en:"Social engineering is not theoretical — it's a **daily** threat. Here are the most common schemes (generic, for education) — recognise them and you can prevent them:"},
        {t:"ul",uz:[
          "**BEC (rahbar nomidan firibgarlik)** — soxta 'direktor' xatda shoshilinch pul o'tkazishni so'raydi. Himoya: ikkinchi kanal orqali tasdiq.",
          "**Texnik yordam firibgarligi** — 'Microsoft'dan qo'ng'iroq, 'kompyuteringiz zararlangan' deb masofaviy kirish so'raydi.",
          "**Hisob o'g'irlash** — fishing orqali parol olib, keyin hisobdan boshqalarga hujum qiladi.",
          "**Sovg'a/yutuq firibgarligi** — 'siz yutdingiz', 'bepul sovg'a' — shaxsiy ma'lumot yoki to'lov so'raydi."],
          en:[
          "**BEC (CEO fraud)** — a fake 'director' email urgently requests a money transfer. Defence: confirm via a second channel.",
          "**Tech-support scam** — a call 'from Microsoft' claims your computer is infected and asks for remote access.",
          "**Account takeover** — a password stolen by phishing is then used to attack others from that account.",
          "**Prize/gift scam** — 'you won', 'free gift' — asks for personal data or a payment."]},
        {t:"h",n:"7.1",uz:"Yodda tuting",en:"Remember"},
        {t:"note",uz:"Bitta jumla bilan: **shoshtirilsangiz — to'xtang, tekshiring.** Aksariyat ijtimoiy injeneriya hujumlari sizni o'ylashdan to'xtatishga tayanadi. Sekinlashish — eng kuchli himoyangiz.",
              en:"In one sentence: **if you're being rushed — stop and verify.** Most social engineering attacks rely on stopping you from thinking. Slowing down is your strongest defence."},
        {t:"h",n:"7.2",uz:"Qayerdan o'rganish",en:"Where to learn more"},
        {t:"p",uz:"Chuqurroq o'rganish uchun ochiq va ishonchli manbalar: **CISA** (AQSH kiberxavfsizlik agentligi) xabardorlik qo'llanmalari, **NIST** xavfsizlik xabardorligi standartlari, va **OWASP** materiallari. Amaliy tomon — Kali modulidagi **L28: Social Engineering (SET)** darsi.",
              en:"For deeper study, open and trusted sources: **CISA** (US cybersecurity agency) awareness guides, **NIST** security-awareness standards, and **OWASP** materials. For the practical side — the **L28: Social Engineering (SET)** lesson in the Kali module."},
        {t:"colophon"},
      ]},
  ],
};

// ═══════════════════════════════════════════════════════════════
//  BOOK DATA — Cryptography basics. Original bilingual explanation
//  of universal, factual cryptographic concepts; open standards
//  (NIST, OWASP) credited.
// ═══════════════════════════════════════════════════════════════
const CRYPTO_BOOK={
  id:"crypto",
  titleUz:"Kriptografiya asoslari",
  titleEn:"Cryptography basics",
  author:"Original (ochiq manbalar asosida)",
  authorUz:"Original material (ochiq manbalar asosida)",
  authorEn:"Original material (based on open references)",
  license:"CC BY-SA 4.0",
  coverAbbr:"CR", coverBy:"Asoslar", coverIcon:"lock",
  refs:[
    {label:"NIST CSRC — Cryptographic Standards",href:"https://csrc.nist.gov/"},
    {label:"OWASP — Cryptographic Storage Cheat Sheet",href:"https://owasp.org/"},
  ],
  noteUz:"Bu — original o'quv material; kriptografiyaning universal, ilmiy tushunchalari o'z so'zlarim bilan yozilgan. Ochiq standartlar (NIST, OWASP) asosida, CC BY-SA 4.0 litsenziyasida.",
  noteEn:"This is original educational material; the universal, scientific concepts of cryptography are written in my own words. Based on open standards (NIST, OWASP), under CC BY-SA 4.0.",
  descUz:"Ma'lumotni matematika bilan himoyalash: simmetrik va asimmetrik shifrlash, xeshlash, raqamli imzo va sertifikatlar. Har bir tushuncha sodda misollar bilan.",
  descEn:"Protecting data with mathematics: symmetric and asymmetric encryption, hashing, digital signatures and certificates. Every concept with simple examples.",
  chapters:[
    { uz:"Muqaddima", en:"Preface", subUz:"Kriptografiya nima uchun kerak", subEn:"Why cryptography matters",
      blocks:[
        {t:"p",uz:"**Kriptografiya** — ma'lumotni matematik usullar bilan himoyalash fani. U uchta narsani ta'minlaydi: **maxfiylik** (faqat kerakli odam o'qiy oladi), **butunlik** (ma'lumot o'zgartirilmagan) va **autentlik** (kim yuborganini isbotlash).",
              en:"**Cryptography** is the science of protecting information using mathematics. It provides three things: **confidentiality** (only the intended person can read), **integrity** (the data hasn't been altered) and **authenticity** (proving who sent it)."},
        {t:"colophon"},
        {t:"note",uz:"Kriptografiya bugungi internetning poydevori: HTTPS, parollar, bank kartalari, xabar almashish ilovalari — barchasi shu asosda ishlaydi.",
              en:"Cryptography is the foundation of today's internet: HTTPS, passwords, bank cards, messaging apps — all rely on it."},
      ]},
    { uz:"Simmetrik shifrlash", en:"Symmetric encryption", subUz:"Bitta maxfiy kalit", subEn:"One shared secret key",
      blocks:[
        {t:"p",uz:"**Simmetrik shifrlashda** shifrlash va deshifrlash uchun **bitta xil kalit** ishlatiladi. Eng mashhur zamonaviy algoritm — **AES**. U juda tez va katta ma'lumotlarni himoyalash uchun ideal.",
              en:"In **symmetric encryption**, the **same single key** is used for both encryption and decryption. The most popular modern algorithm is **AES**. It is very fast and ideal for protecting large amounts of data."},
        {t:"pipe",steps:[
          {ic:"code",tUz:"Ochiq matn",tEn:"Plaintext",sUz:"\"Salom\"",sEn:"\"Hello\""},
          {ic:"lock",tUz:"Shifrlash",tEn:"Encrypt",sUz:"kalit bilan",sEn:"with key"},
          {ic:"database",tUz:"Shifrmatn",tEn:"Ciphertext",sUz:"o'qib bo'lmas",sEn:"unreadable"}]},
        {t:"p",uz:"Muammo: shifrlangan xabarni yuborishdan oldin, ikkala tomon ham **bir xil maxfiy kalitni** bilishi kerak. Bu kalitni xavfsiz almashish — simmetrik shifrlashning asosiy qiyinchiligi.",
              en:"The problem: before sending an encrypted message, both parties must know the **same secret key**. Exchanging that key securely is the main challenge of symmetric encryption."},
      ]},
    { uz:"Asimmetrik shifrlash", en:"Asymmetric encryption", subUz:"Ochiq va maxfiy kalit jufti", subEn:"A public and private key pair",
      blocks:[
        {t:"p",uz:"**Asimmetrik shifrlash** kalit almashish muammosini hal qiladi. Har bir odamda **ikkita kalit** bor: **ochiq kalit** (hammaga beriladi) va **maxfiy kalit** (hech kimga berilmaydi). Ochiq kalit bilan shifrlangan narsani faqat mos maxfiy kalit ocha oladi.",
              en:"**Asymmetric encryption** solves the key-exchange problem. Each person has **two keys**: a **public key** (given to everyone) and a **private key** (never shared). Whatever is encrypted with the public key can only be opened by the matching private key."},
        {t:"p",uz:"Mashhur algoritmlar — **RSA** va **ECC** (elliptik egri chiziqlar). Ular simmetrik shifrlashdan sekinroq, shuning uchun amalda ko'pincha ikkalasi birga ishlatiladi: asimmetrik bilan kalit xavfsiz almashinadi, keyin tez simmetrik AES bilan ma'lumot shifrlanadi.",
              en:"Popular algorithms are **RSA** and **ECC** (elliptic curves). They are slower than symmetric encryption, so in practice both are often used together: the key is exchanged securely with asymmetric crypto, then the data is encrypted with fast symmetric AES."},
        {t:"note",uz:"Aynan shu tamoyil **HTTPS** da ishlaydi: brauzer va server avval asimmetrik usulda umumiy kalit kelishib oladi, keyin butun aloqa tez simmetrik shifrda davom etadi.",
              en:"This exact principle works in **HTTPS**: the browser and server first agree on a shared key asymmetrically, then the whole connection continues with fast symmetric encryption."},
      ]},
    { uz:"Xesh funksiyalar", en:"Hash functions", subUz:"Bir tomonlama barmoq izi", subEn:"A one-way fingerprint",
      blocks:[
        {t:"p",uz:"**Xesh funksiya** har qanday ma'lumotdan qat'iy uzunlikdagi noyob \"barmoq izi\" — **xesh** hosil qiladi. Uch muhim xususiyati bor: **bir tomonlama** (xeshdan asl ma'lumotni tiklab bo'lmaydi), **deterministik** (bir xil kirish → bir xil xesh) va kichik o'zgarish ham xeshni butunlay o'zgartiradi.",
              en:"A **hash function** turns any data into a fixed-length unique \"fingerprint\" — the **hash**. It has three key properties: it is **one-way** (you cannot recover the original data from the hash), **deterministic** (same input → same hash), and even a tiny change completely alters the hash."},
        {t:"code",lang:"text",cap:{uz:"SHA-256 misoli — kichik o'zgarish, butunlay boshqa xesh",en:"SHA-256 example — small change, completely different hash"},lines:[
          "\"salom\"   -> 2b9f...c1a4   (namuna)",
          "\"Salom\"   -> 8e21...77bf   (faqat bosh harf o'zgardi)"]},
        {t:"p",uz:"Xesh funksiyalar (masalan **SHA-256**) **butunlikni** tekshirish (fayl o'zgarmaganini isbotlash) va **parollarni saqlash** uchun ishlatiladi — server parolni emas, uning xeshini saqlaydi.",
              en:"Hash functions (e.g. **SHA-256**) are used to check **integrity** (proving a file hasn't changed) and to **store passwords** — the server stores the hash, not the password itself."},
      ]},
    { uz:"Raqamli imzo va sertifikatlar", en:"Digital signatures & certificates", subUz:"Kim yuborganini isbotlash", subEn:"Proving who sent it",
      blocks:[
        {t:"p",uz:"**Raqamli imzo** — asimmetrik kriptografiyaning teskari qo'llanilishi. Yuboruvchi xabarni o'z **maxfiy kaliti** bilan imzolaydi; har kim uning **ochiq kaliti** bilan imzoni tekshira oladi. Bu **autentlik** (haqiqatan o'sha odam yuborgan) va **butunlik**ni isbotlaydi.",
              en:"A **digital signature** is the reverse use of asymmetric cryptography. The sender signs a message with their **private key**; anyone can verify the signature with their **public key**. This proves **authenticity** (it really came from that person) and **integrity**."},
        {t:"p",uz:"Lekin ochiq kalit haqiqatan o'sha odamnikimi? Buni **sertifikatlar** va **PKI** (ochiq kalit infratuzilmasi) hal qiladi. Ishonchli **sertifikat markazi (CA)** kalit egasining kimligini tasdiqlaydi. Brauzeringiz HTTPS saytga kirganda aynan shu sertifikatni tekshiradi.",
              en:"But is the public key really that person's? **Certificates** and **PKI** (public key infrastructure) solve this. A trusted **certificate authority (CA)** confirms the identity of the key's owner. Your browser checks exactly this certificate when you visit an HTTPS site."},
      ]},
    { uz:"Kalit almashish: Diffie-Hellman", en:"Key exchange: Diffie-Hellman", subUz:"Ochiq kanalda birgalikda maxfiy son yaratish", subEn:"Agreeing on a shared secret over an open channel",
      blocks:[
        {t:"p",uz:"3-bobda \"kalitni qanday xavfsiz almashish kerak\" degan muammoni eslatgan edik. **Diffie-Hellman (DH)** — bu muammoni hal qiluvchi, 1976-yilda kashf etilgan ajoyib matematik g'oya: ikki taraf, ochiq (hatto kuzatilayotgan) kanal orqali gaplashib turib ham, tashqi kuzatuvchi bilolmaydigan **umumiy maxfiy sonni** yaratishi mumkin.",
              en:"In chapter 3 we mentioned the problem of how to safely exchange a key. **Diffie-Hellman (DH)**, discovered in 1976, is the brilliant mathematical idea that solves this: two parties, talking over an open (even monitored) channel, can create a **shared secret number** that an outside observer cannot determine."},
        {t:"h",n:"§",uz:"Bo'yoq metafora",en:"The paint-mixing metaphor"},
        {t:"p",uz:"Klassik tushuntirish: ikkalasi ham bir xil **umumiy rang** (masalan sariq) bilan boshlaydi. Har biri o'ziga **maxfiy rang** qo'shib, natijani ochiq almashadi (bu aralashmani orqaga ajratish amalda mumkin emas). Keyin har biri o'ziga kelgan aralashmaga o'z maxfiy rangini yana qo'shadi — ikkalasida ham **bir xil yakuniy rang** hosil bo'ladi, garchi hech kim ikkinchi tomonning maxfiy rangini bilmasa ham.",
              en:"The classic explanation: both start with the same **public colour** (say, yellow). Each adds their own **secret colour** and openly exchanges the result (unmixing the blend is practically impossible). Then each adds their own secret colour again to what they received — both end up with the **same final colour**, even though neither knows the other's secret colour."},
        {t:"p",uz:"Matematikada bo'yoq o'rniga **modulli daraja olish** (modular exponentiation) ishlatiladi — bir yo'nalishda oson, teskarisiga (**diskret logarifm**) esa amalda imkonsiz darajada qiyin hisoblash. Aynan shu qiyinlik DH'ning xavfsizligini ta'minlaydi.",
              en:"In mathematics, instead of paint, **modular exponentiation** is used — easy in one direction, but practically impossible to reverse (the **discrete logarithm problem**). This exact difficulty is what makes DH secure."},
        {t:"note",uz:"Zamonaviy **ECC** (elliptik egri chiziqlar) versiyasi — **ECDH** — xuddi shu g'oyani qo'llaydi, lekin kichikroq kalitlar bilan tezroq ishlaydi. Deyarli barcha zamonaviy HTTPS ulanishlari ECDH ishlatadi.",
              en:"The modern **ECC** (elliptic curve) version — **ECDH** — applies the same idea but works faster with smaller keys. Nearly all modern HTTPS connections use ECDH."},
      ]},
    { uz:"TLS/HTTPS qo'l siqishuvi", en:"The TLS/HTTPS handshake", subUz:"Brauzer va server bir necha millisekundda nima kelishadi", subEn:"What a browser and server agree on in milliseconds",
      blocks:[
        {t:"p",uz:"Har safar HTTPS sayt ochganingizda, ko'zga ko'rinmas holda **TLS qo'l siqishuvi (handshake)** sodir bo'ladi — bu kitobdagi barcha g'oyalarni (kalit almashish, sertifikatlar, simmetrik shifrlash) bir necha millisekundda birlashtiradigan jarayon.",
              en:"Every time you open an HTTPS site, an invisible **TLS handshake** happens — a process that combines every idea in this book (key exchange, certificates, symmetric encryption) in a few milliseconds."},
        {t:"pipe",steps:[
          {ic:"send",tUz:"Salom",tEn:"Hello",sUz:"brauzer imkoniyatlarini yuboradi",sEn:"browser sends capabilities"},
          {ic:"shieldCheck",tUz:"Sertifikat",tEn:"Certificate",sUz:"server o'zini tasdiqlaydi",sEn:"server proves identity"},
          {ic:"key",tUz:"Kalit almashish",tEn:"Key exchange",sUz:"ECDH bilan umumiy kalit",sEn:"shared key via ECDH"},
          {ic:"lock",tUz:"Shifrlangan aloqa",tEn:"Encrypted session",sUz:"tez AES bilan davom etadi",sEn:"continues with fast AES"}]},
        {t:"h",n:"§",uz:"Qadamlar",en:"The steps"},
        {t:"ul",uz:[
          "**1) Salomlashuv.** Brauzer qo'llab-quvvatlaydigan shifrlash usullari ro'yxatini yuboradi; server eng mosini tanlaydi.",
          "**2) Sertifikat.** Server o'z sertifikatini (4-bob) yuboradi — brauzer uni ishonchli CA orqali tekshiradi.",
          "**3) Kalit almashish.** Ikkala tomon ECDH orqali (o'sha bobdagi kabi) faqat shu **sessiya uchun** umumiy maxfiy kalit yaratadi.",
          "**4) Simmetrik shifrlashga o'tish.** Endi ikkalasi ham tez AES bilan butun aloqani shifrlaydi — asimmetrik kriptografiya faqat kalitni kelishish uchun ishlatildi (3-bobdagi tamoyil)."],
          en:[
          "**1) Hello.** The browser sends a list of encryption methods it supports; the server picks the best match.",
          "**2) Certificate.** The server sends its certificate (chapter 4) — the browser verifies it through a trusted CA.",
          "**3) Key exchange.** Both sides use ECDH (as in that chapter) to derive a shared secret key just for **this session**.",
          "**4) Switch to symmetric.** Now both sides encrypt the whole connection with fast AES — asymmetric crypto was only used to agree on the key (the principle from chapter 3)."]},
        {t:"note",uz:"**Forward secrecy** (oldinga siljigan maxfiylik): har sessiya uchun **yangi** vaqtinchalik kalit yaratiladi. Agar hujumchi kelajakda serverning doimiy maxfiy kalitini o'g'irlasa ham, o'tgan sessiyalarni deshifrlay olmaydi — chunki ular allaqachon yo'q qilingan vaqtinchalik kalitlarga bog'liq edi.",
              en:"**Forward secrecy**: a **new** temporary key is generated for every session. Even if an attacker steals the server's long-term private key in the future, they cannot decrypt past sessions — because those depended on temporary keys that are already gone."},
      ]},
    { uz:"Blok shifr rejimlari", en:"Block cipher modes", subUz:"AES o'zi yetarli emas — uni qanday qo'llash muhim", subEn:"AES alone isn't enough — how you apply it matters",
      blocks:[
        {t:"p",uz:"AES bir vaqtning o'zida faqat **16 baytlik blok**ni shifrlaydi. Katta ma'lumotni shifrlash uchun bu bloklarni qanday **bog'lash** kerak — bu **rejim (mode)** deb ataladi, va noto'g'ri rejim tanlash butun himoyani buzishi mumkin.",
              en:"AES only encrypts a **16-byte block** at a time. How you **chain** these blocks together to encrypt larger data is called a **mode**, and choosing the wrong mode can break the entire protection."},
        {t:"h",n:"§",uz:"ECB — nega xavfli",en:"ECB — why it's dangerous"},
        {t:"p",uz:"**ECB (Electronic Codebook)** — eng oddiy, lekin **xavfli** rejim: har bir blok bir-biridan mustaqil, bir xil kalit bilan shifrlanadi. Muammo: **bir xil ochiq matn blogi — doim bir xil shifrmatn** beradi. Natijada, agar rasmni ECB bilan shifrlasangiz, rasmning **konturlari shifrlangan holda ham ko'rinib qoladi** — chunki bir xil rang bloklari bir xil shifrlangan bloklar beradi.",
              en:"**ECB (Electronic Codebook)** is the simplest but **dangerous** mode: each block is encrypted independently with the same key. The problem: **the same plaintext block always produces the same ciphertext block**. As a result, if you encrypt an image with ECB, the image's **outlines remain visible even encrypted** — because identical colour blocks produce identical encrypted blocks."},
        {t:"h",n:"§",uz:"CBC va GCM",en:"CBC and GCM"},
        {t:"p",uz:"**CBC (Cipher Block Chaining)** har blokni oldingi shifrlangan blok bilan \"aralashtirib\" oladi (bu uchun **IV** — boshlang'ich vektor — kerak), shuning uchun bir xil bloklar endi turlicha ko'rinadi. Zamonaviy tavsiya esa — **GCM (Galois/Counter Mode)**: u nafaqat shifrlaydi, balki ma'lumot **o'zgartirilmaganini** ham tasdiqlaydi (bu — **autentifikatsiyalangan shifrlash**, AEAD). HTTPS va ko'pgina zamonaviy tizimlar aynan GCM ishlatadi.",
              en:"**CBC (Cipher Block Chaining)** mixes each block with the previous encrypted block (requiring an **IV** — initialization vector), so identical blocks now look different. The modern recommendation is **GCM (Galois/Counter Mode)**: it not only encrypts but also confirms the data **hasn't been tampered with** (this is **authenticated encryption**, AEAD). HTTPS and most modern systems use GCM."},
        {t:"note",warn:true,uz:"**Hech qachon ECB ishlatmang** — bu eng ko'p uchraydigan kriptografiya xatolaridan biri. Zamonaviy kutubxonalar odatda to'g'ri rejimni (GCM) avtomatik tanlaydi — shuning uchun 5-bobdagi qoida yana takrorlanadi: o'zingiz \"pastroq darajada\" tanlov qilmang.",
              en:"**Never use ECB** — it's one of the most common cryptography mistakes. Modern libraries usually pick the right mode (GCM) automatically — reinforcing the rule from chapter 5: don't make \"low-level\" choices yourself."},
      ]},
    { uz:"Tasodifiy sonlar", en:"Random number generation", subUz:"Kriptografiyaning yashirin poydevori", subEn:"Cryptography's hidden foundation"    ,
      blocks:[
        {t:"p",uz:"Deyarli har bir kriptografik amal — kalit yaratish, IV, tuz (keyingi kitobda) — **tasodifiy sonlarga** tayanadi. Agar tasodif **bashorat qilinadigan** bo'lsa, butun tizim buziladi — algoritmning o'zi mustahkam bo'lsa ham.",
              en:"Almost every cryptographic operation — generating a key, an IV, a salt (in the next book) — relies on **random numbers**. If the randomness is **predictable**, the whole system breaks — even if the algorithm itself is strong."},
        {t:"h",n:"§",uz:"Oddiy tasodif yetarli emas",en:"Ordinary randomness isn't enough"},
        {t:"p",uz:"Dasturlash tillaridagi oddiy `random()` funksiyalari **PRNG** (psevdo-tasodifiy generator) — tezkor, lekin **bashorat qilinadigan** (agar boshlang'ich qiymatini bilsangiz, keyingi barcha sonlarni hisoblab chiqarish mumkin). Kriptografiya uchun esa **CSPRNG** (kriptografik jihatdan xavfsiz PRNG) kerak — u operatsion tizimning apparat shovqini (sichqoncha harakati, disk vaqti va h.k.) asosida ishlaydi va bashorat qilib bo'lmaydi.",
              en:"The plain `random()` functions in programming languages are **PRNGs** (pseudo-random generators) — fast but **predictable** (if you know the seed, you can compute all subsequent numbers). Cryptography needs a **CSPRNG** (cryptographically secure PRNG) — it draws on the operating system's hardware noise (mouse movement, disk timing, etc.) and cannot be predicted."},
        {t:"note",warn:true,uz:"Real hodisa sinfi: ba'zi tizimlar zaif yoki takrorlanuvchi tasodif manbasidan foydalanganda, hosil bo'lgan \"maxfiy\" kalitlar aslida **bashorat qilinadigan** bo'lib chiqqan — bu kriptografiyaning o'zi emas, balki uni noto'g'ri qo'llashning oqibati.",
              en:"A real class of incidents: when systems used a weak or repeating source of randomness, the resulting \"secret\" keys turned out to be **predictable** — not a flaw in cryptography itself, but a consequence of applying it incorrectly."},
        {t:"p",uz:"Amaliy qoida: kriptografik kalit yoki tuz kerak bo'lsa, har doim tilning **maxsus kriptografik** tasodif funksiyasidan foydalaning (masalan `crypto.randomBytes` yoki `secrets` moduli), oddiy `random()` dan emas.",
              en:"Practical rule: whenever you need a cryptographic key or salt, always use the language's **dedicated cryptographic** random function (e.g. `crypto.randomBytes` or the `secrets` module), never plain `random()`."},
      ]},
    { uz:"Keng tarqalgan xatolar", en:"Common mistakes & attacks", subUz:"Algoritm mustahkam, qo'llash zaif", subEn:"Strong algorithm, weak implementation",
      blocks:[
        {t:"p",uz:"Deyarli barcha real kriptografik buzilishlar algoritmning o'zida emas, balki uni **qo'llashda** yuz beradi. Eng keng tarqalgan xatolarni bilish — ularni oldini olishga yordam beradi.",
              en:"Almost every real-world cryptographic break happens not in the algorithm itself, but in how it's **applied**. Knowing the most common mistakes helps you avoid them."},
        {t:"ul",uz:[
          "**IV/nonce'ni qayta ishlatish** — bir xil IV bilan ikki marta shifrlash ko'p rejimlarda maxfiylikni butunlay yo'qqa chiqaradi.",
          "**O'zi yozgan algoritm** — \"maxfiy\" shaxsiy shifrlash usuli deyarli har doim buziladi; ochiq, ko'plab tekshiruvdan o'tgan algoritmlar ishonchliroq.",
          "**Xato kalit uzunligi** — juda qisqa kalit (masalan eski 56-bitli DES) zamonaviy hisoblash quvvati bilan tezda buziladi.",
          "**Padding oracle** — shifrlangan ma'lumot xato xabarlaridan (\"padding noto'g'ri\") foydalanib, bosqichma-bosqich deshifrlash mumkin bo'lgan holatlar; shuning uchun GCM kabi autentifikatsiyalangan rejimlar afzal."],
          en:[
          "**Reusing an IV/nonce** — encrypting twice with the same IV completely destroys confidentiality in many modes.",
          "**Home-grown algorithms** — a \"secret\" proprietary cipher is almost always broken; open, heavily reviewed algorithms are more trustworthy.",
          "**Wrong key length** — a key that's too short (e.g. old 56-bit DES) falls quickly to modern computing power.",
          "**Padding oracle** — cases where error messages (\"padding invalid\") let an attacker decrypt data step by step; this is why authenticated modes like GCM are preferred."]},
        {t:"note",uz:"Umumiy xulosa: kriptografiyada eng katta xavf **matematika emas, muhandislik**. Sinovdan o'tgan kutubxona + to'g'ri rejim + xavfsiz tasodif = mustahkam himoya.",
              en:"The overall lesson: in cryptography, the biggest risk is **engineering, not mathematics**. A tested library + the right mode + secure randomness = solid protection."},
      ]},
    { uz:"Uchdan-uchgacha shifrlangan xabarlashuv", en:"End-to-end encrypted messaging", subUz:"Signal, WhatsApp va boshqalar qanday ishlaydi", subEn:"How Signal, WhatsApp and others work",
      blocks:[
        {t:"p",uz:"**Uchdan-uchgacha shifrlash (E2EE)** — bu kitobning barcha g'oyalarini jonli qo'llaydigan yakuniy misol: xabar yuboruvchi qurilmada shifrlanadi va **faqat qabul qiluvchi qurilmada** ochiladi — hatto xizmat provayderi (masalan messenjer kompaniyasi) ham matnni o'qiy olmaydi.",
              en:"**End-to-end encryption (E2EE)** is the final example applying every idea in this book: a message is encrypted on the sender's device and decrypted **only on the recipient's device** — even the service provider (e.g. the messaging company) cannot read the text."},
        {t:"h",n:"§",uz:"Signal protokoli — asosiy g'oya",en:"The Signal protocol — the core idea"},
        {t:"p",uz:"Ko'plab zamonaviy messenjerlar (Signal, WhatsApp) **Signal protokoli**dan foydalanadi. Uning kalit g'oyasi — **Double Ratchet**: har bir yangi xabar uchun **yangi shifrlash kaliti** hisoblanadi (avvalgi kalitlardan matematik jihatdan kelib chiqib, lekin ularni orqaga hisoblab bo'lmaydi). Natija: agar bitta xabar kaliti hujumchiga o'g'irlansa ham, u faqat **o'sha bitta xabarni** ocha oladi — na oldingi, na keyingi xabarlarni.",
              en:"Many modern messengers (Signal, WhatsApp) use the **Signal protocol**. Its key idea is the **Double Ratchet**: a **new encryption key** is derived for every message (mathematically derived from previous keys, but not computable backward from them). The result: even if one message's key is stolen, an attacker can only decrypt **that single message** — not earlier or later ones."},
        {t:"p",uz:"Bu — 6-bobdagi **forward secrecy** g'oyasining eng kuchli qo'llanilishi, hatto \"future secrecy\" bilan birga: kelajakdagi xabarlar ham o'tmishdagi kalit sizib chiqishidan himoyalangan.",
              en:"This is the strongest application of the **forward secrecy** idea from the TLS chapter, combined with \"future secrecy\": future messages are also protected even if a past key leaks."},
        {t:"note",uz:"Amaliy maslahat: xabar almashish ilovasi tanlaganda, \"uchdan-uchgacha shifrlangan\" degan da'voni tekshiring — ba'zi xizmatlar faqat **transport** shifrlashini (server bilan sizning oralig'ingizda, lekin serverning o'zida ochiq) taklif qiladi, bu xuddi shu narsa emas.",
              en:"Practical advice: when choosing a messaging app, verify the claim of \"end-to-end encryption\" — some services only offer **transport** encryption (between you and the server, but readable on the server itself), which is not the same thing."},
      ]},
    { uz:"Amaliy maslahatlar", en:"Practical advice", subUz:"Keng tarqalgan xatolar va to'g'ri yondashuv", subEn:"Common mistakes and the right approach",
      blocks:[
        {t:"note",warn:true,uz:"**Eng muhim qoida: o'zingiz kriptografiya algoritmi yozmang.** Kriptografiya nihoyatda nozik — kichik xato butun himoyani buzadi. Har doim sinovdan o'tgan, ishonchli kutubxonalarni ishlating.",
              en:"**The most important rule: don't write your own cryptographic algorithm.** Cryptography is extremely delicate — a small mistake breaks the whole protection. Always use tested, trusted libraries."},
        {t:"ul",uz:[
          "Zamonaviy algoritmlarni tanlang: **AES** (simmetrik), **RSA/ECC** (asimmetrik), **SHA-256** (xesh).",
          "Eskirgan algoritmlardan qoching: **MD5**, **SHA-1**, **DES** — ular buzilgan.",
          "**Kalit boshqaruvi** — eng qiyin qism: kalitlarni xavfsiz saqlash va almashtirish.",
          "Parollar uchun oddiy xesh emas, maxsus **bcrypt / Argon2** ni ishlating (keyingi kitobda)."],
          en:[
          "Choose modern algorithms: **AES** (symmetric), **RSA/ECC** (asymmetric), **SHA-256** (hash).",
          "Avoid outdated algorithms: **MD5**, **SHA-1**, **DES** — they are broken.",
          "**Key management** is the hardest part: storing and rotating keys securely.",
          "For passwords, use dedicated **bcrypt / Argon2**, not a plain hash (see the next book)."]},
        {t:"colophon"},
      ]},
  ],
};

// ═══════════════════════════════════════════════════════════════
//  BOOK DATA — Passwords & authentication. Original, defence-oriented.
// ═══════════════════════════════════════════════════════════════
const AUTH_BOOK={
  id:"auth",
  titleUz:"Parollar va autentifikatsiya xavfsizligi",
  titleEn:"Password & authentication security",
  author:"Original (ochiq manbalar asosida)",
  authorUz:"Original material (ochiq manbalar asosida)",
  authorEn:"Original material (based on open references)",
  license:"CC BY-SA 4.0",
  coverAbbr:"AU", coverBy:"Parol", coverIcon:"key",
  refs:[
    {label:"NIST SP 800-63B — Digital Identity Guidelines",href:"https://pages.nist.gov/800-63-3/"},
    {label:"OWASP — Authentication Cheat Sheet",href:"https://owasp.org/"},
  ],
  noteUz:"Bu — himoya uchun original material. Maqsad — parol va autentifikatsiyani to'g'ri sozlash. Ochiq manbalar (NIST SP 800-63, OWASP) asosida, CC BY-SA 4.0.",
  noteEn:"This is original defence material. Its goal is to set up passwords and authentication correctly. Based on open references (NIST SP 800-63, OWASP), under CC BY-SA 4.0.",
  descUz:"Parol qanday buziladi va undan qanday himoyalanish: kuchli parollar, parol menejeri, xeshlash va tuz, ko'p faktorli autentifikatsiya (MFA) va passkey'lar.",
  descEn:"How passwords get cracked and how to defend: strong passwords, password managers, hashing and salt, multi-factor authentication (MFA) and passkeys.",
  chapters:[
    { uz:"Muqaddima", en:"Preface", subUz:"Autentifikatsiya — kimligingizni isbotlash", subEn:"Authentication — proving who you are",
      blocks:[
        {t:"p",uz:"**Autentifikatsiya** — tizimga \"men haqiqatan o'shaman\" deb isbotlash jarayoni. U uch xil dalilga tayanadi: **nimani bilasiz** (parol), **nimaga egasiz** (telefon, kalit) va **kimsiz** (barmoq izi, yuz). Parol — eng keng tarqalgan, lekin eng zaif usul.",
              en:"**Authentication** is the process of proving to a system \"I really am who I claim to be\". It relies on three kinds of evidence: **something you know** (a password), **something you have** (a phone, a key) and **something you are** (fingerprint, face). Passwords are the most common but the weakest method."},
        {t:"colophon"},
      ]},
    { uz:"Parol qanday buziladi", en:"How passwords get cracked", subUz:"Hujum usullarini bilib, himoyani tushunish", subEn:"Understand defence by knowing the attacks",
      blocks:[
        {t:"p",uz:"Parolni himoyalash uchun avval u qanday buzilishini bilish kerak. Asosiy usullar:",
              en:"To protect a password, first understand how it gets broken. The main methods:"},
        {t:"ul",uz:[
          "**Brute-force** — barcha mumkin bo'lgan kombinatsiyalarni sinash. Qisqa parollar soniya ichida buziladi.",
          "**Dictionary (lug'at)** — keng tarqalgan parollar ro'yxatini sinash ('123456', 'parol').",
          "**Credential stuffing** — bir saytdan o'g'irlangan parolni boshqa saytlarda sinash (odamlar parolni takrorlaydi).",
          "**Ma'lumot bazasi sizib chiqishi** — buzilgan saytdan millionlab parol xeshlari o'g'irlanadi."],
          en:[
          "**Brute-force** — trying all possible combinations. Short passwords fall in seconds.",
          "**Dictionary** — trying a list of common passwords ('123456', 'password').",
          "**Credential stuffing** — trying a password stolen from one site on other sites (people reuse passwords).",
          "**Database leaks** — millions of password hashes are stolen from a breached site."]},
        {t:"note",uz:"Shuning uchun **har bir sayt uchun alohida parol** — eng muhim qoida: bitta sayt buzilsa, qolganlari xavfsiz qoladi.",
              en:"That's why a **unique password for every site** is the most important rule: if one site is breached, the others stay safe."},
      ]},
    { uz:"Kuchli parol va parol menejeri", en:"Strong passwords & password managers", subUz:"Uzunlik murakkablikdan muhimroq", subEn:"Length matters more than complexity",
      blocks:[
        {t:"p",uz:"Yaxshi parol — **uzun** parol. Zamonaviy tavsiya: murakkab, esda qolmaydigan 'P@ss1!' o'rniga, uzun lekin oson **parol-ibora** (passphrase) ishlating: bir nechta tasodifiy so'z. Uzunlik brute-force'ni eksponensial qiyinlashtiradi.",
              en:"A good password is a **long** password. Modern guidance: instead of a complex, unmemorable 'P@ss1!', use a long but easy **passphrase**: several random words. Length makes brute-force exponentially harder."},
        {t:"p",uz:"Lekin o'nlab uzun, noyob parolni eslab bo'lmaydi. Yechim — **parol menejeri**: u har sayt uchun kuchli, noyob parol yaratadi va shifrlangan holda saqlaydi. Siz faqat bitta asosiy parolni eslaysiz.",
              en:"But you can't memorize dozens of long, unique passwords. The solution is a **password manager**: it generates a strong, unique password for each site and stores them encrypted. You only remember one master password."},
        {t:"ul",uz:[
          "Uzunlik **kamida 12–16 belgi** (parol-ibora yaxshiroq).",
          "**Har saytga alohida** parol.",
          "**Parol menejeri** ishlating (masalan ochiq kodli variantlar bor).",
          "Shaxsiy ma'lumot (tug'ilgan sana, ism) — parol emas."],
          en:[
          "Length **at least 12–16 characters** (a passphrase is better).",
          "A **unique** password per site.",
          "Use a **password manager** (open-source options exist).",
          "Personal info (birthday, name) is not a password."]},
      ]},
    { uz:"Server tomoni: xeshlash va tuz", en:"Server side: hashing & salt", subUz:"Parollarni hech qachon ochiq saqlamang", subEn:"Never store passwords in plaintext",
      blocks:[
        {t:"p",uz:"Yaxshi sayt sizning parolingizni **hech qachon ochiq (plaintext) saqlamaydi**. Uning o'rniga parolning **xeshini** saqlaydi. Siz kirganda, kiritgan parolingiz xeshlanadi va saqlangan xesh bilan solishtiriladi.",
              en:"A good site **never stores your password in plaintext**. Instead it stores the password's **hash**. When you log in, your entered password is hashed and compared with the stored hash."},
        {t:"p",uz:"Ammo oddiy xesh yetarli emas. **Tuz (salt)** — har parolga qo'shiladigan noyob tasodifiy qiymat — bir xil parollar bir xil xesh bermasligini ta'minlaydi va oldindan tayyorlangan jadval hujumlarini (rainbow table) to'xtatadi. Parollar uchun maxsus, ataylab **sekin** algoritmlar ishlatiladi: **bcrypt**, **scrypt** yoki **Argon2**.",
              en:"But a plain hash isn't enough. A **salt** — a unique random value added to each password — ensures identical passwords don't produce identical hashes and stops precomputed-table (rainbow table) attacks. For passwords, deliberately **slow** algorithms are used: **bcrypt**, **scrypt** or **Argon2**."},
        {t:"note",warn:true,uz:"Parollar uchun **MD5** yoki oddiy **SHA-256** ni ishlatmang — ular juda tez, ya'ni brute-force uchun oson. **bcrypt/Argon2** ataylab sekin qilingan.",
              en:"Don't use **MD5** or plain **SHA-256** for passwords — they are too fast, i.e. easy to brute-force. **bcrypt/Argon2** are deliberately slow."},
      ]},
    { uz:"Ko'p faktorli autentifikatsiya (MFA)", en:"Multi-factor authentication (MFA)", subUz:"Paroldan tashqari ikkinchi qatlam", subEn:"A second layer beyond the password",
      blocks:[
        {t:"p",uz:"**MFA (ko'p faktorli autentifikatsiya)** — paroldan tashqari yana bir dalil so'raydi. Parol o'g'irlansa ham, hujumchi ikkinchi faktorsiz kira olmaydi. Bu — hisobingizni himoyalashning eng samarali usullaridan biri.",
              en:"**MFA (multi-factor authentication)** asks for one more piece of evidence beyond the password. Even if the password is stolen, the attacker can't get in without the second factor. It is one of the most effective ways to protect your account."},
        {t:"ul",uz:[
          "**TOTP ilovalari** (Google/Microsoft Authenticator) — har 30 soniyada yangi kod. Yaxshi.",
          "**SMS kod** — ishlaydi, lekin zaifroq (SIM almashtirish hujumlari). Yo'qdan ko'ra yaxshi.",
          "**Apparat kalitlari** (FIDO2 / YubiKey) — eng kuchli, fishing'ga chidamli.",
          "**Passkey'lar** — parolsiz kelajak: qurilmangizdagi kriptografik kalit."],
          en:[
          "**TOTP apps** (Google/Microsoft Authenticator) — a new code every 30 seconds. Good.",
          "**SMS code** — works, but weaker (SIM-swap attacks). Better than nothing.",
          "**Hardware keys** (FIDO2 / YubiKey) — the strongest, phishing-resistant.",
          "**Passkeys** — the passwordless future: a cryptographic key on your device."]},
        {t:"note",uz:"Kamida muhim hisoblaringizga (email, bank, ijtimoiy tarmoq) **MFA yoqing**. Email — eng muhimi, chunki u orqali boshqa parollar tiklanadi.",
              en:"At least enable **MFA on your important accounts** (email, bank, social media). Email is the most important, because other passwords are reset through it."},
      ]},
    { uz:"Sessiyalar va cookie'lar", en:"Sessions & cookies", subUz:"Parolni kiritgandan keyin nima bo'ladi", subEn:"What happens after you type your password",
      blocks:[
        {t:"p",uz:"Parolni kiritib \"kirdingiz\" — lekin sayt har sahifada qayta parol so'ramaydi. Buning siri — **sessiya**: server sizga bir marta tekshiruvdan so'ng noyob **sessiya tokeni** beradi, brauzeringiz uni **cookie** sifatida saqlaydi va har so'rovda avtomatik yuboradi.",
              en:"You type your password and you're \"logged in\" — but the site doesn't ask again on every page. The secret is the **session**: after one successful check, the server gives you a unique **session token**, your browser stores it as a **cookie**, and sends it automatically with every request."},
        {t:"h",n:"§",uz:"Sessiya o'g'irlash (session hijacking)",en:"Session hijacking"},
        {t:"p",uz:"Agar hujumchi sizning sessiya cookie'ingizni o'g'irlasa — u sizning **parolingizni bilmasdan ham**, xuddi siz kabi tizimga kira oladi (chunki server faqat tokenni tekshiradi). Bu odatda ochiq Wi-Fi'da shifrlanmagan trafik yoki **XSS** zaifligi orqali sodir bo'ladi (Web-Pentest modulidagi tegishli darsni eslang).",
              en:"If an attacker steals your session cookie, they can log in as you **without ever knowing your password** (because the server only checks the token). This typically happens over unencrypted traffic on open Wi-Fi, or via an **XSS** vulnerability (recall the related lesson in the Web-Pentest module)."},
        {t:"h",n:"§",uz:"Himoya choralari",en:"Protective measures"},
        {t:"ul",uz:[
          "**HttpOnly** cookie — JavaScript orqali o'qib bo'lmaydi, XSS orqali o'g'irlashni qiyinlashtiradi.",
          "**Secure** bayrog'i — cookie faqat HTTPS orqali yuboriladi, ochiq tarmoqda ushlab qolinmaydi.",
          "**Sessiya muddati** — uzoq vaqt faol turmaydigan sessiyalar avtomatik tugaydi.",
          "**Chiqishda (logout) bekor qilish** — server tomonda tokenni haqiqatan bekor qiling, faqat brauzerdan o'chirish yetarli emas."],
          en:[
          "**HttpOnly** cookie — can't be read via JavaScript, making XSS-based theft harder.",
          "**Secure** flag — the cookie is only sent over HTTPS, so it can't be intercepted on open networks.",
          "**Session expiry** — sessions that stay idle too long expire automatically.",
          "**Real invalidation on logout** — actually revoke the token server-side; just clearing it from the browser isn't enough."]},
        {t:"note",warn:true,uz:"Ochiq (parolsiz) Wi-Fi'da nozik hisoblarga (bank, email) kirishdan saqlaning — agar ulanish HTTPS bo'lmasa, sessiya cookie'ingiz oddiy tarmoq tinglash orqali ko'rinishi mumkin.",
              en:"Avoid logging into sensitive accounts (bank, email) on open (password-free) Wi-Fi — if the connection isn't HTTPS, your session cookie can be seen with simple network sniffing."},
      ]},
    { uz:"OAuth va Single Sign-On", en:"OAuth & Single Sign-On", subUz:"\"Google orqali kirish\" qanday ishlaydi", subEn:"How \"Sign in with Google\" works",
      blocks:[
        {t:"p",uz:"Ko'plab saytlarda \"Google orqali kirish\" yoki \"Facebook orqali kirish\" tugmasini ko'rgansiz. Bu — **OAuth** protokoli, va muhim narsa: sayt sizning **Google parolingizni hech qachon ko'rmaydi**.",
              en:"You've probably seen a \"Sign in with Google\" or \"Sign in with Facebook\" button on many sites. This is the **OAuth** protocol, and importantly: the site **never sees your Google password**."},
        {t:"h",n:"§",uz:"Qanday ishlaydi",en:"How it works"},
        {t:"pipe",steps:[
          {ic:"users",tUz:"Siz",tEn:"You",sUz:"\"Google orqali kirish\"ni bosasiz",sEn:"click \"Sign in with Google\""},
          {ic:"shieldCheck",tUz:"Google",tEn:"Google",sUz:"sizni tekshiradi, ruxsat so'raydi",sEn:"verifies you, asks permission"},
          {ic:"key",tUz:"Token",tEn:"Token",sUz:"Google saytga cheklangan token beradi",sEn:"Google gives the site a limited token"},
          {ic:"check",tUz:"Kirish",tEn:"Access",sUz:"sayt tokenga ishonib kiritadi",sEn:"the site trusts the token"}]},
        {t:"p",uz:"Siz Google'ga (parolingizni ishonib topshirgan yagona joyga) kirasiz, u sizning ismingiz/emailingiz kabi **cheklangan ma'lumot** uchun ruxsat so'raydi, va agar rozi bo'lsangiz — sayt shu cheklangan tokenni oladi, parolni emas. Bu **SSO (Single Sign-On)** g'oyasining asosi: bitta ishonchli hisob orqali ko'plab xizmatlarga kirish.",
              en:"You log into Google (the one place you trust with your password), it asks permission for **limited information** like your name/email, and if you agree, the site receives that limited token — not the password. This is the basis of **SSO (Single Sign-On)**: accessing many services through one trusted account."},
        {t:"note",uz:"Afzalligi: bitta kuchli parol + MFA'ni yaxshi himoyalash kifoya. Kamchiligi: agar o'sha bitta hisob (masalan Google) buzilsa, unga bog'langan **barcha** xizmatlar xavf ostida qoladi — shuning uchun \"markaziy\" hisobni MFA bilan ayniqsa mustahkam himoyalash kerak.",
              en:"The upside: protecting one strong password + MFA well is enough. The downside: if that one account (e.g. Google) is compromised, **every** linked service is at risk — which is why the \"central\" account needs especially strong MFA protection."},
      ]},
    { uz:"JWT tokenlar", en:"JWT tokens", subUz:"O'zini o'zi tasdiqlaydigan bilet", subEn:"A self-verifying ticket",
      blocks:[
        {t:"p",uz:"**JWT** (JSON Web Token) — zamonaviy veb va mobil ilovalarda keng qo'llaniladigan autentifikatsiya usuli. U — kriptografik jihatdan **imzolangan** ma'lumot bo'lagi (5-kitobdagi raqamli imzo tushunchasini eslang), server uni har safar ma'lumotlar bazasidan tekshirmasdan ham **haqiqiyligini** bila oladi.",
              en:"**JWT** (JSON Web Token) is a widely used authentication method in modern web and mobile apps. It's a piece of data that is cryptographically **signed** (recall the digital signature concept from the crypto book) — the server can know it's **genuine** without checking a database every time."},
        {t:"h",n:"§",uz:"Uch qism",en:"Three parts"},
        {t:"code",lang:"text",cap:{uz:"JWT tuzilishi",en:"JWT structure"},lines:[
          "header.payload.signature",
          "",
          "header:    {\"alg\":\"HS256\",\"typ\":\"JWT\"}      # qaysi algoritm",
          "payload:   {\"user\":\"ali\",\"role\":\"admin\"}    # ma'lumot (shifrlanmagan!)",
          "signature: server maxfiy kaliti bilan imzolangan"]},
        {t:"note",warn:true,uz:"**Muhim tushunish:** payload qismi faqat **kodlangan** (base64), **shifrlangan emas** — uni har kim o'qiy oladi. Xavfsizlikni signature ta'minlaydi: agar kimdir payload'ni o'zgartirsa (masalan \"role\":\"admin\" deb), imzo mos kelmay qoladi va server rad etadi. **Xulosa: JWT ichiga hech qachon parol yoki maxfiy ma'lumot solmang.**",
              en:"**Key insight:** the payload is only **encoded** (base64), **not encrypted** — anyone can read it. Security comes from the signature: if someone alters the payload (e.g. to \"role\":\"admin\"), the signature no longer matches and the server rejects it. **Lesson: never put a password or secret data inside a JWT.**"},
        {t:"p",uz:"JWT'ning afzalligi — **statesiz (stateless)** bo'lishi: server har so'rovda ma'lumotlar bazasiga murojaat qilmasdan, faqat imzoni tekshiradi. Kamchiligi: token bekor qilinganda (masalan chiqishda) uni \"eslab qolib\" rad etish qiyinroq — chunki u o'zida haqiqiy ekanligini isbotlaydi, muddati tugagunga qadar.",
              en:"JWT's advantage is being **stateless**: the server checks only the signature without a database round-trip on every request. The downside: revoking it (e.g. on logout) is harder — since it proves itself valid until it expires, without the server having to \"remember\" it."},
      ]},
    { uz:"Hisobni tiklash zaifliklari", en:"Account recovery weaknesses", subUz:"Eng zaif eshik — orqa eshik", subEn:"The weakest door is the back door",
      blocks:[
        {t:"p",uz:"Eng kuchli parol va MFA ham foydasiz, agar **\"Parolni unutdingizmi?\"** funksiyasi zaif bo'lsa — bu hujumchi uchun ko'pincha eng oson yo'l, chunki u to'g'ridan-to'g'ri parolni buzishga urinishdan ko'ra osonroq.",
              en:"The strongest password and MFA are useless if the **\"Forgot password?\"** feature is weak — this is often the easiest path for an attacker, easier than trying to crack the password directly."},
        {t:"h",n:"§",uz:"Keng tarqalgan zaifliklar",en:"Common weaknesses"},
        {t:"ul",uz:[
          "**Zaif xavfsizlik savollari** — \"onangizning qiz familiyasi\" kabi javoblar ijtimoiy tarmoqdan (yoki OSINT orqali, keyingi kitobda) topilishi mumkin.",
          "**Email orqali tiklash** — agar hujumchi sizning eski, tashlab qo'yilgan email hisobingizni egallasa, u orqali asosiy hisobingizni tiklashi mumkin.",
          "**SMS orqali tiklash** — SIM-swap hujumi (raqamingizni hujumchi nomiga \"ko'chirish\") orqali chetlab o'tiladi.",
          "**Cheklanmagan urinishlar** — tiklash kodini (masalan 6 xonali) cheksiz sinash imkoniyati bo'lsa, u oxir-oqibat topiladi."],
          en:[
          "**Weak security questions** — answers like \"mother's maiden name\" can often be found on social media (or via OSINT, in the next book).",
          "**Email-based recovery** — if an attacker takes over your old, abandoned email account, they can use it to recover your main account.",
          "**SMS-based recovery** — bypassed via a SIM-swap attack (transferring your number to the attacker's name).",
          "**Unlimited attempts** — if a recovery code (e.g. 6 digits) can be tried unlimited times, it will eventually be found."]},
        {t:"note",uz:"Himoya: xavfsizlik savollariga **haqiqiy bo'lmagan, faqat sizga ma'lum** javoblar bering (parol menejerida saqlang); eski, ishlatilmaydigan email hisoblaringizni o'chiring yoki MFA bilan himoyalang; tiklash uchun ham MFA yoqilgan bo'lsa — ideal.",
              en:"Defence: give **fictional answers only you know** to security questions (store them in your password manager); delete or MFA-protect old, unused email accounts; ideally, enable MFA for the recovery flow itself too."},
      ]},
    { uz:"Korporativ identifikatsiya", en:"Enterprise identity", subUz:"SSO, LDAP va Active Directory", subEn:"SSO, LDAP and Active Directory",
      blocks:[
        {t:"p",uz:"Kompaniyalarda xodim o'nlab tizimga (email, fayl serveri, ichki dastur) kirishi kerak. Har biriga alohida parol o'rniga tashkilotlar **markazlashgan identifikatsiya** tizimidan foydalanadi — bu Windows modulidagi Active Directory bilan bevosita bog'liq.",
              en:"In companies, an employee needs access to dozens of systems (email, file server, internal apps). Instead of a separate password for each, organizations use **centralized identity** — directly connected to Active Directory in the Windows module."},
        {t:"h",n:"§",uz:"LDAP va Active Directory",en:"LDAP and Active Directory"},
        {t:"p",uz:"**LDAP** (Lightweight Directory Access Protocol) — foydalanuvchilar, guruhlar va ruxsatlarni saqlash uchun standart protokol. Microsoft'ning **Active Directory (AD)** — LDAP asosidagi eng keng tarqalgan korporativ identifikatsiya tizimi. Xodim bir marta domenga kirsa (\"domain login\"), keyin **Kerberos** protokoli orqali qayta parol so'ramasdan ko'p ichki xizmatlarga kira oladi.",
              en:"**LDAP** (Lightweight Directory Access Protocol) is the standard protocol for storing users, groups and permissions. Microsoft's **Active Directory (AD)** is the most widespread LDAP-based enterprise identity system. Once an employee logs into the domain (\"domain login\"), the **Kerberos** protocol lets them access many internal services without re-entering a password."},
        {t:"h",n:"§",uz:"Zamonaviy bulut SSO",en:"Modern cloud SSO"},
        {t:"p",uz:"Bugungi kompaniyalar ko'pincha bulutga asoslangan identifikatsiya provayderi (masalan Okta, Azure AD/Entra ID) ishlatadi — u OAuth/SAML orqali (2-bobdagi g'oyaga o'xshash) o'nlab bulut xizmatiga (email, CRM, chat) yagona kirish beradi. Xodim ishdan bo'shaganda, **bitta hisobni** o'chirish yetarli — barcha bog'langan xizmatlarga kirish avtomatik yopiladi.",
              en:"Today's companies often use a cloud-based identity provider (e.g. Okta, Azure AD/Entra ID) that grants single access to dozens of cloud services (email, CRM, chat) via OAuth/SAML (similar to the idea in chapter 2). When an employee leaves, deleting **one account** is enough — access to every linked service closes automatically."},
        {t:"note",uz:"Bu — nafaqat qulaylik, balki xavfsizlik ham: markazlashgan tizim xodim ishdan ketganda barcha kirishlarni bir zumda yopish, va shubhali faoliyatni bitta joydan kuzatish imkonini beradi.",
              en:"This is not just convenience, but security too: a centralized system lets you close all access instantly when an employee leaves, and monitor suspicious activity from one place."},
      ]},
    { uz:"Zero Trust identifikatsiya", en:"Zero Trust identity", subUz:"\"Hech kimga ishonma, har doim tekshir\"", subEn:"\"Never trust, always verify\"",
      blocks:[
        {t:"p",uz:"Eski xavfsizlik modeli — \"qal'a va handaq\": firewall ichkarisidagi hamma narsaga ishoniladi. Zamonaviy **Zero Trust** modeli buni rad etadi: **hech qanday joylashuv yoki tarmoq o'z-o'zidan ishonch bermaydi** — har bir so'rov, hatto \"ichkaridan\" kelsa ham, alohida tekshiriladi.",
              en:"The old security model was \"castle and moat\": everything inside the firewall is trusted. The modern **Zero Trust** model rejects this: **no location or network grants trust by itself** — every request, even from \"inside\", is verified individually."},
        {t:"h",n:"§",uz:"Nega o'zgarish kerak bo'ldi",en:"Why the shift was needed"},
        {t:"p",uz:"Masofaviy ish, bulut xizmatlari va shaxsiy qurilmalar (BYOD) bilan \"tarmoq chegarasi\" tushunchasi yo'qoldi. Agar hujumchi bitta ichki qurilmani buzsa (masalan fishing orqali), eski modelda u **butun tarmoq bo'ylab** erkin harakatlana oladi (\"lateral movement\") — Zero Trust esa buni cheklaydi.",
              en:"With remote work, cloud services and personal devices (BYOD), the concept of a \"network perimeter\" has dissolved. If an attacker compromises one internal device (e.g. via phishing), in the old model they can move freely across **the entire network** (\"lateral movement\") — Zero Trust limits exactly this."},
        {t:"ul",uz:[
          "**Har bir so'rov autentifikatsiya qilinadi** — \"ichkarida\" ekanligi yetarli emas.",
          "**Eng kam imtiyoz (least privilege)** — foydalanuvchi faqat kerakli resursga, faqat kerakli vaqtda kirishi mumkin.",
          "**Qurilma holati tekshiriladi** — yangilangan, himoyalangan qurilmalargagina kirish beriladi.",
          "**Doimiy monitoring** — g'ayrioddiy xatti-harakat (masalan boshqa mamlakatdan kutilmagan kirish) darhol belgilanadi."],
          en:[
          "**Every request is authenticated** — being \"inside\" isn't enough.",
          "**Least privilege** — a user can access only the resource they need, only when needed.",
          "**Device posture is checked** — only updated, protected devices are granted access.",
          "**Continuous monitoring** — unusual behaviour (e.g. an unexpected login from another country) is flagged immediately."]},
        {t:"note",uz:"Zero Trust — bu bitta mahsulot emas, **arxitektura falsafasi**: identifikatsiya (bu kitobning markazi), qurilma xavfsizligi va tarmoq segmentatsiyasini birlashtiradi. Shaxsiy darajada esa siz allaqachon shunga o'xshash narsa qilyapsiz — har bir saytga alohida ishonch (MFA, noyob parol) berish orqali.",
              en:"Zero Trust isn't a single product — it's an **architectural philosophy** combining identity (the core of this book), device security and network segmentation. At a personal level, you're already doing something similar — granting each site its own trust (MFA, a unique password)."},
      ]},
    { uz:"Himoya va kelajak", en:"Defence & the future", subUz:"Parolsiz dunyoga qarab", subEn:"Toward a passwordless world",
      blocks:[
        {t:"p",uz:"Sanoat asta-sekin **parolsiz (passwordless)** autentifikatsiyaga o'tmoqda. **Passkey'lar** (FIDO2 standarti asosida) parolni butunlay yo'q qiladi: siz qurilmangizni barmoq izi yoki yuz bilan ochasiz, u esa saytga kriptografik isbot yuboradi. Fishing bunda ishlamaydi, chunki o'g'irlaydigan parol yo'q.",
              en:"The industry is gradually moving to **passwordless** authentication. **Passkeys** (based on the FIDO2 standard) eliminate passwords entirely: you unlock your device with a fingerprint or face, and it sends a cryptographic proof to the site. Phishing doesn't work here, because there is no password to steal."},
        {t:"ul",uz:[
          "Bugun: **kuchli noyob parollar + parol menejeri + MFA**.",
          "Imkon bo'lsa: **passkey'larga** o'ting.",
          "Hech qachon parol yoki OTP'ni boshqalarga aytmang.",
          "Parol sizib chiqqanini bilsangiz — darhol o'zgartiring."],
          en:[
          "Today: **strong unique passwords + a password manager + MFA**.",
          "Where possible: switch to **passkeys**.",
          "Never share a password or OTP with anyone.",
          "If you learn a password has leaked — change it immediately."]},
        {t:"colophon"},
      ]},
  ],
};

// ═══════════════════════════════════════════════════════════════
//  BOOK DATA — OSINT & privacy. Defence-and-ethics oriented; original.
// ═══════════════════════════════════════════════════════════════
const OSINT_BOOK={
  id:"osint",
  titleUz:"OSINT — ochiq manba razvedkasi va maxfiylik",
  titleEn:"OSINT — open-source intelligence & privacy",
  author:"Original (ochiq manbalar asosida)",
  authorUz:"Original material (ochiq manbalar asosida)",
  authorEn:"Original material (based on open references)",
  license:"CC BY-SA 4.0",
  coverAbbr:"OS", coverBy:"Razvedka", coverIcon:"search",
  refs:[
    {label:"OSINT Framework",href:"https://osintframework.com/"},
    {label:"SANS — OSINT resources",href:"https://www.sans.org/"},
  ],
  noteUz:"Bu — original material, ikki maqsadli: ochiq ma'lumotni tahlil qilish VA o'z raqamli izingni himoya qilish. Faqat qonuniy va axloqiy foydalanish uchun. CC BY-SA 4.0.",
  noteEn:"This is original material with a dual purpose: analysing open information AND protecting your own digital footprint. For lawful and ethical use only. CC BY-SA 4.0.",
  descUz:"Ochiq (ommaviy) manbalardan ma'lumot to'plash san'ati — va uning teskarisi: o'zingiz haqingizdagi ma'lumotni kamaytirib, maxfiylikni himoyalash.",
  descEn:"The art of gathering information from open (public) sources — and its reverse: reducing what's known about you and protecting your privacy.",
  chapters:[
    { uz:"Muqaddima va axloq", en:"Preface & ethics", subUz:"Ikki tomonlama qurol", subEn:"A double-edged skill",
      blocks:[
        {t:"p",uz:"**OSINT** (Open-Source Intelligence) — ochiq, ommaviy manbalardan (internet, ijtimoiy tarmoqlar, ommaviy reyestrlar) ma'lumot to'plab, undan xulosa chiqarish. Bu — pentest, tergov, jurnalistika va xavfsizlik tahlilining muhim qismi.",
              en:"**OSINT** (Open-Source Intelligence) is gathering information from open, public sources (the internet, social media, public records) and drawing conclusions from it. It is a key part of pentesting, investigation, journalism and security analysis."},
        {t:"colophon"},
        {t:"note",warn:true,uz:"**Axloq va qonun.** OSINT faqat **ochiq** ma'lumot bilan ishlaydi — tizimlarni buzish yoki begona hisoblarga kirish OSINT emas, jinoyat. Boshqalarni kuzatish yoki ta'qib qilish uchun ishlatish — qonunbuzarlik. Bu material himoya, tadqiqot va o'z maxfiyligingni tushunish uchun.",
              en:"**Ethics and law.** OSINT works only with **open** information — breaking into systems or accessing others' accounts is not OSINT, it's a crime. Using it to stalk or harass people is illegal. This material is for defence, research and understanding your own privacy."},
      ]},
    { uz:"OSINT qayerda ishlatiladi", en:"Where OSINT is used", subUz:"Ma'lumot to'plash bosqichi", subEn:"The information-gathering phase",
      blocks:[
        {t:"p",uz:"Ko'p xavfsizlik jarayonlari OSINTdan boshlanadi. Masalan, pentest'da hujumchi (yoki himoyachi) nishon haqida ochiq ma'lumot to'playdi: domenlar, email manzillar, xodimlar, ishlatiladigan texnologiyalar. Bu **recon** (ma'lumot to'plash) bosqichi.",
              en:"Many security processes begin with OSINT. For example, in a pentest the attacker (or defender) gathers open information about the target: domains, email addresses, employees, technologies in use. This is the **recon** (reconnaissance) phase."},
        {t:"ul",uz:[
          "**Pentest / Red team** — nishonni o'rganish (avvalgi ijtimoiy injeneriya kitobiga bog'liq).",
          "**Tergov va huquq** — firibgarlik, yo'qolgan odamlar bo'yicha tekshiruv.",
          "**Jurnalistika** — faktlarni tekshirish, tadqiqot.",
          "**Xavfsizlik / Blue team** — o'z tashkiloting haqida internetda nima ochiq ekanini bilish."],
          en:[
          "**Pentest / Red team** — studying the target (connected to the earlier social engineering book).",
          "**Investigation and law** — fraud, missing-persons inquiries.",
          "**Journalism** — fact-checking, research.",
          "**Security / Blue team** — knowing what about your own organisation is open on the internet."]},
      ]},
    { uz:"Ma'lumot manbalari", en:"Sources of information", subUz:"Ochiq ma'lumot qayerda bo'ladi", subEn:"Where open information lives",
      blocks:[
        {t:"p",uz:"OSINT'ning kuchi — ma'lumot manbalarini bilishda. Asosiy toifalar:",
              en:"The power of OSINT is in knowing the sources. The main categories:"},
        {t:"ul",uz:[
          "**Qidiruv tizimlari** — Google, va maxsuslashtirilganlar (masalan, internetga ulangan qurilmalar uchun).",
          "**Ijtimoiy tarmoqlar** — profil, joylashuv, aloqalar, qiziqishlar.",
          "**Ommaviy reyestrlar** — domen ro'yxati (WHOIS), kompania ma'lumotlari.",
          "**Metadata** — rasm va hujjatlardagi yashirin ma'lumot (joylashuv, qurilma, sana).",
          "**Sizib chiqqan ma'lumot bazalari** — buzilgan saytlardagi ochiq ma'lumot (o'z email'ingiz sizib chiqqanini tekshirish uchun)."],
          en:[
          "**Search engines** — Google, and specialised ones (e.g. for internet-connected devices).",
          "**Social networks** — profiles, location, connections, interests.",
          "**Public records** — domain registration (WHOIS), company data.",
          "**Metadata** — hidden information in images and documents (location, device, date).",
          "**Leaked databases** — open data from breached sites (to check whether your own email has leaked)."]},
        {t:"note",uz:"E'tibor bering: bu manbalarning ko'pchiligi **siz haqingizda ham** ma'lumot beradi. OSINT'ni o'rganish — o'zingni himoya qilishning birinchi qadami.",
              en:"Note: most of these sources reveal information **about you too**. Learning OSINT is the first step to protecting yourself."},
      ]},
    { uz:"Texnikalar va vositalar", en:"Techniques & tools", subUz:"Aqlli qidiruv", subEn:"Searching smartly",
      blocks:[
        {t:"p",uz:"OSINT ko'proq **texnika**, kamroq vosita. Eng muhim ko'nikma — **aqlli qidiruv**. Masalan, qidiruv operatorlari (advanced search) natijalarni keskin toraytiradi: aniq sayt ichida, aniq fayl turida yoki aniq iborani qidirish.",
              en:"OSINT is more about **technique** than tools. The most important skill is **searching smartly**. For example, search operators (advanced search) sharply narrow results: searching within a specific site, a specific file type, or an exact phrase."},
        {t:"ul",uz:[
          "**Qidiruv operatorlari** — `site:`, `filetype:`, qo'shtirnoq ichida aniq ibora.",
          "**Teskari rasm qidiruvi** — rasm qaerdan kelganini topish.",
          "**Username qidiruvi** — bir taxallusni turli platformalarda izlash.",
          "**Metadata ko'ruvchilar** — rasm/hujjat ichidagi yashirin ma'lumotni ochish."],
          en:[
          "**Search operators** — `site:`, `filetype:`, an exact phrase in quotes.",
          "**Reverse image search** — finding where an image came from.",
          "**Username search** — looking for one alias across different platforms.",
          "**Metadata viewers** — revealing hidden information inside an image/document."]},
        {t:"note",uz:"Aynan shu operatorlar himoya uchun ham ishlatiladi: o'z tashkiloting haqida internetda nima ochiq turganini topib, uni yopish.",
              en:"These same operators are also used for defence: finding what about your organisation is openly exposed on the internet, and locking it down."},
      ]},
    { uz:"Google dorking chuqurroq", en:"Google dorking in depth", subUz:"Qidiruv operatorlarining to'liq kuchi", subEn:"The full power of search operators",
      blocks:[
        {t:"p",uz:"**Google dorking** (yoki \"Google hacking\") — qidiruv operatorlarini birlashtirib, oddiy qidiruvda topilmaydigan, tasodifan ochiq qolgan ma'lumotlarni topish texnikasi. Bu hujum emas — qidiruv tizimi allaqachon indekslagan **ochiq** ma'lumotni topish, xolos.",
              en:"**Google dorking** (or \"Google hacking\") is the technique of combining search operators to find accidentally exposed information that a plain search won't surface. This isn't hacking — it's finding **already public** information the search engine has already indexed."},
        {t:"h",n:"§",uz:"Asosiy operatorlar",en:"Core operators"},
        {t:"code",lang:"text",cap:{uz:"Google qidiruv operatorlari",en:"Google search operators"},lines:[
          "site:example.com                  # faqat shu domenda qidir",
          "filetype:pdf site:example.com     # shu domendagi PDF fayllar",
          "intitle:\"index of\"                # ochiq katalog ro'yxatlari",
          "inurl:admin                       # URL'ida \"admin\" bo'lgan sahifalar",
          "\"maxfiy hisobot\" site:example.com # aniq ibora, shu domenda"]},
        {t:"h",n:"§",uz:"Nima uchun ishlatiladi",en:"What it's used for"},
        {t:"ul",uz:[
          "**Blue team / xavfsizlik jamoasi** — o'z tashkilotining tasodifan ochiq qolgan fayllarini (masalan ichki hujjatlar, backup) topib, yopish.",
          "**Pentest recon** — nishon kompaniyaning texnologiyalari, xodimlar ro'yxati, subdomenlarini xaritalash.",
          "**Tadqiqotchilar** — ochiq ma'lumotlar bazasi, statistika, hujjatlarni topish."],
          en:[
          "**Blue team / security teams** — finding and closing accidentally exposed files (internal docs, backups) belonging to their own organization.",
          "**Pentest recon** — mapping a target company's technologies, staff lists, subdomains.",
          "**Researchers** — finding open datasets, statistics, documents."]},
        {t:"note",warn:true,uz:"Dorking orqali topilgan **ochiq** sahifaga kirish — texnik jihatdan qonuniy (chunki u indekslangan, umumga ochiq). Lekin topilgan ma'lumotni **noqonuniy maqsadda ishlatish** (masalan sizib chiqqan parollardan foydalanish) jinoyat. \"Topa olish\" bilan \"ishlatish huquqi\" ikki xil narsa.",
              en:"Accessing a **publicly indexed** page found via dorking is technically legal (it's public and indexed). But **using** what you find for illegal purposes (e.g. using leaked passwords) is a crime. \"Being able to find it\" and \"having the right to use it\" are two different things."},
      ]},
    { uz:"Ijtimoiy tarmoq OSINT'i", en:"Social media OSINT", subUz:"Odamlar eng ko'p ma'lumot qoldiradigan joy", subEn:"Where people leave the most information",
      blocks:[
        {t:"p",uz:"Ijtimoiy tarmoqlar OSINT uchun eng boy manba — odamlar u yerda o'z xohishi bilan joylashuv, ish joyi, oila a'zolari, kundalik odatlarini ulashadi. Bu bobda qanday ma'lumot ochilishini bilib, o'zingizni himoya qilishni o'rganamiz.",
              en:"Social media is the richest source for OSINT — people voluntarily share their location, workplace, family members and daily habits there. In this chapter we learn what gets exposed, so you can protect yourself."},
        {t:"h",n:"§",uz:"Nima oshkor bo'ladi",en:"What gets exposed"},
        {t:"ul",uz:[
          "**Bevosita ma'lumot** — profil sahifasidagi ish joyi, tug'ilgan sana, joylashuv.",
          "**Bilvosita ma'lumot** — fon rasmidagi ish stoli belgisi, mashina raqami, oyna orqasidagi bino.",
          "**Ijtimoiy graf** — do'stlar/kuzatuvchilar ro'yxati orqali oila, hamkasblar tarmog'ini xaritalash mumkin.",
          "**Vaqt naqshlari** — qachon onlayn ekanligi, qachon sayohatda ekanligi (uy bo'sh vaqt)."],
          en:[
          "**Direct information** — workplace, birthday, location on the profile page.",
          "**Indirect information** — a desk badge in a background photo, a licence plate, a building visible through a window.",
          "**Social graph** — friends/followers lists let you map family and colleague networks.",
          "**Time patterns** — when someone is online, when they're traveling (an empty house)."]},
        {t:"h",n:"§",uz:"Amaliy texnika: teskari qidiruv",en:"Practical technique: reverse search"},
        {t:"p",uz:"Bitta profil rasmini boshqa saytlarda **teskari rasm qidiruvi** orqali izlab, o'sha odam boshqa qaysi platformalarda mavjudligini (va u yerda qanday ma'lumot ulashganini) topish mumkin. Bu — bir platformada yopiq, lekin boshqasida ochiq qoldirilgan ma'lumotni bog'lash usuli.",
              en:"Searching one profile photo across other sites via **reverse image search** can reveal which other platforms that person uses (and what they share there). It's a way of linking information left private on one platform but exposed on another."},
        {t:"note",uz:"Himoya: profilingizni **shaxsiy** qiling, fon rasmlarda hujjat/nishon ko'rinmasligiga e'tibor bering, joylashuvni jonli emas, kechiktirib ulashing (masalan sayohatdan qaytgandan keyin).",
              en:"Defence: make your profile **private**, watch that no documents/badges appear in background photos, and share location after the fact rather than live (e.g. post about a trip after you're back)."},
      ]},
    { uz:"Korporativ OSINT", en:"Corporate OSINT", subUz:"Tashkilot haqida qanday ma'lumot ochiq", subEn:"What's openly known about an organization",
      blocks:[
        {t:"p",uz:"OSINT shaxslar bilan cheklanmaydi — kompaniyalar ham katta **hujum yuzasi** (attack surface) qoldiradi. Xavfsizlik jamoalari (\"blue team\") o'z tashkilotini xuddi hujumchi ko'zi bilan ko'rish uchun korporativ OSINT o'tkazadi.",
              en:"OSINT isn't limited to individuals — companies also leave a large **attack surface**. Security teams (\"blue teams\") run corporate OSINT to see their own organization through an attacker's eyes."},
        {t:"h",n:"§",uz:"Nimalar tekshiriladi",en:"What gets checked"},
        {t:"ul",uz:[
          "**Domen va subdomenlar** — WHOIS ma'lumoti, unutilgan eski subdomenlar (masalan `test.example.com`).",
          "**Xodimlar** — LinkedIn orqali kim qaysi lavozimda, qaysi texnologiyalarni bilishini aniqlash (ijtimoiy injeneriya uchun ham foydalaniladi — SE kitobini eslang).",
          "**Texnologik iz** — sayt qaysi CMS, server, kutubxonalardan foydalanishi (bu ma'lum zaifliklarni qidirish uchun boshlang'ich nuqta).",
          "**Sizib chiqqan ma'lumotlar** — xodimlarning ish emaili qaysi buzilgan bazalarda uchraganini tekshirish."],
          en:[
          "**Domains and subdomains** — WHOIS data, forgotten old subdomains (e.g. `test.example.com`).",
          "**Employees** — using LinkedIn to determine who holds which role and what technologies they know (also used for social engineering — recall the SE book).",
          "**Technology footprint** — which CMS, server, libraries a site uses (a starting point for looking up known vulnerabilities).",
          "**Leaked data** — checking whether employees' work emails appear in breached databases."]},
        {t:"note",uz:"Bu — pentest'ning **recon** bosqichi (SE kitobidagi hujum bosqichlarini eslang), lekin himoya maqsadida qilinganda **\"attack surface management\"** deb ataladi: tashkilot o'zi haqida internetda nima borligini muntazam tekshirib, ortiqchasini yopib boradi.",
              en:"This is the **recon** phase of a pentest (recall the attack stages from the SE book), but when done for defence it's called **\"attack surface management\"**: the organization regularly checks what's exposed about itself online and closes what shouldn't be there."},
      ]},
    { uz:"Rasm geolokatsiyasi va EXIF", en:"Image geolocation & EXIF", subUz:"Bitta rasm qancha ma'lumot bera oladi", subEn:"How much a single photo can reveal",
      blocks:[
        {t:"p",uz:"Rasm — shunchaki piksellar emas. Ko'p kamera va telefonlar rasmga **EXIF metadata** qo'shadi: qachon, qaysi qurilma bilan, ba'zan hatto **aniq GPS koordinatalari** bilan olingani.",
              en:"A photo is more than pixels. Many cameras and phones attach **EXIF metadata**: when it was taken, with which device, and sometimes even **exact GPS coordinates**."},
        {t:"h",n:"§",uz:"EXIF'da nima bor",en:"What's in EXIF"},
        {t:"ul",uz:[
          "**Sana va vaqt** — rasm aynan qachon olingani.",
          "**Qurilma modeli** — qaysi telefon yoki kamera.",
          "**GPS koordinatalari** — ko'p telefonlarda standart yoqilgan, aniq joylashuvni ochib beradi.",
          "**Tahrirlash tarixi** — ba'zan qaysi dastur bilan tahrirlangani."],
          en:[
          "**Date and time** — exactly when the photo was taken.",
          "**Device model** — which phone or camera.",
          "**GPS coordinates** — enabled by default on many phones, revealing exact location.",
          "**Edit history** — sometimes which software was used to edit it."]},
        {t:"h",n:"§",uz:"Metadatasiz geolokatsiya",en:"Geolocation without metadata"},
        {t:"p",uz:"Ko'pgina ijtimoiy tarmoqlar yuklashda EXIF'ni avtomatik o'chiradi — lekin bu joylashuvni butunlay yashirmaydi. Tajribali tahlilchi rasmning o'zidan (fondagi yozuvlar, bino uslubi, o'simliklar, quyosh burchagi) joylashuvni **taxmin qilishi** mumkin — bu \"visual geolocation\" deb ataladi va jurnalistika hamda tergovda qonuniy qo'llaniladi.",
              en:"Many social platforms strip EXIF on upload — but that doesn't fully hide location. An experienced analyst can **estimate** location from the image itself (background signage, building style, vegetation, sun angle) — this is called \"visual geolocation\" and is used legitimately in journalism and investigations."},
        {t:"note",warn:true,uz:"Himoya: ijtimoiy tarmoqqa joylashdan oldin telefon sozlamalaridan **joylashuvni o'chiring** yoki rasm joylashuvchi ilova orqali EXIF'ni tozalang. Diqqat: metadata o'chirilgan taqdirda ham, rasmning o'zi (fon) joylashuvni fosh qilishi mumkinligini unutmang.",
              en:"Defence: turn off **location** in your phone settings before posting, or strip EXIF with a dedicated tool before sharing. Note: even with metadata removed, the image itself (background) can still reveal location."},
      ]},
    { uz:"OSINT vositalari landshafti", en:"The OSINT tools landscape", subUz:"Qaysi vosita nima uchun", subEn:"Which tool for which job",
      blocks:[
        {t:"p",uz:"OSINT'da vositalar juda ko'p, lekin ular bir necha aniq toifaga bo'linadi. Toifalarni bilish — har safar yangi vosita nomini yodlashdan ko'ra foydaliroq.",
              en:"OSINT has many tools, but they fall into a handful of clear categories. Knowing the categories is more useful than memorizing tool names one by one."},
        {t:"ul",uz:[
          "**Domen/tarmoq razvedkasi** — `theHarvester` (email, subdomen yig'ish), `Shodan` (internetga ulangan qurilmalarni qidiruvchi maxsus qidiruv tizimi) — Kali modulida amaliy ko'rilgan.",
          "**Vizual bog'lash** — `Maltego` — turli manbalardan (domen, email, ijtimoiy tarmoq) topilgan ma'lumotni grafik ko'rinishda bog'laydi.",
          "**Username/hisob qidiruvi** — bitta taxallusni o'nlab platformada avtomatik qidiruvchi vositalar.",
          "**Sizib chiqqan ma'lumot tekshiruvi** — email yoki parolning ma'lum buzilgan bazalarda uchrashini tekshiruvchi xizmatlar."],
          en:[
          "**Domain/network recon** — `theHarvester` (gathering emails, subdomains), `Shodan` (a specialized search engine for internet-connected devices) — covered practically in the Kali module.",
          "**Visual linking** — `Maltego` — links information found across different sources (domain, email, social media) into a graph.",
          "**Username/account search** — tools that automatically search one alias across dozens of platforms.",
          "**Leak checking services** — services that check whether an email or password appears in known breached databases."]},
        {t:"note",uz:"Vositaning o'zi emas, **metodologiya** muhimroq: qaysi savolga javob izlayapsiz, keyin unga mos vositani tanlang — aksincha emas. Kali modulidagi Recon & Scanning bo'limi bu vositalarning bir qismini amalda ko'rsatadi.",
              en:"The **methodology** matters more than any single tool: figure out what question you're answering, then pick the matching tool — not the other way around. The Recon & Scanning section of the Kali module demonstrates some of these tools hands-on."},
      ]},
    { uz:"Hisobot yozish va huquqiy chegaralar", en:"Reporting & legal boundaries", subUz:"Topilganlarni qanday hujjatlashtirish kerak", subEn:"How to properly document your findings",
      blocks:[
        {t:"p",uz:"Professional OSINT ishi — faqat topish emas, balki topilganlarni **aniq, ishonchli va qonuniy** tarzda hujjatlashtirish. Yaxshi hisobot keyingi qarorlar (masalan qaysi zaiflikni birinchi yopish) uchun asos bo'ladi.",
              en:"Professional OSINT work isn't just finding things — it's documenting findings **accurately, reliably and lawfully**. A good report becomes the basis for follow-up decisions (e.g. which exposure to fix first)."},
        {t:"h",n:"§",uz:"Yaxshi hisobotning tarkibi",en:"What a good report contains"},
        {t:"ul",uz:[
          "**Manba** — har bir dalil qayerdan topilgani (havola, sana) — keyinchalik tekshirish uchun.",
          "**Skrinshot/arxiv** — ochiq ma'lumot keyin o'chirilishi mumkin, shuning uchun dalil saqlanadi.",
          "**Xulosa, faktdan alohida** — \"bu ma'lumot ko'rsatadi\" bilan \"bu ma'lumot isbotlaydi\" o'rtasidagi farqni aniq belgilash.",
          "**Xavf darajasi** — topilgan narsa qanchalik jiddiy (ochiq parol vs ommaviy ish e'loni)."],
          en:[
          "**Source** — where each piece of evidence came from (link, date) — for later verification.",
          "**Screenshot/archive** — public data can later be deleted, so evidence is preserved.",
          "**Conclusion kept separate from fact** — clearly distinguishing \"this suggests\" from \"this proves\".",
          "**Severity rating** — how serious a finding is (an exposed password vs. a public job posting)."]},
        {t:"h",n:"§",uz:"Huquqiy chegaralar — yakuniy eslatma",en:"Legal boundaries — a final reminder"},
        {t:"note",warn:true,uz:"1-bobdagi qoidani yakunlaymiz: OSINT faqat **ochiq** manbalar bilan ishlaydi. Parolni sinab ko'rish, hisobga kirishga urinish, yoki \"ochiq\" deb o'ylangan, aslida cheklangan tizimga kirish — bu allaqachon **noqonuniy kirish** (jinoyat), OSINT emas. Ma'lumotlarni himoya qonunlari (masalan GDPR'ga o'xshash mahalliy qonunlar) shaxsiy ma'lumotni yig'ish va saqlashni ham tartibga soladi — professional ishda bularga rioya qilish shart.",
              en:"We close the loop on the rule from chapter 1: OSINT only works with **open** sources. Trying a password, attempting to log into an account, or accessing a system that only seemed \"open\" but was actually restricted — that is already **unauthorized access** (a crime), not OSINT. Data protection laws (e.g. GDPR-like local regulations) also govern collecting and storing personal data — professional work must comply with these."},
      ]},
    { uz:"Raqamli izingni himoya qilish", en:"Protecting your digital footprint", subUz:"OSINT'ning teskari tomoni", subEn:"The reverse side of OSINT",
      blocks:[
        {t:"p",uz:"OSINT'ni o'rganishning eng foydali tomoni — **o'zingni himoya qilish**. Hujumchi siz haqingizda qancha kam ma'lumot topsa, ijtimoiy injeneriya shuncha qiyin. Raqamli izingni kamaytirish:",
              en:"The most useful side of learning OSINT is **protecting yourself**. The less information an attacker can find about you, the harder social engineering becomes. Reduce your digital footprint:"},
        {t:"ul",uz:[
          "Ijtimoiy tarmoqda **kam ma'lumot** ulashing; profillarni **shaxsiy** qiling.",
          "Rasm joylashdan oldin **joylashuv (GPS) metadata**sini o'chiring.",
          "Har saytga bir xil email/parol ishlatmang (avvalgi kitoblar).",
          "O'z ismingizni vaqti-vaqti bilan qidirib, internetda nima ochiq turganini tekshiring.",
          "Email'ingiz sizib chiqqanini tekshirib turing va o'zgartiring."],
          en:[
          "Share **less** on social media; make profiles **private**.",
          "Remove **location (GPS) metadata** from images before posting.",
          "Don't reuse the same email/password across sites (previous books).",
          "Periodically search for your own name to see what's open about you.",
          "Check whether your email has leaked and change credentials."]},
        {t:"note",uz:"Bir jumla bilan: **OSINT'ni bilgan odam o'zini yaxshiroq himoya qiladi.** Hujumchi qanday ma'lumot izlashini bilsangiz, uni undan yashira olasiz.",
              en:"In one sentence: **a person who understands OSINT protects themselves better.** If you know what information an attacker looks for, you can hide it from them."},
        {t:"colophon"},
      ]},
  ],
};

const BOOKS=[RE_BOOK,SE_BOOK,CRYPTO_BOOK,AUTH_BOOK,OSINT_BOOK];

// ── Colophon (attribution) block ──────────────────────────────
function Colophon({book}){
  const lang=useLang();
  const row=(k,v,href)=>React.createElement("div",{className:"bk-colophon-row"},
    React.createElement("span",{className:"k"},k),
    href?React.createElement("a",{href,target:"_blank",rel:"noopener noreferrer"},v,React.createElement(Icon,{name:"external",size:11,style:{marginLeft:4,verticalAlign:"middle"}})):React.createElement("span",{className:"v"},v));
  return React.createElement("div",{className:"bk-colophon"},
    React.createElement("h4",null,t(lang,"// MANBA VA MUALLIF","// SOURCE & AUTHOR")),
    book.origTitle&&row(t(lang,"Asl kitob","Original"),book.origTitle),
    row(t(lang,"Muallif","Author"),t(lang,book.authorUz||book.author,book.authorEn||book.author)),
    row(t(lang,"Litsenziya","License"),book.license),
    book.source&&row(t(lang,"Manba","Source"),book.source.replace("https://",""),book.source),
    (book.refs||[]).map((r,i)=>React.createElement("div",{key:i,className:"bk-colophon-row"},
      React.createElement("span",{className:"k"},i===0?t(lang,"Adabiyot","References"):""),
      r.href?React.createElement("a",{href:r.href,target:"_blank",rel:"noopener noreferrer"},r.label):React.createElement("span",{className:"v"},r.label))),
    React.createElement("div",{className:"bk-colophon-row",style:{marginTop:8}},
      React.createElement("span",{className:"v",style:{fontSize:12,color:"var(--text-2)"}},
        t(lang,book.noteUz,book.noteEn))));
}

// ── Content block renderer ────────────────────────────────────
function CodeBlock({b}){
  const lang=useLang();
  const cap=b.cap?t(lang,b.cap.uz,b.cap.en):"";
  return React.createElement("div",{className:"bk-code"},
    React.createElement("div",{className:"bk-code-head"},
      React.createElement("span",{className:"bk-code-cap"},cap),
      React.createElement("span",{className:"bk-code-lang"},b.lang||"asm")),
    React.createElement("pre",null,React.createElement("code",null,
      b.lines.map((ln,i)=>{
        let ci=-1;const s1=ln.indexOf(";");const s2=ln.indexOf("//");const s3=ln.indexOf("#");
        [s1,s2,s3].forEach(s=>{if(s>=0&&(ci<0||s<ci))ci=s;});
        let codePart=ln,comPart="";
        if(ci>=0){codePart=ln.slice(0,ci);comPart=ln.slice(ci);}
        return React.createElement(React.Fragment,{key:i},codePart,comPart&&React.createElement("span",{className:"cm"},comPart),"\n");
      }))));
}
function Pipe({b}){
  const lang=useLang();
  return React.createElement("div",{className:"bk-pipe"},
    b.steps.map((s,i)=>[
      React.createElement("div",{key:"s"+i,className:"bk-pipe-step"},
        React.createElement("div",{className:"bk-pipe-ic"},React.createElement(Icon,{name:s.ic,size:20})),
        React.createElement("div",{className:"bk-pipe-t"},t(lang,s.tUz,s.tEn)),
        React.createElement("div",{className:"bk-pipe-s"},t(lang,s.sUz,s.sEn))),
      i<b.steps.length-1&&React.createElement("div",{key:"a"+i,className:"bk-pipe-arrow"},"→")
    ]));
}
function StackDiagram({b}){
  const lang=useLang();
  return React.createElement("div",null,
    React.createElement("div",{className:"bk-stack"},
      b.rows.map((r,i)=>React.createElement("div",{key:i,className:"bk-stack-row"+(r.hi?" hi":"")},
        React.createElement("span",{className:"bk-stack-addr"},r.addr),
        React.createElement("span",{className:"bk-stack-lbl"},t(lang,r.uz,r.en))))),
    React.createElement("div",{className:"bk-stack-cap"},t(lang,b.capUz,b.capEn)));
}
function Block({b,book}){
  const lang=useLang();
  switch(b.t){
    case"h":return React.createElement("h3",{className:"bk-h"},b.n&&React.createElement("span",{className:"bk-h-n"},b.n),rich(t(lang,b.uz,b.en)));
    case"p":return React.createElement("p",{className:"bk-p"},rich(t(lang,b.uz,b.en)));
    case"ul":return React.createElement("ul",{className:"bk-ul"},(t(lang,b.uz,b.en)||[]).map((it,i)=>
      React.createElement("li",{key:i,className:"bk-li"},React.createElement("span",{className:"bk-li-mk"},"▸"),React.createElement("span",null,rich(it)))));
    case"code":return React.createElement(CodeBlock,{b});
    case"note":return React.createElement("div",{className:"bk-note"+(b.warn?" warn":"")},
      React.createElement("span",{className:"bk-note-ic"},React.createElement(Icon,{name:b.warn?"alert":"info",size:16})),
      React.createElement("div",{className:"bk-note-body"},rich(t(lang,b.uz,b.en))));
    case"pipe":return React.createElement(Pipe,{b});
    case"stack":return React.createElement(StackDiagram,{b});
    case"colophon":return React.createElement(Colophon,{book});
    default:return null;
  }
}

// ── Top navigation ────────────────────────────────────────────
function TopNav({onHome,lang,setLang,crumb}){
  return React.createElement("div",{className:"bk-nav"},
    React.createElement("div",{className:"bk-brand",onClick:onHome},
      React.createElement("div",{className:"bk-brand-mark"},React.createElement(Icon,{name:"book",size:20})),
      React.createElement("div",null,
        React.createElement("div",{className:"bk-brand-name"},t(lang,"Kutubxona","Library")),
        React.createElement("div",{className:"bk-brand-sub"},"CYBERSEC BOOKS"))),
    React.createElement("div",{className:"bk-nav-actions"},
      crumb&&React.createElement("span",{className:"mono",style:{fontSize:11,color:"var(--text-2)",marginRight:4}},crumb),
      React.createElement("a",{className:"bk-nav-link",href:"../index.html"},React.createElement(Icon,{name:"home",size:13}),t(lang,"Bosh menyu","Hub")),
      React.createElement("button",{className:"bk-nav-link",onClick:()=>setLang(lang==="uz"?"en":"uz")},lang==="uz"?"EN":"UZ")));
}

// ── Library screen ────────────────────────────────────────────
function BookCover({book}){
  return React.createElement("div",{className:"bk-cover"},
    React.createElement("div",{className:"bk-cover-ico"},React.createElement(Icon,{name:book.coverIcon||"book",size:22})),
    React.createElement("div",null,
      React.createElement("div",{className:"bk-cover-ttl"},book.coverAbbr||"?"),
      React.createElement("div",{className:"bk-cover-auth"},book.coverBy||"")));
}
function LibraryScreen({onOpen,lang}){
  return React.createElement("div",{className:"page",style:{paddingTop:34}},
    React.createElement("div",{className:"bk-hero"},
      React.createElement("div",{className:"badge",style:{display:"inline-flex",alignItems:"center",gap:8,padding:"6px 12px",borderRadius:999,border:"1px solid var(--accent-border)",background:"var(--accent-soft)",fontFamily:"var(--font-mono)",fontSize:11,color:"var(--accent)",marginBottom:16}},
        React.createElement("span",{style:{width:6,height:6,borderRadius:"50%",background:"var(--accent)",boxShadow:"0 0 8px var(--accent)"}}),
        t(lang,"Ochiq litsenziyali kitoblar · o'zbek tilida","Open-licensed books · in Uzbek")),
      React.createElement("h1",{className:"display",style:{fontSize:38,margin:"0 0 10px",letterSpacing:"-0.02em"}},t(lang,"Kutubxona","Library")),
      React.createElement("p",{style:{color:"var(--text-1)",fontSize:15,lineHeight:1.65,margin:0}},
        t(lang,"Kiberxavfsizlik bo'yicha ochiq litsenziyali kitoblarning o'zbek tilidagi moslashmalari. Har bir kitobda muallif va litsenziya ko'rsatilgan. To'plam asta-sekin kengayib boradi.",
               "Uzbek adaptations of open-licensed cybersecurity books. Every book credits its author and license. The collection grows over time."))),
    React.createElement("div",{className:"bk-grid",style:{marginTop:28}},
      BOOKS.map(book=>React.createElement("div",{key:book.id,className:"bk-card",onClick:()=>onOpen(book.id)},
        React.createElement(BookCover,{book}),
        React.createElement("div",{className:"bk-card-body"},
          React.createElement("h3",{className:"bk-card-title"},t(lang,book.titleUz,book.titleEn)),
          React.createElement("div",{className:"bk-card-auth"},t(lang,"Muallif","Author")+": "+book.author),
          React.createElement("p",{className:"bk-card-desc"},t(lang,book.descUz,book.descEn)),
          React.createElement("div",{className:"bk-card-meta"},
            React.createElement("span",{className:"bk-lic"},book.license),
            React.createElement("span",{className:"chip chip-gray",style:{fontSize:9.5}},book.chapters.length+" "+t(lang,"bo'lim","chapters")),
            React.createElement("span",{style:{marginLeft:"auto",color:"var(--accent)",fontFamily:"var(--font-mono)",fontSize:11,display:"flex",alignItems:"center",gap:4}},
              t(lang,"O'qish","Read"),React.createElement(Icon,{name:"chevron",size:13})))))),
      React.createElement("div",{className:"bk-soon"},
        React.createElement(Icon,{name:"book",size:15}),
        t(lang,"Yangi kitoblar tez orada qo'shiladi…","More books coming soon…"))));
}

// ── Reader screen ─────────────────────────────────────────────
function ReaderScreen({book,ch,setCh,onHome,lang,setLang}){
  const [progress,setProgress]=useState(0);
  const chapter=book.chapters[ch];
  useEffect(()=>{window.scrollTo({top:0,behavior:"instant"});},[ch]);
  useEffect(()=>{
    const onScroll=()=>{
      const max=document.documentElement.scrollHeight-window.innerHeight;
      const p=max>0?Math.min(100,Math.max(0,window.scrollY/max*100)):0;
      setProgress(Math.round(p));
    };
    window.addEventListener("scroll",onScroll,{passive:true});onScroll();
    return()=>window.removeEventListener("scroll",onScroll);
  },[ch]);

  const prev=ch>0?book.chapters[ch-1]:null;
  const next=ch<book.chapters.length-1?book.chapters[ch+1]:null;

  return React.createElement("div",null,
    React.createElement(TopNav,{onHome,lang,setLang,crumb:t(lang,book.titleUz,book.titleEn)}),
    React.createElement("div",{className:"bk-progline"},React.createElement("div",{className:"bk-progline-fill",style:{width:progress+"%"}})),
    React.createElement("div",{className:"bk-reader"},
      // TOC sidebar
      React.createElement("aside",{className:"bk-toc"},
        React.createElement("button",{className:"bk-nav-link",style:{marginBottom:14,paddingLeft:0},onClick:onHome},
          React.createElement(Icon,{name:"arrowL",size:13}),t(lang,"Kutubxona","Library")),
        React.createElement("div",{className:"bk-toc-h"},t(lang,"// MUNDARIJA","// CONTENTS")),
        book.chapters.map((c,i)=>React.createElement("button",{key:i,className:"bk-toc-item"+(i===ch?" active":""),onClick:()=>setCh(i)},
          React.createElement("span",{className:"bk-toc-num"},i===0?"—":String(i).padStart(2,"0")),
          React.createElement("span",{className:"bk-toc-txt"},t(lang,c.uz,c.en))))),
      // Content
      React.createElement("div",{className:"bk-content"},
        React.createElement("div",{className:"bk-content-inner"},
          React.createElement("div",{className:"bk-ch-eyebrow"},ch===0?t(lang,"KIRISH","INTRO"):t(lang,"BOB "+String(ch).padStart(2,"0"),"CHAPTER "+String(ch).padStart(2,"0"))),
          React.createElement("h1",{className:"bk-ch-title"},t(lang,chapter.uz,chapter.en)),
          chapter.subUz&&React.createElement("p",{className:"bk-ch-sub"},t(lang,chapter.subUz,chapter.subEn)),
          chapter.blocks.map((b,i)=>React.createElement(Block,{key:i,b,book})),
          // chapter nav
          React.createElement("div",{className:"bk-chnav"},
            prev?React.createElement("button",{className:"bk-chnav-btn",onClick:()=>setCh(ch-1)},
              React.createElement("span",{className:"bk-chnav-lbl"},"← "+t(lang,"Oldingi","Previous")),
              React.createElement("span",{className:"bk-chnav-ttl"},t(lang,prev.uz,prev.en))):React.createElement("div"),
            next?React.createElement("button",{className:"bk-chnav-btn next",onClick:()=>setCh(ch+1)},
              React.createElement("span",{className:"bk-chnav-lbl"},t(lang,"Keyingi","Next")+" →"),
              React.createElement("span",{className:"bk-chnav-ttl"},t(lang,next.uz,next.en))):React.createElement("div")))))
  );
}

// ── App root ──────────────────────────────────────────────────
function App(){
  const [lang,_setLang]=useState(()=>{try{return localStorage.getItem(LANG_KEY)||localStorage.getItem("cs_lang")||"uz";}catch{return"uz";}});
  const setLang=v=>{_setLang(v);try{localStorage.setItem(LANG_KEY,v);}catch{}};
  const [route,setRoute]=useState(()=>{try{const s=localStorage.getItem(LAST_KEY);if(s)return JSON.parse(s);}catch{}return{view:"library"};});
  useEffect(()=>{try{localStorage.setItem(LAST_KEY,JSON.stringify(route));}catch{}},[route]);
  useEffect(()=>{document.documentElement.lang=lang;},[lang]);

  const openBook=id=>setRoute({view:"reader",book:id,ch:0});
  const goHome=()=>setRoute({view:"library"});

  let screen;
  if(route.view==="reader"){
    const book=BOOKS.find(b=>b.id===route.book)||BOOKS[0];
    const ch=Math.min(route.ch||0,book.chapters.length-1);
    screen=React.createElement(ReaderScreen,{book,ch,setCh:i=>setRoute({view:"reader",book:book.id,ch:i}),onHome:goHome,lang,setLang});
  }else{
    screen=React.createElement("div",null,
      React.createElement(TopNav,{onHome:goHome,lang,setLang}),
      React.createElement(LibraryScreen,{onOpen:openBook,lang}));
  }
  return React.createElement(LangCtx.Provider,{value:lang},screen);
}

// ── Mount ─────────────────────────────────────────────────────
const _root=document.getElementById("app");
if(_root){ReactDOM.createRoot(_root).render(React.createElement(App,null));}

// ── Animated background particles (matches other modules) ──────
(function(){
  function initBg(){
    var el=document.getElementById("bg-root");
    if(!el)return;
    el.className="bg-stage bg-scan";
    [].slice.call(el.querySelectorAll(".particle")).forEach(function(p){p.remove();});
    for(var i=0;i<140;i++){
      var p=document.createElement("div");
      var isStar=i%5===0;
      p.className="particle"+(isStar?" particle-star":"");
      var s=isStar?3+Math.random()*3:1+Math.random()*2;
      p.style.width=p.style.height=s+"px";
      p.style.left=(Math.random()*100)+"%";
      p.style.top=(Math.random()*100)+"%";
      var angle=Math.random()*Math.PI*2;
      var dist=120+Math.random()*220;
      p.style.setProperty("--dx",(Math.cos(angle)*dist)+"px");
      p.style.setProperty("--dy",(Math.sin(angle)*dist-80)+"px");
      p.style.animationDuration=(isStar?20:12+Math.random()*20)+"s";
      p.style.animationDelay=(-Math.random()*35)+"s";
      el.appendChild(p);
    }
  }
  if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",initBg);}
  else{initBg();}
})();
