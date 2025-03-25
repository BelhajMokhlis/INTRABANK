import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../shared/models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/profile`;

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  updateUserProfile(userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/me`, userData);
  } 
}
