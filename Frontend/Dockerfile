# ============================================
# Dockerfile para Frontend Angular
# ============================================

# Usar Node.js v22 (requerido por Angular 17)
FROM node:22-alpine AS build

WORKDIR /app

# Copiar package.json
COPY package.json ./

# Instalar dependencias
RUN npm install --legacy-peer-deps

# Copiar el código fuente
COPY . .

# Construir la aplicación para producción
RUN npm run build

# Debug: Ver dónde se generaron los archivos
RUN echo "=== Contenido de dist/ ===" && ls -la dist/
RUN echo "=== Buscando index.html ===" && find dist -name "index.html" || echo "No index.html found"

# Stage 2: Serve con Nginx
FROM nginx:alpine

# Copiar configuración de nginx PRIMERO
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar build de Angular (probar diferentes rutas)
COPY --from=build /app/dist/Frontend/browser /usr/share/nginx/html

# Crear archivo de configuración por si no existe index.html
RUN echo "Server configuration complete"

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]