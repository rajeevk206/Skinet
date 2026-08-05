import { Component, effect, inject } from '@angular/core';
import { MatBadge } from '@angular/material/badge';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BusyService } from '../../core/services/busy.service';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatDivider } from '@angular/material/divider';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-header',
  standalone:true,
  imports: [
    MatIcon,
    MatBadge,
    MatButton,
    RouterLink,
    RouterLinkActive,
    MatProgressBar,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})

export class Header {
  busyService = inject(BusyService);
  cartService = inject(CartService);

  constructor() {
    effect(() => {
      console.log('Loading:', this.busyService.loading);
    });
  }
}
