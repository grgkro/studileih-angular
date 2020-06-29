import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { Product } from '../_models/product';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];



  constructor(private dataService: DataService,
    private router: Router) { }

  ngOnInit() {
    this.dataService.getProducts().subscribe(
      (data: Product[]) => {
        this.products = data;
        console.log("data");
        console.log(this.products)
      }
    );
  }

  deleteProduct(id:number) {
    this.dataService.deleteProduct(id)
      .subscribe(data => {
        this.products = this.products.filter(product => product.id !== id);
        console.log('Product deleted successfully!');
      })
  };

  editProduct(product: Product) {
    window.localStorage.removeItem("productId");
    window.localStorage.setItem("productId", product.id.toString());
    this.router.navigate(['edit-product/:' + product.id]);
  };

}