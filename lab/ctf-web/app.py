#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# ============================================================================
#  Nimbus Reports — mustaqil (standalone) web CTF  ·  MEDIUM
#  Sof Python 3 (faqat standart kutubxona) — Docker/PHP KERAK EMAS.
#
#  Nega Python? Docker'ning e'lon qilingan portlari (published ports / NAT)
#  ba'zi mashinalarda (ayniqsa Docker Desktop, Windows/Mac) LAN'ga chiqmaydi —
#  shu sabab tarmoqdagi o'quvchilar :8085 ga ULANA OLMAYDI. Bu server esa
#  xostning HAQIQIY tarmoq interfeysiga (0.0.0.0:8085) to'g'ridan-to'g'ri
#  bog'lanadi — oradagi Docker qatlamisiz. Bitta buyruq:
#
#       python3 app.py                   # 0.0.0.0:8085 da ishga tushadi
#       python3 app.py --port 9000
#
#  Ichida 4 web zaiflik (Docker versiyasi bilan bir xil flaglar):
#    1) IDOR / broken access  — POST /download.php  (report_id=0 → flag)
#    2) Information disclosure — /storage-backup/ ochiq katalog → base64
#    3) Reflected XSS + WAF    — /search.php?q=  (<svg onload> bypass, /flag.php)
#    4) SSRF + decimal bypass  — /fetch.php?url=  (http://2130706433/internal.php)
#
#  ⚠️  ATAYLAB ZAIF — faqat izolyatsiya qilingan o'quv tarmog'ida ishlating.
#      INTERNETGA OCHMANG. (SSRF faqat loopback'ga yo'naltiriladi — tashqi
#      xostlarga so'rov yubormaydi, ya'ni proksi sifatida suiste'mol qilinmaydi.)
# ============================================================================
"""Nimbus Reports standalone web CTF (pure Python stdlib)."""

import argparse
import base64
import html
import re
import socket
import sys
import urllib.error
import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

# ---- Flaglar (nishon ichida yashiringan; o'quvchi topib platformaga topshiradi) ----
FLAG_IDOR = "EJPT{id0r_burp_r3p0rt_z3r0}"
FLAG_INFO = "EJPT{3nc0d3d_b4ckup_l34k}"
FLAG_XSS = "EJPT{w4f_byp4ss_x55_r3fl3ct}"
FLAG_SSRF = "EJPT{ssrf_d3c1m4l_2_l0c4l}"
# info-disclosure flagi backup dump ichida base64 sifatida yashiringan
INFO_B64 = base64.b64encode(FLAG_INFO.encode()).decode()  # -> RUpQVHszbmMwZDNkX2I0Y2t1cF9sMzRrfQ==

SERVE_PORT = 8085  # bind()'dan keyin haqiqiy port bilan yangilanadi (SSRF self-fetch uchun)

# ---------------------------------------------------------------------------
#  Umumiy sarlavha/futer (inc.php ekvivalenti) — haqiqiy SaaS ko'rinishi
# ---------------------------------------------------------------------------
FAVICON = ("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 "
           "viewBox=%220 0 100 100%22%3E%3Ctext y=%22.9em%22 font-size%3D%2290%22%3E"
           "%E2%98%81%EF%B8%8F%3C/text%3E%3C/svg%3E")


def esc(s):
    """PHP htmlspecialchars(..., ENT_QUOTES) ekvivalenti."""
    return html.escape(str(s), quote=True)


def head(title, active=""):
    def on(k):
        return ' class="on"' if k == active else ''
    return (
        '<!doctype html><html lang="en"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1">'
        '<title>' + esc(title) + ' · Nimbus Reports</title>'
        '<link rel="stylesheet" href="/assets/style.css">'
        '<link rel="icon" href="' + FAVICON + '">'
        '</head><body>'
        '<header class="nav"><div class="wrap">'
        '<a class="brand" href="/">☁️ Nimbus<span>Reports</span></a>'
        '<nav><a href="/"' + on('home') + '>Overview</a>'
        '<a href="/about.php"' + on('about') + '>Product</a>'
        '<a href="/blog.php"' + on('blog') + '>Blog</a>'
        '<a href="/help.php"' + on('help') + '>Help</a>'
        '<a href="/pricing.php"' + on('pricing') + '>Pricing</a>'
        '<a href="/download.php"' + on('reports') + '>My Reports</a>'
        '<a class="btn" href="/login.php">Sign in</a>'
        '</nav></div></header><main class="wrap">'
    )


def foot():
    return (
        '</main><footer class="foot"><div class="wrap">'
        '<span>© 2024 Nimbus Reports, Inc. — cloud analytics &amp; reporting.</span>'
        '<span class="muted">status: operational · v3.4.1</span>'
        '</div></footer></body></html>'
    )


