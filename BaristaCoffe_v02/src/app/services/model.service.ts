import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { UrlbackendService } from './urlbackend.service';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ModelService {
  private apiUrl = '';
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private url: UrlbackendService,
    private auth: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.apiUrl = `${this.url.urlBackend}/model`;
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  trainModel(): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/train`,
      {},
      {
        headers: this.auth.getAuthHeaders(),
      }
    );
  }

  predict(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/predict`, payload, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  getForecasts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/forecasts`, {
      headers: this.auth.getAuthHeaders(),
    });
  }
}
