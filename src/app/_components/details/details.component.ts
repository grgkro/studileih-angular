import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

import { switchMap } from 'rxjs/operators';

import { DataService } from '../../data.service';
import { UploadFileService } from 'src/app/_services/upload-file.service';
import { UpdateService } from '../../_services/update.service';


// import { saveAs } from 'file-saver';  
// To use the file download feature, you need to install file-saver.js by running these 2 commands in your terminal: 
//1) npm install file-saver --save 
//2) npm install @types/file-saver --save-dev    
// https://www.javascripting.com/view/filesaver-js
//3) uncomment the import and the saveAs(val, "test.png") line in ngOnInit()

import { DomSanitizer } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/_models/user';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  user: any;
  imageToShow: any;
  id: any;
  userDetails: User;
  constructor(private route: ActivatedRoute, 
    private data: DataService, private _update: UpdateService, 
    private uploadFileService: UploadFileService, private sanitization: DomSanitizer,
    private router: Router) { }

  ngOnInit() {
    // here we create 3 Observables, one gets the parameters/userId from the url "http://localhost:4200/details/{userId}. The next load the user, and the last loads the profile pic of that user.
    this.route.params.pipe(switchMap(                   // pipe & switchMap take care, that if the userId changes for some reason, the following process gets stopped: https://www.concretepage.com/angular/angular-switchmap-example (not necessary yet, because the user profile image loads pretty fast, but if that takes longer and the user switches to another site, it's better to stop the process)
      params =>                                         // params is the return value of the switchMap and in our case it simple contains the id taken from the url. 
        this.data.getUser(params['id']))).subscribe(      // this calls the getUser function with the id from the url, which returns an Observable, to which we subscribe. When the Observable is ready it will give us the user.
          user => {
            this.user = user;                             // user is the user that was just loaded from the database. this.user is the variable, that we store the user in, so that we can access it outside of the scope of the Observable.
            this._update.changeUser(this.user);           // change the user in all components that are subscribed to dataService.currentUser
            this._update.changeImgType("userPic");
            this.uploadFileService.getUserPic(this.user.id).subscribe(       // load user image
              image => { 
                console.log(image)
                this.createImageFromBlob(image);
                // saveAs(val, "test.png")                // uncomment this to download the image in the browser (you also need to uncomment the import file-saver)
              },
              (err: HttpErrorResponse) => {                 // if the image could not be loaded, this part will be executed instead 
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
            );
          }
        );
  }

  // This image upload code is basically taken from here: https://stackoverflow.com/questions/45530752/getting-image-from-api-in-angular-4-5  (first answer) or see the code directly: https://stackblitz.com/edit/angular-1yr75s
  // But I had to add the sanitization part, otherwise Firefox and Chrome always blocked the image/blob. https://angular.io/guide/security#xss -> Potential security risk... 
  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      // Somebody could create an image and hide javascript code inside of it (an image is just a very long text formatted in base64) 
      // -> this script would get executed, if the image get's transferred to our HTML page in the next line. Therefore it gets blocked by default, unless we bypass it.
      this.imageToShow = this.sanitization.bypassSecurityTrustResourceUrl(reader.result + "");  // the image is read by the FileReader and is returned as an "any". But this needs to be sanitized first, before it can be shown in the HTML. Therefore we pass it into the sanitzation, but there we need a String, therefore we use: reader.result + ""   
    }, false);

    if (image) {
      reader.readAsDataURL(image); //this triggers the reader EventListener
    }
  }

 

  editUser(user: User ): void {
    this. id = this.route.snapshot.params['id'];
  this.loadUserDetails(this.id);
   this.router.navigate(['edit-user/'+this.id]);
 };

 loadUserDetails(id){
  this.data.getUser(id).subscribe(user => {
    this.userDetails = user;
  });
}}