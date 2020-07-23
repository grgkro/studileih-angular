import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MouseEvent } from '@agm/core';
import { FormControl } from '@angular/forms';
import { DataService } from '../../data.service';
import { Dorm } from 'src/app/_models/dorm';
import { UpdateService } from 'src/app/_services/update.service';
import { User } from 'src/app/_models/user';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Product } from 'src/app/_models/product';
import { InfoWindow } from '@agm/core/services/google-maps-types';
import { HelperService } from 'src/app/_services/helper.service';

interface DormGroup {
  disabled?: boolean;
  name?: string;
  dorms?: Dorm[];
}

// just an interface for type safety.
interface Marker {
	lat: number;
	lng: number;
	label?: string;
	draggable: boolean;
}


@Component({
  selector: 'app-google-maps',
  styles: ['agm-map { height: 300px; }'], //the heigt of a google maps needs to be set, otherwise you won't see it. Default height is 0 px 
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.scss']
})
export class GoogleMapsComponent implements OnInit {
  @Input() usersFromSelectedDorm: User[];    // we only need to import this users list from the products overview to pass it on to the child component <app-info-window-product-overview> (which is actually now a user-overview)
  @Input() dormProducts: Product[];                  
  @Input() productImagesMap: Map<number, SafeResourceUrl>;                  //The map stores all product images together with the product id: User[];    // we only need to import this users list from the products overview to pass it on to the child component <app-info-window-product-overview> (which is actually now a user-overview)
  // @Input() imagesLoaded: Promise<boolean>;;                 
  @Output() endGoogleMapsLoading = new EventEmitter<any>();
  
 
  currZoom: number = 13;
  isSnazzyInfoWindowOpened: boolean = false;
  clickedMarker: string;  // auf welchen Marker wurde geklickt?

  dormControl = new FormControl();
  cityControl = new FormControl();
  dormGroups: DormGroup[] = [];  // die Liste kommt vom Backend und wird im onInit befüllt
  cities: string[] = [];        // die Liste hilft zu merken, welche Städte schon in dormGroups auftauchen, erspart mehrere for each schleifen
  allCities: string[] = [];        // die Liste hilft zu merken, welche Städte schon in dormGroups auftauchen, erspart mehrere for each schleifen
  districts: string[] = [];     // die Liste hilft zu merken, welche Stadtviertel schon in dormGroups auftauchen, erspart mehrere for each schleifen
  dorms: Array<Dorm> = [];    // liste aller Wohnheime 
  selectedDorm: Dorm = { id: 1, name: "Alexanderstraße", lat: 48.767485, lng: 9.179693, city: "Stuttgart", district: "StuttgartMitte" }; // irgendwie müssen werte in JS immer am Anfang schon initialisiert werde, das regt richtig auf, wir überschreiben das im onInit sowieso gleich wieder, gibt's da ne andere Möglichkeit?
  dormsToShow: Dorm[] = [];
  markers: Marker[] = [];
  previousOpenedInfoWindow: InfoWindow;

  constructor(private _data: DataService, private _update: UpdateService, private _helper: HelperService) { }

  ngOnInit(): void {
    this._data.getDormLocations().subscribe(dorms => {   //load all dorms from backend database
      for (let dorm of dorms) {
        this.dorms.push(dorm);    // fügt alle dorms einem Array hinzu (brauchen wir später)
        if (dorm.name == "Alexanderstraße") {   
          this.selectedDorm = dorm;   // am Anfang wird als default Wohnheim das Max-Kade in Stuggi Mitte gezeigt (bekanntestes Wohnheim in Stg) - alle Wohnheime am Anfang zu zeigen braucht ewig lang zum Laden
          this._update.changeSelectedDorm(this.selectedDorm);    // we change the dorm in the update service so that the other components can know, which dorm is selected
        }
        if (!this.allCities.includes(dorm.city)) this.allCities.push(dorm.city)  // erstellt eine Liste aller Städte
        this.sortDormIntoDormGroups(dorm);   // fügt jedes Dorm der richtigen Gruppe hinzu (z.B. Stuttgart Mitte, München Nord) -> die Gruppen sind wichtig für das DropDown Select Menü
      }

       
    })
  }

  ngAfterViewInit(): void {
    this.endGoogleMapsLoading.emit(performance.now());
  }

  // this function gets called when the user choses a city in the dropdown select menu above the google maps
  changeSelectedCity(event) {  
    // first we have to empty the previously filled arrays, so that we can refill them with the dorms of the newly selected city  
    this.dormsToShow = [];  
    this.dormGroups = [];
    this.selectedDorm = null;
    this.cities = [];
    this.districts = [];
    // now we can refill the arrays by going through all dorms. If the city of that dorm == the selected city, then add the dorm again
    this.collectDormsByCity(event.value);
    this.previousOpenedInfoWindow = null;
  }

  // filter all dorms for the ones that are in one specific city and then sort them into the dormGroups array according to their districts
  collectDormsByCity(city: string) {
    this.dorms.forEach(dorm => {
      if (dorm.city == city) {
        this.dormsToShow.push(dorm);
        this.sortDormIntoDormGroups(dorm);
      }
    });
  }
   
  // this function gets called when the user choses a dorm in the dropdown select menu above the google maps -> event.value is the name of the selected dorm. But we need the dorm itself, not just the name, so we go through all dorms and take the one that has the same name.
  changeSelectedDorm(event) {                      
    this.dorms.forEach(element => {
      if (element.name == event.value) {
        this.selectedDorm = element;
        this._update.changeSelectedDorm(this.selectedDorm);    // we change the dorm in the update service so that the other components can know, which dorm is currently selected
      }
    })
    
  }

  // abgefuckt komplizierter Sortieralgorithmus, nur anschauen wenn man wissen will, wie das array dormGroups befüllt wird!! -> wenn man bei "Wähle dein Wohnheim aus" auf das dropdown select menü geht, sieht man das Ergebnis von dieser Sortierung
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

  // wenn der mat-slider (zoom regelschieber über der wohnheimliste) verschoben wird verändert sich der zoom der google maps:
  onInputChange(event) {
    this.currZoom = event.value;
  }

  markerClicked(dormClicked: Dorm, infoWindow) {
    // tell the info-window component which marker was clicked
    this._update.changeMarkerClicked(dormClicked)
    this._helper.getAllProductsFromSelectedDorm([], dormClicked).then((products => this.dormProducts = products));
   //TODO
    // this._update.changeDormProducts(dormClicked)
   // this._update.changeProductImages(dormClicked)
    // close the previous info Window
    if (this.previousOpenedInfoWindow) {
      this.previousOpenedInfoWindow.close()
    }
    this.previousOpenedInfoWindow = infoWindow;
  }

  mapClicked($event: MouseEvent) {
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true
    });
    console.log("maps clicked at: " + $event.coords.lat + " " + $event.coords.lng)
  }
}
