import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpEvent, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenStorageService } from './token-storage.service';
import { Observable, throwError } from 'rxjs';
import { catchError, catchError } from 'rxjs/operators';


const TOKEN_HEADER_KEY = 'Authorization';

@Injectable({
  providedIn: 'root'
})
export class BasicAuthHttpInterceptorService implements HttpInterceptor {


  constructor(private token: TokenStorageService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("BasicAuthHttpInterceptorService was called")
    console.log(req)
    let authReq = req;
    const token = this.token.getToken();
    console.log("interceptor", token);
    if (token != null) {
      console.log("token != null")
      var tokenStr = 'Bearer ' + token;
      authReq = req.clone({
        setHeaders: {
          Authorization: tokenStr
        }
      })
    }
    return next.handle(authReq).pipe(catchError((error: any) => {
      if (error.status === 403) {
        console.log("Bitte einloggen")
      }
      console.log("ERRROR", error)
      return throwError(error)
    }));

  }
}

