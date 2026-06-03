// dashboard.jsx — user dashboard (single-lang, points to Section 01 lesson 01)

const LESSON_TITLES_DASH = {
  1:"Windows arxitekturasi", 2:"Kernel nima?", 3:"User mode vs Kernel mode",
  4:"Windows boot jarayoni", 5:"BIOS vs UEFI", 6:"Secure Boot", 7:"TPM",
  8:"Registry", 9:"Fayl tizimlari", 10:"NTFS", 11:"FAT32",
  12:"Jarayonlar (processes)", 13:"Thread'lar", 14:"Handle'lar", 15:"Servislar",
  16:"DLL", 17:"Windows API", 18:"Event Viewer", 19:"Task Scheduler", 20:"Windows log fayllari",
  21:"Task Manager", 22:"Device Manager", 23:"Foydalanuvchi hisoblari",
  24:"User Account Control (UAC)", 25:"Settings va Control Panel", 26:"MSConfig",
  27:"Computer Management", 28:"Resource Monitor", 29:"Windows Update",
  30:"Windows Defender", 31:"Windows Firewall", 32:"BitLocker",
  33:"PowerShell asoslari", 34:"Remote Desktop (RDP)", 35:"Tarmoq sozlamalari",
  36:"Fayl ulashish", 37:"Zaxira nusxa va tiklash",
};
const LESSON_TITLES_DASH_EN = {
  1:"Windows architecture", 2:"What is the kernel?", 3:"User mode vs Kernel mode",
  4:"Windows boot process", 5:"BIOS vs UEFI", 6:"Secure Boot", 7:"TPM",
  8:"Windows Registry", 9:"File systems", 10:"NTFS", 11:"FAT32",
  12:"Processes", 13:"Threads", 14:"Handles", 15:"Services",
  16:"DLL", 17:"Windows API", 18:"Event Viewer", 19:"Task Scheduler", 20:"Windows logs",
  21:"Task Manager", 22:"Device Manager", 23:"User Accounts & Profiles",
  24:"User Account Control", 25:"Settings & Control Panel", 26:"MSConfig",
  27:"Computer Management", 28:"Resource Monitor", 29:"Windows Update",
  30:"Windows Defender", 31:"Windows Firewall", 32:"BitLocker",
  33:"PowerShell Basics", 34:"Remote Desktop (RDP)", 35:"Network Configuration",
  36:"File Sharing", 37:"Backup & Restore",
};

const TOTAL_LESSONS = 37;

function lessonKey(n) {
  return `s${n <= 20 ? "01" : "02"}_l${String(n).padStart(2, "0")}`;
}

