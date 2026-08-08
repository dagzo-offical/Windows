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
#  Batch 2 (3 mavzu × 3 daraja — oson/o'rta/qiyin):
#    7-9)  NoSQL Injection    /nosql · /nosql/blind · /nosql/search
#   10-12) JWT Attacks        /jwt · /jwt/hs · /jwt/jwk
#   13-15) Business Logic     /biz · /biz/coupon · /biz/premium
#
#  ⚠️  ATAYLAB ZAIF — faqat izolyatsiya qilingan o'quv tarmog'ida. Internetga ochmang.
#  XAVFSIZLIK: fayl o'qish (LFI) SOXTA jail katalogiga qamalgan; «buyruq bajarish»
#  (cmdi) ichki SIMULYATSIYA; SSTI cheklangan baholovchi — real host'ga ta'sir yo'q.
# ============================================================================
"""Web Vulns Lab — offline, exploitable web-vulnerability practice (pure stdlib)."""

import argparse
import base64
import hashlib
import hmac
import html
import json as jsonlib
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
# Batch 2 — 3 mavzu × 3 daraja
FLAG_NOSQL1 = "EJPT{n05ql_0p3r4t0r_4uth_byp4ss}"
FLAG_NOSQL2 = "EJPT{n05ql_r3g3x_bl1nd_3xtr4ct}"
FLAG_NOSQL3 = "EJPT{n05ql_wh3r3_l34k_h1dd3n_d0c}"
FLAG_JWT1 = "EJPT{jwt_4lg_n0n3_f0rg3d_4dm1n}"
FLAG_JWT2 = "EJPT{jwt_w34k_s3cr3t_cr4ck3d}"
FLAG_JWT3 = "EJPT{jwt_3mb3dd3d_jwk_tru5t3d}"
FLAG_BIZ1 = "EJPT{b1z_n3g4t1v3_qty_r3fund}"
FLAG_BIZ2 = "EJPT{b1z_c0up0n_st4ck_t0_z3r0}"
FLAG_BIZ3 = "EJPT{b1z_w0rkfl0w_p4y_byp4ss}"

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

    # ── NoSQL Injection (L38) — 3 daraja ──
    {"id": "nosql1", "path": "/nosql", "name": "NoSQL — Auth bypass", "diff": "easy", "icon": "🍃",
     "flag": FLAG_NOSQL1,
     "descu": "Operator kiritish orqali admin sifatida kiring.", "desce": "Log in as admin via operator injection.",
     "hintu": "Login MongoDB uslubidagi so'rov quradi. Parolni oddiy satr emas, OPERATOR obyekti qiling. Burp bilan parametr nomini `password[$ne]=x` ga o'zgartiring yoki qiymatga `{\"$ne\":\"x\"}` JSON yuboring — `$ne` (teng emas) shartni har doim rost qiladi.",
     "hinte": "The login builds a MongoDB-style query. Make the password an OPERATOR object, not a plain string. With Burp rename the param to `password[$ne]=x` or send the value `{\"$ne\":\"x\"}` — `$ne` (not-equal) makes the condition always true."},
    {"id": "nosql2", "path": "/nosql/blind", "name": "NoSQL — Blind regex", "diff": "medium", "icon": "🍃",
     "flag": FLAG_NOSQL2,
     "descu": "Admin parolini $regex bilan belgima-belgi chiqaring.", "desce": "Extract the admin password char-by-char with $regex.",
     "hintu": "Endpoint faqat «mos/mos emas» deb javob beradi (bulyan orakul). `username=admin&password[$regex]=^S` yuboring: mos kelsa parol S bilan boshlanadi. Prefiksni uzaytirib to'liq parolni yig'ing, so'ng oddiy parol bilan kiring.",
     "hinte": "The endpoint only answers «match / no match» (a boolean oracle). Send `username=admin&password[$regex]=^S`: a match means the password starts with S. Grow the prefix to recover the full password, then log in with it plainly."},
    {"id": "nosql3", "path": "/nosql/search", "name": "NoSQL — $where leak", "diff": "hard", "icon": "🍃",
     "flag": FLAG_NOSQL3,
     "descu": "Yashirin (public bo'lmagan) hujjatni operator bilan oshkor qiling.", "desce": "Reveal a hidden (non-public) document via operator injection.",
     "hintu": "Qidiruv `{\"name\":{\"$regex\":q},\"public\":true}` so'rovini quradi. `filter` parametri orqali xom JSON qo'shiladi va mavjud kalitlarni ustiga yozadi. `filter={\"public\":{\"$ne\":true}}` yoki `filter={\"$where\":\"1==1\"}` bilan `public:true` cheklovini olib tashlang.",
     "hinte": "Search builds `{\"name\":{\"$regex\":q},\"public\":true}`. The `filter` param injects raw JSON that overrides existing keys. Drop the `public:true` restriction with `filter={\"public\":{\"$ne\":true}}` or `filter={\"$where\":\"1==1\"}`."},

    # ── JWT Attacks (L39) — 3 daraja ──
    {"id": "jwt1", "path": "/jwt", "name": "JWT — alg:none", "diff": "easy", "icon": "🎫",
     "flag": FLAG_JWT1,
     "descu": "Imzosiz (alg:none) token bilan admin bo'ling.", "desce": "Become admin with an unsigned (alg:none) token.",
     "hintu": "Guest token beriladi. Uni 3 qismga ajrating (base64url), header `alg` ni `none` qiling, payload `role` ni `admin` qiling, imzoni (uchinchi qism) BO'SH qoldiring (`header.payload.`). Server alg:none ni ishonib qabul qiladi.",
     "hinte": "You get a guest token. Split it (base64url), set header `alg` to `none`, set payload `role` to `admin`, and leave the signature (third part) EMPTY (`header.payload.`). The server trusts alg:none."},
    {"id": "jwt2", "path": "/jwt/hs", "name": "JWT — weak secret", "diff": "medium", "icon": "🎫",
     "flag": FLAG_JWT2,
     "descu": "HS256 zaif maxfiy kalitini toping va admin token soxtalashtiring.", "desce": "Crack the weak HS256 secret and forge an admin token.",
     "hintu": "Token HS256 (imzoli) — maxfiy kalit juda zaif (keng tarqalgan wordlist'da bor). Tokenni `hashcat -m 16500` yoki `jwt_tool` bilan buzing (kalit — oddiy so'z). Topgan kalit bilan `role:admin` tokenni imzolang.",
     "hinte": "The token is HS256 (signed) but the secret is very weak (in any common wordlist). Crack it with `hashcat -m 16500` or `jwt_tool` (the key is a common word). Sign a `role:admin` token with the recovered secret."},
    {"id": "jwt3", "path": "/jwt/jwk", "name": "JWT — embedded JWK", "diff": "hard", "icon": "🎫",
     "flag": FLAG_JWT3,
     "descu": "Header ichiga o'z kalitingizni joylab tokenni o'zingiz imzolang.", "desce": "Embed your own key in the header and self-sign the token.",
     "hintu": "Zaif tekshiruvchi token HEADER ichidagi `jwk` (o'rnatilgan kalit) ni ISHONADI. Header'ga `\"jwk\":{\"kty\":\"oct\",\"k\":\"<siz-tanlagan-kalit>\"}` qo'shing, `role:admin` payload'ni o'sha kalit bilan HS256 imzolang — server sizning kalitingiz bilan tekshiradi.",
     "hinte": "The vulnerable verifier TRUSTS a `jwk` (embedded key) inside the token HEADER. Add `\"jwk\":{\"kty\":\"oct\",\"k\":\"<your-key>\"}` to the header and HS256-sign a `role:admin` payload with that key — the server verifies with your own key."},

    # ── Business Logic (L40) — 3 daraja ──
    {"id": "biz1", "path": "/biz", "name": "Logic — negative qty", "diff": "easy", "icon": "🧮",
     "flag": FLAG_BIZ1,
     "descu": "Manfiy miqdor bilan «pul qaytarish» mantig'ini buzing.", "desce": "Abuse the refund logic with a negative quantity.",
     "hintu": "Jami = narx × miqdor. Server miqdorning musbatligini tekshirmaydi. Miqdorni MANFIY (masalan -5) qiling — jami manfiy chiqadi, ya'ni do'kon sizga «qaytaradi».",
     "hinte": "Total = price × quantity. The server never checks that quantity is positive. Set quantity NEGATIVE (e.g. -5) — the total goes negative, i.e. the shop «refunds» you."},
    {"id": "biz2", "path": "/biz/coupon", "name": "Logic — coupon stack", "diff": "medium", "icon": "🧮",
     "flag": FLAG_BIZ2,
     "descu": "Bitta kuponni qayta-qayta qo'llab narxni nolga tushiring.", "desce": "Stack one coupon repeatedly to drop the price to zero.",
     "hintu": "`SAVE20` kuponi har safar 20% chegirma beradi, lekin server uni FAQAT bir marta ishlatilganini tekshirmaydi. Bitta so'rovda kuponni ko'p marta yuboring (`coupon=SAVE20&coupon=SAVE20&...`) — chegirmalar yig'ilib narx ≤ 0 bo'ladi.",
     "hinte": "The `SAVE20` coupon gives 20% off each time, but the server never checks it's used only ONCE. Send the coupon many times in one request (`coupon=SAVE20&coupon=SAVE20&...`) — the discounts add up until the price is ≤ 0."},
    {"id": "biz3", "path": "/biz/premium", "name": "Logic — workflow bypass", "diff": "hard", "icon": "🧮",
     "flag": FLAG_BIZ3,
     "descu": "To'lov bosqichini o'tkazib yuborib premium hisobotni oling.", "desce": "Skip the payment step and grab the premium report.",
     "hintu": "Oqim: savat → to'lov → tasdiq. `/biz/confirm` esa to'lov HAQIQATAN bo'lganini server tomonda tekshirmaydi — u faqat `paid=1` parametriga ishonadi. To'g'ridan-to'g'ri `/biz/confirm?item=premium&paid=1` ga boring (forced browsing).",
     "hinte": "Flow: cart → pay → confirm. But `/biz/confirm` never verifies payment server-side — it just trusts a `paid=1` param. Go straight to `/biz/confirm?item=premium&paid=1` (forced browsing)."},
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


