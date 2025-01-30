import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-unsubscribe-warning-dialog',
  templateUrl: './unsubscribe-warning-dialog.component.html',
  styleUrl: './unsubscribe-warning-dialog.component.css'
})
export class UnsubscribeWarningDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UnsubscribeWarningDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  onProceed(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
