import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-login-registration-accordion',
  templateUrl: './login-registration-accordion.component.html',
  styleUrls: ['./login-registration-accordion.component.scss']
})
export class LoginRegistrationAccordionComponent implements OnInit {
  @Output() isLoggedIn = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  loginSuccessfullInChildComp(isLoggedIn: any) {
    // if the login component is included in a parent component e.g. message component, we need to tell the parent that the user is now logged in.
    this.isLoggedIn.emit(true);
    console.log("Is logged in in login-registr-accordion:", isLoggedIn)
  }

}
