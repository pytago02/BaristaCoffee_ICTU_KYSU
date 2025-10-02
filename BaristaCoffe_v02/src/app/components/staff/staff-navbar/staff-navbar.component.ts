import { Component, EventEmitter, Output } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { CommonModule } from '@angular/common';
import { ImportModule } from '../../../modules/import/import.module';
import { RouterLink } from '@angular/router';
import { RouterOutlet, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { UrlbackendService } from '../../../services/urlbackend.service';
import { UsersService } from '../../../services/user.service';

@Component({
  selector: 'app-staff-navbar',
  imports: [
    AvatarModule,
    AvatarGroupModule,
    CommonModule,
    ImportModule,
    RouterLink,
    RouterModule,
  ],
  templateUrl: './staff-navbar.component.html',
  styleUrl: './staff-navbar.component.css',
})
export class StaffNavbarComponent {
  viewOption: boolean = false;
  viewNavbar: boolean = true;
  titleHeader: string = 'DashBoard';
  backendURL: any;
  userData: any = {
    avatar: '',
    full_name: '',
    email: '',
    phone: '',
  };
  isDarkMode = false;

  @Output() viewNavbarChange = new EventEmitter<boolean>();

  constructor(
    private urlBackendService: UrlbackendService,
    private router: Router,
    private usersService: UsersService
  ) {
    this.backendURL = this.urlBackendService.urlBackend;
    // const userString = localStorage.getItem('user');
    // if (userString) {
    //   this.userData = JSON.parse(userString);
    // }
    this.getMe();
  }

  toggleViewNavbar() {
    this.viewNavbar = !this.viewNavbar;
    this.viewNavbarChange.emit(this.viewNavbar);
  }

  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  getMe() {
    this.usersService.getMe().subscribe({
      next: (res) => {
        this.userData = res.data;
      },
      error: (err) => {
        console.error('error getMe: ', err);
      },
    });
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    const element = document.querySelector('html');
    if (element != null) {
      element.classList.toggle('my-app-dark');
    }
  }
}
