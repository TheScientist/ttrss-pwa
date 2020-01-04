import { AppPage } from './app.po';
import { browser } from 'protractor';
import { SettingsPage } from './settings.po';

describe('Settings page', () => {
  let page: AppPage;

  beforeEach(() => {
    browser.get('/');
    browser.executeScript('window.localStorage.clear()');
    browser.executeScript('window.sessionStorage.clear()');
    page = new AppPage();
    page.navigateTo();
  });

  it('should display title', () => {
    expect(browser.getTitle()).toEqual('Tiny Tiny RSS PWA');
  });

  it('should save valid settings', async () => {
    const settings = new SettingsPage();
    settings.doTestSettings('http://example.org/tt-rss', 'admin', 'password');
    const logMsgFound = await settings.waitForLastLogMessageText('Login erfolgreich');
    expect(logMsgFound).toBe(true);
  });
});
