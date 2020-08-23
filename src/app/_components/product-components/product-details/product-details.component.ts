import { Component, OnInit, NgModule } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../data.service';
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
import {FormControl} from '@angular/forms';
import { UploadFileService } from 'src/app/_services/upload-file.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';



@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  product: Product;

  imagesToShow: SafeResourceUrl[] = [];
  user: User;   // the logged in user
  owner: User = {};   // the user who is the owner of the product
  users: User[] = []; // list of all users, from which we take the owner and user variable. 
  isCurrentUserOwner: boolean = false;
  
  errorMessage: string;
  imagesList = []; //var array = new Array();   is similar to:    var array = [];
  routeParam$: Observable<Product>;
  i: number = 0;
  //snackBar variables
  successMessage = "Foto gelöscht! 😄"

  // Angular takes care of unsubscribing from many observable subscriptions like those returned from the Http service or when using the async pipe. But the routeParam$ and the _update.currentShowUploadComponent needs to be unsubscribed by hand on ngDestroy. Otherwise, we risk a memory leak when the component is destroyed. https://malcoded.com/posts/angular-async-pipe/   https://www.digitalocean.com/community/tutorials/angular-takeuntil-rxjs-unsubscribe
  destroy$: Subject<boolean> = new Subject<boolean>();

  imagesLoaded: Promise<boolean>;  // this boolean gets to set to true when all images are loaded
  deletedImages = [];
  deletedPics: SafeResourceUrl[] = [];

  endDate = new Date();
  startDate = new Date();
  pickUpTime: string;
  returnTime: string;
  // serializedDate = new FormControl((new Date()).toISOString());

  response: string;
  isEditingActivated: boolean = false;
  isAnfragenClicked: boolean = false;
  isLoggedIn: boolean;

  

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthenticationService, private uploadFileService: UploadFileService, private _data: DataService, private _update: UpdateService, private _token: TokenStorageService, private _helper: HelperService, private sanitizer: DomSanitizer, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.routeParam$ = this.route.params.pipe(switchMap(params => this._data.getProduct(params['id'])))  // get the productId from the URL parameter /{id}. pipe & switchMap take care that if the userId changes for some reason, the following process gets stopped: https://www.concretepage.com/angular/angular-switchmap-example (not necessary yet, because the user profile image loads pretty fast, but if that takes longer and the user switches to another site, it's better to stop the process)
    this.loadProductWithProductPictures(); // load the product with the main product picture - get the productId from the URL parameter /{id}
    this.user = this._token.getUser();   //  if the user changes, this will get updated
    this.checkIfUserIsLoggedIn();
    this.subscribeTriggeringObservable();
    // this.loadOwner(); 
    
    
  }

  ngOnDestroy() {            // Angular takes care of unsubscribing from many observable subscriptions like those returned from the Http service or when using the async pipe. But the routeParam$ and the _update.currentShowUploadComponent needs to be unsubscribed by hand on ngDestroy. Otherwise, we risk a memory leak when the component is destroyed. https://malcoded.com/posts/angular-async-pipe/   https://www.digitalocean.com/community/tutorials/angular-takeuntil-rxjs-unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
    this._data.deleteArchive("product", this.product.id).subscribe(() => console.log("archive destroyed"));  // wenn der user die seite wechselt (z.b. wieder zur Produktübersicht), wird das Archiv im Backend gelöscht. Damit lassen sich die Fotos nicht mehr wiederherstellen danach. Wenn das Archiv nicht gelöscht wird, könnte man Probleme bekommen, wenn der User das gleiche Bild nochmal hochlädt und dann wieder löscht, da es dann schon im Archiv liegt... am besten wäre es das Archiv erst zu löschen, wenn der User die Seite ganz verlässt. Oder das Archiv nur alle 2 Wochen zu löschen und dafür die Fehlermeldung bei doppelter Löschung abzufangen...
  }

  // we check if a token exists and if the token is still valid by accessing the dummy controller method welcome
  checkIfUserIsLoggedIn() {
    this.authService.welcome().subscribe((response) =>{
    if (response.status == 200) {
      this.isLoggedIn = true;
      console.log("Is User Logged In?", this.isLoggedIn)
    } else {
      this.isLoggedIn = false
    }
    })
  }

  saveChanges() {
    alert("not implemented yet")
  }

  // https://angular.io/guide/component-interaction
  onFileSelected(selectedFile: File) {
    this.saveFile(selectedFile);
  }

  saveFile(selectedFile: File) {
// This uploadfunction is responsible for handling uploads of user profile images and product pics. (Unecessary complicated, splitting it in two functions would be better for seperation of concerns)
this.uploadFileService.pushFileToStorage(selectedFile, this.user.id, this.product.id, "productPic").subscribe((response: any) => {
  if (response == "Dein Foto wurde gespeichert.")   //it would be better to check the response status == 200, but I dont know how
    this.response = response;
 // this._update.changeNewPhotoWasUploaded();
   this._update.changeShowUploadComponent(false);  // if the user uploaded a product photo, we want do not show the upload component anymore in the productdetails component. But therefore we need the information in the productdetails component. -> If a user successfully uploads a product photo (status 200), the upload component changes showUploadComponent to false here. The _update service then updates this value for all subscribes.
  // setTimeout(() => { this.router.navigate(['']); }, 700);  // after uploading a photo we go back to the main page immediatly -> could be changed, maybe better show a success message and stay on the current page...
},
  (err: HttpErrorResponse) => this.processError(err)    // if the image could not be loaded, this part will be executed instead
);
  }
  


  // loadUsersFromBackend() {
  //   this._data.getUsers().subscribe(users => {      // HTTP Observable (no unsubscribe needed)
  //     this.users = users;
  //     this._update.changeUsers(this.users);   // we update the users in all components, so that we dont need to load them again from the backend.
  //   })
  // }

  // when a new photo gets uploaded, the triggeringObservable will be triggered and the following code will be excecuted (to refresh the photots, so that it immediately shows the newly uploaded photo.)
  subscribeTriggeringObservable() {
    this._update.triggeringObservable.subscribe(() => {
      this._data.getProduct(this.product.id).subscribe(product => {   //the triggeringObservable is of type Observable<void>, so it returns always undefined as value, so we do just .subscribe( () => ...)
        this.product = product;   // we reloaded the product, so that we have the actualised product.picPaths with the new photo.
        // // now we need to check, if the new uploaded photo was maybe deleted earlier -> then it would be in the archive and the user could click "Foto zurückholen", which would cause a fileAlreadyExists Exception, because we would copy the image from the archive to the product image folder, but it already exists in the image folder (because it was uploaded again by the user before restoring it). We dont delete it from the backend here, because the backend handeles it itself and deletes it if the image is in archive directly at the image upload. 
        // // TODO: This whole part doesn't make sense anymore, because the photo name is randomly generated now while cropping... Vlt kann man statt nach Dateinamen nach Base64  suchen?
        // if (product.picPaths != null || product.picPaths.length != 0) {
        //   const reuploadedButStillArchivedImages = product.picPaths.filter(element => this.deletedImages.includes(element));
        //   if (reuploadedButStillArchivedImages.length != 0) {
        //     reuploadedButStillArchivedImages.forEach(image => {
        //       this.deletedPics.splice(this.deletedImages.indexOf(image), 1)   // deletes the image blob in the frontend so that we can't restore the image anymore
        //       this.deletedImages.splice(this.deletedImages.indexOf(image), 1)  // deletes the image name in the frontend so that we can't restore the image anymore
        //     });
        //   }
        // }
        
        console.log(" to show emptied");
        this.imagesToShow = [];   // we clear the imagesToShow and refill it in the next step (if you dont clear it first, the old photos will appear twice in the array)
        this.loadProductWithProductPictures();  // we load all photos again. (maybe in the future find a way to only load the new photo and not clear the array before)
      })
    });
  }

  loadProductWithProductPictures() {             // load the product with the main product picture:
    this.routeParam$
      .pipe(takeUntil(this.destroy$))           // We need to unsubscribe from this Observable by hand, because its not an observable returned by a http request
      .subscribe(product => {
        this.product = product;  
        // load the owner of the product:
        this._data.getOwner(this.product.id).subscribe((owner => this.owner = owner));                  
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
     
// // I didn't want to nest the loadOwner() inside the loadProductWithProductPictures() -> It's best to load the owner onInit, and make it await loading the users AND the product, because the problem is that only when we have the productId, we can load the owner. But right now, the code is already a bit to much grown to make it await loadproduct 
//   async loadOwner() {

//     await this.loadUsers()  
//    // await this.loadProductWithProductPictures()   // <- this would load the product again!
//     // do something else here after firstFunctions complete
//     this.owner = this.users.filter(user => user.id === this.product.userId)[0]  // das filtern gibt ein neues array zurück. Da es aber immer nur einen user mit der passenden id geben kann, wird das array immer max. 1 element enthalten. daher nehmen wir uns element [0] direkt aus dem gefilterten array.
//   }

//   // https://stackoverflow.com/questions/62819495/js-async-await-second-function-doesnt-wait-for-first-function-to-complete/62819532#62819532
//   async loadUsers(): Promise<any> {
//     this.users = await this._data.getUsers().toPromise();
//     return Promise.resolve();
//   }

  // we only load the first poduct pic (testing)
  loadProductPics() {
    this.product.picPaths.forEach(picPath => {
      this.loadProductPic(picPath, this.product.id)
    });
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
    imageArchived$.subscribe(() => {                                                               // da das Observable imageArchived$ von HTTP erzeugt wird, muss man hier nicht per Hand unsubscriben
      this._data.deleteProductPicByFilename(this.product.picPaths[imageId], this.product.id).subscribe(res => {    //löscht das Foto (nachdem es archiviert wurde) im Backend (lokal und DB) und returned "true", wenn es geklappt hat.
        if (res) {
          this.deletedImages.push(this.product.picPaths[imageId]);  // we add the image to the deleted images variable (the variable stores all in one session by one user deleted images. If he logs out, the var will be destroyed and he can't restore the images anymore)

          this.deleteImageFromProductArray(this.product.picPaths[imageId]);  // löschen des Fotos im Frontend (vom Product.picPaths array)
          this.deleteImageFromImagesToShow(imageId);                          // löschen des Fotos im Frontend (vom imagesToShow array -> erst mit der Aktion wird das Foto nicht mehr angezeigt)

          //show SnackBar (snackBar ist dieses kleine Infofenster, das nach Löschen 2 Sekunden lang auftaucht.)
          let snackBarRef = this._snackBar.open(this.successMessage, "Rückgängig", { duration: 2000 });   // die snackbar ist 2 Sek geöffnet
          snackBarRef.onAction()
            .pipe(takeUntil(this.destroy$))                                   // We need to unsubscribe from this Observable by hand
            .subscribe(() => {                                                // Wenn der User in der Snackbar auf "Rückgängig" klickt wird das ausgeführt
              console.log('The snack-bar action was triggered!');
              this.restoreLastImage();
            });

        } else {
          this._snackBar.open("Foto konnte nicht gelöscht werden.", "", { duration: 2000 });
        }

      });
    })

  }

  restoreLastImage() {
    var picPath = this.deletedImages.pop();    // nimmt den letzten Eintrag von deletedImages array zb "test.png" UND löscht ihn gleichzeitig vom Array  
    console.log("Foto wird wiederhergestellt: " + picPath + " + productId: " + this.product.id)
    // fügt das Foto im Frontend wieder hinzu (zum imagesToShow array -> nach der Aktion wird das Foto wieder angezeigt) 
    // ACHTUNG!!! deletedPics & deletedImages ist nicht das selbe. deletedPics enthält die sanitized image blobs/URLs. deletedImages enthält die Namen der dazugehörigen Images, also z.b. test.png 
    this.imagesToShow.push(this.deletedPics.pop()[0]);  // .pop() removes the last element of an array! (not a map) and returns it. deletedImages is a map(), so .pop() always returns an array with one element instead of only the element. So I had to do: .pop()[0] to get the value of that element from the pop array.

    this._data.restorePicByFilename(picPath, "product", this.product.id)   //fügt das Foto im Backend wieder hinzu -> im Backend (lokal und DB) + löschen ausm Archiv. 
      .subscribe(() => console.log("YISS"));             // da das Observable von HTTP erzeugt wird, muss man hier nicht per Hand unsubscriben
    this.product.picPaths.push(picPath)                 // fügt das Foto im Frontend wieder hinzu (zum Product.picPaths array)

  }

  deleteImageFromProductArray(filename: string) {
    const index: number = this.product.picPaths.indexOf(filename);  //findet die Position des images/elements im Array
    if (index !== -1) {                                              // wenn index = -1 hat das element nicht im array existiert
      this.product.picPaths.splice(index, 1);                        // löscht 1 element an der Stelle index vom Array product.picPaths
    }
  }

  deleteImageFromImagesToShow(index: number) {
    if (index >= 0) {                                               // negative Werte machen hier keinen Sinn
      this.deletedPics.push(this.imagesToShow.splice(index, 1));    // löscht 1 element an der Stelle index vom Array imagesToShow und fügt es gleich dem Array deletedPics hinzu.
    }
  }

  
  deleteProduct(id: number) {
    this._data.deleteProduct(id)
      .subscribe(data => {
        console.log(data);
        // this.products = this.products.filter(product => product.id !== id);
        console.log('Product deleted successfully!');
        this.router.navigate(['products']);
        // we have to reload the product images, because we dont store the productId with the images, so if the order of products changes, the images would get mixed up.
        // this.loadProductImages();
      })
  };

  
  onAnfrageSubmit() { 
    this.sendEmailToOwner(this.createFormdata());
    this.sendMessageToOwner(this.createFormdata());
  }

  createFormdata(): FormData {
    const formdata: FormData = new FormData();
    formdata.append('startDate', this.startDate.toISOString());
    formdata.append('endDate', this.endDate.toISOString());
    if (this.pickUpTime) {
      formdata.append('pickUpTime', this.pickUpTime);
    }
    if (this.pickUpTime) {
      formdata.append('returnTime', this.returnTime);
    }
    formdata.append('productId', this.product.id.toString());
    return formdata;
  }
  

  sendEmailToOwner(formdata: FormData) {
    this._data.sendEmailToOwner(formdata).subscribe(data => console.log(data));
  }

  sendMessageToOwner(formdata: FormData) {
    this._data.sendMessageToOwner(formdata).subscribe(data => console.log(data));
  }

  // takes the error and then displays a response to the user or only logs the error on the console (depending on if the error is useful for the user)
  processError(err: HttpErrorResponse) {
    if (err.error instanceof Error) {
      //A client-side or network error occurred.
      alert("Image could't be uploaded. Client-side error.")
      console.log('An client-side or network error occurred:', err.error.message);
    } else if (err.status == 304) {
      this.response = "Foto mit selbem Namen wurde vom gleichen User schonmal hochgeladen. 😄";
    } else if (err.status == 400) {
      this.response = "Foto mit selbem Namen wurde schonmal hochgeladen. 😢";
    } else if (err.status == 0) {
      this.response = "Foto abgelehnt, Foto muss kleiner 500KB sein. 😢";
    } else {
      //Backend returns unsuccessful response codes such as 404, 500 etc.
      console.log('Backend returned status code: ', err.status);
      console.log('Response body:', err.error);
    }
  }

  cancelEditingClick = function(isEditingActivatedInChild) {
    this.isEditingActivated = isEditingActivatedInChild;
  }

  showLoginPopup() {
    this.isAnfragenClicked = !this.isAnfragenClicked;
  }
}
