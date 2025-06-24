import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { AlertComponent, AlertType } from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LoadingComponent, AlertComponent],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  isLoading = false;
  token: string = '';
  alert = {
    show: false,
    message: '',
    type: 'info' as AlertType
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.token = params['token'];
      if (!this.token) {
        this.showAlert('Token de restablecimiento no encontrado.', 'error');
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 3000);
      }
    });
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid && this.token) {
      this.isLoading = true;
      this.hideAlert();

      const { password } = this.resetPasswordForm.value;

      this.authService.resetPassword(this.token, password).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.showAlert(
            res?.message || 'Contraseña restablecida exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.',
            'success'
          );
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 3000);
        },
        error: (error) => {
          this.isLoading = false;
          this.showAlert(
            error?.error?.message || 'Error al restablecer la contraseña. El token puede ser inválido o haber expirado.',
            'error'
          );
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
