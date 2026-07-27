#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# ============================================================================
#  Orbit Ops — Fleet Control Plane  ·  ZANJIRLI (chained) web CTF  ·  HARD
#  Sof Python 3 (faqat standart kutubxona) — Docker/pip/internet KERAK EMAS.
#
#       python3 ctf_server.py            # 0.0.0.0:8086
#       python3 ctf_server.py --port 9001
#
#  To'liq OFLAYN ishlaydi (WiFi'da internet bo'lmasa ham) — hech qanday tashqi
#  kutubxona yoki tarmoq so'rovi yo'q. Xostning haqiqiy interfeysiga (0.0.0.0)
#  bog'lanadi, shuning uchun tarmoqdagi o'quvchilar to'g'ridan-to'g'ri ulanadi.
#
#  4 ta ZANJIRLI zaiflik (biri ikkinchisiga olib boradi):
#    1) Filtered UNION SQLi  — /api/v1/node?id=   (probel/kalit so'z filtri; /**/ bypass)
#                              -> deploy_token va 1-flagni sizdiradi
#    2) SSRF (IP bypass)     — /api/v1/fetch?url= (localhost bloklangan, decimal ham;
#                              hex/octal IP bilan bypass) -> localhost-only /internal API
#    3) LFI / path traversal — /internal/logs?file=  (faqat SSRF orqali; JAIL ichida)
#    4) OS command injection — POST /api/v1/deploy   (1-bosqich token'i kerak; sandbox shell)
#
#  ⚠️  ATAYLAB ZAIF — faqat izolyatsiya qilingan o'quv tarmog'ida. Internetga ochmang.
#  XAVFSIZLIK (blast-radius cheklangan): fayl o'qish (LFI) SOXTA jail katalogiga
#  qamalgan — xostning haqiqiy fayllariga chiqmaydi; "buyruq bajarish" esa ichki
#  SIMULYATSIYA (hech qanday real host buyrug'i bajarilmaydi). Zaiflik MANTIG'I
#  haqiqiy (foydalanuvchi xuddi real payloadni yozadi), ta'siri esa xavfsiz.
# ============================================================================
"""Orbit Ops — standalone chained web CTF (HARD), pure Python stdlib."""

import argparse
import html
import os
import re
import shlex
import shutil
import socket
import sqlite3
import sys
import tempfile
import urllib.error
import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

# ---- Flaglar (nishon ichida; o'quvchi topib platformaga topshiradi) ----
FLAG_SQLI = "EJPT{un10n_c0mment_byp4ss_5qli}"     # 1) filtered SQLi
FLAG_SSRF = "EJPT{h3x_ip_ssrf_1nt3rn4l_piv0t}"    # 2) SSRF -> internal
FLAG_LFI = "EJPT{tr4v3rs3_2_0rb1t_s3cr3t_cfg}"    # 3) LFI via SSRF
FLAG_RCE = "EJPT{r00t_rce_d3pl0y_ch41n_pwn3d}"    # 4) command injection (master)

DEPLOY_TOKEN = "ORBIT-DEPLOY-9F3A17C4-K2"          # SQLi orqali sizadi; deploy uchun kerak

SERVE_PORT = 8086
DB_PATH = None      # startup'da temp faylga o'rnatiladi
JAIL = None         # LFI/shell soxta fayl tizimi (temp katalog)

