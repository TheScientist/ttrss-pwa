# Tiny Tiny RSS Progressive Web App

[![Build Status](https://ci.thescientist.eu/job/ttrss/job/master/badge/icon)](https://ci.thescientist.eu/job/ttrss/job/master/)
[![dependencies Status](https://david-dm.org/thescientist/ttrss-pwa/status.svg)](https://david-dm.org/thescientist/ttrss-pwa)
[![devDependencies Status](https://david-dm.org/thescientist/ttrss-pwa/dev-status.svg)](https://david-dm.org/thescientist/ttrss-pwa?type=dev)

## Usage
A sample installation is installed at https://ttrss.thescientist.eu/
You will get redirected to the settings page. Put your tt-rss server credentials into the fields and click on 'Verify'. 'Login successful' should be written at the bottom. Click on 'Back to feeds' and use the app.
Don't worry your credentials will stay on your device.

### CORS header
Your tt-rss server will probably block this app's API queries, cause the app uses Cross-Origin Resource Sharing (JavaScript HTTP calls to a different domain.)
You need to configure your web server to accept requests from my domain.
TODO Sample server configuration

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

Configure params section in protractor.conf.js with a valid tt-rss connection
Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
