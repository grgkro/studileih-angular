import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TokenStorageService } from '../../../_services/token-storage.service';
import { AuthenticationService } from '../../../_services/authentication.service';
import { AuthRequest } from '../../../_models/authRequest';
import { User } from 'src/app/_models/user';
import { BasicAuthHttpInterceptorService } from 'src/app/_services/basic-auth-http-interceptor.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {
  @Output() isLoggedIn = new EventEmitter<boolean>();

  loginForm: FormGroup;
  invalidLogin: boolean = false;
  response: any;
  authRequest: AuthRequest;
  user: User;

  constructor(private formBuilder: FormBuilder,
    private _token: TokenStorageService,
    private _auth: AuthenticationService) { }


  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this._token.signOut();
    this._auth.login({ 
      userName: this.loginForm.controls.username.value, 
      password: this.loginForm.controls.password.value
    } )
    .subscribe(data => {  
      if (data.status === 200) {
        this.user = data.body;
        this._token.saveToken(this.user.token)
        this._token.saveUser(this.user)
        console.log("token from storage", this._token.getToken())
        // if the login component is included in a parent component e.g. message component, we need to tell the parent that the user is now logged in.
        this.isLoggedIn.emit(true);
        this.accessAPI(data.body)
      } 
    },
    error => {
      if (error.status === 401) {
        this.response = error.error;
      } 
    });
  }

  accessAPI(token) {
this._auth.welcome(token).subscribe((response) =>{
  if (response.status === 200) {
    this.response = response.body.response;
  }  
  })
}

  ngOnInit() {
    window.localStorage.removeItem('token');
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.required]
    });
  }

}