import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private spinner = inject(NgxSpinnerService);

  isLoading = signal(false);
  showPassword = signal(false);
  serverError = signal('');

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  get emailCtrl() { return this.loginForm.get('email')!; }
  get passwordCtrl() { return this.loginForm.get('password')!; }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.serverError.set('');
    this.spinner.show();

    this.authService.login(this.loginForm.value as any).subscribe({
      next: (res) => {
        if (res.token) {
          this.authService.saveToken(res.token);
          this.cartService.loadCartCount();
          this.wishlistService.mergeGuestWishlist();
          this.toastr.success('Welcome back!', 'Login Successful');
          this.router.navigate(['/']);
        }
        this.isLoading.set(false);
        this.spinner.hide();
      },
      error: (err) => {
        this.serverError.set(err.error?.message || 'Invalid email or password');
        this.isLoading.set(false);
        this.spinner.hide();
      },
    });
  }
}
