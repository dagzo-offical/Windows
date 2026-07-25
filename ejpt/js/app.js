/* ============================================================
   eJPT Practice — application logic (vanilla ES, no build step)
   Views: home · examConfig · exam · examResult · practiceConfig
          · practice · history
   Storage: localStorage (all wrapped in try/catch)
   ============================================================ */
"use strict";

/* ---------------- constants ---------------- */
const PASS_PCT = 70;              // eJPT passing score
const EXAM_SIZE = 45;             // questions in a mock exam
const MIN_BANK = 45;              // minimum questions needed to run an exam

const TIMER_PRESETS = [
  { id: "48h", label: "48 soat", sub: "Haqiqiy imtihon", secs: 48 * 3600 },
  { id: "90m", label: "90 daqiqa", sub: "Tez rejim", secs: 90 * 60 },
  { id: "60m", label: "60 daqiqa", sub: "Tezkor", secs: 60 * 60 },
];

const DOMAINS = {
  host_network_pentest: {
    uz: "Host & Network Pentest", short: "HNP", weight: 35, color: "var(--orange)",
    topics: "Metasploit · Meterpreter · payload · pivoting · reverse/bind shell",
  },
  assessment_methodologies: {
    uz: "Assessment Methodologies", short: "AM", weight: 25, color: "var(--blue)",
    topics: "host discovery · nmap · enumeration · OSINT · vuln assessment",
  },
  host_network_auditing: {
    uz: "Host & Network Auditing", short: "HNA", weight: 25, color: "#c07bff",
    topics: "file transfer · enumeration · hash/parol · privesc · cracking",
  },
  web_app_pentest: {
    uz: "Web App Pentest", short: "WEB", weight: 15, color: "var(--green)",
    topics: "web recon · Nikto · Gobuster · WPScan · SQLi/XSS",
  },
};
const DOMAIN_ORDER = Object.keys(DOMAINS);

const TYPE_LABEL = { mcq: "MCQ", direct: "Direct", flag: "Flag" };

const LS = {
  history: "ejpt_history",
  settings: "ejpt_settings",
  activeExam: "ejpt_exam_active",
  practice: "ejpt_practice_stats",
  labFlags: "ejpt_lab_flags",
};

// ---- Amaliy Lab (haqiqiy Docker mashinalari, Web Terminal orqali) ----
// hash = kutilgan flag'ning SHA-256'si (mijoz tomonida tekshiriladi).
const LAB = {
  // Haqiqiy Docker virtual mashinalari. Dashboard'dagi Web Terminal orqali buziladi:
  // nmap -> web/xizmat zaifligi -> SSH cred/hash -> SSH -> oddiy user -> root.
  // Har mashina TURLI daraja va TURLI zaiflik turi. Flaglar mashina ichida.
  machines: [
    { id: "web-easy", name: "web-easy · shopzone", ip: "10.10.20.40", diff: "easy",
      vuln: "Ochiq zaxira fayl (info disclosure)",
      path: "Ochiq faylni toping → SSH ma'lumoti sizadi → SSH → sudo bash → root",
      flags: [
        { id: "we_user", label: "user", hash: "1f8c81f45669893bee5c124cb4e2e9684cfea68927bc1127171450ca5c084f04" },
        { id: "we_root", label: "root", hash: "f0d91df6dc331019b8e0b0cf2955587466062de41567cad14a276dffcc130dd9" },
      ] },
    { id: "linux-02", name: "linux-02 · backend", ip: "10.10.20.20", diff: "easy",
      vuln: "Anonim FTP + zaif SSH parol",
      path: "FTP'dagi maslahat → zaif SSH parol → SUID find → root",
      flags: [
        { id: "lx_user", label: "user", hash: "93e51fbb4d17f4dad11cb6f40616f7ec452a3e718598358883ef6b5ee2f7e129" },
        { id: "lx_root", label: "root", hash: "84eac80080d69599f852d12cad5d230df9a87578b49b4d9319189848f6276900" },
      ] },
    { id: "web-01", name: "web-01 · acme.lab", ip: "10.10.20.10", diff: "medium",
      vuln: "Web SQLi → parol HASH sizadi",
      path: "UNION SQLi → md5crypt hash → john bilan crack → SSH → sudo → root",
      flags: [
        { id: "w1_user", label: "user", hash: "6c1c823759ea58d6a2a16157c96b48dc3df8bc42814d860b66f3a7d7c40a89a8" },
        { id: "w1_root", label: "root", hash: "2df2c2f22462bbea71c598ea7c7df3c6d2e521baf69d7ac91ab2b1c90facb5ba" },
      ] },
    { id: "smb-03", name: "smb-03 · fileserver", ip: "10.10.20.30", diff: "medium",
      vuln: "SMB null-session (parolsiz share)",
      path: "null-session → cred sizadi → SSH → yoziladigan root skript → root",
      flags: [
        { id: "sm_user", label: "user", hash: "7490ab7a5b913d64bc9a86507ad9a952c5518d1d2966761dfb9a4be1e8e6bd35" },
        { id: "sm_root", label: "root", hash: "0a6622afbe8693faf2f93bfa3e6b19f5df6ac7b22d7d48c5ba3644754dccb72d" },
      ] },
    { id: "web-hard", name: "web-hard · monitorpanel", ip: "10.10.20.50", diff: "hard",
      vuln: "LFI / path traversal",
      path: "view.php?page= LFI → SSH cred sizadi → SSH → perl cap_setuid → root",
      flags: [
        { id: "wh_user", label: "user", hash: "4b2fae9e4be8ad86487d129f0de31bfc45e36d9883232a43d8150b44eca5002c" },
        { id: "wh_root", label: "root", hash: "9aac51377f1cb711f3e172742fed6b1325ab25642dd6ea116ac4c20575a6f8b2" },
      ] },
    { id: "internal-04", name: "internal-04 · vault", ip: "10.10.10.20", diff: "hard",
      vuln: "PIVOT + command injection (ichki tarmoq)",
      path: "FAQAT web-01 orqali pivot → command injection → final flag",
      flags: [
        { id: "in_final", label: "final", hash: "eafcf4163e79f086a2642cf1e27f03f2efbd9ba1d530c19e3968207d2f31401d" },
      ] },
  ],
};
const LAB_TOTAL_FLAGS = LAB.machines.reduce((n, m) => n + m.flags.length, 0);  // 11

/* ---------------- storage helpers (all guarded) ---------------- */
function lsGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch (e) { return fallback; }
}
function lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch (e) { return false; }
}
function lsDel(key) { try { localStorage.removeItem(key); } catch (e) {} }

