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
  const hasContent = lessonNum <= 4;

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
          <LessonHero lesson={LESSON} />
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

// ─────────────────────────────────────────────────────────────
function LessonHero({ lesson }) {
  const lang = useLang();
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
          <span className="chip"><Icon name="clock" size={11} /> 36 min</span>
          <span className="chip chip-blue"><Icon name="graph" size={11} /> {lang === "en" ? "9 diagrams" : "9 diagramma"}</span>
          <span className="chip chip-purple"><Icon name="terminal" size={11} /> {lang === "en" ? "3 labs" : "3 lab"}</span>
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
            {lang === "en"
              ? <>The complete Windows architecture from the silicon up — <em>user mode vs kernel mode</em>, the executive layer, microkernel, HAL, and how a single mouse click cascades through every one of them. We'll end where every Windows security problem begins: <em>the user/kernel boundary</em>.</>
              : <>Windows tizimining to'liq arxitekturasi — hardware'dan boshlab, <em>user mode va kernel mode</em>, executive qatlam, microkernel, HAL, va bir sichqoncha bosishi shu qatlamlarning har biridan qanday o'tishini ko'ramiz. Yakunda — har bir Windows xavfsizlik muammosi qaerdan boshlanishi: <em>user/kernel chegarasi</em>.</>}
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
          ? <>An <Term>operating system</Term> is the program that sits between your applications and the physical hardware. It is the only piece of software that talks directly to the CPU, RAM, disks and network cards. Everything else — Chrome, Steam, even <code>cmd.exe</code> — asks the OS politely, and the OS decides.</>
          : <>«<Term>Operatsion tizim</Term>» — bu sizning ilovalaringiz va fizik apparat (hardware) o'rtasida turadigan dasturiy ta'minot. U yagona dasturdir, u CPU, RAM, disk va tarmoq kartalari bilan to'g'ridan-to'g'ri muloqot qiladi. Boshqa hamma narsa — Chrome, Steam, hatto <code>cmd.exe</code> ham — OS'dan murojaat qilib so'raydi, OS qaror qabul qiladi.</>}
      </P>
      <P>
        {lang === "en"
          ? <>Without an OS, every application would need to know exactly how each piece of hardware works — a hopeless task on a planet with thousands of GPU variants. The OS gives applications a <Em>clean, unified view</Em> of the machine and protects them from each other.</>
          : <>OS bo'lmaganida, har bir ilova har bir apparatning aniq qanday ishlashini bilishi kerak bo'lar edi — bu, sayyoramizda ming xil GPU mavjudligini hisobga olganda, imkonsiz vazifa. OS ilovalarga mashinaning <Em>tozalangan, yagonalashtirilgan ko'rinishini</Em> beradi va ularni bir-biridan himoya qiladi.</>}
      </P>

      <Callout color="var(--c-system)" icon="info" titleUz="Eslatma" titleEn="Note">
        {lang === "en"
          ? <>Windows kernel (<code>ntoskrnl.exe</code>) was originally written by <strong>Dave Cutler's</strong> team, who previously built the VAX/VMS kernel at DEC. That's why early Windows NT and VMS look surprisingly similar to anyone who's seen both.</>
          : <>Windows yadrosi (<code>ntoskrnl.exe</code>) DEC kompaniyasida VAX/VMS yadrosini yozgan <strong>Dave Cutler</strong> jamoasi tomonidan yaratilgan. Shuning uchun erta Windows NT va VMS ko'rgan odamga g'alati darajada o'xshashdir.</>}
      </Callout>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 28 }}>
        {[
          { icon: "users", n: "1", uz: "Foydalanuvchini ajratish", en: "User isolation" },
          { icon: "cpu", n: "2", uz: "Apparatni abstrakt qilish", en: "Hardware abstraction" },
          { icon: "layers", n: "3", uz: "Resurslarni boshqarish", en: "Resource management" },
          { icon: "shield", n: "4", uz: "Xavfsizlikni ta'minlash", en: "Enforce security" },
        ].map((b, i) => (
          <div key={i} className="glass" style={{ padding: 18 }}>
            <div className="mono" style={{ fontSize: 10, color: "var(--accent)", letterSpacing: 0.1 }}>{lang === "en" ? "JOB" : "VAZIFA"} #{b.n}</div>
            <div style={{ marginTop: 10, color: "var(--accent)" }}><Icon name={b.icon} size={20} /></div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600, marginTop: 8 }}>{lang === "en" ? b.en : b.uz}</div>
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

      <h3 style={subhead}>{lang === "en" ? "2.1 — Process and thread" : "2.1 — Jarayon va Thread"}</h3>
      <P>
        {lang === "en"
          ? <>A <Term>process</Term> is a running instance of a program. It has its own private virtual address space, security token, set of handles, and one or more threads. A <Term>thread</Term> is the actual scheduling unit — the thing the CPU executes. One process can have one thread (notepad) or thousands (chrome.exe).</>
          : <>«<Term>Jarayon</Term>» (process) — ishlayotgan dasturning bir nusxasi. Uning o'z xususiy virtual manzil maydoni, xavfsizlik tokeni, handle'lar to'plami, va bir yoki bir nechta thread'i bor. «<Term>Thread</Term>» — CPU bajarayotgan haqiqiy birlik. Bir jarayon bitta thread (notepad) yoki minglab (chrome.exe) thread'ga ega bo'lishi mumkin.</>}
      </P>

      <h3 style={subhead}>{lang === "en" ? "2.2 — User mode vs Kernel mode" : "2.2 — User mode va Kernel mode"}</h3>
      <P>
        {lang === "en"
          ? <>Modern CPUs enforce <Em>privilege rings</Em>. Windows uses two: <Em>ring 3</Em> (user mode) and <Em>ring 0</Em> (kernel mode). In user mode your code cannot touch hardware, cannot read another process's memory, and cannot execute privileged instructions. In kernel mode there are no rules — a single buggy driver can crash the entire machine. That's why Windows treats the boundary between them as sacred.</>
          : <>Zamonaviy protsessorlar <Em>privilege ring</Em> tushunchasini ta'minlaydi. Windows ikkitasini ishlatadi: <Em>ring 3</Em> (user mode) va <Em>ring 0</Em> (kernel mode). User mode'da sizning kodingiz apparatga tegmaydi, boshqa jarayonning xotirasini o'qiy olmaydi va imtiyozli buyruqlarni bajara olmaydi. Kernel mode'da qoidalar yo'q — bitta noto'g'ri drayver butun mashinani o'chirishi mumkin. Shuning uchun Windows ular orasidagi chegarani muqaddas sifatida ko'radi.</>}
      </P>

      <h3 style={subhead}>{lang === "en" ? "2.3 — The executive and the kernel" : "2.3 — Executive va microkernel"}</h3>
      <P>
        {lang === "en"
          ? <>Inside the kernel mode, Windows is split into two layers. The <Term>microkernel</Term> handles the lowest-level mechanics: scheduling threads, synchronizing CPUs, dispatching interrupts. The <Term>executive</Term> sits above it and implements every <em>policy</em> — what is a process, what is a file, who can open it. They live together in <code>ntoskrnl.exe</code>.</>
          : <>Kernel mode ichida Windows ikki qatlamga bo'linadi. <Term>Microkernel</Term> eng past darajadagi mexanizmlarni boshqaradi: thread'larni rejalashtirish, CPU'larni sinxronlash, uzilishlarni yo'naltirish. <Term>Executive</Term> uning ustida turadi va har bir <em>siyosatni</em> amalga oshiradi — jarayon nima, fayl nima, kim ochishi mumkin. Ikkalasi ham <code>ntoskrnl.exe</code> ichida yashaydi.</>}
      </P>

      <h3 style={subhead}>{lang === "en" ? "2.4 — Subsystems and Win32" : "2.4 — Subsistemalar va Win32"}</h3>
      <P>
        {lang === "en"
          ? <>Apps don't call the kernel directly. They call a <Term>subsystem DLL</Term> — usually <code>kernel32.dll</code>, <code>user32.dll</code>, or <code>gdi32.dll</code> — which translate Win32 calls into a much smaller set of native calls in <code>ntdll.dll</code>. <code>ntdll</code> is the last user-mode stop before the syscall instruction takes us into ring 0.</>
          : <>Ilovalar yadroga to'g'ridan-to'g'ri murojaat qilmaydi. Ular <Term>subsistem DLL</Term>'ga murojaat qiladi — odatda <code>kernel32.dll</code>, <code>user32.dll</code>, yoki <code>gdi32.dll</code> — ular Win32 chaqiriqlarini <code>ntdll.dll</code> ichidagi ancha kichikroq native chaqiriqlarga aylantiradi. <code>ntdll</code> — syscall buyrug'i bizni ring 0 ga olib kirgunga qadar oxirgi user-mode to'xtash joyi.</>}
      </P>
    </section>
  );
}
const subhead = { fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, margin: "28px 0 8px", letterSpacing: "-0.01em" };

// ─────────────────────────────────────────────────────────────
function Section3Layered() {
  const lang = useLang();
  return (
    <section id="layered" style={{ scrollMarginTop: 80, marginBottom: 56 }}>
      <H2 num="03" uz="Qatlamli arxitektura" en="Layered architecture" />
      <P>
        {lang === "en"
          ? <>Below is the actual layered architecture of Windows. <Em>Click any block</Em> to inspect what lives inside. Notice the strict separation between user mode (top) and kernel mode (bottom) — the dashed line is the only legal way to cross it.</>
          : <>Quyida Windows'ning haqiqiy qatlamli arxitekturasi. Har bir blokni <Em>bossangiz</Em> uning ichida nima borligini ko'rasiz. User mode (yuqori) va kernel mode (past) o'rtasidagi qat'iy ajratishga e'tibor bering — chiziqli chegara — uni kesib o'tishning yagona qonuniy yo'li.</>}
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

      <Callout color="var(--c-warn)" icon="warning" titleUz="Xavfsizlik nuqtai nazaridan" titleEn="Security note">
        {lang === "en"
          ? <>Secure Boot enforces a cryptographic chain — UEFI verifies the bootloader, the bootloader verifies the kernel, the kernel verifies signed drivers. Breaking this chain is the dream of every bootkit. <code>BlackLotus</code> (2023) was the first public UEFI bootkit to bypass Secure Boot on fully patched Windows 11 — it patched the Secure Boot revocation list in memory before the check ran.</>
          : <>Secure Boot kriptografik zanjirni ta'minlaydi — UEFI bootloader'ni tekshiradi, bootloader yadroni, yadro esa imzolangan drayverlarni. Bu zanjirni buzish har bir bootkit'ning orzusi. <code>BlackLotus</code> (2023) — to'liq yangilangan Windows 11 da Secure Boot'ni chetlab o'tgan birinchi ommaviy UEFI bootkit: u tekshiruv ishlashidan oldin xotiradagi Secure Boot revokatsiya ro'yxatini o'zgartirdi.</>}
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
          ? <>The <Term>kernel</Term> is the core of the operating system — the one piece of software that has complete, unrestricted access to all hardware. While your browser and text editor live in the sandboxed <Em>user space</Em>, the kernel lives in a completely separate, privileged area called <Em>kernel space</Em>. It manages everything: memory, CPU time, files, network, and every piece of hardware connected to the machine.</>
          : <>«<Term>Kernel</Term>» — operatsion tizimning asosi. Bu barcha hardware'ga to'liq, cheklovsiz kirishga ega bo'lgan yagona dastur. Brauzering va matn muharriringiz «sandbox»lashtirilgan <Em>user space</Em>'da yashasa, kernel butunlay boshqa, imtiyozli zonada — <Em>kernel space</Em>'da yashaydi. U hamma narsani boshqaradi: xotira, CPU vaqti, fayllar, tarmoq va mashinaga ulangan har bir hardware.</>}
      </P>
      <P>
        {lang === "en"
          ? <>In Windows, the kernel lives inside a single file: <code>ntoskrnl.exe</code> (NT OS Kernel Executable). This ~10 MB file bootstraps every component of the OS when Windows starts. Without it, the machine cannot function at all.</>
          : <>Windows'da kernel bitta faylda joylashgan: <code>ntoskrnl.exe</code> (NT OS Kernel Executable). Bu ~10 MB li fayl Windows ishga tushganda OT'ning barcha komponentlarini ishga tushiradi. U bo'lmasa — mashina umuman ishlay olmaydi.</>}
      </P>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 24 }}>
        {[
          { icon: "cpu", color: "var(--c-system)", uz: "CPU vaqtini boshqarish", en: "CPU scheduling", descUz: "Qaysi jarayon qachon protsessor vaqtini olishini kernel hal qiladi.", descEn: "The kernel decides which process gets CPU time and when." },
          { icon: "database", color: "var(--accent)", uz: "Xotirani boshqarish", en: "Memory management", descUz: "Har bir jarayon o'z virtual manzil maydonini oladi. Kernel buni ta'minlaydi.", descEn: "Every process gets its own virtual address space. The kernel enforces this." },
          { icon: "shield", color: "var(--c-auth)", uz: "Xavfsizlik siyosati", en: "Security policy", descUz: "Kernel har bir fayl, jarayon va qurilmaga kirish ruxsatini tekshiradi.", descEn: "The kernel checks every access permission for files, processes and devices." },
        ].map((c, i) => (
          <div key={i} className="glass" style={{ padding: 18 }}>
            <div style={{ color: c.color, marginBottom: 10 }}><Icon name={c.icon} size={20} /></div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{lang === "en" ? c.en : c.uz}</div>
            <div style={{ fontSize: 12.5, color: "var(--text-1)", lineHeight: 1.5 }}>{lang === "en" ? c.descEn : c.descUz}</div>
          </div>
        ))}
      </div>

      <Callout color="var(--accent)" icon="info" titleUz="ntoskrnl.exe — asosiy fayl" titleEn="ntoskrnl.exe — the central file">
        {lang === "en"
          ? <>You can find it at <code>C:\Windows\System32\ntoskrnl.exe</code>. It is signed by Microsoft and any modification means Windows refuses to boot. This file contains both the <strong>Microkernel</strong> and the <strong>Executive</strong> — two separate layers packed into one binary.</>
          : <>Uni <code>C:\Windows\System32\ntoskrnl.exe</code> da topasiz. U Microsoft tomonidan imzolangan va har qanday o'zgartirishda Windows yuklashdan bosh tortadi. Bu fayl <strong>Microkernel</strong> va <strong>Executive</strong> ni — ikkita alohida qatlamni bitta faylda — o'z ichiga oladi.</>}
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
          ? <>Despite being one file, <code>ntoskrnl.exe</code> contains two conceptually separate parts: the <Term>Microkernel</Term> (the low-level engine) and the <Term>Executive</Term> (the high-level policy layer). There's also one separate but closely related component: the <Term>HAL</Term>.</>
          : <>Bitta fayl bo'lishiga qaramay, <code>ntoskrnl.exe</code> ikki kontseptual alohida qismni o'z ichiga oladi: <Term>Microkernel</Term> (past darajali dvigatel) va <Term>Executive</Term> (yuqori darajali siyosat qatlami). Shuningdek, alohida lekin chambarchas bog'liq komponent ham bor: <Term>HAL</Term>.</>}
      </P>

      <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ padding: "20px 24px", background: "rgba(77,139,255,0.06)", border: "1px solid rgba(77,139,255,0.25)", borderRadius: 14, borderLeft: "4px solid var(--c-system)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <Icon name="cpu" size={18} style={{ color: "var(--c-system)" }} />
            <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "var(--c-system)" }}>Microkernel</div>
          </div>
          <P>{lang === "en"
            ? <>The <Term>Microkernel</Term> is the innermost engine. It handles three things only: <Em>thread scheduling</Em> (deciding which thread runs next on which CPU), <Em>interrupt handling</Em> (reacting to hardware signals like keyboard presses), and <Em>CPU synchronization</Em> (keeping multiple cores in sync). It intentionally stays minimal — the fewer lines of code here, the smaller the attack surface.</>
            : <><Term>Microkernel</Term> — eng ichki dvigatel. U faqat uchta ishni bajaradi: <Em>thread'larni rejalashtirish</Em> (qaysi thread qaysi CPU'da keyingi o'tadi), <Em>uzilishlarni boshqarish</Em> (klaviatura bosimi kabi hardware signallariga javob berish) va <Em>CPU sinxronizatsiyasi</Em> (bir nechta yadrolarni sinxronlash). U ataylab minimal qoladi — bu yerda kod qanchalik kam bo'lsa, hujum yuzasi shunchalik kichik.</>}</P>
        </div>

        <div style={{ padding: "20px 24px", background: "rgba(0,255,156,0.04)", border: "1px solid var(--accent-border)", borderRadius: 14, borderLeft: "4px solid var(--accent)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <Icon name="layers" size={18} style={{ color: "var(--accent)" }} />
            <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "var(--accent)" }}>Executive</div>
          </div>
          <P>{lang === "en"
            ? <>The <Term>Executive</Term> sits above the microkernel and implements all the high-level <Em>policies</Em>: what a process is, how memory is managed, how files work, and who can access what. It is split into managers:</>
            : <><Term>Executive</Term> mikrokernelning ustida turadi va barcha yuqori darajali <Em>siyosatlarni</Em> amalga oshiradi: jarayon nima, xotira qanday boshqariladi, fayllar qanday ishlaydi va kim nimaga kirish huquqiga ega. U menejerlarga bo'linadi:</>}</P>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginTop: 8 }}>
            {(lang === "en" ? [
              ["Process Manager", "Creates and destroys processes and threads"],
              ["Memory Manager", "Manages virtual memory and page files"],
              ["I/O Manager", "Routes requests to the right driver"],
              ["Object Manager", "Tracks every kernel object (files, handles, tokens)"],
              ["Security Reference Monitor", "Enforces access control (ACLs)"],
              ["Cache Manager", "Caches file data in RAM for speed"],
            ] : [
              ["Jarayon menejeri", "Jarayonlar va thread'larni yaratib, yo'q qiladi"],
              ["Xotira menejeri", "Virtual xotira va page fayllarini boshqaradi"],
              ["I/O menejeri", "So'rovlarni to'g'ri drayverga yo'naltiradi"],
              ["Ob'ekt menejeri", "Har bir kernel ob'ektini kuzatadi (fayllar, handle, token)"],
              ["Xavfsizlik monitord", "Kirish nazoratini ta'minlaydi (ACL)"],
              ["Kesh menejeri", "Tezlik uchun fayl ma'lumotlarini RAM'da saqlaydi"],
            ]).map(([name, desc], i) => (
              <div key={i} style={{ padding: "10px 14px", background: "var(--bg-2)", borderRadius: 8, border: "1px solid var(--border)" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)", marginBottom: 4 }}>{name}</div>
                <div style={{ fontSize: 12, color: "var(--text-1)", lineHeight: 1.45 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "20px 24px", background: "rgba(184,140,255,0.05)", border: "1px solid rgba(184,140,255,0.2)", borderRadius: 14, borderLeft: "4px solid var(--c-auth)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <Icon name="shield" size={18} style={{ color: "var(--c-auth)" }} />
            <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "var(--c-auth)" }}>HAL — Hardware Abstraction Layer</div>
          </div>
          <P>{lang === "en"
            ? <>The <Term>HAL</Term> (<code>hal.dll</code>) is a thin layer between the kernel and the actual hardware. Without it, Windows would need different code for every motherboard chipset. HAL provides a <Em>standard interface</Em>: the kernel asks «write to this memory address» and HAL translates it to the right instruction for the actual hardware installed. This is why the same <code>ntoskrnl.exe</code> runs on thousands of different PC models.</>
            : <><Term>HAL</Term> (<code>hal.dll</code>) — kernel va haqiqiy hardware o'rtasidagi yupqa qatlam. U bo'lmasa, Windows har bir ona plata chipset uchun alohida kod talab qilardi. HAL <Em>standart interfeys</Em> ta'minlaydi: kernel «bu xotira manziliga yoz» deb so'raydi, HAL esa buni o'rnatilgan haqiqiy hardware uchun to'g'ri buyruqqa tarjima qiladi. Shuning uchun bir xil <code>ntoskrnl.exe</code> minglab turli PC modellarida ishlaydi.</>}</P>
        </div>
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
          ? <>A <Term>driver</Term> is a special program that tells the OS how to talk to a specific piece of hardware. Unlike regular apps, drivers run entirely in <Em>kernel mode (ring 0)</Em> — the same privilege level as the kernel itself. This means a buggy or malicious driver can take down the entire system, which is why Windows requires drivers to be digitally signed.</>
          : <>«<Term>Drayver</Term>» — OS'ga ma'lum bir hardware bilan qanday gaplashishni aytadigan maxsus dastur. Oddiy ilovalardan farqli o'laroq, drayverlar to'liq <Em>kernel mode (ring 0)</Em>'da — kernelning o'zi bilan bir xil imtiyoz darajasida — ishlaydi. Bu degani, noto'g'ri yoki zararli drayver butun tizimni yiqitishi mumkin. Shuning uchun Windows drayverlardan raqamli imzo talab qiladi.</>}
      </P>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 22 }}>
        <div style={{ padding: "18px 20px", background: "rgba(0,255,156,0.04)", border: "1px solid var(--accent-border)", borderRadius: 12 }}>
          <div style={{ color: "var(--accent)", marginBottom: 8 }}><Icon name="check" size={18} /></div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, marginBottom: 8 }}>
            {lang === "en" ? "Signed driver" : "Imzolangan drayver"}
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "var(--text-1)", lineHeight: 1.7 }}>
            {(lang === "en" ? [
              "Certificate issued by Microsoft",
              "Signature verified at boot time",
              "Tampering detected → boot blocked",
              "Extension: .sys",
            ] : [
              "Microsoft tomonidan sertifikat berilgan",
              "Imzo boot vaqtida tekshiriladi",
              "O'zgartirilsa → boot bloklanadi",
              "Kengaytma: .sys",
            ]).map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
        <div style={{ padding: "18px 20px", background: "rgba(255,58,94,0.05)", border: "1px solid rgba(255,58,94,0.25)", borderRadius: 12 }}>
          <div style={{ color: "var(--c-attack)", marginBottom: 8 }}><Icon name="warning" size={18} /></div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, marginBottom: 8 }}>
            {lang === "en" ? "Unsigned driver" : "Imzolanmagan drayver"}
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "var(--text-1)", lineHeight: 1.7 }}>
            {(lang === "en" ? [
              "No certificate — blocked by default",
              "Windows shows a warning or refuses load",
              "Common in BYOVD attacks",
              "Red flag in incident response",
            ] : [
              "Sertifikat yo'q — odatda bloklanadi",
              "Windows ogohlantirish ko'rsatadi yoki yuklamaydi",
              "BYOVD hujumlarida keng tarqalgan",
              "Hodisalarga javob berishda qizil bayroq",
            ]).map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
      </div>

      <Callout color="var(--c-attack)" icon="warning" titleUz="BYOVD hujumi" titleEn="BYOVD attack">
        {lang === "en"
          ? <><strong>BYOVD (Bring Your Own Vulnerable Driver)</strong> is a technique where an attacker uses a <em>legitimate, signed but vulnerable</em> driver to gain ring 0 access. Because the driver is signed, Windows trusts it — but the attacker exploits a bug inside it to run their own code in the kernel. The defence: regularly check for vulnerable drivers with tools like <code>loldrivers.io</code>.</>
          : <><strong>BYOVD (Bring Your Own Vulnerable Driver)</strong> — hujumchi <em>qonuniy, imzolangan, lekin zaif</em> drayverdan ring 0 kirishini olish uchun foydalanadi. Drayver imzolanganligi sababli Windows unga ishonadi — ammo hujumchi undagi xatolikni ekspluatatsiya qilib, kernelda o'z kodini ishga tushiradi. Himoya: <code>loldrivers.io</code> kabi vositalar bilan zaif drayverlarni muntazam tekshiring.</>}
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
          ? <>Modern processors don't just execute code — they enforce <Term>privilege levels</Term>. The x86/x64 CPU architecture defines 4 rings (0 through 3), where ring 0 is the most privileged and ring 3 is the least. Windows only uses two: <Em>ring 0 (kernel mode)</Em> and <Em>ring 3 (user mode)</Em>. Rings 1 and 2 were intended for device drivers in the original design but were never used in practice.</>
          : <>Zamonaviy protsessorlar faqat kod bajarmasdan, <Term>imtiyoz darajalarini</Term> ham ta'minlaydi. x86/x64 CPU arxitekturasi 4 ta halqani (0 dan 3 gacha) belgilaydi: ring 0 — eng imtiyozli, ring 3 — eng kam imtiyozli. Windows faqat ikkitasidan foydalanadi: <Em>ring 0 (kernel mode)</Em> va <Em>ring 3 (user mode)</Em>. Ring 1 va 2 dastlabki dizaynda qurilma drayverlari uchun mo'ljallangan, lekin amalda hech qachon ishlatilmagan.</>}
      </P>

      {/* Visual ring diagram */}
      <div style={{ margin: "28px auto", maxWidth: 380, position: "relative", textAlign: "center" }}>
        <div style={{ position: "relative", display: "inline-block", width: 320, height: 320 }}>
          {/* Ring 3 */}
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(255,145,69,0.4)", background: "rgba(255,145,69,0.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--c-user)", letterSpacing: 0.1 }}>ring 3 · User mode</div>
          </div>
          {/* Ring 1-2 */}
          <div style={{ position: "absolute", inset: 40, borderRadius: "50%", border: "1px dashed rgba(100,100,120,0.3)", background: "rgba(100,100,120,0.03)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-3)", letterSpacing: 0.1, whiteSpace: "nowrap" }}>ring 1 & 2 · unused</div>
          </div>
          {/* Ring 0 */}
          <div style={{ position: "absolute", inset: 88, borderRadius: "50%", border: "2px solid rgba(77,139,255,0.6)", background: "rgba(77,139,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--c-system)", letterSpacing: 0.1 }}>ring 0</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--c-system)", marginTop: 2 }}>Kernel mode</div>
              <div style={{ fontSize: 10, color: "var(--text-2)", marginTop: 2 }}>ntoskrnl.exe</div>
            </div>
          </div>
          {/* Labels outside */}
          <div style={{ position: "absolute", bottom: 18, left: "50%", transform: "translateX(-50%)", fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--c-user)", whiteSpace: "nowrap" }}>
            Chrome, Notepad, cmd.exe
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ padding: "16px 20px", background: "rgba(255,145,69,0.06)", border: "1px solid rgba(255,145,69,0.25)", borderRadius: 12 }}>
          <div className="mono" style={{ fontSize: 10, color: "var(--c-user)", marginBottom: 8, letterSpacing: 0.1 }}>RING 3 · USER MODE</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "var(--text-1)", lineHeight: 1.7 }}>
            {(lang === "en" ? [
              "Cannot access hardware directly",
              "Cannot read another process's memory",
              "Cannot run privileged CPU instructions",
              "App crash = only that app dies",
              "Examples: Chrome, Notepad, Python scripts",
            ] : [
              "Hardware'ga to'g'ridan-to'g'ri kira olmaydi",
              "Boshqa jarayonning xotirasini o'qiy olmaydi",
              "Imtiyozli CPU buyruqlarini bajara olmaydi",
              "Ilova xatosi = faqat o'sha ilova o'ladi",
              "Misollar: Chrome, Notepad, Python skriptlar",
            ]).map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
        <div style={{ padding: "16px 20px", background: "rgba(77,139,255,0.06)", border: "1px solid rgba(77,139,255,0.25)", borderRadius: 12 }}>
          <div className="mono" style={{ fontSize: 10, color: "var(--c-system)", marginBottom: 8, letterSpacing: 0.1 }}>RING 0 · KERNEL MODE</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "var(--text-1)", lineHeight: 1.7 }}>
            {(lang === "en" ? [
              "Full access to all hardware",
              "Can read/write any memory address",
              "All CPU instructions available",
              "Crash here = BSOD, entire machine halts",
              "Examples: ntoskrnl.exe, drivers (.sys files)",
            ] : [
              "Barcha hardware'ga to'liq kirish",
              "Istalgan xotira manziliga o'qish/yozish",
              "Barcha CPU buyruqlari mavjud",
              "Bu yerda xato = BSOD, butun mashina to'xtaydi",
              "Misollar: ntoskrnl.exe, drayverlar (.sys fayllar)",
            ]).map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
      </div>

      <Callout color="var(--c-warn)" icon="warning" titleUz="Nima uchun bu chegara zarur?" titleEn="Why does this boundary exist?">
        {lang === "en"
          ? <>Imagine if every app had full hardware access. A single buggy Chrome tab could corrupt RAM and crash everything. The ring boundary ensures that no matter how broken or malicious an app is, it <Em>cannot</Em> directly harm the kernel or other processes. The kernel stays in control — and that's the entire premise of OS security.</>
          : <>Tasavvur qiling, har bir ilova to'liq hardware kirishiga ega bo'lsa. Bitta noto'g'ri Chrome yorlig'i RAM'ni buzib, hamma narsani yiqitishi mumkin edi. Halqa chegarasi shunday ta'minlaydiki, ilova qanchalik buzilgan yoki zararli bo'lmasin, u kernelga yoki boshqa jarayonlarga to'g'ridan-to'g'ri zarar yetkazolmaydi. Kernel nazoratni qo'lida ushlab turadi — bu OT xavfsizligining asosiy printsipi.</>}
      </Callout>
    </section>
  );
}

