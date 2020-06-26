import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../data.service';
import { switchMap } from 'rxjs/operators';
import { Product } from 'src/app/_models/product';
import { UpdateService } from 'src/app/_services/update.service';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  product: Product;
  imageToShow: any;
  user: User = { id: 1 };   // In the beginning (before a user logged in) the user is undefined, but we need a defined user to test the functions that only the owner of the product can start, so we set the id to 1. 
  isCurrentUserOwner: boolean = false;
  showUploadComponent: boolean = false;

  constructor(private route: ActivatedRoute, private data: DataService, private _update: UpdateService,) { }

  ngOnInit(): void {
    // this._update.currentUser.subscribe(user => this.user = user)  // always get the latest logged in user -> if the user changes, this will get updated
    // load the product:
    this.route.params.pipe(switchMap(params => this.data.getProduct(params['id'])))  // pipe & switchMap take care, that if the userId changes for some reason, the following process gets stopped: https://www.concretepage.com/angular/angular-switchmap-example (not necessary yet, because the user profile image loads pretty fast, but if that takes longer and the user switches to another site, it's better to stop the process)
      .subscribe(
        data => {
          this.product = data;
          // is the user who looks at the details of this product also the owner of the product? if he is the owner -> show "delete", "update" and "Upload new Photo" button
          if (this.product.userId == this.user.id) {
            this.isCurrentUserOwner = true;
          }
        });
  }

  toggleUploadComponent() {
    this.showUploadComponent = !this.showUploadComponent;             // if showUploadComponent was false, it's now true.
  }
}