const ALL_BADGES = [
  { icon:"cpu",          uz:"Birinchi qadam",         en:"First step",            color:"var(--c-system)", unlock: c => c.length >= 1 },
  { icon:"flame",        uz:"5 ta dars",              en:"5 lessons",             color:"var(--c-attack)", unlock: c => c.length >= 5 },
  { icon:"trophy",       uz:"10 ta dars",             en:"10 lessons",            color:"var(--c-warn)",   unlock: c => c.length >= 10 },
  { icon:"star",         uz:"20 ta dars",             en:"20 lessons",            color:"var(--accent-2)", unlock: c => c.length >= 20 },
  { icon:"zap",          uz:"30 ta dars",             en:"30 lessons",            color:"var(--accent)",   unlock: c => c.length >= 30 },
  { icon:"check",        uz:"Kurs tugallandi",        en:"Course complete",       color:"var(--c-ok)",     unlock: c => c.length >= 37 },
  { icon:"layers",       uz:"Arxitektura ustasi",     en:"Architecture master",   color:"var(--c-system)", unlock: c => c.includes(lessonKey(1)) },
  { icon:"lock",         uz:"Kernel ustasi",          en:"Kernel master",         color:"var(--c-system)", unlock: c => c.includes(lessonKey(2)) },
  { icon:"shield",       uz:"Boot eksperti",          en:"Boot expert",           color:"var(--c-auth)",   unlock: c => c.includes(lessonKey(4)) },
  { icon:"cpu",          uz:"BIOS/UEFI bilgisi",      en:"BIOS/UEFI expert",      color:"var(--c-hw)",     unlock: c => c.includes(lessonKey(5)) },
  { icon:"shield-check", uz:"Secure Boot",            en:"Secure Boot",           color:"var(--accent)",   unlock: c => c.includes(lessonKey(6)) },
  { icon:"key",          uz:"TPM bilgisi",            en:"TPM expert",            color:"var(--c-auth)",   unlock: c => c.includes(lessonKey(7)) },
  { icon:"database",     uz:"Registry muhandisi",     en:"Registry engineer",     color:"var(--c-system)", unlock: c => c.includes(lessonKey(8)) },
  { icon:"database",     uz:"Fayl tizimi bilgisi",    en:"File system expert",    color:"var(--c-system)", unlock: c => c.includes(lessonKey(9)) },
  { icon:"database",     uz:"NTFS mutaxassisi",       en:"NTFS specialist",       color:"var(--c-system)", unlock: c => c.includes(lessonKey(10)) },
  { icon:"cpu",          uz:"Jarayon ustasi",         en:"Process master",        color:"var(--c-user)",   unlock: c => c.includes(lessonKey(12)) },
  { icon:"spark",        uz:"Thread bilgisi",         en:"Thread expert",         color:"var(--c-user)",   unlock: c => c.includes(lessonKey(13)) },
  { icon:"key",          uz:"Handle ustasi",          en:"Handle master",         color:"var(--c-user)",   unlock: c => c.includes(lessonKey(14)) },
  { icon:"code",         uz:"API bilgisi",            en:"API expert",            color:"var(--c-user)",   unlock: c => c.includes(lessonKey(17)) },
  { icon:"eye",          uz:"Log ustasi",             en:"Log master",            color:"var(--accent)",   unlock: c => c.includes(lessonKey(18)) },
  { icon:"clock",        uz:"Scheduler bilgisi",      en:"Scheduler expert",      color:"var(--accent)",   unlock: c => c.includes(lessonKey(19)) },
  { icon:"cpu",          uz:"Task Manager pro",       en:"Task Manager pro",      color:"var(--c-user)",   unlock: c => c.includes(lessonKey(21)) },
  { icon:"shield",       uz:"UAC bilgisi",            en:"UAC expert",            color:"var(--c-warn)",   unlock: c => c.includes(lessonKey(24)) },
  { icon:"shield",       uz:"Defender himoyachisi",   en:"Defender guardian",     color:"var(--c-warn)",   unlock: c => c.includes(lessonKey(30)) },
  { icon:"shield",       uz:"Firewall ustasi",        en:"Firewall master",       color:"var(--accent)",   unlock: c => c.includes(lessonKey(31)) },
  { icon:"lock",         uz:"BitLocker shifrovchi",   en:"BitLocker encryptor",   color:"var(--c-auth)",   unlock: c => c.includes(lessonKey(32)) },
  { icon:"terminal",     uz:"PowerShell ninja",       en:"PowerShell ninja",      color:"var(--c-user)",   unlock: c => c.includes(lessonKey(33)) },
  { icon:"eye",          uz:"Masofaviy usta",         en:"Remote master",         color:"var(--accent)",   unlock: c => c.includes(lessonKey(34)) },
  { icon:"graph",        uz:"Tarmoq mutaxassisi",     en:"Network specialist",    color:"var(--c-system)", unlock: c => c.includes(lessonKey(35)) },
  { icon:"database",     uz:"Zaxira ustasi",          en:"Backup master",         color:"var(--c-auth)",   unlock: c => c.includes(lessonKey(37)) },
  { icon:"star",         uz:"01-bo'lim bajardi",      en:"Section 01 done",       color:"var(--c-ok)",     unlock: c => Array.from({length:20},(_,i)=>lessonKey(i+1)).every(k=>c.includes(k)) },
  { icon:"trophy",       uz:"02-bo'lim bajardi",      en:"Section 02 done",       color:"var(--accent-2)", unlock: c => Array.from({length:17},(_,i)=>lessonKey(i+21)).every(k=>c.includes(k)) },
  { icon:"target",       uz:"10 dars seriyasi",       en:"10-lesson streak",      color:"var(--c-attack)", unlock: c => c.length >= 10 },
  { icon:"flame",        uz:"Yarim yo'l",             en:"Halfway there",         color:"var(--c-warn)",   unlock: c => c.length >= 18 },
  { icon:"skull",        uz:"Qattiq ishlagan",        en:"Hard worker",           color:"var(--c-attack)", unlock: c => c.length >= 25 },
  { icon:"graph",        uz:"Admin mutaxassisi",      en:"Admin specialist",      color:"var(--c-auth)",   unlock: c => c.length >= 30 },
];

