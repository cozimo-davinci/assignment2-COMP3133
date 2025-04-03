import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { EmployeeComponent } from './components/employees/employees.component';
import { EmployeeformComponent } from './components/employeeform/employeeform.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'login', component: LoginComponent, pathMatch: 'full' },
    { path: 'signup', component: SignupComponent, pathMatch: 'full' },
    { path: 'employees', component: EmployeeComponent, canActivate: [AuthGuard], pathMatch: 'full' },
    { path: 'employee/add', component: EmployeeformComponent, canActivate: [AuthGuard], pathMatch: 'full' },
    { path: 'employee/edit/:id', component: EmployeeformComponent, canActivate: [AuthGuard], pathMatch: 'full' },
    { path: 'employee/view', component: EmployeeformComponent, canActivate: [AuthGuard], pathMatch: 'full' }
];