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

const BOOKS=[RE_BOOK];

// ── Colophon (attribution) block ──────────────────────────────
function Colophon({book}){
  const lang=useLang();
  const row=(k,v,href)=>React.createElement("div",{className:"bk-colophon-row"},
    React.createElement("span",{className:"k"},k),
    href?React.createElement("a",{href,target:"_blank",rel:"noopener noreferrer"},v,React.createElement(Icon,{name:"external",size:11,style:{marginLeft:4,verticalAlign:"middle"}})):React.createElement("span",{className:"v"},v));
  return React.createElement("div",{className:"bk-colophon"},
    React.createElement("h4",null,t(lang,"// MANBA VA MUALLIF","// SOURCE & AUTHOR")),
    row(t(lang,"Asl kitob","Original"),"Reverse Engineering for Beginners"),
    row(t(lang,"Muallif","Author"),book.author),
    row(t(lang,"Litsenziya","License"),book.license),
    row(t(lang,"Manba","Source"),book.source.replace("https://",""),book.source),
    React.createElement("div",{className:"bk-colophon-row",style:{marginTop:8}},
      React.createElement("span",{className:"v",style:{fontSize:12,color:"var(--text-2)"}},
        t(lang,"Bu — o'zbek tilidagi original moslashma; asosiy tushunchalar CC BY-SA 4.0 litsenziyasi asosida qayta yozilgan va muallif ko'rsatilgan.",
               "This is an original Uzbek adaptation; the core concepts are rewritten under the CC BY-SA 4.0 license with attribution to the author."))));
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
    React.createElement("div",{className:"bk-cover-ico"},React.createElement(Icon,{name:"cpu",size:22})),
    React.createElement("div",null,
      React.createElement("div",{className:"bk-cover-ttl"},"RE"),
      React.createElement("div",{className:"bk-cover-auth"},"Yurichev")));
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
