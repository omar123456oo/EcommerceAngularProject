import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((f) => f.HomeComponent),
  },
  {
    path: 'shop',
    loadComponent: () =>
      import('./features/shop/shop.component').then((f) => f.ShopComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then(
        (f) => f.LoginComponent
      ),
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/register/register.component').then(
        (f) => f.RegisterComponent
      ),
    canActivate: [guestGuard],
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./features/categories/categories.component').then(
        (f) => f.CategoriesComponent
      ),
  },
  {
    path: 'brands',
    loadComponent: () =>
      import('./features/brands/brands.component').then(
        (f) => f.BrandsComponent
      ),
  },
  {
    path: 'wishlist',
    loadComponent: () =>
      import('./features/wishlist/wishlist.component').then(
        (f) => f.WishlistComponent
      ),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./features/cart/cart.component').then((f) => f.CartComponent),
    canActivate: [authGuard],
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./features/product-detail/product-detail.component').then(
        (f) => f.ProductDetailComponent
      ),
  },
  {
    path: 'checkout/:cartId',
    loadComponent: () =>
      import('./features/checkout/checkout.component').then(
        (f) => f.CheckoutComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./features/orders/orders.component').then(
        (f) => f.OrdersComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'orders/:id',
    loadComponent: () =>
      import('./features/order-detail/order-detail.component').then(
        (f) => f.OrderDetailComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile.component').then(
        (f) => f.ProfileComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./features/forgot-password/forgot-password.component').then(
        (f) => f.ForgotPasswordComponent
      ),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./features/about/about.component').then(
        (f) => f.AboutComponent
      ),
  },
  {
    path: 'contact-us',
    loadComponent: () =>
      import('./features/contact/contact.component').then(
        (f) => f.ContactComponent
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./core/layout/components/notfound/notfound.component').then(
        (f) => f.NotfoundComponent
      ),
  },
];
