import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { User } from './_models/user';
import { Product } from './_models/product';
import { ResponseEntity } from './_models/responseEntity';

import { catchError } from 'rxjs/operators';
import { Dorm } from './_models/dorm';
import { Message } from './_models/message';
import { Chat } from './_models/chat';

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

  getDormLocations(): Observable<Dorm[]> {
    return this.http.get<Dorm[]>(this.serverPath +'/dorms');
  }


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

  deleteProduct(id: number): Observable<any> {
    const formdata: FormData = new FormData();
    formdata.append('id', id.toString());
    return this.http.post(this.productsPath + '/delete/' + id, formdata, { responseType: 'text' });
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

  archivePicByFilename(filename: string, imgType: string, productId: number): Observable<any> {
    const formdata: FormData = new FormData();
    formdata.append('filename', filename);
    formdata.append('imgType', imgType);
    formdata.append('productId', productId.toString());
    return this.http.post(this.imagesPath + '/archivePicByFilename', formdata, { responseType: 'text' });
  }

  deleteArchive(archiveType: string, id: number): Observable<string> {
    const formdata: FormData = new FormData();
    formdata.append('archiveType', archiveType);
    formdata.append('id', id.toString());
    return this.http.post(this.imagesPath + '/deleteArchive', formdata, { responseType: 'text' });
  }

  deleteImageFolder(folderType: string, id: number): Observable<string> {
    const formdata: FormData = new FormData();
    formdata.append('folderType', folderType);
    formdata.append('id', id.toString());
    return this.http.post(this.imagesPath + '/deleteImageFolder', formdata, { responseType: 'text' });
  }

  restorePicByFilename(filename: string, imgType: string, productId: number) {
    const formdata: FormData = new FormData();
    formdata.append('filename', filename);
    formdata.append('imgType', imgType);
    formdata.append('productId', productId.toString());
    console.log("_data restore " + filename)
    return this.http.post(this.imagesPath + '/restorePicByFilename', formdata, { responseType: 'text' });
  }

  deleteProductPicByFilename(filename: string, productId: number) {
    const formdata: FormData = new FormData();
    formdata.append('filename', filename);
    formdata.append('productId', productId.toString());
    return this.http.post(this.imagesPath + '/deleteProductPicByFilename', formdata, {responseType: 'text' });
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

  sendEmailToOwner(startDate: Date, endDate: Date, productId: number, userId: number, ownerId: number) {
    const formdata: FormData = new FormData();
    formdata.append('startDate', startDate.toISOString());
    formdata.append('endDate', endDate.toISOString());
    formdata.append('productId', productId.toString());
    formdata.append('userId', userId.toString());
    formdata.append('ownerId', ownerId.toString());
    return this.http.post(this.serverPath + '/emails/sendEmail', formdata, {responseType: 'text' });
  }

  sendMessageToOwner(startDate: Date, endDate: Date, productId: number, userId: number, ownerId: number) {
    const formdata: FormData = new FormData();
    formdata.append('startDate', startDate.toISOString());
    formdata.append('endDate', endDate.toISOString());
    formdata.append('productId', productId.toString());
    formdata.append('userId', userId.toString());
    formdata.append('ownerId', ownerId.toString());
    return this.http.post(this.serverPath + '/messages/sendMessage', formdata, {responseType: 'text' });
  }

  // when a message was received, we have to update the receivedAt timestamp of that message
  updateMessage(chatId: number, messageId: number, receivedAt: string) {
    const formdata: FormData = new FormData();
    formdata.append('chatId', chatId.toString());
    formdata.append('messageId', messageId.toString());
    formdata.append('receivedAt', receivedAt);
    return this.http.post(this.serverPath + '/messages/updateMessage', formdata, {responseType: 'text' });
  }

  // works, but is not needed anymore
  // loadAllMessages(): Observable<Message[]> {
  //   return this.http.get<Message[]>(this.serverPath + '/messages/messages').pipe(
  //     catchError(this.errorHandler)
  //   )
  // }

  loadAllChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(this.serverPath + '/chats/chats').pipe(
      catchError(this.errorHandler)
    )
  }

  getChatsByUser(chatId: number): Observable<Chat[]> {
    return this.http.get<Chat[]>(this.serverPath + "/chats/chatsByUser/" + chatId).pipe(
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
