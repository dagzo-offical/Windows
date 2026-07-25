# web-easy "shopzone" (EASY) — ochiq config sizadi -> SSH -> sudo bash -> root
FROM php:8.2-apache
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y --no-install-recommends openssh-server sudo procps \
    && rm -rf /var/lib/apt/lists/*
COPY src/ /var/www/html/
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 80 22
ENTRYPOINT ["/entrypoint.sh"]
