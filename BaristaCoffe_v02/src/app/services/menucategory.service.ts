import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlbackendService } from './urlbackend.service';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class MenuCategoryService {
  private apiUrl: string;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private urlbackendService: UrlbackendService,
    private auth: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.apiUrl = `${this.urlbackendService.urlBackend}/menuCategory`;
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  getAllCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAllMenuCategory`, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  createCategory(data: { menu_category_name: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/createMenuCategory`, data, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  updateCategory(id: number, menu_category_name: string): Observable<any> {
    const payload = { menu_category_name };
    return this.http.put(`${this.apiUrl}/updateMenuCategory/${id}`, payload, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/deleteMenuCategory/${id}`,
      {},
      {
        headers: this.auth.getAuthHeaders(),
      }
    );
  }
}
