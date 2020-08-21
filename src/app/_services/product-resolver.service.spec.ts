import { TestBed } from '@angular/core/testing';

import { ProductResolverService } from './product-resolver.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProductResolverService', () => {
  let service: ProductResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [
      HttpClientTestingModule
   ],});
    service = TestBed.inject(ProductResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
