// quiz.jsx — quiz modal with REAL Claude grading
// Flow: intro → answer 3 questions (written) → AI grades each → pass/fail summary

const { useState: useQS, useEffect: useQE, useRef: useQR } = React;

// Static fallback questions per lesson
const FALLBACK_QUESTIONS = {
  1: [
    { uz: "User mode va Kernel mode farqini tushuntirib bering. Qaysi ring darajalari va nima uchun bu chegara xavfsizlik uchun muhim?", en: "Explain the difference between user mode and kernel mode. What CPU rings are used, and why is this boundary critical for security?" },
    { uz: "Windows arxitekturasidagi Executive, Microkernel va HAL qatlamlarini tushuntiring. Ularning har biri qanday vazifani bajaradi?", en: "Explain the Executive, Microkernel and HAL layers in Windows architecture. What does each layer do?" },
    { uz: "ntoskrnl.exe ichida qanday komponentlar mavjud va ular bir-biri bilan qanday o'zaro ishlaydi?", en: "What components exist inside ntoskrnl.exe and how do they interact with each other?" },
  ],
  2: [
    { uz: "Windows boot ketma-ketligini UEFI'dan login ekraniga qadar bosqichma-bosqich tushuntiring. Har bir bosqich keyingisini qanday tekshiradi?", en: "Walk through the Windows boot sequence step-by-step from UEFI to login. How does each stage verify the next?" },
    { uz: "ReadFile() chaqiruvi user mode'dan kernel mode'gacha va orqaga qaytishida qaysi qatlamlardan o'tadi? ntdll va syscall buyrug'ining roli nima?", en: "Which layers does ReadFile() traverse from user mode to kernel and back? What is the role of ntdll and the syscall instruction?" },
    { uz: "Secure Boot kriptografik zanjiri qanday ishlaydi va BlackLotus rootkiti uni qanday chetlab o'tdi?", en: "How does the Secure Boot cryptographic chain work and how did the BlackLotus rootkit bypass it?" },
  ],
};

const COOLDOWN_KEY = "wa_cooldown_end";
const COOLDOWN_DURATION = 30 * 60 * 1000; // 30 min in ms

