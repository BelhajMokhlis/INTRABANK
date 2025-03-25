import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  constructor() {
    this.checkStorageAvailability();
  }

  private checkStorageAvailability(): void {
    try {
      const storage = window.localStorage;
      const testKey = '__storage_test__';
      storage.setItem(testKey, testKey);
      storage.removeItem(testKey);
    } catch (e) {
      console.error('LocalStorage is not available:', e);
      throw new Error('LocalStorage is not available');
    }
  }

  public saveToken(token: string): void {
    try {
      if (!token) {
        console.warn('Attempted to save null/undefined token');
        return;
      }
      window.localStorage.setItem(this.TOKEN_KEY, token);
      // Verify the save
      const savedToken = window.localStorage.getItem(this.TOKEN_KEY);
    } catch (e) {
      console.error('Error saving token:', e);
    }
  }

  public getToken(): string | null {
    try {
      const token = window.localStorage.getItem(this.TOKEN_KEY);
      return token;
    } catch (e) {
      console.error('Error getting token:', e);
      return null;
    }
  }

  public saveRefreshToken(token: string): void {
    try {
      if (!token) {
        console.warn('Attempted to save null/undefined refresh token');
        return;
      }
      window.localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    } catch (e) {
      console.error('Error saving refresh token:', e);
    }
  }

  public getRefreshToken(): string | null {
    try {
      const token = window.localStorage.getItem(this.REFRESH_TOKEN_KEY);
      return token;
    } catch (e) {
      console.error('Error getting refresh token:', e);
      return null;
    }
  }

  public saveUser(user: any): void {
    try {
      if (!user) {
        console.warn('Attempted to save null/undefined user');
        throw new Error('User object is null or undefined');
      }
      const userStr = JSON.stringify(user);
      window.localStorage.setItem(this.USER_KEY, userStr);
      console.log('User saved successfully');
    } catch (e) {
      console.error('Error saving user:', e);
      this.clean();
    }
  }

  public getUser(): any {
    try {
      const userStr = window.localStorage.getItem(this.USER_KEY);
      if (!userStr) {
        return null;
      }
      return JSON.parse(userStr);
    } catch (e) {
      console.error('Error getting user:', e);
      this.clean();
      return null;
    }
  }

  public clean(): void {
    try {
      window.localStorage.removeItem(this.TOKEN_KEY);
      window.localStorage.removeItem(this.USER_KEY);
      window.localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    } catch (e) {
      console.error('Error cleaning storage:', e);
    }
  }

  public isTokenExpired(token: string): boolean {
    if (!token) {
      console.log('Token expiration check: No token provided');
      return true;
    }

    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        console.log('Token expiration check: Invalid token format');
        return true;
      }

      const payload = JSON.parse(atob(tokenParts[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      const isExpired = Date.now() >= expiry;
      return isExpired;
    } catch (e) {
      console.error('Error checking token expiration:', e);
      return true;
    }
  }
} 