# Stage 1 - Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2 - Production avec nginx
FROM nginx:1.25-alpine AS production
WORKDIR /usr/share/nginx/html

# Supprimer la config par défaut
RUN rm -rf ./*

# Copier les fichiers buildés
COPY --from=builder /app/dist .

# Copier la config nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Créer un utilisateur non-root
RUN apk add --no-cache curl && \
  addgroup -S appgroup && adduser -S appuser -G appgroup && \
  chown -R appuser:appgroup /usr/share/nginx/html && \
  chown -R appuser:appgroup /var/cache/nginx && \
  chown -R appuser:appgroup /var/log/nginx && \
  touch /var/run/nginx.pid && \
  chown -R appuser:appgroup /var/run/nginx.pid

USER appuser

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
