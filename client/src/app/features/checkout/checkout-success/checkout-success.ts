import { Component, inject, OnDestroy, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { AddressPipe } from '../../../shared/pipes/address-pipe';
import { CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { SignalrService } from '../../../core/services/signalr.service';
import { OrderService } from '../../../core/services/order.service';
import { PaymentCardPipe } from '../../../shared/pipes/payment-card.pipe';
import { MatIcon } from "@angular/material/icon";

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
    PaymentCardPipe
    //NgIf,
    //MatIcon
  ],
  templateUrl: './checkout-success.html',
  styleUrl: './checkout-success.scss',
})
export class CheckoutSuccess implements OnDestroy {
  signalrService = inject(SignalrService);
  private orderService = inject(OrderService);

  protected readonly showDelayedMessage = signal(false);
  private timeoutId = setTimeout(() => this.showDelayedMessage.set(true), 15000);

  ngOnDestroy(): void {
    clearTimeout(this.timeoutId);
    this.orderService.orderComplete = false;
    this.signalrService.orderSignal.set(null);
  }
}