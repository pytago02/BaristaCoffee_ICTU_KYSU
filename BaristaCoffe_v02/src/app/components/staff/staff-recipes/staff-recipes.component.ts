import { Component, OnInit } from '@angular/core';
import { ImportModule } from '../../../modules/import/import.module';
import { MenuCategoryService } from '../../../services/menucategory.service';
import { MenuService } from '../../../services/menu.service';
import { UrlbackendService } from '../../../services/urlbackend.service';
import { MessageService } from 'primeng/api';
import { RecipesService } from '../../../services/recipes.service';
import { IngredientsService } from '../../../services/ingredient.service';

@Component({
  selector: 'app-staff-recipes',
  imports: [ImportModule],
  templateUrl: './staff-recipes.component.html',
  styleUrl: './staff-recipes.component.css',
  providers: [MessageService],
})
export class StaffRecipesComponent implements OnInit {
  // ====== DATA ======
  categories: any[] = [];
  menus: any[] = [];
  filteredMenus: any[] = [];
  selectedCategory: any = null;
  selectedItem: any = null;
  backendURL: any;
  ingredients: any[] = [];
  listIngredients: any[] = [];
  filteredIngredients: any[] = [];

  // ====== UI STATE ======
  showUpdateItemForm = false;

  // ====== SEARCH ======
  keyword: string = '';
  keywordIngredient: string = '';

  constructor(
    private menuCategoryService: MenuCategoryService,
    private menuService: MenuService,
    private urlbackendService: UrlbackendService,
    private messageService: MessageService,
    private recipesService: RecipesService,
    private ingredientsService: IngredientsService
  ) {
    this.backendURL = this.urlbackendService.urlBackend;
  }

  // ====== LIFECYCLE ======
  ngOnInit(): void {
    this.getAllCategories();
    this.getAllMenu();
    this.getAllIngredients();
  }

  get isBackdropActive(): boolean {
    return this.showUpdateItemForm;
  }

  // ====== DATA LOADING ======
  getAllCategories(): void {
    this.menuCategoryService.getAllCategories().subscribe({
      next: (res) => (this.categories = res),
      error: (err) => console.error('Lỗi getAllCategories:', err),
    });
  }

  getAllMenu(): void {
    this.menuService.getAllMenu().subscribe({
      next: (res) => {
        this.menus = res;
        this.filteredMenus = [...this.menus];
      },
      error: (err) => console.error('Lỗi getAllMenu:', err),
    });
  }

  getAllIngredients(): void {
    this.ingredientsService.getAllIngredients().subscribe({
      next: (res) => {
        this.listIngredients = res;
        this.filteredIngredients = [...this.listIngredients];
      },
      error: (err) => console.error('Lỗi getAllIngredients:', err),
    });
  }

  // ====== SEARCH ======
  search(): void {
    const keywordLower = this.keyword.trim().toLowerCase();
    this.filteredMenus = keywordLower
      ? this.menus.filter((menu) =>
          menu.menu_name.toLowerCase().includes(keywordLower)
        )
      : [...this.menus];
  }

  filterIngredients(): void {
    const keywordLower = this.keywordIngredient.trim().toLowerCase();
    this.filteredIngredients = keywordLower
      ? this.listIngredients.filter((ingredient) =>
          ingredient.name.toLowerCase().includes(keywordLower)
        )
      : [...this.listIngredients];
  }

  // ====== HELPERS ======
  resetShow() {
    this.showUpdateItemForm = false;
  }

  filterByCategory(categoryName: string | null): void {
    this.filteredMenus = categoryName
      ? this.menus.filter((menu) => menu.menu_category_name === categoryName)
      : [...this.menus];
    this.selectedCategory = categoryName;
  }

  selectItem(item: any) {
    this.selectedItem = { ...item };
    this.showUpdateItemForm = true;
    this.getIngredientsByMenuId(this.selectedItem.menu_id);
  }

  getIngredientsByMenuId(menuId: number): void {
    this.recipesService.getRecipesByMenuId(menuId).subscribe({
      next: (res) => (this.ingredients = res),
      error: (err) => console.error('Lỗi getIngredientsByMenuId:', err),
    });
  }
}