# ===========================================================================
#  Batch 2 — NoSQL Injection · JWT · Business Logic
#  Har biri REAL zaiflik mantig'i; XAVFSIZ (haqiqiy Mongo/eval/host-crypto yo'q).
# ===========================================================================

# ---- NoSQL: soxta hujjatlar + xavfsiz operator-baholovchi (Python eval YO'Q) ----
NOSQL_ADMIN_PW = "Mongo2024"
NOSQL_USERS = [
    {"username": "admin", "password": NOSQL_ADMIN_PW, "role": "admin"},
    {"username": "guest", "password": "guest", "role": "user"},
]
NOSQL_DOCS = [
    {"name": "Quarterly Report 2024-Q1", "public": True, "note": "Revenue up 8%."},
    {"name": "Quarterly Report 2024-Q2", "public": True, "note": "Revenue up 11%."},
    {"name": "INTERNAL - Executive Salaries", "public": False, "note": FLAG_NOSQL3},
]


def _num(x):
    try:
        return float(x)
    except (TypeError, ValueError):
        return float("-inf")


def _cmp(field_val, cond):
    """Bitta maydon shartini baholaydi: skalyar (tenglik) yoki {operator: qiymat}."""
    if isinstance(cond, dict):
        for op, val in cond.items():
            if op == "$eq" and not (field_val == val):
                return False
            elif op == "$ne" and not (field_val != val):
                return False
            elif op == "$gt" and not (_num(field_val) > _num(val)):
                return False
            elif op == "$gte" and not (_num(field_val) >= _num(val)):
                return False
            elif op == "$lt" and not (_num(field_val) < _num(val)):
                return False
            elif op == "$in" and not (isinstance(val, list) and field_val in val):
                return False
            elif op == "$regex":
                try:
                    if re.search(str(val), str(field_val)) is None:
                        return False
                except re.error:
                    return False
            elif op not in ("$eq", "$ne", "$gt", "$gte", "$lt", "$in", "$regex"):
                return False   # noma'lum operator -> mos emas
        return True
    return field_val == cond


