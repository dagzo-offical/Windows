// section.jsx — section / course overview (default: Section 01 Windows Fundamentals)

const SECTION_DATA = {
  1: {
    num: "01",
    uz: "Windows asoslari",
    en: "Windows Internals & Architecture",
    descUz: "Ushbu bo'limda Windows operatsion tizimining ichki tuzilishini chuqur o'rganasiz: arxitektura qatlamlari, kernel, processlar, registry va boot jarayoni. Har bir tushuncha kelajakdagi xavfsizlik bo'limlari uchun zarur fundament.",
    descEn: "In this section you'll deeply explore Windows internals: architecture layers, kernel, processes, registry and boot process. Each concept is the bedrock for future security sections.",
    color: "var(--c-system)",
    duration: "~36 soat",
    durationEn: "~36 hrs",
    difficulty: "foundational",
    instructorUz: "Aziz R. — Senior Red Team Operator",
    instructorEn: "Former defender of a Fortune 500 enterprise · OSCP, CRTO, CRTP",
    outcomesUz: [
      "Windows arxitekturasini qatlamma-qatlam chizib bera olish",
      "Kernel mode va user mode farqini chuqur tushunish",
      "Boot ketma-ketligini har bir bosqichi bilan ko'rsatish",
      "Processlar, thread'lar va handle'larni real holatda tahlil qilish",
      "Registry hive'lari va muhim kalitlarini topish",
      "PowerShell orqali tizimni jonli kuzatish",
    ],
    outcomesEn: [
      "Draw the Windows architecture layer by layer",
      "Deeply understand kernel vs user mode",
      "Walk through every step of the boot sequence",
      "Analyze processes, threads and handles in real-time",
      "Locate every registry hive and persistence key",
      "Observe the system live with PowerShell",
    ],
    tooling: ["PowerShell", "Process Explorer", "WinDbg", "Sysinternals", "ProcMon", "Autoruns", "Regedit", "Event Viewer"],
    lessons: [
      { n: "01", uz: "Windows arxitekturasi",        en: "Windows architecture",        duration: 36, status: "in-progress", icon: "cpu",      color: "var(--c-system)", labs: 3, diagrams: 9 },
      { n: "02", uz: "Kernel nima?",                 en: "What is the kernel?",         duration: 28, status: "locked", icon: "layers",   color: "var(--c-system)", labs: 2, diagrams: 6 },
      { n: "03", uz: "User mode vs Kernel mode",     en: "User mode vs Kernel mode",    duration: 32, status: "locked", icon: "shield",   color: "var(--c-warn)",   labs: 2, diagrams: 7 },
      { n: "04", uz: "Windows boot jarayoni",        en: "Windows boot process",        duration: 36, status: "locked", icon: "play",     color: "var(--c-auth)",   labs: 2, diagrams: 8 },
      { n: "05", uz: "BIOS vs UEFI",                 en: "BIOS vs UEFI",                duration: 22, status: "locked", icon: "cpu",      color: "var(--c-hw)",     labs: 1, diagrams: 5 },
      { n: "06", uz: "Secure Boot",                  en: "Secure Boot",                 duration: 24, status: "locked", icon: "shield-check", color: "var(--accent)", labs: 1, diagrams: 5 },
      { n: "07", uz: "TPM (Trusted Platform Module)", en: "TPM",                        duration: 26, status: "locked", icon: "lock",     color: "var(--c-auth)",   labs: 1, diagrams: 5 },
      { n: "08", uz: "Registry",                     en: "Windows Registry",            duration: 38, status: "locked", icon: "database", color: "var(--c-system)", labs: 3, diagrams: 8 },
      { n: "09", uz: "Fayl tizimlari",               en: "File systems",                duration: 28, status: "locked", icon: "database", color: "var(--c-system)", labs: 2, diagrams: 6 },
      { n: "10", uz: "NTFS",                         en: "NTFS",                        duration: 32, status: "locked", icon: "database", color: "var(--c-system)", labs: 2, diagrams: 7 },
      { n: "11", uz: "FAT32",                        en: "FAT32",                       duration: 18, status: "locked", icon: "database", color: "var(--text-2)",   labs: 1, diagrams: 4 },
      { n: "12", uz: "Jarayonlar (processes)",       en: "Processes",                   duration: 34, status: "locked", icon: "cpu",      color: "var(--c-user)",   labs: 3, diagrams: 7 },
      { n: "13", uz: "Thread'lar",                   en: "Threads",                     duration: 28, status: "locked", icon: "spark",    color: "var(--c-user)",   labs: 2, diagrams: 6 },
      { n: "14", uz: "Handle'lar",                   en: "Handles",                     duration: 24, status: "locked", icon: "key",      color: "var(--c-user)",   labs: 1, diagrams: 5 },
      { n: "15", uz: "Servislar",                    en: "Services",                    duration: 30, status: "locked", icon: "settings", color: "var(--c-user)",   labs: 2, diagrams: 6 },
      { n: "16", uz: "DLL (Dynamic Link Library)",   en: "DLL",                         duration: 32, status: "locked", icon: "code",     color: "var(--c-user)",   labs: 2, diagrams: 6 },
      { n: "17", uz: "Windows API",                  en: "Windows API",                 duration: 30, status: "locked", icon: "code",     color: "var(--c-user)",   labs: 2, diagrams: 5 },
      { n: "18", uz: "Event Viewer",                 en: "Event Viewer",                duration: 24, status: "locked", icon: "eye",      color: "var(--accent)",   labs: 2, diagrams: 4 },
      { n: "19", uz: "Task Scheduler",               en: "Task Scheduler",              duration: 22, status: "locked", icon: "clock",    color: "var(--accent)",   labs: 1, diagrams: 4 },
      { n: "20", uz: "Windows log fayllari",         en: "Windows logs",                duration: 28, status: "locked", icon: "graph",    color: "var(--accent)",   labs: 2, diagrams: 5 },
    ],
  },
  2: {
    num: "02",
    uz: "Windows Administratsiya",
    en: "Windows Administration",
    descUz: "Ushbu bo'limda Windows tizimini boshqarish ko'nikmalarini amaliy o'rganasiz: foydalanuvchi hisoblari, xavfsizlik vositalari, tarmoq sozlamalari, resurs monitoring va tizimni avtomatlashtirish. Real sysadmin va defender vazifalari.",
    descEn: "In this section you'll learn practical Windows administration skills: user accounts, security tools, network configuration, resource monitoring and automation. Real sysadmin and defender tasks.",
    color: "var(--c-auth)",
    duration: "~8 soat",
    durationEn: "~8 hrs",
    difficulty: "practical",
    instructorUz: "Aziz R. — Senior Red Team Operator",
    instructorEn: "Former defender of a Fortune 500 enterprise · OSCP, CRTO, CRTP",
    outcomesUz: [
      "Task Manager orqali jarayonlar va resurslarni boshqarish",
      "Windows himoya vositalarini sozlash (Defender, Firewall)",
      "Foydalanuvchi hisoblari va UAC ni boshqarish",
      "BitLocker bilan diskni shifrlash",
      "PowerShell orqali tizimni avtomatlashtirish",
      "Tarmoq sozlamalari, RDP va fayl ulashishni boshqarish",
    ],
    outcomesEn: [
      "Manage processes and resources with Task Manager",
      "Configure Windows security tools (Defender, Firewall)",
      "Manage user accounts and UAC",
      "Protect disk with BitLocker encryption",
      "Automate system management with PowerShell",
      "Configure networking, RDP and file sharing",
    ],
    tooling: ["Task Manager", "Device Manager", "PowerShell", "Windows Defender", "BitLocker", "Resource Monitor", "Computer Management", "MSConfig"],
    lessons: [
      { n: "21", uz: "Task Manager",               en: "Task Manager",               duration: 24, status: "available", icon: "cpu",          color: "var(--c-user)",   labs: 2, diagrams: 5 },
      { n: "22", uz: "Device Manager",             en: "Device Manager",             duration: 20, status: "available", icon: "settings",      color: "var(--c-hw)",     labs: 1, diagrams: 4 },
      { n: "23", uz: "Foydalanuvchi hisoblari",    en: "User Accounts & Profiles",   duration: 28, status: "available", icon: "shield",        color: "var(--c-auth)",   labs: 2, diagrams: 5 },
      { n: "24", uz: "User Account Control (UAC)", en: "User Account Control",       duration: 26, status: "available", icon: "lock",          color: "var(--c-warn)",   labs: 2, diagrams: 5 },
      { n: "25", uz: "Settings va Control Panel",  en: "Settings & Control Panel",   duration: 22, status: "available", icon: "settings",      color: "var(--c-system)", labs: 1, diagrams: 4 },
      { n: "26", uz: "MSConfig",                   en: "MSConfig",                   duration: 20, status: "available", icon: "database",      color: "var(--c-system)", labs: 1, diagrams: 4 },
      { n: "27", uz: "Computer Management",        en: "Computer Management",        duration: 26, status: "available", icon: "graph",         color: "var(--c-system)", labs: 2, diagrams: 5 },
      { n: "28", uz: "Resource Monitor",           en: "Resource Monitor",           duration: 24, status: "available", icon: "graph",         color: "var(--c-user)",   labs: 2, diagrams: 5 },
      { n: "29", uz: "Windows Update",             en: "Windows Update",             duration: 18, status: "available", icon: "shield-check",  color: "var(--accent)",   labs: 1, diagrams: 4 },
      { n: "30", uz: "Windows Defender",           en: "Windows Defender",           duration: 26, status: "available", icon: "shield",        color: "var(--c-warn)",   labs: 2, diagrams: 5 },
      { n: "31", uz: "Windows Firewall",           en: "Windows Firewall",           duration: 28, status: "available", icon: "shield",        color: "var(--accent)",   labs: 2, diagrams: 5 },
      { n: "32", uz: "BitLocker",                  en: "BitLocker",                  duration: 24, status: "available", icon: "lock",          color: "var(--c-auth)",   labs: 1, diagrams: 4 },
      { n: "33", uz: "PowerShell asoslari",        en: "PowerShell Basics",          duration: 30, status: "available", icon: "terminal",      color: "var(--c-user)",   labs: 2, diagrams: 5 },
      { n: "34", uz: "Remote Desktop (RDP)",       en: "Remote Desktop (RDP)",       duration: 22, status: "available", icon: "eye",           color: "var(--accent)",   labs: 2, diagrams: 5 },
      { n: "35", uz: "Tarmoq sozlamalari",         en: "Network Configuration",      duration: 28, status: "available", icon: "graph",         color: "var(--c-system)", labs: 2, diagrams: 5 },
      { n: "36", uz: "Fayl ulashish",              en: "File Sharing",               duration: 24, status: "available", icon: "database",      color: "var(--c-system)", labs: 2, diagrams: 4 },
      { n: "37", uz: "Zaxira nusxa va tiklash",    en: "Backup & Restore",           duration: 20, status: "available", icon: "database",      color: "var(--c-auth)",   labs: 1, diagrams: 4 },
    ],
  },
  3: {
    num: "03",
    uz: "Active Directory",
    en: "Active Directory",
    descUz: "Ushbu bo'limda Microsoft Active Directory ning asoslaridan tortib ilg'or xavfsizlik mavzularigacha chuqur o'rganasiz: domenlar, ob'ektlar, autentifikatsiya, Group Policy va hujum/himoya usullari.",
    descEn: "In this section you'll deeply explore Active Directory from fundamentals to advanced security: domains, objects, authentication, Group Policy, and attack/defense techniques.",
    color: "var(--c-warn)",
    duration: "~0 soat",
    durationEn: "~0 hrs",
    difficulty: "advanced",
    instructorUz: "Aziz R. — Senior Red Team Operator",
    instructorEn: "Former defender of a Fortune 500 enterprise · OSCP, CRTO, CRTP",
    outcomesUz: [],
    outcomesEn: [],
    tooling: ["PowerShell", "ADUC", "ADSI Edit", "BloodHound", "Mimikatz", "Impacket", "Rubeus", "Group Policy Management"],
    lessons: [
      { n: "38", uz: "Active Directory asoslari", en: "Active Directory Basics", duration: 30, status: "available", icon: "shield", color: "var(--c-warn)", labs: 1, diagrams: 4 },
      { n: "39", uz: "AD da foydalanuvchi va kompyuter boshqaruvi", en: "Managing Users & Computers in AD", duration: 32, status: "available", icon: "settings", color: "var(--c-auth)", labs: 2, diagrams: 4 },
      { n: "40", uz: "Group Policy — Kirish", en: "Group Policy — Introduction", duration: 28, status: "available", icon: "lock", color: "var(--c-auth)", labs: 1, diagrams: 3 },
      { n: "41", uz: "GPO Sozlamalari va SYSVOL", en: "GPO Settings & SYSVOL", duration: 30, status: "available", icon: "database", color: "var(--c-system)", labs: 1, diagrams: 4 },
      { n: "42", uz: "GPO Yaratish va Qo'llash", en: "Creating & Applying GPOs", duration: 34, status: "available", icon: "shield-check", color: "var(--accent)", labs: 2, diagrams: 5 },
    ],
  },
};

