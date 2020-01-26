import { browser, by, element } from 'protractor';
import { AppPage } from './app.po';
import { OverviewPage } from './overview.po';

export class SettingsPage extends AppPage {

  settingsTab = element(by.id('mat-tab-label-0-1'));
  connectionTab = element(by.id('mat-tab-label-0-0'));
  linkToFeeds = element(by.id('feedLink'));
  serverUrlInput = element(by.id('apiurl'));
  usernameInput = element(by.id('username'));
  passwordInput = element(by.id('password'));
  testButton = element(by.id('testButton'));
  markReadOnScrollToggle = element(by.id('mat-slide-toggle-1'));
  showEmptyCategoryToggle = element(by.id('mat-slide-toggle-3'));

  navigateTo() {
    return browser.get('/settings');
  }

  goBackToFeeds(): OverviewPage {
    this.linkToFeeds.click();
    return new OverviewPage();
  }

  doTestConnection(url: string, user: string, pw: string) {
    this.connectionTab.click();
    this.serverUrlInput.click();
    this.serverUrlInput.sendKeys(url);
    this.usernameInput.click();
    this.usernameInput.sendKeys(user);
    this.passwordInput.click();
    this.passwordInput.sendKeys(pw);
    this.testButton.click();
  }

  async doSetSettings(markReadOnScroll: boolean, showEmptyCategories: boolean) {
    this.settingsTab.click();

    const classValue = await this.markReadOnScrollToggle.getAttribute('class');
    if (classValue.includes('mat-checked') !== markReadOnScroll) {
      this.markReadOnScrollToggle.click();
    }

    const emptyCatClassValue = await this.showEmptyCategoryToggle.getAttribute('class');
    if (emptyCatClassValue.includes('mat-checked') !== showEmptyCategories) {
      this.showEmptyCategoryToggle.click();
    }
    await this.delay(1000);
  }


}
