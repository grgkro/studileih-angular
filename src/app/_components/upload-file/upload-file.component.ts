import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UploadFileService } from 'src/app/_services/upload-file.service';
import { UpdateService } from 'src/app/_services/update.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/_models/user';
import { Product } from 'src/app/_models/product';


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
  user: User;
  imgType: string;
  product: Product;

  constructor(private router: Router, private uploadFileService: UploadFileService, private _update: UpdateService) { }

  ngOnInit(): void {
    this._update.currentUser.subscribe(user => this.user = user)  //  if the user changes, this will get updated
    this._update.currentProduct.subscribe(product => this.product = product)  //  if the product changes, this will get updated
    this._update.currentImgType.subscribe(imgType => this.imgType = imgType)  // if the imgType changes, this will get updated (for example, if you upload a product pic from the product-details componente, the component just needs to set the imageType to productPic before uploading the photo.)
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
      // This uploadfunction is responsible for handling uploads of user profile images and product pics,
      // therefore we only send the userId with the photo -> after saving the photo to the local storage 
      // we also need to update the user in the DB and assign the new photoId to him.  
      // The parameters for productId and postId are set to 0 in pushFileToStorage().
      this.uploadFileService.pushFileToStorage(this.currentFileUpload, this.user.id, this.product.id, this.imgType).subscribe((response: any) => {
        if (response == "Dein Foto wurde gespeichert.")
          this.response = response;
          setTimeout(() => { this.router.navigate(['']); }, 700);  // after uploading a photo we go back to the main page immediatly -> could be changed, maybe better show a success message and stay on the current page...
          if (this.imgType == "productPic") this._update.changeShowUploadComponent(false);  // if the user uploaded a product photo, we want do not show the upload component anymore in the productdetails component. But therefore we need the information in the productdetails component. -> If a user successfully uploads a product photo (status 200), the upload component changes showUploadComponent to false here. The _update service then updates this value for all subscribes.
           
      },
        (err: HttpErrorResponse) => {
          this.processError(err);
        }
      );
    }
  }

  // checks, if at least one file was selected for upload and if a user is logged in
  checkBeforeUpload(): boolean {
    if (this.selectedFiles == undefined || this.user.id == 0) {  // is that necessary?
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

  // takes the error and then displays a response to the user or only logs the error on the console (depending on if the error is useful for the user)
  processError(err: HttpErrorResponse) {
    if (err.error instanceof Error) {
      //A client-side or network error occurred.
      alert("Image could't be uploaded. Client-side error.")
      console.log('An client-side or network error occurred:', err.error.message);
    } else if (err.status == 304) {
      this.response = "Foto mit selbem Namen wurde vom gleichen User schonmal hochgeladen.";
    } else if (err.status == 304) {
      this.response = "Foto mit selbem Namen wurde schonmal hochgeladen.";
    } else if (err.status == 0) {
      this.response = "Foto abgelehnt, Foto muss kleiner 500KB sein.";
    } else {
      //Backend returns unsuccessful response codes such as 404, 500 etc.
      console.log('Backend returned status code: ', err.status);
      console.log('Response body:', err.error);
    }
  }
}
