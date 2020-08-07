import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UploadFileService } from 'src/app/_services/upload-file.service';
import { UpdateService } from 'src/app/_services/update.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/_models/user';
import { Product } from 'src/app/_models/product';
import { HelperService } from 'src/app/_services/helper.service';
import { Subject, Observable, Observer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ImageCroppedEvent } from 'ngx-image-cropper';


@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent {

  // we import the info, if the image is a profilePic or a productPic (profilePics have to get rounded in the "Vorschau")
  @Input() isUserPic: boolean; 
  // we export the selected file, so that the add-product/add-user component can save it along with the new product/user.
  @Output() selectedFile = new EventEmitter<File>();
  
  imageChangedEvent: any = '';
  croppedImage: any = '';   // the croppedImage is in base64 and is only used as the preview image of how the cropped image will look like.
  base64TrimmedURL: any = '';

  selectedFiles: FileList;
  imageFile: File;
  userId: number;
  response: string;
  user: User = { id: 1 };
  imgType: string = "userPic";
  product: Product = { id: 1 };  // we need a default value, otherwise you can't upload a user profile pic before clicking on a product (unclean solution, better solution would be nice)

 // Angular takes care of unsubscribing from many observable subscriptions like those returned from the Http service or when using the async pipe. But the routeParam$ and the _update.currentShowUploadComponent needs to be unsubscribed by hand on ngDestroy. Otherwise, we risk a memory leak when the component is destroyed. https://malcoded.com/posts/angular-async-pipe/   https://www.digitalocean.com/community/tutorials/angular-takeuntil-rxjs-unsubscribe
 destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private uploadFileService: UploadFileService, private _update: UpdateService) { }

  ngOnDestroy() {            // Angular takes care of unsubscribing from many observable subscriptions like those returned from the Http service or when using the async pipe. But the routeParam$ and the _update.currentShowUploadComponent needs to be unsubscribed by hand on ngDestroy. Otherwise, we risk a memory leak when the component is destroyed. https://malcoded.com/posts/angular-async-pipe/   https://www.digitalocean.com/community/tutorials/angular-takeuntil-rxjs-unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }

//--------- the next methods all deal with cropping the image, displaying a preview of the cropped image and creating a File of the cropped image, which we can save in the backend. 
// https://medium.com/better-programming/convert-a-base64-url-to-image-file-in-angular-4-5796a19fdc21
imageCropped(event: ImageCroppedEvent) {
  this.croppedImage = event.base64;
  console.log(event.base64);
  this.base64TrimmedURL = this.croppedImage.replace(/^data:image\/(png|jpg);base64,/, "");     // we only want the base64code, not the "header"
  this.createBlobImageFile();

}

/**Method that will create Blob and show in new window */
 createBlobImageFile(): void {
  this.dataURItoBlob(this.base64TrimmedURL).subscribe((blob: Blob) => {
    const imageBlob: Blob = blob;
    const imageName: string = this.generateName();
    this.imageFile = new File([imageBlob], imageName, {                      // this line actually creates the File from the cropped image. This file then gets transferred to the parent component, from where its send to backend /database
      type: "image/jpeg"
    });
  });
}

/* Method to convert Base64Data Url as Image Blob */
dataURItoBlob(dataURI: string): Observable<Blob> {
return Observable.create((observer: Observer<Blob>) => {
  const byteString: string = window.atob(dataURI);
  const arrayBuffer: ArrayBuffer = new ArrayBuffer(byteString.length);
  const int8Array: Uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    int8Array[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([int8Array], { type: "image/jpeg" });
  observer.next(blob);
  observer.complete();
});
}

/**Method to Generate a Name for the Image */
generateName(): string {
let text: string = "cropImg-";
const possibleText: string =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
for (let i = 0; i < 7; i++) {
  text += possibleText.charAt(
    Math.floor(Math.random() * possibleText.length)
  );
}
// Replace extension according to your media type like this
return text + ".jpeg";
}

//----------------- cropping end ------

  // this function checks if the selected file is an image filetype (.jpg, .png, ...)
  selectFile(event) {
    this.imageChangedEvent = event;

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

      // ---- finally we return the cropped image File back to the parent component ------
      this.selectedFile.emit(this.imageFile);
      this._update.changeNewPhotoWasUploaded();   // dadurch wird in der parent component (und auch in allen anderen component, aber die existieren ja in dem moment nicht) alle photos nochmal neu geladen, sodass das neu gespeicherte foto direkt angezeigt bekommt statt erst beim nächsten mal, wenn amn wieder die seite refreshed. 
    }
  }

  // TODO: löschen falls nicht mehr notwendig?
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
