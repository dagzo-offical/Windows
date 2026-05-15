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
  crumb
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
      section: 3
    })
  }), /*#__PURE__*/React.createElement(NavLink, {
    label: lang === "en" ? "Labs" : "Laboratoriya",
    sub: "Labs"
  }), /*#__PURE__*/React.createElement(NavLink, {
    label: lang === "en" ? "Leaderboard" : "Reyting",
    sub: "Leaderboard"
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
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "6px 12px 6px 6px",
      borderRadius: 999,
      background: "var(--surface)",
      border: "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      borderRadius: "50%",
      background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
      display: "grid",
      placeItems: "center",
      color: "#04060d",
      fontWeight: 700,
      fontSize: 12,
      fontFamily: "var(--font-mono)"
    }
  }, user?.initials || "AK"), /*#__PURE__*/React.createElement("div", {
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
  }, "LVL ", user?.level || 14, " \xB7 ", user?.xp || "4,820", " XP")))));
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
  LabStep
});

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
  user
}) {
  const lang = useLang();
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(TopNav, {
    route: {
      name: "dashboard"
    },
    setRoute: setRoute,
    user: user,
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
  }, /*#__PURE__*/React.createElement(LiveDot, null), " \xA0OPERATOR_ID: ", user?.name?.toUpperCase().replace(/\s/g, "_") || "DAGZO", " \xB7 LAST_LOGIN: just now"), /*#__PURE__*/React.createElement("h1", {
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

// ─────────────────────────────────────────────────────────────
function LessonScreen({
  setRoute,
  user,
  markLessonComplete
}) {
  const lang = useLang();
  const [progress, setProgress] = useLS(0);
  const [quizOpen, setQuizOpen] = useLS(false);
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
      display: "grid",
      gridTemplateColumns: "260px 1fr",
      maxWidth: 1320,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement(LessonTOC, null), /*#__PURE__*/React.createElement("div", {
    className: "page",
    style: {
      padding: "32px 28px 80px",
      maxWidth: "100%"
    }
  }, /*#__PURE__*/React.createElement(LessonHero, null), /*#__PURE__*/React.createElement(Section1Bigpicture, null), /*#__PURE__*/React.createElement(Section2Theory, null), /*#__PURE__*/React.createElement(Section3Layered, null), /*#__PURE__*/React.createElement(Section4Boot, null), /*#__PURE__*/React.createElement(Section5Syscall, null), /*#__PURE__*/React.createElement(Section6Security, null), /*#__PURE__*/React.createElement(Section7Lab, null), /*#__PURE__*/React.createElement(Section8Comparison, null), /*#__PURE__*/React.createElement(Section9Summary, null), /*#__PURE__*/React.createElement(LessonNextNav, {
    setRoute: setRoute,
    onQuizStart: () => setQuizOpen(true)
  }))), quizOpen && /*#__PURE__*/React.createElement(QuizModal, {
    onClose: () => setQuizOpen(false),
    onPass: () => {
      setQuizOpen(false);
      if (markLessonComplete) markLessonComplete("s01_l01");
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
function LessonTOC() {
  const lang = useLang();
  const sections = [{
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
  }, {
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

// ─────────────────────────────────────────────────────────────
function LessonHero() {
  const lang = useLang();
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
  }, /*#__PURE__*/React.createElement(LiveDot, null), /*#__PURE__*/React.createElement("span", null, lang === "en" ? `SECTION ${LESSON.section} · LESSON ${LESSON.num} · IN PROGRESS` : `${LESSON.section}-BO'LIM · DARS ${LESSON.num} · DAVOM ETMOQDA`)), /*#__PURE__*/React.createElement("h1", {
    className: "display",
    style: {
      fontSize: "clamp(36px, 4.4vw, 56px)",
      margin: 0,
      letterSpacing: "-0.025em",
      lineHeight: 1.05
    }
  }, lang === "en" ? LESSON.en : LESSON.uz), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--text-2)",
      fontSize: 17,
      marginTop: 8
    }
  }, lang === "en" ? LESSON.subEn : LESSON.subUz), /*#__PURE__*/React.createElement("div", {
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
  }), " 36 min"), /*#__PURE__*/React.createElement("span", {
    className: "chip chip-blue"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "graph",
    size: 11
  }), " ", lang === "en" ? "9 diagrams" : "9 diagramma"), /*#__PURE__*/React.createElement("span", {
    className: "chip chip-purple"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "terminal",
    size: 11
  }), " ", lang === "en" ? "3 labs" : "3 lab"), /*#__PURE__*/React.createElement("span", {
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
  }, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "The complete Windows architecture from the silicon up \u2014 ", /*#__PURE__*/React.createElement("em", null, "user mode vs kernel mode"), ", the executive layer, microkernel, HAL, and how a single mouse click cascades through every one of them. We'll end where every Windows security problem begins: ", /*#__PURE__*/React.createElement("em", null, "the user/kernel boundary"), ".") : /*#__PURE__*/React.createElement(React.Fragment, null, "Windows tizimining to'liq arxitekturasi \u2014 hardware'dan boshlab, ", /*#__PURE__*/React.createElement("em", null, "user mode va kernel mode"), ", executive qatlam, microkernel, HAL, va bir sichqoncha bosishi shu qatlamlarning har biridan qanday o'tishini ko'ramiz. Yakunda \u2014 har bir Windows xavfsizlik muammosi qaerdan boshlanishi: ", /*#__PURE__*/React.createElement("em", null, "user/kernel chegarasi"), ".")))));
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
  }), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "An ", /*#__PURE__*/React.createElement(Term, null, "operating system"), " is the program that sits between your applications and the physical hardware. It is the only piece of software that talks directly to the CPU, RAM, disks and network cards. Everything else \u2014 Chrome, Steam, even ", /*#__PURE__*/React.createElement("code", null, "cmd.exe"), " \u2014 asks the OS politely, and the OS decides.") : /*#__PURE__*/React.createElement(React.Fragment, null, "\xAB", /*#__PURE__*/React.createElement(Term, null, "Operatsion tizim"), "\xBB \u2014 bu sizning ilovalaringiz va fizik apparat (hardware) o'rtasida turadigan dasturiy ta'minot. U yagona dasturdir, u CPU, RAM, disk va tarmoq kartalari bilan to'g'ridan-to'g'ri muloqot qiladi. Boshqa hamma narsa \u2014 Chrome, Steam, hatto ", /*#__PURE__*/React.createElement("code", null, "cmd.exe"), " ham \u2014 OS'dan murojaat qilib so'raydi, OS qaror qabul qiladi.")), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "Without an OS, every application would need to know exactly how each piece of hardware works \u2014 a hopeless task on a planet with thousands of GPU variants. The OS gives applications a ", /*#__PURE__*/React.createElement(Em, null, "clean, unified view"), " of the machine and protects them from each other.") : /*#__PURE__*/React.createElement(React.Fragment, null, "OS bo'lmaganida, har bir ilova har bir apparatning aniq qanday ishlashini bilishi kerak bo'lar edi \u2014 bu, sayyoramizda ming xil GPU mavjudligini hisobga olganda, imkonsiz vazifa. OS ilovalarga mashinaning ", /*#__PURE__*/React.createElement(Em, null, "tozalangan, yagonalashtirilgan ko'rinishini"), " beradi va ularni bir-biridan himoya qiladi.")), /*#__PURE__*/React.createElement(Callout, {
    color: "var(--c-system)",
    icon: "info",
    titleUz: "Eslatma",
    titleEn: "Note"
  }, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "Windows kernel (", /*#__PURE__*/React.createElement("code", null, "ntoskrnl.exe"), ") was originally written by ", /*#__PURE__*/React.createElement("strong", null, "Dave Cutler's"), " team, who previously built the VAX/VMS kernel at DEC. That's why early Windows NT and VMS look surprisingly similar to anyone who's seen both.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Windows yadrosi (", /*#__PURE__*/React.createElement("code", null, "ntoskrnl.exe"), ") DEC kompaniyasida VAX/VMS yadrosini yozgan ", /*#__PURE__*/React.createElement("strong", null, "Dave Cutler"), " jamoasi tomonidan yaratilgan. Shuning uchun erta Windows NT va VMS ko'rgan odamga g'alati darajada o'xshashdir.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 12,
      marginTop: 28
    }
  }, [{
    icon: "users",
    n: "1",
    uz: "Foydalanuvchini ajratish",
    en: "User isolation"
  }, {
    icon: "cpu",
    n: "2",
    uz: "Apparatni abstrakt qilish",
    en: "Hardware abstraction"
  }, {
    icon: "layers",
    n: "3",
    uz: "Resurslarni boshqarish",
    en: "Resource management"
  }, {
    icon: "shield",
    n: "4",
    uz: "Xavfsizlikni ta'minlash",
    en: "Enforce security"
  }].map((b, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "glass",
    style: {
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      color: "var(--accent)",
      letterSpacing: 0.1
    }
  }, lang === "en" ? "JOB" : "VAZIFA", " #", b.n), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      color: "var(--accent)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: b.icon,
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 17,
      fontWeight: 600,
      marginTop: 8
    }
  }, lang === "en" ? b.en : b.uz)))));
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
  }, lang === "en" ? "2.1 — Process and thread" : "2.1 — Jarayon va Thread"), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "A ", /*#__PURE__*/React.createElement(Term, null, "process"), " is a running instance of a program. It has its own private virtual address space, security token, set of handles, and one or more threads. A ", /*#__PURE__*/React.createElement(Term, null, "thread"), " is the actual scheduling unit \u2014 the thing the CPU executes. One process can have one thread (notepad) or thousands (chrome.exe).") : /*#__PURE__*/React.createElement(React.Fragment, null, "\xAB", /*#__PURE__*/React.createElement(Term, null, "Jarayon"), "\xBB (process) \u2014 ishlayotgan dasturning bir nusxasi. Uning o'z xususiy virtual manzil maydoni, xavfsizlik tokeni, handle'lar to'plami, va bir yoki bir nechta thread'i bor. \xAB", /*#__PURE__*/React.createElement(Term, null, "Thread"), "\xBB \u2014 CPU bajarayotgan haqiqiy birlik. Bir jarayon bitta thread (notepad) yoki minglab (chrome.exe) thread'ga ega bo'lishi mumkin.")), /*#__PURE__*/React.createElement("h3", {
    style: subhead
  }, lang === "en" ? "2.2 — User mode vs Kernel mode" : "2.2 — User mode va Kernel mode"), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "Modern CPUs enforce ", /*#__PURE__*/React.createElement(Em, null, "privilege rings"), ". Windows uses two: ", /*#__PURE__*/React.createElement(Em, null, "ring 3"), " (user mode) and ", /*#__PURE__*/React.createElement(Em, null, "ring 0"), " (kernel mode). In user mode your code cannot touch hardware, cannot read another process's memory, and cannot execute privileged instructions. In kernel mode there are no rules \u2014 a single buggy driver can crash the entire machine. That's why Windows treats the boundary between them as sacred.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Zamonaviy protsessorlar ", /*#__PURE__*/React.createElement(Em, null, "privilege ring"), " tushunchasini ta'minlaydi. Windows ikkitasini ishlatadi: ", /*#__PURE__*/React.createElement(Em, null, "ring 3"), " (user mode) va ", /*#__PURE__*/React.createElement(Em, null, "ring 0"), " (kernel mode). User mode'da sizning kodingiz apparatga tegmaydi, boshqa jarayonning xotirasini o'qiy olmaydi va imtiyozli buyruqlarni bajara olmaydi. Kernel mode'da qoidalar yo'q \u2014 bitta noto'g'ri drayver butun mashinani o'chirishi mumkin. Shuning uchun Windows ular orasidagi chegarani muqaddas sifatida ko'radi.")), /*#__PURE__*/React.createElement("h3", {
    style: subhead
  }, lang === "en" ? "2.3 — The executive and the kernel" : "2.3 — Executive va microkernel"), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "Inside the kernel mode, Windows is split into two layers. The ", /*#__PURE__*/React.createElement(Term, null, "microkernel"), " handles the lowest-level mechanics: scheduling threads, synchronizing CPUs, dispatching interrupts. The ", /*#__PURE__*/React.createElement(Term, null, "executive"), " sits above it and implements every ", /*#__PURE__*/React.createElement("em", null, "policy"), " \u2014 what is a process, what is a file, who can open it. They live together in ", /*#__PURE__*/React.createElement("code", null, "ntoskrnl.exe"), ".") : /*#__PURE__*/React.createElement(React.Fragment, null, "Kernel mode ichida Windows ikki qatlamga bo'linadi. ", /*#__PURE__*/React.createElement(Term, null, "Microkernel"), " eng past darajadagi mexanizmlarni boshqaradi: thread'larni rejalashtirish, CPU'larni sinxronlash, uzilishlarni yo'naltirish. ", /*#__PURE__*/React.createElement(Term, null, "Executive"), " uning ustida turadi va har bir ", /*#__PURE__*/React.createElement("em", null, "siyosatni"), " amalga oshiradi \u2014 jarayon nima, fayl nima, kim ochishi mumkin. Ikkalasi ham ", /*#__PURE__*/React.createElement("code", null, "ntoskrnl.exe"), " ichida yashaydi.")), /*#__PURE__*/React.createElement("h3", {
    style: subhead
  }, lang === "en" ? "2.4 — Subsystems and Win32" : "2.4 — Subsistemalar va Win32"), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "Apps don't call the kernel directly. They call a ", /*#__PURE__*/React.createElement(Term, null, "subsystem DLL"), " \u2014 usually ", /*#__PURE__*/React.createElement("code", null, "kernel32.dll"), ", ", /*#__PURE__*/React.createElement("code", null, "user32.dll"), ", or ", /*#__PURE__*/React.createElement("code", null, "gdi32.dll"), " \u2014 which translate Win32 calls into a much smaller set of native calls in ", /*#__PURE__*/React.createElement("code", null, "ntdll.dll"), ". ", /*#__PURE__*/React.createElement("code", null, "ntdll"), " is the last user-mode stop before the syscall instruction takes us into ring 0.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Ilovalar yadroga to'g'ridan-to'g'ri murojaat qilmaydi. Ular ", /*#__PURE__*/React.createElement(Term, null, "subsistem DLL"), "'ga murojaat qiladi \u2014 odatda ", /*#__PURE__*/React.createElement("code", null, "kernel32.dll"), ", ", /*#__PURE__*/React.createElement("code", null, "user32.dll"), ", yoki ", /*#__PURE__*/React.createElement("code", null, "gdi32.dll"), " \u2014 ular Win32 chaqiriqlarini ", /*#__PURE__*/React.createElement("code", null, "ntdll.dll"), " ichidagi ancha kichikroq native chaqiriqlarga aylantiradi. ", /*#__PURE__*/React.createElement("code", null, "ntdll"), " \u2014 syscall buyrug'i bizni ring 0 ga olib kirgunga qadar oxirgi user-mode to'xtash joyi.")));
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
  }), /*#__PURE__*/React.createElement(P, null, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "Below is the actual layered architecture of Windows. ", /*#__PURE__*/React.createElement(Em, null, "Click any block"), " to inspect what lives inside. Notice the strict separation between user mode (top) and kernel mode (bottom) \u2014 the dashed line is the only legal way to cross it.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Quyida Windows'ning haqiqiy qatlamli arxitekturasi. Har bir blokni ", /*#__PURE__*/React.createElement(Em, null, "bossangiz"), " uning ichida nima borligini ko'rasiz. User mode (yuqori) va kernel mode (past) o'rtasidagi qat'iy ajratishga e'tibor bering \u2014 chiziqli chegara \u2014 uni kesib o'tishning yagona qonuniy yo'li.")), /*#__PURE__*/React.createElement("div", {
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
  }, lang === "en" ? "Full access. One bug here = blue screen for the whole machine." : "To'liq kirish. Bu yerdagi bitta xato = butun mashinaga ko'k ekran.")));
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
  }, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("code", null, "wininit.exe"), " starts ", /*#__PURE__*/React.createElement("code", null, "services.exe"), " (all background services) and ", /*#__PURE__*/React.createElement("code", null, "lsass.exe"), ". ", /*#__PURE__*/React.createElement(Em, null, "LSASS (Local Security Authority Subsystem Service)"), " is the heart of Windows authentication \u2014 it validates every password, PIN, and smart card. Then ", /*#__PURE__*/React.createElement("code", null, "winlogon.exe"), " brings up the lock screen. LSASS is also the prime target for ", /*#__PURE__*/React.createElement(Em, null, "credential dumping"), " (Mimikatz extracts hashes from its memory).") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("code", null, "wininit.exe"), " \u2014 ", /*#__PURE__*/React.createElement("code", null, "services.exe"), " (barcha fon xizmatlar) va ", /*#__PURE__*/React.createElement("code", null, "lsass.exe"), " ni ishga tushiradi. ", /*#__PURE__*/React.createElement(Em, null, "LSASS (Local Security Authority Subsystem Service)"), " \u2014 Windows autentifikatsiyasining yuragi: har bir parol, PIN va smart-karta aynan shu jarayon orqali tekshiriladi. So'ng ", /*#__PURE__*/React.createElement("code", null, "winlogon.exe"), " kirish ekranini ko'rsatadi. LSASS shu bilan birga ", /*#__PURE__*/React.createElement(Em, null, "credential dumping"), " ning asosiy nishoni (Mimikatz uning xotirasidan hash'larni tortib oladi)."))), /*#__PURE__*/React.createElement(Callout, {
    color: "var(--c-warn)",
    icon: "warning",
    titleUz: "Xavfsizlik nuqtai nazaridan",
    titleEn: "Security note"
  }, lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, "Secure Boot enforces a cryptographic chain \u2014 UEFI verifies the bootloader, the bootloader verifies the kernel, the kernel verifies signed drivers. Breaking this chain is the dream of every bootkit. ", /*#__PURE__*/React.createElement("code", null, "BlackLotus"), " (2023) was the first public UEFI bootkit to bypass Secure Boot on fully patched Windows 11 \u2014 it patched the Secure Boot revocation list in memory before the check ran.") : /*#__PURE__*/React.createElement(React.Fragment, null, "Secure Boot kriptografik zanjirni ta'minlaydi \u2014 UEFI bootloader'ni tekshiradi, bootloader yadroni, yadro esa imzolangan drayverlarni. Bu zanjirni buzish har bir bootkit'ning orzusi. ", /*#__PURE__*/React.createElement("code", null, "BlackLotus"), " (2023) \u2014 to'liq yangilangan Windows 11 da Secure Boot'ni chetlab o'tgan birinchi ommaviy UEFI bootkit: u tekshiruv ishlashidan oldin xotiradagi Secure Boot revokatsiya ro'yxatini o'zgartirdi.")));
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
  onQuizStart
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

