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
import { filter, map } from 'rxjs/operators';
import { FeedManagerService } from '../feed-manager.service';
@Component({
  selector: 'ttrss-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit, OnDestroy {

  @ViewChild('snav', { static: true }) public snav: MatSidenav;
  @ViewChild('feedtoolbar', { static: true }) public feedtoolbar: MatToolbar;

  scrollContainer: HTMLElement;

  watcher: Subscription;
  activeMediaQuery = '';
  isMobile = false;

  toolbarHeight = 0;
  headlineUpdateEvent: Subject<number> = new Subject<number>();
  feedManagerService: FeedManagerService;

  private _mobileQueryListener: () => void;

  constructor(private _scrollToService: ScrollToService, media: MediaObserver, public dialog: MatDialog,
    private settings: SettingsService, feedManagerService: FeedManagerService,
    private translate: TranslateService, private ngZone: NgZone,
    private _hotkeysService: HotkeysService) {
    this.feedManagerService = feedManagerService;
    this.watcher = media.asObservable()
      .pipe(
        filter((changes: MediaChange[]) => changes.length > 0),
        map((changes: MediaChange[]) => changes[0])
      )
      .subscribe((change: MediaChange) => {
        this.activeMediaQuery = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
        this.toolbarHeight = this.feedtoolbar._elementRef.nativeElement.offsetHeight;
        if (change.mqAlias === 'sm' || change.mqAlias === 'xs') {
          this.isMobile = true;
        } else {
          this.isMobile = false;
        }
      });
    this.registerHotKeys();
  }

  hasNestedChild = (_: number, nodeData: ICategory) => {
    return nodeData.type === 'category';
  }

  ngOnDestroy(): void {
    this.watcher.unsubscribe();
  }

  ngOnInit() {
    this.scrollContainer = document.getElementById('feedView');

    this.feedManagerService.refreshCounters();
    this.ngZone.runOutsideAngular(() => {
      let interval;
      switch (this.settings.getCounterUpdate()) {
        case '30s': interval = 30_000; break;
        case '5m': interval = 300_000; break;
        default: interval = 60_000; break;
      }
      setInterval(() => {
        this.ngZone.run(() => {
          this.feedManagerService.refreshCounters();
        });
      }, interval);
    });
    this.feedManagerService.initFeedTree();
  }

  onSelect(feed: ICategory) {
    if (this.isMobile) {
      this.snav.close();
    }
    this._scrollToService.scrollTo({
      target: 'feedtoolbar',
      duration: 0
    });
    this.feedManagerService.selectFeed(feed);
    this.toolbarHeight = this.feedtoolbar._elementRef.nativeElement.offsetHeight;
  }

  catchupFeed() {
    const dialogRef = this.dialog.open(MarkreaddialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.feedManagerService.catchupFeed();
      }
    });
  }

  updateSelected(field: number) {
    this.headlineUpdateEvent.next(field);
  }

  registerHotKeys() {
    this._hotkeysService.hotkeys.length = 1;
    this._hotkeysService.add(new Hotkey('m', (event: KeyboardEvent): boolean => {
      this.feedManagerService.multiselectChanged();
      return false;
    }, undefined, this.translate.instant('TB_Multiselect')));
  }
}
