import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { UpdateService } from 'src/app/_services/update.service';
import { takeUntil, timestamp } from 'rxjs/operators';
import { User } from 'src/app/_models/user';
import { Chat } from 'src/app/_models/chat';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
 // Angular takes care of unsubscribing from many observable subscriptions like those returned from the Http service or when using the async pipe. But the routeParam$ and the _update.currentShowUploadComponent needs to be unsubscribed by hand on ngDestroy. Otherwise, we risk a memory leak when the component is destroyed. https://malcoded.com/posts/angular-async-pipe/   https://www.digitalocean.com/community/tutorials/angular-takeuntil-rxjs-unsubscribe
 destroy$: Subject<boolean> = new Subject<boolean>();

 user: User = {};
 otherUser: User = {};  // the other User from the chat (there are always two users in one chat. One of them must be the logged in user, otherwise he couldn't see this chat. But we also need the other user in the html.
 chats: Chat[] = [];
 chat: Chat;
 chatId: number;
 

 replyMessage = new FormGroup({
  subject: new FormControl(''),
  text: new FormControl('', Validators.required),
  isEmailChecked: new FormControl(true)
});
  

  constructor(private _data: DataService, private _update: UpdateService, private route: ActivatedRoute,) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.chatId = parseInt(params.get("id"))
    })
    this.getChatById(this.chatId);
    this.updateUser();
  }

  ngOnChanges() {
    // this.feed = this.chat.getMessages();
  }

  ngOnDestroy() {            // Angular takes care of unsubscribing from many observable subscriptions like those returned from the Http service or when using the async pipe. But the routeParam$ and the _update.currentShowUploadComponent needs to be unsubscribed by hand on ngDestroy. Otherwise, we risk a memory leak when the component is destroyed. https://malcoded.com/posts/angular-async-pipe/   https://www.digitalocean.com/community/tutorials/angular-takeuntil-rxjs-unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }

  getChatById(chatId: number): void {
    this._update.currentChats$
    .pipe(takeUntil(this.destroy$))
    .subscribe(chats => {
      this.chat = chats.find(chat => chat.id === chatId)  // we only want the one chat, that the user clicked on.
      this.getOtherUserFromChat(this.chat);
    });
  }

  updateUser(): void {
    this._update.currentUser
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.user = user;
      });
}

getOtherUserFromChat(chat: Chat) {
  if(chat.user1.id === this.user.id) {
    this.otherUser = chat.user2;
  } else {
    this.otherUser = chat.user1;
  }
}

  reply() {
    console.log(this.replyMessage.controls['subject'].value)
    console.log(this.replyMessage.controls['text'].value)
    console.log(this.replyMessage.controls['isEmailChecked'].value)
    if (this.replyMessage.controls['isEmailChecked'].value) {
      this._data.sendEmailReply(this.replyMessage.controls['subject'].value, this.replyMessage.controls['text'].value, new Date().toISOString(), this.chatId, this.user.id).subscribe(reply => console.log(reply));
    }
    this._data.sendReply( this.replyMessage.controls['subject'].value, this.replyMessage.controls['text'].value, new Date().toISOString(), this.chatId, this.user.id).subscribe(reply => console.log(reply)); 
  }

}
