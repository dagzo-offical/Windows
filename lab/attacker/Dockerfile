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
      dirb \
      iputils-ping dnsutils net-tools \
      jq less vim-tiny procps \
      ncat \
    && (apt-get install -y --no-install-recommends proxychains4 || apt-get install -y --no-install-recommends proxychains || true) \
    && rm -rf /var/lib/apt/lists/*

# Kichik wordlist (lab parollarini o'z ichiga oladi — hydra/dirb ishlashi uchun)
COPY wordlist.txt /root/wordlist.txt
COPY dirs.txt /root/dirs.txt
COPY README.txt /root/README.txt

WORKDIR /root
