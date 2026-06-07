# To Do List

## Requisitos
* Node.js
* MySQL
* Git

## Clonar el proyecto
git clone 

## Configuración de la base de datos
Crear una base de datos llamada:
CREATE DATABASE todo_db;
Importar el archivo: todo_db.sql

## Configurar variables de entorno
Crear un archivo `.env` dentro de la carpeta backend:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=todo_db

GOOGLE_CLIENT_ID=tu_client_id
GOOGLE_CLIENT_SECRET=tu_client_secret

## Instalar dependencias Backend
cd backend 
npm install

## Ejecutar Backend
npm start  o npx nodemon server.js

## Instalar dependencias Frontend
cd todo-frontend
npm install

## Ejecutar Frontend
npm run dev

## Acceso
Frontend: https://localhost:5173
Backend: https://localhost:3000