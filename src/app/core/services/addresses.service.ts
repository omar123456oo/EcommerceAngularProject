import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddressesService {
  private http = inject(HttpClient);

  getAddresses(): Observable<any> {
    return this.http.get(`${environment.baseUrl}/addresses`);
  }

  getAddress(id: string): Observable<any> {
    return this.http.get(`${environment.baseUrl}/addresses/${id}`);
  }

  addAddress(address: { name: string; details: string; phone: string; city: string; }): Observable<any> {
    return this.http.post(`${environment.baseUrl}/addresses`, address);
  }

  removeAddress(id: string): Observable<any> {
    return this.http.delete(`${environment.baseUrl}/addresses/${id}`);
  }
}
