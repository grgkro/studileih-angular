import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {MatSnackBarModule} from '@angular/material/snack-bar';

import { UploadMultipleFilesComponent } from './upload-multiple-files.component';

describe('UploadMultipleFilesComponent', () => {
  let component: UploadMultipleFilesComponent;
  let fixture: ComponentFixture<UploadMultipleFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [{MatSnackBarModule}],
      declarations: [ UploadMultipleFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadMultipleFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
