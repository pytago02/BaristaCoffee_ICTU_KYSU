import { UsersService } from './../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { ImportModule } from '../../../modules/import/import.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableService } from '../../../services/table.service';
import { ZoneService } from '../../../services/zone.service';
import { UrlbackendService } from '../../../services/urlbackend.service';
import { MenuService } from '../../../services/menu.service';
import { MenuCategoryService } from '../../../services/menucategory.service';
import { OrderService } from '../../../services/order.service';
import { SocketService } from '../../../services/socket.service';

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
  userData: any = {
    avatar: '',
    full_name: '',
    email: '',
    phone: '',
  };

  constructor(
    private tablesService: TableService,
    private zoneService: ZoneService,
    private urlbackendService: UrlbackendService,
    private menuService: MenuService,
    private menuCategoryService: MenuCategoryService,
    private orderService: OrderService,
    private usersService: UsersService,
    private messageService: MessageService,
    private socketService: SocketService
  ) {
    this.backendURL = urlbackendService.urlBackend;
  }

  ngOnInit(): void {
    this.getAllTables();

    this.socketService.onNewOrder().subscribe((order: any) => {
      this.messageService.add({
        severity: 'info',
        summary: 'Order mới',
        detail: `Bàn ${order.table_id} vừa gửi order`,
      });

      this.getAllZonesWithTables();
    });

    this.getAllZonesWithTables();
    this.getAllZones();
    this.getAllMenu();
    this.getMe();
  }

  loadData() {
    this.getAllTables();
    this.getAllZonesWithTables();
    this.getAllZones();
    this.getAllMenu();
    this.getMe();
  }

  getMe() {
    this.usersService.getMe().subscribe({
      next: (res) => {
        this.userData = res.data;
        console.log(this.userData);
      },
      error: (err) => {
        console.error('error getMe: ', err);
      },
    });
  }
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

  getStatusLabel(status: string): string {
    switch (status) {
      case 'available':
        return 'Sẵn sàng';
      case 'pending':
        return 'Chờ xác nhận';
      case 'preparing':
        return 'Đang chuẩn bị';
      case 'served':
        return 'Đã phục vụ';
      case 'paid':
        return 'Đã thanh toán';
      case 'unavailable':
        return 'Không khả dụng';
      case 'completed':
        return 'Đã phục vụ';
      default:
        return status;
    }
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
    this.loadData();
  }

  payOrder(order: any) {
    this.orderService
      .updateStatusOrder({ order_id: order.order_id, status: 'paid' })
      .subscribe({
        next: (res: any) => {
          console.log('Thanh toán thành công:', res);
          this.getOrdersByTableId(this.selectedTableData.table_id);
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Đã Thanh toán order',
          });
          this.updateStatusTable(this.selectedTableData.table_id, 'paid');
          this.getAllTables();
        },
        error: (err) => {
          console.error('Lỗi thanh toán:', err);
        },
      });
  }

  cancelTable(table: any) {
    // TODO: Gọi API hủy bàn
    console.log('Hủy bàn:', table);
  }

  addItemToTable() {
    if (!this.selectedTableData) {
      alert('Vui lòng chọn bàn trước');
      return;
    }

    const payload = {
      table_id: this.selectedTableData.table_id,
      staff_id: this.userData.user_id,
      items: [
        {
          menu_id: this.selectedItemData.menu_id,
          quantity: this.selectedItemData.order_quantity,
          note: '',
        },
      ],
    };

    this.orderService.addOrderToTable(payload).subscribe({
      next: (res: any) => {
        console.log('Thêm món thành công:', res);
        this.updateStatusTable(this.selectedTableData.table_id, 'pending');
        this.getOrdersByTableId(this.selectedTableData.table_id);
      },
      error: (err) => {
        console.error('Lỗi thêm món:', err);
      },
    });
  }

  updateItemQuantity(item: any) {
    console.log('update');
    const payload = {
      order_item_id: item.order_item_id,
      quantity: item.quantity,
    };

    this.orderService.updateOrderItem(payload).subscribe({
      next: (res: any) => {
        console.log('Cập nhật số lượng thành công:', res);
        this.getOrdersByTableId(this.selectedTableData.table_id);
        this.loadData();
      },
      error: (err) => {
        console.error('Lỗi update số lượng:', err);
      },
    });
  }

  serveOrder(order: any) {
    this.orderService
      .updateStatusOrder({ order_id: order.order_id, status: 'completed' })
      .subscribe({
        next: (res: any) => {
          console.log('Phục vụ thành công:', res);
          this.getOrdersByTableId(this.selectedTableData.table_id);
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Đã phục vụ order',
          });
          this.updateStatusTable(this.selectedTableData.table_id, 'served');
          this.getAllTables();
        },
        error: (err) => {
          console.error('Lỗi phục vụ:', err);
        },
      });
  }

  updateStatusTable(id: number, status: string) {
    this.tablesService.updateStausTable(id, status).subscribe({
      next: (res) => {
        console.log('updateStatuTable success');
        this.getOrdersByTableId(this.selectedTableData.table_id);
        this.loadData();
      },
      error: (err) => {
        console.error('Error updateStatusTable:', err);
      },
    });
  }

  checkOutTable() {
    console.log('checkOutTable');
    if (this.orderByTableIdData[0].status != 'paid') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Hoá đơn chưa được thanh toán!',
      });
      return;
    } else {
      const status = 'available';
      this.tablesService
        .updateStausTable(this.selectedTableData.table_id, status)
        .subscribe({
          next: (res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Check out thành công',
            });
            this.getAllTables();
            this.getOrdersByTableId(this.selectedTableData.table_id);
          },
          error: (err) => {
            console.error('Error checkOutTable: ', err);
          },
        });
    }
  }
}
