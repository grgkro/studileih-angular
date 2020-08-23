import { Injectable } from '@angular/core';
import { AuthRequest } from '../_models/authRequest';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const serverPath = 'http://localhost:8090/';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  login(authRequest: AuthRequest): Observable<any> {
    return this.http.post(serverPath + 'authenticate', authRequest, { observe: 'response' });
  }

  welcome(): Observable<any> {
    return this.http.get(serverPath , { observe: 'response', withCredentials: true })
  }

  register(formData: FormData): Observable<any> {
    return this.http.post(serverPath + 'users/register', formData, { observe: 'response', responseType: 'text'})
  }

  
}
