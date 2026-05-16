// lesson.jsx — Lesson L01: Windows arxitekturasi / Windows Architecture
// Sections: Big picture → Theory → Layered diagram → Boot → Syscall flow → Security view → Lab → Compare → Summary

const { useState: useLS, useEffect: useLE, useRef: useLR } = React;

const LESSON = {
  num: "L01", section: "01",
  uz: "Windows arxitekturasi",
  en: "Windows Architecture",
  subUz: "Operatsion tizim ichida nima sodir bo'lmoqda",
  subEn: "What's actually happening inside the operating system",
};

const LESSONS = {
  1:  { num: "L01", section: "01", uz: "Windows arxitekturasi",        en: "Windows Architecture",
        subUz: "Katta rasm, nazariy asos, qatlamli arxitektura",           subEn: "Big picture, theory, layered architecture" },
  2:  { num: "L02", section: "01", uz: "Kernel nima?",                  en: "What is the Kernel?",
        subUz: "ntoskrnl.exe, Executive, Microkernel, HAL va drayverlar",   subEn: "ntoskrnl.exe, Executive, Microkernel, HAL and drivers" },
  3:  { num: "L03", section: "01", uz: "User mode va Kernel mode",      en: "User Mode vs Kernel Mode",
        subUz: "CPU privilege halqalari va chegara nima uchun muhim",        subEn: "CPU privilege rings and why the boundary matters" },
  4:  { num: "L04", section: "01", uz: "Windows boot jarayoni",         en: "Windows Boot Process",
        subUz: "UEFI'dan login ekraniga: har bir bosqich va xavfsizlik",     subEn: "UEFI to login: every step and its security implications" },
  5:  { num: "L05", section: "01", uz: "BIOS vs UEFI",                  en: "BIOS vs UEFI",                subUz: "16-bit BIOS, MBR, UEFI fazalari, Secure Boot asoslari", subEn: "16-bit BIOS, MBR, UEFI phases, Secure Boot fundamentals" },
  6:  { num: "L06", section: "01", uz: "Secure Boot",                   en: "Secure Boot",                 subUz: "PK/KEK/db/dbx ierarxiyasi, imzo zanjiri va chetlab o'tish texnikalari", subEn: "PK/KEK/db/dbx hierarchy, signature chain and bypass techniques" },
  7:  { num: "L07", section: "01", uz: "TPM",                           en: "TPM",                         subUz: "PCR banklari, kalitlarni muhrlab qo'yish, BitLocker va attestatsiya", subEn: "PCR banks, key sealing, BitLocker integration and attestation" },
  8:  { num: "L08", section: "01", uz: "Registry",                      en: "Windows Registry",            subUz: "Ierarxik ma'lumotlar bazasi, hive fayllar va persistenslik joylari", subEn: "Hierarchical database, hive files, and persistence locations" },
  9:  { num: "L09", section: "01", uz: "Fayl tizimlari",                en: "File Systems",                subUz: "VFS, FAT/NTFS/exFAT arxitekturasi va Windows I/O menejeri", subEn: "VFS, FAT/NTFS/exFAT architecture and the Windows I/O Manager" },
  10: { num: "L10", section: "01", uz: "NTFS",                          en: "NTFS",                        subUz: "MFT, atributlar, ADS, ruxsatlar, jurnalling va EFS", subEn: "MFT, attributes, ADS, permissions, journaling and EFS" },
  11: { num: "L11", section: "01", uz: "FAT32",                         en: "FAT32",                       subUz: "FAT jadvali, klaster ajratish, cheklovlar va ESP", subEn: "FAT table, cluster allocation, limitations and the EFI System Partition" },
  12: { num: "L12", section: "01", uz: "Jarayonlar (Processes)",        en: "Processes",                   subUz: "EPROCESS, virtual manzil fazosi, kirish tokeni va jarayon in'ektsiya texnikalari", subEn: "EPROCESS, virtual address space, access token, and process injection techniques" },
  13: { num: "L13", section: "01", uz: "Thread'lar",                    en: "Threads",                     subUz: "ETHREAD, rejalashtiruvchi, prioritetlar, sinxronizatsiya va thread in'ektsiya", subEn: "ETHREAD, scheduler, priorities, synchronization, and thread injection" },
  14: { num: "L14", section: "01", uz: "Handle'lar",                    en: "Handles",                     subUz: "Ob'ekt menejeri, handle jadvali, turlari, takrorlash, xavfsizlik va handle hujumlari", subEn: "Object Manager, handle table, types, duplication, security, and handle-based attacks" },
  15: { num: "L15", section: "01", uz: "Servislar",                     en: "Services",                    subUz: "SCM, servis turlari, xizmat akkauntlari, svchost guruhlari va servis persistenslik texnikalari", subEn: "SCM, service types, service accounts, svchost groups, and service-based persistence techniques" },
  16: { num: "L16", section: "01", uz: "DLL",                           en: "DLL",                         subUz: "PE tuzilmasi, DLL yuklash, qidiruv tartibi, in'ektsiya va DLL hijacking texnikalari", subEn: "PE structure, DLL loading, search order, injection, and DLL hijacking techniques" },
  17: { num: "L17", section: "01", uz: "Windows API",                   en: "Windows API",                 subUz: "Win32 qatlami, ntdll syscall ko'prigi, API hooking va monitoring texnikalari", subEn: "Win32 layer, ntdll syscall bridge, API hooking, and monitoring techniques" },
  18: { num: "L18", section: "01", uz: "Event Viewer",                  en: "Event Viewer",                subUz: "Tez kunda", subEn: "Coming soon" },
  19: { num: "L19", section: "01", uz: "Task Scheduler",                en: "Task Scheduler",              subUz: "Tez kunda", subEn: "Coming soon" },
  20: { num: "L20", section: "01", uz: "Windows log fayllari",          en: "Windows Logs",                subUz: "Tez kunda", subEn: "Coming soon" },
};

// ─────────────────────────────────────────────────────────────
function LessonScreen({ setRoute, user, markLessonComplete, onOpenProfile, lessonNum = 1 }) {
  const lang = useLang();
  const [progress, setProgress] = useLS(0);
  const [quizOpen, setQuizOpen] = useLS(false);
  const LESSON = LESSONS[lessonNum] || { num: `L${String(lessonNum).padStart(2,"0")}`, section: "01", uz: "Dars", en: "Lesson", subUz: "Tez kunda", subEn: "Coming soon" };
  const lessonKey = `s01_l${String(lessonNum).padStart(2,"0")}`;
  const hasContent = true; // TEMP: all unlocked for review

  useLE(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = Math.min(100, Math.max(0, (window.scrollY / max) * 100));
      setProgress(Math.round(p));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div>
      <TopNav route={{ name: "lesson" }} setRoute={setRoute} user={user} onOpenProfile={onOpenProfile}
        crumb={[
          { label: lang === "en" ? "Courses" : "Kurslar", onClick: () => setRoute({ name: "dashboard" }) },
          { label: lang === "en" ? "Sec 01" : "01-bo'lim", onClick: () => setRoute({ name: "section", section: 1 }) },
          { label: `${LESSON.num}: ${lang === "en" ? LESSON.en : LESSON.uz}` },
        ]} />

      {/* Reading progress */}
      <div style={{ position: "sticky", top: 60, height: 3, background: "rgba(255,255,255,0.04)", zIndex: 50 }}>
        <div style={{
          height: "100%", width: `${progress}%`,
          background: "linear-gradient(90deg, var(--accent), var(--accent-2))",
          boxShadow: "0 0 8px var(--accent-glow)",
          transition: "width 200ms",
        }} />
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div className="page" style={{ padding: "32px 28px 80px" }}>
          <LessonHero lesson={LESSON} lessonNum={lessonNum} />
          {lessonNum === 1 ? <>
            <Section1Bigpicture />
            <Section2Theory />
            <Section3Layered />
          </> : lessonNum === 2 ? <>
            <SectionKernelWhat />
            <SectionKernelInside />
            <SectionKernelDrivers />
          </> : lessonNum === 3 ? <>
            <SectionRings />
            <Section8Comparison />
            <SectionSyscallBrief />
          </> : lessonNum === 4 ? <>
            <Section4Boot />
          </> : lessonNum === 5 ? <>
            <SectionBiosUefi />
          </> : lessonNum === 6 ? <>
            <SectionSecureBoot />
          </> : lessonNum === 7 ? <>
            <SectionTPM />
          </> : lessonNum === 8 ? <>
            <SectionRegistry />
          </> : lessonNum === 9 ? <>
            <SectionFileSystems />
          </> : lessonNum === 10 ? <>
            <SectionNTFS />
          </> : lessonNum === 11 ? <>
            <SectionFAT32 />
          </> : lessonNum === 12 ? <>
            <SectionProcesses />
          </> : lessonNum === 13 ? <>
            <SectionThreads />
          </> : lessonNum === 14 ? <>
            <SectionHandles />
          </> : lessonNum === 15 ? <>
            <SectionServices />
          </> : lessonNum === 16 ? <>
            <SectionDLL />
          </> : lessonNum === 17 ? <>
            <SectionWindowsAPI />
          </> : <ComingSoon lesson={LESSON} lessonNum={lessonNum} setRoute={setRoute} />}

          {hasContent && <LessonNextNav lessonNum={lessonNum} setRoute={setRoute} onQuizStart={() => setQuizOpen(true)} />}
        </div>
      </div>

      {quizOpen && <QuizModal
        lessonNum={lessonNum}
        onClose={() => setQuizOpen(false)}
        onPass={() => {
          setQuizOpen(false);
          if (markLessonComplete) markLessonComplete(lessonKey);
          setRoute({ name: "section", section: 1 });
        }}
        onFail={() => { setQuizOpen(false); setRoute({ name: "cooldown" }); }}
      />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function LessonTOC({ lessonNum = 1 }) {
  const lang = useLang();
  const sections = lessonNum === 1 ? [
    { id: "big-picture", uz: "Katta rasm", en: "Big picture" },
    { id: "theory", uz: "Nazariy asos", en: "Theory" },
    { id: "layered", uz: "Qatlamli arxitektura", en: "Layered architecture" },
  ] : [
    { id: "boot", uz: "Boot jarayoni", en: "Boot process" },
    { id: "syscall", uz: "Syscall oqimi", en: "Syscall flow" },
    { id: "security", uz: "Xavfsizlik nuqtai nazaridan", en: "Security view" },
    { id: "lab", uz: "Laboratoriya", en: "Lab" },
    { id: "compare", uz: "Taqqoslash", en: "Comparison" },
    { id: "summary", uz: "Xulosa", en: "Summary" },
  ];
  const [active, setActive] = useLS("big-picture");
  useLE(() => {
    const onScroll = () => {
      let cur = sections[0].id;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top < 200) cur = s.id;
      }
      setActive(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <aside style={{
      position: "sticky", top: 80, alignSelf: "start",
      padding: "32px 18px 32px 28px",
      height: "calc(100vh - 80px)",
      overflowY: "auto",
    }}>
      <div className="eyebrow" style={{ marginBottom: 12 }}>// {lang === "en" ? "CONTENTS" : "MUNDARIJA"}</div>
      <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 4 }}>
        {sections.map((s, i) => (
          <li key={s.id}>
            <a href={`#${s.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
              style={{
                display: "flex", gap: 10, padding: "8px 10px", borderRadius: 7,
                fontSize: 12.5, textDecoration: "none",
                color: active === s.id ? "var(--accent)" : "var(--text-2)",
                background: active === s.id ? "var(--accent-soft)" : "transparent",
                borderLeft: `2px solid ${active === s.id ? "var(--accent)" : "transparent"}`,
                transition: "all 200ms",
              }}>
              <span className="mono" style={{ opacity: 0.5, fontSize: 10, width: 18 }}>{String(i + 1).padStart(2, "0")}</span>
              <span>{lang === "en" ? s.en : s.uz}</span>
            </a>
          </li>
        ))}
      </ol>

      <div style={{ marginTop: 24, padding: 14, borderRadius: 10, background: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="eyebrow" style={{ fontSize: 9.5, marginBottom: 8 }}>// {lang === "en" ? "LESSON STATS" : "STATISTIKA"}</div>
        <div style={{ fontSize: 11, color: "var(--text-2)", display: "flex", flexDirection: "column", gap: 4 }}>
          <Row k={lang === "en" ? "Reading" : "O'qish"} v="~24 min" />
          <Row k={lang === "en" ? "Lab" : "Laboratoriya"} v="~12 min" />
          <Row k={lang === "en" ? "Diagrams" : "Diagrammalar"} v="9" />
          <Row k={lang === "en" ? "Words" : "So'zlar"} v="3,420" />
        </div>
      </div>
    </aside>
  );
}
function Row({ k, v }) {
  return <div style={{ display: "flex", justifyContent: "space-between" }}><span>{k}</span><span className="mono">{v}</span></div>;
}

const LESSON_META = {
  1: { min: 36, diagrams: 9, labs: 3,
       introUz: <>Windows tizimining to'liq arxitekturasi — hardware'dan boshlab, <em>user mode va kernel mode</em>, executive qatlam, microkernel, HAL, va bir sichqoncha bosishi shu qatlamlarning har biridan qanday o'tishini ko'ramiz.</>,
       introEn: <>The complete Windows architecture from the silicon up — <em>user mode vs kernel mode</em>, the executive layer, microkernel, HAL, and how a single mouse click cascades through every one of them.</> },
  2: { min: 28, diagrams: 6, labs: 1,
       introUz: <><em>Kernel</em> — operatsion tizimning yuragi. Bu darsda <em>ntoskrnl.exe</em> ichida nima borligini, Executive va Microkernel farqini, HAL nima ekanini va drayverlar nima uchun xavfli ekanini o'rganasiz.</>,
       introEn: <>The <em>kernel</em> is the heart of the OS. You'll learn what lives inside <em>ntoskrnl.exe</em>, the difference between the Executive and Microkernel, what the HAL does, and why drivers are a serious security risk.</> },
  3: { min: 32, diagrams: 5, labs: 1,
       introUz: <>CPU <em>privilege halqalari</em> nima, ring 3 va ring 0 farqi, bu chegara nima uchun mavjud, har bir rejimda xato qilsangiz nima bo'ladi — va kernel mode'ga qanday qonuniy o'tish mumkin.</>,
       introEn: <>What CPU <em>privilege rings</em> are, the difference between ring 3 and ring 0, why this boundary exists, what happens when code crashes in each mode — and how to legally cross into kernel mode.</> },
  4: { min: 36, diagrams: 8, labs: 2,
       introUz: <>UEFI'dan login ekraniga qadar Windows qanday ishga tushishini har bir bosqichda ko'rasiz: POST, Secure Boot, <em>bootmgr → winload → ntoskrnl → LSASS</em> — va har bir bosqich xavfsizlik uchun nimani anglatadi.</>,
       introEn: <>Walk through every step of the Windows boot — POST, Secure Boot, <em>bootmgr → winload → ntoskrnl → LSASS</em> — and understand what each stage means for security.</> },
  5: { min: 32, diagrams: 7, labs: 2,
       introUz: <><em>BIOS</em> va <em>UEFI</em> — kompyuter yoqilganda birinchi ishga tushadigan dasturiy ta'minot. Bu darsda ikkalasining arxitekturasini, MBR va GPT farqini, Secure Boot qanday ishlashini va firmwarelar qanday qilib hujum yuzasiga aylanishini ko'rasiz.</>,
       introEn: <><em>BIOS</em> and <em>UEFI</em> are the first software that runs when you power on. This lesson covers both architectures, MBR vs GPT, how Secure Boot works, and how firmware became a critical attack surface.</> },
  6: { min: 34, diagrams: 6, labs: 2,
       introUz: <><em>Secure Boot</em> — yuklash jarayonini kriptografik zanjir orqali himoya qiladigan UEFI mexanizmi. Bu darsda <em>PK → KEK → db/dbx</em> kalit ierarxiyasi, imzo tekshiruvi oqimi, BlackLotus va BootHole kabi real chetlab o'tish texnikalarini va Linux'da Secure Boot qanday ishlashini o'rganasiz.</>,
       introEn: <><em>Secure Boot</em> is the UEFI mechanism that protects the boot process with a cryptographic chain. This lesson covers the <em>PK → KEK → db/dbx</em> key hierarchy, signature verification flow, real bypass techniques like BlackLotus and BootHole, and how Secure Boot works on Linux.</> },
  7: { min: 30, diagrams: 5, labs: 2,
       introUz: <><em>TPM (Trusted Platform Module)</em> — apparat xavfsizlik chipi bo'lib, kriptografik kalitlarni saqlaydi, tizim holatini o'lchaydi va BitLocker, Windows Hello, Credential Guard kabi texnologiyalarga asos bo'ladi. Bu darsda PCR banklari, kalit muhrlash, attestatsiya va real hujum vektorlarini o'rganasiz.</>,
       introEn: <><em>TPM (Trusted Platform Module)</em> is a hardware security chip that stores cryptographic keys, measures system state, and underpins BitLocker, Windows Hello, and Credential Guard. This lesson covers PCR banks, key sealing, attestation, and real attack vectors against TPM.</> },
  8: { min: 32, diagrams: 5, labs: 2,
       introUz: <><em>Windows Registry</em> — barcha tizim sozlamalari, dasturlar konfiguratsiyasi va xavfsizlik siyosatlari saqlanadigan markaziy ierarxik ma'lumotlar bazasi. Bu darsda 5 ta asosiy kalit, hive fayllar, ma'lumot turlari va zararli dasturlar persistenslik uchun foydalanadigan joylarni o'rganasiz.</>,
       introEn: <><em>Windows Registry</em> is the central hierarchical database where all system settings, application config, and security policies are stored. This lesson covers the 5 root keys, hive files on disk, data types, and the registry locations malware uses for persistence.</> },
  9: { min: 28, diagrams: 6, labs: 1,
       introUz: <><em>Fayl tizimi</em> — fizik saqlash qurilmasi ustida mantiqiy ma'lumotlar tashkilotchisi. Bu darsda Windows I/O menejeri va VFS qatlami, FAT/NTFS/exFAT arxitekturasi, Windows fayl tizimi drayverlari va filtr drayverlari qanday ishlashini o'rganasiz.</>,
       introEn: <><em>File systems</em> are the logical organizers of data on top of physical storage. This lesson covers the Windows I/O Manager and VFS layer, FAT/NTFS/exFAT architectures, Windows file system drivers, and how filter drivers intercept I/O for antivirus and encryption.</> },
  10: { min: 36, diagrams: 7, labs: 3,
       introUz: <><em>NTFS</em> — Windows'ning asosiy fayl tizimi. Bu darsda <em>Master File Table (MFT)</em>, NTFS atributlari, Alternate Data Streams (ADS) va ularning yashirin ma'lumot saqlash uchun ishlatilishi, NTFS ruxsatlari, jurnalling ($LogFile/$UsnJrnl), EFS shifrlash, hard link/junction/symlink farqlari va xavfsizlik oqibatlarini o'rganasiz.</>,
       introEn: <><em>NTFS</em> is Windows' primary file system. This lesson covers the <em>Master File Table (MFT)</em>, NTFS attributes, Alternate Data Streams (ADS) and their use for hiding data, NTFS permissions, journaling ($LogFile/$UsnJrnl), EFS encryption, hard links/junctions/symlinks, and security implications.</> },
  11: { min: 26, diagrams: 4, labs: 1,
       introUz: <><em>FAT32</em> — eng oddiy va keng tarqalgan fayl tizimlaridan biri. Bu darsda FAT jadvalining tuzilishi, klaster ajratish, FAT12/16/32 farqlari, asosiy cheklovlar (4GB fayl, 32GB hajm), nima uchun hali ham USB disklar va EFI System Partition (ESP) uchun ishlatilishini va qoplash usullarini o'rganasiz.</>,
       introEn: <><em>FAT32</em> is one of the simplest and most widely deployed file systems. This lesson covers the FAT table structure, cluster allocation, FAT12/16/32 differences, key limitations (4GB file size, 32GB volume), why it's still used for USB drives and the EFI System Partition, and data recovery considerations.</> },
  12: { min: 38, diagrams: 7, labs: 3,
       introUz: <><em>Jarayon (Process)</em> — Windows'da bajariladigan dasturning asosiy konteyneri: virtual manzil fazosi, handle jadvali, kirish tokeni va mavzular to'plami. Bu darsda <em>EPROCESS</em> tuzilmasi, CreateProcess oqimi, manzil fazosi tartibi, yaxlitlik darajalari va tajovuzkorlar foydalanadigan DLL in'ektsiya, jarayon bo'shatish kabi texnikalarni o'rganasiz.</>,
       introEn: <><em>A process</em> is Windows' primary container for executing code: a virtual address space, handle table, access token, and a set of threads. This lesson covers the <em>EPROCESS</em> structure, the CreateProcess flow, address space layout, integrity levels, and the techniques attackers use — DLL injection, process hollowing, and more.</> },
  13: { min: 34, diagrams: 6, labs: 2,
       introUz: <><em>Thread</em> — jarayon ichidagi bajariladigan oqim. Bu darsda <em>ETHREAD</em> va TEB tuzilmalari, Windows rejalashtiruvchisi (0–31 prioritet, kvant, prioritet ko'tarish), thread holatlari, sinxronizatsiya primitivlari (mutex, event, critical section, SRWLock), thread in'ektsiya texnikalari (CreateRemoteThread, APC) va ularni kuzatishni o'rganasiz.</>,
       introEn: <><em>A thread</em> is the unit of execution inside a process. This lesson covers the <em>ETHREAD</em> and TEB structures, the Windows scheduler (0–31 priorities, quanta, priority boost), thread states, synchronization primitives (mutex, event, critical section, SRWLock), thread injection techniques (CreateRemoteThread, APC), and how to monitor for them.</> },
  14: { min: 32, diagrams: 5, labs: 2,
       introUz: <><em>Handle</em> — jarayon kernel ob'ektiga (fayl, jarayon, thread, token, event, mutex) murojaat qilish uchun ishlatiladigan abstrakt raqam. Bu darsda <em>Object Manager</em>, handle jadvalining tuzilishi, handle turlari, DuplicateHandle API, handle merosxo'rligi, handle sizishi va tajovuzkorlar foydalanadigan handle o'g'irlash texnikalarini o'rganasiz.</>,
       introEn: <><em>A handle</em> is the abstract number a process uses to reference a kernel object — file, process, thread, token, event, mutex. This lesson covers the <em>Object Manager</em>, handle table structure, handle types, DuplicateHandle API, handle inheritance, handle leaks, and the handle-theft techniques attackers use to escalate privileges.</> },
  15: { min: 36, diagrams: 6, labs: 2,
       introUz: <><em>Windows Service</em> — fon rejimida ishlaydigan, foydalanuvchi tizimga kirmagan vaqtda ham faol bo'lgan jarayon. Bu darsda <em>Service Control Manager (SCM)</em>, servis turlari va holatlari, servis akkauntlari (LocalSystem, LocalService, NetworkService), svchost.exe −k guruhlari, servis DACL lari va tajovuzkorlar foydalanadigan servis persistenslik va imtiyozlarni ko'tarish texnikalarini o'rganasiz.</>,
       introEn: <><em>A Windows Service</em> is a process that runs in the background even when no user is logged in. This lesson covers the <em>Service Control Manager (SCM)</em>, service types and states, service accounts (LocalSystem, LocalService, NetworkService), svchost.exe -k groups, service DACLs, and the service persistence and privilege-escalation techniques attackers rely on.</> },
  16: { min: 36, diagrams: 7, labs: 3,
       introUz: <><em>DLL (Dynamic Link Library)</em> — bir nechta jarayonlar baham ko'ra oladigan umumiy kod va resurslar kutubxonasi. Bu darsda <em>PE formati</em>, DLL yuklash mexanizmi (LoadLibrary, implicit linking), Windows DLL qidiruv tartibi, <em>KnownDlls</em>, DllMain hayot tsikli, DLL in'ektsiya texnikalari (klassik, reflektiv, AppInit) va DLL hijacking hujumlarini o'rganasiz.</>,
       introEn: <><em>A DLL (Dynamic Link Library)</em> is a shared library of code and resources that multiple processes can map into their address space simultaneously. This lesson covers the <em>PE format</em>, DLL loading mechanics (LoadLibrary, implicit linking), Windows DLL search order, <em>KnownDlls</em>, DllMain lifecycle, DLL injection techniques (classic, reflective, AppInit), and DLL hijacking attacks.</> },
  17: { min: 38, diagrams: 6, labs: 2,
       introUz: <><em>Windows API</em> — dasturlar operatsion tizim xizmatlariga murojaat qilish uchun foydalanadigan funksiyalar to'plami. Bu darsda <em>Win32 → ntdll → syscall</em> zanjiri, asosiy DLL lar (kernel32, ntdll, advapi32, user32), chaqiruv konventsiyalari (x64 fastcall), <em>API hooking</em> texnikalari (IAT, inline, SSDT), WOW64 qatlami va API monitoringi usullarini o'rganasiz.</>,
       introEn: <><em>The Windows API</em> is the set of functions applications call to access OS services. This lesson covers the <em>Win32 → ntdll → syscall</em> chain, key DLLs (kernel32, ntdll, advapi32, user32), calling conventions (x64 fastcall), <em>API hooking</em> techniques (IAT, inline, SSDT), the WOW64 layer, and API monitoring methods.</> },
};

// ─────────────────────────────────────────────────────────────
function LessonHero({ lesson, lessonNum = 1 }) {
  const lang = useLang();
  const meta = LESSON_META[lessonNum] || LESSON_META[1];
  return (
    <header style={{ marginBottom: 40 }}>
      <div className="eyebrow" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <LiveDot />
        <span>{lang === "en" ? `SECTION ${lesson.section} · LESSON ${lesson.num} · IN PROGRESS` : `${lesson.section}-BO'LIM · DARS ${lesson.num} · DAVOM ETMOQDA`}</span>
      </div>
      <h1 className="display" style={{ fontSize: "clamp(36px, 4.4vw, 56px)", margin: 0, letterSpacing: "-0.025em", lineHeight: 1.05 }}>
        {lang === "en" ? lesson.en : lesson.uz}
      </h1>
      <div style={{ color: "var(--text-2)", fontSize: 17, marginTop: 8 }}>{lang === "en" ? lesson.subEn : lesson.subUz}</div>

      <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 24, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 10 }}>
          <span className="chip"><Icon name="clock" size={11} /> {meta.min} min</span>
          <span className="chip chip-blue"><Icon name="graph" size={11} /> {lang === "en" ? `${meta.diagrams} diagrams` : `${meta.diagrams} diagramma`}</span>
          <span className="chip chip-purple"><Icon name="terminal" size={11} /> {lang === "en" ? `${meta.labs} lab${meta.labs > 1 ? "s" : ""}` : `${meta.labs} lab`}</span>
          <span className="chip chip-yellow"><Icon name="warning" size={11} /> {lang === "en" ? "foundational" : "asosiy"}</span>
        </div>
        <div style={{ flex: 1 }} />
        <div className="mono" style={{ fontSize: 11, color: "var(--text-2)" }}>
          {lang === "en" ? "Updated" : "Yangilandi"} 2026.05.10 · Dagzo
        </div>
      </div>

      <div style={{ marginTop: 24, padding: 18, background: "rgba(0, 212, 255, 0.05)", border: "1px solid rgba(0, 212, 255, 0.25)", borderRadius: 10, display: "flex", gap: 14, alignItems: "flex-start" }}>
        <span style={{ color: "var(--c-system)", flexShrink: 0, marginTop: 2 }}><Icon name="info" size={16} /></span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--c-system)" }}>
            {lang === "en" ? "What you'll learn in this lesson" : "Bu darsda nima o'rganasiz"}
          </div>
          <div style={{ fontSize: 13, color: "var(--text-1)", marginTop: 4, lineHeight: 1.55 }}>
            {lang === "en" ? meta.introEn : meta.introUz}
          </div>
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────
function Section1Bigpicture() {
  const lang = useLang();
  return (
    <section id="big-picture" style={{ scrollMarginTop: 80, marginBottom: 56 }}>
      <H2 num="01" uz="Operatsion tizim nima?" en="What is an operating system?" />

      <P>
        {lang === "en"
          ? <>An <Term>operating system</Term> is the software layer that mediates every interaction between applications and hardware. Without it, every application would need its own disk driver, its own network stack, its own memory allocator — impossible at modern scale. The OS gives every program the illusion of exclusive, safe access to all machine resources, enforces who can read whose files, and prevents one crashed program from taking down the rest.</>
          : <>«<Term>Operatsion tizim</Term>» — ilovalar va hardware o'rtasidagi har bir muloqotni boshqaradigan dasturiy qatlam. Usiz, har bir ilova o'z disk drayveri, o'z tarmoq steki, o'z xotira ajratuvchisiga ega bo'lishi kerak edi — zamonaviy ko'lamda bu imkonsiz. OS har bir dasturga barcha mashinaning resurslariga eksklyuziv, xavfsiz kirishning illüzyonini beradi, kim kimning fayllarini o'qiy olishini nazorat qiladi va bitta nosoz dasturning qolganlarini ishdan chiqarishiga yo'l qo'ymaydi.</>}
      </P>
      <P>
        {lang === "en"
          ? <>Windows is a <Term>hybrid kernel</Term> OS — it combines a small microkernel responsible for the lowest-level CPU mechanics (scheduling, interrupts, synchronisation) with a richer <Em>Executive</Em> layer that implements file systems, networking, security, and memory management inside kernel mode. This is different from Linux (monolithic kernel, where drivers compile into the kernel image) and macOS (Mach microkernel + BSD subsystem layered on top).</>
          : <>Windows — bu <Term>gibrid yadro</Term> operatsion tizimi: u eng past darajadagi CPU mexanikasi (rejalashtirish, uzilishlar, sinxronizatsiya) uchun mas'ul kichik microkernel'ni va fayl tizimlari, tarmoq, xavfsizlik hamda xotira boshqaruvini kernel mode'da amalga oshiradigan boy <Em>Executive</Em> qatlamini birlashtiradi. Bu Linux'dan (monolitik yadro, drayverlar yadro tasviriga kompilyatsiya qilinadi) va macOS'dan (Mach microkernel + uning ustidagi BSD quyi tizimi) farq qiladi.</>}
      </P>

      <Callout color="var(--c-system)" icon="info" titleUz="Tarixiy eslatma — Dave Cutler va VMS" titleEn="Historical note — Dave Cutler and VMS">
        {lang === "en"
          ? <>Windows NT kernel was designed by <strong>Dave Cutler</strong>, who had previously led the VAX/VMS project at DEC (Digital Equipment Corporation). He brought VMS's design philosophy to Windows NT: strictly separate user mode from kernel mode, give each process a private address space, and never trust user input in privileged code. Windows NT 3.1 shipped in August 1993 — it ran on as little as 8 MB of RAM. The architecture he designed has not fundamentally changed since then: Windows 11 still uses the same ring-based privilege model, the same Executive managers, and the same syscall dispatch table design from 1993.</>
          : <>Windows NT yadrosi <strong>Dave Cutler</strong> tomonidan loyihalashtirilgan — u DEC (Digital Equipment Corporation) kompaniyasida VAX/VMS loyihasini boshqargan. U VMS'ning dizayn falsafasini Windows NT ga olib keldi: user mode'ni kernel mode'dan qat'iy ajratish, har bir jarayonga shaxsiy manzil maydoni berish va hech qachon imtiyozli kodda foydalanuvchi ma'lumotiga ishonmaslik. Windows NT 3.1 1993 yil avgustda chiqdi — u 8 MB RAM da ishladi. U loyihalagan arxitektura o'shandan beri asosan o'zgarmagan: Windows 11 hali ham 1993 yildan o'sha ring-asosidagi imtiyoz modelini, xuddi o'sha Executive menejerlarini va syscall dispatch jadval dizaynini ishlatadi.</>}
      </Callout>

      <h3 style={subhead}>{lang === "en" ? "1.1 — The 4 fundamental jobs of any OS" : "1.1 — Har qanday OS'ning 4 ta asosiy vazifasi"}</h3>
      <P>
        {lang === "en"
          ? <>Every OS — Windows, Linux, macOS — performs the same four core jobs. Understanding these jobs explains <Em>why</Em> certain OS behaviours exist: why Chrome can crash but not take down Windows? Why can Notepad not read another process's memory? Why does a buggy driver cause a BSOD? All four answers point back to these fundamentals.</>
          : <>Har qanday OS — Windows, Linux, macOS — bir xil to'rtta asosiy vazifani bajaradi. Bu vazifalarni tushunish <Em>nima uchun</Em> ba'zi OS xatti-harakatlarining sababini tushuntiradi: nima uchun Chrome qulab tushib, Windows'ni o'chirmaydi? Nima uchun Notepad boshqa jarayonning xotirasini o'qiy olmaydi? Nima uchun nosoz drayver BSOD chiqaradi? Barcha to'rt javob shu asoslarga qaytadi.</>}
      </P>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
        {[
          {
            icon: "users", n: "1", color: "var(--c-user)",
            uz: "Foydalanuvchini ajratish — Process Isolation",
            en: "User isolation — Process Isolation",
            bodyUz: <>Har bir jarayon (process) o'ziga xos, boshqalarga ko'rinmaydigan xotira maydoniga ega. Chrome xato qilsa, Notepad budan hech qachon xabardor bo'lmaydi. Texnik asos — <Term>virtual manzil maydoni (Virtual Address Space)</Term>. 64-bit Windows'da har bir jarayon nazariy jihatdan 128 TB xotira maydoniga ega — lekin bu maydon faqat o'z jarayoni doirasida mavjud, fizik RAM protsessor tomonidan xaritalanadi.<br /><br />Agar bir jarayon boshqasining xotirasini o'qishga harakat qilsa, protsessor darhol <code>#GP (General Protection Fault)</code> istisnosi ko'taradi va OS jarayonni <code>0xC0000005 ACCESS_VIOLATION</code> bilan o'chiradi. Bu nima uchun muhim? Chunki bank dasturi va oddiy o'yin bir xil kompyuterda ishlasa ham, o'yin bank dasturining xotirasidagi parollarni hech qachon o'qiy olmaydi.</>,
            bodyEn: <>Each process has its own private virtual address space, invisible to all others. When Chrome crashes, Notepad never knows. The technical foundation is the <Term>Virtual Address Space</Term>. On 64-bit Windows, each process theoretically has 128 TB of address space — but this space only exists within its own context, mapped from physical RAM by the CPU.<br /><br />If one process tries to read another's memory, the CPU immediately raises a <code>#GP (General Protection Fault)</code> exception and the OS kills the offending process with <code>0xC0000005 ACCESS_VIOLATION</code>. Why does this matter? Because a banking app and a game can run on the same machine, and the game can never read passwords from the bank app's memory.</>,
          },
          {
            icon: "cpu", n: "2", color: "var(--c-system)",
            uz: "Apparatni abstrakt qilish — Hardware Abstraction",
            en: "Hardware abstraction",
            bodyUz: <>Dunyoda minglab xil disk, tarmoq kartasi va GPU mavjud. Agar har bir dastur har bir hardware modeli bilan alohida ishlashni o'rganishi kerak bo'lsa, dastur yozish imkonsiz bo'lardi. OS bu muammoni <Term>drayverlar</Term> orqali hal qiladi: hardware ishlab chiqaruvchisi qurilmasi uchun drayver yozadi, drayver kernelga standart interfeys taqdim etadi, ilova faqat bitta standart API'ni chaqiradi — diskni kim ishlab chiqarishini bilmaydi.<br /><br /><Em>HAL (Hardware Abstraction Layer)</Em> — yana bir abstraksiya qatlami, bu safar protsessor arxitekturasi uchun: bir xil <code>ntoskrnl.exe</code> fayli Intel, AMD va ARM chiplarida qayta kompilyatsiyasiz ishlaydi, chunki HAL har bir protsessor platformasining o'ziga xos xususiyatlarini yashiradi (taymer, uzilish kontrolleri, DMA).</>,
            bodyEn: <>There are thousands of different disk, network and GPU models. If every program had to learn each hardware model individually, writing software would be impossible. The OS solves this with <Term>drivers</Term>: the hardware manufacturer writes a driver for their device, the driver presents a standard interface to the kernel, and the application calls one standard API — it never knows whose disk it is reading.<br /><br /><Em>HAL (Hardware Abstraction Layer)</Em> is another abstraction layer, this time for the CPU architecture itself: the same <code>ntoskrnl.exe</code> binary runs on Intel, AMD and ARM chips without recompilation, because HAL hides each platform's specific details (timer, interrupt controller, DMA).</>,
          },
          {
            icon: "layers", n: "3", color: "var(--c-warn)",
            uz: "Resurslarni boshqarish — Resource Management",
            en: "Resource management",
            bodyUz: <>CPU'ning faqat bir nechta yadrosi bor, lekin yuzlab jarayonlar ishlashi kerak. RAM cheklangan, lekin minglab ilova xotira talab qiladi. Disk I/O sekin, lekin barcha dasturlar bir vaqtda yozish va o'qishni xohlaydi. OS resurslarni adolatli taqsimlaydi va hech bir jarayon monopoliya qila olmasligi uchun kafolat beradi.<br /><br />Windows <Term>scheduler</Term> (rejalashtiruvchi) — CPU vaqtini <Em>15.6 ms</Em> lik kvantlarga bo'lib, prioritet (0–31) bo'yicha jarayonlar o'rtasida taqsimlaydi. Prioritet 31 — eng yuqori (real-time rejim, faqat maxsus tizim uchun). Prioritet 0 — eng past (faqat <code>Zero Page</code> thread uchun saqlab qo'yilgan). Oddiy foydalanuvchi ilovasi odatda 8-prioritetda ishlaydi. RAM etishmasa, <Term>Memory Manager</Term> eski sahifalarni diskdagi <code>pagefile.sys</code> ga ko'chiradi va xotirani bo'shatadi.</>,
            bodyEn: <>The CPU has only a few cores, but hundreds of processes need to run. RAM is finite, but thousands of apps demand memory. Disk I/O is slow, but all programs want to write and read simultaneously. The OS distributes resources fairly and guarantees no single process can monopolise them.<br /><br />The Windows <Term>scheduler</Term> divides CPU time into <Em>15.6 ms</Em> quanta, distributed among processes by priority (0–31). Priority 31 is the highest (real-time mode, reserved for special system use). Priority 0 is the lowest (reserved only for the <code>Zero Page</code> thread). A normal user application typically runs at priority 8. If RAM runs low, the <Term>Memory Manager</Term> moves old pages to <code>pagefile.sys</code> on disk and frees the memory.</>,
          },
          {
            icon: "shield", n: "4", color: "var(--c-attack)",
            uz: "Xavfsizlikni ta'minlash — Security Enforcement",
            en: "Enforce security",
            bodyUz: <>Kim qaysi faylni, jarayonni yoki registr kalitini ochishi mumkin? Bu qarorni OS <Term>Security Reference Monitor (SRM)</Term> orqali qabul qiladi. Har safar fayl, jarayon yoki registr kaliti ochilganda, SRM ikkita narsani solishtiradi: arizachining <Em>Access Token</Em>'ini (kimligini tasdiqlash — foydalanuvchi SID, guruh SID'lar, imtiyozlar ro'yxati) va ob'ektning <Em>ACL (Access Control List)</Em>'ini (kim nimani qila olishini belgilovchi yozuvlar ro'yxati). Agar token'dagi SID ACL'dagi yozuvga mos kelmasa — <code>ERROR_ACCESS_DENIED (0x5)</code>.<br /><br />Bu nazariy emas — shuning uchun Administrator cmd.exe boshqacha ruxsatga ega, oddiy foydalanuvchi <code>C:\Windows\System32</code> ga fayl yoza olmaydi va UAC (User Account Control) siz dasturga administrator ruxsatini bermasligi uchun dialog ko'rsatadi.</>,
            bodyEn: <>Who can open which file, process, or registry key? That decision belongs to the OS — via the <Term>Security Reference Monitor (SRM)</Term>. Every time a file, process, or registry key is opened, the SRM compares two things: the caller's <Em>Access Token</Em> (who they are — user SID, group SIDs, privilege list) against the object's <Em>ACL (Access Control List)</Em> (a list of entries defining who may do what). If the token's SID does not match a matching ACE in the ACL — <code>ERROR_ACCESS_DENIED (0x5)</code>.<br /><br />This is not theoretical — it's why Administrator's cmd.exe has different permissions, why a normal user cannot write to <code>C:\Windows\System32</code>, and why UAC shows a dialog before granting admin privileges to a program.</>,
          },
        ].map((b, i) => (
          <div key={i} style={{
            padding: "18px 20px", borderRadius: 12,
            background: `${b.color}08`,
            border: `1px solid ${b.color}30`,
            borderLeft: `3px solid ${b.color}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 9,
                background: `${b.color}18`, border: `1px solid ${b.color}44`,
                color: b.color, display: "grid", placeItems: "center", flexShrink: 0,
              }}><Icon name={b.icon} size={18} /></div>
              <div>
                <div className="mono" style={{ fontSize: 9.5, color: b.color, letterSpacing: 0.1 }}>{lang === "en" ? "JOB" : "VAZIFA"} #{b.n}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700 }}>{lang === "en" ? b.en : b.uz}</div>
              </div>
            </div>
            <div style={{ fontSize: 13.5, lineHeight: 1.75, color: "var(--text-1)" }}>
              {lang === "en" ? b.bodyEn : b.bodyUz}
            </div>
          </div>
        ))}
      </div>

      <h3 style={subhead}>{lang === "en" ? "1.2 — Windows in numbers" : "1.2 — Raqamlarda Windows"}</h3>
      <P>
        {lang === "en"
          ? <>Before going deeper, here are concrete measurements of the Windows codebase. These numbers make the scope of what you're learning tangible — and explain why Windows has both extraordinary capability and extraordinary attack surface.</>
          : <>Chuqurroq kirishdan oldin, Windows kod bazasining aniq o'lchovlari. Bu raqamlar o'rganayotgan narsangizning miqyosini ko'zga ko'rinadigan qilib qo'yadi — va nima uchun Windows g'ayrioddiy imkoniyat va g'ayrioddiy hujum yuzasiga ham ega ekanini tushuntiradi.</>}
      </P>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 12 }}>
        {[
          { val: "~50M",  uz: "kod satrlari (ntoskrnl + drayverlar + subsistemalar)", en: "lines of code (ntoskrnl + drivers + subsystems)" },
          { val: "~10 MB", uz: "ntoskrnl.exe hajmi (x64, Windows 11)", en: "ntoskrnl.exe file size (x64, Windows 11)" },
          { val: "~460",  uz: "syscall raqamlari (SSDT jadvalida)", en: "syscall numbers in the SSDT table" },
          { val: "128 TB", uz: "har bir jarayonning virtual manzil maydoni (x64)", en: "virtual address space per process (x64)" },
          { val: "0–31",  uz: "thread prioritet darajalari (31 — real-time)", en: "thread priority levels (31 = real-time)" },
          { val: "1993",  uz: "Windows NT 3.1 — bu arxitektura boshlanishi", en: "Windows NT 3.1 — when this architecture began" },
        ].map((f, i) => (
          <div key={i} style={{
            padding: "14px 16px", borderRadius: 10,
            background: "var(--bg-2)", border: "1px solid var(--border)",
            textAlign: "center",
          }}>
            <div className="mono" style={{ fontSize: 22, fontWeight: 700, color: "var(--accent)" }}>{f.val}</div>
            <div style={{ fontSize: 11.5, color: "var(--text-2)", marginTop: 4, lineHeight: 1.4 }}>{lang === "en" ? f.en : f.uz}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
function Section2Theory() {
  const lang = useLang();
  return (
    <section id="theory" style={{ scrollMarginTop: 80, marginBottom: 56 }}>
      <H2 num="02" uz="Asosiy tushunchalar" en="Core concepts" />

      {/* ── 2.1 Process & Thread ── */}
      <h3 style={subhead}>{lang === "en" ? "2.1 — Process and Thread" : "2.1 — Jarayon va Thread"}</h3>
      <P>
        {lang === "en"
          ? <>A <Term>process</Term> is a running instance of a program — not the file on disk, but its live execution in memory. Each process gets: its own private virtual address space (no other process can see into it), a <Em>security token</Em> (which identifies who is running it and what privileges it has), a <Em>handle table</Em> (list of OS objects it has opened — files, pipes, events), and one or more threads. Two instances of Notepad are two separate processes — they share the same code on disk, but each has its own independent memory.</>
          : <>«<Term>Jarayon</Term>» (process) — dasturning xotiradagi jonli nusxasi, diskdagi fayl emas. Har bir jarayon quyidagilarga ega: o'z shaxsiy virtual manzil maydoni (boshqa hech bir jarayon unga kira olmaydi), <Em>xavfsizlik tokeni</Em> (uni kim ishlatayotgani va qanday imtiyozlarga ega ekanini aniqlaydigan), <Em>handle jadvali</Em> (u ochgan OS ob'ektlari ro'yxati — fayllar, pipe'lar, eventlar) va bir yoki bir nechta thread'lar. Notepad'ning ikkita nusxasi — ikkita alohida jarayon: ular diskdagi bir xil kodni baham ko'radi, lekin har birining o'z mustaqil xotirasi bor.</>}
      </P>
      <P>
        {lang === "en"
          ? <>A <Term>thread</Term> is the actual unit of CPU execution — the thing the processor runs. Threads share the parent process's address space, meaning all threads in one process can read and write the same memory (this is both efficient and dangerous — it creates race conditions). The CPU can only execute one thread per core at a time. With 4 cores and 400 threads running, the <Em>scheduler</Em> rapidly context-switches between them. A <Em>context switch</Em> saves the current thread's CPU registers (RIP, RSP, RAX–R15, RFLAGS) to its kernel stack, restores the next thread's registers, and resumes execution — all in microseconds.</>
          : <>«<Term>Thread</Term>» — protsessor bajaradigan haqiqiy birlik. Thread'lar ota jarayonning manzil maydonini baham ko'radi, ya'ni bir jarayondagi barcha thread'lar bir xil xotirani o'qiy va yoza oladi (bu ham samarali, ham xavfli — race condition'larni keltirib chiqaradi). CPU bir vaqtda har bir yadroda faqat bitta thread'ni bajara oladi. 4 yadro va 400 ta thread ishlayotgan bo'lsa, <Em>scheduler</Em> ular o'rtasida tezda kontekst almashishni amalga oshiradi. <Em>Kontekst almashish</Em> joriy thread'ning CPU registrlarini (RIP, RSP, RAX–R15, RFLAGS) uning kernel stack'iga saqlaydi, keyingi thread'ning registrlarini tiklaydi va bajarishni davom ettiradi — bularning barchasi mikrosoniyalarda.</>}
      </P>
      <P>
        {lang === "en"
          ? <>Internally the kernel tracks every process via a structure called <Term>EPROCESS</Term> (Executive Process block) stored in non-paged kernel memory. <code>EPROCESS</code> contains the PID, parent PID, creation time, security token pointer, list of threads (as <code>ETHREAD</code> structures), handle table pointer, and the Virtual Address Descriptor (VAD) tree that maps the entire virtual address space. Forensics tools like Process Hacker read these structures directly — which is why they can show processes even if malware has hidden them from Task Manager's normal API calls.</>
          : <>Ichkarida kernel har bir jarayonni sahifasiz kernel xotirasida saqlangan <Term>EPROCESS</Term> (Executive Process bloki) tuzilmasi orqali kuzatib boradi. <code>EPROCESS</code> quyidagilarni o'z ichiga oladi: PID, ota PID, yaratilish vaqti, xavfsizlik tokeni ko'rsatgichi, thread'lar ro'yxati (<code>ETHREAD</code> tuzilmalari sifatida), handle jadval ko'rsatgichi va butun virtual manzil maydonini xaritalovchi Virtual Address Descriptor (VAD) daraxti. Process Hacker kabi sud-tibbiyot tizimlari bu tuzilmalarni to'g'ridan-to'g'ri o'qiydi — shuning uchun malware Task Manager'ning oddiy API chaqiruvlaridan o'zini yashirsa ham, ular jarayonlarni ko'rsata oladi.</>}
      </P>

      <div style={{ margin: "20px 0", padding: "16px 20px", borderRadius: 10, background: "var(--bg-2)", border: "1px solid var(--border)", fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 1.85 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>// EPROCESS — simplified kernel structure (one per running process)</div>
        <div style={{ color: "var(--c-system)" }}>struct <span style={{ color: "var(--accent)" }}>_EPROCESS</span> {"{"}</div>
        <div style={{ paddingLeft: 24, color: "var(--text-1)" }}>
          <div><span style={{ color: "var(--c-warn)" }}>ULONG</span>{"       "}UniqueProcessId;{"            "}<span style={{ color: "var(--text-3)" }}>// PID e.g. 1234</span></div>
          <div><span style={{ color: "var(--c-warn)" }}>ULONG</span>{"       "}InheritedFromUniqueProcessId; <span style={{ color: "var(--text-3)" }}>// Parent PID</span></div>
          <div><span style={{ color: "var(--c-warn)" }}>EX_FAST_REF</span>{" "}Token;{"                    "}<span style={{ color: "var(--text-3)" }}>// Security token (SID, privileges)</span></div>
          <div><span style={{ color: "var(--c-warn)" }}>LIST_ENTRY</span>{"  "}ThreadListHead;{"            "}<span style={{ color: "var(--text-3)" }}>// Linked list of all ETHREADs</span></div>
          <div><span style={{ color: "var(--c-warn)" }}>PVOID</span>{"       "}ObjectTable;{"               "}<span style={{ color: "var(--text-3)" }}>// Handle table pointer</span></div>
          <div><span style={{ color: "var(--c-warn)" }}>PVOID</span>{"       "}VadRoot;{"                   "}<span style={{ color: "var(--text-3)" }}>// VAD tree (virtual memory map)</span></div>
          <div><span style={{ color: "var(--c-warn)" }}>LARGE_INTEGER</span>{" "}CreateTime;{"              "}<span style={{ color: "var(--text-3)" }}>// When was it spawned?</span></div>
          <div><span style={{ color: "var(--c-warn)" }}>UCHAR</span>{"[15]    "}ImageFileName;{"            "}<span style={{ color: "var(--text-3)" }}>// First 15 chars of exe name</span></div>
        </div>
        <div style={{ color: "var(--c-system)" }}>{"}"}</div>
      </div>

      {/* ── 2.2 User mode vs Kernel mode ── */}
      <h3 style={subhead}>{lang === "en" ? "2.2 — User mode vs Kernel mode" : "2.2 — User mode va Kernel mode"}</h3>
      <P>
        {lang === "en"
          ? <>The x86-64 CPU architecture defines <Em>four privilege rings</Em>: ring 0 (most privileged) through ring 3 (least privileged). Windows uses only two: <Em>ring 0</Em> (kernel mode) for the OS, and <Em>ring 3</Em> (user mode) for every application. Rings 1 and 2 were designed for OS subsystems and device drivers in older systems (like OS/2); Windows NT deliberately skips them — all drivers run at full ring 0 privilege.</>
          : <>x86-64 CPU arxitekturasi <Em>to'rtta imtiyoz halqasini</Em> belgilaydi: ring 0 (eng imtiyozli) dan ring 3 (eng kam imtiyozli) gacha. Windows faqat ikkitasini ishlatadi: <Em>ring 0</Em> (kernel mode) — OS uchun, va <Em>ring 3</Em> (user mode) — har bir ilova uchun. Ring 1 va ring 2 eski tizimlarda (OS/2 kabi) OS quyi tizimlari va drayverlar uchun mo'ljallangan; Windows NT ularni ataylab o'tkazib yuboradi — barcha drayverlar to'liq ring 0 imtiyozi bilan ishlaydi.</>}
      </P>
      <P>
        {lang === "en"
          ? <>The CPU knows which ring it is in through two bits (bits 0–1) of the <code>CS</code> (Code Segment) register — called the <Em>CPL (Current Privilege Level)</Em>. When <code>CS = 0x0008</code>, bits 0–1 are both 0 → CPL = 0 (kernel). When <code>CS = 0x0033</code>, bits 0–1 are both 1 → CPL = 3 (user). The hardware checks CPL on <Em>every single instruction</Em>. If ring 3 code tries to run a privileged instruction (like <code>HLT</code> to stop the CPU or <code>MOV CR0</code> to change paging), the CPU immediately raises a <Em>#GP (General Protection Fault)</Em> — exception number 13 — and Windows terminates the program with <code>0xC0000005 ACCESS_VIOLATION</code>. The crash never reaches any other process.</>
          : <>Protsessor <code>CS</code> (Code Segment) registrining ikki biti (0–1 bitlar) orqali qaysi ringda ekanini biladi — bu <Em>CPL (Current Privilege Level)</Em> deb ataladi. <code>CS = 0x0008</code> bo'lsa, 0–1 bitlar har ikkalasi 0 → CPL = 0 (kernel). <code>CS = 0x0033</code> bo'lsa, 0–1 bitlar har ikkalasi 1 → CPL = 3 (user). Hardware CPL ni <Em>har bir buyruq</Em> uchun tekshiradi. Agar ring 3 kod imtiyozli buyruqni (<code>HLT</code> — protsessorni to'xtatish yoki <code>MOV CR0</code> — sahifalashni o'zgartirish kabi) bajarishga harakat qilsa, protsessor darhol <Em>#GP (General Protection Fault)</Em> — 13-raqamli istisno — ko'taradi va Windows dasturni <code>0xC0000005 ACCESS_VIOLATION</code> bilan o'chiradi. Crash boshqa hech bir jarayonga yetmaydi.</>}
      </P>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
        <div style={{ padding: "14px 16px", borderRadius: 10, background: "rgba(255,145,69,0.06)", border: "1px solid rgba(255,145,69,0.28)" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "var(--c-user)", marginBottom: 10 }}>
            {lang === "en" ? "Ring 3 (user mode) — CAN do:" : "Ring 3 (user mode) — QILA OLADI:"}
          </div>
          {(lang === "en" ? [
            "Normal arithmetic, logic, string operations",
            "Read/write its own process memory (within its VAD)",
            "Call Win32 API (kernel32.dll, user32.dll, gdi32.dll)",
            "Allocate virtual memory via VirtualAlloc()",
            "Create threads, open files, sockets via handles",
            "Cross into ring 0 only via the syscall instruction",
          ] : [
            "Oddiy arifmetik, mantiqiy, satr operatsiyalari",
            "O'z jarayon xotirasini o'qish/yozish (VAD ichida)",
            "Win32 API chaqirish (kernel32.dll, user32.dll, gdi32.dll)",
            "VirtualAlloc() orqali virtual xotira ajratish",
            "Thread yaratish, handle orqali fayl va socket ochish",
            "Ring 0 ga faqat syscall buyrug'i orqali o'tish",
          ]).map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5, fontSize: 12.5, color: "var(--text-1)" }}>
              <span style={{ color: "var(--c-user)", flexShrink: 0 }}>✓</span>{item}
            </div>
          ))}
        </div>
        <div style={{ padding: "14px 16px", borderRadius: 10, background: "rgba(255,58,94,0.06)", border: "1px solid rgba(255,58,94,0.28)" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "var(--c-attack)", marginBottom: 10 }}>
            {lang === "en" ? "Ring 3 — CANNOT do (triggers #GP fault):" : "Ring 3 — QILA OLMAYDI (#GP xato):"}
          </div>
          {(lang === "en" ? [
            "HLT — halt the CPU",
            "LGDT / LIDT — load Global/Interrupt Descriptor Tables",
            "MOV CR0–CR4 — modify control registers (paging, protection)",
            "WRMSR / RDMSR — write/read model-specific registers",
            "IN / OUT — directly access hardware I/O ports",
            "CLI / STI — disable / re-enable hardware interrupts",
          ] : [
            "HLT — protsessorni to'xtatish",
            "LGDT / LIDT — Global/Interrupt Descriptor Jadvallarini yuklash",
            "MOV CR0–CR4 — boshqaruv registrlarini o'zgartirish (sahifalash, himoya)",
            "WRMSR / RDMSR — model-specific registrlarni yozish/o'qish",
            "IN / OUT — hardware I/O portlarini to'g'ridan-to'g'ri o'qish/yozish",
            "CLI / STI — hardware uzilishlarini o'chirish / qayta yoqish",
          ]).map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5, fontSize: 12.5, color: "var(--text-1)" }}>
              <span style={{ color: "var(--c-attack)", flexShrink: 0 }}>✗</span>{item}
            </div>
          ))}
        </div>
      </div>

      <Callout color="var(--c-attack)" icon="skull" titleUz="Kernel mode xatosi = BSOD" titleEn="Kernel mode crash = BSOD">
        {lang === "en"
          ? <>When user-mode (ring 3) code crashes — say, Notepad has a bug — Windows simply terminates that one process. The rest of the system keeps running untouched. But when kernel-mode (ring 0) code crashes — a driver dereferences a null pointer, a timer callback corrupts the stack — there is no higher authority to contain it. The entire machine halts: <Em>Bug Check (Blue Screen of Death)</Em>. The system writes a memory dump to disk and reboots. This is why driver quality is the #1 stability factor in Windows — and why Microsoft requires all third-party drivers to be digitally signed.</>
          : <>User mode (ring 3) kodi qulab tushganda — masalan, Notepad'da xato bo'lsa — Windows faqat o'sha jarayonni o'chiradi. Tizimning qolgan qismi ta'sirlanmasdan ishlashda davom etadi. Lekin kernel mode (ring 0) kodi qulab tushganda — drayver null ko'rsatgichni dereference qiladi, taymer callback stack'ni buzadi — uni ushlaydigan yuqori hokimiyat yo'q. Butun mashina to'xtaydi: <Em>Bug Check (Ko'k Ekran O'limi — BSOD)</Em>. Tizim xotira dumpini diskka yozadi va qayta ishga tushadi. Shuning uchun drayver sifati Windows'dagi №1 barqarorlik omili — va Microsoft nima uchun barcha uchinchi tomon drayverlarni raqamli imzolashni talab qiladi.</>}
      </Callout>

      {/* ── 2.3 Executive & Microkernel ── */}
      <h3 style={subhead}>{lang === "en" ? "2.3 — The Executive and the Microkernel" : "2.3 — Executive va Microkernel"}</h3>
      <P>
        {lang === "en"
          ? <>Both the Executive and the Microkernel live inside a single file: <code>ntoskrnl.exe</code> (~10 MB on Windows 11 x64, exporting ~4,000 symbols). The <Term>Microkernel</Term> is the small, ultra-stable core that handles the most fundamental CPU operations — it never makes policy decisions. The <Term>Executive</Term> is the richer layer above it that implements all OS policy. Together they are called the <Em>Windows Executive</Em> or simply <Em>the kernel</Em> in everyday language.</>
          : <>Executive va Microkernel ikkisi ham bitta faylda yashaydi: <code>ntoskrnl.exe</code> (Windows 11 x64 da ~10 MB, ~4,000 ta simvol eksport qiladi). <Term>Microkernel</Term> — eng asosiy CPU operatsiyalarini boshqaradigan kichik, o'ta barqaror yadro — u hech qachon siyosat qarorlari qabul qilmaydi. <Term>Executive</Term> — barcha OS siyosatlarini amalga oshiradigan uning ustidagi boy qatlam. Birgalikda ular <Em>Windows Executive</Em> yoki kundalik tilda oddiygina <Em>kernel</Em> deb ataladi.</>}
      </P>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
        <div style={{ padding: "14px 16px", borderRadius: 10, background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.25)" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "var(--c-system)", marginBottom: 10 }}>
            {lang === "en" ? "Microkernel handles:" : "Microkernel boshqaradi:"}
          </div>
          {(lang === "en" ? [
            "Thread scheduling — priority 0-31, 15.6 ms quantum",
            "IDT (Interrupt Descriptor Table) — 256-entry CPU exception routing",
            "Spinlocks & dispatcher locks — multi-CPU synchronisation",
            "Clock interrupts — HPET / APIC timer at 15.6 ms",
            "Trap / exception dispatch — routes #GP, #PF, NMI to handlers",
            "DPC (Deferred Procedure Call) — post-interrupt work queue",
          ] : [
            "Thread rejalashtiruvi — prioritet 0-31, 15.6 ms kvant",
            "IDT (Interrupt Descriptor Table) — 256 yozuvli CPU istisno yo'naltirish",
            "Spinlock va dispatcher lock'lar — ko'p CPU sinxronizatsiyasi",
            "Soat uzilishlari — HPET / APIC taymer, 15.6 ms da",
            "Trap / exception dispatch — #GP, #PF, NMI ni handlerlarga yo'naltirish",
            "DPC (Deferred Procedure Call) — uzilishdan keyingi ish navbati",
          ]).map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5, fontSize: 12.5, color: "var(--text-1)" }}>
              <span style={{ color: "var(--c-system)", flexShrink: 0 }}>▸</span>{item}
            </div>
          ))}
        </div>
        <div style={{ padding: "14px 16px", borderRadius: 10, background: "rgba(180,100,255,0.06)", border: "1px solid rgba(180,100,255,0.25)" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "#b48cff", marginBottom: 10 }}>
            {lang === "en" ? "Executive — 6 managers:" : "Executive — 6 ta menejer:"}
          </div>
          {(lang === "en" ? [
            "Process Manager — EPROCESS/ETHREAD, NtCreateProcess",
            "Memory Manager — virtual memory, page faults, pagefile.sys, ASLR",
            "I/O Manager — IRP lifecycle, driver stack dispatch",
            "Object Manager — reference counting, handle table",
            "Security Reference Monitor — token ↔ ACL check on every Nt* call",
            "Cache Manager — write-back file cache, mapped sections",
          ] : [
            "Jarayon Menejeri — EPROCESS/ETHREAD, NtCreateProcess",
            "Xotira Menejeri — virtual xotira, sahifa xatolari, pagefile.sys, ASLR",
            "I/O Menejeri — IRP hayot tsikli, drayver stekini yuborish",
            "Ob'ekt Menejeri — reference counting, handle jadvali",
            "Xavfsizlik Reference Monitor — har bir Nt* chaqiruvda token ↔ ACL tekshiruvi",
            "Kesh Menejeri — write-back fayl keshi, xaritalangan bo'limlar",
          ]).map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5, fontSize: 12.5, color: "var(--text-1)" }}>
              <span style={{ color: "#b48cff", flexShrink: 0 }}>▸</span>{item}
            </div>
          ))}
        </div>
      </div>

      <P style={{ marginTop: 16 }}>
        {lang === "en"
          ? <>Below the microkernel sits the <Term>HAL (Hardware Abstraction Layer)</Term> — implemented in <code>hal.dll</code>. HAL hides the differences between specific processor platforms so the same <code>ntoskrnl.exe</code> binary runs on Intel, AMD, and ARM without recompilation. HAL handles: interrupt controller routing (APIC on x64, GIC on ARM), high-resolution timer calibration (for the 15.6 ms scheduler tick), multi-processor boot (waking Application Processor cores), and DMA buffer management. Without HAL, Microsoft would need a separate kernel build for every CPU platform — instead, only HAL is rebuilt per platform, and ntoskrnl stays the same.</>
          : <>Microkernel'dan pastda <Term>HAL (Hardware Abstraction Layer)</Term> — <code>hal.dll</code> da amalga oshiriladi. HAL ma'lum protsessor platformalar o'rtasidagi farqlarni yashiradi, shunda bir xil <code>ntoskrnl.exe</code> binary Intel, AMD va ARM'da qayta kompilyatsiyasiz ishlaydi. HAL quyidagilarni boshqaradi: uzilish kontrolleri yo'naltirish (x64 da APIC, ARM'da GIC), yuqori aniqlikdagi taymer kalibrlash (15.6 ms scheduler tikki uchun), ko'p protsessorli yuklash (Application Processor yadrolarini uyg'otish) va DMA bufer boshqaruvi. HALsiz, Microsoft har bir CPU platformasi uchun alohida kernel to'plami kerak bo'lardi — buning o'rniga faqat HAL har bir platform uchun qayta to'planadi, ntoskrnl esa bir xil qoladi.</>}
      </P>

      {/* ── 2.4 Subsystems & Win32 ── */}
      <h3 style={subhead}>{lang === "en" ? "2.4 — Subsystems, Win32, and the call chain" : "2.4 — Subsistemalar, Win32 va chaqiruv zanjiri"}</h3>
      <P>
        {lang === "en"
          ? <>Applications never call the kernel directly. Every call passes through a strict chain of DLLs. At the top are the <Term>Win32 subsystem DLLs</Term>, which expose the familiar Windows API (~10,000 functions). Below them is <code>ntdll.dll</code>, which provides the <Em>Native API</Em> — a much smaller set of ~460 functions that map directly to kernel syscall numbers. <code>ntdll.dll</code> is the last stop in ring 3 before the <code>SYSCALL</code> instruction fires and the CPU switches to ring 0.</>
          : <>Ilovalar hech qachon kernelga to'g'ridan-to'g'ri murojaat qilmaydi. Har bir chaqiruv qat'iy DLL'lar zanjiridanf o'tadi. Eng yuqorida tanish Windows API'ni (~10,000 funksiya) taqdim etuvchi <Term>Win32 quyi tizim DLL</Term>'lari joylashgan. Ularning ostida <code>ntdll.dll</code> bor, u <Em>Native API</Em>'ni — kernel syscall raqamlariga to'g'ridan-to'g'ri mos keladigan ~460 funksiyaning ancha kichikroq to'plamini — taqdim etadi. <code>ntdll.dll</code> — <code>SYSCALL</code> buyrug'i o'qqa to'lib, protsessor ring 0 ga o'tgunga qadar ring 3 dagi oxirgi to'xtash joyi.</>}
      </P>

      <div style={{ margin: "18px 0", padding: "18px 20px", borderRadius: 12, background: "var(--bg-2)", border: "1px solid var(--border)" }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>// FULL CALL CHAIN — ReadFile("secret.txt") step by step</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5, fontFamily: "var(--font-mono)", fontSize: 12 }}>
          {[
            { ring: "Ring 3", label: "notepad.exe", call: 'ReadFile(hFile, buffer, 1024, &bytesRead, NULL)', color: "var(--c-user)", note: "Win32 API — developer-facing" },
            { ring: "Ring 3", label: "kernel32.dll", call: 'translates → NtReadFile(handle, event, apcRoutine, ...)', color: "var(--c-user)", note: "Win32 subsystem DLL" },
            { ring: "Ring 3", label: "ntdll.dll", call: 'mov eax, 0x0006   ; syscall number for NtReadFile\nsyscall            ; cross into ring 0', color: "var(--c-warn)", note: "Native API — last ring 3 stop" },
            { ring: "Ring 0", label: "ntoskrnl.exe", call: 'I/O Manager: validate params, build IRP\nSRM: check handle vs ACL', color: "var(--c-system)", note: "Executive: security + dispatch" },
            { ring: "Ring 0", label: "ntfs.sys → disk.sys", call: 'handle IRP_MJ_READ\nread sectors from disk via DMA', color: "var(--c-system)", note: "Driver stack" },
          ].map((row, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "52px 1fr",
              padding: "8px 10px", borderRadius: 7, gap: 12, alignItems: "flex-start",
              background: i >= 3 ? "rgba(0,212,255,0.05)" : "rgba(255,145,69,0.04)",
              borderLeft: `2px solid ${row.color}`,
            }}>
              <span className="mono" style={{ fontSize: 9.5, color: row.color, paddingTop: 2 }}>{row.ring}</span>
              <div>
                <div style={{ fontSize: 10.5, color: "var(--text-2)", marginBottom: 2 }}>{row.label} — <em style={{ color: "var(--text-3)" }}>{row.note}</em></div>
                <div style={{ color: "var(--text-1)", whiteSpace: "pre-wrap" }}>{row.call}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <P>
        {lang === "en"
          ? <>One more critical piece: <Term>WOW64 (Windows-on-Windows 64)</Term>. When a 32-bit app (compiled for x86) runs on 64-bit Windows, WOW64 intercepts every syscall and re-translates the 32-bit calling convention into 64-bit before passing it to the actual kernel. The 32-bit app believes it is on a 32-bit OS; the kernel never sees a 32-bit call. This transparent translation layer is why 32-bit software still runs unchanged on Windows 11 x64. Importantly for security: EDRs must hook BOTH the 64-bit ntdll.dll and the 32-bit ntdll inside WOW64, otherwise a 32-bit process can bypass 64-bit hooks entirely.</>
          : <>Yana bir muhim qism: <Term>WOW64 (Windows-on-Windows 64)</Term>. 64-bit Windows da 32-bit ilova (x86 uchun kompilyatsiya qilingan) ishlayotganida, WOW64 har bir syscall'ni ushlab oladi va 32-bit chaqiruv konvensiyasini haqiqiy kernelga topshirishdan oldin 64-bit ga qayta tarjima qiladi. 32-bit ilova 32-bit OS'da ishlayotgandek his qiladi; kernel 32-bit chaqiruvni hech qachon ko'rmaydi. Bu shaffof tarjima qatlami sababli 32-bit dasturiy ta'minot hali ham Windows 11 x64 da o'zgarishsiz ishlaydi. Xavfsizlik nuqtai nazaridan muhimi: EDR'lar HAM 64-bit ntdll.dll, ham WOW64 ichidagi 32-bit ntdll'ga hook qo'yishi kerak — aks holda 32-bit jarayon 64-bit hook'larini butunlay chetlab o'ta oladi.</>}
      </P>
    </section>
  );
}
const subhead = { fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, margin: "28px 0 8px", letterSpacing: "-0.01em" };

// ─────────────────────────────────────────────────────────────
function Section3Layered() {
  const lang = useLang();

  const layers = [
    {
      ring: "Ring 3", color: "var(--c-user)",
      uz: "Foydalanuvchi ilovalar", en: "User Applications",
      files: "notepad.exe · chrome.exe · powershell.exe · malware.exe ...",
      bodyUz: "Har qanday EXE fayl shu qatlamda ishlaydi. Faqat OS ruxsat bergan narsani qila oladi: o'z xotirasini o'qish/yozish, Win32 API chaqirish, syscall orqali kernelga so'rov yuborish. Hardware ko'rinmaydi. Boshqa jarayon xotirasiga tegib bo'lmaydi. Bu qatlam qulab tushsa — faqat o'sha jarayon o'ladi.",
      bodyEn: "Any EXE runs here. Can only do what the OS permits: read/write its own memory, call Win32 API, send requests to the kernel via syscall. Hardware is invisible. Cannot touch other process memory. If this layer crashes — only that one process dies.",
    },
    {
      ring: "Ring 3", color: "var(--c-user)",
      uz: "Win32 quyi tizim DLL'lari", en: "Win32 Subsystem DLLs",
      files: "kernel32.dll · user32.dll · gdi32.dll · advapi32.dll · ws2_32.dll",
      bodyUz: "Dasturchilar yozgan tanish funksiyalarni (CreateFile, DrawText, RegOpenKey, connect) kernelning Native API'ga tarjima qiladi. ~10,000 Win32 funksiya mavjud. Bu qatlam Windows dasturlashning boshlanish nuqtasi — deyarli barcha dasturlar shu DLL'lardan birortasiga bog'liq.",
      bodyEn: "Translates the familiar developer-facing functions (CreateFile, DrawText, RegOpenKey, connect) into the kernel's Native API. ~10,000 Win32 functions exist. This layer is the starting point for all Windows programming — nearly every program links to at least one of these DLLs.",
    },
    {
      ring: "Ring 3", color: "var(--c-warn)",
      uz: "Native API — oxirgi user-mode to'xtash joyi", en: "Native API — last user-mode stop",
      files: "ntdll.dll",
      bodyUz: "Win32 DLL'larning barchasi oxirida ntdll.dll funksiyalarini chaqiradi (NtCreateFile, NtReadFile, NtOpenProcess...). ntdll ichidagi har bir Nt* funksiya protsessorda syscall buyrug'ini bajaradi — bu ring 3 dan ring 0 ga o'tishning yagona qonuniy usuli. EDR va antivirus tizimlari hook'larini aynan shu joyga — ntdll ichiga — qo'yadi, chunki bu syscall'dan oldingi so'nggi nuqta.",
      bodyEn: "All Win32 DLLs ultimately call ntdll.dll (NtCreateFile, NtReadFile, NtOpenProcess...). Each Nt* function inside ntdll executes the syscall instruction on the CPU — the only legal way to cross from ring 3 to ring 0. EDR and antivirus systems place their hooks exactly here — inside ntdll — because this is the last point before the syscall.",
    },
    {
      ring: "Syscall", color: "#f5a623",
      uz: "Syscall chegarasi — ring 3 → ring 0", en: "Syscall gate — ring 3 → ring 0",
      files: "SYSCALL instruction (x64) · SYSENTER (x86 legacy)",
      bodyUz: "Bu yagona qonuniy o'tish nuqtasi. SYSCALL protsessorda atomik ravishda: (1) RIP ni LSTAR MSR'dagi kernel handler manziliga o'rnatadi, (2) CS'ni 0x0010 (ring 0) ga o'zgartiradi, (3) RSP'ni kernel stack'ga ko'chiradi, (4) RFLAGS'ni tozalaydi. Bu to'rtta qadam bittada — uziltirib bo'lmaydi. Syscall raqami EAX registrida uzatiladi (masalan, NtReadFile = 0x0006).",
      bodyEn: "This is the single legal crossing point. SYSCALL atomically: (1) sets RIP to the kernel handler address from LSTAR MSR, (2) changes CS to 0x0010 (ring 0), (3) moves RSP to the kernel stack, (4) clears RFLAGS. All four steps happen as one — cannot be interrupted. The syscall number is passed in EAX (e.g. NtReadFile = 0x0006).",
    },
    {
      ring: "Ring 0", color: "var(--c-system)",
      uz: "Executive — 6 menejer", en: "Executive — 6 managers",
      files: "ntoskrnl.exe (Process · Memory · I/O · Object · SRM · Cache Managers)",
      bodyUz: "Barcha OS siyosatini amalga oshiradi. Har bir Nt* chaqiruvi parametrlarni tekshiradi, xavfsizlik tekshiruvini o'tkazadi, tegishli menejerga yo'naltiradi. Xotira ajratadi, jarayonlar yaratadi, fayllarni boshqaradi, har bir kirish so'rovida token ↔ ACL tekshiruvi o'tkazadi. Executive kernel'dagi barcha 'nima va nega' qarorlarini qabul qiladi.",
      bodyEn: "Implements all OS policy. Every Nt* call validates parameters, runs security checks, routes to the appropriate manager. Allocates memory, creates processes, manages files, runs token ↔ ACL checks on every access request. The Executive makes all the 'what and why' decisions in the kernel.",
    },
    {
      ring: "Ring 0", color: "var(--c-system)",
      uz: "Microkernel — CPU mexanikasi", en: "Microkernel — CPU mechanics",
      files: "ntoskrnl.exe (kernel core) — scheduler · IDT · spinlocks · DPC",
      bodyUz: "Thread'larni rejalashtirishni (prioritet 0-31, 15.6 ms kvant), uzilishlarni yo'naltirishni (IDT — 256 yozuv), CPU sinxronizatsiyasini (spinlock'lar) va DPC (Deferred Procedure Call) navbatlarini boshqaradi. Siyosat qarorlarini qabul qilmaydi — bu Executive ishi. Faqat mexanikani ta'minlaydi.",
      bodyEn: "Handles thread scheduling (priority 0-31, 15.6 ms quantum), interrupt routing (IDT — 256 entries), CPU synchronisation (spinlocks), and DPC (Deferred Procedure Call) queues. Makes no policy decisions — that is the Executive's job. Only provides the mechanics.",
    },
    {
      ring: "Ring 0", color: "#5dade2",
      uz: "HAL — Hardware Abstraction Layer", en: "HAL — Hardware Abstraction Layer",
      files: "hal.dll",
      bodyUz: "Protsessor platformasi farqlarini yashiradi. Bir xil ntoskrnl.exe Intel, AMD va ARM chiplarida ishlaydi, chunki HAL har bir platforma uchun uzilish yo'naltirish (APIC/GIC), yuqori aniqlikdagi taymer va DMA'ni boshqaradi. HALsiz — har bir CPU platformasi uchun alohida kernel kerak bo'lardi.",
      bodyEn: "Hides CPU platform differences. The same ntoskrnl.exe runs on Intel, AMD and ARM chips because HAL manages interrupt routing (APIC/GIC), high-precision timer, and DMA for each platform. Without HAL — a separate kernel would be needed for every CPU platform.",
    },
    {
      ring: "Hardware", color: "#8390a8",
      uz: "Fizik hardware", en: "Physical hardware",
      files: "CPU · RAM · NVMe SSD · NIC · GPU · TPM · USB controllers ...",
      bodyUz: "Haqiqiy silikon. OS bu qatlamga hech qachon to'g'ridan-to'g'ri murojaat qilmaydi — HAL orqali o'tadi. Ilovalar bu qatlamni umuman ko'rmaydi. Hardware'ga to'g'ridan-to'g'ri murojaat qilishga urinish #GP fault yoki hardware exception bilan tugaydi.",
      bodyEn: "The actual silicon. The OS never touches this layer directly — it goes through HAL. Applications never see this layer at all. Attempting to directly access hardware from user mode triggers a #GP fault or hardware exception.",
    },
  ];

  return (
    <section id="layered" style={{ scrollMarginTop: 80, marginBottom: 56 }}>
      <H2 num="03" uz="Qatlamli arxitektura" en="Layered architecture" />
      <P>
        {lang === "en"
          ? <>Windows is built in strict layers — each layer can only communicate with the layers immediately above and below it, never skipping. This is not just good engineering; it is a <Em>security boundary</Em>. No application can reach the hardware without passing through every gate above it. The interactive diagram below shows the full stack. Below that, a layer-by-layer breakdown explains every level in detail.</>
          : <>Windows qat'iy qatlamlarda qurilgan — har bir qatlam faqat undan darhol yuqori va pastdagi qatlamlar bilan muloqot qila oladi, hech qachon o'tkazib yubormaydi. Bu nafaqat yaxshi muhandislik; bu <Em>xavfsizlik chegarasi</Em>. Hech bir ilova uning ustidagi har bir eshikdan o'tmasdan hardware'ga yeta olmaydi. Quyidagi interaktiv diagramma to'liq stekni ko'rsatadi. Undan keyin, qatlam-qatlamli tahlil har bir darajani batafsil tushuntiradi.</>}
      </P>

      <div style={{ marginTop: 20 }}>
        <WindowsArchDiagram />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 18 }}>
        <Callout color="var(--c-user)" icon="user" titleUz="Ring 3 (user)" titleEn="Ring 3 (user)" small>
          {lang === "en" ? "Sandboxed. Can't touch hardware, can't read kernel memory." : "Sandbox'lashtirilgan. Hardware'ga tegmaydi, kernel xotirasini ko'rmaydi."}
        </Callout>
        <Callout color="var(--c-warn)" icon="warning" titleUz="Syscall chegarasi" titleEn="Syscall gate" small>
          {lang === "en" ? "The single legal door — every privileged action passes through here." : "Yagona qonuniy eshik — har bir imtiyozli amal shu yerdan o'tadi."}
        </Callout>
        <Callout color="var(--c-system)" icon="cpu" titleUz="Ring 0 (kernel)" titleEn="Ring 0 (kernel)" small>
          {lang === "en" ? "Full access. One bug here = blue screen for the whole machine." : "To'liq kirish. Bu yerdagi bitta xato = butun mashinaga ko'k ekran."}
        </Callout>
      </div>

      <h3 style={subhead}>{lang === "en" ? "3.1 — Layer-by-layer breakdown" : "3.1 — Qatlam-qatlam batafsil tahlil"}</h3>
      <P>
        {lang === "en"
          ? <>Each row below shows one layer of the Windows architecture stack: the privilege ring it runs in, which files implement it, and exactly what it does. Read top-to-bottom — this is the path every API call follows from your application down to the physical disk.</>
          : <>Quyidagi har bir qator Windows arxitektura stekining bir qatlamini ko'rsatadi: u ishlayotgan imtiyoz ringi, uni amalga oshiradigan fayllar va u nima qilishi. Yuqoridan pastga o'qing — bu har bir API chaqiruvi sizning ilovangizdan jismoniy diskgacha o'tadigan yo'l.</>}
      </P>

      <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 14 }}>
        {layers.map((layer, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "64px 1fr",
            borderRadius: 10, overflow: "hidden",
            border: `1px solid ${layer.color}30`,
          }}>
            <div style={{
              background: `${layer.color}18`,
              borderRight: `2px solid ${layer.color}50`,
              padding: "12px 8px",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
            }}>
              <div className="mono" style={{ fontSize: 9, color: layer.color, textAlign: "center", letterSpacing: 0.04, lineHeight: 1.4 }}>
                {layer.ring.split(" ").map((w, j) => <div key={j}>{w}</div>)}
              </div>
            </div>
            <div style={{ padding: "12px 16px", background: `${layer.color}05` }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: layer.color, marginBottom: 2 }}>
                {lang === "en" ? layer.en : layer.uz}
              </div>
              <div className="mono" style={{ fontSize: 10.5, color: "var(--text-2)", marginBottom: 7 }}>{layer.files}</div>
              <div style={{ fontSize: 12.5, color: "var(--text-1)", lineHeight: 1.7 }}>
                {lang === "en" ? layer.bodyEn : layer.bodyUz}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Callout color="var(--c-attack)" icon="skull" titleUz="Hujumchi nuqtai nazaridan — nima uchun bu stack muhim" titleEn="Attacker's perspective — why this stack matters">
        {lang === "en"
          ? <>An attacker's goal is almost always to move <Em>down</Em> this stack — from a sandboxed process (ring 3) toward the kernel (ring 0). Every layer is a potential attack surface: injecting a DLL gives code in user space, hooking ntdll bypasses EDR monitoring, exploiting a driver vulnerability achieves full ring 0 control over the entire machine. Understanding each layer's role is the foundation of both attack and defence — you cannot protect what you don't understand, and you cannot exploit what you haven't mapped.</>
          : <>Hujumchining maqsadi deyarli har doim shu stackda <Em>pastga</Em> tushish — sandboxlangan jarayondan (ring 3) kernelga (ring 0) tomon. Har bir qatlam potensial hujum yuzasi: DLL kiritish user space'da kod beradi, ntdll'ga hook qo'yish EDR monitoringini chetlab o'tadi, drayver zaifligini ekspluatatsiya qilish butun mashinada to'liq ring 0 nazoratini ta'minlaydi. Har bir qatlamning rolini tushunish hujum va mudofaaning ham asosi — tushunmagan narsangizni himoya qila olmaysiz va xaritalamagan narsangizni ekspluatatsiya qila olmaysiz.</>}
      </Callout>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Boot step card component
function BootStep({ n, icon, color, titleUz, titleEn, children }) {
  const lang = useLang();
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "auto 1fr", gap: 0,
      marginBottom: 4,
    }}>
      {/* Left: number + connector */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 52 }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
          background: `${color}18`, border: `2px solid ${color}`,
          color, display: "grid", placeItems: "center",
          fontSize: 18, fontWeight: 800, fontFamily: "var(--font-mono)",
          boxShadow: `0 0 14px ${color}44`,
        }}>{n}</div>
        <div style={{ width: 2, flex: 1, minHeight: 20, background: `${color}30`, marginTop: 4 }} />
      </div>
      {/* Right: content */}
      <div style={{
        background: `${color}08`, border: `1px solid ${color}22`,
        borderRadius: 12, padding: "16px 20px", marginLeft: 12, marginBottom: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: `${color}18`, border: `1px solid ${color}44`,
            color, display: "grid", placeItems: "center",
          }}><Icon name={icon} size={16} /></div>
          <div style={{ fontWeight: 700, fontSize: 15, color }}>
            {lang === "en" ? titleEn : titleUz}
          </div>
        </div>
        <div style={{ fontSize: 13.5, lineHeight: 1.75, color: "var(--text-1)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function Section4Boot() {
  const lang = useLang();
  const chart = `
flowchart TD
    A([Power on]) --> B[UEFI / BIOS<br/>POST + firmware]
    B --> C[Bootloader<br/>bootmgr → winload.efi]
    C --> D{Secure Boot<br/>verifies signature?}
    D -->|OK| E[Kernel loads<br/>ntoskrnl.exe + HAL]
    D -->|FAIL| X([Boot blocked])
    E --> F[SMSS.exe<br/>session manager]
    F --> G[CSRSS<br/>Win32 subsystem]
    F --> H[WININIT<br/>+ services.exe]
    H --> I[LSASS<br/>security subsystem]
    H --> J[LOGONUI<br/>login screen]
    J --> K([User session])

    style A fill:#1a2342,stroke:#4d8bff,color:#fff
    style K fill:#0a3a1f,stroke:#00ff9c,color:#fff
    style X fill:#3a0a1a,stroke:#ff3a5e,color:#fff
    style D fill:#2a1f3a,stroke:#b88cff,color:#fff
  `;

  return (
    <section id="boot" style={{ scrollMarginTop: 80, marginBottom: 56 }}>
      <H2 num="04" uz="Boot jarayoni" en="The boot process" />
      <P>
        {lang === "en"
          ? <>From the moment you press the power button to the login screen, Windows passes through a precisely choreographed sequence. Each stage hands off to the next and verifies it — so a single compromised step can be detected.</>
          : <>Quvvat tugmasini bosgan paytdan login ekranigacha, Windows aniq xoreografiyalashtirilgan ketma-ketlikdan o'tadi. Har bir bosqich keyingisiga estafetani uzatadi va uni tekshiradi — shuning uchun bitta buzilgan bosqichni aniqlash mumkin.</>}
      </P>

      <div style={{ marginTop: 22 }}>
        <MermaidDiagram
          chart={chart}
          caption="1-rasm. Windows boot ketma-ketligi: POST → bootloader → kernel → user session."
          captionEn="Fig 1. Windows boot sequence: POST → bootloader → kernel → user session."
        />
      </div>

      {/* Step-by-step breakdown */}
      <div style={{ marginTop: 36, marginBottom: 8 }}>
        <div className="eyebrow" style={{ marginBottom: 20 }}>
          {lang === "en" ? "// STEP_BY_STEP — what happens at each stage" : "// BOSQICHMA_BOSQICH — har bir qadamda nima sodir bo'ladi"}
        </div>

        <BootStep n="1" icon="zap" color="var(--c-auth)"
          titleUz="Power On — Elektr tokini yoqish"
          titleEn="Power On — Electricity on">
          {lang === "en"
            ? <>When you press the power button, the <Em>Power Supply Unit (PSU)</Em> sends a stable signal to the motherboard: "Power is ready, you may start." Only after this signal does the CPU execute its very first instruction — always from the same fixed address in ROM.</>
            : <>Siz tugmani bosganingizda, <Em>tok manbai (PSU)</Em> ona plataga signal yuboradi: «Elektr barqaror, ish boshlashimiz mumkin». Faqat shundan keyin CPU o'zining birinchi ko'rsatmasini bajaradi — har doim ROM'dagi qat'iy belgilangan manzildan.</>}
        </BootStep>

        <BootStep n="2" icon="shield" color="var(--c-warn)"
          titleUz="UEFI / BIOS va POST — Qorovulning ertalabki tekshiruvi"
          titleEn="UEFI / BIOS + POST — The morning inspection">
          {lang === "en"
            ? <><Em>POST (Power-On Self Test)</Em> is the first to run — hardware checks itself: is RAM present? Is the CPU working? Then <Em>UEFI</Em> (modern successor to BIOS) maps all components and checks the <Em>Secure Boot</Em> signature chain. If a bootkit tampered with the bootloader, UEFI refuses to hand off — this is exactly how <code>BlackLotus</code> was supposed to be stopped.</>
            : <><Em>POST (Power-On Self Test)</Em> birinchi ishlaydi — hardware o'zini o'zi tekshiradi: RAM joyidami? CPU ishlayaptimi? Klaviatura ulanganmi? Keyin <Em>UEFI</Em> (zamonaviy BIOS o'rniga) barcha qismlarni xaritalaydi va <Em>Secure Boot</Em> imzo zanjirini tekshiradi. Agar bootkit bootloader'ni o'zgartirgan bo'lsa, UEFI estafetani uzatishdan bosh tortadi — <code>BlackLotus</code> aynan shunday to'xtatilishi kerak edi.</>}
        </BootStep>

        <BootStep n="3" icon="database" color="var(--c-system)"
          titleUz="Boot Manager — bootmgr.efi (Zavod direktori)"
          titleEn="Boot Manager — bootmgr.efi">
          {lang === "en"
            ? <>UEFI hands off to <code>bootmgr.efi</code> on the EFI System Partition. Its only job: read the <Em>BCD (Boot Configuration Data)</Em> store and decide which OS to load. If you dual-boot (Windows + Kali Linux), this is where the menu appears. Single OS? It jumps straight ahead.</>
            : <>UEFI EFI System Partition'dagi <code>bootmgr.efi</code> fayliga estafetani uzatadi. Uning yagona vazifasi: <Em>BCD (Boot Configuration Data)</Em> ni o'qib, qaysi OT ni yuklashni hal qilish. Agar ikki OT o'rnatilgan bo'lsa (Windows + Kali Linux) — aynan shu yerda menyu paydo bo'ladi. Bitta OT bo'lsa — to'g'ri keyingisiga o'tadi.</>}
        </BootStep>

        <BootStep n="4" icon="cpu" color="var(--accent)"
          titleUz="Windows Loader — winload.efi (Stolga kitoblar qo'yish)"
          titleEn="Windows Loader — winload.efi">
          {lang === "en"
            ? <><code>winload.efi</code> reads the Windows kernel (<code>ntoskrnl.exe</code>), the Hardware Abstraction Layer (<code>hal.dll</code>), and the boot-start drivers from disk and maps them into RAM. Working from RAM is thousands of times faster than disk — this is why the step exists at all. Before handing off, it verifies every loaded file's digital signature.</>
            : <><code>winload.efi</code> Windows yadrosi (<code>ntoskrnl.exe</code>), Apparat Abstraksiya Qatlami (<code>hal.dll</code>) va dastlabki drayverlarni diskdan o'qib, RAM ga ko'chiradi. RAM'dan ishlash diskga qaraganda minglab marta tezroq — aynan shuning uchun bu qadam mavjud. Boshqaruvni topshirishdan oldin har bir faylning raqamli imzosini tekshiradi.</>}
        </BootStep>

        <BootStep n="5" icon="layers" color="var(--c-user)"
          titleUz="Kernel ishga tushishi — ntoskrnl.exe (Direktor ish boshlagani)"
          titleEn="Kernel initialises — ntoskrnl.exe">
          {lang === "en"
            ? <>Control passes fully to the <Em>Kernel</Em>. It initialises the memory manager, object manager, I/O manager, and starts the process manager. Then it launches <code>smss.exe</code> (Session Manager) — the first real user-space process. Windows logo + spinning dots on screen = this exact moment.</>
            : <>Boshqaruv to'liq <Em>Kernelga</Em> o'tadi. U xotira menejeri, ob'ekt menejeri, I/O menejeri va jarayon menejerini ishga tushiradi. So'ng <code>smss.exe</code> (Session Manager) ni — birinchi haqiqiy user-space jarayonini — yoqadi. Ekrandagi Windows logotipi va aylanayotgan nuqtalar — aynan mana shu lahza.</>}
        </BootStep>

        <BootStep n="6" icon="lock" color="var(--c-attack)"
          titleUz="Winlogon va LSASS — Kirish eshigi va Ruxsatnoma xizmati"
          titleEn="Winlogon + LSASS — Gate and credential guard">
          {lang === "en"
            ? <><code>wininit.exe</code> starts <code>services.exe</code> (all background services) and <code>lsass.exe</code>. <Em>LSASS (Local Security Authority Subsystem Service)</Em> is the heart of Windows authentication — it validates every password, PIN, and smart card. Then <code>winlogon.exe</code> brings up the lock screen. LSASS is also the prime target for <Em>credential dumping</Em> (Mimikatz extracts hashes from its memory).</>
            : <><code>wininit.exe</code> — <code>services.exe</code> (barcha fon xizmatlar) va <code>lsass.exe</code> ni ishga tushiradi. <Em>LSASS (Local Security Authority Subsystem Service)</Em> — Windows autentifikatsiyasining yuragi: har bir parol, PIN va smart-karta aynan shu jarayon orqali tekshiriladi. So'ng <code>winlogon.exe</code> kirish ekranini ko'rsatadi. LSASS shu bilan birga <Em>credential dumping</Em> ning asosiy nishoni (Mimikatz uning xotirasidan hash'larni tortib oladi).</>}
        </BootStep>
      </div>

      {/* ── Extended detail sections ── */}
      <h3 style={subhead}>{lang === "en" ? "4.1 — Secure Boot: the cryptographic chain of trust" : "4.1 — Secure Boot: kriptografik ishonch zanjiri"}</h3>
      <P>
        {lang === "en"
          ? <><Term>Secure Boot</Term> is a UEFI feature that ensures every piece of software loaded during boot has been cryptographically signed by a trusted authority. It uses a chain of public/private key pairs stored inside UEFI firmware. There are two key databases: <Em>db</Em> (allowed signatures — Microsoft, OEM) and <Em>dbx</Em> (revoked signatures — known malware, revoked certificates). If any loaded binary's hash does not match a trusted entry in db — or matches a revoked entry in dbx — UEFI halts the boot immediately.</>
          : <><Term>Secure Boot</Term> — UEFI xususiyati bo'lib, yuklash paytida yuklanadigan har bir dasturiy ta'minot parcha ishonchli organ tomonidan kriptografik imzolanganligi ta'minlanadi. U UEFI dasturiy ta'minotiga o'rnatilgan ochiq/yopiq kalit juftliklardan foydalanadi. Ikkita asosiy ma'lumotlar bazasi mavjud: <Em>db</Em> (ruxsat etilgan imzolar — Microsoft, OEM) va <Em>dbx</Em> (bekor qilingan imzolar — ma'lum zararli dasturlar, bekor qilingan sertifikatlar). Agar yuklanadigan binary'ning xeshi db dagi ishonchli yozuvga mos kelmasa — yoki dbx dagi bekor qilingan yozuvga mos kelsa — UEFI yuklashni darhol to'xtatadi.</>}
      </P>

      <div style={{ margin: "16px 0", padding: "18px 20px", borderRadius: 12, background: "var(--bg-2)", border: "1px solid var(--border)" }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>// SECURE BOOT — chain of trust (each step verifies the next)</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {[
            { from: "UEFI Firmware (ROM)", to: "bootmgr.efi", detail: lang === "en" ? "SHA-256 hash of bootmgr.efi checked against db. Algorithm: RSA-2048 + SHA-256." : "bootmgr.efi ning SHA-256 xeshi db bilan solishtiriladi. Algoritm: RSA-2048 + SHA-256.", color: "var(--c-warn)" },
            { from: "bootmgr.efi", to: "winload.efi", detail: lang === "en" ? "Boot manager verifies the Windows loader's signature via the same certificate chain." : "Boot manager Windows loader'ning imzosini bir xil sertifikat zanjiri orqali tekshiradi.", color: "var(--accent)" },
            { from: "winload.efi", to: "ntoskrnl.exe + hal.dll", detail: lang === "en" ? "Windows loader verifies the kernel image and HAL using Microsoft's code-signing certificate." : "Windows loader yadro tasvirini va HAL ni Microsoft'ning kod imzolash sertifikati yordamida tekshiradi.", color: "var(--c-system)" },
            { from: "ntoskrnl.exe", to: "Boot drivers (*.sys)", detail: lang === "en" ? "Kernel checks WHQL / EV certificate on every driver. Unsigned → BSOD (or test-signed mode only)." : "Kernel har bir drayverda WHQL / EV sertifikatini tekshiradi. Imzosiz → BSOD (yoki faqat test-sign rejimida).", color: "var(--c-system)" },
          ].map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "8px 10px", borderRadius: 8, background: `${step.color}08`, borderLeft: `2px solid ${step.color}` }}>
              <div style={{ flexShrink: 0, paddingTop: 2 }}>
                <div className="mono" style={{ fontSize: 10, color: step.color }}>{step.from}</div>
                <div className="mono" style={{ fontSize: 9, color: "var(--text-3)" }}>→ {step.to}</div>
              </div>
              <div style={{ fontSize: 12.5, color: "var(--text-1)", lineHeight: 1.6 }}>{step.detail}</div>
            </div>
          ))}
        </div>
      </div>

      <Callout color="var(--c-attack)" icon="skull" titleUz="BlackLotus — Secure Boot'ni chetlab o'tish (2023)" titleEn="BlackLotus — bypassing Secure Boot (2023)">
        {lang === "en"
          ? <><code>BlackLotus</code> was the first publicly documented UEFI bootkit to bypass Secure Boot on <Em>fully-patched Windows 11</Em>. It exploited a 2022 vulnerability (CVE-2022-21894, "baton drop") in the Windows boot process. The technique: before Secure Boot checked the revocation list (dbx), BlackLotus patched the dbx verification code in memory, removing its own certificate from the revoked list. The signature check then passed normally. Once resident in the EFI System Partition, it loaded a kernel driver that disabled <Em>Driver Signature Enforcement (DSE)</Em> — giving attackers unrestricted ring 0 access on a "secure" system.</>
          : <><code>BlackLotus</code> — <Em>to'liq yamoqlangan Windows 11</Em> da Secure Boot'ni chetlab o'tgan birinchi ommaviy hujjatlashtirilgan UEFI bootkit. U Windows boot jarayonidagi 2022 yil zaifligini (CVE-2022-21894, "baton drop") ekspluatatsiya qildi. Texnika: Secure Boot revokatsiya ro'yxatini (dbx) tekshirishdan oldin, BlackLotus xotiradagi dbx tekshiruv kodini yamab, o'zining sertifikatini bekor qilingan ro'yxatdan olib tashladi. Imzo tekshiruvi so'ngra odatdagidek o'tdi. EFI System Partition'ga joylashgach, u <Em>Driver Signature Enforcement (DSE)</Em>'ni o'chiruvchi kernel drayveri yukladi — bu "xavfsiz" tizimda hujumchilarga cheksiz ring 0 kirishini ta'minladi.</>}
      </Callout>

      <h3 style={subhead}>{lang === "en" ? "4.2 — BCD: Boot Configuration Data" : "4.2 — BCD: Boot Configuration Data"}</h3>
      <P>
        {lang === "en"
          ? <>The <Term>BCD (Boot Configuration Data)</Term> store is a registry-like database stored in the EFI System Partition at <code>\EFI\Microsoft\Boot\BCD</code>. It is the configuration file that <code>bootmgr.efi</code> reads to know what to boot. BCD contains one or more <Em>boot entries</Em> — each entry describes an OS to boot: its loader path (<code>winload.efi</code>), partition location, timeout, debug settings, and Secure Boot flags.</>
          : <><Term>BCD (Boot Configuration Data)</Term> — EFI System Partition'da <code>\EFI\Microsoft\Boot\BCD</code> manzilida saqlangan registry-ga o'xshash ma'lumotlar bazasi. Bu <code>bootmgr.efi</code> nima yuklashni bilish uchun o'qiydigan konfiguratsiya fayli. BCD bir yoki bir nechta <Em>boot yozuvlarini</Em> o'z ichiga oladi — har bir yozuv yuklash uchun OS ni tavsiflaydi: loader yo'li (<code>winload.efi</code>), bo'lim joylashuvi, vaqt tugashi, debug sozlamalari va Secure Boot bayroqlari.</>}
      </P>
      <div style={{ margin: "14px 0", padding: "14px 16px", borderRadius: 10, background: "var(--bg-2)", border: "1px solid var(--border)", fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 1.9 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>// bcdedit.exe /enum — reading BCD from cmd (Admin required)</div>
        <div style={{ color: "var(--text-3)" }}>{lang === "en" ? "Windows Boot Manager" : "Windows Boot Manager"}</div>
        <div>{"  "}<span style={{ color: "var(--c-system)" }}>identifier</span>{"    "}<span style={{ color: "var(--accent)" }}>{"{bootmgr}"}</span></div>
        <div>{"  "}<span style={{ color: "var(--c-system)" }}>device</span>{"        "}<span style={{ color: "var(--text-1)" }}>partition=\Device\HarddiskVolume1</span></div>
        <div>{"  "}<span style={{ color: "var(--c-system)" }}>timeout</span>{"       "}<span style={{ color: "var(--text-1)" }}>30</span></div>
        <div style={{ marginTop: 8, color: "var(--text-3)" }}>{lang === "en" ? "Windows Boot Loader" : "Windows Boot Loader"}</div>
        <div>{"  "}<span style={{ color: "var(--c-system)" }}>identifier</span>{"    "}<span style={{ color: "var(--accent)" }}>{"{current}"}</span></div>
        <div>{"  "}<span style={{ color: "var(--c-system)" }}>path</span>{"          "}<span style={{ color: "var(--text-1)" }}>\Windows\System32\winload.efi</span></div>
        <div>{"  "}<span style={{ color: "var(--c-system)" }}>description</span>{"   "}<span style={{ color: "var(--text-1)" }}>Windows 11</span></div>
        <div>{"  "}<span style={{ color: "var(--c-system)" }}>secureboot</span>{"    "}<span style={{ color: "var(--c-user)" }}>Yes</span></div>
        <div>{"  "}<span style={{ color: "var(--c-system)" }}>bootdebug</span>{"     "}<span style={{ color: "var(--c-attack)" }}>No</span><span style={{ color: "var(--text-3)" }}>{"   "}{lang === "en" ? "← enable for kernel debugging" : "← kernel debug uchun yoqish"}</span></div>
      </div>

      <h3 style={subhead}>{lang === "en" ? "4.3 — Every critical process explained" : "4.3 — Har bir muhim jarayon batafsil"}</h3>
      <P>
        {lang === "en"
          ? <>After the kernel starts, it launches a chain of critical processes. Each one has a precise role — knowing them means knowing the skeleton of every Windows machine. Forensic analysts, pentesters, and malware authors all study this same list to understand what normal looks like versus what is suspicious.</>
          : <>Kernel ishga tushgach, u muhim jarayonlar zanjirini ishga tushiradi. Har birining aniq roli bor — ularni bilish har bir Windows mashinasining skeletini bilishni anglatadi. Kriminalistlar, pentest mutaxassislari va zararli dastur muallif hammalari normal va shubhali ko'rinishni tushunish uchun bir xil ro'yxatni o'rganadi.</>}
      </P>

      {/* ── Session 0 processes ── */}
      <div className="eyebrow" style={{ margin: "20px 0 10px" }}>// SESSION 0 — {lang === "en" ? "SYSTEM PROCESSES (no UI, isolated)" : "TIZIM JARAYONLARI (UI yo'q, izolyatsiyalangan)"}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          {
            exe: "smss.exe",
            title: lang === "en" ? "Session Manager Subsystem" : "Sessiya Menejeri Quyi Tizimi",
            color: "var(--c-system)",
            props: lang === "en" ? "PID: ~316–450 · Parent: ntoskrnl · User: SYSTEM · Session 0" : "PID: ~316–450 · Ota: ntoskrnl · Foydalanuvchi: SYSTEM · Sessiya 0",
            path: "C:\\Windows\\System32\\smss.exe",
            body: lang === "en"
              ? <>The very first user-space process, spawned directly by the kernel (ntoskrnl.exe). SMSS is responsible for the entire session infrastructure. Its startup tasks: initialise the pagefile (<code>pagefile.sys</code>), load the known DLLs into shared memory (<code>HKLM\SYSTEM\KnownDLLs</code>), and then fork itself into two separate instances — one instance becomes <strong>Session 0</strong> (spawns wininit.exe for system services) and another becomes <strong>Session 1</strong> (spawns winlogon.exe for the first user's login). For each additional user (RDP sessions), SMSS forks again to create Sessions 2, 3, etc. <br /><br /><em>Forensic red flag:</em> if you see smss.exe running with a parent other than ntoskrnl (PID 4), or multiple smss.exe instances when no RDP sessions are active, it is suspicious — malware sometimes uses the name "smss.exe" as camouflage.</>
              : <>Kernelin (ntoskrnl.exe) to'g'ridan-to'g'ri yaratgan birinchi user-space jarayon. SMSS butun sessiya infratuzilmasi uchun mas'ul. Uning ishga tushiruv vazifalari: pagefile'ni (<code>pagefile.sys</code>) ishga tushirish, ma'lum DLL'larni umumiy xotiraga yuklash (<code>HKLM\SYSTEM\KnownDLLs</code>), so'ngra o'zini ikki alohida nusxaga ajratish — bir nusxa <strong>Sessiya 0</strong> bo'ladi (tizim xizmatlari uchun wininit.exe ni yaratadi) va boshqasi <strong>Sessiya 1</strong> bo'ladi (birinchi foydalanuvchi kirishi uchun winlogon.exe ni yaratadi). Har bir qo'shimcha foydalanuvchi (RDP sessiyalari) uchun SMSS yana ajralib, Sessiya 2, 3 va h.k. yaratadi.<br /><br /><em>Kriminalistik qizil bayroq:</em> agar smss.exe ni ntoskrnl (PID 4) dan boshqa ota bilan ishlayotgan yoki faol RDP sessiyalari bo'lmaganda bir nechta smss.exe nusxasini ko'rsangiz — bu shubhali: zararli dasturlar ba'zan "smss.exe" nomidan niqob sifatida foydalanadi.</>,
          },
          {
            exe: "wininit.exe",
            title: lang === "en" ? "Windows Initialization (Session 0 init)" : "Windows Ishga Tushirish (Sessiya 0 initsializatsiyasi)",
            color: "var(--c-system)",
            props: lang === "en" ? "PID: ~500–600 · Parent: smss.exe · User: SYSTEM · Session 0" : "PID: ~500–600 · Ota: smss.exe · Foydalanuvchi: SYSTEM · Sessiya 0",
            path: "C:\\Windows\\System32\\wininit.exe",
            body: lang === "en"
              ? <>wininit.exe is the Session 0 initialiser — its sole job is to start the three core system services that everything else depends on: <strong>services.exe</strong> (the Service Control Manager), <strong>lsass.exe</strong> (authentication), and <strong>lsm.exe</strong> (Local Session Manager, which tracks session state). After spawning these three, wininit.exe stays alive doing nothing — it is the parent that keeps them anchored to Session 0. <br /><br /><em>Forensic note:</em> there is always exactly one wininit.exe on a running system. Its parent is smss.exe, and its three children are services.exe, lsass.exe, and lsm.exe. Any deviation from this parent-child pattern indicates tampering.</>
              : <>wininit.exe — Sessiya 0 initsializatori: uning yagona vazifasi boshqa hamma narsa bog'liq bo'lgan uchta asosiy tizim xizmatini ishga tushirish: <strong>services.exe</strong> (Xizmat Boshqaruv Menejeri), <strong>lsass.exe</strong> (autentifikatsiya) va <strong>lsm.exe</strong> (Mahalliy Sessiya Menejeri, sessiya holatini kuzatadi). Bu uchtalikni yaratgandan so'ng, wininit.exe ularni Sessiya 0 ga bog'lab turuvchi ota sifatida hayotda qoladi.<br /><br /><em>Kriminalistik eslatma:</em> ishlaydigan tizimda har doim aynan bitta wininit.exe bo'ladi. Uning otasi smss.exe, uchta farzandi esa services.exe, lsass.exe va lsm.exe. Ota-farzand naqshidan har qanday og'ish — buzilishni ko'rsatadi.</>,
          },
          {
            exe: "services.exe",
            title: lang === "en" ? "Service Control Manager (SCM)" : "Xizmat Boshqaruv Menejeri (SCM)",
            color: "var(--c-system)",
            props: lang === "en" ? "PID: ~650–800 · Parent: wininit.exe · User: SYSTEM · Session 0" : "PID: ~650–800 · Ota: wininit.exe · Foydalanuvchi: SYSTEM · Sessiya 0",
            path: "C:\\Windows\\System32\\services.exe",
            body: lang === "en"
              ? <>services.exe is the Service Control Manager — it owns the lifecycle of every Windows service. On startup it reads <code>HKLM\SYSTEM\CurrentControlSet\Services</code> in the registry and starts every service with <code>Start=2</code> (auto-start). It manages three types of services: <strong>Win32 services</strong> (hosted in svchost.exe as DLLs), <strong>standalone EXE services</strong> (processes in their own right), and <strong>kernel-mode drivers</strong> (loaded via I/O Manager). services.exe exposes the SCM API — used by tools like <code>sc.exe</code>, <code>PowerShell New-Service</code>, and Task Manager. <br /><br /><em>Security angle:</em> attackers create persistence by registering a new service via <code>sc create</code> or directly writing to the Services registry key. services.exe is also the parent of all svchost.exe instances — if you see svchost.exe with a parent other than services.exe, it is immediately suspicious.</>
              : <>services.exe — Xizmat Boshqaruv Menejeri: u har bir Windows xizmatining hayot tsikliga egalik qiladi. Ishga tushirishda <code>HKLM\SYSTEM\CurrentControlSet\Services</code> registrini o'qiydi va <code>Start=2</code> (avtomatik ishga tushirish) bilan har bir xizmatni ishga tushiradi. U uch turdagi xizmatlarni boshqaradi: <strong>Win32 xizmatlar</strong> (svchost.exe da DLL sifatida joylashgan), <strong>mustaqil EXE xizmatlar</strong> (o'z jarayonlari) va <strong>kernel-mode drayverlar</strong> (I/O Manager orqali yuklangan). services.exe SCM API ni taqdim etadi — <code>sc.exe</code>, <code>PowerShell New-Service</code> va Vazifa Menejeri kabi vositalar tomonidan ishlatiladi.<br /><br /><em>Xavfsizlik tomoni:</em> hujumchilar <code>sc create</code> yoki Services registr kalitiga to'g'ridan-to'g'ri yozish orqali yangi xizmat ro'yxatga olib, barqarorlikni ta'minlaydi. services.exe barcha svchost.exe nusxalarining ham otasi — agar svchost.exe ni services.exe dan boshqa ota bilan ko'rsangiz, bu darhol shubhali.</>,
          },
          {
            exe: "svchost.exe",
            title: lang === "en" ? "Service Host — generic DLL service container" : "Xizmat Mezbon — umumiy DLL xizmat konteyneri",
            color: "var(--c-system)",
            props: lang === "en" ? "PID: many · Parent: services.exe · User: varies · Session 0" : "PID: ko'p · Ota: services.exe · Foydalanuvchi: turli xil · Sessiya 0",
            path: "C:\\Windows\\System32\\svchost.exe -k <ServiceGroupName>",
            body: lang === "en"
              ? <>svchost.exe (Service Host) is a generic container process that hosts Windows services implemented as DLLs. Instead of each service running as its own EXE, many are bundled into DLLs and loaded inside a shared svchost.exe for efficiency. The <code>-k</code> flag determines which service group runs in that instance: <code>-k netsvcs</code> (network services), <code>-k LocalService</code> (limited-privilege services), <code>-k DcomLaunch</code> (COM server activator). A healthy Windows 11 system has 15–20+ svchost.exe instances simultaneously. <br /><br /><strong>Important hosted services:</strong> Windows Update (<code>wuauserv</code>), DHCP Client (<code>Dhcp</code>), DNS Client (<code>Dnscache</code>), Print Spooler (<code>Spooler</code>), Task Scheduler (<code>Schedule</code>), Windows Defender (<code>WdNisSvc</code>), Remote Desktop (<code>TermService</code>). <br /><br /><em>Attacker abuse:</em> "svchost process injection" — malware injects shellcode into a legitimate svchost.exe to hide inside a trusted process. Detection: check parent (must be services.exe), command line (must have -k flag), and loaded modules for unexpected DLLs.</>
              : <>svchost.exe — DLL sifatida amalga oshirilgan Windows xizmatlarini joylashtiruvchi umumiy konteyner jarayon. Har bir xizmat o'z EXE'si sifatida ishlash o'rniga, ko'plari DLL sifatida to'plangan va samaradorlik uchun umumiy svchost.exe ichida yuklanadi. <code>-k</code> bayrog'i o'sha nusxada qaysi xizmat guruhi ishlashini belgilaydi: <code>-k netsvcs</code> (tarmoq xizmatlari), <code>-k LocalService</code> (cheklangan imtiyozli xizmatlar), <code>-k DcomLaunch</code> (COM server aktivatori). Sog'lom Windows 11 tizimida 15–20 dan ortiq svchost.exe nusxasi bir vaqtda ishlaydi.<br /><br /><strong>Muhim joylashtirilgan xizmatlar:</strong> Windows Update (<code>wuauserv</code>), DHCP Mijozi (<code>Dhcp</code>), DNS Mijozi (<code>Dnscache</code>), Print Spooler (<code>Spooler</code>), Vazifa Rejalashtiruvchi (<code>Schedule</code>), Windows Defender (<code>WdNisSvc</code>), Remote Desktop (<code>TermService</code>).<br /><br /><em>Hujumchi suiiste'moli:</em> "svchost jarayon kiritish" — zararli dastur ishonchli jarayon ichiga yashirinish uchun qonuniy svchost.exe ga shellcode kiritadi. Aniqlash: ota (services.exe bo'lishi kerak), buyruq satrini (−k bayroq bo'lishi kerak) va kutilmagan DLL lar uchun yuklangan modullarni tekshiring.</>,
          },
        ].map((proc, i) => (
          <div key={i} style={{ borderRadius: 12, border: `1px solid ${proc.color}30`, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", background: `${proc.color}10`, borderBottom: `1px solid ${proc.color}20` }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 15, fontWeight: 700, color: proc.color }}>{proc.exe}</div>
              <div style={{ fontSize: 13, color: "var(--text-2)", flex: 1 }}>{proc.title}</div>
            </div>
            <div style={{ padding: "12px 16px", background: `${proc.color}04` }}>
              <div className="mono" style={{ fontSize: 10.5, color: "var(--text-3)", marginBottom: 4 }}>{proc.props}</div>
              <div className="mono" style={{ fontSize: 10.5, color: proc.color, marginBottom: 10 }}>{proc.path}</div>
              <div style={{ fontSize: 13, lineHeight: 1.75, color: "var(--text-1)" }}>{proc.body}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Session 1+ processes ── */}
      <div className="eyebrow" style={{ margin: "24px 0 10px" }}>// SESSION 1+ — {lang === "en" ? "USER PROCESSES (interactive, has desktop)" : "FOYDALANUVCHI JARAYONLARI (interaktiv, ish stoli bor)"}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          {
            exe: "winlogon.exe",
            title: lang === "en" ? "Windows Logon Application" : "Windows Kirish Ilovasi",
            color: "var(--c-user)",
            props: lang === "en" ? "PID: ~700–900 · Parent: smss.exe · User: SYSTEM · Session 1+" : "PID: ~700–900 · Ota: smss.exe · Foydalanuvchi: SYSTEM · Sessiya 1+",
            path: "C:\\Windows\\System32\\winlogon.exe",
            body: lang === "en"
              ? <>winlogon.exe manages the interactive logon experience. It handles the <strong>Secure Attention Sequence (SAS)</strong> — the Ctrl+Alt+Del keystroke — which is handled at hardware level and cannot be faked by any user-mode application (this is why Ctrl+Alt+Del is used as a "trusted path" before entering passwords). winlogon loads the <strong>credential providers</strong> (the login UI — password box, PIN, Windows Hello face recognition) via <code>LogonUI.exe</code>. After successful authentication by lsass.exe, winlogon loads the user's profile (<code>NTUSER.DAT</code>) and registry hive, then launches <code>userinit.exe</code> which in turn starts <code>explorer.exe</code>. <br /><br /><em>Security note:</em> the "Winlogon Notification Packages" registry key (<code>HKLM\Software\Microsoft\Windows NT\CurrentVersion\Winlogon</code>) is a classic persistence mechanism — malware registers a DLL here to be loaded by winlogon on every login. Microsoft restricts this in modern Windows, but it remains a checked location during incident response.</>
              : <>winlogon.exe interaktiv kirish tajribasini boshqaradi. U <strong>Xavfsiz Diqqat Ketma-ketligi (SAS)</strong> — Ctrl+Alt+Del tugmalar birikmasini — boshqaradi, bu hardware darajasida ko'rib chiqiladi va hech qanday user-mode ilova tomonidan soxtalashtirib bo'lmaydi (shuning uchun Ctrl+Alt+Del parollarni kiritishdan oldin "ishonchli yo'l" sifatida ishlatiladi). winlogon <strong>hisob ma'lumotlari provayderlarini</strong> (kirish UI — parol qutisi, PIN, Windows Hello yuz tanish) <code>LogonUI.exe</code> orqali yuklaydi. lsass.exe tomonidan muvaffaqiyatli autentifikatsiyadan so'ng, winlogon foydalanuvchining profilini (<code>NTUSER.DAT</code>) va registr uyasini yuklaydi, so'ngra o'z navbatida <code>explorer.exe</code> ni ishga tushiradigan <code>userinit.exe</code> ni ishga tushiradi.<br /><br /><em>Xavfsizlik eslatmasi:</em> "Winlogon Notification Packages" registr kaliti (<code>HKLM\Software\Microsoft\Windows NT\CurrentVersion\Winlogon</code>) — klassik barqarorlik mexanizmi: zararli dastur har bir kirishda winlogon tomonidan yuklanadigan DLL ni shu yerga ro'yxatdan o'tkazadi. Microsoft buni zamonaviy Windows da cheklaydi, lekin u hodisalarga munosabat paytida tekshiriladigan joy bo'lib qoladi.</>,
          },
          {
            exe: "explorer.exe",
            title: lang === "en" ? "Windows Shell / Desktop" : "Windows Shell / Ish Stoli",
            color: "var(--c-user)",
            props: lang === "en" ? "PID: varies · Parent: userinit.exe → orphaned · User: current user · Session 1+" : "PID: turli xil · Ota: userinit.exe → etim · Foydalanuvchi: joriy foydalanuvchi · Sessiya 1+",
            path: "C:\\Windows\\explorer.exe",
            body: lang === "en"
              ? <>explorer.exe is the Windows shell — it renders the desktop, taskbar, Start menu, system tray, and all File Explorer windows. It is the first process that runs under the <strong>user's own security token</strong> (not SYSTEM), meaning it has exactly the permissions the logged-in user has — no more. explorer.exe becomes the parent of most user-launched processes: when you double-click an EXE, explorer.exe spawns it. <br /><br /><em>Technical detail:</em> when userinit.exe finishes its work (running login scripts, mounting network drives), it exits — leaving explorer.exe as an orphan. That's why explorer.exe's parent PID in Task Manager points to a non-existent process. This is normal behaviour, not an anomaly. <br /><br /><em>Security angle:</em> "explorer process injection" is common malware technique. Also, "explorer.exe replacement" — replacing it with a trojan of the same name. Detection: verify the file path is exactly <code>C:\Windows\explorer.exe</code> (not <code>C:\Windows\System32\</code> or any other directory), check file hash, and verify digital signature.</>
              : <>explorer.exe — Windows shell: u ish stoli, vazifalar paneli, Start menyusi, tizim tepsi va barcha Fayl Explorer oynalarini ko'rsatadi. Bu <strong>foydalanuvchining o'z xavfsizlik tokeni</strong> ostida ishlaydigan birinchi jarayon (SYSTEM emas), ya'ni kirgan foydalanuvchi ega bo'lgan imtiyozlarga ega — na ko'proq, na kamroq. explorer.exe ko'plab foydalanuvchi tomonidan ishga tushirilgan jarayonlarning otasiga aylanadi: EXE ni ikki marta bosganingizda, explorer.exe uni yaratadi.<br /><br /><em>Texnik tafsilot:</em> userinit.exe o'z ishini (kirish skriptlarini ishga tushirish, tarmoq disklarini o'rnatish) tugatgach, chiqib ketadi — explorer.exe ni etim holda qoldiradi. Shuning uchun Vazifa Menejeridagi explorer.exe ning ota PID'i mavjud bo'lmagan jarayonga ishora qiladi. Bu normal xatti-harakat, anomaliya emas.<br /><br /><em>Xavfsizlik tomoni:</em> "explorer jarayon kiritish" — keng tarqalgan zararli dastur texnikasi. Shuningdek, "explorer.exe almashtirish" — uni xuddi shu nomdagi troyan bilan almashtirish. Aniqlash: fayl yo'li aynan <code>C:\Windows\explorer.exe</code> ekanligini tekshiring (<code>C:\Windows\System32\</code> yoki boshqa katalog emas), fayl xeshini va raqamli imzoni tekshiring.</>,
          },
        ].map((proc, i) => (
          <div key={i} style={{ borderRadius: 12, border: `1px solid ${proc.color}30`, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", background: `${proc.color}10`, borderBottom: `1px solid ${proc.color}20` }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 15, fontWeight: 700, color: proc.color }}>{proc.exe}</div>
              <div style={{ fontSize: 13, color: "var(--text-2)", flex: 1 }}>{proc.title}</div>
            </div>
            <div style={{ padding: "12px 16px", background: `${proc.color}04` }}>
              <div className="mono" style={{ fontSize: 10.5, color: "var(--text-3)", marginBottom: 4 }}>{proc.props}</div>
              <div className="mono" style={{ fontSize: 10.5, color: proc.color, marginBottom: 10 }}>{proc.path}</div>
              <div style={{ fontSize: 13, lineHeight: 1.75, color: "var(--text-1)" }}>{proc.body}</div>
            </div>
          </div>
        ))}
      </div>

      <h3 style={subhead}>{lang === "en" ? "4.4 — LSASS: full deep-dive" : "4.4 — LSASS: to'liq chuqur tahlil"}</h3>
      <P>
        {lang === "en"
          ? <><Term>LSASS (Local Security Authority Subsystem Service)</Term> is the most security-critical process on any Windows machine. It is the sole arbiter of who is authenticated and what they are allowed to do. Every logon, token issuance, and password change flows through it. And for exactly that reason, it is the single most targeted process by attackers in post-exploitation.</>
          : <><Term>LSASS (Local Security Authority Subsystem Service)</Term> — har qanday Windows mashinasidagi xavfsizlik jihatidan eng muhim jarayon. U kim autentifikatsiya qilinishi va nima qilishga ruxsat berilishi haqida yagona hakam. Har bir kirish, token berish va parol o'zgartirish undan o'tadi. Va aynan shu sababdan, u post-ekspluatatsiyada hujumchilar tomonidan eng ko'p nishonlanadigan yagona jarayon.</>}
      </P>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
        <div style={{ padding: "14px 16px", borderRadius: 10, background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.22)" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "var(--c-system)", marginBottom: 10 }}>
            {lang === "en" ? "What LSASS does:" : "LSASS nima qiladi:"}
          </div>
          {(lang === "en" ? [
            "Validates every logon: local password, PIN, Windows Hello, smart card, Kerberos ticket, NTLM challenge-response",
            "Issues access tokens: after auth, creates the token that carries SID, group memberships, and privileges",
            "Maintains LSA secrets: stores service account passwords, cached domain credentials in HKLM\\SECURITY (readable only as SYSTEM)",
            "Manages security packages: loads MSV1_0 (NTLM), Kerberos, NTLM, TSpkg, WDigest, LiveSSP as DLLs",
            "Caches domain credentials: stores salted+hashed credential for offline logon (HKLM\\SECURITY\\Cache)",
            "Handles password changes: coordinates with domain controllers on domain password policy",
            "Issues Kerberos tickets (TGT/TGS) received from the KDC and caches them for SSO",
          ] : [
            "Har bir kirishni tekshiradi: mahalliy parol, PIN, Windows Hello, smart karta, Kerberos chiptas, NTLM muammoga javob",
            "Kirish tokenlarini beradi: autentifikatsiyadan so'ng SID, guruh a'zoliklari va imtiyozlarni olib yuruvchi tokenni yaratadi",
            "LSA sirlarini saqlaydi: xizmat hisobi parollarini, HKLM\\SECURITY da keshli domen hisob ma'lumotlarini saqlaydi (faqat SYSTEM sifatida o'qiladi)",
            "Xavfsizlik paketlarini boshqaradi: MSV1_0 (NTLM), Kerberos, NTLM, TSpkg, WDigest, LiveSSP ni DLL sifatida yuklaydi",
            "Domen hisob ma'lumotlarini keshlaydi: oflayn kirish uchun tuzlangan+xeshlangan hisob ma'lumotlarini saqlaydi (HKLM\\SECURITY\\Cache)",
            "Parol o'zgarishlarini boshqaradi: domen parol siyosatida domen kontrollerlari bilan muvofiqlashadi",
            "KDC dan olingan Kerberos chiptalari (TGT/TGS) ni beradi va SSO uchun keshlaydi",
          ]).map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5, fontSize: 12.5, color: "var(--text-1)", lineHeight: 1.5 }}>
              <span style={{ color: "var(--c-system)", flexShrink: 0, marginTop: 1 }}>▸</span>{item}
            </div>
          ))}
        </div>
        <div style={{ padding: "14px 16px", borderRadius: 10, background: "rgba(255,58,94,0.06)", border: "1px solid rgba(255,58,94,0.28)" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "var(--c-attack)", marginBottom: 10 }}>
            {lang === "en" ? "What LSASS memory contains (= why attackers want it):" : "LSASS xotirasi nima o'z ichiga oladi (= nima uchun hujumchilar xohlaydi):"}
          </div>
          {(lang === "en" ? [
            "NTLM hashes — used for Pass-the-Hash attacks without knowing the cleartext password",
            "Kerberos TGT and TGS tickets — used for Pass-the-Ticket and Golden/Silver Ticket attacks",
            "Cleartext passwords — if WDigest is enabled (default ON on pre-2012 systems) or via forced re-enable on modern systems",
            "DPAPI master keys — decrypt all data encrypted by the Data Protection API (browser passwords, WiFi keys, Credential Manager)",
            "Cached domain credentials — offline copies of the last 10 domain logons (configurable), useful when the DC is unreachable",
          ] : [
            "NTLM xeshlari — ochiq matn parolini bilmasdan Pass-the-Hash hujumlari uchun ishlatiladi",
            "Kerberos TGT va TGS chiptalari — Pass-the-Ticket va Golden/Silver Ticket hujumlari uchun ishlatiladi",
            "Ochiq matn parollar — agar WDigest yoqilgan bo'lsa (2012 gacha tizimlarda sukut bo'yicha YOQIQ) yoki zamonaviy tizimlarda majburan qayta yoqilsa",
            "DPAPI master kalitlari — Data Protection API tomonidan shifrlangan barcha ma'lumotlarni (brauzer parollari, WiFi kalitlari, Hisob Ma'lumotlari Menejeri) shifrini ochadi",
            "Keshli domen hisob ma'lumotlari — so'nggi 10 ta domen kirishining oflayn nusxalari (sozlanadi), DC uchishib qolganida foydali",
          ]).map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5, fontSize: 12.5, color: "var(--text-1)", lineHeight: 1.5 }}>
              <span style={{ color: "var(--c-attack)", flexShrink: 0, marginTop: 1 }}>✗</span>{item}
            </div>
          ))}
        </div>
      </div>

      <h3 style={subhead} id="lsass-attack">{lang === "en" ? "4.4.1 — How Mimikatz dumps LSASS" : "4.4.1 — Mimikatz LSASS ni qanday dump qiladi"}</h3>
      <P>
        {lang === "en"
          ? <><Em>Mimikatz</Em> (written by Benjamin Delpy, 2011) is the most famous credential harvesting tool in existence. It reads credentials directly from the LSASS process memory. The technique works in three steps:</>
          : <><Em>Mimikatz</Em> (Benjamin Delpy tomonidan yozilgan, 2011) — mavjud eng mashhur hisob ma'lumotlarini yig'ish vositasi. U hisob ma'lumotlarini to'g'ridan-to'g'ri LSASS jarayon xotirasidan o'qiydi. Texnika uch bosqichda ishlaydi:</>}
      </P>

      <div style={{ margin: "14px 0", padding: "16px 20px", borderRadius: 12, background: "var(--bg-2)", border: "1px solid var(--border)", fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 1.9 }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>// MIMIKATZ — step-by-step credential dump</div>
        <div>
          <div style={{ color: "var(--text-3)" }}>{lang === "en" ? "Step 1: request SeDebugPrivilege (needed to open LSASS)" : "1-qadam: SeDebugPrivilege so'rash (LSASS ni ochish uchun kerak)"}</div>
          <div style={{ color: "var(--accent)" }}>mimikatz # <span style={{ color: "var(--text-1)" }}>privilege::debug</span></div>
          <div style={{ color: "var(--c-user)", fontSize: 11 }}>{"  → "}Privilege '20' OK  {lang === "en" ? "(enables reading any process memory as admin)" : "(admin sifatida har qanday jarayon xotirasini o'qish imkonini beradi)"}</div>
        </div>
        <div style={{ marginTop: 10 }}>
          <div style={{ color: "var(--text-3)" }}>{lang === "en" ? "Step 2: open LSASS with OpenProcess(PROCESS_VM_READ), read memory regions where lsasrv.dll stores credential structures" : "2-qadam: OpenProcess(PROCESS_VM_READ) bilan LSASS ni ochish, lsasrv.dll hisob ma'lumotlari tuzilmalarini saqlaydigan xotira mintaqalarini o'qish"}</div>
          <div style={{ color: "var(--accent)" }}>mimikatz # <span style={{ color: "var(--text-1)" }}>sekurlsa::logonpasswords</span></div>
        </div>
        <div style={{ marginTop: 10 }}>
          <div style={{ color: "var(--text-3)" }}>{lang === "en" ? "Step 3: output — decrypted credentials from memory" : "3-qadam: natija — xotiradan shifrlangan hisob ma'lumotlari"}</div>
          <div style={{ color: "var(--c-attack)" }}>Authentication Id : 0 ; 123456</div>
          <div style={{ color: "var(--text-1)" }}>{"  "}Username : Administrator</div>
          <div style={{ color: "var(--text-1)" }}>{"  "}Domain   : CORP</div>
          <div style={{ color: "var(--c-user)" }}>{"  "}NTLM     : <span style={{ color: "var(--c-attack)" }}>aad3b435b51404eeaad3b435b51404ee</span>  <span style={{ color: "var(--text-3)", fontSize: 10 }}>{lang === "en" ? "← usable for PtH without password" : "← parolsiz PtH uchun ishlatish mumkin"}</span></div>
          <div style={{ color: "var(--c-user)" }}>{"  "}Password : <span style={{ color: "var(--c-attack)" }}>P@ssw0rd123</span>  <span style={{ color: "var(--text-3)", fontSize: 10 }}>{lang === "en" ? "← cleartext if WDigest enabled" : "← WDigest yoqilgan bo'lsa ochiq matn"}</span></div>
        </div>
      </div>

      <h3 style={subhead}>{lang === "en" ? "4.4.2 — LSASS defences" : "4.4.2 — LSASS himoyasi"}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
        {[
          {
            name: "PPL — Protected Process Light",
            color: "var(--c-system)",
            bodyUz: <>LSASS ni imzolangan himoyalangan jarayon sifatida belgilaydi. PPL bilan LSASS ga <code>OpenProcess(PROCESS_VM_READ)</code> chaqiruvi <code>ERROR_ACCESS_DENIED</code> bilan muvaffaqiyatsiz tugaydi — administrator sifatida ham. PPL ni yoqish uchun: <code>HKLM\SYSTEM\CurrentControlSet\Control\Lsa → RunAsPPL = 1</code>. Muhim: PPL ni chetlab o'tishning ma'lum usullari mavjud (masalan, zaif drayver orqali kernel kodini kiritish).</>,
            bodyEn: <>Marks LSASS as a signed, protected process. With PPL enabled, <code>OpenProcess(PROCESS_VM_READ)</code> to LSASS fails with <code>ERROR_ACCESS_DENIED</code> — even as administrator. To enable: <code>HKLM\SYSTEM\CurrentControlSet\Control\Lsa → RunAsPPL = 1</code>. Important: known bypass techniques exist (e.g. injecting kernel code via a vulnerable driver).</>,
          },
          {
            name: "Credential Guard (VBS Enclave)",
            color: "#b48cff",
            bodyUz: <>Hisob ma'lumotlarini (NTLM hash'lari, Kerberos chiptalari) <em>Virtuallashtirish Asosidagi Xavfsizlik (VBS)</em> enklavisiga — Hyper-V ga asoslangan izolyatsiyalangan muhitga ko'chiradi. Hatto to'liq buzilgan kernel (ring 0) ham ushbu enklavdagi hisob ma'lumotlariga kira olmaydi. Bunga erishish uchun maxsus CPU qo'llab-quvvatlash talab etiladi (VT-x/AMD-V + SLAT). Windows 11 da Enterprise uchun sukut bo'yicha yoqilgan.</>,
            bodyEn: <>Moves credentials (NTLM hashes, Kerberos tickets) into a <em>Virtualisation-Based Security (VBS)</em> enclave — a Hyper-V-based isolated environment. Even a fully-compromised kernel (ring 0) cannot access the credentials inside this enclave. Requires specific CPU support (VT-x/AMD-V + SLAT). Enabled by default on Windows 11 for Enterprise.</>,
          },
          {
            name: "WDigest off (default post-KB2871997)",
            color: "var(--c-warn)",
            bodyUz: <>WDigest — IIS HTTP Digest autentifikatsiyasi uchun mo'ljallangan eski protokol, lekin u hisob ma'lumotlarini xotirada ochiq matn sifatida saqlashni talab qiladi. Windows 8.1/Server 2012 R2 dan boshlab, Microsoft sukut bo'yicha WDigest ni o'chirdi. Eski tizimlarda: <code>HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\WDigest → UseLogonCredential = 0</code>. Hujumchilar ba'zan bu registr qiymatini 1 ga o'zgartiradi va ochiq matn parollarini dump qilishdan oldin foydalanuvchini qayta kirish uchun majbur qiladi.</>,
            bodyEn: <>WDigest is a legacy protocol designed for IIS HTTP Digest auth, but it requires storing credentials in cleartext in memory. From Windows 8.1/Server 2012 R2, Microsoft disabled WDigest by default. On older systems: <code>HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\WDigest → UseLogonCredential = 0</code>. Attackers sometimes change this registry value to 1 and force the user to re-login before dumping cleartext passwords.</>,
          },
          {
            name: "Detection — Sysmon Event ID 10",
            color: "var(--c-attack)",
            bodyUz: <>Sysmon (System Monitor) Event ID 10 — <em>ProcessAccess</em> — LSASS ga <code>PROCESS_VM_READ</code> yoki <code>PROCESS_VM_OPERATION</code> huquqlari bilan <code>OpenProcess</code> chaqiruvi amalga oshirilganda qayd etiladi. Bu Mimikatz va uning klonlarini aniqlashning standart usuli. SIEM korrelyatsiya qoidasi: "TargetImage = lsass.exe AND GrantedAccess ∈ {0x1010, 0x1410, 0x143A} → HIGH PRIORITY ALERT".</>,
            bodyEn: <>Sysmon (System Monitor) Event ID 10 — <em>ProcessAccess</em> — fires whenever <code>OpenProcess</code> is called on LSASS with <code>PROCESS_VM_READ</code> or <code>PROCESS_VM_OPERATION</code> rights. This is the standard detection for Mimikatz and its clones. SIEM correlation rule: "TargetImage = lsass.exe AND GrantedAccess ∈ {0x1010, 0x1410, 0x143A} → HIGH PRIORITY ALERT".</>,
          },
        ].map((def, i) => (
          <div key={i} style={{ padding: "12px 16px", borderRadius: 10, background: `${def.color}08`, border: `1px solid ${def.color}28`, borderLeft: `3px solid ${def.color}` }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 13.5, fontWeight: 700, color: def.color, marginBottom: 6 }}>{def.name}</div>
            <div style={{ fontSize: 12.5, color: "var(--text-1)", lineHeight: 1.7 }}>{lang === "en" ? def.bodyEn : def.bodyUz}</div>
          </div>
        ))}
      </div>

      <h3 style={subhead}>{lang === "en" ? "4.5 — PatchGuard and Driver Signature Enforcement" : "4.5 — PatchGuard va Drayver Imzo Tekshiruvi"}</h3>
      <P>
        {lang === "en"
          ? <><Term>PatchGuard (Kernel Patch Protection)</Term> is a Windows mechanism, introduced in Vista x64, that prevents unauthorised modification of critical kernel structures. It periodically (at unpredictable intervals) takes checksums of: the SSDT (System Service Descriptor Table), the IDT (Interrupt Descriptor Table), GDT/LDT, kernel code pages, and key data structures like <code>EPROCESS</code>. If a checksum mismatch is found — meaning something modified these structures without authorisation — Windows immediately executes <code>KeBugCheckEx(0x109)</code> — a BSOD with stop code <Em>CRITICAL_STRUCTURE_CORRUPTION</Em>. PatchGuard exists specifically to prevent rootkits from hooking the SSDT (the classic way to intercept all syscalls) and to prevent kernel code injection.</>
          : <><Term>PatchGuard (Kernel Patch Protection)</Term> — Vista x64 da kiritilgan, asosiy kernel tuzilmalarining ruxsatsiz o'zgartirilishini oldini oladigan Windows mexanizmi. U davriy ravishda (oldindan aytib bo'lmaydigan intervallarda) quyidagilarning kontrol yig'indisini oladi: SSDT (System Service Descriptor Table), IDT (Interrupt Descriptor Table), GDT/LDT, kernel kod sahifalari va <code>EPROCESS</code> kabi asosiy ma'lumotlar tuzilmalari. Agar kontrol yig'indi nomuvofiqlik topilsa — ya'ni ruxsatsiz biror narsa bu tuzilmalarni o'zgartirgan bo'lsa — Windows darhol <code>KeBugCheckEx(0x109)</code> ni bajaradi — <Em>CRITICAL_STRUCTURE_CORRUPTION</Em> to'xtash kodi bilan BSOD. PatchGuard rootkit'larning SSDT ga hook qo'yishini (barcha syscall'larni ushlab olishning klassik usuli) va kernel kod kiritishini oldini olish uchun mavjud.</>}
      </P>

      <Callout color="var(--c-warn)" icon="warning" titleUz="Xavfsizlik xulosa — boot zanjiri hujum yuzasi" titleEn="Security summary — the boot chain as attack surface">
        {lang === "en"
          ? <>Every stage of the Windows boot process is also an attack surface. <strong>Pre-UEFI:</strong> physical attackers can overwrite the MBR/EFI partition. <strong>UEFI/Secure Boot:</strong> firmware vulnerabilities (like CVE-2022-21894) allow bypassing signature checks in memory. <strong>BCD:</strong> misconfigured bootdebug or testsigning flags disable kernel protections entirely. <strong>Driver loading:</strong> BYOVD (Bring Your Own Vulnerable Driver) loads a legitimately signed but exploitable driver to disable DSE and load unsigned kernel code. <strong>LSASS at logon:</strong> credential dumping steals hashes for lateral movement. Understanding the full boot sequence is non-negotiable for both defenders and attackers.</>
          : <>Windows boot jarayonining har bir bosqichi hujum yuzasi hamdir. <strong>UEFI'dan oldin:</strong> jismoniy hujumchilar MBR/EFI bo'limini qayta yozishi mumkin. <strong>UEFI/Secure Boot:</strong> dasturiy ta'minot zaifliklari (CVE-2022-21894 kabi) xotiradagi imzo tekshiruvlarini chetlab o'tish imkonini beradi. <strong>BCD:</strong> noto'g'ri sozlangan bootdebug yoki testsigning bayroqlari kernel himoyalarini butunlay o'chiradi. <strong>Drayver yuklash:</strong> BYOVD (Bring Your Own Vulnerable Driver) DSE ni o'chirish va imzosiz kernel kodni yuklash uchun qonuniy imzolangan, lekin ekspluatatsiya qilinadigan drayverni yuklaydi. <strong>Kirishda LSASS:</strong> hisob ma'lumotlarini dump qilish lateral harakat uchun xeshlarni o'g'irlaydi. To'liq boot ketma-ketligini tushunish mudofaachilar ham, hujumchilar uchun ham majburiy.</>}
      </Callout>
    </section>
  );
}


// ─────────────────────────────────────────────────────────────
function Section5Syscall() {
  const lang = useLang();
  const chart = `
sequenceDiagram
    autonumber
    participant A as Application<br/>(ring 3)
    participant K as kernel32.dll<br/>(ring 3)
    participant N as ntdll.dll<br/>(ring 3)
    participant S as Syscall gate
    participant E as Executive<br/>(ring 0)
    participant H as Hardware

    Note over A,K: User wants to read a file
    A->>K: ReadFile(handle, buf, len)
    K->>N: NtReadFile(...)
    N->>S: syscall instruction
    S->>E: Switch to ring 0<br/>(kernel stack)
    Note over E: Security check<br/>+ I/O dispatch
    E->>H: Send command<br/>via driver
    H-->>E: Disk data
    E-->>N: Return + status
    N-->>K: Return
    K-->>A: bytes read
  `;

  return (
    <section id="syscall" style={{ scrollMarginTop: 80, marginBottom: 56 }}>
      <H2 num="05" uz="Bitta syscall'ning hayoti" en="The life of a single syscall" />
      <P>
        {lang === "en"
          ? <>Every privileged operation — opening a file, allocating memory, sending a network packet — follows the exact same path: <Em>Win32 API → ntdll → syscall instruction → executive</Em>. The diagram below traces one single <Code2>ReadFile</Code2> call. Knowing this path by heart is non-negotiable for kernel debugging, malware analysis and EDR work.</>
          : <>Har qanday imtiyozli operatsiya — fayl ochish, xotira ajratish, tarmoq paketi yuborish — aynan bir xil yo'ldan o'tadi: <Em>Win32 API → ntdll → syscall buyrug'i → executive</Em>. Quyidagi diagramma bitta <Code2>ReadFile</Code2> chaqiruvini kuzatadi. Bu yo'lni yoddan bilish — kernel debugging, malware tahlili va EDR ishi uchun shart.</>}
      </P>

      <div style={{ marginTop: 22 }}>
        <MermaidDiagram
          chart={chart}
          caption="2-rasm. Bitta ReadFile chaqiruvi user mode'dan kernel mode'ga va orqaga qaytishi."
          captionEn="Fig 2. A single ReadFile traveling from user mode to kernel and back."
        />
      </div>

      <SyscallAnalogy />

      <Callout color="var(--c-attack)" icon="skull"
        titleUz="Hujum nuqtasi — nega bu kiberxavfsizlik uchun muhim"
        titleEn="Attack surface — why this matters for security">
        {lang === "en"
          ? <>Look at the <strong>"Attack surface"</strong> marker at the very bottom of the diagram. Most defensive tools and antivirus engines (<Em>EDRs</Em>) plant their "hook" right inside <Code2>ntdll.dll</Code2> — because it is the <Em>last stop in ring 3</Em>, the final place before the syscall instruction crosses into the kernel. They record every move the "waiter" makes. This is exactly why advanced malware uses <Em>direct syscalls</Em> — bypassing the hooked ntdll functions and invoking the <Code2>syscall</Code2> instruction itself, walking up to the kitchen window alone.</>
          : <>Diagrammaning eng pastki qismidagi <strong>«Hujum nuqtasi»</strong> belgisiga e'tibor bering. Aksariyat himoya tizimlari va antiviruslar (<Em>EDR</Em>) jarayonni kuzatish uchun o'z «qarmog'ini» (hook) aynan <Code2>ntdll.dll</Code2> ichiga tashlaydi — chunki bu <Em>Ring 3'dagi oxirgi nuqta</Em>, syscall buyrug'i yadroga kirishidan oldingi so'nggi joy. Ular «ofitsiant»ning har bir qadamini yozib boradi. Aynan shuning uchun rivojlangan malware <Em>«to'g'ridan-to'g'ri syscall»</Em> (direct syscall) usulidan foydalanadi — ushlangan ntdll funksiyalarini chetlab o'tib, <Code2>syscall</Code2> buyrug'ining o'zini bevosita chaqiradi, ya'ni ofitsiantsiz o'zi oshxona darchasiga boradi.</>}
      </Callout>
    </section>
  );
}

// ─── Restaurant analogy for the syscall flow ───────────────────
const SYSCALL_ACTORS = [
  { tech: "Application", roleUz: "Mijoz", roleEn: "The customer", icon: "user",
    color: "var(--c-user)",
    descUz: "Notepad — maxfiy.txt'ni ochmoqchi", descEn: "Notepad — wants to open maxfiy.txt" },
  { tech: "kernel32 · ntdll", roleUz: "Ofitsiant", roleEn: "The waiter", icon: "code",
    color: "var(--c-user)",
    descUz: "Buyurtmani oshxona tiliga o'giradi", descEn: "Translates the order for the kitchen" },
  { tech: "Syscall gate", roleUz: "Oshxona eshigi", roleEn: "The kitchen door", icon: "key",
    color: "var(--c-warn)",
    descUz: "Ring 3 → Ring 0 chegarasi", descEn: "The ring 3 → ring 0 boundary" },
  { tech: "Executive / Kernel", roleUz: "Oshpaz + Qorovul", roleEn: "Chef + guard", icon: "shield-check",
    color: "var(--c-system)",
    descUz: "Ruxsatni tekshiradi, ishni bajaradi", descEn: "Checks the permission, does the work" },
  { tech: "Hardware", roleUz: "Omborxona", roleEn: "The warehouse", icon: "database",
    color: "#8390a8",
    descUz: "SSD / HDD — baytlarni topadi", descEn: "SSD / HDD — fetches the raw bytes" },
];

function SyscallAnalogy() {
  const lang = useLang();
  return (
    <div style={{ marginTop: 32 }}>
      {/* Intro */}
      <div style={{
        padding: "18px 20px", borderRadius: 12,
        background: "rgba(255,145,69,0.06)",
        border: "1px solid rgba(255,145,69,0.28)",
        display: "flex", gap: 14, alignItems: "flex-start",
      }}>
        <span style={{ color: "var(--c-user)", flexShrink: 0, marginTop: 2 }}><Icon name="users" size={20} /></span>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600, color: "var(--c-user)" }}>
            {lang === "en" ? "Read it as a restaurant" : "Buni restoran misolida o'qing"}
          </div>
          <div style={{ fontSize: 13.5, color: "var(--text-1)", lineHeight: 1.6, marginTop: 4 }}>
            {lang === "en"
              ? <>This diagram shows how Windows connects a plain program (Notepad, or your Python script) to the computer's physical storage. The easiest way to understand it is a restaurant: you order, a waiter relays it, the kitchen cooks, the warehouse supplies — and your food travels back the same way.</>
              : <>Bu diagramma Windows oddiy dasturni (Notepad yoki Python skriptingizni) kompyuterning jismoniy xotirasiga qanday bog'lashini ko'rsatadi. Buni eng oson tushunish yo'li — restoran: siz buyurtma berasiz, ofitsiant uni yetkazadi, oshxona tayyorlaydi, omborxona mahsulot beradi — taom esa o'sha yo'ldan orqaga qaytadi.</>}
          </div>
        </div>
      </div>

      {/* Actor mapping cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginTop: 16 }}>
        {SYSCALL_ACTORS.map((a, i) => (
          <div key={i} style={{
            padding: "14px 12px", borderRadius: 10,
            background: "var(--bg-2)",
            border: `1px solid ${a.color}33`,
            borderTop: `2px solid ${a.color}`,
            display: "flex", flexDirection: "column", gap: 6,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ width: 30, height: 30, borderRadius: 7, background: a.color + "1a", border: `1px solid ${a.color}44`, color: a.color, display: "grid", placeItems: "center" }}>
                <Icon name={a.icon} size={15} />
              </div>
              <span className="mono" style={{ fontSize: 9, color: "var(--text-3)", letterSpacing: 0.06 }}>0{i + 1}</span>
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, color: a.color }}>
              {lang === "en" ? a.roleEn : a.roleUz}
            </div>
            <div className="mono" style={{ fontSize: 9.5, color: "var(--text-2)", letterSpacing: 0.04 }}>{a.tech}</div>
            <div style={{ fontSize: 11, color: "var(--text-1)", lineHeight: 1.45 }}>
              {lang === "en" ? a.descEn : a.descUz}
            </div>
          </div>
        ))}
      </div>

      {/* Step-by-step walkthrough */}
      <div style={{ marginTop: 24 }}>
        <div className="eyebrow" style={{ marginBottom: 4 }}>
          // {lang === "en" ? "STEP_BY_STEP" : "QADAMMA_QADAM"}
        </div>
        <div>
          <AnalogyStep n={1} zoneUz="Ring 3 · Buyurtma" zoneEn="Ring 3 · The order" color="var(--c-user)" dir="down"
            titleUz="Mijoz buyurtma beradi" titleEn="The customer places an order">
            {lang === "en"
              ? <>You want to open <Code2>maxfiy.txt</Code2> in Notepad. Notepad tells the OS "read me this file" — in the diagram this is <Code2>ReadFile(handle, buffer)</Code2> (step&nbsp;1). The app only knows the file number (the <Term>handle</Term>) and an empty slot for the data (the <Term>buffer</Term>); it has no idea where the disk physically is.</>
              : <>Siz Notepad'da <Code2>maxfiy.txt</Code2> faylini ochmoqchisiz. Notepad operatsion tizimga «menga shu faylni o'qib ber» deydi — diagrammada bu <Code2>ReadFile(handle, buffer)</Code2> (1-qadam). Dastur faqat fayl raqamini (<Term>handle</Term>) va ma'lumot joylashadigan bo'sh joyni (<Term>buffer</Term>) biladi; diskning fizik joyini umuman bilmaydi.</>}
          </AnalogyStep>

          <AnalogyStep n={2} zoneUz="Ring 3 · Ofitsiant" zoneEn="Ring 3 · The waiter" color="var(--c-user)" dir="down"
            titleUz="Ofitsiant buyurtmani tarjima qiladi" titleEn="The waiter translates the order">
            {lang === "en"
              ? <>Programs are not allowed to talk to the hardware directly. Notepad calls a Windows library — <Code2>kernel32.dll</Code2> — which hands the order to <Code2>ntdll.dll</Code2>, translating it into the kitchen's language: <Code2>NtReadFile</Code2> (step&nbsp;2). All of this still happens in <Em>User Mode (Ring 3)</Em> — the restricted zone where security limits apply.</>
              : <>Dasturlarga temir-tersak bilan to'g'ridan-to'g'ri gaplashishga ruxsat yo'q. Notepad maxsus Windows kutubxonasiga — <Code2>kernel32.dll</Code2> — murojaat qiladi, u esa buyurtmani <Code2>ntdll.dll</Code2> ga uzatib, oshxona tushunadigan tilga o'giradi: <Code2>NtReadFile</Code2> (2-qadam). Bularning bari hali <Em>User Mode (Ring 3)</Em> — xavfsizlik cheklovlari amal qiladigan hududda yuz beradi.</>}
          </AnalogyStep>

          <AnalogyStep n={3} zoneUz="Chegara · Syscall" zoneEn="Boundary · Syscall" color="var(--c-warn)" dir="down"
            titleUz="Oshxona eshigi — syscall" titleEn="The kitchen door — the syscall">
            {lang === "en"
              ? <>The waiter has the order but cannot enter the kitchen (the kernel). So he passes it through the kitchen window with a special command: <Code2>syscall</Code2> (system call, step&nbsp;3). This is the hard boundary between the ordinary application world and the fully-privileged kernel world — ring&nbsp;3 stops, ring&nbsp;0 begins.</>
              : <>Ofitsiant buyurtmani oldi, lekin oshxonaga (yadroga) kira olmaydi. Shuning uchun u oshxona darchasidan maxsus buyruq yuboradi: <Code2>syscall</Code2> (system call — tizim chaqiruvi, 3-qadam). Bu — oddiy dastur muhitidan to'liq huquqli yadro muhitiga o'tish chegarasi: ring&nbsp;3 tugaydi, ring&nbsp;0 boshlanadi.</>}
          </AnalogyStep>

          <AnalogyStep n={4} zoneUz="Ring 0 · Yadro" zoneEn="Ring 0 · Kernel" color="var(--c-system)" dir="down"
            titleUz="Qorovul tekshiradi, oshpaz ishni bajaradi" titleEn="The guard checks, the chef cooks">
            {lang === "en"
              ? <>The order is now inside the "heart" of the computer (Ring&nbsp;0). The guard runs a <Em>security check</Em> first: do you actually have permission to read this file? If yes, the kernel (the chef) forwards the command straight to the hardware drivers (steps&nbsp;4–5).</>
              : <>Buyurtma endi kompyuterning «yuragi» — Ring&nbsp;0 ichida. Avval Qorovul <Em>xavfsizlik tekshiruvini</Em> o'tkazadi: sizning bu faylni o'qishga huquqingiz bormi? Ruxsat bo'lsa, Kernel (oshpaz) buyruqni bevosita hardware drayverlariga uzatadi (4–5-qadamlar).</>}
          </AnalogyStep>

          <AnalogyStep n={5} zoneUz="Hardware · Omborxona" zoneEn="Hardware · Warehouse" color="#8390a8" dir="down"
            titleUz="Omborxona baytlarni topadi" titleEn="The warehouse fetches the bytes">
            {lang === "en"
              ? <>Your disk (SSD / HDD) springs into action, locates the text bytes of <Code2>maxfiy.txt</Code2> at the requested address and sends them back up (step&nbsp;6). This is the only point where anything physical actually moves.</>
              : <>Qattiq diskingiz (SSD / HDD) ishga tushadi, ko'rsatilgan manzildan <Code2>maxfiy.txt</Code2> ichidagi matn baytlarini topadi va yuqoriga qaytaradi (6-qadam). Bu — yagona nuqta, bu yerda haqiqatan fizik narsa harakatlanadi.</>}
          </AnalogyStep>

          <AnalogyStep n={6} zoneUz="Qaytish · Orqaga" zoneEn="Return · Back up" color="var(--accent)" dir="up" last
            titleUz="Ma'lumot o'sha yo'ldan qaytadi" titleEn="The data travels back the same way">
            {lang === "en"
              ? <>The data retraces its path in reverse (steps&nbsp;7–9): kernel → <Code2>ntdll.dll</Code2> → <Code2>kernel32.dll</Code2> → Notepad. Finally the text appears on your screen. The entire round trip finishes in well under a millisecond.</>
              : <>O'qilgan ma'lumot kelgan yo'lidan teskari qaytadi (7–9-qadamlar): yadro → <Code2>ntdll.dll</Code2> → <Code2>kernel32.dll</Code2> → Notepad. Nihoyat matn ekraningizda paydo bo'ladi. Butun bu sayohat bir millisekunddan ham kam vaqtda tugaydi.</>}
          </AnalogyStep>
        </div>
      </div>
    </div>
  );
}

function AnalogyStep({ n, zoneUz, zoneEn, color, dir = "down", last, titleUz, titleEn, children }) {
  const lang = useLang();
  return (
    <div style={{ display: "flex", gap: 16, position: "relative" }}>
      {/* Number + connector rail */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: color + "1a", color,
          border: `1.5px solid ${color}`,
          display: "grid", placeItems: "center",
          fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 14,
          boxShadow: `0 0 14px ${color}44`,
        }}>{n}</div>
        {!last && (
          <div style={{ flex: 1, width: 2, background: `linear-gradient(180deg, ${color}, var(--border))`, minHeight: 18, marginTop: 2 }} />
        )}
      </div>
      {/* Body */}
      <div style={{ paddingBottom: last ? 0 : 22, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span className="mono" style={{ fontSize: 9.5, color, letterSpacing: 0.12, textTransform: "uppercase" }}>
            {lang === "en" ? zoneEn : zoneUz}
          </span>
          <Icon name={dir === "up" ? "arrow-left" : "arrow-right"} size={11}
            style={{ color, transform: dir === "up" ? "rotate(-90deg)" : "rotate(90deg)" }} />
        </div>
        <h4 style={{ margin: "0 0 4px", fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600, color: "var(--text-0)" }}>
          {lang === "en" ? titleEn : titleUz}
        </h4>
        <div style={{ fontSize: 13.5, color: "var(--text-1)", lineHeight: 1.65 }}>{children}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function Section6Security() {
  const lang = useLang();
  const items = [
    {
      icon: "shield-check", color: "var(--accent)",
      uz: "User/kernel chegarasi", en: "User/kernel boundary",
      descUz: "Hujumchining birinchi orzusi — ring 3'dan ring 0'ga sakrash. Privilege escalation deganda aynan shu bosqich nazarda tutiladi.",
      descEn: "Every attacker's first dream: jump from ring 3 to ring 0. This is what 'privilege escalation' targets.",
    },
    {
      icon: "code", color: "var(--c-user)",
      uz: "Subsistem DLL'lari", en: "Subsystem DLLs",
      descUz: "kernel32, user32, ntdll — bu yerda hook qilish DLL hijacking, AMSI bypass va EDR aldash uchun klassik joy.",
      descEn: "kernel32, user32, ntdll — hooking here is the classic spot for DLL hijacking, AMSI bypass, and EDR evasion.",
    },
    {
      icon: "cpu", color: "var(--c-attack)",
      uz: "Drayverlar", en: "Drivers",
      descUz: "Imzolangan, ammo zaif drayver — kernel'ga eng tez yo'l. 'BYOVD' (Bring Your Own Vulnerable Driver) shu yerdan keladi.",
      descEn: "A signed but vulnerable driver = the fastest path into the kernel. This is the 'BYOVD' (Bring Your Own Vulnerable Driver) trick.",
    },
    {
      icon: "database", color: "var(--c-auth)",
      uz: "Object Manager", en: "Object Manager",
      descUz: "Har bir handle uchun SRM ruxsat tekshiradi. Yomon konfiguratsiya — token impersonation va handle hijacking uchun ochiq eshik.",
      descEn: "SRM checks ACLs on every handle. A weak ACL = open door for token impersonation and handle hijacking.",
    },
    {
      icon: "layers", color: "var(--c-system)",
      uz: "Bootloader", en: "Bootloader",
      descUz: "Secure Boot'ni chetlab o'tuvchi rootkit (BlackLotus) — bu hozirda eng yuqori darajadagi tahdid.",
      descEn: "A rootkit that bypasses Secure Boot (BlackLotus) — currently the highest-tier threat.",
    },
    {
      icon: "lock", color: "var(--c-warn)",
      uz: "HAL & firmware", en: "HAL & firmware",
      descUz: "Eng past darajadagi rootkit (firmware bootkit) — diskni qayta formatlash ham yordam bermaydi.",
      descEn: "Lowest-tier rootkit (firmware bootkit) — reformatting the disk doesn't help.",
    },
  ];

  return (
    <section id="security" style={{ scrollMarginTop: 80, marginBottom: 56 }}>
      <H2 num="06" uz="Xavfsizlik nuqtai nazaridan" en="Why each layer matters for security" />
      <P>
        {lang === "en"
          ? <>This isn't a security course bolted on top of fundamentals — every layer of the architecture you just learned is also an attack surface. Below is how each layer becomes interesting to an attacker (and to you, as a defender).</>
          : <>Bu fundamental darslarga «ulangan» xavfsizlik kursi emas — siz hozir o'rgangan har bir qatlam ham hujum yuzasidir. Quyida har bir qatlam hujumchi uchun (va sizga, mudofaachi sifatida) qanday qiziqarli bo'lishi ko'rsatilgan.</>}
      </P>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginTop: 22 }}>
        {items.map((it, i) => (
          <div key={i} className="glass" style={{ padding: 18, borderLeft: `3px solid ${it.color}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ color: it.color }}><Icon name={it.icon} size={18} /></div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600 }}>
                {lang === "en" ? it.en : it.uz}
              </div>
            </div>
            <div style={{ fontSize: 13, color: "var(--text-1)", lineHeight: 1.55 }}>
              {lang === "en" ? it.descEn : it.descUz}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
function Section7Lab() {
  const lang = useLang();
  return (
    <section id="lab" style={{ scrollMarginTop: 80, marginBottom: 56 }}>
      <H2 num="07" uz="Laboratoriya" en="Hands-on lab" />
      <P>
        {lang === "en"
          ? <>Open an elevated PowerShell. Your goal: see the architecture in real-time — list every process, identify what runs in user mode vs kernel mode, and watch the syscall path light up.</>
          : <>Admin huquqi bilan PowerShell oching. Vazifa: arxitekturani real vaqtda ko'rish — barcha jarayonlarni sanab chiqing, user mode'da va kernel mode'da nima ishlayotganini aniqlang, va syscall yo'lining yorishishini kuzating.</>}
      </P>

      <div className="glass" style={{ padding: "0 28px 4px", marginTop: 22 }}>
        <LabStep n={1}
          title="Barcha jarayonlarni ro'yxatlash"
          titleEn="Enumerate every process"
          done>
          <P>{lang === "en" ? "Get every running process with its PID, parent PID and image path." : "Har bir jarayonni PID, ota-PID va image path bilan ko'rasiz."}</P>
          <Terminal lines={[
            { type: "comment", text: lang === "en" ? "# Top 8 processes by memory" : "# Xotira bo'yicha eng katta 8 ta jarayon" },
            { type: "cmd", text: "Get-Process | Sort-Object WS -Desc | Select-Object -First 8 Id, Name, @{n='MB';e={[int]($_.WS/1MB)}}, Path" },
            { type: "out", text: "  Id  Name            MB  Path" },
            { type: "out", text: "  --  ----            --  ----" },
            { type: "ok", text: "1840  MsMpEng        612  C:\\ProgramData\\Microsoft\\Windows Defender\\..." },
            { type: "ok", text: "5612  chrome         484  C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" },
            { type: "ok", text: "  4   System         122  (kernel)" },
            { type: "warn", text: "  0   Idle             0  (kernel · scheduler)" },
            { type: "comment", text: lang === "en" ? "\n# Note: PID 0 and 4 are kernel-mode 'processes' — they have no image on disk." : "\n# Eslatma: PID 0 va 4 — kernel-mode 'jarayonlari'. Diskda image'i yo'q." },
          ]} />
        </LabStep>

        <LabStep n={2}
          title="Process tree ko'rinishini olish"
          titleEn="Build the process tree">
          <P>{lang === "en" ? "Who started whom? The tree reveals the boot sequence in action." : "Kim kimni ishga tushirgan? Process tree — boot ketma-ketligini real holatda ochib beradi."}</P>
          <Terminal lines={[
            { type: "cmd", text: "Get-CimInstance Win32_Process | Select-Object ProcessId, ParentProcessId, Name | Format-Table" },
            { type: "out", text: " ProcessId  ParentProcessId  Name" },
            { type: "out", text: " ---------  ---------------  ----" },
            { type: "ok", text: "         0                   System Idle Process" },
            { type: "ok", text: "         4              0    System" },
            { type: "ok", text: "       340              4    smss.exe       ← session manager" },
            { type: "ok", text: "       456            340    csrss.exe      ← Win32 subsystem" },
            { type: "ok", text: "       540            340    wininit.exe    ← user-mode init" },
            { type: "ok", text: "       668            540    services.exe   ← SCM" },
            { type: "ok", text: "       680            540    lsass.exe      ← security subsystem" },
            { type: "ok", text: "      1124            668    svchost.exe    ← service host" },
            { type: "comment", text: lang === "en" ? "\n# This IS the boot diagram from section 4 — live, on your machine." : "\n# Bu — 4-bo'limdagi boot diagrammasi. Real holda, sizning mashinangizda." },
          ]} />
        </LabStep>

        <LabStep n={3}
          title="Drayverlar ro'yxati (kernel mode kodi)"
          titleEn="List loaded drivers (kernel-mode code)">
          <P>{lang === "en" ? "Every loaded driver = code running in ring 0. A single rogue one can compromise the whole system." : "Yuklangan har bir drayver = ring 0'da ishlayotgan kod. Yagona zararli drayver butun tizimni xavf ostiga qo'yadi."}</P>
          <Terminal lines={[
            { type: "cmd", text: "driverquery /v /fo csv | ConvertFrom-Csv | Select-Object 'Module Name', 'Display Name', 'Driver Type' | Sort-Object 'Driver Type'" },
            { type: "out", text: " Module Name   Display Name              Driver Type" },
            { type: "out", text: " -----------   ------------              -----------" },
            { type: "ok", text: " ACPI          ACPI Driver               Kernel" },
            { type: "ok", text: " disk          Disk Driver               Kernel" },
            { type: "ok", text: " NTFS          NTFS Filesystem           File System" },
            { type: "ok", text: " tcpip         TCP/IP Protocol Driver    Kernel" },
            { type: "warn", text: " RTKVHD64      Realtek HD Audio Driver   Kernel" },
            { type: "err", text: " ??_unknown_   <unsigned third-party>    Kernel   ← inspect this!" },
            { type: "comment", text: lang === "en" ? "\n# Hunt for unsigned drivers — they're the #1 indicator of BYOVD." : "\n# Imzolanmagan drayverlarni qidiring — bular BYOVD'ning №1 ishorasi." },
          ]} />
        </LabStep>
      </div>

      <div style={{ marginTop: 18, padding: 18, borderRadius: 10, background: "rgba(0,255,156,0.04)", border: "1px solid var(--accent-border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Icon name="info" size={16} style={{ color: "var(--accent)" }} />
          <div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600 }}>{lang === "en" ? "Lab completion" : "Lab yakuni"}</div>
        </div>
        <P style={{ marginTop: 8, marginBottom: 0 }}>
          {lang === "en"
            ? <>Now run <Code2>Process Explorer</Code2> from Sysinternals and watch a single click — say, opening Notepad — propagate through every layer you just mapped.</>
            : <>Endi Sysinternals'dan <Code2>Process Explorer</Code2>'ni ishga tushiring va bitta bosishni — masalan, Notepad ochishni — siz endi xaritalashtirilgan har bir qatlam orqali yoyilishini kuzating.</>}
        </P>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
function Section8Comparison() {
  const lang = useLang();
  return (
    <section id="compare" style={{ scrollMarginTop: 80, marginBottom: 56 }}>
      <H2 num="08" uz="User mode va Kernel mode" en="User mode vs Kernel mode" />
      <P>
        {lang === "en"
          ? "Two worlds, same machine. Knowing which side you're on at any moment is the single most important skill on the Windows internals path."
          : "Ikki dunyo, bir mashina. Istalgan vaqtda qaysi tomonda ekanligingizni bilish — Windows internals yo'lidagi eng muhim ko'nikmadir."}
      </P>

      <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)" }}>
        <div style={{ padding: "18px 20px", background: "var(--surface-2)" }}>
          <div className="mono" style={{ fontSize: 10, color: "var(--text-2)", letterSpacing: 0.1, textTransform: "uppercase" }}>{lang === "en" ? "Aspect" : "Jihat"}</div>
        </div>
        <div style={{ padding: "18px 20px", background: "rgba(255, 145, 69, 0.08)", borderLeft: "1px solid var(--border)" }}>
          <div className="mono" style={{ fontSize: 10, color: "var(--c-user)", letterSpacing: 0.1, textTransform: "uppercase" }}>User mode · ring 3</div>
        </div>
        <div style={{ padding: "18px 20px", background: "rgba(77, 139, 255, 0.08)", borderLeft: "1px solid var(--border)" }}>
          <div className="mono" style={{ fontSize: 10, color: "var(--c-system)", letterSpacing: 0.1, textTransform: "uppercase" }}>Kernel mode · ring 0</div>
        </div>

        {(lang === "en" ? CMP_EN : CMP_UZ).map((row, i) => (
          <React.Fragment key={i}>
            <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)", fontSize: 13, color: "var(--text-1)", background: "var(--bg-2)" }}>{row[0]}</div>
            <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)", fontSize: 13, color: "var(--text-0)" }}>{row[1]}</div>
            <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)", fontSize: 13, color: "var(--text-0)" }}>{row[2]}</div>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

const CMP_UZ = [
  ["Privilege", "Cheklangan (ring 3)", "Cheksiz (ring 0)"],
  ["Hardware'ga kirish", "❌ Faqat OS orqali", "✅ To'g'ridan-to'g'ri"],
  ["Boshqa jarayonni o'qish", "❌ Sandbox'lashtirilgan", "✅ Hammasini"],
  ["Xato ta'siri", "Bitta dastur o'ladi", "BSOD — butun mashina"],
  ["Yashash joyi", "exe, dll", "sys (drayver), ntoskrnl"],
  ["Misol kod", "Notepad, Chrome", "NTFS drayveri, TCP/IP stack"],
  ["Debugging vositasi", "WinDbg, x64dbg", "WinDbg + KD, LiveKD"],
];
const CMP_EN = [
  ["Privilege", "Restricted (ring 3)", "Unrestricted (ring 0)"],
  ["Hardware access", "❌ Only via OS", "✅ Direct"],
  ["Read another process", "❌ Sandboxed", "✅ Anything"],
  ["Crash impact", "One app dies", "BSOD — entire machine"],
  ["Lives in", "exe, dll", "sys (driver), ntoskrnl"],
  ["Example code", "Notepad, Chrome", "NTFS driver, TCP/IP stack"],
  ["Debugger", "WinDbg, x64dbg", "WinDbg + KD, LiveKD"],
];

// ─────────────────────────────────────────────────────────────
function Section9Summary() {
  const lang = useLang();
  const nodes = [
    { x: 50, y: 50, label: "Windows", color: "var(--accent)", main: true },
    { x: 22, y: 22, label: "OS jobs", color: "var(--c-user)" },
    { x: 78, y: 22, label: "Ring 3/0", color: "var(--c-warn)" },
    { x: 18, y: 50, label: "Executive", color: "var(--c-system)" },
    { x: 82, y: 50, label: "ntoskrnl", color: "var(--c-system)" },
    { x: 25, y: 78, label: "HAL", color: "#8390a8" },
    { x: 75, y: 78, label: "Syscall", color: "var(--c-warn)" },
    { x: 50, y: 12, label: "Subsystems", color: "var(--c-user)" },
    { x: 50, y: 88, label: "Drivers", color: "var(--c-auth)" },
  ];
  const points = lang === "en" ? KEY_EN : KEY_UZ;

  return (
    <section id="summary" style={{ scrollMarginTop: 80, marginBottom: 56 }}>
      <H2 num="09" uz="Xulosa va kalit tushunchalar" en="Summary · key takeaways" />

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 28, alignItems: "center" }}>
        <div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
            {points.map((t, i) => (
              <li key={i} style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--accent)", color: "#04060d", display: "grid", placeItems: "center", flexShrink: 0, fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 11 }}>{i + 1}</div>
                <div style={{ fontSize: 14, color: "var(--text-0)" }}>{t}</div>
              </li>
            ))}
          </ul>
        </div>
        <MindMap nodes={nodes} />
      </div>
    </section>
  );
}

const KEY_UZ = [
  "OS — ilovalar va apparat o'rtasidagi yagona vositachi. Hammasi shu yerdan o'tadi.",
  "Ring 3 (user) va Ring 0 (kernel) — protsessor darajasidagi qat'iy chegaralar.",
  "Process = mulk + xavfsizlik + manzil maydoni. Thread = CPU'da ishlaydigan birlik.",
  "ntoskrnl.exe ichida microkernel (mexanizm) va executive (siyosat) yashaydi.",
  "Win32 API → ntdll → syscall → executive — har qanday imtiyozli amal shu yo'l.",
  "Boot ketma-ketligi: POST → bootloader → kernel → smss → wininit → logon.",
  "Drayver = ring 0'da ishlovchi kod. Imzolanmagan = qizil bayroq.",
];
const KEY_EN = [
  "The OS is the single mediator between apps and hardware. Everything passes through it.",
  "Ring 3 (user) and Ring 0 (kernel) are hard boundaries enforced by the silicon.",
  "Process = ownership + security + address space. Thread = the unit the CPU runs.",
  "ntoskrnl.exe holds both the microkernel (mechanism) and executive (policy).",
  "Win32 API → ntdll → syscall → executive — every privileged action follows this path.",
  "Boot sequence: POST → bootloader → kernel → smss → wininit → logon.",
  "A driver is code that runs in ring 0. An unsigned one is a red flag.",
];

function MindMap({ nodes }) {
  const main = nodes.find((n) => n.main);
  return (
    <div style={{ aspectRatio: "1", maxWidth: 460, position: "relative", margin: "0 auto" }}>
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <defs>
          <filter id="mm-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.6" />
          </filter>
        </defs>
        {nodes.filter((n) => !n.main).map((n, i) => (
          <line key={i} x1={main.x} y1={main.y} x2={n.x} y2={n.y}
            stroke={n.color} strokeOpacity="0.35" strokeWidth="0.4" />
        ))}
        {nodes.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={n.main ? 9 : 5}
              fill={n.main ? n.color : n.color + "22"}
              stroke={n.color} strokeWidth="0.5"
              filter={n.main ? "url(#mm-glow)" : ""} />
            <text x={n.x} y={n.y + (n.main ? 0.7 : -7.5)}
              fill={n.main ? "#04060d" : n.color}
              fontSize={n.main ? "2.5" : "2.2"}
              fontFamily="var(--font-mono)"
              fontWeight="600"
              textAnchor="middle"
              dominantBaseline="middle">
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function LessonNextNav({ setRoute, onQuizStart, lessonNum }) {
  const lang = useLang();
  return (
    <div style={{ marginTop: 60, paddingTop: 32, borderTop: "1px solid var(--border)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 16, alignItems: "center" }}>
        <button className="btn" onClick={() => setRoute({ name: "section", section: 1 })} style={{ justifySelf: "start" }}>
          <Icon name="arrow-left" size={14} /> {lang === "en" ? "Section overview" : "Bo'limga qaytish"}
        </button>
        <div style={{ textAlign: "center" }}>
          <div className="eyebrow">// {lang === "en" ? "LESSON_COMPLETE" : "DARS_TUGADI"}</div>
          <div style={{ color: "var(--text-2)", fontSize: 12, marginTop: 4 }}>
            {lang === "en" ? "Pass the quiz to unlock the next lesson" : "Keyingi darsga o'tish uchun testni topshiring"}
          </div>
        </div>
        <button className="btn btn-primary" onClick={onQuizStart} style={{ justifySelf: "end" }}>
          <Icon name="target" size={14} /> {lang === "en" ? "Start the quiz" : "Testni boshlash"} <Icon name="arrow-right" size={14} />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// L02: Kernel nima?
// ─────────────────────────────────────────────────────────────
function SectionKernelWhat() {
  const lang = useLang();
  return (
    <section id="kernel-what" style={{ scrollMarginTop: 80, marginBottom: 56 }}>
      <H2 num="01" uz="Kernel nima?" en="What is the kernel?" />
      <P>
        {lang === "en"
          ? <>The <Term>kernel</Term> is the innermost core of the operating system — the one and only piece of software that has complete, unrestricted access to all hardware and memory. Every application, every service, every driver must ultimately go through the kernel to accomplish anything real. While your browser runs in a sandboxed <Em>user space</Em> where it cannot touch hardware directly, the kernel lives in a completely separate, privileged area called <Em>kernel space</Em>, operating in ring 0 with no restrictions whatsoever.</>
          : <>«<Term>Kernel</Term>» — operatsion tizimning eng ichki yadrosi. Bu barcha hardware va xotiraga to'liq, cheklovsiz kirishga ega bo'lgan yagona dastur. Har bir ilova, har bir xizmat, har bir drayver haqiqiy biror narsani bajarish uchun oxir-oqibat kernel orqali o'tishi kerak. Brauzeringiz hardware ga to'g'ridan-to'g'ri tegolmaydigan sandbox'lashtirilgan <Em>user space</Em>'da ishlaydi; kernel esa butunlay boshqa, imtiyozli zonada — <Em>kernel space</Em>'da, ring 0'da hech qanday cheklovsiz ishlaydi.</>}
      </P>
      <P>
        {lang === "en"
          ? <>In Windows, the kernel lives inside a single executable: <code>ntoskrnl.exe</code> (NT OS Kernel Executable), located at <code>C:\Windows\System32\ntoskrnl.exe</code>. This ~10–15 MB file is signed by Microsoft — any byte-level modification causes Windows to refuse to boot entirely. At system startup, the bootloader (<code>winload.efi</code>) maps this file into physical RAM, verifies its signature, then hands control to it. From that moment, the kernel owns the machine.</>
          : <>Windows'da kernel bitta bajariladigan faylda joylashgan: <code>C:\Windows\System32\ntoskrnl.exe</code> (NT OS Kernel Executable). Bu ~10–15 MB li fayl Microsoft tomonidan imzolangan — bitta baytni o'zgartirish Windows'ning butunlay yuklashdan bosh tortishiga olib keladi. Tizim ishga tushganda, bootloader (<code>winload.efi</code>) bu faylni fizik RAM ga ko'chiradi, imzosini tekshiradi va boshqaruvni unga topshiradi. O'sha paytdan boshlab kernel mashinaga egalik qiladi.</>}
      </P>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginTop: 24 }}>
        {(lang === "en" ? [
          { icon: "cpu", color: "var(--c-system)", title: "CPU scheduling", desc: "The kernel decides which thread runs next, on which CPU core, for how long. Without this, multiple programs could not run concurrently. The scheduler runs hundreds of times per second." },
          { icon: "database", color: "var(--accent)", title: "Memory management", desc: "Every process gets its own virtual address space (0–128 TB in 64-bit Windows). The kernel maps virtual addresses to physical RAM pages and prevents any process from accessing another's memory." },
          { icon: "shield", color: "var(--c-auth)", title: "Security policy enforcement", desc: "Before any file, registry key, or process object is accessed, the kernel's Security Reference Monitor checks the caller's access token against the object's ACL. No exception, ever." },
          { icon: "layers", color: "var(--c-user)", title: "I/O and device management", desc: "The kernel routes every I/O request (disk read, network send, USB write) through a stack of drivers via IRP (I/O Request Packets). Hardware never talks directly to user space." },
          { icon: "lock", color: "var(--c-warn)", title: "Privilege enforcement", desc: "The kernel maintains the ring 0 / ring 3 boundary. All privilege checks happen here. This is the single point of control that makes the OS trustworthy." },
          { icon: "graph", color: "var(--c-attack)", title: "System call gateway", desc: "Every privileged action from user space (open file, allocate memory, create thread) arrives at the kernel through the SYSCALL instruction. The kernel validates, executes, and returns the result." },
        ] : [
          { icon: "cpu", color: "var(--c-system)", title: "CPU rejalashtirish", desc: "Kernel qaysi thread keyingi navbatda, qaysi CPU yadroda, qancha vaqt ishlashini hal qiladi. Bu bo'lmasa, bir nechta dastur bir vaqtda ishlay olmas edi. Rejalashtirgich sekundiga yuzlab marta ishlaydi." },
          { icon: "database", color: "var(--accent)", title: "Xotirani boshqarish", desc: "Har bir jarayon o'z virtual manzil maydonini oladi (64-bitli Windows'da 0–128 TB). Kernel virtual manzillarni fizik RAM sahifalariga xaritalaydi va har bir jarayonning boshqasining xotirasiga kirishiga yo'l qo'ymaydi." },
          { icon: "shield", color: "var(--c-auth)", title: "Xavfsizlik siyosatini ta'minlash", desc: "Har bir fayl, registry kaliti yoki jarayon ob'ektiga kirishdan oldin kernelning Xavfsizlik Mos Yozuvlar Moniteri chaqiruvchining kirish tokenini ob'ektning ACL'i bilan solishtiradi. Hech qachon istisno yo'q." },
          { icon: "layers", color: "var(--c-user)", title: "I/O va qurilmalarni boshqarish", desc: "Kernel har bir I/O so'rovini (disk o'qish, tarmoq yuborish, USB yozish) IRP (I/O So'rov Paketlari) orqali drayverlar steki orqali yo'naltiradi. Hardware hech qachon user space bilan to'g'ridan-to'g'ri gaplashmaydi." },
          { icon: "lock", color: "var(--c-warn)", title: "Imtiyozni ta'minlash", desc: "Kernel ring 0 / ring 3 chegarasini saqlaydi. Barcha imtiyoz tekshiruvlari shu yerda bo'ladi. Bu OT'ni ishonchli qiladigan yagona nazorat nuqtasi." },
          { icon: "graph", color: "var(--c-attack)", title: "Tizim chaqiruvi shlyuzi", desc: "User space'dan kelgan har bir imtiyozli amal (fayl ochish, xotira ajratish, thread yaratish) SYSCALL buyrug'i orqali kernelga yetib keladi. Kernel tekshiradi, bajaradi va natijani qaytaradi." },
        ]).map((c, i) => (
          <div key={i} className="glass" style={{ padding: 18, borderLeft: `3px solid ${c.color}` }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
              <div style={{ color: c.color }}><Icon name={c.icon} size={18} /></div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600 }}>{c.title}</div>
            </div>
            <div style={{ fontSize: 12.5, color: "var(--text-1)", lineHeight: 1.6 }}>{c.desc}</div>
          </div>
        ))}
      </div>

      <h3 style={{ ...subhead, marginTop: 36 }}>{lang === "en" ? "1.1 — Monolithic vs Microkernel vs Hybrid" : "1.1 — Monolitik vs Mikrokernel vs Gibrid"}</h3>
      <P>
        {lang === "en"
          ? <>There are three main architectural philosophies for kernels. Windows uses a <Em>hybrid</Em> approach:</>
          : <>Kernellar uchun uchta asosiy arxitektura falsafasi mavjud. Windows <Em>gibrid</Em> yondashuvdan foydalanadi:</>}
      </P>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
        {(lang === "en" ? [
          { title: "Monolithic kernel", color: "var(--c-user)", desc: "Everything runs in ring 0: scheduling, memory, drivers, file systems, networking. Fast, but a bug anywhere crashes the entire OS. Linux is monolithic." },
          { title: "Microkernel", color: "var(--c-system)", desc: "Only the absolute minimum runs in ring 0 (scheduling, IPC). Drivers, file systems run as user-space servers. Secure, but slower due to message passing. Used in embedded systems (QNX, MINIX)." },
          { title: "Hybrid kernel (Windows)", color: "var(--accent)", desc: "Core kernel + executive in ring 0 for speed. Drivers also in ring 0. But the design is modular like a microkernel — each manager (Process, Memory, I/O) is separate. Best of both worlds, but drivers remain a risk." },
        ] : [
          { title: "Monolitik kernel", color: "var(--c-user)", desc: "Hamma narsa ring 0'da ishlaydi: rejalashtirish, xotira, drayverlar, fayl tizimlari, tarmoq. Tez, lekin istalgan joyda xato butun OS'ni yiqitadi. Linux monolitikdir." },
          { title: "Mikrokernel", color: "var(--c-system)", desc: "Faqat mutlaq minimum ring 0'da ishlaydi (rejalashtirish, IPC). Drayverlar, fayl tizimlari user-space serverlari sifatida ishlaydi. Xavfsiz, lekin xabar almashish tufayli sekinroq. O'rnatilgan tizimlarda ishlatiladi (QNX, MINIX)." },
          { title: "Gibrid kernel (Windows)", color: "var(--accent)", desc: "Tezlik uchun asosiy kernel + executive ring 0'da. Drayverlar ham ring 0'da. Lekin dizayn mikrokernel kabi modulli — har bir menejer (Jarayon, Xotira, I/O) alohida. Ikkalasining eng yaxshi tomoni, ammo drayverlar xavf bo'lib qoladi." },
        ]).map((r, i) => (
          <div key={i} style={{ padding: "14px 18px", background: "var(--bg-2)", border: `1px solid ${r.color}33`, borderLeft: `3px solid ${r.color}`, borderRadius: 10 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, color: r.color, marginBottom: 5 }}>{r.title}</div>
            <div style={{ fontSize: 13, color: "var(--text-1)", lineHeight: 1.6 }}>{r.desc}</div>
          </div>
        ))}
      </div>

      <Callout color="var(--accent)" icon="info" titleUz="ntoskrnl.exe haqida texnik faktlar" titleEn="Technical facts about ntoskrnl.exe">
        {lang === "en"
          ? <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8, fontSize: 13 }}>
              <li>Located at <code>C:\Windows\System32\ntoskrnl.exe</code> (uniprocessor) or <code>ntkrnlmp.exe</code> (multiprocessor — Windows merges them on modern builds)</li>
              <li>Size: ~10–20 MB depending on Windows version and debug symbols</li>
              <li>Exports ~2,600 symbols (functions/variables) that drivers can use</li>
              <li>Signed with Microsoft's kernel certificate — SHA-256 hash verified by Secure Boot chain</li>
              <li>Contains the SSDT (System Service Descriptor Table) with all ~450 syscall numbers</li>
              <li>Loaded at a randomized base address (KASLR — Kernel Address Space Layout Randomization) since Windows Vista</li>
            </ul>
          : <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8, fontSize: 13 }}>
              <li><code>C:\Windows\System32\ntoskrnl.exe</code> (yagona protsessor) yoki <code>ntkrnlmp.exe</code> (ko'p protsessorli — zamonaviy Windows versiyalarida birlashtirilgan)</li>
              <li>Hajmi: Windows versiyasiga qarab ~10–20 MB (debug ramzlari bilan)</li>
              <li>Drayverlar foydalana oladigan ~2,600 ta simvol (funksiya/o'zgaruvchi) eksport qiladi</li>
              <li>Microsoft'ning kernel sertifikati bilan imzolangan — SHA-256 hash'i Secure Boot zanjiri tomonidan tekshiriladi</li>
              <li>Barcha ~450 ta syscall raqamini o'z ichiga olgan SSDT (Tizim Xizmat Tasviri Jadvali) ni o'z ichiga oladi</li>
              <li>Windows Vista'dan beri tasodifiy asosiy manzilda yuklanadi (KASLR — Kernel Manzil Maydoni Tartibini Tasodiflashtirish)</li>
            </ul>}
      </Callout>
    </section>
  );
}

function SectionKernelInside() {
  const lang = useLang();
  return (
    <section id="kernel-inside" style={{ scrollMarginTop: 80, marginBottom: 56 }}>
      <H2 num="02" uz="ntoskrnl.exe ichida nima bor?" en="What's inside ntoskrnl.exe?" />
      <P>
        {lang === "en"
          ? <>Despite being one file, <code>ntoskrnl.exe</code> contains two conceptually separate layers: the <Term>Microkernel</Term> (low-level engine) and the <Term>Executive</Term> (high-level policy). The <Term>HAL</Term> (<code>hal.dll</code>) is a separate file but always loaded alongside the kernel. Together they form the three-tier foundation every Windows system builds upon.</>
          : <>Bitta fayl bo'lishiga qaramay, <code>ntoskrnl.exe</code> ikki kontseptual alohida qatlamni o'z ichiga oladi: <Term>Microkernel</Term> (past darajali dvigatel) va <Term>Executive</Term> (yuqori darajali siyosat). <Term>HAL</Term> (<code>hal.dll</code>) alohida fayl, lekin har doim kernel bilan birga yuklanadi. Ular birgalikda har bir Windows tizimi quriladigan uch qatlamli poydevorni tashkil qiladi.</>}
      </P>

      {/* Microkernel */}
      <div style={{ marginTop: 28, padding: "22px 26px", background: "rgba(77,139,255,0.06)", border: "1px solid rgba(77,139,255,0.28)", borderRadius: 14, borderLeft: "4px solid var(--c-system)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(77,139,255,0.15)", border: "1px solid rgba(77,139,255,0.4)", color: "var(--c-system)", display: "grid", placeItems: "center" }}><Icon name="cpu" size={18} /></div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 700, color: "var(--c-system)" }}>Microkernel</div>
            <div style={{ fontSize: 11, color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>ring 0 · innermost layer · minimal by design</div>
          </div>
        </div>
        <P>{lang === "en"
          ? <>The Microkernel is the absolute innermost engine of Windows. Its job is limited to three things by design — keeping it small reduces the attack surface and makes it easier to verify correctness:</>
          : <>Microkernel Windows'ning mutlaq eng ichki dvigatelidir. Uning ishi ataylab uchta narsa bilan cheklangan — uni kichik saqlash hujum yuzasini kamaytiradi va to'g'riligini tekshirishni osonlashtiradi:</>}</P>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
          {(lang === "en" ? [
            { icon: "clock", title: "Thread scheduling", desc: "Decides which thread runs on which CPU core, for how long (quantum). Uses priority levels 0–31. Real-time threads (16–31) always preempt normal threads (0–15). The scheduler runs via a timer interrupt (typically every 15.6ms on desktop, 1ms on server)." },
            { icon: "zap", title: "Interrupt and exception handling", desc: "Manages the IDT (Interrupt Descriptor Table) — a 256-entry table mapping each hardware signal and CPU exception to a handler function. When your keyboard sends a signal, the CPU looks up IDT entry for IRQ1 and jumps to the keyboard interrupt handler." },
            { icon: "layers", title: "CPU synchronization (multiprocessor)", desc: "On a multi-core machine, multiple CPUs share kernel data structures. The microkernel uses spinlocks and dispatcher locks to prevent simultaneous access from corrupting data. Getting this wrong causes subtle, hard-to-reproduce corruption bugs." },
          ] : [
            { icon: "clock", title: "Thread'larni rejalashtirish", desc: "Qaysi thread qaysi CPU yadroda, qancha vaqt (kvant) ishlashini hal qiladi. 0–31 prioritet darajalarini ishlatadi. Real vaqtli thread'lar (16–31) har doim oddiy thread'larni (0–15) almashtiradi. Rejalashtirgich taymer uzilishi orqali ishlaydi (odatda ish stolida har 15.6 ms, serverda 1 ms)." },
            { icon: "zap", title: "Uzilish va istisno boshqarish", desc: "IDT (Uzilish Tasviri Jadvali) ni boshqaradi — har bir hardware signali va CPU istisnosi ishlov beruvchi funksiyaga xaritalangan 256 ta yozuvli jadval. Klaviaturangiz signal yuborganda, CPU IRQ1 uchun IDT yozuvini qidirib topadi va klaviatura uzilish ishlovchisiga sakraydi." },
            { icon: "layers", title: "CPU sinxronizatsiyasi (ko'p protsessorli)", desc: "Ko'p yadroli mashinada bir nechta CPU kernel ma'lumotlar tuzilmalarini baham ko'radi. Microkernel bir vaqtning o'zida kirishning ma'lumotlarni buzishiga yo'l qo'ymaslik uchun spinlock'lar va dispatcher lock'lardan foydalanadi. Bu noto'g'ri qilinsa, takrorlanmaydigan xira buzilish xatolariga olib keladi." },
          ]).map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "12px 14px", background: "rgba(77,139,255,0.04)", borderRadius: 8, border: "1px solid rgba(77,139,255,0.15)" }}>
              <div style={{ color: "var(--c-system)", flexShrink: 0, marginTop: 2 }}><Icon name={s.icon} size={16} /></div>
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--c-system)", fontWeight: 600, marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 12.5, color: "var(--text-1)", lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Executive */}
      <div style={{ marginTop: 16, padding: "22px 26px", background: "rgba(0,255,156,0.04)", border: "1px solid var(--accent-border)", borderRadius: 14, borderLeft: "4px solid var(--accent)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: "var(--accent-soft)", border: "1px solid var(--accent-border)", color: "var(--accent)", display: "grid", placeItems: "center" }}><Icon name="layers" size={18} /></div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 700, color: "var(--accent)" }}>Executive</div>
            <div style={{ fontSize: 11, color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>ring 0 · policy layer · 6 major managers</div>
          </div>
        </div>
        <P>{lang === "en"
          ? <>The Executive sits above the microkernel and implements all OS <Em>policies</Em> — the high-level decisions about what a process is, how memory is shared, who can open a file, and how I/O flows through the system. It is split into six major managers, each responsible for a specific domain:</>
          : <>Executive mikrokernelning ustida turadi va barcha OS <Em>siyosatlarini</Em> amalga oshiradi — jarayon nima ekanligi, xotira qanday bo'lishilishi, kim fayl ochishi mumkinligi va I/O tizim orqali qanday oqishi haqidagi yuqori darajali qarorlar. U har biri o'z sohasiga mas'ul bo'lgan oltita asosiy menejerga bo'linadi:</>}</P>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
          {(lang === "en" ? [
            { name: "Process Manager", api: "NtCreateProcess, NtTerminateProcess, NtOpenProcess", color: "var(--c-user)",
              desc: "Creates and destroys processes and threads. Allocates the EPROCESS and ETHREAD kernel structures for each. Maintains the process list visible in Task Manager. Every CreateProcess() call you make in user space ends up here after passing through kernel32 → ntdll → SYSCALL." },
            { name: "Memory Manager", api: "NtAllocateVirtualMemory, NtReadVirtualMemory, NtMapViewOfSection", color: "var(--accent)",
              desc: "Manages virtual memory for every process (separate 128 TB virtual address space per process on 64-bit). Handles page faults (when a virtual page is not in RAM, it loads from disk). Manages the paging file (pagefile.sys). Implements ASLR (Address Space Layout Randomization) to randomize DLL base addresses." },
            { name: "I/O Manager", api: "NtReadFile, NtWriteFile, NtDeviceIoControlFile", color: "var(--c-system)",
              desc: "Routes every I/O request through a stack of drivers using IRP (I/O Request Packets). When you read a file: I/O Manager creates an IRP, passes it through the file system filter stack (antivirus hooks here), then to the NTFS driver, then to the disk driver, then to the hardware. Each driver in the stack can inspect, modify or complete the IRP." },
            { name: "Object Manager", api: "NtCreateFile, NtOpenKey, NtDuplicateObject", color: "var(--c-auth)",
              desc: "Every kernel resource (file, registry key, event, semaphore, thread, process) is a named kernel object. The Object Manager tracks them with reference counts — when count hits 0, the object is freed. It also manages the handle table: when you call CreateFile(), you get back an integer handle that maps to an internal object pointer." },
            { name: "Security Reference Monitor (SRM)", api: "NtAccessCheck, NtSetSecurityObject", color: "var(--c-attack)",
              desc: "Before any object access is granted, the SRM compares the caller's Access Token (which SIDs and privileges it has) against the object's Security Descriptor (which ACEs allow/deny which SIDs). This check happens on every NtOpenFile, NtOpenProcess, NtOpenKey — literally every kernel object access. You cannot bypass this without being in ring 0." },
            { name: "Cache Manager", api: "(internal, no direct syscall)", color: "var(--c-warn)",
              desc: "Caches recently accessed file data in RAM to avoid redundant disk reads. Works with the Memory Manager's mapped file system. When you read the same file twice, the second read usually never touches the disk — it comes from the cache. The cache also implements write-back buffering: writes are batched and flushed periodically." },
          ] : [
            { name: "Jarayon menejeri", api: "NtCreateProcess, NtTerminateProcess, NtOpenProcess", color: "var(--c-user)",
              desc: "Jarayonlar va thread'larni yaratadi va yo'q qiladi. Har biri uchun EPROCESS va ETHREAD kernel tuzilmalarini ajratadi. Task Manager'da ko'rinadigan jarayon ro'yxatini saqlaydi. User space'da bajaradigan har bir CreateProcess() chaqiruvi kernel32 → ntdll → SYSCALL orqali o'tgandan so'ng shu yerga yetib keladi." },
            { name: "Xotira menejeri", api: "NtAllocateVirtualMemory, NtReadVirtualMemory, NtMapViewOfSection", color: "var(--accent)",
              desc: "Har bir jarayon uchun virtual xotirani boshqaradi (64-bitli tizimda jarayon boshiga alohida 128 TB virtual manzil maydoni). Sahifa xatolarini boshqaradi (virtual sahifa RAM'da bo'lmasa, diskdan yuklaydi). Sahifash faylini boshqaradi (pagefile.sys). DLL asosiy manzillarini tasodiflashtirish uchun ASLR ni amalga oshiradi." },
            { name: "I/O menejeri", api: "NtReadFile, NtWriteFile, NtDeviceIoControlFile", color: "var(--c-system)",
              desc: "Har bir I/O so'rovini IRP (I/O So'rov Paketlari) yordamida drayverlar steki orqali yo'naltiradi. Fayl o'qiganda: I/O menejeri IRP yaratadi, uni fayl tizimi filtr stekidan (antivirus bu yerda ulanadi), keyin NTFS drayveri, keyin disk drayveri, keyin hardware'ga uzatadi. Stakdagi har bir drayver IRP ni ko'rishi, o'zgartirishi yoki tugatishi mumkin." },
            { name: "Ob'ekt menejeri", api: "NtCreateFile, NtOpenKey, NtDuplicateObject", color: "var(--c-auth)",
              desc: "Har bir kernel resursi (fayl, registry kaliti, hodisa, semafor, thread, jarayon) nomlangan kernel ob'ektidir. Ob'ekt menejeri ularni havolalar soni bilan kuzatadi — son 0 ga yetganda ob'ekt bo'shatiladi. U handle jadvalini ham boshqaradi: CreateFile() ni chaqirganizda, ichki ob'ekt ko'rsatkichiga xaritalangan butun son handle qaytariladi." },
            { name: "Xavfsizlik Mos Yozuvlar Moniteri (SRM)", api: "NtAccessCheck, NtSetSecurityObject", color: "var(--c-attack)",
              desc: "Har qanday ob'ektga kirish berilishidan oldin, SRM chaqiruvchining Kirish Tokenini (qaysi SID va imtiyozlarga ega) ob'ektning Xavfsizlik Tavsifi bilan (qaysi ACE qaysi SID ga ruxsat beradi/rad etadi) solishtiradi. Bu tekshiruv har bir NtOpenFile, NtOpenProcess, NtOpenKey — har bir kernel ob'ektiga kirishda amalga oshiriladi. Ring 0'da bo'lmasdan buni chetlab o'tib bo'lmaydi." },
            { name: "Kesh menejeri", api: "(ichki, to'g'ridan-to'g'ri syscall yo'q)", color: "var(--c-warn)",
              desc: "Keraksiz disk o'qishlaridan qochish uchun yaqinda kirilgan fayl ma'lumotlarini RAM'da keshlaydi. Xotira menejerining xaritalangan fayl tizimi bilan ishlaydi. Bir faylni ikki marta o'qisangiz, ikkinchi o'qish odatda diskka tegmaydi — keshdan keladi. Kesh shuningdek yozishni buferlashtiradi: yozishlar to'planadi va vaqti-vaqti bilan yuboriladi." },
          ]).map((m, i) => (
            <div key={i} style={{ padding: "14px 18px", background: "rgba(0,255,156,0.03)", border: `1px solid ${m.color}22`, borderLeft: `3px solid ${m.color}`, borderRadius: 10 }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 6 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 14.5, fontWeight: 700, color: m.color }}>{m.name}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)", letterSpacing: 0.05 }}>{m.api}</div>
              </div>
              <div style={{ fontSize: 12.5, color: "var(--text-1)", lineHeight: 1.65 }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HAL */}
      <div style={{ marginTop: 16, padding: "22px 26px", background: "rgba(184,140,255,0.05)", border: "1px solid rgba(184,140,255,0.22)", borderRadius: 14, borderLeft: "4px solid var(--c-auth)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(184,140,255,0.12)", border: "1px solid rgba(184,140,255,0.3)", color: "var(--c-auth)", display: "grid", placeItems: "center" }}><Icon name="shield" size={18} /></div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 700, color: "var(--c-auth)" }}>HAL — Hardware Abstraction Layer</div>
            <div style={{ fontSize: 11, color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>hal.dll · loaded before ntoskrnl · ring 0</div>
          </div>
        </div>
        <P>{lang === "en"
          ? <>The HAL (<code>hal.dll</code>) is a thin wrapper between the kernel and the actual hardware. Without it, Windows would need completely different code for every motherboard chipset — an impossible maintenance nightmare. HAL exposes a <Em>standardized interface</Em>: the kernel calls <code>HalGetBusData()</code> or <code>HalSetBusData()</code> without knowing anything about the physical bus topology.</>
          : <>HAL (<code>hal.dll</code>) — kernel va haqiqiy hardware o'rtasidagi yupqa wrapper. U bo'lmasa, Windows har bir ona plata chipset uchun butunlay boshqa kod talab qilardi — bu imkonsiz texnik xizmat ko'rsatish dahshati. HAL <Em>standartlashtirilgan interfeys</Em> taqdim etadi: kernel fizik avtobus topologiyasini bilmasdan <code>HalGetBusData()</code> yoki <code>HalSetBusData()</code> ni chaqiradi.</>}</P>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
          {(lang === "en" ? [
            ["Interrupt routing", "Maps hardware IRQ lines to CPU interrupt vectors. Different chipsets wire IRQs differently — HAL hides this."],
            ["Timer calibration", "Reads the hardware clock (HPET, APIC timer, TSC) and provides a unified time source to the kernel scheduler."],
            ["Processor initialization", "Boots secondary CPU cores (APs) in SMP systems. Configures APIC and local interrupt controllers per core."],
            ["DMA channel management", "Allocates DMA channels for drivers so they can transfer data directly to/from RAM without CPU involvement."],
          ] : [
            ["Uzilishlarni yo'naltirish", "Hardware IRQ liniyalarini CPU uzilish vektorlariga xaritalaydi. Har xil chipsetslar IRQ larni boshqacha ulaydi — HAL buni yashiradi."],
            ["Taymer kalibrovkasi", "Hardware soatini o'qiydi (HPET, APIC taymer, TSC) va kernel rejalashtirgichiga yagona vaqt manbaini ta'minlaydi."],
            ["Protsessorni ishga tushirish", "SMP tizimlarida ikkinchi darajali CPU yadrolarini (AP) ishga tushiradi. Har bir yadro uchun APIC va lokal uzilish kontrollerlarini sozlaydi."],
            ["DMA kanali boshqaruvi", "CPU ishtirokisiz to'g'ridan-to'g'ri RAM ga/dan ma'lumot uzatish uchun drayverlar uchun DMA kanallarini ajratadi."],
          ]).map(([title, desc], i) => (
            <div key={i} style={{ padding: "10px 14px", background: "rgba(184,140,255,0.04)", border: "1px solid rgba(184,140,255,0.15)", borderRadius: 8 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--c-auth)", marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: 12, color: "var(--text-1)", lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>
        <Callout color="var(--c-auth)" icon="info" titleUz="Nima uchun Windows turli PC'larda ishlaydi?" titleEn="Why Windows runs on thousands of different PC models">
          {lang === "en"
            ? <>The same <code>ntoskrnl.exe</code> binary ships on every Windows PC. HAL handles all hardware differences transparently. When you install Windows on a laptop vs a server with 64 cores and NUMA memory, Windows loads a different <code>hal.dll</code> — the kernel code itself does not change. This is one of the key architectural decisions made by Dave Cutler's team in 1988 that still pays dividends today.</>
            : <>Bir xil <code>ntoskrnl.exe</code> ikkiligi har bir Windows PC ga yetkaziladi. HAL barcha hardware farqlarini shaffof tarzda boshqaradi. Windows'ni noutbukka yoki 64 yadroli va NUMA xotirali serverga o'rnatganingizda, Windows boshqa <code>hal.dll</code> yuklaydi — kernelning o'zi o'zgarmaydi. Bu 1988 yilda Dave Cutler jamoasi tomonidan qilingan va hali ham foyda keltirmoqda bo'lgan asosiy arxitektura qarorlaridan biridir.</>}
        </Callout>
      </div>
    </section>
  );
}

function SectionKernelDrivers() {
  const lang = useLang();
  return (
    <section id="kernel-drivers" style={{ scrollMarginTop: 80, marginBottom: 56 }}>
      <H2 num="03" uz="Drayverlar — Ring 0'dagi kod" en="Drivers — code living in ring 0" />
      <P>
        {lang === "en"
          ? <>A <Term>driver</Term> is a kernel-mode module (.sys file) that tells Windows exactly how to communicate with a specific piece of hardware or provide a specific system service. Unlike regular applications, drivers run entirely in <Em>ring 0</Em> — the same privilege level as <code>ntoskrnl.exe</code> itself. This gives them complete power over the machine, which is why even a minor bug in a driver can produce an instant BSOD, and why a malicious driver can do anything at all.</>
          : <>«<Term>Drayver</Term>» — Windows'ga ma'lum bir hardware bilan qanday muloqot qilishni yoki ma'lum bir tizim xizmatini qanday ko'rsatishni aniq aytadigan kernel-mode modul (.sys fayl). Oddiy ilovalardan farqli o'laroq, drayverlar to'liq <Em>ring 0</Em>'da — <code>ntoskrnl.exe</code> ning o'zi bilan bir xil imtiyoz darajasida — ishlaydi. Bu ularga mashina ustidan to'liq kuch beradi, shuning uchun drayverdagi kichik xato ham darhol BSOD ga olib kelishi va zararli drayver istalgan narsani qila olishi mumkin.</>}
      </P>

      <h3 style={{ ...subhead, marginTop: 28 }}>{lang === "en" ? "3.1 — Driver types" : "3.1 — Drayver turlari"}</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 12 }}>
        {(lang === "en" ? [
          { title: "Kernel-Mode Driver (KMDF)", color: "var(--c-system)", desc: "Runs in ring 0. Has full hardware access. Used for all hardware drivers: disk, NIC, GPU, USB. The most powerful and most dangerous type. Example: ntfs.sys, tcpip.sys." },
          { title: "User-Mode Driver (UMDF)", color: "var(--c-user)", desc: "Runs in ring 3. Talks to the kernel via a proxy driver. More stable — a crash kills only the driver process, not the OS. Used for USB devices, printers. Introduced in WDF (Windows Driver Framework)." },
          { title: "Filter Driver", color: "var(--c-warn)", desc: "Sits in the driver stack above or below the main driver. Intercepts and can modify I/O requests. Antivirus file system mini-filters work this way — they see every file open/read/write before NTFS does." },
        ] : [
          { title: "Kernel-Mode Drayveri (KMDF)", color: "var(--c-system)", desc: "Ring 0'da ishlaydi. To'liq hardware kirishiga ega. Barcha hardware drayverlari uchun ishlatiladi: disk, tarmoq kartasi, GPU, USB. Eng kuchli va eng xavfli tur. Misol: ntfs.sys, tcpip.sys." },
          { title: "User-Mode Drayveri (UMDF)", color: "var(--c-user)", desc: "Ring 3'da ishlaydi. Proxy drayver orqali kernel bilan gaplashadi. Barqarorroq — xato OS ni emas, faqat drayver jarayonini o'ldiradi. USB qurilmalar, printerlar uchun ishlatiladi. WDF (Windows Driver Framework) da joriy etilgan." },
          { title: "Filtr Drayveri", color: "var(--c-warn)", desc: "Drayver stekida asosiy drayverning ustida yoki ostida turadi. I/O so'rovlarini ushlab, o'zgartira oladi. Antivirus fayl tizimi mini-filtrlari shunday ishlaydi — ular NTFS gacha har bir fayl ochish/o'qish/yozishni ko'radi." },
        ]).map((d, i) => (
          <div key={i} style={{ padding: "14px 16px", background: "var(--bg-2)", border: `1px solid ${d.color}33`, borderTop: `3px solid ${d.color}`, borderRadius: 10 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 13.5, fontWeight: 700, color: d.color, marginBottom: 7 }}>{d.title}</div>
            <div style={{ fontSize: 12.5, color: "var(--text-1)", lineHeight: 1.6 }}>{d.desc}</div>
          </div>
        ))}
      </div>

      <h3 style={{ ...subhead, marginTop: 32 }}>{lang === "en" ? "3.2 — IRP: how the driver stack works" : "3.2 — IRP: drayver steki qanday ishlaydi"}</h3>
      <P>
        {lang === "en"
          ? <>Every I/O operation in Windows travels as an <Term>IRP (I/O Request Packet)</Term> — a kernel data structure that describes the operation (read, write, IOCTL), the target, the buffer, and its status. The I/O Manager creates an IRP and passes it down through a <Em>driver stack</Em> — a chain of drivers registered for that device. Each driver can complete the IRP, pass it further, or fail it.</>
          : <>Windows'dagi har bir I/O operatsiyasi <Term>IRP (I/O So'rov Paketi)</Term> sifatida harakatlanadi — operatsiyani (o'qish, yozish, IOCTL), maqsadni, buferni va uning holatini tavsiflovchi kernel ma'lumotlar tuzilmasi. I/O menejeri IRP yaratadi va uni o'sha qurilma uchun ro'yxatdan o'tgan drayverlar zanjiri bo'lmish <Em>drayver steki</Em> orqali pastga uzatadi. Har bir drayver IRP ni tugatishi, keyingiga uzatishi yoki muvaffaqiyatsiz yakunlashi mumkin.</>}
      </P>
      <div style={{ marginTop: 16, padding: "18px 22px", background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 12 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>// {lang === "en" ? "DRIVER STACK FOR READING A FILE" : "FAYL O'QISH UCHUN DRAYVER STEKI"}</div>
        {[
          { label: lang === "en" ? "User app calls ReadFile()" : "Foydalanuvchi ilovasi ReadFile() ni chaqiradi", color: "var(--c-user)", ring: "ring 3" },
          { label: lang === "en" ? "I/O Manager creates IRP, passes down" : "I/O menejeri IRP yaratadi, pastga uzatadi", color: "var(--c-system)", ring: "ring 0" },
          { label: lang === "en" ? "File system filter (antivirus mini-filter) — inspects IRP" : "Fayl tizimi filtri (antivirus mini-filtri) — IRP ni tekshiradi", color: "var(--c-warn)", ring: "ring 0" },
          { label: lang === "en" ? "NTFS driver — translates path to clusters" : "NTFS drayveri — yo'lni klasterlarga tarjima qiladi", color: "var(--accent)", ring: "ring 0" },
          { label: lang === "en" ? "Disk class driver — translates clusters to LBA sectors" : "Disk sinf drayveri — klasterlarni LBA sektorlarga tarjima qiladi", color: "var(--accent)", ring: "ring 0" },
          { label: lang === "en" ? "NVMe/AHCI port driver — sends command to hardware" : "NVMe/AHCI port drayveri — hardware'ga buyruq yuboradi", color: "var(--c-auth)", ring: "ring 0" },
          { label: lang === "en" ? "SSD/HDD returns data — IRP travels back up" : "SSD/HDD ma'lumotlarni qaytaradi — IRP yuqoriga qaytadi", color: "var(--c-auth)", ring: "hw" },
        ].map((row, i, arr) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "stretch" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 36, flexShrink: 0 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: row.color, flexShrink: 0, marginTop: 6 }} />
              {i < arr.length - 1 && <div style={{ width: 2, flex: 1, background: `${row.color}44`, minHeight: 12 }} />}
            </div>
            <div style={{ paddingBottom: i < arr.length - 1 ? 12 : 0, flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, color: "var(--text-0)" }}>{row.label}</span>
                <span style={{ fontSize: 9.5, fontFamily: "var(--font-mono)", color: row.color, background: row.color + "15", padding: "1px 6px", borderRadius: 4 }}>{row.ring}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h3 style={{ ...subhead, marginTop: 32 }}>{lang === "en" ? "3.3 — Signing, BYOVD and kernel security" : "3.3 — Imzolash, BYOVD va kernel xavfsizligi"}</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
        <div style={{ padding: "16px 18px", background: "rgba(0,255,156,0.04)", border: "1px solid var(--accent-border)", borderRadius: 12 }}>
          <div style={{ color: "var(--accent)", marginBottom: 8, display: "flex", gap: 8, alignItems: "center" }}>
            <Icon name="check" size={16} />
            <span style={{ fontWeight: 600, fontSize: 14 }}>{lang === "en" ? "Signed driver" : "Imzolangan drayver"}</span>
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: "var(--text-1)", lineHeight: 1.75 }}>
            {(lang === "en" ? [
              "Signed with EV (Extended Validation) code signing cert",
              "Microsoft cross-signs it for kernel use (WHQL or attestation)",
              "Signature verified by CI.dll at load time",
              "Any modification → load refused → BSOD on attempt",
              "Extension: .sys · Lives in System32\\drivers\\",
            ] : [
              "EV (Kengaytirilgan Tasdiqlash) kod imzolash sertifikati bilan imzolangan",
              "Microsoft uni kernel ishlatish uchun qayta imzolaydi (WHQL yoki tasdiqlov)",
              "Imzo yuklanish vaqtida CI.dll tomonidan tekshiriladi",
              "Har qanday o'zgartirish → yuklanishdan bosh tortish → urinishda BSOD",
              "Kengaytma: .sys · System32\\drivers\\ da joylashgan",
            ]).map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
        <div style={{ padding: "16px 18px", background: "rgba(255,58,94,0.05)", border: "1px solid rgba(255,58,94,0.25)", borderRadius: 12 }}>
          <div style={{ color: "var(--c-attack)", marginBottom: 8, display: "flex", gap: 8, alignItems: "center" }}>
            <Icon name="warning" size={16} />
            <span style={{ fontWeight: 600, fontSize: 14 }}>{lang === "en" ? "BYOVD Attack" : "BYOVD Hujumi"}</span>
          </div>
          <div style={{ fontSize: 12.5, color: "var(--text-1)", lineHeight: 1.65 }}>
            {lang === "en"
              ? <><strong>Bring Your Own Vulnerable Driver:</strong> Attacker uploads a <em>legitimate, signed</em> driver (e.g. old Gigabyte or ASUS firmware updater) that has a known memory corruption vulnerability. Because it's signed, Windows loads it. The attacker exploits the bug to write shellcode to an arbitrary kernel address — instant ring 0 code execution. Defence: <code>loldrivers.io</code> lists known vulnerable drivers. Block them via WDAC policy.</>
              : <><strong>Bring Your Own Vulnerable Driver:</strong> Hujumchi ma'lum xotira buzilish zaifligiga ega <em>qonuniy, imzolangan</em> drayverni (masalan, eski Gigabyte yoki ASUS firmware yangilagich) yuklaydi. U imzolanganligi sababli Windows uni yuklaydi. Hujumchi xatolikni ekspluatatsiya qilib, ixtiyoriy kernel manziliga shellcode yozadi — darhol ring 0 kod bajarish. Himoya: <code>loldrivers.io</code> ma'lum zaif drayverlar ro'yxatini e'lon qiladi. Ularni WDAC siyosati orqali bloklang.</>}
          </div>
        </div>
      </div>
      <Callout color="var(--c-attack)" icon="skull" titleUz="Real dunyo misoli: BlackByte ransomware BYOVD" titleEn="Real world: BlackByte ransomware BYOVD">
        {lang === "en"
          ? <>In 2022, the BlackByte ransomware gang used a vulnerable <code>RTCore64.sys</code> driver (from MSI Afterburner, a legitimate GPU overclocking tool) to disable EDR products before encrypting files. The driver was legitimately signed by Micro-Star International. Once loaded, BlackByte used the driver's arbitrary memory read/write primitive to kill antivirus processes from ring 0 — where no EDR hook could intercept them. This is exactly why BYOVD is one of the most powerful techniques available to attackers today.</>
          : <>2022 yilda BlackByte ransomware to'dasi fayllarga shifrlashdan oldin EDR mahsulotlarini o'chirish uchun zaif <code>RTCore64.sys</code> drayveri (qonuniy GPU overclocking vositasi MSI Afterburner'dan) dan foydalandi. Drayver Micro-Star International tomonidan qonuniy imzolangan edi. Yuklanganidan keyin BlackByte ring 0'dan — hech bir EDR hook'i ularni ushlay olmaydigan joydan — antivirus jarayonlarini o'ldirish uchun drayverning ixtiyoriy xotiraga o'qish/yozish primitividaridan foydalandi. Aynan shuning uchun BYOVD bugungi kunda hujumchilar uchun mavjud bo'lgan eng kuchli texnikalardan biridir.</>}
      </Callout>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// L03: User mode vs Kernel mode
// ─────────────────────────────────────────────────────────────
function SectionRings() {
  const lang = useLang();
  return (
    <section id="rings" style={{ scrollMarginTop: 80, marginBottom: 56 }}>
      <H2 num="01" uz="CPU Privilege Halqalari" en="CPU Privilege Rings" />
      <P>
        {lang === "en"
          ? <>Modern processors don't just execute code — they enforce <Term>privilege levels</Term> at the hardware level. The x86/x64 CPU architecture defines 4 rings (0 through 3), where ring 0 is the most privileged and ring 3 is the least. Windows only uses two: <Em>ring 0 (kernel mode)</Em> and <Em>ring 3 (user mode)</Em>. Rings 1 and 2 were intended for OS services like drivers in the original Intel design but were never adopted in practice — Windows moved drivers into ring 0 for performance reasons.</>
          : <>Zamonaviy protsessorlar faqat kod bajarmasdan, <Term>imtiyoz darajalarini</Term> hardware darajasida ham ta'minlaydi. x86/x64 CPU arxitekturasi 4 ta halqani (0 dan 3 gacha) belgilaydi: ring 0 — eng imtiyozli, ring 3 — eng kam imtiyozli. Windows faqat ikkitasidan foydalanadi: <Em>ring 0 (kernel mode)</Em> va <Em>ring 3 (user mode)</Em>. Ring 1 va 2 dastlabki Intel dizaynida OS xizmatlari va drayverlar uchun mo'ljallangan, lekin amalda hech qachon qabul qilinmagan — Windows drayverlarni ishlash tezligi sabab ring 0 ga ko'chirdi.</>}
      </P>

      {/* Visual ring diagram */}
      <div style={{ margin: "28px auto", maxWidth: 400, position: "relative", textAlign: "center" }}>
        <div style={{ position: "relative", display: "inline-block", width: 340, height: 340 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(255,145,69,0.45)", background: "rgba(255,145,69,0.04)" }}>
            <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--c-user)", letterSpacing: 0.1, whiteSpace: "nowrap" }}>ring 3 · User mode · CPL=3</div>
            <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", fontSize: 10, fontFamily: "var(--font-mono)", color: "rgba(255,145,69,0.6)", whiteSpace: "nowrap" }}>Chrome · Notepad · cmd.exe · Python</div>
          </div>
          <div style={{ position: "absolute", inset: 44, borderRadius: "50%", border: "1px dashed rgba(100,100,120,0.3)", background: "rgba(100,100,120,0.02)" }}>
            <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", fontSize: 9.5, fontFamily: "var(--font-mono)", color: "var(--text-3)", whiteSpace: "nowrap" }}>ring 1 & 2 · unused in Windows</div>
          </div>
          <div style={{ position: "absolute", inset: 96, borderRadius: "50%", border: "2px solid rgba(77,139,255,0.65)", background: "rgba(77,139,255,0.09)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--c-system)", letterSpacing: 0.1 }}>ring 0 · CPL=0</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--c-system)", marginTop: 3 }}>Kernel mode</div>
              <div style={{ fontSize: 10, color: "var(--text-2)", marginTop: 3 }}>ntoskrnl.exe · hal.dll</div>
              <div style={{ fontSize: 9.5, color: "var(--text-3)", marginTop: 2 }}>drivers (.sys)</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ padding: "18px 20px", background: "rgba(255,145,69,0.06)", border: "1px solid rgba(255,145,69,0.25)", borderRadius: 12 }}>
          <div className="mono" style={{ fontSize: 10, color: "var(--c-user)", marginBottom: 10, letterSpacing: 0.1 }}>RING 3 · USER MODE · CPL=3</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "var(--text-1)", lineHeight: 1.75 }}>
            {(lang === "en" ? [
              "Cannot access hardware I/O ports directly",
              "Cannot read or write another process's memory",
              "Cannot execute privileged CPU instructions",
              "Cannot modify CPU control registers (CR0, CR3...)",
              "Cannot load/modify the interrupt table (LIDT)",
              "App crash → only that process dies (Access Violation)",
              "Each process lives in its own virtual address space",
            ] : [
              "Hardware I/O portlariga to'g'ridan-to'g'ri kira olmaydi",
              "Boshqa jarayonning xotirasini o'qib yoki yoza olmaydi",
              "Imtiyozli CPU buyruqlarini bajara olmaydi",
              "CPU nazorat registrlarini (CR0, CR3...) o'zgartira olmaydi",
              "Uzilish jadvalini (LIDT) yuklab/o'zgartira olmaydi",
              "Ilova xatosi → faqat o'sha jarayon o'ladi (Access Violation)",
              "Har bir jarayon o'z virtual manzil maydonida yashaydi",
            ]).map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
        <div style={{ padding: "18px 20px", background: "rgba(77,139,255,0.06)", border: "1px solid rgba(77,139,255,0.25)", borderRadius: 12 }}>
          <div className="mono" style={{ fontSize: 10, color: "var(--c-system)", marginBottom: 10, letterSpacing: 0.1 }}>RING 0 · KERNEL MODE · CPL=0</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "var(--text-1)", lineHeight: 1.75 }}>
            {(lang === "en" ? [
              "Direct access to all hardware I/O ports",
              "Can read/write any memory address in the system",
              "All CPU instructions available without restriction",
              "Can modify CR0 (enable/disable paging), CR3 (page table base)",
              "Can load the GDT, IDT, LDT — restructure CPU entirely",
              "Crash here = BSOD (Blue Screen), entire machine halts",
              "Kernel's memory is mapped into every process's address space",
            ] : [
              "Barcha hardware I/O portlariga to'g'ridan-to'g'ri kirish",
              "Tizimdagi istalgan xotira manziliga o'qish/yozish",
              "Barcha CPU buyruqlari cheklovsiz mavjud",
              "CR0 (sahifani yoqish/o'chirish), CR3 (sahifa jadvali) ni o'zgartirish",
              "GDT, IDT, LDT ni yuklash — CPU'ni to'liq qayta tuzish",
              "Bu yerda xato = BSOD (Ko'k ekran), butun mashina to'xtaydi",
              "Kernelning xotirasi har bir jarayonning manzil maydoniga ko'chirilgan",
            ]).map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
      </div>

      {/* CPL mechanism — HOW the CPU enforces it */}
      <div style={{ marginTop: 40, marginBottom: 8 }}>
        <h3 style={subhead}>{lang === "en" ? "1.1 — CPL: How the CPU actually enforces the boundary" : "1.1 — CPL: Protsessor chegarani qanday ta'minlaydi"}</h3>
      </div>
      <P>
        {lang === "en"
          ? <>This is not software enforcement — it is baked into the silicon. Every time the CPU fetches an instruction, it checks the <Term>Current Privilege Level (CPL)</Term>. The CPL is stored in bits 0–1 of the <code>CS</code> (Code Segment) register. <code>CS = 0x0008</code> → bits 0–1 are <code>00</code> → CPL=0 (kernel). <code>CS = 0x0033</code> → bits 0–1 are <code>11</code> → CPL=3 (user). The CPU reads this on every instruction fetch and enforces privilege automatically — no software needed.</>
          : <>Bu dasturiy ta'minot tomonidan emas, balki silicon'ning o'zida amalga oshiriladi. CPU har bir buyruqni olishda <Term>Joriy Imtiyoz Darajasini (CPL)</Term> tekshiradi. CPL <code>CS</code> (Code Segment) registrining 0–1 bitlarida saqlanadi. <code>CS = 0x0008</code> → bitlar 0–1 = <code>00</code> → CPL=0 (kernel). <code>CS = 0x0033</code> → bitlar 0–1 = <code>11</code> → CPL=3 (foydalanuvchi). CPU har bir buyruq olishda buni o'qiydi va imtiyozni avtomatik ta'minlaydi — hech qanday dasturiy ta'minot kerak emas.</>}
      </P>

      <div style={{ marginTop: 18, padding: "20px 24px", background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 14 }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>// {lang === "en" ? "CPL IN THE CS REGISTER" : "CS REGISTRIDAGI CPL"}</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, lineHeight: 2, color: "var(--text-1)" }}>
          <div><span style={{ color: "var(--c-system)" }}>CS = 0x0008</span>  <span style={{ color: "var(--text-3)" }}>→</span>  <span style={{ color: "var(--text-2)" }}>binary: </span><span style={{ color: "var(--accent)" }}>0000 0000 0000 10</span><span style={{ color: "var(--c-system)", fontWeight: 700 }}>00</span>  <span style={{ color: "var(--text-3)" }}>→</span>  <span style={{ color: "var(--c-system)" }}>CPL=0 (kernel mode)</span></div>
          <div><span style={{ color: "var(--c-user)" }}>CS = 0x0033</span>  <span style={{ color: "var(--text-3)" }}>→</span>  <span style={{ color: "var(--text-2)" }}>binary: </span><span style={{ color: "var(--accent)" }}>0000 0000 0011 00</span><span style={{ color: "var(--c-user)", fontWeight: 700 }}>11</span>  <span style={{ color: "var(--text-3)" }}>→</span>  <span style={{ color: "var(--c-user)" }}>CPL=3 (user mode)</span></div>
        </div>
        <div style={{ marginTop: 10, fontSize: 12, color: "var(--text-2)", lineHeight: 1.6 }}>
          {lang === "en"
            ? "The CPU reads the last 2 bits of CS on every instruction. No instruction in ring 3 can set CS.CPL=0 directly — that's the whole point."
            : "CPU har bir buyruqda CS ning oxirgi 2 bitini o'qiydi. Ring 3'dagi hech bir buyruq CS.CPL=0 ni to'g'ridan-to'g'ri o'rnata olmaydi — asosiy nuqta aynan shu."}
        </div>
      </div>

      <h3 style={{ ...subhead, marginTop: 36 }}>{lang === "en" ? "1.2 — Privileged instructions and what happens when ring 3 tries to use them" : "1.2 — Imtiyozli buyruqlar va ring 3 ularni ishlatmoqchi bo'lsa nima bo'ladi"}</h3>
      <P>
        {lang === "en"
          ? <>Some CPU instructions are <Em>only allowed when CPL=0</Em>. If ring 3 code tries to execute one, the CPU immediately raises a <Term>General Protection Fault (#GP, exception 13)</Term>. Windows catches this exception via its Interrupt Descriptor Table (IDT) handler, and then terminates the offending process with an <Em>Access Violation</Em> (0xC0000005). The rest of the system keeps running unaffected.</>
          : <>Ba'zi CPU buyruqlari faqat CPL=0 bo'lganda ruxsat etiladi. Ring 3 kodi ulardan birini bajarmoqchi bo'lsa, CPU darhol <Term>Umumiy Himoya Xatosi (#GP, istisno 13)</Term> ni beradi. Windows buni Interrupt Descriptor Table (IDT) ishlovchisi orqali ushlab, xato qilgan jarayonni <Em>Access Violation</Em> (0xC0000005) bilan tugatadi. Tizimning qolgan qismi ta'sirlanmagan holda ishlashda davom etadi.</>}
      </P>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginTop: 16 }}>
        {(lang === "en" ? [
          { inst: "HLT", desc: "Halt the processor — stops all execution until next interrupt. Only the OS scheduler should call this (on idle)." },
          { inst: "LGDT / LIDT", desc: "Load the Global/Interrupt Descriptor Table — defines memory segments and all interrupt handlers. Writable only by the kernel." },
          { inst: "MOV CR0–CR4", desc: "Modify CPU control registers: CR0 enables paging, CR3 points to the page table, CR4 enables features like SMEP/SMAP." },
          { inst: "WRMSR / RDMSR", desc: "Write/Read Model-Specific Registers — configure CPU features like SYSCALL entry point (LSTAR MSR), performance counters, etc." },
          { inst: "IN / OUT", desc: "Direct I/O port access — talk to hardware (keyboard controller, PCI bus, etc.) without going through the driver model." },
          { inst: "CLI / STI", desc: "Clear/Set the Interrupt Flag — disable or enable hardware interrupts globally. Misuse freezes the entire machine." },
        ] : [
          { inst: "HLT", desc: "Protsessorni to'xtatish — keyingi uzilishgacha barcha bajarishni to'xtatadi. Faqat OS rejalashtirgichi (bo'sh paytda) chaqirishi kerak." },
          { inst: "LGDT / LIDT", desc: "Global/Interrupt Descriptor Jadvalini yuklash — xotira segmentlari va barcha uzilish ishlovchilarini belgilaydi. Faqat kernel yoza oladi." },
          { inst: "MOV CR0–CR4", desc: "CPU nazorat registrlarini o'zgartirish: CR0 sahifani yoqadi, CR3 sahifa jadvaliga ishora qiladi, CR4 SMEP/SMAP kabi xususiyatlarni yoqadi." },
          { inst: "WRMSR / RDMSR", desc: "Modelga xos registrlarni yozish/o'qish — SYSCALL kirish nuqtasi (LSTAR MSR), ishlash o'lchovlari kabi CPU xususiyatlarini sozlash." },
          { inst: "IN / OUT", desc: "To'g'ridan-to'g'ri I/O port kirishini — drayver modeli orqali o'tmasdan hardware bilan gaplashish (klaviatura kontrolleri, PCI avtobus va h.k.)." },
          { inst: "CLI / STI", desc: "Uzilish bayrog'ini tozalash/o'rnatish — hardware uzilishlarini butun tizim darajasida o'chirish yoki yoqish. Noto'g'ri foydalanish mashinani muzlatadi." },
        ]).map((r, i) => (
          <div key={i} style={{ padding: "12px 16px", background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 10, borderLeft: "3px solid var(--c-system)" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--c-system)", fontWeight: 700, marginBottom: 5 }}>{r.inst}</div>
            <div style={{ fontSize: 12.5, color: "var(--text-1)", lineHeight: 1.55 }}>{r.desc}</div>
          </div>
        ))}
      </div>

      <h3 style={{ ...subhead, marginTop: 36 }}>{lang === "en" ? "1.3 — What happens step by step when ring 3 breaks the rule" : "1.3 — Ring 3 qoidani buzganda nima sodir bo'ladi — bosqichma-bosqich"}</h3>

      <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
        {(lang === "en" ? [
          { n: "1", color: "var(--c-user)", title: "Ring 3 code executes privileged instruction", desc: "e.g. a Python script calls HLT or tries to write to CR3. The CPU starts the instruction..." },
          { n: "2", color: "var(--c-attack)", title: "CPU hardware checks CPL", desc: "Before completing the instruction, the CPU compares CPL (=3) against the required privilege level (=0). Mismatch detected." },
          { n: "3", color: "var(--c-attack)", title: "#GP fault triggered (exception 13)", desc: "The CPU immediately stops and raises a General Protection Fault. No instruction is executed. Control transfers to the OS's IDT handler." },
          { n: "4", color: "var(--c-warn)", title: "Windows exception handler catches #GP", desc: "ntoskrnl's IDT entry for exception 13 runs in ring 0. It identifies the faulting process and prepares to terminate it." },
          { n: "5", color: "var(--accent)", title: "Process terminated with Access Violation", desc: "The offending process receives EXCEPTION_ACCESS_VIOLATION (0xC0000005) and dies. The rest of the OS keeps running — that's the whole point of the boundary." },
        ] : [
          { n: "1", color: "var(--c-user)", title: "Ring 3 kodi imtiyozli buyruqni bajarmoqchi", desc: "Masalan, Python skript HLT ni chaqiradi yoki CR3 ga yozishga harakat qiladi. CPU buyruqni boshlamoqda..." },
          { n: "2", color: "var(--c-attack)", title: "CPU hardware CPL ni tekshiradi", desc: "Buyruqni tugatishdan oldin CPU CPL (=3) ni talab qilingan imtiyoz darajasi (=0) bilan solishtiradi. Nomuvofiqlik aniqlandi." },
          { n: "3", color: "var(--c-attack)", title: "#GP xatosi ishga tushadi (istisno 13)", desc: "CPU darhol to'xtatadi va Umumiy Himoya Xatosini beradi. Hech bir buyruq bajarilmaydi. Boshqaruv OS'ning IDT ishlovchisiga o'tadi." },
          { n: "4", color: "var(--c-warn)", title: "Windows istisno ishlovchisi #GP ni ushlaydi", desc: "ntoskrnl'ning 13-istisno uchun IDT yozuvi ring 0'da ishlaydi. U xato qilgan jarayonni aniqlaydi va tugatishga tayyorlanadi." },
          { n: "5", color: "var(--accent)", title: "Jarayon Access Violation bilan tugatiladi", desc: "Xato qilgan jarayon EXCEPTION_ACCESS_VIOLATION (0xC0000005) oladi va o'ladi. OS ning qolgan qismi ishlashda davom etadi — chegaraning butun mohiyati shu." },
        ]).map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: s.color + "18", border: `1.5px solid ${s.color}`, color: s.color, display: "grid", placeItems: "center", flexShrink: 0, fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 12 }}>{s.n}</div>
            <div style={{ paddingTop: 4, paddingBottom: 14, borderBottom: i < 4 ? "1px solid var(--border)" : "none", flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-0)", marginBottom: 3 }}>{s.title}</div>
              <div style={{ fontSize: 12.5, color: "var(--text-2)", lineHeight: 1.55 }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <Callout color="var(--c-warn)" icon="warning" titleUz="Nima uchun bu chegara zarur?" titleEn="Why does this boundary exist?">
        {lang === "en"
          ? <>Imagine if every app had full hardware access. A single buggy Chrome tab could execute <code>HLT</code> and freeze your CPU, or write to CR3 and corrupt the entire page table — crashing every process on the machine at once. The ring boundary, enforced in silicon, guarantees that no matter how broken or malicious an app is, it <Em>cannot</Em> directly harm the kernel or other processes. It can only harm itself.</>
          : <>Tasavvur qiling, har bir ilova to'liq hardware kirishiga ega bo'lsa. Bitta noto'g'ri Chrome yorlig'i <code>HLT</code> ni bajarib CPU'ni muzlatishi, yoki CR3 ga yozib butun sahifa jadvalini buzishi — shu bilan mashinalardagi barcha jarayonni bir vaqtda yiqitishi mumkin edi. Silicon'da amalga oshirilgan halqa chegarasi kafolatlaydi: ilova qanchalik buzilgan yoki zararli bo'lmasin, u kernelga yoki boshqa jarayonlarga <Em>to'g'ridan-to'g'ri</Em> zarar yetkazolmaydi. U faqat o'ziga zarar yetkazishi mumkin.</>}
      </Callout>
    </section>
  );
}

function SectionSyscallBrief() {
  const lang = useLang();
  return (
    <section id="syscall-brief" style={{ scrollMarginTop: 80, marginBottom: 56 }}>
      <H2 num="03" uz="Chegarani qonuniy kesib o'tish: SYSCALL mexanizmi" en="Legally crossing the boundary: the SYSCALL mechanism" />
      <P>
        {lang === "en"
          ? <>A user-mode app can never jump into kernel mode by itself — that would require changing CPL, which only the CPU hardware can do. The <Em>only</Em> legal trigger is the <Term>SYSCALL</Term> instruction (64-bit) or <Term>SYSENTER</Term> (32-bit). When executed, the CPU performs a precisely defined hardware sequence — not software, the actual silicon — in a single atomic step.</>
          : <>User mode'dagi ilova mustaqil ravishda kernel mode'ga sakray olmaydi — bu CPL ni o'zgartirishni talab qiladi, buni esa faqat CPU hardware'i qila oladi. Yagona qonuniy trigger — <Term>SYSCALL</Term> buyrug'i (64-bit) yoki <Term>SYSENTER</Term> (32-bit). Bajarilganda, CPU aniq belgilangan hardware ketma-ketligini amalga oshiradi — dasturiy ta'minot emas, haqiqiy silicon — bitta atomik qadamda.</>}
      </P>

      <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 10 }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>// {lang === "en" ? "WHAT THE CPU DOES WHEN SYSCALL EXECUTES" : "SYSCALL BAJARILGANDA CPU NIMA QILADI"}</div>
        {(lang === "en" ? [
          { n: "1", color: "var(--c-user)", title: "Save user-mode state (RIP, RSP, RFLAGS)", desc: <>The CPU saves the current instruction pointer (<code>RIP</code>), stack pointer (<code>RSP</code>), and flags register (<code>RFLAGS</code>) into CPU registers (<code>RCX</code>, <code>R11</code>). This is where execution will resume when we return to ring 3.</> },
          { n: "2", color: "var(--c-warn)", title: "Switch CPL: 3 → 0 (the only legal way)", desc: <>The CPU sets <code>CS.CPL = 0</code>, loading the kernel CS selector (<code>0x0010</code>). This is the moment privilege changes. No user-mode code can do this — only the SYSCALL instruction triggers this hardware behavior.</> },
          { n: "3", color: "var(--c-warn)", title: "Switch to kernel stack", desc: <>The CPU loads a new stack pointer from the <code>TSS (Task State Segment)</code> — a kernel stack, not the user stack. This is critical for security: the kernel must never trust the user's stack.</> },
          { n: "4", color: "var(--c-system)", title: "Jump to kernel entry point (LSTAR MSR)", desc: <>The CPU loads <code>RIP</code> from the <code>LSTAR</code> Model-Specific Register, which Windows sets at boot to point to <code>KiSystemCall64</code> inside ntoskrnl.exe. This is the entry point for all system calls.</> },
          { n: "5", color: "var(--c-system)", title: "Kernel reads syscall number, dispatches", desc: <>The <code>EAX</code> register contains the <Em>syscall number</Em> (e.g. 0x0018 = NtReadFile). The kernel looks it up in the <Term>SSDT (System Service Descriptor Table)</Term> and calls the corresponding function.</> },
          { n: "6", color: "var(--accent)", title: "SYSRET: return to ring 3", desc: <>When done, the kernel executes <code>SYSRET</code>. The CPU restores <code>RIP</code>, <code>RSP</code>, <code>RFLAGS</code> from the saved values, sets <code>CS.CPL = 3</code>, and resumes the user-mode code exactly where it stopped.</> },
        ] : [
          { n: "1", color: "var(--c-user)", title: "User mode holatini saqlash (RIP, RSP, RFLAGS)", desc: <>CPU joriy ko'rsatma ko'rsatkichini (<code>RIP</code>), stek ko'rsatkichini (<code>RSP</code>) va bayroqlar registrini (<code>RFLAGS</code>) CPU registrlarida saqlaydi (<code>RCX</code>, <code>R11</code>). Ring 3 ga qaytganda bajarish shu yerdan davom etadi.</> },
          { n: "2", color: "var(--c-warn)", title: "CPL almashtirish: 3 → 0 (yagona qonuniy yo'l)", desc: <>CPU <code>CS.CPL = 0</code> o'rnatadi, kernel CS selektorini (<code>0x0010</code>) yuklaydi. Bu imtiyoz o'zgaradigan lahza. Hech bir user-mode kodi buni qila olmaydi — faqat SYSCALL buyrug'i bu hardware xatti-harakatini ishga tushiradi.</> },
          { n: "3", color: "var(--c-warn)", title: "Kernel stekiga o'tish", desc: <>CPU yangi stek ko'rsatkichini <code>TSS (Task State Segment)</code> dan yuklaydi — user steki emas, kernel steki. Bu xavfsizlik uchun muhim: kernel foydalanuvchi stekiga hech qachon ishonmasligi kerak.</> },
          { n: "4", color: "var(--c-system)", title: "Kernel kirish nuqtasiga o'tish (LSTAR MSR)", desc: <>CPU <code>RIP</code> ni <code>LSTAR</code> Model-Specific Registridan yuklaydi — Windows uni boot vaqtida ntoskrnl.exe ichidagi <code>KiSystemCall64</code> ga ishora qilib o'rnatadi. Bu barcha tizim chaqiruvlari uchun kirish nuqtasi.</> },
          { n: "5", color: "var(--c-system)", title: "Kernel syscall raqamini o'qiydi va yo'naltiradi", desc: <><code>EAX</code> registri <Em>syscall raqamini</Em> o'z ichiga oladi (masalan 0x0018 = NtReadFile). Kernel uni <Term>SSDT (Tizim Xizmat Tasviri Jadvali)</Term> dan qidirib, mos funksiyani chaqiradi.</> },
          { n: "6", color: "var(--accent)", title: "SYSRET: ring 3 ga qaytish", desc: <>Tugatgach, kernel <code>SYSRET</code> ni bajaradi. CPU saqlangan qiymatlardan <code>RIP</code>, <code>RSP</code>, <code>RFLAGS</code> ni tiklaydi, <code>CS.CPL = 3</code> o'rnatadi va user-mode kodini to'xtatilgan joydan davom ettiradi.</> },
        ]).map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: s.color + "18", border: `1.5px solid ${s.color}`, color: s.color, display: "grid", placeItems: "center", fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 12 }}>{s.n}</div>
              {i < 5 && <div style={{ width: 2, flex: 1, minHeight: 14, background: `linear-gradient(180deg, ${s.color}66, transparent)`, marginTop: 3 }} />}
            </div>
            <div style={{ paddingBottom: 16, flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-0)", marginBottom: 3 }}>{s.title}</div>
              <div style={{ fontSize: 12.5, color: "var(--text-2)", lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, padding: "18px 22px", background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 14 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>// {lang === "en" ? "SYSCALL NUMBER TABLE (partial)" : "SYSCALL RAQAMLARI JADVALI (qisqacha)"}</div>
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr", gap: "6px 20px", fontFamily: "var(--font-mono)", fontSize: 12 }}>
          {[
            ["0x0004", "NtWriteFile", "Faylga yozish"],
            ["0x000F", "NtClose", "Handle'ni yopish"],
            ["0x0018", "NtReadFile", "Fayldan o'qish"],
            ["0x0023", "NtOpenFile", "Faylni ochish"],
            ["0x0039", "NtCreateProcess", "Jarayon yaratish"],
            ["0x0055", "NtAllocateVirtualMemory", "Virtual xotira ajratish"],
          ].map(([num, en, uz], i) => (
            <React.Fragment key={i}>
              <span style={{ color: "var(--c-warn)" }}>{num}</span>
              <span style={{ color: "var(--accent)" }}>{en}</span>
              <span style={{ color: "var(--text-2)" }}>{lang === "en" ? en.replace("Nt","").replace(/([A-Z])/g," $1").trim() : uz}</span>
            </React.Fragment>
          ))}
        </div>
        <div style={{ marginTop: 12, fontSize: 12, color: "var(--text-3)", lineHeight: 1.6 }}>
          {lang === "en"
            ? "Windows has ~450 syscalls total. Every privileged action your app performs — opening a file, creating a process, allocating memory — goes through one of these numbers."
            : "Windows jami ~450 ta syscallga ega. Ilovangiz bajaradigan har bir imtiyozli amal — fayl ochish, jarayon yaratish, xotira ajratish — shu raqamlardan biri orqali o'tadi."}
        </div>
      </div>

      <Callout color="var(--c-attack)" icon="skull" titleUz="Xavfsizlik: to'g'ridan-to'g'ri syscall va EDR chetlab o'tish" titleEn="Security: direct syscalls and EDR bypass">
        {lang === "en"
          ? <>Security tools (EDR, antivirus) detect malware by placing <Em>hooks</Em> inside <code>ntdll.dll</code> — they overwrite the first few bytes of functions like <code>NtReadFile</code> with a jump to their own monitoring code. Advanced malware bypasses this by:<br/>1. Finding the syscall number for the target function directly (by scanning ntdll in memory or hardcoding it)<br/>2. Loading that number into <code>EAX</code><br/>3. Calling the <code>syscall</code> instruction directly — skipping the hooked ntdll function entirely<br/>This is called <strong>direct syscalls</strong> (or <strong>Hell's Gate / Halo's Gate</strong> in advanced implementations). The EDR never sees the call because it only monitors ntdll, not the raw syscall gate.</>
          : <>Xavfsizlik tizimlari (EDR, antivirus) malware'ni <code>ntdll.dll</code> ichiga <Em>hook</Em> joylashtirish orqali aniqlaydi — ular <code>NtReadFile</code> kabi funksiyalarning birinchi bir necha baytini o'z monitoring kodiga sakrash bilan almashtiradi. Rivojlangan malware buni chetlab o'tadi:<br/>1. Maqsad funksiya uchun syscall raqamini to'g'ridan-to'g'ri topib (ntdll'ni xotirada skanerlash yoki hardcode qilish orqali)<br/>2. Shu raqamni <code>EAX</code> ga yuklaydi<br/>3. <code>syscall</code> buyrug'ini to'g'ridan-to'g'ri chaqiradi — ushlangan ntdll funksiyasini butunlay o'tkazib yuboradi<br/>Bu <strong>to'g'ridan-to'g'ri syscall</strong> (yoki murakkab implementatsiyalarda <strong>Hell's Gate / Halo's Gate</strong>) deyiladi. EDR bu chaqiruvni hech qachon ko'rmaydi, chunki u faqat ntdll'ni kuzatadi, xom syscall gate'ni emas.</>}
      </Callout>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// L05: BIOS vs UEFI
// ─────────────────────────────────────────────────────────────
function SectionBiosUefi() {
  const lang = useLang();

  const compRows = [
    {
      aspect: lang === "en" ? "Architecture" : "Arxitektura",
      bios: lang === "en" ? "16-bit x86 real mode. Runs from ROM chip. Max 1 MB addressable memory." : "16-bit x86 real mode. ROM chipidan ishlaydi. Maksimal 1 MB manzillanuvchi xotira.",
      uefi: lang === "en" ? "32/64-bit protected/long mode. Runs from SPI flash. Full memory access, own C-based drivers (DXE)." : "32/64-bit himoyalangan/uzun rejim. SPI flashdan ishlaydi. To'liq xotiraga kirish, o'z C-asosidagi drayverlar (DXE).",
    },
    {
      aspect: lang === "en" ? "Boot target" : "Yuklash maqsadi",
      bios: lang === "en" ? "MBR (Master Boot Record) — first 512 bytes of disk. 446 bytes bootloader + 64 bytes partition table + 0x55AA signature." : "MBR (Master Boot Record) — diskning birinchi 512 bayt. 446 bayt bootloader + 64 bayt bo'limlar jadvali + 0x55AA imzo.",
      uefi: lang === "en" ? "EFI System Partition (ESP) — FAT32 partition with .efi files. Bootloader is a full EFI application (e.g. bootmgr.efi, grubx64.efi)." : "EFI System Partition (ESP) — .efi fayllari bilan FAT32 bo'limi. Bootloader to'liq EFI ilovasi (masalan, bootmgr.efi, grubx64.efi).",
    },
    {
      aspect: lang === "en" ? "Partition table" : "Bo'lim jadvali",
      bios: lang === "en" ? "MBR: max 4 primary partitions, max 2 TB disk, 32-bit LBA addressing." : "MBR: maksimal 4 ta asosiy bo'lim, maksimal 2 TB disk, 32-bit LBA manzillash.",
      uefi: lang === "en" ? "GPT (GUID Partition Table): 128 partitions, up to 9.4 ZB disk, 64-bit LBA. Each partition has a unique GUID." : "GPT (GUID Partition Table): 128 bo'lim, 9.4 ZB gacha disk, 64-bit LBA. Har bir bo'limning o'ziga xos GUID'i bor.",
    },
    {
      aspect: lang === "en" ? "Initialisation speed" : "Ishga tushirish tezligi",
      bios: lang === "en" ? "Sequential: devices init one by one. Slower POST." : "Ketma-ket: qurilmalar birma-bir ishga tushiriladi. Sekinroq POST.",
      uefi: lang === "en" ? "Parallel: devices init simultaneously. Fast Boot skips some checks entirely. Boots 2–3× faster than BIOS." : "Parallel: qurilmalar bir vaqtda ishga tushiriladi. Fast Boot ba'zi tekshiruvlarni butunlay o'tkazib yuboradi. BIOS dan 2–3× tezroq yuklaydi.",
    },
    {
      aspect: lang === "en" ? "Secure Boot" : "Xavfsiz Yuklash",
      bios: lang === "en" ? "Not supported. No cryptographic verification of bootloader — any code on the first sector runs unchecked." : "Qo'llab-quvvatlanmaydi. Bootloader'ning kriptografik tekshiruvi yo'q — birinchi sektordagi har qanday kod tekshirilmasdan ishlaydi.",
      uefi: lang === "en" ? "Built-in. db/dbx certificate databases. RSA-2048 + SHA-256 chain from firmware → bootloader → kernel → drivers." : "Ichki. db/dbx sertifikat ma'lumotlar bazalari. Firmware → bootloader → kernel → drayverlargacha RSA-2048 + SHA-256 zanjiri.",
    },
    {
      aspect: lang === "en" ? "UI / Shell" : "UI / Shell",
      bios: lang === "en" ? "Text-only. No mouse. Navigated with keyboard only. No networking, no scripting." : "Faqat matn. Sichqoncha yo'q. Faqat klaviatura bilan boshqariladi. Tarmoq yo'q, skript yo'q.",
      uefi: lang === "en" ? "Optional GUI with mouse support. UEFI Shell (full CLI with scripting). Network boot (PXE) and HTTPS boot built in." : "Sichqoncha qo'llab-quvvatlash bilan ixtiyoriy GUI. UEFI Shell (skript bilan to'liq CLI). Tarmoqdan yuklash (PXE) va HTTPS yuklash ichida.",
    },
    {
      aspect: lang === "en" ? "OS disk size limit" : "OS disk hajmi chegarasi",
      bios: lang === "en" ? "2 TB (MBR 32-bit LBA). Disks larger than 2 TB require GPT regardless of firmware." : "2 TB (MBR 32-bit LBA). 2 TB dan katta disklar firmware'dan qat'i nazar GPT talab qiladi.",
      uefi: lang === "en" ? "9.4 ZB (GPT 64-bit LBA). Effectively unlimited for any foreseeable hardware." : "9.4 ZB (GPT 64-bit LBA). Ko'zga ko'rinadigan har qanday hardware uchun amalda cheksiz.",
    },
    {
      aspect: lang === "en" ? "Security model" : "Xavfsizlik modeli",
      bios: lang === "en" ? "None. Any code loaded from MBR runs with full CPU privilege. No attestation, no signing." : "Yo'q. MBR dan yuklangan har qanday kod to'liq CPU imtiyozi bilan ishlaydi. Tasdiqlov yo'q, imzolash yo'q.",
      uefi: lang === "en" ? "Measured Boot (TPM records hashes), Secure Boot (signature chain), firmware update authentication, runtime DXE services for privileged operations." : "Measured Boot (TPM xeshlarni qayd etadi), Secure Boot (imzo zanjiri), firmware yangilash autentifikatsiyasi, imtiyozli amallar uchun runtime DXE xizmatlar.",
    },
  ];

  const biosChart = `
flowchart TD
    A([Power on]) --> B[CPU jumps to\\nROM 0xFFFFFFF0]
    B --> C[BIOS POST\\nhardware check]
    C --> D[Read MBR\\nfirst 512 bytes of disk]
    D --> E{0x55AA\\nsignature?}
    E -->|Yes| F[Execute 446-byte\\nbootloader code]
    E -->|No| G([Boot error])
    F --> H[Load OS\\nno verification]

    style A fill:#1a2342,stroke:#4d8bff,color:#fff
    style G fill:#3a0a1a,stroke:#ff3a5e,color:#fff
    style H fill:#1a2342,stroke:#4d8bff,color:#fff
  `;

  const uefiChart = `
flowchart TD
    A([Power on]) --> B[SEC phase\\nCPU cache-as-RAM]
    B --> C[PEI phase\\nRAM init + platform init]
    C --> D[DXE phase\\nload EFI drivers]
    D --> E[BDS phase\\nboot device selection]
    E --> F{Secure Boot\\ncheck ESP .efi}
    F -->|Signed OK| G[bootmgr.efi\\nloads OS loader]
    F -->|Fail| H([Boot blocked])
    G --> I[OS loader\\nwith full UEFI services]

    style A fill:#1a2342,stroke:#4d8bff,color:#fff
    style H fill:#3a0a1a,stroke:#ff3a5e,color:#fff
    style I fill:#0a3a1f,stroke:#00ff9c,color:#fff
    style F fill:#2a1f3a,stroke:#b88cff,color:#fff
  `;

  return (
    <section id="bios-uefi" style={{ scrollMarginTop: 80, marginBottom: 56 }}>
      <H2 num="01" uz="BIOS va UEFI nima?" en="What are BIOS and UEFI?" />
      <P>
        {lang === "en"
          ? <>Before the operating system can load, something must wake up the CPU, test the hardware, and hand control to the bootloader. That something is the <Term>firmware</Term> — software permanently stored in a chip on the motherboard. For 30 years it was <Em>BIOS</Em>; since ~2007 it has been replaced by <Em>UEFI</Em>. Understanding the difference matters for security because the firmware runs before any OS protection — a compromised firmware bypasses Secure Boot, TPM, and BitLocker entirely.</>
          : <>Operatsion tizim yuklanishidan oldin, biror narsa CPU ni uyg'otishi, hardware ni sinab ko'rishi va boshqaruvni bootloader'ga topshirishi kerak. Bu narsa — <Term>firmware</Term>: ona platadagi chipda doimiy saqlanadigan dasturiy ta'minot. 30 yil davomida bu <Em>BIOS</Em> edi; ~2007 yildan boshlab u <Em>UEFI</Em> bilan almashtirildi. Farqni tushunish xavfsizlik uchun muhim, chunki firmware har qanday OS himoyasidan oldin ishlaydi — buzilgan firmware Secure Boot, TPM va BitLocker'ni butunlay chetlab o'tadi.</>}
      </P>

      {/* ── BIOS ── */}
      <h3 style={subhead}>{lang === "en" ? "1.1 — BIOS: the legacy firmware (1975–present)" : "1.1 — BIOS: eski avlod firmware (1975-hozir)"}</h3>
      <P>
        {lang === "en"
          ? <><Term>BIOS (Basic Input/Output System)</Term> was created for the original IBM PC in 1975 and has remained fundamentally unchanged since. It lives in a small ROM (Read-Only Memory) chip on the motherboard and is the first code the CPU executes after power-on. The CPU always starts at a fixed address — <code>0xFFFFFFF0</code> (the top of the 4 GB address space, reset vector) — and the ROM chip is mapped there. BIOS runs in <Em>16-bit x86 real mode</Em>, which means it can only address 1 MB of memory (20-bit address bus), cannot use protected-mode features, and runs as if it were a DOS-era program — no virtual memory, no privilege rings, no memory protection.</>
          : <><Term>BIOS (Basic Input/Output System)</Term> 1975 yilda asl IBM PC uchun yaratilgan va o'shandan beri asosan o'zgarmagan. U ona platadagi kichik ROM (Read-Only Memory) chipida yashaydi va CPU quvvat yoqilgandan keyin bajariladigan birinchi kod. CPU har doim qat'iy manzildan boshlanadi — <code>0xFFFFFFF0</code> (4 GB manzil maydonining yuqori qismi, reset vektori) — va ROM chipi u yerga xaritalangan. BIOS <Em>16-bit x86 real rejimida</Em> ishlaydi, ya'ni faqat 1 MB xotirani (20-bit manzil avtobusi) manzillashi mumkin, himoyalangan rejim xususiyatlaridan foydalana olmaydi va DOS davrida dastur kabi ishlaydi — virtual xotira yo'q, imtiyoz halqalari yo'q, xotira himoyasi yo'q.</>}
      </P>
      <P>
        {lang === "en"
          ? <><Em>POST (Power-On Self Test)</Em> runs first — BIOS checks that RAM is present and working, CPU and FPU are functioning, keyboard controller is responding, and all configured peripherals are reachable. Then BIOS reads the <Em>MBR (Master Boot Record)</Em> from the first 512 bytes of the boot disk. The MBR layout is fixed: the first 446 bytes contain the <Em>bootstrap code</Em> (the tiny bootloader), bytes 446–509 contain the <Em>partition table</Em> (up to 4 primary partition entries of 16 bytes each), and the last 2 bytes must be <code>0x55AA</code> — the boot signature. If the signature matches, BIOS jumps to the bootstrap code and executes it — <Em>with no verification whatsoever</Em>.</>
          : <><Em>POST (Power-On Self Test)</Em> birinchi ishlaydi — BIOS RAM mavjud va ishlayotganini, CPU va FPU ishlayotganini, klaviatura kontrolleri javob berayotganini va barcha sozlangan qurilmalarga erishish mumkinligini tekshiradi. Keyin BIOS yuklash diskining birinchi 512 baytidan <Em>MBR (Master Boot Record)</Em> ni o'qiydi. MBR joylashuvi qat'iy: birinchi 446 bayt <Em>bootstrap kod</Em> (kichik bootloader) ni o'z ichiga oladi, 446-509-baytlar <Em>bo'limlar jadvalini</Em> (har biri 16 baytdan 4 tagacha asosiy bo'lim yozuvi), va oxirgi 2 bayt <code>0x55AA</code> bo'lishi kerak — yuklash imzosi. Imzo mos kelsa, BIOS bootstrap kodga sakraydi va uni bajaradi — <Em>hech qanday tekshiruvsiz</Em>.</>}
      </P>

      <div style={{ margin: "18px 0", padding: "14px 18px", borderRadius: 10, background: "var(--bg-2)", border: "1px solid var(--border)", fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 1.8 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>// MBR LAYOUT — 512 bytes total (disk sector 0)</div>
        {[
          { range: "0x000–0x1BD", size: "446 bytes", label: "Bootstrap code", color: "var(--accent)", desc: lang === "en" ? "Tiny x86 machine code, loads the real bootloader" : "Kichik x86 mashina kodi, haqiqiy bootloaderni yuklaydi" },
          { range: "0x1BE–0x1FD", size: "64 bytes", label: "Partition table", color: "var(--c-system)", desc: lang === "en" ? "4 × 16-byte entries: type, LBA start, LBA size" : "4 × 16 baytli yozuv: tur, LBA boshi, LBA hajmi" },
          { range: "0x1FE–0x1FF", size: "2 bytes", label: "Boot signature", color: "var(--c-warn)", desc: lang === "en" ? "Must be 0x55AA — if not, BIOS halts" : "0x55AA bo'lishi kerak — aks holda BIOS to'xtaydi" },
        ].map((row, i) => (
          <div key={i} style={{ display: "flex", gap: 12, padding: "4px 0", borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}>
            <span style={{ color: row.color, minWidth: 120 }}>{row.range}</span>
            <span style={{ color: "var(--text-3)", minWidth: 70 }}>{row.size}</span>
            <span style={{ color: "var(--text-1)", minWidth: 120 }}>{row.label}</span>
            <span style={{ color: "var(--text-2)", fontSize: 11 }}>{row.desc}</span>
          </div>
        ))}
      </div>

      <Callout color="var(--c-attack)" icon="skull" titleUz="BIOS bootkit — MBR ga yozish" titleEn="BIOS bootkit — overwriting the MBR">
        {lang === "en"
          ? <>Because BIOS performs zero verification on the MBR bootstrap code, overwriting those 446 bytes is enough to control the entire boot sequence — before the OS, before any AV, before any security tool. Classic MBR bootkits: <strong>Mebroot/Sinowal</strong> (2007, first in-the-wild MBR rootkit), <strong>TDL4/Alureon</strong> (2010, survived OS reinstalls), <strong>Petya</strong> (2016, encrypted the MBR and held it for ransom). The fix was UEFI Secure Boot — but it only helps if Secure Boot is actually enabled and CSM/Legacy mode is disabled.</>
          : <>BIOS MBR bootstrap kodida nol tekshiruv amalga oshirgani uchun, o'sha 446 baytni yozib o'chirish — OS dan oldin, har qanday AV dan oldin, har qanday xavfsizlik vositasidan oldin — butun yuklash ketma-ketligini nazorat qilish uchun yetarli. Klassik MBR bootkit'lar: <strong>Mebroot/Sinowal</strong> (2007, birinchi real MBR rootkiti), <strong>TDL4/Alureon</strong> (2010, OS qayta o'rnatishlaridan omon qoldi), <strong>Petya</strong> (2016, MBR ni shifrladi va to'lov so'radi). Yechim UEFI Secure Boot edi — lekin faqat Secure Boot haqiqatan yoqilgan va CSM/Legacy rejim o'chirilgan bo'lsa ishlaydi.</>}
      </Callout>

      <div style={{ marginTop: 22 }}>
        <MermaidDiagram chart={biosChart}
          caption="1-rasm. BIOS yuklash ketma-ketligi: ROM → POST → MBR → bootloader (tekshiruvsiz)."
          captionEn="Fig 1. BIOS boot sequence: ROM → POST → MBR → bootloader (no verification)." />
      </div>

      {/* ── UEFI ── */}
      <h3 style={subhead}>{lang === "en" ? "1.2 — UEFI: modern firmware architecture" : "1.2 — UEFI: zamonaviy firmware arxitekturasi"}</h3>
      <P>
        {lang === "en"
          ? <><Term>UEFI (Unified Extensible Firmware Interface)</Term> was developed by Intel starting in 1998 (as EFI, then standardised as UEFI in 2007 by the UEFI Forum). Unlike BIOS, UEFI runs in <Em>32 or 64-bit protected/long mode</Em> from the start, giving it access to all RAM, the ability to load proper DXE (Driver eXecution Environment) drivers, and support for a real file system. UEFI firmware has four distinct phases:</>
          : <><Term>UEFI (Unified Extensible Firmware Interface)</Term> 1998 yildan boshlab Intel tomonidan (EFI sifatida, keyin 2007 yilda UEFI Forum tomonidan UEFI sifatida standartlashtirilgan) ishlab chiqilgan. BIOS dan farqli o'laroq, UEFI boshidanoq <Em>32 yoki 64-bit himoyalangan/uzun rejimda</Em> ishlaydi, bu unga barcha RAM ga kirish, to'g'ri DXE (Driver eXecution Environment) drayverlarini yuklash va haqiqiy fayl tizimini qo'llab-quvvatlash imkoniyatini beradi. UEFI firmwarening to'rtta alohida fazasi mavjud:</>}
      </P>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "16px 0" }}>
        {[
          { phase: "SEC", full: "Security Phase", color: "var(--c-auth)",
            bodyUz: "CPU ni xavfsiz holatga o'tkazadi, \"Cache-as-RAM\" (CAR) texnikasidan foydalangan holda L1/L2 keshini vaqtinchalik RAM sifatida ishlatadi (RAM hali ishga tushmagan), asosiy CPU ishga tushirishni amalga oshiradi.",
            bodyEn: "Puts CPU into a known-safe state, uses \"Cache-as-RAM\" (CAR) — treating L1/L2 cache as temporary RAM (since RAM isn't initialised yet), performs basic CPU initialisation." },
          { phase: "PEI", full: "Pre-EFI Initialisation", color: "var(--c-warn)",
            bodyUz: "RAM ni ishga tushiradi (DDR SPD ma'lumotlarini o'qib), platform qismlarini (PCH, DRAM kontrolleri) sozlaydi, barcha bosqichlar uchun platformaga xos ishga tushirishni amalga oshiradi.",
            bodyEn: "Initialises RAM (reads DDR SPD data), configures platform components (PCH, DRAM controller), performs platform-specific initialisation that all subsequent phases depend on." },
          { phase: "DXE", full: "Driver eXecution Environment", color: "var(--c-system)",
            bodyUz: "UEFI drayverlarini yuklaydi (EFI Protocol Interface orqali), to'liq xotiraga kirish bilan 64-bit muhitda ishlaydi, disk kontrollerlari, tarmoq kartalari, displey drayverlarini yuklaydi.",
            bodyEn: "Loads UEFI drivers (via EFI Protocol Interface), runs in full 64-bit environment with complete memory access, loads disk controllers, network cards, display drivers." },
          { phase: "BDS", full: "Boot Device Selection", color: "var(--accent)",
            bodyUz: "Yuklash qurilmalarini NVRAM roʻyxatidan o'qiydi (UEFI Boot#### o'zgaruvchilari), Secure Boot ni amalga oshiradi — ESP dagi .efi faylini imzoni db/dbx bilan tekshirib yuklaydi.",
            bodyEn: "Reads boot devices from NVRAM list (UEFI Boot#### variables), enforces Secure Boot — loads the .efi file from ESP after verifying its signature against db/dbx." },
        ].map((p, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 0, borderRadius: 10, overflow: "hidden", border: `1px solid ${p.color}30` }}>
            <div style={{ background: `${p.color}18`, borderRight: `2px solid ${p.color}50`, padding: "12px 14px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minWidth: 64 }}>
              <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: p.color }}>{p.phase}</div>
              <div className="mono" style={{ fontSize: 9, color: "var(--text-3)", textAlign: "center", marginTop: 2 }}>{p.full}</div>
            </div>
            <div style={{ padding: "12px 16px", background: `${p.color}05`, fontSize: 13, lineHeight: 1.7, color: "var(--text-1)" }}>
              {lang === "en" ? p.bodyEn : p.bodyUz}
            </div>
          </div>
        ))}
      </div>

      <P>
        {lang === "en"
          ? <>UEFI stores boot configuration in <Em>NVRAM (Non-Volatile RAM)</Em> — small flash memory on the motherboard. The boot order and each OS's bootloader path are stored as NVRAM variables (e.g. <code>Boot0001 = \EFI\Microsoft\Boot\bootmgfw.efi</code>). You can read and write these variables from the OS with the <code>bcdedit /set {"{fwbootmgr}"} displayorder</code> command or from Linux with <code>efibootmgr</code>.</>
          : <>UEFI yuklash konfiguratsiyasini <Em>NVRAM (Xotirada saqlanadigan o'zgaruvchan RAM)</Em> da saqlaydi — ona platadagi kichik flesh xotira. Yuklash tartibi va har bir OS ning bootloader yo'li NVRAM o'zgaruvchilari sifatida saqlanadi (masalan, <code>Boot0001 = \EFI\Microsoft\Boot\bootmgfw.efi</code>). Bu o'zgaruvchilarni OS dan <code>bcdedit /set {"{fwbootmgr}"} displayorder</code> buyrug'i yoki Linux da <code>efibootmgr</code> bilan o'qib va yozish mumkin.</>}
      </P>

      <div style={{ marginTop: 22 }}>
        <MermaidDiagram chart={uefiChart}
          caption="2-rasm. UEFI yuklash fazalari: SEC → PEI → DXE → BDS → Secure Boot tekshiruvi → bootmgr.efi."
          captionEn="Fig 2. UEFI boot phases: SEC → PEI → DXE → BDS → Secure Boot check → bootmgr.efi." />
      </div>

      {/* ── Comparison table ── */}
      <h3 style={subhead}>{lang === "en" ? "1.3 — BIOS vs UEFI: full comparison" : "1.3 — BIOS va UEFI: to'liq taqqoslash"}</h3>
      <div style={{ borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden", marginTop: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: "var(--bg-2)", borderBottom: "1px solid var(--border)" }}>
          <div style={{ padding: "10px 14px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, color: "var(--text-2)" }}>{lang === "en" ? "Aspect" : "Jihat"}</div>
          <div style={{ padding: "10px 14px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, color: "var(--c-warn)", borderLeft: "1px solid var(--border)" }}>BIOS</div>
          <div style={{ padding: "10px 14px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, color: "var(--c-system)", borderLeft: "1px solid var(--border)" }}>UEFI</div>
        </div>
        {compRows.map((row, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: i < compRows.length - 1 ? "1px solid var(--border)" : "none", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)" }}>
            <div style={{ padding: "10px 14px", fontSize: 12.5, fontWeight: 600, color: "var(--text-1)" }}>{row.aspect}</div>
            <div style={{ padding: "10px 14px", fontSize: 12, color: "var(--text-2)", borderLeft: "1px solid var(--border)", lineHeight: 1.6 }}>{row.bios}</div>
            <div style={{ padding: "10px 14px", fontSize: 12, color: "var(--text-1)", borderLeft: "1px solid var(--border)", lineHeight: 1.6 }}>{row.uefi}</div>
          </div>
        ))}
      </div>

      {/* ── Security ── */}
      <h3 style={subhead}>{lang === "en" ? "1.4 — Firmware as an attack surface" : "1.4 — Firmware hujum yuzasi sifatida"}</h3>
      <P>
        {lang === "en"
          ? <>Firmware-level attacks are the most persistent and hardest to detect category of malware. Unlike a rootkit that lives in the OS, a firmware implant survives: OS reinstallation, disk replacement, and even BitLocker wipes — because the firmware lives on a separate SPI flash chip, not on the main drive. This is why nation-state actors and APT groups invest heavily in firmware research.</>
          : <>Firmware darajasidagi hujumlar — zararli dasturlarning eng barqaror va aniqlanishi qiyinroq toifasi. OS da yashovchi rootkit dan farqli o'laroq, firmware implant omon qoladi: OS qayta o'rnatish, disk almashtirish va hatto BitLocker o'chirishdan — chunki firmware asosiy diskda emas, alohida SPI flesh chipida yashaydi. Shuning uchun davlat darajasidagi hujumchilar va APT guruhlari firmware tadqiqotlariga katta sarmoya kiritadi.</>}
      </P>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
        {[
          {
            name: "MBR bootkits (BIOS era)", color: "var(--c-attack)",
            bodyUz: "BIOS ning tekshiruvlarsiz MBR ni bajarishini ekspluatatsiya qiladi. MBR dagi 446 baytni yozib o'chirish OS dan oldin nazoratni beradi. Klassik misollar: Mebroot (2007), TDL4 (2010), Petya (2016). Himoya: BIOS ni UEFI + Secure Boot bilan almashtirish.",
            bodyEn: "Exploits BIOS's execution of MBR without verification. Overwriting 446 bytes in the MBR gives control before the OS. Classic examples: Mebroot (2007), TDL4 (2010), Petya (2016). Fix: replace BIOS with UEFI + Secure Boot.",
          },
          {
            name: "UEFI firmware implants", color: "var(--c-attack)",
            bodyUz: "Firmware manbasini to'g'ridan-to'g'ri o'zgartiradigan implantlar — SPI flesh chipiga yoziladi. Mashhur misollar: CosmicStrand (2022, ASUS/Gigabyte), MosaicRegressor (2020, Kaspersky tomonidan kashf etilgan). Bunday implant UEFI ni qayta yangilash orqali ham olib tashlanmaydi (chunki implant yangilanish kodining o'zini o'zgartiradi).",
            bodyEn: "Implants that directly modify the firmware source — written to the SPI flash chip. Notable examples: CosmicStrand (2022, ASUS/Gigabyte), MosaicRegressor (2020, discovered by Kaspersky). Such an implant survives even UEFI re-flashing (because the implant modifies the update code itself).",
          },
          {
            name: "ESPecter — EFI System Partition bootkit", color: "var(--c-warn)",
            bodyUz: "Firmware chipiga yozmasdan, ESP dagi .efi fayllarni modifikatsiya qiladi. Secure Boot o'chirilgan yoki CSM/Legacy rejimi yoqilgan tizimlarda ishlaydi. ESPecter (2021) Windows Boot Manager (bootmgfw.efi) ni yamab, kernel yuklanishidan oldin drayverini kiritardi. Himoya: Secure Boot yoqilishi va ESP'ga yozish monitoringi.",
            bodyEn: "Modifies .efi files on the ESP without writing to the firmware chip. Works on systems with Secure Boot disabled or CSM/Legacy mode enabled. ESPecter (2021) patched the Windows Boot Manager (bootmgfw.efi) to inject its driver before the kernel loaded. Fix: Secure Boot enabled + ESP write monitoring.",
          },
          {
            name: "CSM / Legacy mode — Secure Boot killer", color: "var(--c-warn)",
            bodyUz: "Aksariyat UEFI dasturiy ta'minotlari CSM (Compatibility Support Module) yoki \"Legacy mode\" ni taqdim etadi — eski BIOS-only OS'larni (Windows XP, Linux no-EFI) qo'llab-quvvatlash uchun. CSM yoqilganda, Secure Boot avtomatik ravishda butunlay o'chiriladi. Bu xavfsizlik jihati ko'plab korporativ tizimlar tomonidan e'tibordan chetda qoldiriladi. Tekshirish: <code>msinfo32</code> → BIOS Mode → \"UEFI\" bo'lishi kerak (\"Legacy\" emas).",
            bodyEn: "Most UEFI firmware offers CSM (Compatibility Support Module) or \"Legacy mode\" — to support old BIOS-only OSes (Windows XP, non-EFI Linux). When CSM is enabled, Secure Boot is automatically disabled entirely. This security implication is overlooked by many enterprise systems. Check: <code>msinfo32</code> → BIOS Mode → should say \"UEFI\" (not \"Legacy\").",
          },
          {
            name: "Measured Boot + TPM — attestation chain", color: "var(--c-system)",
            bodyUz: "UEFI'dagi Measured Boot har bir yuklash bosqichini (firmware, bootloader, kernel, drayverlar) SHA-256 xeshini TPM PCR (Platform Configuration Register) ga yozadi. Bu xeshlar o'zgartirilishi mumkin emas — TPM ularni biriktirib, oxirgi «o'lcham» ni yaratadi. Masofaviy attestatsiya orqali server tizimning haqiqiy yuklash konfiguratsiyasini tekshirishi mumkin — biron bir komponent modifikatsiya qilinganligini aniqlash uchun.",
            bodyEn: "Measured Boot in UEFI records the SHA-256 hash of each boot stage (firmware, bootloader, kernel, drivers) into TPM PCR (Platform Configuration Register). These hashes cannot be altered — the TPM chains them, creating a final \"measurement\". Via remote attestation, a server can verify a machine's exact boot configuration — detecting if any component was modified.",
          },
        ].map((item, i) => (
          <div key={i} style={{ padding: "12px 16px", borderRadius: 10, background: `${item.color}07`, border: `1px solid ${item.color}28`, borderLeft: `3px solid ${item.color}` }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 13.5, fontWeight: 700, color: item.color, marginBottom: 6 }}>{item.name}</div>
            <div style={{ fontSize: 12.5, color: "var(--text-1)", lineHeight: 1.72 }}>{lang === "en" ? item.bodyEn : item.bodyUz}</div>
          </div>
        ))}
      </div>

      <Callout color="var(--c-system)" icon="shield" titleUz="Amaliy tekshiruv — tizimingiz UEFI yoki BIOS?" titleEn="Practical check — is your system UEFI or BIOS?">
        {lang === "en"
          ? <>Run <code>msinfo32</code> (Win+R → msinfo32 → Enter). Look at <strong>BIOS Mode</strong>: if it says <em>UEFI</em>, your system boots in UEFI mode. If it says <em>Legacy</em>, CSM is active and Secure Boot is disabled — a security risk. To check Secure Boot status: <code>msinfo32</code> → <strong>Secure Boot State</strong> → should say <em>On</em>. From PowerShell (admin): <code>Confirm-SecureBootUEFI</code> → returns <em>True</em> if Secure Boot is active.</>
          : <>Ishga tushiring <code>msinfo32</code> (Win+R → msinfo32 → Enter). <strong>BIOS Mode</strong> ga qarang: agar <em>UEFI</em> desa, tizimingiz UEFI rejimida yuklanadi. Agar <em>Legacy</em> desa, CSM faol va Secure Boot o'chirilgan — xavfsizlik xavfi. Secure Boot holatini tekshirish uchun: <code>msinfo32</code> → <strong>Secure Boot State</strong> → <em>On</em> bo'lishi kerak. PowerShell dan (admin): <code>Confirm-SecureBootUEFI</code> → Secure Boot faol bo'lsa <em>True</em> qaytaradi.</>}
      </Callout>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// L06: Secure Boot
// ─────────────────────────────────────────────────────────────
function SectionSecureBoot() {
  const lang = useLang();

  const verifyChart = `
flowchart TD
    A([UEFI BDS phase\\nboot device selected]) --> B[Load .efi from ESP]
    B --> C{Hash in dbx?\\nrevoked?}
    C -->|YES| X([BOOT BLOCKED\\nrevoked binary])
    C -->|NO| D{Certificate chain\\ntraces to db?}
    D -->|NO| Y([BOOT BLOCKED\\nunsigned / unknown])
    D -->|YES| E[Execute bootloader\\nbootmgr.efi]
    E --> F{Bootloader verifies\\nOS loader signature}
    F -->|FAIL| Z([BOOT BLOCKED])
    F -->|OK| G[Load winload.efi]
    G --> H{winload verifies\\nntoskrnl + HAL}
    H -->|OK| I([Kernel starts\\nring 0])

    style X fill:#3a0a1a,stroke:#ff3a5e,color:#fff
    style Y fill:#3a0a1a,stroke:#ff3a5e,color:#fff
    style Z fill:#3a0a1a,stroke:#ff3a5e,color:#fff
    style I fill:#0a3a1f,stroke:#00ff9c,color:#fff
    style C fill:#2a1f3a,stroke:#b88cff,color:#fff
    style D fill:#2a1f3a,stroke:#b88cff,color:#fff
  `;

  const keyHierarchy = [
    {
      key: "PK", full: lang === "en" ? "Platform Key" : "Platforma Kaliti",
      color: "#ff6b35", owner: lang === "en" ? "OEM (ASUS, Dell, HP, Lenovo…)" : "OEM (ASUS, Dell, HP, Lenovo…)",
      bodyUz: <>Zanjirning eng yuqori qismi — «root» sertifikat. Faqat bitta PK bo'lishi mumkin. PK KEK yangilanishlarini imzolaydi. PK o'chirilsa — tizim «Setup Mode»ga kiradi (barcha tekshiruvlar o'chiriladi, xavfli!). Odatda OEM ishlab chiqarish zavodida yozadi — oddiy foydalanuvchilar PK ni almashtirishga ehtiyoj sezmaydi, lekin bu imkoniyat mavjud (masalan, maxsus Secure Boot konfiguratsiyasi uchun).</>,
      bodyEn: <>The top of the chain — the "root" certificate. Only one PK can exist at a time. PK signs KEK updates. Deleting the PK puts the system into "Setup Mode" (all checks disabled — dangerous!). Typically written by the OEM at the factory — normal users never need to replace it, but the option exists (e.g., for custom Secure Boot configurations).</>,
    },
    {
      key: "KEK", full: lang === "en" ? "Key Exchange Key" : "Kalit Almashuv Kaliti",
      color: "#f5a623", owner: lang === "en" ? "OEM + Microsoft (both enrolled)" : "OEM + Microsoft (ikkalasi ham yozilgan)",
      bodyUz: <>db va dbx ma'lumotlar bazalarini yangilash huquqi. Bir nechta KEK bo'lishi mumkin. Barcha Windows-sertifikatlangan mashinalarda Microsoft o'zining KEK ni o'rnatgan — bu Microsoft ga dbx (revokatsiya ro'yxati) ni Windows Update orqali yangilash imkonini beradi. Agar KEK bo'lmasa, Microsoft imzolangan bootloader'lar uchun dbx yangilanishlarini yubora olmaydi.</>,
      bodyEn: <>Grants the right to update the db and dbx databases. Multiple KEKs can exist. Microsoft installs its own KEK on all Windows-certified machines — this allows Microsoft to push dbx (revocation list) updates via Windows Update. Without the Microsoft KEK, dbx updates for Microsoft-signed bootloaders cannot be delivered.</>,
    },
    {
      key: "db", full: lang === "en" ? "Signature Database (allowed)" : "Imzo Ma'lumotlar Bazasi (ruxsat etilgan)",
      color: "var(--c-system)", owner: lang === "en" ? "Microsoft UEFI CA + OEM certificates" : "Microsoft UEFI CA + OEM sertifikatlari",
      bodyUz: <>Yuklashga ruxsat etilgan imzolar va hashlar ro'yxati. db da ikkita asosiy Microsoft sertifikati bor: <strong>Microsoft Windows Production PCA 2011</strong> (Windows'ning o'z bootloader'lari: bootmgr.efi) va <strong>Microsoft Corporation UEFI CA 2011</strong> (uchinchi tomon EFI ilovalar: Linux shim, ba'zi OEM vositalari). Agar .efi faylining sertifikat zanjiri db dagi birorta sertifikatga borib taqalmasa — yuklash rad etiladi.</>,
      bodyEn: <>The allowlist of signatures and hashes permitted to run at boot. db contains two primary Microsoft certificates: <strong>Microsoft Windows Production PCA 2011</strong> (Windows's own bootloaders: bootmgr.efi) and <strong>Microsoft Corporation UEFI CA 2011</strong> (third-party EFI apps: Linux shim, some OEM tools). If a .efi file's certificate chain cannot be traced to any certificate in db — boot is rejected.</>,
    },
    {
      key: "dbx", full: lang === "en" ? "Forbidden Signature Database (revoked)" : "Taqiqlangan Imzo Ma'lumotlar Bazasi (bekor qilingan)",
      color: "var(--c-attack)", owner: lang === "en" ? "Microsoft (updated via Windows Update)" : "Microsoft (Windows Update orqali yangilanadi)",
      bodyUz: <>Bekor qilingan imzolar va hashlar qora ro'yxati. db ga ruxsat etilgan bo'lsa ham, dbx da keltirilgan fayl yuklashdan bloklanadi. dbx ning asosiy tarkibi: zaif bootloader'lar (eski GRUB2 versiyalari, BootHole CVE-2020-10713 dan ta'sirlangan), zararli bootkit'lar tomonidan ishlatilgan fayl hashlari, sertifikat bekor qilish. Muhim: BlackLotus (CVE-2022-21894) dbx tekshiruvini <em>xotirada</em> chetlab o'tdi — dbx ni o'zgartirishsiz.</>,
      bodyEn: <>The blocklist of revoked signatures and hashes. Even if a file is allowed by db, if it appears in dbx — it is blocked from booting. dbx primarily contains: vulnerable bootloaders (old GRUB2 versions affected by BootHole CVE-2020-10713), file hashes used by known bootkits, certificate revocations. Key: BlackLotus (CVE-2022-21894) bypassed the dbx check <em>in memory</em> — without modifying dbx itself.</>,
    },
  ];

  const bypasses = [
    {
      name: "BlackLotus — CVE-2022-21894 «baton drop»",
      year: "2023", severity: lang === "en" ? "Critical" : "Kritik",
      color: "var(--c-attack)",
      bodyUz: <>To'liq yamoqlangan Windows 11 da Secure Boot'ni chetlab o'tgan birinchi ommaviy UEFI bootkit. Zaiflik: yuklash jarayonidagi «baton drop» holatida, winload.efi eski (zaif) versiyasi yuklanganda, Secure Boot tekshiruvi qayta bajarilar edi — lekin bu safar kechroq, ba'zi xotira mintaqalari allaqachon yozib bo'linganidan keyin. BlackLotus bu oraliqda dbx tekshiruvi uchun mas'ul kodni xotirada yamadi. <br /><br /><strong>Hujum ketma-ketligi:</strong> (1) zaif winload'ni ESP ga yozish, (2) xotiradagi dbx tekshiruvini patch qilish, (3) shim loader orqali imzosiz drayver yuklash, (4) DSE (Driver Signature Enforcement) o'chirish, (5) ring 0 da doimiy implant o'rnatish. Patch: KB5025885 (2023 may) — lekin faqat dbx yangilanishi o'rnatilgan va yangi revokatsiya siyosati yoqilgan bo'lsa.</>,
      bodyEn: <>The first publicly documented UEFI bootkit to bypass Secure Boot on fully-patched Windows 11. Vulnerability: in a "baton drop" condition during boot, when an older (vulnerable) winload.efi was loaded, the Secure Boot check re-ran — but this time later, after some memory regions had already been written. BlackLotus used this window to patch the dbx verification code in memory. <br /><br /><strong>Attack chain:</strong> (1) write vulnerable winload to ESP, (2) patch dbx check in memory, (3) load unsigned driver via shim loader, (4) disable DSE (Driver Signature Enforcement), (5) install persistent ring 0 implant. Patch: KB5025885 (May 2023) — but only effective if dbx update is installed and new revocation policy enabled.</>,
    },
    {
      name: "BootHole — CVE-2020-10713",
      year: "2020", severity: lang === "en" ? "High" : "Yuqori",
      color: "#f5a623",
      bodyUz: <>GRUB2 (GNU GRand Unified Bootloader) da buffer overflow. GRUB2 ning <code>grub.cfg</code> konfiguratsiya faylini tahlil qilishida xato: konfiguratsiya faylidagi juda uzun qiymat GRUB ning o'z kod segmentiga yozilardi. GRUB2 Microsoft UEFI CA tomonidan imzolangan (db da) — ya'ni Secure Boot uni ishga tushirishga ruxsat berardi. Ekspluatatsiya: imzolangan GRUB2 ni yuklab, <code>grub.cfg</code> ni (imzosiz, oddiy fayl) modifikatsiya qilib, har qanday kodni bajarish. Microsoft majbur bo'lib GRUB2 ning yuzlab zaif versiyasini dbx ga qo'shdi. Linux tarqatmalari shim va GRUB2 ni yangilashi kerak bo'ldi.</>,
      bodyEn: <>Buffer overflow in GRUB2 (GNU GRand Unified Bootloader). The vulnerability was in GRUB2's parsing of its <code>grub.cfg</code> config file: an overly long value in the config would overflow into GRUB's own code segment. GRUB2 is signed by the Microsoft UEFI CA (trusted in db) — so Secure Boot allowed it to run. Exploit: load the signed GRUB2, modify <code>grub.cfg</code> (unsigned, plain file), execute arbitrary code. Microsoft was forced to add hundreds of vulnerable GRUB2 versions to dbx. Linux distributions had to update shim and GRUB2.</>,
    },
    {
      name: lang === "en" ? "Signed-but-vulnerable bootloader reuse" : "Imzolangan lekin zaif bootloader qayta ishlatish",
      year: lang === "en" ? "Ongoing" : "Doimiy",
      severity: lang === "en" ? "Medium–High" : "O'rta–Yuqori",
      color: "var(--c-warn)",
      bodyUz: <>Secure Boot faqat imzoni tekshiradi — zaiflikni emas. Agar qonuniy imzolangan bootloader zaif bo'lsa (eski .efi fayl), hujumchi uni ESP ga ko'chirib, zaifligini ekspluatatsiya qiladi. dbx bu hashn qora ro'yxatga kiritib qo'ygan bo'lsa — bloklanadi. Lekin dbx ro'yxati Microsoft tomonidan yangilanganligi va tizimda o'rnatilganligi kerak. Ko'plab ishlab chiqarish tizimlari dbx ni yillarca yangilamaydi — shuning uchun «eski imzolangan bootloader» arsenali katta bo'lib qoladi.</>,
      bodyEn: <>Secure Boot only checks the signature — not the vulnerability status. If a legitimately signed bootloader contains a vulnerability (an old .efi file), an attacker can copy it to the ESP and exploit the vulnerability. If dbx has blocklisted this hash — it's blocked. But dbx must have been updated by Microsoft AND installed on the system. Many production systems go years without dbx updates — meaning the "old signed bootloader" arsenal remains large.</>,
    },
    {
      name: lang === "en" ? "Physical attack: BIOS setup / CMOS clear" : "Jismoniy hujum: BIOS sozlamalari / CMOS tozalash",
      year: lang === "en" ? "Always" : "Doim",
      severity: lang === "en" ? "Physical access required" : "Jismoniy kirish kerak",
      color: "var(--text-2)",
      bodyUz: <>Agar hujumchi mashinaga jismoniy kirishi bo'lsa: (1) BIOS Setup ga kirish (Del / F2 / F12) → Secure Boot ni o'chirish. (2) CMOS batareyasini olib qo'yish yoki CLRTC jumper → barcha BIOS sozlamalarini, jumladan Secure Boot ni nolga qaytarish. (3) SPI flesh programmer (masalan, CH341A) → ona platadagi SPI chip'dan firmware ni to'g'ridan-to'g'ri o'qish va yozish. Himoya: BIOS Setup parol, TPM PCR o'lchovlari (Measured Boot), diskni jismoniy himoyalash.</>,
      bodyEn: <>If an attacker has physical machine access: (1) Enter BIOS Setup (Del / F2 / F12) → disable Secure Boot. (2) Remove CMOS battery or use CLRTC jumper → reset all BIOS settings including Secure Boot to defaults. (3) SPI flash programmer (e.g., CH341A) → directly read and write firmware from the SPI chip on the motherboard. Defences: BIOS Setup password, TPM PCR measurements (Measured Boot), physical disk protection.</>,
    },
    {
      name: lang === "en" ? "Microsoft \"Golden Key\" leak (2016)" : "Microsoft «Oltin Kalit» sizib chiqishi (2016)",
      year: "2016", severity: lang === "en" ? "Critical (patched)" : "Kritik (yamoqlangan)",
      color: "var(--c-attack)",
      bodyUz: <>2016 yilda Microsoft xodimi sinov maqsadida «Secure Boot debug siyosati» ni — Secure Boot ni o'chirib qo'yadigan maxsus imzolangan fayl — tasodifan chiqarib yubordi. Bu fayl Microsoft Production CA tomonidan imzolangan (db da ruxsat etilgan), shuning uchun Secure Boot uni to'siqsiz yuklardi. Keyin esa Secure Boot'ni o'chirib, har qanday imzosiz kodni yuklash mumkin bo'lardi. Bu fayl «oltin kalit» deb nomlandi — Microsoft uchun uyalib ketarli hodisa. Patch: dbx ga bu faylning heshini qo'shish, lekin patch'ning o'zi ham muammoli bo'lib, birta patch yana bir yangi zaiflikni ochib qo'ydi.</>,
      bodyEn: <>In 2016, a Microsoft employee accidentally leaked a "Secure Boot debug policy" — a specially signed file that disables Secure Boot. This file was signed by the Microsoft Production CA (permitted in db), so Secure Boot would load it without question. Then with Secure Boot disabled, any unsigned code could run. The file was dubbed the "golden key" — a deeply embarrassing incident for Microsoft. Fix: add the file's hash to dbx — but the patch itself was problematic, with one patch opening another vulnerability.</>,
    },
  ];

  return (
    <section id="secure-boot" style={{ scrollMarginTop: 80, marginBottom: 56 }}>
      <H2 num="01" uz="Secure Boot nima va nima uchun kerak?" en="What is Secure Boot and why does it exist?" />
      <P>
        {lang === "en"
          ? <><Term>Secure Boot</Term> is a UEFI security feature that ensures every piece of software loaded during the boot process has been cryptographically signed by a trusted authority. It was designed to solve a fundamental problem of the BIOS era: the bootloader ran with <Em>zero verification</Em> — any code in the MBR would execute unconditionally. This allowed <Em>bootkits</Em> — malware that lived below the OS — to persist through OS reinstalls, AV scans, and disk formats, because they never touched the OS partition.</>
          : <><Term>Secure Boot</Term> — yuklash jarayonida yuklanadigan har bir dasturiy ta'minot ishonchli organ tomonidan kriptografik imzolanganligi kafolatlaydigan UEFI xavfsizlik xususiyati. U BIOS davrining asosiy muammosini hal qilish uchun yaratildi: bootloader <Em>nol tekshiruv</Em> bilan ishlardi — MBR dagi har qanday kod so'zsiz bajarilardi. Bu OS qayta o'rnatish, antivirus skanerlash va disk formatlash jarayonlarini boshdan o'tkazib yashaydigan zararli dasturlarni — <Em>bootkit</Em>larni — imkon berdi, chunki ular OS bo'limiga hech qachon tegmasdi.</>}
      </P>
      <P>
        {lang === "en"
          ? <>Secure Boot was introduced with UEFI and became mandatory for Windows 8 OEM certification in 2012 (Microsoft required all Windows 8–certified hardware to ship with Secure Boot enabled). The core idea is a <Em>chain of trust</Em>: each layer of the boot process cryptographically verifies the next, so that if any single link is tampered with, the entire chain breaks and boot is halted. The chain is anchored in the firmware itself — hardware that users generally cannot modify without physical access.</>
          : <>Secure Boot UEFI bilan birga kiritildi va 2012 yilda Windows 8 OEM sertifikatlash uchun majburiy bo'ldi (Microsoft barcha Windows 8-sertifikatlangan qurilmalar Secure Boot yoqilgan holda yetkazib berilishini talab qildi). Asosiy g'oya — <Em>ishonch zanjiri</Em>: yuklash jarayonining har bir qatlami keyingisini kriptografik tekshiradi, shuning uchun biron bir bo'g'in buzilsa, butun zanjir sinadi va yuklash to'xtatiladi. Zanjir firmware'ning o'zida — foydalanuvchilar odatda jismoniy kirishsiz o'zgartira olmaydigan hardware'da — o'rnatilgan.</>}
      </P>

      {/* ── Key hierarchy ── */}
      <h3 style={subhead}>{lang === "en" ? "1.1 — The 4-key hierarchy: PK → KEK → db → dbx" : "1.1 — 4 kalit ierarxiyasi: PK → KEK → db → dbx"}</h3>
      <P>
        {lang === "en"
          ? <>Secure Boot uses four databases stored in UEFI NVRAM, arranged in a strict trust hierarchy. The top key can update the one below it, but not vice versa. Understanding this hierarchy explains both how Secure Boot works and why it sometimes fails to stop advanced attacks.</>
          : <>Secure Boot UEFI NVRAM da saqlangan to'rtta ma'lumotlar bazasidan foydalanadi, ular qat'iy ishonch ierarxiyasida joylashtirilgan. Yuqori kalit pastdagini yangilay oladi, lekin aksincha emas. Bu ierarxiyani tushunish Secure Boot qanday ishlashini ham, nima uchun ba'zan kuchli hujumlarni to'xtata olmasligi sababini ham tushuntiradi.</>}
      </P>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
        {keyHierarchy.map((k, i) => (
          <div key={i} style={{ borderRadius: 12, border: `1px solid ${k.color}30`, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 16px", background: `${k.color}12`, borderBottom: `1px solid ${k.color}20` }}>
              <div className="mono" style={{ fontSize: 17, fontWeight: 800, color: k.color, minWidth: 44 }}>{k.key}</div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 13.5, fontWeight: 700, color: k.color }}>{k.full}</div>
                <div className="mono" style={{ fontSize: 10.5, color: "var(--text-3)", marginTop: 1 }}>{lang === "en" ? "Owner:" : "Egasi:"} {k.owner}</div>
              </div>
              {i < keyHierarchy.length - 1 && (
                <div className="mono" style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-3)" }}>→ {lang === "en" ? "signs updates to" : "yangilanishlarini imzolaydi"} {keyHierarchy[i+1].key}</div>
              )}
            </div>
            <div style={{ padding: "12px 16px", fontSize: 13, lineHeight: 1.75, color: "var(--text-1)" }}>
              {lang === "en" ? k.bodyEn : k.bodyUz}
            </div>
          </div>
        ))}
      </div>

      <div style={{ margin: "18px 0", padding: "14px 18px", borderRadius: 10, background: "var(--bg-2)", border: "1px solid var(--border)", fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 1.9 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>// PowerShell — read all Secure Boot NVRAM variables (Admin required)</div>
        <div><span style={{ color: "var(--c-system)" }}>Get-SecureBootUEFI</span> <span style={{ color: "var(--accent)" }}>-Name</span> <span style={{ color: "var(--c-user)" }}>PK</span>    <span style={{ color: "var(--text-3)" }}># Platform Key (1 entry)</span></div>
        <div><span style={{ color: "var(--c-system)" }}>Get-SecureBootUEFI</span> <span style={{ color: "var(--accent)" }}>-Name</span> <span style={{ color: "var(--c-user)" }}>KEK</span>   <span style={{ color: "var(--text-3)" }}># Key Exchange Keys</span></div>
        <div><span style={{ color: "var(--c-system)" }}>Get-SecureBootUEFI</span> <span style={{ color: "var(--accent)" }}>-Name</span> <span style={{ color: "var(--c-user)" }}>db</span>    <span style={{ color: "var(--text-3)" }}># Allowed signatures (Microsoft CAs)</span></div>
        <div><span style={{ color: "var(--c-system)" }}>Get-SecureBootUEFI</span> <span style={{ color: "var(--accent)" }}>-Name</span> <span style={{ color: "var(--c-user)" }}>dbx</span>   <span style={{ color: "var(--text-3)" }}># Revocation list (blocked hashes)</span></div>
        <div style={{ marginTop: 8 }}><span style={{ color: "var(--c-system)" }}>Confirm-SecureBootUEFI</span>                   <span style={{ color: "var(--text-3)" }}># True = Secure Boot active</span></div>
        <div><span style={{ color: "var(--c-system)" }}>[System.Text.Encoding]::ASCII.GetString(</span></div>
        <div>{"  "}<span style={{ color: "var(--c-system)" }}>(Get-SecureBootUEFI</span> <span style={{ color: "var(--accent)" }}>-Name</span> dbx<span style={{ color: "var(--c-system)" }}>).bytes)</span> <span style={{ color: "var(--text-3)" }}># dump dbx content</span></div>
      </div>

      {/* ── Verification flow ── */}
      <h3 style={subhead}>{lang === "en" ? "1.2 — Verification flow: how each boot stage is checked" : "1.2 — Tekshiruv oqimi: har bir yuklash bosqichi qanday tekshiriladi"}</h3>
      <P>
        {lang === "en"
          ? <>At each boot stage, UEFI (and then the bootloader, and then the kernel) performs a two-step check: first against dbx (is this binary revoked?), then against db (is this binary trusted?). Both checks must pass. Only if a binary is <Em>not in dbx</Em> AND <Em>is trusted by db</Em> does boot continue.</>
          : <>Har bir yuklash bosqichida UEFI (keyin bootloader va kernel) ikki bosqichli tekshiruv o'tkazadi: avval dbx ga qarshi (bu binary bekor qilinganmi?), keyin db ga qarshi (bu binary ishonchli?). Ikkalasi ham o'tishi kerak. Binary <Em>dbx da yo'q</Em> VA <Em>db tomonidan ishonchli</Em> bo'lsagina yuklash davom etadi.</>}
      </P>
      <div style={{ marginTop: 16 }}>
        <MermaidDiagram chart={verifyChart}
          caption="1-rasm. Secure Boot tekshiruv oqimi: dbx → db → bootloader → OS loader → kernel."
          captionEn="Fig 1. Secure Boot verification flow: dbx → db → bootloader → OS loader → kernel." />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 14 }}>
        {[
          { icon: "shield", color: "var(--c-system)", titleUz: "dbx tekshiruvi — birinchi", titleEn: "dbx check — first",
            bodyUz: "Binary heshi dbx qora ro'yxatida bormi? Agar ha — darhol bloklash. Bu qadam imzolangan lekin zaif yoki yomon ma'lum bo'lgan kodni to'xtatadi.",
            bodyEn: "Is the binary's hash in the dbx blocklist? If yes — block immediately. This step stops code that is signed but known-vulnerable or known-malicious." },
          { icon: "key", color: "var(--c-warn)", titleUz: "db tekshiruvi — ikkinchi", titleEn: "db check — second",
            bodyUz: "Binary'ning sertifikat zanjiri db dagi birorta sertifikatga borib taqaladimi? Aks holda — bloklash. Bu imzosiz yoki noto'g'ri imzolangan kodni to'xtatadi.",
            bodyEn: "Does the binary's certificate chain trace to any certificate in db? If not — block. This stops code that is unsigned or signed by an untrusted key." },
          { icon: "check", color: "var(--c-user)", titleUz: "Muvaffaqiyat → bajarish", titleEn: "Pass → execute",
            bodyUz: "Ikkalasi ham o'tdi: dbx da yo'q, db ga ishonchli. UEFI kodni bajarishga ruxsat beradi. Boshqaruv bootloader'ga o'tadi — u o'z navbatida OS loader uchun xuddi shu tekshiruvni o'tkazadi.",
            bodyEn: "Both passed: not in dbx, trusted by db. UEFI permits execution. Control passes to the bootloader — which in turn runs the same check for the OS loader." },
        ].map((c, i) => (
          <div key={i} style={{ padding: "14px 16px", borderRadius: 10, background: `${c.color}08`, border: `1px solid ${c.color}30` }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
              <span style={{ color: c.color }}><Icon name={c.icon} size={16} /></span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, color: c.color }}>{lang === "en" ? c.titleEn : c.titleUz}</span>
            </div>
            <div style={{ fontSize: 12.5, color: "var(--text-1)", lineHeight: 1.65 }}>{lang === "en" ? c.bodyEn : c.bodyUz}</div>
          </div>
        ))}
      </div>

      {/* ── Modes ── */}
      <h3 style={subhead}>{lang === "en" ? "1.3 — Secure Boot modes" : "1.3 — Secure Boot rejimlari"}</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
        {[
          { name: "Setup Mode", color: "#f5a623",
            bodyUz: "PK yo'q (o'chirilgan yoki hech qachon o'rnatilmagan). Barcha tekshiruvlar o'chirilgan — har qanday .efi yuklanishi mumkin. db/dbx/KEK imzosiz yangilanishi mumkin. Yangi qurilmalarda va custom Secure Boot konfiguratsiyasida ishlatiladi. JUDA XAVFLI — hech qachon ishlab chiqarish tizimida qoldirmang.",
            bodyEn: "No PK (deleted or never enrolled). All verification is disabled — any .efi can load. db/dbx/KEK can be updated without signing. Used on new machines and for custom Secure Boot configurations. VERY DANGEROUS — never leave a production system in this state." },
          { name: "User Mode", color: "var(--c-system)",
            bodyUz: "PK o'rnatilgan, normal operatsiya. Barcha tekshiruvlar faol. db/dbx/KEK yangilanishlari KEK bilan imzolanishi kerak. Windows tizimlarida standart holat. msinfo32 da «Secure Boot State: On» ko'rinadi.",
            bodyEn: "PK is enrolled, normal operation. All verification is active. db/dbx/KEK updates must be signed with KEK. Default state on Windows systems. Shows as \"Secure Boot State: On\" in msinfo32." },
          { name: "Audit Mode", color: "var(--c-warn)",
            bodyUz: "Secure Boot tekshiruvlari bajariladi — lekin muvaffaqiyatsizlikda to'xtamaydi, balki logga yozadi. Muhandislar yangi imzo siyosatlarini test qilish uchun ishlatadi. Foydalanuvchi tizimlarida uchramaydi.",
            bodyEn: "Secure Boot checks run — but on failure they log instead of blocking. Used by engineers to test new signature policies. Not encountered on end-user systems." },
          { name: "Deployed Mode (Windows 11)", color: "var(--accent)",
            bodyUz: "Eng qat'iy rejim. Setup Mode ga kirishdan oldin tizim reset talab qilinadi. Microsoft Windows 11 uchun bu rejimni tavsiya qiladi. Secure Boot konfiguratsiyasini OS tomonidan o'zgartirishga to'sqinlik qiladi — faqat UEFI Setup dan o'zgartirish mumkin.",
            bodyEn: "Most restrictive mode. Switching to Setup Mode requires a system reset first. Microsoft recommends this for Windows 11. Prevents OS-level modification of Secure Boot configuration — changes only possible from UEFI Setup." },
        ].map((m, i) => (
          <div key={i} style={{ padding: "14px 16px", borderRadius: 10, background: `${m.color}08`, border: `1px solid ${m.color}28`, borderLeft: `3px solid ${m.color}` }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: m.color, marginBottom: 6 }}>{m.name}</div>
            <div style={{ fontSize: 12.5, color: "var(--text-1)", lineHeight: 1.68 }}>{lang === "en" ? m.bodyEn : m.bodyUz}</div>
          </div>
        ))}
      </div>

      {/* ── Bypass techniques ── */}
      <h3 style={subhead}>{lang === "en" ? "1.4 — Bypass techniques: how attackers defeat Secure Boot" : "1.4 — Chetlab o'tish texnikalari: hujumchilar Secure Boot ni qanday yengadi"}</h3>
      <P>
        {lang === "en"
          ? <>Secure Boot is not unbreakable. Understanding how it has been bypassed is essential for defenders — each bypass technique points to a specific weakness in the trust model that must be understood and mitigated.</>
          : <>Secure Boot sindirilib bo'lmaydi degani emas. U qanday chetlab o'tilganini tushunish himoyachilar uchun muhim — har bir chetlab o'tish texnikasi ishonch modelidagi ma'lum bir zaiflikka ishora qiladi, uni tushunish va yumshatish kerak.</>}
      </P>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
        {bypasses.map((b, i) => (
          <div key={i} style={{ borderRadius: 12, border: `1px solid ${b.color}30`, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", background: `${b.color}10`, borderBottom: `1px solid ${b.color}20`, flexWrap: "wrap" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 13.5, fontWeight: 700, color: b.color, flex: 1 }}>{b.name}</div>
              <div className="mono" style={{ fontSize: 10, color: "var(--text-3)" }}>{b.year}</div>
              <div style={{ fontSize: 11, color: b.color, background: `${b.color}18`, padding: "2px 8px", borderRadius: 4 }}>{b.severity}</div>
            </div>
            <div style={{ padding: "12px 16px", fontSize: 13, lineHeight: 1.78, color: "var(--text-1)" }}>
              {lang === "en" ? b.bodyEn : b.bodyUz}
            </div>
          </div>
        ))}
      </div>

      {/* ── Linux shim + MOK ── */}
      <h3 style={subhead}>{lang === "en" ? "1.5 — Secure Boot on Linux: shim and MOK" : "1.5 — Linux'da Secure Boot: shim va MOK"}</h3>
      <P>
        {lang === "en"
          ? <>Linux distributions face a challenge: Microsoft controls what's in db (the allowed signature list), and Linux bootloaders aren't signed by Microsoft's certificate. The solution is a tiny intermediary called <Term>shim</Term>.</>
          : <>Linux tarqatmalari bir muammo bilan duch keladi: Microsoft db ni (ruxsat etilgan imzo ro'yxati) nazorat qiladi, va Linux bootloader'lari Microsoft sertifikati bilan imzolanmagan. Yechim — <Term>shim</Term> deb ataladigan kichik vositachi.</>}
      </P>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, margin: "14px 0", padding: "16px 18px", background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 12 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>// LINUX SECURE BOOT CHAIN</div>
        {[
          { from: "UEFI firmware (db)", arrow: "verifies →", to: "shim.efi", note: lang === "en" ? "shim is signed by Microsoft UEFI CA (in db on all Windows-certified machines)" : "shim Microsoft UEFI CA tomonidan imzolangan (barcha Windows-sertifikatlangan mashinalarda db da)" },
          { from: "shim.efi", arrow: "verifies →", to: "grubx64.efi", note: lang === "en" ? "shim verifies GRUB using its own embedded certificate (distro-specific, e.g. Red Hat, Canonical)" : "shim GRUB ni o'z ichida joylashgan sertifikat yordamida tekshiradi (tarqatmaga xos, masalan Red Hat, Canonical)" },
          { from: "grubx64.efi", arrow: "verifies →", to: "Linux kernel", note: lang === "en" ? "GRUB verifies the kernel image using the same shim-trusted certificate" : "GRUB yadro tasvirini xuddi shu shim-ishonchli sertifikat yordamida tekshiradi" },
          { from: "Linux kernel", arrow: "verifies →", to: "kernel modules", note: lang === "en" ? "kernel enforces module signature checking when Secure Boot is active (no unsigned .ko files)" : "Secure Boot faol bo'lganda kernel modul imzo tekshiruvini ta'minlaydi (imzosiz .ko faylar yo'q)" },
        ].map((row, i) => (
          <div key={i} style={{ display: "flex", gap: 10, fontSize: 12.5, alignItems: "flex-start", padding: "6px 0", borderBottom: i < 3 ? "1px solid var(--border)" : "none" }}>
            <span className="mono" style={{ color: "var(--c-user)", flexShrink: 0, minWidth: 130 }}>{row.from}</span>
            <span className="mono" style={{ color: "var(--text-3)", flexShrink: 0 }}>{row.arrow}</span>
            <span className="mono" style={{ color: "var(--accent)", flexShrink: 0, minWidth: 110 }}>{row.to}</span>
            <span style={{ color: "var(--text-2)", fontSize: 11.5, lineHeight: 1.5 }}>{row.note}</span>
          </div>
        ))}
      </div>
      <P>
        {lang === "en"
          ? <><Term>MOK (Machine Owner Key)</Term> is shim's mechanism for adding user-defined keys. When you build a custom Linux kernel module (e.g., a proprietary GPU driver like NVIDIA), you can sign it with your own key and register that key with shim via <code>mokutil --import my.cer</code>. On next boot, shim shows a MOK enrollment screen — you confirm the fingerprint, and shim adds your key to its trusted database. From then on, your self-signed module loads under Secure Boot without disabling it.</>
          : <><Term>MOK (Machine Owner Key)</Term> — shim ning foydalanuvchi tomonidan belgilangan kalitlarni qo'shish mexanizmi. Maxsus Linux yadro modulini (masalan, NVIDIA kabi mulkiy GPU drayveri) qurishda, uni o'z kalitingiz bilan imzolab, <code>mokutil --import my.cer</code> orqali bu kalitni shim bilan ro'yxatdan o'tkazishingiz mumkin. Keyingi yuklanishda shim MOK ro'yxatga olish ekranini ko'rsatadi — barmoq izini tasdiqlaysiz va shim kalitingizni o'zining ishonchli ma'lumotlar bazasiga qo'shadi. Bundan keyin, o'z-o'zini imzolagan modulingiz Secure Boot ni o'chirmasdan yuklanadi.</>}
      </P>

      {/* ── Practical ── */}
      <h3 style={subhead}>{lang === "en" ? "1.6 — Practical: verify, enable and harden Secure Boot" : "1.6 — Amaliy: Secure Boot ni tekshirish, yoqish va mustahkamlash"}</h3>
      <div style={{ margin: "12px 0", padding: "16px 18px", borderRadius: 12, background: "var(--bg-2)", border: "1px solid var(--border)", fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 2 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>// SECURE BOOT — practical commands</div>
        <div style={{ color: "var(--text-3)" }}># {lang === "en" ? "1. Check Secure Boot status (PowerShell, run as Admin)" : "1. Secure Boot holatini tekshirish (PowerShell, Admin sifatida)"}</div>
        <div><span style={{ color: "var(--c-system)" }}>Confirm-SecureBootUEFI</span>        <span style={{ color: "var(--text-3)" }}>{lang === "en" ? "# True / False" : "# True / False"}</span></div>
        <div style={{ marginTop: 6, color: "var(--text-3)" }}># {lang === "en" ? "2. Check BIOS Mode (msinfo32 or PowerShell)" : "2. BIOS rejimini tekshirish (msinfo32 yoki PowerShell)"}</div>
        <div><span style={{ color: "var(--c-user)" }}>(Get-WmiObject</span> Win32_OperatingSystem<span style={{ color: "var(--c-user)" }}>)</span>.OSArchitecture</div>
        <div><span style={{ color: "var(--c-system)" }}>msinfo32</span>   <span style={{ color: "var(--text-3)" }}>{lang === "en" ? "# → BIOS Mode: UEFI (not Legacy)" : "# → BIOS Mode: UEFI (Legacy emas)"}</span></div>
        <div style={{ marginTop: 6, color: "var(--text-3)" }}># {lang === "en" ? "3. Check dbx version (how up-to-date is your revocation list?)" : "3. dbx versiyasini tekshirish (revokatsiya ro'yxati qanchalik yangilangan?)"}</div>
        <div><span style={{ color: "var(--c-system)" }}>Get-SecureBootUEFI</span> <span style={{ color: "var(--accent)" }}>-Name</span> <span style={{ color: "var(--c-user)" }}>dbx</span> | <span style={{ color: "var(--c-system)" }}>Select-Object</span> Name, Guid, Attributes</div>
        <div style={{ marginTop: 6, color: "var(--text-3)" }}># {lang === "en" ? "4. Force dbx update (requires KB5025885 installed)" : "4. dbx yangilanishini majburlash (KB5025885 o'rnatilgan bo'lishi kerak)"}</div>
        <div><span style={{ color: "var(--c-user)" }}>wusa.exe</span> /update /kb:5025885</div>
        <div style={{ marginTop: 6, color: "var(--text-3)" }}># {lang === "en" ? "5. Check if CSM/Legacy is off (must be for full Secure Boot)" : "5. CSM/Legacy o'chirilganligini tekshirish (to'liq Secure Boot uchun kerak)"}</div>
        <div><span style={{ color: "var(--text-3)" }}>{lang === "en" ? "# → in UEFI Setup: Boot → CSM → Disabled" : "# → UEFI Setupda: Boot → CSM → Disabled"}</span></div>
      </div>

      <Callout color="var(--c-attack)" icon="skull" titleUz="Asosiy xavf: CSM yoqilgan + eskirgan dbx = Secure Boot bekor" titleEn="Critical risk: CSM enabled + outdated dbx = Secure Boot nullified">
        {lang === "en"
          ? <>Two conditions together make a "Secure Boot" system completely insecure: (1) <strong>CSM / Legacy mode enabled</strong> — this silently disables Secure Boot entirely. Many corporate systems enable CSM for compatibility with older tools without realising it kills Secure Boot. (2) <strong>Outdated dbx</strong> — if the revocation list hasn't been updated in years, dozens of known-vulnerable signed bootloaders can still run freely, including many BYOVD candidates. Check both on every system you assess: <code>msinfo32</code> → BIOS Mode should say UEFI (not Legacy), and dbx should be updated via KB5025885 or later.</>
          : <>Ikki shart birgalikda «Secure Boot» tizimini to'liq xavfli qiladi: (1) <strong>CSM / Legacy rejimi yoqilgan</strong> — bu Secure Boot ni to'liq o'chirib qo'yadi. Ko'plab korporativ tizimlar eski vositalar bilan moslik uchun CSM ni yoqadi — bu Secure Boot ni o'ldirishini tushunmasdan. (2) <strong>Eskirgan dbx</strong> — agar revokatsiya ro'yxati yillar davomida yangilanmagan bo'lsa, o'nlab ma'lum zaif imzolangan bootloader'lar hali ham erkin ishlashi mumkin, jumladan ko'plab BYOVD nomzodlari. Baholayotgan har bir tizimda ikkalasini tekshiring: <code>msinfo32</code> → BIOS Mode UEFI bo'lishi kerak (Legacy emas) va dbx KB5025885 yoki keyingi yamoq orqali yangilanishi kerak.</>}
      </Callout>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────
// L07 — TPM
// ─────────────────────────────────────────────────────────────
function SectionTPM() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="TPM — Trusted Platform Module" uz="" />
      <P>A <Term>Trusted Platform Module (TPM)</Term> is a dedicated hardware security chip — either soldered on the motherboard or implemented as firmware (fTPM inside the CPU). Its job is to perform cryptographic operations in a tamper-resistant environment that the operating system and software cannot directly read or manipulate. Every modern PC sold after 2016 ships with TPM 2.0, and Windows 11 made it a hard requirement. The chip exposes a small but extremely powerful set of primitives: random number generation, asymmetric key generation, HMAC, hashing, and — most importantly — <Term>key sealing</Term> and <Term>platform measurement</Term>.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.1 — TPM 1.2 vs TPM 2.0</h3>
      <P>TPM 1.2 (2003) was designed around a single algorithm suite — SHA-1 for hashing and RSA-2048 for asymmetric operations. It used a single PCR bank of 24 registers. TPM 2.0 (2014) is a complete redesign: algorithm-agnostic (SHA-1, SHA-256, SHA-384, ECC P-256, ECC P-384, AES-128/256 are all supported simultaneously), multiple PCR banks (one per hash algorithm), hierarchies instead of a single owner model, and enhanced key management. Windows 11 dropped TPM 1.2 support entirely because SHA-1 is broken and the old owner model created deployment nightmares for enterprises.</P>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Feature","TPM 1.2","TPM 2.0"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["Standard","TCG 2003","TCG 2014"],
            ["Hash algorithms","SHA-1 only","SHA-1, SHA-256, SHA-384"],
            ["Asymmetric crypto","RSA-2048 only","RSA, ECC P-256/P-384"],
            ["Symmetric crypto","None","AES-128/256"],
            ["PCR banks","1 bank × 24 registers","Multiple banks (one per alg)"],
            ["Key hierarchy","Single owner","3 hierarchies: Platform/Owner/Endorsement"],
            ["Windows 11 support","No (dropped)","Yes (required)"],
            ["Implementation","Discrete chip or integrated","Discrete chip, fTPM (CPU firmware), or vTPM"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--text-0)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?12:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.2 — PCR Banks (Platform Configuration Registers)</h3>
      <P>PCRs are the heart of TPM's measurement capability. Each register is 20 bytes (SHA-1) or 32 bytes (SHA-256) and follows one rule: it can only be <Em>extended</Em>, never written directly. Extending PCR[n] means: <code style={{fontFamily:"var(--font-mono)",fontSize:12,background:"rgba(255,255,255,0.06)",padding:"1px 6px",borderRadius:4}}>PCR[n] = Hash(PCR[n] || new_measurement)</code>. This creates a tamper-evident log — you cannot forge a PCR value without re-running every measurement in the correct order from boot time.</P>
      <P>During boot, firmware measures each component before executing it and extends the result into specific PCRs. The UEFI firmware spec (TCG EFI Platform Specification) assigns PCRs as follows:</P>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["PCR","What is measured"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["PCR[0]","UEFI firmware code (BIOS ROM)"],
            ["PCR[1]","UEFI firmware configuration (NVRAM settings)"],
            ["PCR[2]","UEFI Option ROMs (expansion card firmware)"],
            ["PCR[3]","UEFI Option ROM configuration"],
            ["PCR[4]","Boot Manager (bootmgr.efi) and boot attempts"],
            ["PCR[5]","Boot Manager configuration (BCD store)"],
            ["PCR[6]","Resume from S4/S5 wake events"],
            ["PCR[7]","Secure Boot state and policy"],
            ["PCR[8-9]","Windows Boot Loader (winload.efi)"],
            ["PCR[11]","BitLocker access control (BitLocker-specific)"],
            ["PCR[12-15]","OS-defined — Windows uses for Kernel, ELAM, policies"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?12:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>
      <Callout color="var(--c-system)" icon="info" titleEn="Why PCR chaining matters for BitLocker" titleUz="">
        BitLocker seals its Volume Master Key (VMK) against PCR[0,2,4,7,11] by default. If anyone replaces the bootloader, alters UEFI firmware, or changes the Secure Boot policy, those PCRs change — the TPM refuses to unseal the key, and the drive stays encrypted even if the attacker yanked the disk out and plugged it into another machine.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.3 — TPM Operations: Key Gen, Sealing, Unsealing, Attestation</h3>
      <P><strong>Key Generation:</strong> The TPM contains a permanent Endorsement Key (EK) burned in at manufacture — a 2048-bit RSA key pair. The private half never leaves the chip. From this root, the TPM can derive an unlimited number of child keys (Storage Root Key → application keys). Keys can be set as <Em>non-migratable</Em> so they physically cannot be exported even with the owner's password.</P>
      <P><strong>Key Sealing:</strong> This is the unique killer feature. The TPM can encrypt ("seal") an arbitrary secret blob and record the current PCR values at sealing time. Unsealing requires the TPM, the same machine (same PCR values), and optionally a PIN. If the PCRs differ at unseal time — because someone swapped the bootloader or changed firmware — the TPM refuses. This makes sealed keys useless on a different machine or after system tampering.</P>
      <P><strong>Remote Attestation:</strong> A remote server can ask: "Prove to me what software is running on your machine." The TPM signs the current PCR values with its EK (or an Attestation Identity Key derived from it). The server checks the signature against the manufacturer's certificate, verifies the PCR values match a known-good policy, and only then trusts the client. This is how Azure Attestation, TPM-based device health, and Zero Trust deployments work.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.4 — TPM in Windows</h3>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:14,marginTop:12}}>
        {[
          {title:"BitLocker",color:"var(--c-ok)",body:"Seals the Volume Master Key against PCR[0,2,4,7,11]. On every boot the TPM checks those PCRs — if the system is unmodified, the key is automatically released (transparent unlock). If they mismatch, BitLocker demands the 48-digit recovery key."},
          {title:"Windows Hello",color:"var(--c-system)",body:"Your PIN or biometric template unlocks a TPM-protected RSA private key. The key never leaves the chip — Windows Hello private keys are non-exportable by design. Remote attackers who steal your NTUSER.DAT get nothing useful."},
          {title:"Credential Guard",color:"var(--accent)",body:"Uses VBS (Virtualization-Based Security) + a TPM-sealed key to protect NTLM hashes and Kerberos tickets inside an isolated VM (VSM). Even if the OS kernel is compromised, Mimikatz cannot extract credentials because they live in a VM the kernel can't access."},
          {title:"vTPM (Virtual TPM)",color:"var(--c-warn)",body:"Hyper-V guests get a software-emulated TPM 2.0 backed by the host's physical TPM. This allows BitLocker, Windows Hello, and Credential Guard inside VMs. In Azure, the vTPM root is the hardware TPM of the physical server."},
        ].map(c=><div key={c.title} style={{padding:"14px 16px",background:`${c.color}08`,border:`1px solid ${c.color}25`,borderLeft:`3px solid ${c.color}`,borderRadius:8}}>
          <div style={{fontWeight:700,fontSize:14,color:c.color,marginBottom:6}}>{c.title}</div>
          <div style={{fontSize:13,color:"var(--text-1)",lineHeight:1.6}}>{c.body}</div>
        </div>)}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.5 — TPM Attack Vectors</h3>
      <P><strong>Evil Maid Attack:</strong> Physical access to an unattended laptop. If BitLocker is in "TPM-only" mode (no PIN), the disk unlocks automatically on boot — so an attacker who cold-boots the machine gets a fully unlocked Windows session. Mitigation: enable BitLocker pre-boot PIN (TPM+PIN mode) so the TPM alone is insufficient.</P>
      <P><strong>TPM Bus Sniffing:</strong> Discrete TPM chips communicate over an LPC or SPI bus on the motherboard. An attacker with physical access and a logic analyzer can intercept the plaintext VMK as it travels from the TPM chip to the CPU. Intel PTT (fTPM) and AMD fTPM mitigate this — the TPM lives inside the CPU, no external bus. CVE-2021-1782 demonstrated bus sniffing against discrete TPMs to extract BitLocker keys from Surface Pro 3.</P>
      <P><strong>TPM-Fail (CVE-2019-11090 / CVE-2019-16863):</strong> Side-channel timing attack against some STMicroelectronics (ST33) and Infineon TPM chips during ECDSA signature operations. By measuring response time differences down to nanoseconds, an attacker can recover the private ECC key after ~1,000 operations. Microsoft patched via firmware update — this is why keeping TPM firmware updated matters.</P>
      <P><strong>TPM Reset Attack / S3 Sleep:</strong> Some old systems allowed the TPM to be reset via S3 resume state without verifying PCRs, allowing an attacker to replace the bootloader and then resume from S3 with the TPM already unsealed. Modern UEFI with PCR[6] measurement and Windows BitLocker's sleep protection (hibernate instead of S3) mitigates this.</P>
      <Callout color="var(--c-err)" icon="warning" titleEn="fTPM vs discrete TPM — which is safer?" titleUz="">
        Intel PTT (fTPM) runs in the Management Engine (ME), AMD PSP runs in the Platform Security Processor. Both eliminate the bus sniffing attack but introduce a new trust dependency: the ME/PSP firmware. CVE-2017-5705 (Intel ME critical vulnerability) showed the entire fTPM chain could be compromised if ME is exploited. Discrete TPMs are physically isolated — they just have the bus exposure problem. Neither is universally "safer."
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.6 — Practical Commands</h3>
      <pre style={{background:"rgba(0,0,0,0.35)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 16px",fontSize:12,lineHeight:1.7,overflowX:"auto",marginTop:10}}><code>{`# Check TPM status in PowerShell (run as Administrator)
Get-Tpm

# Output shows:
# TpmPresent     : True
# TpmReady       : True
# TpmEnabled     : True
# TpmActivated   : True
# ManagedAuthLevel: Full

# Get TPM spec version
Get-Tpm | Select-Object -ExpandProperty ManufacturerVersion

# Check TPM in Device Manager → Security Devices → Trusted Platform Module 2.0

# tpm.msc — MMC snap-in: shows manufacturer, version, PCR status
# Start → Run → tpm.msc

# Check BitLocker PCR binding
manage-bde -protectors -get C:
# Look for "TPM And PIN" or "TPM" under Key Protectors`}</code></pre>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="TPM — Ishonchli Platforma Moduli" en="" />
      <P><Term>Trusted Platform Module (TPM)</Term> — maxsus apparat xavfsizlik chipi bo'lib, u anakartga lehimlanadi yoki protsessor ichida dasturiy ta'minot (fTPM) sifatida amalga oshiriladi. Uning vazifasi — operatsion tizim va dasturiy ta'minot bevosita o'qiy yoki o'zgartira olmaydigan buzilishga chidamli muhitda kriptografik amallarni bajarish. 2016 yildan keyin sotilgan har bir zamonaviy kompyuter TPM 2.0 bilan keladi va Windows 11 uni majburiy talab qildi. Chip kichik, lekin juda kuchli ibtidoiylar to'plamini taqdim etadi: tasodifiy sonlar generatsiyasi, assimetrik kalit yaratish, HMAC, xeshlash va — eng muhimi — <Term>kalitlarni muhrlab qo'yish</Term> va <Term>platforma o'lchovi</Term>.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.1 — TPM 1.2 vs TPM 2.0</h3>
      <P>TPM 1.2 (2003) bitta algoritmlar to'plami atrofida loyihalangan — xeshlash uchun SHA-1 va assimetrik amallar uchun RSA-2048. U 24 registrli bitta PCR bankidan foydalangan. TPM 2.0 (2014) to'liq qayta loyihalash: algoritm-agnostik (SHA-1, SHA-256, SHA-384, ECC P-256, ECC P-384, AES-128/256 bir vaqtda qo'llab-quvvatlanadi), bir nechta PCR banklari (har bir xesh algoritmi uchun bittadan), yagona egasi modeli o'rniga ierarxiyalar va takomillashtirilgan kalit boshqaruvi. Windows 11 TPM 1.2 qo'llab-quvvatlashini butunlay olib tashladi, chunki SHA-1 buzilgan.</P>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Xususiyat","TPM 1.2","TPM 2.0"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["Standart","TCG 2003","TCG 2014"],
            ["Xesh algoritmlari","Faqat SHA-1","SHA-1, SHA-256, SHA-384"],
            ["Assimetrik kriptografiya","Faqat RSA-2048","RSA, ECC P-256/P-384"],
            ["Simmetrik kriptografiya","Yo'q","AES-128/256"],
            ["PCR banklari","1 bank × 24 registr","Bir nechta bank (har alg uchun)"],
            ["Kalit ierarxiyasi","Yagona egasi","3 ierarxiya: Platforma/Egasi/Tasdiqlash"],
            ["Windows 11 qo'llab-quvvatlashi","Yo'q (olib tashlangan)","Ha (talab qilinadi)"],
            ["Amalga oshirish","Diskret chip yoki integratsiyalangan","Diskret chip, fTPM (CPU), yoki vTPM"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--text-0)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?12:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.2 — PCR Banklari (Platforma Konfiguratsiya Registrlari)</h3>
      <P>PCRlar TPM o'lchov imkoniyatining yuragini tashkil etadi. Har bir registr 20 bayt (SHA-1) yoki 32 bayt (SHA-256) va bitta qoidaga amal qiladi: u faqat <Em>kengaytirilishi</Em> mumkin, to'g'ridan-to'g'ri yozib bo'lmaydi. PCR[n] ni kengaytirish: <code style={{fontFamily:"var(--font-mono)",fontSize:12,background:"rgba(255,255,255,0.06)",padding:"1px 6px",borderRadius:4}}>PCR[n] = Hash(PCR[n] || yangi_o'lchov)</code>. Bu buzilishga chidamli jurnal yaratadi — to'g'ri tartibda har bir o'lchovni qayta ishlatmasdan PCR qiymatini soxtalashtirish mumkin emas.</P>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["PCR","Nima o'lchanadi"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["PCR[0]","UEFI proshivka kodi (BIOS ROM)"],
            ["PCR[1]","UEFI proshivka konfiguratsiyasi (NVRAM sozlamalari)"],
            ["PCR[2]","UEFI Option ROMlari (kengaytirish kartasi proshivkasi)"],
            ["PCR[3]","UEFI Option ROM konfiguratsiyasi"],
            ["PCR[4]","Boot menejer (bootmgr.efi) va yuklash urinishlari"],
            ["PCR[5]","Boot menejer konfiguratsiyasi (BCD do'koni)"],
            ["PCR[6]","S4/S5 uyqu holatidan tiklash hodisalari"],
            ["PCR[7]","Secure Boot holati va siyosati"],
            ["PCR[8-9]","Windows Boot Loader (winload.efi)"],
            ["PCR[11]","BitLocker kirish nazorati (BitLocker-spetsifik)"],
            ["PCR[12-15]","OT tomonidan belgilangan — Windows Kernel, ELAM, siyosatlar uchun"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?12:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>
      <Callout color="var(--c-system)" icon="info" titleUz="Nima uchun PCR zanjirlash BitLocker uchun muhim" titleEn="">
        BitLocker standart bo'yicha PCR[0,2,4,7,11] ga nisbatan Volume Master Key (VMK) ni muhrlab qo'yadi. Har bir yuklashda TPM bu PCRlarni tekshiradi — agar tizim o'zgartirilmagan bo'lsa, kalit avtomatik ravishda chiqariladi (shaffof qulfdan chiqarish). Agar ular mos kelmasa, BitLocker 48 raqamli tiklanish kalitini talab qiladi.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.3 — TPM Amallari: Kalit Yaratish, Muhrlab Qo'yish, Attestatsiya</h3>
      <P><strong>Kalit Yaratish:</strong> TPM ishlab chiqarish paytida yoqilgan doimiy Tasdiqlash Kalitini (EK) o'z ichiga oladi — 2048-bitli RSA kalit jufti. Maxfiy yarmi chipni hech qachon tark etmaydi. Bu ildizdan TPM cheksiz miqdordagi bolalar kalitlarini chiqarishi mumkin (Saqlash Ildiz Kaliti → ilova kalitlari). Kalitlar <Em>ko'chirmaydigan</Em> sifatida belgilanishi mumkin, shuning uchun ular egasining paroli bilan ham jismonan eksport qilinishi mumkin emas.</P>
      <P><strong>Kalitlarni Muhrlab Qo'yish:</strong> Bu noyob o'ldiruvchi xususiyat. TPM ixtiyoriy maxfiy blobni shifrlashi ("muhrlab qo'yishi") va muhrlab qo'yish paytidagi joriy PCR qiymatlarini yozib olishi mumkin. Muhrni ochish uchun TPM, xuddi shu mashina (xuddi shu PCR qiymatlari) va ixtiyoriy ravishda PIN talab qilinadi. Agar PCRlar muhrni ochish vaqtida farq qilsa — kimdir bootloaderni almashtirgan yoki proshivkani o'zgartirgan bo'lsa — TPM rad etadi. Bu muhrlangan kalitlarni boshqa mashinada yoki tizim buzilgandan so'ng foydasiz qiladi.</P>
      <P><strong>Masofaviy Attestatsiya:</strong> Masofaviy server so'rashi mumkin: "Menga mashiningizda qaysi dasturiy ta'minot ishlayotganini isbotlang." TPM joriy PCR qiymatlarini EK bilan (yoki undan olingan Attestatsiya Identifikatsiya Kaliti bilan) imzolaydi. Server imzoni ishlab chiqaruvchining sertifikatiga nisbatan tekshiradi, PCR qiymatlarining ma'lum yaxshi siyosatga mos kelishini tekshiradi va faqat shundan so'ng mijozga ishonadi. Azure Attestation, TPM-asosli qurilma salomatligi va Zero Trust joylashtirishlar shunday ishlaydi.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.4 — Windows'da TPM</h3>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:14,marginTop:12}}>
        {[
          {title:"BitLocker",color:"var(--c-ok)",body:"Volume Master Key (VMK) ni PCR[0,2,4,7,11] ga nisbatan muhrlab qo'yadi. Har bir yuklashda TPM bu PCRlarni tekshiradi — tizim o'zgartirilmagan bo'lsa, kalit avtomatik chiqariladi. Agar mos kelmasa, BitLocker 48 raqamli tiklanish kalitini talab qiladi."},
          {title:"Windows Hello",color:"var(--c-system)",body:"PIN yoki biometrik shabloningiz TPM tomonidan himoyalangan RSA maxfiy kalitini ochadi. Kalit chipni hech qachon tark etmaydi — Windows Hello maxfiy kalitlari dizayn bo'yicha eksport qilinmaydigan. NTUSER.DAT ni o'g'irlagan masofaviy tajovuzkorlar foydali narsa ololmaydi."},
          {title:"Credential Guard",color:"var(--accent)",body:"VBS (Virtualizatsiyaga Asoslangan Xavfsizlik) + TPM tomonidan muhrlangan kalit yordamida NTLM xeshlari va Kerberos chiptalari izolyatsiya qilingan VM (VSM) ichida himoya qilinadi. OS yadro buzilgan bo'lsa ham, Mimikatz hisob ma'lumotlarini chiqara olmaydi."},
          {title:"vTPM (Virtual TPM)",color:"var(--c-warn)",body:"Hyper-V mehmonlari xostning jismoniy TPM tomonidan qo'llab-quvvatlanadigan dasturiy ta'minot-emulatsiya qilingan TPM 2.0 ni oladi. Bu VMlar ichida BitLocker, Windows Hello va Credential Guard'ga imkon beradi."},
        ].map(c=><div key={c.title} style={{padding:"14px 16px",background:`${c.color}08`,border:`1px solid ${c.color}25`,borderLeft:`3px solid ${c.color}`,borderRadius:8}}>
          <div style={{fontWeight:700,fontSize:14,color:c.color,marginBottom:6}}>{c.title}</div>
          <div style={{fontSize:13,color:"var(--text-1)",lineHeight:1.6}}>{c.body}</div>
        </div>)}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.5 — TPM Hujum Vektorlari</h3>
      <P><strong>Evil Maid Hujumi:</strong> Qarovsiz qoldirilgan noutbukka jismoniy kirish. Agar BitLocker "faqat TPM" rejimida bo'lsa (PIN yo'q), disk yuklashda avtomatik qulfdan chiqariladi — shuning uchun sovuq-yuklash qiladigan tajovuzkor to'liq qulfdan chiqarilgan Windows sessiyasini oladi. Yengillashtirish: BitLocker yuklashdan oldingi PINni yoqish (TPM+PIN rejimi).</P>
      <P><strong>TPM Avtobusini Tinglash:</strong> Diskret TPM chiplari anakartdagi LPC yoki SPI avtobusi orqali muloqot qiladi. Jismoniy kirish va mantiq analizatoriga ega tajovuzkor VMK ning TPM chipidan CPUga sayohat qilayotganini ushlashi mumkin. Intel PTT (fTPM) va AMD fTPM buni yumshatadi — TPM CPU ichida joylashgan, tashqi avtobus yo'q.</P>
      <P><strong>TPM-Fail (CVE-2019-11090 / CVE-2019-16863):</strong> Ba'zi TPM chiplarida ECDSA imzolash amallari davomida yon kanal vaqt hujumi. Nanosaniyagacha javob vaqti farqlarini o'lchash orqali tajovuzkor ~1,000 amaldan so'ng ECC maxfiy kalitini qayta tiklashi mumkin. Microsoft proshivka yangilanishi orqali yamoqladi.</P>
      <P><strong>TPM Reset Hujumi / S3 Uyqusi:</strong> Ba'zi eski tizimlarda PCRlarni tekshirmasdan S3 tiklash holati orqali TPMni tiklashga ruxsat berildi, bu tajovuzkorga bootloaderni almashtirish va keyin TPM allaqachon muhri ochilgan holda S3 dan davom etish imkonini berdi.</P>
      <Callout color="var(--c-err)" icon="warning" titleUz="fTPM vs diskret TPM — qaysi birisi xavfsizroq?" titleEn="">
        Intel PTT (fTPM) Management Engine (ME) ichida ishlaydi, AMD PSP Platform Security Processor da ishlaydi. Ikkalasi ham avtobus tinglash hujumini yo'q qiladi, lekin yangi ishonch bog'liqligini kiritadi: ME/PSP proshivka. CVE-2017-5705 (Intel ME kritik zaiflik) butun fTPM zanjiriga zarar etkazishi mumkinligini ko'rsatdi. Diskret TPMlar jismonan izolyatsiya qilingan — ularda shunchaki avtobus ta'sir muammosi bor.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.6 — Amaliy Buyruqlar</h3>
      <pre style={{background:"rgba(0,0,0,0.35)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 16px",fontSize:12,lineHeight:1.7,overflowX:"auto",marginTop:10}}><code>{`# PowerShell'da TPM holatini tekshirish (Administrator sifatida)
Get-Tpm

# Natijada:
# TpmPresent     : True
# TpmReady       : True
# TpmEnabled     : True
# TpmActivated   : True

# TPM spec versiyasini olish
Get-Tpm | Select-Object -ExpandProperty ManufacturerVersion

# tpm.msc — MMC snap-in: ishlab chiqaruvchi, versiya, PCR holatini ko'rsatadi
# Boshlash → Ishga tushirish → tpm.msc

# BitLocker PCR bog'liqligini tekshirish
manage-bde -protectors -get C:`}</code></pre>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// L08 — Windows Registry
// ─────────────────────────────────────────────────────────────
function SectionRegistry() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="Windows Registry" uz="" />
      <P>The <Term>Windows Registry</Term> is the central hierarchical database where Windows stores virtually all configuration: hardware settings, driver parameters, user preferences, installed software, security policies, and COM object registrations. It is not a single file — the registry is a collection of binary files called <Term>hives</Term>, loaded into memory by the kernel at boot time and kept in sync on disk. From an attacker's perspective, the registry is one of the most valuable real estate in the OS: dozens of well-known locations are checked automatically at login, at service start, and on DLL load — making it the #1 persistence mechanism for malware.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.1 — Five Root Keys</h3>
      <P>The registry tree has five root keys, each serving a distinct purpose:</P>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Root Key","Abbreviation","Purpose"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["HKEY_LOCAL_MACHINE","HKLM","Machine-wide settings: hardware, drivers, services, installed software, security policy. Changes require admin rights."],
            ["HKEY_CURRENT_USER","HKCU","Settings for the currently logged-in user. Mapped from HKU\\<SID>. Each user has their own subtree."],
            ["HKEY_CLASSES_ROOT","HKCR","File type associations and COM/OLE object registrations. Merged view of HKLM\\Software\\Classes and HKCU\\Software\\Classes."],
            ["HKEY_USERS","HKU","All loaded user profiles. HKCU is a symbolic link into here. Includes .DEFAULT (used before login) and S-1-5-18 (LocalSystem)."],
            ["HKEY_CURRENT_CONFIG","HKCC","Hardware profile for the current boot. A symbolic link to HKLM\\SYSTEM\\CurrentControlSet\\Hardware Profiles\\Current."],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":j===1?"var(--c-system)":"var(--text-1)",fontFamily:j<2?"var(--font-mono)":"inherit",fontSize:j<2?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>
      <Callout color="var(--c-system)" icon="info" titleEn="HKLM vs HKCU — the permission model" titleUz="">
        HKLM requires Administrator or SYSTEM to write. HKCU is writable by the current user with no elevation. This split is intentional — malware that runs as a low-privileged user can still persist via HKCU Run keys without triggering UAC prompts.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.2 — Data Types</h3>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Type","ID","Description","Example use"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["REG_SZ","1","Plain Unicode string","InstallPath, service descriptions"],
            ["REG_EXPAND_SZ","2","String with environment variable references like %SystemRoot%","ImagePath for services"],
            ["REG_BINARY","3","Raw binary data","Hardware info, encryption blobs"],
            ["REG_DWORD","4","32-bit integer (little-endian)","Flags, timeout values, feature toggles"],
            ["REG_QWORD","11","64-bit integer","Large counts, timestamps"],
            ["REG_MULTI_SZ","7","Array of strings, each null-terminated, double-null at end","DependOnService, ContentIndex"],
            ["REG_LINK","6","Symbolic link to another registry key","HKCU → HKU\\<SID>"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":j===1?"var(--c-warn)":"var(--text-1)",fontFamily:j<2?"var(--font-mono)":"inherit",fontSize:j<2?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.3 — Hive Files on Disk</h3>
      <P>The registry lives on disk as a set of binary files called hives. Each hive has a primary file, a transaction log (.LOG1/.LOG2), and optionally a backup (.SAV). Windows uses a write-ahead log — changes are journaled before being committed to the primary file, so a crash mid-write doesn't corrupt the hive.</P>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Hive name","Disk path","Contents"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["SYSTEM","C:\\Windows\\System32\\config\\SYSTEM","Boot config, driver load order, CurrentControlSet"],
            ["SOFTWARE","C:\\Windows\\System32\\config\\SOFTWARE","Installed programs, Windows components, policies"],
            ["SAM","C:\\Windows\\System32\\config\\SAM","Local user accounts and password hashes (locked while Windows runs)"],
            ["SECURITY","C:\\Windows\\System32\\config\\SECURITY","Security policy, LSA secrets, cached domain credentials"],
            ["DEFAULT","C:\\Windows\\System32\\config\\DEFAULT","Default user profile (used before any user logs in)"],
            ["NTUSER.DAT","C:\\Users\\<username>\\NTUSER.DAT","Per-user settings → becomes HKCU when user logs in"],
            ["UsrClass.dat","C:\\Users\\<username>\\AppData\\Local\\Microsoft\\Windows\\UsrClass.dat","User-specific class registrations and shell settings"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":j===1?"var(--c-system)":"var(--text-1)",fontFamily:j<2?"var(--font-mono)":"inherit",fontSize:j<2?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>
      <Callout color="var(--c-err)" icon="warning" titleEn="SAM and SECURITY are locked" titleUz="">
        Windows locks SAM and SECURITY with an exclusive kernel handle while running — you cannot simply copy them. Attackers use Volume Shadow Copies (<code>vssadmin list shadows</code>), registry export via reg.exe SAVE, or tools like <code>secretsdump.py</code> to extract offline copies. SAM contains NTLM hashes that can be pass-the-hash attacked without cracking.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.4 — Registry and Boot: How Keys Are Loaded</h3>
      <P>The boot sequence depends heavily on the registry. The SYSTEM hive is the only hive the kernel loads itself — every other hive is loaded later. The kernel reads <code style={{fontFamily:"var(--font-mono)",fontSize:12,background:"rgba(255,255,255,0.06)",padding:"1px 6px",borderRadius:4}}>HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\BootExecute</code> to find programs that must run before the session manager starts (e.g., <code>autocheck autochk *</code> — the disk checker). Then <code>smss.exe</code> loads all other hives, starts subsystems, and creates sessions.</P>
      <P>The "CurrentControlSet" you see in the registry is actually a symbolic link to either ControlSet001 or ControlSet002. Windows rotates between these on each successful boot so that if a bad driver was added, you can boot into the Last Known Good Configuration (ControlSet002), which was the last successfully booted set.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.5 — Persistence Locations (Attacker's Registry)</h3>
      <P>Malware almost universally uses the registry for persistence. The most commonly abused keys — checked automatically by Windows on every login or service start:</P>
      <pre style={{background:"rgba(0,0,0,0.35)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 16px",fontSize:12,lineHeight:1.7,overflowX:"auto",marginTop:10}}><code>{`# Auto-run at every user login (low-priv — HKCU)
HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run
HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\RunOnce

# Auto-run at every login (needs admin — HKLM)
HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run
HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\RunOnce

# Service definitions (needs admin)
HKLM\\SYSTEM\\CurrentControlSet\\Services\\<ServiceName>
  → ImagePath = path to executable or driver
  → Start     = 0x00 (Boot) | 0x01 (System) | 0x02 (Auto) | 0x03 (Manual)

# DLL injection into EVERY process — highly dangerous
HKLM\\Software\\Microsoft\\Windows NT\\CurrentVersion\\Windows\\AppInit_DLLs
  → LoadAppInit_DLLs = 1 to enable (disabled by default on Windows 8+)

# Winlogon notification packages (rare but used by bootkits)
HKLM\\Software\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon\\Notify

# COM object hijacking (no admin needed for HKCU)
HKCU\\Software\\Classes\\CLSID\\{<GUID>}\\InprocServer32
  → Override a system COM object with your own DLL`}</code></pre>
      <Callout color="var(--c-err)" icon="warning" titleEn="AppInit_DLLs — the nuclear persistence option" titleUz="">
        Any DLL listed under AppInit_DLLs is injected into every process that loads user32.dll — which is almost every GUI application. Malware like Carberp, Zeus, and Flame abused this. Windows 8+ requires the DLL to be signed when Secure Boot is active, but many legacy systems still have this vector open.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.6 — Monitoring the Registry</h3>
      <P><strong>Sysmon Event ID 13 (RegistryValueSet):</strong> Logs registry value write operations. Configure Sysmon to monitor the Run/RunOnce keys, Services ImagePath, AppInit_DLLs — any write to these is immediately suspicious. Pair with Event ID 12 (key creation) and 14 (key rename — a trick to evade simple value monitors).</P>
      <P><strong>Process Monitor (Sysinternals):</strong> Real-time registry monitoring with full stack traces. Filter by path (e.g., "Path contains Run") and see exactly which process, which thread, and what stack called the write. Essential for malware analysis and incident response.</P>
      <P><strong>Autoruns (Sysinternals):</strong> The definitive tool for finding persistence. Scans 100+ autostart locations in the registry (and filesystem), shows the signed/unsigned status of each binary, highlights entries with VirusTotal hits. Run as Administrator and check "Hide Microsoft entries" to focus on third-party items.</P>
      <pre style={{background:"rgba(0,0,0,0.35)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 16px",fontSize:12,lineHeight:1.7,overflowX:"auto",marginTop:10}}><code>{`# Export registry hive offline (needs admin)
reg export HKLM\\SOFTWARE C:\\backup\\software.reg

# Save binary hive (for offline analysis with tools like regedit /L)
reg save HKLM\\SAM C:\\backup\\sam.bak

# Query a specific value
reg query HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run

# PowerShell: find all Run key entries across all users
Get-Item "HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run"
Get-Item "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run"

# Check if AppInit_DLLs is enabled
Get-ItemProperty "HKLM:\\Software\\Microsoft\\Windows NT\\CurrentVersion\\Windows" |
  Select-Object AppInit_DLLs, LoadAppInit_DLLs`}</code></pre>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="Windows Registry" en="" />
      <P><Term>Windows Registry</Term> — Windows deyarli barcha konfiguratsiyani saqlaydigan markaziy ierarxik ma'lumotlar bazasi: apparat sozlamalari, drayver parametrlari, foydalanuvchi afzalliklari, o'rnatilgan dasturiy ta'minot, xavfsizlik siyosatlari va COM ob'ekt ro'yxatga olinishi. Bu bitta fayl emas — registry yadro tomonidan yuklash vaqtida xotiraga yuklanadigan <Term>hive</Term> deb ataladigan ikkilik fayllar to'plami. Tajovuzkor nuqtai nazaridan, registry OTdagi eng qimmatli ko'chmas mulklardan biri: o'nlab ma'lum joylar har bir loginда, servis boshlanishida va DLL yuklanishida avtomatik tekshiriladi — bu zararli dasturlar uchun №1 persistenslik mexanizmi.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.1 — Beshta Asosiy Kalit</h3>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Asosiy kalit","Qisqartma","Maqsad"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["HKEY_LOCAL_MACHINE","HKLM","Mashina-keng sozlamalar: apparat, drayverlar, servislar, o'rnatilgan dasturiy ta'minot, xavfsizlik siyosati. O'zgartirish admin huquqlarini talab qiladi."],
            ["HKEY_CURRENT_USER","HKCU","Hozirda tizimga kirgan foydalanuvchi uchun sozlamalar. HKU\\<SID> dan ko'rsatilgan. Har bir foydalanuvchining o'z pastki daraxti bor."],
            ["HKEY_CLASSES_ROOT","HKCR","Fayl turi bog'liqliklari va COM/OLE ob'ekt ro'yxatga olinishi. HKLM\\Software\\Classes va HKCU\\Software\\Classes ning birlashtirilgan ko'rinishi."],
            ["HKEY_USERS","HKU","Barcha yuklangan foydalanuvchi profillari. HKCU bu yerga simvolik havola. .DEFAULT (logindan oldin) va S-1-5-18 (LocalSystem) ni o'z ichiga oladi."],
            ["HKEY_CURRENT_CONFIG","HKCC","Joriy yuklash uchun apparat profili. HKLM\\SYSTEM\\CurrentControlSet\\Hardware Profiles\\Current ga simvolik havola."],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":j===1?"var(--c-system)":"var(--text-1)",fontFamily:j<2?"var(--font-mono)":"inherit",fontSize:j<2?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>
      <Callout color="var(--c-system)" icon="info" titleUz="HKLM vs HKCU — ruxsat modeli" titleEn="">
        HKLM ga yozish uchun Administrator yoki SYSTEM talab qilinadi. HKCU hozirgi foydalanuvchi tomonidan ko'tarilmasdan yozilishi mumkin. Bu bo'linish ataylab — past imtiyozli foydalanuvchi sifatida ishlaydigan zararli dastur HKCU Run kalitlari orqali UAC so'rovlarini ishga tushirmasdan persistenslikni saqlay oladi.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.2 — Ma'lumot Turlari</h3>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Tur","ID","Tavsif","Misol foydalanish"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["REG_SZ","1","Oddiy Unicode satr","InstallPath, servis tavsiflari"],
            ["REG_EXPAND_SZ","2","%SystemRoot% kabi muhit o'zgaruvchi havolalari bo'lgan satr","Servislar uchun ImagePath"],
            ["REG_BINARY","3","Xom ikkilik ma'lumot","Apparat ma'lumoti, shifrlash bloblari"],
            ["REG_DWORD","4","32-bitli butun son (little-endian)","Bayroqlar, kutish muddatlari, xususiyat kalitlari"],
            ["REG_QWORD","11","64-bitli butun son","Katta sonlar, vaqt tamg'alari"],
            ["REG_MULTI_SZ","7","Satrlar massivi, har biri null bilan tugaydi","DependOnService, ContentIndex"],
            ["REG_LINK","6","Boshqa registry kalitiga simvolik havola","HKCU → HKU\\<SID>"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":j===1?"var(--c-warn)":"var(--text-1)",fontFamily:j<2?"var(--font-mono)":"inherit",fontSize:j<2?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.3 — Diskdagi Hive Fayllar</h3>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Hive nomi","Disk yo'li","Tarkib"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["SYSTEM","C:\\Windows\\System32\\config\\SYSTEM","Boot konfiguratsiya, drayver yuklash tartibi, CurrentControlSet"],
            ["SOFTWARE","C:\\Windows\\System32\\config\\SOFTWARE","O'rnatilgan dasturlar, Windows komponentlari, siyosatlar"],
            ["SAM","C:\\Windows\\System32\\config\\SAM","Mahalliy foydalanuvchi hisoblari va parol xeshlari (Windows ishlayotganda qulflangan)"],
            ["SECURITY","C:\\Windows\\System32\\config\\SECURITY","Xavfsizlik siyosati, LSA sirlari, keshlanган domen hisob ma'lumotlari"],
            ["DEFAULT","C:\\Windows\\System32\\config\\DEFAULT","Standart foydalanuvchi profili (hech kim kirmagan holda ishlatiladi)"],
            ["NTUSER.DAT","C:\\Users\\<foydalanuvchi>\\NTUSER.DAT","Foydalanuvchiga xos sozlamalar → login paytida HKCU bo'ladi"],
            ["UsrClass.dat","C:\\Users\\<foydalanuvchi>\\AppData\\Local\\Microsoft\\Windows\\UsrClass.dat","Foydalanuvchiga xos sinf ro'yxatga olinishi va shell sozlamalari"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":j===1?"var(--c-system)":"var(--text-1)",fontFamily:j<2?"var(--font-mono)":"inherit",fontSize:j<2?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>
      <Callout color="var(--c-err)" icon="warning" titleUz="SAM va SECURITY qulflangan" titleEn="">
        Windows SAM va SECURITY ni ishlatayotganda eksklyuziv yadro tutqichi bilan qulflaydi — ularni oddiy nusxalab bo'lmaydi. Tajovuzkorlar Volume Shadow Nusxalaridan, reg.exe SAVE dan yoki secretsdump.py kabi vositalardan foydalanadi. SAM buzmasdan pass-the-hash hujum qilish mumkin bo'lgan NTLM xeshlarini o'z ichiga oladi.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.4 — Registry va Yuklash: Kalitlar Qanday Yuklanadi</h3>
      <P>Yuklash ketma-ketligi registryga kuchli bog'liq. SYSTEM hive — yadro o'zi yuklaydigan yagona hive. Yadro <code style={{fontFamily:"var(--font-mono)",fontSize:12,background:"rgba(255,255,255,0.06)",padding:"1px 6px",borderRadius:4}}>HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\BootExecute</code> ni o'qib, sessiya menejeri boshlashidan oldin ishga tushishi kerak bo'lgan dasturlarni topadi (masalan, disk tekshiruvchi). Keyin <code>smss.exe</code> barcha boshqa hivelarni yuklaydi.</P>
      <P>"CurrentControlSet" aslida ControlSet001 yoki ControlSet002 ga simvolik havola. Windows har muvaffaqiyatli yuklashda ular o'rtasida almashadi — yomon drayver qo'shilgan bo'lsa, oxirgi Yaxshi Ma'lum Konfiguratsiyaga (ControlSet002) yuklanish mumkin.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.5 — Persistenslik Joylari (Tajovuzkorning Registry'si)</h3>
      <pre style={{background:"rgba(0,0,0,0.35)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 16px",fontSize:12,lineHeight:1.7,overflowX:"auto",marginTop:10}}><code>{`# Har bir foydalanuvchi loginida avtomatik ishga tushish (past-imtiyoz — HKCU)
HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run
HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\RunOnce

# Har bir loginда avtomatik ishga tushish (admin kerak — HKLM)
HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run
HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\RunOnce

# Servis ta'riflari (admin kerak)
HKLM\\SYSTEM\\CurrentControlSet\\Services\\<ServisNomi>
  → ImagePath = bajariladigan fayl yoki drayvер yo'li
  → Start     = 0x00 (Boot) | 0x01 (System) | 0x02 (Auto) | 0x03 (Manual)

# HAR BIR jarayonga DLL in'ektsiya — juda xavfli
HKLM\\Software\\Microsoft\\Windows NT\\CurrentVersion\\Windows\\AppInit_DLLs
  → LoadAppInit_DLLs = 1 yoqish uchun (Windows 8+ da standart o'chirilgan)

# COM ob'ektni o'g'irlash (HKCU uchun admin kerak emas)
HKCU\\Software\\Classes\\CLSID\\{<GUID>}\\InprocServer32
  → Tizim COM ob'ektini o'z DLL ingiz bilan almashiring`}</code></pre>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.6 — Registry'ni Monitoring Qilish</h3>
      <P><strong>Sysmon Event ID 13 (RegistryValueSet):</strong> Registry qiymat yozish amallarini jurnaliga oladi. Sysmon'ni Run/RunOnce kalitlari, Services ImagePath, AppInit_DLLs ni kuzatish uchun sozlang — bularga har qanday yozish darhol shubhali. Event ID 12 (kalit yaratish) va 14 (kalit nomini o'zgartirish) bilan juftlang.</P>
      <P><strong>Process Monitor (Sysinternals):</strong> To'liq stek izlari bilan real vaqt registry monitoringi. Yo'l bo'yicha filterlang (masalan, "Yo'l Run ni o'z ichiga oladi") va qaysi jarayon, qaysi ip va qaysi stek yozishni chaqirganini ko'ring. Zararli dastur tahlili va hodisaga javob berish uchun muhim.</P>
      <P><strong>Autoruns (Sysinternals):</strong> Persistenslik topish uchun yetakchi vosita. Registry da 100+ dan ortiq autostart joylarini skanerlaydi, har bir ikkilikni imzolangan/imzolanmagan holati bilan ko'rsatadi, VirusTotal xitlari bo'lgan yozuvlarni ajratib ko'rsatadi. Administrator sifatida ishga tushiring.</P>
    </section>
  );
}
// ─────────────────────────────────────────────────────────────
// L09 — File Systems
// ─────────────────────────────────────────────────────────────
function SectionFileSystems() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="File Systems — Organizing Data on Storage" uz="" />
      <P>A <Term>file system</Term> is the layer between raw storage (sectors on a disk, flash cells on an SSD) and the logical view that applications see: files with names, sizes, timestamps, permissions, and directory trees. Without a file system, a disk is just an undifferentiated ocean of bytes — you'd have to track every byte's physical address yourself. The file system solves: how to allocate space for new files, how to find a file by name, how to record metadata (who owns it, when was it last modified), how to handle partial writes on power failure, and how to enforce access control.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.1 — The Windows I/O Manager and VFS Layer</h3>
      <P>Windows does not let applications talk directly to file system drivers. Instead, the <Term>I/O Manager</Term> (part of ntoskrnl.exe) provides a unified abstraction called the <Term>I/O Request Packet (IRP)</Term> model. When an application calls <code style={{fontFamily:"var(--font-mono)",fontSize:12,background:"rgba(255,255,255,0.06)",padding:"1px 6px",borderRadius:4}}>ReadFile()</code>, the Win32 layer converts it to an IRP_MJ_READ and passes it down a driver stack. The stack may have:</P>
      <ul style={{paddingLeft:24,lineHeight:2,fontSize:14,color:"var(--text-1)"}}>
        <li><strong>Filter drivers</strong> (top) — antivirus, encryption (EFS), auditing, reparse-point handlers</li>
        <li><strong>File system driver</strong> (middle) — ntfs.sys, fastfat.sys, exfat.sys</li>
        <li><strong>Volume manager</strong> — dmio.sys / StorAhci — handles LVM, RAID, disk partitioning</li>
        <li><strong>Miniport driver</strong> (bottom) — talks to physical hardware: NVMe, SATA, USB</li>
      </ul>
      <P>This layered IRP stack means an antivirus filter driver can intercept every file read/write without the file system driver knowing. Windows can support multiple file systems simultaneously — NTFS on C:, FAT32 on a USB, exFAT on an SD card — through the same I/O Manager interface.</P>
      <Callout color="var(--c-system)" icon="info" titleEn="Why this matters for security" titleUz="">
        Ransomware typically opens files via normal Win32 APIs, generating IRPs that flow through all filter drivers. This is how endpoint protection products intercept ransomware: a filter driver at the top of the stack catches the write IRP, checks the write pattern (is this encrypting a .docx?), and can block the IRP before data is overwritten.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.2 — FAT vs NTFS vs exFAT Comparison</h3>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Feature","FAT32","NTFS","exFAT"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["Introduced","1996","1993 (Windows NT 3.1)","2006 (Windows CE 6)"],
            ["Max file size","4 GB − 1 byte","16 EB (theoretical)","16 EB (theoretical)"],
            ["Max volume size","2 TB (8 TB with 64KB clusters)","256 TB (practical)","128 PB (theoretical)"],
            ["Journaling","None","Yes ($LogFile, $UsnJrnl)","None"],
            ["Permissions / ACLs","None","Full NTFS ACLs (SID-based)","None"],
            ["Encryption","None","EFS (per-file, kernel-level)","None"],
            ["Alternate Data Streams","None","Yes ($DATA attribute)","No"],
            ["Unicode filenames","No (8.3 + LFN extension)","Yes (UTF-16)","Yes (UTF-16)"],
            ["Typical use","USB drives, SD cards, ESP","Windows system drives","Flash drives, SD, cross-platform"],
            ["Linux support","Native","ntfs3 (kernel 5.15+)","exfatprogs"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--text-0)":"var(--text-1)",fontSize:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.3 — Windows File System Drivers</h3>
      <P><strong>ntfs.sys</strong> — The NTFS driver. Loaded at boot. Handles all operations on NTFS volumes: file open/read/write/delete, directory enumeration, ACL enforcement, journaling, EFS, sparse files, ADS, reparse points (symlinks, junctions, mount points). Roughly 500,000 lines of code.</P>
      <P><strong>fastfat.sys</strong> — FAT12/16/32 driver. Loaded on demand when a FAT volume is mounted. Much simpler than ntfs.sys — no ACLs, no journaling.</P>
      <P><strong>exfat.sys</strong> — exFAT driver, introduced in Windows Vista SP1. Common on SD cards (the SD Association mandates exFAT for SDXC cards larger than 32 GB).</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.4 — Filter Drivers: The Invisible Middleware</h3>
      <P>Filter drivers sit above the file system driver in the IRP stack and can intercept, modify, or block any I/O request. Windows uses a structured filter model called the <Term>Filter Manager</Term> (fltmgr.sys) introduced in Windows XP SP2, which provides registration, altitude ordering, and callback APIs.</P>
      <P><strong>Altitude numbers</strong> determine the order filters run. Microsoft assigns altitude ranges by purpose: 420000–429999 = antivirus (highest priority), 140000–149999 = encryption, 80000–89999 = HSM (backup). A filter at 420000 sees every I/O before the filter at 140000.</P>
      <P><strong>Security-relevant filter drivers:</strong> Windows Defender's real-time protection (WdFilter.sys), BitLocker volume encryption (fveefsx.sys), EFS (srmv2.sys). Rootkits that load as filter drivers can intercept file reads to hide malicious files — this was how TDL4's file hiding worked before PatchGuard restrictions tightened.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.5 — Security Implications of File System Choice</h3>
      <P>Using FAT32 or exFAT means <strong>no access control</strong>. Anyone who can mount the volume can read and modify any file. NTFS ACLs are only enforced by ntfs.sys inside the Windows kernel — if you take an NTFS disk, boot Linux, and mount it as root, Linux reads NTFS structures via ntfs3 and ignores Windows ACLs entirely. <strong>BitLocker encryption is the correct layer for protecting data at rest against physical access</strong> — not NTFS permissions.</P>
      <P>Alternate Data Streams (ADS) on NTFS allow hiding data inside legitimate files with no visible size change in Explorer. Many malware families have used ADS to store payloads and configuration. Tools like <code>dir /r</code> and Streams.exe (Sysinternals) reveal them.</P>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="Fayl Tizimlari — Saqlashni Tashkil Etish" en="" />
      <P><Term>Fayl tizimi</Term> — xom saqlash va dasturlar ko'radigan mantiqiy ko'rinish o'rtasidagi qatlam: nomlar, o'lchamlar, vaqt tamg'alari, ruxsatlar va katalog daraxtlari bilan fayllar. Fayl tizimisiz disk shunchaki baytlarning farqlanmagan dengizi. Fayl tizimi quyidagilarni hal qiladi: yangi fayllar uchun joy qanday ajratilsin, fayl nomiga ko'ra qanday topilsin, metadata qanday yozilsin, quvvat uzilishida qisman yozishlarda nima qilinsin va kirish nazorati qanday ta'minlansin.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.1 — Windows I/O Menejeri va VFS Qatlami</h3>
      <P>Windows dasturlarga to'g'ridan-to'g'ri fayl tizimi drayverlari bilan muloqot qilishga ruxsat bermaydi. <Term>I/O Menejeri</Term> (ntoskrnl.exe ning bir qismi) <Term>IRP</Term> modeli deb ataladigan yagona abstraktsiya taqdim etadi. Dastur <code style={{fontFamily:"var(--font-mono)",fontSize:12,background:"rgba(255,255,255,0.06)",padding:"1px 6px",borderRadius:4}}>ReadFile()</code> ni chaqirganda, u IRP_MJ_READ ga aylantiriladi va drayver stek bo'ylab uzatiladi:</P>
      <ul style={{paddingLeft:24,lineHeight:2,fontSize:14,color:"var(--text-1)"}}>
        <li><strong>Filtr drayverlari</strong> (yuqori) — antivirus, shifrlash (EFS), audit</li>
        <li><strong>Fayl tizimi drayveri</strong> (o'rta) — ntfs.sys, fastfat.sys, exfat.sys</li>
        <li><strong>Hajm menejeri</strong> — LVM, RAID, disk bo'limlashni boshqaradi</li>
        <li><strong>Miniport drayveri</strong> (quyi) — jismoniy apparat bilan muloqot</li>
      </ul>
      <Callout color="var(--c-system)" icon="info" titleUz="Xavfsizlik uchun nima uchun muhim" titleEn="">
        To'lov dasturlari odatda oddiy Win32 API orqali fayllarni ochadi, bu barcha filtr drayverlari orqali o'tadigan IRPlar yaratadi. Endpoint himoya mahsulotlari to'lov dasturlarini shu tarzda ushlaydिlar: stekdagi filtr drayveri yozish IRPni ushlaydн, yozish naqshini tekshiradн va IRP ni bloklaydн.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.2 — FAT vs NTFS vs exFAT Taqqoslash</h3>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Xususiyat","FAT32","NTFS","exFAT"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["Kiritilgan","1996","1993","2006"],
            ["Maks fayl hajmi","4 GB − 1 bayt","16 EB","16 EB"],
            ["Maks hajm","2 TB","256 TB","128 PB"],
            ["Jurnalling","Yo'q","Ha ($LogFile, $UsnJrnl)","Yo'q"],
            ["Ruxsatlar / ACLlar","Yo'q","To'liq NTFS ACLlar","Yo'q"],
            ["Shifrlash","Yo'q","EFS (fayl bo'yicha)","Yo'q"],
            ["Muqobil Ma'lumot Oqimlari","Yo'q","Ha ($DATA)","Yo'q"],
            ["Odatdagi foydalanish","USB, SD, ESP","Windows tizim disklari","Flash, SD, platformalararo"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--text-0)":"var(--text-1)",fontSize:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.3 — Xavfsizlik Oqibatlari</h3>
      <P>FAT32 yoki exFAT ishlatish <strong>kirish nazorati yo'q</strong> degan ma'noni anglatadi. NTFS ACLlar faqat Windows yadro ichidagi ntfs.sys tomonidan ta'minlanadi — NTFS diskni olsangiz va Linux da root sifatida o'rnatsangiz, Linux Windows ACLlarni butunlay e'tiborsiz qoldiradi. <strong>Jismoniy kirishdan ma'lumotni himoya qilish uchun to'g'ri qatlam BitLocker</strong> — NTFS ruxsatlar emas.</P>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// L10 — NTFS
// ─────────────────────────────────────────────────────────────
function SectionNTFS() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="NTFS — New Technology File System" uz="" />
      <P><Term>NTFS</Term> has been Windows' primary file system since NT 3.1 in 1993. It was designed to replace FAT with journaling, fine-grained access control, large file support, and a flexible metadata model. Every aspect of an NTFS volume is ultimately a file — including the file system's own metadata. This design makes NTFS extremely powerful but also creates unique attack surfaces that every security professional must understand.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.1 — The Master File Table (MFT)</h3>
      <P>The <Term>Master File Table ($MFT)</Term> is the heart of NTFS. Every file and directory on an NTFS volume has exactly one record in the MFT. Each MFT record is 1024 bytes (default) and contains all metadata for one file — name, timestamps, permissions, and for small files, even the file data itself (resident data). Files larger than ~700 bytes have a runlist — a list of (LCN, length) pairs pointing to actual clusters on disk.</P>
      <P>NTFS reserves the first 16 MFT records for system metadata files:</P>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Record #","System File","Purpose"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["0","$MFT","The MFT itself — self-referential first record"],
            ["1","$MFTMirr","MFT mirror — backup of first 4 MFT records for recovery"],
            ["2","$LogFile","NTFS journal — records metadata changes for crash recovery"],
            ["3","$Volume","Volume name, NTFS version, dirty flag"],
            ["4","$AttrDef","Attribute type definitions for this volume"],
            ["5",".(root)","Root directory — the '\\' you navigate from"],
            ["6","$Bitmap","Cluster allocation bitmap — 1 bit per cluster"],
            ["7","$Boot","Boot sector and bootstrap code"],
            ["8","$BadClus","List of bad clusters to avoid"],
            ["9","$Secure","Security descriptor database (ACLs stored here)"],
            ["10","$UpCase","Uppercase table for case-insensitive filename comparison"],
            ["11","$Extend","Extension directory: $UsnJrnl, $Quota, $Reparse"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--c-warn)":j===1?"var(--accent)":"var(--text-1)",fontFamily:j<2?"var(--font-mono)":"inherit",fontSize:j<2?12:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.2 — NTFS Attributes</h3>
      <P>Everything in an NTFS MFT record is an <Term>attribute</Term>. A typical file has at minimum:</P>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Attribute","Type","Contents / Security Notes"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["$STANDARD_INFORMATION","0x10","Creation, modification, MFT-modified, access timestamps; file attributes (hidden, read-only, system). This is what Explorer shows — and what malware modifies to fake timestamps (timestomping)."],
            ["$FILE_NAME","0x30","Filename(s) in Unicode. Contains its OWN copy of timestamps — harder to stomp because most tools don't touch $FILE_NAME timestamps."],
            ["$DATA","0x80","File content. Can be resident (in record) or non-resident (runlist). Can have multiple named instances — those are Alternate Data Streams."],
            ["$INDEX_ROOT","0x90","B-tree index root for directories. Small directories fit entirely in the MFT record."],
            ["$INDEX_ALLOCATION","0xA0","Extension of the B-tree for large directories."],
            ["$REPARSE_POINT","0xC0","Reparse tag and data. Used for symbolic links, junctions, mount points, and OneDrive placeholder files."],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":j===1?"var(--c-warn)":"var(--text-1)",fontFamily:j<2?"var(--font-mono)":"inherit",fontSize:j<2?12:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.3 — Alternate Data Streams (ADS)</h3>
      <P>An <Term>Alternate Data Stream</Term> is a named $DATA attribute. The default stream has no name (the "main" file data). NTFS allows any number of additional named streams on any file or directory. Syntax: <code style={{fontFamily:"var(--font-mono)",fontSize:12,background:"rgba(255,255,255,0.06)",padding:"1px 6px",borderRadius:4}}>filename.txt:streamname:$DATA</code>. The alternate stream's size does NOT appear in <code>dir</code> output, Explorer, or most backup tools — only the main stream size is shown.</P>
      <pre style={{background:"rgba(0,0,0,0.35)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 16px",fontSize:12,lineHeight:1.7,overflowX:"auto",marginTop:10}}><code>{`# Create a hidden ADS
echo "malicious payload" > innocent.txt:hidden_data

# Read it back
more < innocent.txt:hidden_data

# List ADS streams (built-in, Windows 7+)
dir /r innocent.txt
# Shows:
#    123 innocent.txt
#     25 innocent.txt:hidden_data:$DATA

# PowerShell
Get-Item -Stream * C:\\path\\innocent.txt

# Zone.Identifier — legitimate ADS Windows uses for downloaded files
# Every file downloaded from the internet gets:
# file.exe:Zone.Identifier:$DATA  →  [ZoneTransfer]\nZoneId=3
# SmartScreen reads this to know the file came from the internet`}</code></pre>
      <Callout color="var(--c-err)" icon="warning" titleEn="ADS abuse by malware" titleUz="">
        Malware families including Poweliks, Ursnif, and APT tools have used ADS to hide payloads inside legitimate system files. A dropper can write a PowerShell payload into an ADS then create a scheduled task that reads and executes it: <code>wscript.exe "C:\Windows\explorer.exe:payload.vbs"</code>.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.4 — NTFS Permissions vs Share Permissions</h3>
      <P><strong>NTFS Permissions:</strong> Applied by ntfs.sys at the file system level. Stored as a Security Descriptor with a DACL containing ACEs. Each ACE specifies a SID and access rights: Read Data, Write Data, Execute, Delete, Change Permissions, Take Ownership. Apply whether access is local or over the network.</P>
      <P><strong>Share Permissions:</strong> Applied by the Server service (srv2.sys) at the SMB level. Coarser: Full Control, Change, or Read. Only apply to network access — irrelevant for local console access.</P>
      <P><strong>Effective rule:</strong> <code style={{fontFamily:"var(--font-mono)",fontSize:12,background:"rgba(255,255,255,0.06)",padding:"1px 6px",borderRadius:4}}>Effective = NTFS ∩ Share</code> — the more restrictive wins. Best practice: set Share Permissions to "Everyone — Full Control" and control access entirely through NTFS ACLs.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.5 — Journaling: $LogFile and $UsnJrnl</h3>
      <P><strong>$LogFile</strong> is NTFS's <Term>write-ahead journal</Term>. Before any metadata change, NTFS writes the intended change to $LogFile first. If the system crashes mid-operation, on next boot NTFS replays or rolls back incomplete transactions. Typically 64MB, circular, on every NTFS volume.</P>
      <P><strong>$UsnJrnl</strong> (Change Journal) records every change to every file/directory: creation, deletion, rename, modification, security change. From a forensics perspective, $UsnJrnl is a goldmine — it shows the history of all file changes, even after files are deleted, until the circular journal wraps around.</P>
      <pre style={{background:"rgba(0,0,0,0.35)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 16px",fontSize:12,lineHeight:1.7,overflowX:"auto",marginTop:10}}><code>{`# Check $UsnJrnl status
fsutil usn queryjournal C:

# Read recent USN journal entries (forensics)
fsutil usn readjournal C: csv | findstr /i "delete"

# $LogFile details
fsutil logfile query C:`}</code></pre>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.6 — Hard Links, Junctions, and Symbolic Links</h3>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Type","Scope","Security note"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["Hard link","Same volume only","Deleting the 'original' doesn't delete data — the MFT record stays until all hard links are removed. A 'deleted' file may still be accessible via its hard link."],
            ["Junction","Local volumes only","Used for backwards compatibility (C:\\Documents and Settings → C:\\Users). Malware uses junctions for privilege escalation: write to a junction target that a privileged service reads."],
            ["Symbolic link","Cross-volume, cross-host","TOCTOU attacks: create a symlink pointing to a privileged file right after a privileged process checks the path but before it opens it."],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontSize:j===0?12:13,fontFamily:j===0?"var(--font-mono)":"inherit"}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.7 — EFS (Encrypting File System)</h3>
      <P><Term>EFS</Term> is NTFS's per-file transparent encryption, introduced in Windows 2000. When you encrypt a file: (1) A random <Em>File Encryption Key (FEK)</Em> is generated. (2) File content is encrypted with the FEK using AES-256. (3) The FEK is encrypted with the user's EFS public key (RSA) and stored in the file's <code>$DATA:$EFS</code> attribute. (4) When the user opens the file, LSA decrypts the FEK using the user's private key — all transparently.</P>
      <P><strong>EFS limitations:</strong> Keys are tied to the user's profile — if the profile is deleted without a Data Recovery Agent (DRA), files become unrecoverable. EFS does NOT protect against a logged-in attacker running as the same user (EFS transparently decrypts), in-memory data (decrypted pages live in RAM), or backup files (VSS copies may store decrypted data).</P>
      <Callout color="var(--c-warn)" icon="warning" titleEn="Ransomware and EFS abuse" titleUz="">
        Ransomware groups have used EFS as an encryption engine — calling the Windows EFS API to encrypt victim files with the ransomware's certificate, then deleting the victim's EFS key material. This sidesteps behavioral detection that looks for the ransomware's own crypto code. Microsoft added Windows Defender mitigations in 2020 to detect EFS abuse.
      </Callout>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="NTFS — Yangi Texnologiya Fayl Tizimi" en="" />
      <P><Term>NTFS</Term> 1993 yildan beri Windows ning asosiy fayl tizimi. U jurnalling, nozik kirish nazorati, katta fayl qo'llab-quvvatlash va moslashuvchan metadata modeli bilan FAT ni almashtirish uchun noldan loyihalandi. NTFS hajmining har bir aspekti oxir-oqibat fayl — shu jumladan fayl tizimining o'z metadata si ham.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.1 — Master Fayl Jadvali (MFT)</h3>
      <P><Term>Master Fayl Jadvali ($MFT)</Term> NTFS ning yuragi. Har bir fayl va katalog MFT da aynan bitta yozuvga ega. Har bir MFT yozuvi 1024 bayt va bitta fayl uchun barcha metadata ni o'z ichiga oladi. Kichik fayllar uchun ma'lumotlar to'g'ridan-to'g'ri MFT yozuvi ichida saqlanadi (rezident). Katta fayllar uchun runlist — diskdagi haqiqiy klasterlarga ko'rsatuvchi (LCN, uzunlik) juftliklari ro'yxati.</P>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Yozuv #","Tizim fayli","Maqsad"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["0","$MFT","MFT ning o'zi — o'z-o'ziga havola"],
            ["1","$MFTMirr","Birinchi 4 MFT yozuvining zaxirasi"],
            ["2","$LogFile","NTFS jurnali — xato tiklanishi uchun"],
            ["3","$Volume","Hajm nomi, NTFS versiyasi"],
            ["5",".(ildiz)","Ildiz katalogi '\\'"],
            ["6","$Bitmap","Klaster ajratish bitmap"],
            ["7","$Boot","Boot sektori va bootstrap kodi"],
            ["9","$Secure","Xavfsizlik tavsiflovchi ma'lumotlar bazasi (ACLlar)"],
            ["11","$Extend","$UsnJrnl, $Quota, $Reparse uchun kengaytma"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--c-warn)":j===1?"var(--accent)":"var(--text-1)",fontFamily:j<2?"var(--font-mono)":"inherit",fontSize:j<2?12:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.2 — Muqobil Ma'lumot Oqimlari (ADS)</h3>
      <P>Nomlangan $DATA atributi. Sintaksis: <code style={{fontFamily:"var(--font-mono)",fontSize:12,background:"rgba(255,255,255,0.06)",padding:"1px 6px",borderRadius:4}}>fayl.txt:oqim_nomi:$DATA</code>. Muqobil oqimning hajmi <code>dir</code>, Explorer yoki aksariyat zaxira vositalarida ko'rinmaydi.</P>
      <pre style={{background:"rgba(0,0,0,0.35)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 16px",fontSize:12,lineHeight:1.7,overflowX:"auto",marginTop:10}}><code>{`# Yashirin ADS yaratish
echo "yashirin ma'lumot" > oddiy.txt:yashirin

# Ro'yxatga olish
dir /r oddiy.txt

# PowerShell
Get-Item -Stream * C:\\yo'l\\oddiy.txt

# Zone.Identifier — internetdan yuklab olingan fayllar uchun
# fayl.exe:Zone.Identifier:$DATA → [ZoneTransfer]\nZoneId=3`}</code></pre>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.3 — NTFS Ruxsatlari vs Ulashish Ruxsatlari</h3>
      <P><strong>NTFS Ruxsatlari:</strong> ntfs.sys tomonidan ta'minlanadi. DACL va ACElardan iborat Xavfsizlik Tavsiflovchisi sifatida saqlanadi. Mahalliy yoki tarmoq kirishida amal qiladi.</P>
      <P><strong>Ulashish Ruxsatlari:</strong> SMB darajasida qo'llaniladi. Faqat tarmoq kirishiga tegishli. <code style={{fontFamily:"var(--font-mono)",fontSize:12,background:"rgba(255,255,255,0.06)",padding:"1px 6px",borderRadius:4}}>Samarali = NTFS ∩ Ulashish</code> — qattiqroq g'alaba qozonadi. Eng yaxshi amaliyot: Ulashish Ruxsatlarini "Hamma — To'liq" ga o'rnating va kirishni to'liq NTFS ACLlar orqali boshqaring.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.4 — Jurnalling: $LogFile va $UsnJrnl</h3>
      <P><strong>$LogFile</strong> — oldindan yozish jurnali. Har qanday metadata o'zgarishidan oldin NTFS o'zgarishni avval $LogFile ga yozadi. Tizim o'rta yo'lda ishdan chiqsa, keyingi yuklashda tugallanmagan tranzaktsiyalar qayta ishlanadi yoki ortga qaytariladi.</P>
      <P><strong>$UsnJrnl</strong> — har bir fayl va katalogdagi har bir o'zgarishni yozadi: yaratish, o'chirish, nomni o'zgartirish, o'zgartirish. Kriminalistika uchun oltin kon — fayllar o'chirilgandan keyin ham tarixni ko'rsatadi.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.5 — EFS (Fayllarni Shifrlash Tizimi)</h3>
      <P>NTFS ning fayl bo'yicha shaffof shifrlash, Windows 2000 da kiritilgan. (1) Tasodifiy FEK yaratiladi. (2) Fayl AES-256 bilan shifrlanadi. (3) FEK foydalanuvchining RSA ochiq kaliti bilan shifrlanadi va <code>$DATA:$EFS</code> atributida saqlanadi. (4) Fayl ochilganda, LSA FEK ni maxfiy kalit bilan hal qiladi — barchasi shaffof.</P>
      <P><strong>Cheklovlar:</strong> Kalitlar foydalanuvchi profiliga bog'liq. Agar profil o'chirilsa va DRA konfiguratsiya qilinmagan bo'lsa, fayllar tiklanmaydi. EFS xuddi shu foydalanuvchi sifatida ishlayotgan tajovuzkordan, xotiradagi ma'lumotlardan yoki VSS zaxira nusxalaridan himoya qilmaydi.</P>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// L11 — FAT32
// ─────────────────────────────────────────────────────────────
function SectionFAT32() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="FAT32 — File Allocation Table" uz="" />
      <P><Term>FAT32</Term> is the third generation of Microsoft's File Allocation Table file system, introduced in 1996. Despite being over 25 years old, FAT32 is still ubiquitous: virtually every USB flash drive ships formatted as FAT32 or exFAT, the EFI System Partition (ESP) must be FAT32, and billions of embedded devices use FAT for its simplicity. Understanding FAT32's architecture and critical limitations — especially the 4 GB file size limit — is essential for any Windows professional.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.1 — The FAT Structure</h3>
      <P>A FAT volume is divided into three regions:</P>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12,marginTop:12}}>
        {[
          {title:"Reserved Region",color:"var(--c-system)",body:"Contains the Boot Sector (512 bytes) at offset 0, holding the BPB (BIOS Parameter Block): cluster size, total sectors, FAT count, root directory cluster (FAT32). Also contains the FSInfo sector caching the free cluster count."},
          {title:"FAT Region",color:"var(--accent)",body:"One or two copies of the File Allocation Table. Each entry is 32 bits representing one cluster: 0x00000000 = free, 0x0FFFFFF7 = bad, 0x0FFFFFF8–0x0FFFFFFF = end of chain, or the next cluster number in the file's chain."},
          {title:"Data Region",color:"var(--c-ok)",body:"Actual file and directory data in clusters. Cluster size is configurable at format time: 512B, 1KB, 2KB, 4KB, 8KB, 16KB, 32KB, 64KB. Larger clusters = less FAT entries but more wasted slack for small files."},
        ].map(c=><div key={c.title} style={{padding:"14px 16px",background:`${c.color}08`,border:`1px solid ${c.color}25`,borderLeft:`3px solid ${c.color}`,borderRadius:8}}>
          <div style={{fontWeight:700,fontSize:13,color:c.color,marginBottom:6}}>{c.title}</div>
          <div style={{fontSize:13,color:"var(--text-1)",lineHeight:1.6}}>{c.body}</div>
        </div>)}
      </div>
      <P style={{marginTop:16}}>The FAT is a <Em>singly-linked list</Em> encoded as an array. To read a file: start at the first cluster stored in the directory entry → look up that cluster's FAT entry to find the next cluster → follow the chain until you hit an end-of-chain marker. This is why fragmented FAT32 volumes perform poorly — each fragment requires a separate FAT lookup.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.2 — Directory Structure and Long File Names</h3>
      <P>FAT directories are a linear array of 32-byte directory entries, each holding the 8.3 filename (uppercase, space-padded), attributes byte, timestamps, first cluster number, and file size. The original FAT allowed only 8.3 names. Windows 95 added LFN support using a hack: LFN entries use attribute byte 0x0F (ReadOnly+Hidden+System+VolumeLabel), which old software ignores. Each LFN entry stores 13 UTF-16 characters. Maximum LFN: 255 UTF-16 characters.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.3 — FAT12, FAT16, FAT32 and exFAT — Full Comparison</h3>
      <P>Four generations of FAT — the most important numbers at a glance:</P>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14,marginTop:16}}>
        {[
          {
            title:"FAT12", year:"1977", color:"#6b7280",
            file:"Same as volume\n(no separate file size limit)",
            disk:"Max ~16 MB (proven on floppies)\nAbsolute max ~256 MB",
            perm:"NONE — no ACLs whatsoever",
            use:"Floppy disks, tiny embedded devices",
          },
          {
            title:"FAT16", year:"1984", color:"var(--c-warn)",
            file:"Same as volume\n(no separate file size limit)",
            disk:"Max ~2 GB (Windows 9x)\nAbsolute max ~4 GB",
            perm:"NONE — no ACLs whatsoever",
            use:"Old USB drives, DOS-era systems",
          },
          {
            title:"FAT32", year:"1996", color:"var(--accent)",
            file:"4 GB − 1 byte  ← HARD LIMIT\n(32-bit size field, cannot be bypassed)",
            disk:"Max 2 TB (proven, Linux/Rufus format)\nMax 32 GB (Windows format.exe policy)",
            perm:"NONE — no ACLs whatsoever",
            use:"USB drives, SD cards, EFI System Partition",
          },
          {
            title:"exFAT", year:"2006", color:"var(--c-ok)",
            file:"128 PB (practically: same as disk)\n(64-bit size field)",
            disk:"Max 128 TB (tested in practice)\nMandated for SDXC cards >32 GB",
            perm:"NONE — only Read-Only/Hidden bits\n(no NTFS-style user ACLs)",
            use:"Modern USB, SD >32 GB, cameras",
          },
        ].map(c=>(
          <div key={c.title} style={{padding:"16px",background:`${c.color}08`,border:`1px solid ${c.color}30`,borderTop:`3px solid ${c.color}`,borderRadius:8}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:12}}>
              <span style={{fontFamily:"var(--font-mono)",fontSize:18,fontWeight:800,color:c.color}}>{c.title}</span>
              <span style={{fontSize:11,color:"var(--text-2)"}}>{c.year}</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <div style={{background:"rgba(0,0,0,0.2)",borderRadius:6,padding:"8px 10px"}}>
                <div style={{fontSize:10,fontWeight:700,color:c.color,letterSpacing:1,marginBottom:3}}>MAX FILE</div>
                <div style={{fontSize:12,color:"var(--text-0)",lineHeight:1.55,whiteSpace:"pre-line"}}>{c.file}</div>
              </div>
              <div style={{background:"rgba(0,0,0,0.2)",borderRadius:6,padding:"8px 10px"}}>
                <div style={{fontSize:10,fontWeight:700,color:c.color,letterSpacing:1,marginBottom:3}}>MAX DISK</div>
                <div style={{fontSize:12,color:"var(--text-0)",lineHeight:1.55,whiteSpace:"pre-line"}}>{c.disk}</div>
              </div>
              <div style={{background:"rgba(255,30,30,0.08)",border:"1px solid rgba(255,30,30,0.18)",borderRadius:6,padding:"8px 10px"}}>
                <div style={{fontSize:10,fontWeight:700,color:"var(--c-err)",letterSpacing:1,marginBottom:3}}>PERMISSIONS</div>
                <div style={{fontSize:12,color:"var(--c-err)",lineHeight:1.55,whiteSpace:"pre-line"}}>{c.perm}</div>
              </div>
              <div style={{fontSize:11,color:"var(--text-2)",lineHeight:1.4}}>{c.use}</div>
            </div>
          </div>
        ))}
      </div>
      <Callout color="var(--c-err)" icon="warning" titleEn="All four FAT types: no user permissions" titleUz="">
        FAT12, FAT16, FAT32, exFAT — zero access control on all four. Anyone who can mount the volume (root on Linux, Administrator on Windows) reads and modifies every file. NTFS ACLs are irrelevant here. <strong>For physical access protection: only BitLocker-style full-disk encryption works.</strong>
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.4 — Critical Limitations</h3>
      <P><strong>4 GB file size limit:</strong> The directory entry's file size field is a 32-bit unsigned integer. 2³² − 1 = 4,294,967,295 bytes = exactly 4 GB − 1 byte. No FAT32 file can be 4 GB or larger. You cannot store a 4.7 GB DVD ISO, a Windows installation ISO (typically 5–6 GB), or a large database file. The error: "The file is too large for the destination file system."</P>
      <P><strong>32 GB volume limit (Windows only):</strong> Windows' format.exe refuses to format volumes larger than 32 GB as FAT32. This is an arbitrary Microsoft policy — FAT32 supports up to 2 TB. Third-party tools (Rufus, fat32format) bypass this restriction.</P>
      <P><strong>No permissions or journaling:</strong> Every file is accessible to every user. A power failure during a write can leave FAT and directory entries inconsistent — CHKDSK /F required to repair. This is why FAT32 is inappropriate for system drives.</P>
      <P><strong>Timestamps with 2-second resolution:</strong> FAT stores modified time with 2-second resolution (5-bit seconds field → values 0, 2, 4, ..., 58, 60). This matters for forensics: timestamp analysis on FAT has lower precision than NTFS (100-nanosecond resolution).</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.5 — Why FAT32 Is Still Used: USB, SD, and the ESP</h3>
      <P><strong>USB and SD Cards:</strong> FAT32 has universal read/write support across every OS: Windows, macOS, Linux, Android, iOS, game consoles, cameras, TVs, car stereos. exFAT is FAT32's modern replacement for removable media — supports files larger than 4 GB and volumes larger than 32 GB while maintaining near-universal OS support.</P>
      <P><strong>EFI System Partition (ESP):</strong> The UEFI specification mandates the ESP must be formatted as FAT32. The ESP holds bootloaders (bootmgfw.efi, grubx64.efi), UEFI driver modules, firmware update capsules, and the Windows Boot Manager. Typically 100–550 MB. Because it must be readable by UEFI firmware with no OS drivers loaded, FAT32 was chosen for its simplicity and universal support.</P>
      <Callout color="var(--c-warn)" icon="warning" titleEn="Protecting the ESP" titleUz="">
        The ESP is a FAT32 volume with no NTFS ACLs, accessible to any process running as Administrator. Bootkits and persistent malware target the ESP because files written there survive OS reinstallation. Secure Boot's signature verification is the primary defense — UEFI firmware refuses to execute unsigned EFI binaries from the ESP.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.6 — FAT32 Data Recovery</h3>
      <P>FAT32 is easier to recover data from than NTFS. When you delete a file, FAT32 only marks the first character of the directory entry with 0xE5 (deleted marker) and frees the FAT chain. The actual file data on disk is untouched until overwritten. Recovery tools (TestDisk, Recuva, PhotoRec) scan for 0xE5-marked entries and rebuild the cluster chain. FAT32 has no journal, so deletion leaves fewer forensic traces than NTFS (where $UsnJrnl records deletion events).</P>
      <pre style={{background:"rgba(0,0,0,0.35)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 16px",fontSize:12,lineHeight:1.7,overflowX:"auto",marginTop:10}}><code>{`# Check FAT32 volume details
fsutil fsinfo volumeinfo D:

# Check for filesystem errors (read-only)
chkdsk D:

# Fix errors (requires unmount or restart)
chkdsk D: /F

# Convert FAT32 to NTFS (non-destructive, one-way)
convert D: /FS:NTFS
# Warning: cannot convert back to FAT32 without formatting

# Check volume type via PowerShell
Get-Volume -DriveLetter D | Select-Object FileSystem, Size, SizeRemaining`}</code></pre>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="FAT32 — Fayl Ajratish Jadvali" en="" />
      <P><Term>FAT32</Term> — Microsoft ning Fayl Ajratish Jadvali fayl tizimining uchinchi avlodi, 1996 yilda kiritilgan. 25 yildan oshiq bo'lishiga qaramay hali ham hamma joyda: deyarli har bir USB flesh disk FAT32 yoki exFAT sifatida keladi, EFI Tizim Bo'limi (ESP) FAT32 bo'lishi shart, va milliardlab o'rnatilgan qurilmalar FAT ishlatadi. 4 GB fayl hajmi cheklovini va nima uchun FAT32 hali ham ishlatilishini tushunish har bir Windows mutaxassisi uchun muhim.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.1 — FAT Tuzilmasi</h3>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12,marginTop:12}}>
        {[
          {title:"Zahiralangan Soha",color:"var(--c-system)",body:"BPB (BIOS Parametrlari Bloki) saqlanadigan Boot Sektorini o'z ichiga oladi: klaster hajmi, jami sektorlar, FAT soni, ildiz katalog klasteri. FSInfo sektori bepul klaster sonini keshlaydi."},
          {title:"FAT Soha",color:"var(--accent)",body:"Fayl Ajratish Jadvalining nusxasi. Har bir yozuv 32 bit: 0 = bepul, 0x0FFFFFF7 = yomon, 0x0FFFFFF8-0x0FFFFFFF = zanjir oxiri, yoki KEYINGI klaster raqami."},
          {title:"Ma'lumotlar Soha",color:"var(--c-ok)",body:"Klasterlardagi haqiqiy fayl va katalog ma'lumotlari. Klaster hajmi format vaqtida sozlanadi: 512B dan 64KB gacha."},
        ].map(c=><div key={c.title} style={{padding:"14px 16px",background:`${c.color}08`,border:`1px solid ${c.color}25`,borderLeft:`3px solid ${c.color}`,borderRadius:8}}>
          <div style={{fontWeight:700,fontSize:13,color:c.color,marginBottom:6}}>{c.title}</div>
          <div style={{fontSize:13,color:"var(--text-1)",lineHeight:1.6}}>{c.body}</div>
        </div>)}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.3 — FAT12, FAT16, FAT32 va exFAT — To'liq Taqqoslash</h3>
      <P>To'rtta FAT avlodi — eng muhim ko'rsatkichlar bir nazar bilan:</P>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14,marginTop:16}}>
        {[
          {
            title:"FAT12", year:"1977", color:"#6b7280",
            file:"= Disk hajmi kabi\n(alohida fayl chegarasi yo'q)",
            disk:"Maks ~16 MB (disketalarda isbotlangan)\nMutlaq maks ~256 MB",
            perm:"YO'Q — hech qanday ACL yo'q",
            use:"Disketalar, kichik o'rnatilgan qurilmalar",
          },
          {
            title:"FAT16", year:"1984", color:"var(--c-warn)",
            file:"= Disk hajmi kabi\n(alohida fayl chegarasi yo'q)",
            disk:"Maks ~2 GB (Windows 9x da isbotlangan)\nMutlaq maks ~4 GB",
            perm:"YO'Q — hech qanday ACL yo'q",
            use:"Eski USB disklar, DOS tizimlari",
          },
          {
            title:"FAT32", year:"1996", color:"var(--accent)",
            file:"4 GB − 1 bayt  ← QATTIQ CHEGARA\n(32-bitli hajm maydoni, chetlab o'tib bo'lmaydi)",
            disk:"Maks 2 TB (Linux/Rufus da isbotlangan)\nMaks 32 GB (Windows format.exe siyosati)",
            perm:"YO'Q — hech qanday ACL yo'q",
            use:"USB, SD kartalar, EFI System Partition",
          },
          {
            title:"exFAT", year:"2006", color:"var(--c-ok)",
            file:"128 PB (amalda = disk hajmi kabi)\n(64-bitli hajm maydoni)",
            disk:"Maks 128 TB (amalda sinab ko'rilgan)\n32 GB dan katta SDXC uchun majburiy",
            perm:"YO'Q — faqat ReadOnly/Hidden bitlari\n(NTFS kabi foydalanuvchi ACL yo'q)",
            use:"Zamonaviy USB, SD >32 GB, kameralar",
          },
        ].map(c=>(
          <div key={c.title} style={{padding:"16px",background:`${c.color}08`,border:`1px solid ${c.color}30`,borderTop:`3px solid ${c.color}`,borderRadius:8}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:12}}>
              <span style={{fontFamily:"var(--font-mono)",fontSize:18,fontWeight:800,color:c.color}}>{c.title}</span>
              <span style={{fontSize:11,color:"var(--text-2)"}}>{c.year}</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <div style={{background:"rgba(0,0,0,0.2)",borderRadius:6,padding:"8px 10px"}}>
                <div style={{fontSize:10,fontWeight:700,color:c.color,letterSpacing:1,marginBottom:3}}>MAKS FAYL</div>
                <div style={{fontSize:12,color:"var(--text-0)",lineHeight:1.55,whiteSpace:"pre-line"}}>{c.file}</div>
              </div>
              <div style={{background:"rgba(0,0,0,0.2)",borderRadius:6,padding:"8px 10px"}}>
                <div style={{fontSize:10,fontWeight:700,color:c.color,letterSpacing:1,marginBottom:3}}>MAKS DISK</div>
                <div style={{fontSize:12,color:"var(--text-0)",lineHeight:1.55,whiteSpace:"pre-line"}}>{c.disk}</div>
              </div>
              <div style={{background:"rgba(255,30,30,0.08)",border:"1px solid rgba(255,30,30,0.18)",borderRadius:6,padding:"8px 10px"}}>
                <div style={{fontSize:10,fontWeight:700,color:"var(--c-err)",letterSpacing:1,marginBottom:3}}>RUXSATLAR</div>
                <div style={{fontSize:12,color:"var(--c-err)",lineHeight:1.55,whiteSpace:"pre-line"}}>{c.perm}</div>
              </div>
              <div style={{fontSize:11,color:"var(--text-2)",lineHeight:1.4}}>{c.use}</div>
            </div>
          </div>
        ))}
      </div>
      <Callout color="var(--c-err)" icon="warning" titleUz="To'rtta FAT turi uchun umumiy: foydalanuvchi ruxsatlari yo'q" titleEn="">
        FAT12, FAT16, FAT32, exFAT — to'rtovida ham kirish nazorati nol. Diskni o'rnatishi mumkin bo'lgan har kim (Linux da root, Windows da Administrator) barcha fayllarni o'qib va o'zgartira oladi. NTFS ACLlar bu yerda mutlaqo ahamiyatsiz. <strong>Jismoniy kirishdan himoya: faqat BitLocker kabi to'liq disk shifrlash ishlaydi.</strong>
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.4 — Asosiy Cheklovlar</h3>
      <P><strong>4 GB fayl hajmi chegarasi:</strong> Katalog yozuvidagi fayl hajmi maydoni 32-bitli belgisiz butun son. 2³² − 1 = 4 GB − 1 bayt. FAT32 diskida hech qanday fayl 4 GB yoki undan katta bo'la olmaydi. 4.7 GB DVD ISO, Windows o'rnatish ISO (5–6 GB), yoki katta ma'lumotlar bazasi fayli siqmaydi. Xato: "Fayl maqsad fayl tizimi uchun juda katta."</P>
      <P><strong>32 GB hajm chegarasi (faqat Windows):</strong> Windows ning format.exe si 32 GB dan katta hajmni FAT32 sifatida formatlashdan bosh tortadi. Lekin bu ixtiyoriy Microsoft siyosati — FAT32 spetsifikatsiyasi 2 TB qo'llab-quvvatlaydi. Uchinchi tomon vositalari (Rufus) bu cheklovni chetlab o'tadi.</P>
      <P><strong>Ruxsatlar va jurnalling yo'q:</strong> Har bir faylga har kim kirishi mumkin. Quvvat uzilishi ma'lumotlarni buzishi mumkin — CHKDSK /F tuzatish uchun talab qilinadi. Shuning uchun FAT32 tizim disklari uchun yaroqsiz.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.4 — Nima uchun FAT32 Hali Ham Ishlatiladi</h3>
      <P><strong>USB va SD Kartalar:</strong> FAT32 har bir OT da universal qo'llab-quvvatlashga ega: Windows, macOS, Linux, Android, iOS, o'yin konsollari, kameralar. exFAT FAT32 ning zamonaviy o'rnini bosuvchisi — 4 GB dan katta fayllar va 32 GB dan katta hajmlarni qo'llab-quvvatlaydi.</P>
      <P><strong>EFI Tizim Bo'limi (ESP):</strong> UEFI spetsifikatsiyasi ESP FAT32 sifatida formatlanishi shart deb belgilaydi. ESP bootloaderlar, UEFI drayver modullari va Windows Boot Manager ni o'z ichiga oladi. Odatda 100–550 MB. OT drayverlari yuklanmagan holda UEFI tomonidan o'qilishi kerak bo'lgani uchun FAT32 tanlandi.</P>
      <Callout color="var(--c-warn)" icon="warning" titleUz="ESP ni himoya qilish" titleEn="">
        ESP — NTFS ACL siz FAT32 hajmi, Administrator sifatida ishlayotgan har qanday jarayon uchun ochiq. Bootkit va doimiy zararli dasturlar ESP ni nishonga oladilar — u yerda yozilgan fayllar OT qayta o'rnatishdan omon qoladi. Asosiy himoya: Secure Boot ning imzo tekshiruvi — UEFI imzolanmagan EFI fayllarni bajarishdan bosh tortadi.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.5 — FAT32 Ma'lumotlarni Tiklash</h3>
      <P>FAT32 dan ma'lumotlarni tiklash NTFS dan osonroq. Faylni o'chirganda, FAT32 faqat katalog yozuvining birinchi belgisini 0xE5 bilan belgilaydi va FAT zanjiriga ozod qiladi. Diskdagi haqiqiy ma'lumotlar ustiga yozilgunga qadar tegılmagan. Tiklash vositalari (TestDisk, Recuva) 0xE5 yozuvlarini topadi va zanjirni qayta tiklaydi. FAT32 da jurnal yo'q — bu NTFS dan ko'ra kamroq kriminalistik iz qoldiradi.</P>
      <pre style={{background:"rgba(0,0,0,0.35)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 16px",fontSize:12,lineHeight:1.7,overflowX:"auto",marginTop:10}}><code>{`# FAT32 hajm tafsilotlari
fsutil fsinfo volumeinfo D:

# Xatolarni tekshirish
chkdsk D:

# Xatolarni tuzatish
chkdsk D: /F

# FAT32 dan NTFS ga o'tkazish (bir tomonlama, yo'qotishsiz)
convert D: /FS:NTFS

# Hajm turini tekshirish
Get-Volume -DriveLetter D | Select-Object FileSystem, Size, SizeRemaining`}</code></pre>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// L12 — Processes
// ─────────────────────────────────────────────────────────────
function SectionProcesses() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="Processes — The Execution Container" uz="" />
      <P>A <Term>process</Term> is Windows' fundamental unit of isolation. It is not code that runs — threads run. A process is the <Em>container</Em> that wraps an executing program: its own virtual address space (so one process cannot read another's memory), its own handle table (references to kernel objects like files and mutexes), an access token (what the process is allowed to do), and at least one thread. When you double-click notepad.exe, Windows creates a process object in the kernel, allocates a 128 TB virtual address space, maps the executable into it, and creates the first thread to start executing at the entry point.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.1 — EPROCESS: The Kernel Structure</h3>
      <P>Every process is represented in the kernel as an <Term>EPROCESS</Term> structure — a large, partially opaque block of memory allocated from the non-paged pool. It contains everything the kernel needs to manage the process. Key fields (x64 Windows 11):</P>
      <pre style={{background:"rgba(0,0,0,0.35)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 16px",fontSize:12,lineHeight:1.7,overflowX:"auto",marginTop:10}}><code>{`// Simplified EPROCESS layout (selected fields, offsets vary by build)
typedef struct _EPROCESS {
  KPROCESS         Pcb;              // Dispatcher header + scheduler state
  EX_PUSH_LOCK     ProcessLock;
  LARGE_INTEGER    CreateTime;
  LARGE_INTEGER    ExitTime;
  RTL_AVL_TREE     VadRoot;          // Virtual Address Descriptor tree (VAD)
                                     //   — describes every mapped region
  HANDLE_TABLE*    ObjectTable;      // Handle table (files, mutexes, events, ...)
  EX_FAST_REF      Token;            // Access token → who is this process?
  ULONG_PTR        UniqueProcessId;  // PID
  LIST_ENTRY       ActiveProcessLinks; // Doubly-linked list of all EPROCESS nodes
  ULONG            ImagePathHash;
  UNICODE_STRING   ImageFileName;    // Short name (up to 15 chars)
  SECTION_OBJECT*  SectionObject;    // Mapped executable
  ULONG            ProtectionLevel;  // PPL: Protected Process Light level
  ULONG            Flags2;           // IsBeingDebugged, IsSubsystemProcess, ...
} EPROCESS;`}</code></pre>
      <P>The <Em>ActiveProcessLinks</Em> doubly-linked list connects every live EPROCESS. Task Manager and Process Explorer walk this list to enumerate processes. DKOM (Direct Kernel Object Manipulation) rootkits unlink an EPROCESS from this list to hide a process from user-space tools — but forensic tools can scan the pool for EPROCESS signatures to find unlinked processes.</P>
      <Callout color="var(--c-warn)" icon="warning" titleEn="VAD tree — the real memory map" titleUz="">
        The <strong>Virtual Address Descriptor (VAD)</strong> tree is the authoritative map of a process's virtual address space. Every VirtualAlloc, MapViewOfFile, and LoadLibrary creates a VAD node. Malware analysis tools (VadInfo in WinDbg, malfind in Volatility) walk the VAD tree to find injected regions — memory that is executable, writable, and not backed by a file on disk is a strong indicator of shellcode injection.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.2 — Process Creation: CreateProcess Flow</h3>
      <P>When you call <code style={{fontFamily:"var(--font-mono)",fontSize:12,background:"rgba(255,255,255,0.06)",padding:"1px 6px",borderRadius:4}}>CreateProcess()</code>, the following chain executes:</P>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Step","Layer","What happens"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["1","kernel32.dll","CreateProcessW() validates parameters, resolves the executable path, reads the file to check if it is a .exe, .bat, .cmd, or needs a shim"],
            ["2","kernel32.dll","Opens the image file, creates a section object (maps the PE into memory), reads the PE headers to find the entry point and required DLLs"],
            ["3","ntdll.dll","NtCreateUserProcess() — single system call that atomically creates the EPROCESS, ETHREAD, address space, and copies the PEB/TEB"],
            ["4","Kernel (ntoskrnl)","Allocates EPROCESS from non-paged pool, initializes handle table, VAD tree, token (inherited from parent), and links into ActiveProcessLinks"],
            ["5","Kernel","Creates the initial ETHREAD, allocates its stack, sets the start address to ntdll!LdrInitializeThunk"],
            ["6","ntdll.dll (new process)","LdrInitializeThunk runs in the new process: loads all import DLLs (LoadLibrary), resolves imports, runs DLL_PROCESS_ATTACH callbacks, then jumps to WinMain/main"],
            ["7","CSRSS","The new process registers itself with CSRSS (Client-Server Runtime Subsystem) for Win32 subsystem services"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--c-warn)":j===1?"var(--accent)":"var(--text-1)",fontFamily:j<2?"var(--font-mono)":"inherit",fontSize:j<2?12:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.3 — Virtual Address Space Layout</h3>
      <P>On 64-bit Windows, each process gets a 128 TB user-mode virtual address space (addresses 0x0000000000000000 – 0x00007FFFFFFFFFFF) and the kernel occupies the upper 128 TB (0xFFFF800000000000 – 0xFFFFFFFFFFFFFFFF). The layout of the user-mode space for a typical process:</P>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Region","Typical address (ASLR-randomized)","Contents"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["Null page","0x0000000000000000","64KB unmapped — catches NULL pointer dereferences"],
            ["Executable image","~0x140000000 (ASLR)","The main .exe mapped from disk (code, data, read-only data)"],
            ["Loaded DLLs","Scattered, ASLR","ntdll.dll, kernel32.dll, ucrtbase.dll, app DLLs, etc."],
            ["Heaps","Dynamic","Default process heap + additional heaps from HeapCreate()"],
            ["Thread stacks","Dynamic (ASLR)","Each thread gets 1MB stack by default (committed on demand)"],
            ["PEB","~0x7FF... (ASLR)","Process Environment Block: image base, command line, env vars, loader data, heap list"],
            ["User-mode limit","0x00007FFFFFFFFFFF","Top of user address space — kernel starts above"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--text-0)":j===1?"var(--c-system)":"var(--text-1)",fontFamily:j<2?"var(--font-mono)":"inherit",fontSize:j<2?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>
      <P><Term>ASLR (Address Space Layout Randomization)</Term> randomizes the base addresses of the executable, DLLs, stack, and heap on each launch. Without ASLR, an attacker who knows a buffer overflow target can hardcode the return address. With ASLR, they need an info-leak vulnerability first to discover the randomized address before they can exploit the overflow. Windows implements ASLR for both the kernel (KASLR) and user mode.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.4 — Access Token: The Security Context</h3>
      <P>Every process has an <Term>access token</Term> attached to it (field <code style={{fontFamily:"var(--font-mono)",fontSize:12,background:"rgba(255,255,255,0.06)",padding:"1px 6px",borderRadius:4}}>EPROCESS.Token</code>). The token is a kernel object that answers the question: "Who is this process, and what is it allowed to do?" It contains:</P>
      <ul style={{paddingLeft:24,lineHeight:2,fontSize:14,color:"var(--text-1)"}}>
        <li><strong>User SID</strong> — e.g., S-1-5-21-...-1001. Identifies the owner of the process.</li>
        <li><strong>Group SIDs</strong> — list of groups the user belongs to (Administrators, Users, Everyone, INTERACTIVE, etc.)</li>
        <li><strong>Privileges</strong> — individual rights not tied to objects: SeDebugPrivilege (debug any process), SeLoadDriverPrivilege (load kernel drivers), SeTcbPrivilege (act as OS), SeImpersonatePrivilege (impersonate any token). Each privilege can be Disabled, Enabled, or Enabled by default.</li>
        <li><strong>Integrity Level (IL)</strong> — Untrusted (0), Low (1), Medium (2), High (3), System (4). Mandatory Integrity Control (MIC) enforces no-write-up: a Medium process cannot write to High objects.</li>
        <li><strong>Primary token vs impersonation token</strong> — A thread can temporarily impersonate a different security context (e.g., a service impersonating a client) by attaching an impersonation token to itself.</li>
      </ul>
      <Callout color="var(--c-err)" icon="warning" titleEn="Token theft — privilege escalation via stolen token" titleUz="">
        If an attacker has SeDebugPrivilege (or is already SYSTEM), they can open a SYSTEM-level process (e.g., lsass.exe), call <code>OpenProcessToken()</code>, duplicate the token with <code>DuplicateTokenEx()</code>, and inject it into their own process with <code>ImpersonateLoggedOnUser()</code>. Their process now runs as SYSTEM. This is why SeDebugPrivilege is called "a gift of god to attackers" — any process with it can effectively become SYSTEM. Mimikatz uses this technique routinely.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.5 — Integrity Levels and UAC</h3>
      <P>Windows Vista introduced <Term>Mandatory Integrity Control (MIC)</Term>. Every object (file, registry key, process) has an integrity label. The MIC policy enforces: <strong>no write-up</strong> (a lower-integrity process cannot write to a higher-integrity object), <strong>no read-up</strong> (for some object types), <strong>no execute-up</strong>. The practical levels:</P>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Level","SID","Who runs at this level","Typical access"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["Untrusted","S-1-16-0","Anonymous, AppContainer (sandboxed UWP)","Almost nothing — can't write anywhere meaningful"],
            ["Low","S-1-16-4096","IE/Edge in Protected Mode, downloaded files initially","Temp folder, specific registry keys only"],
            ["Medium","S-1-16-8192","Normal user processes (standard user or unelevated admin)","User profile, HKCU, no HKLM writes, no system dir writes"],
            ["High","S-1-16-12288","Elevated processes (UAC elevation, RunAs)","HKLM, Program Files, system dirs, kernel driver load"],
            ["System","S-1-16-16384","Windows services (SYSTEM account), LSASS, kernel drivers","Full access to everything in user mode"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":j===1?"var(--c-warn)":"var(--text-1)",fontFamily:j<2?"var(--font-mono)":"inherit",fontSize:j<2?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>
      <P><Term>UAC (User Account Control)</Term> is the mechanism that elevates processes from Medium to High integrity. When an executable requests elevation (via a UAC manifest or via RunAs), Windows creates a second, elevated token with the Administrator SID active and IL=High, and presents the "Do you want to allow this app to make changes?" dialog. The unelevated and elevated processes are separate — even for the same user — which is why a Medium notepad.exe cannot read the memory of a High cmd.exe.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.6 — Protected Processes and PPL</h3>
      <P>Windows Vista introduced <Term>Protected Processes</Term> for DRM (media playback). Windows 8.1 extended this with <Term>Protected Process Light (PPL)</Term> for security-critical processes. A protected process has a ProtectionLevel set in EPROCESS. The rules:</P>
      <ul style={{paddingLeft:24,lineHeight:2,fontSize:14,color:"var(--text-1)"}}>
        <li>A non-protected process (even SYSTEM) cannot open a protected process with PROCESS_VM_READ, PROCESS_VM_WRITE, or PROCESS_INJECT_THREAD access.</li>
        <li>Only a process with equal or higher protection level can open a protected process.</li>
        <li>LSASS runs as PPL (PsProtectedSignerLsa-Light) on Windows 10+ when Credential Guard is configured. This blocks Mimikatz's OpenProcess approach to dumping LSASS.</li>
        <li>Antivirus products must have their drivers signed with a special "Early Launch Anti-Malware (ELAM)" certificate to run as protected processes.</li>
      </ul>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.7 — Process Injection Techniques</h3>
      <P>Process injection is the act of executing attacker code in the address space of another process — to evade detection, inherit its privileges, or hide activity behind a legitimate process name. The main techniques:</P>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14,marginTop:12}}>
        {[
          {title:"Classic DLL Injection",color:"var(--c-warn)",body:'VirtualAllocEx() → WriteProcessMemory() → CreateRemoteThread(LoadLibraryA). Attacker allocates space in the target, writes the DLL path string, then creates a remote thread starting at LoadLibraryA. Detected by: Sysmon Event 8 (CreateRemoteThread), DLL load events, memory scanning.'},
          {title:"Process Hollowing",color:"var(--c-err)",body:'CreateProcess(SUSPENDED) → NtUnmapViewOfSection() → VirtualAllocEx() → WriteProcessMemory() → SetThreadContext() → ResumeThread(). The attacker creates a legitimate process suspended, unmaps its image, writes malicious code, and redirects the entry point. The process appears as legitimate in Task Manager.'},
          {title:"APC Injection",color:"var(--accent)",body:'VirtualAllocEx() + WriteProcessMemory() → QueueUserAPC(shellcode, thread). Asynchronous Procedure Calls are functions queued to execute in a thread context when it enters an alertable wait state (SleepEx, WaitForSingleObjectEx). Used in process doppelgänging and early-bird injection.'},
          {title:"Reflective DLL Injection",color:"var(--c-system)",body:"The DLL contains its own loader — no LoadLibrary call. The attacker writes the DLL bytes into target memory and calls an exported ReflectiveLoader() function that maps the DLL without touching the Windows loader. Used by Metasploit Meterpreter and Cobalt Strike."},
        ].map(c=><div key={c.title} style={{padding:"14px 16px",background:`${c.color}08`,border:`1px solid ${c.color}25`,borderLeft:`3px solid ${c.color}`,borderRadius:8}}>
          <div style={{fontWeight:700,fontSize:13,color:c.color,marginBottom:6}}>{c.title}</div>
          <div style={{fontSize:13,color:"var(--text-1)",lineHeight:1.6}}>{c.body}</div>
        </div>)}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.8 — Process Parent-Child Relationships</h3>
      <P>Every EPROCESS stores its <Term>parent PID (PPID)</Term>. When Explorer launches notepad.exe, notepad's PPID is Explorer's PID. However, the parent-child relationship in Windows is <Em>not enforced</Em> after creation — a process can specify any PID as its parent via PROC_THREAD_ATTRIBUTE_PARENT_PROCESS attribute in CreateProcess. Malware uses PPID spoofing to make malicious processes appear as children of explorer.exe or svchost.exe rather than the actual launching process. Detecting PPID spoofing: compare the PPID in EPROCESS with the actual handle inheritance chain using WMI or ETW events.</P>
      <pre style={{background:"rgba(0,0,0,0.35)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 16px",fontSize:12,lineHeight:1.7,overflowX:"auto",marginTop:10}}><code>{`# List all processes with PID and PPID (PowerShell)
Get-CimInstance Win32_Process | Select-Object ProcessId, ParentProcessId, Name, CommandLine |
  Sort-Object ProcessId | Format-Table -AutoSize

# Find anomalous parent-child relationships
# Expected: svchost.exe PPID = services.exe
# Suspicious: svchost.exe PPID = cmd.exe or powershell.exe

# Sysmon Event ID 1 — Process Create
# Logs: Image, CommandLine, ParentImage, ParentCommandLine, Hashes, IntegrityLevel
# Essential for detecting PPID spoofing and living-off-the-land attacks

# Check process token integrity level
Get-Process -Name notepad | ForEach-Object {
  $p = $_
  $token = [System.Security.Principal.WindowsIdentity]::GetCurrent()
  $token.Groups | Where-Object { $_.Value -like "S-1-16-*" }
}`}</code></pre>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="Jarayonlar — Bajarilish Konteyneri" en="" />
      <P><Term>Jarayon (Process)</Term> — Windows'ning izolyatsiyaning asosiy birligi. Kod emas, thread lar ishlaydi. Jarayon — bajariladigan dasturni o'rab turgan <Em>konteyner</Em>: o'zining virtual manzil fazosi (bir jarayon boshqasining xotirasini o'qiy olmaydi), o'zining handle jadvali (fayl, mutex kabi yadro ob'ektlariga havolalar), kirish tokeni (jarayonga nima ruxsat berilgan) va kamida bitta thread. Notepad.exe ni ikki marta bosganingizda, Windows yadrada jarayon ob'ektini yaratadi, 128 TB virtual manzil fazosini ajratadi, bajariladigan faylni unga moslashtiradi va birinchi thread ni yaratadi.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.1 — EPROCESS: Yadro Tuzilmasi</h3>
      <P>Har bir jarayon yadrada <Term>EPROCESS</Term> tuzilmasi sifatida ifodalanadi — paged bo'lmagan pooldan ajratilgan katta, qisman noaniq xotira bloki. U yadroning jarayonni boshqarishi uchun kerak bo'lgan hamma narsani o'z ichiga oladi.</P>
      <pre style={{background:"rgba(0,0,0,0.35)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 16px",fontSize:12,lineHeight:1.7,overflowX:"auto",marginTop:10}}><code>{`// Soddalashtirilgan EPROCESS (tanlangan maydonlar)
typedef struct _EPROCESS {
  KPROCESS         Pcb;              // Dispatcher sarlavhasi + rejalashtiruvchi holati
  LARGE_INTEGER    CreateTime;       // Yaratilish vaqti
  RTL_AVL_TREE     VadRoot;          // Virtual Manzil Tavsiflovchi daraxti (VAD)
  HANDLE_TABLE*    ObjectTable;      // Handle jadvali (fayllar, mutex, event, ...)
  EX_FAST_REF      Token;            // Kirish tokeni → bu jarayon kim?
  ULONG_PTR        UniqueProcessId;  // PID
  LIST_ENTRY       ActiveProcessLinks; // Barcha EPROCESS larning ikki tomonlama ro'yxati
  UNICODE_STRING   ImageFileName;    // Qisqa nom (15 belgigacha)
  ULONG            ProtectionLevel;  // PPL: Himoyalangan Jarayon Yengil darajasi
} EPROCESS;`}</code></pre>
      <P><Em>ActiveProcessLinks</Em> ikki tomonlama ro'yxati barcha tirik EPROCESS larni birlashtiradi. Task Manager va Process Explorer jarayonlarni sanash uchun bu ro'yxatni aylanib chiqadi. DKOM rootkit lar jarayonni user-space vositalaridan yashirish uchun EPROCESS ni bu ro'yxatdan olib tashlaydi — lekin kriminalistik vositalar ulangan bo'lmagan jarayonlarni topish uchun pool ni EPROCESS imzolari uchun skanerlashi mumkin.</P>
      <Callout color="var(--c-warn)" icon="warning" titleUz="VAD daraxti — haqiqiy xotira xaritasi" titleEn="">
        <strong>Virtual Manzil Tavsiflovchi (VAD)</strong> daraxti jarayonning virtual manzil fazosining vakolatli xaritasi. Har bir VirtualAlloc, MapViewOfFile va LoadLibrary VAD tugunini yaratadi. Zararli dastur tahlil vositalari (Volatility'da malfind) VAD daraxtini aylanib chiqib in'ektlangan hududlarni topadi — bajariladigan, yozish mumkin va diskdagi faylga asoslanmagan xotira shellcode in'ektsiyasining kuchli ko'rsatkichi.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.2 — Jarayon Yaratish: CreateProcess Oqimi</h3>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Qadam","Qatlam","Nima sodir bo'ladi"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["1","kernel32.dll","CreateProcessW() parametrlarni tekshiradi, bajariladigan fayl yo'lini hal qiladi, fayl turini tekshiradi"],
            ["2","kernel32.dll","Rasm faylini ochadi, bo'lim ob'ektini yaratadi (PE ni xotiraga moslashtiradi)"],
            ["3","ntdll.dll","NtCreateUserProcess() — EPROCESS, ETHREAD, manzil fazosi va PEB/TEB ni atomik yaratuvchi bitta tizim chaqiruvi"],
            ["4","Yadro","EPROCESS ni ajratadi, handle jadvalini, VAD daraxtini, tokenini (ota-onadan meros) ishga tushiradi"],
            ["5","Yadro","Dastlabki ETHREAD ni yaratadi, stekini ajratadi, boshlash manzilini ntdll!LdrInitializeThunk ga o'rnatadi"],
            ["6","ntdll.dll (yangi jarayon)","LdrInitializeThunk ishga tushadi: barcha import DLL larni yuklaydi, importlarni hal qiladi, DLL_PROCESS_ATTACH ni chaqiradi, WinMain ga sakraydi"],
            ["7","CSRSS","Yangi jarayon Win32 pastki tizim xizmatlari uchun CSRSS bilan ro'yxatdan o'tadi"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--c-warn)":j===1?"var(--accent)":"var(--text-1)",fontFamily:j<2?"var(--font-mono)":"inherit",fontSize:j<2?12:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.3 — Virtual Manzil Fazosi Tartibı</h3>
      <P>64-bitli Windows'da har bir jarayon 128 TB user-mode virtual manzil fazosiga ega (0x0000... – 0x00007FFF...) va yadro yuqori 128 TB ni egallaydi (0xFFFF8000...). <Term>ASLR (Manzil Fazosi Tartibini Tasodifiylashtirish)</Term> bajariladigan fayl, DLL, stek va heap ning asosiy manzillarini har bir yuklashda tasodifiylashtiradi. ASLR siz tajovuzkor buffer overflow maqsadli qaytish manzilini qattiq kodlashi mumkin edi. ASLR bilan tajovuzkorga avval overflow dan foydalanish uchun tasodifiy manzilni aniqlash uchun ma'lumot sizib chiqish zaifligi kerak.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.4 — Kirish Tokeni: Xavfsizlik Konteksti</h3>
      <P>Har bir jarayonda <Term>kirish tokeni</Term> biriktirilgan (<code style={{fontFamily:"var(--font-mono)",fontSize:12,background:"rgba(255,255,255,0.06)",padding:"1px 6px",borderRadius:4}}>EPROCESS.Token</code> maydoni). Token — "Bu jarayon kim va nima qilishga ruxsati bor?" degan savolga javob beradigan yadro ob'ekti:</P>
      <ul style={{paddingLeft:24,lineHeight:2,fontSize:14,color:"var(--text-1)"}}>
        <li><strong>Foydalanuvchi SID</strong> — masalan S-1-5-21-...-1001. Jarayon egasini aniqlaydi.</li>
        <li><strong>Guruh SID lari</strong> — Administrators, Users, Everyone, INTERACTIVE va boshqalar.</li>
        <li><strong>Imtiyozlar</strong> — ob'ektlarga bog'liq bo'lmagan individual huquqlar: SeDebugPrivilege (istalgan jarayonni nosozliklashi), SeLoadDriverPrivilege (yadro drayveri yuklash), SeTcbPrivilege (OT sifatida harakat qilish). Har bir imtiyoz O'chirilgan, Yoqilgan yoki Standart yoqilgan bo'lishi mumkin.</li>
        <li><strong>Yaxlitlik Darajasi (IL)</strong> — Ishonilmagan (0), Past (1), O'rta (2), Yuqori (3), Tizim (4). Majburiy Yaxlitlik Nazorati (MIC) yozishni yuqoriga bloklaydi: O'rta jarayon Yuqori ob'ektlarga yoza olmaydi.</li>
      </ul>
      <Callout color="var(--c-err)" icon="warning" titleUz="Token o'g'irlash — o'g'irlangan token orqali imtiyozlarni oshirish" titleEn="">
        Agar tajovuzkor SeDebugPrivilege ga ega bo'lsa yoki allaqachon SYSTEM bo'lsa, u SYSTEM darajadagi jarayonni (lsass.exe) ochib, tokenini nusxalab va o'z jarayoniga in'ektsiya qilishi mumkin. Jarayoni endi SYSTEM sifatida ishlaydi. Mimikatz bu texnikadan muntazam foydalanadi.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.5 — Jarayon In'ektsiya Texnikalari</h3>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14,marginTop:12}}>
        {[
          {title:"Klassik DLL In'ektsiya",color:"var(--c-warn)",body:"VirtualAllocEx() → WriteProcessMemory() → CreateRemoteThread(LoadLibraryA). Tajovuzkor maqsadda joy ajratadi, DLL yo'l satrini yozadi, keyin LoadLibraryA dan boshlanadigan masofaviy thread yaratadi. Sysmon Event 8 (CreateRemoteThread) bilan aniqlanadi."},
          {title:"Jarayon Bo'shatish (Hollowing)",color:"var(--c-err)",body:"CreateProcess(SUSPENDED) → NtUnmapViewOfSection() → WriteProcessMemory() → ResumeThread(). Tajovuzkor qonuniy jarayonni to'xtatilgan holda yaratadi, uning rasmini olib tashlaydi, zararli kod yozadi va kirish nuqtasini qayta yo'naltiradi. Jarayon Task Manager da qonuniy ko'rinadi."},
          {title:"APC In'ektsiya",color:"var(--accent)",body:"VirtualAllocEx() + WriteProcessMemory() → QueueUserAPC(shellcode, thread). Asenkron Protsedura Chaqiruvlar — thread uyg'ot holatiga (SleepEx) kirganida bajarilish uchun navbatga qo'yilgan funksiyalar. Early-bird in'ektsiyada ishlatiladi."},
          {title:"Reflektiv DLL In'ektsiya",color:"var(--c-system)",body:"DLL o'z yuklovchisini o'z ichiga oladi — LoadLibrary chaqiruvi yo'q. Tajovuzkor DLL baytlarini maqsad xotirasiga yozadi va Windows yuklovchisiga tegmasdan DLL ni moslashtiruvchi ReflectiveLoader() ni chaqiradi. Metasploit Meterpreter va Cobalt Strike ishlatadi."},
        ].map(c=><div key={c.title} style={{padding:"14px 16px",background:`${c.color}08`,border:`1px solid ${c.color}25`,borderLeft:`3px solid ${c.color}`,borderRadius:8}}>
          <div style={{fontWeight:700,fontSize:13,color:c.color,marginBottom:6}}>{c.title}</div>
          <div style={{fontSize:13,color:"var(--text-1)",lineHeight:1.6}}>{c.body}</div>
        </div>)}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.6 — Jarayon Ota-Bola Munosabatlari va PPID Soxtalashtirish</h3>
      <P>Har bir EPROCESS o'zining <Term>ota-ona PID (PPID)</Term> ini saqlaydi. Lekin Windows'da ota-bola munosabati yaratilgandan keyin <Em>ta'minlanmaydi</Em> — jarayon CreateProcess da PROC_THREAD_ATTRIBUTE_PARENT_PROCESS atributi orqali istalgan PIDni ota-ona sifatida ko'rsatishi mumkin. Zararli dasturlar PPID soxtalashtirish orqali zararli jarayonlarni haqiqiy ishga tushiruvchi jarayon o'rniga explorer.exe yoki svchost.exe ning bolasi ko'rinishida ko'rsatadi.</P>
      <pre style={{background:"rgba(0,0,0,0.35)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 16px",fontSize:12,lineHeight:1.7,overflowX:"auto",marginTop:10}}><code>{`# PID va PPID bilan barcha jarayonlar ro'yxati (PowerShell)
Get-CimInstance Win32_Process |
  Select-Object ProcessId, ParentProcessId, Name, CommandLine |
  Sort-Object ProcessId | Format-Table -AutoSize

# Anomal ota-bola munosabatlarini topish
# Kutilgan: svchost.exe PPID = services.exe
# Shubhali: svchost.exe PPID = cmd.exe yoki powershell.exe

# Sysmon Event ID 1 — Jarayon Yaratish
# Yozadi: Image, CommandLine, ParentImage, Hashes, IntegrityLevel`}</code></pre>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// L13 — Threads
// ─────────────────────────────────────────────────────────────
function SectionThreads() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="Threads — The Unit of Execution" uz="" />
      <P>A <Term>thread</Term> is the entity the CPU scheduler actually runs. While a process is an isolation container, a thread is the instruction pointer + register state + stack that moves through the code. A process must have at least one thread; it can have thousands. All threads within a process share the same virtual address space, the same handle table, and the same access token — but each thread has its own <Em>stack</Em>, its own <Em>CPU registers</Em> (saved as a CONTEXT structure during context switches), and its own <Em>Thread Environment Block (TEB)</Em>. This shared-but-separate model is why multi-threading is powerful and why thread synchronization bugs (race conditions, deadlocks) are so hard to debug.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.1 — ETHREAD and TEB</h3>
      <P>Every thread is represented in the kernel as an <Term>ETHREAD</Term> structure. Key fields:</P>
      <pre style={{background:"rgba(0,0,0,0.35)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 16px",fontSize:12,lineHeight:1.7,overflowX:"auto",marginTop:10}}><code>{`typedef struct _ETHREAD {
  KTHREAD        Tcb;             // Kernel thread control block
                                  //   — scheduler state, priority, quantum, APC queues
  LARGE_INTEGER  CreateTime;
  LARGE_INTEGER  ExitTime;
  ULONG          ThreadId;        // TID
  PEPROCESS      ThreadsProcess;  // Back-pointer to owning EPROCESS
  PVOID          StartAddress;    // Original start address (CreateThread parameter)
  PVOID          Win32StartAddress; // User-mode start address (for debugging)
  CLIENT_ID      Cid;             // { UniqueProcess, UniqueThread }
  ULONG          SameThreadApcFlags;
  // ... impersonation token, I/O pending flag, ...
} ETHREAD;`}</code></pre>
      <P>The <Term>TEB (Thread Environment Block)</Term> lives in user-mode memory and is accessible to the thread itself via the <code style={{fontFamily:"var(--font-mono)",fontSize:12,background:"rgba(255,255,255,0.06)",padding:"1px 6px",borderRadius:4}}>GS</code> segment register on x64 (<code>FS</code> on x86). Key TEB fields:</P>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["TEB Field","Offset (x64)","Contents"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["NtTib.StackBase","0x08","Top of the thread's user-mode stack"],
            ["NtTib.StackLimit","0x10","Bottom of committed stack (guard page below)"],
            ["NtTib.Self","0x30","Pointer to TEB itself — GS:[0x30] = &TEB"],
            ["ProcessEnvironmentBlock","0x60","Pointer to the process PEB — GS:[0x60] = &PEB"],
            ["LastErrorValue","0x68","Result of GetLastError() — per-thread Win32 error code"],
            ["ThreadId","0x48","TID — GS:[0x48]"],
            ["TlsSlots[0..63]","0x1480","Thread Local Storage slots 0-63 inline"],
            ["TlsExpansionSlots","0x1788","Pointer to extended TLS slots 64-1088"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":j===1?"var(--c-warn)":"var(--text-1)",fontFamily:j<2?"var(--font-mono)":"inherit",fontSize:j<2?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>
      <Callout color="var(--c-system)" icon="info" titleEn="Why attackers read the TEB" titleUz="">
        Shellcode frequently uses GS:[0x60] to find the PEB, then walks PEB.Ldr (the loader data list) to find loaded DLLs without calling any Windows API — a technique called "PEB walking." This avoids triggering import-address-table hooks placed by antivirus software. Every hand-written shellcode in the wild does this: <code>mov rax, gs:[0x60] // PEB</code>.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.2 — Thread States</h3>
      <P>The Windows scheduler tracks each thread through a state machine:</P>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["State","Meaning"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["Running","Executing on a CPU right now. At most one thread per logical CPU core can be Running."],
            ["Ready","Eligible to run, waiting for a CPU to become free. Held in per-priority ready queues."],
            ["Waiting (Blocked)","Blocked on a kernel object: WaitForSingleObject(), Sleep(), I/O completion, page fault. Not consuming CPU."],
            ["Transition","Ready to run but its kernel stack was paged out — waiting for the stack to be paged back in."],
            ["Terminated","ExitThread() called or the owning process exited. ETHREAD object still exists until the last handle closes."],
            ["Initialized","Thread object created but not yet ready to run (between NtCreateThread and the first scheduler tick)."],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?12:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.3 — The Windows Scheduler: Priorities and Quanta</h3>
      <P>Windows uses a <Term>preemptive, priority-based scheduler</Term>. There are 32 priority levels (0–31). The scheduler always picks the highest-priority Ready thread. If a thread of equal or higher priority becomes Ready while another is Running, the running thread is preempted immediately.</P>
      <P><strong>Priority classes and base priorities:</strong></P>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Priority class","Base priority range","Win32 constant"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["Idle","1 (base 1)","IDLE_PRIORITY_CLASS"],
            ["Below Normal","4–6 (base 6)","BELOW_NORMAL_PRIORITY_CLASS"],
            ["Normal","4–9 (base 8 for foreground, 6 for background)","NORMAL_PRIORITY_CLASS"],
            ["Above Normal","6–11 (base 10)","ABOVE_NORMAL_PRIORITY_CLASS"],
            ["High","11–15 (base 13)","HIGH_PRIORITY_CLASS"],
            ["Realtime","16–31 (base 24)","REALTIME_PRIORITY_CLASS — bypass normal scheduler"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--text-0)":j===2?"var(--accent)":"var(--text-1)",fontFamily:j!==0&&j!==2?"inherit":"var(--font-mono)",fontSize:j===2?12:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>
      <P>Within a priority class, each thread has a <Em>relative thread priority</Em> offset (THREAD_PRIORITY_LOWEST = −2 through THREAD_PRIORITY_HIGHEST = +2, plus THREAD_PRIORITY_TIME_CRITICAL = 15 and THREAD_PRIORITY_IDLE = 1). The actual scheduling priority = priority class base + relative offset.</P>
      <P><strong>Quantum:</strong> The time slice a Running thread is allowed before being preempted. On client Windows (workstation), a quantum is 2 clock intervals (~15.6ms each) = ~31ms. On Windows Server, quanta are longer (12 intervals = ~187ms) to reduce context-switch overhead for long-running services. The scheduler measures quanta in <Em>quantum units</Em> (1 unit ≈ 1/3 of a clock interval), and reduces the count on each clock tick.</P>
      <P><strong>Priority boost:</strong> The scheduler automatically boosts a thread's dynamic priority above its base priority after certain events: completing a wait (e.g., receiving a keyboard/mouse event → UI thread gets +2 boost), completing I/O, being starved at low priority. The boost decays by 1 unit per quantum until it returns to base. This prevents low-priority threads from starving completely while still letting high-priority threads dominate.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.4 — Thread Synchronization Primitives</h3>
      <P>Threads within a process share the same memory. Without synchronization, two threads modifying the same variable simultaneously produce unpredictable results (race condition). Windows provides:</P>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:14,marginTop:12}}>
        {[
          {title:"Critical Section (CRITICAL_SECTION)",color:"var(--accent)",body:"User-mode spin lock + kernel event. Fast path: if the CS is free, a single interlocked operation acquires it without entering the kernel. Slow path: if contended, falls back to a kernel Event object to wait. Fastest synchronization for same-process threads. Non-recursive-safe by default."},
          {title:"Mutex (HANDLE)",color:"var(--c-system)",body:"Kernel object. Named mutexes work cross-process (unlike CRITICAL_SECTION). Supports waiting with timeout (WaitForSingleObject). The owning thread can re-acquire without deadlocking (recursive). Abandoned mutex (owning process died) returns WAIT_ABANDONED — the state is unknown."},
          {title:"Event (HANDLE)",color:"var(--c-ok)",body:"Kernel object with two states: signaled / non-signaled. Auto-reset: automatically resets to non-signaled after releasing one waiter. Manual-reset: stays signaled until explicitly reset with ResetEvent() — all waiters released simultaneously. Used for one-thread-signals-many patterns."},
          {title:"Semaphore (HANDLE)",color:"var(--c-warn)",body:"Kernel object with a count. Allows up to N threads to enter simultaneously (N set at creation). ReleaseSemaphore() increments the count; WaitForSingleObject() decrements it (blocking when count = 0). Classic for limiting concurrent access to a resource pool."},
          {title:"SRWLock (SRWLOCK)",color:"var(--accent)",body:"Slim Reader-Writer Lock. User-mode only (no kernel involvement). Multiple readers can hold simultaneously; a writer gets exclusive access. Significantly lower overhead than a kernel mutex. Used throughout ntdll.dll and the CRT. Does NOT support recursive acquisition."},
          {title:"Interlocked functions",color:"var(--c-system)",body:"InterlockedIncrement(), InterlockedCompareExchange(), etc. — CPU-level atomic operations (LOCK XADD, CMPXCHG). Zero kernel overhead. Used for lock-free data structures and reference counting. The foundation of all other synchronization."},
        ].map(c=><div key={c.title} style={{padding:"14px 16px",background:`${c.color}08`,border:`1px solid ${c.color}25`,borderLeft:`3px solid ${c.color}`,borderRadius:8}}>
          <div style={{fontWeight:700,fontSize:13,color:c.color,marginBottom:6}}>{c.title}</div>
          <div style={{fontSize:13,color:"var(--text-1)",lineHeight:1.6}}>{c.body}</div>
        </div>)}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.5 — Thread Local Storage (TLS)</h3>
      <P><Term>Thread Local Storage (TLS)</Term> provides per-thread global variables — a variable declared <code style={{fontFamily:"var(--font-mono)",fontSize:12,background:"rgba(255,255,255,0.06)",padding:"1px 6px",borderRadius:4}}>__declspec(thread)</code> or <code>thread_local</code> gets its own copy in each thread. In the PE format, a <code>.tls</code> section holds the TLS template; the loader copies it for each new thread and stores a pointer in the TEB's TlsSlots array. Applications can use dynamic TLS via <code>TlsAlloc()</code> / <code>TlsSetValue()</code> / <code>TlsGetValue()</code> for runtime-determined per-thread data.</P>
      <P><strong>Security relevance:</strong> TLS callbacks are functions stored in the PE's <code>.tls</code> directory that Windows calls <Em>before</Em> the executable's entry point, even before the debugger breaks. Malware uses TLS callbacks for anti-debug tricks and early initialization of obfuscation code that runs before any analysis tool can intercept the main entry point.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.6 — Thread Injection Techniques</h3>
      <P>Thread injection allows an attacker to execute code in another process by hijacking or creating threads:</P>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Technique","API used","Detection"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["CreateRemoteThread","CreateRemoteThread(hProcess, NULL, 0, shellcode, param, 0, &tid)","Sysmon Event 8 (CreateRemoteThread) — logs source/target process, start address, start module"],
            ["QueueUserAPC / NtQueueApcThread","QueueUserAPC(shellcode, hThread, param) — code runs when thread calls alertable wait","Sysmon Event 8 variant; harder to detect because no new thread is created"],
            ["Thread Hijacking (SetThreadContext)","SuspendThread() → GetThreadContext() → patch RIP/EIP in CONTEXT → SetThreadContext() → ResumeThread()","No new thread created; suspicious: thread suspended by external process, followed by SetThreadContext"],
            ["NtCreateThreadEx","Undocumented native API bypassing some CreateRemoteThread monitoring","Memory/handle-based detection; direct syscall bypasses user-mode hooks"],
            ["Fiber hijacking","ConvertThreadToFiber() + CreateFiber() + SwitchToFiber() — user-mode cooperative scheduling","No scheduler visibility; only detectable by memory scanning for fiber stacks"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>
      <Callout color="var(--c-err)" icon="warning" titleEn="Sysmon Event 8 — your primary thread injection detector" titleUz="">
        Sysmon's CreateRemoteThread event (ID 8) logs: SourceImage, TargetImage, StartAddress, StartModule, and StartFunction. Legitimate inter-process thread creation is rare. Alert on: any process creating a remote thread in another process where StartModule is empty or unknown (shellcode has no associated module name), or where TargetImage is a sensitive process (lsass.exe, csrss.exe, svchost.exe).
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.7 — Thread Pool and Worker Threads</h3>
      <P>Creating a new thread for every small unit of work is expensive (stack allocation, kernel object creation, context switch overhead). Windows provides a built-in <Term>Thread Pool</Term> API (TP_*: CreateThreadpool, SubmitThreadpoolWork, CreateThreadpoolTimer, etc.) that manages a pool of worker threads reused across work items. The thread pool dynamically scales the thread count based on CPU utilization and work queue depth.</P>
      <P>The CLR (.NET runtime), the I/O Completion Port (IOCP) model, and the Win32 thread pool all use this mechanism. From a security perspective, thread pools make attribution harder — malicious work items can be submitted to the system thread pool (via <code>QueueUserWorkItem</code>) so that the executing thread belongs to a system-managed pool thread rather than a thread explicitly created by the malware.</P>
      <pre style={{background:"rgba(0,0,0,0.35)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 16px",fontSize:12,lineHeight:1.7,overflowX:"auto",marginTop:10}}><code>{`# List all threads in a process (PowerShell)
Get-Process -Name "notepad" | Select-Object -ExpandProperty Threads |
  Select-Object Id, StartAddress, ThreadState, WaitReason | Format-Table

# WinDbg — list threads in live session
!process 0 0 notepad.exe  # find EPROCESS
.process /r /p <eprocess_addr>
~*          # show all threads
~0 kb       # stack of thread 0

# Sysmon Event ID 8 — CreateRemoteThread
# Configure in sysmonconfig.xml:
# <RuleGroup name="" groupRelation="or">
#   <CreateRemoteThread onmatch="include">
#     <TargetImage condition="is">lsass.exe</TargetImage>
#   </CreateRemoteThread>
# </RuleGroup>

# Process Hacker: right-click process → Properties → Threads tab
# Shows all threads, start address, start module, CPU usage per thread`}</code></pre>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="Thread'lar — Bajarilish Birligi" en="" />
      <P><Term>Thread</Term> — CPU rejalashtiruvchisi haqiqatda ishlatadigan birlik. Jarayon izolyatsiya konteyneri bo'lsa, thread — kod bo'ylab harakat qiladigan ko'rsatma ko'rsatkichi + registrlar holati + stek. Jarayonda kamida bitta thread bo'lishi kerak, lekin minglab bo'lishi mumkin. Jarayon ichidagi barcha thread lar bir xil virtual manzil fazosi, bir xil handle jadvali va bir xil kirish tokenini baham ko'radi — lekin har bir thread ning o'z <Em>steki</Em>, o'z <Em>CPU registrlari</Em> (kontekst almashish paytida CONTEXT sifatida saqlanadi) va o'z <Em>Thread Muhit Bloki (TEB)</Em> bor.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.1 — ETHREAD va TEB</h3>
      <P>Har bir thread yadrada <Term>ETHREAD</Term> tuzilmasi sifatida ifodalanadi. <Term>TEB (Thread Muhit Bloki)</Term> user-mode xotirasida joylashgan va x64 da <code style={{fontFamily:"var(--font-mono)",fontSize:12,background:"rgba(255,255,255,0.06)",padding:"1px 6px",borderRadius:4}}>GS</code> segment registri orqali thread ning o'ziga kirish mumkin. Shellcode ko'pincha GS:[0x60] dan PEB topib, yuklangan DLL larni Windows API chaqiruvisiz topadi ("PEB yurishi") — bu antivirus tomonidan joylashtirilgan IAT hook larini ishga tushirmaslik uchun.</P>
      <pre style={{background:"rgba(0,0,0,0.35)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 16px",fontSize:12,lineHeight:1.7,overflowX:"auto",marginTop:10}}><code>{`// TEB asosiy maydonlari (x64 offsetlar)
GS:[0x00]  = NtTib.ExceptionList  // SEH zanjiri
GS:[0x08]  = NtTib.StackBase      // Stek yuqori qismi
GS:[0x10]  = NtTib.StackLimit     // Stek pastki qismi (majburiy)
GS:[0x30]  = NtTib.Self           // TEB ga ko'rsatgich
GS:[0x48]  = ClientId.UniqueThread // TID
GS:[0x60]  = ProcessEnvironmentBlock // PEB ga ko'rsatgich
GS:[0x68]  = LastErrorValue        // GetLastError() natijasi (thread bo'yicha)
GS:[0x1480] = TlsSlots[0..63]     // Thread Mahalliy Saqlash slotlari

// Shellcode klassik PEB yurishi:
// mov rax, gs:[0x60]  // PEB
// mov rax, [rax+0x18] // PEB.Ldr
// mov rax, [rax+0x20] // InMemoryOrderModuleList
// -- modullarni aylanib chiqib DLLlarni topadi --`}</code></pre>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.2 — Thread Holatlari</h3>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Holat","Ma'nosi"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["Running","Hozir CPU da ishlayapti. Har bir mantiqiy CPU yadrosida ko'pi bilan bitta Running thread bo'lishi mumkin."],
            ["Ready","Ishlashga tayyor, CPUni kutmoqda. Prioritet bo'yicha tayyor navbatlarda saqlanadi."],
            ["Waiting (Bloklangan)","Yadro ob'ektida bloklangan: WaitForSingleObject(), Sleep(), I/O tugashi, sahifa xatosi. CPU sarflamaydi."],
            ["Transition","Ishlashga tayyor lekin yadro steki disk ga ko'chirilgan — stekni qaytarishni kutmoqda."],
            ["Terminated","ExitThread() chaqirildi yoki egalik qiluvchi jarayon chiqib ketdi."],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?12:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.3 — Windows Rejalashtiruvchisi: Prioritetlar va Kvantlar</h3>
      <P>Windows <Term>oldini olib, prioritetga asoslangan rejalashtiruvchi</Term> ishlatadi. 32 ta prioritet darajasi (0–31) mavjud. Rejalashtiruvchi doimo eng yuqori prioritetli Ready thread ni tanlaydi. Agar teng yoki yuqori prioritetli thread Running holda turganida Ready bo'lsa, ishlaydigan thread darhol to'xtatiladi.</P>
      <P><strong>Kvant</strong> — Running thread ning to'xtatilishidan oldin unga ruxsat etilgan vaqt. Client Windows da kvant ~31ms (2 soat intervali × 15.6ms). Windows Server da uzunroq (~187ms) — uzoq muddatli servislar uchun kontekst almashish qo'shimcha yukini kamaytirish uchun.</P>
      <P><strong>Prioritet ko'tarish:</strong> Rejalashtiruvchi kutish tugaganidan keyin (masalan, klaviatura/sichqoncha hodisasini olish → UI thread +2 ko'tarish oladi) thread ning dinamik prioritetini avtomatik ko'taradi. Ko'tarish asosiy prioritetga qaytguncha har kvantda 1 birlik kamayadi.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.4 — Sinxronizatsiya Primitivlari</h3>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:14,marginTop:12}}>
        {[
          {title:"Critical Section",color:"var(--accent)",body:"User-mode spin lock + yadro hodisasi. Tez yo'l: agar CS bo'sh bo'lsa, yagona interlocked amal kernelga kirmasdan oladi. Sekin yo'l: tortishilganda kutish uchun yadro Event ob'ektiga qaytadi. Bir jarayon ichidagi thread lar uchun eng tez sinxronizatsiya."},
          {title:"Mutex",color:"var(--c-system)",body:"Yadro ob'ekti. Nomlangan mutex lar jarayonlararo ishlaydi (CRITICAL_SECTION dan farqli). Timeout bilan kutishni qo'llab-quvvatlaydi. Egalik qiluvchi thread deadlock siz qayta olishi mumkin. Tark etilgan mutex (jarayon o'lgan) WAIT_ABANDONED qaytaradi."},
          {title:"Event",color:"var(--c-ok)",body:"Yadro ob'ekti ikki holat bilan: signal berilgan / berilmagan. Avtomatik tiklash: bitta kutuvchini qo'yib bergandan keyin avtomatik tiklaydi. Qo'lda tiklash: barcha kutuvchilar bir vaqtda qo'yib beriladi, ResetEvent() gacha signal berilgan qoladi."},
          {title:"SRWLock",color:"var(--c-warn)",body:"Ozg'in O'quvchi-Yozuvchi Qulfi. Faqat user-mode (yadro ishtirokisiz). Bir nechta o'quvchilar bir vaqtda ushlab turishi mumkin; yozuvchi eksklyuziv kirish oladi. Yadro mutex dan sezilarli darajada past qo'shimcha yuk. Rekursiv olishni qo'llab-quvvatlamaydi."},
        ].map(c=><div key={c.title} style={{padding:"14px 16px",background:`${c.color}08`,border:`1px solid ${c.color}25`,borderLeft:`3px solid ${c.color}`,borderRadius:8}}>
          <div style={{fontWeight:700,fontSize:13,color:c.color,marginBottom:6}}>{c.title}</div>
          <div style={{fontSize:13,color:"var(--text-1)",lineHeight:1.6}}>{c.body}</div>
        </div>)}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.5 — Thread In'ektsiya Texnikalari</h3>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Texnika","Ishlatilgan API","Aniqlash"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["CreateRemoteThread","CreateRemoteThread(hJarayon, NULL, 0, shellcode, param, 0, &tid)","Sysmon Event 8 — manba/maqsad jarayon, boshlash manzili, modul yozadi"],
            ["QueueUserAPC","QueueUserAPC(shellcode, hThread, param) — uyg'ot kutishda ishlaydi","Yangi thread yaratilmaydi; aniqlash qiyinroq"],
            ["Thread Hijacking","SuspendThread() → GetThreadContext() → RIP ni o'zgartirish → SetThreadContext() → ResumeThread()","Yangi thread yo'q; shubhali: tashqi jarayon tomonidan to'xtatilgan thread"],
            ["TLS Callback","PE .tls bo'limidagi kirish nuqtasidan oldin chaqiriluvchi funksiya","Kirish nuqtasida bo'linuvchi nuqta o'rniga TLS bo'limini tekshiring"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>
      <Callout color="var(--c-err)" icon="warning" titleUz="Sysmon Event 8 — asosiy thread in'ektsiya aniqlovchingiz" titleEn="">
        CreateRemoteThread hodisasi (ID 8) yozadi: SourceImage, TargetImage, StartAddress, StartModule, StartFunction. Jarayonlararo thread yaratish kamdan-kam qonuniy. Ogohlantirish: StartModule bo'sh yoki noma'lum (shellcode bog'liq modulga ega emas), yoki TargetImage muhim jarayon (lsass.exe, csrss.exe, svchost.exe) bo'lganda.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.6 — Amaliy Buyruqlar</h3>
      <pre style={{background:"rgba(0,0,0,0.35)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 16px",fontSize:12,lineHeight:1.7,overflowX:"auto",marginTop:10}}><code>{`# Jarayondagi barcha thread larni ro'yxatga olish (PowerShell)
Get-Process -Name "notepad" | Select-Object -ExpandProperty Threads |
  Select-Object Id, StartAddress, ThreadState, WaitReason | Format-Table

# WinDbg — barcha thread larni ko'rish
!process 0 0 notepad.exe   # EPROCESS topish
.process /r /p <eprocess>  # joriy jarayon o'zgartirish
~*                          # barcha thread lar
~0 kb                       # 0-thread steki

# Sysmon CreateRemoteThread (Event 8) kuzatish
# sysmonconfig.xml da:
# <CreateRemoteThread onmatch="include">
#   <TargetImage condition="is">lsass.exe</TargetImage>
# </CreateRemoteThread>`}</code></pre>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
function SectionHandles() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="Handles — Kernel Object References" uz="" />
      <P>A <Term>handle</Term> is an opaque 32-bit integer that represents a reference to a kernel object. When your code calls <code style={{fontFamily:"var(--font-mono)",fontSize:12,background:"rgba(255,255,255,0.06)",padding:"1px 6px",borderRadius:4}}>CreateFile()</code>, the kernel creates an internal <em>file object</em>, puts it in the process's <em>handle table</em>, and returns a small integer (4, 8, 12, …) back to user mode. You never touch the kernel object directly — you pass the handle to subsequent API calls (<code>ReadFile</code>, <code>CloseHandle</code>, etc.) and the kernel maps it back to the object internally. This indirection provides isolation (processes can't address each other's objects directly), reference counting (the object lives until all handles are closed), and security checking (access rights are verified when the handle is opened, not on every use).</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.1 — Object Manager and OBJECT_HEADER</h3>
      <P>Every kernel object is preceded in kernel memory by an <Term>OBJECT_HEADER</Term> structure. The Object Manager (<code>ObXxx</code> routines in ntoskrnl.exe) manages creation, reference counting, and destruction of these objects.</P>
      <pre style={{background:"rgba(0,0,0,0.35)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 16px",fontSize:12,lineHeight:1.7,overflowX:"auto",marginTop:10}}><code>{`typedef struct _OBJECT_HEADER {
  LONG_PTR     PointerCount;   // Total kernel references (including handles)
  LONG_PTR     HandleCount;    // Number of open handles (across all processes)
  POBJECT_TYPE Type;           // Points to FILE, PROCESS, THREAD, TOKEN, EVENT… type
  UCHAR        NameInfoOffset; // Optional: optional header with object name
  UCHAR        HandleInfoOffset;
  UCHAR        QuotaInfoOffset;
  UCHAR        Flags;
  // Immediately followed by the actual object body (e.g., _FILE_OBJECT)
} OBJECT_HEADER;`}</code></pre>
      <P>The Object Manager lives in the kernel's <em>Object Namespace</em> — a directory tree rooted at <code>\</code>. You can browse it with WinObj (Sysinternals) or <code>!object \</code> in WinDbg. Common directories:</P>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Namespace Path","Contents"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["\\Device","Physical and virtual device objects (e.g., \\Device\\HarddiskVolume3)"],
            ["\\BaseNamedObjects","Named events, mutexes, semaphores, sections (user-accessible)"],
            ["\\Sessions\\1\\BaseNamedObjects","Per-session named objects (prevent session isolation bypass)"],
            ["\\KnownDlls","Pre-loaded DLL section objects — speed optimization & security"],
            ["\\ObjectTypes","One entry per object type (File, Process, Thread, Token…)"],
            ["\\Windows","Window stations and desktops"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.2 — Handle Table Structure</h3>
      <P>Each process has a private <Term>handle table</Term> — a kernel-managed array where each entry contains a pointer to the kernel object plus access rights granted when the handle was opened. The table is pageable kernel memory; entries are allocated in multiples of 4 (handles are always divisible by 4 because the low 2 bits carry flags).</P>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Handle Entry Field","Size","Description"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["ObjectPointerBits","60 bits","Pointer to kernel object >> 4 (low bits reused)"],
            ["GrantedAccessBits","25 bits","Access mask granted at OpenProcess / CreateFile time"],
            ["Attributes","3 bits","Inherit, ProtectFromClose, Audit-on-close flags"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>
      <Callout color="var(--c-system)" icon="info" titleEn="Access rights are baked in at open time" titleUz="">
        If you open a file with <code>GENERIC_READ</code>, the handle entry stores exactly that mask. Later calls to <code>ReadFile(handle)</code> use the stored mask — no re-checking against the file's ACL every time. This is why privilege escalation often focuses on stealing a handle opened with broad rights rather than bypassing the ACL directly.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.3 — Common Handle Types</h3>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12}}>
        {[
          {type:"File / Directory",api:"CreateFile, NtCreateFile",flags:"GENERIC_READ, GENERIC_WRITE, DELETE, FILE_READ_ATTRIBUTES",note:"Most common type; includes pipes, consoles, devices"},
          {type:"Process",api:"OpenProcess",flags:"PROCESS_VM_READ, PROCESS_VM_WRITE, PROCESS_CREATE_THREAD, PROCESS_ALL_ACCESS",note:"Having PROCESS_VM_READ on LSASS = instant credential dump"},
          {type:"Thread",api:"OpenThread",flags:"THREAD_SUSPEND_RESUME, THREAD_SET_CONTEXT, THREAD_GET_CONTEXT",note:"Used for thread injection (SetThreadContext)"},
          {type:"Token",api:"OpenProcessToken",flags:"TOKEN_QUERY, TOKEN_IMPERSONATE, TOKEN_DUPLICATE, TOKEN_ADJUST_PRIVILEGES",note:"Duplicating a SYSTEM token → impersonation attack"},
          {type:"Event / Mutex / Semaphore",api:"CreateEvent, CreateMutex",flags:"EVENT_MODIFY_STATE, MUTEX_ALL_ACCESS, SEMAPHORE_MODIFY_STATE",note:"Named objects visible across processes; malware uses mutexes as 'already-running' checks"},
          {type:"Registry Key",api:"RegOpenKeyEx, NtOpenKey",flags:"KEY_READ, KEY_WRITE, KEY_ALL_ACCESS",note:"Open key handle survives key deletion until closed"},
          {type:"Section (Memory Map)",api:"CreateFileMapping",flags:"SECTION_MAP_READ, SECTION_MAP_WRITE, SECTION_MAP_EXECUTE",note:"Foundation of shared memory; DLL loading; reflective DLL injection"},
          {type:"Job Object",api:"CreateJobObject",flags:"JOB_OBJECT_ALL_ACCESS",note:"Contains and limits a group of processes — escaping a job is a sandbox bypass"},
        ].map((item,i)=>(
          <div key={i} style={{padding:"12px 14px",borderRadius:8,background:"rgba(255,255,255,0.03)",border:"1px solid var(--border)"}}>
            <div style={{fontFamily:"var(--font-mono)",fontSize:12,color:"var(--accent)",fontWeight:700,marginBottom:4}}>{item.type}</div>
            <div style={{fontSize:11,color:"var(--c-warn)",fontFamily:"var(--font-mono)",marginBottom:6}}>API: {item.api}</div>
            <div style={{fontSize:11,color:"var(--text-2)",marginBottom:4}}>Flags: {item.flags}</div>
            <div style={{fontSize:12,color:"var(--text-1)"}}>{item.note}</div>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.4 — Handle Duplication and Inheritance</h3>
      <P><Term>DuplicateHandle</Term> copies a handle from one process's table to another process's table. The duplicated handle refers to the same underlying kernel object; the object's <code>HandleCount</code> increments. The caller needs <code>PROCESS_DUP_HANDLE</code> on both source and target processes.</P>
      <pre style={{background:"rgba(0,0,0,0.35)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 16px",fontSize:12,lineHeight:1.7,overflowX:"auto",marginTop:10}}><code>{`// Steal a handle from another process (requires PROCESS_DUP_HANDLE on victim)
HANDLE hVictim = OpenProcess(PROCESS_DUP_HANDLE, FALSE, victimPid);
HANDLE hStolen;
DuplicateHandle(
    hVictim,         // source process
    0x40,            // handle value inside victim (e.g., their LSASS handle)
    GetCurrentProcess(),  // target process (us)
    &hStolen,        // new handle value in our table
    0, FALSE,
    DUPLICATE_SAME_ACCESS   // copy whatever access victim had
);
// hStolen now has the same rights as victim's handle`}</code></pre>
      <P><Term>Inheritable handles</Term>: when a process is created with <code>CreateProcess</code> and <code>bInheritHandles=TRUE</code>, all handles marked <code>HANDLE_FLAG_INHERIT</code> are duplicated into the child's table with the same access rights. This is how stdin/stdout/stderr pipes work — the parent creates pipe handles, marks them inheritable, and passes their values in <code>STARTUPINFO</code>.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.5 — Handle Leaks</h3>
      <P>A <Term>handle leak</Term> occurs when code opens a handle and never calls <code>CloseHandle</code>. Each unclosed handle consumes an entry in the handle table and increments the object's <code>HandleCount</code>, preventing the object from being destroyed. Long-running services with handle leaks eventually exhaust the handle table (default limit: 16 million handles per process, but each entry costs kernel memory). Tools to detect leaks:</P>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Tool","How to Use","What It Shows"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["Process Hacker / Task Manager","Handles column in process list","Total handle count — growing count = leak"],
            ["WinDbg !handle","!handle 0 0xf in PID context","All handles, type, object address, access mask"],
            ["App Verifier","Enable 'Handles' check","Breaks into debugger on CloseHandle(invalid)"],
            ["ETW (Event Tracing)","Microsoft-Windows-Kernel-Object provider","Logs handle open/close with stack trace (needs symbols)"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.6 — Handle-Based Attacks</h3>
      <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:12}}>
        {[
          {title:"Handle Theft / Handle Duplication Attack",color:"var(--c-attack)",body:<>The attacker opens a privileged process (e.g., <code>lsass.exe</code>) with <code>PROCESS_DUP_HANDLE</code>, then iterates handles inside that process (using <code>NtQuerySystemInformation(SystemHandleInformation)</code>) looking for a handle with <code>PROCESS_ALL_ACCESS</code> or <code>PROCESS_VM_READ</code>. It duplicates that handle into its own process and reads LSASS memory — all without ever calling <code>OpenProcess(PROCESS_VM_READ, …, lsassPid)</code> which EDR hooks. Used by Mimikatz's <code>sekurlsa::minidump</code> variant and Nanodump.</>},
          {title:"Privileged File Handle Stealing",color:"var(--c-warn)",body:<>Services often hold open file handles with <code>DELETE</code> or <code>WRITE_DAC</code> access on sensitive files (e.g., SAM hive, certificate stores). An attacker who can duplicate that handle gains the same access without needing the ACL permissions themselves.</>},
          {title:"Token Impersonation via Stolen Handle",color:"var(--c-err)",body:<>Windows allows impersonating a token obtained via <code>OpenProcessToken</code> + <code>DuplicateTokenEx</code>. If a low-privilege process can steal a SYSTEM token handle (from a privileged service that left it open), it can call <code>ImpersonateLoggedOnUser</code> or <code>SetThreadToken</code> to assume SYSTEM context — a classic local privilege escalation.</>},
          {title:"Named Object Squatting",color:"var(--c-system)",body:<>Named kernel objects (mutexes, events, sections) in <code>\\BaseNamedObjects</code> are first-come-first-served. If a low-privileged process creates a named mutex before a privileged process does, the privileged process receives the low-privilege object — breaking its security invariants. This is why elevated services use per-session directories (<code>\\Sessions\\N\\BaseNamedObjects</code>) and integrity-level-filtered ACLs on named objects.</>},
        ].map((item,i)=>(
          <div key={i} style={{padding:"14px 16px",borderRadius:10,background:`${item.color}08`,border:`1px solid ${item.color}30`}}>
            <div style={{fontFamily:"var(--font-display)",fontSize:14,fontWeight:700,color:item.color,marginBottom:8}}>{item.title}</div>
            <div style={{fontSize:13,color:"var(--text-1)",lineHeight:1.65}}>{item.body}</div>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.7 — Practical Commands</h3>
      <pre style={{background:"rgba(0,0,0,0.35)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 16px",fontSize:12,lineHeight:1.7,overflowX:"auto",marginTop:10}}><code>{`# List all handles for a process (Process Hacker CLI / NtQuerySystemInformation)
handle.exe -p lsass.exe          # Sysinternals handle.exe
handle64.exe -a -p notepad.exe   # all handle types

# WinDbg — inspect handle table
!process 0 0 lsass.exe   # get EPROCESS
.process /r /p <eprocess>
!handle 0 0xf             # all handles: 0 = all, 0xf = full info

# PowerShell — count handles (cheap leak monitor)
Get-Process | Select-Object Name, HandleCount | Sort-Object HandleCount -Descending | Select -First 20

# ETW handle tracking (requires Admin)
logman start HandleTrace -p "Microsoft-Windows-Kernel-Object" 0xFFFF 5 -ets
# ... reproduce leak ...
logman stop HandleTrace -ets
tracerpt HandleTrace.etl -o handles.xml`}</code></pre>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="Handle'lar — Kernel Ob'ektlariga Murojaat" en="" />
      <P>A <Term>handle</Term> — jarayon kernel ob'ektiga murojaat qilish uchun foydalanadigan noaniq 32-bitli son. Kod <code style={{fontFamily:"var(--font-mono)",fontSize:12,background:"rgba(255,255,255,0.06)",padding:"1px 6px",borderRadius:4}}>CreateFile()</code> chaqirganda, kernel ichki <em>fayl ob'ekti</em> yaratadi, uni jarayonning <em>handle jadvaliga</em> joylashtiradi va foydalanuvchi rejimiga kichik son (4, 8, 12, …) qaytaradi. Siz kernel ob'ektiga to'g'ridan-to'g'ri tegmaysiz — handleni keyingi API chaqiruvlarga (<code>ReadFile</code>, <code>CloseHandle</code> va h.k.) uzatasiz va kernel uni ichkarida ob'ektga moslashtiradi. Bu bilvosita murojaat izolyatsiyani ta'minlaydi (jarayonlar bir-birining ob'ektlariga to'g'ridan-to'g'ri murojaat qila olmaydi), havolalarni sanashni ta'minlaydi (ob'ekt barcha handlelar yopilgunga qadar yashaydi) va xavfsizlikni tekshirishni ta'minlaydi (kirish huquqlari handle ochilganda tekshiriladi, har bir foydalanishda emas).</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.1 — Ob'ekt Menejeri va OBJECT_HEADER</h3>
      <P>Har bir kernel ob'ekti kernel xotirasida <Term>OBJECT_HEADER</Term> tuzilmasi bilan boshlanadi. Ob'ekt Menejeri (ntoskrnl.exe dagi <code>ObXxx</code> routinelari) bu ob'ektlarning yaratilishi, havolalarni sanash va yo'q qilinishini boshqaradi.</P>
      <pre style={{background:"rgba(0,0,0,0.35)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 16px",fontSize:12,lineHeight:1.7,overflowX:"auto",marginTop:10}}><code>{`typedef struct _OBJECT_HEADER {
  LONG_PTR     PointerCount;   // Jami kernel havolalari (handlelar bilan birga)
  LONG_PTR     HandleCount;    // Ochiq handlelar soni (barcha jarayonlarda)
  POBJECT_TYPE Type;           // FILE, PROCESS, THREAD, TOKEN, EVENT… turiga ko'rsatadi
  UCHAR        NameInfoOffset; // Ixtiyoriy: ob'ekt nomi bilan ixtiyoriy sarlavha
  UCHAR        HandleInfoOffset;
  UCHAR        QuotaInfoOffset;
  UCHAR        Flags;
  // Darhol haqiqiy ob'ekt tanasi bilan davom etadi (masalan, _FILE_OBJECT)
} OBJECT_HEADER;`}</code></pre>
      <P>Ob'ekt Menejeri kernelning <em>Ob'ekt Nomlar Fazosida</em> yashaydi — <code>\</code> dan boshlanadigan katalog daraxti. Uni WinObj (Sysinternals) yoki WinDbg da <code>!object \</code> bilan ko'rishingiz mumkin. Keng tarqalgan kataloglar:</P>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Nomlar Fazosi Yo'li","Tarkib"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["\\Device","Jismoniy va virtual qurilma ob'ektlari (masalan, \\Device\\HarddiskVolume3)"],
            ["\\BaseNamedObjects","Nomlangan event, mutex, semafor, section (foydalanuvchi kirishiga ochiq)"],
            ["\\Sessions\\1\\BaseNamedObjects","Har bir seans uchun nomlangan ob'ektlar (seans izolyatsiyasini chetlab o'tishning oldini olish)"],
            ["\\KnownDlls","Oldindan yuklangan DLL section ob'ektlari — tezlashtirish va xavfsizlik"],
            ["\\ObjectTypes","Har bir ob'ekt turi uchun bitta yozuv (File, Process, Thread, Token…)"],
            ["\\Windows","Oyna stantsiyalari va ish stoillari"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.2 — Handle Jadvalining Tuzilishi</h3>
      <P>Har bir jarayonda shaxsiy <Term>handle jadvali</Term> mavjud — kernel boshqaradigan massiv, har bir yozuvda kernel ob'ektiga ko'rsatgich va handle ochilganda berilgan kirish huquqlari saqlanadi. Jadval pageable kernel xotirasida; yozuvlar 4 ga karrali taqsimlanadi (handlelar har doim 4 ga bo'linadi, chunki quyi 2 bit bayroqlar uchun ishlatiladi).</P>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Handle Yozuv Maydoni","Hajmi","Tavsif"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["ObjectPointerBits","60 bit","Kernel ob'ektiga ko'rsatgich >> 4 (quyi bitlar qayta ishlatiladi)"],
            ["GrantedAccessBits","25 bit","OpenProcess / CreateFile vaqtida berilgan kirish niqobi"],
            ["Attributes","3 bit","Meros, ProtectFromClose, yopishda audit bayroqlari"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>
      <Callout color="var(--c-system)" icon="info" titleUz="Kirish huquqlari ochilish vaqtida belgilanadi" titleEn="">
        Agar faylni <code>GENERIC_READ</code> bilan ochsangiz, handle yozuvi aynan shu niqobni saqlaydi. Keyingi <code>ReadFile(handle)</code> chaqiruvlari saqlangan niqobdan foydalanadi — har safar faylning ACL ini qayta tekshirmaydi. Shuning uchun imtiyozlarni ko'tarish ko'pincha keng huquqlar bilan ochilgan handleni o'g'irlashga qaratilgan, ACL ni chetlab o'tish o'rniga.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.3 — Handle Turlari</h3>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12}}>
        {[
          {type:"Fayl / Katalog",api:"CreateFile, NtCreateFile",flags:"GENERIC_READ, GENERIC_WRITE, DELETE, FILE_READ_ATTRIBUTES",note:"Eng keng tarqalgan tur; quvurlar, konsollar, qurilmalarni o'z ichiga oladi"},
          {type:"Jarayon",api:"OpenProcess",flags:"PROCESS_VM_READ, PROCESS_VM_WRITE, PROCESS_CREATE_THREAD, PROCESS_ALL_ACCESS",note:"LSASS da PROCESS_VM_READ = zudlik bilan hisob ma'lumotlarini dumplash"},
          {type:"Thread",api:"OpenThread",flags:"THREAD_SUSPEND_RESUME, THREAD_SET_CONTEXT, THREAD_GET_CONTEXT",note:"Thread in'ektsiyasi uchun ishlatiladi (SetThreadContext)"},
          {type:"Token",api:"OpenProcessToken",flags:"TOKEN_QUERY, TOKEN_IMPERSONATE, TOKEN_DUPLICATE, TOKEN_ADJUST_PRIVILEGES",note:"SYSTEM tokenini takrorlash → taqlid hujumi"},
          {type:"Event / Mutex / Semafor",api:"CreateEvent, CreateMutex",flags:"EVENT_MODIFY_STATE, MUTEX_ALL_ACCESS, SEMAPHORE_MODIFY_STATE",note:"Jarayonlar bo'yicha ko'rinadigan nomlangan ob'ektlar; zararli dasturlar mutexlarni 'allaqachon ishlamoqda' tekshiruvi sifatida ishlatadi"},
          {type:"Registry Kaliti",api:"RegOpenKeyEx, NtOpenKey",flags:"KEY_READ, KEY_WRITE, KEY_ALL_ACCESS",note:"Ochiq kalit handlesi kalit o'chirilgandan keyin ham yopilgunga qadar yashaydi"},
          {type:"Section (Xotira Xaritasi)",api:"CreateFileMapping",flags:"SECTION_MAP_READ, SECTION_MAP_WRITE, SECTION_MAP_EXECUTE",note:"Umumiy xotira asosi; DLL yuklash; reflektiv DLL in'ektsiya"},
          {type:"Job Ob'ekti",api:"CreateJobObject",flags:"JOB_OBJECT_ALL_ACCESS",note:"Jarayonlar guruhini o'z ichiga oladi va cheklaydi — jobdan qochish sandbox chetlab o'tish"},
        ].map((item,i)=>(
          <div key={i} style={{padding:"12px 14px",borderRadius:8,background:"rgba(255,255,255,0.03)",border:"1px solid var(--border)"}}>
            <div style={{fontFamily:"var(--font-mono)",fontSize:12,color:"var(--accent)",fontWeight:700,marginBottom:4}}>{item.type}</div>
            <div style={{fontSize:11,color:"var(--c-warn)",fontFamily:"var(--font-mono)",marginBottom:6}}>API: {item.api}</div>
            <div style={{fontSize:11,color:"var(--text-2)",marginBottom:4}}>Bayroqlar: {item.flags}</div>
            <div style={{fontSize:12,color:"var(--text-1)"}}>{item.note}</div>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.4 — Handle Takrorlash va Meros</h3>
      <P><Term>DuplicateHandle</Term> handleni bir jarayon jadvalidan boshqa jarayon jadvaliga ko'chiradi. Takrorlangan handle bir xil kernel ob'ektiga ishora qiladi; ob'ektning <code>HandleCount</code> i ortadi. Chaqiruvchi manba va maqsad jarayonlarda <code>PROCESS_DUP_HANDLE</code> ga muhtoj.</P>
      <pre style={{background:"rgba(0,0,0,0.35)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 16px",fontSize:12,lineHeight:1.7,overflowX:"auto",marginTop:10}}><code>{`// Boshqa jarayondan handleni o'g'irlash (jabrlanuvchida PROCESS_DUP_HANDLE kerak)
HANDLE hJabrlanuvchi = OpenProcess(PROCESS_DUP_HANDLE, FALSE, jabrlanuvchiPid);
HANDLE hO_girlangan;
DuplicateHandle(
    hJabrlanuvchi,       // manba jarayon
    0x40,                // jabrlanuvchi ichidagi handle qiymati (masalan, ularning LSASS handlesi)
    GetCurrentProcess(), // maqsad jarayon (biz)
    &hO_girlangan,       // bizning jadvalidagi yangi handle qiymati
    0, FALSE,
    DUPLICATE_SAME_ACCESS   // jabrlanuvchi qanday kirish huquqiga ega bo'lsa shuni ko'chirish
);
// hO_girlangan endi jabrlanuvchi handlesi bilan bir xil huquqlarga ega`}</code></pre>
      <P><Term>Merosiy handlelar</Term>: jarayon <code>CreateProcess</code> va <code>bInheritHandles=TRUE</code> bilan yaratilganda, <code>HANDLE_FLAG_INHERIT</code> bilan belgilangan barcha handlelar bir xil kirish huquqlari bilan bolaning jadvaliga takrorlanadi. stdin/stdout/stderr quvurlari shunday ishlaydi — ota endi quvur handlelarini yaratadi, ularni merosiy deb belgilaydi va qiymatlarini <code>STARTUPINFO</code> da uzatadi.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.5 — Handle Sizishi</h3>
      <P><Term>Handle sizishi</Term> kod handle ochsa va hech qachon <code>CloseHandle</code> chaqirmasa yuzaga keladi. Har bir yopilmagan handle jadvalda yozuv iste'mol qiladi va ob'ektning <code>HandleCount</code> ini oshiradi, ob'ektning yo'q qilinishiga to'sqinlik qiladi. Handle sizishlari bo'lgan uzoq muddatli xizmatlar oxir-oqibat handle jadvalini tugataveradi (jarayon uchun standart chegara: 16 million handle, lekin har bir yozuv kernel xotirasini talab qiladi).</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.6 — Handle Asosidagi Hujumlar</h3>
      <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:12}}>
        {[
          {title:"Handle O'g'irlash / Handle Takrorlash Hujumi",color:"var(--c-attack)",body:<>Hujumchi imtiyozli jarayonni (masalan, <code>lsass.exe</code>) <code>PROCESS_DUP_HANDLE</code> bilan ochadi, keyin <code>NtQuerySystemInformation(SystemHandleInformation)</code> yordamida o'sha jarayon ichidagi handlelarni ko'rib chiqadi va <code>PROCESS_ALL_ACCESS</code> yoki <code>PROCESS_VM_READ</code> bilan handleni qidiradi. U shu handleni o'z jarayoniga ko'chiradi va LSASS xotirasini o'qiydi — hech qachon <code>OpenProcess(PROCESS_VM_READ, …, lsassPid)</code> chaqirmasdan, buni EDR ushlab qolishi mumkin edi. Mimikatz ning <code>sekurlsa::minidump</code> varianti va Nanodump tomonidan qo'llaniladi.</>},
          {title:"Imtiyozli Fayl Handleini O'g'irlash",color:"var(--c-warn)",body:<>Xizmatlar ko'pincha maxfiy fayllarda (masalan, SAM hive, sertifikat do'konlari) <code>DELETE</code> yoki <code>WRITE_DAC</code> kirish huquqlari bilan ochiq fayl handlelarini ushlab turadi. Shu handleni takrorlashga muvaffaq bo'lgan hujumchi o'zi ACL ruxsatlarisiz bir xil kirishga ega bo'ladi.</>},
          {title:"Token Taqlidi Yordamida O'g'irlangan Handle",color:"var(--c-err)",body:<><code>OpenProcessToken</code> + <code>DuplicateTokenEx</code> orqali olingan tokenni taqlid qilish mumkin. Agar past imtiyozli jarayon SYSTEM token handleini o'g'irlay olsa (uni ochiq qoldirgan imtiyozli xizmatdan), u SYSTEM kontekstini o'zlashtirish uchun <code>ImpersonateLoggedOnUser</code> yoki <code>SetThreadToken</code> ni chaqira oladi — bu klassik mahalliy imtiyozlarni ko'tarish.</>},
          {title:"Nomlangan Ob'ektni Egallab Olish",color:"var(--c-system)",body:<><code>\\BaseNamedObjects</code> dagi nomlangan kernel ob'ektlari (mutex, event, section) birinchi kelgan birinchi oladi tartibida ishlaydi. Agar past imtiyozli jarayon nomlangan mutexni imtiyozli jarayondan oldin yaratsam, imtiyozli jarayon past imtiyozli ob'ektni oladi — bu uning xavfsizlik invariantlarini buzadi. Shuning uchun yuqori darajali xizmatlar seans bo'yicha kataloglar va nomlangan ob'ektlardagi yaxlitlik darajasi bilan filtrlangan ACL lardan foydalanadi.</>},
        ].map((item,i)=>(
          <div key={i} style={{padding:"14px 16px",borderRadius:10,background:`${item.color}08`,border:`1px solid ${item.color}30`}}>
            <div style={{fontFamily:"var(--font-display)",fontSize:14,fontWeight:700,color:item.color,marginBottom:8}}>{item.title}</div>
            <div style={{fontSize:13,color:"var(--text-1)",lineHeight:1.65}}>{item.body}</div>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.7 — Amaliy Buyruqlar</h3>
      <pre style={{background:"rgba(0,0,0,0.35)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 16px",fontSize:12,lineHeight:1.7,overflowX:"auto",marginTop:10}}><code>{`# Jarayon uchun barcha handlelarni ro'yxatga olish
handle.exe -p lsass.exe          # Sysinternals handle.exe
handle64.exe -a -p notepad.exe   # barcha handle turlari

# WinDbg — handle jadvalini tekshirish
!process 0 0 lsass.exe   # EPROCESS topish
.process /r /p <eprocess>
!handle 0 0xf             # barcha handlelar: 0 = hammasi, 0xf = to'liq ma'lumot

# PowerShell — handlelarni hisoblash (sizish monitori)
Get-Process | Select-Object Name, HandleCount | Sort-Object HandleCount -Descending | Select -First 20

# ETW orqali handle kuzatish (Admin kerak)
logman start HandleTrace -p "Microsoft-Windows-Kernel-Object" 0xFFFF 5 -ets
# ... sizishni takrorlash ...
logman stop HandleTrace -ets
tracerpt HandleTrace.etl -o handles.xml`}</code></pre>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
function SectionServices() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="Windows Services — Background Execution" uz="" />
      <P>A <Term>Windows service</Term> is a long-running executable that operates in the background, started automatically at boot or on demand, without requiring an interactive user session. Services enable core OS functionality — networking, printing, Windows Update, Defender — to run before any user logs in and continue running after they log out. They differ from regular processes in one key way: their lifecycle is managed by the <Em>Service Control Manager (SCM)</Em>, which handles start, stop, pause, and resume operations through a defined protocol.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.1 — Service Control Manager (SCM)</h3>
      <P>The <Term>SCM</Term> runs as <code style={{fontFamily:"var(--font-mono)",fontSize:12,background:"rgba(255,255,255,0.06)",padding:"1px 6px",borderRadius:4}}>services.exe</code> — a Windows-protected process started by <code>wininit.exe</code> during Phase 1 boot. It reads service configuration from <code>HKLM\SYSTEM\CurrentControlSet\Services</code> and starts services in dependency order. Its responsibilities:</P>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["SCM Function","Details"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["Service database","Reads/writes HKLM\\SYSTEM\\CurrentControlSet\\Services for all service config"],
            ["Lifecycle management","Start, stop, pause, resume, restart on failure"],
            ["Dependency resolution","Ensures service A starts before service B if B depends on A"],
            ["Failure actions","Can restart service, run a program, or reboot on crash (configured per service)"],
            ["Security descriptor","The SCM object itself has a DACL controlling who can start/stop/query services"],
            ["Service accounts","Launches services under specified accounts with appropriate privileges"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.2 — Service Types</h3>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12}}>
        {[
          {type:"WIN32_OWN_PROCESS (0x10)",desc:"Service runs as its own dedicated process (e.g., spoolsv.exe for Print Spooler). Crash isolation: one service crash doesn't affect others."},
          {type:"WIN32_SHARE_PROCESS (0x20)",desc:"Service runs as a DLL inside svchost.exe, sharing a process with other services of the same -k group. More efficient but less isolated."},
          {type:"KERNEL_DRIVER (0x01)",desc:"Kernel-mode driver loaded by SCM at boot (Start=0 or 1). Runs in ring 0. Examples: tcpip.sys, ntfs.sys, Defender's WdFilter.sys."},
          {type:"FILE_SYSTEM_DRIVER (0x02)",desc:"Kernel-mode file system driver (NTFS, FAT32 drivers, filter drivers like antivirus). Also ring 0."},
          {type:"INTERACTIVE_PROCESS (0x100)",desc:"Legacy flag (deprecated in Vista+) for services that could display UI on the interactive desktop. Disabled by default — Session 0 isolation prevents it."},
          {type:"USER_OWN_PROCESS (0x50)",desc:"Service runs as a user-mode process under a user account template. New in Windows 10 — lower privilege, per-user isolation."},
        ].map((item,i)=>(
          <div key={i} style={{padding:"12px 14px",borderRadius:8,background:"rgba(255,255,255,0.03)",border:"1px solid var(--border)"}}>
            <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--accent)",fontWeight:700,marginBottom:6}}>{item.type}</div>
            <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.6}}>{item.desc}</div>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.3 — Service Start Types</h3>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Start Type","Value","When Started","Examples"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["Boot","0","Before kernel init completes (loaded by boot loader)","ntfs.sys, disk.sys, partmgr.sys"],
            ["System","1","During kernel initialization (Phase 0)","tcpip.sys, WdFilter.sys (Defender)"],
            ["Automatic","2","After kernel init, during SCM startup (Phase 1+)","Spooler, wuauserv, EventLog"],
            ["Automatic (Delayed)","2 + DelayedAutoStart","After all Automatic services start (~2 min post-login)","Windows Update, Defender (scan)"],
            ["Manual","3","Only when explicitly started by SCM, user, or another service","Bluetooth, Remote Registry"],
            ["Disabled","4","Never started — SCM rejects start requests","Telnet, RemoteAccess (usually)"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--c-warn)":j===1?"var(--c-system)":"var(--text-1)",fontFamily:j<2?"var(--font-mono)":"inherit",fontSize:j<2?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.4 — Service States</h3>
      <P>A service transitions through defined states managed by the SCM. The service reports its state via <code>SetServiceStatus()</code>:</P>
      <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:12}}>
        {[
          {state:"STOPPED (1)",color:"#ff3a5e",desc:"Service is not running. SCM can start it if Start type allows."},
          {state:"START_PENDING (2)",color:"#ff9145",desc:"Service process started but hasn't called SetServiceStatus(RUNNING) yet."},
          {state:"STOP_PENDING (3)",color:"#ff9145",desc:"Service received SERVICE_CONTROL_STOP but hasn't stopped yet."},
          {state:"RUNNING (4)",color:"#00d4ff",desc:"Service is fully operational — can accept control codes."},
          {state:"CONTINUE_PENDING (5)",color:"#ff9145",desc:"Service received CONTINUE after PAUSE but isn't running yet."},
          {state:"PAUSE_PENDING (6)",color:"#ff9145",desc:"Service received PAUSE but hasn't paused yet."},
          {state:"PAUSED (7)",color:"#b48cff",desc:"Service is paused — still loaded but not processing requests."},
        ].map((item,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 12px",borderRadius:6,background:"rgba(255,255,255,0.02)",border:"1px solid var(--border)"}}>
            <span style={{fontFamily:"var(--font-mono)",fontSize:11,color:item.color,minWidth:180,flexShrink:0}}>{item.state}</span>
            <span style={{fontSize:12,color:"var(--text-1)"}}>{item.desc}</span>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.5 — Service Accounts</h3>
      <P>Services run under accounts that determine their privileges and network identity. Choosing the wrong account is a classic source of privilege escalation:</P>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Account","Local Privileges","Network Identity","Risk"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["LocalSystem","SYSTEM — highest possible, owns entire machine","Authenticates as the machine account (DOMAIN\\COMPUTERNAME$)","Highest — compromise = full machine"],
            ["LocalService","Limited subset of User privileges","Authenticates as Anonymous (no network access)","Lower — limited blast radius"],
            ["NetworkService","Limited subset of User privileges","Authenticates as machine account (like LocalSystem)","Medium — can access network resources"],
            ["Virtual Service Account (NT SERVICE\\name)","Minimal — only what service needs","Authenticates as machine account","Recommended — principle of least privilege"],
            ["Managed Service Account (MSA)","Custom-configured","Machine account with automatic password rotation","Best — no password management burden"],
            ["Custom domain account","Configured by admin","Full domain user","Depends on config — often over-privileged"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":j===3?"var(--c-err)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>
      <Callout color="var(--c-err)" icon="warning" titleEn="LocalSystem is the most dangerous service account" titleUz="">
        A service running as LocalSystem has SeDebugPrivilege, SeTcbPrivilege, and can access any object on the machine. If an attacker can execute code in a LocalSystem service (via a bug or misconfiguration), they have full machine compromise. Prefer virtual service accounts or NetworkService.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.6 — svchost.exe and -k Groups</h3>
      <P>Many Windows services are implemented as DLLs and hosted inside <code style={{fontFamily:"var(--font-mono)",fontSize:12,background:"rgba(255,255,255,0.06)",padding:"1px 6px",borderRadius:4}}>svchost.exe</code> (Service Host). The <code>-k</code> parameter specifies which <em>service group</em> that svchost instance hosts. Groups are defined under <code>HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Svchost</code>. A healthy Windows 11 system has 15–25+ svchost.exe instances simultaneously.</P>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["-k Group","Services Hosted","Account"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["-k netsvcs","wuauserv (Windows Update), Themes, Schedule (Task Scheduler), Winmgmt (WMI), BITS","LocalSystem"],
            ["-k LocalService","EventLog, nsi (Network Store Interface), Wcmsvc (WLAN)","LocalService"],
            ["-k LocalServiceNoNetwork","FirewallAPI, BFE (Base Filtering Engine)","LocalService (no network)"],
            ["-k NetworkService","Dnscache (DNS Client), NlaSvc (Network Location Awareness)","NetworkService"],
            ["-k DcomLaunch","PlugPlay, Power, LSM (Local Session Manager) — starts COM servers","LocalSystem"],
            ["-k rpcss","RpcSs (RPC Endpoint Mapper), DcomLaunch (variant)","NetworkService"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.7 — Service Registry Configuration</h3>
      <P>Each service has a subkey under <code>HKLM\SYSTEM\CurrentControlSet\Services\{"{ServiceName}"}</code>:</P>
      <pre style={{background:"rgba(0,0,0,0.35)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 16px",fontSize:12,lineHeight:1.7,overflowX:"auto",marginTop:10}}><code>{`HKLM\\SYSTEM\\CurrentControlSet\\Services\\Spooler
  ImagePath    REG_EXPAND_SZ  %SystemRoot%\\System32\\spoolsv.exe
  DisplayName  REG_SZ         Print Spooler
  Description  REG_SZ         ...
  ObjectName   REG_SZ         LocalSystem        ← service account
  Start        REG_DWORD      0x2                ← Automatic
  Type         REG_DWORD      0x110              ← WIN32_OWN + INTERACTIVE
  ErrorControl REG_DWORD      0x1                ← Normal (log but continue boot)
  DependOnService REG_MULTI_SZ RPCSS\\0SPOOLER\\0  ← must start after these

  Parameters\\
    ServiceDll  REG_EXPAND_SZ  %SystemRoot%\\system32\\spoolsv.exe
    ← for svchost-hosted services: this points to the DLL`}</code></pre>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.8 — Service-Based Attack Techniques</h3>
      <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:12}}>
        {[
          {title:"Service Persistence (New Service)",color:"var(--c-attack)",body:<>An attacker with admin rights creates a new service pointing to their malware: <code>sc create EvilSvc binPath="C:\\evil.exe" start=auto</code>. The service auto-starts on reboot. Detection: new service creation logs Event ID 7045 (System log) and Sysmon Event ID 1. Autoruns highlights unsigned or unusual services.</>},
          {title:"Service Binary Replacement",color:"var(--c-warn)",body:<>If a service's <code>ImagePath</code> points to a writable binary (weak ACL — e.g., <code>Everyone: Write</code> on the EXE), an attacker replaces the binary with their payload. Next service start runs the attacker's code under the service account (often LocalSystem). Detection: file integrity monitoring on service binaries; sc.exe query to compare expected vs actual ImagePath.</>},
          {title:"Unquoted Service Path",color:"var(--c-warn)",body:<>If <code>ImagePath</code> has spaces but isn't quoted (e.g., <code>C:\\Program Files\\My Service\\app.exe</code>), Windows tries <code>C:\\Program.exe</code>, then <code>C:\\Program Files\\My.exe</code> before finding the real binary. If an attacker can write <code>C:\\Program.exe</code>, it runs as the service account. Detection: <code>wmic service get name,pathname</code> — look for unquoted paths with spaces. Seatbelt and PowerSploit's <code>Get-ServiceUnquoted</code> automate this.</>},
          {title:"DLL Search Order Hijacking in Service",color:"var(--c-system)",body:<>Many services load DLLs by name without full path. Windows searches: (1) application directory, (2) system32, (3) system, (4) Windows dir, (5) current directory, (6) PATH directories. If an attacker places a malicious DLL before the legitimate one in the search path, the service loads it. Classic example: services that load <code>wlbsctrl.dll</code> (IKEEXT service) from a user-writable path.</>},
          {title:"Service DACL Manipulation",color:"var(--c-err)",body:<>Each service has a security descriptor (DACL) controlling who can start, stop, query, and modify it. Attackers with write access (<code>SERVICE_CHANGE_CONFIG</code>) can change the <code>ImagePath</code> or <code>ObjectName</code> to redirect the service to a malicious binary or a lower-privilege account. <code>sc sdset ServiceName D:(A;;CCLCSWRPWPDTLOCRRC;;;SY)...</code> modifies the DACL. Accesschk.exe (Sysinternals) audits service DACLs.</>},
        ].map((item,i)=>(
          <div key={i} style={{padding:"14px 16px",borderRadius:10,background:`${item.color}08`,border:`1px solid ${item.color}30`}}>
            <div style={{fontFamily:"var(--font-display)",fontSize:14,fontWeight:700,color:item.color,marginBottom:8}}>{item.title}</div>
            <div style={{fontSize:13,color:"var(--text-1)",lineHeight:1.65}}>{item.body}</div>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.9 — Practical Commands</h3>
      <pre style={{background:"rgba(0,0,0,0.35)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 16px",fontSize:12,lineHeight:1.7,overflowX:"auto",marginTop:10}}><code>{`# List all services and their states
sc query type= all state= all
Get-Service | Select-Object Name, DisplayName, Status, StartType | Sort-Object Status

# Service details (ImagePath, account, dependencies)
sc qc Spooler                          # classic sc.exe
Get-WmiObject Win32_Service | Where {$_.Name -eq "Spooler"} | Format-List *

# Check for unquoted service paths (privesc check)
wmic service get name,pathname | findstr /i /v "c:\\windows\\"

# Service DACL audit
accesschk.exe -uwcqv "Everyone" *      # services writable by Everyone
accesschk.exe -c Spooler              # specific service DACL

# Create / delete a service (Admin required)
sc create TestSvc binPath="C:\\test.exe" start=auto obj=LocalSystem
sc delete TestSvc

# New service creation audit (Event ID 7045)
Get-WinEvent -LogName System | Where {$_.Id -eq 7045} | Select -First 10 | Format-List`}</code></pre>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="Windows Servislar — Fon Rejimida Bajarish" en="" />
      <P>A <Term>Windows servis</Term> — fon rejimida uzoq muddatli ishlaydigan bajariladigan fayl, interaktiv foydalanuvchi seansi talab qilmasdan, yuklash vaqtida yoki talab bo'yicha boshlanadigan. Servislar asosiy OS funksionalligini ta'minlaydi — tarmoq, chop etish, Windows Update, Defender — hech bir foydalanuvchi kirmagan vaqtda ham ishlashi va ular chiqqanidan keyin ham davom etishi uchun. Ular odatiy jarayonlardan bitta asosiy jihatda farq qiladi: ularning hayot tsikli <Em>Service Control Manager (SCM)</Em> tomonidan boshqariladi, u belgilangan protokol orqali ishga tushirish, to'xtatish, to'xtatib turish va davom ettirish operatsiyalarini amalga oshiradi.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.1 — Service Control Manager (SCM)</h3>
      <P><Term>SCM</Term> <code style={{fontFamily:"var(--font-mono)",fontSize:12,background:"rgba(255,255,255,0.06)",padding:"1px 6px",borderRadius:4}}>services.exe</code> sifatida ishlaydi — 1-fazali yuklash paytida <code>wininit.exe</code> tomonidan boshlangan Windows-himoyalangan jarayon. U <code>HKLM\SYSTEM\CurrentControlSet\Services</code> dan servis konfiguratsiyasini o'qiydi va servislarni bog'liqlik tartibida ishga tushiradi.</P>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["SCM Funksiyasi","Tafsilotlar"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["Servis ma'lumotlar bazasi","Barcha servis konfiguratsiyasi uchun HKLM\\SYSTEM\\CurrentControlSet\\Services ni o'qiydi/yozadi"],
            ["Hayot tsikli boshqaruvi","Ishga tushirish, to'xtatish, to'xtatib turish, davom ettirish, muvaffaqiyatsizlikda qayta ishga tushirish"],
            ["Bog'liqlikni hal qilish","Agar B A ga bog'liq bo'lsa, A servis B dan oldin ishga tushishini ta'minlaydi"],
            ["Muvaffaqiyatsizlik harakatlari","Crash da xizmatni qayta ishga tushirish, dastur ishga tushirish yoki qayta yuklab olish mumkin (har bir servis uchun konfiguratsiya qilinadi)"],
            ["Xavfsizlik tavsifi","SCM ob'ektining o'zi kim servislarni ishga tushirishi/to'xtatishi/so'rashi mumkinligini nazorat qiluvchi DACL ga ega"],
            ["Servis akkauntlari","Servislarni tegishli imtiyozlar bilan belgilangan akkauntlar ostida ishga tushiradi"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.2 — Servis Turlari</h3>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12}}>
        {[
          {type:"WIN32_OWN_PROCESS (0x10)",desc:"Servis o'z alohida jarayoni sifatida ishlaydi (masalan, Print Spooler uchun spoolsv.exe). Crash izolyatsiyasi: bir servis crashi boshqalarga ta'sir qilmaydi."},
          {type:"WIN32_SHARE_PROCESS (0x20)",desc:"Servis svchost.exe ichida DLL sifatida ishlaydi, bir xil -k guruhdagi boshqa servislar bilan jarayon baham ko'radi. Samaraliroq, lekin kamroq izolyatsiyalangan."},
          {type:"KERNEL_DRIVER (0x01)",desc:"Yuklash vaqtida SCM tomonidan yuklangan kernel-rejim drayveri (Start=0 yoki 1). Ring 0 da ishlaydi. Misollar: tcpip.sys, ntfs.sys, Defender ning WdFilter.sys."},
          {type:"FILE_SYSTEM_DRIVER (0x02)",desc:"Kernel-rejim fayl tizimi drayveri (NTFS, FAT32 drayverlari, antivirus kabi filtr drayverlari). Ham ring 0."},
          {type:"INTERACTIVE_PROCESS (0x100)",desc:"Eski bayroq (Vista+ da eskirgan) interaktiv ish stolida UI ko'rsatishi mumkin bo'lgan xizmatlar uchun. Standart sifatida o'chirilgan — Seans 0 izolyatsiyasi uni to'xtatadi."},
          {type:"USER_OWN_PROCESS (0x50)",desc:"Servis foydalanuvchi akkaunti shabloni ostida foydalanuvchi-rejim jarayoni sifatida ishlaydi. Windows 10 da yangi — past imtiyoz, foydalanuvchi izolyatsiyasi."},
        ].map((item,i)=>(
          <div key={i} style={{padding:"12px 14px",borderRadius:8,background:"rgba(255,255,255,0.03)",border:"1px solid var(--border)"}}>
            <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--accent)",fontWeight:700,marginBottom:6}}>{item.type}</div>
            <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.6}}>{item.desc}</div>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.3 — Servis Ishga Tushirish Turlari</h3>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Ishga Tushirish Turi","Qiymati","Qachon Boshlanadi","Misollar"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["Boot","0","Kernel init tugashidan oldin (yuklash yuklovchisi tomonidan yuklanadi)","ntfs.sys, disk.sys, partmgr.sys"],
            ["System","1","Kernel initializatsiyasi paytida (0-fazada)","tcpip.sys, WdFilter.sys (Defender)"],
            ["Automatic","2","Kernel init dan keyin, SCM ishga tushishi paytida (1+ fazada)","Spooler, wuauserv, EventLog"],
            ["Automatic (Kechiktirilgan)","2 + DelayedAutoStart","Barcha Automatic servislar ishga tushgandan keyin (~login dan 2 daqiqa keyin)","Windows Update, Defender (skan)"],
            ["Manual","3","Faqat SCM, foydalanuvchi yoki boshqa servis tomonidan aniq boshlanganda","Bluetooth, Remote Registry"],
            ["Disabled","4","Hech qachon boshlanmaydi — SCM ishga tushirish so'rovlarini rad etadi","Telnet, RemoteAccess (odatda)"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--c-warn)":j===1?"var(--c-system)":"var(--text-1)",fontFamily:j<2?"var(--font-mono)":"inherit",fontSize:j<2?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.4 — Servis Holatlari</h3>
      <P>Servis SCM tomonidan boshqariladigan belgilangan holatlar orqali o'tadi. Servis holatini <code>SetServiceStatus()</code> orqali bildiradi:</P>
      <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:12}}>
        {[
          {state:"STOPPED (1)",color:"#ff3a5e",desc:"Servis ishlamayapti. SCM Start turi ruxsat bersa uni ishga tushira oladi."},
          {state:"START_PENDING (2)",color:"#ff9145",desc:"Servis jarayoni boshlandi, lekin hali SetServiceStatus(RUNNING) chaqirmagan."},
          {state:"STOP_PENDING (3)",color:"#ff9145",desc:"Servis SERVICE_CONTROL_STOP oldi, lekin hali to'xtamadi."},
          {state:"RUNNING (4)",color:"#00d4ff",desc:"Servis to'liq ishlayapti — boshqaruv kodlarini qabul qila oladi."},
          {state:"CONTINUE_PENDING (5)",color:"#ff9145",desc:"Servis PAUSE dan keyin CONTINUE oldi, lekin hali ishlamayapti."},
          {state:"PAUSE_PENDING (6)",color:"#ff9145",desc:"Servis PAUSE oldi, lekin hali to'xtatilmagan."},
          {state:"PAUSED (7)",color:"#b48cff",desc:"Servis to'xtatilgan — hali yuklangan, lekin so'rovlarni qayta ishlamayapti."},
        ].map((item,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 12px",borderRadius:6,background:"rgba(255,255,255,0.02)",border:"1px solid var(--border)"}}>
            <span style={{fontFamily:"var(--font-mono)",fontSize:11,color:item.color,minWidth:200,flexShrink:0}}>{item.state}</span>
            <span style={{fontSize:12,color:"var(--text-1)"}}>{item.desc}</span>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.5 — Servis Akkauntlari</h3>
      <P>Servislar imtiyozlari va tarmoq identifikatorini belgilaydigan akkauntlar ostida ishlaydi. Noto'g'ri akkount tanlash imtiyozlarni ko'tarishning klassik manbai:</P>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Akkount","Mahalliy Imtiyozlar","Tarmoq Identifikatori","Xavf"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["LocalSystem","SYSTEM — eng yuqori, butun mashina egasi","Mashina akkaunti sifatida autentifikatsiya qiladi (DOMAIN\\COMPUTERNAME$)","Eng yuqori — buzilish = to'liq mashina"],
            ["LocalService","Foydalanuvchi imtiyozlarining cheklangan to'plami","Anonim sifatida autentifikatsiya qiladi (tarmoq kirishi yo'q)","Past — cheklangan ta'sir radiusi"],
            ["NetworkService","Foydalanuvchi imtiyozlarining cheklangan to'plami","Mashina akkaunti sifatida autentifikatsiya qiladi (LocalSystem kabi)","O'rtacha — tarmoq resurslariga kirish mumkin"],
            ["Virtual Servis Akkaunti (NT SERVICE\\name)","Minimal — faqat servisga keraklisi","Mashina akkaunti sifatida autentifikatsiya qiladi","Tavsiya etiladi — minimal imtiyoz prinsipi"],
            ["Boshqariladigan Servis Akkaunti (MSA)","Admin tomonidan sozlangan","Avtomatik parol rotatsiyasi bilan mashina akkaunti","Eng yaxshi — parol boshqaruvi yukisiz"],
            ["Maxsus domen akkaunti","Admin tomonidan sozlangan","To'liq domen foydalanuvchisi","Konfiguratsiyaga bog'liq — ko'pincha haddan ortiq imtiyozli"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":j===3?"var(--c-err)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>
      <Callout color="var(--c-err)" icon="warning" titleUz="LocalSystem eng xavfli servis akkauntidir" titleEn="">
        LocalSystem ostida ishlaydigan servisda SeDebugPrivilege, SeTcbPrivilege bor va mashina dagi har qanday ob'ektga kira oladi. Agar hujumchi LocalSystem servisda kod bajarsa (xato yoki noto'g'ri konfiguratsiya orqali), butun mashina buzilgan hisoblanadi. Virtual servis akkauntlari yoki NetworkService ni afzal ko'ring.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.6 — svchost.exe va -k Guruhlar</h3>
      <P>Ko'plab Windows servislar DLL sifatida amalga oshirilgan va <code style={{fontFamily:"var(--font-mono)",fontSize:12,background:"rgba(255,255,255,0.06)",padding:"1px 6px",borderRadius:4}}>svchost.exe</code> (Servis Host) ichida joylashtirilgan. <code>-k</code> parametri svchost nusxasi qaysi <em>servis guruhini</em> joylashtirishini belgilaydi. Guruhlar <code>HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Svchost</code> ostida belgilanadi. Sog'lom Windows 11 tizimida bir vaqtda 15–25+ svchost.exe nusxasi bo'ladi.</P>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["-k Guruhi","Joylashtirilgan Servislar","Akkount"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["-k netsvcs","wuauserv (Windows Update), Themes, Schedule (Vazifa Rejalashtiruvchi), Winmgmt (WMI), BITS","LocalSystem"],
            ["-k LocalService","EventLog, nsi (Tarmoq Do'koni Interfeysi), Wcmsvc (WLAN)","LocalService"],
            ["-k LocalServiceNoNetwork","FirewallAPI, BFE (Asosiy Filtr Mexanizmi)","LocalService (tarmoqsiz)"],
            ["-k NetworkService","Dnscache (DNS Mijozi), NlaSvc (Tarmoq Joylashuvi Hushyorligi)","NetworkService"],
            ["-k DcomLaunch","PlugPlay, Power, LSM (Mahalliy Seans Menejeri) — COM serverlarini ishga tushiradi","LocalSystem"],
            ["-k rpcss","RpcSs (RPC Endpoint Mapper), DcomLaunch (varianti)","NetworkService"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.7 — Servis Registry Konfiguratsiyasi</h3>
      <P>Har bir servisda <code>HKLM\SYSTEM\CurrentControlSet\Services\{"{ServisNomi}"}</code> ostida pastki kalit mavjud:</P>
      <pre style={{background:"rgba(0,0,0,0.35)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 16px",fontSize:12,lineHeight:1.7,overflowX:"auto",marginTop:10}}><code>{`HKLM\\SYSTEM\\CurrentControlSet\\Services\\Spooler
  ImagePath    REG_EXPAND_SZ  %SystemRoot%\\System32\\spoolsv.exe
  DisplayName  REG_SZ         Print Spooler
  Description  REG_SZ         ...
  ObjectName   REG_SZ         LocalSystem        ← servis akkaunti
  Start        REG_DWORD      0x2                ← Automatic
  Type         REG_DWORD      0x110              ← WIN32_OWN + INTERACTIVE
  ErrorControl REG_DWORD      0x1                ← Normal (log, lekin yuklashni davom ettir)
  DependOnService REG_MULTI_SZ RPCSS\\0SPOOLER\\0  ← bular ishga tushgandan keyin boshlanishi kerak

  Parameters\\
    ServiceDll  REG_EXPAND_SZ  %SystemRoot%\\system32\\spoolsv.exe
    ← svchost da joylashtirilgan servislar uchun: bu DLL ga ko'rsatadi`}</code></pre>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.8 — Servis Asosidagi Hujum Texnikalari</h3>
      <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:12}}>
        {[
          {title:"Servis Persistenslik (Yangi Servis)",color:"var(--c-attack)",body:<>Admin huquqlariga ega hujumchi o'z zararli dasturiga ishora qiluvchi yangi servis yaratadi: <code>sc create EvilSvc binPath="C:\\evil.exe" start=auto</code>. Servis qayta yuklashda avtomatik boshlanadi. Aniqlash: yangi servis yaratish loglari Event ID 7045 (System log) va Sysmon Event ID 1. Autoruns imzosiz yoki g'ayrioddiy servislarni ajratib ko'rsatadi.</>},
          {title:"Servis Ikkilik Faylini Almashtirish",color:"var(--c-warn)",body:<>Agar servisning <code>ImagePath</code> i yoziladigan ikkilik faylga (zaif ACL — masalan, EXE da <code>Everyone: Write</code>) ishora qilsa, hujumchi ikkilik faylni o'z yuklamasi bilan almashtiradi. Keyingi servis ishga tushishi hujumchi kodini servis akkaunti ostida bajaradi (ko'pincha LocalSystem). Aniqlash: servis ikkilik fayllarida fayl yaxlitlik monitoringi; kutilgan va haqiqiy ImagePath ni taqqoslash uchun sc.exe query.</>},
          {title:"Qo'shtirnoqsiz Servis Yo'li",color:"var(--c-warn)",body:<>Agar <code>ImagePath</code> da bo'shliqlar bo'lsa, lekin qo'shtirnoq yo'q bo'lsa (masalan, <code>C:\\Program Files\\My Service\\app.exe</code>), Windows haqiqiy ikkilik faylni topishdan oldin <code>C:\\Program.exe</code>, keyin <code>C:\\Program Files\\My.exe</code> ni sinab ko'radi. Hujumchi <code>C:\\Program.exe</code> yoza olsa, u servis akkounti sifatida ishlaydi. Aniqlash: <code>wmic service get name,pathname</code> — bo'shliqlar bilan qo'shtirnoqsiz yo'llarni qidiring.</>},
          {title:"Servis DLL Qidiruv Tartibi O'g'irlash",color:"var(--c-system)",body:<>Ko'plab servislar DLL larni to'liq yo'lsiz nom bo'yicha yuklaydi. Windows qidiradi: (1) ilova katalogi, (2) system32, (3) system, (4) Windows kataloği, (5) joriy katalog, (6) PATH kataloglari. Hujumchi qidiruv yo'lida qonuniy DLL dan oldin zararli DLL joylashtirsa, servis uni yuklaydi. Klassik misol: foydalanuvchi yoziladigan yo'ldan <code>wlbsctrl.dll</code> (IKEEXT servisi) yuklaydigan servislar.</>},
          {title:"Servis DACL Manipulyatsiyasi",color:"var(--c-err)",body:<>Har bir servisda uni kim ishga tushirishi, to'xtatishi, so'rashi va o'zgartirishi mumkinligini nazorat qiluvchi xavfsizlik tavsifi (DACL) mavjud. Yozish kirishiga (<code>SERVICE_CHANGE_CONFIG</code>) ega hujumchilar servisni zararli ikkilik faylga yo'naltirish uchun <code>ImagePath</code> yoki <code>ObjectName</code> ni o'zgartira oladi. Accesschk.exe (Sysinternals) servis DACL larini tekshiradi.</>},
        ].map((item,i)=>(
          <div key={i} style={{padding:"14px 16px",borderRadius:10,background:`${item.color}08`,border:`1px solid ${item.color}30`}}>
            <div style={{fontFamily:"var(--font-display)",fontSize:14,fontWeight:700,color:item.color,marginBottom:8}}>{item.title}</div>
            <div style={{fontSize:13,color:"var(--text-1)",lineHeight:1.65}}>{item.body}</div>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.9 — Amaliy Buyruqlar</h3>
      <pre style={{background:"rgba(0,0,0,0.35)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 16px",fontSize:12,lineHeight:1.7,overflowX:"auto",marginTop:10}}><code>{`# Barcha servislar va ularning holatlarini ro'yxatga olish
sc query type= all state= all
Get-Service | Select-Object Name, DisplayName, Status, StartType | Sort-Object Status

# Servis tafsilotlari (ImagePath, akkount, bog'liqliklar)
sc qc Spooler
Get-WmiObject Win32_Service | Where {$_.Name -eq "Spooler"} | Format-List *

# Qo'shtirnoqsiz servis yo'llarini tekshirish (imtiyoz ko'tarish tekshiruvi)
wmic service get name,pathname | findstr /i /v "c:\\windows\\"

# Servis DACL tekshiruvi
accesschk.exe -uwcqv "Everyone" *    # Hammaga yoziladigan servislar
accesschk.exe -c Spooler             # Muayyan servis DACL

# Servis yaratish / o'chirish (Admin kerak)
sc create TestSvc binPath="C:\\test.exe" start=auto obj=LocalSystem
sc delete TestSvc

# Yangi servis yaratish tekshiruvi (Event ID 7045)
Get-WinEvent -LogName System | Where {$_.Id -eq 7045} | Select -First 10 | Format-List`}</code></pre>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
function SectionDLL() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="DLL — Dynamic Link Library" uz="" />
      <P>A <Term>DLL (Dynamic Link Library)</Term> is a PE (Portable Executable) file that contains compiled code, data, and resources that can be loaded into a process's virtual address space and shared simultaneously by many processes. Unlike static linking (where library code is copied into each EXE at compile time), DLLs are mapped once into physical memory and each process sees its own virtual mapping — the code pages are physically shared. This saves RAM, enables code updates without recompiling dependents, and is the foundation of the entire Windows component model.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.1 — PE Format and DLL Structure</h3>
      <P>A DLL is a PE file with the <code style={{fontFamily:"var(--font-mono)",fontSize:12,background:"rgba(255,255,255,0.06)",padding:"1px 6px",borderRadius:4}}>IMAGE_FILE_DLL</code> flag set in the COFF header. Key PE sections relevant to DLLs:</P>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Section / Directory","Purpose","Security Relevance"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            [".text","Executable code","Must be RX (read+execute); W+X = shellcode staging"],
            [".data / .rdata",".data = writable globals; .rdata = read-only constants, string literals","Shellcode sometimes hides in .rdata gaps"],
            ["Export Directory (IMAGE_EXPORT_DIRECTORY)","Lists exported function names, ordinals, and RVAs","DLL hijack target: attacker DLL must re-export all originals"],
            ["Import Directory (IMAGE_IMPORT_DESCRIPTOR)","Lists DLLs and functions this DLL depends on","IAT hooking overwrites entries here after loading"],
            ["Relocation Table (.reloc)","Address fixup table for ASLR rebasing","Missing .reloc = DLL can't be ASLR'd → predictable address"],
            ["TLS Directory","Thread Local Storage callbacks — run before entry point","Malware hides code in TLS callbacks to run before main()"],
            ["Digital Signature (WIN_CERT)","Authenticode signature","Unsigned DLL loaded by signed process = classic attack vector"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.2 — DLL Loading: Implicit vs Explicit</h3>
      <P>There are two ways to use a DLL — the loader handles both, but at different times:</P>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:12}}>
        <div style={{padding:"14px 16px",borderRadius:10,background:"rgba(0,212,255,0.06)",border:"1px solid rgba(0,212,255,0.25)"}}>
          <div style={{fontFamily:"var(--font-display)",fontSize:14,fontWeight:700,color:"var(--c-system)",marginBottom:10}}>IMPLICIT LINKING</div>
          <div style={{fontSize:13,color:"var(--text-1)",lineHeight:1.65}}>
            <p style={{margin:"0 0 8px"}}>Linker records the dependency in the PE import table. The Windows loader (<code>ntdll!LdrLoadDll</code>) maps all imported DLLs automatically before <code>main()</code> runs.</p>
            <p style={{margin:"0 0 8px"}}>Example: <code>#include &lt;windows.h&gt;</code> + linking against <code>kernel32.lib</code> → <code>kernel32.dll</code> auto-loaded.</p>
            <p style={{margin:0,color:"var(--text-2)",fontSize:12}}>Dependency visible in PE Import Directory. If DLL not found → process fails to start.</p>
          </div>
        </div>
        <div style={{padding:"14px 16px",borderRadius:10,background:"rgba(180,100,255,0.06)",border:"1px solid rgba(180,100,255,0.25)"}}>
          <div style={{fontFamily:"var(--font-display)",fontSize:14,fontWeight:700,color:"#b48cff",marginBottom:10}}>EXPLICIT LINKING</div>
          <div style={{fontSize:13,color:"var(--text-1)",lineHeight:1.65}}>
            <p style={{margin:"0 0 8px"}}>Code calls <code>LoadLibrary("name.dll")</code> at runtime to get an <code>HMODULE</code>, then uses <code>GetProcAddress(hMod, "FuncName")</code> to get a function pointer.</p>
            <p style={{margin:"0 0 8px"}}>Load is on-demand; failure is handleable. Used for plugins, optional features, COM servers.</p>
            <p style={{margin:0,color:"var(--text-2)",fontSize:12}}>Not visible in static PE imports — forensic tools must detect runtime loads via API hooking or ETW.</p>
          </div>
        </div>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.3 — DLL Search Order</h3>
      <P>When <code>LoadLibrary("foo.dll")</code> is called without a full path, Windows searches locations in this exact order (assuming <em>SafeDllSearchMode</em> is enabled, which it is by default since XP SP2):</P>
      <div style={{display:"flex",flexDirection:"column",gap:4,marginTop:12}}>
        {[
          {n:"1",loc:"KnownDlls (\\KnownDlls object directory)","note":"ntdll.dll, kernel32.dll, etc. — pre-loaded at boot, immune to hijacking"},
          {n:"2",loc:"Application directory","note":"Directory where the EXE lives — most common hijack target"},
          {n:"3",loc:"System directory (System32)",note:"%SystemRoot%\\System32 — e.g., C:\\Windows\\System32"},
          {n:"4",loc:"Windows directory",note:"%SystemRoot% — e.g., C:\\Windows"},
          {n:"5",loc:"Current working directory","note":"Dangerous if CWD is user-writable (e.g., Desktop, Downloads)"},
          {n:"6",loc:"PATH environment variable","note":"Each directory in %PATH%, left to right"},
        ].map((item,i)=>(
          <div key={i} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"8px 12px",borderRadius:6,background:i<1?"rgba(0,212,255,0.04)":"rgba(255,255,255,0.02)",border:`1px solid ${i<1?"rgba(0,212,255,0.25)":"var(--border)"}`}}>
            <span style={{fontFamily:"var(--font-mono)",fontSize:13,color:"var(--accent)",minWidth:24,flexShrink:0,fontWeight:700}}>#{item.n}</span>
            <div>
              <div style={{fontFamily:"var(--font-mono)",fontSize:12,color:"var(--c-warn)",marginBottom:2}}>{item.loc}</div>
              <div style={{fontSize:12,color:"var(--text-2)"}}>{item.note}</div>
            </div>
          </div>
        ))}
      </div>
      <Callout color="var(--c-warn)" icon="warning" titleEn="DLL hijacking exploits search order steps 2, 5, and 6" titleUz="">
        If a privileged process loads <code>wlbsctrl.dll</code> (IKEEXT service) by name and that DLL doesn't exist in System32, the loader falls through to step 2 (app dir) or step 5 (CWD). If an attacker controls those directories, their malicious DLL is loaded with the service's LocalSystem privileges. Tools: <code>Process Monitor</code> filter on <code>NAME NOT FOUND</code> + <code>CreateFile</code> path — every missing DLL is a potential hijack.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.4 — DllMain and Lifecycle</h3>
      <P>When a DLL is loaded or unloaded, Windows calls its <Term>DllMain</Term> entry point with a reason code:</P>
      <pre style={{background:"rgba(0,0,0,0.35)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 16px",fontSize:12,lineHeight:1.7,overflowX:"auto",marginTop:10}}><code>{`BOOL WINAPI DllMain(HINSTANCE hinstDLL, DWORD fdwReason, LPVOID lpvReserved) {
  switch (fdwReason) {
    case DLL_PROCESS_ATTACH:
      // DLL loaded into process — initialize globals, start threads
      // WARNING: loader lock held — NO LoadLibrary, CreateThread here
      break;
    case DLL_PROCESS_DETACH:
      // DLL being unloaded — free resources
      break;
    case DLL_THREAD_ATTACH:
      // New thread created in this process — allocate TLS
      break;
    case DLL_THREAD_DETACH:
      // Thread exiting — free TLS
      break;
  }
  return TRUE; // FALSE = refuse to load (DLL_PROCESS_ATTACH only)
}`}</code></pre>
      <Callout color="var(--c-err)" icon="warning" titleEn="Loader lock deadlock — DllMain restrictions are critical" titleUz="">
        DllMain is called while the <em>loader lock</em> is held. Any attempt to call <code>LoadLibrary</code>, <code>FreeLibrary</code>, or <code>CreateThread</code> from inside DllMain risks a deadlock. This is a common source of hanging processes during DLL injection — the injected DLL calls <code>LoadLibrary</code> from its DllMain, deadlocking against the loader lock held by the injecting thread.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.5 — KnownDlls and ASLR</h3>
      <P><Term>KnownDlls</Term> is a list of critical system DLLs (ntdll.dll, kernel32.dll, kernelbase.dll, msvcrt.dll, etc.) that are mapped once at boot into a shared section object. Every process that needs them gets the same physical pages — saving memory and preventing search-order hijacking for these DLLs. They are listed under <code>HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\KnownDLLs</code>.</P>
      <P><Term>ASLR (Address Space Layout Randomization)</Term> randomizes the load address of each DLL at boot (system-wide) and at load time (per-process for <code>LoadLibrary</code>). ASLR requires the DLL to have a relocation table (<code>.reloc</code> section). A DLL compiled without <code>/DYNAMICBASE</code> always loads at its preferred base address — a predictable gadget source for ROP chains. Check with: <code>dumpbin /headers foo.dll | findstr DLL_CHARACTERISTICS</code>.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.6 — DLL Injection Techniques</h3>
      <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:12}}>
        {[
          {title:"Classic DLL Injection (LoadLibrary + CreateRemoteThread)",color:"var(--c-attack)",body:<>The most common technique: (1) <code>OpenProcess(PROCESS_VM_WRITE|PROCESS_CREATE_THREAD, …, targetPid)</code>, (2) <code>VirtualAllocEx</code> in target to write DLL path string, (3) <code>CreateRemoteThread(target, LoadLibraryA, dllPathAddr)</code>. The target process's thread calls <code>LoadLibraryA</code> with the attacker's DLL path. Detected by Sysmon Event 8 (CreateRemoteThread) and Event 7 (ImageLoad with non-system path).</>},
          {title:"Reflective DLL Injection",color:"var(--c-err)",body:<>No DLL path written to disk — the entire DLL is written as a blob into target memory, then a custom loader function within the blob resolves imports and relocations in-memory. Used by Metasploit's <code>meterpreter</code>. Detection: memory regions with RWX permissions containing a PE header at unexpected offsets; no corresponding module entry in the process PEB module list (<code>PEB.Ldr</code>). Tools: Process Hacker "Find DLLs" shows unlisted PE headers in memory.</>},
          {title:"AppInit_DLLs",color:"var(--c-warn)",body:<>Registry key <code>HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Windows\AppInit_DLLs</code> lists DLLs that <code>user32.dll</code> loads into every process that imports user32. Disabled by Secure Boot (requires signature). Classic malware persistence — e.g., old banking trojans. Detection: Autoruns "AppInit" tab; Event ID 11 (Registry modification to AppInit_DLLs path).</>},
          {title:"COM Hijacking via DLL",color:"var(--c-system)",body:<>COM objects resolved via CLSID registry keys. <code>HKCU\Software\Classes\CLSID\{"{…}"}\InprocServer32</code> takes precedence over HKLM. A user-writable CLSID registration pointing to an attacker DLL causes it to load into any process that instantiates that COM object. Used by APTs for user-level persistence without admin rights. Detection: Autoruns "COM" tab; SysinternalsSuite's <code>sigcheck -a</code> on registered COM DLLs.</>},
        ].map((item,i)=>(
          <div key={i} style={{padding:"14px 16px",borderRadius:10,background:`${item.color}08`,border:`1px solid ${item.color}30`}}>
            <div style={{fontFamily:"var(--font-display)",fontSize:14,fontWeight:700,color:item.color,marginBottom:8}}>{item.title}</div>
            <div style={{fontSize:13,color:"var(--text-1)",lineHeight:1.65}}>{item.body}</div>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.7 — Export Forwarding and Proxy DLLs</h3>
      <P>A DLL can <em>forward</em> an export to another DLL. In the export directory, instead of an RVA to code, the entry contains a string like <code>"NTDLL.RtlAllocateHeap"</code> — the loader redirects the call. This is used legitimately (kernel32 forwards many functions to kernelbase), and maliciously: a <Term>proxy DLL</Term> exports all the same functions as the legitimate DLL (forwarding to the real one), plus runs attacker code in DllMain or in wrapped functions. Creating one requires matching the export table exactly — tools: <code>AheadLib</code>, <code>SharpDllProxy</code>.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.8 — Practical Commands</h3>
      <pre style={{background:"rgba(0,0,0,0.35)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 16px",fontSize:12,lineHeight:1.7,overflowX:"auto",marginTop:10}}><code>{`# View DLL exports
dumpbin /exports C:\\Windows\\System32\\kernel32.dll
# View DLL imports (dependencies)
dumpbin /imports myapp.exe

# Check ASLR / DEP flags
dumpbin /headers foo.dll | findstr /i "dll characteristics"
# 0x0040 = ASLR, 0x0100 = NX (DEP), 0x4000 = CFG

# List DLLs loaded in a running process
listdlls.exe -v notepad.exe     # Sysinternals
Get-Process notepad | Select -ExpandProperty Modules | Select FileName

# Find hijackable DLL loads (Process Monitor)
# Filter: Operation = CreateFile, Result = NAME NOT FOUND, Path ends in .dll

# Verify DLL signatures
sigcheck.exe -a C:\\Windows\\System32\\kernel32.dll

# WinDbg — list loaded modules
lm                    # all modules with addresses
!lmi kernel32         # detailed module info
x kernel32!*Create*   # exports matching pattern`}</code></pre>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="DLL — Dinamik Bog'lanadigan Kutubxona" en="" />
      <P><Term>DLL (Dynamic Link Library)</Term> — virtual manzil fazosiga yuklanishi va bir vaqtda ko'p jarayonlar tomonidan baham ko'rilishi mumkin bo'lgan compiled kod, ma'lumotlar va resurslarni o'z ichiga olgan PE fayl. Statik bog'lashdan farqli (kutubxona kodi kompilyatsiya vaqtida har bir EXE ga ko'chiriladi), DLL lar jismoniy xotiraga bir marta mapplanadi va har bir jarayon o'zining virtual mappingini ko'radi — kod sahifalari jismoniy jihatdan umumiy bo'ladi. Bu RAM ni tejaydi, dependentlarni qayta kompilyatsiya qilmasdan kod yangilashni ta'minlaydi va butun Windows komponent modelining asosini tashkil etadi.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.1 — PE Formati va DLL Tuzilishi</h3>
      <P>DLL — COFF sarlavhasida <code style={{fontFamily:"var(--font-mono)",fontSize:12,background:"rgba(255,255,255,0.06)",padding:"1px 6px",borderRadius:4}}>IMAGE_FILE_DLL</code> bayroği o'rnatilgan PE fayl. DLL lar uchun muhim PE bo'limlari:</P>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Bo'lim / Katalog","Maqsad","Xavfsizlik Ahamiyati"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            [".text","Bajariladigan kod","RX (o'qish+bajarish) bo'lishi kerak; W+X = shellcode joylashtirish"],
            [".data / .rdata",".data = yoziladigan globallar; .rdata = faqat o'qiladigan konstantalar","Shellcode ba'zan .rdata bo'shliqlarida yashirinadi"],
            ["Export Katalogi (IMAGE_EXPORT_DIRECTORY)","Eksport qilingan funksiya nomlari, ordinallar va RVA larni ro'yxatga oladi","DLL hijack maqsadi: hujumchi DLL barcha originallarni qayta eksport qilishi kerak"],
            ["Import Katalogi (IMAGE_IMPORT_DESCRIPTOR)","Ushbu DLL bog'liq bo'lgan DLL lar va funksiyalarni ro'yxatga oladi","IAT hooking yuklanganidan keyin bu yerda yozuvlarni qayta yozadi"],
            ["Relokatsiya Jadvali (.reloc)","ASLR qayta bazalash uchun manzil tuzatish jadvali","Yo'q .reloc = DLL ASLR bo'lolmaydi → taxmin qilinadigan manzil"],
            ["TLS Katalogi","Thread Local Storage callbacklari — kirish nuqtasidan oldin ishlaydi","Zararli dasturlar main() dan oldin kodni ishlatish uchun TLS callbacklarida yashirinadi"],
            ["Raqamli Imzo (WIN_CERT)","Authenticode imzosi","Imzosiz DLL → imzolangan jarayon tomonidan yuklanadi = klassik hujum vektori"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.2 — DLL Yuklash: Implicit va Explicit</h3>
      <P>DLL dan foydalanishning ikki yo'li bor — loader ikkalasini ham, lekin turli vaqtlarda boshqaradi:</P>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:12}}>
        <div style={{padding:"14px 16px",borderRadius:10,background:"rgba(0,212,255,0.06)",border:"1px solid rgba(0,212,255,0.25)"}}>
          <div style={{fontFamily:"var(--font-display)",fontSize:14,fontWeight:700,color:"var(--c-system)",marginBottom:10}}>IMPLICIT BOG'LASH</div>
          <div style={{fontSize:13,color:"var(--text-1)",lineHeight:1.65}}>
            <p style={{margin:"0 0 8px"}}>Linker bog'liqlikni PE import jadvalida qayd etadi. Windows loader (<code>ntdll!LdrLoadDll</code>) barcha import qilingan DLL larni <code>main()</code> ishga tushishidan oldin avtomatik mapplaydi.</p>
            <p style={{margin:"0 0 8px"}}>Misol: <code>#include &lt;windows.h&gt;</code> + <code>kernel32.lib</code> ga bog'lash → <code>kernel32.dll</code> avtomatik yuklanadi.</p>
            <p style={{margin:0,color:"var(--text-2)",fontSize:12}}>PE Import Katalogida ko'rinadi. DLL topilmasa → jarayon ishga tushishdan muvaffaqiyatsiz bo'ladi.</p>
          </div>
        </div>
        <div style={{padding:"14px 16px",borderRadius:10,background:"rgba(180,100,255,0.06)",border:"1px solid rgba(180,100,255,0.25)"}}>
          <div style={{fontFamily:"var(--font-display)",fontSize:14,fontWeight:700,color:"#b48cff",marginBottom:10}}>EXPLICIT BOG'LASH</div>
          <div style={{fontSize:13,color:"var(--text-1)",lineHeight:1.65}}>
            <p style={{margin:"0 0 8px"}}>Kod ishga tushish vaqtida <code>HMODULE</code> olish uchun <code>LoadLibrary("name.dll")</code> ni chaqiradi, keyin funksiya ko'rsatkichini olish uchun <code>GetProcAddress(hMod, "FuncName")</code> ishlatadi.</p>
            <p style={{margin:"0 0 8px"}}>Yuklash talab bo'yicha; muvaffaqiyatsizlik qayta ishlanishi mumkin. Plaginlar, ixtiyoriy xususiyatlar, COM serverlar uchun ishlatiladi.</p>
            <p style={{margin:0,color:"var(--text-2)",fontSize:12}}>Statik PE importlarida ko'rinmaydi — sudyalik vositalari API hooking yoki ETW orqali ish vaqtidagi yuklashni aniqlashi kerak.</p>
          </div>
        </div>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.3 — DLL Qidiruv Tartibi</h3>
      <P>To'liq yo'lsiz <code>LoadLibrary("foo.dll")</code> chaqirilganda Windows quyidagi tartibda (<em>SafeDllSearchMode</em> yoqilgan holda, bu XP SP2 dan beri standart) joylashuvlarni qidiradi:</P>
      <div style={{display:"flex",flexDirection:"column",gap:4,marginTop:12}}>
        {[
          {n:"1",loc:"KnownDlls (\\KnownDlls ob'ekt katalogi)","note":"ntdll.dll, kernel32.dll va h.k. — yuklash vaqtida oldindan yuklanadi, hijackingdan himoyalangan"},
          {n:"2",loc:"Ilova katalogi","note":"EXE turgan katalog — eng keng tarqalgan hijack maqsadi"},
          {n:"3",loc:"Tizim katalogi (System32)","note":"%SystemRoot%\\System32 — masalan, C:\\Windows\\System32"},
          {n:"4",loc:"Windows katalogi","note":"%SystemRoot% — masalan, C:\\Windows"},
          {n:"5",loc:"Joriy ishchi katalog","note":"CWD foydalanuvchi yoziladigan bo'lsa xavfli (masalan, Desktop, Downloads)"},
          {n:"6",loc:"PATH muhit o'zgaruvchisi","note":"%PATH% dagi har bir katalog, chapdan o'ngga"},
        ].map((item,i)=>(
          <div key={i} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"8px 12px",borderRadius:6,background:i<1?"rgba(0,212,255,0.04)":"rgba(255,255,255,0.02)",border:`1px solid ${i<1?"rgba(0,212,255,0.25)":"var(--border)"}`}}>
            <span style={{fontFamily:"var(--font-mono)",fontSize:13,color:"var(--accent)",minWidth:24,flexShrink:0,fontWeight:700}}>#{item.n}</span>
            <div>
              <div style={{fontFamily:"var(--font-mono)",fontSize:12,color:"var(--c-warn)",marginBottom:2}}>{item.loc}</div>
              <div style={{fontSize:12,color:"var(--text-2)"}}>{item.note}</div>
            </div>
          </div>
        ))}
      </div>
      <Callout color="var(--c-warn)" icon="warning" titleUz="DLL hijacking qidiruv tartibi 2, 5 va 6 bosqichlarini ekspluatatsiya qiladi" titleEn="">
        Imtiyozli jarayon <code>wlbsctrl.dll</code> ni (IKEEXT servisi) nom bo'yicha yuklasa va bu DLL System32 da mavjud bo'lmasa, loader 2-bosqichga (ilova katalogi) yoki 5-bosqichga (CWD) tushadi. Hujumchi bu kataloglarni nazorat qilsa, uning zararli DLL i servisning LocalSystem imtiyozlari bilan yuklanadi. Vositalar: <code>Process Monitor</code> — <code>NAME NOT FOUND</code> + <code>CreateFile</code> yo'li filtri — har bir yo'q DLL potensial hijack.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.4 — DllMain va Hayot Tsikli</h3>
      <P>DLL yuklanganida yoki tushurilganda Windows uning <Term>DllMain</Term> kirish nuqtasini sabab kodi bilan chaqiradi:</P>
      <pre style={{background:"rgba(0,0,0,0.35)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 16px",fontSize:12,lineHeight:1.7,overflowX:"auto",marginTop:10}}><code>{`BOOL WINAPI DllMain(HINSTANCE hinstDLL, DWORD fdwReason, LPVOID lpvReserved) {
  switch (fdwReason) {
    case DLL_PROCESS_ATTACH:
      // DLL jarayonga yuklandi — globallarni ishga tushirish, threadlar boshlash
      // OGOHLANTIRISH: loader lock ushlab turilgan — bu yerda LoadLibrary, CreateThread YO'Q
      break;
    case DLL_PROCESS_DETACH:
      // DLL tushirilmoqda — resurslarni bo'shatish
      break;
    case DLL_THREAD_ATTACH:
      // Bu jarayonda yangi thread yaratildi — TLS ajratish
      break;
    case DLL_THREAD_DETACH:
      // Thread chiqmoqda — TLS ni bo'shatish
      break;
  }
  return TRUE; // FALSE = yuklashni rad etish (faqat DLL_PROCESS_ATTACH)
}`}</code></pre>
      <Callout color="var(--c-err)" icon="warning" titleUz="Loader lock deadlock — DllMain cheklovlari muhim" titleEn="">
        DllMain <em>loader lock</em> ushlab turilganda chaqiriladi. DllMain ichidan <code>LoadLibrary</code>, <code>FreeLibrary</code> yoki <code>CreateThread</code> chaqirishga har qanday urinish deadlock xavfini tug'diradi. Bu DLL in'ektsiyasi paytida jarayonning osilib qolishining keng tarqalgan sababi — in'ektsiya qilingan DLL o'zining DllMain dan <code>LoadLibrary</code> chaqiradi, in'ektsiyalovchi thread ushlab turgan loader lock ga qarshi deadlock hosil qiladi.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.5 — KnownDlls va ASLR</h3>
      <P><Term>KnownDlls</Term> — har yuklash vaqtida umumiy section ob'ektiga bir marta mapplanadigan muhim tizim DLL lari ro'yxati (ntdll.dll, kernel32.dll, kernelbase.dll, msvcrt.dll va h.k.). Ularni talab qiladigan har bir jarayon bir xil jismoniy sahifalarni oladi — xotirani tejaydi va bu DLL lar uchun qidiruv tartibi hijackingini oldini oladi. Ular <code>HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\KnownDLLs</code> ostida ro'yxatga olingan.</P>
      <P><Term>ASLR (Manzil Fazosi Tartibini Tasodifiylash)</Term> yuklash vaqtida har bir DLL ning yuklash manzilini tasodifiylashtiradi. ASLR DLL ning relokatsiya jadvaliga (<code>.reloc</code> bo'limi) ega bo'lishini talab qiladi. <code>/DYNAMICBASE</code> siz kompilyatsiya qilingan DLL har doim o'zining afzal ko'rilgan asosiy manzilida yuklanadi — ROP zanjirlari uchun taxmin qilinadigan gadget manbai.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.6 — DLL In'ektsiya Texnikalari</h3>
      <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:12}}>
        {[
          {title:"Klassik DLL In'ektsiya (LoadLibrary + CreateRemoteThread)",color:"var(--c-attack)",body:<>Eng keng tarqalgan texnika: (1) <code>OpenProcess(PROCESS_VM_WRITE|PROCESS_CREATE_THREAD, …, maqsadPid)</code>, (2) DLL yo'l satrini yozish uchun maqsadda <code>VirtualAllocEx</code>, (3) <code>CreateRemoteThread(maqsad, LoadLibraryA, dllYoliManzili)</code>. Maqsad jarayonning threadi hujumchi DLL yo'li bilan <code>LoadLibraryA</code> ni chaqiradi. Sysmon Event 8 (CreateRemoteThread) va Event 7 (tizim bo'lmagan yo'l bilan ImageLoad) tomonidan aniqlanadi.</>},
          {title:"Reflektiv DLL In'ektsiya",color:"var(--c-err)",body:<>Diskka DLL yo'li yozilmaydi — butun DLL maqsad xotiraga blob sifatida yoziladi, keyin blob ichidagi maxsus loader funksiyasi importlarni va relokatsiyalarni xotirada hal qiladi. Metasploit ning <code>meterpreter</code> i tomonidan qo'llaniladi. Aniqlash: kutilmagan offsetlarda PE sarlavhasini o'z ichiga olgan RWX ruxsatlari bo'lgan xotira mintaqalari; jarayon PEB modul ro'yxatida (<code>PEB.Ldr</code>) mos modul yozuvi yo'q.</>},
          {title:"AppInit_DLLs",color:"var(--c-warn)",body:<>Registry kaliti <code>HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Windows\AppInit_DLLs</code> — <code>user32.dll</code> user32 import qiladigan har bir jarayonga yuklaydigan DLL lar ro'yxati. Secure Boot tomonidan o'chirilgan (imzo talab qiladi). Klassik zararli dastur persistenslik. Aniqlash: Autoruns "AppInit" yorlig'i.</>},
          {title:"COM Hijacking DLL orqali",color:"var(--c-system)",body:<>COM ob'ektlari CLSID registry kalitlari orqali hal qilinadi. <code>HKCU\Software\Classes\CLSID\{"{…}"}\InprocServer32</code> HKLM dan ustun turadi. Hujumchi DLL ga ishora qiluvchi foydalanuvchi yoziladigan CLSID ro'yxatdan o'tkazish, ushbu COM ob'ektini yaratadigan har qanday jarayonga yuklanishiga sabab bo'ladi. APT lar tomonidan admin huquqlarisiz foydalanuvchi darajasidagi persistenslik uchun qo'llaniladi.</>},
        ].map((item,i)=>(
          <div key={i} style={{padding:"14px 16px",borderRadius:10,background:`${item.color}08`,border:`1px solid ${item.color}30`}}>
            <div style={{fontFamily:"var(--font-display)",fontSize:14,fontWeight:700,color:item.color,marginBottom:8}}>{item.title}</div>
            <div style={{fontSize:13,color:"var(--text-1)",lineHeight:1.65}}>{item.body}</div>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.7 — Eksport Yo'naltirish va Proksi DLL lar</h3>
      <P>DLL eksportni boshqa DLL ga <em>yo'naltirishi</em> mumkin. Eksport katalogida, kod uchun RVA o'rniga, yozuv <code>"NTDLL.RtlAllocateHeap"</code> kabi satrni o'z ichiga oladi — loader chaqiruvni yo'naltiradi. Bu qonuniy holda ishlatiladi (kernel32 ko'p funksiyalarni kernelbase ga yo'naltiradi) va zararli holda: <Term>proksi DLL</Term> qonuniy DLL bilan bir xil barcha funksiyalarni eksport qiladi (haqiqiysiga yo'naltirib), va DllMain da yoki o'ralgan funksiyalarda hujumchi kodini ishlatadi.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.8 — Amaliy Buyruqlar</h3>
      <pre style={{background:"rgba(0,0,0,0.35)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 16px",fontSize:12,lineHeight:1.7,overflowX:"auto",marginTop:10}}><code>{`# DLL eksportlarini ko'rish
dumpbin /exports C:\\Windows\\System32\\kernel32.dll
# DLL importlarini ko'rish (bog'liqliklar)
dumpbin /imports myapp.exe

# ASLR / DEP bayroqlarini tekshirish
dumpbin /headers foo.dll | findstr /i "dll characteristics"
# 0x0040 = ASLR, 0x0100 = NX (DEP), 0x4000 = CFG

# Ishlaydigan jarayonda yuklangan DLL larni ro'yxatga olish
listdlls.exe -v notepad.exe     # Sysinternals
Get-Process notepad | Select -ExpandProperty Modules | Select FileName

# Hijack qilinadigan DLL yuklashlarini topish (Process Monitor)
# Filtr: Operation = CreateFile, Result = NAME NOT FOUND, Path .dll bilan tugaydi

# DLL imzolarini tekshirish
sigcheck.exe -a C:\\Windows\\System32\\kernel32.dll

# WinDbg — yuklangan modullarni ro'yxatga olish
lm                    # manzillar bilan barcha modullar
!lmi kernel32         # batafsil modul ma'lumoti
x kernel32!*Create*   # naqshga mos eksportlar`}</code></pre>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
function SectionWindowsAPI() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="Windows API — The Interface to the OS" uz="" />
      <P>The <Term>Windows API</Term> (also called Win32 API) is the set of C-callable functions that give user-mode applications access to OS services: creating processes, reading files, managing memory, drawing to the screen, accessing the network. It is organized into a layered stack — each layer adds abstraction and security checks on top of the one below. Understanding this stack is fundamental to both offensive and defensive security, because every attack technique and every detection method ultimately operates at one of these layers.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.1 — The API Layered Stack</h3>
      <div style={{display:"flex",flexDirection:"column",gap:0,marginTop:14}}>
        {[
          {label:"Application",sub:"Your code: WriteFile(), CreateProcess(), RegOpenKeyEx()",color:"#b48cff",mode:"User mode"},
          {label:"Win32 Subsystem DLLs",sub:"kernel32.dll, advapi32.dll, user32.dll, gdi32.dll — thin wrappers, parameter validation, error translation",color:"#00d4ff",mode:"User mode"},
          {label:"Windows Subsystem DLL",sub:"kernelbase.dll — bulk of Win32 implementation since Win7",color:"#00d4ff",mode:"User mode"},
          {label:"Native API (ntdll.dll)",sub:"NtCreateFile, NtOpenProcess, NtAllocateVirtualMemory — undocumented Nt/Zw functions; contains the syscall stub",color:"#ff9145",mode:"User mode"},
          {label:"SYSCALL instruction",sub:"Transitions CPU from Ring 3 → Ring 0; kernel validates call number (SSN) and dispatches",color:"#ff3a5e",mode:"RING 0 BOUNDARY"},
          {label:"System Service Dispatch (SSDT)",sub:"nt!KiSystemCall64 → SSDT lookup → actual kernel function (NtCreateFile in ntoskrnl)",color:"#ff9145",mode:"Kernel mode"},
          {label:"Executive + HAL",sub:"I/O Manager, Memory Manager, Object Manager, Security Reference Monitor, HAL",color:"#b48cff",mode:"Kernel mode"},
        ].map((item,i)=>(
          <div key={i} style={{display:"flex",alignItems:"stretch",gap:0}}>
            <div style={{width:3,flexShrink:0,background:item.color,opacity:0.6}}/>
            <div style={{flex:1,padding:"10px 14px",borderBottom:"1px solid var(--border)",background:i===4?"rgba(255,58,94,0.07)":"transparent"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",gap:8}}>
                <span style={{fontFamily:"var(--font-display)",fontSize:14,fontWeight:700,color:item.color}}>{item.label}</span>
                <span style={{fontFamily:"var(--font-mono)",fontSize:10,color:i<4?"var(--c-system)":"var(--c-err)",flexShrink:0}}>{item.mode}</span>
              </div>
              <div style={{fontSize:12,color:"var(--text-2)",marginTop:3}}>{item.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.2 — Key DLLs and Their Responsibilities</h3>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["DLL","Key Functions","Notes"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["ntdll.dll","NtCreateFile, NtOpenProcess, NtAllocateVirtualMemory, LdrLoadDll, RtlAllocateHeap","The only DLL loaded by the kernel directly; contains syscall stubs and heap manager; every process has it"],
            ["kernel32.dll","CreateFile, CreateProcess, VirtualAlloc, ReadFile, GetProcAddress, LoadLibrary","Core Win32 API; most functions forward to kernelbase.dll since Win7"],
            ["kernelbase.dll","Actual implementation of most kernel32 functions since Windows 7","Separating kernel32/kernelbase allows MinWin (minimal install) subsystems"],
            ["advapi32.dll","RegOpenKeyEx, OpenProcessToken, AdjustTokenPrivileges, CreateService, LookupPrivilegeValue","Security/registry API; forwards many functions to sechost.dll"],
            ["user32.dll","CreateWindow, SendMessage, GetMessage, SetWindowsHookEx","GUI subsystem; loads win32k.sys (kernel-mode GUI driver) on first call"],
            ["gdi32.dll","CreateCompatibleDC, BitBlt, TextOut, CreatePen","Graphics Device Interface; calls win32kbase.sys in kernel"],
            ["ws2_32.dll","socket, connect, send, recv, WSAStartup","Winsock 2 API; actual implementation in mswsock.dll"],
            ["sechost.dll","OpenSCManager, CreateService, StartService, QueryServiceStatus","Service Control API; formerly in advapi32"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.3 — Syscall Mechanics (x64)</h3>
      <P>On x64 Windows, every Win32 API call that needs kernel services eventually hits the <Term>syscall stub</Term> in ntdll. The stub assigns a <Em>System Service Number (SSN)</Em> and executes the <code>SYSCALL</code> instruction:</P>
      <pre style={{background:"rgba(0,0,0,0.35)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 16px",fontSize:12,lineHeight:1.7,overflowX:"auto",marginTop:10}}><code>{`; ntdll!NtCreateFile syscall stub (Windows 11 x64)
NtCreateFile:
    mov  r10, rcx          ; save rcx (1st param) in r10 per ABI
    mov  eax, 55h          ; SSN = 0x55 for NtCreateFile on this build
    test byte ptr [SharedUserData+0x308], 1  ; check for Syscall Filtering (KPTI)
    jnz  short KiFastSystemCall2
    syscall                ; SYSCALL: save RIP→RCX, RSP→R11, load LSTAR into RIP
    ret                    ; return to caller

; In the kernel (ring 0):
; nt!KiSystemCall64 → reads eax (SSN) → looks up SSDT[SSN] → calls actual function`}</code></pre>
      <P>The <Term>SSDT (System Service Descriptor Table)</Term> is a kernel array where each index maps an SSN to the corresponding kernel function. EDR kernel drivers hook the SSDT (or use callbacks) to intercept and inspect syscalls. Direct syscall attacks (bypassing ntdll stubs entirely) execute the <code>SYSCALL</code> instruction from user-mode shellcode with the hardcoded SSN to avoid userland hooks.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.4 — Calling Convention (x64 fastcall)</h3>
      <P>All Windows x64 API functions use the <Term>Microsoft x64 calling convention</Term>:</P>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Register / Area","Role"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["RCX","1st integer/pointer argument"],
            ["RDX","2nd integer/pointer argument"],
            ["R8","3rd integer/pointer argument"],
            ["R9","4th integer/pointer argument"],
            ["Stack (RSP+0x20 and above)","5th+ arguments AND 32-byte 'shadow space' reserved for callee to spill RCX–R9"],
            ["RAX","Return value (integer/pointer)"],
            ["XMM0–XMM3","Floating-point arguments (1st–4th)"],
            ["RBX, RBP, RDI, RSI, R12–R15","Non-volatile — callee must preserve across call"],
            ["RAX, RCX, RDX, R8–R11, XMM0–5","Volatile — callee may destroy"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--c-warn)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.5 — API Hooking Techniques</h3>
      <P><Term>API hooking</Term> means intercepting a function call to inspect or modify arguments, return values, or behavior. Used legitimately by EDRs (to detect malicious calls) and maliciously (to hide, steal, or redirect):</P>
      <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:12}}>
        {[
          {title:"IAT Hooking (Import Address Table)",color:"var(--c-system)",body:<>The IAT holds pointers to imported functions. After DLL loading, these point to the real functions. IAT hooking overwrites an entry (e.g., <code>CreateProcess</code>) with a pointer to the hook function. Easy to implement (writable memory), easy to detect (compare IAT entries against actual DLL addresses). Used by old-school antivirus and simple sandbox detectors.</>},
          {title:"Inline Hooking (Trampoline)",color:"var(--c-warn)",body:<>Overwrite the first 5–14 bytes of the target function with a <code>JMP hook_function</code> instruction. The hook saves original bytes, executes them in a "trampoline" buffer, then returns to the function body. Used by modern EDRs (CrowdStrike, Defender ATP) to hook ntdll functions. Bypassed by: (1) re-reading the hook and patching it back, (2) syscall direct execution bypassing ntdll entirely, (3) loading a fresh ntdll copy from disk (ntdll unhooking via <code>NtCreateSection</code> + <code>NtMapViewOfSection</code>).</>},
          {title:"SSDT Hooking (Kernel-mode)",color:"var(--c-attack)",body:<>Early AV/HIPS patched SSDT entries to redirect kernel functions to their own inspection code. Microsoft blocked this in x64 Windows with <em>Kernel Patch Protection (PatchGuard)</em> — BSOD on SSDT modification. Modern kernel EDRs instead use documented kernel callbacks (<code>PsSetCreateProcessNotifyRoutine</code>, <code>ObRegisterCallbacks</code>, minifilter drivers) which are officially supported and PatchGuard-compatible.</>},
          {title:"Direct Syscall / Syscall Stomping (Evasion)",color:"var(--c-err)",body:<>Instead of calling ntdll stubs (which EDR hooks intercept), attackers execute the <code>SYSCALL</code> instruction directly from shellcode with the hardcoded SSN (e.g., SysWhispers2/3 tooling). <em>Syscall stomping</em> goes further: overwrite a legitimate ntdll stub's SSN field with the desired SSN, then call the stub — the syscall executes from ntdll's legitimate address range, evading stack-origin checks.</>},
        ].map((item,i)=>(
          <div key={i} style={{padding:"14px 16px",borderRadius:10,background:`${item.color}08`,border:`1px solid ${item.color}30`}}>
            <div style={{fontFamily:"var(--font-display)",fontSize:14,fontWeight:700,color:item.color,marginBottom:8}}>{item.title}</div>
            <div style={{fontSize:13,color:"var(--text-1)",lineHeight:1.65}}>{item.body}</div>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.6 — WOW64 (32-bit on 64-bit Windows)</h3>
      <P><Term>WOW64 (Windows-on-Windows 64)</Term> is the compatibility layer that allows 32-bit PE executables to run on a 64-bit Windows installation. It consists of three DLLs loaded into every 32-bit process: <code>wow64.dll</code> (thunk layer), <code>wow64win.dll</code> (GUI thunks), and <code>wow64cpu.dll</code> (CPU mode switch). When a 32-bit process makes a syscall:</P>
      <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:12}}>
        {[
          "32-bit code calls Int 2E or Sysenter (x86 syscall method)",
          "wow64cpu.dll catches the transition and switches the CPU to 64-bit mode (heaven's gate — CS selector 0x33)",
          "wow64.dll reformats 32-bit arguments to 64-bit and calls the 64-bit ntdll syscall stub",
          "64-bit syscall executes normally in the kernel",
          "Return path: wow64.dll translates 64-bit results back to 32-bit and restores x86 mode",
        ].map((step,i)=>(
          <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",padding:"8px 12px",borderRadius:6,background:"rgba(255,255,255,0.02)",border:"1px solid var(--border)"}}>
            <span style={{fontFamily:"var(--font-mono)",fontSize:12,color:"var(--accent)",minWidth:20,flexShrink:0}}>{i+1}.</span>
            <span style={{fontSize:13,color:"var(--text-1)"}}>{step}</span>
          </div>
        ))}
      </div>
      <Callout color="var(--c-warn)" icon="info" titleEn="Security implication: WOW64 as a detection gap" titleUz="">
        Some EDR userland hooks only cover the 64-bit ntdll. A 32-bit process using "Heaven's Gate" (manually switching to 64-bit mode and calling the 64-bit syscall stub directly) can bypass 32-bit hooks. This is why kernel callbacks are more reliable for detection — they fire regardless of WOW64.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.7 — API Monitoring and Detection</h3>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Tool / Method","Layer","What It Captures"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["API Monitor (Rohitab)","User-mode (IAT/inline hooks)","Every Win32 call with arguments, return values, call stacks"],
            ["Frida","User-mode (dynamic instrumentation)","Scriptable hooks on any function; cross-platform; used for EDR testing"],
            ["Process Monitor (Procmon)","Kernel callbacks + minifilter","File, registry, network, process/thread events with call stacks"],
            ["ETW (Event Tracing for Windows)","Kernel providers","Microsoft-Windows-Kernel-Process, -File, -Registry, -Network providers at low overhead"],
            ["Sysmon (Event IDs 1,7,8,10,11,12,13,17,18…)","Kernel callbacks + ETW","Process creation, image load, remote thread, file create, registry, pipe events"],
            ["WinDbg breakpoints","Any layer","Precise — break on any function, inspect any argument; requires attaching to process"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.8 — Practical Commands</h3>
      <pre style={{background:"rgba(0,0,0,0.35)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 16px",fontSize:12,lineHeight:1.7,overflowX:"auto",marginTop:10}}><code>{`# Find SSN for any Nt function (ntdll offset method)
# Each Nt stub starts: mov r10, rcx; mov eax, <SSN>
python3 -c "
import ctypes, struct
ntdll = ctypes.WinDLL('ntdll')
fn = ctypes.cast(getattr(ntdll, 'NtCreateFile'), ctypes.c_void_p).value
buf = (ctypes.c_ubyte * 8).from_address(fn)
print('SSN:', hex(struct.unpack_from('<H', bytes(buf), 4)[0]))
"

# Check if ntdll is hooked (compare byte 0 of Nt stubs to expected 4C 8B D1)
# If byte 0 = 0xE9 (JMP) = hook present (EDR inline hook)
Get-NtdllHooks.ps1   # PSReflect-based tool

# Monitor all API calls in a process (WinDbg)
sxe ld:ntdll        # break on ntdll load
bp ntdll!NtCreateFile "du @rcx; g"   # log file paths

# ETW syscall tracing (Admin, requires patching or TPM disabled)
xperf -on PROC_THREAD+LOADER+DPC -stackwalk Profile -buffersize 2048
# Then analyze .etl with Windows Performance Analyzer`}</code></pre>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="Windows API — OS ga Interfeys" en="" />
      <P><Term>Windows API</Term> (Win32 API ham deyiladi) — foydalanuvchi rejimi dasturlariga OS xizmatlariga kirish imkonini beruvchi C chaqiriladigan funksiyalar to'plami: jarayonlar yaratish, fayllarni o'qish, xotirani boshqarish, ekranga chizish, tarmoqqa kirish. U qatlamli stek sifatida tashkil etilgan — har bir qatlam uning ostidagisiga qo'shimcha abstraktsiya va xavfsizlik tekshiruvlarini qo'shadi. Bu stekni tushunish hujumkor va himoyaviy xavfsizlik uchun ham asosiy hisoblanadi, chunki har bir hujum texnikasi va har bir aniqlash usuli oxir-oqibat bu qatlamlardan birida ishlaydi.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.1 — API Qatlamli Steki</h3>
      <div style={{display:"flex",flexDirection:"column",gap:0,marginTop:14}}>
        {[
          {label:"Dastur",sub:"Sizning kodingiz: WriteFile(), CreateProcess(), RegOpenKeyEx()",color:"#b48cff",mode:"Foydalanuvchi rejimi"},
          {label:"Win32 Quyi Tizim DLL lari",sub:"kernel32.dll, advapi32.dll, user32.dll, gdi32.dll — yupqa o'ramlar, parametrlarni tekshirish, xato tarjimasi",color:"#00d4ff",mode:"Foydalanuvchi rejimi"},
          {label:"Windows Quyi Tizim DLL",sub:"kernelbase.dll — Win7 dan beri Win32 implementatsiyasining asosiy qismi",color:"#00d4ff",mode:"Foydalanuvchi rejimi"},
          {label:"Native API (ntdll.dll)",sub:"NtCreateFile, NtOpenProcess, NtAllocateVirtualMemory — hujjatlanmagan Nt/Zw funksiyalari; syscall stubini o'z ichiga oladi",color:"#ff9145",mode:"Foydalanuvchi rejimi"},
          {label:"SYSCALL ko'rsatmasi",sub:"CPU ni Ring 3 dan Ring 0 ga o'tkazadi; kernel chaqiruv raqamini (SSN) tekshiradi va yo'naltiradi",color:"#ff3a5e",mode:"RING 0 CHEGARASI"},
          {label:"Tizim Xizmati Dispetcheri (SSDT)",sub:"nt!KiSystemCall64 → SSDT qidirish → haqiqiy kernel funksiyasi (ntoskrnl da NtCreateFile)",color:"#ff9145",mode:"Kernel rejimi"},
          {label:"Executive + HAL",sub:"I/O Menejeri, Xotira Menejeri, Ob'ekt Menejeri, Xavfsizlik Havolasi Monitoru, HAL",color:"#b48cff",mode:"Kernel rejimi"},
        ].map((item,i)=>(
          <div key={i} style={{display:"flex",alignItems:"stretch",gap:0}}>
            <div style={{width:3,flexShrink:0,background:item.color,opacity:0.6}}/>
            <div style={{flex:1,padding:"10px 14px",borderBottom:"1px solid var(--border)",background:i===4?"rgba(255,58,94,0.07)":"transparent"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",gap:8}}>
                <span style={{fontFamily:"var(--font-display)",fontSize:14,fontWeight:700,color:item.color}}>{item.label}</span>
                <span style={{fontFamily:"var(--font-mono)",fontSize:10,color:i<4?"var(--c-system)":"var(--c-err)",flexShrink:0}}>{item.mode}</span>
              </div>
              <div style={{fontSize:12,color:"var(--text-2)",marginTop:3}}>{item.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.2 — Asosiy DLL lar va Ularning Vazifalari</h3>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["DLL","Asosiy Funksiyalar","Eslatmalar"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["ntdll.dll","NtCreateFile, NtOpenProcess, NtAllocateVirtualMemory, LdrLoadDll, RtlAllocateHeap","Kernel tomonidan to'g'ridan-to'g'ri yuklanadigan yagona DLL; syscall stublarini va heap menejerni o'z ichiga oladi; har bir jarayonda mavjud"],
            ["kernel32.dll","CreateFile, CreateProcess, VirtualAlloc, ReadFile, GetProcAddress, LoadLibrary","Asosiy Win32 API; ko'p funksiyalar Win7 dan beri kernelbase.dll ga yo'naltiradi"],
            ["kernelbase.dll","Windows 7 dan beri ko'p kernel32 funksiyalarining haqiqiy implementatsiyasi","kernel32/kernelbase ajratish MinWin quyi tizimlariga imkon beradi"],
            ["advapi32.dll","RegOpenKeyEx, OpenProcessToken, AdjustTokenPrivileges, CreateService, LookupPrivilegeValue","Xavfsizlik/registry API; ko'p funksiyalarni sechost.dll ga yo'naltiradi"],
            ["user32.dll","CreateWindow, SendMessage, GetMessage, SetWindowsHookEx","GUI quyi tizimi; birinchi chaqiruvda win32k.sys (kernel-rejim GUI drayveri) yuklanadi"],
            ["gdi32.dll","CreateCompatibleDC, BitBlt, TextOut, CreatePen","Grafik Qurilma Interfeysi; kernelda win32kbase.sys ni chaqiradi"],
            ["ws2_32.dll","socket, connect, send, recv, WSAStartup","Winsock 2 API; haqiqiy implementatsiya mswsock.dll da"],
            ["sechost.dll","OpenSCManager, CreateService, StartService, QueryServiceStatus","Servis Nazorati API; avval advapi32 da edi"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.3 — Syscall Mexanikasi (x64)</h3>
      <P>x64 Windows da kernel xizmatlarini talab qiladigan har bir Win32 API chaqiruvi oxir-oqibat ntdll dagi <Term>syscall stubiga</Term> etadi. Stub <Em>Tizim Xizmati Raqami (SSN)</Em> tayinlaydi va <code>SYSCALL</code> ko'rsatmasini bajaradi:</P>
      <pre style={{background:"rgba(0,0,0,0.35)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 16px",fontSize:12,lineHeight:1.7,overflowX:"auto",marginTop:10}}><code>{`; ntdll!NtCreateFile syscall stub (Windows 11 x64)
NtCreateFile:
    mov  r10, rcx          ; rcx ni (1-parametr) r10 da saqlash (ABI talabi)
    mov  eax, 55h          ; SSN = 0x55 bu qurilmada NtCreateFile uchun
    test byte ptr [SharedUserData+0x308], 1  ; Syscall Filtrlash tekshiruvi
    jnz  short KiFastSystemCall2
    syscall                ; SYSCALL: RIP→RCX, RSP→R11 saqlash, LSTAR dan RIP yuklash
    ret                    ; chaqiruvchiga qaytish

; Kernelda (ring 0):
; nt!KiSystemCall64 → eax (SSN) o'qiydi → SSDT[SSN] qidiradi → haqiqiy funksiyani chaqiradi`}</code></pre>
      <P><Term>SSDT (Tizim Xizmati Tavsif Jadvali)</Term> — har bir indeks SSN ni mos kernel funksiyasiga moslashtiruvchi kernel massivi. EDR kernel drayverlari syscallarni to'xtatib tekshirish uchun SSDT ni hooklaydi (yoki callbacklar ishlatadi). To'g'ridan-to'g'ri syscall hujumlari (ntdll stublarini butunlay chetlab o'tib) foydalanuvchi makonidagi hooklerni chetlab o'tish uchun hardcoded SSN bilan foydalanuvchi rejimi shellcodedan <code>SYSCALL</code> ko'rsatmasini bajaradi.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.4 — Chaqiruv Konventsiyasi (x64 fastcall)</h3>
      <P>Barcha Windows x64 API funksiyalari <Term>Microsoft x64 chaqiruv konventsiyasidan</Term> foydalanadi:</P>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Registr / Maydon","Rol"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["RCX","1-son/ko'rsatgich argument"],
            ["RDX","2-son/ko'rsatgich argument"],
            ["R8","3-son/ko'rsatgich argument"],
            ["R9","4-son/ko'rsatgich argument"],
            ["Stek (RSP+0x20 va undan yuqori)","5+ argumentlar VA chaqiriluvchi uchun RCX–R9 ni to'kish uchun 32-baytli 'soya maydoni'"],
            ["RAX","Qaytish qiymati (son/ko'rsatgich)"],
            ["XMM0–XMM3","Suzuvchi nuqta argumentlari (1–4-si)"],
            ["RBX, RBP, RDI, RSI, R12–R15","Notinch emas — chaqiriluvchi chaqiruv bo'yicha saqlashi kerak"],
            ["RAX, RCX, RDX, R8–R11, XMM0–5","Tinch — chaqiriluvchi yo'q qilishi mumkin"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--c-warn)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.5 — API Hooking Texnikalari</h3>
      <P><Term>API hooking</Term> — funksiya chaqiruvini argumentlarni, qaytish qiymatlarini yoki xatti-harakatni tekshirish yoki o'zgartirish uchun to'xtatish. EDR lar tomonidan qonuniy ravishda (zararli chaqiruvlarni aniqlash uchun) va zararli holda (yashirish, o'g'irlash yoki yo'naltirish uchun) qo'llaniladi:</P>
      <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:12}}>
        {[
          {title:"IAT Hooking (Import Manzil Jadvali)",color:"var(--c-system)",body:<>IAT import qilingan funksiyalarga ko'rsatkichlarni saqlaydi. DLL yuklanganidan keyin, bular haqiqiy funksiyalarga ishora qiladi. IAT hooking yozuvni (masalan, <code>CreateProcess</code>) hook funksiyasiga ko'rsatkich bilan qayta yozadi. Amalga oshirish oson (yoziladigan xotira), aniqlash oson (IAT yozuvlarini haqiqiy DLL manzillari bilan solishtirish). Eski maktab antivirus va oddiy sandbox aniqlovchilari tomonidan ishlatiladi.</>},
          {title:"Inline Hooking (Trampolin)",color:"var(--c-warn)",body:<>Maqsad funksiyaning dastlabki 5–14 baytini <code>JMP hook_function</code> ko'rsatmasi bilan qayta yozish. Hook asl baytlarni saqlaydi, ularni "trampolin" buferida bajaradi, keyin funksiya tanasiga qaytadi. Zamonaviy EDR lar (CrowdStrike, Defender ATP) tomonidan ntdll funksiyalarini hooklash uchun qo'llaniladi. Chetlab o'tish: (1) hookni qayta o'qib tuzatish, (2) ntdll ni butunlay chetlab o'tib to'g'ridan-to'g'ri syscall bajarish, (3) diskdan yangi ntdll nusxasini yuklash (ntdll unhooking).</>},
          {title:"SSDT Hooking (Kernel rejimi)",color:"var(--c-attack)",body:<>Erta AV/HIPS SSDT yozuvlarini o'z tekshiruv kodlariga yo'naltirish uchun yamoqlar qo'lladi. Microsoft buni x64 Windows da <em>Kernel Patch Protection (PatchGuard)</em> bilan to'sdi — SSDT o'zgartirishda BSOD. Zamonaviy kernel EDR lar buning o'rniga hujjatlanmagan kernel callbacklaridan (<code>PsSetCreateProcessNotifyRoutine</code>, <code>ObRegisterCallbacks</code>, minifilter drayverlari) foydalanadi.</>},
          {title:"To'g'ridan-to'g'ri Syscall / Syscall Stomping (Chetlab O'tish)",color:"var(--c-err)",body:<>ntdll stublarini (EDR hooklar to'xtatadigan) chaqirish o'rniga, hujumchilar hardcoded SSN bilan shellcodedan to'g'ridan-to'g'ri <code>SYSCALL</code> ko'rsatmasini bajaradi (SysWhispers2/3 vositalari). <em>Syscall stomping</em> yanada ilgarilab ketadi: kerakli SSN bilan qonuniy ntdll stubining SSN maydonini qayta yozadi, keyin stubni chaqiradi — syscall ntdll ning qonuniy manzil diapazonidan bajariladi, stek-kelib chiqish tekshiruvlarini chetlab o'tadi.</>},
        ].map((item,i)=>(
          <div key={i} style={{padding:"14px 16px",borderRadius:10,background:`${item.color}08`,border:`1px solid ${item.color}30`}}>
            <div style={{fontFamily:"var(--font-display)",fontSize:14,fontWeight:700,color:item.color,marginBottom:8}}>{item.title}</div>
            <div style={{fontSize:13,color:"var(--text-1)",lineHeight:1.65}}>{item.body}</div>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.6 — WOW64 (64-bit Windows da 32-bit)</h3>
      <P><Term>WOW64 (Windows-on-Windows 64)</Term> — 32-bit PE bajariladigan fayllarning 64-bit Windows o'rnatmasida ishlashiga imkon beruvchi muvofiqlastirish qatlami. Har bir 32-bit jarayonga yuklanadigan uchta DLL dan iborat: <code>wow64.dll</code> (thunk qatlami), <code>wow64win.dll</code> (GUI thunklar) va <code>wow64cpu.dll</code> (CPU rejimi almashtirish).</P>
      <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:12}}>
        {[
          "32-bit kod Int 2E yoki Sysenter ni chaqiradi (x86 syscall usuli)",
          "wow64cpu.dll o'tishni ushlab qoladi va CPUni 64-bit rejimiga o'tkazadi (heaven's gate — CS selektori 0x33)",
          "wow64.dll 32-bit argumentlarni 64-bit ga qayta formatlaydi va 64-bit ntdll syscall stubini chaqiradi",
          "64-bit syscall kernelda odatiy bajariladi",
          "Qaytish yo'li: wow64.dll 64-bit natijalarini 32-bit ga tarjima qiladi va x86 rejimini tiklaydi",
        ].map((step,i)=>(
          <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",padding:"8px 12px",borderRadius:6,background:"rgba(255,255,255,0.02)",border:"1px solid var(--border)"}}>
            <span style={{fontFamily:"var(--font-mono)",fontSize:12,color:"var(--accent)",minWidth:20,flexShrink:0}}>{i+1}.</span>
            <span style={{fontSize:13,color:"var(--text-1)"}}>{step}</span>
          </div>
        ))}
      </div>
      <Callout color="var(--c-warn)" icon="info" titleUz="Xavfsizlik oqibati: WOW64 aniqlash bo'shlig'i sifatida" titleEn="">
        Ba'zi EDR foydalanuvchi makon hooklari faqat 64-bit ntdll ni qamrab oladi. "Heaven's Gate" ishlatuvchi 32-bit jarayon (qo'lda 64-bit rejimiga o'tib, 64-bit syscall stubni to'g'ridan-to'g'ri chaqirib) 32-bit hooklerni chetlab o'ta oladi. Shuning uchun kernel callbacklari aniqlash uchun ishonchliroq — ular WOW64 dan qat'iy nazar ishga tushadi.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.7 — API Monitoringi va Aniqlash</h3>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Vosita / Usul","Qatlam","Nima Qayd Etadi"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["API Monitor (Rohitab)","Foydalanuvchi rejimi (IAT/inline hooklar)","Argumentlar, qaytish qiymatlari, chaqiruv stekilari bilan har bir Win32 chaqiruvi"],
            ["Frida","Foydalanuvchi rejimi (dinamik asboblash)","Har qanday funksiyada skript hooklar; platformalararo; EDR testlash uchun ishlatiladi"],
            ["Process Monitor (Procmon)","Kernel callbacklar + minifiltr","Chaqiruv stekilari bilan fayl, registry, tarmoq, jarayon/thread hodisalari"],
            ["ETW (Windows Hodisa Kuzatish)","Kernel provayderlari","Past yuklamada Microsoft-Windows-Kernel-Process, -File, -Registry, -Network provayderlari"],
            ["Sysmon (ID 1,7,8,10,11,12,13,17,18…)","Kernel callbacklar + ETW","Jarayon yaratish, tasvir yuklash, uzoq thread, fayl yaratish, registry, quvur hodisalari"],
            ["WinDbg nuqta to'xtatish","Har qanday qatlam","Aniq — har qanday funksiyada to'xtatish, har qanday argumentni tekshirish; jarayonga ulanish talab qiladi"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.8 — Amaliy Buyruqlar</h3>
      <pre style={{background:"rgba(0,0,0,0.35)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 16px",fontSize:12,lineHeight:1.7,overflowX:"auto",marginTop:10}}><code>{`# Har qanday Nt funksiyasi uchun SSN topish (ntdll offset usuli)
# Har bir Nt stub boshlanadi: mov r10, rcx; mov eax, <SSN>
python3 -c "
import ctypes, struct
ntdll = ctypes.WinDLL('ntdll')
fn = ctypes.cast(getattr(ntdll, 'NtCreateFile'), ctypes.c_void_p).value
buf = (ctypes.c_ubyte * 8).from_address(fn)
print('SSN:', hex(struct.unpack_from('<H', bytes(buf), 4)[0]))
"

# ntdll hooklanganligini tekshirish (Nt stub ning 0-bayti kutilgan 4C 8B D1 bilan solishtirish)
# 0-bayt = 0xE9 (JMP) bo'lsa = hook mavjud (EDR inline hook)

# Jarayondagi barcha API chaqiruvlarini kuzatish (WinDbg)
sxe ld:ntdll
bp ntdll!NtCreateFile "du @rcx; g"   # fayl yo'llarini log qilish

# ETW syscall kuzatish (Admin)
xperf -on PROC_THREAD+LOADER+DPC -stackwalk Profile -buffersize 2048`}</code></pre>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
function ComingSoon({ lesson, lessonNum, setRoute }) {
  const lang = useLang();
  return (
    <div style={{ textAlign: "center", padding: "80px 32px" }}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--accent-soft)", border: "1px solid var(--accent-border)", margin: "0 auto 24px", display: "grid", placeItems: "center", color: "var(--accent)" }}>
        <Icon name="clock" size={36} />
      </div>
      <div className="eyebrow" style={{ color: "var(--accent)", marginBottom: 12 }}>// {lang === "en" ? "IN_DEVELOPMENT" : "TAYYORLANMOQDA"}</div>
      <h2 className="display" style={{ fontSize: 32, margin: "0 0 10px", letterSpacing: "-0.02em" }}>
        {lang === "en" ? lesson.en : lesson.uz}
      </h2>
      <p style={{ color: "var(--text-2)", fontSize: 15, maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.65 }}>
        {lang === "en"
          ? "This lesson is currently being developed. Complete the earlier lessons and check back soon — it will appear here automatically when ready."
          : "Bu dars hozirda tayyorlanmoqda. Oldingi darslarni tugating va tez orada qaytib keling — tayyor bo'lgach bu yerda avtomatik paydo bo'ladi."}
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button className="btn btn-primary" onClick={() => setRoute({ name: "section", section: 1 })}>
          <Icon name="arrow-left" size={14} /> {lang === "en" ? "Back to section" : "Bo'limga qaytish"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Text helpers
// ─────────────────────────────────────────────────────────────
function H2({ num, uz, en }) {
  const lang = useLang();
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginBottom: 14 }}>
      <span className="mono" style={{ color: "var(--accent)", fontSize: 12, letterSpacing: 0.18 }}>{num}</span>
      <h2 className="display" style={{ margin: 0, fontSize: 30, letterSpacing: "-0.02em" }}>{lang === "en" ? en : uz}</h2>
    </div>
  );
}
function P({ children, style }) {
  return <p style={{ fontSize: 15, lineHeight: 1.72, color: "var(--text-1)", margin: "10px 0", textWrap: "pretty", ...style }}>{children}</p>;
}
function Term({ children }) {
  return <span style={{ color: "var(--accent)", fontWeight: 600, borderBottom: "1px dotted var(--accent-border)", cursor: "help" }}>{children}</span>;
}
function Em({ children }) {
  return <em style={{ color: "var(--text-0)", fontStyle: "italic", fontWeight: 500 }}>{children}</em>;
}
function Code2({ children }) {
  return <code style={{ background: "rgba(255,255,255,0.06)", padding: "1px 6px", borderRadius: 4, fontFamily: "var(--font-mono)", fontSize: "0.92em", color: "var(--accent)" }}>{children}</code>;
}
function Callout({ children, color = "var(--accent)", icon = "info", titleUz, titleEn, small }) {
  const lang = useLang();
  const title = lang === "en" ? titleEn : titleUz;
  return (
    <div style={{
      padding: small ? "12px 14px" : "16px 18px",
      background: `${color}0a`,
      border: `1px solid ${color}33`,
      borderRadius: 10, borderLeft: `3px solid ${color}`,
      display: "flex", gap: 12, alignItems: "flex-start",
      marginTop: 14,
    }}>
      <span style={{ color, flexShrink: 0, marginTop: 2 }}><Icon name={icon} size={small ? 14 : 16} /></span>
      <div style={{ flex: 1, fontSize: small ? 12 : 13.5, color: "var(--text-1)", lineHeight: 1.55 }}>
        {title && <div style={{ color, fontWeight: 600, marginBottom: 4 }}>{title}</div>}
        {children}
      </div>
    </div>
  );
}

window.LessonScreen = LessonScreen;