# ---------------------------------------------------------------------------
#  Statik kontent
# ---------------------------------------------------------------------------
STYLE_CSS = """:root{
  --bg:#0b1020; --panel:#121a30; --panel2:#0f1728; --border:#213050;
  --text:#e6ecf7; --muted:#8ea0c4; --brand:#22d3a6; --brand2:#2d7aff; --warn:#ffb454;
  --radius:14px; --mono:'JetBrains Mono',ui-monospace,Menlo,Consolas,monospace;
}
*{box-sizing:border-box}
body{margin:0;background:radial-gradient(1200px 600px at 70% -10%,#132146 0,var(--bg) 55%);
  color:var(--text);font:15px/1.6 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
a{color:inherit;text-decoration:none}
.wrap{max-width:1080px;margin:0 auto;padding:0 22px}
.nav{border-bottom:1px solid var(--border);background:rgba(9,14,28,.7);backdrop-filter:blur(8px);
  position:sticky;top:0;z-index:10}
.nav .wrap{display:flex;align-items:center;gap:18px;height:62px}
.brand{font-weight:800;font-size:19px;letter-spacing:.2px}
.brand span{color:var(--brand)}
.nav nav{margin-left:auto;display:flex;align-items:center;gap:20px;font-size:14px}
.nav nav a{color:var(--muted)}
.nav nav a:hover,.nav nav a.on{color:var(--text)}
.nav .btn,.btn{background:linear-gradient(180deg,var(--brand),#14b892);color:#04241b;
  padding:8px 16px;border-radius:10px;font-weight:700;border:0;cursor:pointer;font-size:14px}
.btn.blue{background:linear-gradient(180deg,var(--brand2),#1e5fd0);color:#fff}
.btn.ghost{background:transparent;border:1px solid var(--border);color:var(--text)}
main{padding:38px 0 60px;min-height:60vh}
.hero{padding:34px 0 10px}
.hero h1{font-size:40px;line-height:1.1;margin:.2em 0;letter-spacing:-.5px}
.hero p{color:var(--muted);font-size:18px;max-width:640px}
.eyebrow{color:var(--brand);font-weight:700;letter-spacing:.14em;text-transform:uppercase;font-size:12px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;margin:26px 0}
.card{background:linear-gradient(180deg,var(--panel),var(--panel2));border:1px solid var(--border);
  border-radius:var(--radius);padding:20px}
.card h3{margin:.1em 0 .3em;font-size:17px}
.card p{color:var(--muted);font-size:14px;margin:0}
.kpi{display:flex;gap:14px;flex-wrap:wrap;margin:22px 0}
.kpi .box{flex:1;min-width:150px;background:var(--panel);border:1px solid var(--border);
  border-radius:12px;padding:16px 18px}
.kpi .n{font-size:26px;font-weight:800}
.kpi .l{color:var(--muted);font-size:13px}
h2{font-size:24px;margin:34px 0 12px}
.panel{background:var(--panel);border:1px solid var(--border);border-radius:var(--radius);
  padding:22px;margin:18px 0}
label{display:block;color:var(--muted);font-size:13px;margin:10px 0 4px}
input[type=text],input[type=email],input[type=password]{width:100%;background:#0a1124;color:var(--text);
  border:1px solid var(--border);border-radius:10px;padding:11px 13px;font:14px var(--mono)}
.note{border-left:3px solid var(--warn);background:#1a1608;color:#ffe0a3;padding:10px 14px;
  border-radius:8px;font-size:14px}
.muted{color:var(--muted)}
.mono{font-family:var(--mono)}
table{width:100%;border-collapse:collapse;margin:8px 0}
th,td{text-align:left;padding:10px 12px;border-bottom:1px solid var(--border);font-size:14px}
th{color:var(--muted);font-weight:600}
.pill{display:inline-block;background:#0a2a20;color:var(--brand);border:1px solid #14513e;
  padding:2px 9px;border-radius:999px;font-size:12px;font-weight:700}
.foot{border-top:1px solid var(--border);color:var(--muted);margin-top:40px}
.foot .wrap{display:flex;justify-content:space-between;gap:12px;padding:20px 22px;font-size:13px;flex-wrap:wrap}
@media(max-width:720px){.nav nav a:not(.btn){display:none}.hero h1{font-size:30px}}
"""

ROBOTS_TXT = "User-agent: *\nDisallow: /assets/\nDisallow: /login.php\nDisallow: /contact.php\n"

# Information disclosure — ochiq qolgan backup dump (flag base64 ko'rinishida)
BACKUP_NAME = "nimbus_db_2024-01-15.sql.txt"
BACKUP_SQL = (
    "-- Nimbus Reports — partial DB export (STAGING). DO NOT SHIP.\n"
    "-- generated: 2024-01-15T03:12:04Z   host: nimbus-ops-1\n"
    "INSERT INTO workspaces (id,name,plan) VALUES (1,'acme-analytics','team');\n"
    "INSERT INTO users (id,email,role) VALUES (7,'ops@nimbus-reports.example','operator');\n"
    "-- ops handoff note (base64): " + INFO_B64 + "\n"
    "-- TODO: rotate the export token and delete this dump.\n"
)

