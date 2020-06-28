import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { trigger, style, transition, animate, query, stagger } from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

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
  imageToShow: any;
  listOfPicsProduct1 = [];


  constructor(private data: DataService, private sanitization: DomSanitizer) { }

  ngOnInit() {
    this.data.getProducts().subscribe(
      data => { this.products = data; console.log("data"); console.log(this.products) }
    );
    this.data.loadProductPics().subscribe(   // load all product images
      images => {
        console.log("images: " +images)
        // this.listOfPicsProduct1 = images[0];
        // console.log("list: " + this.listOfPicsProduct1[0])
      
        // var blob = new Blob([this.listOfPicsProduct1[0]], {type:'application/json'});
        // console.log(blob)
        //alert(blob instanceof Blob)
       
        this.createImageFromBlob(images);
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
  }


  // This image upload code is basically taken from here: https://stackoverflow.com/questions/45530752/getting-image-from-api-in-angular-4-5  (first answer) or see the code directly: https://stackblitz.com/edit/angular-1yr75s
  // But I had to add the sanitization part, otherwise Firefox and Chrome always blocked the image/blob. https://angular.io/guide/security#xss -> Potential security risk... 
  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      // Somebody could create an image and hide javascript code inside of it (an image is just a very long text formatted in base64) 
      // -> this script would get executed, if the image get's transferred to our HTML page in the next line. Therefore it gets blocked by default, unless we bypass it.
      this.imageToShow = this.sanitization.bypassSecurityTrustResourceUrl(reader.result + "");  // the image is read by the FileReader and is returned as an "any". But this needs to be sanitized first, before it can be shown in the HTML. Therefore we pass it into the sanitzation, but there we need a String, therefore we use: reader.result + ""   
    }, false);

    if (image) {
      reader.readAsDataURL(image); //this triggers the reader EventListener
    }
  }
}