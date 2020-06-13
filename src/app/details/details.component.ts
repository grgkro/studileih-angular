import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { switchMap } from 'rxjs/operators';

import { DataService } from '../data.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  user: any;

  constructor(private route: ActivatedRoute, private data: DataService) { }

  ngOnInit() {
    this.route.params.pipe(switchMap(params => this.data.getUser(params['id'])))
      .subscribe(
        data => {
          this.user = data;
          console.log(this.user);
        }
      );
  }
}