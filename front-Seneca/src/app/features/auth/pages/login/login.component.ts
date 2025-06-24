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
          this.showAlert('Error al iniciar sesión. Verifica tus credenciales.', 'error');
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