# ---------------------------------------------------------------------------
#  Soxta (jailed) fayl tizimi — LFI va simulyatsiya-shell shu yerdan o'qiydi.
#  Real host fayllariga TEGMAYDI.
# ---------------------------------------------------------------------------
FAKE_PASSWD = (
    "root:x:0:0:root:/root:/bin/bash\n"
    "daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\n"
    "orbit:x:1000:1000:Orbit Ops service,,,:/opt/orbit:/bin/bash\n"
    "deploy:x:1001:1001:Fleet deploy worker,,,:/opt/orbit:/usr/sbin/nologin\n"
    "postgres:x:1002:1002::/var/lib/postgresql:/bin/bash\n"
)
APP_CONF = (
    "# /opt/orbit/config/app.conf  — Orbit Ops control-plane\n"
    "listen = 0.0.0.0:8086\n"
    "region = eu-west-1\n"
    "session_backend = redis://127.0.0.1:6379/0\n"
    "# internal API (localhost-only): /internal/metrics , /internal/logs\n"
    "# deploy worker reads ORBIT_DEPLOY_TOKEN from the secrets store\n"
    "audit_log = /opt/orbit/logs/audit.log\n"
)
DEPLOY_LOG = (
    "2026-02-20T09:14:02Z INFO  fleet sync ok (42 nodes)\n"
    "2026-02-20T09:15:31Z INFO  image edge-proxy:1.9 rolled to eu-west\n"
    "2026-02-20T09:17:08Z WARN  node edge-07 heartbeat late (1200ms)\n"
)
SECRET_CFG = (
    "# /opt/orbit/secret/deploy.cfg  — RESTRICTED\n"
    "# rotate quarterly; do NOT commit\n"
    "orbit_secret_config_flag = " + FLAG_LFI + "\n"
    "smtp_relay = mail.orbit.internal:25\n"
)
ROOT_FLAG = (
    "# /root/flag.txt — only the deploy worker (root) can read this\n"
    + FLAG_RCE + "\n"
)


def build_jail():
    """Soxta fayl tizimini temp katalogda quradi va yo'lini qaytaradi."""
    root = tempfile.mkdtemp(prefix="orbit_jail_")
    layout = {
        "etc/passwd": FAKE_PASSWD,
        "etc/hostname": "orbit-deploy-01\n",
        "opt/orbit/config/app.conf": APP_CONF,
        "opt/orbit/logs/deploy.log": DEPLOY_LOG,
        "opt/orbit/logs/audit.log": "2026-02-20T09:00:00Z INFO audit start\n",
        "opt/orbit/secret/deploy.cfg": SECRET_CFG,   # 3-flag (LFI)
        "root/flag.txt": ROOT_FLAG,                   # 4-flag (RCE — LFI o'qiy olmaydi)
    }
    for rel, content in layout.items():
        p = os.path.join(root, rel)
        os.makedirs(os.path.dirname(p), exist_ok=True)
        with open(p, "w", encoding="utf-8") as f:
            f.write(content)
    return root


def jail_resolve(base_abs, user_path):
    """Foydalanuvchi yo'lini JAIL ichida 'chroot' qilib yechadi.
    base_abs — virtual absolute baza (masalan '/opt/orbit/logs').
    Traversal (../) VIRTUAL ildizdan yuqoriga chiqolmaydi (normpath '/' da to'xtaydi),
    natijada real host fayllariga chiqib bo'lmaydi. Real fayl JAIL/<virtual> bo'ladi."""
    virtual = os.path.normpath(os.path.join(base_abs, user_path))
    # virtual endi '/...' ko'rinishida; JAIL ostiga joylaymiz
    real = os.path.join(JAIL, virtual.lstrip("/\\"))
    return virtual, real


# ---------------------------------------------------------------------------
#  Ma'lumotlar bazasi (SQLi uchun) — temp sqlite fayli
# ---------------------------------------------------------------------------
def build_db():
    fd, path = tempfile.mkstemp(prefix="orbit_", suffix=".db")
    os.close(fd)
    conn = sqlite3.connect(path)
    c = conn.cursor()
    c.execute("CREATE TABLE nodes (id INTEGER, hostname TEXT, region TEXT)")
    c.executemany("INSERT INTO nodes VALUES (?,?,?)", [
        (1, "edge-01", "eu-west"), (2, "edge-02", "eu-west"),
        (3, "core-01", "us-east"), (7, "edge-07", "ap-south"),
    ])
    c.execute("CREATE TABLE secrets (label TEXT, secret TEXT)")
    c.executemany("INSERT INTO secrets VALUES (?,?)", [
        ("deploy_token", DEPLOY_TOKEN),   # 4-bosqich uchun kerak
        ("audit_flag", FLAG_SQLI),        # 1-flag
        ("note", "rotate the deploy token quarterly"),
    ])
    conn.commit()
    conn.close()
    return path


# ---------------------------------------------------------------------------
#  SSRF — host normalizatsiyasi (hex/octal/decimal IP)
# ---------------------------------------------------------------------------
SSRF_DENY = ["localhost", "127.0.0.1", "0.0.0.0", "::1", "2130706433"]  # decimal ham bloklangan!


