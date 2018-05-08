import { browser, by, element } from 'protractor';
import { AppPage } from './app.po';

export class OverviewPage extends AppPage {
  head = element(by.tagName('h1'));

  getHeadTest() {
    return this.head.getText();
  }
}
