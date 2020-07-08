// Der Update Service sorgt dafür, dass immer bekannt ist, welcher User gerade eingeloggt ist, welches Produkt gerade angeschaut wird, etc.
// Statt die userId in die URL zu schreiben und so zwischen den einzelnen Components zu übermitteln,
// wird hier die UserId vom UpdateService an alle Components automatisch geschickt, die die Info brauchen.
// Immer wenn sich die userId ändert, wird das an alle Components die beim userId Observable subscribed haben geschickt.
// -> Was passiert, wenn zwei User gleichzeitig auf den Service zugreifen? 

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { User } from '../_models/user';
import { Product } from '../_models/product';
import { Dorm } from '../_models/dorm';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  user: User = {id: 1, name: "Harald"};   //the default user is Harald, so that we dont always need to first click on the user before we can see the isOwner functions
  private userSource = new BehaviorSubject(this.user);  // BehaviorSubject = Subject / Observable, das immer noch den letzten Wert bei Subscription ausgibt. Ein Subject sendet bei Subscription direkt noch keinen Wert, sondern erst, wenn nach der Subscription ein neuer Wert vorliegt. Ein Observable gibt bei Subscription alle vorherigen Werte an den neuen Subscribor aus, die seit der Erzeugung des Observables genexted / erzeugt wurden. D.h. nur ein BehaviorSubject gibt bei Subscription direkt den letzten, aktuellen Wert aus.Deshalb braucht BehaviorSubject auch einen Wert direkt beim Erzeugen -> new BehaviorSubject(Anfangswert)
  currentUser = this.userSource.asObservable();

  users: User[];
  private usersSource$ = new BehaviorSubject(this.users);   
  currentUsers$ = this.usersSource$.asObservable();

  product: Product;
  private productSource = new BehaviorSubject(this.product);  
  currentProduct = this.productSource.asObservable();

  imgType: string = "userPic";  // the default imgType is userPic, so if you directly upload a photo from the upload-file component after starting the app, it will treat the upload as a user profile pic. But if you upload a photo from the product-details component, the product-component will change the imgType to productPic.
  private imgTypeSource = new BehaviorSubject(this.imgType);  
  currentImgType = this.imgTypeSource.asObservable();

  showUploadComponent: boolean = false;  // the default imgType is userPic, so if you directly upload a photo from the upload-file component after starting the app, it will treat the upload as a user profile pic. But if you upload a photo from the product-details component, the product-component will change the imgType to productPic.
  private showUploadComponentSource = new BehaviorSubject(this.showUploadComponent);  //false is the default value
  currentShowUploadComponent = this.showUploadComponentSource.asObservable();
  
  selectedDorm: Dorm = { id: 1, name: "Alexanderstraße", lat: 48.767485, lng: 9.179693, city: "Stuttgart", district: "StuttgartMitte" };  // am Anfang wird als default Wohnheim das Max-Kade in Stuggi Mitte gezeigt (bekanntestes Wohnheim in Stg) - alle Wohnheime am Anfang zu zeigen braucht ewig lang zum Laden
  private selectedDormSource = new BehaviorSubject(this.selectedDorm);  
  currentSelectedDorm = this.selectedDormSource.asObservable();

  newPhotoWasUploaded: boolean = false;  // am Anfang wird als default Wohnheim das Max-Kade in Stuggi Mitte gezeigt (bekanntestes Wohnheim in Stg) - alle Wohnheime am Anfang zu zeigen braucht ewig lang zum Laden
  private newPhotoWasUploadedSource = new BehaviorSubject(this.newPhotoWasUploaded);  
  currentNewPhotoWasUploaded = this.newPhotoWasUploadedSource.asObservable();
  triggeringObservable = new Subject<void>();

  constructor() { }

  changeUser(user: User) {
    this.userSource.next(user);
  }

  changeUsers(users: User[]) {
    this.usersSource$.next(users);
  }

  changeProduct(product: Product) {
    this.productSource.next(product);
  }

  changeImgType(imgType: string) {
    this.imgTypeSource.next(imgType);
  }

  changeShowUploadComponent(showUploadComponent: boolean) {
    this.showUploadComponentSource.next(showUploadComponent);
  }
  
  changeSelectedDorm(selectedDorm: Dorm) {
    this.selectedDormSource.next(selectedDorm);
  }
  
  changeNewPhotoWasUploaded() {
    this.triggeringObservable.next(void 0);
  }

 

}
