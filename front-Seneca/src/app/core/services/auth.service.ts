import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { User, LoginRequest, RegisterRequest, UpdateUserRequest, PasswordResetRequest, PasswordResetConfirm, EmailVerificationRequest } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private readonly API_URL = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {
    this.validateAndLoadUser();
  }

  // Login
  login(email: string, password: string): Observable<{ token: string; user: User }> {
    return this.http.post<{ token: string; user: User }>(`${this.API_URL}/login`, { email, password }).pipe(
      tap(response => {
        sessionStorage.setItem('auth_token', response.token);
        this.currentUserSubject.next(null); // Limpiar usuario, se obtendrá desde el backend
      })
    );
  }

  // Logout
  logout(): void {
    sessionStorage.removeItem('auth_token');
    this.currentUserSubject.next(null);
  }

  // Register
  register(userData: RegisterRequest): Observable<{ user: User; message: string }> {
    return this.http.post<{ user: User; message: string }>(`${this.API_URL}/register`, userData);
  }

  // Email verification (activate account)
  verifyEmail(token: string): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(`${this.API_URL}/activate/${token}`);
  }

  // Password reset request
  requestPasswordReset(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API_URL}/forgot-password`, { email });
  }

  // Password reset confirmation
  resetPassword(token: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API_URL}/reset-password/${token}`, {
      password: newPassword
    });
  }

  // Update user profile
  updateProfile(userData: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/users/me`, userData)
      .pipe(
        tap(user => {
          this.currentUserSubject.next(user);
        })
      );
  }

  // Get current user (from BehaviorSubject)
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Get token from sessionStorage
  getToken(): string | null {
    return sessionStorage.getItem('auth_token');
  }

  // Obtener perfil del usuario autenticado SIEMPRE desde el backend
  getProfile(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/me`).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
      })
    );
  }

  getLastLogin(): string | null {
    return this.getCurrentUser()?.lastLogin || null;
  }

  getPreviousLogin(): string | null {
    return this.getCurrentUser()?.previousLogin || null;
  }

  getDaysSinceLastLogin(): number | null {
    return this.getCurrentUser()?.daysSinceLastLogin ?? null;
  }

  isFirstLogin(): boolean {
    return this.getCurrentUser()?.isFirstLogin ?? false;
  }

  // Validar token y cargar usuario
  private validateAndLoadUser(): void {
    const token = this.getToken();
    if (token) {
      this.http.get<User>(`${environment.apiUrl}/users/me`).pipe(
        catchError(() => {
          this.logout();
          return of(null);
        })
      ).subscribe(user => {
        if (user) {
          this.currentUserSubject.next(user);
        } else {
          this.logout();
        }
      });
    } else {
      this.logout();
    }
  }

  private setCurrentUser(user: User, token: string): void {
    sessionStorage.setItem('auth_token', token);
    this.currentUserSubject.next(user);
  }

  private updateCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
  }

  private loadUserFromStorage(): void {
    // Ya no se usa, los datos del usuario se obtienen siempre del backend
  }
}
