# ============================================
# Dockerfile para Frontend Angular
# ============================================

# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar archivos de configuración
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar TODO el código (incluyendo nginx.conf)
COPY . .

# Construir la aplicación para producción
RUN pnpm build:prod

# Stage 2: Serve con Nginx
FROM nginx:alpine

# Copiar build desde el stage anterior
COPY --from=build /app/dist/browser /usr/share/nginx/html

# Copiar configuración de nginx (desde el contexto de build)
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]