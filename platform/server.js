/* ============================================================
   CyberSecurity Platform — backend (pure Node.js, no npm deps)
   Auth (register/login), RBAC (admin grants access), module gating,
   VM control (docker restart), and a web-terminal proxy to ttyd.
   Run:  node server.js    (PORT env, default 8080)
   ============================================================ */
"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const net = require("net");
const { execFile } = require("child_process");

const ROOT = process.env.REPO_ROOT ? path.resolve(process.env.REPO_ROOT) : path.resolve(__dirname, ".."); // repo root (modules)
const PUB = path.join(__dirname, "public");            // platform frontend
const DATA = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(__dirname, "data");
const USERS_FILE = path.join(DATA, "users.json");
const SECRET_FILE = path.join(DATA, "secret");
const PORT = parseInt(process.env.PORT || "8080", 10);
const TTYD_HOST = process.env.TTYD_HOST || "127.0.0.1";
const TTYD_PORT = parseInt(process.env.TTYD_PORT || "7681", 10);

if (!fs.existsSync(DATA)) fs.mkdirSync(DATA, { recursive: true });

/* ---------- grantable resources ---------- */
const MODULES = [
  { id: "windows", name: "Windows", path: "/windows/index.html" },
  { id: "kali", name: "Kali Linux", path: "/kali/index.html" },
  { id: "network", name: "Network", path: "/network/index.html" },
  { id: "web-pentest", name: "Web-Pentest", path: "/web-pentest/index.html" },
  { id: "books", name: "Kutubxona", path: "/books/index.html" },
  { id: "ctf", name: "CTF", path: "/ctf/index.html" },
  // { id: "ejpt", name: "eJPT Practice", path: "/ejpt/index.html" },  // vaqtincha yashirilgan
];
const VMS = [
  { id: "ctf-web", container: "ejpt-ctf-web", name: "ctf-web (Nimbus Reports) — MEDIUM", ip: "10.10.20.60" },
  { id: "web-easy", container: "ejpt-web-easy", name: "web-easy (shopzone) — EASY", ip: "10.10.20.40" },
  { id: "linux-02", container: "ejpt-linux-02", name: "linux-02 (backend) — easy", ip: "10.10.20.20" },
  { id: "web-01", container: "ejpt-web-01", name: "web-01 (acme.lab) — MEDIUM", ip: "10.10.20.10" },
  { id: "smb-03", container: "ejpt-smb-03", name: "smb-03 (fileserver) — medium", ip: "10.10.20.30" },
  { id: "web-hard", container: "ejpt-web-hard", name: "web-hard (monitorpanel) — HARD", ip: "10.10.20.50" },
  { id: "internal-04", container: "ejpt-internal-04", name: "internal-04 (vault, pivot) — hard", ip: "10.10.10.20" },
];
// ---- CTF challenges (flaglar SERVER tomonda tekshiriladi; klientga yuborilmaydi) ----
// Zaiflik turlari OSHKOR QILINMAYDI — faqat nom, daraja, umumiy hintlar.
const CTFS = [
  {
    id: "nimbus",
    name: "Nimbus Reports",
    difficulty: "medium",
    targetPort: 8085,               // nishon shu portda (host IP + shu port)
    flags: [
      "EJPT{id0r_burp_r3p0rt_z3r0}",
      "EJPT{3nc0d3d_b4ckup_l34k}",
      "EJPT{w4f_byp4ss_x55_r3fl3ct}",
      "EJPT{ssrf_d3c1m4l_2_l0c4l}",
    ],
    hints: [
      "Recon avval. Menyudagi havolalar hammasi emas — gobuster/dirb bilan yashirin sahifa va fayllarni toping (`-x php,txt`); robots.txt va sahifa manbasini (view-source) o'qing. Bitta wordlist yetmasa, kattarog'ini (directory-list-2.3-medium) sinang.",
      "Topgan har sahifada funksiyani sinang: tugma, qidiruv maydoni, so'rov TANASI (Burp bilan ushlang). Ketma-ket ID/raqamlarni chegaradan tashqariga (masalan eng kichigidan pastga) o'zgartirib ko'ring — server ularni ishonib qabul qilishi mumkin.",
      "Ba'zi endpointlar to'g'ridan-to'g'ri kirsangiz **403** qaytaradi — ular faqat ILOVA ICHIDAN ochiladi. Ikki yo'l: (a) server sizning o'rningizga so'rov yuborsa (havola yuklovchi/preview funksiya), yoki (b) brauzeringizda o'sha sayt ichida siz kiritgan kod ishlab ketsa (kiritma aks etadigan joy).",
      "Filtrlar ko'pincha to'liq emas — bitta vektor bloklansa, boshqasini sinang (XSS cheat-sheet: `<svg>`, `<img>`, `<body>`...). Manzil filtri localhost'ni SATR bo'yicha tekshirsa — o'sha IP'ni boshqacha yozing. Ko'z bilan o'qilmaydigan matn kodlangan (base64) bo'lishi mumkin.",
    ],
    // Bonus hint: qolgan flaglarni topib, faqat mana shu bittasi qolsa ko'rsatiladi.
    // Payload SKELETI beriladi, lekin ENDPOINT yashirin — foydalanuvchi o'zi topadi.
    bonus: {
      flagIndex: 2,        // XSS flag (flags[] dagi indeks)
      needSolved: 3,       // shu ko'p flag topilib, XSS qolsa
      payload: "<svg onload=\"fetch('/????').then(r=>r.text()).then(alert)\">",
      note: "Ajoyib — 3 tasini topding, XSS qoldi! Mana ishlaydigan payload SKELETI (WAF'ni <svg onload> aylanib o'tadi). `/????` o'rniga TO'G'RI endpointni O'ZING qo'y — u recon bilan topiladi va to'g'ridan-to'g'ri kirsang 403 qaytaradi (uni faqat ilova ichidan, XSS bilan o'qisang bo'ladi).",
    },
  },
  {
    id: "orbit",
    name: "Orbit Ops",
    difficulty: "hard",
    targetPort: 8086,               // mustaqil Python nishoni (lab/hard-ctf)
    flags: [
      "EJPT{un10n_c0mment_byp4ss_5qli}",   // 1) filtered UNION SQLi
      "EJPT{h3x_ip_ssrf_1nt3rn4l_piv0t}",  // 2) SSRF -> internal
      "EJPT{tr4v3rs3_2_0rb1t_s3cr3t_cfg}", // 3) LFI via SSRF
      "EJPT{r00t_rce_d3pl0y_ch41n_pwn3d}", // 4) command injection (master)
    ],
    hints: [
      "Recon: /docs.html va Console sahifa manbasi public API'ni ko'rsatadi; /robots.txt esa 'host-only' /internal/ oilasini oshkor qiladi (to'g'ridan-to'g'ri kirsang 401). Zaifliklar zanjiri shu endpointlar atrofida quriladi.",
      "Node lookup id'ni raqamli SQL kontekstida ishonib qabul qiladi, lekin sodda inyeksiya filtrlanadi (probel va ba'zi kalit so'zlar bloklangan). Filtr ko'pincha SQL komenti bilan aylanib o'tiladi — probel o'rniga /**/ ishlating; oddiy id javobi ustunlar sonini beradi, UNION bilan boshqa jadvalni o'qing.",
      "URL-fetcher aniq loopback satrlarini — hatto decimalni (2130706433) — rad etadi. 127.0.0.1 ni boshqa asosda yozish mumkin (hex yoki octal). U bilan host-only /internal API'ga o'ting; uning bosh sahifasi qolgan ichki yo'llarni sanab beradi.",
      "Ichki log endpointi faylni yo'lga QO'SHADI — katalogdan chiqish (../) bilan maxfiy configni o'qing. So'ng deploy endpointiga SQLi'dan olingan token kerak; u 'image' tegini shell buyrug'i ichida ishonib ishlatadi — buyruqni ; bilan ajratib root faylini o'qing, qolganini # bilan komment qiling.",
    ],
    bonus: {
      flagIndex: 3,        // command injection (master) flag
      needSolved: 3,       // qolgan 3 tasi topilib, shu bittasi qolsa
      payload: "POST /api/v1/deploy — image=app:1.0; <BUYRUQ> #   (token: SQLi'dan olingan deploy_token)",
      note: "Zo'r — 3 tasini topding! Oxirgisi command injection. Deploy 'image' qiymatini shell buyrug'iga qo'shadi: ; bilan o'z buyrug'ingizni ulang, # bilan qolganini komment qiling. <BUYRUQ> o'rniga root flag faylini O'QIYDIGAN buyruqni O'ZING yozing (masalan cat bilan).",
    },
  },
];
const CTF_BY_ID = Object.fromEntries(CTFS.map((c) => [c.id, c]));
// Bonus hint faqat kerakli shartda: qolganlari topilgan, mo'ljaldagi flag hali topilmagan.
function ctfBonus(c, solved) {
  if (c.bonus && solved.length >= c.bonus.needSolved && solved.indexOf(c.bonus.flagIndex) === -1) {
    return { payload: c.bonus.payload, note: c.bonus.note };
  }
  return null;
}
const MODULE_IDS = MODULES.map((m) => m.id);
// resources the admin can grant: modules + the web terminal
const GRANTABLE = MODULE_IDS.concat(["terminal"]);

