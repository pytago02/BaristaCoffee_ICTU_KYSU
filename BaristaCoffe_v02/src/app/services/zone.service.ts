import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlbackendService } from './urlbackend.service';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root',
})
export class ZoneService {
  private apiUrl: string;

  constructor(private http: HttpClient, private UrlbackendService: UrlbackendService, private auth: AuthService) {
    this.apiUrl = `${this.UrlbackendService.urlBackend}/zones`;
  }

  getAllZones(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAllZones`, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  createZone(zone: { zone_name: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/createZone`, zone, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  updateZone(id: number, zone: { zone_name: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateZone/${id}`, zone, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  deleteZone(id: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/deleteZone/${id}`,
      {},
      {
        headers: this.auth.getAuthHeaders(),
      }
    );
  }
}
