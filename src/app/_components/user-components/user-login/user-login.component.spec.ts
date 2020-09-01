import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserLoginComponent } from './user-login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule,  HttpTestingController } from '@angular/common/http/testing';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { of } from 'rxjs/internal/observable/of';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('UserLoginComponent', () => {
  let httpTestingController: HttpTestingController;
  let component: UserLoginComponent;
  let fixture: ComponentFixture<UserLoginComponent>;
  let tokenStorageServiceStub: Partial<TokenStorageService>;
  let authenticationServiceStub: Partial<AuthenticationService>;
  // let tokenStorageService;
  // let authenticationService;

  // https://stackoverflow.com/questions/63533754/angular-unit-testing-with-jasmine-error-please-add-an-ngmodule-annotation/63675374#63675374
  tokenStorageServiceStub = {
    saveToken: () => {}
  };
  
  
  authenticationServiceStub = {
    login: () => of({status: 200, body: {}})
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule, MatSnackBarModule],
      providers: [{ provide: TokenStorageService, useValue: tokenStorageServiceStub }, { provide: AuthenticationService, useValue: authenticationServiceStub } ],
      declarations: [ UserLoginComponent ]
    })

    fixture = TestBed.createComponent(UserLoginComponent);
    component = fixture.componentInstance;
    
    // tokenStorageService = TestBed.inject(TokenStorageService);
    // authenticationService = TestBed.inject(AuthenticationService);
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  })

  it('should check the username input validity', () => {
    let username = component.loginForm.controls['username'];
    expect(username.valid).toBeFalsy();
  })

  it('should check the password input validity', () => {
    let password = component.loginForm.controls['password'];
    expect(password.valid).toBeFalsy();
  })

 
});
