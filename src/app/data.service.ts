import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { User } from './_models/user';
import { Product } from './_models/product';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  serverPath = 'http://localhost:8090';
  productsPath = 'http://localhost:8090/products';
  imagesPath = 'http://localhost:8090/images';
  usersPath = 'https://jsonplaceholder.typicode.com/users'

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private http: HttpClient) { }

  login(loginPayload): Observable<User> {
    return this.http.post<User>(this.serverPath + '/token/generate-token', loginPayload);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsPath);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(this.productsPath + '/' + id).pipe(
      catchError(this.errorHandler)
    );
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.productsPath,
       this.httpOptions).pipe(
        catchError(this.errorHandler)
      )
  }

  deleteProduct(id: number): Observable<Product> {
    return this.http.delete<Product>(this.productsPath + '/' + id, this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(this.productsPath + '/' + product.id,
      JSON.stringify(product), this.httpOptions)
      .pipe(catchError(this.errorHandler)
      )
  }

  loadProductPicByFilename(filename: string, productId: number): Observable<Blob> {
    const formdata: FormData = new FormData();
    formdata.append('filename', filename);
    formdata.append('productId', productId.toString());
    return this.http.post(this.imagesPath + '/loadProductPicByFilename', formdata, { responseType: 'blob' });
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.serverPath + "/users").pipe(
      catchError(this.errorHandler)
    )
  }

  getUser(userId): Observable<User> {
    return this.http.get<User>('https://jsonplaceholder.typicode.com/users/' + userId).pipe(
      catchError(this.errorHandler)
    )
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.usersPath, user).pipe(
      catchError(this.errorHandler)
    )
  }

  deleteUser(id: number): Observable<User> {
    return this.http.delete<User>(this.usersPath + '/' + id).pipe(
      catchError(this.errorHandler)
    )
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(this.usersPath + '/' + user.id, user).pipe(
      catchError(this.errorHandler)
    )
  }

  getPosts() {
    return this.http.get('https://jsonplaceholder.typicode.com/posts').pipe(
      catchError(this.errorHandler)
    )
  }

  errorHandler(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }


}
