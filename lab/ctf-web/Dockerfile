# ctf-web "Nimbus Reports" (MEDIUM) — bitta haqiqiy ko'rinishli sayt, 4 web zaiflik:
#   IDOR · information disclosure (encoded) · reflected XSS (WAF bypass) · SSRF (decimal bypass)
# Web-layer only (SSH/root yo'q). Faqat izolyatsiya qilingan lab uchun — internetga ochmang.
FROM php:8.2-apache
ENV DEBIAN_FRONTEND=noninteractive

RUN a2enmod rewrite headers autoindex

COPY src/ /var/www/html/
RUN chown -R www-data:www-data /var/www/html

# Information disclosure: the exposed backup directory has listing ENABLED (Options +Indexes)
RUN printf '<Directory /var/www/html/storage-backup>\n  Options +Indexes\n  IndexOptions FancyIndexing\n</Directory>\n' \
      > /etc/apache2/conf-enabled/zz-storage-backup.conf

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
