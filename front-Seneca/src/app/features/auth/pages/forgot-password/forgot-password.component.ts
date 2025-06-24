import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { AlertComponent, AlertType } from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LoadingComponent, AlertComponent],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isLoading = false;
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
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      this.hideAlert();

      this.authService.requestPasswordReset(this.forgotPasswordForm.value.email).subscribe({
        next: () => {
          this.isLoading = false;
          this.showAlert('Se ha enviado un email con las instrucciones para restablecer tu contraseña.', 'success');
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 3000);
        },
        error: (error) => {
          this.isLoading = false;
          this.showAlert('Error al enviar el email. Verifica que el email sea correcto.', 'error');
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
