# internal-04 "vault" — FAQAT ichki tarmoqda; web-01 orqali pivot qilib kiriladi.
# Zaif "Internal Admin" ping vositasi -> command injection -> final flag.
FROM python:3.11-slim
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y --no-install-recommends iputils-ping \
    && rm -rf /var/lib/apt/lists/*
COPY app.py /app/app.py
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 8080
ENTRYPOINT ["/entrypoint.sh"]
