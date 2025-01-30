import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SearchplanService } from '../../services/searchplan.service';
import { MatDialog } from '@angular/material/dialog';
import { BillGenerationCardComponent } from '../bill-generation-card/bill-generation-card.component';
import { CustomSnackbarComponent } from '../custom-snackbar/custom-snackbar.component';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UsageDetailsComponent } from '../usage-details/usage-details.component';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-search-plans',
  templateUrl: './search-plans.component.html',
  styleUrls: ['./search-plans.component.css'],
})
export class SearchPlansComponent implements OnInit {

  plans: any[] = [];
  existingPlans: any[] = [];
  allPlans: any[] = [];
  filteredPlans: any[] = [];
  filteredExistingPlans: any[] = [];
  searchText = '';
  selectedPlan = '';
  addedPlanName = '';
  showSuccessMessage = false;
  selectedDate: string | null = null;
  activeTab: string = 'existing';
  selectedPlanDetails: any = null;
  showDialog: boolean = false;
  showUnsubscribeDialog: boolean = false;
  unsubscribePlanName: string | null = null;
  requiredFrom: string | null = null;
  requiredTo: string | null = null;
  autoTerminate: boolean = false;
  alertRequired: boolean = false;
  isLoading: boolean = true;
  form: FormGroup;
  minDate: string | undefined;
  minRequiredToDate: string | undefined;
  rejectedPlans: any[] = [];

  @ViewChild(UsageDetailsComponent) usageDetailsComponent!: UsageDetailsComponent;

