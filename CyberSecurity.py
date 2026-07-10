#!/usr/bin/env python3
"""
CyberSecurity Platform — main runner
Serves the whole platform (hub + all modules) from one origin, so AI keys
and progress are shared across Windows, Kali, Network and Web-Pentest.

Usage:
    python CyberSecurity.py            # port 8080
    python CyberSecurity.py 3000       # custom port
    python CyberSecurity.py --port 9000
    python CyberSecurity.py --no-browser
"""

import sys, os, socket, webbrowser, threading, argparse
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

NAME = "CyberSecurity Platform"
PORT = 8080
ROOT = Path(__file__).parent.resolve()
RESET = "\033[0m"
BOLD  = "\033[1m"
CYAN  = "\033[96m"
BLUE  = "\033[94m"
MAG   = "\033[95m"
RED   = "\033[91m"
GRN   = "\033[92m"

MODULES = [
    (BLUE, "Windows",      "windows/"),
    (MAG,  "Kali Linux",   "kali/"),
    (CYAN, "Network",      "network/"),
    (RED,  "Web-Pentest",  "web-pentest/"),
]


class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

    def guess_type(self, path):
        if str(path).endswith(".jsx"):
            return "text/javascript"
        return super().guess_type(path)

    def log_message(self, fmt, *args):
        try:
            path = args[0].split()[1] if args and " " in str(args[0]) else ""
            code = str(args[1]) if len(args) > 1 else ""
            if code in ("200", "304") and any(path.endswith(e) for e in
                    (".css", ".png", ".jpg", ".ico", ".woff2", ".js")):
                return
        except Exception:
            pass
        super().log_message(fmt, *args)

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()


def free_port(start):
    for p in range(start, start + 20):
        with socket.socket() as s:
            try:
                s.bind(("127.0.0.1", p))
                return p
            except OSError:
                continue
    return start


def open_browser(url, delay=0.9):
    def _go():
        import time
        time.sleep(delay)
        try:
            webbrowser.open(url)
        except Exception:
            pass
    threading.Thread(target=_go, daemon=True).start()


def main():
    ap = argparse.ArgumentParser(description=f"Run {NAME}")
    ap.add_argument("port", nargs="?", type=int, default=PORT)
    ap.add_argument("--port", "-p", type=int, dest="pflag")
    ap.add_argument("--no-browser", action="store_true")
    args = ap.parse_args()
    port = free_port(args.pflag or args.port)
    os.chdir(ROOT)

    if not (ROOT / "index.html").exists():
        print(f"[ERROR] index.html (hub) not found in {ROOT}")
        sys.exit(1)

    url = f"http://localhost:{port}"
    w = 50
    print()
    print(f"  {BOLD}{BLUE}{'═' * w}{RESET}")
    print(f"  {BOLD}{BLUE}  {NAME:^{w-4}}  {RESET}")
    print(f"  {BOLD}{BLUE}{'═' * w}{RESET}")
    print(f"    {BOLD}Hub{RESET}      :  {BOLD}{url}{RESET}")
    print(f"    Modules  :")
    for color, label, path in MODULES:
        print(f"       {color}●{RESET} {label:<14} {url}/{path}")
    print(f"    Root     :  {ROOT}")
    print(f"    Stop     :  Ctrl+C")
    print(f"  {BLUE}{'─' * w}{RESET}")
    print()

    if not args.no_browser:
        open_browser(url)

    server = HTTPServer(("0.0.0.0", port), Handler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n  Stopped. Goodbye!")
        server.server_close()


if __name__ == "__main__":
    main()
