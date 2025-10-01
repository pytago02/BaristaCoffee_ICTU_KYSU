import { Component, OnInit } from '@angular/core';
import { ImportModule } from '../../../modules/import/import.module';
import { UrlbackendService } from '../../../services/urlbackend.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UsersService } from '../../../services/user.service';

@Component({
  selector: 'app-staff',
  imports: [ImportModule],
  templateUrl: './admin-staff.component.html',
  styleUrl: './admin-staff.component.css',
  providers: [ConfirmationService, MessageService],
})
export class AdminStaffComponent implements OnInit {
  // ===== DATA =====
  backendURL: any;
  staffAcountData: any[] = [];
  filterstaffAcountData: any[] = [];
  keyword: string = '';
  seletedAcountData: any = [];
  addItemData: any = {
    full_name: '',
    email: '',
    phone: '',
    role: '',
  };

  // ===== SHOW LAYOUT =====
  isBackdropActive = false;
  showCreateForm = false;

  constructor(
    private usersService: UsersService,
    private urlbackendService: UrlbackendService,
    private confirmService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.backendURL = this.urlbackendService.urlBackend;
  }

  ngOnInit(): void {
    this.getStaffAcount();
    this.loadData();
  }
  loadData() {
    this.getStaffAcount();
  }

  resetShow() {
    this.isBackdropActive = false;
    this.showCreateForm = false;
  }

  getStaffAcount() {
    this.usersService.getStaffAcount().subscribe({
      next: (data) => {
        this.staffAcountData = data;
        this.filterstaffAcountData = data;
        console.log('getStaffAcount:', this.staffAcountData);
      },
      error: (err) => {
        console.error('error getStaffAcount:', err);
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
      this.filterstaffAcountData = [...this.staffAcountData];
      return;
    }
    this.filterstaffAcountData = this.staffAcountData.filter(
      (order) =>
        order.full_name.toLowerCase().includes(keywordLower) ||
        order.phone.toLowerCase().includes(keywordLower) ||
        order.email.toLowerCase().includes(keywordLower)
    );
  }

  clearFilter() {
    this.keyword = '';
    this.getStaffAcount();
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
  }

  isActiveMap: { [key: string]: { label: string; severity: string } } = {
    1: { label: 'Hoạt động', severity: 'infor' },
    0: { label: 'Đã khoá', severity: 'warn' },
  };

  roleMap: { [key: string]: { label: string; severity: string } } = {
    staff: { label: 'Phục vụ', severity: 'danger' },
    barista: { label: 'Pha chế', severity: 'success' },
  };

  roleList = [
    { name: 'Phục vụ', value: 'staff' },
    { name: 'Pha chế', value: 'barista' },
  ];

  isActiveList = [
    { name: 'Hoạt động', value: 1 },
    { name: 'Đã khoá', value: 0 },
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
    if (role === 'staff') return 'info';
    if (role === 'barista') return 'warn';
    return 'secondary';
  }

  onAvatarChange(event: Event, userId: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      this.usersService.updateAvatar(userId, file).subscribe({
        next: (res) => {
          this.getStaffAcount();
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Đổi avatar thành công!',
          });
          this.seletedAcountData.avatar =
            res.avatar + '?t=' + new Date().getTime();
        },
        error: (err) => {
          console.error('Lỗi updateAvatar:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể đổi avatar!',
          });
        },
      });
    }
  }

  createUser() {
    if (
      !this.addItemData.full_name ||
      !this.addItemData.email ||
      !this.addItemData.phone ||
      !this.addItemData.role
    ) {
      this.messageService.add({
        severity: 'warm',
        summary: 'Thông báo',
        detail: 'Cần điền đủ thông tin',
      });
      console.log(this.addItemData);
      
      return;
    }
    this.usersService.registerStaff(this.addItemData).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Tạo tài khoản thành công',
        });
        this.getStaffAcount();
        this.addItemData = {
          full_name: '',
          email: '',
          phone: '',
          role: '',
        };
      },
      error: (err)=>{
        console.error("error createUser:", err);
      }
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
            this.getStaffAcount();
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

  deleteUser() {
    if (confirm('Bạn có chắc muốn xoá tài khoản này?')) {
      this.usersService.deleteUser(this.seletedAcountData.user_id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Xoá tài khoản thành công!',
          });
          this.getStaffAcount();
          this.seletedAcountData = null;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể xoá tài khoản!',
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
            this.getStaffAcount();
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
}
