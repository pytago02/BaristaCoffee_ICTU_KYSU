import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { UrlbackendService } from './urlbackend.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class RequestService {
  private apiUrl: string;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private urlbackendService: UrlbackendService,

    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.apiUrl = `${this.urlbackendService.urlBackend}/request`;
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  getPendingRequests(category?: string): Observable<any[]> {
    const url = category
      ? `${this.apiUrl}/getPendingRequests?category=${category}`
      : `${this.apiUrl}/getPendingRequests`;
    return this.http.get<any[]>(url, { headers: this.auth.getAuthHeaders() });
  }

  updateRequestStatus(id: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/updateRequestStatus/${id}`,
      {},
      {
        headers: this.auth.getAuthHeaders(),
      }
    );
  }

  callStaff(payload: any) {
    return this.http.post(`${this.apiUrl}/callStaff`, payload);
  }

  requestPayment(payload: any) {
    return this.http.post(`${this.apiUrl}/requestPayment`, payload);
  }
}
