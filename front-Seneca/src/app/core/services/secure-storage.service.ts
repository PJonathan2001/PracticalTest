import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SecureStorageService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';
  private readonly SESSION_KEY = 'session_data';
  private readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

  constructor() {}

  // ===== MÉTODOS PARA TOKEN =====
  setToken(token: string): void {
    sessionStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
  }

  // ===== MÉTODOS PARA DATOS DE USUARIO =====
  setUserData(userData: any): void {
    const safeData = this.sanitizeData(userData);
    sessionStorage.setItem(this.USER_KEY, JSON.stringify(safeData));
  }

  getUserData(): any | null {
    const data = sessionStorage.getItem(this.USER_KEY);
    return data ? JSON.parse(data) : null;
  }

  removeUserData(): void {
    sessionStorage.removeItem(this.USER_KEY);
  }

  // ===== MÉTODOS PARA SESIÓN =====
  setSessionData(): void {
    const sessionData = {
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + this.SESSION_DURATION).toISOString()
    };
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
  }

  getSessionData(): any | null {
    const data = sessionStorage.getItem(this.SESSION_KEY);
    return data ? JSON.parse(data) : null;
  }

  isSessionValid(): boolean {
    const sessionData = this.getSessionData();
    if (!sessionData) return false;

    return new Date() < new Date(sessionData.expiresAt);
  }

  removeSessionData(): void {
    sessionStorage.removeItem(this.SESSION_KEY);
  }

  // ===== MÉTODOS DE LIMPIEZA =====
  clearAll(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);
    sessionStorage.removeItem(this.SESSION_KEY);
  }

  // ===== MÉTODOS DE SEGURIDAD =====
  private sanitizeData(data: any): any {
    // Remover campos sensibles antes de guardar
    if (data && typeof data === 'object') {
      const { password, token, secret, ...safeData } = data;
      return safeData;
    }
    return data;
  }

  // ===== MÉTODOS DE VALIDACIÓN =====
  hasValidSession(): boolean {
    const token = this.getToken();
    const userData = this.getUserData();
    const isSessionValid = this.isSessionValid();

    return !!(token && userData && isSessionValid);
  }

  // ===== MÉTODOS DE ENCRIPCIÓN BÁSICA (opcional) =====
  private encrypt(data: string): string {
    // Implementación básica de encriptación (en producción usar librerías como crypto-js)
    return btoa(data);
  }

  private decrypt(data: string): string {
    // Implementación básica de desencriptación
    return atob(data);
  }

  // ===== MÉTODOS PARA ALMACENAMIENTO ENCRIPTADO (opcional) =====
  setEncryptedData(key: string, data: any): void {
    const encryptedData = this.encrypt(JSON.stringify(data));
    sessionStorage.setItem(key, encryptedData);
  }

  getEncryptedData(key: string): any | null {
    const encryptedData = sessionStorage.getItem(key);
    if (!encryptedData) return null;

    try {
      const decryptedData = this.decrypt(encryptedData);
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('Error decrypting data:', error);
      return null;
    }
  }
}