def _where_taut(expr):
    """$where — Python eval EMAS: faqat tavtologiyani (1==1, true, ...) tan oladi."""
    e = re.sub(r"\s+", "", str(expr)).lower().rstrip(";")
    return e in ("true", "1==1", "1", "'a'=='a'", '"a"=="a"',
                 "returntrue", "return1==1", "return!0", "!0", "0==0")


def _query_match(doc, query):
    if not isinstance(query, dict):
        return False
    for field, cond in query.items():
        if field == "$where":
            if not _where_taut(cond):
                return False
        elif field == "$or":
            if not any(_query_match(doc, sub) for sub in (cond or [])):
                return False
        elif field == "$and":
            if not all(_query_match(doc, sub) for sub in (cond or [])):
                return False
        elif not _cmp(doc.get(field), cond):
            return False
    return True


def nosql_find(docs, query):
    return [d for d in docs if _query_match(d, query)]


def build_nosql_query(params):
    """`password[$ne]=x` (bracket) yoki `{"$ne":"x"}` (JSON qiymat) -> Mongo so'rov dict."""
    q = {}
    for k, vs in params.items():
        v = vs[0] if isinstance(vs, list) else vs
        m = re.match(r"^([^\[\]]+)\[(\$[a-zA-Z]+)\]$", k)
        if m:
            field, op = m.group(1), m.group(2)
            if not isinstance(q.get(field), dict):
                q[field] = {}
            q[field][op] = v
        else:
            vv = v
            if isinstance(v, str) and v.strip().startswith("{"):
                try:
                    parsed = jsonlib.loads(v)
                    if isinstance(parsed, dict):
                        vv = parsed
                except Exception:
                    pass
            if k not in q:
                q[k] = vv
    return q


