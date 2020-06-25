import { Component, OnInit } from '@angular/core';
import { Product } from '../_models/product';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { first } from 'rxjs/operators';


@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {

  product: Product;
  editForm: FormGroup;

  constructor(private formBuilder: FormBuilder
    ,private router: Router
    , private dataService: DataService) { }


  ngOnInit(): void {
    let productId = window.localStorage.getItem("id");
    if(!productId){
      alert("Invalid action.")
      this.router.navigate(['products']);
      return;
    }
    this.editForm = this.formBuilder.group({
      userId: [''],
      name: ['' ],
      title: [''],
      price: [''],
      views: [''],
      available: [''],
      createdAt: [''],
      updatedAt: [''],
      picPaths: ['']
    });
    this.dataService.getProduct(+productId)
    .subscribe(data => {
      this.editForm.setValue(data.result)
    });
  }

  onSubmit() {
    this.dataService.updateUser(this.editForm.value)
    .pipe(first()).subscribe(
      data => {
        if(data.status === 200) {
          alert('Product updated successfully');
          this.router.navigate(['products']);
        } else {
          alert(data.message);
        }
      },
      error => {
        alert(error);
      });
      
  }

}
