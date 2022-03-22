import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProfileService } from './profile.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private profileService: ProfileService) { }

  async addUser() {
    let newUser = {
      "username": localStorage.getItem('username')?.replace(/['"]+/g, ''),
      "firstName": localStorage.getItem('firstName')?.replace(/['"]+/g, ''),
      "lastName": localStorage.getItem('lastName')?.replace(/['"]+/g, ''),
      "email": localStorage.getItem('email')?.replace(/['"]+/g, '')
    }
    this.http.post<any>('http://localhost:3000/api/users', newUser).subscribe(data => {
      return;
    })
  }
}
