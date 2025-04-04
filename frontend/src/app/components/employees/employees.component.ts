import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EmployeeFormComponent } from '../employeeform/employeeform.component';
import { DeleteConfirmDialogComponent } from '../delete-confirm-dialog.component';
import { Router, RouterModule } from '@angular/router';


interface Employee {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  designation: string;
  salary: number;
  date_of_joining: string;
  department: string;
  employee_photo: string;
}

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
})
export class EmployeeComponent implements OnInit {
  displayedColumns: string[] = [
    'first_name',
    'last_name',
    'email',
    'gender',
    'designation',
    'salary',
    'date_of_joining',
    'department',
    'actions',
  ];
  dataSource: Employee[] = [];

  constructor(
    private apollo: Apollo,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchEmployees();
  }

  fetchEmployees(): void {
    this.apollo
      .query<{ getAllEmployees: Employee[] }>({
        query: gql`
          query GetAllEmployees {
            getAllEmployees {
              _id
              first_name
              last_name
              email
              gender
              designation
              salary
              date_of_joining
              department
              employee_photo
            }
          }
        `,
        fetchPolicy: 'network-only',
      })
      .subscribe({
        next: (result) => {
          this.dataSource = [...result.data.getAllEmployees];
          console.log('Employees fetched:', this.dataSource);
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error fetching employees:', error);
          this.snackBar.open('Error fetching employees: ' + error.message, 'Close', { duration: 5000 });
        },
      });
  }

  editEmployee(employee: Employee): void {
    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      width: '700px', // Match max-width in CSS
      maxHeight: '90vh', // Allow dialog to grow up to 90% of viewport height
      data: { employee },
    });

    dialogRef.componentInstance.formSubmitted.subscribe(() => {
      this.fetchEmployees();
      dialogRef.close();
    });
  }

  addEmployee(): void {
    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      width: '700px',
      maxHeight: '90vh', // Consistent with edit
    });

    dialogRef.componentInstance.formSubmitted.subscribe(() => {
      this.fetchEmployees();
      dialogRef.close();
    });
  }

  viewEmployee(employee: Employee): void {
    // Navigation will be handled in the next section
    this.router.navigate(['/employee/view', employee._id]);
    console.log('View employee:', employee);
  }

  deleteEmployee(_id: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.apollo
          .mutate({
            mutation: gql`
              mutation DeleteEmployee($_id: ID!) {
                deleteEmployee(_id: $_id) {
                  _id
                }
              }
            `,
            variables: { _id },
            refetchQueries: [
              {
                query: gql`
                  query GetAllEmployees {
                    getAllEmployees {
                      _id
                      first_name
                      last_name
                      email
                      gender
                      designation
                      salary
                      date_of_joining
                      department
                      employee_photo
                    }
                  }
                `,
              },
            ],
          })
          .subscribe({
            next: () => {
              this.snackBar.open('Employee deleted successfully!', 'Close', { duration: 3000 });
              this.fetchEmployees();
            },
            error: (error) => {
              this.snackBar.open('Error deleting employee: ' + error.message, 'Close', { duration: 5000 });
            },
          });
      }
    });
  }
}