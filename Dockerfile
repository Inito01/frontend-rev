FROM node:22-alpine AS build

WORKDIR /app

# Copiar archivos de dependencias primero
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código
COPY . .

# Generar la build
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copiar los archivos de build a nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de nginx si es necesaria
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
