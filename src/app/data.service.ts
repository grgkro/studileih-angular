import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './_models/user';
import { Product } from './_models/product';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  serverPath = 'http://localhost:8090';
  productsPath = 'http://localhost:8090/products';
  usersPath = 'https://jsonplaceholder.typicode.com/users'

  constructor(private http: HttpClient) { }

  login(loginPayload) : Observable<User> {
    return this.http.post<User>(this.serverPath + '/token/generate-token', loginPayload);
  }

  getProducts() : Observable<Product> {
    return this.http.get<Product>(this.productsPath);
  }

  getProduct(id: number) : Observable<Product>  {
    return this.http.get<Product>(this.productsPath + '/' + id);
  }

  addProduct(product: Product)  : Observable<Product> {
    return this.http.post<Product>(this.usersPath, product)
  }

  deleteProduct(id: number) {
    return this.http.delete(this.productsPath + '/' + id)
  }

  updateProduct(product: Product) : Observable<Product>  {
    return this.http.put<Product>(this.productsPath + '/' + product.id, product)
  }



  getUsers(): Observable<User> {
    return this.http.get<User>(this.usersPath)
  }

  getUser(userId): Observable<User> {
    return this.http.get<User>('https://jsonplaceholder.typicode.com/users/' + userId)
  }

  addUser(user: User): Observable<User>{
    return this.http.post<User>(this.usersPath,user)
  }

  deleteUser(id: number): Observable<User> {
    return this.http.delete<User>(this.usersPath + '/' + id)
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(this.usersPath + '/' + user.id, user)
  }

  getPosts() {
    return this.http.get('https://jsonplaceholder.typicode.com/posts')
  }


}
