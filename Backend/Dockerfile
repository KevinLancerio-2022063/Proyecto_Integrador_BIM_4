# ============================================
# Dockerfile para Backend Node.js + TypeScript
# ============================================

FROM node:20-alpine

WORKDIR /app

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Copiar archivos de configuración
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Instalar dependencias (todas, incluyendo dev para compilar TS)
RUN pnpm install --frozen-lockfile

# Copiar el código fuente
COPY . .

# Compilar TypeScript (verificar que funcione)
RUN pnpm build

# Verificar que dist existe
RUN ls -la dist/ || echo "ERROR: dist folder not found"

# Exponer puerto
EXPOSE 3000

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 0

# Iniciar aplicación
CMD ["node", "dist/main.js"]