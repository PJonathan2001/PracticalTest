# Front-Seneca

Sistema de autenticación y gestión de usuarios en Angular 19.

## 🚀 Cómo ejecutar

### Prerrequisitos
- Node.js 20+
- Backend corriendo en `http://localhost:3000`

### Instalación
```bash
npm install
# Se creará automáticamente la carpeta environments con la conexión al backend
```

### Ejecutar
```bash
ng serve
```

## 📋 Qué tiene

### Autenticación
- Login y registro de usuarios
- Recuperación de contraseña
- Activación de cuenta por email
- Perfil de usuario editable

### Usuario por defecto
```
Email: admin@seneca.com
Contraseña: admin123
```

### Tecnologías
- Angular 19
- TypeScript
- Tailwind CSS
- RxJS

## 📁 Estructura
```
src/app/
├── core/           # Servicios y modelos
├── shared/         # Componentes compartidos
├── features/       # Páginas de la app
│   ├── auth/       # Login, registro, etc.
│   ├── user/       # Perfil de usuario
│   └── dashboard/  # Panel principal
```
