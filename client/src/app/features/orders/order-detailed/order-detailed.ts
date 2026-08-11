import { Component, inject, OnInit, signal } from '@angular/core';
import { OrderService } from '../../../core/services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../../core/services/account.service';
import { Order } from '../../../shared/models/order';
import { MatCardModule } from '@angular/material/card';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AddressPipe } from '../../../shared/pipes/address-pipe';
import { MatButton } from '@angular/material/button';
import { PaymentCardPipe } from '../../../shared/pipes/payment-card.pipe';


@Component({
  selector: 'app-order-detailed',
  imports: [
    MatCardModule,
    MatButton,
    DatePipe,
    CurrencyPipe,
    AddressPipe,
    PaymentCardPipe
  ],
  templateUrl: './order-detailed.html',
  styleUrl: './order-detailed.scss',
})
export class OrderDetailed implements OnInit {
  private orderService = inject(OrderService);
  private activatedRoute = inject(ActivatedRoute);
  private accountService = inject(AccountService);
  //private adminService = inject(AdminService);
  private router = inject(Router);
  order = signal<Order | null>(null);
  //order?: Order;
  
   buttonText = this.accountService.isAdmin()
    ? 'Return to admin'
    : 'Return to orders';

  ngOnInit(): void {
    this.loadOrder();
  }

  

  loadOrder() {
    debugger;
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) return;
    this.orderService.getOrderDetailed(+id).subscribe({
      next: order => this.order.set(order)
    });
  }

   onReturnClick() {
    this.accountService.isAdmin()
      ? this.router.navigateByUrl('/admin')
      : this.router.navigateByUrl('/orders');
  }

}

