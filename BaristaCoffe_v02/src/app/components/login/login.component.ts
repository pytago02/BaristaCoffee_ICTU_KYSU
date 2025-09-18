import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ImportModule } from '../../modules/import/import.module';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ImportModule, InputTextModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MessageService],
})
export class LoginComponent implements OnInit {
  urlBacked = '';
  email = '';
  password = '';

  constructor(
    private usersService: UsersService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    // this.urlBacked = this.urlBackendService.urlBackend;
  }

  login() {
    if (this.email == '' || this.password == '')
      return this.messageService.add({
        severity: 'error',
        summary: 'Thông báo',
        detail: 'Vui lòng điền đầy đủ thông tin !!!',
        life: 3000,
      });
    this.usersService
      .staffLogin({ email: this.email, password: this.password })
      .subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          if (res.user.role === 'admin') {
            this.router.navigate(['/admin/dashboard']);
          }
          if (res.user.role === 'staff') {
            this.router.navigate(['/staff/tables']);
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Thông báo',
            detail: 'Tài khoản hoặc mật khẩu không chính xác !!!',
            life: 3000,
          });
          console.log(err);
        },
      });
  }
}
