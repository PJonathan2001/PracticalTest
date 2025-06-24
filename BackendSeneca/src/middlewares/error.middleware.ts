import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

const errorMiddleware: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error middleware:', err);

  // Si la respuesta ya fue enviada, no hacer nada
  if (res.headersSent) {
    return next(err);
  }

  // Errores de autenticación
  if (err.message === 'Usuario o contraseña incorrectos') {
    res.status(401).json({ error: err.message });
    return;
  }

  // Errores de validación
  if (err.message === 'Email y contraseña son obligatorios' || 
      err.message === 'Email es obligatorio' ||
      err.message === 'Token y nueva contraseña son obligatorios') {
    res.status(400).json({ error: err.message });
    return;
  }

  // Errores de usuario no encontrado
  if (err.message === 'No existe una cuenta con este email') {
    res.status(404).json({ error: err.message });
    return;
  }

  // Errores de usuario ya existe
  if (err.message === 'El usuario ya existe') {
    res.status(409).json({ error: err.message });
    return;
  }

  // Errores de cuenta no activada
  if (err.message === 'La cuenta no está activada') {
    res.status(403).json({ error: err.message });
    return;
  }

  // Errores de token
  if (err.message.includes('Token') || err.message.includes('token')) {
    res.status(400).json({ error: err.message });
    return;
  }

  // Errores de envío de correo
  if (err.message.includes('Error enviando el correo') || err.message.includes('correo')) {
    res.status(500).json({ error: err.message });
    return;
  }

  // Errores de base de datos
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    res.status(400).json({ error: 'Datos inválidos' });
    return;
  }

  // Errores de JWT
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    res.status(401).json({ error: 'Token inválido o expirado' });
    return;
  }

  // Error por defecto
  res.status(500).json({ error: 'Error interno del servidor' });
};

export default errorMiddleware; 