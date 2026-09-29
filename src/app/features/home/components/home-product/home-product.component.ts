import {
  Component, effect, inject, OnInit, OnDestroy, signal, WritableSignal, ElementRef, ViewChild
} from '@angular/core';
import { ProductsService } from '../../../../shared/services/products.service';
import { CategoriesService } from '../../../../core/services/categories.service';
import { IProduct, ICategory, IResponse } from '../../../../core/models/api.interface';
import { CartService } from '../../../../core/services/cart.service';
import { WishlistService } from '../../../../core/services/wishlist.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-home-product',
  imports: [CommonModule, RouterLink, ScrollRevealDirective],
  templateUrl: './home-product.component.html',
  styleUrl: './home-product.component.css',
})
export class HomeProductComponent implements OnInit, OnDestroy {
  Math = Math;
  private productsService = inject(ProductsService);
  private categoriesService = inject(CategoriesService);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  @ViewChild('flashScroll') flashScrollRef!: ElementRef;
  @ViewChild('catScroll') catScrollRef!: ElementRef;
  @ViewChild('exploreScroll') exploreScrollRef!: ElementRef;

  flashProducts: WritableSignal<IProduct[]> = signal([]);
  bestSellingProducts: WritableSignal<IProduct[]> = signal([]);
  exploreProducts: WritableSignal<IProduct[]> = signal([]);
  categories: WritableSignal<ICategory[]> = signal([]);
  isLoading = signal(true);
  isCatLoading = signal(true);
  loadingCartIds = signal<Set<string>>(new Set());
  loadingWishlistIds = signal<Set<string>>(new Set());
  activeCatIndex = -1;

  countdown = { days: '03', hours: '23', minutes: '19', seconds: '56' };
  private countdownInterval: any;

  ngOnInit(): void {
    this.getAllProducts();
    this.getCategories();
    this.startCountdown();
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
  }

  startCountdown(): void {
    let target = new Date().getTime() + (3 * 24 * 60 * 60 + 23 * 3600 + 19 * 60 + 56) * 1000;
    this.countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff <= 0) { clearInterval(this.countdownInterval); return; }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      this.countdown = {
        days: String(d).padStart(2, '0'),
        hours: String(h).padStart(2, '0'),
        minutes: String(m).padStart(2, '0'),
        seconds: String(s).padStart(2, '0'),
      };
    }, 1000);
  }

  getAllProducts(): void {
    this.productsService.getAllProducts({ limit: 40 }).subscribe({
      next: (r: IResponse<IProduct>) => {
        const all = r.data;
        // Flash sales: products with discount
        this.flashProducts.set(all.filter(p => p.priceAfterDiscount).slice(0, 10));
        // Best selling: sort by sold
        this.bestSellingProducts.set([...all].sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 4));
        // Explore: random 8
        this.exploreProducts.set(all.slice(8, 16));
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  getCategories(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categories.set(res.data.slice(0, 8));
        this.isCatLoading.set(false);
      },
      error: () => this.isCatLoading.set(false),
    });
  }

  isNewProduct(product: IProduct): boolean {
    if (!product.createdAt) return false;
    const diff = new Date().getTime() - new Date(product.createdAt).getTime();
    return diff < 30 * 24 * 60 * 60 * 1000;
  }

  scrollFlashLeft(): void {
    this.flashScrollRef?.nativeElement.scrollBy({ left: -240, behavior: 'smooth' });
  }
  scrollFlashRight(): void {
    this.flashScrollRef?.nativeElement.scrollBy({ left: 240, behavior: 'smooth' });
  }
  scrollCatLeft(): void {
    this.catScrollRef?.nativeElement.scrollBy({ left: -200, behavior: 'smooth' });
  }
  scrollCatRight(): void {
    this.catScrollRef?.nativeElement.scrollBy({ left: 200, behavior: 'smooth' });
  }
  scrollExploreLeft(): void {
    this.exploreScrollRef?.nativeElement.scrollBy({ left: -240, behavior: 'smooth' });
  }
  scrollExploreRight(): void {
    this.exploreScrollRef?.nativeElement.scrollBy({ left: 240, behavior: 'smooth' });
  }

  addToCart(productId: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.authService.isLoggedIn()) {
      this.toastr.warning('Please create an account to add to cart', 'Login Required');
      this.router.navigate(['/register']);
      return;
    }
    const ids = new Set(this.loadingCartIds());
    ids.add(productId);
    this.loadingCartIds.set(ids);
    this.cartService.addToCart(productId).subscribe({
      next: () => {
        this.toastr.success('Product added to cart!', 'Cart Updated');
        const u = new Set(this.loadingCartIds()); u.delete(productId); this.loadingCartIds.set(u);
      },
      error: () => {
        this.toastr.error('Failed to add product', 'Error');
        const u = new Set(this.loadingCartIds()); u.delete(productId); this.loadingCartIds.set(u);
      },
    });
  }

  toggleWishlist(product: IProduct, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const productId = product._id!;
    if (this.wishlistService.isInWishlist(productId)) {
      this.wishlistService.removeFromWishlist(productId).subscribe({
        next: () => this.toastr.info('Removed from wishlist', 'Wishlist'),
      });
    } else {
      this.wishlistService.addToWishlist(productId).subscribe({
        next: () => this.toastr.success('Added to wishlist!', 'Wishlist'),
      });
    }
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistService.isInWishlist(productId);
  }

  isCartLoading(productId: string): boolean {
    return this.loadingCartIds().has(productId);
  }

  isWishlistLoading(productId: string): boolean {
    return this.loadingWishlistIds().has(productId);
  }

  getStarArray(rating: number): number[] {
    return [1, 2, 3, 4, 5];
  }
}
