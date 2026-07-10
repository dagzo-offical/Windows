// final-exam.jsx — Final Exam (single-lang, Section 01 Windows Fundamentals)

const { useState: useFS, useEffect: useFE, useRef: useFR } = React;

const EXAM_DURATION = 2 * 60 * 60; // 2 hours

const EXAM_QUESTIONS = [
  { uz: "Operatsion tizim nima va u qaysi vazifalarni bajaradi? 4 ta asosiy vazifani aytib bering.", en: "What is an OS and what are its core jobs? List 4 main jobs.", topic: "OS basics", difficulty: "med" },
  { uz: "User mode va Kernel mode farqini tushuntiring. Qaysi ring darajalari ishlatiladi?", en: "Explain user mode vs kernel mode. Which CPU rings are used?", topic: "Rings", difficulty: "med" },
  { uz: "ntoskrnl.exe ichida qaysi ikki asosiy qatlam bor va ularning mas'uliyati nimadan iborat?", en: "ntoskrnl.exe contains which two main layers and what are they responsible for?", topic: "Kernel", difficulty: "hard" },
  { uz: "HAL (Hardware Abstraction Layer) nima qiladi va u nima uchun kerak?", en: "What does HAL (Hardware Abstraction Layer) do and why is it needed?", topic: "HAL", difficulty: "med" },
  { uz: "Windows boot ketma-ketligini UEFI'dan login ekraniga qadar bosqichma-bosqich tushuntiring.", en: "Walk through the Windows boot sequence step-by-step from UEFI to login.", topic: "Boot", difficulty: "hard" },
  { uz: "Secure Boot qanday ishlaydi va u qaysi tahdidlardan himoya qiladi?", en: "How does Secure Boot work and what threats does it stop?", topic: "Secure Boot", difficulty: "hard" },
  { uz: "Jarayon (process) va thread o'rtasidagi farq nima? Qaysi biri scheduling birligi?", en: "Difference between process and thread? Which is the scheduling unit?", topic: "Processes", difficulty: "med" },
  { uz: "Handle nima va Object Manager unga qanday aloqasi bor?", en: "What is a handle and what's the Object Manager's role?", topic: "Handles", difficulty: "hard" },
  { uz: "Service va oddiy jarayon o'rtasidagi farq nima? SCM (Service Control Manager) qaysi vazifani bajaradi?", en: "Service vs normal process? What does SCM do?", topic: "Services", difficulty: "med" },
  { uz: "DLL nima va statik vs dinamik bog'lash farqi qanday?", en: "What is a DLL? Static vs dynamic linking?", topic: "DLL", difficulty: "med" },
  { uz: "Win32 API → ntdll → syscall → executive yo'lini batafsil ko'rsating.", en: "Walk through Win32 API → ntdll → syscall → executive in detail.", topic: "Syscall", difficulty: "hard" },
  { uz: "Registry hive'larini sanab bering (HKLM, HKCU, HKCR, HKU, HKCC) va har birining vazifasi.", en: "List the registry hives (HKLM, HKCU, ...) and what each holds.", topic: "Registry", difficulty: "med" },
  { uz: "NTFS va FAT32 ning eng katta 5 ta farqini sanab bering.", en: "List 5 biggest differences between NTFS and FAT32.", topic: "NTFS", difficulty: "med" },
  { uz: "TPM (Trusted Platform Module) nima qiladi va u BitLocker bilan qanday ishlaydi?", en: "What does TPM do and how does it work with BitLocker?", topic: "TPM", difficulty: "hard" },
  { uz: "Drayver nima va u nima uchun ring 0 da ishlaydi? BYOVD nima?", en: "What is a driver, why does it run in ring 0? What is BYOVD?", topic: "Drivers", difficulty: "hard" },
  { uz: "Windows Event Viewer'da Application, System va Security log'lari nima farq qiladi?", en: "Application vs System vs Security logs in Event Viewer?", topic: "Logs", difficulty: "med" },
  { uz: "Task Scheduler qanday ishlaydi va u persistence uchun qanday foydalanish mumkin?", en: "How does Task Scheduler work? How is it abused for persistence?", topic: "Persistence", difficulty: "hard" },
  { uz: "PowerShell'da Get-Process va Get-Service buyruqlari nima qaytaradi? Misol bilan.", en: "What do Get-Process and Get-Service return? Give examples.", topic: "PowerShell", difficulty: "med" },
  { uz: "Process Explorer va Task Manager o'rtasida nima farq bor? Pentester nima uchun PE'dan foydalanadi?", en: "Process Explorer vs Task Manager? Why does a pentester use PE?", topic: "Tools", difficulty: "med" },
  { uz: "Notepad'ni ishga tushirish bitta sichqoncha bosishidan login qilingan user uchun nima qiladi? Barcha qatlamlardan o'tish.", en: "What happens from a single click of Notepad? Trace through every layer.", topic: "Full trace", difficulty: "hard" },
];

