# smb-03 "fileserver" — null-session Samba -> cred -> SSH -> writable root script -> root
FROM debian:bookworm-slim
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y --no-install-recommends \
      samba samba-common-bin openssh-server sudo python3 procps iproute2 \
    && rm -rf /var/lib/apt/lists/*
COPY smb.conf /etc/samba/smb.conf
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 139 445 22
ENTRYPOINT ["/entrypoint.sh"]
