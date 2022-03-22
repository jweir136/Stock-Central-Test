import { Injectable } from '@angular/core';

import firebase from "firebase/compat/app"
import { AngularFireAuth } from "@angular/fire/compat/auth";

import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from './user.service';
import { FeedService } from './feed-service.service';
import { ProfileService } from './profile.service';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private authenticationEventEmitter: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public authenticationEvent: Observable<boolean> = this.authenticationEventEmitter.asObservable();

  signingUp = false;
  username = '';
  firstName = '';
  lastName = '';

  constructor(public afAuth: AngularFireAuth, private userService: UserService, private feedService: FeedService, private profileService: ProfileService) {
    this.afAuth.authState.subscribe(this.setSession.bind(this));
  }

  private async setSession(user: firebase.User | null): Promise<void> {
    if (user) {
      let userInfoSet = false;
      localStorage.setItem('userInfo', JSON.stringify(user));
      localStorage.setItem('email', (JSON.stringify(user?.email)).replace(/['"]+/g, ''))

      if (user.displayName) {
        localStorage.setItem('username', JSON.stringify(user?.displayName));
        localStorage.setItem('firstName', JSON.stringify(user?.displayName?.split(' ')[0]));
        localStorage.setItem('lastName', JSON.stringify(user?.displayName?.split(' ')[1]));
        await this.userService.addUser();
      }
      
      if (this.signingUp) {
        localStorage.setItem('username', this.username);
        localStorage.setItem('firstName', this.firstName);
        localStorage.setItem('lastName', this.lastName);
        await this.userService.addUser();
      }

      this.profileService.getFullUserInfo(localStorage.getItem('email')).subscribe((id: any) => {
        localStorage.setItem('userID', id[0].user_id);
        if (!userInfoSet) {
          localStorage.setItem('username', id[0].username);
          localStorage.setItem('firstName', id[0].first_name);
          localStorage.setItem('lastName', id[0]. last_name);
          userInfoSet = true;
        }
        this.authenticationEventEmitter.next(true);
      })
    } else {
      this.resetSession();
    }
  }

  async SignUp(email: string, password: string, username: string, firstName: string, lastName: string) {
    this.signingUp = true;
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    try {
      this.afAuth.createUserWithEmailAndPassword(email, password);
    } catch (error: any) {
      if (error.message.startsWith('Firebase: The email address is already in use')) {
        alert("Email is already in our system. Please return to the sign in to use this email");
      }
    }
  }

  async SignIn(email: string, password: string) {
    if (email === "") {
      alert('Please enter a valid email address');
    }
    else if (password === "") {
      alert('Please enter a valid password');
    } 
    else {
      try {
       this.afAuth.signInWithEmailAndPassword(email, password)
      } catch (error: any) {
        console.error(error);
        if (error.message.startsWith('Firebase: The password is invalid')) {
          alert("Password entered was incorrect. Please try again");
        }
        else if (error.message.startsWith('Firebase: The email address is badly formatted')) {
          alert('Email entered is invalid. Please try again');
        }
        else if (error.message.startsWith('Firebase: There is no user record corresponding')) {
          alert('This email address does not exist in our system. Press the Sign Up Button to Register');
        }
      }
    }
  }

  // Sign in with Google
  GoogleAuth() {
    this.AuthLogin(new firebase.auth.GoogleAuthProvider());
  }  

  // Auth logic to run auth providers
  async AuthLogin(provider: any) {
    try {
      const result = await this.afAuth.signInWithPopup(provider);
    } catch (error) {
      console.error(error);
    }
  }

  public getUserPhotoUrl(): string {
    return (JSON.parse(localStorage.getItem('userInfo') || '{}')).photoURL;
  }

  private resetSession(): void {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('username');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('email');
    localStorage.removeItem('userID');
    this.authenticationEventEmitter.next(false);
  }

  public signOut() {
    firebase.auth().signOut()
      .catch((error) => {
        console.error('Error: Sign out returned an error');
        console.error(error);
      })
      .finally(() => {
        this.resetSession();
      });
  }
}
