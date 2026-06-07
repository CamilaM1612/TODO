# To Do List
Aplicaci0n web desarrollada con React, Node.js, Express y MySQL para la gestion de tareas.
## Requisitos
* Node.js
* MySQL
* Git

## HTTPS
El backend utiliza HTTPS mediante los certificados locales `key.pem` y `cert.pem`.

## Clonar el proyecto
git clone https://github.com/CamilaM1612/TODO.git
cd TODO

## Configuración de la base de datos
Crear una base de datos llamada:
CREATE DATABASE todo_db;
Importar el archivo incluido en el proyecto:: todo_db.sql
Desde MySQL Workbench:
1. Abrir MySQL Workbench.
2. Ir a Server -> Data Import.
3 Seleccionar Import from Self-Contained File.
4. Elegir el archivo `todo_db.sql`.
5. Seleccionar la base de datos `todo_db`.
6. Presionar **Start Import**.

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

## Funcionalidades
- Crear tareas
- Editar tareas
- Eliminar tareas
- Cambiar estado de tareas
 - Subida de archivos
- Descarga de archivos
- Inicio de sesión con Google OAuth
- Cierre de sesión
- Uso de HTTPS mediante certificados .pem