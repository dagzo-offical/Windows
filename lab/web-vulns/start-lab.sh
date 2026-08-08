#!/usr/bin/env bash
# ============================================================
#  Web Vulns Lab — mustaqil ishga tushirish (oflayn, Docker'siz)
#  Ishlatish:   ./start-lab.sh            (0.0.0.0:8087)
#               ./start-lab.sh 9000       (boshqa port)
# ============================================================
set -e
cd "$(dirname "$0")"
PORT="${1:-8087}"
if ! command -v python3 >/dev/null 2>&1; then
  echo "❌ python3 topilmadi. O'rnating:  sudo apt install -y python3"; exit 1
fi
if command -v fuser >/dev/null 2>&1; then fuser -k "${PORT}/tcp" >/dev/null 2>&1 || true; sleep 0.3; fi
echo "🧪 Web Vulns Lab ishga tushmoqda (0.0.0.0:${PORT})...  (To'xtatish: Ctrl+C)"
echo ""
exec python3 app.py --host 0.0.0.0 --port "$PORT"