def _octet(s):
    s = s.strip()
    if s.lower().startswith("0x"):
        return int(s, 16)
    if len(s) > 1 and s.startswith("0"):
        return int(s, 8)     # octal (masalan 0177 -> 127)
    return int(s)


def normalize_host(h):
    """'0x7f000001', '0177.0.0.1', '0x7f.0.0.1' kabilarni A.B.C.D ga yechadi.
    Muvaffaqiyatsizlikda None."""
    h = h.strip().strip("[]")
    try:
        if "." in h:
            parts = h.split(".")
            if len(parts) == 4:
                vals = [_octet(p) for p in parts]
                if all(0 <= v <= 255 for v in vals):
                    return "%d.%d.%d.%d" % tuple(vals)
            return None
        n = _octet(h) & 0xFFFFFFFF
        return "%d.%d.%d.%d" % ((n >> 24) & 255, (n >> 16) & 255, (n >> 8) & 255, n & 255)
    except Exception:
        return None


def is_loopback_ip(ip):
    return ip is not None and (ip.startswith("127.") or ip == "0.0.0.0")


def ssrf_fetch(raw_url):
    """(err, body). Denylist localhost'ni (va decimal'ni) satr bo'yicha bloklaydi.
    Hex/octal IP undan o'tadi va loopback'ga yechiladi. XAVFSIZLIK: faqat loopback'ga
    so'rov yuboriladi — tashqi xostlarga CHIQMAYDI (oflayn + proksi suiste'moli yo'q)."""
    generic = "Upstream fetch failed: could not resolve or connect to host."
    lc = raw_url.lower()
    for d in SSRF_DENY:
        if d in lc:
            return ("Blocked: refusing to fetch loopback / link-local addresses.", None)
    p = urllib.parse.urlparse(raw_url)
    if p.scheme not in ("http",):
        return ("Only http:// upstreams are supported by the fetcher.", None)
    host = p.hostname or ""
    norm = normalize_host(host)
    path = p.path or "/"
    if p.query:
        path += "?" + p.query
    if not is_loopback_ip(norm):
        return (generic, None)   # tashqi host: real so'rov yo'q
    target = "http://127.0.0.1:%d%s" % (SERVE_PORT, path)
    try:
        req = urllib.request.Request(target, headers={"User-Agent": "OrbitFetcher/2.0"})
        with urllib.request.urlopen(req, timeout=4) as r:
            return (None, r.read(200000).decode("utf-8", "replace"))
    except urllib.error.HTTPError as e:
        try:
            return (None, e.read(200000).decode("utf-8", "replace"))
        except Exception:
            return (generic, None)
    except Exception:
        return (generic, None)


# ---------------------------------------------------------------------------
#  Simulyatsiya-shell (command injection uchun) — REAL host buyrug'i BAJARILMAYDI.
#  Zaiflik mantig'i haqiqiy (filtrsiz kirish shell kontekstiga tushadi), lekin
#  ta'siri xavfsiz: faqat JAIL fayllarini "cat/ls" qiladi, boshqasi simulyatsiya.
# ---------------------------------------------------------------------------
def _shell_read(path):
    virtual = os.path.normpath(os.path.join("/", path.lstrip("/")))
    real = os.path.join(JAIL, virtual.lstrip("/\\"))
    if os.path.isfile(real):
        with open(real, "r", encoding="utf-8", errors="replace") as f:
            return f.read()
    return None


