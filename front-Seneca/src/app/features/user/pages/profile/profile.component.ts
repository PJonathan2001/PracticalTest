import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { AlertComponent, AlertType } from '../../../../shared/components/alert/alert.component';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingComponent, AlertComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();

  profileForm: FormGroup;
  isLoading = false;
  alert = {
    show: false,
    message: '',
    type: 'info' as AlertType
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      address: [''],
      birthDate: ['']
    });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.profileForm.patchValue({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        address: currentUser.address || '',
        birthDate: currentUser.birthDate ? this.formatDateForInput(new Date(currentUser.birthDate)) : ''
      });
    }
  }

  private formatDateForInput(date: Date): string {
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    return '';
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      this.hideAlert();

      const formValue = this.profileForm.value;
      const userData: any = {
        firstName: formValue.firstName,
        lastName: formValue.lastName
      };
      if (formValue.address) {
        userData.address = formValue.address;
      }
      if (formValue.birthDate) {
        userData.birthDate = formValue.birthDate;
      }

      this.authService.updateProfile(userData).subscribe({
        next: () => {
          this.isLoading = false;
          this.showAlert('Perfil actualizado exitosamente.', 'success');
          // Cerrar modal después de 2 segundos
          setTimeout(() => {
            this.onClose();
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.showAlert('Error al actualizar el perfil. Intenta nuevamente.', 'error');
        }
      });
    }
  }

  onClose(): void {
    this.closeModal.emit();
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
