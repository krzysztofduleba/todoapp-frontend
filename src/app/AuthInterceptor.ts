import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { JWTService } from "./jwt.service";
import { AuthService } from "./services/auth.service";
import { catchError, filter, switchMap, take } from 'rxjs/operators'
import { Injectable } from "@angular/core";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private jwtService: JWTService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.headers.get('skip')) {
      console.log('url');
      return next.handle(req);
    }

    let authReq = req;
    let token = this.jwtService.getAccessToken();
    if (token != null) {
      authReq = req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) })
    }

    return next.handle(authReq).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return this.handleUnauthorizedError(authReq, next, error);
      }
      return throwError(error);
    }));
  }

  handleUnauthorizedError(request: HttpRequest<any>, next: HttpHandler, error: any) {
    return this.authService.refreshToken().pipe(
      switchMap((response: any) => {
        this.authService.authenticate(response);
        console.log('access: ' + response.access_token);
        request = request.clone({ headers: request.headers.set('Authorization', `Bearer ${response.access_token}`) });
        return next.handle(request);
      }),
      catchError((error) => {
        this.authService.signOut();
        return throwError(error);
      })
    );
  }
}