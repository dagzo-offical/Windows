#!/usr/bin/env python3
"""
Windows Academy — local dev server
Usage:
    python run.py            # default port 8080
    python run.py 3000       # custom port
    python run.py --port 9000
"""

import sys
import os
import argparse
import socket
import webbrowser
import threading
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

ACADEMY_NAME = "Windows Academy"
DEFAULT_PORT  = 8080


class AcademyHandler(SimpleHTTPRequestHandler):
    """Serves the static SPA with permissive CORS and correct MIME types."""

    # Extra MIME types (SimpleHTTPRequestHandler already knows the common ones)
    extra_types = {
        ".jsx":  "text/javascript",
        ".mjs":  "text/javascript",
        ".wasm": "application/wasm",
    }

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

    def guess_type(self, path):
        ext = Path(path).suffix.lower()
        if ext in self.extra_types:
            return self.extra_types[ext]
        return super().guess_type(path)

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def log_message(self, fmt, *args):
        # Quieter logs: skip 200/304 for assets, only show errors and page loads
        code = args[1] if len(args) > 1 else ""
        path = args[0].split()[1] if args else ""
        skip_exts = (".css", ".png", ".jpg", ".ico", ".woff", ".woff2", ".ttf")
        if code in ("200", "304") and any(path.endswith(e) for e in skip_exts):
            return
        super().log_message(fmt, *args)


def find_free_port(start: int) -> int:
    for port in range(start, start + 20):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(("127.0.0.1", port))
                return port
            except OSError:
                continue
    return start  # give up and let the OS error naturally


def open_browser(url: str, delay: float = 0.8):
    def _open():
        import time
        time.sleep(delay)
        try:
            webbrowser.open(url)
        except Exception:
            pass
    threading.Thread(target=_open, daemon=True).start()


def main():
    parser = argparse.ArgumentParser(description=f"Run {ACADEMY_NAME} locally")
    parser.add_argument("port", nargs="?", type=int, default=DEFAULT_PORT,
                        help=f"Port number (default: {DEFAULT_PORT})")
    parser.add_argument("--port", "-p", type=int, dest="port_flag",
                        help="Port number (alternative flag)")
    parser.add_argument("--no-browser", action="store_true",
                        help="Don't open the browser automatically")
    args = parser.parse_args()

    port = args.port_flag if args.port_flag else args.port
    port = find_free_port(port)

    # Serve from the directory that contains index.html
    root = Path(__file__).parent.resolve()
    os.chdir(root)

    if not (root / "index.html").exists():
        print(f"[ERROR] index.html not found in {root}")
        sys.exit(1)

    url = f"http://localhost:{port}"

    print()
    print(f"  ╔══════════════════════════════════════════╗")
    print(f"  ║   {ACADEMY_NAME}                    ║")
    print(f"  ╠══════════════════════════════════════════╣")
    print(f"  ║  Local:   {url:<31}║")
    print(f"  ║  Root:    {str(root)[:31]:<31}║")
    print(f"  ║  Press    Ctrl+C to stop                 ║")
    print(f"  ╚══════════════════════════════════════════╝")
    print()

    if not args.no_browser:
        open_browser(url)
        print(f"  → Browser will open at {url}")
        print()

    server = HTTPServer(("0.0.0.0", port), AcademyHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n  Server stopped. Goodbye!")
        server.server_close()


if __name__ == "__main__":
    main()
