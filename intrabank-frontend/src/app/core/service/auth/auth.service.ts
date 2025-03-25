import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { BehaviorSubject, type Observable, tap, of, catchError, map } from "rxjs"
import type { User } from "../../../shared/models/user.model"
import { environment } from "../../../../environments/environment.development"
import { TokenStorageService } from '../storage/token-storage.service'
import { Router } from "@angular/router"
import { jwtDecode } from "jwt-decode"
import { Role } from "../../../shared/models/role.model"

interface JwtPayload {
  sub: string;
  roles: Array<{ authority: string }>;
  exp: number;
  iat: number;
  [key: string]: any;
} 




@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null)
  public currentUser$ = this.currentUserSubject.asObservable()
  private initialized = false;
  private refreshTokenTimeout: any;

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    if (this.initialized) {
      console.log('Auth already initialized, skipping');
      return;
    }
    
    try {
      const token = this.tokenStorage.getToken();
      
      if (token && !this.tokenStorage.isTokenExpired(token)) {
        const decodedToken = jwtDecode<JwtPayload>(token);
        const user = this.createUserFromToken(decodedToken);
        this.currentUserSubject.next(user);
        this.startRefreshTokenTimer();
      } else {
        console.log('Invalid or expired auth state, cleaning up');
        this.tokenStorage.clean();
        this.currentUserSubject.next(null);
      }
    } catch (error) {
      console.error('Error during auth initialization:', error);
      this.tokenStorage.clean();
      this.currentUserSubject.next(null);
    }
    
    this.initialized = true;
  }

  private createUserFromToken(decodedToken: any): User {
    return {
      id: decodedToken.sub,
      username: decodedToken.sub,
      email: decodedToken.email || `${decodedToken.sub}@example.com`,
      firstName: decodedToken.firstName || decodedToken.sub,
      lastName: decodedToken.lastName || '',
      role: decodedToken.roles[0]?.authority || Role.EMPLOYEE,
      department: decodedToken.department || 'General',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  login(username: string, password: string): Observable<any> {
    console.log('Attempting login for user:', username);
    return this.http
      .post<{ accessToken: string }>(
        `${environment.apiUrl}/auth/login`,
        { username, password }
      )
      .pipe(
        tap((response) => {
          console.log('Login response received:', {
            hasAccessToken: !!response.accessToken,
            tokenLength: response.accessToken?.length
          });
          
          const token = response.accessToken;
          console.log('Saving token to storage...');
          this.tokenStorage.saveToken(token);
          
          // Decode the JWT token to get user information
          console.log('Decoding token...');
          const decodedToken = jwtDecode<JwtPayload>(token);
          console.log('Token decoded successfully:', {
            sub: decodedToken.sub,
            roles: decodedToken.roles
          });
          
          const user = this.createUserFromToken(decodedToken);
          console.log('Created user object:', {
            username: user.username,
            role: user.role
          });
          
          this.tokenStorage.saveUser(user);
          this.currentUserSubject.next(user);
          this.startRefreshTokenTimer();
          
          const returnUrl = localStorage.getItem('returnUrl') || '/';
          console.log('Redirecting to:', returnUrl);
          localStorage.removeItem('returnUrl');
          this.router.navigateByUrl(returnUrl);
        }),
        catchError((error) => {
          console.error('Login error:', error);
          this.stopRefreshTokenTimer();
          throw error;
        })
      )
  }

  logout(): void {
    console.log('Logging out user');
    this.stopRefreshTokenTimer();
    this.tokenStorage.clean();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    try {
      const token = this.tokenStorage.getToken();
      
      
      
      if (!token) {
        console.log('Missing token');
        return false;
      }

      if (this.tokenStorage.isTokenExpired(token)) {
        console.log('Token is expired, logging out');
        this.logout();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking authentication status:', error);
      return false;
    }
  }

  getToken(): string | null {
    const token = this.tokenStorage.getToken();
    if (token && !this.tokenStorage.isTokenExpired(token)) {
      return token;
    }
    return null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  refreshToken(): Observable<any> {
    const token = this.tokenStorage.getToken();
    if (!token) {
      return of(null);
    }
    
    // Since we don't have refresh tokens, we'll use the current token
    // You might want to implement proper token refresh in your backend
    return this.http.post(
      `${environment.apiUrl}/auth/refresh-token`,
      { token }
    ).pipe(
      tap((response: any) => {
        if (response.accessToken) {
          this.tokenStorage.saveToken(response.accessToken);
          const decodedToken = jwtDecode<JwtPayload>(response.accessToken);
          const user = this.createUserFromToken(decodedToken);
          this.tokenStorage.saveUser(user);
        }
        this.startRefreshTokenTimer();
      }),
      catchError((error) => {
        console.error('Token refresh error:', error);
        this.logout();
        throw error;
      })
    );
  }

  private startRefreshTokenTimer() {
    try {
      const token = this.tokenStorage.getToken();
      if (!token) return;

      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) return;

      const payload = JSON.parse(atob(tokenParts[1]));
      const expires = new Date(payload.exp * 1000);
      const timeout = expires.getTime() - Date.now() - (60 * 1000); // Refresh 1 minute before expiry

    

      this.stopRefreshTokenTimer();
      if (timeout > 0) {
        this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
      } else {
        console.log('Token already expired or about to expire');
      }
    } catch (error) {
      console.error('Error starting refresh timer:', error);
    }
  }

  private stopRefreshTokenTimer() {
    if (this.refreshTokenTimeout) {
      console.log('Stopping refresh timer');
      clearTimeout(this.refreshTokenTimeout);
    }
  }
}