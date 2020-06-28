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
  imagesPath = 'http://localhost:8090/images';
  usersPath = 'https://jsonplaceholder.typicode.com/users'

  constructor(private http: HttpClient) { }

  getProducts() {
    return this.http.get(this.productsPath);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get(this.productsPath + '/' + id);
  }

  addProduct(product: Product) {
    return this.http.post(this.usersPath, product)
  }

  deleteProduct(id: number) {
    return this.http.delete(this.productsPath + '/' + id)
  }

  updateProduct(product: Product) {
    return this.http.put(this.productsPath + '/' + product.id, product)
  }

  // loadProductPics() {
  //   return this.http.get(this.imagesPath + '/productPics');
  // }

  loadProductPics(): Observable<Blob> {
    return this.http.get(this.imagesPath + '/productPics', { responseType: 'blob' });
  }



  getUsers(): Observable<User> {
    return this.http.get(this.usersPath)
  }

  getUser(userId): Observable<User> {
    return this.http.get('https://jsonplaceholder.typicode.com/users/' + userId)
  }

  addUser(user: User){
    return this.http.post(this.usersPath,user)
  }

  deleteUser(id: number) {
    this.http.delete(this.usersPath + '/' + id)
  }

  updateUser(user: User) {
    this.http.put(this.usersPath + '/' + user.id, user)
  }

  getPosts() {
    return this.http.get('https://jsonplaceholder.typicode.com/posts')
  }


}
