import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { SettingsService } from './settings.service';
import { MessagingService } from './messaging.service';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Category } from './model/category';

@Injectable()
export class TtrssClientService {

  constructor(private http: HttpClient, private settings: SettingsService, private messages: MessagingService) {
  }

  login(force: boolean): Observable<boolean> {
    if (force || this.settings.sessionKey === null) {
      let body = '{"op":"login","user":"' + this.settings.username + '","password":"' + this.settings.password + '"}';
      let result = this.http.post<ApiResult<any>>(this.settings.url, body);
      return result
        .map(data => {
          if (data.status != 0) {
            this.handleError('login', data, false)
          } else {
            return data.content;
          }
        })
        .do(data => {
          if (data.session_id) {
            this.settings.sessionKey = data.session_id;
            this.messages.log("login successful", data, true);
            this.getConfig();
          } else {
            this.handleError('login', data, false);
          }
        })
        .map(data => data.session_id !== undefined)
        .catch(err => this.handleError('login', err, false)
        );
    }
  }

  getConfig() {
    let body = '{"sid":"' + this.settings.sessionKey + '", "op":"getConfig" }';
    let result = this.http.post<ApiResult<any>>(this.settings.url, body);
    return result
      .map(data => {
        if (data.status != 0) {
          this.handleError('config', data)
        } else {
          return data.content;
        }
      }).subscribe(
        data => this.settings.icons_url = data.icons_url
      );
  }

  getAllFeeds(): Observable<Feed[]> {
    let body = '{"sid":"' + this.settings.sessionKey + '", "op":"getFeeds", "cat_id":-4 }';
    let result = this.http.post<ApiResult<Feed[]>>(this.settings.url, body);
    return result
      .map(data => {
        if (data.status != 0) {
          this.handleError('getAllFeeds', data, [])
        } else {
          return data.content;
        }
      })
      .do(data => {if(data && data.length>0) this.messages.log("got feeds", data, true)})
      .catch(err => this.handleError('getAllFeeds', err, []));
  }

  getCategories(): Observable<Category[]> {
    let body = '{"sid":"' + this.settings.sessionKey + '", '
      + '"op":"getCategories", "unread_only":false, "enable_nested":false, "include_empty":true }';
    let result = this.http.post<ApiResult<ICategory[]>>(this.settings.url, body);
    return result
      .map(data => {
        if (data.status != 0) {
          this.handleError('getCategories', data, [])
        } else {
          return data.content;
        }
      })
      .do(data => {
        if(data && data.length>0) 
          this.messages.log("got categories", data, true);
      })
      .map(data => data.map(cat => new Category(cat)))
      .map(data => data.filter(cat => cat.id >= -1).sort((a, b) => a.order_id - b.order_id))
      .catch(err => this.handleError('getCategories', err, []));
  }

  getHeadlines(feed: Feed | Category, limit: number, skip: number, view_mode: string, is_cat: boolean): Observable<Headline[]> {
    let body = '{"sid":"' + this.settings.sessionKey + '", "op":"getHeadlines", "feed_id":' + feed.id +
      ', "limit":' + limit + ', "skip":' + skip + ', "is_cat":' + is_cat + ' }';
    let result = this.http.post<ApiResult<Headline[]>>(this.settings.url, body);
    return result
      .map(data => {
        if (data.status != 0) {
          this.handleError('getHeadlines', data, [])
        } else {
          return data.content;
        }
      })
      .do(data => {if(data && data.length>0) this.messages.log("got headlines", data, true)})
      .catch(err => this.handleError('getHeadlines', err, []));
  }

  getFeedIconURL(id: number, is_cat?: boolean) {
    if (is_cat) {
      return "rss_feed";
    }
    if (id <= 0) {
      let maticon: string;
      switch (id) {
        case 0: maticon = "archive"; break;
        case -1: maticon = "grade"; break;
        case -2: maticon = "language"; break;
        case -3: maticon = "weekend"; break;
        case -4: maticon = "folder_open"; break;
        case -6: maticon = "update"; break;
        default: maticon = "rss_feed";
      }
      return maticon;
    } else {
      let iconsDir = "feed-icons";
      if (this.settings.icons_url !== null) {
        iconsDir = this.settings.icons_url;
      }
      return this.settings.url.replace("/api/", "/" + iconsDir + "/") + id + ".ico";
    }
  }

  catchupFeed(feed: Feed | Category, is_cat: boolean): Observable<boolean> {
    let body = '{"sid":"' + this.settings.sessionKey + '", "op":"catchupFeed", "feed_id":"' + feed.id + '", "is_cat ": ' + is_cat + ' }';
    let result = this.http.post<ApiResult<UpdateResult>>(this.settings.url, body);
    return result
      .map(data => {
        if (data.status != 0) {
          this.handleError('catchupFeed', data, false)
        } else {
          return true;
        }
      })
      .do(data => {if(data) this.messages.log("catchupFeed sucessfull", data, true);})
      .catch(err => this.handleError('catchupFeed', err, false));
  }

  getArticle(id: number): Observable<Article> {
    let body = '{"sid":"' + this.settings.sessionKey + '", "op":"getArticle", "article_id":' + id + ' }';
    let result = this.http.post<ApiResult<Article[]>>(this.settings.url, body);
    return result
      .map(data => {
        if (data.status != 0 || data.content.length === 0) {
          this.handleError('getArticle', data, null)
        } else {
          return data.content[0];
        }
      })
      .do(data => {if(data!==null) this.messages.log("got article", data, true)})
      .catch(err => this.handleError('getArticle', err, null));
  }

  /** 
   * @param field field to operate on (0 - starred, 1 - published, 2 - unread, 3 - article note)
   * @param mode type of operation to perform (0 - set to false, 1 - set to true, 2 - toggle)
   */
  updateArticle(head: Headline|Headline[], field: number, mode: number): Observable<boolean> {
    let ids;
    if(head instanceof Array) {
      ids = head.map(head=>head.id+"").join(",");
    } else {
      ids = head.id;
    }
    let body = '{"sid":"' + this.settings.sessionKey + '", "op":"updateArticle", "article_ids":"' + ids + '", "mode": ' + mode +
      ', "field": ' + field + ' }';
    let result = this.http.post<ApiResult<UpdateResult>>(this.settings.url, body);
    return result
      .map(data => {
        if (data.status != 0) {
          this.handleError('updateArticle', data, false)
        } else {
          return data.content.updated >= 1;
        }
      })
      .do(data => {if(data) this.messages.log("article updated sucessfully", data, true);})
      .catch(err => this.handleError('updateArticle', err, false));
  }

  /**
  * Handle Http operation that failed.
  * Let the app continue.
  * @param operation - name of the operation that failed
  * @param result - optional value to return as the observable result
  */
  private handleError<T>(operation = 'operation', error: any, result?: T) {
    this.messages.log(operation + " failed", error, true)
    return of(result as T);
  }
}
