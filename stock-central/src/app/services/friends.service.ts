import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  constructor(private http: HttpClient) { }

  public getFriendsList(userID: number) {
    return this.http.get(environment.API_BASE_URL + `/getFriendsList/${userID}`);
  }

  followUser(followObject: any) {
    return this.http.post<any>('http://localhost:3000/api/addFriend', followObject);
  }
  
  unfollowUser(followObject: any) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        id: followObject.id,
        id2: followObject.id2,
      },
    };
    return this.http.delete(environment.API_BASE_URL + '/deleteFriend', options)
  }
}
