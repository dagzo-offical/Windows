// dashboard.jsx — user dashboard (single-lang, points to Section 01 lesson 01)

function DashboardScreen({ setRoute, user, onOpenProfile, onOpenAIChat, aiChatOpen }) {
  const lang = useLang();
  return (
    <div>
      <TopNav route={{ name: "dashboard" }} setRoute={setRoute} user={user} onOpenProfile={onOpenProfile} onOpenAIChat={onOpenAIChat} aiChatOpen={aiChatOpen}
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
                ? `Level ${user?.level || 1} · ${user?.xp || 0} XP · ${user?.completedLessons?.length || 0} lessons completed`
                : `${user?.level || 1}-daraja · ${user?.xp || 0} XP · ${user?.completedLessons?.length || 0} ta dars tugatildi`}
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setRoute({ name: "lesson", section: 1, lesson: 1 })}>
            <Icon name="play" size={14} /> {lang === "en" ? "Continue: Windows architecture" : "Davom etish: Windows arxitekturasi"}
          </button>
        </div>

        {/* STAT ROW */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
          <StatCard icon="flame" color="var(--c-attack)" n={user?.level || 1} suffix={lang === "en" ? "lvl" : "lvl"} uz="Daraja" en="Level" />
          <StatCard icon="zap" color="var(--accent)" n={user?.xp || "0"} uz="Tajriba" en="Total XP" />
          <StatCard icon="trophy" color="var(--c-warn)" n={user?.completedLessons?.length || 0} suffix="/ 20" uz="Darslar" en="Lessons done" />
          <StatCard icon="target" color="var(--c-auth)" n="—" uz="O'rtacha test" en="Avg quiz score" />
        </div>

        {/* MAIN GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <ContinueCard setRoute={setRoute} />

            <div className="glass" style={{ padding: "22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
                <div>
                  <div className="eyebrow">// SKILL_TREE</div>
                  <h3 style={{ margin: "4px 0 0", fontFamily: "var(--font-display)", fontSize: 20 }}>
                    {lang === "en" ? "Skill tree" : "Ko'nikma daraxti"}
                  </h3>
                </div>
                <span className="mono" style={{ fontSize: 11, color: "var(--text-2)" }}>3/6 unlocked</span>
              </div>
              <SkillTree />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Heatmap />
            <Achievements />
            <UpcomingExam setRoute={setRoute} />
          </div>
        </div>

        {/* PROGRESS BY SECTION */}
        <div className="glass" style={{ padding: "22px", marginTop: 18 }}>
          <div className="eyebrow" style={{ marginBottom: 4 }}>// CURRICULUM_MAP</div>
          <h3 style={{ margin: "0 0 18px", fontFamily: "var(--font-display)", fontSize: 20 }}>
            {lang === "en" ? "Progress by section" : "Bo'limlar bo'yicha o'sish"}
          </h3>
          <SectionProgress setRoute={setRoute} />
        </div>
      </div>
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

function ContinueCard({ setRoute }) {
  const lang = useLang();
  return (
    <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", padding: "26px 28px",
      background: "linear-gradient(135deg, rgba(0,255,156,0.08), rgba(13,19,36,0.6) 60%)",
      border: "1px solid var(--accent-border)",
    }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at top right, var(--accent-soft), transparent 60%)", pointerEvents: "none" }} />
      <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "center" }}>
        <div>
          <div className="eyebrow" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <LiveDot /> {lang === "en" ? "SECTION 01 · LESSON 01 · IN PROGRESS" : "01-BO'LIM · DARS 01 · DAVOM ETMOQDA"}
          </div>
          <h2 className="display" style={{ fontSize: 28, margin: "10px 0 6px", letterSpacing: "-0.02em" }}>
            {lang === "en" ? "Windows architecture" : "Windows arxitekturasi"}
          </h2>
          <p style={{ color: "var(--text-1)", fontSize: 13.5, margin: 0 }}>
            {lang === "en"
              ? "What's actually happening inside the operating system — kernel mode, user mode, syscalls, and where security lives."
              : "Operatsion tizim ichida nima sodir bo'lmoqda — kernel mode, user mode, syscall'lar va xavfsizlik qaerda yashaydi."}
          </p>
          <div style={{ marginTop: 18, maxWidth: 380 }}>
            <Progress value={42} label={lang === "en" ? "Lesson progress" : "Dars taraqqiyoti"} />
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 16, fontSize: 12, color: "var(--text-2)" }}>
            <span><Icon name="clock" size={12} /> &nbsp;{lang === "en" ? "~24 min left" : "~24 min qoldi"}</span>
            <span><Icon name="book" size={12} /> &nbsp;{lang === "en" ? "9 diagrams" : "9 ta diagramma"}</span>
            <span><Icon name="terminal" size={12} /> &nbsp;{lang === "en" ? "3 labs" : "3 ta lab"}</span>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setRoute({ name: "lesson", section: 1, lesson: 1 })}>
          <Icon name="play" size={14} /> {lang === "en" ? "Resume" : "Davom etish"}
        </button>
      </div>
    </div>
  );
}

