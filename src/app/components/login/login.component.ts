import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from "../../services/userservice/user-service.service";
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { MatSnackBar } from "@angular/material/snack-bar";
import { JwtRequest, JwtResponse } from "../../models/user.model";
import { CustomSnackbarComponent } from "../custom-snackbar/custom-snackbar.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginform: FormGroup;
  showPassword: boolean = false; // Property to manage password visibility
  faEye = faEye; // FontAwesome icon
  faEyeSlash = faEyeSlash; // FontAwesome icon

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar,
  ) {
    this.loginform = this.fb.group({
      mailId: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
    });
    sessionStorage.clear();
  }

  // Getters for form controls
  get mailId(): FormControl { return this.loginform.get('mailId') as FormControl; }
  get password(): FormControl { return this.loginform.get('password') as FormControl; }

  // Form submission handler
  onSubmit(): void {
    if (this.loginform.valid) {
      const { mailId, password } = this.loginform.value;
      const loginRequest: JwtRequest = { userName: mailId, password };

      this.userService.login(loginRequest).subscribe({
        next: (res: JwtResponse) => {
          if (res.tokenString) {
            // Token is not empty, login successful
            /*this.snackBar.open('Login successful!', 'X', {
              duration: 3000,
              verticalPosition: 'bottom',
              horizontalPosition: 'center',
              
            });*/
            this.snackBar.openFromComponent(CustomSnackbarComponent, {
              data: {
                message: 'Login Successfull!',
                action: 'X',
                icon: 'check_circle',
                iconColor: 'green'
              },
              duration: 3000,
              
            });
            if(res.role === "ADMIN"){
              setTimeout(() => {
                this.router.navigate(['/approve-new-registrations']);
              }, 2000);
            } else if (res.role === "USER") {
              setTimeout(() => {
                this.router.navigate(['/search-plan']);
              }, 2000);
            }
            sessionStorage.setItem('token', res.tokenString);
            sessionStorage.setItem('userName', res.userNameString);
            sessionStorage.setItem('role', res.role);
            sessionStorage.setItem('userId', res.userId.toString());
          } else {
            // Token is empty, display message from API response
            this.snackBar.openFromComponent(CustomSnackbarComponent, {
              data: {
                message: res.responseMessage || 'Login failed',
                action: 'X',
                icon: 'error',
                iconColor: 'red'
              },
              duration: 3000,
              verticalPosition: 'bottom',
              horizontalPosition: 'center',
            });
          }
        },
        error: (err) => {
          // Optionally show an error message using MatSnackBar
          this.snackBar.openFromComponent(CustomSnackbarComponent, {
            data: {
              message: err.error.message || 'Invalid credentials',
              action: 'X',
              icon: 'error',
              iconColor: 'red'
            },
            duration: 3000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
          });
        }
      });
    } else {
      this.loginform.markAllAsTouched();
    }
  }

  // Method to toggle password visibility
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}