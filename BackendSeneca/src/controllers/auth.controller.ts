import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/auth.service';
import config from '../config/default';

class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json(result);
    } catch (err) {
      if (err instanceof Error && err.message === 'El usuario ya existe') {
        res.status(409).json({ error: err.message });
        return;
      }
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.login(req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async activate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.params;
      
      const result = await AuthService.activate(token);
      
      // Redirigir a la aplicación Angular con el token como parámetro
      const redirectUrl = `${config.frontendUrl}/account-activated?token=${token}&status=success`;
      
      res.redirect(redirectUrl);
    } catch (err) {
      // Si hay error, redirigir a la página de error
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      const redirectUrl = `${config.frontendUrl}/account-activated?status=error&message=${encodeURIComponent(errorMessage)}`;
      
      res.redirect(redirectUrl);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      const result = await AuthService.forgotPassword(email);
      res.json(result);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === 'No existe una cuenta con este email') {
          res.status(404).json({ error: err.message });
          return;
        } else if (err.message.includes('Error enviando el correo')) {
          res.status(500).json({ error: err.message });
          return;
        }
      }
      next(err);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.params;
      const { password } = req.body;
      
      const result = await AuthService.resetPassword(token, password);
      
      // Devolver JSON en lugar de redirect
      res.json({
        success: true,
        message: 'Contraseña restablecida correctamente'
      });
      
    } catch (err) {
      // Devolver JSON con error en lugar de redirect
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      res.status(400).json({
        success: false,
        error: errorMessage
      });
    }
  }

  async verifyResetToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.params;
      const result = await AuthService.verifyResetToken(token);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async checkResetToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.params;
      
      const result = await AuthService.verifyResetToken(token);
      
      if (result.valid) {
        res.json({
          success: true,
          valid: true,
          message: 'Token válido',
          email: result.email
        });
      } else {
        res.status(400).json({
          success: false,
          valid: false,
          error: result.message
        });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        valid: false,
        error: 'Error interno del servidor'
      });
    }
  }

  async getCurrentUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'No autorizado' });
        return;
      }
      
      const userInfo = await AuthService.getUserInfo(userId);
      res.json(userInfo);
    } catch (err) {
      next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'No autorizado' });
        return;
      }
      
      const result = await AuthService.logout(userId);
      
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

export default new AuthController(); 