function SkillTree() {
  return (
    <div style={{ position: "relative", height: 360 }}>
      <svg viewBox="0 0 600 360" style={{ width: "100%", height: "100%" }}>
        <defs>
          <filter id="st-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {[
          { from: [300, 180], to: [150, 90], state: "active" },
          { from: [300, 180], to: [450, 90], state: "open" },
          { from: [300, 180], to: [150, 270], state: "open" },
          { from: [300, 180], to: [450, 270], state: "locked" },
          { from: [150, 90], to: [60, 50], state: "active" },
          { from: [150, 270], to: [60, 310], state: "locked" },
          { from: [450, 90], to: [540, 50], state: "locked" },
          { from: [450, 270], to: [540, 310], state: "locked" },
        ].map((l, i) => (
          <line key={i} x1={l.from[0]} y1={l.from[1]} x2={l.to[0]} y2={l.to[1]}
            stroke={l.state === "active" ? "var(--accent)" : l.state === "open" ? "var(--accent-2)" : "var(--text-3)"}
            strokeWidth={l.state === "locked" ? 1 : 1.6}
            strokeDasharray={l.state === "locked" ? "3 5" : "0"}
            strokeOpacity={l.state === "locked" ? 0.4 : 0.7} />
        ))}

        <g filter="url(#st-glow)">
          <SVGSkillNode x={300} y={180} state="active" icon="cpu" label="Windows" sub="In progress" />
          <SVGSkillNode x={150} y={90} state="active" icon="layers" label="Architecture" sub="L01" />
          <SVGSkillNode x={450} y={90} state="open" icon="terminal" label="PowerShell" sub="Available" />
          <SVGSkillNode x={150} y={270} state="open" icon="settings" label="Admin" sub="Available" />
          <SVGSkillNode x={60} y={50} state="active" icon="key" label="Kernel" sub="L02" small />
          <SVGSkillNode x={540} y={50} state="locked" icon="shield-check" label="Security" sub="Locked" small />
          <SVGSkillNode x={60} y={310} state="locked" icon="search" label="Forensics" sub="Locked" small />
          <SVGSkillNode x={450} y={270} state="locked" icon="skull" label="Pentest" sub="Locked" />
          <SVGSkillNode x={540} y={310} state="locked" icon="server" label="Server" sub="Locked" small />
        </g>
      </svg>
    </div>
  );
}

