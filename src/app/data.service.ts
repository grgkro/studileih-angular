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
  usersPath = 'http://localhost:8090/users'
  

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

  addProduct(formData: any) : Observable<any> {
    return this.http.post(this.productsPath,
      formData, { responseType: 'text' })
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
    return this.http.get<User[]>(this.usersPath).pipe(
      catchError(this.errorHandler)
    )
  }

  getUser(userId): Observable<User> {
    return this.http.get<User>(this.usersPath + '/' + userId).pipe(
      catchError(this.errorHandler)
    )
  }

  addUser(formData: any): Observable<any> {
    return this.http.post(this.usersPath,formData,{ responseType: 'text' }).pipe(
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

  sendEmailToOwner(formdata: FormData) {
    return this.http.post(this.serverPath + '/emails/sendEmail', formdata, {responseType: 'text' });
  }

  sendMessageToOwner(formdata: FormData) {
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

  sendReply(subject: string, messageText: string, sendetAt: string, chatId: number, userId: number) {
    const formdata: FormData = new FormData();
    formdata.append('subject', subject);
    formdata.append('messageText', messageText);
    formdata.append('sendetAt', sendetAt);
    formdata.append('chatId', chatId.toString());
    formdata.append('userId', userId.toString());
    return this.http.post(this.serverPath + '/messages/sendReply', formdata, {responseType: 'text' });
  }

  sendEmailReply(subject: string, messageText: string, sendetAt: string, chatId: number, userId: number) {
    const formdata: FormData = new FormData();
    formdata.append('subject', subject);
    formdata.append('messageText', messageText);
    formdata.append('sendetAt', sendetAt);
    formdata.append('chatId', chatId.toString());
    formdata.append('userId', userId.toString());
    return this.http.post(this.serverPath + '/messages/sendEmailReply', formdata, {responseType: 'text' });
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
