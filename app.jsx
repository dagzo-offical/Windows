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
    if (s) return migrateProgress(JSON.parse(s));
  } catch {}
  return migrateProgress({});
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
    localStorage.removeItem("wa_cd_c");
    localStorage.removeItem("wa_time_spent");
    localStorage.removeItem("wa_lang");
    localStorage.removeItem("wa_ai_provider");
    localStorage.removeItem("wa_ai_key");
    localStorage.removeItem("wa_ai_active_slot");
  } catch {}
}

const XP_PER_LESSON  = 120;
const XP_DAILY_LOGIN = 25;
const XP_AI_QUESTION = 10;
const AI_DAILY_LIMIT = 5;
function xpToLevel(xp) { return Math.max(1, Math.floor(xp / 500) + 1); }
function todayStr() { return new Date().toISOString().slice(0, 10); }

function migrateProgress(p) {
  const today = todayStr();
  return {
    xp: p.xp || 0,
    level: p.level || 1,
    completedLessons: p.completedLessons || [],
    lessonDates: p.lessonDates || {},
    quizScores: p.quizScores || {},
    name: p.name || "Dagzo",
    initials: p.initials || "DZ",
    lastLoginDate: p.lastLoginDate || null,
    streak: p.streak || 0,
    todayXP: p.todayDate === today ? (p.todayXP || 0) : 0,
    todayDate: p.todayDate === today ? p.todayDate : null,
    aiQuestionsToday: p.aiXPDate === today ? (p.aiQuestionsToday || 0) : 0,
    aiXPDate: p.aiXPDate || null,
  };
}

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

  const markLessonComplete = useACB((lessonKey, score) => {
    _setProgress(prev => {
      if (prev.completedLessons.includes(lessonKey)) return prev;
      const today = todayStr();
      const completedLessons = [...prev.completedLessons, lessonKey];
      const lessonDates = { ...(prev.lessonDates || {}), [lessonKey]: Date.now() };
      const quizScores = { ...(prev.quizScores || {}), ...(score != null ? { [lessonKey]: score } : {}) };
      const xp = prev.xp + XP_PER_LESSON;
      const level = xpToLevel(xp);
      const todayXP = (prev.todayDate === today ? (prev.todayXP || 0) : 0) + XP_PER_LESSON;
      const next = { ...prev, completedLessons, lessonDates, quizScores, xp, level, todayXP, todayDate: today };
      saveProgress(next);
      return next;
    });
  }, []);

  // Daily login XP + streak
  useAE(() => {
    _setProgress(prev => {
      const today = todayStr();
      if (prev.lastLoginDate === today) return prev;
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const newStreak = prev.lastLoginDate === yesterday ? (prev.streak || 0) + 1 : 1;
      const todayXP = (prev.todayDate === today ? (prev.todayXP || 0) : 0) + XP_DAILY_LOGIN;
      const xp = prev.xp + XP_DAILY_LOGIN;
      const next = { ...prev, xp, level: xpToLevel(xp), lastLoginDate: today, streak: newStreak, todayXP, todayDate: today };
      saveProgress(next);
      return next;
    });
  }, []);

  // Generic XP award (reading, AI) — exposed globally for lesson.jsx / ai-chat.jsx
  const addXP = useACB((amount, source) => {
    _setProgress(prev => {
      const today = todayStr();
      if (source === "ai") {
        const q = prev.aiXPDate === today ? (prev.aiQuestionsToday || 0) : 0;
        if (q >= AI_DAILY_LIMIT) return prev;
      }
      const todayXP = (prev.todayDate === today ? (prev.todayXP || 0) : 0) + amount;
      const aiQuestionsToday = source === "ai"
        ? (prev.aiXPDate === today ? (prev.aiQuestionsToday || 0) : 0) + 1
        : (prev.aiXPDate === today ? (prev.aiQuestionsToday || 0) : 0);
      const xp = prev.xp + amount;
      const next = {
        ...prev, xp, level: xpToLevel(xp), todayXP, todayDate: today,
        ...(source === "ai" ? { aiQuestionsToday, aiXPDate: today } : {}),
      };
      saveProgress(next);
      return next;
    });
  }, []);

  useAE(() => {
    window._addXP = addXP;
    return () => { window._addXP = null; };
  }, [addXP]);

  const [profileOpen, setProfileOpen] = useAS(false);
  const [aiChatOpen, setAiChatOpen] = useAS(false);
  const [aiQuery, setAiQuery] = useAS("");
  const [searchOpen, setSearchOpen] = useAS(false);

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
    lessonDates: progress.lessonDates || {},
    quizScores: progress.quizScores || {},
    streak: progress.streak || 0,
    todayXP: progress.todayDate === todayStr() ? (progress.todayXP || 0) : 0,
    aiQuestionsToday: progress.aiXPDate === todayStr() ? (progress.aiQuestionsToday || 0) : 0,
  };

  const screenProps = { setRoute, user, markLessonComplete, onOpenProfile: () => setProfileOpen(true), onOpenAIChat: (query) => { if (query) setAiQuery(query); setAiChatOpen(true); }, aiChatOpen, onOpenSearch: () => setSearchOpen(true) };

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <ParticleBg mode="particles" count={200} />
      <RouteRender route={route} screenProps={screenProps} />
      <AIChat open={aiChatOpen} onClose={() => setAiChatOpen(false)} user={user} route={route} initialQuery={aiQuery} onQueryHandled={() => setAiQuery("")} />
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} setRoute={(r) => { setRoute(r); setSearchOpen(false); }} />}
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
  const [activeSlot, setActiveSlot] = useAS(() => localStorage.getItem("wa_ai_active_slot") || "custom");

  // Built-in API keys — foydalanuvchi o'z kalitini kiritishi shart emas
  const BUILTIN_KEYS = [
    { id: "slot1", provider: "groq", key: "gsk_proj_WA_builtin_slot1_2026", label: "Academy Key #1", labelEn: "Academy Key #1" },
    { id: "slot2", provider: "groq", key: "gsk_proj_WA_builtin_slot2_2026", label: "Academy Key #2", labelEn: "Academy Key #2" },
    { id: "slot3", provider: "gemini", key: "AIzaSyC_WA_builtin_slot3_2026", label: "Academy Key #3", labelEn: "Academy Key #3" },
  ];

  const PROVIDERS = [
    { id: "groq",      label: "Groq",    hint: "gsk_...",    url: "https://console.groq.com/keys",               free: true },
    { id: "openai",    label: "OpenAI",  hint: "sk-...",     url: "https://platform.openai.com/api-keys",        free: false },
    { id: "anthropic", label: "Claude",  hint: "sk-ant-...", url: "https://console.anthropic.com/settings/keys", free: false },
    { id: "gemini",    label: "Gemini",  hint: "AIza...",    url: "https://aistudio.google.com/api-keys",        free: false },
  ];
  const THEMES = ["green", "blue", "purple"];

  const handleSave = () => {
    localStorage.setItem("wa_ai_active_slot", activeSlot);
    if (activeSlot === "custom") {
      localStorage.setItem("wa_ai_provider", provider);
      localStorage.setItem("wa_ai_key", apiKey);
    } else {
      const slot = BUILTIN_KEYS.find(s => s.id === activeSlot);
      if (slot) {
        localStorage.setItem("wa_ai_provider", slot.provider);
        localStorage.setItem("wa_ai_key", slot.key);
      }
    }
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
              {lang === "en" ? "// AI_GRADER · API KEY" : "// AI_TEKSHIRUVCHI · API KALIT"}
            </label>

            {/* Built-in keys */}
            <div style={{ fontSize: 10.5, color: "var(--text-2)", marginBottom: 8, fontFamily: "var(--font-mono)" }}>
              {lang === "en" ? "Built-in keys (select one):" : "O'rnatilgan kalitlar (birini tanlang):"}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
              {BUILTIN_KEYS.map(slot => {
                const isActive = activeSlot === slot.id;
                return (
                  <button key={slot.id} onClick={() => setActiveSlot(slot.id)} style={{
                    appearance: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 14px", borderRadius: 10,
                    border: `1.5px solid ${isActive ? "var(--accent)" : "var(--border)"}`,
                    background: isActive ? "var(--accent-soft)" : "var(--bg-2)",
                    color: isActive ? "var(--accent)" : "var(--text-1)",
                    transition: "all 150ms", width: "100%", textAlign: "left",
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: "50%",
                      border: `2px solid ${isActive ? "var(--accent)" : "var(--border-strong)"}`,
                      background: isActive ? "var(--accent)" : "transparent",
                      display: "grid", placeItems: "center", flexShrink: 0,
                      boxShadow: isActive ? "0 0 8px var(--accent-glow)" : "none",
                    }}>
                      {isActive && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#04060d" }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, fontFamily: "var(--font-display)" }}>
                        {lang === "en" ? slot.labelEn : slot.label}
                      </div>
                      <div style={{ fontSize: 10, color: "var(--text-3)", fontFamily: "var(--font-mono)", marginTop: 1 }}>
                        {slot.provider.toUpperCase()} · {slot.key.slice(0, 12)}···
                      </div>
                    </div>
                    {isActive && <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--accent)", fontWeight: 700 }}>FAOL</span>}
                  </button>
                );
              })}
            </div>

            {/* Custom key option */}
            <div style={{ fontSize: 10.5, color: "var(--text-2)", marginBottom: 6, fontFamily: "var(--font-mono)" }}>
              {lang === "en" ? "Or use your own key:" : "Yoki o'z kalitingizni ishlating:"}
            </div>
            <button onClick={() => setActiveSlot("custom")} style={{
              appearance: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 14px", borderRadius: 10, width: "100%", textAlign: "left",
              border: `1.5px solid ${activeSlot === "custom" ? "var(--accent)" : "var(--border)"}`,
              background: activeSlot === "custom" ? "var(--accent-soft)" : "var(--bg-2)",
              color: activeSlot === "custom" ? "var(--accent)" : "var(--text-1)",
              transition: "all 150ms", marginBottom: 10,
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: "50%",
                border: `2px solid ${activeSlot === "custom" ? "var(--accent)" : "var(--border-strong)"}`,
                background: activeSlot === "custom" ? "var(--accent)" : "transparent",
                display: "grid", placeItems: "center", flexShrink: 0,
                boxShadow: activeSlot === "custom" ? "0 0 8px var(--accent-glow)" : "none",
              }}>
                {activeSlot === "custom" && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#04060d" }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, fontFamily: "var(--font-display)" }}>
                  {lang === "en" ? "Custom API key" : "Shaxsiy API kalit"}
                </div>
                <div style={{ fontSize: 10, color: "var(--text-3)", fontFamily: "var(--font-mono)", marginTop: 1 }}>
                  {lang === "en" ? "Enter your own provider & key" : "O'z provayderingiz va kalitingiz"}
                </div>
              </div>
              {activeSlot === "custom" && <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--accent)", fontWeight: 700 }}>FAOL</span>}
            </button>

            {activeSlot === "custom" && (
              <>
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
              </>
            )}
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
