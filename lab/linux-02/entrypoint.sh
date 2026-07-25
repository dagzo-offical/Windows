#!/bin/sh
set -e

# ---- bob foydalanuvchisi (zaif parol -> hydra crackable / FTP hint) ----
useradd -m -s /bin/bash bob 2>/dev/null || true
echo 'bob:football' | chpasswd

# ---- Flaglar ----
echo 'EJPT{ftp_ssh_cr4ck_f00th0ld}' > /home/bob/user.txt
chown bob:bob /home/bob/user.txt; chmod 644 /home/bob/user.txt
echo 'EJPT{su1d_f1nd_r00t_esc}' > /root/root.txt
chmod 600 /root/root.txt

# ---- Anonim FTP: cred hint ----
mkdir -p /srv/ftp
cat > /srv/ftp/note_to_bob.txt <<'NOTE'
Bob,
Serverga o'tishni tugatdim. SSH hisobing tayyor.
Iltimos parolingni o'zgartir — 'football' juda oddiy!
-- admin
NOTE
chmod -R a+r /srv/ftp

# ---- Privesc: SUID find (GTFOBins) ----
chmod u+s /usr/bin/find

# ---- FTP (fon) ----
python3 /opt/ftpserver.py >/dev/null 2>&1 &

# ---- sshd (FOREGROUND = konteyner tirik qoladi) ----
mkdir -p /run/sshd
ssh-keygen -A >/dev/null 2>&1
sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication yes/' /etc/ssh/sshd_config
sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
exec /usr/sbin/sshd -D -e
