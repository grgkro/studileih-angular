import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UploadFileService } from '../_services/upload-file.service';
import { UpdateService } from '../_services/update.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private dataService: DataService,
    private http: HttpClient,
    private uploadFileService: UploadFileService,
    private _update: UpdateService) { }

  addForm: FormGroup;
  
  showUploadComponent: boolean = false;
  response: string;
  selectedFile: File;


  ngOnInit(): void {
    this.addForm = this.formBuilder.group({
      name: [''],
      email: [''],
      password: [''],
      dorm: [''],
      room: [''],
      profilePic: [''],
     
    });
  }

  onSubmit() {
    console.log(this.addForm.value);
    this.dataService.addUser(this.addForm.value)
      .subscribe((res: any) => {
        this.router.navigate(['users']);
      }, (err: any) => {
        console.log(err);
      }
      );
  }

  onFormSubmit(){
      var formData: any = new FormData();
      formData.append("name", this.addForm.get('name').value);
      formData.append("email", this.addForm.get('email').value);
      formData.append("password", this.addForm.get('password').value);
      formData.append("dormId", this.addForm.get('dorm').value);
      formData.append("room", this.addForm.get('room').value);
      formData.append("profilePic", this.selectedFile);
      console.log("hello", formData);
      console.log(this.selectedFile)

      this.http.post(this.dataService.usersPath,formData, { responseType: 'text'}).subscribe(
        (response) => console.log(response),
        (error) => console.log(error)
      );
  }

   // https://angular.io/guide/component-interaction
   onFileSelected(selectedFile: File) {
    this.selectedFile = selectedFile;
    console.log(this.selectedFile)
  }

//   saveFile(selectedFile: File) {
// // This uploadfunction is responsible for handling uploads of user profile images and product pics. (Unecessary complicated, splitting it in two functions would be better for seperation of concerns)
// this.uploadFileService.pushFileToStorage(selectedFile, this.user.id, this.product.id, "productPic").subscribe((response: any) => {
//   if (response == "Dein Foto wurde gespeichert.")   //it would be better to check the response status == 200, but I dont know how
//     this.response = response;
//  // this._update.changeNewPhotoWasUploaded();
//    this._update.changeShowUploadComponent(false);  // if the user uploaded a product photo, we want do not show the upload component anymore in the productdetails component. But therefore we need the information in the productdetails component. -> If a user successfully uploads a product photo (status 200), the upload component changes showUploadComponent to false here. The _update service then updates this value for all subscribes.
//   // setTimeout(() => { this.router.navigate(['']); }, 700);  // after uploading a photo we go back to the main page immediatly -> could be changed, maybe better show a success message and stay on the current page...
// },
//   (err: HttpErrorResponse) => this.processError(err)    // if the image could not be loaded, this part will be executed instead
// );
//   }

//   // takes the error and then displays a response to the user or only logs the error on the console (depending on if the error is useful for the user)
//   processError(err: HttpErrorResponse) {
//     if (err.error instanceof Error) {
//       //A client-side or network error occurred.
//       alert("Image could't be uploaded. Client-side error.")
//       console.log('An client-side or network error occurred:', err.error.message);
//     } else if (err.status == 304) {
//       this.response = "Foto mit selbem Namen wurde vom gleichen User schonmal hochgeladen. 😄";
//     } else if (err.status == 400) {
//       this.response = "Foto mit selbem Namen wurde schonmal hochgeladen. 😢";
//     } else if (err.status == 0) {
//       this.response = "Foto abgelehnt, Foto muss kleiner 500KB sein. 😢";
//     } else {
//       //Backend returns unsuccessful response codes such as 404, 500 etc.
//       console.log('Backend returned status code: ', err.status);
//       console.log('Response body:', err.error);
//     }
//   }

}