# IDOR — hisobotlar webroot'dan tashqarida turgandek, faqat id bo'yicha beriladi.
# 1..12 — bir XIL to'liq report; 0 — ichki arxiv (flag).
_REPORT = (
    "Nimbus Reports — Monthly Summary\n"
    "Workspace: acme-analytics\n"
    "Period:    2024\n"
    "Status:    delivered\n\n"
    "KPIs\n"
    "  Active users:        4,213     (+8.0%)\n"
    "  Revenue:             $128,400  (+7.2%)\n"
    "  Reports generated:   1,204     (+10.7%)\n"
    "  Median query time:   42 ms     (-17.6%)\n"
    "  Uptime (30d):        98.9%     (+0.3%)\n\n"
    "Notes\n"
    "  All figures reconciled against the production replica.\n"
    "  Generated automatically by Nimbus v3.4.1.\n"
)
_REPORT_ZERO = (
    "Nimbus Reports — INTERNAL archive export (report #0)\n"
    "Workspace: acme-analytics (legacy)\n"
    "CLASSIFICATION: internal only\n\n"
    + FLAG_IDOR + "\n"
)


def report_body(rid):
    """0 → ichki arxiv (flag); 1..12 → bir xil oddiy hisobot; aks holda None."""
    if rid == 0:
        return _REPORT_ZERO
    if 1 <= rid <= 12:
        return _REPORT
    return None


# ---------------------------------------------------------------------------
#  Sahifalar (haqiqiy ko'rinishli SaaS kontenti — chalg'ituvchi/decoy)
# ---------------------------------------------------------------------------
def page_index():
    return head('Overview', 'home') + """
<section class="hero">
  <div class="eyebrow">Cloud analytics &amp; reporting</div>
  <h1>Every metric that matters,<br>in one clean dashboard.</h1>
  <p>Nimbus Reports turns your raw data into scheduled PDF/CSV reports, live dashboards
     and shareable links — trusted by 4,200+ teams.</p>
  <p style="margin-top:18px">
    <a class="btn" href="/download.php">Open my reports</a>
    &nbsp;<a class="btn ghost" href="/pricing.php">See pricing</a>
  </p>
</section>
<div class="kpi">
  <div class="box"><div class="n">4,213</div><div class="l">active workspaces</div></div>
  <div class="box"><div class="n">98.9%</div><div class="l">uptime (30d)</div></div>
  <div class="box"><div class="n">1.2M</div><div class="l">reports generated</div></div>
  <div class="box"><div class="n">42ms</div><div class="l">median query time</div></div>
</div>
<h2>What you get</h2>
<div class="grid">
  <div class="card"><h3>📊 Scheduled reports</h3><p>Daily, weekly and quarterly PDF/CSV exports delivered automatically to your inbox.</p></div>
  <div class="card"><h3>🔗 Shareable dashboards</h3><p>Publish a read-only link and let stakeholders explore the numbers themselves.</p></div>
  <div class="card"><h3>🔌 100+ integrations</h3><p>Connect Postgres, Stripe, GA4, Snowflake and more in a couple of clicks.</p></div>
  <div class="card"><h3>🛡️ SOC 2 &amp; SSO</h3><p>Enterprise-grade access control, audit logs and single sign-on.</p></div>
</div>
<h2>Trusted by data teams</h2>
<div class="panel">
  <p class="muted" style="font-size:16px">“Nimbus replaced three spreadsheets and a cron job. Our quarterly
  board deck now builds itself.”</p>
  <p class="mono" style="color:var(--brand)">— Dana R., Head of Analytics</p>
</div>
""" + foot()


def page_about():
    return head('Product', 'about') + """
<section class="hero">
  <div class="eyebrow">Product</div>
  <h1>Reporting that runs itself.</h1>
  <p>Connect a data source, pick a template, choose a schedule. Nimbus handles the querying,
     rendering and delivery — so your team stops copy-pasting into slides.</p>
</section>
<h2>How it works</h2>
<div class="grid">
  <div class="card"><h3>1 · Connect</h3><p>Securely link your warehouse or app database with read-only credentials.</p></div>
  <div class="card"><h3>2 · Model</h3><p>Define metrics once; reuse them across every report and dashboard.</p></div>
  <div class="card"><h3>3 · Schedule</h3><p>Set a cadence and recipients. Reports arrive as PDF or CSV, on time.</p></div>
</div>
<div class="panel">
  <p class="muted">Built for analysts, loved by execs. Nimbus is GDPR-ready and hosted in the EU &amp; US.</p>
</div>
""" + foot()


