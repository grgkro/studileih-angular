import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../../../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {

  loginForm: FormGroup;
  invalidLogin: boolean = false;
  response: any;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private dataService: DataService) { }


  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    const loginPayload = {
      username: this.loginForm.controls.username.value,
      password: this.loginForm.controls.password.value
    }
    console.log(loginPayload.username)
    this.dataService.login(this.loginForm.controls.username.value, this.loginForm.controls.password.value).subscribe(data => {
      console.log(data);
     this.accessAPI(data)


      // debugger;
      // if (data.status === 200) {
      //   window.localStorage.setItem('token', data.result.token);
      //   this.router.navigate(['list-user']);
      // } else {
      //   this.invalidLogin = true;
      //   alert(data.message);
      // }
    });
  }

  accessAPI(token) {
let resp = this.dataService.welcome(token);
resp.subscribe(data=>{this.response=data; 
  console.log(this.response)})
  }

  ngOnInit() {
    window.localStorage.removeItem('token');
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.required]
    });
  }

}