def _run_one(tokens):
    if not tokens:
        return ""
    cmd = tokens[0]
    args = [a for a in tokens[1:] if not a.startswith(">")]  # redirect'larni e'tiborsiz qoldiramiz
    if cmd in ("cat", "head", "tail", "more", "less"):
        out = []
        for a in args:
            data = _shell_read(a)
            out.append(data if data is not None else "%s: %s: No such file or directory" % (cmd, a))
        return "".join(out)
    if cmd == "ls":
        target = args[-1] if args else "/opt/orbit"
        virtual = os.path.normpath(os.path.join("/", target.lstrip("/")))
        real = os.path.join(JAIL, virtual.lstrip("/\\"))
        if os.path.isdir(real):
            return "  ".join(sorted(os.listdir(real))) + "\n"
        if os.path.isfile(real):
            return os.path.basename(real) + "\n"
        return "ls: cannot access '%s': No such file or directory\n" % target
    if cmd == "id":
        return "uid=0(root) gid=0(root) groups=0(root)\n"
    if cmd == "whoami":
        return "root\n"
    if cmd == "pwd":
        return "/opt/orbit\n"
    if cmd == "hostname":
        return "orbit-deploy-01\n"
    if cmd == "uname":
        return "Linux orbit-deploy-01 6.1.0-orbit #1 SMP x86_64 GNU/Linux\n"
    if cmd == "echo":
        return " ".join(args) + "\n"
    if cmd == "env":
        return "PATH=/usr/bin:/bin\nHOME=/root\nORBIT_REGION=eu-west-1\nUSER=root\n"
    return "sh: %s: command not found\n" % cmd


def sim_shell(command):
    """Buyruq satrini simulyatsiya qiladi: $(...)/`...`, ; && || | separatorlar, # komment."""
    # $(...) va `...` — ichini rekursiv baholab o'rniga qo'yamiz (bir daraja)
    def subst(m):
        return sim_shell(m.group(1)).strip()
    command = re.sub(r"\$\(([^()]*)\)", subst, command)
    command = re.sub(r"`([^`]*)`", subst, command)
    out = []
    for seg in re.split(r"(?:;|&&|\|\||\|)", command):
        seg = seg.split(" #")[0].strip()      # komment
        if not seg:
            continue
        try:
            tokens = shlex.split(seg)
        except ValueError:
            tokens = seg.split()
        out.append(_run_one(tokens))
    return "".join(out)


# ---------------------------------------------------------------------------
#  UI (dark ops konsol ko'rinishi)
# ---------------------------------------------------------------------------
def esc(s):
    return html.escape(str(s), quote=True)


STYLE = """
:root{--bg:#070a12;--pan:#0e1424;--pan2:#0b1120;--bd:#1d2942;--tx:#dfe7f5;--mu:#7f90b4;
--ac:#5eead4;--ac2:#38bdf8;--warn:#fbbf24;--mono:ui-monospace,'JetBrains Mono',Menlo,Consolas,monospace}
*{box-sizing:border-box}
body{margin:0;background:radial-gradient(900px 500px at 80% -10%,#10203f 0,var(--bg) 60%);
color:var(--tx);font:15px/1.6 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
a{color:var(--ac2);text-decoration:none}a:hover{text-decoration:underline}
.wrap{max-width:1040px;margin:0 auto;padding:0 22px}
.nav{border-bottom:1px solid var(--bd);background:rgba(6,10,20,.75);backdrop-filter:blur(8px);
position:sticky;top:0;z-index:9}
.nav .wrap{display:flex;align-items:center;gap:20px;height:60px}
.brand{font-weight:800;font-size:18px;letter-spacing:.3px}.brand b{color:var(--ac)}
.nav nav{margin-left:auto;display:flex;gap:18px;font-size:14px}.nav nav a{color:var(--mu)}
.nav nav a:hover{color:var(--tx)}
.badge{font:12px var(--mono);color:#04211b;background:var(--ac);padding:3px 9px;border-radius:6px;font-weight:700}
main{padding:34px 0 70px;min-height:64vh}
.hero{padding:26px 0 6px}.hero h1{font-size:34px;margin:.15em 0;letter-spacing:-.4px}
.hero p{color:var(--mu);font-size:17px;max-width:640px}
.eyebrow{color:var(--ac);font-weight:700;letter-spacing:.15em;text-transform:uppercase;font-size:12px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin:22px 0}
.card{background:linear-gradient(180deg,var(--pan),var(--pan2));border:1px solid var(--bd);
border-radius:12px;padding:18px}.card h3{margin:.1em 0 .3em;font-size:16px}.card p{color:var(--mu);font-size:14px;margin:0}
.panel{background:var(--pan);border:1px solid var(--bd);border-radius:12px;padding:20px;margin:16px 0}
.kpi{display:flex;gap:12px;flex-wrap:wrap;margin:18px 0}
.kpi .b{flex:1;min-width:140px;background:var(--pan);border:1px solid var(--bd);border-radius:10px;padding:14px 16px}
.kpi .n{font-size:23px;font-weight:800}.kpi .l{color:var(--mu);font-size:12px}
label{display:block;color:var(--mu);font-size:13px;margin:10px 0 4px}
input,select{width:100%;background:#070d1c;color:var(--tx);border:1px solid var(--bd);border-radius:9px;
padding:10px 12px;font:14px var(--mono)}
.btn{display:inline-block;background:linear-gradient(180deg,var(--ac),#2dd4bf);color:#04211b;padding:9px 16px;
border-radius:9px;font-weight:700;border:0;cursor:pointer;font-size:14px}
.btn.ghost{background:transparent;border:1px solid var(--bd);color:var(--tx)}
h2{font-size:22px;margin:30px 0 10px}
table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:9px 11px;border-bottom:1px solid var(--bd);font-size:14px}
th{color:var(--mu);font-weight:600}
pre{background:#060b17;border:1px solid var(--bd);border-radius:10px;padding:14px;overflow:auto;
color:#bfe0ff;font:13px/1.5 var(--mono);white-space:pre-wrap;word-break:break-word}
.mono{font-family:var(--mono)}.mu{color:var(--mu)}.tag{display:inline-block;background:#07231e;color:var(--ac);
border:1px solid #14513e;padding:2px 8px;border-radius:999px;font-size:12px;font-weight:700}
.note{border-left:3px solid var(--warn);background:#1c1608;color:#ffe6ad;padding:9px 13px;border-radius:8px;font-size:14px}
.foot{border-top:1px solid var(--bd);color:var(--mu);margin-top:44px}
.foot .wrap{display:flex;justify-content:space-between;gap:12px;padding:18px 22px;font-size:13px;flex-wrap:wrap}
@media(max-width:700px){.nav nav a{display:none}.hero h1{font-size:26px}}
"""

