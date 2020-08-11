import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../../_models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../data.service';
import { switchMap, first } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  user: User;

  @Input()
  editForm: FormGroup;

  constructor(private formBuilder: FormBuilder
    ,private router: Router
    , private dataService: DataService) { }

  ngOnInit() {
    let userId = window.localStorage.getItem("id");

    if(!userId){
      alert("Invalid action.")
      this.router.navigate(['']);
      return;
    }
    this.editForm = this.formBuilder.group({
      name: ['' ],
      email: [''],
      password: [''],
      dorm: [''],
      room: [''],
      profilePic: ['']
    });
    this.dataService.getUser(+userId)
    .subscribe(data => {
      this.editForm.setValue(data.result)
    });
  }

  onSubmit() {
    this.dataService.updateUser(this.editForm.value)
    .pipe(first()).subscribe(
      data => {
        if(data.status === 200) {
          alert('User updated successfully');
          this.router.navigate(['']);
        } else {
          alert(data.message);
        }
      },
      (error: any) => {
        alert(error);
      });
      
  }

}
