import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsComponent } from './products.component';
import { RouterTestingModule } from "@angular/router/testing";

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ ProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load any products', () => expect(component.products.length).toBeGreaterThanOrEqual(3))
  it('should load dorm products', () => expect(component.dormProducts.length).toBeGreaterThanOrEqual(2)) 
  it('should load the other products', () => expect(component.productsWithoutDormProducts.length).toBeGreaterThanOrEqual(1)) 
  // it('should not intersect dorm products and productsWithoutDormProducts', () => expect(component.productsWithoutDormProducts).toBeGreaterThanOrEqual(1)) 

  
});
