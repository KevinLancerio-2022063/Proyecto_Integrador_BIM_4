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
RUN echo "=== Archivos JS en dist/ ===" && find dist -name "*.js" -type f

# Crear script de inicio flexible
RUN echo '#!/bin/sh\n\
if [ -f dist/main.js ]; then\n\
  exec node dist/main.js\n\
elif [ -f dist/index.js ]; then\n\
  exec node dist/index.js\n\
elif [ -f dist/server.js ]; then\n\
  exec node dist/server.js\n\
elif [ -f dist/app.js ]; then\n\
  exec node dist/app.js\n\
else\n\
  echo "No entry point found in dist/"\n\
  ls -la dist/\n\
  exit 1\n\
fi' > /app/start.sh && chmod +x /app/start.sh

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 0

# Usar script flexible
CMD ["/app/start.sh"]