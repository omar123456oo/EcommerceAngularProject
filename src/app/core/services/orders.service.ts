import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IOrder, IShippingAddress } from '../models/api.interface';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private http = inject(HttpClient);

  createCashOrder(
    cartId: string,
    shippingAddress: IShippingAddress
  ): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/orders/${cartId}`,
      { shippingAddress }
    );
  }

  createOnlinePaymentOrder(
    cartId: string,
    shippingAddress: IShippingAddress
  ): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/orders/checkout-session/${cartId}?url=http://localhost:4200`,
      { shippingAddress }
    );
  }

  getUserOrders(userId: string): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(
      `${environment.baseUrl}/orders/user/${userId}`
    );
  }

  getAllOrders(): Observable<any> {
    return this.http.get(`${environment.baseUrl}/orders`);
  }

  getOrderById(orderId: string): Observable<any> {
    return this.http.get(`${environment.baseUrl}/orders/${orderId}`);
  }
}
