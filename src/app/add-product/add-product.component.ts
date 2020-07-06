import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { Product } from '../_models/product';


@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private dataService: DataService) { }

  addForm: FormGroup;
  data: Product;

  ngOnInit(): void {
    this.addForm = this.formBuilder.group({
      userId: ['', Validators.required],
      name: ['', Validators.required],
      title: ['', Validators.required],
      price: ['', Validators.required],
      views: ['', Validators.required],
      available: ['', Validators.required],
      createdAt: ['', Validators.required],
      updatedAt: ['', Validators.required],
      picPaths: ['', Validators.required]

    });
  }

  onSubmit() {
    /*  console.log(this.addForm.value);
     this.dataService.addProduct(this.addForm.value)
       .subscribe(data => {
         console.log('Product created successfully!')
         this.router.navigate(['products']);
       }); */
    console.log(this.addForm.value);
    this.dataService.addProduct(this.addForm.value)
      .subscribe((res: any) => {
        this.router.navigate(['products']);
      }, (err: any) => {
        console.log(err);
      }
      );
  }

  cancel() {
    this.router.navigate(['products']);
  }

}
