import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UploadFileService } from 'src/app/_services/upload-file.service';
import { DataService } from 'src/app/data.service';
import { UpdateService } from 'src/app/_services/update.service';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {
  selectedFiles: FileList;
  currentFileUpload: File;
  userId: number;

  constructor(private router: Router, private uploadFileService: UploadFileService, private dataService: DataService, private updateService: UpdateService) { }

  ngOnInit(): void {
    // always get the latest userId -> if the userId changes, this will get updated:
    this.updateService.currentUserId.subscribe(userId => this.userId = userId)
  }

  selectFile(event) {
    const file = event.target.files[0];
    if (file.type.match('image.*')) {
      this.selectedFiles = event.target.files;
    } else {
      alert('invalid format!');
    }
  }

  uploadUserPic() {
    // we only allow one file to be uploaded
    this.currentFileUpload = this.selectedFiles.item(0);
    // This uploadfunction is only responsible for handling uploads of user profile images,
    // therefore we only send the userId with the photo -> after saving the photo to the local storage 
    // we also need to update the user in the DB and assign the new photoId to him.  
    // The parameters for groupId and postId are set to 0 in pushFileToStorage().
    // location.reload(); reloads the page so that the profile picture is shown immediately <- removed, because now that we don't pass the userId in the url anymore, this would refresh the page and lose the userId
    // TODO: create also group and post image upload methods
    this.uploadFileService.pushFileToStorage(this.currentFileUpload, this.userId, 0, 0, "userPic").subscribe(event => {
      this.router.navigate(['']);
    });
    this.selectedFiles = undefined;
  }


  

}
