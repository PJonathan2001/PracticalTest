import crypto from 'crypto';

export function generateToken(length = 32): string {
  return crypto.randomBytes(length).toString('hex');
} 