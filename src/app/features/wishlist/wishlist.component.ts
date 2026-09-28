import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../core/services/wishlist.service';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { IWishlistItem, IProduct } from '../../core/models/api.interface';
import { ProductsService } from '../../shared/services/products.service';

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent implements OnInit {
  private wishlistService = inject(WishlistService);
  private cartService = inject(CartService);
  private productsService = inject(ProductsService);
  private toastr = inject(ToastrService);

  Math = Math;
  items = signal<IWishlistItem[]>([]);
  isLoading = signal(true);
  loadingCartIds = signal<Set<string>>(new Set());
  removingIds = signal<Set<string>>(new Set());

  recommended = signal<IProduct[]>([]);
  isRecommendedLoading = signal(true);

  ngOnInit(): void {
    this.loadWishlist();
    this.loadRecommended();
  }

  loadRecommended(): void {
    this.isRecommendedLoading.set(true);
    this.productsService.getAllProducts({ limit: 4, sort: '-ratingsAverage' }).subscribe({
      next: (res) => {
        this.recommended.set(res.data);
        this.isRecommendedLoading.set(false);
      },
      error: () => this.isRecommendedLoading.set(false),
    });
  }

  loadWishlist(): void {
    this.isLoading.set(true);
    this.wishlistService.getUserWishlist().subscribe({
      next: (res) => {
        this.items.set(res.data);
        const ids = new Set(res.data.map((i) => i._id!));
        this.wishlistService.wishlistIds.set(ids);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  removeItem(productId: string): void {
    const ids = new Set(this.removingIds());
    ids.add(productId);
    this.removingIds.set(ids);
    this.wishlistService.removeFromWishlist(productId).subscribe({
      next: () => {
        this.items.update((items) => items.filter((i) => i._id !== productId));
        this.toastr.info('Removed from wishlist', 'Wishlist');
        const u = new Set(this.removingIds()); u.delete(productId); this.removingIds.set(u);
      },
      error: () => {
        const u = new Set(this.removingIds()); u.delete(productId); this.removingIds.set(u);
      },
    });
  }

  addToCart(productId: string): void {
    const ids = new Set(this.loadingCartIds());
    ids.add(productId);
    this.loadingCartIds.set(ids);
    this.cartService.addToCart(productId).subscribe({
      next: () => {
        this.toastr.success('Added to cart!', 'Cart');
        const u = new Set(this.loadingCartIds()); u.delete(productId); this.loadingCartIds.set(u);
      },
      error: () => {
        const u = new Set(this.loadingCartIds()); u.delete(productId); this.loadingCartIds.set(u);
      },
    });
  }
}
