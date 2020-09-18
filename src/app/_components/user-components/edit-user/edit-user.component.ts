import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../../_models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../data.service';
import { switchMap, first, takeUntil } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { FormControl } from '@angular/forms';
import { DormGroup } from 'src/app/_models/dormGroup';
import { Dorm } from 'src/app/_models/dorm';
import { UpdateService } from 'src/app/_services/update.service';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UploadFileService } from 'src/app/_services/upload-file.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  user: User;
  editForm: FormGroup;

  dormControl = new FormControl();
  cityControl = new FormControl();
  dormGroups: DormGroup[] = [];  // die Liste kommt vom Backend und wird im onInit befüllt
  cities: string[] = [];        // die Liste hilft zu merken, welche Städte schon in dormGroups auftauchen, erspart mehrere for each schleifen
  allCities: string[] = [];        // die Liste hilft zu merken, welche Städte schon in dormGroups auftauchen, erspart mehrere for each schleifen
  districts: string[] = [];     // die Liste hilft zu merken, welche Stadtviertel schon in dormGroups auftauchen, erspart mehrere for each schleifen
  dorms: Array<Dorm> = [];    // liste aller Wohnheime 
  selectedDorm: Dorm = { id: 1, name: "Alexanderstraße", lat: 48.767485, lng: 9.179693, city: "Stuttgart", district: "StuttgartMitte" }; // irgendwie müssen werte in JS immer am Anfang schon initialisiert werde, das regt richtig auf, wir überschreiben das im onInit sowieso gleich wieder, gibt's da ne andere Möglichkeit?
  response: string;
   // Angular takes care of unsubscribing from many observable subscriptions like those returned from the Http service or when using the async pipe. But the routeParam$ and the _update.currentShowUploadComponent needs to be unsubscribed by hand on ngDestroy. Otherwise, we risk a memory leak when the component is destroyed. https://malcoded.com/posts/angular-async-pipe/   https://www.digitalocean.com/community/tutorials/angular-takeuntil-rxjs-unsubscribe
   destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private formBuilder: FormBuilder, private _token: TokenStorageService,private uploadFileService: UploadFileService, private _update: UpdateService, private router: Router, private dataService: DataService, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.editForm = this.formBuilder.group({
      name: ['' ],
      email: ['', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      password: [''],
      city: [''],
      dorm: [''],
      room: [''],
      profilePic: ['']
    })
    
   this.dataService.getUserForEditing().subscribe((user => {
     this.user = user; 
     console.log(user)
     this.editForm.patchValue({
      name: user.name,
      email: user.email
      });
     ;}))

     this.updateAllCities();
     this.updateDorms();
  }

  ngOnDestroy() {            // Angular takes care of unsubscribing from many observable subscriptions like those returned from the Http service or when using the async pipe. But the routeParam$ and the _update.currentShowUploadComponent needs to be unsubscribed by hand on ngDestroy. Otherwise, we risk a memory leak when the component is destroyed. https://malcoded.com/posts/angular-async-pipe/   https://www.digitalocean.com/community/tutorials/angular-takeuntil-rxjs-unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }

  onSubmit() {
    console.log(this.editForm.value)
    if (this.editForm.value.name != null && this.editForm.value.name.trim().length > 0) {
      this.user.name = this.editForm.value.name;
    }
    this.user.email = this.editForm.value.email;
    if (this.editForm.value.password != null && this.editForm.value.password.trim().length > 0) {
      this.user.password = this.editForm.value.password;
    }
    this.user.dorm = this.selectedDorm;

    this.dataService.updateUser(this.user)
    .subscribe(
      updatedUser => {
        if(updatedUser != null) {  
        this._token.saveToken(updatedUser.token);
        this._token.saveUser(updatedUser);
          console.log('User erfolgreich bearbeitet');
          console.log("New Token:", updatedUser.token);
          console.log(updatedUser)
          this._snackBar.open("Deine Profiländerungen wurde gespeichert.", "", { duration: 2000 });
          this.router.navigate(['/users']);
        } else {
          console.log('User konnte nicht bearbeitet werden.');
          this._snackBar.open("Profiländerungen konnten nicht gespeichert werden.", "", { duration: 2000 });
        }
      },
      (error: any) => {
        console.log(error);
      });
      
  }

  cancelEditing() {
    this.router.navigate(['/users'])
  }

   //get the list of cities that was previously loaded on the main page
   updateAllCities(): void {
    this._update.currentAllCities$
      .pipe(takeUntil(this.destroy$))
      .subscribe(allCities => {
        if (allCities.length > 0) {
          this.allCities = allCities
        } else {
          //if the cities were not previously loaded (can happen when the user refreshes the add-user page without going to the main page), we load them now from the backend.
          this.dataService.getDormLocations().subscribe(dorms => {
            this.dorms = dorms;
            for (let dorm of dorms) {
              if (!this.allCities.includes(dorm.city)) this.allCities.push(dorm.city)  // erstellt eine Liste aller Städte

            }
          })
        }
      })
  }

  //get the list of dorms that were previously loaded on the main page and sort them into the dormGroups
  updateDorms(): void {
    this._update.currentDorms$
      .pipe(takeUntil(this.destroy$))
      .subscribe(dorms => {
        if (dorms.length > 0) {
          this.dorms = dorms;
          console.log("1", this.dorms)
          for (let dorm of this.dorms) {
            this.sortDormIntoDormGroups(dorm);   // fügt jedes Dorm der richtigen Gruppe hinzu (z.B. Stuttgart Mitte, München Nord) -> die Gruppen sind wichtig für das DropDown Select Menü
          }
        } else {
          //if the dorms were not previously loaded (can happen when the user refreshes the add-user page without going to the main page), we load them now from the backend.
          this.dataService.getDormLocations().subscribe(dorms => {   //load all dorms from backend database
            this.dorms = dorms;
            for (let dorm of this.dorms) {
              this.sortDormIntoDormGroups(dorm);   // fügt jedes Dorm der richtigen Gruppe hinzu (z.B. Stuttgart Mitte, München Nord) -> die Gruppen sind wichtig für das DropDown Select Menü
            }
            console.log(this.dorms)
          })
        }

      }
      )
  }

  // this function gets called when the user choses a city in the dropdown select menu above the google maps
  changeSelectedCity(event) {
    // first we have to empty the previously filled arrays, so that we can refill them with the dorms of the newly selected city  
    this.dormGroups = [];
    this.selectedDorm = null;
    this.cities = [];
    this.districts = [];
    // now we can refill the arrays by going through all dorms. If the city of that dorm == the selected city, then add the dorm again
    this.collectDormsByCity(event.value);
  }

  // filter all dorms for the ones that are in one specific city and then sort them into the dormGroups array according to their districts
  collectDormsByCity(city: string) {
    this.dorms.forEach(dorm => {
      if (dorm.city == city) {
        this.sortDormIntoDormGroups(dorm);
      }
    });
  }

  // this function gets called when the user choses a dorm in the dropdown select menu above the google maps -> event.value is the name of the selected dorm. But we need the dorm itself, not just the name, so we go through all dorms and take the one that has the same name.
  changeSelectedDorm(event) {
    this.dorms.forEach(element => {
      if (element.name == event.value) {
        this.selectedDorm = element;
      }
    })

  }

  // komplizierter Sortieralgorithmus, nur anschauen wenn man wissen will, wie das array dormGroups befüllt wird!! -> wenn man bei "Wähle dein Wohnheim aus" auf das dropdown select menü geht, sieht man das Ergebnis von dieser Sortierung
  sortDormIntoDormGroups(dorm: Dorm) {
    if (!this.cities.includes(dorm.city) && dorm.district == null) {   // zB das wohnheim Göppingen hat nur eine Stadt (Göppingen) aber keinen District (in Göppingen gibt's nur 1 Wohnheim, Göppingen ist auch ziemlich klein, "Göppingen Mitte" oder so macht hier keinen Sinn)
      this.cities.push(dorm.city)
      this.dormGroups.push({ name: dorm.city, dorms: [dorm] })            // erstellt eine neue dormGroup mit dem dorm und added sie direkt zu den dormGroups. der name der neuen dormGroup wird gleich der Stadt gesetzt (wenn kein district angegeben ist, gitb es je Stadt nur eine dormGroup)
    } else if (this.cities.includes(dorm.city) && dorm.district == null) {    // zb stadt Ludwigsburg hat mehrere Wohnheime, aber keine districte (Ludwigsburg ist auch relativ klein) -> damit nicht bei jedem Wohnheim eine neue DormGroup erstellt wird, wird eine cities Liste geführt. Ist schon ein Wohnheim für eine city (zb Ludwigsburg) in der Liste cities, dann gibt es auch schon eine dormGroup dafür in der Liste dormGroups. Wir müssen also diese dormGroup aus dormGroups holen und das neue Wohnheim hinzufügen
      this.addDormToExistingDormGroup(dorm, dorm.city);
    } else if (!this.districts.includes(dorm.district)) {               // erstellt für jedes Wohnheim, das einen district angegeben hat und bei dem der district noch nicht in der dormGroups oder in der Liste districts auftaucht, eine neue dormGroup
      this.districts.push(dorm.district)
      this.dormGroups.push({ name: dorm.district, dorms: [dorm] })                               // der name der dormGroup wird gleich dem Stadtviertel! gesetzt (nicht gleich der Stadt), denn wenn das dorm einen District angegeben hat, bedeutet das, dass es mehrere dormGroups für eine Stadt gibt (je Stadtviertel eine dormGroup und nicht je Stadt eine dormGroup)
    } else if (this.districts.includes(dorm.district)) {                                    // added das Wohnheim, das einen district angegeben hat und bei dem der district bereits eine dormGroup in der dormGroups hat      
      this.addDormToExistingDormGroup(dorm, dorm.district);
    }
  }

  // geh durch alle dormGroups und hol die dormGroup, die zu der Stadt oder zu dem Stadtviertel gehört, das im compareString mitgegeben wurde dann adde das Wohnheim zu der dromGroup
  addDormToExistingDormGroup(dorm: Dorm, compareString: string) {
    for (var i = 0; i < this.dormGroups.length; i++) {
      if (this.dormGroups[i].name == compareString) {
        this.dormGroups[i].dorms.push(dorm)  // 
      }
    }
  }

   // This function gets called when the user clicks on "Foto hochladen": https://angular.io/guide/component-interaction
   onFileSelected(selectedFile: File) {
    // This uploadfunction is responsible for handling uploads of user profile images and product pics. 
    this.saveFile(selectedFile);
  }

  saveFile(selectedFile: File) {
    this.uploadFileService.pushFileToStorage(selectedFile, this.user.id, null, "user").subscribe(() => {
      
        this._snackBar.open("Dein Foto wurde gespeichert.", "", { duration: 2000 });
      
      
    },
      (err: HttpErrorResponse) => this.processError(err)    // if the image could not be loaded, this part will be executed instead
    );
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
  

   // getter for form fields with validators -> so that we dont have to write addUser.get('name').value all the time.
   get name(){
    return this.editForm.get('name');
    }

  get email(){
    return this.editForm.get('email');
    }

    get password(){
      return this.editForm.get('password');
      }

      get dorm(){
        return this.editForm.get('dorm');
        }

}
