import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JWTService } from '../jwt.service';
import { ChangePassword } from '../models/change-password';
import { User } from '../models/user';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiServerUrl = 'http://localhost:8080';
  token!: string;

  constructor(private http: HttpClient, private localStorageService: LocalStorageService, private router: Router, private jwtService: JWTService) { }

  public signUp(user: User): Observable<any> {
    return this.http.post(`${this.apiServerUrl}/api/users/save`, user, { headers: { skip: 'true' } });
  }

  public signIn(user: User): Observable<any> {
    const payload = new HttpParams()
      .set('username', user.username)
      .set('password', user.password);
    return this.http.post(`${this.apiServerUrl}/api/login`, payload, { headers: { skip: 'true' } });
  }

  public signOut(): void {
    if (this.isAuthenticated() == true) {
      this.jwtService.removeTokens();
      this.router.navigate(['home']);
    }
  }

  public getUserInfo(): Observable<any> {
    return this.http.get(`${this.apiServerUrl}/api/users/info`, {responseType: 'text'});
  }

  public changePassword(passwords: ChangePassword): Observable<any> {
    return this.http.patch(`${this.apiServerUrl}/api/users/password`, passwords);
  }

  public authenticate(tokens: any): void {
    this.jwtService.setTokens(tokens);
    console.log(this.jwtService.getAccessToken());
  }

  public isAuthenticated(): boolean {
    if (this.jwtService.getAccessToken() != null) {
      return true;
    } else {
      return false;
    }
  }

  public isUserSignedIn(): boolean {
    return false;
  }

  public saveToken(username: string, password: string) {
    let body = `username=${username}&password=${password}`;
    return this.http.post(`${this.apiServerUrl}/api/login`, body);
  }

  public refreshToken() {
    console.log(this.jwtService.getRefreshToken());
    let token = this.jwtService.getRefreshToken();
    return this.http.get(`${this.apiServerUrl}/api/token/refresh`, { headers: { skip: 'true', "Authorization": `Bearer ${token}` } });
  }

  public handleUnauthorized() {
    this.refreshToken().subscribe(
      (response: any) => {
        this.authenticate(response);
      },
      (error: HttpErrorResponse) => {
        alert(error);
        this.signOut();
      }
    )
  }
}
