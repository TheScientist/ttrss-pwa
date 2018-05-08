import { AppPage } from './app.po';
import { browser } from 'protractor';
import { SettingsPage } from './settings.po';

describe('ttrss-pwa Settings page', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
    page.navigateTo();
  });

  it('should display title', () => {
    expect(browser.getTitle()).toEqual('Tiny Tiny RSS PWA');
  });

  it('should save valid settings', async () => {
    let settings = new SettingsPage();
    settings.doTestSettings(browser.params.login.url, browser.params.login.user, browser.params.login.password);
    let logMsgFound = await settings.waitForLastLogMessageText('login successful');
    expect(logMsgFound).toBe(true);
  });
});
