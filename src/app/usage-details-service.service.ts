import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsageDetailsService {

  private usageDetailsUrl = 'http://localhost:8080/userplans/usageDetails';
  private usageDetailsMonthUrl = 'http://localhost:8080/userplans/usageDetailsMonth';

  constructor(private http: HttpClient) { }

  getUsageDetails(userId: number): Observable<any> {
    return this.http.get<any>(`${this.usageDetailsUrl}/${userId}`);
  }

  getUsageDetailsMonth(userId: number): Observable<any> {
    return this.http.get<any>(`${this.usageDetailsMonthUrl}/${userId}`);
  }
}