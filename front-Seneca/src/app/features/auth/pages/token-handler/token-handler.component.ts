import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { AlertComponent, AlertType } from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-token-handler',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingComponent, AlertComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {{ isActivation ? 'Activación de Cuenta' : 'Restablecer Contraseña' }}
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            {{ isActivation ? 'Procesando la activación de tu cuenta...' : 'Procesando el restablecimiento de tu contraseña...' }}
          </p>
        </div>

        <app-alert
          [show]="alert.show"
          [message]="alert.message"
          [type]="alert.type"
          (dismiss)="hideAlert()">
        </app-alert>

        <div class="text-center">
          <app-loading [isLoading]="isLoading" [message]="loadingMessage"></app-loading>

          <div *ngIf="!isLoading && !alert.show" class="text-center">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 class="mt-2 text-sm font-medium text-gray-900">{{ successTitle }}</h3>
            <p class="mt-1 text-sm text-gray-500">{{ successMessage }}</p>
            <div class="mt-6">
              <a routerLink="/auth/login"
                 class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Ir al Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class TokenHandlerComponent implements OnInit {
  isLoading = true;
  isActivation = false;
  token: string = '';
  alert = {
    show: false,
    message: '',
    type: 'info' as AlertType
  };

  get loadingMessage(): string {
    return this.isActivation ? 'Activando cuenta...' : 'Restableciendo contraseña...';
  }

  get successTitle(): string {
    return this.isActivation ? 'Cuenta Activada' : 'Contraseña Restablecida';
  }

  get successMessage(): string {
    return this.isActivation
      ? 'Tu cuenta ha sido activada exitosamente. Ya puedes iniciar sesión.'
      : 'Tu contraseña ha sido restablecida exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.';
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.token = params['token'];
      if (!this.token) {
        this.showAlert('Token no encontrado.', 'error');
        this.isLoading = false;
        return;
      }

      // Determinar si es activación o reset basado en la URL
      this.determineTokenType();
    });
  }

  private determineTokenType(): void {
    // Detectar si es activación o reset basado en la URL
    const currentUrl = this.router.url;

    // Si la URL contiene 'auth/reset-password', asumimos que es activación de cuenta
    // porque el backend está enviando el enlace de activación con esa ruta
    if (currentUrl.includes('auth/reset-password')) {
      this.isActivation = true;
    } else if (currentUrl.includes('reset-password')) {
      this.isActivation = false;
    } else {
      // Por defecto, asumimos activación
      this.isActivation = true;
    }

    this.processToken();
  }

  private processToken(): void {
    if (this.isActivation) {
      this.activateAccount();
    } else {
      this.resetPassword();
    }
  }

  private activateAccount(): void {
    this.authService.verifyEmail(this.token).subscribe({
      next: () => {
        this.isLoading = false;
        // El mensaje de éxito se muestra en el template
      },
      error: (error) => {
        this.isLoading = false;
        this.showAlert('Error al activar la cuenta. El token puede ser inválido o haber expirado.', 'error');
      }
    });
  }

  private resetPassword(): void {
    // Para reset de contraseña, redirigir al componente específico
    this.router.navigate(['/reset-password', this.token]);
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
