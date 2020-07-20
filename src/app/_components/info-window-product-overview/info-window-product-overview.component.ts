import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Dorm } from 'src/app/_models/dorm';
import { User } from 'src/app/_models/user';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Product } from 'src/app/_models/product';

@Component({
  selector: 'app-info-window-product-overview',
  templateUrl: './info-window-product-overview.component.html',
  styleUrls: ['./info-window-product-overview.component.scss']
})
export class InfoWindowProductOverviewComponent implements OnInit {

  @Input() selectedDorm: Dorm;    // we get the message as an input from the chat component html ->  <app-message-details [chatMessage]=message></app-message-details>
  @Input() usersFromSelectedDorm: User[];    // we get the message as an input from the chat component html ->  <app-message-details [chatMessage]=message></app-message-details>
  @Input() productImagesMap: Map<number, SafeResourceUrl>;                  //The map stores all product images together with the product id: User[];    // we only need to import this users list from the products overview to pass it on to the child component <app-info-window-product-overview> (which is actually now a user-overview)
  @Input() dormProducts: Product[];                  //The map stores all product images together with the product id: User[];    // we only need to import this users list from the products overview to pass it on to the child component <app-info-window-product-overview> (which is actually now a user-overview)
  
  imagesLoaded: Promise<boolean>;;                  //The map stores all product images together with the product id: User[];    // we only need to import this users list from the products overview to pass it on to the child component <app-info-window-product-overview> (which is actually now a user-overview)

  constructor() { }

  ngOnInit(): void {
    console.log(this.selectedDorm)
    this.loadUsersFromDorm(this.selectedDorm);
  }

  ngOnChanges(changes: SimpleChanges) {
    // only run when property "data" changed
    if (changes['productImagesMap']) {
      this.imagesLoaded = Promise.resolve(true);   // now that all images are loaded, we display them by setting the boolean to true -> *ngIf="imagesLoaded | async" in HTML is now true

    }
}

  loadUsersFromDorm(selectedDorm: Dorm) {
    console.log(this.usersFromSelectedDorm)
  }

}
