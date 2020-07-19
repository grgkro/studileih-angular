import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private dataService: DataService,
    private http: HttpClient) { }

  addForm: FormGroup;
  


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
      formData.append("dorm", this.addForm.get('dorm').value);
      formData.append("room", this.addForm.get('room').value);
      formData.append("profilePic", this.addForm.get('profilePic').value);

      this.http.post(this.dataService.usersPath,formData).subscribe(
        (response) => console.log(response),
        (error) => console.log(error)
      );
  }

}
