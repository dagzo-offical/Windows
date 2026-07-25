#!/bin/bash
# Platforma to'liq stack testi (backend :8080 orqali).
set -u
B=http://localhost:8080
pass=0; fail=0
chk(){ if [ "$2" = "$3" ]; then echo "  [PASS] $1 ($2)"; pass=$((pass+1)); else echo "  [FAIL] $1: got $2 want $3"; fail=$((fail+1)); fi; }
code(){ curl -s -o /dev/null -w "%{http_code}" "$@"; }
JA=/tmp/pj_a; JU=/tmp/pj_u; rm -f $JA $JU

echo "### auth"
R1=$(curl -s -X POST $B/api/register -H 'Content-Type: application/json' -d '{"username":"admin","password":"admin12345"}')
echo "$R1" | grep -q '"first":true' && { echo "  [PASS] register#1 -> admin"; pass=$((pass+1)); } || { echo "  [FAIL] register#1: $R1"; fail=$((fail+1)); }
curl -s -X POST $B/api/register -H 'Content-Type: application/json' -d '{"username":"bob","password":"bobpass123"}' >/dev/null
chk "login admin" "$(code -c $JA -X POST $B/api/login -H 'Content-Type: application/json' -d '{"username":"admin","password":"admin12345"}')" 200
chk "login bob (pending->403)" "$(code -X POST $B/api/login -H 'Content-Type: application/json' -d '{"username":"bob","password":"bobpass123"}')" 403

echo "### admin grants"
BID=$(curl -s -b $JA $B/api/admin/users | node -e 'const d=JSON.parse(require("fs").readFileSync(0));console.log(d.users.find(u=>u.username==="bob").id)')
curl -s -b $JA -X POST $B/api/admin/user/status -H 'Content-Type: application/json' -d "{\"userId\":\"$BID\",\"status\":\"active\"}" >/dev/null
curl -s -b $JA -X POST $B/api/admin/grant -H 'Content-Type: application/json' -d "{\"userId\":\"$BID\",\"resource\":\"ejpt\"}" >/dev/null
curl -s -b $JA -X POST $B/api/admin/grant -H 'Content-Type: application/json' -d "{\"userId\":\"$BID\",\"resource\":\"terminal\"}" >/dev/null
echo "  granted ejpt + terminal to bob, approved"

echo "### gating"
code -c $JU -X POST $B/api/login -H 'Content-Type: application/json' -d '{"username":"bob","password":"bobpass123"}' >/dev/null
chk "bob -> /ejpt (granted)" "$(code -b $JU $B/ejpt/index.html)" 200
chk "bob -> /windows (not granted)" "$(code -b $JU $B/windows/index.html)" 403
chk "anon -> /ejpt (redirect)" "$(code $B/ejpt/index.html)" 302
chk "bob -> /terminal (granted)" "$(code -b $JU -L $B/terminal/)" 200

echo "### VM restart (admin)"
RR=$(curl -s -b $JA -X POST $B/api/admin/vm/restart -H 'Content-Type: application/json' -d '{"vm":"linux-02"}')
echo "$RR" | grep -q '"ok":true' && { echo "  [PASS] restart linux-02"; pass=$((pass+1)); } || { echo "  [FAIL] restart: $RR"; fail=$((fail+1)); }

echo "### terminal reaches VMs (from attacker via ttyd host)"
NM=$(docker exec ejpt-attacker sh -c "nmap -sn 172.20.0.0/24 2>/dev/null | grep -c 'Host is up'" 2>/dev/null)
chk "attacker sees >=3 hosts" "$([ "${NM:-0}" -ge 3 ] && echo yes || echo no)" yes

echo ""
echo "### NATIJA: PASS=$pass FAIL=$fail"
