import { Component, OnInit } from '@angular/core';
import { MessagingService } from '../messaging.service';
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component({
  selector: 'ttrss-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})
export class MessagingComponent implements OnInit {

  msgService: MessagingService;
  loaderService: LoadingBarService

  constructor(private messageService: MessagingService, private loader: LoadingBarService) {
    this.msgService = messageService;
    this.loaderService = loader;
  }

  ngOnInit() {
  }

}