  billHistory: { [key: string]: any } = {};
  billHistoryForm: FormArray;
  selectedMonth: string = '';
  nextStatementDate: string = '';
  monthlyBills: any = {};

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private searchplanService: SearchplanService, private router: Router, private dialog: MatDialog) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
    this.minRequiredToDate = this.minDate;
    this.form = this.fb.group({
      requiredFrom: ['', Validators.required],
      requiredTo: ['', Validators.required],
      autoTerminate: [false],
      alertRequired: [false],
    });
    this.billHistoryForm = this.fb.array([]);
  }

  ngOnInit(): void {
    this.loadExistingPlans();
    this.combinePlans();
    this.isLoading = false;

    this.form.get('requiredFrom')!.valueChanges.subscribe(value => {
      this.minRequiredToDate = value;
      if (this.form.get('requiredTo')!.value < value) {
        this.form.get('requiredTo')!.setValue('');
      }
    });
    this.fetchRejectedPlans();
    this.fetchBillHistory();
  }

  fetchBillHistory(): void {
    const userId = parseInt(sessionStorage.getItem('userId') || '0', 10);
    this.isLoading = true;
    this.searchplanService.billhistory(userId).subscribe(
      (response) => {
        if (response) {
          this.nextStatementDate = response.nextStatementDate;
          this.billHistory = response.bills || {};
          this.populateBillHistoryForm();
        } else {
          this.billHistory = {};
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching bill history:', error);
        this.isLoading = false;
      }
    );
  }

  fetchMonthlyBills(): void {
    const userId = parseInt(sessionStorage.getItem('userId') || '0', 10);
    this.searchplanService.getMonthlyBills(userId).subscribe(
      (response) => {
        this.monthlyBills = response.bills;
        console.log('Monthly Bills:', this.monthlyBills);
        this.generatePDF();
      },
      (error) => {
        console.error('Error fetching monthly bills:', error);
      }
    );
  }

  generatePDF(): void {
    const doc = new jsPDF();
    let y = 10;

    doc.setFont('Arial', 'bold');
    doc.setFontSize(14);
    doc.text('Monthly Bills', 105, y, { align: 'center' });
    y += 10;

    for (const month in this.monthlyBills) {
      if (this.monthlyBills.hasOwnProperty(month)) {
        doc.setFontSize(12);
        doc.text(`Month: ${month}`, 105, y, { align: 'center' });
        y += 10;
        const plans = this.monthlyBills[month];
        for (const plan in plans) {
          if (plans.hasOwnProperty(plan)) {
            doc.setFont('Arial', 'bold');
            doc.text(`Plan: ${plan}`, 10, y);
            y += 10;
            doc.setFont('Arial', 'normal');
            const details = plans[plan];
            for (const key in details) {
              if (details.hasOwnProperty(key)) {
                let displayKey = key;
                if (key === 'billDate' || key === 'dueDate') {
                  details[key] = details[key].split('T')[0];
                }
                if (key === 'pricePerUnit') {
                  displayKey = 'Price Per Unit';
                } else if (key === 'units_consumed') {
                  displayKey = 'Units Consumed';
                } else if (key === 'totalCost') {
                  displayKey = 'Total Cost';
                  details[key] = `$ ${details[key]}`;
                } else if (key === 'billDate') {
                  displayKey = 'Billing Date';
                } else if (key === 'dueDate') {
                  displayKey = 'Due Date';
                }
                if (key !== 'usageBillId' && key !== 'userPlanId' && key !== 'response') {
                  doc.text(`${displayKey}: ${details[key]}`, 10, y);
                  y += 10;
                }
              }
            }
            y += 10; // Add space between plans
          }
        }
        const fileName = `${month.replace(' ', '_')}_Bills.pdf`;
            doc.save(fileName);
      }
    }

    doc.text(`Next Statement Date: ${this.nextStatementDate}`, 10, y);
  }
 
  populateBillHistoryForm(): void {
    this.billHistoryForm.clear();
    for (const month in this.billHistory) {
      if (this.billHistory.hasOwnProperty(month)) {
        const monthGroup = this.fb.group({});
        for (const plan in this.billHistory[month]) {
          if (this.billHistory[month].hasOwnProperty(plan)) {
            monthGroup.addControl(plan, this.fb.group({
              pricePerUnit: new FormControl(this.billHistory[month][plan].pricePerUnit),
              units_consumed: new FormControl(this.billHistory[month][plan].units_consumed),
              totalCost: new FormControl(this.billHistory[month][plan].totalCost),
              billDate: new FormControl(this.billHistory[month][plan].billDate),
              dueDate: new FormControl(this.billHistory[month][plan].dueDate),
            }));
          }
        }
        this.billHistoryForm.push(monthGroup);
      }
    }
  }
 
  onMonthChange(event: any): void {
    this.selectedMonth = event.target.value;
    this.resetFormValues();
    this.populateSelectedMonthValues();
  }
 
  resetFormValues(): void {
    this.billHistoryForm.controls.forEach((group: any) => {
      Object.keys(group.controls).forEach((key: string) => {
        group.get(key)?.reset();
      });
    });
  }
 
  populateSelectedMonthValues(): void {
    if (this.selectedMonth && this.billHistory[this.selectedMonth]) {
      const monthData = this.billHistory[this.selectedMonth];
      for (const plan in monthData) {
        if (monthData.hasOwnProperty(plan)) {
          const planGroup = this.getPlanFormGroup(plan);
          planGroup.patchValue({
            pricePerUnit: monthData[plan].pricePerUnit,
            units_consumed: monthData[plan].units_consumed,
            totalCost: monthData[plan].totalCost,
            billDate: monthData[plan].billDate,
            dueDate: monthData[plan].dueDate,
          });
        }
      }
    }
  }
 
  getPlanFormGroup(planKey: any): FormGroup {
    const monthIndex = this.billHistoryForm.controls.findIndex((group: any) => group.controls.hasOwnProperty(planKey));
    return this.billHistoryForm.at(monthIndex).get(planKey) as FormGroup;
  }
  loadExistingPlans(): void {
    const userId = parseInt(sessionStorage.getItem('userId') || '0', 10);
    this.searchplanService.existingPlans(userId).subscribe((data) => {
      this.existingPlans = data;
      this.filteredExistingPlans = [...this.existingPlans];
    });
  }
 
  fetchRejectedPlans(): void {
    const userId = parseInt(sessionStorage.getItem('userId') || '0', 10);
    this.isLoading = true;
    this.searchplanService.rejectedPlans(userId).subscribe(
      (plans) => {
        this.rejectedPlans = plans;
        console.log("refreshed list", plans);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching rejected plans:', error);
        this.isLoading = false;
      }
    );
  }
 
  deleteRejectedPlan(plan: any): void {
    this.searchplanService.deleteRejectedPlans(plan).subscribe(
      (response) => {
        if (response) {
          // Refresh the list after deletion
          this.fetchRejectedPlans();
          this.snackBar.openFromComponent(CustomSnackbarComponent, {
            data: {
              message: 'Plan Deleted Successfully.',
              action: 'X',
              icon: 'check_circle',
              iconColor: 'green'
            },
            duration: 3000
          });
        }
      },
      (error) => {
        console.error('Error deleting rejected plan:', error);
        this.snackBar.openFromComponent(CustomSnackbarComponent, {
          data: {
            message: 'Failed to Delete Plan.',
            action: 'X',
            icon: 'error',
            iconColor: 'red'
          },
          duration: 3000
        });
      }
    );
  }
 
  loadNewPlans(): void {
    const userId = parseInt(sessionStorage.getItem('userId') || '0', 10);
    this.searchplanService.newPlans(userId).subscribe((data) => {
      this.plans = data;
      this.filteredPlans = [...this.plans];
    });
  }
 
  combinePlans(): void {
    this.allPlans = [...this.existingPlans, ...this.plans];
  }
 
  setPlans(newPlans: any[], existingPlans: any[]) {
    this.plans = newPlans;
    this.existingPlans = existingPlans;
    this.combinePlans();
  }
 
  filterPlans(): void {
    if (this.activeTab === "new") {
      this.filteredPlans = this.plans.filter((plan) => {
        return (
          (!this.searchText ||
            plan.location.toLowerCase().startsWith(this.searchText.toLowerCase())) &&
          (!this.selectedPlan || plan.planName === this.selectedPlan) &&
          (!this.selectedDate || new Date(this.selectedDate) <= new Date())
        );
      });
    } else {
      this.filteredExistingPlans = this.existingPlans.filter((plan) => {
        return (
          (!this.searchText ||
            plan.location.toLowerCase().startsWith(this.searchText.toLowerCase())) &&
          (!this.selectedPlan || plan.planName === this.selectedPlan) &&
          (!this.selectedDate || new Date(this.selectedDate) <= new Date())
        );
      });
    }
 
  }
 
  filterPlansByDate(): void {
    const selectedDate = this.selectedDate ? new Date(this.selectedDate) : null;
    console.log("AKshay", this.activeTab, this.selectedDate, this.existingPlans);
 
    if (this.activeTab === "new") {
      if (selectedDate) {
        this.filteredPlans = this.plans.filter((plan) => {
          const planDate = plan.dateAdded ? new Date(plan.dateAdded) : null;
          return planDate && planDate.toDateString() === selectedDate.toDateString();
        });
      } else {
        this.filteredPlans = [...this.plans];
      }
    } else {
      if (selectedDate) {
        this.filteredExistingPlans = this.existingPlans.filter((plan) => {
          const planDate = plan.dateAdded ? new Date(plan.dateAdded) : null;
          return planDate && planDate.toDateString() === selectedDate.toDateString();
        });
      } else {
        this.filteredExistingPlans = [...this.existingPlans];
      }
    }
 
    console.log("AKshay", this.filteredPlans, this.filteredExistingPlans);
  }
 
  filterExistingPlans(): void {
    this.filteredExistingPlans = this.existingPlans.filter((plan) => {
      return (
        !this.searchText ||
        plan.location.toLowerCase().startsWith(this.searchText.toLowerCase())
      );
    });
  }
 
  clear(): void {
    this.searchText = '';
    this.selectedPlan = '';
    this.selectedDate = null;
    if (this.activeTab === 'new') {
      this.filteredPlans = [...this.plans];
    } else {
      this.filteredExistingPlans = [...this.existingPlans];
    }
  }
 
  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.clear();
    if (tab === 'new') {
      this.loadNewPlans();
    } else {
      this.loadExistingPlans();
    }
  }
 
  openUnsubscribeDialog(planName: string): void {
    console.log("Akshay", planName);
    this.unsubscribePlanName = planName;
    this.showUnsubscribeDialog = true;
    this.showDialog = false; // Ensure other dialogs are closed
  }
 
  closeUnsubscribeDialog(): void {
    this.showUnsubscribeDialog = false;
    this.unsubscribePlanName = null;
  }
 
  confirmUnsubscribe(): void {
    console.log("Prasad");
    if (this.unsubscribePlanName) {
      const userId = parseInt(sessionStorage.getItem('userId') || '0', 10);
      const plan = this.existingPlans.find((p) => p.planName === this.unsubscribePlanName);
      if (plan) {
        const userPlan = { userId, planId: plan.planId };
        this.searchplanService.unSubscribePlan(userPlan).subscribe({
          next: (response) => {
            const index = this.existingPlans.findIndex((p) => p.planName === this.unsubscribePlanName);
            if (index !== -1) {
              this.existingPlans.splice(index, 1);
              this.filteredExistingPlans = [...this.existingPlans];
              this.plans.push(plan);
              this.filteredPlans = [...this.plans];
            }
            this.isLoading = false;
            this.snackBar.openFromComponent(CustomSnackbarComponent, {
              data: {
                message: 'Plan UnSubscribed Successfully.',
                action: 'X',
                icon: 'check_circle',
                iconColor: 'green'
              },
              duration: 3000
            });
            this.loadExistingPlans(); // Reload existing plans
            this.loadNewPlans(); // Reload new plans
            this.closeUnsubscribeDialog();
          },
          error: (err) => {
            this.snackBar.openFromComponent(CustomSnackbarComponent, {
              data: {
                message: `Failed to unsubscribe from the plan`,
                action: 'X',
                icon: 'error',
                iconColor: 'red'
              },
              duration: 3000
            });
            this.closeUnsubscribeDialog();
          }
        });
      } else {
        this.snackBar.open('Plan not found', 'X', { duration: 3000 });
        this.closeUnsubscribeDialog();
      }
    }
  }
 
  addPlan(planName: string): void {
    const n_plan = this.plans.find((p) => p.planName === planName);
    if (n_plan) {
      const exists = this.existingPlans.some(
        (existingPlan) =>
          existingPlan.planName === n_plan.planName && existingPlan.location === n_plan.location
      );
      if (!exists) {
        this.existingPlans.push(n_plan);
        this.addedPlanName = n_plan.planName;
        this.showSuccessMessage = true;
        this.snackBar.open(`Plan "${n_plan.planName}" added successfully!`, 'X', { duration: 3000 });
 
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 3000);
      } else {
        this.snackBar.open(`Plan "${n_plan.planName}" at "${n_plan.location}" is already in your existing plans`, 'X', { duration: 3000 });
      }
    }
  }
 
  openDialog(plan: any): void {
    this.selectedPlanDetails = plan;
    this.showDialog = true;
    this.showUnsubscribeDialog = false; // Ensure other dialogs are closed
  }
 
  closeDialog(): void {
    this.showDialog = false;
    this.selectedPlanDetails = null;
    this.requiredFrom = null;
    this.requiredTo = null;
    this.autoTerminate = false;
    this.alertRequired = false;
  }
 
  subscribePlan(): void {
    if (this.form.invalid) {
      // this.snackBar.open('Please fill in all required fields.', 'X', { duration: 3000 });
      this.form.markAllAsTouched();
      return;
    }
 
    const userId = parseInt(sessionStorage.getItem('userId') || '0', 10);
    const requestedBy = sessionStorage.getItem('userName') || 'Unknown';
 
    const payload = {
      planId: this.selectedPlanDetails,
      userId: userId,
      planName: this.selectedPlanDetails.planName,
      location: this.selectedPlanDetails.location,
      price: this.selectedPlanDetails.price,
      requestedBy: requestedBy,
      requiredFrom: this.form.value.requiredFrom,
      requiredUpto: this.form.value.requiredTo,
      autoTerminated: this.form.value.autoTerminate,
      status: 'Pending',
      rejectionComment: 'NA',
      alertRequired: this.form.value.alertRequired,
      subscribed: false
    };
 
    this.searchplanService.subscribePlan(payload).subscribe({
      next: (response) => {
        this.isLoading = false;
        // this.snackBar.open('Plan subscribed successfully!', 'X', { duration: 3000 });
        this.snackBar.openFromComponent(CustomSnackbarComponent, {
          data: {
            message: 'Plan Subscribed Successfully!',
            action: 'X',
            icon: 'check_circle',
            iconColor: 'green'
          },
          duration: 3000
        })
        this.closeDialog();
        this.loadExistingPlans(); // Reload existing plans
        this.loadNewPlans(); // Reload new plans
      },
      error: (err) => {
        this.snackBar.openFromComponent(CustomSnackbarComponent, {
          data: {
            message: `Failed to Subscribe Plan`,
            action: 'X',
            icon: 'error',
            iconColor: 'red'
          },
          duration: 3000
        });
      }
    });
  }
 
  downloadBill(planId: number): void {
    const dialogRef = this.dialog.open(BillGenerationCardComponent, {
      width: '300px',
      data: { userPlanId: planId } // Pass the planId here
    });
 
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const billComponentInstance = dialogRef.componentInstance;
        billComponentInstance.onDownload();
        this.snackBar.openFromComponent(CustomSnackbarComponent, {
          data: {
            message: `Bill got downloaded`,
            action: 'X',
            icon: 'check_circle',
            iconColor: 'green'
          },
          duration: 3000
        });
      }
    });
  }
 
  checkUsage(): void {
    console.log("Component called");
    const userId = parseInt(sessionStorage.getItem('userId') || '0', 10);
    this.router.navigate(['/usage-Details'], { queryParams: { userId: userId } });
  }
}