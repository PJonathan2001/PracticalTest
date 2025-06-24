# Backend Seneca - API de Autenticación y Gestión de Usuarios

Una API REST construida con Node.js, Express, TypeScript y MongoDB.

## 🚀 Instalación y Ejecución

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Crea un archivo `.env` en la raíz:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/testseneca
JWT_SECRET=tu_jwt_secret_super_seguro

# Configuración de email (SMTP con Google)
EMAIL_FROM=no-reply@tuapp.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_password_de_aplicacion
```

### 3. Configurar URLs (opcional)
En `src/config/default.ts` puedes cambiar:
- `baseUrl`: URL del backend (por defecto: http://localhost:3000)
- `frontendUrl`: URL del frontend (por defecto: http://localhost:4200)
- `corsOrigin`: Origen permitido para CORS

### 4. Ejecutar
```bash

# Desarrollador
npm run build
npm start
```

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

## 📚 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Usuario actual
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/activate/:token` - Activar cuenta
- `POST /api/auth/forgot-password` - Solicitar reset
- `POST /api/auth/reset-password/:token` - Resetear contraseña

### Usuarios
- `GET /api/users/me` - Perfil
- `PUT /api/users/me` - Actualizar perfil
- `GET /api/users/login-history` - Historial de login

## 🔧 Scripts
```bash
npm run dev    # Desarrollo
npm run build  # Compilar
npm start      # Producción
``` 