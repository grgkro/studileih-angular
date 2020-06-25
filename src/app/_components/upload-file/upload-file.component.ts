import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UploadFileService } from 'src/app/_services/upload-file.service';
import { DataService } from 'src/app/data.service';
import { UpdateService } from 'src/app/_services/update.service';
import { HttpHeaders } from '@angular/common/http';

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
      alert('Invalid format! Only images allowed');
    }
  }

  uploadUserPic() {
    // we only allow one file to be uploaded -> item(0) - without the 0 in item(0), you could upload many files at once (which would break the backend code).
    this.currentFileUpload = this.selectedFiles.item(0);
    // This uploadfunction is only responsible for handling uploads of user profile images,
    // therefore we only send the userId with the photo -> after saving the photo to the local storage 
    // we also need to update the user in the DB and assign the new photoId to him.  
    // The parameters for groupId and postId are set to 0 in pushFileToStorage().
    // TODO: create also group and post image upload methods
    this.uploadFileService.pushFileToStorage(this.currentFileUpload, this.userId, 0, 0, "userPic").subscribe((response: any) => {
      if (response == "Image was saved.") {
        console.log(response);
        this.router.navigate(['']);  // after uploading a photo we go back to the main page immediatly -> could be changed, maybe better show a success message and stay on the current page...
      }
    },
      (error: any) => {
        console.log(error)
        alert("Image could't be uploaded. Image with same name already exists or image type not supported.")
        
      }
    );
  }
}
