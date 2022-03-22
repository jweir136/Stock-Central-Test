import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { }

  public getLogo(ticker: string) {
    let token = environment.IEX_CLOUD_KEY
    return this.http.get(environment.IEX_BASE_CLOUD_URL + `stock/${ticker}/logo?token=${token}`)
  }
}
