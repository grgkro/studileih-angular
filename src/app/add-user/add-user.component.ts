import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private dataService: DataService) { }

  addForm: FormGroup;


  ngOnInit(): void {
    this.addForm = this.formBuilder.group({
      name: [''],
      email: ['' ],
      password: [''],
      dorm: [''],
      room: [''],
      profilePic: [''],
      products: [''],
      createdAt: [''],

    });
  }

  onSubmit() {
    this.dataService.addUser(this.addForm.value)
      .subscribe( data => {
        this.router.navigate(['']);
      });
  }

}