/* ---------- secret + store ---------- */
function getSecret() {
  try { return fs.readFileSync(SECRET_FILE); }
  catch (e) { const s = crypto.randomBytes(32); fs.writeFileSync(SECRET_FILE, s, { mode: 0o600 }); return s; }
}
const SECRET = getSecret();

function readUsers() {
  try { return JSON.parse(fs.readFileSync(USERS_FILE, "utf8")); } catch (e) { return []; }
}
function writeUsers(u) { fs.writeFileSync(USERS_FILE, JSON.stringify(u, null, 2)); }

/* ---------- password hashing (scrypt) ---------- */
function hashPassword(pw) {
  const salt = crypto.randomBytes(16);
  const dk = crypto.scryptSync(pw, salt, 64);
  return salt.toString("hex") + ":" + dk.toString("hex");
}
function verifyPassword(pw, stored) {
  try {
    const [saltHex, hashHex] = stored.split(":");
    const dk = crypto.scryptSync(pw, Buffer.from(saltHex, "hex"), 64);
    return crypto.timingSafeEqual(dk, Buffer.from(hashHex, "hex"));
  } catch (e) { return false; }
}

/* ---------- session tokens (HMAC-signed) ---------- */
function b64u(buf) { return Buffer.from(buf).toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_"); }
function ub64u(s) { s = s.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "="; return Buffer.from(s, "base64"); }
function signToken(payload) {
  const body = b64u(JSON.stringify(payload));
  const sig = b64u(crypto.createHmac("sha256", SECRET).update(body).digest());
  return body + "." + sig;
}
function verifyToken(tok) {
  if (!tok || tok.indexOf(".") < 0) return null;
  const [body, sig] = tok.split(".");
  const exp = b64u(crypto.createHmac("sha256", SECRET).update(body).digest());
  if (sig.length !== exp.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(exp))) return null;
  try {
    const p = JSON.parse(ub64u(body).toString("utf8"));
    if (p.exp && Date.now() > p.exp) return null;
    return p;
  } catch (e) { return null; }
}

