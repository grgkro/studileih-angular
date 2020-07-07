import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataService } from '../../data.service';
import { Dorm } from 'src/app/_models/dorm';

interface DormGroup {
  disabled?: boolean;
  name?: string;
  dorm?: Dorm[];
}


@Component({
  selector: 'app-google-maps',
  styles: ['agm-map { height: 300px; }'], //the heigt of a google maps needs to be set, otherwise you won't see it. Default height is 0 px 
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.scss']
})
export class GoogleMapsComponent implements OnInit {

  currZoom: number = 13;
  isSnazzyInfoWindowOpened: boolean = true;
  clickedMarker: string;  // auf welchen Marker wurde geklickt?

  dormControl = new FormControl();
  cityControl = new FormControl();
  dormGroups: DormGroup[] = [];  // die Liste kommt vom Backend und wird im onInit befüllt
  cities: string[] = [];        // die Liste hilft zu merken, welche Städte schon in dormGroups auftauchen, erspart mehrere for each schleifen
  districts: string[] = [];     // die Liste hilft zu merken, welche Stadtviertel schon in dormGroups auftauchen, erspart mehrere for each schleifen
  // selectedDorm = "Max-Kade";            // will contain the dorm /wohnheim that was selected by the user from the dropdown menu
  dorms: Array<Dorm> = [];    // liste aller Wohnheime 
  dormToShow: Dorm = { id: 0, name: "Max-Kade", lat: 48.780427, lng: 9.169875, city: "Stuttgart" }; // irgendwie müssen werte in JS immer am Anfang schon initialisiert werde, das regt richtig auf, wir überschreiben das im onInit sowieso gleich wieder, gibt's da ne andere Möglichkeit?

  constructor(private _data: DataService) { }

  ngOnInit(): void {
    this._data.getDormLocations().subscribe(dorms => {
      for (let dorm of dorms) {
        this.dorms.push(dorm);    // fügt alle dorms einem Array hinzu (brauchen wir später)
        if (dorm.name == "Max-Kade") {   
          this.dormToShow = dorm;   // am Anfang wird als default Wohnheim das Max-Kade in Stuggi Mitte gezeigt (bekanntestes Wohnheim in Stg) - alle Wohnheime am Anfang zu zeigen braucht ewig lang zum Laden
        }
        this.sortDormIntoDormGroups(dorm);   // fügt jedes Dorm der richtigen Gruppe hinzu (z.B. Stuttgart Mitte, München Nord) -> die Gruppen sind wichtig für das DropDown Select Menü
      }
    })
  }

  // this function gets called when the user choses a dorm in the dropdown select menu above the google maps -> event.value is the name of the selected dorm. But we need the dorm itself, not just the name, so we go through all dorms and take the one that has the same name.
  changeDormToShow(event) {                      
    this.dorms.forEach(element => {
      if (element.name == event.value) {
        this.dormToShow = element;
      }
    });
  }

  // abgefuckt komplizierter Sortieralgorithmus, nur anschauen wenn man wissen will, wie das array dormGroups befüllt wird!! -> wenn man bei "Wähle dein Wohnheim aus" auf das dropdown select menü geht, sieht man das Ergebnis von dieser Sortierung
  sortDormIntoDormGroups(dorm) {
    if (!this.cities.includes(dorm.city) && dorm.district == null) {   // zB das wohnheim Göppingen hat nur eine Stadt (Göppingen) aber keinen District (in Göppingen gibt's nur 1 Wohnheim, Göppingen ist auch ziemlich klein, "Göppingen Mitte" oder so macht hier keinen Sinn)
      this.cities.push(dorm.city)
      this.dormGroups.push({ name: dorm.city, dorm: [dorm] })            // erstellt eine neue dormGroup mit dem dorm und added sie direkt zu den dormGroups. der name der neuen dormGroup wird gleich der Stadt gesetzt (wenn kein district angegeben ist, gitb es je Stadt nur eine dormGroup)
    } else if (this.cities.includes(dorm.city) && dorm.district == null) {    // zb stadt Ludwigsburg hat mehrere Wohnheime, aber keine districte (Ludwigsburg ist auch relativ klein) -> damit nicht bei jedem Wohnheim eine neue DormGroup erstellt wird, wird eine cities Liste geführt. Ist schon ein Wohnheim für eine city (zb Ludwigsburg) in der Liste cities, dann gibt es auch schon eine dormGroup dafür in der Liste dormGroups. Wir müssen also diese dormGroup aus dormGroups holen und das neue Wohnheim hinzufügen
      this.addDormToExistingDormGroup(dorm, dorm.city);
    } else if (!this.districts.includes(dorm.district)) {               // erstellt für jedes Wohnheim, das einen district angegeben hat und bei dem der district noch nicht in der dormGroups oder in der Liste districts auftaucht, eine neue dormGroup
      this.districts.push(dorm.district)
      this.dormGroups.push({ name: dorm.district, dorm: [dorm] })                               // der name der dormGroup wird gleich dem Stadtviertel! gesetzt (nicht gleich der Stadt), denn wenn das dorm einen District angegeben hat, bedeutet das, dass es mehrere dormGroups für eine Stadt gibt (je Stadtviertel eine dormGroup und nicht je Stadt eine dormGroup)
    } else if (this.districts.includes(dorm.district)) {                                    // added das Wohnheim, das einen district angegeben hat und bei dem der district bereits eine dormGroup in der dormGroups hat      
      this.addDormToExistingDormGroup(dorm, dorm.district);
    }
  }

  // geh durch alle dormGroups und hol die dormGroup, die zu der Stadt oder zu dem Stadtviertel gehört, das im compareString mitgegeben wurde dann adde das Wohnheim zu der dromGroup
  addDormToExistingDormGroup(dorm: Dorm, compareString: string) {
    for (var i = 0; i < this.dormGroups.length; i++) {
      if (this.dormGroups[i].name == compareString) {
        this.dormGroups[i].dorm.push(dorm)  // 
      }
    }
  }

  // wenn der mat-slider (zoom regelschieber über der wohnheimliste) verschoben wird verändert sich der zoom der google maps:
  onInputChange(event) {
    this.currZoom = event.value;
  }

  markerClicked(marker: Dorm) {
    this.isSnazzyInfoWindowOpened = true;
    this.clickedMarker = marker.name;
    this.toggleSnazzyInfoWindow()
  }

  toggleSnazzyInfoWindow() {
    this.isSnazzyInfoWindowOpened = !this.isSnazzyInfoWindowOpened;
  }
}
