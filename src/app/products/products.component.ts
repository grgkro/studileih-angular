import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { trigger,style,transition,animate,query,stagger } from '@angular/animations';

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
  products: any;

  
  constructor(private data: DataService) { }

  ngOnInit() {
    this.data.getProducts().subscribe(
      data => {this.products = data; console.log("data"); console.log(this.products)} 
    );
  }

}