/* ---------- helpers ---------- */
function parseCookies(req) {
  const out = {}; const c = req.headers.cookie;
  if (!c) return out;
  c.split(";").forEach((p) => { const i = p.indexOf("="); if (i > 0) out[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim()); });
  return out;
}
function sessionUser(req) {
  const tok = parseCookies(req).sid;
  const p = verifyToken(tok);
  if (!p) return null;
  const u = readUsers().find((x) => x.id === p.uid);
  if (!u || u.status !== "active") return null;
  return u;
}
function json(res, code, obj) { const s = JSON.stringify(obj); res.writeHead(code, { "Content-Type": "application/json; charset=utf-8", "Content-Length": Buffer.byteLength(s) }); res.end(s); }
function readBody(req) {
  return new Promise((resolve) => {
    let b = ""; req.on("data", (d) => { b += d; if (b.length > 1e6) req.destroy(); });
    req.on("end", () => { try { resolve(b ? JSON.parse(b) : {}); } catch (e) { resolve({}); } });
  });
}
function publicUser(u) { return { id: u.id, username: u.username, role: u.role, status: u.status, permissions: u.permissions || [] }; }
function canAccess(u, resourceId) { return u && (u.role === "admin" || (u.permissions || []).indexOf(resourceId) !== -1); }

