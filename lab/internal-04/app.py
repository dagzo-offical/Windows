#!/usr/bin/env python3
# Internal Admin — "Ping Tool". DIQQAT: ataylab zaif (command injection).
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs
import subprocess

PAGE = b"""<!doctype html><html><head><meta charset="utf-8"><title>Internal Admin - Vault</title>
<style>body{font-family:system-ui,sans-serif;background:#0b1120;color:#e5e7eb;padding:40px}
h2{color:#f97316}input{padding:8px;border-radius:6px;border:1px solid #374151;background:#111827;color:#e5e7eb}
button{padding:8px 14px;border:0;border-radius:6px;background:#f97316;color:#111;font-weight:600;cursor:pointer}
code{color:#93c5fd}</style></head><body>
<h2>ACME Internal Vault &mdash; Ping Tool</h2>
<p>Faqat ichki tarmoqdan. Xost holatini tekshiring:</p>
<form action="/ping" method="get"><input name="host" value="127.0.0.1"> <button>Ping</button></form>
<p style="color:#6b7280;font-size:12px">Misol: <code>/ping?host=127.0.0.1</code></p>
</body></html>"""

class H(BaseHTTPRequestHandler):
    def log_message(self, *a):
        return
    def do_GET(self):
        u = urlparse(self.path)
        if u.path == '/ping':
            host = parse_qs(u.query).get('host', [''])[0]
            # ZAIF: kiritma shell buyrug'iga to'g'ridan-to'g'ri qo'shiladi (command injection)
            try:
                res = subprocess.run('ping -c 1 -W 2 ' + host, shell=True,
                                     capture_output=True, timeout=10)
                body = res.stdout + res.stderr
            except Exception as e:
                body = str(e).encode()
            self.send_response(200)
            self.send_header('Content-Type', 'text/plain; charset=utf-8')
            self.end_headers()
            self.wfile.write(body)
        else:
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.end_headers()
            self.wfile.write(PAGE)

if __name__ == '__main__':
    HTTPServer(('0.0.0.0', 8080), H).serve_forever()
