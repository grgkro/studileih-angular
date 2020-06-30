import { Component, OnInit } from '@angular/core';
import { Product } from '../_models/product';
import { DataService } from '../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  id: number;
  product: Product;
  productDetails: any;

  constructor(
    public dataService: DataService,
    private activateRoute: ActivatedRoute,
    private router: Router
   ) { }

  ngOnInit(): void {
    this.id = this.activateRoute.snapshot.params['id'];
    this.dataService.getProduct(this.id).subscribe((data: Product)=>{
      this.product = data;
    });
  }

  editProduct(product: Product): void {
    this. id = this.activateRoute.snapshot.params['id'];
  this.loadProductDetails(this.id);
   this.router.navigate(['edit-product/'+this.id]);
 };

 loadProductDetails(id){
  this.dataService.getProduct(id).subscribe(product => {
    this.productDetails = product;
  });
}

}
