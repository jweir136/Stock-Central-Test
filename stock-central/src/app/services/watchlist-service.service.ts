import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WatchlistServiceService {

  private followStockEventEmitter: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public followStockEvent: Observable<string> = this.followStockEventEmitter.asObservable();

  private unfollowStockEventEmitter: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public unfollowStockEvent: Observable<string> = this.unfollowStockEventEmitter.asObservable();

  watchlistStocks: any[] = [];

  constructor(private http: HttpClient) { }

  public getWatchlistItems(userID: number) {
    return this.http.get(environment.API_BASE_URL + `/getWatchlistItems/${userID}`);
  }

  followStock(req: any) {
    this.followStockEventEmitter.next(req.ticker);
    return this.http.post<any>('http://localhost:3000/api/addToWatchlist', req)
  }

  unfollowStock(req: any) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        id: localStorage.getItem('userID'),
        ticker: req,
      },
    };
    this.unfollowStockEventEmitter.next(req);
    let index = this.watchlistStocks.indexOf(req);
    if (index > -1) {
      this.watchlistStocks.splice(index, 1);
    }
    return this.http.delete(environment.API_BASE_URL + '/removeFromWatchlist', options)
  }

  setWatchlist(currWatchlist: any[]) {
    this.watchlistStocks = currWatchlist;
  }

  getWatchlist() {
    return this.watchlistStocks;
  }
}