FAVICON = ("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E"
           "%3Ctext y=%22.9em%22 font-size=%2290%22%3E%F0%9F%9B%B0%EF%B8%8F%3C/text%3E%3C/svg%3E")


def head(title, active=""):
    def on(k):
        return ' style="color:var(--tx)"' if k == active else ''
    return (
        '<!doctype html><html lang="en"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1">'
        '<title>' + esc(title) + ' · Orbit Ops</title>'
        '<link rel="icon" href="' + FAVICON + '">'
        '<style>' + STYLE + '</style></head><body>'
        '<header class="nav"><div class="wrap">'
        '<span class="brand">🛰️ Orbit<b>Ops</b></span>'
        '<nav><a href="/"' + on("home") + '>Overview</a>'
        '<a href="/console.html"' + on("console") + '>Console</a>'
        '<a href="/docs.html"' + on("docs") + '>API Docs</a>'
        '<a href="/status"' + on("status") + '>Status</a>'
        '<span class="badge">FLEET</span></nav></div></header><main class="wrap">'
    )


def foot():
    return ('</main><footer class="foot"><div class="wrap">'
            '<span>© 2026 Orbit Ops — fleet &amp; deployment control plane.</span>'
            '<span class="mu">region: eu-west-1 · build 2.7.0</span>'
            '</div></footer></body></html>')


def page_home():
    return head("Overview", "home") + """
<section class="hero"><div class="eyebrow">Internal control plane</div>
<h1>Ship to the whole fleet<br>from one console.</h1>
<p>Orbit Ops is the operator console for the edge fleet — node inventory, health,
   and one-click rollouts across regions. For authorized operators only.</p>
<p style="margin-top:16px"><a class="btn" href="/console.html">Open console</a>
&nbsp;<a class="btn ghost" href="/docs.html">API docs</a></p></section>
<div class="kpi">
  <div class="b"><div class="n">42</div><div class="l">active nodes</div></div>
  <div class="b"><div class="n">4</div><div class="l">regions</div></div>
  <div class="b"><div class="n">99.95%</div><div class="l">control-plane uptime</div></div>
  <div class="b"><div class="n">7ms</div><div class="l">api p50</div></div>
</div>
<div class="grid">
  <div class="card"><h3>🗺️ Node inventory</h3><p>Query any node by id and see its region, health and last heartbeat.</p></div>
  <div class="card"><h3>🔗 Webhook fetcher</h3><p>Validate outbound integrations by fetching a URL from the control plane.</p></div>
  <div class="card"><h3>🚀 Fleet deploy</h3><p>Roll a container image to a region — token-gated, audited, reversible.</p></div>
  <div class="card"><h3>🔒 Internal API</h3><p>Ops metrics &amp; log access are restricted to the control-plane host.</p></div>
</div>
<div class="panel"><p class="mu">Operators: bookmark the <a href="/console.html">console</a>.
Integration engineers: the <a href="/docs.html">API reference</a> lists public endpoints.</p></div>
""" + foot()


