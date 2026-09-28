import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);

  /** GET /api/v1/users/getMe – fetch the authenticated user's profile */
  getLoggedInUser(): Observable<any> {
    return this.http.get(`${environment.baseUrl}/users/getMe`);
  }

  changePassword(data: { currentPassword: string; password: string; rePassword: string }): Observable<any> {
    return this.http.put(`${environment.baseUrl}/users/changeMyPassword`, data);
  }

  updateUserData(data: { name: string; email: string; phone: string }): Observable<any> {
    return this.http.put(`${environment.baseUrl}/users/updateMe`, data);
  }
}
