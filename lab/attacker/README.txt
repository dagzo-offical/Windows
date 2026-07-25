eJPT Amaliy Lab — attacker qutisi (kali-lite)

Mashinalar (har xil daraja, har xil zaiflik — oqim: web -> SSH -> root):
  10.10.20.40  web-easy (shopzone)     [EASY]   HTTP+SSH  -> ochiq config.old -> SSH -> sudo bash -> root
  10.10.20.20  linux-02 (backend)      [easy]   FTP+SSH   -> bob -> SUID find -> root
  10.10.20.10  web-01   (acme.lab)     [MEDIUM] HTTP+SSH  -> SQLi hash -> john -> SSH -> root -> PIVOT
  10.10.20.30  smb-03   (fileserver)   [medium] SMB+SSH   -> null session -> creds -> root
  10.10.20.50  web-hard (monitorpanel) [HARD]   HTTP+SSH  -> LFI -> SSH -> perl cap_setuid -> root
  10.10.10.20  internal-04 (vault)     [hard]   FAQAT web-01 orqali -> command injection -> FINAL

Boshlash:
  nmap -sn 10.10.20.0/24            # host discovery (6 mashina)
  nmap -sV -p- 10.10.20.40          # xizmatlarni aniqlash
  dirb http://10.10.20.10 /root/dirs.txt
  hydra -l bob -P /root/wordlist.txt ssh://10.10.20.20

Wordlist: /root/wordlist.txt   Kataloglar: /root/dirs.txt
Flaglarni portalda (Amaliy Lab sahifasi) topshiring.
