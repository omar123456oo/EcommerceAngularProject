import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IProduct, IResponse } from '../../core/models/api.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private http = inject(HttpClient);

  getAllProducts(params?: {
    page?: number;
    limit?: number;
    sort?: string;
    keyword?: string;
    'price[gte]'?: number;
    'price[lte]'?: number;
    'category[in]'?: string;
    'brand[in]'?: string;
  }): Observable<IResponse<IProduct>> {
    return this.http.get<IResponse<IProduct>>(
      `${environment.baseUrl}/products`,
      { params: params as any }
    );
  }

  getProductById(id: string): Observable<{ data: IProduct }> {
    return this.http.get<{ data: IProduct }>(
      `${environment.baseUrl}/products/${id}`
    );
  }

  getProductReviews(productId: string): Observable<IResponse<any>> {
    return this.http.get<IResponse<any>>(
      `${environment.baseUrl}/products/${productId}/reviews`
    );
  }

  addProductReview(
    productId: string,
    reviewData: { review: string; rating: number }
  ): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/products/${productId}/reviews`,
      reviewData
    );
  }
}
