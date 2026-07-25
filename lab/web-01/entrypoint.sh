#!/bin/sh
set -e

# ---- Flaglar ----
echo 'EJPT{w3b_upl04d_rce_www_data}' > /var/www/html/user.txt
chown www-data:www-data /var/www/html/user.txt
chmod 644 /var/www/html/user.txt

echo 'EJPT{w3b01_sud0_pyth0n_r00t}' > /root/root.txt
chmod 600 /root/root.txt

# ---- sysadmin tizim hisobi (SSH + privesc) ----
useradd -m -s /bin/bash sysadmin 2>/dev/null || true
echo 'sysadmin:jimmyis22' | chpasswd
# Privesc: NOPASSWD python3 (GTFOBins -> root)
echo 'sysadmin ALL=(root) NOPASSWD: /usr/bin/python3' > /etc/sudoers.d/sysadmin
chmod 440 /etc/sudoers.d/sysadmin

# ---- sshd (parol autentifikatsiyasi yoqilgan; root login taqiqlangan) ----
mkdir -p /run/sshd
ssh-keygen -A >/dev/null 2>&1
sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication yes/' /etc/ssh/sshd_config
sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
/usr/sbin/sshd

# ---- SQLite bazasini oldindan seed qilish (www-data egaligida) ----
php -r "require '/var/www/html/db.php'; db();" >/dev/null 2>&1 || true
chown -R www-data:www-data /var/www/html/data.db /var/www/html/uploads 2>/dev/null || true
chmod 666 /var/www/html/data.db 2>/dev/null || true

# ---- Apache (foreground) ----
exec apache2-foreground
