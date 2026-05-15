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
    instructorUz: "Dagzo — Senior Red Team Operator",
    instructorEn: "Former defender of a Fortune 500 enterprise · OSCP, CRTO, CRTP",
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
};

function SectionScreen({ setRoute, user, section = 1 }) {
  const lang = useLang();
  const data = SECTION_DATA[section] || SECTION_DATA[1];
  const completed = user?.completedLessons || [];

  const lessons = data.lessons.map((l, i) => {
    const key = `s${String(section).padStart(2,"0")}_l${String(i+1).padStart(2,"0")}`;
    const isDone = completed.includes(key);
    // first unlocked lesson after all completed ones is "in-progress"
    const prevKey = i === 0 ? null : `s${String(section).padStart(2,"0")}_l${String(i).padStart(2,"0")}`;
    const prevDone = i === 0 || completed.includes(prevKey);
    const status = isDone ? "done" : prevDone ? "in-progress" : "locked";
    return { ...l, status };
  });

  return (
    <div>
      <TopNav route={{ name: "section" }} setRoute={setRoute} user={user}
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
                {lang === "en" ? `// SECTION ${data.num} · FOUNDATIONAL LEVEL` : `// ${data.num}-BO'LIM · ASOSIY DARAJA`}
              </div>
              <h1 className="display" style={{ fontSize: 44, margin: "0 0 8px", letterSpacing: "-0.02em" }}>
                {lang === "en" ? data.en : data.uz}
              </h1>
              <p style={{ color: "var(--text-1)", fontSize: 14, lineHeight: 1.65, maxWidth: 640, margin: "16px 0 0" }}>
                {lang === "en" ? data.descEn : data.descUz}
              </p>

              <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                <button className="btn btn-primary" onClick={() => setRoute({ name: "lesson", section, lesson: 1 })}>
                  <Icon name="play" size={14} /> {lang === "en" ? "Resume · L01" : "Davom etish · L01"}
                </button>
                <button className="btn"><Icon name="book" size={14} /> {lang === "en" ? "Syllabus PDF" : "Dastur PDF"}</button>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <MiniStat labelUz="Darslar" labelEn="Lessons" value="20" sub={lang === "en" ? "1/20 in progress" : "1/20 davom etmoqda"} color={data.color} icon="book" />
              <MiniStat labelUz="Laboratoriya" labelEn="Hands-on labs" value="36" sub={lang === "en" ? "0 done" : "0 yakunlangan"} color="var(--c-user)" icon="terminal" />
              <MiniStat labelUz="Diagrammalar" labelEn="Diagrams" value="118" sub="interactive" color="var(--c-system)" icon="graph" />
              <MiniStat labelUz="Final imtihon" labelEn="Final exam" value="20Q" sub={lang === "en" ? "2hr · 85% pass" : "2 soat · 85% o'tish"} color="var(--c-warn)" icon="target" />
            </div>
          </div>

          <div style={{ position: "relative", marginTop: 28, paddingTop: 20, borderTop: `1px solid ${data.color}22` }}>
            <Progress value={completed.filter(k => k.startsWith(`s${String(section).padStart(2,"0")}_`)).length} max={data.lessons.length} label={lang === "en" ? "Section progress" : "Bo'lim taraqqiyoti"} color={data.color} />
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
                <LessonRow key={l.n} l={l} idx={i} sectionNum={section} setRoute={setRoute} />
              ))}
            </div>
          </div>

          <aside style={{ position: "sticky", top: 90, display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="glass" style={{ padding: 20 }}>
              <div className="eyebrow" style={{ marginBottom: 12 }}>// INSTRUCTOR</div>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                {/* Dagzo avatar */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: "50%",
                    background: "linear-gradient(135deg, #00ff88 0%, #0af 50%, #a855f7 100%)",
                    padding: 2,
                    boxShadow: "0 0 16px rgba(0,255,136,0.35), 0 0 4px rgba(0,255,136,0.2)",
                  }}>
                    <div style={{
                      width: "100%", height: "100%", borderRadius: "50%",
                      background: "#04060d",
                      display: "grid", placeItems: "center",
                      fontFamily: "var(--font-mono)", fontWeight: 800,
                      fontSize: 13, letterSpacing: "0.05em",
                      background: "radial-gradient(circle at 35% 35%, #0d1a12, #04060d)",
                      color: "transparent",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                    }}>
                      <span style={{
                        background: "linear-gradient(135deg, #00ff88, #0af)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontSize: 11, fontWeight: 900, letterSpacing: "0.06em",
                      }}>DAGZO</span>
                    </div>
                  </div>
                  <div style={{
                    position: "absolute", bottom: 1, right: 1,
                    width: 11, height: 11, borderRadius: "50%",
                    background: "#00ff88", border: "2px solid #04060d",
                    boxShadow: "0 0 6px #00ff88",
                  }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13.5, letterSpacing: "0.01em" }}>Dagzo</div>
                  <div style={{ fontSize: 11, color: "var(--c-system)", fontWeight: 600, marginBottom: 2 }}>Senior Red Team Operator</div>
                  <div style={{ fontSize: 10.5, color: "var(--text-3)", lineHeight: 1.4 }}>{data.instructorEn}</div>
                </div>
              </div>
            </div>

            <div className="glass" style={{ padding: 20 }}>
              <div className="eyebrow" style={{ marginBottom: 12 }}>// YOU_WILL_LEARN</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {(lang === "en" ? OUTCOMES_EN : OUTCOMES_UZ).map((t, i) => (
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
                {["PowerShell", "Process Explorer", "WinDbg", "Sysinternals", "ProcMon", "Autoruns", "Regedit", "Event Viewer"].map((t) => (
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

const OUTCOMES_UZ = [
  "Windows arxitekturasini qatlamma-qatlam chizib bera olish",
  "Kernel mode va user mode farqini chuqur tushunish",
  "Boot ketma-ketligini har bir bosqichi bilan ko'rsatish",
  "Processlar, thread'lar va handle'larni real holatda tahlil qilish",
  "Registry hive'lari va muhim kalitlarini topish",
  "PowerShell orqali tizimni jonli kuzatish",
];
const OUTCOMES_EN = [
  "Draw the Windows architecture layer by layer",
  "Deeply understand kernel vs user mode",
  "Walk through every step of the boot sequence",
  "Analyze processes, threads and handles in real-time",
  "Locate every registry hive and persistence key",
  "Observe the system live with PowerShell",
];

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

function LessonRow({ l, idx, sectionNum, setRoute }) {
  const lang = useLang();
  const isLocked = l.status === "locked";
  const isDone = l.status === "done";
  const isActive = l.status === "in-progress";

  return (
    <div onClick={() => !isLocked && setRoute({ name: "lesson", section: sectionNum, lesson: idx + 1 })}
      style={{
        display: "grid",
        gridTemplateColumns: "auto 40px 1fr auto auto auto",
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

      <div style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.3 }}>{lang === "en" ? l.en : l.uz}</div>

      <div className="mono" style={{ fontSize: 11, color: "var(--text-2)", display: "flex", gap: 14 }}>
        <span><Icon name="clock" size={11} /> &nbsp;{l.duration}m</span>
        <span><Icon name="terminal" size={11} /> &nbsp;{l.labs}</span>
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
