import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { PlanService, Plan } from '../../services/plan.service';
import { Observable } from 'rxjs';
import { EditPlanDialogComponent } from '../edit-plan-dialog/edit-plan-dialog.component';
import { AddPlanDialogComponent } from '../add-plan-dialog/add-plan-dialog.component';
import { CustomSnackbarComponent } from '../custom-snackbar/custom-snackbar.component';
import { WarningDialogComponent } from '../warning-dialog/warning-dialog.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    FormsModule // Add FormsModule to imports
  ],
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.css']
})
export class PlansComponent implements OnInit {
  plans$: Observable<Plan[]>;
  allPlans: Plan[] = [];
  filteredPlans: Plan[] = [];
  searchText = '';
  selectedPlan = '';
  selectedDate: string | null = null;
  isLoading: boolean = true;

  constructor(private planService: PlanService, private dialog: MatDialog, private snackBar: MatSnackBar) {
    this.plans$ = new Observable<Plan[]>();
  }

  ngOnInit(): void {
    this.fetchPlans();
  }

  fetchPlans(): void {
    this.planService.fetchAllPlans();
    this.plans$ = this.planService.plans$;
    this.plans$.subscribe(plans => {
      this.allPlans = plans;
      this.filteredPlans = plans;
    });
    this.isLoading = false;
  }

  addPlan(): void {
    const dialogRef = this.dialog.open(AddPlanDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.planService.addPlan(result).subscribe(() => {
          this.snackBar.openFromComponent(CustomSnackbarComponent, {
            data: {
              message: `Plan added successfully!`,
              action: 'X',
              icon: 'check_circle',
              iconColor: 'green'
            },
            duration: 3000
          });
          this.fetchPlans(); 
        });
      }
    });
  }

  editPlan(plan: Plan): void {
    const dialogRef = this.dialog.open(EditPlanDialogComponent, {
      width: '300px',
      data: { plan }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.planService.updatePlan(result).subscribe(() => {
          this.snackBar.openFromComponent(CustomSnackbarComponent, {
            data: {
              message: `Plan updated successfully!`,
              action: 'X',
              icon: 'check_circle',
              iconColor: 'green'
            },
            duration: 3000
          });
          this.fetchPlans(); 
        });
      }
    });
  }

  deletePlan(planId: number): void {
    const dialogRef = this.dialog.open(WarningDialogComponent, {
      width: '400px',
      data: { planId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.planService.deletePlan(planId).subscribe(
          () => {
            this.snackBar.openFromComponent(CustomSnackbarComponent, {
              data: {
                message: `Plan deleted successfully!`,
                action: 'X',
                icon: 'check_circle', 
                iconColor: 'green'
              },
              duration: 3000
            });
            this.fetchPlans(); 
          },
          (error) => {
            this.snackBar.openFromComponent(CustomSnackbarComponent, {
              data: {
                message: `Failed to delete plan. Please try again.`,
                action: 'X',
                icon: 'error',
                iconColor: 'red'
              },
              duration: 3000
            });
          }
        );
      }
    });
  }

  filterPlans(): void {
    this.filteredPlans = this.allPlans.filter((plan) => {
      return (
        (!this.searchText || plan.location.toLowerCase().includes(this.searchText.toLowerCase())) &&
        (!this.selectedPlan || plan.planName === this.selectedPlan) &&
        (!this.selectedDate || (plan.dateAdded && new Date(plan.dateAdded).toDateString() === new Date(this.selectedDate).toDateString()))
      );
    });
  }

  filterPlansByDate(): void {
    const selectedDate = this.selectedDate ? new Date(this.selectedDate) : null;

    if (selectedDate) {
      this.filteredPlans = this.allPlans.filter((plan) => {
        const planDate = plan.dateAdded ? new Date(plan.dateAdded) : null;
        return planDate && planDate.toDateString() === selectedDate.toDateString();
      });
    } else {
      this.filteredPlans = [...this.allPlans];
    }
  }

  clear(): void {
    this.searchText = '';
    this.selectedPlan = '';
    this.selectedDate = null;
    this.filteredPlans = [...this.allPlans];
  }
}