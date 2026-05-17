// quiz.jsx — quiz modal with REAL Claude grading
// Flow: intro → answer 3 questions (written) → AI grades each → pass/fail summary

const { useState: useQS, useEffect: useQE, useRef: useQR } = React;

// Static fallback questions per lesson
const FALLBACK_QUESTIONS = {
  1: [
    { uz: "Operatsion tizim nima va u qanday 4 ta asosiy vazifani bajaradi? Windows bu vazifalarni qanday amalga oshiradi?", en: "What is an operating system and what are its 4 main jobs? How does Windows carry these out?" },
    { uz: "User mode (ring 3) va Kernel mode (ring 0) farqini tushuntiring. Nega bu ikki rejim mavjud va ular o'rtasidagi chegara nima uchun muhim?", en: "Explain the difference between user mode (ring 3) and kernel mode (ring 0). Why do these two modes exist and why is the boundary important?" },
    { uz: "ntoskrnl.exe ichida Microkernel va Executive nima rol o'ynaydi? HAL (Hardware Abstraction Layer) nima uchun zarur?", en: "What roles do the Microkernel and Executive play inside ntoskrnl.exe? Why is the HAL (Hardware Abstraction Layer) needed?" },
  ],
  2: [
    { uz: "Kernel nima? U operatsion tizimda qanday asosiy vazifalarni bajaradi? Windows kerneli qaysi faylda joylashgan?", en: "What is a kernel? What are its main tasks in an operating system? Which file contains the Windows kernel?" },
    { uz: "ntoskrnl.exe ichida qanday asosiy qismlar bor? Microkernel va Executive o'rtasidagi farqni tushuntiring.", en: "What are the main parts inside ntoskrnl.exe? Explain the difference between the Microkernel and the Executive." },
    { uz: "Drayver nima va u nima uchun ring 0'da ishlaydi? Imzolanmagan drayver nima uchun xavfli?", en: "What is a driver and why does it run in ring 0? Why is an unsigned driver dangerous?" },
  ],
  3: [
    { uz: "Ring 3 (User mode) va Ring 0 (Kernel mode) nima? Protsessor bu chegarani qanday qilib ta'minlaydi?", en: "What are Ring 3 (user mode) and Ring 0 (kernel mode)? How does the CPU enforce this boundary?" },
    { uz: "User mode'da ishlayotgan dastur to'g'ridan-to'g'ri hardware'ga murojaat qila oladimi? Nima uchun? Kernel mode'da bunday murojaat mumkinmi?", en: "Can a user-mode program access hardware directly? Why or why not? Is this possible in kernel mode?" },
    { uz: "User mode'dagi dastur xato (crash) qilsa nima bo'ladi? Kernel mode'dagi kod xato qilsa nima bo'ladi? Farqi nimada?", en: "What happens when a user-mode program crashes? What happens when kernel-mode code crashes? What is the difference?" },
  ],
  4: [
    { uz: "Windows boot jarayonini UEFI'dan login ekraniga qadar 4-5 ta bosqichda tushuntiring. Har bir bosqichda nima sodir bo'ladi?", en: "Explain the Windows boot process from UEFI to the login screen in 4-5 steps. What happens at each stage?" },
    { uz: "Secure Boot nima va u nima uchun zarur? U qanday ishlaydi?", en: "What is Secure Boot and why is it needed? How does it work?" },
    { uz: "LSASS nima va u Windows'da qanday rol o'ynaydi? U nima uchun hujumchilar uchun qiziqarli?", en: "What is LSASS and what role does it play in Windows? Why is it a target for attackers?" },
  ],
  5: [
    { uz: "BIOS va UEFI nima? Ularning asosiy arxitektura farqlari nimada — rejim, xotira, disk chegaralari?", en: "What are BIOS and UEFI? What are their main architectural differences — mode, memory, disk limits?" },
    { uz: "MBR va GPT bo'lim jadvallari nima? Ular bir-biridan qanday farq qiladi va qaysi firmware bilan ishlaydi?", en: "What are MBR and GPT partition tables? How do they differ and which firmware works with each?" },
    { uz: "Nima uchun BIOS davridagi tizimlar MBR bootkit hujumlariga zaif edi? UEFI Secure Boot bu muammoni qanday hal qiladi?", en: "Why were BIOS-era systems vulnerable to MBR bootkit attacks? How does UEFI Secure Boot address this?" },
  ],
  6: [
    { uz: "Secure Boot nima va u nima uchun yaratilgan? PK, KEK, db va dbx kalitlari qanday ierarxiya hosil qiladi va har birining roli nima?", en: "What is Secure Boot and why was it created? How do the PK, KEK, db, and dbx keys form a hierarchy and what is each one's role?" },
    { uz: "Secure Boot tekshiruvi qanday ishlaydi — UEFI firmware bootloaderni yuklashdan oldin qanday tekshiradi? Tekshiruv muvaffaqiyatsiz bo'lsa nima bo'ladi?", en: "How does Secure Boot verification work — how does UEFI firmware verify a bootloader before running it? What happens if verification fails?" },
    { uz: "BlackLotus (CVE-2022-21894) yoki BootHole (CVE-2020-10713) kabi haqiqiy Secure Boot chetlab o'tish texnikasini tushuntiring. Bu hujum qanday ishladi va Microsoft qanday javob berdi?", en: "Explain a real Secure Boot bypass technique such as BlackLotus (CVE-2022-21894) or BootHole (CVE-2020-10713). How did the attack work and how did Microsoft respond?" },
  ],
  7: [
    { uz: "TPM (Trusted Platform Module) nima va u qanday asosiy kriptografik funksiyalarni ta'minlaydi? fTPM va diskret TPM o'rtasidagi farq nima?", en: "What is a TPM (Trusted Platform Module) and what core cryptographic functions does it provide? What is the difference between fTPM and a discrete TPM?" },
    { uz: "PCR (Platform Configuration Register) nima va u qanday ishlaydi? BitLocker PCR larni qanday ishlatadi va nima uchun bu muhim?", en: "What is a PCR (Platform Configuration Register) and how does it work? How does BitLocker use PCRs and why does this matter?" },
    { uz: "TPM ga qarshi haqiqiy hujum vektorini tushuntiring — masalan, Evil Maid hujumi yoki TPM avtobus tinglash. Bu hujum qanday ishlaydi va qanday kamaytiriladi?", en: "Explain a real attack vector against TPM — for example, the Evil Maid attack or TPM bus sniffing. How does the attack work and how is it mitigated?" },
  ],
  8: [
    { uz: "Windows Registry nima? Uning 5 ta asosiy kaliti (HKLM, HKCU, HKCR, HKU, HKCC) nima uchun ishlatiladi va ular qaysi disk fayllariga mos keladi?", en: "What is the Windows Registry? What are its 5 root keys (HKLM, HKCU, HKCR, HKU, HKCC) used for and which disk files do they map to?" },
    { uz: "Zararli dasturlar registry'ni persistenslik uchun qanday ishlatadi? Kamida 3 ta keng tarqalgan persistenslik joyini va ular nima uchun xavfli ekanini tushuntiring.", en: "How do malware programs use the registry for persistence? Name at least 3 commonly abused persistence locations and explain why each is dangerous." },
    { uz: "Registry monitoring uchun qanday vositalar ishlatiladi? Sysmon Event ID 13, Process Monitor va Autoruns ning har biri nima qiladi?", en: "What tools are used for registry monitoring? What does each of Sysmon Event ID 13, Process Monitor, and Autoruns do?" },
  ],
  9: [
    { uz: "Windows I/O Menejeri va IRP modeli nima? Dastur ReadFile() chaqirganda, so'rov qanday drayver stekidan o'tadi?", en: "What is the Windows I/O Manager and IRP model? When an application calls ReadFile(), how does the request pass through the driver stack?" },
    { uz: "FAT32, NTFS va exFAT o'rtasidagi asosiy farqlarni solishtiring — maks fayl hajmi, ruxsatlar, jurnalling va xavfsizlik nuqtai nazaridan.", en: "Compare the main differences between FAT32, NTFS, and exFAT — in terms of max file size, permissions, journaling, and security." },
    { uz: "Filtr drayverlari nima va ular Windows fayl tizimi xavfsizligi uchun nima uchun muhim? Bir nechta filtr drayveri misolini keltiring.", en: "What are filter drivers and why are they important for Windows file system security? Give several examples of filter drivers." },
  ],
  10: [
    { uz: "NTFS Master Fayl Jadvali (MFT) nima? Rezident va norezident ma'lumotlar o'rtasidagi farq nima va bu forensics uchun nima anglatadi?", en: "What is the NTFS Master File Table (MFT)? What is the difference between resident and non-resident data and what does this mean for forensics?" },
    { uz: "NTFS Muqobil Ma'lumot Oqimlari (ADS) nima? Zararli dasturlar ularni qanday ishlatadi va ADS ni qanday aniqlash mumkin?", en: "What are NTFS Alternate Data Streams (ADS)? How do malware programs use them and how can ADS be detected?" },
    { uz: "NTFS ruxsatlari va ulashish ruxsatlari o'rtasidagi farq nima? Tarmoq orqali faylga kirishda ular qanday birgalikda ishlaydi? $UsnJrnl nima va forensics uchun nima uchun muhim?", en: "What is the difference between NTFS permissions and share permissions? How do they work together when accessing a file over the network? What is $UsnJrnl and why is it important for forensics?" },
  ],
  11: [
    { uz: "FAT32 da fayl ma'lumotlari diskda qanday saqlanadi? FAT jadvali, klaster zanjiri va katalog yozuvlari bir-biri bilan qanday bog'liq?", en: "How is file data stored on disk in FAT32? How do the FAT table, cluster chain, and directory entries relate to each other?" },
    { uz: "FAT32 ning asosiy cheklovlari nimalar — xususan 4 GB fayl hajmi chegarasi nima uchun mavjud va u qanday muammolarga olib keladi? 32 GB hajm chegarasi qanday chetlab o'tiladi?", en: "What are FAT32's main limitations — specifically why does the 4 GB file size limit exist and what problems does it cause? How is the 32 GB volume limit bypassed?" },
    { uz: "Nima uchun EFI Tizim Bo'limi (ESP) FAT32 sifatida formatlanishi shart? Bu xavfsizlik nuqtai nazaridan qanday muammolar tug'diradi?", en: "Why must the EFI System Partition (ESP) be formatted as FAT32? What security implications does this create?" },
  ],
  12: [
    { uz: "Windows'da jarayon nima? EPROCESS tuzilmasida qanday asosiy maydonlar bor va ular birgalikda jarayon izolyatsiyasini qanday ta'minlaydi?", en: "What is a process in Windows? What are the key fields in the EPROCESS structure and how do they together provide process isolation?" },
    { uz: "Kirish tokeni nima va u jarayon xavfsizlik kontekstini qanday belgilaydi? Yaxlitlik darajalari (Integrity Levels) nima va UAC qanday ishlaydi?", en: "What is an access token and how does it define a process's security context? What are Integrity Levels and how does UAC work?" },
    { uz: "DLL in'ektsiya va jarayon bo'shatish (process hollowing) texnikalarini tushuntiring. Ular qanday ishlaydi va qanday aniqlanadi?", en: "Explain the DLL injection and process hollowing techniques. How does each one work and how are they detected?" },
  ],
  13: [
    { uz: "Thread nima va u jarayondan qanday farq qiladi? ETHREAD va TEB tuzilmalari qanday asosiy ma'lumotlarni saqlaydi?", en: "What is a thread and how does it differ from a process? What key information do the ETHREAD and TEB structures contain?" },
    { uz: "Windows rejalashtiruvchisi qanday ishlaydi? 0-31 prioritet darajalari, kvant va prioritet ko'tarish mexanizmini tushuntiring.", en: "How does the Windows scheduler work? Explain the 0-31 priority levels, thread quantum, and the priority boost mechanism." },
    { uz: "Thread in'ektsiya texnikalarini solishtiring: CreateRemoteThread, QueueUserAPC va Thread Hijacking. Har biri qanday ishlaydi va Sysmon qaysi hodisalarni yozib oladi?", en: "Compare thread injection techniques: CreateRemoteThread, QueueUserAPC, and Thread Hijacking. How does each work and which Sysmon events capture them?" },
  ],
  14: [
    { uz: "Windows da handle nima? Handle javalining tuzilishi (ObjectPointerBits, GrantedAccessBits, Attributes) qanday va kirish huquqlari nima uchun ochilish vaqtida belgilanadi, har bir foydalanishda emas?", en: "What is a handle in Windows? How is a handle table entry structured (ObjectPointerBits, GrantedAccessBits, Attributes), and why are access rights baked in at open time rather than checked on every use?" },
    { uz: "DuplicateHandle API qanday ishlaydi va u nima uchun xavfsizlik xavfini tug'diradi? Handle o'g'irlash texnikasini tushuntiring — hujumchi qanday EDR hookini chetlab o'tib LSASS xotirasini o'qiy oladi?", en: "How does DuplicateHandle work and why does it create a security risk? Explain the handle theft technique — how can an attacker read LSASS memory while bypassing EDR hooks on OpenProcess?" },
    { uz: "Handle sizishi nima va u uzoq muddatli xizmat uchun nima uchun muammo? Handle sizishini qanday aniqlash va kuzatish mumkin? OBJECT_HEADER da HandleCount va PointerCount ning farqi nima?", en: "What is a handle leak and why is it a problem for a long-running service? How can you detect and track handle leaks? What is the difference between HandleCount and PointerCount in OBJECT_HEADER?" },
  ],
  15: [
    { uz: "Windows Service Control Manager (SCM) nima va u services.exe da qanday ishlaydi? Servislarning hayot tsiklini boshqarish uchun SCM qanday mexanizmlardan foydalanadi (bog'liqlik hal qilish, muvaffaqiyatsizlik harakatlari, DACL)?", en: "What is the Windows Service Control Manager (SCM) and how does it run inside services.exe? What mechanisms does the SCM use to manage service lifecycles — dependency resolution, failure actions, and DACLs?" },
    { uz: "Servis akkauntlarini solishtiring: LocalSystem, LocalService, NetworkService va Virtual Servis Akkaunti. Har birining imtiyozlari va tarmoq identifikatori nimadan iborat va qaysi biri eng xavfli va nima uchun?", en: "Compare service accounts: LocalSystem, LocalService, NetworkService, and Virtual Service Account. What are the privileges and network identity of each, and which is most dangerous and why?" },
    { uz: "Servis persistenslik va imtiyoz ko'tarish uchun ishlatiladigan kamida 3 ta texnikani tushuntiring — masalan, yangi servis yaratish, qo'shtirnoqsiz servis yo'li va DLL qidiruv tartibi o'g'irlash. Har biri qanday ishlaydi va qanday aniqlanadi?", en: "Explain at least 3 techniques attackers use for service-based persistence and privilege escalation — such as creating a new service, unquoted service path, and DLL search order hijacking. How does each work and how is it detected?" },
  ],
  16: [
    { uz: "Windows da foydalanuvchi hisobi turlari nimalar? Mahalliy administrator, standart foydalanuvchi, SYSTEM, LocalService va NetworkService o'rtasidagi imtiyozlar farqini tushuntiring. Qaysi hisob eng kuchli va nima uchun?", en: "What are the types of user accounts in Windows? Explain the privilege differences between Local Administrator, Standard User, SYSTEM, LocalService, and NetworkService. Which account is most privileged and why?" },
    { uz: "SID (Security Identifier) va RID (Relative Identifier) nima? S-1-5-21-...-500 formatini tushuntiring va taniqli SIDlar (SYSTEM S-1-5-18, Everyone S-1-1-0) nima uchun muhim? SAM ma'lumotlar bazasi nima saqlaydi?", en: "What is a SID (Security Identifier) and RID (Relative Identifier)? Explain the S-1-5-21-...-500 format and why well-known SIDs (SYSTEM S-1-5-18, Everyone S-1-1-0) matter. What does the SAM database store?" },
    { uz: "NTLM parol xeshlash jarayonini tushuntiring: Unicode, MD4, NT hash qanday hosil bo'ladi? DPAPI nima va u foydalanuvchi ma'lumotlarini himoya qilishda qanday rol o'ynaydi? Hujumchi SAM dan xeshlarni qanday o'g'irlaydi?", en: "Explain the NTLM password hashing process: how is the Unicode → MD4 → NT hash produced? What is DPAPI and what role does it play in protecting user credentials? How can an attacker steal hashes from the SAM database?" },
  ],
  17: [
    { uz: "UAC (User Account Control) nima va u nega 'xavfsizlik chegarasi emas' deb hisoblanadi? Ajratilgan token modeli qanday ishlaydi — filtrlangan token va elevated token o'rtasidagi farq nima?", en: "What is UAC (User Account Control) and why is it considered 'not a security boundary'? How does the split-token model work — what is the difference between a filtered token and an elevated token?" },
    { uz: "Windows yaxlitlik darajalarini (Integrity Levels) tushuntiring: Untrusted, Low, Medium, High, System va Protected Process. Har birining SIDi nima? MIC (Mandatory Integrity Control) qanday write-up va read-down siyosatini ta'minlaydi?", en: "Explain Windows integrity levels: Untrusted, Low, Medium, High, System, and Protected Process. What is the SID for each? How does MIC (Mandatory Integrity Control) enforce write-up and read-down policies?" },
    { uz: "UAC bypass texnikalarini solishtiring: fodhelper registry hijacking, SilentCleanup vazifasi va eventvwr COM hijacking. Har biri qanday ishlaydi va ular qanday aniqlash mumkin? Auto-elevatsiya uchun bajariladigan 3 ta mezon nima?", en: "Compare UAC bypass techniques: fodhelper registry hijacking, SilentCleanup task, and eventvwr COM hijacking. How does each work and how can they be detected? What are the 3 criteria that must be met for auto-elevation?" },
  ],
  18: [
    { uz: "DLL nima va u EXE dan qanday farq qiladi? Implicit va explicit DLL bog'lash o'rtasidagi farqni tushuntiring — loader ularni qachon va qanday qayta ishlaydi?", en: "What is a DLL and how does it differ from an EXE? Explain the difference between implicit and explicit DLL linking — when and how does the loader process each?" },
    { uz: "Windows DLL qidiruv tartibi nima? Hujumchilar DLL hijacking uchun qaysi bosqichlarni ekspluatatsiya qiladi va bu hujumni Process Monitor yordamida qanday aniqlash mumkin?", en: "What is the Windows DLL search order? Which steps do attackers exploit for DLL hijacking and how can this attack be detected using Process Monitor?" },
    { uz: "Klassik DLL in'ektsiya, reflektiv DLL in'ektsiya va COM hijacking texnikalarini solishtiring. Har biri qanday ishlaydi, qanday aniqlash mumkin va DllMain da nima uchun LoadLibrary ni chaqirmaslik kerak?", en: "Compare classic DLL injection, reflective DLL injection, and COM hijacking techniques. How does each work, how is it detected, and why must you never call LoadLibrary from inside DllMain?" },
  ],
  19: [
    { uz: "Windows API qatlamli stekini tushuntiring: dasturdan ntdll gacha, va ntdll dan kernel SSDT gacha. Har bir qatlamning vazifasi nima va syscall ko'rsatmasi qanday CPU rejimini almashtiradi?", en: "Explain the Windows API layered stack: from the application to ntdll, and from ntdll to the kernel SSDT. What is the role of each layer, and how does the SYSCALL instruction switch CPU modes?" },
    { uz: "IAT hooking, inline hooking (trampolin) va SSDT hookingni solishtiring. Har biri qanday ishlaydi, qaysi biri zamonaviy EDR lar tomonidan qo'llaniladi va hujumchilar foydalanuvchi makon hooklerini qanday chetlab o'tadi (to'g'ridan-to'g'ri syscall, ntdll unhooking)?", en: "Compare IAT hooking, inline hooking (trampoline), and SSDT hooking. How does each work, which is used by modern EDRs, and how do attackers bypass userland hooks (direct syscall, ntdll unhooking)?" },
    { uz: "WOW64 nima va u 32-bit jarayon 64-bit Windows da syscall bajarganida qanday ishlaydi? 'Heaven's Gate' nima va u nima uchun xavfsizlik aniqlash bo'shlig'ini yaratadi?", en: "What is WOW64 and how does it work when a 32-bit process makes a syscall on 64-bit Windows? What is 'Heaven's Gate' and why does it create a security detection gap?" },
  ],
  20: [
    { uz: "ETW (Event Tracing for Windows) arxitekturasini tushuntiring: provayder, seans va iste'molchi rollari. Security jurnali standart bo'yicha oz narsa jurnallaydigan bo'lsa, xavfsizlik auditi uchun muhim hodisalarni (4624, 4688, 7045) yoqish uchun nima qilish kerak?", en: "Explain the ETW (Event Tracing for Windows) architecture: the roles of provider, session, and consumer. If the Security log logs very little by default, what must be done to enable important security events (4624, 4688, 7045) for auditing?" },
    { uz: "Sysmon Event ID 1, 3, 8 va 10 ni solishtiring. Har biri nima qayd etadi va qaysi biri LSASS hisob ma'lumotlarini dumplash uchun eng muhim aniqlash signal beradi? Nima uchun?", en: "Compare Sysmon Event IDs 1, 3, 8, and 10. What does each record, and which provides the most critical detection signal for LSASS credential dumping? Why?" },
    { uz: "Hujumchi jurnal izlarini yo'q qilish uchun qanday 4 xil usul qo'llashi mumkin — wevtutil tozalash, ETW provider yamash, Sysmon drayverni to'xtatish va VSS o'chirish? Har biri uchun aniqlash strategiyasini tushuntiring.", en: "What are 4 different methods an attacker might use to destroy log evidence — wevtutil clearing, ETW provider patching, Sysmon driver stopping, and VSS deletion? Explain a detection strategy for each." },
  ],
  21: [
    { uz: "Windows Task Scheduler vazifasining XML tuzilishini tushuntiring: Triggers, Principals, Actions va Settings elementlari nima uchun kerak? RunLevel=HighestAvailable nima anglatadi va u UAC bilan qanday bog'liq?", en: "Explain the XML structure of a Windows Task Scheduler task: what are the Triggers, Principals, Actions, and Settings elements for? What does RunLevel=HighestAvailable mean and how does it relate to UAC?" },
    { uz: "Rejalashtirilgan vazifa trigger turlaridan qaysilari (CalendarTrigger, LogonTrigger, BootTrigger) hujumchi persistenslik uchun eng ko'p ishlatiladi va nima uchun? SilentCleanup vazifasi orqali UAC bypass qanday ishlaydi?", en: "Which scheduled task trigger types (CalendarTrigger, LogonTrigger, BootTrigger) are most used by attackers for persistence and why? How does the UAC bypass via the SilentCleanup task work?" },
    { uz: "ComHandler harakat turi nima va u klassik Exec harakatdan qanday farq qiladi? Hujumchi ComHandler dan faylsiz persistenslik uchun qanday foydalana oladi va u aniqlash uchun nima uchun qiyinroq?", en: "What is the ComHandler action type and how does it differ from a classic Exec action? How can an attacker use ComHandler for fileless persistence and why is it harder to detect?" },
  ],
  22: [
    { uz: "EVTX ikkilik formatini tushuntiring: fayl sarlavhasi, chunk va hodisa yozuv tuzilmalari. Yozuv ID bo'shliqlari nima uchun jurnal buzishining dalili va Windows Hodisa Jurnali xizmati normal ishlashda qanday yozuvlar bilan ishlaydi?", en: "Explain the EVTX binary format: file header, chunk, and event record structures. Why are Record ID gaps evidence of log tampering, and how does the Windows Event Log service handle records during normal operation?" },
    { uz: "Windows forensics uchun EVTX fayllaridan tashqari eng muhim 5 ta artefaktni keltiring (masalan, Prefetch, AmCache, SRUM, $MFT, Shimcache). Har biri qanday ma'lumot beradi va ular nima uchun hodisa jurnallarini o'chirib tashlash bilan yo'q qilinmaydi?", en: "Name the 5 most important forensic artifacts beyond EVTX files (e.g., Prefetch, AmCache, SRUM, $MFT, Shimcache). What information does each provide and why can't they be destroyed by simply clearing event logs?" },
    { uz: "Hujumga javob berish triage ish oqimini tushuntiring: to'plash (KAPE), vaqt jadvali yaratish (MFTECmd), triage tahlil (Chainsaw/Sigma), pivotlash va qamrovni aniqlash. Har bir bosqichda qaysi vositalar va artefaktlar ishlatiladi?", en: "Explain the incident response triage workflow: collection (KAPE), timeline building (MFTECmd), triage analysis (Chainsaw/Sigma), pivoting, and scoping. Which tools and artifacts are used at each stage?" },
  ],
  23: [
    { uz: "Windows Settings ilovasi va Control Panel o'rtasidagi asosiy farqlarni tushuntiring. ms-settings: URI sxemasi qanday ishlaydi va u qaysi registry joylari bilan bog'liq? Kamida 5 ta muhim xavfsizlikka oid Settings va Control Panel appletini keltiring.", en: "Explain the main differences between the Windows Settings app and Control Panel. How does the ms-settings: URI scheme work and which registry locations does it map to? Name at least 5 important security-relevant Settings and Control Panel applets." },
    { uz: "Guruh siyosati (gpedit.msc) Settings ilovasining sozlamalarini qanday bekor qiladi? AppLocker, SRP va PowerShell bajarish siyosatini tushuntiring. Bu siyosatlar qaysi registry yo'llarida saqlanadi?", en: "How does Group Policy (gpedit.msc) override Settings app options? Explain AppLocker, Software Restriction Policies, and PowerShell execution policy. Which registry paths store these policies?" },
    { uz: "Zararli dastur Windows da persistenslik uchun Settings ga bog'liq joylardan qanday foydalanishi mumkin? HKCU va HKLM Run kalitlari, Startup papkasi va Windows hizmatlarini misol sifatida keltiring. Ularni qanday aniqlash mumkin?", en: "How can malware use Settings-adjacent locations for persistence on Windows? Give examples using HKCU and HKLM Run keys, Startup folder, and Windows services. How can each be detected?" },
  ],
  24: [
    { uz: "msconfig.exe ning 5 ta tabini tushuntiring: Umumiy (Normal, Tashxisli, Tanlovli ishga tushish), Yuklash (SafeBoot rejimlari, BCD parametrlari), Xizmatlar, Ishga tushish va Vositalar. Har birida nima boshqariladi?", en: "Explain msconfig.exe's 5 tabs: General (Normal, Diagnostic, Selective startup), Boot (SafeBoot modes, BCD options), Services, Startup, and Tools. What is controlled in each?" },
    { uz: "Xavfsiz Yuklashning 4 ta rejimini solishtiring: Minimal, Muqobil qobiq, Tarmoq va Active Directory Ta'mirlash. Ular qanday farqlanadi va qaysi holatda qo'llaniladi? bcdedit bilan SafeBoot qanday o'rnatiladi?", en: "Compare the 4 Safe Boot modes: Minimal, Alternate Shell, Network, and Active Directory Repair. How do they differ and when is each used? How do you set SafeBoot with bcdedit?" },
    { uz: "Hujumchilar msconfig va xizmatlar boshqaruvini qanday qilib suiiste'mol qilishi mumkin? Xavfsizlik xizmatlarini o'chirib qo'yish, yuklash jurnalidan foydalanish va barcha xavfsizlik sozlamalarini bekor qiluvchi BCD parametrlari bilan bog'liq hujum stsenariylarini tushuntiring.", en: "How can attackers abuse msconfig and service management? Explain attack scenarios involving disabling security services, leveraging boot logs, and BCD settings that bypass all security configurations." },
  ],
  25: [
    { uz: "sysdm.cpl ning 5 ta tabini tushuntiring. Kengaytirilgan tabdagi 3 ta qism nima: Ishlash (DEP, virtual xotira), Foydalanuvchi profillari va Ishga tushish va tiklanish (BSOD dump turlari)? pagefile.sys va hiberfil.sys forensics uchun nima uchun muhim?", en: "Explain sysdm.cpl's 5 tabs. What are the 3 sections in the Advanced tab: Performance (DEP, virtual memory), User Profiles, and Startup and Recovery (BSOD dump types)? Why are pagefile.sys and hiberfil.sys important for forensics?" },
    { uz: "DEP (Data Execution Prevention) nima va u qanday ishlaydi? Apparat DEP va dasturiy DEP o'rtasidagi farq nima? DEP + ASLR + CFG + CET kombinatsiyasi zamonaviy Windows da shellcode bajarilishini qanday oldini oladi?", en: "What is DEP (Data Execution Prevention) and how does it work? What is the difference between hardware DEP (NX/XD bit) and software DEP? How does the combination of DEP + ASLR + CFG + CET prevent shellcode execution on modern Windows?" },
    { uz: "Volume Shadow Copy Service (VSS) nima va tizimni tiklash qanday ishlaydi? Ransomware soya nusxalarini o'chirish uchun qanday 4 ta buyruqdan foydalanadi? RDP (Remote Desktop) xavfsizlik tavakkalchiliklari: BlueKeep, Pass-the-Hash va NLA o'chirilganda nima sodir bo'ladi?", en: "What is Volume Shadow Copy Service (VSS) and how does System Restore work? What 4 commands does ransomware use to delete shadow copies? RDP security risks: BlueKeep, Pass-the-Hash with Restricted Admin mode, and what happens when NLA is disabled?" },
  ],
  26: [
    { uz: "Kompyuter Boshqaruvi (compmgmt.msc) ning to'liq daraxt tuzilishini tushuntiring: Tizim Vositalari (Vazifa Rejalashtiruvchi, Hodisa Ko'ruvchi, Ulashilgan Papkalar, Mahalliy Foydalanuvchilar, Ishlash, Qurilma menejeri), Saqlash (Disk Boshqaruvi) va Xizmatlar va Ilovalar (Xizmatlar, WMI Nazorati).", en: "Explain the full Computer Management (compmgmt.msc) tree: System Tools (Task Scheduler, Event Viewer, Shared Folders, Local Users and Groups, Performance, Device Manager), Storage (Disk Management), and Services and Applications (Services, WMI Control)." },
    { uz: "Ulashilgan Papkalar tuguni qanday xavfsizlik ma'lumotlarini beradi? C$, ADMIN$, IPC$, SYSVOL va NETLOGON ulashimlarining xavfsizlik oqibatlarini tushuntiring. Hujumchilar ular orqali lateral harakat qilish uchun qanday vositalardan foydalanadi (PsExec, Impacket, SharpSMB)?", en: "What security information does the Shared Folders node reveal? Explain the security implications of C$, ADMIN$, IPC$, SYSVOL, and NETLOGON shares. What tools do attackers use to move laterally through them (PsExec, Impacket, SharpSMB)?" },
    { uz: "WMI persistenslik mexanizmini tushuntiring: __EventFilter, __EventConsumer va __FilterToConsumerBinding obyektlari qanday birlashadi? Bu mexanizm nima uchun qayta yoqishdan omon qoladi? Sysmon Event ID 19, 20, 21 va Autoruns.exe bilan qanday aniqlash mumkin?", en: "Explain the WMI persistence mechanism: how do __EventFilter, __EventConsumer, and __FilterToConsumerBinding objects combine? Why does this mechanism survive reboots? How can it be detected with Sysmon Event IDs 19, 20, 21 and Autoruns.exe?" },
  ],
  27: [
    { uz: "Resource Monitor (resmon.exe) ning 4 ta tabini tushuntiring: CPU (Jarayonlar, Xizmatlar, Deskriptorlar, Modullar), Memory (Ishlash to'p, Shaxsiy, Umumlashtirilgan, Qattiq xatolar, jismoniy xotira paneli), Disk (fayl I/O, yo'l, o'qish/yozish tezligi), Network (TCP ulanishlar, tinglash portlari). Har bir tab qanday xavfsizlik ma'lumotlarini beradi?", en: "Explain Resource Monitor's 4 tabs: CPU (Processes, Services, Handles, Modules), Memory (Working Set, Private, Shareable, Hard Faults, physical memory bar), Disk (file I/O, path, read/write speeds), Network (TCP connections, listening ports). What security information does each tab provide?" },
    { uz: "Resource Monitor ning Network tabida nishonlaydigan 4 ta shubhali ko'rsatgichni tushuntiring: C2 mayoq, kutilmagan tinglovchi port, zararli svchost ulanishi va ma'lumot eksfiltratsiyasi. Ular qanday ko'rinadi va netstat bilan qanday farq qiladi?", en: "Explain 4 suspicious indicators to target in Resource Monitor's Network tab: C2 beacon, unexpected listening port, malicious svchost connection, and data exfiltration. What do they look like and how do they differ from netstat?" },
    { uz: "cmd.exe da xavfsizlik uchun muhim bo'lgan buyruqlarni tushuntiring: whoami /priv va /groups, netstat -ano, net user, net localgroup, net share, net session. Har biri qanday ma'lumot beradi va hujumchi qanday razvedka maqsadida ishlatishi mumkin?", en: "Explain the security-relevant cmd.exe commands: whoami /priv and /groups, netstat -ano, net user, net localgroup, net share, net session. What information does each provide and how might an attacker use them for reconnaissance?" },
  ],
  28: [
    { uz: "Win32 oyna modelini tushuntiring: HWND nima, WndProc qanday ishlaydi va xabar nasosi (message pump) nima uchun muhim? SendMessage va PostMessage orasidagi farq nima?", en: "Explain the Win32 window model: what is an HWND, how does WndProc work, and why is the message pump critical? What is the difference between SendMessage and PostMessage?" },
    { uz: "DWM (Desktop Window Manager) nima va u oynalarni qanday render qiladi? DWM ning xavfsizlik chegarasi sifatidagi roli nima va u crash bo'lganda nima sodir bo'ladi?", en: "What is DWM (Desktop Window Manager) and how does it render windows? What is DWM's role as a security boundary and what happens when it crashes?" },
    { uz: "UIPI (User Interface Privilege Isolation) shatter hujumlaridan qanday himoya qiladi? Clickjacking UAC prompts ga qanday ishlaydi va UAC Secure Desktop bu hujumni qanday yumshatadi?", en: "How does UIPI (User Interface Privilege Isolation) protect against shatter attacks? How does clickjacking work against UAC prompts and how does UAC Secure Desktop mitigate this attack?" },
  ],
};

