import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlbackendService } from './urlbackend.service';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  private apiUrl: string;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private urlbackendService: UrlbackendService,
    private auth: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.apiUrl = `${this.urlbackendService.urlBackend}/recipes`;
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  getAllRecipes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAllRecipes`, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  getRecipesByMenuId(menuId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/getRecipesByMenuId/${menuId}`, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  addIngredientToMenu(
    menu_id: number,
    ingredient_id: number,
    quantity: number
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/addIngredientToMenu`,
      {
        menu_id,
        ingredient_id,
        quantity,
      },
      {
        headers: this.auth.getAuthHeaders(),
      }
    );
  }

  updateIngredientInMenu(
    menu_id: number,
    ingredient_id: number,
    quantity: number
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/updateIngredientInMenu`,
      {
        menu_id,
        ingredient_id,
        quantity,
      },
      {
        headers: this.auth.getAuthHeaders(),
      }
    );
  }

  deleteIngredientFromMenu(
    menu_id: number,
    ingredient_id: number
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/deleteIngredientFromMenu`,
      {
        menu_id,
        ingredient_id,
      },
      {
        headers: this.auth.getAuthHeaders(),
      }
    );
  }
}
