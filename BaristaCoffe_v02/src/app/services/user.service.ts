import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlbackendService } from './urlbackend.service';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private UrlbackendService: UrlbackendService,
    private auth: AuthService
  ) {
    this.apiUrl = `${this.UrlbackendService.urlBackend}/users`;
  }

  // ======= AUTH =======
  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  registerStaff(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registerStaff`, data, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  staffLogin(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/staffLogin`, data);
  }

  customerLogin(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/customerLogin`, data);
  }

  logOut(): void {
    this.auth.clearToken();
  }

  // ======= USER =======
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAllUser`, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/getUserById/${id}`, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  getMe(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getMe`, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  updateUser(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateUser/${id}`, data, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/deleteUser/${id}`, {
      headers: this.auth.getAuthHeaders(),
    });
  }

changePassword(id: number, data: { password: string; new_password: string }) {
  return this.http.put<any>(
    `${this.apiUrl}/changePassword/${id}`,
    data,
    { headers: this.auth.getAuthHeaders() }
  );
}

  changeIsActive(id: number, isActive: boolean): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/changeIsActive/${id}`,
      { is_active: isActive },
      {
        headers: this.auth.getAuthHeaders(),
      }
    );
  }

  getStaffAcount(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getStaffAcount`, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  getCustomerAcount(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getCustomerAcount`, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  resetPassword(id: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/resetPassword/${id}`,
      {},
      { headers: this.auth.getAuthHeaders() }
    );
  }

  updateAvatar(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.http.put(`${this.apiUrl}/updateAvatar/${id}`, formData, {
      headers: this.auth.getAuthHeaders(),
    });
  }
}
