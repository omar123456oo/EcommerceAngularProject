import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrdersService } from '../../core/services/orders.service';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { ICart } from '../../core/models/api.interface';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ordersService = inject(OrdersService);
  private cartService = inject(CartService);
  private toastr = inject(ToastrService);

  cartId = signal('');
  isLoading = signal(false);
  isCartLoading = signal(true);
  paymentMethod = signal<'cash' | 'online'>('cash');
  cart = signal<ICart | null>(null);

  checkoutForm = new FormGroup({
    details: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]),
    city: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.cartId.set(params['cartId']);
    });
    this.loadCart();
  }

  loadCart(): void {
    this.isCartLoading.set(true);
    this.cartService.getUserCart().subscribe({
      next: (res) => {
        this.cart.set(res.data);
        this.isCartLoading.set(false);
      },
      error: () => this.isCartLoading.set(false),
    });
  }

  getSubtotal(): number {
    return this.cart()?.totalCartPrice ?? 0;
  }

  get detailsCtrl() { return this.checkoutForm.get('details')!; }
  get phoneCtrl() { return this.checkoutForm.get('phone')!; }
  get cityCtrl() { return this.checkoutForm.get('city')!; }

  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    const shippingAddress = this.checkoutForm.value as any;

    if (this.paymentMethod() === 'cash') {
      this.ordersService.createCashOrder(this.cartId(), shippingAddress).subscribe({
        next: () => {
          this.toastr.success('Order placed successfully!', 'Order Confirmed');
          this.cartService.cartCount.set(0);
          this.router.navigate(['/orders']);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.toastr.error(err.error?.message || 'Order failed', 'Error');
          this.isLoading.set(false);
        },
      });
    } else {
      this.ordersService.createOnlinePaymentOrder(this.cartId(), shippingAddress).subscribe({
        next: (res) => {
          if (res.session?.url) {
            window.location.href = res.session.url;
          }
          this.isLoading.set(false);
        },
        error: (err) => {
          this.toastr.error(err.error?.message || 'Payment setup failed', 'Error');
          this.isLoading.set(false);
        },
      });
    }
  }
}