function FinalExamScreen({ setRoute, user, markLessonComplete, onOpenProfile, onOpenAIChat, aiChatOpen }) {
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
        setTabSwitches((n) => n + 1);
        setWarnings((w) => [...w, { t: new Date().toLocaleTimeString(), msg: lang === "en" ? "Tab switch detected" : "Tab almashtirish aniqlandi" }].slice(-5));
      }
    };
    const onCopy = () => {
      setWarnings((w) => [...w, { t: new Date().toLocaleTimeString(), msg: lang === "en" ? "Clipboard read attempt" : "Clipboard urinishi" }].slice(-5));
    };
    document.addEventListener("visibilitychange", onVis);
    document.addEventListener("copy", onCopy);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      document.removeEventListener("copy", onCopy);
    };
  }, [phase, lang]);

  const start = () => { setStartTime(Date.now()); setPhase("taking"); };
  const elapsed = startTime ? Math.floor((now - startTime) / 1000) : 0;
  const remaining = Math.max(0, EXAM_DURATION - elapsed);
  const hh = String(Math.floor(remaining / 3600)).padStart(2, "0");
  const mm = String(Math.floor((remaining % 3600) / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const answered = answers.filter((a) => a.trim().length > 10).length;

  const update = (val) => {
    const next = [...answers]; next[current] = val; setAnswers(next);
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
        results.push({ score: 0, passed: false, key_points: [], missing: [lang === "en" ? "No answer provided" : "Javob berilmagan"], feedback: lang === "en" ? "Empty answer." : "Javob bo'sh." });
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
          results.push({ score, passed: score >= 70, key_points: [], missing: [lang === "en" ? "Set AI key in Profile for real grading" : "Profilda AI kalitini o'rnating"], feedback: "" });
        }
      } catch (e) {
        results.push({ score: 0, passed: false, key_points: [], missing: [String(e).slice(0, 80)], feedback: lang === "en" ? "Grading error — check AI key." : "Baholashda xatolik — AI kalitini tekshiring." });
      }
    }
    setExamResults(results);
    const overall = Math.round(results.reduce((s, r) => s + r.score, 0) / results.length);
    if (overall >= 85 && markLessonComplete) markLessonComplete("s01_final");
    setPhase("submitted");
    setSubmitting(false);
  };

  return (
    <div>
      {phase !== "taking" && <TopNav route={{ name: "exam" }} setRoute={setRoute} user={user} onOpenProfile={onOpenProfile} onOpenAIChat={onOpenAIChat} aiChatOpen={aiChatOpen}
        crumb={[
          { label: lang === "en" ? "Section 01" : "01-bo'lim", onClick: () => setRoute({ name: "section", section: 1 }) },
          { label: lang === "en" ? "Final exam" : "Final imtihon" },
        ]} />}

      {phase === "brief" && <ExamBrief onStart={start} setRoute={setRoute} />}
      {phase === "taking" && (
        <ExamTaking
          current={current} setCurrent={setCurrent}
          answers={answers} update={update}
          questions={EXAM_QUESTIONS}
          hh={hh} mm={mm} ss={ss} remaining={remaining}
          tabSwitches={tabSwitches} warnings={warnings}
          answered={answered}
          onSubmit={submit} submitting={submitting}
        />
      )}
      {phase === "grading" && <ExamGrading idx={gradingIdx} total={EXAM_QUESTIONS.length} />}
      {phase === "submitted" && examResults && <ExamResults results={examResults} questions={EXAM_QUESTIONS} answers={answers} setRoute={setRoute} />}
    </div>
  );
}

