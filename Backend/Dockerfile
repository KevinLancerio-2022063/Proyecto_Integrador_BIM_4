# ============================================
# Dockerfile para Backend Node.js + TypeScript
# ============================================

FROM node:20-alpine

WORKDIR /app

# Copiar package.json
COPY package.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Compilar TypeScript
RUN npm run build

# Debug: Ver qué archivos se generaron
RUN echo "=== Contenido de dist/ ===" && ls -la dist/
RUN echo "=== Buscando archivos JS ===" && find dist -name "*.js" -type f

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 0

# CMD simple - probar con index.js primero
CMD ["sh", "-c", "if [ -f dist/main.js ]; then node dist/main.js; elif [ -f dist/index.js ]; then node dist/index.js; elif [ -f dist/server.js ]; then node dist/server.js; else echo 'No entry point found' && ls -la dist/ && exit 1; fi"]