function SectionSyscallBrief() {
  const lang = useLang();
  return (
    <section id="syscall-brief" style={{ scrollMarginTop: 80, marginBottom: 56 }}>
      <H2 num="03" uz="Chegarani qanday kesib o'tish mumkin?" en="How do you legally cross the boundary?" />
      <P>
        {lang === "en"
          ? <>A user-mode app can never just jump into kernel mode directly — the CPU won't allow it. The <Em>only</Em> legal way to request a privileged service is through a <Term>system call</Term> (syscall). This is a special CPU instruction that: saves the user-mode context, switches the CPU to ring 0, runs the requested kernel function, then returns the CPU back to ring 3.</>
          : <>User mode'dagi ilova kernel mode'ga to'g'ridan-to'g'ri sakray olmaydi — protsessor buni ruxsat bermaydi. Imtiyozli xizmat talab qilishning <Em>yagona</Em> qonuniy yo'li — <Term>tizim chaqiruvi</Term> (syscall). Bu maxsus CPU buyrug'i: user mode kontekstini saqlaydi, CPU'ni ring 0 ga o'tkazadi, so'ralgan kernel funksiyasini bajaradi va CPU'ni ring 3 ga qaytaradi.</>}
      </P>

      <div style={{ marginTop: 20, padding: "20px 24px", background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 14 }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>// {lang === "en" ? "SIMPLIFIED CALL PATH" : "SODDALASHTIRILGAN CHAQIRUV YO'LI"}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", fontSize: 13 }}>
          {[
            { label: "App code", color: "var(--c-user)" },
            { label: "→", color: "var(--text-3)" },
            { label: "kernel32.dll", color: "var(--c-user)" },
            { label: "→", color: "var(--text-3)" },
            { label: "ntdll.dll", color: "var(--c-user)" },
            { label: "→ syscall →", color: "var(--c-warn)" },
            { label: "Executive", color: "var(--c-system)" },
            { label: "→", color: "var(--text-3)" },
            { label: "Driver / Hardware", color: "var(--c-auth)" },
          ].map((s, i) => (
            <span key={i} style={{ fontFamily: s.label.includes("→") ? "var(--font-body)" : "var(--font-mono)", color: s.color, fontWeight: s.label.includes("→") ? 400 : 600 }}>{s.label}</span>
          ))}
        </div>
        <div style={{ marginTop: 14, fontSize: 12.5, color: "var(--text-2)", lineHeight: 1.6 }}>
          {lang === "en"
            ? <>Everything to the left of «syscall» is in ring 3. Everything to the right is in ring 0. The syscall instruction is the only legal crossing point — this is the fundamental design of every modern OS.</>
            : <>«syscall»dan chap tomondagi hamma narsa ring 3'da. O'ng tomondagi hamma narsa ring 0'da. Syscall buyrug'i — yagona qonuniy kesishish nuqtasi. Bu har bir zamonaviy OT'ning asosiy dizayni.</>}
        </div>
      </div>

      <Callout color="var(--c-attack)" icon="skull" titleUz="Xavfsizlik nuqtai nazaridan" titleEn="Security angle">
        {lang === "en"
          ? <>Security tools (EDRs, antivirus) place <Em>hooks</Em> inside <code>ntdll.dll</code> to monitor every syscall before it enters the kernel. Advanced malware bypasses this by calling the <code>syscall</code> instruction <Em>directly</Em> — skipping the hooked ntdll entirely. This technique is called <strong>direct syscalls</strong> and you'll study it in depth in the Windows API lesson.</>
          : <>Xavfsizlik tizimlari (EDR, antivirus) har bir syscallni kernelga kirmasdan oldin kuzatish uchun <code>ntdll.dll</code> ichiga <Em>hook</Em> joylashtiradi. Rivojlangan malware buni chetlab o'tadi: <code>syscall</code> buyrug'ini <Em>to'g'ridan-to'g'ri</Em> chaqiradi — ushlangan ntdll'ni butunlay o'tkazib yuboradi. Bu texnika <strong>to'g'ridan-to'g'ri syscall</strong> deyiladi va uni Windows API darsida chuqur o'rganasiz.</>}
      </Callout>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Coming soon placeholder for L05-L20
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
