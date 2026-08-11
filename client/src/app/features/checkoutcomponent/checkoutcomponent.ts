import { ChangeDetectorRef, Component, computed, inject, Input, OnDestroy, OnInit, signal } from '@angular/core';

import {MatStepper, MatStepperModule} from '@angular/material/stepper';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { SnackbarService } from '../../core/services/snackbar.service';
import {MatCheckboxChange, MatCheckboxModule} from '@angular/material/checkbox';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { CurrencyPipe, JsonPipe } from '@angular/common';
import { OrderSummary } from '../../shared/components/order-summary/order-summary';
import { StripeService } from '../../core/services/stripe.service';
import { AccountService } from '../../core/services/account.service';
import { CartService } from '../../core/services/cart.service';
import { ConfirmationToken, StripeAddressElement, StripeAddressElementChangeEvent, StripePaymentElement, StripePaymentElementChangeEvent } from '@stripe/stripe-js';
import { firstValueFrom } from 'rxjs';
import { User } from '../../shared/models/user';
import { Address } from '../../shared/models/user';
import { CheckoutReview } from '../checkout/checkout-review/checkout-review';
import { CheckoutDelivery } from '../checkout/checkout-delivery/checkout-delivery';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { OrderService } from '../../core/services/order.service';
import { OrderToCreate, ShippingAddress } from '../../shared/models/order';



@Component({
  selector: 'app-checkoutcomponent',
   standalone: true,
  imports: [
    //OrderSummaryComponent,
    MatStepperModule,
    MatButton,
    RouterLink,
    MatCheckboxModule,
    CurrencyPipe,
    //JsonPipe,
    MatProgressSpinnerModule,
    OrderSummary,
    CheckoutReview,
    CheckoutDelivery
],
  templateUrl: './checkoutcomponent.html',
  styleUrl: './checkoutcomponent.scss',
})
export class Checkoutcomponent implements OnInit, OnDestroy {
  private stripeService = inject(StripeService);
  private snackbar = inject(SnackbarService);
  private router = inject(Router);
  private accountService = inject(AccountService);
  private orderService = inject(OrderService);
  private cdr = inject(ChangeDetectorRef);
  cartService = inject(CartService);
  addressElement?: StripeAddressElement;
  paymentElement?: StripePaymentElement;
  saveAddress = false;
  completionStatus = signal<{address: boolean, card: boolean, delivery: boolean}>(
    {address: false, card: false, delivery: false}
  );
  //confirmationToken?: ConfirmationToken;
  confirmationToken: ConfirmationToken | null = null;
  loading = false;

  async ngOnInit() {
    try {
      this.addressElement = await this.stripeService.createAddressElement();
      this.addressElement.mount('#address-element');
      this.addressElement.on('change', this.handleAddressChange)

      this.paymentElement = await this.stripeService.createPaymentElement();
      this.paymentElement.mount('#payment-element');
      this.paymentElement.on('change', this.handlePaymentChange);
    } catch (error: any) {
      this.snackbar.error(error.message);
    }
  }

  handleAddressChange = (event: StripeAddressElementChangeEvent) => {
  this.completionStatus.update(state => ({
    ...state,
    address: event.complete
  }));
};

  handlePaymentChange = (event: StripePaymentElementChangeEvent) => {
  console.log('Payment complete:', event.complete);

  this.completionStatus.update(state => ({
    ...state,
    card: event.complete
  }));
};

  handleDeliveryChange(event: boolean) {
  this.completionStatus.update(state => ({
    ...state,
    delivery: event
  }));
}



  async getConfirmationToken() {
  try {

    const allComplete = Object.values(this.completionStatus())
      .every(status => status === true);

    console.log('Completion status:', this.completionStatus());
    console.log('All complete:', allComplete);

    if (!allComplete) {
      return;
    }

    const result = await this.stripeService.createConfirmationToken();

    console.log('Confirmation token result:', result);

    if (result.error) {
      throw new Error(result.error.message);
    }

    this.confirmationToken = result.confirmationToken ?? null;

    console.log('Confirmation Token:', this.confirmationToken);
    console.log('Token exists:', !!this.confirmationToken);

    // Important when using a normal property instead of a signal
    this.cdr.detectChanges();

  } catch (error: any) {
    this.snackbar.error(error.message);
  }
}

