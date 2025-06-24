import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { AlertComponent, AlertType } from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <!-- Loading State -->
        <div *ngIf="isLoading" class="text-center">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Activando tu cuenta...</h2>
          <p class="text-gray-600">Por favor espera mientras verificamos tu email.</p>
        </div>

        <!-- Error State -->
        <div *ngIf="!isLoading && alert.show" class="text-center">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Error de Activación</h2>
          <p class="text-gray-600 mb-6">{{ alert.message }}</p>
          <div class="space-y-3">
            <button
              (click)="goToLogin()"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Ir al Login
            </button>
            <button
              (click)="goToRegister()"
              class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Crear Nueva Cuenta
            </button>
          </div>
        </div>

        <!-- Success State -->
        <div *ngIf="!isLoading && !alert.show" class="text-center">
          <!-- Success Icon -->
          <div class="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <svg class="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>

          <!-- Success Message -->
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            ¡Cuenta Activada! 🎉
          </h2>

          <p class="text-lg text-gray-600 mb-2">
            Tu cuenta ha sido activada exitosamente
          </p>

          <p class="text-sm text-gray-500 mb-8">
            Ya puedes iniciar sesión y disfrutar de todos nuestros servicios
          </p>

          <!-- Action Buttons -->
          <div class="space-y-4">
            <button
              (click)="goToLogin()"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
              </svg>
              Ir al Login
            </button>

            <div class="text-center">
              <p class="text-sm text-gray-500">
                ¿Necesitas ayuda?
                <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">
                  Contacta soporte
                </a>
              </p>
            </div>
          </div>

          <!-- Additional Info -->
          <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="ml-3">
                <h4 class="text-sm font-medium text-blue-800">¿Qué sigue?</h4>
                <div class="mt-2 text-sm text-blue-700">
                  <p>• Inicia sesión con tu email y contraseña</p>
                  <p>• Completa tu perfil con información adicional</p>
                  <p>• Explora todas las funcionalidades disponibles</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class EmailVerificationComponent implements OnInit {
  isLoading = true;
  alert = {
    show: false,
    message: '',
    type: 'info' as AlertType
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.verifyEmail(token);
      } else {
        this.showAlert('Token de activación no encontrado.', 'error');
        this.isLoading = false;
      }
    });
  }

  private verifyEmail(token: string): void {
    this.authService.verifyEmail(token).subscribe({
      next: () => {
        this.isLoading = false;
        // El mensaje de éxito se muestra en el template
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error en activación:', error);
        this.showAlert('Error al activar la cuenta. El token puede ser inválido o haber expirado. Intenta registrarte nuevamente.', 'error');
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  private showAlert(message: string, type: AlertType): void {
    this.alert = {
      show: true,
      message,
      type
    };
  }

  public hideAlert(): void {
    this.alert.show = false;
  }
}
