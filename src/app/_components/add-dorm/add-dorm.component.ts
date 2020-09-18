import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-add-dorm',
  templateUrl: './add-dorm.component.html',
  styleUrls: ['./add-dorm.component.scss']
})
export class AddDormComponent implements OnInit {

  dormForm: FormGroup;
 

  constructor(private formBuilder: FormBuilder, private _data: DataService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.dormForm = this.formBuilder.group({
      name: ['', Validators.required],
      city: ['', Validators.required],
      street: ['', Validators.required],
      houseNumber: ['', Validators.required]
    })
   
  //   this.dormForm.valueChanges.subscribe(x => {
  //     console.log('form value changed')
  //     console.log(x)
  //     console.log(this.getFormdata().forEach(element => console.log(element)));
  // })
  }

  onDormFormSubmit() {
    this.sendEmailToAdmin(this.getFormdata());
  }

  getFormdata(): FormData {
    const formdata: FormData = new FormData();
    formdata.append('name', this.dormForm.get('name').value);
    formdata.append('city', this.dormForm.get('city').value);
    formdata.append('street', this.dormForm.get('street').value);
    formdata.append('houseNumber', this.dormForm.get('houseNumber').value);
    return formdata;
  }

  sendEmailToAdmin(formdata: FormData) {
    this._data.sendEmailToAdmin(formdata).subscribe(res => {
      console.log(res)
      this._snackBar.open(res, "", { duration: 4000 });
    });
  }

}