# ---- JWT: base64url + HS256 (stdlib hmac/hashlib) — soxta host-crypto yo'q ----
JWT_MAIN_SECRET = "n0b0dy-w1ll-gu3ss-th1s-R00t-k3y-8842"   # server asosiy kaliti (topib bo'lmaydi)
JWT_WEAK_SECRET = "secret"                                 # medium: ataylab zaif


def _b64url(data):
    if isinstance(data, str):
        data = data.encode("utf-8")
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def _b64url_dec(seg):
    seg = seg + "=" * (-len(seg) % 4)
    return base64.urlsafe_b64decode(seg.encode("ascii"))


def _hs256(signing_input, secret):
    if isinstance(secret, str):
        secret = secret.encode("utf-8")
    return _b64url(hmac.new(secret, signing_input.encode("ascii"), hashlib.sha256).digest())


def jwt_make(payload, secret, alg="HS256", extra_header=None):
    header = {"alg": alg, "typ": "JWT"}
    if extra_header:
        header.update(extra_header)
    si = (_b64url(jsonlib.dumps(header, separators=(",", ":"))) + "."
          + _b64url(jsonlib.dumps(payload, separators=(",", ":"))))
    sig = "" if alg == "none" else _hs256(si, secret)
    return si + "." + sig


def jwt_parts(token):
    try:
        h, p, s = token.split(".")
        return jsonlib.loads(_b64url_dec(h)), jsonlib.loads(_b64url_dec(p)), h + "." + p, s
    except Exception:
        return None, None, None, None


JWT_GUEST_NONE = jwt_make({"user": "guest", "role": "user"}, JWT_MAIN_SECRET)
JWT_GUEST_HS = jwt_make({"user": "guest", "role": "user"}, JWT_WEAK_SECRET)
JWT_GUEST_JWK = jwt_make({"user": "guest", "role": "user"}, JWT_MAIN_SECRET, extra_header={"kid": "main"})


def jwt_verify_none(token):
    header, payload, si, sig = jwt_parts(token)
    if header is None:
        return {"ok": False, "msg": "Token yaroqsiz (parse xato)."}
    alg = str(header.get("alg", "")).lower()
    if alg == "none":
        ok = True                                            # ZAIF: imzosiz qabul qilinadi
    elif alg == "hs256":
        ok = hmac.compare_digest(sig, _hs256(si, JWT_MAIN_SECRET))
    else:
        return {"ok": False, "msg": "Qo'llab-quvvatlanmaydigan alg."}
    if not ok:
        return {"ok": False, "msg": "Imzo tekshiruvi muvaffaqiyatsiz."}
    role = str(payload.get("role", "user")) if isinstance(payload, dict) else "user"
    if role == "admin":
        return {"ok": True, "flag": FLAG_JWT1, "msg": "alg:none qabul qilindi - admin token soxtalashtirildi!"}
    return {"ok": True, "msg": "Token yaroqli (rol: " + role + ") - admin emas."}


