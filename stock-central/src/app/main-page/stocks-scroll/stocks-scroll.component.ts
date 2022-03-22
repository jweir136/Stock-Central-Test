import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { FeedService } from 'src/app/services/feed-service.service';
import { ProfileService } from 'src/app/services/profile.service';
import { WatchlistServiceService } from 'src/app/services/watchlist-service.service';

@Component({
  selector: 'app-stocks-scroll',
  templateUrl: './stocks-scroll.component.html',
  styleUrls: ['./stocks-scroll.component.scss']
})
export class StocksScrollComponent implements OnInit {

  public newStockFollowed: Observable<string> = this.watchlistService.followStockEvent;
  public stockUnfollowed: Observable<string> = this.watchlistService.unfollowStockEvent;

  tickerSymbols: any[] = [];

  constructor(private http: HttpClient, private watchlistService: WatchlistServiceService, private feedService: FeedService, private profileService: ProfileService) { }

  ngOnInit(): void {
    this.newStockFollowed.subscribe( res => {
      if (res != '') {
        this.tickerSymbols.push({"ticker": res});
        this.watchlistService.setWatchlist(this.tickerSymbols);
      }
    })
    this.stockUnfollowed.subscribe( res => {
      if (res != '') {
        for (let i = 0; i < this.tickerSymbols.length; i++) {
          if (this.tickerSymbols[i].ticker == res) {
            this.tickerSymbols.splice(i, 1);
            i = this.tickerSymbols.length;
          }
        }
      }
    })
    // let userID: any = sessionStorage.getItem('userID')
    this.watchlistService.getWatchlistItems(parseInt(<string>localStorage.getItem("userID"))).subscribe((res: any) => {
      this.tickerSymbols = res;
      this.watchlistService.setWatchlist(this.tickerSymbols);
    })
  }

  getTicker(tickerSymbol: any) {
    return tickerSymbol.ticker;
  }

}
