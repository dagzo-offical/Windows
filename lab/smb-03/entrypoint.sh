#!/bin/sh
set -e

# ---- carol foydalanuvchisi (creds SMB share'da sizib chiqqan) ----
useradd -m -s /bin/bash carol 2>/dev/null || true
echo 'carol:Fil3s3rv3r2025' | chpasswd

# ---- Flaglar ----
echo 'EJPT{smb_null_cr3ds_l00t}' > /home/carol/user.txt
chown carol:carol /home/carol/user.txt; chmod 644 /home/carol/user.txt
echo 'EJPT{cr0n_wr1t4bl3_r00t}' > /root/root.txt
chmod 600 /root/root.txt

# ---- Null-session o'qiladigan public share: creds leak ----
mkdir -p /srv/public
cat > /srv/public/credentials.txt <<'CRED'
ACME File Server — xizmat hisoblari (VAQTINCHA, o'chiring!)
------------------------------------------------------------
backup_svc : (kutilyapti)
carol      : Fil3s3rv3r2025      # SSH kirish
CRED
chmod 444 /srv/public/credentials.txt
chown -R nobody:nogroup /srv/public

# ---- Privesc: root ishga tushiradigan world-writable "cron" skript ----
mkdir -p /opt/maintenance
cat > /opt/maintenance/cleanup.sh <<'SH'
#!/bin/sh
# har 20 soniyada tozalash (root sifatida ishlaydi)
rm -f /tmp/*.tmp 2>/dev/null
SH
chmod 777 /opt/maintenance/cleanup.sh
# root fonda skriptni takror ishga tushiradi (cron simulyatsiyasi)
( while true; do /bin/sh /opt/maintenance/cleanup.sh 2>/dev/null; sleep 20; done ) &

# ---- Samba (fon) ----
smbd --foreground --no-process-group 2>/dev/null &
nmbd --foreground --no-process-group 2>/dev/null &

# ---- sshd (FOREGROUND = konteyner tirik qoladi) ----
mkdir -p /run/sshd
ssh-keygen -A >/dev/null 2>&1
sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication yes/' /etc/ssh/sshd_config
sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
exec /usr/sbin/sshd -D -e
