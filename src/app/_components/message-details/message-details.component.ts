import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from 'src/app/_models/user';
import { Chat } from 'src/app/_models/chat';
import { UpdateService } from 'src/app/_services/update.service';
import { takeUntil } from 'rxjs/operators';
import { Message } from 'src/app/_models/message';
import { DataService } from 'src/app/data.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

@Component({
  selector: 'app-message-details',
  templateUrl: './message-details.component.html',
  styleUrls: ['./message-details.component.scss']
})
export class MessageDetailsComponent implements OnInit {

  @Input() chatMessage: Message;    // we get the message as an input from the chat component html ->  <app-message-details [chatMessage]=message></app-message-details>
  @Input() chatId: number;    // we get the chatId as an input from the chat component html ->  <app-message-details [chatId]=chatId></app-message-details>

  destroy$: Subject<boolean> = new Subject<boolean>();

  user: User;
  chat: Chat;
  chats: Chat[] = [];

  userEmail: string;
  userName: string;
  messageContent: string;
  sendetAt: Date = new Date();
  receivedAt: Date = new Date();
  isOwnMessage: boolean = true;
  ownEmail: string;




  constructor(private _data: DataService, private _update: UpdateService, private _token: TokenStorageService) { }

  ngOnInit(chatMessage = this.chatMessage, chatId = this.chatId) {
    this.user = this._token.getUser();
    this.isOwnMessage = this.user.name === chatMessage.sender;
    this.sendetAt = new Date(chatMessage.sendetAt);
    this.messageContent = chatMessage.text;
    this.userName = chatMessage.sender;
    // this.userEmail = chatMessage.sender.email; we don't want to show the email address anymore -> security risk to even load it.
    // if the user is the receiver (not the sender) of the message and he did't open this message before, we will now add the receivedAt timestamp to it.

    if (chatMessage.receiver == this.user.name && chatMessage.receivedAt == null) {
      this.receivedAt = new Date();
      this._data.updateMessage(chatId, chatMessage.id, this.receivedAt.toISOString()).subscribe(response => console.log(response));
    } else {
      this.receivedAt = new Date(chatMessage.receivedAt);
    }
  }

  ngOnChanges() {
    // this.feed = this.chat.getMessages();
  }

  ngOnDestroy() {            // Angular takes care of unsubscribing from many observable subscriptions like those returned from the Http service or when using the async pipe. But the routeParam$ and the _update.currentShowUploadComponent needs to be unsubscribed by hand on ngDestroy. Otherwise, we risk a memory leak when the component is destroyed. https://malcoded.com/posts/angular-async-pipe/   https://www.digitalocean.com/community/tutorials/angular-takeuntil-rxjs-unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }

}