def page_console():
    # Konsol JS orqali public API'ni chaqiradi — recon uchun endpointlar shu yerda ko'rinadi.
    return head("Console", "console") + """
<section class="hero"><div class="eyebrow">Operator console</div><h1>Node lookup</h1>
<p>Enter a node id to inspect it. The console talks to the public control-plane API.</p></section>
<div class="panel" style="max-width:560px">
  <label>Node id</label>
  <div style="display:flex;gap:10px">
    <input id="nid" value="1" class="mono">
    <button class="btn" onclick="lookup()">Inspect</button>
  </div>
  <pre id="out" style="margin-top:14px">// natija shu yerda</pre>
</div>
<div class="panel"><p class="mu">Webhook fetcher &amp; deploy are documented in the
  <a href="/docs.html">API reference</a>.</p></div>
<script>
// public API: GET /api/v1/node?id=<n>  ->  {results:[[hostname,region],...]}
async function lookup(){
  const id = document.getElementById('nid').value;
  const o = document.getElementById('out');
  o.textContent = 'GET /api/v1/node?id=' + id + ' ...';
  try{
    const r = await fetch('/api/v1/node?id=' + encodeURIComponent(id));
    const t = await r.text();
    o.textContent = t;
  }catch(e){ o.textContent = 'error: ' + e; }
}
lookup();
</script>
""" + foot()


def page_docs():
    return head("API Docs", "docs") + """
<section class="hero"><div class="eyebrow">Reference</div><h1>Control-plane API</h1>
<p>Public endpoints used by the console and by integration engineers. All responses are JSON or text.</p></section>
<div class="panel">
  <h2 style="margin-top:0">Public</h2>
  <table>
    <tr><th>Method</th><th>Endpoint</th><th>Notes</th></tr>
    <tr><td class="mono">GET</td><td class="mono">/api/v1/node?id=&lt;int&gt;</td><td class="mu">Inspect a node by numeric id.</td></tr>
    <tr><td class="mono">GET</td><td class="mono">/api/v1/fetch?url=&lt;url&gt;</td><td class="mu">Fetch an http(s) URL from the control plane (webhook validation).</td></tr>
    <tr><td class="mono">POST</td><td class="mono">/api/v1/deploy</td><td class="mu">Roll an image to a region. Requires a valid <span class="mono">token</span>. Body: <span class="mono">token, image, region</span>.</td></tr>
  </table>
  <h2>Internal <span class="tag">host-only</span></h2>
  <p class="mu">The <span class="mono">/internal/*</span> family (ops metrics, log access) is bound to the
  control-plane host and rejects remote callers. See <span class="mono">/robots.txt</span>.</p>
</div>
""" + foot()


def json_out(handler, code, obj):
    import json as _json
    handler._send(code, _json.dumps(obj), "application/json; charset=utf-8")


