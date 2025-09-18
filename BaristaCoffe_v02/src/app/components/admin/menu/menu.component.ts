import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ImportModule } from '../../../modules/import/import.module';
import { MenuCategoryService } from '../../../services/menucategory.service';
import { MenuService } from '../../../services/menu.service';
import { UrlbackendService } from '../../../services/urlbackend.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-menu',
  imports: [ImportModule, ReactiveFormsModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  providers: [ConfirmationService, MessageService],
})
export class MenuComponent implements OnInit {
  // ====== DATA ======
  categories: any[] = [];
  menus: any[] = [];
  filteredMenus: any[] = [];
  selectedCategory: any = null;
  selectedMenu: any = null;
  backendURL: any;

  // ====== FORM DATA ======
  createItemData = new FormGroup({
    menu_name: new FormControl(''),
    menu_category_id: new FormControl(''),
    description: new FormControl(''),
    import_price: new FormControl(''),
    price: new FormControl(''),
    sweetness_level: new FormControl(''),
    temperature: new FormControl(''),
    quantity: new FormControl(''),
    image_url: new FormControl(''),
  });

  updateItemData = new FormGroup({
    menu_name: new FormControl(''),
    menu_category_id: new FormControl(''),
    description: new FormControl(''),
    import_price: new FormControl(''),
    price: new FormControl(''),
    sweetness_level: new FormControl(''),
    temperature: new FormControl(''),
    is_active: new FormControl(''),
    quantity: new FormControl(''),
    image_url: new FormControl(''),
  });

  // ====== DROPDOWN OPTIONS ======
  sweetness_level = [
    { label: 'Ít', value: 'low' },
    { label: 'Vừa', value: 'medium' },
    { label: 'Nhiều', value: 'high' },
  ];
  temperature = [
    { label: 'Nóng', value: 'hot' },
    { label: 'Lạnh', value: 'cold' },
  ];
  is_active = [
    { label: 'Còn', value: '1' },
    { label: 'Hết', value: '0' },
  ];

  // ====== UI STATE ======
  showUpdateItemForm = false;
  showCreateCateForm = false;
  showCreateItemForm = false;
  showUpdateCateForm = false;

  // ====== FILE UPLOAD ======
  previewImage: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  updatePreviewImage: string | ArrayBuffer | null = null;
  updateSelectedFile: File | null = null;

  // ====== SEARCH / CATEGORY ======
  keyword: string = '';
  menuCategoryName = '';
  editingCate: any = null;

  // ====== MESSAGES ======
  message = '';

  constructor(
    private menuCategoryService: MenuCategoryService,
    private menuService: MenuService,
    private urlbackendService: UrlbackendService,
    private confirmService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.backendURL = this.urlbackendService.urlBackend;
  }

  // ====== LIFECYCLE ======
  ngOnInit(): void {
    this.getAllCategories();
    this.getAllMenu();
  }

