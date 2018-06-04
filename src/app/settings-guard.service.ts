
import {mergeMap, first, tap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SettingsService } from './settings.service';
import { TtrssClientService } from './ttrss-client.service';
import { of } from 'rxjs';
import { MessagingService } from './messaging.service';

@Injectable()
export class SettingsGuard implements CanActivate {

  constructor(private router: Router, private settings: SettingsService,
    private client: TtrssClientService, private msgs: MessagingService) { }

  canActivate() {
    const out = this.settings.sessionKey !== null;
    if (out) {
      return this.client.checkLoggedIn().pipe(mergeMap(loggedIn => {
        if (!loggedIn) {
          return this.client.login(true).pipe(
            tap(success => {
              if (!success) {
                this.router.navigate(['/settings']);
              }
            }), first());
        } else {
          return of(true);
        }
      }));
    } else {
      return this.client.login(false).pipe(
        tap(success => {
          if (!success) {
            this.router.navigate(['/settings']);
          }
        }), first());
    }
  }
}
