import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { AlertComponent, AlertType } from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LoadingComponent, AlertComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  isInitializing = true;
  alert = {
    show: false,
    message: '',
    type: 'info' as AlertType
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.isInitializing = false;
      if (user && this.authService.isAuthenticated()) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.hideAlert();

      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: ({ user }) => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;

          // Manejar diferentes tipos de errores
          if (error.status === 401) {
            // Credenciales incorrectas
            this.showAlert('Email o contraseña incorrectos. Verifica tus credenciales.', 'error');
          } else if (error.status === 403) {
            // Cuenta no verificada
            this.showAlert('Tu cuenta no ha sido verificada. Revisa tu email y haz clic en el enlace de verificación.', 'warning');
          } else if (error.status === 404) {
            // Usuario no encontrado
            this.showAlert('No existe una cuenta con este email. Regístrate para crear una cuenta.', 'error');
          } else if (error.status === 0) {
            // Error de conexión
            this.showAlert('Error de conexión. Verifica tu conexión a internet.', 'error');
          } else if (error.status === 500) {
            // Error del servidor
            this.showAlert('Error en el servidor. Intenta nuevamente más tarde.', 'error');
          } else if (error.error && error.error.message) {
            // Mensaje específico del backend
            this.showAlert(error.error.message, 'error');
          } else if (error.message) {
            // Mensaje de error general
            this.showAlert(error.message, 'error');
          } else {
            // Error genérico
            this.showAlert('Error al iniciar sesión. Intenta nuevamente.', 'error');
          }
        }
      });
    }
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