const SKILL_NODES = [
  { id:"arch",      uz:"Arxitektura",    en:"Architecture",    icon:"cpu",          color:"var(--c-system)", unlockAt: 3  },
  { id:"boot",      uz:"Boot",           en:"Boot & Firmware", icon:"play",         color:"var(--c-auth)",   unlockAt: 7  },
  { id:"storage",   uz:"Saqlash",        en:"Storage",         icon:"database",     color:"var(--c-system)", unlockAt: 11 },
  { id:"processes", uz:"Processlar",     en:"Processes",       icon:"layers",       color:"var(--c-user)",   unlockAt: 15 },
  { id:"api",       uz:"API va Loglar",  en:"API & Logs",      icon:"code",         color:"var(--c-user)",   unlockAt: 20 },
  { id:"admin",     uz:"Admin",          en:"Administration",  icon:"shield",       color:"var(--c-warn)",   unlockAt: 37 },
];

function buildHeatmap(lessonDates = {}) {
  const grid = Array.from({length:12}, () => Array(7).fill(0));
  const now = Date.now();
  Object.values(lessonDates).forEach(ts => {
    const daysAgo = Math.floor((now - ts) / 86400000);
    if (daysAgo < 84) {
      const week = Math.floor(daysAgo / 7);
      const day = daysAgo % 7;
      grid[11 - week][6 - day]++;
    }
  });
  return grid;
}

function buildDayLessons(lessonDates = {}) {
  const map = {};
  const now = Date.now();
  Object.entries(lessonDates).forEach(([key, ts]) => {
    const daysAgo = Math.floor((now - ts) / 86400000);
    if (daysAgo < 84) {
      if (!map[daysAgo]) map[daysAgo] = [];
      const parts = key.match(/l(\d+)$/);
      const n = parts ? parseInt(parts[1]) : 0;
      map[daysAgo].push(n);
    }
  });
  return map;
}

function DashboardScreen({ setRoute, user, onOpenProfile, onOpenAIChat, aiChatOpen, onOpenSearch }) {
  const lang = useLang();
  const completed = user?.completedLessons || [];
  const scores = Object.values(user?.quizScores || {});
  const avgScore = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : null;

  const nextLessonNum = Array.from({length: TOTAL_LESSONS}, (_,i) => i+1)
    .find(n => !completed.includes(lessonKey(n))) || 1;

  return (
    <div>
      <TopNav route={{ name: "dashboard" }} setRoute={setRoute} user={user} onOpenProfile={onOpenProfile} onOpenAIChat={onOpenAIChat} aiChatOpen={aiChatOpen} onOpenSearch={onOpenSearch}
        crumb={[{ label: lang === "en" ? "Dashboard" : "Boshqaruv" }]} />

      <div className="page" style={{ paddingTop: 24 }}>
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, gap: 24, flexWrap: "wrap" }}>
          <div>
            <div className="eyebrow"><LiveDot /> &nbsp;OPERATOR_ID: {(user?.name || "DAGZO").toUpperCase().replace(/\s/g,"_")} · XP: {user?.xp || 0} · LVL: {user?.level || 1}</div>
            <h1 className="display" style={{ fontSize: 40, margin: "10px 0 6px", letterSpacing: "-0.02em" }}>
              {lang === "en" ? `Welcome back, ${user?.name || "Dagzo"}` : `Xush kelibsiz, ${user?.name || "Dagzo"}`}<span className="caret" />
            </h1>
            <p style={{ color: "var(--text-2)", margin: 0 }}>
              {lang === "en"
                ? `Level ${user?.level || 1} · ${user?.xp || 0} XP · ${completed.length} lessons completed`
                : `${user?.level || 1}-daraja · ${user?.xp || 0} XP · ${completed.length} ta dars tugatildi`}
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setRoute({ name: "lesson", lesson: nextLessonNum })}>
            <Icon name="play" size={14} /> {lang === "en"
              ? `Continue: L${String(nextLessonNum).padStart(2,"0")}`
              : `Davom etish: L${String(nextLessonNum).padStart(2,"0")}`}
          </button>
        </div>

        {/* STAT ROW */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 14 }}>
          <StatCard icon="flame" color="var(--c-attack)" n={user?.level || 1} suffix={lang === "en" ? "lvl" : "lvl"} uz="Daraja" en="Level" />
          <StatCard icon="zap" color="var(--accent)" n={user?.xp || "0"} uz="Tajriba" en="Total XP" />
          <StatCard icon="trophy" color="var(--c-warn)" n={completed.length} suffix={`/ ${TOTAL_LESSONS}`} uz="Darslar" en="Lessons done" />
          <StatCard icon="target" color="var(--c-auth)" n={avgScore != null ? `${avgScore}%` : "—"} uz="O'rtacha test" en="Avg quiz score" />
        </div>

        {/* TODAY ROW */}
        <TodayStats user={user} />


        {/* MAIN GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <ContinueCard setRoute={setRoute} user={user} />

            <div className="glass" style={{ padding: "22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
                <div>
                  <div className="eyebrow">// SKILL_TREE</div>
                  <h3 style={{ margin: "4px 0 0", fontFamily: "var(--font-display)", fontSize: 20 }}>
                    {lang === "en" ? "Skill tree" : "Ko'nikma daraxti"}
                  </h3>
                </div>
                <SkillTreeCount completed={completed} />
              </div>
              <SkillTree completed={completed} />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Heatmap user={user} />
            <Achievements user={user} />
            <UpcomingExam setRoute={setRoute} user={user} />
          </div>
        </div>

        {/* PROGRESS BY SECTION */}
        <div className="glass" style={{ padding: "22px", marginTop: 18 }}>
          <div className="eyebrow" style={{ marginBottom: 4 }}>// CURRICULUM_MAP</div>
          <h3 style={{ margin: "0 0 18px", fontFamily: "var(--font-display)", fontSize: 20 }}>
            {lang === "en" ? "Progress by section" : "Bo'limlar bo'yicha o'sish"}
          </h3>
          <SectionProgress setRoute={setRoute} user={user} />
        </div>
      </div>
    </div>
  );
}

