import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { DataService } from 'src/app/data.service';
import { User } from 'src/app/_models/user';

import { UploadFileService } from 'src/app/_services/upload-file.service';

interface DialogData {
  userId: number;
}

@Component({
  selector: 'app-modal-profile-pic',
  templateUrl: './modal-profile-pic.component.html',
  styleUrls: ['./modal-profile-pic.component.scss']
})
export class ModalProfilePicComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ModalProfilePicComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private _data: DataService, private router: Router, private uploadFileService: UploadFileService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

   // This function gets called when the user clicks on "Foto hochladen": https://angular.io/guide/component-interaction
   onFileSelected(selectedFile: File) {
    // This uploadfunction is responsible for handling uploads of user profile images and product pics. 
    this.saveFile(selectedFile);
  }

  saveFile(selectedFile: File) {
    this.uploadFileService.pushFileToStorage(selectedFile, this.data.userId, null, "user").subscribe(() => {
      
        this._snackBar.open("Dein Foto wurde gespeichert.", "", { duration: 2000 });
       
        this.dialogRef.close();

        this.router.navigate(['/users']);

        
      
    },
      (err: HttpErrorResponse) => this.processError(err)    // if the image could not be loaded, this part will be executed instead
    );
  }

    // takes the error and then displays a response to the user or only logs the error on the console (depending on if the error is useful for the user)
    processError(err: HttpErrorResponse) {
      if (err.error instanceof Error) {
        console.log('An client-side or network error occurred:', err.error);
      } else if (err.status == 404) {
        console.log("User or ProfilePic not found");
      } else {
        //Backend returns unsuccessful response codes such as 400, 500 etc.
        console.log('Backend returned status code: ', err.status);
        console.log('Response body:', err.error);
      }
    }

}
