import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { trigger, style, keyframes, transition, animate, query, stagger } from '@angular/animations';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { TtrssClientService } from '../ttrss-client.service';
import { Observable } from 'rxjs';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { TranslateService } from '@ngx-translate/core';
import { UpdateCounterEvent } from '../util/update-counter-event';
import { SettingsService } from '../settings.service';
import { NgNavigatorShareService } from 'ng-navigator-share';
import { MessagingService } from '../messaging.service';
import { LogMessage } from '../model/logmessage';

@Component({
  selector: 'ttrss-listview',
  templateUrl: './listview.component.html',
  styleUrls: ['./listview.component.scss'],
  animations: [
    trigger('slideLeft', [
      transition('* => *', animate(100, keyframes([
        style({ left: '*', offset: 0 }),
        style({ left: '0', offset: 1 }),
      ])
      ))
    ])
  ]
})
export class ListviewComponent implements OnInit, OnDestroy {

  @Input() selectedFeed: ICategory;
  @Input() headlines: Headline[];
  @Input() is_cat: Boolean;
  @Input() fetch_more = true;
  @Input() updateHeadlinesEvents: Observable<number>;
  @Input() toolbarHeight: number;
  @Input() multiSelectChangedEvent: Observable<void>;
  @Input() scrollContainer: HTMLElement;
  multiSelectEnabled = false;

  @Output() counterChanged = new EventEmitter<UpdateCounterEvent>();

  multiSelectedHeadlines: Headline[] = [];
  selectedHeadline: Headline;

  slideThreshold: number;
  swipedHead: Headline = null;
  swipedIdx = -1;
  elementLeftSign: Boolean;

  private eventsSubscription: any;
  private multiSelectEventSubscription: any;
  private ngNavigatorShareService: NgNavigatorShareService;


  constructor(private _scrollToService: ScrollToService, private client: TtrssClientService,
    private translate: TranslateService, private _hotkeysService: HotkeysService,
    private settings: SettingsService, ngNavigatorShareService: NgNavigatorShareService,
    private messageService: MessagingService) {

    this.registerHotKeys();
    this.ngNavigatorShareService = ngNavigatorShareService;
  }

  ngOnInit() {
    this.slideThreshold = 30;
    this.eventsSubscription = this.updateHeadlinesEvents.subscribe((field) => {
      if (field < 0) {
        this.updateArticle(this.headlines.slice(0, -field).filter(h => h.unread), 2, 0);
      } else {
        this.updateSelected(field);
      }
    });
    this.multiSelectEventSubscription = this.multiSelectChangedEvent.subscribe(() => {
      this.multiSelectEnabled = !this.multiSelectEnabled;
      if (this.multiSelectEnabled) {
        this.selectedHeadline = null;
      } else {
        this.multiSelectedHeadlines = [];
      }
    });
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
    this.multiSelectEventSubscription.unsubscribe();
  }

  updateSelected(field: number) {
    if (this.multiSelectEnabled) {
      this.updateArticle(this.multiSelectedHeadlines, field, 2);
    } else {
      let mode = 2;
      switch (field) {
        case 0:
          mode = this.selectedHeadline.marked ? 0 : 1;
          break;
        case 1:
          mode = this.selectedHeadline.published ? 0 : 1;
          break;
        case 2:
          mode = this.selectedHeadline.unread ? 0 : 1;
          break;
      }

      this.updateArticle(new Array(this.selectedHeadline), field, mode);
    }
  }

