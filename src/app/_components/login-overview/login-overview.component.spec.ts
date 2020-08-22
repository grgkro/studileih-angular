import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginOverviewComponent } from './login-overview.component';

describe('LoginOverviewComponent', () => {
  let component: LoginOverviewComponent;
  let fixture: ComponentFixture<LoginOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
