import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { User, JwtRequest, JwtResponse } from './../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080/auth'; // Replace with your actual API URL

  constructor(private http: HttpClient) { }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/createUser`, user);
  }

  login(request: JwtRequest): Observable<JwtResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<JwtResponse>(`${this.apiUrl}/login`, request, { headers });
  }

  getUsersWithStatusNew(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/home/getUsersList').pipe(
      map((users: any[]) => users.filter(user => user.status === 'NEW'))
    );
  }

  updateUserStatus(user: any): Observable<any> {
    return this.http.put('http://localhost:8080/home/updateUserStatus', user);
  }

  updateMultipleUserStatus(users: any[]): Observable<any> {
    return this.http.put('http://localhost:8080/home/updateMultipleUserStatus', users);
  }

  getApplicationsWithNewStatus(): Observable<any> {
    return this.http.get<any>('http://localhost:8080/userplans/newApplications');
  }

  approveRejectApplication(user: any): Observable<any> {
    return this.http.put('http://localhost:8080/userplans/approveRejectApplication', user);
  }

  notifications():Observable<any> {
    return this.http.get("http://localhost:8080/userplans/numberOfNotifications");
  }
}