
import { catchError, tap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { SettingsService } from './settings.service';
import { MessagingService } from './messaging.service';
import { CounterResult } from './model/counter-result';
import { LogMessage } from './model/logmessage';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class TtrssClientService {

  constructor(private http: HttpClient,
    private settings: SettingsService,
    private messages: MessagingService,
    private translate: TranslateService) {
  }

  login(force: boolean): Observable<boolean> {
    if (force || this.settings.sessionKey === null) {
      const body = '{"op":"login","user":"' + this.settings.username + '","password":"' + this.settings.password + '"}';
      const result = this.http.post<ApiResult<any>>(this.settings.url, body);
      return result.pipe(
        map(data => {
          if (data.status !== 0) {
            this.handleError('login', data, false);
          } else {
            return data.content;
          }
        }),
        tap(data => {
          if (data.session_id) {
            this.settings.sessionKey = data.session_id;
            this.messages.log(new LogMessage('INFO', this.translate.instant('Log_Login')), data);
            this.getConfig();
          } else {
            this.handleError('login', data, false);
          }
        }),
        map(data => data.session_id !== undefined),
        catchError(err => this.handleError('login', err, false)
        ));
    }
  }
  checkLoggedIn(): Observable<boolean> {
    const body = '{"op":"getApiLevel","sid":"' + this.settings.sessionKey + '"}';
    const result = this.http.post<ApiResult<any>>(this.settings.url, body);
    return result.pipe(
      map(data => {
        if (data.status !== 0) {
          this.handleError('checkLoggedIn', data, false);
        } else {
          return true;
        }
      }),
      catchError(err => this.handleError('checkLoggedIn', err, false)
      ));
  }

  getConfig() {
    const body = '{"sid":"' + this.settings.sessionKey + '", "op":"getConfig" }';
    const result = this.http.post<ApiResult<any>>(this.settings.url, body);
    return result.pipe(
      map(data => {
        if (data.status !== 0) {
          this.handleError('config', data);
        } else {
          return data.content;
        }
      })).subscribe(
        data => this.settings.icons_url = data.icons_url
      );
  }

  getFeedTree(): Observable<ICategory[]> {
    const body = '{"sid":"' + this.settings.sessionKey + '", '
      + '"op":"getFeedTree", "include_empty":true }';
    const result = this.http.post<ApiResult<IFeedTree>>(this.settings.url, body);
    return result.pipe(
      map(data => {
        if (data.status !== 0) {
          this.handleError('getFeedTree', data, []);
        } else {
          return data.content.categories.items;
        }
      }),
      tap(data => {
        if (data && data.length > 0) {
          this.messages.log(new LogMessage('INFO', this.translate.instant('Log_Feeds')), data);
        }
      }),
      catchError(err => this.handleError('getFeedTree', err, []))
    );
  }

  getHeadlines(feed: ICategory, limit: number, skip: number, view_mode: string, is_cat: boolean): Observable<Headline[]> {
    const body = '{"sid":"' + this.settings.sessionKey + '", "op":"getHeadlines", "feed_id":' + feed.bare_id +
      ', "limit":' + limit + ', "skip":' + skip + ', "is_cat":' + is_cat + ' }';
    const result = this.http.post<ApiResult<Headline[]>>(this.settings.url, body);
    return result.pipe(
      map(data => {
        if (data.status !== 0) {
          this.handleError('getHeadlines', data, []);
        } else {
          return data.content;
        }
      }),
      tap(data => {
        if (data && data.length > 0) {
          this.messages.log(new LogMessage('INFO', this.translate.instant('Log_Headlines')), data);
        }
      }),
      catchError(err => this.handleError('getHeadlines', err, []))
    );
  }

  getFeedIconURL(id: number, is_cat?: boolean) {
    if (is_cat || !id) {
      return 'rss_feed';
    }
    if (id <= 0) {
      let maticon: string;
      switch (id) {
        case 0: maticon = 'archive'; break;
        case -1: maticon = 'grade'; break;
        case -2: maticon = 'language'; break;
        case -3: maticon = 'weekend'; break;
        case -4: maticon = 'folder_open'; break;
        case -6: maticon = 'update'; break;
        default: maticon = 'rss_feed';
      }
      return maticon;
    } else {
      let iconsDir = 'feed-icons';
      if (this.settings.icons_url !== null) {
        iconsDir = this.settings.icons_url;
      }
      return this.settings.url.replace('/api/', '/' + iconsDir + '/') + id + '.ico';
    }
  }

  updateCounters(): Observable<CounterResult[]> {
    const body = '{"sid":"' + this.settings.sessionKey + '", "op":"getCounters", "output_mode":"fc"}';
    return this.http.post<ApiResult<ICounterResult[]>>(this.settings.url, body).pipe(
      map(data => {
        if (data.status !== 0) {
          this.handleError('getCounters', data, []);
        } else {
          return data.content;
        }
      }),
      map(data => data.map(cnt => new CounterResult(cnt))),
      tap(data => {
        if (data && data.length > 0) {
          this.messages.log(new LogMessage('INFO', this.translate.instant('Log_Counters')), data);
        }
      }),
      catchError(err => this.handleError('getCounters', err, []))
    );
  }

  catchupFeed(feed: ICategory, is_cat: boolean): Observable<boolean> {
    const body = '{"sid":"' + this.settings.sessionKey + '", "op":"catchupFeed", "feed_id":"' + feed.bare_id +
      '", "is_cat ": ' + is_cat + ' }';
    const result = this.http.post<ApiResult<UpdateResult>>(this.settings.url, body);
    return result.pipe(
      map(data => {
        if (data.status !== 0) {
          this.handleError('catchupFeed', data, false);
        } else {
          return true;
        }
      }),
      tap(data => {
        if (data) {
          this.messages.log(new LogMessage('INFO', this.translate.instant('Log_Catchup')), data);
        }
      }),
      catchError(err => this.handleError('catchupFeed', err, false))
    );
  }

  getArticle(id: number): Observable<Article> {
    const body = '{"sid":"' + this.settings.sessionKey + '", "op":"getArticle", "article_id":' + id + ' }';
    const result = this.http.post<ApiResult<Article[]>>(this.settings.url, body);
    return result.pipe(
      map(data => {
        if (data.status !== 0 || data.content.length === 0) {
          this.handleError('getArticle', data, null);
        } else {
          return data.content[0];
        }
      }),
      tap(data => {
        if (data !== null) {
          this.messages.log(new LogMessage('INFO', this.translate.instant('Log_Article')), data);
        }
      }),
      catchError(err => this.handleError('getArticle', err, null))
    );
  }

  /**
   * @param field field to operate on (0 - starred, 1 - published, 2 - unread, 3 - article note)
   * @param mode type of operation to perform (0 - set to false, 1 - set to true, 2 - toggle)
   */
  updateArticle(head: Headline | Headline[], field: number, mode: number): Observable<boolean> {
    let ids;
    if (head instanceof Array) {
      ids = head.map(headline => headline.id + '').join(',');
    } else {
      ids = head.id;
    }
    const body = '{"sid":"' + this.settings.sessionKey + '", "op":"updateArticle", "article_ids":"' + ids + '", "mode": ' + mode +
      ', "field": ' + field + ' }';
    const result = this.http.post<ApiResult<UpdateResult>>(this.settings.url, body);
    return result.pipe(
      map(data => {
        if (data.status !== 0) {
          this.handleError('updateArticle', data, false);
        } else {
          return data.content.updated >= 1;
        }
      }),
      tap(data => { if (data) { this.messages.log(new LogMessage('INFO', this.translate.instant('Log_Article_Update')), data); } }),
      catchError(err => this.handleError('updateArticle', err, false))
    );
  }

  /**
  * Handle Http operation that failed.
  * Let the app continue.
  * @param operation - name of the operation that failed
  * @param result - optional value to return as the observable result
  */
  private handleError<T>(operation = 'operation', error: any, result?: T) {
    this.messages.log(new LogMessage('ERROR', this.translate.instant('Log_Request_Failed') + operation), error);
    return of(result as T);
  }
}
