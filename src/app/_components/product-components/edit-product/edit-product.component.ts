import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../../../_models/product';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../../data.service';
import { first } from 'rxjs/operators';


@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {

  @Input() product: Product;   

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
    
    if(!this.product.id){
      alert("Invalid action.")
      this.router.navigate(['products']);
      return;
    }
    this.editForm = this.formBuilder.group({
      
      title:[null, Validators.required],
      price: [null, Validators.required],
      views: [null, Validators.required],
      available: [null, Validators.required],
      createdAt: [null, Validators.required],
      updatedAt: [null, Validators.required],
      picPaths: [null, Validators.required]
    });
    // https://stackoverflow.com/questions/55275025/how-to-set-value-to-form-control-in-reactive-forms-in-angular
      this.editForm.patchValue({
        title: this.product.title,
        price: this.product.price,
  })
}

  

//  onSubmit() {
//     this.dataService.updateProduct(this.editForm.value)
//     .pipe(first()).subscribe(
//       data => {
//         if(data.status === 200) {
//           alert('Product updated successfully');
//           this.router.navigate(['products']);
//         } else {
//           alert(data.message);
//         }
//       },
//       (error: any) => {
//         alert(error);
//       });
      
//   } 

  onFormSubmit() {
    this.dataService.updateProduct(this.editForm.value)
      .subscribe((res: any) => {
          console.log("onFomrSubmit", res)
        }, (err: any) => {
          console.log(err);
        }
      );
  }

  

}
