import { browser, by, element } from 'protractor';

export class AppPage {

  lastLogMessage = element(by.xpath('//mat-expansion-panel-header//mat-panel-description'));

  navigateTo() {
    return browser.get('/');
  }

  async waitForLastLogMessageText(msg: string) {
    return browser.wait(
      () => this.lastLogMessage.getText()
        .then((txt) => {
          return txt === msg;
        }), 30000);
  }

  async delay(ms: number) {
    await new Promise(resolve => setTimeout(() => resolve(), ms));
  }
}
