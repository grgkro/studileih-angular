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

  currZoom: number = 10;
  isSnazzyInfoWindowOpened: boolean = true;
  clickedMarker: string;  // auf welchen Marker wurde geklickt?

  dormControl = new FormControl();
  dormGroups: DormGroup[] = [];  // die Liste kommt vom Backend und wird im onInit befüllt
  cities: string[] = [];        // die Liste hilft zu merken, welche Städte schon in dormGroups auftauchen, erspart mehrere for each schleifen
  districts: string[] = [];     // die Liste hilft zu merken, welche Stadtviertel schon in dormGroups auftauchen, erspart mehrere for each schleifen
  markers: Array<Dorm> = [];    // liste aller marker/Wohnheime auf der google maps

  constructor(private _data: DataService) { }

  ngOnInit(): void {
    this._data.getDormLocations().subscribe(dorms => {
      for (let dorm of dorms) this.markers.push(dorm);    // fügt das Dorm auf der Karte hinzu
      this.sortDormsIntoDormGroups(dorms);    // abgefuckt komplizierter Sortieralgorithmus, nur anschauen wenn man wissen will, wie dormGroups befüllt wird!!
    })
  }

  sortDormsIntoDormGroups(dorms) {
    for (let dorm of dorms) {
      if (!this.cities.includes(dorm.city) && dorm.district == null) {   // zB das wohnheim Göppingen hat nur eine Stadt (Göppingen) aber keinen District (in Göppingen gibt's nur 1 Wohnheim, Göppingen ist auch ziemlich klein, "Göppingen Mitte" oder so macht hier keinen Sinn)
        this.cities.push(dorm.city)
        this.dormGroups.push({name: dorm.city, dorm: [dorm]})            // erstellt eine neue dormGroup mit dem dorm und added sie direkt zu den dormGroups. der name der neuen dormGroup wird gleich der Stadt gesetzt (wenn kein district angegeben ist, gitb es je Stadt nur eine dormGroup)
      } else if (this.cities.includes(dorm.city) && dorm.district == null) {    // zb stadt Ludwigsburg hat mehrere Wohnheime, aber keine districte (Ludwigsburg ist auch relativ klein) -> damit nicht bei jedem Wohnheim eine neue DormGroup erstellt wird, wird eine cities Liste geführt. Ist schon ein Wohnheim für eine city (zb Ludwigsburg) in der Liste cities, dann gibt es auch schon eine dormGroup dafür in der Liste dormGroups. Wir müssen also diese dormGroup aus dormGroups holen und das neue Wohnheim hinzufügen
        this.addDormToExistingDormGroup(dorm, dorm.city);
      } else if (!this.districts.includes(dorm.district)) {               // erstellt für jedes Wohnheim, das einen district angegeben hat und bei dem der district noch nicht in der dormGroups oder in der Liste districts auftaucht, eine neue dormGroup
        this.districts.push(dorm.district)
        this.dormGroups.push({name: dorm.district, dorm: [dorm]})                               // der name der dormGroup wird gleich dem Stadtviertel! gesetzt (nicht gleich der Stadt), denn wenn das dorm einen District angegeben hat, bedeutet das, dass es mehrere dormGroups für eine Stadt gibt (je Stadtviertel eine dormGroup und nicht je Stadt eine dormGroup)
      } else if (this.districts.includes(dorm.district)) {                                    // added das Wohnheim, das einen district angegeben hat und bei dem der district bereits eine dormGroup in der dormGroups hat      
        this.addDormToExistingDormGroup(dorm, dorm.district);
      }
    }
  }

  addDormToExistingDormGroup(dorm: Dorm, compareString:string) {
    for (var i = 0; i < this.dormGroups.length; i++) {              // geh durch alle dormGroups und hol die dormGroup, die zu der Stadt gehört, dann adde das Wohnheim zu der dromGroup
      if (this.dormGroups[i].name == compareString) {
        this.dormGroups[i].dorm.push(dorm)  // 
      }
    }
  }



checkName(name: string, dormDistrict: string) {
  return name === dormDistrict;
}

// wenn der mat-slider (zoom regelschieber über der wohnheimliste) verschoben wird verändert sich der zoom der google maps:
onInputChange(event) {
  this.currZoom = event.value;
}

markerClicked(marker: Dorm) {
  console.log(marker)
  this.isSnazzyInfoWindowOpened = true;
  this.clickedMarker = marker.name;
  this.toggleSnazzyInfoWindow()
}

toggleSnazzyInfoWindow() {
  this.isSnazzyInfoWindowOpened = !this.isSnazzyInfoWindowOpened;
}
}
