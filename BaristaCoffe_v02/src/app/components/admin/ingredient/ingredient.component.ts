import { Component, OnInit } from '@angular/core';
import { ImportModule } from '../../../modules/import/import.module';
import { UrlbackendService } from '../../../services/urlbackend.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { IngredientsService } from '../../../services/ingredient.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-ingredient',
  imports: [ImportModule, ReactiveFormsModule],
  templateUrl: './ingredient.component.html',
  styleUrl: './ingredient.component.css',
  providers: [MessageService],
})
export class IngredientComponent implements OnInit {
  // ===== DATA =====
  backendURL: any;
  ingredientData: any[] = [];
  filterIngredientData: any[] = [];
  keyword: string = '';
  seletedItem: any = [];
  addItemData: any = {
    name: '',
    unit: '',
    stock_quantity: 0,
    min_stock: 0,
    image: null,
  };

  // ===== SHOW LAYOUT =====
  isBackdropActive = false;
  showCreateForm = false;

  constructor(
    private urlbackendService: UrlbackendService,
    private messageService: MessageService,
    private router: Router,
    private ingredientsService: IngredientsService
  ) {}

  ngOnInit(): void {
    this.backendURL = this.urlbackendService.urlBackend;
    this.getAllIngredients();
  }
  loadData() {
    this.getAllIngredients();
  }

  resetShow() {
    this.isBackdropActive = false;
    this.showCreateForm = false;
  }

  getAllIngredients() {
    this.ingredientsService.getAllIngredients().subscribe({
      next: (data) => {
        this.ingredientData = data;
        this.filterIngredientData = data;
        console.log('getAllIngredients:', this.ingredientData);
      },
      error: (err) => {
        console.error('error getAllIngredients:', err);
      },
    });
  }

  resetTable(table: any) {
    table.clear();
    this.loadData();
  }

  search() {
    const keywordLower = this.keyword.trim().toLowerCase();
    if (!keywordLower) {
      this.filterIngredientData = [...this.ingredientData];
      return;
    }
    this.filterIngredientData = this.ingredientData.filter((order) =>
      order.name.toLowerCase().includes(keywordLower)
    );
  }

  filterLowStock() {
    this.filterIngredientData = this.ingredientData.filter(
      (item) => Number(item.stock_quantity) < Number(item.min_stock)
    );
  }

  clearFilter() {
    this.keyword = '';
    this.getAllIngredients();
  }

  seletedAcount(data: any) {
    if (
      this.seletedItem != null &&
      this.seletedItem.ingredient_id == data.ingredient_id
    ) {
      this.seletedItem = null;
      return;
    }
    this.seletedItem = { ...data };
    console.log(this.seletedItem);
  }

  onImageChange(event: Event, userId: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      this.ingredientsService.updateImage(userId, file).subscribe({
        next: (res) => {
          this.getAllIngredients();
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Đổi hình ảnh thành công!',
          });
          this.seletedItem.image = res.image + '?t=' + new Date().getTime();
        },
        error: (err) => {
          console.error('Lỗi updateAvatar:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể đổi hình ảnh!',
          });
        },
      });
    }
  }

  updateData() {
    if (confirm('Xác nhận cập nhật sản phẩm')) {
      this.ingredientsService
        .updateIngredient(this.seletedItem.ingredient_id, this.seletedItem)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Cập nhật sản phẩm thành công!',
            });
            this.getAllIngredients();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Không thể cập nhật sản phẩm!',
            });
          },
        });
    }
  }

  deleteUser() {
    if (confirm('Bạn có chắc muốn xoá sản phẩm này?')) {
      this.ingredientsService
        .deleteIngredient(this.seletedItem.ingredient_id)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Xoá sản phẩm thành công!',
            });
            this.getAllIngredients();
            this.seletedItem = null;
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Không thể xoá sản phẩm!',
            });
          },
        });
    }
  }

  stockSeverity(data: any) {
    const stock = Number(data.stock_quantity);
    const minStock = Number(data.min_stock);

    if (stock < minStock) return 'danger';
    return 'success';
  }

  createItem() {
    const formData = new FormData();
    formData.append('name', this.addItemData.name);
    formData.append('unit', this.addItemData.unit);
    formData.append(
      'stock_quantity',
      this.addItemData.stock_quantity.toString()
    );
    formData.append('min_stock', this.addItemData.min_stock.toString());

    if (this.addItemData.image) {
      formData.append('image', this.addItemData.image);
    }

    this.ingredientsService.createIngredient(formData).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Thêm sản phẩm thành công!',
        });
        this.getAllIngredients();
        this.addItemData = {
          name: '',
          unit: '',
          stock_quantity: 0,
          min_stock: 0,
          image: null,
        };
        this.showCreateForm = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể thêm sản phẩm!',
        });
      },
    });
  }

  // selectedFile: File | null = null;
  // previewImage: string | ArrayBuffer | null = null;

  onImageSelect(event: any): void {
    if (event.files && event.files.length > 0) {
      this.addItemData.image = event.files[0];
      console.log('File selected:', this.addItemData.image);
    }
  }
}
