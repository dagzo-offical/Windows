#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# ============================================================================
#  Web Vulns Lab — amaliy mashq maydoni  ·  sof Python 3 (kutubxonasiz)
#
#       python3 app.py                 # 0.0.0.0:8087
#       python3 app.py --port 9000
#
#  To'liq OFLAYN. Web-Pentest darslaridagi zaifliklarni AMALDA sinash uchun:
#  har bir mashqda REAL ekspluatatsiya qilinadigan zaiflik bor, yechilsa FLAG
#  beriladi. Brauzer + Burp bilan hujum qiling; flagni /flag_check da topshiring.
#
#  Batch 1 (6 zaiflik):
#    1) SQL Injection (login bypass)      /sqli
#    2) IDOR                               /idor
#    3) Path Traversal / LFI              /lfi
#    4) OS Command Injection              /cmdi
#    5) SSTI (Template Injection)         /ssti
#    6) File Upload (filtr bypass)        /upload
#
#  ⚠️  ATAYLAB ZAIF — faqat izolyatsiya qilingan o'quv tarmog'ida. Internetga ochmang.
#  XAVFSIZLIK: fayl o'qish (LFI) SOXTA jail katalogiga qamalgan; «buyruq bajarish»
#  (cmdi) ichki SIMULYATSIYA; SSTI cheklangan baholovchi — real host'ga ta'sir yo'q.
# ============================================================================
"""Web Vulns Lab — offline, exploitable web-vulnerability practice (pure stdlib)."""

import argparse
import html
import os
import re
import shutil
import socket
import sqlite3
import sys
import tempfile
import urllib.parse
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

# ---- Flaglar (yechilganda beriladi; o'quvchi /flag_check da topshiradi) ----
FLAG_SQLI = "EJPT{5ql1_l0g1n_byp4ss_pwn3d}"
FLAG_IDOR = "EJPT{id0r_0th3r_us3rs_0rd3r}"
FLAG_LFI = "EJPT{lf1_tr4v3rs3_t0_s3cr3t}"
FLAG_CMDI = "EJPT{cmd_1nj_sh3ll_pwn3d}"
FLAG_SSTI = "EJPT{5st1_t3mpl4t3_3v4l}"
FLAG_UPLOAD = "EJPT{upl04d_f1lt3r_byp4ss}"

SERVE_PORT = 8087
DB_PATH = None
JAIL = None

