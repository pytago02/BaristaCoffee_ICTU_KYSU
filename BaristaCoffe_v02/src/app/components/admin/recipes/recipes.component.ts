import { Component, OnInit } from '@angular/core';
import {ReactiveFormsModule } from '@angular/forms';
import { ImportModule } from '../../../modules/import/import.module';
import { MenuCategoryService } from '../../../services/menucategory.service';
import { MenuService } from '../../../services/menu.service';
import { UrlbackendService } from '../../../services/urlbackend.service';
import { MessageService } from 'primeng/api';
import { RecipesService } from '../../../services/recipes.service';
import { IngredientsService } from '../../../services/ingredient.service';

@Component({
  selector: 'app-recipes',
  imports: [ImportModule, ReactiveFormsModule],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css',
  providers: [MessageService],
})
export class RecipesComponent implements OnInit {
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
  showAddIngredientForm = false;

  // ====== SEARCH / CATEGORY ======
  keyword: string = '';
  menuCategoryName = '';
  editingCate: any = null;
  keywordIngredient: string = '';

  // ====== MESSAGES ======
  message = '';

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
  loadData(): void {
    this.getAllCategories();
    this.getAllMenu();
    this.getAllIngredients();
  }

  getAllCategories(): void {
    this.menuCategoryService.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res;
        console.log('getAllCategories:', this.categories);
      },
      error: (err) => console.error('Lỗi getAllCategories:', err),
    });
  }

  getAllMenu(): void {
    this.menuService.getAllMenu().subscribe({
      next: (res) => {
        this.menus = res;
        this.filteredMenus = [...this.menus];
        console.log('getAllMenu:', this.menus);
      },
      error: (err) => console.error('Lỗi getAllMenu:', err),
    });
  }

  getAllIngredients(): void {
    this.ingredientsService.getAllIngredients().subscribe({
      next: (res) => {
        this.listIngredients = res;
        this.filteredIngredients = [...this.listIngredients];
        console.log('getAllIngredients:', this.listIngredients);
      },
      error: (err) => console.error('Lỗi getAllIngredients:', err),
    });
  }
  // ====== SEARCH ======
  search(): void {
    const keywordLower = this.keyword.trim().toLowerCase();
    if (!keywordLower) {
      this.filteredMenus = [...this.menus];
      return;
    }
    this.filteredMenus = this.menus.filter((menu) =>
      menu.menu_name.toLowerCase().includes(keywordLower)
    );
  }

  // ====== HELPERS ======
  resetShow() {
    this.showUpdateItemForm = false;
  }

  filterByCategory(categoryName: string | null): void {
    if (!categoryName) {
      this.filteredMenus = [...this.menus];
    } else {
      this.filteredMenus = this.menus.filter(
        (menu) => menu.menu_category_name === categoryName
      );
    }
    this.selectedCategory = categoryName;
  }

  selectItem(item: any) {
    this.selectedItem = { ...item };
    console.log(this.selectedItem);
    this.showUpdateItemForm = true;

    this.getIngredientsByMenuId(this.selectedItem.menu_id);
  }

  getIngredientsByMenuId(menuId: number): void {
    this.recipesService.getRecipesByMenuId(menuId).subscribe({
      next: (res) => {
        this.ingredients = res;
        console.log('getIngredientsByMenuId:', this.ingredients);
      },
      error: (err) => console.error('Lỗi getIngredientsByMenuId:', err),
    });
  }

  updateTutorial(): void {
    this.menuService
      .updateMenuTutorial(this.selectedItem.menu_id, this.selectedItem.tutorial)
      .subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Cập nhật hướng dẫn thành công!',
          });
          this.getAllMenu();
        },
        error: (err) => {
          console.error('Lỗi updateTutorial:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Cập nhật hướng dẫn thất bại!',
          });
        },
      });
  }

  selectedIngredientData: any = null;
  selectedIngredient(data: any) {
    if(this.selectedIngredientData && this.selectedIngredientData.ingredient_id === data.ingredient_id) {
      this.selectedIngredientData = null;
      return;
    }
    this.selectedIngredientData = { ...data };
    console.log(this.selectedIngredientData);
  }

  updateIngredientInMenu(
    menu_id: number,
    ingredient_id: number,
    quantity: number
  ): void {
    if (!this.selectedItem) return;
    this.recipesService
      .updateIngredientInMenu(menu_id, ingredient_id, quantity)
      .subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Cập nhật nguyên liệu thành công!',
          });
          this.getIngredientsByMenuId(this.selectedItem.menu_id);
          this.selectedIngredientData = null;
        },
        error: (err) => {
          console.error('Lỗi updateIngredientInMenu:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Cập nhật nguyên liệu thất bại!',
          });
        },
      });
  }

  deleteIngredientFromMenu(menu_id: number, ingredient_id: number) {
    if (!this.selectedItem) return;
    if (confirm('Bạn có chắc muốn xóa nguyên liệu này khỏi công thức?')) {
      this.recipesService
        .deleteIngredientFromMenu(menu_id, ingredient_id)
        .subscribe({
          next: (res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Xoá nguyên liệu thành công!',
            });
            this.getIngredientsByMenuId(this.selectedItem.menu_id);
          },
          error: (err) => {
            console.error('Lỗi deleteIngredientFromMenu:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Xoá nguyên liệu thất bại!',
            });
          },
        });
    }
  }

  filterIngredients(): void {
    const keywordLower = this.keywordIngredient.trim().toLowerCase();
    if (!keywordLower) {
      this.filteredIngredients = [...this.listIngredients];
      return;
    }
    this.filteredIngredients = this.listIngredients.filter((ingredient) =>
      ingredient.name.toLowerCase().includes(keywordLower)
    );
  }

  addIngredientToMenu( menu_id: number, ingredient_id: number, quantity: number): void {
    if (!this.selectedItem) return;
    if (!quantity || quantity <= 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Số lượng nguyên liệu không hợp lệ!',
      });
      return;
    }
    this.recipesService
      .addIngredientToMenu(menu_id, ingredient_id, quantity)
      .subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Thêm nguyên liệu thành công!',
          });
          this.getIngredientsByMenuId(menu_id);
        },
        error: (err) => {
          console.error('Lỗi addIngredientToMenu:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Thêm nguyên liệu thất bại!',
          });
        },
      });
  }
}
