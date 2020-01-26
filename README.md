# Tiny Tiny RSS Progressive Web App

[![Build Status](https://ci.thescientist.eu/job/ttrss/job/master/badge/icon)](https://ci.thescientist.eu/job/ttrss/job/master/)
[![dependencies Status](https://david-dm.org/thescientist/ttrss-pwa/status.svg)](https://david-dm.org/thescientist/ttrss-pwa)
[![devDependencies Status](https://david-dm.org/thescientist/ttrss-pwa/dev-status.svg)](https://david-dm.org/thescientist/ttrss-pwa?type=dev)

![Preview](https://thescientist.eu/owncloud/s/cAxREWnGiotXr68/preview)

## Usage
A sample installation is installed at https://ttrss.thescientist.eu/
You will get redirected to the settings page. Put your tt-rss server credentials into the fields and click on 'Verify'. 'Login successful' should be written at the bottom. Click on 'Back to feeds' and use the app.
Don't worry your credentials will stay on your device.
Click [here](https://thescientist.eu/owncloud/s/HZ4A6qawiS8yzcg/download) (mobile) or [here](https://thescientist.eu/owncloud/s/WbBf8ELdXwyixCc/download) (desktop) for demo videos.

### Features
- list articles of feeds or categories, including special feeds
- mark articles as read, starred or published
- light and dark material theme
- shortcut navigation
- share articles (mobile only on supported browsers that implement share-api)
- mark all articles of feed as read (catchup feed)
- mark multiple headlines as starred, read, published
- link to external source of article

Please raise issues for any feature you're looking for. I just implemented my daily use cases yet.

### CORS header
Your tt-rss server will probably block this app's API queries, cause the app uses Cross-Origin Resource Sharing (JavaScript HTTP calls to a different domain.)
You need to configure your web server to accept requests from my domain.
See [wiki](https://github.com/TheScientist/ttrss-pwa/wiki/Administration) for sample configurations.

## Development Prerequisites
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.6.4.
- Install NodeJs
- npm install -g @angular/cli (global installation of angular cli)
- go to checkout directory
  - npm install  (install projects dependencies)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Test are run against a mocked ttrss server (see mockinterceptor.ts).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