/* ---------- static files ---------- */
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml",
  ".ico": "image/x-icon", ".webp": "image/webp", ".gif": "image/gif", ".woff": "font/woff", ".woff2": "font/woff2", ".map": "application/json" };
function sendFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404, { "Content-Type": "text/plain" }); res.end("404 Not Found"); return; }
    res.writeHead(200, { "Content-Type": MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream", "Content-Length": data.length });
    res.end(data);
  });
}
function serveFrontend(res, name) { sendFile(res, path.join(PUB, name)); }

/* HTTP reverse-proxy to ttyd (for the terminal UI/assets) */
function proxyHttp(req, res) {
  const preq = http.request({ host: TTYD_HOST, port: TTYD_PORT, method: req.method, path: req.url, headers: req.headers }, (pres) => {
    res.writeHead(pres.statusCode, pres.headers); pres.pipe(res);
  });
  preq.on("error", () => { res.writeHead(502, { "Content-Type": "text/plain; charset=utf-8" }); res.end("Terminal mavjud emas — ttyd ishga tushganini tekshiring (docker compose)."); });
  req.pipe(preq);
}

/* which module (if any) a repo path belongs to */
function moduleForPath(urlPath) {
  const seg = urlPath.replace(/^\/+/, "").split("/")[0];
  return MODULE_IDS.indexOf(seg) !== -1 ? seg : null;
}

/* ---------- VM control (docker) ---------- */
function dockerRestart(container) {
  return new Promise((resolve) => {
    execFile("docker", ["restart", "-t", "3", container], { timeout: 30000 }, (err, out, errout) => {
      resolve(err ? { ok: false, error: (errout || err.message || "").trim() } : { ok: true });
    });
  });
}
function dockerStatuses() {
  return new Promise((resolve) => {
    execFile("docker", ["ps", "-a", "--format", "{{.Names}}\t{{.State}}"], { timeout: 15000 }, (err, out) => {
      const map = {};
      if (!err) String(out).trim().split("\n").filter(Boolean).forEach((l) => { const [n, s] = l.split("\t"); map[n] = s; });
      resolve(map);
    });
  });
}

/* ============================================================
   HTTP routing
   ============================================================ */
