import { Component, inject, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { BusyService } from '../../../core/services/busy.service';

@Component({
  selector: 'app-empty-state',
  imports: [
    MatIcon,
    MatButton,
    RouterLink
  ],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss',
})
export class EmptyState {
  busyService = inject(BusyService);
  message = input.required<string>();
  icon = input.required<string>();
  actionText = input.required<string>();
  action = output<void>();

  onAction() {
    this.action.emit();
  }
}
