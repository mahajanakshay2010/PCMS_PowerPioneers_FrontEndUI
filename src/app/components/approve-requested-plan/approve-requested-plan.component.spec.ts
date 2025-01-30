import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApproveRequestedPlanComponent } from './approve-requested-plan.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../services/user-service.service';
import { of } from 'rxjs';
import { WarningDialogComponent } from '../warning-popup/warning-popup.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ApproveRequestedPlanComponent', () => {
  let component: ApproveRequestedPlanComponent;
  let fixture: ComponentFixture<ApproveRequestedPlanComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['getUsersWithStatusNew', 'updateUserStatus']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [ApproveRequestedPlanComponent, WarningDialogComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: MatDialog, useValue: mockDialog },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ApproveRequestedPlanComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    mockUserService.getUsersWithStatusNew.and.returnValue(of([
      { userPlanId: 1, planId: { location: 'New York', planName: 'Premium', price: 100 }, requestedBy: 'John Doe', status: 'NEW', requiredFrom: '2024-01-01', requiredUpto: '2024-01-10' }
    ]));
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load plans on init', () => {
    fixture.detectChanges();
    expect(component.plans.length).toBe(1);
    expect(component.plans[0].name).toBe('Premium');
  });

  it('should call approve method and show snackbar on success', () => {
    const planId = 1;
    const planName = 'Premium';
    spyOn(component, 'confirmAction').and.callThrough();
    mockUserService.updateUserStatus.and.returnValue(of(null));

    component.approve(planId, planName);

    expect(component.confirmAction).toHaveBeenCalled();
    expect(mockUserService.updateUserStatus).toHaveBeenCalledWith(jasmine.objectContaining({ status: 'Approved' }));
    expect(mockSnackBar.open).toHaveBeenCalledWith(`${planName} approved successfully`, 'X', { duration: 3000 });
  });

  it('should call reject method and show snackbar on success', () => {
    const planId = 1;
    const planName = 'Premium';
    spyOn(component, 'confirmAction').and.callThrough();
    mockUserService.updateUserStatus.and.returnValue(of(null));

    component.reject(planId, planName);

    expect(component.confirmAction).toHaveBeenCalled();
    expect(mockUserService.updateUserStatus).toHaveBeenCalledWith(jasmine.objectContaining({ status: 'Rejected' }));
    expect(mockSnackBar.open).toHaveBeenCalledWith(`${planName} rejected successfully`, 'X', { duration: 3000 });
  });

  it('should open dialog on confirmAction', () => {
    const title = 'Test Title';
    const message = 'Test Message';
    const action = jasmine.createSpy('action');
    const dialogRef = { afterClosed: () => of(true) };
    mockDialog.open.and.returnValue(dialogRef as any);

    component.confirmAction(title, message, action);

    expect(mockDialog.open).toHaveBeenCalledWith(WarningDialogComponent, { data: { title, message } });
    dialogRef.afterClosed().subscribe(() => {
      expect(action).toHaveBeenCalled();
    });
  });

});
