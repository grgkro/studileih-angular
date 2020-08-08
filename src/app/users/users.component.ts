import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { trigger,style,transition,animate,query,stagger } from '@angular/animations';
import { User } from '../_models/user';
import { Observable, asyncScheduler, Subject } from 'rxjs';
import { UpdateService } from '../_services/update.service';
import { takeUntil, take } from 'rxjs/operators';
import { Dorm } from '../_models/dorm';
import { UploadFileService } from '../_services/upload-file.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
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

export class UsersComponent implements OnInit {

  users$: Observable<User[]>;
  users: User[];
  currentUser: User;
  dorms: Dorm[];
  dataLoaded: Promise<boolean>;
  userImagesMap = new Map();

   // Angular takes care of unsubscribing from many observable subscriptions like those returned from the Http service or when using the async pipe. But the routeParam$ and the _update.currentShowUploadComponent needs to be unsubscribed by hand on ngDestroy. Otherwise, we risk a memory leak when the component is destroyed. https://malcoded.com/posts/angular-async-pipe/   https://www.digitalocean.com/community/tutorials/angular-takeuntil-rxjs-unsubscribe
   destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private _data: DataService, private _update: UpdateService, private uploadFileService: UploadFileService, private sanitizer: DomSanitizer,) { }

  ngOnInit(): void {
    this.users$ = this._data.getUsers();   // we dont subscribe here, bc we also need the Observable users$ on the HTML side.
    this.updateUser();
    this.loadUsersAndProfileImages();
    this.updateDorms();
  }

  ngOnDestroy() {            // Angular takes care of unsubscribing from many observable subscriptions like those returned from the Http service or when using the async pipe. But the routeParam$ and the _update.currentShowUploadComponent needs to be unsubscribed by hand on ngDestroy. Otherwise, we risk a memory leak when the component is destroyed. https://malcoded.com/posts/angular-async-pipe/   https://www.digitalocean.com/community/tutorials/angular-takeuntil-rxjs-unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }

  updateUser(): void {
    this._update.currentUser
    .pipe(takeUntil(this.destroy$))
    .subscribe(user => this.currentUser = user)
  }

  updateDorms(): void {
   // https://stackoverflow.com/questions/63314366/code-in-if-and-else-statement-get-both-executed/63314462#63314462
   this._update.currentDorms$
   .pipe(take(1))
   .subscribe(dorms => {
     if (dorms.length > 0) {
       this.dorms = dorms
       console.log("if statement", dorms)
     } else if (dorms.length == 0) {
       this._data.getDormLocations().subscribe(dorms => {
         this.dorms = dorms; 
         this._update.changeDorms(dorms);
         console.log("else statement", dorms)})
     }
    })
  }

  loadUsersAndProfileImages() {
    this.users$.subscribe((users) => {
      this.users = users;
    for (let user of users) {
      this.loadProfilePic(user);
    }
    this.dataLoaded = Promise.resolve(true);
    }); 
  }


  loadProfilePic(user: User) {
    console.log(user.id)
    this.uploadFileService.getUserPic(user.id).subscribe(       // load user image
      image => {
        console.log(image)
        this.createImageFromBlob(image, user);
      })
  }

  // This image upload code is basically taken from here: https://stackoverflow.com/questions/45530752/getting-image-from-api-in-angular-4-5  (first answer) or see the code directly: https://stackblitz.com/edit/angular-1yr75s
  // But I had to add the sanitization part, otherwise Firefox and Chrome always blocked the image/blob. https://angular.io/guide/security#xss -> Potential security risk... 
  createImageFromBlob(image: Blob, user: User) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      // Somebody could create an image and hide javascript code inside of it (an image is just a very long text formatted in base64) 
      // -> this script would get executed, if the image get's transferred to our HTML page in the next line. Therefore it gets blocked by default, unless we bypass it.
      this.userImagesMap.set(user.id, this.sanitizer.bypassSecurityTrustResourceUrl(reader.result + ""));
    
    }, false);

    if (image) {
      reader.readAsDataURL(image); //this triggers the reader EventListener
    }
  }

}
