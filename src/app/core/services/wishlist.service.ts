import { inject, Injectable, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { IWishlistResponse } from '../models/api.interface';
import { AuthService } from './auth.service';

const GUEST_WISHLIST_KEY = 'guestWishlist';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);

  wishlistIds: WritableSignal<Set<string>> = signal(new Set<string>());

  constructor() {
    this.loadWishlistIds();
  }

  private readGuestIds(): Set<string> {
    if (!isPlatformBrowser(this.platformId)) return new Set<string>();
    try {
      const raw = localStorage.getItem(GUEST_WISHLIST_KEY);
      return raw ? new Set<string>(JSON.parse(raw)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  }

  private saveGuestIds(ids: Set<string>): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(Array.from(ids)));
  }

  getUserWishlist(): Observable<IWishlistResponse> {
    return this.http.get<IWishlistResponse>(`${environment.baseUrl}/wishlist`);
  }

  addToWishlist(productId: string): Observable<{ status: string; message: string; data: string[] }> {
    if (!this.authService.isLoggedIn()) {
      const ids = this.readGuestIds();
      ids.add(productId);
      this.saveGuestIds(ids);
      this.wishlistIds.set(ids);
      return of({ status: 'success', message: 'Added to wishlist', data: Array.from(ids) });
    }
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
    if (!this.authService.isLoggedIn()) {
      const ids = this.readGuestIds();
      ids.delete(productId);
      this.saveGuestIds(ids);
      this.wishlistIds.set(ids);
      return of({ status: 'success', message: 'Removed from wishlist', data: Array.from(ids) });
    }
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
    if (!this.authService.isLoggedIn()) {
      this.wishlistIds.set(this.readGuestIds());
      return;
    }
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

  /** Pushes any locally-saved guest wishlist items onto the account after login, then clears the guest copy. */
  mergeGuestWishlist(): void {
    const guestIds = Array.from(this.readGuestIds());
    if (guestIds.length === 0) {
      this.loadWishlistIds();
      return;
    }
    forkJoin(
      guestIds.map((productId) =>
        this.http
          .post<{ status: string; message: string; data: string[] }>(`${environment.baseUrl}/wishlist`, {
            productId,
          })
          .pipe(catchError(() => of(null)))
      )
    ).subscribe(() => {
      this.saveGuestIds(new Set<string>());
      this.loadWishlistIds();
    });
  }
}
