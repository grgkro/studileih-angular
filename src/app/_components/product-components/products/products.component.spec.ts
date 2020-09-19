// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { ProductsComponent } from './products.component';
// import { RouterTestingModule } from "@angular/router/testing";
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { DataService } from 'src/app/data.service';
// import { UpdateService } from 'src/app/_services/update.service';
// import { DomSanitizer } from '@angular/platform-browser';
// import { Product } from 'src/app/_models/product';
// import { of } from 'rxjs/internal/observable/of';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { Dorm } from 'src/app/_models/dorm';
// import { NO_ERRORS_SCHEMA } from '@angular/core';

// describe('ProductsComponent', () => {
//   let component: ProductsComponent;
//   let fixture: ComponentFixture<ProductsComponent>;
//   let dataServiceStub: Partial<DataService> = {};;
//   let updateServiceStub: Partial<UpdateService> = {};
//   let testSelectedDorm: Dorm;
//   let testProductsByDorm: Product[] = [];
//   let testProductsOtherDorms: Product[] = [];
//   let dataService;
//   let dataService2;
//   let updateService;
//   let getUpdateSpy;
//   let getDataSpy;
//   let getDataSpy2;


//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [RouterTestingModule, HttpClientTestingModule, BrowserAnimationsModule ],
//       declarations: [ ProductsComponent ],
//       schemas: [NO_ERRORS_SCHEMA],  // https://stackoverflow.com/questions/48913655/testing-material-design-angular-components-with-jasmine
//       providers: [ { provide: DataService, useValue: dataServiceStub }, { provide: UpdateService, useValue: updateServiceStub }, {
//         provide: DomSanitizer,
//         useValue: {
//           sanitize: () => 'safeString',
//           bypassSecurityTrustResourceUrl: () => 'safeString'
//         }} ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     testSelectedDorm = {id: 1, name: "Max-Kade", city: "San Francisco", lat: 48, lng: 48}
//     testProductsByDorm = [{id: 1, dorm: "Max-Kade"}];
//     testProductsOtherDorms = [{id: 2, dorm: "Anderes Wohnheim"}];

//     // Create a fake TwainService object with a `getQuote()` spy
//      updateService = jasmine.createSpyObj('UpdateService', ['currentSelectedDorm']);
//      dataService = jasmine.createSpyObj('DataService', ['getProductsByDorm', 'getProductsWithoutDormProducts']);
//     //  dataService2 = jasmine.createSpyObj('DataService', ['getProductsWithoutDormProducts']);
//     // Make the spy return a synchronous Observable with the test data
//      getUpdateSpy = updateService.currentSelectedDorm.and.returnValue( of(testSelectedDorm) );
//      getDataSpy = dataService.getProductsByDorm.and.returnValue( of(testProductsByDorm) );
//      getDataSpy2 = dataService2.getProductsWithoutDormProducts.and.returnValue( of(testProductsOtherDorms) );

//     fixture = TestBed.createComponent(ProductsComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should load any products', () => expect(component.products.length).toBeGreaterThanOrEqual(3))
//   it('should load dorm products', () => expect(component.dormProducts.length).toBeGreaterThanOrEqual(2)) 
//   it('should load the other products', () => expect(component.productsWithoutDormProducts.length).toBeGreaterThanOrEqual(1)) 
//   // it('should not intersect dorm products and productsWithoutDormProducts', () => expect(component.productsWithoutDormProducts).toBeGreaterThanOrEqual(1)) 

//   it('should load productsByDorm after component initialized', () => {
//     fixture.detectChanges(); // onInit()
  
//     // sync spy result shows testProductsByDorm immediately after init
   
//     expect(getDataSpy.calls.any()).toBe(true, 'getProductsByDorm called');
//     expect(getDataSpy2.calls.any()).toBe(true, 'getProductsWithoutDormProducts called');
//   });
  
// });
