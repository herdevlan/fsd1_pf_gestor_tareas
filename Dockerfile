# Etapa 1: Construcción del frontend (React con CRA)
FROM node:18 AS frontend-build
WORKDIR /app/frontend

# Copiar e instalar dependencias del frontend
COPY frontend/package*.json ./
RUN npm install

# Copiar el código fuente y compilar
COPY frontend/ .
RUN npm run build

# Etapa 2: Construcción del contenedor final con backend + frontend
FROM node:18
WORKDIR /app

# Copiar e instalar dependencias del backend
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copiar el código fuente del backend
COPY backend ./backend

# Copiar el frontend ya compilado desde la etapa anterior
COPY --from=frontend-build /app/frontend/build ./frontend/build

# Configurar variables y puerto expuesto
ENV PORT=3000
EXPOSE 3000

# Comando de inicio del servidor backend
CMD ["node", "backend/index.js"]
