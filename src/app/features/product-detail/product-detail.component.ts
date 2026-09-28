import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../shared/services/products.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { IProduct } from '../../core/models/api.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productsService = inject(ProductsService);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  authService = inject(AuthService);
  private toastr = inject(ToastrService);

  Math = Math;

  product = signal<IProduct | null>(null);
  relatedProducts = signal<IProduct[]>([]);
  reviews = signal<any[]>([]);
  isLoading = signal(true);
  isCartLoading = signal(false);
  isWishlistLoading = signal(false);
  selectedImage = signal('');
  quantity = signal(1);

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.loadProduct(params['id']);
      }
    });
  }

  loadProduct(id: string): void {
    this.isLoading.set(true);
    this.productsService.getProductById(id).subscribe({
      next: (res) => {
        this.product.set(res.data);
        this.selectedImage.set(res.data.imageCover || '');
        this.isLoading.set(false);
        this.loadRelated(res.data.category?._id);
        this.loadReviews(id);
      },
      error: () => this.isLoading.set(false),
    });
  }

  loadRelated(categoryId?: string): void {
    if (!categoryId) return;
    this.productsService.getAllProducts({ 'category[in]': categoryId, limit: 8 }).subscribe({
      next: (res) => {
        this.relatedProducts.set(res.data.filter((p: IProduct) => p._id !== this.product()?._id));
      },
    });
  }

  loadReviews(productId: string): void {
    this.productsService.getProductReviews(productId).subscribe({
      next: (res) => this.reviews.set(res.data),
    });
  }

  addToCart(): void {
    if (!this.authService.isLoggedIn()) {
      this.toastr.warning('Please login to add to cart', 'Login Required');
      return;
    }
    this.isCartLoading.set(true);
    this.cartService.addToCart(this.product()!._id!).subscribe({
      next: () => {
        this.toastr.success('Added to cart!', 'Cart');
        this.isCartLoading.set(false);
      },
      error: () => this.isCartLoading.set(false),
    });
  }

  toggleWishlist(): void {
    if (!this.authService.isLoggedIn()) {
      this.toastr.warning('Please login to use wishlist', 'Login Required');
      return;
    }
    this.isWishlistLoading.set(true);
    const productId = this.product()!._id!;
    const action = this.wishlistService.isInWishlist(productId)
      ? this.wishlistService.removeFromWishlist(productId)
      : this.wishlistService.addToWishlist(productId);
    action.subscribe({
      next: () => {
        this.isWishlistLoading.set(false);
        this.toastr.success(this.wishlistService.isInWishlist(productId) ? 'Removed from wishlist' : 'Added to wishlist!', 'Wishlist');
      },
      error: () => this.isWishlistLoading.set(false),
    });
  }

  isInWishlist(): boolean {
    return this.wishlistService.isInWishlist(this.product()?._id || '');
  }

  setImage(img: string): void {
    this.selectedImage.set(img);
  }

  getStars(): number[] {
    return [1, 2, 3, 4, 5];
  }

  getAllImages(): string[] {
    const p = this.product();
    if (!p) return [];
    const imgs: string[] = [];
    if (p.imageCover) imgs.push(p.imageCover);
    if (p.images && p.images.length > 0) {
      p.images.forEach((img: string) => { if (!imgs.includes(img)) imgs.push(img); });
    }
    return imgs;
  }
}
