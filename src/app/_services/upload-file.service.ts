import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
  getImage(imageUrl: string): Observable<Blob> {
    return this.http.get(imageUrl, { responseType: 'blob' });
  }
  
  constructor(private http: HttpClient) { }
 
   // With this uploadfunction you can send the userId, productId, dormId 
   // along with a type: "userPic" "productPic" or "dormPic" along with a file(=photo) 
   // -> Spring will save it locally and update the user in the DB with the filepath (group and postPics are not implemented yet) 
  pushFileToStorage(file: File, userId: number, productId: number, imgType: string) {
    const formdata: FormData = new FormData();
    formdata.append('file', file);
    // if the file is a userPic, the productId will be null. if (productId ) is true, when productId != null (i dont know why, but if (productId != null) didnt work...)
    if (productId) {
      formdata.append('id', productId.toString());
    } else {
      formdata.append('id', userId.toString());
    }
    formdata.append('imgType', imgType);
    
    return this.http.post(environment.serverPath + '/postImage', formdata, {responseType: 'text' });  //ohne {responseType: 'text' } hat es auch bei Http Status: 200 einen error gegeben (Vom Backend kommt eine Response mit Text statt JSON im Body)  
    }
  
  // loads profilePic of user -> it's a post request, because we have to post the userId to Spring.
  getUserPic(userId: number): Observable<Blob> {
    return this.http.post(environment.serverPath + '/loadProfilePicByUserId', userId, { responseType: 'blob' } );
  }
}
