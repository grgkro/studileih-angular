import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoWindowProductOverviewComponent } from './info-window-product-overview.component';

describe('InfoWindowProductOverviewComponent', () => {
  let component: InfoWindowProductOverviewComponent;
  let fixture: ComponentFixture<InfoWindowProductOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoWindowProductOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoWindowProductOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
