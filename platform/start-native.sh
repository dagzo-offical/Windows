#!/usr/bin/env bash
# ============================================================
#  CyberSecurity Platform — NATIVE ishga tushirish (TARMOQ uchun)
#
#  Nega? Docker'ning e'lon qilingan portlari (Docker Desktop / rootless Docker)
#  ko'pincha xostning HAQIQIY LAN interfeysiga chiqmaydi — shu sabab tarmoqdagi
#  foydalanuvchilar platformaga (:8000) ULANA OLMAYDI. Bu skript backend'ni
#  (server.js — sof Node, kutubxonasiz) va CTF nishonini (app.py — sof Python)
#  to'g'ridan-to'g'ri xostda 0.0.0.0 ga bog'lab ishga tushiradi → LAN'da ochiladi.
#  Onlayn ham, oflayn tarmoqda ham ishlaydi.
#
#  Ishlatish:   ./start-native.sh
#  Talab:       Node.js (backend uchun) + Python3 (CTF uchun). Docker IXTIYORIY
#               (bo'lsa — web-terminal va zaif mashinalar ham yoqiladi).
# ============================================================
set -e
cd "$(dirname "$0")"
REPO="$(cd .. && pwd)"
PORT="${PORT:-8000}"
CTF_PORT="${CTF_PORT:-8085}"

# 1) Node bormi?
if ! command -v node >/dev/null 2>&1; then
  echo "❌ Node.js topilmadi. O'rnating:"
  echo "     Ubuntu/Kali:  sudo apt update && sudo apt install -y nodejs"
  echo "     yoki:         https://nodejs.org (LTS)"
  exit 1
fi

# 2) Portlarni bo'shatish — Burp (8080) ga TEGILMAYDI. Eski Docker konteynerlarini olib tashlaymiz.
docker rm -f ejpt-backend ejpt-ctf-web >/dev/null 2>&1 || true
if command -v fuser >/dev/null 2>&1; then
  fuser -k "${PORT}/tcp"     >/dev/null 2>&1 || true
  fuser -k "${CTF_PORT}/tcp" >/dev/null 2>&1 || true
  sleep 0.3
fi

# 3) CTF nishoni (Nimbus Reports) — NATIVE, oflayn, LAN'da ochiladi
CTF_PID=""
if command -v python3 >/dev/null 2>&1 && [ -f "$REPO/lab/ctf-web/app.py" ]; then
  python3 "$REPO/lab/ctf-web/app.py" --host 0.0.0.0 --port "$CTF_PORT" \
    >/tmp/nimbus-ctf.log 2>&1 &
  CTF_PID=$!
  echo "🚩 CTF nishoni ishga tushdi (native :$CTF_PORT) — log: /tmp/nimbus-ctf.log"
else
  echo "ℹ️  python3 topilmadi — CTF nishoni (app.py) o'tkazib yuborildi."
fi
cleanup() { [ -n "$CTF_PID" ] && kill "$CTF_PID" >/dev/null 2>&1 || true; }
trap cleanup EXIT INT TERM

# 4) Docker lab (zaif mashinalar + web-terminal) — IXTIYORIY. backend va ctf-web'siz.
if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
  echo "🐳 Docker lab (mashinalar + web-terminal) ko'tarilmoqda (backend NATIVE ishlaydi)..."
  SVC=$(docker compose config --services 2>/dev/null | grep -vxE 'backend|ctf-web' | tr '\n' ' ')
  if [ -n "$SVC" ]; then docker compose up -d --build $SVC || echo "⚠️  ba'zi lab servislari ko'tarilmadi (davom etamiz)."; fi
else
  echo "ℹ️  Docker yo'q/ishlamayapti — portal va CTF baribir ishlaydi (web-terminal va mashinalar o'chiq)."
fi

# 5) LAN IP (tarmoqdagilar shu manzilga ulanadi)
LAN=$(ip route get 1.1.1.1 2>/dev/null | grep -oE 'src [0-9.]+' | awk '{print $2}' | head -1)
if [ -z "$LAN" ]; then
  LAN=$(hostname -I 2>/dev/null | tr ' ' '\n' \
    | grep -vE '^(127\.|169\.254\.|172\.1[6-9]\.|172\.2[0-9]\.|172\.3[01]\.|10\.10\.10\.|10\.10\.20\.)' | head -1)
fi
[ -z "$LAN" ] && LAN=$(ipconfig getifaddr en0 2>/dev/null || true)

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  ✅ NATIVE — LAN'da ochiladi (Docker publish chetlab o'tildi)"
echo "════════════════════════════════════════════════════════════"
echo "   • Portal (shu kompyuter):   http://localhost:${PORT}"
[ -n "$LAN" ] && echo "   • Portal (TARMOQDAGILAR):   http://${LAN}:${PORT}" \
              || echo "   • Portal (tarmoqda):        http://<IP>:${PORT}   (IP: 'ip addr')"
echo "   • CTF nishoni (Burp bilan): http://${LAN:-localhost}:${CTF_PORT}"
echo "   • Ro'yxatdan o'tish:        http://${LAN:-localhost}:${PORT}/register  (1-chi = admin)"
echo "   Tarmoqdan ulanmasa — firewall:"
echo "     sudo ufw allow ${PORT}/tcp && sudo ufw allow ${CTF_PORT}/tcp"
echo "   To'xtatish: Ctrl+C"
echo "════════════════════════════════════════════════════════════"
echo ""

# 6) Platforma backend — NATIVE (0.0.0.0:PORT). REPO_ROOT/DATA_DIR standart bo'yicha
#    to'g'ri (repo ildizi / platform/data). TTYD_HOST=127.0.0.1 — publish qilingan ttyd.
exec env PORT="$PORT" TTYD_HOST=127.0.0.1 TTYD_PORT=7681 node server.js
