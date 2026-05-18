// ai-chat.jsx — floating AI assistant chat widget

const { useState: useChS, useEffect: useChE, useRef: useChR } = React;

function AIChat({ open, onClose, user, route }) {
  const lang = useLang();
  const [messages, setMessages] = useChS([]);
  const [input, setInput] = useChS("");
  const [loading, setLoading] = useChS(false);
  const bottomRef = useChR(null);

  const hasKey = () => !!(localStorage.getItem("wa_ai_provider") && localStorage.getItem("wa_ai_key"));

  useChE(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const buildPrompt = (userMsg) => {
    const completed = user?.completedLessons || [];
    const completedNums = completed.map(k => {
      const m = k.match(/l(\d+)/);
      return m ? parseInt(m[1]) : null;
    }).filter(Boolean);

    const completedList = completedNums.length
      ? completedNums.map(n => `L${String(n).padStart(2, "0")}`).join(", ")
      : (lang === "en" ? "none yet" : "hali yo'q");

    const currentPage = route?.name === "lesson"
      ? `Lesson L${String(route.lesson || 1).padStart(2, "0")}`
      : route?.name === "section"
        ? `Section ${String(route.section || 1).padStart(2, "0")}`
        : "Dashboard";

    const sys = `You are a helpful AI assistant integrated into "Windows Academy" — an online learning platform for Windows internals and cybersecurity.

User: ${user?.name || "Student"}. Current page: ${currentPage}.
Completed lessons: [${completedList}].

Course covers: Windows architecture, kernel, processes, NTFS, registry, boot process, security tools, administration, networking, PowerShell, and more.

You can help with:
- Course topics and explanations (Windows internals, cybersecurity, IT)
- General questions about technology, programming, science
- Translations between Uzbek, English, Russian, or other languages
- Any other question the user asks

Keep answers clear and concise. Respond in the same language the user writes in. Be friendly and encouraging.`;

    const history = messages.map(m =>
      `${m.role === "user" ? "User" : "Assistant"}: ${m.text}`
    ).join("\n");

    return `${sys}\n\n${history ? `Previous messages:\n${history}\n\n` : ""}User: ${userMsg}\nAssistant:`;
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);
    try {
      const reply = await gradeWithAI(buildPrompt(userMsg));
      setMessages(prev => [...prev, { role: "assistant", text: reply.trim() }]);
    } catch (e) {
      const errMsg = e.message === "no_key"
        ? (lang === "en" ? "Please set your AI key in Profile settings first." : "Avval Profil sozlamalarida AI kalitini o'rnating.")
        : (lang === "en" ? "Error: " + e.message : "Xatolik: " + e.message);
      setMessages(prev => [...prev, { role: "assistant", text: errMsg, isError: true }]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div style={{
      position: "fixed", bottom: 80, right: 24, zIndex: 900,
      width: 340,
      background: "rgba(8,12,24,0.97)",
      border: "1px solid var(--accent-border)",
      borderRadius: 16,
      boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 30px var(--accent-soft)",
      display: "flex", flexDirection: "column",
      overflow: "hidden",
      maxHeight: "calc(100vh - 100px)",
    }}>
      {/* Header */}
      <div style={{
        padding: "13px 16px",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "linear-gradient(180deg,rgba(0,255,136,0.05),transparent)",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: "var(--accent-soft)", border: "1px solid var(--accent-border)",
            display: "grid", placeItems: "center",
          }}>
            <Icon name="spark" size={13} style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{lang === "en" ? "AI Tutor" : "AI Muallim"}</div>
            <div className="mono" style={{ fontSize: 9, color: "var(--accent)", letterSpacing: 0.5 }}>WINDOWS ACADEMY</div>
          </div>
        </div>
        <button onClick={onClose} style={{ appearance: "none", background: "none", border: "none", cursor: "pointer", color: "var(--text-2)", padding: 4, display: "grid", placeItems: "center" }}>
          <Icon name="x" size={15} />
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 0", minHeight: 280 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", padding: "28px 16px", color: "var(--text-3)", fontSize: 12.5, lineHeight: 1.65 }}>
            <div style={{ fontSize: 30, marginBottom: 10 }}>🎓</div>
            <div style={{ fontWeight: 600, color: "var(--text-2)", marginBottom: 6 }}>
              {lang === "en" ? "AI Tutor" : "AI Muallim"}
            </div>
            {lang === "en"
              ? "Ask me anything — course topics, translations, or general questions!"
              : "Istalgan savol bering — dars mavzulari, tarjima yoki umumiy savollar!"}
          </div>
        )}
        {!hasKey() && messages.length === 0 && (
          <div style={{
            background: "rgba(255,180,0,0.08)", border: "1px solid rgba(255,180,0,0.3)",
            borderRadius: 10, padding: "10px 12px", fontSize: 12, color: "var(--c-warn)", lineHeight: 1.5, marginTop: 8,
          }}>
            {lang === "en"
              ? "⚠ Set your AI key in Profile to enable the AI tutor."
              : "⚠ Profil sozlamalarida AI kalitini o'rnating."}
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 10, display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "88%",
              padding: "8px 12px",
              borderRadius: m.role === "user" ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
              background: m.role === "user" ? "var(--accent)" : m.isError ? "rgba(255,80,80,0.1)" : "var(--surface)",
              border: m.role === "user" ? "none" : `1px solid ${m.isError ? "rgba(255,80,80,0.3)" : "var(--border)"}`,
              color: m.role === "user" ? "#04060d" : m.isError ? "#ff6666" : "var(--text-0)",
              fontSize: 12.5, lineHeight: 1.6,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 10 }}>
            <div style={{ padding: "8px 14px", borderRadius: "12px 12px 12px 4px", background: "var(--surface)", border: "1px solid var(--border)", fontSize: 16, color: "var(--text-3)", letterSpacing: 2 }}>
              ···
            </div>
          </div>
        )}
        <div ref={bottomRef} style={{ height: 14 }} />
      </div>

      {/* Input */}
      <div style={{ padding: "10px 12px", borderTop: "1px solid var(--border)", display: "flex", gap: 8, flexShrink: 0 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder={lang === "en" ? "Ask a question…" : "Savol bering…"}
          style={{
            flex: 1, background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 8,
            padding: "8px 12px", color: "var(--text-0)", fontSize: 12.5,
            outline: "none", fontFamily: "inherit", transition: "border-color 150ms",
          }}
          onFocus={e => { e.target.style.borderColor = "var(--accent-border)"; }}
          onBlur={e => { e.target.style.borderColor = "var(--border)"; }}
        />
        <button
          onClick={send}
          disabled={!input.trim() || loading}
          style={{
            appearance: "none", border: "none",
            cursor: input.trim() && !loading ? "pointer" : "not-allowed",
            width: 36, height: 36, borderRadius: 8, flexShrink: 0,
            background: input.trim() && !loading ? "var(--accent)" : "var(--surface)",
            color: input.trim() && !loading ? "#04060d" : "var(--text-3)",
            display: "grid", placeItems: "center",
            transition: "all 200ms",
          }}>
          <Icon name="send" size={14} />
        </button>
      </div>
    </div>
  );
}

window.AIChat = AIChat;
