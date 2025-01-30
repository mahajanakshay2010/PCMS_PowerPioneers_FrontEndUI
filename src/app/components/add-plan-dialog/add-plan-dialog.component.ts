import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlanService } from '../../services/plan.service';
import { CustomSnackbarComponent } from '../custom-snackbar/custom-snackbar.component';

@Component({
  selector: 'app-add-plan-dialog',
  templateUrl: './add-plan-dialog.component.html',
  styleUrls: ['./add-plan-dialog.component.css']
})
export class AddPlanDialogComponent {
  planForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddPlanDialogComponent>,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private planService : PlanService
  ) {
    this.planForm = this.fb.group({
      location: ['', Validators.required],
      planName: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]]
    }); 
  }

  onAdd(): void {
    if (this.planForm.valid) {
      this.dialogRef.close(this.planForm.value);
      this.snackBar.openFromComponent(CustomSnackbarComponent, {
        data: {
          message: 'Plan added successfully',
          icon: 'check_circle',
          iconColor: 'green'
        },
        duration: 3000
      });
      this.planService.fetchAllPlans();
    } else {
      this.planForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  clearField(field: string): void {
    this.planForm.get(field)!.reset();
  }
}