CHALLENGES = [
    {"id": "sqli", "path": "/sqli", "name": "SQL Injection", "diff": "easy", "icon": "🗄️",
     "flag": FLAG_SQLI,
     "descu": "Login formasi orqali admin sifatida kiring.", "desce": "Log in as admin via the login form.",
     "hintu": "Login so'rovi kiritmani tekshirmasdan quriladi. Parol maydoniga SQL komenti (--) bilan shartni buzing yoki 'OR'1'='1 sinang. Admin foydalanuvchi nomini toping.",
     "hinte": "The login query is built without sanitizing input. Break the condition with a SQL comment (--) or 'OR'1'='1. Find the admin username."},
    {"id": "idor", "path": "/idor", "name": "IDOR", "diff": "easy", "icon": "🔢",
     "flag": FLAG_IDOR,
     "descu": "Boshqa foydalanuvchining buyurtmasini ko'ring.", "desce": "View another user's order.",
     "hintu": "Sizning buyurtma id'ingiz #1001. Server egalikni tekshirmaydi — id parametrini boshqa qiymatlarga (ketma-ket yoki taxminan) o'zgartirib ko'ring.",
     "hinte": "Your order id is #1001. The server never checks ownership — change the id parameter to other values (sequential or guessed)."},
    {"id": "lfi", "path": "/lfi", "name": "Path Traversal / LFI", "diff": "easy", "icon": "📂",
     "flag": FLAG_LFI,
     "descu": "Server fayl tizimidan maxfiy faylni o'qing.", "desce": "Read a secret file from the server's filesystem.",
     "hintu": "file parametri hujjatlar papkasiga qo'shiladi. ../ bilan papkadan chiqib, secret/ katalogidagi faylni o'qing.",
     "hinte": "The file parameter is joined to the docs folder. Escape it with ../ and read the file in the secret/ directory."},
    {"id": "cmdi", "path": "/cmdi", "name": "Command Injection", "diff": "medium", "icon": "⌨️",
     "flag": FLAG_CMDI,
     "descu": "Ping vositasi orqali serverda buyruq bajaring.", "desce": "Run a command on the server via the ping tool.",
     "hintu": "host maydoni to'g'ridan-to'g'ri shell buyrug'iga tushadi. ; yoki && bilan o'z buyrug'ingizni ulang va / dagi flag faylini o'qing (cat).",
     "hinte": "The host field goes straight into a shell command. Chain your own command with ; or && and read the flag file at / (cat)."},
    {"id": "ssti", "path": "/ssti", "name": "SSTI", "diff": "medium", "icon": "🧩",
     "flag": FLAG_SSTI,
     "descu": "Salomlashuv shabloniga kod kiriting.", "desce": "Inject into the greeting template.",
     "hintu": "name qiymati shablon sifatida baholanadi. Avval {{7*7}} yuborib 49 chiqishini tasdiqlang — demak ifoda baholanyapti. So'ng ichki o'zgaruvchini (masalan flag) so'rang.",
     "hinte": "The name value is evaluated as a template. First send {{7*7}} and confirm it prints 49 — the expression is evaluated. Then request an internal variable (e.g. flag)."},
    {"id": "upload", "path": "/upload", "name": "File Upload", "diff": "medium", "icon": "⬆️",
     "flag": FLAG_UPLOAD,
     "descu": "Filtrni aldab bajariladigan fayl yuklang.", "desce": "Upload an executable file past the filter.",
     "hintu": "Filtr faqat aniq '.php' bilan tugaydigan (katta-kichik harfga sezgir) nomni bloklaydi. Muqobil bajariladigan kengaytma (.phtml, .php5) yoki harf registrini (.pHp) sinang.",
     "hinte": "The filter only blocks names ending in exactly '.php' (case-sensitive). Try an alternative executable extension (.phtml, .php5) or change the case (.pHp)."},
]
FLAGS = [c["flag"] for c in CHALLENGES]


# ---------------------------------------------------------------------------
#  Soxta (jailed) fayl tizimi + DB
# ---------------------------------------------------------------------------
def build_jail():
    root = tempfile.mkdtemp(prefix="wvlab_")
    layout = {
        "docs/report.txt": "Quarterly report — nothing secret here.\nRevenue up 8%.\n",
        "docs/readme.txt": "Place your documents in this folder.\n",
        "secret/flag.txt": FLAG_LFI + "\n",
        "etc/passwd": ("root:x:0:0:root:/root:/bin/bash\n"
                       "www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\n"
                       "labuser:x:1000:1000:Lab User,,,:/home/labuser:/bin/bash\n"),
        "flag": FLAG_CMDI + "\n",
    }
    for rel, content in layout.items():
        p = os.path.join(root, rel)
        os.makedirs(os.path.dirname(p), exist_ok=True)
        with open(p, "w", encoding="utf-8") as f:
            f.write(content)
    return root


def build_db():
    fd, path = tempfile.mkstemp(prefix="wvlab_", suffix=".db")
    os.close(fd)
    conn = sqlite3.connect(path)
    conn.execute("CREATE TABLE users (username TEXT, password TEXT, role TEXT)")
    conn.executemany("INSERT INTO users VALUES (?,?,?)", [
        ("admin", "S3cr3t-Adm1n-9f3a", "admin"),
        ("guest", "guest", "user"),
    ])
    conn.commit()
    conn.close()
    return path


# IDOR ma'lumotlari (xotirada)
ORDERS = {
    1001: {"owner": "guest", "item": "USB-C kabel", "total": "$12.00", "secret": None},
    1002: {"owner": "guest", "item": "Sichqoncha", "total": "$25.00", "secret": None},
    1337: {"owner": "admin", "item": "INTERNAL — audit export", "total": "$0.00", "secret": FLAG_IDOR},
}


