// mermaid-diagram.jsx — render mermaid charts with the cyber theme

const { useEffect: useE, useRef: useR, useState: useS } = React;

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
      activationBkgColor: "rgba(0,255,156,0.15)",
    },
    securityLevel: "loose",
    flowchart: { curve: "basis", htmlLabels: true, padding: 18, nodeSpacing: 50, rankSpacing: 60 },
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
      wrap: true,
    },
  });
}

function MermaidDiagram({ chart, id, caption, captionEn }) {
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
        const { svg } = await window.mermaid.render(uid, chart);
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
            svgEl.querySelectorAll("line, path").forEach((p) => {
              const cur = parseFloat(p.getAttribute("stroke-width")) || 1;
              if (cur < 1.8) p.setAttribute("stroke-width", "1.6");
              p.setAttribute("stroke-linecap", "round");
              p.setAttribute("stroke-linejoin", "round");
            });
            // Bold/contrast all text
            svgEl.querySelectorAll("text, tspan").forEach((t) => {
              if (!t.getAttribute("font-weight")) t.setAttribute("font-weight", "500");
            });
          }
        }
      } catch (e) {
        console.error("Mermaid render error:", e);
        if (!cancelled) setErr(e.message || String(e));
      }
    })();
    return () => { cancelled = true; };
  }, [chart, uid]);

  return (
    <figure style={{ margin: 0 }}>
      <div className="mermaid-wrap">
        {err ? (
          <div style={{ color: "var(--c-attack)", fontFamily: "var(--font-mono)", fontSize: 12 }}>Diagram error: {err}</div>
        ) : (
          <div ref={ref} />
        )}
      </div>
      {(caption || captionEn) && (
        <figcaption style={{ marginTop: 10, fontSize: 12.5, color: "var(--text-2)" }}>
          {lang === "en" ? captionEn : caption}
        </figcaption>
      )}
    </figure>
  );
}

window.MermaidDiagram = MermaidDiagram;
