import { Component,Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
@Component({
  selector: 'app-custom-snackbar',
  template: `<div style="display: flex; align-items: center; justify-content: space-between;">
    <div style="display: flex; align-items: center;">
        <mat-icon style="margin-right: 8px; color: {{ data.iconColor }};">
        {{ data.icon }}
      </mat-icon>
      <span>{{ data.message }}</span>
    </div>
    <button mat-button style=" font-size: 12px;
    color: white;padding: 0px;margin: 0px; height: 10px;" (click)="closeSnackbar()">{{ data.action }}</button>
  </div>`,
  styleUrl: './custom-snackbar.component.css'
})
export class CustomSnackbarComponent {
  constructor(
    public snackBarRef: MatSnackBarRef<CustomSnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: { message: string; action: string; icon: string; iconColor: string }
  ) {}

  closeSnackbar() {
    this.snackBarRef.dismiss();
  }
}
