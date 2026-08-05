import { Routes } from '@angular/router';
import { Shop } from './features/shop/shop';
import { Home } from './features/home/home';
import { ProductDetails } from './features/shop/product-details/product-details';
import { TestError } from './features/test-error/test-error';
import { NotFound } from './shared/components/not-found/not-found';
import { ServerError } from './shared/components/server-error/server-error';
import { CartComponent } from './features/cart-component/cart-component';
import { Checkoutcomponent } from './features/checkoutcomponent/checkoutcomponent';

export const routes: Routes = [
    {path: "", component: Home},
    {path: "shop", component: Shop},
    {path: "shop/:id", component: ProductDetails},
    {path: "cart", component: CartComponent },
    {path: "checkout", component: Checkoutcomponent },
    {path: "test-error", component: TestError},
    {path: "not-found", component: NotFound},
    {path: "server-error", component: ServerError},
    {path: "**", redirectTo: 'not-found', pathMatch: "full"}
];
