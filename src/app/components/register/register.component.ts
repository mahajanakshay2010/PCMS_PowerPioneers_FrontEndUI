import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../models/user.model';
import { UserService } from '../../services/userservice/user-service.service';
import { CustomSnackbarComponent } from '../custom-snackbar/custom-snackbar.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{3}-\d{3}-\d{4}$/)]],
      mailId: ['', [Validators.required, Validators.email]],
      ssn: ['', [Validators.required, Validators.pattern(/^\d{3}-\d{2}-\d{4}$/)]],
      addressLine1: ['', Validators.required],
      addressLine2: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
      confirmPassword: ['', [Validators.required]],
      status: "NEW",
      rejectionComment: "NA",
      role: "USER"
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ matchPassword: true });
      return { matchPassword: true };
    } else {
      return null;
    }
  }

  // Method to get form values as a User object
  getUserFromForm(): User {
    return this.registerForm.value as User;
  }

  // Getters for form controls
  get fullName() { return this.registerForm.get('fullName'); }
  get mailId() { return this.registerForm.get('mailId'); }
  get phoneNumber() { return this.registerForm.get('phoneNumber'); }
  get ssn() { return this.registerForm.get('ssn'); }
  get addressLine1() { return this.registerForm.get('addressLine1'); }
  get addressLine2() { return this.registerForm.get('addressLine2'); }
  get zipCode() { return this.registerForm.get('zipCode'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }

  // Form submission handler
  onSubmit(): void {
    if (this.registerForm.valid) {
      this.userService.createUser(this.getUserFromForm()).subscribe(
        response => {
          this.snackBar.openFromComponent(CustomSnackbarComponent, {
            data: {
              message: `Registration Successful`,
              action: 'X',
              icon: 'check_circle',
              iconColor: 'green'
            },
            duration: 3000
            //panelClass: ['custom-snackbar']
          });
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error => {
          const errorMessage = error.error.errordesc || 'Error creating user';
          this.snackBar.openFromComponent(CustomSnackbarComponent, {
            data: {
              message: errorMessage || 'Login failed',
              action: 'X',
              icon: 'error',
              iconColor: 'red'
            },
            duration: 3000,
            //panelClass: ['custom-snackbar'],
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
          });
          console.error('Error creating user', error);
        }
      );
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