function getTimeSpentAll() {
  try {
    const raw = JSON.parse(localStorage.getItem("wa_time_spent") || "{}");
    if (typeof raw !== "object" || Array.isArray(raw)) return {};
    const clean = {};
    for (const [k, v] of Object.entries(raw)) {
      if (/^s0[123]_l\d{2}$/.test(k)) {
        const n = Number(v);
        if (Number.isFinite(n) && n >= 0) clean[k] = Math.min(Math.floor(n), 14400);
      }
    }
    return clean;
  } catch { return {}; }
}
function fmtTimeShort(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m`;
  return `${sec}s`;
}

function SectionScreen({ setRoute, user, section = 1, onOpenAIChat, aiChatOpen, onOpenSearch }) {
  const lang = useLang();
  const data = SECTION_DATA[section] || SECTION_DATA[1];
  const completedLessons = user?.completedLessons || [];

  if (section === 2) {
    const sec1Keys = Array.from({ length: 20 }, (_, i) => `s01_l${String(i + 1).padStart(2, "0")}`);
    const sec1Done = sec1Keys.filter(k => completedLessons.includes(k)).length;
    if (sec1Done < 20) {
      return (
        <div>
          <TopNav route={{ name: "section" }} setRoute={setRoute} user={user} onOpenAIChat={onOpenAIChat} aiChatOpen={aiChatOpen} onOpenSearch={onOpenSearch}
            crumb={[
              { label: lang === "en" ? "Courses" : "Kurslar", onClick: () => setRoute({ name: "dashboard" }) },
              { label: lang === "en" ? "Section 02" : "02-bo'lim" },
            ]}
          />
          <div className="page" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", textAlign: "center", gap: 16 }}>
            <div style={{ fontSize: 56, lineHeight: 1 }}>🔒</div>
            <h2 className="display" style={{ margin: 0, fontSize: 28 }}>{lang === "en" ? "Section 02 is locked" : "02-bo'lim qulflangan"}</h2>
            <p style={{ color: "var(--text-2)", fontSize: 15, maxWidth: 420, lineHeight: 1.65, margin: 0 }}>
              {lang === "en"
                ? <>Complete all <strong>20 lessons</strong> in Section 01 to unlock this section. Progress: <strong>{sec1Done} / 20</strong></>
                : <>01-bo'limdagi barcha <strong>20 ta darsni</strong> tugatib, testlarini topshiring. Holat: <strong>{sec1Done} / 20</strong></>}
            </p>
            <button className="btn btn-primary" onClick={() => setRoute({ name: "section", section: 1 })}>
              <Icon name="arrow-left" size={14} /> {lang === "en" ? "Go to Section 01" : "01-bo'limga o'tish"}
            </button>
          </div>
        </div>
      );
    }
  }

  if (section === 3) {
    const sec2Keys = Array.from({ length: 17 }, (_, i) => `s02_l${String(i + 21).padStart(2, "0")}`);
    const sec2Done = sec2Keys.filter(k => completedLessons.includes(k)).length;
    if (sec2Done < 17) {
      return (
        <div>
          <TopNav route={{ name: "section" }} setRoute={setRoute} user={user} onOpenAIChat={onOpenAIChat} aiChatOpen={aiChatOpen} onOpenSearch={onOpenSearch}
            crumb={[
              { label: lang === "en" ? "Courses" : "Kurslar", onClick: () => setRoute({ name: "dashboard" }) },
              { label: lang === "en" ? "Section 03" : "03-bo'lim" },
            ]}
          />
          <div className="page" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", textAlign: "center", gap: 16 }}>
            <div style={{ fontSize: 56, lineHeight: 1 }}>🔒</div>
            <h2 className="display" style={{ margin: 0, fontSize: 28 }}>{lang === "en" ? "Section 03 is locked" : "03-bo'lim qulflangan"}</h2>
            <p style={{ color: "var(--text-2)", fontSize: 15, maxWidth: 420, lineHeight: 1.65, margin: 0 }}>
              {lang === "en"
                ? <>Complete all <strong>17 lessons</strong> in Section 02 to unlock this section. Progress: <strong>{sec2Done} / 17</strong></>
                : <>02-bo'limdagi barcha <strong>17 ta darsni</strong> tugatib, testlarini topshiring. Holat: <strong>{sec2Done} / 17</strong></>}
            </p>
            <button className="btn btn-primary" onClick={() => setRoute({ name: "section", section: 2 })}>
              <Icon name="arrow-left" size={14} /> {lang === "en" ? "Go to Section 02" : "02-bo'limga o'tish"}
            </button>
          </div>
        </div>
      );
    }
  }

  const timeSpentAll = getTimeSpentAll();
  const rawLessons = data.lessons.map(l => {
    const n = parseInt(l.n);
    const sec = n <= 20 ? "01" : n <= 37 ? "02" : "03";
    const key = `s${sec}_l${String(n).padStart(2, "0")}`;
    const isDone = completedLessons.includes(key);
    return { ...l, status: isDone ? "done" : "locked", _key: key, timeSpent: timeSpentAll[key] || 0 };
  });
  const firstLocked = rawLessons.find(l => l.status === "locked");
  const lessons = rawLessons.map(l =>
    l._key === firstLocked?._key ? { ...l, status: "in-progress" } : l
  );

  const totalLessons = lessons.length;
  const totalLabs = lessons.reduce((s, l) => s + l.labs, 0);
  const totalDiagrams = lessons.reduce((s, l) => s + l.diagrams, 0);
  const firstLessonN = parseInt(lessons[0].n);

  return (
    <div>
      <TopNav route={{ name: "section" }} setRoute={setRoute} user={user} onOpenAIChat={onOpenAIChat} aiChatOpen={aiChatOpen} onOpenSearch={onOpenSearch}
        crumb={[
          { label: lang === "en" ? "Courses" : "Kurslar", onClick: () => setRoute({ name: "dashboard" }) },
          { label: `${lang === "en" ? "Section" : "Bo'lim"} ${data.num}: ${lang === "en" ? data.en : data.uz}` },
        ]}
      />

      <div className="page">
        {/* HEADER */}
        <div style={{
          position: "relative", borderRadius: 24, overflow: "hidden",
          padding: "44px 44px 40px",
          background: `linear-gradient(135deg, ${data.color}10, var(--bg-2) 60%)`,
          border: `1px solid ${data.color}33`,
          marginBottom: 32,
        }}>
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at top right, ${data.color}1a, transparent 60%)`, pointerEvents: "none" }} />
          <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 36, alignItems: "start" }}>
            <div>
              <div className="eyebrow" style={{ color: data.color, marginBottom: 16 }}>
                {lang === "en" ? `// SECTION ${data.num} · ${data.difficulty.toUpperCase()} LEVEL` : `// ${data.num}-BO'LIM · ${data.difficulty === "foundational" ? "ASOSIY" : "AMALIY"} DARAJA`}
              </div>
              <h1 className="display" style={{ fontSize: 44, margin: "0 0 8px", letterSpacing: "-0.02em" }}>
                {lang === "en" ? data.en : data.uz}
              </h1>
              <p style={{ color: "var(--text-1)", fontSize: 14, lineHeight: 1.65, maxWidth: 640, margin: "16px 0 0" }}>
                {lang === "en" ? data.descEn : data.descUz}
              </p>

              <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                <button className="btn btn-primary" onClick={() => setRoute({ name: "lesson", section, lesson: firstLessonN })}>
                  <Icon name="play" size={14} /> {lang === "en" ? `Resume · L${String(firstLessonN).padStart(2,"0")}` : `Davom etish · L${String(firstLessonN).padStart(2,"0")}`}
                </button>
                <button className="btn"><Icon name="book" size={14} /> {lang === "en" ? "Syllabus PDF" : "Dastur PDF"}</button>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <MiniStat labelUz="Darslar" labelEn="Lessons" value={String(totalLessons)} sub={lang === "en" ? `1/${totalLessons} in progress` : `1/${totalLessons} davom etmoqda`} color={data.color} icon="book" />
              <MiniStat labelUz="Laboratoriya" labelEn="Hands-on labs" value={String(totalLabs)} sub={lang === "en" ? "0 done" : "0 yakunlangan"} color="var(--c-user)" icon="terminal" />
              <MiniStat labelUz="Diagrammalar" labelEn="Diagrams" value={String(totalDiagrams)} sub="interactive" color="var(--c-system)" icon="graph" />
              <MiniStat labelUz="Final imtihon" labelEn="Final exam" value="20Q" sub={lang === "en" ? "2hr · 85% pass" : "2 soat · 85% o'tish"} color="var(--c-warn)" icon="target" />
            </div>
          </div>

          <div style={{ position: "relative", marginTop: 28, paddingTop: 20, borderTop: `1px solid ${data.color}22` }}>
            <Progress value={1} max={totalLessons} label={lang === "en" ? "Section progress" : "Bo'lim taraqqiyoti"} color={data.color} />
          </div>
        </div>

        {/* LESSON LIST */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 24, alignItems: "start" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
              <div>
                <div className="eyebrow">// LESSON_INDEX</div>
                <h2 style={{ fontFamily: "var(--font-display)", margin: "4px 0 0", fontSize: 24 }}>
                  {lang === "en" ? "Lesson contents" : "Darslar tarkibi"}
                </h2>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {lessons.map((l, i) => (
                <LessonRow key={l.n} l={l} idx={i} sectionNum={section} setRoute={setRoute} completedLessons={completedLessons} />
              ))}
            </div>
          </div>

          <aside style={{ position: "sticky", top: 90, display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="glass" style={{ padding: 20 }}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>// INSTRUCTOR</div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, var(--c-attack), var(--c-warn))", color: "#04060d", fontWeight: 700, display: "grid", placeItems: "center", fontFamily: "var(--font-mono)", fontSize: 14 }}>{user?.initials || "AR"}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{user?.name || "Aziz R."}</div>
                  <div style={{ fontSize: 11, color: "var(--text-3)" }}>{data.instructorEn}</div>
                </div>
              </div>
            </div>

            <div className="glass" style={{ padding: 20 }}>
              <div className="eyebrow" style={{ marginBottom: 12 }}>// YOU_WILL_LEARN</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {(lang === "en" ? data.outcomesEn : data.outcomesUz).map((t, i) => (
                  <li key={i} style={{ display: "flex", gap: 8, fontSize: 12.5, lineHeight: 1.5 }}>
                    <span style={{ color: data.color, flexShrink: 0, marginTop: 2 }}><Icon name="check" size={12} /></span>
                    <span style={{ color: "var(--text-0)" }}>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass" style={{ padding: 20 }}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>// TOOLING</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {data.tooling.map((t) => (
                  <span key={t} className="chip chip-gray" style={{ fontSize: 9.5 }}>{t}</span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ labelUz, labelEn, value, sub, color, icon }) {
  const lang = useLang();
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10,
      padding: "12px 14px", display: "flex", alignItems: "center", gap: 14,
    }}>
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