function TodayStats({ user }) {
  const lang = useLang();
  const streak = user?.streak || 0;
  const todayXP = user?.todayXP || 0;
  const aiLeft = Math.max(0, 5 - (user?.aiQuestionsToday || 0));

  const totalSec = (() => {
    try { return Object.values(JSON.parse(localStorage.getItem("wa_time_spent") || "{}")).reduce((a, b) => a + b, 0); }
    catch { return 0; }
  })();
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const timeStr = h > 0 ? `${h}h ${m}m` : m > 0 ? `${m}m` : `${totalSec}s`;

  const chip = (icon, color, label) => (
    <div style={{
      display: "flex", alignItems: "center", gap: 8, padding: "8px 14px",
      background: color + "0d", border: `1px solid ${color}33`, borderRadius: 10,
      fontSize: 12.5, fontFamily: "var(--font-mono)", color,
    }}>
      <Icon name={icon} size={13} /> {label}
    </div>
  );

  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
      {chip("flame", "var(--c-attack)",
        streak > 0
          ? (lang === "en" ? `${streak}-day streak 🔥` : `${streak} kunlik seriya 🔥`)
          : (lang === "en" ? "No streak yet" : "Seriya yo'q"))}
      {chip("zap", "var(--accent)",
        lang === "en" ? `+${todayXP} XP today` : `Bugun +${todayXP} XP`)}
      {chip("clock", "var(--c-auth)",
        lang === "en" ? `${timeStr} total reading` : `Jami o'qish: ${timeStr}`)}
      {chip("spark", "var(--c-user)",
        lang === "en" ? `AI XP: ${aiLeft}/5 left` : `AI XP: ${aiLeft}/5 qoldi`)}
    </div>
  );
}

