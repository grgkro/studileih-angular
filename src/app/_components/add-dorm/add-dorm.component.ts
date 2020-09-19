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

  getFormdata(): FormData {
    const formdata: FormData = new FormData();
    formdata.append('name', this.dormForm.get('name').value);
    formdata.append('city', this.dormForm.get('city').value);
    formdata.append('street', this.dormForm.get('street').value);
    formdata.append('houseNumber', this.dormForm.get('houseNumber').value);
    return formdata;
  }

  

}
