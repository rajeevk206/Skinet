import { CurrencyPipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { ConfirmationToken } from '@stripe/stripe-js';
import { CartService } from '../../../core/services/cart.service';
import { AddressPipe } from "../../../shared/pipes/address-pipe";

@Component({
  selector: 'app-checkout-review',
  imports: [
    CurrencyPipe
    //AddressPipe,
    //PaymentCardPipe
    ,
    AddressPipe
],
  templateUrl: './checkout-review.html',
  styleUrl: './checkout-review.scss',
})
export class CheckoutReview {
  cartService = inject(CartService);
  @Input() confirmationToken?: ConfirmationToken;
}
