import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ApproveNewRegistrationsComponent } from './components/approve-new-registration/approve-new-registration.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { AuthInterceptor } from './auth.interceptor';
import { LoginComponent } from './components/login/login.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SearchPlansComponent } from './components/search-plans/search-plans.component';
import { AddPlanDialogComponent } from './components/add-plan-dialog/add-plan-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomSnackbarComponent } from './components/custom-snackbar/custom-snackbar.component';
import { WarningDialogComponent } from './components/warning-dialog/warning-dialog.component';
import { ApproveRequestedPlanComponent } from './components/approve-requested-plan/approve-requested-plan.component';
import { WarningpopupComponent } from './components/warningpopup/warningpopup.component';
/*import { AddPlanDialogComponent } from './components/add-plan-dialog/add-plan-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';*/
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UsageDetailsComponent } from './components/usage-details/usage-details.component';
import { ChartModule } from 'primeng/chart';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ApproveNewRegistrationsComponent,
    FooterComponent,
    NavbarComponent,
    RegisterComponent,
    LoginComponent,
    SearchPlansComponent,
    AddPlanDialogComponent,
    CustomSnackbarComponent,
    WarningDialogComponent,
    WarningDialogComponent,
    ApproveRequestedPlanComponent,
    WarningpopupComponent,
    CustomSnackbarComponent,
    UsageDetailsComponent

  ],
  imports: [
    /*HttpClientModule,
    MatSnackBarModule,
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule*/
    HttpClientModule,
    MatSnackBarModule,
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatCardModule, // Ensure MatCardModule is imported here
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule, // Ensure MatDialogModule is imported here
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    ChartModule
  ],

  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }

