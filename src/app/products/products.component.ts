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
import { HelperService } from '../_services/helper.service';




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
  usersFromSelectedDorm: User[] = [];
  users: User[] = [];
  user: User; // if the currently logged in user changes, this will be updated (we need the info to show the edit and delete button only for the products where the user is the owner)
  isUserOwner: boolean = false;

  productImagesMap = new Map();                  //The map stores all product images together with the product id
  imagesLoaded: Promise<boolean>;  // this boolean gets to set to true when all images are loaded
  selectedDorm: Dorm = { id: 1, name: "Alexanderstraße", lat: 48.767485, lng: 9.179693, city: "Stuttgart", district: "StuttgartMitte" }; // irgendwie müssen werte in JS immer am Anfang schon initialisiert werde, das regt richtig auf, wir überschreiben das im onInit sowieso gleich wieder, gibt's da ne andere Möglichkeit?

  // Angular takes care of unsubscribing from many observable subscriptions like those returned from the Http service or when using the async pipe. But the routeParam$ and the _update.currentShowUploadComponent needs to be unsubscribed by hand on ngDestroy. Otherwise, we risk a memory leak when the component is destroyed. https://malcoded.com/posts/angular-async-pipe/   https://www.digitalocean.com/community/tutorials/angular-takeuntil-rxjs-unsubscribe
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private activatedRoute: ActivatedRoute, private _data: DataService, private _update: UpdateService, private _helper: HelperService, private sanitizer: DomSanitizer, private router: Router) { }

  ngOnInit() {
    this.products = this.activatedRoute.snapshot.data['products'];  //load all products from the product resolver service (the resolver pre-loads them from the database, before this component gets rendered) 
    // TODO: if the current dorm has products -> show those products first. Underneath that list show all products of that city. Underneath that show a list of all products.
    this.getSelectedDorm();  // get the currently selected dorm by subscribing to the currentSelectedDorm Observable
    this.loadProductImages();
    this.updateUser();   //  we need to know which user is currently logged in, because if he's the owner of a product, he will not see the "Ausleih" button, and instead he will see the "Edit" and "Delete" buttons. 

  }

  ngOnDestroy() {            // Angular takes care of unsubscribing from many observable subscriptions like those returned from the Http service or when using the async pipe. But the routeParam$ and the _update.currentShowUploadComponent needs to be unsubscribed by hand on ngDestroy. Otherwise, we risk a memory leak when the component is destroyed. https://malcoded.com/posts/angular-async-pipe/   https://www.digitalocean.com/community/tutorials/angular-takeuntil-rxjs-unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }



  updateUser(): void {
    this._update.currentUser.subscribe(user => this.user = user)   //If the user changes, this will get updated
  }

  checkIsUserOwner(productUserId: number) {
    if (productUserId == this.user.id) {
      return true;
    } else return false;
  }



  getSelectedDorm(): void {
    // clear the lists dormProducts und usersFromSelectedDorm -> without this, you would get the products from the previously selected dorm(s) too.
    this.dormProducts = [];
    this.usersFromSelectedDorm = [];
    // then get the selected dorm
    this._update.currentSelectedDorm
      .pipe(takeUntil(this.destroy$))             // We need to unsubscribe from this Observable by hand (because its not a http observable, or other angular managed observable)
      .subscribe(selectedDorm => {
        // get the selected dorm
        this.selectedDorm = selectedDorm  // when the user choses a dorm in the dropdown select menu above the google maps

        // get all products from selected dorm. (ASYNC function)
         this.getAllProductsFromSelectedDorm(this.products, this.selectedDorm);   
      })
  } 

  // when the user selects one dorm, we only want to show him the products from that dorm.
  async getAllProductsFromSelectedDorm(products: Product[], selectedDorm: Dorm) {
    // if the users were not previously loaded, we have to load them now.
    if (this.users.length === 0) {
      // we load the users from the backend and AWAIT until they are loaded. Because to contnue, we need the users list.
      this.users = await this._data.getUsers().toPromise();
      // now that we loaded them, we update the users list in all other components too, so that we dont need to load them again and again.
      this._update.changeUsers(this.users);
    }
    if (products == null || products.length === 0) {
      // we load the products from the backend and AWAIT until they are loaded. Because to contnue, we need the users list.
      this.products = await this._data.getProducts().toPromise();
    }
    // Then we filter the users list for the ones that actually live in that dorm.
    let usersFromSelectedDorm = this.users.filter(user => user.dormId === selectedDorm.id)
    // and then we filter all products for the ones that are owned by one of the users from that dorm (product.userId = user.id)
    //TODO: sehr unsauber gelöst -> im helperService gibt es die Funktion filterProductsByUsers schon, es klappt nur noch nicht die hier einzubinden.
    this.dormProducts = this._helper.filterProductsByUsers(this.products, usersFromSelectedDorm);
  }

  //load the main image for each product
  loadProductImages() {
    this.products.forEach(product => {
      if (product.picPaths != undefined || product.picPaths != null) this.loadMainProductPicture(product);
    })
    this.imagesLoaded = Promise.resolve(true);   // now that all images are loaded, we display them by setting the boolean to true -> *ngIf="imagesLoaded | async" in HTML is now true
 console.log(this.products)
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
      this.productImagesMap.set(productId, this.sanitizer.bypassSecurityTrustResourceUrl(reader.result + ""));
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

  // deleteProduct(id: number) {
  //   this._data.deleteProduct(id)
  //     .subscribe(data => {
  //       console.log(data);
  //       this.products = this.products.filter(product => product.id !== id);
  //       console.log('Product deleted successfully!');
  //       // we have to reload the product images, because we dont store the productId with the images, so if the order of products changes, the images would get mixed up.
  //       this.loadProductImages();
  //     })
  // };

  deleteProduct(id: number) {
    // first we delete the product from the database (optimally we would do something with the response instead of just logging it from backend)    
    this._data.deleteProduct(id).subscribe(response => console.log(response));
    if (this.products.filter(product => product.id === id)[0].picPaths !== null) {   // filter the product from the products list and then check if that product has any pictures. If yes -> delete the images in the backend.
      this._data.deleteImageFolder("product", id).subscribe(response => console.log(response));
    }
    
    // then we delete the product from the frontend lists, so that they dont get displayed anymore.
    this.products = this.products.filter(product => product.id !== id);
    this.dormProducts = this.dormProducts.filter(product => product.id !== id);

    // finally, we have to reload the product images, because we dont store the productId with the images, so if the order of products changes, the images would get mixed up.
    this.loadProductImages();


  };

  editProduct(product: Product) {
    window.localStorage.removeItem("productId");
    window.localStorage.setItem("productId", product.id.toString());
    this.router.navigate(['edit-product/:' + product.id]);
  };

  redirectRoute(link: string) {
    this.router.navigate([link]);
  }

}