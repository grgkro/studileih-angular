import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../data.service';
import { switchMap } from 'rxjs/operators';
import { Product } from 'src/app/_models/product';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  product: Product;
  imageToShow: any;

  constructor(private route: ActivatedRoute, private data: DataService) { }

  ngOnInit(): void {
    //load the product:
    this.route.params.pipe(switchMap(params => this.data.getProduct(params['id'])))  // pipe & switchMap take care, that if the userId changes for some reason, the following process gets stopped: https://www.concretepage.com/angular/angular-switchmap-example (not necessary yet, because the user profile image loads pretty fast, but if that takes longer and the user switches to another site, it's better to stop the process)
      .subscribe(
        data => { 
          this.product = data;
  });
  }
}
