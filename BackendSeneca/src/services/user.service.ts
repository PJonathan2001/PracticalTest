import User, { IUser } from '../models/User';

class UserService {
  static async getProfile(userId: string) {
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
      createdAt: user.createdAt
    };
  }

  static async updateProfile(userId: string, data: Partial<IUser>) {
    // Validar que el usuario existe
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      throw new Error('Usuario no encontrado');
    }
    
    // Campos que se pueden actualizar
    const allowedFields = ['firstName', 'lastName', 'address', 'birthDate'];
    const updateData: Partial<IUser> = {};
    
    // Validar y procesar cada campo
    for (const field of allowedFields) {
      if (data[field as keyof IUser] !== undefined) {
        const value = data[field as keyof IUser];
        
        // Validaciones específicas por campo
        if (field === 'firstName' || field === 'lastName') {
          if (typeof value === 'string' && value.trim().length > 0) {
            updateData[field as keyof IUser] = value.trim();
          } else if (value === '') {
            updateData[field as keyof IUser] = undefined; // Permitir limpiar el campo
          }
        } else if (field === 'address') {
          if (typeof value === 'string') {
            updateData[field as keyof IUser] = value.trim() || undefined;
          }
        } else if (field === 'birthDate') {
          if (value instanceof Date || (typeof value === 'string' && value)) {
            const date = new Date(value as string | Date);
            if (!isNaN(date.getTime())) {
              updateData[field as keyof IUser] = date;
            } else {
              throw new Error('Fecha de nacimiento inválida');
            }
          } else if (value === null || value === '') {
            updateData[field as keyof IUser] = undefined; // Permitir limpiar el campo
          }
        }
      }
    }
    
    // Actualizar el usuario
    const user = await User.findByIdAndUpdate(
      userId, 
      updateData, 
      { new: true, runValidators: true }
    ).select('-password -activationToken -resetPasswordToken -resetPasswordExpires');
    
    if (!user) {
      throw new Error('Error al actualizar el usuario');
    }
    
    // Devolver información completa actualizada
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

  static async getLoginHistory(userId: string) {
    const user = await User.findById(userId).select('lastLogin createdAt');
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    return {
      userId: user._id,
      email: user.email,
      lastLogin: user.lastLogin,
      accountCreated: user.createdAt,
      daysSinceLastLogin: user.lastLogin ? 
        Math.floor((Date.now() - user.lastLogin.getTime()) / (1000 * 60 * 60 * 24)) : 
        null
    };
  }
}

export default UserService; 