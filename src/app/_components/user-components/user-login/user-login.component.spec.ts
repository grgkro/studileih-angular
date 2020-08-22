import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserLoginComponent } from './user-login.component';
import { FormBuilder } from '@angular/forms';
import { HttpClientTestingModule,  HttpTestingController } from '@angular/common/http/testing';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';

describe('UserLoginComponent', () => {
  let httpTestingController: HttpTestingController;
  let component: UserLoginComponent;
  let fixture: ComponentFixture<UserLoginComponent>;
  let tokenStorageServiceStub: Partial<TokenStorageService>;
  let authenticationServiceStub: Partial<AuthenticationService>;
  // let tokenStorageService;
  // let authenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [{HttpClientTestingModule}],
      providers: [{provide: FormBuilder}, { provide: TokenStorageService, useValue: tokenStorageServiceStub }, { provide: AuthenticationService, useValue: authenticationServiceStub } ],
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
});
