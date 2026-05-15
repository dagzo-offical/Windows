"use strict";
// Windows Academy — pre-bundled

// ─── components/icons.jsx ───
// icons.jsx — Inline SVG icon set
// Avoid icon libs to keep things lean; these match the cyber-security aesthetic.

const Icon = ({
  name,
  size = 18,
  stroke = 1.6,
  ...props
}) => {
  const S = size;
  const sw = stroke;
  const common = {
    width: S,
    height: S,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: sw,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    ...props
  };
  switch (name) {
    case "shield":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
        d: "M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z"
      }));
    case "shield-check":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
        d: "M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M9 12l2 2 4-4"
      }));
    case "lock":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("rect", {
        x: "4",
        y: "11",
        width: "16",
        height: "10",
        rx: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M8 11V7a4 4 0 018 0v4"
      }));
    case "unlock":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("rect", {
        x: "4",
        y: "11",
        width: "16",
        height: "10",
        rx: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M8 11V7a4 4 0 017-2.7"
      }));
    case "key":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("circle", {
        cx: "8",
        cy: "15",
        r: "4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M11 12l9-9M16 7l3 3M14 9l3 3"
      }));
    case "terminal":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "4",
        width: "18",
        height: "16",
        rx: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M7 9l3 3-3 3M13 15h4"
      }));
    case "play":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
        d: "M6 4l14 8-14 8V4z",
        fill: "currentColor"
      }));
    case "arrow-right":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
        d: "M5 12h14M13 5l7 7-7 7"
      }));
    case "arrow-left":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
        d: "M19 12H5M11 5l-7 7 7 7"
      }));
    case "check":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
        d: "M5 13l4 4L19 7"
      }));
    case "x":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
        d: "M6 6l12 12M18 6L6 18"
      }));
    case "warning":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
        d: "M12 3L2 20h20L12 3z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 10v5M12 18v.5"
      }));
    case "info":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "10"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 8v.5M11 12h1v5h1"
      }));
    case "flame":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
        d: "M12 2s5 5 5 10a5 5 0 01-10 0c0-3 2-4 2-7 0 0 3 1 3 4"
      }));
    case "zap":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
        d: "M13 2L4 14h7l-2 8 9-12h-7l2-8z"
      }));
    case "skull":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
        d: "M12 3a8 8 0 00-5 14v3h10v-3a8 8 0 00-5-14z"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "9",
        cy: "12",
        r: "1.2"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "15",
        cy: "12",
        r: "1.2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M10 17h4"
      }));
    case "users":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("circle", {
        cx: "9",
        cy: "9",
        r: "3.5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M2 20c0-4 3-6 7-6s7 2 7 6"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "17",
        cy: "8",
        r: "2.5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M17 13c3 0 5 1.5 5 5"
      }));
    case "user":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "8",
        r: "4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"
      }));
    case "server":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "3",
        width: "18",
        height: "7",
        rx: "1.5"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "14",
        width: "18",
        height: "7",
        rx: "1.5"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "7",
        cy: "6.5",
        r: ".7"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "7",
        cy: "17.5",
        r: ".7"
      }));
    case "database":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("ellipse", {
        cx: "12",
        cy: "5",
        rx: "8",
        ry: "3"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M4 5v6c0 1.6 3.6 3 8 3s8-1.4 8-3V5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M4 11v6c0 1.6 3.6 3 8 3s8-1.4 8-3v-6"
      }));
    case "network":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("circle", {
        cx: "6",
        cy: "6",
        r: "2"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "18",
        cy: "6",
        r: "2"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "6",
        cy: "18",
        r: "2"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "18",
        cy: "18",
        r: "2"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M8 6l2 4M16 6l-2 4M10 14l-2 4M14 14l2 4"
      }));
    case "cpu":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("rect", {
        x: "6",
        y: "6",
        width: "12",
        height: "12",
        rx: "1"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "9",
        y: "9",
        width: "6",
        height: "6"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M10 2v3M14 2v3M10 19v3M14 19v3M2 10h3M2 14h3M19 10h3M19 14h3"
      }));
    case "code":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
        d: "M9 7l-5 5 5 5M15 7l5 5-5 5"
      }));
    case "graph":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
        d: "M3 20h18"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M5 17l5-6 4 4 5-9"
      }));
    case "trophy":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
        d: "M8 4h8v6a4 4 0 11-8 0V4z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M4 6h4v3a3 3 0 01-3-3M20 6h-4v3a3 3 0 003-3"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M10 14v3l-2 3h8l-2-3v-3"
      }));
    case "target":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "9"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "5"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "1.5",
        fill: "currentColor"
      }));
    case "compass":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "9"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M16 8l-2 6-6 2 2-6 6-2z"
      }));
    case "book":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
        d: "M4 5a2 2 0 012-2h12v18H6a2 2 0 01-2-2V5z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M4 17h14"
      }));
    case "clock":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "9"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 7v5l3 2"
      }));
    case "search":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("circle", {
        cx: "11",
        cy: "11",
        r: "7"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M21 21l-4-4"
      }));
    case "settings":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "3"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33h.09a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.09a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"
      }));
    case "flag":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
        d: "M4 21V4M4 4h14l-3 5 3 5H4"
      }));
    case "globe":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "9"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M3 12h18M12 3c3 3 4.5 6 4.5 9s-1.5 6-4.5 9c-3-3-4.5-6-4.5-9s1.5-6 4.5-9z"
      }));
    case "layers":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
        d: "M12 2l10 5-10 5L2 7l10-5z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M2 12l10 5 10-5M2 17l10 5 10-5"
      }));
    case "branch":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("circle", {
        cx: "6",
        cy: "4",
        r: "2"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "6",
        cy: "20",
        r: "2"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "18",
        cy: "12",
        r: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M6 6v12M6 12h10"
      }));
    case "eye":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
        d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "3"
      }));
    case "send":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
        d: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
      }));
    case "menu":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
        d: "M3 6h18M3 12h18M3 18h18"
      }));
    case "chevron-right":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
        d: "M9 6l6 6-6 6"
      }));
    case "chevron-down":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
        d: "M6 9l6 6 6-6"
      }));
    case "external":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
        d: "M15 3h6v6M21 3l-9 9M21 14v5a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h5"
      }));
    case "download":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
        d: "M12 3v13M5 13l7 7 7-7M5 21h14"
      }));
    case "share":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("circle", {
        cx: "6",
        cy: "12",
        r: "2"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "18",
        cy: "6",
        r: "2"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "18",
        cy: "18",
        r: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M8 11l8-4M8 13l8 4"
      }));
    case "qr":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "3",
        width: "7",
        height: "7"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "14",
        y: "3",
        width: "7",
        height: "7"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "14",
        width: "7",
        height: "7"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M14 14h3v3h-3zM18 18h3v3h-3z"
      }));
    case "spark":
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
        d: "M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M5 19l4-4M15 9l4-4"
      }));
    default:
      return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "9"
      }));
  }
};
window.Icon = Icon;

// ─── components/shared.jsx ───
// shared.jsx — shared components used across the app

const {
  useEffect,
  useRef,
  useState,
  useMemo,
  useContext,
  createContext
} = React;

// ─────────────────────────────────────────────────────────────
// Language context — UZ or EN only (no dual display)
// ─────────────────────────────────────────────────────────────
const LangContext = createContext({
  lang: "uz",
  setLang: () => {}
});
function useLang() {
  return useContext(LangContext).lang;
}
function useSetLang() {
  return useContext(LangContext).setLang;
}
function tt(uz, en) {
  // For use inside render. Must be called in component scope.
  // eslint-disable-next-line
  const lang = useLang();
  return lang === "en" ? en : uz;
}
function T({
  uz,
  en,
  tag: Tag = React.Fragment,
  ...props
}) {
  const lang = useLang();
  const text = lang === "en" ? en : uz;
  if (Tag === React.Fragment) return /*#__PURE__*/React.createElement(React.Fragment, null, text);
  return /*#__PURE__*/React.createElement(Tag, props, text);
}

// ─────────────────────────────────────────────────────────────
// Bilingual text — kept for compat, renders only active lang
// ─────────────────────────────────────────────────────────────
function Bi({
  uz,
  en,
  tag: Tag = "div",
  className = "",
  style
}) {
  const lang = useLang();
  return /*#__PURE__*/React.createElement(Tag, {
    className: className,
    style: style
  }, lang === "en" ? en : uz);
}

// Language toggle for TopNav
function LangToggle() {
  const lang = useLang();
  const setLang = useSetLang();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 999,
      padding: 3,
      gap: 0
    }
  }, [{
    v: "uz",
    label: "UZ",
    flag: "🇺🇿"
  }, {
    v: "en",
    label: "EN",
    flag: "🇬🇧"
  }].map(opt => /*#__PURE__*/React.createElement("button", {
    key: opt.v,
    onClick: () => setLang(opt.v),
    style: {
      appearance: "none",
      border: 0,
      cursor: "pointer",
      padding: "6px 12px",
      borderRadius: 999,
      fontFamily: "var(--font-mono)",
      fontSize: 10.5,
      fontWeight: 700,
      letterSpacing: 0.12,
      background: lang === opt.v ? "var(--accent)" : "transparent",
      color: lang === opt.v ? "#04060d" : "var(--text-2)",
      transition: "all 200ms",
      boxShadow: lang === opt.v ? "0 0 14px var(--accent-glow)" : "none"
    }
  }, opt.label)));
}

// ─────────────────────────────────────────────────────────────
// Animated particle background
// ─────────────────────────────────────────────────────────────
function ParticleBg({
  count = 30,
  mode = "grid"
}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = document.getElementById("bg-root");
    if (!el) return;
    el.className = `bg-stage ${mode === "grid" ? "bg-grid" : ""} ${mode !== "plain" ? "bg-scan" : ""}`;
    // clear old particles
    [...el.querySelectorAll(".particle")].forEach(p => p.remove());
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
function TopNav({
  route,
  setRoute,
  user,
  crumb,
  onOpenProfile
}) {
  const lang = useLang();
  const nav = r => e => {
    e?.preventDefault();
    setRoute(r);
  };
  return /*#__PURE__*/React.createElement("header", {
    className: "topnav"
  }, /*#__PURE__*/React.createElement("div", {
    className: "topnav-l"
  }, /*#__PURE__*/React.createElement("div", {
    className: "logo",
    onClick: nav({
      name: "landing"
    })
  }, /*#__PURE__*/React.createElement("div", {
    className: "logo-mark"
  }, "W"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      lineHeight: 1
    }
  }, "Windows Academy"), /*#__PURE__*/React.createElement("div", {
    className: "sub"
  }, "v.26 // secure_learn"))), crumb && /*#__PURE__*/React.createElement("div", {
    className: "crumb",
    style: {
      marginLeft: 18
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 14,
    style: {
      opacity: 0.4
    }
  }), crumb.map((c, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: i === crumb.length - 1 ? "var(--text-0)" : "var(--text-2)",
      cursor: c.onClick ? "pointer" : "default"
    },
    onClick: c.onClick
  }, c.label), i < crumb.length - 1 && /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 12,
    style: {
      opacity: 0.3
    }
  }))))), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(NavLink, {
    label: lang === "en" ? "Dashboard" : "Boshqaruv",
    sub: "Dashboard",
    active: route.name === "dashboard",
    onClick: nav({
      name: "dashboard"
    })
  }), /*#__PURE__*/React.createElement(NavLink, {
    label: lang === "en" ? "Courses" : "Kurslar",
    sub: "Courses",
    active: route.name === "section",
    onClick: nav({
      name: "section",
      section: 1
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "topnav-r"
  }, /*#__PURE__*/React.createElement(LangToggle, null), /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn",
    style: {
      padding: "8px 10px"
    },
    "aria-label": "Search"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 15
  })), /*#__PURE__*/React.createElement("div", {
    onClick: onOpenProfile,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "6px 12px 6px 6px",
      borderRadius: 999,
      background: "var(--surface)",
      border: "1px solid var(--border)",
      cursor: onOpenProfile ? "pointer" : "default",
      transition: "border-color 150ms"
    },
    onMouseEnter: e => {
      if (onOpenProfile) e.currentTarget.style.borderColor = "var(--accent-border)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = "var(--border)";
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      borderRadius: "50%",
      background: "linear-gradient(135deg,#00ff88,#0af,#a855f7)",
      padding: 1.5,
      boxShadow: "0 0 8px rgba(0,255,136,0.3)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      background: "#04060d",
      display: "grid",
      placeItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      background: "linear-gradient(135deg,#00ff88,#0af)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontSize: 10,
      fontWeight: 900,
      fontFamily: "var(--font-mono)"
    }
  }, user?.initials || "DZ"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      bottom: 0,
      right: 0,
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: "#00ff88",
      border: "1.5px solid #04060d"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      lineHeight: 1.1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      fontWeight: 600
    }
  }, user?.name || "Dagzo"), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 10,
      color: "var(--accent)"
    }
  }, "LVL ", user?.level || 1, " \xB7 ", user?.xp || "0", " XP")))));
}
function NavLink({
  label,
  sub,
  active,
  onClick
}) {
  return /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: onClick,
    style: {
      display: "flex",
      flexDirection: "column",
      textAlign: "center",
      padding: "8px 14px",
      borderRadius: 8,
      textDecoration: "none",
      background: active ? "var(--accent-soft)" : "transparent",
      color: active ? "var(--accent)" : "var(--text-1)",
      border: `1px solid ${active ? "var(--accent-border)" : "transparent"}`,
      transition: "all 200ms",
      lineHeight: 1.1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 500
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 9,
      opacity: 0.55,
      letterSpacing: "0.1em",
      textTransform: "uppercase"
    }
  }, sub));
}

// ─────────────────────────────────────────────────────────────
// Progress bar
// ─────────────────────────────────────────────────────────────
function Progress({
  value,
  max = 100,
  label,
  color,
  height = 6,
  showVal = true
}) {
  const pct = Math.min(100, Math.max(0, value / max * 100));
  const c = color || "var(--accent)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%"
    }
  }, label && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      color: "var(--text-1)"
    }
  }, label), showVal && /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 11,
      color: c
    }
  }, Math.round(pct), "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      height,
      background: "rgba(255,255,255,0.06)",
      borderRadius: 999,
      overflow: "hidden",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${pct}%`,
      height: "100%",
      background: `linear-gradient(90deg, ${c}, var(--accent-2))`,
      boxShadow: `0 0 12px ${c}`,
      transition: "width 600ms cubic-bezier(.2,.8,.2,1)"
    }
  })));
}

// ─────────────────────────────────────────────────────────────
// Terminal output renderer
// ─────────────────────────────────────────────────────────────
function Terminal({
  lines = [],
  title = "PowerShell — Administrator",
  height
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#02050c",
      border: "1px solid var(--border)",
      borderRadius: 10,
      overflow: "hidden",
      fontFamily: "var(--font-mono)",
      fontSize: 12.5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 14px",
      background: "rgba(255,255,255,0.03)",
      borderBottom: "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 10,
      height: 10,
      borderRadius: "50%",
      background: "#ff5f57"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 10,
      height: 10,
      borderRadius: "50%",
      background: "#febc2e"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 10,
      height: 10,
      borderRadius: "50%",
      background: "#28c840"
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "var(--text-2)",
      marginLeft: 8
    }
  }, title)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 18px",
      maxHeight: height,
      overflowY: height ? "auto" : "visible",
      lineHeight: 1.7
    }
  }, lines.map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      color: l.type === "cmd" ? "var(--text-0)" : l.type === "out" ? "#a4b8d8" : l.type === "ok" ? "var(--accent)" : l.type === "err" ? "var(--c-attack)" : l.type === "warn" ? "var(--c-warn)" : l.type === "comment" ? "var(--text-3)" : "var(--text-1)",
      whiteSpace: "pre-wrap",
      fontStyle: l.type === "comment" ? "italic" : "normal"
    }
  }, l.type === "cmd" && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--accent)"
    }
  }, "PS> "), l.text))));
}

// ─────────────────────────────────────────────────────────────
// Code block (no terminal chrome)
// ─────────────────────────────────────────────────────────────
function Code({
  children,
  lang = "ps1"
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "codeblock"
  }, lang && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 8,
      right: 12,
      fontSize: 9.5,
      color: "var(--text-3)",
      letterSpacing: 0.1,
      textTransform: "uppercase"
    }
  }, lang), /*#__PURE__*/React.createElement("pre", {
    style: {
      margin: 0,
      fontFamily: "inherit"
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Glowing avatar circle for skill tree etc.
// ─────────────────────────────────────────────────────────────
function NodeChip({
  icon,
  label,
  sub,
  color = "var(--accent)",
  state = "open",
  size = 72,
  onClick
}) {
  const ringStyle = {
    locked: {
      borderStyle: "dashed",
      opacity: 0.45
    },
    open: {
      borderColor: color,
      boxShadow: `0 0 0 1px ${color}55, 0 0 18px ${color}66`
    },
    done: {
      borderColor: color,
      background: color + "12"
    }
  }[state];
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 6,
      cursor: onClick ? "pointer" : "default"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: "50%",
      border: "1.5px solid var(--border-strong)",
      background: "var(--bg-2)",
      display: "grid",
      placeItems: "center",
      color: state === "locked" ? "var(--text-3)" : color,
      transition: "all 250ms",
      ...ringStyle
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: state === "locked" ? "lock" : icon,
    size: size * 0.42
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center"
    }
  }, label && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: state === "locked" ? "var(--text-3)" : "var(--text-0)"
    }
  }, label), sub && /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 9.5,
      color: "var(--text-2)",
      letterSpacing: 0.08,
      textTransform: "uppercase"
    }
  }, sub)));
}

// ─────────────────────────────────────────────────────────────
// Decorative: Live "system status" pill
// ─────────────────────────────────────────────────────────────
function LiveDot({
  color = "var(--accent)"
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: "50%",
      background: color,
      boxShadow: `0 0 8px ${color}, 0 0 0 0 ${color}66`,
      animation: "pulse-ring 1.4s ease-out infinite"
    }
  }));
}

// ─────────────────────────────────────────────────────────────
// Section heading — single language
// ─────────────────────────────────────────────────────────────
function SectionH({
  uz,
  en,
  eyebrow,
  right
}) {
  const lang = useLang();
  return /*#__PURE__*/React.createElement("div", {
    className: "h-section"
  }, /*#__PURE__*/React.createElement("div", null, eyebrow && /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, eyebrow), /*#__PURE__*/React.createElement("h2", {
    className: "display"
  }, lang === "en" ? en : uz)), right && /*#__PURE__*/React.createElement("div", null, right));
}

// ─────────────────────────────────────────────────────────────
// Lab step with check
// ─────────────────────────────────────────────────────────────
function LabStep({
  n,
  title,
  titleEn,
  children,
  done
}) {
  const lang = useLang();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 18,
      padding: "20px 0",
      borderTop: "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      borderRadius: "50%",
      flexShrink: 0,
      background: done ? "var(--accent)" : "var(--bg-3)",
      color: done ? "#04060d" : "var(--accent)",
      display: "grid",
      placeItems: "center",
      fontFamily: "var(--font-mono)",
      fontWeight: 700,
      border: `1px solid ${done ? "var(--accent)" : "var(--accent-border)"}`,
      boxShadow: done ? "0 0 20px var(--accent-glow)" : "none"
    }
  }, done ? /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 16
  }) : n.toString().padStart(2, "0")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: 0,
      fontFamily: "var(--font-display)",
      fontSize: 16,
      fontWeight: 600
    }
  }, lang === "en" ? titleEn : title)), children));
}

// Expose
Object.assign(window, {
  Bi,
  T,
  tt,
  useLang,
  useSetLang,
  LangContext,
  LangToggle,
  ParticleBg,
  TopNav,
  NavLink,
  Progress,
  Terminal,
  Code,
  NodeChip,
  LiveDot,
  SectionH,
  LabStep,
  AIKeyPanel,
  gradeWithAI
});

// ─────────────────────────────────────────────────────────────
// Multi-provider AI grader
// ─────────────────────────────────────────────────────────────
async function gradeWithAI(prompt) {
  const provider = localStorage.getItem("wa_ai_provider") || "";
  const key = localStorage.getItem("wa_ai_key") || "";
  if (!provider || !key) throw new Error("no_key");
  if (provider === "openai") {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{
          role: "user",
          content: prompt
        }],
        max_tokens: 600
      })
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error?.message || "OpenAI error");
    return d.choices[0].message.content;
  }
  if (provider === "anthropic") {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 600,
        messages: [{
          role: "user",
          content: prompt
        }]
      })
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error?.message || "Anthropic error");
    return d.content[0].text;
  }
  if (provider === "groq") {
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{
          role: "user",
          content: prompt
        }],
        max_tokens: 600,
        temperature: 0.3
      })
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error?.message || `Groq error ${r.status}`);
    return d.choices[0].message.content;
  }
  if (provider === "gemini") {
    const models = ["gemini-2.0-flash-lite", "gemini-1.5-flash-latest", "gemini-1.5-flash-8b"];
    let lastErr = null;
    for (const model of models) {
      try {
        const r = await fetch(`https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${key}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              maxOutputTokens: 600,
              temperature: 0.3
            }
          })
        });
        const d = await r.json();
        if (!r.ok) {
          lastErr = new Error(d.error?.message || `Gemini ${model} error ${r.status}`);
          continue;
        }
        return d.candidates[0].content.parts[0].text;
      } catch (e) {
        lastErr = e;
      }
    }
    throw lastErr || new Error("Gemini: no working model found");
  }
  throw new Error("Noma'lum provider");
}

// ─────────────────────────────────────────────────────────────
// AI Key settings panel (used in TweaksPanel)
// ─────────────────────────────────────────────────────────────
function AIKeyPanel() {
  const {
    useState: useS
  } = React;
  const [provider, setProvider] = useS(() => localStorage.getItem("wa_ai_provider") || "");
  const [key, setKey] = useS(() => localStorage.getItem("wa_ai_key") || "");
  const [show, setShow] = useS(false);
  const [saved, setSaved] = useS(false);
  const save = () => {
    localStorage.setItem("wa_ai_provider", provider);
    localStorage.setItem("wa_ai_key", key);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  const PROVIDERS = [{
    id: "openai",
    label: "OpenAI",
    hint: "sk-..."
  }, {
    id: "anthropic",
    label: "Claude",
    hint: "sk-ant-..."
  }, {
    id: "gemini",
    label: "Gemini",
    hint: "AIza..."
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      marginBottom: 6,
      flexWrap: "wrap"
    }
  }, PROVIDERS.map(p => /*#__PURE__*/React.createElement("button", {
    key: p.id,
    onClick: () => setProvider(p.id),
    style: {
      appearance: "none",
      cursor: "pointer",
      padding: "4px 10px",
      borderRadius: 6,
      fontSize: 10.5,
      fontFamily: "var(--font-mono)",
      fontWeight: 600,
      border: `1.5px solid ${provider === p.id ? "var(--accent)" : "rgba(255,255,255,0.1)"}`,
      background: provider === p.id ? "var(--accent-soft)" : "rgba(0,0,0,0.05)",
      color: provider === p.id ? "var(--accent)" : "var(--text-2)",
      transition: "all 150ms"
    }
  }, p.label))), provider && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: show ? "text" : "password",
    placeholder: PROVIDERS.find(p => p.id === provider)?.hint || "API Key",
    value: key,
    onChange: e => setKey(e.target.value),
    style: {
      width: "100%",
      boxSizing: "border-box",
      background: "rgba(0,0,0,0.2)",
      border: "1px solid var(--border)",
      borderRadius: 7,
      padding: "6px 36px 6px 9px",
      fontSize: 10.5,
      fontFamily: "var(--font-mono)",
      color: "var(--text-0)",
      outline: "none"
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShow(s => !s),
    style: {
      position: "absolute",
      right: 6,
      top: "50%",
      transform: "translateY(-50%)",
      appearance: "none",
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "var(--text-3)",
      fontSize: 12,
      padding: 2
    }
  }, show ? "🙈" : "👁")), provider && /*#__PURE__*/React.createElement("button", {
    onClick: save,
    style: {
      appearance: "none",
      cursor: "pointer",
      marginTop: 6,
      width: "100%",
      padding: "5px 0",
      borderRadius: 6,
      fontSize: 10.5,
      fontWeight: 700,
      fontFamily: "var(--font-mono)",
      background: saved ? "rgba(0,255,136,0.15)" : "var(--accent-soft)",
      border: `1px solid ${saved ? "var(--accent)" : "var(--accent-border)"}`,
      color: saved ? "var(--accent)" : "var(--text-0)",
      transition: "all 200ms"
    }
  }, saved ? "✓ Saqlandi" : "Saqlash"), !provider && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "var(--text-3)",
      lineHeight: 1.5
    }
  }, "AI tekshiruvi uchun provider tanlang va API kalitingizni kiriting."));
}

// ─── components/mermaid-diagram.jsx ───
// mermaid-diagram.jsx — render mermaid charts with the cyber theme

const {
  useEffect: useE,
  useRef: useR,
  useState: useS
} = React;

// Initialize once
if (window.mermaid && !window.__mermaidInited) {
  window.__mermaidInited = true;
  window.mermaid.initialize({
    startOnLoad: false,
    theme: "base",
    fontFamily: "Inter, system-ui, sans-serif",
    themeVariables: {
      primaryColor: "#131a2e",
      primaryTextColor: "#e8eef9",
      primaryBorderColor: "#00ff9c",
      lineColor: "#a4b1c8",
      secondaryColor: "#1a2342",
      tertiaryColor: "#0d1324",
      background: "transparent",
      mainBkg: "#131a2e",
      secondBkg: "#1a2342",
      nodeBorder: "#00ff9c",
      clusterBkg: "rgba(20,28,50,0.5)",
      clusterBorder: "#3a4a6a",
      labelTextColor: "#e8eef9",
      edgeLabelBackground: "#0d1324",
      actorBkg: "#1a2342",
      actorBorder: "#00ff9c",
      actorTextColor: "#ffffff",
      actorLineColor: "#a4b1c8",
      signalColor: "#e8eef9",
      signalTextColor: "#ffffff",
      labelBoxBkgColor: "#131a2e",
      labelBoxBorderColor: "#00ff9c",
      labelTextColor: "#ffffff",
      loopTextColor: "#ffffff",
      noteBkgColor: "#1f2a4a",
      noteBorderColor: "#4d8bff",
      noteTextColor: "#ffffff",
      sequenceNumberColor: "#04060d",
      activationBorderColor: "#00ff9c",
      activationBkgColor: "rgba(0,255,156,0.15)"
    },
    securityLevel: "loose",
    flowchart: {
      curve: "basis",
      htmlLabels: true,
      padding: 18,
      nodeSpacing: 50,
      rankSpacing: 60
    },
    sequence: {
      showSequenceNumbers: true,
      mirrorActors: false,
      useMaxWidth: true,
      actorMargin: 90,
      messageMargin: 48,
      boxMargin: 12,
      noteMargin: 12,
      messageFontSize: 13,
      actorFontSize: 14,
      actorFontWeight: 600,
      wrap: true
    }
  });
}
function MermaidDiagram({
  chart,
  id,
  caption,
  captionEn
}) {
  const ref = useR(null);
  const [err, setErr] = useS(null);
  const lang = useLang();
  const uid = useR(`mer-${Math.random().toString(36).slice(2, 9)}`).current;
  useE(() => {
    if (!ref.current || !window.mermaid) return;
    let cancelled = false;
    setErr(null);
    (async () => {
      try {
        const {
          svg
        } = await window.mermaid.render(uid, chart);
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
          // Post-process: bump stroke widths for crispness
          const svgEl = ref.current.querySelector("svg");
          if (svgEl) {
            svgEl.style.maxWidth = "100%";
            svgEl.style.height = "auto";
            svgEl.style.fontFamily = "Inter, system-ui, sans-serif";
            svgEl.setAttribute("shape-rendering", "geometricPrecision");
            svgEl.setAttribute("text-rendering", "geometricPrecision");
            // Polish strokes
            svgEl.querySelectorAll("line, path").forEach(p => {
              const cur = parseFloat(p.getAttribute("stroke-width")) || 1;
              if (cur < 1.8) p.setAttribute("stroke-width", "1.6");
              p.setAttribute("stroke-linecap", "round");
              p.setAttribute("stroke-linejoin", "round");
            });
            // Bold/contrast all text
            svgEl.querySelectorAll("text, tspan").forEach(t => {
              if (!t.getAttribute("font-weight")) t.setAttribute("font-weight", "500");
            });
          }
        }
      } catch (e) {
        console.error("Mermaid render error:", e);
        if (!cancelled) setErr(e.message || String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart, uid]);
  return /*#__PURE__*/React.createElement("figure", {
    style: {
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mermaid-wrap"
  }, err ? /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--c-attack)",
      fontFamily: "var(--font-mono)",
      fontSize: 12
    }
  }, "Diagram error: ", err) : /*#__PURE__*/React.createElement("div", {
    ref: ref
  })), (caption || captionEn) && /*#__PURE__*/React.createElement("figcaption", {
    style: {
      marginTop: 10,
      fontSize: 12.5,
      color: "var(--text-2)"
    }
  }, lang === "en" ? captionEn : caption));
}
window.MermaidDiagram = MermaidDiagram;

// ─── components/windows-arch.jsx ───
// windows-arch.jsx — interactive Windows architecture diagram
// Layered model: hardware → HAL → kernel mode (executive, kernel, drivers) → user mode

const {
  useState: useWS
} = React;
const ARCH_LAYERS = [{
  id: "user",
  name: "User mode",
  nameEn: "User mode",
  side: "user",
  color: "var(--c-user)",
  y: 0,
  components: [{
    id: "apps",
    name: "Applications",
    nameUz: "Ilovalar",
    desc: "Word, Chrome, Steam...",
    descUz: "Word, Chrome, Steam — barcha foydalanuvchi dasturlari.",
    icon: "code"
  }, {
    id: "services",
    name: "Services",
    nameUz: "Servislar",
    desc: "Windows Update, Print Spooler, etc.",
    descUz: "Background servislar — Windows Update, Print Spooler.",
    icon: "settings"
  }, {
    id: "subsystems",
    name: "Subsystems (Win32, WSL)",
    nameUz: "Subsistemalar",
    desc: "API translation layer — kernel32.dll, user32.dll",
    descUz: "API qatlamlari — kernel32.dll, user32.dll, ntdll.dll.",
    icon: "layers"
  }]
}, {
  id: "boundary",
  name: "User ↔ Kernel boundary",
  nameEn: "Security boundary (syscall gate)",
  side: "boundary",
  color: "var(--c-warn)",
  desc: "syscall instruction → ring 3 to ring 0 transition"
}, {
  id: "exec",
  name: "Executive services",
  nameEn: "Executive services",
  side: "kernel",
  color: "var(--c-system)",
  y: 1,
  components: [{
    id: "objmgr",
    name: "Object Manager",
    nameUz: "Object Manager",
    desc: "Tracks every kernel object (processes, files, mutexes)",
    descUz: "Har bir kernel obyektini (jarayonlar, fayllar, mutex'lar) ro'yxatga oladi.",
    icon: "database"
  }, {
    id: "procmgr",
    name: "Process Manager",
    nameUz: "Process Manager",
    desc: "Creates/terminates processes & threads",
    descUz: "Jarayonlar va thread'larni yaratadi/to'xtatadi.",
    icon: "cpu"
  }, {
    id: "memmgr",
    name: "Memory Manager",
    nameUz: "Memory Manager",
    desc: "Virtual memory, paging, working sets",
    descUz: "Virtual memory, paging, working set boshqaruvi.",
    icon: "layers"
  }, {
    id: "iomgr",
    name: "I/O Manager",
    nameUz: "I/O Manager",
    desc: "Routes I/O between drivers",
    descUz: "Disk, network, USB — barcha I/O so'rovlari shu yerdan o'tadi.",
    icon: "network"
  }, {
    id: "srm",
    name: "Security Reference Monitor",
    nameUz: "Security RM",
    desc: "Access check on every object handle",
    descUz: "Har bir handle uchun ruxsat tekshiruvi — ACL hisoblovchi.",
    icon: "shield"
  }]
}, {
  id: "kernel",
  name: "Microkernel (NTOSKRNL)",
  nameEn: "Microkernel (NTOSKRNL)",
  side: "kernel",
  color: "var(--c-attack)",
  y: 2,
  components: [{
    id: "sched",
    name: "Thread scheduler",
    nameUz: "Scheduler",
    desc: "Picks the next thread to run on each CPU",
    descUz: "Har bir CPU yadrosida keyingi thread'ni tanlaydi (priority + quantum).",
    icon: "spark"
  }, {
    id: "sync",
    name: "Synchronization",
    nameUz: "Sync primitives",
    desc: "Mutex, semaphore, event objects",
    descUz: "Mutex, semaphore, event — yadro darajasidagi sinxronlash.",
    icon: "lock"
  }, {
    id: "interrupts",
    name: "Interrupt dispatch",
    nameUz: "Interrupts",
    desc: "IRQL levels, ISRs, DPCs",
    descUz: "IRQL darajalar, ISR, DPC — hardware uzulishlarini ishlash.",
    icon: "zap"
  }]
}, {
  id: "drivers",
  name: "Device drivers",
  nameEn: "Device drivers",
  side: "kernel",
  color: "#b88cff",
  y: 3,
  components: [{
    id: "fsd",
    name: "Filesystem drivers (NTFS)",
    nameUz: "NTFS / ReFS",
    desc: "On-disk format & access",
    descUz: "Disk format va kirish — NTFS, ReFS, FAT32 drayverlari.",
    icon: "database"
  }, {
    id: "net",
    name: "Network drivers",
    nameUz: "Network",
    desc: "NDIS, TCP/IP, miniport",
    descUz: "Tarmoq drayverlari — NDIS stack, TCP/IP, miniport.",
    icon: "network"
  }, {
    id: "gpu",
    name: "GPU / display",
    nameUz: "GPU",
    desc: "Direct3D, kernel-mode graphics",
    descUz: "GPU drayverlari — DirectX kernel-mode qismi.",
    icon: "cpu"
  }]
}, {
  id: "hal",
  name: "HAL (Hardware Abstraction Layer)",
  nameEn: "Hardware Abstraction Layer",
  side: "kernel",
  color: "#8390a8",
  y: 4,
  desc: "hal.dll — translates between kernel and the actual CPU / chipset specifics",
  descUz: "hal.dll — yadro va aniq CPU/chipset orasidagi tarjima qatlami."
}, {
  id: "hw",
  name: "Hardware",
  nameEn: "Hardware",
  side: "hardware",
  color: "#5a6478",
  y: 5,
  components: [{
    id: "cpu",
    name: "CPU (ring 0 / ring 3)",
    nameUz: "CPU",
    desc: "Privilege rings enforced by silicon",
    descUz: "Privilege ring'lari (0/3) — protsessor darajasida amalga oshiriladi.",
    icon: "cpu"
  }, {
    id: "ram",
    name: "RAM",
    nameUz: "RAM",
    desc: "Physical memory pages",
    descUz: "Fizik xotira sahifalari.",
    icon: "database"
  }, {
    id: "disk",
    name: "Disk / NVMe",
    nameUz: "Disk",
    desc: "Block storage",
    descUz: "Disk — blok saqlash qurilmalari.",
    icon: "layers"
  }, {
    id: "nic",
    name: "NIC / GPU / USB",
    nameUz: "I/O qurilmalari",
    desc: "External devices",
    descUz: "Tashqi qurilmalar — NIC, GPU, USB.",
    icon: "network"
  }]
}];
function WindowsArchDiagram() {
  const [hovered, setHovered] = useWS(null);
  const [selected, setSelected] = useWS(null);
  const lang = useLang();
  const active = (() => {
    if (!hovered && !selected) return null;
    const id = selected || hovered;
    for (const l of ARCH_LAYERS) {
      for (const c of l.components || []) {
        if (c.id === id) return {
          ...c,
          layerColor: l.color,
          layerName: lang === "en" ? l.name : l.nameUz || l.name
        };
      }
    }
    return null;
  })();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      background: "radial-gradient(ellipse at center, rgba(13,19,36,0.85), rgba(4,6,13,0.95))",
      border: "1px solid var(--border)",
      borderRadius: "var(--r-lg)",
      overflow: "hidden",
      padding: "24px 28px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
      flexWrap: "wrap",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "chip",
    style: {
      background: "rgba(255,145,69,0.1)",
      color: "var(--c-user)",
      borderColor: "rgba(255,145,69,0.3)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-block",
      width: 8,
      height: 8,
      background: "var(--c-user)",
      borderRadius: 2
    }
  }), lang === "en" ? "User mode (ring 3)" : "User mode (ring 3)"), /*#__PURE__*/React.createElement("span", {
    className: "chip",
    style: {
      background: "rgba(77,139,255,0.1)",
      color: "var(--c-system)",
      borderColor: "rgba(77,139,255,0.3)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-block",
      width: 8,
      height: 8,
      background: "var(--c-system)",
      borderRadius: 2
    }
  }), lang === "en" ? "Kernel mode (ring 0)" : "Kernel mode (ring 0)"), /*#__PURE__*/React.createElement("span", {
    className: "chip chip-gray"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-block",
      width: 8,
      height: 8,
      background: "#5a6478",
      borderRadius: 2
    }
  }), "Hardware")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-2)",
      fontFamily: "var(--font-mono)"
    }
  }, /*#__PURE__*/React.createElement(LiveDot, null), " \xA0", /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 2
    }
  }, lang === "en" ? "Hover / click any block" : "Bloklarni bossang"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, ARCH_LAYERS.map(layer => /*#__PURE__*/React.createElement(ArchLayer, {
    key: layer.id,
    layer: layer,
    hovered: hovered,
    selected: selected,
    setHovered: setHovered,
    setSelected: setSelected,
    lang: lang
  }))), active && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      background: "rgba(4, 6, 13, 0.92)",
      border: `1px solid ${active.layerColor}`,
      borderRadius: 10,
      padding: "14px 18px",
      display: "flex",
      gap: 16,
      alignItems: "flex-start",
      boxShadow: `0 0 24px ${active.layerColor}33`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 8,
      background: active.layerColor + "20",
      border: `1px solid ${active.layerColor}`,
      display: "grid",
      placeItems: "center",
      color: active.layerColor,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: active.icon || "info",
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 14,
      fontWeight: 600,
      color: active.layerColor
    }
  }, lang === "en" ? active.name : active.nameUz || active.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "var(--text-2)",
      marginTop: 2
    }
  }, active.layerName), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontSize: 13,
      color: "var(--text-0)",
      lineHeight: 1.5
    }
  }, lang === "en" ? active.desc : active.descUz || active.desc)), /*#__PURE__*/React.createElement("button", {
    onClick: () => setSelected(null),
    className: "btn-ghost btn",
    style: {
      padding: 6,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 14
  }))));
}
function ArchLayer({
  layer,
  hovered,
  selected,
  setHovered,
  setSelected,
  lang
}) {
  if (layer.id === "boundary") {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        textAlign: "center",
        margin: "6px 0",
        padding: "8px 16px",
        background: "rgba(255, 204, 68, 0.06)",
        border: "1px dashed rgba(255, 204, 68, 0.4)",
        borderRadius: 6,
        color: "var(--c-warn)",
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: 0.18,
        textTransform: "uppercase"
      }
    }, "\u21D5 ", lang === "en" ? layer.nameEn : "User ↔ Kernel chegarasi (syscall)", " \u21D5", /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9.5,
        color: "var(--text-3)",
        letterSpacing: 0.1,
        textTransform: "none",
        marginTop: 2,
        fontStyle: "italic"
      }
    }, "syscall instruction \xB7 ring 3 \u2192 ring 0"));
  }
  const isCompound = layer.components && layer.components.length > 0;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      background: `linear-gradient(180deg, ${layer.color}0a, transparent)`,
      border: `1px solid ${layer.color}33`,
      borderLeft: `3px solid ${layer.color}`,
      borderRadius: 8,
      padding: "10px 14px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: isCompound ? 10 : 0
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      color: layer.color,
      letterSpacing: 0.1,
      fontWeight: 600
    }
  }, lang === "en" ? layer.nameEn || layer.name : layer.name === "User mode" ? "User mode" : layer.name), !isCompound && layer.desc && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--text-1)",
      marginTop: 4
    }
  }, lang === "en" ? layer.desc : layer.descUz || layer.desc)), layer.side && /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 9.5,
      color: "var(--text-3)",
      letterSpacing: 0.12,
      textTransform: "uppercase"
    }
  }, layer.side === "user" ? "ring 3" : layer.side === "kernel" ? "ring 0" : "hardware")), isCompound && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: `repeat(${Math.min(layer.components.length, 5)}, 1fr)`,
      gap: 6
    }
  }, layer.components.map(c => {
    const isActive = hovered === c.id || selected === c.id;
    return /*#__PURE__*/React.createElement("div", {
      key: c.id,
      onMouseEnter: () => setHovered(c.id),
      onMouseLeave: () => setHovered(null),
      onClick: () => setSelected(selected === c.id ? null : c.id),
      style: {
        padding: "10px 12px",
        background: isActive ? layer.color + "20" : "var(--bg-2)",
        border: `1px solid ${isActive ? layer.color : "var(--border)"}`,
        borderRadius: 6,
        cursor: "pointer",
        transition: "all 200ms",
        boxShadow: isActive ? `0 0 16px ${layer.color}55` : "none",
        transform: isActive ? "translateY(-1px)" : "none"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        color: layer.color
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: c.icon || "code",
      size: 14
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        fontWeight: 600,
        color: isActive ? "var(--text-0)" : "var(--text-1)"
      }
    }, lang === "en" ? c.name : c.nameUz || c.name)));
  })));
}
window.WindowsArchDiagram = WindowsArchDiagram;
// Keep ADTopology export for reuse later (it's used in the AD lesson)

// ─── components/ad-topology.jsx ───
// ad-topology.jsx — Interactive Active Directory topology
// Hand-crafted SVG: forest > tree > domain > DCs > clients. Hover to inspect, click to focus.

const {
  useState: useSt,
  useMemo: useMemo2
} = React;
const TOPOLOGY = {
  forest: {
    id: "f",
    name: "corp.local",
    label: "Forest Root"
  },
  domains: [{
    id: "d-root",
    name: "corp.local",
    x: 600,
    y: 140,
    kind: "root-domain",
    nodes: [{
      id: "dc01",
      name: "DC01",
      role: "Domain Controller",
      icon: "server",
      x: 480,
      y: 260,
      color: "var(--c-system)",
      desc: "Primary DC — holds FSMO roles",
      descUz: "Asosiy Domain Controller — FSMO rollarini saqlaydi"
    }, {
      id: "dc02",
      name: "DC02",
      role: "Domain Controller",
      icon: "server",
      x: 720,
      y: 260,
      color: "var(--c-system)",
      desc: "Replica DC for redundancy",
      descUz: "Zaxira DC — replikatsiya uchun"
    }]
  }, {
    id: "d-emea",
    name: "emea.corp.local",
    x: 280,
    y: 380,
    kind: "child-domain",
    nodes: [{
      id: "dc-em",
      name: "DC-EMEA",
      role: "Domain Controller",
      icon: "server",
      x: 200,
      y: 500,
      color: "var(--c-system)"
    }, {
      id: "ws-em01",
      name: "WS-EMEA-001",
      role: "Workstation",
      icon: "cpu",
      x: 100,
      y: 620,
      color: "var(--c-user)"
    }, {
      id: "ws-em02",
      name: "WS-EMEA-002",
      role: "Workstation",
      icon: "cpu",
      x: 220,
      y: 660,
      color: "var(--c-user)"
    }, {
      id: "fs-em",
      name: "FS-EMEA",
      role: "File Server (SMB)",
      icon: "database",
      x: 340,
      y: 600,
      color: "var(--c-system)"
    }]
  }, {
    id: "d-apac",
    name: "apac.corp.local",
    x: 920,
    y: 380,
    kind: "child-domain",
    nodes: [{
      id: "dc-ap",
      name: "DC-APAC",
      role: "Domain Controller",
      icon: "server",
      x: 1000,
      y: 500,
      color: "var(--c-system)"
    }, {
      id: "sql-ap",
      name: "SQL-APAC",
      role: "SQL Server (Kerb SPN)",
      icon: "database",
      x: 880,
      y: 600,
      color: "var(--c-auth)",
      desc: "Has registered SPN — Kerberoasting target",
      descUz: "SPN ro'yxatdan o'tgan — Kerberoasting nishoni"
    }, {
      id: "ws-ap01",
      name: "WS-APAC-001",
      role: "Workstation",
      icon: "cpu",
      x: 1100,
      y: 620,
      color: "var(--c-user)"
    }]
  }],
  trusts: [{
    from: "d-root",
    to: "d-emea",
    kind: "parent-child",
    bidi: true
  }, {
    from: "d-root",
    to: "d-apac",
    kind: "parent-child",
    bidi: true
  }]
};
function ADTopology({
  showAttackPath = false,
  animateAttack = false
}) {
  const [hovered, setHovered] = useSt(null);
  const [selected, setSelected] = useSt(null);
  const allNodes = useMemo2(() => {
    const list = [];
    TOPOLOGY.domains.forEach(d => d.nodes.forEach(n => list.push({
      ...n,
      domain: d.id
    })));
    return list;
  }, []);
  const activeNode = allNodes.find(n => n.id === (selected || hovered));

  // Attack path: ws-em01 → token theft → dc-em → kerberoast → sql-ap → dc-ap → dc01 (golden ticket)
  const attackPath = ["ws-em01", "dc-em", "sql-ap", "dc-ap", "dc01"];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      background: "radial-gradient(ellipse at center, rgba(13,19,36,0.85), rgba(4,6,13,0.95))",
      border: "1px solid var(--border)",
      borderRadius: "var(--r-lg)",
      overflow: "hidden",
      isolation: "isolate"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 14,
      left: 14,
      display: "flex",
      gap: 10,
      zIndex: 10,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "chip chip-blue"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "server",
    size: 11
  }), " Domain Controller"), /*#__PURE__*/React.createElement("span", {
    className: "chip",
    style: {
      background: "rgba(255, 145, 69, 0.1)",
      color: "var(--c-user)",
      borderColor: "rgba(255,145,69,0.3)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "cpu",
    size: 11
  }), " Workstation"), /*#__PURE__*/React.createElement("span", {
    className: "chip chip-purple"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "key",
    size: 11
  }), " SPN target"), showAttackPath && /*#__PURE__*/React.createElement("span", {
    className: "chip chip-red"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "skull",
    size: 11
  }), " Attack path")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 14,
      right: 14,
      fontSize: 11,
      color: "var(--text-2)",
      fontFamily: "var(--font-mono)",
      zIndex: 10
    }
  }, /*#__PURE__*/React.createElement(LiveDot, null), " \xA0", /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 4
    }
  }, "Live topology \xB7 ", allNodes.length + 3, " objects")), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 1200 720",
    style: {
      display: "block",
      width: "100%",
      height: "auto",
      maxHeight: 540
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("filter", {
    id: "ad-glow",
    x: "-50%",
    y: "-50%",
    width: "200%",
    height: "200%"
  }, /*#__PURE__*/React.createElement("feGaussianBlur", {
    stdDeviation: "3",
    result: "b"
  }), /*#__PURE__*/React.createElement("feMerge", null, /*#__PURE__*/React.createElement("feMergeNode", {
    in: "b"
  }), /*#__PURE__*/React.createElement("feMergeNode", {
    in: "SourceGraphic"
  }))), /*#__PURE__*/React.createElement("marker", {
    id: "arrow",
    viewBox: "0 0 10 10",
    refX: "9",
    refY: "5",
    markerWidth: "6",
    markerHeight: "6",
    orient: "auto-start-reverse"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M0,0 L10,5 L0,10 Z",
    fill: "currentColor"
  })), /*#__PURE__*/React.createElement("marker", {
    id: "arrow-red",
    viewBox: "0 0 10 10",
    refX: "9",
    refY: "5",
    markerWidth: "7",
    markerHeight: "7",
    orient: "auto-start-reverse"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M0,0 L10,5 L0,10 Z",
    fill: "#ff3a5e"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "trust-grad",
    x1: "0%",
    y1: "0%",
    x2: "100%",
    y2: "0%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "var(--accent)",
    stopOpacity: "0.4"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "var(--accent-2)",
    stopOpacity: "0.4"
  })), /*#__PURE__*/React.createElement("pattern", {
    id: "dot-grid",
    x: "0",
    y: "0",
    width: "40",
    height: "40",
    patternUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "20",
    cy: "20",
    r: "0.7",
    fill: "rgba(255,255,255,0.08)"
  }))), /*#__PURE__*/React.createElement("rect", {
    width: "1200",
    height: "720",
    fill: "url(#dot-grid)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: TOPOLOGY.forest.id ? 600 : 0,
    cy: "140",
    r: "80",
    fill: "none",
    stroke: "var(--accent-border)",
    strokeWidth: "0.6",
    strokeDasharray: "2 4",
    opacity: "0.4"
  }), TOPOLOGY.domains.map(d => {
    const nodes = d.nodes;
    if (nodes.length === 0) return null;
    const xs = nodes.map(n => n.x);
    const ys = nodes.map(n => n.y);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
    const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
    const r = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) / 2 + 70;
    return /*#__PURE__*/React.createElement("g", {
      key: d.id
    }, /*#__PURE__*/React.createElement("circle", {
      cx: cx,
      cy: cy,
      r: r,
      fill: "rgba(77, 139, 255, 0.04)",
      stroke: "rgba(77, 139, 255, 0.25)",
      strokeWidth: "1",
      strokeDasharray: "4 6"
    }), /*#__PURE__*/React.createElement("text", {
      x: cx,
      y: cy - r - 8,
      fill: "var(--c-system)",
      fontSize: "11",
      fontFamily: "var(--font-mono)",
      textAnchor: "middle",
      letterSpacing: "2"
    }, d.name.toUpperCase()));
  }), TOPOLOGY.trusts.map((t, i) => {
    const a = TOPOLOGY.domains.find(d => d.id === t.from);
    const b = TOPOLOGY.domains.find(d => d.id === t.to);
    if (!a || !b) return null;
    return /*#__PURE__*/React.createElement("g", {
      key: i
    }, /*#__PURE__*/React.createElement("line", {
      x1: a.x,
      y1: a.y,
      x2: b.x,
      y2: b.y,
      stroke: "url(#trust-grad)",
      strokeWidth: "2",
      strokeDasharray: "6 4",
      opacity: "0.7"
    }), /*#__PURE__*/React.createElement("text", {
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2 - 10,
      fill: "var(--accent)",
      fontSize: "10",
      fontFamily: "var(--font-mono)",
      textAnchor: "middle",
      opacity: "0.7"
    }, "\u21C4 TRUST"));
  }), /*#__PURE__*/React.createElement("g", {
    style: {
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "600",
    cy: "140",
    r: "36",
    fill: "var(--bg-2)",
    stroke: "var(--accent)",
    strokeWidth: "2",
    filter: "url(#ad-glow)"
  }), /*#__PURE__*/React.createElement("g", {
    transform: "translate(584, 124)",
    stroke: "var(--accent)",
    strokeWidth: "1.6",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M16 2l14 7-14 7L2 9l14-7z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M2 14l14 7 14-7M2 19l14 7 14-7"
  })), /*#__PURE__*/React.createElement("text", {
    x: "600",
    y: "200",
    fill: "var(--accent)",
    fontSize: "12",
    fontFamily: "var(--font-mono)",
    textAnchor: "middle",
    fontWeight: "600"
  }, "FOREST ROOT"), /*#__PURE__*/React.createElement("text", {
    x: "600",
    y: "215",
    fill: "var(--text-2)",
    fontSize: "10",
    fontFamily: "var(--font-mono)",
    textAnchor: "middle"
  }, "corp.local")), TOPOLOGY.domains.filter(d => d.kind === "child-domain").map(d => /*#__PURE__*/React.createElement("line", {
    key: d.id,
    x1: "600",
    y1: "176",
    x2: d.x,
    y2: d.y - 40,
    stroke: "var(--border-strong)",
    strokeWidth: "1.2",
    strokeDasharray: "3 5"
  })), TOPOLOGY.domains.map(d => d.nodes.filter(n => n.role.includes("Domain Controller")).map(n => /*#__PURE__*/React.createElement("line", {
    key: `l-${n.id}`,
    x1: d.x,
    y1: d.y,
    x2: n.x,
    y2: n.y,
    stroke: "var(--c-system)",
    strokeWidth: "1",
    opacity: "0.5"
  }))), TOPOLOGY.domains.map(d => {
    const dc = d.nodes.find(n => n.role.includes("Domain Controller"));
    if (!dc) return null;
    return d.nodes.filter(n => n !== dc).map(n => /*#__PURE__*/React.createElement("line", {
      key: `c-${n.id}`,
      x1: dc.x,
      y1: dc.y,
      x2: n.x,
      y2: n.y,
      stroke: "var(--border-strong)",
      strokeWidth: "0.8",
      opacity: "0.6"
    }));
  }), showAttackPath && attackPath.slice(0, -1).map((id, i) => {
    const a = allNodes.find(n => n.id === id);
    const b = allNodes.find(n => n.id === attackPath[i + 1]);
    if (!a || !b) return null;
    return /*#__PURE__*/React.createElement("g", {
      key: `atk-${i}`
    }, /*#__PURE__*/React.createElement("line", {
      x1: a.x,
      y1: a.y,
      x2: b.x,
      y2: b.y,
      stroke: "#ff3a5e",
      strokeWidth: "2.2",
      strokeDasharray: animateAttack ? "8 6" : "0",
      markerEnd: "url(#arrow-red)",
      style: {
        filter: "drop-shadow(0 0 6px #ff3a5e)",
        animation: animateAttack ? "dash-flow 1.4s linear infinite" : "none"
      }
    }), animateAttack && /*#__PURE__*/React.createElement("circle", {
      r: "4",
      fill: "#ff3a5e",
      style: {
        filter: "drop-shadow(0 0 8px #ff3a5e)"
      }
    }, /*#__PURE__*/React.createElement("animateMotion", {
      dur: `${2 + i * 0.4}s`,
      repeatCount: "indefinite",
      path: `M${a.x},${a.y} L${b.x},${b.y}`,
      begin: `${i * 0.5}s`
    })));
  }), allNodes.map(n => {
    const isHover = hovered === n.id || selected === n.id;
    const isAttack = showAttackPath && attackPath.includes(n.id);
    return /*#__PURE__*/React.createElement("g", {
      key: n.id,
      style: {
        cursor: "pointer"
      },
      onMouseEnter: () => setHovered(n.id),
      onMouseLeave: () => setHovered(null),
      onClick: () => setSelected(selected === n.id ? null : n.id)
    }, isAttack && /*#__PURE__*/React.createElement("circle", {
      cx: n.x,
      cy: n.y,
      r: "26",
      fill: "none",
      stroke: "#ff3a5e",
      strokeWidth: "0.8",
      opacity: "0.6"
    }, /*#__PURE__*/React.createElement("animate", {
      attributeName: "r",
      values: "22;30;22",
      dur: "2s",
      repeatCount: "indefinite"
    }), /*#__PURE__*/React.createElement("animate", {
      attributeName: "opacity",
      values: "0.6;0.1;0.6",
      dur: "2s",
      repeatCount: "indefinite"
    })), /*#__PURE__*/React.createElement("circle", {
      cx: n.x,
      cy: n.y,
      r: isHover ? 22 : 18,
      fill: "var(--bg-2)",
      stroke: isAttack ? "#ff3a5e" : n.color,
      strokeWidth: isHover ? 2.4 : 1.6,
      filter: isHover || isAttack ? "url(#ad-glow)" : "",
      style: {
        transition: "all 200ms"
      }
    }), /*#__PURE__*/React.createElement("foreignObject", {
      x: n.x - 10,
      y: n.y - 10,
      width: "20",
      height: "20",
      style: {
        pointerEvents: "none",
        color: isAttack ? "#ff3a5e" : n.color
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: n.icon,
      size: 20
    })), /*#__PURE__*/React.createElement("text", {
      x: n.x,
      y: n.y + 38,
      fill: isHover ? "var(--text-0)" : "var(--text-1)",
      fontSize: "11",
      fontFamily: "var(--font-mono)",
      textAnchor: "middle"
    }, n.name));
  })), activeNode && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      bottom: 14,
      left: 14,
      right: 14,
      background: "rgba(4, 6, 13, 0.92)",
      border: `1px solid ${activeNode.color}`,
      borderRadius: 10,
      padding: "14px 18px",
      backdropFilter: "blur(12px)",
      display: "flex",
      gap: 16,
      alignItems: "flex-start",
      boxShadow: `0 0 24px ${activeNode.color}33`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: "50%",
      background: activeNode.color + "20",
      border: `1px solid ${activeNode.color}`,
      display: "grid",
      placeItems: "center",
      color: activeNode.color,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: activeNode.icon,
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 14,
      fontWeight: 600,
      color: activeNode.color
    }
  }, activeNode.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "var(--text-1)",
      marginTop: 2
    }
  }, activeNode.role, " \xB7 ", TOPOLOGY.domains.find(d => d.id === activeNode.domain)?.name), activeNode.descUz && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontSize: 12.5,
      color: "var(--text-0)"
    }
  }, activeNode.descUz), activeNode.desc && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "var(--text-2)",
      fontStyle: "italic"
    }
  }, activeNode.desc)), /*#__PURE__*/React.createElement("button", {
    onClick: () => setSelected(null),
    className: "btn-ghost btn",
    style: {
      padding: 6,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 14
  }))), /*#__PURE__*/React.createElement("style", null, `
        @keyframes dash-flow { to { stroke-dashoffset: -14; } }
      `));
}
window.ADTopology = ADTopology;

// ─── screens/landing.jsx ───
// landing.jsx — marketing / entry page (single-lang)

function LandingScreen({
  setRoute
}) {
  const lang = useLang();
  const stats = [{
    n: "6",
    uz: "Bo'limlar",
    en: "Sections"
  }, {
    n: "120+",
    uz: "Darslar",
    en: "Lessons"
  }, {
    n: "85",
    uz: "Laboratoriya",
    en: "Labs"
  }, {
    n: "AI",
    uz: "Tekshiruv",
    en: "Validation"
  }];
  const sections = [{
    num: "01",
    uz: "Windows asoslari",
    en: "Windows Internals & Architecture",
    icon: "cpu",
    lessons: 20,
    color: "var(--c-system)"
  }, {
    num: "02",
    uz: "Administratsiya",
    en: "Enterprise Administration",
    icon: "settings",
    lessons: 20,
    color: "var(--c-user)"
  }, {
    num: "03",
    uz: "Windows xavfsizligi",
    en: "Authentication & Defense",
    icon: "shield-check",
    lessons: 20,
    color: "var(--accent)"
  }, {
    num: "04",
    uz: "Windows Pentesting",
    en: "Red Team Operations",
    icon: "skull",
    lessons: 20,
    color: "var(--c-attack)"
  }, {
    num: "05",
    uz: "Windows Forensics",
    en: "Incident Response & Hunting",
    icon: "search",
    lessons: 20,
    color: "var(--c-auth)"
  }, {
    num: "06",
    uz: "Server Infrastruktura",
    en: "Enterprise Deployment",
    icon: "server",
    lessons: 20,
    color: "var(--c-warn)"
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(TopNav, {
    route: {
      name: "landing"
    },
    setRoute: setRoute,
    user: null
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      position: "relative",
      padding: "80px 28px 60px",
      maxWidth: 1320,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.2fr 1fr",
      gap: 48,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "fade-up"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(LiveDot, null), /*#__PURE__*/React.createElement("span", null, "SECTOR_03 // RED_TEAM_BLUE_TEAM_TRAINING")), lang === "en" ? /*#__PURE__*/React.createElement("h1", {
    className: "display",
    style: heroH1
  }, "The first academy that", /*#__PURE__*/React.createElement("br", null), "truly teaches", " ", /*#__PURE__*/React.createElement("span", {
    style: gradient
  }, "Windows security"), ".") : /*#__PURE__*/React.createElement("h1", {
    className: "display",
    style: heroH1
  }, "Windows xavfsizligini", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: gradient
  }, "egallashning"), " ilk akademiyasi."), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 22,
      fontSize: 17,
      lineHeight: 1.55,
      color: "var(--text-1)",
      maxWidth: 580
    }
  }, lang === "en" ? "A professional learning platform that teaches Windows internals, Active Directory, offensive and defensive security down to the kernel — with AI-graded mastery checks." : "Windows arxitekturasi, Active Directory, hujum va himoyani kernel-darajagacha o'rganadigan, AI tomonidan baholanadigan, professional o'quv platforma."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      marginTop: 36,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => setRoute({
      name: "dashboard"
    })
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "play",
    size: 14
  }), " ", lang === "en" ? "Start training" : "Boshlash"), /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: () => setRoute({
      name: "section",
      section: 1
    })
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "book",
    size: 14
  }), " ", lang === "en" ? "See curriculum" : "Dasturni ko'rish")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 24,
      marginTop: 56,
      paddingTop: 32,
      borderTop: "1px solid var(--border)"
    }
  }, stats.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "stat fade-up",
    style: {
      animationDelay: `${0.1 + i * 0.08}s`
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-n"
  }, s.n), /*#__PURE__*/React.createElement("div", {
    className: "stat-l"
  }, lang === "en" ? s.en : s.uz))))), /*#__PURE__*/React.createElement(HeroVisual, null))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1320,
      margin: "0 auto",
      padding: "60px 28px"
    }
  }, /*#__PURE__*/React.createElement(SectionH, {
    eyebrow: "// CURRICULUM",
    uz: "Olti bo'limli yo'l xaritasi",
    en: "A six-section roadmap from fundamentals to red-team mastery"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 16,
      marginTop: 20
    }
  }, sections.map((s, i) => /*#__PURE__*/React.createElement("button", {
    key: s.num,
    onClick: () => setRoute({
      name: "section",
      section: i + 1
    }),
    style: sectionCardBtn,
    onMouseEnter: e => {
      e.currentTarget.style.borderColor = s.color;
      e.currentTarget.style.transform = "translateY(-3px)";
      e.currentTarget.style.boxShadow = `0 12px 40px ${s.color}22`;
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = "var(--border)";
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "none";
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      color: s.color,
      letterSpacing: 0.18,
      textTransform: "uppercase"
    }
  }, lang === "en" ? `SECTION ${s.num}` : `${s.num}-BO'LIM`), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 8,
      background: s.color + "12",
      border: `1px solid ${s.color}44`,
      display: "grid",
      placeItems: "center",
      color: s.color
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: s.icon,
    size: 18
  }))), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 19,
      fontWeight: 600,
      margin: "16px 0 8px",
      letterSpacing: "-0.01em"
    }
  }, lang === "en" ? s.en : s.uz), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 11,
      color: "var(--text-2)"
    }
  }, lang === "en" ? `${s.lessons} lessons · ${Math.floor(s.lessons * 0.4)} labs` : `${s.lessons} ta dars · ${Math.floor(s.lessons * 0.4)} ta lab`), /*#__PURE__*/React.createElement("span", {
    style: {
      color: s.color,
      display: "flex",
      alignItems: "center",
      gap: 6,
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 14
  }))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1320,
      margin: "0 auto",
      padding: "60px 28px"
    }
  }, /*#__PURE__*/React.createElement(SectionH, {
    eyebrow: "// FEATURES",
    uz: "Akademiyaning ustun jihatlari",
    en: "What makes this different"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(FeatureCard, {
    icon: "zap",
    uz: ["AI-baholash", "Yozma javoblar Claude tomonidan tushuncha chuqurligi va kontekst bo'yicha tahlil qilinadi. 70 baldan past — keyingi darsga o'tib bo'lmaydi."],
    en: ["Semantic AI grading", "Written answers are graded by Claude for depth and context. Below 70 you don't advance."]
  }), /*#__PURE__*/React.createElement(FeatureCard, {
    icon: "lock",
    color: "var(--c-warn)",
    uz: ["Haqiqiy cooldown", "Test yiqilgan zahoti 30 minutlik bloklash. Hech qanday cheat, hech qanday speed-run."],
    en: ["Real consequence", "Fail a quiz and you're locked for 30 minutes. No cheats, no speed-runs."]
  }), /*#__PURE__*/React.createElement(FeatureCard, {
    icon: "target",
    color: "var(--c-attack)",
    uz: ["MITRE ATT&CK uslubida", "Har bir hujum darsi tactic, technique va detection opportunity bilan birga keladi."],
    en: ["Mapped to MITRE ATT&CK", "Every offensive lesson maps to a tactic, technique, and detection opportunity."]
  }), /*#__PURE__*/React.createElement(FeatureCard, {
    icon: "graph",
    color: "var(--c-system)",
    uz: ["Jonli laboratoriya", "PowerShell, Mimikatz, BloodHound, CrackMapExec — annotatsion screenshot va step-by-step."],
    en: ["Live labs", "PowerShell, Mimikatz, BloodHound, CrackMapExec — annotated and step-by-step."]
  }), /*#__PURE__*/React.createElement(FeatureCard, {
    icon: "globe",
    color: "var(--c-auth)",
    uz: ["Ikki tilli kontent", "Har bir dars va savol o'zbek va ingliz tillarida. Yuqoridagi tugma orqali bir zumda almashtiring."],
    en: ["Fully bilingual", "Every lesson and quiz in both Uzbek and English — toggle from the top bar anytime."]
  }), /*#__PURE__*/React.createElement(FeatureCard, {
    icon: "shield-check",
    uz: ["Red va Blue Team", "Har bir hujum keyingi darsda himoya rejasi va detection logikasi bilan to'ldiriladi."],
    en: ["Red & Blue side-by-side", "Every offensive technique is paired with a defensive playbook and detection logic."]
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1320,
      margin: "60px auto 80px",
      padding: "0 28px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-strong",
    style: {
      padding: "48px",
      textAlign: "center",
      borderRadius: 24,
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "radial-gradient(ellipse at top, var(--accent-soft), transparent 60%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "// READY_TO_BREAK_IN"), /*#__PURE__*/React.createElement("h2", {
    className: "display",
    style: {
      fontSize: 40,
      margin: "12px 0 8px",
      letterSpacing: "-0.02em"
    }
  }, lang === "en" ? "Start with lesson one." : "Birinchi darsdan boshlang."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-1)",
      fontSize: 15
    }
  }, lang === "en" ? "Windows architecture is waiting — what's inside the OS, really." : "Windows arxitekturasi sizni kutmoqda — OS ichida nima borligini bilib oling."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      justifyContent: "center",
      marginTop: 28
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => setRoute({
      name: "lesson",
      section: 1,
      lesson: 1
    })
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "play",
    size: 14
  }), " ", lang === "en" ? "Open first lesson" : "Birinchi darsni ochish"), /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: () => setRoute({
      name: "dashboard"
    })
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "user",
    size: 14
  }), " ", lang === "en" ? "My dashboard" : "Mening dashboardim"))))), /*#__PURE__*/React.createElement(Footer, null));
}
const heroH1 = {
  fontSize: "clamp(44px, 5.4vw, 76px)",
  lineHeight: 1.02,
  margin: 0,
  letterSpacing: "-0.035em",
  fontWeight: 600
};
const gradient = {
  background: "linear-gradient(90deg, var(--accent), var(--accent-2))",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text"
};
const sectionCardBtn = {
  appearance: "none",
  border: 0,
  cursor: "pointer",
  textAlign: "left",
  background: "var(--surface)",
  borderRadius: 16,
  padding: "22px 22px 20px",
  border: "1px solid var(--border)",
  transition: "all 250ms",
  position: "relative",
  overflow: "hidden",
  color: "inherit",
  font: "inherit"
};
function FeatureCard({
  icon,
  uz,
  en,
  color = "var(--accent)"
}) {
  const lang = useLang();
  const [title, desc] = lang === "en" ? en : uz;
  return /*#__PURE__*/React.createElement("div", {
    className: "glass",
    style: {
      padding: "22px",
      borderRadius: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 38,
      height: 38,
      borderRadius: 8,
      background: color + "12",
      border: `1px solid ${color}33`,
      display: "grid",
      placeItems: "center",
      color,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 17,
      fontWeight: 600,
      letterSpacing: "-0.01em",
      marginBottom: 8
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--text-1)",
      lineHeight: 1.55
    }
  }, desc));
}

// Hero visual — orbiting Windows architecture
function HeroVisual() {
  const lang = useLang();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      aspectRatio: "1",
      maxWidth: 480,
      marginLeft: "auto"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 400 400",
    style: {
      width: "100%",
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("radialGradient", {
    id: "core-grad",
    cx: "50%",
    cy: "50%",
    r: "50%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "var(--accent)",
    stopOpacity: "0.8"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "var(--accent)",
    stopOpacity: "0"
  })), /*#__PURE__*/React.createElement("filter", {
    id: "hero-glow",
    x: "-50%",
    y: "-50%",
    width: "200%",
    height: "200%"
  }, /*#__PURE__*/React.createElement("feGaussianBlur", {
    stdDeviation: "4",
    result: "b"
  }), /*#__PURE__*/React.createElement("feMerge", null, /*#__PURE__*/React.createElement("feMergeNode", {
    in: "b"
  }), /*#__PURE__*/React.createElement("feMergeNode", {
    in: "SourceGraphic"
  })))), [180, 140, 100].map((r, i) => /*#__PURE__*/React.createElement("circle", {
    key: i,
    cx: "200",
    cy: "200",
    r: r,
    fill: "none",
    stroke: "var(--accent)",
    strokeOpacity: 0.15 - i * 0.03,
    strokeWidth: "1",
    strokeDasharray: "4 6",
    style: {
      transformOrigin: "200px 200px",
      animation: `spin-slow ${30 + i * 10}s linear infinite ${i % 2 ? "reverse" : "normal"}`
    }
  })), /*#__PURE__*/React.createElement("circle", {
    cx: "200",
    cy: "200",
    r: "80",
    fill: "url(#core-grad)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "200",
    cy: "200",
    r: "42",
    fill: "var(--bg-2)",
    stroke: "var(--accent)",
    strokeWidth: "2",
    filter: "url(#hero-glow)"
  }), /*#__PURE__*/React.createElement("g", {
    transform: "translate(180, 180)",
    fill: "var(--accent)"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "0",
    width: "18",
    height: "18",
    rx: "2"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "22",
    y: "0",
    width: "18",
    height: "18",
    rx: "2"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "22",
    width: "18",
    height: "18",
    rx: "2"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "22",
    y: "22",
    width: "18",
    height: "18",
    rx: "2"
  })), /*#__PURE__*/React.createElement("g", {
    style: {
      transformOrigin: "200px 200px",
      animation: "spin-slow 24s linear infinite"
    }
  }, ["lock", "key", "shield", "skull", "server", "users", "database", "terminal"].map((ic, i) => {
    const ang = i / 8 * Math.PI * 2;
    const r = i % 2 ? 140 : 180;
    const x = 200 + Math.cos(ang) * r;
    const y = 200 + Math.sin(ang) * r;
    const colors = ["var(--c-attack)", "var(--c-auth)", "var(--accent)", "var(--c-attack)", "var(--c-system)", "var(--c-user)", "var(--c-system)", "var(--accent-2)"];
    return /*#__PURE__*/React.createElement("g", {
      key: i,
      style: {
        transformOrigin: `${x}px ${y}px`,
        animation: `spin-slow 24s linear infinite reverse`
      }
    }, /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: "20",
      fill: "var(--bg-2)",
      stroke: colors[i],
      strokeWidth: "1.5"
    }), /*#__PURE__*/React.createElement("foreignObject", {
      x: x - 10,
      y: y - 10,
      width: "20",
      height: "20",
      style: {
        color: colors[i]
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: ic,
      size: 20
    })));
  })), [0, 1, 2, 3].map(i => {
    const ang = i / 4 * Math.PI * 2;
    return /*#__PURE__*/React.createElement("line", {
      key: i,
      x1: "200",
      y1: "200",
      x2: 200 + Math.cos(ang) * 180,
      y2: 200 + Math.sin(ang) * 180,
      stroke: "var(--accent)",
      strokeOpacity: "0.2",
      strokeWidth: "1",
      strokeDasharray: "2 6"
    });
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "5%",
      left: "-5%",
      background: "var(--surface)",
      border: "1px solid var(--accent-border)",
      borderRadius: 8,
      padding: "8px 12px",
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--accent)",
      backdropFilter: "blur(10px)"
    }
  }, /*#__PURE__*/React.createElement(LiveDot, null), " \xA0LSASS \xB7 ", lang === "en" ? "monitored" : "kuzatilmoqda"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      bottom: "12%",
      right: "-5%",
      background: "var(--surface)",
      border: "1px solid rgba(255,58,94,0.3)",
      borderRadius: 8,
      padding: "8px 12px",
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--c-attack)",
      backdropFilter: "blur(10px)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "skull",
    size: 11
  }), " \xA0Kerberoasting active"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "45%",
      right: "-8%",
      background: "var(--surface)",
      border: "1px solid rgba(184,140,255,0.3)",
      borderRadius: 8,
      padding: "8px 12px",
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--c-auth)",
      backdropFilter: "blur(10px)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "key",
    size: 11
  }), " \xA0TGT issued"));
}
function Footer() {
  const lang = useLang();
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: "1px solid var(--border)",
      padding: "32px 28px",
      maxWidth: 1320,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--text-3)",
      letterSpacing: 0.1,
      textTransform: "uppercase"
    }
  }, "\xA9 2026 Windows Academy \xB7 build 2026.05.15"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 18,
      fontSize: 12,
      color: "var(--text-2)"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: footerLink
  }, lang === "en" ? "Documentation" : "Hujjatlar"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: footerLink
  }, "Discord"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: footerLink
  }, "GitHub"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: footerLink
  }, "Status"))));
}
const footerLink = {
  color: "inherit",
  textDecoration: "none"
};
window.LandingScreen = LandingScreen;

// ─── screens/dashboard.jsx ───
// dashboard.jsx — user dashboard (single-lang, points to Section 01 lesson 01)

function DashboardScreen({
  setRoute,
  user,
  onOpenProfile
}) {
  const lang = useLang();
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(TopNav, {
    route: {
      name: "dashboard"
    },
    setRoute: setRoute,
    user: user,
    onOpenProfile: onOpenProfile,
    crumb: [{
      label: lang === "en" ? "Dashboard" : "Boshqaruv"
    }]
  }), /*#__PURE__*/React.createElement("div", {
    className: "page",
    style: {
      paddingTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 32,
      gap: 24,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, /*#__PURE__*/React.createElement(LiveDot, null), " \xA0OPERATOR_ID: ", (user?.name || "DAGZO").toUpperCase().replace(/\s/g, "_"), " \xB7 XP: ", user?.xp || 0, " \xB7 LVL: ", user?.level || 1), /*#__PURE__*/React.createElement("h1", {
    className: "display",
    style: {
      fontSize: 40,
      margin: "10px 0 6px",
      letterSpacing: "-0.02em"
    }
  }, lang === "en" ? `Welcome back, ${user?.name || "Dagzo"}` : `Xush kelibsiz, ${user?.name || "Dagzo"}`, /*#__PURE__*/React.createElement("span", {
    className: "caret"
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-2)",
      margin: 0
    }
  }, lang === "en" ? `Level ${user?.level || 1} · ${user?.xp || 0} XP · ${user?.completedLessons?.length || 0} lessons completed` : `${user?.level || 1}-daraja · ${user?.xp || 0} XP · ${user?.completedLessons?.length || 0} ta dars tugatildi`)), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => setRoute({
      name: "lesson",
      section: 1,
      lesson: 1
    })
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "play",
    size: 14
  }), " ", lang === "en" ? "Continue: Windows architecture" : "Davom etish: Windows arxitekturasi")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 14,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    icon: "flame",
    color: "var(--c-attack)",
    n: user?.level || 1,
    suffix: lang === "en" ? "lvl" : "lvl",
    uz: "Daraja",
    en: "Level"
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "zap",
    color: "var(--accent)",
    n: user?.xp || "0",
    uz: "Tajriba",
    en: "Total XP"
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "trophy",
    color: "var(--c-warn)",
    n: user?.completedLessons?.length || 0,
    suffix: "/ 20",
    uz: "Darslar",
    en: "Lessons done"
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "target",
    color: "var(--c-auth)",
    n: "\u2014",
    uz: "O'rtacha test",
    en: "Avg quiz score"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.4fr 1fr",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(ContinueCard, {
    setRoute: setRoute
  }), /*#__PURE__*/React.createElement("div", {
    className: "glass",
    style: {
      padding: "22px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "// SKILL_TREE"), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: "4px 0 0",
      fontFamily: "var(--font-display)",
      fontSize: 20
    }
  }, lang === "en" ? "Skill tree" : "Ko'nikma daraxti")), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 11,
      color: "var(--text-2)"
    }
  }, "3/6 unlocked")), /*#__PURE__*/React.createElement(SkillTree, null))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(Heatmap, null), /*#__PURE__*/React.createElement(Achievements, null), /*#__PURE__*/React.createElement(UpcomingExam, {
    setRoute: setRoute
  }))), /*#__PURE__*/React.createElement("div", {
    className: "glass",
    style: {
      padding: "22px",
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 4
    }
  }, "// CURRICULUM_MAP"), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: "0 0 18px",
      fontFamily: "var(--font-display)",
      fontSize: 20
    }
  }, lang === "en" ? "Progress by section" : "Bo'limlar bo'yicha o'sish"), /*#__PURE__*/React.createElement(SectionProgress, {
    setRoute: setRoute
  }))));
}
function StatCard({
  icon,
  color,
  n,
  suffix,
  uz,
  en
}) {
  const lang = useLang();
  return /*#__PURE__*/React.createElement("div", {
    className: "glass",
    style: {
      padding: 18,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-n",
    style: {
      color
    }
  }, n, suffix && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      color: "var(--text-2)",
      marginLeft: 4
    }
  }, suffix)), /*#__PURE__*/React.createElement("div", {
    className: "stat-l"
  }, lang === "en" ? en : uz)), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 8,
      background: color + "10",
      border: `1px solid ${color}33`,
      color,
      display: "grid",
      placeItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 16
  })));
}
function ContinueCard({
  setRoute
}) {
  const lang = useLang();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      borderRadius: 16,
      overflow: "hidden",
      padding: "26px 28px",
      background: "linear-gradient(135deg, rgba(0,255,156,0.08), rgba(13,19,36,0.6) 60%)",
      border: "1px solid var(--accent-border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "radial-gradient(ellipse at top right, var(--accent-soft), transparent 60%)",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "grid",
      gridTemplateColumns: "1fr auto",
      gap: 24,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(LiveDot, null), " ", lang === "en" ? "SECTION 01 · LESSON 01 · IN PROGRESS" : "01-BO'LIM · DARS 01 · DAVOM ETMOQDA"), /*#__PURE__*/React.createElement("h2", {
    className: "display",
    style: {
      fontSize: 28,
      margin: "10px 0 6px",
      letterSpacing: "-0.02em"
    }
  }, lang === "en" ? "Windows architecture" : "Windows arxitekturasi"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-1)",
      fontSize: 13.5,
      margin: 0
    }
  }, lang === "en" ? "What's actually happening inside the operating system — kernel mode, user mode, syscalls, and where security lives." : "Operatsion tizim ichida nima sodir bo'lmoqda — kernel mode, user mode, syscall'lar va xavfsizlik qaerda yashaydi."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      maxWidth: 380
    }
  }, /*#__PURE__*/React.createElement(Progress, {
    value: 42,
    label: lang === "en" ? "Lesson progress" : "Dars taraqqiyoti"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 16,
      marginTop: 16,
      fontSize: 12,
      color: "var(--text-2)"
    }
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 12
  }), " \xA0", lang === "en" ? "~24 min left" : "~24 min qoldi"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Icon, {
    name: "book",
    size: 12
  }), " \xA0", lang === "en" ? "9 diagrams" : "9 ta diagramma"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Icon, {
    name: "terminal",
    size: 12
  }), " \xA0", lang === "en" ? "3 labs" : "3 ta lab"))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => setRoute({
      name: "lesson",
      section: 1,
      lesson: 1
    })
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "play",
    size: 14
  }), " ", lang === "en" ? "Resume" : "Davom etish")));
}
function SkillTree() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 360
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 600 360",
    style: {
      width: "100%",
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("filter", {
    id: "st-glow",
    x: "-50%",
    y: "-50%",
    width: "200%",
    height: "200%"
  }, /*#__PURE__*/React.createElement("feGaussianBlur", {
    stdDeviation: "3",
    result: "b"
  }), /*#__PURE__*/React.createElement("feMerge", null, /*#__PURE__*/React.createElement("feMergeNode", {
    in: "b"
  }), /*#__PURE__*/React.createElement("feMergeNode", {
    in: "SourceGraphic"
  })))), [{
    from: [300, 180],
    to: [150, 90],
    state: "active"
  }, {
    from: [300, 180],
    to: [450, 90],
    state: "open"
  }, {
    from: [300, 180],
    to: [150, 270],
    state: "open"
  }, {
    from: [300, 180],
    to: [450, 270],
    state: "locked"
  }, {
    from: [150, 90],
    to: [60, 50],
    state: "active"
  }, {
    from: [150, 270],
    to: [60, 310],
    state: "locked"
  }, {
    from: [450, 90],
    to: [540, 50],
    state: "locked"
  }, {
    from: [450, 270],
    to: [540, 310],
    state: "locked"
  }].map((l, i) => /*#__PURE__*/React.createElement("line", {
    key: i,
    x1: l.from[0],
    y1: l.from[1],
    x2: l.to[0],
    y2: l.to[1],
    stroke: l.state === "active" ? "var(--accent)" : l.state === "open" ? "var(--accent-2)" : "var(--text-3)",
    strokeWidth: l.state === "locked" ? 1 : 1.6,
    strokeDasharray: l.state === "locked" ? "3 5" : "0",
    strokeOpacity: l.state === "locked" ? 0.4 : 0.7
  })), /*#__PURE__*/React.createElement("g", {
    filter: "url(#st-glow)"
  }, /*#__PURE__*/React.createElement(SVGSkillNode, {
    x: 300,
    y: 180,
    state: "active",
    icon: "cpu",
    label: "Windows",
    sub: "In progress"
  }), /*#__PURE__*/React.createElement(SVGSkillNode, {
    x: 150,
    y: 90,
    state: "active",
    icon: "layers",
    label: "Architecture",
    sub: "L01"
  }), /*#__PURE__*/React.createElement(SVGSkillNode, {
    x: 450,
    y: 90,
    state: "open",
    icon: "terminal",
    label: "PowerShell",
    sub: "Available"
  }), /*#__PURE__*/React.createElement(SVGSkillNode, {
    x: 150,
    y: 270,
    state: "open",
    icon: "settings",
    label: "Admin",
    sub: "Available"
  }), /*#__PURE__*/React.createElement(SVGSkillNode, {
    x: 60,
    y: 50,
    state: "active",
    icon: "key",
    label: "Kernel",
    sub: "L02",
    small: true
  }), /*#__PURE__*/React.createElement(SVGSkillNode, {
    x: 540,
    y: 50,
    state: "locked",
    icon: "shield-check",
    label: "Security",
    sub: "Locked",
    small: true
  }), /*#__PURE__*/React.createElement(SVGSkillNode, {
    x: 60,
    y: 310,
    state: "locked",
    icon: "search",
    label: "Forensics",
    sub: "Locked",
    small: true
  }), /*#__PURE__*/React.createElement(SVGSkillNode, {
    x: 450,
    y: 270,
    state: "locked",
    icon: "skull",
    label: "Pentest",
    sub: "Locked"
  }), /*#__PURE__*/React.createElement(SVGSkillNode, {
    x: 540,
    y: 310,
    state: "locked",
    icon: "server",
    label: "Server",
    sub: "Locked",
    small: true
  }))));
}
function SVGSkillNode({
  x,
  y,
  state,
  icon,
  label,
  sub,
  small
}) {
  const r = small ? 22 : 32;
  const colors = {
    done: {
      stroke: "var(--accent)",
      fill: "rgba(0,255,156,0.12)",
      text: "var(--accent)"
    },
    active: {
      stroke: "var(--accent-2)",
      fill: "var(--bg-2)",
      text: "var(--accent-2)"
    },
    open: {
      stroke: "var(--c-system)",
      fill: "var(--bg-2)",
      text: "var(--c-system)"
    },
    locked: {
      stroke: "var(--text-3)",
      fill: "var(--bg-1)",
      text: "var(--text-3)"
    }
  };
  const c = colors[state];
  return /*#__PURE__*/React.createElement("g", {
    style: {
      cursor: "pointer"
    }
  }, state === "active" && /*#__PURE__*/React.createElement("circle", {
    cx: x,
    cy: y,
    r: r + 8,
    fill: "none",
    stroke: "var(--accent-2)",
    strokeWidth: "1",
    opacity: "0.4"
  }, /*#__PURE__*/React.createElement("animate", {
    attributeName: "r",
    values: `${r + 4};${r + 14};${r + 4}`,
    dur: "2.4s",
    repeatCount: "indefinite"
  }), /*#__PURE__*/React.createElement("animate", {
    attributeName: "opacity",
    values: "0.5;0;0.5",
    dur: "2.4s",
    repeatCount: "indefinite"
  })), /*#__PURE__*/React.createElement("circle", {
    cx: x,
    cy: y,
    r: r,
    fill: c.fill,
    stroke: c.stroke,
    strokeWidth: state === "active" ? 2.2 : 1.6
  }), /*#__PURE__*/React.createElement("foreignObject", {
    x: x - r * 0.4,
    y: y - r * 0.4,
    width: r * 0.8,
    height: r * 0.8,
    style: {
      color: c.text
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: state === "locked" ? "lock" : icon,
    size: r * 0.8
  })), label && /*#__PURE__*/React.createElement("text", {
    x: x,
    y: y + r + 14,
    fill: state === "locked" ? "var(--text-3)" : "var(--text-0)",
    fontSize: "11",
    fontFamily: "var(--font-display)",
    fontWeight: "600",
    textAnchor: "middle"
  }, label), sub && /*#__PURE__*/React.createElement("text", {
    x: x,
    y: y + r + 26,
    fill: "var(--text-3)",
    fontSize: "9",
    fontFamily: "var(--font-mono)",
    textAnchor: "middle",
    letterSpacing: "0.5"
  }, sub.toUpperCase()));
}
function Heatmap() {
  const lang = useLang();
  const weeks = 12,
    days = 7;
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
  return /*#__PURE__*/React.createElement("div", {
    className: "glass",
    style: {
      padding: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "// ACTIVITY"), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: "4px 0 0",
      fontFamily: "var(--font-display)",
      fontSize: 18
    }
  }, lang === "en" ? "Last 12 weeks" : "So'nggi 12 hafta")), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 11,
      color: "var(--text-2)"
    }
  }, data.flat().filter(v => v > 0).length, " ", lang === "en" ? "active days" : "faol kun")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      display: "flex",
      gap: 4
    }
  }, data.map((col, w) => /*#__PURE__*/React.createElement("div", {
    key: w,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, col.map((v, d) => /*#__PURE__*/React.createElement("div", {
    key: d,
    style: {
      width: 14,
      height: 14,
      borderRadius: 3,
      background: v === 0 ? "rgba(255,255,255,0.04)" : v === 1 ? "rgba(0,255,156,0.15)" : v === 2 ? "rgba(0,255,156,0.35)" : v === 3 ? "rgba(0,255,156,0.6)" : "var(--accent)",
      border: "1px solid rgba(255,255,255,0.04)",
      boxShadow: v >= 3 ? "0 0 8px var(--accent-glow)" : "none"
    }
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: 10.5,
      color: "var(--text-2)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono"
  }, lang === "en" ? "12 weeks ago" : "12 hafta oldin"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", null, lang === "en" ? "less" : "kam"), [0, 1, 2, 3, 4].map(v => /*#__PURE__*/React.createElement("div", {
    key: v,
    style: {
      width: 10,
      height: 10,
      borderRadius: 2,
      background: v === 0 ? "rgba(255,255,255,0.04)" : v === 1 ? "rgba(0,255,156,0.15)" : v === 2 ? "rgba(0,255,156,0.35)" : v === 3 ? "rgba(0,255,156,0.6)" : "var(--accent)"
    }
  })), /*#__PURE__*/React.createElement("span", null, lang === "en" ? "more" : "ko'p"))));
}
function Achievements() {
  const lang = useLang();
  const items = [{
    icon: "flame",
    uz: "10 kun seriya",
    en: "10-day streak",
    color: "var(--c-attack)",
    earned: true
  }, {
    icon: "cpu",
    uz: "Architecture aniq",
    en: "Architect",
    color: "var(--c-system)",
    earned: true
  }, {
    icon: "terminal",
    uz: "PowerShell ninja",
    en: "PowerShell ninja",
    color: "var(--accent)",
    earned: true
  }, {
    icon: "target",
    uz: "100% test",
    en: "Perfect quiz",
    color: "var(--c-warn)",
    earned: true
  }, {
    icon: "skull",
    uz: "Birinchi qon",
    en: "First blood",
    color: "var(--c-attack)",
    earned: false
  }, {
    icon: "trophy",
    uz: "Bo'limni tugatdi",
    en: "Section complete",
    color: "var(--accent-2)",
    earned: false
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "glass",
    style: {
      padding: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "// BADGES"), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: "4px 0 0",
      fontFamily: "var(--font-display)",
      fontSize: 18
    }
  }, lang === "en" ? "Achievements" : "Yutuqlar")), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 11,
      color: "var(--text-2)"
    }
  }, "12 / 36")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(6, 1fr)",
      gap: 8
    }
  }, items.map((a, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    title: lang === "en" ? a.en : a.uz,
    style: {
      aspectRatio: "1",
      background: a.earned ? `${a.color}12` : "var(--bg-2)",
      border: `1px solid ${a.earned ? a.color + "55" : "var(--border)"}`,
      color: a.earned ? a.color : "var(--text-3)",
      borderRadius: 10,
      display: "grid",
      placeItems: "center",
      boxShadow: a.earned ? `0 0 12px ${a.color}33` : "none",
      opacity: a.earned ? 1 : 0.5,
      cursor: "pointer",
      transition: "all 250ms"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: a.earned ? a.icon : "lock",
    size: 18
  })))));
}
function UpcomingExam({
  setRoute
}) {
  const lang = useLang();
  return /*#__PURE__*/React.createElement("div", {
    className: "glass",
    style: {
      padding: 22,
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: -20,
      right: -20,
      width: 100,
      height: 100,
      background: "radial-gradient(circle, rgba(255,204,68,0.2), transparent 70%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      color: "var(--c-warn)"
    }
  }, "// FINAL_EXAM_PREVIEW"), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: "8px 0 6px",
      fontFamily: "var(--font-display)",
      fontSize: 18
    }
  }, lang === "en" ? "Section 01 final" : "01-bo'lim final imtihoni"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: "var(--text-2)",
      fontSize: 12.5
    }
  }, lang === "en" ? "20 questions · 2 hours · 85% to pass" : "20 ta savol · 2 soat · 85% o'tish"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement(Progress, {
    value: 1,
    max: 20,
    label: lang === "en" ? "Lessons complete" : "Darslar yakunlangan",
    color: "var(--c-warn)"
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: () => setRoute({
      name: "exam"
    }),
    style: {
      marginTop: 16,
      width: "100%",
      justifyContent: "center",
      borderColor: "rgba(255,204,68,0.35)",
      color: "var(--c-warn)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "target",
    size: 14
  }), " ", lang === "en" ? "Preview the final" : "Imtihonni ko'rib chiqish"));
}
function SectionProgress({
  setRoute
}) {
  const lang = useLang();
  const sections = [{
    num: "01",
    uz: "Windows asoslari",
    en: "Windows Fundamentals",
    done: 1,
    total: 20,
    color: "var(--c-system)",
    state: "active"
  }, {
    num: "02",
    uz: "Administratsiya",
    en: "Administration",
    done: 0,
    total: 20,
    color: "var(--c-user)",
    state: "locked"
  }, {
    num: "03",
    uz: "Windows xavfsizligi",
    en: "Windows Security",
    done: 0,
    total: 20,
    color: "var(--accent)",
    state: "locked"
  }, {
    num: "04",
    uz: "Pentesting",
    en: "Pentesting",
    done: 0,
    total: 20,
    color: "var(--c-attack)",
    state: "locked"
  }, {
    num: "05",
    uz: "Forensics",
    en: "Forensics",
    done: 0,
    total: 20,
    color: "var(--c-auth)",
    state: "locked"
  }, {
    num: "06",
    uz: "Server Infra",
    en: "Server Infrastructure",
    done: 0,
    total: 20,
    color: "var(--c-warn)",
    state: "locked"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, sections.map((s, i) => {
    const pct = s.done / s.total * 100;
    const locked = s.state === "locked";
    return /*#__PURE__*/React.createElement("div", {
      key: s.num,
      onClick: () => !locked && setRoute({
        name: "section",
        section: i + 1
      }),
      style: {
        display: "grid",
        gridTemplateColumns: "60px 1fr 80px 1fr 90px",
        gap: 16,
        alignItems: "center",
        padding: "12px 14px",
        borderRadius: 10,
        background: "var(--bg-2)",
        border: "1px solid var(--border)",
        cursor: locked ? "not-allowed" : "pointer",
        opacity: locked ? 0.5 : 1,
        transition: "all 200ms"
      },
      onMouseEnter: e => !locked && (e.currentTarget.style.borderColor = s.color),
      onMouseLeave: e => !locked && (e.currentTarget.style.borderColor = "var(--border)")
    }, /*#__PURE__*/React.createElement("div", {
      className: "mono",
      style: {
        color: s.color,
        fontSize: 12,
        letterSpacing: 0.1
      }
    }, "SEC ", s.num), /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 500,
        fontSize: 14
      }
    }, lang === "en" ? s.en : s.uz), /*#__PURE__*/React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 11.5,
        color: "var(--text-2)"
      }
    }, s.done, "/", s.total), /*#__PURE__*/React.createElement(Progress, {
      value: pct,
      color: s.color,
      height: 4,
      showVal: false
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "right"
      }
    }, locked ? /*#__PURE__*/React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 10,
        color: "var(--text-3)"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lock",
      size: 11
    }), " LOCKED") : pct === 100 ? /*#__PURE__*/React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 10,
        color: s.color
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 11
    }), " DONE") : /*#__PURE__*/React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 10,
        color: s.color
      }
    }, "ACTIVE")));
  }));
}
window.DashboardScreen = DashboardScreen;

// ─── screens/section.jsx ───
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
    lessons: [{
      n: "01",
      uz: "Windows arxitekturasi",
      en: "Windows architecture",
      duration: 36,
      status: "in-progress",
      icon: "cpu",
      color: "var(--c-system)",
      labs: 3,
      diagrams: 9
    }, {
      n: "02",
      uz: "Kernel nima?",
      en: "What is the kernel?",
      duration: 28,
      status: "locked",
      icon: "layers",
      color: "var(--c-system)",
      labs: 2,
      diagrams: 6
    }, {
      n: "03",
      uz: "User mode vs Kernel mode",
      en: "User mode vs Kernel mode",
      duration: 32,
      status: "locked",
      icon: "shield",
      color: "var(--c-warn)",
      labs: 2,
      diagrams: 7
    }, {
      n: "04",
      uz: "Windows boot jarayoni",
      en: "Windows boot process",
      duration: 36,
      status: "locked",
      icon: "play",
      color: "var(--c-auth)",
      labs: 2,
      diagrams: 8
    }, {
      n: "05",
      uz: "BIOS vs UEFI",
      en: "BIOS vs UEFI",
      duration: 22,
      status: "locked",
      icon: "cpu",
      color: "var(--c-hw)",
      labs: 1,
      diagrams: 5
    }, {
      n: "06",
      uz: "Secure Boot",
      en: "Secure Boot",
      duration: 24,
      status: "locked",
      icon: "shield-check",
      color: "var(--accent)",
      labs: 1,
      diagrams: 5
    }, {
      n: "07",
      uz: "TPM (Trusted Platform Module)",
      en: "TPM",
      duration: 26,
      status: "locked",
      icon: "lock",
      color: "var(--c-auth)",
      labs: 1,
      diagrams: 5
    }, {
      n: "08",
      uz: "Registry",
      en: "Windows Registry",
      duration: 38,
      status: "locked",
      icon: "database",
      color: "var(--c-system)",
      labs: 3,
      diagrams: 8
    }, {
      n: "09",
      uz: "Fayl tizimlari",
      en: "File systems",
      duration: 28,
      status: "locked",
      icon: "database",
      color: "var(--c-system)",
      labs: 2,
      diagrams: 6
    }, {
      n: "10",
      uz: "NTFS",
      en: "NTFS",
      duration: 32,
      status: "locked",
      icon: "database",
      color: "var(--c-system)",
      labs: 2,
      diagrams: 7
    }, {
      n: "11",
      uz: "FAT32",
      en: "FAT32",
      duration: 18,
      status: "locked",
      icon: "database",
      color: "var(--text-2)",
      labs: 1,
      diagrams: 4
    }, {
      n: "12",
      uz: "Jarayonlar (processes)",
      en: "Processes",
      duration: 34,
      status: "locked",
      icon: "cpu",
      color: "var(--c-user)",
      labs: 3,
      diagrams: 7
    }, {
      n: "13",
      uz: "Thread'lar",
      en: "Threads",
      duration: 28,
      status: "locked",
      icon: "spark",
      color: "var(--c-user)",
      labs: 2,
      diagrams: 6
    }, {
      n: "14",
      uz: "Handle'lar",
      en: "Handles",
      duration: 24,
      status: "locked",
      icon: "key",
      color: "var(--c-user)",
      labs: 1,
      diagrams: 5
    }, {
      n: "15",
      uz: "Servislar",
      en: "Services",
      duration: 30,
      status: "locked",
      icon: "settings",
      color: "var(--c-user)",
      labs: 2,
      diagrams: 6
    }, {
      n: "16",
      uz: "DLL (Dynamic Link Library)",
      en: "DLL",
      duration: 32,
      status: "locked",
      icon: "code",
      color: "var(--c-user)",
      labs: 2,
      diagrams: 6
    }, {
      n: "17",
      uz: "Windows API",
      en: "Windows API",
      duration: 30,
      status: "locked",
      icon: "code",
      color: "var(--c-user)",
      labs: 2,
      diagrams: 5
    }, {
      n: "18",
      uz: "Event Viewer",
      en: "Event Viewer",
      duration: 24,
      status: "locked",
      icon: "eye",
      color: "var(--accent)",
      labs: 2,
      diagrams: 4
    }, {
      n: "19",
      uz: "Task Scheduler",
      en: "Task Scheduler",
      duration: 22,
      status: "locked",
      icon: "clock",
      color: "var(--accent)",
      labs: 1,
      diagrams: 4
    }, {
      n: "20",
      uz: "Windows log fayllari",
      en: "Windows logs",
      duration: 28,
      status: "locked",
      icon: "graph",
      color: "var(--accent)",
      labs: 2,
      diagrams: 5
    }]
  }
};
function SectionScreen({
  setRoute,
  user,
  onOpenProfile,
  section = 1
}) {
  const lang = useLang();
  const data = SECTION_DATA[section] || SECTION_DATA[1];
  const completed = user?.completedLessons || [];
  const lessons = data.lessons.map((l, i) => {
    const key = `s${String(section).padStart(2, "0")}_l${String(i + 1).padStart(2, "0")}`;
    const isDone = completed.includes(key);
    // first unlocked lesson after all completed ones is "in-progress"
    const prevKey = i === 0 ? null : `s${String(section).padStart(2, "0")}_l${String(i).padStart(2, "0")}`;
    const prevDone = i === 0 || completed.includes(prevKey);
    const status = isDone ? "done" : prevDone ? "in-progress" : "locked";
    return {
      ...l,
      status
    };
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(TopNav, {
    route: {
      name: "section"
    },
    setRoute: setRoute,
    user: user,
    onOpenProfile: onOpenProfile,
    crumb: [{
      label: lang === "en" ? "Courses" : "Kurslar",
      onClick: () => setRoute({
        name: "dashboard"
      })
    }, {
      label: `${lang === "en" ? "Section" : "Bo'lim"} ${data.num}: ${lang === "en" ? data.en : data.uz}`
    }]
  }), /*#__PURE__*/React.createElement("div", {
    className: "page"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      borderRadius: 24,
      overflow: "hidden",
      padding: "44px 44px 40px",
      background: `linear-gradient(135deg, ${data.color}10, var(--bg-2) 60%)`,
      border: `1px solid ${data.color}33`,
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: `radial-gradient(ellipse at top right, ${data.color}1a, transparent 60%)`,
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "grid",
      gridTemplateColumns: "1.4fr 1fr",
      gap: 36,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      color: data.color,
      marginBottom: 16
    }
  }, lang === "en" ? `// SECTION ${data.num} · FOUNDATIONAL LEVEL` : `// ${data.num}-BO'LIM · ASOSIY DARAJA`), /*#__PURE__*/React.createElement("h1", {
    className: "display",
    style: {
      fontSize: 44,
      margin: "0 0 8px",
      letterSpacing: "-0.02em"
    }
  }, lang === "en" ? data.en : data.uz), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-1)",
      fontSize: 14,
      lineHeight: 1.65,
      maxWidth: 640,
      margin: "16px 0 0"
    }
  }, lang === "en" ? data.descEn : data.descUz), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => setRoute({
      name: "lesson",
      section,
      lesson: 1
    })
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "play",
    size: 14
  }), " ", lang === "en" ? "Resume · L01" : "Davom etish · L01"), /*#__PURE__*/React.createElement("button", {
    className: "btn"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "book",
    size: 14
  }), " ", lang === "en" ? "Syllabus PDF" : "Dastur PDF"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(MiniStat, {
    labelUz: "Darslar",
    labelEn: "Lessons",
    value: "20",
    sub: lang === "en" ? "1/20 in progress" : "1/20 davom etmoqda",
    color: data.color,
    icon: "book"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    labelUz: "Laboratoriya",
    labelEn: "Hands-on labs",
    value: "36",
    sub: lang === "en" ? "0 done" : "0 yakunlangan",
    color: "var(--c-user)",
    icon: "terminal"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    labelUz: "Diagrammalar",
    labelEn: "Diagrams",
    value: "118",
    sub: "interactive",
    color: "var(--c-system)",
    icon: "graph"
  }), /*#__PURE__*/React.createElement(MiniStat, {
    labelUz: "Final imtihon",
    labelEn: "Final exam",
    value: "20Q",
    sub: lang === "en" ? "2hr · 85% pass" : "2 soat · 85% o'tish",
    color: "var(--c-warn)",
    icon: "target"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginTop: 28,
      paddingTop: 20,
      borderTop: `1px solid ${data.color}22`
    }
  }, /*#__PURE__*/React.createElement(Progress, {
    value: completed.filter(k => k.startsWith(`s${String(section).padStart(2, "0")}_`)).length,
    max: data.lessons.length,
    label: lang === "en" ? "Section progress" : "Bo'lim taraqqiyoti",
    color: data.color
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 280px",
      gap: 24,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "// LESSON_INDEX"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-display)",
      margin: "4px 0 0",
      fontSize: 24
    }
  }, lang === "en" ? "Lesson contents" : "Darslar tarkibi"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column"
    }
  }, lessons.map((l, i) => /*#__PURE__*/React.createElement(LessonRow, {
    key: l.n,
    l: l,
    idx: i,
    sectionNum: section,
    setRoute: setRoute
  })))), /*#__PURE__*/React.createElement("aside", {
    style: {
      position: "sticky",
      top: 90,
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass",
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 12
    }
  }, "// INSTRUCTOR"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 52,
      height: 52,
      borderRadius: "50%",
      background: "linear-gradient(135deg, #00ff88 0%, #0af 50%, #a855f7 100%)",
      padding: 2,
      boxShadow: "0 0 16px rgba(0,255,136,0.35), 0 0 4px rgba(0,255,136,0.2)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      background: "#04060d",
      display: "grid",
      placeItems: "center",
      fontFamily: "var(--font-mono)",
      fontWeight: 800,
      fontSize: 13,
      letterSpacing: "0.05em",
      background: "radial-gradient(circle at 35% 35%, #0d1a12, #04060d)",
      color: "transparent",
      backgroundClip: "text",
      WebkitBackgroundClip: "text"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      background: "linear-gradient(135deg, #00ff88, #0af)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontSize: 11,
      fontWeight: 900,
      letterSpacing: "0.06em"
    }
  }, "DAGZO"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      bottom: 1,
      right: 1,
      width: 11,
      height: 11,
      borderRadius: "50%",
      background: "#00ff88",
      border: "2px solid #04060d",
      boxShadow: "0 0 6px #00ff88"
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13.5,
      letterSpacing: "0.01em"
    }
  }, "Dagzo"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--c-system)",
      fontWeight: 600,
      marginBottom: 2
    }
  }, "Senior Red Team Operator"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      color: "var(--text-3)",
      lineHeight: 1.4
    }
  }, data.instructorEn)))), /*#__PURE__*/React.createElement("div", {
    className: "glass",
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 12
    }
  }, "// YOU_WILL_LEARN"), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      padding: 0,
      margin: 0,
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, (lang === "en" ? OUTCOMES_EN : OUTCOMES_UZ).map((t, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: "flex",
      gap: 8,
      fontSize: 12.5,
      lineHeight: 1.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: data.color,
      flexShrink: 0,
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 12
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-0)"
    }
  }, t))))), /*#__PURE__*/React.createElement("div", {
    className: "glass",
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 10
    }
  }, "// TOOLING"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 6
    }
  }, ["PowerShell", "Process Explorer", "WinDbg", "Sysinternals", "ProcMon", "Autoruns", "Regedit", "Event Viewer"].map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    className: "chip chip-gray",
    style: {
      fontSize: 9.5
    }
  }, t))))))));
}
const OUTCOMES_UZ = ["Windows arxitekturasini qatlamma-qatlam chizib bera olish", "Kernel mode va user mode farqini chuqur tushunish", "Boot ketma-ketligini har bir bosqichi bilan ko'rsatish", "Processlar, thread'lar va handle'larni real holatda tahlil qilish", "Registry hive'lari va muhim kalitlarini topish", "PowerShell orqali tizimni jonli kuzatish"];
const OUTCOMES_EN = ["Draw the Windows architecture layer by layer", "Deeply understand kernel vs user mode", "Walk through every step of the boot sequence", "Analyze processes, threads and handles in real-time", "Locate every registry hive and persistence key", "Observe the system live with PowerShell"];
function MiniStat({
  labelUz,
  labelEn,
  value,
  sub,
  color,
  icon
}) {
  const lang = useLang();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 10,
      padding: "12px 14px",
      display: "flex",
      alignItems: "center",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 8,
      background: color + "12",
      border: `1px solid ${color}33`,
      color,
      display: "grid",
      placeItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 14
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-2)",
      letterSpacing: 0.1,
      textTransform: "uppercase",
      fontFamily: "var(--font-mono)"
    }
  }, lang === "en" ? labelEn : labelUz), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 20,
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      color
    }
  }, value), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10.5,
      color: "var(--text-3)"
    }
  }, sub))));
}
function LessonRow({
  l,
  idx,
  sectionNum,
  setRoute
}) {
  const lang = useLang();
  const isLocked = l.status === "locked";
  const isDone = l.status === "done";
  const isActive = l.status === "in-progress";
  return /*#__PURE__*/React.createElement("div", {
    onClick: () => !isLocked && setRoute({
      name: "lesson",
      section: sectionNum,
      lesson: idx + 1
    }),
    style: {
      display: "grid",
      gridTemplateColumns: "auto 40px 1fr auto auto auto",
      gap: 16,
      alignItems: "center",
      padding: "16px 18px",
      borderRadius: 10,
      background: isActive ? `${l.color}08` : "transparent",
      border: `1px solid ${isActive ? l.color + "33" : "transparent"}`,
      borderLeft: `2px solid ${isActive ? l.color : "transparent"}`,
      cursor: isLocked ? "not-allowed" : "pointer",
      opacity: isLocked ? 0.55 : 1,
      transition: "all 200ms",
      marginBottom: 4
    },
    onMouseEnter: e => {
      if (isLocked) return;
      e.currentTarget.style.background = isActive ? `${l.color}10` : "var(--surface)";
      e.currentTarget.style.borderColor = l.color + "33";
    },
    onMouseLeave: e => {
      if (isLocked) return;
      e.currentTarget.style.background = isActive ? `${l.color}08` : "transparent";
      e.currentTarget.style.borderColor = isActive ? l.color + "33" : "transparent";
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 12,
      color: "var(--text-3)",
      letterSpacing: 0.08,
      minWidth: 32
    }
  }, "L", l.n), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 8,
      background: isLocked ? "var(--bg-2)" : isDone ? l.color : `${l.color}12`,
      border: `1px solid ${isLocked ? "var(--border)" : l.color + "44"}`,
      color: isLocked ? "var(--text-3)" : isDone ? "#04060d" : l.color,
      display: "grid",
      placeItems: "center",
      boxShadow: isActive ? `0 0 16px ${l.color}55` : "none"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: isLocked ? "lock" : isDone ? "check" : l.icon,
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: 15,
      lineHeight: 1.3
    }
  }, lang === "en" ? l.en : l.uz), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      color: "var(--text-2)",
      display: "flex",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 11
  }), " \xA0", l.duration, "m"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Icon, {
    name: "terminal",
    size: 11
  }), " \xA0", l.labs), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Icon, {
    name: "graph",
    size: 11
  }), " \xA0", l.diagrams)), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 100,
      fontSize: 10.5,
      fontFamily: "var(--font-mono)",
      color: l.color,
      letterSpacing: 0.08,
      textTransform: "uppercase",
      textAlign: "right"
    }
  }, isLocked ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
    name: "lock",
    size: 11
  }), " \xA0LOCKED") : isDone ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 11
  }), " \xA0DONE") : isActive ? "ACTIVE" : "AVAILABLE"), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 16,
    style: {
      color: "var(--text-3)"
    }
  }));
}
window.SectionScreen = SectionScreen;

// ─── screens/lesson.jsx ───
// lesson.jsx — Lesson L01: Windows arxitekturasi / Windows Architecture
// Sections: Big picture → Theory → Layered diagram → Boot → Syscall flow → Security view → Lab → Compare → Summary

const {
  useState: useLS,
  useEffect: useLE,
  useRef: useLR
} = React;
const LESSON = {
  num: "L01",
  section: "01",
  uz: "Windows arxitekturasi",
  en: "Windows Architecture",
  subUz: "Operatsion tizim ichida nima sodir bo'lmoqda",
  subEn: "What's actually happening inside the operating system"
};
const LESSONS = {
  1: {
    num: "L01",
    section: "01",
    uz: "Windows arxitekturasi",
    en: "Windows Architecture",
    subUz: "Katta rasm, nazariy asos, qatlamli arxitektura",
    subEn: "Big picture, theory, layered architecture"
  },
  2: {
    num: "L02",
    section: "01",
    uz: "Kernel nima?",
    en: "What is the Kernel?",
    subUz: "ntoskrnl.exe, Executive, Microkernel, HAL va drayverlar",
    subEn: "ntoskrnl.exe, Executive, Microkernel, HAL and drivers"
  },
  3: {
    num: "L03",
    section: "01",
    uz: "User mode va Kernel mode",
    en: "User Mode vs Kernel Mode",
    subUz: "CPU privilege halqalari va chegara nima uchun muhim",
    subEn: "CPU privilege rings and why the boundary matters"
  },
  4: {
    num: "L04",
    section: "01",
    uz: "Windows boot jarayoni",
    en: "Windows Boot Process",
    subUz: "UEFI'dan login ekraniga: har bir bosqich va xavfsizlik",
    subEn: "UEFI to login: every step and its security implications"
  },
  5: {
    num: "L05",
    section: "01",
    uz: "BIOS vs UEFI",
    en: "BIOS vs UEFI",
    subUz: "Tez kunda",
    subEn: "Coming soon"
  },
  6: {
    num: "L06",
    section: "01",
    uz: "Secure Boot",
    en: "Secure Boot",
    subUz: "Tez kunda",
    subEn: "Coming soon"
  },
  7: {
    num: "L07",
    section: "01",
    uz: "TPM",
    en: "TPM",
    subUz: "Tez kunda",
    subEn: "Coming soon"
  },
  8: {
    num: "L08",
    section: "01",
    uz: "Registry",
    en: "Windows Registry",
    subUz: "Tez kunda",
    subEn: "Coming soon"
  },
  9: {
    num: "L09",
    section: "01",
    uz: "Fayl tizimlari",
    en: "File Systems",
    subUz: "Tez kunda",
    subEn: "Coming soon"
  },
  10: {
    num: "L10",
    section: "01",
    uz: "NTFS",
    en: "NTFS",
    subUz: "Tez kunda",
    subEn: "Coming soon"
  },
  11: {
    num: "L11",
    section: "01",
    uz: "FAT32",
    en: "FAT32",
    subUz: "Tez kunda",
    subEn: "Coming soon"
  },
  12: {
    num: "L12",
    section: "01",
    uz: "Jarayonlar (Processes)",
    en: "Processes",
    subUz: "Tez kunda",
    subEn: "Coming soon"
  },
  13: {
    num: "L13",
    section: "01",
    uz: "Thread'lar",
    en: "Threads",
    subUz: "Tez kunda",
    subEn: "Coming soon"
  },
  14: {
    num: "L14",
    section: "01",
    uz: "Handle'lar",
    en: "Handles",
    subUz: "Tez kunda",
    subEn: "Coming soon"
  },
  15: {
    num: "L15",
    section: "01",
    uz: "Servislar",
    en: "Services",
    subUz: "Tez kunda",
    subEn: "Coming soon"
  },
  16: {
    num: "L16",
    section: "01",
    uz: "DLL",
    en: "DLL",
    subUz: "Tez kunda",
    subEn: "Coming soon"
  },
  17: {
    num: "L17",
    section: "01",
    uz: "Windows API",
    en: "Windows API",
    subUz: "Tez kunda",
    subEn: "Coming soon"
  },
  18: {
    num: "L18",
    section: "01",
    uz: "Event Viewer",
    en: "Event Viewer",
    subUz: "Tez kunda",
    subEn: "Coming soon"
  },
  19: {
    num: "L19",
    section: "01",
    uz: "Task Scheduler",
    en: "Task Scheduler",
    subUz: "Tez kunda",
    subEn: "Coming soon"
  },
  20: {
    num: "L20",
    section: "01",
    uz: "Windows log fayllari",
    en: "Windows Logs",
    subUz: "Tez kunda",
    subEn: "Coming soon"
  }
};

// ─────────────────────────────────────────────────────────────
function LessonScreen({
  setRoute,
  user,
  markLessonComplete,
  onOpenProfile,
  lessonNum = 1
}) {
  const lang = useLang();
  const [progress, setProgress] = useLS(0);
  const [quizOpen, setQuizOpen] = useLS(false);
  const LESSON = LESSONS[lessonNum] || {
    num: `L${String(lessonNum).padStart(2, "0")}`,
    section: "01",
    uz: "Dars",
    en: "Lesson",
    subUz: "Tez kunda",
    subEn: "Coming soon"
  };
  const lessonKey = `s01_l${String(lessonNum).padStart(2, "0")}`;
  const hasContent = lessonNum <= 4;
  useLE(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = Math.min(100, Math.max(0, window.scrollY / max * 100));
      setProgress(Math.round(p));
    };
    window.addEventListener("scroll", onScroll, {
      passive: true
    });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(TopNav, {
    route: {
      name: "lesson"
    },
    setRoute: setRoute,
    user: user,
    onOpenProfile: onOpenProfile,
    crumb: [{
      label: lang === "en" ? "Courses" : "Kurslar",
      onClick: () => setRoute({
        name: "dashboard"
      })
    }, {
      label: lang === "en" ? "Sec 01" : "01-bo'lim",
      onClick: () => setRoute({
        name: "section",
        section: 1
      })
    }, {
      label: `${LESSON.num}: ${lang === "en" ? LESSON.en : LESSON.uz}`
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "sticky",
      top: 60,
      height: 3,
      background: "rgba(255,255,255,0.04)",
      zIndex: 50
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: `${progress}%`,
      background: "linear-gradient(90deg, var(--accent), var(--accent-2))",
      boxShadow: "0 0 8px var(--accent-glow)",
      transition: "width 200ms"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 860,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "page",
    style: {
      padding: "32px 28px 80px"
    }
  }, /*#__PURE__*/React.createElement(LessonHero, {
    lesson: LESSON,
    lessonNum: lessonNum
  }), lessonNum === 1 ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Section1Bigpicture, null), /*#__PURE__*/React.createElement(Section2Theory, null), /*#__PURE__*/React.createElement(Section3Layered, null)) : lessonNum === 2 ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SectionKernelWhat, null), /*#__PURE__*/React.createElement(SectionKernelInside, null), /*#__PURE__*/React.createElement(SectionKernelDrivers, null)) : lessonNum === 3 ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SectionRings, null), /*#__PURE__*/React.createElement(Section8Comparison, null), /*#__PURE__*/React.createElement(SectionSyscallBrief, null)) : lessonNum === 4 ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Section4Boot, null)) : /*#__PURE__*/React.createElement(ComingSoon, {
    lesson: LESSON,
    lessonNum: lessonNum,
    setRoute: setRoute
  }), hasContent && /*#__PURE__*/React.createElement(LessonNextNav, {
    lessonNum: lessonNum,
    setRoute: setRoute,
    onQuizStart: () => setQuizOpen(true)
  }))), quizOpen && /*#__PURE__*/React.createElement(QuizModal, {
    lessonNum: lessonNum,
    onClose: () => setQuizOpen(false),
    onPass: () => {
      setQuizOpen(false);
      if (markLessonComplete) markLessonComplete(lessonKey);
      setRoute({
        name: "section",
        section: 1
      });
    },
    onFail: () => {
      setQuizOpen(false);
      setRoute({
        name: "cooldown"
      });
    }
  }));
}

// ─────────────────────────────────────────────────────────────
function LessonTOC({
  lessonNum = 1
}) {
  const lang = useLang();
  const sections = lessonNum === 1 ? [{
    id: "big-picture",
    uz: "Katta rasm",
    en: "Big picture"
  }, {
    id: "theory",
    uz: "Nazariy asos",
    en: "Theory"
  }, {
    id: "layered",
    uz: "Qatlamli arxitektura",
    en: "Layered architecture"
  }] : [{
    id: "boot",
    uz: "Boot jarayoni",
    en: "Boot process"
  }, {
    id: "syscall",
    uz: "Syscall oqimi",
    en: "Syscall flow"
  }, {
    id: "security",
    uz: "Xavfsizlik nuqtai nazaridan",
    en: "Security view"
  }, {
    id: "lab",
    uz: "Laboratoriya",
    en: "Lab"
  }, {
    id: "compare",
    uz: "Taqqoslash",
    en: "Comparison"
  }, {
    id: "summary",
    uz: "Xulosa",
    en: "Summary"
  }];
  const [active, setActive] = useLS("big-picture");
  useLE(() => {
    const onScroll = () => {
      let cur = sections[0].id;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top < 200) cur = s.id;
      }
      setActive(cur);
    };
    window.addEventListener("scroll", onScroll, {
      passive: true
    });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      position: "sticky",
      top: 80,
      alignSelf: "start",
      padding: "32px 18px 32px 28px",
      height: "calc(100vh - 80px)",
      overflowY: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 12
    }
  }, "// ", lang === "en" ? "CONTENTS" : "MUNDARIJA"), /*#__PURE__*/React.createElement("ol", {
    style: {
      listStyle: "none",
      padding: 0,
      margin: 0,
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, sections.map((s, i) => /*#__PURE__*/React.createElement("li", {
    key: s.id
  }, /*#__PURE__*/React.createElement("a", {
    href: `#${s.id}`,
    onClick: e => {
      e.preventDefault();
      document.getElementById(s.id)?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    },
    style: {
      display: "flex",
      gap: 10,
      padding: "8px 10px",
      borderRadius: 7,
      fontSize: 12.5,
      textDecoration: "none",
      color: active === s.id ? "var(--accent)" : "var(--text-2)",
      background: active === s.id ? "var(--accent-soft)" : "transparent",
      borderLeft: `2px solid ${active === s.id ? "var(--accent)" : "transparent"}`,
      transition: "all 200ms"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      opacity: 0.5,
      fontSize: 10,
      width: 18
    }
  }, String(i + 1).padStart(2, "0")), /*#__PURE__*/React.createElement("span", null, lang === "en" ? s.en : s.uz))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      padding: 14,
      borderRadius: 10,
      background: "var(--surface)",
      border: "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      fontSize: 9.5,
      marginBottom: 8
    }
  }, "// ", lang === "en" ? "LESSON STATS" : "STATISTIKA"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-2)",
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(Row, {
    k: lang === "en" ? "Reading" : "O'qish",
    v: "~24 min"
  }), /*#__PURE__*/React.createElement(Row, {
    k: lang === "en" ? "Lab" : "Laboratoriya",
    v: "~12 min"
  }), /*#__PURE__*/React.createElement(Row, {
    k: lang === "en" ? "Diagrams" : "Diagrammalar",
    v: "9"
  }), /*#__PURE__*/React.createElement(Row, {
    k: lang === "en" ? "Words" : "So'zlar",
    v: "3,420"
  }))));
}
function Row({
  k,
  v
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", null, k), /*#__PURE__*/React.createElement("span", {
    className: "mono"
  }, v));
}
const LESSON_META = {
  1: {
    min: 36,
    diagrams: 9,
    labs: 3,
    introUz: /*#__PURE__*/React.createElement(React.Fragment, null, "Windows tizimining to'liq arxitekturasi \u2014 hardware'dan boshlab, ", /*#__PURE__*/React.createElement("em", null, "user mode va kernel mode"), ", executive qatlam, microkernel, HAL, va bir sichqoncha bosishi shu qatlamlarning har biridan qanday o'tishini ko'ramiz."),
    introEn: /*#__PURE__*/React.createElement(React.Fragment, null, "The complete Windows architecture from the silicon up \u2014 ", /*#__PURE__*/React.createElement("em", null, "user mode vs kernel mode"), ", the executive layer, microkernel, HAL, and how a single mouse click cascades through every one of them.")
  },
  2: {
    min: 28,
    diagrams: 6,
    labs: 1,
    introUz: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("em", null, "Kernel"), " \u2014 operatsion tizimning yuragi. Bu darsda ", /*#__PURE__*/React.createElement("em", null, "ntoskrnl.exe"), " ichida nima borligini, Executive va Microkernel farqini, HAL nima ekanini va drayverlar nima uchun xavfli ekanini o'rganasiz."),
    introEn: /*#__PURE__*/React.createElement(React.Fragment, null, "The ", /*#__PURE__*/React.createElement("em", null, "kernel"), " is the heart of the OS. You'll learn what lives inside ", /*#__PURE__*/React.createElement("em", null, "ntoskrnl.exe"), ", the difference between the Executive and Microkernel, what the HAL does, and why drivers are a serious security risk.")
  },
  3: {
    min: 32,
    diagrams: 5,
    labs: 1,
    introUz: /*#__PURE__*/React.createElement(React.Fragment, null, "CPU ", /*#__PURE__*/React.createElement("em", null, "privilege halqalari"), " nima, ring 3 va ring 0 farqi, bu chegara nima uchun mavjud, har bir rejimda xato qilsangiz nima bo'ladi \u2014 va kernel mode'ga qanday qonuniy o'tish mumkin."),
    introEn: /*#__PURE__*/React.createElement(React.Fragment, null, "What CPU ", /*#__PURE__*/React.createElement("em", null, "privilege rings"), " are, the difference between ring 3 and ring 0, why this boundary exists, what happens when code crashes in each mode \u2014 and how to legally cross into kernel mode.")
  },
  4: {
    min: 36,
    diagrams: 8,
    labs: 2,
    introUz: /*#__PURE__*/React.createElement(React.Fragment, null, "UEFI'dan login ekraniga qadar Windows qanday ishga tushishini har bir bosqichda ko'rasiz: POST, Secure Boot, ", /*#__PURE__*/React.createElement("em", null, "bootmgr \u2192 winload \u2192 ntoskrnl \u2192 LSASS"), " \u2014 va har bir bosqich xavfsizlik uchun nimani anglatadi."),
    introEn: /*#__PURE__*/React.createElement(React.Fragment, null, "Walk through every step of the Windows boot \u2014 POST, Secure Boot, ", /*#__PURE__*/React.createElement("em", null, "bootmgr \u2192 winload \u2192 ntoskrnl \u2192 LSASS"), " \u2014 and understand what each stage means for security.")
  }
};

// ─────────────────────────────────────────────────────────────
function LessonHero({
  lesson,
  lessonNum = 1
}) {
  const lang = useLang();
  const meta = LESSON_META[lessonNum] || LESSON_META[1];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      marginBottom: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(LiveDot, null), /*#__PURE__*/React.createElement("span", null, lang === "en" ? `SECTION ${lesson.section} · LESSON ${lesson.num} · IN PROGRESS` : `${lesson.section}-BO'LIM · DARS ${lesson.num} · DAVOM ETMOQDA`)), /*#__PURE__*/React.createElement("h1", {
    className: "display",
    style: {
      fontSize: "clamp(36px, 4.4vw, 56px)",
      margin: 0,
      letterSpacing: "-0.025em",
      lineHeight: 1.05
    }
  }, lang === "en" ? lesson.en : lesson.uz), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--text-2)",
      fontSize: 17,
      marginTop: 8
    }
  }, lang === "en" ? lesson.subEn : lesson.subUz), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 18,
      marginTop: 24,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "chip"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 11
  }), " ", meta.min, " min"), /*#__PURE__*/React.createElement("span", {
    className: "chip chip-blue"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "graph",
    size: 11
  }), " ", lang === "en" ? `${meta.diagrams} diagrams` : `${meta.diagrams} diagramma`), /*#__PURE__*/React.createElement("span", {
    className: "chip chip-purple"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "terminal",
    size: 11
  }), " ", lang === "en" ? `${meta.labs} lab${meta.labs > 1 ? "s" : ""}` : `${meta.labs} lab`), /*#__PURE__*/React.createElement("span", {
    className: "chip chip-yellow"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "warning",
    size: 11
  }), " ", lang === "en" ? "foundational" : "asosiy")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      color: "var(--text-2)"
    }
  }, lang === "en" ? "Updated" : "Yangilandi", " 2026.05.10 \xB7 Dagzo")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      padding: 18,
      background: "rgba(0, 212, 255, 0.05)",
      border: "1px solid rgba(0, 212, 255, 0.25)",
      borderRadius: 10,
      display: "flex",
      gap: 14,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--c-system)",
      flexShrink: 0,
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "info",
    size: 16
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: "var(--c-system)"
    }
  }, lang === "en" ? "What you'll learn in this lesson" : "Bu darsda nima o'rganasiz"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--text-1)",
      marginTop: 4,
      lineHeight: 1.55
    }
  }, lang === "en" ? meta.introEn : meta.introUz))));
}

// ─────────────────────────────────────────────────────────────
function Section1Bigpicture() {
  const lang = useLang();
  return /*#__PURE__*/React.createElement("section", {
    id: "big-picture",
    style: {
      scrollMarginTop: 80,
      marginBottom: 56
    }
  }, /*#__PURE__*/React.createElement(H2, {
    num: "01",
    uz: "Operatsion tizim nima?",
    en: "What is an operating system?"
  }), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "An ", /*#__PURE__*/React.createElement(Term, null, "operating system"), " is the software layer that mediates every interaction between applications and hardware. Without it, every application would need its own disk driver, its own network stack, its own memory allocator \u2014 impossible at modern scale. The OS gives every program the illusion of exclusive, safe access to all machine resources, enforces who can read whose files, and prevents one crashed program from taking down the rest.") : /*#__PURE__*/React.createElement(React.Fragment, null, "\xAB", /*#__PURE__*/React.createElement(Term, null, "Operatsion tizim"), "\xBB \u2014 ilovalar va hardware o'rtasidagi har bir muloqotni boshqaradigan dasturiy qatlam. Usiz, har bir ilova o'z disk drayveri, o'z tarmoq steki, o'z xotira ajratuvchisiga ega bo'lishi kerak edi \u2014 zamonaviy ko'lamda bu imkonsiz. OS har bir dasturga barcha mashinaning resurslariga eksklyuziv, xavfsiz kirishning ill\xFCzyonini beradi, kim kimning fayllarini o'qiy olishini nazorat qiladi va bitta nosoz dasturning qolganlarini ishdan chiqarishiga yo'l qo'ymaydi.")), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "Windows is a ", /*#__PURE__*/React.createElement(Term, null, "hybrid kernel"), " OS \u2014 it combines a small microkernel responsible for the lowest-level CPU mechanics (scheduling, interrupts, synchronisation) with a richer ", /*#__PURE__*/React.createElement(Em, null, "Executive"), " layer that implements file systems, networking, security, and memory management inside kernel mode. This is different from Linux (monolithic kernel, where drivers compile into the kernel image) and macOS (Mach microkernel + BSD subsystem layered on top).") : /*#__PURE__*/React.createElement(React.Fragment, null, "Windows \u2014 bu ", /*#__PURE__*/React.createElement(Term, null, "gibrid yadro"), " operatsion tizimi: u eng past darajadagi CPU mexanikasi (rejalashtirish, uzilishlar, sinxronizatsiya) uchun mas'ul kichik microkernel'ni va fayl tizimlari, tarmoq, xavfsizlik hamda xotira boshqaruvini kernel mode'da amalga oshiradigan boy ", /*#__PURE__*/React.createElement(Em, null, "Executive"), " qatlamini birlashtiradi. Bu Linux'dan (monolitik yadro, drayverlar yadro tasviriga kompilyatsiya qilinadi) va macOS'dan (Mach microkernel + uning ustidagi BSD quyi tizimi) farq qiladi.")), /*#__PURE__*/React.createElement(Callout, {
    color: "var(--c-system)",
    icon: "info",
    titleUz: "Tarixiy eslatma \u2014 Dave Cutler va VMS",
    titleEn: "Historical note \u2014 Dave Cutler and VMS"
  }, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "Windows NT kernel was designed by ", /*#__PURE__*/React.createElement("strong", null, "Dave Cutler"), ", who had previously led the VAX/VMS project at DEC (Digital Equipment Corporation). He brought VMS's design philosophy to Windows NT: strictly separate user mode from kernel mode, give each process a private address space, and never trust user input in privileged code. Windows NT 3.1 shipped in August 1993 \u2014 it ran on as little as 8 MB of RAM. The architecture he designed has not fundamentally changed since then: Windows 11 still uses the same ring-based privilege model, the same Executive managers, and the same syscall dispatch table design from 1993.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Windows NT yadrosi ", /*#__PURE__*/React.createElement("strong", null, "Dave Cutler"), " tomonidan loyihalashtirilgan \u2014 u DEC (Digital Equipment Corporation) kompaniyasida VAX/VMS loyihasini boshqargan. U VMS'ning dizayn falsafasini Windows NT ga olib keldi: user mode'ni kernel mode'dan qat'iy ajratish, har bir jarayonga shaxsiy manzil maydoni berish va hech qachon imtiyozli kodda foydalanuvchi ma'lumotiga ishonmaslik. Windows NT 3.1 1993 yil avgustda chiqdi \u2014 u 8 MB RAM da ishladi. U loyihalagan arxitektura o'shandan beri asosan o'zgarmagan: Windows 11 hali ham 1993 yildan o'sha ring-asosidagi imtiyoz modelini, xuddi o'sha Executive menejerlarini va syscall dispatch jadval dizaynini ishlatadi.")), /*#__PURE__*/React.createElement("h3", {
    style: subhead
  }, lang === "en" ? "1.1 — The 4 fundamental jobs of any OS" : "1.1 — Har qanday OS'ning 4 ta asosiy vazifasi"), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "Every OS \u2014 Windows, Linux, macOS \u2014 performs the same four core jobs. Understanding these jobs explains ", /*#__PURE__*/React.createElement(Em, null, "why"), " certain OS behaviours exist: why Chrome can crash but not take down Windows? Why can Notepad not read another process's memory? Why does a buggy driver cause a BSOD? All four answers point back to these fundamentals.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Har qanday OS \u2014 Windows, Linux, macOS \u2014 bir xil to'rtta asosiy vazifani bajaradi. Bu vazifalarni tushunish ", /*#__PURE__*/React.createElement(Em, null, "nima uchun"), " ba'zi OS xatti-harakatlarining sababini tushuntiradi: nima uchun Chrome qulab tushib, Windows'ni o'chirmaydi? Nima uchun Notepad boshqa jarayonning xotirasini o'qiy olmaydi? Nima uchun nosoz drayver BSOD chiqaradi? Barcha to'rt javob shu asoslarga qaytadi.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14,
      marginTop: 16
    }
  }, [{
    icon: "users",
    n: "1",
    color: "var(--c-user)",
    uz: "Foydalanuvchini ajratish — Process Isolation",
    en: "User isolation — Process Isolation",
    bodyUz: /*#__PURE__*/React.createElement(React.Fragment, null, "Har bir jarayon (process) o'ziga xos, boshqalarga ko'rinmaydigan xotira maydoniga ega. Chrome xato qilsa, Notepad budan hech qachon xabardor bo'lmaydi. Texnik asos \u2014 ", /*#__PURE__*/React.createElement(Term, null, "virtual manzil maydoni (Virtual Address Space)"), ". 64-bit Windows'da har bir jarayon nazariy jihatdan 128 TB xotira maydoniga ega \u2014 lekin bu maydon faqat o'z jarayoni doirasida mavjud, fizik RAM protsessor tomonidan xaritalanadi.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), "Agar bir jarayon boshqasining xotirasini o'qishga harakat qilsa, protsessor darhol ", /*#__PURE__*/React.createElement("code", null, "#GP (General Protection Fault)"), " istisnosi ko'taradi va OS jarayonni ", /*#__PURE__*/React.createElement("code", null, "0xC0000005 ACCESS_VIOLATION"), " bilan o'chiradi. Bu nima uchun muhim? Chunki bank dasturi va oddiy o'yin bir xil kompyuterda ishlasa ham, o'yin bank dasturining xotirasidagi parollarni hech qachon o'qiy olmaydi."),
    bodyEn: /*#__PURE__*/React.createElement(React.Fragment, null, "Each process has its own private virtual address space, invisible to all others. When Chrome crashes, Notepad never knows. The technical foundation is the ", /*#__PURE__*/React.createElement(Term, null, "Virtual Address Space"), ". On 64-bit Windows, each process theoretically has 128 TB of address space \u2014 but this space only exists within its own context, mapped from physical RAM by the CPU.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), "If one process tries to read another's memory, the CPU immediately raises a ", /*#__PURE__*/React.createElement("code", null, "#GP (General Protection Fault)"), " exception and the OS kills the offending process with ", /*#__PURE__*/React.createElement("code", null, "0xC0000005 ACCESS_VIOLATION"), ". Why does this matter? Because a banking app and a game can run on the same machine, and the game can never read passwords from the bank app's memory.")
  }, {
    icon: "cpu",
    n: "2",
    color: "var(--c-system)",
    uz: "Apparatni abstrakt qilish — Hardware Abstraction",
    en: "Hardware abstraction",
    bodyUz: /*#__PURE__*/React.createElement(React.Fragment, null, "Dunyoda minglab xil disk, tarmoq kartasi va GPU mavjud. Agar har bir dastur har bir hardware modeli bilan alohida ishlashni o'rganishi kerak bo'lsa, dastur yozish imkonsiz bo'lardi. OS bu muammoni ", /*#__PURE__*/React.createElement(Term, null, "drayverlar"), " orqali hal qiladi: hardware ishlab chiqaruvchisi qurilmasi uchun drayver yozadi, drayver kernelga standart interfeys taqdim etadi, ilova faqat bitta standart API'ni chaqiradi \u2014 diskni kim ishlab chiqarishini bilmaydi.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(Em, null, "HAL (Hardware Abstraction Layer)"), " \u2014 yana bir abstraksiya qatlami, bu safar protsessor arxitekturasi uchun: bir xil ", /*#__PURE__*/React.createElement("code", null, "ntoskrnl.exe"), " fayli Intel, AMD va ARM chiplarida qayta kompilyatsiyasiz ishlaydi, chunki HAL har bir protsessor platformasining o'ziga xos xususiyatlarini yashiradi (taymer, uzilish kontrolleri, DMA)."),
    bodyEn: /*#__PURE__*/React.createElement(React.Fragment, null, "There are thousands of different disk, network and GPU models. If every program had to learn each hardware model individually, writing software would be impossible. The OS solves this with ", /*#__PURE__*/React.createElement(Term, null, "drivers"), ": the hardware manufacturer writes a driver for their device, the driver presents a standard interface to the kernel, and the application calls one standard API \u2014 it never knows whose disk it is reading.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(Em, null, "HAL (Hardware Abstraction Layer)"), " is another abstraction layer, this time for the CPU architecture itself: the same ", /*#__PURE__*/React.createElement("code", null, "ntoskrnl.exe"), " binary runs on Intel, AMD and ARM chips without recompilation, because HAL hides each platform's specific details (timer, interrupt controller, DMA).")
  }, {
    icon: "layers",
    n: "3",
    color: "var(--c-warn)",
    uz: "Resurslarni boshqarish — Resource Management",
    en: "Resource management",
    bodyUz: /*#__PURE__*/React.createElement(React.Fragment, null, "CPU'ning faqat bir nechta yadrosi bor, lekin yuzlab jarayonlar ishlashi kerak. RAM cheklangan, lekin minglab ilova xotira talab qiladi. Disk I/O sekin, lekin barcha dasturlar bir vaqtda yozish va o'qishni xohlaydi. OS resurslarni adolatli taqsimlaydi va hech bir jarayon monopoliya qila olmasligi uchun kafolat beradi.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), "Windows ", /*#__PURE__*/React.createElement(Term, null, "scheduler"), " (rejalashtiruvchi) \u2014 CPU vaqtini ", /*#__PURE__*/React.createElement(Em, null, "15.6 ms"), " lik kvantlarga bo'lib, prioritet (0\u201331) bo'yicha jarayonlar o'rtasida taqsimlaydi. Prioritet 31 \u2014 eng yuqori (real-time rejim, faqat maxsus tizim uchun). Prioritet 0 \u2014 eng past (faqat ", /*#__PURE__*/React.createElement("code", null, "Zero Page"), " thread uchun saqlab qo'yilgan). Oddiy foydalanuvchi ilovasi odatda 8-prioritetda ishlaydi. RAM etishmasa, ", /*#__PURE__*/React.createElement(Term, null, "Memory Manager"), " eski sahifalarni diskdagi ", /*#__PURE__*/React.createElement("code", null, "pagefile.sys"), " ga ko'chiradi va xotirani bo'shatadi."),
    bodyEn: /*#__PURE__*/React.createElement(React.Fragment, null, "The CPU has only a few cores, but hundreds of processes need to run. RAM is finite, but thousands of apps demand memory. Disk I/O is slow, but all programs want to write and read simultaneously. The OS distributes resources fairly and guarantees no single process can monopolise them.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), "The Windows ", /*#__PURE__*/React.createElement(Term, null, "scheduler"), " divides CPU time into ", /*#__PURE__*/React.createElement(Em, null, "15.6 ms"), " quanta, distributed among processes by priority (0\u201331). Priority 31 is the highest (real-time mode, reserved for special system use). Priority 0 is the lowest (reserved only for the ", /*#__PURE__*/React.createElement("code", null, "Zero Page"), " thread). A normal user application typically runs at priority 8. If RAM runs low, the ", /*#__PURE__*/React.createElement(Term, null, "Memory Manager"), " moves old pages to ", /*#__PURE__*/React.createElement("code", null, "pagefile.sys"), " on disk and frees the memory.")
  }, {
    icon: "shield",
    n: "4",
    color: "var(--c-attack)",
    uz: "Xavfsizlikni ta'minlash — Security Enforcement",
    en: "Enforce security",
    bodyUz: /*#__PURE__*/React.createElement(React.Fragment, null, "Kim qaysi faylni, jarayonni yoki registr kalitini ochishi mumkin? Bu qarorni OS ", /*#__PURE__*/React.createElement(Term, null, "Security Reference Monitor (SRM)"), " orqali qabul qiladi. Har safar fayl, jarayon yoki registr kaliti ochilganda, SRM ikkita narsani solishtiradi: arizachining ", /*#__PURE__*/React.createElement(Em, null, "Access Token"), "'ini (kimligini tasdiqlash \u2014 foydalanuvchi SID, guruh SID'lar, imtiyozlar ro'yxati) va ob'ektning ", /*#__PURE__*/React.createElement(Em, null, "ACL (Access Control List)"), "'ini (kim nimani qila olishini belgilovchi yozuvlar ro'yxati). Agar token'dagi SID ACL'dagi yozuvga mos kelmasa \u2014 ", /*#__PURE__*/React.createElement("code", null, "ERROR_ACCESS_DENIED (0x5)"), ".", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), "Bu nazariy emas \u2014 shuning uchun Administrator cmd.exe boshqacha ruxsatga ega, oddiy foydalanuvchi ", /*#__PURE__*/React.createElement("code", null, "C:\\Windows\\System32"), " ga fayl yoza olmaydi va UAC (User Account Control) siz dasturga administrator ruxsatini bermasligi uchun dialog ko'rsatadi."),
    bodyEn: /*#__PURE__*/React.createElement(React.Fragment, null, "Who can open which file, process, or registry key? That decision belongs to the OS \u2014 via the ", /*#__PURE__*/React.createElement(Term, null, "Security Reference Monitor (SRM)"), ". Every time a file, process, or registry key is opened, the SRM compares two things: the caller's ", /*#__PURE__*/React.createElement(Em, null, "Access Token"), " (who they are \u2014 user SID, group SIDs, privilege list) against the object's ", /*#__PURE__*/React.createElement(Em, null, "ACL (Access Control List)"), " (a list of entries defining who may do what). If the token's SID does not match a matching ACE in the ACL \u2014 ", /*#__PURE__*/React.createElement("code", null, "ERROR_ACCESS_DENIED (0x5)"), ".", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), "This is not theoretical \u2014 it's why Administrator's cmd.exe has different permissions, why a normal user cannot write to ", /*#__PURE__*/React.createElement("code", null, "C:\\Windows\\System32"), ", and why UAC shows a dialog before granting admin privileges to a program.")
  }].map((b, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: "18px 20px",
      borderRadius: 12,
      background: `${b.color}08`,
      border: `1px solid ${b.color}30`,
      borderLeft: `3px solid ${b.color}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 9,
      background: `${b.color}18`,
      border: `1px solid ${b.color}44`,
      color: b.color,
      display: "grid",
      placeItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: b.icon,
    size: 18
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 9.5,
      color: b.color,
      letterSpacing: 0.1
    }
  }, lang === "en" ? "JOB" : "VAZIFA", " #", b.n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 16,
      fontWeight: 700
    }
  }, lang === "en" ? b.en : b.uz))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      lineHeight: 1.75,
      color: "var(--text-1)"
    }
  }, lang === "en" ? b.bodyEn : b.bodyUz)))), /*#__PURE__*/React.createElement("h3", {
    style: subhead
  }, lang === "en" ? "1.2 — Windows in numbers" : "1.2 — Raqamlarda Windows"), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "Before going deeper, here are concrete measurements of the Windows codebase. These numbers make the scope of what you're learning tangible \u2014 and explain why Windows has both extraordinary capability and extraordinary attack surface.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Chuqurroq kirishdan oldin, Windows kod bazasining aniq o'lchovlari. Bu raqamlar o'rganayotgan narsangizning miqyosini ko'zga ko'rinadigan qilib qo'yadi \u2014 va nima uchun Windows g'ayrioddiy imkoniyat va g'ayrioddiy hujum yuzasiga ham ega ekanini tushuntiradi.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 10,
      marginTop: 12
    }
  }, [{
    val: "~50M",
    uz: "kod satrlari (ntoskrnl + drayverlar + subsistemalar)",
    en: "lines of code (ntoskrnl + drivers + subsystems)"
  }, {
    val: "~10 MB",
    uz: "ntoskrnl.exe hajmi (x64, Windows 11)",
    en: "ntoskrnl.exe file size (x64, Windows 11)"
  }, {
    val: "~460",
    uz: "syscall raqamlari (SSDT jadvalida)",
    en: "syscall numbers in the SSDT table"
  }, {
    val: "128 TB",
    uz: "har bir jarayonning virtual manzil maydoni (x64)",
    en: "virtual address space per process (x64)"
  }, {
    val: "0–31",
    uz: "thread prioritet darajalari (31 — real-time)",
    en: "thread priority levels (31 = real-time)"
  }, {
    val: "1993",
    uz: "Windows NT 3.1 — bu arxitektura boshlanishi",
    en: "Windows NT 3.1 — when this architecture began"
  }].map((f, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: "14px 16px",
      borderRadius: 10,
      background: "var(--bg-2)",
      border: "1px solid var(--border)",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 22,
      fontWeight: 700,
      color: "var(--accent)"
    }
  }, f.val), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "var(--text-2)",
      marginTop: 4,
      lineHeight: 1.4
    }
  }, lang === "en" ? f.en : f.uz)))));
}

// ─────────────────────────────────────────────────────────────
function Section2Theory() {
  const lang = useLang();
  return /*#__PURE__*/React.createElement("section", {
    id: "theory",
    style: {
      scrollMarginTop: 80,
      marginBottom: 56
    }
  }, /*#__PURE__*/React.createElement(H2, {
    num: "02",
    uz: "Asosiy tushunchalar",
    en: "Core concepts"
  }), /*#__PURE__*/React.createElement("h3", {
    style: subhead
  }, lang === "en" ? "2.1 — Process and Thread" : "2.1 — Jarayon va Thread"), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "A ", /*#__PURE__*/React.createElement(Term, null, "process"), " is a running instance of a program \u2014 not the file on disk, but its live execution in memory. Each process gets: its own private virtual address space (no other process can see into it), a ", /*#__PURE__*/React.createElement(Em, null, "security token"), " (which identifies who is running it and what privileges it has), a ", /*#__PURE__*/React.createElement(Em, null, "handle table"), " (list of OS objects it has opened \u2014 files, pipes, events), and one or more threads. Two instances of Notepad are two separate processes \u2014 they share the same code on disk, but each has its own independent memory.") : /*#__PURE__*/React.createElement(React.Fragment, null, "\xAB", /*#__PURE__*/React.createElement(Term, null, "Jarayon"), "\xBB (process) \u2014 dasturning xotiradagi jonli nusxasi, diskdagi fayl emas. Har bir jarayon quyidagilarga ega: o'z shaxsiy virtual manzil maydoni (boshqa hech bir jarayon unga kira olmaydi), ", /*#__PURE__*/React.createElement(Em, null, "xavfsizlik tokeni"), " (uni kim ishlatayotgani va qanday imtiyozlarga ega ekanini aniqlaydigan), ", /*#__PURE__*/React.createElement(Em, null, "handle jadvali"), " (u ochgan OS ob'ektlari ro'yxati \u2014 fayllar, pipe'lar, eventlar) va bir yoki bir nechta thread'lar. Notepad'ning ikkita nusxasi \u2014 ikkita alohida jarayon: ular diskdagi bir xil kodni baham ko'radi, lekin har birining o'z mustaqil xotirasi bor.")), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "A ", /*#__PURE__*/React.createElement(Term, null, "thread"), " is the actual unit of CPU execution \u2014 the thing the processor runs. Threads share the parent process's address space, meaning all threads in one process can read and write the same memory (this is both efficient and dangerous \u2014 it creates race conditions). The CPU can only execute one thread per core at a time. With 4 cores and 400 threads running, the ", /*#__PURE__*/React.createElement(Em, null, "scheduler"), " rapidly context-switches between them. A ", /*#__PURE__*/React.createElement(Em, null, "context switch"), " saves the current thread's CPU registers (RIP, RSP, RAX\u2013R15, RFLAGS) to its kernel stack, restores the next thread's registers, and resumes execution \u2014 all in microseconds.") : /*#__PURE__*/React.createElement(React.Fragment, null, "\xAB", /*#__PURE__*/React.createElement(Term, null, "Thread"), "\xBB \u2014 protsessor bajaradigan haqiqiy birlik. Thread'lar ota jarayonning manzil maydonini baham ko'radi, ya'ni bir jarayondagi barcha thread'lar bir xil xotirani o'qiy va yoza oladi (bu ham samarali, ham xavfli \u2014 race condition'larni keltirib chiqaradi). CPU bir vaqtda har bir yadroda faqat bitta thread'ni bajara oladi. 4 yadro va 400 ta thread ishlayotgan bo'lsa, ", /*#__PURE__*/React.createElement(Em, null, "scheduler"), " ular o'rtasida tezda kontekst almashishni amalga oshiradi. ", /*#__PURE__*/React.createElement(Em, null, "Kontekst almashish"), " joriy thread'ning CPU registrlarini (RIP, RSP, RAX\u2013R15, RFLAGS) uning kernel stack'iga saqlaydi, keyingi thread'ning registrlarini tiklaydi va bajarishni davom ettiradi \u2014 bularning barchasi mikrosoniyalarda.")), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "Internally the kernel tracks every process via a structure called ", /*#__PURE__*/React.createElement(Term, null, "EPROCESS"), " (Executive Process block) stored in non-paged kernel memory. ", /*#__PURE__*/React.createElement("code", null, "EPROCESS"), " contains the PID, parent PID, creation time, security token pointer, list of threads (as ", /*#__PURE__*/React.createElement("code", null, "ETHREAD"), " structures), handle table pointer, and the Virtual Address Descriptor (VAD) tree that maps the entire virtual address space. Forensics tools like Process Hacker read these structures directly \u2014 which is why they can show processes even if malware has hidden them from Task Manager's normal API calls.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Ichkarida kernel har bir jarayonni sahifasiz kernel xotirasida saqlangan ", /*#__PURE__*/React.createElement(Term, null, "EPROCESS"), " (Executive Process bloki) tuzilmasi orqali kuzatib boradi. ", /*#__PURE__*/React.createElement("code", null, "EPROCESS"), " quyidagilarni o'z ichiga oladi: PID, ota PID, yaratilish vaqti, xavfsizlik tokeni ko'rsatgichi, thread'lar ro'yxati (", /*#__PURE__*/React.createElement("code", null, "ETHREAD"), " tuzilmalari sifatida), handle jadval ko'rsatgichi va butun virtual manzil maydonini xaritalovchi Virtual Address Descriptor (VAD) daraxti. Process Hacker kabi sud-tibbiyot tizimlari bu tuzilmalarni to'g'ridan-to'g'ri o'qiydi \u2014 shuning uchun malware Task Manager'ning oddiy API chaqiruvlaridan o'zini yashirsa ham, ular jarayonlarni ko'rsata oladi.")), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "20px 0",
      padding: "16px 20px",
      borderRadius: 10,
      background: "var(--bg-2)",
      border: "1px solid var(--border)",
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      lineHeight: 1.85
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 8
    }
  }, "// EPROCESS \u2014 simplified kernel structure (one per running process)"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--c-system)"
    }
  }, "struct ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--accent)"
    }
  }, "_EPROCESS"), " ", "{"), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingLeft: 24,
      color: "var(--text-1)"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--c-warn)"
    }
  }, "ULONG"), "       ", "UniqueProcessId;", "            ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-3)"
    }
  }, "// PID e.g. 1234")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--c-warn)"
    }
  }, "ULONG"), "       ", "InheritedFromUniqueProcessId; ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-3)"
    }
  }, "// Parent PID")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--c-warn)"
    }
  }, "EX_FAST_REF"), " ", "Token;", "                    ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-3)"
    }
  }, "// Security token (SID, privileges)")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--c-warn)"
    }
  }, "LIST_ENTRY"), "  ", "ThreadListHead;", "            ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-3)"
    }
  }, "// Linked list of all ETHREADs")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--c-warn)"
    }
  }, "PVOID"), "       ", "ObjectTable;", "               ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-3)"
    }
  }, "// Handle table pointer")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--c-warn)"
    }
  }, "PVOID"), "       ", "VadRoot;", "                   ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-3)"
    }
  }, "// VAD tree (virtual memory map)")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--c-warn)"
    }
  }, "LARGE_INTEGER"), " ", "CreateTime;", "              ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-3)"
    }
  }, "// When was it spawned?")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--c-warn)"
    }
  }, "UCHAR"), "[15]    ", "ImageFileName;", "            ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-3)"
    }
  }, "// First 15 chars of exe name"))), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--c-system)"
    }
  }, "}")), /*#__PURE__*/React.createElement("h3", {
    style: subhead
  }, lang === "en" ? "2.2 — User mode vs Kernel mode" : "2.2 — User mode va Kernel mode"), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "The x86-64 CPU architecture defines ", /*#__PURE__*/React.createElement(Em, null, "four privilege rings"), ": ring 0 (most privileged) through ring 3 (least privileged). Windows uses only two: ", /*#__PURE__*/React.createElement(Em, null, "ring 0"), " (kernel mode) for the OS, and ", /*#__PURE__*/React.createElement(Em, null, "ring 3"), " (user mode) for every application. Rings 1 and 2 were designed for OS subsystems and device drivers in older systems (like OS/2); Windows NT deliberately skips them \u2014 all drivers run at full ring 0 privilege.") : /*#__PURE__*/React.createElement(React.Fragment, null, "x86-64 CPU arxitekturasi ", /*#__PURE__*/React.createElement(Em, null, "to'rtta imtiyoz halqasini"), " belgilaydi: ring 0 (eng imtiyozli) dan ring 3 (eng kam imtiyozli) gacha. Windows faqat ikkitasini ishlatadi: ", /*#__PURE__*/React.createElement(Em, null, "ring 0"), " (kernel mode) \u2014 OS uchun, va ", /*#__PURE__*/React.createElement(Em, null, "ring 3"), " (user mode) \u2014 har bir ilova uchun. Ring 1 va ring 2 eski tizimlarda (OS/2 kabi) OS quyi tizimlari va drayverlar uchun mo'ljallangan; Windows NT ularni ataylab o'tkazib yuboradi \u2014 barcha drayverlar to'liq ring 0 imtiyozi bilan ishlaydi.")), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "The CPU knows which ring it is in through two bits (bits 0\u20131) of the ", /*#__PURE__*/React.createElement("code", null, "CS"), " (Code Segment) register \u2014 called the ", /*#__PURE__*/React.createElement(Em, null, "CPL (Current Privilege Level)"), ". When ", /*#__PURE__*/React.createElement("code", null, "CS = 0x0008"), ", bits 0\u20131 are both 0 \u2192 CPL = 0 (kernel). When ", /*#__PURE__*/React.createElement("code", null, "CS = 0x0033"), ", bits 0\u20131 are both 1 \u2192 CPL = 3 (user). The hardware checks CPL on ", /*#__PURE__*/React.createElement(Em, null, "every single instruction"), ". If ring 3 code tries to run a privileged instruction (like ", /*#__PURE__*/React.createElement("code", null, "HLT"), " to stop the CPU or ", /*#__PURE__*/React.createElement("code", null, "MOV CR0"), " to change paging), the CPU immediately raises a ", /*#__PURE__*/React.createElement(Em, null, "#GP (General Protection Fault)"), " \u2014 exception number 13 \u2014 and Windows terminates the program with ", /*#__PURE__*/React.createElement("code", null, "0xC0000005 ACCESS_VIOLATION"), ". The crash never reaches any other process.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Protsessor ", /*#__PURE__*/React.createElement("code", null, "CS"), " (Code Segment) registrining ikki biti (0\u20131 bitlar) orqali qaysi ringda ekanini biladi \u2014 bu ", /*#__PURE__*/React.createElement(Em, null, "CPL (Current Privilege Level)"), " deb ataladi. ", /*#__PURE__*/React.createElement("code", null, "CS = 0x0008"), " bo'lsa, 0\u20131 bitlar har ikkalasi 0 \u2192 CPL = 0 (kernel). ", /*#__PURE__*/React.createElement("code", null, "CS = 0x0033"), " bo'lsa, 0\u20131 bitlar har ikkalasi 1 \u2192 CPL = 3 (user). Hardware CPL ni ", /*#__PURE__*/React.createElement(Em, null, "har bir buyruq"), " uchun tekshiradi. Agar ring 3 kod imtiyozli buyruqni (", /*#__PURE__*/React.createElement("code", null, "HLT"), " \u2014 protsessorni to'xtatish yoki ", /*#__PURE__*/React.createElement("code", null, "MOV CR0"), " \u2014 sahifalashni o'zgartirish kabi) bajarishga harakat qilsa, protsessor darhol ", /*#__PURE__*/React.createElement(Em, null, "#GP (General Protection Fault)"), " \u2014 13-raqamli istisno \u2014 ko'taradi va Windows dasturni ", /*#__PURE__*/React.createElement("code", null, "0xC0000005 ACCESS_VIOLATION"), " bilan o'chiradi. Crash boshqa hech bir jarayonga yetmaydi.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12,
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 16px",
      borderRadius: 10,
      background: "rgba(255,145,69,0.06)",
      border: "1px solid rgba(255,145,69,0.28)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 14,
      fontWeight: 700,
      color: "var(--c-user)",
      marginBottom: 10
    }
  }, lang === "en" ? "Ring 3 (user mode) — CAN do:" : "Ring 3 (user mode) — QILA OLADI:"), (lang === "en" ? ["Normal arithmetic, logic, string operations", "Read/write its own process memory (within its VAD)", "Call Win32 API (kernel32.dll, user32.dll, gdi32.dll)", "Allocate virtual memory via VirtualAlloc()", "Create threads, open files, sockets via handles", "Cross into ring 0 only via the syscall instruction"] : ["Oddiy arifmetik, mantiqiy, satr operatsiyalari", "O'z jarayon xotirasini o'qish/yozish (VAD ichida)", "Win32 API chaqirish (kernel32.dll, user32.dll, gdi32.dll)", "VirtualAlloc() orqali virtual xotira ajratish", "Thread yaratish, handle orqali fayl va socket ochish", "Ring 0 ga faqat syscall buyrug'i orqali o'tish"]).map((item, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 5,
      fontSize: 12.5,
      color: "var(--text-1)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--c-user)",
      flexShrink: 0
    }
  }, "\u2713"), item))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 16px",
      borderRadius: 10,
      background: "rgba(255,58,94,0.06)",
      border: "1px solid rgba(255,58,94,0.28)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 14,
      fontWeight: 700,
      color: "var(--c-attack)",
      marginBottom: 10
    }
  }, lang === "en" ? "Ring 3 — CANNOT do (triggers #GP fault):" : "Ring 3 — QILA OLMAYDI (#GP xato):"), (lang === "en" ? ["HLT — halt the CPU", "LGDT / LIDT — load Global/Interrupt Descriptor Tables", "MOV CR0–CR4 — modify control registers (paging, protection)", "WRMSR / RDMSR — write/read model-specific registers", "IN / OUT — directly access hardware I/O ports", "CLI / STI — disable / re-enable hardware interrupts"] : ["HLT — protsessorni to'xtatish", "LGDT / LIDT — Global/Interrupt Descriptor Jadvallarini yuklash", "MOV CR0–CR4 — boshqaruv registrlarini o'zgartirish (sahifalash, himoya)", "WRMSR / RDMSR — model-specific registrlarni yozish/o'qish", "IN / OUT — hardware I/O portlarini to'g'ridan-to'g'ri o'qish/yozish", "CLI / STI — hardware uzilishlarini o'chirish / qayta yoqish"]).map((item, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 5,
      fontSize: 12.5,
      color: "var(--text-1)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--c-attack)",
      flexShrink: 0
    }
  }, "\u2717"), item)))), /*#__PURE__*/React.createElement(Callout, {
    color: "var(--c-attack)",
    icon: "skull",
    titleUz: "Kernel mode xatosi = BSOD",
    titleEn: "Kernel mode crash = BSOD"
  }, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "When user-mode (ring 3) code crashes \u2014 say, Notepad has a bug \u2014 Windows simply terminates that one process. The rest of the system keeps running untouched. But when kernel-mode (ring 0) code crashes \u2014 a driver dereferences a null pointer, a timer callback corrupts the stack \u2014 there is no higher authority to contain it. The entire machine halts: ", /*#__PURE__*/React.createElement(Em, null, "Bug Check (Blue Screen of Death)"), ". The system writes a memory dump to disk and reboots. This is why driver quality is the #1 stability factor in Windows \u2014 and why Microsoft requires all third-party drivers to be digitally signed.") : /*#__PURE__*/React.createElement(React.Fragment, null, "User mode (ring 3) kodi qulab tushganda \u2014 masalan, Notepad'da xato bo'lsa \u2014 Windows faqat o'sha jarayonni o'chiradi. Tizimning qolgan qismi ta'sirlanmasdan ishlashda davom etadi. Lekin kernel mode (ring 0) kodi qulab tushganda \u2014 drayver null ko'rsatgichni dereference qiladi, taymer callback stack'ni buzadi \u2014 uni ushlaydigan yuqori hokimiyat yo'q. Butun mashina to'xtaydi: ", /*#__PURE__*/React.createElement(Em, null, "Bug Check (Ko'k Ekran O'limi \u2014 BSOD)"), ". Tizim xotira dumpini diskka yozadi va qayta ishga tushadi. Shuning uchun drayver sifati Windows'dagi \u21161 barqarorlik omili \u2014 va Microsoft nima uchun barcha uchinchi tomon drayverlarni raqamli imzolashni talab qiladi.")), /*#__PURE__*/React.createElement("h3", {
    style: subhead
  }, lang === "en" ? "2.3 — The Executive and the Microkernel" : "2.3 — Executive va Microkernel"), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "Both the Executive and the Microkernel live inside a single file: ", /*#__PURE__*/React.createElement("code", null, "ntoskrnl.exe"), " (~10 MB on Windows 11 x64, exporting ~4,000 symbols). The ", /*#__PURE__*/React.createElement(Term, null, "Microkernel"), " is the small, ultra-stable core that handles the most fundamental CPU operations \u2014 it never makes policy decisions. The ", /*#__PURE__*/React.createElement(Term, null, "Executive"), " is the richer layer above it that implements all OS policy. Together they are called the ", /*#__PURE__*/React.createElement(Em, null, "Windows Executive"), " or simply ", /*#__PURE__*/React.createElement(Em, null, "the kernel"), " in everyday language.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Executive va Microkernel ikkisi ham bitta faylda yashaydi: ", /*#__PURE__*/React.createElement("code", null, "ntoskrnl.exe"), " (Windows 11 x64 da ~10 MB, ~4,000 ta simvol eksport qiladi). ", /*#__PURE__*/React.createElement(Term, null, "Microkernel"), " \u2014 eng asosiy CPU operatsiyalarini boshqaradigan kichik, o'ta barqaror yadro \u2014 u hech qachon siyosat qarorlari qabul qilmaydi. ", /*#__PURE__*/React.createElement(Term, null, "Executive"), " \u2014 barcha OS siyosatlarini amalga oshiradigan uning ustidagi boy qatlam. Birgalikda ular ", /*#__PURE__*/React.createElement(Em, null, "Windows Executive"), " yoki kundalik tilda oddiygina ", /*#__PURE__*/React.createElement(Em, null, "kernel"), " deb ataladi.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12,
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 16px",
      borderRadius: 10,
      background: "rgba(0,212,255,0.06)",
      border: "1px solid rgba(0,212,255,0.25)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 14,
      fontWeight: 700,
      color: "var(--c-system)",
      marginBottom: 10
    }
  }, lang === "en" ? "Microkernel handles:" : "Microkernel boshqaradi:"), (lang === "en" ? ["Thread scheduling — priority 0-31, 15.6 ms quantum", "IDT (Interrupt Descriptor Table) — 256-entry CPU exception routing", "Spinlocks & dispatcher locks — multi-CPU synchronisation", "Clock interrupts — HPET / APIC timer at 15.6 ms", "Trap / exception dispatch — routes #GP, #PF, NMI to handlers", "DPC (Deferred Procedure Call) — post-interrupt work queue"] : ["Thread rejalashtiruvi — prioritet 0-31, 15.6 ms kvant", "IDT (Interrupt Descriptor Table) — 256 yozuvli CPU istisno yo'naltirish", "Spinlock va dispatcher lock'lar — ko'p CPU sinxronizatsiyasi", "Soat uzilishlari — HPET / APIC taymer, 15.6 ms da", "Trap / exception dispatch — #GP, #PF, NMI ni handlerlarga yo'naltirish", "DPC (Deferred Procedure Call) — uzilishdan keyingi ish navbati"]).map((item, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 5,
      fontSize: 12.5,
      color: "var(--text-1)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--c-system)",
      flexShrink: 0
    }
  }, "\u25B8"), item))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 16px",
      borderRadius: 10,
      background: "rgba(180,100,255,0.06)",
      border: "1px solid rgba(180,100,255,0.25)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 14,
      fontWeight: 700,
      color: "#b48cff",
      marginBottom: 10
    }
  }, lang === "en" ? "Executive — 6 managers:" : "Executive — 6 ta menejer:"), (lang === "en" ? ["Process Manager — EPROCESS/ETHREAD, NtCreateProcess", "Memory Manager — virtual memory, page faults, pagefile.sys, ASLR", "I/O Manager — IRP lifecycle, driver stack dispatch", "Object Manager — reference counting, handle table", "Security Reference Monitor — token ↔ ACL check on every Nt* call", "Cache Manager — write-back file cache, mapped sections"] : ["Jarayon Menejeri — EPROCESS/ETHREAD, NtCreateProcess", "Xotira Menejeri — virtual xotira, sahifa xatolari, pagefile.sys, ASLR", "I/O Menejeri — IRP hayot tsikli, drayver stekini yuborish", "Ob'ekt Menejeri — reference counting, handle jadvali", "Xavfsizlik Reference Monitor — har bir Nt* chaqiruvda token ↔ ACL tekshiruvi", "Kesh Menejeri — write-back fayl keshi, xaritalangan bo'limlar"]).map((item, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 5,
      fontSize: 12.5,
      color: "var(--text-1)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#b48cff",
      flexShrink: 0
    }
  }, "\u25B8"), item)))), /*#__PURE__*/React.createElement(P, {
    style: {
      marginTop: 16
    }
  }, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "Below the microkernel sits the ", /*#__PURE__*/React.createElement(Term, null, "HAL (Hardware Abstraction Layer)"), " \u2014 implemented in ", /*#__PURE__*/React.createElement("code", null, "hal.dll"), ". HAL hides the differences between specific processor platforms so the same ", /*#__PURE__*/React.createElement("code", null, "ntoskrnl.exe"), " binary runs on Intel, AMD, and ARM without recompilation. HAL handles: interrupt controller routing (APIC on x64, GIC on ARM), high-resolution timer calibration (for the 15.6 ms scheduler tick), multi-processor boot (waking Application Processor cores), and DMA buffer management. Without HAL, Microsoft would need a separate kernel build for every CPU platform \u2014 instead, only HAL is rebuilt per platform, and ntoskrnl stays the same.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Microkernel'dan pastda ", /*#__PURE__*/React.createElement(Term, null, "HAL (Hardware Abstraction Layer)"), " \u2014 ", /*#__PURE__*/React.createElement("code", null, "hal.dll"), " da amalga oshiriladi. HAL ma'lum protsessor platformalar o'rtasidagi farqlarni yashiradi, shunda bir xil ", /*#__PURE__*/React.createElement("code", null, "ntoskrnl.exe"), " binary Intel, AMD va ARM'da qayta kompilyatsiyasiz ishlaydi. HAL quyidagilarni boshqaradi: uzilish kontrolleri yo'naltirish (x64 da APIC, ARM'da GIC), yuqori aniqlikdagi taymer kalibrlash (15.6 ms scheduler tikki uchun), ko'p protsessorli yuklash (Application Processor yadrolarini uyg'otish) va DMA bufer boshqaruvi. HALsiz, Microsoft har bir CPU platformasi uchun alohida kernel to'plami kerak bo'lardi \u2014 buning o'rniga faqat HAL har bir platform uchun qayta to'planadi, ntoskrnl esa bir xil qoladi.")), /*#__PURE__*/React.createElement("h3", {
    style: subhead
  }, lang === "en" ? "2.4 — Subsystems, Win32, and the call chain" : "2.4 — Subsistemalar, Win32 va chaqiruv zanjiri"), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "Applications never call the kernel directly. Every call passes through a strict chain of DLLs. At the top are the ", /*#__PURE__*/React.createElement(Term, null, "Win32 subsystem DLLs"), ", which expose the familiar Windows API (~10,000 functions). Below them is ", /*#__PURE__*/React.createElement("code", null, "ntdll.dll"), ", which provides the ", /*#__PURE__*/React.createElement(Em, null, "Native API"), " \u2014 a much smaller set of ~460 functions that map directly to kernel syscall numbers. ", /*#__PURE__*/React.createElement("code", null, "ntdll.dll"), " is the last stop in ring 3 before the ", /*#__PURE__*/React.createElement("code", null, "SYSCALL"), " instruction fires and the CPU switches to ring 0.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Ilovalar hech qachon kernelga to'g'ridan-to'g'ri murojaat qilmaydi. Har bir chaqiruv qat'iy DLL'lar zanjiridanf o'tadi. Eng yuqorida tanish Windows API'ni (~10,000 funksiya) taqdim etuvchi ", /*#__PURE__*/React.createElement(Term, null, "Win32 quyi tizim DLL"), "'lari joylashgan. Ularning ostida ", /*#__PURE__*/React.createElement("code", null, "ntdll.dll"), " bor, u ", /*#__PURE__*/React.createElement(Em, null, "Native API"), "'ni \u2014 kernel syscall raqamlariga to'g'ridan-to'g'ri mos keladigan ~460 funksiyaning ancha kichikroq to'plamini \u2014 taqdim etadi. ", /*#__PURE__*/React.createElement("code", null, "ntdll.dll"), " \u2014 ", /*#__PURE__*/React.createElement("code", null, "SYSCALL"), " buyrug'i o'qqa to'lib, protsessor ring 0 ga o'tgunga qadar ring 3 dagi oxirgi to'xtash joyi.")), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "18px 0",
      padding: "18px 20px",
      borderRadius: 12,
      background: "var(--bg-2)",
      border: "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 12
    }
  }, "// FULL CALL CHAIN \u2014 ReadFile(\"secret.txt\") step by step"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 5,
      fontFamily: "var(--font-mono)",
      fontSize: 12
    }
  }, [{
    ring: "Ring 3",
    label: "notepad.exe",
    call: 'ReadFile(hFile, buffer, 1024, &bytesRead, NULL)',
    color: "var(--c-user)",
    note: "Win32 API — developer-facing"
  }, {
    ring: "Ring 3",
    label: "kernel32.dll",
    call: 'translates → NtReadFile(handle, event, apcRoutine, ...)',
    color: "var(--c-user)",
    note: "Win32 subsystem DLL"
  }, {
    ring: "Ring 3",
    label: "ntdll.dll",
    call: 'mov eax, 0x0006   ; syscall number for NtReadFile\nsyscall            ; cross into ring 0',
    color: "var(--c-warn)",
    note: "Native API — last ring 3 stop"
  }, {
    ring: "Ring 0",
    label: "ntoskrnl.exe",
    call: 'I/O Manager: validate params, build IRP\nSRM: check handle vs ACL',
    color: "var(--c-system)",
    note: "Executive: security + dispatch"
  }, {
    ring: "Ring 0",
    label: "ntfs.sys → disk.sys",
    call: 'handle IRP_MJ_READ\nread sectors from disk via DMA',
    color: "var(--c-system)",
    note: "Driver stack"
  }].map((row, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "grid",
      gridTemplateColumns: "52px 1fr",
      padding: "8px 10px",
      borderRadius: 7,
      gap: 12,
      alignItems: "flex-start",
      background: i >= 3 ? "rgba(0,212,255,0.05)" : "rgba(255,145,69,0.04)",
      borderLeft: `2px solid ${row.color}`
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 9.5,
      color: row.color,
      paddingTop: 2
    }
  }, row.ring), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      color: "var(--text-2)",
      marginBottom: 2
    }
  }, row.label, " \u2014 ", /*#__PURE__*/React.createElement("em", {
    style: {
      color: "var(--text-3)"
    }
  }, row.note)), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--text-1)",
      whiteSpace: "pre-wrap"
    }
  }, row.call)))))), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "One more critical piece: ", /*#__PURE__*/React.createElement(Term, null, "WOW64 (Windows-on-Windows 64)"), ". When a 32-bit app (compiled for x86) runs on 64-bit Windows, WOW64 intercepts every syscall and re-translates the 32-bit calling convention into 64-bit before passing it to the actual kernel. The 32-bit app believes it is on a 32-bit OS; the kernel never sees a 32-bit call. This transparent translation layer is why 32-bit software still runs unchanged on Windows 11 x64. Importantly for security: EDRs must hook BOTH the 64-bit ntdll.dll and the 32-bit ntdll inside WOW64, otherwise a 32-bit process can bypass 64-bit hooks entirely.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Yana bir muhim qism: ", /*#__PURE__*/React.createElement(Term, null, "WOW64 (Windows-on-Windows 64)"), ". 64-bit Windows da 32-bit ilova (x86 uchun kompilyatsiya qilingan) ishlayotganida, WOW64 har bir syscall'ni ushlab oladi va 32-bit chaqiruv konvensiyasini haqiqiy kernelga topshirishdan oldin 64-bit ga qayta tarjima qiladi. 32-bit ilova 32-bit OS'da ishlayotgandek his qiladi; kernel 32-bit chaqiruvni hech qachon ko'rmaydi. Bu shaffof tarjima qatlami sababli 32-bit dasturiy ta'minot hali ham Windows 11 x64 da o'zgarishsiz ishlaydi. Xavfsizlik nuqtai nazaridan muhimi: EDR'lar HAM 64-bit ntdll.dll, ham WOW64 ichidagi 32-bit ntdll'ga hook qo'yishi kerak \u2014 aks holda 32-bit jarayon 64-bit hook'larini butunlay chetlab o'ta oladi.")));
}
const subhead = {
  fontFamily: "var(--font-display)",
  fontSize: 22,
  fontWeight: 600,
  margin: "28px 0 8px",
  letterSpacing: "-0.01em"
};

// ─────────────────────────────────────────────────────────────
function Section3Layered() {
  const lang = useLang();
  const layers = [{
    ring: "Ring 3",
    color: "var(--c-user)",
    uz: "Foydalanuvchi ilovalar",
    en: "User Applications",
    files: "notepad.exe · chrome.exe · powershell.exe · malware.exe ...",
    bodyUz: "Har qanday EXE fayl shu qatlamda ishlaydi. Faqat OS ruxsat bergan narsani qila oladi: o'z xotirasini o'qish/yozish, Win32 API chaqirish, syscall orqali kernelga so'rov yuborish. Hardware ko'rinmaydi. Boshqa jarayon xotirasiga tegib bo'lmaydi. Bu qatlam qulab tushsa — faqat o'sha jarayon o'ladi.",
    bodyEn: "Any EXE runs here. Can only do what the OS permits: read/write its own memory, call Win32 API, send requests to the kernel via syscall. Hardware is invisible. Cannot touch other process memory. If this layer crashes — only that one process dies."
  }, {
    ring: "Ring 3",
    color: "var(--c-user)",
    uz: "Win32 quyi tizim DLL'lari",
    en: "Win32 Subsystem DLLs",
    files: "kernel32.dll · user32.dll · gdi32.dll · advapi32.dll · ws2_32.dll",
    bodyUz: "Dasturchilar yozgan tanish funksiyalarni (CreateFile, DrawText, RegOpenKey, connect) kernelning Native API'ga tarjima qiladi. ~10,000 Win32 funksiya mavjud. Bu qatlam Windows dasturlashning boshlanish nuqtasi — deyarli barcha dasturlar shu DLL'lardan birortasiga bog'liq.",
    bodyEn: "Translates the familiar developer-facing functions (CreateFile, DrawText, RegOpenKey, connect) into the kernel's Native API. ~10,000 Win32 functions exist. This layer is the starting point for all Windows programming — nearly every program links to at least one of these DLLs."
  }, {
    ring: "Ring 3",
    color: "var(--c-warn)",
    uz: "Native API — oxirgi user-mode to'xtash joyi",
    en: "Native API — last user-mode stop",
    files: "ntdll.dll",
    bodyUz: "Win32 DLL'larning barchasi oxirida ntdll.dll funksiyalarini chaqiradi (NtCreateFile, NtReadFile, NtOpenProcess...). ntdll ichidagi har bir Nt* funksiya protsessorda syscall buyrug'ini bajaradi — bu ring 3 dan ring 0 ga o'tishning yagona qonuniy usuli. EDR va antivirus tizimlari hook'larini aynan shu joyga — ntdll ichiga — qo'yadi, chunki bu syscall'dan oldingi so'nggi nuqta.",
    bodyEn: "All Win32 DLLs ultimately call ntdll.dll (NtCreateFile, NtReadFile, NtOpenProcess...). Each Nt* function inside ntdll executes the syscall instruction on the CPU — the only legal way to cross from ring 3 to ring 0. EDR and antivirus systems place their hooks exactly here — inside ntdll — because this is the last point before the syscall."
  }, {
    ring: "Syscall",
    color: "#f5a623",
    uz: "Syscall chegarasi — ring 3 → ring 0",
    en: "Syscall gate — ring 3 → ring 0",
    files: "SYSCALL instruction (x64) · SYSENTER (x86 legacy)",
    bodyUz: "Bu yagona qonuniy o'tish nuqtasi. SYSCALL protsessorda atomik ravishda: (1) RIP ni LSTAR MSR'dagi kernel handler manziliga o'rnatadi, (2) CS'ni 0x0010 (ring 0) ga o'zgartiradi, (3) RSP'ni kernel stack'ga ko'chiradi, (4) RFLAGS'ni tozalaydi. Bu to'rtta qadam bittada — uziltirib bo'lmaydi. Syscall raqami EAX registrida uzatiladi (masalan, NtReadFile = 0x0006).",
    bodyEn: "This is the single legal crossing point. SYSCALL atomically: (1) sets RIP to the kernel handler address from LSTAR MSR, (2) changes CS to 0x0010 (ring 0), (3) moves RSP to the kernel stack, (4) clears RFLAGS. All four steps happen as one — cannot be interrupted. The syscall number is passed in EAX (e.g. NtReadFile = 0x0006)."
  }, {
    ring: "Ring 0",
    color: "var(--c-system)",
    uz: "Executive — 6 menejer",
    en: "Executive — 6 managers",
    files: "ntoskrnl.exe (Process · Memory · I/O · Object · SRM · Cache Managers)",
    bodyUz: "Barcha OS siyosatini amalga oshiradi. Har bir Nt* chaqiruvi parametrlarni tekshiradi, xavfsizlik tekshiruvini o'tkazadi, tegishli menejerga yo'naltiradi. Xotira ajratadi, jarayonlar yaratadi, fayllarni boshqaradi, har bir kirish so'rovida token ↔ ACL tekshiruvi o'tkazadi. Executive kernel'dagi barcha 'nima va nega' qarorlarini qabul qiladi.",
    bodyEn: "Implements all OS policy. Every Nt* call validates parameters, runs security checks, routes to the appropriate manager. Allocates memory, creates processes, manages files, runs token ↔ ACL checks on every access request. The Executive makes all the 'what and why' decisions in the kernel."
  }, {
    ring: "Ring 0",
    color: "var(--c-system)",
    uz: "Microkernel — CPU mexanikasi",
    en: "Microkernel — CPU mechanics",
    files: "ntoskrnl.exe (kernel core) — scheduler · IDT · spinlocks · DPC",
    bodyUz: "Thread'larni rejalashtirishni (prioritet 0-31, 15.6 ms kvant), uzilishlarni yo'naltirishni (IDT — 256 yozuv), CPU sinxronizatsiyasini (spinlock'lar) va DPC (Deferred Procedure Call) navbatlarini boshqaradi. Siyosat qarorlarini qabul qilmaydi — bu Executive ishi. Faqat mexanikani ta'minlaydi.",
    bodyEn: "Handles thread scheduling (priority 0-31, 15.6 ms quantum), interrupt routing (IDT — 256 entries), CPU synchronisation (spinlocks), and DPC (Deferred Procedure Call) queues. Makes no policy decisions — that is the Executive's job. Only provides the mechanics."
  }, {
    ring: "Ring 0",
    color: "#5dade2",
    uz: "HAL — Hardware Abstraction Layer",
    en: "HAL — Hardware Abstraction Layer",
    files: "hal.dll",
    bodyUz: "Protsessor platformasi farqlarini yashiradi. Bir xil ntoskrnl.exe Intel, AMD va ARM chiplarida ishlaydi, chunki HAL har bir platforma uchun uzilish yo'naltirish (APIC/GIC), yuqori aniqlikdagi taymer va DMA'ni boshqaradi. HALsiz — har bir CPU platformasi uchun alohida kernel kerak bo'lardi.",
    bodyEn: "Hides CPU platform differences. The same ntoskrnl.exe runs on Intel, AMD and ARM chips because HAL manages interrupt routing (APIC/GIC), high-precision timer, and DMA for each platform. Without HAL — a separate kernel would be needed for every CPU platform."
  }, {
    ring: "Hardware",
    color: "#8390a8",
    uz: "Fizik hardware",
    en: "Physical hardware",
    files: "CPU · RAM · NVMe SSD · NIC · GPU · TPM · USB controllers ...",
    bodyUz: "Haqiqiy silikon. OS bu qatlamga hech qachon to'g'ridan-to'g'ri murojaat qilmaydi — HAL orqali o'tadi. Ilovalar bu qatlamni umuman ko'rmaydi. Hardware'ga to'g'ridan-to'g'ri murojaat qilishga urinish #GP fault yoki hardware exception bilan tugaydi.",
    bodyEn: "The actual silicon. The OS never touches this layer directly — it goes through HAL. Applications never see this layer at all. Attempting to directly access hardware from user mode triggers a #GP fault or hardware exception."
  }];
  return /*#__PURE__*/React.createElement("section", {
    id: "layered",
    style: {
      scrollMarginTop: 80,
      marginBottom: 56
    }
  }, /*#__PURE__*/React.createElement(H2, {
    num: "03",
    uz: "Qatlamli arxitektura",
    en: "Layered architecture"
  }), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "Windows is built in strict layers \u2014 each layer can only communicate with the layers immediately above and below it, never skipping. This is not just good engineering; it is a ", /*#__PURE__*/React.createElement(Em, null, "security boundary"), ". No application can reach the hardware without passing through every gate above it. The interactive diagram below shows the full stack. Below that, a layer-by-layer breakdown explains every level in detail.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Windows qat'iy qatlamlarda qurilgan \u2014 har bir qatlam faqat undan darhol yuqori va pastdagi qatlamlar bilan muloqot qila oladi, hech qachon o'tkazib yubormaydi. Bu nafaqat yaxshi muhandislik; bu ", /*#__PURE__*/React.createElement(Em, null, "xavfsizlik chegarasi"), ". Hech bir ilova uning ustidagi har bir eshikdan o'tmasdan hardware'ga yeta olmaydi. Quyidagi interaktiv diagramma to'liq stekni ko'rsatadi. Undan keyin, qatlam-qatlamli tahlil har bir darajani batafsil tushuntiradi.")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(WindowsArchDiagram, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 12,
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement(Callout, {
    color: "var(--c-user)",
    icon: "user",
    titleUz: "Ring 3 (user)",
    titleEn: "Ring 3 (user)",
    small: true
  }, lang === "en" ? "Sandboxed. Can't touch hardware, can't read kernel memory." : "Sandbox'lashtirilgan. Hardware'ga tegmaydi, kernel xotirasini ko'rmaydi."), /*#__PURE__*/React.createElement(Callout, {
    color: "var(--c-warn)",
    icon: "warning",
    titleUz: "Syscall chegarasi",
    titleEn: "Syscall gate",
    small: true
  }, lang === "en" ? "The single legal door — every privileged action passes through here." : "Yagona qonuniy eshik — har bir imtiyozli amal shu yerdan o'tadi."), /*#__PURE__*/React.createElement(Callout, {
    color: "var(--c-system)",
    icon: "cpu",
    titleUz: "Ring 0 (kernel)",
    titleEn: "Ring 0 (kernel)",
    small: true
  }, lang === "en" ? "Full access. One bug here = blue screen for the whole machine." : "To'liq kirish. Bu yerdagi bitta xato = butun mashinaga ko'k ekran.")), /*#__PURE__*/React.createElement("h3", {
    style: subhead
  }, lang === "en" ? "3.1 — Layer-by-layer breakdown" : "3.1 — Qatlam-qatlam batafsil tahlil"), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "Each row below shows one layer of the Windows architecture stack: the privilege ring it runs in, which files implement it, and exactly what it does. Read top-to-bottom \u2014 this is the path every API call follows from your application down to the physical disk.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Quyidagi har bir qator Windows arxitektura stekining bir qatlamini ko'rsatadi: u ishlayotgan imtiyoz ringi, uni amalga oshiradigan fayllar va u nima qilishi. Yuqoridan pastga o'qing \u2014 bu har bir API chaqiruvi sizning ilovangizdan jismoniy diskgacha o'tadigan yo'l.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 5,
      marginTop: 14
    }
  }, layers.map((layer, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "grid",
      gridTemplateColumns: "64px 1fr",
      borderRadius: 10,
      overflow: "hidden",
      border: `1px solid ${layer.color}30`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: `${layer.color}18`,
      borderRight: `2px solid ${layer.color}50`,
      padding: "12px 8px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 9,
      color: layer.color,
      textAlign: "center",
      letterSpacing: 0.04,
      lineHeight: 1.4
    }
  }, layer.ring.split(" ").map((w, j) => /*#__PURE__*/React.createElement("div", {
    key: j
  }, w)))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 16px",
      background: `${layer.color}05`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 14,
      fontWeight: 700,
      color: layer.color,
      marginBottom: 2
    }
  }, lang === "en" ? layer.en : layer.uz), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10.5,
      color: "var(--text-2)",
      marginBottom: 7
    }
  }, layer.files), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: "var(--text-1)",
      lineHeight: 1.7
    }
  }, lang === "en" ? layer.bodyEn : layer.bodyUz))))), /*#__PURE__*/React.createElement(Callout, {
    color: "var(--c-attack)",
    icon: "skull",
    titleUz: "Hujumchi nuqtai nazaridan \u2014 nima uchun bu stack muhim",
    titleEn: "Attacker's perspective \u2014 why this stack matters"
  }, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "An attacker's goal is almost always to move ", /*#__PURE__*/React.createElement(Em, null, "down"), " this stack \u2014 from a sandboxed process (ring 3) toward the kernel (ring 0). Every layer is a potential attack surface: injecting a DLL gives code in user space, hooking ntdll bypasses EDR monitoring, exploiting a driver vulnerability achieves full ring 0 control over the entire machine. Understanding each layer's role is the foundation of both attack and defence \u2014 you cannot protect what you don't understand, and you cannot exploit what you haven't mapped.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Hujumchining maqsadi deyarli har doim shu stackda ", /*#__PURE__*/React.createElement(Em, null, "pastga"), " tushish \u2014 sandboxlangan jarayondan (ring 3) kernelga (ring 0) tomon. Har bir qatlam potensial hujum yuzasi: DLL kiritish user space'da kod beradi, ntdll'ga hook qo'yish EDR monitoringini chetlab o'tadi, drayver zaifligini ekspluatatsiya qilish butun mashinada to'liq ring 0 nazoratini ta'minlaydi. Har bir qatlamning rolini tushunish hujum va mudofaaning ham asosi \u2014 tushunmagan narsangizni himoya qila olmaysiz va xaritalamagan narsangizni ekspluatatsiya qila olmaysiz.")));
}

// ─────────────────────────────────────────────────────────────
// Boot step card component
function BootStep({
  n,
  icon,
  color,
  titleUz,
  titleEn,
  children
}) {
  const lang = useLang();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "auto 1fr",
      gap: 0,
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: 52
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: "50%",
      flexShrink: 0,
      background: `${color}18`,
      border: `2px solid ${color}`,
      color,
      display: "grid",
      placeItems: "center",
      fontSize: 18,
      fontWeight: 800,
      fontFamily: "var(--font-mono)",
      boxShadow: `0 0 14px ${color}44`
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 2,
      flex: 1,
      minHeight: 20,
      background: `${color}30`,
      marginTop: 4
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: `${color}08`,
      border: `1px solid ${color}22`,
      borderRadius: 12,
      padding: "16px 20px",
      marginLeft: 12,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 8,
      background: `${color}18`,
      border: `1px solid ${color}44`,
      color,
      display: "grid",
      placeItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 15,
      color
    }
  }, lang === "en" ? titleEn : titleUz)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      lineHeight: 1.75,
      color: "var(--text-1)"
    }
  }, children)));
}
function Section4Boot() {
  const lang = useLang();
  const chart = `
flowchart TD
    A([Power on]) --> B[UEFI / BIOS<br/>POST + firmware]
    B --> C[Bootloader<br/>bootmgr → winload.efi]
    C --> D{Secure Boot<br/>verifies signature?}
    D -->|OK| E[Kernel loads<br/>ntoskrnl.exe + HAL]
    D -->|FAIL| X([Boot blocked])
    E --> F[SMSS.exe<br/>session manager]
    F --> G[CSRSS<br/>Win32 subsystem]
    F --> H[WININIT<br/>+ services.exe]
    H --> I[LSASS<br/>security subsystem]
    H --> J[LOGONUI<br/>login screen]
    J --> K([User session])

    style A fill:#1a2342,stroke:#4d8bff,color:#fff
    style K fill:#0a3a1f,stroke:#00ff9c,color:#fff
    style X fill:#3a0a1a,stroke:#ff3a5e,color:#fff
    style D fill:#2a1f3a,stroke:#b88cff,color:#fff
  `;
  return /*#__PURE__*/React.createElement("section", {
    id: "boot",
    style: {
      scrollMarginTop: 80,
      marginBottom: 56
    }
  }, /*#__PURE__*/React.createElement(H2, {
    num: "04",
    uz: "Boot jarayoni",
    en: "The boot process"
  }), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "From the moment you press the power button to the login screen, Windows passes through a precisely choreographed sequence. Each stage hands off to the next and verifies it \u2014 so a single compromised step can be detected.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Quvvat tugmasini bosgan paytdan login ekranigacha, Windows aniq xoreografiyalashtirilgan ketma-ketlikdan o'tadi. Har bir bosqich keyingisiga estafetani uzatadi va uni tekshiradi \u2014 shuning uchun bitta buzilgan bosqichni aniqlash mumkin.")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement(MermaidDiagram, {
    chart: chart,
    caption: "1-rasm. Windows boot ketma-ketligi: POST \u2192 bootloader \u2192 kernel \u2192 user session.",
    captionEn: "Fig 1. Windows boot sequence: POST \u2192 bootloader \u2192 kernel \u2192 user session."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 36,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 20
    }
  }, lang === "en" ? "// STEP_BY_STEP — what happens at each stage" : "// BOSQICHMA_BOSQICH — har bir qadamda nima sodir bo'ladi"), /*#__PURE__*/React.createElement(BootStep, {
    n: "1",
    icon: "zap",
    color: "var(--c-auth)",
    titleUz: "Power On \u2014 Elektr tokini yoqish",
    titleEn: "Power On \u2014 Electricity on"
  }, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "When you press the power button, the ", /*#__PURE__*/React.createElement(Em, null, "Power Supply Unit (PSU)"), " sends a stable signal to the motherboard: \"Power is ready, you may start.\" Only after this signal does the CPU execute its very first instruction \u2014 always from the same fixed address in ROM.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Siz tugmani bosganingizda, ", /*#__PURE__*/React.createElement(Em, null, "tok manbai (PSU)"), " ona plataga signal yuboradi: \xABElektr barqaror, ish boshlashimiz mumkin\xBB. Faqat shundan keyin CPU o'zining birinchi ko'rsatmasini bajaradi \u2014 har doim ROM'dagi qat'iy belgilangan manzildan.")), /*#__PURE__*/React.createElement(BootStep, {
    n: "2",
    icon: "shield",
    color: "var(--c-warn)",
    titleUz: "UEFI / BIOS va POST \u2014 Qorovulning ertalabki tekshiruvi",
    titleEn: "UEFI / BIOS + POST \u2014 The morning inspection"
  }, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Em, null, "POST (Power-On Self Test)"), " is the first to run \u2014 hardware checks itself: is RAM present? Is the CPU working? Then ", /*#__PURE__*/React.createElement(Em, null, "UEFI"), " (modern successor to BIOS) maps all components and checks the ", /*#__PURE__*/React.createElement(Em, null, "Secure Boot"), " signature chain. If a bootkit tampered with the bootloader, UEFI refuses to hand off \u2014 this is exactly how ", /*#__PURE__*/React.createElement("code", null, "BlackLotus"), " was supposed to be stopped.") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Em, null, "POST (Power-On Self Test)"), " birinchi ishlaydi \u2014 hardware o'zini o'zi tekshiradi: RAM joyidami? CPU ishlayaptimi? Klaviatura ulanganmi? Keyin ", /*#__PURE__*/React.createElement(Em, null, "UEFI"), " (zamonaviy BIOS o'rniga) barcha qismlarni xaritalaydi va ", /*#__PURE__*/React.createElement(Em, null, "Secure Boot"), " imzo zanjirini tekshiradi. Agar bootkit bootloader'ni o'zgartirgan bo'lsa, UEFI estafetani uzatishdan bosh tortadi \u2014 ", /*#__PURE__*/React.createElement("code", null, "BlackLotus"), " aynan shunday to'xtatilishi kerak edi.")), /*#__PURE__*/React.createElement(BootStep, {
    n: "3",
    icon: "database",
    color: "var(--c-system)",
    titleUz: "Boot Manager \u2014 bootmgr.efi (Zavod direktori)",
    titleEn: "Boot Manager \u2014 bootmgr.efi"
  }, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "UEFI hands off to ", /*#__PURE__*/React.createElement("code", null, "bootmgr.efi"), " on the EFI System Partition. Its only job: read the ", /*#__PURE__*/React.createElement(Em, null, "BCD (Boot Configuration Data)"), " store and decide which OS to load. If you dual-boot (Windows + Kali Linux), this is where the menu appears. Single OS? It jumps straight ahead.") : /*#__PURE__*/React.createElement(React.Fragment, null, "UEFI EFI System Partition'dagi ", /*#__PURE__*/React.createElement("code", null, "bootmgr.efi"), " fayliga estafetani uzatadi. Uning yagona vazifasi: ", /*#__PURE__*/React.createElement(Em, null, "BCD (Boot Configuration Data)"), " ni o'qib, qaysi OT ni yuklashni hal qilish. Agar ikki OT o'rnatilgan bo'lsa (Windows + Kali Linux) \u2014 aynan shu yerda menyu paydo bo'ladi. Bitta OT bo'lsa \u2014 to'g'ri keyingisiga o'tadi.")), /*#__PURE__*/React.createElement(BootStep, {
    n: "4",
    icon: "cpu",
    color: "var(--accent)",
    titleUz: "Windows Loader \u2014 winload.efi (Stolga kitoblar qo'yish)",
    titleEn: "Windows Loader \u2014 winload.efi"
  }, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("code", null, "winload.efi"), " reads the Windows kernel (", /*#__PURE__*/React.createElement("code", null, "ntoskrnl.exe"), "), the Hardware Abstraction Layer (", /*#__PURE__*/React.createElement("code", null, "hal.dll"), "), and the boot-start drivers from disk and maps them into RAM. Working from RAM is thousands of times faster than disk \u2014 this is why the step exists at all. Before handing off, it verifies every loaded file's digital signature.") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("code", null, "winload.efi"), " Windows yadrosi (", /*#__PURE__*/React.createElement("code", null, "ntoskrnl.exe"), "), Apparat Abstraksiya Qatlami (", /*#__PURE__*/React.createElement("code", null, "hal.dll"), ") va dastlabki drayverlarni diskdan o'qib, RAM ga ko'chiradi. RAM'dan ishlash diskga qaraganda minglab marta tezroq \u2014 aynan shuning uchun bu qadam mavjud. Boshqaruvni topshirishdan oldin har bir faylning raqamli imzosini tekshiradi.")), /*#__PURE__*/React.createElement(BootStep, {
    n: "5",
    icon: "layers",
    color: "var(--c-user)",
    titleUz: "Kernel ishga tushishi \u2014 ntoskrnl.exe (Direktor ish boshlagani)",
    titleEn: "Kernel initialises \u2014 ntoskrnl.exe"
  }, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "Control passes fully to the ", /*#__PURE__*/React.createElement(Em, null, "Kernel"), ". It initialises the memory manager, object manager, I/O manager, and starts the process manager. Then it launches ", /*#__PURE__*/React.createElement("code", null, "smss.exe"), " (Session Manager) \u2014 the first real user-space process. Windows logo + spinning dots on screen = this exact moment.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Boshqaruv to'liq ", /*#__PURE__*/React.createElement(Em, null, "Kernelga"), " o'tadi. U xotira menejeri, ob'ekt menejeri, I/O menejeri va jarayon menejerini ishga tushiradi. So'ng ", /*#__PURE__*/React.createElement("code", null, "smss.exe"), " (Session Manager) ni \u2014 birinchi haqiqiy user-space jarayonini \u2014 yoqadi. Ekrandagi Windows logotipi va aylanayotgan nuqtalar \u2014 aynan mana shu lahza.")), /*#__PURE__*/React.createElement(BootStep, {
    n: "6",
    icon: "lock",
    color: "var(--c-attack)",
    titleUz: "Winlogon va LSASS \u2014 Kirish eshigi va Ruxsatnoma xizmati",
    titleEn: "Winlogon + LSASS \u2014 Gate and credential guard"
  }, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("code", null, "wininit.exe"), " starts ", /*#__PURE__*/React.createElement("code", null, "services.exe"), " (all background services) and ", /*#__PURE__*/React.createElement("code", null, "lsass.exe"), ". ", /*#__PURE__*/React.createElement(Em, null, "LSASS (Local Security Authority Subsystem Service)"), " is the heart of Windows authentication \u2014 it validates every password, PIN, and smart card. Then ", /*#__PURE__*/React.createElement("code", null, "winlogon.exe"), " brings up the lock screen. LSASS is also the prime target for ", /*#__PURE__*/React.createElement(Em, null, "credential dumping"), " (Mimikatz extracts hashes from its memory).") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("code", null, "wininit.exe"), " \u2014 ", /*#__PURE__*/React.createElement("code", null, "services.exe"), " (barcha fon xizmatlar) va ", /*#__PURE__*/React.createElement("code", null, "lsass.exe"), " ni ishga tushiradi. ", /*#__PURE__*/React.createElement(Em, null, "LSASS (Local Security Authority Subsystem Service)"), " \u2014 Windows autentifikatsiyasining yuragi: har bir parol, PIN va smart-karta aynan shu jarayon orqali tekshiriladi. So'ng ", /*#__PURE__*/React.createElement("code", null, "winlogon.exe"), " kirish ekranini ko'rsatadi. LSASS shu bilan birga ", /*#__PURE__*/React.createElement(Em, null, "credential dumping"), " ning asosiy nishoni (Mimikatz uning xotirasidan hash'larni tortib oladi)."))), /*#__PURE__*/React.createElement("h3", {
    style: subhead
  }, lang === "en" ? "4.1 — Secure Boot: the cryptographic chain of trust" : "4.1 — Secure Boot: kriptografik ishonch zanjiri"), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Term, null, "Secure Boot"), " is a UEFI feature that ensures every piece of software loaded during boot has been cryptographically signed by a trusted authority. It uses a chain of public/private key pairs stored inside UEFI firmware. There are two key databases: ", /*#__PURE__*/React.createElement(Em, null, "db"), " (allowed signatures \u2014 Microsoft, OEM) and ", /*#__PURE__*/React.createElement(Em, null, "dbx"), " (revoked signatures \u2014 known malware, revoked certificates). If any loaded binary's hash does not match a trusted entry in db \u2014 or matches a revoked entry in dbx \u2014 UEFI halts the boot immediately.") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Term, null, "Secure Boot"), " \u2014 UEFI xususiyati bo'lib, yuklash paytida yuklanadigan har bir dasturiy ta'minot parcha ishonchli organ tomonidan kriptografik imzolanganligi ta'minlanadi. U UEFI dasturiy ta'minotiga o'rnatilgan ochiq/yopiq kalit juftliklardan foydalanadi. Ikkita asosiy ma'lumotlar bazasi mavjud: ", /*#__PURE__*/React.createElement(Em, null, "db"), " (ruxsat etilgan imzolar \u2014 Microsoft, OEM) va ", /*#__PURE__*/React.createElement(Em, null, "dbx"), " (bekor qilingan imzolar \u2014 ma'lum zararli dasturlar, bekor qilingan sertifikatlar). Agar yuklanadigan binary'ning xeshi db dagi ishonchli yozuvga mos kelmasa \u2014 yoki dbx dagi bekor qilingan yozuvga mos kelsa \u2014 UEFI yuklashni darhol to'xtatadi.")), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "16px 0",
      padding: "18px 20px",
      borderRadius: 12,
      background: "var(--bg-2)",
      border: "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 12
    }
  }, "// SECURE BOOT \u2014 chain of trust (each step verifies the next)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, [{
    from: "UEFI Firmware (ROM)",
    to: "bootmgr.efi",
    detail: lang === "en" ? "SHA-256 hash of bootmgr.efi checked against db. Algorithm: RSA-2048 + SHA-256." : "bootmgr.efi ning SHA-256 xeshi db bilan solishtiriladi. Algoritm: RSA-2048 + SHA-256.",
    color: "var(--c-warn)"
  }, {
    from: "bootmgr.efi",
    to: "winload.efi",
    detail: lang === "en" ? "Boot manager verifies the Windows loader's signature via the same certificate chain." : "Boot manager Windows loader'ning imzosini bir xil sertifikat zanjiri orqali tekshiradi.",
    color: "var(--accent)"
  }, {
    from: "winload.efi",
    to: "ntoskrnl.exe + hal.dll",
    detail: lang === "en" ? "Windows loader verifies the kernel image and HAL using Microsoft's code-signing certificate." : "Windows loader yadro tasvirini va HAL ni Microsoft'ning kod imzolash sertifikati yordamida tekshiradi.",
    color: "var(--c-system)"
  }, {
    from: "ntoskrnl.exe",
    to: "Boot drivers (*.sys)",
    detail: lang === "en" ? "Kernel checks WHQL / EV certificate on every driver. Unsigned → BSOD (or test-signed mode only)." : "Kernel har bir drayverda WHQL / EV sertifikatini tekshiradi. Imzosiz → BSOD (yoki faqat test-sign rejimida).",
    color: "var(--c-system)"
  }].map((step, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 12,
      alignItems: "flex-start",
      padding: "8px 10px",
      borderRadius: 8,
      background: `${step.color}08`,
      borderLeft: `2px solid ${step.color}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0,
      paddingTop: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      color: step.color
    }
  }, step.from), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 9,
      color: "var(--text-3)"
    }
  }, "\u2192 ", step.to)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: "var(--text-1)",
      lineHeight: 1.6
    }
  }, step.detail))))), /*#__PURE__*/React.createElement(Callout, {
    color: "var(--c-attack)",
    icon: "skull",
    titleUz: "BlackLotus \u2014 Secure Boot'ni chetlab o'tish (2023)",
    titleEn: "BlackLotus \u2014 bypassing Secure Boot (2023)"
  }, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("code", null, "BlackLotus"), " was the first publicly documented UEFI bootkit to bypass Secure Boot on ", /*#__PURE__*/React.createElement(Em, null, "fully-patched Windows 11"), ". It exploited a 2022 vulnerability (CVE-2022-21894, \"baton drop\") in the Windows boot process. The technique: before Secure Boot checked the revocation list (dbx), BlackLotus patched the dbx verification code in memory, removing its own certificate from the revoked list. The signature check then passed normally. Once resident in the EFI System Partition, it loaded a kernel driver that disabled ", /*#__PURE__*/React.createElement(Em, null, "Driver Signature Enforcement (DSE)"), " \u2014 giving attackers unrestricted ring 0 access on a \"secure\" system.") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("code", null, "BlackLotus"), " \u2014 ", /*#__PURE__*/React.createElement(Em, null, "to'liq yamoqlangan Windows 11"), " da Secure Boot'ni chetlab o'tgan birinchi ommaviy hujjatlashtirilgan UEFI bootkit. U Windows boot jarayonidagi 2022 yil zaifligini (CVE-2022-21894, \"baton drop\") ekspluatatsiya qildi. Texnika: Secure Boot revokatsiya ro'yxatini (dbx) tekshirishdan oldin, BlackLotus xotiradagi dbx tekshiruv kodini yamab, o'zining sertifikatini bekor qilingan ro'yxatdan olib tashladi. Imzo tekshiruvi so'ngra odatdagidek o'tdi. EFI System Partition'ga joylashgach, u ", /*#__PURE__*/React.createElement(Em, null, "Driver Signature Enforcement (DSE)"), "'ni o'chiruvchi kernel drayveri yukladi \u2014 bu \"xavfsiz\" tizimda hujumchilarga cheksiz ring 0 kirishini ta'minladi.")), /*#__PURE__*/React.createElement("h3", {
    style: subhead
  }, lang === "en" ? "4.2 — BCD: Boot Configuration Data" : "4.2 — BCD: Boot Configuration Data"), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "The ", /*#__PURE__*/React.createElement(Term, null, "BCD (Boot Configuration Data)"), " store is a registry-like database stored in the EFI System Partition at ", /*#__PURE__*/React.createElement("code", null, "\\EFI\\Microsoft\\Boot\\BCD"), ". It is the configuration file that ", /*#__PURE__*/React.createElement("code", null, "bootmgr.efi"), " reads to know what to boot. BCD contains one or more ", /*#__PURE__*/React.createElement(Em, null, "boot entries"), " \u2014 each entry describes an OS to boot: its loader path (", /*#__PURE__*/React.createElement("code", null, "winload.efi"), "), partition location, timeout, debug settings, and Secure Boot flags.") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Term, null, "BCD (Boot Configuration Data)"), " \u2014 EFI System Partition'da ", /*#__PURE__*/React.createElement("code", null, "\\EFI\\Microsoft\\Boot\\BCD"), " manzilida saqlangan registry-ga o'xshash ma'lumotlar bazasi. Bu ", /*#__PURE__*/React.createElement("code", null, "bootmgr.efi"), " nima yuklashni bilish uchun o'qiydigan konfiguratsiya fayli. BCD bir yoki bir nechta ", /*#__PURE__*/React.createElement(Em, null, "boot yozuvlarini"), " o'z ichiga oladi \u2014 har bir yozuv yuklash uchun OS ni tavsiflaydi: loader yo'li (", /*#__PURE__*/React.createElement("code", null, "winload.efi"), "), bo'lim joylashuvi, vaqt tugashi, debug sozlamalari va Secure Boot bayroqlari.")), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "14px 0",
      padding: "14px 16px",
      borderRadius: 10,
      background: "var(--bg-2)",
      border: "1px solid var(--border)",
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      lineHeight: 1.9
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 8
    }
  }, "// bcdedit.exe /enum \u2014 reading BCD from cmd (Admin required)"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--text-3)"
    }
  }, lang === "en" ? "Windows Boot Manager" : "Windows Boot Manager"), /*#__PURE__*/React.createElement("div", null, "  ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--c-system)"
    }
  }, "identifier"), "    ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--accent)"
    }
  }, "{bootmgr}")), /*#__PURE__*/React.createElement("div", null, "  ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--c-system)"
    }
  }, "device"), "        ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-1)"
    }
  }, "partition=\\Device\\HarddiskVolume1")), /*#__PURE__*/React.createElement("div", null, "  ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--c-system)"
    }
  }, "timeout"), "       ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-1)"
    }
  }, "30")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      color: "var(--text-3)"
    }
  }, lang === "en" ? "Windows Boot Loader" : "Windows Boot Loader"), /*#__PURE__*/React.createElement("div", null, "  ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--c-system)"
    }
  }, "identifier"), "    ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--accent)"
    }
  }, "{current}")), /*#__PURE__*/React.createElement("div", null, "  ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--c-system)"
    }
  }, "path"), "          ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-1)"
    }
  }, "\\Windows\\System32\\winload.efi")), /*#__PURE__*/React.createElement("div", null, "  ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--c-system)"
    }
  }, "description"), "   ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-1)"
    }
  }, "Windows 11")), /*#__PURE__*/React.createElement("div", null, "  ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--c-system)"
    }
  }, "secureboot"), "    ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--c-user)"
    }
  }, "Yes")), /*#__PURE__*/React.createElement("div", null, "  ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--c-system)"
    }
  }, "bootdebug"), "     ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--c-attack)"
    }
  }, "No"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-3)"
    }
  }, "   ", lang === "en" ? "← enable for kernel debugging" : "← kernel debug uchun yoqish"))), /*#__PURE__*/React.createElement("h3", {
    style: subhead
  }, lang === "en" ? "4.3 — SMSS.exe and session creation" : "4.3 — SMSS.exe va sessiya yaratish"), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "After the kernel finishes its own initialisation, the very first user-space process it launches is ", /*#__PURE__*/React.createElement(Term, null, "smss.exe (Session Manager Subsystem)"), ". SMSS is special: it runs in ", /*#__PURE__*/React.createElement(Em, null, "Session 0"), ", the isolated session reserved for system services. It creates two types of sessions: ", /*#__PURE__*/React.createElement(Em, null, "Session 0"), " for background services (services.exe, lsass.exe, svchost.exe) and ", /*#__PURE__*/React.createElement(Em, null, "Session 1+"), " for each interactive user that logs in. This separation was introduced in Windows Vista as a security improvement \u2014 malware running as a service in Session 0 can no longer interact with the user's desktop in Session 1 (the ", /*#__PURE__*/React.createElement(Em, null, "Session 0 Isolation"), " feature).") : /*#__PURE__*/React.createElement(React.Fragment, null, "Kernel o'z ishga tushirishini tugatgandan so'ng, u ishga tushiradigan birinchi user-space jarayon ", /*#__PURE__*/React.createElement(Term, null, "smss.exe (Session Manager Subsystem)"), " dir. SMSS maxsus: u tizim xizmatlari uchun ajratilgan izolyatsiyalangan sessiyada \u2014 ", /*#__PURE__*/React.createElement(Em, null, "Sessiya 0"), " da ishlaydi. U ikkita turdagi sessiyalarni yaratadi: fon xizmatlari uchun ", /*#__PURE__*/React.createElement(Em, null, "Sessiya 0"), " (services.exe, lsass.exe, svchost.exe) va kiruvchi har bir interaktiv foydalanuvchi uchun ", /*#__PURE__*/React.createElement(Em, null, "Sessiya 1+"), ". Bu ajratish xavfsizlikni yaxshilash maqsadida Windows Vista'da kiritildi \u2014 Sessiya 0 da xizmat sifatida ishlaydigan zararli dastur endi Sessiya 1 dagi foydalanuvchi ish stolida ko'rina olmaydi (", /*#__PURE__*/React.createElement(Em, null, "Sessiya 0 Izolyatsiyasi"), " xususiyati).")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12,
      marginTop: 12,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 16px",
      borderRadius: 10,
      background: "rgba(0,212,255,0.06)",
      border: "1px solid rgba(0,212,255,0.22)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 14,
      fontWeight: 700,
      color: "var(--c-system)",
      marginBottom: 10
    }
  }, lang === "en" ? "Session 0 — system services" : "Sessiya 0 — tizim xizmatlari"), ["smss.exe (Session Manager)", "wininit.exe (Session 0 initialiser)", "services.exe (Service Control Manager)", "lsass.exe (Security authority)", "svchost.exe × many (hosted services)"].map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "mono",
    style: {
      fontSize: 11.5,
      color: "var(--text-1)",
      marginBottom: 3,
      paddingLeft: 8,
      borderLeft: "2px solid var(--c-system)"
    }
  }, p)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontSize: 12,
      color: "var(--text-2)",
      lineHeight: 1.5
    }
  }, lang === "en" ? "No UI. Cannot interact with user desktop. Isolated from Session 1+." : "UI yo'q. Foydalanuvchi ish stolida o'zaro aloqa qila olmaydi. Sessiya 1+ dan izolyatsiyalangan.")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 16px",
      borderRadius: 10,
      background: "rgba(255,145,69,0.06)",
      border: "1px solid rgba(255,145,69,0.22)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 14,
      fontWeight: 700,
      color: "var(--c-user)",
      marginBottom: 10
    }
  }, lang === "en" ? "Session 1+ — user sessions" : "Sessiya 1+ — foydalanuvchi sessiyalari"), ["winlogon.exe (logon manager)", "explorer.exe (shell / desktop)", "All user-launched apps (chrome, notepad…)", "Additional sessions for each RDP login"].map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "mono",
    style: {
      fontSize: 11.5,
      color: "var(--text-1)",
      marginBottom: 3,
      paddingLeft: 8,
      borderLeft: "2px solid var(--c-user)"
    }
  }, p)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontSize: 12,
      color: "var(--text-2)",
      lineHeight: 1.5
    }
  }, lang === "en" ? "Has desktop, input, UI. Each RDP user gets its own session number." : "Ish stoli, kiritish, UI bor. Har bir RDP foydalanuvchi o'z sessiya raqamini oladi."))), /*#__PURE__*/React.createElement("h3", {
    style: subhead
  }, lang === "en" ? "4.4 — LSASS: authentication heart and prime attack target" : "4.4 — LSASS: autentifikatsiya yuragi va asosiy hujum nishoni"), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Term, null, "LSASS (Local Security Authority Subsystem Service)"), " is the process that owns all authentication in Windows. Every logon \u2014 local password, PIN, Windows Hello, smart card, or network Kerberos ticket \u2014 passes through LSASS. It validates credentials, issues access tokens, maintains the local security policy, and manages the LSA secrets database (", /*#__PURE__*/React.createElement("code", null, "HKLM\\SECURITY\\Policy\\Secrets"), "). LSASS runs in ", /*#__PURE__*/React.createElement(Em, null, "Session 0"), " and is protected by Windows Defender Credential Guard (virtualisation-based isolation on modern systems).") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Term, null, "LSASS (Local Security Authority Subsystem Service)"), " \u2014 Windows dagi barcha autentifikatsiyaga egalik qiladigan jarayon. Har bir kirish \u2014 mahalliy parol, PIN, Windows Hello, smart karta yoki tarmoq Kerberos chiptasi \u2014 LSASS orqali o'tadi. U hisob ma'lumotlarini tekshiradi, kirish tokenlarini beradi, mahalliy xavfsizlik siyosatini boshqaradi va LSA secrets ma'lumotlar bazasini (", /*#__PURE__*/React.createElement("code", null, "HKLM\\SECURITY\\Policy\\Secrets"), ") saqlaydi. LSASS ", /*#__PURE__*/React.createElement(Em, null, "Sessiya 0"), " da ishlaydi va zamonaviy tizimlarda Windows Defender Credential Guard (virtuallashtirish asosidagi izolyatsiya) tomonidan himoyalangan.")), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "LSASS is the most targeted process in post-exploitation. The tool ", /*#__PURE__*/React.createElement(Em, null, "Mimikatz"), " (and its many clones) reads NTLM password hashes and Kerberos tickets directly from LSASS process memory. Defenders respond with: ", /*#__PURE__*/React.createElement("code", null, "PPL (Protected Process Light)"), " \u2014 LSASS gets a signed, protected process flag that prevents even administrator-level processes from opening its memory; ", /*#__PURE__*/React.createElement(Em, null, "Credential Guard"), " \u2014 moves credentials into a virtualisation-based security (VBS) enclave that even a compromised kernel cannot access; and ", /*#__PURE__*/React.createElement(Em, null, "LSA auditing"), " (Event ID 4656, 4662) which logs every handle opened against LSASS.") : /*#__PURE__*/React.createElement(React.Fragment, null, "LSASS \u2014 post-ekspluatatsiyada eng ko'p nishonlanadigan jarayon. ", /*#__PURE__*/React.createElement(Em, null, "Mimikatz"), " (va uning ko'plab klonlari) qurvosi LSASS jarayon xotirasidan NTLM parol xeshlarini va Kerberos chiptalari to'g'ridan-to'g'ri o'qiydi. Himoyachilar shunday choralar bilan javob beradi: ", /*#__PURE__*/React.createElement("code", null, "PPL (Protected Process Light)"), " \u2014 LSASS imzolangan, himoyalangan jarayon bayrog'ini oladi, bu administrator darajasidagi jarayonlarga ham uning xotirasini ochishga to'sqinlik qiladi; ", /*#__PURE__*/React.createElement(Em, null, "Credential Guard"), " \u2014 hisob ma'lumotlarini hatto buzilgan kernel ham kira olmaydigan virtuallashtirish asosidagi xavfsizlik (VBS) enklavisiga ko'chiradi; va ", /*#__PURE__*/React.createElement(Em, null, "LSA tekshiruvi"), " (Event ID 4656, 4662) \u2014 LSASS ga ochilgan har bir handle'ni qayd etadi.")), /*#__PURE__*/React.createElement("h3", {
    style: subhead
  }, lang === "en" ? "4.5 — PatchGuard and Driver Signature Enforcement" : "4.5 — PatchGuard va Drayver Imzo Tekshiruvi"), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Term, null, "PatchGuard (Kernel Patch Protection)"), " is a Windows mechanism, introduced in Vista x64, that prevents unauthorised modification of critical kernel structures. It periodically (at unpredictable intervals) takes checksums of: the SSDT (System Service Descriptor Table), the IDT (Interrupt Descriptor Table), GDT/LDT, kernel code pages, and key data structures like ", /*#__PURE__*/React.createElement("code", null, "EPROCESS"), ". If a checksum mismatch is found \u2014 meaning something modified these structures without authorisation \u2014 Windows immediately executes ", /*#__PURE__*/React.createElement("code", null, "KeBugCheckEx(0x109)"), " \u2014 a BSOD with stop code ", /*#__PURE__*/React.createElement(Em, null, "CRITICAL_STRUCTURE_CORRUPTION"), ". PatchGuard exists specifically to prevent rootkits from hooking the SSDT (the classic way to intercept all syscalls) and to prevent kernel code injection.") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Term, null, "PatchGuard (Kernel Patch Protection)"), " \u2014 Vista x64 da kiritilgan, asosiy kernel tuzilmalarining ruxsatsiz o'zgartirilishini oldini oladigan Windows mexanizmi. U davriy ravishda (oldindan aytib bo'lmaydigan intervallarda) quyidagilarning kontrol yig'indisini oladi: SSDT (System Service Descriptor Table), IDT (Interrupt Descriptor Table), GDT/LDT, kernel kod sahifalari va ", /*#__PURE__*/React.createElement("code", null, "EPROCESS"), " kabi asosiy ma'lumotlar tuzilmalari. Agar kontrol yig'indi nomuvofiqlik topilsa \u2014 ya'ni ruxsatsiz biror narsa bu tuzilmalarni o'zgartirgan bo'lsa \u2014 Windows darhol ", /*#__PURE__*/React.createElement("code", null, "KeBugCheckEx(0x109)"), " ni bajaradi \u2014 ", /*#__PURE__*/React.createElement(Em, null, "CRITICAL_STRUCTURE_CORRUPTION"), " to'xtash kodi bilan BSOD. PatchGuard rootkit'larning SSDT ga hook qo'yishini (barcha syscall'larni ushlab olishning klassik usuli) va kernel kod kiritishini oldini olish uchun mavjud.")), /*#__PURE__*/React.createElement(Callout, {
    color: "var(--c-warn)",
    icon: "warning",
    titleUz: "Xavfsizlik xulosa \u2014 boot zanjiri hujum yuzasi",
    titleEn: "Security summary \u2014 the boot chain as attack surface"
  }, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "Every stage of the Windows boot process is also an attack surface. ", /*#__PURE__*/React.createElement("strong", null, "Pre-UEFI:"), " physical attackers can overwrite the MBR/EFI partition. ", /*#__PURE__*/React.createElement("strong", null, "UEFI/Secure Boot:"), " firmware vulnerabilities (like CVE-2022-21894) allow bypassing signature checks in memory. ", /*#__PURE__*/React.createElement("strong", null, "BCD:"), " misconfigured bootdebug or testsigning flags disable kernel protections entirely. ", /*#__PURE__*/React.createElement("strong", null, "Driver loading:"), " BYOVD (Bring Your Own Vulnerable Driver) loads a legitimately signed but exploitable driver to disable DSE and load unsigned kernel code. ", /*#__PURE__*/React.createElement("strong", null, "LSASS at logon:"), " credential dumping steals hashes for lateral movement. Understanding the full boot sequence is non-negotiable for both defenders and attackers.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Windows boot jarayonining har bir bosqichi hujum yuzasi hamdir. ", /*#__PURE__*/React.createElement("strong", null, "UEFI'dan oldin:"), " jismoniy hujumchilar MBR/EFI bo'limini qayta yozishi mumkin. ", /*#__PURE__*/React.createElement("strong", null, "UEFI/Secure Boot:"), " dasturiy ta'minot zaifliklari (CVE-2022-21894 kabi) xotiradagi imzo tekshiruvlarini chetlab o'tish imkonini beradi. ", /*#__PURE__*/React.createElement("strong", null, "BCD:"), " noto'g'ri sozlangan bootdebug yoki testsigning bayroqlari kernel himoyalarini butunlay o'chiradi. ", /*#__PURE__*/React.createElement("strong", null, "Drayver yuklash:"), " BYOVD (Bring Your Own Vulnerable Driver) DSE ni o'chirish va imzosiz kernel kodni yuklash uchun qonuniy imzolangan, lekin ekspluatatsiya qilinadigan drayverni yuklaydi. ", /*#__PURE__*/React.createElement("strong", null, "Kirishda LSASS:"), " hisob ma'lumotlarini dump qilish lateral harakat uchun xeshlarni o'g'irlaydi. To'liq boot ketma-ketligini tushunish mudofaachilar ham, hujumchilar uchun ham majburiy.")));
}

// ─────────────────────────────────────────────────────────────
function Section5Syscall() {
  const lang = useLang();
  const chart = `
sequenceDiagram
    autonumber
    participant A as Application<br/>(ring 3)
    participant K as kernel32.dll<br/>(ring 3)
    participant N as ntdll.dll<br/>(ring 3)
    participant S as Syscall gate
    participant E as Executive<br/>(ring 0)
    participant H as Hardware

    Note over A,K: User wants to read a file
    A->>K: ReadFile(handle, buf, len)
    K->>N: NtReadFile(...)
    N->>S: syscall instruction
    S->>E: Switch to ring 0<br/>(kernel stack)
    Note over E: Security check<br/>+ I/O dispatch
    E->>H: Send command<br/>via driver
    H-->>E: Disk data
    E-->>N: Return + status
    N-->>K: Return
    K-->>A: bytes read
  `;
  return /*#__PURE__*/React.createElement("section", {
    id: "syscall",
    style: {
      scrollMarginTop: 80,
      marginBottom: 56
    }
  }, /*#__PURE__*/React.createElement(H2, {
    num: "05",
    uz: "Bitta syscall'ning hayoti",
    en: "The life of a single syscall"
  }), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "Every privileged operation \u2014 opening a file, allocating memory, sending a network packet \u2014 follows the exact same path: ", /*#__PURE__*/React.createElement(Em, null, "Win32 API \u2192 ntdll \u2192 syscall instruction \u2192 executive"), ". The diagram below traces one single ", /*#__PURE__*/React.createElement(Code2, null, "ReadFile"), " call. Knowing this path by heart is non-negotiable for kernel debugging, malware analysis and EDR work.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Har qanday imtiyozli operatsiya \u2014 fayl ochish, xotira ajratish, tarmoq paketi yuborish \u2014 aynan bir xil yo'ldan o'tadi: ", /*#__PURE__*/React.createElement(Em, null, "Win32 API \u2192 ntdll \u2192 syscall buyrug'i \u2192 executive"), ". Quyidagi diagramma bitta ", /*#__PURE__*/React.createElement(Code2, null, "ReadFile"), " chaqiruvini kuzatadi. Bu yo'lni yoddan bilish \u2014 kernel debugging, malware tahlili va EDR ishi uchun shart.")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement(MermaidDiagram, {
    chart: chart,
    caption: "2-rasm. Bitta ReadFile chaqiruvi user mode'dan kernel mode'ga va orqaga qaytishi.",
    captionEn: "Fig 2. A single ReadFile traveling from user mode to kernel and back."
  })), /*#__PURE__*/React.createElement(SyscallAnalogy, null), /*#__PURE__*/React.createElement(Callout, {
    color: "var(--c-attack)",
    icon: "skull",
    titleUz: "Hujum nuqtasi \u2014 nega bu kiberxavfsizlik uchun muhim",
    titleEn: "Attack surface \u2014 why this matters for security"
  }, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "Look at the ", /*#__PURE__*/React.createElement("strong", null, "\"Attack surface\""), " marker at the very bottom of the diagram. Most defensive tools and antivirus engines (", /*#__PURE__*/React.createElement(Em, null, "EDRs"), ") plant their \"hook\" right inside ", /*#__PURE__*/React.createElement(Code2, null, "ntdll.dll"), " \u2014 because it is the ", /*#__PURE__*/React.createElement(Em, null, "last stop in ring 3"), ", the final place before the syscall instruction crosses into the kernel. They record every move the \"waiter\" makes. This is exactly why advanced malware uses ", /*#__PURE__*/React.createElement(Em, null, "direct syscalls"), " \u2014 bypassing the hooked ntdll functions and invoking the ", /*#__PURE__*/React.createElement(Code2, null, "syscall"), " instruction itself, walking up to the kitchen window alone.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Diagrammaning eng pastki qismidagi ", /*#__PURE__*/React.createElement("strong", null, "\xABHujum nuqtasi\xBB"), " belgisiga e'tibor bering. Aksariyat himoya tizimlari va antiviruslar (", /*#__PURE__*/React.createElement(Em, null, "EDR"), ") jarayonni kuzatish uchun o'z \xABqarmog'ini\xBB (hook) aynan ", /*#__PURE__*/React.createElement(Code2, null, "ntdll.dll"), " ichiga tashlaydi \u2014 chunki bu ", /*#__PURE__*/React.createElement(Em, null, "Ring 3'dagi oxirgi nuqta"), ", syscall buyrug'i yadroga kirishidan oldingi so'nggi joy. Ular \xABofitsiant\xBBning har bir qadamini yozib boradi. Aynan shuning uchun rivojlangan malware ", /*#__PURE__*/React.createElement(Em, null, "\xABto'g'ridan-to'g'ri syscall\xBB"), " (direct syscall) usulidan foydalanadi \u2014 ushlangan ntdll funksiyalarini chetlab o'tib, ", /*#__PURE__*/React.createElement(Code2, null, "syscall"), " buyrug'ining o'zini bevosita chaqiradi, ya'ni ofitsiantsiz o'zi oshxona darchasiga boradi.")));
}

// ─── Restaurant analogy for the syscall flow ───────────────────
const SYSCALL_ACTORS = [{
  tech: "Application",
  roleUz: "Mijoz",
  roleEn: "The customer",
  icon: "user",
  color: "var(--c-user)",
  descUz: "Notepad — maxfiy.txt'ni ochmoqchi",
  descEn: "Notepad — wants to open maxfiy.txt"
}, {
  tech: "kernel32 · ntdll",
  roleUz: "Ofitsiant",
  roleEn: "The waiter",
  icon: "code",
  color: "var(--c-user)",
  descUz: "Buyurtmani oshxona tiliga o'giradi",
  descEn: "Translates the order for the kitchen"
}, {
  tech: "Syscall gate",
  roleUz: "Oshxona eshigi",
  roleEn: "The kitchen door",
  icon: "key",
  color: "var(--c-warn)",
  descUz: "Ring 3 → Ring 0 chegarasi",
  descEn: "The ring 3 → ring 0 boundary"
}, {
  tech: "Executive / Kernel",
  roleUz: "Oshpaz + Qorovul",
  roleEn: "Chef + guard",
  icon: "shield-check",
  color: "var(--c-system)",
  descUz: "Ruxsatni tekshiradi, ishni bajaradi",
  descEn: "Checks the permission, does the work"
}, {
  tech: "Hardware",
  roleUz: "Omborxona",
  roleEn: "The warehouse",
  icon: "database",
  color: "#8390a8",
  descUz: "SSD / HDD — baytlarni topadi",
  descEn: "SSD / HDD — fetches the raw bytes"
}];
function SyscallAnalogy() {
  const lang = useLang();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 20px",
      borderRadius: 12,
      background: "rgba(255,145,69,0.06)",
      border: "1px solid rgba(255,145,69,0.28)",
      display: "flex",
      gap: 14,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--c-user)",
      flexShrink: 0,
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "users",
    size: 20
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 17,
      fontWeight: 600,
      color: "var(--c-user)"
    }
  }, lang === "en" ? "Read it as a restaurant" : "Buni restoran misolida o'qing"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: "var(--text-1)",
      lineHeight: 1.6,
      marginTop: 4
    }
  }, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "This diagram shows how Windows connects a plain program (Notepad, or your Python script) to the computer's physical storage. The easiest way to understand it is a restaurant: you order, a waiter relays it, the kitchen cooks, the warehouse supplies \u2014 and your food travels back the same way.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Bu diagramma Windows oddiy dasturni (Notepad yoki Python skriptingizni) kompyuterning jismoniy xotirasiga qanday bog'lashini ko'rsatadi. Buni eng oson tushunish yo'li \u2014 restoran: siz buyurtma berasiz, ofitsiant uni yetkazadi, oshxona tayyorlaydi, omborxona mahsulot beradi \u2014 taom esa o'sha yo'ldan orqaga qaytadi.")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(5, 1fr)",
      gap: 8,
      marginTop: 16
    }
  }, SYSCALL_ACTORS.map((a, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: "14px 12px",
      borderRadius: 10,
      background: "var(--bg-2)",
      border: `1px solid ${a.color}33`,
      borderTop: `2px solid ${a.color}`,
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 7,
      background: a.color + "1a",
      border: `1px solid ${a.color}44`,
      color: a.color,
      display: "grid",
      placeItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: a.icon,
    size: 15
  })), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 9,
      color: "var(--text-3)",
      letterSpacing: 0.06
    }
  }, "0", i + 1)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 14,
      fontWeight: 600,
      color: a.color
    }
  }, lang === "en" ? a.roleEn : a.roleUz), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 9.5,
      color: "var(--text-2)",
      letterSpacing: 0.04
    }
  }, a.tech), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-1)",
      lineHeight: 1.45
    }
  }, lang === "en" ? a.descEn : a.descUz)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 4
    }
  }, "// ", lang === "en" ? "STEP_BY_STEP" : "QADAMMA_QADAM"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(AnalogyStep, {
    n: 1,
    zoneUz: "Ring 3 \xB7 Buyurtma",
    zoneEn: "Ring 3 \xB7 The order",
    color: "var(--c-user)",
    dir: "down",
    titleUz: "Mijoz buyurtma beradi",
    titleEn: "The customer places an order"
  }, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "You want to open ", /*#__PURE__*/React.createElement(Code2, null, "maxfiy.txt"), " in Notepad. Notepad tells the OS \"read me this file\" \u2014 in the diagram this is ", /*#__PURE__*/React.createElement(Code2, null, "ReadFile(handle, buffer)"), " (step\xA01). The app only knows the file number (the ", /*#__PURE__*/React.createElement(Term, null, "handle"), ") and an empty slot for the data (the ", /*#__PURE__*/React.createElement(Term, null, "buffer"), "); it has no idea where the disk physically is.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Siz Notepad'da ", /*#__PURE__*/React.createElement(Code2, null, "maxfiy.txt"), " faylini ochmoqchisiz. Notepad operatsion tizimga \xABmenga shu faylni o'qib ber\xBB deydi \u2014 diagrammada bu ", /*#__PURE__*/React.createElement(Code2, null, "ReadFile(handle, buffer)"), " (1-qadam). Dastur faqat fayl raqamini (", /*#__PURE__*/React.createElement(Term, null, "handle"), ") va ma'lumot joylashadigan bo'sh joyni (", /*#__PURE__*/React.createElement(Term, null, "buffer"), ") biladi; diskning fizik joyini umuman bilmaydi.")), /*#__PURE__*/React.createElement(AnalogyStep, {
    n: 2,
    zoneUz: "Ring 3 \xB7 Ofitsiant",
    zoneEn: "Ring 3 \xB7 The waiter",
    color: "var(--c-user)",
    dir: "down",
    titleUz: "Ofitsiant buyurtmani tarjima qiladi",
    titleEn: "The waiter translates the order"
  }, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "Programs are not allowed to talk to the hardware directly. Notepad calls a Windows library \u2014 ", /*#__PURE__*/React.createElement(Code2, null, "kernel32.dll"), " \u2014 which hands the order to ", /*#__PURE__*/React.createElement(Code2, null, "ntdll.dll"), ", translating it into the kitchen's language: ", /*#__PURE__*/React.createElement(Code2, null, "NtReadFile"), " (step\xA02). All of this still happens in ", /*#__PURE__*/React.createElement(Em, null, "User Mode (Ring 3)"), " \u2014 the restricted zone where security limits apply.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Dasturlarga temir-tersak bilan to'g'ridan-to'g'ri gaplashishga ruxsat yo'q. Notepad maxsus Windows kutubxonasiga \u2014 ", /*#__PURE__*/React.createElement(Code2, null, "kernel32.dll"), " \u2014 murojaat qiladi, u esa buyurtmani ", /*#__PURE__*/React.createElement(Code2, null, "ntdll.dll"), " ga uzatib, oshxona tushunadigan tilga o'giradi: ", /*#__PURE__*/React.createElement(Code2, null, "NtReadFile"), " (2-qadam). Bularning bari hali ", /*#__PURE__*/React.createElement(Em, null, "User Mode (Ring 3)"), " \u2014 xavfsizlik cheklovlari amal qiladigan hududda yuz beradi.")), /*#__PURE__*/React.createElement(AnalogyStep, {
    n: 3,
    zoneUz: "Chegara \xB7 Syscall",
    zoneEn: "Boundary \xB7 Syscall",
    color: "var(--c-warn)",
    dir: "down",
    titleUz: "Oshxona eshigi \u2014 syscall",
    titleEn: "The kitchen door \u2014 the syscall"
  }, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "The waiter has the order but cannot enter the kitchen (the kernel). So he passes it through the kitchen window with a special command: ", /*#__PURE__*/React.createElement(Code2, null, "syscall"), " (system call, step\xA03). This is the hard boundary between the ordinary application world and the fully-privileged kernel world \u2014 ring\xA03 stops, ring\xA00 begins.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Ofitsiant buyurtmani oldi, lekin oshxonaga (yadroga) kira olmaydi. Shuning uchun u oshxona darchasidan maxsus buyruq yuboradi: ", /*#__PURE__*/React.createElement(Code2, null, "syscall"), " (system call \u2014 tizim chaqiruvi, 3-qadam). Bu \u2014 oddiy dastur muhitidan to'liq huquqli yadro muhitiga o'tish chegarasi: ring\xA03 tugaydi, ring\xA00 boshlanadi.")), /*#__PURE__*/React.createElement(AnalogyStep, {
    n: 4,
    zoneUz: "Ring 0 \xB7 Yadro",
    zoneEn: "Ring 0 \xB7 Kernel",
    color: "var(--c-system)",
    dir: "down",
    titleUz: "Qorovul tekshiradi, oshpaz ishni bajaradi",
    titleEn: "The guard checks, the chef cooks"
  }, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "The order is now inside the \"heart\" of the computer (Ring\xA00). The guard runs a ", /*#__PURE__*/React.createElement(Em, null, "security check"), " first: do you actually have permission to read this file? If yes, the kernel (the chef) forwards the command straight to the hardware drivers (steps\xA04\u20135).") : /*#__PURE__*/React.createElement(React.Fragment, null, "Buyurtma endi kompyuterning \xAByuragi\xBB \u2014 Ring\xA00 ichida. Avval Qorovul ", /*#__PURE__*/React.createElement(Em, null, "xavfsizlik tekshiruvini"), " o'tkazadi: sizning bu faylni o'qishga huquqingiz bormi? Ruxsat bo'lsa, Kernel (oshpaz) buyruqni bevosita hardware drayverlariga uzatadi (4\u20135-qadamlar).")), /*#__PURE__*/React.createElement(AnalogyStep, {
    n: 5,
    zoneUz: "Hardware \xB7 Omborxona",
    zoneEn: "Hardware \xB7 Warehouse",
    color: "#8390a8",
    dir: "down",
    titleUz: "Omborxona baytlarni topadi",
    titleEn: "The warehouse fetches the bytes"
  }, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "Your disk (SSD / HDD) springs into action, locates the text bytes of ", /*#__PURE__*/React.createElement(Code2, null, "maxfiy.txt"), " at the requested address and sends them back up (step\xA06). This is the only point where anything physical actually moves.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Qattiq diskingiz (SSD / HDD) ishga tushadi, ko'rsatilgan manzildan ", /*#__PURE__*/React.createElement(Code2, null, "maxfiy.txt"), " ichidagi matn baytlarini topadi va yuqoriga qaytaradi (6-qadam). Bu \u2014 yagona nuqta, bu yerda haqiqatan fizik narsa harakatlanadi.")), /*#__PURE__*/React.createElement(AnalogyStep, {
    n: 6,
    zoneUz: "Qaytish \xB7 Orqaga",
    zoneEn: "Return \xB7 Back up",
    color: "var(--accent)",
    dir: "up",
    last: true,
    titleUz: "Ma'lumot o'sha yo'ldan qaytadi",
    titleEn: "The data travels back the same way"
  }, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "The data retraces its path in reverse (steps\xA07\u20139): kernel \u2192 ", /*#__PURE__*/React.createElement(Code2, null, "ntdll.dll"), " \u2192 ", /*#__PURE__*/React.createElement(Code2, null, "kernel32.dll"), " \u2192 Notepad. Finally the text appears on your screen. The entire round trip finishes in well under a millisecond.") : /*#__PURE__*/React.createElement(React.Fragment, null, "O'qilgan ma'lumot kelgan yo'lidan teskari qaytadi (7\u20139-qadamlar): yadro \u2192 ", /*#__PURE__*/React.createElement(Code2, null, "ntdll.dll"), " \u2192 ", /*#__PURE__*/React.createElement(Code2, null, "kernel32.dll"), " \u2192 Notepad. Nihoyat matn ekraningizda paydo bo'ladi. Butun bu sayohat bir millisekunddan ham kam vaqtda tugaydi.")))));
}
function AnalogyStep({
  n,
  zoneUz,
  zoneEn,
  color,
  dir = "down",
  last,
  titleUz,
  titleEn,
  children
}) {
  const lang = useLang();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 16,
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      borderRadius: "50%",
      background: color + "1a",
      color,
      border: `1.5px solid ${color}`,
      display: "grid",
      placeItems: "center",
      fontFamily: "var(--font-mono)",
      fontWeight: 700,
      fontSize: 14,
      boxShadow: `0 0 14px ${color}44`
    }
  }, n), !last && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      width: 2,
      background: `linear-gradient(180deg, ${color}, var(--border))`,
      minHeight: 18,
      marginTop: 2
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: last ? 0 : 22,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 9.5,
      color,
      letterSpacing: 0.12,
      textTransform: "uppercase"
    }
  }, lang === "en" ? zoneEn : zoneUz), /*#__PURE__*/React.createElement(Icon, {
    name: dir === "up" ? "arrow-left" : "arrow-right",
    size: 11,
    style: {
      color,
      transform: dir === "up" ? "rotate(-90deg)" : "rotate(90deg)"
    }
  })), /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: "0 0 4px",
      fontFamily: "var(--font-display)",
      fontSize: 16,
      fontWeight: 600,
      color: "var(--text-0)"
    }
  }, lang === "en" ? titleEn : titleUz), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: "var(--text-1)",
      lineHeight: 1.65
    }
  }, children)));
}

// ─────────────────────────────────────────────────────────────
function Section6Security() {
  const lang = useLang();
  const items = [{
    icon: "shield-check",
    color: "var(--accent)",
    uz: "User/kernel chegarasi",
    en: "User/kernel boundary",
    descUz: "Hujumchining birinchi orzusi — ring 3'dan ring 0'ga sakrash. Privilege escalation deganda aynan shu bosqich nazarda tutiladi.",
    descEn: "Every attacker's first dream: jump from ring 3 to ring 0. This is what 'privilege escalation' targets."
  }, {
    icon: "code",
    color: "var(--c-user)",
    uz: "Subsistem DLL'lari",
    en: "Subsystem DLLs",
    descUz: "kernel32, user32, ntdll — bu yerda hook qilish DLL hijacking, AMSI bypass va EDR aldash uchun klassik joy.",
    descEn: "kernel32, user32, ntdll — hooking here is the classic spot for DLL hijacking, AMSI bypass, and EDR evasion."
  }, {
    icon: "cpu",
    color: "var(--c-attack)",
    uz: "Drayverlar",
    en: "Drivers",
    descUz: "Imzolangan, ammo zaif drayver — kernel'ga eng tez yo'l. 'BYOVD' (Bring Your Own Vulnerable Driver) shu yerdan keladi.",
    descEn: "A signed but vulnerable driver = the fastest path into the kernel. This is the 'BYOVD' (Bring Your Own Vulnerable Driver) trick."
  }, {
    icon: "database",
    color: "var(--c-auth)",
    uz: "Object Manager",
    en: "Object Manager",
    descUz: "Har bir handle uchun SRM ruxsat tekshiradi. Yomon konfiguratsiya — token impersonation va handle hijacking uchun ochiq eshik.",
    descEn: "SRM checks ACLs on every handle. A weak ACL = open door for token impersonation and handle hijacking."
  }, {
    icon: "layers",
    color: "var(--c-system)",
    uz: "Bootloader",
    en: "Bootloader",
    descUz: "Secure Boot'ni chetlab o'tuvchi rootkit (BlackLotus) — bu hozirda eng yuqori darajadagi tahdid.",
    descEn: "A rootkit that bypasses Secure Boot (BlackLotus) — currently the highest-tier threat."
  }, {
    icon: "lock",
    color: "var(--c-warn)",
    uz: "HAL & firmware",
    en: "HAL & firmware",
    descUz: "Eng past darajadagi rootkit (firmware bootkit) — diskni qayta formatlash ham yordam bermaydi.",
    descEn: "Lowest-tier rootkit (firmware bootkit) — reformatting the disk doesn't help."
  }];
  return /*#__PURE__*/React.createElement("section", {
    id: "security",
    style: {
      scrollMarginTop: 80,
      marginBottom: 56
    }
  }, /*#__PURE__*/React.createElement(H2, {
    num: "06",
    uz: "Xavfsizlik nuqtai nazaridan",
    en: "Why each layer matters for security"
  }), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "This isn't a security course bolted on top of fundamentals \u2014 every layer of the architecture you just learned is also an attack surface. Below is how each layer becomes interesting to an attacker (and to you, as a defender).") : /*#__PURE__*/React.createElement(React.Fragment, null, "Bu fundamental darslarga \xABulangan\xBB xavfsizlik kursi emas \u2014 siz hozir o'rgangan har bir qatlam ham hujum yuzasidir. Quyida har bir qatlam hujumchi uchun (va sizga, mudofaachi sifatida) qanday qiziqarli bo'lishi ko'rsatilgan.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: 12,
      marginTop: 22
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "glass",
    style: {
      padding: 18,
      borderLeft: `3px solid ${it.color}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: it.color
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: it.icon,
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 16,
      fontWeight: 600
    }
  }, lang === "en" ? it.en : it.uz)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--text-1)",
      lineHeight: 1.55
    }
  }, lang === "en" ? it.descEn : it.descUz)))));
}

// ─────────────────────────────────────────────────────────────
function Section7Lab() {
  const lang = useLang();
  return /*#__PURE__*/React.createElement("section", {
    id: "lab",
    style: {
      scrollMarginTop: 80,
      marginBottom: 56
    }
  }, /*#__PURE__*/React.createElement(H2, {
    num: "07",
    uz: "Laboratoriya",
    en: "Hands-on lab"
  }), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "Open an elevated PowerShell. Your goal: see the architecture in real-time \u2014 list every process, identify what runs in user mode vs kernel mode, and watch the syscall path light up.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Admin huquqi bilan PowerShell oching. Vazifa: arxitekturani real vaqtda ko'rish \u2014 barcha jarayonlarni sanab chiqing, user mode'da va kernel mode'da nima ishlayotganini aniqlang, va syscall yo'lining yorishishini kuzating.")), /*#__PURE__*/React.createElement("div", {
    className: "glass",
    style: {
      padding: "0 28px 4px",
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement(LabStep, {
    n: 1,
    title: "Barcha jarayonlarni ro'yxatlash",
    titleEn: "Enumerate every process",
    done: true
  }, /*#__PURE__*/React.createElement(P, null, lang === "en" ? "Get every running process with its PID, parent PID and image path." : "Har bir jarayonni PID, ota-PID va image path bilan ko'rasiz."), /*#__PURE__*/React.createElement(Terminal, {
    lines: [{
      type: "comment",
      text: lang === "en" ? "# Top 8 processes by memory" : "# Xotira bo'yicha eng katta 8 ta jarayon"
    }, {
      type: "cmd",
      text: "Get-Process | Sort-Object WS -Desc | Select-Object -First 8 Id, Name, @{n='MB';e={[int]($_.WS/1MB)}}, Path"
    }, {
      type: "out",
      text: "  Id  Name            MB  Path"
    }, {
      type: "out",
      text: "  --  ----            --  ----"
    }, {
      type: "ok",
      text: "1840  MsMpEng        612  C:\\ProgramData\\Microsoft\\Windows Defender\\..."
    }, {
      type: "ok",
      text: "5612  chrome         484  C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    }, {
      type: "ok",
      text: "  4   System         122  (kernel)"
    }, {
      type: "warn",
      text: "  0   Idle             0  (kernel · scheduler)"
    }, {
      type: "comment",
      text: lang === "en" ? "\n# Note: PID 0 and 4 are kernel-mode 'processes' — they have no image on disk." : "\n# Eslatma: PID 0 va 4 — kernel-mode 'jarayonlari'. Diskda image'i yo'q."
    }]
  })), /*#__PURE__*/React.createElement(LabStep, {
    n: 2,
    title: "Process tree ko'rinishini olish",
    titleEn: "Build the process tree"
  }, /*#__PURE__*/React.createElement(P, null, lang === "en" ? "Who started whom? The tree reveals the boot sequence in action." : "Kim kimni ishga tushirgan? Process tree — boot ketma-ketligini real holatda ochib beradi."), /*#__PURE__*/React.createElement(Terminal, {
    lines: [{
      type: "cmd",
      text: "Get-CimInstance Win32_Process | Select-Object ProcessId, ParentProcessId, Name | Format-Table"
    }, {
      type: "out",
      text: " ProcessId  ParentProcessId  Name"
    }, {
      type: "out",
      text: " ---------  ---------------  ----"
    }, {
      type: "ok",
      text: "         0                   System Idle Process"
    }, {
      type: "ok",
      text: "         4              0    System"
    }, {
      type: "ok",
      text: "       340              4    smss.exe       ← session manager"
    }, {
      type: "ok",
      text: "       456            340    csrss.exe      ← Win32 subsystem"
    }, {
      type: "ok",
      text: "       540            340    wininit.exe    ← user-mode init"
    }, {
      type: "ok",
      text: "       668            540    services.exe   ← SCM"
    }, {
      type: "ok",
      text: "       680            540    lsass.exe      ← security subsystem"
    }, {
      type: "ok",
      text: "      1124            668    svchost.exe    ← service host"
    }, {
      type: "comment",
      text: lang === "en" ? "\n# This IS the boot diagram from section 4 — live, on your machine." : "\n# Bu — 4-bo'limdagi boot diagrammasi. Real holda, sizning mashinangizda."
    }]
  })), /*#__PURE__*/React.createElement(LabStep, {
    n: 3,
    title: "Drayverlar ro'yxati (kernel mode kodi)",
    titleEn: "List loaded drivers (kernel-mode code)"
  }, /*#__PURE__*/React.createElement(P, null, lang === "en" ? "Every loaded driver = code running in ring 0. A single rogue one can compromise the whole system." : "Yuklangan har bir drayver = ring 0'da ishlayotgan kod. Yagona zararli drayver butun tizimni xavf ostiga qo'yadi."), /*#__PURE__*/React.createElement(Terminal, {
    lines: [{
      type: "cmd",
      text: "driverquery /v /fo csv | ConvertFrom-Csv | Select-Object 'Module Name', 'Display Name', 'Driver Type' | Sort-Object 'Driver Type'"
    }, {
      type: "out",
      text: " Module Name   Display Name              Driver Type"
    }, {
      type: "out",
      text: " -----------   ------------              -----------"
    }, {
      type: "ok",
      text: " ACPI          ACPI Driver               Kernel"
    }, {
      type: "ok",
      text: " disk          Disk Driver               Kernel"
    }, {
      type: "ok",
      text: " NTFS          NTFS Filesystem           File System"
    }, {
      type: "ok",
      text: " tcpip         TCP/IP Protocol Driver    Kernel"
    }, {
      type: "warn",
      text: " RTKVHD64      Realtek HD Audio Driver   Kernel"
    }, {
      type: "err",
      text: " ??_unknown_   <unsigned third-party>    Kernel   ← inspect this!"
    }, {
      type: "comment",
      text: lang === "en" ? "\n# Hunt for unsigned drivers — they're the #1 indicator of BYOVD." : "\n# Imzolanmagan drayverlarni qidiring — bular BYOVD'ning №1 ishorasi."
    }]
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      padding: 18,
      borderRadius: 10,
      background: "rgba(0,255,156,0.04)",
      border: "1px solid var(--accent-border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "info",
    size: 16,
    style: {
      color: "var(--accent)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--accent)",
      fontWeight: 600
    }
  }, lang === "en" ? "Lab completion" : "Lab yakuni")), /*#__PURE__*/React.createElement(P, {
    style: {
      marginTop: 8,
      marginBottom: 0
    }
  }, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "Now run ", /*#__PURE__*/React.createElement(Code2, null, "Process Explorer"), " from Sysinternals and watch a single click \u2014 say, opening Notepad \u2014 propagate through every layer you just mapped.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Endi Sysinternals'dan ", /*#__PURE__*/React.createElement(Code2, null, "Process Explorer"), "'ni ishga tushiring va bitta bosishni \u2014 masalan, Notepad ochishni \u2014 siz endi xaritalashtirilgan har bir qatlam orqali yoyilishini kuzating."))));
}

// ─────────────────────────────────────────────────────────────
function Section8Comparison() {
  const lang = useLang();
  return /*#__PURE__*/React.createElement("section", {
    id: "compare",
    style: {
      scrollMarginTop: 80,
      marginBottom: 56
    }
  }, /*#__PURE__*/React.createElement(H2, {
    num: "08",
    uz: "User mode va Kernel mode",
    en: "User mode vs Kernel mode"
  }), /*#__PURE__*/React.createElement(P, null, lang === "en" ? "Two worlds, same machine. Knowing which side you're on at any moment is the single most important skill on the Windows internals path." : "Ikki dunyo, bir mashina. Istalgan vaqtda qaysi tomonda ekanligingizni bilish — Windows internals yo'lidagi eng muhim ko'nikmadir."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22,
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 0,
      borderRadius: 12,
      overflow: "hidden",
      border: "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 20px",
      background: "var(--surface-2)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      color: "var(--text-2)",
      letterSpacing: 0.1,
      textTransform: "uppercase"
    }
  }, lang === "en" ? "Aspect" : "Jihat")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 20px",
      background: "rgba(255, 145, 69, 0.08)",
      borderLeft: "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      color: "var(--c-user)",
      letterSpacing: 0.1,
      textTransform: "uppercase"
    }
  }, "User mode \xB7 ring 3")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 20px",
      background: "rgba(77, 139, 255, 0.08)",
      borderLeft: "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      color: "var(--c-system)",
      letterSpacing: 0.1,
      textTransform: "uppercase"
    }
  }, "Kernel mode \xB7 ring 0")), (lang === "en" ? CMP_EN : CMP_UZ).map((row, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 20px",
      borderTop: "1px solid var(--border)",
      fontSize: 13,
      color: "var(--text-1)",
      background: "var(--bg-2)"
    }
  }, row[0]), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 20px",
      borderTop: "1px solid var(--border)",
      borderLeft: "1px solid var(--border)",
      fontSize: 13,
      color: "var(--text-0)"
    }
  }, row[1]), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 20px",
      borderTop: "1px solid var(--border)",
      borderLeft: "1px solid var(--border)",
      fontSize: 13,
      color: "var(--text-0)"
    }
  }, row[2])))));
}
const CMP_UZ = [["Privilege", "Cheklangan (ring 3)", "Cheksiz (ring 0)"], ["Hardware'ga kirish", "❌ Faqat OS orqali", "✅ To'g'ridan-to'g'ri"], ["Boshqa jarayonni o'qish", "❌ Sandbox'lashtirilgan", "✅ Hammasini"], ["Xato ta'siri", "Bitta dastur o'ladi", "BSOD — butun mashina"], ["Yashash joyi", "exe, dll", "sys (drayver), ntoskrnl"], ["Misol kod", "Notepad, Chrome", "NTFS drayveri, TCP/IP stack"], ["Debugging vositasi", "WinDbg, x64dbg", "WinDbg + KD, LiveKD"]];
const CMP_EN = [["Privilege", "Restricted (ring 3)", "Unrestricted (ring 0)"], ["Hardware access", "❌ Only via OS", "✅ Direct"], ["Read another process", "❌ Sandboxed", "✅ Anything"], ["Crash impact", "One app dies", "BSOD — entire machine"], ["Lives in", "exe, dll", "sys (driver), ntoskrnl"], ["Example code", "Notepad, Chrome", "NTFS driver, TCP/IP stack"], ["Debugger", "WinDbg, x64dbg", "WinDbg + KD, LiveKD"]];

// ─────────────────────────────────────────────────────────────
function Section9Summary() {
  const lang = useLang();
  const nodes = [{
    x: 50,
    y: 50,
    label: "Windows",
    color: "var(--accent)",
    main: true
  }, {
    x: 22,
    y: 22,
    label: "OS jobs",
    color: "var(--c-user)"
  }, {
    x: 78,
    y: 22,
    label: "Ring 3/0",
    color: "var(--c-warn)"
  }, {
    x: 18,
    y: 50,
    label: "Executive",
    color: "var(--c-system)"
  }, {
    x: 82,
    y: 50,
    label: "ntoskrnl",
    color: "var(--c-system)"
  }, {
    x: 25,
    y: 78,
    label: "HAL",
    color: "#8390a8"
  }, {
    x: 75,
    y: 78,
    label: "Syscall",
    color: "var(--c-warn)"
  }, {
    x: 50,
    y: 12,
    label: "Subsystems",
    color: "var(--c-user)"
  }, {
    x: 50,
    y: 88,
    label: "Drivers",
    color: "var(--c-auth)"
  }];
  const points = lang === "en" ? KEY_EN : KEY_UZ;
  return /*#__PURE__*/React.createElement("section", {
    id: "summary",
    style: {
      scrollMarginTop: 80,
      marginBottom: 56
    }
  }, /*#__PURE__*/React.createElement(H2, {
    num: "09",
    uz: "Xulosa va kalit tushunchalar",
    en: "Summary \xB7 key takeaways"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.2fr 1fr",
      gap: 28,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      padding: 0,
      margin: 0,
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, points.map((t, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: "flex",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 24,
      height: 24,
      borderRadius: "50%",
      background: "var(--accent)",
      color: "#04060d",
      display: "grid",
      placeItems: "center",
      flexShrink: 0,
      fontFamily: "var(--font-mono)",
      fontWeight: 700,
      fontSize: 11
    }
  }, i + 1), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: "var(--text-0)"
    }
  }, t))))), /*#__PURE__*/React.createElement(MindMap, {
    nodes: nodes
  })));
}
const KEY_UZ = ["OS — ilovalar va apparat o'rtasidagi yagona vositachi. Hammasi shu yerdan o'tadi.", "Ring 3 (user) va Ring 0 (kernel) — protsessor darajasidagi qat'iy chegaralar.", "Process = mulk + xavfsizlik + manzil maydoni. Thread = CPU'da ishlaydigan birlik.", "ntoskrnl.exe ichida microkernel (mexanizm) va executive (siyosat) yashaydi.", "Win32 API → ntdll → syscall → executive — har qanday imtiyozli amal shu yo'l.", "Boot ketma-ketligi: POST → bootloader → kernel → smss → wininit → logon.", "Drayver = ring 0'da ishlovchi kod. Imzolanmagan = qizil bayroq."];
const KEY_EN = ["The OS is the single mediator between apps and hardware. Everything passes through it.", "Ring 3 (user) and Ring 0 (kernel) are hard boundaries enforced by the silicon.", "Process = ownership + security + address space. Thread = the unit the CPU runs.", "ntoskrnl.exe holds both the microkernel (mechanism) and executive (policy).", "Win32 API → ntdll → syscall → executive — every privileged action follows this path.", "Boot sequence: POST → bootloader → kernel → smss → wininit → logon.", "A driver is code that runs in ring 0. An unsigned one is a red flag."];
function MindMap({
  nodes
}) {
  const main = nodes.find(n => n.main);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: "1",
      maxWidth: 460,
      position: "relative",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 100 100",
    style: {
      width: "100%",
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("filter", {
    id: "mm-glow",
    x: "-50%",
    y: "-50%",
    width: "200%",
    height: "200%"
  }, /*#__PURE__*/React.createElement("feGaussianBlur", {
    stdDeviation: "0.6"
  }))), nodes.filter(n => !n.main).map((n, i) => /*#__PURE__*/React.createElement("line", {
    key: i,
    x1: main.x,
    y1: main.y,
    x2: n.x,
    y2: n.y,
    stroke: n.color,
    strokeOpacity: "0.35",
    strokeWidth: "0.4"
  })), nodes.map((n, i) => /*#__PURE__*/React.createElement("g", {
    key: i
  }, /*#__PURE__*/React.createElement("circle", {
    cx: n.x,
    cy: n.y,
    r: n.main ? 9 : 5,
    fill: n.main ? n.color : n.color + "22",
    stroke: n.color,
    strokeWidth: "0.5",
    filter: n.main ? "url(#mm-glow)" : ""
  }), /*#__PURE__*/React.createElement("text", {
    x: n.x,
    y: n.y + (n.main ? 0.7 : -7.5),
    fill: n.main ? "#04060d" : n.color,
    fontSize: n.main ? "2.5" : "2.2",
    fontFamily: "var(--font-mono)",
    fontWeight: "600",
    textAnchor: "middle",
    dominantBaseline: "middle"
  }, n.label)))));
}

// ─────────────────────────────────────────────────────────────
function LessonNextNav({
  setRoute,
  onQuizStart,
  lessonNum
}) {
  const lang = useLang();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 60,
      paddingTop: 32,
      borderTop: "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr auto 1fr",
      gap: 16,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: () => setRoute({
      name: "section",
      section: 1
    }),
    style: {
      justifySelf: "start"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-left",
    size: 14
  }), " ", lang === "en" ? "Section overview" : "Bo'limga qaytish"), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "// ", lang === "en" ? "LESSON_COMPLETE" : "DARS_TUGADI"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--text-2)",
      fontSize: 12,
      marginTop: 4
    }
  }, lang === "en" ? "Pass the quiz to unlock the next lesson" : "Keyingi darsga o'tish uchun testni topshiring")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: onQuizStart,
    style: {
      justifySelf: "end"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "target",
    size: 14
  }), " ", lang === "en" ? "Start the quiz" : "Testni boshlash", " ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 14
  }))));
}

// ─────────────────────────────────────────────────────────────
// L02: Kernel nima?
// ─────────────────────────────────────────────────────────────
function SectionKernelWhat() {
  const lang = useLang();
  return /*#__PURE__*/React.createElement("section", {
    id: "kernel-what",
    style: {
      scrollMarginTop: 80,
      marginBottom: 56
    }
  }, /*#__PURE__*/React.createElement(H2, {
    num: "01",
    uz: "Kernel nima?",
    en: "What is the kernel?"
  }), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "The ", /*#__PURE__*/React.createElement(Term, null, "kernel"), " is the innermost core of the operating system \u2014 the one and only piece of software that has complete, unrestricted access to all hardware and memory. Every application, every service, every driver must ultimately go through the kernel to accomplish anything real. While your browser runs in a sandboxed ", /*#__PURE__*/React.createElement(Em, null, "user space"), " where it cannot touch hardware directly, the kernel lives in a completely separate, privileged area called ", /*#__PURE__*/React.createElement(Em, null, "kernel space"), ", operating in ring 0 with no restrictions whatsoever.") : /*#__PURE__*/React.createElement(React.Fragment, null, "\xAB", /*#__PURE__*/React.createElement(Term, null, "Kernel"), "\xBB \u2014 operatsion tizimning eng ichki yadrosi. Bu barcha hardware va xotiraga to'liq, cheklovsiz kirishga ega bo'lgan yagona dastur. Har bir ilova, har bir xizmat, har bir drayver haqiqiy biror narsani bajarish uchun oxir-oqibat kernel orqali o'tishi kerak. Brauzeringiz hardware ga to'g'ridan-to'g'ri tegolmaydigan sandbox'lashtirilgan ", /*#__PURE__*/React.createElement(Em, null, "user space"), "'da ishlaydi; kernel esa butunlay boshqa, imtiyozli zonada \u2014 ", /*#__PURE__*/React.createElement(Em, null, "kernel space"), "'da, ring 0'da hech qanday cheklovsiz ishlaydi.")), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "In Windows, the kernel lives inside a single executable: ", /*#__PURE__*/React.createElement("code", null, "ntoskrnl.exe"), " (NT OS Kernel Executable), located at ", /*#__PURE__*/React.createElement("code", null, "C:\\Windows\\System32\\ntoskrnl.exe"), ". This ~10\u201315 MB file is signed by Microsoft \u2014 any byte-level modification causes Windows to refuse to boot entirely. At system startup, the bootloader (", /*#__PURE__*/React.createElement("code", null, "winload.efi"), ") maps this file into physical RAM, verifies its signature, then hands control to it. From that moment, the kernel owns the machine.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Windows'da kernel bitta bajariladigan faylda joylashgan: ", /*#__PURE__*/React.createElement("code", null, "C:\\Windows\\System32\\ntoskrnl.exe"), " (NT OS Kernel Executable). Bu ~10\u201315 MB li fayl Microsoft tomonidan imzolangan \u2014 bitta baytni o'zgartirish Windows'ning butunlay yuklashdan bosh tortishiga olib keladi. Tizim ishga tushganda, bootloader (", /*#__PURE__*/React.createElement("code", null, "winload.efi"), ") bu faylni fizik RAM ga ko'chiradi, imzosini tekshiradi va boshqaruvni unga topshiradi. O'sha paytdan boshlab kernel mashinaga egalik qiladi.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: 12,
      marginTop: 24
    }
  }, (lang === "en" ? [{
    icon: "cpu",
    color: "var(--c-system)",
    title: "CPU scheduling",
    desc: "The kernel decides which thread runs next, on which CPU core, for how long. Without this, multiple programs could not run concurrently. The scheduler runs hundreds of times per second."
  }, {
    icon: "database",
    color: "var(--accent)",
    title: "Memory management",
    desc: "Every process gets its own virtual address space (0–128 TB in 64-bit Windows). The kernel maps virtual addresses to physical RAM pages and prevents any process from accessing another's memory."
  }, {
    icon: "shield",
    color: "var(--c-auth)",
    title: "Security policy enforcement",
    desc: "Before any file, registry key, or process object is accessed, the kernel's Security Reference Monitor checks the caller's access token against the object's ACL. No exception, ever."
  }, {
    icon: "layers",
    color: "var(--c-user)",
    title: "I/O and device management",
    desc: "The kernel routes every I/O request (disk read, network send, USB write) through a stack of drivers via IRP (I/O Request Packets). Hardware never talks directly to user space."
  }, {
    icon: "lock",
    color: "var(--c-warn)",
    title: "Privilege enforcement",
    desc: "The kernel maintains the ring 0 / ring 3 boundary. All privilege checks happen here. This is the single point of control that makes the OS trustworthy."
  }, {
    icon: "graph",
    color: "var(--c-attack)",
    title: "System call gateway",
    desc: "Every privileged action from user space (open file, allocate memory, create thread) arrives at the kernel through the SYSCALL instruction. The kernel validates, executes, and returns the result."
  }] : [{
    icon: "cpu",
    color: "var(--c-system)",
    title: "CPU rejalashtirish",
    desc: "Kernel qaysi thread keyingi navbatda, qaysi CPU yadroda, qancha vaqt ishlashini hal qiladi. Bu bo'lmasa, bir nechta dastur bir vaqtda ishlay olmas edi. Rejalashtirgich sekundiga yuzlab marta ishlaydi."
  }, {
    icon: "database",
    color: "var(--accent)",
    title: "Xotirani boshqarish",
    desc: "Har bir jarayon o'z virtual manzil maydonini oladi (64-bitli Windows'da 0–128 TB). Kernel virtual manzillarni fizik RAM sahifalariga xaritalaydi va har bir jarayonning boshqasining xotirasiga kirishiga yo'l qo'ymaydi."
  }, {
    icon: "shield",
    color: "var(--c-auth)",
    title: "Xavfsizlik siyosatini ta'minlash",
    desc: "Har bir fayl, registry kaliti yoki jarayon ob'ektiga kirishdan oldin kernelning Xavfsizlik Mos Yozuvlar Moniteri chaqiruvchining kirish tokenini ob'ektning ACL'i bilan solishtiradi. Hech qachon istisno yo'q."
  }, {
    icon: "layers",
    color: "var(--c-user)",
    title: "I/O va qurilmalarni boshqarish",
    desc: "Kernel har bir I/O so'rovini (disk o'qish, tarmoq yuborish, USB yozish) IRP (I/O So'rov Paketlari) orqali drayverlar steki orqali yo'naltiradi. Hardware hech qachon user space bilan to'g'ridan-to'g'ri gaplashmaydi."
  }, {
    icon: "lock",
    color: "var(--c-warn)",
    title: "Imtiyozni ta'minlash",
    desc: "Kernel ring 0 / ring 3 chegarasini saqlaydi. Barcha imtiyoz tekshiruvlari shu yerda bo'ladi. Bu OT'ni ishonchli qiladigan yagona nazorat nuqtasi."
  }, {
    icon: "graph",
    color: "var(--c-attack)",
    title: "Tizim chaqiruvi shlyuzi",
    desc: "User space'dan kelgan har bir imtiyozli amal (fayl ochish, xotira ajratish, thread yaratish) SYSCALL buyrug'i orqali kernelga yetib keladi. Kernel tekshiradi, bajaradi va natijani qaytaradi."
  }]).map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "glass",
    style: {
      padding: 18,
      borderLeft: `3px solid ${c.color}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      alignItems: "center",
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: c.color
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: c.icon,
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 15,
      fontWeight: 600
    }
  }, c.title)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: "var(--text-1)",
      lineHeight: 1.6
    }
  }, c.desc)))), /*#__PURE__*/React.createElement("h3", {
    style: {
      ...subhead,
      marginTop: 36
    }
  }, lang === "en" ? "1.1 — Monolithic vs Microkernel vs Hybrid" : "1.1 — Monolitik vs Mikrokernel vs Gibrid"), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "There are three main architectural philosophies for kernels. Windows uses a ", /*#__PURE__*/React.createElement(Em, null, "hybrid"), " approach:") : /*#__PURE__*/React.createElement(React.Fragment, null, "Kernellar uchun uchta asosiy arxitektura falsafasi mavjud. Windows ", /*#__PURE__*/React.createElement(Em, null, "gibrid"), " yondashuvdan foydalanadi:")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
      marginTop: 12
    }
  }, (lang === "en" ? [{
    title: "Monolithic kernel",
    color: "var(--c-user)",
    desc: "Everything runs in ring 0: scheduling, memory, drivers, file systems, networking. Fast, but a bug anywhere crashes the entire OS. Linux is monolithic."
  }, {
    title: "Microkernel",
    color: "var(--c-system)",
    desc: "Only the absolute minimum runs in ring 0 (scheduling, IPC). Drivers, file systems run as user-space servers. Secure, but slower due to message passing. Used in embedded systems (QNX, MINIX)."
  }, {
    title: "Hybrid kernel (Windows)",
    color: "var(--accent)",
    desc: "Core kernel + executive in ring 0 for speed. Drivers also in ring 0. But the design is modular like a microkernel — each manager (Process, Memory, I/O) is separate. Best of both worlds, but drivers remain a risk."
  }] : [{
    title: "Monolitik kernel",
    color: "var(--c-user)",
    desc: "Hamma narsa ring 0'da ishlaydi: rejalashtirish, xotira, drayverlar, fayl tizimlari, tarmoq. Tez, lekin istalgan joyda xato butun OS'ni yiqitadi. Linux monolitikdir."
  }, {
    title: "Mikrokernel",
    color: "var(--c-system)",
    desc: "Faqat mutlaq minimum ring 0'da ishlaydi (rejalashtirish, IPC). Drayverlar, fayl tizimlari user-space serverlari sifatida ishlaydi. Xavfsiz, lekin xabar almashish tufayli sekinroq. O'rnatilgan tizimlarda ishlatiladi (QNX, MINIX)."
  }, {
    title: "Gibrid kernel (Windows)",
    color: "var(--accent)",
    desc: "Tezlik uchun asosiy kernel + executive ring 0'da. Drayverlar ham ring 0'da. Lekin dizayn mikrokernel kabi modulli — har bir menejer (Jarayon, Xotira, I/O) alohida. Ikkalasining eng yaxshi tomoni, ammo drayverlar xavf bo'lib qoladi."
  }]).map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: "14px 18px",
      background: "var(--bg-2)",
      border: `1px solid ${r.color}33`,
      borderLeft: `3px solid ${r.color}`,
      borderRadius: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 14,
      fontWeight: 600,
      color: r.color,
      marginBottom: 5
    }
  }, r.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--text-1)",
      lineHeight: 1.6
    }
  }, r.desc)))), /*#__PURE__*/React.createElement(Callout, {
    color: "var(--accent)",
    icon: "info",
    titleUz: "ntoskrnl.exe haqida texnik faktlar",
    titleEn: "Technical facts about ntoskrnl.exe"
  }, lang === "en" ? /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      paddingLeft: 18,
      lineHeight: 1.8,
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("li", null, "Located at ", /*#__PURE__*/React.createElement("code", null, "C:\\Windows\\System32\\ntoskrnl.exe"), " (uniprocessor) or ", /*#__PURE__*/React.createElement("code", null, "ntkrnlmp.exe"), " (multiprocessor \u2014 Windows merges them on modern builds)"), /*#__PURE__*/React.createElement("li", null, "Size: ~10\u201320 MB depending on Windows version and debug symbols"), /*#__PURE__*/React.createElement("li", null, "Exports ~2,600 symbols (functions/variables) that drivers can use"), /*#__PURE__*/React.createElement("li", null, "Signed with Microsoft's kernel certificate \u2014 SHA-256 hash verified by Secure Boot chain"), /*#__PURE__*/React.createElement("li", null, "Contains the SSDT (System Service Descriptor Table) with all ~450 syscall numbers"), /*#__PURE__*/React.createElement("li", null, "Loaded at a randomized base address (KASLR \u2014 Kernel Address Space Layout Randomization) since Windows Vista")) : /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      paddingLeft: 18,
      lineHeight: 1.8,
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("code", null, "C:\\Windows\\System32\\ntoskrnl.exe"), " (yagona protsessor) yoki ", /*#__PURE__*/React.createElement("code", null, "ntkrnlmp.exe"), " (ko'p protsessorli \u2014 zamonaviy Windows versiyalarida birlashtirilgan)"), /*#__PURE__*/React.createElement("li", null, "Hajmi: Windows versiyasiga qarab ~10\u201320 MB (debug ramzlari bilan)"), /*#__PURE__*/React.createElement("li", null, "Drayverlar foydalana oladigan ~2,600 ta simvol (funksiya/o'zgaruvchi) eksport qiladi"), /*#__PURE__*/React.createElement("li", null, "Microsoft'ning kernel sertifikati bilan imzolangan \u2014 SHA-256 hash'i Secure Boot zanjiri tomonidan tekshiriladi"), /*#__PURE__*/React.createElement("li", null, "Barcha ~450 ta syscall raqamini o'z ichiga olgan SSDT (Tizim Xizmat Tasviri Jadvali) ni o'z ichiga oladi"), /*#__PURE__*/React.createElement("li", null, "Windows Vista'dan beri tasodifiy asosiy manzilda yuklanadi (KASLR \u2014 Kernel Manzil Maydoni Tartibini Tasodiflashtirish)"))));
}
function SectionKernelInside() {
  const lang = useLang();
  return /*#__PURE__*/React.createElement("section", {
    id: "kernel-inside",
    style: {
      scrollMarginTop: 80,
      marginBottom: 56
    }
  }, /*#__PURE__*/React.createElement(H2, {
    num: "02",
    uz: "ntoskrnl.exe ichida nima bor?",
    en: "What's inside ntoskrnl.exe?"
  }), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "Despite being one file, ", /*#__PURE__*/React.createElement("code", null, "ntoskrnl.exe"), " contains two conceptually separate layers: the ", /*#__PURE__*/React.createElement(Term, null, "Microkernel"), " (low-level engine) and the ", /*#__PURE__*/React.createElement(Term, null, "Executive"), " (high-level policy). The ", /*#__PURE__*/React.createElement(Term, null, "HAL"), " (", /*#__PURE__*/React.createElement("code", null, "hal.dll"), ") is a separate file but always loaded alongside the kernel. Together they form the three-tier foundation every Windows system builds upon.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Bitta fayl bo'lishiga qaramay, ", /*#__PURE__*/React.createElement("code", null, "ntoskrnl.exe"), " ikki kontseptual alohida qatlamni o'z ichiga oladi: ", /*#__PURE__*/React.createElement(Term, null, "Microkernel"), " (past darajali dvigatel) va ", /*#__PURE__*/React.createElement(Term, null, "Executive"), " (yuqori darajali siyosat). ", /*#__PURE__*/React.createElement(Term, null, "HAL"), " (", /*#__PURE__*/React.createElement("code", null, "hal.dll"), ") alohida fayl, lekin har doim kernel bilan birga yuklanadi. Ular birgalikda har bir Windows tizimi quriladigan uch qatlamli poydevorni tashkil qiladi.")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 28,
      padding: "22px 26px",
      background: "rgba(77,139,255,0.06)",
      border: "1px solid rgba(77,139,255,0.28)",
      borderRadius: 14,
      borderLeft: "4px solid var(--c-system)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 9,
      background: "rgba(77,139,255,0.15)",
      border: "1px solid rgba(77,139,255,0.4)",
      color: "var(--c-system)",
      display: "grid",
      placeItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "cpu",
    size: 18
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 19,
      fontWeight: 700,
      color: "var(--c-system)"
    }
  }, "Microkernel"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-3)",
      fontFamily: "var(--font-mono)"
    }
  }, "ring 0 \xB7 innermost layer \xB7 minimal by design"))), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "The Microkernel is the absolute innermost engine of Windows. Its job is limited to three things by design \u2014 keeping it small reduces the attack surface and makes it easier to verify correctness:") : /*#__PURE__*/React.createElement(React.Fragment, null, "Microkernel Windows'ning mutlaq eng ichki dvigatelidir. Uning ishi ataylab uchta narsa bilan cheklangan \u2014 uni kichik saqlash hujum yuzasini kamaytiradi va to'g'riligini tekshirishni osonlashtiradi:")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
      marginTop: 8
    }
  }, (lang === "en" ? [{
    icon: "clock",
    title: "Thread scheduling",
    desc: "Decides which thread runs on which CPU core, for how long (quantum). Uses priority levels 0–31. Real-time threads (16–31) always preempt normal threads (0–15). The scheduler runs via a timer interrupt (typically every 15.6ms on desktop, 1ms on server)."
  }, {
    icon: "zap",
    title: "Interrupt and exception handling",
    desc: "Manages the IDT (Interrupt Descriptor Table) — a 256-entry table mapping each hardware signal and CPU exception to a handler function. When your keyboard sends a signal, the CPU looks up IDT entry for IRQ1 and jumps to the keyboard interrupt handler."
  }, {
    icon: "layers",
    title: "CPU synchronization (multiprocessor)",
    desc: "On a multi-core machine, multiple CPUs share kernel data structures. The microkernel uses spinlocks and dispatcher locks to prevent simultaneous access from corrupting data. Getting this wrong causes subtle, hard-to-reproduce corruption bugs."
  }] : [{
    icon: "clock",
    title: "Thread'larni rejalashtirish",
    desc: "Qaysi thread qaysi CPU yadroda, qancha vaqt (kvant) ishlashini hal qiladi. 0–31 prioritet darajalarini ishlatadi. Real vaqtli thread'lar (16–31) har doim oddiy thread'larni (0–15) almashtiradi. Rejalashtirgich taymer uzilishi orqali ishlaydi (odatda ish stolida har 15.6 ms, serverda 1 ms)."
  }, {
    icon: "zap",
    title: "Uzilish va istisno boshqarish",
    desc: "IDT (Uzilish Tasviri Jadvali) ni boshqaradi — har bir hardware signali va CPU istisnosi ishlov beruvchi funksiyaga xaritalangan 256 ta yozuvli jadval. Klaviaturangiz signal yuborganda, CPU IRQ1 uchun IDT yozuvini qidirib topadi va klaviatura uzilish ishlovchisiga sakraydi."
  }, {
    icon: "layers",
    title: "CPU sinxronizatsiyasi (ko'p protsessorli)",
    desc: "Ko'p yadroli mashinada bir nechta CPU kernel ma'lumotlar tuzilmalarini baham ko'radi. Microkernel bir vaqtning o'zida kirishning ma'lumotlarni buzishiga yo'l qo'ymaslik uchun spinlock'lar va dispatcher lock'lardan foydalanadi. Bu noto'g'ri qilinsa, takrorlanmaydigan xira buzilish xatolariga olib keladi."
  }]).map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 12,
      padding: "12px 14px",
      background: "rgba(77,139,255,0.04)",
      borderRadius: 8,
      border: "1px solid rgba(77,139,255,0.15)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--c-system)",
      flexShrink: 0,
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: s.icon,
    size: 16
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11.5,
      color: "var(--c-system)",
      fontWeight: 600,
      marginBottom: 4
    }
  }, s.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: "var(--text-1)",
      lineHeight: 1.6
    }
  }, s.desc)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      padding: "22px 26px",
      background: "rgba(0,255,156,0.04)",
      border: "1px solid var(--accent-border)",
      borderRadius: 14,
      borderLeft: "4px solid var(--accent)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 9,
      background: "var(--accent-soft)",
      border: "1px solid var(--accent-border)",
      color: "var(--accent)",
      display: "grid",
      placeItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "layers",
    size: 18
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 19,
      fontWeight: 700,
      color: "var(--accent)"
    }
  }, "Executive"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-3)",
      fontFamily: "var(--font-mono)"
    }
  }, "ring 0 \xB7 policy layer \xB7 6 major managers"))), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "The Executive sits above the microkernel and implements all OS ", /*#__PURE__*/React.createElement(Em, null, "policies"), " \u2014 the high-level decisions about what a process is, how memory is shared, who can open a file, and how I/O flows through the system. It is split into six major managers, each responsible for a specific domain:") : /*#__PURE__*/React.createElement(React.Fragment, null, "Executive mikrokernelning ustida turadi va barcha OS ", /*#__PURE__*/React.createElement(Em, null, "siyosatlarini"), " amalga oshiradi \u2014 jarayon nima ekanligi, xotira qanday bo'lishilishi, kim fayl ochishi mumkinligi va I/O tizim orqali qanday oqishi haqidagi yuqori darajali qarorlar. U har biri o'z sohasiga mas'ul bo'lgan oltita asosiy menejerga bo'linadi:")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12,
      marginTop: 12
    }
  }, (lang === "en" ? [{
    name: "Process Manager",
    api: "NtCreateProcess, NtTerminateProcess, NtOpenProcess",
    color: "var(--c-user)",
    desc: "Creates and destroys processes and threads. Allocates the EPROCESS and ETHREAD kernel structures for each. Maintains the process list visible in Task Manager. Every CreateProcess() call you make in user space ends up here after passing through kernel32 → ntdll → SYSCALL."
  }, {
    name: "Memory Manager",
    api: "NtAllocateVirtualMemory, NtReadVirtualMemory, NtMapViewOfSection",
    color: "var(--accent)",
    desc: "Manages virtual memory for every process (separate 128 TB virtual address space per process on 64-bit). Handles page faults (when a virtual page is not in RAM, it loads from disk). Manages the paging file (pagefile.sys). Implements ASLR (Address Space Layout Randomization) to randomize DLL base addresses."
  }, {
    name: "I/O Manager",
    api: "NtReadFile, NtWriteFile, NtDeviceIoControlFile",
    color: "var(--c-system)",
    desc: "Routes every I/O request through a stack of drivers using IRP (I/O Request Packets). When you read a file: I/O Manager creates an IRP, passes it through the file system filter stack (antivirus hooks here), then to the NTFS driver, then to the disk driver, then to the hardware. Each driver in the stack can inspect, modify or complete the IRP."
  }, {
    name: "Object Manager",
    api: "NtCreateFile, NtOpenKey, NtDuplicateObject",
    color: "var(--c-auth)",
    desc: "Every kernel resource (file, registry key, event, semaphore, thread, process) is a named kernel object. The Object Manager tracks them with reference counts — when count hits 0, the object is freed. It also manages the handle table: when you call CreateFile(), you get back an integer handle that maps to an internal object pointer."
  }, {
    name: "Security Reference Monitor (SRM)",
    api: "NtAccessCheck, NtSetSecurityObject",
    color: "var(--c-attack)",
    desc: "Before any object access is granted, the SRM compares the caller's Access Token (which SIDs and privileges it has) against the object's Security Descriptor (which ACEs allow/deny which SIDs). This check happens on every NtOpenFile, NtOpenProcess, NtOpenKey — literally every kernel object access. You cannot bypass this without being in ring 0."
  }, {
    name: "Cache Manager",
    api: "(internal, no direct syscall)",
    color: "var(--c-warn)",
    desc: "Caches recently accessed file data in RAM to avoid redundant disk reads. Works with the Memory Manager's mapped file system. When you read the same file twice, the second read usually never touches the disk — it comes from the cache. The cache also implements write-back buffering: writes are batched and flushed periodically."
  }] : [{
    name: "Jarayon menejeri",
    api: "NtCreateProcess, NtTerminateProcess, NtOpenProcess",
    color: "var(--c-user)",
    desc: "Jarayonlar va thread'larni yaratadi va yo'q qiladi. Har biri uchun EPROCESS va ETHREAD kernel tuzilmalarini ajratadi. Task Manager'da ko'rinadigan jarayon ro'yxatini saqlaydi. User space'da bajaradigan har bir CreateProcess() chaqiruvi kernel32 → ntdll → SYSCALL orqali o'tgandan so'ng shu yerga yetib keladi."
  }, {
    name: "Xotira menejeri",
    api: "NtAllocateVirtualMemory, NtReadVirtualMemory, NtMapViewOfSection",
    color: "var(--accent)",
    desc: "Har bir jarayon uchun virtual xotirani boshqaradi (64-bitli tizimda jarayon boshiga alohida 128 TB virtual manzil maydoni). Sahifa xatolarini boshqaradi (virtual sahifa RAM'da bo'lmasa, diskdan yuklaydi). Sahifash faylini boshqaradi (pagefile.sys). DLL asosiy manzillarini tasodiflashtirish uchun ASLR ni amalga oshiradi."
  }, {
    name: "I/O menejeri",
    api: "NtReadFile, NtWriteFile, NtDeviceIoControlFile",
    color: "var(--c-system)",
    desc: "Har bir I/O so'rovini IRP (I/O So'rov Paketlari) yordamida drayverlar steki orqali yo'naltiradi. Fayl o'qiganda: I/O menejeri IRP yaratadi, uni fayl tizimi filtr stekidan (antivirus bu yerda ulanadi), keyin NTFS drayveri, keyin disk drayveri, keyin hardware'ga uzatadi. Stakdagi har bir drayver IRP ni ko'rishi, o'zgartirishi yoki tugatishi mumkin."
  }, {
    name: "Ob'ekt menejeri",
    api: "NtCreateFile, NtOpenKey, NtDuplicateObject",
    color: "var(--c-auth)",
    desc: "Har bir kernel resursi (fayl, registry kaliti, hodisa, semafor, thread, jarayon) nomlangan kernel ob'ektidir. Ob'ekt menejeri ularni havolalar soni bilan kuzatadi — son 0 ga yetganda ob'ekt bo'shatiladi. U handle jadvalini ham boshqaradi: CreateFile() ni chaqirganizda, ichki ob'ekt ko'rsatkichiga xaritalangan butun son handle qaytariladi."
  }, {
    name: "Xavfsizlik Mos Yozuvlar Moniteri (SRM)",
    api: "NtAccessCheck, NtSetSecurityObject",
    color: "var(--c-attack)",
    desc: "Har qanday ob'ektga kirish berilishidan oldin, SRM chaqiruvchining Kirish Tokenini (qaysi SID va imtiyozlarga ega) ob'ektning Xavfsizlik Tavsifi bilan (qaysi ACE qaysi SID ga ruxsat beradi/rad etadi) solishtiradi. Bu tekshiruv har bir NtOpenFile, NtOpenProcess, NtOpenKey — har bir kernel ob'ektiga kirishda amalga oshiriladi. Ring 0'da bo'lmasdan buni chetlab o'tib bo'lmaydi."
  }, {
    name: "Kesh menejeri",
    api: "(ichki, to'g'ridan-to'g'ri syscall yo'q)",
    color: "var(--c-warn)",
    desc: "Keraksiz disk o'qishlaridan qochish uchun yaqinda kirilgan fayl ma'lumotlarini RAM'da keshlaydi. Xotira menejerining xaritalangan fayl tizimi bilan ishlaydi. Bir faylni ikki marta o'qisangiz, ikkinchi o'qish odatda diskka tegmaydi — keshdan keladi. Kesh shuningdek yozishni buferlashtiradi: yozishlar to'planadi va vaqti-vaqti bilan yuboriladi."
  }]).map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: "14px 18px",
      background: "rgba(0,255,156,0.03)",
      border: `1px solid ${m.color}22`,
      borderLeft: `3px solid ${m.color}`,
      borderRadius: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 14.5,
      fontWeight: 700,
      color: m.color
    }
  }, m.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      color: "var(--text-3)",
      letterSpacing: 0.05
    }
  }, m.api)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: "var(--text-1)",
      lineHeight: 1.65
    }
  }, m.desc))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      padding: "22px 26px",
      background: "rgba(184,140,255,0.05)",
      border: "1px solid rgba(184,140,255,0.22)",
      borderRadius: 14,
      borderLeft: "4px solid var(--c-auth)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 9,
      background: "rgba(184,140,255,0.12)",
      border: "1px solid rgba(184,140,255,0.3)",
      color: "var(--c-auth)",
      display: "grid",
      placeItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield",
    size: 18
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 19,
      fontWeight: 700,
      color: "var(--c-auth)"
    }
  }, "HAL \u2014 Hardware Abstraction Layer"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-3)",
      fontFamily: "var(--font-mono)"
    }
  }, "hal.dll \xB7 loaded before ntoskrnl \xB7 ring 0"))), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "The HAL (", /*#__PURE__*/React.createElement("code", null, "hal.dll"), ") is a thin wrapper between the kernel and the actual hardware. Without it, Windows would need completely different code for every motherboard chipset \u2014 an impossible maintenance nightmare. HAL exposes a ", /*#__PURE__*/React.createElement(Em, null, "standardized interface"), ": the kernel calls ", /*#__PURE__*/React.createElement("code", null, "HalGetBusData()"), " or ", /*#__PURE__*/React.createElement("code", null, "HalSetBusData()"), " without knowing anything about the physical bus topology.") : /*#__PURE__*/React.createElement(React.Fragment, null, "HAL (", /*#__PURE__*/React.createElement("code", null, "hal.dll"), ") \u2014 kernel va haqiqiy hardware o'rtasidagi yupqa wrapper. U bo'lmasa, Windows har bir ona plata chipset uchun butunlay boshqa kod talab qilardi \u2014 bu imkonsiz texnik xizmat ko'rsatish dahshati. HAL ", /*#__PURE__*/React.createElement(Em, null, "standartlashtirilgan interfeys"), " taqdim etadi: kernel fizik avtobus topologiyasini bilmasdan ", /*#__PURE__*/React.createElement("code", null, "HalGetBusData()"), " yoki ", /*#__PURE__*/React.createElement("code", null, "HalSetBusData()"), " ni chaqiradi.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 10,
      marginTop: 12
    }
  }, (lang === "en" ? [["Interrupt routing", "Maps hardware IRQ lines to CPU interrupt vectors. Different chipsets wire IRQs differently — HAL hides this."], ["Timer calibration", "Reads the hardware clock (HPET, APIC timer, TSC) and provides a unified time source to the kernel scheduler."], ["Processor initialization", "Boots secondary CPU cores (APs) in SMP systems. Configures APIC and local interrupt controllers per core."], ["DMA channel management", "Allocates DMA channels for drivers so they can transfer data directly to/from RAM without CPU involvement."]] : [["Uzilishlarni yo'naltirish", "Hardware IRQ liniyalarini CPU uzilish vektorlariga xaritalaydi. Har xil chipsetslar IRQ larni boshqacha ulaydi — HAL buni yashiradi."], ["Taymer kalibrovkasi", "Hardware soatini o'qiydi (HPET, APIC taymer, TSC) va kernel rejalashtirgichiga yagona vaqt manbaini ta'minlaydi."], ["Protsessorni ishga tushirish", "SMP tizimlarida ikkinchi darajali CPU yadrolarini (AP) ishga tushiradi. Har bir yadro uchun APIC va lokal uzilish kontrollerlarini sozlaydi."], ["DMA kanali boshqaruvi", "CPU ishtirokisiz to'g'ridan-to'g'ri RAM ga/dan ma'lumot uzatish uchun drayverlar uchun DMA kanallarini ajratadi."]]).map(([title, desc], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: "10px 14px",
      background: "rgba(184,140,255,0.04)",
      border: "1px solid rgba(184,140,255,0.15)",
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      color: "var(--c-auth)",
      marginBottom: 4
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--text-1)",
      lineHeight: 1.5
    }
  }, desc)))), /*#__PURE__*/React.createElement(Callout, {
    color: "var(--c-auth)",
    icon: "info",
    titleUz: "Nima uchun Windows turli PC'larda ishlaydi?",
    titleEn: "Why Windows runs on thousands of different PC models"
  }, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "The same ", /*#__PURE__*/React.createElement("code", null, "ntoskrnl.exe"), " binary ships on every Windows PC. HAL handles all hardware differences transparently. When you install Windows on a laptop vs a server with 64 cores and NUMA memory, Windows loads a different ", /*#__PURE__*/React.createElement("code", null, "hal.dll"), " \u2014 the kernel code itself does not change. This is one of the key architectural decisions made by Dave Cutler's team in 1988 that still pays dividends today.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Bir xil ", /*#__PURE__*/React.createElement("code", null, "ntoskrnl.exe"), " ikkiligi har bir Windows PC ga yetkaziladi. HAL barcha hardware farqlarini shaffof tarzda boshqaradi. Windows'ni noutbukka yoki 64 yadroli va NUMA xotirali serverga o'rnatganingizda, Windows boshqa ", /*#__PURE__*/React.createElement("code", null, "hal.dll"), " yuklaydi \u2014 kernelning o'zi o'zgarmaydi. Bu 1988 yilda Dave Cutler jamoasi tomonidan qilingan va hali ham foyda keltirmoqda bo'lgan asosiy arxitektura qarorlaridan biridir."))));
}
function SectionKernelDrivers() {
  const lang = useLang();
  return /*#__PURE__*/React.createElement("section", {
    id: "kernel-drivers",
    style: {
      scrollMarginTop: 80,
      marginBottom: 56
    }
  }, /*#__PURE__*/React.createElement(H2, {
    num: "03",
    uz: "Drayverlar \u2014 Ring 0'dagi kod",
    en: "Drivers \u2014 code living in ring 0"
  }), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "A ", /*#__PURE__*/React.createElement(Term, null, "driver"), " is a kernel-mode module (.sys file) that tells Windows exactly how to communicate with a specific piece of hardware or provide a specific system service. Unlike regular applications, drivers run entirely in ", /*#__PURE__*/React.createElement(Em, null, "ring 0"), " \u2014 the same privilege level as ", /*#__PURE__*/React.createElement("code", null, "ntoskrnl.exe"), " itself. This gives them complete power over the machine, which is why even a minor bug in a driver can produce an instant BSOD, and why a malicious driver can do anything at all.") : /*#__PURE__*/React.createElement(React.Fragment, null, "\xAB", /*#__PURE__*/React.createElement(Term, null, "Drayver"), "\xBB \u2014 Windows'ga ma'lum bir hardware bilan qanday muloqot qilishni yoki ma'lum bir tizim xizmatini qanday ko'rsatishni aniq aytadigan kernel-mode modul (.sys fayl). Oddiy ilovalardan farqli o'laroq, drayverlar to'liq ", /*#__PURE__*/React.createElement(Em, null, "ring 0"), "'da \u2014 ", /*#__PURE__*/React.createElement("code", null, "ntoskrnl.exe"), " ning o'zi bilan bir xil imtiyoz darajasida \u2014 ishlaydi. Bu ularga mashina ustidan to'liq kuch beradi, shuning uchun drayverdagi kichik xato ham darhol BSOD ga olib kelishi va zararli drayver istalgan narsani qila olishi mumkin.")), /*#__PURE__*/React.createElement("h3", {
    style: {
      ...subhead,
      marginTop: 28
    }
  }, lang === "en" ? "3.1 — Driver types" : "3.1 — Drayver turlari"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 10,
      marginTop: 12
    }
  }, (lang === "en" ? [{
    title: "Kernel-Mode Driver (KMDF)",
    color: "var(--c-system)",
    desc: "Runs in ring 0. Has full hardware access. Used for all hardware drivers: disk, NIC, GPU, USB. The most powerful and most dangerous type. Example: ntfs.sys, tcpip.sys."
  }, {
    title: "User-Mode Driver (UMDF)",
    color: "var(--c-user)",
    desc: "Runs in ring 3. Talks to the kernel via a proxy driver. More stable — a crash kills only the driver process, not the OS. Used for USB devices, printers. Introduced in WDF (Windows Driver Framework)."
  }, {
    title: "Filter Driver",
    color: "var(--c-warn)",
    desc: "Sits in the driver stack above or below the main driver. Intercepts and can modify I/O requests. Antivirus file system mini-filters work this way — they see every file open/read/write before NTFS does."
  }] : [{
    title: "Kernel-Mode Drayveri (KMDF)",
    color: "var(--c-system)",
    desc: "Ring 0'da ishlaydi. To'liq hardware kirishiga ega. Barcha hardware drayverlari uchun ishlatiladi: disk, tarmoq kartasi, GPU, USB. Eng kuchli va eng xavfli tur. Misol: ntfs.sys, tcpip.sys."
  }, {
    title: "User-Mode Drayveri (UMDF)",
    color: "var(--c-user)",
    desc: "Ring 3'da ishlaydi. Proxy drayver orqali kernel bilan gaplashadi. Barqarorroq — xato OS ni emas, faqat drayver jarayonini o'ldiradi. USB qurilmalar, printerlar uchun ishlatiladi. WDF (Windows Driver Framework) da joriy etilgan."
  }, {
    title: "Filtr Drayveri",
    color: "var(--c-warn)",
    desc: "Drayver stekida asosiy drayverning ustida yoki ostida turadi. I/O so'rovlarini ushlab, o'zgartira oladi. Antivirus fayl tizimi mini-filtrlari shunday ishlaydi — ular NTFS gacha har bir fayl ochish/o'qish/yozishni ko'radi."
  }]).map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: "14px 16px",
      background: "var(--bg-2)",
      border: `1px solid ${d.color}33`,
      borderTop: `3px solid ${d.color}`,
      borderRadius: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 13.5,
      fontWeight: 700,
      color: d.color,
      marginBottom: 7
    }
  }, d.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: "var(--text-1)",
      lineHeight: 1.6
    }
  }, d.desc)))), /*#__PURE__*/React.createElement("h3", {
    style: {
      ...subhead,
      marginTop: 32
    }
  }, lang === "en" ? "3.2 — IRP: how the driver stack works" : "3.2 — IRP: drayver steki qanday ishlaydi"), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "Every I/O operation in Windows travels as an ", /*#__PURE__*/React.createElement(Term, null, "IRP (I/O Request Packet)"), " \u2014 a kernel data structure that describes the operation (read, write, IOCTL), the target, the buffer, and its status. The I/O Manager creates an IRP and passes it down through a ", /*#__PURE__*/React.createElement(Em, null, "driver stack"), " \u2014 a chain of drivers registered for that device. Each driver can complete the IRP, pass it further, or fail it.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Windows'dagi har bir I/O operatsiyasi ", /*#__PURE__*/React.createElement(Term, null, "IRP (I/O So'rov Paketi)"), " sifatida harakatlanadi \u2014 operatsiyani (o'qish, yozish, IOCTL), maqsadni, buferni va uning holatini tavsiflovchi kernel ma'lumotlar tuzilmasi. I/O menejeri IRP yaratadi va uni o'sha qurilma uchun ro'yxatdan o'tgan drayverlar zanjiri bo'lmish ", /*#__PURE__*/React.createElement(Em, null, "drayver steki"), " orqali pastga uzatadi. Har bir drayver IRP ni tugatishi, keyingiga uzatishi yoki muvaffaqiyatsiz yakunlashi mumkin.")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      padding: "18px 22px",
      background: "var(--bg-2)",
      border: "1px solid var(--border)",
      borderRadius: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 12
    }
  }, "// ", lang === "en" ? "DRIVER STACK FOR READING A FILE" : "FAYL O'QISH UCHUN DRAYVER STEKI"), [{
    label: lang === "en" ? "User app calls ReadFile()" : "Foydalanuvchi ilovasi ReadFile() ni chaqiradi",
    color: "var(--c-user)",
    ring: "ring 3"
  }, {
    label: lang === "en" ? "I/O Manager creates IRP, passes down" : "I/O menejeri IRP yaratadi, pastga uzatadi",
    color: "var(--c-system)",
    ring: "ring 0"
  }, {
    label: lang === "en" ? "File system filter (antivirus mini-filter) — inspects IRP" : "Fayl tizimi filtri (antivirus mini-filtri) — IRP ni tekshiradi",
    color: "var(--c-warn)",
    ring: "ring 0"
  }, {
    label: lang === "en" ? "NTFS driver — translates path to clusters" : "NTFS drayveri — yo'lni klasterlarga tarjima qiladi",
    color: "var(--accent)",
    ring: "ring 0"
  }, {
    label: lang === "en" ? "Disk class driver — translates clusters to LBA sectors" : "Disk sinf drayveri — klasterlarni LBA sektorlarga tarjima qiladi",
    color: "var(--accent)",
    ring: "ring 0"
  }, {
    label: lang === "en" ? "NVMe/AHCI port driver — sends command to hardware" : "NVMe/AHCI port drayveri — hardware'ga buyruq yuboradi",
    color: "var(--c-auth)",
    ring: "ring 0"
  }, {
    label: lang === "en" ? "SSD/HDD returns data — IRP travels back up" : "SSD/HDD ma'lumotlarni qaytaradi — IRP yuqoriga qaytadi",
    color: "var(--c-auth)",
    ring: "hw"
  }].map((row, i, arr) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 12,
      alignItems: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: 36,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: row.color,
      flexShrink: 0,
      marginTop: 6
    }
  }), i < arr.length - 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 2,
      flex: 1,
      background: `${row.color}44`,
      minHeight: 12
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: i < arr.length - 1 ? 12 : 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: "var(--text-0)"
    }
  }, row.label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9.5,
      fontFamily: "var(--font-mono)",
      color: row.color,
      background: row.color + "15",
      padding: "1px 6px",
      borderRadius: 4
    }
  }, row.ring)))))), /*#__PURE__*/React.createElement("h3", {
    style: {
      ...subhead,
      marginTop: 32
    }
  }, lang === "en" ? "3.3 — Signing, BYOVD and kernel security" : "3.3 — Imzolash, BYOVD va kernel xavfsizligi"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 14,
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 18px",
      background: "rgba(0,255,156,0.04)",
      border: "1px solid var(--accent-border)",
      borderRadius: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--accent)",
      marginBottom: 8,
      display: "flex",
      gap: 8,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 16
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 14
    }
  }, lang === "en" ? "Signed driver" : "Imzolangan drayver")), /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      paddingLeft: 18,
      fontSize: 12.5,
      color: "var(--text-1)",
      lineHeight: 1.75
    }
  }, (lang === "en" ? ["Signed with EV (Extended Validation) code signing cert", "Microsoft cross-signs it for kernel use (WHQL or attestation)", "Signature verified by CI.dll at load time", "Any modification → load refused → BSOD on attempt", "Extension: .sys · Lives in System32\\drivers\\"] : ["EV (Kengaytirilgan Tasdiqlash) kod imzolash sertifikati bilan imzolangan", "Microsoft uni kernel ishlatish uchun qayta imzolaydi (WHQL yoki tasdiqlov)", "Imzo yuklanish vaqtida CI.dll tomonidan tekshiriladi", "Har qanday o'zgartirish → yuklanishdan bosh tortish → urinishda BSOD", "Kengaytma: .sys · System32\\drivers\\ da joylashgan"]).map((t, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, t)))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 18px",
      background: "rgba(255,58,94,0.05)",
      border: "1px solid rgba(255,58,94,0.25)",
      borderRadius: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--c-attack)",
      marginBottom: 8,
      display: "flex",
      gap: 8,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "warning",
    size: 16
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 14
    }
  }, lang === "en" ? "BYOVD Attack" : "BYOVD Hujumi")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: "var(--text-1)",
      lineHeight: 1.65
    }
  }, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("strong", null, "Bring Your Own Vulnerable Driver:"), " Attacker uploads a ", /*#__PURE__*/React.createElement("em", null, "legitimate, signed"), " driver (e.g. old Gigabyte or ASUS firmware updater) that has a known memory corruption vulnerability. Because it's signed, Windows loads it. The attacker exploits the bug to write shellcode to an arbitrary kernel address \u2014 instant ring 0 code execution. Defence: ", /*#__PURE__*/React.createElement("code", null, "loldrivers.io"), " lists known vulnerable drivers. Block them via WDAC policy.") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("strong", null, "Bring Your Own Vulnerable Driver:"), " Hujumchi ma'lum xotira buzilish zaifligiga ega ", /*#__PURE__*/React.createElement("em", null, "qonuniy, imzolangan"), " drayverni (masalan, eski Gigabyte yoki ASUS firmware yangilagich) yuklaydi. U imzolanganligi sababli Windows uni yuklaydi. Hujumchi xatolikni ekspluatatsiya qilib, ixtiyoriy kernel manziliga shellcode yozadi \u2014 darhol ring 0 kod bajarish. Himoya: ", /*#__PURE__*/React.createElement("code", null, "loldrivers.io"), " ma'lum zaif drayverlar ro'yxatini e'lon qiladi. Ularni WDAC siyosati orqali bloklang.")))), /*#__PURE__*/React.createElement(Callout, {
    color: "var(--c-attack)",
    icon: "skull",
    titleUz: "Real dunyo misoli: BlackByte ransomware BYOVD",
    titleEn: "Real world: BlackByte ransomware BYOVD"
  }, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "In 2022, the BlackByte ransomware gang used a vulnerable ", /*#__PURE__*/React.createElement("code", null, "RTCore64.sys"), " driver (from MSI Afterburner, a legitimate GPU overclocking tool) to disable EDR products before encrypting files. The driver was legitimately signed by Micro-Star International. Once loaded, BlackByte used the driver's arbitrary memory read/write primitive to kill antivirus processes from ring 0 \u2014 where no EDR hook could intercept them. This is exactly why BYOVD is one of the most powerful techniques available to attackers today.") : /*#__PURE__*/React.createElement(React.Fragment, null, "2022 yilda BlackByte ransomware to'dasi fayllarga shifrlashdan oldin EDR mahsulotlarini o'chirish uchun zaif ", /*#__PURE__*/React.createElement("code", null, "RTCore64.sys"), " drayveri (qonuniy GPU overclocking vositasi MSI Afterburner'dan) dan foydalandi. Drayver Micro-Star International tomonidan qonuniy imzolangan edi. Yuklanganidan keyin BlackByte ring 0'dan \u2014 hech bir EDR hook'i ularni ushlay olmaydigan joydan \u2014 antivirus jarayonlarini o'ldirish uchun drayverning ixtiyoriy xotiraga o'qish/yozish primitividaridan foydalandi. Aynan shuning uchun BYOVD bugungi kunda hujumchilar uchun mavjud bo'lgan eng kuchli texnikalardan biridir.")));
}

// ─────────────────────────────────────────────────────────────
// L03: User mode vs Kernel mode
// ─────────────────────────────────────────────────────────────
function SectionRings() {
  const lang = useLang();
  return /*#__PURE__*/React.createElement("section", {
    id: "rings",
    style: {
      scrollMarginTop: 80,
      marginBottom: 56
    }
  }, /*#__PURE__*/React.createElement(H2, {
    num: "01",
    uz: "CPU Privilege Halqalari",
    en: "CPU Privilege Rings"
  }), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "Modern processors don't just execute code \u2014 they enforce ", /*#__PURE__*/React.createElement(Term, null, "privilege levels"), " at the hardware level. The x86/x64 CPU architecture defines 4 rings (0 through 3), where ring 0 is the most privileged and ring 3 is the least. Windows only uses two: ", /*#__PURE__*/React.createElement(Em, null, "ring 0 (kernel mode)"), " and ", /*#__PURE__*/React.createElement(Em, null, "ring 3 (user mode)"), ". Rings 1 and 2 were intended for OS services like drivers in the original Intel design but were never adopted in practice \u2014 Windows moved drivers into ring 0 for performance reasons.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Zamonaviy protsessorlar faqat kod bajarmasdan, ", /*#__PURE__*/React.createElement(Term, null, "imtiyoz darajalarini"), " hardware darajasida ham ta'minlaydi. x86/x64 CPU arxitekturasi 4 ta halqani (0 dan 3 gacha) belgilaydi: ring 0 \u2014 eng imtiyozli, ring 3 \u2014 eng kam imtiyozli. Windows faqat ikkitasidan foydalanadi: ", /*#__PURE__*/React.createElement(Em, null, "ring 0 (kernel mode)"), " va ", /*#__PURE__*/React.createElement(Em, null, "ring 3 (user mode)"), ". Ring 1 va 2 dastlabki Intel dizaynida OS xizmatlari va drayverlar uchun mo'ljallangan, lekin amalda hech qachon qabul qilinmagan \u2014 Windows drayverlarni ishlash tezligi sabab ring 0 ga ko'chirdi.")), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "28px auto",
      maxWidth: 400,
      position: "relative",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "inline-block",
      width: 340,
      height: 340
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      borderRadius: "50%",
      border: "2px solid rgba(255,145,69,0.45)",
      background: "rgba(255,145,69,0.04)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 12,
      left: "50%",
      transform: "translateX(-50%)",
      fontSize: 11,
      fontFamily: "var(--font-mono)",
      color: "var(--c-user)",
      letterSpacing: 0.1,
      whiteSpace: "nowrap"
    }
  }, "ring 3 \xB7 User mode \xB7 CPL=3"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      bottom: 12,
      left: "50%",
      transform: "translateX(-50%)",
      fontSize: 10,
      fontFamily: "var(--font-mono)",
      color: "rgba(255,145,69,0.6)",
      whiteSpace: "nowrap"
    }
  }, "Chrome \xB7 Notepad \xB7 cmd.exe \xB7 Python")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 44,
      borderRadius: "50%",
      border: "1px dashed rgba(100,100,120,0.3)",
      background: "rgba(100,100,120,0.02)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 10,
      left: "50%",
      transform: "translateX(-50%)",
      fontSize: 9.5,
      fontFamily: "var(--font-mono)",
      color: "var(--text-3)",
      whiteSpace: "nowrap"
    }
  }, "ring 1 & 2 \xB7 unused in Windows")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 96,
      borderRadius: "50%",
      border: "2px solid rgba(77,139,255,0.65)",
      background: "rgba(77,139,255,0.09)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontFamily: "var(--font-mono)",
      color: "var(--c-system)",
      letterSpacing: 0.1
    }
  }, "ring 0 \xB7 CPL=0"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: "var(--c-system)",
      marginTop: 3
    }
  }, "Kernel mode"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "var(--text-2)",
      marginTop: 3
    }
  }, "ntoskrnl.exe \xB7 hal.dll"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9.5,
      color: "var(--text-3)",
      marginTop: 2
    }
  }, "drivers (.sys)"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 20px",
      background: "rgba(255,145,69,0.06)",
      border: "1px solid rgba(255,145,69,0.25)",
      borderRadius: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      color: "var(--c-user)",
      marginBottom: 10,
      letterSpacing: 0.1
    }
  }, "RING 3 \xB7 USER MODE \xB7 CPL=3"), /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      paddingLeft: 18,
      fontSize: 13,
      color: "var(--text-1)",
      lineHeight: 1.75
    }
  }, (lang === "en" ? ["Cannot access hardware I/O ports directly", "Cannot read or write another process's memory", "Cannot execute privileged CPU instructions", "Cannot modify CPU control registers (CR0, CR3...)", "Cannot load/modify the interrupt table (LIDT)", "App crash → only that process dies (Access Violation)", "Each process lives in its own virtual address space"] : ["Hardware I/O portlariga to'g'ridan-to'g'ri kira olmaydi", "Boshqa jarayonning xotirasini o'qib yoki yoza olmaydi", "Imtiyozli CPU buyruqlarini bajara olmaydi", "CPU nazorat registrlarini (CR0, CR3...) o'zgartira olmaydi", "Uzilish jadvalini (LIDT) yuklab/o'zgartira olmaydi", "Ilova xatosi → faqat o'sha jarayon o'ladi (Access Violation)", "Har bir jarayon o'z virtual manzil maydonida yashaydi"]).map((t, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, t)))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 20px",
      background: "rgba(77,139,255,0.06)",
      border: "1px solid rgba(77,139,255,0.25)",
      borderRadius: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      color: "var(--c-system)",
      marginBottom: 10,
      letterSpacing: 0.1
    }
  }, "RING 0 \xB7 KERNEL MODE \xB7 CPL=0"), /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      paddingLeft: 18,
      fontSize: 13,
      color: "var(--text-1)",
      lineHeight: 1.75
    }
  }, (lang === "en" ? ["Direct access to all hardware I/O ports", "Can read/write any memory address in the system", "All CPU instructions available without restriction", "Can modify CR0 (enable/disable paging), CR3 (page table base)", "Can load the GDT, IDT, LDT — restructure CPU entirely", "Crash here = BSOD (Blue Screen), entire machine halts", "Kernel's memory is mapped into every process's address space"] : ["Barcha hardware I/O portlariga to'g'ridan-to'g'ri kirish", "Tizimdagi istalgan xotira manziliga o'qish/yozish", "Barcha CPU buyruqlari cheklovsiz mavjud", "CR0 (sahifani yoqish/o'chirish), CR3 (sahifa jadvali) ni o'zgartirish", "GDT, IDT, LDT ni yuklash — CPU'ni to'liq qayta tuzish", "Bu yerda xato = BSOD (Ko'k ekran), butun mashina to'xtaydi", "Kernelning xotirasi har bir jarayonning manzil maydoniga ko'chirilgan"]).map((t, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, t))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 40,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: subhead
  }, lang === "en" ? "1.1 — CPL: How the CPU actually enforces the boundary" : "1.1 — CPL: Protsessor chegarani qanday ta'minlaydi")), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "This is not software enforcement \u2014 it is baked into the silicon. Every time the CPU fetches an instruction, it checks the ", /*#__PURE__*/React.createElement(Term, null, "Current Privilege Level (CPL)"), ". The CPL is stored in bits 0\u20131 of the ", /*#__PURE__*/React.createElement("code", null, "CS"), " (Code Segment) register. ", /*#__PURE__*/React.createElement("code", null, "CS = 0x0008"), " \u2192 bits 0\u20131 are ", /*#__PURE__*/React.createElement("code", null, "00"), " \u2192 CPL=0 (kernel). ", /*#__PURE__*/React.createElement("code", null, "CS = 0x0033"), " \u2192 bits 0\u20131 are ", /*#__PURE__*/React.createElement("code", null, "11"), " \u2192 CPL=3 (user). The CPU reads this on every instruction fetch and enforces privilege automatically \u2014 no software needed.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Bu dasturiy ta'minot tomonidan emas, balki silicon'ning o'zida amalga oshiriladi. CPU har bir buyruqni olishda ", /*#__PURE__*/React.createElement(Term, null, "Joriy Imtiyoz Darajasini (CPL)"), " tekshiradi. CPL ", /*#__PURE__*/React.createElement("code", null, "CS"), " (Code Segment) registrining 0\u20131 bitlarida saqlanadi. ", /*#__PURE__*/React.createElement("code", null, "CS = 0x0008"), " \u2192 bitlar 0\u20131 = ", /*#__PURE__*/React.createElement("code", null, "00"), " \u2192 CPL=0 (kernel). ", /*#__PURE__*/React.createElement("code", null, "CS = 0x0033"), " \u2192 bitlar 0\u20131 = ", /*#__PURE__*/React.createElement("code", null, "11"), " \u2192 CPL=3 (foydalanuvchi). CPU har bir buyruq olishda buni o'qiydi va imtiyozni avtomatik ta'minlaydi \u2014 hech qanday dasturiy ta'minot kerak emas.")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      padding: "20px 24px",
      background: "var(--bg-2)",
      border: "1px solid var(--border)",
      borderRadius: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 14
    }
  }, "// ", lang === "en" ? "CPL IN THE CS REGISTER" : "CS REGISTRIDAGI CPL"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 12.5,
      lineHeight: 2,
      color: "var(--text-1)"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--c-system)"
    }
  }, "CS = 0x0008"), "  ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-3)"
    }
  }, "\u2192"), "  ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-2)"
    }
  }, "binary: "), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--accent)"
    }
  }, "0000 0000 0000 10"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--c-system)",
      fontWeight: 700
    }
  }, "00"), "  ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-3)"
    }
  }, "\u2192"), "  ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--c-system)"
    }
  }, "CPL=0 (kernel mode)")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--c-user)"
    }
  }, "CS = 0x0033"), "  ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-3)"
    }
  }, "\u2192"), "  ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-2)"
    }
  }, "binary: "), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--accent)"
    }
  }, "0000 0000 0011 00"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--c-user)",
      fontWeight: 700
    }
  }, "11"), "  ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-3)"
    }
  }, "\u2192"), "  ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--c-user)"
    }
  }, "CPL=3 (user mode)"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      fontSize: 12,
      color: "var(--text-2)",
      lineHeight: 1.6
    }
  }, lang === "en" ? "The CPU reads the last 2 bits of CS on every instruction. No instruction in ring 3 can set CS.CPL=0 directly — that's the whole point." : "CPU har bir buyruqda CS ning oxirgi 2 bitini o'qiydi. Ring 3'dagi hech bir buyruq CS.CPL=0 ni to'g'ridan-to'g'ri o'rnata olmaydi — asosiy nuqta aynan shu.")), /*#__PURE__*/React.createElement("h3", {
    style: {
      ...subhead,
      marginTop: 36
    }
  }, lang === "en" ? "1.2 — Privileged instructions and what happens when ring 3 tries to use them" : "1.2 — Imtiyozli buyruqlar va ring 3 ularni ishlatmoqchi bo'lsa nima bo'ladi"), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "Some CPU instructions are ", /*#__PURE__*/React.createElement(Em, null, "only allowed when CPL=0"), ". If ring 3 code tries to execute one, the CPU immediately raises a ", /*#__PURE__*/React.createElement(Term, null, "General Protection Fault (#GP, exception 13)"), ". Windows catches this exception via its Interrupt Descriptor Table (IDT) handler, and then terminates the offending process with an ", /*#__PURE__*/React.createElement(Em, null, "Access Violation"), " (0xC0000005). The rest of the system keeps running unaffected.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Ba'zi CPU buyruqlari faqat CPL=0 bo'lganda ruxsat etiladi. Ring 3 kodi ulardan birini bajarmoqchi bo'lsa, CPU darhol ", /*#__PURE__*/React.createElement(Term, null, "Umumiy Himoya Xatosi (#GP, istisno 13)"), " ni beradi. Windows buni Interrupt Descriptor Table (IDT) ishlovchisi orqali ushlab, xato qilgan jarayonni ", /*#__PURE__*/React.createElement(Em, null, "Access Violation"), " (0xC0000005) bilan tugatadi. Tizimning qolgan qismi ta'sirlanmagan holda ishlashda davom etadi.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: 10,
      marginTop: 16
    }
  }, (lang === "en" ? [{
    inst: "HLT",
    desc: "Halt the processor — stops all execution until next interrupt. Only the OS scheduler should call this (on idle)."
  }, {
    inst: "LGDT / LIDT",
    desc: "Load the Global/Interrupt Descriptor Table — defines memory segments and all interrupt handlers. Writable only by the kernel."
  }, {
    inst: "MOV CR0–CR4",
    desc: "Modify CPU control registers: CR0 enables paging, CR3 points to the page table, CR4 enables features like SMEP/SMAP."
  }, {
    inst: "WRMSR / RDMSR",
    desc: "Write/Read Model-Specific Registers — configure CPU features like SYSCALL entry point (LSTAR MSR), performance counters, etc."
  }, {
    inst: "IN / OUT",
    desc: "Direct I/O port access — talk to hardware (keyboard controller, PCI bus, etc.) without going through the driver model."
  }, {
    inst: "CLI / STI",
    desc: "Clear/Set the Interrupt Flag — disable or enable hardware interrupts globally. Misuse freezes the entire machine."
  }] : [{
    inst: "HLT",
    desc: "Protsessorni to'xtatish — keyingi uzilishgacha barcha bajarishni to'xtatadi. Faqat OS rejalashtirgichi (bo'sh paytda) chaqirishi kerak."
  }, {
    inst: "LGDT / LIDT",
    desc: "Global/Interrupt Descriptor Jadvalini yuklash — xotira segmentlari va barcha uzilish ishlovchilarini belgilaydi. Faqat kernel yoza oladi."
  }, {
    inst: "MOV CR0–CR4",
    desc: "CPU nazorat registrlarini o'zgartirish: CR0 sahifani yoqadi, CR3 sahifa jadvaliga ishora qiladi, CR4 SMEP/SMAP kabi xususiyatlarni yoqadi."
  }, {
    inst: "WRMSR / RDMSR",
    desc: "Modelga xos registrlarni yozish/o'qish — SYSCALL kirish nuqtasi (LSTAR MSR), ishlash o'lchovlari kabi CPU xususiyatlarini sozlash."
  }, {
    inst: "IN / OUT",
    desc: "To'g'ridan-to'g'ri I/O port kirishini — drayver modeli orqali o'tmasdan hardware bilan gaplashish (klaviatura kontrolleri, PCI avtobus va h.k.)."
  }, {
    inst: "CLI / STI",
    desc: "Uzilish bayrog'ini tozalash/o'rnatish — hardware uzilishlarini butun tizim darajasida o'chirish yoki yoqish. Noto'g'ri foydalanish mashinani muzlatadi."
  }]).map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: "12px 16px",
      background: "var(--bg-2)",
      border: "1px solid var(--border)",
      borderRadius: 10,
      borderLeft: "3px solid var(--c-system)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      color: "var(--c-system)",
      fontWeight: 700,
      marginBottom: 5
    }
  }, r.inst), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: "var(--text-1)",
      lineHeight: 1.55
    }
  }, r.desc)))), /*#__PURE__*/React.createElement("h3", {
    style: {
      ...subhead,
      marginTop: 36
    }
  }, lang === "en" ? "1.3 — What happens step by step when ring 3 breaks the rule" : "1.3 — Ring 3 qoidani buzganda nima sodir bo'ladi — bosqichma-bosqich"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, (lang === "en" ? [{
    n: "1",
    color: "var(--c-user)",
    title: "Ring 3 code executes privileged instruction",
    desc: "e.g. a Python script calls HLT or tries to write to CR3. The CPU starts the instruction..."
  }, {
    n: "2",
    color: "var(--c-attack)",
    title: "CPU hardware checks CPL",
    desc: "Before completing the instruction, the CPU compares CPL (=3) against the required privilege level (=0). Mismatch detected."
  }, {
    n: "3",
    color: "var(--c-attack)",
    title: "#GP fault triggered (exception 13)",
    desc: "The CPU immediately stops and raises a General Protection Fault. No instruction is executed. Control transfers to the OS's IDT handler."
  }, {
    n: "4",
    color: "var(--c-warn)",
    title: "Windows exception handler catches #GP",
    desc: "ntoskrnl's IDT entry for exception 13 runs in ring 0. It identifies the faulting process and prepares to terminate it."
  }, {
    n: "5",
    color: "var(--accent)",
    title: "Process terminated with Access Violation",
    desc: "The offending process receives EXCEPTION_ACCESS_VIOLATION (0xC0000005) and dies. The rest of the OS keeps running — that's the whole point of the boundary."
  }] : [{
    n: "1",
    color: "var(--c-user)",
    title: "Ring 3 kodi imtiyozli buyruqni bajarmoqchi",
    desc: "Masalan, Python skript HLT ni chaqiradi yoki CR3 ga yozishga harakat qiladi. CPU buyruqni boshlamoqda..."
  }, {
    n: "2",
    color: "var(--c-attack)",
    title: "CPU hardware CPL ni tekshiradi",
    desc: "Buyruqni tugatishdan oldin CPU CPL (=3) ni talab qilingan imtiyoz darajasi (=0) bilan solishtiradi. Nomuvofiqlik aniqlandi."
  }, {
    n: "3",
    color: "var(--c-attack)",
    title: "#GP xatosi ishga tushadi (istisno 13)",
    desc: "CPU darhol to'xtatadi va Umumiy Himoya Xatosini beradi. Hech bir buyruq bajarilmaydi. Boshqaruv OS'ning IDT ishlovchisiga o'tadi."
  }, {
    n: "4",
    color: "var(--c-warn)",
    title: "Windows istisno ishlovchisi #GP ni ushlaydi",
    desc: "ntoskrnl'ning 13-istisno uchun IDT yozuvi ring 0'da ishlaydi. U xato qilgan jarayonni aniqlaydi va tugatishga tayyorlanadi."
  }, {
    n: "5",
    color: "var(--accent)",
    title: "Jarayon Access Violation bilan tugatiladi",
    desc: "Xato qilgan jarayon EXCEPTION_ACCESS_VIOLATION (0xC0000005) oladi va o'ladi. OS ning qolgan qismi ishlashda davom etadi — chegaraning butun mohiyati shu."
  }]).map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 14,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      borderRadius: "50%",
      background: s.color + "18",
      border: `1.5px solid ${s.color}`,
      color: s.color,
      display: "grid",
      placeItems: "center",
      flexShrink: 0,
      fontFamily: "var(--font-mono)",
      fontWeight: 700,
      fontSize: 12
    }
  }, s.n), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 4,
      paddingBottom: 14,
      borderBottom: i < 4 ? "1px solid var(--border)" : "none",
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      fontWeight: 600,
      color: "var(--text-0)",
      marginBottom: 3
    }
  }, s.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: "var(--text-2)",
      lineHeight: 1.55
    }
  }, s.desc))))), /*#__PURE__*/React.createElement(Callout, {
    color: "var(--c-warn)",
    icon: "warning",
    titleUz: "Nima uchun bu chegara zarur?",
    titleEn: "Why does this boundary exist?"
  }, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "Imagine if every app had full hardware access. A single buggy Chrome tab could execute ", /*#__PURE__*/React.createElement("code", null, "HLT"), " and freeze your CPU, or write to CR3 and corrupt the entire page table \u2014 crashing every process on the machine at once. The ring boundary, enforced in silicon, guarantees that no matter how broken or malicious an app is, it ", /*#__PURE__*/React.createElement(Em, null, "cannot"), " directly harm the kernel or other processes. It can only harm itself.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Tasavvur qiling, har bir ilova to'liq hardware kirishiga ega bo'lsa. Bitta noto'g'ri Chrome yorlig'i ", /*#__PURE__*/React.createElement("code", null, "HLT"), " ni bajarib CPU'ni muzlatishi, yoki CR3 ga yozib butun sahifa jadvalini buzishi \u2014 shu bilan mashinalardagi barcha jarayonni bir vaqtda yiqitishi mumkin edi. Silicon'da amalga oshirilgan halqa chegarasi kafolatlaydi: ilova qanchalik buzilgan yoki zararli bo'lmasin, u kernelga yoki boshqa jarayonlarga ", /*#__PURE__*/React.createElement(Em, null, "to'g'ridan-to'g'ri"), " zarar yetkazolmaydi. U faqat o'ziga zarar yetkazishi mumkin.")));
}
function SectionSyscallBrief() {
  const lang = useLang();
  return /*#__PURE__*/React.createElement("section", {
    id: "syscall-brief",
    style: {
      scrollMarginTop: 80,
      marginBottom: 56
    }
  }, /*#__PURE__*/React.createElement(H2, {
    num: "03",
    uz: "Chegarani qonuniy kesib o'tish: SYSCALL mexanizmi",
    en: "Legally crossing the boundary: the SYSCALL mechanism"
  }), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "A user-mode app can never jump into kernel mode by itself \u2014 that would require changing CPL, which only the CPU hardware can do. The ", /*#__PURE__*/React.createElement(Em, null, "only"), " legal trigger is the ", /*#__PURE__*/React.createElement(Term, null, "SYSCALL"), " instruction (64-bit) or ", /*#__PURE__*/React.createElement(Term, null, "SYSENTER"), " (32-bit). When executed, the CPU performs a precisely defined hardware sequence \u2014 not software, the actual silicon \u2014 in a single atomic step.") : /*#__PURE__*/React.createElement(React.Fragment, null, "User mode'dagi ilova mustaqil ravishda kernel mode'ga sakray olmaydi \u2014 bu CPL ni o'zgartirishni talab qiladi, buni esa faqat CPU hardware'i qila oladi. Yagona qonuniy trigger \u2014 ", /*#__PURE__*/React.createElement(Term, null, "SYSCALL"), " buyrug'i (64-bit) yoki ", /*#__PURE__*/React.createElement(Term, null, "SYSENTER"), " (32-bit). Bajarilganda, CPU aniq belgilangan hardware ketma-ketligini amalga oshiradi \u2014 dasturiy ta'minot emas, haqiqiy silicon \u2014 bitta atomik qadamda.")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22,
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 6
    }
  }, "// ", lang === "en" ? "WHAT THE CPU DOES WHEN SYSCALL EXECUTES" : "SYSCALL BAJARILGANDA CPU NIMA QILADI"), (lang === "en" ? [{
    n: "1",
    color: "var(--c-user)",
    title: "Save user-mode state (RIP, RSP, RFLAGS)",
    desc: /*#__PURE__*/React.createElement(React.Fragment, null, "The CPU saves the current instruction pointer (", /*#__PURE__*/React.createElement("code", null, "RIP"), "), stack pointer (", /*#__PURE__*/React.createElement("code", null, "RSP"), "), and flags register (", /*#__PURE__*/React.createElement("code", null, "RFLAGS"), ") into CPU registers (", /*#__PURE__*/React.createElement("code", null, "RCX"), ", ", /*#__PURE__*/React.createElement("code", null, "R11"), "). This is where execution will resume when we return to ring 3.")
  }, {
    n: "2",
    color: "var(--c-warn)",
    title: "Switch CPL: 3 → 0 (the only legal way)",
    desc: /*#__PURE__*/React.createElement(React.Fragment, null, "The CPU sets ", /*#__PURE__*/React.createElement("code", null, "CS.CPL = 0"), ", loading the kernel CS selector (", /*#__PURE__*/React.createElement("code", null, "0x0010"), "). This is the moment privilege changes. No user-mode code can do this \u2014 only the SYSCALL instruction triggers this hardware behavior.")
  }, {
    n: "3",
    color: "var(--c-warn)",
    title: "Switch to kernel stack",
    desc: /*#__PURE__*/React.createElement(React.Fragment, null, "The CPU loads a new stack pointer from the ", /*#__PURE__*/React.createElement("code", null, "TSS (Task State Segment)"), " \u2014 a kernel stack, not the user stack. This is critical for security: the kernel must never trust the user's stack.")
  }, {
    n: "4",
    color: "var(--c-system)",
    title: "Jump to kernel entry point (LSTAR MSR)",
    desc: /*#__PURE__*/React.createElement(React.Fragment, null, "The CPU loads ", /*#__PURE__*/React.createElement("code", null, "RIP"), " from the ", /*#__PURE__*/React.createElement("code", null, "LSTAR"), " Model-Specific Register, which Windows sets at boot to point to ", /*#__PURE__*/React.createElement("code", null, "KiSystemCall64"), " inside ntoskrnl.exe. This is the entry point for all system calls.")
  }, {
    n: "5",
    color: "var(--c-system)",
    title: "Kernel reads syscall number, dispatches",
    desc: /*#__PURE__*/React.createElement(React.Fragment, null, "The ", /*#__PURE__*/React.createElement("code", null, "EAX"), " register contains the ", /*#__PURE__*/React.createElement(Em, null, "syscall number"), " (e.g. 0x0018 = NtReadFile). The kernel looks it up in the ", /*#__PURE__*/React.createElement(Term, null, "SSDT (System Service Descriptor Table)"), " and calls the corresponding function.")
  }, {
    n: "6",
    color: "var(--accent)",
    title: "SYSRET: return to ring 3",
    desc: /*#__PURE__*/React.createElement(React.Fragment, null, "When done, the kernel executes ", /*#__PURE__*/React.createElement("code", null, "SYSRET"), ". The CPU restores ", /*#__PURE__*/React.createElement("code", null, "RIP"), ", ", /*#__PURE__*/React.createElement("code", null, "RSP"), ", ", /*#__PURE__*/React.createElement("code", null, "RFLAGS"), " from the saved values, sets ", /*#__PURE__*/React.createElement("code", null, "CS.CPL = 3"), ", and resumes the user-mode code exactly where it stopped.")
  }] : [{
    n: "1",
    color: "var(--c-user)",
    title: "User mode holatini saqlash (RIP, RSP, RFLAGS)",
    desc: /*#__PURE__*/React.createElement(React.Fragment, null, "CPU joriy ko'rsatma ko'rsatkichini (", /*#__PURE__*/React.createElement("code", null, "RIP"), "), stek ko'rsatkichini (", /*#__PURE__*/React.createElement("code", null, "RSP"), ") va bayroqlar registrini (", /*#__PURE__*/React.createElement("code", null, "RFLAGS"), ") CPU registrlarida saqlaydi (", /*#__PURE__*/React.createElement("code", null, "RCX"), ", ", /*#__PURE__*/React.createElement("code", null, "R11"), "). Ring 3 ga qaytganda bajarish shu yerdan davom etadi.")
  }, {
    n: "2",
    color: "var(--c-warn)",
    title: "CPL almashtirish: 3 → 0 (yagona qonuniy yo'l)",
    desc: /*#__PURE__*/React.createElement(React.Fragment, null, "CPU ", /*#__PURE__*/React.createElement("code", null, "CS.CPL = 0"), " o'rnatadi, kernel CS selektorini (", /*#__PURE__*/React.createElement("code", null, "0x0010"), ") yuklaydi. Bu imtiyoz o'zgaradigan lahza. Hech bir user-mode kodi buni qila olmaydi \u2014 faqat SYSCALL buyrug'i bu hardware xatti-harakatini ishga tushiradi.")
  }, {
    n: "3",
    color: "var(--c-warn)",
    title: "Kernel stekiga o'tish",
    desc: /*#__PURE__*/React.createElement(React.Fragment, null, "CPU yangi stek ko'rsatkichini ", /*#__PURE__*/React.createElement("code", null, "TSS (Task State Segment)"), " dan yuklaydi \u2014 user steki emas, kernel steki. Bu xavfsizlik uchun muhim: kernel foydalanuvchi stekiga hech qachon ishonmasligi kerak.")
  }, {
    n: "4",
    color: "var(--c-system)",
    title: "Kernel kirish nuqtasiga o'tish (LSTAR MSR)",
    desc: /*#__PURE__*/React.createElement(React.Fragment, null, "CPU ", /*#__PURE__*/React.createElement("code", null, "RIP"), " ni ", /*#__PURE__*/React.createElement("code", null, "LSTAR"), " Model-Specific Registridan yuklaydi \u2014 Windows uni boot vaqtida ntoskrnl.exe ichidagi ", /*#__PURE__*/React.createElement("code", null, "KiSystemCall64"), " ga ishora qilib o'rnatadi. Bu barcha tizim chaqiruvlari uchun kirish nuqtasi.")
  }, {
    n: "5",
    color: "var(--c-system)",
    title: "Kernel syscall raqamini o'qiydi va yo'naltiradi",
    desc: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("code", null, "EAX"), " registri ", /*#__PURE__*/React.createElement(Em, null, "syscall raqamini"), " o'z ichiga oladi (masalan 0x0018 = NtReadFile). Kernel uni ", /*#__PURE__*/React.createElement(Term, null, "SSDT (Tizim Xizmat Tasviri Jadvali)"), " dan qidirib, mos funksiyani chaqiradi.")
  }, {
    n: "6",
    color: "var(--accent)",
    title: "SYSRET: ring 3 ga qaytish",
    desc: /*#__PURE__*/React.createElement(React.Fragment, null, "Tugatgach, kernel ", /*#__PURE__*/React.createElement("code", null, "SYSRET"), " ni bajaradi. CPU saqlangan qiymatlardan ", /*#__PURE__*/React.createElement("code", null, "RIP"), ", ", /*#__PURE__*/React.createElement("code", null, "RSP"), ", ", /*#__PURE__*/React.createElement("code", null, "RFLAGS"), " ni tiklaydi, ", /*#__PURE__*/React.createElement("code", null, "CS.CPL = 3"), " o'rnatadi va user-mode kodini to'xtatilgan joydan davom ettiradi.")
  }]).map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: "50%",
      background: s.color + "18",
      border: `1.5px solid ${s.color}`,
      color: s.color,
      display: "grid",
      placeItems: "center",
      fontFamily: "var(--font-mono)",
      fontWeight: 700,
      fontSize: 12
    }
  }, s.n), i < 5 && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 2,
      flex: 1,
      minHeight: 14,
      background: `linear-gradient(180deg, ${s.color}66, transparent)`,
      marginTop: 3
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 16,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      fontWeight: 600,
      color: "var(--text-0)",
      marginBottom: 3
    }
  }, s.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: "var(--text-2)",
      lineHeight: 1.6
    }
  }, s.desc))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      padding: "18px 22px",
      background: "var(--bg-2)",
      border: "1px solid var(--border)",
      borderRadius: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 12
    }
  }, "// ", lang === "en" ? "SYSCALL NUMBER TABLE (partial)" : "SYSCALL RAQAMLARI JADVALI (qisqacha)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "auto 1fr 1fr",
      gap: "6px 20px",
      fontFamily: "var(--font-mono)",
      fontSize: 12
    }
  }, [["0x0004", "NtWriteFile", "Faylga yozish"], ["0x000F", "NtClose", "Handle'ni yopish"], ["0x0018", "NtReadFile", "Fayldan o'qish"], ["0x0023", "NtOpenFile", "Faylni ochish"], ["0x0039", "NtCreateProcess", "Jarayon yaratish"], ["0x0055", "NtAllocateVirtualMemory", "Virtual xotira ajratish"]].map(([num, en, uz], i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--c-warn)"
    }
  }, num), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--accent)"
    }
  }, en), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-2)"
    }
  }, lang === "en" ? en.replace("Nt", "").replace(/([A-Z])/g, " $1").trim() : uz)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      fontSize: 12,
      color: "var(--text-3)",
      lineHeight: 1.6
    }
  }, lang === "en" ? "Windows has ~450 syscalls total. Every privileged action your app performs — opening a file, creating a process, allocating memory — goes through one of these numbers." : "Windows jami ~450 ta syscallga ega. Ilovangiz bajaradigan har bir imtiyozli amal — fayl ochish, jarayon yaratish, xotira ajratish — shu raqamlardan biri orqali o'tadi.")), /*#__PURE__*/React.createElement(Callout, {
    color: "var(--c-attack)",
    icon: "skull",
    titleUz: "Xavfsizlik: to'g'ridan-to'g'ri syscall va EDR chetlab o'tish",
    titleEn: "Security: direct syscalls and EDR bypass"
  }, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "Security tools (EDR, antivirus) detect malware by placing ", /*#__PURE__*/React.createElement(Em, null, "hooks"), " inside ", /*#__PURE__*/React.createElement("code", null, "ntdll.dll"), " \u2014 they overwrite the first few bytes of functions like ", /*#__PURE__*/React.createElement("code", null, "NtReadFile"), " with a jump to their own monitoring code. Advanced malware bypasses this by:", /*#__PURE__*/React.createElement("br", null), "1. Finding the syscall number for the target function directly (by scanning ntdll in memory or hardcoding it)", /*#__PURE__*/React.createElement("br", null), "2. Loading that number into ", /*#__PURE__*/React.createElement("code", null, "EAX"), /*#__PURE__*/React.createElement("br", null), "3. Calling the ", /*#__PURE__*/React.createElement("code", null, "syscall"), " instruction directly \u2014 skipping the hooked ntdll function entirely", /*#__PURE__*/React.createElement("br", null), "This is called ", /*#__PURE__*/React.createElement("strong", null, "direct syscalls"), " (or ", /*#__PURE__*/React.createElement("strong", null, "Hell's Gate / Halo's Gate"), " in advanced implementations). The EDR never sees the call because it only monitors ntdll, not the raw syscall gate.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Xavfsizlik tizimlari (EDR, antivirus) malware'ni ", /*#__PURE__*/React.createElement("code", null, "ntdll.dll"), " ichiga ", /*#__PURE__*/React.createElement(Em, null, "hook"), " joylashtirish orqali aniqlaydi \u2014 ular ", /*#__PURE__*/React.createElement("code", null, "NtReadFile"), " kabi funksiyalarning birinchi bir necha baytini o'z monitoring kodiga sakrash bilan almashtiradi. Rivojlangan malware buni chetlab o'tadi:", /*#__PURE__*/React.createElement("br", null), "1. Maqsad funksiya uchun syscall raqamini to'g'ridan-to'g'ri topib (ntdll'ni xotirada skanerlash yoki hardcode qilish orqali)", /*#__PURE__*/React.createElement("br", null), "2. Shu raqamni ", /*#__PURE__*/React.createElement("code", null, "EAX"), " ga yuklaydi", /*#__PURE__*/React.createElement("br", null), "3. ", /*#__PURE__*/React.createElement("code", null, "syscall"), " buyrug'ini to'g'ridan-to'g'ri chaqiradi \u2014 ushlangan ntdll funksiyasini butunlay o'tkazib yuboradi", /*#__PURE__*/React.createElement("br", null), "Bu ", /*#__PURE__*/React.createElement("strong", null, "to'g'ridan-to'g'ri syscall"), " (yoki murakkab implementatsiyalarda ", /*#__PURE__*/React.createElement("strong", null, "Hell's Gate / Halo's Gate"), ") deyiladi. EDR bu chaqiruvni hech qachon ko'rmaydi, chunki u faqat ntdll'ni kuzatadi, xom syscall gate'ni emas.")));
}

// ─────────────────────────────────────────────────────────────
// Coming soon placeholder for L05-L20
// ─────────────────────────────────────────────────────────────
function ComingSoon({
  lesson,
  lessonNum,
  setRoute
}) {
  const lang = useLang();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "80px 32px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 80,
      height: 80,
      borderRadius: "50%",
      background: "var(--accent-soft)",
      border: "1px solid var(--accent-border)",
      margin: "0 auto 24px",
      display: "grid",
      placeItems: "center",
      color: "var(--accent)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 36
  })), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      color: "var(--accent)",
      marginBottom: 12
    }
  }, "// ", lang === "en" ? "IN_DEVELOPMENT" : "TAYYORLANMOQDA"), /*#__PURE__*/React.createElement("h2", {
    className: "display",
    style: {
      fontSize: 32,
      margin: "0 0 10px",
      letterSpacing: "-0.02em"
    }
  }, lang === "en" ? lesson.en : lesson.uz), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-2)",
      fontSize: 15,
      maxWidth: 480,
      margin: "0 auto 32px",
      lineHeight: 1.65
    }
  }, lang === "en" ? "This lesson is currently being developed. Complete the earlier lessons and check back soon — it will appear here automatically when ready." : "Bu dars hozirda tayyorlanmoqda. Oldingi darslarni tugating va tez orada qaytib keling — tayyor bo'lgach bu yerda avtomatik paydo bo'ladi."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => setRoute({
      name: "section",
      section: 1
    })
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-left",
    size: 14
  }), " ", lang === "en" ? "Back to section" : "Bo'limga qaytish")));
}

// ─────────────────────────────────────────────────────────────
// Text helpers
// ─────────────────────────────────────────────────────────────
function H2({
  num,
  uz,
  en
}) {
  const lang = useLang();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 18,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: "var(--accent)",
      fontSize: 12,
      letterSpacing: 0.18
    }
  }, num), /*#__PURE__*/React.createElement("h2", {
    className: "display",
    style: {
      margin: 0,
      fontSize: 30,
      letterSpacing: "-0.02em"
    }
  }, lang === "en" ? en : uz));
}
function P({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      lineHeight: 1.72,
      color: "var(--text-1)",
      margin: "10px 0",
      textWrap: "pretty",
      ...style
    }
  }, children);
}
function Term({
  children
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--accent)",
      fontWeight: 600,
      borderBottom: "1px dotted var(--accent-border)",
      cursor: "help"
    }
  }, children);
}
function Em({
  children
}) {
  return /*#__PURE__*/React.createElement("em", {
    style: {
      color: "var(--text-0)",
      fontStyle: "italic",
      fontWeight: 500
    }
  }, children);
}
function Code2({
  children
}) {
  return /*#__PURE__*/React.createElement("code", {
    style: {
      background: "rgba(255,255,255,0.06)",
      padding: "1px 6px",
      borderRadius: 4,
      fontFamily: "var(--font-mono)",
      fontSize: "0.92em",
      color: "var(--accent)"
    }
  }, children);
}
function Callout({
  children,
  color = "var(--accent)",
  icon = "info",
  titleUz,
  titleEn,
  small
}) {
  const lang = useLang();
  const title = lang === "en" ? titleEn : titleUz;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: small ? "12px 14px" : "16px 18px",
      background: `${color}0a`,
      border: `1px solid ${color}33`,
      borderRadius: 10,
      borderLeft: `3px solid ${color}`,
      display: "flex",
      gap: 12,
      alignItems: "flex-start",
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color,
      flexShrink: 0,
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: small ? 14 : 16
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontSize: small ? 12 : 13.5,
      color: "var(--text-1)",
      lineHeight: 1.55
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      color,
      fontWeight: 600,
      marginBottom: 4
    }
  }, title), children));
}
window.LessonScreen = LessonScreen;

// ─── screens/quiz.jsx ───
// quiz.jsx — quiz modal with REAL Claude grading
// Flow: intro → answer 3 questions (written) → AI grades each → pass/fail summary

const {
  useState: useQS,
  useEffect: useQE,
  useRef: useQR
} = React;

// Static fallback questions per lesson
const FALLBACK_QUESTIONS = {
  1: [{
    uz: "Operatsion tizim nima va u qanday 4 ta asosiy vazifani bajaradi? Windows bu vazifalarni qanday amalga oshiradi?",
    en: "What is an operating system and what are its 4 main jobs? How does Windows carry these out?"
  }, {
    uz: "User mode (ring 3) va Kernel mode (ring 0) farqini tushuntiring. Nega bu ikki rejim mavjud va ular o'rtasidagi chegara nima uchun muhim?",
    en: "Explain the difference between user mode (ring 3) and kernel mode (ring 0). Why do these two modes exist and why is the boundary important?"
  }, {
    uz: "ntoskrnl.exe ichida Microkernel va Executive nima rol o'ynaydi? HAL (Hardware Abstraction Layer) nima uchun zarur?",
    en: "What roles do the Microkernel and Executive play inside ntoskrnl.exe? Why is the HAL (Hardware Abstraction Layer) needed?"
  }],
  2: [{
    uz: "Kernel nima? U operatsion tizimda qanday asosiy vazifalarni bajaradi? Windows kerneli qaysi faylda joylashgan?",
    en: "What is a kernel? What are its main tasks in an operating system? Which file contains the Windows kernel?"
  }, {
    uz: "ntoskrnl.exe ichida qanday asosiy qismlar bor? Microkernel va Executive o'rtasidagi farqni tushuntiring.",
    en: "What are the main parts inside ntoskrnl.exe? Explain the difference between the Microkernel and the Executive."
  }, {
    uz: "Drayver nima va u nima uchun ring 0'da ishlaydi? Imzolanmagan drayver nima uchun xavfli?",
    en: "What is a driver and why does it run in ring 0? Why is an unsigned driver dangerous?"
  }],
  3: [{
    uz: "Ring 3 (User mode) va Ring 0 (Kernel mode) nima? Protsessor bu chegarani qanday qilib ta'minlaydi?",
    en: "What are Ring 3 (user mode) and Ring 0 (kernel mode)? How does the CPU enforce this boundary?"
  }, {
    uz: "User mode'da ishlayotgan dastur to'g'ridan-to'g'ri hardware'ga murojaat qila oladimi? Nima uchun? Kernel mode'da bunday murojaat mumkinmi?",
    en: "Can a user-mode program access hardware directly? Why or why not? Is this possible in kernel mode?"
  }, {
    uz: "User mode'dagi dastur xato (crash) qilsa nima bo'ladi? Kernel mode'dagi kod xato qilsa nima bo'ladi? Farqi nimada?",
    en: "What happens when a user-mode program crashes? What happens when kernel-mode code crashes? What is the difference?"
  }],
  4: [{
    uz: "Windows boot jarayonini UEFI'dan login ekraniga qadar 4-5 ta bosqichda tushuntiring. Har bir bosqichda nima sodir bo'ladi?",
    en: "Explain the Windows boot process from UEFI to the login screen in 4-5 steps. What happens at each stage?"
  }, {
    uz: "Secure Boot nima va u nima uchun zarur? U qanday ishlaydi?",
    en: "What is Secure Boot and why is it needed? How does it work?"
  }, {
    uz: "LSASS nima va u Windows'da qanday rol o'ynaydi? U nima uchun hujumchilar uchun qiziqarli?",
    en: "What is LSASS and what role does it play in Windows? Why is it a target for attackers?"
  }]
};
const COOLDOWN_KEY = "wa_cooldown_end";
const COOLDOWN_DURATION = 30 * 60 * 1000; // 30 min in ms

function QuizModal({
  onClose,
  onPass,
  onFail,
  lessonNum = 1
}) {
  const lang = useLang();
  const [phase, setPhase] = useQS("intro");
  const [questions, setQuestions] = useQS(null);
  const [answers, setAnswers] = useQS(["", "", ""]);
  const [current, setCurrent] = useQS(0);
  const [results, setResults] = useQS(null);
  const [loading, setLoading] = useQS(false);
  const [err, setErr] = useQS(null);
  const hasKey = () => !!(localStorage.getItem("wa_ai_provider") && localStorage.getItem("wa_ai_key"));
  const gradeOne = async (q, answer) => {
    const prompt = `You are a senior Windows internals instructor grading a student's written answer.

QUESTION (Uzbek): ${q.uz}
QUESTION (English): ${q.en}

STUDENT ANSWER:
"""
${answer || "(empty)"}
"""

Grade STRICTLY on technical correctness (40%), Windows/OS terminology (20%), real understanding of internals (20%), explanation quality (20%).
Empty/one-word answers get 0-20. Surface-level gets 30-50. Real depth with correct terms (ring 0/3, ntoskrnl, HAL, syscall, executive, LSASS, etc.) gets 70+. Expert security nuance gets 90+.

Return STRICT JSON only, no markdown fences. Feedback in ${lang === "en" ? "English" : "Uzbek"}:
{"score":<0-100>,"passed":<true if score>=70>,"strengths":["bullet","bullet"],"weaknesses":["bullet","bullet"],"feedback":"2-3 sentence feedback"}`;
    if (hasKey()) {
      const text = await gradeWithAI(prompt);
      const cleaned = text.replace(/^```json\s*[\r\n]?|```\s*$/g, "").trim();
      return JSON.parse(cleaned);
    }
    // fallback: word-count heuristic
    const wc = (answer || "").trim().split(/\s+/).filter(Boolean).length;
    const score = wc < 5 ? 10 : wc < 20 ? 30 : wc < 50 ? 55 : 72;
    return {
      score,
      passed: score >= 70,
      strengths: wc >= 50 ? [lang === "en" ? "Detailed answer" : "Batafsil javob"] : [],
      weaknesses: wc < 50 ? [lang === "en" ? "Too brief — AI key not set" : "Juda qisqa — AI kalit o'rnatilmagan"] : [],
      feedback: lang === "en" ? "Set an AI key in Tweaks panel for real grading." : "Haqiqiy baholash uchun Tweaks panelida AI kalitini o'rnating."
    };
  };
  const TOPICS = {
    1: "Windows architecture basics (beginner-intermediate): what an OS does, user mode (ring 3) vs kernel mode (ring 0), Executive, Microkernel, HAL, ntoskrnl.exe. Ask clear conceptual questions a student can answer after reading the lesson.",
    2: "What is the kernel (beginner level): kernel definition, ntoskrnl.exe main components (Executive, Microkernel, HAL), drivers in ring 0 and why unsigned drivers are dangerous. Keep questions foundational.",
    3: "User mode vs kernel mode (beginner-intermediate): CPU privilege rings (ring 0 and ring 3), why the boundary exists, what each mode can/cannot do, crash impact differences. Practical and clear questions.",
    4: "Windows boot process (beginner-intermediate): UEFI/POST, Secure Boot, bootmgr.efi, winload.efi, kernel load, smss.exe, LSASS, login screen. Ask about the sequence and purpose of each step."
  };
  const generate = async () => {
    setLoading(true);
    setErr(null);
    try {
      if (hasKey()) {
        const prompt = `Generate 3 clear written questions for a Windows internals course.
Topic focus: ${TOPICS[lessonNum] || TOPICS[1]}
Requirements: each question needs a multi-sentence written explanation (not yes/no). Mix: 1 definition/concept, 1 how-it-works, 1 why-it-matters. Questions should match what the lesson teaches — do NOT ask about topics not covered in the lesson. Vary the specific angle from previous attempts.
Return STRICT JSON only, no markdown: {"questions":[{"uz":"...","en":"..."},{"uz":"...","en":"..."},{"uz":"...","en":"..."}]}`;
        const text = await gradeWithAI(prompt);
        const cleaned = text.replace(/^```json\s*[\r\n]?|```\s*$/g, "").trim();
        setQuestions(JSON.parse(cleaned).questions.slice(0, 3));
      } else {
        setQuestions(FALLBACK_QUESTIONS[lessonNum] || FALLBACK_QUESTIONS[1]);
      }
      setPhase("answering");
    } catch (e) {
      console.warn("Question gen failed, using fallback:", e);
      setQuestions(FALLBACK_QUESTIONS[lessonNum] || FALLBACK_QUESTIONS[1]);
      setPhase("answering");
    } finally {
      setLoading(false);
    }
  };
  const submit = async () => {
    setPhase("grading");
    setLoading(true);
    setErr(null);
    try {
      const evals = await Promise.all(questions.map((q, i) => gradeOne(q, answers[i])));
      setResults(evals);
      setPhase("result");
    } catch (e) {
      setErr(String(e));
      setPhase("answering");
    } finally {
      setLoading(false);
    }
  };
  const overall = results ? Math.round(results.reduce((a, r) => a + r.score, 0) / results.length) : 0;
  const passed = results ? overall >= 70 && results.every(r => r.score >= 50) : false;
  return /*#__PURE__*/React.createElement("div", {
    style: overlayStyle
  }, /*#__PURE__*/React.createElement("div", {
    style: modalStyle,
    className: "fade-up"
  }, /*#__PURE__*/React.createElement(ModalHeader, {
    phase: phase,
    onClose: onClose,
    lessonNum: lessonNum
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 32px 32px",
      flex: 1,
      overflowY: "auto",
      minHeight: 0
    }
  }, phase === "intro" && /*#__PURE__*/React.createElement(Intro, {
    onStart: generate,
    loading: loading,
    lessonNum: lessonNum
  }), phase === "answering" && questions && /*#__PURE__*/React.createElement(Answering, {
    questions: questions,
    answers: answers,
    setAnswers: setAnswers,
    current: current,
    setCurrent: setCurrent,
    onSubmit: submit
  }), phase === "grading" && /*#__PURE__*/React.createElement(Grading, null), phase === "result" && results && /*#__PURE__*/React.createElement(Result, {
    results: results,
    questions: questions,
    answers: answers,
    overall: overall,
    passed: passed,
    lessonNum: lessonNum,
    onContinue: () => passed ? onPass() : onFail()
  }), err && /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--c-attack)",
      padding: 12,
      fontSize: 12
    }
  }, "Error: ", err))));
}
const overlayStyle = {
  position: "fixed",
  inset: 0,
  zIndex: 1000,
  background: "rgba(2, 4, 10, 0.78)",
  backdropFilter: "blur(8px)",
  display: "grid",
  placeItems: "center",
  padding: 24,
  animation: "fadeUp 200ms ease"
};
const modalStyle = {
  background: "rgba(8, 12, 24, 0.95)",
  border: "1px solid var(--accent-border)",
  borderRadius: 18,
  width: "100%",
  maxWidth: 920,
  maxHeight: "92vh",
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 30px 100px rgba(0,0,0,0.6), 0 0 40px var(--accent-soft)",
  overflow: "hidden"
};
const LESSON_TITLES = {
  1: {
    uz: "Windows arxitekturasi",
    en: "Windows Architecture"
  },
  2: {
    uz: "Kernel nima?",
    en: "What is the Kernel?"
  },
  3: {
    uz: "User mode va Kernel mode",
    en: "User Mode vs Kernel Mode"
  },
  4: {
    uz: "Windows boot jarayoni",
    en: "Windows Boot Process"
  }
};
function ModalHeader({
  phase,
  onClose,
  lessonNum = 1
}) {
  const lang = useLang();
  const labels = {
    intro: {
      uz: "Test boshlash",
      en: "Begin assessment"
    },
    answering: {
      uz: "Yozma test",
      en: "Written assessment"
    },
    grading: {
      uz: "AI tekshirmoqda...",
      en: "AI grading..."
    },
    result: {
      uz: "Natijalar",
      en: "Results"
    }
  };
  const t = LESSON_TITLES[lessonNum] || LESSON_TITLES[1];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 32px",
      borderBottom: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "linear-gradient(180deg, rgba(0,255,156,0.04), transparent)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 8,
      background: "var(--accent)",
      color: "#04060d",
      display: "grid",
      placeItems: "center",
      boxShadow: "0 0 20px var(--accent-glow)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "target",
    size: 18
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 18,
      fontWeight: 600
    }
  }, lang === "en" ? labels[phase].en : labels[phase].uz), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "var(--text-3)"
    }
  }, lang === "en" ? `L0${lessonNum} · ${t.en}` : `L0${lessonNum} · ${t.uz}`))), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "btn-ghost btn",
    style: {
      padding: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 16
  })));
}
function Intro({
  onStart,
  loading,
  lessonNum = 1
}) {
  const lang = useLang();
  const hasKey = !!(localStorage.getItem("wa_ai_provider") && localStorage.getItem("wa_ai_key"));
  const t = LESSON_TITLES[lessonNum] || LESSON_TITLES[1];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "32px 0",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 80,
      height: 80,
      borderRadius: "50%",
      background: "radial-gradient(circle, var(--accent-soft), transparent 70%)",
      margin: "0 auto 20px",
      display: "grid",
      placeItems: "center",
      color: "var(--accent)",
      animation: "glow 2.5s ease-in-out infinite"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "target",
    size: 36
  })), /*#__PURE__*/React.createElement("h2", {
    className: "display",
    style: {
      fontSize: 26,
      margin: "0 0 6px",
      letterSpacing: "-0.02em"
    }
  }, lang === "en" ? `${t.en}: mastery check` : `${t.uz}: bilim tekshiruvi`), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-2)",
      margin: "0 0 24px",
      fontSize: 14
    }
  }, lang === "en" ? "3 written questions · AI-graded · 70+ to pass" : "3 ta yozma savol · AI tomonidan baholanadi · 70+ ball — o'tasiz"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 12,
      marginBottom: 26
    }
  }, [{
    icon: "code",
    uz: "3 ta savol",
    en: "3 questions",
    c: "var(--accent)"
  }, {
    icon: "spark",
    uz: "AI baholash",
    en: "AI grading",
    c: "var(--c-auth)"
  }, {
    icon: "warning",
    uz: "Min 70%",
    en: "70% to pass",
    c: "var(--c-warn)"
  }].map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: 14,
      background: "var(--bg-2)",
      border: "1px solid var(--border)",
      borderRadius: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: s.c,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: s.icon,
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600
    }
  }, lang === "en" ? s.en : s.uz)))), !hasKey && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 14,
      background: "rgba(255,145,0,0.07)",
      border: "1px solid rgba(255,145,0,0.3)",
      borderRadius: 10,
      textAlign: "left",
      marginBottom: 16,
      display: "flex",
      gap: 10,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "warning",
    size: 15,
    style: {
      color: "var(--c-warn)",
      flexShrink: 0,
      marginTop: 2
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--text-1)",
      lineHeight: 1.55
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      color: "var(--c-warn)"
    }
  }, lang === "en" ? "AI grader off:" : "AI tekshiruv o'chiq:"), " ", lang === "en" ? "Open Tweaks panel (⚙) → AI Grader, choose provider and paste your API key for real AI grading." : "Tweaks panel (⚙) → AI Tekshiruvchi bo'limiga kiring, provider tanlang va API kalitingizni kiriting.")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      background: "rgba(255,58,94,0.06)",
      border: "1px solid rgba(255,58,94,0.25)",
      borderRadius: 10,
      textAlign: "left",
      marginBottom: 24,
      display: "flex",
      gap: 12,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "warning",
    size: 16,
    style: {
      color: "var(--c-attack)",
      flexShrink: 0,
      marginTop: 2
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: "var(--text-1)",
      lineHeight: 1.55
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      color: "var(--c-attack)"
    }
  }, lang === "en" ? "Heads up:" : "Diqqat:"), " ", lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "If you fail, a ", /*#__PURE__*/React.createElement("code", {
    style: {
      color: "var(--c-attack)"
    }
  }, "30-minute"), " lockout begins and fresh questions will be generated for your next attempt.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Yiqilsangiz ", /*#__PURE__*/React.createElement("code", {
    style: {
      color: "var(--c-attack)"
    }
  }, "30 daqiqalik"), " bloklash boshlanadi va keyingi urinishda yangi savollar bo'ladi."))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: onStart,
    disabled: loading
  }, loading ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-block",
      animation: "spin-slow 1s linear infinite"
    }
  }, "\u21BB"), " ", lang === "en" ? "Generating questions..." : "Savollar tayyorlanmoqda...") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
    name: "play",
    size: 14
  }), " ", lang === "en" ? "Begin" : "Boshlash")));
}
function Answering({
  questions,
  answers,
  setAnswers,
  current,
  setCurrent,
  onSubmit
}) {
  const lang = useLang();
  const q = questions[current];
  const a = answers[current];
  const wordCount = a.trim() ? a.trim().split(/\s+/).length : 0;
  const allAnswered = answers.every(x => x.trim().length > 10);
  const update = val => {
    const next = [...answers];
    next[current] = val;
    setAnswers(next);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      marginBottom: 22
    }
  }, questions.map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    onClick: () => setCurrent(i),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      borderRadius: "50%",
      background: i === current ? "var(--accent)" : answers[i].trim().length > 10 ? "var(--accent-soft)" : "var(--bg-2)",
      color: i === current ? "#04060d" : answers[i].trim().length > 10 ? "var(--accent)" : "var(--text-3)",
      border: `1.5px solid ${i === current ? "var(--accent)" : answers[i].trim().length > 10 ? "var(--accent-border)" : "var(--border)"}`,
      display: "grid",
      placeItems: "center",
      fontFamily: "var(--font-mono)",
      fontWeight: 700,
      fontSize: 11,
      boxShadow: i === current ? "0 0 14px var(--accent-glow)" : "none",
      transition: "all 200ms"
    }
  }, answers[i].trim().length > 10 && i !== current ? /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 12
  }) : i + 1), i < questions.length - 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 1,
      background: answers[i].trim().length > 10 ? "var(--accent-border)" : "var(--border)"
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 22,
      background: "rgba(0,255,156,0.04)",
      border: "1px solid var(--accent-border)",
      borderRadius: 12,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      color: "var(--accent)",
      letterSpacing: 0.18,
      marginBottom: 10
    }
  }, lang === "en" ? `QUESTION ${current + 1} OF 3` : `SAVOL ${current + 1} / 3`), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      fontWeight: 500,
      lineHeight: 1.5,
      color: "var(--text-0)"
    }
  }, lang === "en" ? q.en : q.uz)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("textarea", {
    value: a,
    onChange: e => update(e.target.value),
    placeholder: lang === "en" ? "Write your answer here. Use precise technical terms..." : "Javobingizni shu yerga yozing. Aniq texnik atamalardan foydalaning...",
    style: {
      width: "100%",
      minHeight: 180,
      padding: "16px 18px",
      background: "var(--bg-2)",
      border: "1px solid var(--border)",
      borderRadius: 10,
      color: "var(--text-0)",
      fontFamily: "var(--font-body)",
      fontSize: 14,
      lineHeight: 1.65,
      resize: "vertical",
      outline: "none",
      transition: "border-color 200ms",
      boxSizing: "border-box"
    },
    onFocus: e => e.currentTarget.style.borderColor = "var(--accent)",
    onBlur: e => e.currentTarget.style.borderColor = "var(--border)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      bottom: 8,
      right: 12,
      fontSize: 11,
      fontFamily: "var(--font-mono)",
      color: wordCount < 30 ? "var(--text-3)" : wordCount < 60 ? "var(--c-warn)" : "var(--accent)"
    }
  }, wordCount, " ", lang === "en" ? "words" : "so'z", wordCount < 30 && (lang === "en" ? " · write more" : " · ko'proq yozing"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: 18,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn",
    disabled: current === 0,
    style: {
      opacity: current === 0 ? 0.3 : 1
    },
    onClick: () => setCurrent(current - 1)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-left",
    size: 14
  }), " ", lang === "en" ? "Previous" : "Oldingi"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-3)",
      fontFamily: "var(--font-mono)"
    }
  }, answers.filter(x => x.trim().length > 10).length, "/3 ", lang === "en" ? "answered" : "javob berildi"), current < questions.length - 1 ? /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: () => setCurrent(current + 1)
  }, lang === "en" ? "Next" : "Keyingi", " ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 14
  })) : /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: onSubmit,
    disabled: !allAnswered
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "send",
    size: 14
  }), " ", lang === "en" ? "Submit to AI" : "AI'ga yuborish")));
}
function Grading() {
  const lang = useLang();
  const phasesUz = ["Javoblar Claude'ga yuborilmoqda", "Semantik tahlil", "Texnik terminologiya tekshiruvi", "Yakuniy bal hisoblanmoqda"];
  const phasesEn = ["Submitting answers to Claude", "Semantic analysis", "Technical terminology check", "Final score calculation"];
  const phases = lang === "en" ? phasesEn : phasesUz;
  const [step, setStep] = useQS(0);
  useQE(() => {
    const t = setInterval(() => setStep(s => Math.min(phases.length - 1, s + 1)), 1100);
    return () => clearInterval(t);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "48px 0",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 100,
      height: 100,
      margin: "0 auto 24px",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 100 100",
    style: {
      width: "100%",
      height: "100%",
      animation: "spin-slow 3s linear infinite"
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "50",
    cy: "50",
    r: "42",
    fill: "none",
    stroke: "var(--bg-3)",
    strokeWidth: "3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "50",
    cy: "50",
    r: "42",
    fill: "none",
    stroke: "var(--accent)",
    strokeWidth: "3",
    strokeDasharray: "80 264",
    strokeLinecap: "round"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "grid",
      placeItems: "center",
      color: "var(--accent)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "spark",
    size: 32
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 20,
      fontWeight: 600,
      marginBottom: 6
    }
  }, lang === "en" ? "AI is grading" : "AI tekshirmoqda"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--text-2)",
      fontSize: 13,
      marginBottom: 28
    }
  }, lang === "en" ? "Claude is analyzing your answers" : "Claude javoblaringizni tahlil qilmoqda"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
      maxWidth: 420,
      margin: "0 auto"
    }
  }, phases.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "10px 14px",
      borderRadius: 8,
      background: i <= step ? "var(--accent-soft)" : "var(--bg-2)",
      border: `1px solid ${i <= step ? "var(--accent-border)" : "var(--border)"}`,
      opacity: i <= step ? 1 : 0.5,
      transition: "all 400ms"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 18,
      height: 18,
      color: i < step ? "var(--accent)" : i === step ? "var(--accent)" : "var(--text-3)"
    }
  }, i < step ? /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 18
  }) : i === step ? /*#__PURE__*/React.createElement("div", {
    style: {
      width: 16,
      height: 16,
      border: "2px solid var(--accent)",
      borderTopColor: "transparent",
      borderRadius: "50%",
      animation: "spin-slow 0.8s linear infinite"
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: "currentColor",
      margin: 5
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: "left",
      fontSize: 13,
      fontWeight: 500
    }
  }, p)))));
}
function Result({
  results,
  questions,
  answers,
  overall,
  passed,
  onContinue,
  lessonNum = 1
}) {
  const lang = useLang();
  const [now, setNow] = useQS(Date.now());
  useQE(() => {
    if (passed) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [passed]);

  // Write cooldown start time when failed result first shown
  useQE(() => {
    if (!passed) {
      const existing = localStorage.getItem(COOLDOWN_KEY);
      if (!existing || +existing <= Date.now()) {
        localStorage.setItem(COOLDOWN_KEY, String(Date.now() + COOLDOWN_DURATION));
      }
    }
  }, [passed]);
  const endsAt = !passed ? +localStorage.getItem(COOLDOWN_KEY) || 0 : 0;
  const remaining = Math.max(0, Math.floor((endsAt - now) / 1000));
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const unlocked = !passed ? remaining === 0 : true;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "12px 0 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      letterSpacing: 0.18,
      color: passed ? "var(--accent)" : "var(--c-attack)",
      marginBottom: 8
    }
  }, passed ? lang === "en" ? "// PASSED · OPENING NEXT LESSON" : "// O'TILDI · KEYINGI DARS OCHILMOQDA" : lang === "en" ? "// FAILED · COOLDOWN INITIATED" : "// YIQILDI · BLOKLASH BOSHLANDI"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "center",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "display",
    style: {
      fontSize: 88,
      fontWeight: 600,
      letterSpacing: "-0.04em",
      color: passed ? "var(--accent)" : "var(--c-attack)",
      textShadow: `0 0 40px ${passed ? "var(--accent-glow)" : "rgba(255,58,94,0.4)"}`,
      lineHeight: 1
    }
  }, overall), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      color: "var(--text-2)",
      fontFamily: "var(--font-display)"
    }
  }, "/100")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: "var(--text-2)",
      marginTop: 8
    }
  }, passed ? lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("b", {
    style: {
      color: "var(--accent)"
    }
  }, "Excellent!"), " You've mastered ", /*#__PURE__*/React.createElement("em", null, (LESSON_TITLES[lessonNum] || LESSON_TITLES[1]).en), ".") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("b", {
    style: {
      color: "var(--accent)"
    }
  }, "Mukammal!"), " Siz ", /*#__PURE__*/React.createElement("em", null, (LESSON_TITLES[lessonNum] || LESSON_TITLES[1]).uz), " mavzusini o'zlashtirdingiz.") : lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("b", {
    style: {
      color: "var(--c-attack)"
    }
  }, "Not yet."), " Review the lesson and come back.") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("b", {
    style: {
      color: "var(--c-attack)"
    }
  }, "Hozircha o'ta olmadingiz."), " Darsni qayta o'qib, qaytib keling."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, results.map((r, i) => /*#__PURE__*/React.createElement(ResultCard, {
    key: i,
    idx: i,
    q: questions[i],
    a: answers[i],
    r: r
  }))), !passed && /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "20px 0",
      padding: "18px 24px",
      background: "rgba(255,58,94,0.06)",
      border: "1px solid rgba(255,58,94,0.25)",
      borderRadius: 14,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      color: "var(--text-3)",
      letterSpacing: 0.18,
      marginBottom: 4
    }
  }, unlocked ? lang === "en" ? "READY TO RETRY" : "QAYTA URINISH MUMKIN" : lang === "en" ? "NEXT ATTEMPT IN" : "KEYINGI URINISH"), /*#__PURE__*/React.createElement("div", {
    className: "display",
    style: {
      fontSize: 44,
      fontWeight: 700,
      letterSpacing: "-0.04em",
      color: unlocked ? "var(--accent)" : "var(--c-attack)",
      lineHeight: 1,
      fontVariantNumeric: "tabular-nums"
    }
  }, unlocked ? "00:00" : `${mm}:${ss}`)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      maxWidth: 180
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 5,
      background: "var(--bg-2)",
      borderRadius: 4,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      background: unlocked ? "var(--accent)" : "var(--c-attack)",
      borderRadius: 4,
      width: `${unlocked ? 100 : (COOLDOWN_DURATION / 1000 - remaining) / (COOLDOWN_DURATION / 1000) * 100}%`,
      transition: "width 1s linear"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontSize: 10,
      color: "var(--text-3)",
      fontFamily: "var(--font-mono)"
    }
  }, "30:00 ", lang === "en" ? "total" : "jami"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: `btn ${passed ? "btn-primary" : unlocked ? "btn-primary" : ""}`,
    onClick: onContinue,
    disabled: !passed && !unlocked,
    style: {
      padding: "12px 24px",
      opacity: !passed && !unlocked ? 0.45 : 1,
      cursor: !passed && !unlocked ? "not-allowed" : "pointer"
    }
  }, passed ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 14
  }), " ", lang === "en" ? "Continue to next lesson" : "Keyingi darsga o'tish") : unlocked ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
    name: "play",
    size: 14
  }), " ", lang === "en" ? "Retry with new questions" : "Yangi savollar bilan qayta urinish") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
    name: "lock",
    size: 14
  }), " ", lang === "en" ? `Locked — ${mm}:${ss} remaining` : `Bloklangan — ${mm}:${ss} qoldi`))));
}
function ResultCard({
  idx,
  q,
  a,
  r
}) {
  const lang = useLang();
  const [expanded, setExpanded] = useQS(false);
  const c = r.score >= 70 ? "var(--accent)" : r.score >= 50 ? "var(--c-warn)" : "var(--c-attack)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--bg-2)",
      border: `1px solid ${c}33`,
      borderRadius: 12,
      borderLeft: `3px solid ${c}`,
      padding: "14px 18px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      cursor: "pointer"
    },
    onClick: () => setExpanded(!expanded)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44,
      height: 44,
      borderRadius: "50%",
      background: `${c}12`,
      border: `1.5px solid ${c}`,
      color: c,
      display: "grid",
      placeItems: "center",
      fontFamily: "var(--font-mono)",
      fontWeight: 700,
      fontSize: 14
    }
  }, r.score), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      color: c,
      letterSpacing: 0.1
    }
  }, "Q", idx + 1, " \xB7 ", r.passed ? "PASSED" : "BELOW_THRESHOLD"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 500,
      marginTop: 3,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: expanded ? "normal" : "nowrap"
    }
  }, lang === "en" ? q.en : q.uz))), /*#__PURE__*/React.createElement(Icon, {
    name: expanded ? "chevron-down" : "chevron-right",
    size: 16,
    style: {
      color: "var(--text-3)"
    }
  })), expanded && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      paddingTop: 14,
      borderTop: "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      color: "var(--accent)",
      fontSize: 9.5
    }
  }, "// ", lang === "en" ? "STRENGTHS" : "KUCHLI TOMONLAR"), r.strengths?.length ? /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: "6px 0 0",
      paddingLeft: 18,
      fontSize: 12,
      color: "var(--text-1)",
      lineHeight: 1.55
    }
  }, r.strengths.map((s, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, s))) : /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--text-3)",
      marginTop: 6
    }
  }, "\u2014")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      color: "var(--c-attack)",
      fontSize: 9.5
    }
  }, "// ", lang === "en" ? "WEAKNESSES" : "ZAIF TOMONLAR"), r.weaknesses?.length ? /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: "6px 0 0",
      paddingLeft: 18,
      fontSize: 12,
      color: "var(--text-1)",
      lineHeight: 1.55
    }
  }, r.weaknesses.map((s, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, s))) : /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--text-3)",
      marginTop: 6
    }
  }, "\u2014"))), r.feedback && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      padding: 12,
      background: "var(--bg-3)",
      borderRadius: 8,
      fontSize: 12.5,
      color: "var(--text-1)",
      lineHeight: 1.55,
      fontStyle: "italic"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: c,
      fontWeight: 600,
      fontStyle: "normal"
    }
  }, "AI:"), " ", r.feedback)));
}
window.QuizModal = QuizModal;

// ─── screens/cooldown.jsx ───
// cooldown.jsx — 30-minute lock screen (single-lang, points to Section 01)

const {
  useState: useCS,
  useEffect: useCE
} = React;
function CooldownScreen({
  setRoute,
  user,
  onOpenProfile
}) {
  const lang = useLang();
  const COOLDOWN_KEY = "wa_cooldown_end";
  const DURATION = 30 * 60;
  const lessonNum = (() => {
    try {
      const r = JSON.parse(localStorage.getItem("wa_route") || "{}");
      return r.lesson || 1;
    } catch {
      return 1;
    }
  })();
  const [endsAt, setEndsAt] = useCS(() => {
    const stored = localStorage.getItem(COOLDOWN_KEY);
    if (stored && +stored > Date.now()) return +stored;
    // Already handled by quiz — if no key set, create 30 min from now
    const e = Date.now() + DURATION * 1000;
    localStorage.setItem(COOLDOWN_KEY, String(e));
    return e;
  });
  const [now, setNow] = useCS(Date.now());
  useCE(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const remaining = Math.max(0, Math.floor((endsAt - now) / 1000));
  const elapsed = DURATION - remaining;
  const pct = elapsed / DURATION * 100;
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const unlocked = remaining === 0;
  const reset = () => {
    localStorage.removeItem(COOLDOWN_KEY);
    setRoute({
      name: "lesson",
      section: 1,
      lesson: lessonNum
    });
  };
  const skipForDemo = () => {
    localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
    setEndsAt(Date.now());
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(TopNav, {
    route: {
      name: "cooldown"
    },
    setRoute: setRoute,
    user: user,
    onOpenProfile: onOpenProfile,
    crumb: [{
      label: lang === "en" ? "Section 01" : "01-bo'lim",
      onClick: () => setRoute({
        name: "section",
        section: 1
      })
    }, {
      label: lang === "en" ? "Quiz cooldown" : "Test bloklash"
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 720,
      margin: "0 auto",
      padding: "60px 28px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 220,
      height: 220,
      margin: "0 auto 32px"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 220 220",
    style: {
      width: "100%",
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "cd-grad",
    x1: "0%",
    y1: "0%",
    x2: "100%",
    y2: "100%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: unlocked ? "#00ff9c" : "#ff3a5e"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: unlocked ? "#00d4ff" : "#ffcc44"
  }))), /*#__PURE__*/React.createElement("circle", {
    cx: "110",
    cy: "110",
    r: "96",
    fill: "none",
    stroke: "rgba(255,255,255,0.06)",
    strokeWidth: "3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "110",
    cy: "110",
    r: "96",
    fill: "none",
    stroke: "url(#cd-grad)",
    strokeWidth: "3",
    strokeDasharray: `${pct * 603 / 100} 603`,
    strokeLinecap: "round",
    transform: "rotate(-90 110 110)",
    style: {
      filter: "drop-shadow(0 0 8px " + (unlocked ? "var(--accent-glow)" : "rgba(255,58,94,0.4)") + ")",
      transition: "stroke-dasharray 1s linear"
    }
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "110",
    cy: "110",
    r: "76",
    fill: "rgba(255,58,94,0.04)",
    stroke: "rgba(255,58,94,0.25)",
    strokeWidth: "1"
  }), !unlocked && [0, 1, 2].map(i => /*#__PURE__*/React.createElement("circle", {
    key: i,
    cx: "110",
    cy: "110",
    r: "76",
    fill: "none",
    stroke: "#ff3a5e",
    strokeWidth: "1",
    opacity: "0"
  }, /*#__PURE__*/React.createElement("animate", {
    attributeName: "r",
    values: "76;106;76",
    dur: "3s",
    begin: `${i}s`,
    repeatCount: "indefinite"
  }), /*#__PURE__*/React.createElement("animate", {
    attributeName: "opacity",
    values: "0.6;0;0.6",
    dur: "3s",
    begin: `${i}s`,
    repeatCount: "indefinite"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "grid",
      placeItems: "center",
      color: unlocked ? "var(--accent)" : "var(--c-attack)",
      animation: unlocked ? "none" : "shake 4s ease-in-out infinite"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: unlocked ? "unlock" : "lock",
    size: 56,
    stroke: 1.4
  }))), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      color: unlocked ? "var(--accent)" : "var(--c-attack)",
      marginBottom: 10
    }
  }, unlocked ? lang === "en" ? "// COOLDOWN_COMPLETE · READY_TO_RETRY" : "// BLOKLASH_TUGADI · QAYTA_URINISH" : lang === "en" ? "// ACCESS_DENIED · COOLDOWN_ACTIVE" : "// KIRISH_RAD_ETILDI · BLOKLASH_FAOL"), /*#__PURE__*/React.createElement("h1", {
    className: "display",
    style: {
      fontSize: 38,
      margin: "0 0 4px",
      letterSpacing: "-0.025em"
    }
  }, unlocked ? lang === "en" ? "Ready — go back in" : "Tayyor — qaytib boring" : lang === "en" ? "You didn't pass the quiz" : "Imtihondan o'ta olmadingiz"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-2)",
      fontSize: 14,
      margin: 0
    }
  }, unlocked ? lang === "en" ? "You may retry now — fresh questions will be generated." : "Endi qayta urinishingiz mumkin — yangi savollar generatsiya qilinadi." : lang === "en" ? "Don't worry. Use the time to review the lesson once more." : "Xavotirlanmang. Bu vaqtdan darsni qayta o'qish uchun foydalaning."), !unlocked && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 36,
      padding: "28px 32px",
      background: "var(--surface)",
      border: "1px solid rgba(255,58,94,0.25)",
      borderRadius: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "left"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      color: "var(--text-3)",
      letterSpacing: 0.18
    }
  }, lang === "en" ? "NEXT ATTEMPT IN" : "KEYINGI URINISH"), /*#__PURE__*/React.createElement("div", {
    className: "display",
    style: {
      fontSize: 64,
      fontWeight: 600,
      letterSpacing: "-0.04em",
      color: "var(--c-attack)",
      fontVariantNumeric: "tabular-nums",
      lineHeight: 1,
      textShadow: "0 0 30px rgba(255,58,94,0.35)",
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("span", null, mm), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-3)",
      animation: "flicker 1s steps(2) infinite"
    }
  }, ":"), /*#__PURE__*/React.createElement("span", null, ss)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontSize: 11,
      color: "var(--text-3)",
      fontFamily: "var(--font-mono)"
    }
  }, "MM:SS \xB7 ", lang === "en" ? "30 min total" : "30 daqiqa")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      maxWidth: 240
    }
  }, /*#__PURE__*/React.createElement(Progress, {
    value: pct,
    color: "var(--c-attack)",
    height: 6,
    showVal: false
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      display: "flex",
      justifyContent: "space-between",
      fontSize: 10,
      color: "var(--text-3)",
      fontFamily: "var(--font-mono)"
    }
  }, /*#__PURE__*/React.createElement("span", null, "00:00"), /*#__PURE__*/React.createElement("span", null, "30:00")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      justifyContent: "center",
      marginTop: 24
    }
  }, unlocked ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: reset
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "play",
    size: 14
  }), " ", lang === "en" ? "Retry with new questions" : "Yangi savollar bilan qayta urinish"), /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: () => setRoute({
      name: "lesson",
      section: 1,
      lesson: lessonNum
    })
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "book",
    size: 14
  }), " ", lang === "en" ? "Review the lesson" : "Darsni qayta ko'rish")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: () => setRoute({
      name: "lesson",
      section: 1,
      lesson: lessonNum
    })
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "book",
    size: 14
  }), " ", lang === "en" ? "Read the lesson meanwhile" : "Bu vaqtda darsni o'qing"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost",
    onClick: skipForDemo,
    title: "Demo only: skip timer"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "zap",
    size: 14
  }), " Skip (demo)"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 12,
      marginTop: 40
    }
  }, /*#__PURE__*/React.createElement(ReasonCard, {
    icon: "clock",
    uz: "Vaqt \u2014 ustozdir",
    en: "Time teaches",
    descUz: "30 daqiqa \u2014 darsni qayta ko'rish va atamalarni mustahkamlash uchun yetarli.",
    descEn: "30 minutes is enough to re-read the lesson and lock in the terminology."
  }), /*#__PURE__*/React.createElement(ReasonCard, {
    icon: "zap",
    uz: "Tezlikka qarshi",
    en: "No speedruns",
    descUz: "Tushuncha tezlikdan ustun. Bu testdan taxminlar bilan o'tib bo'lmaydi.",
    descEn: "Understanding beats speed. You can't pass this with guesses."
  }), /*#__PURE__*/React.createElement(ReasonCard, {
    icon: "spark",
    uz: "Yangi savollar",
    en: "Fresh questions",
    descUz: "Qayta urinishda AI yangi savollar generatsiya qiladi \u2014 yodlab bo'lmaydi.",
    descEn: "On your next try, AI generates new questions \u2014 there's no memorizing."
  }))));
}
function ReasonCard({
  icon,
  uz,
  en,
  descUz,
  descEn
}) {
  const lang = useLang();
  return /*#__PURE__*/React.createElement("div", {
    className: "glass",
    style: {
      padding: 18,
      textAlign: "left"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--accent)",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 15,
      fontWeight: 600,
      marginBottom: 8
    }
  }, lang === "en" ? en : uz), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: "var(--text-1)",
      lineHeight: 1.5
    }
  }, lang === "en" ? descEn : descUz));
}
window.CooldownScreen = CooldownScreen;

// ─── screens/final-exam.jsx ───
// final-exam.jsx — Final Exam (single-lang, Section 01 Windows Fundamentals)

const {
  useState: useFS,
  useEffect: useFE,
  useRef: useFR
} = React;
const EXAM_DURATION = 2 * 60 * 60; // 2 hours

const EXAM_QUESTIONS = [{
  uz: "Operatsion tizim nima va u qaysi vazifalarni bajaradi? 4 ta asosiy vazifani aytib bering.",
  en: "What is an OS and what are its core jobs? List 4 main jobs.",
  topic: "OS basics",
  difficulty: "med"
}, {
  uz: "User mode va Kernel mode farqini tushuntiring. Qaysi ring darajalari ishlatiladi?",
  en: "Explain user mode vs kernel mode. Which CPU rings are used?",
  topic: "Rings",
  difficulty: "med"
}, {
  uz: "ntoskrnl.exe ichida qaysi ikki asosiy qatlam bor va ularning mas'uliyati nimadan iborat?",
  en: "ntoskrnl.exe contains which two main layers and what are they responsible for?",
  topic: "Kernel",
  difficulty: "hard"
}, {
  uz: "HAL (Hardware Abstraction Layer) nima qiladi va u nima uchun kerak?",
  en: "What does HAL (Hardware Abstraction Layer) do and why is it needed?",
  topic: "HAL",
  difficulty: "med"
}, {
  uz: "Windows boot ketma-ketligini UEFI'dan login ekraniga qadar bosqichma-bosqich tushuntiring.",
  en: "Walk through the Windows boot sequence step-by-step from UEFI to login.",
  topic: "Boot",
  difficulty: "hard"
}, {
  uz: "Secure Boot qanday ishlaydi va u qaysi tahdidlardan himoya qiladi?",
  en: "How does Secure Boot work and what threats does it stop?",
  topic: "Secure Boot",
  difficulty: "hard"
}, {
  uz: "Jarayon (process) va thread o'rtasidagi farq nima? Qaysi biri scheduling birligi?",
  en: "Difference between process and thread? Which is the scheduling unit?",
  topic: "Processes",
  difficulty: "med"
}, {
  uz: "Handle nima va Object Manager unga qanday aloqasi bor?",
  en: "What is a handle and what's the Object Manager's role?",
  topic: "Handles",
  difficulty: "hard"
}, {
  uz: "Service va oddiy jarayon o'rtasidagi farq nima? SCM (Service Control Manager) qaysi vazifani bajaradi?",
  en: "Service vs normal process? What does SCM do?",
  topic: "Services",
  difficulty: "med"
}, {
  uz: "DLL nima va statik vs dinamik bog'lash farqi qanday?",
  en: "What is a DLL? Static vs dynamic linking?",
  topic: "DLL",
  difficulty: "med"
}, {
  uz: "Win32 API → ntdll → syscall → executive yo'lini batafsil ko'rsating.",
  en: "Walk through Win32 API → ntdll → syscall → executive in detail.",
  topic: "Syscall",
  difficulty: "hard"
}, {
  uz: "Registry hive'larini sanab bering (HKLM, HKCU, HKCR, HKU, HKCC) va har birining vazifasi.",
  en: "List the registry hives (HKLM, HKCU, ...) and what each holds.",
  topic: "Registry",
  difficulty: "med"
}, {
  uz: "NTFS va FAT32 ning eng katta 5 ta farqini sanab bering.",
  en: "List 5 biggest differences between NTFS and FAT32.",
  topic: "NTFS",
  difficulty: "med"
}, {
  uz: "TPM (Trusted Platform Module) nima qiladi va u BitLocker bilan qanday ishlaydi?",
  en: "What does TPM do and how does it work with BitLocker?",
  topic: "TPM",
  difficulty: "hard"
}, {
  uz: "Drayver nima va u nima uchun ring 0 da ishlaydi? BYOVD nima?",
  en: "What is a driver, why does it run in ring 0? What is BYOVD?",
  topic: "Drivers",
  difficulty: "hard"
}, {
  uz: "Windows Event Viewer'da Application, System va Security log'lari nima farq qiladi?",
  en: "Application vs System vs Security logs in Event Viewer?",
  topic: "Logs",
  difficulty: "med"
}, {
  uz: "Task Scheduler qanday ishlaydi va u persistence uchun qanday foydalanish mumkin?",
  en: "How does Task Scheduler work? How is it abused for persistence?",
  topic: "Persistence",
  difficulty: "hard"
}, {
  uz: "PowerShell'da Get-Process va Get-Service buyruqlari nima qaytaradi? Misol bilan.",
  en: "What do Get-Process and Get-Service return? Give examples.",
  topic: "PowerShell",
  difficulty: "med"
}, {
  uz: "Process Explorer va Task Manager o'rtasida nima farq bor? Pentester nima uchun PE'dan foydalanadi?",
  en: "Process Explorer vs Task Manager? Why does a pentester use PE?",
  topic: "Tools",
  difficulty: "med"
}, {
  uz: "Notepad'ni ishga tushirish bitta sichqoncha bosishidan login qilingan user uchun nima qiladi? Barcha qatlamlardan o'tish.",
  en: "What happens from a single click of Notepad? Trace through every layer.",
  topic: "Full trace",
  difficulty: "hard"
}];
function FinalExamScreen({
  setRoute,
  user,
  markLessonComplete,
  onOpenProfile
}) {
  const lang = useLang();
  const [phase, setPhase] = useFS("brief");
  const [answers, setAnswers] = useFS(Array(20).fill(""));
  const [current, setCurrent] = useFS(0);
  const [startTime, setStartTime] = useFS(null);
  const [now, setNow] = useFS(Date.now());
  const [tabSwitches, setTabSwitches] = useFS(0);
  const [warnings, setWarnings] = useFS([]);
  const [submitting, setSubmitting] = useFS(false);
  const [gradingIdx, setGradingIdx] = useFS(0);
  const [examResults, setExamResults] = useFS(null);
  useFE(() => {
    if (phase !== "taking") return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [phase]);
  useFE(() => {
    if (phase !== "taking") return;
    const onVis = () => {
      if (document.hidden) {
        setTabSwitches(n => n + 1);
        setWarnings(w => [...w, {
          t: new Date().toLocaleTimeString(),
          msg: lang === "en" ? "Tab switch detected" : "Tab almashtirish aniqlandi"
        }].slice(-5));
      }
    };
    const onCopy = () => {
      setWarnings(w => [...w, {
        t: new Date().toLocaleTimeString(),
        msg: lang === "en" ? "Clipboard read attempt" : "Clipboard urinishi"
      }].slice(-5));
    };
    document.addEventListener("visibilitychange", onVis);
    document.addEventListener("copy", onCopy);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      document.removeEventListener("copy", onCopy);
    };
  }, [phase, lang]);
  const start = () => {
    setStartTime(Date.now());
    setPhase("taking");
  };
  const elapsed = startTime ? Math.floor((now - startTime) / 1000) : 0;
  const remaining = Math.max(0, EXAM_DURATION - elapsed);
  const hh = String(Math.floor(remaining / 3600)).padStart(2, "0");
  const mm = String(Math.floor(remaining % 3600 / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const answered = answers.filter(a => a.trim().length > 10).length;
  const update = val => {
    const next = [...answers];
    next[current] = val;
    setAnswers(next);
  };
  const hasKey = !!(localStorage.getItem("wa_ai_provider") && localStorage.getItem("wa_ai_key"));
  const submit = async () => {
    setSubmitting(true);
    setPhase("grading");
    const results = [];
    for (let i = 0; i < EXAM_QUESTIONS.length; i++) {
      setGradingIdx(i);
      const q = EXAM_QUESTIONS[i];
      const a = (answers[i] || "").trim();
      // Skip AI call for empty answers — score 0 instantly
      if (!a || a.length < 8) {
        results.push({
          score: 0,
          passed: false,
          key_points: [],
          missing: [lang === "en" ? "No answer provided" : "Javob berilmagan"],
          feedback: lang === "en" ? "Empty answer." : "Javob bo'sh."
        });
        continue;
      }
      try {
        if (hasKey) {
          const prompt = `Windows internals exam grader. Be strict.
Q: ${lang === "en" ? q.en : q.uz}
ANSWER: """${a}"""
Topic: ${q.topic} | Difficulty: ${q.difficulty}
Score 0-100. Surface=20-50. Correct terms+depth=70+. Expert=90+.
JSON only: {"score":<0-100>,"passed":<score>=70>,"key_points":["point"],"missing":["gap"],"feedback":"1-2 sentences in ${lang === "en" ? "English" : "Uzbek"}"}`;
          const text = await gradeWithAI(prompt);
          const cleaned = text.replace(/^```json\s*|```\s*$/g, "").trim();
          results.push(JSON.parse(cleaned));
        } else {
          const wc = a.split(/\s+/).filter(Boolean).length;
          const score = wc < 15 ? 28 : wc < 40 ? 52 : 74;
          results.push({
            score,
            passed: score >= 70,
            key_points: [],
            missing: [lang === "en" ? "Set AI key in Profile for real grading" : "Profilda AI kalitini o'rnating"],
            feedback: ""
          });
        }
      } catch (e) {
        results.push({
          score: 0,
          passed: false,
          key_points: [],
          missing: [String(e).slice(0, 80)],
          feedback: lang === "en" ? "Grading error — check AI key." : "Baholashda xatolik — AI kalitini tekshiring."
        });
      }
    }
    setExamResults(results);
    const overall = Math.round(results.reduce((s, r) => s + r.score, 0) / results.length);
    if (overall >= 85 && markLessonComplete) markLessonComplete("s01_final");
    setPhase("submitted");
    setSubmitting(false);
  };
  return /*#__PURE__*/React.createElement("div", null, phase !== "taking" && /*#__PURE__*/React.createElement(TopNav, {
    route: {
      name: "exam"
    },
    setRoute: setRoute,
    user: user,
    onOpenProfile: onOpenProfile,
    crumb: [{
      label: lang === "en" ? "Section 01" : "01-bo'lim",
      onClick: () => setRoute({
        name: "section",
        section: 1
      })
    }, {
      label: lang === "en" ? "Final exam" : "Final imtihon"
    }]
  }), phase === "brief" && /*#__PURE__*/React.createElement(ExamBrief, {
    onStart: start,
    setRoute: setRoute
  }), phase === "taking" && /*#__PURE__*/React.createElement(ExamTaking, {
    current: current,
    setCurrent: setCurrent,
    answers: answers,
    update: update,
    questions: EXAM_QUESTIONS,
    hh: hh,
    mm: mm,
    ss: ss,
    remaining: remaining,
    tabSwitches: tabSwitches,
    warnings: warnings,
    answered: answered,
    onSubmit: submit,
    submitting: submitting
  }), phase === "grading" && /*#__PURE__*/React.createElement(ExamGrading, {
    idx: gradingIdx,
    total: EXAM_QUESTIONS.length
  }), phase === "submitted" && examResults && /*#__PURE__*/React.createElement(ExamResults, {
    results: examResults,
    questions: EXAM_QUESTIONS,
    answers: answers,
    setRoute: setRoute
  }));
}
function ExamBrief({
  onStart,
  setRoute
}) {
  const lang = useLang();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 720,
      margin: "0 auto",
      padding: "60px 28px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      color: "var(--c-warn)",
      marginBottom: 14
    }
  }, "// SECTION_01 \xB7 FINAL_EXAM"), /*#__PURE__*/React.createElement("h1", {
    className: "display",
    style: {
      fontSize: 44,
      margin: "0 0 6px",
      letterSpacing: "-0.025em"
    }
  }, lang === "en" ? "Windows Fundamentals — Final" : "Windows asoslari — Final"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-2)",
      fontSize: 15,
      margin: 0
    }
  }, lang === "en" ? "20 questions · 2 hours · 85% to pass this section" : "20 ta savol · 2 soat · 85% — bo'limni yakunlash"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 36,
      padding: "24px 28px",
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 14,
      textAlign: "left"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 14
    }
  }, "// ", lang === "en" ? "RULES_OF_ENGAGEMENT" : "QOIDALAR"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, [{
    icon: "code",
    uz: "20 ta yozma savol",
    en: "20 written questions",
    c: "var(--accent)"
  }, {
    icon: "clock",
    uz: "2 soat vaqt cheklovi · timer to'xtatib bo'lmaydi",
    en: "2-hour timer · cannot pause",
    c: "var(--c-warn)"
  }, {
    icon: "target",
    uz: "85% o'tish bali · har bir savol AI tomonidan baholanadi",
    en: "85% to pass · AI grades each question",
    c: "var(--accent)"
  }, {
    icon: "eye",
    uz: "Tab almashtirish va clipboard urinishlari kuzatiladi",
    en: "Tab-switch and clipboard activity is monitored",
    c: "var(--c-attack)"
  }, {
    icon: "warning",
    uz: "3 marta cheat ishorasidan keyin imtihon avtomatik bekor qilinadi",
    en: "3 cheat flags → auto-cancel",
    c: "var(--c-attack)"
  }, {
    icon: "trophy",
    uz: "O'tsangiz keyingi bo'lim ochiladi",
    en: "Passing unlocks the next section",
    c: "var(--c-auth)"
  }].map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 12,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 8,
      background: `${r.c}12`,
      border: `1px solid ${r.c}33`,
      color: r.c,
      display: "grid",
      placeItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: r.icon,
    size: 14
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 500
    }
  }, lang === "en" ? r.en : r.uz))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      justifyContent: "center",
      marginTop: 28
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: () => setRoute({
      name: "section",
      section: 1
    })
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-left",
    size: 14
  }), " ", lang === "en" ? "Cancel" : "Bekor"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: onStart
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "play",
    size: 14
  }), " ", lang === "en" ? "Begin exam" : "Imtihonni boshlash")));
}
function ExamTaking({
  current,
  setCurrent,
  answers,
  update,
  questions,
  hh,
  mm,
  ss,
  remaining,
  tabSwitches,
  warnings,
  answered,
  onSubmit,
  submitting
}) {
  const lang = useLang();
  const q = questions[current];
  const a = answers[current];
  const lowTime = remaining < 600;
  const wordCount = a.trim() ? a.trim().split(/\s+/).length : 0;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      background: "var(--bg-0)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: "rgba(4, 6, 13, 0.95)",
      borderBottom: `1px solid ${lowTime ? "var(--c-attack)" : "var(--border)"}`,
      backdropFilter: "blur(20px)",
      padding: "14px 28px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "logo"
  }, /*#__PURE__*/React.createElement("div", {
    className: "logo-mark"
  }, "W"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      lineHeight: 1
    }
  }, lang === "en" ? "Final Exam" : "Final imtihon"), /*#__PURE__*/React.createElement("div", {
    className: "sub"
  }, "SECTION_01 \xB7 LIVE"))), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      color: "var(--text-3)",
      letterSpacing: 0.1
    }
  }, "Q", String(current + 1).padStart(2, "0"), " / 20 \xB7 ", answered, "/20 ", lang === "en" ? "answered" : "javob")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(LiveDot, {
    color: "var(--c-attack)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 11,
      color: tabSwitches > 0 ? "var(--c-attack)" : "var(--text-2)"
    }
  }, "MONITOR \xB7 ", tabSwitches, " flag", tabSwitches !== 1 ? "s" : "")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 14px",
      background: lowTime ? "rgba(255,58,94,0.1)" : "var(--bg-2)",
      border: `1px solid ${lowTime ? "var(--c-attack)" : "var(--border-strong)"}`,
      borderRadius: 8,
      animation: lowTime ? "shake 1s ease-in-out infinite" : "none"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 14,
    style: {
      color: lowTime ? "var(--c-attack)" : "var(--text-1)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 18,
      fontWeight: 700,
      color: lowTime ? "var(--c-attack)" : "var(--text-0)",
      fontVariantNumeric: "tabular-nums"
    }
  }, hh, ":", mm, ":", ss)), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: onSubmit,
    disabled: submitting,
    style: {
      padding: "8px 18px"
    }
  }, submitting ? lang === "en" ? "Submitting..." : "Yuborilmoqda..." : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
    name: "send",
    size: 14
  }), " ", lang === "en" ? "Submit" : "Yuborish")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "240px 1fr 280px",
      maxWidth: 1400,
      margin: "0 auto",
      padding: "24px 28px",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("aside", {
    style: {
      position: "sticky",
      top: 90,
      alignSelf: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 10
    }
  }, "// ", lang === "en" ? "QUESTIONS" : "SAVOLLAR"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(5, 1fr)",
      gap: 6
    }
  }, questions.map((_, i) => {
    const isCur = current === i;
    const isAnswered = answers[i].trim().length > 10;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: () => setCurrent(i),
      style: {
        appearance: "none",
        border: 0,
        cursor: "pointer",
        aspectRatio: "1",
        borderRadius: 6,
        background: isCur ? "var(--accent)" : isAnswered ? "var(--accent-soft)" : "var(--bg-2)",
        color: isCur ? "#04060d" : isAnswered ? "var(--accent)" : "var(--text-2)",
        border: `1px solid ${isCur ? "var(--accent)" : isAnswered ? "var(--accent-border)" : "var(--border)"}`,
        fontFamily: "var(--font-mono)",
        fontWeight: 600,
        fontSize: 11,
        boxShadow: isCur ? "0 0 12px var(--accent-glow)" : "none",
        transition: "all 200ms"
      }
    }, String(i + 1).padStart(2, "0"));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      padding: 12,
      background: "var(--bg-2)",
      border: "1px solid var(--border)",
      borderRadius: 8,
      fontSize: 11,
      color: "var(--text-2)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 10,
      height: 10,
      background: "var(--accent)",
      borderRadius: 2
    }
  }), /*#__PURE__*/React.createElement("span", null, lang === "en" ? "Current" : "Joriy")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 10,
      height: 10,
      background: "var(--accent-soft)",
      border: "1px solid var(--accent-border)",
      borderRadius: 2
    }
  }), /*#__PURE__*/React.createElement("span", null, lang === "en" ? "Answered" : "Javob berildi")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 10,
      height: 10,
      background: "var(--bg-2)",
      border: "1px solid var(--border)",
      borderRadius: 2
    }
  }), /*#__PURE__*/React.createElement("span", null, lang === "en" ? "Empty" : "Bo'sh")))), /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "chip"
  }, q.topic), /*#__PURE__*/React.createElement("span", {
    className: `chip ${q.difficulty === "hard" ? "chip-red" : "chip-yellow"}`
  }, q.difficulty), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 11,
      color: "var(--text-3)"
    }
  }, wordCount, " ", lang === "en" ? "words" : "so'z")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "22px 24px",
      background: "rgba(0,255,156,0.04)",
      border: "1px solid var(--accent-border)",
      borderRadius: 12,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      color: "var(--accent)",
      letterSpacing: 0.18,
      marginBottom: 10
    }
  }, lang === "en" ? `QUESTION ${current + 1}` : `SAVOL ${current + 1}`), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 19,
      fontWeight: 500,
      lineHeight: 1.4,
      color: "var(--text-0)"
    }
  }, lang === "en" ? q.en : q.uz)), /*#__PURE__*/React.createElement("textarea", {
    value: a,
    onChange: e => update(e.target.value),
    placeholder: lang === "en" ? "Write your answer here..." : "Javobingizni shu yerga yozing...",
    style: {
      width: "100%",
      minHeight: 280,
      padding: "18px 20px",
      background: "var(--bg-2)",
      border: "1px solid var(--border)",
      borderRadius: 10,
      color: "var(--text-0)",
      fontFamily: "var(--font-body)",
      fontSize: 14,
      lineHeight: 1.7,
      resize: "vertical",
      outline: "none",
      boxSizing: "border-box"
    },
    onFocus: e => e.currentTarget.style.borderColor = "var(--accent)",
    onBlur: e => e.currentTarget.style.borderColor = "var(--border)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost btn",
    disabled: current === 0,
    onClick: () => setCurrent(current - 1),
    style: {
      opacity: current === 0 ? 0.3 : 1
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-left",
    size: 14
  }), " ", lang === "en" ? "Previous" : "Oldingi"), /*#__PURE__*/React.createElement("button", {
    className: "btn",
    disabled: current === questions.length - 1,
    onClick: () => setCurrent(current + 1),
    style: {
      opacity: current === questions.length - 1 ? 0.3 : 1
    }
  }, lang === "en" ? "Next" : "Keyingi", " ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 14
  })))), /*#__PURE__*/React.createElement("aside", {
    style: {
      position: "sticky",
      top: 90,
      alignSelf: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass",
    style: {
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 10,
      color: "var(--c-attack)"
    }
  }, "// ", lang === "en" ? "SECURITY_MONITOR" : "XAVFSIZLIK_MONITORI"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(SR, {
    k: lang === "en" ? "Tab focus" : "Tab fokus",
    v: tabSwitches === 0 ? "STABLE" : `${tabSwitches} SWITCH${tabSwitches > 1 ? "ES" : ""}`,
    c: tabSwitches > 0 ? "var(--c-attack)" : "var(--accent)"
  }), /*#__PURE__*/React.createElement(SR, {
    k: "Clipboard",
    v: "CLEAN",
    c: "var(--accent)"
  }), /*#__PURE__*/React.createElement(SR, {
    k: "Network",
    v: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(LiveDot, null), " CONNECTED"),
    c: "var(--accent)"
  }), /*#__PURE__*/React.createElement(SR, {
    k: "Session",
    v: "EX-3C82AF",
    c: "var(--text-1)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "glass",
    style: {
      padding: 16,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 10
    }
  }, "// ", lang === "en" ? "EVENT_LOG" : "VOQEALAR_JURNALI"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      fontSize: 10.5,
      fontFamily: "var(--font-mono)",
      maxHeight: 200,
      overflowY: "auto"
    }
  }, warnings.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--text-3)"
    }
  }, "[--:--:--] ", lang === "en" ? "No events recorded." : "Voqealar yo'q.") : warnings.map((w, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      color: "var(--c-warn)"
    }
  }, "[", w.t, "] ", w.msg)))), /*#__PURE__*/React.createElement("div", {
    className: "glass",
    style: {
      padding: 16,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 8
    }
  }, "// ", lang === "en" ? "PROGRESS" : "TARAQQIYOT"), /*#__PURE__*/React.createElement(Progress, {
    value: answered / 20 * 100,
    color: "var(--accent)",
    height: 5,
    showVal: false
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      display: "flex",
      justifyContent: "space-between",
      fontSize: 11,
      color: "var(--text-2)"
    }
  }, /*#__PURE__*/React.createElement("span", null, answered, " ", lang === "en" ? "answered" : "javob"), /*#__PURE__*/React.createElement("span", null, 20 - answered, " ", lang === "en" ? "left" : "qoldi"))))));
}
function SR({
  k,
  v,
  c
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: 11
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-2)"
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: c
    }
  }, v));
}
function ExamGrading({
  idx,
  total
}) {
  const lang = useLang();
  const pct = Math.round((idx + 1) / total * 100);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 560,
      margin: "0 auto",
      padding: "100px 28px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 80,
      height: 80,
      borderRadius: "50%",
      background: "var(--accent-soft)",
      color: "var(--accent)",
      display: "grid",
      placeItems: "center",
      margin: "0 auto 24px",
      boxShadow: "0 0 40px var(--accent-glow)",
      animation: "glow 2s ease-in-out infinite"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "spark",
    size: 36
  })), /*#__PURE__*/React.createElement("h2", {
    className: "display",
    style: {
      fontSize: 28,
      margin: "0 0 8px"
    }
  }, lang === "en" ? "AI grading your exam…" : "AI imtihonni tekshirmoqda…"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-3)",
      margin: "0 0 28px",
      fontSize: 13,
      fontFamily: "var(--font-mono)"
    }
  }, lang === "en" ? `Question ${idx + 1} of ${total}` : `${idx + 1} / ${total} savol`), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--bg-2)",
      borderRadius: 8,
      height: 8,
      overflow: "hidden",
      border: "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: `${pct}%`,
      background: "linear-gradient(90deg, var(--accent), var(--c-auth))",
      transition: "width 400ms",
      boxShadow: "0 0 12px var(--accent-glow)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      fontSize: 11,
      fontFamily: "var(--font-mono)",
      color: "var(--accent)"
    }
  }, pct, "%"));
}
function ExamResults({
  results,
  questions,
  answers,
  setRoute
}) {
  const lang = useLang();
  const overall = Math.round(results.reduce((s, r) => s + r.score, 0) / results.length);
  const passed = overall >= 85;
  const [expanded, setExpanded] = React.useState(null);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 900,
      margin: "0 auto",
      padding: "40px 28px 80px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginBottom: 36
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 96,
      height: 96,
      borderRadius: "50%",
      margin: "0 auto 20px",
      background: passed ? "var(--accent-soft)" : "rgba(255,58,94,0.12)",
      color: passed ? "var(--accent)" : "var(--c-attack)",
      display: "grid",
      placeItems: "center",
      boxShadow: `0 0 40px ${passed ? "var(--accent-glow)" : "rgba(255,58,94,0.3)"}`
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: passed ? "trophy" : "x",
    size: 44
  })), /*#__PURE__*/React.createElement("h1", {
    className: "display",
    style: {
      fontSize: 40,
      margin: "0 0 6px"
    }
  }, passed ? lang === "en" ? "Section Complete!" : "Bo'lim Yakunlandi!" : lang === "en" ? "Not passed" : "O'tilmadi"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 56,
      fontWeight: 900,
      fontFamily: "var(--font-mono)",
      color: passed ? "var(--accent)" : "var(--c-attack)",
      margin: "12px 0"
    }
  }, overall, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 24,
      opacity: 0.6
    }
  }, "/100")), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-2)",
      margin: 0
    }
  }, lang === "en" ? `85% required · ${results.filter(r => r.score >= 70).length}/20 questions passed` : `85% talab qilinadi · ${results.filter(r => r.score >= 70).length}/20 ta savol o'tildi`), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      justifyContent: "center",
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => setRoute({
      name: "section",
      section: 1
    })
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-left",
    size: 14
  }), " ", lang === "en" ? "Back to Section" : "Bo'limga qaytish"), !passed && /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: () => window.location.reload()
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "play",
    size: 14
  }), " ", lang === "en" ? "Retry" : "Qayta urinish"))), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 16
    }
  }, lang === "en" ? "// DETAILED_RESULTS" : "// BATAFSIL_NATIJALAR"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, results.map((r, i) => {
    const color = r.score >= 70 ? "var(--accent)" : r.score >= 50 ? "var(--c-warn)" : "var(--c-attack)";
    const open = expanded === i;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        background: "var(--surface)",
        border: `1px solid ${open ? color + "44" : "var(--border)"}`,
        borderRadius: 10,
        overflow: "hidden",
        transition: "border 200ms"
      }
    }, /*#__PURE__*/React.createElement("div", {
      onClick: () => setExpanded(open ? null : i),
      style: {
        display: "grid",
        gridTemplateColumns: "36px 1fr auto auto",
        gap: 12,
        alignItems: "center",
        padding: "14px 16px",
        cursor: "pointer"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        color: "var(--text-3)"
      }
    }, "Q", i + 1), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 500
      }
    }, lang === "en" ? questions[i].en : questions[i].uz), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-mono)",
        fontWeight: 800,
        fontSize: 18,
        color,
        minWidth: 44,
        textAlign: "right"
      }
    }, r.score), /*#__PURE__*/React.createElement(Icon, {
      name: open ? "chevron-up" : "chevron-right",
      size: 14,
      style: {
        color: "var(--text-3)"
      }
    })), open && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "0 16px 16px",
        borderTop: "1px solid var(--border)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 12,
        fontSize: 12.5,
        color: "var(--text-2)",
        lineHeight: 1.6,
        background: "var(--bg-2)",
        padding: "10px 14px",
        borderRadius: 8,
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("b", null, lang === "en" ? "Your answer: " : "Javobingiz: "), answers[i] || "(bo'sh)"), r.key_points?.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: "var(--accent)",
        fontFamily: "var(--font-mono)",
        marginBottom: 4
      }
    }, "\u2713 ", lang === "en" ? "KEY POINTS" : "TO'G'RI"), r.key_points.map((p, j) => /*#__PURE__*/React.createElement("div", {
      key: j,
      style: {
        fontSize: 12.5,
        color: "var(--text-1)",
        paddingLeft: 12
      }
    }, "\u2022 ", p))), r.missing?.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: "var(--c-attack)",
        fontFamily: "var(--font-mono)",
        marginBottom: 4
      }
    }, "\u2717 ", lang === "en" ? "MISSING" : "YETISHMAYDI"), r.missing.map((p, j) => /*#__PURE__*/React.createElement("div", {
      key: j,
      style: {
        fontSize: 12.5,
        color: "var(--text-1)",
        paddingLeft: 12
      }
    }, "\u2022 ", p))), r.feedback && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        color: "var(--text-2)",
        fontStyle: "italic",
        borderLeft: `2px solid ${color}`,
        paddingLeft: 10
      }
    }, r.feedback)));
  })));
}
function ExamSubmitted({
  setRoute,
  answered
}) {
  const lang = useLang();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 720,
      margin: "0 auto",
      padding: "80px 28px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 90,
      height: 90,
      borderRadius: "50%",
      background: "var(--accent-soft)",
      color: "var(--accent)",
      display: "grid",
      placeItems: "center",
      margin: "0 auto 24px",
      boxShadow: "0 0 40px var(--accent-glow)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 42,
    stroke: 2
  })), /*#__PURE__*/React.createElement("h1", {
    className: "display",
    style: {
      fontSize: 38,
      margin: "0 0 6px",
      letterSpacing: "-0.025em"
    }
  }, lang === "en" ? "Exam submitted" : "Imtihon yuborildi"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-2)",
      fontSize: 15,
      margin: 0
    }
  }, lang === "en" ? "AI grading takes ~3 minutes. You'll receive results by email." : "AI tahlili ~3 daqiqa davom etadi. Natijani email orqali olasiz."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      padding: 18,
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 10,
      display: "inline-block"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      color: "var(--text-3)",
      letterSpacing: 0.1
    }
  }, "SUBMISSION_ID"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontFamily: "var(--font-mono)",
      color: "var(--accent)",
      marginTop: 4
    }
  }, "EX-3C82AF \xB7 ", answered, "/20")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      justifyContent: "center",
      marginTop: 28
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: () => setRoute({
      name: "section",
      section: 1
    })
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "book",
    size: 14
  }), " ", lang === "en" ? "Section overview" : "Bo'limga qaytish"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => setRoute({
      name: "dashboard"
    })
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "user",
    size: 14
  }), " ", lang === "en" ? "Back to dashboard" : "Dashboard'ga qaytish")));
}
window.FinalExamScreen = FinalExamScreen;

// ─── tweaks-panel.jsx ───
// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "palette": ["#D97757", "#29261b", "#f6f4ef"],
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        options={['#D97757', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakColor  label="Palette" value={t.palette}
//                        options={[['#D97757', '#29261b', '#f6f4ef'],
//                                  ['#475569', '#0f172a', '#f1f5f9']]}
//                        onChange={(v) => setTweak('palette', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;box-sizing:border-box;min-width:0;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null ? keyOrEdits : {
      [keyOrEdits]: val
    };
    setValues(prev => ({
      ...prev,
      ...edits
    }));
    window.parent.postMessage({
      type: '__edit_mode_set_keys',
      edits
    }, '*');
    // Same-window signal so in-page listeners (deck-stage rail thumbnails)
    // can react — the parent message only reaches the host, not peers.
    window.dispatchEvent(new CustomEvent('tweakchange', {
      detail: edits
    }));
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({
  title = 'Tweaks',
  noDeckControls = false,
  children
}) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  // Auto-inject a rail toggle when a <deck-stage> is on the page. The
  // toggle drives the deck's per-viewer _railVisible via window message;
  // state is mirrored from the same localStorage key the deck reads so
  // the control reflects reality across reloads. The mechanism is the
  // message — authors who want custom placement can post it directly
  // and pass noDeckControls to suppress this one.
  const hasDeckStage = React.useMemo(() => typeof document !== 'undefined' && !!document.querySelector('deck-stage'), []);
  // deck-stage enables its rail in connectedCallback, but this panel can
  // mount before that element has upgraded. The initial read catches the
  // common case; the listener covers mounting first. (Older deck-stage.js
  // copies still wait for the host's __omelette_rail_enabled postMessage —
  // same listener handles those.)
  const [railEnabled, setRailEnabled] = React.useState(() => hasDeckStage && !!document.querySelector('deck-stage')?._railEnabled);
  React.useEffect(() => {
    if (!hasDeckStage || railEnabled) return undefined;
    const onMsg = e => {
      if (e.data && e.data.type === '__omelette_rail_enabled') setRailEnabled(true);
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [hasDeckStage, railEnabled]);
  const [railVisible, setRailVisible] = React.useState(() => {
    try {
      return localStorage.getItem('deck-stage.railVisible') !== '0';
    } catch (e) {
      return true;
    }
  });
  const toggleRail = on => {
    setRailVisible(on);
    window.postMessage({
      type: '__deck_rail_visible',
      on
    }, '*');
  };
  const offsetRef = React.useRef({
    x: 16,
    y: 16
  });
  const PAD = 16;
  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth,
      h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y))
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);
  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);
  React.useEffect(() => {
    const onMsg = e => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({
      type: '__edit_mode_available'
    }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({
      type: '__edit_mode_dismissed'
    }, '*');
  };
  const onDragStart = e => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX,
      sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = ev => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, __TWEAKS_STYLE), /*#__PURE__*/React.createElement("div", {
    ref: dragRef,
    className: "twk-panel",
    "data-noncommentable": "",
    style: {
      right: offsetRef.current.x,
      bottom: offsetRef.current.y
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-hd",
    onMouseDown: onDragStart
  }, /*#__PURE__*/React.createElement("b", null, title), /*#__PURE__*/React.createElement("button", {
    className: "twk-x",
    "aria-label": "Close tweaks",
    onMouseDown: e => e.stopPropagation(),
    onClick: dismiss
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "twk-body"
  }, children, hasDeckStage && railEnabled && !noDeckControls && /*#__PURE__*/React.createElement(TweakSection, {
    label: "Deck"
  }, /*#__PURE__*/React.createElement(TweakToggle, {
    label: "Thumbnail rail",
    value: railVisible,
    onChange: toggleRail
  })))));
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "twk-sect"
  }, label), children);
}
function TweakRow({
  label,
  value,
  children,
  inline = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: inline ? 'twk-row twk-row-h' : 'twk-row'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label), value != null && /*#__PURE__*/React.createElement("span", {
    className: "twk-val"
  }, value)), children);
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label,
    value: `${value}${unit}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "twk-slider",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => onChange(Number(e.target.value))
  }));
}
function TweakToggle({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "twk-toggle",
    "data-on": value ? '1' : '0',
    role: "switch",
    "aria-checked": !!value,
    onClick: () => onChange(!value)
  }, /*#__PURE__*/React.createElement("i", null)));
}
function TweakRadio({
  label,
  value,
  options,
  onChange
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Segments wrap mid-word once per-segment width runs out. The track is
  // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px
  // to its own padding, and 11.5px system-ui averages ~6.3px/char — so 2
  // options fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall
  // back to a dropdown rather than wrap.
  const labelLen = o => String(typeof o === 'object' ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({
    2: 16,
    3: 10
  }[options.length] ?? 0);
  if (!fitsAsSegments) {
    // <select> emits strings — map back to the original option value so the
    // fallback stays type-preserving (numbers, booleans) like the segment path.
    const resolve = s => {
      const m = options.find(o => String(typeof o === 'object' ? o.value : o) === s);
      return m === undefined ? s : typeof m === 'object' ? m.value : m;
    };
    return /*#__PURE__*/React.createElement(TweakSelect, {
      label: label,
      value: value,
      options: options,
      onChange: s => onChange(resolve(s))
    });
  }
  const opts = options.map(o => typeof o === 'object' ? o : {
    value: o,
    label: o
  });
  const idx = Math.max(0, opts.findIndex(o => o.value === value));
  const n = opts.length;
  const segAt = clientX => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor((clientX - r.left - 2) / inner * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };
  const onPointerDown = e => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = ev => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    role: "radiogroup",
    onPointerDown: onPointerDown,
    className: dragging ? 'twk-seg dragging' : 'twk-seg'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-seg-thumb",
    style: {
      left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
      width: `calc((100% - 4px) / ${n})`
    }
  }), opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    type: "button",
    role: "radio",
    "aria-checked": o.value === value
  }, o.label))));
}
function TweakSelect({
  label,
  value,
  options,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("select", {
    className: "twk-field",
    value: value,
    onChange: e => onChange(e.target.value)
  }, options.map(o => {
    const v = typeof o === 'object' ? o.value : o;
    const l = typeof o === 'object' ? o.label : o;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })));
}
function TweakText({
  label,
  value,
  placeholder,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("input", {
    className: "twk-field",
    type: "text",
    value: value,
    placeholder: placeholder,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakNumber({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}) {
  const clamp = n => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({
    x: 0,
    val: 0
  });
  const onScrubStart = e => {
    e.preventDefault();
    startRef.current = {
      x: e.clientX,
      val: value
    };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = ev => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "twk-num-lbl",
    onPointerDown: onScrubStart
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value,
    min: min,
    max: max,
    step: step,
    onChange: e => onChange(clamp(Number(e.target.value)))
  }), unit && /*#__PURE__*/React.createElement("span", {
    className: "twk-num-unit"
  }, unit));
}

// Relative-luminance contrast pick — checkmarks drawn over a swatch need to
// read on both #111 and #fafafa without per-option configuration. Hex input
// only (#rgb / #rrggbb); named or rgb()/hsl() colors fall through to "light".
function __twkIsLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, c => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = n >> 16 & 255,
    g = n >> 8 & 255,
    b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}
const __TwkCheck = ({
  light
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 14 14",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M3 7.2 5.8 10 11 4.2",
  fill: "none",
  strokeWidth: "2.2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  stroke: light ? 'rgba(0,0,0,.78)' : '#fff'
}));

// TweakColor — curated color/palette picker. Each option is either a single
// hex string or an array of 1-5 hex strings; the card adapts — a lone color
// renders solid, a palette renders colors[0] as the hero (left ~2/3) with the
// rest stacked in a sharp column on the right. onChange emits the
// option in the shape it was passed (string stays string, array stays array).
// Without options it falls back to the native color input for back-compat.
function TweakColor({
  label,
  value,
  options,
  onChange
}) {
  if (!options || !options.length) {
    return /*#__PURE__*/React.createElement("div", {
      className: "twk-row twk-row-h"
    }, /*#__PURE__*/React.createElement("div", {
      className: "twk-lbl"
    }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("input", {
      type: "color",
      className: "twk-swatch",
      value: value,
      onChange: e => onChange(e.target.value)
    }));
  }
  // Native <input type=color> emits lowercase hex per the HTML spec, so
  // compare case-insensitively. String() guards JSON.stringify(undefined),
  // which returns the primitive undefined (no .toLowerCase).
  const key = o => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-chips",
    role: "radiogroup"
  }, options.map((o, i) => {
    const colors = Array.isArray(o) ? o : [o];
    const [hero, ...rest] = colors;
    const sup = rest.slice(0, 4);
    const on = key(o) === cur;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      className: "twk-chip",
      role: "radio",
      "aria-checked": on,
      "data-on": on ? '1' : '0',
      "aria-label": colors.join(', '),
      title: colors.join(' · '),
      style: {
        background: hero
      },
      onClick: () => onChange(o)
    }, sup.length > 0 && /*#__PURE__*/React.createElement("span", null, sup.map((c, j) => /*#__PURE__*/React.createElement("i", {
      key: j,
      style: {
        background: c
      }
    }))), on && /*#__PURE__*/React.createElement(__TwkCheck, {
      light: __twkIsLight(hero)
    }));
  })));
}
function TweakButton({
  label,
  onClick,
  secondary = false
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: secondary ? 'twk-btn secondary' : 'twk-btn',
    onClick: onClick
  }, label);
}
Object.assign(window, {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRow,
  TweakSlider,
  TweakToggle,
  TweakRadio,
  TweakSelect,
  TweakText,
  TweakNumber,
  TweakColor,
  TweakButton
});

// ─── app.jsx ───
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// app.jsx — main app: router, theme, language, profile

const {
  useState: useAS,
  useEffect: useAE,
  useCallback: useACB
} = React;
const THEME_KEY = "wa_theme";
function loadTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || "green";
  } catch {
    return "green";
  }
}

// ── Progress persistence ──────────────────────────────────────────────────────
const PROGRESS_KEY = "wa_progress";
const ROUTE_KEY = "wa_route";
function loadProgress() {
  try {
    const s = localStorage.getItem(PROGRESS_KEY);
    if (s) return JSON.parse(s);
  } catch {}
  return {
    xp: 0,
    level: 1,
    completedLessons: [],
    name: "Dagzo",
    initials: "DZ"
  };
}
function saveProgress(p) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
  } catch {}
}
function loadRoute() {
  try {
    const s = localStorage.getItem(ROUTE_KEY);
    if (s) {
      const r = JSON.parse(s);
      // Never restore mid-lesson — always open at dashboard
      if (r.name === "lesson") return {
        name: "dashboard"
      };
      return r;
    }
  } catch {}
  return {
    name: "landing"
  };
}
function saveRoute(r) {
  try {
    localStorage.setItem(ROUTE_KEY, JSON.stringify(r));
  } catch {}
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
function xpToLevel(xp) {
  return Math.max(1, Math.floor(xp / 500) + 1);
}

// ─────────────────────────────────────────────────────────────────────────────
function App() {
  const [theme, setThemeState] = useAS(loadTheme);
  const [lang, _setLang] = useAS(() => {
    try {
      return localStorage.getItem("wa_lang") || "uz";
    } catch {
      return "uz";
    }
  });
  const setLang = v => {
    _setLang(v);
    try {
      localStorage.setItem("wa_lang", v);
    } catch {}
  };
  const setTheme = v => {
    setThemeState(v);
    try {
      localStorage.setItem(THEME_KEY, v);
    } catch {}
  };
  const [route, _setRoute] = useAS(loadRoute);
  const setRoute = r => {
    _setRoute(r);
    saveRoute(r);
    window.scrollTo({
      top: 0,
      behavior: "instant"
    });
  };
  const [progress, _setProgress] = useAS(loadProgress);
  const updateProgress = useACB(patch => {
    _setProgress(prev => {
      const next = {
        ...prev,
        ...patch
      };
      saveProgress(next);
      return next;
    });
  }, []);
  const markLessonComplete = useACB(lessonKey => {
    _setProgress(prev => {
      if (prev.completedLessons.includes(lessonKey)) return prev;
      const completedLessons = [...prev.completedLessons, lessonKey];
      const xp = prev.xp + XP_PER_LESSON;
      const level = xpToLevel(xp);
      const next = {
        ...prev,
        completedLessons,
        xp,
        level
      };
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
    completedLessons: progress.completedLessons || []
  };
  const screenProps = {
    setRoute,
    user,
    markLessonComplete,
    onOpenProfile: () => setProfileOpen(true)
  };
  return /*#__PURE__*/React.createElement(LangContext.Provider, {
    value: {
      lang,
      setLang
    }
  }, /*#__PURE__*/React.createElement(ParticleBg, {
    mode: "particles",
    count: 80
  }), /*#__PURE__*/React.createElement(RouteRender, {
    route: route,
    screenProps: screenProps
  }), profileOpen && /*#__PURE__*/React.createElement(ProfileModal, {
    user: user,
    theme: theme,
    setTheme: setTheme,
    onSave: patch => {
      updateProgress(patch);
      setProfileOpen(false);
    },
    onReset: () => {
      if (!window.confirm(lang === "en" ? "Reset all progress?" : "Barcha progressni o'chirasizmi?")) return;
      clearAll();
      _setProgress(loadProgress());
      _setRoute({
        name: "landing"
      });
      saveRoute({
        name: "landing"
      });
      setProfileOpen(false);
    },
    onClose: () => setProfileOpen(false)
  }));
}

// ─────────────────────────────────────────────────────────────
// Profile Modal
// ─────────────────────────────────────────────────────────────
function ProfileModal({
  user,
  theme,
  setTheme,
  onSave,
  onReset,
  onClose
}) {
  const lang = useLang();
  const [name, setName] = useAS(user.name);
  const [provider, setProvider] = useAS(() => localStorage.getItem("wa_ai_provider") || "");
  const [apiKey, setApiKey] = useAS(() => localStorage.getItem("wa_ai_key") || "");
  const [showKey, setShowKey] = useAS(false);
  const [saved, setSaved] = useAS(false);
  const PROVIDERS = [{
    id: "groq",
    label: "Groq",
    hint: "gsk_...",
    url: "https://console.groq.com/keys",
    free: true
  }, {
    id: "openai",
    label: "OpenAI",
    hint: "sk-...",
    url: "https://platform.openai.com/api-keys",
    free: false
  }, {
    id: "anthropic",
    label: "Claude",
    hint: "sk-ant-...",
    url: "https://console.anthropic.com/settings/keys",
    free: false
  }, {
    id: "gemini",
    label: "Gemini",
    hint: "AIza...",
    url: "https://aistudio.google.com/api-keys",
    free: false
  }];
  const THEMES = ["green", "blue", "purple"];
  const handleSave = () => {
    localStorage.setItem("wa_ai_provider", provider);
    localStorage.setItem("wa_ai_key", apiKey);
    onSave({
      name: name.trim() || "Dagzo"
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };
  const initials = (name.trim() || "Dagzo").slice(0, 2).toUpperCase();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 1000,
      background: "rgba(2,4,10,0.8)",
      backdropFilter: "blur(8px)",
      display: "grid",
      placeItems: "center",
      padding: 24
    },
    onClick: e => e.target === e.currentTarget && onClose()
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(8,12,24,0.97)",
      border: "1px solid var(--accent-border)",
      borderRadius: 20,
      width: "100%",
      maxWidth: 480,
      boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 40px var(--accent-soft)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "22px 28px",
      borderBottom: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "linear-gradient(180deg,rgba(0,255,136,0.04),transparent)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 52,
      height: 52,
      borderRadius: "50%",
      background: "linear-gradient(135deg,#00ff88,#0af,#a855f7)",
      padding: 2,
      boxShadow: "0 0 16px rgba(0,255,136,0.4)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      background: "radial-gradient(circle at 35% 35%,#0d1a12,#04060d)",
      display: "grid",
      placeItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      background: "linear-gradient(135deg,#00ff88,#0af)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontSize: 16,
      fontWeight: 900,
      fontFamily: "var(--font-mono)"
    }
  }, initials))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      bottom: 2,
      right: 2,
      width: 11,
      height: 11,
      borderRadius: "50%",
      background: "#00ff88",
      border: "2px solid #04060d",
      boxShadow: "0 0 6px #00ff88"
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 18,
      fontWeight: 700
    }
  }, lang === "en" ? "Profile" : "Profil"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--text-3)",
      fontFamily: "var(--font-mono)"
    }
  }, "LVL ", user.level, " \xB7 ", user.xp, " XP \xB7 ", user.completedLessons.length, " ", lang === "en" ? "lessons" : "dars"))), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      appearance: "none",
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "var(--text-2)",
      padding: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 18
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "24px 28px",
      display: "flex",
      flexDirection: "column",
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 11,
      fontFamily: "var(--font-mono)",
      color: "var(--accent)",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      display: "block",
      marginBottom: 8
    }
  }, lang === "en" ? "// DISPLAY_NAME" : "// ISM"), /*#__PURE__*/React.createElement("input", {
    value: name,
    onChange: e => setName(e.target.value),
    maxLength: 30,
    style: {
      width: "100%",
      boxSizing: "border-box",
      background: "var(--bg-2)",
      border: "1px solid var(--border)",
      borderRadius: 10,
      padding: "10px 14px",
      fontSize: 14,
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      color: "var(--text-0)",
      outline: "none"
    },
    onFocus: e => e.target.style.borderColor = "var(--accent)",
    onBlur: e => e.target.style.borderColor = "var(--border)"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 11,
      fontFamily: "var(--font-mono)",
      color: "var(--accent)",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      display: "block",
      marginBottom: 8
    }
  }, lang === "en" ? "// ACCENT_THEME" : "// RANG_MAVZU"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, THEMES.map(t => {
    const colors = {
      green: "#00ff88",
      blue: "#4d8bff",
      purple: "#a855f7"
    };
    return /*#__PURE__*/React.createElement("button", {
      key: t,
      onClick: () => setTheme(t),
      style: {
        flex: 1,
        padding: "10px 0",
        borderRadius: 10,
        cursor: "pointer",
        appearance: "none",
        border: `2px solid ${theme === t ? colors[t] : "var(--border)"}`,
        background: theme === t ? `${colors[t]}15` : "var(--bg-2)",
        color: theme === t ? colors[t] : "var(--text-2)",
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        fontWeight: 700,
        textTransform: "capitalize",
        transition: "all 150ms",
        boxShadow: theme === t ? `0 0 12px ${colors[t]}44` : "none"
      }
    }, t);
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 11,
      fontFamily: "var(--font-mono)",
      color: "var(--accent)",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      display: "block",
      marginBottom: 8
    }
  }, lang === "en" ? "// AI_GRADER · PROVIDER" : "// AI_TEKSHIRUVCHI · PROVIDER"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      marginBottom: 10,
      flexWrap: "wrap"
    }
  }, PROVIDERS.map(p => /*#__PURE__*/React.createElement("button", {
    key: p.id,
    onClick: () => setProvider(p.id),
    style: {
      flex: "1 1 auto",
      padding: "9px 8px",
      borderRadius: 8,
      cursor: "pointer",
      appearance: "none",
      border: `1.5px solid ${provider === p.id ? "var(--accent)" : "var(--border)"}`,
      background: provider === p.id ? "var(--accent-soft)" : "var(--bg-2)",
      color: provider === p.id ? "var(--accent)" : "var(--text-2)",
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      fontWeight: 700,
      transition: "all 150ms",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 2
    }
  }, p.label, p.free && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      color: "var(--accent)",
      opacity: 0.8,
      fontWeight: 900
    }
  }, "BEPUL")))), provider && (() => {
    const prov = PROVIDERS.find(p => p.id === provider);
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative"
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: showKey ? "text" : "password",
      placeholder: prov?.hint,
      value: apiKey,
      onChange: e => setApiKey(e.target.value),
      style: {
        width: "100%",
        boxSizing: "border-box",
        background: "var(--bg-2)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: "10px 40px 10px 14px",
        fontSize: 13,
        fontFamily: "var(--font-mono)",
        color: "var(--text-0)",
        outline: "none"
      },
      onFocus: e => e.target.style.borderColor = "var(--accent)",
      onBlur: e => e.target.style.borderColor = "var(--border)"
    }), /*#__PURE__*/React.createElement("button", {
      onClick: () => setShowKey(s => !s),
      style: {
        position: "absolute",
        right: 12,
        top: "50%",
        transform: "translateY(-50%)",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "var(--text-3)",
        fontSize: 14,
        padding: 0
      }
    }, showKey ? "🙈" : "👁")), prov?.url && /*#__PURE__*/React.createElement("a", {
      href: prov.url,
      target: "_blank",
      rel: "noopener noreferrer",
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        marginTop: 7,
        fontSize: 11,
        fontFamily: "var(--font-mono)",
        color: "var(--accent)",
        opacity: 0.8,
        textDecoration: "none"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 10
    }), " ", lang === "en" ? `Get ${prov.label} API key →` : `${prov.label} API kalitini olish →`));
  })()), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      paddingTop: 4
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onReset,
    style: {
      flex: "0 0 auto",
      padding: "10px 16px",
      borderRadius: 10,
      cursor: "pointer",
      appearance: "none",
      border: "1px solid rgba(255,58,94,0.3)",
      background: "rgba(255,58,94,0.06)",
      color: "var(--c-attack)",
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      fontWeight: 700
    }
  }, lang === "en" ? "Reset progress" : "Progressni o'chir"), /*#__PURE__*/React.createElement("button", {
    onClick: handleSave,
    style: {
      flex: 1,
      padding: "12px 0",
      borderRadius: 10,
      cursor: "pointer",
      appearance: "none",
      border: `1px solid ${saved ? "var(--accent)" : "var(--accent-border)"}`,
      background: saved ? "var(--accent-soft)" : "var(--accent)",
      color: saved ? "var(--accent)" : "#04060d",
      fontFamily: "var(--font-display)",
      fontSize: 14,
      fontWeight: 700,
      transition: "all 200ms",
      boxShadow: "0 0 20px var(--accent-glow)"
    }
  }, saved ? lang === "en" ? "✓ Saved!" : "✓ Saqlandi!" : lang === "en" ? "Save changes" : "Saqlash")))));
}

// ─────────────────────────────────────────────────────────────
function RouteRender({
  route,
  screenProps
}) {
  switch (route.name) {
    case "landing":
      return /*#__PURE__*/React.createElement(LandingScreen, screenProps);
    case "dashboard":
      return /*#__PURE__*/React.createElement(DashboardScreen, screenProps);
    case "section":
      return /*#__PURE__*/React.createElement(SectionScreen, _extends({}, screenProps, {
        section: route.section || 1
      }));
    case "lesson":
      return /*#__PURE__*/React.createElement(LessonScreen, _extends({}, screenProps, {
        lessonNum: route.lesson || 1
      }));
    case "cooldown":
      return /*#__PURE__*/React.createElement(CooldownScreen, screenProps);
    case "exam":
      return /*#__PURE__*/React.createElement(FinalExamScreen, screenProps);
    default:
      return /*#__PURE__*/React.createElement(LandingScreen, screenProps);
  }
}
const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(/*#__PURE__*/React.createElement(App, null));
