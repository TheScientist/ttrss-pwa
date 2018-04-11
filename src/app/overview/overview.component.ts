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
  }

  ngOnDestroy(): void {
    this.watcher.unsubscribe();
  }

  ngOnInit() {
    this.client.getAllFeeds().subscribe(
      data => this.feeds = data
    );
    this.client.getCategories().subscribe(
      data => this.categories = data
    );
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
        this.selectedHeadline=null;
        if (!headline.content) {
          this.client.getArticle(headline.id).subscribe(article => headline.content = article.content);
        }
        
        this.selectedHeadline = headline;
        if (headline.unread) {
          this.client.updateArticle(headline, 2, 0).subscribe(result => headline.unread = !result);
        }
        const config: ScrollToConfigOptions = {
          target: 'article' + headline.id,
          offset: -this.feedtoolbar._elementRef.nativeElement.offsetHeight,
          duration: 0
        };    
        this.sleep(200).then(()=>this._scrollToService.scrollTo(config));
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

  updateSelected(field: number, mode: number) {
    // handle mark all read state
    if (field == 2 &&
      (!this.selectedHeadline || this.selectedHeadline === null) &&
      (this.multiSelectedHeadlines === null || this.multiSelectedHeadlines.length === 0)) {

      let dialogRef = this.dialog.open(MarkreaddialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.client.catchupFeed(this.selectedFeed, this.is_cat).subscribe(result => {
            if (result) {
              this.headlines.forEach(head => head.unread = false);
            }
          });
        }
      });
      return;
    }

    if (this.multiSelectEnabled) {
      if (this.multiSelectedHeadlines.length === 0) {
        return;
      }
      this.client.updateArticle(this.multiSelectedHeadlines, field, mode).subscribe(result => {
        if (result) {
          switch (field) {
            case 0: this.multiSelectedHeadlines.forEach(head => head.marked = !head.marked);
              break;
            case 2: this.multiSelectedHeadlines.forEach(head => head.unread = !head.unread);
              break;
          }
        }
      });
    } else {
      this.client.updateArticle(this.selectedHeadline, field, mode).subscribe(result => {
        if (result) {
          switch (field) {
            case 0: this.selectedHeadline.marked = !this.selectedHeadline.marked;
              break;
            case 2: this.selectedHeadline.unread = !this.selectedHeadline.unread;
              break;
          }
        }
      });
    }
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
