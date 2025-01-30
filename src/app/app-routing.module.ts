
import { ApplicationRef, NgModule } from '@angular/core';
import { GuardResult, MaybeAsync, RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ApproveNewRegistrationsComponent } from './components/approve-new-registration/approve-new-registration.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { SearchPlansComponent } from './components/search-plans/search-plans.component';
import { PlansComponent } from './components/plans/plans.component';
import { AuthGuard } from './guards/auth.guard';
import { retry } from 'rxjs';
import { BillGenerationCardComponent } from './components/bill-generation-card/bill-generation-card.component';
import { ApproveRequestedPlanComponent } from './components/approve-requested-plan/approve-requested-plan.component';
import { UsageDetailsComponent } from './components/usage-details/usage-details.component';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'plans', component: PlansComponent, canActivate: [AuthGuard], data: { role: 'ADMIN' } },
  //{ path: 'bill-generation-card', component: BillGenerationCardComponent },
  { path: 'approve-new-registrations', component: ApproveNewRegistrationsComponent, canActivate: [AuthGuard], data: { role: 'ADMIN' } },
  { path: 'approve-plans', component: ApproveRequestedPlanComponent, canActivate: [AuthGuard], data: { role: 'ADMIN' } },
  { path: 'search-plan', component: SearchPlansComponent, canActivate: [AuthGuard], data: { role: 'USER' } },
  { path: 'usage-Details', component: UsageDetailsComponent, canActivate: [AuthGuard], data: { role: 'USER' } },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
