import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable()
export class MessagingService {

  public uimessages: string[] = [];

  constructor() { }

  log(message: string, arg: any, ui: boolean): void {
    console.log(message, arg);
    this.appendToUI(message, ui);
  }
  warn(message: string, arg: any, ui: boolean): void {
    console.warn(message, arg);
    this.appendToUI(message, ui);
  }
  error(message: string, arg: any, ui: boolean): void {
    console.error(message, arg);
    this.appendToUI(message, ui);
  }

  private appendToUI(message: string, ui: boolean): void {
    if (!ui) {
      return;
    }
    if (this.uimessages.length > 4) {
      this.uimessages.pop();
    }
    this.uimessages.unshift(message);
  }
}
