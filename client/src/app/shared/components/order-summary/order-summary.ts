import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { MatInput } from "@angular/material/input";
import { CartService } from '../../../core/services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-summary',
  imports: [
    MatButton,
    RouterLink,
    MatFormField,
    MatLabel,
    MatButton,
    MatInput,
    CommonModule
],
  templateUrl: './order-summary.html',
  styleUrl: './order-summary.scss',
})
export class OrderSummary {
  cartService = inject(CartService);
}
