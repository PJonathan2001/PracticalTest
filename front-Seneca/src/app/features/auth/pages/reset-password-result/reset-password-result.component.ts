import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-reset-password-result',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reset-password-result.component.html'
})
export class ResetPasswordResultComponent {
  status: string | null = null;
  errorMessage: string | null = null;

  constructor(private route: ActivatedRoute) {
    this.route.queryParamMap.subscribe(params => {
      this.status = params.get('status');
      this.errorMessage = params.get('message');
    });
  }
}
