import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../../_models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../data.service';
import { switchMap, first } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  user: User;
  editForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private _token: TokenStorageService, private router: Router, private dataService: DataService) { }

  ngOnInit() {
    this.editForm = this.formBuilder.group({
      name: ['' ],
      email: [''],
      password: [''],
      dorm: [''],
      room: [''],
      profilePic: ['']
    })
    
   this.dataService.getUserForEditing().subscribe((user => {
     this.user = user; 
     console.log(user)
     this.editForm.patchValue({
      name: user.name,
      email: user.email
      });
     ;}))


      

   
  }

  onSubmit() {
    console.log(this.editForm.value)
    this.user.name = this.editForm.value.name;
    this.user.email = this.editForm.value.email;

    this.dataService.updateUser(this.user)
    .subscribe(
      updatedUser => {
        
        if(updatedUser != null) {  
        this._token.saveToken(updatedUser.token);
        this._token.saveUser(updatedUser);
          console.log('User erfolgreich bearbeitet');
          console.log("New Token:", updatedUser.token);
          console.log(updatedUser)
          this.router.navigate(['']);
        } else {
          console.log('User konnte nicht bearbeitet werden.');
        }
      },
      (error: any) => {
        alert(error);
      });
      
  }

}
