import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/userservice/user-service.service';
import { CustomSnackbarComponent } from '../custom-snackbar/custom-snackbar.component';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-approve-new-registration',
  templateUrl: './approve-new-registration.component.html',
  styleUrls: ['./approve-new-registration.component.css'],
})
export class ApproveNewRegistrationsComponent implements OnInit {
  users: any[] = []; // Only the users with "NEW" status
  showApproveAllDialog: boolean = false;
  showRejectAllDialog: boolean = false;
  showApproveDialog: boolean = false;
  showRejectDialog: boolean = false;
  selectedUserId: number | null = null;
  selectedUserName: string | null = null;
  rejectionComment: string = ''; // Add this property
  isLoading: boolean = true;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  // Fetching all the users with "NEW" status only
  loadUsers(): void {
    this.userService.getUsersWithStatusNew().subscribe(
      (data) => {
        this.users = data.map(user => ({
          id: user.userId,
          name: user.fullName,
          email: user.mailId,
          phone: user.phoneNumber,
          address: `${user.addressLine1}, ${user.addressLine2}`,
          zip: user.zipCode,
          ...user, // Preserving other user properties for later use
        }));
        this.cdr.detectChanges(); // Manually trigger change detection
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  // For approving a single user
  openApproveDialog(userId: number, userName: string): void {
    this.selectedUserId = userId;
    this.selectedUserName = userName;
    this.showApproveDialog = true;
  }

  confirmApprove(): void {
    if (this.selectedUserId !== null) {
      const user = this.users.find(user => user.id === this.selectedUserId);
      if (user) { 
        const payload = { ...user, status: 'Approved' };
        this.userService.updateUserStatus(payload).subscribe(
          () => {
            this.snackBar.openFromComponent(CustomSnackbarComponent, {
              data: {
                message: `User ${user.name} approved successfully!`,
                action: 'X',
                icon: 'check_circle',
                iconColor: 'green'
              },
              duration: 3000
            });
            this.loadUsers(); // Refresh the list
            this.closeApproveDialog();
          },
          (error) => {
            console.error('Error approving user:', error);
            this.snackBar.openFromComponent(CustomSnackbarComponent, {
              data: {
                message:`Failed to Approve User`,
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
    this.selectedUserId = null;
    this.selectedUserName = null;
  }

  // For rejection of a single user
  openRejectDialog(userId: number, userName: string): void {
    this.selectedUserId = userId;
    this.selectedUserName = userName;
    this.showRejectDialog = true;
  }

  confirmReject(): void {
    if (this.selectedUserId !== null) {
      const user = this.users.find(user => user.id === this.selectedUserId);
      if (user) {
        const payload = { ...user, status: 'Rejected', rejectionComment: this.rejectionComment }; // Include rejection comment
        this.userService.updateUserStatus(payload).subscribe(
          () => {
            this.snackBar.openFromComponent(CustomSnackbarComponent, {
              data: {
                message: `User ${user.name} rejected successfully!`,
                action: 'X',
                icon: 'check_circle',
                iconColor: 'green'
              },
              duration: 3000
            });
            this.loadUsers(); // Refresh the list
            this.closeRejectDialog();
          },
          (error) => {
            console.error('Error rejecting user:', error);
            this.snackBar.openFromComponent(CustomSnackbarComponent, {
              data: {
                message:`Failed to Reject User`,
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
    this.selectedUserId = null;
    this.selectedUserName = null;
    this.rejectionComment = ''; // Reset the rejection comment
  }

  // For Approve-all displayed users
  approveAll(): void {
    const payload = this.users.map(user => ({ ...user, status: 'Approved' }));
    this.userService.updateMultipleUserStatus(payload).subscribe(
      () => {
        this.snackBar.openFromComponent(CustomSnackbarComponent, {
          data: {
            message: `All users approved successfully!`,
            action: 'X',
            icon: 'check_circle',
            iconColor: 'green'
          },
          duration: 3000
        });
        this.loadUsers(); // Refresh the list
      },
      (error) => {
        console.error('Error approving all users:', error);
      }
    );
  }

  openApproveAllDialog(): void {
    this.showApproveAllDialog = true;
  }

  closeApproveAllDialog(): void {
    this.showApproveAllDialog = false;
  }

  confirmApproveAll(): void {
    this.approveAll();
    this.closeApproveAllDialog();
  }

  // For Reject-all displayed users
  rejectAll(): void {
    const payload = this.users.map(user => ({ ...user, status: 'Rejected', rejectionComment: this.rejectionComment })); // Include rejection comment
    this.userService.updateMultipleUserStatus(payload).subscribe(
      () => {
        this.snackBar.openFromComponent(CustomSnackbarComponent, {
          data: {
            message: `All users rejected successfully!`,
            action: 'X',
            icon: 'check_circle',
            iconColor: 'green'
          },
          duration: 3000
        });
        this.loadUsers(); // Refresh the list
      },
      (error) => {
        console.error('Error rejecting all users:', error);
      }
    );
  }

  openRejectAllDialog(): void {
    this.showRejectAllDialog = true;
  }

  closeRejectAllDialog(): void {
    this.showRejectAllDialog = false;
  }

  confirmRejectAll(): void {
    this.rejectAll();
    this.closeRejectAllDialog();
  }
}