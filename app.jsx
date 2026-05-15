// app.jsx — main app: router, tweaks, theme + language orchestration

const { useState: useAS, useEffect: useAE, useCallback: useACB } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "green",
  "background": "particles",
  "density": "cozy",
  "motion": "high"
}/*EDITMODE-END*/;

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
    if (s) return JSON.parse(s);
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
  } catch {}
}

// XP thresholds per level (cumulative)
const XP_PER_LESSON = 120;
function xpToLevel(xp) { return Math.max(1, Math.floor(xp / 500) + 1); }

// ─────────────────────────────────────────────────────────────────────────────
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [lang, _setLang] = useAS(() => {
    try { return localStorage.getItem("wa_lang") || "uz"; } catch { return "uz"; }
  });
  const setLang = (v) => {
    _setLang(v);
    try { localStorage.setItem("wa_lang", v); } catch {}
  };

  // Route stored in localStorage so it survives browser close
  const [route, _setRoute] = useAS(loadRoute);
  const setRoute = (r) => {
    _setRoute(r);
    saveRoute(r);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  // User progress stored in localStorage
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

  // Apply tweaks + lang to document
  useAE(() => {
    document.documentElement.dataset.theme = t.theme || "green";
    document.documentElement.dataset.density = t.density || "cozy";
    document.documentElement.dataset.motion = t.motion || "high";
    document.documentElement.dataset.lang = lang;
    document.documentElement.lang = lang === "en" ? "en" : "uz";
  }, [t.theme, t.density, t.motion, lang]);

  const user = {
    name: progress.name || "Dagzo",
    initials: progress.initials || "DZ",
    level: progress.level || 1,
    xp: progress.xp ? progress.xp.toLocaleString() : "0",
    completedLessons: progress.completedLessons || [],
  };

  const screenProps = { setRoute, user, markLessonComplete };

  const handleReset = () => {
    if (!window.confirm(lang === "en"
      ? "Reset all progress and start from zero?"
      : "Barcha progressni o'chirib, 0dan boshlaysizmi?")) return;
    clearAll();
    _setProgress(loadProgress());
    _setRoute({ name: "landing" });
    saveRoute({ name: "landing" });
  };

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <ParticleBg mode={t.background} count={t.motion === "off" ? 0 : t.motion === "low" ? 25 : 80} />
      <RouteRender route={route} screenProps={screenProps} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Theme · Mavzu" />
        <TweakRadio label="Accent" value={t.theme}
          options={["green", "blue", "purple"]}
          onChange={(v) => setTweak("theme", v)} />

        <TweakSection label="Background · Fon" />
        <TweakRadio label="Style" value={t.background}
          options={["grid", "particles", "plain"]}
          onChange={(v) => setTweak("background", v)} />

        <TweakSection label="Layout · Tartibga solish" />
        <TweakRadio label="Density" value={t.density}
          options={["compact", "cozy", "comfy"]}
          onChange={(v) => setTweak("density", v)} />
        <TweakRadio label="Motion" value={t.motion}
          options={["off", "low", "high"]}
          onChange={(v) => setTweak("motion", v)} />

        <TweakSection label="AI Tekshiruvchi · Grader" />
        <AIKeyPanel />

        <TweakSection label="Quick nav · Tezkor o'tish" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
          <NavBtn label="Landing" onClick={() => setRoute({ name: "landing" })} />
          <NavBtn label="Dashboard" onClick={() => setRoute({ name: "dashboard" })} />
          <NavBtn label="Section 01" onClick={() => setRoute({ name: "section", section: 1 })} />
          <NavBtn label="Lesson 01" onClick={() => setRoute({ name: "lesson", section: 1, lesson: 1 })} />
          <NavBtn label="Cooldown" onClick={() => setRoute({ name: "cooldown" })} />
          <NavBtn label="Final exam" onClick={() => setRoute({ name: "exam" })} />
          <NavBtn label="⟳ 0dan boshlash" onClick={handleReset} />
        </div>

        <TweakSection label="Progress · Natija" />
        <div style={{ fontSize: 11, opacity: 0.7, padding: "4px 0" }}>
          XP: {user.xp} · Daraja: {user.level} · Darslar: {user.completedLessons.length}
        </div>
      </TweaksPanel>
    </LangContext.Provider>
  );
}

function NavBtn({ label, onClick }) {
  return (
    <button onClick={onClick} style={{
      appearance: "none", cursor: "pointer",
      padding: "6px 8px",
      background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)",
      borderRadius: 6, fontSize: 10.5, color: "inherit",
      fontFamily: "inherit", textAlign: "left",
    }}>{label}</button>
  );
}

function RouteRender({ route, screenProps }) {
  switch (route.name) {
    case "landing": return <LandingScreen {...screenProps} />;
    case "dashboard": return <DashboardScreen {...screenProps} />;
    case "section": return <SectionScreen {...screenProps} section={route.section || 1} />;
    case "lesson": return <LessonScreen {...screenProps} />;
    case "cooldown": return <CooldownScreen {...screenProps} />;
    case "exam": return <FinalExamScreen {...screenProps} markLessonComplete={screenProps.markLessonComplete} />;
    default: return <LandingScreen {...screenProps} />;
  }
}

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
