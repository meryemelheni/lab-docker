# Stage 1 - Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
# using npm install because no package-lock.json is present
RUN npm install --only=production
COPY . .

# Stage 2 - Production
FROM node:20-alpine AS production
WORKDIR /app

# Créer un utilisateur non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Installer curl pour le healthcheck
RUN apk add --no-cache curl

# Copier uniquement les artefacts nécessaires
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server.js ./
COPY --from=builder /app/package.json ./

# Variables d'environnement (définies via docker-compose/.env)
ENV PORT=3000

# Changer vers utilisateur non-root
USER appuser

EXPOSE 3000

# Health check (conforme au sujet)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["node", "server.js"]
