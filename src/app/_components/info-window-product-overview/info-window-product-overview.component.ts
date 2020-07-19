import { Component, OnInit, Input } from '@angular/core';
import { Dorm } from 'src/app/_models/dorm';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-info-window-product-overview',
  templateUrl: './info-window-product-overview.component.html',
  styleUrls: ['./info-window-product-overview.component.scss']
})
export class InfoWindowProductOverviewComponent implements OnInit {

  @Input() selectedDorm: Dorm;    // we get the message as an input from the chat component html ->  <app-message-details [chatMessage]=message></app-message-details>
  @Input() usersFromSelectedDorm: User[];    // we get the message as an input from the chat component html ->  <app-message-details [chatMessage]=message></app-message-details>
  
  constructor() { }

  ngOnInit(): void {
    console.log(this.selectedDorm)
    this.loadUsersFromDorm(this.selectedDorm);
  }

  loadUsersFromDorm(selectedDorm: Dorm) {
    console.log(this.usersFromSelectedDorm)
  }

}
