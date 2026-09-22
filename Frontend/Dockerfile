# ============================================
# Dockerfile para Frontend Angular
# ============================================

# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Copiar archivos de configuración (npm, no pnpm)
COPY package.json package-lock.json ./

# Instalar dependencias con npm
RUN npm ci

# Copiar el código fuente
COPY . .

# Construir la aplicación para producción
RUN npm run build:prod

# Stage 2: Serve con Nginx
FROM nginx:alpine

# Copiar build desde el stage anterior
COPY --from=build /app/dist/browser /usr/share/nginx/html

# Copiar configuración de nginx desde el build stage
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]