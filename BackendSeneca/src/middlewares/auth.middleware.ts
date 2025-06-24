import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/default';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No autorizado' });
    return; 
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as any;
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token inválido' });
    return; 
  }
};

export default authMiddleware;