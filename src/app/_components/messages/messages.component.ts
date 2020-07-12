import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Product } from 'src/app/_models/product';
import { UpdateService } from 'src/app/_services/update.service';
import { User } from 'src/app/_models/user';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  user: User;   // the logged in user
  message: Message;
  messages: Message[] = [];


  constructor(private _data: DataService, private _update: UpdateService,) { }

  ngOnInit(): void {
    this.updateUser();   //  if the user changes, this will get updated 
    this.loadAllMessages();
  }

  updateUser(): void {
    this._update.currentUser.subscribe(user => this.user = user)
  }

  loadAllMessages(): Message[] {
    this._data.loadAllMessages().subscribe(messages => {console.log(messages); this.messages = messages})
  }

}
