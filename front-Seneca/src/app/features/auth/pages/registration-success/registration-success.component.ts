import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-registration-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './registration-success.component.html'
})
export class RegistrationSuccessComponent implements OnInit {
  userEmail: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Obtener el email del localStorage o de los parámetros de la URL
    const userStr = localStorage.getItem('temp_user_email');
    if (userStr) {
      this.userEmail = userStr;
    }
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }


}
