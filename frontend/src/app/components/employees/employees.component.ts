import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

// Define the Employee interface
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

  constructor(private apollo: Apollo, private dialog: MatDialog) { }

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
      })
      .subscribe({
        next: (result) => {
          this.dataSource = result.data.getAllEmployees;
          console.log('Employees fetched:', this.dataSource);
        },
        error: (error) => {
          console.error('Error fetching employees:', error);
        },
      });
  }

  addEmployee(): void {
    // Implement dialog or navigation to add form
    console.log('Add employee clicked');
    // Example: this.router.navigate(['/add-employee']);
  }

  editEmployee(employee: Employee): void {
    // Implement dialog or navigation to edit form
    console.log('Edit employee:', employee);
    // Example: this.router.navigate(['/edit-employee', employee._id]);
  }

  viewEmployee(employee: Employee): void {
    // Implement dialog or navigation to view details
    console.log('View employee:', employee);
    // Example: this.router.navigate(['/view-employee', employee._id]);
  }

  deleteEmployee(_id: string): void {
    if (confirm('Are you sure you want to delete this employee?')) {
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
          refetchQueries: [{
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
          `}],
        })
        .subscribe({
          next: () => {
            console.log('Employee deleted:', _id);
            this.fetchEmployees(); // Refresh the table
          },
          error: (error) => {
            console.error('Error deleting employee:', error);
          },
        });
    }
  }
}