import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';

import {Observable} from 'rxjs';
import { environment } from 'src/environments/environment';
import {AuthenticationService} from '../services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public userLoggedIn$: Observable<boolean> = this.authenticationService.authenticationEvent;

  popup = false;
  autocompleteResults = false;
  tickerSymbols = [];
  users = [];
  userIndex = 0;

  dataList = [
    { code: 1, name: "STOCKS" },
    { code: 2, name: "USERS" },
  ]

  public constructor(private authenticationService: AuthenticationService, private http: HttpClient) {
  }

  ngOnInit(): void {
    
  }

  getInput() {
    return (<HTMLInputElement>document.getElementById("searchBar")).value.toUpperCase();
  }

  search() {
    this.popup = true;
    this.autocompleteResults = false;
  }

  autocomplete(event: any) {
    this.autocompleteResults = true;
    let input = this.getInput() + event.key;
    let dropDownResult = <HTMLInputElement>document.getElementById("ddlViewBy");
    if (dropDownResult.value == '1') {
      return this.http.get(environment.IEX_BASE_CLOUD_URL + 'search/' + input + '?token=' + environment.IEX_CLOUD_KEY).subscribe((res: any) => {
        this.tickerSymbols = res;
      })
    }
    else {
      return this.http.get(environment.API_BASE_URL + '/getUsers/' + input).subscribe((res: any) => {
        this.users = res;
      })
    }
  }

  checkInput() {
    if (this.getInput() === '') {
      this.autocompleteResults = false;
    }
  }

  getSymbol(result: any) {
    return result.symbol
  }

  getUsername(result: any) {
    return result.username;
  }

  setInput(newInput: string) {
    (<HTMLInputElement>document.getElementById("searchBar")).value = newInput;
  }

  checkDropDown() {
    var e = <HTMLInputElement>document.getElementById("ddlViewBy");
    return e.value;
  }

  setUserIndex(index: number) {
    this.userIndex = index;
  }

}
