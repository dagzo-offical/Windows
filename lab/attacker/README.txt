eJPT Amaliy Lab — attacker qutisi (kali-lite)

Mashinalar:
  172.20.0.10  web-01  (acme.lab)   HTTP + SSH   -> www-data -> sysadmin -> root -> PIVOT
  172.20.0.20  linux-02 (backend)   FTP + SSH    -> bob -> SUID find -> root
  172.20.0.30  smb-03  (fileserver) SMB + SSH    -> null session -> creds -> root
  10.10.10.20  internal-04 (vault)  FAQAT web-01 orqali  -> command injection -> FINAL

Boshlash:
  nmap -sn 172.20.0.0/24            # host discovery
  nmap -sV -p- 172.20.0.10          # xizmatlarni aniqlash
  dirb http://172.20.0.10 /root/dirs.txt
  hydra -L users.txt -P /root/wordlist.txt ssh://172.20.0.20

Wordlist: /root/wordlist.txt   Kataloglar: /root/dirs.txt
Flaglarni portalda (Amaliy Lab sahifasi) topshiring.
