import { Component, OnInit } from '@angular/core';
import { SettingsService } from './settings.service';
import { TtrssClientService } from './ttrss-client.service';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'ttrss-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private translate: TranslateService, private settings: SettingsService, private titleService: Title) { }

  ngOnInit() {
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('en');
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translate.get('title').subscribe((res: string) => {
        this.titleService.setTitle(res);
      });
    });
    // the lang to use, if the lang isn't available, it will use the current loader to get them   
    this.translate.use(this.settings.getLanguage());
  }
}
