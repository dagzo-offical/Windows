// app.jsx — main app: router, tweaks, theme + language orchestration

const { useState: useAS, useEffect: useAE } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "green",
  "background": "grid",
  "density": "cozy",
  "motion": "high"
}/*EDITMODE-END*/;

const USER = {
  name: "Akmal K.",
  initials: "AK",
  level: 14,
  xp: "4,820",
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [lang, _setLang] = useAS(() => {
    try { return localStorage.getItem("wa_lang") || "uz"; } catch { return "uz"; }
  });
  const setLang = (v) => {
    _setLang(v);
    try { localStorage.setItem("wa_lang", v); } catch {}
  };
  const [route, _setRoute] = useAS(() => {
    try {
      const stored = sessionStorage.getItem("wa_route");
      if (stored) return JSON.parse(stored);
    } catch {}
    return { name: "landing" };
  });

  const setRoute = (r) => {
    _setRoute(r);
    try { sessionStorage.setItem("wa_route", JSON.stringify(r)); } catch {}
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  // Apply tweaks + lang to document
  useAE(() => {
    document.documentElement.dataset.theme = t.theme || "green";
    document.documentElement.dataset.density = t.density || "cozy";
    document.documentElement.dataset.motion = t.motion || "high";
    document.documentElement.dataset.lang = lang;
    document.documentElement.lang = lang === "en" ? "en" : "uz";
  }, [t.theme, t.density, t.motion, lang]);

  const screenProps = { setRoute, user: USER };

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <ParticleBg mode={t.background} count={t.motion === "off" ? 0 : t.motion === "low" ? 10 : 30} />
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

        <TweakSection label="Quick nav · Tezkor o'tish" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
          <NavBtn label="Landing" onClick={() => setRoute({ name: "landing" })} />
          <NavBtn label="Dashboard" onClick={() => setRoute({ name: "dashboard" })} />
          <NavBtn label="Section 01" onClick={() => setRoute({ name: "section", section: 1 })} />
          <NavBtn label="Lesson 01" onClick={() => setRoute({ name: "lesson", section: 1, lesson: 1 })} />
          <NavBtn label="Cooldown" onClick={() => setRoute({ name: "cooldown" })} />
          <NavBtn label="Final exam" onClick={() => setRoute({ name: "exam" })} />
          <NavBtn label="Reset" onClick={() => {
            localStorage.removeItem("wa_cooldown_end");
            sessionStorage.removeItem("wa_route");
            setRoute({ name: "landing" });
          }} />
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
    case "exam": return <FinalExamScreen {...screenProps} />;
    default: return <LandingScreen {...screenProps} />;
  }
}

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
