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
    localStorage.removeItem("wa_ai_keys");
    localStorage.removeItem("wa_ai_active_id");
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
  const [saved, setSaved] = useAS(false);
  const [aiKeys, setAiKeys] = useAS(() => loadAiKeys());
  const [activeId, setActiveId] = useAS(() => {
    const k = loadAiKeys();
    const id = localStorage.getItem("wa_ai_active_id") || "";
    return k.find(x => x.id === id) ? id : (k[0]?.id || "");
  });
  const [addingKey, setAddingKey] = useAS(false);
  const [newProvider, setNewProvider] = useAS("");
  const [newKey, setNewKey] = useAS("");
  const [showNewKey, setShowNewKey] = useAS(false);

  const PROVIDERS = [
    { id: "groq",      label: "Groq",    hint: "gsk_...",    url: "https://console.groq.com/keys",               free: true },
    { id: "openai",    label: "OpenAI",  hint: "sk-...",     url: "https://platform.openai.com/api-keys",        free: false },
    { id: "anthropic", label: "Claude",  hint: "sk-ant-...", url: "https://console.anthropic.com/settings/keys", free: false },
    { id: "gemini",    label: "Gemini",  hint: "AIza...",    url: "https://aistudio.google.com/api-keys",        free: false },
  ];
  const THEMES = ["green", "blue", "purple"];

  const handleSave = () => {
    onSave({ name: name.trim() || "Dagzo" });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const addKey = () => {
    if (!newProvider || !newKey.trim() || aiKeys.length >= 3) return;
    const entry = { id: Date.now().toString(), provider: newProvider, key: newKey.trim() };
    const updated = [...aiKeys, entry];
    setAiKeys(updated);
    try { localStorage.setItem("wa_ai_keys", JSON.stringify(updated)); } catch {}
    if (!activeId) {
      setActiveId(entry.id);
      try { localStorage.setItem("wa_ai_active_id", entry.id); } catch {}
    }
    setNewProvider(""); setNewKey(""); setAddingKey(false);
  };

  const removeKey = (id) => {
    const updated = aiKeys.filter(k => k.id !== id);
    setAiKeys(updated);
    try { localStorage.setItem("wa_ai_keys", JSON.stringify(updated)); } catch {}
    if (activeId === id) {
      const next = updated[0]?.id || "";
      setActiveId(next);
      try { localStorage.setItem("wa_ai_active_id", next); } catch {}
    }
  };

  const activateKey = (id) => {
    setActiveId(id);
    try { localStorage.setItem("wa_ai_active_id", id); } catch {}
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

          {/* AI Keys */}
          <div>
            <label style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
              {lang === "en" ? "// AI_KEYS" : "// AI_KALITLAR"}
            </label>

            {aiKeys.map(k => {
              const prov = PROVIDERS.find(p => p.id === k.provider);
              const isActive = k.id === activeId;
              const maskedKey = k.key.length > 8 ? k.key.slice(0,4) + "****" + k.key.slice(-4) : "****";
              return (
                <div key={k.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 10, marginBottom: 6, border: `1.5px solid ${isActive ? "var(--accent)" : "var(--border)"}`, background: isActive ? "var(--accent-soft)" : "var(--bg-2)" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: isActive ? "var(--accent)" : "var(--border)", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: isActive ? "var(--accent)" : "var(--text-1)" }}>{prov?.label || k.provider}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)", marginLeft: 8 }}>{maskedKey}</span>
                  </div>
                  {isActive
                    ? <span style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--accent)", fontWeight: 900, padding: "2px 6px", border: "1px solid var(--accent)", borderRadius: 4 }}>{lang === "en" ? "ACTIVE" : "FAOL"}</span>
                    : <button onClick={() => activateKey(k.id)} style={{ appearance: "none", background: "none", border: "1px solid var(--border)", borderRadius: 6, cursor: "pointer", fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--text-2)", padding: "2px 6px", fontWeight: 700 }}>{lang === "en" ? "Activate" : "Faollashtir"}</button>
                  }
                  <button onClick={() => removeKey(k.id)} style={{ appearance: "none", background: "none", border: "none", cursor: "pointer", color: "var(--c-attack)", opacity: 0.7, padding: "0 2px", fontSize: 14, flexShrink: 0, lineHeight: 1 }}>✕</button>
                </div>
              );
            })}

            {aiKeys.length === 0 && !addingKey && (
              <div style={{ fontSize: 11, color: "var(--text-3)", fontFamily: "var(--font-mono)", padding: "6px 0 4px", textAlign: "center" }}>
                {lang === "en" ? "No API keys added yet" : "Hali API kalit qo'shilmagan"}
              </div>
            )}

            {addingKey && (
              <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 10, padding: 12, marginTop: 4, marginBottom: 4 }}>
                <div style={{ display: "flex", gap: 5, marginBottom: 8, flexWrap: "wrap" }}>
                  {PROVIDERS.map(p => (
                    <button key={p.id} onClick={() => setNewProvider(p.id)} style={{
                      flex: "1 1 auto", padding: "7px 6px", borderRadius: 7, cursor: "pointer", appearance: "none",
                      border: `1.5px solid ${newProvider === p.id ? "var(--accent)" : "var(--border)"}`,
                      background: newProvider === p.id ? "var(--accent-soft)" : "transparent",
                      color: newProvider === p.id ? "var(--accent)" : "var(--text-2)",
                      fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, transition: "all 150ms",
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
                    }}>
                      {p.label}
                      {p.free && <span style={{ fontSize: 8, color: "var(--accent)", fontWeight: 900 }}>BEPUL</span>}
                    </button>
                  ))}
                </div>
                {newProvider && (
                  <div style={{ position: "relative", marginBottom: 8 }}>
                    <input
                      type={showNewKey ? "text" : "password"}
                      placeholder={PROVIDERS.find(p => p.id === newProvider)?.hint || ""}
                      value={newKey}
                      onChange={e => setNewKey(e.target.value)}
                      style={{ width: "100%", boxSizing: "border-box", background: "rgba(0,0,0,0.25)", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 38px 9px 12px", fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text-0)", outline: "none" }}
                      onFocus={e => e.target.style.borderColor = "var(--accent)"}
                      onBlur={e => e.target.style.borderColor = "var(--border)"}
                    />
                    <button onClick={() => setShowNewKey(s => !s)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", fontSize: 13, padding: 0 }}>
                      {showNewKey ? "🙈" : "👁"}
                    </button>
                  </div>
                )}
                {newProvider && (() => {
                  const prov = PROVIDERS.find(p => p.id === newProvider);
                  return prov?.url && (
                    <a href={prov.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 8, fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--accent)", opacity: 0.8, textDecoration: "none" }}>
                      <Icon name="arrow-right" size={9} /> {lang === "en" ? `Get ${prov.label} key →` : `${prov.label} kalitini olish →`}
                    </a>
                  );
                })()}
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => { setAddingKey(false); setNewProvider(""); setNewKey(""); }} style={{ flex: "0 0 auto", padding: "7px 12px", borderRadius: 7, cursor: "pointer", appearance: "none", border: "1px solid var(--border)", background: "transparent", color: "var(--text-2)", fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700 }}>
                    {lang === "en" ? "Cancel" : "Bekor"}
                  </button>
                  <button onClick={addKey} disabled={!newProvider || !newKey.trim()} style={{ flex: 1, padding: "7px 0", borderRadius: 7, cursor: newProvider && newKey.trim() ? "pointer" : "not-allowed", appearance: "none", border: `1px solid ${newProvider && newKey.trim() ? "var(--accent)" : "var(--border)"}`, background: newProvider && newKey.trim() ? "var(--accent)" : "transparent", color: newProvider && newKey.trim() ? "#04060d" : "var(--text-3)", fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700 }}>
                    {lang === "en" ? "Add Key" : "Kalit qo'shish"}
                  </button>
                </div>
              </div>
            )}

            {!addingKey && aiKeys.length < 3 && (
              <button onClick={() => setAddingKey(true)} style={{ width: "100%", marginTop: 6, padding: "8px 0", borderRadius: 9, cursor: "pointer", appearance: "none", border: "1px dashed var(--border)", background: "transparent", color: "var(--text-2)", fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                + {lang === "en" ? "Add API key" : "API kalit qo'shish"}{aiKeys.length > 0 ? ` (${aiKeys.length}/3)` : ""}
              </button>
            )}
            {!addingKey && aiKeys.length >= 3 && (
              <div style={{ fontSize: 10, color: "var(--text-3)", fontFamily: "var(--font-mono)", textAlign: "center", marginTop: 4 }}>
                {lang === "en" ? "Maximum 3 keys (full)" : "Maksimal 3 ta kalit (to'ldi)"}
              </div>
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