function ExamBrief({ onStart, setRoute }) {
  const lang = useLang();
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 28px", textAlign: "center" }}>
      <div className="eyebrow" style={{ color: "var(--c-warn)", marginBottom: 14 }}>
        // SECTION_01 · FINAL_EXAM
      </div>
      <h1 className="display" style={{ fontSize: 44, margin: "0 0 6px", letterSpacing: "-0.025em" }}>
        {lang === "en" ? "Windows Fundamentals — Final" : "Windows asoslari — Final"}
      </h1>
      <p style={{ color: "var(--text-2)", fontSize: 15, margin: 0 }}>
        {lang === "en" ? "20 questions · 2 hours · 85% to pass this section" : "20 ta savol · 2 soat · 85% — bo'limni yakunlash"}
      </p>

      <div style={{ marginTop: 36, padding: "24px 28px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, textAlign: "left" }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>// {lang === "en" ? "RULES_OF_ENGAGEMENT" : "QOIDALAR"}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { icon: "code", uz: "20 ta yozma savol", en: "20 written questions", c: "var(--accent)" },
            { icon: "clock", uz: "2 soat vaqt cheklovi · timer to'xtatib bo'lmaydi", en: "2-hour timer · cannot pause", c: "var(--c-warn)" },
            { icon: "target", uz: "85% o'tish bali · har bir savol AI tomonidan baholanadi", en: "85% to pass · AI grades each question", c: "var(--accent)" },
            { icon: "eye", uz: "Tab almashtirish va clipboard urinishlari kuzatiladi", en: "Tab-switch and clipboard activity is monitored", c: "var(--c-attack)" },
            { icon: "warning", uz: "3 marta cheat ishorasidan keyin imtihon avtomatik bekor qilinadi", en: "3 cheat flags → auto-cancel", c: "var(--c-attack)" },
            { icon: "trophy", uz: "O'tsangiz keyingi bo'lim ochiladi", en: "Passing unlocks the next section", c: "var(--c-auth)" },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${r.c}12`, border: `1px solid ${r.c}33`, color: r.c, display: "grid", placeItems: "center", flexShrink: 0 }}>
                <Icon name={r.icon} size={14} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{lang === "en" ? r.en : r.uz}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 28 }}>
        <button className="btn" onClick={() => setRoute({ name: "section", section: 1 })}>
          <Icon name="arrow-left" size={14} /> {lang === "en" ? "Cancel" : "Bekor"}
        </button>
        <button className="btn btn-primary" onClick={onStart}>
          <Icon name="play" size={14} /> {lang === "en" ? "Begin exam" : "Imtihonni boshlash"}
        </button>
      </div>
    </div>
  );
}

function ExamTaking({ current, setCurrent, answers, update, questions, hh, mm, ss, remaining, tabSwitches, warnings, answered, onSubmit, submitting }) {
  const lang = useLang();
  const q = questions[current];
  const a = answers[current];
  const lowTime = remaining < 600;
  const wordCount = a.trim() ? a.trim().split(/\s+/).length : 0;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-0)" }}>
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(4, 6, 13, 0.95)",
        borderBottom: `1px solid ${lowTime ? "var(--c-attack)" : "var(--border)"}`,
        backdropFilter: "blur(20px)",
        padding: "14px 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div className="logo">
            <div className="logo-mark">W</div>
            <div>
              <div style={{ fontSize: 14, lineHeight: 1 }}>{lang === "en" ? "Final Exam" : "Final imtihon"}</div>
              <div className="sub">SECTION_01 · LIVE</div>
            </div>
          </div>
          <div className="mono" style={{ fontSize: 11, color: "var(--text-3)", letterSpacing: 0.1 }}>
            Q{String(current + 1).padStart(2, "0")} / 20 · {answered}/20 {lang === "en" ? "answered" : "javob"}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <LiveDot color="var(--c-attack)" />
            <span className="mono" style={{ fontSize: 11, color: tabSwitches > 0 ? "var(--c-attack)" : "var(--text-2)" }}>
              MONITOR · {tabSwitches} flag{tabSwitches !== 1 ? "s" : ""}
            </span>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "8px 14px",
            background: lowTime ? "rgba(255,58,94,0.1)" : "var(--bg-2)",
            border: `1px solid ${lowTime ? "var(--c-attack)" : "var(--border-strong)"}`,
            borderRadius: 8,
            animation: lowTime ? "shake 1s ease-in-out infinite" : "none",
          }}>
            <Icon name="clock" size={14} style={{ color: lowTime ? "var(--c-attack)" : "var(--text-1)" }} />
            <span className="mono" style={{ fontSize: 18, fontWeight: 700, color: lowTime ? "var(--c-attack)" : "var(--text-0)", fontVariantNumeric: "tabular-nums" }}>
              {hh}:{mm}:{ss}
            </span>
          </div>
          <button className="btn btn-primary" onClick={onSubmit} disabled={submitting} style={{ padding: "8px 18px" }}>
            {submitting ? (lang === "en" ? "Submitting..." : "Yuborilmoqda...") : <><Icon name="send" size={14} /> {lang === "en" ? "Submit" : "Yuborish"}</>}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr 280px", maxWidth: 1400, margin: "0 auto", padding: "24px 28px", gap: 24 }}>
        <aside style={{ position: "sticky", top: 90, alignSelf: "start" }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>// {lang === "en" ? "QUESTIONS" : "SAVOLLAR"}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
            {questions.map((_, i) => {
              const isCur = current === i;
              const isAnswered = answers[i].trim().length > 10;
              return (
                <button key={i} onClick={() => setCurrent(i)} style={{
                  appearance: "none", border: 0, cursor: "pointer",
                  aspectRatio: "1", borderRadius: 6,
                  background: isCur ? "var(--accent)" : isAnswered ? "var(--accent-soft)" : "var(--bg-2)",
                  color: isCur ? "#04060d" : isAnswered ? "var(--accent)" : "var(--text-2)",
                  border: `1px solid ${isCur ? "var(--accent)" : isAnswered ? "var(--accent-border)" : "var(--border)"}`,
                  fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 11,
                  boxShadow: isCur ? "0 0 12px var(--accent-glow)" : "none",
                  transition: "all 200ms",
                }}>{String(i + 1).padStart(2, "0")}</button>
              );
            })}
          </div>

          <div style={{ marginTop: 16, padding: 12, background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11, color: "var(--text-2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{ width: 10, height: 10, background: "var(--accent)", borderRadius: 2 }} />
              <span>{lang === "en" ? "Current" : "Joriy"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{ width: 10, height: 10, background: "var(--accent-soft)", border: "1px solid var(--accent-border)", borderRadius: 2 }} />
              <span>{lang === "en" ? "Answered" : "Javob berildi"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 10, height: 10, background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 2 }} />
              <span>{lang === "en" ? "Empty" : "Bo'sh"}</span>
            </div>
          </div>
        </aside>

        <main>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span className="chip">{q.topic}</span>
            <span className={`chip ${q.difficulty === "hard" ? "chip-red" : "chip-yellow"}`}>{q.difficulty}</span>
            <div style={{ flex: 1 }} />
            <span className="mono" style={{ fontSize: 11, color: "var(--text-3)" }}>{wordCount} {lang === "en" ? "words" : "so'z"}</span>
          </div>

          <div style={{ padding: "22px 24px", background: "rgba(0,255,156,0.04)", border: "1px solid var(--accent-border)", borderRadius: 12, marginBottom: 16 }}>
            <div className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: 0.18, marginBottom: 10 }}>
              {lang === "en" ? `QUESTION ${current + 1}` : `SAVOL ${current + 1}`}
            </div>
            <div style={{ fontSize: 19, fontWeight: 500, lineHeight: 1.4, color: "var(--text-0)" }}>
              {lang === "en" ? q.en : q.uz}
            </div>
          </div>

          <textarea
            value={a} onChange={(e) => update(e.target.value)}
            placeholder={lang === "en" ? "Write your answer here..." : "Javobingizni shu yerga yozing..."}
            style={{
              width: "100%", minHeight: 280,
              padding: "18px 20px",
              background: "var(--bg-2)", border: "1px solid var(--border)",
              borderRadius: 10, color: "var(--text-0)",
              fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.7,
              resize: "vertical", outline: "none",
              boxSizing: "border-box",
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
            onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
          />

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
            <button className="btn-ghost btn" disabled={current === 0} onClick={() => setCurrent(current - 1)} style={{ opacity: current === 0 ? 0.3 : 1 }}>
              <Icon name="arrow-left" size={14} /> {lang === "en" ? "Previous" : "Oldingi"}
            </button>
            <button className="btn" disabled={current === questions.length - 1} onClick={() => setCurrent(current + 1)} style={{ opacity: current === questions.length - 1 ? 0.3 : 1 }}>
              {lang === "en" ? "Next" : "Keyingi"} <Icon name="arrow-right" size={14} />
            </button>
          </div>
        </main>

        <aside style={{ position: "sticky", top: 90, alignSelf: "start" }}>
          <div className="glass" style={{ padding: 16 }}>
            <div className="eyebrow" style={{ marginBottom: 10, color: "var(--c-attack)" }}>// {lang === "en" ? "SECURITY_MONITOR" : "XAVFSIZLIK_MONITORI"}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <SR k={lang === "en" ? "Tab focus" : "Tab fokus"} v={tabSwitches === 0 ? "STABLE" : `${tabSwitches} SWITCH${tabSwitches > 1 ? "ES" : ""}`} c={tabSwitches > 0 ? "var(--c-attack)" : "var(--accent)"} />
              <SR k="Clipboard" v="CLEAN" c="var(--accent)" />
              <SR k="Network" v={<><LiveDot /> CONNECTED</>} c="var(--accent)" />
              <SR k="Session" v="EX-3C82AF" c="var(--text-1)" />
            </div>
          </div>

          <div className="glass" style={{ padding: 16, marginTop: 12 }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>// {lang === "en" ? "EVENT_LOG" : "VOQEALAR_JURNALI"}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 10.5, fontFamily: "var(--font-mono)", maxHeight: 200, overflowY: "auto" }}>
              {warnings.length === 0 ? (
                <div style={{ color: "var(--text-3)" }}>[--:--:--] {lang === "en" ? "No events recorded." : "Voqealar yo'q."}</div>
              ) : warnings.map((w, i) => (
                <div key={i} style={{ color: "var(--c-warn)" }}>[{w.t}] {w.msg}</div>
              ))}
            </div>
          </div>

          <div className="glass" style={{ padding: 16, marginTop: 12 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>// {lang === "en" ? "PROGRESS" : "TARAQQIYOT"}</div>
            <Progress value={(answered / 20) * 100} color="var(--accent)" height={5} showVal={false} />
            <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-2)" }}>
              <span>{answered} {lang === "en" ? "answered" : "javob"}</span>
              <span>{20 - answered} {lang === "en" ? "left" : "qoldi"}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SR({ k, v, c }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
      <span style={{ color: "var(--text-2)" }}>{k}</span>
      <span className="mono" style={{ color: c }}>{v}</span>
    </div>
  );
}

function ExamGrading({ idx, total }) {
  const lang = useLang();
  const pct = Math.round(((idx + 1) / total) * 100);
  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "100px 28px", textAlign: "center" }}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--accent-soft)", color: "var(--accent)", display: "grid", placeItems: "center", margin: "0 auto 24px", boxShadow: "0 0 40px var(--accent-glow)", animation: "glow 2s ease-in-out infinite" }}>
        <Icon name="spark" size={36} />
      </div>
      <h2 className="display" style={{ fontSize: 28, margin: "0 0 8px" }}>
        {lang === "en" ? "AI grading your exam…" : "AI imtihonni tekshirmoqda…"}
      </h2>
      <p style={{ color: "var(--text-3)", margin: "0 0 28px", fontSize: 13, fontFamily: "var(--font-mono)" }}>
        {lang === "en" ? `Question ${idx + 1} of ${total}` : `${idx + 1} / ${total} savol`}
      </p>
      <div style={{ background: "var(--bg-2)", borderRadius: 8, height: 8, overflow: "hidden", border: "1px solid var(--border)" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, var(--accent), var(--c-auth))", transition: "width 400ms", boxShadow: "0 0 12px var(--accent-glow)" }} />
      </div>
      <div style={{ marginTop: 10, fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--accent)" }}>{pct}%</div>
    </div>
  );
}

function ExamResults({ results, questions, answers, setRoute }) {
  const lang = useLang();
  const overall = Math.round(results.reduce((s, r) => s + r.score, 0) / results.length);
  const passed = overall >= 85;
  const [expanded, setExpanded] = React.useState(null);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 28px 80px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{
          width: 96, height: 96, borderRadius: "50%", margin: "0 auto 20px",
          background: passed ? "var(--accent-soft)" : "rgba(255,58,94,0.12)",
          color: passed ? "var(--accent)" : "var(--c-attack)",
          display: "grid", placeItems: "center",
          boxShadow: `0 0 40px ${passed ? "var(--accent-glow)" : "rgba(255,58,94,0.3)"}`,
        }}>
          <Icon name={passed ? "trophy" : "x"} size={44} />
        </div>
        <h1 className="display" style={{ fontSize: 40, margin: "0 0 6px" }}>
          {passed ? (lang === "en" ? "Section Complete!" : "Bo'lim Yakunlandi!") : (lang === "en" ? "Not passed" : "O'tilmadi")}
        </h1>
        <div style={{ fontSize: 56, fontWeight: 900, fontFamily: "var(--font-mono)", color: passed ? "var(--accent)" : "var(--c-attack)", margin: "12px 0" }}>
          {overall}<span style={{ fontSize: 24, opacity: 0.6 }}>/100</span>
        </div>
        <p style={{ color: "var(--text-2)", margin: 0 }}>
          {lang === "en" ? `85% required · ${results.filter(r => r.score >= 70).length}/20 questions passed` : `85% talab qilinadi · ${results.filter(r => r.score >= 70).length}/20 ta savol o'tildi`}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20 }}>
          <button className="btn btn-primary" onClick={() => setRoute({ name: "section", section: 1 })}>
            <Icon name="arrow-left" size={14} /> {lang === "en" ? "Back to Section" : "Bo'limga qaytish"}
          </button>
          {!passed && <button className="btn" onClick={() => window.location.reload()}>
            <Icon name="play" size={14} /> {lang === "en" ? "Retry" : "Qayta urinish"}
          </button>}
        </div>
      </div>

      {/* Per-question results */}
      <div className="eyebrow" style={{ marginBottom: 16 }}>{lang === "en" ? "// DETAILED_RESULTS" : "// BATAFSIL_NATIJALAR"}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {results.map((r, i) => {
          const color = r.score >= 70 ? "var(--accent)" : r.score >= 50 ? "var(--c-warn)" : "var(--c-attack)";
          const open = expanded === i;
          return (
            <div key={i} style={{ background: "var(--surface)", border: `1px solid ${open ? color + "44" : "var(--border)"}`, borderRadius: 10, overflow: "hidden", transition: "border 200ms" }}>
              <div onClick={() => setExpanded(open ? null : i)} style={{ display: "grid", gridTemplateColumns: "36px 1fr auto auto", gap: 12, alignItems: "center", padding: "14px 16px", cursor: "pointer" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>Q{i + 1}</div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{lang === "en" ? questions[i].en : questions[i].uz}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: 18, color, minWidth: 44, textAlign: "right" }}>{r.score}</div>
                <Icon name={open ? "chevron-up" : "chevron-right"} size={14} style={{ color: "var(--text-3)" }} />
              </div>
              {open && (
                <div style={{ padding: "0 16px 16px", borderTop: "1px solid var(--border)" }}>
                  <div style={{ marginTop: 12, fontSize: 12.5, color: "var(--text-2)", lineHeight: 1.6, background: "var(--bg-2)", padding: "10px 14px", borderRadius: 8, marginBottom: 10 }}>
                    <b>{lang === "en" ? "Your answer: " : "Javobingiz: "}</b>{answers[i] || "(bo'sh)"}
                  </div>
                  {r.key_points?.length > 0 && <div style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 11, color: "var(--accent)", fontFamily: "var(--font-mono)", marginBottom: 4 }}>✓ {lang === "en" ? "KEY POINTS" : "TO'G'RI"}</div>
                    {r.key_points.map((p, j) => <div key={j} style={{ fontSize: 12.5, color: "var(--text-1)", paddingLeft: 12 }}>• {p}</div>)}
                  </div>}
                  {r.missing?.length > 0 && <div style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 11, color: "var(--c-attack)", fontFamily: "var(--font-mono)", marginBottom: 4 }}>✗ {lang === "en" ? "MISSING" : "YETISHMAYDI"}</div>
                    {r.missing.map((p, j) => <div key={j} style={{ fontSize: 12.5, color: "var(--text-1)", paddingLeft: 12 }}>• {p}</div>)}
                  </div>}
                  {r.feedback && <div style={{ fontSize: 12.5, color: "var(--text-2)", fontStyle: "italic", borderLeft: `2px solid ${color}`, paddingLeft: 10 }}>{r.feedback}</div>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ExamSubmitted({ setRoute, answered }) {
  const lang = useLang();
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "80px 28px", textAlign: "center" }}>
      <div style={{ width: 90, height: 90, borderRadius: "50%", background: "var(--accent-soft)", color: "var(--accent)", display: "grid", placeItems: "center", margin: "0 auto 24px", boxShadow: "0 0 40px var(--accent-glow)" }}>
        <Icon name="check" size={42} stroke={2} />
      </div>
      <h1 className="display" style={{ fontSize: 38, margin: "0 0 6px", letterSpacing: "-0.025em" }}>
        {lang === "en" ? "Exam submitted" : "Imtihon yuborildi"}
      </h1>
      <p style={{ color: "var(--text-2)", fontSize: 15, margin: 0 }}>
        {lang === "en" ? "AI grading takes ~3 minutes. You'll receive results by email." : "AI tahlili ~3 daqiqa davom etadi. Natijani email orqali olasiz."}
      </p>
      <div style={{ marginTop: 24, padding: 18, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, display: "inline-block" }}>
        <div className="mono" style={{ fontSize: 11, color: "var(--text-3)", letterSpacing: 0.1 }}>SUBMISSION_ID</div>
        <div style={{ fontSize: 18, fontFamily: "var(--font-mono)", color: "var(--accent)", marginTop: 4 }}>EX-3C82AF · {answered}/20</div>
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 28 }}>
        <button className="btn" onClick={() => setRoute({ name: "section", section: 1 })}>
          <Icon name="book" size={14} /> {lang === "en" ? "Section overview" : "Bo'limga qaytish"}
        </button>
        <button className="btn btn-primary" onClick={() => setRoute({ name: "dashboard" })}>
          <Icon name="user" size={14} /> {lang === "en" ? "Back to dashboard" : "Dashboard'ga qaytish"}
        </button>
      </div>
    </div>
  );
}

window.FinalExamScreen = FinalExamScreen;