/* ---------------- small utils ---------------- */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function normalize(s) { return String(s == null ? "" : s).trim().toLowerCase().replace(/\s+/g, " "); }
function answersMatch(user, correct) { return normalize(user) === normalize(correct); }

function fmtClock(sec) {
  sec = Math.max(0, Math.floor(sec));
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}
function fmtDuration(sec) {
  sec = Math.max(0, Math.floor(sec));
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  if (h > 0) return `${h} soat ${m} daq`;
  if (m > 0) return `${m} daq ${s} son`;
  return `${s} son`;
}
function fmtDate(ts) {
  try {
    const d = new Date(ts);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch (e) { return ""; }
}

/* inline SVG icons (stroke) */
const ICON = {
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  flag: '<path d="M4 21V4h13l-2 4 2 4H4"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  arrowL: '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
  arrowR: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  home: '<path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9"/>',
  history: '<path d="M3 3v6h6"/><path d="M3 9a9 9 0 1 0 3-6.7L3 5"/><path d="M12 8v4l3 2"/>',
  bolt: '<path d="M13 2 3 14h7l-1 8 10-12h-7z"/>',
  trophy: '<path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3"/><path d="M7 5H4v2a3 3 0 0 0 3 3"/>',
  layers: '<path d="m12 2 9 5-9 5-9-5 9-5z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
  trash: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6 6l1 14h10l1-14"/>',
};
function svg(name, size) {
  const s = size || 20;
  return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICON[name] || ""}</svg>`;
}

/* ---------------- app state ---------------- */
const App = {
  root: null,
  bank: [],          // all questions
  byId: {},          // id -> question
  loadError: null,
  view: "home",
  // exam runtime
  exam: null,        // {questions, answers, flags, idx, timerTotal, endAt, startAt, tick}
  examResult: null,
  // practice runtime
  practice: null,    // {pool, order, idx, answered, correct, total, domains}
};

/* ================= data loading ================= */
async function loadBank() {
  try {
    const res = await fetch("data/questions.json", { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error("bo'sh yoki noto'g'ri format");
    App.bank = data.filter(validQuestion);
    App.byId = {};
    App.bank.forEach((q) => { App.byId[q.id] = q; });
    if (App.bank.length === 0) throw new Error("yaroqli savol topilmadi");
  } catch (e) {
    App.loadError = e.message || String(e);
  }
}
function validQuestion(q) {
  if (!q || !q.id || !q.domain || !q.type || !q.question || q.answer == null) return false;
  if (!DOMAINS[q.domain]) return false;
  if (q.type === "mcq" && (!Array.isArray(q.options) || q.options.indexOf(q.answer) === -1)) return false;
  return true;
}

/* ================= exam construction ================= */
function buildExamSet() {
  // distribute EXAM_SIZE across domains by weight
  const counts = {};
  let assigned = 0;
  DOMAIN_ORDER.forEach((d) => {
    counts[d] = Math.round((DOMAINS[d].weight / 100) * EXAM_SIZE);
    assigned += counts[d];
  });
  // fix rounding drift to hit EXAM_SIZE exactly
  let drift = EXAM_SIZE - assigned;
  const byWeightDesc = DOMAIN_ORDER.slice().sort((a, b) => DOMAINS[b].weight - DOMAINS[a].weight);
  let i = 0;
  while (drift !== 0) {
    const d = byWeightDesc[i % byWeightDesc.length];
    counts[d] += drift > 0 ? 1 : -1;
    drift += drift > 0 ? -1 : 1;
    i++;
  }
  // sample per domain
  let picked = [];
  DOMAIN_ORDER.forEach((d) => {
    const pool = shuffle(App.bank.filter((q) => q.domain === d));
    picked = picked.concat(pool.slice(0, Math.min(counts[d], pool.length)));
  });
  // if a domain was short, top up from the rest of the bank
  if (picked.length < EXAM_SIZE) {
    const chosen = new Set(picked.map((q) => q.id));
    const extra = shuffle(App.bank.filter((q) => !chosen.has(q.id)));
    picked = picked.concat(extra.slice(0, EXAM_SIZE - picked.length));
  }
  return shuffle(picked).slice(0, EXAM_SIZE).map(prepareQuestion);
}
// returns a runtime copy with a fixed (shuffled) option order for stable rendering
function prepareQuestion(q) {
  const copy = { id: q.id, domain: q.domain, type: q.type, difficulty: q.difficulty || "medium",
    tools: q.tools || [], scenario: q.scenario || "", question: q.question,
    answer: q.answer, explanation: q.explanation || "" };
  copy.options = q.type === "mcq" ? shuffle(q.options) : null;
  return copy;
}

/* ================= render root ================= */
function setView(v) { App.view = v; render(); window.scrollTo(0, 0); }

function topbar() {
  const inExam = App.view === "exam" && App.exam;
  return `
  <div class="topbar">
    <button class="brand" onclick="${inExam ? "EJPT.confirmHome()" : "EJPT.go('home')"}">
      <span class="logo">${svg("target", 18)}</span>
      <span>eJPT <span class="grad">Practice</span><small>INE Junior Penetration Tester</small></span>
    </button>
    <div class="topbar-actions">
      ${inExam
        ? `<span class="mono small muted">Imtihon davom etmoqda</span>`
        : `<button class="btn sm ghost" onclick="EJPT.go('history')">${svg("history", 15)} Tarix</button>`}
    </div>
  </div>`;
}

function render() {
  const r = App.root;
  if (App.loadError) { r.innerHTML = topbar(false) + errorView(); return; }
  if (!App.bank.length) { r.innerHTML = topbar(false) + `<div class="section">Yuklanmoqda…</div>`; return; }
  switch (App.view) {
    case "home": r.innerHTML = topbar(false) + homeView(); animateBars(); break;
    case "examConfig": r.innerHTML = topbar(true) + examConfigView(); break;
    case "exam": r.innerHTML = topbar(false) + examView(); break;
    case "examResult": r.innerHTML = topbar(false) + examResultView(); drawRing(); animateBars(); break;
    case "practiceConfig": r.innerHTML = topbar(true) + practiceConfigView(); break;
    case "practice": r.innerHTML = topbar(false) + practiceView(); break;
    case "labs": r.innerHTML = topbar(true) + labsView(); drawRing(); break;
    case "history": r.innerHTML = topbar(true) + historyView(); break;
    default: r.innerHTML = topbar(false) + homeView();
  }
}

function errorView() {
  return `<div class="hero"><div class="eyebrow">Xatolik</div><h1>Savollar yuklanmadi</h1>
    <div class="errbox">
      <b>data/questions.json</b> yuklab bo'lmadi: <span class="mono">${esc(App.loadError)}</span><br><br>
      Ilovani <span class="mono">file://</span> orqali emas, HTTP server orqali oching. Masalan:
      <br><span class="mono">python3 -m http.server</span> — so'ng <span class="mono">http://localhost:8000/ejpt/</span>.
    </div></div>`;
}

/* ================= HOME ================= */
function homeView() {
  const hist = lsGet(LS.history, []);
  const attempts = hist.length;
  const best = attempts ? Math.max.apply(null, hist.map((h) => h.pct)) : 0;
  const pstats = lsGet(LS.practice, { answered: 0, correct: 0 });

  const bars = DOMAIN_ORDER.map((d) => {
    const dd = DOMAINS[d];
    return `<div class="dbar">
      <div class="dbar-top"><span class="dbar-name">${esc(dd.uz)}</span>
        <span class="dbar-pct" style="color:${dd.color}">${dd.weight}%</span></div>
      <div class="track"><div class="fill" data-w="${dd.weight}" style="background:${dd.color}"></div></div>
      <div class="dbar-topics">${esc(dd.topics)}</div>
    </div>`;
  }).join("");

  const resumeBanner = App.exam ? `
    <div class="card-box rise" style="border-color:var(--orange);background:var(--orange-soft);margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">
      <div><b style="color:var(--t0)">Tugallanmagan imtihon bor.</b> <span class="muted small">${App.exam.answers.filter(a=>a!=null&&a!=="").length}/${App.exam.questions.length} javob berilgan.</span></div>
      <button class="btn primary sm" onclick="EJPT.resumeExam()">${svg("arrowR",15)} Davom ettirish</button>
    </div>` : "";

  return `
  ${resumeBanner}
  <div class="hero rise">
    <div class="eyebrow">${svg("target", 13)} INE Junior Penetration Tester · 2026</div>
    <h1><span class="grad-o">eJPT</span> Mock Imtihon<br>va Mashq Testlari</h1>
    <p class="lede">100% amaliy, ochiq kitob. Har savol real lab natijasiga bog'langan — nazariy savol yo'q.
      Output'ni o'qib, IP / versiya / credential / flag toping. Hammasi o'zbek tilida.</p>
    <div class="statrow">
      <div class="pill"><div class="n">45</div><div class="l">savol</div></div>
      <div class="pill"><div class="n">48<span class="u"> soat</span></div><div class="l">vaqt</div></div>
      <div class="pill"><div class="n">70<span class="u">%</span></div><div class="l">o'tish</div></div>
      <div class="pill"><div class="n">${App.bank.length}</div><div class="l">bazada savol</div></div>
    </div>
  </div>

  <div class="section">
    <h2>Rejim tanlang</h2>
    <div class="modes">
      <button class="mode" style="--mode-c:var(--orange);--mode-soft:var(--orange-soft)" onclick="EJPT.go('examConfig')">
        <div class="m-ico">${svg("trophy", 22)}</div>
        <h3>Imtihon rejimi</h3>
        <p>45 savol, domen vazniga mos aralashgan. Taymer, oldinga/orqaga, savolni belgilash. Natija faqat oxirida.</p>
        <div class="m-go">Mock imtihonni boshlash ${svg("arrowR", 15)}</div>
      </button>
      <button class="mode" style="--mode-c:var(--blue);--mode-soft:var(--blue-soft)" onclick="EJPT.go('practiceConfig')">
        <div class="m-ico">${svg("bolt", 22)}</div>
        <h3>Mashq rejimi</h3>
        <p>Domen tanlab, cheksiz mashq. Har savoldan keyin darhol to'g'ri/noto'g'ri va izoh ko'rsatiladi.</p>
        <div class="m-go">Mashqni boshlash ${svg("arrowR", 15)}</div>
      </button>
      <button class="mode" style="--mode-c:var(--green);--mode-soft:var(--green-soft)" onclick="EJPT.go('labs')">
        <div class="m-ico">${svg("target", 22)}</div>
        <h3>Amaliy Lab <span class="mono" style="font-size:11px;color:var(--green)">TERMINAL</span></h3>
        <p>${LAB.machines.length} ta haqiqiy zaif mashina (${LAB_TOTAL_FLAGS} flag). Web Terminal orqali buzing: web zaifligi → SSH → root. Har xil daraja va har xil zaiflik.</p>
        <div class="m-go">Mashinalarni ko'rish ${svg("arrowR", 15)}</div>
      </button>
    </div>
  </div>

  <div class="section">
    <h2>Domenlar va vaznlar</h2>
    <p class="muted small">Imtihon savollari shu nisbatda taqsimlanadi. Kuchsiz sohangizni natija ekranida ko'rasiz.</p>
    <div class="dbars">${bars}</div>
  </div>

  <div class="section">
    <h2>eJPT haqida</h2>
    <div class="facts">
      <div class="fact"><div class="fn">45</div><div class="fl">savol (2026 yangilanishi; ilgari 35 edi)</div></div>
      <div class="fact"><div class="fn">48h</div><div class="fl">ochiq kitob, amaliy imtihon</div></div>
      <div class="fact"><div class="fn">5–8</div><div class="fl">skanda mashina; 1–2 tasi nishon emas</div></div>
      <div class="fact"><div class="fn">~10</div><div class="fl">boshidagi savol faqat enumeration</div></div>
      <div class="fact"><div class="fn">4–5</div><div class="fl">oxirgi savol pivoting bo'yicha</div></div>
      <div class="fact"><div class="fn">65/10/25</div><div class="fl">MCQ / Direct / Flag nisbati</div></div>
    </div>
  </div>

  ${attempts ? `<div class="section">
    <h2>Sizning natijalaringiz</h2>
    <div class="facts">
      <div class="fact"><div class="fn">${attempts}</div><div class="fl">imtihon urinishi</div></div>
      <div class="fact"><div class="fn" style="color:${best>=PASS_PCT?'var(--green)':'var(--t0)'}">${best}%</div><div class="fl">eng yaxshi ball</div></div>
      <div class="fact"><div class="fn">${pstats.answered||0}</div><div class="fl">mashqda javob berildi</div></div>
      <div class="fact"><div class="fn">${pstats.answered?Math.round(pstats.correct/pstats.answered*100):0}%</div><div class="fl">mashq aniqligi</div></div>
    </div>
    <div style="margin-top:14px"><button class="btn sm ghost" onclick="EJPT.go('history')">${svg("history",15)} Tarixni ko'rish</button></div>
  </div>` : ""}

  ${footer()}`;
}

/* ================= EXAM CONFIG ================= */
function examConfigView() {
  if (App.bank.length < MIN_BANK) {
    return `<div class="hero"><h1>Imtihon rejimi</h1><div class="errbox">Imtihon uchun kamida ${MIN_BANK} ta savol kerak (hozir ${App.bank.length}).</div></div>`;
  }
  const settings = lsGet(LS.settings, {});
  const chosen = settings.timer || "48h";
  const chips = TIMER_PRESETS.map((p) =>
    `<button class="chipbtn o ${p.id === chosen ? "on" : ""}" data-timer="${p.id}" onclick="EJPT.pickTimer('${p.id}')">
       ${esc(p.label)} · <span style="opacity:.7">${esc(p.sub)}</span></button>`).join("");
  return `
  <div class="hero rise">
    <div class="eyebrow">${svg("trophy",13)} Imtihon rejimi</div>
    <h1>Mock imtihonga tayyormisiz?</h1>
    <p class="lede">${EXAM_SIZE} ta savol domen vazniga mos aralashtiriladi. Savollar orasida erkin yurishingiz,
      qiyin savolni belgilab qo'yib keyin qaytishingiz mumkin. Ball faqat yakunlaganda ko'rsatiladi.</p>
  </div>
  <div class="section">
    <h3>Taymer</h3>
    <div class="optrow" id="timerRow">${chips}</div>
    <p class="muted small">Haqiqiy imtihon 48 soat davom etadi. Tez mashq uchun 60/90 daqiqani tanlang.</p>
  </div>
  <div class="section">
    <div class="card-box">
      <div class="facts" style="margin:0">
        <div class="fact"><div class="fn">${EXAM_SIZE}</div><div class="fl">savol</div></div>
        <div class="fact"><div class="fn">${PASS_PCT}%</div><div class="fl">o'tish balli</div></div>
        <div class="fact"><div class="fn">${DOMAIN_ORDER.length}</div><div class="fl">domen</div></div>
      </div>
    </div>
    <div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn primary" onclick="EJPT.startExam()">${svg("trophy",16)} Imtihonni boshlash</button>
      <button class="btn ghost" onclick="EJPT.go('home')">Bekor qilish</button>
    </div>
  </div>`;
}

/* ================= EXAM RUNTIME ================= */
function startExam() {
  const settings = lsGet(LS.settings, {});
  const preset = TIMER_PRESETS.find((p) => p.id === (settings.timer || "48h")) || TIMER_PRESETS[0];
  const questions = buildExamSet();
  const now = Date.now();
  App.exam = {
    questions,
    answers: new Array(questions.length).fill(null),
    flags: new Array(questions.length).fill(false),
    idx: 0,
    timerId: preset.id,
    timerTotal: preset.secs,
    startAt: now,
    endAt: now + preset.secs * 1000,
    tick: null,
  };
  persistExam();
  setView("exam");
  startTimer();
}
function persistExam() {
  if (!App.exam) return;
  const e = App.exam;
  lsSet(LS.activeExam, {
    questions: e.questions, answers: e.answers, flags: e.flags, idx: e.idx,
    timerId: e.timerId, timerTotal: e.timerTotal, startAt: e.startAt, endAt: e.endAt,
  });
}
function resumeExamIfAny() {
  const saved = lsGet(LS.activeExam, null);
  if (!saved || !Array.isArray(saved.questions)) return false;
  if (Date.now() >= saved.endAt) { lsDel(LS.activeExam); return false; }
  App.exam = Object.assign({}, saved, { tick: null });
  return true;
}
function startTimer() {
  stopTimer();
  App.exam.tick = setInterval(() => {
    const left = Math.floor((App.exam.endAt - Date.now()) / 1000);
    const el = document.getElementById("timer");
    if (el) {
      el.querySelector(".tval").textContent = fmtClock(left);
      el.classList.toggle("warn", left <= 300 && left > 60);
      el.classList.toggle("crit", left <= 60);
    }
    if (left <= 0) { stopTimer(); finishExam(true); }
  }, 1000);
}
function stopTimer() { if (App.exam && App.exam.tick) { clearInterval(App.exam.tick); App.exam.tick = null; } }

function examView() {
  const e = App.exam;
  if (!e) return homeView();
  const q = e.questions[e.idx];
  const left = Math.floor((e.endAt - Date.now()) / 1000);
  const answeredCount = e.answers.filter((a) => a != null && a !== "").length;

  const palette = e.questions.map((qq, i) => {
    const cls = [
      "pdot",
      (e.answers[i] != null && e.answers[i] !== "") ? "answered" : "",
      i === e.idx ? "current" : "",
      e.flags[i] ? "flagged" : "",
    ].join(" ").trim();
    return `<button class="${cls}" onclick="EJPT.goQ(${i})">${i + 1}</button>`;
  }).join("");

  return `
  <div class="qwrap">
    <div class="exam-top">
      <div class="timer ${left<=60?'crit':left<=300?'warn':''}" id="timer">
        <span class="dotlive"></span><span class="tval">${fmtClock(left)}</span>
      </div>
      <div class="qmeta">
        <span class="qcount"><b>${answeredCount}</b>/${e.questions.length} javob berildi</span>
        <button class="btn sm primary" onclick="EJPT.confirmFinish()">Yakunlash</button>
      </div>
    </div>

    <div class="palette">${palette}</div>

    ${questionCard(q, e.idx, e.questions.length, e.answers[e.idx], false, e.flags[e.idx])}

    <div class="qnav">
      <button class="btn" ${e.idx===0?"disabled":""} onclick="EJPT.prevQ()">${svg("arrowL",15)} Oldingi</button>
      <button class="btn ghost sm ${e.flags[e.idx]?'':'ghost'}" onclick="EJPT.toggleFlag()" style="${e.flags[e.idx]?'border-color:var(--amber);color:var(--amber)':''}">
        ${svg("flag",15)} ${e.flags[e.idx] ? "Belgilangan" : "Belgilash"}
      </button>
      <div class="spacer"></div>
      ${e.idx === e.questions.length - 1
        ? `<button class="btn blue" onclick="EJPT.confirmFinish()">${svg("check",15)} Yakunlash</button>`
        : `<button class="btn" onclick="EJPT.nextQ()">Keyingi ${svg("arrowR",15)}</button>`}
    </div>
  </div>`;
}

/* shared question card (used by exam + practice)
   feedback=true shows correctness (practice, after answering) */
function questionCard(q, idx, total, userAns, feedback, flagged) {
  const dd = DOMAINS[q.domain];
  const diffClass = "diff-" + (q.difficulty || "medium");
  const toolTags = (q.tools || []).slice(0, 4).map((t) => `<span class="tag">${esc(t)}</span>`).join("");

  let answerBlock = "";
  if (q.type === "mcq") {
    answerBlock = `<div class="opts">` + q.options.map((opt, i) => {
      const letter = String.fromCharCode(65 + i);
      let cls = "opt";
      if (feedback) {
        cls += " locked";
        if (answersMatch(opt, q.answer)) cls += " correct";
        else if (answersMatch(opt, userAns)) cls += " wrong";
      } else if (answersMatch(opt, userAns)) { cls += " sel"; }
      const handler = feedback ? "" : `onclick="EJPT.answerMCQ(${i})"`;
      return `<button class="${cls}" ${handler}><span class="key">${letter}</span><span class="mono">${esc(opt)}</span></button>`;
    }).join("") + `</div>`;
  } else {
    const val = userAns == null ? "" : userAns;
    let inCls = "";
    if (feedback) inCls = answersMatch(userAns, q.answer) ? "ok" : "no";
    answerBlock = `<div class="ansbox">
      <label>${q.type === "flag" ? "Flag qiymatini kiriting" : "Javobni kiriting"}</label>
      <div class="inrow">
        <input id="ansInput" class="${inCls}" ${feedback ? "disabled" : ""} value="${esc(val)}"
          placeholder="${q.type === "flag" ? "EJPT{...}" : "javob…"}" autocomplete="off" spellcheck="false"
          onkeydown="if(event.key==='Enter'){${feedback ? "" : "EJPT.submitText()"}}">
        ${feedback ? "" : `<button class="btn blue" onclick="EJPT.submitText()">${svg("check",15)}</button>`}
      </div>
    </div>`;
  }

  return `
  <div class="qcard rise">
    <div class="qbar">
      <div class="qmeta">
        <span class="tag" style="color:${dd.color};border-color:${dd.color}">${esc(dd.short)}</span>
        <span class="tag">${TYPE_LABEL[q.type] || q.type}</span>
        ${toolTags}
      </div>
      <div class="qmeta">
        <span class="difftag ${diffClass}">${esc(q.difficulty || "medium")}</span>
        <span class="qcount">${idx + 1}<span class="muted">/${total}</span></span>
      </div>
    </div>
    <div class="qtext">${esc(q.question)}</div>
    ${q.scenario ? terminalBlock(q.scenario, q.tools) : ""}
    ${answerBlock}
  </div>`;
}

function terminalBlock(text, tools) {
  const label = (tools && tools[0]) ? tools[0] : "terminal";
  return `<div class="term">
    <div class="term-top"><i class="r"></i><i class="y"></i><i class="g"></i><span class="lbl">${esc(label)}</span></div>
    <pre>${esc(text)}</pre>
  </div>`;
}

/* ================= EXAM finish + result ================= */
function finishExam(auto) {
  stopTimer();
  const e = App.exam;
  if (!e) return;
  const perDomain = {};
  DOMAIN_ORDER.forEach((d) => { perDomain[d] = { correct: 0, total: 0 }; });
  const review = [];
  let correct = 0;
  e.questions.forEach((q, i) => {
    const ua = e.answers[i];
    const ok = ua != null && answersMatch(ua, q.answer);
    if (ok) correct++;
    perDomain[q.domain].total++;
    if (ok) perDomain[q.domain].correct++;
    review.push({ q, userAns: ua, ok });
  });
  const total = e.questions.length;
  const pct = Math.round((correct / total) * 100);
  const durationSec = Math.floor((Date.now() - e.startAt) / 1000);
  const clampedDuration = Math.min(durationSec, e.timerTotal);

  App.examResult = { correct, total, pct, pass: pct >= PASS_PCT, perDomain, review, durationSec: clampedDuration, auto };

  // save to history (keep last 30)
  const hist = lsGet(LS.history, []);
  hist.unshift({
    ts: Date.now(), mode: "exam", score: correct, total, pct, pass: pct >= PASS_PCT,
    durationSec: clampedDuration, timer: e.timerId,
    domains: DOMAIN_ORDER.map((d) => ({ d, c: perDomain[d].correct, t: perDomain[d].total })),
  });
  lsSet(LS.history, hist.slice(0, 30));
  lsDel(LS.activeExam);
  App.exam = null;
  setView("examResult");
}

function examResultView() {
  const r = App.examResult;
  if (!r) return homeView();
  const ringColor = r.pass ? "var(--green)" : "var(--red)";

  const breakdown = DOMAIN_ORDER.map((d) => {
    const dd = DOMAINS[d], s = r.perDomain[d];
    const pct = s.total ? Math.round((s.correct / s.total) * 100) : 0;
    return `<div class="rrow">
      <div class="rrow-top"><span class="rrow-name">${esc(dd.uz)}</span>
        <span class="rrow-sc">${s.correct}/${s.total} · ${pct}%</span></div>
      <div class="track"><div class="fill" data-w="${pct}" style="background:${dd.color}"></div></div>
    </div>`;
  }).join("");

  const wrong = r.review.filter((x) => !x.ok);
  const reviewHtml = wrong.length
    ? wrong.map(reviewItem).join("")
    : `<div class="fb ok"><div class="fb-h">${svg("check",16)} Barcha savollar to'g'ri!</div></div>`;

  return `
  <div class="hero rise">
    <div class="eyebrow">${svg("trophy",13)} Imtihon natijasi</div>
    <h1>${r.pass ? "Tabriklaymiz — <span class='grad-o'>O'tdingiz</span>" : "Bu safar <span style='color:var(--red)'>o'tmadingiz</span>"}</h1>
    <div class="ring-wrap" style="margin-top:18px">
      <div class="ring" id="ring" data-pct="${r.pct}" data-color="${ringColor}">
        <svg width="150" height="150" viewBox="0 0 150 150">
          <circle cx="75" cy="75" r="64" fill="none" stroke="var(--border)" stroke-width="11"/>
          <circle class="rc" cx="75" cy="75" r="64" fill="none" stroke="${ringColor}" stroke-width="11"
            stroke-dasharray="${(2*Math.PI*64).toFixed(1)}" stroke-dashoffset="${(2*Math.PI*64).toFixed(1)}"/>
        </svg>
        <div class="rlabel"><div class="rp" style="color:${ringColor}">${r.pct}%</div><div class="rs">${r.correct}/${r.total} to'g'ri</div></div>
      </div>
      <div>
        <div class="verdict ${r.pass?'pass':'fail'}">${r.pass?svg("check",16):svg("x",16)} ${r.pass?"O'TDINGIZ":"O'TMADINGIZ"} · ${PASS_PCT}% kerak</div>
        <div class="facts" style="margin-top:16px">
          <div class="fact"><div class="fn">${r.correct}<span class="muted" style="font-size:14px">/${r.total}</span></div><div class="fl">to'g'ri javob</div></div>
          <div class="fact"><div class="fn" style="font-size:16px">${fmtDuration(r.durationSec)}</div><div class="fl">sarflangan vaqt</div></div>
        </div>
        ${r.auto?`<p class="muted small" style="margin-top:10px">⏱ Vaqt tugadi — avtomatik yakunlandi.</p>`:""}
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Domenlar bo'yicha tahlil</h2>
    <p class="muted small">Eng past ustun — mashq qilish kerak bo'lgan soha.</p>
    <div class="rbreak">${breakdown}</div>
  </div>

  <div class="section">
    <h2>Noto'g'ri javoblar (${wrong.length})</h2>
    <div class="review">${reviewHtml}</div>
  </div>

  <div class="section" style="display:flex;gap:10px;flex-wrap:wrap">
    <button class="btn primary" onclick="EJPT.go('examConfig')">${svg("trophy",16)} Yana urinish</button>
    <button class="btn blue" onclick="EJPT.go('practiceConfig')">${svg("bolt",15)} Mashq qilish</button>
    <button class="btn ghost" onclick="EJPT.go('home')">${svg("home",15)} Bosh sahifa</button>
  </div>
  ${footer()}`;
}

function reviewItem(x) {
  const q = x.q, dd = DOMAINS[q.domain];
  return `<div class="rev">
    <div class="rev-q"><span class="tag" style="color:${dd.color};border-color:${dd.color};margin-right:6px">${esc(dd.short)}</span>${esc(q.question)}</div>
    ${q.scenario ? terminalBlock(q.scenario, q.tools) : ""}
    <div class="rev-line"><span class="k">Sizning javobingiz: </span><span class="rev-your">${x.userAns ? esc(x.userAns) : "— (bo'sh)"}</span></div>
    <div class="rev-line"><span class="k">To'g'ri javob: </span><span class="rev-corr">${esc(q.answer)}</span></div>
    ${q.explanation ? `<div class="rev-exp">${esc(q.explanation)}</div>` : ""}
  </div>`;
}

/* ================= PRACTICE ================= */
function practiceConfigView() {
  const counts = {};
  DOMAIN_ORDER.forEach((d) => { counts[d] = App.bank.filter((q) => q.domain === d).length; });
  const chips = DOMAIN_ORDER.map((d) => {
    const dd = DOMAINS[d];
    return `<button class="chipbtn" data-dom="${d}" onclick="EJPT.togglePracticeDomain('${d}',this)">
      ${esc(dd.uz)} <span class="muted">(${counts[d]})</span></button>`;
  }).join("");
  return `
  <div class="hero rise">
    <div class="eyebrow">${svg("bolt",13)} Mashq rejimi</div>
    <h1>Domen tanlang</h1>
    <p class="lede">Bir yoki bir nechta domen tanlang (yoki hech narsa tanlamang — hammasi). Har javobdan keyin
      darhol izoh ko'rasiz. Cheksiz — to'xtaganingizcha davom etadi.</p>
  </div>
  <div class="section">
    <div class="optrow" id="pdoms">${chips}</div>
    <div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn blue" onclick="EJPT.startPractice()">${svg("bolt",16)} Mashqni boshlash</button>
      <button class="btn ghost" onclick="EJPT.go('home')">Bekor qilish</button>
    </div>
  </div>`;
}

let _practiceDomains = new Set();
function togglePracticeDomain(d, btn) {
  if (_practiceDomains.has(d)) { _practiceDomains.delete(d); btn.classList.remove("on"); }
  else { _practiceDomains.add(d); btn.classList.add("on"); }
}
function startPractice() {
  const doms = _practiceDomains.size ? Array.from(_practiceDomains) : DOMAIN_ORDER.slice();
  const pool = App.bank.filter((q) => doms.indexOf(q.domain) !== -1);
  if (!pool.length) return;
  App.practice = {
    doms, order: shuffle(pool).map(prepareQuestion), idx: 0,
    answered: 0, correct: 0, curAns: null, revealed: false,
  };
  setView("practice");
}
function practiceView() {
  const p = App.practice;
  if (!p) return homeView();
  if (p.idx >= p.order.length) { p.order = shuffle(p.order); p.idx = 0; } // loop
  const q = p.order[p.idx];
  const acc = p.answered ? Math.round((p.correct / p.answered) * 100) : 0;

  let feedbackHtml = "";
  if (p.revealed) {
    const ok = answersMatch(p.curAns, q.answer);
    feedbackHtml = `<div class="fb ${ok ? "ok" : "no"} rise">
      <div class="fb-h">${ok ? svg("check",16) + " To'g'ri!" : svg("x",16) + " Noto'g'ri"}</div>
      ${ok ? "" : `<div class="fb-ans">To'g'ri javob: <b>${esc(q.answer)}</b></div>`}
      ${q.explanation ? `<div class="fb-exp">${esc(q.explanation)}</div>` : ""}
    </div>`;
  }

  return `
  <div class="qwrap">
    <div class="qbar">
      <div class="qmeta">
        <span class="tag d">${svg("bolt",13)} Mashq</span>
        <span class="qcount">${p.doms.length === DOMAIN_ORDER.length ? "Barcha domen" : p.doms.map((d)=>DOMAINS[d].short).join(" · ")}</span>
      </div>
      <div class="qmeta">
        <span class="qcount"><b>${p.correct}</b>/${p.answered} to'g'ri · ${acc}%</span>
      </div>
    </div>

    ${questionCard(q, p.idx, p.order.length, p.curAns, p.revealed, false)}
    ${feedbackHtml}

    <div class="qnav">
      <button class="btn ghost" onclick="EJPT.go('home')">${svg("home",15)} Chiqish</button>
      <div class="spacer"></div>
      ${p.revealed
        ? `<button class="btn blue" onclick="EJPT.nextPractice()">Keyingi savol ${svg("arrowR",15)}</button>`
        : `<span class="muted small">Javob bering…</span>`}
    </div>
  </div>`;
}

/* ================= HISTORY ================= */
function historyView() {
  const hist = lsGet(LS.history, []);
  if (!hist.length) {
    return `<div class="hero"><div class="eyebrow">${svg("history",13)} Tarix</div>
      <h1>Hali natija yo'q</h1><p class="lede">Imtihon topshiring — natijalaringiz shu yerda saqlanadi.</p>
      <div style="margin-top:18px"><button class="btn primary" onclick="EJPT.go('examConfig')">Imtihonni boshlash</button></div></div>`;
  }
  const rows = hist.map((h) => {
    const passCls = h.pass ? "var(--green)" : "var(--red)";
    return `<div class="hrow">
      <div>
        <div style="font-weight:600;color:var(--t0)">${h.score}/${h.total} · <span style="color:${passCls}">${h.pct}%</span></div>
        <div class="hmeta">${fmtDate(h.ts)} · ${fmtDuration(h.durationSec)} · ${esc(h.timer||"")}</div>
      </div>
      <div class="hsc" style="color:${passCls}">${h.pass ? "O'TDI" : "O'TMADI"}</div>
    </div>`;
  }).join("");
  return `
  <div class="hero"><div class="eyebrow">${svg("history",13)} Tarix</div><h1>Imtihon tarixi</h1></div>
  <div class="section">
    <div class="htable">${rows}</div>
    <div style="margin-top:18px"><button class="btn ghost sm" onclick="EJPT.clearHistory()">${svg("trash",15)} Tarixni tozalash</button></div>
  </div>
  ${footer()}`;
}

/* ================= AMALIY LAB (Docker) ================= */
function labFlagsSolved() {
  const s = lsGet(LS.labFlags, []);
  return new Set(Array.isArray(s) ? s : []);
}
function labsView() {
  const solved = labFlagsSolved();
  const done = solved.size;
  const pct = Math.round((done / LAB_TOTAL_FLAGS) * 100);
  const col = done === LAB_TOTAL_FLAGS ? "var(--green)" : "var(--orange)";
  const diffCls = { easy: "diff-easy", medium: "diff-medium", hard: "diff-hard" };

  // host-discovery: labnet IP xaritasi (internal-04 faqat pivot orqali)
  const hosts = LAB.machines.map((m) => {
    const via = m.ip.indexOf("10.10.10.") === 0 ? "   (pivot orqali — web-01 dan)" : "";
    return `Host <span class="hl">${m.ip.padEnd(13)}</span> up   <span style="color:var(--t3)">${esc(m.name)}${via}</span>`;
  }).join("\n");

  const cards = LAB.machines.map((m) => {
    const flags = m.flags.map((f) => {
      const ok = solved.has(f.id);
      return `<div class="labflag ${ok ? "solved" : ""}">
          <span class="lf-label">${svg(ok ? "check" : "flag", 14)} ${esc(f.label)}</span>
          ${ok
            ? `<span class="lf-ok">Topildi ✓</span>`
            : `<span class="lf-in"><input id="lf_${f.id}" placeholder="EJPT{...}" spellcheck="false" autocomplete="off"
                 onkeydown="if(event.key==='Enter')EJPT.submitLabFlag('${f.id}')">
               <button class="btn sm blue" onclick="EJPT.submitLabFlag('${f.id}')">Tekshirish</button></span>`}
        </div>`;
    }).join("");
    return `<div class="labcard">
      <div class="labcard-top">
        <div><span class="labname">${esc(m.name)}</span>
          <span class="labalias mono">${esc(m.ip)}</span></div>
        <span class="difftag ${diffCls[m.diff]}">${esc(m.diff)}</span>
      </div>
      <p class="labobj"><span class="mono" style="color:var(--t3)">ZAIFLIK:</span> ${esc(m.vuln)}</p>
      <p class="labobj"><span class="mono" style="color:var(--t3)">YO'L:</span> ${esc(m.path)}</p>
      <div class="labflags">${flags}</div>
    </div>`;
  }).join("");

  const circ = (2 * Math.PI * 64).toFixed(1);
  return `
  <div class="hero rise">
    <div class="eyebrow">${svg("target", 13)} Amaliy Lab · haqiqiy Docker mashinalari</div>
    <h1>Virtual mashinalarni <span class="grad-o">buzing</span></h1>
    <p class="lede">${LAB.machines.length} ta haqiqiy zaif mashina, ${LAB_TOTAL_FLAGS} ta flag.
      Dashboard'dagi <b>«Web Terminal»</b>ni oching → <span class="mono">nmap</span> bilan skanerlang →
      web zaifligidan SSH ma'lumoti (parol yoki <b>hash</b>) oling → SSH → oddiy user → <b>root</b>.
      Har mashina turli daraja va turli zaiflik.</p>
    <div class="ring-wrap" style="margin-top:18px">
      <div class="ring" id="ring" data-pct="${pct}" data-color="${col}">
        <svg width="150" height="150" viewBox="0 0 150 150">
          <circle cx="75" cy="75" r="64" fill="none" stroke="var(--border)" stroke-width="11"/>
          <circle class="rc" cx="75" cy="75" r="64" fill="none" stroke="${col}" stroke-width="11"
            stroke-dasharray="${circ}" stroke-dashoffset="${circ}"/>
        </svg>
        <div class="rlabel"><div class="rp" style="color:${col}">${done}/${LAB_TOTAL_FLAGS}</div><div class="rs">flag</div></div>
      </div>
      <div style="flex:1;min-width:280px">
        <h3>Tarmoq xaritasi (IP)</h3>
        <div class="term"><div class="term-top"><i class="r"></i><i class="y"></i><i class="g"></i><span class="lbl">host discovery</span></div>
<pre>$ nmap -sn 10.10.20.0/24
${hosts}</pre></div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Mashinalar</h2>
    <p class="muted small">Web Terminal'ni oching → mashinani skanerlang → web zaifligidan foydalanib SSH ma'lumotini (parol yoki hash) oling → SSH → root'ga ko'tariling. Topgan flaglaringizni shu yerga kiriting.</p>
    <div class="labgrid">${cards}</div>
  </div>

  <div class="section" style="display:flex;gap:10px;flex-wrap:wrap">
    <button class="btn ghost" onclick="EJPT.go('home')">${svg("home", 15)} Bosh sahifa</button>
    ${done > 0 ? `<button class="btn ghost sm" onclick="EJPT.resetLab()">${svg("trash", 15)} Progressni tozalash</button>` : ""}
  </div>
  ${footer()}`;
}
async function submitLabFlag(flagId) {
  const inp = document.getElementById("lf_" + flagId);
  if (!inp) return;
  const val = inp.value.trim();
  if (!val) return;
  let expected = null;
  LAB.machines.forEach((m) => m.flags.forEach((f) => { if (f.id === flagId) expected = f.hash; }));
  if (!expected) return;
  let hex = null;
  try {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(val));
    hex = Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch (e) { hex = null; }
  if (hex === expected) {
    const s = lsGet(LS.labFlags, []);
    const arr = Array.isArray(s) ? s : [];
    if (arr.indexOf(targetId) === -1) { arr.push(targetId); lsSet(LS.labFlags, arr); }
    render(); drawRing();
  } else {
    inp.classList.add("no"); inp.value = ""; inp.placeholder = "Noto'g'ri — qayta urining";
  }
}

/* ================= shared bits ================= */
function footer() {
  return `<div class="foot">
    eJPT Practice · o'quv maqsadida · barcha ssenariylar va IP/flag qiymatlari namoyish uchun to'qilgan.<br>
    eJPT / INE — INE Security'ning tovar belgilari; bu ilova mustaqil mashq vositasi.
  </div>`;
}
function drawRing() {
  const ring = document.getElementById("ring");
  if (!ring) return;
  const pct = +ring.getAttribute("data-pct");
  const circ = 2 * Math.PI * 64;
  const off = circ * (1 - pct / 100);
  const rc = ring.querySelector(".rc");
  requestAnimationFrame(() => { rc.style.strokeDashoffset = off.toFixed(1); });
}
function animateBars() {
  requestAnimationFrame(() => {
    document.querySelectorAll(".fill[data-w]").forEach((el) => {
      el.style.width = (+el.getAttribute("data-w")) + "%";
    });
  });
}

/* ================= public controller (EJPT.*) ================= */
const EJPT = {
  go(view) {
    if (view === "practiceConfig") _practiceDomains = new Set();
    // leaving an active exam via nav is handled by confirmHome()
    setView(view);
  },
  confirmHome() {
    if (App.view === "exam" && App.exam) {
      if (!confirm("Imtihondan chiqasizmi? Progress saqlanadi va keyin davom ettirishingiz mumkin.")) return;
      persistExam(); stopTimer();
    }
    setView("home");
  },
  // exam config
  pickTimer(id) {
    const s = lsGet(LS.settings, {}); s.timer = id; lsSet(LS.settings, s);
    document.querySelectorAll("#timerRow .chipbtn").forEach((b) =>
      b.classList.toggle("on", b.getAttribute("data-timer") === id));
  },
  startExam() { startExam(); },
  resumeExam() { if (App.exam) { setView("exam"); startTimer(); } },
  // exam runtime — answerMCQ / submitText are assigned below (view-aware)
  prevQ() { if (App.exam.idx > 0) { App.exam.idx--; persistExam(); render(); } },
  nextQ() { if (App.exam.idx < App.exam.questions.length - 1) { App.exam.idx++; persistExam(); render(); } },
  goQ(i) { App.exam.idx = i; persistExam(); render(); },
  toggleFlag() { App.exam.flags[App.exam.idx] = !App.exam.flags[App.exam.idx]; persistExam(); render(); },
  confirmFinish() {
    const e = App.exam;
    const unanswered = e.answers.filter((a) => a == null || a === "").length;
    const msg = unanswered
      ? `${unanswered} ta savol javobsiz qoldi. Baribir yakunlaysizmi?`
      : "Imtihonni yakunlab, natijani ko'rasizmi?";
    if (confirm(msg)) finishExam(false);
  },
  // practice
  togglePracticeDomain(d, btn) { togglePracticeDomain(d, btn); },
  startPractice() { startPractice(); },
  nextPractice() {
    const p = App.practice;
    p.idx++; p.curAns = null; p.revealed = false;
    render();
  },
  // practice answering is routed through answerMCQ/submitText depending on view:
  // labs
  submitLabFlag(id) { submitLabFlag(id); },
  resetLab() { if (confirm("Lab flag progressini tozalaysizmi?")) { lsDel(LS.labFlags); render(); } },
  // history
  clearHistory() {
    if (confirm("Barcha imtihon tarixini o'chirasizmi?")) { lsDel(LS.history); lsDel(LS.practice); render(); }
  },
};

/* view-aware answer handlers (exam vs practice) — MCQ passes the option INDEX
   so arbitrary option text never has to survive an inline onclick string */
function currentQuestion() {
  if (App.view === "practice" && App.practice) return App.practice.order[App.practice.idx];
  if (App.exam) return App.exam.questions[App.exam.idx];
  return null;
}
function answerMCQ(i) {
  const q = currentQuestion();
  if (!q || !q.options) return;
  const opt = q.options[i];
  if (opt == null) return;
  if (App.view === "practice") {
    const p = App.practice;
    if (p.revealed) return;
    p.curAns = opt; p.revealed = true;
    const ok = answersMatch(opt, q.answer);
    p.answered++; if (ok) p.correct++;
    savePracticeStat(ok);
    render();
  } else if (App.exam) {
    App.exam.answers[App.exam.idx] = opt; persistExam(); render();
  }
}
function submitText() {
  if (App.view === "practice") {
    const inp = document.getElementById("ansInput");
    if (!inp) return;
    const p = App.practice;
    if (p.revealed) return;
    if (normalize(inp.value) === "") return;
    p.curAns = inp.value; p.revealed = true;
    p.answered++; const ok = answersMatch(inp.value, p.order[p.idx].answer);
    if (ok) p.correct++;
    savePracticeStat(ok);
    render();
  } else if (App.exam) {
    const inp = document.getElementById("ansInput");
    if (!inp) return;
    App.exam.answers[App.exam.idx] = inp.value; persistExam();
    if (App.exam.idx < App.exam.questions.length - 1) App.exam.idx++;
    render();
  }
}
function savePracticeStat(ok) {
  const s = lsGet(LS.practice, { answered: 0, correct: 0 });
  s.answered = (s.answered || 0) + 1;
  if (ok) s.correct = (s.correct || 0) + 1;
  lsSet(LS.practice, s);
}
// wire the view-aware handlers into the controller
EJPT.answerMCQ = answerMCQ;
EJPT.submitText = submitText;

/* ================= boot ================= */
(async function boot() {
  App.root = document.getElementById("app");
  App.root.innerHTML = topbar(false) + `<div class="section muted">Savollar yuklanmoqda…</div>`;
  await loadBank();
  window.EJPT = EJPT;
  // reconstruct an interrupted exam into memory (home shows a resume banner)
  if (!App.loadError) resumeExamIfAny();
  render();
})();
