// lesson.jsx — Lesson L01: Windows arxitekturasi / Windows Architecture
// Sections: Big picture → Theory → Layered diagram → Boot → Syscall flow → Security view → Lab → Compare → Summary

const { useState: useLS, useEffect: useLE, useRef: useLR } = React;

// ── Time tracking ─────────────────────────────────────────────
const TIME_KEY = "wa_time_spent";
const MAX_LESSON_SECS = 4 * 3600;   // 4h absolute cap per lesson
const MAX_WRITE_SECS  = 15;          // max seconds per single write (10s autosave + buffer)
const VALID_KEY = /^s0[123]_l\d{2}$/;

function getTimeSpent() {
  try {
    const raw = JSON.parse(localStorage.getItem(TIME_KEY) || "{}");
    if (typeof raw !== "object" || Array.isArray(raw)) return {};
    const clean = {};
    for (const [k, v] of Object.entries(raw)) {
      if (VALID_KEY.test(k)) {
        const n = Number(v);
        if (Number.isFinite(n) && n >= 0) clean[k] = Math.min(Math.floor(n), MAX_LESSON_SECS);
      }
    }
    return clean;
  } catch { return {}; }
}
function addTimeSpent(key, seconds) {
  if (!VALID_KEY.test(key)) return;
  const secs = Math.min(Math.max(0, Math.round(seconds)), MAX_WRITE_SECS);
  if (secs <= 0) return;
  try {
    const all = getTimeSpent();
    all[key] = Math.min((all[key] || 0) + secs, MAX_LESSON_SECS);
    localStorage.setItem(TIME_KEY, JSON.stringify(all));
  } catch {}
}
function fmtTime(totalSec, lang) {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return lang === "en" ? `${h}h ${m}m` : `${h} soat ${m} daqiqa`;
  if (m > 0) return lang === "en" ? `${m}m ${s}s` : `${m} daqiqa ${s} soniya`;
  return lang === "en" ? `${s}s` : `${s} soniya`;
}

const LESSON = {
  num: "L01", section: "01",
  uz: "Windows arxitekturasi",
  en: "Windows Architecture",
  subUz: "Operatsion tizim ichida nima sodir bo'lmoqda",
  subEn: "What's actually happening inside the operating system",
};

const LESSONS = {
  1:  { num:"L01", section:"01", uz:"Windows arxitekturasi", en:"Windows Architecture", subUz:"Operatsion tizim ichida nima sodir bo'lmoqda", subEn:"What's actually happening inside the operating system" },
  2:  { num:"L02", section:"01", uz:"Kernel nima?", en:"What is the kernel?", subUz:"Operatsion tizim yadrosiga kirib borish", subEn:"Deep dive into the operating system core" },
  3:  { num:"L03", section:"01", uz:"User mode vs Kernel mode", en:"User mode vs Kernel mode", subUz:"CPU imtiyoz halqalari va chegara nima uchun muhim", subEn:"CPU privilege rings and why the boundary matters" },
  4:  { num:"L04", section:"01", uz:"Windows boot jarayoni", en:"Windows boot process", subUz:"UEFI dan login ekranigacha", subEn:"From UEFI to login screen" },
  5:  { num:"L05", section:"01", uz:"BIOS vs UEFI", en:"BIOS vs UEFI", subUz:"Firmware arxitekturasi va Secure Boot", subEn:"Firmware architecture and Secure Boot" },
  6:  { num:"L06", section:"01", uz:"Secure Boot", en:"Secure Boot", subUz:"Bootkit'lardan himoya qilish", subEn:"Protecting against bootkits" },
  7:  { num:"L07", section:"01", uz:"TPM (Trusted Platform Module)", en:"TPM", subUz:"Apparat asosidagi xavfsizlik chipi", subEn:"Hardware-based security chip" },
  8:  { num:"L08", section:"01", uz:"Registry", en:"Windows Registry", subUz:"Windows konfiguratsiya ma'lumotlar bazasi", subEn:"Windows configuration database" },
  9:  { num:"L09", section:"01", uz:"Fayl tizimlari", en:"File systems", subUz:"FAT32 va NTFS arxitekturasi", subEn:"FAT32 and NTFS architecture" },
  10: { num:"L10", section:"01", uz:"NTFS", en:"NTFS", subUz:"Zamonaviy fayl tizimi chuqur", subEn:"Modern file system in depth" },
  11: { num:"L11", section:"01", uz:"FAT32", en:"FAT32", subUz:"Klassik fayl tizimi", subEn:"Classic file system" },
  12: { num:"L12", section:"01", uz:"Jarayonlar (processes)", en:"Processes", subUz:"EPROCESS tuzilmasi va jarayon boshqaruvi", subEn:"EPROCESS structure and process management" },
  13: { num:"L13", section:"01", uz:"Thread'lar", en:"Threads", subUz:"ETHREAD va rejalashtiruvchi", subEn:"ETHREAD and the scheduler" },
  14: { num:"L14", section:"01", uz:"Handle'lar", en:"Handles", subUz:"Windows ob'ekt menejeri", subEn:"Windows Object Manager" },
  15: { num:"L15", section:"01", uz:"Servislar", en:"Services", subUz:"Windows fon jarayonlari va SCM", subEn:"Windows background processes and SCM" },
  16: { num:"L16", section:"01", uz:"DLL (Dynamic Link Library)", en:"DLL", subUz:"PE format va dinamik yuklash", subEn:"PE format and dynamic loading" },
  17: { num:"L17", section:"01", uz:"Windows API", en:"Windows API", subUz:"Win32 qatlami va ntdll ko'prigi", subEn:"Win32 layer and ntdll bridge" },
  18: { num:"L18", section:"01", uz:"Event Viewer", en:"Event Viewer", subUz:"Windows hodisa log tizimi", subEn:"Windows event logging system" },
  19: { num:"L19", section:"01", uz:"Task Scheduler", en:"Task Scheduler", subUz:"Vazifalarni avtomatlashtirish", subEn:"Automating system tasks" },
  20: { num:"L20", section:"01", uz:"Windows log fayllari", en:"Windows logs", subUz:"EVTX forensics va hodisalarga javob", subEn:"EVTX forensics and incident response" },
  21: { num:"L21", section:"02", uz:"Task Manager", en:"Task Manager", subUz:"Jarayonlar, resurslar va ish unumdorligini kuzatish", subEn:"Monitoring processes, resources and performance" },
  22: { num:"L22", section:"02", uz:"Device Manager", en:"Device Manager", subUz:"Qurilma drayverlari va apparat boshqaruvi", subEn:"Hardware devices and driver management" },
  23: { num:"L23", section:"02", uz:"Foydalanuvchi hisoblari", en:"User Accounts & Profiles", subUz:"Mahalliy foydalanuvchilar va profillarni boshqarish", subEn:"Managing local users and profiles" },
  24: { num:"L24", section:"02", uz:"User Account Control (UAC)", en:"User Account Control", subUz:"Imtiyozlarni boshqarish va UAC mexanizmi", subEn:"Privilege management and the UAC mechanism" },
  25: { num:"L25", section:"02", uz:"Settings va Control Panel", en:"Settings & Control Panel", subUz:"Tizim sozlamalarini boshqarish interfeyslari", subEn:"System settings management interfaces" },
  26: { num:"L26", section:"02", uz:"MSConfig", en:"MSConfig", subUz:"Tizim konfiguratsiyasi va yuklash sozlamalari", subEn:"System configuration and startup settings" },
  27: { num:"L27", section:"02", uz:"Computer Management", en:"Computer Management", subUz:"Markaziy boshqaruv konsoli", subEn:"Central management console" },
  28: { num:"L28", section:"02", uz:"Resource Monitor", en:"Resource Monitor", subUz:"CPU, xotira, disk va tarmoq resurslarini kuzatish", subEn:"Monitoring CPU, memory, disk and network resources" },
  29: { num:"L29", section:"02", uz:"Windows Update", en:"Windows Update", subUz:"Tizim yangilanishlari va yamoqlarni boshqarish", subEn:"Managing system updates and patches" },
  30: { num:"L30", section:"02", uz:"Windows Defender", en:"Windows Defender", subUz:"O'rnatilgan antivirus va real vaqt himoyasi", subEn:"Built-in antivirus and real-time protection" },
  31: { num:"L31", section:"02", uz:"Windows Firewall", en:"Windows Firewall", subUz:"Tarmoq trafikini filtrlash va qoidalar", subEn:"Network traffic filtering and rules" },
  32: { num:"L32", section:"02", uz:"BitLocker", en:"BitLocker", subUz:"Disk shifrlash va ma'lumotlarni himoya qilish", subEn:"Disk encryption and data protection" },
  33: { num:"L33", section:"02", uz:"PowerShell asoslari", en:"PowerShell Basics", subUz:"Buyruqlar qatori orqali tizimni avtomatlashtirish", subEn:"Automating system management from the command line" },
  34: { num:"L34", section:"02", uz:"Remote Desktop (RDP)", en:"Remote Desktop (RDP)", subUz:"Masofaviy ish stoli bilan ulanish va boshqarish", subEn:"Connecting and managing remote desktops" },
  35: { num:"L35", section:"02", uz:"Tarmoq sozlamalari", en:"Network Configuration", subUz:"IP, DNS, adapter va tarmoq ulanishlarini boshqarish", subEn:"Managing IP, DNS, adapters and network connections" },
  36: { num:"L36", section:"02", uz:"Fayl ulashish", en:"File Sharing", subUz:"Shared folders va tarmoq ulashish sozlamalari", subEn:"Shared folders and network sharing settings" },
  37: { num:"L37", section:"02", uz:"Zaxira nusxa va tiklash", en:"Backup & Restore", subUz:"Ma'lumotlarni zaxiralash va tiklash strategiyalari", subEn:"Data backup and recovery strategies" },
  38: { num:"L38", section:"03", uz:"Active Directory asoslari", en:"Active Directory Basics", subUz:"Windows domeni, AD DS va asosiy ob'ektlar", subEn:"Windows domain, AD DS and core objects" },
  39: { num:"L39", section:"03", uz:"AD da foydalanuvchi va kompyuter boshqaruvi", en:"Managing Users & Computers in AD", subUz:"OU boshqaruvi, delegatsiya va qurilmalarni tashkil etish", subEn:"OU management, delegation and organising computers" },
  40: { num:"L40", section:"03", uz:"Group Policy — Kirish", en:"Group Policy — Introduction", subUz:"GPO nima, GPO menejment konsoli va OU ierarxiyasi", subEn:"What is GPO, management console and OU hierarchy" },
  41: { num:"L41", section:"03", uz:"GPO Sozlamalari va SYSVOL", en:"GPO Settings & SYSVOL", subUz:"GPO sozlamalari, parol siyosati va SYSVOL tarqatish", subEn:"GPO settings, password policy and SYSVOL distribution" },
  42: { num:"L42", section:"03", uz:"GPO Yaratish va Qo'llash", en:"Creating & Applying GPOs", subUz:"Boshqaruv paneli cheklash, avtomatik qulflash va GPO sinash", subEn:"Restrict control panel, auto-lock screen and testing GPOs" },
};

// ─────────────────────────────────────────────────────────────
function LessonScreen({ setRoute, user, markLessonComplete, onOpenProfile, onOpenAIChat, aiChatOpen, onOpenSearch, lessonNum = 1 }) {
  const lang = useLang();
  const [progress, setProgress] = useLS(0);
  const [quizOpen, setQuizOpen] = useLS(false);
  const LESSON = LESSONS[lessonNum] || { num: `L${String(lessonNum).padStart(2,"0")}`, section: "01", uz: "Dars", en: "Lesson", subUz: "Tez kunda", subEn: "Coming soon" };
  const sectionNum = lessonNum <= 20 ? 1 : lessonNum <= 37 ? 2 : 3;
  const sectionLabel = sectionNum === 1 ? "01" : sectionNum === 2 ? "02" : "03";
  const lessonKey = `s${sectionLabel}_l${String(lessonNum).padStart(2,"0")}`;
  const completedLessons = user?.completedLessons || [];
  const prevLessonNum = lessonNum - 1;
  const prevSection = prevLessonNum <= 20 ? "01" : prevLessonNum <= 37 ? "02" : "03";
  const prevKey = lessonNum > 1 ? `s${prevSection}_l${String(prevLessonNum).padStart(2,"0")}` : null;
  const sec1Keys = Array.from({ length: 20 }, (_, i) => `s01_l${String(i + 1).padStart(2, "0")}`);
  const sec2Keys = Array.from({ length: 17 }, (_, i) => `s02_l${String(i + 21).padStart(2, "0")}`);
  const sec1Complete = sec1Keys.every(k => completedLessons.includes(k));
  const sec2Complete = sec2Keys.every(k => completedLessons.includes(k));
  const isLocked = lessonNum > 1 && (
    lessonNum >= 38 ? !sec2Complete :
    lessonNum >= 21 ? !sec1Complete :
    !completedLessons.includes(prevKey)
  );

  // ── Session timer ─────────────────────────────────────────
  const [quizPassed, setQuizPassed] = useLS(false);
  const [totalTimeSec, setTotalTimeSec] = useLS(() =>
    Math.min(getTimeSpent()[lessonKey] || 0, MAX_LESSON_SECS)
  );
  useLE(() => {
    // Start activeElapsed from saved value so display is always cumulative
    const initialSaved = Math.min(getTimeSpent()[lessonKey] || 0, MAX_LESSON_SECS);
    let tabVisible = !document.hidden;
    let activeElapsed = initialSaved;
    let lastSaved = initialSaved;
    let lastXPTick = initialSaved;

    const onVisibility = () => { tabVisible = !document.hidden; };
    document.addEventListener("visibilitychange", onVisibility);

    const tick = setInterval(() => {
      if (tabVisible) {
        activeElapsed++;
        setTotalTimeSec(activeElapsed);
        if (activeElapsed - lastXPTick >= 60) {
          lastXPTick = activeElapsed;
          if (window._addXP) window._addXP(1, "reading");
        }
      }
    }, 1000);

    const autosave = setInterval(() => {
      const toAdd = activeElapsed - lastSaved;
      lastSaved = activeElapsed;
      if (toAdd > 0) addTimeSpent(lessonKey, toAdd);
    }, 10000);

    return () => {
      clearInterval(tick);
      clearInterval(autosave);
      document.removeEventListener("visibilitychange", onVisibility);
      const toAdd = activeElapsed - lastSaved;
      if (toAdd > 0) addTimeSpent(lessonKey, toAdd);
    };
  }, [lessonKey]);

  const quizUnlocked = totalTimeSec >= (LESSON_META[lessonNum]?.min || 10) * 60;

  useLE(() => {
    window._termAIOpen = (query) => { if (onOpenAIChat) onOpenAIChat(query); };
    return () => { window._termAIOpen = null; };
  }, [onOpenAIChat]);

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
      <TopNav route={{ name: "lesson" }} setRoute={setRoute} user={user} onOpenProfile={onOpenProfile} onOpenAIChat={onOpenAIChat} aiChatOpen={aiChatOpen} onOpenSearch={onOpenSearch}
        crumb={[
          { label: lang === "en" ? "Courses" : "Kurslar", onClick: () => setRoute({ name: "dashboard" }) },
          { label: lang === "en" ? `Sec ${sectionLabel}` : `${sectionLabel}-bo'lim`, onClick: () => setRoute({ name: "section", section: sectionNum }) },
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

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", maxWidth: 1320, margin: "0 auto" }}>
        <LessonTOC lessonNum={lessonNum} />

        <div className="page" style={{ padding: "32px 28px 80px", maxWidth: "100%" }}>
          <LessonHero lesson={LESSON} lessonNum={lessonNum} totalTimeSec={isLocked ? 0 : totalTimeSec} />
          {isLocked
            ? <LessonLocked lessonNum={lessonNum} prevLessonNum={prevLessonNum} setRoute={setRoute} sectionNum={sectionNum} />
            : <>
                {lessonNum === 1  ? <><Section1Bigpicture /><Section2Theory /></>
                : lessonNum === 2  ? <><SectionKernelWhat /><SectionKernelInside /><SectionKernelDrivers /></>
                : lessonNum === 3  ? <><SectionRings /><Section8Comparison /><SectionSyscallBrief /></>
                : lessonNum === 4  ? <><Section4Boot /></>
                : lessonNum === 5  ? <><SectionBiosUefi /></>
                : lessonNum === 6  ? <><SectionSecureBoot /></>
                : lessonNum === 7  ? <><SectionTPM /></>
                : lessonNum === 8  ? <><SectionRegistry /></>
                : lessonNum === 9  ? <><SectionFileSystems /></>
                : lessonNum === 10 ? <><SectionNTFS /></>
                : lessonNum === 11 ? <><SectionFAT32 /></>
                : lessonNum === 12 ? <><SectionProcesses /></>
                : lessonNum === 13 ? <><SectionThreads /></>
                : lessonNum === 14 ? <><SectionHandles /></>
                : lessonNum === 15 ? <><SectionServices /></>
                : lessonNum === 16 ? <><SectionDLL /></>
                : lessonNum === 17 ? <><SectionWindowsAPI /></>
                : lessonNum === 18 ? <><SectionEventViewer /></>
                : lessonNum === 19 ? <><SectionTaskScheduler /></>
                : lessonNum === 20 ? <><SectionWindowsLogs /></>
                : lessonNum === 21 ? <><SectionTaskMgrBasic /></>
                : lessonNum === 22 ? <><SectionDeviceMgrBasic /></>
                : lessonNum === 23 ? <><SectionUserAccounts /></>
                : lessonNum === 24 ? <><SectionUAC /></>
                : lessonNum === 25 ? <><SectionSettings /></>
                : lessonNum === 26 ? <><SectionMsconfig /></>
                : lessonNum === 27 ? <><SectionComputerMgmt /></>
                : lessonNum === 28 ? <><SectionResourceMonitor /></>
                : lessonNum === 29 ? <><SectionWinUpdate /></>
                : lessonNum === 30 ? <><SectionDefenderBasic /></>
                : lessonNum === 31 ? <><SectionFirewallBasic /></>
                : lessonNum === 32 ? <><SectionBitLockerBasic /></>
                : lessonNum === 33 ? <><SectionPSBasic /></>
                : lessonNum === 34 ? <><SectionRDP /></>
                : lessonNum === 35 ? <><SectionNetBasic /></>
                : lessonNum === 36 ? <><SectionFileShare /></>
                : lessonNum === 37 ? <><SectionBackupRestore /></>
                : lessonNum === 38 ? <><SectionADBasics /></>
                : lessonNum === 39 ? <><SectionADUsers /></>
                : lessonNum === 40 ? <><SectionGPIntro /></>
                : lessonNum === 41 ? <><SectionGPConfig /></>
                : lessonNum === 42 ? <><SectionGPCreate /></>
                : <ComingSoon lesson={LESSON} lessonNum={lessonNum} setRoute={setRoute} />}
                <LessonNextNav lessonNum={lessonNum} setRoute={setRoute} onQuizStart={() => setQuizOpen(true)} sectionNum={sectionNum} quizUnlocked={quizUnlocked} totalTimeSec={totalTimeSec} quizPassed={quizPassed} />
              </>
          }
        </div>
      </div>

      {quizOpen && <QuizModal
        lessonNum={lessonNum}
        onClose={() => setQuizOpen(false)}
        onPass={(score) => {
          setQuizOpen(false);
          if (markLessonComplete) markLessonComplete(lessonKey, score);
          setQuizPassed(true);
        }}
        onFail={() => { setQuizOpen(false); setRoute({ name: "cooldown" }); }}
      />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
const TOC_SECTIONS = {
  1:  [{ id:"big-picture",uz:"Katta rasm",en:"Big picture" },{ id:"theory",uz:"Nazariy asos",en:"Theory" },{ id:"boot",uz:"Boot jarayoni",en:"Boot process" },{ id:"syscall",uz:"Syscall oqimi",en:"Syscall flow" },{ id:"security",uz:"Xavfsizlik",en:"Security view" },{ id:"lab",uz:"Laboratoriya",en:"Lab" },{ id:"compare",uz:"Taqqoslash",en:"Comparison" },{ id:"summary",uz:"Xulosa",en:"Summary" }],
  2:  [{ id:"kernel-what",uz:"Kernel nima",en:"What is the kernel" },{ id:"kernel-inside",uz:"Kernel ichida",en:"Inside the kernel" },{ id:"hal",uz:"HAL",en:"HAL" },{ id:"executive",uz:"Executive",en:"Executive" },{ id:"drivers",uz:"Drayverlar",en:"Drivers" }],
  3:  [{ id:"rings",uz:"CPU halqalari",en:"CPU rings" },{ id:"boundary",uz:"Chegara",en:"The boundary" },{ id:"syscall-flow",uz:"Syscall oqimi",en:"Syscall flow" },{ id:"comparison",uz:"Taqqoslash",en:"Comparison" }],
  4:  [{ id:"boot-sequence",uz:"Boot ketma-ketligi",en:"Boot sequence" },{ id:"uefi-phases",uz:"UEFI fazalari",en:"UEFI phases" },{ id:"bootmgr",uz:"BOOTMGR",en:"BOOTMGR" },{ id:"winload",uz:"WinLoad",en:"WinLoad" },{ id:"kernel-init",uz:"Kernel ishga tushishi",en:"Kernel init" }],
  5:  [{ id:"bios",uz:"BIOS",en:"BIOS" },{ id:"uefi",uz:"UEFI",en:"UEFI" },{ id:"secure-boot",uz:"Secure Boot",en:"Secure Boot" },{ id:"comparison",uz:"Taqqoslash",en:"Comparison" }],
  6:  [{ id:"secboot-what",uz:"Secure Boot nima",en:"What is Secure Boot" },{ id:"keys",uz:"Kalitlar ierarxiyasi",en:"Key hierarchy" },{ id:"verification",uz:"Imzo tekshiruvi",en:"Signature verification" },{ id:"bypass",uz:"Bypass usullari",en:"Bypass methods" }],
  7:  [{ id:"tpm-what",uz:"TPM nima",en:"What is TPM" },{ id:"pcr",uz:"PCR banklari",en:"PCR banks" },{ id:"attestation",uz:"Attestatsiya",en:"Attestation" },{ id:"bitlocker",uz:"BitLocker integratsiyasi",en:"BitLocker integration" }],
  8:  [{ id:"reg-overview",uz:"Registry umumiy",en:"Registry overview" },{ id:"hives",uz:"Hive fayllar",en:"Hive files" },{ id:"keys",uz:"Muhim kalitlar",en:"Critical keys" },{ id:"persistence",uz:"Persistenslik joylari",en:"Persistence locations" },{ id:"forensics",uz:"Forensic tahlil",en:"Forensic analysis" }],
  9:  [{ id:"vfs",uz:"Virtual fayl tizimi",en:"Virtual file system" },{ id:"types",uz:"Fayl tizimi turlari",en:"File system types" },{ id:"comparison",uz:"Taqqoslash",en:"Comparison" }],
  10: [{ id:"mft",uz:"MFT (Master File Table)",en:"MFT" },{ id:"attributes",uz:"Atributlar",en:"Attributes" },{ id:"ads",uz:"ADS",en:"ADS" },{ id:"efs",uz:"EFS",en:"EFS" },{ id:"forensics",uz:"NTFS Forensics",en:"NTFS Forensics" }],
  11: [{ id:"fat-table",uz:"FAT jadvali",en:"FAT table" },{ id:"clusters",uz:"Cluster zanjiri",en:"Cluster chain" },{ id:"limitations",uz:"Cheklovlar",en:"Limitations" }],
  12: [{ id:"eprocess",uz:"EPROCESS tuzilmasi",en:"EPROCESS structure" },{ id:"peb",uz:"PEB",en:"PEB" },{ id:"vad",uz:"VAD daraxti",en:"VAD tree" },{ id:"creation",uz:"Jarayon yaratish",en:"Process creation" },{ id:"injection",uz:"Injection texnikalar",en:"Injection techniques" }],
  13: [{ id:"ethread",uz:"ETHREAD",en:"ETHREAD" },{ id:"lifecycle",uz:"Thread lifecycle",en:"Thread lifecycle" },{ id:"scheduler",uz:"Rejalashtiruvchi",en:"Scheduler" },{ id:"sync",uz:"Sinxronizatsiya",en:"Synchronization" }],
  14: [{ id:"handles",uz:"Handle nima",en:"What is a handle" },{ id:"handle-table",uz:"Handle jadvali",en:"Handle table" },{ id:"objects",uz:"Ob'ekt turlari",en:"Object types" },{ id:"attacks",uz:"Handle hujumlar",en:"Handle-based attacks" }],
  15: [{ id:"services-overview",uz:"Servislar umumiy",en:"Services overview" },{ id:"scm",uz:"SCM",en:"SCM" },{ id:"types",uz:"Servis turlari",en:"Service types" },{ id:"accounts",uz:"Xizmat akkauntlari",en:"Service accounts" },{ id:"svchost",uz:"svchost guruhlari",en:"svchost groups" }],
  16: [{ id:"pe-format",uz:"PE format",en:"PE format" },{ id:"dll-loading",uz:"DLL yuklash",en:"DLL loading" },{ id:"injection",uz:"DLL injection",en:"DLL injection" },{ id:"hijacking",uz:"Search order hijacking",en:"Search order hijacking" },{ id:"detection",uz:"Aniqlash",en:"Detection" }],
  17: [{ id:"win32",uz:"Win32 qatlami",en:"Win32 layer" },{ id:"ntdll",uz:"ntdll ko'prigi",en:"ntdll bridge" },{ id:"hooking",uz:"API hooking",en:"API hooking" },{ id:"monitoring",uz:"Monitoring",en:"Monitoring" }],
  18: [{ id:"log-arch",uz:"Log arxitekturasi",en:"Log architecture" },{ id:"event-ids",uz:"Asosiy Event ID lar",en:"Key Event IDs" },{ id:"etw",uz:"ETW",en:"ETW" },{ id:"sysmon",uz:"Sysmon",en:"Sysmon" },{ id:"forensics",uz:"Forensic tahlil",en:"Forensic analysis" }],
  19: [{ id:"task-overview",uz:"Vazifa umumiy",en:"Task overview" },{ id:"triggers",uz:"Triggerlar",en:"Triggers" },{ id:"actions",uz:"Harakatlar",en:"Actions" },{ id:"persistence",uz:"Persistenslik",en:"Persistence" }],
  20: [{ id:"evtx",uz:"EVTX format",en:"EVTX format" },{ id:"channels",uz:"Log kanallar",en:"Log channels" },{ id:"forensics",uz:"Forensic tahlil",en:"Forensic analysis" },{ id:"ir-workflow",uz:"IR workflow",en:"IR workflow" }],
  21: [{ id:"taskmgr-overview",uz:"Task Manager umumiy",en:"Task Manager overview" },{ id:"processes-tab",uz:"Processlar tab",en:"Processes tab" },{ id:"performance-tab",uz:"Performance tab",en:"Performance tab" },{ id:"startup-tab",uz:"Startup tab",en:"Startup tab" }],
  22: [{ id:"devmgr-overview",uz:"Device Manager umumiy",en:"Device Manager overview" },{ id:"drivers",uz:"Drayverlar",en:"Drivers" },{ id:"errors",uz:"Xatoliklar",en:"Device errors" },{ id:"update-rollback",uz:"Yangilash va qaytarish",en:"Update & rollback" }],
  23: [{ id:"accounts-overview",uz:"Hisoblar umumiy",en:"Accounts overview" },{ id:"local-users",uz:"Mahalliy foydalanuvchilar",en:"Local users" },{ id:"groups",uz:"Guruhlar",en:"Groups" },{ id:"profiles",uz:"Profillar",en:"Profiles" }],
  24: [{ id:"uac-overview",uz:"UAC umumiy",en:"UAC overview" },{ id:"elevation",uz:"Imtiyozlarni oshirish",en:"Elevation" },{ id:"integrity",uz:"Yaxlitlik darajalari",en:"Integrity levels" },{ id:"bypass",uz:"UAC bypass",en:"UAC bypass" }],
  25: [{ id:"settings-overview",uz:"Settings umumiy",en:"Settings overview" },{ id:"control-panel",uz:"Control Panel",en:"Control Panel" },{ id:"key-settings",uz:"Asosiy sozlamalar",en:"Key settings" }],
  26: [{ id:"msconfig-overview",uz:"MSConfig umumiy",en:"MSConfig overview" },{ id:"startup",uz:"Yuklash",en:"Startup" },{ id:"services-tab",uz:"Servislar",en:"Services" },{ id:"boot-tab",uz:"Boot",en:"Boot" }],
  27: [{ id:"compmgmt-overview",uz:"Computer Management umumiy",en:"Overview" },{ id:"event-viewer",uz:"Event Viewer",en:"Event Viewer" },{ id:"disk-mgmt",uz:"Disk boshqaruvi",en:"Disk Management" },{ id:"local-users-groups",uz:"Foydalanuvchilar va guruhlar",en:"Local Users & Groups" }],
  28: [{ id:"resmon-overview",uz:"Resource Monitor umumiy",en:"Resource Monitor overview" },{ id:"cpu-tab",uz:"CPU",en:"CPU" },{ id:"memory-tab",uz:"Xotira",en:"Memory" },{ id:"disk-tab",uz:"Disk",en:"Disk" },{ id:"network-tab",uz:"Tarmoq",en:"Network" }],
  29: [{ id:"update-overview",uz:"Windows Update umumiy",en:"Windows Update overview" },{ id:"update-types",uz:"Yangilanish turlari",en:"Update types" },{ id:"wsus",uz:"WSUS",en:"WSUS" },{ id:"troubleshoot",uz:"Muammolarni hal qilish",en:"Troubleshooting" }],
  30: [{ id:"defender-overview",uz:"Defender umumiy",en:"Defender overview" },{ id:"real-time",uz:"Real vaqt himoyasi",en:"Real-time protection" },{ id:"exclusions",uz:"Istisnolar",en:"Exclusions" },{ id:"asr",uz:"ASR qoidalar",en:"ASR rules" }],
  31: [{ id:"firewall-overview",uz:"Firewall umumiy",en:"Firewall overview" },{ id:"profiles",uz:"Profillar",en:"Profiles" },{ id:"rules",uz:"Qoidalar",en:"Rules" },{ id:"advanced",uz:"Kengaytirilgan sozlamalar",en:"Advanced settings" }],
  32: [{ id:"bitlocker-overview",uz:"BitLocker umumiy",en:"BitLocker overview" },{ id:"tpm-bitlocker",uz:"TPM integratsiyasi",en:"TPM integration" },{ id:"recovery",uz:"Tiklash kaliti",en:"Recovery key" },{ id:"manage-bde",uz:"manage-bde",en:"manage-bde" }],
  33: [{ id:"ps-overview",uz:"PowerShell umumiy",en:"PowerShell overview" },{ id:"cmdlets",uz:"Cmdlet'lar",en:"Cmdlets" },{ id:"pipeline",uz:"Pipeline",en:"Pipeline" },{ id:"remoting",uz:"PS Remoting",en:"PS Remoting" }],
  34: [{ id:"rdp-overview",uz:"RDP umumiy",en:"RDP overview" },{ id:"setup",uz:"RDP sozlash",en:"RDP setup" },{ id:"security",uz:"RDP xavfsizlik",en:"RDP security" },{ id:"rdp-attacks",uz:"RDP hujumlar",en:"RDP attacks" }],
  35: [{ id:"net-overview",uz:"Tarmoq umumiy",en:"Network overview" },{ id:"ip-config",uz:"IP sozlamalar",en:"IP configuration" },{ id:"dns",uz:"DNS",en:"DNS" },{ id:"troubleshoot",uz:"Muammolarni hal qilish",en:"Troubleshooting" }],
  36: [{ id:"share-overview",uz:"Ulashish umumiy",en:"File sharing overview" },{ id:"smb",uz:"SMB protokoli",en:"SMB protocol" },{ id:"permissions",uz:"Ulashish ruxsatlari",en:"Share permissions" },{ id:"hidden-shares",uz:"Yashirin ulashishlar",en:"Hidden shares" }],
  37: [{ id:"backup-overview",uz:"Zaxira umumiy",en:"Backup overview" },{ id:"windows-backup",uz:"Windows Backup",en:"Windows Backup" },{ id:"shadow-copy",uz:"Shadow Copy",en:"Shadow Copy" },{ id:"restore",uz:"Tiklash",en:"Restore" }],
};

function LessonTOC({ lessonNum = 1 }) {
  const lang = useLang();
  const meta = LESSON_META[lessonNum] || LESSON_META[1];
  const sections = TOC_SECTIONS[lessonNum] || TOC_SECTIONS[1];
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
          <Row k={lang === "en" ? "Reading" : "O'qish"} v={`~${meta.min} min`} />
          <Row k={lang === "en" ? "Labs" : "Laboratoriya"} v={meta.labs} />
          <Row k={lang === "en" ? "Diagrams" : "Diagrammalar"} v={meta.diagrams} />
        </div>
      </div>
    </aside>
  );
}
function Row({ k, v }) {
  return <div style={{ display: "flex", justifyContent: "space-between" }}><span>{k}</span><span className="mono">{v}</span></div>;
}

const LESSON_META = {
  1:  { min:36, diagrams:9, labs:3, introUz:<><em>Windows arxitekturasi</em> — OS ning to'liq ko'rinishi. User space, kernel space, HAL va Executive qatlamlarini chuqur o'rganasiz.</>, introEn:<><em>Windows architecture</em> — complete OS picture. Deep dive into user space, kernel space, HAL and the Executive layer.</> },
  2:  { min:34, diagrams:7, labs:2, introUz:<><em>Kernel nima?</em> — ntoskrnl.exe ning ichki tuzilishi. Executive, Microkernel, HAL va kernel drayverlari haqida hamma narsani bilib olasiz.</>, introEn:<><em>What is the kernel?</em> — ntoskrnl.exe inner structure. Learn everything about the Executive, Microkernel, HAL and kernel drivers.</> },
  3:  { min:32, diagrams:7, labs:2, introUz:<><em>User mode va Kernel mode</em> — CPU imtiyoz halqalari. Ring 0 vs Ring 3, chegara nima uchun muhim va syscall oqimini o'rganasiz.</>, introEn:<><em>User mode vs Kernel mode</em> — CPU privilege rings. Understand Ring 0 vs Ring 3, why the boundary matters and trace syscall flow.</> },
  4:  { min:36, diagrams:8, labs:2, introUz:<><em>Windows boot jarayoni</em> — UEFI dan login ekranigacha. BIOS/UEFI, MBR/GPT, BOOTMGR, WinLoad va kernel bosqichlarini o'rganasiz.</>, introEn:<><em>Windows boot process</em> — UEFI to login screen. Learn BIOS/UEFI, MBR/GPT, BOOTMGR, WinLoad and kernel initialization phases.</> },
  5:  { min:22, diagrams:5, labs:1, introUz:<><em>BIOS vs UEFI</em> — firmware arxitekturasi. 16-bit BIOS, UEFI fazalari, Secure Boot zanjiri va bypass texnikalarini o'rganasiz.</>, introEn:<><em>BIOS vs UEFI</em> — firmware architecture. Learn 16-bit BIOS, UEFI phases, Secure Boot chain and bypass techniques.</> },
  6:  { min:24, diagrams:5, labs:1, introUz:<><em>Secure Boot</em> — bootkit'lardan himoya. PK/KEK/db/dbx ierarxiyasi, imzo tekshiruvi va Secure Boot bypass usullarini o'rganasiz.</>, introEn:<><em>Secure Boot</em> — protection against bootkits. Learn PK/KEK/db/dbx hierarchy, signature verification and Secure Boot bypass methods.</> },
  7:  { min:26, diagrams:5, labs:1, introUz:<><em>TPM (Trusted Platform Module)</em> — apparat xavfsizlik chipi. PCR banklari, attestatsiya, BitLocker integratsiyasi va TPM hujumlarini o'rganasiz.</>, introEn:<><em>TPM (Trusted Platform Module)</em> — hardware security chip. Learn PCR banks, attestation, BitLocker integration and TPM attacks.</> },
  8:  { min:38, diagrams:8, labs:3, introUz:<><em>Windows Registry</em> — konfiguratsiya ma'lumotlar bazasi. Ierarxik tuzilma, hive fayllar, muhim kalitlar, persistenslik joylari va forensic tahlilni o'rganasiz.</>, introEn:<><em>Windows Registry</em> — configuration database. Learn hierarchical structure, hive files, critical keys, persistence locations and forensic analysis.</> },
  9:  { min:28, diagrams:6, labs:2, introUz:<><em>Fayl tizimlari</em> — VFS va fayl tizimi arxitekturasi. Windows ning turli fayl tizimlarini qanday boshqarishini o'rganasiz.</>, introEn:<><em>File systems</em> — VFS and file system architecture. Learn how Windows manages different file systems.</> },
  10: { min:32, diagrams:7, labs:2, introUz:<><em>NTFS</em> — zamonaviy fayl tizimi chuqur. MFT, atributlar, ADS, EFS, jurnallar va NTFS forensics ni o'rganasiz.</>, introEn:<><em>NTFS</em> — modern file system in depth. Learn MFT, attributes, ADS, EFS, journals and NTFS forensics.</> },
  11: { min:18, diagrams:4, labs:1, introUz:<><em>FAT32</em> — klassik fayl tizimi. FAT jadvali, cluster zanjiri va FAT32 ning cheklovlarini o'rganasiz.</>, introEn:<><em>FAT32</em> — classic file system. Learn the FAT table, cluster chain and FAT32 limitations.</> },
  12: { min:36, diagrams:7, labs:3, introUz:<><em>Jarayonlar</em> — EPROCESS tuzilmasi va jarayon boshqaruvi. PEB, VAD daraxti, jarayon yaratish va in'ektsiya texnikalarini o'rganasiz.</>, introEn:<><em>Processes</em> — EPROCESS structure and process management. Learn PEB, VAD tree, process creation and injection techniques.</> },
  13: { min:28, diagrams:6, labs:2, introUz:<><em>Thread'lar</em> — ETHREAD va Windows rejalashtiruvchisi. Thread lifecycle, TEB, sinxronizatsiya va thread in'ektsiyasini o'rganasiz.</>, introEn:<><em>Threads</em> — ETHREAD and the Windows scheduler. Learn thread lifecycle, TEB, synchronization and thread injection.</> },
  14: { min:24, diagrams:5, labs:1, introUz:<><em>Handle'lar va Ob'ektlar</em> — Windows ob'ekt menejeri. Handle jadvali, ob'ekt turlari, kirish nazorati va handle based hujumlarni o'rganasiz.</>, introEn:<><em>Handles and Objects</em> — Windows Object Manager. Learn handle table, object types, access control and handle-based attacks.</> },
  15: { min:30, diagrams:6, labs:2, introUz:<><em>Servislar</em> — SCM va fon jarayonlari. Servis turlari, xizmat akkauntlari, svchost guruhlari va servis asosidagi persistenslikni o'rganasiz.</>, introEn:<><em>Services</em> — SCM and background processes. Learn service types, service accounts, svchost groups and service-based persistence.</> },
  16: { min:32, diagrams:6, labs:2, introUz:<><em>DLL va Injection</em> — PE tuzilmasi va dinamik yuklash. DLL injection, search order hijacking va aniqlash texnikalarini o'rganasiz.</>, introEn:<><em>DLL and Injection</em> — PE structure and dynamic loading. Learn DLL injection, search order hijacking and detection techniques.</> },
  17: { min:30, diagrams:5, labs:2, introUz:<><em>Windows API</em> — Win32 qatlami va ntdll ko'prigi. API hooking, monitoring va syscall ko'rinishini o'rganasiz.</>, introEn:<><em>Windows API</em> — Win32 layer and ntdll bridge. Learn API hooking, monitoring and the syscall view.</> },
  18: { min:24, diagrams:4, labs:2, introUz:<><em>Event Viewer</em> — Windows hodisa log tizimi. Log arxitekturasi, asosiy Event ID lar, ETW, Sysmon va forensic tahlilni o'rganasiz.</>, introEn:<><em>Event Viewer</em> — Windows event logging system. Learn log architecture, key Event IDs, ETW, Sysmon and forensic analysis.</> },
  19: { min:22, diagrams:4, labs:1, introUz:<><em>Task Scheduler</em> — vazifalarni avtomatlashtirish tizimi. Vazifa arxitekturasi, triggerlar, harakatlar va rejalashtiruvchi asosidagi persistenslikni o'rganasiz.</>, introEn:<><em>Task Scheduler</em> — automating system tasks. Learn task architecture, triggers, actions and scheduler-based persistence techniques.</> },
  20: { min:24, diagrams:4, labs:2, introUz:<><em>Windows log fayllari</em> — EVTX forensics va hodisalarga javob. Tizim log tahlili va IR workflow ni o'rganasiz.</>, introEn:<><em>Windows logs</em> — EVTX forensics and incident response. Learn system log analysis and IR workflow.</> },
  21: { min:24, diagrams:5, labs:2, introUz:<><em>Task Manager</em> — jarayonlar, CPU, xotira va tarmoqni real vaqtda kuzatish. Startup elementlarini boshqarishni o'rganasiz.</>, introEn:<><em>Task Manager</em> — real-time monitoring of processes, CPU, memory and network. Learn to manage startup items.</> },
  22: { min:20, diagrams:4, labs:1, introUz:<><em>Device Manager</em> — qurilma drayverlari va apparat boshqaruvi. Drayver xatoliklarini bartaraf etishni o'rganasiz.</>, introEn:<><em>Device Manager</em> — hardware devices and driver management. Learn to diagnose and fix driver errors.</> },
  23: { min:28, diagrams:5, labs:2, introUz:<><em>Foydalanuvchi hisoblari</em> — mahalliy foydalanuvchilar, guruhlar va profillarni boshqarish. Hisob xavfsizligi asoslarini o'rganasiz.</>, introEn:<><em>User Accounts</em> — managing local users, groups and profiles. Learn the basics of account security.</> },
  24: { min:26, diagrams:5, labs:2, introUz:<><em>User Account Control</em> — UAC mexanizmi, imtiyozlarni oshirish va yaxlitlik darajalari. UAC bypass texnikalarini o'rganasiz.</>, introEn:<><em>User Account Control</em> — UAC mechanism, privilege elevation and integrity levels. Learn UAC bypass techniques.</> },
  25: { min:22, diagrams:4, labs:1, introUz:<><em>Settings va Control Panel</em> — Windows sozlamalar interfeyslari. Tizim konfiguratsiyasining asosiy nuqtalarini o'rganasiz.</>, introEn:<><em>Settings and Control Panel</em> — Windows settings interfaces. Learn the key system configuration points.</> },
  26: { min:20, diagrams:4, labs:1, introUz:<><em>MSConfig</em> — tizim konfiguratsiyasi va yuklash sozlamalari. Servislar va startup elementlarini boshqarishni o'rganasiz.</>, introEn:<><em>MSConfig</em> — system configuration and startup settings. Learn to manage services and startup items.</> },
  27: { min:26, diagrams:5, labs:2, introUz:<><em>Computer Management</em> — markaziy boshqaruv konsoli. Disk, event log, foydalanuvchilar va servislarni bir joydan boshqarishni o'rganasiz.</>, introEn:<><em>Computer Management</em> — central management console. Learn to manage disks, event logs, users and services from one place.</> },
  28: { min:24, diagrams:5, labs:2, introUz:<><em>Resource Monitor</em> — CPU, xotira, disk va tarmoqni batafsil kuzatish. Tizim muammolarini tashxis qilishni o'rganasiz.</>, introEn:<><em>Resource Monitor</em> — detailed monitoring of CPU, memory, disk and network. Learn to diagnose system issues.</> },
  29: { min:18, diagrams:4, labs:1, introUz:<><em>Windows Update</em> — tizim yangilanishlari va yamoqlarni boshqarish. WSUS va yangilanish muammolarini hal qilishni o'rganasiz.</>, introEn:<><em>Windows Update</em> — managing system updates and patches. Learn WSUS and troubleshooting update issues.</> },
  30: { min:26, diagrams:5, labs:2, introUz:<><em>Windows Defender</em> — o'rnatilgan antivirus va real vaqt himoyasi. ASR qoidalari va istisnolarni boshqarishni o'rganasiz.</>, introEn:<><em>Windows Defender</em> — built-in antivirus and real-time protection. Learn to manage ASR rules and exclusions.</> },
  31: { min:28, diagrams:5, labs:2, introUz:<><em>Windows Firewall</em> — tarmoq trafikini filtrlash va qoidalar. Kiruvchi va chiquvchi qoidalarni boshqarishni o'rganasiz.</>, introEn:<><em>Windows Firewall</em> — network traffic filtering and rules. Learn to manage inbound and outbound firewall rules.</> },
  32: { min:24, diagrams:4, labs:1, introUz:<><em>BitLocker</em> — disk shifrlash va ma'lumotlarni himoya qilish. TPM bilan integratsiya va tiklash kalitlarini o'rganasiz.</>, introEn:<><em>BitLocker</em> — disk encryption and data protection. Learn TPM integration and recovery key management.</> },
  33: { min:30, diagrams:5, labs:2, introUz:<><em>PowerShell asoslari</em> — cmdlet'lar, pipeline va PS Remoting. Tizimni buyruqlar qatori orqali avtomatlashtirish asoslarini o'rganasiz.</>, introEn:<><em>PowerShell Basics</em> — cmdlets, pipeline and PS Remoting. Learn the fundamentals of automating system management from the command line.</> },
  34: { min:22, diagrams:5, labs:2, introUz:<><em>Remote Desktop (RDP)</em> — masofaviy ish stoli ulanishi va boshqaruvi. RDP xavfsizligi va hujum vektorlarini o'rganasiz.</>, introEn:<><em>Remote Desktop (RDP)</em> — remote desktop connection and management. Learn RDP security and attack vectors.</> },
  35: { min:28, diagrams:5, labs:2, introUz:<><em>Tarmoq sozlamalari</em> — IP, DNS va adapter konfiguratsiyasi. Tarmoq muammolarini tashxis qilishni o'rganasiz.</>, introEn:<><em>Network Configuration</em> — IP, DNS and adapter configuration. Learn to diagnose network issues.</> },
  36: { min:24, diagrams:4, labs:2, introUz:<><em>Fayl ulashish</em> — SMB protokoli va shared folder ruxsatnomalari. Yashirin ulashishlar va xavfsizlik muammolarini o'rganasiz.</>, introEn:<><em>File Sharing</em> — SMB protocol and shared folder permissions. Learn about hidden shares and security implications.</> },
  37: { min:20, diagrams:4, labs:1, introUz:<><em>Zaxira nusxa va tiklash</em> — Windows Backup, Shadow Copy va tiklash strategiyalari. Ma'lumotlarni yo'qotmaslik uchun zarur ko'nikmalar.</>, introEn:<><em>Backup and Restore</em> — Windows Backup, Shadow Copy and recovery strategies. Essential skills to prevent data loss.</> },
};

// ─────────────────────────────────────────────────────────────
function LessonHero({ lesson, lessonNum = 1, totalTimeSec = 0 }) {
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
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <span className="chip"><Icon name="clock" size={11} /> {meta.min} min</span>
          <span className="chip chip-blue"><Icon name="graph" size={11} /> {lang === "en" ? `${meta.diagrams} diagrams` : `${meta.diagrams} diagramma`}</span>
          <span className="chip chip-yellow"><Icon name="warning" size={11} /> {lang === "en" ? "foundational" : "asosiy"}</span>
          <span className="chip" style={{
            background: "rgba(0,255,136,0.08)",
            border: "1px solid rgba(0,255,136,0.3)",
            color: "var(--accent)",
            fontFamily: "var(--font-mono)",
            fontVariantNumeric: "tabular-nums",
            animation: "none",
          }}>
            <Icon name="clock" size={11} />
            &nbsp;{lang === "en" ? "Time spent:" : "Vaqt:"} <strong>{fmtTime(totalTimeSec, lang)}</strong>
          </span>
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

      {/* ── 2.2 User mode vs Kernel mode & CPU rings ── */}
      <h3 style={subhead}>{lang === "en" ? "2.2 — User mode, Kernel mode & CPU privilege rings" : "2.2 — User mode, Kernel mode va CPU imtiyoz halqalari"}</h3>
      <P>
        {lang === "en"
          ? <>The x86-64 CPU architecture defines <Em>four privilege rings</Em>: ring 0 (most privileged) through ring 3 (least privileged). Windows uses only two: <Em>ring 0</Em> (kernel mode) for the OS, and <Em>ring 3</Em> (user mode) for every application. Rings 1 and 2 were designed for OS subsystems and device drivers in older systems (like OS/2); Windows NT deliberately skips them — all drivers run at full ring 0 privilege.</>
          : <>x86-64 CPU arxitekturasi <Em>to'rtta imtiyoz halqasini</Em> belgilaydi: ring 0 (eng imtiyozli) dan ring 3 (eng kam imtiyozli) gacha. Windows faqat ikkitasini ishlatadi: <Em>ring 0</Em> (kernel mode) — OS uchun, va <Em>ring 3</Em> (user mode) — har bir ilova uchun. Ring 1 va ring 2 eski tizimlarda (OS/2 kabi) OS quyi tizimlari va drayverlar uchun mo'ljallangan; Windows NT ularni ataylab o'tkazib yuboradi — barcha drayverlar to'liq ring 0 imtiyozi bilan ishlaydi.</>}
      </P>
      <Callout color="var(--c-attack)" icon="skull" titleUz="Kernel mode xatosi = BSOD" titleEn="Kernel mode crash = BSOD">
        {lang === "en"
          ? <>When user-mode (ring 3) code crashes — say, Notepad has a bug — Windows simply terminates that one process. The rest of the system keeps running untouched. But when kernel-mode (ring 0) code crashes — a driver dereferences a null pointer, a timer callback corrupts the stack — there is no higher authority to contain it. The entire machine halts: <Em>Bug Check (Blue Screen of Death)</Em>. The system writes a memory dump to disk and reboots. This is why driver quality is the #1 stability factor in Windows — and why Microsoft requires all third-party drivers to be digitally signed.</>
          : <>User mode (ring 3) kodi qulab tushganda — masalan, Notepad'da xato bo'lsa — Windows faqat o'sha jarayonni o'chiradi. Tizimning qolgan qismi ta'sirlanmasdan ishlashda davom etadi. Lekin kernel mode (ring 0) kodi qulab tushganda — drayver null ko'rsatgichni dereference qiladi, taymer callback stack'ni buzadi — uni ushlaydigan yuqori hokimiyat yo'q. Butun mashina to'xtaydi: <Em>Bug Check (Ko'k Ekran O'limi — BSOD)</Em>. Tizim xotira dumpini diskka yozadi va qayta ishga tushadi. Shuning uchun drayver sifati Windows'dagi №1 barqarorlik omili — va Microsoft nima uchun barcha uchinchi tomon drayverlarni raqamli imzolashni talab qiladi.</>}
      </Callout>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10, marginTop: 16, maxWidth: 640, margin: "16px auto 0" }}>
        {(lang === "en" ? [
          { ring: "Ring 0", label: "Kernel mode", color: "var(--c-attack)", bg: "rgba(255,58,94,0.07)", border: "rgba(255,58,94,0.35)",
            who: "ntoskrnl.exe, hal.dll, all .sys drivers",
            can: "Any CPU instruction (HLT, LGDT, MOV CR0, RDMSR, CLI/STI, IN/OUT). Direct hardware access. Full memory access.",
            crash: "Crash → entire machine halts (BSOD). No recovery possible." },
          { ring: "Ring 1", label: "Not used by Windows", color: "var(--text-3)", bg: "var(--bg-2)", border: "var(--border)",
            who: "—",
            can: "Designed for OS subsystems (OS/2, original VMS design). Windows NT deliberately skips rings 1 and 2 — all drivers run at full ring 0 instead.",
            crash: "N/A" },
          { ring: "Ring 2", label: "Not used by Windows", color: "var(--text-3)", bg: "var(--bg-2)", border: "var(--border)",
            who: "—",
            can: "Originally for device drivers in older OS designs. Windows skips this entirely.",
            crash: "N/A" },
          { ring: "Ring 3", label: "User mode", color: "var(--c-user)", bg: "rgba(255,145,69,0.06)", border: "rgba(255,145,69,0.3)",
            who: "chrome.exe, notepad.exe, winword.exe — every regular application",
            can: "Math, logic, Win32 API calls, VirtualAlloc(). Cannot touch hardware directly. Must cross to ring 0 via SYSCALL to do anything privileged.",
            crash: "Crash → only that process dies. Other apps and the OS continue running." },
        ] : [
          { ring: "Ring 0", label: "Kernel mode", color: "var(--c-attack)", bg: "rgba(255,58,94,0.07)", border: "rgba(255,58,94,0.35)",
            who: "ntoskrnl.exe, hal.dll, barcha .sys drayverlar",
            can: "Har qanday CPU buyrug'i (HLT, LGDT, MOV CR0, RDMSR, CLI/STI, IN/OUT). To'g'ridan-to'g'ri hardware kirishi. To'liq xotira kirishi.",
            crash: "Xato → butun mashina to'xtaydi (BSOD). Tiklash mumkin emas." },
          { ring: "Ring 1", label: "Windows ishlatmaydi", color: "var(--text-3)", bg: "var(--bg-2)", border: "var(--border)",
            who: "—",
            can: "OS quyi tizimlari uchun mo'ljallangan (OS/2, asl VMS dizayni). Windows NT ring 1 va ring 2 ni ataylab o'tkazib yuboradi — barcha drayverlar to'liq ring 0'da ishlaydi.",
            crash: "Tegishli emas" },
          { ring: "Ring 2", label: "Windows ishlatmaydi", color: "var(--text-3)", bg: "var(--bg-2)", border: "var(--border)",
            who: "—",
            can: "Eski OS dizaynlarida qurilma drayverlari uchun. Windows buni butunlay o'tkazib yuboradi.",
            crash: "Tegishli emas" },
          { ring: "Ring 3", label: "User mode", color: "var(--c-user)", bg: "rgba(255,145,69,0.06)", border: "rgba(255,145,69,0.3)",
            who: "chrome.exe, notepad.exe, winword.exe — har bir oddiy ilova",
            can: "Matematika, mantiq, Win32 API chaqiruvlari, VirtualAlloc(). Hardware ga to'g'ridan-to'g'ri tegalay olmaydi. Imtiyozli ishlash uchun SYSCALL orqali ring 0 ga o'tishi kerak.",
            crash: "Xato → faqat o'sha jarayon o'ladi. Boshqa ilovalar va OS ishlashda davom etadi." },
        ]).map((r, i) => (
          <div key={i} style={{ padding: "14px 18px", borderRadius: 10, background: r.bg, border: `1px solid ${r.border}`, borderLeft: `4px solid ${r.color}`, opacity: r.color === "var(--text-3)" ? 0.6 : 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, color: r.color, minWidth: 56 }}>{r.ring}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: r.color }}>{r.label}</div>
              <div style={{ marginLeft: "auto", fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-3)" }}>{r.who}</div>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-1)", lineHeight: 1.55, marginBottom: r.crash !== "N/A" && r.crash !== "Tegishli emas" ? 6 : 0 }}>{r.can}</div>
            {r.crash !== "N/A" && r.crash !== "Tegishli emas" && (
              <div style={{ fontSize: 11.5, color: r.color, marginTop: 4 }}>⚠ {r.crash}</div>
            )}
          </div>
        ))}
      </div>
      <Callout color="var(--c-system)" icon="info" titleUz="Nima uchun ring 1 va 2 ishlatilmaydi?" titleEn="Why skip rings 1 and 2?">
        {lang === "en"
          ? <>Dave Cutler's NT design philosophy was simplicity: a clean two-layer model (kernel vs user) is easier to secure and verify than a four-layer model. Rings 1 and 2 were used in older x86 OSes (OS/2, NetWare) for device drivers — but maintaining three privilege boundaries added complexity without enough security benefit. Windows NT put all drivers in ring 0 and added driver signing instead.</>
          : <>Dave Cutlerning NT dizayn falsafasi soddalik edi: to'rt qatlamli modeldan ancha sodda va xavfsizroq ikki qatlamli model (kernel vs user). Ring 1 va 2 eski x86 OS'larda (OS/2, NetWare) qurilma drayverlari uchun ishlatilgan, ammo uch imtiyoz chegarasini saqlash murakkablikni orttirib, xavfsizlik foydasini oshirmagan. Windows NT barcha drayverlarni ring 0 ga joylashtirdi va buning o'rniga drayver imzolashni joriy etdi.</>}
      </Callout>

    </section>
  );
}
const subhead = { fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, margin: "28px 0 8px", letterSpacing: "-0.01em" };


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
      <P>
        {lang === "en"
          ? <>Modern systems use <Term>Secure Boot</Term> to cryptographically verify each bootloader stage before execution — ensuring no tampered code can run during startup. You will explore the full key hierarchy, chain of trust, and real-world bypass techniques in <Em>Lesson 6</Em>.</>
          : <>Zamonaviy tizimlar <Term>Secure Boot</Term> dan foydalanib, har bir bootloader bosqichini bajarishdan oldin kriptografik tekshiruvdan o'tkazadi — ishga tushish paytida hech qanday buzilgan kod ishga tushmasligi ta'minlanadi. To'liq kalit ierarxiyasi, ishonch zanjiri va haqiqiy bypass texnikalarini <Em>6-darsda</Em> o'rganasiz.</>}
      </P>

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

// ─────────────────────────────────────────────────────────────
function LessonNextNav({ setRoute, onQuizStart, lessonNum, sectionNum = 1, quizUnlocked, totalTimeSec, quizPassed }) {
  const lang = useLang();
  const meta = LESSON_META[lessonNum] || LESSON_META[1];
  const neededSec = (meta.min || 10) * 60;
  const remainSec = Math.max(0, neededSec - (totalTimeSec || 0));
  const remainMin = Math.floor(remainSec / 60);
  const remainS = remainSec % 60;
  const nextLesson = lessonNum < 37 ? lessonNum + 1 : null;
  const nextSec = nextLesson ? (nextLesson <= 20 ? 1 : 2) : sectionNum;

  return (
    <div style={{ marginTop: 60, paddingTop: 32, borderTop: "1px solid var(--border)" }}>
      {quizPassed && nextLesson && (
        <div style={{
          marginBottom: 20, padding: "14px 20px",
          background: "rgba(0,255,136,0.07)", border: "1px solid var(--accent-border)",
          borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Icon name="check" size={16} style={{ color: "var(--accent)" }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 13.5, color: "var(--accent)" }}>
                {lang === "en" ? "Quiz passed!" : "Test muvaffaqiyatli topshirildi!"}
              </div>
              <div style={{ fontSize: 11.5, color: "var(--text-2)", marginTop: 1 }}>
                {lang === "en" ? "You can now move to the next lesson." : "Endi keyingi darsga o'tishingiz mumkin."}
              </div>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => setRoute({ name: "lesson", lesson: nextLesson })} style={{ flexShrink: 0 }}>
            {lang === "en" ? "Next lesson" : "Keyingi darsga"} <Icon name="arrow-right" size={14} />
          </button>
        </div>
      )}
      {quizPassed && !nextLesson && (
        <div style={{
          marginBottom: 20, padding: "14px 20px",
          background: "rgba(0,255,136,0.07)", border: "1px solid var(--accent-border)",
          borderRadius: 12, display: "flex", alignItems: "center", gap: 12,
        }}>
          <Icon name="trophy" size={18} style={{ color: "var(--accent)" }} />
          <div style={{ fontWeight: 600, fontSize: 13.5, color: "var(--accent)" }}>
            {lang === "en" ? "Section complete! All lessons done." : "Bo'lim tugadi! Barcha darslar bajarildi."}
          </div>
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 16, alignItems: "center" }}>
        <button className="btn" onClick={() => setRoute({ name: "section", section: sectionNum })} style={{ justifySelf: "start" }}>
          <Icon name="arrow-left" size={14} /> {lang === "en" ? "Section overview" : "Bo'limga qaytish"}
        </button>
        <div style={{ textAlign: "center" }}>
          <div className="eyebrow">// {lang === "en" ? "LESSON_COMPLETE" : "DARS_TUGADI"}</div>
          {!quizUnlocked && (
            <div style={{ fontSize: 11, color: "var(--c-warn)", marginTop: 4, fontFamily: "var(--font-mono)" }}>
              {lang === "en"
                ? `${remainMin}m ${String(remainS).padStart(2,"0")}s more to unlock quiz`
                : `Test ochilishi uchun yana ${remainMin}m ${String(remainS).padStart(2,"0")}s qoldi`}
            </div>
          )}
          {quizUnlocked && !quizPassed && (
            <div style={{ color: "var(--text-2)", fontSize: 12, marginTop: 4 }}>
              {lang === "en" ? "Pass the quiz to unlock the next lesson" : "Keyingi darsga o'tish uchun testni topshiring"}
            </div>
          )}
        </div>
        <button
          className="btn btn-primary"
          onClick={quizUnlocked ? onQuizStart : undefined}
          disabled={!quizUnlocked}
          style={{
            justifySelf: "end",
            opacity: quizUnlocked ? 1 : 0.45,
            cursor: quizUnlocked ? "pointer" : "not-allowed",
          }}>
          {quizUnlocked
            ? <><Icon name="target" size={14} /> {lang === "en" ? "Start the quiz" : "Testni boshlash"} <Icon name="arrow-right" size={14} /></>
            : <><Icon name="lock" size={14} /> {lang === "en" ? "Quiz locked" : "Test qulflangan"}</>}
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
            { icon: "send", title: "DPC — Deferred Procedure Calls", desc: "When a hardware interrupt fires, the CPU immediately stops what it's doing — potentially in the middle of a draw call or disk write. The interrupt handler must finish in microseconds. Heavy work (processing a network packet, completing a DMA transfer) is deferred to a DPC queue that runs at a lower interrupt priority level (DISPATCH_LEVEL). Think of it as a to-do list the kernel processes right after handling the immediate interrupt." },
          ] : [
            { icon: "clock", title: "Thread'larni rejalashtirish", desc: "Qaysi thread qaysi CPU yadroda, qancha vaqt (kvant) ishlashini hal qiladi. 0–31 prioritet darajalarini ishlatadi. Real vaqtli thread'lar (16–31) har doim oddiy thread'larni (0–15) almashtiradi. Rejalashtirgich taymer uzilishi orqali ishlaydi (odatda ish stolida har 15.6 ms, serverda 1 ms)." },
            { icon: "zap", title: "Uzilish va istisno boshqarish", desc: "IDT (Uzilish Tasviri Jadvali) ni boshqaradi — har bir hardware signali va CPU istisnosi ishlov beruvchi funksiyaga xaritalangan 256 ta yozuvli jadval. Klaviaturangiz signal yuborganda, CPU IRQ1 uchun IDT yozuvini qidirib topadi va klaviatura uzilish ishlovchisiga sakraydi." },
            { icon: "layers", title: "CPU sinxronizatsiyasi (ko'p protsessorli)", desc: "Ko'p yadroli mashinada bir nechta CPU kernel ma'lumotlar tuzilmalarini baham ko'radi. Microkernel bir vaqtning o'zida kirishning ma'lumotlarni buzishiga yo'l qo'ymaslik uchun spinlock'lar va dispatcher lock'lardan foydalanadi. Bu noto'g'ri qilinsa, takrorlanmaydigan xira buzilish xatolariga olib keladi." },
            { icon: "send", title: "DPC — Kechiktirilgan Protsedura Chaqiruvlari", desc: "Hardware uzilishi yonganida, CPU darhol nima qilayotganini to'xtatadi — rasm chizish yoki disk yozish o'rtasida ham. Uzilish ishlovchisi mikrosoniyalarda tugashi kerak. Og'ir ish (tarmoq paketini qayta ishlash, DMA uzatishni yakunlash) DPC navbatiga kechiktiriladi va u pastroq uzilish prioritet darajasida (DISPATCH_LEVEL) ishlaydi. Bu kernelning tezkor uzilishni boshqarganidan keyin bajaradigan 'vazifalar ro'yxati' deb o'ylang." },
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
      <Callout color="var(--c-err)" icon="warning" titleEn="AppInit_DLLs — the nuclear persistence option" titleUz="">
        Any DLL listed under AppInit_DLLs is injected into every process that loads user32.dll — which is almost every GUI application. Malware like Carberp, Zeus, and Flame abused this. Windows 8+ requires the DLL to be signed when Secure Boot is active, but many legacy systems still have this vector open.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.6 — Monitoring the Registry</h3>
      <P><strong>Sysmon Event ID 13 (RegistryValueSet):</strong> Logs registry value write operations. Configure Sysmon to monitor the Run/RunOnce keys, Services ImagePath, AppInit_DLLs — any write to these is immediately suspicious. Pair with Event ID 12 (key creation) and 14 (key rename — a trick to evade simple value monitors).</P>
      <P><strong>Process Monitor (Sysinternals):</strong> Real-time registry monitoring with full stack traces. Filter by path (e.g., "Path contains Run") and see exactly which process, which thread, and what stack called the write. Essential for malware analysis and incident response.</P>
      <P><strong>Autoruns (Sysinternals):</strong> The definitive tool for finding persistence. Scans 100+ autostart locations in the registry (and filesystem), shows the signed/unsigned status of each binary, highlights entries with VirusTotal hits. Run as Administrator and check "Hide Microsoft entries" to focus on third-party items.</P>
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
      <Callout color="var(--c-err)" icon="warning" titleEn="ADS abuse by malware" titleUz="">
        Malware families including Poweliks, Ursnif, and APT tools have used ADS to hide payloads inside legitimate system files. A dropper can write a PowerShell payload into an ADS then create a scheduled task that reads and executes it: <code>wscript.exe "C:\Windows\explorer.exe:payload.vbs"</code>.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.4 — NTFS Permissions vs Share Permissions</h3>
      <P><strong>NTFS Permissions:</strong> Applied by ntfs.sys at the file system level. Stored as a Security Descriptor with a DACL containing ACEs. Each ACE specifies a SID and access rights: Read Data, Write Data, Execute, Delete, Change Permissions, Take Ownership. Apply whether access is local or over the network.</P>
      <P><strong>Share Permissions:</strong> Applied by the Server service (srv2.sys) at the SMB level. Coarser: Full Control, Change, or Read. Only apply to network access — irrelevant for local console access.</P>
      <P><strong>Effective rule:</strong> <code style={{fontFamily:"var(--font-mono)",fontSize:12,background:"rgba(255,255,255,0.06)",padding:"1px 6px",borderRadius:4}}>Effective = NTFS ∩ Share</code> — the more restrictive wins. Best practice: set Share Permissions to "Everyone — Full Control" and control access entirely through NTFS ACLs.</P>

      <h3 className="mono" style={{color:"var(--c-warn)",marginTop:28}}>// PERMISSION TURLARI</h3>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["#","Permission","Description","Files","Folders"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["1","Full Control","Everything — ownership, modify, delete, grant permissions","✔ Read, Write, Execute, Delete, Change perms, Take ownership","✔ All above + delete subfolders & files"],
            ["2","Modify","Read, write, delete (cannot change ownership)","✔ Read, write, delete","✔ Read, write, delete contents"],
            ["3","Read & Execute","Read and run (.exe launch)","✔ Read + run executables","✔ List + traverse folders"],
            ["4","List Folder Contents","View folder contents only (folders only)","—","✔ List files/subfolders only"],
            ["5","Read","Read only","✔ Open & view","✔ List contents"],
            ["6","Write","Write only","✔ Create/modify","✔ Create files & subfolders"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",
              color: j===0?"var(--c-warn)": j===1?"var(--accent)":"var(--text-1)",
              fontFamily: j<2?"var(--font-mono)":"inherit",
              fontSize: j<2?12:13
            }}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>
      <Callout color="var(--c-warn)" icon="warning" titleEn="Deny overrides Allow" titleUz="">
        If a user belongs to two groups — one with <strong>Allow</strong> and one with <strong>Deny</strong> — <strong>Deny always wins</strong>. Use Deny sparingly; prefer removing Allow instead. Also: <em>Full Control</em> includes the right to change permissions and take ownership — never give it to untrusted users.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.5 — Journaling: $LogFile and $UsnJrnl</h3>
      <P><strong>$LogFile</strong> is NTFS's <Term>write-ahead journal</Term>. Before any metadata change, NTFS writes the intended change to $LogFile first. If the system crashes mid-operation, on next boot NTFS replays or rolls back incomplete transactions. Typically 64MB, circular, on every NTFS volume.</P>
      <P><strong>$UsnJrnl</strong> (Change Journal) records every change to every file/directory: creation, deletion, rename, modification, security change. From a forensics perspective, $UsnJrnl is a goldmine — it shows the history of all file changes, even after files are deleted, until the circular journal wraps around.</P>

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

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.3 — NTFS Ruxsatlari vs Ulashish Ruxsatlari</h3>
      <P><strong>NTFS Ruxsatlari:</strong> ntfs.sys tomonidan ta'minlanadi. DACL va ACElardan iborat Xavfsizlik Tavsiflovchisi sifatida saqlanadi. Mahalliy yoki tarmoq kirishida amal qiladi.</P>
      <P><strong>Ulashish Ruxsatlari:</strong> SMB darajasida qo'llaniladi. Faqat tarmoq kirishiga tegishli. <code style={{fontFamily:"var(--font-mono)",fontSize:12,background:"rgba(255,255,255,0.06)",padding:"1px 6px",borderRadius:4}}>Samarali = NTFS ∩ Ulashish</code> — qattiqroq g'alaba qozonadi. Eng yaxshi amaliyot: Ulashish Ruxsatlarini "Hamma — To'liq" ga o'rnating va kirishni to'liq NTFS ACLlar orqali boshqaring.</P>

      <h3 className="mono" style={{color:"var(--c-warn)",marginTop:28}}>// RUXSATNOMA TURLARI</h3>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["#","Ruxsatnoma","Tavsif","Fayllar","Papkalar"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["1","Full Control","Hamma narsa — egalik, o'zgartirish, o'chirish, ruxsat berish","✔ O'qish, yozish, bajarish, o'chirish, ruxsat o'zgartirish, egalikni olish","✔ Yuqoridagilar + ichki fayllar va papkalarni o'chirish"],
            ["2","Modify","O'qish, yozish, o'chirish (egalikni o'zgartira olmaydi)","✔ O'qish, yozish, o'chirish","✔ O'qish, yozish, tarkibini o'chirish"],
            ["3","Read & Execute","O'qish va ishga tushirish (.exe)","✔ O'qish + bajariluvchi fayllarni ishga tushirish","✔ Ro'yxat + papkalarni bosib o'tish"],
            ["4","List Folder Contents","Faqat papka tarkibini ko'rish (faqat papkalar uchun)","—","✔ Faqat fayl va ichki papkalarni ro'yxatlash"],
            ["5","Read","Faqat o'qish","✔ Ochish va ko'rish","✔ Tarkibni ro'yxatlash"],
            ["6","Write","Faqat yozish","✔ Yaratish / o'zgartirish","✔ Fayl va ichki papkalar yaratish"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",
              color: j===0?"var(--c-warn)": j===1?"var(--accent)":"var(--text-1)",
              fontFamily: j<2?"var(--font-mono)":"inherit",
              fontSize: j<2?12:13
            }}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>
      <Callout color="var(--c-warn)" icon="warning" titleUz="Deny (taqiqlash) har doim Allow (ruxsat)dan ustun turadi" titleEn="">
        Agar foydalanuvchi ikki guruhga tegishli bo'lsa — biri <strong>Allow</strong>, ikkinchisi <strong>Deny</strong> bilan — <strong>Deny har doim g'alaba qozonadi</strong>. Deny ni ehtiyotkorlik bilan ishlating; buning o'rniga Allow ni olib tashlash afzal. Shuningdek: <em>Full Control</em> ruxsatlarni o'zgartirish va egalikni olish huquqini o'z ichiga oladi — uni ishonchsiz foydalanuvchilarga hech qachon bermang.
      </Callout>

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
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="Jarayonlar — Bajarilish Konteyneri" en="" />
      <P><Term>Jarayon (Process)</Term> — Windows'ning izolyatsiyaning asosiy birligi. Kod emas, thread lar ishlaydi. Jarayon — bajariladigan dasturni o'rab turgan <Em>konteyner</Em>: o'zining virtual manzil fazosi (bir jarayon boshqasining xotirasini o'qiy olmaydi), o'zining handle jadvali (fayl, mutex kabi yadro ob'ektlariga havolalar), kirish tokeni (jarayonga nima ruxsat berilgan) va kamida bitta thread. Notepad.exe ni ikki marta bosganingizda, Windows yadrada jarayon ob'ektini yaratadi, 128 TB virtual manzil fazosini ajratadi, bajariladigan faylni unga moslashtiradi va birinchi thread ni yaratadi.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.1 — EPROCESS: Yadro Tuzilmasi</h3>
      <P>Har bir jarayon yadrada <Term>EPROCESS</Term> tuzilmasi sifatida ifodalanadi — paged bo'lmagan pooldan ajratilgan katta, qisman noaniq xotira bloki. U yadroning jarayonni boshqarishi uchun kerak bo'lgan hamma narsani o'z ichiga oladi.</P>
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
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="Thread'lar — Bajarilish Birligi" en="" />
      <P><Term>Thread</Term> — CPU rejalashtiruvchisi haqiqatda ishlatadigan birlik. Jarayon izolyatsiya konteyneri bo'lsa, thread — kod bo'ylab harakat qiladigan ko'rsatma ko'rsatkichi + registrlar holati + stek. Jarayonda kamida bitta thread bo'lishi kerak, lekin minglab bo'lishi mumkin. Jarayon ichidagi barcha thread lar bir xil virtual manzil fazosi, bir xil handle jadvali va bir xil kirish tokenini baham ko'radi — lekin har bir thread ning o'z <Em>steki</Em>, o'z <Em>CPU registrlari</Em> (kontekst almashish paytida CONTEXT sifatida saqlanadi) va o'z <Em>Thread Muhit Bloki (TEB)</Em> bor.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.1 — ETHREAD va TEB</h3>
      <P>Har bir thread yadrada <Term>ETHREAD</Term> tuzilmasi sifatida ifodalanadi. <Term>TEB (Thread Muhit Bloki)</Term> user-mode xotirasida joylashgan va x64 da <code style={{fontFamily:"var(--font-mono)",fontSize:12,background:"rgba(255,255,255,0.06)",padding:"1px 6px",borderRadius:4}}>GS</code> segment registri orqali thread ning o'ziga kirish mumkin. Shellcode ko'pincha GS:[0x60] dan PEB topib, yuklangan DLL larni Windows API chaqiruvisiz topadi ("PEB yurishi") — bu antivirus tomonidan joylashtirilgan IAT hook larini ishga tushirmaslik uchun.</P>

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


      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.6 — Kerberos vs NTLM Authentication</h3>
      <P>Windows uses two main authentication protocols: <Term>NTLM</Term> (legacy, challenge-response, works without a domain) and <Term>Kerberos</Term> (modern, ticket-based, requires a domain and KDC). Domain-joined systems prefer Kerberos; NTLM is used as a fallback.</P>

      <div style={{overflowX:"auto",marginTop:10}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Feature","NTLM","Kerberos"].map((h,i)=><th key={i} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-3)",fontWeight:600,fontFamily:"var(--font-mono)",fontSize:10}}>{h}</th>)}</tr></thead>
          <tbody>
            {[
              ["Type","Challenge-response (3 messages)","Ticket-based (AS + TGS + AP exchange)"],
              ["Requires DC?","No — works on standalone machines","Yes — needs KDC (Domain Controller)"],
              ["Mutual auth","No — only server verifies client","Yes — client and server verify each other"],
              ["Replay protection","Weak (challenge can be relayed)","Strong (timestamps + nonce)"],
              ["Main attack","Pass-the-Hash, NTLM relay, Responder","Kerberoasting, AS-REP roasting, Pass-the-Ticket, Golden/Silver Ticket"],
              ["Used when","No domain, SMB fallback, local auth","Domain-joined, Active Directory services"],
            ].map((r,i)=>(
              <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.01)"}}>
                {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontSize:12}}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{fontSize:13,color:"var(--text-2)",margin:"16px 0 8px",fontWeight:500}}>Kerberos Authentication Flow (Domain environment):</p>
      <img src="uploads/Screenshot_2026-05-15_15_19_02.png"
           alt="Kerberos Authentication Flow — AS Exchange, TGS Exchange, Service Access"
           style={{width:"100%",borderRadius:8,border:"1px solid var(--border)",marginBottom:14,display:"block"}} />
      <div style={{fontSize:11,color:"var(--text-3)",fontFamily:"var(--font-mono)",marginBottom:16,textAlign:"center"}}>
        Kerberos: User → KDC (AS-REQ/AS-REP → TGT) → KDC (TGS-REQ/TGS-REP → Service Ticket) → Service (AP-REQ → Session)
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,margin:"14px 0"}}>
        {[
          {t:"AS Exchange (Step 1)",c:"var(--accent)",items:["Client sends AS-REQ (preauth: timestamp encrypted with user's password hash)","KDC verifies, issues TGT (Ticket Granting Ticket) + session key","TGT encrypted with KDC's krbtgt account hash — client cannot decrypt it"]},
          {t:"TGS Exchange (Step 2)",c:"var(--c-auth)",items:["Client sends TGS-REQ: TGT + SPN (Service Principal Name, e.g. MSSQL/SvcDB)","KDC decrypts TGT, issues Service Ticket encrypted with target service's account hash","Client still cannot decrypt — only the service can"]},
          {t:"AP Exchange (Step 3)",c:"var(--c-warn)",items:["Client sends AP-REQ: Service Ticket to the target service","Service decrypts ticket with its own hash — verifies client identity","Mutual auth: service sends AP-REP proving it knew the session key"]},
        ].map((card,i)=>(
          <div key={i} style={{padding:14,background:`${card.c}08`,border:`1px solid ${card.c}30`,borderRadius:10}}>
            <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:card.c,marginBottom:8}}>{card.t}</div>
            <ul style={{margin:0,paddingLeft:16,fontSize:12,color:"var(--text-1)",lineHeight:1.7}}>{card.items.map((item,j)=><li key={j}>{item}</li>)}</ul>
          </div>
        ))}
      </div>

      <Callout color="var(--c-attack)" icon="warning" titleEn="Kerberos Attack Techniques" titleUz="">
        <strong>Kerberoasting:</strong> Any domain user can request a Service Ticket for any SPN. The ticket is encrypted with the service account's hash — crack it offline. Target: service accounts with weak passwords.<br/>
        <strong>AS-REP Roasting:</strong> Accounts with "Do not require Kerberos pre-authentication" — request an AS-REP without knowing the password, crack the encrypted blob.<br/>
        <strong>Pass-the-Ticket:</strong> Export a TGT or Service Ticket from memory (mimikatz sekurlsa::tickets) and inject it into another session.<br/>
        <strong>Golden Ticket:</strong> Forge TGTs using the krbtgt account hash (dumped from DC) — grants domain persistence for years.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.8 — Practical Commands</h3>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="Handle'lar — Kernel Ob'ektlariga Murojaat" en="" />
      <P>A <Term>handle</Term> — jarayon kernel ob'ektiga murojaat qilish uchun foydalanadigan noaniq 32-bitli son. Kod <code style={{fontFamily:"var(--font-mono)",fontSize:12,background:"rgba(255,255,255,0.06)",padding:"1px 6px",borderRadius:4}}>CreateFile()</code> chaqirganda, kernel ichki <em>fayl ob'ekti</em> yaratadi, uni jarayonning <em>handle jadvaliga</em> joylashtiradi va foydalanuvchi rejimiga kichik son (4, 8, 12, …) qaytaradi. Siz kernel ob'ektiga to'g'ridan-to'g'ri tegmaysiz — handleni keyingi API chaqiruvlarga (<code>ReadFile</code>, <code>CloseHandle</code> va h.k.) uzatasiz va kernel uni ichkarida ob'ektga moslashtiradi. Bu bilvosita murojaat izolyatsiyani ta'minlaydi (jarayonlar bir-birining ob'ektlariga to'g'ridan-to'g'ri murojaat qila olmaydi), havolalarni sanashni ta'minlaydi (ob'ekt barcha handlelar yopilgunga qadar yashaydi) va xavfsizlikni tekshirishni ta'minlaydi (kirish huquqlari handle ochilganda tekshiriladi, har bir foydalanishda emas).</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.1 — Ob'ekt Menejeri va OBJECT_HEADER</h3>
      <P>Har bir kernel ob'ekti kernel xotirasida <Term>OBJECT_HEADER</Term> tuzilmasi bilan boshlanadi. Ob'ekt Menejeri (ntoskrnl.exe dagi <code>ObXxx</code> routinelari) bu ob'ektlarning yaratilishi, havolalarni sanash va yo'q qilinishini boshqaradi.</P>
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
    </section>
  );
}


// ─────────────────────────────────────────────────────────────
function SectionWinIntro() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="What is Windows?" uz="" />
      <P>
        <Term>Windows</Term> is an operating system (OS) developed by Microsoft.
        An OS is the software layer between your hardware and your apps — it manages
        memory, storage, input devices, and the graphical interface you interact with every day.
        Windows is the most widely used desktop OS on Earth, running on over <Em>1.5 billion</Em> active devices.
      </P>
      <H2 num="§2" en="What Does Windows Do?" uz="" />
      <P>Windows handles five core responsibilities:</P>
      <ul>
        <li><Term>Process management</Term> — runs and schedules programs</li>
        <li><Term>Memory management</Term> — allocates RAM to each app</li>
        <li><Term>File system</Term> — organises data on drives (NTFS)</li>
        <li><Term>Device drivers</Term> — lets hardware talk to software</li>
        <li><Term>Security</Term> — user accounts, permissions, firewall, Defender</li>
      </ul>
      <H2 num="§3" en="Windows Editions Overview" uz="" />
      <table>
        <thead><tr><th>Edition</th><th>Target</th><th>Key Feature</th></tr></thead>
        <tbody>
          <tr><td>Windows 11 Home</td><td>Home users</td><td>TPM 2.0, DirectStorage</td></tr>
          <tr><td>Windows 11 Pro</td><td>Professionals</td><td>BitLocker, Group Policy, RDP</td></tr>
          <tr><td>Windows 11 Enterprise</td><td>Large orgs</td><td>WDAC, AppLocker, Entra ID</td></tr>
          <tr><td>Windows Server 2025</td><td>Datacenters</td><td>AD DS, Hyper-V, IIS</td></tr>
        </tbody>
      </table>
      <H2 num="§4" en="GUI First: Finding Your Way Around" uz="" />
      <P>When Windows boots you land on the <Term>Desktop</Term>. Key areas:</P>
      <ul>
        <li><Em>Taskbar</Em> — bottom bar with Start, pinned apps, system tray</li>
        <li><Em>Start Menu</Em> — search bar + pinned shortcuts (Win key)</li>
        <li><Em>File Explorer</Em> — folder browser (Win+E)</li>
        <li><Em>Settings</Em> — modern control panel (Win+I)</li>
        <li><Em>Action Center</Em> — notifications + quick settings (Win+A)</li>
      </ul>
      <Callout kind="tip">Press <Em>Win+Pause</Em> to open System Info. Press <Em>Win+I</Em> for Settings. These two shortcuts are your first go-to for any PC.</Callout>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="Windows nima?" en="" />
      <P>
        <Term>Windows</Term> — Microsoft tomonidan ishlab chiqilgan operatsion tizim (OT).
        OT — bu qurilma va dasturlar o'rtasidagi dasturiy qatlam: xotira, saqlash, kiritish qurilmalari
        va grafik interfeysni boshqaradi. Windows dunyoda eng ko'p ishlatiladigan ish stoli OT bo'lib,
        <Em>1,5 milliarddan ortiq</Em> qurilmada ishlaydi.
      </P>
      <H2 num="§2" uz="Windows nima qiladi?" en="" />
      <P>Windows beshta asosiy vazifani bajaradi:</P>
      <ul>
        <li><Term>Jarayonlarni boshqarish</Term> — dasturlarni ishga tushirish va rejalashtirish</li>
        <li><Term>Xotirani boshqarish</Term> — har bir dasturga RAM ajratish</li>
        <li><Term>Fayl tizimi</Term> — disklardagi ma'lumotlarni tartibga solish (NTFS)</li>
        <li><Term>Qurilma drayverlari</Term> — qurilma va dastur o'rtasida muloqot</li>
        <li><Term>Xavfsizlik</Term> — foydalanuvchi hisoblar, ruxsatlar, xavfsizlik devori, Defender</li>
      </ul>
      <H2 num="§3" uz="Windows versiyalari" en="" />
      <table>
        <thead><tr><th>Nashr</th><th>Maqsad</th><th>Asosiy xususiyat</th></tr></thead>
        <tbody>
          <tr><td>Windows 11 Home</td><td>Uy foydalanuvchilari</td><td>TPM 2.0, DirectStorage</td></tr>
          <tr><td>Windows 11 Pro</td><td>Mutaxassislar</td><td>BitLocker, Group Policy, RDP</td></tr>
          <tr><td>Windows 11 Enterprise</td><td>Yirik tashkilotlar</td><td>WDAC, AppLocker, Entra ID</td></tr>
          <tr><td>Windows Server 2025</td><td>Ma'lumot markazlari</td><td>AD DS, Hyper-V, IIS</td></tr>
        </tbody>
      </table>
      <H2 num="§4" uz="Grafik interfeys: atrofingizni o'rganish" en="" />
      <P>Windows yuklanganda <Term>Ish stoli</Term> (Desktop) ochiladi. Asosiy bo'limlar:</P>
      <ul>
        <li><Em>Vazifalar paneli</Em> — pastki panel: Start, pinlangan dasturlar, tizim belgisi</li>
        <li><Em>Start menyusi</Em> — qidiruv + qisqichalar (Win tugmasi)</li>
        <li><Em>File Explorer</Em> — papka ko'ruvchi (Win+E)</li>
        <li><Em>Sozlamalar</Em> — zamonaviy boshqaruv paneli (Win+I)</li>
        <li><Em>Harakat markazi</Em> — bildirishnomalar + tez sozlamalar (Win+A)</li>
      </ul>
      <Callout kind="tip"><Em>Win+Pause</Em> — Tizim ma'lumotlari. <Em>Win+I</Em> — Sozlamalar. Bu ikkita tugma kombinatsiyasi har qanday kompyuter uchun birinchi qo'llanma.</Callout>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
function SectionWinVersions() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="Windows Version History" uz="" />
      <P>Understanding the Windows timeline helps you support legacy systems and choose the right OS for each workload.</P>
      <table>
        <thead><tr><th>Version</th><th>Released</th><th>EOL</th><th>Notable</th></tr></thead>
        <tbody>
          <tr><td>Windows 7</td><td>2009</td><td>2020</td><td>Widely used, Aero glass UI</td></tr>
          <tr><td>Windows 10</td><td>2015</td><td>Oct 2025</td><td>Free upgrade, WaaS model</td></tr>
          <tr><td>Windows 11</td><td>2021</td><td>2031+</td><td>TPM 2.0, Android apps, Copilot</td></tr>
          <tr><td>Server 2019</td><td>2018</td><td>2029</td><td>Nano Server, containers</td></tr>
          <tr><td>Server 2022</td><td>2021</td><td>2031</td><td>Secured-core, TLS 1.3</td></tr>
          <tr><td>Server 2025</td><td>2024</td><td>2034</td><td>AI features, SMB over QUIC</td></tr>
        </tbody>
      </table>
      <H2 num="§2" en="Checking Your Windows Version" uz="" />
      <P>GUI method (recommended): <Em>Win+R</Em> → type <code>winver</code> → Enter. You will see the exact build number and edition.</P>
      <P>Also useful: <Em>Settings → System → About</Em> shows edition, version, OS build, and device specs.</P>
      <H2 num="§3" en="Windows 10 vs Windows 11 — Key Differences" uz="" />
      <table>
        <thead><tr><th>Feature</th><th>Windows 10</th><th>Windows 11</th></tr></thead>
        <tbody>
          <tr><td>Start Menu</td><td>Left-aligned tiles</td><td>Centered, no live tiles</td></tr>
          <tr><td>TPM requirement</td><td>None</td><td>TPM 2.0 required</td></tr>
          <tr><td>Snap layouts</td><td>Basic snap</td><td>Snap Layouts grid</td></tr>
          <tr><td>Android apps</td><td>No</td><td>Yes (Amazon App Store)</td></tr>
          <tr><td>DirectStorage</td><td>No</td><td>Yes (NVMe acceleration)</td></tr>
        </tbody>
      </table>
      <Callout kind="warn">Windows 10 reaches End of Life in <Em>October 2025</Em>. Plan migrations to Windows 11 now.</Callout>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="Windows versiyalari tarixi" en="" />
      <P>Windows tarixini bilish eski tizimlarni qo'llab-quvvatlash va har bir ish uchun to'g'ri OT tanlashga yordam beradi.</P>
      <table>
        <thead><tr><th>Versiya</th><th>Chiqarilgan</th><th>Qo'llab-quvvatlash tugashi</th><th>Muhim</th></tr></thead>
        <tbody>
          <tr><td>Windows 7</td><td>2009</td><td>2020</td><td>Keng tarqalgan, Aero shisha UI</td></tr>
          <tr><td>Windows 10</td><td>2015</td><td>Okt 2025</td><td>Bepul yangilash, WaaS modeli</td></tr>
          <tr><td>Windows 11</td><td>2021</td><td>2031+</td><td>TPM 2.0, Android dasturlari</td></tr>
          <tr><td>Server 2019</td><td>2018</td><td>2029</td><td>Nano Server, konteynerlari</td></tr>
          <tr><td>Server 2022</td><td>2021</td><td>2031</td><td>Secured-core, TLS 1.3</td></tr>
          <tr><td>Server 2025</td><td>2024</td><td>2034</td><td>AI funksiyalar, SMB over QUIC</td></tr>
        </tbody>
      </table>
      <H2 num="§2" uz="Windows versiyangizni tekshirish" en="" />
      <P>GUI usuli (tavsiya etiladi): <Em>Win+R</Em> → <code>winver</code> kiriting → Enter. Aniq build raqami va nashrini ko'rasiz.</P>
      <P>Bundan ham: <Em>Sozlamalar → Tizim → Haqida</Em> — nashr, versiya, OS build va qurilma parametrlarini ko'rsatadi.</P>
      <H2 num="§3" uz="Windows 10 vs Windows 11 — Asosiy farqlar" en="" />
      <table>
        <thead><tr><th>Xususiyat</th><th>Windows 10</th><th>Windows 11</th></tr></thead>
        <tbody>
          <tr><td>Start menyusi</td><td>Chapga tekislangan plitalar</td><td>Markazlashgan, jonli plitasiz</td></tr>
          <tr><td>TPM talabi</td><td>Yo'q</td><td>TPM 2.0 talab</td></tr>
          <tr><td>Snap tartib</td><td>Oddiy snap</td><td>Snap Layouts panjarasi</td></tr>
          <tr><td>Android dasturlar</td><td>Yo'q</td><td>Ha (Amazon App Store)</td></tr>
          <tr><td>DirectStorage</td><td>Yo'q</td><td>Ha (NVMe tezlashtirish)</td></tr>
        </tbody>
      </table>
      <Callout kind="warn">Windows 10 <Em>2025-yil oktyabrda</Em> qo'llab-quvvatlanishni to'xtatadi. Hoziroq Windows 11 ga o'tishni rejalashtiring.</Callout>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
function SectionWinInstall() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="System Requirements — Windows 11" uz="" />
      <table>
        <thead><tr><th>Component</th><th>Minimum</th><th>Recommended</th></tr></thead>
        <tbody>
          <tr><td>CPU</td><td>1 GHz, 2 cores, 64-bit</td><td>Intel 12th gen / AMD Ryzen 5000+</td></tr>
          <tr><td>RAM</td><td>4 GB</td><td>16 GB</td></tr>
          <tr><td>Storage</td><td>64 GB</td><td>256 GB SSD</td></tr>
          <tr><td>TPM</td><td>TPM 2.0 (required)</td><td>TPM 2.0</td></tr>
          <tr><td>Display</td><td>720p, 9"</td><td>1080p+</td></tr>
          <tr><td>UEFI</td><td>Secure Boot capable</td><td>UEFI with Secure Boot on</td></tr>
        </tbody>
      </table>
      <H2 num="§2" en="Creating Installation Media" uz="" />
      <P>The official tool is the <Term>Media Creation Tool</Term> from Microsoft. Steps:</P>
      <ol>
        <li>Download <code>mediacreationtool.exe</code> from microsoft.com/software-download</li>
        <li>Run as Administrator</li>
        <li>Choose: <Em>Create installation media (USB/DVD)</Em></li>
        <li>Select Language, Edition, Architecture (64-bit)</li>
        <li>Choose USB flash drive (8 GB+ recommended)</li>
        <li>Wait for download + formatting (15-30 min)</li>
      </ol>
      <H2 num="§3" en="Clean Installation Steps" uz="" />
      <H2 num="§4" en="Post-Install Checklist" uz="" />
      <ul>
        <li>Check Device Manager for unknown devices</li>
        <li>Run Windows Update (Settings → Update &amp; Security)</li>
        <li>Install chipset, GPU, network drivers</li>
        <li>Activate Windows (Settings → System → Activation)</li>
        <li>Enable Secure Boot in BIOS/UEFI if not already on</li>
      </ul>
      <Callout kind="tip">After installation, open <Em>Device Manager</Em> (Win+X → Device Manager). Any device with a yellow exclamation mark needs a driver.</Callout>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="Tizim talablari — Windows 11" en="" />
      <table>
        <thead><tr><th>Komponent</th><th>Minimal</th><th>Tavsiya etilgan</th></tr></thead>
        <tbody>
          <tr><td>CPU</td><td>1 GHz, 2 yadroli, 64-bit</td><td>Intel 12-avlod / AMD Ryzen 5000+</td></tr>
          <tr><td>RAM</td><td>4 GB</td><td>16 GB</td></tr>
          <tr><td>Saqlash</td><td>64 GB</td><td>256 GB SSD</td></tr>
          <tr><td>TPM</td><td>TPM 2.0 (majburiy)</td><td>TPM 2.0</td></tr>
          <tr><td>Displey</td><td>720p, 9"</td><td>1080p+</td></tr>
          <tr><td>UEFI</td><td>Secure Boot qodir</td><td>UEFI with Secure Boot yoqilgan</td></tr>
        </tbody>
      </table>
      <H2 num="§2" uz="O'rnatish muhitini yaratish" en="" />
      <P>Rasmiy vosita — Microsoft saytidan <Term>Media Creation Tool</Term>. Qadamlar:</P>
      <ol>
        <li>microsoft.com/software-download saytidan <code>mediacreationtool.exe</code> yuklab oling</li>
        <li>Administrator sifatida ishga tushiring</li>
        <li>Tanlang: <Em>O'rnatish muhitini yarating (USB/DVD)</Em></li>
        <li>Til, Nashr, Arxitektura (64-bit) tanlang</li>
        <li>USB flesh-disk tanlang (8 GB+ tavsiya etiladi)</li>
        <li>Yuklab olish + formatlashni kuting (15-30 daqiqa)</li>
      </ol>
      <H2 num="§3" uz="Toza o'rnatish qadamlari" en="" />
      <H2 num="§4" uz="O'rnatishdan keyingi nazorat ro'yxati" en="" />
      <ul>
        <li>Device Manager da noma'lum qurilmalarni tekshiring</li>
        <li>Windows Update ni ishga tushiring (Sozlamalar → Yangilash va Xavfsizlik)</li>
        <li>Chipset, GPU, tarmoq drayverlarini o'rnating</li>
        <li>Windowsni faollashtiring (Sozlamalar → Tizim → Faollashtirish)</li>
        <li>BIOS/UEFI da Secure Boot yoqilganligini tekshiring</li>
      </ul>
      <Callout kind="tip">O'rnatishdan so'ng <Em>Device Manager</Em> ni oching (Win+X → Device Manager). Sariq undov belgisi bo'lgan har qanday qurilmaga drayver kerak.</Callout>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
function SectionGPTMBR() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="MBR vs GPT — Partition Table Formats" uz="" />
      <P>Every storage drive needs a <Term>partition table</Term> — a map at the start of the disk that tells the OS where each partition begins and ends. Two formats exist: the legacy <Term>MBR</Term> and the modern <Term>GPT</Term>.</P>
      <table>
        <thead><tr><th>Feature</th><th>MBR</th><th>GPT</th></tr></thead>
        <tbody>
          <tr><td>Max disk size</td><td>2 TB</td><td>18 EB (exabytes)</td></tr>
          <tr><td>Max partitions</td><td>4 primary</td><td>128 partitions</td></tr>
          <tr><td>Boot firmware</td><td>BIOS (legacy)</td><td>UEFI</td></tr>
          <tr><td>Redundancy</td><td>Single copy</td><td>Primary + backup at end of disk</td></tr>
          <tr><td>Windows 11</td><td>Not supported</td><td>Required</td></tr>
        </tbody>
      </table>
      <H2 num="§2" en="Disk Layout Diagram" uz="" />
      <H2 num="§3" en="Disk Management GUI" uz="" />
      <P>Open with: <Em>Win+X → Disk Management</Em> (or <code>diskmgmt.msc</code>)</P>
      <ul>
        <li>Top pane: list of volumes with letters, file system, capacity, free space</li>
        <li>Bottom pane: graphical map of each physical disk</li>
        <li>Right-click a partition: Shrink, Extend, Format, Change Drive Letter</li>
        <li>Right-click unallocated space: New Simple Volume</li>
      </ul>
      <H2 num="§4" en="Common Tasks in Disk Management" uz="" />
      <table>
        <thead><tr><th>Task</th><th>Steps</th></tr></thead>
        <tbody>
          <tr><td>Add new drive</td><td>Right-click disk → Initialize → GPT → New Simple Volume</td></tr>
          <tr><td>Shrink C:</td><td>Right-click C: → Shrink Volume → enter MB to shrink</td></tr>
          <tr><td>Extend partition</td><td>Right-click volume → Extend Volume (needs adjacent unallocated)</td></tr>
          <tr><td>Change drive letter</td><td>Right-click → Change Drive Letter and Paths</td></tr>
          <tr><td>Format drive</td><td>Right-click → Format → NTFS → Quick format</td></tr>
        </tbody>
      </table>
      <Callout kind="warn">Shrinking or deleting the wrong partition can make Windows unbootable. Always check the partition type before making changes.</Callout>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="MBR va GPT — bo'lim jadvali formatlari" en="" />
      <P>Har bir saqlash diskida <Term>bo'lim jadvali</Term> bo'lishi kerak — diskdagi har bir bo'limning boshlanishi va tugashini OT ga ko'rsatuvchi xarita. Ikki format mavjud: eskirgan <Term>MBR</Term> va zamonaviy <Term>GPT</Term>.</P>
      <table>
        <thead><tr><th>Xususiyat</th><th>MBR</th><th>GPT</th></tr></thead>
        <tbody>
          <tr><td>Maksimal disk hajmi</td><td>2 TB</td><td>18 EB (eksabayt)</td></tr>
          <tr><td>Maksimal bo'limlar</td><td>4 asosiy</td><td>128 bo'lim</td></tr>
          <tr><td>Yuklash dasturiy ta'minoti</td><td>BIOS (eski)</td><td>UEFI</td></tr>
          <tr><td>Zaxiralash</td><td>Bitta nusxa</td><td>Asosiy + disk oxiridagi zaxira</td></tr>
          <tr><td>Windows 11</td><td>Qo'llab-quvvatlanmaydi</td><td>Talab etiladi</td></tr>
        </tbody>
      </table>
      <H2 num="§2" uz="Disk tartibi diagramasi" en="" />
      <H2 num="§3" uz="Disk Management grafik interfeysi" en="" />
      <P>Ochish: <Em>Win+X → Disk Management</Em> (yoki <code>diskmgmt.msc</code>)</P>
      <ul>
        <li>Yuqori panel: harflar, fayl tizimi, hajm, bo'sh joy bilan tomlar ro'yxati</li>
        <li>Pastki panel: har bir jismoniy diskning grafik xaritasi</li>
        <li>Bo'limni o'ng tugma bilan bosing: Kichraytirish, Kengaytirish, Formatlash, Disk harfini o'zgartirish</li>
        <li>Ajratilmagan joyni o'ng tugma bilan bosing: Yangi oddiy tom</li>
      </ul>
      <H2 num="§4" uz="Disk Management da umumiy vazifalar" en="" />
      <table>
        <thead><tr><th>Vazifa</th><th>Qadamlar</th></tr></thead>
        <tbody>
          <tr><td>Yangi disk qo'shish</td><td>Diskni o'ng tugma bilan bosing → Ishga tushirish → GPT → Yangi oddiy tom</td></tr>
          <tr><td>C: ni kichraytirish</td><td>C: ni o'ng tugma bilan bosing → Tomni kichraytirish → MB ni kiriting</td></tr>
          <tr><td>Bo'limni kengaytirish</td><td>Tomni o'ng tugma bilan bosing → Tomni kengaytirish (qo'shni bo'sh joy kerak)</td></tr>
          <tr><td>Disk harfini o'zgartirish</td><td>O'ng tugma → Disk harfi va yo'llarini o'zgartirish</td></tr>
          <tr><td>Diskni formatlash</td><td>O'ng tugma → Formatlash → NTFS → Tez formatlash</td></tr>
        </tbody>
      </table>
      <Callout kind="warn">Noto'g'ri bo'limni kichraytirish yoki o'chirish Windows ni yuklana olmaydigan qilib qo'yishi mumkin. O'zgartirishlardan oldin har doim bo'lim turini tekshiring.</Callout>
    </section>
  );
}


// ─────────────────────────────────────────────────────────────
function SectionDesktopEnv() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="The Windows Desktop Environment" uz="" />
      <P>The Windows desktop is your primary workspace. It consists of several interconnected components managed by the <Term>Windows Shell</Term> (explorer.exe).</P>
      <H2 num="§2" en="Start Menu" uz="" />
      <P>Press <Em>Win</Em> or click the Start button. In Windows 11:</P>
      <ul>
        <li><Em>Search bar</Em> — finds apps, files, settings, web</li>
        <li><Em>Pinned apps</Em> — customizable grid (right-click → Pin to Start)</li>
        <li><Em>Recommended</Em> — recently opened files and apps</li>
        <li><Em>All apps</Em> — alphabetical app list</li>
        <li><Em>Power button</Em> — Sleep, Shut down, Restart</li>
      </ul>
      <H2 num="§3" en="Taskbar Components" uz="" />
      <table>
        <thead><tr><th>Area</th><th>What it does</th><th>Shortcut</th></tr></thead>
        <tbody>
          <tr><td>Start button</td><td>Opens Start menu</td><td>Win</td></tr>
          <tr><td>Search</td><td>System-wide search</td><td>Win+S</td></tr>
          <tr><td>Task View</td><td>Virtual desktops + timeline</td><td>Win+Tab</td></tr>
          <tr><td>Pinned apps</td><td>Quick launch</td><td>Win+1..9</td></tr>
          <tr><td>System tray</td><td>Running background apps</td><td>Win+A (Action Center)</td></tr>
          <tr><td>Clock/date</td><td>Calendar popup</td><td>Click to expand</td></tr>
        </tbody>
      </table>
      <H2 num="§4" en="Virtual Desktops" uz="" />
      <P>Windows 11 supports multiple virtual desktops — separate workspaces with different open windows.</P>
      <ul>
        <li><Em>Win+Tab</Em> — open Task View, see all desktops</li>
        <li><Em>Win+Ctrl+D</Em> — create new desktop</li>
        <li><Em>Win+Ctrl+→/←</Em> — switch between desktops</li>
        <li><Em>Win+Ctrl+F4</Em> — close current desktop</li>
      </ul>
      <H2 num="§5" en="Essential Desktop Shortcuts" uz="" />
      <table>
        <thead><tr><th>Shortcut</th><th>Action</th></tr></thead>
        <tbody>
          <tr><td>Win+D</td><td>Show/hide desktop</td></tr>
          <tr><td>Win+E</td><td>Open File Explorer</td></tr>
          <tr><td>Win+I</td><td>Open Settings</td></tr>
          <tr><td>Win+L</td><td>Lock screen</td></tr>
          <tr><td>Win+X</td><td>Power User menu (admin tools)</td></tr>
          <tr><td>Alt+F4</td><td>Close current window</td></tr>
          <tr><td>Win+←/→</td><td>Snap window left/right</td></tr>
        </tbody>
      </table>
      <Callout kind="tip"><Em>Win+X</Em> is the admin's best friend — it gives instant access to Device Manager, Disk Management, Event Viewer, Task Manager, PowerShell, and more.</Callout>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="Windows ish stoli muhiti" en="" />
      <P>Windows ish stoli — asosiy ish maydoningiz. U <Term>Windows Shell</Term> (explorer.exe) tomonidan boshqariladigan bir necha o'zaro bog'liq komponentlardan iborat.</P>
      <H2 num="§2" uz="Start menyusi" en="" />
      <P><Em>Win</Em> tugmasini bosing yoki Start tugmasini bosing. Windows 11 da:</P>
      <ul>
        <li><Em>Qidiruv paneli</Em> — dasturlar, fayllar, sozlamalar, veb topadi</li>
        <li><Em>Pinlangan dasturlar</Em> — sozlanuvchi panjara (o'ng tugma → Start ga pin qiling)</li>
        <li><Em>Tavsiya etilgan</Em> — so'nggi ochilgan fayllar va dasturlar</li>
        <li><Em>Barcha dasturlar</Em> — alifbo tartibidagi dasturlar ro'yxati</li>
        <li><Em>Quvvat tugmasi</Em> — Uyqu rejimi, O'chirish, Qayta ishga tushirish</li>
      </ul>
      <H2 num="§3" uz="Vazifalar paneli komponentlari" en="" />
      <table>
        <thead><tr><th>Hudud</th><th>Vazifasi</th><th>Tugma</th></tr></thead>
        <tbody>
          <tr><td>Start tugmasi</td><td>Start menyusini ochadi</td><td>Win</td></tr>
          <tr><td>Qidiruv</td><td>Tizimli qidiruv</td><td>Win+S</td></tr>
          <tr><td>Vazifa ko'rinishi</td><td>Virtual ish stolli + vaqt jadvali</td><td>Win+Tab</td></tr>
          <tr><td>Pinlangan dasturlar</td><td>Tezkor ishga tushirish</td><td>Win+1..9</td></tr>
          <tr><td>Tizim belgisi</td><td>Fonda ishlaydigan dasturlar</td><td>Win+A (Harakat markazi)</td></tr>
          <tr><td>Soat/sana</td><td>Taqvim oynasi</td><td>Kengaytirish uchun bosing</td></tr>
        </tbody>
      </table>
      <H2 num="§4" uz="Virtual ish stollari" en="" />
      <P>Windows 11 bir necha virtual ish stollarini qo'llab-quvvatlaydi — turli ochiq oynalar bilan alohida ish maydonlari.</P>
      <ul>
        <li><Em>Win+Tab</Em> — Vazifa ko'rinishini oching, barcha ish stollarini ko'ring</li>
        <li><Em>Win+Ctrl+D</Em> — yangi ish stoli yarating</li>
        <li><Em>Win+Ctrl+→/←</Em> — ish stollari o'rtasida o'tish</li>
        <li><Em>Win+Ctrl+F4</Em> — joriy ish stolini yoping</li>
      </ul>
      <H2 num="§5" uz="Muhim ish stoli tugma kombinatsiyalari" en="" />
      <table>
        <thead><tr><th>Tugma</th><th>Harakat</th></tr></thead>
        <tbody>
          <tr><td>Win+D</td><td>Ish stolini ko'rsatish/yashirish</td></tr>
          <tr><td>Win+E</td><td>File Explorer ni ochish</td></tr>
          <tr><td>Win+I</td><td>Sozlamalarni ochish</td></tr>
          <tr><td>Win+L</td><td>Ekranni qulflash</td></tr>
          <tr><td>Win+X</td><td>Kuchli foydalanuvchi menyusi (admin vositalari)</td></tr>
          <tr><td>Alt+F4</td><td>Joriy oynani yopish</td></tr>
          <tr><td>Win+←/→</td><td>Oynani chapga/o'ngga joylashtirish</td></tr>
        </tbody>
      </table>
      <Callout kind="tip"><Em>Win+X</Em> — administrator do'sti: Device Manager, Disk Management, Event Viewer, Task Manager, PowerShell va boshqalarga tezkor kirish.</Callout>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
function SectionFileExplorer() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="File Explorer Overview" uz="" />
      <P><Term>File Explorer</Term> (explorer.exe) is the built-in file manager for browsing drives, folders, and files. Open it with <Em>Win+E</Em> or from the taskbar.</P>
      <H2 num="§2" en="Navigation and Views" uz="" />
      <ul>
        <li><Em>Address bar</Em> — click to type a path directly (e.g., <code>C:\Windows\System32</code>)</li>
        <li><Em>Navigation pane</Em> — left panel with Quick Access, This PC, Network</li>
        <li><Em>View options</Em> — View tab → Extra large icons, Details, Compact view</li>
        <li><Em>Sort &amp; Group</Em> — click column headers in Details view</li>
      </ul>
      <H2 num="§3" en="Essential File Operations" uz="" />
      <table>
        <thead><tr><th>Action</th><th>Method</th></tr></thead>
        <tbody>
          <tr><td>Copy</td><td>Ctrl+C then Ctrl+V (or drag with Ctrl held)</td></tr>
          <tr><td>Move</td><td>Ctrl+X then Ctrl+V (or drag)</td></tr>
          <tr><td>Rename</td><td>F2 or right-click → Rename</td></tr>
          <tr><td>Delete</td><td>Delete key (to Recycle Bin) or Shift+Delete (permanent)</td></tr>
          <tr><td>New folder</td><td>Ctrl+Shift+N</td></tr>
          <tr><td>Select all</td><td>Ctrl+A</td></tr>
          <tr><td>Properties</td><td>Alt+Enter or right-click → Properties</td></tr>
        </tbody>
      </table>
      <H2 num="§4" en="Showing Hidden Files and Extensions" uz="" />
      <P>By default, Windows hides file extensions and system files. To reveal them:</P>
      <ol>
        <li>Open File Explorer → View tab (Windows 10) or View → Show (Windows 11)</li>
        <li>Check <Em>File name extensions</Em></li>
        <li>Check <Em>Hidden items</Em></li>
      </ol>
      <P>Important hidden locations: <code>C:\Users\[name]\AppData</code> (app settings), <code>C:\Windows\System32</code> (system files).</P>
      <H2 num="§5" en="Search in File Explorer" uz="" />
      <P>Click the search box (top right) and type. Windows indexes common locations for fast search. For advanced searches:</P>
      <ul>
        <li><code>kind:document name:report</code> — search by file type and name</li>
        <li><code>datemodified:last week</code> — filter by date</li>
        <li><code>size:&gt;10MB</code> — filter by size</li>
      </ul>
      <Callout kind="tip">To go directly to a folder, click the address bar and type the full path. Example: <code>%AppData%</code> opens your Roaming AppData folder directly.</Callout>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="File Explorer umumiy ko'rinishi" en="" />
      <P><Term>File Explorer</Term> (explorer.exe) — disklar, papkalar va fayllarni ko'rish uchun o'rnatilgan fayl menejeri. <Em>Win+E</Em> yoki vazifalar panelidan oching.</P>
      <H2 num="§2" uz="Navigatsiya va ko'rinishlar" en="" />
      <ul>
        <li><Em>Manzil satri</Em> — to'g'ridan-to'g'ri yo'l kiriting (masalan, <code>C:\Windows\System32</code>)</li>
        <li><Em>Navigatsiya paneli</Em> — chap panel: Tezkor kirish, Bu kompyuter, Tarmoq</li>
        <li><Em>Ko'rinish parametrlari</Em> — Ko'rinish tab → Katta ikonalar, Tafsilotlar, Ixcham ko'rinish</li>
        <li><Em>Saralash va guruhlash</Em> — Tafsilotlar ko'rinishida ustun sarlavhalariga bosing</li>
      </ul>
      <H2 num="§3" uz="Asosiy fayl amaliyotlari" en="" />
      <table>
        <thead><tr><th>Harakat</th><th>Usul</th></tr></thead>
        <tbody>
          <tr><td>Nusxa olish</td><td>Ctrl+C keyin Ctrl+V (yoki Ctrl bilan sudrab)</td></tr>
          <tr><td>Ko'chirish</td><td>Ctrl+X keyin Ctrl+V (yoki sudrab)</td></tr>
          <tr><td>Nomini o'zgartirish</td><td>F2 yoki o'ng tugma → Nomini o'zgartirish</td></tr>
          <tr><td>O'chirish</td><td>Delete (Savatga) yoki Shift+Delete (butunlay)</td></tr>
          <tr><td>Yangi papka</td><td>Ctrl+Shift+N</td></tr>
          <tr><td>Hammasini tanlash</td><td>Ctrl+A</td></tr>
          <tr><td>Xususiyatlar</td><td>Alt+Enter yoki o'ng tugma → Xususiyatlar</td></tr>
        </tbody>
      </table>
      <H2 num="§4" uz="Yashirin fayllar va kengaytmalarni ko'rsatish" en="" />
      <P>Windows standart holda fayl kengaytmalari va tizim fayllarini yashiradi. Ko'rsatish uchun:</P>
      <ol>
        <li>File Explorer → Ko'rinish tab (Windows 10) yoki Ko'rinish → Ko'rsatish (Windows 11)</li>
        <li><Em>Fayl nomi kengaytmalari</Em> ni belgilang</li>
        <li><Em>Yashirin elementlar</Em> ni belgilang</li>
      </ol>
      <P>Muhim yashirin joylashuvlar: <code>C:\Users\[ism]\AppData</code> (dastur sozlamalari), <code>C:\Windows\System32</code> (tizim fayllari).</P>
      <H2 num="§5" uz="File Explorer da qidiruv" en="" />
      <P>Qidiruv maydonini bosing (yuqori o'ng) va yozing. Windows tez qidiruv uchun umumiy joylarni indekslaydi. Kengaytirilgan qidiruv uchun:</P>
      <ul>
        <li><code>kind:document name:hisobot</code> — fayl turi va nomi bo'yicha qidirish</li>
        <li><code>datemodified:last week</code> — sana bo'yicha filtrlash</li>
        <li><code>size:&gt;10MB</code> — hajm bo'yicha filtrlash</li>
      </ul>
      <Callout kind="tip">Papkaga to'g'ridan-to'g'ri o'tish uchun manzil satrini bosing va to'liq yo'lni kiriting. Masalan: <code>%AppData%</code> — Roaming AppData papkangizni to'g'ridan-to'g'ri ochadi.</Callout>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
function SectionTaskMgrBasic() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="Task Manager Overview" uz="" />
      <P><Term>Task Manager</Term> is your live window into everything running on the system. Open it with <Em>Ctrl+Shift+Esc</Em> (fastest) or right-click the taskbar → Task Manager, or <Em>Ctrl+Alt+Del</Em> → Task Manager.</P>
      <H2 num="§2" en="Processes Tab" uz="" />
      <P>The most-used tab. Shows every running process with real-time CPU, Memory, Disk, Network, GPU usage.</P>
      <ul>
        <li><Em>Apps</Em> — foreground applications you opened</li>
        <li><Em>Background processes</Em> — services and background apps</li>
        <li><Em>Windows processes</Em> — core OS components</li>
      </ul>
      <P>Right-click any process for options:</P>
      <ul>
        <li><Em>End task</Em> — force-kills the process (use for frozen apps)</li>
        <li><Em>Open file location</Em> — find the executable on disk</li>
        <li><Em>Search online</Em> — look up the process name</li>
        <li><Em>Properties</Em> — digital signature, version info</li>
      </ul>
      <H2 num="§3" en="Performance Tab" uz="" />
      <P>Real-time graphs for CPU, Memory, Disk, Network, GPU. Click each resource for details:</P>
      <table>
        <thead><tr><th>Resource</th><th>What to watch</th></tr></thead>
        <tbody>
          <tr><td>CPU</td><td>% utilization, cores, speed, uptime</td></tr>
          <tr><td>Memory</td><td>In use vs Available (low Available = RAM pressure)</td></tr>
          <tr><td>Disk</td><td>Active time %; 100% = bottleneck</td></tr>
          <tr><td>Network</td><td>Send/Receive speed, adapter name</td></tr>
          <tr><td>GPU</td><td>GPU engine usage, dedicated vs shared memory</td></tr>
        </tbody>
      </table>
      <H2 num="§4" en="Startup Tab — Control Boot Time" uz="" />
      <P>Shows programs that automatically start when Windows boots. High startup impact programs slow boot time.</P>
      <ul>
        <li>Right-click any entry → <Em>Disable</Em> to prevent it from auto-starting</li>
        <li>Only disable programs you recognize — do not disable security software or drivers</li>
        <li>Common safe-to-disable: Spotify, Teams, Discord, OneDrive (if not needed at boot)</li>
      </ul>
      <H2 num="§5" en="Troubleshooting with Task Manager" uz="" />
      <table>
        <thead><tr><th>Problem</th><th>Task Manager Action</th></tr></thead>
        <tbody>
          <tr><td>App frozen</td><td>Processes tab → right-click → End task</td></tr>
          <tr><td>Slow PC</td><td>Check CPU/RAM/Disk % — identify the bottleneck</td></tr>
          <tr><td>Slow boot</td><td>Startup tab → disable high-impact entries</td></tr>
          <tr><td>Unknown process</td><td>Right-click → Search online</td></tr>
          <tr><td>High memory</td><td>Sort by Memory column — find the top consumer</td></tr>
        </tbody>
      </table>
      <Callout kind="tip">If Task Manager itself won't open, try <Em>Win+R</Em> → <code>taskmgr</code>. If that fails too, the system may be compromised or critically low on resources.</Callout>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="Task Manager umumiy ko'rinishi" en="" />
      <P><Term>Task Manager</Term> — tizimda ishlayotgan hamma narsaga jonli ko'rish oynasi. <Em>Ctrl+Shift+Esc</Em> (eng tez) yoki vazifalar panelini o'ng tugma bilan bosib → Task Manager, yoki <Em>Ctrl+Alt+Del</Em> → Task Manager.</P>
      <H2 num="§2" uz="Jarayonlar yorlig'i" en="" />
      <P>Eng ko'p ishlatiladigan yorliq. Har bir ishlaydigan jarayonni real vaqtda CPU, RAM, Disk, Tarmoq, GPU foydalanish bilan ko'rsatadi.</P>
      <ul>
        <li><Em>Dasturlar</Em> — siz ochgan old fon dasturlari</li>
        <li><Em>Fon jarayonlari</Em> — xizmatlar va fon dasturlari</li>
        <li><Em>Windows jarayonlari</Em> — asosiy OT komponentlari</li>
      </ul>
      <P>Har qanday jarayonni o'ng tugma bilan bosing:</P>
      <ul>
        <li><Em>Vazifani tugatish</Em> — jarayonni majburiy to'xtatish (muzlagan dasturlar uchun)</li>
        <li><Em>Fayl joylashuvini ochish</Em> — diskdagi bajariladigan faylni topish</li>
        <li><Em>Onlayn qidirish</Em> — jarayon nomini qidirish</li>
        <li><Em>Xususiyatlar</Em> — raqamli imzo, versiya ma'lumotlari</li>
      </ul>
      <H2 num="§3" uz="Ishlash yorlig'i" en="" />
      <P>CPU, RAM, Disk, Tarmoq, GPU uchun real vaqtli grafiklar. Tafsilotlar uchun har bir manbani bosing:</P>
      <table>
        <thead><tr><th>Manba</th><th>Nimaga e'tibor berish</th></tr></thead>
        <tbody>
          <tr><td>CPU</td><td>% foydalanish, yadrolar, tezlik, ishlash vaqti</td></tr>
          <tr><td>RAM</td><td>Foydalanilgan va Mavjud (kam Mavjud = RAM bosimi)</td></tr>
          <tr><td>Disk</td><td>Faol vaqt %; 100% = to'siq</td></tr>
          <tr><td>Tarmoq</td><td>Yuborish/Qabul qilish tezligi, adapter nomi</td></tr>
          <tr><td>GPU</td><td>GPU mexanizm foydalanish, ajratilgan va umumiy xotira</td></tr>
        </tbody>
      </table>
      <H2 num="§4" uz="Ishga tushirish yorlig'i — yuklash vaqtini boshqarish" en="" />
      <P>Windows yuklanganda avtomatik ishlaydigan dasturlarni ko'rsatadi. Yuqori ta'sirli dasturlar yuklash vaqtini sekinlashtiradi.</P>
      <ul>
        <li>Har qanday yozuvni o'ng tugma bilan bosing → <Em>O'chirib qo'yish</Em></li>
        <li>Faqat tanish dasturlarni o'chiring — xavfsizlik dasturlarini o'chirmang</li>
        <li>Xavfsiz o'chirish mumkin: Spotify, Teams, Discord, OneDrive (yuklashda shart bo'lmasa)</li>
      </ul>
      <H2 num="§5" uz="Task Manager bilan muammolarni hal qilish" en="" />
      <table>
        <thead><tr><th>Muammo</th><th>Task Manager harakati</th></tr></thead>
        <tbody>
          <tr><td>Dastur muzlagan</td><td>Jarayonlar → o'ng tugma → Vazifani tugatish</td></tr>
          <tr><td>Sekin kompyuter</td><td>CPU/RAM/Disk % tekshirish — to'siqni aniqlash</td></tr>
          <tr><td>Sekin yuklash</td><td>Ishga tushirish → yuqori ta'sirli yozuvlarni o'chirish</td></tr>
          <tr><td>Noma'lum jarayon</td><td>O'ng tugma → Onlayn qidirish</td></tr>
          <tr><td>Yuqori RAM</td><td>RAM ustuni bo'yicha saralash — eng ko'p ishlatuvchini topish</td></tr>
        </tbody>
      </table>
      <Callout kind="tip">Task Manager ochilmasa, <Em>Win+R</Em> → <code>taskmgr</code> ni sinab ko'ring. Bu ham ishlamasa, tizim buzilgan yoki kritik tarzda resurslar yetishmayotgan bo'lishi mumkin.</Callout>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
function SectionDeviceMgrBasic() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="Device Manager Overview" uz="" />
      <P><Term>Device Manager</Term> is the central console for all hardware in your PC. Open it: <Em>Win+X → Device Manager</Em> or <code>devmgmt.msc</code>.</P>
      <P>It shows every device Windows recognises — CPU, GPU, storage, network adapters, USB controllers, audio, and more — organised in a tree by category.</P>
      <H2 num="§2" en="Reading Device Status Icons" uz="" />
      <table>
        <thead><tr><th>Icon</th><th>Meaning</th><th>Action</th></tr></thead>
        <tbody>
          <tr><td>✔ (no icon)</td><td>Working correctly</td><td>None needed</td></tr>
          <tr><td>⚠ Yellow !</td><td>Problem / driver issue</td><td>Update or reinstall driver</td></tr>
          <tr><td>❌ Red X</td><td>Device disabled</td><td>Right-click → Enable device</td></tr>
          <tr><td>❓ Question mark</td><td>Unknown device (no driver)</td><td>Install correct driver</td></tr>
          <tr><td>↓ Down arrow</td><td>Manually disabled</td><td>Right-click → Enable</td></tr>
        </tbody>
      </table>
      <H2 num="§3" en="Driver Management" uz="" />
      <P>Drivers are software that let Windows communicate with hardware. Common driver tasks:</P>
      <ul>
        <li><Em>Update driver</Em> — right-click device → Update driver → Search automatically</li>
        <li><Em>Roll back driver</Em> — right-click → Properties → Driver tab → Roll Back Driver (useful when an update breaks something)</li>
        <li><Em>Uninstall device</Em> — removes driver; Windows reinstalls on next boot</li>
        <li><Em>Scan for hardware changes</Em> — Action menu → detects newly connected devices</li>
      </ul>
      <H2 num="§4" en="Device Properties Deep Dive" uz="" />
      <P>Double-click any device to open Properties. Key tabs:</P>
      <table>
        <thead><tr><th>Tab</th><th>What you find</th></tr></thead>
        <tbody>
          <tr><td>General</td><td>Device status, error codes</td></tr>
          <tr><td>Driver</td><td>Driver version, date, publisher; Update/Rollback/Uninstall buttons</td></tr>
          <tr><td>Details</td><td>Hardware IDs — use these to find the right driver manually</td></tr>
          <tr><td>Events</td><td>Recent device events, errors, warnings</td></tr>
          <tr><td>Resources</td><td>IRQ, memory addresses (advanced)</td></tr>
        </tbody>
      </table>
      <H2 num="§5" en="Troubleshooting Common Device Issues" uz="" />
      <table>
        <thead><tr><th>Issue</th><th>Steps</th></tr></thead>
        <tbody>
          <tr><td>No sound</td><td>Device Manager → Sound → check for ⚠ → update driver</td></tr>
          <tr><td>No Wi-Fi</td><td>Network adapters → find Wi-Fi adapter → update driver</td></tr>
          <tr><td>GPU not detected</td><td>Display adapters → check if listed; try uninstall + reboot</td></tr>
          <tr><td>USB device unknown</td><td>Universal Serial Bus → Unknown USB Device → update driver</td></tr>
        </tbody>
      </table>
      <Callout kind="tip">To find the right driver manually: Device Manager → device Properties → Details tab → change dropdown to <Em>Hardware IDs</Em> → copy the top ID → search on the manufacturer's site.</Callout>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="Device Manager umumiy ko'rinishi" en="" />
      <P><Term>Device Manager</Term> — kompyuteringizdagi barcha qurilmalar uchun markaziy konsol. Oching: <Em>Win+X → Device Manager</Em> yoki <code>devmgmt.msc</code>.</P>
      <P>Windows tanigan har bir qurilmani ko'rsatadi — CPU, GPU, saqlash, tarmoq adapterlari, USB kontrollerlari, audio va boshqalar — kategoriya bo'yicha daraxtda tashkil etilgan.</P>
      <H2 num="§2" uz="Qurilma holati ikonalarini o'qish" en="" />
      <table>
        <thead><tr><th>Ikona</th><th>Ma'nosi</th><th>Harakat</th></tr></thead>
        <tbody>
          <tr><td>✔ (ikona yo'q)</td><td>To'g'ri ishlayapti</td><td>Hech narsa kerak emas</td></tr>
          <tr><td>⚠ Sariq !</td><td>Muammo / drayver xatosi</td><td>Drayverni yangilang yoki qayta o'rnating</td></tr>
          <tr><td>❌ Qizil X</td><td>Qurilma o'chirilgan</td><td>O'ng tugma → Qurilmani yoqish</td></tr>
          <tr><td>❓ Savol belgisi</td><td>Noma'lum qurilma (drayver yo'q)</td><td>To'g'ri drayverni o'rnating</td></tr>
          <tr><td>↓ Pastga o'q</td><td>Qo'lda o'chirilgan</td><td>O'ng tugma → Yoqish</td></tr>
        </tbody>
      </table>
      <H2 num="§3" uz="Drayverni boshqarish" en="" />
      <P>Drayverlar — Windows ni qurilma bilan bog'laydigan dasturlar. Umumiy drayver vazifalari:</P>
      <ul>
        <li><Em>Drayverni yangilash</Em> — qurilmani o'ng tugma bilan bosing → Drayverni yangilash → Avtomatik qidirish</li>
        <li><Em>Drayverni qaytarish</Em> — o'ng tugma → Xususiyatlar → Drayver yorlig'i → Drayverni qaytarish (yangilanish biror narsani buzganda foydali)</li>
        <li><Em>Qurilmani o'chirish</Em> — drayverni olib tashlaydi; Windows keyingi yuklanishda qayta o'rnatadi</li>
        <li><Em>Qurilma o'zgarishlarini skanerlash</Em> — Harakat menyusi → yangi ulangan qurilmalarni aniqlaydi</li>
      </ul>
      <H2 num="§4" uz="Qurilma xususiyatlariga chuqur kirib borish" en="" />
      <P>Xususiyatlarni ochish uchun har qanday qurilmani ikki marta bosing. Asosiy yorliqlar:</P>
      <table>
        <thead><tr><th>Yorliq</th><th>Nima topasiz</th></tr></thead>
        <tbody>
          <tr><td>Umumiy</td><td>Qurilma holati, xato kodlari</td></tr>
          <tr><td>Drayver</td><td>Drayver versiyasi, sanasi, nashriyotchi; Yangilash/Qaytarish/O'chirish tugmalari</td></tr>
          <tr><td>Tafsilotlar</td><td>Qurilma IDlari — to'g'ri drayverni qo'lda topish uchun</td></tr>
          <tr><td>Voqealar</td><td>So'nggi qurilma voqealari, xatolar, ogohlantirishlar</td></tr>
          <tr><td>Resurslar</td><td>IRQ, xotira manzillari (kengaytirilgan)</td></tr>
        </tbody>
      </table>
      <H2 num="§5" uz="Umumiy qurilma muammolarini hal qilish" en="" />
      <table>
        <thead><tr><th>Muammo</th><th>Qadamlar</th></tr></thead>
        <tbody>
          <tr><td>Ovoz yo'q</td><td>Device Manager → Ovoz → ⚠ tekshirish → drayverni yangilash</td></tr>
          <tr><td>Wi-Fi yo'q</td><td>Tarmoq adapterlari → Wi-Fi adapterni toping → drayverni yangilang</td></tr>
          <tr><td>GPU aniqlanmadi</td><td>Displey adapterlari → ro'yxatda borligini tekshirish; o'chirish + qayta yuklashni sinab ko'ring</td></tr>
          <tr><td>USB qurilma noma'lum</td><td>Universal Serial Bus → Noma'lum USB qurilmasi → drayverni yangilang</td></tr>
        </tbody>
      </table>
      <Callout kind="tip">Drayverni qo'lda topish uchun: Device Manager → qurilma Xususiyatlari → Tafsilotlar yorlig'i → ochiladigan ro'yxatni <Em>Qurilma IDlari</Em> ga o'zgartirish → yuqori IDni nusxa olish → ishlab chiqaruvchi saytida qidirish.</Callout>
    </section>
  );
}


// ─────────────────────────────────────────────────────────────
function SectionUserBasic() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="Account Types in Windows" uz="" />
      <P>Windows supports several account types, each with different levels of access and management.</P>
      <table>
        <thead><tr><th>Type</th><th>Scope</th><th>Best for</th></tr></thead>
        <tbody>
          <tr><td>Microsoft Account</td><td>Cloud-linked (Entra ID / outlook.com)</td><td>Personal PCs, sync settings across devices</td></tr>
          <tr><td>Local Account</td><td>This PC only</td><td>Privacy-focused, no internet required</td></tr>
          <tr><td>Administrator</td><td>Full system control</td><td>IT admins, power users</td></tr>
          <tr><td>Standard User</td><td>Limited — can't install software or change system</td><td>Daily use, children, employees</td></tr>
          <tr><td>Guest (removed)</td><td>Temporary, no password</td><td>Removed in Windows 10+</td></tr>
        </tbody>
      </table>
      <H2 num="§2" en="Creating a New User Account" uz="" />
      <P>GUI method: <Em>Settings → Accounts → Other users → Add other user</Em></P>
      <ol>
        <li>Settings → Accounts → Other users</li>
        <li>Click <Em>Add account</Em></li>
        <li>Choose: Microsoft account (enter email) or Local account (click "I don't have this person's sign-in information" → "Add a user without a Microsoft account")</li>
        <li>Enter username and password</li>
        <li>Select account type: Standard User or Administrator</li>
      </ol>
      <H2 num="§3" en="Changing Account Type" uz="" />
      <P>Settings → Accounts → Other users → click account → <Em>Change account type</Em></P>
      <Callout kind="warn">Giving users Administrator rights means they can install software, modify system settings, and access other users' files. Only grant this when necessary.</Callout>
      <H2 num="§4" en="Password and PIN Management" uz="" />
      <P>Settings → Accounts → Sign-in options:</P>
      <ul>
        <li><Em>PIN (Windows Hello)</Em> — recommended; faster and more secure than passwords for local login</li>
        <li><Em>Password</Em> — traditional account password</li>
        <li><Em>Fingerprint / Face</Em> — biometric options (requires compatible hardware)</li>
        <li><Em>Security key</Em> — physical FIDO2 key</li>
      </ul>
      <H2 num="§5" en="User Profile Folders" uz="" />
      <P>Each user gets a profile folder at <code>C:\Users\[username]</code>. Key subfolders:</P>
      <table>
        <thead><tr><th>Folder</th><th>Contains</th></tr></thead>
        <tbody>
          <tr><td>Desktop</td><td>Desktop shortcuts and files</td></tr>
          <tr><td>Documents</td><td>User documents</td></tr>
          <tr><td>Downloads</td><td>Browser downloads</td></tr>
          <tr><td>AppData\Roaming</td><td>App settings that sync (hidden)</td></tr>
          <tr><td>AppData\Local</td><td>App settings local only (hidden)</td></tr>
          <tr><td>NTUSER.DAT</td><td>User's registry hive (hidden)</td></tr>
        </tbody>
      </table>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="Windows da hisob turlari" en="" />
      <P>Windows bir necha hisob turlarini qo'llab-quvvatlaydi, har biri turli kirish darajasiga ega.</P>
      <table>
        <thead><tr><th>Tur</th><th>Ko'lam</th><th>Uchun eng yaxshi</th></tr></thead>
        <tbody>
          <tr><td>Microsoft hisobi</td><td>Bulutga ulangan (Entra ID / outlook.com)</td><td>Shaxsiy kompyuterlar, sozlamalarni sinxronlash</td></tr>
          <tr><td>Mahalliy hisob</td><td>Faqat shu kompyuter</td><td>Maxfiylik, internet kerak emas</td></tr>
          <tr><td>Administrator</td><td>To'liq tizim nazorati</td><td>IT adminlar, kuchli foydalanuvchilar</td></tr>
          <tr><td>Oddiy foydalanuvchi</td><td>Cheklangan — dastur o'rnatish yoki tizimni o'zgartira olmaydi</td><td>Kunlik foydalanish, bolalar, xodimlar</td></tr>
          <tr><td>Mehmon (olib tashlangan)</td><td>Vaqtinchalik, parolsiz</td><td>Windows 10+ da olib tashlangan</td></tr>
        </tbody>
      </table>
      <H2 num="§2" uz="Yangi foydalanuvchi hisobini yaratish" en="" />
      <P>GUI usuli: <Em>Sozlamalar → Hisoblar → Boshqa foydalanuvchilar → Boshqa foydalanuvchi qo'shish</Em></P>
      <ol>
        <li>Sozlamalar → Hisoblar → Boshqa foydalanuvchilar</li>
        <li><Em>Hisob qo'shish</Em> ni bosing</li>
        <li>Tanlang: Microsoft hisobi (email kiriting) yoki Mahalliy hisob ("Bu shaxsning kirish ma'lumotlari yo'q" → "Microsoft hisobsiz foydalanuvchi qo'shish")</li>
        <li>Foydalanuvchi nomi va parolni kiriting</li>
        <li>Hisob turini tanlang: Oddiy foydalanuvchi yoki Administrator</li>
      </ol>
      <H2 num="§3" uz="Hisob turini o'zgartirish" en="" />
      <P>Sozlamalar → Hisoblar → Boshqa foydalanuvchilar → hisobni bosing → <Em>Hisob turini o'zgartirish</Em></P>
      <Callout kind="warn">Foydalanuvchilarga Administrator huquqlari berish ularning dastur o'rnatishi, tizim sozlamalarini o'zgartirishi va boshqa foydalanuvchilar fayllariga kirishi mumkinligini anglatadi. Faqat zarur bo'lganda bering.</Callout>
      <H2 num="§4" uz="Parol va PIN boshqaruvi" en="" />
      <P>Sozlamalar → Hisoblar → Kirish parametrlari:</P>
      <ul>
        <li><Em>PIN (Windows Hello)</Em> — tavsiya etiladi; mahalliy kirish uchun paroldan tezroq va xavfsizroq</li>
        <li><Em>Parol</Em> — an'anaviy hisob paroli</li>
        <li><Em>Barmoq izi / Yuz</Em> — biometrik variantlar (mos qurilma talab)</li>
        <li><Em>Xavfsizlik kaliti</Em> — fizik FIDO2 kaliti</li>
      </ul>
      <H2 num="§5" uz="Foydalanuvchi profil papkalari" en="" />
      <P>Har bir foydalanuvchi <code>C:\Users\[foydalanuvchi nomi]</code> da profil papkasiga ega. Asosiy pastki papkalar:</P>
      <table>
        <thead><tr><th>Papka</th><th>Nimani o'z ichiga oladi</th></tr></thead>
        <tbody>
          <tr><td>Desktop</td><td>Ish stoli qisqichalari va fayllari</td></tr>
          <tr><td>Documents</td><td>Foydalanuvchi hujjatlari</td></tr>
          <tr><td>Downloads</td><td>Brauzer yuklab olishlari</td></tr>
          <tr><td>AppData\Roaming</td><td>Sinxronlashuvchi dastur sozlamalari (yashirin)</td></tr>
          <tr><td>AppData\Local</td><td>Faqat mahalliy dastur sozlamalari (yashirin)</td></tr>
          <tr><td>NTUSER.DAT</td><td>Foydalanuvchining ro'yxatga olish kitobi yig'masi (yashirin)</td></tr>
        </tbody>
      </table>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
function SectionPermsBasic() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="NTFS Permissions — The Basics" uz="" />
      <P>Every file and folder on an NTFS volume has an <Term>Access Control List (ACL)</Term> — a list of who can do what. Right-click any file/folder → <Em>Properties → Security tab</Em> to view them.</P>
      <table>
        <thead><tr><th>Permission</th><th>Files</th><th>Folders</th></tr></thead>
        <tbody>
          <tr><td>Full Control</td><td>Read, write, execute, delete, change permissions</td><td>All above + delete subfolders</td></tr>
          <tr><td>Modify</td><td>Read, write, delete</td><td>Read, write, delete contents</td></tr>
          <tr><td>Read &amp; Execute</td><td>Open and run files</td><td>List folder, run files inside</td></tr>
          <tr><td>Read</td><td>View file contents</td><td>List folder contents</td></tr>
          <tr><td>Write</td><td>Create/modify files</td><td>Create files and subfolders</td></tr>
        </tbody>
      </table>
      <H2 num="§2" en="Viewing and Changing Permissions (GUI)" uz="" />
      <ol>
        <li>Right-click folder → Properties → <Em>Security</Em> tab</li>
        <li>Click a user/group in the top list to see their permissions below</li>
        <li>Click <Em>Edit</Em> to change permissions</li>
        <li>Click <Em>Add</Em> to add a new user or group</li>
        <li>Check/uncheck Allow or Deny for each permission</li>
        <li>Click OK → Apply</li>
      </ol>
      <Callout kind="warn"><Em>Deny</Em> always overrides <Em>Allow</Em>. If a user is in two groups — one allowed and one denied — the Deny wins. Use Deny sparingly.</Callout>
      <H2 num="§3" en="Inheritance" uz="" />
      <P>By default, subfolders and files <Term>inherit</Term> permissions from their parent folder. This means you usually only need to set permissions at the top-level folder. To override inheritance on a specific subfolder:</P>
      <ol>
        <li>Properties → Security → Advanced → Disable inheritance</li>
        <li>Choose: <Em>Convert</Em> (copy parent's permissions then customize) or <Em>Remove</Em> (start fresh)</li>
      </ol>
      <H2 num="§4" en="Basic Sharing — Share a Folder" uz="" />
      <ol>
        <li>Right-click folder → Properties → <Em>Sharing</Em> tab → <Em>Share</Em></li>
        <li>Type a username or group → Add → set Permission Level (Read / Read-Write)</li>
        <li>Click <Em>Share</Em> — Windows shows the network path (\\PC-NAME\FolderName)</li>
      </ol>
      <P>Other PCs on the same network can access it via <code>\\PC-NAME\FolderName</code> in File Explorer address bar.</P>
      <H2 num="§5" en="Access Denied — Troubleshooting" uz="" />
      <table>
        <thead><tr><th>Cause</th><th>Fix</th></tr></thead>
        <tbody>
          <tr><td>Not logged in as owner/admin</td><td>Run as Administrator or log in as folder owner</td></tr>
          <tr><td>Permissions not granted</td><td>Check Security tab — add user with correct permissions</td></tr>
          <tr><td>Deny permission set</td><td>Remove Deny entry from ACL</td></tr>
          <tr><td>Encrypted file (EFS)</td><td>Need the encryption certificate of the original user</td></tr>
          <tr><td>Ownership issue</td><td>Properties → Security → Advanced → Change Owner</td></tr>
        </tbody>
      </table>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="NTFS ruxsatlari — asoslar" en="" />
      <P>NTFS hajmidagi har bir fayl va papkada <Term>Kirish nazorati ro'yxati (ACL)</Term> bor — kim nima qilishi mumkinligi ro'yxati. Har qanday fayl/papkani o'ng tugma bilan bosib → <Em>Xususiyatlar → Xavfsizlik yorlig'i</Em> da ko'ring.</P>
      <table>
        <thead><tr><th>Ruxsat</th><th>Fayllar</th><th>Papkalar</th></tr></thead>
        <tbody>
          <tr><td>To'liq nazorat</td><td>O'qish, yozish, bajarish, o'chirish, ruxsatlarni o'zgartirish</td><td>Yuqoridagilarning barchasi + pastki papkalarni o'chirish</td></tr>
          <tr><td>O'zgartirish</td><td>O'qish, yozish, o'chirish</td><td>Tarkibni o'qish, yozish, o'chirish</td></tr>
          <tr><td>O'qish va bajarish</td><td>Fayllarni ochish va ishga tushirish</td><td>Papkani ro'yxatga olish, ichidagi fayllarni bajarish</td></tr>
          <tr><td>O'qish</td><td>Fayl tarkibini ko'rish</td><td>Papka tarkibini ro'yxatga olish</td></tr>
          <tr><td>Yozish</td><td>Fayllarni yaratish/o'zgartirish</td><td>Fayllar va pastki papkalar yaratish</td></tr>
        </tbody>
      </table>
      <H2 num="§2" uz="Ruxsatlarni ko'rish va o'zgartirish (GUI)" en="" />
      <ol>
        <li>Papkani o'ng tugma bilan bosing → Xususiyatlar → <Em>Xavfsizlik</Em> yorlig'i</li>
        <li>Yuqori ro'yxatda foydalanuvchi/guruhni bosing — pastda ularning ruxsatlarini ko'ring</li>
        <li>Ruxsatlarni o'zgartirish uchun <Em>Tahrirlash</Em> ni bosing</li>
        <li>Yangi foydalanuvchi yoki guruh qo'shish uchun <Em>Qo'shish</Em> ni bosing</li>
        <li>Har bir ruxsat uchun Ruxsat berish yoki Rad etishni belgilang/olib tashlang</li>
        <li>OK → Qo'llash</li>
      </ol>
      <Callout kind="warn"><Em>Rad etish</Em> har doim <Em>Ruxsat berish</Em> dan ustun turadi. Agar foydalanuvchi ikki guruhda bo'lsa — biri ruxsat berilgan, biri rad etilgan — Rad etish g'alaba qiladi. Rad etishni kamdan-kam ishlating.</Callout>
      <H2 num="§3" uz="Meros" en="" />
      <P>Standart holda, pastki papkalar va fayllar ota-papkadan ruxsatlarni <Term>meros qilib oladi</Term>. Bu odatda faqat yuqori darajadagi papkada ruxsatlarni o'rnatishingiz kerakligini anglatadi. Muayyan pastki papkada merosni bekor qilish uchun:</P>
      <ol>
        <li>Xususiyatlar → Xavfsizlik → Kengaytirilgan → Merosni o'chirib qo'yish</li>
        <li>Tanlang: <Em>Konvertatsiya qilish</Em> (ota ruxsatlarini nusxalash va moslash) yoki <Em>Olib tashlash</Em> (noldan boshlash)</li>
      </ol>
      <H2 num="§4" uz="Asosiy ulashish — papkani ulashish" en="" />
      <ol>
        <li>Papkani o'ng tugma bilan bosing → Xususiyatlar → <Em>Ulashish</Em> yorlig'i → <Em>Ulashish</Em></li>
        <li>Foydalanuvchi nomi yoki guruhni kiriting → Qo'shish → Ruxsat darajasini o'rnating (O'qish / O'qish-Yozish)</li>
        <li><Em>Ulashish</Em> ni bosing — Windows tarmoq yo'lini ko'rsatadi (\\KOMPYUTER-NOMI\PapkaNomi)</li>
      </ol>
      <P>Bir xil tarmoqdagi boshqa kompyuterlar File Explorer manzil satrida <code>\\KOMPYUTER-NOMI\PapkaNomi</code> orqali kirishi mumkin.</P>
      <H2 num="§5" uz="Kirish rad etildi — muammolarni hal qilish" en="" />
      <table>
        <thead><tr><th>Sabab</th><th>Yechim</th></tr></thead>
        <tbody>
          <tr><td>Egasi/admin sifatida kirmagan</td><td>Administrator sifatida ishga tushirish yoki papka egasi sifatida kirish</td></tr>
          <tr><td>Ruxsatlar berilmagan</td><td>Xavfsizlik yorlig'ini tekshirish — foydalanuvchini to'g'ri ruxsatlar bilan qo'shish</td></tr>
          <tr><td>Rad etish ruxsati o'rnatilgan</td><td>ACL dan Rad etish yozuvini olib tashlash</td></tr>
          <tr><td>Shifrlangan fayl (EFS)</td><td>Asl foydalanuvchining shifrlash sertifikati kerak</td></tr>
          <tr><td>Egalik muammosi</td><td>Xususiyatlar → Xavfsizlik → Kengaytirilgan → Egani o'zgartirish</td></tr>
        </tbody>
      </table>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
function SectionWinUpdate() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="Windows Update Overview" uz="" />
      <P><Term>Windows Update</Term> delivers security patches, feature updates, and driver updates automatically. It is the single most important security control for any Windows machine. Access via: <Em>Settings → Windows Update</Em>.</P>
      <H2 num="§2" en="Update Types" uz="" />
      <table>
        <thead><tr><th>Type</th><th>Description</th><th>Frequency</th></tr></thead>
        <tbody>
          <tr><td>Security updates</td><td>Patch known vulnerabilities (CVEs)</td><td>Monthly (Patch Tuesday)</td></tr>
          <tr><td>Quality updates</td><td>Bug fixes, reliability, performance</td><td>Monthly</td></tr>
          <tr><td>Feature updates</td><td>New Windows version (22H2, 23H2...)</td><td>Annual</td></tr>
          <tr><td>Driver updates</td><td>Hardware driver updates via Windows</td><td>As needed</td></tr>
          <tr><td>Definition updates</td><td>Windows Defender signature updates</td><td>Multiple times daily</td></tr>
        </tbody>
      </table>
      <H2 num="§3" en="Managing Updates" uz="" />
      <P><Em>Settings → Windows Update → Advanced options:</Em></P>
      <ul>
        <li><Em>Pause updates</Em> — delay up to 5 weeks (useful before major feature updates on production systems)</li>
        <li><Em>Active hours</Em> — set times when Windows should not restart for updates</li>
        <li><Em>Optional updates</Em> — driver and non-critical updates you can install manually</li>
        <li><Em>Windows Insider Program</Em> — preview builds (not for production)</li>
      </ul>
      <H2 num="§4" en="Troubleshooting Windows Update" uz="" />
      <table>
        <thead><tr><th>Problem</th><th>Steps</th></tr></thead>
        <tbody>
          <tr><td>Updates stuck / fail</td><td>Settings → Windows Update → Troubleshoot → Windows Update troubleshooter</td></tr>
          <tr><td>Error codes</td><td>Search the error code on support.microsoft.com</td></tr>
          <tr><td>SFC scan</td><td>Open CMD as Admin → <code>sfc /scannow</code></td></tr>
          <tr><td>DISM repair</td><td><code>DISM /Online /Cleanup-Image /RestoreHealth</code></td></tr>
          <tr><td>Reset update components</td><td>Stop wuauserv, delete SoftwareDistribution folder, restart service</td></tr>
        </tbody>
      </table>
      <Callout kind="warn">Never disable Windows Update entirely. If you must delay updates (testing, critical systems), use the Pause feature, not a registry hack that stops updates permanently.</Callout>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="Windows Update umumiy ko'rinishi" en="" />
      <P><Term>Windows Update</Term> — xavfsizlik yamoqlari, xususiyat yangilanishlari va drayver yangilanishlarini avtomatik yetkazib beradi. Bu har qanday Windows mashinasi uchun eng muhim xavfsizlik nazorati. Kirish: <Em>Sozlamalar → Windows Update</Em>.</P>
      <H2 num="§2" uz="Yangilanish turlari" en="" />
      <table>
        <thead><tr><th>Tur</th><th>Tavsif</th><th>Chastota</th></tr></thead>
        <tbody>
          <tr><td>Xavfsizlik yangilanishlari</td><td>Ma'lum zaifliklarni (CVE) yamoqlash</td><td>Oylik (Patch Tuesday)</td></tr>
          <tr><td>Sifat yangilanishlari</td><td>Xato tuzatishlari, ishonchlilik, ishlash</td><td>Oylik</td></tr>
          <tr><td>Xususiyat yangilanishlari</td><td>Yangi Windows versiyasi (22H2, 23H2...)</td><td>Yillik</td></tr>
          <tr><td>Drayver yangilanishlari</td><td>Windows orqali apparat drayver yangilanishlari</td><td>Kerak bo'lganda</td></tr>
          <tr><td>Ta'rif yangilanishlari</td><td>Windows Defender imzo yangilanishlari</td><td>Kuniga bir necha marta</td></tr>
        </tbody>
      </table>
      <H2 num="§3" uz="Yangilanishlarni boshqarish" en="" />
      <P><Em>Sozlamalar → Windows Update → Kengaytirilgan parametrlar:</Em></P>
      <ul>
        <li><Em>Yangilanishlarni to'xtatib turish</Em> — 5 haftaga kechiktirish (ishlab chiqarish tizimlarida katta xususiyat yangilanishlaridan oldin foydali)</li>
        <li><Em>Faol soatlar</Em> — Windows yangilanishlar uchun qayta ishga tushirmasligi kerak bo'lgan vaqtlarni o'rnating</li>
        <li><Em>Ixtiyoriy yangilanishlar</Em> — qo'lda o'rnatish mumkin bo'lgan drayver va muhim bo'lmagan yangilanishlar</li>
        <li><Em>Windows Insider dasturi</Em> — oldindan ko'rish assembleri (ishlab chiqarish uchun emas)</li>
      </ul>
      <H2 num="§4" uz="Windows Update ni tuzatish" en="" />
      <table>
        <thead><tr><th>Muammo</th><th>Qadamlar</th></tr></thead>
        <tbody>
          <tr><td>Yangilanishlar tiqilib qoldi / muvaffaqiyatsiz</td><td>Sozlamalar → Windows Update → Muammolarni bartaraf etish → Windows Update muammolarini bartaraf etuvchisi</td></tr>
          <tr><td>Xato kodlari</td><td>support.microsoft.com da xato kodini qidiring</td></tr>
          <tr><td>SFC skanerlash</td><td>CMD ni Admin sifatida oching → <code>sfc /scannow</code></td></tr>
          <tr><td>DISM tuzatish</td><td><code>DISM /Online /Cleanup-Image /RestoreHealth</code></td></tr>
          <tr><td>Yangilanish komponentlarini tiklash</td><td>wuauserv ni to'xtating, SoftwareDistribution papkasini o'chirib tashlang, xizmatni qayta ishga tushiring</td></tr>
        </tbody>
      </table>
      <Callout kind="warn">Windows Update ni umuman o'chirmang. Yangilanishlarni kechiktirish kerak bo'lsa (sinov, muhim tizimlar), doimiy yangilanishlarni to'xtatadigan ro'yxatga olish kitobi hackidan emas, To'xtatib turish funksiyasidan foydalaning.</Callout>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
function SectionDefenderBasic() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="Windows Security Center" uz="" />
      <P><Term>Windows Security</Term> (formerly Windows Defender) is the built-in security suite in Windows 10/11. Open it: <Em>Start → Windows Security</Em> or the shield icon in the system tray.</P>
      <H2 num="§2" en="Virus and Threat Protection" uz="" />
      <P>The core antivirus engine. Key actions:</P>
      <ul>
        <li><Em>Quick scan</Em> — scans common malware locations (2-5 minutes)</li>
        <li><Em>Full scan</Em> — scans all files on all drives (30-60+ minutes)</li>
        <li><Em>Custom scan</Em> — scan a specific folder</li>
        <li><Em>Microsoft Defender Offline scan</Em> — boots into a separate environment to remove persistent malware</li>
      </ul>
      <H2 num="§3" en="Real-time Protection and Settings" uz="" />
      <table>
        <thead><tr><th>Setting</th><th>What it does</th><th>Recommendation</th></tr></thead>
        <tbody>
          <tr><td>Real-time protection</td><td>Scans files as they're accessed</td><td>Always ON</td></tr>
          <tr><td>Cloud-delivered protection</td><td>Checks files against cloud database</td><td>ON</td></tr>
          <tr><td>Automatic sample submission</td><td>Sends suspicious files to Microsoft</td><td>ON (unless air-gapped)</td></tr>
          <tr><td>Tamper protection</td><td>Prevents malware from disabling Defender</td><td>Always ON</td></tr>
          <tr><td>Controlled folder access</td><td>Blocks unauthorised apps from modifying Documents/Desktop</td><td>ON for high-risk users</td></tr>
        </tbody>
      </table>
      <H2 num="§4" en="Adding Exclusions" uz="" />
      <P>Sometimes Defender flags legitimate files (false positives). To add an exclusion:</P>
      <ol>
        <li>Windows Security → Virus &amp; threat protection → Manage settings</li>
        <li>Scroll to <Em>Exclusions</Em> → Add or remove exclusions</li>
        <li>Add: File, Folder, File type, or Process</li>
      </ol>
      <Callout kind="warn">Only add exclusions for files/folders you are certain are safe. Malware authors often instruct victims to add exclusions to bypass Defender. Never add <code>C:\</code> as an exclusion.</Callout>
      <H2 num="§5" en="When Defender Finds a Threat" uz="" />
      <P>Defender automatically quarantines detected threats. Check: Windows Security → Virus &amp; threat protection → <Em>Protection history</Em>. Options for each item:</P>
      <ul>
        <li><Em>Remove</Em> — permanently deletes the file</li>
        <li><Em>Restore</Em> — restores from quarantine (only for confirmed false positives)</li>
        <li><Em>Allow</Em> — whitelists the item (use with extreme caution)</li>
      </ul>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="Windows Security markazi" en="" />
      <P><Term>Windows Security</Term> (ilgari Windows Defender) — Windows 10/11 da o'rnatilgan xavfsizlik to'plami. Oching: <Em>Start → Windows Security</Em> yoki tizim belgisidagi qalqon ikonasi.</P>
      <H2 num="§2" uz="Virus va tahdidlardan himoya" en="" />
      <P>Asosiy antivirus mexanizmi. Asosiy harakatlar:</P>
      <ul>
        <li><Em>Tezkor skanerlash</Em> — umumiy zararli dastur joylashuvlarini skanerlaydi (2-5 daqiqa)</li>
        <li><Em>To'liq skanerlash</Em> — barcha disklardagi barcha fayllarni skanerlaydi (30-60+ daqiqa)</li>
        <li><Em>Maxsus skanerlash</Em> — muayyan papkani skanerlash</li>
        <li><Em>Microsoft Defender oflayn skanerlash</Em> — doimiy zararli dasturlarni olib tashlash uchun alohida muhitga yuklanadi</li>
      </ul>
      <H2 num="§3" uz="Real vaqtli himoya va sozlamalar" en="" />
      <table>
        <thead><tr><th>Sozlama</th><th>Nima qiladi</th><th>Tavsiya</th></tr></thead>
        <tbody>
          <tr><td>Real vaqtli himoya</td><td>Fayllarga kirilganda skanerlaydi</td><td>Har doim YOQILGAN</td></tr>
          <tr><td>Bulutga asoslangan himoya</td><td>Fayllarni bulut ma'lumotlar bazasi bilan tekshiradi</td><td>YOQILGAN</td></tr>
          <tr><td>Avtomatik namuna yuborish</td><td>Shubhali fayllarni Microsoftga yuboradi</td><td>YOQILGAN (havo oralig'isiz)</td></tr>
          <tr><td>Buzilishdan himoya</td><td>Zararli dasturlarning Defender ni o'chirishining oldini oladi</td><td>Har doim YOQILGAN</td></tr>
          <tr><td>Nazorat qilinadigan papkaga kirish</td><td>Ruxsatsiz dasturlarning Hujjatlar/Ish stolini o'zgartirishini bloklaydi</td><td>Yuqori xavfli foydalanuvchilar uchun YOQILGAN</td></tr>
        </tbody>
      </table>
      <H2 num="§4" uz="Istisnolar qo'shish" en="" />
      <P>Ba'zida Defender qonuniy fayllarni belgilaydi (noto'g'ri aniqlanish). Istisno qo'shish uchun:</P>
      <ol>
        <li>Windows Security → Virus va tahdidlardan himoya → Sozlamalarni boshqarish</li>
        <li><Em>Istisnolar</Em> ga o'ting → Istisnolarni qo'shish yoki olib tashlash</li>
        <li>Qo'shing: Fayl, Papka, Fayl turi yoki Jarayon</li>
      </ol>
      <Callout kind="warn">Faqat ishonchli bo'lgan fayllar/papkalar uchun istisnolar qo'shing. Zararli dastur mualliflari ko'pincha qurbonlarga Defender ni chetlab o'tish uchun istisnolar qo'shishni buyuradi. Hech qachon <code>C:\</code> ni istisno sifatida qo'shmang.</Callout>
      <H2 num="§5" uz="Defender tahdid topganda" en="" />
      <P>Defender aniqlangan tahdidlarni avtomatik ravishda karantinga oladi. Tekshirish: Windows Security → Virus va tahdidlardan himoya → <Em>Himoya tarixi</Em>. Har bir element uchun variantlar:</P>
      <ul>
        <li><Em>Olib tashlash</Em> — faylni butunlay o'chiradi</li>
        <li><Em>Tiklash</Em> — karantindan qayta tiklaydi (faqat tasdiqlangan noto'g'ri aniqlanishlar uchun)</li>
        <li><Em>Ruxsat berish</Em> — elementni oq ro'yxatga qo'shadi (juda ehtiyotkorlik bilan ishlating)</li>
      </ul>
    </section>
  );
}


// ─────────────────────────────────────────────────────────────
function SectionNetBasic() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="Networking Concepts for Windows Users" uz="" />
      <P>Every Windows PC on a network has an <Term>IP address</Term> — a unique number that identifies it on the network. To see your network configuration:</P>
      <P>GUI: <Em>Settings → Network &amp; internet → Properties</Em> (for your active connection)</P>
      <H2 num="§2" en="Key Network Terms" uz="" />
      <table>
        <thead><tr><th>Term</th><th>What it is</th><th>Example</th></tr></thead>
        <tbody>
          <tr><td>IP Address</td><td>Your device's network identity</td><td>192.168.1.100</td></tr>
          <tr><td>Subnet Mask</td><td>Defines the network vs host portion</td><td>255.255.255.0 (/24)</td></tr>
          <tr><td>Default Gateway</td><td>Router IP — traffic exits through here</td><td>192.168.1.1</td></tr>
          <tr><td>DNS Server</td><td>Translates hostnames to IP addresses</td><td>8.8.8.8 (Google DNS)</td></tr>
          <tr><td>DHCP</td><td>Server that auto-assigns IP settings</td><td>Your home router</td></tr>
          <tr><td>MAC Address</td><td>Hardware address of network card</td><td>00:1A:2B:3C:4D:5E</td></tr>
        </tbody>
      </table>
      <H2 num="§3" en="DHCP vs Static IP" uz="" />
      <table>
        <thead><tr><th></th><th>DHCP (Automatic)</th><th>Static (Manual)</th></tr></thead>
        <tbody>
          <tr><td>Setup</td><td>Zero config — router assigns</td><td>Must enter IP/mask/gateway/DNS</td></tr>
          <tr><td>Best for</td><td>Home users, laptops</td><td>Servers, printers, NAS</td></tr>
          <tr><td>IP changes?</td><td>May change at each lease renewal</td><td>Always the same</td></tr>
          <tr><td>GUI</td><td>Settings → Network → adapter → Edit (Automatic)</td><td>Settings → Network → adapter → Edit (Manual)</td></tr>
        </tbody>
      </table>
      <H2 num="§4" en="Essential Network Commands" uz="" />
      <div style={{overflowX:"auto",marginTop:10}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Command","What it shows","Common use"].map((h,i)=><th key={i} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-3)",fontWeight:600,fontFamily:"var(--font-mono)",fontSize:10}}>{h}</th>)}</tr></thead>
          <tbody>
            {[
              ["ipconfig","IP, subnet mask, gateway per adapter","Check current IP settings"],
              ["ipconfig /all","Full details: MAC, DHCP server, DNS, lease","Find DHCP server or MAC address"],
              ["ipconfig /flushdns","Clears DNS resolver cache","Fix stale DNS causing wrong sites"],
              ["ipconfig /release & /renew","Drop then request new DHCP lease","Fix IP address not assigned"],
              ["ping 8.8.8.8","Round-trip time to host","Test basic internet connectivity"],
              ["ping -t 8.8.8.8","Continuous ping (Ctrl+C to stop)","Monitor connection stability"],
              ["nslookup google.com","Resolve hostname via configured DNS","Test DNS resolution"],
              ["tracert 8.8.8.8","Each hop from PC to destination","Find where packets are dropping"],
              ["netstat -ano","All TCP/UDP connections with owning PIDs","Spot unexpected open ports"],
              ["pathping 8.8.8.8","tracert + packet loss stats per hop","Advanced route diagnostics"],
            ].map((r,i)=>(
              <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.01)"}}>
                {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:12}}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <H2 num="§5" en="Network Troubleshooting Workflow" uz="" />
      <Callout kind="tip">Settings → Network &amp; internet → Troubleshoot → Internet Connections runs the built-in wizard. It fixes most common issues automatically.</Callout>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="Windows foydalanuvchilari uchun tarmoq tushunchalari" en="" />
      <P>Tarmoqdagi har bir Windows kompyuterida <Term>IP manzil</Term> bor — uni tarmoqda aniqlaydigan noyob raqam. Tarmoq konfiguratsiyangizni ko'rish uchun:</P>
      <P>GUI: <Em>Sozlamalar → Tarmoq va internet → Xususiyatlar</Em> (faol ulanishingiz uchun)</P>
      <H2 num="§2" uz="Asosiy tarmoq atamalari" en="" />
      <table>
        <thead><tr><th>Atama</th><th>Nima</th><th>Misol</th></tr></thead>
        <tbody>
          <tr><td>IP manzil</td><td>Qurilmangizning tarmoq identifikatori</td><td>192.168.1.100</td></tr>
          <tr><td>Pastki tarmoq niqobi</td><td>Tarmoq va xost qismini belgilaydi</td><td>255.255.255.0 (/24)</td></tr>
          <tr><td>Standart shlyuz</td><td>Router IP — trafik shu orqali chiqadi</td><td>192.168.1.1</td></tr>
          <tr><td>DNS server</td><td>Xost nomlarini IP manzillarga aylantiradi</td><td>8.8.8.8 (Google DNS)</td></tr>
          <tr><td>DHCP</td><td>IP sozlamalarini avtomatik tayinlaydigan server</td><td>Uy routeringiz</td></tr>
          <tr><td>MAC manzil</td><td>Tarmoq kartasining qurilma manzili</td><td>00:1A:2B:3C:4D:5E</td></tr>
        </tbody>
      </table>
      <H2 num="§3" uz="DHCP va statik IP" en="" />
      <table>
        <thead><tr><th></th><th>DHCP (Avtomatik)</th><th>Statik (Qo'lda)</th></tr></thead>
        <tbody>
          <tr><td>Sozlash</td><td>Nol konfiguratsiya — router tayinlaydi</td><td>IP/maska/shlyuz/DNS kiritish kerak</td></tr>
          <tr><td>Eng yaxshi</td><td>Uy foydalanuvchilari, noutbuklar</td><td>Serverlar, printerlar, NAS</td></tr>
          <tr><td>IP o'zgaradimi?</td><td>Har ijaraga olish yangilanishida o'zgarishi mumkin</td><td>Har doim bir xil</td></tr>
          <tr><td>GUI</td><td>Sozlamalar → Tarmoq → adapter → Tahrirlash (Avtomatik)</td><td>Sozlamalar → Tarmoq → adapter → Tahrirlash (Qo'lda)</td></tr>
        </tbody>
      </table>
      <H2 num="§4" uz="Muhim tarmoq buyruqlari" en="" />
      <div style={{overflowX:"auto",marginTop:10}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Buyruq","Ko'rsatadigan narsalar","Qo'llanilishi"].map((h,i)=><th key={i} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-3)",fontWeight:600,fontFamily:"var(--font-mono)",fontSize:10}}>{h}</th>)}</tr></thead>
          <tbody>
            {[
              ["ipconfig","Har bir adapter uchun IP, maska, shlyuz","Joriy IP sozlamalarini tekshirish"],
              ["ipconfig /all","To'liq ma'lumot: MAC, DHCP server, DNS, ijara","DHCP server yoki MAC manzilini topish"],
              ["ipconfig /flushdns","DNS kesimini tozalash","Noto'g'ri saytlarga olib boradigan DNS ni tuzatish"],
              ["ipconfig /release va /renew","DHCP ijarasini tashlab, yangi so'rash","IP manzil tayinlanmagan xatoni tuzatish"],
              ["ping 8.8.8.8","Xostgacha davra vaqti","Asosiy internet ulanishni tekshirish"],
              ["ping -t 8.8.8.8","Uzluksiz ping (Ctrl+C to'xtatish)","Ulanish barqarorligini kuzatish"],
              ["nslookup google.com","Sozlangan DNS orqali xost nomini aniqlash","DNS ishlashini tekshirish"],
              ["tracert 8.8.8.8","Kompyuterdan manzilgacha har bir ko'chish","Paketlar qayerda yo'qolayotganini topish"],
              ["netstat -ano","Egasi PID bilan barcha TCP/UDP ulanishlar","Kutilmagan ochiq portlarni aniqlash"],
              ["pathping 8.8.8.8","tracert + har bir ko'chishdagi paket yo'qotish","Kengaytirilgan marshrutni tashxislash"],
            ].map((r,i)=>(
              <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.01)"}}>
                {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:12}}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <H2 num="§5" uz="Tarmoq muammolarini hal qilish tartibi" en="" />
      <Callout kind="tip">Sozlamalar → Tarmoq va internet → Muammolarni bartaraf etish → Internet ulanishlari — o'rnatilgan ustani ishga tushiradi. Ko'pgina umumiy muammolarni avtomatik ravishda tuzatadi.</Callout>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
function SectionFileShare() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="Network File Sharing Overview" uz="" />
      <P>Windows uses the <Term>SMB protocol</Term> (Server Message Block) to share files and printers across a local network. Shared resources are accessed via UNC paths like <code>\\SERVER\ShareName</code>.</P>
      <H2 num="§2" en="Sharing a Folder" uz="" />
      <ol>
        <li>Right-click the folder → <Em>Properties → Sharing → Share</Em></li>
        <li>Type username or group (e.g., "Everyone" for all network users)</li>
        <li>Set permission level: <Em>Read</Em> or <Em>Read/Write</Em></li>
        <li>Click <Em>Share</Em> — note the network path shown (e.g., <code>\\DESKTOP-ABC\Documents</code>)</li>
        <li>Ensure <Em>Network discovery</Em> and <Em>File and printer sharing</Em> are on:
          Settings → Network → Advanced network settings → Advanced sharing settings</li>
      </ol>
      <H2 num="§3" en="Accessing a Shared Folder" uz="" />
      <ul>
        <li><Em>File Explorer address bar</Em>: type <code>\\PC-NAME\ShareName</code> → Enter</li>
        <li><Em>Run dialog</Em>: Win+R → type <code>\\192.168.1.100\ShareName</code></li>
        <li><Em>Map Network Drive</Em>: assigns a drive letter (e.g., Z:) for easy repeated access</li>
      </ul>
      <H2 num="§4" en="Mapping a Network Drive" uz="" />
      <ol>
        <li>File Explorer → This PC → <Em>Map network drive</Em> (in the toolbar)</li>
        <li>Choose a drive letter (e.g., Z:)</li>
        <li>Enter the folder path: <code>\\SERVER\ShareName</code></li>
        <li>Check <Em>Reconnect at sign-in</Em> to make it persistent</li>
        <li>Click Finish — enter credentials if prompted</li>
      </ol>
      <H2 num="§5" en="Printer Sharing" uz="" />
      <ol>
        <li>Settings → Bluetooth &amp; devices → Printers &amp; scanners → click the printer → Printer properties</li>
        <li>Sharing tab → check <Em>Share this printer</Em> → give it a share name</li>
        <li>On other PCs: Settings → Printers &amp; scanners → Add a printer → select the shared printer</li>
      </ol>
      <Callout kind="warn">Sharing folders with "Everyone" + Read/Write on an unsecured network is a security risk. Use specific usernames or groups, and only share what's necessary.</Callout>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="Tarmoq orqali fayl ulashish umumiy ko'rinishi" en="" />
      <P>Windows mahalliy tarmoqda fayl va printerlarni ulashish uchun <Term>SMB protokolidan</Term> (Server Message Block) foydalanadi. Ulashilgan resurslar <code>\\SERVER\UlashishNomi</code> kabi UNC yo'llari orqali kiriladi.</P>
      <H2 num="§2" uz="Papkani ulashish" en="" />
      <ol>
        <li>Papkani o'ng tugma bilan bosing → <Em>Xususiyatlar → Ulashish → Ulashish</Em></li>
        <li>Foydalanuvchi nomi yoki guruhni kiriting (masalan, barcha tarmoq foydalanuvchilari uchun "Everyone")</li>
        <li>Ruxsat darajasini o'rnating: <Em>O'qish</Em> yoki <Em>O'qish/Yozish</Em></li>
        <li><Em>Ulashish</Em> ni bosing — ko'rsatilgan tarmoq yo'lini yozib oling (masalan, <code>\\DESKTOP-ABC\Documents</code>)</li>
        <li><Em>Tarmoqni kashf etish</Em> va <Em>Fayl va printer ulashish</Em> yoqilganligini tekshiring:
          Sozlamalar → Tarmoq → Kengaytirilgan tarmoq sozlamalari → Kengaytirilgan ulashish sozlamalari</li>
      </ol>
      <H2 num="§3" uz="Ulashilgan papkaga kirish" en="" />
      <ul>
        <li><Em>File Explorer manzil satri</Em>: <code>\\KOMPYUTER-NOMI\UlashishNomi</code> kiriting → Enter</li>
        <li><Em>Ishga tushirish dialogi</Em>: Win+R → <code>\\192.168.1.100\UlashishNomi</code> kiriting</li>
        <li><Em>Tarmoq drayverini moslashtirish</Em>: oson qayta kirish uchun disk harfi (masalan, Z:) tayinlaydi</li>
      </ul>
      <H2 num="§4" uz="Tarmoq drayverini moslashtirish" en="" />
      <ol>
        <li>File Explorer → Bu kompyuter → <Em>Tarmoq drayverini moslashtirish</Em> (asboblar panelidagi)</li>
        <li>Disk harfini tanlang (masalan, Z:)</li>
        <li>Papka yo'lini kiriting: <code>\\SERVER\UlashishNomi</code></li>
        <li>Uni doimiy qilish uchun <Em>Kirishda qayta ulash</Em> ni belgilang</li>
        <li>Tugatish ni bosing — so'ralsa hisob ma'lumotlarini kiriting</li>
      </ol>
      <H2 num="§5" uz="Printerni ulashish" en="" />
      <ol>
        <li>Sozlamalar → Bluetooth va qurilmalar → Printerlar va skanerlar → printerni bosing → Printer xususiyatlari</li>
        <li>Ulashish yorlig'i → <Em>Ushbu printerni ulash</Em> ni belgilang → ulashish nomi bering</li>
        <li>Boshqa kompyuterlarda: Sozlamalar → Printerlar va skanerlar → Printer qo'shish → ulashilgan printerni tanlang</li>
      </ol>
      <Callout kind="warn">Xavfsizlanmagan tarmoqda "Everyone" + O'qish/Yozish bilan papkalarni ulashish xavfsizlik xavfidir. Muayyan foydalanuvchi nomlari yoki guruhlaridan foydalaning va faqat zarur narsalarni ulashing.</Callout>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
function SectionBackupRestore() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="Why Backup Matters" uz="" />
      <P>Hardware fails. Ransomware encrypts files. Users accidentally delete things. The <Term>3-2-1 backup rule</Term> is the gold standard:</P>
      <H2 num="§2" en="System Restore" uz="" />
      <P><Term>System Restore</Term> creates snapshots called <Em>restore points</Em> of Windows system files and the registry. It does NOT back up personal files.</P>
      <ul>
        <li><Em>Enable</Em>: Control Panel → System → System Protection → Configure → Turn on system protection</li>
        <li><Em>Create manual point</Em>: System Protection → Create → give it a name</li>
        <li><Em>Restore</Em>: System Protection → System Restore → choose a restore point</li>
        <li>Windows creates restore points automatically before updates and app installations</li>
      </ul>
      <Callout kind="tip">If Windows misbehaves after an update or driver install, System Restore is often the fastest fix. It takes 15-30 minutes and does not affect your files.</Callout>
      <H2 num="§3" en="File History" uz="" />
      <P><Term>File History</Term> continuously backs up files in your Libraries, Desktop, Contacts, and Favorites to an external drive or network location.</P>
      <ol>
        <li>Connect an external drive</li>
        <li>Settings → Update &amp; Security → Backup → <Em>Add a drive</Em></li>
        <li>Turn on <Em>Automatically back up my files</Em></li>
        <li>Click <Em>More options</Em> to set backup frequency and retention period</li>
      </ol>
      <P>To restore: open the File History drive in Explorer → navigate to the file → select version → click the green restore button.</P>
      <H2 num="§4" en="Windows Backup (Full System Backup)" uz="" />
      <P>For a full system image backup: <Em>Control Panel → Backup and Restore (Windows 7)</Em> (yes, still present in Windows 10/11).</P>
      <ul>
        <li><Em>Create a system image</Em> — full disk image to external drive, DVD, or network</li>
        <li><Em>Create a system repair disc</Em> — bootable CD/USB to start recovery</li>
      </ul>
      <H2 num="§5" en="Windows Recovery Options" uz="" />
      <table>
        <thead><tr><th>Option</th><th>What it does</th><th>Loses files?</th></tr></thead>
        <tbody>
          <tr><td>System Restore</td><td>Roll back system files to earlier state</td><td>No</td></tr>
          <tr><td>Startup Repair</td><td>Fixes boot issues automatically</td><td>No</td></tr>
          <tr><td>Reset this PC (Keep files)</td><td>Reinstalls Windows, keeps Documents etc.</td><td>Apps removed</td></tr>
          <tr><td>Reset this PC (Remove all)</td><td>Full reinstall, everything deleted</td><td>Yes</td></tr>
          <tr><td>System Image Recovery</td><td>Restore from a full system image</td><td>Replaces everything</td></tr>
        </tbody>
      </table>
      <P>Access recovery: <Em>Settings → System → Recovery → Advanced startup → Restart now</Em></P>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="Nima uchun zaxiralash muhim" en="" />
      <P>Qurilma ishdan chiqadi. Ransomware fayllarni shifrlaydi. Foydalanuvchilar tasodifan o'chiradi. <Term>3-2-1 zaxiralash qoidasi</Term> oltin standart:</P>
      <H2 num="§2" uz="Tizimni tiklash" en="" />
      <P><Term>Tizimni tiklash</Term> (System Restore) — Windows tizim fayllari va ro'yxatga olish kitobining <Em>tiklash nuqtalari</Em> deb ataladigan suratlarini yaratadi. Shaxsiy fayllarni zaxiralamaydi.</P>
      <ul>
        <li><Em>Yoqish</Em>: Boshqaruv paneli → Tizim → Tizimni himoyalash → Sozlash → Tizimni himoyalashni yoqish</li>
        <li><Em>Qo'lda nuqta yaratish</Em>: Tizimni himoyalash → Yaratish → nom bering</li>
        <li><Em>Tiklash</Em>: Tizimni himoyalash → Tizimni tiklash → tiklash nuqtasini tanlang</li>
        <li>Windows yangilanishlar va dastur o'rnatishlaridan oldin avtomatik tiklash nuqtalarini yaratadi</li>
      </ul>
      <Callout kind="tip">Windows yangilanish yoki drayver o'rnatishdan keyin noto'g'ri ishlasa, Tizimni tiklash ko'pincha eng tez yechim. 15-30 daqiqa davom etadi va fayllaringizga ta'sir qilmaydi.</Callout>
      <H2 num="§3" uz="Fayl tarixi" en="" />
      <P><Term>Fayl tarixi</Term> (File History) — Kutubxonalar, Ish stoli, Kontaktlar va Sevimlilardagi fayllarni tashqi disk yoki tarmoq joyiga uzluksiz zaxiralaydi.</P>
      <ol>
        <li>Tashqi diskni ulang</li>
        <li>Sozlamalar → Yangilash va Xavfsizlik → Zaxiralash → <Em>Disk qo'shish</Em></li>
        <li><Em>Fayllarimni avtomatik zaxiralash</Em> ni yoqing</li>
        <li>Zaxiralash chastotasi va saqlash davrini o'rnatish uchun <Em>Ko'proq parametrlar</Em> ni bosing</li>
      </ol>
      <P>Tiklash uchun: Explorerdagi Fayl tarixi diskini oching → faylga o'ting → versiyani tanlang → yashil tiklash tugmasini bosing.</P>
      <H2 num="§4" uz="Windows zaxiralash (to'liq tizim zaxirasi)" en="" />
      <P>To'liq tizim tasviri zaxirasi uchun: <Em>Boshqaruv paneli → Zaxiralash va tiklash (Windows 7)</Em> (ha, Windows 10/11 da ham mavjud).</P>
      <ul>
        <li><Em>Tizim tasvirini yaratish</Em> — tashqi disk, DVD yoki tarmoqqa to'liq disk tasviri</li>
        <li><Em>Tizimni tiklash diskini yaratish</Em> — tiklashni boshlash uchun yuklash mumkin bo'lgan CD/USB</li>
      </ul>
      <H2 num="§5" uz="Windows tiklash parametrlari" en="" />
      <table>
        <thead><tr><th>Parametr</th><th>Nima qiladi</th><th>Fayllarni yo'qotadimi?</th></tr></thead>
        <tbody>
          <tr><td>Tizimni tiklash</td><td>Tizim fayllarini oldingi holatga qaytarish</td><td>Yo'q</td></tr>
          <tr><td>Ishga tushirishni ta'mirlash</td><td>Yuklash muammolarini avtomatik tuzatish</td><td>Yo'q</td></tr>
          <tr><td>Bu kompyuterni tiklash (Fayllarni saqlash)</td><td>Windowsni qayta o'rnatish, Hujjatlarni saqlash</td><td>Dasturlar o'chiriladi</td></tr>
          <tr><td>Bu kompyuterni tiklash (Hammasini o'chirish)</td><td>To'liq qayta o'rnatish, hamma narsa o'chiriladi</td><td>Ha</td></tr>
          <tr><td>Tizim tasviri orqali tiklash</td><td>To'liq tizim tasviridan tiklash</td><td>Hamma narsani almashtiradi</td></tr>
        </tbody>
      </table>
      <P>Tiklashga kirish: <Em>Sozlamalar → Tizim → Tiklash → Kengaytirilgan ishga tushirish → Hozir qayta ishga tushirish</Em></P>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
function SectionPSBasic() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="What is PowerShell?" uz="" />
      <P><Term>PowerShell</Term> is Microsoft's modern command-line shell and scripting language. Unlike CMD which works with plain text, PowerShell works with <Em>objects</Em> — structured data that can be filtered, sorted, and piped between commands. It's the standard tool for Windows administration.</P>
      <P>Open: <Em>Win+X → Windows PowerShell (Admin)</Em> or search "PowerShell" in Start.</P>
      <H2 num="§2" en="Essential Cmdlets" uz="" />
      <table>
        <thead><tr><th>Cmdlet</th><th>Action</th></tr></thead>
        <tbody>
          <tr><td><code>Get-Help Get-Process</code></td><td>Get help for any cmdlet</td></tr>
          <tr><td><code>Get-Process</code></td><td>List running processes</td></tr>
          <tr><td><code>Stop-Process -Name notepad</code></td><td>Kill a process by name</td></tr>
          <tr><td><code>Get-Service</code></td><td>List all services</td></tr>
          <tr><td><code>Start-Service -Name wuauserv</code></td><td>Start a service</td></tr>
          <tr><td><code>Get-EventLog -LogName System -Newest 20</code></td><td>Last 20 System events</td></tr>
          <tr><td><code>Get-NetIPAddress</code></td><td>Network adapter IPs</td></tr>
          <tr><td><code>Test-NetConnection google.com</code></td><td>Ping + TCP test</td></tr>
        </tbody>
      </table>
      <H2 num="§3" en="The Pipeline" uz="" />
      <P>The <Term>pipeline</Term> (<code>|</code>) passes the output of one cmdlet as input to the next — but as objects, not text.</P>
      <H2 num="§4" en="Variables and Scripts" uz="" />
      <P>Variables start with <code>$</code>. Assign with <code>=</code>, reference with the same name. Scripts are plain text files saved as <code>.ps1</code>.</P>
      <div style={{background:"var(--surface-2)",borderRadius:8,padding:"14px 18px",fontFamily:"var(--font-mono)",fontSize:12,lineHeight:2,margin:"12px 0",color:"var(--text-1)"}}>
        <span style={{color:"var(--c-auth)"}}>$name</span> = <span style={{color:"var(--accent)"}}>"Alice"</span><br/>
        <span style={{color:"var(--c-auth)"}}>$count</span> = <span style={{color:"var(--c-warn)"}}>42</span><br/>
        <span style={{color:"var(--text-2)"}}>Write-Output</span> <span style={{color:"var(--accent)"}}>"Hello, $name"</span>{"   "}<span style={{color:"var(--text-3)"}}># Hello, Alice</span><br/><br/>
        <span style={{color:"var(--text-3)"}}># Conditional</span><br/>
        <span style={{color:"var(--c-system)"}}>if</span> (<span style={{color:"var(--c-auth)"}}>$count</span> -gt <span style={{color:"var(--c-warn)"}}>10</span>) {"{"} <span style={{color:"var(--text-2)"}}>Write-Output</span> <span style={{color:"var(--accent)"}}>"Big"</span> {"}"} <span style={{color:"var(--c-system)"}}>else</span> {"{"} <span style={{color:"var(--text-2)"}}>Write-Output</span> <span style={{color:"var(--accent)"}}>"Small"</span> {"}"}<br/><br/>
        <span style={{color:"var(--text-3)"}}># Loop over all services</span><br/>
        <span style={{color:"var(--c-system)"}}>foreach</span> (<span style={{color:"var(--c-auth)"}}>$svc</span> <span style={{color:"var(--c-system)"}}>in</span> <span style={{color:"var(--text-2)"}}>Get-Service</span>) {"{"} <span style={{color:"var(--text-2)"}}>Write-Output</span> <span style={{color:"var(--c-auth)"}}>$svc</span>.Name {"}"}
      </div>
      <P>Run a script: <code>.\myscript.ps1</code>. Use <code>#</code> for comments. Execution policy must allow scripts first (see §5).</P>
      <H2 num="§5" en="Execution Policy" uz="" />
      <P>By default, PowerShell blocks script execution for security. Check and set:</P>
      <Callout kind="warn">Never set ExecutionPolicy to Unrestricted in production. RemoteSigned is the standard safe setting for administrators.</Callout>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="PowerShell nima?" en="" />
      <P><Term>PowerShell</Term> — Microsoftning zamonaviy buyruq qatori qobig'i va skript tili. Oddiy matn bilan ishlaydigan CMD dan farqli o'laroq, PowerShell <Em>ob'ektlar</Em> bilan ishlaydi — buyruqlar o'rtasida filtrlash, saralash va quvurdan o'tkazish mumkin bo'lgan tuzilgan ma'lumotlar. Bu Windows boshqaruvi uchun standart vosita.</P>
      <P>Ochish: <Em>Win+X → Windows PowerShell (Admin)</Em> yoki Start da "PowerShell" ni qidiring.</P>
      <H2 num="§2" uz="Muhim Cmdlet lar" en="" />
      <table>
        <thead><tr><th>Cmdlet</th><th>Harakat</th></tr></thead>
        <tbody>
          <tr><td><code>Get-Help Get-Process</code></td><td>Har qanday cmdlet uchun yordam olish</td></tr>
          <tr><td><code>Get-Process</code></td><td>Ishlaydigan jarayonlar ro'yxati</td></tr>
          <tr><td><code>Stop-Process -Name notepad</code></td><td>Jarayonni nom bo'yicha to'xtatish</td></tr>
          <tr><td><code>Get-Service</code></td><td>Barcha xizmatlar ro'yxati</td></tr>
          <tr><td><code>Start-Service -Name wuauserv</code></td><td>Xizmatni ishga tushirish</td></tr>
          <tr><td><code>Get-EventLog -LogName System -Newest 20</code></td><td>So'nggi 20 ta tizim hodisasi</td></tr>
          <tr><td><code>Get-NetIPAddress</code></td><td>Tarmoq adapteri IP lari</td></tr>
          <tr><td><code>Test-NetConnection google.com</code></td><td>Ping + TCP testi</td></tr>
        </tbody>
      </table>
      <H2 num="§3" uz="Quvur (Pipeline)" en="" />
      <P><Term>Quvur</Term> (<code>|</code>) bir cmdlet chiqishini keyingisiga kirish sifatida uzatadi — lekin matn sifatida emas, ob'ektlar sifatida.</P>
      <H2 num="§4" uz="O'zgaruvchilar va skriptlar" en="" />
      <P>O'zgaruvchilar <code>$</code> bilan boshlanadi. <code>=</code> bilan tayinlang, bir xil nom bilan murojaat qiling. Skriptlar <code>.ps1</code> kengaytmali oddiy matn fayllari.</P>
      <div style={{background:"var(--surface-2)",borderRadius:8,padding:"14px 18px",fontFamily:"var(--font-mono)",fontSize:12,lineHeight:2,margin:"12px 0",color:"var(--text-1)"}}>
        <span style={{color:"var(--c-auth)"}}>$ism</span> = <span style={{color:"var(--accent)"}}>"Ali"</span><br/>
        <span style={{color:"var(--c-auth)"}}>$son</span> = <span style={{color:"var(--c-warn)"}}>42</span><br/>
        <span style={{color:"var(--text-2)"}}>Write-Output</span> <span style={{color:"var(--accent)"}}>"Salom, $ism"</span>{"   "}<span style={{color:"var(--text-3)"}}># Salom, Ali</span><br/><br/>
        <span style={{color:"var(--text-3)"}}># Shartli ifoda</span><br/>
        <span style={{color:"var(--c-system)"}}>if</span> (<span style={{color:"var(--c-auth)"}}>$son</span> -gt <span style={{color:"var(--c-warn)"}}>10</span>) {"{"} <span style={{color:"var(--text-2)"}}>Write-Output</span> <span style={{color:"var(--accent)"}}>"Katta"</span> {"}"} <span style={{color:"var(--c-system)"}}>else</span> {"{"} <span style={{color:"var(--text-2)"}}>Write-Output</span> <span style={{color:"var(--accent)"}}>"Kichik"</span> {"}"}<br/><br/>
        <span style={{color:"var(--text-3)"}}># Barcha xizmatlar ustida tsikl</span><br/>
        <span style={{color:"var(--c-system)"}}>foreach</span> (<span style={{color:"var(--c-auth)"}}>$xiz</span> <span style={{color:"var(--c-system)"}}>in</span> <span style={{color:"var(--text-2)"}}>Get-Service</span>) {"{"} <span style={{color:"var(--text-2)"}}>Write-Output</span> <span style={{color:"var(--c-auth)"}}>$xiz</span>.Name {"}"}
      </div>
      <P>Skriptni ishga tushirish: <code>.\myscript.ps1</code>. Izohlar uchun <code>#</code> dan foydalaning. Avval bajarish siyosati skriptlarga ruxsat berishi kerak (§5 ga qarang).</P>
      <H2 num="§5" uz="Bajarish siyosati" en="" />
      <P>Standart holda, PowerShell xavfsizlik uchun skript bajarishini bloklaydi. Tekshirish va o'rnatish:</P>
      <Callout kind="warn">Hech qachon ishlab chiqarishda ExecutionPolicy ni Unrestricted ga o'rnatmang. RemoteSigned administratorlar uchun standart xavfsiz sozlama.</Callout>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
function SectionRDP() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="Remote Desktop Protocol Overview" uz="" />
      <P><Term>Remote Desktop Protocol (RDP)</Term> lets you connect to and control a remote Windows PC over a network, as if you were sitting in front of it. It runs on <Em>TCP port 3389</Em> and is built into all Windows Pro/Enterprise editions.</P>
      <H2 num="§2" en="Enabling RDP on the Target PC" uz="" />
      <ol>
        <li>Settings → System → <Em>Remote Desktop</Em></li>
        <li>Toggle <Em>Enable Remote Desktop</Em> → ON</li>
        <li>Note the <Em>PC name</Em> shown — you'll use this to connect</li>
        <li>Click <Em>Remote Desktop users</Em> to add users who can connect (Administrators can always connect)</li>
      </ol>
      <Callout kind="warn">Only enable RDP when needed. An internet-exposed RDP port is one of the most attacked services globally. Always use VPN + NLA when exposing RDP.</Callout>
      <H2 num="§3" en="Connecting via RDP" uz="" />
      <ol>
        <li>Open <Em>Remote Desktop Connection</Em>: Win+R → <code>mstsc</code></li>
        <li>Enter the computer name or IP address</li>
        <li>Click <Em>Show Options</Em> to configure display size, local resource sharing (drives, printers, clipboard)</li>
        <li>Click Connect → enter credentials</li>
      </ol>
      <H2 num="§4" en="Network Level Authentication (NLA)" uz="" />
      <P><Term>NLA</Term> requires the user to authenticate before a full RDP session is established. This prevents unauthenticated access to the login screen (which can be exploited). NLA is enabled by default and should be left on.</P>
      <H2 num="§5" en="RDP Troubleshooting" uz="" />
      <table>
        <thead><tr><th>Issue</th><th>Cause &amp; Fix</th></tr></thead>
        <tbody>
          <tr><td>Can't connect</td><td>RDP not enabled / firewall blocking port 3389 — check both</td></tr>
          <tr><td>Wrong credentials</td><td>Use domain\username format on domain PCs</td></tr>
          <tr><td>Certificate warning</td><td>Self-signed cert on target — safe to proceed on your own network</td></tr>
          <tr><td>Session limit reached</td><td>Windows desktop editions allow 1 RDP session only; Server supports multiple</td></tr>
          <tr><td>Blank screen</td><td>GPU driver issue — add <code>/admin</code> flag or try lower display settings</td></tr>
        </tbody>
      </table>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="Masofaviy ish stoli protokoli umumiy ko'rinishi" en="" />
      <P><Term>Masofaviy ish stoli protokoli (RDP)</Term> — tarmoq orqali masofaviy Windows kompyuteriga ulanish va boshqarish imkonini beradi, go'yo uning oldida o'tirgandek. <Em>TCP port 3389</Em> da ishlaydi va barcha Windows Pro/Enterprise nashrlarda o'rnatilgan.</P>
      <H2 num="§2" uz="Maqsadli kompyuterda RDP ni yoqish" en="" />
      <ol>
        <li>Sozlamalar → Tizim → <Em>Masofaviy ish stoli</Em></li>
        <li><Em>Masofaviy ish stolini yoqish</Em> ni YOQING</li>
        <li>Ko'rsatilgan <Em>Kompyuter nomini</Em> yozib oling — ulanish uchun ishlatiladi</li>
        <li>Ulanadigan foydalanuvchilarni qo'shish uchun <Em>Masofaviy ish stoli foydalanuvchilari</Em> ni bosing (Administratorlar har doim ulana oladi)</li>
      </ol>
      <Callout kind="warn">RDP ni faqat kerak bo'lganda yoqing. Internet ga ochiq RDP porti dunyo bo'ylab eng ko'p hujumga uchragan xizmatlardan biri. RDP ni ochganda har doim VPN + NLA dan foydalaning.</Callout>
      <H2 num="§3" uz="RDP orqali ulanish" en="" />
      <ol>
        <li><Em>Masofaviy ish stoli ulanishini</Em> oching: Win+R → <code>mstsc</code></li>
        <li>Kompyuter nomi yoki IP manzilini kiriting</li>
        <li>Displey hajmi, mahalliy resurslarni ulashishni (disklar, printerlar, bufer) sozlash uchun <Em>Parametrlarni ko'rsatish</Em> ni bosing</li>
        <li>Ulanish ni bosing → hisob ma'lumotlarini kiriting</li>
      </ol>
      <H2 num="§4" uz="Tarmoq darajasida autentifikatsiya (NLA)" en="" />
      <P><Term>NLA</Term> — to'liq RDP seansi o'rnatilishidan oldin foydalanuvchidan autentifikatsiya talab qiladi. Bu kirish ekraniga autentifikatsiyasiz kirishning oldini oladi (bu suiiste'mol qilinishi mumkin). NLA standart holda yoqilgan va yoqiq qolishi kerak.</P>
      <H2 num="§5" uz="RDP ni tuzatish" en="" />
      <table>
        <thead><tr><th>Muammo</th><th>Sabab va yechim</th></tr></thead>
        <tbody>
          <tr><td>Ulanib bo'lmaydi</td><td>RDP yoqilmagan / xavfsizlik devori 3389 portini bloklayapti — ikkalasini tekshiring</td></tr>
          <tr><td>Noto'g'ri hisob ma'lumotlari</td><td>Domen kompyuterlarida domen\foydalanuvchi_nomi formatini ishlating</td></tr>
          <tr><td>Sertifikat ogohlantirishlari</td><td>Maqsadli kompyuterdagi o'z-o'zini imzolagan sertifikat — o'z tarmog'ingizda xavfsiz davom ettirish mumkin</td></tr>
          <tr><td>Seans chekloviga yetildi</td><td>Windows ish stoli nashrlari faqat 1 RDP seaniga ruxsat beradi; Server bir nechtasini qo'llab-quvvatlaydi</td></tr>
          <tr><td>Bo'sh ekran</td><td>GPU drayver muammosi — <code>/admin</code> flagini qo'shing yoki pastroq displey sozlamalarini sinab ko'ring</td></tr>
        </tbody>
      </table>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
function SectionFirewallBasic() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="Windows Firewall Overview" uz="" />
      <P><Term>Windows Defender Firewall</Term> is a host-based stateful firewall built into every Windows installation. It filters inbound and outbound network traffic based on rules. Access via: <Em>Settings → Privacy &amp; security → Windows Security → Firewall &amp; network protection</Em>, or <code>wf.msc</code> for advanced settings.</P>
      <H2 num="§2" en="Network Profiles" uz="" />
      <P>The firewall applies different rule sets based on the detected network type:</P>
      <table>
        <thead><tr><th>Profile</th><th>When used</th><th>Default stance</th></tr></thead>
        <tbody>
          <tr><td>Domain</td><td>Domain-joined PCs on corp network</td><td>Managed by Group Policy</td></tr>
          <tr><td>Private</td><td>Trusted home or work networks</td><td>Allows file/printer sharing</td></tr>
          <tr><td>Public</td><td>Airports, coffee shops, unknown networks</td><td>Most restrictive — blocks discovery</td></tr>
        </tbody>
      </table>
      <H2 num="§3" en="Checking Firewall Status" uz="" />
      <P>Windows Security → Firewall &amp; network protection — you'll see Domain / Private / Public with ON/OFF status. All three should normally be ON.</P>
      <H2 num="§4" en="Advanced Firewall — wf.msc" uz="" />
      <P>Run <code>wf.msc</code> for the full Windows Defender Firewall with Advanced Security console.</P>
      <P>Creating a new inbound rule:</P>
      <ol>
        <li>wf.msc → Inbound Rules → <Em>New Rule</Em> (right panel)</li>
        <li>Rule type: Port</li>
        <li>Protocol: TCP, port: 8080</li>
        <li>Action: Allow the connection</li>
        <li>Profiles: check as appropriate</li>
        <li>Name it and click Finish</li>
      </ol>
      <H2 num="§5" en="Testing the Firewall" uz="" />
      <Callout kind="warn">Never turn off the firewall for "testing" and forget to re-enable it. If an app needs a port opened, create a specific rule rather than disabling the firewall entirely.</Callout>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="Windows xavfsizlik devori umumiy ko'rinishi" en="" />
      <P><Term>Windows Defender Firewall</Term> — har bir Windows o'rnatmasiga o'rnatilgan xost asosidagi holat saqlash xavfsizlik devori. Qoidalar asosida kiruvchi va chiquvchi tarmoq trafikini filtrlaydi. Kirish: <Em>Sozlamalar → Maxfiylik va xavfsizlik → Windows Security → Xavfsizlik devori va tarmoq himoyasi</Em>, yoki kengaytirilgan sozlamalar uchun <code>wf.msc</code>.</P>
      <H2 num="§2" uz="Tarmoq profillari" en="" />
      <P>Xavfsizlik devori aniqlangan tarmoq turiga qarab turli qoidalar to'plamini qo'llaydi:</P>
      <table>
        <thead><tr><th>Profil</th><th>Qachon ishlatiladi</th><th>Standart holat</th></tr></thead>
        <tbody>
          <tr><td>Domen</td><td>Korporativ tarmoqda domenga qo'shilgan kompyuterlar</td><td>Group Policy tomonidan boshqariladi</td></tr>
          <tr><td>Shaxsiy</td><td>Ishonchli uy yoki ish tarmoqlari</td><td>Fayl/printer ulashishga ruxsat beradi</td></tr>
          <tr><td>Ommaviy</td><td>Aeroportlar, qahvaxonalar, noma'lum tarmoqlar</td><td>Eng cheklovchi — kashfiyotni bloklaydi</td></tr>
        </tbody>
      </table>
      <H2 num="§3" uz="Xavfsizlik devori holatini tekshirish" en="" />
      <P>Windows Security → Xavfsizlik devori va tarmoq himoyasi — Domen / Shaxsiy / Ommaviy ni YOQILGAN/O'CHIRILGAN holati bilan ko'rasiz. Odatda uchtasi ham YOQILGAN bo'lishi kerak.</P>
      <H2 num="§4" uz="Kengaytirilgan xavfsizlik devori — wf.msc" en="" />
      <P>To'liq Windows Defender Firewall with Advanced Security konsolini ochish uchun <code>wf.msc</code> ni ishga tushiring.</P>
      <P>Yangi kiruvchi qoida yaratish:</P>
      <ol>
        <li>wf.msc → Kiruvchi qoidalar → <Em>Yangi qoida</Em> (o'ng panel)</li>
        <li>Qoida turi: Port</li>
        <li>Protokol: TCP, port: 8080</li>
        <li>Harakat: Ulanishga ruxsat berish</li>
        <li>Profil: mosiga qarab belgilang</li>
        <li>Nomi bering va Tugatish ni bosing</li>
      </ol>
      <H2 num="§5" uz="Xavfsizlik devorini sinash" en="" />
      <Callout kind="warn">Xavfsizlik devorini "sinov" uchun o'chirib, qayta yoqishni unutmang. Agar dasturga port kerak bo'lsa, xavfsizlik devorini butunlay o'chirish o'rniga muayyan qoida yarating.</Callout>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
function SectionBitLockerBasic() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="What is BitLocker?" uz="" />
      <P><Term>BitLocker</Term> is Windows' full-disk encryption feature, available on Pro/Enterprise/Education editions. It encrypts the entire drive using <Em>AES-256</Em>, protecting data if the device is lost or stolen. Even if someone removes the drive and puts it in another PC, the data is unreadable without the key.</P>
      <H2 num="§2" en="TPM Requirement" uz="" />
      <P>BitLocker works best with a <Term>TPM 2.0</Term> (Trusted Platform Module) chip — a secure hardware chip that stores the encryption key and verifies the boot process hasn't been tampered with.</P>
      <table>
        <thead><tr><th>Scenario</th><th>Unlock method</th></tr></thead>
        <tbody>
          <tr><td>PC with TPM 2.0</td><td>Automatic unlock at boot (seamless)</td></tr>
          <tr><td>TPM + PIN</td><td>TPM validates boot + user enters PIN</td></tr>
          <tr><td>No TPM</td><td>USB key required at every boot (requires Group Policy change)</td></tr>
          <tr><td>Recovery situation</td><td>48-digit Recovery Key (must be backed up!)</td></tr>
        </tbody>
      </table>
      <H2 num="§3" en="Enabling BitLocker" uz="" />
      <ol>
        <li>Open <Em>Control Panel → BitLocker Drive Encryption</Em> (or search "Manage BitLocker")</li>
        <li>Click <Em>Turn on BitLocker</Em> next to the C: drive</li>
        <li>Choose how to unlock at startup: TPM only / TPM + PIN / USB key</li>
        <li>Choose how to back up your recovery key: <Em>Microsoft account</Em>, <Em>USB flash drive</Em>, <Em>file</Em>, or <Em>print</Em></li>
        <li>Choose encryption mode: <Em>New encryption mode (XTS-AES 128-bit)</Em> for fixed drives</li>
        <li>Click <Em>Start encrypting</Em> — runs in background, PC usable during encryption</li>
      </ol>
      <H2 num="§4" en="Recovery Key — Critical Step" uz="" />
      <P>The <Term>Recovery Key</Term> is a 48-digit code that unlocks the drive if TPM fails, you change BIOS settings, or you forget your PIN. <Em>You must save it somewhere safe.</Em></P>
      <ul>
        <li>Best: Save to Microsoft Account (accessible from account.microsoft.com)</li>
        <li>Good: Print and store in a safe</li>
        <li>Never: Store only on the encrypted drive itself</li>
      </ul>
      <H2 num="§5" en="BitLocker To Go — Removable Drives" uz="" />
      <P>BitLocker To Go encrypts USB drives and external hard drives. Same process — right-click the drive in Explorer → <Em>Turn on BitLocker</Em>. Uses a password instead of TPM.</P>
      <Callout kind="warn">If you lose your Recovery Key and can't boot, your data is gone forever. There is no backdoor. Always back up the recovery key before enabling BitLocker.</Callout>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="BitLocker nima?" en="" />
      <P><Term>BitLocker</Term> — Windows ning to'liq disk shifrlash xususiyati, Pro/Enterprise/Education nashrlarda mavjud. Butun diskni <Em>AES-256</Em> yordamida shifrlaydi, qurilma yo'qolgan yoki o'g'irlangan holda ma'lumotlarni himoya qiladi. Hatto kimdir diskni chiqarib boshqa kompyuterga qo'ysada, kalit bo'lmasa ma'lumotlar o'qib bo'lmaydi.</P>
      <H2 num="§2" uz="TPM talabi" en="" />
      <P>BitLocker <Term>TPM 2.0</Term> (Ishonchli platforma moduli) chipi bilan eng yaxshi ishlaydi — shifrlash kalitini saqlaydigan va yuklash jarayoni buzilmaganligini tekshiradigan xavfsiz apparat chipi.</P>
      <table>
        <thead><tr><th>Holat</th><th>Qulfni ochish usuli</th></tr></thead>
        <tbody>
          <tr><td>TPM 2.0 li kompyuter</td><td>Yuklashda avtomatik qulfni ochish (muammosiz)</td></tr>
          <tr><td>TPM + PIN</td><td>TPM yuklashni tekshiradi + foydalanuvchi PIN kiritadi</td></tr>
          <tr><td>TPM yo'q</td><td>Har yuklashda USB kalit kerak (Group Policy o'zgartirishini talab qiladi)</td></tr>
          <tr><td>Tiklash holati</td><td>48 raqamli Tiklash kaliti (zaxiralanishi shart!)</td></tr>
        </tbody>
      </table>
      <H2 num="§3" uz="BitLocker ni yoqish" en="" />
      <ol>
        <li><Em>Boshqaruv paneli → BitLocker Disk Shifrlash</Em> ni oching (yoki "Manage BitLocker" ni qidiring)</li>
        <li>C: drayveri yonidagi <Em>BitLocker ni yoqish</Em> ni bosing</li>
        <li>Yuklashda qulfni qanday ochishni tanlang: Faqat TPM / TPM + PIN / USB kalit</li>
        <li>Tiklash kalitini qanday zaxiralashni tanlang: <Em>Microsoft hisobi</Em>, <Em>USB flesh-disk</Em>, <Em>fayl</Em> yoki <Em>chop etish</Em></li>
        <li>Shifrlash rejimini tanlang: Sabit disklar uchun <Em>Yangi shifrlash rejimi (XTS-AES 128-bit)</Em></li>
        <li><Em>Shifrashni boshlash</Em> ni bosing — fonda ishlaydi, shifrlash paytida kompyuter ishlatish mumkin</li>
      </ol>
      <H2 num="§4" uz="Tiklash kaliti — Muhim qadam" en="" />
      <P><Term>Tiklash kaliti</Term> — TPM ishdan chiqsa, BIOS sozlamalarini o'zgartirsangiz yoki PIN ni unutsangiz diskni ochadigan 48 raqamli kod. <Em>Uni xavfsiz joyda saqlashingiz shart.</Em></P>
      <ul>
        <li>Eng yaxshi: Microsoft hisobiga saqlash (account.microsoft.com orqali kirish mumkin)</li>
        <li>Yaxshi: Chop etib xavfsiz joyda saqlash</li>
        <li>Hech qachon: Faqat shifrlangan diskning o'zida saqlash</li>
      </ul>
      <H2 num="§5" uz="BitLocker To Go — Olinadigan disklar" en="" />
      <P>BitLocker To Go USB disklar va tashqi qattiq disklarni shifrlaydi. Bir xil jarayon — Explorerda diskni o'ng tugma bilan bosing → <Em>BitLocker ni yoqish</Em>. TPM o'rniga paroldan foydalanadi.</P>
      <Callout kind="warn">Tiklash kalitini yo'qotsangiz va yuklay olmasangiz, ma'lumotlaringiz abadiy yo'qoladi. Orqa eshik yo'q. BitLocker ni yoqishdan oldin har doim tiklash kalitini zaxiralang.</Callout>
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
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
function SectionUserAccounts() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="User Accounts and Profiles" uz="" />
      <P>Every security decision in Windows ultimately traces back to <Term>who is running the code</Term>. User accounts define identity; the profile stores per-user state; credentials are the proof of identity. Understanding how Windows stores, hashes, and uses credentials — and where attackers exploit that chain — is foundational to both offensive and defensive work.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.1 — Account Types</h3>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12}}>
        {[
          {type:"Local Administrator",color:"var(--c-err)",desc:"Full control over the local machine. Built-in account: RID 500. Even with UAC, admin users hold a split token — filtered (medium IL) at login, elevated on demand. The built-in Administrator account bypasses UAC by default (auto-elevated)."},
          {type:"Standard User",color:"var(--c-system)",desc:"Can run programs and change own settings. Cannot install software system-wide, modify system files, or change other users' settings. Runs at Medium Integrity Level. The correct default for day-to-day use."},
          {type:"Guest",color:"var(--text-2)",desc:"RID 501. Disabled by default since Windows XP SP2. Extremely limited — no persistent profile changes. Was historically exploited for lateral movement; disable if present."},
          {type:"SYSTEM (NT AUTHORITY\\SYSTEM)",color:"var(--c-err)",desc:"Not a real logon account — a special identity used by the OS and services. Has SeDebugPrivilege, SeTcbPrivilege, and unrestricted local access. Attacker goal: code running as SYSTEM = full machine compromise."},
          {type:"LocalService (NT AUTHORITY\\LocalService)",color:"var(--c-warn)",desc:"Reduced-privilege service account. No network access. Used by EventLog, nsi. SID: S-1-5-19."},
          {type:"NetworkService (NT AUTHORITY\\NetworkService)",color:"var(--c-warn)",desc:"Reduced privilege locally but authenticates over the network as the machine account. Used by DNS Client, WMI. SID: S-1-5-20."},
          {type:"TrustedInstaller",color:"#b48cff",desc:"Owner of most Windows system files. Even SYSTEM cannot modify them without first taking ownership. NT SERVICE\\TrustedInstaller is why you get 'Access denied' even as admin."},
          {type:"WDAGUtilityAccount",color:"var(--text-2)",desc:"Windows Defender Application Guard sandboxed browser account. Auto-managed, should never be used interactively."},
        ].map((item,i)=>(
          <div key={i} style={{padding:"10px 12px",borderRadius:8,background:`${item.color}08`,border:`1px solid ${item.color}22`}}>
            <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:item.color,fontWeight:700,marginBottom:5}}>{item.type}</div>
            <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.6}}>{item.desc}</div>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.2 — SAM Database and SID Structure</h3>
      <P>Local accounts are stored in the <Term>SAM (Security Account Manager)</Term> database — a registry hive at <code style={{fontFamily:"var(--font-mono)",fontSize:12,background:"rgba(255,255,255,0.06)",padding:"1px 6px",borderRadius:4}}>C:\Windows\System32\config\SAM</code>. It is locked by the SYSTEM process while Windows is running — you cannot copy it directly. The SAM hive stores password hashes encrypted with a key derived from the SYSTEM hive (historically called SYSKEY, now always enabled).</P>
      <P>Every account has a <Term>SID (Security Identifier)</Term> — a unique identifier used in ACLs and tokens:</P>
      <Callout color="var(--c-system)" icon="info" titleEn="RID 500 vs renamed Administrator" titleUz="">
        Many organizations rename the built-in Administrator account (RID 500) to something else, thinking it hides it. The SID — including the RID 500 — is still visible in access tokens and event logs. Attackers enumerate the RID, not the name. Renaming provides no real security.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.3 — NTLM Password Hashing</h3>
      <P>Windows stores passwords as <Term>NTLM hashes</Term> (also called NT hashes). The algorithm:</P>
      <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:12}}>
        {[
          {step:"1. Input",desc:"User's password in plaintext, e.g., 'P@ssw0rd'"},
          {step:"2. Encode",desc:"Convert to UTF-16LE encoding (little-endian 16-bit Unicode)"},
          {step:"3. Hash",desc:"Compute MD4 hash of the UTF-16LE bytes → 16-byte (32 hex char) NTLM hash"},
          {step:"4. Store",desc:"Hash stored in SAM hive, encrypted with SYSKEY-derived key. Also cached in LSASS memory as a credential."},
        ].map((item,i)=>(
          <div key={i} style={{display:"flex",gap:12,padding:"8px 12px",borderRadius:6,background:"rgba(255,255,255,0.02)",border:"1px solid var(--border)"}}>
            <span style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--accent)",minWidth:55,flexShrink:0,fontWeight:700}}>{item.step}</span>
            <span style={{fontSize:13,color:"var(--text-1)"}}>{item.desc}</span>
          </div>
        ))}
      </div>
      <Callout color="var(--c-err)" icon="warning" titleEn="NTLM hashes ARE the password for Pass-the-Hash" titleUz="">
        NTLM authentication doesn't require the plaintext password — it only requires the hash. An attacker who extracts the NTLM hash from SAM or LSASS can authenticate as that user without ever cracking the password. This is <em>Pass-the-Hash</em> (PtH) — one of the most devastating lateral movement techniques in Windows environments.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.4 — User Profile Structure</h3>
      <P>When a user logs in for the first time, Windows creates a <Term>user profile</Term> at <code style={{fontFamily:"var(--font-mono)",fontSize:12,background:"rgba(255,255,255,0.06)",padding:"1px 6px",borderRadius:4}}>C:\Users\[username]\</code> (copied from <code>C:\Users\Default</code>). Key directories and files:</P>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Path (relative to C:\\Users\\user\\)","Contents","Security / Forensic Notes"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["NTUSER.DAT","User registry hive — mounted as HKCU at logon","Contains run keys, shell folder paths, most recently used (MRU) lists — critical forensic artifact"],
            ["AppData\\Local","Machine-local app data — not synced","Browser caches, Temp files, app databases (e.g., Chrome profile)"],
            ["AppData\\Roaming","Synced in domain environments (roaming profile)","Windows credentials XML, SSH keys, Outlook profiles, many app configs"],
            ["AppData\\LocalLow","Low-integrity process app data","IE/Edge sandbox data, protected-mode plugin data"],
            ["AppData\\Local\\Microsoft\\Windows\\INetCache","IE/Edge cache","Forensic: downloaded file evidence even after browser history cleared"],
            ["AppData\\Local\\Microsoft\\Windows\\Recent","LNK shortcuts (jump lists)","Evidence of file access with timestamps and original file paths"],
            ["AppData\\Local\\Microsoft\\Credentials","DPAPI-encrypted credential blobs","Stored passwords (Credential Manager, IE saved passwords, WiFi keys)"],
            ["AppData\\Roaming\\Microsoft\\Windows\\PowerShell\\PSReadLine\\ConsoleHost_history.txt","PowerShell command history","Attacker commands — critical forensic find"],
            ["Desktop, Documents, Downloads","User files","Malware drop zone — check for unexpected EXEs/scripts"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?10:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.5 — DPAPI (Data Protection API)</h3>
      <P><Term>DPAPI</Term> is Windows' built-in secret protection mechanism. It encrypts blobs using a <em>master key</em> derived from the user's password (and optionally a machine key). The key never leaves the machine in plaintext — Windows re-derives it on the fly from the user's credentials. DPAPI protects: Credential Manager blobs, Chrome/Edge saved passwords, WiFi PSK keys, certificate private keys, SSH agent keys.</P>
      <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:12}}>
        {[
          "User logs in → LSASS derives master key from password + SID + entropy",
          "Master key encrypted with user's password hash → stored in AppData\\Roaming\\Microsoft\\Protect\\[SID]\\",
          "Application calls CryptProtectData(plaintext, NULL, NULL, …) → DPAPI returns encrypted blob",
          "Blob stored by app (Credential Manager, Chrome, etc.)",
          "Decryption: CryptUnprotectData(blob) → DPAPI looks up master key → decrypts blob using master key",
          "Attack: if attacker has the user's NTLM hash or password, they can re-derive the master key offline and decrypt all DPAPI blobs (Mimikatz: dpapi::masterkey /in:… /hash:NTLM)",
        ].map((step,i)=>(
          <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",padding:"8px 12px",borderRadius:6,background:"rgba(255,255,255,0.02)",border:"1px solid var(--border)"}}>
            <span style={{fontFamily:"var(--font-mono)",fontSize:12,color:"var(--accent)",minWidth:20,flexShrink:0}}>{i+1}.</span>
            <span style={{fontSize:13,color:"var(--text-1)"}}>{step}</span>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.6 — Credential Attack Techniques</h3>
      <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:12}}>
        {[
          {title:"SAM + SYSTEM Extraction (Offline)",color:"var(--c-attack)",body:<>The SAM hive is encrypted with a key from the SYSTEM hive. Extract both: <code>reg save HKLM\SAM sam.hiv</code> and <code>reg save HKLM\SYSTEM system.hiv</code> (requires admin). Then use <code>secretsdump.py -sam sam.hiv -system system.hiv LOCAL</code> (Impacket) to extract all NTLM hashes offline. Detection: reg save creates EventID 4663 (if object access auditing enabled) + large registry file created in unusual path.</>},
          {title:"LSASS Memory Dump",color:"var(--c-err)",body:<>LSASS holds credentials of all logged-in users in memory: NTLM hashes, Kerberos tickets, cleartext (WDigest, legacy). Attack: <code>procdump -ma lsass.exe lsass.dmp</code> or Task Manager → Create dump → open with Mimikatz. Detection: Sysmon Event 10 (ProcessAccess on lsass.exe with PROCESS_VM_READ). Microsoft Defender detects procdump targeting lsass. PPL (Protected Process Light) + Credential Guard are mitigations.</>},
          {title:"Pass-the-Hash (PtH)",color:"var(--c-warn)",body:<>Use an extracted NTLM hash to authenticate without the plaintext password: <code>pth-winexe //target -U DOMAIN/user%hash cmd</code> or Mimikatz <code>sekurlsa::pth /user:admin /ntlm:HASH /domain:target</code>. Works because NTLM authentication only requires the hash, not the password. Mitigation: LAPS (random per-machine local admin passwords), Credential Guard (removes NTLM hash from LSASS), Protected Users security group (disables NTLM).</>},
          {title:"Credential Manager Extraction",color:"var(--c-system)",body:<>Windows stores saved credentials (RDP passwords, network shares, website logins) in Credential Manager, encrypted with DPAPI. Extract: <code>cmdkey /list</code> (list saved credentials), Mimikatz <code>dpapi::cred</code>, or PowerShell <code>[Windows.Security.Credentials.PasswordVault]::new().RetrieveAll()</code> for web credentials. Browser passwords also DPAPI-protected — tools like SharpChrome extract them.</>},
        ].map((item,i)=>(
          <div key={i} style={{padding:"14px 16px",borderRadius:10,background:`${item.color}08`,border:`1px solid ${item.color}30`}}>
            <div style={{fontFamily:"var(--font-display)",fontSize:14,fontWeight:700,color:item.color,marginBottom:8}}>{item.title}</div>
            <div style={{fontSize:13,color:"var(--text-1)",lineHeight:1.65}}>{item.body}</div>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.7 — Practical Commands</h3>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="Foydalanuvchi Hisoblari va Profillari" en="" />
      <P>Windows dagi har bir xavfsizlik qarori oxir-oqibat <Term>kim kodni bajarayotgani</Term>ga qaytadi. Foydalanuvchi hisoblari identifikatorni belgilaydi; profil foydalanuvchiga xos holatni saqlaydi; hisob ma'lumotlari identifikatorning isboti. Windows hisob ma'lumotlarini qanday saqlashi, hashlashi va ishlatishini — va hujumchilar bu zanjirni qanday ekspluatatsiya qilishini tushunish hujumkor va himoyaviy ish uchun ham asosiy hisoblanadi.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.1 — Akkount Turlari</h3>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12}}>
        {[
          {type:"Mahalliy Administrator",color:"var(--c-err)",desc:"Mahalliy mashina ustidan to'liq nazorat. O'rnatilgan akkount: RID 500. UAC bilan ham, admin foydalanuvchilar ajratilgan tokenga ega — kirishda filtrlangan (o'rta IL), talab bo'yicha ko'tarilgan. O'rnatilgan Administrator akkaunti standart bo'yicha UAC ni chetlab o'tadi (auto-elevated)."},
          {type:"Standart Foydalanuvchi",color:"var(--c-system)",desc:"Dasturlarni ishga tushirishi va o'z sozlamalarini o'zgartirishi mumkin. Tizim bo'yicha dastur o'rnata olmaydi, tizim fayllarini o'zgartira olmaydi. O'rta Yaxlitlik Darajasida ishlaydi. Kundalik foydalanish uchun to'g'ri standart."},
          {type:"Mehmon",color:"var(--text-2)",desc:"RID 501. Windows XP SP2 dan beri standart bo'yicha o'chirilgan. Juda cheklangan — doimiy profil o'zgarishlari yo'q. Tarixan lateral movement uchun ekspluatatsiya qilingan; mavjud bo'lsa o'chiring."},
          {type:"SYSTEM (NT AUTHORITY\\SYSTEM)",color:"var(--c-err)",desc:"Haqiqiy kirish akkaunti emas — OS va xizmatlar tomonidan ishlatiladigan maxsus identitet. SeDebugPrivilege, SeTcbPrivilege va chegsiz mahalliy kirishga ega. Hujumchi maqsadi: SYSTEM sifatida ishlaydigan kod = to'liq mashina buzilishi."},
          {type:"LocalService (NT AUTHORITY\\LocalService)",color:"var(--c-warn)",desc:"Kamaytarilgan imtiyozli xizmat akkaunti. Tarmoq kirishi yo'q. EventLog, nsi tomonidan ishlatiladi. SID: S-1-5-19."},
          {type:"NetworkService (NT AUTHORITY\\NetworkService)",color:"var(--c-warn)",desc:"Mahalliy kamaytarilgan imtiyoz, lekin tarmoq orqali mashina akkaunti sifatida autentifikatsiya qiladi. DNS Client, WMI tomonidan ishlatiladi. SID: S-1-5-20."},
          {type:"TrustedInstaller",color:"#b48cff",desc:"Ko'p Windows tizim fayllarining egasi. Hatto SYSTEM ham egalikni olmasa ularni o'zgartira olmaydi. NT SERVICE\\TrustedInstaller admin sifatida ham 'Kirish rad etildi' olishingizning sababi."},
          {type:"WDAGUtilityAccount",color:"var(--text-2)",desc:"Windows Defender Application Guard sandboxlangan brauzer akkaunti. Avtomatik boshqariladi, interaktiv foydalanilmasligi kerak."},
        ].map((item,i)=>(
          <div key={i} style={{padding:"10px 12px",borderRadius:8,background:`${item.color}08`,border:`1px solid ${item.color}22`}}>
            <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:item.color,fontWeight:700,marginBottom:5}}>{item.type}</div>
            <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.6}}>{item.desc}</div>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.2 — SAM Ma'lumotlar Bazasi va SID Tuzilishi</h3>
      <P>Mahalliy akkauntlar <Term>SAM (Xavfsizlik Akkount Menejeri)</Term> ma'lumotlar bazasida saqlanadi — <code style={{fontFamily:"var(--font-mono)",fontSize:12,background:"rgba(255,255,255,0.06)",padding:"1px 6px",borderRadius:4}}>C:\Windows\System32\config\SAM</code> da registry hive. Windows ishlab turganida SYSTEM jarayoni tomonidan bloklanadi — uni to'g'ridan-to'g'ri ko'chira olmaysiz. SAM hive SYSTEM hive dan olingan kalit bilan shifrlangan parol hashlari saqlaydi.</P>
      <P>Har bir akkountda <Term>SID (Xavfsizlik Identifikatori)</Term> mavjud — ACL lar va tokenlarda ishlatiladigan noyob identifikator:</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.3 — NTLM Parol Hashlash</h3>
      <P>Windows parollarni <Term>NTLM hashlari</Term> (NT hashlari ham deyiladi) sifatida saqlaydi. Algoritm:</P>
      <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:12}}>
        {[
          {step:"1. Kirish",desc:"Foydalanuvchi paroli ochiq matnda, masalan, 'P@ssw0rd'"},
          {step:"2. Kodlash",desc:"UTF-16LE kodlashga o'tkazish (kichik-endian 16-bitli Unicode)"},
          {step:"3. Hash",desc:"UTF-16LE baytlarining MD4 hashini hisoblash → 16-baytli (32 hex belgi) NTLM hash"},
          {step:"4. Saqlash",desc:"Hash SAM hive da SYSKEY dan olingan kalit bilan shifrlangan holda saqlanadi. Shuningdek LSASS xotirasida hisob ma'lumoti sifatida keshlanadi."},
        ].map((item,i)=>(
          <div key={i} style={{display:"flex",gap:12,padding:"8px 12px",borderRadius:6,background:"rgba(255,255,255,0.02)",border:"1px solid var(--border)"}}>
            <span style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--accent)",minWidth:60,flexShrink:0,fontWeight:700}}>{item.step}</span>
            <span style={{fontSize:13,color:"var(--text-1)"}}>{item.desc}</span>
          </div>
        ))}
      </div>
      <Callout color="var(--c-err)" icon="warning" titleUz="NTLM hashlari Pass-the-Hash uchun parolning o'zi" titleEn="">
        NTLM autentifikatsiyasi ochiq matn paroli talab qilmaydi — faqat hash talab qiladi. SAM yoki LSASS dan NTLM hashini qo'lga kiritgan hujumchi parolni hech qachon crack qilmasdan o'sha foydalanuvchi sifatida autentifikatsiya qila oladi. Bu <em>Pass-the-Hash (PtH)</em> — Windows muhitida eng halokatli lateral movement texnikalaridan biri.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.4 — Foydalanuvchi Profil Tuzilishi</h3>
      <P>Foydalanuvchi birinchi marta kirganda, Windows <code style={{fontFamily:"var(--font-mono)",fontSize:12,background:"rgba(255,255,255,0.06)",padding:"1px 6px",borderRadius:4}}>C:\Users\[foydalanuvchi_nomi]\</code> da <Term>foydalanuvchi profili</Term> yaratadi (<code>C:\Users\Default</code> dan ko'chiriladi).</P>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Yo'l (C:\\Users\\user\\ ga nisbatan)","Tarkib","Xavfsizlik / Forensik Eslatmalar"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["NTUSER.DAT","Foydalanuvchi registry hive — kirishda HKCU sifatida o'rnatiladi","Run kalitlari, qobiq papkasi yo'llari, MRU ro'yxatlari — muhim forensik artefakt"],
            ["AppData\\Local","Mashina-mahalliy dastur ma'lumotlari — sinxronlanmaydi","Brauzer keshlari, Vaqtinchalik fayllar, dastur ma'lumotlar bazalari (masalan, Chrome profili)"],
            ["AppData\\Roaming","Domen muhitida sinxronlanadi (roaming profili)","Windows hisob ma'lumotlari XML, SSH kalitlari, Outlook profillari, ko'p dastur konfiguratsiyalari"],
            ["AppData\\LocalLow","Past yaxlitlikdagi jarayon dastur ma'lumotlari","IE/Edge sandbox ma'lumotlari, himoyalangan rejim plaginlar ma'lumotlari"],
            ["AppData\\Local\\Microsoft\\Credentials","DPAPI bilan shifrlangan hisob ma'lumotlari bloblari","Saqlangan parollar (Hisob Ma'lumotlari Menejeri, IE saqlangan parollar, WiFi kalitlari)"],
            ["AppData\\Roaming\\Microsoft\\Windows\\PowerShell\\PSReadLine\\ConsoleHost_history.txt","PowerShell buyruq tarixi","Hujumchi buyruqlari — muhim forensik topilma"],
            ["Desktop, Documents, Downloads","Foydalanuvchi fayllari","Zararli dastur tashlab ketish zonasi — kutilmagan EXE/skriptlarni tekshiring"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?10:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.5 — DPAPI (Ma'lumotlarni Himoya Qilish API)</h3>
      <P><Term>DPAPI</Term> — Windows ning o'rnatilgan sir himoya mexanizmi. U bloblarni foydalanuvchi parolidan olingan <em>master kalit</em> yordamida shifrlaydi. Kalit hech qachon ochiq matnda mashina tashqarisiga chiqmaydi. DPAPI quyidagilarni himoya qiladi: Hisob Ma'lumotlari Menejeri bloblari, Chrome/Edge saqlangan parollar, WiFi PSK kalitlari, sertifikat shaxsiy kalitlari.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.6 — Hisob Ma'lumotlari Hujum Texnikalari</h3>
      <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:12}}>
        {[
          {title:"SAM + SYSTEM Chiqarish (Oflayn)",color:"var(--c-attack)",body:<>SAM hive SYSTEM hive dan olingan kalit bilan shifrlangan. Ikkalasini chiqarish: <code>reg save HKLM\SAM sam.hiv</code> va <code>reg save HKLM\SYSTEM system.hiv</code> (admin talab qiladi). Keyin barcha NTLM hashlarini oflayn chiqarish uchun <code>secretsdump.py -sam sam.hiv -system system.hiv LOCAL</code> (Impacket). Aniqlash: reg save EventID 4663 + g'ayritabiiy yo'lda yaratilgan katta registry fayli.</>},
          {title:"LSASS Xotira Damping",color:"var(--c-err)",body:<>LSASS barcha kirgan foydalanuvchilarning hisob ma'lumotlarini xotirada saqlaydi: NTLM hashlari, Kerberos chiptalar, ochiq matn (WDigest, meros). Hujum: <code>procdump -ma lsass.exe lsass.dmp</code> yoki Vazifa Menejeri → Dump yaratish → Mimikatz bilan ochish. Aniqlash: Sysmon Event 10 (PROCESS_VM_READ bilan lsass.exe ga ProcessAccess). PPL + Credential Guard kamaytirishlar.</>},
          {title:"Pass-the-Hash (PtH)",color:"var(--c-warn)",body:<>Ochiq matn paroli olmadan autentifikatsiya qilish uchun qo'lga kiritilgan NTLM hashini ishlatish: Mimikatz <code>sekurlsa::pth /user:admin /ntlm:HASH /domain:maqsad</code>. NTLM autentifikatsiyasi faqat hash talab qilganligi uchun ishlaydi, parol emas. Kamaytirishlar: LAPS (tasodifiy mahalliy admin parollari), Credential Guard (LSASS dan NTLM hashini olib tashlaydi), Protected Users xavfsizlik guruhi (NTLM ni o'chiradi).</>},
          {title:"Hisob Ma'lumotlari Menejerini Chiqarish",color:"var(--c-system)",body:<>Windows saqlangan hisob ma'lumotlarini (RDP parollar, tarmoq almashishlari, veb-sayt loginlari) Hisob Ma'lumotlari Menejerida DPAPI bilan shifrlangan holda saqlaydi. Chiqarish: <code>cmdkey /list</code> (saqlangan hisob ma'lumotlarini ro'yxatga olish), Mimikatz <code>dpapi::cred</code>, yoki PowerShell veb hisob ma'lumotlari uchun <code>[Windows.Security.Credentials.PasswordVault]::new().RetrieveAll()</code>. Brauzer parollari ham DPAPI himoyalangan — SharpChrome kabi vositalar ularni chiqaradi.</>},
        ].map((item,i)=>(
          <div key={i} style={{padding:"14px 16px",borderRadius:10,background:`${item.color}08`,border:`1px solid ${item.color}30`}}>
            <div style={{fontFamily:"var(--font-display)",fontSize:14,fontWeight:700,color:item.color,marginBottom:8}}>{item.title}</div>
            <div style={{fontSize:13,color:"var(--text-1)",lineHeight:1.65}}>{item.body}</div>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.7 — Kerberos va NTLM Autentifikatsiyasi</h3>
      <P>Windows ikkita asosiy autentifikatsiya protokolidan foydalanadi: <Term>NTLM</Term> (eski, muammoga asoslangan/javob) va <Term>Kerberos</Term> (zamonaviy, chiptaga asoslangan). Domen muhitlarida Kerberos afzalroq; NTLM mahalliy hisoblarda va meros tizimlar bilan orqaga qarab muvofiqlik uchun saqlanadi.</P>
      <div style={{overflowX:"auto",marginTop:14,marginBottom:14}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{borderBottom:"2px solid var(--border)"}}>
            {["Xususiyat","NTLM","Kerberos"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:700}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["Turi","Muammoga asoslangan/javob","Chiptaga asoslangan (TGT + xizmat chiptasi)"],
            ["DC talab qilinadi","Yo'q (mahalliy hisob)","Ha (KDC — Key Distribution Center)"],
            ["O'zaro autentifikatsiya","Yo'q","Ha (server ham tasdiqlaydi)"],
            ["Takrorlash himoyasi","Cheklangan","Ha (vaqt tamg'alari, 5 daqiqa oynasi)"],
            ["Asosiy hujumlar","Pass-the-Hash, NTLM Relay","Kerberoasting, AS-REP Roasting, Golden/Silver Ticket"],
            ["Foydalanish holati","Mahalliy hisob, meros tizimlar","Domen muhiti (standart)"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--text-2)":j===1?"var(--c-warn)":"var(--c-system)",fontWeight:j===0?600:400,fontSize:12}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>
      <img src="uploads/Screenshot_2026-05-15_15_19_02.png"
           alt="Kerberos Autentifikatsiya Oqimi — AS almashinuvi, TGS almashinuvi, Xizmatga kirish"
           style={{width:"100%",borderRadius:8,border:"1px solid var(--border)",marginBottom:14,display:"block"}} />
      <div style={{fontSize:11,color:"var(--text-2)",textAlign:"center",marginTop:-10,marginBottom:18,fontFamily:"var(--font-mono)"}}>
        Kerberos: Foydalanuvchi → KDC (AS-REQ/AS-REP → TGT) → KDC (TGS-REQ/TGS-REP → Xizmat Chiptasi) → Xizmat (AP-REQ → Sessiya)
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:4}}>
        {[
          {step:"AS Almashinuvi",color:"var(--c-system)",body:"Foydalanuvchi KDC ga AS-REQ yuboradi (foydalanuvchi nomi + vaqt tamg'asi NTLM hash bilan shifrlangan). KDC parolni tekshiradi va TGT (Ticket-Granting Ticket) qaytaradi — AS-REP. TGT krbtgt akkount kaliti bilan shifrlangan; foydalanuvchi uni ochib ko'ra olmaydi."},
          {step:"TGS Almashinuvi",color:"var(--c-warn)",body:"Foydalanuvchi xizmatlarga kirish kerak bo'lganda TGT bilan TGS-REQ yuboradi. KDC xizmat chiptasini qaytaradi (TGS-REP) — maqsad xizmat uchun shifrlangan. Foydalanuvchi xizmat parolini hech qachon ko'rmaydi."},
          {step:"AP Almashinuvi",color:"var(--c-attack)",body:"Foydalanuvchi xizmatga xizmat chiptasi bilan AP-REQ yuboradi. Xizmat o'z kaliti bilan chiptani ochib, foydalanuvchi kimligini tekshiradi. O'zaro autentifikatsiya: xizmat AP-REP bilan javob berishi mumkin."},
        ].map((item,i)=>(
          <div key={i} style={{padding:"12px 14px",borderRadius:8,background:`${item.color}08`,border:`1px solid ${item.color}25`}}>
            <div style={{fontFamily:"var(--font-mono)",fontSize:12,color:item.color,fontWeight:700,marginBottom:6}}>{item.step}</div>
            <div style={{fontSize:13,color:"var(--text-1)",lineHeight:1.6}}>{item.body}</div>
          </div>
        ))}
      </div>
      <Callout color="var(--c-attack)" icon="warning" titleEn="" titleUz="Kerberos Hujum Texnikalari">
        <strong>Kerberoasting</strong> — Xizmat chiptasini so'rash va oflayn kraking (xizmat akkountining zaif paroli). <strong>AS-REP Roasting</strong> — Kerberos pre-auth o'chirilgan foydalanuvchilar uchun AS-REP ni kraking qilish. <strong>Pass-the-Ticket</strong> — Xotiradan olingan Kerberos chiptalarini boshqa sessiyaga kiritish. <strong>Golden Ticket</strong> — krbtgt NTLM hash bilan soxta TGT yaratish (domen to'liq buzilganidan keyin).
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.8 — Amaliy Buyruqlar</h3>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
function SectionUAC() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="User Account Control (UAC)" uz="" />
      <P><Term>UAC (User Account Control)</Term>, introduced in Windows Vista, is a privilege-separation mechanism that forces even administrator users to run with standard-user privileges by default. Only when elevated privileges are explicitly required does UAC prompt for approval. Microsoft's goal: limit the blast radius of malware that executes under an admin account — if the malware runs at medium integrity, it cannot silently install drivers, modify system files, or touch other users' data without triggering a visible prompt.</P>
      <Callout color="var(--c-warn)" icon="info" titleEn="UAC is not a security boundary" titleUz="">
        Microsoft officially classifies UAC as a <em>convenience feature</em>, not a security boundary. An admin-level user can always bypass UAC given physical access or enough persistence. The goal is raising the cost, not making bypass impossible. Many bypass techniques exist and are actively exploited.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.1 — The Split Token Model</h3>
      <P>When an administrator logs in, Windows creates <Em>two tokens</Em> from a single logon session:</P>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginTop:12}}>
        <div style={{padding:"16px",borderRadius:10,background:"rgba(0,212,255,0.06)",border:"1px solid rgba(0,212,255,0.25)"}}>
          <div style={{fontFamily:"var(--font-display)",fontSize:14,fontWeight:700,color:"var(--c-system)",marginBottom:10}}>FILTERED TOKEN (Default)</div>
          <ul style={{margin:0,padding:"0 0 0 16px",fontSize:13,color:"var(--text-1)",lineHeight:1.8}}>
            <li>Integrity Level: <strong>Medium (0x2000)</strong></li>
            <li>Admin groups removed from token (Administrators group marked as deny-only)</li>
            <li>Dangerous privileges removed: SeDebugPrivilege, SeTcbPrivilege, SeLoadDriverPrivilege, etc.</li>
            <li>Used by all processes by default — Explorer, Chrome, Word</li>
            <li>Cannot write to HKLM, Program Files, or system files</li>
          </ul>
        </div>
        <div style={{padding:"16px",borderRadius:10,background:"rgba(255,58,94,0.06)",border:"1px solid rgba(255,58,94,0.25)"}}>
          <div style={{fontFamily:"var(--font-display)",fontSize:14,fontWeight:700,color:"var(--c-err)",marginBottom:10}}>ELEVATED TOKEN (On demand)</div>
          <ul style={{margin:0,padding:"0 0 0 16px",fontSize:13,color:"var(--text-1)",lineHeight:1.8}}>
            <li>Integrity Level: <strong>High (0x3000)</strong></li>
            <li>Full admin group membership active</li>
            <li>All privileges present: SeDebugPrivilege, SeTcbPrivilege, etc.</li>
            <li>Only created after UAC consent/credential prompt</li>
            <li>Can write to HKLM, system files, install drivers</li>
          </ul>
        </div>
      </div>
      <P style={{marginTop:14}}>The two tokens are <Em>linked</Em> — they share the same logon session ID (LUID). This linkage is what auto-elevation exploits: a process with the filtered token can request elevation through the AppInfo service, which finds the linked elevated token and uses it to spawn a new elevated process.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.2 — Integrity Levels</h3>
      <P>Every process and object has a <Term>Mandatory Integrity Control (MIC)</Term> label — a SID appended to the token or ACL. The kernel enforces a no-write-up / no-read-down policy:</P>
      <div style={{display:"flex",flexDirection:"column",gap:4,marginTop:12}}>
        {[
          {il:"Untrusted (0x0000)",sid:"S-1-16-0",color:"#888",who:"Processes with explicit Untrusted label. Cannot write to anything above Untrusted."},
          {il:"Low (0x1000)",sid:"S-1-16-4096",color:"#b48cff",who:"Internet Explorer / Edge protected mode, sandboxed processes, downloaded files. Can only write to Low-labeled locations (AppData\\LocalLow, browser download directories)."},
          {il:"Medium (0x2000)",sid:"S-1-16-8192",color:"var(--c-system)",who:"Default for standard users AND filtered admin token. Most user processes. Cannot write to High-labeled resources."},
          {il:"Medium-Plus (0x2100)",sid:"S-1-16-8448",color:"var(--c-warn)",who:"Used by some specific Windows components. Rarely seen in practice."},
          {il:"High (0x3000)",sid:"S-1-16-12288",color:"var(--c-err)",who:"Elevated admin processes (after UAC approval). Can modify system files, registry HKLM, install services."},
          {il:"System (0x4000)",sid:"S-1-16-16384",color:"#ff3a5e",who:"System services running as SYSTEM. Can access and modify anything. Unrestricted."},
          {il:"Protected Process (0x5000)",sid:"S-1-16-20480",color:"#ff9145",who:"PPL (Protected Process Light) — LSASS when PPL-protected, anti-malware services. Even SYSTEM cannot open with VM_READ."},
        ].map((item,i)=>(
          <div key={i} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"8px 12px",borderRadius:6,background:"rgba(255,255,255,0.02)",border:"1px solid var(--border)"}}>
            <div style={{minWidth:200,flexShrink:0}}>
              <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:item.color,fontWeight:700}}>{item.il}</div>
              <div style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--text-3)"}}>{item.sid}</div>
            </div>
            <span style={{fontSize:12,color:"var(--text-1)",lineHeight:1.6}}>{item.who}</span>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.3 — UAC Architecture: consent.exe and AppInfo</h3>
      <P>When an elevation request is triggered, the flow is:</P>
      <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:12}}>
        {[
          "User double-clicks an installer or right-clicks 'Run as administrator'",
          "ShellExecute detects the requestedExecutionLevel in the PE manifest (or no manifest = default prompting rules)",
          "Request sent to AppInfo service (svchost -k netsvcs / AIS) via RPC",
          "AppInfo validates: is the binary signed? Is it in a trusted directory? Does it have autoElevate in manifest?",
          "AppInfo calls consent.exe on the secure desktop (a separate desktop object, inaccessible to normal processes)",
          "consent.exe renders the UAC dialog. User clicks Yes or enters credentials.",
          "AppInfo creates a new process with the elevated token. The original process continues with filtered token.",
        ].map((step,i)=>(
          <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",padding:"8px 12px",borderRadius:6,background:"rgba(255,255,255,0.02)",border:"1px solid var(--border)"}}>
            <span style={{fontFamily:"var(--font-mono)",fontSize:12,color:"var(--accent)",minWidth:20,flexShrink:0}}>{i+1}.</span>
            <span style={{fontSize:13,color:"var(--text-1)"}}>{step}</span>
          </div>
        ))}
      </div>
      <Callout color="var(--c-system)" icon="info" titleEn="Secure Desktop protects against UI spoofing" titleUz="">
        consent.exe runs on the <em>secure desktop</em> — a separate Windows desktop object that only SYSTEM can write to. A Medium-integrity malware cannot draw windows on the secure desktop, inject mouse clicks into it, or intercept keyboard input. This is why the UAC prompt can be trusted visually, even if the system is compromised at Medium IL.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.4 — Auto-Elevation</h3>
      <P>Some Windows binaries elevate silently without showing a UAC prompt. They must meet ALL three criteria:</P>
      <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:12}}>
        {[
          {crit:"1. Signed by Microsoft",detail:"The binary must have a valid Authenticode signature from Microsoft Corporation. Third-party signed binaries never auto-elevate."},
          {crit:"2. Trusted directory",detail:"The binary must live in a protected directory: %SystemRoot%\\System32\\, %SystemRoot%\\, or %ProgramFiles%\\. Directories that require admin to write to — this prevents dropping a fake binary there."},
          {crit:"3. autoElevate manifest",detail:"The application manifest (embedded in the PE or in a side-by-side .manifest file) must contain <autoElevate>true</autoElevate> inside the requestedExecutionLevel element."},
        ].map((item,i)=>(
          <div key={i} style={{display:"flex",gap:14,padding:"10px 14px",borderRadius:8,background:"rgba(0,212,255,0.04)",border:"1px solid rgba(0,212,255,0.2)"}}>
            <span style={{fontFamily:"var(--font-mono)",fontSize:12,color:"var(--c-system)",minWidth:160,flexShrink:0,fontWeight:700}}>{item.crit}</span>
            <span style={{fontSize:13,color:"var(--text-1)",lineHeight:1.6}}>{item.detail}</span>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.5 — UAC Bypass Techniques</h3>
      <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:12}}>
        {[
          {title:"Registry Hijacking — fodhelper.exe (UACME #41)",color:"var(--c-attack)",body:<><code>fodhelper.exe</code> is a Microsoft-signed binary in System32 with autoElevate. It reads <code>HKCU\\Software\\Classes\\ms-settings\\shell\\open\\command</code> to find the handler for the ms-settings protocol. Since HKCU is user-writable (no elevation needed), the attacker writes their payload there, then launches fodhelper.exe — it auto-elevates and executes the payload at High integrity. Fix: create the registry key yourself and set it to something harmless; or set ConsentPromptBehaviorAdmin=2 (always prompt). Detection: Sysmon Event 13 (registry set under HKCU\\Software\\Classes\\ms-settings) followed by Event 1 (fodhelper.exe spawning unexpected child).</>},
          {title:"Environment Variable Hijacking — SilentCleanup",color:"var(--c-err)",body:<><code>SilentCleanup</code> is a scheduled task that runs as the current user with RunLevel=HighestAvailable (auto-elevated without prompt). It executes <code>%windir%\\system32\\cleanmgr.exe</code>. If %windir% is overridden via the user-level environment variable (writable without elevation), the task runs the attacker's binary instead. Demonstrated by UACME. Detection: Sysmon Event 1 showing SilentCleanup or schtasks spawning a process from a non-System32 path; user-level %windir% modification.</>},
          {title:"Eventvwr.exe Registry Hijack",color:"var(--c-warn)",body:<><code>eventvwr.exe</code> is auto-elevated and reads <code>HKCU\\Software\\Classes\\mscfile\\shell\\open\\command</code> to find mmc.exe (for Event Viewer). Attacker writes payload to that HKCU key, launches eventvwr.exe — payload executes at High IL. This was the technique used in many early Metasploit UAC bypass modules. Detection: registry write to HKCU\\Software\\Classes\\mscfile followed by eventvwr.exe execution.</>},
          {title:"COM Object Elevation (ICMLuaUtil)",color:"var(--c-system)",body:<>Several COM objects are registered with explicit elevation moniker <code>Elevation:Administrator!new:{"{CLSID}"}</code>. These COM objects auto-elevate when instantiated through the COM elevation moniker. ICMLuaUtil interface (CLSID {"{3E5FC7F9-9A51-4367-9063-A120244FBEC7}"}) exposes <code>ShellExec</code> and <code>SetRegistryStringValue</code> methods that run at High IL. Callable from Medium IL without any UAC prompt.</>},
          {title:"DLL Hijacking in Auto-Elevated Process",color:"var(--c-warn)",body:<>Auto-elevated processes that load DLLs by name from user-writable directories (e.g., CWD) are vulnerable. If an attacker can write a malicious DLL to a location searched before System32, the DLL loads at High integrity inside the auto-elevated process. Classic: older versions of cleanmgr.exe loaded cscui.dll from CWD. Detection: Process Monitor showing NAME NOT FOUND DLL loads from auto-elevated processes.</>},
        ].map((item,i)=>(
          <div key={i} style={{padding:"14px 16px",borderRadius:10,background:`${item.color}08`,border:`1px solid ${item.color}30`}}>
            <div style={{fontFamily:"var(--font-display)",fontSize:14,fontWeight:700,color:item.color,marginBottom:8}}>{item.title}</div>
            <div style={{fontSize:13,color:"var(--text-1)",lineHeight:1.65}}>{item.body}</div>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.6 — UAC Configuration Settings</h3>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Registry Value","Key","Meaning"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["ConsentPromptBehaviorAdmin","HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System","0=no prompt; 1=credential on secure desktop; 2=consent on secure desktop (default); 3=credential (not secure desktop); 4=consent (not secure desktop); 5=prompt only for non-Windows binaries (most common default)"],
            ["ConsentPromptBehaviorUser","Same key","0=auto-deny; 1=credential on secure desktop; 3=credential prompt"],
            ["EnableLUA","Same key","0=UAC completely disabled (dangerous); 1=UAC enabled (default). Disabling removes token splitting — all admin processes run with full token."],
            ["LocalAccountTokenFilterPolicy","HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System","1=disable UAC filtering for remote connections (allows pass-the-hash lateral movement with admin account — enable with caution)"],
            ["PromptOnSecureDesktop","Same key","0=show prompt on interactive desktop (can be spoofed); 1=show on secure desktop (default)"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.7 — Practical Commands</h3>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="UAC — Foydalanuvchi Hisobi Nazorati" en="" />
      <P>Windows Vista da joriy etilgan <Term>UAC (User Account Control)</Term> — hatto administrator foydalanuvchilarini ham standart foydalanuvchi imtiyozlari bilan ishlashga majburlaydi. Faqat ko'tarilgan imtiyozlar aniq talab qilinganida UAC tasdiqlash so'raydi. Microsoft maqsadi: admin akkaunti ostida bajariladigan zararli dasturning ta'sir doirasini cheklash — agar zararli dastur o'rta yaxlitlikda ishlasa, u ko'rinadigan so'rovni ishga tushirmasdan drayverlarni jimgina o'rnata olmaydi, tizim fayllarini o'zgartira olmaydi.</P>
      <Callout color="var(--c-warn)" icon="info" titleUz="UAC xavfsizlik chegarasi emas" titleEn="">
        Microsoft UAC ni rasman <em>qulaylik xususiyati</em> sifatida tavsiflaydi, xavfsizlik chegarasi emas. Admin darajasidagi foydalanuvchi jismoniy kirish yoki etarli persistenslik bilan har doim UAC ni chetlab o'ta oladi. Ko'p chetlab o'tish texnikalari mavjud va faol ekspluatatsiya qilinadi.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.1 — Ajratilgan Token Modeli</h3>
      <P>Administrator kirganida, Windows bitta kirish seansidan <Em>ikki token</Em> yaratadi:</P>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginTop:12}}>
        <div style={{padding:"16px",borderRadius:10,background:"rgba(0,212,255,0.06)",border:"1px solid rgba(0,212,255,0.25)"}}>
          <div style={{fontFamily:"var(--font-display)",fontSize:14,fontWeight:700,color:"var(--c-system)",marginBottom:10}}>FILTRLANGAN TOKEN (Standart)</div>
          <ul style={{margin:0,padding:"0 0 0 16px",fontSize:13,color:"var(--text-1)",lineHeight:1.8}}>
            <li>Yaxlitlik Darajasi: <strong>O'rta (0x2000)</strong></li>
            <li>Admin guruhlari tokendan olib tashlangan</li>
            <li>Xavfli imtiyozlar olib tashlangan: SeDebugPrivilege, SeTcbPrivilege va h.k.</li>
            <li>Standart bo'yicha barcha jarayonlar tomonidan ishlatiladi — Explorer, Chrome, Word</li>
            <li>HKLM, Program Files yoki tizim fayllariga yoza olmaydi</li>
          </ul>
        </div>
        <div style={{padding:"16px",borderRadius:10,background:"rgba(255,58,94,0.06)",border:"1px solid rgba(255,58,94,0.25)"}}>
          <div style={{fontFamily:"var(--font-display)",fontSize:14,fontWeight:700,color:"var(--c-err)",marginBottom:10}}>KO'TARILGAN TOKEN (Talab bo'yicha)</div>
          <ul style={{margin:0,padding:"0 0 0 16px",fontSize:13,color:"var(--text-1)",lineHeight:1.8}}>
            <li>Yaxlitlik Darajasi: <strong>Yuqori (0x3000)</strong></li>
            <li>To'liq admin guruhi a'zoligi faol</li>
            <li>Barcha imtiyozlar mavjud: SeDebugPrivilege, SeTcbPrivilege va h.k.</li>
            <li>Faqat UAC rozilik/hisob ma'lumotlari so'rovidan keyin yaratiladi</li>
            <li>HKLM, tizim fayllariga yoza oladi, drayver o'rnata oladi</li>
          </ul>
        </div>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.2 — Yaxlitlik Darajalari (Integrity Levels)</h3>
      <P>Har bir jarayon va ob'ektda <Term>Majburiy Yaxlitlik Nazorati (MIC)</Term> belgisi mavjud — tokenga yoki ACL ga qo'shimcha SID. Kernel yozmaslik-yuqoriga / o'qimaslik-pastga siyosatini amalga oshiradi:</P>
      <div style={{display:"flex",flexDirection:"column",gap:4,marginTop:12}}>
        {[
          {il:"Ishonchsiz (0x0000)",sid:"S-1-16-0",color:"#888",who:"Aniq Ishonchsiz yorliq bilan jarayonlar. Ishonchsizdan yuqoriga hech narsaga yoza olmaydi."},
          {il:"Past (0x1000)",sid:"S-1-16-4096",color:"#b48cff",who:"Internet Explorer / Edge himoyalangan rejimi, sandboxlangan jarayonlar, yuklangan fayllar. Faqat Past belgilangan joylarga (AppData\\LocalLow, brauzer yuklab olish kataloglari) yoza oladi."},
          {il:"O'rta (0x2000)",sid:"S-1-16-8192",color:"var(--c-system)",who:"Standart foydalanuvchilar VA filtrlangan admin token uchun standart. Ko'p foydalanuvchi jarayonlari. Yuqori belgilangan resurslarga yoza olmaydi."},
          {il:"Yuqori (0x3000)",sid:"S-1-16-12288",color:"var(--c-err)",who:"Ko'tarilgan admin jarayonlari (UAC tasdiqlashidan keyin). Tizim fayllarini, registry HKLM ni o'zgartirishi, xizmatlar o'rnatishi mumkin."},
          {il:"Tizim (0x4000)",sid:"S-1-16-16384",color:"#ff3a5e",who:"SYSTEM sifatida ishlaydigan tizim xizmatlari. Hamma narsaga kira oladi va o'zgartira oladi. Cheksiz."},
          {il:"Himoyalangan Jarayon (0x5000)",sid:"S-1-16-20480",color:"#ff9145",who:"PPL (Himoyalangan Jarayon Light) — PPL himoyalangan LSASS, antizararli xizmatlar. Hatto SYSTEM ham VM_READ bilan ocha olmaydi."},
        ].map((item,i)=>(
          <div key={i} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"8px 12px",borderRadius:6,background:"rgba(255,255,255,0.02)",border:"1px solid var(--border)"}}>
            <div style={{minWidth:180,flexShrink:0}}>
              <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:item.color,fontWeight:700}}>{item.il}</div>
              <div style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--text-3)"}}>{item.sid}</div>
            </div>
            <span style={{fontSize:12,color:"var(--text-1)",lineHeight:1.6}}>{item.who}</span>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.3 — UAC Arxitekturasi: consent.exe va AppInfo</h3>
      <P>Ko'tarish so'rovi ishga tushganda, oqim quyidagicha:</P>
      <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:12}}>
        {[
          "Foydalanuvchi o'rnatuvchini ikki marta bosadi yoki 'Administrator sifatida ishga tushirish' ni o'ng tugma bosadi",
          "ShellExecute PE manifestidagi requestedExecutionLevel ni aniqlaydi",
          "So'rov RPC orqali AppInfo xizmatiga (svchost -k netsvcs / AIS) yuboriladi",
          "AppInfo tekshiradi: ikkilik fayl imzolangan? Ishonchli katalogda? Manifestda autoElevate bormi?",
          "AppInfo xavfsiz ish stolida (oddiy jarayonlar kirish imkoni yo'q alohida ish stoli ob'ekti) consent.exe ni chaqiradi",
          "consent.exe UAC dialogini ko'rsatadi. Foydalanuvchi Ha bosadi yoki hisob ma'lumotlarini kiritadi.",
          "AppInfo ko'tarilgan token bilan yangi jarayon yaratadi. Asl jarayon filtrlangan token bilan davom etadi.",
        ].map((step,i)=>(
          <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",padding:"8px 12px",borderRadius:6,background:"rgba(255,255,255,0.02)",border:"1px solid var(--border)"}}>
            <span style={{fontFamily:"var(--font-mono)",fontSize:12,color:"var(--accent)",minWidth:20,flexShrink:0}}>{i+1}.</span>
            <span style={{fontSize:13,color:"var(--text-1)"}}>{step}</span>
          </div>
        ))}
      </div>
      <Callout color="var(--c-system)" icon="info" titleUz="Xavfsiz ish stoli UI aldashga qarshi himoya qiladi" titleEn="">
        consent.exe <em>xavfsiz ish stolida</em> ishlaydi — faqat SYSTEM yoza oladigan alohida Windows ish stoli ob'ekti. O'rta IL dagi zararli dastur xavfsiz ish stolida oynalar chiza olmaydi, sichqoncha bosishlarini kirita olmaydi yoki klaviatura kirishini to'xtatib qo'ya olmaydi. Shuning uchun UAC so'rovi vizual ishonchli hisoblanadi, hatto tizim O'rta IL da buzilgan bo'lsa ham.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.4 — Auto-Elevation</h3>
      <P>Ba'zi Windows ikkilik fayllari UAC so'rovini ko'rsatmasdan jimgina ko'tariladi. Ular BARCHA uch mezonni qondirishi kerak:</P>
      <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:12}}>
        {[
          {crit:"1. Microsoft tomonidan imzolangan",detail:"Ikkilik fayl Microsoft Corporation dan haqiqiy Authenticode imzosiga ega bo'lishi kerak. Uchinchi tomon imzolangan ikkilik fayllar hech qachon auto-elevation qilmaydi."},
          {crit:"2. Ishonchli katalog",detail:"Ikkilik fayl himoyalangan katalogda bo'lishi kerak: %SystemRoot%\\System32\\, %SystemRoot%\\ yoki %ProgramFiles%\\. Admin yozishi kerak bo'lgan kataloglar — bu soxta ikkilik faylni u yerga tashlashga to'sqinlik qiladi."},
          {crit:"3. autoElevate manifesti",detail:"Ilova manifesti (PE ga o'rnatilgan yoki yon .manifest faylida) requestedExecutionLevel elementi ichida <autoElevate>true</autoElevate> ni o'z ichiga olishi kerak."},
        ].map((item,i)=>(
          <div key={i} style={{display:"flex",gap:14,padding:"10px 14px",borderRadius:8,background:"rgba(0,212,255,0.04)",border:"1px solid rgba(0,212,255,0.2)"}}>
            <span style={{fontFamily:"var(--font-mono)",fontSize:12,color:"var(--c-system)",minWidth:190,flexShrink:0,fontWeight:700}}>{item.crit}</span>
            <span style={{fontSize:13,color:"var(--text-1)",lineHeight:1.6}}>{item.detail}</span>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.5 — UAC Chetlab O'tish Texnikalari</h3>
      <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:12}}>
        {[
          {title:"Registry Hijacking — fodhelper.exe (UACME #41)",color:"var(--c-attack)",body:<><code>fodhelper.exe</code> autoElevate bilan System32 dagi Microsoft imzolangan ikkilik fayl. U ms-settings protokoli uchun ishlovchini topish uchun <code>HKCU\\Software\\Classes\\ms-settings\\shell\\open\\command</code> ni o'qiydi. HKCU foydalanuvchi yoziladigan (ko'tarish talab qilinmaydi) bo'lganligi uchun, hujumchi o'z yuklamasini u yerga yozadi, keyin fodhelper.exe ni ishga tushiradi — u auto-elevation qiladi va yuklamani Yuqori yaxlitlikda bajaradi. Aniqlash: Sysmon Event 13 (HKCU\\Software\\Classes\\ms-settings ostida registry set) so'ngra Event 1 (fodhelper.exe kutilmagan bolani yaratmoqda).</>},
          {title:"Muhit O'zgaruvchisi Hijacking — SilentCleanup",color:"var(--c-err)",body:<><code>SilentCleanup</code> RunLevel=HighestAvailable (so'rovsiz auto-elevated) bilan joriy foydalanuvchi sifatida ishlaydigan rejalashtirilgan vazifa. U <code>%windir%\\system32\\cleanmgr.exe</code> ni bajaradi. Agar %windir% foydalanuvchi darajasidagi muhit o'zgaruvchisi orqali o'tkazilsa (ko'tarishsiz yoziladigan), vazifa buning o'rniga hujumchining ikkilik faylini ishga tushiradi. Aniqlash: tizim bo'lmagan yo'ldan SilentCleanup yoki schtasks tomonidan jarayon yaratish.</>},
          {title:"Eventvwr.exe Registry Hijack",color:"var(--c-warn)",body:<><code>eventvwr.exe</code> auto-elevation qiladi va mmc.exe ni topish uchun <code>HKCU\\Software\\Classes\\mscfile\\shell\\open\\command</code> ni o'qiydi. Hujumchi yuklamasini shu HKCU kalitiga yozadi, eventvwr.exe ni ishga tushiradi — yuklamasi Yuqori IL da bajariladi. Bu ko'p dastlabki Metasploit UAC bypass modullarida ishlatilgan texnika edi. Aniqlash: HKCU\\Software\\Classes\\mscfile ga registry yozuvi so'ngra eventvwr.exe bajarilishi.</>},
          {title:"COM Ob'ektini Ko'tarish (ICMLuaUtil)",color:"var(--c-system)",body:<>Bir qancha COM ob'ektlari aniq ko'tarish monikerи <code>Elevation:Administrator!new:{"{CLSID}"}</code> bilan ro'yxatga olingan. Bu COM ob'ektlari COM ko'tarish monikeri orqali yaratilganida auto-elevation qiladi. ICMLuaUtil interfeysi Yuqori IL da ishlaydigan <code>ShellExec</code> va <code>SetRegistryStringValue</code> usullarini ochib beradi. O'rta IL dan har qanday UAC so'rovsiz chaqirilishi mumkin.</>},
        ].map((item,i)=>(
          <div key={i} style={{padding:"14px 16px",borderRadius:10,background:`${item.color}08`,border:`1px solid ${item.color}30`}}>
            <div style={{fontFamily:"var(--font-display)",fontSize:14,fontWeight:700,color:item.color,marginBottom:8}}>{item.title}</div>
            <div style={{fontSize:13,color:"var(--text-1)",lineHeight:1.65}}>{item.body}</div>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.6 — UAC Konfiguratsiya Sozlamalari</h3>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Registry Qiymati","Ma'nosi"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["ConsentPromptBehaviorAdmin","0=so'rov yo'q; 1=xavfsiz ish stolida hisob ma'lumotlari; 2=xavfsiz ish stolida rozilik (standart); 5=faqat Windows bo'lmagan ikkilik fayllar uchun so'rov"],
            ["EnableLUA","0=UAC to'liq o'chirilgan (xavfli); 1=UAC yoqilgan (standart). O'chirish token ajratishni olib tashlaydi."],
            ["LocalAccountTokenFilterPolicy","1=uzoq ulanishlar uchun UAC filtrini o'chirish (admin akkount bilan PtH lateral movement ni yoqadi)"],
            ["PromptOnSecureDesktop","0=interaktiv ish stolida ko'rsatish (soxtalashtirish mumkin); 1=xavfsiz ish stolida ko'rsatish (standart)"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.7 — Amaliy Buyruqlar</h3>
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
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="Windows API — OS ga Interfeys" en="" />
      <P><Term>Windows API</Term> (Win32 API ham deyiladi) — foydalanuvchi rejimi dasturlariga OS xizmatlariga kirish imkonini beruvchi C chaqiriladigan funksiyalar to'plami: jarayonlar yaratish, fayllarni o'qish, xotirani boshqarish, ekranga chizish, tarmoqqa kirish. U qatlamli stek sifatida tashkil etilgan — har bir qatlam uning ostidagisiga qo'shimcha abstraktsiya va xavfsizlik tekshiruvlarini qo'shadi. Bu stekni tushunish hujumkor va himoyaviy xavfsizlik uchun ham asosiy hisoblanadi, chunki har bir hujum texnikasi va har bir aniqlash usuli oxir-oqibat bu qatlamlardan birida ishlaydi.</P>

      <h3 className="mono" style={{color:"var(--c-warn)",marginTop:28}}>// FAYL OCHILISH JARAYONI — 9 QADAM</h3>
      <P>Tasavvur qiling: siz restoran mijozisiz. Notepad sizning buyurtmangiz — "Menga <code style={{fontFamily:"var(--font-mono)",fontSize:12,background:"rgba(255,255,255,0.06)",padding:"1px 6px",borderRadius:4}}>maxfiy.txt</code> faylini o'qib ber." Bu buyurtma qattiq diskka (omborxonaga) yetib borguncha bir necha bosqichdan o'tadi va natija xuddi shu yo'ldan orqaga qaytadi.</P>
      <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:14}}>
        {[
          {n:"1",label:"Dastur (Ring 3)",sub:'Notepad → ReadFile(handle, buffer) — "Menga shu faylni o\'qib ber!" deb buyruq beradi.',color:"#b48cff",mode:"Ring 3 · User Mode",icon:"📄"},
          {n:"2",label:"kernel32.dll — Ofitsiant",sub:"Buyurtmani qabul qiladi, oshxona tiliga o'giradi: NtReadFile(...) — ntdll ga uzatadi.",color:"#00d4ff",mode:"Ring 3 · User Mode",icon:"🤵"},
          {n:"3",label:"ntdll.dll — Oshxona eshigi",sub:"mov eax, SSN  ; syscall raqami\nsyscall       ; Ring 3 → Ring 0 chegarasini kesib o'tish (Syscall Gate)",color:"#ff9145",mode:"Ring 3 → Ring 0 CHEGARASI",icon:"🚪"},
          {n:"4",label:"Security Check — Qorovul (Ring 0)",sub:"Kernel darhol ACL tekshiradi: 'Sizning ushbu faylni o\'qishga huquqingiz bormi?' Agar ruxsat yo'q bo'lsa — ACCESS_DENIED.",color:"#ff3a5e",mode:"Ring 0 · Kernel Mode",icon:"🛡"},
          {n:"5",label:"I/O Manager — Buyruq uzatish",sub:"Kernel I/O so'rovini qurilma drayver stekiga uzatadi. ntfs.sys fayl manzilini aniqlaydi.",color:"#ff9145",mode:"Ring 0 · Kernel Mode",icon:"⚙"},
          {n:"6",label:"Hardware — Omborxona",sub:"SSD/HDD ishga tushadi: .txt faylidagi baytlarni diskdan topadi va bufferga ko'chiradi.",color:"#00ff9c",mode:"Hardware",icon:"💾"},
          {n:"7",label:"Kernel → ntdll.dll",sub:"Ma'lumot kernel buferdan user-mode bufferiga ko'chiriladi. Kernel ring 3 ga qaytadi.",color:"#ff9145",mode:"Ring 0 → Ring 3",icon:"⬆"},
          {n:"8",label:"ntdll.dll → kernel32.dll",sub:"Native API natijani Win32 formatiga o'giradi va ReadFile() ga qaytaradi.",color:"#00d4ff",mode:"Ring 3 · User Mode",icon:"🔄"},
          {n:"9",label:"Notepad — Natija",sub:"ReadFile() muvaffaqiyatli tugadi. Ekranda maxfiy.txt mazmuni paydo bo'ladi.",color:"#b48cff",mode:"Ring 3 · User Mode",icon:"✅"},
        ].map((step,i)=>(
          <div key={i} style={{display:"flex",alignItems:"stretch",gap:0}}>
            <div style={{width:3,flexShrink:0,background:step.color,opacity:0.7}}/>
            <div style={{flex:1,padding:"10px 14px",borderBottom:"1px solid var(--border)",background:i===3?"rgba(255,58,94,0.07)":i===5?"rgba(0,255,156,0.04)":"transparent"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",gap:8,flexWrap:"wrap"}}>
                <span style={{fontFamily:"var(--font-display)",fontSize:13,fontWeight:700,color:step.color}}>
                  <span style={{fontFamily:"var(--font-mono)",fontSize:11,opacity:0.6,marginRight:8}}>{step.n}.</span>
                  {step.icon} {step.label}
                </span>
                <span style={{fontFamily:"var(--font-mono)",fontSize:10,color:i===3||i===4||i===5?"var(--c-err)":i===6?"var(--c-warn)":"var(--c-system)",flexShrink:0}}>{step.mode}</span>
              </div>
              <div style={{fontSize:12,color:"var(--text-2)",marginTop:4,fontFamily:"var(--font-mono)",whiteSpace:"pre-wrap"}}>{step.sub}</div>
            </div>
          </div>
        ))}
      </div>
      <Callout color="var(--c-warn)" icon="info" titleUz="Xavfsizlik nuqtai nazari" titleEn="">
        Har bir fayl ochilish so'rovida kernel <strong>Security Reference Monitor</strong> orqali ACL tekshiradi — bu tekshiruv chetlab o'tib bo'lmaydi. Shuning uchun NTFS ruxsatnomalari eng quyi darajadagi himoya hisoblanadi. Foydalanuvchi qancha kreativ usul bilan urinmasin, kernel darajasidagi tekshiruv doim ishlaydi.
      </Callout>

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
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
function SectionEventViewer() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="Event Viewer — Windows Logging System" uz="" />
      <P>Windows records system activity in structured logs called <Term>event logs</Term>. These are the primary data source for incident response, forensics, and detection engineering. Every meaningful OS action — user logon, process creation, service installation, privilege use — generates an event that persists in a binary <code>.evtx</code> file. Understanding which events fire, what fields they carry, and how to query them is foundational to blue-team work.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.1 — ETW Architecture</h3>
      <P>The underlying engine is <Term>ETW (Event Tracing for Windows)</Term> — a kernel-level pub/sub system built into Windows since XP. It has three components:</P>
      <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:12}}>
        {[
          {role:"Provider",color:"var(--c-system)",desc:"Any kernel or user-mode component that emits events. Identified by a GUID. Examples: Microsoft-Windows-Security-Auditing (GUID 54849625-…), Microsoft-Windows-Kernel-Process, Sysmon (5770385F-…). Providers declare their events in a manifest (XML schema) that describes every event ID, fields, and levels."},
          {role:"Session / Controller",color:"var(--c-warn)",desc:"A logging session subscribes to one or more providers and routes events to a consumer. The Windows Event Log service (svchost -k LocalServiceNoNetworkFirewall hosting EventLog) manages the persistent log sessions. You can create custom ETW sessions with logman or xperf."},
          {role:"Consumer",color:"#b48cff",desc:"Reads events from a session buffer (real-time) or from an .etl/.evtx file (offline). Event Viewer, Get-WinEvent, wevtutil, and custom SIEM agents are consumers."},
        ].map((item,i)=>(
          <div key={i} style={{display:"flex",gap:12,padding:"10px 14px",borderRadius:8,background:`${item.color}08`,border:`1px solid ${item.color}25`}}>
            <span style={{fontFamily:"var(--font-mono)",fontSize:12,color:item.color,minWidth:90,flexShrink:0,fontWeight:700,paddingTop:1}}>{item.role}</span>
            <span style={{fontSize:13,color:"var(--text-1)",lineHeight:1.6}}>{item.desc}</span>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.2 — Log Channels</h3>
      <P>Events are routed into named <Term>channels</Term>. The four classic channels plus the modern Applications and Services Logs hierarchy:</P>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Channel","File Path","Contains","Max Size (default)"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["Security","System32\\winevt\\Logs\\Security.evtx","Logon/logoff, privilege use, object access, policy change, account management — audit policy controls what fires","128 MB (wraps)"],
            ["System","System32\\winevt\\Logs\\System.evtx","Driver load/unload, service install, hardware errors, boot events, SCM activity","20 MB"],
            ["Application","System32\\winevt\\Logs\\Application.evtx","Application-defined events (MSSQL, IIS, .NET runtime errors)","20 MB"],
            ["Setup","System32\\winevt\\Logs\\Setup.evtx","Windows Update, component installation, servicing","20 MB"],
            ["Microsoft-Windows-Sysmon/Operational","System32\\winevt\\Logs\\Microsoft-Windows-Sysmon%4Operational.evtx","Sysmon events (process, network, file, registry…) — requires Sysmon install","Configurable"],
            ["Microsoft-Windows-PowerShell/Operational","…\\Microsoft-Windows-PowerShell%4Operational.evtx","PS script block logging (Event 4104), module logging (4103)","15 MB"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.3 — Critical Security Event IDs</h3>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Event ID","Channel","Name","Key Fields / Why It Matters"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["4624","Security","Logon Success","LogonType (2=interactive,3=network,10=remote interactive), SubjectUserName, TargetUserName, IpAddress — baseline for lateral movement detection"],
            ["4625","Security","Logon Failure","Same fields + FailureReason. Burst of 4625 → brute force. Single 4625 then 4624 → credential stuffing success."],
            ["4648","Security","Logon with Explicit Credentials","SubjectUserName used runas/network logon with different credentials — pass-the-hash indicator"],
            ["4688","Security","Process Creation","NewProcessName, CommandLine (requires audit policy), ParentProcessName, SubjectUserName — gold for detecting LOLBins"],
            ["4698","Security","Scheduled Task Created","TaskName, TaskContent (full XML) — attacker persistence via Task Scheduler"],
            ["4702","Security","Scheduled Task Updated","Same as 4698 — modified task; check for new actions or changed RunAs account"],
            ["4720 / 4728","Security","User/Group Created","NewTargetUserName — new accounts, new group members"],
            ["4732","Security","Member Added to Security-Enabled Local Group","MemberName, GroupName — watch for additions to Administrators, Remote Desktop Users"],
            ["4768 / 4769","Security","Kerberos TGT/Service Ticket","Kerberoasting: 4769 with EncryptionType=0x17 (RC4) for service accounts → ticket offline crack"],
            ["4776","Security","NTLM Auth Attempt","WorkstationName, TargetUserName — all NTLM authentications, including pass-the-hash"],
            ["7045","System","Service Installed","ServiceName, ImagePath, ServiceType, StartType — new service = common persistence"],
            ["1102","Security","Audit Log Cleared","SubjectUserName — attacker cleanup, highly suspicious"],
            ["4104","PS/Operational","Script Block Logged","ScriptBlockText — full deobfuscated PowerShell code"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--c-warn)":j===1?"var(--c-system)":"var(--text-1)",fontFamily:j<2?"var(--font-mono)":"inherit",fontSize:j<2?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.4 — Sysmon Events</h3>
      <P><Term>Sysmon (System Monitor)</Term> is a Sysinternals driver + service that adds high-fidelity telemetry beyond what native Windows audit policy provides. Configured via XML, deployed via GPO or SCCM. Key events:</P>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12}}>
        {[
          {id:"ID 1",name:"Process Create",fields:"CommandLine, Hashes (MD5/SHA256/IMPHASH), ParentImage, ParentCommandLine, User",note:"Full command line + hash — no way to hide from this without tampering the driver"},
          {id:"ID 3",name:"Network Connect",fields:"SourceIp:Port, DestIp:Port, Protocol, ProcessId, Image",note:"Maps process to network connection — pivotal for C2 detection"},
          {id:"ID 7",name:"Image Loaded",fields:"ImageLoaded, Hashes, Signed, Signature, SignatureStatus",note:"Every DLL load — detect unsigned DLL injection, LOLBin side-loading"},
          {id:"ID 8",name:"CreateRemoteThread",fields:"SourceImage, TargetImage, StartAddress, StartModule, StartFunction",note:"Cross-process thread creation — primary injection indicator"},
          {id:"ID 10",name:"ProcessAccess",fields:"SourceImage, TargetImage, GrantedAccess, CallTrace",note:"PROCESS_VM_READ on lsass.exe = credential dump — most critical alert"},
          {id:"ID 11",name:"File Created",fields:"TargetFilename, CreationUtcTime, ProcessId",note:"Ransomware detection: mass file creation in short window"},
          {id:"ID 12/13/14",name:"Registry Events",fields:"EventType (Create/Set/Delete), TargetObject, Details",note:"Persistence: autorun key modifications"},
          {id:"ID 17/18",name:"Pipe Events",fields:"PipeName, Image",note:"Named pipe creation/connection — lateral movement via SMB named pipes, Cobalt Strike default pipes"},
          {id:"ID 22",name:"DNS Query",fields:"QueryName, QueryResults, Image",note:"C2 detection: beaconing to DGAs, unusual query patterns"},
          {id:"ID 25",name:"Process Tampering",fields:"Image, Type (ImageFileDeleted/HostileCodeShellcode/Other)",note:"Process hollowing, process doppelgänging detection"},
        ].map((item,i)=>(
          <div key={i} style={{padding:"10px 12px",borderRadius:8,background:"rgba(255,255,255,0.03)",border:"1px solid var(--border)"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
              <span style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--c-warn)",fontWeight:700}}>{item.id}</span>
              <span style={{fontFamily:"var(--font-display)",fontSize:13,fontWeight:600,color:"var(--accent)"}}>{item.name}</span>
            </div>
            <div style={{fontSize:11,color:"var(--text-2)",fontFamily:"var(--font-mono)",marginBottom:4}}>{item.fields}</div>
            <div style={{fontSize:12,color:"var(--text-1)"}}>{item.note}</div>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.5 — Audit Policy Configuration</h3>
      <P>By default, Windows logs very little. Security Event IDs only fire if the corresponding <Term>audit policy</Term> subcategory is enabled. Critical subcategories to enable:</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.6 — Log Tampering and Evasion</h3>
      <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:12}}>
        {[
          {title:"Log Clearing (Event ID 1102 / 104)",color:"var(--c-attack)",body:<>Attackers run <code>wevtutil cl Security</code> or <code>Clear-EventLog -LogName Security</code> to wipe the Security log. This itself generates Event ID 1102 (Security log cleared) or 104 (System log cleared) — but only if the Security log isn't also cleared first. Detection: forward logs in real time to a SIEM; once a log is cleared the SIEM copy survives even if local copy is gone.</>},
          {title:"ETW Provider Disabling (Patching)",color:"var(--c-err)",body:<>Advanced attackers patch the ETW provider inside a process to stop it from generating events. Technique: locate the EtwEventWrite function in ntdll, overwrite with a RET instruction (<code>0xC3</code>). This silences all ETW events from that process — including PowerShell script block logging. Detection: kernel-mode ETW consumers (e.g., Microsoft-Windows-Threat-Intelligence provider accessible only to PPL processes) are immune to this. CrowdStrike/Defender Sense uses this provider.</>},
          {title:"Sysmon Driver Unloading",color:"var(--c-warn)",body:<>Sysmon runs as a kernel driver. An admin can stop/delete the Sysmon service: <code>sc stop Sysmon64</code>. Detection: absence of Sysmon events in SIEM pipeline (gap detection); alert on Event 4 (Sysmon service state changed); monitor for deletion of Sysmon service registry key.</>},
          {title:"Volume Shadow Copy Deletion",color:"var(--c-warn)",body:<>Attackers delete VSS snapshots to destroy backup copies of logs: <code>vssadmin delete shadows /all /quiet</code> or <code>wmic shadowcopy delete</code>. This is now a ransomware behavioral indicator — generate a high-priority alert on any process deleting shadow copies.</>},
        ].map((item,i)=>(
          <div key={i} style={{padding:"14px 16px",borderRadius:10,background:`${item.color}08`,border:`1px solid ${item.color}30`}}>
            <div style={{fontFamily:"var(--font-display)",fontSize:14,fontWeight:700,color:item.color,marginBottom:8}}>{item.title}</div>
            <div style={{fontSize:13,color:"var(--text-1)",lineHeight:1.65}}>{item.body}</div>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.7 — Querying Event Logs</h3>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="Event Viewer — Windows Jurnallash Tizimi" en="" />
      <P>Windows tizim faoliyatini <Term>hodisa jurnallari</Term> deb ataladigan tuzilgan jurnaллarda qayd etadi. Bular hodisalarga javob berish, forensics va aniqlash muhandisligi uchun asosiy ma'lumot manbai. Har bir muhim OS harakati — foydalanuvchi kirishi, jarayon yaratish, servis o'rnatish, imtiyozdan foydalanish — ikkilik <code>.evtx</code> faylida saqlanadigan hodisa hosil qiladi.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.1 — ETW Arxitekturasi</h3>
      <P>Asosiy dvigatel — <Term>ETW (Windows Hodisa Kuzatish)</Term> — XP dan beri Windows ga o'rnatilgan kernel darajasidagi pub/sub tizimi. Uch komponentdan iborat:</P>
      <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:12}}>
        {[
          {role:"Provayder",color:"var(--c-system)",desc:"Hodisalar chiqaradigan har qanday kernel yoki foydalanuvchi rejimi komponenti. GUID bilan aniqlanadi. Misollar: Microsoft-Windows-Security-Auditing (GUID 54849625-…), Microsoft-Windows-Kernel-Process, Sysmon (5770385F-…). Provayderlar har bir hodisa ID, maydon va darajani tavsiflovchi manifest (XML sxema) da hodisalarini e'lon qiladi."},
          {role:"Seans / Boshqaruvchi",color:"var(--c-warn)",desc:"Jurnallash seansi bir yoki bir nechta provayderlarga obuna bo'ladi va hodisalarni iste'molchiga yo'naltiradi. Windows Hodisa Jurnali xizmati (EventLog ni joylashtiradigan svchost) doimiy jurnal seanslarini boshqaradi. logman yoki xperf bilan maxsus ETW seanslarini yaratishingiz mumkin."},
          {role:"Iste'molchi",color:"#b48cff",desc:"Seans buferidan (real vaqt) yoki .etl/.evtx faylidan (oflayn) hodisalarni o'qiydi. Event Viewer, Get-WinEvent, wevtutil va maxsus SIEM agentlari iste'molchilardir."},
        ].map((item,i)=>(
          <div key={i} style={{display:"flex",gap:12,padding:"10px 14px",borderRadius:8,background:`${item.color}08`,border:`1px solid ${item.color}25`}}>
            <span style={{fontFamily:"var(--font-mono)",fontSize:12,color:item.color,minWidth:110,flexShrink:0,fontWeight:700,paddingTop:1}}>{item.role}</span>
            <span style={{fontSize:13,color:"var(--text-1)",lineHeight:1.6}}>{item.desc}</span>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.2 — Log Kanallari</h3>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Kanal","Fayl Yo'li","Tarkib","Maks Hajm (standart)"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["Security","System32\\winevt\\Logs\\Security.evtx","Kirish/chiqish, imtiyoz ishlatish, ob'ektga kirish, siyosat o'zgarishi, akkount boshqaruvi — audit siyosati nima yonishini nazorat qiladi","128 MB (aylanib yoziladi)"],
            ["System","System32\\winevt\\Logs\\System.evtx","Drayver yuklash/tushirish, servis o'rnatish, apparat xatolari, yuklash hodisalari, SCM faoliyati","20 MB"],
            ["Application","System32\\winevt\\Logs\\Application.evtx","Dastur tomonidan belgilangan hodisalar (MSSQL, IIS, .NET runtime xatolari)","20 MB"],
            ["Setup","System32\\winevt\\Logs\\Setup.evtx","Windows Update, komponent o'rnatish, xizmat ko'rsatish","20 MB"],
            ["Microsoft-Windows-Sysmon/Operational","System32\\winevt\\Logs\\Microsoft-Windows-Sysmon%4Operational.evtx","Sysmon hodisalari (jarayon, tarmoq, fayl, registry…) — Sysmon o'rnatishni talab qiladi","Sozlanadi"],
            ["Microsoft-Windows-PowerShell/Operational","…\\Microsoft-Windows-PowerShell%4Operational.evtx","PS skript blok jurnallash (Event 4104), modul jurnallash (4103)","15 MB"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.3 — Muhim Xavfsizlik Event ID lari</h3>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Event ID","Kanal","Nomi","Asosiy Maydonlar / Nima Uchun Muhim"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["4624","Security","Kirish Muvaffaqiyatli","LogonType (2=interaktiv,3=tarmoq,10=uzoq interaktiv), SubjectUserName, TargetUserName, IpAddress — lateral movement aniqlash uchun asosiy"],
            ["4625","Security","Kirish Muvaffaqiyatsiz","Bir xil maydonlar + FailureReason. 4625 ning portlashi → brute force. Bitta 4625 keyin 4624 → credential stuffing muvaffaqiyati."],
            ["4648","Security","Aniq Hisob Ma'lumotlari bilan Kirish","SubjectUserName turli hisob ma'lumotlari bilan runas/tarmoq kirishini ishlatdi — pass-the-hash ko'rsatkichi"],
            ["4688","Security","Jarayon Yaratildi","NewProcessName, CommandLine (audit siyosati talab qiladi), ParentProcessName, SubjectUserName — LOLBin aniqlash uchun oltin"],
            ["4698","Security","Rejalashtirilgan Vazifa Yaratildi","TaskName, TaskContent (to'liq XML) — Task Scheduler orqali hujumchi persistenslik"],
            ["4702","Security","Rejalashtirilgan Vazifa Yangilandi","4698 bilan bir xil — o'zgartirilgan vazifa; yangi harakatlar yoki o'zgartirilgan RunAs akkountini tekshiring"],
            ["4720 / 4728","Security","Foydalanuvchi/Guruh Yaratildi","NewTargetUserName — yangi akkauntlar, yangi guruh a'zolari"],
            ["4732","Security","Xavfsizlik Guruhiga A'zo Qo'shildi","MemberName, GroupName — Administratorlar, Remote Desktop Users ga qo'shimchalarni kuzatish"],
            ["4768 / 4769","Security","Kerberos TGT/Servis Chiptasi","Kerberoasting: servis akkauntlari uchun EncryptionType=0x17 (RC4) bilan 4769 → chiptani oflayn crack qilish"],
            ["4776","Security","NTLM Autentifikatsiya Urinishi","WorkstationName, TargetUserName — pass-the-hash kiradi, barcha NTLM autentifikatsiyalar"],
            ["7045","System","Servis O'rnatildi","ServiceName, ImagePath, ServiceType, StartType — yangi servis = keng tarqalgan persistenslik"],
            ["1102","Security","Audit Jurnali Tozalandi","SubjectUserName — hujumchi tozalash, juda shubhali"],
            ["4104","PS/Operational","Skript Blok Jurnallandi","ScriptBlockText — to'liq deobfuskatsiya qilingan PowerShell kodi"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--c-warn)":j===1?"var(--c-system)":"var(--text-1)",fontFamily:j<2?"var(--font-mono)":"inherit",fontSize:j<2?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.4 — Sysmon Hodisalari</h3>
      <P><Term>Sysmon (Tizim Monitoru)</Term> — mahalliy Windows audit siyosati ta'minlaydiganidan tashqari yuqori aniqlikdagi telemetriya qo'shadigan Sysinternals drayveri + xizmati. XML orqali sozlanadi, GPO yoki SCCM orqali joylashtiriladi.</P>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12}}>
        {[
          {id:"ID 1",name:"Jarayon Yaratildi",fields:"CommandLine, Hashes (MD5/SHA256/IMPHASH), ParentImage, ParentCommandLine, User",note:"To'liq buyruq satri + hash — drayverni buzmasdan bundan yashib bo'lmaydi"},
          {id:"ID 3",name:"Tarmoq Ulanish",fields:"ManbaIp:Port, MaqsadIp:Port, Protokol, ProcessId, Image",note:"Jarayonni tarmoq ulanishiga moslashtiradi — C2 aniqlash uchun muhim"},
          {id:"ID 7",name:"Tasvir Yuklandi",fields:"ImageLoaded, Hashes, Signed, Signature, SignatureStatus",note:"Har bir DLL yuklash — imzosiz DLL in'ektsiya, LOLBin side-loading aniqlash"},
          {id:"ID 8",name:"CreateRemoteThread",fields:"SourceImage, TargetImage, StartAddress, StartModule, StartFunction",note:"Jarayonlararo thread yaratish — asosiy in'ektsiya ko'rsatkichi"},
          {id:"ID 10",name:"JarayonKirish",fields:"SourceImage, TargetImage, GrantedAccess, CallTrace",note:"lsass.exe da PROCESS_VM_READ = hisob ma'lumotlarini dumplash — eng muhim ogohlantirish"},
          {id:"ID 11",name:"Fayl Yaratildi",fields:"TargetFilename, CreationUtcTime, ProcessId",note:"Ransomware aniqlash: qisqa vaqt oralig'ida ommaviy fayl yaratish"},
          {id:"ID 12/13/14",name:"Registry Hodisalari",fields:"EventType (Create/Set/Delete), TargetObject, Details",note:"Persistenslik: autorun kalit o'zgarishlari"},
          {id:"ID 17/18",name:"Quvur Hodisalari",fields:"PipeName, Image",note:"Nomlangan quvur yaratish/ulanish — SMB quvurlari orqali lateral movement, Cobalt Strike standart quvurlari"},
          {id:"ID 22",name:"DNS So'rovi",fields:"QueryName, QueryResults, Image",note:"C2 aniqlash: DGA larga mayoq urish, g'ayritabiiy so'rov naqshlari"},
          {id:"ID 25",name:"Jarayon Buzish",fields:"Image, Type (ImageFileDeleted/HostileCodeShellcode/Other)",note:"Jarayon bo'shatish, jarayon doppelgänging aniqlash"},
        ].map((item,i)=>(
          <div key={i} style={{padding:"10px 12px",borderRadius:8,background:"rgba(255,255,255,0.03)",border:"1px solid var(--border)"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
              <span style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--c-warn)",fontWeight:700}}>{item.id}</span>
              <span style={{fontFamily:"var(--font-display)",fontSize:13,fontWeight:600,color:"var(--accent)"}}>{item.name}</span>
            </div>
            <div style={{fontSize:11,color:"var(--text-2)",fontFamily:"var(--font-mono)",marginBottom:4}}>{item.fields}</div>
            <div style={{fontSize:12,color:"var(--text-1)"}}>{item.note}</div>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.5 — Audit Siyosatini Sozlash</h3>
      <P>Standart bo'yicha Windows juda oz narsani jurnallaydi. Xavfsizlik Event ID lari faqat mos <Term>audit siyosati</Term> quyi toifasi yoqilgan bo'lsa ishga tushadi. Yoqish kerak bo'lgan muhim quyi toifalar:</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.6 — Log Buzish va Chetlab O'tish</h3>
      <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:12}}>
        {[
          {title:"Log Tozalash (Event ID 1102 / 104)",color:"var(--c-attack)",body:<>Hujumchilar Security jurnalini o'chirish uchun <code>wevtutil cl Security</code> yoki <code>Clear-EventLog -LogName Security</code> ni ishlatadi. Bu o'zi Event ID 1102 (Security jurnali tozalandi) yoki 104 (System jurnali tozalandi) ni hosil qiladi — lekin faqat Security jurnali avval tozalanmagan bo'lsa. Aniqlash: hodisalarni real vaqtda SIEM ga yo'naltirish; jurnal tozalanganda SIEM nusxasi mahalliy nusxa yo'q bo'lsa ham saqlanib qoladi.</>},
          {title:"ETW Provayderini O'chirish (Yamash)",color:"var(--c-err)",body:<>Ilg'or hujumchilar jarayon ichidagi ETW provayderini hodisalar yaratishni to'xtatish uchun yamaqlaydi. Texnika: ntdll da EtwEventWrite funksiyasini topish, RET ko'rsatmasi (<code>0xC3</code>) bilan qayta yozish. Bu jarayondan barcha ETW hodisalarini — PowerShell skript blok jurnallashni ham kiritib — o'chiradi. Aniqlash: faqat PPL jarayonlariga kirish mumkin bo'lgan kernel-rejim ETW iste'molchilari (masalan, Microsoft-Windows-Threat-Intelligence provayderi) bunga immundir.</>},
          {title:"Sysmon Drayverini Tushirish",color:"var(--c-warn)",body:<>Sysmon kernel drayveri sifatida ishlaydi. Admin Sysmon xizmatini to'xtatishi/o'chirishi mumkin: <code>sc stop Sysmon64</code>. Aniqlash: SIEM konveyerida Sysmon hodisalarining yo'qligi (bo'shliq aniqlash); Event 4 (Sysmon xizmat holati o'zgardi) da ogohlantirish; Sysmon xizmat registry kalitining o'chirilishini kuzatish.</>},
          {title:"Volume Shadow Copy O'chirish",color:"var(--c-warn)",body:<>Hujumchilar jurnal zaxira nusxalarini yo'q qilish uchun VSS snapshotlarini o'chiradi: <code>vssadmin delete shadows /all /quiet</code> yoki <code>wmic shadowcopy delete</code>. Bu endi ransomware xulq-atvor ko'rsatkichi — soya nusxalarini o'chiradigan har qanday jarayonda yuqori ustuvorlikdagi ogohlantirish hosil qiling.</>},
        ].map((item,i)=>(
          <div key={i} style={{padding:"14px 16px",borderRadius:10,background:`${item.color}08`,border:`1px solid ${item.color}30`}}>
            <div style={{fontFamily:"var(--font-display)",fontSize:14,fontWeight:700,color:item.color,marginBottom:8}}>{item.title}</div>
            <div style={{fontSize:13,color:"var(--text-1)",lineHeight:1.65}}>{item.body}</div>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.7 — Event Log So'rov Qilish</h3>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
function SectionTaskScheduler() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="Task Scheduler — Automated Execution" uz="" />
      <P>The <Term>Windows Task Scheduler</Term> service (<code>svchost -k netsvcs</code> hosting the <code>Schedule</code> service) allows tasks to be executed automatically based on time schedules or system events. Tasks are stored as XML files under <code>C:\Windows\System32\Tasks\</code> and registered in the registry. The scheduler is deeply integrated with the OS — it is both a powerful administration tool and one of the most-abused persistence mechanisms by attackers.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.1 — Task XML Structure</h3>
      <P>Every scheduled task is defined as an XML document conforming to the Task Scheduler schema. Key sections:</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.2 — Trigger Types</h3>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12}}>
        {[
          {type:"Time (CalendarTrigger)",desc:"Run once, daily, weekly, or monthly at a specific time. Most common for maintenance tasks and attacker persistence (e.g., every 5 minutes for C2 check-in)."},
          {type:"Event (EventTrigger)",desc:"Fire when a specific Windows event occurs. Example: trigger on Event 4625 (failed logon) to auto-lock account, or on system startup event to launch a payload."},
          {type:"Boot (BootTrigger)",desc:"Runs after the OS boots, before any user logs in. Equivalent to a service in terms of persistence — survives logoff."},
          {type:"Logon (LogonTrigger)",desc:"Runs when a user (specified or any) logs in. Can be scoped to a specific SID. Classic attacker persistence: run malware whenever admin logs in."},
          {type:"Idle (IdleTrigger)",desc:"Fires when the machine has been idle for a defined period. Used by Windows Update and Defrag — attackers use it to run noisy operations when the machine appears unattended."},
          {type:"Session (SessionStateChangeTrigger)",desc:"Remote connect/disconnect, console connect/disconnect, session lock/unlock. Useful for attack tools that activate when a user RDPs in."},
          {type:"Registration (RegistrationTrigger)",desc:"Runs once immediately when the task is registered. Used by installers — and by attackers to immediately execute a payload upon registration."},
          {type:"WNF (WindowsNotificationFacility)",desc:"Modern internal trigger based on WNF state changes — used by Windows components, not configurable via normal task XML."},
        ].map((item,i)=>(
          <div key={i} style={{padding:"10px 12px",borderRadius:8,background:"rgba(255,255,255,0.03)",border:"1px solid var(--border)"}}>
            <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--accent)",fontWeight:700,marginBottom:5}}>{item.type}</div>
            <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.6}}>{item.desc}</div>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.3 — Actions</h3>
      <P>A task can have multiple actions that run sequentially. Three action types:</P>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:12}}>
        {[
          {type:"Exec",color:"var(--c-system)",desc:<>Run an executable. <code>&lt;Command&gt;</code> = full path or env-variable path; <code>&lt;Arguments&gt;</code> = command line. Most common — attackers use <code>powershell.exe -enc &lt;b64&gt;</code>, <code>wscript.exe payload.vbs</code>, <code>mshta.exe http://…</code>.</>},
          {type:"ComHandler",color:"var(--c-warn)",desc:<>Instantiate a COM object and call its <code>ITaskHandler::Start()</code> method. The COM server is a DLL loaded in-process by the Task Scheduler service. Used by Windows Update (CLSID {"{…}"} in registry) — and by attackers for fileless persistence via COM hijacking.</>},
          {type:"SendEmail / ShowMessage",color:"#b48cff",desc:"Deprecated in Windows 8+. Send email or show a dialog. Rarely used in modern tasks."},
        ].map((item,i)=>(
          <div key={i} style={{display:"flex",gap:12,padding:"10px 14px",borderRadius:8,background:`${item.color}08`,border:`1px solid ${item.color}25`}}>
            <span style={{fontFamily:"var(--font-mono)",fontSize:12,color:item.color,minWidth:110,flexShrink:0,fontWeight:700,paddingTop:1}}>{item.type}</span>
            <span style={{fontSize:13,color:"var(--text-1)",lineHeight:1.6}}>{item.desc}</span>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.4 — Privilege Model</h3>
      <P>Tasks run under a specified user account determined by the <code>&lt;Principal&gt;</code> element. Key options:</P>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Principal Configuration","Privilege Level","Notes"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["UserId=S-1-5-18 (LocalSystem)","SYSTEM","Highest possible — task runs as LocalSystem. Used by Windows components."],
            ["UserId=S-1-5-19 (LocalService)","Limited","Low-privilege local account, no network."],
            ["UserId=S-1-5-20 (NetworkService)","Limited + network","Low-privilege but can access network as machine account."],
            ["UserId=DOMAIN\\User + password","That user's privileges","Stored credentials in credential vault — requires password."],
            ["RunLevel=HighestAvailable","Admin (with UAC)","If the RunAs user is admin, runs elevated (bypasses UAC prompt silently)."],
            ["LogonType=InteractiveTokenOrPassword","Interactive session","Task runs in the user's interactive session (can show UI)."],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.5 — COM-Based Task Execution (How it actually works)</h3>
      <P>The Task Scheduler is not just a cron-style timer. Internally it uses COM:</P>
      <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:12}}>
        {[
          "Task Scheduler service (Schedule) exposes ITaskService COM interface — clients register/modify tasks via COM calls",
          "The schtasks.exe and PowerShell Register-ScheduledTask cmdlets are thin wrappers around this COM API",
          "COM object CLSID {0F87369F-A4E5-4CFC-BD3E-73E6154572DD} = Task Scheduler 2.0 — accessible to any user",
          "Privilege escalation risk: any user can register a task; privilege of execution depends only on the Principal element and whether the user can provide credentials",
          "ComHandler actions load a DLL inside the Schedule service process — a DLL registered as a COM server runs as SYSTEM if the task's Principal is LocalSystem",
        ].map((step,i)=>(
          <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",padding:"8px 12px",borderRadius:6,background:"rgba(255,255,255,0.02)",border:"1px solid var(--border)"}}>
            <span style={{fontFamily:"var(--font-mono)",fontSize:12,color:"var(--accent)",minWidth:20,flexShrink:0}}>{i+1}.</span>
            <span style={{fontSize:13,color:"var(--text-1)"}}>{step}</span>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.6 — Attacker Techniques</h3>
      <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:12}}>
        {[
          {title:"Scheduled Task Persistence",color:"var(--c-attack)",body:<>Register a task that runs the payload on boot, logon, or on a short time interval: <code>schtasks /create /tn "WindowsUpdate" /tr "C:\\evil.exe" /sc onlogon /ru SYSTEM /f</code>. The <code>/f</code> flag forces creation even if a task with that name exists. Generates Event 4698. Detection: Autoruns "Scheduled Tasks" tab; Get-ScheduledTask | Where {`{$_.Actions.Execute -notmatch "Windows"}`}; Task XML files in <code>C:\Windows\System32\Tasks\</code>.</>},
          {title:"UAC Bypass via Task Scheduler",color:"var(--c-err)",body:<>Many legitimate Windows tasks (e.g., <code>\Microsoft\Windows\DiskCleanup\SilentCleanup</code>) run as the calling user with <code>RunLevel=HighestAvailable</code> and inherit the user's token without UAC prompt. By modifying the <code>%windir%</code> environment variable to a user-writable path and triggering SilentCleanup, an attacker executes arbitrary code at high integrity without a UAC prompt. This is UACME technique #41 and many variants.</>},
          {title:"Fileless Task (ComHandler)",color:"var(--c-warn)",body:<>Register a COM server (DLL) under a user-controlled CLSID in HKCU, then create a task with a ComHandler action pointing to that CLSID. When the task fires, Task Scheduler loads the DLL into its own process. The DLL runs in the Schedule service's process space — which runs as SYSTEM. No EXE on disk, no Exec action — bypasses many detection rules that look for command-line patterns.</>},
          {title:"Task XML Modification (Living off the Land)",color:"var(--c-system)",body:<>Modify an existing legitimate task's XML file directly (<code>C:\Windows\System32\Tasks\Microsoft\Windows\SomeTask</code>) to add an additional action or change the executable path. Requires admin rights but avoids creating a new task (which is more suspicious). The task definition in the file must match the registry copy — inconsistencies can be a forensic indicator of tampering.</>},
        ].map((item,i)=>(
          <div key={i} style={{padding:"14px 16px",borderRadius:10,background:`${item.color}08`,border:`1px solid ${item.color}30`}}>
            <div style={{fontFamily:"var(--font-display)",fontSize:14,fontWeight:700,color:item.color,marginBottom:8}}>{item.title}</div>
            <div style={{fontSize:13,color:"var(--text-1)",lineHeight:1.65}}>{item.body}</div>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.7 — Practical Commands</h3>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="Task Scheduler — Avtomatik Bajarish" en="" />
      <P><Term>Windows Task Scheduler</Term> xizmati (<code>Schedule</code> xizmatini joylashtiradigan <code>svchost -k netsvcs</code>) vaqt jadvallari yoki tizim hodisalariga asosida vazifalarni avtomatik bajarishga imkon beradi. Vazifalar <code>C:\Windows\System32\Tasks\</code> ostida XML fayllari sifatida saqlanadi va registry da ro'yxatga olinadi. Rejalashtiruvchi OS ga chuqur integratsiya qilingan — bu ham kuchli ma'murlik vositasi, ham hujumchilar tomonidan eng ko'p ishlatiladigan persistenslik mexanizmlaridan biri.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.1 — Vazifa XML Tuzilishi</h3>
      <P>Har bir rejalashtirilgan vazifa Task Scheduler sxemasiga mos XML hujjat sifatida belgilanadi:</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.2 — Trigger Turlari</h3>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12}}>
        {[
          {type:"Vaqt (CalendarTrigger)",desc:"Muayyan vaqtda bir marta, kunlik, haftalik yoki oylik ishga tushirish. Texnik xizmat vazifalari va hujumchi persistenslik uchun eng keng tarqalgan (masalan, C2 tekshirish uchun har 5 daqiqada)."},
          {type:"Hodisa (EventTrigger)",desc:"Muayyan Windows hodisasi yuzaga kelganida ishga tushirish. Misol: Event 4625 (muvaffaqiyatsiz kirish) da trigger qo'yish, yoki tizim yuklash hodisasida yuklamani ishga tushirish."},
          {type:"Yuklash (BootTrigger)",desc:"Hech bir foydalanuvchi kirmasdan oldin OS yuklanganidan keyin ishlaydi. Persistenslik nuqtai nazaridan xizmatga ekvivalent — chiqishdan keyin ham saqlanadi."},
          {type:"Kirish (LogonTrigger)",desc:"Foydalanuvchi (belgilangan yoki istalgan) kirganida ishlaydi. Muayyan SID ga miqyoslash mumkin. Klassik hujumchi persistenslik: admin kirganida zararli dasturni ishga tushirish."},
          {type:"Dam Olish (IdleTrigger)",desc:"Mashina belgilangan muddatga dam olganda ishga tushiradi. Windows Update va Defrag tomonidan ishlatiladi — hujumchilar mashina qarovsiz ko'ringanda shovqinli operatsiyalarni bajarish uchun foydalanadi."},
          {type:"Seans (SessionStateChangeTrigger)",desc:"Uzoqdan ulanish/uzilish, konsol ulanish/uzilish, seans bloklash/ochish. Foydalanuvchi RDP orqali ulanganda faollashadigan hujum vositalari uchun foydali."},
          {type:"Ro'yxatga olish (RegistrationTrigger)",desc:"Vazifa ro'yxatga olinganida zudlik bilan bir marta ishlaydi. O'rnatuvchilar tomonidan ishlatiladi — va hujumchilar tomonidan ro'yxatga olinishi bilan zudlik bilan yuklamani bajarish uchun."},
          {type:"WNF (WindowsNotificationFacility)",desc:"WNF holat o'zgarishlariga asosida zamonaviy ichki trigger — Windows komponentlari tomonidan ishlatiladi, odatiy vazifa XML orqali sozlanmaydi."},
        ].map((item,i)=>(
          <div key={i} style={{padding:"10px 12px",borderRadius:8,background:"rgba(255,255,255,0.03)",border:"1px solid var(--border)"}}>
            <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--accent)",fontWeight:700,marginBottom:5}}>{item.type}</div>
            <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.6}}>{item.desc}</div>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.3 — Harakatlar</h3>
      <P>Vazifaning ketma-ket bajariladigan bir nechta harakati bo'lishi mumkin. Uch xil harakat turi:</P>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:12}}>
        {[
          {type:"Exec",color:"var(--c-system)",desc:<>Bajariladigan faylni ishga tushirish. <code>&lt;Command&gt;</code> = to'liq yo'l yoki muhit-o'zgaruvchi yo'l; <code>&lt;Arguments&gt;</code> = buyruq satri. Eng keng tarqalgan — hujumchilar <code>powershell.exe -enc &lt;b64&gt;</code>, <code>wscript.exe payload.vbs</code>, <code>mshta.exe http://…</code> ishlatadi.</>},
          {type:"ComHandler",color:"var(--c-warn)",desc:<>COM ob'ektini yaratish va uning <code>ITaskHandler::Start()</code> usulini chaqirish. COM server Task Scheduler xizmati tomonidan jarayon ichida yuklanadigan DLL dir. Windows Update tomonidan ishlatiladi — va hujumchilar tomonidan COM hijacking orqali faylsiz persistenslik uchun.</>},
          {type:"SendEmail / ShowMessage",color:"#b48cff",desc:"Windows 8+ da eskirgan. Elektron pochta yuborish yoki dialog ko'rsatish. Zamonaviy vazifalarda kamdan-kam qo'llaniladi."},
        ].map((item,i)=>(
          <div key={i} style={{display:"flex",gap:12,padding:"10px 14px",borderRadius:8,background:`${item.color}08`,border:`1px solid ${item.color}25`}}>
            <span style={{fontFamily:"var(--font-mono)",fontSize:12,color:item.color,minWidth:110,flexShrink:0,fontWeight:700,paddingTop:1}}>{item.type}</span>
            <span style={{fontSize:13,color:"var(--text-1)",lineHeight:1.6}}>{item.desc}</span>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.4 — Imtiyoz Modeli</h3>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Asosiy Konfiguratsiya","Imtiyoz Darajasi","Eslatmalar"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["UserId=S-1-5-18 (LocalSystem)","SYSTEM","Eng yuqori imkon — vazifa LocalSystem sifatida ishlaydi. Windows komponentlari tomonidan ishlatiladi."],
            ["UserId=S-1-5-19 (LocalService)","Cheklangan","Past imtiyozli mahalliy akkount, tarmoqsiz."],
            ["UserId=S-1-5-20 (NetworkService)","Cheklangan + tarmoq","Past imtiyozli, lekin mashina akkaunti sifatida tarmoqqa kira oladi."],
            ["UserId=DOMAIN\\Foydalanuvchi + parol","O'sha foydalanuvchining imtiyozlari","Hisob ma'lumotlar saqlagichida saqlangan hisob ma'lumotlari — parol talab qiladi."],
            ["RunLevel=HighestAvailable","Admin (UAC bilan)","Agar RunAs foydalanuvchisi admin bo'lsa, ko'tarma (UAC so'rovsiz jimgina) ishlaydi."],
            ["LogonType=InteractiveTokenOrPassword","Interaktiv seans","Vazifa foydalanuvchining interaktiv seansida ishlaydi (UI ko'rsatishi mumkin)."],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.5 — Hujumchi Texnikalari</h3>
      <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:12}}>
        {[
          {title:"Rejalashtirilgan Vazifa Persistenslik",color:"var(--c-attack)",body:<>Yuklash, kirish yoki qisqa vaqt oralig'ida yuklamani bajara digan vazifani ro'yxatga olish: <code>schtasks /create /tn "WindowsUpdate" /tr "C:\\evil.exe" /sc onlogon /ru SYSTEM /f</code>. <code>/f</code> bayrog'i bu nom bilan vazifa mavjud bo'lsa ham yaratishni majburlaydi. Event 4698 hosil qiladi. Aniqlash: Autoruns "Scheduled Tasks" yorlig'i; Get-ScheduledTask; <code>C:\Windows\System32\Tasks\</code> dagi vazifa XML fayllari.</>},
          {title:"Task Scheduler orqali UAC Bypass",color:"var(--c-err)",body:<>Ko'plab qonuniy Windows vazifalari (masalan, <code>\Microsoft\Windows\DiskCleanup\SilentCleanup</code>) <code>RunLevel=HighestAvailable</code> bilan chaqiruvchi foydalanuvchi sifatida ishlaydi va UAC so'rovsiz foydalanuvchining tokenini meros qilib oladi. <code>%windir%</code> muhit o'zgaruvchisini foydalanuvchi yoziladigan yo'lga o'zgartirish va SilentCleanup ni ishga tushirish orqali hujumchi UAC so'rovsiz yuqori yaxlitlikda ixtiyoriy kodni bajaradi. Bu UACME #41 texnikasi va ko'plab variantlar.</>},
          {title:"Faylsiz Vazifa (ComHandler)",color:"var(--c-warn)",body:<>HKCU da foydalanuvchi nazorat qiladigan CLSID ostida COM server (DLL) ro'yxatga olish, keyin shu CLSIDga ishora qiluvchi ComHandler harakat bilan vazifa yaratish. Vazifa ishga tushganida, Task Scheduler DLL ni o'z jarayoniga yuklaydi. DLL Schedule xizmatining jarayon maydonida ishlaydi — bu SYSTEM sifatida ishlaydi. Diskda EXE yo'q, Exec harakat yo'q — buyruq satri naqshlarini qidiradigan ko'plab aniqlash qoidalarini chetlab o'tadi.</>},
          {title:"Vazifa XML O'zgartirish",color:"var(--c-system)",body:<>Mavjud qonuniy vazifaning XML faylini to'g'ridan-to'g'ri o'zgartirish (<code>C:\Windows\System32\Tasks\Microsoft\Windows\SomeTask</code>) — qo'shimcha harakat qo'shish yoki bajariladigan fayl yo'lini o'zgartirish. Admin huquqlarini talab qiladi, lekin yangi vazifa yaratishni (bu shubhaliroq) oldini oladi. Fayl va registry nusxasi o'rtasidagi nomuvofiqlik buzishning forensics ko'rsatkichi bo'lishi mumkin.</>},
        ].map((item,i)=>(
          <div key={i} style={{padding:"14px 16px",borderRadius:10,background:`${item.color}08`,border:`1px solid ${item.color}30`}}>
            <div style={{fontFamily:"var(--font-display)",fontSize:14,fontWeight:700,color:item.color,marginBottom:8}}>{item.title}</div>
            <div style={{fontSize:13,color:"var(--text-1)",lineHeight:1.65}}>{item.body}</div>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.6 — Amaliy Buyruqlar</h3>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
function SectionWindowsLogs() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="Windows Log Files — Forensic Analysis" uz="" />
      <P>Beyond the Event Log system, Windows produces a rich ecosystem of log files scattered across the filesystem. Knowing where they are, what format they use, and how to parse them is essential for incident response. This lesson covers the <Term>EVTX binary format</Term>, the most important log file locations, techniques for querying and correlating logs, and how to detect log tampering.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.1 — EVTX Binary Format</h3>
      <P>Windows Vista replaced the legacy binary .evt format with <Term>EVTX</Term> — a structured binary format that supports fast random access, integrity checking, and rich metadata. Structure:</P>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["EVTX Component","Size","Description"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["File Header","4 KB","Magic 'ElfFile\\0', file version, chunk count, next record ID, header size, flags, CRC32 of header"],
            ["Chunk (128 KB each)","128 KB × N","Each chunk is self-contained: chunk header + event records. Chunk header has first/last record ID, last written timestamp, event records checksum, header checksum"],
            ["Event Record","Variable","8-byte magic 0x2a2a, record size, event record ID, timestamp (FILETIME), then BinXML payload"],
            ["BinXML","Variable","Binary-encoded XML — the event data. Uses a string table to deduplicate repeated strings. Parsed by EvtRender API or python-evtx"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>
      <Callout color="var(--c-system)" icon="info" titleEn="Detecting selective record deletion" titleUz="">
        Each event record contains a monotonically incrementing Record ID. If you parse an EVTX file and find a gap in Record IDs (e.g., 10001 → 10050), records were deleted between them. The Windows Event Log service does not create gaps during normal operation (it wraps the whole file, never surgically deletes). Gaps = tampering. Tools like python-evtx and Chainsaw detect this automatically.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.2 — Key Log File Locations</h3>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Log File / Artifact","Path","Forensic Value"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["Security.evtx","%SystemRoot%\\System32\\winevt\\Logs\\Security.evtx","All authentication, privilege, and object access events — primary forensic log"],
            ["System.evtx","%SystemRoot%\\System32\\winevt\\Logs\\System.evtx","Service installs, driver loads, shutdown events (6005/6006/6008)"],
            ["Microsoft-Windows-Sysmon%4Operational.evtx","%SystemRoot%\\System32\\winevt\\Logs\\","Sysmon telemetry — process tree, network, file, registry if deployed"],
            ["Microsoft-Windows-PowerShell%4Operational.evtx","Same directory","Script block content (4104) — full deobfuscated PS code"],
            ["Microsoft-Windows-TaskScheduler%4Operational.evtx","Same directory","Task registration/update/launch/complete — 106, 140, 141, 200, 201"],
            ["WER\\ReportArchive","C:\\ProgramData\\Microsoft\\Windows\\WER\\ReportArchive\\","Crash reports with process dumps — memory snapshots of crashed malware"],
            ["Prefetch files","C:\\Windows\\Prefetch\\*.pf","Evidence of execution: EXE name, run count, last run time, file paths accessed (up to 128 files per entry)"],
            ["$MFT (NTFS Master File Table)","\\$MFT (root of each volume)","Every file ever created: timestamps (MAC + birth), size, parent dir — parse with mftparser or MFTECmd"],
            ["$UsnJrnl:$J","\\$Extend\\$UsnJrnl","File system change journal: create/modify/rename/delete entries with filename and timestamp — survives file deletion"],
            ["Shimcache (AppCompatCache)","HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\AppCompatCache","Evidence of execution (last modification time + execution flag) for each PE seen on system — survives reboot, not cleared by wiping event logs"],
            ["AmCache.hve","C:\\Windows\\AppCompat\\Programs\\Amcache.hve","Program compatibility telemetry: SHA1 hash + publisher + install time for executed binaries — gold for malware identification"],
            ["SRUM (System Resource Usage Monitor)","C:\\Windows\\System32\\sru\\SRUDB.dat","Network bytes sent/received, CPU/RAM usage per app per hour — attacker data exfiltration volumes even after log clearing"],
            ["LNK files / JumpLists","C:\\Users\\*\\AppData\\Roaming\\Microsoft\\Windows\\Recent\\","Evidence of file access: timestamps, original path, volume serial number"],
            ["Browser history / WebCache","C:\\Users\\*\\AppData\\Local\\Microsoft\\Windows\\WebCache\\","Download history, visited URLs, cached pages"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.3 — Log Analysis Tools</h3>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12}}>
        {[
          {tool:"Chainsaw (WithSecure)",use:"EVTX forensics","desc":"Sigma rule engine + EVTX parser. Fast bulk analysis of offline EVTX files against Sigma rules. Essential for triage."},
          {tool:"Hayabusa",use:"Threat hunting","desc":"Japanese EVTX forensic tool with built-in detection rules, timeline generation, and attack technique mapping to MITRE ATT&CK."},
          {tool:"python-evtx",use:"Low-level parsing","desc":"Python library for parsing raw EVTX binary. Detect Record ID gaps, recover deleted records from slack space."},
          {tool:"Velociraptor",use:"DFIR platform","desc":"Open-source DFIR framework. Collect EVTX, prefetch, Shimcache, AmCache, SRUM remotely at scale."},
          {tool:"KAPE (Triage)",use:"Evidence collection","desc":"Collect all forensic artifacts (EVTX, $MFT, Prefetch, AmCache, SRUM, registry hives) in one pass. Industry standard first-response tool."},
          {tool:"Eric Zimmerman Tools (MFTECmd, PECmd, SrumECmd, AppCompatCacheParser)",use:"Artifact parsing","desc":"Best-in-class Windows artifact parsers. Each handles one artifact type with timeline-compatible CSV output."},
          {tool:"Sigma",use:"Detection rules","desc":"YAML-based generic detection rule language for SIEM systems. Write once, convert to Splunk/Elastic/QRadar query automatically."},
          {tool:"Get-WinEvent / wevtutil",use:"Live query","desc":"Built-in Windows tools. Get-WinEvent supports FilterHashtable for fast channel+ID+time queries without loading all events."},
        ].map((item,i)=>(
          <div key={i} style={{padding:"10px 12px",borderRadius:8,background:"rgba(255,255,255,0.03)",border:"1px solid var(--border)"}}>
            <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--accent)",fontWeight:700,marginBottom:3}}>{item.tool}</div>
            <div style={{fontSize:10,color:"var(--c-warn)",fontFamily:"var(--font-mono)",marginBottom:5}}>{item.use}</div>
            <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.6}}>{item.desc}</div>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.4 — Log Clearing and Tampering Detection</h3>
      <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:12}}>
        {[
          {title:"Event ID 1102 / 104 — Audit Log Cleared",color:"var(--c-attack)",body:<>Event 1102 fires when the Security log is cleared; Event 104 when any other log is cleared. Both record the SubjectUserName and SubjectLogonId of who cleared it. Forward these events to an off-host SIEM in real time — once cleared locally, the original events are gone but the clearing event itself survives in the SIEM. Alert immediately: 1102/104 outside of a maintenance window is a high-fidelity attack indicator.</>},
          {title:"EVTX Record ID Gaps",color:"var(--c-err)",body:<>Parse the EVTX file offline and check for gaps in the RecordId sequence within each chunk. Normal operation: RecordIds increment continuously. Tampering: gaps appear where records were individually deleted using techniques like direct file modification, EvtClear API calls on specific ranges, or driver-level log manipulation. python-evtx and Chainsaw both detect these gaps automatically.</>},
          {title:"Log File Timestamps",color:"var(--c-warn)",body:<>The EVTX file's NTFS $STANDARD_INFORMATION timestamps (modify/access/created) and the timestamps of the last written event inside the file should be consistent. If the file modification time precedes the last event timestamp inside it — the timestamps were manipulated (timestomping). Compare with $MFT $FILENAME timestamps (harder to forge) and $UsnJrnl for last write operation.</>},
          {title:"Sysmon / ETW Provider Gap Detection",color:"var(--c-system)",body:<>If Sysmon is deployed, the absence of Sysmon events during a time window where other activity is visible (e.g., network logs show connections but no corresponding Sysmon Event 3) indicates the Sysmon driver was stopped. Monitor the Sysmon Operational log for Event ID 4 (service state change) and alert on any gap exceeding the normal heartbeat interval.</>},
        ].map((item,i)=>(
          <div key={i} style={{padding:"14px 16px",borderRadius:10,background:`${item.color}08`,border:`1px solid ${item.color}30`}}>
            <div style={{fontFamily:"var(--font-display)",fontSize:14,fontWeight:700,color:item.color,marginBottom:8}}>{item.title}</div>
            <div style={{fontSize:13,color:"var(--text-1)",lineHeight:1.65}}>{item.body}</div>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.5 — Forensic Triage Workflow</h3>
      <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:12}}>
        {[
          {step:"1. Collect",desc:"KAPE triage: collect Security.evtx, System.evtx, Sysmon.evtx, Prefetch (*.pf), AmCache.hve, SRUM DB, $MFT, $UsnJrnl, registry hives. Takes 2–5 minutes on a live system."},
          {step:"2. Timeline",desc:"Run MFTECmd on $MFT → CSV timeline. Merge with EVTX events and $UsnJrnl using tools like Plaso or Timeline Explorer. Creates a single chronological view of all system activity."},
          {step:"3. Triage",desc:"Run Chainsaw or Hayabusa against collected EVTX files with built-in Sigma rules. Output: ranked list of suspicious events with MITRE ATT&CK technique IDs."},
          {step:"4. Pivot",desc:"Starting from the highest-confidence event, pivot: who created that process? What network connections did it make? What files did it create? Use the EVTX process tree (4688 parent-child) + Sysmon Event 1 for full context."},
          {step:"5. Attribution",desc:"Hash suspicious files against VirusTotal. Check compiler timestamps and rich header. Query AmCache for first-seen timestamp. Compare with threat intelligence feeds."},
          {step:"6. Scope",desc:"Determine lateral movement scope: 4624 logon type 3 from the compromised host to other hosts in Security logs. Use SRUM to identify data exfiltration by process. Check scheduled tasks (4698) and services (7045) created during the attack window for persistence mechanisms."},
        ].map((item,i)=>(
          <div key={i} style={{display:"flex",gap:14,padding:"10px 14px",borderRadius:8,background:"rgba(255,255,255,0.02)",border:"1px solid var(--border)"}}>
            <span style={{fontFamily:"var(--font-mono)",fontSize:12,color:"var(--accent)",minWidth:80,flexShrink:0,fontWeight:700}}>{item.step}</span>
            <span style={{fontSize:13,color:"var(--text-1)",lineHeight:1.6}}>{item.desc}</span>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.6 — Practical Commands</h3>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="Windows Log Fayllari — Forensik Tahlil" en="" />
      <P>Event Log tizimidan tashqari, Windows fayl tizimida tarqalgan boylik jurnal fayllar ekotizimini ishlab chiqaradi. Ularning joylashuvini, formatini va qanday tahlil qilishni bilish hodisalarga javob berishda muhim. Bu darsda <Term>EVTX ikkilik formati</Term>, eng muhim jurnal fayl joylashuvlari, jurnal so'rov qilish va moslashtirish texnikalari va jurnal buzishni aniqlash usullari ko'rib chiqiladi.</P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.1 — EVTX Ikkilik Formati</h3>
      <P>Windows Vista eski ikkilik .evt formatini <Term>EVTX</Term> bilan almashtirdi — tez tasodifiy kirish, yaxlitlik tekshiruvi va boy metama'lumotlarni qo'llab-quvvatlaydigan tuzilgan ikkilik format.</P>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["EVTX Komponenti","Hajmi","Tavsif"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["Fayl Sarlavhasi","4 KB","Sehrli so'z 'ElfFile\\0', fayl versiyasi, chunk soni, keyingi yozuv ID, sarlavha hajmi, bayroqlar, sarlavha CRC32"],
            ["Chunk (128 KB har biri)","128 KB × N","Har bir chunk o'zini-o'zi ta'minlaydi: chunk sarlavhasi + hodisa yozuvlari. Chunk sarlavhasida birinchi/oxirgi yozuv ID, oxirgi yozilgan vaqt belgisi, hodisa yozuvlari nazorat summasi"],
            ["Hodisa Yozuvi","O'zgaruvchan","8-baytli sehrli so'z 0x2a2a, yozuv hajmi, hodisa yozuv ID, vaqt belgisi (FILETIME), keyin BinXML payload"],
            ["BinXML","O'zgaruvchan","Ikkilik kodlangan XML — hodisa ma'lumotlari. Takroriy satrlarni bekor qilish uchun satr jadvalidan foydalanadi. EvtRender API yoki python-evtx tomonidan tahlil qilinadi"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>
      <Callout color="var(--c-system)" icon="info" titleUz="Tanlab o'chirish aniqlash" titleEn="">
        Har bir hodisa yozuvida monoton oshib boruvchi Yozuv ID mavjud. EVTX faylini tahlil qilsangiz va Yozuv ID larida bo'shliq topsangiz (masalan, 10001 → 10050), ular o'rtasidagi yozuvlar o'chirilgan. Windows Hodisa Jurnali xizmati normal ishlashda bo'shliqlar yaratmaydi (butun faylni aylanib yozadi, hech qachon jarrohlik bilan o'chirmaydi). Bo'shliqlar = buzish. python-evtx va Chainsaw buni avtomatik aniqlaydi.
      </Callout>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.2 — Asosiy Jurnal Fayl Joylashuvlari</h3>
      <div style={{overflowX:"auto",marginTop:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
            {["Jurnal Fayli / Artefakt","Yo'l","Forensik Qiymati"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-2)",fontWeight:600}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["Security.evtx","%SystemRoot%\\System32\\winevt\\Logs\\Security.evtx","Barcha autentifikatsiya, imtiyoz va ob'ektga kirish hodisalari — asosiy forensik jurnal"],
            ["System.evtx","%SystemRoot%\\System32\\winevt\\Logs\\System.evtx","Servis o'rnatish, drayver yuklash, o'chirish hodisalari (6005/6006/6008)"],
            ["Microsoft-Windows-Sysmon%4Operational.evtx","%SystemRoot%\\System32\\winevt\\Logs\\","Sysmon telemetriyasi — jarayon daraxti, tarmoq, fayl, registry (agar joylashtirilgan bo'lsa)"],
            ["Microsoft-Windows-PowerShell%4Operational.evtx","Bir xil katalog","Skript blok tarkibi (4104) — to'liq deobfuskatsiya qilingan PS kodi"],
            ["Microsoft-Windows-TaskScheduler%4Operational.evtx","Bir xil katalog","Vazifa ro'yxatga olish/yangilash/ishga tushirish/bajarish — 106, 140, 141, 200, 201"],
            ["WER\\ReportArchive","C:\\ProgramData\\Microsoft\\Windows\\WER\\ReportArchive\\","Jarayon dumplari bilan crash hisobotlari — ishlamay qolgan zararli dasturning xotira snapshotlari"],
            ["Prefetch fayllari","C:\\Windows\\Prefetch\\*.pf","Bajarilish dalili: EXE nomi, ishga tushirish soni, oxirgi ishga tushirish vaqti, kirish uchun fayl yo'llari (har bir yozuv uchun 128 tagacha)"],
            ["$MFT (NTFS Asosiy Fayl Jadvali)","\\$MFT (har bir tomizdagi ildiz)","Hech qachon yaratilgan har bir fayl: vaqt belgilari (MAC + tug'ilish), hajm, ota katalog — mftparser yoki MFTECmd bilan tahlil qilish"],
            ["$UsnJrnl:$J","\\$Extend\\$UsnJrnl","Fayl tizimi o'zgartirish jurnali: fayl nomi va vaqt belgisi bilan yaratish/o'zgartirish/nomini o'zgartirish/o'chirish yozuvlari — fayl o'chirilgandan keyin ham saqlanadi"],
            ["Shimcache (AppCompatCache)","HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\AppCompatCache","Tizimda ko'rilgan har bir PE uchun bajarilish dalili (oxirgi o'zgartirish vaqti + bajarilish bayrog'i) — qayta yuklashdan omon qoladi, hodisa jurnallarini o'chirish bilan tozalanmaydi"],
            ["AmCache.hve","C:\\Windows\\AppCompat\\Programs\\Amcache.hve","Dastur muvofiqligi telemetriyasi: bajarilgan ikkilik fayllar uchun SHA1 hash + nashriyotchi + o'rnatish vaqti — zararli dasturni identifikatsiya qilish uchun oltin"],
            ["SRUM (Tizim Resurs Foydalanish Monitoru)","C:\\Windows\\System32\\sru\\SRUDB.dat","Dastur boshiga soatlik tarmoq baytlari yuborildi/olindi, CPU/RAM foydalanish — log tozalangandan keyin ham hujumchi ma'lumot eksfiltratsiya hajmlari"],
            ["LNK fayllari / JumpListlar","C:\\Users\\*\\AppData\\Roaming\\Microsoft\\Windows\\Recent\\","Fayl kirishining dalili: vaqt belgilari, asl yo'l, hajm seriya raqami"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:13}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.3 — Log Tahlil Vositalari</h3>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12}}>
        {[
          {tool:"Chainsaw (WithSecure)",use:"EVTX forensics","desc":"Sigma qoidalar dvigatel + EVTX tahlilchi. Sigma qoidalariga qarshi oflayn EVTX fayllarini tez to'plamli tahlil. Triage uchun muhim."},
          {tool:"Hayabusa",use:"Tahdidlarni ovlash","desc":"O'rnatilgan aniqlash qoidalari, vaqt jadvali yaratish va MITRE ATT&CK ga hujum texnikasini moslash bilan yapon EVTX forensik vositasi."},
          {tool:"python-evtx",use:"Past darajali tahlil","desc":"Xom EVTX ikkiligini tahlil qilish uchun Python kutubxonasi. Yozuv ID bo'shliqlarini aniqlash, bo'sh joydan o'chirilgan yozuvlarni tiklash."},
          {tool:"Velociraptor",use:"DFIR platformasi","desc":"Ochiq manbali DFIR ramkasi. EVTX, prefetch, Shimcache, AmCache, SRUM ni miqyosda masofadan to'plash."},
          {tool:"KAPE (Triage)",use:"Dalil to'plash","desc":"Barcha forensik artefaktlarni (EVTX, $MFT, Prefetch, AmCache, SRUM, registry hive lar) bir yo'lda to'plash. Sanoat standarti birinchi javob vositasi."},
          {tool:"Eric Zimmerman vositalari (MFTECmd, PECmd, SrumECmd, AppCompatCacheParser)",use:"Artefakt tahlil","desc":"Eng yaxshi Windows artefakt tahlilchilari. Har biri vaqt jadvali bilan mos CSV chiqishi bilan bitta artefakt turini boshqaradi."},
          {tool:"Sigma",use:"Aniqlash qoidalari","desc":"SIEM tizimlari uchun YAML asosidagi umumiy aniqlash qoidalari tili. Bir marta yozing, Splunk/Elastic/QRadar so'roviga avtomatik o'tkazing."},
          {tool:"Get-WinEvent / wevtutil",use:"Jonli so'rov","desc":"O'rnatilgan Windows vositalari. Get-WinEvent barcha hodisalarni yuklashsiz tez kanal+ID+vaqt so'rovlari uchun FilterHashtable ni qo'llab-quvvatlaydi."},
        ].map((item,i)=>(
          <div key={i} style={{padding:"10px 12px",borderRadius:8,background:"rgba(255,255,255,0.03)",border:"1px solid var(--border)"}}>
            <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--accent)",fontWeight:700,marginBottom:3}}>{item.tool}</div>
            <div style={{fontSize:10,color:"var(--c-warn)",fontFamily:"var(--font-mono)",marginBottom:5}}>{item.use}</div>
            <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.6}}>{item.desc}</div>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.4 — Log Tozalash va Buzishni Aniqlash</h3>
      <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:12}}>
        {[
          {title:"Event ID 1102 / 104 — Audit Jurnali Tozalandi",color:"var(--c-attack)",body:<>Event 1102 Security jurnali tozalanganida; Event 104 boshqa jurnal tozalanganida ishga tushadi. Ikkalasi ham kim tozalaganini SubjectUserName va SubjectLogonId qilib qayd etadi. Bu hodisalarni real vaqtda tashqi SIEM ga yo'naltiring — mahalliy ravishda tozalangandan keyin asl hodisalar yo'qoladi, lekin tozalash hodisasining o'zi SIEM da saqlanib qoladi.</>},
          {title:"EVTX Yozuv ID Bo'shliqlari",color:"var(--c-err)",body:<>EVTX faylini oflayn tahlil qiling va har bir chunk ichidagi RecordId ketma-ketligida bo'shliqlarni tekshiring. Normal ishlash: RecordId lar uzluksiz oshib boradi. Buzish: yozuvlar to'g'ridan-to'g'ri fayl o'zgartirish, muayyan diapazondagi EvtClear API chaqiruvlari yoki drayver darajasidagi jurnal manipulyatsiyasi yordamida alohida o'chirilganda bo'shliqlar paydo bo'ladi.</>},
          {title:"Jurnal Fayl Vaqt Belgilari",color:"var(--c-warn)",body:<>EVTX faylining NTFS $STANDARD_INFORMATION vaqt belgilari va fayl ichidagi oxirgi yozilgan hodisaning vaqt belgilari mos bo'lishi kerak. Agar fayl o'zgartirish vaqti fayl ichidagi oxirgi hodisa vaqt belgisidan oldin bo'lsa — vaqt belgilari manipulyatsiya qilingan (timestomping). $MFT $FILENAME vaqt belgilari (soxtalashtirish qiyinroq) va oxirgi yozuv operatsiyasi uchun $UsnJrnl bilan solishtiring.</>},
          {title:"Sysmon / ETW Provayder Bo'shliq Aniqlash",color:"var(--c-system)",body:<>Agar Sysmon joylashtirilgan bo'lsa, boshqa faoliyat ko'rinadigan vaqt oralig'ida Sysmon hodisalarining yo'qligi (masalan, tarmoq jurnallari ulanishlarni ko'rsatadi, lekin mos Sysmon Event 3 yo'q) Sysmon drayveri to'xtatilganligini ko'rsatadi. Sysmon Operational jurnalini Event ID 4 (xizmat holati o'zgardi) uchun kuzatib turing va odatiy yurak urish oralig'idan oshib ketgan bo'shliqda ogohlantirish bering.</>},
        ].map((item,i)=>(
          <div key={i} style={{padding:"14px 16px",borderRadius:10,background:`${item.color}08`,border:`1px solid ${item.color}30`}}>
            <div style={{fontFamily:"var(--font-display)",fontSize:14,fontWeight:700,color:item.color,marginBottom:8}}>{item.title}</div>
            <div style={{fontSize:13,color:"var(--text-1)",lineHeight:1.65}}>{item.body}</div>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.5 — Forensik Triage Ish Oqimi</h3>
      <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:12}}>
        {[
          {step:"1. To'plash",desc:"KAPE triage: Security.evtx, System.evtx, Sysmon.evtx, Prefetch (*.pf), AmCache.hve, SRUM DB, $MFT, $UsnJrnl, registry hive larni to'plash. Jonli tizimda 2–5 daqiqa."},
          {step:"2. Vaqt Jadvali",desc:"$MFT da MFTECmd ishga tushirish → CSV vaqt jadvali. Plaso yoki Timeline Explorer yordamida EVTX hodisalari va $UsnJrnl bilan birlashtirish. Barcha tizim faoliyatining yagona xronologik ko'rinishi yaratiladi."},
          {step:"3. Triage",desc:"To'plangan EVTX fayllariga o'rnatilgan Sigma qoidalari bilan Chainsaw yoki Hayabusa ishga tushirish. Chiqish: MITRE ATT&CK texnika ID lari bilan shubhali hodisalarning reytingli ro'yxati."},
          {step:"4. Pivot",desc:"Eng ishonchli hodisadan boshlab, pivotlash: bu jarayonni kim yaratdi? U qanday tarmoq ulanishlarini amalga oshirdi? U qanday fayllar yaratdi? To'liq kontekst uchun EVTX jarayon daraxti (4688 ota-bola) + Sysmon Event 1 dan foydalaning."},
          {step:"5. Atribut",desc:"Shubhali fayllarni VirusTotal ga qarshi hashlash. Kompilyator vaqt belgilari va rich sarlavhasini tekshirish. Birinchi ko'rish vaqt belgisi uchun AmCache ni so'rash. Tahdid razvedkasi lentlari bilan solishtirish."},
          {step:"6. Qamrov",desc:"Lateral movement qamrovini aniqlash: buzilgan hostdan boshqa hostlarga kirish turi 3 bilan 4624. Ma'lumot eksfiltratsiya hajmlarini jarayon bo'yicha aniqlash uchun SRUM ni ishlatish. Hujum oynasida yaratilgan rejalashtirilgan vazifalarni (4698) va xizmatlarni (7045) persistenslik mexanizmlari uchun tekshirish."},
        ].map((item,i)=>(
          <div key={i} style={{display:"flex",gap:14,padding:"10px 14px",borderRadius:8,background:"rgba(255,255,255,0.02)",border:"1px solid var(--border)"}}>
            <span style={{fontFamily:"var(--font-mono)",fontSize:12,color:"var(--accent)",minWidth:100,flexShrink:0,fontWeight:700}}>{item.step}</span>
            <span style={{fontSize:13,color:"var(--text-1)",lineHeight:1.6}}>{item.desc}</span>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>1.6 — Amaliy Buyruqlar</h3>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
function LessonLocked({ lessonNum, prevLessonNum, setRoute, sectionNum = 1 }) {
  const lang = useLang();
  const prevLesson = LESSONS[prevLessonNum];
  return (
    <div style={{ textAlign: "center", padding: "80px 32px" }}>
      <div style={{
        width: 80, height: 80, borderRadius: "50%",
        background: "rgba(255,180,0,0.08)", border: "1px solid rgba(255,180,0,0.3)",
        margin: "0 auto 24px", display: "grid", placeItems: "center", color: "var(--c-warn)",
      }}>
        <Icon name="lock" size={36} />
      </div>
      <div className="eyebrow" style={{ color: "var(--c-warn)", marginBottom: 12 }}>
        // {lang === "en" ? "LESSON_LOCKED" : "DARS_QULFLANGAN"}
      </div>
      <h2 className="display" style={{ fontSize: 32, margin: "0 0 10px", letterSpacing: "-0.02em" }}>
        {lang === "en" ? "This lesson is locked" : "Bu dars qulflangan"}
      </h2>
      <p style={{ color: "var(--text-2)", fontSize: 15, maxWidth: 460, margin: "0 auto 32px", lineHeight: 1.65 }}>
        {lang === "en"
          ? <>Complete <strong>L{String(prevLessonNum).padStart(2,"0")}{prevLesson ? ` — ${prevLesson.en}` : ""}</strong> and pass its quiz to unlock this lesson.</>
          : <><strong>L{String(prevLessonNum).padStart(2,"0")}{prevLesson ? ` — ${prevLesson.uz}` : ""}</strong> darsini tugating va testini topshiring — bu dars avtomatik ochiladi.</>}
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button className="btn" onClick={() => setRoute({ name: "section", section: sectionNum })}>
          <Icon name="arrow-left" size={14} /> {lang === "en" ? "Back to section" : "Bo'limga qaytish"}
        </button>
        <button className="btn btn-primary" onClick={() => setRoute({ name: "lesson", lesson: prevLessonNum })}>
          {lang === "en" ? `Go to L${String(prevLessonNum).padStart(2,"0")}` : `L${String(prevLessonNum).padStart(2,"0")} darsiga o'tish`} <Icon name="arrow-right" size={14} />
        </button>
      </div>
    </div>
  );
}

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
// L23 – Settings & Control Panel
// ─────────────────────────────────────────────────────────────
function SectionSettings() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="Settings App vs Control Panel" uz="" />
      <P>Windows offers two parallel configuration interfaces: the modern <Term>Settings app</Term> (WinRT/UWP, redesigned in Windows 11) and the legacy <Term>Control Panel</Term> (Win32, available since Windows 1.0). Microsoft is gradually migrating Control Panel features into Settings, but many enterprise and security-critical tools remain in Control Panel.</P>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,margin:"18px 0"}}>
        <div style={{padding:16,background:"rgba(0,255,156,0.06)",border:"1px solid rgba(0,255,156,0.25)",borderRadius:10}}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--accent)",marginBottom:8}}>SETTINGS APP (Modern)</div>
          <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.7}}>ms-settings: URI scheme<br/>WinRT/UWP + XAML UI<br/>Per-user &amp; system scope<br/>Touch-friendly design<br/>Syncs with Microsoft Account<br/><span style={{color:"var(--accent)"}}>→ Win10/11 default</span></div>
        </div>
        <div style={{padding:16,background:"rgba(100,100,255,0.06)",border:"1px solid rgba(100,100,255,0.25)",borderRadius:10}}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--c-auth)",marginBottom:8}}>CONTROL PANEL (Legacy)</div>
          <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.7}}>control.exe + .cpl applets<br/>Win32/MFC UI<br/>Admin-focused features<br/>No Microsoft account sync<br/><span style={{color:"var(--c-auth)"}}>→ Enterprise standard</span></div>
        </div>
      </div>
      <H2 num="§2" en="Settings App — URI Deep Links" uz="" />
      <P>The Settings app (<code>SystemSettings.exe</code>) uses the <Term>ms-settings:</Term> URI scheme for deep-linking to any page. Settings are stored in <code>HKCU</code> (per-user) or <code>HKLM</code> (machine-wide).</P>
      <H2 num="§3" en="Control Panel — Key Applets" uz="" />
      <div style={{overflowX:"auto",marginTop:10}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Run command","Applet","What it controls"].map((h,i)=><th key={i} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-3)",fontWeight:600,fontFamily:"var(--font-mono)",fontSize:10}}>{h}</th>)}</tr></thead>
          <tbody>
            {[
              ["control userpasswords2","User Accounts","Local accounts, auto-login bypass toggle"],
              ["netplwiz","Network Passwords Wizard","Same as above — cleaner UI"],
              ["appwiz.cpl","Programs & Features","Uninstall/change installed programs"],
              ["sysdm.cpl","System Properties","Computer name, hardware, DEP, crash dumps, RDP"],
              ["firewall.cpl","Windows Firewall","Turn firewall on/off, basic allow rules"],
              ["ncpa.cpl","Network Connections","All network adapters, manual IP config"],
              ["hdwwiz.cpl","Add Hardware Wizard","Manually install legacy hardware"],
              ["desk.cpl","Display Settings","Resolution, scaling, multiple monitors"],
              ["powercfg.cpl","Power Options","Sleep, hibernate, battery plans"],
              ["timedate.cpl","Date and Time","Clock, time zones, time server (NTP)"],
              ["intl.cpl","Region","Language, number/date format, keyboard layout"],
              ["mmsys.cpl","Sound","Audio devices, volume mixer, recording"],
            ].map((r,i)=>(
              <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.01)"}}>
                {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:12}}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <H2 num="§4" en="Security-Relevant Settings" uz="" />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,margin:"14px 0"}}>
        {[
          {t:"Windows Security",c:"var(--accent)",items:["Virus & threat protection (Defender)","Firewall & network protection","App & browser control (SmartScreen)","Device security (TPM, Secure Boot)","Core isolation / Memory integrity (HVCI)"]},
          {t:"Sign-in Options",c:"var(--c-auth)",items:["Windows Hello (PIN / fingerprint / face)","Security key (FIDO2)","Dynamic lock","Require Windows Hello on wakeup","Password-less sign-in toggle"]},
          {t:"Privacy & Diagnostics",c:"var(--c-warn)",items:["Diagnostic data level (Basic / Full)","Activity history (Timeline)","App permissions (Camera / Mic / Location)","Advertising ID","Find My Device"]},
          {t:"Group Policy overrides (gpedit.msc)",c:"var(--c-attack)",items:["Overrides many Settings options","AppLocker / SRP rules","PowerShell execution policy","Windows Update deferral","Software installation restrictions"]},
        ].map((card,i)=>(
          <div key={i} style={{padding:14,background:`${card.c}08`,border:`1px solid ${card.c}30`,borderRadius:10}}>
            <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:card.c,marginBottom:8}}>{card.t}</div>
            <ul style={{margin:0,paddingLeft:16,fontSize:12,color:"var(--text-1)",lineHeight:1.7}}>{card.items.map((item,j)=><li key={j}>{item}</li>)}</ul>
          </div>
        ))}
      </div>
      <H2 num="§5" en="Practical Commands" uz="" />
      <div style={{overflowX:"auto",marginTop:10}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Command","Opens"].map((h,i)=><th key={i} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-3)",fontWeight:600,fontFamily:"var(--font-mono)",fontSize:10}}>{h}</th>)}</tr></thead>
          <tbody>
            {[
              ["start ms-settings:","Settings app home"],
              ["start ms-settings:privacy-diagnostics","Diagnostic data settings"],
              ["start ms-settings:windowsdefender","Windows Security"],
              ["start ms-settings:windowsupdate","Windows Update"],
              ["start ms-settings:accounts","Accounts & sign-in options"],
              ["control","Control Panel home"],
              ["gpedit.msc","Group Policy Editor (Pro/Enterprise only)"],
              ["secpol.msc","Local Security Policy"],
              ["lusrmgr.msc","Local Users and Groups"],
            ].map((r,i)=>(
              <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.01)"}}>
                {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:12}}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="Settings ilovasi va Control Panel" en="" />
      <P>Windows ikkita parallel sozlamalar interfeysini taklif etadi: zamonaviy <Term>Settings ilovasi</Term> (WinRT/UWP, Windows 11 da to'liq qayta ishlab chiqilgan) va eski <Term>Control Panel</Term> (Win32, Windows 1.0 dan beri mavjud). Microsoft asta-sekin Control Panel funksionalligini Settings ga ko'chirmoqda, lekin ko'plab korporativ va xavfsizlik-kritik vositalar Control Panel da qolmoqda.</P>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,margin:"18px 0"}}>
        <div style={{padding:16,background:"rgba(0,255,156,0.06)",border:"1px solid rgba(0,255,156,0.25)",borderRadius:10}}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--accent)",marginBottom:8}}>SETTINGS ILOVASI (Zamonaviy)</div>
          <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.7}}>ms-settings: URI sxemasi<br/>WinRT/UWP + XAML interfeys<br/>Foydalanuvchi va tizim doirasi<br/>Sensorli ekranga optimallashgan<br/>Microsoft hisobi bilan sinxron<br/><span style={{color:"var(--accent)"}}>→ Win10/11 standart</span></div>
        </div>
        <div style={{padding:16,background:"rgba(100,100,255,0.06)",border:"1px solid rgba(100,100,255,0.25)",borderRadius:10}}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--c-auth)",marginBottom:8}}>CONTROL PANEL (Eski)</div>
          <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.7}}>control.exe + .cpl plaginlari<br/>Win32/MFC interfeys<br/>Admin uchun mo'ljallangan<br/>Hisob sinxronizatsiyasi yo'q<br/><span style={{color:"var(--c-auth)"}}>→ Korporativ standart</span></div>
        </div>
      </div>
      <H2 num="§2" uz="Settings Ilovasi — URI Havolalari" en="" />
      <P>Settings ilovasi (<code>SystemSettings.exe</code>) har qanday sahifaga chuqur havola uchun <Term>ms-settings:</Term> URI sxemasidan foydalanadi. Sozlamalar <code>HKCU</code> (foydalanuvchi uchun) yoki <code>HKLM</code> (mashina uchun) da saqlanadi.</P>
      <H2 num="§3" uz="Control Panel — Asosiy Appletlar" en="" />
      <div style={{overflowX:"auto",marginTop:10}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Ishga tushirish buyrug'i","Applet","Boshqaradigan narsa"].map((h,i)=><th key={i} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-3)",fontWeight:600,fontFamily:"var(--font-mono)",fontSize:10}}>{h}</th>)}</tr></thead>
          <tbody>
            {[
              ["control userpasswords2","Foydalanuvchi hisoblar","Mahalliy hisoblar, avtomatik kirish"],
              ["netplwiz","Tarmoq parollari","Bir xil, aniqroq interfeys"],
              ["appwiz.cpl","Dasturlar va Xususiyatlar","O'rnatilgan dasturlarni o'chirish/o'zgartirish"],
              ["sysdm.cpl","Tizim Xususiyatlari","Kompyuter nomi, DEP, crash dump, RDP"],
              ["firewall.cpl","Windows Xavfsizlik devori","Xavfsizlik devorini yoqish/o'chirish"],
              ["ncpa.cpl","Tarmoq ulanishlari","Barcha tarmoq adapterlari, qo'lda IP"],
              ["desk.cpl","Displey Sozlamalari","Ruxsat, masshtab, bir nechta monitor"],
              ["powercfg.cpl","Quvvat Parametrlari","Uyqu, qish uyqusi, batareya rejimlari"],
              ["timedate.cpl","Sana va Vaqt","Soat, vaqt zonalari, NTP serveri"],
              ["intl.cpl","Mintaqa","Til, raqam/sana formati, klaviatura"],
              ["mmsys.cpl","Ovoz","Audio qurilmalar, ovoz miksheri, yozish"],
            ].map((r,i)=>(
              <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.01)"}}>
                {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:12}}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <H2 num="§4" uz="Xavfsizlikka Oid Sozlamalar" en="" />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,margin:"14px 0"}}>
        {[
          {t:"Windows Xavfsizligi",c:"var(--accent)",items:["Virus va tahdid himoyasi (Defender)","Xavfsizlik devori va tarmoq himoyasi","Ilova va brauzer nazorati (SmartScreen)","Qurilma xavfsizligi (TPM, Secure Boot)","Core isolation / Xotira yaxlitligi (HVCI)"]},
          {t:"Kirish Parametrlari",c:"var(--c-auth)",items:["Windows Hello (PIN / barmoq izi / yuz)","Xavfsizlik kaliti (FIDO2)","Dinamik qulf","Uyg'onishda Windows Hello talab qilish","Parolsiz kirish rejimi"]},
          {t:"Maxfiylik va Diagnostika",c:"var(--c-warn)",items:["Diagnostika ma'lumotlari darajasi","Faoliyat tarixi (Timeline)","Ilova ruxsatlari (Kamera/Mikrofon/Joylashuv)","Reklama ID","Qurilmamni top"]},
          {t:"Guruh siyosati (gpedit.msc)",c:"var(--c-attack)",items:["Ko'plab Settings variantlarini bekor qiladi","AppLocker / SRP qoidalari","PowerShell bajarish siyosati","Windows Update kechiktirish","Dastur o'rnatish cheklovlari"]},
        ].map((card,i)=>(
          <div key={i} style={{padding:14,background:`${card.c}08`,border:`1px solid ${card.c}30`,borderRadius:10}}>
            <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:card.c,marginBottom:8}}>{card.t}</div>
            <ul style={{margin:0,paddingLeft:16,fontSize:12,color:"var(--text-1)",lineHeight:1.7}}>{card.items.map((item,j)=><li key={j}>{item}</li>)}</ul>
          </div>
        ))}
      </div>
      <H2 num="§5" uz="Amaliy Buyruqlar" en="" />
      <div style={{overflowX:"auto",marginTop:10}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Buyruq","Nima ochadi"].map((h,i)=><th key={i} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-3)",fontWeight:600,fontFamily:"var(--font-mono)",fontSize:10}}>{h}</th>)}</tr></thead>
          <tbody>
            {[
              ["start ms-settings:","Settings ilovasi bosh sahifasi"],
              ["start ms-settings:privacy-diagnostics","Diagnostika ma'lumotlari sozlamalari"],
              ["start ms-settings:windowsdefender","Windows Xavfsizligi"],
              ["start ms-settings:windowsupdate","Windows Update"],
              ["start ms-settings:accounts","Hisoblar va kirish parametrlari"],
              ["control","Control Panel bosh sahifasi"],
              ["gpedit.msc","Guruh siyosati muharriri (faqat Pro/Enterprise)"],
              ["secpol.msc","Mahalliy xavfsizlik siyosati"],
              ["lusrmgr.msc","Mahalliy foydalanuvchilar va guruhlar"],
            ].map((r,i)=>(
              <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.01)"}}>
                {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:12}}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// L24 – System Configuration (msconfig)
// ─────────────────────────────────────────────────────────────
function SectionMsconfig() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="System Configuration — msconfig.exe" uz="" />
      <P><Term>msconfig.exe</Term> sets flags and preferences that take effect on next boot. It does not configure a running system. Use it for startup troubleshooting, diagnosing driver conflicts, and enabling Safe Boot.</P>
      <H2 num="§2" en="General Tab — Startup Types" uz="" />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,margin:"14px 0"}}>
        {[
          {t:"Normal Startup",c:"var(--accent)",d:"Loads all drivers and services. All registry Run keys processed. Default mode."},
          {t:"Diagnostic Startup",c:"var(--c-warn)",d:"Loads only basic devices and services. Similar to Safe Mode but via normal boot path. Good for isolating conflicts."},
          {t:"Selective Startup",c:"var(--c-auth)",d:"Choose what to load: system services, startup items, original boot config. Most flexible — combine with Services tab."},
        ].map((card,i)=>(
          <div key={i} style={{padding:14,background:`${card.c}08`,border:`1px solid ${card.c}30`,borderRadius:10}}>
            <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:card.c,marginBottom:8}}>{card.t}</div>
            <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.6}}>{card.d}</div>
          </div>
        ))}
      </div>
      <H2 num="§3" en="Boot Tab — Safe Boot Modes" uz="" />
      <div style={{overflowX:"auto",marginTop:10}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Safe Boot Mode","What Loads","Use Case"].map((h,i)=><th key={i} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-3)",fontWeight:600,fontFamily:"var(--font-mono)",fontSize:10}}>{h}</th>)}</tr></thead>
          <tbody>
            {[
              ["Minimal","Critical drivers + Explorer shell","Remove malware, fix boot issues"],
              ["Alternate Shell","Critical drivers + CMD (no Explorer)","When Explorer itself is corrupted"],
              ["Network","Minimal + TCP/IP stack","Remote malware removal, online tools"],
              ["Active Directory Repair","AD repair mode — DC only","Fix Active Directory database"],
            ].map((r,i)=>(
              <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontSize:12}}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <H2 num="§4" en="Services Tab" uz="" />
      <P>Shows all registered Windows services. "Hide all Microsoft services" focuses view on third-party software. Changes write directly to <code>HKLM\SYSTEM\CurrentControlSet\Services\[Name]\Start</code> — value 4 = disabled.</P>
      <Callout color="var(--c-attack)" icon="warning" titleEn="Attack Relevance" titleUz="">
        Attackers disable security services here or via <code>sc config</code> to blind defenses. Investigate any security service (Defender, Sysmon, EventLog) found unexpectedly disabled. Event ID 7036 = service state change.
      </Callout>
      <H2 num="§5" en="Tools Tab — Utility Shortcuts" uz="" />
      <P>The <Term>Tools tab</Term> provides one-click access to 20+ built-in system utilities. Select a tool and click <Em>Launch</Em>. All can also be run directly from Win+R.</P>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,margin:"12px 0"}}>
        {[
          {t:"Computer Management",cmd:"compmgmt.msc",c:"var(--accent)"},
          {t:"Event Viewer",cmd:"eventvwr.msc",c:"var(--c-warn)"},
          {t:"System Information",cmd:"msinfo32",c:"var(--c-auth)"},
          {t:"Performance Monitor",cmd:"perfmon",c:"var(--accent)"},
          {t:"Resource Monitor",cmd:"resmon",c:"var(--accent)"},
          {t:"Task Manager",cmd:"taskmgr",c:"var(--c-system)"},
          {t:"Command Prompt (Admin)",cmd:"cmd (as admin)",c:"var(--c-warn)"},
          {t:"Registry Editor",cmd:"regedit",c:"var(--c-attack)"},
          {t:"Internet Options",cmd:"inetcpl.cpl",c:"var(--text-2)"},
          {t:"System Properties",cmd:"sysdm.cpl",c:"var(--c-auth)"},
          {t:"Problem Reports",cmd:"WerFault",c:"var(--text-2)"},
          {t:"UAC Settings",cmd:"useraccountcontrolsettings",c:"var(--c-system)"},
        ].map((item,i)=>(
          <div key={i} style={{padding:"8px 12px",background:`${item.c}06`,border:`1px solid ${item.c}20`,borderRadius:8,display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
            <span style={{fontSize:12,color:"var(--text-1)"}}>{item.t}</span>
            <code style={{fontSize:10,color:item.c}}>{item.cmd}</code>
          </div>
        ))}
      </div>
      <H2 num="§6" en="Practical Commands" uz="" />
      <div style={{overflowX:"auto",marginTop:10}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Command","Action"].map((h,i)=><th key={i} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-3)",fontWeight:600,fontFamily:"var(--font-mono)",fontSize:10}}>{h}</th>)}</tr></thead>
          <tbody>
            {[
              ["msconfig","Open System Configuration"],
              ["bcdedit","View/edit boot configuration (run as admin)"],
              ["bcdedit /set {default} safeboot minimal","Boot into Safe Mode (minimal) on next restart"],
              ["bcdedit /deletevalue {default} safeboot","Remove Safe Boot flag — return to normal boot"],
              ["sc query","List all service states (running/stopped)"],
              ["sc config ServiceName start= disabled","Disable a service (note: space after =)"],
              ["net start ServiceName","Start a service"],
              ["net stop ServiceName","Stop a service"],
            ].map((r,i)=>(
              <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.01)"}}>
                {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:12}}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="Tizim Konfiguratsiyasi — msconfig.exe" en="" />
      <P><Term>msconfig.exe</Term> keyingi yuklashda kuchga kiradigan bayroqlar va afzalliklarni o'rnatadi. Ishlaydigan tizimni konfiguratsiya qilmaydi. Ishga tushish muammolarini bartaraf etish, drayver nizolarini tashxis qilish va Xavfsiz Yuklashni yoqish uchun ishlatiladi.</P>
      <H2 num="§2" uz="Umumiy Tab — Ishga Tushish Turlari" en="" />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,margin:"14px 0"}}>
        {[
          {t:"Normal ishga tushish",c:"var(--accent)",d:"Barcha drayverlar va xizmatlar yuklanadi. Barcha Run kalitlari qayta ishlanadi. Standart rejim."},
          {t:"Tashxisli ishga tushish",c:"var(--c-warn)",d:"Faqat asosiy qurilmalar va xizmatlar yuklanadi. Xavfsiz rejimga o'xshash, oddiy yo'l orqali. Nizo topishga qulaj."},
          {t:"Tanlovli ishga tushish",c:"var(--c-auth)",d:"Nima yuklanishini tanlash: tizim xizmatlari, ishga tushish elementlari, asl konfiguratsiya. Xizmatlar tab bilan birga eng moslashuvchan."},
        ].map((card,i)=>(
          <div key={i} style={{padding:14,background:`${card.c}08`,border:`1px solid ${card.c}30`,borderRadius:10}}>
            <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:card.c,marginBottom:8}}>{card.t}</div>
            <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.6}}>{card.d}</div>
          </div>
        ))}
      </div>
      <H2 num="§3" uz="Yuklash Tab — Xavfsiz Yuklash Rejimlari" en="" />
      <div style={{overflowX:"auto",marginTop:10}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Xavfsiz Yuklash Rejimi","Nima Yuklanadi","Qo'llanish"].map((h,i)=><th key={i} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-3)",fontWeight:600,fontFamily:"var(--font-mono)",fontSize:10}}>{h}</th>)}</tr></thead>
          <tbody>
            {[
              ["Minimal","Kritik drayverlar + Explorer qobig'i","Zararli dasturni o'chirish, yuklash muammolari"],
              ["Muqobil qobiq","Kritik drayverlar + CMD (Explorer'siz)","Explorer o'zi buzilganda"],
              ["Tarmoq","Minimal + TCP/IP steki","Masofaviy zararli dasturni o'chirish"],
              ["Active Directory Ta'mirlash","Faqat domen kontrollerlar","Active Directory bazasini tuzatish"],
            ].map((r,i)=>(
              <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontSize:12}}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <H2 num="§4" uz="Xizmatlar Tab" en="" />
      <P>Barcha ro'yxatdan o'tgan Windows xizmatlarini ko'rsatadi. "Microsoft xizmatlarini yashirish" uchinchi tomon dasturlarini ajratadi. O'zgartirishlar to'g'ridan-to'g'ri <code>HKLM\SYSTEM\CurrentControlSet\Services\[Name]\Start</code> ga yoziladi — 4 qiymati = o'chirilgan.</P>
      <Callout color="var(--c-attack)" icon="warning" titleUz="Hujum bog'liqligi" titleEn="">
        Hujumchilar himoyani ko'r qilish uchun xavfsizlik xizmatlarini bu yerda yoki <code>sc config</code> orqali o'chiradi. Kutilmaganda o'chirilgan Defender, Sysmon, EventLog xizmatlarini tekshiring. Event ID 7036 = xizmat holati o'zgarishi.
      </Callout>
      <H2 num="§5" uz="Vositalar Tab — Yorliqlar" en="" />
      <P><Term>Vositalar tab</Term> 20+ o'rnatilgan tizim utilitalariga bir marta bosish bilan kirish imkonini beradi. Vositani tanlang va <Em>Ishga tushirish</Em> ni bosing. Barchasini Win+R dan ham to'g'ridan-to'g'ri ishga tushirish mumkin.</P>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,margin:"12px 0"}}>
        {[
          {t:"Kompyuter Boshqaruvi",cmd:"compmgmt.msc",c:"var(--accent)"},
          {t:"Hodisalar Ko'ruvchisi",cmd:"eventvwr.msc",c:"var(--c-warn)"},
          {t:"Tizim Ma'lumoti",cmd:"msinfo32",c:"var(--c-auth)"},
          {t:"Ishlash Monitori",cmd:"perfmon",c:"var(--accent)"},
          {t:"Resurs Monitori",cmd:"resmon",c:"var(--accent)"},
          {t:"Vazifa Menejeri",cmd:"taskmgr",c:"var(--c-system)"},
          {t:"Buyruqlar Satri (Admin)",cmd:"cmd (admin)",c:"var(--c-warn)"},
          {t:"Registry Muharriri",cmd:"regedit",c:"var(--c-attack)"},
          {t:"Tizim Xususiyatlari",cmd:"sysdm.cpl",c:"var(--c-auth)"},
          {t:"UAC Sozlamalari",cmd:"useraccountcontrolsettings",c:"var(--c-system)"},
        ].map((item,i)=>(
          <div key={i} style={{padding:"8px 12px",background:`${item.c}06`,border:`1px solid ${item.c}20`,borderRadius:8,display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
            <span style={{fontSize:12,color:"var(--text-1)"}}>{item.t}</span>
            <code style={{fontSize:10,color:item.c}}>{item.cmd}</code>
          </div>
        ))}
      </div>
      <H2 num="§6" uz="Amaliy Buyruqlar" en="" />
      <div style={{overflowX:"auto",marginTop:10}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Buyruq","Harakat"].map((h,i)=><th key={i} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-3)",fontWeight:600,fontFamily:"var(--font-mono)",fontSize:10}}>{h}</th>)}</tr></thead>
          <tbody>
            {[
              ["msconfig","Tizim konfiguratsiyasini ochish"],
              ["bcdedit","Yuklash konfiguratsiyasini ko'rish/tahrirlash (admin sifatida)"],
              ["bcdedit /set {default} safeboot minimal","Keyingi qayta yoqishda Xavfsiz rejimda yuklash"],
              ["bcdedit /deletevalue {default} safeboot","Xavfsiz yuklash flagini o'chirish — normal yuklashga qaytish"],
              ["sc query","Barcha xizmat holatlarini ro'yxatlash"],
              ["sc config XizmatNomi start= disabled","Xizmatni o'chirish (eslatma: = dan keyin bo'sh joy)"],
              ["net start XizmatNomi","Xizmatni ishga tushirish"],
              ["net stop XizmatNomi","Xizmatni to'xtatish"],
            ].map((r,i)=>(
              <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.01)"}}>
                {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:12}}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// L25 – Advanced System Settings
// ─────────────────────────────────────────────────────────────
function SectionAdvancedSystem() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="Advanced System Settings — sysdm.cpl" uz="" />
      <P><Term>sysdm.cpl</Term> (System Properties) is the central panel for core system configuration. Access via <code>Win+Pause</code>, right-click This PC → Properties, or <code>sysdm.cpl</code> from Run. Five tabs: Computer Name, Hardware, Advanced, System Protection, Remote.</P>
      <H2 num="§2" en="Computer Name / Domain Tab" uz="" />
      <P>Sets the machine's <Term>hostname</Term> (NetBIOS ≤15 chars) and <Term>workgroup</Term> or <Term>domain</Term> membership. Joining a domain installs a machine certificate, creates a computer object in AD, and enables Group Policy application.</P>
      <H2 num="§3" en="Advanced Tab — Performance, Profiles, Recovery" uz="" />
      <div style={{display:"grid",gridTemplateColumns:"1fr",gap:12,margin:"14px 0"}}>
        {[
          {t:"Virtual Memory (Paging File — pagefile.sys)",c:"var(--c-auth)",d:"Acts as RAM overflow stored on disk. SECURITY: pagefile.sys can contain passwords, encryption keys, and process memory — forensic tools extract credentials from it. hiberfil.sys (hibernate file) = full RAM snapshot on disk. Both are deleted/recreated at shutdown by policy."},
          {t:"DEP — Data Execution Prevention",c:"var(--c-warn)",d:"Marks memory pages as non-executable (NX/XD CPU bit) to prevent shellcode. Two modes: Essential Windows programs only, or All programs. Modern 64-bit Windows enforces DEP + ASLR + CFG + CET together. bcdedit /set {default} nx AlwaysOn forces hardware DEP."},
          {t:"User Profiles",c:"var(--accent)",d:"Shows all profiles with size, type (Local / Roaming / Mandatory), and last-use date. Roaming profiles sync to a network share in domain environments. Security: orphaned profiles of deleted accounts may still hold sensitive data in AppData (browser credentials, DPAPI-encrypted files)."},
          {t:"Startup and Recovery (BSOD settings)",c:"var(--c-attack)",d:"Controls crash dump type: None / Small (minidump 64KB) / Kernel (kernel memory) / Complete (all RAM) / Automatic. Complete dump is largest — critical for malware forensics. 'Automatically restart' — uncheck to freeze on BSOD for crash analysis. Event ID 6008 = unexpected shutdown."},
        ].map((card,i)=>(
          <div key={i} style={{padding:14,background:`${card.c}08`,border:`1px solid ${card.c}30`,borderRadius:10}}>
            <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:card.c,marginBottom:6}}>{card.t}</div>
            <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.6}}>{card.d}</div>
          </div>
        ))}
      </div>
      <H2 num="§4" en="Hardware Tab — Driver Signing (DSE)" uz="" />
      <P>64-bit Windows enforces <Term>Driver Signature Enforcement (DSE)</Term> — unsigned kernel drivers cannot load. Bypass requires either: disabling DSE at boot (F8 menu / bcdedit), or exploiting a vulnerable but signed driver (BYOVD — Bring Your Own Vulnerable Driver). Device Manager shows all drivers with signing status.</P>
      <H2 num="§5" en="System Protection Tab — VSS & Shadow Copies" uz="" />
      <P><Term>System Restore</Term> uses <Term>Volume Shadow Copy Service (VSS)</Term> to snapshot system files and registry. Restore points are stored in <code>C:\System Volume Information\</code>. Ransomware almost always deletes shadow copies immediately after encryption.</P>
      <H2 num="§6" en="Remote Tab — RDP" uz="" />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,margin:"14px 0"}}>
        <div style={{padding:14,background:"rgba(0,255,156,0.06)",border:"1px solid rgba(0,255,156,0.25)",borderRadius:10}}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--accent)",marginBottom:8}}>Remote Desktop (RDP)</div>
          <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.65}}>Default port: <b>TCP 3389</b><br/>Requires: Remote Desktop Users group<br/>NLA: credentials checked before session<br/><code>fDenyTSConnections = 0</code> → RDP on<br/><code>fDenyTSConnections = 1</code> → RDP off<br/>Reg: <code>HKLM\SYSTEM\CCS\Control\Terminal Server</code></div>
        </div>
        <div style={{padding:14,background:"rgba(255,58,94,0.06)",border:"1px solid rgba(255,58,94,0.25)",borderRadius:10}}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--c-attack)",marginBottom:8}}>Attack Vectors</div>
          <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.65}}>BlueKeep (CVE-2019-0708) pre-auth RCE<br/>DejaBlue (CVE-2019-1181/1182)<br/>Brute-force (common with exposed 3389)<br/>Pass-the-Hash with Restricted Admin mode<br/>Credential caching in RDP sessions<br/>SharpRDP — lateral movement tool</div>
        </div>
      </div>
      <H2 num="§7" en="Practical Commands" uz="" />
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="Kengaytirilgan Tizim Sozlamalari — sysdm.cpl" en="" />
      <P><Term>sysdm.cpl</Term> (Tizim Xususiyatlari) — asosiy tizim konfiguratsiyasining markaziy paneli. <code>Win+Pause</code>, "Bu kompyuter"ga o'ng tugma → Xususiyatlar, yoki Run dan <code>sysdm.cpl</code> orqali kirish. Besh tab: Kompyuter nomi, Apparat, Kengaytirilgan, Tizim himoyasi, Masofadan.</P>
      <H2 num="§2" uz="Kompyuter Nomi / Domen Tab" en="" />
      <P>Mashinaning <Term>hostname</Term> (NetBIOS ≤15 belgi) va <Term>ishchi guruh</Term> yoki <Term>domen</Term> a'zoligini o'rnatadi. Domenge qo'shilish mashina sertifikatini o'rnatadi, AD da kompyuter ob'ektini yaratadi va Guruh siyosatini qo'llash imkonini beradi.</P>
      <H2 num="§3" uz="Kengaytirilgan Tab — Ishlash, Profiller, Tiklanish" en="" />
      <div style={{display:"grid",gridTemplateColumns:"1fr",gap:12,margin:"14px 0"}}>
        {[
          {t:"Virtual Xotira (Almashtirish fayli — pagefile.sys)",c:"var(--c-auth)",d:"Diskdagi RAM qo'shimchasi. XAVFSIZLIK: pagefile.sys parollar, shifrlash kalitlari va jarayon xotirasini o'z ichiga olishi mumkin — forensics vositalar undan hisob ma'lumotlarini chiqaradi. hiberfil.sys (qish uyqusi fayli) = diskdagi to'liq RAM snapshoti."},
          {t:"DEP — Ma'lumotlarni Bajarilishdan Himoya Qilish",c:"var(--c-warn)",d:"Xotira sahifalarini bajarib bo'lmaydigan deb belgilaydi (NX/XD CPU biti) va shellcode bajarilishini oldini oladi. Ikkita rejim: faqat Windows dasturlari yoki barcha dasturlar. Zamonaviy 64-bitli Windows DEP + ASLR + CFG + CET birgalikda amalga oshiradi."},
          {t:"Foydalanuvchi Profillari",c:"var(--accent)",d:"Barcha profillar hajmi, turi (Mahalliy / Aylanuvchi / Majburiy) va oxirgi ishlatilgan sanasi bilan ko'rsatiladi. Aylanuvchi profillar domenda tarmoq ulashmasiga sinxronlanadi. Xavfsizlik: o'chirilgan hisoblarning eskirgan profillari AppData da maxfiy ma'lumotlarni saqlashi mumkin."},
          {t:"Ishga tushish va tiklanish (BSOD sozlamalari)",c:"var(--c-attack)",d:"Crash dump turi: Yo'q / Kichik (64KB minidump) / Kernel xotirasi / To'liq (barcha RAM) / Avtomatik. To'liq dump zararli dastur forensics uchun muhim. 'Avtomatik qayta ishga tushirish' — o'chirilsa BSOD da muzlatib qoladi — crash tahlili uchun foydali. Event ID 6008 = kutilmagan o'chirish."},
        ].map((card,i)=>(
          <div key={i} style={{padding:14,background:`${card.c}08`,border:`1px solid ${card.c}30`,borderRadius:10}}>
            <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:card.c,marginBottom:6}}>{card.t}</div>
            <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.6}}>{card.d}</div>
          </div>
        ))}
      </div>
      <H2 num="§4" uz="Apparat Tab — Drayver Imzolash (DSE)" en="" />
      <P>64-bitli Windows <Term>Drayver Imzo Tekshiruvi (DSE)</Term> ni amalga oshiradi — imzosiz kernel drayverlar yuklanmaydi. Chetlab o'tish: yuklashda DSE ni o'chirish (F8 / bcdedit) yoki zaif, lekin imzolangan drayverni ekspluatatsiya qilish (BYOVD). Qurilma menejeri barcha drayverlarni imzolash holati bilan ko'rsatadi.</P>
      <H2 num="§5" uz="Tizim Himoyasi Tab — VSS va Soya Nusxalar" en="" />
      <P><Term>Tizimni Tiklash</Term> tizim fayllarini va registry ni snapshot qilish uchun <Term>VSS (Volume Shadow Copy Service)</Term> dan foydalanadi. Tiklash nuqtalari <code>C:\System Volume Information\</code> da saqlanadi. Ransomware shifrlashdan so'ng deyarli har doim soya nusxalarni o'chiradi.</P>
      <H2 num="§6" uz="Masofadan Tab — RDP" en="" />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,margin:"14px 0"}}>
        <div style={{padding:14,background:"rgba(0,255,156,0.06)",border:"1px solid rgba(0,255,156,0.25)",borderRadius:10}}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--accent)",marginBottom:8}}>Masofaviy Ish Stoli (RDP)</div>
          <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.65}}>Standart port: <b>TCP 3389</b><br/>Talab: Masofaviy Ish Stoli Foydalanuvchilari guruhi<br/>NLA: sessiyadan oldin hisob ma'lumotlari tekshiriladi<br/><code>fDenyTSConnections = 0</code> → RDP yoqilgan<br/><code>fDenyTSConnections = 1</code> → RDP o'chirilgan</div>
        </div>
        <div style={{padding:14,background:"rgba(255,58,94,0.06)",border:"1px solid rgba(255,58,94,0.25)",borderRadius:10}}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--c-attack)",marginBottom:8}}>Hujum Vektorlari</div>
          <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.65}}>BlueKeep (CVE-2019-0708) pre-auth RCE<br/>DejaBlue (CVE-2019-1181/1182)<br/>Brute-force (ochiq 3389 port bilan keng tarqalgan)<br/>Cheklangan Admin rejimi bilan PtH<br/>RDP sessiyalarida hisob ma'lumotlari kesh<br/>SharpRDP — lateral harakatlar vositasi</div>
        </div>
      </div>
      <H2 num="§7" uz="Amaliy Buyruqlar" en="" />
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// L26 – Computer Management
// ─────────────────────────────────────────────────────────────
function SectionComputerMgmt() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="Computer Management — compmgmt.msc" uz="" />
      <P><Term>Computer Management</Term> (compmgmt.msc) is an MMC snap-in that aggregates the most essential Windows administrative tools. Access via right-click Start → Computer Management, or <code>compmgmt.msc</code> from Run. Supports connecting to remote machines via Action → Connect to another computer.</P>
      <H2 num="§2" en="Shared Folders — Hidden Admin Shares" uz="" />
      <P>The <Term>Shared Folders</Term> node is critical for security auditing. It exposes every network share — including <Term>administrative shares</Term> hidden from browse lists but always present on domain machines.</P>
      <div style={{overflowX:"auto",marginTop:10}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Share","Path","Security Risk"].map((h,i)=><th key={i} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-3)",fontWeight:600,fontFamily:"var(--font-mono)",fontSize:10}}>{h}</th>)}</tr></thead>
          <tbody>
            {[
              ["C$, D$","Root of each drive","Admin-only; used by PsExec, Impacket, SMB lateral movement"],
              ["ADMIN$","%SystemRoot% (C:\\Windows)","Admin-only; used for remote binary deployment"],
              ["IPC$","Named pipes","NULL session enumeration; pipe-based lateral movement"],
              ["SYSVOL","C:\\Windows\\SYSVOL","DC only; GPO scripts; historically leaked GPP passwords (MS14-025)"],
              ["NETLOGON","SYSVOL\\domain\\scripts","Logon scripts; writable by Domain Admins; NTLM relay target"],
              ["Custom shares","User-defined","Misconfigured ACLs (Everyone: Full Control) = lateral movement path"],
            ].map((r,i)=>(
              <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.01)"}}>
                {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:12}}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <H2 num="§3" en="Local Users and Groups" uz="" />
      <P>The <Term>Local Users and Groups</Term> node (lusrmgr.msc) manages accounts and groups on a standalone machine. On domain-joined PCs, domain accounts are managed through Active Directory — but local groups still control what domain users can do locally.</P>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,margin:"14px 0"}}>
        <div style={{padding:14,background:"rgba(0,255,156,0.06)",border:"1px solid rgba(0,255,156,0.25)",borderRadius:10}}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--accent)",marginBottom:8}}>Built-in Users</div>
          <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.7}}><b>Administrator</b> — disabled by default<br/><b>Guest</b> — disabled by default<br/><b>DefaultAccount</b> — UWP app support<br/><b>WDAGUtilityAccount</b> — Windows Defender Application Guard<br/>User-created accounts appear here too</div>
        </div>
        <div style={{padding:14,background:"rgba(100,100,255,0.06)",border:"1px solid rgba(100,100,255,0.25)",borderRadius:10}}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--c-auth)",marginBottom:8}}>Key Built-in Groups</div>
          <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.7}}><b>Administrators</b> — full system control<br/><b>Users</b> — standard users (default)<br/><b>Remote Desktop Users</b> — can RDP in<br/><b>Backup Operators</b> — bypass file ACLs for backup<br/><b>Power Users</b> — legacy, limited extra rights</div>
        </div>
      </div>
      <Callout color="var(--c-attack)" icon="warning" titleEn="Security Tip" titleUz="">
        Attackers often add their account to the Administrators or Remote Desktop Users group for persistence. Monitor Event ID 4732 (member added to a local group). Check who is in Administrators with: <code>net localgroup Administrators</code>
      </Callout>
      <H2 num="§4" en="Performance Monitor — Security Use" uz="" />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,margin:"14px 0"}}>
        <div style={{padding:14,background:"rgba(0,255,156,0.06)",border:"1px solid rgba(0,255,156,0.25)",borderRadius:10}}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--accent)",marginBottom:8}}>Key Performance Counters</div>
          <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.7}}><code>\Processor(_Total)\% Processor Time</code><br/><code>\Memory\Available MBytes</code><br/><code>\Memory\Pages/sec</code> (paging pressure)<br/><code>\Process(*)\Working Set</code> (per-process RAM)<br/><code>\Process(*)\% Processor Time</code><br/><code>\Network Interface(*)\Bytes Total/sec</code></div>
        </div>
        <div style={{padding:14,background:"rgba(100,100,255,0.06)",border:"1px solid rgba(100,100,255,0.25)",borderRadius:10}}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--c-auth)",marginBottom:8}}>Security Detection Uses</div>
          <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.7}}>Sustained 100% CPU → cryptominer<br/>Unusual outbound bytes → data exfil<br/>Sudden RSS spike → memory injection<br/>High Pages/sec → malware swapping<br/>Baseline deviations trigger alerts<br/>Data Collector Sets → scheduled capture</div>
        </div>
      </div>
      <H2 num="§5" en="WMI Control — Persistence Detection" uz="" />
      <P><Term>WMI Control</Term> (wmimgmt.msc) manages WMI namespace permissions. Attackers abuse WMI for fileless <Term>persistence</Term> via event subscriptions: <code>__EventFilter</code> + <code>__EventConsumer</code> + <code>__FilterToConsumerBinding</code>. These survive reboots and are stored in the WMI repository (<code>C:\Windows\System32\wbem\Repository</code>).</P>
      <Callout color="var(--c-attack)" icon="warning" titleEn="WMI Persistence Detection" titleUz="">
        Any WMI subscription you didn't create is suspicious. Autoruns.exe (Sysinternals WMI tab) reveals them. Removal: <code>Get-WMIObject -Namespace root\subscription -Class __EventFilter | Remove-WmiObject</code>. Monitor with Sysmon Event ID 19, 20, 21.
      </Callout>
      <H2 num="§6" en="Disk Management — Key Concepts" uz="" />
      <P><Term>Disk Management</Term> (diskmgmt.msc) is the GUI tool for managing physical disks, partitions, and volumes. Access via Computer Management or <code>diskmgmt.msc</code> from Run.</P>
      <div style={{overflowX:"auto",marginTop:10}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Concept","Meaning","Security Relevance"].map((h,i)=><th key={i} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-3)",fontWeight:600,fontFamily:"var(--font-mono)",fontSize:10}}>{h}</th>)}</tr></thead>
          <tbody>
            {[
              ["MBR vs GPT","Partition table format — GPT is modern, required for UEFI boot","GPT supports Secure Boot; MBR systems are vulnerable to bootkit attacks in the MBR sector"],
              ["Primary partition","Main data partition (up to 4 on MBR, unlimited on GPT)","OS lives here; encrypting with BitLocker locks the whole partition"],
              ["System Reserved","Small hidden partition (500MB) holding BCD and boot files","Attackers target this for bootkit persistence — protect with Secure Boot"],
              ["EFI System Partition","GPT boot partition (~100MB, FAT32)","Contains boot loader — monitored by Secure Boot signature verification"],
              ["Recovery partition","WinRE (Windows Recovery Environment)","If deleted, cannot use F8 recovery — ransomware sometimes deletes it"],
              ["Volume letter","Drive letter mapping (C:, D:, etc.)","Network shares using admin shares (C$) can be remapped for lateral movement"],
            ].map((r,i)=>(
              <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.01)"}}>
                {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:12}}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <H2 num="§7" en="Practical Commands" uz="" />
      <div style={{overflowX:"auto",marginTop:10}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Command","Action"].map((h,i)=><th key={i} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-3)",fontWeight:600,fontFamily:"var(--font-mono)",fontSize:10}}>{h}</th>)}</tr></thead>
          <tbody>
            {[
              ["compmgmt.msc","Open Computer Management"],
              ["lusrmgr.msc","Open Local Users and Groups directly"],
              ["diskmgmt.msc","Open Disk Management directly"],
              ["net user","List all local user accounts"],
              ["net user username /add","Create a new local user"],
              ["net localgroup Administrators","List members of Administrators group"],
              ["net localgroup Administrators username /add","Add user to Administrators"],
              ["net share","List all shared folders including admin shares"],
              ["Get-WmiObject Win32_LogicalDisk","PowerShell: list all drives with sizes"],
            ].map((r,i)=>(
              <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.01)"}}>
                {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:12}}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="Kompyuter Boshqaruvi — compmgmt.msc" en="" />
      <P><Term>Kompyuter Boshqaruvi</Term> (compmgmt.msc) — eng muhim Windows boshqaruv vositalarini jamlagan MMC snap-in. Boshlash → o'ng tugma → Kompyuter Boshqaruvi, yoki Run dan <code>compmgmt.msc</code> orqali kirish. Masofaviy mashinalarga Action → Connect to another computer orqali ulanishni qo'llab-quvvatlaydi.</P>
      <H2 num="§2" uz="Ulashilgan Papkalar — Yashirin Admin Ulashimlari" en="" />
      <P><Term>Ulashilgan Papkalar</Term> tuguni xavfsizlik auditi uchun kritik. U ko'rib chiqish ro'yxatlaridan yashirilgan, lekin domen mashinalarida har doim mavjud bo'lgan <Term>administrator ulashimlari</Term> bilan barcha tarmoq ulashimlarini ko'rsatadi.</P>
      <div style={{overflowX:"auto",marginTop:10}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Ulashim","Yo'l","Xavfsizlik xavfi"].map((h,i)=><th key={i} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-3)",fontWeight:600,fontFamily:"var(--font-mono)",fontSize:10}}>{h}</th>)}</tr></thead>
          <tbody>
            {[
              ["C$, D$","Har bir disk ildizi","Faqat admin; PsExec, Impacket, SMB lateral harakatlar"],
              ["ADMIN$","%SystemRoot% (C:\\Windows)","Masofaviy ikkilik fayl joylashtirish uchun"],
              ["IPC$","Nomlangan quvurlar","NULL sessiya ro'yxat; quvur asosidagi lateral harakat"],
              ["SYSVOL","C:\\Windows\\SYSVOL","Faqat DC; GPO skriptlari; GPP parollar (MS14-025)"],
              ["NETLOGON","SYSVOL\\domain\\scripts","Kirish skriptlari; NTLM relay nishoni"],
              ["Maxsus ulashimlar","Foydalanuvchi belgilagan","Noto'g'ri ACL (Everyone: Full Control) = lateral harakat"],
            ].map((r,i)=>(
              <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.01)"}}>
                {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:12}}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <H2 num="§3" uz="Mahalliy Foydalanuvchilar va Guruhlar" en="" />
      <P><Term>Mahalliy Foydalanuvchilar va Guruhlar</Term> (lusrmgr.msc) mustaqil mashinadagi hisoblar va guruhlarni boshqaradi. Domenga qo'shilgan kompyuterlarda domen hisoblari Active Directory orqali boshqariladi, lekin mahalliy guruhlar domen foydalanuvchilari mahalliy imkoniyatlarini nazorat qiladi.</P>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,margin:"14px 0"}}>
        <div style={{padding:14,background:"rgba(0,255,156,0.06)",border:"1px solid rgba(0,255,156,0.25)",borderRadius:10}}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--accent)",marginBottom:8}}>O'rnatilgan Foydalanuvchilar</div>
          <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.7}}><b>Administrator</b> — standart holda o'chirilgan<br/><b>Guest</b> — standart holda o'chirilgan<br/><b>DefaultAccount</b> — UWP ilova qo'llab-quvvatlash<br/><b>WDAGUtilityAccount</b> — Defender Application Guard<br/>Foydalanuvchi yaratgan hisoblar ham shu yerda</div>
        </div>
        <div style={{padding:14,background:"rgba(100,100,255,0.06)",border:"1px solid rgba(100,100,255,0.25)",borderRadius:10}}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--c-auth)",marginBottom:8}}>Asosiy O'rnatilgan Guruhlar</div>
          <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.7}}><b>Administratorlar</b> — to'liq tizim nazorati<br/><b>Foydalanuvchilar</b> — standart foydalanuvchilar<br/><b>Masofaviy ish stoli foydalanuvchilari</b> — RDP kirishi<br/><b>Zaxira operatorlari</b> — zaxira uchun fayl ACL larini chetlab o'tish<br/><b>Power Users</b> — meros, cheklangan qo'shimcha huquqlar</div>
        </div>
      </div>
      <Callout color="var(--c-attack)" icon="warning" titleUz="Xavfsizlik Maslahati" titleEn="">
        Hujumchilar ko'pincha persistenslik uchun hisobini Administratorlar yoki Masofaviy ish stoli foydalanuvchilari guruhiga qo'shadi. Event ID 4732 ni kuzating (mahalliy guruhga a'zo qo'shildi). Administratorlar guruhini tekshirish: <code>net localgroup Administrators</code>
      </Callout>
      <H2 num="§4" uz="Ishlash Monitori — Xavfsizlik Qo'llanilishi" en="" />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,margin:"14px 0"}}>
        <div style={{padding:14,background:"rgba(0,255,156,0.06)",border:"1px solid rgba(0,255,156,0.25)",borderRadius:10}}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--accent)",marginBottom:8}}>Asosiy Ishlash Hisoblagichlari</div>
          <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.7}}><code>\Processor(_Total)\% Processor Time</code><br/><code>\Memory\Available MBytes</code><br/><code>\Memory\Pages/sec</code> (almashtirish bosimi)<br/><code>\Process(*)\Working Set</code> (jarayon RAM)<br/><code>\Network Interface(*)\Bytes Total/sec</code></div>
        </div>
        <div style={{padding:14,background:"rgba(100,100,255,0.06)",border:"1px solid rgba(100,100,255,0.25)",borderRadius:10}}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--c-auth)",marginBottom:8}}>Xavfsizlik Aniqlash Qo'llanilishi</div>
          <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.7}}>Doimiy 100% CPU → kriptomayner<br/>G'ayrioddiy chiquvchi baytlar → ma'lumot chiqarish<br/>RSS keskin o'sishi → xotira in'ektsiyasi<br/>Yuqori Pages/sec → zararli dastur almashishi<br/>Asosiy holat og'ishlari ogohlantirishlarni ishga tushiradi</div>
        </div>
      </div>
      <H2 num="§5" uz="WMI Nazorati — Persistenslikni Aniqlash" en="" />
      <P><Term>WMI Nazorati</Term> (wmimgmt.msc) WMI nom maydoni ruxsatlarini boshqaradi. Hujumchilar faylsiz <Term>persistenslik</Term> uchun WMI dan foydalanadi: <code>__EventFilter</code> + <code>__EventConsumer</code> + <code>__FilterToConsumerBinding</code>. Ular qayta yoqishdan omon qoladi va WMI repositoryda saqlanadi (<code>C:\Windows\System32\wbem\Repository</code>).</P>
      <Callout color="var(--c-attack)" icon="warning" titleUz="WMI Persistenslikni Aniqlash" titleEn="">
        Siz yaratmagan har qanday WMI obunasi shubhali. Autoruns.exe (Sysinternals WMI tab) ularni ko'rsatadi. O'chirish: <code>Get-WMIObject -Namespace root\subscription -Class __EventFilter | Remove-WmiObject</code>. Sysmon Event ID 19, 20, 21 bilan kuzating.
      </Callout>
      <H2 num="§6" uz="Disk Boshqaruvi — Asosiy Tushunchalar" en="" />
      <P><Term>Disk Boshqaruvi</Term> (diskmgmt.msc) — jismoniy disklar, bo'limlar va hajmlarni boshqarish uchun GUI vosita. Kompyuter Boshqaruvi orqali yoki Run dan <code>diskmgmt.msc</code> orqali kirish.</P>
      <div style={{overflowX:"auto",marginTop:10}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Tushuncha","Ma'nosi","Xavfsizlik bog'liqligi"].map((h,i)=><th key={i} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-3)",fontWeight:600,fontFamily:"var(--font-mono)",fontSize:10}}>{h}</th>)}</tr></thead>
          <tbody>
            {[
              ["MBR vs GPT","Bo'lim jadvali formati — GPT zamonaviy, UEFI uchun kerak","GPT Secure Boot ni qo'llab-quvvatlaydi; MBR tizimlar MBR sektorida bootkit hujumlariga zaif"],
              ["Asosiy bo'lim","Asosiy ma'lumot bo'limi (MBR da 4 tagacha, GPT da cheksiz)","OS shu yerda; BitLocker bilan shifrlash butun bo'limni qulflaydi"],
              ["Tizim zahirasi","BCD va yuklash fayllarini o'z ichiga olgan kichik yashirin bo'lim","Bootkit persistenslik uchun maqsad — Secure Boot bilan himoya qiling"],
              ["EFI tizim bo'limi","GPT yuklash bo'limi (~100MB, FAT32)","Yuklash yuklovchisini o'z ichiga oladi — Secure Boot tomonidan kuzatiladi"],
              ["Tiklash bo'limi","WinRE (Windows Recovery Environment)","O'chirilsa F8 tiklash ishlamaydi — ransomware ba'zan o'chiradi"],
              ["Hajm harfi","Disk harfi xaritasi (C:, D:, va h.)","Admin ulashimlar (C$) lateral harakatlar uchun qayta xaritalanishi mumkin"],
            ].map((r,i)=>(
              <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.01)"}}>
                {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:12}}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <H2 num="§7" uz="Amaliy Buyruqlar" en="" />
      <div style={{overflowX:"auto",marginTop:10}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Buyruq","Harakat"].map((h,i)=><th key={i} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-3)",fontWeight:600,fontFamily:"var(--font-mono)",fontSize:10}}>{h}</th>)}</tr></thead>
          <tbody>
            {[
              ["compmgmt.msc","Kompyuter Boshqaruvini ochish"],
              ["lusrmgr.msc","Mahalliy foydalanuvchilar va guruhlarni to'g'ridan-to'g'ri ochish"],
              ["diskmgmt.msc","Disk Boshqaruvini to'g'ridan-to'g'ri ochish"],
              ["net user","Barcha mahalliy foydalanuvchi hisoblarini ro'yxatlash"],
              ["net user foydalanuvchi /add","Yangi mahalliy foydalanuvchi yaratish"],
              ["net localgroup Administrators","Administratorlar guruh a'zolarini ro'yxatlash"],
              ["net localgroup Administrators foydalanuvchi /add","Foydalanuvchini Administratorlarga qo'shish"],
              ["net share","Admin ulashimlar bilan barcha ulashilgan papkalarni ro'yxatlash"],
            ].map((r,i)=>(
              <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.01)"}}>
                {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:12}}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}


// ─────────────────────────────────────────────────────────────
// L27 – Resource Monitor & Command Prompt
// ─────────────────────────────────────────────────────────────
function SectionResourceMonitor() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="Resource Monitor — resmon.exe" uz="" />
      <P>
        <Term>Resource Monitor</Term> (resmon.exe) displays per-process CPU, memory, disk, and network usage data,
        along with which processes are using individual file handles and modules.
        It includes advanced filtering to isolate data for specific processes, the ability to start/stop/pause services,
        force-close unresponsive applications, and a <Term>process analysis</Term> function that identifies deadlocked
        processes and file-locking conflicts — letting you resolve conflicts rather than losing data by killing the app.
        It is designed for advanced users troubleshooting complex system issues.
      </P>
      <Callout color="var(--accent)" icon="info" titleEn="How to open" titleUz="">
        Run → <code>resmon</code> · Task Manager → Performance tab → "Open Resource Monitor" · msconfig Tools tab → Resource Monitor → Launch · Start Menu → search "Resource Monitor"
      </Callout>

      {/* Architecture diagram */}

      <H2 num="§2" en="CPU Tab" uz="" />
      <P>The <Term>CPU tab</Term> shows every process consuming CPU cycles and breaks down activity into 4 sub-tables: Processes, Services, Associated Handles, and Associated Modules.</P>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,margin:"14px 0"}}>
        {[
          {t:"Processes",c:"var(--accent)",d:"All running processes with: Image name, PID, Description, Status (Running/Suspended), Thread count, CPU % (average + current), CPU cycle delta. Sort by CPU to find the highest consumer."},
          {t:"Services",c:"var(--c-auth)",d:"Services running inside each process (important for svchost.exe which hosts many services). Shows Service name, PID, Description, Group, Status. Clicking a process filters which services it hosts."},
          {t:"Associated Handles",c:"var(--c-warn)",d:"Open kernel object handles (files, registry keys, events, mutexes, semaphores) for the selected process. Critical for diagnosing 'file in use' errors and detecting suspicious handle usage (e.g., a process holding a handle to lsass.exe)."},
          {t:"Associated Modules",c:"var(--c-attack)",d:"DLLs and other modules loaded into the selected process. Shows module path — critical for detecting DLL hijacking (unexpected DLL loaded from %TEMP% or user-writable paths) and reflective injection (no path shown, only in-memory)."},
        ].map((card,i)=>(
          <div key={i} style={{padding:14,background:`${card.c}08`,border:`1px solid ${card.c}30`,borderRadius:10}}>
            <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:card.c,marginBottom:8}}>{card.t}</div>
            <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.6}}>{card.d}</div>
          </div>
        ))}
      </div>

      <H2 num="§3" en="Memory Tab" uz="" />
      <P>The <Term>Memory tab</Term> shows per-process RAM usage and a physical memory bar at the bottom that maps how RAM is currently divided.</P>

      <H2 num="§4" en="Disk Tab" uz="" />
      <P>The <Term>Disk tab</Term> shows real-time file I/O per process — which files are being read/written and at what speed. It is the fastest way to find what process is hammering the disk.</P>
      <div style={{overflowX:"auto",marginTop:10}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Column","Meaning","Security Use"].map((h,i)=><th key={i} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-3)",fontWeight:600,fontFamily:"var(--font-mono)",fontSize:10}}>{h}</th>)}</tr></thead>
          <tbody>
            {[
              ["Image / PID","Process performing I/O","Identify unknown process reading many files"],
              ["File","Full path of file being accessed","Detect staging / exfiltration to temp paths"],
              ["Read B/sec","Bytes read per second","Bulk file read = potential data staging"],
              ["Write B/sec","Bytes written per second","High write + encrypt filenames = ransomware"],
              ["I/O Priority","Normal / Background / Critical","Malware often uses Background to stay quiet"],
              ["Response Time (ms)","Disk latency for each operation","Spikes indicate storage contention or bad sectors"],
            ].map((r,i)=>(
              <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.01)"}}>
                {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:12}}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H2 num="§5" en="Network Tab" uz="" />
      <P>The <Term>Network tab</Term> shows active network connections per process — the most useful tab for detecting malware command-and-control traffic and unauthorized connections.</P>

      <H2 num="§6" en="Command Prompt — cmd.exe" uz="" />
      <P>
        <Term>cmd.exe</Term> (Command Prompt) was the primary interface for early Windows systems before GUI. It remains essential for administration, automation, and security tasks.
        While PowerShell has largely replaced cmd for advanced tasks, cmd.exe is universally available and lighter.
      </P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>Essential Commands</h3>
      <div style={{overflowX:"auto",marginTop:10}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Command","Output","Security Use"].map((h,i)=><th key={i} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-3)",fontWeight:600,fontFamily:"var(--font-mono)",fontSize:10}}>{h}</th>)}</tr></thead>
          <tbody>
            {[
              ["hostname","Machine name (NetBIOS)","Confirm target machine in engagement"],
              ["whoami","Current user (domain\\user or PC\\user)","Confirm privileges / identify context"],
              ["whoami /priv","Token privileges list","Spot SeDebugPrivilege, SeImpersonatePrivilege for privesc"],
              ["whoami /groups","Group memberships + integrity level","Check if in Administrators, Mandatory Level"],
              ["ipconfig","IP, subnet, gateway, DNS per adapter","Network recon — find subnets to pivot into"],
              ["ipconfig /all","Full config + MAC, DHCP, lease","DHCP server IP, DNS servers, full config"],
              ["netstat -ano","All connections with owning PID","Find C2 connections, unexpected listeners"],
              ["netstat -ab","Connections with process name","Same but shows process name (needs admin)"],
              ["net user","List all local user accounts","Enumerate users — find unexpected accounts"],
              ["net localgroup","List all local groups","Find who is in Administrators"],
              ["net share","List all network shares","Find exposed shares for lateral movement"],
              ["net session","Active SMB sessions to this machine","Who is currently connected over network"],
            ].map((r,i)=>(
              <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.01)"}}>
                {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:12}}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H2 num="§7" en="Registry Editor — Quick Reference" uz="" />
      <P>
        <Term>regedit.exe</Term> is the GUI editor for the Windows Registry — the central hierarchical database storing settings for users, applications, and hardware. Windows constantly reads the registry during operation. A full treatment is in <Em>L08 — Windows Registry</Em>; here is the quick reference for tools accessible from msconfig.
      </P>

      <H2 num="§8" en="Practical Commands" uz="" />
      <div style={{overflowX:"auto",marginTop:10}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Command","Action"].map((h,i)=><th key={i} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-3)",fontWeight:600,fontFamily:"var(--font-mono)",fontSize:10}}>{h}</th>)}</tr></thead>
          <tbody>
            {[
              ["resmon","Open Resource Monitor"],
              ["tasklist","List all running processes with PIDs (cmd)"],
              ["tasklist /svc","List processes with hosted services"],
              ["taskkill /PID 1234 /F","Force-kill process by PID"],
              ["Get-Process | Sort-Object CPU -Desc | Select -First 10","Top 10 CPU consumers (PowerShell)"],
              ["Get-Process | Sort-Object WorkingSet -Desc | Select -First 10","Top 10 RAM consumers (PowerShell)"],
              ["netstat -ano","All connections with owning PIDs"],
              ["netstat -b","Connections with process name (admin required)"],
              ["handle64.exe -p lsass","Sysinternals: show who has handles to lsass"],
            ].map((r,i)=>(
              <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.01)"}}>
                {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:12}}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="Resource Monitor — resmon.exe" en="" />
      <P>
        <Term>Resource Monitor</Term> (resmon.exe) har bir jarayon kesimida CPU, xotira, disk va tarmoqdan foydalanish ma'lumotlarini, shuningdek qaysi jarayonlar alohida fayl deskriptorlari (handle) va modullardan foydalanayotganini ko'rsatadi.
        Kengaytirilgan filtrlash yordamida ma'lum jarayonlar uchun ma'lumotlarni ajratib olish, xizmatlarni boshqarish, javob bermayotgan ilovalarni yopish va <Term>deadlock</Term> (bloklanib qolgan) jarayonlar hamda fayl bloklash nizolarini aniqlash mumkin.
        Bu utilita murakkab nosozliklarni bartaraf etishi kerak bo'lgan ilg'or foydalanuvchilarga mo'ljallangan.
      </P>
      <Callout color="var(--accent)" icon="info" titleUz="Qanday ochish" titleEn="">
        Run → <code>resmon</code> · Vazifa menejeri → Ishlash tab → "Resurs monitorini ochish" · msconfig Vositalar tab → Resource Monitor → Ishga tushirish · Boshlash menyu → "Resource Monitor" qidirish
      </Callout>

      <H2 num="§2" uz="CPU Tab" en="" />
      <P><Term>CPU tab</Term> CPU tsikllarini iste'mol qilayotgan barcha jarayonlarni ko'rsatadi va faoliyatni 4 ta kichik jadvalga ajratadi: Jarayonlar, Xizmatlar, Bog'liq Deskriptorlar va Bog'liq Modullar.</P>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,margin:"14px 0"}}>
        {[
          {t:"Jarayonlar",c:"var(--accent)",d:"Ishlayotgan barcha jarayonlar: Nom, PID, Tavsif, Holat (Ishlamoqda/To'xtatilgan), Thread soni, CPU % (o'rtacha + joriy). Eng ko'p iste'mol qiluvchini topish uchun CPU bo'yicha saralang."},
          {t:"Xizmatlar",c:"var(--c-auth)",d:"Har bir jarayon ichida ishlaydigan xizmatlar (ko'plab xizmatlarni joylashtiradigan svchost.exe uchun muhim). Xizmat nomi, PID, Tavsif, Guruh, Holat. Jarayonni bosish qaysi xizmatlarni joylashtirayotganini filtrlaydi."},
          {t:"Bog'liq Deskriptorlar",c:"var(--c-warn)",d:"Tanlangan jarayon uchun ochiq kernel ob'ekt deskriptorlari (fayllar, registry kalitlari, hodisalar, mutexlar). 'Fayl ishlatilmoqda' xatolarini tashxislash va shubhali deskriptor foydalanishini aniqlash uchun kritik (masalan, lsass.exe ga deskriptor ushlab turgan jarayon)."},
          {t:"Bog'liq Modullar",c:"var(--c-attack)",d:"Tanlangan jarayonga yuklangan DLL lar va boshqa modullar. Modul yo'lini ko'rsatadi — DLL hijacking (kutilmagan DLL %TEMP% dan yuklangan) va reflektiv in'ektsiyani aniqlash uchun kritik (yo'l ko'rsatilmagan, faqat xotirada)."},
        ].map((card,i)=>(
          <div key={i} style={{padding:14,background:`${card.c}08`,border:`1px solid ${card.c}30`,borderRadius:10}}>
            <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:card.c,marginBottom:8}}>{card.t}</div>
            <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.6}}>{card.d}</div>
          </div>
        ))}
      </div>

      <H2 num="§3" uz="Memory Tab" en="" />
      <P><Term>Memory tab</Term> jarayon boshiga RAM iste'molini va pastdagi jismoniy xotira panelini ko'rsatadi — RAM qanday taqsimlanganini xaritasini chizadi.</P>

      <H2 num="§4" uz="Disk Tab" en="" />
      <P><Term>Disk tab</Term> jarayon boshiga real vaqt fayl I/O ni ko'rsatadi — qaysi fayllar o'qilmoqda/yozilmoqda va qanday tezlikda. Diskni eng ko'p ishlatayotgan jarayonni topishning eng tez usuli.</P>
      <div style={{overflowX:"auto",marginTop:10}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Ustun","Ma'nosi","Xavfsizlik qo'llanilishi"].map((h,i)=><th key={i} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-3)",fontWeight:600,fontFamily:"var(--font-mono)",fontSize:10}}>{h}</th>)}</tr></thead>
          <tbody>
            {[
              ["Nom / PID","I/O bajarayotgan jarayon","Ko'p fayllarni o'qiyotgan noma'lum jarayonni aniqlash"],
              ["Fayl","Kiriladigan faylning to'liq yo'li","Vaqtinchalik yo'llarga sahnalashtirish/eksfiltratsiyani aniqlash"],
              ["O'qish B/s","Soniyasiga o'qilgan baytlar","Ko'p o'qish = potentsial ma'lumotlarni sahnalashtirish"],
              ["Yozish B/s","Soniyasiga yozilgan baytlar","Yuqori yozish + fayl nomlari o'zgarishi = ransomware"],
              ["I/O Ustuvorligi","Normal / Fon / Kritik","Zararli dasturlar ko'pincha Fon ustuvorligidan foydalanadi"],
              ["Javob vaqti (ms)","Har bir operatsiya uchun disk kechikishi","Keskin o'sish saqlash raqobatini yoki yomon sektorlarni ko'rsatadi"],
            ].map((r,i)=>(
              <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.01)"}}>
                {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:12}}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H2 num="§5" uz="Network Tab" en="" />
      <P><Term>Network tab</Term> jarayon boshiga faol tarmoq ulanishlarini ko'rsatadi — zararli dastur C2 trafigini va ruxsatsiz ulanishlarni aniqlash uchun eng foydali tab.</P>

      <H2 num="§6" uz="Buyruqlar Satri — cmd.exe" en="" />
      <P>
        <Term>cmd.exe</Term> (Buyruqlar Satri) GUI joriy etilishidan oldin dastlabki Windows tizimlarining asosiy interfeysi bo'lgan.
        PowerShell ilg'or vazifalar uchun cmd ni asosan almashtirgan bo'lsa-da, cmd.exe hamma joyda mavjud va engil.
      </P>

      <h3 className="mono" style={{color:"var(--accent)",marginTop:28}}>Asosiy Buyruqlar</h3>
      <div style={{overflowX:"auto",marginTop:10}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Buyruq","Natija","Xavfsizlik qo'llanilishi"].map((h,i)=><th key={i} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-3)",fontWeight:600,fontFamily:"var(--font-mono)",fontSize:10}}>{h}</th>)}</tr></thead>
          <tbody>
            {[
              ["hostname","Mashina nomi (NetBIOS)","Nishon mashinasini tasdiqlash"],
              ["whoami","Joriy foydalanuvchi (domen\\foydalanuvchi)","Imtiyozlarni tasdiqlash / kontekstni aniqlash"],
              ["whoami /priv","Token imtiyozlari ro'yxati","SeDebugPrivilege, SeImpersonatePrivilege ni tekshirish"],
              ["whoami /groups","Guruh a'zoliklari + yaxlitlik darajasi","Administratorlar da borligini, Mandatory Level ni tekshirish"],
              ["ipconfig","IP, subnet, shlyuz, DNS","Tarmoq razvedkasi — pivot uchun subnetlarni topish"],
              ["ipconfig /all","To'liq konfiguratsiya + MAC, DHCP","DHCP server IP, DNS serverlari, to'liq konfiguratsiya"],
              ["netstat -ano","Egasi PID bilan barcha ulanishlar","C2 ulanishlarni, kutilmagan tinglovchilarni topish"],
              ["net user","Barcha mahalliy foydalanuvchilar ro'yxati","Kutilmagan hisoblarni topish"],
              ["net localgroup","Barcha mahalliy guruhlar ro'yxati","Administratorlar da kimlar borligini topish"],
              ["net share","Barcha tarmoq ulashimlari ro'yxati","Lateral harakat uchun ochiq ulashimlarni topish"],
              ["net session","Ushbu mashinaga faol SMB sessiyalari","Tarmoq orqali kim ulangan"],
            ].map((r,i)=>(
              <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.01)"}}>
                {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:12}}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H2 num="§7" uz="Registry Editor — Tezkor Qo'llanma" en="" />
      <P>
        <Term>regedit.exe</Term> — Windows Registry (foydalanuvchilar, ilovalar va apparat uchun sozlamalarni saqlaydigan markaziy ierarxik ma'lumotlar bazasi) ni grafik muharrir. To'liq ko'rib chiqish <Em>L08 — Windows Registry</Em> da; bu yerda msconfig orqali kirish mumkin bo'lgan vosita sifatida tezkor ma'lumotnoma.
      </P>

      <H2 num="§8" uz="Amaliy Buyruqlar" en="" />
      <div style={{overflowX:"auto",marginTop:10}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Buyruq","Harakat"].map((h,i)=><th key={i} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-3)",fontWeight:600,fontFamily:"var(--font-mono)",fontSize:10}}>{h}</th>)}</tr></thead>
          <tbody>
            {[
              ["resmon","Resurs Monitorini ochish"],
              ["tasklist","Barcha jarayonlarni PID bilan ro'yxatlash (cmd)"],
              ["tasklist /svc","Jarayonlarni joylashtirilgan xizmatlar bilan ro'yxatlash"],
              ["taskkill /PID 1234 /F","Jarayonni PID bo'yicha majburiy o'ldirish"],
              ["Get-Process | Sort-Object CPU -Desc | Select -First 10","Eng ko'p CPU ishlatayotgan 10 ta jarayon (PowerShell)"],
              ["Get-Process | Sort-Object WorkingSet -Desc | Select -First 10","Eng ko'p RAM ishlatayotgan 10 ta jarayon (PowerShell)"],
              ["netstat -ano","Egasi PID bilan barcha ulanishlar"],
              ["netstat -b","Jarayon nomi bilan ulanishlar (admin talab qilinadi)"],
            ].map((r,i)=>(
              <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.01)"}}>
                {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:12}}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}


// ─────────────────────────────────────────────────────────────
function SectionGUI() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="Windows GUI Architecture" uz="" />
      <P>The Windows <Term>Graphical User Interface</Term> is built on the Win32 window model, a client/server architecture where user-mode applications send messages to windows, and the kernel (win32k.sys) routes those messages. Every visible element — dialog boxes, buttons, menus, title bars — is a <Term>window</Term> with a unique handle (HWND).</P>

      <H2 num="§2" en="Win32 Window Model — HWND and WndProc" uz="" />
      <P>Every window is identified by an <Term>HWND (Handle to Window)</Term>. When you call <code>CreateWindowEx()</code>, the OS registers the window and returns an HWND. Each window class registers a <Term>WndProc (Window Procedure)</Term> — a callback function that receives and processes messages.</P>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:12}}>
        {[
          {title:"HWND",color:"var(--c-system)",body:"A 32/64-bit handle to a window object managed by win32k.sys. HWNDs are process-relative but can be shared across processes (UI Automation, spy tools). Null HWND = broadcast to all top-level windows."},
          {title:"WndProc",color:"var(--c-warn)",body:"The message handler function: LRESULT CALLBACK WndProc(HWND hWnd, UINT msg, WPARAM wParam, LPARAM lParam). Returns 0 = handled; calls DefWindowProc() for unhandled messages. Every control (button, edit box) has its own WndProc."},
          {title:"Message Queue",color:"var(--accent)",body:"Each thread with a UI has a private message queue. PostMessage() adds to the queue (async); SendMessage() calls WndProc directly and blocks until it returns (sync). GetMessage() / DispatchMessage() = the message pump loop."},
          {title:"Message Pump",color:"var(--c-system)",body:"while(GetMessage(&msg, NULL, 0, 0)) { TranslateMessage(&msg); DispatchMessage(&msg); } — This loop is what keeps a GUI application alive. A frozen message pump = unresponsive window (spinning cursor)."},
        ].map((item,i)=>(
          <div key={i} style={{padding:"12px 14px",borderRadius:8,background:`${item.color}08`,border:`1px solid ${item.color}25`}}>
            <div style={{fontFamily:"var(--font-mono)",fontSize:12,color:item.color,fontWeight:700,marginBottom:6}}>{item.title}</div>
            <div style={{fontSize:13,color:"var(--text-1)",lineHeight:1.6}}>{item.body}</div>
          </div>
        ))}
      </div>

      <H2 num="§3" en="Desktop, Taskbar & Start Menu Anatomy" uz="" />

      <H2 num="§4" en="DWM — Desktop Window Manager" uz="" />
      <P><Term>DWM (Desktop Window Manager)</Term> is the compositor process (dwm.exe) introduced in Windows Vista. Instead of apps drawing directly to the screen, each window renders into an off-screen Direct3D surface. DWM composites all surfaces and sends the final frame to the display — enabling transparency (Aero Glass), animations, thumbnail previews, HDR, and per-monitor DPI scaling.</P>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12}}>
        {[
          {title:"Redirection Surface",color:"var(--c-system)",body:"Each window's pixels go into a DirectX texture (redirect surface). DWM composites them GPU-side. Apps never write to framebuffer directly."},
          {title:"Flip Model",color:"var(--accent)",body:"Modern apps (DXGI flip model) skip DWM composition for low-latency rendering. Used by games and video players for tear-free, low-latency display."},
          {title:"Animation Engine",color:"var(--c-warn)",body:"DWM drives minimize/restore animations, window blur, and Fluent Design effects. Disable DWM = no Aero = flat rendering (Win XP look)."},
          {title:"Security Boundary",color:"var(--c-attack)",body:"DWM runs at Session 0-like isolation (SYSTEM-level integrity). Apps cannot inject into DWM. Crashing DWM causes the display to momentarily go black before auto-restart."},
        ].map((item,i)=>(
          <div key={i} style={{padding:"10px 12px",borderRadius:8,background:`${item.color}08`,border:`1px solid ${item.color}22`}}>
            <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:item.color,fontWeight:700,marginBottom:5}}>{item.title}</div>
            <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.6}}>{item.body}</div>
          </div>
        ))}
      </div>

      <H2 num="§5" en="GUI API Evolution" uz="" />
      <P>Windows has accumulated multiple GUI API layers over decades. Choosing the right one matters for both capabilities and security posture:</P>
      <div style={{overflowX:"auto",marginTop:14}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{borderBottom:"2px solid var(--border)"}}>
            {["API Layer","Era","Rendering","Sandboxing","Use Case"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 10px",color:"var(--text-2)",fontWeight:700}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["Win32 GDI","Windows 3.1+","CPU rasterizer","None","Legacy: dialogs, menus, most system UI"],
            ["GDI+","Windows XP","CPU rasterizer","None","Anti-aliased 2D graphics, image loading"],
            ["Direct2D / DirectWrite","Vista+","GPU accelerated","None","Modern 2D: text, vectors, charts"],
            ["WPF (.NET)","Vista+","Direct3D via MIL","Partial (ClickOnce)","Enterprise LOB, data binding, XAML"],
            ["UWP / WinUI 2","Win 10","DirectX","AppContainer sandbox","Store apps, constrained API surface"],
            ["WinUI 3","Win 10 21H2+","DirectX","Optional AppContainer","Modern desktop apps (decoupled from OS)"],
            ["Electron / CEF","Any","Chromium GPU","Renderer sandbox","VS Code, Slack, Teams — web-based UI"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"6px 10px",color:j===0?"var(--accent)":j===3?"var(--c-system)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:12}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <H2 num="§6" en="Win32 Messages — Key WM_ Constants" uz="" />

      <H2 num="§7" en="GUI Security — Attack Vectors" uz="" />
      <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:12}}>
        {[
          {title:"Shatter Attacks (Classic)",color:"var(--c-attack)",body:<>Pre-Vista: processes at different privilege levels shared the same desktop. A low-privilege process could send <code>WM_SETTEXT</code> + <code>WM_PASTE</code> to a high-privilege window's edit control, then trigger execution via <code>WM_TIMER</code> with a function pointer in lParam. Vista+ User Interface Privilege Isolation (UIPI) blocks cross-integrity-level message sending — low IL cannot send messages to high IL windows.</>},
          {title:"UIPI — User Interface Privilege Isolation",color:"var(--c-system)",body:<>Enforced by win32k.sys since Vista. A lower-IL process cannot: SendMessage to a higher-IL window, use SetWindowsHookEx to hook higher-IL input, use AttachThreadInput to a higher-IL thread. Exception: <code>ChangeWindowMessageFilterEx()</code> lets a high-IL window explicitly allow specific messages from lower IL.</>},
          {title:"Clickjacking / UI Redressing",color:"var(--c-warn)",body:<>A malicious transparent window overlaid on a legitimate high-privilege window can capture clicks. The victim thinks they're clicking the UAC prompt but are actually clicking the attacker's window. Mitigations: UAC Secure Desktop (renders on a separate desktop object inaccessible to regular processes), UIPI.</>},
          {title:"UI Automation Abuse",color:"var(--c-warn)",body:<>UI Automation (UIA) is the accessibility framework that lets screen readers and test tools interact with UI elements. Malware abuses UIA to: read text from password fields (if app exposes them), click UAC prompts programmatically (if running at same IL), extract clipboard contents. Defender monitors for anomalous UIA usage patterns.</>},
          {title:"Window Enumeration (Recon)",color:"var(--text-2)",body:<><code>EnumWindows()</code> lists all top-level windows. <code>EnumChildWindows()</code> drills into child controls. <code>GetWindowText()</code> reads titles/control text. Attackers use this to detect analysis tools (Wireshark, Process Monitor, debuggers) by window title — if detected, malware exits or changes behavior.</>},
        ].map((item,i)=>(
          <div key={i} style={{padding:"14px 16px",borderRadius:10,background:`${item.color}08`,border:`1px solid ${item.color}30`}}>
            <div style={{fontFamily:"var(--font-display)",fontSize:14,fontWeight:700,color:item.color,marginBottom:8}}>{item.title}</div>
            <div style={{fontSize:13,color:"var(--text-1)",lineHeight:1.65}}>{item.body}</div>
          </div>
        ))}
      </div>
      <Callout color="var(--c-attack)" icon="warning" titleEn="Window Station Isolation" titleUz="">
        Services run in Session 0 with no interactive window station (WinSta0 is denied). A service that tries to create a GUI window will fail silently — this is by design. Pre-Vista services could pop dialogs into the user's session (Session 0 isolation bypass). Modern exploits that need GUI interaction must inject into an interactive process running in the user's session.
      </Callout>

      <H2 num="§8" en="Practical Commands" uz="" />
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="Windows GUI Arxitekturasi" en="" />
      <P>Windows <Term>Grafik Foydalanuvchi Interfeysi (GUI)</Term> Win32 oyna modeliga asoslangan — mijoz/server arxitekturasi bo'lib, foydalanuvchi-rejim ilovalari oynalarga xabarlar yuboradi va kernel (win32k.sys) bu xabarlarni yo'naltiradi. Har bir ko'rinadigan element — dialog oynalar, tugmalar, menyular, sarlavha satrlari — noyob tutqich (HWND) ga ega <Term>oyna</Term> hisoblanadi.</P>

      <H2 num="§2" uz="Win32 Oyna Modeli — HWND va WndProc" en="" />
      <P>Har bir oyna <Term>HWND (Oyna Tutqichi)</Term> bilan aniqlanadi. <code>CreateWindowEx()</code> chaqirilganda OS oynani ro'yxatdan o'tkazadi va HWND qaytaradi. Har bir oyna sinfi <Term>WndProc (Oyna Prosedurasi)</Term> — xabarlarni qabul qiladigan va qayta ishlaydigan callback funktsiyani ro'yxatdan o'tkazadi.</P>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:12}}>
        {[
          {title:"HWND",color:"var(--c-system)",body:"win32k.sys tomonidan boshqariladigan oyna ob'ektiga 32/64-bit tutqich. HWND lar jarayon-nisbiy, lekin jarayonlar o'rtasida ulashilishi mumkin (UI Automation, spy vositalari). Null HWND = barcha yuqori darajali oynalarga broadcast."},
          {title:"WndProc",color:"var(--c-warn)",body:"Xabar ishlovchi funktsiya: LRESULT CALLBACK WndProc(HWND hWnd, UINT msg, WPARAM wParam, LPARAM lParam). 0 qaytarish = ishlandi; ishlanmagan xabarlar uchun DefWindowProc() chaqiriladi. Har bir boshqaruv elementi (tugma, kiritish maydoni) o'z WndProc ga ega."},
          {title:"Xabar Navbati",color:"var(--accent)",body:"UI ga ega har bir thread shaxsiy xabar navbatiga ega. PostMessage() navbatga qo'shadi (asinxron); SendMessage() WndProc ni to'g'ridan-to'g'ri chaqiradi va qaytguncha bloklanadi (sinxron). GetMessage() / DispatchMessage() = xabar nasos tsikli."},
          {title:"Xabar Nasosi",color:"var(--c-system)",body:"while(GetMessage(&msg, NULL, 0, 0)) { TranslateMessage(&msg); DispatchMessage(&msg); } — Bu tsikl GUI ilovani tirik saqlaydi. Muzlab qolgan xabar nasosi = javob bermaydigan oyna (aylanuvchi kursor)."},
        ].map((item,i)=>(
          <div key={i} style={{padding:"12px 14px",borderRadius:8,background:`${item.color}08`,border:`1px solid ${item.color}25`}}>
            <div style={{fontFamily:"var(--font-mono)",fontSize:12,color:item.color,fontWeight:700,marginBottom:6}}>{item.title}</div>
            <div style={{fontSize:13,color:"var(--text-1)",lineHeight:1.6}}>{item.body}</div>
          </div>
        ))}
      </div>

      <H2 num="§3" uz="Ish stoli, Vazifalar paneli va Start Menu Anatomiyasi" en="" />

      <H2 num="§4" uz="DWM — Ish stoli Oyna Menejeri" en="" />
      <P><Term>DWM (Desktop Window Manager)</Term> — Windows Vista da kiritilgan compositor jarayoni (dwm.exe). Ilovalar to'g'ridan-to'g'ri ekranga chizish o'rniga, har bir oyna ekran tashqarisidagi Direct3D yuzasiga render qiladi. DWM barcha yuzalarni kompozit qiladi va yakuniy kadrni displeyga yuboradi — shaffoflik (Aero Glass), animatsiyalar, miniatyura oldinko'rishlari, HDR va monitor-DPI masshtablab ko'rsatishni ta'minlaydi.</P>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12}}>
        {[
          {title:"Yo'naltirish Yuzasi",color:"var(--c-system)",body:"Har bir oynaning piksellari DirectX teksturasiga (yo'naltirish yuzasi) tushadi. DWM ularni GPU tomonida kompozit qiladi. Ilovalar hech qachon to'g'ridan-to'g'ri kadrbuferga yozmaydi."},
          {title:"Flip Modeli",color:"var(--accent)",body:"Zamonaviy ilovalar (DXGI flip modeli) past kechikish uchun DWM kompozitsiyasini chetlab o'tadi. O'yinlar va video pleyerlar tomonidan yumshoq, past kechikishli ko'rsatish uchun ishlatiladi."},
          {title:"Animatsiya Mexanizmi",color:"var(--c-warn)",body:"DWM kichraytirish/tiklash animatsiyalarini, oyna loyqalik va Fluent Design effektlarini boshqaradi. DWM ni o'chirish = Aero yo'q = tekis rendering (Win XP ko'rinishi)."},
          {title:"Xavfsizlik Chegarasi",color:"var(--c-attack)",body:"DWM Session 0 ga o'xshash izolyatsiyada (SYSTEM darajasi) ishlaydi. Ilovalar DWM ga inject qila olmaydi. DWM ni buzish displeyning avtomatik qayta ishga tushishidan oldin qisqacha qorayishiga olib keladi."},
        ].map((item,i)=>(
          <div key={i} style={{padding:"10px 12px",borderRadius:8,background:`${item.color}08`,border:`1px solid ${item.color}22`}}>
            <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:item.color,fontWeight:700,marginBottom:5}}>{item.title}</div>
            <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.6}}>{item.body}</div>
          </div>
        ))}
      </div>

      <H2 num="§5" uz="GUI API Evolyutsiyasi" en="" />
      <P>Windows yillar davomida bir nechta GUI API qatlamlarini to'pladi. To'g'ri tanlov ham imkoniyatlar, ham xavfsizlik nuqtai nazaridan muhim:</P>
      <div style={{overflowX:"auto",marginTop:14}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{borderBottom:"2px solid var(--border)"}}>
            {["API Qatlami","Davr","Rendering","Sandboxing","Foydalanish Holati"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 10px",color:"var(--text-2)",fontWeight:700}}>{h}</th>)}
          </tr></thead>
          <tbody>{[
            ["Win32 GDI","Windows 3.1+","CPU rasterlash","Yo'q","Meros: dialog, menyu, tizim UI"],
            ["GDI+","Windows XP","CPU rasterlash","Yo'q","Anti-aliased 2D grafika, rasm yuklash"],
            ["Direct2D / DirectWrite","Vista+","GPU tezlashtirilgan","Yo'q","Zamonaviy 2D: matn, vektorlar, grafiklar"],
            ["WPF (.NET)","Vista+","Direct3D MIL orqali","Qisman (ClickOnce)","Korporativ LOB, XAML, data binding"],
            ["UWP / WinUI 2","Win 10","DirectX","AppContainer sandbox","Do'kon ilovalari, cheklangan API"],
            ["WinUI 3","Win 10 21H2+","DirectX","Ixtiyoriy AppContainer","Zamonaviy ish stoli ilovalari"],
            ["Electron / CEF","Har qanday","Chromium GPU","Renderer sandbox","VS Code, Slack, Teams — veb UI"],
          ].map((r,i)=><tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
            {r.map((c,j)=><td key={j} style={{padding:"6px 10px",color:j===0?"var(--accent)":j===3?"var(--c-system)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:12}}>{c}</td>)}
          </tr>)}
          </tbody>
        </table>
      </div>

      <H2 num="§6" uz="Win32 Xabarlari — Asosiy WM_ Konstantalari" en="" />

      <H2 num="§7" uz="GUI Xavfsizligi — Hujum Vektorlari" en="" />
      <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:12}}>
        {[
          {title:"Shatter Hujumlari (Klassik)",color:"var(--c-attack)",body:<>Vista gacha: turli imtiyoz darajalaridagi jarayonlar bitta ish stolini ulashardi. Past imtiyozli jarayon yuqori imtiyozli oynaning kiritish maydoniga <code>WM_SETTEXT</code> + <code>WM_PASTE</code> yuborib, keyin lParam da funktsiya ko'rsatkichi bilan <code>WM_TIMER</code> orqali bajarishni ishga tushirishi mumkin edi. Vista+ UIPI (User Interface Privilege Isolation) xoch-yaxlitlik-darajali xabar yuborishni bloklaydi.</>},
          {title:"UIPI — Foydalanuvchi Interfeys Imtiyozi Izolyatsiyasi",color:"var(--c-system)",body:<>Vista dan beri win32k.sys tomonidan amalga oshiriladi. Past-IL jarayon quyidagilarni qila olmaydi: yuqori-IL oynaga SendMessage, yuqori-IL kirishni kuzatish uchun SetWindowsHookEx, yuqori-IL thread ga AttachThreadInput. Istisno: <code>ChangeWindowMessageFilterEx()</code> yuqori-IL oynaga past IL dan muayyan xabarlarni qabul qilishga ruxsat beradi.</>},
          {title:"Clickjacking / UI Redressing",color:"var(--c-warn)",body:<>Qonuniy yuqori imtiyozli oynaning ustiga joylashtirilgan zararli shaffof oyna bosinchlarni ushlab qolishi mumkin. Qurbon UAC so'roviga bosdim deb o'ylaydi, lekin aslida tajovuzkorning oynasiga bosyapti. Kamaytirishlar: UAC Xavfsiz Ish stoli (oddiy jarayonlar uchun erimsiz alohida ish stoli ob'ektida render qiladi), UIPI.</>},
          {title:"UI Automation Suiiste'moli",color:"var(--c-warn)",body:<>UI Automation (UIA) — ekran o'quvchilar va test vositalari UI elementlari bilan munosabat o'rnatishga imkon beradigan maxsus ehtiyojlar freymvorki. Zararli dasturlar UIA ni quyidagilar uchun suiiste'mol qiladi: parol maydonlaridan matn o'qish, UAC so'rovlarini dasturiy ravishda bosish (bir xil IL da ishlayotgan bo'lsa), clipboard mazmunini chiqarish.</>},
          {title:"Oynalarni Sanab Chiqish (Razvedka)",color:"var(--text-2)",body:<><code>EnumWindows()</code> barcha yuqori darajali oynalarni ro'yxatga oladi. <code>GetWindowText()</code> sarlavha/boshqaruv matnini o'qiydi. Tajovuzkorlar bu orqali tahlil vositalarini (Wireshark, Process Monitor, debuggerlar) oyna sarlavhasi bo'yicha aniqlashadi — agar aniqlansa, zararli dastur chiqadi yoki xatti-harakatini o'zgartiradi.</>},
        ].map((item,i)=>(
          <div key={i} style={{padding:"14px 16px",borderRadius:10,background:`${item.color}08`,border:`1px solid ${item.color}30`}}>
            <div style={{fontFamily:"var(--font-display)",fontSize:14,fontWeight:700,color:item.color,marginBottom:8}}>{item.title}</div>
            <div style={{fontSize:13,color:"var(--text-1)",lineHeight:1.65}}>{item.body}</div>
          </div>
        ))}
      </div>
      <Callout color="var(--c-attack)" icon="warning" titleEn="" titleUz="Oyna Stantsiyasi Izolyatsiyasi">
        Xizmatlar interaktiv oyna stantsiyasiz (WinSta0 rad etilgan) Session 0 da ishlaydi. GUI oynasini yaratmoqchi bo'lgan xizmat jimgina muvaffaqiyatsiz bo'ladi — bu ataylab. Vista gacha xizmatlar foydalanuvchi sessiyasiga dialog oynalarini ko'rsatishi mumkin edi (Session 0 izolyatsiyani chetlab o'tish). GUI bilan interaksiyani talab qiladigan zamonaviy ekspluatatsiyalar foydalanuvchi sessiyasida ishlaydigan interaktiv jarayonga inject qilishlari kerak.
      </Callout>

      <H2 num="§8" uz="Amaliy Buyruqlar" en="" />
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// L38 — Active Directory asoslari
// ─────────────────────────────────────────────────────────────
function SectionADBasics() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="What is a Windows Domain?" uz="" />
      <P>Imagine managing a small network of 5 computers — you configure each one manually. Now imagine 157 computers across 4 offices with 320 users. Managing them individually becomes impossible.</P>
      <P>A <Term>Windows Domain</Term> is a group of users and computers under a single business administration. The key idea is to centralise management of common components into a single repository called <Term>Active Directory (AD)</Term>. The server running Active Directory services is called a <Term>Domain Controller (DC)</Term>.</P>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,margin:"18px 0"}}>
        <div style={{padding:16,background:"rgba(0,255,156,0.06)",border:"1px solid rgba(0,255,156,0.25)",borderRadius:10}}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--accent)",marginBottom:8}}>WITHOUT DOMAIN</div>
          <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.7}}>Each PC configured manually<br/>Separate user account per machine<br/>No central policy enforcement<br/>IT must visit each computer<br/><span style={{color:"var(--c-attack)"}}>→ Does not scale</span></div>
        </div>
        <div style={{padding:16,background:"rgba(100,100,255,0.06)",border:"1px solid rgba(100,100,255,0.25)",borderRadius:10}}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--c-auth)",marginBottom:8}}>WITH DOMAIN (AD)</div>
          <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.7}}>Central user &amp; policy management<br/>Single sign-on across all machines<br/>Group Policy applied from DC<br/>Remote administration<br/><span style={{color:"var(--accent)"}}>→ Scales to thousands of users</span></div>
        </div>
      </div>
      <Callout color="var(--accent)" icon="info" titleEn="Real-world example" titleUz="">
        At school or university you log in with one username/password on any campus computer. That works because authentication is forwarded to Active Directory — your credentials don't need to exist on every machine.
      </Callout>
      <SlideImg src="./assets/ad/6f8a4ad3-Active_Directory_s4_p1.png" caption="Windows Domain — users and computers managed centrally through a Domain Controller" />

      <H2 num="§2" en="Active Directory Domain Services (AD DS)" uz="" />
      <P>The core of any Windows domain is <Term>Active Directory Domain Services (AD DS)</Term>. It is a directory service — a catalogue that stores data about every <Em>object</Em> on the network: users, groups, computers, printers, shared folders, and more.</P>
      <P>AD DS is installed on the <Term>Domain Controller</Term>. All other machines in the domain trust the DC to authenticate users and enforce policies.</P>

      <H2 num="§3" en="AD Objects: Users, Machines, Groups" uz="" />
      <div style={{display:"flex",flexDirection:"column",gap:12,margin:"14px 0"}}>
        {[
          {title:"Users (Foydalanuvchilar)",color:"var(--accent)",body:<>The most common AD object. Users are <Term>security principals</Term> — the domain can authenticate them and assign them rights to resources. Two types:<br/><b>People</b>: employees who need network access.<br/><b>Services</b>: accounts for services like IIS or MSSQL — they have only the rights needed to run their specific service.</>},
          {title:"Machines (Qurilmalar)",color:"var(--c-auth)",body:<>Every computer joined to the domain gets a machine object. Like users, machines are also security principals with their own account. Machine account names end with <code>$</code> — e.g. <code>DC01$</code>. Machine account passwords are auto-rotated (120 random characters) and managed by Windows.</>},
          {title:"Security Groups (Xavfsizlik guruhlari)",color:"var(--c-warn)",body:<>Groups let you assign permissions to many users at once. A user added to a group automatically inherits all of its rights. Groups can contain users, machines, and other groups. They are also security principals — they can be granted rights to resources.</>},
        ].map((item,i)=>(
          <div key={i} style={{padding:"14px 16px",borderRadius:10,background:`${item.color}08`,border:`1px solid ${item.color}30`}}>
            <div style={{fontFamily:"var(--font-display)",fontSize:14,fontWeight:700,color:item.color,marginBottom:8}}>{item.title}</div>
            <div style={{fontSize:13,color:"var(--text-1)",lineHeight:1.65}}>{item.body}</div>
          </div>
        ))}
      </div>

      <H2 num="§4" en="Default Domain Groups" uz="" />
      <P>When a domain is created, several built-in groups are automatically created with pre-defined privileges:</P>
      <div style={{overflowX:"auto",marginTop:10}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Group","Description","Privilege level"].map((h,i)=><th key={i} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-3)",fontWeight:600,fontFamily:"var(--font-mono)",fontSize:10}}>{h}</th>)}</tr></thead>
          <tbody>
            {[
              ["Domain Admins","Full control over the entire domain","Highest — use with extreme care"],
              ["Enterprise Admins","Full control over all domains in the forest","Forest-wide admin — rarely used"],
              ["Schema Admins","Can modify the AD schema structure","Very high — schema changes are permanent"],
              ["Domain Users","All domain user accounts belong to this group","Standard user access"],
              ["Domain Computers","All domain-joined machines","Machine-level access"],
              ["Domain Controllers","All DCs in the domain","DC management"],
              ["Backup Operators","Can bypass file permissions for backup","Elevated — potential security risk"],
              ["Account Operators","Can manage most user accounts","Medium — cannot manage admin accounts"],
            ].map((r,i)=>(
              <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.01)"}}>
                {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":j===2?i<=2?"var(--c-attack)":"var(--text-2)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:12}}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SlideImg src="./assets/ad/6f8a4ad3-Active_Directory_s7_p1.png" caption="Default domain groups as seen in Active Directory Users and Computers" />

      <H2 num="§5" en="Active Directory Users and Computers (ADUC)" uz="" />
      <P>To manage users, groups, and machines in Active Directory, open <Term>Active Directory Users and Computers</Term> from the Start menu on the Domain Controller (or via <code>dsa.msc</code>). This shows the full hierarchy of objects in the domain.</P>
      <P>Objects are organised into <Term>Organisational Units (OUs)</Term> — container objects that group users and machines so policies can be applied to them. A typical domain mirrors company structure: IT, Management, Marketing, Sales each get their own OU.</P>
      <Callout color="var(--c-auth)" icon="info" titleEn="Key point" titleUz="">
        A user can belong to only ONE OU at a time (but many Security Groups). OUs are for applying policies; Security Groups are for assigning resource permissions.
      </Callout>
      <SlideImg src="./assets/ad/6f8a4ad3-Active_Directory_s8_p2.png" caption="Opening Active Directory Users and Computers (ADUC) on the Domain Controller" />
      <SlideImg src="./assets/ad/6f8a4ad3-Active_Directory_s10_p1.png" caption="ADUC showing the full OU hierarchy of the domain" />
      <SlideImg src="./assets/ad/6f8a4ad3-Active_Directory_s11_p1.png" caption="Users list inside an Organisational Unit" />

      <H2 num="§6" en="Default Containers in AD" uz="" />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,margin:"14px 0"}}>
        {[
          {t:"Builtin",c:"var(--text-2)",d:"Standard groups present on every Windows host (Administrators, Backup Operators, etc.)"},
          {t:"Computers",c:"var(--c-auth)",d:"Any machine that joins the domain lands here by default. Move to appropriate OU for policy."},
          {t:"Domain Controllers",c:"var(--c-warn)",d:"Default OU containing all DCs in the domain."},
          {t:"Users",c:"var(--accent)",d:"Default users and groups that apply domain-wide (e.g. Domain Admins, Domain Users)."},
          {t:"Managed Service Accounts",c:"var(--c-system)",d:"Stores accounts used by Windows services within your domain."},
        ].map((card,i)=>(
          <div key={i} style={{padding:14,background:`${card.c}08`,border:`1px solid ${card.c}30`,borderRadius:10}}>
            <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:card.c,marginBottom:6}}>{card.t}</div>
            <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.6}}>{card.d}</div>
          </div>
        ))}
      </div>

      <H2 num="§7" en="OUs vs Security Groups" uz="" />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,margin:"14px 0"}}>
        <div style={{padding:16,background:"rgba(100,100,255,0.06)",border:"1px solid rgba(100,100,255,0.25)",borderRadius:10}}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--c-auth)",marginBottom:8}}>ORGANISATIONAL UNITS (OUs)</div>
          <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.7}}>Used to <b>apply policies</b> (GPO)<br/>A user can be in only 1 OU<br/>Reflects company structure<br/>Examples: IT, Sales, Management<br/><span style={{color:"var(--c-auth)"}}>→ Policy containers</span></div>
        </div>
        <div style={{padding:16,background:"rgba(0,255,156,0.06)",border:"1px solid rgba(0,255,156,0.25)",borderRadius:10}}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--accent)",marginBottom:8}}>SECURITY GROUPS</div>
          <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.7}}>Used to <b>grant resource permissions</b><br/>A user can be in many groups<br/>Can contain users, machines, groups<br/>Examples: ShareAccess, PrinterUsers<br/><span style={{color:"var(--accent)"}}>→ Permission containers</span></div>
        </div>
      </div>
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="Windows Domeni nima?" en="" />
      <P>Tasavvur qiling, siz atigi beshta kompyuter va beshta xodimdan iborat kichik biznes tarmog'ini boshqaryapsiz. Bunday kichik tarmoqda siz har bir kompyuterni muammosiz alohida sozlashingiz mumkin: har biriga qo'lda tizimga kirasiz, foydalanuvchilar yaratasiz va maxsus sozlamalar qilasiz.</P>
      <P>Faraz qilaylik, sizning biznesingiz to'satdan o'sib, hozirda to'rtta turli idorada joylashgan 157 ta kompyuter va 320 ta foydalanuvchiga ega bo'ldi. Siz hali ham har bir kompyuterni alohida boshqara olasizmi, tarmoqdagi har bir foydalanuvchi uchun qoidalarni qo'lda sozlaysizmi? Javob, katta ehtimol bilan, <Em>yo'q</Em>.</P>
      <P>Ushbu cheklovlarni bartaraf etish uchun <Term>Windows domenidan</Term> foydalaniladi. Oddiy qilib aytganda, Windows domeni — bu ma'lum bir biznes ma'muriyati ostidagi foydalanuvchilar va kompyuterlar guruhi. Domen ortidagi asosiy g'oya — Windows kompyuter tarmog'ining umumiy komponentlarini <Term>Active Directory (AD)</Term> deb nomlanuvchi yagona omborda markazlashtirishdir. Active Directory xizmatlarini ishga tushiradigan server esa <Term>Domen Kontrolleri (DC)</Term> deb ataladi.</P>
      <P><Term>Domen Kontrolleri</Term> — foydalanuvchi akkauntlari haqidagi ma'lumotlarni saqlaydigan va tarmoqdagi resurslarga kirishni nazorat qiladigan server. U tarmoq infratuzilmasini boshqarish va himoyalash uchun juda muhim komponent hisoblanadi.</P>
      <Callout color="var(--c-auth)" icon="info" titleUz="Domenning asosiy afzalliklari" titleEn="">
        <b>Markazlashtirilgan identifikatsiyani boshqarish:</b> Barcha foydalanuvchilar minimal kuch sarflab Active Directory'dan sozlanishi mumkin.<br/>
        <b>Xavfsizlik siyosatlarini boshqarish:</b> Siyosatlarni to'g'ridan-to'g'ri Active Directory'dan sozlab, kerak bo'lganda tarmoqdagi foydalanuvchilar va kompyuterlarga qo'llash mumkin.
      </Callout>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,margin:"18px 0"}}>
        <div style={{padding:16,background:"rgba(0,255,156,0.06)",border:"1px solid rgba(0,255,156,0.25)",borderRadius:10}}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--accent)",marginBottom:8}}>DOMENSIЗ</div>
          <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.7}}>Har bir kompyuter qo'lda sozlanadi<br/>Har mashinada alohida hisob<br/>Markaziy siyosat yo'q<br/>IT har joyga borishi kerak<br/><span style={{color:"var(--c-attack)"}}>→ Ko'p foydalanuvchida ishlamaydi</span></div>
        </div>
        <div style={{padding:16,background:"rgba(100,100,255,0.06)",border:"1px solid rgba(100,100,255,0.25)",borderRadius:10}}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--c-auth)",marginBottom:8}}>DOMEN BILAN (AD)</div>
          <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.7}}>Markaziy foydalanuvchi boshqaruvi<br/>Barcha mashinalarda yagona kirish<br/>DC dan Group Policy qo'llanadi<br/>Masofadan boshqarish<br/><span style={{color:"var(--accent)"}}>→ Minglab foydalanuvchiga moslashadi</span></div>
        </div>
      </div>
      <Callout color="var(--accent)" icon="info" titleUz="Haqiqiy hayot misoli" titleEn="">
        Maktab yoki universitetda siz istalgan kampus kompyuterida bir xil login va parol bilan kirasiz. Bu Active Directory tufayli ishlaydi — hisob ma'lumotlaringiz har mashinada emas, faqat AD da saqlanadi.
      </Callout>
      <SlideImg src="./assets/ad/6f8a4ad3-Active_Directory_s4_p1.png" caption="Windows Domeni — foydalanuvchilar va kompyuterlar Domen Kontrolleri orqali markaziy boshqariladi" />

      <H2 num="§2" uz="Active Directory Domain Services (AD DS)" en="" />
      <P>Har qanday Windows domenining o'zagi — <Term>Active Directory domen xizmati (AD DS)</Term>. Ushbu xizmat tarmog'ingizda mavjud bo'lgan barcha <Em>ob'ektlar</Em> ma'lumotlarini o'zida saqlaydigan katalog vazifasini bajaradi. AD tomonidan qo'llab-quvvatlanadigan ko'plab ob'ektlar qatoriga foydalanuvchilar, guruhlar, qurilmalar, printerlar, umumiy tarmoq jildlari (shares) va boshqa ko'plab narsalar kiradi.</P>
      <P>AD DS <Term>Domen Kontrollerida</Term> o'rnatiladi. Domendagi boshqa barcha mashinalar autentifikatsiya va siyosatlar uchun DC ga ishonadi va unga tayanadi.</P>

      <H2 num="§3" uz="AD Ob'ektlari: Foydalanuvchilar, Qurilmalar, Guruhlar" en="" />
      <div style={{display:"flex",flexDirection:"column",gap:12,margin:"14px 0"}}>
        {[
          {title:"Foydalanuvchilar (Users)",color:"var(--accent)",body:<>Foydalanuvchilar — Active Directory-dagi eng keng tarqalgan ob'ekt turlaridan biri. Ular <Term>xavfsizlik sub'ektlari</Term> — domen ularni autentifikatsiya qiladi va ularga resurslar ustidan huquqlar tayinlanishi mumkin. Ikki tur:<br/><b>Odamlar:</b> tashkilotda tarmoqqa kirishi kerak bo'lgan shaxslar, ya'ni xodimlar.<br/><b>Xizmatlar:</b> IIS yoki MSSQL kabi xizmatlar uchun yaratilgan hisoblar — ular faqat o'zlarining maxsus xizmatini ishga tushirish uchun zarur bo'lgan huquqlarga ega.</>},
          {title:"Qurilmalar (Machines)",color:"var(--c-auth)",body:<>Active Directory domeniga qo'shilgan har bir kompyuter uchun qurilma ob'ekti yaratiladi. Qurilmalar ham "xavfsizlik sub'ektlari" hisoblanadi — xuddi oddiy foydalanuvchi kabi ularga ham hisob qaydnomasi tayinlanadi. Qurilma hisob qaydnomasi nomi kompyuter nomidan keyin dollar belgisi (<code>$</code>) qo'yilishi bilan hosil bo'ladi: masalan, DC01 qurilmasi <code>DC01$</code> hisob qaydnomasiga ega. Parollar avtomatik ravishda yangilanib turadi (120 ta tasodifiy belgi).</>},
          {title:"Xavfsizlik Guruhlari (Security Groups)",color:"var(--c-warn)",body:<>Xavfsizlik guruhlari alohida foydalanuvchilarga emas, balki butun guruhga fayllar yoki resurslarga kirish huquqlarini tayinlash imkonini beradi. Guruhga qo'shilgan foydalanuvchi avtomatik ravishda guruhning barcha huquqlarini meros qilib oladi. Guruhlar ham xavfsizlik sub'ektlari — tarmoqdagi resurslar ustidan huquqlarga ega bo'lishi mumkin. Guruhlar aʼzo sifatida foydalanuvchilarga, qurilmalarga va boshqa guruhlarga ega bo'lishi mumkin.</>},
        ].map((item,i)=>(
          <div key={i} style={{padding:"14px 16px",borderRadius:10,background:`${item.color}08`,border:`1px solid ${item.color}30`}}>
            <div style={{fontFamily:"var(--font-display)",fontSize:14,fontWeight:700,color:item.color,marginBottom:8}}>{item.title}</div>
            <div style={{fontSize:13,color:"var(--text-1)",lineHeight:1.65}}>{item.body}</div>
          </div>
        ))}
      </div>

      <H2 num="§4" uz="Standart Domen Guruhlari" en="" />
      <P>Domen yaratilganda bir qator o'rnatilgan guruhlar avtomatik tarzda yaratiladi:</P>
      <div style={{overflowX:"auto",marginTop:10}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Guruh","Tavsif","Imtiyoz darajasi"].map((h,i)=><th key={i} style={{textAlign:"left",padding:"8px 12px",color:"var(--text-3)",fontWeight:600,fontFamily:"var(--font-mono)",fontSize:10}}>{h}</th>)}</tr></thead>
          <tbody>
            {[
              ["Domain Admins","Butun domen ustidan to'liq nazorat","Eng yuqori — ehtiyotkorlik bilan ishlating"],
              ["Enterprise Admins","O'rmondagi barcha domenlar ustidan nazorat","O'rmon bo'ylab admin — kamdan-kam ishlatiladi"],
              ["Schema Admins","AD sxema tuzilmasini o'zgartirish","Juda yuqori — o'zgarishlar doimiy"],
              ["Domain Users","Barcha domen foydalanuvchi hisoblari","Standart foydalanuvchi huquqlari"],
              ["Domain Computers","Domenge qo'shilgan barcha mashinalar","Mashina darajasida kirish"],
              ["Domain Controllers","Domendagi barcha DC lar","DC boshqaruvi"],
              ["Backup Operators","Zaxira uchun fayl ruxsatlarini chetlab o'tish","Yuqori — potentsial xavfsizlik xavfi"],
              ["Account Operators","Ko'p foydalanuvchi hisoblarini boshqarish","O'rta — admin hisoblarini boshqara olmaydi"],
            ].map((r,i)=>(
              <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.01)"}}>
                {r.map((c,j)=><td key={j} style={{padding:"7px 12px",color:j===0?"var(--accent)":j===2?i<=2?"var(--c-attack)":"var(--text-2)":"var(--text-1)",fontFamily:j===0?"var(--font-mono)":"inherit",fontSize:j===0?11:12}}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SlideImg src="./assets/ad/6f8a4ad3-Active_Directory_s7_p1.png" caption="Active Directory Users and Computers da ko'rinadigan standart domen guruhlari" />

      <H2 num="§5" uz="Active Directory Users and Computers (ADUC)" en="" />
      <P>Active Directory da foydalanuvchilar, guruhlar yoki mashinalarni sozlash uchun Domen boshqaruvchisiga kirishimiz va boshlash menyusidan <Term>Active Directory Users and Computers</Term> buyrug'ini ishga tushirishimiz kerak (yoki <code>dsa.msc</code> orqali).</P>
      <P>Bu domenda mavjud bo'lgan foydalanuvchilar, kompyuterlar va guruhlar ierarxiyasini ko'rishingiz mumkin bo'lgan oynani ochadi. Ushbu ob'ektlar <Term>Tashkiliy Bo'linmalar (TB / OU)</Term> da tashkil etilgan — bu konteyner ob'ektlar foydalanuvchilar va mashinalarni tasniflash imkonini beradi.</P>
      <P>TBlar asosan o'xshash siyosat talablariga ega foydalanuvchilar to'plamlarini aniqlash uchun ishlatiladi. Masalan, tashkilotingizning savdo bo'limidagi odamlar IT sohasidagi odamlarga qaraganda boshqa siyosatlar to'plamiga ega bo'lishlari mumkin. Mashinamizni tekshirib ko'rsak, IT, menejment, marketing va savdo bo'limlari uchun bola TBlar bilan asosiy domen TB si mavjudligini ko'rishimiz mumkin.</P>
      <Callout color="var(--c-auth)" icon="info" titleUz="Asosiy qoida" titleEn="">
        Foydalanuvchi bir vaqtda faqat BITTA TB da bo'lishi mumkin (lekin ko'plab Security Group larda bo'lishi mumkin). TB lar siyosat qo'llash uchun; Security Groups ruxsat berish uchun.
      </Callout>
      <SlideImg src="./assets/ad/6f8a4ad3-Active_Directory_s8_p2.png" caption="Domen Kontrollerida Active Directory Users and Computers (ADUC) ni ochish" />
      <SlideImg src="./assets/ad/6f8a4ad3-Active_Directory_s10_p1.png" caption="ADUC da domenning to'liq OU ierarxiyasi" />
      <SlideImg src="./assets/ad/6f8a4ad3-Active_Directory_s11_p1.png" caption="Tashkiliy Bo'linma ichidagi foydalanuvchilar ro'yxati" />

      <H2 num="§6" uz="AD dagi Standart Konteynerlar" en="" />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,margin:"14px 0"}}>
        {[
          {t:"Builtin",c:"var(--text-2)",d:"Har bir Windows xostida mavjud standart guruhlar (Administrators, Backup Operators va boshqalar)."},
          {t:"Computers",c:"var(--c-auth)",d:"Domenge qo'shilgan har qanday qurilma standart holda shu yerga tushadi. Kerak bo'lsa boshqa TB ga ko'chiring."},
          {t:"Domain Controllers",c:"var(--c-warn)",d:"Domendagi barcha DC larni o'z ichiga oluvchi standart TB."},
          {t:"Users",c:"var(--accent)",d:"Butun domen bo'ylab qo'llaniladigan standart foydalanuvchilar va guruhlar (Domain Admins, Domain Users)."},
          {t:"Managed Service Accounts",c:"var(--c-system)",d:"Domendagi xizmatlar tomonidan ishlatiladigan hisob qaydnomalarini saqlaydi."},
        ].map((card,i)=>(
          <div key={i} style={{padding:14,background:`${card.c}08`,border:`1px solid ${card.c}30`,borderRadius:10}}>
            <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:card.c,marginBottom:6}}>{card.t}</div>
            <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.6}}>{card.d}</div>
          </div>
        ))}
      </div>

      <H2 num="§7" uz="TB lar va Security Groups farqi" en="" />
      <P>Nima uchun bizda ham guruhlar, ham OUlar borligi haqida o'ylayotgan bo'lishingiz mumkin. Garchi ikkalasi ham foydalanuvchilar va kompyuterlarni tasniflash uchun ishlatilsa-da, ularning maqsadlari butunlay boshqacha:</P>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,margin:"14px 0"}}>
        <div style={{padding:16,background:"rgba(100,100,255,0.06)",border:"1px solid rgba(100,100,255,0.25)",borderRadius:10}}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--c-auth)",marginBottom:8}}>TASHKILIY BO'LINMALAR (TB / OU)</div>
          <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.7}}>Foydalanuvchilar va kompyuterlarga <b>siyosatlarni qo'llash</b> uchun qulay. Muayyan rolga qarab foydalanuvchilar to'plamiga maxsus sozlamalar qo'llanadi.<br/><br/>Foydalanuvchi bir vaqtning o'zida faqat <b>bitta OUning a'zosi</b> bo'lishi mumkin.<br/><span style={{color:"var(--c-auth)"}}>→ Siyosat konteynerlari</span></div>
        </div>
        <div style={{padding:16,background:"rgba(0,255,156,0.06)",border:"1px solid rgba(0,255,156,0.25)",borderRadius:10}}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--accent)",marginBottom:8}}>XAVFSIZLIK GURUHLARI</div>
          <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.7}}>Resurslar ustidan <b>ruxsatlar berish</b> uchun ishlatiladi. Masalan, umumiy tarmoq jildiga yoki printerga kirishga ruxsat berishda guruhlardan foydalaniladi.<br/><br/>Foydalanuvchi <b>ko'plab guruhlarning a'zosi</b> bo'lishi mumkin.<br/><span style={{color:"var(--accent)"}}>→ Ruxsat konteynerlari</span></div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// L39 — AD da foydalanuvchi va kompyuter boshqaruvi
// ─────────────────────────────────────────────────────────────
function SectionADUsers() {
  const lang = useLang();
  return lang === "en" ? (
    <section>
      <H2 num="§1" en="Managing the OU Structure" uz="" />
      <P>As a new domain admin, your first task is to check the existing OU and user structure and align it with the company's org chart. You may need to create missing OUs, delete obsolete ones, and add or remove user accounts accordingly.</P>
      <Callout color="var(--accent)" icon="info" titleEn="Typical first steps" titleUz="">
        Open ADUC (<code>dsa.msc</code>) → compare existing OUs to the org chart → delete obsolete OUs → create/delete users to match the chart.
      </Callout>
      <SlideImg src="./assets/ad/d1b29bad-Managing_users_in_AD_s2_p1.png" caption="Company org chart — the reference for aligning the AD OU structure" />

      <H2 num="§2" en="Deleting an OU — Accidental Deletion Protection" uz="" />
      <P>By default, OUs are protected against accidental deletion. If you right-click an OU and try to delete it, you'll see an error. To delete it:</P>
      <div style={{display:"flex",flexDirection:"column",gap:10,margin:"14px 0"}}>
        {[
          {n:"1",t:"Enable Advanced Features",d:'In ADUC → View menu → check "Advanced Features". This reveals additional containers and properties.'},
          {n:"2",t:"Open OU Properties",d:"Right-click the OU → Properties → Object tab."},
          {n:"3",t:"Uncheck protection",d:'Uncheck "Protect object from accidental deletion" → OK.'},
          {n:"4",t:"Delete the OU",d:"Right-click the OU → Delete. Confirm — this also deletes ALL users, groups, and sub-OUs inside it."},
        ].map((s,i)=>(
          <div key={i} style={{display:"flex",gap:14,alignItems:"flex-start",padding:"12px 14px",background:"var(--bg-2)",border:"1px solid var(--border)",borderRadius:8}}>
            <div style={{minWidth:28,height:28,borderRadius:"50%",background:"var(--accent)",display:"grid",placeItems:"center",fontFamily:"var(--font-mono)",fontSize:12,fontWeight:700,color:"var(--bg-1)",flexShrink:0}}>{s.n}</div>
            <div><div style={{fontWeight:600,fontSize:13,color:"var(--text-0)",marginBottom:3}}>{s.t}</div><div style={{fontSize:12,color:"var(--text-2)",lineHeight:1.6}}>{s.d}</div></div>
          </div>
        ))}
      </div>
      <Callout color="var(--c-attack)" icon="warning" titleEn="Warning" titleUz="">
        Deleting an OU permanently removes everything inside it — users, groups, sub-OUs. There is no Recycle Bin by default. Enable AD Recycle Bin from Active Directory Administrative Center before doing bulk deletions.
      </Callout>
      <SlideImg src="./assets/ad/d1b29bad-Managing_users_in_AD_s3_p2.png" caption="Error when attempting to delete a protected OU" />
      <SlideImg src="./assets/ad/d1b29bad-Managing_users_in_AD_s4_p1.png" caption='Enabling "Advanced Features" from the View menu in ADUC' />
      <SlideImg src="./assets/ad/d1b29bad-Managing_users_in_AD_s5_p1.png" caption='Object tab — uncheck "Protect object from accidental deletion" before deleting' />

      <H2 num="§3" en="Creating and Deleting Users" uz="" />
      <P>To create a user: right-click an OU → New → User. Fill in first name, last name, username (<Term>User Logon Name</Term>) and set an initial password. To delete: right-click the user → Delete.</P>
      <P>Common tasks when aligning AD to an org chart:</P>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,margin:"14px 0"}}>
        {[
          {t:"Create missing users",c:"var(--accent)",d:"Add accounts for new employees shown in org chart but not yet in AD."},
          {t:"Delete departed users",c:"var(--c-attack)",d:"Remove accounts of employees who have left. Leaving them active is a security risk — orphaned accounts can be exploited."},
          {t:"Move users to correct OU",c:"var(--c-auth)",d:"Drag-and-drop or right-click → Move to place users in the right OU so correct Group Policies apply."},
          {t:"Reset passwords",c:"var(--c-warn)",d:"Right-click user → Reset Password. Can also force password change on next login."},
        ].map((card,i)=>(
          <div key={i} style={{padding:14,background:`${card.c}08`,border:`1px solid ${card.c}30`,borderRadius:10}}>
            <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:card.c,marginBottom:6}}>{card.t}</div>
            <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.6}}>{card.d}</div>
          </div>
        ))}
      </div>

      <H2 num="§4" en="Delegation — Granting OU Control" uz="" />
      <P><Term>Delegation</Term> lets you give a specific user partial control over an OU — without making them a Domain Admin. The most common use case: granting IT support the right to reset passwords without full admin access.</P>
      <P>To delegate control over an OU:</P>
      <div style={{display:"flex",flexDirection:"column",gap:10,margin:"14px 0"}}>
        {[
          {n:"1",t:"Right-click the OU",d:'In ADUC, right-click the target OU → "Delegate Control…"'},
          {n:"2",t:"Add the user",d:'Click Add → type the username (e.g. "phillip") → Check Names → OK.'},
          {n:"3",t:"Select the task",d:'Choose "Reset user passwords and force password change at next logon" → Next → Finish.'},
        ].map((s,i)=>(
          <div key={i} style={{display:"flex",gap:14,alignItems:"flex-start",padding:"12px 14px",background:"var(--bg-2)",border:"1px solid var(--border)",borderRadius:8}}>
            <div style={{minWidth:28,height:28,borderRadius:"50%",background:"var(--c-auth)",display:"grid",placeItems:"center",fontFamily:"var(--font-mono)",fontSize:12,fontWeight:700,color:"var(--bg-1)",flexShrink:0}}>{s.n}</div>
            <div><div style={{fontWeight:600,fontSize:13,color:"var(--text-0)",marginBottom:3}}>{s.t}</div><div style={{fontSize:12,color:"var(--text-2)",lineHeight:1.6}}>{s.d}</div></div>
          </div>
        ))}
      </div>
      <P>After delegation, the user can reset passwords in that OU but cannot open ADUC (no full admin rights). They use PowerShell instead:</P>
      <div style={{background:"var(--surface-2)",borderRadius:8,padding:"12px 16px",fontFamily:"var(--font-mono)",fontSize:12,lineHeight:1.9,margin:"10px 0"}}>
        <span style={{color:"var(--text-3)"}}># Reset password</span><br/>
        <span style={{color:"var(--text-2)"}}>Set-ADAccountPassword</span> sophie -Reset -NewPassword (<span style={{color:"var(--text-2)"}}>Read-Host</span> -AsSecureString -Prompt <span style={{color:"var(--accent)"}}>'New Password'</span>)<br/><br/>
        <span style={{color:"var(--text-3)"}}># Force password change on next login</span><br/>
        <span style={{color:"var(--text-2)"}}>Set-ADUser</span> -ChangePasswordAtLogon <span style={{color:"var(--c-warn)"}}>$true</span> -Identity sophie
      </div>
      <SlideImg src="./assets/ad/d1b29bad-Managing_users_in_AD_s7_p1.png" caption='"Delegate Control…" option in the ADUC context menu' />
      <SlideImg src="./assets/ad/d1b29bad-Managing_users_in_AD_s8_p1.png" caption="Delegation wizard — adding a user to delegate to" />
      <SlideImg src="./assets/ad/d1b29bad-Managing_users_in_AD_s9_p1.png" caption="Delegation wizard — selecting the task (reset passwords)" />
      <SlideImg src="./assets/ad/d1b29bad-Managing_users_in_AD_s10_p1.png" caption="PowerShell commands for resetting AD account passwords" />
      <SlideImg src="./assets/ad/d1b29bad-Managing_users_in_AD_s11_p1.png" caption="PowerShell — Set-ADAccountPassword execution result" />
      <SlideImg src="./assets/ad/d1b29bad-Managing_users_in_AD_s11_p3.png" caption="PowerShell — Set-ADUser force password change result" />

      <H2 num="§5" en="Managing Computers in AD" uz="" />
      <P>By default, all domain-joined machines land in the <Term>Computers</Term> container. It's best practice to organise them into separate OUs so you can apply different policies to different device types.</P>
      <div style={{display:"grid",gridTemplateColumns:"1fr",gap:10,margin:"14px 0"}}>
        {[
          {t:"Workstations",c:"var(--accent)",d:"Most common devices — desktops and laptops used by employees for daily work. Standard users log in here. High-privilege accounts should NEVER log into workstations."},
          {t:"Servers",c:"var(--c-auth)",d:"Provide services to users or other servers (file servers, web servers, print servers). Need stricter policies than workstations."},
          {t:"Domain Controllers",c:"var(--c-attack)",d:"The most sensitive machines in the domain — they hold hashed passwords of every user. Already have their own default OU. Tightly restricted access."},
        ].map((card,i)=>(
          <div key={i} style={{padding:14,background:`${card.c}08`,border:`1px solid ${card.c}30`,borderRadius:10}}>
            <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:card.c,marginBottom:6}}>{card.t}</div>
            <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.6}}>{card.d}</div>
          </div>
        ))}
      </div>
      <SlideImg src="./assets/ad/d1b29bad-Managing_users_in_AD_s12_p2.png" caption="Default Computers container in ADUC — all newly joined machines land here" />

      <H2 num="§6" en="Organising Computers into OUs" uz="" />
      <P>Create two new OUs directly under the domain root: <Em>Workstations</Em> and <Em>Servers</Em>. Then move machines from the default Computers container into the appropriate OU.</P>
      <P>To move a computer object: in ADUC, find the machine in Computers → right-click → Move → select the target OU. After this, Group Policy assigned to the OU will apply to that machine on next Group Policy refresh (<code>gpupdate /force</code>).</P>
      <Callout color="var(--c-warn)" icon="info" titleEn="Security benefit" titleUz="">
        Separating Workstations from Servers lets you apply a stricter policy to servers: block USB drives, disable interactive login for most users, enforce different password policies, and restrict internet access.
      </Callout>
      <SlideImg src="./assets/ad/d1b29bad-Managing_users_in_AD_s14_p0.png" caption="Final OU structure after reorganising — Workstations and Servers OUs under the domain root" />
    </section>
  ) : (
    <section>
      <H2 num="§1" uz="OU Tuzilmasini Boshqarish" en="" />
      <P>Yangi domen administratori sifatidagi birinchi vazifangiz mavjud AD OU (tashkiliy birliklar) va foydalanuvchilarini tekshirishdan iborat, chunki yaqinda biznesda ba'zi o'zgarishlar yuz berdi. Sizga quyidagi tashkiliy sxema berilgan va AD ga unga mos keladigan o'zgarishlar kiritishingiz kutilmoqda.</P>
      <Callout color="var(--accent)" icon="info" titleUz="Birinchi qadamlar" titleEn="">
        ADUC ni oching (<code>dsa.msc</code>) → mavjud OUlarni tashkiliy sxema bilan solishtiring → ortiqcha OUlarni o'chiring → yo'q foydalanuvchilarni yarating, ketgan xodimlar hisoblarini o'chiring.
      </Callout>
      <SlideImg src="./assets/ad/d1b29bad-Managing_users_in_AD_s2_p1.png" caption="Kompaniya tashkiliy sxemasi — AD OU tuzilmasini moslashtirish uchun asosiy manba" />

      <H2 num="§2" uz="OU ni O'chirish — Tasodifiy O'chirishdan Himoya" en="" />
      <P>Siz e'tibor berishingiz kerak bo'lgan birinchi narsa — joriy AD konfiguratsiyangizda tashkiliy sxemada ko'rinmaydigan qo'shimcha bo'lim OUi mavjudligi. U yopilgani va domendan olib tashlanishi kerak.</P>
      <P>Standart holda, OUlar tasodifiy o'chirishdan himoyalangan. Agar siz sichqonchaning o'ng tugmasini bosib, OUni o'chirishga harakat qilsangiz, quyidagi xatoni ko'rasiz. OUni o'chirish uchun:</P>
      <div style={{display:"flex",flexDirection:"column",gap:10,margin:"14px 0"}}>
        {[
          {n:"1",t:"Kengaytirilgan xususiyatlarni yoqing",d:'ADUC → Ko\'rish menyusi → "Advanced Features" ni belgilang. Qo\'shimcha konteynerlar va xususiyatlar paydo bo\'ladi.'},
          {n:"2",t:"OU xususiyatlarini oching",d:'OU ustiga o\'ng tugma → Xususiyatlar → "Object" yorlig\'i.'},
          {n:"3",t:"Himoyani o\'chiring",d:'"Protect object from accidental deletion" katagidan belgini olib tashlang → OK.'},
          {n:"4",t:"OUni o\'chiring",d:"O'ng tugma → Delete. Tasdiqlang — bu ichidagi barcha foydalanuvchilar, guruhlar va sub-OUlarni ham o'chiradi."},
        ].map((s,i)=>(
          <div key={i} style={{display:"flex",gap:14,alignItems:"flex-start",padding:"12px 14px",background:"var(--bg-2)",border:"1px solid var(--border)",borderRadius:8}}>
            <div style={{minWidth:28,height:28,borderRadius:"50%",background:"var(--accent)",display:"grid",placeItems:"center",fontFamily:"var(--font-mono)",fontSize:12,fontWeight:700,color:"var(--bg-1)",flexShrink:0}}>{s.n}</div>
            <div><div style={{fontWeight:600,fontSize:13,color:"var(--text-0)",marginBottom:3}}>{s.t}</div><div style={{fontSize:12,color:"var(--text-2)",lineHeight:1.6}}>{s.d}</div></div>
          </div>
        ))}
      </div>
      <Callout color="var(--c-attack)" icon="warning" titleUz="Ogohlantirish" titleEn="">
        OUni o'chirish ichidagi hamma narsani — foydalanuvchilar, guruhlar, sub-OUlarni — butunlay o'chiradi. Standart holda Recycle Bin yo'q. Ko'p o'chirishdan oldin Active Directory Administrative Center dan AD Recycle Bin ni yoqing.
      </Callout>
      <P>Qo'shimcha OUni o'chirib tashlaganingizdan so'ng, ba'zi bo'limlar uchun AD dagi foydalanuvchilar tashkiliy jadvalidagi foydalanuvchilar bilan mos kelmasligini payqashingiz kerak. Ularga mos kelish uchun kerak bo'lganda foydalanuvchilarni yarating va o'chiring.</P>
      <SlideImg src="./assets/ad/d1b29bad-Managing_users_in_AD_s3_p2.png" caption="Himoyalangan OUni o'chirishga urinilganda xato xabari" />
      <SlideImg src="./assets/ad/d1b29bad-Managing_users_in_AD_s4_p1.png" caption={"ADUC Ko'rish menyusidan \"Advanced Features\" ni yoqish"} />
      <SlideImg src="./assets/ad/d1b29bad-Managing_users_in_AD_s5_p1.png" caption={"Object yorlig'i — o'chirishdan oldin \"Protect object from accidental deletion\" katagidan belgini oling"} />

      <H2 num="§3" uz="Foydalanuvchilarni Yaratish va O'chirish" en="" />
      <P>Foydalanuvchi yaratish: OUga o'ng tugma → Yangi → Foydalanuvchi. Ism, familiya, login nomi (<Term>User Logon Name</Term>) kiritib dastlabki parol o'rnating. O'chirish: foydalanuvchiga o'ng tugma → Delete.</P>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,margin:"14px 0"}}>
        {[
          {t:"Yo'q foydalanuvchilarni qo'shish",c:"var(--accent)",d:"Tashkiliy sxemada bor lekin AD da yo'q yangi xodimlar uchun hisob yarating."},
          {t:"Ketgan xodimlarni o'chirish",c:"var(--c-attack)",d:"Tashkilotdan ketgan xodimlar hisoblarini o'chiring. Faol qoldirish xavfsizlik xavfi — tashlab ketilgan hisoblar ekspluatatsiya qilinishi mumkin."},
          {t:"Foydalanuvchilarni to'g'ri OUga ko'chirish",c:"var(--c-auth)",d:"Sudrab tashla yoki o'ng tugma → Ko'chirish. To'g'ri OU to'g'ri Group Policyni qo'llaydi."},
          {t:"Parollarni tiklash",c:"var(--c-warn)",d:"Foydalanuvchiga o'ng tugma → Parolni tiklash. Keyingi kirishda parol o'zgartirishni majburlash mumkin."},
        ].map((card,i)=>(
          <div key={i} style={{padding:14,background:`${card.c}08`,border:`1px solid ${card.c}30`,borderRadius:10}}>
            <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:card.c,marginBottom:6}}>{card.t}</div>
            <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.6}}>{card.d}</div>
          </div>
        ))}
      </div>

      <H2 num="§4" uz="Delegatsiya — OU Ustidan Nazoratni Topshirish" en="" />
      <P>AD da amalga oshirish mumkin bo'lgan ajoyib imkoniyatlardan biri — muayyan foydalanuvchilarga ba'zi OUlar ustidan qisman nazorat huquqini berishdir. Ushbu jarayon <Term>delegatsiya</Term> (vakolat berish) deb nomlanadi va u Domen Administratorining aralashuvisiz foydalanuvchilarga OUlarda ilg'or vazifalarni bajarish uchun maxsus imtiyozlar taqdim etish imkonini beradi.</P>
      <P>Buning uchun eng keng tarqalgan holat — IT qo'llab-quvvatlash xizmatiga boshqa past imtiyozli foydalanuvchilarning parollarini tiklash huquqini berishdir. Bizning tashkiliy sxemamizga ko'ra, Fillip IT qo'llab-quvvatlash xizmatiga mas'ul, shuning uchun biz Sales (Savdo), Marketing va Management (Boshqaruv) OUlari ustidan parollarni tiklash nazoratini unga topshiramiz.</P>
      <P>OU ustidan nazoratni delegatsiya qilish uchun:</P>
      <div style={{display:"flex",flexDirection:"column",gap:10,margin:"14px 0"}}>
        {[
          {n:"1",t:"OUga o'ng tugma bosing",d:'ADUC da maqsadli OUga o\'ng tugma → "Delegate Control…"'},
          {n:"2",t:"Foydalanuvchini qo'shing",d:'Add → foydalanuvchi nomini kiriting (masalan "phillip") → Ismlarni tekshirish → OK.'},
          {n:"3",t:"Vazifani tanlang",d:'"Reset user passwords and force password change at next logon" → Keyingi → Tayyor.'},
        ].map((s,i)=>(
          <div key={i} style={{display:"flex",gap:14,alignItems:"flex-start",padding:"12px 14px",background:"var(--bg-2)",border:"1px solid var(--border)",borderRadius:8}}>
            <div style={{minWidth:28,height:28,borderRadius:"50%",background:"var(--c-auth)",display:"grid",placeItems:"center",fontFamily:"var(--font-mono)",fontSize:12,fontWeight:700,color:"var(--bg-1)",flexShrink:0}}>{s.n}</div>
            <div><div style={{fontWeight:600,fontSize:13,color:"var(--text-0)",marginBottom:3}}>{s.t}</div><div style={{fontSize:12,color:"var(--text-2)",lineHeight:1.6}}>{s.d}</div></div>
          </div>
        ))}
      </div>
      <P>Delegatsiyadan so'ng Fillip savdo bo'limidagi istalgan foydalanuvchi uchun parollarni qayta tiklay oladi. Biroq u ADUC ni ochish huquqiga ega emas — shuning uchun parolni qayta tiklash uchun PowerShell dan foydalanish kerak:</P>
      <div style={{background:"var(--surface-2)",borderRadius:8,padding:"12px 16px",fontFamily:"var(--font-mono)",fontSize:12,lineHeight:1.9,margin:"10px 0"}}>
        <span style={{color:"var(--text-3)"}}># Parolni tiklash</span><br/>
        <span style={{color:"var(--text-2)"}}>Set-ADAccountPassword</span> sophie -Reset -NewPassword (<span style={{color:"var(--text-2)"}}>Read-Host</span> -AsSecureString -Prompt <span style={{color:"var(--accent)"}}>'Yangi Parol'</span>)<br/><br/>
        <span style={{color:"var(--text-3)"}}># Keyingi kirishda parol o'zgartirishni majburlash</span><br/>
        <span style={{color:"var(--text-2)"}}>Set-ADUser</span> -ChangePasswordAtLogon <span style={{color:"var(--c-warn)"}}>$true</span> -Identity sophie
      </div>
      <SlideImg src="./assets/ad/d1b29bad-Managing_users_in_AD_s7_p1.png" caption={"ADUC kontekst menyusidagi \"Delegate Control…\" opsiyasi"} />
      <SlideImg src="./assets/ad/d1b29bad-Managing_users_in_AD_s8_p1.png" caption="Delegatsiya ustasi — delegatsiya qilinadigan foydalanuvchini qo'shish" />
      <SlideImg src="./assets/ad/d1b29bad-Managing_users_in_AD_s9_p1.png" caption="Delegatsiya ustasi — vazifani tanlash (parollarni tiklash)" />
      <SlideImg src="./assets/ad/d1b29bad-Managing_users_in_AD_s10_p1.png" caption="AD hisob parollarini tiklash uchun PowerShell buyruqlari" />
      <SlideImg src="./assets/ad/d1b29bad-Managing_users_in_AD_s11_p1.png" caption="PowerShell — Set-ADAccountPassword bajarilishi natijasi" />
      <SlideImg src="./assets/ad/d1b29bad-Managing_users_in_AD_s11_p3.png" caption="PowerShell — Set-ADUser majburiy parol o'zgartirish natijasi" />

      <H2 num="§5" uz="AD da Kompyuterlarni Boshqarish" en="" />
      <P>Standart holda, domenga qo'shilgan barcha mashinalar (DClardan tashqari) <Term>Computers</Term> deb nomlangan konteynerga joylashtiriladi. Barcha qurilmalarimizning u yerda bo'lishi eng yaxshi yechim emas, chunki serverlaringiz va oddiy foydalanuvchilar kundalik foydalanadigan mashinalar uchun turli xil siyosatlarni xohlashingiz ehtimoli juda yuqori.</P>
      <P>Qurilmalaringizni qanday tashkil qilish bo'yicha qat'iy qoida mavjud bo'lmasa-da, qurilmalarni ulardan foydalanish maqsadiga ko'ra ajratish ajoyib boshlang'ich nuqta hisoblanadi. Umuman olganda, qurilmalar kamida quyidagi uchta toifaga bo'linadi:</P>
      <div style={{display:"grid",gridTemplateColumns:"1fr",gap:10,margin:"14px 0"}}>
        {[
          {t:"Ishchi Stansiyalar (Workstations)",c:"var(--accent)",d:"Active Directory domenidagi eng keng tarqalgan qurilmalardan biri. Domendagi har bir foydalanuvchi, ehtimol, ishchi stansiyaga tizimga kiradi — bu ular o'z ishlarini bajarish yoki oddiy brauzer faoliyatini amalga oshirish uchun foydalanadigan qurilmadir. Bu qurilmalarga hech qachon yuqori imtiyozli foydalanuvchi tizimga kirmasligi kerak."},
          {t:"Serverlar (Servers)",c:"var(--c-auth)",d:"Active Directory domenidagi ikkinchi eng keng tarqalgan qurilma. Serverlar odatda foydalanuvchilarga yoki boshqa serverlarga xizmat ko'rsatish uchun ishlatiladi (fayl serverlari, veb serverlar, print serverlar). Ishchi stansiyalarga qaraganda qattiqroq siyosat talab etiladi."},
          {t:"Domen Kontrollerlari (Domain Controllers)",c:"var(--c-attack)",d:"Active Directory domenidagi uchinchi toifa — va eng nozik mashinalar. Domen kontrollerlari muhitdagi barcha foydalanuvchi hisoblarining xeshlangan parollarini o'z ichiga oladi. Ushbu qurilmalar ko'pincha tarmoqdagi eng muhim qurilmalar hisoblanadi. Kirishni jiddiy cheklash shart."},
        ].map((card,i)=>(
          <div key={i} style={{padding:14,background:`${card.c}08`,border:`1px solid ${card.c}30`,borderRadius:10}}>
            <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:card.c,marginBottom:6}}>{card.t}</div>
            <div style={{fontSize:12,color:"var(--text-1)",lineHeight:1.6}}>{card.d}</div>
          </div>
        ))}
      </div>
      <SlideImg src="./assets/ad/d1b29bad-Managing_users_in_AD_s12_p2.png" caption="ADUC dagi standart Computers konteyneri — yangi qo'shilgan barcha mashinalar shu yerga tushadi" />

      <H2 num="§6" uz="Kompyuterlarni OUlarga Joylashtirish" en="" />
      <P>AD ni tartibga solayotganimiz sababli, Ishchi stansiyalar va Serverlar uchun ikkita alohida OU yarataylik (Domen kontrollerlari allaqachon Windows tomonidan yaratilgan OU ichida joylashgan). Biz ularni to'g'ridan-to'g'ri domen konteyneri ostida yaratamiz. Yakunda sizda quyidagi OU tuzilmasi bo'lishi kerak.</P>
      <P>Kompyuter ob'ektini ko'chirish: ADUC da Computers konteyneridan mashinani toping → o'ng tugma → Ko'chirish → maqsadli OUni tanlang. Shaxsiy kompyuterlar va noutbuklarni <Em>Workstations</Em> OUga, serverlarni esa <Em>Servers</Em> OUga ko'chiring. Ko'chirilgandan so'ng, OUga tayinlangan Group Policy keyingi yangilanishda (<code>gpupdate /force</code>) o'sha mashinaga qo'llanadi. Bu bizga keyinchalik har bir OU uchun siyosatlarni sozlash imkonini beradi.</P>
      <Callout color="var(--c-warn)" icon="info" titleUz="Xavfsizlik foydasi" titleEn="">
        Workstations va Servers ni ajratish serverlarga qattiqroq siyosat qo'llash imkonini beradi: USB qurilmalarni bloklash, interaktiv kirishni cheklash, turli parol siyosatini qo'llash va internet kirishni cheklash.
      </Callout>
      <SlideImg src="./assets/ad/d1b29bad-Managing_users_in_AD_s14_p0.png" caption="Qayta tashkillashtirilgandan so'nggi OU tuzilmasi — domen ildizi ostida Workstations va Servers OUlari" />
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Text helpers
// ─────────────────────────────────────────────────────────────
function SlideImg({ src, caption }) {
  return (
    <div style={{ margin: "18px 0", textAlign: "center" }}>
      <img src={src} alt={caption || ""} style={{ maxWidth: "100%", borderRadius: 8, border: "1px solid var(--border)", display: "block", margin: "0 auto" }} />
      {caption && <div style={{ marginTop: 7, fontSize: 11, color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>{caption}</div>}
    </div>
  );
}
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
  const [hov, setHov] = useLS(false);
  const text = typeof children === "string" ? children
    : Array.isArray(children) ? children.map(c => typeof c === "string" ? c : "").join("") : String(children);
  return (
    <span style={{ position: "relative", display: "inline" }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}>
      <span style={{ color: "var(--accent)", fontWeight: 600, borderBottom: "1px dotted var(--accent-border)", cursor: "help" }}>{children}</span>
      {hov && (
        <span
          onClick={e => { e.stopPropagation(); e.preventDefault(); if (window._termAIOpen) window._termAIOpen(text); }}
          style={{
            position: "absolute", top: -9, right: -13,
            width: 17, height: 17, borderRadius: "50%",
            background: "var(--accent)", color: "#04060d",
            fontSize: 10, fontWeight: 800,
            cursor: "pointer",
            boxShadow: "0 2px 10px rgba(0,255,136,0.5)",
            zIndex: 200, userSelect: "none", display: "grid", placeItems: "center",
          }}
        >?</span>
      )}
    </span>
  );
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
