import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { EmployeeFormComponent } from "../employeeform/employeeform.component";
import { DeleteConfirmDialogComponent } from "../delete-confirm-dialog.component";
import { Router, RouterModule } from "@angular/router";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { CsvUploadDialogComponent } from "../../csv-upload-dialog/csv-upload-dialog.component";

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
  selector: "app-employee",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: "./employees.component.html",
  styleUrls: ["./employees.component.css"],
})
export class EmployeeComponent implements OnInit {
  displayedColumns: string[] = [
    "first_name",
    "last_name",
    "email",
    "gender",
    "designation",
    "salary",
    "date_of_joining",
    "department",
    "actions",
  ];
  dataSource: Employee[] = [];
  searchForm: FormGroup;

  constructor(
    private apollo: Apollo,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      designation: [""],
      department: [""],
    });
  }

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
        fetchPolicy: "network-only",
      })
      .subscribe({
        next: (result) => {
          this.dataSource = [...result.data.getAllEmployees];
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.snackBar.open("Error fetching employees: " + error.message, "Close", {
            duration: 5000,
          });
        },
      });
  }

  openCsvUploadDialog(): void {
    const dialogRef = this.dialog.open(CsvUploadDialogComponent, {
      width: "500px",
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchEmployees();
      }
    });
  }

  search(): void {
    const { designation, department } = this.searchForm.value;
    if (!designation && !department) {
      this.snackBar.open("Please provide at least one search criterion", "Close", {
        duration: 3000,
      });
      return;
    }
    this.router.navigate(["/employees/searchResult"], { queryParams: { designation, department } });
  }

  editEmployee(employee: Employee): void {
    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      width: "700px",
      maxHeight: "90vh",
      data: { employee },
    });
    dialogRef.componentInstance.formSubmitted.subscribe(() => {
      this.fetchEmployees();
      dialogRef.close();
    });
  }

  addEmployee(): void {
    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      width: "700px",
      maxHeight: "90vh",
    });
    dialogRef.componentInstance.formSubmitted.subscribe(() => {
      this.fetchEmployees();
      dialogRef.close();
    });
  }

  viewEmployee(employee: Employee): void {
    this.router.navigate(["/employee/view", employee._id]);
  }

  deleteEmployee(_id: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: "400px",
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
              this.snackBar.open("Employee deleted successfully!", "Close", { duration: 3000 });
              this.fetchEmployees();
            },
            error: (error) => {
              this.snackBar.open("Error deleting employee: " + error.message, "Close", {
                duration: 5000,
              });
            },
          });
      }
    });
  }
}