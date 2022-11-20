import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JWTService {
  accessToken!: string;
  refreshToken!: string;

  constructor() { }

  setTokens(tokens: any) {
    this.accessToken = tokens.access_token;
    this.refreshToken = tokens.refresh_token;

    localStorage.setItem('accessToken', this.accessToken);
    localStorage.setItem('refreshToken', this.refreshToken);
  }

  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  removeTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}
