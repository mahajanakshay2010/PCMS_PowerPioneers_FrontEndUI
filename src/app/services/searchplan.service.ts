import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchplanService {

  private apiUrl = 'http://localhost:8080/userplans/';

  constructor(private http: HttpClient) { }

  existingPlans(userId: number): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}existingPlans/${userId}`).pipe(
      map(response => response.plans)
    );
  }

  newPlans(userId: number): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}newPlans/${userId}`).pipe(
      map(response => response.plans)
    );
  }

  unSubscribePlan(userPlan: any): Observable<any> {
    return this.http.request<any>('delete', `${this.apiUrl}unSubscribePlan`, {
      body: userPlan
    });
  }

  subscribePlan(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}subscribePlan`, payload);
  }

  generateBill(userId: number, planId: number): Observable<any> {
    return this.http.get(`http://localhost:8080/bill/getBill/${userId}/${planId}`);
  }

  rejectedPlans(userId: number): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}rejected/${userId}`);
  }

  deleteRejectedPlans(userPlan: any): Observable<any> {
    return this.http.request<any>('delete', `${this.apiUrl}deleteRejectedPlans`, {
      body: userPlan
    });
  }

  billhistory(userId: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}billsHistory/${userId}`);
  }

  getMonthlyBills(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}monthlyBills/${userId}`);
  }
}