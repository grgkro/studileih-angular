import { Injectable } from '@angular/core';
import { AuthRequest } from '../_models/authRequest';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  login(authRequest: AuthRequest): Observable<any> {
    console.log(authRequest)
    return this.http.post(environment.serverPath + '/authenticate', authRequest, { observe: 'response' });
  }

  welcome(): Observable<any> {
    return this.http.get(environment.serverPath + '/welcome', { observe: 'response', withCredentials: true })
  }

  register(formData: FormData): Observable<any> {
    return this.http.post(environment.serverPath + '/users/register', formData, { observe: 'response', responseType: 'text'})
  }

  
}
