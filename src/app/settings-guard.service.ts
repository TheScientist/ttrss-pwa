import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SettingsService } from './settings.service';
import { TtrssClientService } from './ttrss-client.service';
import { of } from 'rxjs/observable/of';
import { MessagingService } from './messaging.service';

@Injectable()
export class SettingsGuard implements CanActivate {

  constructor(private router: Router, private settings: SettingsService, private client: TtrssClientService, private msgs: MessagingService) { }

  canActivate() {
    var out = this.settings.sessionKey !== null;
    if (!out) {
      return this.client.login(false)
        .do(success => {
          if (!success) {
            this.router.navigate(['/settings']);
          }
        }).first();
    }
    return of(out);
  }
}
