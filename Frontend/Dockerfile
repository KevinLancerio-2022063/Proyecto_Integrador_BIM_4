# ============================================
# Dockerfile para Frontend Angular
# ============================================

# Usar Node.js v22 (requerido por Angular 17)
FROM node:22-alpine AS build

WORKDIR /app

# Copiar package.json
COPY package.json ./

# Limpiar cache de npm y instalar
RUN npm cache clean --force && npm install

# Copiar el código fuente
COPY . .

# Construir la aplicación para producción
RUN npm run build:prod

# Stage 2: Serve con Nginx
FROM nginx:alpine

# Copiar build desde el stage anterior
COPY --from=build /app/dist/browser /usr/share/nginx/html

# Copiar configuración de nginx
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]