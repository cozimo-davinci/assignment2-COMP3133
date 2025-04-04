import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { EmployeeComponent } from './components/employees/employees.component';
import { EmployeeFormComponent } from './components/employeeform/employeeform.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { EmployeeSearchResultComponent } from './employee-search-result/employee-search-result.component';


export const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'login', component: LoginComponent, pathMatch: 'full' },
    { path: 'signup', component: SignupComponent, pathMatch: 'full' },
    { path: 'employees', component: EmployeeComponent, canActivate: [AuthGuard], pathMatch: 'full' },
    { path: 'employee/add', component: EmployeeFormComponent, canActivate: [AuthGuard], pathMatch: 'full' },
    {
        path: 'employee/edit/:id',
        component: EmployeeFormComponent,
        canActivate: [AuthGuard],
        pathMatch: 'full',
        data: { renderMode: 'client' } // Render on client-side only
    },
    {
        path: 'employee/view/:id',
        component: EmployeeDetailComponent,
        canActivate: [AuthGuard],
        pathMatch: 'full',
        data: { renderMode: 'client' } // Render on client-side only
    },
    { path: 'employees/searchResult', component: EmployeeSearchResultComponent, canActivate: [AuthGuard], pathMatch: 'full' },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];