import { Component, inject, signal, HostListener, ElementRef } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';
import { WishlistService } from '../../../services/wishlist.service';
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
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private el = inject(ElementRef);

  isMobileMenuOpen = signal(false);
  isUserMenuOpen = signal(false);
  searchQuery = '';

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
