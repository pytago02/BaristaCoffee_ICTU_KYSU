import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlbackendService } from './urlbackend.service';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class RecomentDationService {
  private isBrowser: boolean;
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private urlbackendService: UrlbackendService,
    private auth: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.apiUrl = `${this.urlbackendService.urlBackend}/recommendations`;
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  getRecommendations(user_id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/getRecommendations/${user_id}`, {
      headers: this.auth.getAuthHeaders(),
    });
  }
}
