import { inject, Injectable, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { IAuthResponse, IUser } from '../models/api.interface';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  currentUser: WritableSignal<IUser | null> = signal(null);
  isLoggedIn: WritableSignal<boolean> = signal(false);

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('userToken');
      if (token) {
        this.isLoggedIn.set(true);
        // Decode user from JWT payload
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          this.currentUser.set({ name: payload.name || '', email: payload.email || '', role: payload.role || 'user', _id: payload.id || payload._id });
        } catch {}
      }
    }
  }

  register(userData: {
    name: string;
    email: string;
    password: string;
    rePassword: string;
    phone: string;
  }): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>(
      `${environment.baseUrl}/auth/signup`,
      userData
    );
  }

  login(credentials: {
    email: string;
    password: string;
  }): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>(
      `${environment.baseUrl}/auth/signin`,
      credentials
    ).pipe(
      tap((res: any) => {
        if (res.token) {
          this.saveToken(res.token);
        }
        if (res.user) {
          this.currentUser.set(res.user);
        }
      })
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${environment.baseUrl}/auth/forgotPasswords`, {
      email,
    });
  }

  verifyResetCode(resetCode: string): Observable<any> {
    return this.http.post(`${environment.baseUrl}/auth/verifyResetCode`, {
      resetCode,
    });
  }

  resetPassword(email: string, newPassword: string): Observable<any> {
    return this.http.put(`${environment.baseUrl}/auth/resetPassword`, {
      email,
      newPassword,
    });
  }

  saveToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('userToken', token);
      this.isLoggedIn.set(true);
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.currentUser.set({ name: payload.name || '', email: payload.email || '', role: payload.role || 'user', _id: payload.id || payload._id });
      } catch {}
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('userToken');
    }
    return null;
  }

  getUserId(): string | null {
    return this.currentUser()?._id || null;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('userToken');
    }
    this.isLoggedIn.set(false);
    this.currentUser.set(null);
  }
}
