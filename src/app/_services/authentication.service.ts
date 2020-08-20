import { Injectable } from '@angular/core';
import { AuthRequest } from '../_models/authRequest';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const serverPath = 'http://localhost:8090';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  

  constructor(private http: HttpClient) { }

  login(authRequest: AuthRequest): Observable<any> {
    return this.http.post(serverPath + '/authenticate', authRequest, { observe: 'response', responseType: `text` as `json` });
  }


welcome(token): Observable<any> {
  
  var headers_object = new HttpHeaders().set("Authorization", "Bearer " + token);
  var httpOptions = {
    headers: headers_object,
    observer: "response",
    withCredentials: true,
    responseType: `text` as `json`
  };
 
  return this.http.get(serverPath + '/', httpOptions)
}
}
