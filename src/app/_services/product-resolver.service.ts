import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DataService } from '../data.service';
import { Product } from '../_models/product';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { empty } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ProductResolverService implements Resolve<any> {

  products: Product[];
  imageToShow: any;
  photos: Array<Object> = [];
  map = new Map();

  constructor(private _data: DataService, private sanitizer: DomSanitizer) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._data.getProducts()
    //   data => {
    //     this.products = data
    //    // console.log(this.products)
    //      this.products.forEach(product => {
    //        return this.loadMainProductPicture(product);
    //      })
    //     // console.log(this.map)
       
    //   }
      
    // )
    // pipe(
    //   catchError((error) => {
    //     return empty();
    //   })

    //   );
  }

//loads only the first picture of the pictures of a product (= the main picture)
loadMainProductPicture(product: Product) {
  if (product && product.picPaths && product.picPaths.length > 0) {      // https://stackoverflow.com/questions/62644464/angular-10-undefined-error-despite-if-null
    // after loading the product, load one product pic (the first photo from the product.picPaths arraylist)
    return this._data.loadProductPicByFilename(product.picPaths[0], product.id).subscribe(
      image => {   // we only load the first poduct pic to display in the overview (the other pics can be viewed in the product details)
        // var map = new Map();
        this.map.set(product.id, image); 
        console.log(this.map)        
         // transorfms the blob into an image
      }
    );
  }
}

  // //loads only the first picture of the pictures of a product (= the main picture)
  // loadMainProductPicture(product: Product) {
  //   if (product && product.picPaths && product.picPaths.length > 0) {      // https://stackoverflow.com/questions/62644464/angular-10-undefined-error-despite-if-null
  //     // after loading the product, load one product pic (the first photo from the product.picPaths arraylist)
  //     this._data.loadProductPicByFilename(product.picPaths[0], product.id).subscribe(
  //       image => {   // we only load the first poduct pic to display in the overview (the other pics can be viewed in the product details)
  //         alert("It worked")          // transorfms the blob into an image
  //       },
  //       (err: HttpErrorResponse) => console.log(err)    // if the image could not be loaded, this part will be executed instead 
  //     );
  //   }
  // }

  // This image upload code is basically taken from here: https://stackoverflow.com/questions/45530752/getting-image-from-api-in-angular-4-5  (first answer) or see the code directly: https://stackblitz.com/edit/angular-1yr75s
  // But I had to add the sanitization part, otherwise Firefox and Chrome always blocked the image/blob. https://angular.io/guide/security#xss -> Potential security risk... 
  createImageFromBlob(image: Blob, productId: number): any {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      // Somebody could create an image and hide javascript code inside of it (an image is just a very long text formatted in base64) 
      // -> this script would get executed, if the image get's transferred to our HTML page in the next line. Therefore it gets blocked by default, unless we bypass it.
      // the image is read by the FileReader and is returned as an "any". But this needs to be sanitized first, before it can be shown in the HTML. Therefore we pass it into the sanitzation, but there we need a String, therefore we use: reader.result + ""   
      // this.photos are the photos we want to display stored in an array 
      //this.photos.push(this.sanitizer.bypassSecurityTrustResourceUrl(reader.result + ""));  
      
      this.map.set(productId, this.sanitizer.bypassSecurityTrustResourceUrl(reader.result + ""));  
      console.log(this.sanitizer.bypassSecurityTrustResourceUrl(reader.result + ""))
      console.log(this.map.get(productId))
      console.log(this.map.size)
      for (let [key, value] of this.map.entries()) {
        console.log(key, value);
    }
    return 2;
    }, false);

    if (image) {
      reader.readAsDataURL(image); //this triggers the reader EventListener
    }
  }
}
