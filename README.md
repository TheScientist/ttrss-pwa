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
If you are using Nginx to forward requests to ttrss, here is a sample configuration to allow CORS only for the domain of the PWA demo page.
```
server {
  listen 80;
  server_name ttrss.EXAMPLE;
  include no-spyder.conf;
  return 301 https://$server_name$request_uri;
}
upstream ttrssdev {
    server 127.0.0.1:YOUR_PORT_HERE;
}
server {
  listen 443 ssl;
  gzip on;
  server_name ttrss.EXAMPLE;
  include no-spyder.conf;
  client_max_body_size 400m;
  ssl_certificate /etc/letsencrypt/live/EXAMPLE/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/EXAMPLE/privkey.pem;
  ssl_session_timeout 5m;
  location / {
    proxy_redirect off;
    proxy_pass http://ttrssdev;

    add_header Access-Control-Allow-Origin "https://ttrss.thescientist.eu";
    add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
    add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';

    proxy_set_header  Host                $http_host;
    proxy_set_header  X-Real-IP           $remote_addr;
    proxy_set_header  X-Forwarded-Ssl     on;
    proxy_set_header  X-Forwarded-For     $proxy_add_x_forwarded_for;
    proxy_set_header  X-Forwarded-Proto   $scheme;
    proxy_set_header  X-Frame-Options     SAMEORIGIN;

    client_max_body_size        100m;
    client_body_buffer_size     128k;

    proxy_buffer_size           4k;
    proxy_buffers               4 32k;
    proxy_busy_buffers_size     64k;
    proxy_temp_file_write_size  64k;
  }
}
```

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
