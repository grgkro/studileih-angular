import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UploadFileService } from 'src/app/_services/upload-file.service';
import { UpdateService } from 'src/app/_services/update.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/_models/user';
import { Product } from 'src/app/_models/product';
import { HelperService } from 'src/app/_services/helper.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


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
  user: User = { id: 1 };
  imgType: string = "userPic";
  product: Product = { id: 1 };  // we need a default value, otherwise you can't upload a user profile pic before clicking on a product (unclean solution, better solution would be nice)

 // Angular takes care of unsubscribing from many observable subscriptions like those returned from the Http service or when using the async pipe. But the routeParam$ and the _update.currentShowUploadComponent needs to be unsubscribed by hand on ngDestroy. Otherwise, we risk a memory leak when the component is destroyed. https://malcoded.com/posts/angular-async-pipe/   https://www.digitalocean.com/community/tutorials/angular-takeuntil-rxjs-unsubscribe
 destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private uploadFileService: UploadFileService, private _update: UpdateService) { }

  ngOnInit(): void {
    this.updateUser();   //  if the user changes, this will get updated
    this.updateProduct();  //  if the product is undefined (which will happen if you upload a user before clicking on one of the products), this would cause an error even if you dont need a product id to upload a user profile pic. So we catch that with the if command. If the product later changes and someone wants to upload a product pic, this line will get the product updated so that we know which product belongs to that product pic
    this.updateImgType(); // if the imgType changes, this will get updated (for example, if you upload a product pic from the product-details componente, the component just needs to set the imageType to productPic before uploading the photo.)
  }

  ngOnDestroy() {            // Angular takes care of unsubscribing from many observable subscriptions like those returned from the Http service or when using the async pipe. But the routeParam$ and the _update.currentShowUploadComponent needs to be unsubscribed by hand on ngDestroy. Otherwise, we risk a memory leak when the component is destroyed. https://malcoded.com/posts/angular-async-pipe/   https://www.digitalocean.com/community/tutorials/angular-takeuntil-rxjs-unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }

  updateUser(): void {
    this._update.currentUser.subscribe(user => this.user = user)  
  }

  updateProduct(): void {
    this._update.currentProduct.subscribe(product => { if (product) this.product = product })  
  }

  updateImgType(): void {
    this._update.currentImgType
    .pipe(takeUntil(this.destroy$))  
    .subscribe(imgType => this.imgType = imgType) 
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

  uploadPic() {
    if (this.checkBeforeUpload()) {
      // we only allow one file to be uploaded -> item(0) - without the 0 in item(0), you could upload many files at once (which would break the backend code).
      this.currentFileUpload = this.selectedFiles.item(0);
      // This uploadfunction is responsible for handling uploads of user profile images and product pics. (Unecessary complicated, splitting it in two functions would be better for seperation of concerns)
      this.uploadFileService.pushFileToStorage(this.currentFileUpload, this.user.id, this.product.id, this.imgType).subscribe((response: any) => {
        if (response == "Dein Foto wurde gespeichert.")   //it would be better to check the response status == 200, but I dont know how
          this.response = response;
        if (this.imgType == "productPic") this._update.changeShowUploadComponent(false);  // if the user uploaded a product photo, we want do not show the upload component anymore in the productdetails component. But therefore we need the information in the productdetails component. -> If a user successfully uploads a product photo (status 200), the upload component changes showUploadComponent to false here. The _update service then updates this value for all subscribes.
        // setTimeout(() => { this.router.navigate(['']); }, 700);  // after uploading a photo we go back to the main page immediatly -> could be changed, maybe better show a success message and stay on the current page...
        this._update.changeNewPhotoWasUploaded();   // ohne die Zeile, würde bei "upload new Photo" das Photo als USER profile pic behandelt werden. Wir wollen es aber als PRODUCT pic speichern. (Ist etwas ungeschickt gelöst...)
      },
        (err: HttpErrorResponse) => this.processError(err)    // if the image could not be loaded, this part will be executed instead
      );
    }
  }

  // checks, if at least one file was selected for upload and if a user is logged in
  checkBeforeUpload(): boolean {
    if (this.selectedFiles == undefined || this.user.id == 0) {
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
      this.response = "Foto mit selbem Namen wurde vom gleichen User schonmal hochgeladen. 😄";
    } else if (err.status == 400) {
      this.response = "Foto mit selbem Namen wurde schonmal hochgeladen. 😢";
    } else if (err.status == 0) {
      this.response = "Foto abgelehnt, Foto muss kleiner 500KB sein. 😢";
    } else {
      //Backend returns unsuccessful response codes such as 404, 500 etc.
      console.log('Backend returned status code: ', err.status);
      console.log('Response body:', err.error);
    }
  }
}