def page_blog():
    return head('Blog', 'blog') + """
<section class="hero"><div class="eyebrow">Blog</div><h1>News &amp; product updates</h1>
<p>What we're building, how teams use Nimbus, and lessons from the data trenches.</p></section>
<article class="panel">
  <div class="muted mono" style="font-size:12px">2024-07-02 · Product</div>
  <h3 style="margin:.3em 0">Introducing scheduled quarterly board decks</h3>
  <p class="muted">You can now assemble a full board-ready deck from your saved reports and have it delivered
    the morning of your meeting. No more copy-pasting charts the night before.</p>
</article>
<article class="panel">
  <div class="muted mono" style="font-size:12px">2024-06-18 · Engineering</div>
  <h3 style="margin:.3em 0">How we cut median query time to 42ms</h3>
  <p class="muted">A deep dive into our materialized-view cache, adaptive indexing and why we moved
    hot aggregates off the primary replica.</p>
</article>
<article class="panel">
  <div class="muted mono" style="font-size:12px">2024-05-30 · Customers</div>
  <h3 style="margin:.3em 0">How Acme Analytics ships weekly investor updates</h3>
  <p class="muted">A look at the workflow one of our teams uses to turn raw Postgres tables into a
    polished investor email every Friday at 9am.</p>
</article>
<article class="panel">
  <div class="muted mono" style="font-size:12px">2024-05-09 · Security</div>
  <h3 style="margin:.3em 0">Read-only by default: how we connect to your warehouse</h3>
  <p class="muted">Why every Nimbus connector uses least-privilege, read-only credentials — and how
    IP allow-listing and SSH tunnels keep your data yours.</p>
</article>
<p class="muted" style="font-size:13px">Want these in your inbox? <a href="/contact.php">Subscribe to the newsletter.</a></p>
""" + foot()


def page_help():
    return head('Help Center', 'help') + """
<section class="hero"><div class="eyebrow">Support</div><h1>Help Center</h1>
<p>Browse guides by topic, or <a href="/search.php">search the knowledge base</a>.</p></section>
<h2>Getting started</h2>
<div class="grid">
  <div class="card"><h3 style="font-size:16px">Create your first workspace</h3><p>Sign up, name your workspace and invite your team. Each workspace keeps its data, reports and members separate.</p></div>
  <div class="card"><h3 style="font-size:16px">Connect a data source</h3><p>Add Postgres, MySQL, Snowflake, BigQuery or a CSV. We only ever request read-only access.</p></div>
  <div class="card"><h3 style="font-size:16px">Build your first report</h3><p>Pick a template, drag in metrics, and preview. Save it to reuse or schedule.</p></div>
</div>
<h2>Reports &amp; scheduling</h2>
<div class="grid">
  <div class="card"><h3 style="font-size:16px">Scheduling automated reports</h3><p>Choose a cadence (daily/weekly/quarterly) and recipients. Delivery as PDF or CSV.</p></div>
  <div class="card"><h3 style="font-size:16px">Exporting to CSV &amp; Sheets</h3><p>Download a raw CSV, or push a live export to Google Sheets.</p></div>
  <div class="card"><h3 style="font-size:16px">Report retention</h3><p>Generated reports are retained per your plan's data-retention policy; older ones are archived automatically.</p></div>
</div>
<h2>Security &amp; account</h2>
<div class="grid">
  <div class="card"><h3 style="font-size:16px">Roles &amp; SSO</h3><p>Assign admin/editor/viewer roles and enable SAML single sign-on on Team and Enterprise plans.</p></div>
  <div class="card"><h3 style="font-size:16px">Audit logs</h3><p>Every export, share and permission change is logged for 90 days.</p></div>
  <div class="card"><h3 style="font-size:16px">Billing &amp; invoices</h3><p>Manage your plan and download past invoices from <a href="/login.php">your account</a>.</p></div>
</div>
<div class="panel" style="margin-top:24px"><p class="muted">Can't find an answer? <a href="/contact.php">Contact support</a> — we reply within one business day.</p></div>
""" + foot()


def page_pricing():
    return head('Pricing', 'pricing') + """
<section class="hero"><div class="eyebrow">Pricing</div><h1>Simple, per-workspace plans.</h1>
<p>Start free, upgrade when your team grows. No per-seat surprises.</p></section>
<div class="grid">
  <div class="card"><span class="pill">Starter</span><h3 style="font-size:30px">$0</h3>
    <p>1 workspace · 5 scheduled reports · community support.</p></div>
  <div class="card"><span class="pill">Team</span><h3 style="font-size:30px">$49<span style="font-size:15px" class="muted">/mo</span></h3>
    <p>10 workspaces · unlimited reports · SSO · priority support.</p></div>
  <div class="card"><span class="pill">Enterprise</span><h3 style="font-size:30px">Custom</h3>
    <p>SAML, audit logs, on-prem connectors, dedicated success manager.</p></div>
</div>
<div class="panel"><p class="muted">All plans include SOC 2 Type II, encryption at rest, and a 30-day money-back guarantee.</p></div>
""" + foot()


def page_login(err=False):
    note = '<div class="note">Invalid email or password. (Demo tenant sign-in is disabled.)</div>' if err else ''
    return head('Sign in', '') + """
<section class="hero" style="text-align:center"><div class="eyebrow">Account</div><h1>Sign in to Nimbus</h1></section>
<div class="panel" style="max-width:420px;margin:0 auto">
  """ + note + """
  <form method="post">
    <label>Email</label><input type="email" name="email" placeholder="you@company.com" required>
    <label>Password</label><input type="password" name="password" placeholder="••••••••" required>
    <div style="margin-top:16px"><button class="btn blue" type="submit" style="width:100%">Sign in</button></div>
  </form>
  <p class="muted" style="text-align:center;margin-top:14px;font-size:13px">SSO users: use your company portal.</p>
</div>
""" + foot()


