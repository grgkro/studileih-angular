import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Dorm } from 'src/app/_models/dorm';
import { User } from 'src/app/_models/user';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Product } from 'src/app/_models/product';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-info-window-product-overview',
  templateUrl: './info-window-product-overview.component.html',
  styleUrls: ['./info-window-product-overview.component.scss']
})
export class InfoWindowProductOverviewComponent {

  // initialize a private variable _productImagesMap, it's a BehaviorSubject
  // private _productImagesMap = new BehaviorSubject<Map<number, SafeResourceUrl>>(new Map<number, SafeResourceUrl>());

  // we import the needed data from the grand-parent: products-component
  @Input() selectedDorm: Dorm;   
  @Input() usersFromSelectedDorm: User[];    
  @Input() productImagesMap: Map<number, SafeResourceUrl>;   //The map stores all product images together with the product id: User[];  
  @Input() dormProducts: Product[]; 

  //https://scotch.io/tutorials/3-ways-to-pass-async-data-to-angular-2-child-components#toc-solution-1-use-ngif
  // change productImagesMap to use getter and setter => Everytime there is a new input (a new value for productImagesMap = a new photo was loaded), the set function gets called -> __productImagesMap gets updated
  // @Input()
  // set productImagesMap(value) {
  //   // set the latest value for _data BehaviorSubject
  //   this._productImagesMap.next(value);
  // };

  // get productImagesMap() {
  //   // get the latest value from _data BehaviorSubject
  //   return this._productImagesMap.getValue();
  // }

  // Angular takes care of unsubscribing from many observable subscriptions like those returned from the Http service or when using the async pipe. But the routeParam$ and the _update.currentShowUploadComponent needs to be unsubscribed by hand on ngDestroy. Otherwise, we risk a memory leak when the component is destroyed. https://malcoded.com/posts/angular-async-pipe/   https://www.digitalocean.com/community/tutorials/angular-takeuntil-rxjs-unsubscribe
  // destroy$: Subject<boolean> = new Subject<boolean>();

  imagesLoaded: Promise<boolean>;;                 

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    // only run when property "data" changed
    if (changes['productImagesMap']) {
      this.imagesLoaded = Promise.resolve(true);   // now that all images are loaded, we display them by setting the boolean to true -> *ngIf="imagesLoaded | async" in HTML is now true
    }
}

  // ngOnInit(): void {
  //   // now we can subscribe to it, whenever input changes, 
  //   // we will run our grouping logic
  //   // this._productImagesMap
  //   //   .pipe(takeUntil(this.destroy$))             // We need to unsubscribe from this Observable by hand (because its not a http observable, or other angular managed observable)
  //   //   .subscribe(x => {
  //   //     this.productImagesMap = x;
  //   //     console.log(x)
  //   //   });
  // }

  // ngOnDestroy() {            // Angular takes care of unsubscribing from many observable subscriptions like those returned from the Http service or when using the async pipe. But the routeParam$ and the _update.currentShowUploadComponent needs to be unsubscribed by hand on ngDestroy. Otherwise, we risk a memory leak when the component is destroyed. https://malcoded.com/posts/angular-async-pipe/   https://www.digitalocean.com/community/tutorials/angular-takeuntil-rxjs-unsubscribe
  //   this.destroy$.next(true);
  //   // Now let's also unsubscribe from the subject itself:
  //   this.destroy$.unsubscribe();
  // }

   

}


