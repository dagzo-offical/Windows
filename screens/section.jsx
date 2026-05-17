// section.jsx — Windows Academy multi-phase learning path

const ALL_PHASES = {
  1: {
    uz: "Windows Asoslari", en: "Windows Fundamentals",
    descUz: "OS asoslari, o'rnatish, foydalanuvchi interfeysi, fayl tizimi, tarmoq va xavfsizlik asoslarini GUI-first yondashuvida o'rganasiz. IT karerani boshlash uchun ideal.",
    descEn: "Learn OS basics, installation, user interface, file system, networking and security fundamentals with a GUI-first approach. Ideal starting point for IT careers.",
    color: "var(--c-system)", badge: "PHASE 1", icon: "desktop", difficulty: "Beginner",
    outcomes: {
      uz: ["Windows interfeysi va asosiy vositalarni erkin ishlatish","Disk tuzilishi va GPT/MBR farqini tushunish","Tarmoq sozlash va muammolarni hal qilish","Xavfsizlik asoslarini amalda qo'llash","Zaxiralash va tiklash tizimini sozlash"],
      en: ["Navigate Windows GUI and core tools fluently","Understand disk structure and GPT vs MBR","Configure networking and troubleshoot issues","Apply security fundamentals in practice","Set up backup and recovery systems"],
    },
    lessons: [
      { n:1,  uz:"Windows nima?",            en:"What is Windows?",         duration:15, icon:"cpu",      labs:1, diagrams:3 },
      { n:2,  uz:"Windows versiyalari",       en:"Windows Versions",         duration:18, icon:"layers",   labs:0, diagrams:4 },
      { n:3,  uz:"Windows o'rnatish",         en:"Windows Installation",     duration:25, icon:"download", labs:2, diagrams:5 },
      { n:4,  uz:"GPT vs MBR",               en:"GPT vs MBR",               duration:20, icon:"disk",     labs:1, diagrams:3 },
      { n:5,  uz:"Ish stoli muhiti",          en:"Desktop Environment",      duration:15, icon:"desktop",  labs:1, diagrams:2 },
      { n:6,  uz:"File Explorer",            en:"File Explorer",            duration:18, icon:"folder",   labs:2, diagrams:3 },
      { n:7,  uz:"Vazifalar Menejeri",        en:"Task Manager",             duration:20, icon:"graph",    labs:1, diagrams:3 },
      { n:8,  uz:"Qurilma Menejeri",          en:"Device Manager",           duration:18, icon:"cpu",      labs:1, diagrams:2 },
      { n:9,  uz:"Foydalanuvchi hisoblari",   en:"User Accounts",            duration:20, icon:"user",     labs:2, diagrams:3 },
      { n:10, uz:"Fayllar va Ruxsatlar",      en:"Files & Permissions",      duration:22, icon:"shield",   labs:2, diagrams:3 },
      { n:11, uz:"Windows Update",           en:"Windows Update",           duration:15, icon:"refresh",  labs:1, diagrams:2 },
      { n:12, uz:"Windows Defender asoslari",en:"Windows Defender Basics",  duration:20, icon:"shield",   labs:2, diagrams:3 },
      { n:13, uz:"Tarmoq asoslari",          en:"Networking Basics",        duration:25, icon:"network",  labs:2, diagrams:4 },
      { n:14, uz:"Fayl va Printer almashish",en:"File & Printer Sharing",   duration:20, icon:"share",    labs:2, diagrams:3 },
      { n:15, uz:"Zaxiralash va tiklash",    en:"Backup & Restore",         duration:22, icon:"backup",   labs:2, diagrams:3 },
    ],
  },
  2: {
    uz: "Windows Administratsiya", en: "Windows Administration",
    descUz: "Tizim boshqaruvchi sifatida: servislar, event log, registry, PowerShell, remote access, Firewall va BitLocker. Real enterprise workflow.",
    descEn: "Work as a system administrator: services, event log, registry, PowerShell, remote access, Firewall and BitLocker. Real enterprise workflow.",
    color: "var(--c-warn)", badge: "PHASE 2", icon: "settings", difficulty: "Intermediate",
    outcomes: {
      uz: ["Servislar va event loglarni professional boshqarish","Registry tuzilishini va muhim kalitlarni bilish","PowerShell orqali tizimni avtomatlashtirish","Remote Desktop va BitLocker sozlash","Firewall qoidalarini yaratish va boshqarish"],
      en: ["Professionally manage services and event logs","Know registry structure and critical keys","Automate system management with PowerShell","Configure Remote Desktop and BitLocker","Create and manage Firewall rules"],
    },
    lessons: [
      { n:16, uz:"Servislar",                  en:"Services",                 duration:30, icon:"settings", labs:2, diagrams:6 },
      { n:17, uz:"Event Viewer",               en:"Event Viewer",             duration:24, icon:"eye",      labs:2, diagrams:4 },
      { n:18, uz:"Task Scheduler",             en:"Task Scheduler",           duration:22, icon:"clock",    labs:1, diagrams:4 },
      { n:19, uz:"Registry",                   en:"Windows Registry",         duration:38, icon:"database", labs:3, diagrams:8 },
      { n:20, uz:"System Configuration",       en:"System Configuration",     duration:24, icon:"code",     labs:2, diagrams:4 },
      { n:21, uz:"Kengaytirilgan Sozlamalar",  en:"Advanced System Settings", duration:30, icon:"layers",   labs:2, diagrams:5 },
      { n:22, uz:"Kompyuter Boshqaruvi",       en:"Computer Management",      duration:32, icon:"shield",   labs:2, diagrams:6 },
      { n:23, uz:"Resource Monitor",           en:"Resource Monitor",         duration:28, icon:"graph",    labs:2, diagrams:5 },
      { n:24, uz:"Settings va Control Panel",  en:"Settings & Control Panel", duration:26, icon:"settings", labs:2, diagrams:5 },
      { n:25, uz:"PowerShell asoslari",        en:"PowerShell Basics",        duration:30, icon:"terminal", labs:3, diagrams:4 },
      { n:26, uz:"Remote Desktop",             en:"Remote Desktop",           duration:22, icon:"desktop",  labs:2, diagrams:3 },
      { n:27, uz:"Windows Firewall",           en:"Windows Firewall",         duration:24, icon:"shield",   labs:2, diagrams:4 },
      { n:28, uz:"BitLocker",                  en:"BitLocker",                duration:26, icon:"lock",     labs:2, diagrams:4 },
    ],
  },
  3: {
    uz: "Windows Server", en: "Windows Server",
    descUz: "Windows Server 2019/2022/2025: Active Directory, DNS, DHCP, Group Policy, IIS va enterprise infratuzilmasi.",
    descEn: "Windows Server 2019/2022/2025: Active Directory, DNS, DHCP, Group Policy, IIS and enterprise infrastructure.",
    color: "var(--c-auth)", badge: "PHASE 3", icon: "server", difficulty: "Intermediate",
    outcomes: {
      uz: ["Windows Server o'rnatish va sozlash","Active Directory va OU tuzilmasini boshqarish","DNS, DHCP serverlarini sozlash","Group Policy orqali sozlamalarni tarqatish","IIS va WSUS ni boshqarish"],
      en: ["Install and configure Windows Server","Manage Active Directory and OU structure","Configure DNS and DHCP servers","Deploy settings via Group Policy","Manage IIS and WSUS"],
    },
    lessons: [
      { n:29, uz:"Windows Server kirish",    en:"Windows Server Intro",     duration:25, icon:"server",   labs:1, diagrams:4 },
      { n:30, uz:"Server Manager",           en:"Server Manager",           duration:20, icon:"settings", labs:1, diagrams:3 },
      { n:31, uz:"Active Directory",         en:"Active Directory",         duration:40, icon:"network",  labs:3, diagrams:7 },
      { n:32, uz:"DNS Server",               en:"DNS Server",               duration:28, icon:"network",  labs:2, diagrams:5 },
      { n:33, uz:"DHCP Server",              en:"DHCP Server",              duration:22, icon:"network",  labs:2, diagrams:4 },
      { n:34, uz:"OU tuzilmasi",             en:"OU Structure",             duration:20, icon:"layers",   labs:2, diagrams:4 },
      { n:35, uz:"Group Policy",             en:"Group Policy",             duration:35, icon:"shield",   labs:3, diagrams:6 },
      { n:36, uz:"Fayl Server",              en:"File Server",              duration:24, icon:"folder",   labs:2, diagrams:4 },
      { n:37, uz:"IIS Web Server",           en:"IIS Web Server",           duration:26, icon:"network",  labs:2, diagrams:4 },
      { n:38, uz:"WSUS",                     en:"WSUS",                     duration:20, icon:"refresh",  labs:1, diagrams:3 },
      { n:39, uz:"Hyper-V",                  en:"Hyper-V",                  duration:30, icon:"layers",   labs:2, diagrams:5 },
      { n:40, uz:"Server monitoring",        en:"Server Monitoring",        duration:22, icon:"graph",    labs:2, diagrams:4 },
      { n:41, uz:"Server zaxiralash",        en:"Server Backup",            duration:20, icon:"backup",   labs:1, diagrams:3 },
    ],
  },
  4: {
    uz: "Windows Xavfsizligi", en: "Windows Security",
    descUz: "Autentifikatsiya protokollari, Defender, Firewall, AppLocker, xavfsizlik loglari, tahdid aniqlash va hodisalarga javob berish.",
    descEn: "Authentication protocols, Defender, Firewall, AppLocker, security logging, threat detection and incident response.",
    color: "var(--c-err)", badge: "PHASE 4", icon: "shield", difficulty: "Advanced",
    outcomes: {
      uz: ["NTLM va Kerberos protokollarini chuqur tushunish","Microsoft Defender ilg'or sozlamalarini boshqarish","AppLocker va WDAC siyosatlarini yaratish","Xavfsizlik hodisalarini aniqlash va tahlil qilish","Hodisalarga javob berish jarayonini amalga oshirish"],
      en: ["Deeply understand NTLM and Kerberos protocols","Configure advanced Microsoft Defender settings","Create AppLocker and WDAC policies","Detect and analyze security incidents","Execute incident response procedures"],
    },
    lessons: [
      { n:42, uz:"Autentifikatsiya",          en:"Authentication",           duration:28, icon:"user",     labs:2, diagrams:4 },
      { n:43, uz:"NTLM protokoli",            en:"NTLM Protocol",            duration:24, icon:"network",  labs:1, diagrams:4 },
      { n:44, uz:"Kerberos",                  en:"Kerberos",                 duration:30, icon:"shield",   labs:2, diagrams:5 },
      { n:45, uz:"Defender ilg'or",           en:"Defender Advanced",        duration:28, icon:"shield",   labs:2, diagrams:4 },
      { n:46, uz:"Firewall ilg'or",           en:"Firewall Advanced",        duration:24, icon:"shield",   labs:2, diagrams:4 },
      { n:47, uz:"AppLocker va WDAC",         en:"AppLocker & WDAC",         duration:28, icon:"lock",     labs:2, diagrams:4 },
      { n:48, uz:"Xavfsizlik loglari",        en:"Security Logging",         duration:28, icon:"graph",    labs:2, diagrams:5 },
      { n:49, uz:"UAC",                       en:"User Account Control",     duration:28, icon:"shield",   labs:2, diagrams:5 },
      { n:50, uz:"Secure Boot va TPM",        en:"Secure Boot & TPM",        duration:30, icon:"lock",     labs:1, diagrams:5 },
      { n:51, uz:"Hodisalarga javob",         en:"Incident Response",        duration:30, icon:"eye",      labs:2, diagrams:4 },
    ],
  },
  5: {
    uz: "Windows Internallari", en: "Windows Internals",
    descUz: "Kernel, syscall, jarayonlar, thread'lar, handle'lar, fayl tizimlari va boot jarayonini chuqur o'rganasiz. Windows ning ichki qurilishi.",
    descEn: "Deep dive into kernel, syscalls, processes, threads, handles, file systems and boot process. The inner workings of Windows.",
    color: "#b48cff", badge: "PHASE 5", icon: "cpu", difficulty: "Expert",
    outcomes: {
      uz: ["Kernel arxitekturasini va Executive quyi tizimlarini tushunish","Syscall oqimini ring 3 dan ring 0 gacha kuzatish","EPROCESS/ETHREAD tuzilmalarini tahlil qilish","NTFS MFT, atributlar va ADS ni tushunish","Boot zanjirini UEFI dan Login ekraniga kuzatish"],
      en: ["Understand kernel architecture and Executive subsystems","Trace syscall flow from ring 3 to ring 0","Analyze EPROCESS/ETHREAD structures","Understand NTFS MFT, attributes and ADS","Trace boot chain from UEFI to login screen"],
    },
    lessons: [
      { n:52, uz:"Windows arxitekturasi",      en:"Windows Architecture",     duration:36, icon:"cpu",      labs:3, diagrams:9 },
      { n:53, uz:"Kernel internallari",         en:"Kernel Internals",         duration:34, icon:"layers",   labs:2, diagrams:7 },
      { n:54, uz:"User mode vs Kernel mode",   en:"User Mode vs Kernel Mode", duration:32, icon:"shield",   labs:2, diagrams:7 },
      { n:55, uz:"Boot jarayoni chuqur",       en:"Boot Process Deep",        duration:36, icon:"play",     labs:2, diagrams:8 },
      { n:56, uz:"BIOS vs UEFI",               en:"BIOS vs UEFI",             duration:22, icon:"cpu",      labs:1, diagrams:5 },
      { n:57, uz:"Jarayonlar va Thread'lar",   en:"Processes & Threads",      duration:36, icon:"spark",    labs:3, diagrams:7 },
      { n:58, uz:"Handle'lar va Ob'ektlar",    en:"Handles & Objects",        duration:24, icon:"key",      labs:1, diagrams:5 },
      { n:59, uz:"Fayl tizimlari chuqur",      en:"File Systems Deep",        duration:36, icon:"database", labs:2, diagrams:8 },
      { n:60, uz:"GUI arxitekturasi",          en:"GUI Architecture",         duration:26, icon:"layers",   labs:2, diagrams:6 },
    ],
  },
  6: {
    uz: "Advanced Red Team", en: "Advanced Red Team",
    descUz: "DLL injection, UAC bypass, credential dumping, persistence, lateral movement. OSCP, CRTO darajasidagi ilg'or hujum texnikalari.",
    descEn: "DLL injection, UAC bypass, credential dumping, persistence, lateral movement. OSCP/CRTO-level advanced offensive techniques.",
    color: "var(--c-attack)", badge: "PHASE 6", icon: "target", difficulty: "Expert",
    outcomes: {
      uz: ["DLL injection va hijacking texnikalarini tushunish","UAC bypass metodlarini tahlil qilish","Credential dumping va PtH texnikalarini o'rganish","Persistence mexanizmlarini aniqlash va o'rnatish","Windows API dan malware darajasida foydalanish"],
      en: ["Understand DLL injection and hijacking techniques","Analyze UAC bypass methods","Study credential dumping and PtH techniques","Detect and establish persistence mechanisms","Leverage Windows API at malware level"],
    },
    lessons: [
      { n:61, uz:"DLL va Injection",            en:"DLL & Injection",          duration:32, icon:"code",     labs:2, diagrams:6 },
      { n:62, uz:"Windows API ilg'or",          en:"Windows API Advanced",     duration:30, icon:"code",     labs:2, diagrams:5 },
      { n:63, uz:"UAC bypass",                  en:"UAC Bypass Techniques",    duration:32, icon:"shield",   labs:2, diagrams:5 },
      { n:64, uz:"Credential Attacks",          en:"Credential Attacks",       duration:34, icon:"user",     labs:2, diagrams:5 },
      { n:65, uz:"Event Log Forensics",         en:"Event Log Forensics",      duration:28, icon:"eye",      labs:2, diagrams:4 },
      { n:66, uz:"Registry Persistence",        en:"Registry Persistence",     duration:30, icon:"database", labs:2, diagrams:5 },
      { n:67, uz:"Servis Persistence",          en:"Service Persistence",      duration:28, icon:"settings", labs:2, diagrams:5 },
      { n:68, uz:"Task Scheduler Persistence",  en:"Task Scheduler Persistence",duration:24,icon:"clock",   labs:1, diagrams:4 },
      { n:69, uz:"Windows Logs Forensics",      en:"Windows Logs Forensics",   duration:28, icon:"graph",    labs:2, diagrams:5 },
    ],
  },
};

