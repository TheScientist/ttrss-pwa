import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { TtrssClientService } from '../ttrss-client.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ObservableMedia, MediaChange } from '@angular/flex-layout';
import { MatSidenav, MatDialog, MatToolbar } from '@angular/material';
import { Category } from '../model/category';
import { MarkreaddialogComponent } from '../markreaddialog/markreaddialog.component';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { CounterResult } from '../model/counter-result';
@Component({
  selector: 'ttrss-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  @ViewChild('snav') public snav: MatSidenav;
  @ViewChild('feedtoolbar') public feedtoolbar: MatToolbar;

  watcher: Subscription;
  activeMediaQuery = "";
  isMobile: boolean = false;

  feeds: Feed[];
  categories: Category[];
  counters: CounterResult[];
  selectedFeed: Feed | Category;
  is_cat: boolean = false;
  multiSelectEnabled: boolean = false;
  headlines: Headline[] = [];
  multiSelectedHeadlines: Headline[] = [];
  selectedHeadline: Headline;
  fetch_more: boolean = true;

  private _mobileQueryListener: () => void;

  constructor(private _scrollToService: ScrollToService, media: ObservableMedia, public dialog: MatDialog, private client: TtrssClientService) {
    this.watcher = media.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : "";
      if (change.mqAlias == 'sm' || change.mqAlias == 'xs') {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
  }

  onSelect(feed: Feed | Category) {
    if (this.isMobile) {
      this.snav.close();
    }
    this.selectedFeed = feed;
    this.is_cat = this.selectedFeed instanceof Category;
    this.client.getHeadlines(this.selectedFeed, 20, 0, null, this.is_cat)
      .subscribe(data =>
        this.headlines = data);
    this.selectedHeadline = null;
    this.multiSelectedHeadlines.length = 0;
    this.multiSelectEnabled = false;
  }

  ngOnDestroy(): void {
    this.watcher.unsubscribe();
  }

  ngOnInit() {
    this.refreshCounters();
    setInterval(() => {
      this.refreshCounters();
    }, 60000);
    this.client.getAllFeeds().subscribe(
      data => this.feeds = data
    );
    this.client.getCategories().subscribe(
      data => this.categories = data
    );
  }

  refreshCounters() {
    this.client.updateCounters().subscribe(data => this.counters = data);
  }

  loadHeadlines() {
    if (this.fetch_more) {
      // probably we need more logic here.
      this.client.getHeadlines(this.selectedFeed, 20, this.headlines.length, null, this.is_cat)
        .subscribe(data => {
          if (data.length === 0) {
            this.fetch_more = false;
          } else {
            this.headlines.push(...data)
          }
        });
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  onArticleSelect(headline: Headline) {
    if (!this.multiSelectEnabled) {
      if (headline !== this.selectedHeadline) {
        this.selectedHeadline = null;
        if (!headline.content) {
          this.client.getArticle(headline.id).subscribe(article => headline.content = article.content);
        }

        this.selectedHeadline = headline;
        if (headline.unread) {
          this.updateSelected(2, 0);
        }
        const config: ScrollToConfigOptions = {
          target: 'article' + headline.id,
          offset: -this.feedtoolbar._elementRef.nativeElement.offsetHeight,
          duration: 0
        };
        this.sleep(200).then(() => this._scrollToService.scrollTo(config));
      } else {
        this.selectedHeadline = null;
      }
    } else {
      var index = this.multiSelectedHeadlines.indexOf(headline);
      if (index < 0) {
        this.multiSelectedHeadlines.push(headline);
      } else {
        this.multiSelectedHeadlines.splice(index, 1);
      }
    }
  }
  catchupFeed() {
    let dialogRef = this.dialog.open(MarkreaddialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.client.catchupFeed(this.selectedFeed, this.is_cat).subscribe(result => {
          if (result) {
            this.headlines.forEach(head => head.unread = false);
            this.refreshCounters();
          }
        });
      }
    });
  }

  updateSelected(field: number, mode: number) {
    if (this.multiSelectEnabled) {
      if (this.multiSelectedHeadlines.length === 0) {
        return;
      }
      let feedOrCat = this.selectedFeed;
      this.client.updateArticle(this.multiSelectedHeadlines, field, mode).subscribe(result => {
        if (result) {
          switch (field) {
            case 0:
              let amount: number = 0;
              this.multiSelectedHeadlines.forEach(head => {
                head.marked = !head.marked;
                head.marked ? amount++ : amount--;
              });
              this.updateFavCounter(amount);
              break;
            case 2:
              let change: number = 0;
              this.multiSelectedHeadlines.forEach(head => {
                head.unread = !head.unread;
                head.unread ? change++ : change--;
              });
              if (feedOrCat instanceof Category) {
                this.updateReadCounters(change, null, feedOrCat.id);
              } else {
                this.updateReadCounters(change, feedOrCat.id, undefined);
              }
              break;
          }
        }
      });
    } else {
      let head: Headline = this.selectedHeadline;
      this.client.updateArticle(head, field, mode).subscribe(result => {
        if (result) {
          switch (field) {
            case 0:
              head.marked = !head.marked;
              this.updateFavCounter(head.marked ? 1 : -1);
              break;
            case 2:
              head.unread = !head.unread;
              this.updateReadCounters(head.unread ? 1 : -1, head.feed_id);
              break;
          }
        }
      });
    }
  }

  updateFavCounter(amount: number) {
    let cntResult: CounterResult = this.counters.find(cnt => cnt.id === "-1" && (!cnt.kind || cnt.kind !== "cat"));
    if (cntResult) {
      cntResult.auxcounter += amount;
    }
  }

  updateReadCounters(amount: number, feedid: number, catid?: number): void {
    let arr: string[] = [];
    if (feedid != null) {
      arr.push(feedid + "");
    }
    arr.push("-3");
    arr.push("-4");
    this.counters.forEach(cnt => {
      if (arr.includes(cnt.id) && (!cnt.kind || cnt.kind !== "cat")
        || catid && catid + "" === cnt.id && cnt.kind === "cat") {
        cnt.counter += amount;
      }
    });
  }

  multiselectChanged(checked: boolean) {
    this.multiSelectEnabled = checked;
    if (this.multiSelectEnabled) {
      this.selectedHeadline = null;
    } else {
      this.multiSelectedHeadlines.length = 0;
    }
  }

}
