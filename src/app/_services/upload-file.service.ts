import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

 
@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  serverPath = 'http://localhost:8090';
 
  constructor(private http: HttpClient) { }
 
   // With this uploadfunction you can send the userId, productId, dormId 
   // along with a type: "userPic" "productPic" or "dormPic" along with a file(=photo) 
   // -> Spring will save it locally and update the user in the DB with the filepath (group and postPics are not implemented yet) 
  pushFileToStorage(file: File, userId: number, productPic: number, dormPic: number, imgType: string) {
    const formdata: FormData = new FormData();
    formdata.append('file', file);
    formdata.append('userId', userId.toString());
    formdata.append('productPic', productPic.toString());
    formdata.append('dormPic', dormPic.toString());
    formdata.append('imgType', imgType);

    return this.http.post(this.serverPath + '/postImage', formdata, {responseType: 'text' });  //ohne {responseType: 'text' } hat es auch bei Http Status: 200 einen error gegeben (Vom Backend kommt eine Response mit Text statt JSON im Body)  
    }
  
  // loads profilePic of user -> it's a post request, because we have to post the userId to Spring.
  getUserPic(): Observable<any> {
    console.log("Hier");
    const formdata: FormData = new FormData();
    formdata.append('userId', '2');
    return this.http.post(this.serverPath + '/loadProfilePicByUserId', 2, { responseType: 'blob' } );
  }

  /* // loads profilePic of user -> Spring returns a fake userDto with the base64code as groupName
  getProfilePictureOfUser(userId: number) {
    return this.http.post<User>(this.serverPath + '/getProfilePicByUserId', userId);
  } */
}