# ---------------------------------------------------------------------------
#  LFI jail + simulyatsiya-shell (Orbit CTF'dan — xavfsiz)
# ---------------------------------------------------------------------------
def jail_read(base_abs, user_path):
    virtual = os.path.normpath(os.path.join(base_abs, user_path))
    real = os.path.join(JAIL, virtual.lstrip("/\\"))
    if os.path.isfile(real):
        with open(real, "r", encoding="utf-8", errors="replace") as f:
            return virtual, f.read()
    return virtual, None


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
    cmd, args = tokens[0], [a for a in tokens[1:] if not a.startswith(">")]
    if cmd in ("cat", "head", "tail", "more"):
        out = []
        for a in args:
            d = _shell_read(a)
            out.append(d if d is not None else "%s: %s: No such file or directory\n" % (cmd, a))
        return "".join(out)
    if cmd == "ls":
        target = args[-1] if args else "/"
        virtual = os.path.normpath(os.path.join("/", target.lstrip("/")))
        real = os.path.join(JAIL, virtual.lstrip("/\\"))
        if os.path.isdir(real):
            return "  ".join(sorted(os.listdir(real))) + "\n"
        return "ls: %s: No such file or directory\n" % target
    if cmd == "id":
        return "uid=33(www-data) gid=33(www-data) groups=33(www-data)\n"
    if cmd == "whoami":
        return "www-data\n"
    if cmd == "pwd":
        return "/var/www/html\n"
    if cmd == "uname":
        return "Linux weblab 6.1.0 x86_64 GNU/Linux\n"
    if cmd == "echo":
        return " ".join(args) + "\n"
    return "sh: %s: command not found\n" % cmd


def sim_shell(command):
    out = []
    for seg in re.split(r"(?:;|&&|\|\||\|)", command):
        seg = seg.split(" #")[0].strip()
        if not seg:
            continue
        try:
            import shlex
            tokens = shlex.split(seg)
        except ValueError:
            tokens = seg.split()
        out.append(_run_one(tokens))
    return "".join(out)


# ---------------------------------------------------------------------------
#  SSTI — cheklangan baholovchi (real Python eval EMAS — xavfsiz)
# ---------------------------------------------------------------------------
def ssti_render(name):
    """{{ ... }} ni baholaydi: butun-son arifmetikasi, va 'flag'/'config' o'zgaruvchilari.
    Python eval ISHLATILMAYDI — sandbox-escape/RCE imkoni yo'q."""
    env = {"flag": FLAG_SSTI, "config": "{SECRET_KEY: " + FLAG_SSTI + "}"}

    def ev(expr):
        expr = expr.strip()
        if expr in env:
            return str(env[expr])
        m = re.fullmatch(r"(\d{1,6})\s*([*+\-])\s*(\d{1,6})", expr)
        if m:
            a, op, b = int(m.group(1)), m.group(2), int(m.group(3))
            if op == "*":
                return str(a * b)
            if op == "+":
                return str(a + b)
            return str(a - b)
        m = re.fullmatch(r"config\.(\w+)", expr)
        if m:
            return str(env.get("config", ""))
        return "{{ " + expr + " }}"   # noma'lum — o'zgarmasdan qaytadi

    return re.sub(r"\{\{(.+?)\}\}", lambda m: ev(m.group(1)), name)


# ---------------------------------------------------------------------------
#  UI
# ---------------------------------------------------------------------------
def esc(s):
    return html.escape(str(s), quote=True)


