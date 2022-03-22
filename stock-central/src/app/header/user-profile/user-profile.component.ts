import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ProfileService } from 'src/app/services/profile.service';
import * as moment from 'moment';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  @Output() openUserPreferenceEditor = new EventEmitter();

  public popup: boolean = false;
  public accountCreated: any = '';
  public userFirstName: any = '';
  public userLastName: any = '';
  public userPhotoUrl: any = '';
  public editBio: boolean = false;
  public username: any = '';
  public email: any = '';
  public age: any = -1;
  public createdAt: string = '';
  public bioForm: FormGroup = FormGroup.prototype;

  edit = false;

  public constructor(public authenticationService: AuthenticationService, private profileService: ProfileService) {
    this.authenticationService.authenticationEvent.subscribe((user: boolean) => {
    });
  }

  public ngOnInit(): void {
    this.userFirstName = localStorage.getItem('firstName')?.replace(/['"]+/g, ''),
    this.userLastName = localStorage.getItem('lastName')?.replace(/['"]+/g, ''),
    this.email = localStorage.getItem('email')
    this.userPhotoUrl = (JSON.parse(localStorage.getItem('userInfo') || '{}')).photoURL;
    if (!this.userPhotoUrl) {
      this.userPhotoUrl = 'https://cdn2.iconfinder.com/data/icons/facebook-51/32/FACEBOOK_LINE-01-512.png';
    }
  
    this.profileService.getFullUserInfo(this.email).subscribe((res: any) => {
      this.username = res[0].username
      this.createdAt = (res[0].created_at).split('T')[0]
    });

  }

  saveProfileEdit() {
    let editedFirstName = (<HTMLInputElement>document.getElementById("editFirstName")).value;
    let editedLastName = (<HTMLInputElement>document.getElementById("editLastName")).value;
    let editedUsername = (<HTMLInputElement>document.getElementById("editUsername")).value;
    this.profileService.updateInfo(editedFirstName, editedLastName, editedUsername);
    this.userFirstName = editedFirstName;
    this.userLastName = editedLastName;
    this.username = editedUsername;
    this.edit = false;
  }
}
