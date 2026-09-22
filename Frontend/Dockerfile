# ============================================
# Dockerfile para Frontend Angular
# ============================================

# Stage 1: Build
FROM node:22-alpine AS build

WORKDIR /app

# Copiar package.json
COPY package.json ./

# Instalar dependencias
RUN npm install --legacy-peer-deps

# Copiar TODO el código
COPY . .

# Construir la aplicación
RUN npm run build

# === DEBUG COMPLETO ===
RUN echo "========================================="
RUN echo "=== ESTRUCTURA COMPLETA DE dist/ ==="
RUN echo "========================================="
RUN ls -laR /app/dist/
RUN echo "========================================="
RUN echo "=== Buscando index.html ==="
RUN find /app/dist -name "index.html" 2>/dev/null || echo "NO SE ENCONTRÓ index.html"
RUN echo "========================================="

# Stage 2: Serve con Nginx
FROM nginx:alpine

# Copiar configuración de nginx PRIMERO
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Debug: Ver qué hay en el contenedor antes de copiar
RUN echo "=== Contenido inicial de /usr/share/nginx/html/ ===" && ls -la /usr/share/nginx/html/

# Intentar copiar desde diferentes rutas posibles
# Opción 1: dist/Frontend/browser (Angular 17+ application builder)
COPY --from=build /app/dist/Frontend/browser /usr/share/nginx/html 2>/dev/null || \
# Opción 2: dist/browser 
COPY --from=build /app/dist/browser /usr/share/nginx/html 2>/dev/null || \
# Opción 3: dist/Frontend
COPY --from=build /app/dist/Frontend /usr/share/nginx/html 2>/dev/null || \
# Opción 4: dist (raíz)
COPY --from=build /app/dist /usr/share/nginx/html

# Verificar qué se copió
RUN echo "=== Contenido final de /usr/share/nginx/html/ ===" && ls -la /usr/share/nginx/html/
RUN echo "=== ¿Existe index.html? ===" && test -f /usr/share/nginx/html/index.html && echo "SÍ, index.html existe" || echo "NO, index.html NO existe"

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]