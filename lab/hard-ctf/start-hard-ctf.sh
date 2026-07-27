#!/usr/bin/env bash
# ============================================================
#  Orbit Ops (HARD, zanjirli) CTF — mustaqil ishga tushirish
#  Docker/pip/internet KERAK EMAS. To'liq oflayn.
#  Ishlatish:   ./start-hard-ctf.sh            (0.0.0.0:8086)
#               ./start-hard-ctf.sh 9001       (boshqa port)
# ============================================================
set -e
cd "$(dirname "$0")"
PORT="${1:-8086}"

if ! command -v python3 >/dev/null 2>&1; then
  echo "❌ python3 topilmadi. O'rnating:  sudo apt install -y python3"
  exit 1
fi

# Portni bo'shatish — Burp (8080), platforma (8000), medium CTF (8085) ga TEGILMAYDI.
if command -v fuser >/dev/null 2>&1; then
  fuser -k "${PORT}/tcp" >/dev/null 2>&1 || true
  sleep 0.3
fi

echo "🚀 Orbit Ops (HARD) ishga tushmoqda (0.0.0.0:${PORT})..."
echo "   (To'xtatish: Ctrl+C)"
echo ""
exec python3 ctf_server.py --host 0.0.0.0 --port "$PORT"
