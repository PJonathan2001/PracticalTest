import User, { IUser } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/default';
import MailService from './mail.service';
import TokenService from './token.service';
import { Request, Response, NextFunction } from 'express';

class AuthService {
  static async register(data: Partial<IUser>) {
    const { email, password, firstName, lastName, address, birthDate } = data;
    if (!email || !password) {
      throw new Error('Email y contraseña son obligatorios');
    }
    
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      throw new Error('El usuario ya existe');
    }
    
    // Validar fecha de nacimiento si se proporciona
    let validatedBirthDate: Date | undefined;
    if (birthDate) {
      const date = new Date(birthDate);
      if (isNaN(date.getTime())) {
        throw new Error('Fecha de nacimiento inválida');
      }
      validatedBirthDate = date;
    }
    
    const hashedPassword = await bcrypt.hash(password, config.bcryptRounds);
    const { generateToken } = await import('../utils/generateToken');
    const activationToken = generateToken(config.activationTokenLength);
    
    // Crear usuario pero revertir si el correo falla
    let user;
    try {
      user = await User.create({
        email,
        password: hashedPassword,
        firstName: firstName?.trim(),
        lastName: lastName?.trim(),
        address: address?.trim(),
        birthDate: validatedBirthDate,
        isActive: false,
        activationToken,
      });
      
      const activationLink = `${config.baseUrl}/api/auth/activate/${activationToken}`;
      
      const subject = 'Activa tu cuenta';
      const html = `<p>Hola ${firstName || 'Usuario'},</p><p>Por favor activa tu cuenta haciendo clic en el siguiente enlace:</p><a href="${activationLink}">${activationLink}</a>`;
      
      await MailService.sendMail(email, subject, html);
      
    } catch (err) {
      if (user) {
        await User.deleteOne({ _id: user._id });
      }
      let errorMsg = 'Error al registrar usuario o enviar correo';
      if (err instanceof Error) {
        errorMsg += ': ' + err.message;
      }
      throw new Error(errorMsg);
    }
    
    return { 
      message: 'Usuario registrado. Revisa tu correo para activar la cuenta.',
      success: true,
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        birthDate: user.birthDate
      }
    };
  }

  static async login(data: { email: string; password: string }) {
    if (!data || typeof data !== 'object') {
      throw new Error('Datos de login no proporcionados');
    }
    const { email, password } = data;
    if (!email || !password) {
      throw new Error('Email y contraseña son obligatorios');
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Usuario o contraseña incorrectos');
    }
    if (!user.isActive) {
      throw new Error('La cuenta no está activada');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Usuario o contraseña incorrectos');
    }
    
    // Actualizar último login
    const previousLogin = user.lastLogin;
    user.lastLogin = new Date();
    await user.save();
    
    const token = TokenService.generateJwt({ id: user._id, email: user.email });
    
    // Devolver información completa del usuario
    return { 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        firstName: user.firstName, 
        lastName: user.lastName,
        address: user.address,
        birthDate: user.birthDate,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        previousLogin: previousLogin,
        createdAt: user.createdAt,
        // Información adicional útil para el frontend
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        daysSinceLastLogin: previousLogin ? 
          Math.floor((Date.now() - previousLogin.getTime()) / (1000 * 60 * 60 * 24)) : 
          null,
        isFirstLogin: !previousLogin
      } 
    };
  }

  static async activate(token: string) {
    const user = await User.findOne({ activationToken: token });
    if (!user) {
      throw new Error('Token de activación inválido');
    }
    user.isActive = true;
    user.activationToken = undefined;
    await user.save();
    return { message: 'Cuenta activada correctamente.', success: true, isActive: true };
  }

  static async forgotPassword(email: string) {
    if (!email) {
      throw new Error('Email es obligatorio');
    }
    
    const user = await User.findOne({ email });
    
    if (!user) {
      // Por seguridad, no revelar si el email existe o no
      return { message: 'Correo de recuperación enviado.' };
    }
    
    const { generateToken } = await import('../utils/generateToken');
    const resetToken = generateToken(config.resetTokenLength);
    const expires = new Date(Date.now() + config.resetTokenExpires);
    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = expires;
    await user.save();
    
    const resetLink = `${config.baseUrl}/api/auth/reset-password/${resetToken}`;
    
    const subject = 'Recupera tu contraseña';
    const html = `<p>Hola,</p><p>Puedes restablecer tu contraseña haciendo clic en el siguiente enlace:</p><a href="${resetLink}">${resetLink}</a>`;
    
    try {
      await MailService.sendMail(email, subject, html);
    } catch (error) {
      // Limpiar el token si falla el envío
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      throw new Error('Error enviando el correo de recuperación');
    }
    
    return { message: 'Correo de recuperación enviado.' };
  }

  static async resetPassword(token: string, newPassword: string) {
    if (!token || !newPassword) {
      throw new Error('Token y nueva contraseña son obligatorios');
    }

    // Validar que la contraseña tenga al menos 6 caracteres
    if (newPassword.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new Error('Token inválido o expirado');
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, config.bcryptRounds);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();
    
    return { 
      message: 'Contraseña restablecida correctamente',
      success: true 
    };
  }

  static async verifyResetToken(token: string) {
    if (!token) {
      return { valid: false, message: 'Token no proporcionado' };
    }
    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });
    
    if (!user) {
      return { valid: false, message: 'Token inválido o expirado' };
    }
    
    return { 
      valid: true, 
      message: 'Token válido',
      email: user.email,
      expires: user.resetPasswordExpires 
    };
  }

  static async getUserInfo(userId: string) {
    const user = await User.findById(userId).select('-password -activationToken -resetPasswordToken -resetPasswordExpires');
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    return {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      birthDate: user.birthDate,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      daysSinceLastLogin: user.lastLogin ? 
        Math.floor((Date.now() - user.lastLogin.getTime()) / (1000 * 60 * 60 * 24)) : 
        null
    };
  }

  static async logout(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    return {
      success: true,
      message: 'Sesión cerrada correctamente',
      email: user.email
    };
  }
}

export default AuthService; 