  async onStepChange(event: StepperSelectionEvent) {
    if (event.selectedIndex === 1) {
      if (this.saveAddress) {
        const address = await this.getAddressFromStripeAddress() as Address;
        address && firstValueFrom(this.accountService.updateAddress(address));
      }
    }
    if (event.selectedIndex === 2) {
      await firstValueFrom(this.stripeService.createOrUpdatePaymentIntent());
    }
    if (event.selectedIndex === 3) {
      await this.getConfirmationToken();
    }
  }

  async confirmPayment(stepper: MatStepper) {
  debugger;
    this.loading = true;

    try {
        if (!this.confirmationToken) {
            throw new Error('Confirmation token is missing');
        }
       // 1. Confirm Stripe payment
        const result = await this.stripeService.confirmPayment(
            this.confirmationToken
        );
        console.log('Stripe payment result:', result);
        // 2. Check Stripe payment
        if (result.error) {
            throw new Error(result.error.message);
        }
        if (result.paymentIntent?.status !== 'succeeded') {
            throw new Error(
                `Payment not successful. Status: ${result.paymentIntent?.status}`
            );
        }
        console.log('Payment succeeded');
        // 3. Create order
        const order = await this.createOrderModel();
        debugger;
        console.log('Order model:', order);
        const orderResult =
            await firstValueFrom(
                this.orderService.createOrder(order)
            );
        console.log('Order result:', orderResult);
        if (!orderResult) {
            throw new Error('Order creation failed');
        }
        // 4. Complete order
        this.orderService.orderComplete = true;
        this.cartService.deleteCart();
        this.cartService.selectedDelivery.set(null);
        // 5. Go to success page
        await this.router.navigateByUrl('/checkout/success');
    } catch (error: any) {
        console.error('==============================');
        console.error('PAYMENT / ORDER ERROR');
        console.error(error);
        console.error('==============================');
        this.snackbar.error(
            error?.message || 'Something went wrong'
        );
    } finally {

        this.loading = false;
    }
}

  private async createOrderModel(): Promise<OrderToCreate> {
    debugger;
    const cart = this.cartService.cart();
     if (cart) {
    cart.deliveryMethodId = 2;
  }
    const shippingAddress = await this.getAddressFromStripeAddress() as ShippingAddress;
    const card = this.confirmationToken?.payment_method_preview.card;
    console.log(cart?.id);
    console.log(cart?.deliveryMethodId);
    console.log(card);
    console.log(shippingAddress);
    debugger;
    if (!cart?.id || !cart.deliveryMethodId || !card || !shippingAddress) {  
      debugger;
      throw new Error('Problem creating order');
    }

    return {
      cartId: cart.id,
      paymentSummary: {
        last4: +card.last4,
        brand: card.brand,
        expMonth: card.exp_month,
        expYear: card.exp_year
      },
      deliveryMethodId: cart.deliveryMethodId,
      shippingAddress,
      discount: this.cartService.totals()?.discount
    }
  }

  private async getAddressFromStripeAddress(): Promise<Address | ShippingAddress | null> {
    debugger;
    const result = await this.addressElement?.getValue();
    const address = result?.value.address;

    if (address) {
      return {
        name: result.value.name,
        line1: address.line1,
        line2: address.line2 || undefined,
        city: address.city,
        country: address.country,
        state: address.state,
        postalCode: address.postal_code
      }
    } else return null;
  }

  onSaveAddressCheckboxChange(event: MatCheckboxChange) {
    this.saveAddress = event.checked;
  }

  ngOnDestroy(): void {
    this.stripeService.disposeElements();
  }
}
