export default {
  // Configuración del servidor
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Base URL del backend
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  
  // Configuración del frontend
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:4200',
  
  // Configuración de la base de datos
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/testseneca',
  
  // Configuración de JWT
  jwtSecret: process.env.JWT_SECRET || 'supersecreto',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  
  // Configuración de email
  emailFrom: process.env.EMAIL_FROM || 'no-reply@testseneca.com',
  smtpHost: process.env.SMTP_HOST,
  smtpPort: Number(process.env.SMTP_PORT) || 587,
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  
  // Configuración de CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  
  // Configuración de seguridad
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS) || 10,
  
  // Configuración de tokens
  activationTokenLength: Number(process.env.ACTIVATION_TOKEN_LENGTH) || 20,
  resetTokenLength: Number(process.env.RESET_TOKEN_LENGTH) || 20,
  resetTokenExpires: Number(process.env.RESET_TOKEN_EXPIRES) || 3600000, // 1 hora en ms
}; 