function StatCard({ icon, color, n, suffix, uz, en }) {
  const lang = useLang();
  return (
    <div className="glass" style={{ padding: 18, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div className="stat">
        <div className="stat-n" style={{ color }}>
          {n}{suffix && <span style={{ fontSize: 18, color: "var(--text-2)", marginLeft: 4 }}>{suffix}</span>}
        </div>
        <div className="stat-l">{lang === "en" ? en : uz}</div>
      </div>
      <div style={{ width: 34, height: 34, borderRadius: 8, background: color + "10", border: `1px solid ${color}33`, color, display: "grid", placeItems: "center" }}>
        <Icon name={icon} size={16} />
      </div>
    </div>
  );
}

function ContinueCard({ setRoute, user }) {
  const lang = useLang();
  const completed = user?.completedLessons || [];
  const progressPct = Math.round((completed.length / TOTAL_LESSONS) * 100);

  const nextNum = Array.from({length: TOTAL_LESSONS}, (_,i) => i+1)
    .find(n => !completed.includes(lessonKey(n))) || 1;
  const sectionNum = nextNum <= 20 ? 1 : 2;
  const titleUz = LESSON_TITLES_DASH[nextNum] || "";
  const titleEn = LESSON_TITLES_DASH_EN[nextNum] || "";

  return (
    <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", padding: "26px 28px",
      background: "linear-gradient(135deg, rgba(0,255,156,0.08), rgba(13,19,36,0.6) 60%)",
      border: "1px solid var(--accent-border)",
    }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at top right, var(--accent-soft), transparent 60%)", pointerEvents: "none" }} />
      <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "center" }}>
        <div>
          <div className="eyebrow" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <LiveDot />
            {lang === "en"
              ? `SECTION ${String(sectionNum).padStart(2,"0")} · LESSON ${String(nextNum).padStart(2,"0")} · ${completed.length > 0 ? "IN PROGRESS" : "START"}`
              : `0${sectionNum}-BO'LIM · DARS ${String(nextNum).padStart(2,"0")} · ${completed.length > 0 ? "DAVOM ETMOQDA" : "BOSHLASH"}`}
          </div>
          <h2 className="display" style={{ fontSize: 28, margin: "10px 0 6px", letterSpacing: "-0.02em" }}>
            {lang === "en" ? titleEn : titleUz}
          </h2>
          <div style={{ marginTop: 14, maxWidth: 380 }}>
            <Progress value={progressPct} label={lang === "en" ? "Course progress" : "Kurs taraqqiyoti"} />
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
            {completed.length} / {TOTAL_LESSONS} {lang === "en" ? "lessons done" : "dars yakunlandi"}
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setRoute({ name: "lesson", section: sectionNum, lesson: nextNum })}>
          <Icon name="play" size={14} /> {lang === "en" ? "Resume" : "Davom etish"}
        </button>
      </div>
    </div>
  );
}

function SkillTreeCount({ completed }) {
  const lang = useLang();
  const count = SKILL_NODES.filter(s => completed.length >= s.unlockAt).length;
  return (
    <span className="mono" style={{ fontSize: 11, color: "var(--text-2)" }}>
      {count}/6 {lang === "en" ? "unlocked" : "ochildi"}
    </span>
  );
}

function SkillTree({ completed }) {
  const lang = useLang();
  const doneCount = completed.length;
  const nodeState = (n) => {
    if (doneCount >= n.unlockAt) return "active";
    if (doneCount >= n.unlockAt - 3) return "open";
    return "locked";
  };

  const nodes = [
    { ...SKILL_NODES[0], x: 300, y: 180 },
    { ...SKILL_NODES[1], x: 150, y: 90 },
    { ...SKILL_NODES[2], x: 450, y: 90 },
    { ...SKILL_NODES[3], x: 150, y: 270 },
    { ...SKILL_NODES[4], x: 450, y: 270 },
    { ...SKILL_NODES[5], x: 60, y: 180, small: true },
  ];

  const edges = [
    [0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [3, 5],
  ];

  return (
    <div style={{ position: "relative", height: 360 }}>
      <svg viewBox="0 0 600 360" style={{ width: "100%", height: "100%" }}>
        <defs>
          <filter id="st-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {edges.map(([a, b], i) => {
          const from = nodes[a]; const to = nodes[b];
          const state = nodeState(from) === "active" && nodeState(to) !== "locked" ? "active" : "locked";
          return (
            <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y}
              stroke={state === "active" ? "var(--accent)" : "var(--text-3)"}
              strokeWidth={state === "active" ? 1.6 : 1}
              strokeDasharray={state === "locked" ? "3 5" : "0"}
              strokeOpacity={state === "locked" ? 0.4 : 0.7} />
          );
        })}
        <g filter="url(#st-glow)">
          {nodes.map((n) => {
            const st = nodeState(n);
            const label = lang === "en" ? n.en : n.uz;
            return (
              <SVGSkillNode key={n.id} x={n.x} y={n.y} state={st} icon={n.icon}
                label={label} sub={st === "active" ? (lang === "en" ? "Unlocked" : "Ochildi") : (lang === "en" ? "Locked" : "Qulflangan")} small={n.small} color={n.color} />
            );
          })}
        </g>
      </svg>
    </div>
  );
}

