import { Injectable } from '@angular/core';
import { LocalStorage } from 'ngx-webstorage';
import { SessionStorage } from 'ngx-webstorage';
import { Language } from './model/language';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class SettingsService {

  constructor() { }
  public locales: Language[] = [{ key: 'en', name: 'English' }, { key: 'de', name: 'Deutsch' }];
  @LocalStorage()
  public url: string;
  @LocalStorage()
  public locale: string;
  @LocalStorage()
  public username: string;
  @LocalStorage()
  public _password: string;
  @SessionStorage()
  public sessionKey: string;
  @LocalStorage()
  public icons_url: string;
  @LocalStorage()
  public lastFeedId: number;
  @LocalStorage()
  public lastSelectionIsCat: boolean;

  getLanguage(): string {
    if (this.locale === null) {
      return 'de';
    } else {
      return this.locale;
    }
  }

  get password(): string {
    if (this._password === null) {
      return null;
    }
    const bytes = CryptoJS.AES.decrypt(this._password, 'notsosecretseed_itsopensourced');
    const out = bytes.toString(CryptoJS.enc.Utf8);
    return out;
  }
  set password(newValue: string) {
    const encrypted = CryptoJS.AES.encrypt(newValue, 'notsosecretseed_itsopensourced').toString();
    this._password = encrypted;
  }
}
