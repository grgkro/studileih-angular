import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
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
  clickedMarker: string;

  dormControl = new FormControl();
  dormGroups: DormGroup[] = [   // https://www.studierendenwerk-stuttgart.de/wohnen/wohnanlagen/ 
    // {
    //   name: 'Stuttgart-Mitte', 
    //   dorm: [
    //     {value: 'Alexanderstraße', viewValue: 'Alexanderstraße'},
    //     {value: 'Anna-Herrigel-Haus', viewValue: 'Anna-Herrigel-Haus'},
    //     {value: 'Birkenwaldstraße', viewValue: 'Birkenwaldstraße'},
    //     {value: 'Bordinghaus', viewValue: 'Bordinghaus Stuttgart'},
    //     {value: 'Brückenstraße', viewValue: 'Brückenstraße'},
    //     {value: 'Heilmannstraße-1', viewValue: 'Heilmannstraße 3-7'},
    //     {value: 'Heilmannstraße-2', viewValue: 'Heilmannstraße 4A-4B'},
    //     {value: 'InDerAu', viewValue: 'In der Au'},
    //     {value: 'Johannesstraße', viewValue: 'Johannesstraße'},
    //     {value: 'Kernerstraße', viewValue: 'Kernerstraße'},
    //     {value: 'Landhausstraße', viewValue: 'Landhausstraße'},
    //     {value: 'Max-Kade', viewValue: 'Max-Kade-Straße'},
    //     {value: 'Neckarstraße', viewValue: 'Neckarstraße'},
    //     {value: 'Rieckestraße', viewValue: 'Rieckestraße'},
    //     {value: 'Rosensteinstraße', viewValue: 'Rosensteinstraße'},
    //     {value: 'Theodor-Heuss', viewValue: 'Theodor-Heuss-Heim'},
    //     {value: 'Wiederholdstraße', viewValue: 'Wiederholdstraße'},
    //     {value: 'Wohnareal-Stuttgart-Rot', viewValue: 'Wohnareal-Stuttgart-Rot'}
    //   ]
    // },
    // {
    //   name: 'Stuttgart Vaihingen',
    //   dorm: [
    //     {value: 'squirtle-3', viewValue: 'Allmandring'},
    //     {value: 'squirtle-3', viewValue: 'Allmandring II'},
    //     {value: 'squirtle-3', viewValue: 'Allmandring III'},
    //     {value: 'squirtle-3', viewValue: 'Allmandring IV'},
    //     {value: 'squirtle-3', viewValue: 'Bauhäusle'},
    //     {value: 'squirtle-3', viewValue: 'Filderbahnplatz'},
    //     {value: 'squirtle-3', viewValue: 'Straußäcker II'},
    //     {value: 'squirtle-3', viewValue: 'Straußäcker III'}
    //   ]
    // },
    // {
    //   name: 'Esslingen',
    //   dorm: [
    //     {value: 'charmander-6', viewValue: 'Boardinghaus'},
    //     {value: 'charmander-6', viewValue: 'Fabrikstraße'},
    //     {value: 'charmander-6', viewValue: 'Geschwister-Scholl-Straße'},
    //     {value: 'charmander-6', viewValue: 'Goerdelerweg'},
    //     {value: 'charmander-6', viewValue: 'Rossneckar I'},
    //     {value: 'charmander-6', viewValue: 'Rossneckar II'},
       
    //   ]
    // },
    // {
    //   name: 'Göppingen',
    //   dorm: [
    //     {value: 'mew-9', viewValue: 'Studentendorf Göttingen'}
    //   ]
    // },
    // {
    //   name: 'Ludi',
    //   dorm: [
    //     {value: 'mew-9', viewValue: 'OFD Wohnturm'},
    //     {value: 'mew-9', viewValue: 'Studentendorf Ludwigsburg'},
    //     {value: 'mew-9', viewValue: 'Wohnhaus der Finanzen'}
    //   ]
    // }
  ];

  markers: Array<Dorm> = [];

  constructor(private _data: DataService) { }

  ngOnInit(): void {
    this._data.getDormLocations().subscribe(dorms => {
      let mitte: DormGroup = {
        name: "Stuttgart-Mitte",
        dorm: []
      };
      let vaihingen: DormGroup = {
        name: "Stuttgart-Vaihingen",
        dorm: []
      };
      // console.log(dorms)
      for(let dorm of dorms){
          this.markers.push(dorm )
          if (dorm.district == "StuttgartMitte") {
            mitte.dorm.push(dorm);
          } else if (dorm.district == "StuttgartVaihingen") {
            vaihingen.dorm.push(dorm);
          }
      }
      this.dormGroups.push(mitte)
      this.dormGroups.push(vaihingen)
  })
  }


  onInputChange(event) {
    console.log("This is emitted as the thumb slides");
    console.log(event.value);
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
