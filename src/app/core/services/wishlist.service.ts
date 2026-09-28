import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IWishlistResponse } from '../models/api.interface';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private http = inject(HttpClient);

  wishlistIds: WritableSignal<Set<string>> = signal(new Set<string>());

  getUserWishlist(): Observable<IWishlistResponse> {
    return this.http.get<IWishlistResponse>(`${environment.baseUrl}/wishlist`);
  }

  addToWishlist(productId: string): Observable<{ status: string; message: string; data: string[] }> {
    return this.http
      .post<{ status: string; message: string; data: string[] }>(`${environment.baseUrl}/wishlist`, {
        productId,
      })
      .pipe(
        tap((res) => {
          this.wishlistIds.set(new Set(res.data));
        })
      );
  }

  removeFromWishlist(productId: string): Observable<{ status: string; message: string; data: string[] }> {
    return this.http
      .delete<{ status: string; message: string; data: string[] }>(
        `${environment.baseUrl}/wishlist/${productId}`
      )
      .pipe(
        tap((res) => {
          this.wishlistIds.set(new Set(res.data));
        })
      );
  }

  loadWishlistIds(): void {
    this.getUserWishlist().subscribe({
      next: (res) => {
        const ids = new Set(res.data.map((item) => item._id!));
        this.wishlistIds.set(ids);
      },
      error: () => {
        this.wishlistIds.set(new Set<string>());
      },
    });
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistIds().has(productId);
  }
}
