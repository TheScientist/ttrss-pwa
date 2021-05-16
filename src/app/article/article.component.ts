import { Component, OnInit, Input, SimpleChanges, SimpleChange, ElementRef, OnChanges } from '@angular/core';
import { TtrssClientService } from '../ttrss-client.service';
import { trigger, transition, animate, keyframes } from '@angular/animations';
import * as kf from './keyframes';
import { FeedManagerService } from '../feed-manager.service';
import { Headline } from '../model/headline';

@Component({
  selector: 'ttrss-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent {

  @Input() article: Headline;
  @Input() selected: boolean;
  @Input() multiSelectEnabled: boolean;

  animationState: string;
  feedManagerService: FeedManagerService;

  constructor(feedManagerService: FeedManagerService) {
    this.feedManagerService = feedManagerService;
  }

  showFeedIcons() {
    return this.feedManagerService.selectedFeed.bare_id < 0 || this.feedManagerService.selectedFeed.type === 'category';
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
