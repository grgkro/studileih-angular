import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TokenStorageService } from '../../../_services/token-storage.service';
import { AuthenticationService } from '../../../_services/authentication.service';
import { AuthRequest } from '../../../_models/authRequest';
import { User } from 'src/app/_models/user';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {
  @Output() isLoggedIn = new EventEmitter<boolean>();

  loginForm: FormGroup;
  invalidLogin: boolean = false;
  authRequest: AuthRequest;
  user: User;

  constructor(private formBuilder: FormBuilder,
    private _token: TokenStorageService,
    private _auth: AuthenticationService, private _snackBar: MatSnackBar) { }


  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    console.log(this.loginForm.controls.username.value)
    this._auth.login({ 
      userName: this.loginForm.controls.username.value, 
      password: this.loginForm.controls.password.value
    } )
    .subscribe(data => {  
      if (data.status === 200) {
        // first we logout the user
        this._token.signOut(); 
        this.user = data.body;
        //this logs the user in:
        this._token.saveToken(this.user.token)
        this._token.saveUser(this.user)
        console.log("token from storage", this._token.getToken())
        // if the login component is included in a parent component e.g. message component, we need to tell the parent that the user is now logged in.
        this.isLoggedIn.emit(true);
        this.accessAPI()
      } 
    },
    (error) => {
      console.log(error)
      console.log(error.error)
      this._snackBar.open(error.error, "", { duration: 2000 });
    });
  }

  accessAPI() {
this._auth.welcome().subscribe((response) =>{
  if (response.status === 200) {
    // this.response = response.body.response;
    this._snackBar.open(response.body.response, "", { duration: 2000 });
  }  
  })
}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.required]
    });
  }

}