def page_contact(sent=False):
    if sent:
        body = ('<div class="note" style="border-color:var(--brand);background:#0a2a20;color:#9ff0d3">'
                'Thanks — your message has been queued. We\'ll be in touch.</div>')
    else:
        body = """<form method="post">
    <label>Work email</label><input type="email" name="email" placeholder="you@company.com" required>
    <label>How can we help?</label><input type="text" name="msg" placeholder="I'd like a demo of scheduled reports">
    <div style="margin-top:16px"><button class="btn" type="submit">Send message</button></div>
  </form>"""
    return head('Contact', 'contact') + """
<section class="hero"><div class="eyebrow">Contact</div><h1>Talk to the team.</h1>
<p>Questions about a plan, a demo, or a security review? Send a note and we'll reply within one business day.</p></section>
<div class="panel" style="max-width:560px">
  """ + body + """
</div>
<p class="muted">Or email <span class="mono">hello@nimbus-reports.example</span> · SOC/security: <span class="mono">security@nimbus-reports.example</span></p>
""" + foot()


# ---- Help search (Reflected XSS + jim WAF) ----
ARTICLES = [
    ['Getting started with Nimbus Reports', 'Basics', 'Create your first workspace, connect a data source and generate a report in under five minutes.'],
    ['Scheduling automated reports', 'Reports', 'Send daily, weekly or quarterly PDF/CSV bundles to your team automatically.'],
    ['Connecting Postgres & Snowflake', 'Integrations', 'Read-only credentials, SSH tunnels and IP allow-listing for your warehouse.'],
    ['Sharing dashboards with a public link', 'Dashboards', 'Publish a read-only link so stakeholders can explore the numbers.'],
    ['Managing users, roles & SSO', 'Security', 'Invite teammates, assign roles and enable SAML single sign-on.'],
    ['Exporting to CSV and Google Sheets', 'Reports', 'Push any report to a spreadsheet or download a raw CSV export.'],
    ['Billing, plans and invoices', 'Account', 'Change your plan, update payment details and download past invoices.'],
    ['Troubleshooting slow queries', 'Performance', 'Indexing tips and query caching to keep dashboards snappy.'],
]
WAF_TOKENS = ['<script', '</script', 'onerror', 'javascript:', 'eval(', '<iframe', 'fromcharcode']


def waf_strip(s):
    """PHP str_ireplace(denylist, '', s) ekvivalenti — jim (banner yo'q), to'liq emas."""
    for t in WAF_TOKENS:
        s = re.sub(re.escape(t), '', s, flags=re.IGNORECASE)
    return s


def article_card(a):
    return ('<div class="card"><span class="pill">' + esc(a[1]) + '</span>'
            '<h3 style="margin-top:8px;font-size:16px">' + esc(a[0]) + '</h3>'
            '<p>' + esc(a[2]) + '</p></div>')


def page_search(q):
    reflect = waf_strip(q) if q != '' else q
    out = head('Help Center', '')
    out += ('<section class="hero"><div class="eyebrow">Support</div><h1>Help Center</h1>'
            '<p>Guides, answers and best practices for getting the most out of Nimbus Reports.</p></section>')
    out += ('<div class="panel" style="max-width:640px"><form method="get">'
            '<div style="display:flex;gap:10px">'
            '<input type="text" name="q" value="' + esc(q) + '" placeholder="Search the knowledge base…" autofocus>'
            '<button class="btn" type="submit">Search</button></div></form></div>')
    if q == '':
        out += '<h2>Popular articles</h2><div class="grid">'
        out += ''.join(article_card(a) for a in ARTICLES[:6])
        out += '</div>'
    else:
        # query reflected below (UNescaped — reflected XSS)
        out += '<h2>Results for “' + reflect + '”</h2>'
        ql = q.strip().lower()
        hits = [a for a in ARTICLES if ql in (a[0] + ' ' + a[2]).lower()]
        if hits:
            out += '<div class="grid">' + ''.join(article_card(a) for a in hits) + '</div>'
        else:
            out += ('<div class="panel"><p class="muted">No articles matched your search. Browse '
                    '<a href="/help.php">all help topics</a> or <a href="/contact.php">contact support</a>.</p></div>')
    return out + foot()


