import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Product } from 'src/app/_models/product';
import { UpdateService } from 'src/app/_services/update.service';
import { User } from 'src/app/_models/user';
import { Message } from 'src/app/_models/message';
import { trigger, style, transition, animate, query, stagger } from '@angular/animations';
import { Chat } from 'src/app/_models/chat';
import { Subject, Observable } from 'rxjs';

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
  noChatsYet: string = "Du hast noch keine Nachrichten. Stell eine Ausleihanfrage an einen anderen User, um hier deine Anfragen und Nachrichten zu sehen."
  userHasChats: Promise<boolean>;  // this boolean gets to set to true when all chats are loaded
  userHasNoChats: Promise<boolean>;  // this boolean gets to set to true if the backend returns null 

  // Angular takes care of unsubscribing from many observable subscriptions like those returned from the Http service or when using the async pipe. But the routeParam$ and the _update.currentShowUploadComponent needs to be unsubscribed by hand on ngDestroy. Otherwise, we risk a memory leak when the component is destroyed. https://malcoded.com/posts/angular-async-pipe/   https://www.digitalocean.com/community/tutorials/angular-takeuntil-rxjs-unsubscribe
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private _data: DataService, private _update: UpdateService,) { }

  ngOnInit(): void {
    this.getUserChats();   //  first loads the user and then loads his chats. if the user changes, this will get updated 
  }

  
  ngOnDestroy() {            // Angular takes care of unsubscribing from many observable subscriptions like those returned from the Http service or when using the async pipe. But the routeParam$, _update.currentUser and the _update.currentShowUploadComponent Observables needs to be unsubscribed by hand on ngDestroy. Otherwise, we risk a memory leak when the component is destroyed. https://malcoded.com/posts/angular-async-pipe/   https://www.digitalocean.com/community/tutorials/angular-takeuntil-rxjs-unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }

  getUserChats(): void {
    this._update.currentUser
    .pipe(takeUntil(this.destroy$))
    .subscribe(user => {
      this.user = user;
      this.getChatsByUser(user.id); })
  }

  // loads all Chats of one user with also the messages of that chat.
  getChatsByUser(id: number) {
    this._data.getChatsByUser(id)
    .subscribe(chats => {
      if (chats == null || chats.length === 0) {
        this.userHasNoChats = Promise.resolve(true);
      } else {
        this.chats = chats;
        this.userHasChats = Promise.resolve(true);  
        this._update.changeChats(chats);
      }

      }

      );
  }

  deleteChat(messageId: number) {
    console.log("Nachricht mit id: " + messageId + " gelöscht... (Just kidding. lol");
  }

}





// loadAllMessages(): void {
  //   this._data.loadAllMessages().subscribe(messages => {console.log(messages); this.messages = messages})
  // }