import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDormComponent } from './add-dorm.component';

describe('AddDormComponent', () => {
  let component: AddDormComponent;
  let fixture: ComponentFixture<AddDormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
