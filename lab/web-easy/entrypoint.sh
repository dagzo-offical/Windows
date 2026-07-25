#!/bin/sh
set -e
# deploy foydalanuvchisi (config.old da sizib chiqqan)
useradd -m -s /bin/bash deploy 2>/dev/null || true
echo 'deploy:D3ploy2024!' | chpasswd
# flaglar
echo 'EJPT{3xp0s3d_c0nf1g_ssh}' > /home/deploy/user.txt
chown deploy:deploy /home/deploy/user.txt; chmod 644 /home/deploy/user.txt
echo 'EJPT{sud0_b4sh_3z_r00t}' > /root/root.txt; chmod 600 /root/root.txt
# EASY privesc: sudo NOPASSWD /bin/bash
echo 'deploy ALL=(root) NOPASSWD: /bin/bash' > /etc/sudoers.d/deploy; chmod 440 /etc/sudoers.d/deploy
# sshd
mkdir -p /run/sshd; ssh-keygen -A >/dev/null 2>&1
sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication yes/' /etc/ssh/sshd_config
sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
/usr/sbin/sshd
exec apache2-foreground
