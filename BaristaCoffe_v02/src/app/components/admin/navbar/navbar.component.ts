import { Component, EventEmitter, Output } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { CommonModule } from '@angular/common';
import { ImportModule } from '../../../modules/import/import.module';
import { RouterLink } from '@angular/router';
import { RouterOutlet, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { UrlbackendService } from '../../../services/urlbackend.service';
import { ppid } from 'process';

@Component({
  selector: 'app-navbar',
  imports: [
    AvatarModule,
    AvatarGroupModule,
    CommonModule,
    ImportModule,
    RouterLink,
    RouterModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  viewOption: boolean = false;
  viewNavbar: boolean = true;
  titleHeader: string = 'DashBoard';
  backendURL: any;
  userData: any = {
    avatar: '',
    full_name: '',
    email: '',
    phone: '',
  }

  @Output() viewNavbarChange = new EventEmitter<boolean>();

  constructor(private urlBackendService: UrlbackendService, private router: Router) {
    this.backendURL = this.urlBackendService.urlBackend;
    const userString = localStorage.getItem('user');
    if(userString){
      this.userData = JSON.parse(userString);
    }
    console.log(this.userData);
    
  }

  toggleViewNavbar() {
    this.viewNavbar = !this.viewNavbar;
    this.viewNavbarChange.emit(this.viewNavbar);
  }

  logOut(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
