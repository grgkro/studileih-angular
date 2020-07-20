import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../_models/user';
import { Product } from '../_models/product';
import { Dorm } from '../_models/dorm';
import { DataService } from '../data.service';
import { UpdateService } from './update.service';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  users: User[] = [];  // stores all users
  products: Product[] = [];  // stores all products


  constructor(private _data: DataService, private _update: UpdateService) { }

  ngOnInit() {
    this._data.getUsers().subscribe((users => this.users = users))
  }

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

  // when the user selects one dorm, we only want to show him the products from that dorm.
  async getAllProductsFromSelectedDorm(products: Product[], selectedDorm: Dorm): Promise<Product[]> {
    // if the users were not previously loaded, we have to load them now.
    if (this.users.length === 0) {
      // we load the users from the backend and AWAIT until they are loaded. Because to contnue, we need the users list.
      this.users = await this._data.getUsers().toPromise();
      // now that we loaded them, we update the users list in all other components too, so that we dont need to load them again and again.
      this._update.changeUsers(this.users);
    }
    if (products == null || products.length === 0) {
      // we load the products from the backend and AWAIT until they are loaded. Because to contnue, we need the users list.
      this.products = await this._data.getProducts().toPromise();
    }
    // Then we filter the users list for the ones that actually live in that dorm.
    let usersFromSelectedDorm = this.users.filter(user => user.dormId === selectedDorm.id)
    // and then we filter all products for the ones that are owned by one of the users from that dorm (product.userId = user.id)
     return this.filterProductsByUsers(this.products, usersFromSelectedDorm);
  }

   // filter all products for the products of the users that live in that dorm
   filterProductsByUsers(products: Product[], users: User[]): Product[] {
    let dormProducts: Product[] = [];
    products.forEach(product => {
      users.forEach(user => {
        if (product.userId == user.id) {
          dormProducts.push(product)
        }
      });
    });
    return dormProducts;
  }

}
