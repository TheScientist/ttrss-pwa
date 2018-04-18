import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../settings.service';
import { LocalStorage } from 'ngx-webstorage';
import { TtrssClientService } from '../ttrss-client.service';
import { MessagingService } from '../messaging.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ttrss-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private settings: SettingsService,
    private client: TtrssClientService,
    private msgs: MessagingService,
    private translate: TranslateService) { }

  ngOnInit() {
  }

  testConnection() {
    this.client.login(true).toPromise();
  }
  onLocaleChange(event) {
    this.translate.use(event.value);
  }
}
