import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlbackendService } from './urlbackend.service';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl: string;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private urlbackendService: UrlbackendService,
    private auth: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.apiUrl = `${this.urlbackendService.urlBackend}/order`;
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  getAllOrder(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAllOrder`, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  getOrdersByRange(from: string, to: string): Observable<any[]> {
    let params = new HttpParams().set('from', from).set('to', to);
    return this.http.get<any[]>(
      `${this.apiUrl}/getOrdersByRange`,
      {
        params,
        headers: this.auth.getAuthHeaders(),
      }
    );
  }

  getOrdersByUserId(userId: number):Observable<any>{
    return this.http.get<any[]>(
      `${this.apiUrl}/getOrdersByUserId/${userId}`, {
        headers: this.auth.getAuthHeaders(),
      }
    )
  }
}
