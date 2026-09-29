import { Component, inject, signal, HostListener, ElementRef, effect, WritableSignal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';
import { WishlistService } from '../../../services/wishlist.service';
import { ProfilePhotoService } from '../../../services/profile-photo.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, FormsModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  authService = inject(AuthService);
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  profilePhotoService = inject(ProfilePhotoService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private el = inject(ElementRef);

  isMobileMenuOpen = signal(false);
  isUserMenuOpen = signal(false);
  searchQuery = '';

  wishlistBump = signal(false);
  cartBump = signal(false);
  private prevWishlistCount = -1;
  private prevCartCount = -1;

  constructor() {
    effect(() => {
      const count = this.wishlistService.wishlistIds().size;
      if (this.prevWishlistCount !== -1 && count !== this.prevWishlistCount) {
        this.bump(this.wishlistBump);
      }
      this.prevWishlistCount = count;
    });
    effect(() => {
      const count = this.cartService.cartCount();
      if (this.prevCartCount !== -1 && count !== this.prevCartCount) {
        this.bump(this.cartBump);
      }
      this.prevCartCount = count;
    });
  }

  private bump(target: WritableSignal<boolean>): void {
    target.set(false);
    setTimeout(() => {
      target.set(true);
      setTimeout(() => target.set(false), 400);
    });
  }

  get wishlistCount(): () => number {
    return () => this.wishlistService.wishlistIds().size;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen.update((v) => !v);
  }

  closeUserMenu(): void {
    this.isUserMenuOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isUserMenuOpen.set(false);
      this.isMobileMenuOpen.set(false);
    }
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/shop'], { queryParams: { keyword: this.searchQuery.trim() } });
      this.searchQuery = '';
      this.closeMobileMenu();
    }
  }

  logout(): void {
    this.authService.logout();
    this.toastr.success('You have been logged out', 'Goodbye!');
    this.router.navigate(['/login']);
    this.closeUserMenu();
  }
}
