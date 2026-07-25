# web-01 "acme.lab" — zaif veb ilova -> www-data -> sysadmin -> root -> pivot
FROM php:8.2-apache

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
      openssh-server sudo python3 curl iproute2 procps libsqlite3-dev \
    && docker-php-ext-install pdo_sqlite \
    && rm -rf /var/lib/apt/lists/*

# Zaif ilova
COPY src/ /var/www/html/
# uploads katalogi yoziladigan bo'lsin (unrestricted upload nuqtasi)
RUN mkdir -p /var/www/html/uploads && chown -R www-data:www-data /var/www/html/uploads \
    && a2enmod rewrite >/dev/null 2>&1

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80 22
ENTRYPOINT ["/entrypoint.sh"]
