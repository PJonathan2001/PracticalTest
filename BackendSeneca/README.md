# Backend Seneca - API de Autenticación y Gestión de Usuarios

Una API REST robusta construida con Node.js, Express, TypeScript y MongoDB para la gestión de usuarios y autenticación.

## 🚀 Características

- **Autenticación JWT**: Sistema completo de registro, login y gestión de sesiones
- **Validación de datos**: Validación robusta con express-validator
- **Encriptación segura**: Contraseñas encriptadas con bcrypt
- **Recuperación de contraseña**: Sistema de reset de contraseña por email
- **Activación de cuenta**: Activación por email con tokens
- **Gestión de perfiles**: Actualización y consulta de información de usuario
- **Historial de login**: Seguimiento de sesiones de usuario
- **Manejo de errores**: Middleware centralizado para errores
- **CORS configurado**: Soporte para aplicaciones frontend
- **TypeScript**: Código tipado y robusto

## 📋 Prerrequisitos

- **Node.js** (versión 16 o superior)
- **npm** o **yarn**
- **MongoDB** (local o en la nube)
- **SMTP** configurado para envío de emails

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd BackendSeneca
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Configuración del servidor
PORT=3000
NODE_ENV=development
BASE_URL=http://localhost:3000

# Configuración del frontend
FRONTEND_URL=http://localhost:4200
CORS_ORIGIN=http://localhost:4200

# Base de datos MongoDB
MONGODB_URI=mongodb://localhost:27017/testseneca

# JWT
JWT_SECRET=tu_jwt_secret_super_seguro
JWT_EXPIRES_IN=24h

# Configuración de email (SMTP)
EMAIL_FROM=no-reply@tuapp.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_password_de_aplicacion

# Configuración de seguridad
BCRYPT_ROUNDS=10

# Configuración de tokens
ACTIVATION_TOKEN_LENGTH=20
RESET_TOKEN_LENGTH=20
RESET_TOKEN_EXPIRES=3600000
```

### 4. Compilar TypeScript

```bash
npm run build
```

### 5. Ejecutar la aplicación

**Desarrollo:**
```bash
npm run dev
```

**Producción:**
```bash
npm start
```

## 📚 API Endpoints

### 🔐 Autenticación

#### Registro de usuario
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "password": "contraseña123",
  "confirmPassword": "contraseña123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@ejemplo.com",
  "password": "contraseña123"
}
```

#### Obtener usuario actual
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Cerrar sesión
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

#### Activar cuenta
```http
GET /api/auth/activate/:token
```

#### Solicitar reset de contraseña
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "juan@ejemplo.com"
}
```

#### Verificar token de reset
```http
GET /api/auth/check-reset-token/:token
```

#### Resetear contraseña
```http
POST /api/auth/reset-password/:token
Content-Type: application/json

{
  "password": "nueva_contraseña123",
  "confirmPassword": "nueva_contraseña123"
}
```

### 👤 Gestión de Usuarios

#### Obtener perfil
```http
GET /api/users/me
Authorization: Bearer <token>
```

#### Actualizar perfil
```http
PUT /api/users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Juan Carlos Pérez",
  "email": "juancarlos@ejemplo.com"
}
```

#### Historial de login
```http
GET /api/users/login-history
Authorization: Bearer <token>
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Ejecuta con ts-node en modo desarrollo

# Producción
npm run build        # Compila TypeScript a JavaScript
npm start           # Ejecuta la aplicación compilada

# Testing
npm test            # Ejecuta las pruebas (pendiente de implementar)
```

## 📁 Estructura del Proyecto

```
src/
├── app.ts                 # Configuración principal de Express
├── server.ts              # Punto de entrada del servidor
├── config/
│   └── default.ts         # Configuración de la aplicación
├── controllers/
│   ├── auth.controller.ts # Controlador de autenticación
│   └── user.controller.ts # Controlador de usuarios
├── middlewares/
│   ├── auth.middleware.ts # Middleware de autenticación
│   ├── error.middleware.ts # Manejo de errores
│   └── validate.middleware.ts # Validación de datos
├── models/
│   └── User.ts           # Modelo de usuario (Mongoose)
├── routes/
│   ├── auth.routes.ts    # Rutas de autenticación
│   └── user.routes.ts    # Rutas de usuarios
├── services/
│   ├── auth.service.ts   # Lógica de negocio de autenticación
│   ├── mail.service.ts   # Servicio de email
│   ├── token.service.ts  # Gestión de tokens
│   └── user.service.ts   # Lógica de negocio de usuarios
├── types/
│   └── express/
│       └── index.d.ts    # Tipos personalizados de Express
└── utils/
    ├── asyncHandler.ts   # Wrapper para manejo de async/await
    └── generateToken.ts  # Utilidades para generar tokens
```

## 🔒 Seguridad

- **JWT Tokens**: Autenticación basada en tokens JWT
- **Encriptación**: Contraseñas encriptadas con bcrypt (10 rounds)
- **Validación**: Validación robusta de datos de entrada
- **CORS**: Configuración de CORS para seguridad
- **Variables de entorno**: Configuración sensible en archivos .env

## 📧 Configuración de Email

Para que funcione el envío de emails (activación de cuenta y reset de contraseña), necesitas configurar un servidor SMTP. Ejemplo con Gmail:

1. Activa la verificación en dos pasos en tu cuenta de Gmail
2. Genera una contraseña de aplicación
3. Usa esa contraseña en `SMTP_PASS`

## 🚀 Despliegue

### Variables de entorno para producción:

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/database
JWT_SECRET=secret_muy_seguro_y_largo
FRONTEND_URL=https://tu-frontend.com
CORS_ORIGIN=https://tu-frontend.com
```

### Con PM2:

```bash
npm install -g pm2
pm2 start ecosystem.config.js
```

## 🧪 Testing

```bash
# Ejecutar tests (cuando se implementen)
npm test

# Ejecutar tests en modo watch
npm run test:watch
```

## 📝 Logs

Los logs se guardan en:
- **Desarrollo**: Consola
- **Producción**: Archivos de log (configurar con PM2 o similar)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema

## 🔄 Changelog

### v1.0.0
- Sistema completo de autenticación
- Gestión de usuarios
- Sistema de reset de contraseña
- Activación por email
- API REST documentada 