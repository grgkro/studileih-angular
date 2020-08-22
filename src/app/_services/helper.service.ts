import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class HelperService {
 
  constructor() { }

  ngOnInit() {}

 // takes the error and then returns an error to the user or only logs the error on the console (depending on if the error is useful for the user)
  createErrorMessage(err: HttpErrorResponse, userMessage: string): string {
    if (err.error instanceof Error) {
      console.log('An client-side or network error occurred:', err.error);
    } else if (err.status == 500 || err.status == 404 || err.status == 400) {
      return userMessage;
    } else {
      //Backend returns unsuccessful response codes such as 400, 500 etc.
      console.log('Backend returned status code: ', err.status);
      console.log('Response body:', err.error);
    }
  }

}
