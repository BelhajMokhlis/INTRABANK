import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../service/auth/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip auth header for login and refresh endpoints
    if (this.isAuthUrl(req.url)) {
      return next.handle(req);
    }

    const token = this.authService.getToken();
    
    if (token) {
      req = this.addToken(req, token);
    }

    return next.handle(req).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(req, next);
        }
        return throwError(() => error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      if (this.authService.getCurrentUser()) {
        return this.authService.refreshToken().pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;
            this.refreshTokenSubject.next(token.accessToken);
            return next.handle(this.addToken(request, token.accessToken));
          }),
          catchError((err) => {
            this.isRefreshing = false;
            this.authService.logout();
            this.router.navigate(['/auth/login']);
            return throwError(() => err);
          })
        );
      }
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => next.handle(this.addToken(request, token)))
    );
  }

  private isAuthUrl(url: string): boolean {
    const authUrls = [
      `${environment.apiUrl}/auth/login`,
      `${environment.apiUrl}/auth/refresh-token`
    ];
    return authUrls.some(authUrl => url.includes(authUrl));
  }
}