const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, "http://x");
  const p = u.pathname;
  const method = req.method;

  try {
    /* ---- API ---- */
    if (p === "/api/register" && method === "POST") return apiRegister(req, res);
    if (p === "/api/login" && method === "POST") return apiLogin(req, res);
    if (p === "/api/guest" && method === "POST") return apiGuest(req, res);
    if (p === "/api/logout" && method === "POST") return apiLogout(req, res);
    if (p === "/api/me" && method === "GET") return apiMe(req, res);
    if (p === "/api/catalog" && method === "GET") return json(res, 200, { modules: MODULES, vms: VMS, grantable: GRANTABLE });
    if (p.startsWith("/api/ctf/")) return apiCtf(req, res, p, u);
    if (p.startsWith("/api/admin/")) return apiAdmin(req, res, p, method);
    if (p.startsWith("/api/")) return json(res, 404, { error: "not found" });

    /* ---- frontend pages ---- */
    if (p === "/" || p === "/index.html") return serveFrontend(res, "index.html");
    if (p === "/login" || p === "/login.html") return serveFrontend(res, "login.html");
    if (p === "/register" || p === "/register.html") return serveFrontend(res, "register.html");
    if (p === "/dashboard" || p === "/dashboard.html") return serveFrontend(res, "dashboard.html");
    if (p === "/admin" || p === "/admin.html") return serveFrontend(res, "admin.html");
    if (p === "/terminal" || p.startsWith("/terminal/")) {
      const usr = sessionUser(req);
      if (!canAccess(usr, "terminal")) { res.writeHead(403, { "Content-Type": "text/html; charset=utf-8" }); return res.end(lockedPage("terminal")); }
      return proxyHttp(req, res);   // ttyd UI (HTTP), WS handled in 'upgrade'
    }
    if (p.startsWith("/app/")) { // platform frontend assets
      const rel = p.replace(/^\/app\//, "");
      const fp = path.join(PUB, rel);
      if (!fp.startsWith(PUB)) { res.writeHead(403); return res.end("forbidden"); }
      return sendFile(res, fp);
    }

    /* ---- gated repo modules (windows/, kali/, ...) ---- */
    const mod = moduleForPath(p);
    if (mod) {
      const usr = sessionUser(req);
      if (!usr) { res.writeHead(302, { Location: "/login" }); return res.end(); }
      if (!canAccess(usr, mod)) { res.writeHead(403, { "Content-Type": "text/html; charset=utf-8" });
        return res.end(lockedPage(mod)); }
      const rel = decodeURIComponent(p.replace(/^\/+/, ""));
      const fp = path.normalize(path.join(ROOT, rel));
      if (!fp.startsWith(ROOT)) { res.writeHead(403); return res.end("forbidden"); }
      if (fs.existsSync(fp) && fs.statSync(fp).isDirectory()) return sendFile(res, path.join(fp, "index.html"));
      return sendFile(res, fp);
    }

    res.writeHead(302, { Location: "/" }); res.end();
  } catch (e) {
    json(res, 500, { error: "server error" });
  }
});

function lockedPage(mod) {
  const name = (MODULES.find((m) => m.id === mod) || {}).name || mod;
  return `<!doctype html><meta charset="utf-8"><title>Kirish yopiq</title>
  <body style="font-family:system-ui,sans-serif;background:#05070f;color:#e8eefc;display:grid;place-items:center;height:100vh;margin:0;text-align:center">
  <div><div style="font-size:52px">🔒</div><h2>«${name}» — kirish huquqi yo'q</h2>
  <p style="color:#8aa">Administrator sizga bu modulga kirishga ruxsat bermagan.</p>
  <a href="/dashboard" style="color:#4dabf7">← Boshqaruv paneli</a></div></body>`;
}

