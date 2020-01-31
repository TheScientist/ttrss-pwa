import { Injectable } from '@angular/core';
import { TtrssClientService } from './ttrss-client.service';
import { CounterResult } from './model/counter-result';
import { SettingsService } from './settings.service';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { of, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class FeedManagerService {

  nestedTreeControl: NestedTreeControl<ICategory>;
  nestedDataSource: MatTreeNestedDataSource<ICategory>;

  counters: CounterResult[];
  selectedFeed: ICategory;
  is_cat = false;
  multiselectChangedEvent: Subject<boolean> = new Subject<boolean>();
  multiSelectEnabled = false;
  headlines: Headline[] = [];
  fetch_more = true;

  constructor(private translate: TranslateService, private titleService: Title,
    private settings: SettingsService, private client: TtrssClientService) {
    this.nestedDataSource = new MatTreeNestedDataSource<ICategory>();
    this.nestedTreeControl = new NestedTreeControl<ICategory>(this._getChildren);
  }

  selectFeed(feed: ICategory) {
    this.selectedFeed = feed;
    this.headlines = [];
    this.fetch_more = true;
    this.is_cat = this.selectedFeed.type === 'category';
    this.settings.lastFeedId = feed.bare_id;
    this.settings.lastSelectionIsCat = this.is_cat;
    this.client.getHeadlines(this.selectedFeed, 30, 0, null, this.is_cat)
      .subscribe(data => {
        this.headlines = data;
      });
    if (this.multiSelectEnabled) {
      this.multiselectChanged();
    }
  }

  multiselectChanged() {
    this.multiSelectEnabled = !this.multiSelectEnabled;
    this.multiselectChangedEvent.next();
  }

  initFeedTree() {
    this.client.getFeedTree().subscribe(
      data => {
        this.nestedDataSource.data = data;
        this.initLastFeed();
      }
    );
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
        this.translate.get('App_Title').subscribe(result => this.titleService.setTitle(prefix + result));
      }
    });
  }

  getFeedIconURL(id: number, is_cat?: boolean) {
    return this.client.getFeedIconURL(id, is_cat);
  }

  loadHeadlines() {
    if (this.fetch_more) {
      // Get new articles that may came in
      this.client.getHeadlines(this.selectedFeed, 20, 0, null, this.is_cat)
        .subscribe(data => {
          if (data.length !== 0) {
            data = data.filter(h => this.elementExistsInHeadlines(h, this.headlines));
            this.headlines.push(...data);
          }
        });

      let skip = this.headlines.length;
      if (this.selectedFeed.bare_id === -3) {
        skip = this.headlines.filter(h => h.unread).length;
      } else if (this.selectedFeed.bare_id === -1) {
        skip = this.headlines.filter(h => h.marked).length;
      }
      this.client.getHeadlines(this.selectedFeed, 20, skip, null, this.is_cat)
        .subscribe(data => {
          if (data.length === 0) {
            this.fetch_more = false;
          } else {
            data = data.filter(h => this.elementExistsInHeadlines(h, this.headlines));
            this.headlines.push(...data);
          }
        });
    }
  }

  catchupFeed() {
    this.client.catchupFeed(this.selectedFeed, this.is_cat).subscribe(success => {
      if (success) {
        this.headlines.forEach(head => head.unread = false);
        this.refreshCounters();
      }
    });
  }

  private elementExistsInHeadlines(h: Headline, orig: Headline[]): boolean {
    return typeof this.headlines.find(existing => existing.id === h.id) === 'undefined';
  }

  private initLastFeed(): void {
    const selId = this.settings.lastFeedId;
    const isCat = this.settings.lastSelectionIsCat;
    const foundFeed: ICategory = this.recursiveFindICategory(this.nestedDataSource.data, selId, isCat);
    if (foundFeed !== null) {
      this.selectFeed(foundFeed);
    }
  }

  private recursiveFindICategory(cats: ICategory[], id: number, is_cat: boolean): ICategory {
    for (const cat of cats) {
      if (is_cat && cat.type === 'category' || !is_cat && cat.type !== 'category') {
        if (cat.bare_id === id) {
          return cat;
        }
      }
      if (cat.type === 'category') {
        const sub = this.recursiveFindICategory(cat.items, id, is_cat);
        if (sub !== null) {
          return sub;
        }
      }
    }
    return null;
  }

  private _getChildren = (node: ICategory) => {
    return of(node.items);
  }
}
