import { HttpRequest, HttpEvent, HttpEventType, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockDataService {

  constructor(private http: HttpClient) { }

  public getStockBasicPriceInfo(ticker: string) {
    return this.http.get(environment.IEX_BASE_CLOUD_URL + 'stock/' + ticker + '/quote?token=' + environment.IEX_CLOUD_KEY);
  }

  public getStockPriceBasicInfoBatch(tickers: string[]) {
    let tickersString: string = tickers.join()
    // return this.http.get(`https://cloud.iexapis.com/stable/stock/types=quote&symbols=${tickersString}&token=Tpk_12e6eee6ed7d4026a0a87dee063b86bd`)
    // return this.http.get(environment.IEX_BASE_CLOUD_URL + ``)
  }

  public getStockNews(ticker: string) {
    return this.http.get('http://localhost:3000/api/companyNews/' + ticker.toUpperCase())
  }

}