# ---------------------------------------------------------------------------
#  HTTP handler
# ---------------------------------------------------------------------------
class Handler(BaseHTTPRequestHandler):
    server_version = "OrbitOps/2.7"
    sys_version = ""
    protocol_version = "HTTP/1.1"

    def _send(self, code, body, ctype="text/html; charset=utf-8", extra=None):
        if isinstance(body, str):
            body = body.encode("utf-8")
        try:
            self.send_response(code)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Length", str(len(body)))
            if extra:
                for k, v in extra.items():
                    self.send_header(k, v)
            self.end_headers()
            if self.command != "HEAD":
                self.wfile.write(body)
        except (BrokenPipeError, ConnectionResetError):
            pass

    def _text(self, code, body, extra=None):
        self._send(code, body, "text/plain; charset=utf-8", extra)

    def _remote(self):
        return self.client_address[0] if self.client_address else ""

    # ---- GET ----
    def do_GET(self):
        u = urllib.parse.urlparse(self.path)
        path = u.path
        qs = urllib.parse.parse_qs(u.query, keep_blank_values=True)

        if path in ("/", "/index.html"):
            return self._send(200, page_home())
        if path == "/console.html":
            return self._send(200, page_console())
        if path == "/docs.html":
            return self._send(200, page_docs())
        if path == "/status":
            return json_out(self, 200, {"status": "operational", "nodes": 42, "region": "eu-west-1", "build": "2.7.0"})
        if path == "/robots.txt":
            return self._text(200, "User-agent: *\nDisallow: /api/\nDisallow: /internal/\nDisallow: /uploads/\n")

        # --- 1) Filtered UNION SQLi ---
        if path == "/api/v1/node":
            return self._api_node(qs)
        # --- 2) SSRF ---
        if path == "/api/v1/fetch":
            return self._api_fetch(qs)

        # --- internal (localhost-only) — 2/3-bosqich SSRF orqali ---
        if path == "/internal" or path == "/internal/":
            return self._internal_index()
        if path == "/internal/metrics":
            return self._internal_metrics()
        if path == "/internal/logs":
            return self._internal_logs(qs)

        return self._send(404, head("Not found") + '<section class="hero"><div class="eyebrow">404</div>'
                          '<h1>Not found</h1><p class="mu">No such endpoint. See <a href="/docs.html">API docs</a>.</p></section>' + foot())

    def do_HEAD(self):
        self.do_GET()

    # ---- POST ----
    def do_POST(self):
        u = urllib.parse.urlparse(self.path)
        if u.path == "/api/v1/deploy":
            return self._api_deploy()
        return self._send(404, "not found")

    # ================= zaif endpointlar =================
    def _api_node(self, qs):
        uid = qs.get("id", ["1"])[0]
        forbidden = ["OR", "AND", "--", "#", " "]     # probel + kalit so'zlar; /**/ bilan bypass
        up = uid.upper()
        for w in forbidden:
            if w in up:
                return json_out(self, 403, {"error": "WAF: illegal token in 'id'"})
        conn = sqlite3.connect(DB_PATH)
        try:
            # Zaiflik: 'id' raqamli kontekstda to'g'ridan-to'g'ri so'rovga qo'shiladi
            q = "SELECT hostname, region FROM nodes WHERE id = %s" % uid
            rows = conn.execute(q).fetchall()
            return json_out(self, 200, {"query_ok": True, "results": rows})
        except Exception as e:
            return json_out(self, 200, {"query_ok": False, "error": str(e)})
        finally:
            conn.close()

    def _api_fetch(self, qs):
        url = qs.get("url", [""])[0].strip()
        if not url:
            return json_out(self, 400, {"error": "missing 'url' parameter"})
        err, body = ssrf_fetch(url)
        if err:
            return json_out(self, 502, {"ok": False, "error": err})
        return self._text(200, body)

    def _internal_guard(self):
        return self._remote() in ("127.0.0.1", "::1")

    def _internal_index(self):
        if not self._internal_guard():
            return self._text(401, "Internal API — control-plane host only.\nyour_ip=%s\n" % self._remote())
        return self._text(200,
            "orbit internal api (localhost)\n"
            "  GET /internal/metrics        — ops metrics\n"
            "  GET /internal/logs?file=...  — read a deploy log file\n")

    def _internal_metrics(self):
        if not self._internal_guard():
            return self._text(401, "Internal API — control-plane host only.\nyour_ip=%s\n" % self._remote())
        # 2-flag: SSRF pivot muvaffaqiyatli (localhost'dan kelindi)
        return self._text(200,
            "orbit-metrics v1\n"
            "uptime=99.95%% queue=3 workers=8 region=eu-west-1\n"
            "control_plane_flag=%s\n" % FLAG_SSRF)

    def _internal_logs(self, qs):
        if not self._internal_guard():
            return self._text(401, "Internal API — control-plane host only.\nyour_ip=%s\n" % self._remote())
        fn = qs.get("file", ["deploy.log"])[0]
        # Zaiflik: foydalanuvchi yo'li bazaga qo'shiladi — path traversal (JAIL ichida)
        virtual, real = jail_resolve("/opt/orbit/logs", fn)
        if os.path.isfile(real):
            with open(real, "r", encoding="utf-8", errors="replace") as f:
                return self._text(200, f.read())
        return self._text(404, "log not found: %s\n" % virtual)

    def _api_deploy(self):
        form = self._read_form()
        token = form.get("token", [""])[0]
        image = form.get("image", [""])[0]
        region = form.get("region", ["eu-west"])[0]
        if token != DEPLOY_TOKEN:
            return json_out(self, 401, {"ok": False, "error": "invalid deploy token"})
        if not image:
            return json_out(self, 400, {"ok": False, "error": "missing 'image'"})
        # Zaiflik: 'image' filtrsiz ravishda shell buyrug'iga qo'shiladi (command injection).
        # XAVFSIZLIK: real host shell'i EMAS — simulyatsiya (JAIL ustida).
        cmd = "echo deploying %s to region %s" % (image, region)
        output = sim_shell(cmd)
        return self._text(200, "deploy queued.\n$ %s\n%s" % (cmd, output))

    # ---- yordamchi ----
    def _read_form(self):
        try:
            n = int(self.headers.get("Content-Length", 0))
        except (TypeError, ValueError):
            n = 0
        raw = self.rfile.read(n).decode("utf-8", "replace") if n > 0 else ""
        return urllib.parse.parse_qs(raw, keep_blank_values=True)

    def log_message(self, fmt, *args):
        sys.stderr.write("  %s - %s\n" % (self._remote(), fmt % args))