STYLE = """
*{box-sizing:border-box}
body{margin:0;background:#0b1020;color:#e6ecf7;font:15px/1.6 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
a{color:#5eb0ff;text-decoration:none}a:hover{text-decoration:underline}
.wrap{max-width:920px;margin:0 auto;padding:0 20px}
.nav{border-bottom:1px solid #213050;background:rgba(9,14,28,.8);position:sticky;top:0;z-index:9}
.nav .wrap{display:flex;align-items:center;gap:16px;height:56px}
.brand{font-weight:800;font-size:17px}.brand b{color:#5eead4}
.nav a{color:#8ea0c4;font-size:14px;font-weight:600}.nav a:hover{color:#fff}
.nav .sp{margin-left:auto}
main{padding:30px 0 70px;min-height:60vh}
h1{font-size:28px;margin:.2em 0}h2{font-size:20px;margin:26px 0 10px}
.mut{color:#8ea0c4}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px;margin:20px 0}
.card{display:block;background:#121a30;border:1px solid #213050;border-radius:13px;padding:16px 18px}
.card:hover{border-color:#5eead4;text-decoration:none}
.card .ic{font-size:22px}.card h3{margin:6px 0 4px;font-size:16px;color:#e6ecf7}
.card p{margin:0;font-size:13px;color:#8ea0c4}
.pill{display:inline-block;font-size:11px;font-weight:700;padding:2px 9px;border-radius:999px;margin-top:9px}
.easy{background:#0c2a1c;color:#48c98a}.medium{background:#2c2109;color:#e8b24d}.hard{background:#331119;color:#ff6478}
.panel{background:#121a30;border:1px solid #213050;border-radius:13px;padding:20px;margin:16px 0}
label{display:block;color:#8ea0c4;font-size:13px;margin:10px 0 4px}
input[type=text],input[type=password],input[type=file]{width:100%;background:#0a1124;color:#e6ecf7;border:1px solid #213050;border-radius:9px;padding:10px 12px;font:14px ui-monospace,Menlo,Consolas,monospace}
.btn{display:inline-block;background:linear-gradient(180deg,#22d3a6,#14b892);color:#04241b;border:0;border-radius:9px;padding:10px 18px;font-weight:700;cursor:pointer;font-size:14px;margin-top:12px}
pre{background:#060b17;border:1px solid #213050;border-radius:10px;padding:13px;overflow:auto;color:#bfe0ff;font:13px/1.5 ui-monospace,Menlo,Consolas,monospace;white-space:pre-wrap;word-break:break-word}
.flag{background:#07231e;border:1px solid #14513e;color:#8ff0d3;border-radius:9px;padding:12px 14px;font:14px ui-monospace,monospace;margin:12px 0}
.note{border-left:3px solid #ffb454;background:#1a1608;color:#ffe0a3;padding:9px 13px;border-radius:8px;font-size:14px;margin:10px 0}
.err{border-left:3px solid #ff6478;background:#2a0f14;color:#ffb3bd;padding:9px 13px;border-radius:8px;font-size:14px;margin:10px 0}
table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:8px 10px;border-bottom:1px solid #213050;font-size:14px}
th{color:#8ea0c4}
.foot{border-top:1px solid #213050;color:#66738a;font-size:13px;padding:20px;text-align:center}
"""


def head(title):
    return (
        '<!doctype html><html lang="uz"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1">'
        '<title>' + esc(title) + ' · Web Vulns Lab</title>'
        '<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 '
        'viewBox=%220 0 100 100%22%3E%3Ctext y=%22.9em%22 font-size=%2290%22%3E%F0%9F%A7%AA%3C/text%3E%3C/svg%3E">'
        '<style>' + STYLE + '</style></head><body>'
        '<header class="nav"><div class="wrap">'
        '<span class="brand">🧪 Web<b>Vulns</b> Lab</span>'
        '<a href="/">Mashqlar</a><a href="/flag_check">🚩 Flag check</a>'
        '<span class="sp"></span></div></header><main><div class="wrap">'
    )


def foot():
    return ('</div></main><div class="foot">⚠️ Ataylab zaif — faqat izolyatsiya qilingan lab. '
            'Internetga ochmang.</div></body></html>')


def page_home():
    cards = ""
    for c in CHALLENGES:
        cards += ('<a class="card" href="' + c["path"] + '"><div class="ic">' + c["icon"] + '</div>'
                  '<h3>' + esc(c["name"]) + '</h3><p>' + esc(c["descu"]) + '</p>'
                  '<span class="pill ' + c["diff"] + '">' + c["diff"].upper() + '</span></a>')
    return head("Mashqlar") + (
        '<h1>Web Vulns Lab</h1>'
        '<p class="mut">Har bir mashqda REAL zaiflik bor. Brauzer + Burp bilan hujum qiling, '
        'flagni toping va <a href="/flag_check">/flag_check</a> da topshiring. Jami '
        + str(len(CHALLENGES)) + ' ta mashq.</p>'
        '<div class="grid">' + cards + '</div>'
        '<p class="mut" style="font-size:13px">Maslahat: har sahifada so\'rovni Burp bilan ushlab, '
        'parametr va tanani o\'zgartiring. Yechim topilmasa — /flag_check dagi hintlarni oching.</p>'
    ) + foot()


