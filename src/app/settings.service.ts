import { Injectable } from '@angular/core';
import { LocalStorage } from 'ngx-webstorage';
import { SessionStorage } from 'ngx-webstorage';
import { SettingsEnum as SettingsEnum } from './model/seetings-enum';
import * as CryptoJS from 'crypto-js';
import { Subject } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable()
export class SettingsService {

  constructor() { }
  public locales: SettingsEnum[] = [{ key: 'en', name: 'English' }, { key: 'de', name: 'Deutsch' }, { key: 'zh', name: 'Chinese' }];
  public counterOptions: SettingsEnum[] = [
    { key: 'always', name: 'Always' },
    { key: '30s', name: 'Every 30s' },
    { key: '5m', name: 'Every 5m' }
  ];
  @LocalStorage()
  public url: string;
  @LocalStorage()
  public locale: string;
  @LocalStorage()
  public counterUpdate: string;
  @LocalStorage()
  public username: string;
  @LocalStorage()
  private _password: string;
  @SessionStorage()
  public sessionKey: string;
  @LocalStorage()
  public icons_url: string;
  @LocalStorage()
  public lastFeedId: number;
  @LocalStorage()
  public lastSelectionIsCat: boolean;
  @LocalStorage()
  public markReadOnScroll: boolean;
  @LocalStorage()
  public loadEmptyCategories: boolean;
  @LocalStorage()
  private _darkDesign: boolean;

  private designSource = new Subject<void>();
  public darkDesign$ = this.designSource.asObservable();

  getLanguage(): string {
    if (this.locale === null) {
      return 'de';
    } else {
      return this.locale;
    }
  }

  getCounterUpdate(): string {
    if (this.counterUpdate === null) {
      return 'always';
    } else {
      return this.counterUpdate;
    }
  }

  get password(): string {
    if (this._password === null) {
      return null;
    }
    const bytes = CryptoJS.AES.decrypt(this._password, environment.password_seed);
    const out = bytes.toString(CryptoJS.enc.Utf8);
    return out;
  }
  set password(newValue: string) {
    const encrypted = CryptoJS.AES.encrypt(newValue, environment.password_seed).toString();
    this._password = encrypted;
  }

  get darkDesign(): boolean {
    return this._darkDesign;
  }
  set darkDesign(newValue: boolean) {
    this._darkDesign = newValue;
    this.designSource.next();
  }
}
