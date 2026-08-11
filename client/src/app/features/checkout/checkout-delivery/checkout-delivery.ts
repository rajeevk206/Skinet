import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, output } from '@angular/core';
import { CheckoutService } from '../../../core/services/checkout.service';
import { CartService } from '../../../core/services/cart.service';
import { firstValueFrom } from 'rxjs';
import { DeliveryMethod } from '../../../shared/models/deliveryMethod';
import {MatRadioModule} from '@angular/material/radio';

@Component({
  selector: 'app-checkout-delivery',
  imports: [
    MatRadioModule
  ],
  templateUrl: './checkout-delivery.html',
  styleUrl: './checkout-delivery.scss',
})
export class CheckoutDelivery implements OnInit {
  checkoutService = inject(CheckoutService);
  cartService = inject(CartService);
  deliveryComplete = output<boolean>();

  ngOnInit(): void {
    debugger;
    this.checkoutService.getDeliveryMethods().subscribe({
      next: methods => {
        if (this.cartService.cart()?.deliveryMethodId) {
          const method = methods.find(x => x.id === this.cartService.cart()?.deliveryMethodId);
          if (method) {
            this.cartService.selectedDelivery.set(method);
            this.deliveryComplete.emit(true);
          }
        }
      }
    });
  }

  async updateDeliveryMethod(method: DeliveryMethod) {
  debugger;

  this.cartService.selectedDelivery.set(method);

  this.cartService.cart.update(cart => {
    if (!cart) return cart;

    return {
      ...cart,
      deliveryMethodId: method.id
    };
  });

  console.log(
    'Selected Delivery Method ID:',
    this.cartService.cart()?.deliveryMethodId
  );

  this.deliveryComplete.emit(true);
}

  // async updateDeliveryMethod(method: DeliveryMethod) {
  //   debugger;
  //   this.cartService.selectedDelivery.set(method);
  //   const cart = this.cartService.cart();
  //   if (cart) {
  //     cart.deliveryMethodId = method.id;
  //     //await firstValueFrom(this.cartService.setCart(cart));
  //     this.deliveryComplete.emit(true);
  //   }
  // }
}

