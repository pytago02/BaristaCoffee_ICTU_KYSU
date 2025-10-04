import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlbackendService } from './urlbackend.service';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';
import { table } from 'console';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  private apiUrl: string;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private urlbackendService: UrlbackendService,
    private auth: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.apiUrl = `${this.urlbackendService.urlBackend}/tables`;
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // ====== TABLE API ======
  getAllTables(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAllTables`, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  getAllTablesByStatus(status: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAllTablesByStatus/${status}`, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  getTableById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/getTablesById/${id}`, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  getTablesByZone(zoneId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAllTablesByZone/${zoneId}`, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  getInforTableById(table_id: number):Observable<any>{
    return this.http.get(`${this.apiUrl}/getInforTableById/${table_id}`,{
      headers: this.auth.getAuthHeaders(),
    })
  }

  createTable(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createTable`, data, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  updateTable(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateTable/${id}`, data, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  deleteTable(id: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/deleteTable/${id}`,
      {},
      {
        headers: this.auth.getAuthHeaders(),
      }
    );
  }

  getAllZonesWithTables(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAllZonesWithTables`, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  updateStausTable(id: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateStausTable/${id}`,{status}, {
      headers: this.auth.getAuthHeaders(),
    });
  }
}
