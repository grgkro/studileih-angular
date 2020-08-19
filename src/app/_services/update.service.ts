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
import { Chat } from '../_models/chat';
import { Marker } from '@agm/core';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  
  

  user: User = {id: 1, name: "HaraldTest", dormId: 1};   //the default user is Harald, so that we dont always need to first click on the user before we can see the isOwner functions
  private userSource = new BehaviorSubject(this.user);  // BehaviorSubject = Subject / Observable, das immer noch den letzten Wert bei Subscription ausgibt. Ein Subject sendet bei Subscription direkt noch keinen Wert, sondern erst, wenn nach der Subscription ein neuer Wert vorliegt. Ein Observable gibt bei Subscription alle vorherigen Werte an den neuen Subscribor aus, die seit der Erzeugung des Observables genexted / erzeugt wurden. D.h. nur ein BehaviorSubject gibt bei Subscription direkt den letzten, aktuellen Wert aus.Deshalb braucht BehaviorSubject auch einen Wert direkt beim Erzeugen -> new BehaviorSubject(Anfangswert)
  currentUser = this.userSource.asObservable();

  token: String = '';   
  private tokenSource = new BehaviorSubject(this.token);  
  currentToken = this.tokenSource.asObservable();

  users: User[] = [];
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
  
  dorms: Dorm[] = [];
  private dormsSource$ = new BehaviorSubject(this.dorms);  
  currentDorms$ = this.dormsSource$.asObservable();

  selectedDorm: Dorm = { id: 1, name: "Alexanderstraße", lat: 48.767485, lng: 9.179693, city: "Stuttgart", district: "StuttgartMitte" };  // am Anfang wird als default Wohnheim das Max-Kade in Stuggi Mitte gezeigt (bekanntestes Wohnheim in Stg) - alle Wohnheime am Anfang zu zeigen braucht ewig lang zum Laden
  private selectedDormSource = new BehaviorSubject(this.selectedDorm);  
  currentSelectedDorm = this.selectedDormSource.asObservable();

  markerClicked: Dorm = { id: 1, name: "Alexanderstraße", lat: 48.767485, lng: 9.179693, city: "Stuttgart", district: "StuttgartMitte" };  // am Anfang wird als default Wohnheim das Max-Kade in Stuggi Mitte gezeigt (bekanntestes Wohnheim in Stg) - alle Wohnheime am Anfang zu zeigen braucht ewig lang zum Laden  
  private markerClickedSource = new BehaviorSubject(this.markerClicked);  
  currentMarkerClicked = this.markerClickedSource.asObservable();

  allCities: string[] = [];
  private allCitiesSource$ = new BehaviorSubject(this.allCities);  //false is the default value
  currentAllCities$ = this.allCitiesSource$.asObservable();

  // stores all chats of the logged in user
  chats: Chat[] = [];
  private chatsSource$ = new BehaviorSubject(this.chats);   
  currentChats$ = this.chatsSource$.asObservable();

// this observable is getting triggered, when a new file was uploaded in the upload file component -> in the product details component we then reload the images, so that the newly image gets immediatly displayed (otherwise we would first need to refresh the page)
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

  changeMarkerClicked(markerClicked: Dorm) {
    this.markerClickedSource.next(markerClicked);
  }

  changeDorms(dorms: Dorm[]) {
    this.dormsSource$.next(dorms);
  }
  
  
  changeNewPhotoWasUploaded() {
    this.triggeringObservable.next(void 0);
  }

  changeListOfAllCities(allCities: string[]) {
    this.allCitiesSource$.next(allCities);
  }

  changeChats(chats: Chat[]) {
  this.chatsSource$.next(chats);
  }
 

}
