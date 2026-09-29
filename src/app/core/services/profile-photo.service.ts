import { effect, inject, Injectable, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';

const KEY_PREFIX = 'userPhoto_';

/**
 * The Route Misr API has no photo-upload endpoint for user accounts, so the
 * profile picture is stored client-side only (base64, keyed per user id),
 * following the same local-only fallback used by wishlist/order-tracking.
 */
@Injectable({
  providedIn: 'root',
})
export class ProfilePhotoService {
  private platformId = inject(PLATFORM_ID);
  private authService = inject(AuthService);

  photo: WritableSignal<string | null> = signal(null);

  constructor() {
    effect(() => {
      const userId = this.authService.currentUser()?._id;
      this.photo.set(userId ? this.readPhoto(userId) : null);
    });
  }

  private key(userId: string): string {
    return `${KEY_PREFIX}${userId}`;
  }

  private readPhoto(userId: string): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    try {
      return localStorage.getItem(this.key(userId));
    } catch {
      return null;
    }
  }

  setPhoto(userId: string, dataUrl: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem(this.key(userId), dataUrl);
    this.photo.set(dataUrl);
  }

  removePhoto(userId: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem(this.key(userId));
    this.photo.set(null);
  }
}
