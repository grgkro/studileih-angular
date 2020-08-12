import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UploadFileService } from 'src/app/_services/upload-file.service';
import { UpdateService } from 'src/app/_services/update.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/_models/user';
import { Product } from 'src/app/_models/product';
import { HelperService } from 'src/app/_services/helper.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-upload-multiple-files',
  templateUrl: './upload-multiple-files.component.html',
  styleUrls: ['./upload-multiple-files.component.scss']
})
export class UploadMultipleFilesComponent implements OnInit {

  @Output() selectedFile = new EventEmitter<File[]>();

  selectedFiles: FileList;
  currentFileUpload: File;
  currentFilesUpload: File[];
  userId: number;
  response: string;
  user: User = { id: 1 };
  imgType: string = "userPic";
  product: Product = { id: 1 };  // we need a default value, otherwise you can't upload a user profile pic before clicking on a product (unclean solution, better solution would be nice)
  errorMessage: string = "";


  // Angular takes care of unsubscribing from many observable subscriptions like those returned from the Http service or when using the async pipe. But the routeParam$ and the _update.currentShowUploadComponent needs to be unsubscribed by hand on ngDestroy. Otherwise, we risk a memory leak when the component is destroyed. https://malcoded.com/posts/angular-async-pipe/   https://www.digitalocean.com/community/tutorials/angular-takeuntil-rxjs-unsubscribe
  destroy$: Subject<boolean> = new Subject<boolean>();

  base64textString: String = "";
  croppedImage: any = '';   // the croppedImage is in base64 and is only used as the preview image of how the cropped image will look like.
  imagesToShow: String[] = [];

  constructor(private uploadFileService: UploadFileService, private _update: UpdateService, private _snackBar: MatSnackBar) { }

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

  selectFile(event) {
    let filesUpload: File[] = Array.from(event.target.files); 
    //filter the selected file by filetype (.jpg, .png, ...) and size < 512KB + sum of files < 512KB. Then create + show Error message if at least one is invalid 
    filesUpload = this.checkImages(Array.from(event.target.files)) // https://stackoverflow.com/questions/25333488/why-isnt-the-filelist-object-an-array

    this.preshowValidImages(filesUpload);
    // we transfer the imageList into an array, filter it again for the valid images and emit them to the parent component.
     //emit the valid images to the parent component (which then sends them to backend)
     this.selectedFile.emit(filesUpload);
  }

  checkImages(files: File[]): File[] {
    let sumImagesSize = 0;
    let maxSumImagesSize = 512000;
    let validFiles: File[] = [];
    let errorMessage = ""
    
    let wrongFiletypeFiles: File[] = files.filter(element => !element.type.match('image.*'));
    let tooLargeFiles: File[] = files.filter(element => element.size > maxSumImagesSize);
    //filter the files that are larger than 512KB or not images
    files = files.filter(element => (element.size < maxSumImagesSize && element.type.match('image.*')));
   console.log("1.Filterung", files)
    //Also the sum of the remaining images can't be > 512 KB -> chose from the remaining images, until the sum is too high:
   
    for (let i = 0; i < files.length; i++) {
      if ((sumImagesSize + files[i].size) < maxSumImagesSize && files[i].type.match('image.*')) {
        sumImagesSize += files[i].size;
        validFiles.push(files[i])  
      } else if ((sumImagesSize + files[i].size) < maxSumImagesSize) {
        //we also add this file to the filesTooLarge array (even if itself wasn't too large)
        tooLargeFiles.push(files[i]);
      } else {
        wrongFiletypeFiles.push(files[i]);
      }
    }
   
    if (tooLargeFiles.length > 0) {
      errorMessage = "Die Gesamtgröße der Bilder war > 500KB. Folgende Bilder wurden entfernt: "
      tooLargeFiles.forEach(element => {errorMessage += element.name + "(" + element.size / 1000 + "KB) "})
      if (errorMessage.length > 50) {
        errorMessage = errorMessage.substring(0, 150) + "...";
      }
      this._snackBar.open(errorMessage, "", { duration: 3000 });
    }

    if (wrongFiletypeFiles.length > 0) {
      errorMessage = "Folgende Dateien hatten einen unerlaubten Dateityp: "
      wrongFiletypeFiles.forEach(element => {errorMessage += element.name + "(" + element.size / 1000 + "KB) "})
      if (errorMessage.length > 50) {
        errorMessage = errorMessage.substring(0, 150) + "...";
      }
      this._snackBar.open(errorMessage, "", { duration: 3000 });
    }
   
    return validFiles;
  }

  preshowValidImages(files) {
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.match('image.*') && files[i].size < 512000) {
        var reader = new FileReader();

        reader.onload = this._handleReaderLoaded.bind(this);

        reader.readAsBinaryString(files[i]);
      }

    }
  }

  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
    console.log(btoa(binaryString));
    this.imagesToShow.push("data:image\/png;base64," + this.base64textString);    // we need to add the filetype to the base64 code before we can display it.
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