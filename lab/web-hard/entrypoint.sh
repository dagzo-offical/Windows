#!/bin/sh
set -e
# webadmin foydalanuvchisi (SSH cred LFI orqali sizadi)
useradd -m -s /bin/bash webadmin 2>/dev/null || true
echo 'webadmin:W3bM0n1t0r2024!' | chpasswd
# SSH cred'lar server yozuvlarida (LFI bilan o'qiladi)
mkdir -p /opt/monitor
cat > /opt/monitor/deploy_notes.txt <<'NOTE'
MonitorPanel deploy notes
-------------------------
Backend SSH access:
  user: webadmin
  pass: W3bM0n1t0r2024!
TODO: rotate credentials, move out of webroot-readable path.
NOTE
chmod 644 /opt/monitor/deploy_notes.txt
# flaglar
echo 'EJPT{lf1_l34ks_ssh_cr3ds}' > /home/webadmin/user.txt
chown webadmin:webadmin /home/webadmin/user.txt; chmod 644 /home/webadmin/user.txt
echo 'EJPT{c4p_s3tu1d_p3rl_r00t}' > /root/root.txt; chmod 600 /root/root.txt
# HARD privesc: perl'ga cap_setuid capability
setcap cap_setuid+ep /usr/bin/perl 2>/dev/null || setcap cap_setuid+ep "$(readlink -f /usr/bin/perl)"
# sshd
mkdir -p /run/sshd; ssh-keygen -A >/dev/null 2>&1
sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication yes/' /etc/ssh/sshd_config
sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
/usr/sbin/sshd
exec apache2-foreground