# ---- Challenge sahifalari ----
def page_sqli(msg="", ok_flag=None):
    body = head("SQL Injection") + '<h1>🗄️ Members — Sign in</h1><p class="mut">Faqat a\'zolar uchun. Kirish uchun login/parol kiriting.</p>'
    if ok_flag:
        body += '<div class="flag">✓ Admin sifatida kirdingiz! FLAG: ' + esc(ok_flag) + '</div>'
    if msg:
        body += '<div class="err">' + esc(msg) + '</div>'
    body += ('<div class="panel"><form method="post" action="/sqli">'
             '<label>Login</label><input type="text" name="username" autofocus>'
             '<label>Parol</label><input type="password" name="password">'
             '<button class="btn" type="submit">Kirish</button></form>'
             '<p class="mut" style="font-size:12px;margin-top:10px">Demo hisob: guest / guest</p></div>')
    return body + foot()


def page_idor(order=None, order_id=None, err=""):
    body = head("IDOR") + '<h1>🔢 My Orders</h1><p class="mut">Bu — sizning hisobingiz (guest). Buyurtmangiz: <b>#1001</b>.</p>'
    body += ('<div class="panel"><form method="get" action="/idor/order">'
             '<label>Buyurtma raqami</label><input type="text" name="id" value="' + esc(order_id or "1001") + '">'
             '<button class="btn" type="submit">Ko\'rish</button></form></div>')
    if err:
        body += '<div class="err">' + esc(err) + '</div>'
    if order:
        body += ('<div class="panel"><h2 style="margin-top:0">Buyurtma #' + esc(order_id) + '</h2>'
                 '<table><tr><th>Egasi</th><td>' + esc(order["owner"]) + '</td></tr>'
                 '<tr><th>Mahsulot</th><td>' + esc(order["item"]) + '</td></tr>'
                 '<tr><th>Summa</th><td>' + esc(order["total"]) + '</td></tr></table>')
        if order.get("secret"):
            body += '<div class="flag">🚩 FLAG: ' + esc(order["secret"]) + '</div>'
        body += '</div>'
    return body + foot()


def page_lfi(fname="report.txt", content=None, virtual=None):
    body = head("LFI") + '<h1>📂 Document viewer</h1><p class="mut">Hujjatlar papkasidan faylni oching (masalan report.txt, readme.txt).</p>'
    body += ('<div class="panel"><form method="get" action="/lfi">'
             '<label>Fayl nomi</label><input type="text" name="file" value="' + esc(fname) + '">'
             '<button class="btn" type="submit">Ochish</button></form></div>')
    if content is not None:
        body += '<div class="panel mut" style="font-size:12px">Ochilgan yo\'l: ' + esc(virtual or "") + '</div>'
        body += '<pre>' + esc(content) + '</pre>'
        if FLAG_LFI.strip() in content:
            body += '<div class="flag">🚩 Maxfiy fayl o\'qildi!</div>'
    elif fname:
        body += '<div class="err">Fayl topilmadi: ' + esc(virtual or fname) + '</div>'
    return body + foot()


def page_cmdi(host="", output=None):
    body = head("Command Injection") + '<h1>⌨️ Network ping tool</h1><p class="mut">Xost mavjudligini tekshiring (masalan 127.0.0.1).</p>'
    body += ('<div class="panel"><form method="get" action="/cmdi">'
             '<label>Xost</label><input type="text" name="host" value="' + esc(host) + '">'
             '<button class="btn" type="submit">Ping</button></form></div>')
    if output is not None:
        body += '<pre>$ ping -c 1 ' + esc(host) + '\n' + esc(output) + '</pre>'
        if FLAG_CMDI.strip() in output:
            body += '<div class="flag">🚩 Buyruq bajarildi!</div>'
    return body + foot()


def page_ssti(name="", rendered=None):
    body = head("SSTI") + '<h1>🧩 Greeting preview</h1><p class="mut">Ismingizni kiriting — tabrik ko\'rinishini oldindan ko\'ring.</p>'
    body += ('<div class="panel"><form method="get" action="/ssti">'
             '<label>Ism</label><input type="text" name="name" value="' + esc(name) + '">'
             '<button class="btn" type="submit">Ko\'rish</button></form></div>')
    if rendered is not None:
        body += '<div class="panel"><h2 style="margin-top:0">Salom, ' + esc(rendered) + '!</h2></div>'
        if FLAG_SSTI.strip() in rendered:
            body += '<div class="flag">🚩 Shablon inyeksiyasi muvaffaqiyatli!</div>'
    return body + foot()


