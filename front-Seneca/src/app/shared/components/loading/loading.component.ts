import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isLoading" class="flex justify-center items-center p-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <span class="ml-2 text-gray-600">{{ message }}</span>
    </div>
  `,
  styles: []
})
export class LoadingComponent {
  @Input() isLoading: boolean = false;
  @Input() message: string = 'Cargando...';
}
