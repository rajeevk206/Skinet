import { Component, inject, OnInit, signal } from '@angular/core';
import { ShopService } from '../../../core/services/shop.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../shared/models/product';
import { CurrencyPipe, JsonPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDivider } from '@angular/material/divider';

import { MatFormField, MatLabel } from '@angular/material/form-field';

@Component({
  selector: 'app-product-details',
   standalone: true,
  imports: [
    CurrencyPipe,
    JsonPipe,
    MatButton,
    MatIcon,
    MatFormField,
    MatInput,
    MatLabel,
    MatDivider,
    FormsModule
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails implements OnInit {
 private shopService = inject(ShopService)
 private activatedRoute = inject(ActivatedRoute)
 //product?: Product
 product = signal<Product | null>(null);
 quantityInCart = 0;
  quantity = 1;

  ngOnInit(): void {
     console.log('ProductDetails Loaded');
    this.loadProduct();
  }

  loadProduct() {
  debugger;
  const id = this.activatedRoute.snapshot.paramMap.get('id');
   if (!id) return;
  this.shopService.getProduct(+id).subscribe({
    next: product =>  this.product.set(product),
        error: error => console.log(error),
    });
}

  updateCart() {
    // if (!this.product) return;
    // if (this.quantity > this.quantityInCart) {
    //   const itemsToAdd = this.quantity - this.quantityInCart;
    //   this.quantityInCart += itemsToAdd;
    //   this.cartService.addItemToCart(this.product, itemsToAdd);
    // } else {
    //   const itemsToRemove = this.quantityInCart - this.quantity;
    //   this.quantityInCart -= itemsToRemove;
    //   this.cartService.removeItemFromCart(this.product.id, itemsToRemove);
    // }
  }
}