def page_upload(msg="", cls="note"):
    body = head("File Upload") + '<h1>⬆️ Avatar upload</h1><p class="mut">Profil rasmingizni yuklang. (Xavfsizlik uchun bajariladigan fayllar bloklanadi.)</p>'
    if msg:
        body += '<div class="' + cls + '">' + msg + '</div>'
    body += ('<div class="panel"><form method="post" action="/upload" enctype="multipart/form-data">'
             '<label>Fayl</label><input type="file" name="avatar">'
             '<button class="btn" type="submit">Yuklash</button></form></div>')
    return body + foot()


# ---- flag_check (Nimbus uslubi: server tekshiruvi + cookie progress + hintlar) ----
def md_min(s):
    return esc(s)


def page_flag_check(solved, flash=None, fidx=""):
    total = len(FLAGS)
    n = len(solved)
    pct = int(round(n * 100.0 / total)) if total else 0

    def num(x):
        try:
            return CHALLENGES[int(x)]["name"]
        except (TypeError, ValueError, IndexError):
            return "?"
    fmsg = ""
    if flash == "ok":
        fmsg = '<div class="flag">✓ To\'g\'ri! «' + esc(num(fidx)) + '» yechildi.</div>'
    elif flash == "already":
        fmsg = '<div class="note">«' + esc(num(fidx)) + '» allaqachon yechilgan.</div>'
    elif flash == "wrong":
        fmsg = '<div class="err">✗ Xato flag.</div>'
    rows = ""
    for i, c in enumerate(CHALLENGES):
        done = i in solved
        rows += ('<div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid #213050">'
                 '<span style="font-size:18px">' + (("🚩") if done else "🔒") + '</span>'
                 '<a href="' + c["path"] + '" style="flex:1;font-weight:600;color:' + ("#8ff0d3" if done else "#e6ecf7") + '">' + esc(c["name"]) + '</a>'
                 '<span class="pill ' + c["diff"] + '">' + c["diff"] + '</span>'
                 '<details style="min-width:64px"><summary style="cursor:pointer;color:#5eb0ff;font-size:13px">Hint</summary>'
                 '<div style="font-size:12.5px;color:#c7d3ea;margin-top:6px;max-width:640px">' + md_min(c["hintu"]) + '</div></details></div>')
    done_all = '<div class="flag">🎉 BARAKALLA! Hamma mashq (' + str(total) + '/' + str(total) + ') yechildi.</div>' if n >= total else ""
    return (
        '<!doctype html><html lang="uz"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1">'
        '<title>Flag check · Web Vulns Lab</title>'
        '<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ctext y=%22.9em%22 font-size=%2290%22%3E%F0%9F%9A%A9%3C/text%3E%3C/svg%3E">'
        '<style>' + STYLE + '</style></head><body>'
        '<header class="nav"><div class="wrap"><span class="brand">🧪 Web<b>Vulns</b> Lab</span>'
        '<a href="/">Mashqlar</a><a href="/flag_check">🚩 Flag check</a><span class="sp"></span></div></header>'
        '<main><div class="wrap">'
        '<h1>🚩 Flag check</h1>'
        '<p class="mut">Topgan flaglaringizni tekshiring (server tomonda). Jami <b>' + str(total) + '</b> mashq.</p>'
        + done_all +
        '<div class="panel"><div class="mut" style="font-size:13px">' + str(n) + ' / ' + str(total) + ' yechildi</div>'
        '<div style="height:9px;background:#0a1124;border:1px solid #213050;border-radius:999px;overflow:hidden;margin:8px 0">'
        '<div style="height:100%;width:' + str(pct) + '%;background:linear-gradient(90deg,#22d3a6,#2d7aff)"></div></div>'
        + fmsg +
        '<form method="post" action="/flag_check" style="display:flex;gap:10px;margin-top:6px">'
        '<input type="text" name="flag" placeholder="EJPT{...}" autofocus autocomplete="off" style="flex:1">'
        '<button class="btn" type="submit" style="margin-top:0">Tekshirish</button></form></div>'
        '<div class="panel"><div style="font-weight:700;margin-bottom:4px">Mashqlar va hintlar</div>' + rows + '</div>'
        '<p style="margin-top:16px"><a href="/">← Mashqlarga</a> &nbsp; '
        '<a href="/flag_check?reset=1" onclick="return confirm(\'Progress tozalansinmi?\')">Progressni tozalash</a></p>'
        '</div></main></body></html>'
    )


