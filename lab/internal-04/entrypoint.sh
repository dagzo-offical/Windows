#!/bin/sh
set -e
# Final flag (faqat pivot orqali command injection bilan olinadi)
echo 'EJPT{p1v0t_1nt3rnal_cmd1nj}' > /root/flag.txt
chmod 644 /root/flag.txt
echo 'EJPT{p1v0t_1nt3rnal_cmd1nj}' > /flag.txt
chmod 644 /flag.txt
exec python3 /app/app.py
