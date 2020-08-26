import { TestBed } from '@angular/core/testing';

import { ApplicationStateServiceService } from './application-state-service.service';

describe('ApplicationStateServiceService', () => {
  let service: ApplicationStateServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationStateServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