const COOLDOWN_KEY = "wa_cooldown_end";
const COOLDOWN_DURATION = 30 * 60 * 1000; // 30 min in ms

function QuizModal({ onClose, onPass, onFail, lessonNum = 1 }) {
  const lang = useLang();
  const [phase, setPhase] = useQS("intro");
  const [questions, setQuestions] = useQS(null);
  const [answers, setAnswers] = useQS(["", "", ""]);
  const [current, setCurrent] = useQS(0);
  const [results, setResults] = useQS(null);
  const [loading, setLoading] = useQS(false);
  const [err, setErr] = useQS(null);

  const hasKey = () => !!(localStorage.getItem("wa_ai_provider") && localStorage.getItem("wa_ai_key"));

  const gradeOne = async (q, answer) => {
    const prompt = `You are a senior Windows internals instructor grading a student's written answer.

QUESTION (Uzbek): ${q.uz}
QUESTION (English): ${q.en}

STUDENT ANSWER:
"""
${answer || "(empty)"}
"""

Grade STRICTLY on technical correctness (40%), Windows/OS terminology (20%), real understanding of internals (20%), explanation quality (20%).
Empty/one-word answers get 0-20. Surface-level gets 30-50. Real depth with correct terms (ring 0/3, ntoskrnl, HAL, syscall, executive, LSASS, etc.) gets 70+. Expert security nuance gets 90+.

Return STRICT JSON only, no markdown fences. Feedback in ${lang === "en" ? "English" : "Uzbek"}:
{"score":<0-100>,"passed":<true if score>=70>,"strengths":["bullet","bullet"],"weaknesses":["bullet","bullet"],"feedback":"2-3 sentence feedback"}`;

    if (hasKey()) {
      const text = await gradeWithAI(prompt);
      const cleaned = text.replace(/^```json\s*[\r\n]?|```\s*$/g, "").trim();
      return JSON.parse(cleaned);
    }
    // fallback: word-count heuristic
    const wc = (answer || "").trim().split(/\s+/).filter(Boolean).length;
    const score = wc < 5 ? 10 : wc < 20 ? 30 : wc < 50 ? 55 : 72;
    return {
      score, passed: score >= 70,
      strengths: wc >= 50 ? [lang === "en" ? "Detailed answer" : "Batafsil javob"] : [],
      weaknesses: wc < 50 ? [lang === "en" ? "Too brief — AI key not set" : "Juda qisqa — AI kalit o'rnatilmagan"] : [],
      feedback: lang === "en" ? "Set an AI key in Tweaks panel for real grading." : "Haqiqiy baholash uchun Tweaks panelida AI kalitini o'rnating.",
    };
  };

  const TOPICS = {
    1: "Windows architecture basics (beginner-intermediate): what an OS does, user mode (ring 3) vs kernel mode (ring 0), Executive, Microkernel, HAL, ntoskrnl.exe. Ask clear conceptual questions a student can answer after reading the lesson.",
    2: "What is the kernel (beginner level): kernel definition, ntoskrnl.exe main components (Executive, Microkernel, HAL), drivers in ring 0 and why unsigned drivers are dangerous. Keep questions foundational.",
    3: "User mode vs kernel mode (beginner-intermediate): CPU privilege rings (ring 0 and ring 3), why the boundary exists, what each mode can/cannot do, crash impact differences. Practical and clear questions.",
    4: "Windows boot process (beginner-intermediate): UEFI/POST, Secure Boot, bootmgr.efi, winload.efi, kernel load, smss.exe, LSASS, login screen. Ask about the sequence and purpose of each step.",
    5: "BIOS vs UEFI (beginner-intermediate): BIOS 16-bit real mode vs UEFI 64-bit, MBR vs GPT partition tables, Secure Boot chain of trust, why BIOS was vulnerable to MBR bootkits, CSM/Legacy mode risks. Practical and conceptual questions.",
    6: "Secure Boot (intermediate): PK/KEK/db/dbx key hierarchy, signature verification flow, Secure Boot modes (Setup/User/Audit/Deployed), real bypass techniques (BlackLotus CVE-2022-21894, BootHole CVE-2020-10713, signed vulnerable bootloaders, physical attack), Linux shim+MOK. Ask about the chain of trust and bypass techniques.",
    7: "TPM — Trusted Platform Module (intermediate): TPM 1.2 vs 2.0, PCR banks (Platform Configuration Registers), PCR extension formula, TPM operations (key generation, key sealing, attestation), Windows TPM uses (BitLocker, Windows Hello, Credential Guard, vTPM), attack vectors (evil maid, TPM bus sniffing, TPM-Fail). Ask about PCR chaining and BitLocker integration.",
    8: "Windows Registry (beginner-intermediate): 5 root keys (HKLM/HKCU/HKCR/HKU/HKCC), hive files on disk (SYSTEM, SOFTWARE, SAM, SECURITY, NTUSER.DAT), data types (REG_SZ/REG_DWORD/REG_BINARY), persistence locations (Run/RunOnce/Services/AppInit_DLLs/COM hijacking), monitoring (Sysmon Event 13, Process Monitor, Autoruns). Ask about persistence techniques.",
    9: "Windows File Systems (beginner-intermediate): I/O Manager and IRP model, filter driver stack and altitude numbers, FAT32 vs NTFS vs exFAT comparison (file size limits, permissions, journaling, ADS), file system drivers (ntfs.sys, fastfat.sys, exfat.sys), security implications of file system choice. Ask about the IRP stack and FAT vs NTFS differences.",
    10: "NTFS file system (intermediate-advanced): MFT structure (resident vs non-resident data, first 16 system records), NTFS attributes ($STANDARD_INFORMATION, $FILE_NAME, $DATA, $REPARSE_POINT), Alternate Data Streams (ADS) and malware abuse, NTFS permissions vs share permissions (effective access = NTFS ∩ Share), journaling ($LogFile write-ahead journal, $UsnJrnl change journal), hard links/junctions/symbolic links security, EFS encryption (FEK, AES-256, RSA). Ask about MFT, ADS, and permissions.",
    11: "FAT32 file system (beginner-intermediate): FAT table structure (FAT12/16/32 entry sizes), cluster chain as singly-linked list, 3 volume regions (Reserved/FAT/Data), directory entries (32-byte structure, 8.3 filename, LFN via 0x0F attribute), critical limitations (4GB file limit from 32-bit size field, 32GB Windows-only volume limit), why still used (USB cross-platform, ESP must be FAT32), data recovery (0xE5 deleted marker). Ask about the 4GB limit and ESP usage.",
    12: "Windows Processes (intermediate): EPROCESS structure (ActiveProcessLinks, VadRoot, ObjectTable, Token, ProtectionLevel), CreateProcess flow (kernel32→ntdll→NtCreateUserProcess→kernel), virtual address space layout (ASLR, VAD tree, PEB), access token fields (User SID, group SIDs, privileges, integrity level), Integrity Levels and UAC (Medium→High elevation), Protected Process Light (PPL) for LSASS, process injection techniques (DLL injection via CreateRemoteThread, process hollowing, reflective DLL, APC injection), PPID spoofing, Sysmon Event 1. Ask about EPROCESS fields, token, injection techniques.",
    13: "Windows Threads (intermediate): ETHREAD structure, TEB fields and GS segment register (GS:[0x30]=TEB, GS:[0x60]=PEB, TlsSlots), thread states (Running/Ready/Waiting/Transition/Terminated), Windows scheduler (32 priority levels 0-31, priority classes, quantum ~31ms client/~187ms server, priority boost after waits), synchronization primitives (CRITICAL_SECTION fast-path spin, Mutex cross-process/recursive, Event auto-reset vs manual-reset, Semaphore counting, SRWLock reader-writer, interlocked atomics), TLS and TLS callback anti-debug, thread injection (CreateRemoteThread/Sysmon Event 8, QueueUserAPC alertable wait, SetThreadContext hijacking, NtCreateThreadEx), thread pool. Ask about scheduler, sync primitives, and thread injection.",
    14: "Windows Handles (intermediate): handle table entry structure (ObjectPointerBits, GrantedAccessBits, Attributes), OBJECT_HEADER (HandleCount vs PointerCount), access rights baked in at open time, DuplicateHandle API and cross-process handle duplication, handle theft technique (stealing LSASS handle to bypass EDR hooks on OpenProcess), handle leaks in long-running services (detection via Process Explorer/!handle WinDbg), kernel object reference counting. Ask about handle table structure, DuplicateHandle abuse, and handle leak detection.",
    15: "Windows Services (intermediate): Service Control Manager (SCM) inside services.exe, service lifecycle (SCM startup order, dependency resolution, failure actions, DACL on service objects), service account types (LocalSystem most privileged/full SYSTEM token/network as computer$, LocalService restricted/network as anonymous, NetworkService restricted/network as computer$, Virtual Service Account NT SERVICE\\name), service binary paths and registry keys (HKLM\\SYSTEM\\CurrentControlSet\\Services), unquoted service path vulnerability, service DLL search order hijacking, creating new services for persistence, Sysmon Event 7045. Ask about service accounts, attack techniques, and detection.",
    16: "Windows User Accounts and Profiles (intermediate): local account types (Local Admin, Standard, Guest, built-in SYSTEM/LocalService/NetworkService/TrustedInstaller/WDAGUtilityAccount), SAM database structure, SID format (S-1-5-21-domain-RID), well-known SIDs (SYSTEM S-1-5-18, Everyone S-1-1-0, Administrators S-1-5-32-544), RID values (500=Administrator, 501=Guest, 1000+ local accounts), NTLM hashing (Unicode password → MD4 → NT hash), user profile structure (NTUSER.DAT, AppData Local/Roaming/LocalLow, Credentials folder), DPAPI (master key encrypted with user password, used to protect Credential Manager/browser passwords), credential attack techniques (SAM extraction with reg save, LSASS dump with MiniDumpWriteDump, Pass-the-Hash, Credential Manager theft). Ask about SID/RID, NTLM hashing, and credential attacks.",
    17: "UAC — User Account Control (intermediate): UAC not a security boundary (Microsoft statement), split-token model (admin logs in → gets filtered medium-IL token for normal use + linked elevated token for elevation prompts), integrity levels (Untrusted S-1-16-0, Low S-1-16-4096, Medium S-1-16-8192, High S-1-16-12288, System S-1-16-16384, Protected Process S-1-16-20480), MIC write-up/read-down policy, consent.exe/AppInfo service flow (7 steps from ShellExecute to elevated process), secure desktop (winlogon desktop), auto-elevation criteria (signed by Microsoft, in trusted directory, requestedExecutionLevel=requireAdministrator in manifest), UAC bypass techniques (fodhelper UACME#41 via HKCU\\Software\\Classes\\ms-settings, SilentCleanup scheduled task, eventvwr COM hijacking, ICMLuaUtil CoCreateInstance, DLL hijacking in auto-elevating EXEs), UAC registry configuration (EnableLUA, ConsentPromptBehaviorAdmin, PromptOnSecureDesktop). Ask about integrity levels, split-token model, and UAC bypass techniques.",
    18: "DLL — Dynamic Link Libraries (intermediate): DLL vs EXE (shared code/data sections, IMAGE_OPTIONAL_HEADER.DllCharacteristics), implicit linking (load-time, import library .lib, populated IAT) vs explicit linking (runtime, LoadLibrary/GetProcAddress), PE loader steps for DLL loading, DLL search order (KnownDLLs registry bypass → executable directory → System32/SysWOW64 → Windows directory → CWD → PATH), DLL hijacking (plant malicious DLL in a writeable directory earlier in search order), DLL injection (CreateRemoteThread+LoadLibrary, Sysmon Event 7), reflective DLL injection (no LoadLibrary, manual PE mapping), COM hijacking (HKCU InprocServer32 override), DllMain loader-lock rules (never call LoadLibrary/CreateThread inside DllMain), WOW64 redirection (%SystemRoot%\\SysWOW64). Ask about search order, hijacking, and injection techniques.",
    19: "Windows API (intermediate-advanced): API layered stack (Win32 API in kernel32/user32/advapi32 → ntdll.dll stubs → SYSCALL instruction → kernel SSDT dispatch table), syscall number (SSN) differs between Windows versions, SYSCALL switches ring 3→ring 0, EDR user-land hooks (IAT hooking: overwrite import address table entry; inline/trampoline hooking: overwrite first bytes of ntdll stub with JMP to EDR; SSDT hooking: kernel-mode, replaced by PatchGuard on 64-bit), attacker bypass techniques (direct syscall: embed syscall stub in malware to skip ntdll; ntdll unhooking: remap clean ntdll from disk; Heaven's Gate from WOW64 for 32-bit→64-bit transition), ETW API monitoring (NtTraceEvent). Ask about the syscall flow, hooking types, and bypass techniques.",
    20: "Event Viewer and ETW (intermediate): ETW architecture (providers register via ETW API, sessions collect events via NT kernel logger or custom sessions, consumers process real-time or from .etl files), Windows Event Log channels (System/Application/Security/Setup + Applications and Services Logs), important security Event IDs (4624 logon, 4625 failed logon, 4688 process creation with CommandLine if audited, 4698/4702 scheduled task create/modify, 7045 service install), Sysmon Event IDs (1 process create, 3 network connect, 7 image load, 8 CreateRemoteThread, 10 ProcessAccess/OpenProcess), enabling audit policy (auditpol /set /subcategory), log tampering (wevtutil cl, ETW provider patching in memory, stopping Sysmon driver sc stop SysmonDrv, VSS shadow deletion). Ask about ETW flow, key Event IDs, and anti-forensics.",
    21: "Task Scheduler (intermediate): task XML structure (RegistrationInfo, Triggers/CalendarTrigger/LogonTrigger/BootTrigger/EventTrigger, Principals/RunLevel=HighestAvailable, Actions/Exec or ComHandler, Settings/ExecutionTimeLimit), task database location (C:\\Windows\\System32\\Tasks + registry HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Schedule\\TaskCache), persistence triggers (LogonTrigger most common for user-level persistence, BootTrigger for SYSTEM-level), SilentCleanup UAC bypass (auto-elevates, inherits caller's %windir%, DLL hijacking in writeable path), COM handler persistence (fileless, loads COM object from registry, harder to detect than Exec action), detection (schtasks /query, Event IDs 4698/4702, autoruns.exe). Ask about task structure, persistence techniques, and UAC bypass.",
    22: "Windows Logs — EVTX and Forensics (intermediate-advanced): EVTX binary format (file header with ElfFile magic, 65536-byte chunks with own CRC32, event records with RecordID monotonically increasing), Record ID gaps as tampering evidence, Windows Event Log service (svchost hosting EventLog, circular buffer per channel with MaxSize), key forensic artifacts beyond EVTX (Prefetch: execution evidence with last-8-run timestamps; AmCache: SHA1 of first-seen executables; SRUM: 30-60 day network/CPU usage per process; $MFT: every file ever created even after deletion; Shimcache/AppCompatCache: execution order and timestamps), incident response triage workflow (KAPE collection → MFTECmd/EvtxECmd timeline → Chainsaw/Sigma rule matching → pivoting on IOCs → scope determination). Ask about EVTX format, forensic artifacts, and IR workflow.",
    23: "Settings and Control Panel (beginner-intermediate): modern Settings app (SystemSettings.exe, ms-settings: URI scheme, WinRT/UWP), settings categories and registry mapping (HKCU\\Control Panel, HKLM\\SOFTWARE\\Policies), legacy Control Panel applets (.cpl files — secpol.msc, wf.msc, lusrmgr.msc, appwiz.cpl), security-relevant settings (Windows Security/Defender, Sign-in Options/Windows Hello, Privacy & Diagnostics, Group Policy overrides via gpedit.msc), persistence locations (HKCU/HKLM Run keys, Startup folder, Scheduled Tasks). Ask about Settings vs Control Panel differences, URI scheme, and security settings.",
    24: "System Configuration msconfig (beginner-intermediate): 5 tabs — General (Normal startup loads all drivers/services, Diagnostic startup loads minimal devices, Selective startup lets you choose), Boot tab (OS selection for dual-boot, Safe Boot modes: Minimal/Alternate Shell/Network/Active Directory Repair, boot options: No GUI/Boot log/Base video, BCD equivalents with bcdedit), Services tab (hide Microsoft services to focus on third-party, Start registry value = 4 means disabled, attackers disable Defender/Sysmon here), Startup tab (redirects to Task Manager in Win10+), Tools tab (shortcuts to msinfo32/eventvwr/compmgmt/sysdm/perfmon/regedit/rstrui/wmimgmt). Ask about startup types, Safe Boot modes, and security implications.",
    25: "Advanced System Settings sysdm.cpl (intermediate): 5 tabs — Computer Name (hostname/NetBIOS ≤15 chars, domain/workgroup join, DNS suffix, registry HKLM\\SYSTEM\\CCS\\Control\\ComputerName), Hardware (Device Manager, Driver Signature Enforcement DSE on 64-bit, BYOVD attacks with RTCore64/DBUtil), Advanced tab with 3 sections (Performance: Visual Effects + Virtual Memory pagefile.sys forensics sensitivity + DEP Data Execution Prevention NX/XD bit + ASLR + CFG + CET stack; User Profiles: Local/Roaming/Mandatory types, orphaned profile data risk; Startup and Recovery: BSOD dump types None/Small/Kernel/Complete/Automatic, hiberfil.sys RAM snapshot), System Protection (VSS shadow copies, restore points in C:\\System Volume Information, ransomware deletes with vssadmin/wmic/bcdedit), Remote tab (RDP port 3389, fDenyTSConnections reg value, NLA, BlueKeep CVE-2019-0708, PtH with Restricted Admin). Ask about DEP, VSS, and RDP attack vectors.",
    26: "Computer Management compmgmt.msc (intermediate): MMC snap-in tree — System Tools: Task Scheduler (task library), Event Viewer (Windows Logs channels), Shared Folders (Shares showing all network shares including hidden admin shares C$/ADMIN$/IPC$/SYSVOL/NETLOGON and their security risks, Sessions showing live connected users, Open Files), Local Users and Groups (lusrmgr.msc — built-in groups: Administrators S-1-5-32-544/Users/Guests/Remote Desktop Users/Remote Management Users/Backup Operators file ACL bypass/Event Log Readers), Performance (Performance Monitor real-time counters, Data Collector Sets), Device Manager; Storage: Disk Management (GPT partition types: ESP/MSR/Data/WinRE, disk states: Online/Offline/Missing); Services and Applications: Services (service properties/dependencies), WMI Control (wmimgmt.msc, WMI persistence via __EventFilter+__EventConsumer+__FilterToConsumerBinding, survive reboots, detect with Sysmon EID 19/20/21/Autoruns WMI tab). Ask about admin shares, WMI persistence, and group security.",
    27: "Resource Monitor and CMD (beginner-intermediate): resmon.exe purpose (per-process CPU/memory/disk/network + handles + modules, deadlock detection), 4 tabs: CPU tab (Processes table with CPU%/threads/status, Services table showing which services run in each process, Associated Handles for file-in-use diagnosis and suspicious LSASS handle detection, Associated Modules for DLL hijacking detection via unexpected load paths), Memory tab (Working Set vs Private vs Shareable columns, Hard Faults/sec as paging pressure indicator, physical memory bar: In Use/Modified/Standby/Free), Disk tab (per-file read/write bytes/sec, I/O Priority Normal vs Background for stealth, detect ransomware via mass write + filename changes, detect exfil via bulk reads to temp paths), Network tab (Processes with Network Activity, TCP Connections table = full socket table like netstat -ano, Listening Ports table for backdoor detection), cmd.exe commands: hostname/whoami/whoami /priv/whoami /groups, ipconfig/ipconfig /all (DHCP/DNS recon), netstat -ano (C2 detection), net user/net localgroup/net share/net session (enumeration), /? and net help syntax, cls. Ask about Resource Monitor tabs, network tab detection use cases, and cmd enumeration commands.",
    28: "GUI — Graphical Interface (intermediate): Win32 window model — HWND (Handle to Window) as the kernel-managed object in win32k.sys, WndProc (LRESULT CALLBACK WndProc(HWND,UINT,WPARAM,LPARAM)) as message handler, message queue per thread, message pump loop (GetMessage/TranslateMessage/DispatchMessage), SendMessage vs PostMessage (sync vs async), DefWindowProc for unhandled messages. Desktop hierarchy: Window Station WinSta0 → Desktop Object → Shell_TrayWnd (taskbar/explorer.exe) → WorkerW (desktop icons) → Progman/SHELLDLL_DefView. Key GUI processes: explorer.exe, dwm.exe, sihost.exe, StartMenuExperienceHost.exe, SearchHost.exe, RuntimeBroker.exe. DWM (Desktop Window Manager): compositor in dwm.exe, each window renders to off-screen Direct3D redirect surface, GPU compositing, flip model for low-latency apps, SYSTEM-level isolation. GUI API evolution: Win32 GDI (CPU, no sandbox), GDI+ (anti-aliased), Direct2D/DirectWrite (GPU), WPF (DirectX via MIL, XAML, data binding), UWP/WinUI 2 (AppContainer sandbox), WinUI 3 (decoupled from OS), Electron/CEF (Chromium GPU + renderer sandbox). Key WM_ messages: WM_KEYDOWN/WM_CHAR/WM_LBUTTONDOWN/WM_PAINT/WM_CREATE/WM_DESTROY/WM_CLOSE/WM_QUIT/WM_COMMAND/WM_COPYDATA/WM_HOTKEY. Security: Shatter attacks (pre-Vista WM_SETTEXT+WM_TIMER exploit across privilege levels), UIPI (User Interface Privilege Isolation — blocks SendMessage from lower IL to higher IL), Clickjacking (transparent overlay capturing clicks on UAC prompts), UAC Secure Desktop (separate desktop object inaccessible to regular processes), UI Automation abuse (screen reader framework abused to read password fields, click UAC, extract clipboard), Window enumeration for sandbox detection (EnumWindows/GetWindowText to detect Wireshark/debuggers). Ask about HWND/WndProc, UIPI, and GUI security attack vectors."
  };

  const generate = async () => {
    setLoading(true); setErr(null);
    try {
      if (hasKey()) {
        const prompt = `Generate 3 clear written questions for a Windows internals course.
Topic focus: ${TOPICS[lessonNum] || TOPICS[1]}
Requirements: each question needs a multi-sentence written explanation (not yes/no). Mix: 1 definition/concept, 1 how-it-works, 1 why-it-matters. Questions should match what the lesson teaches — do NOT ask about topics not covered in the lesson. Vary the specific angle from previous attempts.
Return STRICT JSON only, no markdown: {"questions":[{"uz":"...","en":"..."},{"uz":"...","en":"..."},{"uz":"...","en":"..."}]}`;
        const text = await gradeWithAI(prompt);
        const cleaned = text.replace(/^```json\s*[\r\n]?|```\s*$/g, "").trim();
        setQuestions(JSON.parse(cleaned).questions.slice(0, 3));
      } else {
        setQuestions(FALLBACK_QUESTIONS[lessonNum] || FALLBACK_QUESTIONS[1]);
      }
      setPhase("answering");
    } catch (e) {
      console.warn("Question gen failed, using fallback:", e);
      setQuestions(FALLBACK_QUESTIONS[lessonNum] || FALLBACK_QUESTIONS[1]);
      setPhase("answering");
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    setPhase("grading"); setLoading(true); setErr(null);
    try {
      const evals = await Promise.all(questions.map((q, i) => gradeOne(q, answers[i])));
      setResults(evals);
      setPhase("result");
    } catch (e) {
      setErr(String(e));
      setPhase("answering");
    } finally {
      setLoading(false);
    }
  };

  const overall = results ? Math.round(results.reduce((a, r) => a + r.score, 0) / results.length) : 0;
  const passed = results ? overall >= 70 && results.every((r) => r.score >= 50) : false;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle} className="fade-up">
        <ModalHeader phase={phase} onClose={onClose} lessonNum={lessonNum} />

        <div style={{ padding: "0 32px 32px", flex: 1, overflowY: "auto", minHeight: 0 }}>
          {phase === "intro" && <Intro onStart={generate} loading={loading} lessonNum={lessonNum} />}
          {phase === "answering" && questions && (
            <Answering
              questions={questions} answers={answers} setAnswers={setAnswers}
              current={current} setCurrent={setCurrent}
              onSubmit={submit}
            />
          )}
          {phase === "grading" && <Grading />}
          {phase === "result" && results && (
            <Result
              results={results} questions={questions} answers={answers}
              overall={overall} passed={passed} lessonNum={lessonNum}
              onContinue={() => passed ? onPass() : onFail()}
            />
          )}
          {err && <div style={{ color: "var(--c-attack)", padding: 12, fontSize: 12 }}>Error: {err}</div>}
        </div>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed", inset: 0, zIndex: 1000,
  background: "rgba(2, 4, 10, 0.78)",
  backdropFilter: "blur(8px)",
  display: "grid", placeItems: "center",
  padding: 24,
  animation: "fadeUp 200ms ease",
};

