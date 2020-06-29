import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { trigger, style, transition, animate, query, stagger } from '@angular/animations';
import { Product } from 'src/app/_models/product';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { fromEvent } from 'rxjs';


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
  imageToShow: any;
  photos: Array<Object> = [];
  

  constructor(private _data: DataService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    //load all products from the database
    this._data.getProducts().subscribe(
      products => {
        this.products = products; console.log(this.products)
        products.forEach(
          product => {
            if (product && product.picPaths && product.picPaths.length > 0) {      // https://stackoverflow.com/questions/62644464/angular-10-undefined-error-despite-if-null
              // after loading the product, load one product pic (the first photo from the product.picPaths arraylist)
              this._data.loadProductPicByFilename(product.picPaths[0], product.id).subscribe(
                image => {   // we only load the first poduct pic 
                  console.log(image)
                  this.createImageFromBlob(image);          // transorfms the blob into an image
                  console.log("heee: " + this.photos[0])
                  this.imageToShow = this.photos[0]
                  console.log("what? " + this.imageToShow)
                  // saveAs(val, "test.png")                // uncomment this to download the image in the browser (you also need to uncomment the import file-saver)
                },
                (err: HttpErrorResponse) => this.processError(err)    // if the image could not be loaded, this part will be executed instead 
              );
            }

          })

      });
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


  // This image upload code is basically taken from here: https://stackoverflow.com/questions/45530752/getting-image-from-api-in-angular-4-5  (first answer) or see the code directly: https://stackblitz.com/edit/angular-1yr75s
  // But I had to add the sanitization part, otherwise Firefox and Chrome always blocked the image/blob. https://angular.io/guide/security#xss -> Potential security risk... 
  
  createImageFromBlob(image: Blob): any {
    let reader = new FileReader();
    let sanitizedImage: any
    reader.addEventListener("load", () => {
      // Somebody could create an image and hide javascript code inside of it (an image is just a very long text formatted in base64) 
      // -> this script would get executed, if the image get's transferred to our HTML page in the next line. Therefore it gets blocked by default, unless we bypass it.
      // the image is read by the FileReader and is returned as an "any". But this needs to be sanitized first, before it can be shown in the HTML. Therefore we pass it into the sanitzation, but there we need a String, therefore we use: reader.result + ""   
      // this.productPicToShow is the 
      sanitizedImage = this.sanitizer.bypassSecurityTrustResourceUrl(reader.result + "");
      this.photos.push(this.sanitizer.bypassSecurityTrustResourceUrl(reader.result + ""));
      console.log("photo" + this.photos[0])
      this.imageToShow = this.photos[0]
      // this.photos.push(sanitizedImage);
    }, false);

    if (image) {
      reader.readAsDataURL(image); //this triggers the reader EventListener
    }
  }

}