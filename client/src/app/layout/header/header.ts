import { Component, effect, inject } from '@angular/core';
import { MatBadge } from '@angular/material/badge';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BusyService } from '../../core/services/busy.service';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'app-header',
  standalone:true,
  imports: [
    MatIcon,
    MatBadge,
    MatButton,
    RouterLink,
    RouterLinkActive,
    MatProgressBar
],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})

export class Header {
  busyService = inject(BusyService);

  constructor() {
    effect(() => {
      console.log('Loading:', this.busyService.loading);
    });
  }
}
