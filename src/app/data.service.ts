import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { User } from './_models/user';
import { Product } from './_models/product';
import { ResponseEntity } from './_models/responseEntity';

import { catchError, retry } from 'rxjs/operators';
import { Dorm } from './_models/dorm';
import { Message } from './_models/message';
import { Chat } from './_models/chat';
import { AuthRequest } from './_models/authRequest';

const serverPath = 'http://localhost:5000';
// const serverPath = 'https://api.studileih.de';
// const serverPath = 'https://studileih1.eu-central-1.elasticbeanstalk.com';
// const serverPath = 'https://studileih-heroku.herokuapp.com';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private http: HttpClient) { }

  getAdmin(): Observable<any> {
    return this.http.get<any>(serverPath + '/admin', { observe: 'response' })
  }

  getProductsByDorm(id: number): Observable<Product[]> {
    return this.http.get<Product[]>(serverPath + '/productsByDorm' + '/' + id)
  }

  getProductsWithoutDormProducts(id: number): Observable<Product[]> {
    return this.http.get<Product[]>(serverPath + '/productsWithouthDormProducts' + '/' + id)
  }

  getDormLocations(): Observable<Dorm[]> {
    return this.http.get<Dorm[]>(serverPath +'/dorms');
  }
  

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(serverPath + '/products');
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(serverPath + '/products/' + id)
  }

  addProduct(formData: any) : Observable<any> {
    return this.http.post(serverPath + '/products',
      formData)
  }

  editProduct(formData: any) : Observable<any> {
    return this.http.put(serverPath + '/products',
      formData, { responseType: 'text' })
  }

  deleteProduct(id: number): Observable<any> {
    const formdata: FormData = new FormData();
    formdata.append('id', id.toString());
    return this.http.post(serverPath + '/products/delete/' + id, formdata, { responseType: 'text' });
  }

  loadProductPicByFilename(filename: string, productId: number): Observable<Blob> {
    const formdata: FormData = new FormData();
    formdata.append('filename', filename);
    formdata.append('productId', productId.toString());
    return this.http.post(serverPath + '/images/loadProductPicByFilename', formdata, { responseType: 'blob' });
  }

  archivePicByFilename(filename: string, imgType: string, productId: number): Observable<any> {
    const formdata: FormData = new FormData();
    formdata.append('filename', filename);
    formdata.append('imgType', imgType);
    formdata.append('productId', productId.toString());
    return this.http.post(serverPath + '/images/archivePicByFilename', formdata, { responseType: 'text' });
  }

  deleteArchive(archiveType: string, id: number): Observable<string> {
    const formdata: FormData = new FormData();
    formdata.append('archiveType', archiveType);
    formdata.append('id', id.toString());
    return this.http.post(serverPath + '/images/deleteArchive', formdata, { responseType: 'text' });
  }

  deleteImageFolder(folderType: string, id: number): Observable<string> {
    const formdata: FormData = new FormData();
    formdata.append('folderType', folderType);
    formdata.append('id', id.toString());
    return this.http.post(serverPath + '/images/deleteImageFolder', formdata, { responseType: 'text' });
  }

  restorePicByFilename(filename: string, imgType: string, productId: number) {
    const formdata: FormData = new FormData();
    formdata.append('filename', filename);
    formdata.append('imgType', imgType);
    formdata.append('productId', productId.toString());
    console.log("_data restore " + filename)
    return this.http.post(serverPath + '/images/restorePicByFilename', formdata, { responseType: 'text' });
  }

  deleteProductPicByFilename(filename: string, productId: number) {
    const formdata: FormData = new FormData();
    formdata.append('filename', filename);
    formdata.append('productId', productId.toString());
    return this.http.post(serverPath + '/images/deleteProductPicByFilename', formdata, {responseType: 'text' });
  }

  getOwner(productId: number): Observable<User> {
    return this.http.get<User>(serverPath + '/users/owner/' + productId)
  }

  getUsersByDorm(): Observable<User[]> {
    return this.http.get<User[]>(serverPath + '/users/usersByDorm')
  }

  getUser(userId): Observable<User> {
    return this.http.get<User>(serverPath + '/users/dto/' + userId);
  }

  getUserForEditing(): Observable<User> {
    return this.http.get<User>(serverPath + '/users/editing');
  }

  // addUser(formData: any): Observable<any> {
  //   return this.http.post(serverPath,formData,{ responseType: 'text' })
  // }

  deleteUser(id: number): Observable<User> {
    return this.http.delete<User>(serverPath + '/users/' + id)
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(serverPath + '/users/' + user.id, user)
  }

  sendEmailToOwner(formdata: FormData) {
    return this.http.post(serverPath + '/emails/sendEmail', formdata, {responseType: 'text' });
  }

  sendMessageToOwner(formdata: FormData) {
    return this.http.post(serverPath + '/messages/sendMessage', formdata, {responseType: 'text' });
  }

  // when a message was received, we have to update the receivedAt timestamp of that message
  updateMessage(chatId: number, messageId: number, receivedAt: string) {
    const formdata: FormData = new FormData();
    formdata.append('chatId', chatId.toString());
    formdata.append('messageId', messageId.toString());
    formdata.append('receivedAt', receivedAt);
    return this.http.post(serverPath + '/messages/updateMessage', formdata, {responseType: 'text' });
  }

  sendReply(message: Message) {
    return this.http.post(serverPath + '/messages/sendReply', message, {responseType: 'text' });
  }

  sendEmailReply(message: Message) {
    return this.http.post(serverPath + '/messages/sendEmailReply', message, {responseType: 'text' });
  }

  getChatsByLoggedInUserPrincipal(): Observable<Chat[]> {
    return this.http.get<Chat[]>(serverPath + "/chats/")
  }

  getMessagesByChatId(id: number): Observable<any> {
    return this.http.get(serverPath + '/chats/messagesByChatId/'+ id);   
  }

  getChatById(id: number): Observable<Chat> {
    return this.http.get<Chat>(serverPath + "/chats/" + id)
  }

}