function SVGSkillNode({ x, y, state, icon, label, sub, small }) {
  const r = small ? 22 : 32;
  const colors = {
    done: { stroke: "var(--accent)", fill: "rgba(0,255,156,0.12)", text: "var(--accent)" },
    active: { stroke: "var(--accent-2)", fill: "var(--bg-2)", text: "var(--accent-2)" },
    open: { stroke: "var(--c-system)", fill: "var(--bg-2)", text: "var(--c-system)" },
    locked: { stroke: "var(--text-3)", fill: "var(--bg-1)", text: "var(--text-3)" },
  };
  const c = colors[state];
  return (
    <g style={{ cursor: "pointer" }}>
      {state === "active" && (
        <circle cx={x} cy={y} r={r + 8} fill="none" stroke="var(--accent-2)" strokeWidth="1" opacity="0.4">
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

function Heatmap() {
  const lang = useLang();
  const weeks = 12, days = 7;
  const data = [];
  for (let w = 0; w < weeks; w++) {
    const col = [];
    for (let d = 0; d < days; d++) {
      const seed = (w * 7 + d) % 13;
      let v = seed > 9 ? 4 : seed > 7 ? 3 : seed > 5 ? 2 : seed > 2 ? 1 : 0;
      if (w > 9 && d > 1) v = Math.max(v, 2);
      if (w === 11 && d > 3) v = 4;
      col.push(v);
    }
    data.push(col);
  }
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
          {data.flat().filter((v) => v > 0).length} {lang === "en" ? "active days" : "faol kun"}
        </span>
      </div>
      <div style={{ marginTop: 16, display: "flex", gap: 4 }}>
        {data.map((col, w) => (
          <div key={w} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {col.map((v, d) => (
              <div key={d} style={{
                width: 14, height: 14, borderRadius: 3,
                background: v === 0 ? "rgba(255,255,255,0.04)" :
                            v === 1 ? "rgba(0,255,156,0.15)" :
                            v === 2 ? "rgba(0,255,156,0.35)" :
                            v === 3 ? "rgba(0,255,156,0.6)" :
                            "var(--accent)",
                border: "1px solid rgba(255,255,255,0.04)",
                boxShadow: v >= 3 ? "0 0 8px var(--accent-glow)" : "none",
              }} />
            ))}
          </div>
        ))}
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

function Achievements() {
  const lang = useLang();
  const items = [
    { icon: "flame", uz: "10 kun seriya", en: "10-day streak", color: "var(--c-attack)", earned: true },
    { icon: "cpu", uz: "Architecture aniq", en: "Architect", color: "var(--c-system)", earned: true },
    { icon: "terminal", uz: "PowerShell ninja", en: "PowerShell ninja", color: "var(--accent)", earned: true },
    { icon: "target", uz: "100% test", en: "Perfect quiz", color: "var(--c-warn)", earned: true },
    { icon: "skull", uz: "Birinchi qon", en: "First blood", color: "var(--c-attack)", earned: false },
    { icon: "trophy", uz: "Bo'limni tugatdi", en: "Section complete", color: "var(--accent-2)", earned: false },
  ];
  return (
    <div className="glass" style={{ padding: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
        <div>
          <div className="eyebrow">// BADGES</div>
          <h3 style={{ margin: "4px 0 0", fontFamily: "var(--font-display)", fontSize: 18 }}>
            {lang === "en" ? "Achievements" : "Yutuqlar"}
          </h3>
        </div>
        <span className="mono" style={{ fontSize: 11, color: "var(--text-2)" }}>12 / 36</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
        {items.map((a, i) => (
          <div key={i} title={lang === "en" ? a.en : a.uz} style={{
            aspectRatio: "1",
            background: a.earned ? `${a.color}12` : "var(--bg-2)",
            border: `1px solid ${a.earned ? a.color + "55" : "var(--border)"}`,
            color: a.earned ? a.color : "var(--text-3)",
            borderRadius: 10,
            display: "grid", placeItems: "center",
            boxShadow: a.earned ? `0 0 12px ${a.color}33` : "none",
            opacity: a.earned ? 1 : 0.5,
            cursor: "pointer", transition: "all 250ms",
          }}>
            <Icon name={a.earned ? a.icon : "lock"} size={18} />
          </div>
        ))}
      </div>
    </div>
  );
}

function UpcomingExam({ setRoute }) {
  const lang = useLang();
  return (
    <div className="glass" style={{ padding: 22, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, background: "radial-gradient(circle, rgba(255,204,68,0.2), transparent 70%)" }} />
      <div className="eyebrow" style={{ color: "var(--c-warn)" }}>// FINAL_EXAM_PREVIEW</div>
      <h3 style={{ margin: "8px 0 6px", fontFamily: "var(--font-display)", fontSize: 18 }}>
        {lang === "en" ? "Section 01 final" : "01-bo'lim final imtihoni"}
      </h3>
      <p style={{ margin: 0, color: "var(--text-2)", fontSize: 12.5 }}>
        {lang === "en" ? "20 questions · 2 hours · 85% to pass" : "20 ta savol · 2 soat · 85% o'tish"}
      </p>
      <div style={{ marginTop: 14 }}>
        <Progress value={1} max={20} label={lang === "en" ? "Lessons complete" : "Darslar yakunlangan"} color="var(--c-warn)" />
      </div>
      <button className="btn" onClick={() => setRoute({ name: "exam" })}
        style={{ marginTop: 16, width: "100%", justifyContent: "center", borderColor: "rgba(255,204,68,0.35)", color: "var(--c-warn)" }}>
        <Icon name="target" size={14} /> {lang === "en" ? "Preview the final" : "Imtihonni ko'rib chiqish"}
      </button>
    </div>
  );
}

function SectionProgress({ setRoute }) {
  const lang = useLang();
  const sections = [
    { num: "01", uz: "Windows asoslari",    en: "Windows Fundamentals",  done: 1,  total: 20, color: "var(--c-system)", state: "active" },
    { num: "02", uz: "Administratsiya",     en: "Administration",        done: 0,  total: 17, color: "var(--c-user)",   state: "active" },
    { num: "03", uz: "Windows xavfsizligi", en: "Windows Security",      done: 0,  total: 20, color: "var(--accent)",   state: "locked" },
    { num: "04", uz: "Pentesting",          en: "Pentesting",            done: 0,  total: 20, color: "var(--c-attack)", state: "locked" },
    { num: "05", uz: "Forensics",           en: "Forensics",             done: 0,  total: 20, color: "var(--c-auth)",   state: "locked" },
    { num: "06", uz: "Server Infra",        en: "Server Infrastructure", done: 0,  total: 20, color: "var(--c-warn)",   state: "locked" },
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
