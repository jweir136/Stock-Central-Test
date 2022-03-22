import { Component } from '@angular/core';

import {Observable} from 'rxjs';
import {AuthenticationService} from '../app/services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'stock-central';
  public userLoggedIn$: Observable<boolean> = this.authenticationService.authenticationEvent;

  public constructor(public authenticationService: AuthenticationService) {
  }
}
