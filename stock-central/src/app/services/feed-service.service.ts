import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  constructor(private http: HttpClient) {
  }

  public generateFeed(userID: any) {
    //TODO: this is getting all posts. You need to get posts just from friends
    return this.http.get(environment.API_BASE_URL + `/posts/generateFeed/${userID}`)
    // return this.http.get(environment.API_BASE_URL + `/posts/generateFeed/${userID}`)
  }

  public getUsernamesForFeed(userID: number) {
    return this.http.get(environment.API_BASE_URL + `/getUsernames/${userID}`)
  }
}
