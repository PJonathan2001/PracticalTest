import { Request, Response, NextFunction } from 'express';
import UserService from '../services/user.service';

class UserController {
  getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'No autorizado' });
        return;
      }
      const user = await UserService.getProfile(userId);
      res.json(user);
    } catch (err) {
      next(err);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'No autorizado' });
        return;
      }

      // Validar que hay datos para actualizar
      if (!req.body || Object.keys(req.body).length === 0) {
        res.status(400).json({ 
          success: false,
          error: 'No se proporcionaron datos para actualizar' 
        });
        return;
      }

      const user = await UserService.updateProfile(userId, req.body);
      
      res.json({
        success: true,
        message: 'Perfil actualizado correctamente',
        user: user
      });
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === 'Usuario no encontrado') {
          res.status(404).json({
            success: false,
            error: 'Usuario no encontrado'
          });
        } else if (err.message === 'Fecha de nacimiento inválida') {
          res.status(400).json({
            success: false,
            error: 'Fecha de nacimiento inválida'
          });
        } else {
          res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
          });
        }
      } else {
        res.status(500).json({
          success: false,
          error: 'Error desconocido'
        });
      }
    }
  };

  getLoginHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'No autorizado' });
        return;
      }
      const history = await UserService.getLoginHistory(userId);
      res.json(history);
    } catch (err) {
      next(err);
    }
  };
}

export default new UserController(); 