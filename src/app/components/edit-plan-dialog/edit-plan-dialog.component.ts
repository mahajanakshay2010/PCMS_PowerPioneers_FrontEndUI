import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Plan, PlanService } from '../../services/plan.service';
import { CustomSnackbarComponent } from '../custom-snackbar/custom-snackbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-plan-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    CommonModule
  ],
  templateUrl: './edit-plan-dialog.component.html',
  styleUrls: ['./edit-plan-dialog.component.css']
})
export class EditPlanDialogComponent {
  planForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditPlanDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { plan: Plan },
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private planService : PlanService
  ) {
    this.planForm = this.fb.group({
      planId: [data.plan.planId],
      location: [data.plan.location, Validators.required],
      planName: [data.plan.planName, Validators.required],
      price: [data.plan.price, [Validators.required, Validators.min(0)]],
      description: [data.plan.description],
      dateAdded: [data.plan.dateAdded]
    });
  }

  clearField(field: string): void {
    this.planForm.get(field)?.setValue('');
  }

  onSave(): void {
    if (this.planForm.valid) {
      this.dialogRef.close(this.planForm.value);
      this.snackBar.openFromComponent(CustomSnackbarComponent, {
        data: {
          message: `Plan updated successfully`,
          action: 'X',
          icon: 'check_circle',
          iconColor: 'green'
        },
        duration: 3000
      });
      // this.planService.fetchAllPlans()
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}