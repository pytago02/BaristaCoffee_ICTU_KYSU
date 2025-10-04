import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { TableComponent } from './components/admin/table/table.component';
import { MenuComponent } from './components/admin/menu/menu.component';
import { OrderComponent } from './components/admin/order/order.component';
import { AdminStaffComponent } from './components/admin/staff/admin-staff.component';
import { CustomerComponent } from './components/admin/customer/customer.component';
import { IngredientComponent } from './components/admin/ingredient/ingredient.component';
import { RecipesComponent } from './components/admin/recipes/recipes.component';
import { ChangepasswordComponent } from './components/changepassword/changepassword.component';
import { PersonalInforComponent } from './components/personal-infor/personal-infor.component';

// staff
import { StaffNavbarComponent } from './components/staff/staff-navbar/staff-navbar.component';
import { StaffComponent } from './components/staff/staff.component';
import { StaffCustomerComponent } from './components/staff/staff-customer/staff-customer.component';
import { StaffOrderComponent } from './components/staff/staff-order/staff-order.component';
import { StaffTableComponent } from './components/staff/staff-table/staff-table.component';
import { StaffMenuComponent } from './components/staff/staff-menu/staff-menu.component';
import { StaffRecipesComponent } from './components/staff/staff-recipes/staff-recipes.component';
import { StaffIngredientComponent } from './components/staff/staff-ingredient/staff-ingredient.component';
import { CustommerComponent } from './components/custommer/custommer.component';

export const routes: Routes = [
  { path: '', component: CustommerComponent },
  { path: 'login', component: LoginComponent },

  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'tables', component: TableComponent },
      { path: 'menus', component: MenuComponent },
      { path: 'orders', component: OrderComponent },
      { path: 'staff', component: AdminStaffComponent },
      { path: 'customers', component: CustomerComponent },
      { path: 'ingredients', component: IngredientComponent },
      { path: 'recipes', component: RecipesComponent },
      { path: 'change-password', component: ChangepasswordComponent },
      { path: 'personal-info', component: PersonalInforComponent },
    ],
  },

  {
    path: 'staff',
    component: StaffComponent,
    children: [
      { path: 'table', component: StaffTableComponent },
      { path: 'customer', component: StaffCustomerComponent },
      { path: 'order', component: StaffOrderComponent },
      { path: 'change-password', component: ChangepasswordComponent },
      { path: 'personal-info', component: PersonalInforComponent },
      { path: 'menu', component: StaffMenuComponent },
      { path: 'ingredient', component: StaffIngredientComponent },
      { path: 'recipes', component: StaffRecipesComponent },
    ],
  },

  { path: 'customer', component: CustommerComponent },
];