  get isBackdropActive(): boolean {
    return (
      this.showCreateItemForm ||
      this.showUpdateItemForm ||
      this.showCreateCateForm ||
      this.showUpdateCateForm
    );
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

  getMenuById(id: number): void {
    this.menuService.getMenuById(id).subscribe({
      next: (res) => {
        this.selectedMenu = res.menu;
        console.log('getMenuById:', this.selectedMenu);
      },
      error: (err) => console.error('Lỗi getMenuById:', err),
    });
  }

  // ====== MENU CRUD ======
  updateMenu(id: number): void {
    this.menuService.updateMenu(id, this.updateItemData.value).subscribe({
      next: (res) => {
        console.log('updateMenu:', res);
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
      next: (res) => {
        console.log('changeIsActive:', res);
        this.getAllMenu();
      },
      error: (err) => console.error('Lỗi changeIsActive:', err),
    });
  }

  deleteMenu(id: number): void {
    if (confirm('Xác nhận xoá sản phẩm!')) {
      this.menuService.deleteMenu(id).subscribe({
        next: (res) => {
          console.log('deleteMenu:', res);
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

  // ====== IMAGE UPLOAD ======
  onImageSelect(event: any): void {
    const file = event.files[0];
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewImage = e.target?.result ?? null;
    };
    reader.readAsDataURL(file);
  }

  onUpdateImageSelect(event: any): void {
    const file = event.files[0];
    this.updateSelectedFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.updatePreviewImage = e.target?.result ?? null;
    };
    reader.readAsDataURL(file);
  }

  // ====== CREATE ITEM ======
  submitCreateItem(): void {
    const formData = new FormData();
    Object.entries(this.createItemData.value).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    this.menuService.createMenu(formData).subscribe({
      next: (res) => {
        console.log('Tạo món thành công:', res);
        this.getAllMenu();
        this.showCreateItemForm = false;
        this.message = 'Tạo món thành công!';
        this.createItemData.reset();
        this.selectedFile = null;
        this.previewImage = null;

        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Thêm món mới thành công',
        });
      },
      error: (err) => {
        console.error('Lỗi tạo món:', err);
        this.messageService.add({
          severity: 'danger',
          summary: 'Thất bại',
          detail: 'Thêm món mới thất bại!',
        });
      },
    });
  }

  // ====== UPDATE ITEM ======
  editMenu(product: any): void {
    this.updateItemData.patchValue(product);
    this.selectedMenu = product;
    this.showUpdateItemForm = true;
    console.log(product);
  }

  submitUpdateItem(): void {
    if (!this.selectedMenu) return;

    const formData = new FormData();
    Object.entries(this.updateItemData.value).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    if (this.updateSelectedFile) {
      formData.append('image',this.updateSelectedFile,this.updateSelectedFile.name);
    } 
    // else {
    //   formData.append('image_url', this.updateItemData.value.image_url || '');
    // }

    this.menuService.updateMenu(this.selectedMenu.menu_id, formData).subscribe({
      next: (res) => {
        console.log('updateMenu:', res);
        this.getAllMenu();
        this.showUpdateItemForm = false;
        this.updateSelectedFile = null;
        this.updatePreviewImage = null;
      },
      error: (err) => console.error('Lỗi updateMenu:', err),
    });
  }

  // ====== SEARCH ======
  search(): void {
    const keywordLower = this.keyword.trim().toLowerCase();
    if (!keywordLower) {
      this.filteredMenus = [...this.menus];
      return;
    }
    this.filteredMenus = this.menus.filter(
      (menu) =>
        menu.menu_name.toLowerCase().includes(keywordLower)

    );
  }

  // ====== CATEGORY CRUD ======
  createCategory() {
    this.menuCategoryService
      .createCategory({ menu_category_name: this.menuCategoryName })
      .subscribe({
        next: () => {
          console.log('Create category success');
          this.getAllCategories();
          this.showCreateCateForm = false;
        },
        error: (err) => console.error('error create category:', err),
      });
  }

  showUpdateCategory(cate: any) {
    this.editingCate = { ...cate };
  }

  updateCategory() {
    this.menuCategoryService
      .updateCategory(
        this.editingCate.menu_category_id,
        this.editingCate.menu_category_name
      )
      .subscribe({
        next: () => {
          console.log('update category success');
          this.getAllCategories();
          this.editingCate = null;
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Cập nhật thành công',
          });
        },
        error: (err) => console.error('error update category:', err),
      });
  }

  deleteCategory(id: number) {
    if (confirm('Xác nhận xoá danh mục này.')) {
      this.menuCategoryService.deleteCategory(id).subscribe({
        next: () => this.getAllCategories(),
        error: (err) => console.error('error deleteCategoroy:', err),
      });
    }
  }

  // ====== HELPERS ======
  resetShow() {
    this.showUpdateItemForm = false;
    this.showCreateCateForm = false;
    this.showCreateItemForm = false;
    this.showUpdateCateForm = false;
  }

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
    if (!categoryName) {
      this.filteredMenus = [...this.menus];
    } else {
      this.filteredMenus = this.menus.filter(
        (menu) => menu.menu_category_name === categoryName
      );
    }
    this.selectedCategory = categoryName;
  }
}
