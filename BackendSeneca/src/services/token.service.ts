import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import config from '../config/default';

const jwtSecret: Secret = (config as any).jwtSecret || (config as any).default?.jwtSecret;

class TokenService {
  static generateJwt(payload: object) {
    const options: SignOptions = { expiresIn: config.jwtExpiresIn as any };
    return jwt.sign(payload, jwtSecret, options);
  }
  // Métodos para generar/verificar tokens de activación y recuperación
}

export default TokenService; 