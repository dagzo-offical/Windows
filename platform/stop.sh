#!/usr/bin/env bash
# CyberSecurity Platform — to'xtatish
# Ishlatish:  ./stop.sh
cd "$(dirname "$0")"
docker compose down
echo ""
echo "🛑 To'xtatildi. Foydalanuvchilar saqlanadi (named volume: platform-data)."
echo "   To'liq tozalash (foydalanuvchilar + imijlar ham o'chadi):"
echo "      docker compose down --rmi local -v"
