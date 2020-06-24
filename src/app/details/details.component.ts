import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { switchMap } from 'rxjs/operators';

import { DataService } from '../data.service';
import { UploadFileService } from 'src/app/_services/upload-file.service';
import { Observable } from 'rxjs';

import { saveAs } from 'file-saver';  
// You need to install fiel-saver.js by running these 2 commands in your terminal: 
//1) npm install file-saver --save 
//2) npm install @types/file-saver --save-dev    
// https://www.javascripting.com/view/filesaver-js

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  user: any;
  userPic: Observable<any>;
  userId: string;
  imageUrl;

  constructor(private route: ActivatedRoute, private data: DataService, private uploadFileService: UploadFileService) { }

  ngOnInit() {
    this.route.params.pipe(switchMap(params => this.data.getUser(params['id'])))
      .subscribe(
        data => {
          this.user = data;
          console.log(this.user);
          alert("Helloooooo" + data.id)
         // this.userId = data.id.toString();
          this.uploadFileService.getUserPic().subscribe(
            data => {
              // var urlCreator = window.URL || window.webkitURL;
              // console.log("data: " + data);
              
              // alert(this.data);
              // this.imageUrl = urlCreator.createObjectURL(data);
              // console.log("blob: " + this.imageUrl);
              
              //document.querySelector("#image") = imageUrl;
              saveAs(data, "test.png")
            },
            err => console.error(err)
            );
        }
      );
  }

  response(e) {
    
 }
}