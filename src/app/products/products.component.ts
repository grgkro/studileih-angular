import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: any;

  
  constructor(private data: DataService) { }

  ngOnInit() {
    this.data.getProducts().subscribe(
      data => {this.products = data; console.log("data"); console.log(this.products)} 
    );
  }

}