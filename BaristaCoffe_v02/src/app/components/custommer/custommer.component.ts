import { Component, OnInit } from '@angular/core';
import { UrlbackendService } from '../../services/urlbackend.service';
import { MenuService } from '../../services/menu.service';
import { UsersService } from '../../services/user.service';
import { MessageService } from 'primeng/api';
import { ImportModule } from '../../modules/import/import.module';
import { RecomentDationService } from '../../services/recoment-dation.service';
import { SidebarModule } from 'primeng/sidebar';
import { ActivatedRoute } from '@angular/router';
import { TableService } from '../../services/table.service';
import { PasswordModule } from 'primeng/password';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-custommer',
  imports: [ImportModule, SidebarModule, PasswordModule],
  templateUrl: './custommer.component.html',
  styleUrl: './custommer.component.css',
  providers: [MessageService],
})
export class CustommerComponent implements OnInit {
  urlBackend = '';
  tableID: any;
  tableInfor: any;
  userData: any = {
    user_id: 0,
  };
  allMenuData: any[] = [];
  groupedMenuData: any[] = [];
  categoryOptions: any[] = [];
  recomentDationData: any[] = [];

  constructor(
    private urlbackendService: UrlbackendService,
    private menuService: MenuService,
    private userService: UsersService,
    private recomentDationService: RecomentDationService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private tableService: TableService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.urlBackend = this.urlbackendService.urlBackend;
    this.route.queryParams.subscribe((params) => {
      this.tableID = params['table_id'] ? Number(params['table_id']) : null;
      this.getInforTableById();
    });

    this.getMe();
    this.getAllMenu();
    this.getRecommendations();
  }

  loadData() {
    this.getMe();
    this.getRecommendations();
    this.getAllMenu();
    this.getInforTableById();
  }

  getMe() {
    this.userService.getMe().subscribe({
      next: (data) => {
        this.userData = data.data;
        console.log(this.userData);
      },
      error: (err) => {
        console.error('error getMe:', err);
      },
    });
  }

  getInforTableById() {
    this.tableService.getInforTableById(this.tableID).subscribe({
      next: (data) => {
        this.tableInfor = data[0];
        console.log(this.tableInfor);
      },
      error: (err) => {
        console.error('error getInforTableById:', err);
      },
    });
  }

  getAllMenu() {
    this.menuService.getAllMenu().subscribe((data) => {
      this.allMenuData = data;
      this.groupedMenuData = this.groupMenuByCategory(this.allMenuData);

      // tạo danh sách options cho dropdown
      const categories = Array.from(
        new Map(
          this.allMenuData.map((item) => [
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

  groupMenuByCategory(data: any[] = this.allMenuData) {
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

  getRecommendations() {
    this.recomentDationService
      .getRecommendations(this.userData.user_id)
      .subscribe({
        next: (data) => {
          this.recomentDationData = data;
          console.log('recomentDationData:', this.recomentDationData);
        },
        error: (err) => {
          console.error('error getRecomentDations:', err);
        },
      });
  }

  activePage: string = 'home';
  selectedCategory: number | null = null;

  callStaff() {
    this.messageService.add({
      severity: 'info',
      summary: 'Gọi nhân viên',
      detail: 'Nhân viên sẽ tới ngay!',
    });
  }

  requestPayment() {
    this.getTableOrder();
  }

  showDetail = false;
  showCart = false;
  selectedItem: any = null;
  cart: any[] = [];

  openDetail(item: any) {
    this.selectedItem = item;
    this.showDetail = true;
  }

  addToCart(item: any) {
    const existing = this.cart.find((c) => c.menu_id === item.menu_id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.cart.push({ ...item, quantity: 1 });
    }
    this.messageService.add({
      severity: 'success',
      summary: 'Đã thêm',
      detail: item.menu_name,
    });
    this.showDetail = false;
  }

  removeFromCart(index: number) {
    this.cart.splice(index, 1);
  }

  getCartTotal() {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  submitOrder() {
    if (!this.tableID || this.cart.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Giỏ hàng trống',
        detail: 'Vui lòng chọn món trước khi order!',
      });
      return;
    }

    const payload = {
      table_id: this.tableID,
      staff_id: this.userData.user_id, // hoặc để staff_id backend xử lý
      items: this.cart.map((item) => ({
        menu_id: item.menu_id,
        quantity: item.quantity,
        note: item.note || null,
      })),
    };

    this.orderService.addOrderToTable(payload).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Order thành công',
          detail: 'Nhân viên sẽ chuẩn bị ngay!',
        });
        console.log('Order response:', res);
        this.cart = []; // clear cart
        this.showCart = false;
        this.getTableOrder(); // load lại order cho bàn
      },
      error: (err) => {
        console.error('Error submit order:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể gửi order, vui lòng thử lại!',
        });
      },
    });
  }

  increaseQuantity(index: number) {
    this.cart[index].quantity += 1;
  }

  decreaseQuantity(index: number) {
    if (this.cart[index].quantity > 1) {
      this.cart[index].quantity -= 1;
    }
  }

  orderData: any;
  showOrderDetail = false;

  getTableOrder() {
    this.tableService.getTableById(this.tableInfor.table_id).subscribe({
      error: (err) => {
        console.error('Lỗi lấy table by id: ', err);
      },
      next: (data) => {
        this.orderData = data.orders[0];
        console.log('orderData: ', this.orderData);
        this.showOrderDetail = true;
      },
    });
  }

  confirmPayment() {
    this.messageService.add({
      severity: 'warn',
      summary: 'Yêu cầu thanh toán',
      detail: 'Đang xử lý thanh toán...',
    });
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

  isEditing = false;

  toggleEdit() {
    if (this.isEditing) {
      this.userService
        .updateUser(this.userData.user_id, this.userData)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Cập nhật tài khoản thành công!',
            });
            this.getMe();
            this.cancelEdit();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Không thể cập nhật tài khoản!',
            });
          },
        });
    } else {
      this.isEditing = true;
    }
  }

  cancelEdit() {
    this.getMe();
    this.isEditing = false;
    this.isChangePass = false;
    this.changePassData.oldPass = '';
    this.changePassData.newPass = '';
    this.changePassData.confirmNewPass = '';
  }

  changeAvatar() {}

  changePassData = {
    oldPass: '',
    newPass: '',
    confirmNewPass: '',
  };
  isChangePass = false;

  toggleChangePass() {
    if (this.isChangePass) {
      this.changePassword();
    } else {
      this.isChangePass = true;
    }
  }

  changePassword() {
    if (
      !this.changePassData.oldPass ||
      !this.changePassData.newPass ||
      !this.changePassData.confirmNewPass
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Thiếu thông tin',
        detail: 'Vui lòng nhập đầy đủ các trường',
      });
      return;
    }

    if (this.changePassData.newPass !== this.changePassData.confirmNewPass) {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Mật khẩu xác nhận không khớp',
      });
      return;
    }

    this.userService
      .changePassword(this.userData.user_id, {
        password: this.changePassData.oldPass,
        new_password: this.changePassData.newPass,
      })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Đổi mật khẩu thành công!',
          });
          this.changePassData.oldPass = '';
          this.changePassData.newPass = '';
          this.changePassData.confirmNewPass = '';
          this.cancelEdit();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Thất bại',
            detail: err.error?.message || 'Đổi mật khẩu không thành công',
          });
        },
      });
  }
}
