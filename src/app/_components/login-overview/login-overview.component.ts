import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';

@Component({
  selector: 'app-login-overview',
  templateUrl: './login-overview.component.html',
  styleUrls: ['./login-overview.component.scss']
})
export class LoginOverviewComponent implements OnInit {

isLoggedIn: boolean;

  constructor(private _token: TokenStorageService, private _auth: AuthenticationService,) { }

  ngOnInit(): void {
    this.checkIfUserIsLoggedIn();
  }

  // we check if a token exists and if the token is still valid by accessing the dummy controller method welcome
  checkIfUserIsLoggedIn() {
    this._auth.welcome().subscribe((response) =>{
    if (response.status == 200) {
      this.isLoggedIn = true;
      console.log("ISnOWlOGGEDiN", this.isLoggedIn)
    } else {
      this.isLoggedIn = false
    }
    })
  }

  loginSuccessfullInChildComp(isLoggedIn: any) {
    this.isLoggedIn = isLoggedIn;
    this.ngOnInit();
    console.log(isLoggedIn)
    console.log(`User is ${isLoggedIn }ly logged in now`)
  }

  logout() {
    this._token.signOut();
    this.isLoggedIn = false;
    this.ngOnInit();
  }

}
