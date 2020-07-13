import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Product } from 'src/app/_models/product';
import { UpdateService } from 'src/app/_services/update.service';
import { User } from 'src/app/_models/user';
import { Message } from 'src/app/_models/message';
import { trigger, style, transition, animate, query, stagger } from '@angular/animations';
import { Chat } from 'src/app/_models/chat';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  animations: [  // ermöglicht das Erstellen von kleinen Animationen
    trigger('listStagger', [  // listStagger ist eine spezielle Animation, bei der die Liste nicht auf einmal dargestellt wird, sondern zeitlich verzögert auftaucht
      transition('* <=> *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(-15px)' }),
            stagger(
              '50ms',
              animate(
                '550ms ease-out',
                style({ opacity: 1, transform: 'translateY(0px)' })
              )
            )
          ],
          { optional: true }
        ),
        query(':leave', animate('50ms', style({ opacity: 0 })), {
          optional: true
        })
      ])
    ])
  ]
})
export class MessagesComponent implements OnInit {

  user: User;   // the logged in user
  message: Message;
  messages: Message[] = [];
  chats: Chat[] = [];
  chat: Chat;

  constructor(private _data: DataService, private _update: UpdateService,) { }

  ngOnInit(): void {
    this.updateUser();   //  if the user changes, this will get updated 
    this.loadAllMessages();
  }

  updateUser(): void {
    this._update.currentUser.subscribe(user => {
      this.user = user;
      this.getChatsByUser(user.id); })
  }

  getChatsByUser(id: number) {
    this._data.getChatsByUser(id).subscribe(chats => {this.chats = chats; console.log(chats);});
  }

  loadAllMessages(): void {
    this._data.loadAllMessages().subscribe(messages => {console.log(messages); this.messages = messages})
  }

  deleteMessage(messageId: number) {
    console.log("Nachricht mit id: " + messageId + " gelöscht... (Just kidding. lol");
  }

}
