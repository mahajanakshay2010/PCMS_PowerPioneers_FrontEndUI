import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../services/userservice/user-service.service';
import { WarningpopupComponent } from '../warningpopup/warningpopup.component';
import { CustomSnackbarComponent } from '../custom-snackbar/custom-snackbar.component';

@Component({
  selector: 'app-approve-requested-plan',
  templateUrl: './approve-requested-plan.component.html',
  styleUrls: ['./approve-requested-plan.component.css']
})
export class ApproveRequestedPlanComponent implements OnInit {
  plans: any[] = [];
  showApproveDialog: boolean = false;
  showRejectDialog: boolean = false;
  selectedPlanId: number | null = null;
  selectedPlanName: string | null = null;
  selectedRequestedBy: string | null = null;
  rejectionComment: string = ''; // Add this property
  isLoading: boolean = true;
  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.userService.getApplicationsWithNewStatus().subscribe(
      (response: any) => {
        this.plans = response.map((plan: any) => ({
          id: plan.userPlanId,
          location: plan.planId.location,
          name: plan.planId.planName,
          price: plan.planId.price,
          requestedBy: plan.requestedBy,
          status: plan.status,
          requiredFrom: plan.requiredFrom,
          requiredUpto: plan.requiredUpto,
          autoTerminated: plan.autoTerminated,
          rejectionComment: plan.rejectionComment,
          subscribed: plan.subscribed,
          alertRequired: plan.alertRequired,
          ...plan // Preserve other properties for later use
        }));
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Error fetching plans:', error);
      }
    );
  }

  openApproveDialog(planId: number, planName: string, requestedBy: string): void {
    this.selectedPlanId = planId;
    this.selectedPlanName = planName;
    this.selectedRequestedBy = requestedBy;
    this.showApproveDialog = true;
  }

  confirmApprove(): void {
    if (this.selectedPlanId !== null) {
      const plan = this.plans.find(p => p.id === this.selectedPlanId);
      if (plan) {
        const payload = { ...plan, status: 'Approved' };
        this.userService.approveRejectApplication(payload).subscribe(
          () => {
            // this.showSnackbar(`${plan.name} approved successfully`);
            this.snackBar.openFromComponent(CustomSnackbarComponent, {
              data: {
                message: `${plan.name} Approved Successfully`,
                action: 'X',
                icon: 'check_circle',
                iconColor: 'green'
              },
              duration: 3000
            })
            this.loadPlans(); // Refresh the list
            this.closeApproveDialog();
          },
          (error) => {
            console.error('Error approving plan:', error);
            this.snackBar.openFromComponent(CustomSnackbarComponent, {
              data: {
                message:`Failed to Approve Plan`,
                action: 'X',
                icon: 'error',
                iconColor: 'red'
              },
              duration: 3000
            });
          }
        );
      }
    }
  }

  closeApproveDialog(): void {
    this.showApproveDialog = false;
    this.selectedPlanId = null;
    this.selectedPlanName = null;
    this.selectedRequestedBy = null;
  }

  openRejectDialog(planId: number, planName: string, requestedBy: string): void {
    this.selectedPlanId = planId;
    this.selectedPlanName = planName;
    this.selectedRequestedBy = requestedBy;
    this.showRejectDialog = true;
  }

  confirmReject(): void {
    if (this.selectedPlanId !== null) {
      const plan = this.plans.find(p => p.id === this.selectedPlanId);
      if (plan) {
        const payload = { ...plan, status: 'Rejected', rejectionComment: this.rejectionComment }; // Include rejection comment
        this.userService.approveRejectApplication(payload).subscribe(
          () => {
            // this.showSnackbar(`${plan.name} rejected successfully`);
            this.snackBar.openFromComponent(CustomSnackbarComponent, {
              data: {
                message: `${plan.name} Rejected Successfully`,
                action: 'X',
                icon: 'check_circle',
                iconColor: 'green'
              },
              duration: 3000
            })
            this.loadPlans(); // Refresh the list
            this.closeRejectDialog();
          },
          (error) => {
            console.error('Error rejecting plan:', error);
            this.snackBar.openFromComponent(CustomSnackbarComponent, {
              data: {
                message:`Failed to Reject Plan`,
                action: 'X',
                icon: 'error',
                iconColor: 'red'
              },
              duration: 3000
            });
          }
        );
      }
    }
  }

  closeRejectDialog(): void {
    this.showRejectDialog = false;
    this.selectedPlanId = null;
    this.selectedPlanName = null;
    this.selectedRequestedBy = null;
    this.rejectionComment = ''; // Reset the rejection comment
  }

  private showSnackbar(message: string): void {
    this.snackBar.open(message, 'X', {
      duration: 3000
    });
  }
}