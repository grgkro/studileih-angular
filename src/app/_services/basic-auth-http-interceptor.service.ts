import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpEvent, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { TokenStorageService } from './token-storage.service';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';




@Injectable({
  providedIn: 'root'
})
export class BasicAuthHttpInterceptorService implements HttpInterceptor {

  responseMessage: string = '';

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
    return next.handle(authReq).pipe(
      // every failing request will be retried once and if it fails agin, the error will get handled. https://www.youtube.com/watch?v=-G7kStvqgcg
      retry(1))
      // catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    if (error.status === 401) {
      this.responseMessage = "Username oder Passwort nicht korrekt."
      console.log(this.responseMessage)
    }
    else if (error.status === 403) {
      this.responseMessage = "Bitte einloggen"
      console.log("Bitte einloggen")
    } 
    else if (error.status === 404) {
      console.log(error.error)
    }
    console.log("ERRROR", error)
    return throwError(error);
  }
}