# ---------------------------------------------------------------------------
#  Ishga tushirish
# ---------------------------------------------------------------------------
def lan_ips():
    ips = []
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("1.1.1.1", 80))
        ips.append(s.getsockname()[0])
        s.close()
    except Exception:
        pass
    try:
        for info in socket.getaddrinfo(socket.gethostname(), None, socket.AF_INET):
            ip = info[4][0]
            if not ip.startswith("127.") and not ip.startswith("169.254.") and ip not in ips:
                ips.append(ip)
    except Exception:
        pass
    return ips


def main():
    global SERVE_PORT, DB_PATH, JAIL
    ap = argparse.ArgumentParser(description="Orbit Ops — standalone chained web CTF (HARD, pure Python).")
    ap.add_argument("--host", default="0.0.0.0")
    ap.add_argument("--port", type=int, default=8086)
    args = ap.parse_args()

    DB_PATH = build_db()
    JAIL = build_jail()

    httpd = ThreadingHTTPServer((args.host, args.port), Handler)
    httpd.daemon_threads = True
    SERVE_PORT = httpd.server_address[1]

    ips = lan_ips()
    ln = "=" * 64
    print(ln)
    print("  🛰️  Orbit Ops — chained web CTF (HARD)  ·  standalone Python")
    print(ln)
    print("  Ishlamoqda:  http://%s:%d" % (args.host, SERVE_PORT))
    print("  Shu kompyuterda:        http://localhost:%d" % SERVE_PORT)
    for ip in ips:
        print("  Tarmoqdagi o'quvchilar: http://%s:%d" % (ip, SERVE_PORT))
    if not ips:
        print("  Tarmoq IP topilmadi — 'ip addr' bilan toping: http://<IP>:%d" % SERVE_PORT)
    print(ln)
    print("  4 ZANJIRLI zaiflik: filtered SQLi → SSRF → LFI → command injection")
    print("  Brauzer + Burp; path'larni /docs.html va /robots.txt oshkor qiladi.")
    print("  To'liq OFLAYN — internet kerak emas. ⚠️ Ataylab zaif: faqat izolyatsiya qilingan lab.")
    print("  Xavfsiz: LFI jail'ga qamalgan, RCE simulyatsiya (real host'ga ta'sir yo'q).")
    print("  Firewall LAN'ni bloklasa:  sudo ufw allow %d/tcp" % SERVE_PORT)
    print("  To'xtatish: Ctrl+C")
    print(ln)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n  To'xtatildi.")
    finally:
        try:
            os.remove(DB_PATH)
        except Exception:
            pass
        try:
            shutil.rmtree(JAIL, ignore_errors=True)
        except Exception:
            pass


if __name__ == "__main__":
    main()
