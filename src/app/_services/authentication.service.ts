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


welcome(token) {
  let tokenStr= `Bearer ` + token;
  const header2 = new HttpHeaders()
  var headers_object = new HttpHeaders().set("Authorization", "Bearer " + token);
  var httpOptions = {
    headers: headers_object,
    withCredentials: true,
    responseType: `text` as `json`
  };
  const headers = new HttpHeaders().set("Authorization","Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJIYXJhbGQiLCJleHAiOjE1OTgwOTkyNjgsImlhdCI6MTU5Nzg0MDA2OH0.TChsF30f0lcqk97lO9RAcnJzqdR6AGkQ9BbcsY_OOG0");
  console.log(headers)
  console.log(tokenStr)
  return this.http.get(serverPath + '/', httpOptions)
}
}
