import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-dorm',
  templateUrl: './add-dorm.component.html',
  styleUrls: ['./add-dorm.component.scss']
})
export class AddDormComponent implements OnInit {

  dormForm: FormGroup;
 

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.dormForm = this.formBuilder.group({
      name: ['', Validators.required],
      city: ['', Validators.required],
      street: ['', Validators.required],
      houseNumber: ['', Validators.required]
    })
   
  }

  onDormFormSubmit():void {
    console.log("dormForm submitted, not implemented yet")
    // this._data.addDorm().subscribe();
  }

}
