import { Component, OnInit, Input } from '@angular/core';
import { Headline } from '../model/headline';

@Component({
  selector: 'ttrss-article-content',
  templateUrl: './article-content.component.html',
  styleUrls: ['./article-content.component.css']
})
export class ArticleContentComponent implements OnInit {

  @Input() article: Headline;

  constructor() { }

  ngOnInit() {
  }

}
