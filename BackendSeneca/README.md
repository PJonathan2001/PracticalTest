# Backend Seneca - API de Autenticación y Gestión de Usuarios

Una API REST construida con 
Node.js, 
Express, 
TypeScript,
MongoDB.

## 🚀 Instalación y Ejecución

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Crea un archivo `.env` en la raíz:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/users
BASE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:4200
JWT_EXPIRES_IN=24h
JWT_SECRET=supersecreto

# Configuración de email (SMTP con Google)
EMAIL_FROM=no-reply@tuapp.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_password_de_aplicacion
EMAIL_FROM=tu_email@gmail.com

## 📧 Configuración SMTP con Google

### Paso 1: Activar verificación en dos pasos
1. Ve a tu cuenta de Google → "Seguridad" → "Verificación en dos pasos"
2. Activa la verificación en dos pasos

### Paso 2: Generar contraseña de aplicación
1. En "Seguridad" → buscar "Contraseñas de aplicación"
2. Selecciona "Otra" y dale un nombre (ej: "Backend Seneca")
3. Copia la contraseña generada (16 caracteres)

### Paso 3: Configurar en .env
```env
SMTP_USER=tu_email@gmail.com
SMTP_PASS=abcd efgh ijkl mnop  # La contraseña de aplicación debe ir unida
```

### 4. Ejecutar
```bash

# Desarrollador
npm run build
npm start
```
