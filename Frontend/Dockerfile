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
# Usar 'build' en lugar de 'build:prod' si no existe
RUN npm run build || npm run build:prod

# Stage 2: Serve con Nginx
FROM nginx:alpine

# Copiar build desde el stage anterior
COPY --from=build /app/dist/browser /usr/share/nginx/html

# Copiar configuración de nginx
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]