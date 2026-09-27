# =====================================================================
# Imagem do Portal da Universidade (artefato imutável do pipeline)
# Multi-stage build: o estágio "build" monta os arquivos estáticos e o
# estágio final só contém o servidor web + o site pronto.
# =====================================================================

# ---------- Estágio 1: build ----------
FROM alpine:3.22 AS build

# Metadados de rastreabilidade (NÃO são segredos)
ARG APP_VERSION=dev
ARG GIT_SHA=local

WORKDIR /build
COPY src/ ./site/

# Endpoint de health check com a versão/commit exatos deste artefato
RUN printf '{"status":"ok","version":"%s","commit":"%s"}\n' "$APP_VERSION" "$GIT_SHA" > site/health.json

# ---------- Estágio 2: runtime ----------
# Nginx sem privilégios de root (porta 8080)
FROM nginxinc/nginx-unprivileged:stable-alpine

ARG APP_VERSION=dev
ARG GIT_SHA=local
LABEL org.opencontainers.image.title="portal-universidade" \
      org.opencontainers.image.description="Portal da Universidade - pratica de GCS" \
      org.opencontainers.image.version="${APP_VERSION}" \
      org.opencontainers.image.revision="${GIT_SHA}"

# Aplica as correções de segurança já publicadas pelo Alpine (ex.: libexpat),
# sem esperar a imagem base oficial ser reconstruída. A imagem roda sem root,
# então troca para root só para atualizar e volta ao usuário nginx (UID 101).
USER root
RUN apk upgrade --no-cache
USER 101

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /build/site/ /usr/share/nginx/html/

EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/health.json || exit 1