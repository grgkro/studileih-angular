import { TestBed } from '@angular/core/testing';

import { UploadFileService } from './upload-file.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UploadFileService', () => {
  let service: UploadFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientTestingModule]});
    service = TestBed.inject(UploadFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
