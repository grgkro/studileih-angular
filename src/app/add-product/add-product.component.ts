import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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

  ngOnInit(): void {
    this.addForm = this.formBuilder.group({
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
  }

  onSubmit() {
    this.dataService.addUser(this.addForm.value)
      .subscribe( data => {
        this.router.navigate(['product']);
      });
  }

}
