import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpEvent, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenStorageService } from './token-storage.service';
import { Observable } from 'rxjs';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable({
  providedIn: 'root'
})
export class BasicAuthHttpInterceptorService implements HttpInterceptor {


  constructor(private token: TokenStorageService) { }

//   intercept(req: HttpRequest<any>, next: HttpHandler) {

//     if (sessionStorage.getItem('username') && sessionStorage.getItem('basicauth')) {
//       req = req.clone({
//         setHeaders: {
//           Authorization: sessionStorage.getItem('basicauth')
//         }
//       })
//     }

//     return next.handle(req);

//   }
// }

intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      let authReq = req;
      const token = this.token.getToken();
      if (token != null) {
        console.log("JUHU")
        var tokenStr = 'Bearer ' + token;
        authReq = req.clone({ 
          setHeaders: {
                      Authorization: tokenStr
                    }
          // headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
      })
      return next.handle(authReq);
    }
  }
}
  
  export const authInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthHttpInterceptorService, multi: true }
  ];