# ---- My Reports (IDOR) ----
def page_download():
    return head('My Reports', 'reports') + """
<section class="hero"><div class="eyebrow">Workspace · acme-analytics</div>
<h1>Monthly report</h1>
<p>Your latest generated report. Download the full copy below — reports are numbered
   sequentially as they're issued.</p></section>
<div class="panel">
  <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;align-items:baseline">
    <h2 style="margin:0">Nimbus Reports — Monthly Summary</h2>
    <span class="muted mono" style="font-size:13px">acme-analytics · 2024 · delivered</span>
  </div>
  <p class="muted">Auto-generated performance summary for your workspace, reconciled against the
    production replica.</p>
  <table>
    <tr><th>Metric</th><th>This period</th><th>Prev.</th><th>Δ</th></tr>
    <tr><td>Active users</td><td class="mono">4,213</td><td class="mono muted">3,902</td><td style="color:var(--brand)">+8.0%</td></tr>
    <tr><td>Revenue</td><td class="mono">$128,400</td><td class="mono muted">$119,750</td><td style="color:var(--brand)">+7.2%</td></tr>
    <tr><td>Reports generated</td><td class="mono">1,204</td><td class="mono muted">1,088</td><td style="color:var(--brand)">+10.7%</td></tr>
    <tr><td>Median query time</td><td class="mono">42 ms</td><td class="mono muted">51 ms</td><td style="color:var(--brand)">−17.6%</td></tr>
    <tr><td>Uptime (30d)</td><td class="mono">98.9%</td><td class="mono muted">98.6%</td><td style="color:var(--brand)">+0.3%</td></tr>
  </table>
  <p class="muted" style="font-size:13.5px;margin-top:16px">Figures are indicative and identical across
    the monthly export bundle. Full breakdown is in the downloadable copy.</p>
  <form method="post" onsubmit="setTimeout(nextRep, 250)" style="margin-top:8px">
    <input type="hidden" name="report_id" id="rid" value="1">
    <button class="btn" type="submit">⬇ Download report #<span id="rnum">1</span></button>
    <span class="muted" style="font-size:13px;margin-left:8px">har yuklashda raqam ketma-ket oshadi</span>
  </form>
</div>
<script>
function nextRep(){
  var e = document.getElementById('rid');
  var n = parseInt(e.value || '1', 10) + 1;
  if (n > 12) n = 1;                    // issued reports 1..12
  e.value = n;
  document.getElementById('rnum').textContent = n;
}
</script>
""" + foot()


# ---- Import dashboard (SSRF) ----
def page_fetch(err=None, out=None, url=''):
    body = head('Import', '')
    body += ('<section class="hero"><div class="eyebrow">Dashboards</div><h1>Import a dashboard</h1>'
             '<p>Bring an existing report into your workspace from a public link — CSV, JSON or a shared Nimbus URL.</p></section>')
    body += ('<div class="panel" style="max-width:660px"><form method="get">'
             '<label>Dashboard URL</label><div style="display:flex;gap:10px">'
             '<input type="text" name="url" value="' + esc(url) + '" placeholder="https://sheets.example.com/export/q3.csv">'
             '<button class="btn" type="submit">Import</button></div></form>'
             '<p class="muted" style="font-size:13px;margin-top:12px">Supported: Google Sheets export links, public CSV/JSON, and shared Nimbus dashboards.</p></div>')
    if err is not None:
        body += '<div class="note" style="max-width:660px">' + esc(err) + '</div>'
    elif out is not None:
        body += ('<h2>Import preview</h2><div class="panel">'
                 '<pre class="mono" style="white-space:pre-wrap;margin:0;color:#cfe0ff">' + esc(out) + '</pre></div>'
                 '<p class="muted" style="font-size:13px">Looks right? Confirm to add this dashboard to <b>acme-analytics</b>.</p>')
    else:
        body += ('<h2>Recent imports</h2><div class="panel"><table>'
                 '<tr><th>Source</th><th>Imported</th><th>Rows</th></tr>'
                 '<tr><td class="mono">sheets · q2-revenue.csv</td><td class="muted">2024-06-30</td><td class="muted">1,204</td></tr>'
                 '<tr><td class="mono">nimbus · marketing-funnel</td><td class="muted">2024-06-14</td><td class="muted">862</td></tr>'
                 '<tr><td class="mono">json · api-usage.json</td><td class="muted">2024-05-28</td><td class="muted">3,391</td></tr>'
                 '</table></div>')
    return body + foot()


def page_404():
    return head('Not found', '') + (
        '<section class="hero"><div class="eyebrow">404</div><h1>Page not found</h1>'
        '<p>The page you’re looking for doesn’t exist. Head back to the '
        '<a href="/">overview</a>.</p></section>') + foot()


# ---- storage-backup ochiq katalog ro'yxati (Apache Options +Indexes ko'rinishi) ----
def page_dir_listing():
    return (
        '<!doctype html><html><head><title>Index of /storage-backup</title>'
        '<style>body{font-family:monospace;background:#fff;color:#000;padding:14px}'
        'a{color:#00c}h1{font-size:20px}</style></head><body>'
        '<h1>Index of /storage-backup</h1><hr><pre>'
        '<a href="/">../</a>\n'
        '<a href="/storage-backup/' + BACKUP_NAME + '">' + BACKUP_NAME + '</a>'
        '                 2024-01-15 03:12  ' + str(len(BACKUP_SQL)) + '\n'
        '</pre><hr></body></html>'
    )


# ---------------------------------------------------------------------------
#  SSRF yordamchi funksiyalari
# ---------------------------------------------------------------------------
SSRF_DENY = ['localhost', '127.0.0.1', '0.0.0.0', '[::1]', '::1', '127.1', '0177.', '@']


