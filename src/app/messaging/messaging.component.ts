import { Component, OnInit } from '@angular/core';
import { MessagingService } from '../messaging.service';

@Component({
  selector: 'ttrss-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})
export class MessagingComponent implements OnInit {

  msgService: MessagingService;

  constructor(private messageService: MessagingService) { 
    this.msgService = messageService;
  }

  ngOnInit() {
  }

}