const modalStyle = {
  background: "rgba(8, 12, 24, 0.95)",
  border: "1px solid var(--accent-border)",
  borderRadius: 18,
  width: "100%", maxWidth: 920,
  maxHeight: "92vh",
  display: "flex", flexDirection: "column",
  boxShadow: "0 30px 100px rgba(0,0,0,0.6), 0 0 40px var(--accent-soft)",
  overflow: "hidden",
};

const LESSON_TITLES = {
  1:  { uz: "Windows arxitekturasi",   en: "Windows Architecture" },
  2:  { uz: "Kernel nima?",            en: "What is the Kernel?" },
  3:  { uz: "User mode va Kernel mode", en: "User Mode vs Kernel Mode" },
  4:  { uz: "Windows boot jarayoni",   en: "Windows Boot Process" },
  5:  { uz: "BIOS va UEFI",            en: "BIOS vs UEFI" },
  6:  { uz: "Secure Boot",             en: "Secure Boot" },
  7:  { uz: "TPM",                     en: "TPM" },
  8:  { uz: "Windows Registry",        en: "Windows Registry" },
  9:  { uz: "Fayl tizimlari",          en: "File Systems" },
  10: { uz: "NTFS",                    en: "NTFS" },
  11: { uz: "FAT32",                   en: "FAT32" },
  12: { uz: "Jarayonlar (Processes)", en: "Processes" },
  13: { uz: "Thread'lar",             en: "Threads" },
  14: { uz: "Handle'lar",             en: "Handles" },
  15: { uz: "Servislar",              en: "Services" },
  16: { uz: "Foydalanuvchi hisoblari", en: "User Accounts" },
  17: { uz: "UAC",                    en: "User Account Control" },
  18: { uz: "DLL",                    en: "DLL" },
  19: { uz: "Windows API",            en: "Windows API" },
  20: { uz: "Event Viewer",           en: "Event Viewer" },
  21: { uz: "Task Scheduler",         en: "Task Scheduler" },
  22: { uz: "Windows log fayllari",   en: "Windows Logs" },
  23: { uz: "Settings va Control Panel", en: "Settings & Control Panel" },
  24: { uz: "System Configuration",     en: "System Configuration" },
  25: { uz: "Kengaytirilgan Tizim Sozl.", en: "Advanced System Settings" },
  26: { uz: "Kompyuter Boshqaruvi",     en: "Computer Management" },
  27: { uz: "Resource Monitor va CMD",  en: "Resource Monitor & CMD" },
  28: { uz: "GUI — Grafik Interfeys",   en: "GUI — Graphical Interface" },
};

