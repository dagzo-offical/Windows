#!/usr/bin/env bash
# ============================================================
#  CyberSecurity Platform — BIR BUYRUQ bilan ishga tushirish
#  Ishlatish:  ./start.sh
#  (Docker + Docker Compose o'rnatilgan bo'lishi kerak.)
# ============================================================
set -e
cd "$(dirname "$0")"

# 1) Docker ishlayaptimi?
if ! docker info >/dev/null 2>&1; then
  echo "❌ Docker ishlamayapti."
  echo "   Docker Desktop'ni oching (Windows/Mac) yoki Linux'da:  sudo systemctl start docker"
  echo "   So'ng qayta urining:  ./start.sh"
  exit 1
fi

echo "🐳 Platforma + 6 ta zaif virtual mashina quriladi va ishga tushiriladi."
echo "   (Birinchi marta ~2-4 daqiqa — imijlar yuklab olinadi/quriladi.)"
echo ""
docker compose up -d --build

# 2) Backend tayyor bo'lishini kutish (curl'ga bog'liq emas)
echo ""
echo "⏳ Backend tayyor bo'lishini kutmoqda..."
ok=""
for i in $(seq 1 40); do
  if [ "$(docker inspect -f '{{.State.Running}}' ejpt-backend 2>/dev/null)" = "true" ]; then ok=1; break; fi
  sleep 1
done

# --- Host LAN IP (tarmoqdagi boshqa foydalanuvchilar shu manzilga ulanadi) ---
# 1) tashqi marshrutdagi manba IP (eng ishonchli — docker/lab IP'larini chetlab o'tadi)
LAN=$(ip route get 1.1.1.1 2>/dev/null | grep -oE 'src [0-9.]+' | awk '{print $2}' | head -1)
# 2) fallback: loopback/docker/lab bo'lmagan birinchi IPv4
if [ -z "$LAN" ]; then
  LAN=$(hostname -I 2>/dev/null | tr ' ' '\n' \
    | grep -vE '^(127\.|169\.254\.|172\.1[6-9]\.|172\.2[0-9]\.|172\.3[01]\.|10\.10\.10\.|10\.10\.20\.)' | head -1)
fi
# 3) macOS fallback
[ -z "$LAN" ] && LAN=$(ipconfig getifaddr en0 2>/dev/null)

echo ""
if [ "$ok" = "1" ]; then
  echo "✅ TAYYOR! Kirish manzillari:"
  echo "     • Shu kompyuterda:        http://localhost:8080"
  if [ -n "$LAN" ]; then
    echo "     • Tarmoqdagi boshqalar:   http://$LAN:8080"
  else
    echo "     • Tarmoqdagi boshqalar:   http://<IP>:8080   (IP'ni 'ip addr' bilan toping)"
  fi
else
  echo "⚠️  Backend hali javob bermayapti. Tekshiring:  docker compose ps  /  docker compose logs backend"
fi

cat <<TIP

  ──────────────────────────────────────────────────────────
  KEYINGI QADAMLAR
   1) Ro'yxatdan o'ting:  http://localhost:8080/register
        tarmoqdagi boshqalar:  http://${LAN:-<IP>}:8080/register
      ⚑ BIRINCHI ro'yxatdan o'tgan foydalanuvchi = ADMIN (darhol faol).
   2) Admin panel (/admin) — qolgan foydalanuvchilarni TASDIQLANG va
      ularga RUXSAT bering (masalan: ejpt, network, terminal).
   3) Dashboard → «Web Terminal» → terminalda:
         nmap -sn 10.10.20.0/24        # 6 mashinani toping
      har mashinani buzing: web zaifligi → SSH → oddiy user → root.
      To'liq yechim:  ../lab/WALKTHROUGH.md

  Tarmoqdan ulanmasa — xost devori (firewall) 8080-portni ochsin:
      Kali/Ubuntu:  sudo ufw allow 8080/tcp
  (Foydalanuvchilar bir xil Wi-Fi / LAN da bo'lishi kerak.)

  TO'XTATISH:  ./stop.sh
  ──────────────────────────────────────────────────────────
TIP
