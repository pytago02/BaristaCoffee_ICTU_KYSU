import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlbackendService } from './urlbackend.service';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class IngredientsService {
  private apiUrl: string;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private urlbackendService: UrlbackendService,
    private auth: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.apiUrl = `${this.urlbackendService.urlBackend}/ingredients`;
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // Lấy tất cả nguyên liệu
  getAllIngredients(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAllIngredients`, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  // Lấy nguyên liệu theo ID
  getIngredientById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/getIngredientById/${id}`, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  // Tạo nguyên liệu mới (có thể có ảnh -> FormData)
  createIngredient(data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/createIngredient`, data, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  // Cập nhật nguyên liệu (có thể có ảnh -> FormData)
  updateIngredient(id: number, data: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateIngredient/${id}`, data, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  // Xóa nguyên liệu (soft delete)
  deleteIngredient(id: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/deleteIngredient/${id}`,
      {},
      {
        headers: this.auth.getAuthHeaders(),
      }
    );
  }

  updateImage(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.put(`${this.apiUrl}/updateImage/${id}`, formData, {
      headers: this.auth.getAuthHeaders(),
    });
  }
}
