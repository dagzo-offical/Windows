// shared.jsx — shared components used across the app

const { useEffect, useRef, useState, useMemo, useContext, createContext } = React;

// ─────────────────────────────────────────────────────────────
// Language context — UZ or EN only (no dual display)
// ─────────────────────────────────────────────────────────────
const LangContext = createContext({ lang: "uz", setLang: () => {} });
function useLang() { return useContext(LangContext).lang; }
function useSetLang() { return useContext(LangContext).setLang; }
function tt(uz, en) {
  // For use inside render. Must be called in component scope.
  // eslint-disable-next-line
  const lang = useLang();
  return lang === "en" ? en : uz;
}
function T({ uz, en, tag: Tag = React.Fragment, ...props }) {
  const lang = useLang();
  const text = lang === "en" ? en : uz;
  if (Tag === React.Fragment) return <>{text}</>;
  return <Tag {...props}>{text}</Tag>;
}

// ─────────────────────────────────────────────────────────────
// Bilingual text — kept for compat, renders only active lang
// ─────────────────────────────────────────────────────────────
function Bi({ uz, en, tag: Tag = "div", className = "", style }) {
  const lang = useLang();
  return <Tag className={className} style={style}>{lang === "en" ? en : uz}</Tag>;
}

// Language toggle for TopNav
function LangToggle() {
  const lang = useLang();
  const setLang = useSetLang();
  return (
    <div style={{
      display: "inline-flex",
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 999,
      padding: 3,
      gap: 0,
    }}>
      {[
        { v: "uz", label: "UZ", flag: "🇺🇿" },
        { v: "en", label: "EN", flag: "🇬🇧" },
      ].map((opt) => (
        <button key={opt.v} onClick={() => setLang(opt.v)} style={{
          appearance: "none", border: 0, cursor: "pointer",
          padding: "6px 12px", borderRadius: 999,
          fontFamily: "var(--font-mono)", fontSize: 10.5,
          fontWeight: 700, letterSpacing: 0.12,
          background: lang === opt.v ? "var(--accent)" : "transparent",
          color: lang === opt.v ? "#04060d" : "var(--text-2)",
          transition: "all 200ms",
          boxShadow: lang === opt.v ? "0 0 14px var(--accent-glow)" : "none",
        }}>{opt.label}</button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Animated particle background
// ─────────────────────────────────────────────────────────────
function ParticleBg({ count = 30, mode = "grid" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = document.getElementById("bg-root");
    if (!el) return;
    el.className = `bg-stage ${mode === "grid" ? "bg-grid" : ""} ${mode !== "plain" ? "bg-scan" : ""}`;
    // clear old particles
    [...el.querySelectorAll(".particle")].forEach((p) => p.remove());
    if (mode === "particles" || mode === "grid") {
      for (let i = 0; i < count; i++) {
        const p = document.createElement("div");
        // every 5th particle is a bigger "star" glow
        const isStar = i % 5 === 0;
        p.className = "particle" + (isStar ? " particle-star" : "");
        const s = isStar ? 3 + Math.random() * 3 : 1 + Math.random() * 2;
        p.style.width = p.style.height = `${s}px`;
        p.style.left = `${Math.random() * 100}%`;
        p.style.top = `${Math.random() * 100}%`;
        // drift in all directions, not just up
        const angle = Math.random() * Math.PI * 2;
        const dist = 120 + Math.random() * 220;
        p.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
        p.style.setProperty("--dy", `${Math.sin(angle) * dist - 80}px`);
        p.style.animationDuration = `${isStar ? 20 : 12 + Math.random() * 20}s`;
        p.style.animationDelay = `${-Math.random() * 35}s`;
        el.appendChild(p);
      }
    }
  }, [count, mode]);
  return null;
}

// ─────────────────────────────────────────────────────────────
// Top Nav
// ─────────────────────────────────────────────────────────────
function TopNav({ route, setRoute, user, crumb }) {
  const lang = useLang();
  const nav = (r) => (e) => { e?.preventDefault(); setRoute(r); };
  return (
    <header className="topnav">
      <div className="topnav-l">
        <div className="logo" onClick={nav({ name: "landing" })}>
          <div className="logo-mark">W</div>
          <div>
            <div style={{ fontSize: 16, lineHeight: 1 }}>Windows Academy</div>
            <div className="sub">v.26 // secure_learn</div>
          </div>
        </div>
        {crumb && (
          <div className="crumb" style={{ marginLeft: 18 }}>
            <Icon name="chevron-right" size={14} style={{ opacity: 0.4 }} />
            {crumb.map((c, i) => (
              <React.Fragment key={i}>
                <span style={{ color: i === crumb.length - 1 ? "var(--text-0)" : "var(--text-2)", cursor: c.onClick ? "pointer" : "default" }}
                      onClick={c.onClick}>{c.label}</span>
                {i < crumb.length - 1 && <Icon name="chevron-right" size={12} style={{ opacity: 0.3 }} />}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
      <nav style={{ display: "flex", gap: 8 }}>
        <NavLink label={lang === "en" ? "Dashboard" : "Boshqaruv"} sub="Dashboard" active={route.name === "dashboard"} onClick={nav({ name: "dashboard" })} />
        <NavLink label={lang === "en" ? "Courses" : "Kurslar"} sub="Courses" active={route.name === "section"} onClick={nav({ name: "section", section: 3 })} />
        <NavLink label={lang === "en" ? "Labs" : "Laboratoriya"} sub="Labs" />
        <NavLink label={lang === "en" ? "Leaderboard" : "Reyting"} sub="Leaderboard" />
      </nav>
      <div className="topnav-r">
        <LangToggle />
        <button className="btn-ghost btn" style={{ padding: "8px 10px" }} aria-label="Search">
          <Icon name="search" size={15} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 12px 6px 6px", borderRadius: 999, background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent), var(--accent-2))", display: "grid", placeItems: "center", color: "#04060d", fontWeight: 700, fontSize: 12, fontFamily: "var(--font-mono)" }}>
            {user?.initials || "AK"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600 }}>{user?.name || "Dagzo"}</span>
            <span className="mono" style={{ fontSize: 10, color: "var(--accent)" }}>LVL {user?.level || 14} · {user?.xp || "4,820"} XP</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({ label, sub, active, onClick }) {
  return (
    <a href="#" onClick={onClick}
       style={{
         display: "flex", flexDirection: "column", textAlign: "center",
         padding: "8px 14px", borderRadius: 8,
         textDecoration: "none",
         background: active ? "var(--accent-soft)" : "transparent",
         color: active ? "var(--accent)" : "var(--text-1)",
         border: `1px solid ${active ? "var(--accent-border)" : "transparent"}`,
         transition: "all 200ms",
         lineHeight: 1.1,
       }}>
      <span style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
      <span className="mono" style={{ fontSize: 9, opacity: 0.55, letterSpacing: "0.1em", textTransform: "uppercase" }}>{sub}</span>
    </a>
  );
}

// ─────────────────────────────────────────────────────────────
// Progress bar
// ─────────────────────────────────────────────────────────────
function Progress({ value, max = 100, label, color, height = 6, showVal = true }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const c = color || "var(--accent)";
  return (
    <div style={{ width: "100%" }}>
      {label && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 11.5, color: "var(--text-1)" }}>{label}</span>
          {showVal && <span className="mono" style={{ fontSize: 11, color: c }}>{Math.round(pct)}%</span>}
        </div>
      )}
      <div style={{ height, background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden", position: "relative" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${c}, var(--accent-2))`, boxShadow: `0 0 12px ${c}`, transition: "width 600ms cubic-bezier(.2,.8,.2,1)" }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Terminal output renderer
// ─────────────────────────────────────────────────────────────
function Terminal({ lines = [], title = "PowerShell — Administrator", height }) {
  return (
    <div style={{
      background: "#02050c",
      border: "1px solid var(--border)",
      borderRadius: 10,
      overflow: "hidden",
      fontFamily: "var(--font-mono)",
      fontSize: 12.5,
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "8px 14px",
        background: "rgba(255,255,255,0.03)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
        </div>
        <span style={{ fontSize: 11, color: "var(--text-2)", marginLeft: 8 }}>{title}</span>
      </div>
      <div style={{ padding: "14px 18px", maxHeight: height, overflowY: height ? "auto" : "visible", lineHeight: 1.7 }}>
        {lines.map((l, i) => (
          <div key={i} style={{
            color: l.type === "cmd" ? "var(--text-0)" :
                   l.type === "out" ? "#a4b8d8" :
                   l.type === "ok" ? "var(--accent)" :
                   l.type === "err" ? "var(--c-attack)" :
                   l.type === "warn" ? "var(--c-warn)" :
                   l.type === "comment" ? "var(--text-3)" : "var(--text-1)",
            whiteSpace: "pre-wrap",
            fontStyle: l.type === "comment" ? "italic" : "normal",
          }}>
            {l.type === "cmd" && <span style={{ color: "var(--accent)" }}>PS&gt; </span>}
            {l.text}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Code block (no terminal chrome)
// ─────────────────────────────────────────────────────────────
function Code({ children, lang = "ps1" }) {
  return (
    <div className="codeblock">
      {lang && <div style={{ position: "absolute", top: 8, right: 12, fontSize: 9.5, color: "var(--text-3)", letterSpacing: 0.1, textTransform: "uppercase" }}>{lang}</div>}
      <pre style={{ margin: 0, fontFamily: "inherit" }}>{children}</pre>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Glowing avatar circle for skill tree etc.
// ─────────────────────────────────────────────────────────────
function NodeChip({ icon, label, sub, color = "var(--accent)", state = "open", size = 72, onClick }) {
  const ringStyle = {
    locked: { borderStyle: "dashed", opacity: 0.45 },
    open: { borderColor: color, boxShadow: `0 0 0 1px ${color}55, 0 0 18px ${color}66` },
    done: { borderColor: color, background: color + "12" },
  }[state];

  return (
    <div onClick={onClick} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: onClick ? "pointer" : "default" }}>
      <div style={{
        width: size, height: size,
        borderRadius: "50%",
        border: "1.5px solid var(--border-strong)",
        background: "var(--bg-2)",
        display: "grid", placeItems: "center",
        color: state === "locked" ? "var(--text-3)" : color,
        transition: "all 250ms",
        ...ringStyle,
      }}>
        <Icon name={state === "locked" ? "lock" : icon} size={size * 0.42} />
      </div>
      <div style={{ textAlign: "center" }}>
        {label && <div style={{ fontSize: 11, fontWeight: 600, color: state === "locked" ? "var(--text-3)" : "var(--text-0)" }}>{label}</div>}
        {sub && <div className="mono" style={{ fontSize: 9.5, color: "var(--text-2)", letterSpacing: 0.08, textTransform: "uppercase" }}>{sub}</div>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Decorative: Live "system status" pill
// ─────────────────────────────────────────────────────────────
function LiveDot({ color = "var(--accent)" }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{
        width: 7, height: 7, borderRadius: "50%", background: color,
        boxShadow: `0 0 8px ${color}, 0 0 0 0 ${color}66`,
        animation: "pulse-ring 1.4s ease-out infinite",
      }} />
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// Section heading — single language
// ─────────────────────────────────────────────────────────────
function SectionH({ uz, en, eyebrow, right }) {
  const lang = useLang();
  return (
    <div className="h-section">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h2 className="display">{lang === "en" ? en : uz}</h2>
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Lab step with check
// ─────────────────────────────────────────────────────────────
function LabStep({ n, title, titleEn, children, done }) {
  const lang = useLang();
  return (
    <div style={{
      display: "flex", gap: 18,
      padding: "20px 0",
      borderTop: "1px solid var(--border)",
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
        background: done ? "var(--accent)" : "var(--bg-3)",
        color: done ? "#04060d" : "var(--accent)",
        display: "grid", placeItems: "center",
        fontFamily: "var(--font-mono)", fontWeight: 700,
        border: `1px solid ${done ? "var(--accent)" : "var(--accent-border)"}`,
        boxShadow: done ? "0 0 20px var(--accent-glow)" : "none",
      }}>{done ? <Icon name="check" size={16} /> : n.toString().padStart(2, "0")}</div>
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: 6 }}>
          <h4 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600 }}>
            {lang === "en" ? titleEn : title}
          </h4>
        </div>
        {children}
      </div>
    </div>
  );
}

// Expose
Object.assign(window, { Bi, T, tt, useLang, useSetLang, LangContext, LangToggle, ParticleBg, TopNav, NavLink, Progress, Terminal, Code, NodeChip, LiveDot, SectionH, LabStep });
