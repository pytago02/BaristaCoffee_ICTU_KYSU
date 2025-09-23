import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ImportModule } from '../../../modules/import/import.module';
import { MenuCategoryService } from '../../../services/menucategory.service';
import { MenuService } from '../../../services/menu.service';
import { UrlbackendService } from '../../../services/urlbackend.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RecipesService } from '../../../services/recipes.service';

@Component({
  selector: 'app-recipes',
  imports: [ImportModule, ReactiveFormsModule],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css',
  providers: [ConfirmationService, MessageService],
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

  // ====== UI STATE ======
  showUpdateItemForm = false;

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
    private confirmService: ConfirmationService,
    private messageService: MessageService,
    private recipesService: RecipesService
  ) {
    this.backendURL = this.urlbackendService.urlBackend;
  }

  // ====== LIFECYCLE ======
  ngOnInit(): void {
    this.getAllCategories();
    this.getAllMenu();
  }

  get isBackdropActive(): boolean {
    return this.showUpdateItemForm;
  }

  // ====== DATA LOADING ======
  loadData(): void {
    this.getAllCategories();
    this.getAllMenu();
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

  updateTutorial():void{
    this.menuService.updateMenuTutorial(this.selectedItem.menu_id, this.selectedItem.tutorial).subscribe({
      next: (res) => {
        this.messageService.add({severity:'success', summary:'Thành công', detail:'Cập nhật hướng dẫn thành công!'});
        this.getAllMenu();
      },
      error: (err) => {
        console.error('Lỗi updateTutorial:', err);
        this.messageService.add({severity:'error', summary:'Lỗi', detail:'Cập nhật hướng dẫn thất bại!'});
      }
    });
  }

  selectedIngredientData: any = null;
  selectedIngredient(data: any){
    this.selectedIngredientData = {...data};
    console.log(this.selectedIngredientData);
  }
  updateIngredientInMenu(ingredient_id: number, quantity: number): void {
    if (!this.selectedItem) return;
    this.recipesService.updateIngredientInMenu(this.selectedItem.menu_id, ingredient_id, quantity).subscribe({
      next: (res) => {
        this.messageService.add({severity:'success', summary:'Thành công', detail:'Cập nhật nguyên liệu thành công!'});
        this.getIngredientsByMenuId(this.selectedItem.menu_id);
      },
      error: (err) => {
        console.error('Lỗi updateIngredientInMenu:', err);
        this.messageService.add({severity:'error', summary:'Lỗi', detail:'Cập nhật nguyên liệu thất bại!'});
      }
    });
  }


}
