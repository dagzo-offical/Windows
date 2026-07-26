#!/bin/sh
set -e

# ---- IDOR reports (webroot'dan TASHQARIDA; faqat download.php orqali id bo'yicha beriladi) ----
# 1..12 — bir XIL to'liq report (ichidagi ma'lumot bir xil). 0 — ichki arxiv (flag).
mkdir -p /opt/ctf/reports
cat > /opt/ctf/reports/_report.txt <<'REP'
Nimbus Reports — Monthly Summary
Workspace: acme-analytics
Period:    2024
Status:    delivered

KPIs
  Active users:        4,213     (+8.0%)
  Revenue:             $128,400  (+7.2%)
  Reports generated:   1,204     (+10.7%)
  Median query time:   42 ms     (-17.6%)
  Uptime (30d):        98.9%     (+0.3%)

Notes
  All figures reconciled against the production replica.
  Generated automatically by Nimbus v3.4.1.
REP
i=1
while [ "$i" -le 12 ]; do
  cp /opt/ctf/reports/_report.txt "/opt/ctf/reports/$i.txt"
  i=$((i + 1))
done
rm -f /opt/ctf/reports/_report.txt
# report #0 — ichki arxiv (UI hech qachon ko'rsatmaydi; report_id=0 bilan Burp orqali olinadi)
printf 'Nimbus Reports — INTERNAL archive export (report #0)\nWorkspace: acme-analytics (legacy)\nCLASSIFICATION: internal only\n\nEJPT{id0r_burp_r3p0rt_z3r0}\n' > /opt/ctf/reports/0.txt

# ---- XSS flag (flag.php faqat same-origin so'rovga beradi) ----
printf 'EJPT{w4f_byp4ss_x55_r3fl3ct}\n' > /opt/ctf/xflag.txt

# ---- SSRF flag (admin-metrics.php faqat 127.0.0.1 ga beradi) ----
printf 'EJPT{ssrf_d3c1m4l_2_l0c4l}\n' > /opt/ctf/ssrf.txt

chmod -R a+rX /opt/ctf

# ---- Information disclosure: ochiq qolgan backup katalogi, flag base64 ko'rinishida ----
mkdir -p /var/www/html/storage-backup
cat > /var/www/html/storage-backup/nimbus_db_2024-01-15.sql.txt <<'BAK'
-- Nimbus Reports — partial DB export (STAGING). DO NOT SHIP.
-- generated: 2024-01-15T03:12:04Z   host: nimbus-ops-1
INSERT INTO workspaces (id,name,plan) VALUES (1,'acme-analytics','team');
INSERT INTO users (id,email,role) VALUES (7,'ops@nimbus-reports.example','operator');
-- ops handoff note (base64): RUpQVHszbmMwZDNkX2I0Y2t1cF9sMzRrfQ==
-- TODO: rotate the export token and delete this dump.
BAK
chown -R www-data:www-data /var/www/html/storage-backup

exec apache2-foreground
