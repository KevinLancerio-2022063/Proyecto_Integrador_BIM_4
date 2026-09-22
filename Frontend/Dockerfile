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
RUN npm run build -- --configuration=production

# Debug: Ver estructura
RUN echo "=== Estructura de dist/ ===" && ls -laR /app/dist/

# Stage 2: Serve con Nginx
FROM nginx:alpine

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar build de Angular (ruta confirmada: dist/Frontend/browser)
COPY --from=build /app/dist/Frontend/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]