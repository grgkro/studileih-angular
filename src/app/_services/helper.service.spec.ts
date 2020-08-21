import { TestBed } from '@angular/core/testing';

import { HelperService } from './helper.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HelperService', () => {
  let service: HelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [
      HttpClientTestingModule
   ],});
    service = TestBed.inject(HelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