function SVGSkillNode({ x, y, state, icon, label, sub, small, color }) {
  const r = small ? 22 : 32;
  const c = {
    active: { stroke: color || "var(--accent)", fill: "rgba(0,255,156,0.1)", text: color || "var(--accent)" },
    open:   { stroke: "var(--c-system)", fill: "var(--bg-2)", text: "var(--c-system)" },
    locked: { stroke: "var(--text-3)", fill: "var(--bg-1)", text: "var(--text-3)" },
  }[state];
  return (
    <g style={{ cursor: "pointer" }}>
      {state === "active" && (
        <circle cx={x} cy={y} r={r + 8} fill="none" stroke={c.stroke} strokeWidth="1" opacity="0.4">
          <animate attributeName="r" values={`${r + 4};${r + 14};${r + 4}`} dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="2.4s" repeatCount="indefinite" />
        </circle>
      )}
      <circle cx={x} cy={y} r={r} fill={c.fill} stroke={c.stroke} strokeWidth={state === "active" ? 2.2 : 1.6} />
      <foreignObject x={x - r * 0.4} y={y - r * 0.4} width={r * 0.8} height={r * 0.8} style={{ color: c.text }}>
        <Icon name={state === "locked" ? "lock" : icon} size={r * 0.8} />
      </foreignObject>
      {label && (
        <text x={x} y={y + r + 14} fill={state === "locked" ? "var(--text-3)" : "var(--text-0)"}
              fontSize="11" fontFamily="var(--font-display)" fontWeight="600" textAnchor="middle">
          {label}
        </text>
      )}
      {sub && (
        <text x={x} y={y + r + 26} fill="var(--text-3)"
              fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle" letterSpacing="0.5">
          {sub.toUpperCase()}
        </text>
      )}
    </g>
  );
}

