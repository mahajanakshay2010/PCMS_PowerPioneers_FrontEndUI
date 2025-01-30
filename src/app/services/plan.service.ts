import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface Plan {
  planId: number;
  description: string;
  location: string;
  planName: string;
  price: number;
  dateAdded: Date | null;
}

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private apiUrl = "http://localhost:8080/plan/";

  private plans = new BehaviorSubject<Plan[]>([]);
  plans$: Observable<Plan[]> = this.plans.asObservable();

  constructor(private http: HttpClient) {
    this.fetchAllPlans();
  }

  get currentPlans(): Plan[] {
    return this.plans.value;
  }

  fetchAllPlans(): void {
    this.http.get<{ message: string, plans: Plan[] }>(`${this.apiUrl}fetchAllPlans`)
      .pipe(map(response => response.plans))
      .subscribe(plans => {
        this.plans.next(plans);
      });
  }

  addPlan(plan: Plan): Observable<Plan> {
    return this.http.post<Plan>(`${this.apiUrl}addPlan`, plan).pipe(
      map(newPlan => {
        const currentPlans = this.plans.value;
        this.plans.next([...currentPlans, newPlan]);
        return newPlan;
      })
    );
  }

  deletePlan(planId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}deletePlan/${planId}`).pipe(
      map(() => {
        const currentPlans = this.plans.value.filter(plan => plan.planId !== planId);
        this.plans.next([...currentPlans]);
      })
    );
  }

  updatePlan(plan: Plan): Observable<Plan> {
    return this.http.put<Plan>(`${this.apiUrl}updatePlan`, plan).pipe(
      map(updatedPlan => {
        const currentPlans = this.plans.value.map(p => p.planId === updatedPlan.planId ? updatedPlan : p);
        this.plans.next([...currentPlans]);
        return updatedPlan;
      })
    );
  }
}