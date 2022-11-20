import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(private jwtHelperService: JwtHelperService) { }

  setToken(token: string, rtoken: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('rtoken', rtoken);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  removeToken(): void {
    localStorage.removeItem('token');
  }

  isExpired(): boolean {
    const token = this.getToken();
    if (token != null && this.jwtHelperService.isTokenExpired(token) == false) {
      return false;
    }
    return true;
  }
}