def long2ip(n):
    """PHP long2ip — 32-bit butun sonni A.B.C.D ga aylantiradi (2130706433 -> 127.0.0.1)."""
    n &= 0xFFFFFFFF
    return "%d.%d.%d.%d" % ((n >> 24) & 255, (n >> 16) & 255, (n >> 8) & 255, n & 255)


def is_loopback(host):
    return host == '::1' or host == '0.0.0.0' or host.startswith('127.')


def ssrf_import(raw_url):
    """/fetch.php mantiqi. (err, out) qaytaradi.
    Denylist localhost'ni SATR bo'yicha bloklaydi; o'nlik (decimal) IP undan o'tadi
    va loopback'ga yechiladi. Xavfsizlik: faqat loopback'ga so'rov yuboriladi —
    tashqi xostlarga CHIQMAYDI (server SSRF-proksi sifatida suiste'mol qilinmasin)."""
    generic = "We couldn't reach that link. Please check the URL and try again."
    lc = raw_url.lower()
    for d in SSRF_DENY:
        if d in lc:
            return (generic, None)
    p = urllib.parse.urlparse(raw_url)
    if p.scheme != 'http':
        return ("Only public http:// links can be imported right now.", None)
    host = p.hostname or ''
    if host.isdigit():
        host = long2ip(int(host))          # decimal IP shu yerda normallashadi
    path = p.path or '/'
    if p.query:
        path += '?' + p.query
    if not is_loopback(host):
        # Tashqi xostlar: haqiqiy so'rov YUBORILMAYDI (izolyatsiya/xavfsizlik) — umumiy xato.
        return (generic, None)
    # Loopback: serverning O'ZIGA haqiqiy HTTP so'rovi (internal.php REMOTE_ADDR=127.0.0.1 ko'radi)
    target = "http://127.0.0.1:%d%s" % (SERVE_PORT, path)
    try:
        req = urllib.request.Request(target, headers={'User-Agent': 'NimbusImport/1.0'})
        with urllib.request.urlopen(req, timeout=4) as r:
            data = r.read(65536)
        return (None, data.decode('utf-8', 'replace'))
    except urllib.error.HTTPError as e:
        try:
            data = e.read(65536)
            return (None, data.decode('utf-8', 'replace'))
        except Exception:
            return (generic, None)
    except Exception:
        return (generic, None)


# ---------------------------------------------------------------------------
#  HTTP handler
# ---------------------------------------------------------------------------
class Handler(BaseHTTPRequestHandler):
    server_version = "Apache/2.4.57"       # recon'da PHP/Apache saytdek ko'rinsin
    sys_version = "(Debian)"
    protocol_version = "HTTP/1.1"

    # ---- javob yordamchilari ----
    def _send(self, code, body, ctype="text/html; charset=utf-8", extra=None):
        if isinstance(body, str):
            body = body.encode('utf-8')
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

    # ---- marshrutlash ----
    def do_GET(self):
        u = urllib.parse.urlparse(self.path)
        path = u.path
        qs = urllib.parse.parse_qs(u.query, keep_blank_values=True)

        if path in ('/', '/index.php'):
            return self._send(200, page_index())
        if path == '/about.php':
            return self._send(200, page_about())
        if path == '/blog.php':
            return self._send(200, page_blog())
        if path == '/help.php':
            return self._send(200, page_help())
        if path == '/pricing.php':
            return self._send(200, page_pricing())
        if path == '/login.php':
            return self._send(200, page_login(False))
        if path == '/contact.php':
            return self._send(200, page_contact(False))
        if path == '/download.php':
            return self._send(200, page_download())
        if path == '/robots.txt':
            return self._text(200, ROBOTS_TXT)
        if path == '/assets/style.css':
            return self._send(200, STYLE_CSS, "text/css; charset=utf-8")

        if path == '/search.php':
            q = qs.get('q', [''])[0]
            return self._send(200, page_search(q))

        if path == '/fetch.php':
            url = qs.get('url', [''])[0].strip()
            if url == '':
                return self._send(200, page_fetch())
            err, out = ssrf_import(url)
            return self._send(200, page_fetch(err=err, out=out, url=url))

        if path == '/flag.php':
            return self._flag()

        if path == '/internal.php':
            return self._internal()

        if path in ('/storage-backup', '/storage-backup/'):
            return self._send(200, page_dir_listing())
        if path == '/storage-backup/' + BACKUP_NAME:
            return self._text(200, BACKUP_SQL)

        return self._send(404, page_404())

    def do_HEAD(self):
        self.do_GET()

    def do_POST(self):
        u = urllib.parse.urlparse(self.path)
        path = u.path
        form = self._read_form()

        if path == '/download.php':
            # IDOR: report_id ishonchli qabul qilinadi — (int) cast, diapazon tekshirilmaydi (0 ishlaydi)
            rid = php_intval(form.get('report_id', [''])[0])
            body = report_body(rid)
            if body is not None:
                return self._text(200, body, extra={
                    "Content-Disposition": 'attachment; filename="report-%d.txt"' % rid})
            return self._text(404, "Report #%d not found." % rid)

        if path == '/login.php':
            return self._send(200, page_login(err=True))
        if path == '/contact.php':
            return self._send(200, page_contact(sent=True))

        return self._send(404, page_404())

    # ---- zaif endpointlar ----
    def _flag(self):
        # /flag.php — XSS flagini FAQAT sayt ICHIDAN yuborilgan so'rovga beradi.
        sfs = self.headers.get('Sec-Fetch-Site', '')
        ref = self.headers.get('Referer', '')
        host = self.headers.get('Host', '')
        from_site = (sfs in ('same-origin', 'same-site')) or \
                    (host != '' and ref != '' and ('://' + host) in ref)
        if from_site:
            return self._text(200, FLAG_XSS, extra={"X-Content-Type-Options": "nosniff"})
        return self._text(403, "403 Forbidden", extra={"X-Content-Type-Options": "nosniff"})

    def _internal(self):
        # /internal.php — SSRF flagini FAQAT loopback (127.0.0.1) chaqiruvchiga beradi.
        ra = self.client_address[0] if self.client_address else ''
        if ra in ('127.0.0.1', '::1'):
            out = ("nimbus-internal status v1\n"
                   "cpu=12% mem=41% queue_depth=3 workers=8 build=3.4.1\n"
                   "db_replica_lag_ms=7\n"
                   "workspace_flag=" + FLAG_SSRF + "\n")
            return self._text(200, out)
        out = ("403 Forbidden — internal endpoint is restricted to localhost.\n"
               "your_ip=" + ra + "\n")
        return self._text(403, out)

    # ---- yordamchi ----
    def _read_form(self):
        try:
            n = int(self.headers.get('Content-Length', 0))
        except (TypeError, ValueError):
            n = 0
        raw = self.rfile.read(n).decode('utf-8', 'replace') if n > 0 else ''
        return urllib.parse.parse_qs(raw, keep_blank_values=True)

    def log_message(self, fmt, *args):
        sys.stderr.write("  %s - %s\n" % (self.client_address[0], fmt % args))


