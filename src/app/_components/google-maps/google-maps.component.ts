import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-google-maps',
  styles: ['agm-map { height: 300px; }'], //the heigt of a google maps needs to be set, otherwise you won't see it. Default height is 0 px 
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.scss']
})
export class GoogleMapsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
