import { Component, OnInit, Input, ViewChild, SimpleChanges, SimpleChange, ElementRef, OnChanges } from '@angular/core';
import { TtrssClientService } from '../ttrss-client.service';
import { trigger, transition, animate, keyframes } from '@angular/animations';
import * as kf from './keyframes';

@Component({
  selector: 'ttrss-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

  @Input() article: Headline;
  @Input() selected: boolean;
  @Input() feed: ICategory;
  @Input() multiSelectEnabled: boolean;

  animationState: string;

  constructor(private client: TtrssClientService, private artElement: ElementRef) { }

  ngOnInit() {
  }

  showFeedIcons() {
    return this.feed.bare_id < 0 || this.feed.type === 'category';
  }

  startAnimation(state) {
    console.log(state);
    if (!this.animationState) {
      this.animationState = state;
    }
  }

  resetAnimationState() {
    this.animationState = '';
  }

}