# ---------------------------------------------------------------------------
#  HTTP handler
# ---------------------------------------------------------------------------
class Handler(BaseHTTPRequestHandler):
    server_version = "WebVulnsLab/1.0"
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

    # ---- GET ----
    def do_GET(self):
        u = urllib.parse.urlparse(self.path)
        p = u.path
        qs = urllib.parse.parse_qs(u.query, keep_blank_values=True)
        if p in ("/", "/index.html"):
            return self._send(200, page_home())
        if p == "/sqli":
            return self._send(200, page_sqli())
        if p == "/idor":
            return self._send(200, page_idor())
        if p == "/idor/order":
            oid = qs.get("id", ["1001"])[0]
            try:
                order = ORDERS.get(int(oid))
            except ValueError:
                order = None
            if order is None:
                return self._send(200, page_idor(order_id=oid, err="Bunday buyurtma topilmadi."))
            return self._send(200, page_idor(order=order, order_id=oid))
        if p == "/lfi":
            fn = qs.get("file", [""])[0]
            if not fn:
                return self._send(200, page_lfi())
            virtual, content = jail_read("/docs", fn)
            return self._send(200, page_lfi(fname=fn, content=content, virtual=virtual))
        if p == "/cmdi":
            host = qs.get("host", [""])[0]
            if not host:
                return self._send(200, page_cmdi())
            out = sim_shell("ping -c 1 " + host)
            # oddiy ping natijasi (host qismi uchun) + inyeksiya chiqishi
            base = "PING " + host.split(";")[0].split("&")[0].strip() + ": 64 bytes, time=0.9 ms\n"
            return self._send(200, page_cmdi(host=host, output=base + out))
        if p == "/ssti":
            name = qs.get("name", [""])[0]
            if not name:
                return self._send(200, page_ssti())
            return self._send(200, page_ssti(name=name, rendered=ssti_render(name)))
        if p == "/upload":
            return self._send(200, page_upload())
        if p in ("/flag_check", "/flag_check.html"):
            if qs.get("reset"):
                return self._fc_redirect(clear=True)
            return self._send(200, page_flag_check(self._fc_cookie(), qs.get("r", [None])[0], qs.get("i", [""])[0]))
        return self._send(404, head("404") + "<h1>404</h1><p class=mut>Topilmadi. <a href=/>Mashqlar</a>.</p>" + foot())

    def do_HEAD(self):
        self.do_GET()

    # ---- POST ----
    def do_POST(self):
        u = urllib.parse.urlparse(self.path)
        p = u.path
        if p == "/sqli":
            form = self._form()
            user = form.get("username", [""])[0]
            pw = form.get("password", [""])[0]
            # ZAIF: kiritma to'g'ridan-to'g'ri so'rovga qo'shiladi
            q = "SELECT role FROM users WHERE username='%s' AND password='%s'" % (user, pw)
            conn = sqlite3.connect(DB_PATH)
            try:
                row = conn.execute(q).fetchone()
            except Exception as e:
                conn.close()
                return self._send(200, page_sqli(msg="SQL xato: " + str(e)))
            conn.close()
            if row and row[0] == "admin":
                return self._send(200, page_sqli(ok_flag=FLAG_SQLI))
            if row:
                return self._send(200, page_sqli(msg="Kirdingiz (rol: %s) — lekin admin emas." % row[0]))
            return self._send(200, page_sqli(msg="Login yoki parol noto'g'ri."))
        if p == "/upload":
            fname = self._upload_filename()
            if fname is None:
                return self._send(200, page_upload(msg="Fayl tanlanmadi.", cls="err"))
            # ZAIF filtr: faqat aniq '.php' (katta-kichik harfga sezgir) bloklanadi
            if fname.endswith(".php"):
                return self._send(200, page_upload(msg="⛔ Bajariladigan fayllar (.php) taqiqlangan: " + esc(fname), cls="err"))
            # Bajariladigan kengaytmalar (haqiqiy tekshiruv registrga befarq bo'lishi kerak edi):
            execu = (".php", ".phtml", ".php3", ".php4", ".php5", ".phar", ".phtm")
            if fname.lower().endswith(execu):
                return self._send(200, page_upload(
                    msg="🚩 Filtr aldandi! «" + esc(fname) + "» bajariladigan fayl qabul qilindi. FLAG: " + esc(FLAG_UPLOAD),
                    cls="note"))
            return self._send(200, page_upload(msg="✓ «" + esc(fname) + "» yuklandi (zararsiz fayl).", cls="note"))
        if p == "/flag_check":
            form = self._form()
            if form.get("reset"):
                return self._fc_redirect(clear=True)
            flag = form.get("flag", [""])[0].strip()
            solved = self._fc_cookie()
            if flag in FLAGS:
                idx = FLAGS.index(flag)
                r = "already" if idx in solved else "ok"
                solved.add(idx)
            else:
                idx, r = -1, "wrong"
            return self._fc_redirect(location="/flag_check?r=%s&i=%d" % (r, idx), solved=solved)
        return self._send(404, "not found")

    # ---- multipart: faqat filename kerak ----
    def _upload_filename(self):
        try:
            n = int(self.headers.get("Content-Length", 0))
        except (TypeError, ValueError):
            n = 0
        raw = self.rfile.read(n) if n > 0 else b""
        m = re.search(br'filename="([^"]*)"', raw)
        if not m:
            return None
        fn = m.group(1).decode("utf-8", "replace")
        return fn if fn else None

    def _form(self):
        try:
            n = int(self.headers.get("Content-Length", 0))
        except (TypeError, ValueError):
            n = 0
        raw = self.rfile.read(n).decode("utf-8", "replace") if n > 0 else ""
        return urllib.parse.parse_qs(raw, keep_blank_values=True)

    # ---- flag_check cookie ----
    def _fc_cookie(self):
        raw = self.headers.get("Cookie", "") or ""
        solved = set()
        for part in raw.split(";"):
            if "=" in part:
                k, v = part.strip().split("=", 1)
                if k == "fc":
                    for x in v.split(","):
                        if x.isdigit() and 0 <= int(x) < len(FLAGS):
                            solved.add(int(x))
        return solved

    def _fc_redirect(self, location="/flag_check", solved=None, clear=False):
        if clear:
            cookie = "fc=; Path=/flag_check; Max-Age=0; SameSite=Lax"
            location = "/flag_check"
        else:
            cookie = "fc=%s; Path=/flag_check; Max-Age=%d; SameSite=Lax" % (
                ",".join(str(i) for i in sorted(solved or set())), 30 * 24 * 3600)
        try:
            self.send_response(303)
            self.send_header("Location", location)
            self.send_header("Set-Cookie", cookie)
            self.send_header("Content-Length", "0")
            self.end_headers()
        except (BrokenPipeError, ConnectionResetError):
            pass

    def log_message(self, fmt, *args):
        sys.stderr.write("  %s - %s\n" % (self.client_address[0] if self.client_address else "-", fmt % args))


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
    return ips


