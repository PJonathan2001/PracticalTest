import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const registerValidation = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('firstName').notEmpty().withMessage('El nombre es obligatorio'),
  body('lastName').notEmpty().withMessage('El apellido es obligatorio'),
  body('address').optional().isString().withMessage('La dirección debe ser un texto'),
  body('birthDate').optional().isISO8601().withMessage('La fecha de nacimiento debe tener formato válido (YYYY-MM-DD)'),
];

export const updateProfileValidation = [
  body('firstName').optional().isString().trim().isLength({ min: 1 }).withMessage('El nombre debe tener al menos 1 carácter'),
  body('lastName').optional().isString().trim().isLength({ min: 1 }).withMessage('El apellido debe tener al menos 1 carácter'),
  body('address').optional().isString().trim().withMessage('La dirección debe ser un texto'),
  body('birthDate').optional().isISO8601().withMessage('La fecha de nacimiento debe tener formato válido (YYYY-MM-DD)'),
];

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
}; 