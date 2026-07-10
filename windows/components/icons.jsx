// icons.jsx — Inline SVG icon set
// Avoid icon libs to keep things lean; these match the cyber-security aesthetic.

const Icon = ({ name, size = 18, stroke = 1.6, ...props }) => {
  const S = size;
  const sw = stroke;
  const common = {
    width: S, height: S, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: sw,
    strokeLinecap: "round", strokeLinejoin: "round",
    ...props,
  };

  switch (name) {
    case "shield":
      return <svg {...common}><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z"/></svg>;
    case "shield-check":
      return <svg {...common}><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z"/><path d="M9 12l2 2 4-4"/></svg>;
    case "lock":
      return <svg {...common}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>;
    case "unlock":
      return <svg {...common}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 017-2.7"/></svg>;
    case "key":
      return <svg {...common}><circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3M14 9l3 3"/></svg>;
    case "terminal":
      return <svg {...common}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l3 3-3 3M13 15h4"/></svg>;
    case "play":
      return <svg {...common}><path d="M6 4l14 8-14 8V4z" fill="currentColor"/></svg>;
    case "arrow-right":
      return <svg {...common}><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
    case "arrow-left":
      return <svg {...common}><path d="M19 12H5M11 5l-7 7 7 7"/></svg>;
    case "check":
      return <svg {...common}><path d="M5 13l4 4L19 7"/></svg>;
    case "x":
      return <svg {...common}><path d="M6 6l12 12M18 6L6 18"/></svg>;
    case "warning":
      return <svg {...common}><path d="M12 3L2 20h20L12 3z"/><path d="M12 10v5M12 18v.5"/></svg>;
    case "info":
      return <svg {...common}><circle cx="12" cy="12" r="10"/><path d="M12 8v.5M11 12h1v5h1"/></svg>;
    case "flame":
      return <svg {...common}><path d="M12 2s5 5 5 10a5 5 0 01-10 0c0-3 2-4 2-7 0 0 3 1 3 4"/></svg>;
    case "zap":
      return <svg {...common}><path d="M13 2L4 14h7l-2 8 9-12h-7l2-8z"/></svg>;
    case "skull":
      return <svg {...common}><path d="M12 3a8 8 0 00-5 14v3h10v-3a8 8 0 00-5-14z"/><circle cx="9" cy="12" r="1.2"/><circle cx="15" cy="12" r="1.2"/><path d="M10 17h4"/></svg>;
    case "users":
      return <svg {...common}><circle cx="9" cy="9" r="3.5"/><path d="M2 20c0-4 3-6 7-6s7 2 7 6"/><circle cx="17" cy="8" r="2.5"/><path d="M17 13c3 0 5 1.5 5 5"/></svg>;
    case "user":
      return <svg {...common}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>;
    case "server":
      return <svg {...common}><rect x="3" y="3" width="18" height="7" rx="1.5"/><rect x="3" y="14" width="18" height="7" rx="1.5"/><circle cx="7" cy="6.5" r=".7"/><circle cx="7" cy="17.5" r=".7"/></svg>;
    case "database":
      return <svg {...common}><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.6 3.6 3 8 3s8-1.4 8-3V5"/><path d="M4 11v6c0 1.6 3.6 3 8 3s8-1.4 8-3v-6"/></svg>;
    case "network":
      return <svg {...common}><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><circle cx="12" cy="12" r="2"/><path d="M8 6l2 4M16 6l-2 4M10 14l-2 4M14 14l2 4"/></svg>;
    case "cpu":
      return <svg {...common}><rect x="6" y="6" width="12" height="12" rx="1"/><rect x="9" y="9" width="6" height="6"/><path d="M10 2v3M14 2v3M10 19v3M14 19v3M2 10h3M2 14h3M19 10h3M19 14h3"/></svg>;
    case "code":
      return <svg {...common}><path d="M9 7l-5 5 5 5M15 7l5 5-5 5"/></svg>;
    case "graph":
      return <svg {...common}><path d="M3 20h18"/><path d="M5 17l5-6 4 4 5-9"/></svg>;
    case "trophy":
      return <svg {...common}><path d="M8 4h8v6a4 4 0 11-8 0V4z"/><path d="M4 6h4v3a3 3 0 01-3-3M20 6h-4v3a3 3 0 003-3"/><path d="M10 14v3l-2 3h8l-2-3v-3"/></svg>;
    case "target":
      return <svg {...common}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>;
    case "compass":
      return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M16 8l-2 6-6 2 2-6 6-2z"/></svg>;
    case "book":
      return <svg {...common}><path d="M4 5a2 2 0 012-2h12v18H6a2 2 0 01-2-2V5z"/><path d="M4 17h14"/></svg>;
    case "clock":
      return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case "search":
      return <svg {...common}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>;
    case "settings":
      return <svg {...common}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33h.09a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.09a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>;
    case "flag":
      return <svg {...common}><path d="M4 21V4M4 4h14l-3 5 3 5H4"/></svg>;
    case "globe":
      return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 4.5 6 4.5 9s-1.5 6-4.5 9c-3-3-4.5-6-4.5-9s1.5-6 4.5-9z"/></svg>;
    case "layers":
      return <svg {...common}><path d="M12 2l10 5-10 5L2 7l10-5z"/><path d="M2 12l10 5 10-5M2 17l10 5 10-5"/></svg>;
    case "branch":
      return <svg {...common}><circle cx="6" cy="4" r="2"/><circle cx="6" cy="20" r="2"/><circle cx="18" cy="12" r="2"/><path d="M6 6v12M6 12h10"/></svg>;
    case "eye":
      return <svg {...common}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>;
    case "send":
      return <svg {...common}><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>;
    case "menu":
      return <svg {...common}><path d="M3 6h18M3 12h18M3 18h18"/></svg>;
    case "chevron-right":
      return <svg {...common}><path d="M9 6l6 6-6 6"/></svg>;
    case "chevron-down":
      return <svg {...common}><path d="M6 9l6 6 6-6"/></svg>;
    case "external":
      return <svg {...common}><path d="M15 3h6v6M21 3l-9 9M21 14v5a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h5"/></svg>;
    case "download":
      return <svg {...common}><path d="M12 3v13M5 13l7 7 7-7M5 21h14"/></svg>;
    case "share":
      return <svg {...common}><circle cx="6" cy="12" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="M8 11l8-4M8 13l8 4"/></svg>;
    case "qr":
      return <svg {...common}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM18 18h3v3h-3z"/></svg>;
    case "spark":
      return <svg {...common}><path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M5 19l4-4M15 9l4-4"/></svg>;
    case "message":
      return <svg {...common}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>;
    default:
      return <svg {...common}><circle cx="12" cy="12" r="9"/></svg>;
  }
};

window.Icon = Icon;
