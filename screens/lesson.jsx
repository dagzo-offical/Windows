// lesson.jsx — Lesson L01: Windows arxitekturasi / Windows Architecture
// Sections: Big picture → Theory → Layered diagram → Boot → Syscall flow → Security view → Lab → Compare → Summary

const { useState: useLS, useEffect: useLE, useRef: useLR } = React;

const LESSON = {
  num: "L01", section: "01",
  uz: "Windows arxitekturasi",
  en: "Windows Architecture",
  subUz: "Operatsion tizim ichida nima sodir bo'lmoqda",
  subEn: "What's actually happening inside the operating system",
};

const LESSONS = {
  1:  { num: "L01", section: "01", uz: "Windows arxitekturasi",        en: "Windows Architecture",
        subUz: "Katta rasm, nazariy asos, qatlamli arxitektura",           subEn: "Big picture, theory, layered architecture" },
  2:  { num: "L02", section: "01", uz: "Kernel nima?",                  en: "What is the Kernel?",
        subUz: "ntoskrnl.exe, Executive, Microkernel, HAL va drayverlar",   subEn: "ntoskrnl.exe, Executive, Microkernel, HAL and drivers" },
  3:  { num: "L03", section: "01", uz: "User mode va Kernel mode",      en: "User Mode vs Kernel Mode",
        subUz: "CPU privilege halqalari va chegara nima uchun muhim",        subEn: "CPU privilege rings and why the boundary matters" },
  4:  { num: "L04", section: "01", uz: "Windows boot jarayoni",         en: "Windows Boot Process",
        subUz: "UEFI'dan login ekraniga: har bir bosqich va xavfsizlik",     subEn: "UEFI to login: every step and its security implications" },
  5:  { num: "L05", section: "01", uz: "BIOS vs UEFI",                  en: "BIOS vs UEFI",                subUz: "Tez kunda", subEn: "Coming soon" },
  6:  { num: "L06", section: "01", uz: "Secure Boot",                   en: "Secure Boot",                 subUz: "Tez kunda", subEn: "Coming soon" },
  7:  { num: "L07", section: "01", uz: "TPM",                           en: "TPM",                         subUz: "Tez kunda", subEn: "Coming soon" },
  8:  { num: "L08", section: "01", uz: "Registry",                      en: "Windows Registry",            subUz: "Tez kunda", subEn: "Coming soon" },
  9:  { num: "L09", section: "01", uz: "Fayl tizimlari",                en: "File Systems",                subUz: "Tez kunda", subEn: "Coming soon" },
  10: { num: "L10", section: "01", uz: "NTFS",                          en: "NTFS",                        subUz: "Tez kunda", subEn: "Coming soon" },
  11: { num: "L11", section: "01", uz: "FAT32",                         en: "FAT32",                       subUz: "Tez kunda", subEn: "Coming soon" },
  12: { num: "L12", section: "01", uz: "Jarayonlar (Processes)",        en: "Processes",                   subUz: "Tez kunda", subEn: "Coming soon" },
  13: { num: "L13", section: "01", uz: "Thread'lar",                    en: "Threads",                     subUz: "Tez kunda", subEn: "Coming soon" },
  14: { num: "L14", section: "01", uz: "Handle'lar",                    en: "Handles",                     subUz: "Tez kunda", subEn: "Coming soon" },
  15: { num: "L15", section: "01", uz: "Servislar",                     en: "Services",                    subUz: "Tez kunda", subEn: "Coming soon" },
  16: { num: "L16", section: "01", uz: "DLL",                           en: "DLL",                         subUz: "Tez kunda", subEn: "Coming soon" },
  17: { num: "L17", section: "01", uz: "Windows API",                   en: "Windows API",                 subUz: "Tez kunda", subEn: "Coming soon" },
  18: { num: "L18", section: "01", uz: "Event Viewer",                  en: "Event Viewer",                subUz: "Tez kunda", subEn: "Coming soon" },
  19: { num: "L19", section: "01", uz: "Task Scheduler",                en: "Task Scheduler",              subUz: "Tez kunda", subEn: "Coming soon" },
  20: { num: "L20", section: "01", uz: "Windows log fayllari",          en: "Windows Logs",                subUz: "Tez kunda", subEn: "Coming soon" },
};