def php_intval(s):
    """PHP (int) cast — bosh qismidagi butun sonni oladi, aks holda 0 ('0'->0, 'abc'->0, '12x'->12)."""
    m = re.match(r'\s*([+-]?\d+)', str(s))
    return int(m.group(1)) if m else 0


# ---------------------------------------------------------------------------
#  Ishga tushirish
# ---------------------------------------------------------------------------
def lan_ips():
    ips = []
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('1.1.1.1', 80))
        ips.append(s.getsockname()[0])
        s.close()
    except Exception:
        pass
    try:
        for info in socket.getaddrinfo(socket.gethostname(), None, socket.AF_INET):
            ip = info[4][0]
            if not ip.startswith('127.') and not ip.startswith('169.254.') and ip not in ips:
                ips.append(ip)
    except Exception:
        pass
    return ips


def main():
    global SERVE_PORT
    ap = argparse.ArgumentParser(description="Nimbus Reports — standalone web CTF (pure Python).")
    ap.add_argument('--host', default='0.0.0.0', help="bind manzili (default 0.0.0.0 — LAN uchun)")
    ap.add_argument('--port', type=int, default=8085, help="port (default 8085)")
    args = ap.parse_args()

    httpd = ThreadingHTTPServer((args.host, args.port), Handler)
    httpd.daemon_threads = True
    SERVE_PORT = httpd.server_address[1]   # SSRF self-fetch shu portga boradi

    ips = lan_ips()
    line = "=" * 62
    print(line)
    print("  ☁️  Nimbus Reports — web CTF (MEDIUM)  ·  standalone Python")
    print(line)
    print("  Ishlamoqda:  http://%s:%d" % (args.host, SERVE_PORT))
    print("  Shu kompyuterda:        http://localhost:%d" % SERVE_PORT)
    for ip in ips:
        print("  Tarmoqdagi o'quvchilar: http://%s:%d" % (ip, SERVE_PORT))
    if not ips:
        print("  Tarmoq IP topilmadi — 'ip addr' bilan toping: http://<IP>:%d" % SERVE_PORT)
    print(line)
    print("  4 zaiflik: IDOR · info-disclosure · XSS(WAF) · SSRF")
    print("  Brauzer + Burp bilan buzing; path'larni gobuster/dirb topadi (-x php,txt).")
    print("  ⚠️  Ataylab zaif — faqat izolyatsiya qilingan lab tarmog'ida. Internetga ochmang.")
    if args.host != '0.0.0.0' and args.host not in ('::',):
        print("  Eslatma: tarmoqdan ulanish uchun --host 0.0.0.0 bo'lsin (hozir: %s)." % args.host)
    print("  Firewall LAN'ni bloklasa:  sudo ufw allow %d/tcp" % SERVE_PORT)
    print("  To'xtatish: Ctrl+C")
    print(line)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n  To'xtatildi.")
        httpd.shutdown()


if __name__ == '__main__':
    main()