def jwt_verify_hs(token):
    header, payload, si, sig = jwt_parts(token)
    if header is None:
        return {"ok": False, "msg": "Token yaroqsiz."}
    if str(header.get("alg", "")).lower() != "hs256":
        return {"ok": False, "msg": "Faqat HS256 qabul qilinadi."}
    if not hmac.compare_digest(sig, _hs256(si, JWT_WEAK_SECRET)):     # ZAIF kalit
        return {"ok": False, "msg": "Imzo noto'g'ri (kalit mos emas)."}
    role = str(payload.get("role", "user")) if isinstance(payload, dict) else "user"
    if role == "admin":
        return {"ok": True, "flag": FLAG_JWT2, "msg": "Zaif kalit bilan imzolangan admin token qabul qilindi!"}
    return {"ok": True, "msg": "Token yaroqli (rol: " + role + ")."}


def jwt_verify_jwk(token):
    header, payload, si, sig = jwt_parts(token)
    if header is None:
        return {"ok": False, "msg": "Token yaroqsiz."}
    if str(header.get("alg", "")).lower() != "hs256":
        return {"ok": False, "msg": "Faqat HS256."}
    jwk = header.get("jwk") or {}
    k = jwk.get("k") if isinstance(jwk, dict) else None
    secret = k if k else JWT_MAIN_SECRET                             # ZAIF: header'dagi kalitga ishonadi
    if not hmac.compare_digest(sig, _hs256(si, secret)):
        return {"ok": False, "msg": "Imzo noto'g'ri."}
    role = str(payload.get("role", "user")) if isinstance(payload, dict) else "user"
    if role == "admin" and k:
        return {"ok": True, "flag": FLAG_JWT3, "msg": "Header'ga o'rnatilgan JWK bilan imzolangan admin token qabul qilindi!"}
    if role == "admin":
        return {"ok": True, "flag": FLAG_JWT3, "msg": "Admin token qabul qilindi!"}
    return {"ok": True, "msg": "Token yaroqli (rol: " + role + ")."}


# ---- Batch 2 sahifalari ----
def _flag_panel(flag):
    return '<div class="flag">🚩 FLAG: ' + esc(flag) + '</div>'


def page_nosql(result=None, attempted=False):
    body = head("NoSQL - Auth bypass") + '<h1>🍃 Mongo Members - Sign in</h1><p class="mut">A\'zolar zonasi. Demo hisob: guest / guest.</p>'
    if result == "admin":
        body += '<div class="flag">✓ Admin sifatida kirdingiz (operator injection)!</div>' + _flag_panel(FLAG_NOSQL1)
    elif result == "user":
        body += '<div class="note">Kirdingiz (rol: user) - lekin admin emas.</div>'
    elif attempted:
        body += '<div class="err">Login yoki parol noto\'g\'ri.</div>'
    body += ('<div class="panel"><form method="get" action="/nosql">'
             '<label>Login</label><input type="text" name="username" value="guest">'
             '<label>Parol</label><input type="text" name="password" value="">'
             '<button class="btn" type="submit">Kirish</button></form>'
             '<p class="mut" style="font-size:12px;margin-top:8px">Server: '
             '<code>db.users.findOne({username, password})</code> - kiritma tozalanmaydi.</p></div>')
    return body + foot()


