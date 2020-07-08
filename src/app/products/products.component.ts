import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from '../_models/product';
import { trigger, style, transition, animate, query, stagger } from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { UpdateService } from '../_services/update.service';
import { Dorm } from '../_models/dorm';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Observable } from 'rxjs';
import { User } from '../_models/user';




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
  products: Product[];

  dormProducts: Product[] = [];   // will contain all products of the dorm that is currently selected (selectedDorm) 
  dormImages = new Map();
  users$: Observable<User[]>;
  users: User[] = [];
  usersFromSelectedDorm: User[] = [];
  user: User; // if the currently logged in user changes, this will be updated (we need the info to show the edit and delete button only for the products where the user is the owner)
  isUserOwner: boolean = false;

  map = new Map();
  imagesLoaded: Promise<boolean>;  // this boolean gets to set to true when all images are loaded
  selectedDorm: Dorm = { id: 1, name: "Alexanderstraße", lat: 48.767485, lng: 9.179693, city: "Stuttgart", district: "StuttgartMitte" }; // irgendwie müssen werte in JS immer am Anfang schon initialisiert werde, das regt richtig auf, wir überschreiben das im onInit sowieso gleich wieder, gibt's da ne andere Möglichkeit?

  // Angular takes care of unsubscribing from many observable subscriptions like those returned from the Http service or when using the async pipe. But the routeParam$ and the _update.currentShowUploadComponent needs to be unsubscribed by hand on ngDestroy. Otherwise, we risk a memory leak when the component is destroyed. https://malcoded.com/posts/angular-async-pipe/   https://www.digitalocean.com/community/tutorials/angular-takeuntil-rxjs-unsubscribe
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private activatedRoute: ActivatedRoute, private _data: DataService, private _update: UpdateService, private sanitizer: DomSanitizer, private router: Router) { }

  ngOnInit() {
    this.products = this.activatedRoute.snapshot.data['products'];  //load all products from the product resolver service (the resolver pre-loads them from the database, before this component gets rendered) 
    // TODO: if the current dorm has products -> show those products first. Underneath that list show all products of that city. Underneath that show a list of all products.
    this.subscribeSelectedDormObservable();  // get the currently selected dorm

    this.loadProductImages();
    this.updateUser();   //  if the user changes, this will get updated

  }

  ngOnDestroy() {            // Angular takes care of unsubscribing from many observable subscriptions like those returned from the Http service or when using the async pipe. But the routeParam$ and the _update.currentShowUploadComponent needs to be unsubscribed by hand on ngDestroy. Otherwise, we risk a memory leak when the component is destroyed. https://malcoded.com/posts/angular-async-pipe/   https://www.digitalocean.com/community/tutorials/angular-takeuntil-rxjs-unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }

  updateUser(): void {
    this._update.currentUser.subscribe(user => this.user = user)
  }

  checkIsUserOwner(productUserId: number) {
if (productUserId == this.user.id) {
  return true;
  } else return false;
}

  subscribeSelectedDormObservable(): void {
    this._update.currentSelectedDorm
      .pipe(takeUntil(this.destroy$))             // We need to unsubscribe from this Observable by hand (because its not a http observable, or other angular managed observable)
      .subscribe(selectedDorm => {
        // get the selected dorm
        this.selectedDorm = selectedDorm  // when the user choses a dorm in the dropdown select menu above the google maps
        // clear the lists dormProducts und usersFromSelectedDorm -> without this, you would get the products from the previously selected dorms too.
        this.dormProducts = [];
        this.usersFromSelectedDorm = [];
        // get all users and all products from selected dorm.
        this.getAllUsersAndProductsFromSelectedDorm();
        
      })
  }

  getAllUsersAndProductsFromSelectedDorm() {
    // first get all users that live in the selected Dorm
    // at the first time, we have to get the users from the backend
    if (this.users.length === 0) {  
      this._data.getUsers().subscribe(users => {      // HTTP Observable (no unsubscribe needed)
        this.users = users; 
        
        // we filter the users array for the users that live in that dorm:
        this.usersFromSelectedDorm = this.users.filter(user => user.dormId === this.selectedDorm.id)
        // -> the filter function above is the same as this for-each loop:
        // users.forEach(user => {
        //   if (user.dormId == this.selectedDorm.id) {
        //     this.usersFromSelectedDorm.push(user);
        //   }
        // });

        this.getAllProductsFromSelectedDorm();
      })
    } 
    // if we already loaded the users from the backend, we dont need to call the backend again!
   else {   
    this.usersFromSelectedDorm = this.users.filter(user => user.dormId === this.selectedDorm.id)
      this.getAllProductsFromSelectedDorm();
    }
   
  }
  
  // get all products from the users that live in that dorm
  getAllProductsFromSelectedDorm() {
    this.products.forEach(product => {
      this.usersFromSelectedDorm.forEach(user => {
        if (product.userId == user.id) {
          this.dormProducts.push(product)
        }
      });
    });
  }


  //load the main image for each product
  loadProductImages() {
    this.products.forEach(product => {
      if (product.picPaths != undefined || product.picPaths != null) this.loadMainProductPicture(product);
    })
    this.imagesLoaded = Promise.resolve(true);   // now that all images are loaded, we display them by setting the boolean to true -> *ngIf="imagesLoaded | async" in HTML is now true

  }


  //loads only the first picture of the pictures of a product (= the main picture)
  loadMainProductPicture(product: Product) {
    if (product && product.picPaths && product.picPaths.length > 0) {      // https://stackoverflow.com/questions/62644464/angular-10-undefined-error-despite-if-null
      // after loading the product, load one product pic (the first photo from the product.picPaths arraylist)
      this._data.loadProductPicByFilename(product.picPaths[0], product.id).subscribe(
        image => {   // we only load the first poduct pic to display in the overview (the other pics can be viewed in the product details)
          this.createImageFromBlob(image, product.id);          // transorfms the blob into an image
        },
        (err: HttpErrorResponse) => this.processError(err)    // if the image could not be loaded, this part will be executed instead 
      );
    }
  }

  // // This image upload code is basically taken from here: https://stackoverflow.com/questions/45530752/getting-image-from-api-in-angular-4-5  (first answer) or see the code directly: https://stackblitz.com/edit/angular-1yr75s
  // // But I had to add the sanitization part, otherwise Firefox and Chrome always blocked the image/blob. https://angular.io/guide/security#xss -> Potential security risk... 
  createImageFromBlob(image: Blob, productId: number): any {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      // Somebody could create an image and hide javascript code inside of it (an image is just a very long text formatted in base64, so you could hide a <script> destroy everything </script> in the image and upload that image -> the image would prpably be broken, but the script code would still get executed from the HTML) 
      // -> this script would get executed, if the image get's transferred to our HTML page in the next line. Therefore it gets blocked by default, unless we bypass it.
      // the image is read by the FileReader and is returned as an "any". But this needs to be sanitized first, before it can be shown in the HTML. Therefore we pass it into the sanitzation, but there we need a String, therefore we use: reader.result + ""   
      // this.photos are the photos we want to display stored in an array 
      //this.photos.push(this.sanitizer.bypassSecurityTrustResourceUrl(reader.result + ""));  
      this.map.set(productId, this.sanitizer.bypassSecurityTrustResourceUrl(reader.result + ""));


    }, false);

    if (image) {
      reader.readAsDataURL(image); //this triggers the reader EventListener
    }
  }

  // takes the error and then displays a response to the user or only logs the error on the console (depending on if the error is useful for the user)
  processError(err: HttpErrorResponse) {
    if (err.error instanceof Error) {
      console.log('An client-side or network error occurred:', err.error);
    } else if (err.status == 404) {
      console.log("User or ProfilePic not found");
    } else {
      //Backend returns unsuccessful response codes such as 400, 500 etc.
      console.log('Backend returned status code: ', err.status);
      console.log('Response body:', err.error);
    }
  }

  deleteProduct(id: number) {
    this._data.deleteProduct(id)
      .subscribe(data => {
        this.products = this.products.filter(product => product.id !== id);
        console.log('Product deleted successfully!');
        this.loadProductImages();
      })
  };

  editProduct(product: Product) {
    window.localStorage.removeItem("productId");
    window.localStorage.setItem("productId", product.id.toString());
    this.router.navigate(['edit-product/:' + product.id]);
  };

}