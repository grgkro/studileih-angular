import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  private userIdSource = new BehaviorSubject(2);
  currentUserId = this.userIdSource.asObservable();

  constructor() { }

  changeUserId(userId: number) {
    this.userIdSource.next(userId);
  }

}
