import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../data.service';


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
  onlyNumbersMessage: string = "Bitte keinen Text oder negative Zahlen als Preis eingeben. 😉😉"
  showOnlyNumbersMessage: boolean = false;

  ngOnInit(): void {
    this.addForm = this.formBuilder.group({            //https://angular.io/guide/reactive-forms
      name: ['', Validators.required],
      title: ['', Validators.required],
      price: ['0'],
      available: ['', Validators.required],
      picPaths: ['', Validators.required]
    }); 
  }

  // for invalid characters (text, negative numbers...), prevent input
  inputValidator(event: any) {
    // https://stackoverflow.com/questions/37435529/proper-way-to-restrict-text-input-values-e-g-only-numbers?noredirect=1&lq=1
    if (event.target.value == '') {
      this.addForm.get('price').patchValue('');
      this.showOnlyNumbersMessage = true;
    } else {
      this.showOnlyNumbersMessage = false;
    }
  }

  onSubmit() {
    /*  console.log(this.addForm.value);
     this.dataService.addProduct(this.addForm.value)
       .subscribe(data => {
         console.log('Product created successfully!')
         this.router.navigate(['products']);
       }); */

    console.log(this.addForm.value);

      var formData: any = new FormData();
      formData.append("name", this.addForm.get('name').value);
      formData.append("title", this.addForm.get('title').value);
      
      formData.append("price", this.addForm.get('price').value);
   
    this.dataService.addProduct(formData)
      .subscribe((res: any) => {
        console.log(res);
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
