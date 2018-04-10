import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { TtrssClientService } from '../ttrss-client.service';
import { Category } from '../model/category';
import { SwiperComponent } from 'ngx-swiper-wrapper';
import { MatButtonToggle, MatDialog, MatToolbar, MatSidenav } from '@angular/material';
import { MarkreaddialogComponent } from '../markreaddialog/markreaddialog.component';
import { Subscription } from 'rxjs/Subscription';
import { ObservableMedia, MediaChange } from '@angular/flex-layout';

@Component({
  selector: 'ttrss-headlines',
  templateUrl: './headlines.component.html',
  styleUrls: ['./headlines.component.css']
})
export class HeadlinesComponent {

  // @ViewChild('feedtoolbar') feedtoolbarref: MatToolbar;
  // @ViewChild('fullWidth') fullWidthRef: ElementRef;
  // toolbarHeight: number = 0;
  // fullWidth: number = 0;
  // watcher: Subscription;
  // activeMediaQuery = "";
  // isMobile: boolean = false;

  // @Input() feed: Feed | Category;

  // is_cat: boolean = false;
  // multiSelectEnabled: boolean = false;
  // headlines: Headline[] = [];
  // multiSelectedHeadlines: Headline[] = [];
  // selectedHeadline: Headline;
  // fetch_more: boolean = true;
  // constructor(media: ObservableMedia, public dialog: MatDialog, private client: TtrssClientService) {
  //   this.watcher = media.subscribe((change: MediaChange) => {
  //     this.activeMediaQuery = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : "";
  //     if (change.mqAlias == 'sm' || change.mqAlias == 'xs') {
  //       this.isMobile = true;
  //     } else {
  //       this.isMobile = false;
  //     }
  //     if (this.feedtoolbarref) {
  //       this.toolbarHeight = this.feedtoolbarref._elementRef.nativeElement.offsetHeight;
  //     }
  //   });
  // }

  // ngOnInit() { }

  // ngAfterViewInit() {
  //   this.toolbarHeight = this.feedtoolbarref._elementRef.nativeElement.offsetHeight;
  //   this.fullWidth = this.fullWidthRef.nativeElement.offsetWidth;
  // }

  // ngOnChanges(changes: SimpleChanges) {
  //   const feed: SimpleChange = changes.feed;
  //   if (!feed.currentValue) {
  //     return;
  //   }
  //   this.feed = feed.currentValue;
  //   this.is_cat = this.feed instanceof Category;
  //   this.client.getHeadlines(this.feed, 20, 0, null, this.is_cat)
  //     .subscribe(data =>
  //       this.headlines = data);
  // }

  // loadHeadlines() {
  //   if (this.fetch_more) {
  //     // probably we need more logic here.
  //     this.client.getHeadlines(this.feed, 20, this.headlines.length, null, this.is_cat)
  //       .subscribe(data => {
  //         if (data.length === 0) {
  //           this.fetch_more = false;
  //         } else {
  //           this.headlines.push(...data)
  //         }
  //       });
  //   }
  // }

  // onSelect(headline: Headline) {
  //   if (!this.multiSelectEnabled) {
  //     if (headline !== this.selectedHeadline) {
  //       this.selectedHeadline = headline;
  //       if (!headline.content) {
  //         this.client.getArticle(headline.id).subscribe(article => headline.content = article.content);
  //       }
  //       if (headline.unread) {
  //         this.client.updateArticle(headline, 2, 0).subscribe(result => headline.unread = !result);
  //       }
  //     } else {
  //       this.selectedHeadline = null;
  //     }
  //   } else {
  //     var index = this.multiSelectedHeadlines.indexOf(headline);
  //     if (index < 0) {
  //       this.multiSelectedHeadlines.push(headline);
  //     } else {
  //       this.multiSelectedHeadlines.splice(index, 1);
  //     }
  //   }
  // }

  // updateSelected(field: number, mode: number) {
  //   // handle mark all read state
  //   if (field == 2 &&
  //     (!this.selectedHeadline || this.selectedHeadline === null) &&
  //     (this.multiSelectedHeadlines === null || this.multiSelectedHeadlines.length === 0)) {

  //     let dialogRef = this.dialog.open(MarkreaddialogComponent);
  //     dialogRef.afterClosed().subscribe(result => {
  //       if (result) {
  //         this.client.catchupFeed(this.feed, this.is_cat).subscribe(result => {
  //           if (result) {
  //             this.headlines.forEach(head => head.unread = false);
  //           }
  //         });
  //       }
  //     });
  //     return;
  //   }

  //   if (this.multiSelectEnabled) {
  //     if (this.multiSelectedHeadlines.length === 0) {
  //       return;
  //     }
  //     this.client.updateArticle(this.multiSelectedHeadlines, field, mode).subscribe(result => {
  //       if (result) {
  //         switch (field) {
  //           case 0: this.multiSelectedHeadlines.forEach(head => head.marked = !head.marked);
  //             break;
  //           case 2: this.multiSelectedHeadlines.forEach(head => head.unread = !head.unread);
  //             break;
  //         }
  //       }
  //     });
  //   } else {
  //     this.client.updateArticle(this.selectedHeadline, field, mode).subscribe(result => {
  //       if (result) {
  //         switch (field) {
  //           case 0: this.selectedHeadline.marked = !this.selectedHeadline.marked;
  //             break;
  //           case 2: this.selectedHeadline.unread = !this.selectedHeadline.unread;
  //             break;
  //         }
  //       }
  //     });
  //   }
  // }

  // multiselectChanged(checked: boolean) {
  //   this.multiSelectEnabled = checked;
  //   if (this.multiSelectEnabled) {
  //     this.selectedHeadline = null;
  //   } else {
  //     this.multiSelectedHeadlines.length = 0;
  //   }
  // }
}
