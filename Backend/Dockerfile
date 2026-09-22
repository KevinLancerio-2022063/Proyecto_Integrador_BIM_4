# ============================================
# Dockerfile para Backend Node.js
# ============================================

FROM node:20-alpine

WORKDIR /app

# Instalar dependencias de sistema si es necesario
RUN apk add --no-cache postgresql-client

# Copiar package.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar el código fuente
COPY . .

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Iniciar aplicación
CMD ["node", "dist/main.js"]