function ModalHeader({ phase, onClose, lessonNum = 1 }) {
  const lang = useLang();
  const labels = {
    intro: { uz: "Test boshlash", en: "Begin assessment" },
    answering: { uz: "Yozma test", en: "Written assessment" },
    grading: { uz: "AI tekshirmoqda...", en: "AI grading..." },
    result: { uz: "Natijalar", en: "Results" },
  };
  const t = LESSON_TITLES[lessonNum] || LESSON_TITLES[1];
  return (
    <div style={{
      padding: "20px 32px",
      borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: "linear-gradient(180deg, rgba(0,255,156,0.04), transparent)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--accent)", color: "#04060d", display: "grid", placeItems: "center", boxShadow: "0 0 20px var(--accent-glow)" }}>
          <Icon name="target" size={18} />
        </div>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600 }}>{lang === "en" ? labels[phase].en : labels[phase].uz}</div>
          <div style={{ fontSize: 11.5, color: "var(--text-3)" }}>
            {lang === "en" ? `L0${lessonNum} · ${t.en}` : `L0${lessonNum} · ${t.uz}`}
          </div>
        </div>
      </div>
      <button onClick={onClose} className="btn-ghost btn" style={{ padding: 8 }}><Icon name="x" size={16} /></button>
    </div>
  );
}