// Static fallback questions for the Windows architecture lesson
const FALLBACK_QUESTIONS = [{
  uz: "User mode va Kernel mode farqini tushuntirib bering. Qaysi ring darajalari va nima uchun bu chegara xavfsizlik uchun muhim?",
  en: "Explain the difference between user mode and kernel mode. What CPU rings are used, and why is this boundary critical for security?"
}, {
  uz: "Windows boot ketma-ketligida UEFI'dan login ekraniga qadar bo'lgan asosiy bosqichlarni sanab bering. Har bir bosqich keyingisini qanday tekshiradi?",
  en: "List the main stages of the Windows boot sequence from UEFI to the login screen. How does each stage verify the next one?"
}, {
  uz: "Bir oddiy ReadFile() chaqiruvi user mode'dan kernel mode'gacha va orqaga qaytishida qaysi qatlamlardan o'tadi? ntdll va syscall buyrug'ining roli nima?",
  en: "Which layers does a simple ReadFile() call traverse from user mode to kernel and back? What is the role of ntdll and the syscall instruction?"
}];
function QuizModal({
  onClose,
  onPass,
  onFail
}) {
  const lang = useLang();
  const [phase, setPhase] = useQS("intro"); // intro | answering | grading | result
  const [questions, setQuestions] = useQS(null);
  const [answers, setAnswers] = useQS(["", "", ""]);
  const [current, setCurrent] = useQS(0);
  const [results, setResults] = useQS(null);
  const [loading, setLoading] = useQS(false);
  const [err, setErr] = useQS(null);
  const generate = async () => {
    setLoading(true);
    setErr(null);
    try {
      const prompt = `Generate 3 advanced written questions about Windows architecture and operating system internals for a Windows security course.
Requirements:
- Each question requires a multi-sentence written explanation (not yes/no)
- Cover: user mode vs kernel mode, executive/microkernel/HAL, processes & threads, boot process, syscall flow
- Mix difficulty: 1 conceptual, 1 technical-deep, 1 security-implication scenario
- Return STRICT JSON only, no markdown fences, like:
{ "questions": [ { "uz": "...", "en": "..." }, { "uz": "...", "en": "..." }, { "uz": "...", "en": "..." } ] }
- "uz" is the Uzbek version, "en" is the English version of the same question.`;
      const text = await window.claude.complete(prompt);
      const cleaned = text.replace(/^```json\s*|```\s*$/g, "").trim();
      const json = JSON.parse(cleaned);
      setQuestions(json.questions.slice(0, 3));
      setPhase("answering");
    } catch (e) {
      console.warn("AI question gen failed, using fallback:", e);
      setQuestions(FALLBACK_QUESTIONS);
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
      const evals = await Promise.all(questions.map(async (q, i) => {
        const prompt = `You are a senior Windows internals instructor grading a student's written answer.

QUESTION (Uzbek): ${q.uz}
QUESTION (English): ${q.en}

STUDENT ANSWER:
"""
${answers[i] || "(empty)"}
"""

Grade STRICTLY on:
- Technical correctness (40%)
- Windows / OS terminology usage (20%)
- Real understanding of internals (20%)
- Explanation quality (20%)

Be tough but fair. Empty / one-word / unrelated answers get 0-20.
Surface-level "Windows is an operating system" without specifics gets 30-50.
Real technical depth with correct terms (ring 0/3, ntoskrnl, HAL, syscall, executive, etc.) gets 70+.
Expert-level with security nuance gets 90+.

Return STRICT JSON only, no markdown fences. Feedback should be in ${lang === "en" ? "English" : "Uzbek"}:
{
  "score": <0-100>,
  "passed": <true if score >= 70>,
  "strengths": ["short bullet", "short bullet"],
  "weaknesses": ["short bullet", "short bullet"],
  "feedback": "2-3 sentence overall feedback"
}`;
        try {
          const text = await window.claude.complete(prompt);
          const cleaned = text.replace(/^```json\s*|```\s*$/g, "").trim();
          return JSON.parse(cleaned);
        } catch (e) {
          const a = (answers[i] || "").trim();
          const score = a.length < 20 ? 10 : a.length < 80 ? 35 : a.length < 200 ? 55 : 75;
          return {
            score,
            passed: score >= 70,
            strengths: a.length > 80 ? [lang === "en" ? "Answer is well-developed" : "Javob to'liq yozilgan"] : [],
            weaknesses: a.length < 80 ? [lang === "en" ? "Answer too brief" : "Javob juda qisqa"] : [lang === "en" ? "Lacks technical depth" : "Texnik chuqurlik yetishmaydi"],
            feedback: lang === "en" ? "Heuristic grading was applied — AI grader unavailable." : "AI tekshirib bo'lmadi — heuristik baholash qo'llanildi."
          };
        }
      }));
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
    onClose: onClose
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 32px 32px",
      flex: 1,
      overflowY: "auto",
      minHeight: 0
    }
  }, phase === "intro" && /*#__PURE__*/React.createElement(Intro, {
    onStart: generate,
    loading: loading
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
function ModalHeader({
  phase,
  onClose
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
  }, lang === "en" ? "Lesson 01 · Windows architecture" : "Dars 01 · Windows arxitekturasi"))), /*#__PURE__*/React.createElement("button", {
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
  loading
}) {
  const lang = useLang();
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
  }, lang === "en" ? "Windows architecture mastery check" : "Windows arxitekturasi: bilim tekshiruvi"), /*#__PURE__*/React.createElement("p", {
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
  }, lang === "en" ? s.en : s.uz)))), /*#__PURE__*/React.createElement("div", {
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
  onContinue
}) {
  const lang = useLang();
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
  }, "Excellent!"), " You've mastered the Windows architecture basics.") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("b", {
    style: {
      color: "var(--accent)"
    }
  }, "Mukammal!"), " Siz Windows arxitekturasi asoslarini o'zlashtirdingiz.") : lang === "en" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("b", {
    style: {
      color: "var(--c-attack)"
    }
  }, "Not yet."), " Review and come back.") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("b", {
    style: {
      color: "var(--c-attack)"
    }
  }, "Hozircha o'ta olmadingiz."), " O'rganib qaytib keling."))), /*#__PURE__*/React.createElement("div", {
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
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: `btn ${passed ? "btn-primary" : "btn-danger"}`,
    onClick: onContinue,
    style: {
      padding: "12px 24px"
    }
  }, passed ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 14
  }), " ", lang === "en" ? "Continue to next lesson" : "Keyingi darsga o'tish") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
    name: "lock",
    size: 14
  }), " ", lang === "en" ? "Begin 30-minute cooldown" : "30 minut bloklashga o'tish"))));
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
  user
}) {
  const lang = useLang();
  const COOLDOWN_KEY = "wa_cooldown_end";
  const DURATION = 30 * 60;
  const [endsAt, setEndsAt] = useCS(() => {
    const stored = localStorage.getItem(COOLDOWN_KEY);
    if (stored && +stored > Date.now()) return +stored;
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
      lesson: 1
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
      lesson: 1
    })
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "book",
    size: 14
  }), " ", lang === "en" ? "Review the lesson" : "Darsni qayta ko'rish")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: () => setRoute({
      name: "lesson",
      section: 1,
      lesson: 1
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
  user
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
  const submit = () => {
    setSubmitting(true);
    setTimeout(() => setPhase("submitted"), 800);
  };
  return /*#__PURE__*/React.createElement("div", null, phase !== "taking" && /*#__PURE__*/React.createElement(TopNav, {
    route: {
      name: "exam"
    },
    setRoute: setRoute,
    user: user,
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
  }), phase === "submitted" && /*#__PURE__*/React.createElement(ExamSubmitted, {
    setRoute: setRoute,
    answered: answered
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
// app.jsx — main app: router, tweaks, theme + language orchestration

const {
  useState: useAS,
  useEffect: useAE,
  useCallback: useACB
} = React;
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "green",
  "background": "particles",
  "density": "cozy",
  "motion": "high"
} /*EDITMODE-END*/;

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
    if (s) return JSON.parse(s);
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
  } catch {}
}

// XP thresholds per level (cumulative)
const XP_PER_LESSON = 120;
function xpToLevel(xp) {
  return Math.max(1, Math.floor(xp / 500) + 1);
}

// ─────────────────────────────────────────────────────────────────────────────
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
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

  // Route stored in localStorage so it survives browser close
  const [route, _setRoute] = useAS(loadRoute);
  const setRoute = r => {
    _setRoute(r);
    saveRoute(r);
    window.scrollTo({
      top: 0,
      behavior: "instant"
    });
  };

  // User progress stored in localStorage
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
    completedLessons: progress.completedLessons || []
  };
  const screenProps = {
    setRoute,
    user,
    markLessonComplete
  };
  const handleReset = () => {
    if (!window.confirm(lang === "en" ? "Reset all progress and start from zero?" : "Barcha progressni o'chirib, 0dan boshlaysizmi?")) return;
    clearAll();
    _setProgress(loadProgress());
    _setRoute({
      name: "landing"
    });
    saveRoute({
      name: "landing"
    });
  };
  return /*#__PURE__*/React.createElement(LangContext.Provider, {
    value: {
      lang,
      setLang
    }
  }, /*#__PURE__*/React.createElement(ParticleBg, {
    mode: t.background,
    count: t.motion === "off" ? 0 : t.motion === "low" ? 25 : 80
  }), /*#__PURE__*/React.createElement(RouteRender, {
    route: route,
    screenProps: screenProps
  }), /*#__PURE__*/React.createElement(TweaksPanel, {
    title: "Tweaks"
  }, /*#__PURE__*/React.createElement(TweakSection, {
    label: "Theme \xB7 Mavzu"
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Accent",
    value: t.theme,
    options: ["green", "blue", "purple"],
    onChange: v => setTweak("theme", v)
  }), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Background \xB7 Fon"
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Style",
    value: t.background,
    options: ["grid", "particles", "plain"],
    onChange: v => setTweak("background", v)
  }), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Layout \xB7 Tartibga solish"
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Density",
    value: t.density,
    options: ["compact", "cozy", "comfy"],
    onChange: v => setTweak("density", v)
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Motion",
    value: t.motion,
    options: ["off", "low", "high"],
    onChange: v => setTweak("motion", v)
  }), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Quick nav \xB7 Tezkor o'tish"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(NavBtn, {
    label: "Landing",
    onClick: () => setRoute({
      name: "landing"
    })
  }), /*#__PURE__*/React.createElement(NavBtn, {
    label: "Dashboard",
    onClick: () => setRoute({
      name: "dashboard"
    })
  }), /*#__PURE__*/React.createElement(NavBtn, {
    label: "Section 01",
    onClick: () => setRoute({
      name: "section",
      section: 1
    })
  }), /*#__PURE__*/React.createElement(NavBtn, {
    label: "Lesson 01",
    onClick: () => setRoute({
      name: "lesson",
      section: 1,
      lesson: 1
    })
  }), /*#__PURE__*/React.createElement(NavBtn, {
    label: "Cooldown",
    onClick: () => setRoute({
      name: "cooldown"
    })
  }), /*#__PURE__*/React.createElement(NavBtn, {
    label: "Final exam",
    onClick: () => setRoute({
      name: "exam"
    })
  }), /*#__PURE__*/React.createElement(NavBtn, {
    label: "\u27F3 0dan boshlash",
    onClick: handleReset
  })), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Progress \xB7 Natija"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      opacity: 0.7,
      padding: "4px 0"
    }
  }, "XP: ", user.xp, " \xB7 Daraja: ", user.level, " \xB7 Darslar: ", user.completedLessons.length)));
}
function NavBtn({
  label,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      appearance: "none",
      cursor: "pointer",
      padding: "6px 8px",
      background: "rgba(0,0,0,0.05)",
      border: "1px solid rgba(0,0,0,0.1)",
      borderRadius: 6,
      fontSize: 10.5,
      color: "inherit",
      fontFamily: "inherit",
      textAlign: "left"
    }
  }, label);
}
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
      return /*#__PURE__*/React.createElement(LessonScreen, screenProps);
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
