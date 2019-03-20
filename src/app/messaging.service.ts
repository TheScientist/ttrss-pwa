import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { LogMessage } from './model/logmessage';

@Injectable()
export class MessagingService {

  public uimessages: LogMessage[] = [];

  constructor() { }

  log(message: LogMessage, arg: any): void {
    console.log(message, arg);
    this.appendToUI(message);
  }

  private appendToUI(message: LogMessage): void {
    if (message.level === "DEBUG") {
      return;
    }
    if (this.uimessages.length > 4) {
      this.uimessages.pop();
    }
    this.uimessages.unshift(message);
  }
}
