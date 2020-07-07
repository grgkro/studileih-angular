import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../data.service';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Product } from 'src/app/_models/product';
import { UpdateService } from 'src/app/_services/update.service';
import { HelperService } from 'src/app/_services/helper.service';
import { User } from 'src/app/_models/user';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs/internal/Observable';  // Don't make general imports like this: import { Observable, Subject } from 'rxjs'; -> You have now all of rxjs imported and that will slow down your app.
import { Subject } from 'rxjs/internal/Subject';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  product: Product;

  imagesToShow: SafeResourceUrl[] = [];
  user: User;   // In the beginning (before a user logged in) the user is undefined
  isCurrentUserOwner: boolean = false;
  showUploadComponent: boolean = false;
  errorMessage: string;
  imagesList = [];
  routeParam$: Observable<Product>;
  i: number = 0;
  //snackBar variables
  successMessage = "Foto gelöscht! 😄"

  // Angular takes care of unsubscribing from many observable subscriptions like those returned from the Http service or when using the async pipe. But the routeParam$ and the _update.currentShowUploadComponent needs to be unsubscribed by hand on ngDestroy. Otherwise, we risk a memory leak when the component is destroyed. https://malcoded.com/posts/angular-async-pipe/   https://www.digitalocean.com/community/tutorials/angular-takeuntil-rxjs-unsubscribe
  destroy$: Subject<boolean> = new Subject<boolean>();

  imagesLoaded: Promise<boolean>;  // this boolean gets to set to true when all images are loaded
  deletedImages = new Map();
  deletedPics: SafeResourceUrl[] = [];


  constructor(private route: ActivatedRoute, private _data: DataService, private _update: UpdateService, private _helper: HelperService, private sanitizer: DomSanitizer, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.subscribeShowUploadObservable();
    this.routeParam$ = this.route.params.pipe(switchMap(params => this._data.getProduct(params['id'])))  // get the productId from the URL parameter /{id}. pipe & switchMap take care that if the userId changes for some reason, the following process gets stopped: https://www.concretepage.com/angular/angular-switchmap-example (not necessary yet, because the user profile image loads pretty fast, but if that takes longer and the user switches to another site, it's better to stop the process)
    this.loadProductWithProductPicture(); // load the product with the main product picture - get the productId from the URL parameter /{id}
    this.updateUser();   //  if the user changes, this will get updated
  }

  ngOnDestroy() {            // Angular takes care of unsubscribing from many observable subscriptions like those returned from the Http service or when using the async pipe. But the routeParam$ and the _update.currentShowUploadComponent needs to be unsubscribed by hand on ngDestroy. Otherwise, we risk a memory leak when the component is destroyed. https://malcoded.com/posts/angular-async-pipe/   https://www.digitalocean.com/community/tutorials/angular-takeuntil-rxjs-unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
    this._data.deleteArchive("product", this.product.id).subscribe(()=> console.log("archive destroyed"));  // wenn der user die seite wechselt (z.b. wieder zur Produktübersicht), wird das Archiv im Backend gelöscht. Damit lassen sich die Fotos nicht mehr wiederherstellen danach. Wenn das Archiv nicht gelöscht wird, könnte man Probleme bekommen, wenn der User das gleiche Bild nochmal hochlädt und dann wieder löscht, da es dann schon im Archiv liegt... am besten wäre es das Archiv erst zu löschen, wenn der User die Seite ganz verlässt. Oder das Archiv nur alle 2 Wochen zu löschen und dafür die Fehlermeldung bei doppelter Löschung abzufangen...

  }

  updateUser(): void {
    this._update.currentUser.subscribe(user => this.user = user)
  }

  subscribeShowUploadObservable(): void {
    this._update.currentShowUploadComponent
      .pipe(takeUntil(this.destroy$))             // We need to unsubscribe from this Observable by hand
      .subscribe(showUploadComponent => this.showUploadComponent = showUploadComponent)  // when the user uploaded a product photo, we want do not show the upload component anymore. But therefore we need the information, if a photo was uploaded from the upload component. -> If a user successfully uploads a product photo (status 200), the upload component will change showUploadComponent to false. The _update service then updates this value for all subscribes. Therefore we need to subscribe here, to get that change.
  }

  loadProductWithProductPicture() {             // load the product with the main product picture:
    this.routeParam$
      .pipe(takeUntil(this.destroy$))           // We need to unsubscribe from this Observable by hand
      .subscribe(product => {
        this.product = product;
        this._update.changeProduct(this.product);    // we change the product in the data service so that if a picture for this product get's uploaded with the upload-file component, the upload-component knows witch is the current product and the image can be stored under the right productId.
        // is the user who looks at the details of this product also the owner of the product? if he is the owner -> show "delete", "update" and "Upload new Photo" button
        if (this.user != undefined && this.product.userId == this.user.id) {
          this.isCurrentUserOwner = true;
          this._update.changeImgType("productPic");   // ohne die Zeile, würde bei "upload new Photo" das Photo als USER profile pic behandelt werden. Wir wollen es aber als PRODUCT pic speichern. (Ist etwas ungeschickt gelöst...) 
        }
        if (product.picPaths != undefined || product.picPaths != null) this.loadProductPics();  // after loading the product, load one product pic (the first photo from the product.picPaths arraylist)  
      },
        (err: HttpErrorResponse) => {                 // if the product could not be loaded, this part will be executed instead 
          this.errorMessage = this._helper.createErrorMessage(err, "Produkt konnte nicht gefunden werden.");
        }
      );
  }

  // we only load the first poduct pic (testing)
  loadProductPics() {
    this.product.picPaths.forEach(picPath => {
      this.loadProductPic(picPath, this.product.id)});
    this.imagesLoaded = Promise.resolve(true);   // now that all images are loaded, we display them by setting the boolean to true -> *ngIf="imagesLoaded | async" in HTML is now true
  }

  loadProductPic(picPath: string, productId: number) {
    this._data.loadProductPicByFilename(picPath, productId).subscribe(image => {  //loads the file as a blob from backend
      this.createImageFromBlob(image);          // transforms the blob into an image
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
      this.imagesToShow.push(this.sanitizer.bypassSecurityTrustResourceUrl(reader.result + ""));   // fügt das überprüfte (sichere) Bild dem Array imagesToShow hinzu -> Das array wird auf der html seite durchgeaechet
    }, false);

    if (image) {
      reader.readAsDataURL(image); //this triggers the reader EventListener
    }
  }

  deleteProductImage(imageId: number) {
    let imageArchived$ = this._data.archivePicByFilename(this.product.picPaths[imageId], "product", this.product.id);  //archiviert das Foto bevor es gelöscht wird
        imageArchived$.subscribe( () => {                                                               // da das Observable imageArchived$ von HTTP erzeugt wird, muss man hier nicht per Hand unsubscriben
          this._data.deleteProductPicByFilename(this.product.picPaths[imageId], this.product.id).subscribe(res => {    //löscht das Foto (nachdem es archiviert wurde) im Backend (lokal und DB) und returned "true", wenn es geklappt hat.
            if (res) {
              this.deletedImages.set(this.product.id, this.product.picPaths[imageId]);  // we add the image to the deleted images variable (the variable stores all in one session by one user deleted images. If he logs out, the var will be destroyed and he can't restore the images anymore)
              
                this.deleteImageFromProductArray(this.product.picPaths[imageId]);  // löschen des Fotos im Frontend (vom Product.picPaths array)
                this.deleteImageFromImagesToShow(imageId);                          // löschen des Fotos im Frontend (vom imagesToShow array -> erst mit der Aktion wird das Foto nicht mehr angezeigt)
      
                //show SnackBar (snackBar ist dieses kleine Infofenster, das nach Löschen 2 Sekunden lang auftaucht.)
              let snackBarRef = this._snackBar.open(this.successMessage, "Rückgängig", {duration: 2000});
              snackBarRef.onAction()                                               
                .pipe(takeUntil(this.destroy$))                                   // We need to unsubscribe from this Observable by hand
                .subscribe(() => {                                                // Wenn der User in der Snackbar auf "Rückgängig" klickt wird das ausgeführt
                  console.log('The snack-bar action was triggered!');
                  this.restoreLastImage();
                });
              
            } else {
              this._snackBar.open("Foto konnte nicht gelöscht werden.","",{duration: 2000});
            }
      
          });
        })

  }

  restoreLastImage() {
    var picPath = Array.from(this.deletedImages.values()).pop();    // erstellt zuerst einen 1:1 gleichen neuen Array von deletedImages.values (values sind die Bildernamen als strings also zb "test.png") und nimmt dann (pop) den letzten Eintrag von diesem neu erzeugten Array. Dadurch wird der deletedImages array nicht verändert. Pop() nimmt immer den letzten Eintrag eines Arrays UND löscht ihn gleichzeitig vom Array -> wir wollen hier den Eintrag aber nicht löschen. 
    var productId = Array.from(this.deletedImages.keys()).pop();
    console.log("picPath: " + picPath + " + productId: " + productId)
    // fügt das Foto im Frontend wieder hinzu (zum imagesToShow array -> nach der Aktion wird das Foto wieder angezeigt)
    this.imagesToShow.push(this.deletedPics.pop()[0]);  // .pop() removes the last element of an array and returns it. But somehow here .pop() always returned an array with one element instead of only the element. So I had to do: .pop()[0] to get that element from the pop array.
    this._data.restorePicByFilename(picPath, "product", productId)   //fügt das Foto im Backend wieder hinzu -> im Backend (lokal und DB) + löschen ausm Archiv. 
    .subscribe( () => console.log("YISS"));             // da das Observable von HTTP erzeugt wird, muss man hier nicht per Hand unsubscriben
    this.product.picPaths.push(picPath)                 // fügt das Foto im Frontend wieder hinzu (zum Product.picPaths array)
  }

  deleteImageFromProductArray(filename: string) {
    const index: number = this.product.picPaths.indexOf(filename);  //findet die Position des elements im Array
    if (index !== -1) {                                              // wenn index = -1 hat das element nicht im array existiert
      this.product.picPaths.splice(index, 1);                        
    }
  }

  deleteImageFromImagesToShow(index: number) {
    if (index >= 0) {                                               // negative Werte machen hier keinen Sinn
      this.deletedPics.push(this.imagesToShow.splice(index, 1));    // löscht 1 element an der Stelle index vom Array imagesToShow und fügt es gleich dem Array deletedPics hinzu.
    }
  }
}
