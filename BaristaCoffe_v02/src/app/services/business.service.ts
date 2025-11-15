import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlbackendService } from './urlbackend.service';
import { AuthService } from './auth.service';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class BusinessService {
  private apiUrl: string;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private urlbackendService: UrlbackendService,
    private auth: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.apiUrl = `${this.urlbackendService.urlBackend}/business`;
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  getAllBusiness(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAllBusiness`, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  updateBusiness(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateBusiness`, data, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  getRevenueByCategory(month: number, year: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/revenueByCategory`, {
      headers: this.auth.getAuthHeaders(),
      params: { month, year },
    });
  }

  getForecasts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/forecasts`, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  getQuantityOrderItems(month: number, year: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/getQuantityOrderItems`, {
      headers: this.auth.getAuthHeaders(),
      params: { month, year },
    });
  }

  getBusinessToday(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getBusinessToday`, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  getHotTables(month: number, year: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/getHotTables`, {
      headers: this.auth.getAuthHeaders(),
      params: { month, year },
    });
  }

  getQuantityItemByMonth(menu_id: number):Observable<any>{
    return this.http.post(`${this.apiUrl}/getQuantityItemByMonth`,{menu_id}, {
      headers: this.auth.getAuthHeaders(),
    })
  }
}
