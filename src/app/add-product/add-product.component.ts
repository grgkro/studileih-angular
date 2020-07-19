import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, } from '@angular/router';
import { UploadFileService } from '../_services/upload-file.service';
import { UpdateService } from '../_services/update.service';
import { User } from '../_models/user';
import { HttpErrorResponse } from '@angular/common/http';
import { DataService } from '../data.service';


@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  addForm: FormGroup;
  onlyNumbersMessage: string = "Bitte keinen Text oder negative Zahlen als Preis eingeben. 😉😉"
  showOnlyNumbersMessage: boolean = false;
  user: User;
  response: string;
  selectedFile: File;
  selectedFiles: File[] = [];

  constructor(private formBuilder: FormBuilder,
    private uploadFileService: UploadFileService,
    private _update: UpdateService,
    private dataService: DataService,
    private router: Router) { }



  ngOnInit(): void {
    this.updateUser();   //  if the user changes, this will get updated
    this.addForm = this.formBuilder.group({            //https://angular.io/guide/reactive-forms
      name: ['', Validators.required],
      title: ['', Validators.required],
      price: ['0'],
      available: ['', Validators.required],
    });
  }

  updateUser(): void {
    this._update.currentUser.subscribe(user => this.user = user)
  }

  // https://angular.io/guide/component-interaction
  onFileSelected(selectedFiles: File[]) {
    // console.log(selectedFile)
    // this.selectedFile = selectedFile
    this.selectedFiles = selectedFiles;
    console.log(this.selectedFiles)
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



  // for invalid characters (text, negative numbers...), prevent input
  inputValidator(event: any) {
    // https://stackoverflow.com/questions/37435529/proper-way-to-restrict-text-input-values-e-g-only-numbers?noredirect=1&lq=1
    if (event.target.value == '') {
      this.addForm.get('price').patchValue('');
      this.showOnlyNumbersMessage = true;
    } else {
      this.showOnlyNumbersMessage = false;
    }
  }

  onSubmit() {
    /*  console.log(this.addForm.value);
     this.dataService.addProduct(this.addForm.value)
       .subscribe(data => {
         console.log('Product created successfully!')
         this.router.navigate(['products']);
       }); */

    console.log(this.addForm.value);

    var formData: any = new FormData();
    formData.append("name", this.addForm.get('name').value);
    formData.append("title", this.addForm.get('title').value);
    formData.append("price", this.addForm.get('price').value);
    console.log(this.addForm.get('price').value)
    formData.append("userId", this.user.id);
    // the images have to be appended each at a time: https://stackoverflow.com/questions/47538736/upload-multiple-files-with-angular-to-spring-controller
    this.selectedFiles.forEach(file => {
      formData.append("imageFiles", file);
    });
console.log(this.selectedFiles[0])
    this.dataService.addProduct(formData)
      .subscribe((res: any) => {
        console.log(res);
        this.router.navigate(['products']);
      }, (err: any) => {
        console.log(err);
      }
      );

      // we empty the selected Files array after uploading the pictures.
      this.selectedFiles = [];
  }

  cancel() {
    this.router.navigate(['products']);
  }

}