def page_nosql_blind(oracle=None, cracked=False):
    body = head("NoSQL - Blind regex") + '<h1>🍃 Identity verification</h1><p class="mut">Foydalanuvchi va parolni tasdiqlang. Tizim faqat «mos / mos emas» deydi.</p>'
    if cracked:
        body += '<div class="flag">✓ Admin paroli tiklandi va kirish tasdiqlandi!</div>' + _flag_panel(FLAG_NOSQL2)
    elif oracle == "match":
        body += '<div class="note">✓ Mos keldi - shu shart uchun yozuv mavjud.</div>'
    elif oracle == "nomatch":
        body += '<div class="err">✗ Mos kelmadi - bunday yozuv yo\'q.</div>'
    body += ('<div class="panel"><form method="get" action="/nosql/blind">'
             '<label>Login</label><input type="text" name="username" value="admin">'
             '<label>Parol (yoki $regex)</label><input type="text" name="password" value="">'
             '<button class="btn" type="submit">Tasdiqlash</button></form>'
             '<p class="mut" style="font-size:12px;margin-top:8px">Burp bilan: '
             '<code>password[$regex]=^M</code> ... prefiksni uzaytiring.</p></div>')
    return body + foot()


def page_nosql_search(q="", results=None, leaked=False):
    body = head("NoSQL - $where leak") + '<h1>🍃 Document search</h1><p class="mut">Hujjat nomi bo\'yicha qidiring (odatda faqat public hujjatlar).</p>'
    body += ('<div class="panel"><form method="get" action="/nosql/search">'
             '<label>Qidiruv (name)</label><input type="text" name="q" value="' + esc(q) + '">'
             '<button class="btn" type="submit">Qidirish</button></form>'
             '<p class="mut" style="font-size:12px;margin-top:8px">So\'rov: '
             '<code>find({name:{$regex:q}, public:true})</code> - qo\'shimcha <code>filter</code> JSON standart so\'rovni almashtiradi.</p></div>')
    if results is not None:
        rows = ""
        for d in results:
            rows += ('<tr><td>' + esc(d["name"]) + '</td><td>' + ("public" if d.get("public") else "INTERNAL")
                     + '</td><td>' + esc(d.get("note", "")) + '</td></tr>')
        body += ('<div class="panel"><table><tr><th>Nomi</th><th>Ko\'rinish</th><th>Izoh</th></tr>'
                 + (rows or '<tr><td colspan="3" class="mut">Hech narsa topilmadi.</td></tr>') + '</table></div>')
        if leaked:
            body += '<div class="flag">✓ Yashirin (public bo\'lmagan) hujjat oshkor bo\'ldi!</div>' + _flag_panel(FLAG_NOSQL3)
    return body + foot()


def _jwt_common(title, intro, guest_token, result):
    body = head(title) + '<h1>🎫 ' + esc(title) + '</h1><p class="mut">' + intro + '</p>'
    body += ('<div class="panel"><div class="mut" style="font-size:12px">Boshlang\'ich (guest) token:</div>'
             '<pre style="white-space:pre-wrap;word-break:break-all">' + esc(guest_token) + '</pre>'
             '<div class="mut" style="font-size:12px;margin-top:8px">Tokenni o\'zgartiring va shu yerda tekshiring '
             '(yoki <code>?token=...</code>):</div>'
             '<form method="get" style="margin-top:8px"><input type="text" name="token" value="" '
             'placeholder="header.payload.signature"><button class="btn" type="submit">Tekshirish</button></form></div>')
    if result:
        if result.get("flag"):
            body += '<div class="flag">✓ ' + esc(result["msg"]) + '</div>' + _flag_panel(result["flag"])
        elif result.get("ok"):
            body += '<div class="note">' + esc(result["msg"]) + '</div>'
        else:
            body += '<div class="err">' + esc(result["msg"]) + '</div>'
    return body + foot()


def page_biz(qty=None, total=None):
    body = head("Logic - negative qty") + '<h1>🧮 Gadget Store</h1><p class="mut">Mahsulot: <b>Wireless Mouse</b> - <b>$25</b> / dona.</p>'
    body += ('<div class="panel"><form method="get" action="/biz">'
             '<label>Miqdor</label><input type="text" name="qty" value="1">'
             '<button class="btn" type="submit">Buyurtma berish</button></form></div>')
    if total is not None:
        body += '<div class="panel">Miqdor: ' + esc(str(qty)) + ' × $25 = <b>$' + esc(str(total)) + '</b>'
        if total < 0:
            body += ' - <span style="color:#8ff0d3">hisobingizga $' + esc(str(-total)) + ' qaytarildi</span>'
        body += '</div>'
        if total < 0:
            body += _flag_panel(FLAG_BIZ1)
    return body + foot()


