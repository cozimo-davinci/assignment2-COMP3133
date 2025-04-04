import { Component, ViewChild, ElementRef } from "@angular/core";
import { MatDialogRef, MatDialogModule } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import * as Papa from "papaparse";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-csv-upload-dialog",
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: "./csv-upload-dialog.component.html",
  styleUrls: ["./csv-upload-dialog.component.css"],
})
export class CsvUploadDialogComponent {
  selectedFile: File | null = null;
  uploading = false;
  isDragOver = false;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>; // Reference to the file input

  constructor(
    private dialogRef: MatDialogRef<CsvUploadDialogComponent>,
    private snackBar: MatSnackBar,
    private apollo: Apollo
  ) { }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(): void {
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.selectedFile = event.dataTransfer.files[0];
    }
  }

  clearFile(): void {
    this.selectedFile = null;
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = ''; // Reset the file input value
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  uploadCsv(): void {
    if (!this.selectedFile) {
      this.snackBar.open("Please select a file", "Close", { duration: 3000 });
      return;
    }

    if (!this.selectedFile.name.endsWith(".csv")) {
      this.snackBar.open("Please upload a CSV file", "Close", { duration: 3000 });
      return;
    }

    this.uploading = true;

    Papa.parse(this.selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<any>) => {
        const employees = results.data;
        const expectedHeaders = [
          "first_name",
          "last_name",
          "email",
          "gender",
          "designation",
          "salary",
          "date_of_joining",
          "department",
          "employee_photo",
        ];
        const actualHeaders = results.meta.fields || [];

        if (!expectedHeaders.every((header) => actualHeaders.includes(header))) {
          this.snackBar.open("CSV headers do not match expected fields", "Close", {
            duration: 5000,
          });
          this.uploading = false;
          return;
        }

        const formattedEmployees = employees.map((emp) => ({
          first_name: emp.first_name,
          last_name: emp.last_name,
          email: emp.email,
          gender: emp.gender,
          designation: emp.designation,
          salary: parseFloat(emp.salary),
          date_of_joining: emp.date_of_joining,
          department: emp.department,
          employee_photo: emp.employee_photo,
        }));

        this.apollo
          .mutate({
            mutation: gql`
              mutation AddMultipleEmployees($inputs: [EmployeeInput!]!) {
                addMultipleEmployees(inputs: $inputs) {
                  _id
                }
              }
            `,
            variables: { inputs: formattedEmployees },
          })
          .subscribe({
            next: () => {
              this.snackBar.open("Employees uploaded successfully", "Close", {
                duration: 3000,
              });
              this.dialogRef.close(true);
            },
            error: (error) => {
              this.snackBar.open("Error uploading employees: " + error.message, "Close", {
                duration: 5000,
              });
              this.uploading = false;
            },
          });
      },
      error: (error) => {
        this.snackBar.open("Error parsing CSV: " + error.message, "Close", { duration: 5000 });
        this.uploading = false;
      },
    });
  }
}