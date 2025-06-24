import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import config from './config/default';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import errorMiddleware from './middlewares/error.middleware';
import User from './models/User';

// Configuración de variables de entorno
dotenv.config();

const app: Application = express();

// Middlewares
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(config.mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions)
  .then(() => console.log(`Entorno: ${config.mongodbUri}`))
  .catch((err) => console.error('Error conectando a MongoDB:', err));

// Rutas (se agregarán luego)
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Middleware de manejo de errores
app.use(errorMiddleware);

(async () => {
  await User.createDefaultUser();
})();

export default app; 