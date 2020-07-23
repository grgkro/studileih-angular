import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
import { Dorm } from '../_models/dorm';
import { Observable, of } from 'rxjs';

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

  public addForm: FormGroup;
  dorms: Dorm[];

  ngOnInit(): void {
    this.addForm = this.formBuilder.group({
      name: [''],
      email: [''],
      password: [''],
      dorms: [''],
      room: [''],
      profilePic: [''],

    });


    of(this.dataService.getDormLocations().subscribe(dorms => {
      this.dorms = dorms;
      //this.addForm.controls.orders.patchValue(this.dorms[0].id);
    }));
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

  onFormSubmit() {
    var formData: any = new FormData();
    formData.append("name", this.addForm.get('name').value);
    formData.append("email", this.addForm.get('email').value);
    formData.append("password", this.addForm.get('password').value);
    formData.append("dormId", this.addForm.get('dorms').value);
    formData.append("room", this.addForm.get('room').value);
    formData.append("profilePic", this.addForm.get('profilePic').value);
    console.log(formData);

    this.http.post(this.dataService.usersPath, formData, { responseType: 'text' }).subscribe(
      (response) => console.log(response),
      (error) => console.log(error)
    );
  }

}