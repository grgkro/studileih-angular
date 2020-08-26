import { Component, OnInit } from '@angular/core';
//import { MapsService } from './maps.service';
import { ApplicationStateService } from '../app/_services/application-state-service.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'studileih';
  isMobileResolution: boolean;

  constructor(private _state: ApplicationStateService) {}

  ngOnInit() {
    this.isMobileResolution = this._state.getIsMobileResolution();
  }
}
