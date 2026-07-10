// ad-topology.jsx — Interactive Active Directory topology
// Hand-crafted SVG: forest > tree > domain > DCs > clients. Hover to inspect, click to focus.

const { useState: useSt, useMemo: useMemo2 } = React;

const TOPOLOGY = {
  forest: { id: "f", name: "corp.local", label: "Forest Root" },
  domains: [
    {
      id: "d-root", name: "corp.local", x: 600, y: 140,
      kind: "root-domain",
      nodes: [
        { id: "dc01", name: "DC01", role: "Domain Controller", icon: "server", x: 480, y: 260, color: "var(--c-system)", desc: "Primary DC — holds FSMO roles", descUz: "Asosiy Domain Controller — FSMO rollarini saqlaydi" },
        { id: "dc02", name: "DC02", role: "Domain Controller", icon: "server", x: 720, y: 260, color: "var(--c-system)", desc: "Replica DC for redundancy", descUz: "Zaxira DC — replikatsiya uchun" },
      ],
    },
    {
      id: "d-emea", name: "emea.corp.local", x: 280, y: 380,
      kind: "child-domain",
      nodes: [
        { id: "dc-em", name: "DC-EMEA", role: "Domain Controller", icon: "server", x: 200, y: 500, color: "var(--c-system)" },
        { id: "ws-em01", name: "WS-EMEA-001", role: "Workstation", icon: "cpu", x: 100, y: 620, color: "var(--c-user)" },
        { id: "ws-em02", name: "WS-EMEA-002", role: "Workstation", icon: "cpu", x: 220, y: 660, color: "var(--c-user)" },
        { id: "fs-em", name: "FS-EMEA", role: "File Server (SMB)", icon: "database", x: 340, y: 600, color: "var(--c-system)" },
      ],
    },
    {
      id: "d-apac", name: "apac.corp.local", x: 920, y: 380,
      kind: "child-domain",
      nodes: [
        { id: "dc-ap", name: "DC-APAC", role: "Domain Controller", icon: "server", x: 1000, y: 500, color: "var(--c-system)" },
        { id: "sql-ap", name: "SQL-APAC", role: "SQL Server (Kerb SPN)", icon: "database", x: 880, y: 600, color: "var(--c-auth)", desc: "Has registered SPN — Kerberoasting target", descUz: "SPN ro'yxatdan o'tgan — Kerberoasting nishoni" },
        { id: "ws-ap01", name: "WS-APAC-001", role: "Workstation", icon: "cpu", x: 1100, y: 620, color: "var(--c-user)" },
      ],
    },
  ],
  trusts: [
    { from: "d-root", to: "d-emea", kind: "parent-child", bidi: true },
    { from: "d-root", to: "d-apac", kind: "parent-child", bidi: true },
  ],
};

