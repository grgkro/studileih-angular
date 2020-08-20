import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../../../data.service';
import { TokenStorageService } from '../../../_services/token-storage.service';
import { AuthenticationService } from '../../../_services/authentication.service';
import { Router } from '@angular/router';
import { AuthRequest } from '../../../_models/authRequest';
import { error } from '@angular/compiler/src/util';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {

  loginForm: FormGroup;
  invalidLogin: boolean = false;
  response: any;
  authRequest: AuthRequest;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private dataService: DataService, 
    private tokenStorage: TokenStorageService,
    private authService: AuthenticationService) { }


  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    
    this.authService.login({ 
      userName: this.loginForm.controls.username.value, 
      password: this.loginForm.controls.password.value
    } )
    .subscribe(data => {  
      if (data.status === 200) {
        this.tokenStorage.saveToken(data.body)
        console.log("token from storage", this.tokenStorage.getToken())
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
this.authService.welcome(token).subscribe((response) =>{this.response=response; 
    console.log(this.response)});
  }

  ngOnInit() {
    window.localStorage.removeItem('token');
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.required]
    });
  }

}