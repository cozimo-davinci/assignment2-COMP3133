import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-delete-confirm-dialog',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule],
    template: `
    <h2 mat-dialog-title>Confirm Deletion</h2>
    <mat-dialog-content>
      <p>Are you sure you want to delete this employee?</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="warn" (click)="onConfirm()">Delete</button>
    </mat-dialog-actions>
  `,
    styles: [`
    mat-dialog-content {
      padding: 20px;
    }
    mat-dialog-actions {
      padding: 10px;
    }
  `],
})
export class DeleteConfirmDialogComponent {
    constructor(public dialogRef: MatDialogRef<DeleteConfirmDialogComponent>) { }

    onCancel(): void {
        this.dialogRef.close(false);
    }

    onConfirm(): void {
        this.dialogRef.close(true);
    }
}