function ADTopology({ showAttackPath = false, animateAttack = false }) {
  const [hovered, setHovered] = useSt(null);
  const [selected, setSelected] = useSt(null);

  const allNodes = useMemo2(() => {
    const list = [];
    TOPOLOGY.domains.forEach((d) => d.nodes.forEach((n) => list.push({ ...n, domain: d.id })));
    return list;
  }, []);

  const activeNode = allNodes.find((n) => n.id === (selected || hovered));

  // Attack path: ws-em01 → token theft → dc-em → kerberoast → sql-ap → dc-ap → dc01 (golden ticket)
  const attackPath = ["ws-em01", "dc-em", "sql-ap", "dc-ap", "dc01"];

  return (
    <div style={{
      position: "relative",
      background: "radial-gradient(ellipse at center, rgba(13,19,36,0.85), rgba(4,6,13,0.95))",
      border: "1px solid var(--border)",
      borderRadius: "var(--r-lg)",
      overflow: "hidden",
      isolation: "isolate",
    }}>
      {/* Legend */}
      <div style={{ position: "absolute", top: 14, left: 14, display: "flex", gap: 10, zIndex: 10, flexWrap: "wrap" }}>
        <span className="chip chip-blue"><Icon name="server" size={11} /> Domain Controller</span>
        <span className="chip" style={{ background: "rgba(255, 145, 69, 0.1)", color: "var(--c-user)", borderColor: "rgba(255,145,69,0.3)" }}><Icon name="cpu" size={11} /> Workstation</span>
        <span className="chip chip-purple"><Icon name="key" size={11} /> SPN target</span>
        {showAttackPath && <span className="chip chip-red"><Icon name="skull" size={11} /> Attack path</span>}
      </div>

      <div style={{ position: "absolute", top: 14, right: 14, fontSize: 11, color: "var(--text-2)", fontFamily: "var(--font-mono)", zIndex: 10 }}>
        <LiveDot /> &nbsp;<span style={{ marginLeft: 4 }}>Live topology · {allNodes.length + 3} objects</span>
      </div>

      <svg viewBox="0 0 1200 720" style={{ display: "block", width: "100%", height: "auto", maxHeight: 540 }}>
        <defs>
          <filter id="ad-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 Z" fill="currentColor" />
          </marker>
          <marker id="arrow-red" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 Z" fill="#ff3a5e" />
          </marker>
          <linearGradient id="trust-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--accent-2)" stopOpacity="0.4" />
          </linearGradient>
          <pattern id="dot-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="0.7" fill="rgba(255,255,255,0.08)" />
          </pattern>
        </defs>

        <rect width="1200" height="720" fill="url(#dot-grid)" />

        {/* Forest root halo */}
        <circle cx={TOPOLOGY.forest.id ? 600 : 0} cy="140" r="80" fill="none" stroke="var(--accent-border)" strokeWidth="0.6" strokeDasharray="2 4" opacity="0.4" />

        {/* Domain bubbles */}
        {TOPOLOGY.domains.map((d) => {
          const nodes = d.nodes;
          if (nodes.length === 0) return null;
          const xs = nodes.map((n) => n.x);
          const ys = nodes.map((n) => n.y);
          const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
          const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
          const r = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) / 2 + 70;
          return (
            <g key={d.id}>
              <circle cx={cx} cy={cy} r={r}
                fill="rgba(77, 139, 255, 0.04)"
                stroke="rgba(77, 139, 255, 0.25)"
                strokeWidth="1" strokeDasharray="4 6" />
              <text x={cx} y={cy - r - 8}
                fill="var(--c-system)" fontSize="11"
                fontFamily="var(--font-mono)"
                textAnchor="middle"
                letterSpacing="2">
                {d.name.toUpperCase()}
              </text>
            </g>
          );
        })}

        {/* Trust lines */}
        {TOPOLOGY.trusts.map((t, i) => {
          const a = TOPOLOGY.domains.find((d) => d.id === t.from);
          const b = TOPOLOGY.domains.find((d) => d.id === t.to);
          if (!a || !b) return null;
          return (
            <g key={i}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke="url(#trust-grad)" strokeWidth="2"
                strokeDasharray="6 4"
                opacity="0.7" />
              <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 10}
                fill="var(--accent)" fontSize="10"
                fontFamily="var(--font-mono)"
                textAnchor="middle"
                opacity="0.7">
                ⇄ TRUST
              </text>
            </g>
          );
        })}

        {/* Forest root node */}
        <g style={{ cursor: "pointer" }}>
          <circle cx="600" cy="140" r="36" fill="var(--bg-2)" stroke="var(--accent)" strokeWidth="2" filter="url(#ad-glow)" />
          <g transform="translate(584, 124)" stroke="var(--accent)" strokeWidth="1.6" fill="none">
            <path d="M16 2l14 7-14 7L2 9l14-7z" />
            <path d="M2 14l14 7 14-7M2 19l14 7 14-7" />
          </g>
          <text x="600" y="200" fill="var(--accent)" fontSize="12" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="600">FOREST ROOT</text>
          <text x="600" y="215" fill="var(--text-2)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">corp.local</text>
        </g>

        {/* Connecting lines to domains */}
        {TOPOLOGY.domains.filter((d) => d.kind === "child-domain").map((d) => (
          <line key={d.id} x1="600" y1="176" x2={d.x} y2={d.y - 40}
            stroke="var(--border-strong)" strokeWidth="1.2" strokeDasharray="3 5" />
        ))}

        {/* Domain → DC links */}
        {TOPOLOGY.domains.map((d) => d.nodes.filter((n) => n.role.includes("Domain Controller")).map((n) => (
          <line key={`l-${n.id}`} x1={d.x} y1={d.y} x2={n.x} y2={n.y}
            stroke="var(--c-system)" strokeWidth="1" opacity="0.5" />
        )))}

        {/* DC → client links */}
        {TOPOLOGY.domains.map((d) => {
          const dc = d.nodes.find((n) => n.role.includes("Domain Controller"));
          if (!dc) return null;
          return d.nodes.filter((n) => n !== dc).map((n) => (
            <line key={`c-${n.id}`} x1={dc.x} y1={dc.y} x2={n.x} y2={n.y}
              stroke="var(--border-strong)" strokeWidth="0.8" opacity="0.6" />
          ));
        })}

        {/* Attack path overlay */}
        {showAttackPath && attackPath.slice(0, -1).map((id, i) => {
          const a = allNodes.find((n) => n.id === id);
          const b = allNodes.find((n) => n.id === attackPath[i + 1]);
          if (!a || !b) return null;
          return (
            <g key={`atk-${i}`}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke="#ff3a5e" strokeWidth="2.2"
                strokeDasharray={animateAttack ? "8 6" : "0"}
                markerEnd="url(#arrow-red)"
                style={{ filter: "drop-shadow(0 0 6px #ff3a5e)", animation: animateAttack ? "dash-flow 1.4s linear infinite" : "none" }} />
              {animateAttack && (
                <circle r="4" fill="#ff3a5e" style={{ filter: "drop-shadow(0 0 8px #ff3a5e)" }}>
                  <animateMotion dur={`${2 + i * 0.4}s`} repeatCount="indefinite"
                    path={`M${a.x},${a.y} L${b.x},${b.y}`} begin={`${i * 0.5}s`} />
                </circle>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {allNodes.map((n) => {
          const isHover = hovered === n.id || selected === n.id;
          const isAttack = showAttackPath && attackPath.includes(n.id);
          return (
            <g key={n.id} style={{ cursor: "pointer" }}
               onMouseEnter={() => setHovered(n.id)}
               onMouseLeave={() => setHovered(null)}
               onClick={() => setSelected(selected === n.id ? null : n.id)}>
              {isAttack && (
                <circle cx={n.x} cy={n.y} r="26" fill="none" stroke="#ff3a5e" strokeWidth="0.8" opacity="0.6">
                  <animate attributeName="r" values="22;30;22" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              <circle cx={n.x} cy={n.y} r={isHover ? 22 : 18}
                fill="var(--bg-2)"
                stroke={isAttack ? "#ff3a5e" : n.color}
                strokeWidth={isHover ? 2.4 : 1.6}
                filter={isHover || isAttack ? "url(#ad-glow)" : ""}
                style={{ transition: "all 200ms" }} />
              <foreignObject x={n.x - 10} y={n.y - 10} width="20" height="20" style={{ pointerEvents: "none", color: isAttack ? "#ff3a5e" : n.color }}>
                <Icon name={n.icon} size={20} />
              </foreignObject>
              <text x={n.x} y={n.y + 38}
                fill={isHover ? "var(--text-0)" : "var(--text-1)"}
                fontSize="11" fontFamily="var(--font-mono)" textAnchor="middle">
                {n.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Detail panel */}
      {activeNode && (
        <div style={{
          position: "absolute", bottom: 14, left: 14, right: 14,
          background: "rgba(4, 6, 13, 0.92)",
          border: `1px solid ${activeNode.color}`,
          borderRadius: 10,
          padding: "14px 18px",
          backdropFilter: "blur(12px)",
          display: "flex", gap: 16, alignItems: "flex-start",
          boxShadow: `0 0 24px ${activeNode.color}33`,
        }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: activeNode.color + "20", border: `1px solid ${activeNode.color}`, display: "grid", placeItems: "center", color: activeNode.color, flexShrink: 0 }}>
            <Icon name={activeNode.icon} size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 600, color: activeNode.color }}>{activeNode.name}</div>
            <div style={{ fontSize: 11.5, color: "var(--text-1)", marginTop: 2 }}>{activeNode.role} · {TOPOLOGY.domains.find((d) => d.id === activeNode.domain)?.name}</div>
            {activeNode.descUz && (
              <div style={{ marginTop: 6, fontSize: 12.5, color: "var(--text-0)" }}>{activeNode.descUz}</div>
            )}
            {activeNode.desc && (
              <div style={{ fontSize: 11.5, color: "var(--text-2)", fontStyle: "italic" }}>{activeNode.desc}</div>
            )}
          </div>
          <button onClick={() => setSelected(null)} className="btn-ghost btn" style={{ padding: 6, minWidth: 0 }}><Icon name="x" size={14} /></button>
        </div>
      )}

      <style>{`
        @keyframes dash-flow { to { stroke-dashoffset: -14; } }
      `}</style>
    </div>
  );
}

window.ADTopology = ADTopology;
