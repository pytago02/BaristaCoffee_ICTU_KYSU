import { OrderService } from './../../../services/order.service';
import { Component, OnInit } from '@angular/core';
import { ImportModule } from '../../../modules/import/import.module';
import { UrlbackendService } from '../../../services/urlbackend.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UsersService } from '../../../services/user.service';
import { ShareDataService } from '../../../services/sharedata.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-staff-customer',
  imports: [ImportModule],
  templateUrl: './staff-customer.component.html',
  styleUrls: ['./staff-customer.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class StaffCustomerComponent implements OnInit {
  // ===== DATA =====
  backendURL: any;
  customerAcountData: any[] = [];
  filtercustomerAcountData: any[] = [];
  keyword: string = '';
  seletedAcountData: any = [];
  addItemData: any = {
    full_name: '',
    email: '',
    phone: '',
  };

  // ===== SHOW LAYOUT =====
  isBackdropActive = false;
  showCreateForm = false;

  constructor(
    private usersService: UsersService,
    private urlbackendService: UrlbackendService,
    private confirmService: ConfirmationService,
    private messageService: MessageService,
    private orderService: OrderService,
    private shareDataService: ShareDataService,
    private router: Router
  ) {
    this.backendURL = this.urlbackendService.urlBackend;
  }

  ngOnInit(): void {
    this.getcustomerAcount();
  }
  loadData() {
    this.getcustomerAcount();
  }

  resetShow() {
    this.isBackdropActive = false;
    this.showCreateForm = false;
  }

  getcustomerAcount() {
    this.usersService.getCustomerAcount().subscribe({
      next: (data) => {
        this.customerAcountData = data;
        this.filtercustomerAcountData = data;
        console.log('getcustomerAcount:', this.customerAcountData);
      },
      error: (err) => {
        console.error('error getcustomerAcount:', err);
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
      this.filtercustomerAcountData = [...this.customerAcountData];
      return;
    }
    this.filtercustomerAcountData = this.customerAcountData.filter(
      (order) =>
        order.full_name.toLowerCase().includes(keywordLower) ||
        order.phone.toLowerCase().includes(keywordLower) ||
        order.email.toLowerCase().includes(keywordLower)
    );
  }

  clearFilter() {
    this.keyword = '';
    this.getcustomerAcount();
  }

  seletedAcount(data: any) {
    if (
      this.seletedAcountData != null &&
      this.seletedAcountData.user_id == data.user_id
    ) {
      this.seletedAcountData = null;
      return;
    }
    this.seletedAcountData = { ...data };
    console.log(this.seletedAcountData);
    this.getOrderByUserId();
  }

  isActiveMap: { [key: string]: { label: string; severity: string } } = {
    1: { label: 'Hoạt động', severity: 'infor' },
    0: { label: 'Đã khoá', severity: 'warn' },
  };

  roleMap: { [key: string]: { label: string; severity: string } } = {
    customer: { label: 'Phục vụ', severity: 'danger' },
    barista: { label: 'Pha chế', severity: 'success' },
  };

  roleList = [
    { name: 'Phục vụ', value: 'customer' },
    { name: 'Pha chế', value: 'barista' },
  ];

  isActiveList = [
    { name: 'Hoạt động', value: 1 },
    { name: 'Ngừng hoạt động', value: 0 },
  ];

  getRoleLabel(role: string): string {
    return this.roleMap[role]?.label || role;
  }

  getIsActiveLabel(is_active: string): string {
    return this.isActiveMap[is_active]?.label || is_active;
  }

  getIsActiveSeverity(isActive: boolean): 'success' | 'danger' {
    return isActive ? 'success' : 'danger';
  }

  getRoleSeverity(
    role: string
  ): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    if (role === 'admin') return 'success';
    if (role === 'customer') return 'info';
    if (role === 'barista') return 'warn';
    return 'secondary';
  }


  createUser() {
    if (!this.addItemData.full_name || !this.addItemData.phone) {
      console.log('Điền đủ thông tin');
      return;
    }

    this.usersService.register(this.addItemData).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Tạo tài khoản thành công',
        });
        this.addItemData = {
          full_name: '',
          email: '',
          phone: '',
          password: '',
        };
        this.getcustomerAcount();
      },
      error: (err) => {
        console.error('error createUser:', err);
      },
    });
  }

  updateUser() {
    if (confirm('Xác nhận cập nhật tài khoản')) {
      this.usersService
        .updateUser(this.seletedAcountData.user_id, this.seletedAcountData)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Cập nhật tài khoản thành công!',
            });
            this.getcustomerAcount();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Không thể cập nhật tài khoản!',
            });
          },
        });
    }
  }


  resetPassword() {
    console.log('resetPasword');
    if (confirm('Bạn có muốn reset mật khẩu về: 1')) {
      this.usersService
        .resetPassword(this.seletedAcountData.user_id)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Đặt lại mật khẩu thành công!',
            });
            this.getcustomerAcount();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Không thể reset mật khẩu!',
            });
          },
        });
    }
  }

  orderByUserIdData: any[] = [];
  getOrderByUserId() {
    this.orderService
      .getOrdersByUserId(this.seletedAcountData.user_id)
      .subscribe({
        next: (data) => {
          this.orderByUserIdData = data;
          console.log('getOrderByUserID:', this.orderByUserIdData);
        },
        error: (err) => {
          console.error('error getOrdeByUserId:', err);
        },
      });
  }

  stockSeverity(data: any) {
    if (data.status === 'pending') return 'warn';
    if (data.status === 'preparing') return 'secondary';
    if (data.status === 'completed') return 'info';
    if (data.status === 'cancell') return 'danger';
    if (data.status === 'paid') return 'success';
    return 'contrast';
  }

  statusMap: { [key: string]: { label: string; severity: string } } = {
    pending: { label: 'Chờ xử lý', severity: 'danger' },
    preparing: { label: 'Đang chuẩn bị', severity: 'secondary' },
    completed: { label: 'Hoàn tất', severity: 'info' },
    cancelled: { label: 'Đã hủy', severity: 'danger' },
    paid: { label: 'Đã thanh toán', severity: 'success' },
  };

  getStatusLabel(status: string): string {
    return this.statusMap[status]?.label || status;
  }

  goToOrder(data: any) {
    this.shareDataService.changeMessage(data);
    this.router.navigate(['admin/orders']);
  }
}