function QuizModal({ onClose, onPass, onFail, lessonNum = 1 }) {
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
      score, passed: score >= 70,
      strengths: wc >= 50 ? [lang === "en" ? "Detailed answer" : "Batafsil javob"] : [],
      weaknesses: wc < 50 ? [lang === "en" ? "Too brief — AI key not set" : "Juda qisqa — AI kalit o'rnatilmagan"] : [],
      feedback: lang === "en" ? "Set an AI key in Tweaks panel for real grading." : "Haqiqiy baholash uchun Tweaks panelida AI kalitini o'rnating.",
    };
  };

  const TOPICS = {
    1: "Windows architecture: user mode vs kernel mode (rings), Executive layer, Microkernel, HAL, ntoskrnl.exe components and how they interact",
    2: "Windows boot sequence (UEFI/POST → bootmgr → winload → kernel → LSASS → login), syscall flow (ReadFile → kernel32 → ntdll → syscall gate → Executive), Secure Boot chain and bypass techniques like BlackLotus",
  };

  const generate = async () => {
    setLoading(true); setErr(null);
    try {
      if (hasKey()) {
        const prompt = `Generate 3 advanced written questions for a Windows internals security course.
Topic focus: ${TOPICS[lessonNum] || TOPICS[1]}
Requirements: each question needs multi-sentence written explanation (not yes/no). Mix: 1 conceptual, 1 technical-deep, 1 security-implication.
Use a DIFFERENT angle than previous attempts — vary the specific concepts asked.
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
    setPhase("grading"); setLoading(true); setErr(null);
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
  const passed = results ? overall >= 70 && results.every((r) => r.score >= 50) : false;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle} className="fade-up">
        <ModalHeader phase={phase} onClose={onClose} />

        <div style={{ padding: "0 32px 32px", flex: 1, overflowY: "auto", minHeight: 0 }}>
          {phase === "intro" && <Intro onStart={generate} loading={loading} />}
          {phase === "answering" && questions && (
            <Answering
              questions={questions} answers={answers} setAnswers={setAnswers}
              current={current} setCurrent={setCurrent}
              onSubmit={submit}
            />
          )}
          {phase === "grading" && <Grading />}
          {phase === "result" && results && (
            <Result
              results={results} questions={questions} answers={answers}
              overall={overall} passed={passed}
              onContinue={() => passed ? onPass() : onFail()}
            />
          )}
          {err && <div style={{ color: "var(--c-attack)", padding: 12, fontSize: 12 }}>Error: {err}</div>}
        </div>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed", inset: 0, zIndex: 1000,
  background: "rgba(2, 4, 10, 0.78)",
  backdropFilter: "blur(8px)",
  display: "grid", placeItems: "center",
  padding: 24,
  animation: "fadeUp 200ms ease",
};

const modalStyle = {
  background: "rgba(8, 12, 24, 0.95)",
  border: "1px solid var(--accent-border)",
  borderRadius: 18,
  width: "100%", maxWidth: 920,
  maxHeight: "92vh",
  display: "flex", flexDirection: "column",
  boxShadow: "0 30px 100px rgba(0,0,0,0.6), 0 0 40px var(--accent-soft)",
  overflow: "hidden",
};

function ModalHeader({ phase, onClose }) {
  const lang = useLang();
  const labels = {
    intro: { uz: "Test boshlash", en: "Begin assessment" },
    answering: { uz: "Yozma test", en: "Written assessment" },
    grading: { uz: "AI tekshirmoqda...", en: "AI grading..." },
    result: { uz: "Natijalar", en: "Results" },
  };
  return (
    <div style={{
      padding: "20px 32px",
      borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: "linear-gradient(180deg, rgba(0,255,156,0.04), transparent)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--accent)", color: "#04060d", display: "grid", placeItems: "center", boxShadow: "0 0 20px var(--accent-glow)" }}>
          <Icon name="target" size={18} />
        </div>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600 }}>{lang === "en" ? labels[phase].en : labels[phase].uz}</div>
          <div style={{ fontSize: 11.5, color: "var(--text-3)" }}>
            {lang === "en" ? "Lesson 01 · Windows architecture" : "Dars 01 · Windows arxitekturasi"}
          </div>
        </div>
      </div>
      <button onClick={onClose} className="btn-ghost btn" style={{ padding: 8 }}><Icon name="x" size={16} /></button>
    </div>
  );
}

function Intro({ onStart, loading }) {
  const lang = useLang();
  const hasKey = !!(localStorage.getItem("wa_ai_provider") && localStorage.getItem("wa_ai_key"));
  return (
    <div style={{ padding: "32px 0", textAlign: "center" }}>
      <div style={{
        width: 80, height: 80, borderRadius: "50%",
        background: "radial-gradient(circle, var(--accent-soft), transparent 70%)",
        margin: "0 auto 20px", display: "grid", placeItems: "center",
        color: "var(--accent)",
        animation: "glow 2.5s ease-in-out infinite",
      }}>
        <Icon name="target" size={36} />
      </div>

      <h2 className="display" style={{ fontSize: 26, margin: "0 0 6px", letterSpacing: "-0.02em" }}>
        {lang === "en" ? "Windows architecture mastery check" : "Windows arxitekturasi: bilim tekshiruvi"}
      </h2>
      <p style={{ color: "var(--text-2)", margin: "0 0 24px", fontSize: 14 }}>
        {lang === "en"
          ? "3 written questions · AI-graded · 70+ to pass"
          : "3 ta yozma savol · AI tomonidan baholanadi · 70+ ball — o'tasiz"}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 26 }}>
        {[
          { icon: "code", uz: "3 ta savol", en: "3 questions", c: "var(--accent)" },
          { icon: "spark", uz: "AI baholash", en: "AI grading", c: "var(--c-auth)" },
          { icon: "warning", uz: "Min 70%", en: "70% to pass", c: "var(--c-warn)" },
        ].map((s, i) => (
          <div key={i} style={{ padding: 14, background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 10 }}>
            <div style={{ color: s.c, marginBottom: 6 }}><Icon name={s.icon} size={18} /></div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{lang === "en" ? s.en : s.uz}</div>
          </div>
        ))}
      </div>

      {!hasKey && (
        <div style={{ padding: 14, background: "rgba(255,145,0,0.07)", border: "1px solid rgba(255,145,0,0.3)", borderRadius: 10, textAlign: "left", marginBottom: 16, display: "flex", gap: 10, alignItems: "flex-start" }}>
          <Icon name="warning" size={15} style={{ color: "var(--c-warn)", flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: 12, color: "var(--text-1)", lineHeight: 1.55 }}>
            <b style={{ color: "var(--c-warn)" }}>{lang === "en" ? "AI grader off:" : "AI tekshiruv o'chiq:"}</b>{" "}
            {lang === "en"
              ? "Open Tweaks panel (⚙) → AI Grader, choose provider and paste your API key for real AI grading."
              : "Tweaks panel (⚙) → AI Tekshiruvchi bo'limiga kiring, provider tanlang va API kalitingizni kiriting."}
          </div>
        </div>
      )}
      <div style={{ padding: 16, background: "rgba(255,58,94,0.06)", border: "1px solid rgba(255,58,94,0.25)", borderRadius: 10, textAlign: "left", marginBottom: 24, display: "flex", gap: 12, alignItems: "flex-start" }}>
        <Icon name="warning" size={16} style={{ color: "var(--c-attack)", flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: 12.5, color: "var(--text-1)", lineHeight: 1.55 }}>
          <b style={{ color: "var(--c-attack)" }}>{lang === "en" ? "Heads up:" : "Diqqat:"}</b>{" "}
          {lang === "en"
            ? <>If you fail, a <code style={{ color: "var(--c-attack)" }}>30-minute</code> lockout begins and fresh questions will be generated for your next attempt.</>
            : <>Yiqilsangiz <code style={{ color: "var(--c-attack)" }}>30 daqiqalik</code> bloklash boshlanadi va keyingi urinishda yangi savollar bo'ladi.</>}
        </div>
      </div>

      <button className="btn btn-primary" onClick={onStart} disabled={loading}>
        {loading ? <><span style={{ display: "inline-block", animation: "spin-slow 1s linear infinite" }}>↻</span> {lang === "en" ? "Generating questions..." : "Savollar tayyorlanmoqda..."}</> : <><Icon name="play" size={14} /> {lang === "en" ? "Begin" : "Boshlash"}</>}
      </button>
    </div>
  );
}

function Answering({ questions, answers, setAnswers, current, setCurrent, onSubmit }) {
  const lang = useLang();
  const q = questions[current];
  const a = answers[current];
  const wordCount = a.trim() ? a.trim().split(/\s+/).length : 0;
  const allAnswered = answers.every((x) => x.trim().length > 10);

  const update = (val) => {
    const next = [...answers]; next[current] = val; setAnswers(next);
  };

  return (
    <div style={{ paddingTop: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 22 }}>
        {questions.map((_, i) => (
          <div key={i} onClick={() => setCurrent(i)} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: i === current ? "var(--accent)" :
                          answers[i].trim().length > 10 ? "var(--accent-soft)" : "var(--bg-2)",
              color: i === current ? "#04060d" : answers[i].trim().length > 10 ? "var(--accent)" : "var(--text-3)",
              border: `1.5px solid ${i === current ? "var(--accent)" : answers[i].trim().length > 10 ? "var(--accent-border)" : "var(--border)"}`,
              display: "grid", placeItems: "center",
              fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 11,
              boxShadow: i === current ? "0 0 14px var(--accent-glow)" : "none",
              transition: "all 200ms",
            }}>{answers[i].trim().length > 10 && i !== current ? <Icon name="check" size={12} /> : i + 1}</div>
            {i < questions.length - 1 && (
              <div style={{ width: 40, height: 1, background: answers[i].trim().length > 10 ? "var(--accent-border)" : "var(--border)" }} />
            )}
          </div>
        ))}
      </div>

      <div style={{ padding: 22, background: "rgba(0,255,156,0.04)", border: "1px solid var(--accent-border)", borderRadius: 12, marginBottom: 16 }}>
        <div className="mono" style={{ fontSize: 10, color: "var(--accent)", letterSpacing: 0.18, marginBottom: 10 }}>
          {lang === "en" ? `QUESTION ${current + 1} OF 3` : `SAVOL ${current + 1} / 3`}
        </div>
        <div style={{ fontSize: 17, fontWeight: 500, lineHeight: 1.5, color: "var(--text-0)" }}>
          {lang === "en" ? q.en : q.uz}
        </div>
      </div>

      <div style={{ position: "relative" }}>
        <textarea
          value={a}
          onChange={(e) => update(e.target.value)}
          placeholder={lang === "en"
            ? "Write your answer here. Use precise technical terms..."
            : "Javobingizni shu yerga yozing. Aniq texnik atamalardan foydalaning..."}
          style={{
            width: "100%", minHeight: 180,
            padding: "16px 18px",
            background: "var(--bg-2)", border: "1px solid var(--border)",
            borderRadius: 10, color: "var(--text-0)",
            fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.65,
            resize: "vertical", outline: "none",
            transition: "border-color 200ms", boxSizing: "border-box",
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
          onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
        />
        <div style={{ position: "absolute", bottom: 8, right: 12, fontSize: 11, fontFamily: "var(--font-mono)", color: wordCount < 30 ? "var(--text-3)" : wordCount < 60 ? "var(--c-warn)" : "var(--accent)" }}>
          {wordCount} {lang === "en" ? "words" : "so'z"}{wordCount < 30 && (lang === "en" ? " · write more" : " · ko'proq yozing")}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18, alignItems: "center" }}>
        <button className="btn-ghost btn" disabled={current === 0}
          style={{ opacity: current === 0 ? 0.3 : 1 }}
          onClick={() => setCurrent(current - 1)}>
          <Icon name="arrow-left" size={14} /> {lang === "en" ? "Previous" : "Oldingi"}
        </button>

        <div style={{ fontSize: 11, color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
          {answers.filter((x) => x.trim().length > 10).length}/3 {lang === "en" ? "answered" : "javob berildi"}
        </div>

        {current < questions.length - 1 ? (
          <button className="btn" onClick={() => setCurrent(current + 1)}>
            {lang === "en" ? "Next" : "Keyingi"} <Icon name="arrow-right" size={14} />
          </button>
        ) : (
          <button className="btn btn-primary" onClick={onSubmit} disabled={!allAnswered}>
            <Icon name="send" size={14} /> {lang === "en" ? "Submit to AI" : "AI'ga yuborish"}
          </button>
        )}
      </div>
    </div>
  );
}

function Grading() {
  const lang = useLang();
  const phasesUz = [
    "Javoblar Claude'ga yuborilmoqda",
    "Semantik tahlil",
    "Texnik terminologiya tekshiruvi",
    "Yakuniy bal hisoblanmoqda",
  ];
  const phasesEn = [
    "Submitting answers to Claude",
    "Semantic analysis",
    "Technical terminology check",
    "Final score calculation",
  ];
  const phases = lang === "en" ? phasesEn : phasesUz;
  const [step, setStep] = useQS(0);
  useQE(() => {
    const t = setInterval(() => setStep((s) => Math.min(phases.length - 1, s + 1)), 1100);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ padding: "48px 0", textAlign: "center" }}>
      <div style={{ width: 100, height: 100, margin: "0 auto 24px", position: "relative" }}>
        <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", animation: "spin-slow 3s linear infinite" }}>
          <circle cx="50" cy="50" r="42" fill="none" stroke="var(--bg-3)" strokeWidth="3" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="var(--accent)" strokeWidth="3"
                  strokeDasharray="80 264" strokeLinecap="round" />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "var(--accent)" }}>
          <Icon name="spark" size={32} />
        </div>
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, marginBottom: 6 }}>
        {lang === "en" ? "AI is grading" : "AI tekshirmoqda"}
      </div>
      <div style={{ color: "var(--text-2)", fontSize: 13, marginBottom: 28 }}>
        {lang === "en" ? "Claude is analyzing your answers" : "Claude javoblaringizni tahlil qilmoqda"}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 420, margin: "0 auto" }}>
        {phases.map((p, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 14px", borderRadius: 8,
            background: i <= step ? "var(--accent-soft)" : "var(--bg-2)",
            border: `1px solid ${i <= step ? "var(--accent-border)" : "var(--border)"}`,
            opacity: i <= step ? 1 : 0.5,
            transition: "all 400ms",
          }}>
            <div style={{ width: 18, height: 18, color: i < step ? "var(--accent)" : i === step ? "var(--accent)" : "var(--text-3)" }}>
              {i < step ? <Icon name="check" size={18} /> :
               i === step ? <div style={{ width: 16, height: 16, border: "2px solid var(--accent)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin-slow 0.8s linear infinite" }} /> :
               <div style={{ width: 8, height: 8, borderRadius: "50%", background: "currentColor", margin: 5 }} />}
            </div>
            <div style={{ flex: 1, textAlign: "left", fontSize: 13, fontWeight: 500 }}>{p}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Result({ results, questions, answers, overall, passed, onContinue }) {
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

  const endsAt = !passed ? (+localStorage.getItem(COOLDOWN_KEY) || 0) : 0;
  const remaining = Math.max(0, Math.floor((endsAt - now) / 1000));
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const unlocked = !passed ? remaining === 0 : true;

  return (
    <div style={{ paddingTop: 20 }}>
      <div style={{ textAlign: "center", padding: "12px 0 24px" }}>
        <div className="mono" style={{ fontSize: 11, letterSpacing: 0.18, color: passed ? "var(--accent)" : "var(--c-attack)", marginBottom: 8 }}>
          {passed
            ? (lang === "en" ? "// PASSED · OPENING NEXT LESSON" : "// O'TILDI · KEYINGI DARS OCHILMOQDA")
            : (lang === "en" ? "// FAILED · COOLDOWN INITIATED" : "// YIQILDI · BLOKLASH BOSHLANDI")}
        </div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4 }}>
          <div className="display" style={{
            fontSize: 88, fontWeight: 600, letterSpacing: "-0.04em",
            color: passed ? "var(--accent)" : "var(--c-attack)",
            textShadow: `0 0 40px ${passed ? "var(--accent-glow)" : "rgba(255,58,94,0.4)"}`,
            lineHeight: 1,
          }}>{overall}</div>
          <div style={{ fontSize: 22, color: "var(--text-2)", fontFamily: "var(--font-display)" }}>/100</div>
        </div>
        <div style={{ fontSize: 14, color: "var(--text-2)", marginTop: 8 }}>
          {passed
            ? (lang === "en"
                ? <><b style={{ color: "var(--accent)" }}>Excellent!</b> You've mastered the Windows architecture basics.</>
                : <><b style={{ color: "var(--accent)" }}>Mukammal!</b> Siz Windows arxitekturasi asoslarini o'zlashtirdingiz.</>)
            : (lang === "en"
                ? <><b style={{ color: "var(--c-attack)" }}>Not yet.</b> Review and come back.</>
                : <><b style={{ color: "var(--c-attack)" }}>Hozircha o'ta olmadingiz.</b> O'rganib qaytib keling.</>)}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {results.map((r, i) => (
          <ResultCard key={i} idx={i} q={questions[i]} a={answers[i]} r={r} />
        ))}
      </div>

      {!passed && (
        <div style={{ margin: "20px 0", padding: "18px 24px", background: "rgba(255,58,94,0.06)", border: "1px solid rgba(255,58,94,0.25)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div>
            <div className="mono" style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: 0.18, marginBottom: 4 }}>
              {unlocked ? (lang === "en" ? "READY TO RETRY" : "QAYTA URINISH MUMKIN") : (lang === "en" ? "NEXT ATTEMPT IN" : "KEYINGI URINISH")}
            </div>
            <div className="display" style={{ fontSize: 44, fontWeight: 700, letterSpacing: "-0.04em", color: unlocked ? "var(--accent)" : "var(--c-attack)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
              {unlocked ? "00:00" : `${mm}:${ss}`}
            </div>
          </div>
          <div style={{ flex: 1, maxWidth: 180 }}>
            <div style={{ height: 5, background: "var(--bg-2)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", background: unlocked ? "var(--accent)" : "var(--c-attack)", borderRadius: 4, width: `${unlocked ? 100 : ((COOLDOWN_DURATION / 1000 - remaining) / (COOLDOWN_DURATION / 1000)) * 100}%`, transition: "width 1s linear" }} />
            </div>
            <div style={{ marginTop: 6, fontSize: 10, color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>30:00 {lang === "en" ? "total" : "jami"}</div>
          </div>
        </div>
      )}

      <div style={{ marginTop: 16, textAlign: "center" }}>
        <button
          className={`btn ${passed ? "btn-primary" : unlocked ? "btn-primary" : ""}`}
          onClick={onContinue}
          disabled={!passed && !unlocked}
          style={{ padding: "12px 24px", opacity: (!passed && !unlocked) ? 0.45 : 1, cursor: (!passed && !unlocked) ? "not-allowed" : "pointer" }}>
          {passed
            ? <><Icon name="arrow-right" size={14} /> {lang === "en" ? "Continue to next lesson" : "Keyingi darsga o'tish"}</>
            : unlocked
              ? <><Icon name="play" size={14} /> {lang === "en" ? "Retry with new questions" : "Yangi savollar bilan qayta urinish"}</>
              : <><Icon name="lock" size={14} /> {lang === "en" ? `Locked — ${mm}:${ss} remaining` : `Bloklangan — ${mm}:${ss} qoldi`}</>}
        </button>
      </div>
    </div>
  );
}

function ResultCard({ idx, q, a, r }) {
  const lang = useLang();
  const [expanded, setExpanded] = useQS(false);
  const c = r.score >= 70 ? "var(--accent)" : r.score >= 50 ? "var(--c-warn)" : "var(--c-attack)";
  return (
    <div style={{
      background: "var(--bg-2)", border: `1px solid ${c}33`,
      borderRadius: 12, borderLeft: `3px solid ${c}`,
      padding: "14px 18px",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
        onClick={() => setExpanded(!expanded)}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1 }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: `${c}12`, border: `1.5px solid ${c}`,
            color: c, display: "grid", placeItems: "center",
            fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 14,
          }}>{r.score}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="mono" style={{ fontSize: 10, color: c, letterSpacing: 0.1 }}>
              Q{idx + 1} · {r.passed ? "PASSED" : "BELOW_THRESHOLD"}
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: expanded ? "normal" : "nowrap" }}>
              {lang === "en" ? q.en : q.uz}
            </div>
          </div>
        </div>
        <Icon name={expanded ? "chevron-down" : "chevron-right"} size={16} style={{ color: "var(--text-3)" }} />
      </div>

      {expanded && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--accent)", fontSize: 9.5 }}>
                // {lang === "en" ? "STRENGTHS" : "KUCHLI TOMONLAR"}
              </div>
              {r.strengths?.length ? (
                <ul style={{ margin: "6px 0 0", paddingLeft: 18, fontSize: 12, color: "var(--text-1)", lineHeight: 1.55 }}>
                  {r.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              ) : <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 6 }}>—</div>}
            </div>
            <div>
              <div className="eyebrow" style={{ color: "var(--c-attack)", fontSize: 9.5 }}>
                // {lang === "en" ? "WEAKNESSES" : "ZAIF TOMONLAR"}
              </div>
              {r.weaknesses?.length ? (
                <ul style={{ margin: "6px 0 0", paddingLeft: 18, fontSize: 12, color: "var(--text-1)", lineHeight: 1.55 }}>
                  {r.weaknesses.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              ) : <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 6 }}>—</div>}
            </div>
          </div>
          {r.feedback && (
            <div style={{ marginTop: 12, padding: 12, background: "var(--bg-3)", borderRadius: 8, fontSize: 12.5, color: "var(--text-1)", lineHeight: 1.55, fontStyle: "italic" }}>
              <span style={{ color: c, fontWeight: 600, fontStyle: "normal" }}>AI:</span> {r.feedback}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

window.QuizModal = QuizModal;
