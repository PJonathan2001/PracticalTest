# Front-Seneca - Sistema de Autenticación y Gestión de Usuarios

Este proyecto implementa un sistema completo de autenticación y gestión de usuarios siguiendo las mejores prácticas de Clean Architecture en Angular 19.

## 🚀 Funcionalidades Implementadas

### Autenticación
- ✅ **Inicio de sesión** con registro de fecha y hora del último acceso
- ✅ **Cerrar sesión** con limpieza de datos locales
- ✅ **Registro de nuevos usuarios** con validaciones completas
- ✅ **Activación de cuenta por correo electrónico**
- ✅ **Recuperación de contraseña** por email
- ✅ **Formulario de actualización de información de usuario**
  - Nombres
  - Apellidos
  - Dirección
  - Fecha de nacimiento
- ✅ **Usuario por defecto** incluido

## 🔗 Conexión con Backend

### URL Base
```
http://localhost:3000/api/
```

### Rutas del Backend
```javascript
router.post('/register', registerValidation, validate, AuthController.register);
router.post('/login', AuthController.login);
router.get('/activate/:token', AuthController.activate);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password/:token', AuthController.resetPassword);
```

## 📁 Estructura del Proyecto (Clean Architecture)

```
src/app/
├── core/                           # Capa de dominio y lógica de negocio
│   ├── models/                     # Modelos de datos
│   │   └── user.model.ts          # Interfaces de usuario
│   ├── services/                   # Servicios de aplicación
│   │   └── auth.service.ts        # Servicio de autenticación
│   ├── guards/                     # Guards de Angular
│   │   └── auth.guard.ts          # Guard de autenticación
│   ├── interceptors/               # Interceptores HTTP
│   │   └── auth.interceptor.ts    # Interceptor de autenticación
│   └── data/                       # Datos por defecto
│       └── default-user.ts        # Usuario por defecto
│
├── shared/                         # Componentes y utilidades compartidas
│   └── components/
│       ├── loading/               # Componente de carga
│       │   └── loading.component.ts
│       └── alert/                 # Componente de alertas
│           └── alert.component.ts
│
├── features/                       # Módulos de características
│   ├── auth/                      # Módulo de autenticación
│   │   └── pages/
│   │       ├── login/             # Página de inicio de sesión
│   │       ├── register/          # Página de registro
│   │       ├── forgot-password/   # Página de recuperación
│   │       ├── email-verification/ # Página de verificación
│   │       └── reset-password/    # Página de reset de contraseña
│   ├── user/                      # Módulo de usuario
│   │   └── pages/
│   │       └── profile/           # Página de perfil
│   └── dashboard/                 # Módulo del dashboard
│       └── pages/
│           └── dashboard/         # Página principal
│
└── app.routes.ts                  # Configuración de rutas
```

## 🛠️ Tecnologías Utilizadas

- **Angular 19** - Framework principal
- **TypeScript** - Lenguaje de programación
- **Tailwind CSS** - Framework de estilos
- **DaisyUI** - Componentes de UI
- **RxJS** - Programación reactiva
- **Angular Forms** - Formularios reactivos

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o yarn
- Backend corriendo en `http://localhost:3000`

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd front-Seneca

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start
```

## 📋 Rutas de la Aplicación

### Rutas Públicas
- `/auth/login` - Inicio de sesión
- `/auth/register` - Registro de usuario
- `/auth/forgot-password` - Recuperación de contraseña
- `/activate/:token` - Activación de cuenta por email
- `/reset-password/:token` - Restablecimiento de contraseña

### Rutas Protegidas
- `/dashboard` - Panel principal (requiere autenticación)
- `/user/profile` - Perfil de usuario (requiere autenticación)

## 🔐 Usuario por Defecto

Para facilitar las pruebas, se incluye un usuario por defecto:

```
Email: admin@seneca.com
Contraseña: admin123
```

## 🎨 Características de UI/UX

- **Diseño responsivo** con Tailwind CSS
- **Componentes reutilizables** (Loading, Alert)
- **Formularios con validaciones** en tiempo real
- **Feedback visual** para todas las acciones
- **Navegación intuitiva** entre páginas
- **Estados de carga** para mejor UX

## 🔧 Configuración de Desarrollo

### Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
API_URL=http://localhost:3000/api
```

### Scripts Disponibles
```bash
npm start          # Servidor de desarrollo
npm run build      # Construcción para producción
npm run test       # Ejecutar pruebas
npm run watch      # Construcción en modo watch
```

## 📝 Patrones de Diseño Implementados

### Clean Architecture
- **Separación de responsabilidades** clara
- **Inversión de dependencias** con servicios
- **Modelos de dominio** bien definidos
- **Componentes presentacionales** y contenedores

### Principios SOLID
- **Single Responsibility** - Cada componente tiene una responsabilidad
- **Open/Closed** - Extensible sin modificar código existente
- **Liskov Substitution** - Interfaces bien definidas
- **Interface Segregation** - Interfaces específicas
- **Dependency Inversion** - Dependencias inyectadas

## 🧪 Testing

El proyecto está preparado para testing con:
- **Jasmine** - Framework de testing
- **Karma** - Test runner
- **Angular Testing Utilities** - Utilidades de testing

## 📦 Despliegue

### Producción
```bash
npm run build
```

Los archivos generados estarán en la carpeta `dist/`.

### Docker (Opcional)
```dockerfile
FROM nginx:alpine
COPY dist/front-seneca /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes alguna pregunta o problema, por favor abre un issue en el repositorio.
