import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { TtrssClientService } from '../ttrss-client.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ObservableMedia, MediaChange } from '@angular/flex-layout';
import { MatSidenav } from '@angular/material';
import { Category } from '../model/category';
@Component({
  selector: 'ttrss-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  watcher: Subscription;
  activeMediaQuery = "";
  isMobile: boolean = false;
  @ViewChild('snav') public snav: MatSidenav;
  feeds: Feed[];
  categories: Category[];
  selectedFeed: Feed|Category;

  private _mobileQueryListener: () => void;

  constructor(media: ObservableMedia, private client: TtrssClientService) {
    this.watcher = media.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : "";
      if (change.mqAlias == 'sm' || change.mqAlias == 'xs') {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
  }

  onSelect(feed: Feed|Category) {
    this.selectedFeed = feed;
    if(this.isMobile) {
      this.snav.close();
    }
  }

  ngOnDestroy(): void {
    this.watcher.unsubscribe();
  }

  ngOnInit() {
    this.client.getAllFeeds().subscribe( 
      data=> this.feeds = data
    );
    this.client.getCategories().subscribe( 
      data=> this.categories = data
    );
  }

}
