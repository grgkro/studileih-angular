import { Component, OnInit } from '@angular/core';
import { Product } from '../_models/product';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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

  id = ''; 
    userId= '';
    name= '';
    title= '';
    price : number= null;
    views: number= null;
    available= false;
    createdAt= '';
    updatedAt= '';
    picPaths? = [];

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
      
      name: [null, Validators.required],
      title:[null, Validators.required],
      price: [null, Validators.required],
      views: [null, Validators.required],
      available: [null, Validators.required],
      createdAt: [null, Validators.required],
      updatedAt: [null, Validators.required],
      picPaths: [null, Validators.required]
    });
    this.dataService.getProduct(+productId)
    .subscribe(data => {
      this.editForm.setValue(data.result)
    });
  }

  getProduct(id: any) {
    this.dataService.getProduct(id).subscribe((data: any) => {
      this.id = data.id;
      this.userId = data.userId;
      this.editForm.setValue({
      name: ['',Validators.required],
      title: ['',Validators.required],
      price: ['',Validators.required],
      views: ['',Validators.required],
      available: ['',Validators.required],
      createdAt: ['',Validators.required],
      updatedAt: ['',Validators.required],
      picPaths: ['',Validators.required]
      });
    });
  }

 onSubmit() {
    this.dataService.updateProduct(this.editForm.value)
    .pipe(first()).subscribe(
      data => {
        if(data.status === 200) {
          alert('Product updated successfully');
          this.router.navigate(['products']);
        } else {
          alert(data.message);
        }
      },
      (error: any) => {
        alert(error);
      });
      
  } 

  onFormSubmit() {
    this.dataService.updateProduct(this.editForm.value)
      .subscribe((res: any) => {
          const id = res._id;
          this.router.navigate(['/cases-details', id]);
        }, (err: any) => {
          console.log(err);
        }
      );
  }

  productDetails() {
    this.router.navigate(['/cases-details', this.id]);
  }

  get f(){
    return this.editForm.controls;
  }

}
