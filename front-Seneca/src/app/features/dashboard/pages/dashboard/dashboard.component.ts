import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.model';
import { ProfileComponent } from '../../../user/pages/profile/profile.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ProfileComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  testToken: string = '';
  lastSessionAt: Date | null = null;
  showProfileModal = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
        if ((user as any).lastSessionAt) {
          this.lastSessionAt = (user as any).lastSessionAt;
        }
      },
      error: () => {
        // Fallback: try to load from localStorage before redirecting
        const userStr = localStorage.getItem('current_user');
        if (userStr) {
          this.currentUser = JSON.parse(userStr);
        } else {
          this.router.navigate(['/auth/login']);
        }
      }
    });
  }

  openProfileModal(): void {
    this.showProfileModal = true;
  }

  closeProfileModal(): void {
    this.showProfileModal = false;
    // Recargar datos del usuario después de cerrar el modal
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: () => {
        // Si falla, mantener los datos actuales
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  testActivation(): void {
    if (this.testToken) {
      // Navegar a la ruta de activación con el token
      this.router.navigate(['/auth/reset-password', this.testToken]);
    }
  }
}
