#!/usr/bin/env python3
"""
Windows Academy — local dev server
Usage:
    python run.py            # default port 8080
    python run.py 3000       # custom port
    python run.py --port 9000
    python run.py --rebuild  # rebuild bundle.js then serve
"""

import sys
import os
import subprocess
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
        try:
            # log_request passes (requestline, code, size); log_error passes (code, msg)
            first = args[0] if args else ""
            path = first.split()[1] if isinstance(first, str) and " " in first else ""
            code = str(args[1]) if len(args) > 1 else ""
            skip_exts = (".css", ".png", ".jpg", ".ico", ".woff", ".woff2", ".ttf")
            if code in ("200", "304") and any(path.endswith(e) for e in skip_exts):
                return
        except Exception:
            pass
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


def rebuild_bundle(root: Path):
    """Pre-transpile all JSX → lib/bundle.js using Node.js + Babel."""
    script = r"""
const { transformSync } = require('./node_modules/@babel/core');
const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();
const files = [
  'components/icons.jsx','components/shared.jsx',
  'components/mermaid-diagram.jsx','components/windows-arch.jsx',
  'components/ad-topology.jsx',
  'screens/landing.jsx','screens/dashboard.jsx','screens/section.jsx',
  'screens/lesson.jsx','screens/quiz.jsx','screens/cooldown.jsx',
  'screens/final-exam.jsx',
  'tweaks-panel.jsx','app.jsx',
];
let bundle = '"use strict";\n// Windows Academy — pre-bundled\n';
for (const file of files) {
  const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const res = transformSync(src, {
    filename: file,
    presets: [['./node_modules/@babel/preset-react', { runtime: 'classic' }]],
    sourceMaps: false,
  });
  bundle += `\n// --- ${file} ---\n` + res.code + '\n';
}
fs.mkdirSync(path.join(ROOT, 'lib'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'lib/bundle.js'), bundle);
console.log('Bundle: ' + (bundle.length >> 10) + ' KB');
"""
    bundle_exists = (root / "lib" / "bundle.js").exists()

    def _fallback(reason: str):
        # A pre-built bundle.js ships with the repo, so a failed rebuild is
        # non-fatal — serve the existing one and explain how to enable rebuilds.
        print(reason)
        if bundle_exists:
            print("  -> serving the pre-built lib/bundle.js instead.")
        else:
            print("  [ERROR] lib/bundle.js is missing and cannot be built.")
            print("          Run: npm install   (installs @babel/* for --rebuild)")
            sys.exit(1)

    print("  Building bundle.js ...", end=" ", flush=True)
    try:
        result = subprocess.run(
            ["node", "-e", script],
            cwd=str(root), capture_output=True, text=True, timeout=60,
        )
        if result.returncode == 0:
            print("OK")
        else:
            err = (result.stderr or "").strip()
            if "Cannot find module" in err:
                _fallback("SKIPPED (run `npm install` first)")
            else:
                print("FAILED")
                print(err[:800])
                _fallback("")
    except FileNotFoundError:
        _fallback("SKIPPED (Node.js not found)")
    except subprocess.TimeoutExpired:
        _fallback("TIMEOUT")


def main():
    parser = argparse.ArgumentParser(description=f"Run {ACADEMY_NAME} locally")
    parser.add_argument("port", nargs="?", type=int, default=DEFAULT_PORT,
                        help=f"Port number (default: {DEFAULT_PORT})")
    parser.add_argument("--port", "-p", type=int, dest="port_flag",
                        help="Port number (alternative flag)")
    parser.add_argument("--no-browser", action="store_true",
                        help="Don't open the browser automatically")
    parser.add_argument("--rebuild", action="store_true",
                        help="Rebuild lib/bundle.js before serving")
    args = parser.parse_args()

    port = args.port_flag if args.port_flag else args.port
    port = find_free_port(port)

    # Serve from the directory that contains index.html
    root = Path(__file__).parent.resolve()
    os.chdir(root)

    if not (root / "index.html").exists():
        print(f"[ERROR] index.html not found in {root}")
        sys.exit(1)

    if args.rebuild:
        rebuild_bundle(root)

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
