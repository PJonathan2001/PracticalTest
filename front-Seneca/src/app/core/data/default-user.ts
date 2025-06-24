import { User } from '../models/user.model';

export const DEFAULT_USER: User = {
  id: '1',
  email: 'admin@testseneca.com',
  password: 'admin123',
  firstName: 'Admin',
  lastName: 'Default',
  address: 'Calle Principal #123, Ciudad, País',
  birthDate: '1990-01-01T00:00:00.000Z',
  isActive: true,
  emailVerified: true,
  lastLogin: new Date().toISOString(),
  previousLogin: '2024-01-01T00:00:00.000Z',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: new Date().toISOString(),
  fullName: 'Administrador Sistema',
  daysSinceLastLogin: 0,
  isFirstLogin: false
};
