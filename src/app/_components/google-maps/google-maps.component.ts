import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-google-maps',
  styles: ['agm-map { height: 300px; }'],
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.scss']
})
export class GoogleMapsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
