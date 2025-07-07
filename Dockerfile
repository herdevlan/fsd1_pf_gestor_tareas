# Etapa 1: Build del frontend (React CRA)
FROM node:18 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Etapa 2: Backend + frontend
FROM node:18
WORKDIR /app

# Backend
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copiar código backend
COPY backend ./backend

# Copiar frontend compilado
COPY --from=frontend-build /app/frontend/build ./frontend/build

# Variables y puertos
ENV PORT=3000
EXPOSE 3000

# Comando para iniciar backend
CMD ["node", "backend/index.js"]