  onArticleSelect(headline: Headline) {
    if (this.swipedHead != null) {
      return;
    }
    if (!this.multiSelectEnabled) {
      if (headline !== this.selectedHeadline) {
        this.selectedHeadline = null;
        if (!headline.content) {
          this.client.getArticle(headline.id).subscribe(article => headline.content = article.content);
        }

        this.selectedHeadline = headline;
        if (headline.unread) {
          this.updateSelected(2);
        }
        const config: ScrollToConfigOptions = {
          target: 'article' + headline.id,
          offset: -this.toolbarHeight,
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

  openArticleLink(head: Headline, foreground: boolean) {
    window.open(head.link, '_blank');
    if (!foreground) {
      self.focus();
    }
    if (head === this.selectedHeadline) {
      this.selectedHeadline = null;
    }
  }

  shareSelected() {
    this.ngNavigatorShareService.share({
      title: this.selectedHeadline.title,
      url: this.selectedHeadline.link
    }).then((response) => {
      this.messageService.log(new LogMessage('INFO', this.translate.instant('TB_Share_Success')), response);
    })
      .catch((error) => {
        this.messageService.log(new LogMessage('ERROR', this.translate.instant('TB_Share_Error') + ' ' + error.error), error);
      });
  }

  private updateArticle(heads: Headline[], field: number, mode: number) {
    const feedOrCat = this.selectedFeed;
    const isCat = this.is_cat;
    if (heads.length === 0) {
      return;
    }
    this.client.updateArticle(heads, field, mode).subscribe(result => {
      if (result) {
        switch (field) {
          case 0:
            let amount = 0;
            heads.forEach(head => {
              switch (mode) {
                case 0:
                  if (head.marked) {
                    head.marked = false;
                    amount--;
                  }
                  break;
                case 1:
                  if (!head.marked) {
                    head.marked = true;
                    amount++;
                  }
                  break;
                default:
                  head.marked = !head.marked;
                  head.marked ? amount++ : amount--;
                  break;
              }
            });
            this.counterChanged.next(new UpdateCounterEvent(0, amount, 0, false));
            break;
          case 1:
            let published = 0;
            heads.forEach(head => {
              switch (mode) {
                case 0:
                  if (head.published) {
                    head.published = false;
                    published--;
                  }
                  break;
                case 1:
                  if (!head.published) {
                    head.published = true;
                    published++;
                  }
                  break;
                default:
                  head.published = !head.published;
                  head.published ? published++ : published--;
                  break;
              }
            });
            this.counterChanged.next(new UpdateCounterEvent(1, published, 1, false));
            break;
          case 2:
            let change = 0;
            heads.forEach(head => {
              switch (mode) {
                case 0:
                  if (head.unread) {
                    head.unread = false;
                    change--;
                  }
                  break;
                case 1:
                  if (!head.unread) {
                    head.unread = true;
                    change++;
                  }
                  break;
                default:
                  head.unread = !head.unread;
                  head.unread ? change++ : change--;
                  break;
              }
            });
            this.counterChanged.next(new UpdateCounterEvent(2, change, feedOrCat.bare_id, isCat.valueOf()));
            break;
        }
      }
    });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  panend(action, head: Headline, elementRefrence): void {
    const currentMargin = this.getLeftPosition(elementRefrence);
    if (currentMargin > this.slideThreshold || currentMargin < - this.slideThreshold) {
      this.swipeAction(head);
    }
    this.swipedHead = head;
  }
  panmove(action, idx, elementRefrence): void {
    this.swipedIdx = idx;
    elementRefrence.style.left = action.deltaX + 'px';
    elementRefrence.offsetLeft > 0 ? this.elementLeftSign = true : this.elementLeftSign = false;
  }
  alignComplete(event): void {
    event.element.style.left = '0px';
    this.swipedHead = null;
    this.elementLeftSign = null;
    this.swipedIdx = -1;
  }

  isLeftSwipe(idx: number) {
    return idx === this.swipedIdx && this.elementLeftSign != null && this.elementLeftSign.valueOf();
  }
  isRightSwipe(idx: number) {
    return idx === this.swipedIdx && this.elementLeftSign != null && !this.elementLeftSign.valueOf();
  }
  swipeAction(head: Headline): void {
    let field = 2;
    if (this.elementLeftSign) {
      field = 0;
    }
    this.updateArticle([head], field, 2);
  }
  getLeftPosition(elementRefrence): number {
    const currentleftPosition = elementRefrence.style.left.slice(0, -2);
    if (currentleftPosition !== null) {
      return (parseInt(
        currentleftPosition, 10
      ) * 100) / window.innerWidth;
    } else {
      return 0;
    }
  }

  inview(event) {
    if (this.settings.markReadOnScroll && !this.multiSelectEnabled) {
      let idx = 0;
      if (this.fetch_more && event.isClipped && !event.parts.top) {
        idx = this.headlines.indexOf(event.data) + 3;
      } else if (!this.fetch_more && event.status && this.headlines.indexOf(event.data) === this.headlines.length - 1) {
        idx = this.headlines.length;
      }
      if (idx > 0) {
        this.updateArticle(this.headlines.slice(0, idx).filter(h => h.unread), 2, 0);
      }
    }
  }

  registerHotKeys() {
    this._hotkeysService.hotkeys.length = 1;
    this._hotkeysService.add(new Hotkey('n', (event: KeyboardEvent): boolean => {
      let current = -1;
      if (this.selectedHeadline != null) {
        current = this.headlines.indexOf(this.selectedHeadline);
      }
      ++current;
      if (this.headlines.length > current) {
        this.onArticleSelect(this.headlines[current]);
      }
      return false;
    }, undefined, this.translate.instant('Shortcut_Next_Article')));

    this._hotkeysService.add(new Hotkey('p', (event: KeyboardEvent): boolean => {
      let current = this.headlines.length;
      if (this.selectedHeadline != null) {
        current = this.headlines.indexOf(this.selectedHeadline);
      }
      current--;
      if (current >= 0) {
        this.onArticleSelect(this.headlines[current]);
      }
      return false;
    }, undefined, this.translate.instant('Shortcut_Previous_Article')));

    this._hotkeysService.add(new Hotkey('s', (event: KeyboardEvent): boolean => {
      if (this.selectedHeadline != null || this.multiSelectedHeadlines.length > 0) {
        this.updateSelected(0);
      }
      return false;
    }, undefined, this.translate.instant('TB_ToggleStar')));

    this._hotkeysService.add(new Hotkey('S', (event: KeyboardEvent): boolean => {
      if (this.selectedHeadline != null || this.multiSelectedHeadlines.length > 0) {
        this.updateSelected(1);
      }
      return false;
    }, undefined, this.translate.instant('TB_TogglePublish')));

    this._hotkeysService.add(new Hotkey('u', (event: KeyboardEvent): boolean => {
      if (this.selectedHeadline != null || this.multiSelectedHeadlines.length > 0) {
        this.updateSelected(2);
      }
      return false;
    }, undefined, this.translate.instant('TB_ToggleRead')));

    this._hotkeysService.add(new Hotkey('t', (event: KeyboardEvent): boolean => {
      if (this.selectedHeadline != null) {
        this.shareSelected();
      }
      return false;
    }, undefined, this.translate.instant('TB_Share')));

    this._hotkeysService.add(new Hotkey('v', (event: KeyboardEvent): boolean => {
      if (this.selectedHeadline != null) {
        this.openArticleLink(this.selectedHeadline, true);
      }
      return false;
    }, undefined, this.translate.instant('Open_Article')));

    this._hotkeysService.add(new Hotkey('q', (event: KeyboardEvent): boolean => {
      if (this.selectedHeadline != null) {
        this.selectedHeadline = null;
      }
      return false;
    }, undefined, this.translate.instant('Shortcut_Close_Article')));
  }

}
