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

# Compilar TypeScript (usar 'build', no 'build:prod')
RUN npm run build

# Debug: Ver qué archivos se generaron
RUN echo "=== Contenido de dist/ ===" && ls -la dist/ || echo "ERROR: dist folder not found"
RUN echo "=== Archivos JS en dist/ ===" && find dist -name "*.js" -type f 2>/dev/null || echo "No JS files found"

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 0

# CMD temporal - lo cambiaremos después de ver los logs
CMD ["node", "dist/main.js"]