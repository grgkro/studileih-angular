import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DormDropdownComponent } from './dorm-dropdown.component';

describe('DormDropdownComponent', () => {
  let component: DormDropdownComponent;
  let fixture: ComponentFixture<DormDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DormDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DormDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
