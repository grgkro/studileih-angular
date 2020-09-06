import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'], 
  encapsulation: ViewEncapsulation.None // needed for customizing the tooltip with css (without this line, the class .custom-tooltip would be ignored)
})
export class SidebarComponent implements OnInit {

  constructor() { 
  }

  ngOnInit() {}

  myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  }
}
