import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ttrss-article-content',
  templateUrl: './article-content.component.html',
  styleUrls: ['./article-content.component.scss']
})
export class ArticleContentComponent implements OnInit {

  @Input() article: Headline;

  constructor() { }

  ngOnInit() {
  }

}
