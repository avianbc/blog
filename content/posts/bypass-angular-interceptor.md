---
date: 2023-08-15T00:37:53.000Z
title: Bypass Angular interceptors using HttpContext factory + HttpContextTokens
categories:
  - Programming
tags:
  - TypeScript
  - JavaScript
  - Angular
---

If the `HttpClient` is being used within a dependency outside of your control (such as a 3rd party lib) you can still use the `HttpContextTokens` that were [added in Angular v12](https://angular.io/api/common/http/HttpContext#usage-notes) by using a `HttpClient` factory provider. You can scope this to individual modules or components using the `providers` array:

### 1. Add DisableInterceptorHandler + token (disable-interceptor.handler.ts)

{{< highlight typescript >}}
import { HttpContextToken, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

export const DISABLE_INTERCEPTORS = new HttpContextToken<boolean>(() => false);

@Injectable()
export class DisableInterceptorHandler extends HttpHandler {
  constructor(private httpHandler: HttpHandler) {
    super();
  }

  handle(req: HttpRequest<unknown>) {
    return this.httpHandler.handle(
      req.clone({
        context: req.context.set(DISABLE_INTERCEPTORS, true),
      }),
    );
  }
}
{{< /highlight >}}

### 2. Provide the handler in either your `component`/`module`/`service`/whatever `providers` array

{{< highlight typescript >}}
  providers: [
    DisableInterceptorHandler,
    {
      provide: HttpClient,
      useFactory: (handler: DisableInterceptorHandler) => new HttpClient(handler),
      deps: [DisableInterceptorHandler],
    },
  ],
{{< /highlight >}}

### 3. Enforce the HttpContextToken in your interceptor

{{< highlight typescript >}}
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DISABLE_INTERCEPTORS } from './disable-interceptor.handler';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.context.get(DISABLE_INTERCEPTORS) === true) {
      return next.handle(request);
    }

    return next.handle(request).pipe(
      // add your typical interceptor logic
    );
  }
}
{{< /highlight >}}
