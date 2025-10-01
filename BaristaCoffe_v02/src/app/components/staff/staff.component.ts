import { Component } from '@angular/core';
import { StaffNavbarComponent } from './staff-navbar/staff-navbar.component';
import { ImportModule } from '../../modules/import/import.module';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-staff',
  imports: [StaffNavbarComponent, ImportModule, RouterOutlet],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.css',
})
export class StaffComponent {
  viewNavbar: boolean = true;

  onViewNavbarChange(value: boolean) {
    this.viewNavbar = value;
    console.log('Navbar visibility changed:', value);
  }
}
