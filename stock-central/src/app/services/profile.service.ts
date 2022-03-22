import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  public getFullUserInfo(email: any) { 
    return this.http.get('http://localhost:3000/api/getUserByEmail/' + email)
  }

  updateInfo(firstName: string, lastName: string, username: string) {
    let totUnedited = 0;
    if (firstName == '') {
      firstName = <string>localStorage.getItem('firstName');
      totUnedited++;
    }
    if (lastName == '') {
      lastName = <string>localStorage.getItem('lastName');
      totUnedited++;
    }
    if (username == '') {
      username = <string>localStorage.getItem('username');
      totUnedited++;
    }
    if (totUnedited == 3) {
      return;
    }
    firstName = firstName.replace(/\s/g, '');
    lastName = lastName.replace(/\s/g, '');
    username = username.replace(/\s/g, '');
    this.http.patch(environment.API_BASE_URL + '/updateUserInfo/' + localStorage.getItem('userID') + '/' + firstName + '/' + lastName + '/' + username, JSON.parse('{}')).subscribe(res => {
      localStorage.setItem('firstName', firstName);
      localStorage.setItem('lastName', lastName);
      localStorage.setItem('username', username);
    })
  }
}
