# ============================================
# Dockerfile para Frontend Angular
# ============================================

# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Copiar package.json y instalar dependencias
COPY package*.json ./
RUN npm ci

# Copiar el resto del código
COPY . .

# Construir la aplicación para producción
RUN npm run build -- --configuration=production --output-hashing=none

# Stage 2: Serve con Nginx
FROM nginx:alpine

# Copiar build desde el stage anterior
COPY --from=build /app/dist/browser /usr/share/nginx/html

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]