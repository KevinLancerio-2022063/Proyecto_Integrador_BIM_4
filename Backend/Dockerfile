FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

RUN ls -la dist/ || echo "ERROR: dist folder not found"
RUN find dist -name "*.js" -type f

EXPOSE 3000

CMD ["node", "dist/main.js"]