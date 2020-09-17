import { Component, OnInit, } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

import { switchMap } from 'rxjs/operators';

import { DataService } from '../../../data.service';
import { UploadFileService } from 'src/app/_services/upload-file.service';
import { UpdateService } from '../../../_services/update.service';


// import { saveAs } from 'file-saver';  
// To use the file download feature, you need to install file-saver.js by running these 2 commands in your terminal: 
//1) npm install file-saver --save 
//2) npm install @types/file-saver --save-dev    
// https://www.javascripting.com/view/filesaver-js
//3) uncomment the import and the saveAs(val, "test.png") line in ngOnInit()

import { DomSanitizer } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';
import { HelperService } from 'src/app/_services/helper.service';
import { User } from 'src/app/_models/user';
import { TokenStorageService } from 'src/app/_services/token-storage.service';





@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  user: User;
  loggedInUser: User;
  imageToShow: any;
  errorMessage: string;
  showUploadComponent: boolean = false;
  id: any;
  userDetails: User;
  editingActivated: boolean;

  response: string;
  userId: number;

  constructor(private route: ActivatedRoute, private data: DataService, private _update: UpdateService, private _token: TokenStorageService, private uploadFileService: UploadFileService, private sanitizer: DomSanitizer, private router: Router) { }

  ngOnInit() {
    this.loadUserWithUserPic();
    this.subscribeTriggeringObservable();
    this.loggedInUser = this._token.getUser();   //  if the user changes, this will get updated
  }

  // This function gets called when the user clicks on "Foto hochladen": https://angular.io/guide/component-interaction
  onFileSelected(selectedFile: File) {
    // This uploadfunction is responsible for handling uploads of user profile images and product pics. 
    this.saveFile(selectedFile);
  }

  saveFile(selectedFile: File) {
    this.uploadFileService.pushFileToStorage(selectedFile, this.user.id, null, "userPic").subscribe((response: any) => {
      if (response == "Dein Foto wurde gespeichert.")   //it would be better to check the response status == 200, but I dont know how
        this.response = response;
      console.log(response)
      // this._update.changeShowUploadComponent(false);  // if the user uploaded a product photo, we want do not show the upload component anymore in the productdetails component. But therefore we need the information in the productdetails component. -> If a user successfully uploads a product photo (status 200), the upload component changes showUploadComponent to false here. The _update service then updates this value for all subscribes.
      // setTimeout(() => { this.router.navigate(['']); }, 700);  // after uploading a photo we go back to the main page immediatly -> could be changed, maybe better show a success message and stay on the current page...
      // this._update.changeNewPhotoWasUploaded();   // ohne die Zeile, würde bei "upload new Photo" das Photo als USER profile pic behandelt werden. Wir wollen es aber als PRODUCT pic speichern. (Ist etwas ungeschickt gelöst...)
    },
      (err: HttpErrorResponse) => this.processError(err)    // if the image could not be loaded, this part will be executed instead
    );
  }

  loadUserWithUserPic() {
    // here we create 3 Observables, one gets the parameters/userId from the url "http://localhost:4200/details/{userId}. The next loads the user, and the last loads the profile pic of that user.
    this.route.params.pipe(switchMap(                   // pipe & switchMap take care, that if the userId changes for some reason, the following process gets stopped: https://www.concretepage.com/angular/angular-switchmap-example (not necessary yet, because the user profile image loads pretty fast, but if that takes longer and the user switches to another site, it's better to stop the process)
      params =>
        this.data.getUser(params['id']))).subscribe(      // this calls the getUser function with the id from the url, which returns an Observable, to which we subscribe. When the Observable is ready it will give us the user.
          user => {
            this.user = user;    
            console.log(this.user)                         // user is the user that was just loaded from the database. this.user is the variable, that we store the user in, so that we can access it outside of the scope of the Observable.
            console.log(this.user.id)                         // user is the user that was just loaded from the database. this.user is the variable, that we store the user in, so that we can access it outside of the scope of the Observable.
            this._update.changeImgType("userPic");   // ohne die Zeile, würde bei "upload new Photo" das Photo als PRODUCT pic behandelt werden. Wir wollen es aber als USER profile pic speichern. (Ist etwas ungeschickt gelöst...) 
            this.loadUserProfilePic();
          },
          (err: HttpErrorResponse) => this.processError(err)    // if the image could not be loaded, this part will be executed instead
        );
  }

  


  loadUserProfilePic() {
    console.log(this.user.id)
    this.uploadFileService.getUserPic(this.user.id).subscribe(       // load user image
      image => {
        console.log(image)
        this.createImageFromBlob(image);
        // saveAs(val, "test.png")                // uncomment this to download the image in the browser (you also need to uncomment the import file-saver)
      })
  }

  // Hide or Show the Upload function (the "Durchsuchen" Button)
  toggleUploadComponent() {
    this.showUploadComponent = !this.showUploadComponent;             // if showUploadComponent was false, it's now true.
  }

  // This image upload code is basically taken from here: https://stackoverflow.com/questions/45530752/getting-image-from-api-in-angular-4-5  (first answer) or see the code directly: https://stackblitz.com/edit/angular-1yr75s
  // But I had to add the sanitization part, otherwise Firefox and Chrome always blocked the image/blob. https://angular.io/guide/security#xss -> Potential security risk... 
  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      // Somebody could create an image and hide javascript code inside of it (an image is just a very long text formatted in base64) 
      // -> this script would get executed, if the image get's transferred to our HTML page in the next line. Therefore it gets blocked by default, unless we bypass it.
      this.imageToShow = this.sanitizer.bypassSecurityTrustResourceUrl(reader.result + "");  // the image is read by the FileReader and is returned as an "any". But this needs to be sanitized first, before it can be shown in the HTML. Therefore we pass it into the sanitzation, but there we need a String, therefore we use: reader.result + ""   
    }, false);

    if (image) {
      reader.readAsDataURL(image); //this triggers the reader EventListener
    }
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



  editUser(): void {
    console.log("editing started");
    this.editingActivated = true;
  };

  // when a new photo gets uploaded, the triggeringObservable will be triggered and the following code will be excecuted (to refresh the photots, so that it immediately shows the newly uploaded photo.)
  subscribeTriggeringObservable() {
    this._update.triggeringObservable.subscribe(() => {
      this.loadUserWithUserPic();   //the triggeringObservable is of type Observable<void>, so it returns always undefined as value, so we do just .subscribe( () => ...)
    })
  }

}
