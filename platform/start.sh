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

echo ""
if [ "$ok" = "1" ]; then
  echo "✅ TAYYOR!  Brauzerda oching:   http://localhost:8080"
else
  echo "⚠️  Backend hali javob bermayapti. Tekshiring:"
  echo "      docker compose ps"
  echo "      docker compose logs backend"
fi

cat <<'TIP'

  ──────────────────────────────────────────────────────────
  KEYINGI QADAMLAR
   1) http://localhost:8080/register  — ro'yxatdan o'ting.
      ⚑ BIRINCHI ro'yxatdan o'tgan foydalanuvchi = ADMIN (darhol faol).
   2) Admin panel (/admin) — qolgan foydalanuvchilarni TASDIQLANG va
      ularga RUXSAT bering (masalan: ejpt, network, terminal).
   3) Dashboard → «Web Terminal» → terminalda:
         nmap -sn 10.10.20.0/24        # 6 mashinani toping
      har mashinani buzing: web zaifligi → SSH → oddiy user → root.
      To'liq yechim:  ../lab/WALKTHROUGH.md

  TO'XTATISH:  ./stop.sh
  ──────────────────────────────────────────────────────────
TIP
