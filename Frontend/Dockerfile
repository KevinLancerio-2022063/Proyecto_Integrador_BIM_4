# ============================================
# Dockerfile para Frontend Angular
# ============================================

# Usar Node.js v22 (requerido por Angular 17)
FROM node:22-alpine AS build

WORKDIR /app

# Copiar package.json
COPY package.json ./

# Eliminar node_modules si existe y forzar instalación limpia
RUN rm -rf node_modules package-lock.json
RUN npm cache clean --force
RUN npm install --legacy-peer-deps

# Copiar el código fuente
COPY . .

# Construir la aplicación para producción
RUN npm run build

# Debug: Ver dónde se generaron los archivos
RUN echo "=== Contenido de dist/ ===" && ls -la dist/
RUN echo "=== Buscando browser/ ===" && find dist -type d -name "browser" || echo "No browser folder found"

# Stage 2: Serve con Nginx
FROM nginx:alpine

# Intentar diferentes rutas comunes del build de Angular
COPY --from=build /app/dist/Frontend/browser /usr/share/nginx/html
# Si no existe, intentar con:
# COPY --from=build /app/dist/browser /usr/share/nginx/html

# Copiar configuración de nginx
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]