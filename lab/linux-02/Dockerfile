# linux-02 "backend" — anon FTP hint + zaif SSH -> bob -> SUID find -> root
# FTP uchun pyftpdlib (konteynerda barqaror); sshd = foreground (asosiy foothold).
FROM debian:bookworm-slim
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y --no-install-recommends \
      openssh-server sudo python3 python3-pyftpdlib procps iproute2 findutils \
    && rm -rf /var/lib/apt/lists/*
COPY ftpserver.py /opt/ftpserver.py
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 21 22 21100-21110
ENTRYPOINT ["/entrypoint.sh"]
