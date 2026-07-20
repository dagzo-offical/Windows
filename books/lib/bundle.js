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
    // ── 7: Tools ───────────────────────────────────────────────
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
    // ── 7: Cases & next steps ──────────────────────────────────
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
