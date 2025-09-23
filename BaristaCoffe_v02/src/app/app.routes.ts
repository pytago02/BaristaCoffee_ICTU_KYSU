import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { TableComponent } from './components/admin/table/table.component';
import { MenuComponent } from './components/admin/menu/menu.component';
import { CategoryComponent } from './components/admin/category/category.component';
import { OrderComponent } from './components/admin/order/order.component';
import { StaffComponent } from './components/admin/staff/staff.component';
import { CustomerComponent } from './components/admin/customer/customer.component';
import { IngredientComponent } from './components/admin/ingredient/ingredient.component';
import { RecipesComponent } from './components/admin/recipes/recipes.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },

  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'tables', component: TableComponent },
      { path: 'menus', component: MenuComponent },
      { path: 'categories', component: CategoryComponent },
      {path: 'orders', component: OrderComponent},
      {path: 'staff', component: StaffComponent},
      {path: 'customers', component: CustomerComponent},
      {path: 'ingredients', component: IngredientComponent},
      {path: 'recipes', component: RecipesComponent},

    ],
  },
];
