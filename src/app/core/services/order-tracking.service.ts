import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const STORAGE_KEY = 'receivedOrders';

/**
 * The Route Misr API this app talks to has no customer-facing endpoint to
 * confirm delivery — only `isDelivered`, which only an admin can flip.
 * "Received" is therefore tracked locally per browser, not synced server-side.
 */
@Injectable({
  providedIn: 'root',
})
export class OrderTrackingService {
  private platformId = inject(PLATFORM_ID);

  private readIds(): Set<string> {
    if (!isPlatformBrowser(this.platformId)) return new Set<string>();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? new Set<string>(JSON.parse(raw)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  }

  isReceived(orderId: string): boolean {
    return this.readIds().has(orderId);
  }

  markReceived(orderId: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const ids = this.readIds();
    ids.add(orderId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
  }
}
