import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SearchService } from 'src/app/services/search.service';
import { StockDataService } from 'src/app/services/stock-data.service';
import { WatchlistServiceService } from 'src/app/services/watchlist-service.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
  
  @Output() closePopupEvent = new EventEmitter();
  @Input() input = '';

  companyName = '';
  latestPrice = '';
  changeAmt = 0
  changePercent: number = 0
  public change: number = 0;

  stockNewsImage1 = '';
  stockNewsHeadline1 = '';
  stockNewsURL1 = '';
  stockLogo = '';

  followButtonText = 'LOADING';

  constructor(public authenticationService: AuthenticationService, private stockDataService: StockDataService, private watchlistService: WatchlistServiceService, private searchService: SearchService) { }

  ngOnInit(): void {
    let watchList = this.watchlistService.getWatchlist()
    for(let i = 0; i < watchList.length; i++) {
      if (watchList[i].ticker == this.input.toUpperCase()) {
        this.followButtonText = 'FOLLOWING'
        i = watchList.length;
      }
    }
    if (this.followButtonText == 'LOADING') {
      this.followButtonText = 'FOLLOW'
    }
    this.stockDataService.getStockBasicPriceInfo(this.input).subscribe((res: any) => {
      this.companyName = res.companyName
      this.latestPrice = res.latestPrice
      this.changeAmt = Math.abs(res.change)
      this.changePercent = res.changePercent.toFixed(2)
      if (res.change > 0)
        this.change = 1;
      else if (res.change < 0)
        this.change = -1;
      else
        this.change = 0;
    })
    this.stockDataService.getStockNews(this.input).subscribe((res: any) => {
      if (res[0]) {
        this.stockNewsImage1 = res[0].image;
        this.stockNewsHeadline1 = res[0].headline;
        this.stockNewsURL1 = res[0].url;
      }
    })
    this.searchService.getLogo(this.input).subscribe((res: any) => {
      this.stockLogo = res.url
    })
  }

  closePopup() {
    this.closePopupEvent.emit();
  }

  followStock() {
    this.followButtonText = 'LOADING'
    this.watchlistService.followStock({"id": parseInt(<string>localStorage.getItem('userID')), "ticker": this.input}).subscribe(res => {
      this.followButtonText = 'FOLLOWING'
    })
  }

  unfollowStock() {
    this.followButtonText = 'LOADING';
    this.watchlistService.unfollowStock(this.input.toUpperCase()).subscribe(res => {
      this.followButtonText = 'FOLLOW'
    })
  }

}
