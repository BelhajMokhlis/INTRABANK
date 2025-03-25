import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../service/auth/auth.service';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    const decodedToken = jwtDecode<JwtPayload>(token);
    if (decodedToken.role === 'ADMIN') {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }
}