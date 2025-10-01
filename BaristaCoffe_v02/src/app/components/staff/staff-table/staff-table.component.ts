import { Component, OnInit } from '@angular/core';
import { ImportModule } from '../../../modules/import/import.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableService } from '../../../services/table.service';
import { ZoneService } from '../../../services/zone.service';
import { UrlbackendService } from '../../../services/urlbackend.service';
import { MenuService } from '../../../services/menu.service';
import { MenuCategoryService } from '../../../services/menucategory.service';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-staff-table',
  imports: [ImportModule],
  templateUrl: './staff-table.component.html',
  styleUrl: './staff-table.component.css',
  providers: [ConfirmationService, MessageService],
})
export class StaffTableComponent implements OnInit {
  backendURL: any;
  tableData: any[] = [];
  filterTableData: any[] = [];
  zoneWithTableData: any[] = [];
  zonesData: any[] = [];
  menuData: any[] = [];
  groupedMenuData: any[] = [];
  keyword = '';
  categoryOptions: any[] = [];
  selectedCategory: number | null = null;
  selectedItemData: any = {
    menu_name: '',
    price: '',
    order_quantity: 1,
  };

  constructor(
    private tablesService: TableService,
    private zoneService: ZoneService,
    private urlbackendService: UrlbackendService,
    private menuService: MenuService,
    private menuCategoryService: MenuCategoryService,
    private orderService: OrderService
  ) {
    this.backendURL = urlbackendService.urlBackend;
  }

  ngOnInit(): void {
    this.getAllTables();
    this.getAllZonesWithTables();
    this.getAllZones();
    this.getAllMenu();
  }

  loadData() {}

  getAllTables(): void {
    this.tablesService.getAllTables().subscribe((data) => {
      this.tableData = data;
      console.log('tableData:', this.tableData);
    });
  }

  getAllTablesByStatus(status: string): void {
    this.tablesService.getAllTablesByStatus(status).subscribe((data) => {
      console.log(`${status} tables:`, data);
    });
  }

  getAllZonesWithTables() {
    this.tablesService.getAllZonesWithTables().subscribe({
      next: (res) => {
        this.zoneWithTableData = res;
        console.log('zonesData:', res);
      },
      error: (err) => {
        console.error('error getAllZonesWithTables:', err);
      },
    });
  }

  getAllZones(): void {
    this.zoneService.getAllZones().subscribe((data) => {
      this.zonesData = data;
      console.log('zoneData:', this.zonesData);
    });
  }

  getAllMenu() {
    this.menuService.getAllMenu().subscribe((data) => {
      this.menuData = data;
      this.groupedMenuData = this.groupMenuByCategory(this.menuData);

      // tạo danh sách options cho dropdown
      const categories = Array.from(
        new Map(
          this.menuData.map((item) => [
            item.menu_category_id,
            item.menu_category_name,
          ])
        ).entries()
      );

      this.categoryOptions = categories.map(([id, name]) => ({
        label: name,
        value: id,
      }));

      // thêm option "Tất cả"
      this.categoryOptions.unshift({ label: 'Tất cả', value: null });

      console.log('groupedMenuData:', this.groupedMenuData);
    });
  }

  groupMenuByCategory(data: any[] = this.menuData) {
    const grouped = data.reduce((acc: any, item: any) => {
      const categoryId = item.menu_category_id;
      const categoryName = item.menu_category_name;

      if (!acc[categoryId]) {
        acc[categoryId] = {
          categoryId,
          categoryName,
          items: [],
        };
      }

      acc[categoryId].items.push(item);
      return acc;
    }, {});

    return Object.values(grouped);
  }

  search() {
    const key = this.keyword.trim().toLowerCase();

    let filtered = this.menuData;

    if (key) {
      filtered = filtered.filter((item) =>
        item.menu_name.toLowerCase().includes(key)
      );
    }

    if (this.selectedCategory) {
      filtered = filtered.filter(
        (item) => item.menu_category_id === this.selectedCategory
      );
    }

    this.groupedMenuData = this.groupMenuByCategory(filtered);
  }

  clearFilter() {
    this.keyword = '';
    this.selectedCategory = null;
    this.groupedMenuData = this.groupMenuByCategory(this.menuData);
  }

  selectedItem(item: any) {
    this.selectedItemData = item;
    this.selectedItemData.order_quantity = 1;
    console.log(this.selectedItemData);
  }

  selectedTableData: any = null;
  orderByTableIdData: any[] = [];
  showInfoTable = false;

  getOrdersByTableId(tableId: number) {
    this.orderService.getOrdersByTableId(tableId).subscribe((data) => {
      console.log('getOrdersByTableId:', data);
      this.orderByTableIdData = data;
      this.showInfoTable = true;
    });
  }

  selectedTable(data: any) {
    console.log(data);
    this.selectedTableData = data;
    this.getOrdersByTableId(data.table_id);
  }

  closeInfoTable() {
    this.showInfoTable = false;
    this.selectedTableData = null;
    this.orderByTableIdData = [];
  }

  serveOrder(order: any) {
    // TODO: Gọi API chuyển trạng thái order sang "Serving"
    console.log('Phục vụ order:', order);
  }

  payOrder(order: any) {
    // TODO: Gọi API thanh toán
    console.log('Thanh toán order:', order);
  }

  cancelTable(table: any) {
    // TODO: Gọi API hủy bàn
    console.log('Hủy bàn:', table);
  }
}
