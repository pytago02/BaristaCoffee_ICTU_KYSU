import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlbackendService } from './urlbackend.service';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private apiUrl: string;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private urlbackendService: UrlbackendService,
    private auth: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.apiUrl = `${this.urlbackendService.urlBackend}/menu`;
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  getAllMenu(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAllMenu`, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  getMenuById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/getMenuById/${id}`, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  createMenu(data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/createMenu`, data, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  updateMenu(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateMenu/${id}`, data, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  changeIsActive(id: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/changeIsActive/${id}`,
      {},
      {
        headers: this.auth.getAuthHeaders(),
      }
    );
  }

  deleteMenu(id: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/deleteMenu/${id}`,
      {},
      {
        headers: this.auth.getAuthHeaders(),
      }
    );
  }
}
