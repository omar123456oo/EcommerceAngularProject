import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IBrand, ICategory, IResponse } from '../models/api.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private http = inject(HttpClient);

  getAllCategories(): Observable<IResponse<ICategory>> {
    return this.http.get<IResponse<ICategory>>(
      `${environment.baseUrl}/categories`
    );
  }

  getCategoryById(id: string): Observable<{ data: ICategory }> {
    return this.http.get<{ data: ICategory }>(
      `${environment.baseUrl}/categories/${id}`
    );
  }

  getCategorySubcategories(categoryId: string): Observable<IResponse<any>> {
    return this.http.get<IResponse<any>>(
      `${environment.baseUrl}/categories/${categoryId}/subcategories`
    );
  }

  getAllSubcategories(): Observable<IResponse<any>> {
    return this.http.get<IResponse<any>>(
      `${environment.baseUrl}/subcategories`
    );
  }

  getAllBrands(): Observable<IResponse<IBrand>> {
    return this.http.get<IResponse<IBrand>>(`${environment.baseUrl}/brands`);
  }

  getBrandById(id: string): Observable<{ data: IBrand }> {
    return this.http.get<{ data: IBrand }>(
      `${environment.baseUrl}/brands/${id}`
    );
  }
}