def main():
    global SERVE_PORT, DB_PATH, JAIL
    ap = argparse.ArgumentParser(description="Web Vulns Lab — offline exploitable practice.")
    ap.add_argument("--host", default="0.0.0.0")
    ap.add_argument("--port", type=int, default=8087)
    args = ap.parse_args()
    DB_PATH = build_db()
    JAIL = build_jail()
    httpd = ThreadingHTTPServer((args.host, args.port), Handler)
    httpd.daemon_threads = True
    SERVE_PORT = httpd.server_address[1]
    ln = "=" * 60
    print(ln)
    print("  🧪  Web Vulns Lab  —  amaliy mashq maydoni (oflayn)")
    print(ln)
    print("  Ishlamoqda:  http://%s:%d" % (args.host, SERVE_PORT))
    print("  Shu kompyuterda:        http://localhost:%d" % SERVE_PORT)
    for ip in lan_ips():
        print("  Tarmoqdagi o'quvchilar: http://%s:%d" % (ip, SERVE_PORT))
    print(ln)
    print("  %d ta mashq: SQLi · IDOR · LFI · Command Injection · SSTI · File Upload" % len(CHALLENGES))
    print("  Flag topshirish:  /flag_check")
    print("  ⚠️  Ataylab zaif — faqat izolyatsiya qilingan lab. Xavfsiz: RCE jail/simulyatsiya.")
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
        shutil.rmtree(JAIL, ignore_errors=True)


if __name__ == "__main__":
    main()
