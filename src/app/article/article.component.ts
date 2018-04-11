import { Component, OnInit, Input, ViewChild, SimpleChanges, SimpleChange, ElementRef } from '@angular/core';
import { SwiperComponent } from 'ngx-swiper-wrapper';
import { TtrssClientService } from '../ttrss-client.service';

@Component({
  selector: 'ttrss-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

  @Input() article: Headline;
  @Input() selected: boolean;
  @Input() feed: Feed;
  @Input() multiSelectEnabled: boolean;
  @ViewChild(SwiperComponent) componentRef: SwiperComponent;

  swipeInProgress: boolean = false;
  swipeAction: number = 1;
  constructor(private client: TtrssClientService, private artElement: ElementRef) {}

  ngOnInit() {
  }

  elementSwiped(index: number) {
    this.swipeAction = index;
    // fast swipe
    if (index !== 1 && !this.swipeInProgress) {
      this.componentRef.directiveRef.setIndex(1);
    }
  }
  swipeFinished() {
    this.swipeInProgress = false;
    // slow swipe
    let action = this.swipeAction;
    if (action !== 1) {
      if(action==0) {
        this.client.updateArticle(this.article, 2, 2).subscribe(result => {
          if(result) {
            this.article.unread = !this.article.unread;
          }
        });
      } else {
        this.client.updateArticle(this.article, 0, 2).subscribe(result => {
          if(result) {
            this.article.marked = !this.article.marked;
          }
        });
      }
      this.componentRef.directiveRef.setIndex(1);
    }
  }
  swipeStarted() {
    this.swipeInProgress = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    const multiSelectEnabled: SimpleChange = changes.multiSelectEnabled;
    if (multiSelectEnabled !== undefined) {
      this.multiSelectEnabled = multiSelectEnabled.currentValue;
      if (this.componentRef !== undefined) {
        this.componentRef.directiveRef.update();
      }
    }
  }
}
