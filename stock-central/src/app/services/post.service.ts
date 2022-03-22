import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }

  public createPost(userID: number, messageContent: string): Observable<any> {
    let requestBody = {
      id: userID,
      messageContent: messageContent
    }
    return this.http.post(environment.API_BASE_URL + '/createPost', requestBody)
  }
  
}
