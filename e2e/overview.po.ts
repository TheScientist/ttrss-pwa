import { by, element, browser } from 'protractor';
import { AppPage } from './app.po';

export class OverviewPage extends AppPage {
  head = element(by.tagName('h1'));
  sideNav = element(by.id('sidenav'));

  constructor() {
    super();
    const condition = browser.ExpectedConditions;
    browser.wait(condition.presenceOf(this.sideNav.element(by.xpath('.//h2[text()="Special"]'))), 30000);
  }

  getSelectedFeedTitle() {
    return this.head.getText();
  }

  getCategoryLocation(catName: string) {
    const elem = this.sideNav.element(by.xpath('.//h2[text()="' + catName + '"]'));
    return elem.getLocation().then(l => l.y);
  }

  isCategoryVisible(catName: string) {
    const elem = this.sideNav.element(by.xpath('.//h2[text()="' + catName + '"]'));
    return elem.isPresent();
  }
}
