import { Component, OnInit } from '@angular/core';
import { SettingsService } from './settings.service';
import { TtrssClientService } from './ttrss-client.service';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { LangChangeEvent } from '@ngx-translate/core';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'ttrss-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isDarkTheme: boolean;
  constructor(private translate: TranslateService, private settings: SettingsService,
    private titleService: Title, private overlayContainer: OverlayContainer) { }

  ngOnInit() {
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('en');
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translate.get('App_Title').subscribe((res: string) => {
        this.titleService.setTitle(res);
      });
    });
    this.applyTheme();
    this.translate.use(this.settings.getLanguage());
    this.settings.darkDesign$.subscribe(() => {
      this.applyTheme();
    });
  }

  applyTheme() {
    this.isDarkTheme = this.settings.darkDesign;
    const newThemeClass = this.isDarkTheme ? 'ttrss-dark-theme' : 'ttrss-light-theme';

    const overlayContainerClasses = this.overlayContainer.getContainerElement().classList;
    const themeClassesToRemove = Array.from(overlayContainerClasses).filter((item: string) => item.includes('-theme'));
    if (themeClassesToRemove.length) {
       overlayContainerClasses.remove(...themeClassesToRemove);
    }
    overlayContainerClasses.add(newThemeClass);
  }
}
