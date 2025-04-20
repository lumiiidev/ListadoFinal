import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api'; // Adjust this if needed

  //loggingStatus = new Subject<boolean>();
  public isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
  
  isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  _getToken(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem('token');
    }
    return null; // Return null if not in the browser
  }   

  constructor(private http: HttpClient) {
    if (this.isBrowser()) {
      const token = this._getToken();
      if (token) {
        this.isAuthenticatedSubject.next(true);
      }
    }
  }

  // Login function
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // Register function
  register(userData: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // Logout function
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {});
  }

  // Token refresh function
  refreshToken(): Observable<any> {
    return this.http.post(`${this.apiUrl}/refresh`, {});
  }

  // Save token to local storage
  saveToken(token: string): void {
    localStorage.setItem('token', token);
    this.isAuthenticatedSubject.next(true); // Update the authentication status
    //this.loggingStatus.next(true);
  }

  // Retrieve token from local storage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Remove token from local storage
  removeToken(): void {
    localStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false); // Update the authentication status 
    //this.loggingStatus.next(false);   
  }
}