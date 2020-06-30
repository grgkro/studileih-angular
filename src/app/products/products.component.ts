import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { Product } from '../_models/product';
import { trigger, style, transition, animate, query, stagger } from '@angular/animations';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  animations: [  // ermöglicht das Erstellen von kleinen Animationen
    trigger('listStagger', [  // listStagger ist eine spezielle Animation, bei der die Liste nicht auf einmal dargestellt wird, sondern zeitlich verzögert auftaucht
      transition('* <=> *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(-15px)' }),
            stagger(
              '50ms',
              animate(
                '550ms ease-out',
                style({ opacity: 1, transform: 'translateY(0px)' })
              )
            )
          ],
          { optional: true }
        ),
        query(':leave', animate('50ms', style({ opacity: 0 })), {
          optional: true
        })
      ])
    ])
  ]
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