function Intro({ onStart, loading, lessonNum = 1 }) {
  const lang = useLang();
  const hasKey = !!(localStorage.getItem("wa_ai_provider") && localStorage.getItem("wa_ai_key"));
  const t = LESSON_TITLES[lessonNum] || LESSON_TITLES[1];
  return (
    <div style={{ padding: "32px 0", textAlign: "center" }}>
      <div style={{
        width: 80, height: 80, borderRadius: "50%",
        background: "radial-gradient(circle, var(--accent-soft), transparent 70%)",
        margin: "0 auto 20px", display: "grid", placeItems: "center",
        color: "var(--accent)",
        animation: "glow 2.5s ease-in-out infinite",
      }}>
        <Icon name="target" size={36} />
      </div>

      <h2 className="display" style={{ fontSize: 26, margin: "0 0 6px", letterSpacing: "-0.02em" }}>
        {lang === "en" ? `${t.en}: mastery check` : `${t.uz}: bilim tekshiruvi`}
      </h2>
      <p style={{ color: "var(--text-2)", margin: "0 0 24px", fontSize: 14 }}>
        {lang === "en"
          ? "3 written questions · AI-graded · 70+ to pass"
          : "3 ta yozma savol · AI tomonidan baholanadi · 70+ ball — o'tasiz"}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 26 }}>
        {[
          { icon: "code", uz: "3 ta savol", en: "3 questions", c: "var(--accent)" },
          { icon: "spark", uz: "AI baholash", en: "AI grading", c: "var(--c-auth)" },
          { icon: "warning", uz: "Min 70%", en: "70% to pass", c: "var(--c-warn)" },
        ].map((s, i) => (
          <div key={i} style={{ padding: 14, background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 10 }}>
            <div style={{ color: s.c, marginBottom: 6 }}><Icon name={s.icon} size={18} /></div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{lang === "en" ? s.en : s.uz}</div>
          </div>
        ))}
      </div>

      {!hasKey && (
        <div style={{ padding: 14, background: "rgba(255,145,0,0.07)", border: "1px solid rgba(255,145,0,0.3)", borderRadius: 10, textAlign: "left", marginBottom: 16, display: "flex", gap: 10, alignItems: "flex-start" }}>
          <Icon name="warning" size={15} style={{ color: "var(--c-warn)", flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: 12, color: "var(--text-1)", lineHeight: 1.55 }}>
            <b style={{ color: "var(--c-warn)" }}>{lang === "en" ? "AI grader off:" : "AI tekshiruv o'chiq:"}</b>{" "}
            {lang === "en"
              ? "Open Tweaks panel (⚙) → AI Grader, choose provider and paste your API key for real AI grading."
              : "Tweaks panel (⚙) → AI Tekshiruvchi bo'limiga kiring, provider tanlang va API kalitingizni kiriting."}
          </div>
        </div>
      )}
      <div style={{ padding: 16, background: "rgba(255,58,94,0.06)", border: "1px solid rgba(255,58,94,0.25)", borderRadius: 10, textAlign: "left", marginBottom: 24, display: "flex", gap: 12, alignItems: "flex-start" }}>
        <Icon name="warning" size={16} style={{ color: "var(--c-attack)", flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: 12.5, color: "var(--text-1)", lineHeight: 1.55 }}>
          <b style={{ color: "var(--c-attack)" }}>{lang === "en" ? "Heads up:" : "Diqqat:"}</b>{" "}
          {lang === "en"
            ? <>If you fail, a <code style={{ color: "var(--c-attack)" }}>30-minute</code> lockout begins and fresh questions will be generated for your next attempt.</>
            : <>Yiqilsangiz <code style={{ color: "var(--c-attack)" }}>30 daqiqalik</code> bloklash boshlanadi va keyingi urinishda yangi savollar bo'ladi.</>}
        </div>
      </div>

      <button className="btn btn-primary" onClick={onStart} disabled={loading}>
        {loading ? <><span style={{ display: "inline-block", animation: "spin-slow 1s linear infinite" }}>↻</span> {lang === "en" ? "Generating questions..." : "Savollar tayyorlanmoqda..."}</> : <><Icon name="play" size={14} /> {lang === "en" ? "Begin" : "Boshlash"}</>}
      </button>
    </div>
  );
}

