import { Component, OnInit } from '@angular/core';
import { ImportModule } from '../../../modules/import/import.module';
import { MenuCategoryService } from '../../../services/menucategory.service';
import { MenuService } from '../../../services/menu.service';
import { UrlbackendService } from '../../../services/urlbackend.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-staff-menu',
  imports: [ImportModule],
  templateUrl: './staff-menu.component.html',
  styleUrl: './staff-menu.component.css',
  providers: [MessageService],
})
export class StaffMenuComponent implements OnInit {
  // ====== DATA ======
  categories: any[] = [];
  menus: any[] = [];
  filteredMenus: any[] = [];
  selectedCategory: any = null;
  selectedMenu: any = null;
  backendURL: any;

  // ====== SEARCH ======
  keyword: string = '';

  constructor(
    private menuCategoryService: MenuCategoryService,
    private menuService: MenuService,
    private urlbackendService: UrlbackendService,
    private messageService: MessageService
  ) {
    this.backendURL = this.urlbackendService.urlBackend;
  }

  // ====== LIFECYCLE ======
  ngOnInit(): void {
    this.getAllCategories();
    this.getAllMenu();
  }

  // ====== DATA LOADING ======
  loadData(): void {
    this.getAllCategories();
    this.getAllMenu();
  }

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

  // ====== MENU CRUD ======
  updateMenu(id: number): void {
    this.menuService.updateMenu(id, {}).subscribe({
      next: () => {
        this.getAllMenu();
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Cập nhật thông tin thành công',
        });
      },
      error: (err) => console.error('Lỗi updateMenu:', err),
    });
  }

  changeIsActive(id: number): void {
    this.menuService.changeIsActive(id).subscribe({
      next: () => this.getAllMenu(),
      error: (err) => console.error('Lỗi changeIsActive:', err),
    });
  }

  deleteMenu(id: number): void {
    if (confirm('Xác nhận xoá sản phẩm!')) {
      this.menuService.deleteMenu(id).subscribe({
        next: () => {
          this.getAllMenu();
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Đã xoá sản phẩm',
          });
        },
        error: (err) => console.error('Lỗi deleteMenu:', err),
      });
    }
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

  // ====== HELPERS ======
  stockSeverity(product: any) {
    if (product.quantity === 0) return 'danger';
    if (product.quantity > 0 && product.quantity < 10) return 'warn';
    return 'success';
  }

  resetTable(table: any) {
    table.clear();
    this.loadData();
  }

  filterByCategory(categoryName: string | null): void {
    this.filteredMenus = !categoryName
      ? [...this.menus]
      : this.menus.filter((menu) => menu.menu_category_name === categoryName);
    this.selectedCategory = categoryName;
  }
}