def page_biz_coupon(coupons=None, final=None):
    body = head("Logic - coupon stack") + '<h1>🧮 Checkout</h1><p class="mut">Savat jami: <b>$50</b>. Kupon <code>SAVE20</code> = 20% chegirma.</p>'
    body += ('<div class="panel"><form method="get" action="/biz/coupon">'
             '<label>Kupon kodi</label><input type="text" name="coupon" value="SAVE20">'
             '<button class="btn" type="submit">Qo\'llash</button></form>'
             '<p class="mut" style="font-size:12px;margin-top:8px">Ko\'p kupon: '
             '<code>?coupon=SAVE20&coupon=SAVE20&...</code></p></div>')
    if final is not None:
        applied = len([c for c in (coupons or []) if c.strip().upper() == "SAVE20"])
        body += ('<div class="panel">Qo\'llangan kuponlar: ' + str(applied) + ' × 20% (-$10) = -$'
                 + esc(str(applied * 10)) + '<br>Yakuniy narx: <b>$' + esc(str(final)) + '</b></div>')
        if final <= 0:
            body += '<div class="note">Narx nol yoki manfiy - to\'lov talab qilinmaydi.</div>' + _flag_panel(FLAG_BIZ2)
    return body + foot()


def page_biz_premium():
    body = head("Logic - workflow bypass") + '<h1>🧮 Premium Reports</h1><p class="mut">Premium hisobot to\'lovdan keyin ochiladi.</p>'
    body += ('<div class="panel"><b>Xarid oqimi (3 bosqich):</b>'
             '<ol style="color:#8ea0c4;margin:8px 0"><li>Savat - <code>/biz/premium</code></li>'
             '<li>To\'lov - <code>/biz/pay?item=premium</code></li>'
             '<li>Tasdiq - <code>/biz/confirm?item=premium&amp;paid=1</code></li></ol>'
             '<a class="btn" href="/biz/pay?item=premium">To\'lovga o\'tish</a></div>'
             '<p class="mut" style="font-size:12px">Server har bosqich holatini qanday tekshiradi? Tasdiq bosqichini to\'g\'ridan-to\'g\'ri sinab ko\'ring.</p>')
    return body + foot()


def page_biz_pay(item):
    body = head("Logic - payment") + '<h1>🧮 Payment</h1>'
    body += ('<div class="panel">«' + esc(item) + '» uchun to\'lov sahifasi. To\'lov shlyuzi demo rejimida ishlamayapti.'
             '<br><br><a class="btn" href="/biz/confirm?item=' + esc(item) + '&amp;paid=1">To\'lovni yakunlash</a></div>')
    return body + foot()


