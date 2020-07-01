import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../data.service';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Product } from 'src/app/_models/product';
import { UpdateService } from 'src/app/_services/update.service';
import { HelperService } from 'src/app/_services/helper.service';
import { User } from 'src/app/_models/user';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  product: Product;
  
  imageToShow: any;
  user: User;   // In the beginning (before a user logged in) the user is undefined
  isCurrentUserOwner: boolean = false;
  showUploadComponent: boolean = false;
  errorMessage: string;
  imagesList = [];
  routeParam$: Observable<Product>;

  // Angular takes care of unsubscribing from many observable subscriptions like those returned from the Http service or when using the async pipe. But the routeParam$ and the _update.currentShowUploadComponent needs to be unsubscribed by hand on ngDestroy. Otherwise, we risk a memory leak when the component is destroyed. https://malcoded.com/posts/angular-async-pipe/   https://www.digitalocean.com/community/tutorials/angular-takeuntil-rxjs-unsubscribe
  destroy$: Subject<boolean> = new Subject<boolean>();
 

  constructor(private route: ActivatedRoute, private _data: DataService, private _update: UpdateService, private _helper: HelperService, private sanitizer: DomSanitizer) {
    // creates a list of cat images for testing the lazy loading function (lazy loading = loading pictures only when they are in the viewport. Georg will delete this later!-->
    for (let i = 0; i < 50; i++) {
      const url = 'https://loremflickr.com/640/480?random=' + (i + 1);
      this.imagesList[i] = {
        url: url,
        show: false
      };
    }
  }

  ngOnInit(): void {
    this.updateUser();   //  if the user changes, this will get updated
    this.updateShowUploadComponent();
    this.routeParam$ = this.route.params.pipe(switchMap(params => this._data.getProduct(params['id'])))  // get the productId from the URL parameter /{id}. pipe & switchMap take care that if the userId changes for some reason, the following process gets stopped: https://www.concretepage.com/angular/angular-switchmap-example (not necessary yet, because the user profile image loads pretty fast, but if that takes longer and the user switches to another site, it's better to stop the process)
    this.loadProductWithProductPicture(); // load the product with the main product picture - get the productId from the URL parameter /{id}
  }

   ngOnDestroy() {            // Angular takes care of unsubscribing from many observable subscriptions like those returned from the Http service or when using the async pipe. But the routeParam$ and the _update.currentShowUploadComponent needs to be unsubscribed by hand on ngDestroy. Otherwise, we risk a memory leak when the component is destroyed. https://malcoded.com/posts/angular-async-pipe/   https://www.digitalocean.com/community/tutorials/angular-takeuntil-rxjs-unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }

  updateUser(): void {
    this._update.currentUser.subscribe(user => this.user = user)  
  }

  updateShowUploadComponent(): void {
    this._update.currentShowUploadComponent
    .pipe(takeUntil(this.destroy$))             // We need to unsubscribe from this Observable by hand
    .subscribe(showUploadComponent => this.showUploadComponent = showUploadComponent)  // when the user uploaded a product photo, we want do not show the upload component anymore. But therefore we need the information, if a photo was uploaded from the upload component. -> If a user successfully uploads a product photo (status 200), the upload component will change showUploadComponent to false. The _update service then updates this value for all subscribes. Therefore we need to subscribe here, to get that change.
  }

  loadProductWithProductPicture() {             // load the product with the main product picture:
    this.routeParam$
    .pipe(takeUntil(this.destroy$))           // We need to unsubscribe from this Observable by hand
    .subscribe(product => {
      this.product = product;
      this._update.changeProduct(this.product);    // we change the product in the data service so that if a picture for this product get's uploaded with the upload-file component, the image can be stored under the right productId.
      // is the user who looks at the details of this product also the owner of the product? if he is the owner -> show "delete", "update" and "Upload new Photo" button
      if (this.product.userId == this.user.id) {
        this.isCurrentUserOwner = true;
        this._update.changeImgType("productPic");   // ohne die Zeile, würde bei "upload new Photo" das Photo als USER profile pic behandelt werden. Wir wollen es aber als PRODUCT pic speichern. (Ist etwas ungeschickt gelöst...) 
      }
      this.loadProductPic();  // after loading the product, load one product pic (the first photo from the product.picPaths arraylist)  
    },
      (err: HttpErrorResponse) => {                 // if the product could not be loaded, this part will be executed instead 
        this.errorMessage = this._helper.createErrorMessage(err, "Produkt konnte nicht gefunden werden.");
      }
    );  
  }

  // we only load the first poduct pic (testing)
  loadProductPic() {
    this._data.loadProductPicByFilename(this.product.picPaths[0], this.product.id).subscribe(image => {
      this.createImageFromBlob(image);          // transorfms the blob into an image
    },
      (err: HttpErrorResponse) => {                 // if the image could not be loaded, this part will be executed instead 
        this.errorMessage = this._helper.createErrorMessage(err, "User oder Profilfoto konnte nicht gefunden werden");
      }
    );
  }

  // Hide or Show the Upload function (the "Durchsuchen" Button)
  toggleUploadComponent() {
    this.showUploadComponent = !this.showUploadComponent;             // if showUploadComponent was false, it's now true.
  }

  // This image upload code is basically taken from here: https://stackoverflow.com/questions/45530752/getting-image-from-api-in-angular-4-5  (first answer) or see the code directly: https://stackblitz.com/edit/angular-1yr75s
  // But I had to add the sanitization part, otherwise Firefox and Chrome always blocked the image/blob. https://angular.io/guide/security#xss -> Potential security risk... 
  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      // Somebody could create an image and hide javascript code inside of it (an image is just a very long text formatted in base64) 
      // -> this script would get executed, if the image get's transferred to our HTML page in the next line. Therefore it gets blocked by default, unless we bypass it.
      // the image is read by the FileReader and is returned as an "any". But this needs to be sanitized first, before it can be shown in the HTML. Therefore we pass it into the sanitzation, but there we need a String, therefore we use: reader.result + ""   
      // this.productPicToShow is the 
      this.imageToShow = this.sanitizer.bypassSecurityTrustResourceUrl(reader.result + "");
    }, false);

    if (image) {
      reader.readAsDataURL(image); //this triggers the reader EventListener
    }
  }


}
