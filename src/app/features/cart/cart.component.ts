import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { ICart, ICartItem } from '../../core/models/api.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private toastr = inject(ToastrService);

  cart = signal<ICart | null>(null);
  isLoading = signal(true);
  updatingIds = signal<Set<string>>(new Set());
  couponCode = signal('');
  isCouponLoading = signal(false);

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading.set(true);
    this.cartService.getUserCart().subscribe({
      next: (res) => {
        this.cart.set(res.data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  updateQuantity(productId: string, count: number): void {
    if (count < 1) {
      this.removeItem(productId);
      return;
    }
    const ids = new Set(this.updatingIds());
    ids.add(productId);
    this.updatingIds.set(ids);
    this.cartService.updateCartItemCount(productId, count).subscribe({
      next: (res) => {
        this.cart.set(res.data);
        const u = new Set(this.updatingIds()); u.delete(productId); this.updatingIds.set(u);
      },
      error: () => {
        const u = new Set(this.updatingIds()); u.delete(productId); this.updatingIds.set(u);
      },
    });
  }

  removeItem(productId: string): void {
    const ids = new Set(this.updatingIds());
    ids.add(productId);
    this.updatingIds.set(ids);
    this.cartService.removeCartItem(productId).subscribe({
      next: (res) => {
        this.cart.set(res.data);
        this.toastr.info('Item removed from cart', 'Cart');
        const u = new Set(this.updatingIds()); u.delete(productId); this.updatingIds.set(u);
      },
      error: () => {
        const u = new Set(this.updatingIds()); u.delete(productId); this.updatingIds.set(u);
      },
    });
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: () => {
        this.cart.set(null);
        this.toastr.info('Cart cleared', 'Cart');
      },
    });
  }

  applyCoupon(): void {
    if (!this.couponCode()) return;
    this.isCouponLoading.set(true);
    this.cartService.applyCoupon(this.couponCode()).subscribe({
      next: (res) => {
        this.cart.set(res.data);
        this.toastr.success('Coupon applied!', 'Discount Applied');
        this.isCouponLoading.set(false);
      },
      error: () => {
        this.toastr.error('Invalid or expired coupon', 'Coupon Error');
        this.isCouponLoading.set(false);
      },
    });
  }

  isUpdating(productId: string): boolean {
    return this.updatingIds().has(productId);
  }

  getCartTotal(): number {
    return this.cart()?.totalPriceAfterDiscount || this.cart()?.totalCartPrice || 0;
  }

  getOriginalTotal(): number {
    return this.cart()?.totalCartPrice || 0;
  }

  getSavings(): number {
    const original = this.getOriginalTotal();
    const after = this.getCartTotal();
    return original > after ? original - after : 0;
  }
}
