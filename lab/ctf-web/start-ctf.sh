#!/usr/bin/env bash
# ============================================================
#  Nimbus Reports CTF — mustaqil (standalone) ishga tushirish
#  Docker KERAK EMAS. Tarmoqdagi o'quvchilar to'g'ridan-to'g'ri ulanadi.
#  Ishlatish:   ./start-ctf.sh            (0.0.0.0:8085)
#               ./start-ctf.sh 9000       (boshqa port)
# ============================================================
set -e
cd "$(dirname "$0")"
PORT="${1:-8085}"

# python3 bormi?
if ! command -v python3 >/dev/null 2>&1; then
  echo "❌ python3 topilmadi. O'rnating:  sudo apt install -y python3"
  exit 1
fi

# 8085 ni bo'shatish — eski Docker ctf-web konteynerini olib tashlaymiz (agar bo'lsa).
# DIQQAT: Burp (8080) va platformaga (8000) TEGILMAYDI.
docker rm -f ejpt-ctf-web >/dev/null 2>&1 || true
if command -v fuser >/dev/null 2>&1; then
  fuser -k "${PORT}/tcp" >/dev/null 2>&1 || true
  sleep 0.3
fi

echo "🚀 Nimbus Reports CTF ishga tushmoqda (0.0.0.0:${PORT})..."
echo "   (To'xtatish: Ctrl+C)"
echo ""
exec python3 app.py --host 0.0.0.0 --port "$PORT"
