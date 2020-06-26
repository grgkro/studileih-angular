import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

import { switchMap } from 'rxjs/operators';

import { DataService } from '../data.service';
import { User } from '../_models/user';
import { Product } from '../_models/product';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  user: any;
  users: User[];
  product: Product;
  products: Product[];

  constructor(private route: ActivatedRoute, private dataService: DataService, private router: Router) { }

  ngOnInit() {
    
    this.route.params.pipe(switchMap(params => this.dataService.getUser(params['id'])))
      .subscribe(
        data => {
          this.user = data;
          console.log(this.user);
        }
      );
  }

  deleteUser(user: User): void {
    this.dataService.deleteUser(user.id)
      .subscribe(data => {
        this.users = this.users.filter(u => u !== user);
        this.router.navigate(['']);
      })
  };

  editUser(user: User): void {
     window.localStorage.removeItem("userId");
    window.localStorage.setItem("userId", user.id.toString()); 
    this.router.navigate(['edit-user']);
  };


  



}