import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  response: string = '';

  constructor(private _data: DataService) { }

  ngOnInit(): void {
    this._data.getAdmin().subscribe(response => {
      console.log(response)
      this.response = response.data
    })
  }

}
