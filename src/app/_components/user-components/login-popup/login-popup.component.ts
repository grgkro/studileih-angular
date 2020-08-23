import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-login-popup',
  templateUrl: './login-popup.component.html',
  styleUrls: ['./login-popup.component.scss']
})
export class LoginPopupComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onSubmitSignUp() {
    $(".log-in").click(function(){
      $(".signIn").addClass("active-dx");
      $(".signUp").addClass("inactive-sx");
      $(".signUp").removeClass("active-sx");
      $(".signIn").removeClass("inactive-dx");
    });
  }
  
  onSubmitLogIn() {
    $(".back").click(function(){
      $(".signUp").addClass("active-sx");
      $(".signIn").addClass("inactive-dx");
      $(".signIn").removeClass("active-dx");
      $(".signUp").removeClass("inactive-sx");
    });
  }
  
 
}
