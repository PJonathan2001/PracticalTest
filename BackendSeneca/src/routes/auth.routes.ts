import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { registerValidation, validate } from '../middlewares/validate.middleware';
import authMiddleware from '../middlewares/auth.middleware';
import config from '../config/default';

const router = Router();

router.post('/register', registerValidation, validate, AuthController.register);
router.post('/login', AuthController.login);
router.get('/activate/:token', AuthController.activate);
router.post('/forgot-password', AuthController.forgotPassword);

// Rutas para reset password
router.get('/check-reset-token/:token', AuthController.checkResetToken);
router.post('/reset-password/:token', AuthController.resetPassword);

// Ruta para obtener información del usuario actual
router.get('/me', authMiddleware, AuthController.getCurrentUser);

// Ruta para cerrar sesión
router.post('/logout', authMiddleware, AuthController.logout);

// Ruta para debugging (opcional)
router.get('/verify-reset-token/:token', AuthController.verifyResetToken);

// Ruta para redirigir al frontend (mantener para compatibilidad)
router.get('/reset-password/:token', (req, res) => {
  const { token } = req.params;
  res.redirect(`${config.frontendUrl}/reset-password/${token}`);
});

export default router; 