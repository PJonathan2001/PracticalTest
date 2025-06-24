import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

const errorMiddleware: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err);

  // Errores de autenticación
  if (err.message === 'Usuario o contraseña incorrectos') {
    res.status(401).json({ message: err.message });
    return;
  }

  // Otros errores
  res.status(500).json({ message: 'Error interno del servidor' });
};

export default errorMiddleware; 