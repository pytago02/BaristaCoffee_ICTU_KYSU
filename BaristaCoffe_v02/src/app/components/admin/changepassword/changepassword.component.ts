import { Component } from '@angular/core';
import { ImportModule } from '../../../modules/import/import.module';
import { MessageService } from 'primeng/api';
import { UsersService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-changepassword',
  imports: [ImportModule],
  templateUrl: './changepassword.component.html',
  styleUrl: './changepassword.component.css',
  providers: [MessageService],
})
export class ChangepasswordComponent {
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  changePassword() {
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Thiếu thông tin',
        detail: 'Vui lòng nhập đầy đủ các trường',
      });
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Mật khẩu xác nhận không khớp',
      });
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Không xác định được người dùng',
      });
      return;
    }

    this.usersService
      .changePassword(userId, {
        password: this.currentPassword,
        new_password: this.newPassword,
      })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Đổi mật khẩu thành công!',
          });
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
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
