import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ICartResponse } from '../models/api.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private http = inject(HttpClient);

  cartCount: WritableSignal<number> = signal(0);

  getUserCart(): Observable<ICartResponse> {
    return this.http.get<ICartResponse>(`${environment.baseUrlV2}/cart`);
  }

  addToCart(productId: string): Observable<ICartResponse> {
    return this.http
      .post<ICartResponse>(`${environment.baseUrlV2}/cart`, {
        productId,
      })
      .pipe(
        tap((res) => {
          this.cartCount.set(res.numOfCartItems);
        })
      );
  }

  updateCartItemCount(
    productId: string,
    count: number
  ): Observable<ICartResponse> {
    return this.http
      .put<ICartResponse>(`${environment.baseUrlV2}/cart/${productId}`, {
        count,
      })
      .pipe(
        tap((res) => {
          this.cartCount.set(res.numOfCartItems);
        })
      );
  }

  removeCartItem(productId: string): Observable<ICartResponse> {
    return this.http
      .delete<ICartResponse>(`${environment.baseUrlV2}/cart/${productId}`)
      .pipe(
        tap((res) => {
          this.cartCount.set(res.numOfCartItems);
        })
      );
  }

  clearCart(): Observable<any> {
    return this.http.delete(`${environment.baseUrlV2}/cart`).pipe(
      tap(() => {
        this.cartCount.set(0);
      })
    );
  }

  applyCoupon(couponName: string): Observable<ICartResponse> {
    return this.http.put<ICartResponse>(
      `${environment.baseUrlV2}/cart/applyCoupon`,
      { couponName }
    );
  }

  loadCartCount(): void {
    this.getUserCart().subscribe({
      next: (res) => {
        this.cartCount.set(res.numOfCartItems);
      },
      error: () => {
        this.cartCount.set(0);
      },
    });
  }
}
