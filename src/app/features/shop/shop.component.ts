import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../shared/services/products.service';
import { CategoriesService } from '../../core/services/categories.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { IProduct, ICategory, IBrand } from '../../core/models/api.interface';

@Component({
  selector: 'app-shop',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent implements OnInit {
  private productsService = inject(ProductsService);
  private categoriesService = inject(CategoriesService);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  Math = Math;

  products = signal<IProduct[]>([]);
  categories = signal<ICategory[]>([]);
  brands = signal<IBrand[]>([]);
  isLoading = signal(true);
  loadingCartIds = signal<Set<string>>(new Set());
  loadingWishlistIds = signal<Set<string>>(new Set());

  // Filters
  searchKeyword = signal('');
  selectedCategory = signal('');
  selectedBrand = signal('');
  sortBy = signal('');
  currentPage = signal(1);
  totalPages = signal(1);
  priceMin = signal<number | null>(null);
  priceMax = signal<number | null>(null);
  showFilters = signal(false);

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['category']) {
        this.selectedCategory.set(params['category']);
      }
      this.loadData();
    });
  }

  loadData(): void {
    this.isLoading.set(true);
    const params: any = {
      page: this.currentPage(),
      limit: 20,
    };
    if (this.searchKeyword()) params.keyword = this.searchKeyword();
    if (this.selectedCategory()) params['category[in]'] = this.selectedCategory();
    if (this.selectedBrand()) params['brand[in]'] = this.selectedBrand();
    if (this.sortBy()) params.sort = this.sortBy();
    if (this.priceMin()) params['price[gte]'] = this.priceMin();
    if (this.priceMax()) params['price[lte]'] = this.priceMax();

    this.productsService.getAllProducts(params).subscribe({
      next: (res) => {
        this.products.set(res.data);
        this.totalPages.set(res.metadata?.numberOfPages || 1);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });

    this.categoriesService.getAllCategories().subscribe((res) => this.categories.set(res.data));
    this.categoriesService.getAllBrands().subscribe((res) => this.brands.set(res.data));
  }

  applyFilters(): void {
    this.currentPage.set(1);
    this.loadData();
  }

  resetFilters(): void {
    this.searchKeyword.set('');
    this.selectedCategory.set('');
    this.selectedBrand.set('');
    this.sortBy.set('');
    this.priceMin.set(null);
    this.priceMax.set(null);
    this.currentPage.set(1);
    this.loadData();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  addToCart(productId: string, event: Event): void {
    event.preventDefault();
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
        this.toastr.success('Added to cart!', 'Cart');
        const u = new Set(this.loadingCartIds()); u.delete(productId); this.loadingCartIds.set(u);
      },
      error: () => {
        const u = new Set(this.loadingCartIds()); u.delete(productId); this.loadingCartIds.set(u);
      },
    });
  }

  toggleWishlist(product: IProduct, event: Event): void {
    event.preventDefault();
    const productId = product._id!;
    const ids = new Set(this.loadingWishlistIds());
    ids.add(productId);
    this.loadingWishlistIds.set(ids);
    const action = this.wishlistService.isInWishlist(productId)
      ? this.wishlistService.removeFromWishlist(productId)
      : this.wishlistService.addToWishlist(productId);
    action.subscribe({
      next: () => {
        const msg = this.wishlistService.isInWishlist(productId) ? 'Removed from wishlist' : 'Added to wishlist';
        this.toastr.success(msg, 'Wishlist');
        const u = new Set(this.loadingWishlistIds()); u.delete(productId); this.loadingWishlistIds.set(u);
      },
      error: () => {
        const u = new Set(this.loadingWishlistIds()); u.delete(productId); this.loadingWishlistIds.set(u);
      },
    });
  }

  isInWishlist(id: string): boolean { return this.wishlistService.isInWishlist(id); }
  isCartLoading(id: string): boolean { return this.loadingCartIds().has(id); }
  isWishlistLoading(id: string): boolean { return this.loadingWishlistIds().has(id); }

  getPagesArray(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }
}
