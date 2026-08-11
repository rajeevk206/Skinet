import { Routes } from '@angular/router';
import { Shop } from './features/shop/shop';
import { Home } from './features/home/home';
import { ProductDetails } from './features/shop/product-details/product-details';
import { TestError } from './features/test-error/test-error';
import { NotFound } from './shared/components/not-found/not-found';
import { ServerError } from './shared/components/server-error/server-error';
import { CartComponent } from './features/cart-component/cart-component';
import { Checkoutcomponent } from './features/checkoutcomponent/checkoutcomponent';
import { Login } from './features/account/login/login';
import { Register } from './features/account/register/register';
import { authGuard } from './core/guards/auth-guard';
import { emptyCartGuardGuard } from './core/guards/empty-cart.guard-guard';
import { CheckoutSuccess } from './features/checkout/checkout-success/checkout-success';
import { OrderDetailed } from './features/orders/order-detailed/order-detailed';
import { Ordercomponent } from './features/orders/ordercomponent';
import { orderCompleteGuard } from './core/guards/order-complete-guard';

export const routes: Routes = [
    {path: "", component: Home},
    {path: "shop", component: Shop},
    {path: "shop/:id", component: ProductDetails},
    {path: "cart", component: CartComponent },
    {path: "checkout", component: Checkoutcomponent, canActivate: [authGuard, emptyCartGuardGuard] },
    {path: "checkout/success", component: CheckoutSuccess, 
            canActivate: [authGuard, orderCompleteGuard ]},  //orderCompleteGuard
    {path: "orders", component: Ordercomponent, canActivate: [authGuard]},
    {path: "orders/:id", component: OrderDetailed, canActivate: [authGuard]},
    {path: "account/login", component: Login },
    {path: "account/register", component: Register },
    {path: "test-error", component: TestError},
    {path: "not-found", component: NotFound},
    {path: "server-error", component: ServerError},
    {path: "**", redirectTo: 'not-found', pathMatch: "full"}
];
