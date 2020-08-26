import { Component, OnInit } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { UpdateService } from 'src/app/_services/update.service';
import { takeUntil, timestamp } from 'rxjs/operators';
import { User } from 'src/app/_models/user';
import { Chat } from 'src/app/_models/chat';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/data.service';
import { ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Message } from 'src/app/_models/message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @ViewChild(ModalDirective) modal: ModalDirective;
  // Angular takes care of unsubscribing from many observable subscriptions like those returned from the Http service or when using the async pipe. But the routeParam$ and the _update.currentShowUploadComponent needs to be unsubscribed by hand on ngDestroy. Otherwise, we risk a memory leak when the component is destroyed. https://malcoded.com/posts/angular-async-pipe/   https://www.digitalocean.com/community/tutorials/angular-takeuntil-rxjs-unsubscribe
  destroy$: Subject<boolean> = new Subject<boolean>();

  user: User = {};
  otherUser: string;  // the other User from the chat (there are always two users in one chat. One of them must be the logged in user, otherwise he couldn't see this chat. But we also need the other user in the html.
  chats: Chat[] = [];
  messages: Message[] = [];
  chat: Chat;
  chatId: number;


  replyMessage = new FormGroup({
    subject: new FormControl(''),
    text: new FormControl('', Validators.required),
    isEmailChecked: new FormControl(true)
  });


  constructor(private _data: DataService, private _update: UpdateService, private route: ActivatedRoute, private _token: TokenStorageService, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.chatId = parseInt(params.get("id"))
    })
    this.getChatById(this.chatId);
    this.getMessagesByChatId(this.chatId);
    this.user = this._token.getUser();

  }

  ngOnDestroy() {            // Angular takes care of unsubscribing from many observable subscriptions like those returned from the Http service or when using the async pipe. But the routeParam$ and the _update.currentShowUploadComponent needs to be unsubscribed by hand on ngDestroy. Otherwise, we risk a memory leak when the component is destroyed. https://malcoded.com/posts/angular-async-pipe/   https://www.digitalocean.com/community/tutorials/angular-takeuntil-rxjs-unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }

  // getChatById(chatId: number): void {
  //   this._update.currentChats$
  //   .pipe(takeUntil(this.destroy$))
  //   .subscribe(chats => {
  //     this.chat = chats.find(chat => chat.id === chatId)  // we only want the one chat, that the user clicked on.
  //     this.getOtherUserFromChat(this.chat);
  //   });
  // }

// loads all Chats of the logged in user with also the messages of that chat.
getChatById(id: number) {
  this._data.getChatById(id)
    .subscribe(chat => {
      console.log("CHAAAAAAAAAAAAT-DTO", chat)
      if (chat == null) {
        console.log("404 chat not found");
      } else {
        this.chat = chat;
        this.getOtherUserFromChat(this.chat);
      }
    }
    );
}

  // loads all Chats of the logged in user with also the messages of that chat.
  getChats() {
    this._data.getChatsByLoggedInUserPrincipal()
      .subscribe(chats => {
        console.log("CHAAAAAAAAAAAATS", chats)
        if (chats == null || chats.length === 0) {
          console.log("this user has no chats");
        } else {
          this.chats = chats;
          // we store the chats, which also contain the messages of the chats -> so we don't have to reload them in message-details component with security risk  
          this._update.changeChats(chats);
        }
      }
      );
  }

  getMessagesByChatId(chatId: number): void {
    this._data.getMessagesByChatId(chatId).subscribe(
      (messages) => {
        this.messages = messages;
        console.log("MESSAGEEEEEEEEEEES", this.messages)
      },
      (error) => { console.log(error) });
  }



  getOtherUserFromChat(chat: Chat) {
    if (chat.user1 === this.user.name) {
      this.otherUser = chat.user2;
    } else {
      this.otherUser = chat.user1;
    }
  }

  reply() {
    var message: Message = { subject: this.replyMessage.controls['subject'].value, text: this.replyMessage.controls['text'].value, sendetAt: new Date().toISOString(), chatId: this.chat.id}
    // save message to DB
    this._data.sendReply(message)
      .subscribe(reply => {
        console.log(reply)
        this._snackBar.open(reply, "", { duration: 2000 });
        // immediately show new message to user
        this.messages.push(message)
        // delete the user input in the form 
        this.replyMessage.reset();
      }, (err) => {
        console.log(err)
        this._snackBar.open(err.error, "", { duration: 2000 });
      });
    //send message as email
    if (this.replyMessage.controls['isEmailChecked'].value) {
      this._data.sendEmailReply(message)
        .subscribe(reply => {
          console.log(reply)
          this._snackBar.open(reply, "", { duration: 2000 });
        }, (err) => {
          console.log(err)
          this._snackBar.open(err.error, "", { duration: 2000 });
        });
    }
  }

}