function Answering({ questions, answers, setAnswers, current, setCurrent, onSubmit }) {
  const lang = useLang();
  const q = questions[current];
  const a = answers[current];
  const wordCount = a.trim() ? a.trim().split(/\s+/).length : 0;
  const allAnswered = answers.every((x) => x.trim().length > 10);

  const update = (val) => {
    const next = [...answers]; next[current] = val; setAnswers(next);
  };

  return (
    <div style={{ paddingTop: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 22 }}>
        {questions.map((_, i) => (
          <div key={i} onClick={() => setCurrent(i)} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: i === current ? "var(--accent)" :
                          answers[i].trim().length > 10 ? "var(--accent-soft)" : "var(--bg-2)",
              color: i === current ? "#04060d" : answers[i].trim().length > 10 ? "var(--accent)" : "var(--text-3)",
              border: `1.5px solid ${i === current ? "var(--accent)" : answers[i].trim().length > 10 ? "var(--accent-border)" : "var(--border)"}`,
              display: "grid", placeItems: "center",
              fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 11,
              boxShadow: i === current ? "0 0 14px var(--accent-glow)" : "none",
              transition: "all 200ms",
            }}>{answers[i].trim().length > 10 && i !== current ? <Icon name="check" size={12} /> : i + 1}</div>
            {i < questions.length - 1 && (
              <div style={{ width: 40, height: 1, background: answers[i].trim().length > 10 ? "var(--accent-border)" : "var(--border)" }} />
            )}
          </div>
        ))}
      </div>

      <div style={{ padding: 22, background: "rgba(0,255,156,0.04)", border: "1px solid var(--accent-border)", borderRadius: 12, marginBottom: 16 }}>
        <div className="mono" style={{ fontSize: 10, color: "var(--accent)", letterSpacing: 0.18, marginBottom: 10 }}>
          {lang === "en" ? `QUESTION ${current + 1} OF 3` : `SAVOL ${current + 1} / 3`}
        </div>
        <div style={{ fontSize: 17, fontWeight: 500, lineHeight: 1.5, color: "var(--text-0)" }}>
          {lang === "en" ? q.en : q.uz}
        </div>
      </div>

      <div style={{ position: "relative" }}>
        <textarea
          value={a}
          onChange={(e) => update(e.target.value)}
          placeholder={lang === "en"
            ? "Write your answer here. Use precise technical terms..."
            : "Javobingizni shu yerga yozing. Aniq texnik atamalardan foydalaning..."}
          style={{
            width: "100%", minHeight: 180,
            padding: "16px 18px",
            background: "var(--bg-2)", border: "1px solid var(--border)",
            borderRadius: 10, color: "var(--text-0)",
            fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.65,
            resize: "vertical", outline: "none",
            transition: "border-color 200ms", boxSizing: "border-box",
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
          onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
        />
        <div style={{ position: "absolute", bottom: 8, right: 12, fontSize: 11, fontFamily: "var(--font-mono)", color: wordCount < 30 ? "var(--text-3)" : wordCount < 60 ? "var(--c-warn)" : "var(--accent)" }}>
          {wordCount} {lang === "en" ? "words" : "so'z"}{wordCount < 30 && (lang === "en" ? " · write more" : " · ko'proq yozing")}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18, alignItems: "center" }}>
        <button className="btn-ghost btn" disabled={current === 0}
          style={{ opacity: current === 0 ? 0.3 : 1 }}
          onClick={() => setCurrent(current - 1)}>
          <Icon name="arrow-left" size={14} /> {lang === "en" ? "Previous" : "Oldingi"}
        </button>

        <div style={{ fontSize: 11, color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
          {answers.filter((x) => x.trim().length > 10).length}/3 {lang === "en" ? "answered" : "javob berildi"}
        </div>

        {current < questions.length - 1 ? (
          <button className="btn" onClick={() => setCurrent(current + 1)}>
            {lang === "en" ? "Next" : "Keyingi"} <Icon name="arrow-right" size={14} />
          </button>
        ) : (
          <button className="btn btn-primary" onClick={onSubmit} disabled={!allAnswered}>
            <Icon name="send" size={14} /> {lang === "en" ? "Submit to AI" : "AI'ga yuborish"}
          </button>
        )}
      </div>
    </div>
  );
}

