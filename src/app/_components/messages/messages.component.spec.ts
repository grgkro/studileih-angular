import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesComponent } from './messages.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { of } from 'rxjs/internal/observable/of';
import { DataService } from 'src/app/data.service';
import { UpdateService } from 'src/app/_services/update.service';

describe('MessagesComponent', () => {
  let component: MessagesComponent;
  let fixture: ComponentFixture<MessagesComponent>;
  let dataServiceStub: Partial<DataService>;
  let updateServiceStub: Partial<UpdateService>;
  let tokenStorageServiceStub: Partial<TokenStorageService>;
  let authenticationServiceStub: Partial<AuthenticationService>;


  // https://stackoverflow.com/questions/63533754/angular-unit-testing-with-jasmine-error-please-add-an-ngmodule-annotation/63675374#63675374
  dataServiceStub = {
    getChatsByLoggedInUserPrincipal: () => of([]),  // we simulate that the user has no chats yet
    deleteChat: () => of("chat erfolgreich gelöscht")
  }

  updateServiceStub = {
    changeChats: () => of()
  }

  tokenStorageServiceStub = {
    saveToken: () => {},
    getUser: () => {}
  };
 
  authenticationServiceStub = {
    login: () => of({status: 200, body: {}}),
    welcome: () => of()
  }


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatSnackBarModule],
      providers: [
        { provide: DataService, useValue: dataServiceStub }, 
        { provide: UpdateService, useValue: updateServiceStub }, 
        { provide: TokenStorageService, useValue: tokenStorageServiceStub }, 
        { provide: AuthenticationService, useValue: authenticationServiceStub }
       ],
      declarations: [ MessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
