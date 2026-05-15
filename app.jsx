// app.jsx — main app: router, theme, language, profile

const { useState: useAS, useEffect: useAE, useCallback: useACB } = React;

const THEME_KEY = "wa_theme";

function loadTheme() {
  try { return localStorage.getItem(THEME_KEY) || "green"; } catch { return "green"; }
}

// ── Progress persistence ──────────────────────────────────────────────────────
const PROGRESS_KEY = "wa_progress";
const ROUTE_KEY    = "wa_route";

function loadProgress() {
  try {
    const s = localStorage.getItem(PROGRESS_KEY);
    if (s) return JSON.parse(s);
  } catch {}
  return { xp: 0, level: 1, completedLessons: [], name: "Dagzo", initials: "DZ" };
}

function saveProgress(p) {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)); } catch {}
}

function loadRoute() {
  try {
    const s = localStorage.getItem(ROUTE_KEY);
    if (s) {
      const r = JSON.parse(s);
      // Never restore mid-lesson — always open at dashboard
      if (r.name === "lesson") return { name: "dashboard" };
      return r;
    }
  } catch {}
  return { name: "landing" };
}

function saveRoute(r) {
  try { localStorage.setItem(ROUTE_KEY, JSON.stringify(r)); } catch {}
}

function clearAll() {
  try {
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(ROUTE_KEY);
    localStorage.removeItem("wa_cooldown_end");
    localStorage.removeItem("wa_lang");
    localStorage.removeItem("wa_ai_provider");
    localStorage.removeItem("wa_ai_key");
  } catch {}
}

const XP_PER_LESSON = 120;
function xpToLevel(xp) { return Math.max(1, Math.floor(xp / 500) + 1); }

