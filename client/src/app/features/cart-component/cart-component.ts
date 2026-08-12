import { Component, inject, signal } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { CartItemComponent } from '../cart/cart-item.component/cart-item.component';
import { Router, RouterLink } from '@angular/router';
import { OrderSummary } from '../../shared/components/order-summary/order-summary';
import { EmptyState } from '../../shared/components/empty-state/empty-state';


@Component({
   selector: 'app-cart-component',
  standalone: true,
  imports: [
    CartItemComponent, 
    OrderSummary,
    EmptyState
  ],
  templateUrl: './cart-component.html',
  styleUrl: './cart-component.scss',
})
export class CartComponent {
  private router = inject(Router)
  cartService = inject(CartService);

  onAction() {
    this.router.navigateByUrl('/shop');
  }
}