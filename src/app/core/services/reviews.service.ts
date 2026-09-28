import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  private http = inject(HttpClient);

  getAllReviews(): Observable<any> {
    return this.http.get(`${environment.baseUrl}/reviews`);
  }

  getReviewById(id: string): Observable<any> {
    return this.http.get(`${environment.baseUrl}/reviews/${id}`);
  }

  updateReview(id: string, data: { review: string; rating: number }): Observable<any> {
    return this.http.put(`${environment.baseUrl}/reviews/${id}`, data);
  }

  deleteReview(id: string): Observable<any> {
    return this.http.delete(`${environment.baseUrl}/reviews/${id}`);
  }
}
