import { Component, EventEmitter, Output } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { CommonModule } from '@angular/common';
import { ImportModule } from '../../../modules/import/import.module';
import { RouterLink } from '@angular/router';
import { RouterOutlet, RouterModule } from '@angular/router';

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

  @Output() viewNavbarChange = new EventEmitter<boolean>();

  toggleViewNavbar() {
    this.viewNavbar = !this.viewNavbar;
    this.viewNavbarChange.emit(this.viewNavbar);
  }
}
