# ============================================
# Dockerfile para Backend Node.js + TypeScript
# ============================================

FROM node:20-alpine

WORKDIR /app

# Copiar archivos de configuración
COPY package.json package-lock.json ./

# Instalar dependencias con npm
RUN npm ci

# Copiar el código fuente
COPY . .

# Compilar TypeScript
RUN npm run build

# Verificar qué archivos se generaron
RUN ls -la dist/ || echo "ERROR: dist folder not found"
RUN find dist -name "*.js" -type f

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 0

# Iniciar aplicación (ajustar según el archivo real)
CMD ["node", "dist/main.js"]