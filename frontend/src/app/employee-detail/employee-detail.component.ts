import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

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
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatButtonModule],
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css'],
})
export class EmployeeDetailComponent implements OnInit {
  displayedColumns: string[] = [
    'first_name',
    'last_name',
    'email',
    'gender',
    'designation',
    'salary',
    'date_of_joining',
    'department',
    // 'employee_photo',
  ];
  dataSource: Employee[] = [];
  employeeId: string | null = null;

  constructor(private route: ActivatedRoute, private apollo: Apollo) { }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    if (this.employeeId) {
      this.fetchEmployee();
    }
  }

  fetchEmployee(): void {
    this.apollo
      .query<{ getEmployee: Employee }>({
        query: gql`
          query GetEmployee($id: ID!) {
            getEmployee(_id: $id) {
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
        variables: { id: this.employeeId },
      })
      .subscribe({
        next: (result) => {
          this.dataSource = [result.data.getEmployee]; // Single employee in array for table
          console.log('Employee details:', this.dataSource);
        },
        error: (error) => {
          console.error('Error fetching employee:', error);
        },
      });
  }
}