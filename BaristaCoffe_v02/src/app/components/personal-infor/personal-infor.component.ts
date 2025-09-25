import { Component, OnInit } from '@angular/core';
import { ImportModule } from '../../modules/import/import.module';
import { UsersService } from '../../services/user.service';
import { UrlbackendService } from '../../services/urlbackend.service';
import { RouterLink } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-personal-infor',
  imports: [ImportModule, RouterLink],
  templateUrl: './personal-infor.component.html',
  styleUrl: './personal-infor.component.css',
  providers: [ConfirmationService, MessageService],
})
export class PersonalInforComponent implements OnInit {
  user: any = {
    avatar: '',
    full_name: '',
    email: '',
    phone: '',
  };
  backendURL = '';

  constructor(
    private usersService: UsersService,
    private urlBackendService: UrlbackendService,
    private messageService: MessageService
  ) {
    // this.user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : this.user;
    this.backendURL = this.urlBackendService.urlBackend;
  }
  ngOnInit() {
    this.getMe();
  }

  getMe() {
    this.usersService.getMe().subscribe({
      next: (res) => {
        this.user = res.data;
        console.log(this.user);
      },
    });
  }

  onAvatarChange(event: Event, userId: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      this.usersService.updateAvatar(userId, file).subscribe({
        next: (res) => {
          // this.getStaffAcount();
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Đổi avatar thành công!',
          });
          this.getMe();
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
}
