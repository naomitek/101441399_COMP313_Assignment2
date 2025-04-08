import { Routes } from '@angular/router';
import { EmployeesComponent } from './pages/employees/employees.component';
import { EmployeeListComponent } from './pages/employee-list/employee-list.component';
import { EmployeeFormComponent } from './pages/employee-form/employee-form.component';
import { EmployeeDetailsComponent } from './pages/employee-details/employee-details.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';

export const routes: Routes = [
  {
    path: 'employees',
    component: EmployeesComponent,
    children: [
      { path: '', component: EmployeeListComponent },
      { path: 'add', component: EmployeeFormComponent },
      { path: 'edit/:id', component: EmployeeFormComponent },
      { path: 'details/:id', component: EmployeeDetailsComponent },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
