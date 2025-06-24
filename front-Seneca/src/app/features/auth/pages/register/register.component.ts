import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { AlertComponent, AlertType } from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, LoadingComponent, AlertComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  acceptTerms = false;
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
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      address: [''],
      birthDate: ['']
    }, { validators: this.passwordMatchValidator });
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
    if (this.registerForm.valid && this.acceptTerms) {
      this.isLoading = true;
      this.hideAlert();

      const formValue = this.registerForm.value;
      const userData = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        password: formValue.password,
        address: formValue.address || undefined,
        birthDate: formValue.birthDate || undefined
      };

      this.authService.register(userData).subscribe({
        next: () => {
          this.isLoading = false;
          this.showSuccessMessage();
          setTimeout(() => {
            this.router.navigate(['/auth/registration-success']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.showAlert('Error al crear la cuenta. Intenta nuevamente.', 'error');
        }
      });
    }
  }

  private showSuccessMessage(): void {
    this.showAlert('Cuenta creada exitosamente. Revisa tu email para activar tu cuenta.', 'success');
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
