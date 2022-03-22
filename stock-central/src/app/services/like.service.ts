import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LikeService {

  constructor(private http: HttpClient) { }

  likePost(postID: string, userID: string) {
    return this.http.patch(environment.API_BASE_URL + '/likePost/' + postID + '/' + userID, JSON.parse('{}'));
  }

  unlikePost(postID: string, userID: string) {
    return this.http.patch(environment.API_BASE_URL + '/unlikePost/' + postID + '/' + userID, JSON.parse('{}'));
  }

  getLikes(userID: string) {
    return this.http.get(environment.API_BASE_URL + '/getLikes/' + userID);
  }
}
