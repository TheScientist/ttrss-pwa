import { browser } from 'protractor';
import { SettingsPage } from './settings.po';
import { OverviewPage } from './overview.po';

describe('Feed list', () => {
  let page: OverviewPage;

  beforeEach(() => {
    browser.get('/');
    browser.executeScript('window.localStorage.clear()');
    browser.executeScript('window.sessionStorage.clear()');
    const settings = new SettingsPage();
    settings.navigateTo();
    settings.doTestSettings(browser.params.login.url, browser.params.login.user, browser.params.login.password);
    page = settings.goBackToFeeds();
  });

  it('should have no feed selected', () => {
    const head = page.getSelectedFeedTitle();
    expect(head).toBe('Tiny Tiny RSS PWA');
  });

  it('should order categories correctly', async () => {
    const specialLoc = await page.getCategoryLocation('Special');
    const topLoc = await page.getCategoryLocation('Top');
    const middleLoc = await page.getCategoryLocation('Middle');
    const subLoc = await page.getCategoryLocation('Sub');
    const sub2Loc = await page.getCategoryLocation('Sub2');
    const bottomLoc = await page.getCategoryLocation('Bottom');
    const uncatLoc = await page.getCategoryLocation('Uncategorized');
    expect(specialLoc).toBeLessThan(topLoc);
    expect(topLoc).toBeLessThan(middleLoc);
    expect(middleLoc).toBeLessThan(subLoc);
    expect(subLoc).toBeLessThan(sub2Loc);
    expect(sub2Loc).toBeLessThan(bottomLoc);
    expect(bottomLoc).toBeLessThan(uncatLoc);
  });
});
