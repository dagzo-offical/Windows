// landing.jsx — marketing / entry page (single-lang)

function LandingScreen({ setRoute }) {
  const lang = useLang();

  const stats = [
    { n: "3",    uz: "Bo'limlar",    en: "Sections" },
    { n: "39",   uz: "Darslar",      en: "Lessons" },
    { n: "70+",  uz: "Laboratoriya", en: "Labs" },
    { n: "AI",   uz: "Tekshiruv",    en: "Validation" },
  ];

  const sections = [
    { num: "01", uz: "Windows asoslari",      en: "Windows Internals & Architecture",  icon: "cpu",          lessons: 20, color: "var(--c-system)" },
    { num: "02", uz: "Administratsiya",       en: "Enterprise Administration",         icon: "settings",     lessons: 20, color: "var(--c-user)" },
    { num: "03", uz: "Windows xavfsizligi",   en: "Authentication & Defense",          icon: "shield-check", lessons: 20, color: "var(--accent)" },
    { num: "04", uz: "Windows Pentesting",    en: "Red Team Operations",               icon: "skull",        lessons: 20, color: "var(--c-attack)" },
    { num: "05", uz: "Windows Forensics",     en: "Incident Response & Hunting",       icon: "search",       lessons: 20, color: "var(--c-auth)" },
    { num: "06", uz: "Server Infrastruktura", en: "Enterprise Deployment",             icon: "server",       lessons: 20, color: "var(--c-warn)" },
  ];

  return (
    <div>
      <TopNav route={{ name: "landing" }} setRoute={setRoute} user={null} />

      {/* HERO */}
      <section style={{ position: "relative", padding: "80px 28px 60px", maxWidth: 1320, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 48, alignItems: "center" }}>
          <div className="fade-up">
            <div className="eyebrow" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <LiveDot />
              <span>SECTOR_03 // RED_TEAM_BLUE_TEAM_TRAINING</span>
            </div>

            {lang === "en" ? (
              <h1 className="display" style={heroH1}>
                The first academy that
                <br />
                truly teaches{" "}
                <span style={gradient}>Windows security</span>
                .
              </h1>
            ) : (
              <h1 className="display" style={heroH1}>
                Windows xavfsizligini
                <br />
                <span style={gradient}>egallashning</span> ilk akademiyasi.
              </h1>
            )}

            <p style={{ marginTop: 22, fontSize: 17, lineHeight: 1.55, color: "var(--text-1)", maxWidth: 580 }}>
              {lang === "en"
                ? "A professional learning platform that teaches Windows internals, Active Directory, offensive and defensive security down to the kernel — with AI-graded mastery checks."
                : "Windows arxitekturasi, Active Directory, hujum va himoyani kernel-darajagacha o'rganadigan, AI tomonidan baholanadigan, professional o'quv platforma."}
            </p>

            <div style={{ display: "flex", gap: 12, marginTop: 36, alignItems: "center" }}>
              <button className="btn btn-primary" onClick={() => setRoute({ name: "dashboard" })}>
                <Icon name="play" size={14} /> {lang === "en" ? "Start training" : "Boshlash"}
              </button>
              <button className="btn" onClick={() => setRoute({ name: "section", section: 1 })}>
                <Icon name="book" size={14} /> {lang === "en" ? "See curriculum" : "Dasturni ko'rish"}
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginTop: 56, paddingTop: 32, borderTop: "1px solid var(--border)" }}>
              {stats.map((s, i) => (
                <div key={i} className="stat fade-up" style={{ animationDelay: `${0.1 + i * 0.08}s` }}>
                  <div className="stat-n">{s.n}</div>
                  <div className="stat-l">{lang === "en" ? s.en : s.uz}</div>
                </div>
              ))}
            </div>
          </div>

          <HeroVisual />
        </div>
      </section>

      {/* SECTIONS GRID */}
      <section style={{ maxWidth: 1320, margin: "0 auto", padding: "60px 28px" }}>
        <SectionH
          eyebrow="// CURRICULUM"
          uz="Olti bo'limli yo'l xaritasi"
          en="A six-section roadmap from fundamentals to red-team mastery"
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 20 }}>
          {sections.map((s, i) => (
            <button key={s.num}
              onClick={() => setRoute({ name: "section", section: i + 1 })}
              style={sectionCardBtn}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = s.color;
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = `0 12px 40px ${s.color}22`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div className="mono" style={{ fontSize: 11, color: s.color, letterSpacing: 0.18, textTransform: "uppercase" }}>
                  {lang === "en" ? `SECTION ${s.num}` : `${s.num}-BO'LIM`}
                </div>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: s.color + "12", border: `1px solid ${s.color}44`, display: "grid", placeItems: "center", color: s.color }}>
                  <Icon name={s.icon} size={18} />
                </div>
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 600, margin: "16px 0 8px", letterSpacing: "-0.01em" }}>
                {lang === "en" ? s.en : s.uz}
              </h3>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 22 }}>
                <span className="mono" style={{ fontSize: 11, color: "var(--text-2)" }}>
                  {lang === "en" ? `${s.lessons} lessons · ${Math.floor(s.lessons * 0.4)} labs` : `${s.lessons} ta dars · ${Math.floor(s.lessons * 0.4)} ta lab`}
                </span>
                <span style={{ color: s.color, display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                  <Icon name="arrow-right" size={14} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ maxWidth: 1320, margin: "0 auto", padding: "60px 28px" }}>
        <SectionH eyebrow="// FEATURES" uz="Akademiyaning ustun jihatlari" en="What makes this different" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          <FeatureCard icon="zap"
            uz={["AI-baholash", "Yozma javoblar Claude tomonidan tushuncha chuqurligi va kontekst bo'yicha tahlil qilinadi. 70 baldan past — keyingi darsga o'tib bo'lmaydi."]}
            en={["Semantic AI grading", "Written answers are graded by Claude for depth and context. Below 70 you don't advance."]} />
          <FeatureCard icon="lock" color="var(--c-warn)"
            uz={["Haqiqiy cooldown", "Test yiqilgan zahoti 30 minutlik bloklash. Hech qanday cheat, hech qanday speed-run."]}
            en={["Real consequence", "Fail a quiz and you're locked for 30 minutes. No cheats, no speed-runs."]} />
          <FeatureCard icon="target" color="var(--c-attack)"
            uz={["MITRE ATT&CK uslubida", "Har bir hujum darsi tactic, technique va detection opportunity bilan birga keladi."]}
            en={["Mapped to MITRE ATT&CK", "Every offensive lesson maps to a tactic, technique, and detection opportunity."]} />
          <FeatureCard icon="graph" color="var(--c-system)"
            uz={["Jonli laboratoriya", "PowerShell, Mimikatz, BloodHound, CrackMapExec — annotatsion screenshot va step-by-step."]}
            en={["Live labs", "PowerShell, Mimikatz, BloodHound, CrackMapExec — annotated and step-by-step."]} />
          <FeatureCard icon="globe" color="var(--c-auth)"
            uz={["Ikki tilli kontent", "Har bir dars va savol o'zbek va ingliz tillarida. Yuqoridagi tugma orqali bir zumda almashtiring."]}
            en={["Fully bilingual", "Every lesson and quiz in both Uzbek and English — toggle from the top bar anytime."]} />
          <FeatureCard icon="shield-check"
            uz={["Red va Blue Team", "Har bir hujum keyingi darsda himoya rejasi va detection logikasi bilan to'ldiriladi."]}
            en={["Red & Blue side-by-side", "Every offensive technique is paired with a defensive playbook and detection logic."]} />
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 1320, margin: "60px auto 80px", padding: "0 28px" }}>
        <div className="glass-strong" style={{ padding: "48px", textAlign: "center", borderRadius: 24, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at top, var(--accent-soft), transparent 60%)" }} />
          <div style={{ position: "relative" }}>
            <div className="eyebrow">// READY_TO_BREAK_IN</div>
            <h2 className="display" style={{ fontSize: 40, margin: "12px 0 8px", letterSpacing: "-0.02em" }}>
              {lang === "en" ? "Start with lesson one." : "Birinchi darsdan boshlang."}
            </h2>
            <p style={{ color: "var(--text-1)", fontSize: 15 }}>
              {lang === "en" ? "Windows architecture is waiting — what's inside the OS, really." : "Windows arxitekturasi sizni kutmoqda — OS ichida nima borligini bilib oling."}
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 28 }}>
              <button className="btn btn-primary" onClick={() => setRoute({ name: "lesson", section: 1, lesson: 1 })}>
                <Icon name="play" size={14} /> {lang === "en" ? "Open first lesson" : "Birinchi darsni ochish"}
              </button>
              <button className="btn" onClick={() => setRoute({ name: "dashboard" })}>
                <Icon name="user" size={14} /> {lang === "en" ? "My dashboard" : "Mening dashboardim"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

const heroH1 = {
  fontSize: "clamp(44px, 5.4vw, 76px)",
  lineHeight: 1.02, margin: 0,
  letterSpacing: "-0.035em",
  fontWeight: 600,
};
const gradient = {
  background: "linear-gradient(90deg, var(--accent), var(--accent-2))",
  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};
const sectionCardBtn = {
  appearance: "none", border: 0, cursor: "pointer", textAlign: "left",
  background: "var(--surface)", borderRadius: 16,
  padding: "22px 22px 20px",
  border: "1px solid var(--border)",
  transition: "all 250ms",
  position: "relative", overflow: "hidden",
  color: "inherit", font: "inherit",
};

function FeatureCard({ icon, uz, en, color = "var(--accent)" }) {
  const lang = useLang();
  const [title, desc] = lang === "en" ? en : uz;
  return (
    <div className="glass" style={{ padding: "22px", borderRadius: 16 }}>
      <div style={{ width: 38, height: 38, borderRadius: 8, background: color + "12", border: `1px solid ${color}33`, display: "grid", placeItems: "center", color, marginBottom: 16 }}>
        <Icon name={icon} size={18} />
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 13, color: "var(--text-1)", lineHeight: 1.55 }}>{desc}</div>
    </div>
  );
}

