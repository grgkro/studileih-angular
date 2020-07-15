import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { trigger,style,transition,animate,query,stagger } from '@angular/animations';
import { User } from '../_models/user';
import { Observable, asyncScheduler } from 'rxjs';
import { UpdateService } from '../_services/update.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
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

export class UsersComponent implements OnInit {

  users$: Observable<User[]>;
  users: User[];

  constructor(private _data: DataService, private _update: UpdateService) { }

  ngOnInit(): void {
    this.users$ = this._data.getUsers()   // we dont need to subscribe here, we only get the result of the Observable users$ in the HTML
    // const task = () => this._update.currentUsers$;
    // asyncScheduler.schedule(task, 1000);
    // this.users$ = this._update.currentUsers$
  }

}
