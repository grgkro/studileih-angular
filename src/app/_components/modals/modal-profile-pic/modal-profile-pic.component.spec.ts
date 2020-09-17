import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProfilePicComponent } from './modal-profile-pic.component';

describe('ModalProfilePicComponent', () => {
  let component: ModalProfilePicComponent;
  let fixture: ComponentFixture<ModalProfilePicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalProfilePicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalProfilePicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