function LessonRow({ l, idx, sectionNum, setRoute, completedLessons }) {
  const lang = useLang();
  const isLocked = l.status === "locked";
  const isDone = l.status === "done";
  const isActive = l.status === "in-progress";

  return (
    <div onClick={() => !isLocked && setRoute({ name: "lesson", section: sectionNum, lesson: parseInt(l.n) })}
      style={{
        display: "grid",
        gridTemplateColumns: "auto 40px 1fr auto auto",
        gap: 16, alignItems: "center",
        padding: "16px 18px",
        borderRadius: 10,
        background: isActive ? `${l.color}08` : "transparent",
        border: `1px solid ${isActive ? l.color + "33" : "transparent"}`,
        borderLeft: `2px solid ${isActive ? l.color : "transparent"}`,
        cursor: isLocked ? "not-allowed" : "pointer",
        opacity: isLocked ? 0.55 : 1,
        transition: "all 200ms",
        marginBottom: 4,
      }}
      onMouseEnter={(e) => {
        if (isLocked) return;
        e.currentTarget.style.background = isActive ? `${l.color}10` : "var(--surface)";
        e.currentTarget.style.borderColor = l.color + "33";
      }}
      onMouseLeave={(e) => {
        if (isLocked) return;
        e.currentTarget.style.background = isActive ? `${l.color}08` : "transparent";
        e.currentTarget.style.borderColor = isActive ? l.color + "33" : "transparent";
      }}>

      <div className="mono" style={{ fontSize: 12, color: "var(--text-3)", letterSpacing: 0.08, minWidth: 32 }}>L{l.n}</div>

      <div style={{
        width: 36, height: 36, borderRadius: 8,
        background: isLocked ? "var(--bg-2)" : isDone ? l.color : `${l.color}12`,
        border: `1px solid ${isLocked ? "var(--border)" : l.color + "44"}`,
        color: isLocked ? "var(--text-3)" : isDone ? "#04060d" : l.color,
        display: "grid", placeItems: "center",
        boxShadow: isActive ? `0 0 16px ${l.color}55` : "none",
      }}>
        <Icon name={isLocked ? "lock" : isDone ? "check" : l.icon} size={16} />
      </div>

      <div>
        <div style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.3 }}>{lang === "en" ? l.en : l.uz}</div>
        {l.timeSpent > 0 && (
          <div className="mono" style={{ fontSize: 10.5, color: "var(--accent)", marginTop: 3 }}>
            {lang === "en" ? `Active: ${fmtTimeShort(l.timeSpent)}` : `Siz ushbu mavzuda ${fmtTimeShort(l.timeSpent)} faol bo'ldingiz`}
          </div>
        )}
      </div>

      <div className="mono" style={{ fontSize: 11, color: "var(--text-2)", display: "flex", gap: 14 }}>
        {l.timeSpent > 0
          ? <span style={{ color: "var(--accent)" }}><Icon name="clock" size={11} /> &nbsp;{fmtTimeShort(l.timeSpent)}</span>
          : <span><Icon name="clock" size={11} /> &nbsp;{l.duration}m</span>}
        <span><Icon name="graph" size={11} /> &nbsp;{l.diagrams}</span>
      </div>

      <div style={{ width: 100, fontSize: 10.5, fontFamily: "var(--font-mono)", color: l.color, letterSpacing: 0.08, textTransform: "uppercase", textAlign: "right" }}>
        {isLocked ? <><Icon name="lock" size={11} /> &nbsp;LOCKED</> :
         isDone ? <><Icon name="check" size={11} /> &nbsp;DONE</> :
         isActive ? "ACTIVE" : "AVAILABLE"}
      </div>

      <Icon name="chevron-right" size={16} style={{ color: "var(--text-3)" }} />
    </div>
  );
}

window.SectionScreen = SectionScreen;
