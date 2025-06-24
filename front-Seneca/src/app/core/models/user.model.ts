export interface User {
  id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  address?: string;
  birthDate?: string;
  isActive: boolean;
  emailVerified: boolean;
  lastLogin: string;
  previousLogin: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  daysSinceLastLogin: number;
  isFirstLogin: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  address?: string;
  birthDate?: Date;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

export interface EmailVerificationRequest {
  token: string;
}
