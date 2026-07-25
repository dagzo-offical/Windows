# CyberSecurity Platform backend (Node + docker CLI for VM restart)
FROM node:22-slim
RUN apt-get update && apt-get install -y --no-install-recommends docker.io curl \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY server.js ./server.js
COPY public ./public
ENV PORT=8080 REPO_ROOT=/repo DATA_DIR=/data TTYD_HOST=ejpt-attacker TTYD_PORT=7681
EXPOSE 8080
CMD ["node", "server.js"]
