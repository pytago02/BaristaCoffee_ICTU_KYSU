import { Component, OnInit } from '@angular/core';
import { ImportModule } from '../../../modules/import/import.module';
import { UrlbackendService } from '../../../services/urlbackend.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IngredientsService } from '../../../services/ingredient.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-staff-ingredient',
  imports: [ImportModule, ReactiveFormsModule],
  templateUrl: './staff-ingredient.component.html',
  styleUrl: './staff-ingredient.component.css',
  providers: [ConfirmationService, MessageService],
})
export class StaffIngredientComponent implements OnInit{
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
    private ingredientsService: IngredientsService
  ) {
    this.backendURL = this.urlbackendService.urlBackend;
  }

  ngOnInit(): void {
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

  stockSeverity(data: any) {
    const stock = Number(data.stock_quantity);
    const minStock = Number(data.min_stock);

    if (stock < minStock) return 'danger';
    return 'success';
  }

}
