import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../data.service';
import { switchMap } from 'rxjs/operators';
import { Product } from 'src/app/_models/product';
import { UpdateService } from 'src/app/_services/update.service';
import { User } from 'src/app/_models/user';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

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

  constructor(private route: ActivatedRoute, private _data: DataService, private _update: UpdateService, private sanitization: DomSanitizer) {
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
    this._update.currentShowUploadComponent.subscribe(showUploadComponent => this.showUploadComponent = showUploadComponent)  // when the user uploaded a product photo, we want do not show the upload component anymore. But therefore we need the information, if a photo was uploaded from the upload component. -> If a user successfully uploads a product photo (status 200), the upload component will change showUploadComponent to false. The _update service then updates this value for all subscribes. Therefore we need to subscribe here, to get that change.
    // load the product:
    this.route.params.pipe(switchMap(params => this._data.getProduct(params['id'])))  // pipe & switchMap take care, that if the userId changes for some reason, the following process gets stopped: https://www.concretepage.com/angular/angular-switchmap-example (not necessary yet, because the user profile image loads pretty fast, but if that takes longer and the user switches to another site, it's better to stop the process)
      .subscribe(product => {
        this.product = product;
        this._update.changeProduct(this.product);    // we change the product in the data service so that if a picture for this product get's uploaded with the upload-file component, the image can be stored under the right productId.
        // is the user who looks at the details of this product also the owner of the product? if he is the owner -> show "delete", "update" and "Upload new Photo" button
        if (this.product.userId == this.user.id) {
          this.isCurrentUserOwner = true;
          this._update.changeImgType("productPic");   // ohne die Zeile, würde bei "upload new Photo" das Photo als USER profile pic behandelt werden. Wir wollen es aber als PRODUCT pic speichern. (Ist etwas ungeschickt gelöst...) 
        }
        // after loading the product, load one product pic (the first photo from the product.picPaths arraylist)
        this._data.loadProductPicByFilename(this.product.picPaths[0], this.product.id).subscribe(image => {   // we only load the first poduct pic (testing)
          this.createImageFromBlob(image);          // transorfms the blob into an image
          // saveAs(val, "test.png")                // uncomment this to download the image in the browser (you also need to uncomment the import file-saver)
        },
          (err: HttpErrorResponse) => {                 // if the image could not be loaded, this part will be executed instead 
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
        );
      },
        (err: HttpErrorResponse) => {                 // if the product could not be loaded, this part will be executed instead 
          if (err.error instanceof Error) {
            console.log('An client-side or network error occurred:', err.error);
          } else if (err.status == 500 || err.status == 404) {
            this.errorMessage = "Produkt konnte nicht gefunden werden.";
          } else {
            //Backend returns unsuccessful response codes such as 400, 500 etc.
            console.log('Backend returned status code: ', err.status);
            console.log('Response body:', err.error);

          }
        }
      );
    this._update.currentUser.subscribe(user => this.user = user)  // always get the latest logged in user -> if the user changes, this will get updated
  }

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
      this.imageToShow = this.sanitization.bypassSecurityTrustResourceUrl(reader.result + "");
    }, false);

    if (image) {
      reader.readAsDataURL(image); //this triggers the reader EventListener
    }
  }
}
