import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginRegistrationAccordionComponent } from './login-registration-accordion.component';

describe('LoginRegistrationAccordionComponent', () => {
  let component: LoginRegistrationAccordionComponent;
  let fixture: ComponentFixture<LoginRegistrationAccordionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginRegistrationAccordionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginRegistrationAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
