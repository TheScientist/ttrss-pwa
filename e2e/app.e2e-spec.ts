import { AppPage } from './app.po';
import { browser } from 'protractor';

describe('ttrss-pwa App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display title', () => {
    page.navigateTo();
    expect(browser.getTitle()).toEqual('Tiny Tiny RSS PWA');
  });
});
