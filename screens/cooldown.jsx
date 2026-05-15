// cooldown.jsx — 30-minute lock screen (single-lang, points to Section 01)

const { useState: useCS, useEffect: useCE } = React;

function CooldownScreen({ setRoute, user, onOpenProfile }) {
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
  const pct = (elapsed / DURATION) * 100;

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const unlocked = remaining === 0;

  const reset = () => {
    localStorage.removeItem(COOLDOWN_KEY);
    setRoute({ name: "lesson", section: 1, lesson: 1 });
  };
  const skipForDemo = () => {
    localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
    setEndsAt(Date.now());
  };

  return (
    <div>
      <TopNav route={{ name: "cooldown" }} setRoute={setRoute} user={user} onOpenProfile={onOpenProfile}
        crumb={[
          { label: lang === "en" ? "Section 01" : "01-bo'lim", onClick: () => setRoute({ name: "section", section: 1 }) },
          { label: lang === "en" ? "Quiz cooldown" : "Test bloklash" },
        ]} />

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 28px", textAlign: "center" }}>
        <div style={{ position: "relative", width: 220, height: 220, margin: "0 auto 32px" }}>
          <svg viewBox="0 0 220 220" style={{ width: "100%", height: "100%" }}>
            <defs>
              <linearGradient id="cd-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={unlocked ? "#00ff9c" : "#ff3a5e"} />
                <stop offset="100%" stopColor={unlocked ? "#00d4ff" : "#ffcc44"} />
              </linearGradient>
            </defs>
            <circle cx="110" cy="110" r="96" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
            <circle cx="110" cy="110" r="96" fill="none" stroke="url(#cd-grad)" strokeWidth="3"
                    strokeDasharray={`${(pct * 603) / 100} 603`}
                    strokeLinecap="round"
                    transform="rotate(-90 110 110)"
                    style={{ filter: "drop-shadow(0 0 8px " + (unlocked ? "var(--accent-glow)" : "rgba(255,58,94,0.4)") + ")", transition: "stroke-dasharray 1s linear" }} />
            <circle cx="110" cy="110" r="76" fill="rgba(255,58,94,0.04)" stroke="rgba(255,58,94,0.25)" strokeWidth="1" />
            {!unlocked && [0, 1, 2].map((i) => (
              <circle key={i} cx="110" cy="110" r="76"
                fill="none" stroke="#ff3a5e" strokeWidth="1" opacity="0">
                <animate attributeName="r" values="76;106;76" dur="3s" begin={`${i}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" begin={`${i}s`} repeatCount="indefinite" />
              </circle>
            ))}
          </svg>
          <div style={{
            position: "absolute", inset: 0,
            display: "grid", placeItems: "center",
            color: unlocked ? "var(--accent)" : "var(--c-attack)",
            animation: unlocked ? "none" : "shake 4s ease-in-out infinite",
          }}>
            <Icon name={unlocked ? "unlock" : "lock"} size={56} stroke={1.4} />
          </div>
        </div>

        <div className="eyebrow" style={{ color: unlocked ? "var(--accent)" : "var(--c-attack)", marginBottom: 10 }}>
          {unlocked
            ? (lang === "en" ? "// COOLDOWN_COMPLETE · READY_TO_RETRY" : "// BLOKLASH_TUGADI · QAYTA_URINISH")
            : (lang === "en" ? "// ACCESS_DENIED · COOLDOWN_ACTIVE" : "// KIRISH_RAD_ETILDI · BLOKLASH_FAOL")}
        </div>
        <h1 className="display" style={{ fontSize: 38, margin: "0 0 4px", letterSpacing: "-0.025em" }}>
          {unlocked
            ? (lang === "en" ? "Ready — go back in" : "Tayyor — qaytib boring")
            : (lang === "en" ? "You didn't pass the quiz" : "Imtihondan o'ta olmadingiz")}
        </h1>
        <p style={{ color: "var(--text-2)", fontSize: 14, margin: 0 }}>
          {unlocked
            ? (lang === "en" ? "You may retry now — fresh questions will be generated." : "Endi qayta urinishingiz mumkin — yangi savollar generatsiya qilinadi.")
            : (lang === "en" ? "Don't worry. Use the time to review the lesson once more." : "Xavotirlanmang. Bu vaqtdan darsni qayta o'qish uchun foydalaning.")}
        </p>

        {!unlocked && (
          <div style={{
            marginTop: 36, padding: "28px 32px",
            background: "var(--surface)",
            border: "1px solid rgba(255,58,94,0.25)",
            borderRadius: 16,
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
          }}>
            <div style={{ textAlign: "left" }}>
              <div className="mono" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: 0.18 }}>
                {lang === "en" ? "NEXT ATTEMPT IN" : "KEYINGI URINISH"}
              </div>
              <div className="display" style={{
                fontSize: 64, fontWeight: 600, letterSpacing: "-0.04em",
                color: "var(--c-attack)",
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1,
                textShadow: "0 0 30px rgba(255,58,94,0.35)",
                marginTop: 4,
              }}>
                <span>{mm}</span>
                <span style={{ color: "var(--text-3)", animation: "flicker 1s steps(2) infinite" }}>:</span>
                <span>{ss}</span>
              </div>
              <div style={{ marginTop: 6, fontSize: 11, color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
                MM:SS · {lang === "en" ? "30 min total" : "30 daqiqa"}
              </div>
            </div>

            <div style={{ flex: 1, maxWidth: 240 }}>
              <Progress value={pct} color="var(--c-attack)" height={6} showVal={false} />
              <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
                <span>00:00</span>
                <span>30:00</span>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24 }}>
          {unlocked ? (
            <>
              <button className="btn btn-primary" onClick={reset}>
                <Icon name="play" size={14} /> {lang === "en" ? "Retry with new questions" : "Yangi savollar bilan qayta urinish"}
              </button>
              <button className="btn" onClick={() => setRoute({ name: "lesson", section: 1, lesson: 1 })}>
                <Icon name="book" size={14} /> {lang === "en" ? "Review the lesson" : "Darsni qayta ko'rish"}
              </button>
            </>
          ) : (
            <>
              <button className="btn" onClick={() => setRoute({ name: "lesson", section: 1, lesson: 1 })}>
                <Icon name="book" size={14} /> {lang === "en" ? "Read the lesson meanwhile" : "Bu vaqtda darsni o'qing"}
              </button>
              <button className="btn btn-ghost" onClick={skipForDemo} title="Demo only: skip timer">
                <Icon name="zap" size={14} /> Skip (demo)
              </button>
            </>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 40 }}>
          <ReasonCard icon="clock"
            uz="Vaqt — ustozdir" en="Time teaches"
            descUz="30 daqiqa — darsni qayta ko'rish va atamalarni mustahkamlash uchun yetarli."
            descEn="30 minutes is enough to re-read the lesson and lock in the terminology." />
          <ReasonCard icon="zap"
            uz="Tezlikka qarshi" en="No speedruns"
            descUz="Tushuncha tezlikdan ustun. Bu testdan taxminlar bilan o'tib bo'lmaydi."
            descEn="Understanding beats speed. You can't pass this with guesses." />
          <ReasonCard icon="spark"
            uz="Yangi savollar" en="Fresh questions"
            descUz="Qayta urinishda AI yangi savollar generatsiya qiladi — yodlab bo'lmaydi."
            descEn="On your next try, AI generates new questions — there's no memorizing." />
        </div>
      </div>
    </div>
  );
}

function ReasonCard({ icon, uz, en, descUz, descEn }) {
  const lang = useLang();
  return (
    <div className="glass" style={{ padding: 18, textAlign: "left" }}>
      <div style={{ color: "var(--accent)", marginBottom: 10 }}><Icon name={icon} size={18} /></div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, marginBottom: 8 }}>
        {lang === "en" ? en : uz}
      </div>
      <div style={{ fontSize: 12.5, color: "var(--text-1)", lineHeight: 1.5 }}>
        {lang === "en" ? descEn : descUz}
      </div>
    </div>
  );
}

window.CooldownScreen = CooldownScreen;