// ─────────────────────────────────────────────────────────────
function LessonScreen({ setRoute, user, markLessonComplete, onOpenProfile, lessonNum = 1 }) {
  const lang = useLang();
  const [progress, setProgress] = useLS(0);
  const [quizOpen, setQuizOpen] = useLS(false);
  const LESSON = LESSONS[lessonNum] || { num: `L${String(lessonNum).padStart(2,"0")}`, section: "01", uz: "Dars", en: "Lesson", subUz: "Tez kunda", subEn: "Coming soon" };
  const lessonKey = `s01_l${String(lessonNum).padStart(2,"0")}`;
  const hasContent = true; // TEMP: all unlocked for review

  useLE(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = Math.min(100, Math.max(0, (window.scrollY / max) * 100));
      setProgress(Math.round(p));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div>
      <TopNav route={{ name: "lesson" }} setRoute={setRoute} user={user} onOpenProfile={onOpenProfile}
        crumb={[
          { label: lang === "en" ? "Courses" : "Kurslar", onClick: () => setRoute({ name: "dashboard" }) },
          { label: lang === "en" ? "Sec 01" : "01-bo'lim", onClick: () => setRoute({ name: "section", section: 1 }) },
          { label: `${LESSON.num}: ${lang === "en" ? LESSON.en : LESSON.uz}` },
        ]} />

      {/* Reading progress */}
      <div style={{ position: "sticky", top: 60, height: 3, background: "rgba(255,255,255,0.04)", zIndex: 50 }}>
        <div style={{
          height: "100%", width: `${progress}%`,
          background: "linear-gradient(90deg, var(--accent), var(--accent-2))",
          boxShadow: "0 0 8px var(--accent-glow)",
          transition: "width 200ms",
        }} />
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div className="page" style={{ padding: "32px 28px 80px" }}>
          <LessonHero lesson={LESSON} lessonNum={lessonNum} />
          {lessonNum === 1 ? <>
            <Section1Bigpicture />
            <Section2Theory />
            <Section3Layered />
          </> : lessonNum === 2 ? <>
            <SectionKernelWhat />
            <SectionKernelInside />
            <SectionKernelDrivers />
          </> : lessonNum === 3 ? <>
            <SectionRings />
            <Section8Comparison />
            <SectionSyscallBrief />
          </> : lessonNum === 4 ? <>
            <Section4Boot />
          </> : lessonNum === 5 ? <>
            <SectionBiosUefi />
          </> : <ComingSoon lesson={LESSON} lessonNum={lessonNum} setRoute={setRoute} />}

          {hasContent && <LessonNextNav lessonNum={lessonNum} setRoute={setRoute} onQuizStart={() => setQuizOpen(true)} />}
        </div>
      </div>

      {quizOpen && <QuizModal
        lessonNum={lessonNum}
        onClose={() => setQuizOpen(false)}
        onPass={() => {
          setQuizOpen(false);
          if (markLessonComplete) markLessonComplete(lessonKey);
          setRoute({ name: "section", section: 1 });
        }}
        onFail={() => { setQuizOpen(false); setRoute({ name: "cooldown" }); }}
      />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function LessonTOC({ lessonNum = 1 }) {
  const lang = useLang();
  const sections = lessonNum === 1 ? [
    { id: "big-picture", uz: "Katta rasm", en: "Big picture" },
    { id: "theory", uz: "Nazariy asos", en: "Theory" },
    { id: "layered", uz: "Qatlamli arxitektura", en: "Layered architecture" },
  ] : [
    { id: "boot", uz: "Boot jarayoni", en: "Boot process" },
    { id: "syscall", uz: "Syscall oqimi", en: "Syscall flow" },
    { id: "security", uz: "Xavfsizlik nuqtai nazaridan", en: "Security view" },
    { id: "lab", uz: "Laboratoriya", en: "Lab" },
    { id: "compare", uz: "Taqqoslash", en: "Comparison" },
    { id: "summary", uz: "Xulosa", en: "Summary" },
  ];
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
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <aside style={{
      position: "sticky", top: 80, alignSelf: "start",
      padding: "32px 18px 32px 28px",
      height: "calc(100vh - 80px)",
      overflowY: "auto",
    }}>
      <div className="eyebrow" style={{ marginBottom: 12 }}>// {lang === "en" ? "CONTENTS" : "MUNDARIJA"}</div>
      <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 4 }}>
        {sections.map((s, i) => (
          <li key={s.id}>
            <a href={`#${s.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
              style={{
                display: "flex", gap: 10, padding: "8px 10px", borderRadius: 7,
                fontSize: 12.5, textDecoration: "none",
                color: active === s.id ? "var(--accent)" : "var(--text-2)",
                background: active === s.id ? "var(--accent-soft)" : "transparent",
                borderLeft: `2px solid ${active === s.id ? "var(--accent)" : "transparent"}`,
                transition: "all 200ms",
              }}>
              <span className="mono" style={{ opacity: 0.5, fontSize: 10, width: 18 }}>{String(i + 1).padStart(2, "0")}</span>
              <span>{lang === "en" ? s.en : s.uz}</span>
            </a>
          </li>
        ))}
      </ol>

      <div style={{ marginTop: 24, padding: 14, borderRadius: 10, background: "var(--surface)", border: "1px solid var(--border)" }}>
        <div className="eyebrow" style={{ fontSize: 9.5, marginBottom: 8 }}>// {lang === "en" ? "LESSON STATS" : "STATISTIKA"}</div>
        <div style={{ fontSize: 11, color: "var(--text-2)", display: "flex", flexDirection: "column", gap: 4 }}>
          <Row k={lang === "en" ? "Reading" : "O'qish"} v="~24 min" />
          <Row k={lang === "en" ? "Lab" : "Laboratoriya"} v="~12 min" />
          <Row k={lang === "en" ? "Diagrams" : "Diagrammalar"} v="9" />
          <Row k={lang === "en" ? "Words" : "So'zlar"} v="3,420" />
        </div>
      </div>
    </aside>
  );
}
function Row({ k, v }) {
  return <div style={{ display: "flex", justifyContent: "space-between" }}><span>{k}</span><span className="mono">{v}</span></div>;
}

const LESSON_META = {
  1: { min: 36, diagrams: 9, labs: 3,
       introUz: <>Windows tizimining to'liq arxitekturasi — hardware'dan boshlab, <em>user mode va kernel mode</em>, executive qatlam, microkernel, HAL, va bir sichqoncha bosishi shu qatlamlarning har biridan qanday o'tishini ko'ramiz.</>,
       introEn: <>The complete Windows architecture from the silicon up — <em>user mode vs kernel mode</em>, the executive layer, microkernel, HAL, and how a single mouse click cascades through every one of them.</> },
  2: { min: 28, diagrams: 6, labs: 1,
       introUz: <><em>Kernel</em> — operatsion tizimning yuragi. Bu darsda <em>ntoskrnl.exe</em> ichida nima borligini, Executive va Microkernel farqini, HAL nima ekanini va drayverlar nima uchun xavfli ekanini o'rganasiz.</>,
       introEn: <>The <em>kernel</em> is the heart of the OS. You'll learn what lives inside <em>ntoskrnl.exe</em>, the difference between the Executive and Microkernel, what the HAL does, and why drivers are a serious security risk.</> },
  3: { min: 32, diagrams: 5, labs: 1,
       introUz: <>CPU <em>privilege halqalari</em> nima, ring 3 va ring 0 farqi, bu chegara nima uchun mavjud, har bir rejimda xato qilsangiz nima bo'ladi — va kernel mode'ga qanday qonuniy o'tish mumkin.</>,
       introEn: <>What CPU <em>privilege rings</em> are, the difference between ring 3 and ring 0, why this boundary exists, what happens when code crashes in each mode — and how to legally cross into kernel mode.</> },
  4: { min: 36, diagrams: 8, labs: 2,
       introUz: <>UEFI'dan login ekraniga qadar Windows qanday ishga tushishini har bir bosqichda ko'rasiz: POST, Secure Boot, <em>bootmgr → winload → ntoskrnl → LSASS</em> — va har bir bosqich xavfsizlik uchun nimani anglatadi.</>,
       introEn: <>Walk through every step of the Windows boot — POST, Secure Boot, <em>bootmgr → winload → ntoskrnl → LSASS</em> — and understand what each stage means for security.</> },
  5: { min: 32, diagrams: 7, labs: 2,
       introUz: <><em>BIOS</em> va <em>UEFI</em> — kompyuter yoqilganda birinchi ishga tushadigan dasturiy ta'minot. Bu darsda ikkalasining arxitekturasini, MBR va GPT farqini, Secure Boot qanday ishlashini va firmwarelar qanday qilib hujum yuzasiga aylanishini ko'rasiz.</>,
       introEn: <><em>BIOS</em> and <em>UEFI</em> are the first software that runs when you power on. This lesson covers both architectures, MBR vs GPT, how Secure Boot works, and how firmware became a critical attack surface.</> },
};

// ─────────────────────────────────────────────────────────────
function LessonHero({ lesson, lessonNum = 1 }) {
  const lang = useLang();
  const meta = LESSON_META[lessonNum] || LESSON_META[1];
  return (
    <header style={{ marginBottom: 40 }}>
      <div className="eyebrow" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <LiveDot />
        <span>{lang === "en" ? `SECTION ${lesson.section} · LESSON ${lesson.num} · IN PROGRESS` : `${lesson.section}-BO'LIM · DARS ${lesson.num} · DAVOM ETMOQDA`}</span>
      </div>
      <h1 className="display" style={{ fontSize: "clamp(36px, 4.4vw, 56px)", margin: 0, letterSpacing: "-0.025em", lineHeight: 1.05 }}>
        {lang === "en" ? lesson.en : lesson.uz}
      </h1>
      <div style={{ color: "var(--text-2)", fontSize: 17, marginTop: 8 }}>{lang === "en" ? lesson.subEn : lesson.subUz}</div>

      <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 24, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 10 }}>
          <span className="chip"><Icon name="clock" size={11} /> {meta.min} min</span>
          <span className="chip chip-blue"><Icon name="graph" size={11} /> {lang === "en" ? `${meta.diagrams} diagrams` : `${meta.diagrams} diagramma`}</span>
          <span className="chip chip-purple"><Icon name="terminal" size={11} /> {lang === "en" ? `${meta.labs} lab${meta.labs > 1 ? "s" : ""}` : `${meta.labs} lab`}</span>
          <span className="chip chip-yellow"><Icon name="warning" size={11} /> {lang === "en" ? "foundational" : "asosiy"}</span>
        </div>
        <div style={{ flex: 1 }} />
        <div className="mono" style={{ fontSize: 11, color: "var(--text-2)" }}>
          {lang === "en" ? "Updated" : "Yangilandi"} 2026.05.10 · Dagzo
        </div>
      </div>

      <div style={{ marginTop: 24, padding: 18, background: "rgba(0, 212, 255, 0.05)", border: "1px solid rgba(0, 212, 255, 0.25)", borderRadius: 10, display: "flex", gap: 14, alignItems: "flex-start" }}>
        <span style={{ color: "var(--c-system)", flexShrink: 0, marginTop: 2 }}><Icon name="info" size={16} /></span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--c-system)" }}>
            {lang === "en" ? "What you'll learn in this lesson" : "Bu darsda nima o'rganasiz"}
          </div>
          <div style={{ fontSize: 13, color: "var(--text-1)", marginTop: 4, lineHeight: 1.55 }}>
            {lang === "en" ? meta.introEn : meta.introUz}
          </div>
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────
function Section1Bigpicture() {
  const lang = useLang();
  return (
    <section id="big-picture" style={{ scrollMarginTop: 80, marginBottom: 56 }}>
      <H2 num="01" uz="Operatsion tizim nima?" en="What is an operating system?" />

      <P>
        {lang === "en"
          ? <>An <Term>operating system</Term> is the software layer that mediates every interaction between applications and hardware. Without it, every application would need its own disk driver, its own network stack, its own memory allocator — impossible at modern scale. The OS gives every program the illusion of exclusive, safe access to all machine resources, enforces who can read whose files, and prevents one crashed program from taking down the rest.</>
          : <>«<Term>Operatsion tizim</Term>» — ilovalar va hardware o'rtasidagi har bir muloqotni boshqaradigan dasturiy qatlam. Usiz, har bir ilova o'z disk drayveri, o'z tarmoq steki, o'z xotira ajratuvchisiga ega bo'lishi kerak edi — zamonaviy ko'lamda bu imkonsiz. OS har bir dasturga barcha mashinaning resurslariga eksklyuziv, xavfsiz kirishning illüzyonini beradi, kim kimning fayllarini o'qiy olishini nazorat qiladi va bitta nosoz dasturning qolganlarini ishdan chiqarishiga yo'l qo'ymaydi.</>}
      </P>
      <P>
        {lang === "en"
          ? <>Windows is a <Term>hybrid kernel</Term> OS — it combines a small microkernel responsible for the lowest-level CPU mechanics (scheduling, interrupts, synchronisation) with a richer <Em>Executive</Em> layer that implements file systems, networking, security, and memory management inside kernel mode. This is different from Linux (monolithic kernel, where drivers compile into the kernel image) and macOS (Mach microkernel + BSD subsystem layered on top).</>
          : <>Windows — bu <Term>gibrid yadro</Term> operatsion tizimi: u eng past darajadagi CPU mexanikasi (rejalashtirish, uzilishlar, sinxronizatsiya) uchun mas'ul kichik microkernel'ni va fayl tizimlari, tarmoq, xavfsizlik hamda xotira boshqaruvini kernel mode'da amalga oshiradigan boy <Em>Executive</Em> qatlamini birlashtiradi. Bu Linux'dan (monolitik yadro, drayverlar yadro tasviriga kompilyatsiya qilinadi) va macOS'dan (Mach microkernel + uning ustidagi BSD quyi tizimi) farq qiladi.</>}
      </P>

      <Callout color="var(--c-system)" icon="info" titleUz="Tarixiy eslatma — Dave Cutler va VMS" titleEn="Historical note — Dave Cutler and VMS">
        {lang === "en"
          ? <>Windows NT kernel was designed by <strong>Dave Cutler</strong>, who had previously led the VAX/VMS project at DEC (Digital Equipment Corporation). He brought VMS's design philosophy to Windows NT: strictly separate user mode from kernel mode, give each process a private address space, and never trust user input in privileged code. Windows NT 3.1 shipped in August 1993 — it ran on as little as 8 MB of RAM. The architecture he designed has not fundamentally changed since then: Windows 11 still uses the same ring-based privilege model, the same Executive managers, and the same syscall dispatch table design from 1993.</>
          : <>Windows NT yadrosi <strong>Dave Cutler</strong> tomonidan loyihalashtirilgan — u DEC (Digital Equipment Corporation) kompaniyasida VAX/VMS loyihasini boshqargan. U VMS'ning dizayn falsafasini Windows NT ga olib keldi: user mode'ni kernel mode'dan qat'iy ajratish, har bir jarayonga shaxsiy manzil maydoni berish va hech qachon imtiyozli kodda foydalanuvchi ma'lumotiga ishonmaslik. Windows NT 3.1 1993 yil avgustda chiqdi — u 8 MB RAM da ishladi. U loyihalagan arxitektura o'shandan beri asosan o'zgarmagan: Windows 11 hali ham 1993 yildan o'sha ring-asosidagi imtiyoz modelini, xuddi o'sha Executive menejerlarini va syscall dispatch jadval dizaynini ishlatadi.</>}
      </Callout>

      <h3 style={subhead}>{lang === "en" ? "1.1 — The 4 fundamental jobs of any OS" : "1.1 — Har qanday OS'ning 4 ta asosiy vazifasi"}</h3>
      <P>
        {lang === "en"
          ? <>Every OS — Windows, Linux, macOS — performs the same four core jobs. Understanding these jobs explains <Em>why</Em> certain OS behaviours exist: why Chrome can crash but not take down Windows? Why can Notepad not read another process's memory? Why does a buggy driver cause a BSOD? All four answers point back to these fundamentals.</>
          : <>Har qanday OS — Windows, Linux, macOS — bir xil to'rtta asosiy vazifani bajaradi. Bu vazifalarni tushunish <Em>nima uchun</Em> ba'zi OS xatti-harakatlarining sababini tushuntiradi: nima uchun Chrome qulab tushib, Windows'ni o'chirmaydi? Nima uchun Notepad boshqa jarayonning xotirasini o'qiy olmaydi? Nima uchun nosoz drayver BSOD chiqaradi? Barcha to'rt javob shu asoslarga qaytadi.</>}
      </P>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
        {[
          {
            icon: "users", n: "1", color: "var(--c-user)",
            uz: "Foydalanuvchini ajratish — Process Isolation",
            en: "User isolation — Process Isolation",
            bodyUz: <>Har bir jarayon (process) o'ziga xos, boshqalarga ko'rinmaydigan xotira maydoniga ega. Chrome xato qilsa, Notepad budan hech qachon xabardor bo'lmaydi. Texnik asos — <Term>virtual manzil maydoni (Virtual Address Space)</Term>. 64-bit Windows'da har bir jarayon nazariy jihatdan 128 TB xotira maydoniga ega — lekin bu maydon faqat o'z jarayoni doirasida mavjud, fizik RAM protsessor tomonidan xaritalanadi.<br /><br />Agar bir jarayon boshqasining xotirasini o'qishga harakat qilsa, protsessor darhol <code>#GP (General Protection Fault)</code> istisnosi ko'taradi va OS jarayonni <code>0xC0000005 ACCESS_VIOLATION</code> bilan o'chiradi. Bu nima uchun muhim? Chunki bank dasturi va oddiy o'yin bir xil kompyuterda ishlasa ham, o'yin bank dasturining xotirasidagi parollarni hech qachon o'qiy olmaydi.</>,
            bodyEn: <>Each process has its own private virtual address space, invisible to all others. When Chrome crashes, Notepad never knows. The technical foundation is the <Term>Virtual Address Space</Term>. On 64-bit Windows, each process theoretically has 128 TB of address space — but this space only exists within its own context, mapped from physical RAM by the CPU.<br /><br />If one process tries to read another's memory, the CPU immediately raises a <code>#GP (General Protection Fault)</code> exception and the OS kills the offending process with <code>0xC0000005 ACCESS_VIOLATION</code>. Why does this matter? Because a banking app and a game can run on the same machine, and the game can never read passwords from the bank app's memory.</>,
          },
          {
            icon: "cpu", n: "2", color: "var(--c-system)",
            uz: "Apparatni abstrakt qilish — Hardware Abstraction",
            en: "Hardware abstraction",
            bodyUz: <>Dunyoda minglab xil disk, tarmoq kartasi va GPU mavjud. Agar har bir dastur har bir hardware modeli bilan alohida ishlashni o'rganishi kerak bo'lsa, dastur yozish imkonsiz bo'lardi. OS bu muammoni <Term>drayverlar</Term> orqali hal qiladi: hardware ishlab chiqaruvchisi qurilmasi uchun drayver yozadi, drayver kernelga standart interfeys taqdim etadi, ilova faqat bitta standart API'ni chaqiradi — diskni kim ishlab chiqarishini bilmaydi.<br /><br /><Em>HAL (Hardware Abstraction Layer)</Em> — yana bir abstraksiya qatlami, bu safar protsessor arxitekturasi uchun: bir xil <code>ntoskrnl.exe</code> fayli Intel, AMD va ARM chiplarida qayta kompilyatsiyasiz ishlaydi, chunki HAL har bir protsessor platformasining o'ziga xos xususiyatlarini yashiradi (taymer, uzilish kontrolleri, DMA).</>,
            bodyEn: <>There are thousands of different disk, network and GPU models. If every program had to learn each hardware model individually, writing software would be impossible. The OS solves this with <Term>drivers</Term>: the hardware manufacturer writes a driver for their device, the driver presents a standard interface to the kernel, and the application calls one standard API — it never knows whose disk it is reading.<br /><br /><Em>HAL (Hardware Abstraction Layer)</Em> is another abstraction layer, this time for the CPU architecture itself: the same <code>ntoskrnl.exe</code> binary runs on Intel, AMD and ARM chips without recompilation, because HAL hides each platform's specific details (timer, interrupt controller, DMA).</>,
          },
          {
            icon: "layers", n: "3", color: "var(--c-warn)",
            uz: "Resurslarni boshqarish — Resource Management",
            en: "Resource management",
            bodyUz: <>CPU'ning faqat bir nechta yadrosi bor, lekin yuzlab jarayonlar ishlashi kerak. RAM cheklangan, lekin minglab ilova xotira talab qiladi. Disk I/O sekin, lekin barcha dasturlar bir vaqtda yozish va o'qishni xohlaydi. OS resurslarni adolatli taqsimlaydi va hech bir jarayon monopoliya qila olmasligi uchun kafolat beradi.<br /><br />Windows <Term>scheduler</Term> (rejalashtiruvchi) — CPU vaqtini <Em>15.6 ms</Em> lik kvantlarga bo'lib, prioritet (0–31) bo'yicha jarayonlar o'rtasida taqsimlaydi. Prioritet 31 — eng yuqori (real-time rejim, faqat maxsus tizim uchun). Prioritet 0 — eng past (faqat <code>Zero Page</code> thread uchun saqlab qo'yilgan). Oddiy foydalanuvchi ilovasi odatda 8-prioritetda ishlaydi. RAM etishmasa, <Term>Memory Manager</Term> eski sahifalarni diskdagi <code>pagefile.sys</code> ga ko'chiradi va xotirani bo'shatadi.</>,
            bodyEn: <>The CPU has only a few cores, but hundreds of processes need to run. RAM is finite, but thousands of apps demand memory. Disk I/O is slow, but all programs want to write and read simultaneously. The OS distributes resources fairly and guarantees no single process can monopolise them.<br /><br />The Windows <Term>scheduler</Term> divides CPU time into <Em>15.6 ms</Em> quanta, distributed among processes by priority (0–31). Priority 31 is the highest (real-time mode, reserved for special system use). Priority 0 is the lowest (reserved only for the <code>Zero Page</code> thread). A normal user application typically runs at priority 8. If RAM runs low, the <Term>Memory Manager</Term> moves old pages to <code>pagefile.sys</code> on disk and frees the memory.</>,
          },
          {
            icon: "shield", n: "4", color: "var(--c-attack)",
            uz: "Xavfsizlikni ta'minlash — Security Enforcement",
            en: "Enforce security",
            bodyUz: <>Kim qaysi faylni, jarayonni yoki registr kalitini ochishi mumkin? Bu qarorni OS <Term>Security Reference Monitor (SRM)</Term> orqali qabul qiladi. Har safar fayl, jarayon yoki registr kaliti ochilganda, SRM ikkita narsani solishtiradi: arizachining <Em>Access Token</Em>'ini (kimligini tasdiqlash — foydalanuvchi SID, guruh SID'lar, imtiyozlar ro'yxati) va ob'ektning <Em>ACL (Access Control List)</Em>'ini (kim nimani qila olishini belgilovchi yozuvlar ro'yxati). Agar token'dagi SID ACL'dagi yozuvga mos kelmasa — <code>ERROR_ACCESS_DENIED (0x5)</code>.<br /><br />Bu nazariy emas — shuning uchun Administrator cmd.exe boshqacha ruxsatga ega, oddiy foydalanuvchi <code>C:\Windows\System32</code> ga fayl yoza olmaydi va UAC (User Account Control) siz dasturga administrator ruxsatini bermasligi uchun dialog ko'rsatadi.</>,
            bodyEn: <>Who can open which file, process, or registry key? That decision belongs to the OS — via the <Term>Security Reference Monitor (SRM)</Term>. Every time a file, process, or registry key is opened, the SRM compares two things: the caller's <Em>Access Token</Em> (who they are — user SID, group SIDs, privilege list) against the object's <Em>ACL (Access Control List)</Em> (a list of entries defining who may do what). If the token's SID does not match a matching ACE in the ACL — <code>ERROR_ACCESS_DENIED (0x5)</code>.<br /><br />This is not theoretical — it's why Administrator's cmd.exe has different permissions, why a normal user cannot write to <code>C:\Windows\System32</code>, and why UAC shows a dialog before granting admin privileges to a program.</>,
          },
        ].map((b, i) => (
          <div key={i} style={{
            padding: "18px 20px", borderRadius: 12,
            background: `${b.color}08`,
            border: `1px solid ${b.color}30`,
            borderLeft: `3px solid ${b.color}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 9,
                background: `${b.color}18`, border: `1px solid ${b.color}44`,
                color: b.color, display: "grid", placeItems: "center", flexShrink: 0,
              }}><Icon name={b.icon} size={18} /></div>
              <div>
                <div className="mono" style={{ fontSize: 9.5, color: b.color, letterSpacing: 0.1 }}>{lang === "en" ? "JOB" : "VAZIFA"} #{b.n}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700 }}>{lang === "en" ? b.en : b.uz}</div>
              </div>
            </div>
            <div style={{ fontSize: 13.5, lineHeight: 1.75, color: "var(--text-1)" }}>
              {lang === "en" ? b.bodyEn : b.bodyUz}
            </div>
          </div>
        ))}
      </div>

      <h3 style={subhead}>{lang === "en" ? "1.2 — Windows in numbers" : "1.2 — Raqamlarda Windows"}</h3>
      <P>
        {lang === "en"
          ? <>Before going deeper, here are concrete measurements of the Windows codebase. These numbers make the scope of what you're learning tangible — and explain why Windows has both extraordinary capability and extraordinary attack surface.</>
          : <>Chuqurroq kirishdan oldin, Windows kod bazasining aniq o'lchovlari. Bu raqamlar o'rganayotgan narsangizning miqyosini ko'zga ko'rinadigan qilib qo'yadi — va nima uchun Windows g'ayrioddiy imkoniyat va g'ayrioddiy hujum yuzasiga ham ega ekanini tushuntiradi.</>}
      </P>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 12 }}>
        {[
          { val: "~50M",  uz: "kod satrlari (ntoskrnl + drayverlar + subsistemalar)", en: "lines of code (ntoskrnl + drivers + subsystems)" },
          { val: "~10 MB", uz: "ntoskrnl.exe hajmi (x64, Windows 11)", en: "ntoskrnl.exe file size (x64, Windows 11)" },
          { val: "~460",  uz: "syscall raqamlari (SSDT jadvalida)", en: "syscall numbers in the SSDT table" },
          { val: "128 TB", uz: "har bir jarayonning virtual manzil maydoni (x64)", en: "virtual address space per process (x64)" },
          { val: "0–31",  uz: "thread prioritet darajalari (31 — real-time)", en: "thread priority levels (31 = real-time)" },
          { val: "1993",  uz: "Windows NT 3.1 — bu arxitektura boshlanishi", en: "Windows NT 3.1 — when this architecture began" },
        ].map((f, i) => (
          <div key={i} style={{
            padding: "14px 16px", borderRadius: 10,
            background: "var(--bg-2)", border: "1px solid var(--border)",
            textAlign: "center",
          }}>
            <div className="mono" style={{ fontSize: 22, fontWeight: 700, color: "var(--accent)" }}>{f.val}</div>
            <div style={{ fontSize: 11.5, color: "var(--text-2)", marginTop: 4, lineHeight: 1.4 }}>{lang === "en" ? f.en : f.uz}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
function Section2Theory() {
  const lang = useLang();
  return (
    <section id="theory" style={{ scrollMarginTop: 80, marginBottom: 56 }}>
      <H2 num="02" uz="Asosiy tushunchalar" en="Core concepts" />

      {/* ── 2.1 Process & Thread ── */}
      <h3 style={subhead}>{lang === "en" ? "2.1 — Process and Thread" : "2.1 — Jarayon va Thread"}</h3>
      <P>
        {lang === "en"
          ? <>A <Term>process</Term> is a running instance of a program — not the file on disk, but its live execution in memory. Each process gets: its own private virtual address space (no other process can see into it), a <Em>security token</Em> (which identifies who is running it and what privileges it has), a <Em>handle table</Em> (list of OS objects it has opened — files, pipes, events), and one or more threads. Two instances of Notepad are two separate processes — they share the same code on disk, but each has its own independent memory.</>
          : <>«<Term>Jarayon</Term>» (process) — dasturning xotiradagi jonli nusxasi, diskdagi fayl emas. Har bir jarayon quyidagilarga ega: o'z shaxsiy virtual manzil maydoni (boshqa hech bir jarayon unga kira olmaydi), <Em>xavfsizlik tokeni</Em> (uni kim ishlatayotgani va qanday imtiyozlarga ega ekanini aniqlaydigan), <Em>handle jadvali</Em> (u ochgan OS ob'ektlari ro'yxati — fayllar, pipe'lar, eventlar) va bir yoki bir nechta thread'lar. Notepad'ning ikkita nusxasi — ikkita alohida jarayon: ular diskdagi bir xil kodni baham ko'radi, lekin har birining o'z mustaqil xotirasi bor.</>}
      </P>
      <P>
        {lang === "en"
          ? <>A <Term>thread</Term> is the actual unit of CPU execution — the thing the processor runs. Threads share the parent process's address space, meaning all threads in one process can read and write the same memory (this is both efficient and dangerous — it creates race conditions). The CPU can only execute one thread per core at a time. With 4 cores and 400 threads running, the <Em>scheduler</Em> rapidly context-switches between them. A <Em>context switch</Em> saves the current thread's CPU registers (RIP, RSP, RAX–R15, RFLAGS) to its kernel stack, restores the next thread's registers, and resumes execution — all in microseconds.</>
          : <>«<Term>Thread</Term>» — protsessor bajaradigan haqiqiy birlik. Thread'lar ota jarayonning manzil maydonini baham ko'radi, ya'ni bir jarayondagi barcha thread'lar bir xil xotirani o'qiy va yoza oladi (bu ham samarali, ham xavfli — race condition'larni keltirib chiqaradi). CPU bir vaqtda har bir yadroda faqat bitta thread'ni bajara oladi. 4 yadro va 400 ta thread ishlayotgan bo'lsa, <Em>scheduler</Em> ular o'rtasida tezda kontekst almashishni amalga oshiradi. <Em>Kontekst almashish</Em> joriy thread'ning CPU registrlarini (RIP, RSP, RAX–R15, RFLAGS) uning kernel stack'iga saqlaydi, keyingi thread'ning registrlarini tiklaydi va bajarishni davom ettiradi — bularning barchasi mikrosoniyalarda.</>}
      </P>
      <P>
        {lang === "en"
          ? <>Internally the kernel tracks every process via a structure called <Term>EPROCESS</Term> (Executive Process block) stored in non-paged kernel memory. <code>EPROCESS</code> contains the PID, parent PID, creation time, security token pointer, list of threads (as <code>ETHREAD</code> structures), handle table pointer, and the Virtual Address Descriptor (VAD) tree that maps the entire virtual address space. Forensics tools like Process Hacker read these structures directly — which is why they can show processes even if malware has hidden them from Task Manager's normal API calls.</>
          : <>Ichkarida kernel har bir jarayonni sahifasiz kernel xotirasida saqlangan <Term>EPROCESS</Term> (Executive Process bloki) tuzilmasi orqali kuzatib boradi. <code>EPROCESS</code> quyidagilarni o'z ichiga oladi: PID, ota PID, yaratilish vaqti, xavfsizlik tokeni ko'rsatgichi, thread'lar ro'yxati (<code>ETHREAD</code> tuzilmalari sifatida), handle jadval ko'rsatgichi va butun virtual manzil maydonini xaritalovchi Virtual Address Descriptor (VAD) daraxti. Process Hacker kabi sud-tibbiyot tizimlari bu tuzilmalarni to'g'ridan-to'g'ri o'qiydi — shuning uchun malware Task Manager'ning oddiy API chaqiruvlaridan o'zini yashirsa ham, ular jarayonlarni ko'rsata oladi.</>}
      </P>

      <div style={{ margin: "20px 0", padding: "16px 20px", borderRadius: 10, background: "var(--bg-2)", border: "1px solid var(--border)", fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 1.85 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>// EPROCESS — simplified kernel structure (one per running process)</div>
        <div style={{ color: "var(--c-system)" }}>struct <span style={{ color: "var(--accent)" }}>_EPROCESS</span> {"{"}</div>
        <div style={{ paddingLeft: 24, color: "var(--text-1)" }}>
          <div><span style={{ color: "var(--c-warn)" }}>ULONG</span>{"       "}UniqueProcessId;{"            "}<span style={{ color: "var(--text-3)" }}>// PID e.g. 1234</span></div>
          <div><span style={{ color: "var(--c-warn)" }}>ULONG</span>{"       "}InheritedFromUniqueProcessId; <span style={{ color: "var(--text-3)" }}>// Parent PID</span></div>
          <div><span style={{ color: "var(--c-warn)" }}>EX_FAST_REF</span>{" "}Token;{"                    "}<span style={{ color: "var(--text-3)" }}>// Security token (SID, privileges)</span></div>
          <div><span style={{ color: "var(--c-warn)" }}>LIST_ENTRY</span>{"  "}ThreadListHead;{"            "}<span style={{ color: "var(--text-3)" }}>// Linked list of all ETHREADs</span></div>
          <div><span style={{ color: "var(--c-warn)" }}>PVOID</span>{"       "}ObjectTable;{"               "}<span style={{ color: "var(--text-3)" }}>// Handle table pointer</span></div>
          <div><span style={{ color: "var(--c-warn)" }}>PVOID</span>{"       "}VadRoot;{"                   "}<span style={{ color: "var(--text-3)" }}>// VAD tree (virtual memory map)</span></div>
          <div><span style={{ color: "var(--c-warn)" }}>LARGE_INTEGER</span>{" "}CreateTime;{"              "}<span style={{ color: "var(--text-3)" }}>// When was it spawned?</span></div>
          <div><span style={{ color: "var(--c-warn)" }}>UCHAR</span>{"[15]    "}ImageFileName;{"            "}<span style={{ color: "var(--text-3)" }}>// First 15 chars of exe name</span></div>
        </div>
        <div style={{ color: "var(--c-system)" }}>{"}"}</div>
      </div>

      {/* ── 2.2 User mode vs Kernel mode ── */}
      <h3 style={subhead}>{lang === "en" ? "2.2 — User mode vs Kernel mode" : "2.2 — User mode va Kernel mode"}</h3>
      <P>
        {lang === "en"
          ? <>The x86-64 CPU architecture defines <Em>four privilege rings</Em>: ring 0 (most privileged) through ring 3 (least privileged). Windows uses only two: <Em>ring 0</Em> (kernel mode) for the OS, and <Em>ring 3</Em> (user mode) for every application. Rings 1 and 2 were designed for OS subsystems and device drivers in older systems (like OS/2); Windows NT deliberately skips them — all drivers run at full ring 0 privilege.</>
          : <>x86-64 CPU arxitekturasi <Em>to'rtta imtiyoz halqasini</Em> belgilaydi: ring 0 (eng imtiyozli) dan ring 3 (eng kam imtiyozli) gacha. Windows faqat ikkitasini ishlatadi: <Em>ring 0</Em> (kernel mode) — OS uchun, va <Em>ring 3</Em> (user mode) — har bir ilova uchun. Ring 1 va ring 2 eski tizimlarda (OS/2 kabi) OS quyi tizimlari va drayverlar uchun mo'ljallangan; Windows NT ularni ataylab o'tkazib yuboradi — barcha drayverlar to'liq ring 0 imtiyozi bilan ishlaydi.</>}
      </P>
      <P>
        {lang === "en"
          ? <>The CPU knows which ring it is in through two bits (bits 0–1) of the <code>CS</code> (Code Segment) register — called the <Em>CPL (Current Privilege Level)</Em>. When <code>CS = 0x0008</code>, bits 0–1 are both 0 → CPL = 0 (kernel). When <code>CS = 0x0033</code>, bits 0–1 are both 1 → CPL = 3 (user). The hardware checks CPL on <Em>every single instruction</Em>. If ring 3 code tries to run a privileged instruction (like <code>HLT</code> to stop the CPU or <code>MOV CR0</code> to change paging), the CPU immediately raises a <Em>#GP (General Protection Fault)</Em> — exception number 13 — and Windows terminates the program with <code>0xC0000005 ACCESS_VIOLATION</code>. The crash never reaches any other process.</>
          : <>Protsessor <code>CS</code> (Code Segment) registrining ikki biti (0–1 bitlar) orqali qaysi ringda ekanini biladi — bu <Em>CPL (Current Privilege Level)</Em> deb ataladi. <code>CS = 0x0008</code> bo'lsa, 0–1 bitlar har ikkalasi 0 → CPL = 0 (kernel). <code>CS = 0x0033</code> bo'lsa, 0–1 bitlar har ikkalasi 1 → CPL = 3 (user). Hardware CPL ni <Em>har bir buyruq</Em> uchun tekshiradi. Agar ring 3 kod imtiyozli buyruqni (<code>HLT</code> — protsessorni to'xtatish yoki <code>MOV CR0</code> — sahifalashni o'zgartirish kabi) bajarishga harakat qilsa, protsessor darhol <Em>#GP (General Protection Fault)</Em> — 13-raqamli istisno — ko'taradi va Windows dasturni <code>0xC0000005 ACCESS_VIOLATION</code> bilan o'chiradi. Crash boshqa hech bir jarayonga yetmaydi.</>}
      </P>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
        <div style={{ padding: "14px 16px", borderRadius: 10, background: "rgba(255,145,69,0.06)", border: "1px solid rgba(255,145,69,0.28)" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "var(--c-user)", marginBottom: 10 }}>
            {lang === "en" ? "Ring 3 (user mode) — CAN do:" : "Ring 3 (user mode) — QILA OLADI:"}
          </div>
          {(lang === "en" ? [
            "Normal arithmetic, logic, string operations",
            "Read/write its own process memory (within its VAD)",
            "Call Win32 API (kernel32.dll, user32.dll, gdi32.dll)",
            "Allocate virtual memory via VirtualAlloc()",
            "Create threads, open files, sockets via handles",
            "Cross into ring 0 only via the syscall instruction",
          ] : [
            "Oddiy arifmetik, mantiqiy, satr operatsiyalari",
            "O'z jarayon xotirasini o'qish/yozish (VAD ichida)",
            "Win32 API chaqirish (kernel32.dll, user32.dll, gdi32.dll)",
            "VirtualAlloc() orqali virtual xotira ajratish",
            "Thread yaratish, handle orqali fayl va socket ochish",
            "Ring 0 ga faqat syscall buyrug'i orqali o'tish",
          ]).map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5, fontSize: 12.5, color: "var(--text-1)" }}>
              <span style={{ color: "var(--c-user)", flexShrink: 0 }}>✓</span>{item}
            </div>
          ))}
        </div>
        <div style={{ padding: "14px 16px", borderRadius: 10, background: "rgba(255,58,94,0.06)", border: "1px solid rgba(255,58,94,0.28)" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "var(--c-attack)", marginBottom: 10 }}>
            {lang === "en" ? "Ring 3 — CANNOT do (triggers #GP fault):" : "Ring 3 — QILA OLMAYDI (#GP xato):"}
          </div>
          {(lang === "en" ? [
            "HLT — halt the CPU",
            "LGDT / LIDT — load Global/Interrupt Descriptor Tables",
            "MOV CR0–CR4 — modify control registers (paging, protection)",
            "WRMSR / RDMSR — write/read model-specific registers",
            "IN / OUT — directly access hardware I/O ports",
            "CLI / STI — disable / re-enable hardware interrupts",
          ] : [
            "HLT — protsessorni to'xtatish",
            "LGDT / LIDT — Global/Interrupt Descriptor Jadvallarini yuklash",
            "MOV CR0–CR4 — boshqaruv registrlarini o'zgartirish (sahifalash, himoya)",
            "WRMSR / RDMSR — model-specific registrlarni yozish/o'qish",
            "IN / OUT — hardware I/O portlarini to'g'ridan-to'g'ri o'qish/yozish",
            "CLI / STI — hardware uzilishlarini o'chirish / qayta yoqish",
          ]).map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5, fontSize: 12.5, color: "var(--text-1)" }}>
              <span style={{ color: "var(--c-attack)", flexShrink: 0 }}>✗</span>{item}
            </div>
          ))}
        </div>
      </div>

      <Callout color="var(--c-attack)" icon="skull" titleUz="Kernel mode xatosi = BSOD" titleEn="Kernel mode crash = BSOD">
        {lang === "en"
          ? <>When user-mode (ring 3) code crashes — say, Notepad has a bug — Windows simply terminates that one process. The rest of the system keeps running untouched. But when kernel-mode (ring 0) code crashes — a driver dereferences a null pointer, a timer callback corrupts the stack — there is no higher authority to contain it. The entire machine halts: <Em>Bug Check (Blue Screen of Death)</Em>. The system writes a memory dump to disk and reboots. This is why driver quality is the #1 stability factor in Windows — and why Microsoft requires all third-party drivers to be digitally signed.</>
          : <>User mode (ring 3) kodi qulab tushganda — masalan, Notepad'da xato bo'lsa — Windows faqat o'sha jarayonni o'chiradi. Tizimning qolgan qismi ta'sirlanmasdan ishlashda davom etadi. Lekin kernel mode (ring 0) kodi qulab tushganda — drayver null ko'rsatgichni dereference qiladi, taymer callback stack'ni buzadi — uni ushlaydigan yuqori hokimiyat yo'q. Butun mashina to'xtaydi: <Em>Bug Check (Ko'k Ekran O'limi — BSOD)</Em>. Tizim xotira dumpini diskka yozadi va qayta ishga tushadi. Shuning uchun drayver sifati Windows'dagi №1 barqarorlik omili — va Microsoft nima uchun barcha uchinchi tomon drayverlarni raqamli imzolashni talab qiladi.</>}
      </Callout>

      {/* ── 2.3 Executive & Microkernel ── */}
      <h3 style={subhead}>{lang === "en" ? "2.3 — The Executive and the Microkernel" : "2.3 — Executive va Microkernel"}</h3>
      <P>
        {lang === "en"
          ? <>Both the Executive and the Microkernel live inside a single file: <code>ntoskrnl.exe</code> (~10 MB on Windows 11 x64, exporting ~4,000 symbols). The <Term>Microkernel</Term> is the small, ultra-stable core that handles the most fundamental CPU operations — it never makes policy decisions. The <Term>Executive</Term> is the richer layer above it that implements all OS policy. Together they are called the <Em>Windows Executive</Em> or simply <Em>the kernel</Em> in everyday language.</>
          : <>Executive va Microkernel ikkisi ham bitta faylda yashaydi: <code>ntoskrnl.exe</code> (Windows 11 x64 da ~10 MB, ~4,000 ta simvol eksport qiladi). <Term>Microkernel</Term> — eng asosiy CPU operatsiyalarini boshqaradigan kichik, o'ta barqaror yadro — u hech qachon siyosat qarorlari qabul qilmaydi. <Term>Executive</Term> — barcha OS siyosatlarini amalga oshiradigan uning ustidagi boy qatlam. Birgalikda ular <Em>Windows Executive</Em> yoki kundalik tilda oddiygina <Em>kernel</Em> deb ataladi.</>}
      </P>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
        <div style={{ padding: "14px 16px", borderRadius: 10, background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.25)" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "var(--c-system)", marginBottom: 10 }}>
            {lang === "en" ? "Microkernel handles:" : "Microkernel boshqaradi:"}
          </div>
          {(lang === "en" ? [
            "Thread scheduling — priority 0-31, 15.6 ms quantum",
            "IDT (Interrupt Descriptor Table) — 256-entry CPU exception routing",
            "Spinlocks & dispatcher locks — multi-CPU synchronisation",
            "Clock interrupts — HPET / APIC timer at 15.6 ms",
            "Trap / exception dispatch — routes #GP, #PF, NMI to handlers",
            "DPC (Deferred Procedure Call) — post-interrupt work queue",
          ] : [
            "Thread rejalashtiruvi — prioritet 0-31, 15.6 ms kvant",
            "IDT (Interrupt Descriptor Table) — 256 yozuvli CPU istisno yo'naltirish",
            "Spinlock va dispatcher lock'lar — ko'p CPU sinxronizatsiyasi",
            "Soat uzilishlari — HPET / APIC taymer, 15.6 ms da",
            "Trap / exception dispatch — #GP, #PF, NMI ni handlerlarga yo'naltirish",
            "DPC (Deferred Procedure Call) — uzilishdan keyingi ish navbati",
          ]).map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5, fontSize: 12.5, color: "var(--text-1)" }}>
              <span style={{ color: "var(--c-system)", flexShrink: 0 }}>▸</span>{item}
            </div>
          ))}
        </div>
        <div style={{ padding: "14px 16px", borderRadius: 10, background: "rgba(180,100,255,0.06)", border: "1px solid rgba(180,100,255,0.25)" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "#b48cff", marginBottom: 10 }}>
            {lang === "en" ? "Executive — 6 managers:" : "Executive — 6 ta menejer:"}
          </div>
          {(lang === "en" ? [
            "Process Manager — EPROCESS/ETHREAD, NtCreateProcess",
            "Memory Manager — virtual memory, page faults, pagefile.sys, ASLR",
            "I/O Manager — IRP lifecycle, driver stack dispatch",
            "Object Manager — reference counting, handle table",
            "Security Reference Monitor — token ↔ ACL check on every Nt* call",
            "Cache Manager — write-back file cache, mapped sections",
          ] : [
            "Jarayon Menejeri — EPROCESS/ETHREAD, NtCreateProcess",
            "Xotira Menejeri — virtual xotira, sahifa xatolari, pagefile.sys, ASLR",
            "I/O Menejeri — IRP hayot tsikli, drayver stekini yuborish",
            "Ob'ekt Menejeri — reference counting, handle jadvali",
            "Xavfsizlik Reference Monitor — har bir Nt* chaqiruvda token ↔ ACL tekshiruvi",
            "Kesh Menejeri — write-back fayl keshi, xaritalangan bo'limlar",
          ]).map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5, fontSize: 12.5, color: "var(--text-1)" }}>
              <span style={{ color: "#b48cff", flexShrink: 0 }}>▸</span>{item}
            </div>
          ))}
        </div>
      </div>

      <P style={{ marginTop: 16 }}>
        {lang === "en"
          ? <>Below the microkernel sits the <Term>HAL (Hardware Abstraction Layer)</Term> — implemented in <code>hal.dll</code>. HAL hides the differences between specific processor platforms so the same <code>ntoskrnl.exe</code> binary runs on Intel, AMD, and ARM without recompilation. HAL handles: interrupt controller routing (APIC on x64, GIC on ARM), high-resolution timer calibration (for the 15.6 ms scheduler tick), multi-processor boot (waking Application Processor cores), and DMA buffer management. Without HAL, Microsoft would need a separate kernel build for every CPU platform — instead, only HAL is rebuilt per platform, and ntoskrnl stays the same.</>
          : <>Microkernel'dan pastda <Term>HAL (Hardware Abstraction Layer)</Term> — <code>hal.dll</code> da amalga oshiriladi. HAL ma'lum protsessor platformalar o'rtasidagi farqlarni yashiradi, shunda bir xil <code>ntoskrnl.exe</code> binary Intel, AMD va ARM'da qayta kompilyatsiyasiz ishlaydi. HAL quyidagilarni boshqaradi: uzilish kontrolleri yo'naltirish (x64 da APIC, ARM'da GIC), yuqori aniqlikdagi taymer kalibrlash (15.6 ms scheduler tikki uchun), ko'p protsessorli yuklash (Application Processor yadrolarini uyg'otish) va DMA bufer boshqaruvi. HALsiz, Microsoft har bir CPU platformasi uchun alohida kernel to'plami kerak bo'lardi — buning o'rniga faqat HAL har bir platform uchun qayta to'planadi, ntoskrnl esa bir xil qoladi.</>}
      </P>

      {/* ── 2.4 Subsystems & Win32 ── */}
      <h3 style={subhead}>{lang === "en" ? "2.4 — Subsystems, Win32, and the call chain" : "2.4 — Subsistemalar, Win32 va chaqiruv zanjiri"}</h3>
      <P>
        {lang === "en"
          ? <>Applications never call the kernel directly. Every call passes through a strict chain of DLLs. At the top are the <Term>Win32 subsystem DLLs</Term>, which expose the familiar Windows API (~10,000 functions). Below them is <code>ntdll.dll</code>, which provides the <Em>Native API</Em> — a much smaller set of ~460 functions that map directly to kernel syscall numbers. <code>ntdll.dll</code> is the last stop in ring 3 before the <code>SYSCALL</code> instruction fires and the CPU switches to ring 0.</>
          : <>Ilovalar hech qachon kernelga to'g'ridan-to'g'ri murojaat qilmaydi. Har bir chaqiruv qat'iy DLL'lar zanjiridanf o'tadi. Eng yuqorida tanish Windows API'ni (~10,000 funksiya) taqdim etuvchi <Term>Win32 quyi tizim DLL</Term>'lari joylashgan. Ularning ostida <code>ntdll.dll</code> bor, u <Em>Native API</Em>'ni — kernel syscall raqamlariga to'g'ridan-to'g'ri mos keladigan ~460 funksiyaning ancha kichikroq to'plamini — taqdim etadi. <code>ntdll.dll</code> — <code>SYSCALL</code> buyrug'i o'qqa to'lib, protsessor ring 0 ga o'tgunga qadar ring 3 dagi oxirgi to'xtash joyi.</>}
      </P>

      <div style={{ margin: "18px 0", padding: "18px 20px", borderRadius: 12, background: "var(--bg-2)", border: "1px solid var(--border)" }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>// FULL CALL CHAIN — ReadFile("secret.txt") step by step</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5, fontFamily: "var(--font-mono)", fontSize: 12 }}>
          {[
            { ring: "Ring 3", label: "notepad.exe", call: 'ReadFile(hFile, buffer, 1024, &bytesRead, NULL)', color: "var(--c-user)", note: "Win32 API — developer-facing" },
            { ring: "Ring 3", label: "kernel32.dll", call: 'translates → NtReadFile(handle, event, apcRoutine, ...)', color: "var(--c-user)", note: "Win32 subsystem DLL" },
            { ring: "Ring 3", label: "ntdll.dll", call: 'mov eax, 0x0006   ; syscall number for NtReadFile\nsyscall            ; cross into ring 0', color: "var(--c-warn)", note: "Native API — last ring 3 stop" },
            { ring: "Ring 0", label: "ntoskrnl.exe", call: 'I/O Manager: validate params, build IRP\nSRM: check handle vs ACL', color: "var(--c-system)", note: "Executive: security + dispatch" },
            { ring: "Ring 0", label: "ntfs.sys → disk.sys", call: 'handle IRP_MJ_READ\nread sectors from disk via DMA', color: "var(--c-system)", note: "Driver stack" },
          ].map((row, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "52px 1fr",
              padding: "8px 10px", borderRadius: 7, gap: 12, alignItems: "flex-start",
              background: i >= 3 ? "rgba(0,212,255,0.05)" : "rgba(255,145,69,0.04)",
              borderLeft: `2px solid ${row.color}`,
            }}>
              <span className="mono" style={{ fontSize: 9.5, color: row.color, paddingTop: 2 }}>{row.ring}</span>
              <div>
                <div style={{ fontSize: 10.5, color: "var(--text-2)", marginBottom: 2 }}>{row.label} — <em style={{ color: "var(--text-3)" }}>{row.note}</em></div>
                <div style={{ color: "var(--text-1)", whiteSpace: "pre-wrap" }}>{row.call}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <P>
        {lang === "en"
          ? <>One more critical piece: <Term>WOW64 (Windows-on-Windows 64)</Term>. When a 32-bit app (compiled for x86) runs on 64-bit Windows, WOW64 intercepts every syscall and re-translates the 32-bit calling convention into 64-bit before passing it to the actual kernel. The 32-bit app believes it is on a 32-bit OS; the kernel never sees a 32-bit call. This transparent translation layer is why 32-bit software still runs unchanged on Windows 11 x64. Importantly for security: EDRs must hook BOTH the 64-bit ntdll.dll and the 32-bit ntdll inside WOW64, otherwise a 32-bit process can bypass 64-bit hooks entirely.</>
          : <>Yana bir muhim qism: <Term>WOW64 (Windows-on-Windows 64)</Term>. 64-bit Windows da 32-bit ilova (x86 uchun kompilyatsiya qilingan) ishlayotganida, WOW64 har bir syscall'ni ushlab oladi va 32-bit chaqiruv konvensiyasini haqiqiy kernelga topshirishdan oldin 64-bit ga qayta tarjima qiladi. 32-bit ilova 32-bit OS'da ishlayotgandek his qiladi; kernel 32-bit chaqiruvni hech qachon ko'rmaydi. Bu shaffof tarjima qatlami sababli 32-bit dasturiy ta'minot hali ham Windows 11 x64 da o'zgarishsiz ishlaydi. Xavfsizlik nuqtai nazaridan muhimi: EDR'lar HAM 64-bit ntdll.dll, ham WOW64 ichidagi 32-bit ntdll'ga hook qo'yishi kerak — aks holda 32-bit jarayon 64-bit hook'larini butunlay chetlab o'ta oladi.</>}
      </P>
    </section>
  );
}
const subhead = { fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, margin: "28px 0 8px", letterSpacing: "-0.01em" };

// ─────────────────────────────────────────────────────────────
function Section3Layered() {
  const lang = useLang();

  const layers = [
    {
      ring: "Ring 3", color: "var(--c-user)",
      uz: "Foydalanuvchi ilovalar", en: "User Applications",
      files: "notepad.exe · chrome.exe · powershell.exe · malware.exe ...",
      bodyUz: "Har qanday EXE fayl shu qatlamda ishlaydi. Faqat OS ruxsat bergan narsani qila oladi: o'z xotirasini o'qish/yozish, Win32 API chaqirish, syscall orqali kernelga so'rov yuborish. Hardware ko'rinmaydi. Boshqa jarayon xotirasiga tegib bo'lmaydi. Bu qatlam qulab tushsa — faqat o'sha jarayon o'ladi.",
      bodyEn: "Any EXE runs here. Can only do what the OS permits: read/write its own memory, call Win32 API, send requests to the kernel via syscall. Hardware is invisible. Cannot touch other process memory. If this layer crashes — only that one process dies.",
    },
    {
      ring: "Ring 3", color: "var(--c-user)",
      uz: "Win32 quyi tizim DLL'lari", en: "Win32 Subsystem DLLs",
      files: "kernel32.dll · user32.dll · gdi32.dll · advapi32.dll · ws2_32.dll",
      bodyUz: "Dasturchilar yozgan tanish funksiyalarni (CreateFile, DrawText, RegOpenKey, connect) kernelning Native API'ga tarjima qiladi. ~10,000 Win32 funksiya mavjud. Bu qatlam Windows dasturlashning boshlanish nuqtasi — deyarli barcha dasturlar shu DLL'lardan birortasiga bog'liq.",
      bodyEn: "Translates the familiar developer-facing functions (CreateFile, DrawText, RegOpenKey, connect) into the kernel's Native API. ~10,000 Win32 functions exist. This layer is the starting point for all Windows programming — nearly every program links to at least one of these DLLs.",
    },
    {
      ring: "Ring 3", color: "var(--c-warn)",
      uz: "Native API — oxirgi user-mode to'xtash joyi", en: "Native API — last user-mode stop",
      files: "ntdll.dll",
      bodyUz: "Win32 DLL'larning barchasi oxirida ntdll.dll funksiyalarini chaqiradi (NtCreateFile, NtReadFile, NtOpenProcess...). ntdll ichidagi har bir Nt* funksiya protsessorda syscall buyrug'ini bajaradi — bu ring 3 dan ring 0 ga o'tishning yagona qonuniy usuli. EDR va antivirus tizimlari hook'larini aynan shu joyga — ntdll ichiga — qo'yadi, chunki bu syscall'dan oldingi so'nggi nuqta.",
      bodyEn: "All Win32 DLLs ultimately call ntdll.dll (NtCreateFile, NtReadFile, NtOpenProcess...). Each Nt* function inside ntdll executes the syscall instruction on the CPU — the only legal way to cross from ring 3 to ring 0. EDR and antivirus systems place their hooks exactly here — inside ntdll — because this is the last point before the syscall.",
    },
    {
      ring: "Syscall", color: "#f5a623",
      uz: "Syscall chegarasi — ring 3 → ring 0", en: "Syscall gate — ring 3 → ring 0",
      files: "SYSCALL instruction (x64) · SYSENTER (x86 legacy)",
      bodyUz: "Bu yagona qonuniy o'tish nuqtasi. SYSCALL protsessorda atomik ravishda: (1) RIP ni LSTAR MSR'dagi kernel handler manziliga o'rnatadi, (2) CS'ni 0x0010 (ring 0) ga o'zgartiradi, (3) RSP'ni kernel stack'ga ko'chiradi, (4) RFLAGS'ni tozalaydi. Bu to'rtta qadam bittada — uziltirib bo'lmaydi. Syscall raqami EAX registrida uzatiladi (masalan, NtReadFile = 0x0006).",
      bodyEn: "This is the single legal crossing point. SYSCALL atomically: (1) sets RIP to the kernel handler address from LSTAR MSR, (2) changes CS to 0x0010 (ring 0), (3) moves RSP to the kernel stack, (4) clears RFLAGS. All four steps happen as one — cannot be interrupted. The syscall number is passed in EAX (e.g. NtReadFile = 0x0006).",
    },
    {
      ring: "Ring 0", color: "var(--c-system)",
      uz: "Executive — 6 menejer", en: "Executive — 6 managers",
      files: "ntoskrnl.exe (Process · Memory · I/O · Object · SRM · Cache Managers)",
      bodyUz: "Barcha OS siyosatini amalga oshiradi. Har bir Nt* chaqiruvi parametrlarni tekshiradi, xavfsizlik tekshiruvini o'tkazadi, tegishli menejerga yo'naltiradi. Xotira ajratadi, jarayonlar yaratadi, fayllarni boshqaradi, har bir kirish so'rovida token ↔ ACL tekshiruvi o'tkazadi. Executive kernel'dagi barcha 'nima va nega' qarorlarini qabul qiladi.",
      bodyEn: "Implements all OS policy. Every Nt* call validates parameters, runs security checks, routes to the appropriate manager. Allocates memory, creates processes, manages files, runs token ↔ ACL checks on every access request. The Executive makes all the 'what and why' decisions in the kernel.",
    },
    {
      ring: "Ring 0", color: "var(--c-system)",
      uz: "Microkernel — CPU mexanikasi", en: "Microkernel — CPU mechanics",
      files: "ntoskrnl.exe (kernel core) — scheduler · IDT · spinlocks · DPC",
      bodyUz: "Thread'larni rejalashtirishni (prioritet 0-31, 15.6 ms kvant), uzilishlarni yo'naltirishni (IDT — 256 yozuv), CPU sinxronizatsiyasini (spinlock'lar) va DPC (Deferred Procedure Call) navbatlarini boshqaradi. Siyosat qarorlarini qabul qilmaydi — bu Executive ishi. Faqat mexanikani ta'minlaydi.",
      bodyEn: "Handles thread scheduling (priority 0-31, 15.6 ms quantum), interrupt routing (IDT — 256 entries), CPU synchronisation (spinlocks), and DPC (Deferred Procedure Call) queues. Makes no policy decisions — that is the Executive's job. Only provides the mechanics.",
    },
    {
      ring: "Ring 0", color: "#5dade2",
      uz: "HAL — Hardware Abstraction Layer", en: "HAL — Hardware Abstraction Layer",
      files: "hal.dll",
      bodyUz: "Protsessor platformasi farqlarini yashiradi. Bir xil ntoskrnl.exe Intel, AMD va ARM chiplarida ishlaydi, chunki HAL har bir platforma uchun uzilish yo'naltirish (APIC/GIC), yuqori aniqlikdagi taymer va DMA'ni boshqaradi. HALsiz — har bir CPU platformasi uchun alohida kernel kerak bo'lardi.",
      bodyEn: "Hides CPU platform differences. The same ntoskrnl.exe runs on Intel, AMD and ARM chips because HAL manages interrupt routing (APIC/GIC), high-precision timer, and DMA for each platform. Without HAL — a separate kernel would be needed for every CPU platform.",
    },
    {
      ring: "Hardware", color: "#8390a8",
      uz: "Fizik hardware", en: "Physical hardware",
      files: "CPU · RAM · NVMe SSD · NIC · GPU · TPM · USB controllers ...",
      bodyUz: "Haqiqiy silikon. OS bu qatlamga hech qachon to'g'ridan-to'g'ri murojaat qilmaydi — HAL orqali o'tadi. Ilovalar bu qatlamni umuman ko'rmaydi. Hardware'ga to'g'ridan-to'g'ri murojaat qilishga urinish #GP fault yoki hardware exception bilan tugaydi.",
      bodyEn: "The actual silicon. The OS never touches this layer directly — it goes through HAL. Applications never see this layer at all. Attempting to directly access hardware from user mode triggers a #GP fault or hardware exception.",
    },
  ];

  return (
    <section id="layered" style={{ scrollMarginTop: 80, marginBottom: 56 }}>
      <H2 num="03" uz="Qatlamli arxitektura" en="Layered architecture" />
      <P>
        {lang === "en"
          ? <>Windows is built in strict layers — each layer can only communicate with the layers immediately above and below it, never skipping. This is not just good engineering; it is a <Em>security boundary</Em>. No application can reach the hardware without passing through every gate above it. The interactive diagram below shows the full stack. Below that, a layer-by-layer breakdown explains every level in detail.</>
          : <>Windows qat'iy qatlamlarda qurilgan — har bir qatlam faqat undan darhol yuqori va pastdagi qatlamlar bilan muloqot qila oladi, hech qachon o'tkazib yubormaydi. Bu nafaqat yaxshi muhandislik; bu <Em>xavfsizlik chegarasi</Em>. Hech bir ilova uning ustidagi har bir eshikdan o'tmasdan hardware'ga yeta olmaydi. Quyidagi interaktiv diagramma to'liq stekni ko'rsatadi. Undan keyin, qatlam-qatlamli tahlil har bir darajani batafsil tushuntiradi.</>}
      </P>

      <div style={{ marginTop: 20 }}>
        <WindowsArchDiagram />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 18 }}>
        <Callout color="var(--c-user)" icon="user" titleUz="Ring 3 (user)" titleEn="Ring 3 (user)" small>
          {lang === "en" ? "Sandboxed. Can't touch hardware, can't read kernel memory." : "Sandbox'lashtirilgan. Hardware'ga tegmaydi, kernel xotirasini ko'rmaydi."}
        </Callout>
        <Callout color="var(--c-warn)" icon="warning" titleUz="Syscall chegarasi" titleEn="Syscall gate" small>
          {lang === "en" ? "The single legal door — every privileged action passes through here." : "Yagona qonuniy eshik — har bir imtiyozli amal shu yerdan o'tadi."}
        </Callout>
        <Callout color="var(--c-system)" icon="cpu" titleUz="Ring 0 (kernel)" titleEn="Ring 0 (kernel)" small>
          {lang === "en" ? "Full access. One bug here = blue screen for the whole machine." : "To'liq kirish. Bu yerdagi bitta xato = butun mashinaga ko'k ekran."}
        </Callout>
      </div>

      <h3 style={subhead}>{lang === "en" ? "3.1 — Layer-by-layer breakdown" : "3.1 — Qatlam-qatlam batafsil tahlil"}</h3>
      <P>
        {lang === "en"
          ? <>Each row below shows one layer of the Windows architecture stack: the privilege ring it runs in, which files implement it, and exactly what it does. Read top-to-bottom — this is the path every API call follows from your application down to the physical disk.</>
          : <>Quyidagi har bir qator Windows arxitektura stekining bir qatlamini ko'rsatadi: u ishlayotgan imtiyoz ringi, uni amalga oshiradigan fayllar va u nima qilishi. Yuqoridan pastga o'qing — bu har bir API chaqiruvi sizning ilovangizdan jismoniy diskgacha o'tadigan yo'l.</>}
      </P>

      <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 14 }}>
        {layers.map((layer, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "64px 1fr",
            borderRadius: 10, overflow: "hidden",
            border: `1px solid ${layer.color}30`,
          }}>
            <div style={{
              background: `${layer.color}18`,
              borderRight: `2px solid ${layer.color}50`,
              padding: "12px 8px",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
            }}>
              <div className="mono" style={{ fontSize: 9, color: layer.color, textAlign: "center", letterSpacing: 0.04, lineHeight: 1.4 }}>
                {layer.ring.split(" ").map((w, j) => <div key={j}>{w}</div>)}
              </div>
            </div>
            <div style={{ padding: "12px 16px", background: `${layer.color}05` }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: layer.color, marginBottom: 2 }}>
                {lang === "en" ? layer.en : layer.uz}
              </div>
              <div className="mono" style={{ fontSize: 10.5, color: "var(--text-2)", marginBottom: 7 }}>{layer.files}</div>
              <div style={{ fontSize: 12.5, color: "var(--text-1)", lineHeight: 1.7 }}>
                {lang === "en" ? layer.bodyEn : layer.bodyUz}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Callout color="var(--c-attack)" icon="skull" titleUz="Hujumchi nuqtai nazaridan — nima uchun bu stack muhim" titleEn="Attacker's perspective — why this stack matters">
        {lang === "en"
          ? <>An attacker's goal is almost always to move <Em>down</Em> this stack — from a sandboxed process (ring 3) toward the kernel (ring 0). Every layer is a potential attack surface: injecting a DLL gives code in user space, hooking ntdll bypasses EDR monitoring, exploiting a driver vulnerability achieves full ring 0 control over the entire machine. Understanding each layer's role is the foundation of both attack and defence — you cannot protect what you don't understand, and you cannot exploit what you haven't mapped.</>
          : <>Hujumchining maqsadi deyarli har doim shu stackda <Em>pastga</Em> tushish — sandboxlangan jarayondan (ring 3) kernelga (ring 0) tomon. Har bir qatlam potensial hujum yuzasi: DLL kiritish user space'da kod beradi, ntdll'ga hook qo'yish EDR monitoringini chetlab o'tadi, drayver zaifligini ekspluatatsiya qilish butun mashinada to'liq ring 0 nazoratini ta'minlaydi. Har bir qatlamning rolini tushunish hujum va mudofaaning ham asosi — tushunmagan narsangizni himoya qila olmaysiz va xaritalamagan narsangizni ekspluatatsiya qila olmaysiz.</>}
      </Callout>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Boot step card component
function BootStep({ n, icon, color, titleUz, titleEn, children }) {
  const lang = useLang();
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "auto 1fr", gap: 0,
      marginBottom: 4,
    }}>
      {/* Left: number + connector */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 52 }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
          background: `${color}18`, border: `2px solid ${color}`,
          color, display: "grid", placeItems: "center",
          fontSize: 18, fontWeight: 800, fontFamily: "var(--font-mono)",
          boxShadow: `0 0 14px ${color}44`,
        }}>{n}</div>
        <div style={{ width: 2, flex: 1, minHeight: 20, background: `${color}30`, marginTop: 4 }} />
      </div>
      {/* Right: content */}
      <div style={{
        background: `${color}08`, border: `1px solid ${color}22`,
        borderRadius: 12, padding: "16px 20px", marginLeft: 12, marginBottom: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: `${color}18`, border: `1px solid ${color}44`,
            color, display: "grid", placeItems: "center",
          }}><Icon name={icon} size={16} /></div>
          <div style={{ fontWeight: 700, fontSize: 15, color }}>
            {lang === "en" ? titleEn : titleUz}
          </div>
        </div>
        <div style={{ fontSize: 13.5, lineHeight: 1.75, color: "var(--text-1)" }}>
          {children}
        </div>
      </div>
    </div>
  );
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

  return (
    <section id="boot" style={{ scrollMarginTop: 80, marginBottom: 56 }}>
      <H2 num="04" uz="Boot jarayoni" en="The boot process" />
      <P>
        {lang === "en"
          ? <>From the moment you press the power button to the login screen, Windows passes through a precisely choreographed sequence. Each stage hands off to the next and verifies it — so a single compromised step can be detected.</>
          : <>Quvvat tugmasini bosgan paytdan login ekranigacha, Windows aniq xoreografiyalashtirilgan ketma-ketlikdan o'tadi. Har bir bosqich keyingisiga estafetani uzatadi va uni tekshiradi — shuning uchun bitta buzilgan bosqichni aniqlash mumkin.</>}
      </P>

      <div style={{ marginTop: 22 }}>
        <MermaidDiagram
          chart={chart}
          caption="1-rasm. Windows boot ketma-ketligi: POST → bootloader → kernel → user session."
          captionEn="Fig 1. Windows boot sequence: POST → bootloader → kernel → user session."
        />
      </div>

      {/* Step-by-step breakdown */}
      <div style={{ marginTop: 36, marginBottom: 8 }}>
        <div className="eyebrow" style={{ marginBottom: 20 }}>
          {lang === "en" ? "// STEP_BY_STEP — what happens at each stage" : "// BOSQICHMA_BOSQICH — har bir qadamda nima sodir bo'ladi"}
        </div>

        <BootStep n="1" icon="zap" color="var(--c-auth)"
          titleUz="Power On — Elektr tokini yoqish"
          titleEn="Power On — Electricity on">
          {lang === "en"
            ? <>When you press the power button, the <Em>Power Supply Unit (PSU)</Em> sends a stable signal to the motherboard: "Power is ready, you may start." Only after this signal does the CPU execute its very first instruction — always from the same fixed address in ROM.</>
            : <>Siz tugmani bosganingizda, <Em>tok manbai (PSU)</Em> ona plataga signal yuboradi: «Elektr barqaror, ish boshlashimiz mumkin». Faqat shundan keyin CPU o'zining birinchi ko'rsatmasini bajaradi — har doim ROM'dagi qat'iy belgilangan manzildan.</>}
        </BootStep>

        <BootStep n="2" icon="shield" color="var(--c-warn)"
          titleUz="UEFI / BIOS va POST — Qorovulning ertalabki tekshiruvi"
          titleEn="UEFI / BIOS + POST — The morning inspection">
          {lang === "en"
            ? <><Em>POST (Power-On Self Test)</Em> is the first to run — hardware checks itself: is RAM present? Is the CPU working? Then <Em>UEFI</Em> (modern successor to BIOS) maps all components and checks the <Em>Secure Boot</Em> signature chain. If a bootkit tampered with the bootloader, UEFI refuses to hand off — this is exactly how <code>BlackLotus</code> was supposed to be stopped.</>
            : <><Em>POST (Power-On Self Test)</Em> birinchi ishlaydi — hardware o'zini o'zi tekshiradi: RAM joyidami? CPU ishlayaptimi? Klaviatura ulanganmi? Keyin <Em>UEFI</Em> (zamonaviy BIOS o'rniga) barcha qismlarni xaritalaydi va <Em>Secure Boot</Em> imzo zanjirini tekshiradi. Agar bootkit bootloader'ni o'zgartirgan bo'lsa, UEFI estafetani uzatishdan bosh tortadi — <code>BlackLotus</code> aynan shunday to'xtatilishi kerak edi.</>}
        </BootStep>

        <BootStep n="3" icon="database" color="var(--c-system)"
          titleUz="Boot Manager — bootmgr.efi (Zavod direktori)"
          titleEn="Boot Manager — bootmgr.efi">
          {lang === "en"
            ? <>UEFI hands off to <code>bootmgr.efi</code> on the EFI System Partition. Its only job: read the <Em>BCD (Boot Configuration Data)</Em> store and decide which OS to load. If you dual-boot (Windows + Kali Linux), this is where the menu appears. Single OS? It jumps straight ahead.</>
            : <>UEFI EFI System Partition'dagi <code>bootmgr.efi</code> fayliga estafetani uzatadi. Uning yagona vazifasi: <Em>BCD (Boot Configuration Data)</Em> ni o'qib, qaysi OT ni yuklashni hal qilish. Agar ikki OT o'rnatilgan bo'lsa (Windows + Kali Linux) — aynan shu yerda menyu paydo bo'ladi. Bitta OT bo'lsa — to'g'ri keyingisiga o'tadi.</>}
        </BootStep>

        <BootStep n="4" icon="cpu" color="var(--accent)"
          titleUz="Windows Loader — winload.efi (Stolga kitoblar qo'yish)"
          titleEn="Windows Loader — winload.efi">
          {lang === "en"
            ? <><code>winload.efi</code> reads the Windows kernel (<code>ntoskrnl.exe</code>), the Hardware Abstraction Layer (<code>hal.dll</code>), and the boot-start drivers from disk and maps them into RAM. Working from RAM is thousands of times faster than disk — this is why the step exists at all. Before handing off, it verifies every loaded file's digital signature.</>
            : <><code>winload.efi</code> Windows yadrosi (<code>ntoskrnl.exe</code>), Apparat Abstraksiya Qatlami (<code>hal.dll</code>) va dastlabki drayverlarni diskdan o'qib, RAM ga ko'chiradi. RAM'dan ishlash diskga qaraganda minglab marta tezroq — aynan shuning uchun bu qadam mavjud. Boshqaruvni topshirishdan oldin har bir faylning raqamli imzosini tekshiradi.</>}
        </BootStep>

        <BootStep n="5" icon="layers" color="var(--c-user)"
          titleUz="Kernel ishga tushishi — ntoskrnl.exe (Direktor ish boshlagani)"
          titleEn="Kernel initialises — ntoskrnl.exe">
          {lang === "en"
            ? <>Control passes fully to the <Em>Kernel</Em>. It initialises the memory manager, object manager, I/O manager, and starts the process manager. Then it launches <code>smss.exe</code> (Session Manager) — the first real user-space process. Windows logo + spinning dots on screen = this exact moment.</>
            : <>Boshqaruv to'liq <Em>Kernelga</Em> o'tadi. U xotira menejeri, ob'ekt menejeri, I/O menejeri va jarayon menejerini ishga tushiradi. So'ng <code>smss.exe</code> (Session Manager) ni — birinchi haqiqiy user-space jarayonini — yoqadi. Ekrandagi Windows logotipi va aylanayotgan nuqtalar — aynan mana shu lahza.</>}
        </BootStep>

        <BootStep n="6" icon="lock" color="var(--c-attack)"
          titleUz="Winlogon va LSASS — Kirish eshigi va Ruxsatnoma xizmati"
          titleEn="Winlogon + LSASS — Gate and credential guard">
          {lang === "en"
            ? <><code>wininit.exe</code> starts <code>services.exe</code> (all background services) and <code>lsass.exe</code>. <Em>LSASS (Local Security Authority Subsystem Service)</Em> is the heart of Windows authentication — it validates every password, PIN, and smart card. Then <code>winlogon.exe</code> brings up the lock screen. LSASS is also the prime target for <Em>credential dumping</Em> (Mimikatz extracts hashes from its memory).</>
            : <><code>wininit.exe</code> — <code>services.exe</code> (barcha fon xizmatlar) va <code>lsass.exe</code> ni ishga tushiradi. <Em>LSASS (Local Security Authority Subsystem Service)</Em> — Windows autentifikatsiyasining yuragi: har bir parol, PIN va smart-karta aynan shu jarayon orqali tekshiriladi. So'ng <code>winlogon.exe</code> kirish ekranini ko'rsatadi. LSASS shu bilan birga <Em>credential dumping</Em> ning asosiy nishoni (Mimikatz uning xotirasidan hash'larni tortib oladi).</>}
        </BootStep>
      </div>

      {/* ── Extended detail sections ── */}
      <h3 style={subhead}>{lang === "en" ? "4.1 — Secure Boot: the cryptographic chain of trust" : "4.1 — Secure Boot: kriptografik ishonch zanjiri"}</h3>
      <P>
        {lang === "en"
          ? <><Term>Secure Boot</Term> is a UEFI feature that ensures every piece of software loaded during boot has been cryptographically signed by a trusted authority. It uses a chain of public/private key pairs stored inside UEFI firmware. There are two key databases: <Em>db</Em> (allowed signatures — Microsoft, OEM) and <Em>dbx</Em> (revoked signatures — known malware, revoked certificates). If any loaded binary's hash does not match a trusted entry in db — or matches a revoked entry in dbx — UEFI halts the boot immediately.</>
          : <><Term>Secure Boot</Term> — UEFI xususiyati bo'lib, yuklash paytida yuklanadigan har bir dasturiy ta'minot parcha ishonchli organ tomonidan kriptografik imzolanganligi ta'minlanadi. U UEFI dasturiy ta'minotiga o'rnatilgan ochiq/yopiq kalit juftliklardan foydalanadi. Ikkita asosiy ma'lumotlar bazasi mavjud: <Em>db</Em> (ruxsat etilgan imzolar — Microsoft, OEM) va <Em>dbx</Em> (bekor qilingan imzolar — ma'lum zararli dasturlar, bekor qilingan sertifikatlar). Agar yuklanadigan binary'ning xeshi db dagi ishonchli yozuvga mos kelmasa — yoki dbx dagi bekor qilingan yozuvga mos kelsa — UEFI yuklashni darhol to'xtatadi.</>}
      </P>

      <div style={{ margin: "16px 0", padding: "18px 20px", borderRadius: 12, background: "var(--bg-2)", border: "1px solid var(--border)" }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>// SECURE BOOT — chain of trust (each step verifies the next)</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {[
            { from: "UEFI Firmware (ROM)", to: "bootmgr.efi", detail: lang === "en" ? "SHA-256 hash of bootmgr.efi checked against db. Algorithm: RSA-2048 + SHA-256." : "bootmgr.efi ning SHA-256 xeshi db bilan solishtiriladi. Algoritm: RSA-2048 + SHA-256.", color: "var(--c-warn)" },
            { from: "bootmgr.efi", to: "winload.efi", detail: lang === "en" ? "Boot manager verifies the Windows loader's signature via the same certificate chain." : "Boot manager Windows loader'ning imzosini bir xil sertifikat zanjiri orqali tekshiradi.", color: "var(--accent)" },
            { from: "winload.efi", to: "ntoskrnl.exe + hal.dll", detail: lang === "en" ? "Windows loader verifies the kernel image and HAL using Microsoft's code-signing certificate." : "Windows loader yadro tasvirini va HAL ni Microsoft'ning kod imzolash sertifikati yordamida tekshiradi.", color: "var(--c-system)" },
            { from: "ntoskrnl.exe", to: "Boot drivers (*.sys)", detail: lang === "en" ? "Kernel checks WHQL / EV certificate on every driver. Unsigned → BSOD (or test-signed mode only)." : "Kernel har bir drayverda WHQL / EV sertifikatini tekshiradi. Imzosiz → BSOD (yoki faqat test-sign rejimida).", color: "var(--c-system)" },
          ].map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "8px 10px", borderRadius: 8, background: `${step.color}08`, borderLeft: `2px solid ${step.color}` }}>
              <div style={{ flexShrink: 0, paddingTop: 2 }}>
                <div className="mono" style={{ fontSize: 10, color: step.color }}>{step.from}</div>
                <div className="mono" style={{ fontSize: 9, color: "var(--text-3)" }}>→ {step.to}</div>
              </div>
              <div style={{ fontSize: 12.5, color: "var(--text-1)", lineHeight: 1.6 }}>{step.detail}</div>
            </div>
          ))}
        </div>
      </div>

      <Callout color="var(--c-attack)" icon="skull" titleUz="BlackLotus — Secure Boot'ni chetlab o'tish (2023)" titleEn="BlackLotus — bypassing Secure Boot (2023)">
        {lang === "en"
          ? <><code>BlackLotus</code> was the first publicly documented UEFI bootkit to bypass Secure Boot on <Em>fully-patched Windows 11</Em>. It exploited a 2022 vulnerability (CVE-2022-21894, "baton drop") in the Windows boot process. The technique: before Secure Boot checked the revocation list (dbx), BlackLotus patched the dbx verification code in memory, removing its own certificate from the revoked list. The signature check then passed normally. Once resident in the EFI System Partition, it loaded a kernel driver that disabled <Em>Driver Signature Enforcement (DSE)</Em> — giving attackers unrestricted ring 0 access on a "secure" system.</>
          : <><code>BlackLotus</code> — <Em>to'liq yamoqlangan Windows 11</Em> da Secure Boot'ni chetlab o'tgan birinchi ommaviy hujjatlashtirilgan UEFI bootkit. U Windows boot jarayonidagi 2022 yil zaifligini (CVE-2022-21894, "baton drop") ekspluatatsiya qildi. Texnika: Secure Boot revokatsiya ro'yxatini (dbx) tekshirishdan oldin, BlackLotus xotiradagi dbx tekshiruv kodini yamab, o'zining sertifikatini bekor qilingan ro'yxatdan olib tashladi. Imzo tekshiruvi so'ngra odatdagidek o'tdi. EFI System Partition'ga joylashgach, u <Em>Driver Signature Enforcement (DSE)</Em>'ni o'chiruvchi kernel drayveri yukladi — bu "xavfsiz" tizimda hujumchilarga cheksiz ring 0 kirishini ta'minladi.</>}
      </Callout>

      <h3 style={subhead}>{lang === "en" ? "4.2 — BCD: Boot Configuration Data" : "4.2 — BCD: Boot Configuration Data"}</h3>
      <P>
        {lang === "en"
          ? <>The <Term>BCD (Boot Configuration Data)</Term> store is a registry-like database stored in the EFI System Partition at <code>\EFI\Microsoft\Boot\BCD</code>. It is the configuration file that <code>bootmgr.efi</code> reads to know what to boot. BCD contains one or more <Em>boot entries</Em> — each entry describes an OS to boot: its loader path (<code>winload.efi</code>), partition location, timeout, debug settings, and Secure Boot flags.</>
          : <><Term>BCD (Boot Configuration Data)</Term> — EFI System Partition'da <code>\EFI\Microsoft\Boot\BCD</code> manzilida saqlangan registry-ga o'xshash ma'lumotlar bazasi. Bu <code>bootmgr.efi</code> nima yuklashni bilish uchun o'qiydigan konfiguratsiya fayli. BCD bir yoki bir nechta <Em>boot yozuvlarini</Em> o'z ichiga oladi — har bir yozuv yuklash uchun OS ni tavsiflaydi: loader yo'li (<code>winload.efi</code>), bo'lim joylashuvi, vaqt tugashi, debug sozlamalari va Secure Boot bayroqlari.</>}
      </P>
      <div style={{ margin: "14px 0", padding: "14px 16px", borderRadius: 10, background: "var(--bg-2)", border: "1px solid var(--border)", fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 1.9 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>// bcdedit.exe /enum — reading BCD from cmd (Admin required)</div>
        <div style={{ color: "var(--text-3)" }}>{lang === "en" ? "Windows Boot Manager" : "Windows Boot Manager"}</div>
        <div>{"  "}<span style={{ color: "var(--c-system)" }}>identifier</span>{"    "}<span style={{ color: "var(--accent)" }}>{"{bootmgr}"}</span></div>
        <div>{"  "}<span style={{ color: "var(--c-system)" }}>device</span>{"        "}<span style={{ color: "var(--text-1)" }}>partition=\Device\HarddiskVolume1</span></div>
        <div>{"  "}<span style={{ color: "var(--c-system)" }}>timeout</span>{"       "}<span style={{ color: "var(--text-1)" }}>30</span></div>
        <div style={{ marginTop: 8, color: "var(--text-3)" }}>{lang === "en" ? "Windows Boot Loader" : "Windows Boot Loader"}</div>
        <div>{"  "}<span style={{ color: "var(--c-system)" }}>identifier</span>{"    "}<span style={{ color: "var(--accent)" }}>{"{current}"}</span></div>
        <div>{"  "}<span style={{ color: "var(--c-system)" }}>path</span>{"          "}<span style={{ color: "var(--text-1)" }}>\Windows\System32\winload.efi</span></div>
        <div>{"  "}<span style={{ color: "var(--c-system)" }}>description</span>{"   "}<span style={{ color: "var(--text-1)" }}>Windows 11</span></div>
        <div>{"  "}<span style={{ color: "var(--c-system)" }}>secureboot</span>{"    "}<span style={{ color: "var(--c-user)" }}>Yes</span></div>
        <div>{"  "}<span style={{ color: "var(--c-system)" }}>bootdebug</span>{"     "}<span style={{ color: "var(--c-attack)" }}>No</span><span style={{ color: "var(--text-3)" }}>{"   "}{lang === "en" ? "← enable for kernel debugging" : "← kernel debug uchun yoqish"}</span></div>
      </div>

      <h3 style={subhead}>{lang === "en" ? "4.3 — Every critical process explained" : "4.3 — Har bir muhim jarayon batafsil"}</h3>
      <P>
        {lang === "en"
          ? <>After the kernel starts, it launches a chain of critical processes. Each one has a precise role — knowing them means knowing the skeleton of every Windows machine. Forensic analysts, pentesters, and malware authors all study this same list to understand what normal looks like versus what is suspicious.</>
          : <>Kernel ishga tushgach, u muhim jarayonlar zanjirini ishga tushiradi. Har birining aniq roli bor — ularni bilish har bir Windows mashinasining skeletini bilishni anglatadi. Kriminalistlar, pentest mutaxassislari va zararli dastur muallif hammalari normal va shubhali ko'rinishni tushunish uchun bir xil ro'yxatni o'rganadi.</>}
      </P>

      {/* ── Session 0 processes ── */}
      <div className="eyebrow" style={{ margin: "20px 0 10px" }}>// SESSION 0 — {lang === "en" ? "SYSTEM PROCESSES (no UI, isolated)" : "TIZIM JARAYONLARI (UI yo'q, izolyatsiyalangan)"}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          {
            exe: "smss.exe",
            title: lang === "en" ? "Session Manager Subsystem" : "Sessiya Menejeri Quyi Tizimi",
            color: "var(--c-system)",
            props: lang === "en" ? "PID: ~316–450 · Parent: ntoskrnl · User: SYSTEM · Session 0" : "PID: ~316–450 · Ota: ntoskrnl · Foydalanuvchi: SYSTEM · Sessiya 0",
            path: "C:\\Windows\\System32\\smss.exe",
            body: lang === "en"
              ? <>The very first user-space process, spawned directly by the kernel (ntoskrnl.exe). SMSS is responsible for the entire session infrastructure. Its startup tasks: initialise the pagefile (<code>pagefile.sys</code>), load the known DLLs into shared memory (<code>HKLM\SYSTEM\KnownDLLs</code>), and then fork itself into two separate instances — one instance becomes <strong>Session 0</strong> (spawns wininit.exe for system services) and another becomes <strong>Session 1</strong> (spawns winlogon.exe for the first user's login). For each additional user (RDP sessions), SMSS forks again to create Sessions 2, 3, etc. <br /><br /><em>Forensic red flag:</em> if you see smss.exe running with a parent other than ntoskrnl (PID 4), or multiple smss.exe instances when no RDP sessions are active, it is suspicious — malware sometimes uses the name "smss.exe" as camouflage.</>
              : <>Kernelin (ntoskrnl.exe) to'g'ridan-to'g'ri yaratgan birinchi user-space jarayon. SMSS butun sessiya infratuzilmasi uchun mas'ul. Uning ishga tushiruv vazifalari: pagefile'ni (<code>pagefile.sys</code>) ishga tushirish, ma'lum DLL'larni umumiy xotiraga yuklash (<code>HKLM\SYSTEM\KnownDLLs</code>), so'ngra o'zini ikki alohida nusxaga ajratish — bir nusxa <strong>Sessiya 0</strong> bo'ladi (tizim xizmatlari uchun wininit.exe ni yaratadi) va boshqasi <strong>Sessiya 1</strong> bo'ladi (birinchi foydalanuvchi kirishi uchun winlogon.exe ni yaratadi). Har bir qo'shimcha foydalanuvchi (RDP sessiyalari) uchun SMSS yana ajralib, Sessiya 2, 3 va h.k. yaratadi.<br /><br /><em>Kriminalistik qizil bayroq:</em> agar smss.exe ni ntoskrnl (PID 4) dan boshqa ota bilan ishlayotgan yoki faol RDP sessiyalari bo'lmaganda bir nechta smss.exe nusxasini ko'rsangiz — bu shubhali: zararli dasturlar ba'zan "smss.exe" nomidan niqob sifatida foydalanadi.</>,
          },
          {
            exe: "wininit.exe",
            title: lang === "en" ? "Windows Initialization (Session 0 init)" : "Windows Ishga Tushirish (Sessiya 0 initsializatsiyasi)",
            color: "var(--c-system)",
            props: lang === "en" ? "PID: ~500–600 · Parent: smss.exe · User: SYSTEM · Session 0" : "PID: ~500–600 · Ota: smss.exe · Foydalanuvchi: SYSTEM · Sessiya 0",
            path: "C:\\Windows\\System32\\wininit.exe",
            body: lang === "en"
              ? <>wininit.exe is the Session 0 initialiser — its sole job is to start the three core system services that everything else depends on: <strong>services.exe</strong> (the Service Control Manager), <strong>lsass.exe</strong> (authentication), and <strong>lsm.exe</strong> (Local Session Manager, which tracks session state). After spawning these three, wininit.exe stays alive doing nothing — it is the parent that keeps them anchored to Session 0. <br /><br /><em>Forensic note:</em> there is always exactly one wininit.exe on a running system. Its parent is smss.exe, and its three children are services.exe, lsass.exe, and lsm.exe. Any deviation from this parent-child pattern indicates tampering.</>
              : <>wininit.exe — Sessiya 0 initsializatori: uning yagona vazifasi boshqa hamma narsa bog'liq bo'lgan uchta asosiy tizim xizmatini ishga tushirish: <strong>services.exe</strong> (Xizmat Boshqaruv Menejeri), <strong>lsass.exe</strong> (autentifikatsiya) va <strong>lsm.exe</strong> (Mahalliy Sessiya Menejeri, sessiya holatini kuzatadi). Bu uchtalikni yaratgandan so'ng, wininit.exe ularni Sessiya 0 ga bog'lab turuvchi ota sifatida hayotda qoladi.<br /><br /><em>Kriminalistik eslatma:</em> ishlaydigan tizimda har doim aynan bitta wininit.exe bo'ladi. Uning otasi smss.exe, uchta farzandi esa services.exe, lsass.exe va lsm.exe. Ota-farzand naqshidan har qanday og'ish — buzilishni ko'rsatadi.</>,
          },
          {
            exe: "services.exe",
            title: lang === "en" ? "Service Control Manager (SCM)" : "Xizmat Boshqaruv Menejeri (SCM)",
            color: "var(--c-system)",
            props: lang === "en" ? "PID: ~650–800 · Parent: wininit.exe · User: SYSTEM · Session 0" : "PID: ~650–800 · Ota: wininit.exe · Foydalanuvchi: SYSTEM · Sessiya 0",
            path: "C:\\Windows\\System32\\services.exe",
            body: lang === "en"
              ? <>services.exe is the Service Control Manager — it owns the lifecycle of every Windows service. On startup it reads <code>HKLM\SYSTEM\CurrentControlSet\Services</code> in the registry and starts every service with <code>Start=2</code> (auto-start). It manages three types of services: <strong>Win32 services</strong> (hosted in svchost.exe as DLLs), <strong>standalone EXE services</strong> (processes in their own right), and <strong>kernel-mode drivers</strong> (loaded via I/O Manager). services.exe exposes the SCM API — used by tools like <code>sc.exe</code>, <code>PowerShell New-Service</code>, and Task Manager. <br /><br /><em>Security angle:</em> attackers create persistence by registering a new service via <code>sc create</code> or directly writing to the Services registry key. services.exe is also the parent of all svchost.exe instances — if you see svchost.exe with a parent other than services.exe, it is immediately suspicious.</>
              : <>services.exe — Xizmat Boshqaruv Menejeri: u har bir Windows xizmatining hayot tsikliga egalik qiladi. Ishga tushirishda <code>HKLM\SYSTEM\CurrentControlSet\Services</code> registrini o'qiydi va <code>Start=2</code> (avtomatik ishga tushirish) bilan har bir xizmatni ishga tushiradi. U uch turdagi xizmatlarni boshqaradi: <strong>Win32 xizmatlar</strong> (svchost.exe da DLL sifatida joylashgan), <strong>mustaqil EXE xizmatlar</strong> (o'z jarayonlari) va <strong>kernel-mode drayverlar</strong> (I/O Manager orqali yuklangan). services.exe SCM API ni taqdim etadi — <code>sc.exe</code>, <code>PowerShell New-Service</code> va Vazifa Menejeri kabi vositalar tomonidan ishlatiladi.<br /><br /><em>Xavfsizlik tomoni:</em> hujumchilar <code>sc create</code> yoki Services registr kalitiga to'g'ridan-to'g'ri yozish orqali yangi xizmat ro'yxatga olib, barqarorlikni ta'minlaydi. services.exe barcha svchost.exe nusxalarining ham otasi — agar svchost.exe ni services.exe dan boshqa ota bilan ko'rsangiz, bu darhol shubhali.</>,
          },
          {
            exe: "svchost.exe",
            title: lang === "en" ? "Service Host — generic DLL service container" : "Xizmat Mezbon — umumiy DLL xizmat konteyneri",
            color: "var(--c-system)",
            props: lang === "en" ? "PID: many · Parent: services.exe · User: varies · Session 0" : "PID: ko'p · Ota: services.exe · Foydalanuvchi: turli xil · Sessiya 0",
            path: "C:\\Windows\\System32\\svchost.exe -k <ServiceGroupName>",
            body: lang === "en"
              ? <>svchost.exe (Service Host) is a generic container process that hosts Windows services implemented as DLLs. Instead of each service running as its own EXE, many are bundled into DLLs and loaded inside a shared svchost.exe for efficiency. The <code>-k</code> flag determines which service group runs in that instance: <code>-k netsvcs</code> (network services), <code>-k LocalService</code> (limited-privilege services), <code>-k DcomLaunch</code> (COM server activator). A healthy Windows 11 system has 15–20+ svchost.exe instances simultaneously. <br /><br /><strong>Important hosted services:</strong> Windows Update (<code>wuauserv</code>), DHCP Client (<code>Dhcp</code>), DNS Client (<code>Dnscache</code>), Print Spooler (<code>Spooler</code>), Task Scheduler (<code>Schedule</code>), Windows Defender (<code>WdNisSvc</code>), Remote Desktop (<code>TermService</code>). <br /><br /><em>Attacker abuse:</em> "svchost process injection" — malware injects shellcode into a legitimate svchost.exe to hide inside a trusted process. Detection: check parent (must be services.exe), command line (must have -k flag), and loaded modules for unexpected DLLs.</>
              : <>svchost.exe — DLL sifatida amalga oshirilgan Windows xizmatlarini joylashtiruvchi umumiy konteyner jarayon. Har bir xizmat o'z EXE'si sifatida ishlash o'rniga, ko'plari DLL sifatida to'plangan va samaradorlik uchun umumiy svchost.exe ichida yuklanadi. <code>-k</code> bayrog'i o'sha nusxada qaysi xizmat guruhi ishlashini belgilaydi: <code>-k netsvcs</code> (tarmoq xizmatlari), <code>-k LocalService</code> (cheklangan imtiyozli xizmatlar), <code>-k DcomLaunch</code> (COM server aktivatori). Sog'lom Windows 11 tizimida 15–20 dan ortiq svchost.exe nusxasi bir vaqtda ishlaydi.<br /><br /><strong>Muhim joylashtirilgan xizmatlar:</strong> Windows Update (<code>wuauserv</code>), DHCP Mijozi (<code>Dhcp</code>), DNS Mijozi (<code>Dnscache</code>), Print Spooler (<code>Spooler</code>), Vazifa Rejalashtiruvchi (<code>Schedule</code>), Windows Defender (<code>WdNisSvc</code>), Remote Desktop (<code>TermService</code>).<br /><br /><em>Hujumchi suiiste'moli:</em> "svchost jarayon kiritish" — zararli dastur ishonchli jarayon ichiga yashirinish uchun qonuniy svchost.exe ga shellcode kiritadi. Aniqlash: ota (services.exe bo'lishi kerak), buyruq satrini (−k bayroq bo'lishi kerak) va kutilmagan DLL lar uchun yuklangan modullarni tekshiring.</>,
          },
        ].map((proc, i) => (
          <div key={i} style={{ borderRadius: 12, border: `1px solid ${proc.color}30`, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", background: `${proc.color}10`, borderBottom: `1px solid ${proc.color}20` }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 15, fontWeight: 700, color: proc.color }}>{proc.exe}</div>
              <div style={{ fontSize: 13, color: "var(--text-2)", flex: 1 }}>{proc.title}</div>
            </div>
            <div style={{ padding: "12px 16px", background: `${proc.color}04` }}>
              <div className="mono" style={{ fontSize: 10.5, color: "var(--text-3)", marginBottom: 4 }}>{proc.props}</div>
              <div className="mono" style={{ fontSize: 10.5, color: proc.color, marginBottom: 10 }}>{proc.path}</div>
              <div style={{ fontSize: 13, lineHeight: 1.75, color: "var(--text-1)" }}>{proc.body}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Session 1+ processes ── */}
      <div className="eyebrow" style={{ margin: "24px 0 10px" }}>// SESSION 1+ — {lang === "en" ? "USER PROCESSES (interactive, has desktop)" : "FOYDALANUVCHI JARAYONLARI (interaktiv, ish stoli bor)"}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          {
            exe: "winlogon.exe",
            title: lang === "en" ? "Windows Logon Application" : "Windows Kirish Ilovasi",
            color: "var(--c-user)",
            props: lang === "en" ? "PID: ~700–900 · Parent: smss.exe · User: SYSTEM · Session 1+" : "PID: ~700–900 · Ota: smss.exe · Foydalanuvchi: SYSTEM · Sessiya 1+",
            path: "C:\\Windows\\System32\\winlogon.exe",
            body: lang === "en"
              ? <>winlogon.exe manages the interactive logon experience. It handles the <strong>Secure Attention Sequence (SAS)</strong> — the Ctrl+Alt+Del keystroke — which is handled at hardware level and cannot be faked by any user-mode application (this is why Ctrl+Alt+Del is used as a "trusted path" before entering passwords). winlogon loads the <strong>credential providers</strong> (the login UI — password box, PIN, Windows Hello face recognition) via <code>LogonUI.exe</code>. After successful authentication by lsass.exe, winlogon loads the user's profile (<code>NTUSER.DAT</code>) and registry hive, then launches <code>userinit.exe</code> which in turn starts <code>explorer.exe</code>. <br /><br /><em>Security note:</em> the "Winlogon Notification Packages" registry key (<code>HKLM\Software\Microsoft\Windows NT\CurrentVersion\Winlogon</code>) is a classic persistence mechanism — malware registers a DLL here to be loaded by winlogon on every login. Microsoft restricts this in modern Windows, but it remains a checked location during incident response.</>
              : <>winlogon.exe interaktiv kirish tajribasini boshqaradi. U <strong>Xavfsiz Diqqat Ketma-ketligi (SAS)</strong> — Ctrl+Alt+Del tugmalar birikmasini — boshqaradi, bu hardware darajasida ko'rib chiqiladi va hech qanday user-mode ilova tomonidan soxtalashtirib bo'lmaydi (shuning uchun Ctrl+Alt+Del parollarni kiritishdan oldin "ishonchli yo'l" sifatida ishlatiladi). winlogon <strong>hisob ma'lumotlari provayderlarini</strong> (kirish UI — parol qutisi, PIN, Windows Hello yuz tanish) <code>LogonUI.exe</code> orqali yuklaydi. lsass.exe tomonidan muvaffaqiyatli autentifikatsiyadan so'ng, winlogon foydalanuvchining profilini (<code>NTUSER.DAT</code>) va registr uyasini yuklaydi, so'ngra o'z navbatida <code>explorer.exe</code> ni ishga tushiradigan <code>userinit.exe</code> ni ishga tushiradi.<br /><br /><em>Xavfsizlik eslatmasi:</em> "Winlogon Notification Packages" registr kaliti (<code>HKLM\Software\Microsoft\Windows NT\CurrentVersion\Winlogon</code>) — klassik barqarorlik mexanizmi: zararli dastur har bir kirishda winlogon tomonidan yuklanadigan DLL ni shu yerga ro'yxatdan o'tkazadi. Microsoft buni zamonaviy Windows da cheklaydi, lekin u hodisalarga munosabat paytida tekshiriladigan joy bo'lib qoladi.</>,
          },
          {
            exe: "explorer.exe",
            title: lang === "en" ? "Windows Shell / Desktop" : "Windows Shell / Ish Stoli",
            color: "var(--c-user)",
            props: lang === "en" ? "PID: varies · Parent: userinit.exe → orphaned · User: current user · Session 1+" : "PID: turli xil · Ota: userinit.exe → etim · Foydalanuvchi: joriy foydalanuvchi · Sessiya 1+",
            path: "C:\\Windows\\explorer.exe",
            body: lang === "en"
              ? <>explorer.exe is the Windows shell — it renders the desktop, taskbar, Start menu, system tray, and all File Explorer windows. It is the first process that runs under the <strong>user's own security token</strong> (not SYSTEM), meaning it has exactly the permissions the logged-in user has — no more. explorer.exe becomes the parent of most user-launched processes: when you double-click an EXE, explorer.exe spawns it. <br /><br /><em>Technical detail:</em> when userinit.exe finishes its work (running login scripts, mounting network drives), it exits — leaving explorer.exe as an orphan. That's why explorer.exe's parent PID in Task Manager points to a non-existent process. This is normal behaviour, not an anomaly. <br /><br /><em>Security angle:</em> "explorer process injection" is common malware technique. Also, "explorer.exe replacement" — replacing it with a trojan of the same name. Detection: verify the file path is exactly <code>C:\Windows\explorer.exe</code> (not <code>C:\Windows\System32\</code> or any other directory), check file hash, and verify digital signature.</>
              : <>explorer.exe — Windows shell: u ish stoli, vazifalar paneli, Start menyusi, tizim tepsi va barcha Fayl Explorer oynalarini ko'rsatadi. Bu <strong>foydalanuvchining o'z xavfsizlik tokeni</strong> ostida ishlaydigan birinchi jarayon (SYSTEM emas), ya'ni kirgan foydalanuvchi ega bo'lgan imtiyozlarga ega — na ko'proq, na kamroq. explorer.exe ko'plab foydalanuvchi tomonidan ishga tushirilgan jarayonlarning otasiga aylanadi: EXE ni ikki marta bosganingizda, explorer.exe uni yaratadi.<br /><br /><em>Texnik tafsilot:</em> userinit.exe o'z ishini (kirish skriptlarini ishga tushirish, tarmoq disklarini o'rnatish) tugatgach, chiqib ketadi — explorer.exe ni etim holda qoldiradi. Shuning uchun Vazifa Menejeridagi explorer.exe ning ota PID'i mavjud bo'lmagan jarayonga ishora qiladi. Bu normal xatti-harakat, anomaliya emas.<br /><br /><em>Xavfsizlik tomoni:</em> "explorer jarayon kiritish" — keng tarqalgan zararli dastur texnikasi. Shuningdek, "explorer.exe almashtirish" — uni xuddi shu nomdagi troyan bilan almashtirish. Aniqlash: fayl yo'li aynan <code>C:\Windows\explorer.exe</code> ekanligini tekshiring (<code>C:\Windows\System32\</code> yoki boshqa katalog emas), fayl xeshini va raqamli imzoni tekshiring.</>,
          },
        ].map((proc, i) => (
          <div key={i} style={{ borderRadius: 12, border: `1px solid ${proc.color}30`, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", background: `${proc.color}10`, borderBottom: `1px solid ${proc.color}20` }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 15, fontWeight: 700, color: proc.color }}>{proc.exe}</div>
              <div style={{ fontSize: 13, color: "var(--text-2)", flex: 1 }}>{proc.title}</div>
            </div>
            <div style={{ padding: "12px 16px", background: `${proc.color}04` }}>
              <div className="mono" style={{ fontSize: 10.5, color: "var(--text-3)", marginBottom: 4 }}>{proc.props}</div>
              <div className="mono" style={{ fontSize: 10.5, color: proc.color, marginBottom: 10 }}>{proc.path}</div>
              <div style={{ fontSize: 13, lineHeight: 1.75, color: "var(--text-1)" }}>{proc.body}</div>
            </div>
          </div>
        ))}
      </div>

      <h3 style={subhead}>{lang === "en" ? "4.4 — LSASS: full deep-dive" : "4.4 — LSASS: to'liq chuqur tahlil"}</h3>
      <P>
        {lang === "en"
          ? <><Term>LSASS (Local Security Authority Subsystem Service)</Term> is the most security-critical process on any Windows machine. It is the sole arbiter of who is authenticated and what they are allowed to do. Every logon, token issuance, and password change flows through it. And for exactly that reason, it is the single most targeted process by attackers in post-exploitation.</>
          : <><Term>LSASS (Local Security Authority Subsystem Service)</Term> — har qanday Windows mashinasidagi xavfsizlik jihatidan eng muhim jarayon. U kim autentifikatsiya qilinishi va nima qilishga ruxsat berilishi haqida yagona hakam. Har bir kirish, token berish va parol o'zgartirish undan o'tadi. Va aynan shu sababdan, u post-ekspluatatsiyada hujumchilar tomonidan eng ko'p nishonlanadigan yagona jarayon.</>}
      </P>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
        <div style={{ padding: "14px 16px", borderRadius: 10, background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.22)" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "var(--c-system)", marginBottom: 10 }}>
            {lang === "en" ? "What LSASS does:" : "LSASS nima qiladi:"}
          </div>
          {(lang === "en" ? [
            "Validates every logon: local password, PIN, Windows Hello, smart card, Kerberos ticket, NTLM challenge-response",
            "Issues access tokens: after auth, creates the token that carries SID, group memberships, and privileges",
            "Maintains LSA secrets: stores service account passwords, cached domain credentials in HKLM\\SECURITY (readable only as SYSTEM)",
            "Manages security packages: loads MSV1_0 (NTLM), Kerberos, NTLM, TSpkg, WDigest, LiveSSP as DLLs",
            "Caches domain credentials: stores salted+hashed credential for offline logon (HKLM\\SECURITY\\Cache)",
            "Handles password changes: coordinates with domain controllers on domain password policy",
            "Issues Kerberos tickets (TGT/TGS) received from the KDC and caches them for SSO",
          ] : [
            "Har bir kirishni tekshiradi: mahalliy parol, PIN, Windows Hello, smart karta, Kerberos chiptas, NTLM muammoga javob",
            "Kirish tokenlarini beradi: autentifikatsiyadan so'ng SID, guruh a'zoliklari va imtiyozlarni olib yuruvchi tokenni yaratadi",
            "LSA sirlarini saqlaydi: xizmat hisobi parollarini, HKLM\\SECURITY da keshli domen hisob ma'lumotlarini saqlaydi (faqat SYSTEM sifatida o'qiladi)",
            "Xavfsizlik paketlarini boshqaradi: MSV1_0 (NTLM), Kerberos, NTLM, TSpkg, WDigest, LiveSSP ni DLL sifatida yuklaydi",
            "Domen hisob ma'lumotlarini keshlaydi: oflayn kirish uchun tuzlangan+xeshlangan hisob ma'lumotlarini saqlaydi (HKLM\\SECURITY\\Cache)",
            "Parol o'zgarishlarini boshqaradi: domen parol siyosatida domen kontrollerlari bilan muvofiqlashadi",
            "KDC dan olingan Kerberos chiptalari (TGT/TGS) ni beradi va SSO uchun keshlaydi",
          ]).map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5, fontSize: 12.5, color: "var(--text-1)", lineHeight: 1.5 }}>
              <span style={{ color: "var(--c-system)", flexShrink: 0, marginTop: 1 }}>▸</span>{item}
            </div>
          ))}
        </div>
        <div style={{ padding: "14px 16px", borderRadius: 10, background: "rgba(255,58,94,0.06)", border: "1px solid rgba(255,58,94,0.28)" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "var(--c-attack)", marginBottom: 10 }}>
            {lang === "en" ? "What LSASS memory contains (= why attackers want it):" : "LSASS xotirasi nima o'z ichiga oladi (= nima uchun hujumchilar xohlaydi):"}
          </div>
          {(lang === "en" ? [
            "NTLM hashes — used for Pass-the-Hash attacks without knowing the cleartext password",
            "Kerberos TGT and TGS tickets — used for Pass-the-Ticket and Golden/Silver Ticket attacks",
            "Cleartext passwords — if WDigest is enabled (default ON on pre-2012 systems) or via forced re-enable on modern systems",
            "DPAPI master keys — decrypt all data encrypted by the Data Protection API (browser passwords, WiFi keys, Credential Manager)",
            "Cached domain credentials — offline copies of the last 10 domain logons (configurable), useful when the DC is unreachable",
          ] : [
            "NTLM xeshlari — ochiq matn parolini bilmasdan Pass-the-Hash hujumlari uchun ishlatiladi",
            "Kerberos TGT va TGS chiptalari — Pass-the-Ticket va Golden/Silver Ticket hujumlari uchun ishlatiladi",
            "Ochiq matn parollar — agar WDigest yoqilgan bo'lsa (2012 gacha tizimlarda sukut bo'yicha YOQIQ) yoki zamonaviy tizimlarda majburan qayta yoqilsa",
            "DPAPI master kalitlari — Data Protection API tomonidan shifrlangan barcha ma'lumotlarni (brauzer parollari, WiFi kalitlari, Hisob Ma'lumotlari Menejeri) shifrini ochadi",
            "Keshli domen hisob ma'lumotlari — so'nggi 10 ta domen kirishining oflayn nusxalari (sozlanadi), DC uchishib qolganida foydali",
          ]).map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5, fontSize: 12.5, color: "var(--text-1)", lineHeight: 1.5 }}>
              <span style={{ color: "var(--c-attack)", flexShrink: 0, marginTop: 1 }}>✗</span>{item}
            </div>
          ))}
        </div>
      </div>

      <h3 style={subhead} id="lsass-attack">{lang === "en" ? "4.4.1 — How Mimikatz dumps LSASS" : "4.4.1 — Mimikatz LSASS ni qanday dump qiladi"}</h3>
      <P>
        {lang === "en"
          ? <><Em>Mimikatz</Em> (written by Benjamin Delpy, 2011) is the most famous credential harvesting tool in existence. It reads credentials directly from the LSASS process memory. The technique works in three steps:</>
          : <><Em>Mimikatz</Em> (Benjamin Delpy tomonidan yozilgan, 2011) — mavjud eng mashhur hisob ma'lumotlarini yig'ish vositasi. U hisob ma'lumotlarini to'g'ridan-to'g'ri LSASS jarayon xotirasidan o'qiydi. Texnika uch bosqichda ishlaydi:</>}
      </P>

      <div style={{ margin: "14px 0", padding: "16px 20px", borderRadius: 12, background: "var(--bg-2)", border: "1px solid var(--border)", fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 1.9 }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>// MIMIKATZ — step-by-step credential dump</div>
        <div>
          <div style={{ color: "var(--text-3)" }}>{lang === "en" ? "Step 1: request SeDebugPrivilege (needed to open LSASS)" : "1-qadam: SeDebugPrivilege so'rash (LSASS ni ochish uchun kerak)"}</div>
          <div style={{ color: "var(--accent)" }}>mimikatz # <span style={{ color: "var(--text-1)" }}>privilege::debug</span></div>
          <div style={{ color: "var(--c-user)", fontSize: 11 }}>{"  → "}Privilege '20' OK  {lang === "en" ? "(enables reading any process memory as admin)" : "(admin sifatida har qanday jarayon xotirasini o'qish imkonini beradi)"}</div>
        </div>
        <div style={{ marginTop: 10 }}>
          <div style={{ color: "var(--text-3)" }}>{lang === "en" ? "Step 2: open LSASS with OpenProcess(PROCESS_VM_READ), read memory regions where lsasrv.dll stores credential structures" : "2-qadam: OpenProcess(PROCESS_VM_READ) bilan LSASS ni ochish, lsasrv.dll hisob ma'lumotlari tuzilmalarini saqlaydigan xotira mintaqalarini o'qish"}</div>
          <div style={{ color: "var(--accent)" }}>mimikatz # <span style={{ color: "var(--text-1)" }}>sekurlsa::logonpasswords</span></div>
        </div>
        <div style={{ marginTop: 10 }}>
          <div style={{ color: "var(--text-3)" }}>{lang === "en" ? "Step 3: output — decrypted credentials from memory" : "3-qadam: natija — xotiradan shifrlangan hisob ma'lumotlari"}</div>
          <div style={{ color: "var(--c-attack)" }}>Authentication Id : 0 ; 123456</div>
          <div style={{ color: "var(--text-1)" }}>{"  "}Username : Administrator</div>
          <div style={{ color: "var(--text-1)" }}>{"  "}Domain   : CORP</div>
          <div style={{ color: "var(--c-user)" }}>{"  "}NTLM     : <span style={{ color: "var(--c-attack)" }}>aad3b435b51404eeaad3b435b51404ee</span>  <span style={{ color: "var(--text-3)", fontSize: 10 }}>{lang === "en" ? "← usable for PtH without password" : "← parolsiz PtH uchun ishlatish mumkin"}</span></div>
          <div style={{ color: "var(--c-user)" }}>{"  "}Password : <span style={{ color: "var(--c-attack)" }}>P@ssw0rd123</span>  <span style={{ color: "var(--text-3)", fontSize: 10 }}>{lang === "en" ? "← cleartext if WDigest enabled" : "← WDigest yoqilgan bo'lsa ochiq matn"}</span></div>
        </div>
      </div>

      <h3 style={subhead}>{lang === "en" ? "4.4.2 — LSASS defences" : "4.4.2 — LSASS himoyasi"}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
        {[
          {
            name: "PPL — Protected Process Light",
            color: "var(--c-system)",
            bodyUz: <>LSASS ni imzolangan himoyalangan jarayon sifatida belgilaydi. PPL bilan LSASS ga <code>OpenProcess(PROCESS_VM_READ)</code> chaqiruvi <code>ERROR_ACCESS_DENIED</code> bilan muvaffaqiyatsiz tugaydi — administrator sifatida ham. PPL ni yoqish uchun: <code>HKLM\SYSTEM\CurrentControlSet\Control\Lsa → RunAsPPL = 1</code>. Muhim: PPL ni chetlab o'tishning ma'lum usullari mavjud (masalan, zaif drayver orqali kernel kodini kiritish).</>,
            bodyEn: <>Marks LSASS as a signed, protected process. With PPL enabled, <code>OpenProcess(PROCESS_VM_READ)</code> to LSASS fails with <code>ERROR_ACCESS_DENIED</code> — even as administrator. To enable: <code>HKLM\SYSTEM\CurrentControlSet\Control\Lsa → RunAsPPL = 1</code>. Important: known bypass techniques exist (e.g. injecting kernel code via a vulnerable driver).</>,
          },
          {
            name: "Credential Guard (VBS Enclave)",
            color: "#b48cff",
            bodyUz: <>Hisob ma'lumotlarini (NTLM hash'lari, Kerberos chiptalari) <em>Virtuallashtirish Asosidagi Xavfsizlik (VBS)</em> enklavisiga — Hyper-V ga asoslangan izolyatsiyalangan muhitga ko'chiradi. Hatto to'liq buzilgan kernel (ring 0) ham ushbu enklavdagi hisob ma'lumotlariga kira olmaydi. Bunga erishish uchun maxsus CPU qo'llab-quvvatlash talab etiladi (VT-x/AMD-V + SLAT). Windows 11 da Enterprise uchun sukut bo'yicha yoqilgan.</>,
            bodyEn: <>Moves credentials (NTLM hashes, Kerberos tickets) into a <em>Virtualisation-Based Security (VBS)</em> enclave — a Hyper-V-based isolated environment. Even a fully-compromised kernel (ring 0) cannot access the credentials inside this enclave. Requires specific CPU support (VT-x/AMD-V + SLAT). Enabled by default on Windows 11 for Enterprise.</>,
          },
          {
            name: "WDigest off (default post-KB2871997)",
            color: "var(--c-warn)",
            bodyUz: <>WDigest — IIS HTTP Digest autentifikatsiyasi uchun mo'ljallangan eski protokol, lekin u hisob ma'lumotlarini xotirada ochiq matn sifatida saqlashni talab qiladi. Windows 8.1/Server 2012 R2 dan boshlab, Microsoft sukut bo'yicha WDigest ni o'chirdi. Eski tizimlarda: <code>HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\WDigest → UseLogonCredential = 0</code>. Hujumchilar ba'zan bu registr qiymatini 1 ga o'zgartiradi va ochiq matn parollarini dump qilishdan oldin foydalanuvchini qayta kirish uchun majbur qiladi.</>,
            bodyEn: <>WDigest is a legacy protocol designed for IIS HTTP Digest auth, but it requires storing credentials in cleartext in memory. From Windows 8.1/Server 2012 R2, Microsoft disabled WDigest by default. On older systems: <code>HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\WDigest → UseLogonCredential = 0</code>. Attackers sometimes change this registry value to 1 and force the user to re-login before dumping cleartext passwords.</>,
          },
          {
            name: "Detection — Sysmon Event ID 10",
            color: "var(--c-attack)",
            bodyUz: <>Sysmon (System Monitor) Event ID 10 — <em>ProcessAccess</em> — LSASS ga <code>PROCESS_VM_READ</code> yoki <code>PROCESS_VM_OPERATION</code> huquqlari bilan <code>OpenProcess</code> chaqiruvi amalga oshirilganda qayd etiladi. Bu Mimikatz va uning klonlarini aniqlashning standart usuli. SIEM korrelyatsiya qoidasi: "TargetImage = lsass.exe AND GrantedAccess ∈ {0x1010, 0x1410, 0x143A} → HIGH PRIORITY ALERT".</>,
            bodyEn: <>Sysmon (System Monitor) Event ID 10 — <em>ProcessAccess</em> — fires whenever <code>OpenProcess</code> is called on LSASS with <code>PROCESS_VM_READ</code> or <code>PROCESS_VM_OPERATION</code> rights. This is the standard detection for Mimikatz and its clones. SIEM correlation rule: "TargetImage = lsass.exe AND GrantedAccess ∈ {0x1010, 0x1410, 0x143A} → HIGH PRIORITY ALERT".</>,
          },
        ].map((def, i) => (
          <div key={i} style={{ padding: "12px 16px", borderRadius: 10, background: `${def.color}08`, border: `1px solid ${def.color}28`, borderLeft: `3px solid ${def.color}` }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 13.5, fontWeight: 700, color: def.color, marginBottom: 6 }}>{def.name}</div>
            <div style={{ fontSize: 12.5, color: "var(--text-1)", lineHeight: 1.7 }}>{lang === "en" ? def.bodyEn : def.bodyUz}</div>
          </div>
        ))}
      </div>

      <h3 style={subhead}>{lang === "en" ? "4.5 — PatchGuard and Driver Signature Enforcement" : "4.5 — PatchGuard va Drayver Imzo Tekshiruvi"}</h3>
      <P>
        {lang === "en"
          ? <><Term>PatchGuard (Kernel Patch Protection)</Term> is a Windows mechanism, introduced in Vista x64, that prevents unauthorised modification of critical kernel structures. It periodically (at unpredictable intervals) takes checksums of: the SSDT (System Service Descriptor Table), the IDT (Interrupt Descriptor Table), GDT/LDT, kernel code pages, and key data structures like <code>EPROCESS</code>. If a checksum mismatch is found — meaning something modified these structures without authorisation — Windows immediately executes <code>KeBugCheckEx(0x109)</code> — a BSOD with stop code <Em>CRITICAL_STRUCTURE_CORRUPTION</Em>. PatchGuard exists specifically to prevent rootkits from hooking the SSDT (the classic way to intercept all syscalls) and to prevent kernel code injection.</>
          : <><Term>PatchGuard (Kernel Patch Protection)</Term> — Vista x64 da kiritilgan, asosiy kernel tuzilmalarining ruxsatsiz o'zgartirilishini oldini oladigan Windows mexanizmi. U davriy ravishda (oldindan aytib bo'lmaydigan intervallarda) quyidagilarning kontrol yig'indisini oladi: SSDT (System Service Descriptor Table), IDT (Interrupt Descriptor Table), GDT/LDT, kernel kod sahifalari va <code>EPROCESS</code> kabi asosiy ma'lumotlar tuzilmalari. Agar kontrol yig'indi nomuvofiqlik topilsa — ya'ni ruxsatsiz biror narsa bu tuzilmalarni o'zgartirgan bo'lsa — Windows darhol <code>KeBugCheckEx(0x109)</code> ni bajaradi — <Em>CRITICAL_STRUCTURE_CORRUPTION</Em> to'xtash kodi bilan BSOD. PatchGuard rootkit'larning SSDT ga hook qo'yishini (barcha syscall'larni ushlab olishning klassik usuli) va kernel kod kiritishini oldini olish uchun mavjud.</>}
      </P>

      <Callout color="var(--c-warn)" icon="warning" titleUz="Xavfsizlik xulosa — boot zanjiri hujum yuzasi" titleEn="Security summary — the boot chain as attack surface">
        {lang === "en"
          ? <>Every stage of the Windows boot process is also an attack surface. <strong>Pre-UEFI:</strong> physical attackers can overwrite the MBR/EFI partition. <strong>UEFI/Secure Boot:</strong> firmware vulnerabilities (like CVE-2022-21894) allow bypassing signature checks in memory. <strong>BCD:</strong> misconfigured bootdebug or testsigning flags disable kernel protections entirely. <strong>Driver loading:</strong> BYOVD (Bring Your Own Vulnerable Driver) loads a legitimately signed but exploitable driver to disable DSE and load unsigned kernel code. <strong>LSASS at logon:</strong> credential dumping steals hashes for lateral movement. Understanding the full boot sequence is non-negotiable for both defenders and attackers.</>
          : <>Windows boot jarayonining har bir bosqichi hujum yuzasi hamdir. <strong>UEFI'dan oldin:</strong> jismoniy hujumchilar MBR/EFI bo'limini qayta yozishi mumkin. <strong>UEFI/Secure Boot:</strong> dasturiy ta'minot zaifliklari (CVE-2022-21894 kabi) xotiradagi imzo tekshiruvlarini chetlab o'tish imkonini beradi. <strong>BCD:</strong> noto'g'ri sozlangan bootdebug yoki testsigning bayroqlari kernel himoyalarini butunlay o'chiradi. <strong>Drayver yuklash:</strong> BYOVD (Bring Your Own Vulnerable Driver) DSE ni o'chirish va imzosiz kernel kodni yuklash uchun qonuniy imzolangan, lekin ekspluatatsiya qilinadigan drayverni yuklaydi. <strong>Kirishda LSASS:</strong> hisob ma'lumotlarini dump qilish lateral harakat uchun xeshlarni o'g'irlaydi. To'liq boot ketma-ketligini tushunish mudofaachilar ham, hujumchilar uchun ham majburiy.</>}
      </Callout>
    </section>
  );
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

  return (
    <section id="syscall" style={{ scrollMarginTop: 80, marginBottom: 56 }}>
      <H2 num="05" uz="Bitta syscall'ning hayoti" en="The life of a single syscall" />
      <P>
        {lang === "en"
          ? <>Every privileged operation — opening a file, allocating memory, sending a network packet — follows the exact same path: <Em>Win32 API → ntdll → syscall instruction → executive</Em>. The diagram below traces one single <Code2>ReadFile</Code2> call. Knowing this path by heart is non-negotiable for kernel debugging, malware analysis and EDR work.</>
          : <>Har qanday imtiyozli operatsiya — fayl ochish, xotira ajratish, tarmoq paketi yuborish — aynan bir xil yo'ldan o'tadi: <Em>Win32 API → ntdll → syscall buyrug'i → executive</Em>. Quyidagi diagramma bitta <Code2>ReadFile</Code2> chaqiruvini kuzatadi. Bu yo'lni yoddan bilish — kernel debugging, malware tahlili va EDR ishi uchun shart.</>}
      </P>

      <div style={{ marginTop: 22 }}>
        <MermaidDiagram
          chart={chart}
          caption="2-rasm. Bitta ReadFile chaqiruvi user mode'dan kernel mode'ga va orqaga qaytishi."
          captionEn="Fig 2. A single ReadFile traveling from user mode to kernel and back."
        />
      </div>

      <SyscallAnalogy />

      <Callout color="var(--c-attack)" icon="skull"
        titleUz="Hujum nuqtasi — nega bu kiberxavfsizlik uchun muhim"
        titleEn="Attack surface — why this matters for security">
        {lang === "en"
          ? <>Look at the <strong>"Attack surface"</strong> marker at the very bottom of the diagram. Most defensive tools and antivirus engines (<Em>EDRs</Em>) plant their "hook" right inside <Code2>ntdll.dll</Code2> — because it is the <Em>last stop in ring 3</Em>, the final place before the syscall instruction crosses into the kernel. They record every move the "waiter" makes. This is exactly why advanced malware uses <Em>direct syscalls</Em> — bypassing the hooked ntdll functions and invoking the <Code2>syscall</Code2> instruction itself, walking up to the kitchen window alone.</>
          : <>Diagrammaning eng pastki qismidagi <strong>«Hujum nuqtasi»</strong> belgisiga e'tibor bering. Aksariyat himoya tizimlari va antiviruslar (<Em>EDR</Em>) jarayonni kuzatish uchun o'z «qarmog'ini» (hook) aynan <Code2>ntdll.dll</Code2> ichiga tashlaydi — chunki bu <Em>Ring 3'dagi oxirgi nuqta</Em>, syscall buyrug'i yadroga kirishidan oldingi so'nggi joy. Ular «ofitsiant»ning har bir qadamini yozib boradi. Aynan shuning uchun rivojlangan malware <Em>«to'g'ridan-to'g'ri syscall»</Em> (direct syscall) usulidan foydalanadi — ushlangan ntdll funksiyalarini chetlab o'tib, <Code2>syscall</Code2> buyrug'ining o'zini bevosita chaqiradi, ya'ni ofitsiantsiz o'zi oshxona darchasiga boradi.</>}
      </Callout>
    </section>
  );
}

// ─── Restaurant analogy for the syscall flow ───────────────────
const SYSCALL_ACTORS = [
  { tech: "Application", roleUz: "Mijoz", roleEn: "The customer", icon: "user",
    color: "var(--c-user)",
    descUz: "Notepad — maxfiy.txt'ni ochmoqchi", descEn: "Notepad — wants to open maxfiy.txt" },
  { tech: "kernel32 · ntdll", roleUz: "Ofitsiant", roleEn: "The waiter", icon: "code",
    color: "var(--c-user)",
    descUz: "Buyurtmani oshxona tiliga o'giradi", descEn: "Translates the order for the kitchen" },
  { tech: "Syscall gate", roleUz: "Oshxona eshigi", roleEn: "The kitchen door", icon: "key",
    color: "var(--c-warn)",
    descUz: "Ring 3 → Ring 0 chegarasi", descEn: "The ring 3 → ring 0 boundary" },
  { tech: "Executive / Kernel", roleUz: "Oshpaz + Qorovul", roleEn: "Chef + guard", icon: "shield-check",
    color: "var(--c-system)",
    descUz: "Ruxsatni tekshiradi, ishni bajaradi", descEn: "Checks the permission, does the work" },
  { tech: "Hardware", roleUz: "Omborxona", roleEn: "The warehouse", icon: "database",
    color: "#8390a8",
    descUz: "SSD / HDD — baytlarni topadi", descEn: "SSD / HDD — fetches the raw bytes" },
];

function SyscallAnalogy() {
  const lang = useLang();
  return (
    <div style={{ marginTop: 32 }}>
      {/* Intro */}
      <div style={{
        padding: "18px 20px", borderRadius: 12,
        background: "rgba(255,145,69,0.06)",
        border: "1px solid rgba(255,145,69,0.28)",
        display: "flex", gap: 14, alignItems: "flex-start",
      }}>
        <span style={{ color: "var(--c-user)", flexShrink: 0, marginTop: 2 }}><Icon name="users" size={20} /></span>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600, color: "var(--c-user)" }}>
            {lang === "en" ? "Read it as a restaurant" : "Buni restoran misolida o'qing"}
          </div>
          <div style={{ fontSize: 13.5, color: "var(--text-1)", lineHeight: 1.6, marginTop: 4 }}>
            {lang === "en"
              ? <>This diagram shows how Windows connects a plain program (Notepad, or your Python script) to the computer's physical storage. The easiest way to understand it is a restaurant: you order, a waiter relays it, the kitchen cooks, the warehouse supplies — and your food travels back the same way.</>
              : <>Bu diagramma Windows oddiy dasturni (Notepad yoki Python skriptingizni) kompyuterning jismoniy xotirasiga qanday bog'lashini ko'rsatadi. Buni eng oson tushunish yo'li — restoran: siz buyurtma berasiz, ofitsiant uni yetkazadi, oshxona tayyorlaydi, omborxona mahsulot beradi — taom esa o'sha yo'ldan orqaga qaytadi.</>}
          </div>
        </div>
      </div>

      {/* Actor mapping cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginTop: 16 }}>
        {SYSCALL_ACTORS.map((a, i) => (
          <div key={i} style={{
            padding: "14px 12px", borderRadius: 10,
            background: "var(--bg-2)",
            border: `1px solid ${a.color}33`,
            borderTop: `2px solid ${a.color}`,
            display: "flex", flexDirection: "column", gap: 6,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ width: 30, height: 30, borderRadius: 7, background: a.color + "1a", border: `1px solid ${a.color}44`, color: a.color, display: "grid", placeItems: "center" }}>
                <Icon name={a.icon} size={15} />
              </div>
              <span className="mono" style={{ fontSize: 9, color: "var(--text-3)", letterSpacing: 0.06 }}>0{i + 1}</span>
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, color: a.color }}>
              {lang === "en" ? a.roleEn : a.roleUz}
            </div>
            <div className="mono" style={{ fontSize: 9.5, color: "var(--text-2)", letterSpacing: 0.04 }}>{a.tech}</div>
            <div style={{ fontSize: 11, color: "var(--text-1)", lineHeight: 1.45 }}>
              {lang === "en" ? a.descEn : a.descUz}
            </div>
          </div>
        ))}
      </div>

      {/* Step-by-step walkthrough */}
      <div style={{ marginTop: 24 }}>
        <div className="eyebrow" style={{ marginBottom: 4 }}>
          // {lang === "en" ? "STEP_BY_STEP" : "QADAMMA_QADAM"}
        </div>
        <div>
          <AnalogyStep n={1} zoneUz="Ring 3 · Buyurtma" zoneEn="Ring 3 · The order" color="var(--c-user)" dir="down"
            titleUz="Mijoz buyurtma beradi" titleEn="The customer places an order">
            {lang === "en"
              ? <>You want to open <Code2>maxfiy.txt</Code2> in Notepad. Notepad tells the OS "read me this file" — in the diagram this is <Code2>ReadFile(handle, buffer)</Code2> (step&nbsp;1). The app only knows the file number (the <Term>handle</Term>) and an empty slot for the data (the <Term>buffer</Term>); it has no idea where the disk physically is.</>
              : <>Siz Notepad'da <Code2>maxfiy.txt</Code2> faylini ochmoqchisiz. Notepad operatsion tizimga «menga shu faylni o'qib ber» deydi — diagrammada bu <Code2>ReadFile(handle, buffer)</Code2> (1-qadam). Dastur faqat fayl raqamini (<Term>handle</Term>) va ma'lumot joylashadigan bo'sh joyni (<Term>buffer</Term>) biladi; diskning fizik joyini umuman bilmaydi.</>}
          </AnalogyStep>

          <AnalogyStep n={2} zoneUz="Ring 3 · Ofitsiant" zoneEn="Ring 3 · The waiter" color="var(--c-user)" dir="down"
            titleUz="Ofitsiant buyurtmani tarjima qiladi" titleEn="The waiter translates the order">
            {lang === "en"
              ? <>Programs are not allowed to talk to the hardware directly. Notepad calls a Windows library — <Code2>kernel32.dll</Code2> — which hands the order to <Code2>ntdll.dll</Code2>, translating it into the kitchen's language: <Code2>NtReadFile</Code2> (step&nbsp;2). All of this still happens in <Em>User Mode (Ring 3)</Em> — the restricted zone where security limits apply.</>
              : <>Dasturlarga temir-tersak bilan to'g'ridan-to'g'ri gaplashishga ruxsat yo'q. Notepad maxsus Windows kutubxonasiga — <Code2>kernel32.dll</Code2> — murojaat qiladi, u esa buyurtmani <Code2>ntdll.dll</Code2> ga uzatib, oshxona tushunadigan tilga o'giradi: <Code2>NtReadFile</Code2> (2-qadam). Bularning bari hali <Em>User Mode (Ring 3)</Em> — xavfsizlik cheklovlari amal qiladigan hududda yuz beradi.</>}
          </AnalogyStep>

          <AnalogyStep n={3} zoneUz="Chegara · Syscall" zoneEn="Boundary · Syscall" color="var(--c-warn)" dir="down"
            titleUz="Oshxona eshigi — syscall" titleEn="The kitchen door — the syscall">
            {lang === "en"
              ? <>The waiter has the order but cannot enter the kitchen (the kernel). So he passes it through the kitchen window with a special command: <Code2>syscall</Code2> (system call, step&nbsp;3). This is the hard boundary between the ordinary application world and the fully-privileged kernel world — ring&nbsp;3 stops, ring&nbsp;0 begins.</>
              : <>Ofitsiant buyurtmani oldi, lekin oshxonaga (yadroga) kira olmaydi. Shuning uchun u oshxona darchasidan maxsus buyruq yuboradi: <Code2>syscall</Code2> (system call — tizim chaqiruvi, 3-qadam). Bu — oddiy dastur muhitidan to'liq huquqli yadro muhitiga o'tish chegarasi: ring&nbsp;3 tugaydi, ring&nbsp;0 boshlanadi.</>}
          </AnalogyStep>

          <AnalogyStep n={4} zoneUz="Ring 0 · Yadro" zoneEn="Ring 0 · Kernel" color="var(--c-system)" dir="down"
            titleUz="Qorovul tekshiradi, oshpaz ishni bajaradi" titleEn="The guard checks, the chef cooks">
            {lang === "en"
              ? <>The order is now inside the "heart" of the computer (Ring&nbsp;0). The guard runs a <Em>security check</Em> first: do you actually have permission to read this file? If yes, the kernel (the chef) forwards the command straight to the hardware drivers (steps&nbsp;4–5).</>
              : <>Buyurtma endi kompyuterning «yuragi» — Ring&nbsp;0 ichida. Avval Qorovul <Em>xavfsizlik tekshiruvini</Em> o'tkazadi: sizning bu faylni o'qishga huquqingiz bormi? Ruxsat bo'lsa, Kernel (oshpaz) buyruqni bevosita hardware drayverlariga uzatadi (4–5-qadamlar).</>}
          </AnalogyStep>

          <AnalogyStep n={5} zoneUz="Hardware · Omborxona" zoneEn="Hardware · Warehouse" color="#8390a8" dir="down"
            titleUz="Omborxona baytlarni topadi" titleEn="The warehouse fetches the bytes">
            {lang === "en"
              ? <>Your disk (SSD / HDD) springs into action, locates the text bytes of <Code2>maxfiy.txt</Code2> at the requested address and sends them back up (step&nbsp;6). This is the only point where anything physical actually moves.</>
              : <>Qattiq diskingiz (SSD / HDD) ishga tushadi, ko'rsatilgan manzildan <Code2>maxfiy.txt</Code2> ichidagi matn baytlarini topadi va yuqoriga qaytaradi (6-qadam). Bu — yagona nuqta, bu yerda haqiqatan fizik narsa harakatlanadi.</>}
          </AnalogyStep>

          <AnalogyStep n={6} zoneUz="Qaytish · Orqaga" zoneEn="Return · Back up" color="var(--accent)" dir="up" last
            titleUz="Ma'lumot o'sha yo'ldan qaytadi" titleEn="The data travels back the same way">
            {lang === "en"
              ? <>The data retraces its path in reverse (steps&nbsp;7–9): kernel → <Code2>ntdll.dll</Code2> → <Code2>kernel32.dll</Code2> → Notepad. Finally the text appears on your screen. The entire round trip finishes in well under a millisecond.</>
              : <>O'qilgan ma'lumot kelgan yo'lidan teskari qaytadi (7–9-qadamlar): yadro → <Code2>ntdll.dll</Code2> → <Code2>kernel32.dll</Code2> → Notepad. Nihoyat matn ekraningizda paydo bo'ladi. Butun bu sayohat bir millisekunddan ham kam vaqtda tugaydi.</>}
          </AnalogyStep>
        </div>
      </div>
    </div>
  );
}

function AnalogyStep({ n, zoneUz, zoneEn, color, dir = "down", last, titleUz, titleEn, children }) {
  const lang = useLang();
  return (
    <div style={{ display: "flex", gap: 16, position: "relative" }}>
      {/* Number + connector rail */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: color + "1a", color,
          border: `1.5px solid ${color}`,
          display: "grid", placeItems: "center",
          fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 14,
          boxShadow: `0 0 14px ${color}44`,
        }}>{n}</div>
        {!last && (
          <div style={{ flex: 1, width: 2, background: `linear-gradient(180deg, ${color}, var(--border))`, minHeight: 18, marginTop: 2 }} />
        )}
      </div>
      {/* Body */}
      <div style={{ paddingBottom: last ? 0 : 22, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span className="mono" style={{ fontSize: 9.5, color, letterSpacing: 0.12, textTransform: "uppercase" }}>
            {lang === "en" ? zoneEn : zoneUz}
          </span>
          <Icon name={dir === "up" ? "arrow-left" : "arrow-right"} size={11}
            style={{ color, transform: dir === "up" ? "rotate(-90deg)" : "rotate(90deg)" }} />
        </div>
        <h4 style={{ margin: "0 0 4px", fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600, color: "var(--text-0)" }}>
          {lang === "en" ? titleEn : titleUz}
        </h4>
        <div style={{ fontSize: 13.5, color: "var(--text-1)", lineHeight: 1.65 }}>{children}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function Section6Security() {
  const lang = useLang();
  const items = [
    {
      icon: "shield-check", color: "var(--accent)",
      uz: "User/kernel chegarasi", en: "User/kernel boundary",
      descUz: "Hujumchining birinchi orzusi — ring 3'dan ring 0'ga sakrash. Privilege escalation deganda aynan shu bosqich nazarda tutiladi.",
      descEn: "Every attacker's first dream: jump from ring 3 to ring 0. This is what 'privilege escalation' targets.",
    },
    {
      icon: "code", color: "var(--c-user)",
      uz: "Subsistem DLL'lari", en: "Subsystem DLLs",
      descUz: "kernel32, user32, ntdll — bu yerda hook qilish DLL hijacking, AMSI bypass va EDR aldash uchun klassik joy.",
      descEn: "kernel32, user32, ntdll — hooking here is the classic spot for DLL hijacking, AMSI bypass, and EDR evasion.",
    },
    {
      icon: "cpu", color: "var(--c-attack)",
      uz: "Drayverlar", en: "Drivers",
      descUz: "Imzolangan, ammo zaif drayver — kernel'ga eng tez yo'l. 'BYOVD' (Bring Your Own Vulnerable Driver) shu yerdan keladi.",
      descEn: "A signed but vulnerable driver = the fastest path into the kernel. This is the 'BYOVD' (Bring Your Own Vulnerable Driver) trick.",
    },
    {
      icon: "database", color: "var(--c-auth)",
      uz: "Object Manager", en: "Object Manager",
      descUz: "Har bir handle uchun SRM ruxsat tekshiradi. Yomon konfiguratsiya — token impersonation va handle hijacking uchun ochiq eshik.",
      descEn: "SRM checks ACLs on every handle. A weak ACL = open door for token impersonation and handle hijacking.",
    },
    {
      icon: "layers", color: "var(--c-system)",
      uz: "Bootloader", en: "Bootloader",
      descUz: "Secure Boot'ni chetlab o'tuvchi rootkit (BlackLotus) — bu hozirda eng yuqori darajadagi tahdid.",
      descEn: "A rootkit that bypasses Secure Boot (BlackLotus) — currently the highest-tier threat.",
    },
    {
      icon: "lock", color: "var(--c-warn)",
      uz: "HAL & firmware", en: "HAL & firmware",
      descUz: "Eng past darajadagi rootkit (firmware bootkit) — diskni qayta formatlash ham yordam bermaydi.",
      descEn: "Lowest-tier rootkit (firmware bootkit) — reformatting the disk doesn't help.",
    },
  ];

  return (
    <section id="security" style={{ scrollMarginTop: 80, marginBottom: 56 }}>
      <H2 num="06" uz="Xavfsizlik nuqtai nazaridan" en="Why each layer matters for security" />
      <P>
        {lang === "en"
          ? <>This isn't a security course bolted on top of fundamentals — every layer of the architecture you just learned is also an attack surface. Below is how each layer becomes interesting to an attacker (and to you, as a defender).</>
          : <>Bu fundamental darslarga «ulangan» xavfsizlik kursi emas — siz hozir o'rgangan har bir qatlam ham hujum yuzasidir. Quyida har bir qatlam hujumchi uchun (va sizga, mudofaachi sifatida) qanday qiziqarli bo'lishi ko'rsatilgan.</>}
      </P>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginTop: 22 }}>
        {items.map((it, i) => (
          <div key={i} className="glass" style={{ padding: 18, borderLeft: `3px solid ${it.color}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ color: it.color }}><Icon name={it.icon} size={18} /></div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600 }}>
                {lang === "en" ? it.en : it.uz}
              </div>
            </div>
            <div style={{ fontSize: 13, color: "var(--text-1)", lineHeight: 1.55 }}>
              {lang === "en" ? it.descEn : it.descUz}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
function Section7Lab() {
  const lang = useLang();
  return (
    <section id="lab" style={{ scrollMarginTop: 80, marginBottom: 56 }}>
      <H2 num="07" uz="Laboratoriya" en="Hands-on lab" />
      <P>
        {lang === "en"
          ? <>Open an elevated PowerShell. Your goal: see the architecture in real-time — list every process, identify what runs in user mode vs kernel mode, and watch the syscall path light up.</>
          : <>Admin huquqi bilan PowerShell oching. Vazifa: arxitekturani real vaqtda ko'rish — barcha jarayonlarni sanab chiqing, user mode'da va kernel mode'da nima ishlayotganini aniqlang, va syscall yo'lining yorishishini kuzating.</>}
      </P>

      <div className="glass" style={{ padding: "0 28px 4px", marginTop: 22 }}>
        <LabStep n={1}
          title="Barcha jarayonlarni ro'yxatlash"
          titleEn="Enumerate every process"
          done>
          <P>{lang === "en" ? "Get every running process with its PID, parent PID and image path." : "Har bir jarayonni PID, ota-PID va image path bilan ko'rasiz."}</P>
          <Terminal lines={[
            { type: "comment", text: lang === "en" ? "# Top 8 processes by memory" : "# Xotira bo'yicha eng katta 8 ta jarayon" },
            { type: "cmd", text: "Get-Process | Sort-Object WS -Desc | Select-Object -First 8 Id, Name, @{n='MB';e={[int]($_.WS/1MB)}}, Path" },
            { type: "out", text: "  Id  Name            MB  Path" },
            { type: "out", text: "  --  ----            --  ----" },
            { type: "ok", text: "1840  MsMpEng        612  C:\\ProgramData\\Microsoft\\Windows Defender\\..." },
            { type: "ok", text: "5612  chrome         484  C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" },
            { type: "ok", text: "  4   System         122  (kernel)" },
            { type: "warn", text: "  0   Idle             0  (kernel · scheduler)" },
            { type: "comment", text: lang === "en" ? "\n# Note: PID 0 and 4 are kernel-mode 'processes' — they have no image on disk." : "\n# Eslatma: PID 0 va 4 — kernel-mode 'jarayonlari'. Diskda image'i yo'q." },
          ]} />
        </LabStep>

        <LabStep n={2}
          title="Process tree ko'rinishini olish"
          titleEn="Build the process tree">
          <P>{lang === "en" ? "Who started whom? The tree reveals the boot sequence in action." : "Kim kimni ishga tushirgan? Process tree — boot ketma-ketligini real holatda ochib beradi."}</P>
          <Terminal lines={[
            { type: "cmd", text: "Get-CimInstance Win32_Process | Select-Object ProcessId, ParentProcessId, Name | Format-Table" },
            { type: "out", text: " ProcessId  ParentProcessId  Name" },
            { type: "out", text: " ---------  ---------------  ----" },
            { type: "ok", text: "         0                   System Idle Process" },
            { type: "ok", text: "         4              0    System" },
            { type: "ok", text: "       340              4    smss.exe       ← session manager" },
            { type: "ok", text: "       456            340    csrss.exe      ← Win32 subsystem" },
            { type: "ok", text: "       540            340    wininit.exe    ← user-mode init" },
            { type: "ok", text: "       668            540    services.exe   ← SCM" },
            { type: "ok", text: "       680            540    lsass.exe      ← security subsystem" },
            { type: "ok", text: "      1124            668    svchost.exe    ← service host" },
            { type: "comment", text: lang === "en" ? "\n# This IS the boot diagram from section 4 — live, on your machine." : "\n# Bu — 4-bo'limdagi boot diagrammasi. Real holda, sizning mashinangizda." },
          ]} />
        </LabStep>

        <LabStep n={3}
          title="Drayverlar ro'yxati (kernel mode kodi)"
          titleEn="List loaded drivers (kernel-mode code)">
          <P>{lang === "en" ? "Every loaded driver = code running in ring 0. A single rogue one can compromise the whole system." : "Yuklangan har bir drayver = ring 0'da ishlayotgan kod. Yagona zararli drayver butun tizimni xavf ostiga qo'yadi."}</P>
          <Terminal lines={[
            { type: "cmd", text: "driverquery /v /fo csv | ConvertFrom-Csv | Select-Object 'Module Name', 'Display Name', 'Driver Type' | Sort-Object 'Driver Type'" },
            { type: "out", text: " Module Name   Display Name              Driver Type" },
            { type: "out", text: " -----------   ------------              -----------" },
            { type: "ok", text: " ACPI          ACPI Driver               Kernel" },
            { type: "ok", text: " disk          Disk Driver               Kernel" },
            { type: "ok", text: " NTFS          NTFS Filesystem           File System" },
            { type: "ok", text: " tcpip         TCP/IP Protocol Driver    Kernel" },
            { type: "warn", text: " RTKVHD64      Realtek HD Audio Driver   Kernel" },
            { type: "err", text: " ??_unknown_   <unsigned third-party>    Kernel   ← inspect this!" },
            { type: "comment", text: lang === "en" ? "\n# Hunt for unsigned drivers — they're the #1 indicator of BYOVD." : "\n# Imzolanmagan drayverlarni qidiring — bular BYOVD'ning №1 ishorasi." },
          ]} />
        </LabStep>
      </div>

      <div style={{ marginTop: 18, padding: 18, borderRadius: 10, background: "rgba(0,255,156,0.04)", border: "1px solid var(--accent-border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Icon name="info" size={16} style={{ color: "var(--accent)" }} />
          <div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600 }}>{lang === "en" ? "Lab completion" : "Lab yakuni"}</div>
        </div>
        <P style={{ marginTop: 8, marginBottom: 0 }}>
          {lang === "en"
            ? <>Now run <Code2>Process Explorer</Code2> from Sysinternals and watch a single click — say, opening Notepad — propagate through every layer you just mapped.</>
            : <>Endi Sysinternals'dan <Code2>Process Explorer</Code2>'ni ishga tushiring va bitta bosishni — masalan, Notepad ochishni — siz endi xaritalashtirilgan har bir qatlam orqali yoyilishini kuzating.</>}
        </P>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
function Section8Comparison() {
  const lang = useLang();
  return (
    <section id="compare" style={{ scrollMarginTop: 80, marginBottom: 56 }}>
      <H2 num="08" uz="User mode va Kernel mode" en="User mode vs Kernel mode" />
      <P>
        {lang === "en"
          ? "Two worlds, same machine. Knowing which side you're on at any moment is the single most important skill on the Windows internals path."
          : "Ikki dunyo, bir mashina. Istalgan vaqtda qaysi tomonda ekanligingizni bilish — Windows internals yo'lidagi eng muhim ko'nikmadir."}
      </P>

      <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)" }}>
        <div style={{ padding: "18px 20px", background: "var(--surface-2)" }}>
          <div className="mono" style={{ fontSize: 10, color: "var(--text-2)", letterSpacing: 0.1, textTransform: "uppercase" }}>{lang === "en" ? "Aspect" : "Jihat"}</div>
        </div>
        <div style={{ padding: "18px 20px", background: "rgba(255, 145, 69, 0.08)", borderLeft: "1px solid var(--border)" }}>
          <div className="mono" style={{ fontSize: 10, color: "var(--c-user)", letterSpacing: 0.1, textTransform: "uppercase" }}>User mode · ring 3</div>
        </div>
        <div style={{ padding: "18px 20px", background: "rgba(77, 139, 255, 0.08)", borderLeft: "1px solid var(--border)" }}>
          <div className="mono" style={{ fontSize: 10, color: "var(--c-system)", letterSpacing: 0.1, textTransform: "uppercase" }}>Kernel mode · ring 0</div>
        </div>

        {(lang === "en" ? CMP_EN : CMP_UZ).map((row, i) => (
          <React.Fragment key={i}>
            <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)", fontSize: 13, color: "var(--text-1)", background: "var(--bg-2)" }}>{row[0]}</div>
            <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)", fontSize: 13, color: "var(--text-0)" }}>{row[1]}</div>
            <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)", fontSize: 13, color: "var(--text-0)" }}>{row[2]}</div>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

const CMP_UZ = [
  ["Privilege", "Cheklangan (ring 3)", "Cheksiz (ring 0)"],
  ["Hardware'ga kirish", "❌ Faqat OS orqali", "✅ To'g'ridan-to'g'ri"],
  ["Boshqa jarayonni o'qish", "❌ Sandbox'lashtirilgan", "✅ Hammasini"],
  ["Xato ta'siri", "Bitta dastur o'ladi", "BSOD — butun mashina"],
  ["Yashash joyi", "exe, dll", "sys (drayver), ntoskrnl"],
  ["Misol kod", "Notepad, Chrome", "NTFS drayveri, TCP/IP stack"],
  ["Debugging vositasi", "WinDbg, x64dbg", "WinDbg + KD, LiveKD"],
];
const CMP_EN = [
  ["Privilege", "Restricted (ring 3)", "Unrestricted (ring 0)"],
  ["Hardware access", "❌ Only via OS", "✅ Direct"],
  ["Read another process", "❌ Sandboxed", "✅ Anything"],
  ["Crash impact", "One app dies", "BSOD — entire machine"],
  ["Lives in", "exe, dll", "sys (driver), ntoskrnl"],
  ["Example code", "Notepad, Chrome", "NTFS driver, TCP/IP stack"],
  ["Debugger", "WinDbg, x64dbg", "WinDbg + KD, LiveKD"],
];

// ─────────────────────────────────────────────────────────────
function Section9Summary() {
  const lang = useLang();
  const nodes = [
    { x: 50, y: 50, label: "Windows", color: "var(--accent)", main: true },
    { x: 22, y: 22, label: "OS jobs", color: "var(--c-user)" },
    { x: 78, y: 22, label: "Ring 3/0", color: "var(--c-warn)" },
    { x: 18, y: 50, label: "Executive", color: "var(--c-system)" },
    { x: 82, y: 50, label: "ntoskrnl", color: "var(--c-system)" },
    { x: 25, y: 78, label: "HAL", color: "#8390a8" },
    { x: 75, y: 78, label: "Syscall", color: "var(--c-warn)" },
    { x: 50, y: 12, label: "Subsystems", color: "var(--c-user)" },
    { x: 50, y: 88, label: "Drivers", color: "var(--c-auth)" },
  ];
  const points = lang === "en" ? KEY_EN : KEY_UZ;

  return (
    <section id="summary" style={{ scrollMarginTop: 80, marginBottom: 56 }}>
      <H2 num="09" uz="Xulosa va kalit tushunchalar" en="Summary · key takeaways" />

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 28, alignItems: "center" }}>
        <div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
            {points.map((t, i) => (
              <li key={i} style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--accent)", color: "#04060d", display: "grid", placeItems: "center", flexShrink: 0, fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 11 }}>{i + 1}</div>
                <div style={{ fontSize: 14, color: "var(--text-0)" }}>{t}</div>
              </li>
            ))}
          </ul>
        </div>
        <MindMap nodes={nodes} />
      </div>
    </section>
  );
}

const KEY_UZ = [
  "OS — ilovalar va apparat o'rtasidagi yagona vositachi. Hammasi shu yerdan o'tadi.",
  "Ring 3 (user) va Ring 0 (kernel) — protsessor darajasidagi qat'iy chegaralar.",
  "Process = mulk + xavfsizlik + manzil maydoni. Thread = CPU'da ishlaydigan birlik.",
  "ntoskrnl.exe ichida microkernel (mexanizm) va executive (siyosat) yashaydi.",
  "Win32 API → ntdll → syscall → executive — har qanday imtiyozli amal shu yo'l.",
  "Boot ketma-ketligi: POST → bootloader → kernel → smss → wininit → logon.",
  "Drayver = ring 0'da ishlovchi kod. Imzolanmagan = qizil bayroq.",
];
const KEY_EN = [
  "The OS is the single mediator between apps and hardware. Everything passes through it.",
  "Ring 3 (user) and Ring 0 (kernel) are hard boundaries enforced by the silicon.",
  "Process = ownership + security + address space. Thread = the unit the CPU runs.",
  "ntoskrnl.exe holds both the microkernel (mechanism) and executive (policy).",
  "Win32 API → ntdll → syscall → executive — every privileged action follows this path.",
  "Boot sequence: POST → bootloader → kernel → smss → wininit → logon.",
  "A driver is code that runs in ring 0. An unsigned one is a red flag.",
];

function MindMap({ nodes }) {
  const main = nodes.find((n) => n.main);
  return (
    <div style={{ aspectRatio: "1", maxWidth: 460, position: "relative", margin: "0 auto" }}>
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <defs>
          <filter id="mm-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.6" />
          </filter>
        </defs>
        {nodes.filter((n) => !n.main).map((n, i) => (
          <line key={i} x1={main.x} y1={main.y} x2={n.x} y2={n.y}
            stroke={n.color} strokeOpacity="0.35" strokeWidth="0.4" />
        ))}
        {nodes.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={n.main ? 9 : 5}
              fill={n.main ? n.color : n.color + "22"}
              stroke={n.color} strokeWidth="0.5"
              filter={n.main ? "url(#mm-glow)" : ""} />
            <text x={n.x} y={n.y + (n.main ? 0.7 : -7.5)}
              fill={n.main ? "#04060d" : n.color}
              fontSize={n.main ? "2.5" : "2.2"}
              fontFamily="var(--font-mono)"
              fontWeight="600"
              textAnchor="middle"
              dominantBaseline="middle">
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function LessonNextNav({ setRoute, onQuizStart, lessonNum }) {
  const lang = useLang();
  return (
    <div style={{ marginTop: 60, paddingTop: 32, borderTop: "1px solid var(--border)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 16, alignItems: "center" }}>
        <button className="btn" onClick={() => setRoute({ name: "section", section: 1 })} style={{ justifySelf: "start" }}>
          <Icon name="arrow-left" size={14} /> {lang === "en" ? "Section overview" : "Bo'limga qaytish"}
        </button>
        <div style={{ textAlign: "center" }}>
          <div className="eyebrow">// {lang === "en" ? "LESSON_COMPLETE" : "DARS_TUGADI"}</div>
          <div style={{ color: "var(--text-2)", fontSize: 12, marginTop: 4 }}>
            {lang === "en" ? "Pass the quiz to unlock the next lesson" : "Keyingi darsga o'tish uchun testni topshiring"}
          </div>
        </div>
        <button className="btn btn-primary" onClick={onQuizStart} style={{ justifySelf: "end" }}>
          <Icon name="target" size={14} /> {lang === "en" ? "Start the quiz" : "Testni boshlash"} <Icon name="arrow-right" size={14} />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// L02: Kernel nima?
// ─────────────────────────────────────────────────────────────
function SectionKernelWhat() {
  const lang = useLang();
  return (
    <section id="kernel-what" style={{ scrollMarginTop: 80, marginBottom: 56 }}>
      <H2 num="01" uz="Kernel nima?" en="What is the kernel?" />
      <P>
        {lang === "en"
          ? <>The <Term>kernel</Term> is the innermost core of the operating system — the one and only piece of software that has complete, unrestricted access to all hardware and memory. Every application, every service, every driver must ultimately go through the kernel to accomplish anything real. While your browser runs in a sandboxed <Em>user space</Em> where it cannot touch hardware directly, the kernel lives in a completely separate, privileged area called <Em>kernel space</Em>, operating in ring 0 with no restrictions whatsoever.</>
          : <>«<Term>Kernel</Term>» — operatsion tizimning eng ichki yadrosi. Bu barcha hardware va xotiraga to'liq, cheklovsiz kirishga ega bo'lgan yagona dastur. Har bir ilova, har bir xizmat, har bir drayver haqiqiy biror narsani bajarish uchun oxir-oqibat kernel orqali o'tishi kerak. Brauzeringiz hardware ga to'g'ridan-to'g'ri tegolmaydigan sandbox'lashtirilgan <Em>user space</Em>'da ishlaydi; kernel esa butunlay boshqa, imtiyozli zonada — <Em>kernel space</Em>'da, ring 0'da hech qanday cheklovsiz ishlaydi.</>}
      </P>
      <P>
        {lang === "en"
          ? <>In Windows, the kernel lives inside a single executable: <code>ntoskrnl.exe</code> (NT OS Kernel Executable), located at <code>C:\Windows\System32\ntoskrnl.exe</code>. This ~10–15 MB file is signed by Microsoft — any byte-level modification causes Windows to refuse to boot entirely. At system startup, the bootloader (<code>winload.efi</code>) maps this file into physical RAM, verifies its signature, then hands control to it. From that moment, the kernel owns the machine.</>
          : <>Windows'da kernel bitta bajariladigan faylda joylashgan: <code>C:\Windows\System32\ntoskrnl.exe</code> (NT OS Kernel Executable). Bu ~10–15 MB li fayl Microsoft tomonidan imzolangan — bitta baytni o'zgartirish Windows'ning butunlay yuklashdan bosh tortishiga olib keladi. Tizim ishga tushganda, bootloader (<code>winload.efi</code>) bu faylni fizik RAM ga ko'chiradi, imzosini tekshiradi va boshqaruvni unga topshiradi. O'sha paytdan boshlab kernel mashinaga egalik qiladi.</>}
      </P>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginTop: 24 }}>
        {(lang === "en" ? [
          { icon: "cpu", color: "var(--c-system)", title: "CPU scheduling", desc: "The kernel decides which thread runs next, on which CPU core, for how long. Without this, multiple programs could not run concurrently. The scheduler runs hundreds of times per second." },
          { icon: "database", color: "var(--accent)", title: "Memory management", desc: "Every process gets its own virtual address space (0–128 TB in 64-bit Windows). The kernel maps virtual addresses to physical RAM pages and prevents any process from accessing another's memory." },
          { icon: "shield", color: "var(--c-auth)", title: "Security policy enforcement", desc: "Before any file, registry key, or process object is accessed, the kernel's Security Reference Monitor checks the caller's access token against the object's ACL. No exception, ever." },
          { icon: "layers", color: "var(--c-user)", title: "I/O and device management", desc: "The kernel routes every I/O request (disk read, network send, USB write) through a stack of drivers via IRP (I/O Request Packets). Hardware never talks directly to user space." },
          { icon: "lock", color: "var(--c-warn)", title: "Privilege enforcement", desc: "The kernel maintains the ring 0 / ring 3 boundary. All privilege checks happen here. This is the single point of control that makes the OS trustworthy." },
          { icon: "graph", color: "var(--c-attack)", title: "System call gateway", desc: "Every privileged action from user space (open file, allocate memory, create thread) arrives at the kernel through the SYSCALL instruction. The kernel validates, executes, and returns the result." },
        ] : [
          { icon: "cpu", color: "var(--c-system)", title: "CPU rejalashtirish", desc: "Kernel qaysi thread keyingi navbatda, qaysi CPU yadroda, qancha vaqt ishlashini hal qiladi. Bu bo'lmasa, bir nechta dastur bir vaqtda ishlay olmas edi. Rejalashtirgich sekundiga yuzlab marta ishlaydi." },
          { icon: "database", color: "var(--accent)", title: "Xotirani boshqarish", desc: "Har bir jarayon o'z virtual manzil maydonini oladi (64-bitli Windows'da 0–128 TB). Kernel virtual manzillarni fizik RAM sahifalariga xaritalaydi va har bir jarayonning boshqasining xotirasiga kirishiga yo'l qo'ymaydi." },
          { icon: "shield", color: "var(--c-auth)", title: "Xavfsizlik siyosatini ta'minlash", desc: "Har bir fayl, registry kaliti yoki jarayon ob'ektiga kirishdan oldin kernelning Xavfsizlik Mos Yozuvlar Moniteri chaqiruvchining kirish tokenini ob'ektning ACL'i bilan solishtiradi. Hech qachon istisno yo'q." },
          { icon: "layers", color: "var(--c-user)", title: "I/O va qurilmalarni boshqarish", desc: "Kernel har bir I/O so'rovini (disk o'qish, tarmoq yuborish, USB yozish) IRP (I/O So'rov Paketlari) orqali drayverlar steki orqali yo'naltiradi. Hardware hech qachon user space bilan to'g'ridan-to'g'ri gaplashmaydi." },
          { icon: "lock", color: "var(--c-warn)", title: "Imtiyozni ta'minlash", desc: "Kernel ring 0 / ring 3 chegarasini saqlaydi. Barcha imtiyoz tekshiruvlari shu yerda bo'ladi. Bu OT'ni ishonchli qiladigan yagona nazorat nuqtasi." },
          { icon: "graph", color: "var(--c-attack)", title: "Tizim chaqiruvi shlyuzi", desc: "User space'dan kelgan har bir imtiyozli amal (fayl ochish, xotira ajratish, thread yaratish) SYSCALL buyrug'i orqali kernelga yetib keladi. Kernel tekshiradi, bajaradi va natijani qaytaradi." },
        ]).map((c, i) => (
          <div key={i} className="glass" style={{ padding: 18, borderLeft: `3px solid ${c.color}` }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
              <div style={{ color: c.color }}><Icon name={c.icon} size={18} /></div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600 }}>{c.title}</div>
            </div>
            <div style={{ fontSize: 12.5, color: "var(--text-1)", lineHeight: 1.6 }}>{c.desc}</div>
          </div>
        ))}
      </div>

      <h3 style={{ ...subhead, marginTop: 36 }}>{lang === "en" ? "1.1 — Monolithic vs Microkernel vs Hybrid" : "1.1 — Monolitik vs Mikrokernel vs Gibrid"}</h3>
      <P>
        {lang === "en"
          ? <>There are three main architectural philosophies for kernels. Windows uses a <Em>hybrid</Em> approach:</>
          : <>Kernellar uchun uchta asosiy arxitektura falsafasi mavjud. Windows <Em>gibrid</Em> yondashuvdan foydalanadi:</>}
      </P>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
        {(lang === "en" ? [
          { title: "Monolithic kernel", color: "var(--c-user)", desc: "Everything runs in ring 0: scheduling, memory, drivers, file systems, networking. Fast, but a bug anywhere crashes the entire OS. Linux is monolithic." },
          { title: "Microkernel", color: "var(--c-system)", desc: "Only the absolute minimum runs in ring 0 (scheduling, IPC). Drivers, file systems run as user-space servers. Secure, but slower due to message passing. Used in embedded systems (QNX, MINIX)." },
          { title: "Hybrid kernel (Windows)", color: "var(--accent)", desc: "Core kernel + executive in ring 0 for speed. Drivers also in ring 0. But the design is modular like a microkernel — each manager (Process, Memory, I/O) is separate. Best of both worlds, but drivers remain a risk." },
        ] : [
          { title: "Monolitik kernel", color: "var(--c-user)", desc: "Hamma narsa ring 0'da ishlaydi: rejalashtirish, xotira, drayverlar, fayl tizimlari, tarmoq. Tez, lekin istalgan joyda xato butun OS'ni yiqitadi. Linux monolitikdir." },
          { title: "Mikrokernel", color: "var(--c-system)", desc: "Faqat mutlaq minimum ring 0'da ishlaydi (rejalashtirish, IPC). Drayverlar, fayl tizimlari user-space serverlari sifatida ishlaydi. Xavfsiz, lekin xabar almashish tufayli sekinroq. O'rnatilgan tizimlarda ishlatiladi (QNX, MINIX)." },
          { title: "Gibrid kernel (Windows)", color: "var(--accent)", desc: "Tezlik uchun asosiy kernel + executive ring 0'da. Drayverlar ham ring 0'da. Lekin dizayn mikrokernel kabi modulli — har bir menejer (Jarayon, Xotira, I/O) alohida. Ikkalasining eng yaxshi tomoni, ammo drayverlar xavf bo'lib qoladi." },
        ]).map((r, i) => (
          <div key={i} style={{ padding: "14px 18px", background: "var(--bg-2)", border: `1px solid ${r.color}33`, borderLeft: `3px solid ${r.color}`, borderRadius: 10 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, color: r.color, marginBottom: 5 }}>{r.title}</div>
            <div style={{ fontSize: 13, color: "var(--text-1)", lineHeight: 1.6 }}>{r.desc}</div>
          </div>
        ))}
      </div>

      <Callout color="var(--accent)" icon="info" titleUz="ntoskrnl.exe haqida texnik faktlar" titleEn="Technical facts about ntoskrnl.exe">
        {lang === "en"
          ? <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8, fontSize: 13 }}>
              <li>Located at <code>C:\Windows\System32\ntoskrnl.exe</code> (uniprocessor) or <code>ntkrnlmp.exe</code> (multiprocessor — Windows merges them on modern builds)</li>
              <li>Size: ~10–20 MB depending on Windows version and debug symbols</li>
              <li>Exports ~2,600 symbols (functions/variables) that drivers can use</li>
              <li>Signed with Microsoft's kernel certificate — SHA-256 hash verified by Secure Boot chain</li>
              <li>Contains the SSDT (System Service Descriptor Table) with all ~450 syscall numbers</li>
              <li>Loaded at a randomized base address (KASLR — Kernel Address Space Layout Randomization) since Windows Vista</li>
            </ul>
          : <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8, fontSize: 13 }}>
              <li><code>C:\Windows\System32\ntoskrnl.exe</code> (yagona protsessor) yoki <code>ntkrnlmp.exe</code> (ko'p protsessorli — zamonaviy Windows versiyalarida birlashtirilgan)</li>
              <li>Hajmi: Windows versiyasiga qarab ~10–20 MB (debug ramzlari bilan)</li>
              <li>Drayverlar foydalana oladigan ~2,600 ta simvol (funksiya/o'zgaruvchi) eksport qiladi</li>
              <li>Microsoft'ning kernel sertifikati bilan imzolangan — SHA-256 hash'i Secure Boot zanjiri tomonidan tekshiriladi</li>
              <li>Barcha ~450 ta syscall raqamini o'z ichiga olgan SSDT (Tizim Xizmat Tasviri Jadvali) ni o'z ichiga oladi</li>
              <li>Windows Vista'dan beri tasodifiy asosiy manzilda yuklanadi (KASLR — Kernel Manzil Maydoni Tartibini Tasodiflashtirish)</li>
            </ul>}
      </Callout>
    </section>
  );
}

function SectionKernelInside() {
  const lang = useLang();
  return (
    <section id="kernel-inside" style={{ scrollMarginTop: 80, marginBottom: 56 }}>
      <H2 num="02" uz="ntoskrnl.exe ichida nima bor?" en="What's inside ntoskrnl.exe?" />
      <P>
        {lang === "en"
          ? <>Despite being one file, <code>ntoskrnl.exe</code> contains two conceptually separate layers: the <Term>Microkernel</Term> (low-level engine) and the <Term>Executive</Term> (high-level policy). The <Term>HAL</Term> (<code>hal.dll</code>) is a separate file but always loaded alongside the kernel. Together they form the three-tier foundation every Windows system builds upon.</>
          : <>Bitta fayl bo'lishiga qaramay, <code>ntoskrnl.exe</code> ikki kontseptual alohida qatlamni o'z ichiga oladi: <Term>Microkernel</Term> (past darajali dvigatel) va <Term>Executive</Term> (yuqori darajali siyosat). <Term>HAL</Term> (<code>hal.dll</code>) alohida fayl, lekin har doim kernel bilan birga yuklanadi. Ular birgalikda har bir Windows tizimi quriladigan uch qatlamli poydevorni tashkil qiladi.</>}
      </P>

      {/* Microkernel */}
      <div style={{ marginTop: 28, padding: "22px 26px", background: "rgba(77,139,255,0.06)", border: "1px solid rgba(77,139,255,0.28)", borderRadius: 14, borderLeft: "4px solid var(--c-system)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(77,139,255,0.15)", border: "1px solid rgba(77,139,255,0.4)", color: "var(--c-system)", display: "grid", placeItems: "center" }}><Icon name="cpu" size={18} /></div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 700, color: "var(--c-system)" }}>Microkernel</div>
            <div style={{ fontSize: 11, color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>ring 0 · innermost layer · minimal by design</div>
          </div>
        </div>
        <P>{lang === "en"
          ? <>The Microkernel is the absolute innermost engine of Windows. Its job is limited to three things by design — keeping it small reduces the attack surface and makes it easier to verify correctness:</>
          : <>Microkernel Windows'ning mutlaq eng ichki dvigatelidir. Uning ishi ataylab uchta narsa bilan cheklangan — uni kichik saqlash hujum yuzasini kamaytiradi va to'g'riligini tekshirishni osonlashtiradi:</>}</P>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
          {(lang === "en" ? [
            { icon: "clock", title: "Thread scheduling", desc: "Decides which thread runs on which CPU core, for how long (quantum). Uses priority levels 0–31. Real-time threads (16–31) always preempt normal threads (0–15). The scheduler runs via a timer interrupt (typically every 15.6ms on desktop, 1ms on server)." },
            { icon: "zap", title: "Interrupt and exception handling", desc: "Manages the IDT (Interrupt Descriptor Table) — a 256-entry table mapping each hardware signal and CPU exception to a handler function. When your keyboard sends a signal, the CPU looks up IDT entry for IRQ1 and jumps to the keyboard interrupt handler." },
            { icon: "layers", title: "CPU synchronization (multiprocessor)", desc: "On a multi-core machine, multiple CPUs share kernel data structures. The microkernel uses spinlocks and dispatcher locks to prevent simultaneous access from corrupting data. Getting this wrong causes subtle, hard-to-reproduce corruption bugs." },
          ] : [
            { icon: "clock", title: "Thread'larni rejalashtirish", desc: "Qaysi thread qaysi CPU yadroda, qancha vaqt (kvant) ishlashini hal qiladi. 0–31 prioritet darajalarini ishlatadi. Real vaqtli thread'lar (16–31) har doim oddiy thread'larni (0–15) almashtiradi. Rejalashtirgich taymer uzilishi orqali ishlaydi (odatda ish stolida har 15.6 ms, serverda 1 ms)." },
            { icon: "zap", title: "Uzilish va istisno boshqarish", desc: "IDT (Uzilish Tasviri Jadvali) ni boshqaradi — har bir hardware signali va CPU istisnosi ishlov beruvchi funksiyaga xaritalangan 256 ta yozuvli jadval. Klaviaturangiz signal yuborganda, CPU IRQ1 uchun IDT yozuvini qidirib topadi va klaviatura uzilish ishlovchisiga sakraydi." },
            { icon: "layers", title: "CPU sinxronizatsiyasi (ko'p protsessorli)", desc: "Ko'p yadroli mashinada bir nechta CPU kernel ma'lumotlar tuzilmalarini baham ko'radi. Microkernel bir vaqtning o'zida kirishning ma'lumotlarni buzishiga yo'l qo'ymaslik uchun spinlock'lar va dispatcher lock'lardan foydalanadi. Bu noto'g'ri qilinsa, takrorlanmaydigan xira buzilish xatolariga olib keladi." },
          ]).map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "12px 14px", background: "rgba(77,139,255,0.04)", borderRadius: 8, border: "1px solid rgba(77,139,255,0.15)" }}>
              <div style={{ color: "var(--c-system)", flexShrink: 0, marginTop: 2 }}><Icon name={s.icon} size={16} /></div>
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--c-system)", fontWeight: 600, marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 12.5, color: "var(--text-1)", lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Executive */}
      <div style={{ marginTop: 16, padding: "22px 26px", background: "rgba(0,255,156,0.04)", border: "1px solid var(--accent-border)", borderRadius: 14, borderLeft: "4px solid var(--accent)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: "var(--accent-soft)", border: "1px solid var(--accent-border)", color: "var(--accent)", display: "grid", placeItems: "center" }}><Icon name="layers" size={18} /></div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 700, color: "var(--accent)" }}>Executive</div>
            <div style={{ fontSize: 11, color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>ring 0 · policy layer · 6 major managers</div>
          </div>
        </div>
        <P>{lang === "en"
          ? <>The Executive sits above the microkernel and implements all OS <Em>policies</Em> — the high-level decisions about what a process is, how memory is shared, who can open a file, and how I/O flows through the system. It is split into six major managers, each responsible for a specific domain:</>
          : <>Executive mikrokernelning ustida turadi va barcha OS <Em>siyosatlarini</Em> amalga oshiradi — jarayon nima ekanligi, xotira qanday bo'lishilishi, kim fayl ochishi mumkinligi va I/O tizim orqali qanday oqishi haqidagi yuqori darajali qarorlar. U har biri o'z sohasiga mas'ul bo'lgan oltita asosiy menejerga bo'linadi:</>}</P>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
          {(lang === "en" ? [
            { name: "Process Manager", api: "NtCreateProcess, NtTerminateProcess, NtOpenProcess", color: "var(--c-user)",
              desc: "Creates and destroys processes and threads. Allocates the EPROCESS and ETHREAD kernel structures for each. Maintains the process list visible in Task Manager. Every CreateProcess() call you make in user space ends up here after passing through kernel32 → ntdll → SYSCALL." },
            { name: "Memory Manager", api: "NtAllocateVirtualMemory, NtReadVirtualMemory, NtMapViewOfSection", color: "var(--accent)",
              desc: "Manages virtual memory for every process (separate 128 TB virtual address space per process on 64-bit). Handles page faults (when a virtual page is not in RAM, it loads from disk). Manages the paging file (pagefile.sys). Implements ASLR (Address Space Layout Randomization) to randomize DLL base addresses." },
            { name: "I/O Manager", api: "NtReadFile, NtWriteFile, NtDeviceIoControlFile", color: "var(--c-system)",
              desc: "Routes every I/O request through a stack of drivers using IRP (I/O Request Packets). When you read a file: I/O Manager creates an IRP, passes it through the file system filter stack (antivirus hooks here), then to the NTFS driver, then to the disk driver, then to the hardware. Each driver in the stack can inspect, modify or complete the IRP." },
            { name: "Object Manager", api: "NtCreateFile, NtOpenKey, NtDuplicateObject", color: "var(--c-auth)",
              desc: "Every kernel resource (file, registry key, event, semaphore, thread, process) is a named kernel object. The Object Manager tracks them with reference counts — when count hits 0, the object is freed. It also manages the handle table: when you call CreateFile(), you get back an integer handle that maps to an internal object pointer." },
            { name: "Security Reference Monitor (SRM)", api: "NtAccessCheck, NtSetSecurityObject", color: "var(--c-attack)",
              desc: "Before any object access is granted, the SRM compares the caller's Access Token (which SIDs and privileges it has) against the object's Security Descriptor (which ACEs allow/deny which SIDs). This check happens on every NtOpenFile, NtOpenProcess, NtOpenKey — literally every kernel object access. You cannot bypass this without being in ring 0." },
            { name: "Cache Manager", api: "(internal, no direct syscall)", color: "var(--c-warn)",
              desc: "Caches recently accessed file data in RAM to avoid redundant disk reads. Works with the Memory Manager's mapped file system. When you read the same file twice, the second read usually never touches the disk — it comes from the cache. The cache also implements write-back buffering: writes are batched and flushed periodically." },
          ] : [
            { name: "Jarayon menejeri", api: "NtCreateProcess, NtTerminateProcess, NtOpenProcess", color: "var(--c-user)",
              desc: "Jarayonlar va thread'larni yaratadi va yo'q qiladi. Har biri uchun EPROCESS va ETHREAD kernel tuzilmalarini ajratadi. Task Manager'da ko'rinadigan jarayon ro'yxatini saqlaydi. User space'da bajaradigan har bir CreateProcess() chaqiruvi kernel32 → ntdll → SYSCALL orqali o'tgandan so'ng shu yerga yetib keladi." },
            { name: "Xotira menejeri", api: "NtAllocateVirtualMemory, NtReadVirtualMemory, NtMapViewOfSection", color: "var(--accent)",
              desc: "Har bir jarayon uchun virtual xotirani boshqaradi (64-bitli tizimda jarayon boshiga alohida 128 TB virtual manzil maydoni). Sahifa xatolarini boshqaradi (virtual sahifa RAM'da bo'lmasa, diskdan yuklaydi). Sahifash faylini boshqaradi (pagefile.sys). DLL asosiy manzillarini tasodiflashtirish uchun ASLR ni amalga oshiradi." },
            { name: "I/O menejeri", api: "NtReadFile, NtWriteFile, NtDeviceIoControlFile", color: "var(--c-system)",
              desc: "Har bir I/O so'rovini IRP (I/O So'rov Paketlari) yordamida drayverlar steki orqali yo'naltiradi. Fayl o'qiganda: I/O menejeri IRP yaratadi, uni fayl tizimi filtr stekidan (antivirus bu yerda ulanadi), keyin NTFS drayveri, keyin disk drayveri, keyin hardware'ga uzatadi. Stakdagi har bir drayver IRP ni ko'rishi, o'zgartirishi yoki tugatishi mumkin." },
            { name: "Ob'ekt menejeri", api: "NtCreateFile, NtOpenKey, NtDuplicateObject", color: "var(--c-auth)",
              desc: "Har bir kernel resursi (fayl, registry kaliti, hodisa, semafor, thread, jarayon) nomlangan kernel ob'ektidir. Ob'ekt menejeri ularni havolalar soni bilan kuzatadi — son 0 ga yetganda ob'ekt bo'shatiladi. U handle jadvalini ham boshqaradi: CreateFile() ni chaqirganizda, ichki ob'ekt ko'rsatkichiga xaritalangan butun son handle qaytariladi." },
            { name: "Xavfsizlik Mos Yozuvlar Moniteri (SRM)", api: "NtAccessCheck, NtSetSecurityObject", color: "var(--c-attack)",
              desc: "Har qanday ob'ektga kirish berilishidan oldin, SRM chaqiruvchining Kirish Tokenini (qaysi SID va imtiyozlarga ega) ob'ektning Xavfsizlik Tavsifi bilan (qaysi ACE qaysi SID ga ruxsat beradi/rad etadi) solishtiradi. Bu tekshiruv har bir NtOpenFile, NtOpenProcess, NtOpenKey — har bir kernel ob'ektiga kirishda amalga oshiriladi. Ring 0'da bo'lmasdan buni chetlab o'tib bo'lmaydi." },
            { name: "Kesh menejeri", api: "(ichki, to'g'ridan-to'g'ri syscall yo'q)", color: "var(--c-warn)",
              desc: "Keraksiz disk o'qishlaridan qochish uchun yaqinda kirilgan fayl ma'lumotlarini RAM'da keshlaydi. Xotira menejerining xaritalangan fayl tizimi bilan ishlaydi. Bir faylni ikki marta o'qisangiz, ikkinchi o'qish odatda diskka tegmaydi — keshdan keladi. Kesh shuningdek yozishni buferlashtiradi: yozishlar to'planadi va vaqti-vaqti bilan yuboriladi." },
          ]).map((m, i) => (
            <div key={i} style={{ padding: "14px 18px", background: "rgba(0,255,156,0.03)", border: `1px solid ${m.color}22`, borderLeft: `3px solid ${m.color}`, borderRadius: 10 }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 6 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 14.5, fontWeight: 700, color: m.color }}>{m.name}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)", letterSpacing: 0.05 }}>{m.api}</div>
              </div>
              <div style={{ fontSize: 12.5, color: "var(--text-1)", lineHeight: 1.65 }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HAL */}
      <div style={{ marginTop: 16, padding: "22px 26px", background: "rgba(184,140,255,0.05)", border: "1px solid rgba(184,140,255,0.22)", borderRadius: 14, borderLeft: "4px solid var(--c-auth)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(184,140,255,0.12)", border: "1px solid rgba(184,140,255,0.3)", color: "var(--c-auth)", display: "grid", placeItems: "center" }}><Icon name="shield" size={18} /></div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 700, color: "var(--c-auth)" }}>HAL — Hardware Abstraction Layer</div>
            <div style={{ fontSize: 11, color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>hal.dll · loaded before ntoskrnl · ring 0</div>
          </div>
        </div>
        <P>{lang === "en"
          ? <>The HAL (<code>hal.dll</code>) is a thin wrapper between the kernel and the actual hardware. Without it, Windows would need completely different code for every motherboard chipset — an impossible maintenance nightmare. HAL exposes a <Em>standardized interface</Em>: the kernel calls <code>HalGetBusData()</code> or <code>HalSetBusData()</code> without knowing anything about the physical bus topology.</>
          : <>HAL (<code>hal.dll</code>) — kernel va haqiqiy hardware o'rtasidagi yupqa wrapper. U bo'lmasa, Windows har bir ona plata chipset uchun butunlay boshqa kod talab qilardi — bu imkonsiz texnik xizmat ko'rsatish dahshati. HAL <Em>standartlashtirilgan interfeys</Em> taqdim etadi: kernel fizik avtobus topologiyasini bilmasdan <code>HalGetBusData()</code> yoki <code>HalSetBusData()</code> ni chaqiradi.</>}</P>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
          {(lang === "en" ? [
            ["Interrupt routing", "Maps hardware IRQ lines to CPU interrupt vectors. Different chipsets wire IRQs differently — HAL hides this."],
            ["Timer calibration", "Reads the hardware clock (HPET, APIC timer, TSC) and provides a unified time source to the kernel scheduler."],
            ["Processor initialization", "Boots secondary CPU cores (APs) in SMP systems. Configures APIC and local interrupt controllers per core."],
            ["DMA channel management", "Allocates DMA channels for drivers so they can transfer data directly to/from RAM without CPU involvement."],
          ] : [
            ["Uzilishlarni yo'naltirish", "Hardware IRQ liniyalarini CPU uzilish vektorlariga xaritalaydi. Har xil chipsetslar IRQ larni boshqacha ulaydi — HAL buni yashiradi."],
            ["Taymer kalibrovkasi", "Hardware soatini o'qiydi (HPET, APIC taymer, TSC) va kernel rejalashtirgichiga yagona vaqt manbaini ta'minlaydi."],
            ["Protsessorni ishga tushirish", "SMP tizimlarida ikkinchi darajali CPU yadrolarini (AP) ishga tushiradi. Har bir yadro uchun APIC va lokal uzilish kontrollerlarini sozlaydi."],
            ["DMA kanali boshqaruvi", "CPU ishtirokisiz to'g'ridan-to'g'ri RAM ga/dan ma'lumot uzatish uchun drayverlar uchun DMA kanallarini ajratadi."],
          ]).map(([title, desc], i) => (
            <div key={i} style={{ padding: "10px 14px", background: "rgba(184,140,255,0.04)", border: "1px solid rgba(184,140,255,0.15)", borderRadius: 8 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--c-auth)", marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: 12, color: "var(--text-1)", lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>
        <Callout color="var(--c-auth)" icon="info" titleUz="Nima uchun Windows turli PC'larda ishlaydi?" titleEn="Why Windows runs on thousands of different PC models">
          {lang === "en"
            ? <>The same <code>ntoskrnl.exe</code> binary ships on every Windows PC. HAL handles all hardware differences transparently. When you install Windows on a laptop vs a server with 64 cores and NUMA memory, Windows loads a different <code>hal.dll</code> — the kernel code itself does not change. This is one of the key architectural decisions made by Dave Cutler's team in 1988 that still pays dividends today.</>
            : <>Bir xil <code>ntoskrnl.exe</code> ikkiligi har bir Windows PC ga yetkaziladi. HAL barcha hardware farqlarini shaffof tarzda boshqaradi. Windows'ni noutbukka yoki 64 yadroli va NUMA xotirali serverga o'rnatganingizda, Windows boshqa <code>hal.dll</code> yuklaydi — kernelning o'zi o'zgarmaydi. Bu 1988 yilda Dave Cutler jamoasi tomonidan qilingan va hali ham foyda keltirmoqda bo'lgan asosiy arxitektura qarorlaridan biridir.</>}
        </Callout>
      </div>
    </section>
  );
}

function SectionKernelDrivers() {
  const lang = useLang();
  return (
    <section id="kernel-drivers" style={{ scrollMarginTop: 80, marginBottom: 56 }}>
      <H2 num="03" uz="Drayverlar — Ring 0'dagi kod" en="Drivers — code living in ring 0" />
      <P>
        {lang === "en"
          ? <>A <Term>driver</Term> is a kernel-mode module (.sys file) that tells Windows exactly how to communicate with a specific piece of hardware or provide a specific system service. Unlike regular applications, drivers run entirely in <Em>ring 0</Em> — the same privilege level as <code>ntoskrnl.exe</code> itself. This gives them complete power over the machine, which is why even a minor bug in a driver can produce an instant BSOD, and why a malicious driver can do anything at all.</>
          : <>«<Term>Drayver</Term>» — Windows'ga ma'lum bir hardware bilan qanday muloqot qilishni yoki ma'lum bir tizim xizmatini qanday ko'rsatishni aniq aytadigan kernel-mode modul (.sys fayl). Oddiy ilovalardan farqli o'laroq, drayverlar to'liq <Em>ring 0</Em>'da — <code>ntoskrnl.exe</code> ning o'zi bilan bir xil imtiyoz darajasida — ishlaydi. Bu ularga mashina ustidan to'liq kuch beradi, shuning uchun drayverdagi kichik xato ham darhol BSOD ga olib kelishi va zararli drayver istalgan narsani qila olishi mumkin.</>}
      </P>

      <h3 style={{ ...subhead, marginTop: 28 }}>{lang === "en" ? "3.1 — Driver types" : "3.1 — Drayver turlari"}</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 12 }}>
        {(lang === "en" ? [
          { title: "Kernel-Mode Driver (KMDF)", color: "var(--c-system)", desc: "Runs in ring 0. Has full hardware access. Used for all hardware drivers: disk, NIC, GPU, USB. The most powerful and most dangerous type. Example: ntfs.sys, tcpip.sys." },
          { title: "User-Mode Driver (UMDF)", color: "var(--c-user)", desc: "Runs in ring 3. Talks to the kernel via a proxy driver. More stable — a crash kills only the driver process, not the OS. Used for USB devices, printers. Introduced in WDF (Windows Driver Framework)." },
          { title: "Filter Driver", color: "var(--c-warn)", desc: "Sits in the driver stack above or below the main driver. Intercepts and can modify I/O requests. Antivirus file system mini-filters work this way — they see every file open/read/write before NTFS does." },
        ] : [
          { title: "Kernel-Mode Drayveri (KMDF)", color: "var(--c-system)", desc: "Ring 0'da ishlaydi. To'liq hardware kirishiga ega. Barcha hardware drayverlari uchun ishlatiladi: disk, tarmoq kartasi, GPU, USB. Eng kuchli va eng xavfli tur. Misol: ntfs.sys, tcpip.sys." },
          { title: "User-Mode Drayveri (UMDF)", color: "var(--c-user)", desc: "Ring 3'da ishlaydi. Proxy drayver orqali kernel bilan gaplashadi. Barqarorroq — xato OS ni emas, faqat drayver jarayonini o'ldiradi. USB qurilmalar, printerlar uchun ishlatiladi. WDF (Windows Driver Framework) da joriy etilgan." },
          { title: "Filtr Drayveri", color: "var(--c-warn)", desc: "Drayver stekida asosiy drayverning ustida yoki ostida turadi. I/O so'rovlarini ushlab, o'zgartira oladi. Antivirus fayl tizimi mini-filtrlari shunday ishlaydi — ular NTFS gacha har bir fayl ochish/o'qish/yozishni ko'radi." },
        ]).map((d, i) => (
          <div key={i} style={{ padding: "14px 16px", background: "var(--bg-2)", border: `1px solid ${d.color}33`, borderTop: `3px solid ${d.color}`, borderRadius: 10 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 13.5, fontWeight: 700, color: d.color, marginBottom: 7 }}>{d.title}</div>
            <div style={{ fontSize: 12.5, color: "var(--text-1)", lineHeight: 1.6 }}>{d.desc}</div>
          </div>
        ))}
      </div>

      <h3 style={{ ...subhead, marginTop: 32 }}>{lang === "en" ? "3.2 — IRP: how the driver stack works" : "3.2 — IRP: drayver steki qanday ishlaydi"}</h3>
      <P>
        {lang === "en"
          ? <>Every I/O operation in Windows travels as an <Term>IRP (I/O Request Packet)</Term> — a kernel data structure that describes the operation (read, write, IOCTL), the target, the buffer, and its status. The I/O Manager creates an IRP and passes it down through a <Em>driver stack</Em> — a chain of drivers registered for that device. Each driver can complete the IRP, pass it further, or fail it.</>
          : <>Windows'dagi har bir I/O operatsiyasi <Term>IRP (I/O So'rov Paketi)</Term> sifatida harakatlanadi — operatsiyani (o'qish, yozish, IOCTL), maqsadni, buferni va uning holatini tavsiflovchi kernel ma'lumotlar tuzilmasi. I/O menejeri IRP yaratadi va uni o'sha qurilma uchun ro'yxatdan o'tgan drayverlar zanjiri bo'lmish <Em>drayver steki</Em> orqali pastga uzatadi. Har bir drayver IRP ni tugatishi, keyingiga uzatishi yoki muvaffaqiyatsiz yakunlashi mumkin.</>}
      </P>
      <div style={{ marginTop: 16, padding: "18px 22px", background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 12 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>// {lang === "en" ? "DRIVER STACK FOR READING A FILE" : "FAYL O'QISH UCHUN DRAYVER STEKI"}</div>
        {[
          { label: lang === "en" ? "User app calls ReadFile()" : "Foydalanuvchi ilovasi ReadFile() ni chaqiradi", color: "var(--c-user)", ring: "ring 3" },
          { label: lang === "en" ? "I/O Manager creates IRP, passes down" : "I/O menejeri IRP yaratadi, pastga uzatadi", color: "var(--c-system)", ring: "ring 0" },
          { label: lang === "en" ? "File system filter (antivirus mini-filter) — inspects IRP" : "Fayl tizimi filtri (antivirus mini-filtri) — IRP ni tekshiradi", color: "var(--c-warn)", ring: "ring 0" },
          { label: lang === "en" ? "NTFS driver — translates path to clusters" : "NTFS drayveri — yo'lni klasterlarga tarjima qiladi", color: "var(--accent)", ring: "ring 0" },
          { label: lang === "en" ? "Disk class driver — translates clusters to LBA sectors" : "Disk sinf drayveri — klasterlarni LBA sektorlarga tarjima qiladi", color: "var(--accent)", ring: "ring 0" },
          { label: lang === "en" ? "NVMe/AHCI port driver — sends command to hardware" : "NVMe/AHCI port drayveri — hardware'ga buyruq yuboradi", color: "var(--c-auth)", ring: "ring 0" },
          { label: lang === "en" ? "SSD/HDD returns data — IRP travels back up" : "SSD/HDD ma'lumotlarni qaytaradi — IRP yuqoriga qaytadi", color: "var(--c-auth)", ring: "hw" },
        ].map((row, i, arr) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "stretch" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 36, flexShrink: 0 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: row.color, flexShrink: 0, marginTop: 6 }} />
              {i < arr.length - 1 && <div style={{ width: 2, flex: 1, background: `${row.color}44`, minHeight: 12 }} />}
            </div>
            <div style={{ paddingBottom: i < arr.length - 1 ? 12 : 0, flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, color: "var(--text-0)" }}>{row.label}</span>
                <span style={{ fontSize: 9.5, fontFamily: "var(--font-mono)", color: row.color, background: row.color + "15", padding: "1px 6px", borderRadius: 4 }}>{row.ring}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h3 style={{ ...subhead, marginTop: 32 }}>{lang === "en" ? "3.3 — Signing, BYOVD and kernel security" : "3.3 — Imzolash, BYOVD va kernel xavfsizligi"}</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
        <div style={{ padding: "16px 18px", background: "rgba(0,255,156,0.04)", border: "1px solid var(--accent-border)", borderRadius: 12 }}>
          <div style={{ color: "var(--accent)", marginBottom: 8, display: "flex", gap: 8, alignItems: "center" }}>
            <Icon name="check" size={16} />
            <span style={{ fontWeight: 600, fontSize: 14 }}>{lang === "en" ? "Signed driver" : "Imzolangan drayver"}</span>
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: "var(--text-1)", lineHeight: 1.75 }}>
            {(lang === "en" ? [
              "Signed with EV (Extended Validation) code signing cert",
              "Microsoft cross-signs it for kernel use (WHQL or attestation)",
              "Signature verified by CI.dll at load time",
              "Any modification → load refused → BSOD on attempt",
              "Extension: .sys · Lives in System32\\drivers\\",
            ] : [
              "EV (Kengaytirilgan Tasdiqlash) kod imzolash sertifikati bilan imzolangan",
              "Microsoft uni kernel ishlatish uchun qayta imzolaydi (WHQL yoki tasdiqlov)",
              "Imzo yuklanish vaqtida CI.dll tomonidan tekshiriladi",
              "Har qanday o'zgartirish → yuklanishdan bosh tortish → urinishda BSOD",
              "Kengaytma: .sys · System32\\drivers\\ da joylashgan",
            ]).map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
        <div style={{ padding: "16px 18px", background: "rgba(255,58,94,0.05)", border: "1px solid rgba(255,58,94,0.25)", borderRadius: 12 }}>
          <div style={{ color: "var(--c-attack)", marginBottom: 8, display: "flex", gap: 8, alignItems: "center" }}>
            <Icon name="warning" size={16} />
            <span style={{ fontWeight: 600, fontSize: 14 }}>{lang === "en" ? "BYOVD Attack" : "BYOVD Hujumi"}</span>
          </div>
          <div style={{ fontSize: 12.5, color: "var(--text-1)", lineHeight: 1.65 }}>
            {lang === "en"
              ? <><strong>Bring Your Own Vulnerable Driver:</strong> Attacker uploads a <em>legitimate, signed</em> driver (e.g. old Gigabyte or ASUS firmware updater) that has a known memory corruption vulnerability. Because it's signed, Windows loads it. The attacker exploits the bug to write shellcode to an arbitrary kernel address — instant ring 0 code execution. Defence: <code>loldrivers.io</code> lists known vulnerable drivers. Block them via WDAC policy.</>
              : <><strong>Bring Your Own Vulnerable Driver:</strong> Hujumchi ma'lum xotira buzilish zaifligiga ega <em>qonuniy, imzolangan</em> drayverni (masalan, eski Gigabyte yoki ASUS firmware yangilagich) yuklaydi. U imzolanganligi sababli Windows uni yuklaydi. Hujumchi xatolikni ekspluatatsiya qilib, ixtiyoriy kernel manziliga shellcode yozadi — darhol ring 0 kod bajarish. Himoya: <code>loldrivers.io</code> ma'lum zaif drayverlar ro'yxatini e'lon qiladi. Ularni WDAC siyosati orqali bloklang.</>}
          </div>
        </div>
      </div>
      <Callout color="var(--c-attack)" icon="skull" titleUz="Real dunyo misoli: BlackByte ransomware BYOVD" titleEn="Real world: BlackByte ransomware BYOVD">
        {lang === "en"
          ? <>In 2022, the BlackByte ransomware gang used a vulnerable <code>RTCore64.sys</code> driver (from MSI Afterburner, a legitimate GPU overclocking tool) to disable EDR products before encrypting files. The driver was legitimately signed by Micro-Star International. Once loaded, BlackByte used the driver's arbitrary memory read/write primitive to kill antivirus processes from ring 0 — where no EDR hook could intercept them. This is exactly why BYOVD is one of the most powerful techniques available to attackers today.</>
          : <>2022 yilda BlackByte ransomware to'dasi fayllarga shifrlashdan oldin EDR mahsulotlarini o'chirish uchun zaif <code>RTCore64.sys</code> drayveri (qonuniy GPU overclocking vositasi MSI Afterburner'dan) dan foydalandi. Drayver Micro-Star International tomonidan qonuniy imzolangan edi. Yuklanganidan keyin BlackByte ring 0'dan — hech bir EDR hook'i ularni ushlay olmaydigan joydan — antivirus jarayonlarini o'ldirish uchun drayverning ixtiyoriy xotiraga o'qish/yozish primitividaridan foydalandi. Aynan shuning uchun BYOVD bugungi kunda hujumchilar uchun mavjud bo'lgan eng kuchli texnikalardan biridir.</>}
      </Callout>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// L03: User mode vs Kernel mode
// ─────────────────────────────────────────────────────────────
function SectionRings() {
  const lang = useLang();
  return (
    <section id="rings" style={{ scrollMarginTop: 80, marginBottom: 56 }}>
      <H2 num="01" uz="CPU Privilege Halqalari" en="CPU Privilege Rings" />
      <P>
        {lang === "en"
          ? <>Modern processors don't just execute code — they enforce <Term>privilege levels</Term> at the hardware level. The x86/x64 CPU architecture defines 4 rings (0 through 3), where ring 0 is the most privileged and ring 3 is the least. Windows only uses two: <Em>ring 0 (kernel mode)</Em> and <Em>ring 3 (user mode)</Em>. Rings 1 and 2 were intended for OS services like drivers in the original Intel design but were never adopted in practice — Windows moved drivers into ring 0 for performance reasons.</>
          : <>Zamonaviy protsessorlar faqat kod bajarmasdan, <Term>imtiyoz darajalarini</Term> hardware darajasida ham ta'minlaydi. x86/x64 CPU arxitekturasi 4 ta halqani (0 dan 3 gacha) belgilaydi: ring 0 — eng imtiyozli, ring 3 — eng kam imtiyozli. Windows faqat ikkitasidan foydalanadi: <Em>ring 0 (kernel mode)</Em> va <Em>ring 3 (user mode)</Em>. Ring 1 va 2 dastlabki Intel dizaynida OS xizmatlari va drayverlar uchun mo'ljallangan, lekin amalda hech qachon qabul qilinmagan — Windows drayverlarni ishlash tezligi sabab ring 0 ga ko'chirdi.</>}
      </P>

      {/* Visual ring diagram */}
      <div style={{ margin: "28px auto", maxWidth: 400, position: "relative", textAlign: "center" }}>
        <div style={{ position: "relative", display: "inline-block", width: 340, height: 340 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(255,145,69,0.45)", background: "rgba(255,145,69,0.04)" }}>
            <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--c-user)", letterSpacing: 0.1, whiteSpace: "nowrap" }}>ring 3 · User mode · CPL=3</div>
            <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", fontSize: 10, fontFamily: "var(--font-mono)", color: "rgba(255,145,69,0.6)", whiteSpace: "nowrap" }}>Chrome · Notepad · cmd.exe · Python</div>
          </div>
          <div style={{ position: "absolute", inset: 44, borderRadius: "50%", border: "1px dashed rgba(100,100,120,0.3)", background: "rgba(100,100,120,0.02)" }}>
            <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", fontSize: 9.5, fontFamily: "var(--font-mono)", color: "var(--text-3)", whiteSpace: "nowrap" }}>ring 1 & 2 · unused in Windows</div>
          </div>
          <div style={{ position: "absolute", inset: 96, borderRadius: "50%", border: "2px solid rgba(77,139,255,0.65)", background: "rgba(77,139,255,0.09)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--c-system)", letterSpacing: 0.1 }}>ring 0 · CPL=0</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--c-system)", marginTop: 3 }}>Kernel mode</div>
              <div style={{ fontSize: 10, color: "var(--text-2)", marginTop: 3 }}>ntoskrnl.exe · hal.dll</div>
              <div style={{ fontSize: 9.5, color: "var(--text-3)", marginTop: 2 }}>drivers (.sys)</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ padding: "18px 20px", background: "rgba(255,145,69,0.06)", border: "1px solid rgba(255,145,69,0.25)", borderRadius: 12 }}>
          <div className="mono" style={{ fontSize: 10, color: "var(--c-user)", marginBottom: 10, letterSpacing: 0.1 }}>RING 3 · USER MODE · CPL=3</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "var(--text-1)", lineHeight: 1.75 }}>
            {(lang === "en" ? [
              "Cannot access hardware I/O ports directly",
              "Cannot read or write another process's memory",
              "Cannot execute privileged CPU instructions",
              "Cannot modify CPU control registers (CR0, CR3...)",
              "Cannot load/modify the interrupt table (LIDT)",
              "App crash → only that process dies (Access Violation)",
              "Each process lives in its own virtual address space",
            ] : [
              "Hardware I/O portlariga to'g'ridan-to'g'ri kira olmaydi",
              "Boshqa jarayonning xotirasini o'qib yoki yoza olmaydi",
              "Imtiyozli CPU buyruqlarini bajara olmaydi",
              "CPU nazorat registrlarini (CR0, CR3...) o'zgartira olmaydi",
              "Uzilish jadvalini (LIDT) yuklab/o'zgartira olmaydi",
              "Ilova xatosi → faqat o'sha jarayon o'ladi (Access Violation)",
              "Har bir jarayon o'z virtual manzil maydonida yashaydi",
            ]).map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
        <div style={{ padding: "18px 20px", background: "rgba(77,139,255,0.06)", border: "1px solid rgba(77,139,255,0.25)", borderRadius: 12 }}>
          <div className="mono" style={{ fontSize: 10, color: "var(--c-system)", marginBottom: 10, letterSpacing: 0.1 }}>RING 0 · KERNEL MODE · CPL=0</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "var(--text-1)", lineHeight: 1.75 }}>
            {(lang === "en" ? [
              "Direct access to all hardware I/O ports",
              "Can read/write any memory address in the system",
              "All CPU instructions available without restriction",
              "Can modify CR0 (enable/disable paging), CR3 (page table base)",
              "Can load the GDT, IDT, LDT — restructure CPU entirely",
              "Crash here = BSOD (Blue Screen), entire machine halts",
              "Kernel's memory is mapped into every process's address space",
            ] : [
              "Barcha hardware I/O portlariga to'g'ridan-to'g'ri kirish",
              "Tizimdagi istalgan xotira manziliga o'qish/yozish",
              "Barcha CPU buyruqlari cheklovsiz mavjud",
              "CR0 (sahifani yoqish/o'chirish), CR3 (sahifa jadvali) ni o'zgartirish",
              "GDT, IDT, LDT ni yuklash — CPU'ni to'liq qayta tuzish",
              "Bu yerda xato = BSOD (Ko'k ekran), butun mashina to'xtaydi",
              "Kernelning xotirasi har bir jarayonning manzil maydoniga ko'chirilgan",
            ]).map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
      </div>

      {/* CPL mechanism — HOW the CPU enforces it */}
      <div style={{ marginTop: 40, marginBottom: 8 }}>
        <h3 style={subhead}>{lang === "en" ? "1.1 — CPL: How the CPU actually enforces the boundary" : "1.1 — CPL: Protsessor chegarani qanday ta'minlaydi"}</h3>
      </div>
      <P>
        {lang === "en"
          ? <>This is not software enforcement — it is baked into the silicon. Every time the CPU fetches an instruction, it checks the <Term>Current Privilege Level (CPL)</Term>. The CPL is stored in bits 0–1 of the <code>CS</code> (Code Segment) register. <code>CS = 0x0008</code> → bits 0–1 are <code>00</code> → CPL=0 (kernel). <code>CS = 0x0033</code> → bits 0–1 are <code>11</code> → CPL=3 (user). The CPU reads this on every instruction fetch and enforces privilege automatically — no software needed.</>
          : <>Bu dasturiy ta'minot tomonidan emas, balki silicon'ning o'zida amalga oshiriladi. CPU har bir buyruqni olishda <Term>Joriy Imtiyoz Darajasini (CPL)</Term> tekshiradi. CPL <code>CS</code> (Code Segment) registrining 0–1 bitlarida saqlanadi. <code>CS = 0x0008</code> → bitlar 0–1 = <code>00</code> → CPL=0 (kernel). <code>CS = 0x0033</code> → bitlar 0–1 = <code>11</code> → CPL=3 (foydalanuvchi). CPU har bir buyruq olishda buni o'qiydi va imtiyozni avtomatik ta'minlaydi — hech qanday dasturiy ta'minot kerak emas.</>}
      </P>

      <div style={{ marginTop: 18, padding: "20px 24px", background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 14 }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>// {lang === "en" ? "CPL IN THE CS REGISTER" : "CS REGISTRIDAGI CPL"}</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, lineHeight: 2, color: "var(--text-1)" }}>
          <div><span style={{ color: "var(--c-system)" }}>CS = 0x0008</span>  <span style={{ color: "var(--text-3)" }}>→</span>  <span style={{ color: "var(--text-2)" }}>binary: </span><span style={{ color: "var(--accent)" }}>0000 0000 0000 10</span><span style={{ color: "var(--c-system)", fontWeight: 700 }}>00</span>  <span style={{ color: "var(--text-3)" }}>→</span>  <span style={{ color: "var(--c-system)" }}>CPL=0 (kernel mode)</span></div>
          <div><span style={{ color: "var(--c-user)" }}>CS = 0x0033</span>  <span style={{ color: "var(--text-3)" }}>→</span>  <span style={{ color: "var(--text-2)" }}>binary: </span><span style={{ color: "var(--accent)" }}>0000 0000 0011 00</span><span style={{ color: "var(--c-user)", fontWeight: 700 }}>11</span>  <span style={{ color: "var(--text-3)" }}>→</span>  <span style={{ color: "var(--c-user)" }}>CPL=3 (user mode)</span></div>
        </div>
        <div style={{ marginTop: 10, fontSize: 12, color: "var(--text-2)", lineHeight: 1.6 }}>
          {lang === "en"
            ? "The CPU reads the last 2 bits of CS on every instruction. No instruction in ring 3 can set CS.CPL=0 directly — that's the whole point."
            : "CPU har bir buyruqda CS ning oxirgi 2 bitini o'qiydi. Ring 3'dagi hech bir buyruq CS.CPL=0 ni to'g'ridan-to'g'ri o'rnata olmaydi — asosiy nuqta aynan shu."}
        </div>
      </div>

      <h3 style={{ ...subhead, marginTop: 36 }}>{lang === "en" ? "1.2 — Privileged instructions and what happens when ring 3 tries to use them" : "1.2 — Imtiyozli buyruqlar va ring 3 ularni ishlatmoqchi bo'lsa nima bo'ladi"}</h3>
      <P>
        {lang === "en"
          ? <>Some CPU instructions are <Em>only allowed when CPL=0</Em>. If ring 3 code tries to execute one, the CPU immediately raises a <Term>General Protection Fault (#GP, exception 13)</Term>. Windows catches this exception via its Interrupt Descriptor Table (IDT) handler, and then terminates the offending process with an <Em>Access Violation</Em> (0xC0000005). The rest of the system keeps running unaffected.</>
          : <>Ba'zi CPU buyruqlari faqat CPL=0 bo'lganda ruxsat etiladi. Ring 3 kodi ulardan birini bajarmoqchi bo'lsa, CPU darhol <Term>Umumiy Himoya Xatosi (#GP, istisno 13)</Term> ni beradi. Windows buni Interrupt Descriptor Table (IDT) ishlovchisi orqali ushlab, xato qilgan jarayonni <Em>Access Violation</Em> (0xC0000005) bilan tugatadi. Tizimning qolgan qismi ta'sirlanmagan holda ishlashda davom etadi.</>}
      </P>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginTop: 16 }}>
        {(lang === "en" ? [
          { inst: "HLT", desc: "Halt the processor — stops all execution until next interrupt. Only the OS scheduler should call this (on idle)." },
          { inst: "LGDT / LIDT", desc: "Load the Global/Interrupt Descriptor Table — defines memory segments and all interrupt handlers. Writable only by the kernel." },
          { inst: "MOV CR0–CR4", desc: "Modify CPU control registers: CR0 enables paging, CR3 points to the page table, CR4 enables features like SMEP/SMAP." },
          { inst: "WRMSR / RDMSR", desc: "Write/Read Model-Specific Registers — configure CPU features like SYSCALL entry point (LSTAR MSR), performance counters, etc." },
          { inst: "IN / OUT", desc: "Direct I/O port access — talk to hardware (keyboard controller, PCI bus, etc.) without going through the driver model." },
          { inst: "CLI / STI", desc: "Clear/Set the Interrupt Flag — disable or enable hardware interrupts globally. Misuse freezes the entire machine." },
        ] : [
          { inst: "HLT", desc: "Protsessorni to'xtatish — keyingi uzilishgacha barcha bajarishni to'xtatadi. Faqat OS rejalashtirgichi (bo'sh paytda) chaqirishi kerak." },
          { inst: "LGDT / LIDT", desc: "Global/Interrupt Descriptor Jadvalini yuklash — xotira segmentlari va barcha uzilish ishlovchilarini belgilaydi. Faqat kernel yoza oladi." },
          { inst: "MOV CR0–CR4", desc: "CPU nazorat registrlarini o'zgartirish: CR0 sahifani yoqadi, CR3 sahifa jadvaliga ishora qiladi, CR4 SMEP/SMAP kabi xususiyatlarni yoqadi." },
          { inst: "WRMSR / RDMSR", desc: "Modelga xos registrlarni yozish/o'qish — SYSCALL kirish nuqtasi (LSTAR MSR), ishlash o'lchovlari kabi CPU xususiyatlarini sozlash." },
          { inst: "IN / OUT", desc: "To'g'ridan-to'g'ri I/O port kirishini — drayver modeli orqali o'tmasdan hardware bilan gaplashish (klaviatura kontrolleri, PCI avtobus va h.k.)." },
          { inst: "CLI / STI", desc: "Uzilish bayrog'ini tozalash/o'rnatish — hardware uzilishlarini butun tizim darajasida o'chirish yoki yoqish. Noto'g'ri foydalanish mashinani muzlatadi." },
        ]).map((r, i) => (
          <div key={i} style={{ padding: "12px 16px", background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 10, borderLeft: "3px solid var(--c-system)" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--c-system)", fontWeight: 700, marginBottom: 5 }}>{r.inst}</div>
            <div style={{ fontSize: 12.5, color: "var(--text-1)", lineHeight: 1.55 }}>{r.desc}</div>
          </div>
        ))}
      </div>

      <h3 style={{ ...subhead, marginTop: 36 }}>{lang === "en" ? "1.3 — What happens step by step when ring 3 breaks the rule" : "1.3 — Ring 3 qoidani buzganda nima sodir bo'ladi — bosqichma-bosqich"}</h3>

      <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
        {(lang === "en" ? [
          { n: "1", color: "var(--c-user)", title: "Ring 3 code executes privileged instruction", desc: "e.g. a Python script calls HLT or tries to write to CR3. The CPU starts the instruction..." },
          { n: "2", color: "var(--c-attack)", title: "CPU hardware checks CPL", desc: "Before completing the instruction, the CPU compares CPL (=3) against the required privilege level (=0). Mismatch detected." },
          { n: "3", color: "var(--c-attack)", title: "#GP fault triggered (exception 13)", desc: "The CPU immediately stops and raises a General Protection Fault. No instruction is executed. Control transfers to the OS's IDT handler." },
          { n: "4", color: "var(--c-warn)", title: "Windows exception handler catches #GP", desc: "ntoskrnl's IDT entry for exception 13 runs in ring 0. It identifies the faulting process and prepares to terminate it." },
          { n: "5", color: "var(--accent)", title: "Process terminated with Access Violation", desc: "The offending process receives EXCEPTION_ACCESS_VIOLATION (0xC0000005) and dies. The rest of the OS keeps running — that's the whole point of the boundary." },
        ] : [
          { n: "1", color: "var(--c-user)", title: "Ring 3 kodi imtiyozli buyruqni bajarmoqchi", desc: "Masalan, Python skript HLT ni chaqiradi yoki CR3 ga yozishga harakat qiladi. CPU buyruqni boshlamoqda..." },
          { n: "2", color: "var(--c-attack)", title: "CPU hardware CPL ni tekshiradi", desc: "Buyruqni tugatishdan oldin CPU CPL (=3) ni talab qilingan imtiyoz darajasi (=0) bilan solishtiradi. Nomuvofiqlik aniqlandi." },
          { n: "3", color: "var(--c-attack)", title: "#GP xatosi ishga tushadi (istisno 13)", desc: "CPU darhol to'xtatadi va Umumiy Himoya Xatosini beradi. Hech bir buyruq bajarilmaydi. Boshqaruv OS'ning IDT ishlovchisiga o'tadi." },
          { n: "4", color: "var(--c-warn)", title: "Windows istisno ishlovchisi #GP ni ushlaydi", desc: "ntoskrnl'ning 13-istisno uchun IDT yozuvi ring 0'da ishlaydi. U xato qilgan jarayonni aniqlaydi va tugatishga tayyorlanadi." },
          { n: "5", color: "var(--accent)", title: "Jarayon Access Violation bilan tugatiladi", desc: "Xato qilgan jarayon EXCEPTION_ACCESS_VIOLATION (0xC0000005) oladi va o'ladi. OS ning qolgan qismi ishlashda davom etadi — chegaraning butun mohiyati shu." },
        ]).map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: s.color + "18", border: `1.5px solid ${s.color}`, color: s.color, display: "grid", placeItems: "center", flexShrink: 0, fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 12 }}>{s.n}</div>
            <div style={{ paddingTop: 4, paddingBottom: 14, borderBottom: i < 4 ? "1px solid var(--border)" : "none", flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-0)", marginBottom: 3 }}>{s.title}</div>
              <div style={{ fontSize: 12.5, color: "var(--text-2)", lineHeight: 1.55 }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <Callout color="var(--c-warn)" icon="warning" titleUz="Nima uchun bu chegara zarur?" titleEn="Why does this boundary exist?">
        {lang === "en"
          ? <>Imagine if every app had full hardware access. A single buggy Chrome tab could execute <code>HLT</code> and freeze your CPU, or write to CR3 and corrupt the entire page table — crashing every process on the machine at once. The ring boundary, enforced in silicon, guarantees that no matter how broken or malicious an app is, it <Em>cannot</Em> directly harm the kernel or other processes. It can only harm itself.</>
          : <>Tasavvur qiling, har bir ilova to'liq hardware kirishiga ega bo'lsa. Bitta noto'g'ri Chrome yorlig'i <code>HLT</code> ni bajarib CPU'ni muzlatishi, yoki CR3 ga yozib butun sahifa jadvalini buzishi — shu bilan mashinalardagi barcha jarayonni bir vaqtda yiqitishi mumkin edi. Silicon'da amalga oshirilgan halqa chegarasi kafolatlaydi: ilova qanchalik buzilgan yoki zararli bo'lmasin, u kernelga yoki boshqa jarayonlarga <Em>to'g'ridan-to'g'ri</Em> zarar yetkazolmaydi. U faqat o'ziga zarar yetkazishi mumkin.</>}
      </Callout>
    </section>
  );
}

function SectionSyscallBrief() {
  const lang = useLang();
  return (
    <section id="syscall-brief" style={{ scrollMarginTop: 80, marginBottom: 56 }}>
      <H2 num="03" uz="Chegarani qonuniy kesib o'tish: SYSCALL mexanizmi" en="Legally crossing the boundary: the SYSCALL mechanism" />
      <P>
        {lang === "en"
          ? <>A user-mode app can never jump into kernel mode by itself — that would require changing CPL, which only the CPU hardware can do. The <Em>only</Em> legal trigger is the <Term>SYSCALL</Term> instruction (64-bit) or <Term>SYSENTER</Term> (32-bit). When executed, the CPU performs a precisely defined hardware sequence — not software, the actual silicon — in a single atomic step.</>
          : <>User mode'dagi ilova mustaqil ravishda kernel mode'ga sakray olmaydi — bu CPL ni o'zgartirishni talab qiladi, buni esa faqat CPU hardware'i qila oladi. Yagona qonuniy trigger — <Term>SYSCALL</Term> buyrug'i (64-bit) yoki <Term>SYSENTER</Term> (32-bit). Bajarilganda, CPU aniq belgilangan hardware ketma-ketligini amalga oshiradi — dasturiy ta'minot emas, haqiqiy silicon — bitta atomik qadamda.</>}
      </P>

      <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 10 }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>// {lang === "en" ? "WHAT THE CPU DOES WHEN SYSCALL EXECUTES" : "SYSCALL BAJARILGANDA CPU NIMA QILADI"}</div>
        {(lang === "en" ? [
          { n: "1", color: "var(--c-user)", title: "Save user-mode state (RIP, RSP, RFLAGS)", desc: <>The CPU saves the current instruction pointer (<code>RIP</code>), stack pointer (<code>RSP</code>), and flags register (<code>RFLAGS</code>) into CPU registers (<code>RCX</code>, <code>R11</code>). This is where execution will resume when we return to ring 3.</> },
          { n: "2", color: "var(--c-warn)", title: "Switch CPL: 3 → 0 (the only legal way)", desc: <>The CPU sets <code>CS.CPL = 0</code>, loading the kernel CS selector (<code>0x0010</code>). This is the moment privilege changes. No user-mode code can do this — only the SYSCALL instruction triggers this hardware behavior.</> },
          { n: "3", color: "var(--c-warn)", title: "Switch to kernel stack", desc: <>The CPU loads a new stack pointer from the <code>TSS (Task State Segment)</code> — a kernel stack, not the user stack. This is critical for security: the kernel must never trust the user's stack.</> },
          { n: "4", color: "var(--c-system)", title: "Jump to kernel entry point (LSTAR MSR)", desc: <>The CPU loads <code>RIP</code> from the <code>LSTAR</code> Model-Specific Register, which Windows sets at boot to point to <code>KiSystemCall64</code> inside ntoskrnl.exe. This is the entry point for all system calls.</> },
          { n: "5", color: "var(--c-system)", title: "Kernel reads syscall number, dispatches", desc: <>The <code>EAX</code> register contains the <Em>syscall number</Em> (e.g. 0x0018 = NtReadFile). The kernel looks it up in the <Term>SSDT (System Service Descriptor Table)</Term> and calls the corresponding function.</> },
          { n: "6", color: "var(--accent)", title: "SYSRET: return to ring 3", desc: <>When done, the kernel executes <code>SYSRET</code>. The CPU restores <code>RIP</code>, <code>RSP</code>, <code>RFLAGS</code> from the saved values, sets <code>CS.CPL = 3</code>, and resumes the user-mode code exactly where it stopped.</> },
        ] : [
          { n: "1", color: "var(--c-user)", title: "User mode holatini saqlash (RIP, RSP, RFLAGS)", desc: <>CPU joriy ko'rsatma ko'rsatkichini (<code>RIP</code>), stek ko'rsatkichini (<code>RSP</code>) va bayroqlar registrini (<code>RFLAGS</code>) CPU registrlarida saqlaydi (<code>RCX</code>, <code>R11</code>). Ring 3 ga qaytganda bajarish shu yerdan davom etadi.</> },
          { n: "2", color: "var(--c-warn)", title: "CPL almashtirish: 3 → 0 (yagona qonuniy yo'l)", desc: <>CPU <code>CS.CPL = 0</code> o'rnatadi, kernel CS selektorini (<code>0x0010</code>) yuklaydi. Bu imtiyoz o'zgaradigan lahza. Hech bir user-mode kodi buni qila olmaydi — faqat SYSCALL buyrug'i bu hardware xatti-harakatini ishga tushiradi.</> },
          { n: "3", color: "var(--c-warn)", title: "Kernel stekiga o'tish", desc: <>CPU yangi stek ko'rsatkichini <code>TSS (Task State Segment)</code> dan yuklaydi — user steki emas, kernel steki. Bu xavfsizlik uchun muhim: kernel foydalanuvchi stekiga hech qachon ishonmasligi kerak.</> },
          { n: "4", color: "var(--c-system)", title: "Kernel kirish nuqtasiga o'tish (LSTAR MSR)", desc: <>CPU <code>RIP</code> ni <code>LSTAR</code> Model-Specific Registridan yuklaydi — Windows uni boot vaqtida ntoskrnl.exe ichidagi <code>KiSystemCall64</code> ga ishora qilib o'rnatadi. Bu barcha tizim chaqiruvlari uchun kirish nuqtasi.</> },
          { n: "5", color: "var(--c-system)", title: "Kernel syscall raqamini o'qiydi va yo'naltiradi", desc: <><code>EAX</code> registri <Em>syscall raqamini</Em> o'z ichiga oladi (masalan 0x0018 = NtReadFile). Kernel uni <Term>SSDT (Tizim Xizmat Tasviri Jadvali)</Term> dan qidirib, mos funksiyani chaqiradi.</> },
          { n: "6", color: "var(--accent)", title: "SYSRET: ring 3 ga qaytish", desc: <>Tugatgach, kernel <code>SYSRET</code> ni bajaradi. CPU saqlangan qiymatlardan <code>RIP</code>, <code>RSP</code>, <code>RFLAGS</code> ni tiklaydi, <code>CS.CPL = 3</code> o'rnatadi va user-mode kodini to'xtatilgan joydan davom ettiradi.</> },
        ]).map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: s.color + "18", border: `1.5px solid ${s.color}`, color: s.color, display: "grid", placeItems: "center", fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 12 }}>{s.n}</div>
              {i < 5 && <div style={{ width: 2, flex: 1, minHeight: 14, background: `linear-gradient(180deg, ${s.color}66, transparent)`, marginTop: 3 }} />}
            </div>
            <div style={{ paddingBottom: 16, flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-0)", marginBottom: 3 }}>{s.title}</div>
              <div style={{ fontSize: 12.5, color: "var(--text-2)", lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, padding: "18px 22px", background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 14 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>// {lang === "en" ? "SYSCALL NUMBER TABLE (partial)" : "SYSCALL RAQAMLARI JADVALI (qisqacha)"}</div>
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr", gap: "6px 20px", fontFamily: "var(--font-mono)", fontSize: 12 }}>
          {[
            ["0x0004", "NtWriteFile", "Faylga yozish"],
            ["0x000F", "NtClose", "Handle'ni yopish"],
            ["0x0018", "NtReadFile", "Fayldan o'qish"],
            ["0x0023", "NtOpenFile", "Faylni ochish"],
            ["0x0039", "NtCreateProcess", "Jarayon yaratish"],
            ["0x0055", "NtAllocateVirtualMemory", "Virtual xotira ajratish"],
          ].map(([num, en, uz], i) => (
            <React.Fragment key={i}>
              <span style={{ color: "var(--c-warn)" }}>{num}</span>
              <span style={{ color: "var(--accent)" }}>{en}</span>
              <span style={{ color: "var(--text-2)" }}>{lang === "en" ? en.replace("Nt","").replace(/([A-Z])/g," $1").trim() : uz}</span>
            </React.Fragment>
          ))}
        </div>
        <div style={{ marginTop: 12, fontSize: 12, color: "var(--text-3)", lineHeight: 1.6 }}>
          {lang === "en"
            ? "Windows has ~450 syscalls total. Every privileged action your app performs — opening a file, creating a process, allocating memory — goes through one of these numbers."
            : "Windows jami ~450 ta syscallga ega. Ilovangiz bajaradigan har bir imtiyozli amal — fayl ochish, jarayon yaratish, xotira ajratish — shu raqamlardan biri orqali o'tadi."}
        </div>
      </div>

      <Callout color="var(--c-attack)" icon="skull" titleUz="Xavfsizlik: to'g'ridan-to'g'ri syscall va EDR chetlab o'tish" titleEn="Security: direct syscalls and EDR bypass">
        {lang === "en"
          ? <>Security tools (EDR, antivirus) detect malware by placing <Em>hooks</Em> inside <code>ntdll.dll</code> — they overwrite the first few bytes of functions like <code>NtReadFile</code> with a jump to their own monitoring code. Advanced malware bypasses this by:<br/>1. Finding the syscall number for the target function directly (by scanning ntdll in memory or hardcoding it)<br/>2. Loading that number into <code>EAX</code><br/>3. Calling the <code>syscall</code> instruction directly — skipping the hooked ntdll function entirely<br/>This is called <strong>direct syscalls</strong> (or <strong>Hell's Gate / Halo's Gate</strong> in advanced implementations). The EDR never sees the call because it only monitors ntdll, not the raw syscall gate.</>
          : <>Xavfsizlik tizimlari (EDR, antivirus) malware'ni <code>ntdll.dll</code> ichiga <Em>hook</Em> joylashtirish orqali aniqlaydi — ular <code>NtReadFile</code> kabi funksiyalarning birinchi bir necha baytini o'z monitoring kodiga sakrash bilan almashtiradi. Rivojlangan malware buni chetlab o'tadi:<br/>1. Maqsad funksiya uchun syscall raqamini to'g'ridan-to'g'ri topib (ntdll'ni xotirada skanerlash yoki hardcode qilish orqali)<br/>2. Shu raqamni <code>EAX</code> ga yuklaydi<br/>3. <code>syscall</code> buyrug'ini to'g'ridan-to'g'ri chaqiradi — ushlangan ntdll funksiyasini butunlay o'tkazib yuboradi<br/>Bu <strong>to'g'ridan-to'g'ri syscall</strong> (yoki murakkab implementatsiyalarda <strong>Hell's Gate / Halo's Gate</strong>) deyiladi. EDR bu chaqiruvni hech qachon ko'rmaydi, chunki u faqat ntdll'ni kuzatadi, xom syscall gate'ni emas.</>}
      </Callout>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// L05: BIOS vs UEFI
// ─────────────────────────────────────────────────────────────
function SectionBiosUefi() {
  const lang = useLang();

  const compRows = [
    {
      aspect: lang === "en" ? "Architecture" : "Arxitektura",
      bios: lang === "en" ? "16-bit x86 real mode. Runs from ROM chip. Max 1 MB addressable memory." : "16-bit x86 real mode. ROM chipidan ishlaydi. Maksimal 1 MB manzillanuvchi xotira.",
      uefi: lang === "en" ? "32/64-bit protected/long mode. Runs from SPI flash. Full memory access, own C-based drivers (DXE)." : "32/64-bit himoyalangan/uzun rejim. SPI flashdan ishlaydi. To'liq xotiraga kirish, o'z C-asosidagi drayverlar (DXE).",
    },
    {
      aspect: lang === "en" ? "Boot target" : "Yuklash maqsadi",
      bios: lang === "en" ? "MBR (Master Boot Record) — first 512 bytes of disk. 446 bytes bootloader + 64 bytes partition table + 0x55AA signature." : "MBR (Master Boot Record) — diskning birinchi 512 bayt. 446 bayt bootloader + 64 bayt bo'limlar jadvali + 0x55AA imzo.",
      uefi: lang === "en" ? "EFI System Partition (ESP) — FAT32 partition with .efi files. Bootloader is a full EFI application (e.g. bootmgr.efi, grubx64.efi)." : "EFI System Partition (ESP) — .efi fayllari bilan FAT32 bo'limi. Bootloader to'liq EFI ilovasi (masalan, bootmgr.efi, grubx64.efi).",
    },
    {
      aspect: lang === "en" ? "Partition table" : "Bo'lim jadvali",
      bios: lang === "en" ? "MBR: max 4 primary partitions, max 2 TB disk, 32-bit LBA addressing." : "MBR: maksimal 4 ta asosiy bo'lim, maksimal 2 TB disk, 32-bit LBA manzillash.",
      uefi: lang === "en" ? "GPT (GUID Partition Table): 128 partitions, up to 9.4 ZB disk, 64-bit LBA. Each partition has a unique GUID." : "GPT (GUID Partition Table): 128 bo'lim, 9.4 ZB gacha disk, 64-bit LBA. Har bir bo'limning o'ziga xos GUID'i bor.",
    },
    {
      aspect: lang === "en" ? "Initialisation speed" : "Ishga tushirish tezligi",
      bios: lang === "en" ? "Sequential: devices init one by one. Slower POST." : "Ketma-ket: qurilmalar birma-bir ishga tushiriladi. Sekinroq POST.",
      uefi: lang === "en" ? "Parallel: devices init simultaneously. Fast Boot skips some checks entirely. Boots 2–3× faster than BIOS." : "Parallel: qurilmalar bir vaqtda ishga tushiriladi. Fast Boot ba'zi tekshiruvlarni butunlay o'tkazib yuboradi. BIOS dan 2–3× tezroq yuklaydi.",
    },
    {
      aspect: lang === "en" ? "Secure Boot" : "Xavfsiz Yuklash",
      bios: lang === "en" ? "Not supported. No cryptographic verification of bootloader — any code on the first sector runs unchecked." : "Qo'llab-quvvatlanmaydi. Bootloader'ning kriptografik tekshiruvi yo'q — birinchi sektordagi har qanday kod tekshirilmasdan ishlaydi.",
      uefi: lang === "en" ? "Built-in. db/dbx certificate databases. RSA-2048 + SHA-256 chain from firmware → bootloader → kernel → drivers." : "Ichki. db/dbx sertifikat ma'lumotlar bazalari. Firmware → bootloader → kernel → drayverlargacha RSA-2048 + SHA-256 zanjiri.",
    },
    {
      aspect: lang === "en" ? "UI / Shell" : "UI / Shell",
      bios: lang === "en" ? "Text-only. No mouse. Navigated with keyboard only. No networking, no scripting." : "Faqat matn. Sichqoncha yo'q. Faqat klaviatura bilan boshqariladi. Tarmoq yo'q, skript yo'q.",
      uefi: lang === "en" ? "Optional GUI with mouse support. UEFI Shell (full CLI with scripting). Network boot (PXE) and HTTPS boot built in." : "Sichqoncha qo'llab-quvvatlash bilan ixtiyoriy GUI. UEFI Shell (skript bilan to'liq CLI). Tarmoqdan yuklash (PXE) va HTTPS yuklash ichida.",
    },
    {
      aspect: lang === "en" ? "OS disk size limit" : "OS disk hajmi chegarasi",
      bios: lang === "en" ? "2 TB (MBR 32-bit LBA). Disks larger than 2 TB require GPT regardless of firmware." : "2 TB (MBR 32-bit LBA). 2 TB dan katta disklar firmware'dan qat'i nazar GPT talab qiladi.",
      uefi: lang === "en" ? "9.4 ZB (GPT 64-bit LBA). Effectively unlimited for any foreseeable hardware." : "9.4 ZB (GPT 64-bit LBA). Ko'zga ko'rinadigan har qanday hardware uchun amalda cheksiz.",
    },
    {
      aspect: lang === "en" ? "Security model" : "Xavfsizlik modeli",
      bios: lang === "en" ? "None. Any code loaded from MBR runs with full CPU privilege. No attestation, no signing." : "Yo'q. MBR dan yuklangan har qanday kod to'liq CPU imtiyozi bilan ishlaydi. Tasdiqlov yo'q, imzolash yo'q.",
      uefi: lang === "en" ? "Measured Boot (TPM records hashes), Secure Boot (signature chain), firmware update authentication, runtime DXE services for privileged operations." : "Measured Boot (TPM xeshlarni qayd etadi), Secure Boot (imzo zanjiri), firmware yangilash autentifikatsiyasi, imtiyozli amallar uchun runtime DXE xizmatlar.",
    },
  ];

  const biosChart = `
flowchart TD
    A([Power on]) --> B[CPU jumps to\\nROM 0xFFFFFFF0]
    B --> C[BIOS POST\\nhardware check]
    C --> D[Read MBR\\nfirst 512 bytes of disk]
    D --> E{0x55AA\\nsignature?}
    E -->|Yes| F[Execute 446-byte\\nbootloader code]
    E -->|No| G([Boot error])
    F --> H[Load OS\\nno verification]

    style A fill:#1a2342,stroke:#4d8bff,color:#fff
    style G fill:#3a0a1a,stroke:#ff3a5e,color:#fff
    style H fill:#1a2342,stroke:#4d8bff,color:#fff
  `;

  const uefiChart = `
flowchart TD
    A([Power on]) --> B[SEC phase\\nCPU cache-as-RAM]
    B --> C[PEI phase\\nRAM init + platform init]
    C --> D[DXE phase\\nload EFI drivers]
    D --> E[BDS phase\\nboot device selection]
    E --> F{Secure Boot\\ncheck ESP .efi}
    F -->|Signed OK| G[bootmgr.efi\\nloads OS loader]
    F -->|Fail| H([Boot blocked])
    G --> I[OS loader\\nwith full UEFI services]

    style A fill:#1a2342,stroke:#4d8bff,color:#fff
    style H fill:#3a0a1a,stroke:#ff3a5e,color:#fff
    style I fill:#0a3a1f,stroke:#00ff9c,color:#fff
    style F fill:#2a1f3a,stroke:#b88cff,color:#fff
  `;

  return (
    <section id="bios-uefi" style={{ scrollMarginTop: 80, marginBottom: 56 }}>
      <H2 num="01" uz="BIOS va UEFI nima?" en="What are BIOS and UEFI?" />
      <P>
        {lang === "en"
          ? <>Before the operating system can load, something must wake up the CPU, test the hardware, and hand control to the bootloader. That something is the <Term>firmware</Term> — software permanently stored in a chip on the motherboard. For 30 years it was <Em>BIOS</Em>; since ~2007 it has been replaced by <Em>UEFI</Em>. Understanding the difference matters for security because the firmware runs before any OS protection — a compromised firmware bypasses Secure Boot, TPM, and BitLocker entirely.</>
          : <>Operatsion tizim yuklanishidan oldin, biror narsa CPU ni uyg'otishi, hardware ni sinab ko'rishi va boshqaruvni bootloader'ga topshirishi kerak. Bu narsa — <Term>firmware</Term>: ona platadagi chipda doimiy saqlanadigan dasturiy ta'minot. 30 yil davomida bu <Em>BIOS</Em> edi; ~2007 yildan boshlab u <Em>UEFI</Em> bilan almashtirildi. Farqni tushunish xavfsizlik uchun muhim, chunki firmware har qanday OS himoyasidan oldin ishlaydi — buzilgan firmware Secure Boot, TPM va BitLocker'ni butunlay chetlab o'tadi.</>}
      </P>

      {/* ── BIOS ── */}
      <h3 style={subhead}>{lang === "en" ? "1.1 — BIOS: the legacy firmware (1975–present)" : "1.1 — BIOS: eski avlod firmware (1975-hozir)"}</h3>
      <P>
        {lang === "en"
          ? <><Term>BIOS (Basic Input/Output System)</Term> was created for the original IBM PC in 1975 and has remained fundamentally unchanged since. It lives in a small ROM (Read-Only Memory) chip on the motherboard and is the first code the CPU executes after power-on. The CPU always starts at a fixed address — <code>0xFFFFFFF0</code> (the top of the 4 GB address space, reset vector) — and the ROM chip is mapped there. BIOS runs in <Em>16-bit x86 real mode</Em>, which means it can only address 1 MB of memory (20-bit address bus), cannot use protected-mode features, and runs as if it were a DOS-era program — no virtual memory, no privilege rings, no memory protection.</>
          : <><Term>BIOS (Basic Input/Output System)</Term> 1975 yilda asl IBM PC uchun yaratilgan va o'shandan beri asosan o'zgarmagan. U ona platadagi kichik ROM (Read-Only Memory) chipida yashaydi va CPU quvvat yoqilgandan keyin bajariladigan birinchi kod. CPU har doim qat'iy manzildan boshlanadi — <code>0xFFFFFFF0</code> (4 GB manzil maydonining yuqori qismi, reset vektori) — va ROM chipi u yerga xaritalangan. BIOS <Em>16-bit x86 real rejimida</Em> ishlaydi, ya'ni faqat 1 MB xotirani (20-bit manzil avtobusi) manzillashi mumkin, himoyalangan rejim xususiyatlaridan foydalana olmaydi va DOS davrida dastur kabi ishlaydi — virtual xotira yo'q, imtiyoz halqalari yo'q, xotira himoyasi yo'q.</>}
      </P>
      <P>
        {lang === "en"
          ? <><Em>POST (Power-On Self Test)</Em> runs first — BIOS checks that RAM is present and working, CPU and FPU are functioning, keyboard controller is responding, and all configured peripherals are reachable. Then BIOS reads the <Em>MBR (Master Boot Record)</Em> from the first 512 bytes of the boot disk. The MBR layout is fixed: the first 446 bytes contain the <Em>bootstrap code</Em> (the tiny bootloader), bytes 446–509 contain the <Em>partition table</Em> (up to 4 primary partition entries of 16 bytes each), and the last 2 bytes must be <code>0x55AA</code> — the boot signature. If the signature matches, BIOS jumps to the bootstrap code and executes it — <Em>with no verification whatsoever</Em>.</>
          : <><Em>POST (Power-On Self Test)</Em> birinchi ishlaydi — BIOS RAM mavjud va ishlayotganini, CPU va FPU ishlayotganini, klaviatura kontrolleri javob berayotganini va barcha sozlangan qurilmalarga erishish mumkinligini tekshiradi. Keyin BIOS yuklash diskining birinchi 512 baytidan <Em>MBR (Master Boot Record)</Em> ni o'qiydi. MBR joylashuvi qat'iy: birinchi 446 bayt <Em>bootstrap kod</Em> (kichik bootloader) ni o'z ichiga oladi, 446-509-baytlar <Em>bo'limlar jadvalini</Em> (har biri 16 baytdan 4 tagacha asosiy bo'lim yozuvi), va oxirgi 2 bayt <code>0x55AA</code> bo'lishi kerak — yuklash imzosi. Imzo mos kelsa, BIOS bootstrap kodga sakraydi va uni bajaradi — <Em>hech qanday tekshiruvsiz</Em>.</>}
      </P>

      <div style={{ margin: "18px 0", padding: "14px 18px", borderRadius: 10, background: "var(--bg-2)", border: "1px solid var(--border)", fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 1.8 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>// MBR LAYOUT — 512 bytes total (disk sector 0)</div>
        {[
          { range: "0x000–0x1BD", size: "446 bytes", label: "Bootstrap code", color: "var(--accent)", desc: lang === "en" ? "Tiny x86 machine code, loads the real bootloader" : "Kichik x86 mashina kodi, haqiqiy bootloaderni yuklaydi" },
          { range: "0x1BE–0x1FD", size: "64 bytes", label: "Partition table", color: "var(--c-system)", desc: lang === "en" ? "4 × 16-byte entries: type, LBA start, LBA size" : "4 × 16 baytli yozuv: tur, LBA boshi, LBA hajmi" },
          { range: "0x1FE–0x1FF", size: "2 bytes", label: "Boot signature", color: "var(--c-warn)", desc: lang === "en" ? "Must be 0x55AA — if not, BIOS halts" : "0x55AA bo'lishi kerak — aks holda BIOS to'xtaydi" },
        ].map((row, i) => (
          <div key={i} style={{ display: "flex", gap: 12, padding: "4px 0", borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}>
            <span style={{ color: row.color, minWidth: 120 }}>{row.range}</span>
            <span style={{ color: "var(--text-3)", minWidth: 70 }}>{row.size}</span>
            <span style={{ color: "var(--text-1)", minWidth: 120 }}>{row.label}</span>
            <span style={{ color: "var(--text-2)", fontSize: 11 }}>{row.desc}</span>
          </div>
        ))}
      </div>

      <Callout color="var(--c-attack)" icon="skull" titleUz="BIOS bootkit — MBR ga yozish" titleEn="BIOS bootkit — overwriting the MBR">
        {lang === "en"
          ? <>Because BIOS performs zero verification on the MBR bootstrap code, overwriting those 446 bytes is enough to control the entire boot sequence — before the OS, before any AV, before any security tool. Classic MBR bootkits: <strong>Mebroot/Sinowal</strong> (2007, first in-the-wild MBR rootkit), <strong>TDL4/Alureon</strong> (2010, survived OS reinstalls), <strong>Petya</strong> (2016, encrypted the MBR and held it for ransom). The fix was UEFI Secure Boot — but it only helps if Secure Boot is actually enabled and CSM/Legacy mode is disabled.</>
          : <>BIOS MBR bootstrap kodida nol tekshiruv amalga oshirgani uchun, o'sha 446 baytni yozib o'chirish — OS dan oldin, har qanday AV dan oldin, har qanday xavfsizlik vositasidan oldin — butun yuklash ketma-ketligini nazorat qilish uchun yetarli. Klassik MBR bootkit'lar: <strong>Mebroot/Sinowal</strong> (2007, birinchi real MBR rootkiti), <strong>TDL4/Alureon</strong> (2010, OS qayta o'rnatishlaridan omon qoldi), <strong>Petya</strong> (2016, MBR ni shifrladi va to'lov so'radi). Yechim UEFI Secure Boot edi — lekin faqat Secure Boot haqiqatan yoqilgan va CSM/Legacy rejim o'chirilgan bo'lsa ishlaydi.</>}
      </Callout>

      <div style={{ marginTop: 22 }}>
        <MermaidDiagram chart={biosChart}
          caption="1-rasm. BIOS yuklash ketma-ketligi: ROM → POST → MBR → bootloader (tekshiruvsiz)."
          captionEn="Fig 1. BIOS boot sequence: ROM → POST → MBR → bootloader (no verification)." />
      </div>

      {/* ── UEFI ── */}
      <h3 style={subhead}>{lang === "en" ? "1.2 — UEFI: modern firmware architecture" : "1.2 — UEFI: zamonaviy firmware arxitekturasi"}</h3>
      <P>
        {lang === "en"
          ? <><Term>UEFI (Unified Extensible Firmware Interface)</Term> was developed by Intel starting in 1998 (as EFI, then standardised as UEFI in 2007 by the UEFI Forum). Unlike BIOS, UEFI runs in <Em>32 or 64-bit protected/long mode</Em> from the start, giving it access to all RAM, the ability to load proper DXE (Driver eXecution Environment) drivers, and support for a real file system. UEFI firmware has four distinct phases:</>
          : <><Term>UEFI (Unified Extensible Firmware Interface)</Term> 1998 yildan boshlab Intel tomonidan (EFI sifatida, keyin 2007 yilda UEFI Forum tomonidan UEFI sifatida standartlashtirilgan) ishlab chiqilgan. BIOS dan farqli o'laroq, UEFI boshidanoq <Em>32 yoki 64-bit himoyalangan/uzun rejimda</Em> ishlaydi, bu unga barcha RAM ga kirish, to'g'ri DXE (Driver eXecution Environment) drayverlarini yuklash va haqiqiy fayl tizimini qo'llab-quvvatlash imkoniyatini beradi. UEFI firmwarening to'rtta alohida fazasi mavjud:</>}
      </P>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "16px 0" }}>
        {[
          { phase: "SEC", full: "Security Phase", color: "var(--c-auth)",
            bodyUz: "CPU ni xavfsiz holatga o'tkazadi, \"Cache-as-RAM\" (CAR) texnikasidan foydalangan holda L1/L2 keshini vaqtinchalik RAM sifatida ishlatadi (RAM hali ishga tushmagan), asosiy CPU ishga tushirishni amalga oshiradi.",
            bodyEn: "Puts CPU into a known-safe state, uses \"Cache-as-RAM\" (CAR) — treating L1/L2 cache as temporary RAM (since RAM isn't initialised yet), performs basic CPU initialisation." },
          { phase: "PEI", full: "Pre-EFI Initialisation", color: "var(--c-warn)",
            bodyUz: "RAM ni ishga tushiradi (DDR SPD ma'lumotlarini o'qib), platform qismlarini (PCH, DRAM kontrolleri) sozlaydi, barcha bosqichlar uchun platformaga xos ishga tushirishni amalga oshiradi.",
            bodyEn: "Initialises RAM (reads DDR SPD data), configures platform components (PCH, DRAM controller), performs platform-specific initialisation that all subsequent phases depend on." },
          { phase: "DXE", full: "Driver eXecution Environment", color: "var(--c-system)",
            bodyUz: "UEFI drayverlarini yuklaydi (EFI Protocol Interface orqali), to'liq xotiraga kirish bilan 64-bit muhitda ishlaydi, disk kontrollerlari, tarmoq kartalari, displey drayverlarini yuklaydi.",
            bodyEn: "Loads UEFI drivers (via EFI Protocol Interface), runs in full 64-bit environment with complete memory access, loads disk controllers, network cards, display drivers." },
          { phase: "BDS", full: "Boot Device Selection", color: "var(--accent)",
            bodyUz: "Yuklash qurilmalarini NVRAM roʻyxatidan o'qiydi (UEFI Boot#### o'zgaruvchilari), Secure Boot ni amalga oshiradi — ESP dagi .efi faylini imzoni db/dbx bilan tekshirib yuklaydi.",
            bodyEn: "Reads boot devices from NVRAM list (UEFI Boot#### variables), enforces Secure Boot — loads the .efi file from ESP after verifying its signature against db/dbx." },
        ].map((p, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 0, borderRadius: 10, overflow: "hidden", border: `1px solid ${p.color}30` }}>
            <div style={{ background: `${p.color}18`, borderRight: `2px solid ${p.color}50`, padding: "12px 14px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minWidth: 64 }}>
              <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: p.color }}>{p.phase}</div>
              <div className="mono" style={{ fontSize: 9, color: "var(--text-3)", textAlign: "center", marginTop: 2 }}>{p.full}</div>
            </div>
            <div style={{ padding: "12px 16px", background: `${p.color}05`, fontSize: 13, lineHeight: 1.7, color: "var(--text-1)" }}>
              {lang === "en" ? p.bodyEn : p.bodyUz}
            </div>
          </div>
        ))}
      </div>

      <P>
        {lang === "en"
          ? <>UEFI stores boot configuration in <Em>NVRAM (Non-Volatile RAM)</Em> — small flash memory on the motherboard. The boot order and each OS's bootloader path are stored as NVRAM variables (e.g. <code>Boot0001 = \EFI\Microsoft\Boot\bootmgfw.efi</code>). You can read and write these variables from the OS with the <code>bcdedit /set {"{fwbootmgr}"} displayorder</code> command or from Linux with <code>efibootmgr</code>.</>
          : <>UEFI yuklash konfiguratsiyasini <Em>NVRAM (Xotirada saqlanadigan o'zgaruvchan RAM)</Em> da saqlaydi — ona platadagi kichik flesh xotira. Yuklash tartibi va har bir OS ning bootloader yo'li NVRAM o'zgaruvchilari sifatida saqlanadi (masalan, <code>Boot0001 = \EFI\Microsoft\Boot\bootmgfw.efi</code>). Bu o'zgaruvchilarni OS dan <code>bcdedit /set {"{fwbootmgr}"} displayorder</code> buyrug'i yoki Linux da <code>efibootmgr</code> bilan o'qib va yozish mumkin.</>}
      </P>

      <div style={{ marginTop: 22 }}>
        <MermaidDiagram chart={uefiChart}
          caption="2-rasm. UEFI yuklash fazalari: SEC → PEI → DXE → BDS → Secure Boot tekshiruvi → bootmgr.efi."
          captionEn="Fig 2. UEFI boot phases: SEC → PEI → DXE → BDS → Secure Boot check → bootmgr.efi." />
      </div>

      {/* ── Comparison table ── */}
      <h3 style={subhead}>{lang === "en" ? "1.3 — BIOS vs UEFI: full comparison" : "1.3 — BIOS va UEFI: to'liq taqqoslash"}</h3>
      <div style={{ borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden", marginTop: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: "var(--bg-2)", borderBottom: "1px solid var(--border)" }}>
          <div style={{ padding: "10px 14px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, color: "var(--text-2)" }}>{lang === "en" ? "Aspect" : "Jihat"}</div>
          <div style={{ padding: "10px 14px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, color: "var(--c-warn)", borderLeft: "1px solid var(--border)" }}>BIOS</div>
          <div style={{ padding: "10px 14px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, color: "var(--c-system)", borderLeft: "1px solid var(--border)" }}>UEFI</div>
        </div>
        {compRows.map((row, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: i < compRows.length - 1 ? "1px solid var(--border)" : "none", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)" }}>
            <div style={{ padding: "10px 14px", fontSize: 12.5, fontWeight: 600, color: "var(--text-1)" }}>{row.aspect}</div>
            <div style={{ padding: "10px 14px", fontSize: 12, color: "var(--text-2)", borderLeft: "1px solid var(--border)", lineHeight: 1.6 }}>{row.bios}</div>
            <div style={{ padding: "10px 14px", fontSize: 12, color: "var(--text-1)", borderLeft: "1px solid var(--border)", lineHeight: 1.6 }}>{row.uefi}</div>
          </div>
        ))}
      </div>

      {/* ── Security ── */}
      <h3 style={subhead}>{lang === "en" ? "1.4 — Firmware as an attack surface" : "1.4 — Firmware hujum yuzasi sifatida"}</h3>
      <P>
        {lang === "en"
          ? <>Firmware-level attacks are the most persistent and hardest to detect category of malware. Unlike a rootkit that lives in the OS, a firmware implant survives: OS reinstallation, disk replacement, and even BitLocker wipes — because the firmware lives on a separate SPI flash chip, not on the main drive. This is why nation-state actors and APT groups invest heavily in firmware research.</>
          : <>Firmware darajasidagi hujumlar — zararli dasturlarning eng barqaror va aniqlanishi qiyinroq toifasi. OS da yashovchi rootkit dan farqli o'laroq, firmware implant omon qoladi: OS qayta o'rnatish, disk almashtirish va hatto BitLocker o'chirishdan — chunki firmware asosiy diskda emas, alohida SPI flesh chipida yashaydi. Shuning uchun davlat darajasidagi hujumchilar va APT guruhlari firmware tadqiqotlariga katta sarmoya kiritadi.</>}
      </P>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
        {[
          {
            name: "MBR bootkits (BIOS era)", color: "var(--c-attack)",
            bodyUz: "BIOS ning tekshiruvlarsiz MBR ni bajarishini ekspluatatsiya qiladi. MBR dagi 446 baytni yozib o'chirish OS dan oldin nazoratni beradi. Klassik misollar: Mebroot (2007), TDL4 (2010), Petya (2016). Himoya: BIOS ni UEFI + Secure Boot bilan almashtirish.",
            bodyEn: "Exploits BIOS's execution of MBR without verification. Overwriting 446 bytes in the MBR gives control before the OS. Classic examples: Mebroot (2007), TDL4 (2010), Petya (2016). Fix: replace BIOS with UEFI + Secure Boot.",
          },
          {
            name: "UEFI firmware implants", color: "var(--c-attack)",
            bodyUz: "Firmware manbasini to'g'ridan-to'g'ri o'zgartiradigan implantlar — SPI flesh chipiga yoziladi. Mashhur misollar: CosmicStrand (2022, ASUS/Gigabyte), MosaicRegressor (2020, Kaspersky tomonidan kashf etilgan). Bunday implant UEFI ni qayta yangilash orqali ham olib tashlanmaydi (chunki implant yangilanish kodining o'zini o'zgartiradi).",
            bodyEn: "Implants that directly modify the firmware source — written to the SPI flash chip. Notable examples: CosmicStrand (2022, ASUS/Gigabyte), MosaicRegressor (2020, discovered by Kaspersky). Such an implant survives even UEFI re-flashing (because the implant modifies the update code itself).",
          },
          {
            name: "ESPecter — EFI System Partition bootkit", color: "var(--c-warn)",
            bodyUz: "Firmware chipiga yozmasdan, ESP dagi .efi fayllarni modifikatsiya qiladi. Secure Boot o'chirilgan yoki CSM/Legacy rejimi yoqilgan tizimlarda ishlaydi. ESPecter (2021) Windows Boot Manager (bootmgfw.efi) ni yamab, kernel yuklanishidan oldin drayverini kiritardi. Himoya: Secure Boot yoqilishi va ESP'ga yozish monitoringi.",
            bodyEn: "Modifies .efi files on the ESP without writing to the firmware chip. Works on systems with Secure Boot disabled or CSM/Legacy mode enabled. ESPecter (2021) patched the Windows Boot Manager (bootmgfw.efi) to inject its driver before the kernel loaded. Fix: Secure Boot enabled + ESP write monitoring.",
          },
          {
            name: "CSM / Legacy mode — Secure Boot killer", color: "var(--c-warn)",
            bodyUz: "Aksariyat UEFI dasturiy ta'minotlari CSM (Compatibility Support Module) yoki \"Legacy mode\" ni taqdim etadi — eski BIOS-only OS'larni (Windows XP, Linux no-EFI) qo'llab-quvvatlash uchun. CSM yoqilganda, Secure Boot avtomatik ravishda butunlay o'chiriladi. Bu xavfsizlik jihati ko'plab korporativ tizimlar tomonidan e'tibordan chetda qoldiriladi. Tekshirish: <code>msinfo32</code> → BIOS Mode → \"UEFI\" bo'lishi kerak (\"Legacy\" emas).",
            bodyEn: "Most UEFI firmware offers CSM (Compatibility Support Module) or \"Legacy mode\" — to support old BIOS-only OSes (Windows XP, non-EFI Linux). When CSM is enabled, Secure Boot is automatically disabled entirely. This security implication is overlooked by many enterprise systems. Check: <code>msinfo32</code> → BIOS Mode → should say \"UEFI\" (not \"Legacy\").",
          },
          {
            name: "Measured Boot + TPM — attestation chain", color: "var(--c-system)",
            bodyUz: "UEFI'dagi Measured Boot har bir yuklash bosqichini (firmware, bootloader, kernel, drayverlar) SHA-256 xeshini TPM PCR (Platform Configuration Register) ga yozadi. Bu xeshlar o'zgartirilishi mumkin emas — TPM ularni biriktirib, oxirgi «o'lcham» ni yaratadi. Masofaviy attestatsiya orqali server tizimning haqiqiy yuklash konfiguratsiyasini tekshirishi mumkin — biron bir komponent modifikatsiya qilinganligini aniqlash uchun.",
            bodyEn: "Measured Boot in UEFI records the SHA-256 hash of each boot stage (firmware, bootloader, kernel, drivers) into TPM PCR (Platform Configuration Register). These hashes cannot be altered — the TPM chains them, creating a final \"measurement\". Via remote attestation, a server can verify a machine's exact boot configuration — detecting if any component was modified.",
          },
        ].map((item, i) => (
          <div key={i} style={{ padding: "12px 16px", borderRadius: 10, background: `${item.color}07`, border: `1px solid ${item.color}28`, borderLeft: `3px solid ${item.color}` }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 13.5, fontWeight: 700, color: item.color, marginBottom: 6 }}>{item.name}</div>
            <div style={{ fontSize: 12.5, color: "var(--text-1)", lineHeight: 1.72 }}>{lang === "en" ? item.bodyEn : item.bodyUz}</div>
          </div>
        ))}
      </div>

      <Callout color="var(--c-system)" icon="shield" titleUz="Amaliy tekshiruv — tizimingiz UEFI yoki BIOS?" titleEn="Practical check — is your system UEFI or BIOS?">
        {lang === "en"
          ? <>Run <code>msinfo32</code> (Win+R → msinfo32 → Enter). Look at <strong>BIOS Mode</strong>: if it says <em>UEFI</em>, your system boots in UEFI mode. If it says <em>Legacy</em>, CSM is active and Secure Boot is disabled — a security risk. To check Secure Boot status: <code>msinfo32</code> → <strong>Secure Boot State</strong> → should say <em>On</em>. From PowerShell (admin): <code>Confirm-SecureBootUEFI</code> → returns <em>True</em> if Secure Boot is active.</>
          : <>Ishga tushiring <code>msinfo32</code> (Win+R → msinfo32 → Enter). <strong>BIOS Mode</strong> ga qarang: agar <em>UEFI</em> desa, tizimingiz UEFI rejimida yuklanadi. Agar <em>Legacy</em> desa, CSM faol va Secure Boot o'chirilgan — xavfsizlik xavfi. Secure Boot holatini tekshirish uchun: <code>msinfo32</code> → <strong>Secure Boot State</strong> → <em>On</em> bo'lishi kerak. PowerShell dan (admin): <code>Confirm-SecureBootUEFI</code> → Secure Boot faol bo'lsa <em>True</em> qaytaradi.</>}
      </Callout>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Coming soon placeholder for L06-L20
// ─────────────────────────────────────────────────────────────
function ComingSoon({ lesson, lessonNum, setRoute }) {
  const lang = useLang();
  return (
    <div style={{ textAlign: "center", padding: "80px 32px" }}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--accent-soft)", border: "1px solid var(--accent-border)", margin: "0 auto 24px", display: "grid", placeItems: "center", color: "var(--accent)" }}>
        <Icon name="clock" size={36} />
      </div>
      <div className="eyebrow" style={{ color: "var(--accent)", marginBottom: 12 }}>// {lang === "en" ? "IN_DEVELOPMENT" : "TAYYORLANMOQDA"}</div>
      <h2 className="display" style={{ fontSize: 32, margin: "0 0 10px", letterSpacing: "-0.02em" }}>
        {lang === "en" ? lesson.en : lesson.uz}
      </h2>
      <p style={{ color: "var(--text-2)", fontSize: 15, maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.65 }}>
        {lang === "en"
          ? "This lesson is currently being developed. Complete the earlier lessons and check back soon — it will appear here automatically when ready."
          : "Bu dars hozirda tayyorlanmoqda. Oldingi darslarni tugating va tez orada qaytib keling — tayyor bo'lgach bu yerda avtomatik paydo bo'ladi."}
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button className="btn btn-primary" onClick={() => setRoute({ name: "section", section: 1 })}>
          <Icon name="arrow-left" size={14} /> {lang === "en" ? "Back to section" : "Bo'limga qaytish"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Text helpers
// ─────────────────────────────────────────────────────────────
function H2({ num, uz, en }) {
  const lang = useLang();
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginBottom: 14 }}>
      <span className="mono" style={{ color: "var(--accent)", fontSize: 12, letterSpacing: 0.18 }}>{num}</span>
      <h2 className="display" style={{ margin: 0, fontSize: 30, letterSpacing: "-0.02em" }}>{lang === "en" ? en : uz}</h2>
    </div>
  );
}
function P({ children, style }) {
  return <p style={{ fontSize: 15, lineHeight: 1.72, color: "var(--text-1)", margin: "10px 0", textWrap: "pretty", ...style }}>{children}</p>;
}
function Term({ children }) {
  return <span style={{ color: "var(--accent)", fontWeight: 600, borderBottom: "1px dotted var(--accent-border)", cursor: "help" }}>{children}</span>;
}
function Em({ children }) {
  return <em style={{ color: "var(--text-0)", fontStyle: "italic", fontWeight: 500 }}>{children}</em>;
}
function Code2({ children }) {
  return <code style={{ background: "rgba(255,255,255,0.06)", padding: "1px 6px", borderRadius: 4, fontFamily: "var(--font-mono)", fontSize: "0.92em", color: "var(--accent)" }}>{children}</code>;
}
function Callout({ children, color = "var(--accent)", icon = "info", titleUz, titleEn, small }) {
  const lang = useLang();
  const title = lang === "en" ? titleEn : titleUz;
  return (
    <div style={{
      padding: small ? "12px 14px" : "16px 18px",
      background: `${color}0a`,
      border: `1px solid ${color}33`,
      borderRadius: 10, borderLeft: `3px solid ${color}`,
      display: "flex", gap: 12, alignItems: "flex-start",
      marginTop: 14,
    }}>
      <span style={{ color, flexShrink: 0, marginTop: 2 }}><Icon name={icon} size={small ? 14 : 16} /></span>
      <div style={{ flex: 1, fontSize: small ? 12 : 13.5, color: "var(--text-1)", lineHeight: 1.55 }}>
        {title && <div style={{ color, fontWeight: 600, marginBottom: 4 }}>{title}</div>}
        {children}
      </div>
    </div>
  );
}

window.LessonScreen = LessonScreen;
