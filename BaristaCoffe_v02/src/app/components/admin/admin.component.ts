import { Component } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { ImportModule } from '../../modules/import/import.module';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [NavbarComponent, ImportModule, RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  viewNavbar: boolean = true;

  onViewNavbarChange(value: boolean) {
    this.viewNavbar = value;
    console.log('Navbar visibility changed:', value);
  }
}