/* ---------- API handlers ---------- */
async function apiRegister(req, res) {
  const b = await readBody(req);
  const username = String(b.username || "").trim().toLowerCase();
  const password = String(b.password || "");
  if (!/^[a-z0-9_.-]{3,24}$/.test(username)) return json(res, 400, { error: "Login 3-24 belgi: harflar, raqamlar, _.-" });
  if (password.length < 6) return json(res, 400, { error: "Parol kamida 6 belgi bo'lishi kerak." });
  const users = readUsers();
  // Nom (case-insensitive) band bo'lmasin — ro'yxatdan o'tgan yoki mehmon niki bilan to'qnashmasin.
  if (users.find((x) => (x.username || "").toLowerCase() === username)) return json(res, 409, { error: "Bu login band." });
  const first = users.length === 0;
  const user = {
    id: crypto.randomUUID(), username, pass: hashPassword(password),
    role: first ? "admin" : "user",
    status: first ? "active" : "pending",           // birinchi ro'yxatdan o'tgan = admin; qolganlar admin tasdig'ini kutadi
    permissions: first ? GRANTABLE.slice() : [],
    created: new Date().toISOString(),
  };
  users.push(user); writeUsers(users);
  json(res, 200, { ok: true, first, status: user.status, message: first ? "Siz birinchi foydalanuvchisiz — administrator qilib tayinlandingiz." : "Ro'yxatdan o'tdingiz. Administrator tasdig'ini kuting." });
}
async function apiLogin(req, res) {
  const b = await readBody(req);
  const username = String(b.username || "").trim().toLowerCase();
  const password = String(b.password || "");
  const users = readUsers();
  const user = users.find((x) => x.username === username);
  if (!user || !verifyPassword(password, user.pass)) return json(res, 401, { error: "Login yoki parol noto'g'ri." });
  if (user.status === "pending") return json(res, 403, { error: "Hisobingiz hali administrator tomonidan tasdiqlanmagan." });
  if (user.status === "disabled") return json(res, 403, { error: "Hisobingiz o'chirilgan." });
  const tok = signToken({ uid: user.id, exp: Date.now() + 7 * 24 * 3600 * 1000 });
  res.writeHead(200, { "Set-Cookie": `sid=${tok}; HttpOnly; Path=/; Max-Age=${7 * 24 * 3600}; SameSite=Lax`, "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: true, user: publicUser(user) }));
}
/* Mehmon (guest) kirishi — ro'yxatdan o'tmasdan, faqat nik bilan.
   Mehmonga FAQAT "ctf" moduliga ruxsat beriladi (parol yo'q). Bir xil nik bilan
   qayta kirilsa — o'sha mehmon hisobiga (progres/leaderboard saqlanadi) qaytadi. */
async function apiGuest(req, res) {
  const b = await readBody(req);
  const raw = String(b.nickname || "").trim().replace(/\s+/g, " ");
  // HTML metabelgilar (< > " ' &) ataylab taqiqlangan — leaderboard'da xavfsiz ko'rsatiladi.
  if (!/^[A-Za-z0-9][A-Za-z0-9 _.\-]{1,23}$/.test(raw))
    return json(res, 400, { error: "Nik 2-24 belgi: harflar, raqamlar, bo'sh joy va _ . -" });
  const key = raw.toLowerCase();
  const users = readUsers();
  // Ro'yxatdan o'tgan (parolli) foydalanuvchi nomini mehmon egallay olmaydi.
  if (users.find((x) => !x.guest && (x.username || "").toLowerCase() === key))
    return json(res, 409, { error: "Bu nom ro'yxatdan o'tgan foydalanuvchiga tegishli. Boshqa nik tanlang." });
  let me = users.find((x) => x.guest && x.nick === key);
  const isNew = !me;
  if (isNew) {
    me = {
      id: crypto.randomUUID(), username: raw, nick: key, guest: true,
      role: "guest", status: "active", permissions: ["ctf"],   // faqat CTF
      created: new Date().toISOString(),
    };
    users.push(me); writeUsers(users);
  }
  const tok = signToken({ uid: me.id, exp: Date.now() + 7 * 24 * 3600 * 1000 });
  res.writeHead(200, { "Set-Cookie": `sid=${tok}; HttpOnly; Path=/; Max-Age=${7 * 24 * 3600}; SameSite=Lax`, "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: true, user: publicUser(me), resumed: !isNew }));
}
function apiLogout(req, res) {
  res.writeHead(200, { "Set-Cookie": "sid=; HttpOnly; Path=/; Max-Age=0", "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: true }));
}
function apiMe(req, res) {
  const u = sessionUser(req);
  if (!u) return json(res, 401, { error: "not logged in" });
  json(res, 200, { user: publicUser(u), modules: MODULES, vms: VMS });
}

/* ---------- CTF (flag SERVER tomonda tekshiriladi; leaderboard) ---------- */
async function apiCtf(req, res, p, url) {
  const usr = sessionUser(req);
  if (!usr) return json(res, 401, { error: "not logged in" });
  if (!canAccess(usr, "ctf")) return json(res, 403, { error: "no ctf access" });
  const method = req.method;

  if (p === "/api/ctf/list" && method === "GET") {
    const me = readUsers().find((x) => x.id === usr.id) || usr;
    return json(res, 200, { ctfs: CTFS.map((c) => ({
      id: c.id, name: c.name, difficulty: c.difficulty, flagCount: c.flags.length,
      solved: ((me.ctf || {})[c.id] || []).length,
    })) });
  }

  if (p === "/api/ctf/get" && method === "GET") {
    const c = CTF_BY_ID[url.searchParams.get("id")];
    if (!c) return json(res, 404, { error: "ctf not found" });
    const me = readUsers().find((x) => x.id === usr.id) || usr;
    return json(res, 200, {
      id: c.id, name: c.name, difficulty: c.difficulty, targetPort: c.targetPort,
      flagCount: c.flags.length, hints: c.hints, solved: ((me.ctf || {})[c.id] || []).length,
      bonus: ctfBonus(c, (me.ctf || {})[c.id] || []),
    });
  }

  if (p === "/api/ctf/submit" && method === "POST") {
    const b = await readBody(req);
    const c = CTF_BY_ID[String(b.id || "")];
    if (!c) return json(res, 404, { error: "ctf not found" });
    const flag = String(b.flag || "").trim();
    const idx = c.flags.indexOf(flag);
    if (idx === -1) return json(res, 200, { ok: true, correct: false, solved: ((readUsers().find((x) => x.id === usr.id) || {}).ctf?.[c.id] || []).length, total: c.flags.length });
    const users = readUsers();
    const me = users.find((x) => x.id === usr.id);
    if (!me) return json(res, 401, { error: "not logged in" });
    me.ctf = me.ctf || {}; me.ctf[c.id] = me.ctf[c.id] || []; me.ctfTs = me.ctfTs || {};
    const already = me.ctf[c.id].indexOf(idx) !== -1;
    if (!already) { me.ctf[c.id].push(idx); me.ctfTs[c.id] = Date.now(); writeUsers(users); }
    return json(res, 200, { ok: true, correct: true, already, solved: me.ctf[c.id].length, total: c.flags.length, bonus: ctfBonus(c, me.ctf[c.id]) });
  }

  if (p === "/api/ctf/leaderboard" && method === "GET") {
    const c = CTF_BY_ID[url.searchParams.get("id")];
    if (!c) return json(res, 404, { error: "ctf not found" });
    const rows = readUsers()
      .filter((x) => x.status === "active" && x.ctf && x.ctf[c.id] && x.ctf[c.id].length)
      .map((x) => ({ username: x.username, solved: x.ctf[c.id].length, ts: (x.ctfTs && x.ctfTs[c.id]) || 0 }))
      .sort((a, bb) => bb.solved - a.solved || a.ts - bb.ts);
    return json(res, 200, { total: c.flags.length, you: usr.username, rows });
  }

  return json(res, 404, { error: "not found" });
}

/* ---------- admin ---------- */
async function apiAdmin(req, res, p, method) {
  const admin = sessionUser(req);
  if (!admin || admin.role !== "admin") return json(res, 403, { error: "admin only" });

  if (p === "/api/admin/users" && method === "GET") {
    return json(res, 200, { users: readUsers().map(publicUser) });
  }
  if (p === "/api/admin/vms" && method === "GET") {
    const st = await dockerStatuses();
    return json(res, 200, { vms: VMS.map((v) => ({ ...v, state: st[v.container] || "not created" })) });
  }
  const b = await readBody(req);
  const users = readUsers();
  const target = users.find((x) => x.id === b.userId);

  if (p === "/api/admin/user/status" && method === "POST") {
    if (!target) return json(res, 404, { error: "user not found" });
    if (["active", "pending", "disabled"].indexOf(b.status) === -1) return json(res, 400, { error: "bad status" });
    if (target.id === admin.id && b.status !== "active") return json(res, 400, { error: "o'zingizni o'chira olmaysiz" });
    target.status = b.status; writeUsers(users);
    return json(res, 200, { ok: true, user: publicUser(target) });
  }
  if (p === "/api/admin/user/role" && method === "POST") {
    if (!target) return json(res, 404, { error: "user not found" });
    if (["admin", "user"].indexOf(b.role) === -1) return json(res, 400, { error: "bad role" });
    target.role = b.role; if (b.role === "admin") target.permissions = GRANTABLE.slice();
    writeUsers(users);
    return json(res, 200, { ok: true, user: publicUser(target) });
  }
  if (p === "/api/admin/grant" && method === "POST") {
    if (!target) return json(res, 404, { error: "user not found" });
    if (GRANTABLE.indexOf(b.resource) === -1) return json(res, 400, { error: "bad resource" });
    target.permissions = target.permissions || [];
    if (target.permissions.indexOf(b.resource) === -1) target.permissions.push(b.resource);
    writeUsers(users);
    return json(res, 200, { ok: true, user: publicUser(target) });
  }
  if (p === "/api/admin/revoke" && method === "POST") {
    if (!target) return json(res, 404, { error: "user not found" });
    target.permissions = (target.permissions || []).filter((r) => r !== b.resource);
    writeUsers(users);
    return json(res, 200, { ok: true, user: publicUser(target) });
  }
  if (p === "/api/admin/vm/restart" && method === "POST") {
    const vm = VMS.find((v) => v.id === b.vm);
    if (!vm) return json(res, 404, { error: "vm not found" });
    const r = await dockerRestart(vm.container);
    return json(res, r.ok ? 200 : 500, r.ok ? { ok: true } : { error: "restart failed: " + r.error });
  }
  if (p === "/api/admin/user/delete" && method === "POST") {
    if (!target) return json(res, 404, { error: "user not found" });
    if (target.id === admin.id) return json(res, 400, { error: "o'zingizni o'chira olmaysiz" });
    writeUsers(users.filter((x) => x.id !== target.id));
    return json(res, 200, { ok: true });
  }
  return json(res, 404, { error: "not found" });
}

/* ============================================================
   WebSocket terminal proxy -> ttyd (auth + 'terminal' perm gated)
   ============================================================ */
server.on("upgrade", (req, socket, head) => {
  const p = new URL(req.url, "http://x").pathname;
  if (!(p === "/terminal" || p.startsWith("/terminal/"))) { socket.destroy(); return; }
  const usr = sessionUser(req);
  if (!canAccess(usr, "terminal")) { socket.write("HTTP/1.1 403 Forbidden\r\n\r\n"); socket.destroy(); return; }
  // forward the raw WebSocket upgrade (path + headers) to ttyd
  const up = net.connect(TTYD_PORT, TTYD_HOST, () => {
    const lines = [`GET ${req.url} HTTP/1.1`];
    for (const k of Object.keys(req.headers)) lines.push(`${k}: ${req.headers[k]}`);
    up.write(lines.join("\r\n") + "\r\n\r\n");
    if (head && head.length) up.write(head);
    up.pipe(socket); socket.pipe(up);
  });
  up.on("error", () => { try { socket.destroy(); } catch (e) {} });
  socket.on("error", () => { try { up.destroy(); } catch (e) {} });
});

server.listen(PORT, () => {
  console.log(`CyberSecurity Platform backend -> http://0.0.0.0:${PORT}`);
  const users = readUsers();
  if (users.length === 0) console.log("Hali foydalanuvchi yo'q — birinchi ro'yxatdan o'tgan admin bo'ladi (/register).");
});
