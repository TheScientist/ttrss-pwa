import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgxWebstorageModule } from 'ngx-webstorage';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material/material.module';

import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import { SettingsComponent } from './settings/settings.component';
import { SettingsGuard } from './settings-guard.service';
import { SettingsService } from './settings.service';
import { TtrssClientService } from './ttrss-client.service';
import { MessagingService } from './messaging.service';
import { MessagingComponent } from './messaging/messaging.component';
import { OverviewComponent } from './overview/overview.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CounterFilterPipe } from './util/counter-filter-pipe';
import { DateFixPipe } from './util/datefix-pipe';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeEn from '@angular/common/locales/en';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { ArticleComponent } from './article/article.component';
import { MarkreaddialogComponent } from './markreaddialog/markreaddialog.component';
import { ArticleContentComponent } from './article-content/article-content.component';
import { NgInviewModule } from 'angular-inport';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HotkeyModule } from 'angular2-hotkeys';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { ListviewComponent } from './listview/listview.component';
import { Directionality } from '@angular/cdk/bidi';

registerLocaleData(localeDe, 'de');
registerLocaleData(localeEn, 'en');

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/');
}

export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any>{
    'pan': { direction: 6 },
    'pinch': { enable: false },
    'rotate': { enable: false }
  };
}

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    MessagingComponent,
    OverviewComponent,
    CounterFilterPipe,
    DateFixPipe,
    ArticleComponent,
    MarkreaddialogComponent,
    ArticleContentComponent,
    ListviewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    InfiniteScrollModule,
    NgxWebstorageModule.forRoot(),
    MaterialModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ScrollToModule.forRoot(),
    FlexLayoutModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgInviewModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    HotkeyModule.forRoot(),
    LoadingBarHttpClientModule
  ],
  entryComponents: [AppComponent, MarkreaddialogComponent],
  providers: [MediaMatcher, SettingsGuard, SettingsService, TtrssClientService, MessagingService,
    {
      provide: LOCALE_ID,
      deps: [SettingsService],
      useFactory: (settings) => settings.getLanguage()
    },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
