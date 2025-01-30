import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-logout-warning-dialog',
  templateUrl: './logout-warning-dialog.component.html',
  styleUrl: './logout-warning-dialog.component.css'
})
export class LogoutWarningDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<LogoutWarningDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  onProceed(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