function Grading() {
  const lang = useLang();
  const phasesUz = [
    "Javoblar Claude'ga yuborilmoqda",
    "Semantik tahlil",
    "Texnik terminologiya tekshiruvi",
    "Yakuniy bal hisoblanmoqda",
  ];
  const phasesEn = [
    "Submitting answers to Claude",
    "Semantic analysis",
    "Technical terminology check",
    "Final score calculation",
  ];
  const phases = lang === "en" ? phasesEn : phasesUz;
  const [step, setStep] = useQS(0);
  useQE(() => {
    const t = setInterval(() => setStep((s) => Math.min(phases.length - 1, s + 1)), 1100);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ padding: "48px 0", textAlign: "center" }}>
      <div style={{ width: 100, height: 100, margin: "0 auto 24px", position: "relative" }}>
        <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", animation: "spin-slow 3s linear infinite" }}>
          <circle cx="50" cy="50" r="42" fill="none" stroke="var(--bg-3)" strokeWidth="3" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="var(--accent)" strokeWidth="3"
                  strokeDasharray="80 264" strokeLinecap="round" />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "var(--accent)" }}>
          <Icon name="spark" size={32} />
        </div>
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, marginBottom: 6 }}>
        {lang === "en" ? "AI is grading" : "AI tekshirmoqda"}
      </div>
      <div style={{ color: "var(--text-2)", fontSize: 13, marginBottom: 28 }}>
        {lang === "en" ? "Claude is analyzing your answers" : "Claude javoblaringizni tahlil qilmoqda"}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 420, margin: "0 auto" }}>
        {phases.map((p, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 14px", borderRadius: 8,
            background: i <= step ? "var(--accent-soft)" : "var(--bg-2)",
            border: `1px solid ${i <= step ? "var(--accent-border)" : "var(--border)"}`,
            opacity: i <= step ? 1 : 0.5,
            transition: "all 400ms",
          }}>
            <div style={{ width: 18, height: 18, color: i < step ? "var(--accent)" : i === step ? "var(--accent)" : "var(--text-3)" }}>
              {i < step ? <Icon name="check" size={18} /> :
               i === step ? <div style={{ width: 16, height: 16, border: "2px solid var(--accent)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin-slow 0.8s linear infinite" }} /> :
               <div style={{ width: 8, height: 8, borderRadius: "50%", background: "currentColor", margin: 5 }} />}
            </div>
            <div style={{ flex: 1, textAlign: "left", fontSize: 13, fontWeight: 500 }}>{p}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Result({ results, questions, answers, overall, passed, onContinue, lessonNum = 1 }) {
  const lang = useLang();
  const [now, setNow] = useQS(Date.now());
  useQE(() => {
    if (passed) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [passed]);

  // Write cooldown start time when failed result first shown
  useQE(() => {
    if (!passed) {
      const existing = localStorage.getItem(COOLDOWN_KEY);
      if (!existing || +existing <= Date.now()) {
        localStorage.setItem(COOLDOWN_KEY, String(Date.now() + COOLDOWN_DURATION));
      }
    }
  }, [passed]);

  const endsAt = !passed ? (+localStorage.getItem(COOLDOWN_KEY) || 0) : 0;
  const remaining = Math.max(0, Math.floor((endsAt - now) / 1000));
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const unlocked = !passed ? remaining === 0 : true;

  return (
    <div style={{ paddingTop: 20 }}>
      <div style={{ textAlign: "center", padding: "12px 0 24px" }}>
        <div className="mono" style={{ fontSize: 11, letterSpacing: 0.18, color: passed ? "var(--accent)" : "var(--c-attack)", marginBottom: 8 }}>
          {passed
            ? (lang === "en" ? "// PASSED · OPENING NEXT LESSON" : "// O'TILDI · KEYINGI DARS OCHILMOQDA")
            : (lang === "en" ? "// FAILED · COOLDOWN INITIATED" : "// YIQILDI · BLOKLASH BOSHLANDI")}
        </div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4 }}>
          <div className="display" style={{
            fontSize: 88, fontWeight: 600, letterSpacing: "-0.04em",
            color: passed ? "var(--accent)" : "var(--c-attack)",
            textShadow: `0 0 40px ${passed ? "var(--accent-glow)" : "rgba(255,58,94,0.4)"}`,
            lineHeight: 1,
          }}>{overall}</div>
          <div style={{ fontSize: 22, color: "var(--text-2)", fontFamily: "var(--font-display)" }}>/100</div>
        </div>
        <div style={{ fontSize: 14, color: "var(--text-2)", marginTop: 8 }}>
          {passed
            ? (lang === "en"
                ? <><b style={{ color: "var(--accent)" }}>Excellent!</b> You've mastered <em>{(LESSON_TITLES[lessonNum] || LESSON_TITLES[1]).en}</em>.</>
                : <><b style={{ color: "var(--accent)" }}>Mukammal!</b> Siz <em>{(LESSON_TITLES[lessonNum] || LESSON_TITLES[1]).uz}</em> mavzusini o'zlashtirdingiz.</>)
            : (lang === "en"
                ? <><b style={{ color: "var(--c-attack)" }}>Not yet.</b> Review the lesson and come back.</>
                : <><b style={{ color: "var(--c-attack)" }}>Hozircha o'ta olmadingiz.</b> Darsni qayta o'qib, qaytib keling.</>)}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {results.map((r, i) => (
          <ResultCard key={i} idx={i} q={questions[i]} a={answers[i]} r={r} />
        ))}
      </div>

      {!passed && (
        <div style={{ margin: "20px 0", padding: "18px 24px", background: "rgba(255,58,94,0.06)", border: "1px solid rgba(255,58,94,0.25)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div>
            <div className="mono" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: 0.18, marginBottom: 4 }}>
              {unlocked ? (lang === "en" ? "READY TO RETRY" : "QAYTA URINISH MUMKIN") : (lang === "en" ? "NEXT ATTEMPT IN" : "KEYINGI URINISH")}
            </div>
            <div className="display" style={{ fontSize: 44, fontWeight: 700, letterSpacing: "-0.04em", color: unlocked ? "var(--accent)" : "var(--c-attack)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
              {unlocked ? "00:00" : `${mm}:${ss}`}
            </div>
          </div>
          <div style={{ flex: 1, maxWidth: 180 }}>
            <div style={{ height: 5, background: "var(--bg-2)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", background: unlocked ? "var(--accent)" : "var(--c-attack)", borderRadius: 4, width: `${unlocked ? 100 : ((COOLDOWN_DURATION / 1000 - remaining) / (COOLDOWN_DURATION / 1000)) * 100}%`, transition: "width 1s linear" }} />
            </div>
            <div style={{ marginTop: 6, fontSize: 10, color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>30:00 {lang === "en" ? "total" : "jami"}</div>
          </div>
        </div>
      )}

      <div style={{ marginTop: 16, textAlign: "center" }}>
        <button
          className={`btn ${passed ? "btn-primary" : unlocked ? "btn-primary" : ""}`}
          onClick={onContinue}
          disabled={!passed && !unlocked}
          style={{ padding: "12px 24px", opacity: (!passed && !unlocked) ? 0.45 : 1, cursor: (!passed && !unlocked) ? "not-allowed" : "pointer" }}>
          {passed
            ? <><Icon name="arrow-right" size={14} /> {lang === "en" ? "Continue to next lesson" : "Keyingi darsga o'tish"}</>
            : unlocked
              ? <><Icon name="play" size={14} /> {lang === "en" ? "Retry with new questions" : "Yangi savollar bilan qayta urinish"}</>
              : <><Icon name="lock" size={14} /> {lang === "en" ? `Locked — ${mm}:${ss} remaining` : `Bloklangan — ${mm}:${ss} qoldi`}</>}
        </button>
      </div>
    </div>
  );
}

function ResultCard({ idx, q, a, r }) {
  const lang = useLang();
  const [expanded, setExpanded] = useQS(false);
  const c = r.score >= 70 ? "var(--accent)" : r.score >= 50 ? "var(--c-warn)" : "var(--c-attack)";
  return (
    <div style={{
      background: "var(--bg-2)", border: `1px solid ${c}33`,
      borderRadius: 12, borderLeft: `3px solid ${c}`,
      padding: "14px 18px",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
        onClick={() => setExpanded(!expanded)}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1 }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: `${c}12`, border: `1.5px solid ${c}`,
            color: c, display: "grid", placeItems: "center",
            fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 14,
          }}>{r.score}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="mono" style={{ fontSize: 10, color: c, letterSpacing: 0.1 }}>
              Q{idx + 1} · {r.passed ? "PASSED" : "BELOW_THRESHOLD"}
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: expanded ? "normal" : "nowrap" }}>
              {lang === "en" ? q.en : q.uz}
            </div>
          </div>
        </div>
        <Icon name={expanded ? "chevron-down" : "chevron-right"} size={16} style={{ color: "var(--text-3)" }} />
      </div>

      {expanded && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--accent)", fontSize: 9.5 }}>
                // {lang === "en" ? "STRENGTHS" : "KUCHLI TOMONLAR"}
              </div>
              {r.strengths?.length ? (
                <ul style={{ margin: "6px 0 0", paddingLeft: 18, fontSize: 12, color: "var(--text-1)", lineHeight: 1.55 }}>
                  {r.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              ) : <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 6 }}>—</div>}
            </div>
            <div>
              <div className="eyebrow" style={{ color: "var(--c-attack)", fontSize: 9.5 }}>
                // {lang === "en" ? "WEAKNESSES" : "ZAIF TOMONLAR"}
              </div>
              {r.weaknesses?.length ? (
                <ul style={{ margin: "6px 0 0", paddingLeft: 18, fontSize: 12, color: "var(--text-1)", lineHeight: 1.55 }}>
                  {r.weaknesses.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              ) : <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 6 }}>—</div>}
            </div>
          </div>
          {r.feedback && (
            <div style={{ marginTop: 12, padding: 12, background: "var(--bg-3)", borderRadius: 8, fontSize: 12.5, color: "var(--text-1)", lineHeight: 1.55, fontStyle: "italic" }}>
              <span style={{ color: c, fontWeight: 600, fontStyle: "normal" }}>AI:</span> {r.feedback}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

window.QuizModal = QuizModal;
