import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { AddressPipe } from '../../../shared/pipes/address-pipe';
import { CurrencyPipe, DatePipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-checkout-success',
   standalone: true,
  imports: [
    MatButton,
    RouterLink,
    MatProgressSpinnerModule,
    DatePipe,
    AddressPipe,
    CurrencyPipe,
    //PaymentCardPipe,
    NgIf
  ],
  templateUrl: './checkout-success.html',
  styleUrl: './checkout-success.scss',
})
export class CheckoutSuccess {
  //signalrService = inject(SignalrService);
  //private orderService = inject(OrderService);

  
}