function Heatmap({ user }) {
  const lang = useLang();
  const lessonDates = user?.lessonDates || {};
  const data = buildHeatmap(lessonDates);
  const dayLessons = buildDayLessons(lessonDates);
  const activeDays = data.flat().filter(v => v > 0).length;
  const [tooltip, setTooltip] = React.useState(null);

  return (
    <div className="glass" style={{ padding: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <div className="eyebrow">// ACTIVITY</div>
          <h3 style={{ margin: "4px 0 0", fontFamily: "var(--font-display)", fontSize: 18 }}>
            {lang === "en" ? "Last 12 weeks" : "So'nggi 12 hafta"}
          </h3>
        </div>
        <span className="mono" style={{ fontSize: 11, color: "var(--text-2)" }}>
          {activeDays} {lang === "en" ? "active days" : "faol kun"}
        </span>
      </div>
      <div style={{ marginTop: 16, position: "relative" }}>
        <div style={{ display: "flex", gap: 4 }}>
          {data.map((col, w) => (
            <div key={w} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {col.map((v, d) => {
                const daysAgo = (11 - w) * 7 + (6 - d);
                const lessons = dayLessons[daysAgo] || [];
                return (
                  <div key={d}
                    onMouseEnter={() => lessons.length > 0 && setTooltip({ w, d, lessons, daysAgo })}
                    onMouseLeave={() => setTooltip(null)}
                    style={{
                      width: 14, height: 14, borderRadius: 3,
                      background: v === 0 ? "rgba(255,255,255,0.04)" :
                                  v === 1 ? "rgba(0,255,156,0.15)" :
                                  v === 2 ? "rgba(0,255,156,0.35)" :
                                  v === 3 ? "rgba(0,255,156,0.6)" :
                                  "var(--accent)",
                      border: "1px solid rgba(255,255,255,0.04)",
                      boxShadow: v >= 3 ? "0 0 8px var(--accent-glow)" : "none",
                      cursor: lessons.length > 0 ? "pointer" : "default",
                    }} />
                );
              })}
            </div>
          ))}
        </div>
        {tooltip && (
          <div style={{
            position: "absolute", bottom: "100%", left: `${tooltip.w * 18}px`,
            background: "var(--surface)", border: "1px solid var(--accent-border)",
            borderRadius: 8, padding: "8px 12px", fontSize: 11,
            fontFamily: "var(--font-mono)", color: "var(--text-0)",
            pointerEvents: "none", zIndex: 10, whiteSpace: "nowrap",
            marginBottom: 6, boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          }}>
            <div style={{ color: "var(--accent)", marginBottom: 4 }}>
              {tooltip.daysAgo === 0 ? (lang === "en" ? "Today" : "Bugun") : `${tooltip.daysAgo}d ${lang === "en" ? "ago" : "oldin"}`}
            </div>
            {tooltip.lessons.map(n => (
              <div key={n} style={{ color: "var(--text-1)" }}>
                L{String(n).padStart(2,"0")} — {lang === "en" ? LESSON_TITLES_DASH_EN[n] : LESSON_TITLES_DASH[n]}
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10.5, color: "var(--text-2)" }}>
        <span className="mono">{lang === "en" ? "12 weeks ago" : "12 hafta oldin"}</span>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <span>{lang === "en" ? "less" : "kam"}</span>
          {[0,1,2,3,4].map((v) => (
            <div key={v} style={{ width: 10, height: 10, borderRadius: 2,
              background: v === 0 ? "rgba(255,255,255,0.04)" :
                          v === 1 ? "rgba(0,255,156,0.15)" :
                          v === 2 ? "rgba(0,255,156,0.35)" :
                          v === 3 ? "rgba(0,255,156,0.6)" :
                          "var(--accent)",
            }} />
          ))}
          <span>{lang === "en" ? "more" : "ko'p"}</span>
        </div>
      </div>
    </div>
  );
}

function Achievements({ user }) {
  const lang = useLang();
  const completed = user?.completedLessons || [];
  const earned = ALL_BADGES.filter(b => b.unlock(completed));
  const display = ALL_BADGES.slice(0, 12);

  return (
    <div className="glass" style={{ padding: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
        <div>
          <div className="eyebrow">// BADGES</div>
          <h3 style={{ margin: "4px 0 0", fontFamily: "var(--font-display)", fontSize: 18 }}>
            {lang === "en" ? "Achievements" : "Yutuqlar"}
          </h3>
        </div>
        <span className="mono" style={{ fontSize: 11, color: "var(--text-2)" }}>{earned.length} / {ALL_BADGES.length}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
        {display.map((a, i) => {
          const isEarned = a.unlock(completed);
          return (
            <div key={i} title={lang === "en" ? a.en : a.uz} style={{
              aspectRatio: "1",
              background: isEarned ? `${a.color}12` : "var(--bg-2)",
              border: `1px solid ${isEarned ? a.color + "55" : "var(--border)"}`,
              color: isEarned ? a.color : "var(--text-3)",
              borderRadius: 10,
              display: "grid", placeItems: "center",
              boxShadow: isEarned ? `0 0 12px ${a.color}33` : "none",
              opacity: isEarned ? 1 : 0.5,
              cursor: "pointer", transition: "all 250ms",
            }}>
              <Icon name={isEarned ? a.icon : "lock"} size={18} />
            </div>
          );
        })}
      </div>
      {earned.length > 12 && (
        <div style={{ marginTop: 10, fontSize: 11, color: "var(--text-3)", fontFamily: "var(--font-mono)", textAlign: "center" }}>
          +{earned.length - 12} {lang === "en" ? "more earned" : "ta yana"}
        </div>
      )}
    </div>
  );
}

function UpcomingExam({ setRoute, user }) {
  const lang = useLang();
  const s01done = (user?.completedLessons || []).filter(k => k.startsWith("s01")).length;
  const examUnlocked = s01done >= 20;
  return (
    <div className="glass" style={{ padding: 22, position: "relative", overflow: "hidden", opacity: examUnlocked ? 1 : 0.85 }}>
      <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, background: `radial-gradient(circle, ${examUnlocked ? "rgba(255,204,68,0.2)" : "rgba(255,255,255,0.05)"}, transparent 70%)` }} />
      <div className="eyebrow" style={{ color: examUnlocked ? "var(--c-warn)" : "var(--text-3)" }}>// FINAL_EXAM_PREVIEW</div>
      <h3 style={{ margin: "8px 0 6px", fontFamily: "var(--font-display)", fontSize: 18 }}>
        {lang === "en" ? "Section 01 final" : "01-bo'lim final imtihoni"}
      </h3>
      <p style={{ margin: 0, color: "var(--text-2)", fontSize: 12.5 }}>
        {lang === "en" ? "20 questions · 2 hours · 85% to pass" : "20 ta savol · 2 soat · 85% o'tish"}
      </p>
      <div style={{ marginTop: 14 }}>
        <Progress value={s01done} max={20} label={lang === "en" ? "S01 lessons complete" : "S01 darslar yakunlangan"} color={examUnlocked ? "var(--c-warn)" : "var(--text-3)"} />
      </div>
      <button
        className="btn"
        onClick={() => examUnlocked && setRoute({ name: "exam" })}
        disabled={!examUnlocked}
        style={{
          marginTop: 16, width: "100%", justifyContent: "center",
          borderColor: examUnlocked ? "rgba(255,204,68,0.35)" : "var(--border)",
          color: examUnlocked ? "var(--c-warn)" : "var(--text-3)",
          cursor: examUnlocked ? "pointer" : "not-allowed",
          opacity: examUnlocked ? 1 : 0.6,
        }}>
        <Icon name={examUnlocked ? "target" : "lock"} size={14} />
        {examUnlocked
          ? (lang === "en" ? "Preview the final" : "Imtihonni ko'rib chiqish")
          : (lang === "en" ? `Complete all 20 lessons to unlock (${s01done}/20)` : `${s01done}/20 dars tugatilganda ochiladi`)}
      </button>
    </div>
  );
}

function SectionProgress({ setRoute, user }) {
  const lang = useLang();
  const completed = user?.completedLessons || [];
  const s01done = completed.filter(k => k.startsWith("s01")).length;
  const s02done = completed.filter(k => k.startsWith("s02")).length;
  const s03done = completed.filter(k => k.startsWith("s03")).length;

  const sections = [
    { num: "01", uz: "Windows asoslari",    en: "Windows Fundamentals",  done: s01done, total: 20, color: "var(--c-system)", state: "active" },
    { num: "02", uz: "Administratsiya",     en: "Administration",        done: s02done, total: 17, color: "var(--c-user)",   state: "active" },
    { num: "03", uz: "Active Directory",    en: "Active Directory",      done: s03done, total: 0,  color: "var(--c-warn)",   state: s01done >= 20 && s02done >= 17 ? "active" : "locked" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {sections.map((s, i) => {
        const pct = (s.done / s.total) * 100;
        const locked = s.state === "locked";
        return (
          <div key={s.num} onClick={() => !locked && setRoute({ name: "section", section: i + 1 })}
            style={{
              display: "grid", gridTemplateColumns: "60px 1fr 80px 1fr 90px",
              gap: 16, alignItems: "center",
              padding: "12px 14px", borderRadius: 10,
              background: "var(--bg-2)", border: "1px solid var(--border)",
              cursor: locked ? "not-allowed" : "pointer", opacity: locked ? 0.5 : 1,
              transition: "all 200ms",
            }}
            onMouseEnter={(e) => !locked && (e.currentTarget.style.borderColor = s.color)}
            onMouseLeave={(e) => !locked && (e.currentTarget.style.borderColor = "var(--border)")}>
            <div className="mono" style={{ color: s.color, fontSize: 12, letterSpacing: 0.1 }}>SEC {s.num}</div>
            <div style={{ fontWeight: 500, fontSize: 14 }}>{lang === "en" ? s.en : s.uz}</div>
            <div className="mono" style={{ fontSize: 11.5, color: "var(--text-2)" }}>{s.done}/{s.total}</div>
            <Progress value={pct} color={s.color} height={4} showVal={false} />
            <div style={{ textAlign: "right" }}>
              {locked ? (
                <span className="mono" style={{ fontSize: 10, color: "var(--text-3)" }}><Icon name="lock" size={11} /> LOCKED</span>
              ) : pct === 100 ? (
                <span className="mono" style={{ fontSize: 10, color: s.color }}><Icon name="check" size={11} /> DONE</span>
              ) : (
                <span className="mono" style={{ fontSize: 10, color: s.color }}>ACTIVE</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

window.DashboardScreen = DashboardScreen;
