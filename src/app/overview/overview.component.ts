import { ChangeDetectorRef, Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { TtrssClientService } from '../ttrss-client.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ObservableMedia, MediaChange } from '@angular/flex-layout';
import { MatSidenav, MatDialog, MatToolbar, MatSidenavContent } from '@angular/material';
import { Category } from '../model/category';
import { MarkreaddialogComponent } from '../markreaddialog/markreaddialog.component';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { CounterResult } from '../model/counter-result';
import { SettingsService } from '../settings.service';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'ttrss-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit, OnDestroy {

  @ViewChild('snav') public snav: MatSidenav;
  @ViewChild('feedtoolbar') public feedtoolbar: MatToolbar;

  scrollContainer: HTMLElement;

  watcher: Subscription;
  activeMediaQuery = '';
  isMobile = false;

  feeds: Feed[];
  categories: Category[];
  counters: CounterResult[];
  selectedFeed: Feed | Category;
  is_cat = false;
  multiSelectEnabled = false;
  headlines: Headline[] = [];
  multiSelectedHeadlines: Headline[] = [];
  selectedHeadline: Headline;
  fetch_more = true;

  private _mobileQueryListener: () => void;

  constructor(private _scrollToService: ScrollToService, media: ObservableMedia, public dialog: MatDialog,
    private client: TtrssClientService, private settings: SettingsService,
    private translate: TranslateService, private titleService: Title) {
    this.watcher = media.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
      if (change.mqAlias === 'sm' || change.mqAlias === 'xs') {
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
    this.headlines = [];
    this.fetch_more = true;
    this._scrollToService.scrollTo({
      target: 'feedtoolbar',
      duration: 0
    });
    this.is_cat = this.selectedFeed instanceof Category;
    this.settings.lastFeedId = feed.id;
    this.settings.lastSelectionIsCat = this.is_cat;
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
    this.scrollContainer = document.getElementById('feedView');

    this.refreshCounters();
    setInterval(() => {
      this.refreshCounters();
    }, 60000);
    this.client.getAllFeeds().subscribe(
      data => {
        this.feeds = data;
        this.initLastFeed();
      }
    );
    this.client.getCategories().subscribe(
      data => this.categories = data
    );
  }

  initLastFeed(): void {
    const isCat = this.settings.lastSelectionIsCat;
    const selId = this.settings.lastFeedId;
    if (isCat) {
      const foundCat: Category = this.categories.find(cat => cat.id === selId);
      if (foundCat) {
        this.onSelect(foundCat);
      }
    } else {
      const foundFeed: Feed = this.feeds.find(feed => feed.id === selId);
      if (foundFeed) {
        this.onSelect(foundFeed);
      }
    }
  }

  refreshCounters() {
    this.client.updateCounters().subscribe(data => {
      this.counters = data;
      const fresh = this.counters.find(cnt => cnt.id === '-3' && !cnt.kind);
      if (fresh) {
        let prefix = '';
        if (fresh.counter > 0) {
          prefix = '(' + fresh.counter + ') ';
        }
        this.translate.get('title').subscribe(result => this.titleService.setTitle(prefix + result));
      }
    }
    );
  }

  loadHeadlines() {
    if (this.fetch_more) {
      // probably we need more logic here.
      this.client.getHeadlines(this.selectedFeed, 20, this.headlines.length, null, this.is_cat)
        .subscribe(data => {
          if (data.length === 0) {
            this.fetch_more = false;
            if (this.settings.markReadOnScroll) {
              this.headlines.filter(h => h.unread).forEach(h => {
                this.client.updateArticle(h, 2, 0).subscribe(result => {
                  if (result) {
                    h.unread = false;
                    this.refreshCounters();
                  }
                });
              });
            }
          } else {
            this.headlines.push(...data);
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
      const index = this.multiSelectedHeadlines.indexOf(headline);
      if (index < 0) {
        this.multiSelectedHeadlines.push(headline);
      } else {
        this.multiSelectedHeadlines.splice(index, 1);
      }
    }
  }
  catchupFeed() {
    const dialogRef = this.dialog.open(MarkreaddialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.client.catchupFeed(this.selectedFeed, this.is_cat).subscribe(success => {
          if (success) {
            this.headlines.forEach(head => head.unread = false);
            this.refreshCounters();
          }
        });
      }
    });
  }

  updateSelected(field: number, mode: number) {
    const feedOrCat = this.selectedFeed;
    const isCat = this.is_cat;
    if (this.multiSelectEnabled) {
      if (this.multiSelectedHeadlines.length === 0) {
        return;
      }
      this.client.updateArticle(this.multiSelectedHeadlines, field, mode).subscribe(result => {
        if (result) {
          switch (field) {
            case 0:
              let amount = 0;
              this.multiSelectedHeadlines.forEach(head => {
                head.marked = !head.marked;
                head.marked ? amount++ : amount--;
              });
              this.updateFavCounter(amount);
              break;
            case 2:
              let change = 0;
              this.multiSelectedHeadlines.forEach(head => {
                head.unread = !head.unread;
                head.unread ? change++ : change--;
              });
              if (isCat) {
                this.updateReadCounters(change, null, feedOrCat.id);
              } else {
                this.updateReadCounters(change, feedOrCat.id, (<Feed>feedOrCat).cat_id);
              }
              break;
          }
        }
      });
    } else {
      const head: Headline = this.selectedHeadline;
      this.client.updateArticle(head, field, mode).subscribe(result => {
        if (result) {
          switch (field) {
            case 0:
              head.marked = !head.marked;
              this.updateFavCounter(head.marked ? 1 : -1);
              break;
            case 2:
              head.unread = !head.unread;
              if (isCat) {
                this.updateReadCounters(head.unread ? 1 : -1, head.feed_id, feedOrCat.id);
              } else {
                this.updateReadCounters(head.unread ? 1 : -1, feedOrCat.id, (<Feed>feedOrCat).cat_id);
              }
              break;
          }
        }
      });
    }
  }

  updateFavCounter(amount: number) {
    const cntResult: CounterResult = this.counters.find(cnt => cnt.id === '-1' && (!cnt.kind || cnt.kind !== 'cat'));
    if (cntResult) {
      cntResult.auxcounter += amount;
    }
  }

  updateReadCounters(amount: number, feedid: number, catid: number): void {
    const arr: string[] = [];
    if (feedid != null) {
      arr.push(feedid + '');
    }
    arr.push('-3');
    arr.push('-4');
    this.counters.forEach(cnt => {
      if (arr.includes(cnt.id) && (!cnt.kind || cnt.kind !== 'cat')
        || catid && catid + '' === cnt.id && cnt.kind === 'cat') {
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

  inview(event) {
    if (this.settings.markReadOnScroll && event.data.unread && !event.parts.top && event.status) {
      this.client.updateArticle(event.data, 2, 0).subscribe(result => {
        if (result) {
          event.data.unread = false;
        }
      });
    }
  }
}
