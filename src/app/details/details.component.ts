import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { switchMap } from 'rxjs/operators';

import { DataService } from '../data.service';
import { UploadFileService } from 'src/app/_services/upload-file.service';
import { Observable } from 'rxjs';

// import { saveAs } from 'file-saver';  
// To use the file download feature, you need to install file-saver.js by running these 2 commands in your terminal: 
//1) npm install file-saver --save 
//2) npm install @types/file-saver --save-dev    
// https://www.javascripting.com/view/filesaver-js
//3) uncomment the import and the saveAs(val, "test.png") line in ngOnInit()

import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  [x: string]: any;
  user: any;
  userPic: Observable<any>;
  userId: string;
  imageBlobUrl:any;
  displayImage: any; 
  imageToShow: any;

  constructor(private route: ActivatedRoute, private data: DataService, private uploadFileService: UploadFileService, private sanitization: DomSanitizer) { }

  ngOnInit() {
   //load the user:
    this.route.params.pipe(switchMap(params => this.data.getUser(params['id'])))
      .subscribe(
        data => { 
          this.user = data;  
          // load user image:
          this.uploadFileService.getUserPic(data.id).subscribe( val => { this.createImageFromBlob(val);
            // saveAs(val, "test.png")  // uncomment this to download the image in the browser 
          });
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
}