import { browser } from 'protractor';
import { SettingsPage } from './settings.po';
import { OverviewPage } from './overview.po';

describe('Feed list', () => {
  let page: OverviewPage;
  let settings: SettingsPage;

  beforeEach(() => {
    browser.get('/');
    browser.executeScript('window.localStorage.clear()');
    browser.executeScript('window.sessionStorage.clear()');
    settings = new SettingsPage();
    settings.navigateTo();
    settings.doTestConnection('http://example.org/tt-rss', 'admin', 'password');
  });

  it('should have no feed selected', () => {
    page = settings.goBackToFeeds();
    const head = page.getSelectedFeedTitle();
    expect(head).toBe('Tiny Tiny RSS PWA');
  });

  it('should order categories correctly withEmpty', async () => {
    await settings.doSetSettings(false, true);
    page = settings.goBackToFeeds();

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

  it('should not show empty categories', async () => {
    await settings.doSetSettings(false, false);
    page = settings.goBackToFeeds();

    const uncatVisible = await page.isCategoryVisible('Uncategorized');
    const emptyVisible = await page.isCategoryVisible('Empty');
    const topVisible = await page.isCategoryVisible('Top');

    expect(uncatVisible).toBeFalsy();
    expect(emptyVisible).toBeFalsy();
    expect(topVisible).toBe(true);
  });
});
