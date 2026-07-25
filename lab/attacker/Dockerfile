# Lightweight "kali-lite" attacker box — eJPT lab uchun yetarli vositalar
FROM debian:bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
      nmap \
      netcat-traditional \
      curl wget ca-certificates \
      python3 python3-pip \
      openssh-client sshpass \
      smbclient samba-common-bin \
      ftp \
      hydra \
      john \
      dirb \
      iputils-ping dnsutils net-tools \
      jq less vim-tiny procps \
      ncat \
    && (apt-get install -y --no-install-recommends proxychains4 || apt-get install -y --no-install-recommends proxychains || true) \
    && rm -rf /var/lib/apt/lists/*

# ttyd — brauzerdagi web-terminal (statik binary, vendored — tarmoq shart emas)
COPY ttyd /usr/local/bin/ttyd
RUN chmod +x /usr/local/bin/ttyd && /usr/local/bin/ttyd --version

# ---- Standart wordlistlar (haqiqiy Kali yo'llarida — imtihondagidek) ----
# Kataloglar/parametrlar: dirbuster medium list (vendored, ~1.8MB).
COPY directory-list-lowercase-2.3-medium.txt /usr/share/dirbuster/wordlists/directory-list-lowercase-2.3-medium.txt
RUN ln -sf /usr/share/dirbuster/wordlists/directory-list-lowercase-2.3-medium.txt /usr/share/wordlists/directory-list-lowercase-2.3-medium.txt 2>/dev/null || \
    (mkdir -p /usr/share/wordlists && ln -sf /usr/share/dirbuster/wordlists/directory-list-lowercase-2.3-medium.txt /usr/share/wordlists/directory-list-lowercase-2.3-medium.txt)

# Parol crack: rockyou.txt (build vaqtida yuklab olinadi — git'da saqlanmaydi).
# Yuklab bo'lmasa build to'xtamaydi (ogohlantirish beriladi); foydalanuvchi
# mashinasida (internet bor) muvaffaqiyatli tushadi.
RUN mkdir -p /usr/share/wordlists && \
    ( wget -q --tries=3 --timeout=60 -O /usr/share/wordlists/rockyou.txt \
        "https://github.com/brannondorsey/naive-hashcat/releases/download/data/rockyou.txt" \
      && echo "rockyou.txt: $(wc -l < /usr/share/wordlists/rockyou.txt) qator" ) || \
    echo "!!! rockyou.txt yuklanmadi (internet yo'qmi?). Keyin qo'lda: wget -O /usr/share/wordlists/rockyou.txt <url>"

COPY README.txt /root/README.txt

WORKDIR /root
