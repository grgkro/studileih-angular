import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UploadFileService } from 'src/app/_services/upload-file.service';
import { UpdateService } from 'src/app/_services/update.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {
  selectedFiles: FileList;
  currentFileUpload: File;
  userId: number;
  response: string;

  constructor(private router: Router, private uploadFileService: UploadFileService, private updateService: UpdateService) { }

  ngOnInit(): void {
    // always get the latest userId -> if the userId changes, this will get updated:
    this.updateService.currentUserId.subscribe(userId => this.userId = userId)
  }

  // this function checks if the selected file is an image filetype (.jpg, .png, ...)
  selectFile(event) {
    const file = event.target.files[0];
    if (file.type.match('image.*')) {
      this.selectedFiles = event.target.files;
    } else {
      alert('Invalid format! Only images allowed');     // ... when user tries uploading a .pdf etc 
      this.selectedFiles = undefined;                   // sets back this.selectedFiles to undefined, thus the user can't upload the file. Without this line it was still possible to upload a pdf.
    }
  }

  uploadUserPic() {
    
    
    if (this.checkBeforeUpload()) {
      // we only allow one file to be uploaded -> item(0) - without the 0 in item(0), you could upload many files at once (which would break the backend code).
      this.currentFileUpload = this.selectedFiles.item(0);
      // This uploadfunction is only responsible for handling uploads of user profile images,
      // therefore we only send the userId with the photo -> after saving the photo to the local storage 
      // we also need to update the user in the DB and assign the new photoId to him.  
      // The parameters for productId and postId are set to 0 in pushFileToStorage().
      // TODO: create also product and post image upload methods
      this.uploadFileService.pushFileToStorage(this.currentFileUpload, this.userId, 0, 0, "userPic").subscribe((response: any) => {
        if (response == "Image was saved.")
          this.response = response;
          setTimeout(() => { this.router.navigate(['']); }, 700);  // after uploading a photo we go back to the main page immediatly -> could be changed, maybe better show a success message and stay on the current page...
        
           
      },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            //A client-side or network error occurred.
            alert("Image could't be uploaded. Client-side error.")
            console.log('An client-side or network error occurred:', err.error.message);
          } else {
            //Backend returns unsuccessful response codes such as 404, 500 etc.
            alert("Image could't be uploaded. Image with same name already exists or uploaded file is not an actual image or image type not supported or file size > 1048 KBs.")
            console.log('Backend returned status code: ', err.status);
            console.log('Response body:', err.error);
          }
        }
      );
    }
  }

  checkBeforeUpload(): boolean {
    if (this.selectedFiles == undefined || this.userId == 0) {
      if (this.selectedFiles == undefined) {
        this.response = "Please select an image.";
        return false;
      } else {
        this.response = "No user / product was selected before, userId = 0, please click on one user before uploading a profile pic."
        return false;
      }
    }
    return true;
  }
}
