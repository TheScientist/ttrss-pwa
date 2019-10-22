import { ChangeDetectorRef, Component, OnInit, ViewChild, OnDestroy, NgZone } from '@angular/core';
import { TtrssClientService } from '../ttrss-client.service';
import { Observable, Subscription, observable, of, Subject } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { MarkreaddialogComponent } from '../markreaddialog/markreaddialog.component';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { CounterResult } from '../model/counter-result';
import { SettingsService } from '../settings.service';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { NestedTreeControl } from '@angular/cdk/tree';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { UpdateCounterEvent } from '../util/update-counter-event';
@Component({
  selector: 'ttrss-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit, OnDestroy {

  @ViewChild('snav', { static: true }) public snav: MatSidenav;
  @ViewChild('feedtoolbar', { static: true }) public feedtoolbar: MatToolbar;

  nestedTreeControl: NestedTreeControl<ICategory>;
  nestedDataSource: MatTreeNestedDataSource<ICategory>;

  scrollContainer: HTMLElement;

  watcher: Subscription;
  activeMediaQuery = '';
  isMobile = false;

  counters: CounterResult[];
  selectedFeed: ICategory;
  is_cat = false;
  multiSelectEnabled = false;
  headlines: Headline[] = [];
  fetch_more = true;
  toolbarHeight = 0;
  headlineUpdateEvent: Subject<number> = new Subject<number>();
  multiSelectionChanged: Subject<void> = new Subject<void>();

  private _mobileQueryListener: () => void;

  constructor(private _scrollToService: ScrollToService, media: MediaObserver, public dialog: MatDialog,
    private client: TtrssClientService, private settings: SettingsService,
    private translate: TranslateService, private titleService: Title, private ngZone: NgZone,
    private _hotkeysService: HotkeysService) {
    this.watcher = media.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
      this.toolbarHeight = this.feedtoolbar._elementRef.nativeElement.offsetHeight;
      if (change.mqAlias === 'sm' || change.mqAlias === 'xs') {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
    this.nestedDataSource = new MatTreeNestedDataSource<ICategory>();
    this.nestedTreeControl = new NestedTreeControl<ICategory>(this._getChildren);
    this.registerHotKeys();
  }

  private _getChildren = (node: ICategory) => {
    return of(node.items);
  }

  hasNestedChild = (_: number, nodeData: ICategory) => {
    return nodeData.type === 'category';
  }

  onSelect(feed: ICategory) {
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
    this.is_cat = this.selectedFeed.type === 'category';
    this.settings.lastFeedId = feed.bare_id;
    this.settings.lastSelectionIsCat = this.is_cat;
    this.client.getHeadlines(this.selectedFeed, 30, 0, null, this.is_cat)
      .subscribe(data => {
        this.headlines = data;
        this.toolbarHeight = this.feedtoolbar._elementRef.nativeElement.offsetHeight;
      });
    this.multiSelectEnabled = false;
  }

  ngOnDestroy(): void {
    this.watcher.unsubscribe();
  }

  ngOnInit() {
    this.scrollContainer = document.getElementById('feedView');

    this.refreshCounters();
    this.ngZone.runOutsideAngular(() => {
      setInterval(() => {
        this.ngZone.run(() => {
          this.refreshCounters();
        });
      }, 60000);
    });
    this.client.getFeedTree().subscribe(
      data => {
        this.nestedDataSource.data = data;
        this.initLastFeed();
      }
    );
  }

  initLastFeed(): void {
    const selId = this.settings.lastFeedId;
    const isCat = this.settings.lastSelectionIsCat;
    const foundFeed: ICategory = this.recursiveFindICategory(this.nestedDataSource.data, selId, isCat);
    if (foundFeed !== null) {
      this.onSelect(foundFeed);
    }
  }

  recursiveFindICategory(cats: ICategory[], id: number, is_cat: boolean): ICategory {
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
    }
    );
  }

  elementExistsInHeadlines(h: Headline, orig: Headline[]): boolean {
    return typeof this.headlines.find(existing => existing.id === h.id) === 'undefined';
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

  updateSelected(field: number) {
    this.headlineUpdateEvent.next(field);
  }

  updateFavCounter(amount: number) {
    const cntResult: CounterResult = this.counters.find(cnt => cnt.id === '-1' && (!cnt.kind || cnt.kind !== 'cat'));
    if (cntResult) {
      cntResult.auxcounter += amount;
    }
  }

  onCounterChanged(event: UpdateCounterEvent) {
    if (event.feed_id === 0) {
      this.updateFavCounter(event.count);
    } else if (event.feed_id === 2) {
      if (event.isCat) {
        this.updateReadCounters(event.count, null, event.target_feed);
      } else {
        this.updateReadCounters(event.count, event.target_feed, null);
      }
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

  multiselectChanged() {
    this.multiSelectEnabled = !this.multiSelectEnabled;
    this.multiSelectionChanged.next();
  }

  registerHotKeys() {
    this._hotkeysService.hotkeys.length = 1;
    this._hotkeysService.add(new Hotkey('m', (event: KeyboardEvent): boolean => {
      this.multiselectChanged();
      return false;
    }, undefined, this.translate.instant('TB_Multiselect')));
  }
}