// Hero visual — orbiting Windows architecture
function HeroVisual() {
  const lang = useLang();
  return (
    <div style={{ position: "relative", aspectRatio: "1", maxWidth: 480, marginLeft: "auto" }}>
      <svg viewBox="0 0 400 400" style={{ width: "100%", height: "100%" }}>
        <defs>
          <radialGradient id="core-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
          <filter id="hero-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {[180, 140, 100].map((r, i) => (
          <circle key={i} cx="200" cy="200" r={r}
            fill="none" stroke="var(--accent)" strokeOpacity={0.15 - i * 0.03}
            strokeWidth="1" strokeDasharray="4 6"
            style={{ transformOrigin: "200px 200px", animation: `spin-slow ${30 + i * 10}s linear infinite ${i % 2 ? "reverse" : "normal"}` }} />
        ))}

        <circle cx="200" cy="200" r="80" fill="url(#core-grad)" />
        <circle cx="200" cy="200" r="42" fill="var(--bg-2)" stroke="var(--accent)" strokeWidth="2" filter="url(#hero-glow)" />
        <g transform="translate(180, 180)" fill="var(--accent)">
          <rect x="0" y="0" width="18" height="18" rx="2" />
          <rect x="22" y="0" width="18" height="18" rx="2" />
          <rect x="0" y="22" width="18" height="18" rx="2" />
          <rect x="22" y="22" width="18" height="18" rx="2" />
        </g>

        <g style={{ transformOrigin: "200px 200px", animation: "spin-slow 24s linear infinite" }}>
          {["lock", "key", "shield", "skull", "server", "users", "database", "terminal"].map((ic, i) => {
            const ang = (i / 8) * Math.PI * 2;
            const r = i % 2 ? 140 : 180;
            const x = 200 + Math.cos(ang) * r;
            const y = 200 + Math.sin(ang) * r;
            const colors = ["var(--c-attack)", "var(--c-auth)", "var(--accent)", "var(--c-attack)", "var(--c-system)", "var(--c-user)", "var(--c-system)", "var(--accent-2)"];
            return (
              <g key={i} style={{ transformOrigin: `${x}px ${y}px`, animation: `spin-slow 24s linear infinite reverse` }}>
                <circle cx={x} cy={y} r="20" fill="var(--bg-2)" stroke={colors[i]} strokeWidth="1.5" />
                <foreignObject x={x - 10} y={y - 10} width="20" height="20" style={{ color: colors[i] }}>
                  <Icon name={ic} size={20} />
                </foreignObject>
              </g>
            );
          })}
        </g>

        {[0, 1, 2, 3].map((i) => {
          const ang = (i / 4) * Math.PI * 2;
          return (
            <line key={i}
              x1="200" y1="200"
              x2={200 + Math.cos(ang) * 180} y2={200 + Math.sin(ang) * 180}
              stroke="var(--accent)" strokeOpacity="0.2" strokeWidth="1"
              strokeDasharray="2 6" />
          );
        })}
      </svg>

      <div style={{ position: "absolute", top: "5%", left: "-5%", background: "var(--surface)", border: "1px solid var(--accent-border)", borderRadius: 8, padding: "8px 12px", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)", backdropFilter: "blur(10px)" }}>
        <LiveDot /> &nbsp;LSASS · {lang === "en" ? "monitored" : "kuzatilmoqda"}
      </div>
      <div style={{ position: "absolute", bottom: "12%", right: "-5%", background: "var(--surface)", border: "1px solid rgba(255,58,94,0.3)", borderRadius: 8, padding: "8px 12px", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--c-attack)", backdropFilter: "blur(10px)" }}>
        <Icon name="skull" size={11} /> &nbsp;Kerberoasting active
      </div>
      <div style={{ position: "absolute", top: "45%", right: "-8%", background: "var(--surface)", border: "1px solid rgba(184,140,255,0.3)", borderRadius: 8, padding: "8px 12px", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--c-auth)", backdropFilter: "blur(10px)" }}>
        <Icon name="key" size={11} /> &nbsp;TGT issued
      </div>
    </div>
  );
}

function Footer() {
  const lang = useLang();
  return (
    <footer style={{ borderTop: "1px solid var(--border)", padding: "32px 28px", maxWidth: 1320, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)", letterSpacing: 0.1, textTransform: "uppercase" }}>
          © 2026 Windows Academy · build 2026.05.15
        </div>
        <div style={{ display: "flex", gap: 18, fontSize: 12, color: "var(--text-2)" }}>
          <a href="#" style={footerLink}>{lang === "en" ? "Documentation" : "Hujjatlar"}</a>
          <a href="#" style={footerLink}>Discord</a>
          <a href="#" style={footerLink}>GitHub</a>
          <a href="#" style={footerLink}>Status</a>
        </div>
      </div>
    </footer>
  );
}
const footerLink = { color: "inherit", textDecoration: "none" };

window.LandingScreen = LandingScreen;