def page_biz_confirm(item, paid):
    body = head("Logic - confirm") + '<h1>🧮 Order confirmation</h1>'
    if paid == "1":
        body += '<div class="note">Buyurtma tasdiqlandi: «' + esc(item) + '».</div>'
        if item == "premium":
            body += ('<div class="panel"><b>PREMIUM HISOBOT</b><br>Q4 strategik tahlil (odatda faqat to\'lovchilar uchun).</div>'
                     '<div class="flag">✓ To\'lov haqiqatan amalga oshdimi - server tekshirmadi (forced browsing)!</div>'
                     + _flag_panel(FLAG_BIZ3))
    else:
        body += '<div class="err">To\'lov tasdiqlanmagan (paid ≠ 1).</div>'
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
        # ── Batch 2: NoSQL ──
        if p == "/nosql":
            if not any(k.split("[")[0] in ("username", "password") for k in qs):
                return self._send(200, page_nosql())
            sub = {k: v for k, v in qs.items() if k.split("[")[0] in ("username", "password")}
            query = build_nosql_query(sub)
            found = nosql_find(NOSQL_USERS, query) if query else []
            if any(u["role"] == "admin" for u in found):
                return self._send(200, page_nosql(result="admin"))
            if found:
                return self._send(200, page_nosql(result="user"))
            return self._send(200, page_nosql(attempted=True))
        if p == "/nosql/blind":
            if not any(k.split("[")[0] in ("username", "password") for k in qs):
                return self._send(200, page_nosql_blind())
            sub = {k: v for k, v in qs.items() if k.split("[")[0] in ("username", "password")}
            query = build_nosql_query(sub)
            pw = query.get("password")
            if isinstance(pw, str) and query.get("username") == "admin" and pw == NOSQL_ADMIN_PW:
                return self._send(200, page_nosql_blind(cracked=True))
            found = nosql_find(NOSQL_USERS, query) if query else []
            hit = any(u["role"] == "admin" for u in found)
            return self._send(200, page_nosql_blind(oracle=("match" if hit else "nomatch")))
        if p == "/nosql/search":
            if "q" not in qs and "filter" not in qs:
                return self._send(200, page_nosql_search())
            q = qs.get("q", [""])[0]
            query = {"name": {"$regex": re.escape(q)}, "public": True}
            if "filter" in qs:
                try:
                    extra = jsonlib.loads(qs.get("filter", ["{}"])[0])
                    if isinstance(extra, dict):
                        query = extra                    # ZAIF: foydalanuvchi filtri standart so'rovni almashtiradi
                except Exception:
                    pass
            results = nosql_find(NOSQL_DOCS, query)
            leaked = any(not d.get("public") for d in results)
            return self._send(200, page_nosql_search(q=q, results=results, leaked=leaked))
        # ── Batch 2: JWT ──
        if p == "/jwt":
            tok = qs.get("token", [""])[0]
            res = jwt_verify_none(tok) if tok else None
            return self._send(200, _jwt_common("JWT - alg:none",
                "Zaif tekshiruvchi <code>alg:none</code> tokenni imzosiz qabul qiladi. Guest tokenni oling, payload "
                "<code>role</code> ni <code>admin</code>, header <code>alg</code> ni <code>none</code> qiling, imzoni bo\'sh qoldiring.",
                JWT_GUEST_NONE, res))
        if p == "/jwt/hs":
            tok = qs.get("token", [""])[0]
            res = jwt_verify_hs(tok) if tok else None
            return self._send(200, _jwt_common("JWT - weak secret",
                "Token HS256 bilan imzolangan, lekin maxfiy kalit juda zaif (keng tarqalgan so\'z). Kalitni buzing "
                "(<code>hashcat -m 16500</code> / <code>jwt_tool</code>) va <code>role:admin</code> tokenni imzolang.",
                JWT_GUEST_HS, res))
        if p == "/jwt/jwk":
            tok = qs.get("token", [""])[0]
            res = jwt_verify_jwk(tok) if tok else None
            return self._send(200, _jwt_common("JWT - embedded JWK",
                "Zaif tekshiruvchi token HEADER ichidagi <code>jwk.k</code> (o\'rnatilgan kalit) ga ISHONADI. "
                "Header\'ga o\'z kalitingizni joylang va <code>role:admin</code> payload\'ni o\'sha kalit bilan HS256 imzolang.",
                JWT_GUEST_JWK, res))
        # ── Batch 2: Business Logic ──
        if p == "/biz":
            if "qty" not in qs:
                return self._send(200, page_biz())
            try:
                qv = int(qs.get("qty", ["1"])[0])
            except ValueError:
                qv = 1
            return self._send(200, page_biz(qty=qv, total=25 * qv))
        if p == "/biz/coupon":
            if "coupon" not in qs:
                return self._send(200, page_biz_coupon())
            coupons = qs.get("coupon", [])
            applied = len([c for c in coupons if c.strip().upper() == "SAVE20"])
            return self._send(200, page_biz_coupon(coupons=coupons, final=50 - 10 * applied))
        if p == "/biz/premium":
            return self._send(200, page_biz_premium())
        if p == "/biz/pay":
            return self._send(200, page_biz_pay(qs.get("item", ["premium"])[0]))
        if p == "/biz/confirm":
            return self._send(200, page_biz_confirm(qs.get("item", [""])[0], qs.get("paid", ["0"])[0]))
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
    print("  %d ta mashq: SQLi · IDOR · LFI · CmdInj · SSTI · Upload · NoSQL · JWT · BizLogic" % len(CHALLENGES))
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