function SectionScreen({ setRoute, user, onOpenProfile, section = 1 }) {
  const lang = useLang();
  const [selPhase, setSelPhase] = useLS(1);
  const completed = user?.completedLessons || [];
  const phase = ALL_PHASES[selPhase] || ALL_PHASES[1];

  const lessonList = phase.lessons.map((l) => {
    const key = `s01_l${String(l.n).padStart(2,"0")}`;
    const isDone = completed.includes(key);
    const prevKey = l.n === 1 ? null : `s01_l${String(l.n-1).padStart(2,"0")}`;
    const prevDone = l.n === 1 || completed.includes(prevKey);
    const status = isDone ? "done" : "available";
    return { ...l, status, color: phase.color };
  });

  const totalLessons = Object.values(ALL_PHASES).reduce((s,p)=>s+p.lessons.length,0);
  const totalDone = completed.length;
  const phaseDone = lessonList.filter(l=>l.status==="done").length;

  return (
    <div>
      <TopNav route={{ name: "section" }} setRoute={setRoute} user={user} onOpenProfile={onOpenProfile}
        crumb={[
          { label: lang === "en" ? "Courses" : "Kurslar", onClick: () => setRoute({ name: "dashboard" }) },
          { label: lang === "en" ? "Windows Academy" : "Windows Akademiyasi" },
        ]}
      />

      <div className="page">
        {/* ACADEMY HEADER */}
        <div style={{
          borderRadius: 24, overflow: "hidden", padding: "36px 44px 32px",
          background: "linear-gradient(135deg, rgba(0,212,255,0.06), var(--bg-2) 60%)",
          border: "1px solid rgba(0,212,255,0.2)", marginBottom: 28,
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "start" }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--accent)", marginBottom: 12 }}>// WINDOWS_ACADEMY · FULL_CURRICULUM</div>
              <h1 className="display" style={{ fontSize: 38, margin: "0 0 8px" }}>Windows Professional Track</h1>
              <p style={{ color: "var(--text-1)", fontSize: 13.5, lineHeight: 1.65, maxWidth: 600, margin: "12px 0 0" }}>
                {lang === "en"
                  ? "Complete path from Windows basics to red team operations. 69 lessons across 6 phases — Fundamentals → Administration → Server → Security → Internals → Red Team."
                  : "Windows asoslaridan red team operatsiyalarigacha to'liq yo'l. 6 fazada 69 dars — Asoslar → Administratsiya → Server → Xavfsizlik → Internals → Red Team."}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 200 }}>
              <MiniStat labelUz="Jami darslar" labelEn="Total lessons" value={totalLessons} sub={`${totalDone} ${lang==="en"?"done":"yakunlandi"}`} color="var(--accent)" icon="book" />
              <MiniStat labelUz="Fazalar" labelEn="Phases" value="6" sub={lang==="en"?"Beginner → Expert":"Boshlang'ich → Ekspert"} color="var(--c-warn)" icon="layers" />
            </div>
          </div>
        </div>

        {/* PHASE TABS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 8, marginBottom: 24 }}>
          {Object.entries(ALL_PHASES).map(([num, ph]) => {
            const pNum = parseInt(num);
            const phDone = completed.filter(k => ph.lessons.some(l => k === `s01_l${String(l.n).padStart(2,"0")}`)).length;
            const isSelected = selPhase === pNum;
            return (
              <button key={num} onClick={() => setSelPhase(pNum)} style={{
                padding: "12px 8px", borderRadius: 12, border: `2px solid ${isSelected ? ph.color : ph.color+"33"}`,
                background: isSelected ? ph.color+"14" : "var(--surface)", cursor: "pointer",
                transition: "all 200ms", textAlign: "center",
              }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: isSelected ? ph.color : "var(--text-3)", letterSpacing: 1, marginBottom: 4 }}>{ph.badge}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: isSelected ? ph.color : "var(--text-1)", lineHeight: 1.3 }}>{lang === "en" ? ph.en : ph.uz}</div>
                <div style={{ fontSize: 10, color: "var(--text-3)", marginTop: 4, fontFamily: "var(--font-mono)" }}>{phDone}/{ph.lessons.length}</div>
              </button>
            );
          })}
        </div>

        {/* SELECTED PHASE CONTENT */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 24, alignItems: "start" }}>
          <div>
            {/* Phase header */}
            <div style={{
              borderRadius: 16, padding: "24px 28px", marginBottom: 20,
              background: `linear-gradient(135deg, ${phase.color}0a, var(--bg-2) 70%)`,
              border: `1px solid ${phase.color}33`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20 }}>
                <div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: phase.color, fontWeight: 700, letterSpacing: 1 }}>{phase.badge}</span>
                    <span className="chip" style={{ fontSize: 9.5, background: phase.color+"15", color: phase.color, border: `1px solid ${phase.color}33` }}>{lang==="en"?phase.difficulty:phase.difficulty==="Beginner"?"Boshlang'ich":phase.difficulty==="Intermediate"?"O'rta daraja":phase.difficulty==="Advanced"?"Ilg'or":"Ekspert"}</span>
                  </div>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, margin: "0 0 8px" }}>{lang === "en" ? phase.en : phase.uz}</h2>
                  <p style={{ fontSize: 13, color: "var(--text-1)", margin: 0, lineHeight: 1.6, maxWidth: 520 }}>{lang === "en" ? phase.descEn : phase.descUz}</p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: phase.color, fontFamily: "var(--font-display)" }}>{phaseDone}/{phase.lessons.length}</div>
                  <div style={{ fontSize: 11, color: "var(--text-2)", fontFamily: "var(--font-mono)" }}>{lang==="en"?"completed":"yakunlandi"}</div>
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <Progress value={phaseDone} max={phase.lessons.length} label={lang==="en"?"Phase progress":"Faza taraqqiyoti"} color={phase.color} />
              </div>
            </div>

            {/* Lesson list */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {lessonList.map((l, i) => (
                <LessonRow key={l.n} l={l} idx={i} sectionNum={1} setRoute={setRoute} />
              ))}
            </div>
          </div>

          <aside style={{ position: "sticky", top: 90, display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Instructor */}
            <div className="glass" style={{ padding: 20 }}>
              <div className="eyebrow" style={{ marginBottom: 12 }}>// INSTRUCTOR</div>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg, #00ff88, #0af, #a855f7)", padding: 2, boxShadow: "0 0 16px rgba(0,255,136,0.3)" }}>
                    <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#04060d", display: "grid", placeItems: "center" }}>
                      <span style={{ background: "linear-gradient(135deg, #00ff88, #0af)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontSize: 11, fontWeight: 900, letterSpacing: "0.06em", fontFamily: "var(--font-mono)" }}>DAGZO</span>
                    </div>
                  </div>
                  <div style={{ position: "absolute", bottom: 1, right: 1, width: 11, height: 11, borderRadius: "50%", background: "#00ff88", border: "2px solid #04060d", boxShadow: "0 0 6px #00ff88" }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>Dagzo</div>
                  <div style={{ fontSize: 11, color: "var(--c-system)", fontWeight: 600, marginBottom: 2 }}>Senior Red Team Operator</div>
                  <div style={{ fontSize: 10.5, color: "var(--text-3)", lineHeight: 1.4 }}>Former Fortune 500 defender · OSCP, CRTO, CRTP</div>
                </div>
              </div>
            </div>

            {/* Outcomes */}
            <div className="glass" style={{ padding: 20 }}>
              <div className="eyebrow" style={{ marginBottom: 12 }}>// YOU_WILL_LEARN</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 9 }}>
                {(lang === "en" ? phase.outcomes.en : phase.outcomes.uz).map((t, i) => (
                  <li key={i} style={{ display: "flex", gap: 8, fontSize: 12, lineHeight: 1.5 }}>
                    <span style={{ color: phase.color, flexShrink: 0, marginTop: 2 }}><Icon name="check" size={11} /></span>
                    <span style={{ color: "var(--text-0)" }}>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* All phases mini overview */}
            <div className="glass" style={{ padding: 20 }}>
              <div className="eyebrow" style={{ marginBottom: 12 }}>// ALL_PHASES</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {Object.entries(ALL_PHASES).map(([num, ph]) => {
                  const pNum = parseInt(num);
                  const phDone = completed.filter(k => ph.lessons.some(l => k === `s01_l${String(l.n).padStart(2,"0")}`)).length;
                  return (
                    <div key={num} onClick={() => setSelPhase(pNum)} style={{ display: "flex", gap: 10, alignItems: "center", padding: "6px 8px", borderRadius: 7, cursor: "pointer", background: selPhase === pNum ? ph.color+"10" : "transparent", border: `1px solid ${selPhase===pNum?ph.color+"33":"transparent"}`, transition: "all 150ms" }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: ph.color, flexShrink: 0 }} />
                      <div style={{ flex: 1, fontSize: 11, color: selPhase===pNum?ph.color:"var(--text-1)", fontWeight: selPhase===pNum?700:400 }}>{lang==="en"?ph.en:ph.uz}</div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)" }}>{phDone}/{ph.lessons.length}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function LessonRow({ l, idx, sectionNum, setRoute }) {
  const lang = useLang();
  const isDone = l.status === "done";
  const isActive = l.status === "available" && idx === 0;

  return (
    <div onClick={() => setRoute({ name: "lesson", section: sectionNum, lesson: l.n })}
      style={{
        display: "grid", gridTemplateColumns: "auto 40px 1fr auto auto",
        gap: 16, alignItems: "center", padding: "14px 18px",
        borderRadius: 10, cursor: "pointer",
        background: isActive ? `${l.color}08` : "transparent",
        border: `1px solid ${isActive ? l.color + "33" : "transparent"}`,
        borderLeft: `2px solid ${isActive ? l.color : isDone ? l.color+"66" : "transparent"}`,
        transition: "all 180ms", marginBottom: 3,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = isDone ? `${l.color}08` : "var(--surface)"; e.currentTarget.style.borderColor = l.color + "33"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = isActive ? `${l.color}08` : "transparent"; e.currentTarget.style.borderColor = isActive ? l.color + "33" : isDone ? "transparent" : "transparent"; }}>

      <div className="mono" style={{ fontSize: 11, color: "var(--text-3)", minWidth: 36 }}>L{String(l.n).padStart(2,"0")}</div>

      <div style={{
        width: 36, height: 36, borderRadius: 8,
        background: isDone ? l.color : `${l.color}12`,
        border: `1px solid ${l.color + "44"}`,
        color: isDone ? "#04060d" : l.color,
        display: "grid", placeItems: "center",
        boxShadow: isActive ? `0 0 14px ${l.color}44` : "none",
      }}>
        <Icon name={isDone ? "check" : l.icon} size={15} />
      </div>

      <div>
        <div style={{ fontWeight: 600, fontSize: 14.5, lineHeight: 1.3, marginBottom: 2 }}>{lang === "en" ? l.en : l.uz}</div>
      </div>

      <div className="mono" style={{ fontSize: 11, color: "var(--text-2)", display: "flex", gap: 12 }}>
        <span title="Duration"><Icon name="clock" size={11} /> {l.duration}m</span>
        <span title="Labs"><Icon name="terminal" size={11} /> {l.labs}</span>
        <span title="Diagrams"><Icon name="graph" size={11} /> {l.diagrams}</span>
      </div>

      <Icon name="chevron-right" size={16} style={{ color: "var(--text-3)" }} />
    </div>
  );
}

function MiniStat({ labelUz, labelEn, value, sub, color, icon }) {
  const lang = useLang();
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: color + "12", border: `1px solid ${color}33`, color, display: "grid", placeItems: "center", flexShrink: 0 }}>
        <Icon name={icon} size={14} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: "var(--text-2)", letterSpacing: 0.1, textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>{lang === "en" ? labelEn : labelUz}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 20, fontFamily: "var(--font-display)", fontWeight: 600, color }}>{value}</span>
          <span style={{ fontSize: 10.5, color: "var(--text-3)" }}>{sub}</span>
        </div>
      </div>
    </div>
  );
}

window.SectionScreen = SectionScreen;
