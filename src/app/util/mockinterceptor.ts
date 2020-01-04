
import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import feeds from './mock-responses/feed-tree.json';


@Injectable()
export class HttpMockRequestInterceptor implements HttpInterceptor {
    constructor(private injector: Injector) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (request.method === 'POST') {
            const body = JSON.parse(request.body);
            switch (body.op) {
                case 'login': return ok({
                    content: {
                        session_id: 'session'
                    },
                    status: 0
                });
                case 'getConfig': return ok({
                    content: {
                        icons_url: 'http://example.org'
                    },
                    status: 0
                });
                case 'getFeedTree': return ok(feeds);
            }
        }
        return next.handle(request);

        function ok(respBody?) {
            return of(new HttpResponse({ status: 200, body: respBody }));
        }
    }
}