// ─────────────────────────────────────────────────────────────────────────────
function App() {
  const [theme, setThemeState] = useAS(loadTheme);
  const [lang, _setLang] = useAS(() => {
    try { return localStorage.getItem("wa_lang") || "uz"; } catch { return "uz"; }
  });
  const setLang = (v) => {
    _setLang(v);
    try { localStorage.setItem("wa_lang", v); } catch {}
  };

  const setTheme = (v) => {
    setThemeState(v);
    try { localStorage.setItem(THEME_KEY, v); } catch {}
  };

  const [route, _setRoute] = useAS(loadRoute);
  const setRoute = (r) => {
    _setRoute(r);
    saveRoute(r);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const [progress, _setProgress] = useAS(loadProgress);

  const updateProgress = useACB((patch) => {
    _setProgress(prev => {
      const next = { ...prev, ...patch };
      saveProgress(next);
      return next;
    });
  }, []);

  const markLessonComplete = useACB((lessonKey) => {
    _setProgress(prev => {
      if (prev.completedLessons.includes(lessonKey)) return prev;
      const completedLessons = [...prev.completedLessons, lessonKey];
      const xp = prev.xp + XP_PER_LESSON;
      const level = xpToLevel(xp);
      const next = { ...prev, completedLessons, xp, level };
      saveProgress(next);
      return next;
    });
  }, []);

  const [profileOpen, setProfileOpen] = useAS(false);

  useAE(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.density = "cozy";
    document.documentElement.dataset.motion = "high";
    document.documentElement.dataset.lang = lang;
    document.documentElement.lang = lang === "en" ? "en" : "uz";
  }, [theme, lang]);

  const user = {
    name: progress.name || "Dagzo",
    initials: (progress.name || "Dagzo").slice(0, 2).toUpperCase(),
    level: progress.level || 1,
    xp: progress.xp ? progress.xp.toLocaleString() : "0",
    completedLessons: progress.completedLessons || [],
  };

  const screenProps = { setRoute, user, markLessonComplete, onOpenProfile: () => setProfileOpen(true) };

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <ParticleBg mode="particles" count={80} />
      <RouteRender route={route} screenProps={screenProps} />
      {profileOpen && (
        <ProfileModal
          user={user}
          theme={theme}
          setTheme={setTheme}
          onSave={(patch) => { updateProgress(patch); setProfileOpen(false); }}
          onReset={() => {
            if (!window.confirm(lang === "en" ? "Reset all progress?" : "Barcha progressni o'chirasizmi?")) return;
            clearAll();
            _setProgress(loadProgress());
            _setRoute({ name: "landing" });
            saveRoute({ name: "landing" });
            setProfileOpen(false);
          }}
          onClose={() => setProfileOpen(false)}
        />
      )}
    </LangContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────
// Profile Modal
// ─────────────────────────────────────────────────────────────
function ProfileModal({ user, theme, setTheme, onSave, onReset, onClose }) {
  const lang = useLang();
  const [name, setName] = useAS(user.name);
  const [provider, setProvider] = useAS(() => localStorage.getItem("wa_ai_provider") || "");
  const [apiKey, setApiKey]     = useAS(() => localStorage.getItem("wa_ai_key") || "");
  const [showKey, setShowKey]   = useAS(false);
  const [saved, setSaved]       = useAS(false);

  const PROVIDERS = [
    { id: "groq",      label: "Groq",    hint: "gsk_...",    url: "https://console.groq.com/keys",               free: true },
    { id: "openai",    label: "OpenAI",  hint: "sk-...",     url: "https://platform.openai.com/api-keys",        free: false },
    { id: "anthropic", label: "Claude",  hint: "sk-ant-...", url: "https://console.anthropic.com/settings/keys", free: false },
    { id: "gemini",    label: "Gemini",  hint: "AIza...",    url: "https://aistudio.google.com/api-keys",        free: false },
  ];
  const THEMES = ["green", "blue", "purple"];

  const handleSave = () => {
    localStorage.setItem("wa_ai_provider", provider);
    localStorage.setItem("wa_ai_key", apiKey);
    onSave({ name: name.trim() || "Dagzo" });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const initials = (name.trim() || "Dagzo").slice(0, 2).toUpperCase();

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(2,4,10,0.8)", backdropFilter: "blur(8px)", display: "grid", placeItems: "center", padding: 24 }}
         onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "rgba(8,12,24,0.97)", border: "1px solid var(--accent-border)", borderRadius: 20, width: "100%", maxWidth: 480, boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 40px var(--accent-soft)", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ padding: "22px 28px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "linear-gradient(180deg,rgba(0,255,136,0.04),transparent)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#00ff88,#0af,#a855f7)", padding: 2, boxShadow: "0 0 16px rgba(0,255,136,0.4)" }}>
                <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#0d1a12,#04060d)", display: "grid", placeItems: "center" }}>
                  <span style={{ background: "linear-gradient(135deg,#00ff88,#0af)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontSize: 16, fontWeight: 900, fontFamily: "var(--font-mono)" }}>{initials}</span>
                </div>
              </div>
              <div style={{ position: "absolute", bottom: 2, right: 2, width: 11, height: 11, borderRadius: "50%", background: "#00ff88", border: "2px solid #04060d", boxShadow: "0 0 6px #00ff88" }} />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700 }}>{lang === "en" ? "Profile" : "Profil"}</div>
              <div style={{ fontSize: 11, color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>LVL {user.level} · {user.xp} XP · {user.completedLessons.length} {lang === "en" ? "lessons" : "dars"}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ appearance: "none", background: "none", border: "none", cursor: "pointer", color: "var(--text-2)", padding: 8 }}>
            <Icon name="x" size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 22 }}>

          {/* Name */}
          <div>
            <label style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
              {lang === "en" ? "// DISPLAY_NAME" : "// ISM"}
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={30}
              style={{ width: "100%", boxSizing: "border-box", background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px", fontSize: 14, fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--text-0)", outline: "none" }}
              onFocus={e => e.target.style.borderColor = "var(--accent)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
          </div>

          {/* Theme */}
          <div>
            <label style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
              {lang === "en" ? "// ACCENT_THEME" : "// RANG_MAVZU"}
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              {THEMES.map(t => {
                const colors = { green: "#00ff88", blue: "#4d8bff", purple: "#a855f7" };
                return (
                  <button key={t} onClick={() => setTheme(t)} style={{
                    flex: 1, padding: "10px 0", borderRadius: 10, cursor: "pointer", appearance: "none",
                    border: `2px solid ${theme === t ? colors[t] : "var(--border)"}`,
                    background: theme === t ? `${colors[t]}15` : "var(--bg-2)",
                    color: theme === t ? colors[t] : "var(--text-2)",
                    fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700,
                    textTransform: "capitalize", transition: "all 150ms",
                    boxShadow: theme === t ? `0 0 12px ${colors[t]}44` : "none",
                  }}>{t}</button>
                );
              })}
            </div>
          </div>

          {/* AI Provider */}
          <div>
            <label style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
              {lang === "en" ? "// AI_GRADER · PROVIDER" : "// AI_TEKSHIRUVCHI · PROVIDER"}
            </label>
            <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
              {PROVIDERS.map(p => (
                <button key={p.id} onClick={() => setProvider(p.id)} style={{
                  flex: "1 1 auto", padding: "9px 8px", borderRadius: 8, cursor: "pointer", appearance: "none",
                  border: `1.5px solid ${provider === p.id ? "var(--accent)" : "var(--border)"}`,
                  background: provider === p.id ? "var(--accent-soft)" : "var(--bg-2)",
                  color: provider === p.id ? "var(--accent)" : "var(--text-2)",
                  fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700,
                  transition: "all 150ms", display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                }}>
                  {p.label}
                  {p.free && <span style={{ fontSize: 9, color: "var(--accent)", opacity: 0.8, fontWeight: 900 }}>BEPUL</span>}
                </button>
              ))}
            </div>
            {provider && (() => {
              const prov = PROVIDERS.find(p => p.id === provider);
              return (
                <div>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showKey ? "text" : "password"}
                      placeholder={prov?.hint}
                      value={apiKey}
                      onChange={e => setApiKey(e.target.value)}
                      style={{ width: "100%", boxSizing: "border-box", background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 40px 10px 14px", fontSize: 13, fontFamily: "var(--font-mono)", color: "var(--text-0)", outline: "none" }}
                      onFocus={e => e.target.style.borderColor = "var(--accent)"}
                      onBlur={e => e.target.style.borderColor = "var(--border)"}
                    />
                    <button onClick={() => setShowKey(s => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", fontSize: 14, padding: 0 }}>
                      {showKey ? "🙈" : "👁"}
                    </button>
                  </div>
                  {prov?.url && (
                    <a href={prov.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 7, fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--accent)", opacity: 0.8, textDecoration: "none" }}>
                      <Icon name="arrow-right" size={10} /> {lang === "en" ? `Get ${prov.label} API key →` : `${prov.label} API kalitini olish →`}
                    </a>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
            <button onClick={onReset} style={{ flex: "0 0 auto", padding: "10px 16px", borderRadius: 10, cursor: "pointer", appearance: "none", border: "1px solid rgba(255,58,94,0.3)", background: "rgba(255,58,94,0.06)", color: "var(--c-attack)", fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700 }}>
              {lang === "en" ? "Reset progress" : "Progressni o'chir"}
            </button>
            <button onClick={handleSave} style={{ flex: 1, padding: "12px 0", borderRadius: 10, cursor: "pointer", appearance: "none", border: `1px solid ${saved ? "var(--accent)" : "var(--accent-border)"}`, background: saved ? "var(--accent-soft)" : "var(--accent)", color: saved ? "var(--accent)" : "#04060d", fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, transition: "all 200ms", boxShadow: "0 0 20px var(--accent-glow)" }}>
              {saved ? (lang === "en" ? "✓ Saved!" : "✓ Saqlandi!") : (lang === "en" ? "Save changes" : "Saqlash")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function RouteRender({ route, screenProps }) {
  switch (route.name) {
    case "landing":   return <LandingScreen {...screenProps} />;
    case "dashboard": return <DashboardScreen {...screenProps} />;
    case "section":   return <SectionScreen {...screenProps} section={route.section || 1} />;
    case "lesson":    return <LessonScreen {...screenProps} lessonNum={route.lesson || 1} />;
    case "cooldown":  return <CooldownScreen {...screenProps} />;
    case "exam":      return <FinalExamScreen {...screenProps} />;
    default:          return <LandingScreen {...screenProps} />;
  }
}

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
