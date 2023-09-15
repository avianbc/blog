+++
date = 2023-09-15T17:45:40-04:00
title = "Safely migrate from hash-based routing to modern routing in Angular"
tags = ['TypeScript', 'JavaScript', 'Angular']
categories = ['Programming']
+++

If you have an old angular app that is still using hash-based routing via the [HashLocationStrategy](https://angular.io/api/common/HashLocationStrategy), you can safely migrate to modern [PathLocationStrategy](https://angular.io/api/common/PathLocationStrategy) routing without breaking existing bookmarks or SEO.

1. Add this snippet to your `AppComponent` > `ngOnInit`:

```typescript
this.router.events
  .pipe(filter((event) => event instanceof NavigationStart && /^\/#/.test(event.url)))
  .subscribe((event: NavigationStart) => this.router.navigateByUrl(event.url.replace('/#', '')));
```

Note that `router.navigate` will strip any query params. I used `router.navigateByUrl` instead.

2. You can now safely turn off `useHash`:

```typescript
RouterModule.forRoot(routes, { useHash: false })
```

Now, if you hit a URL like `https://example.com/#/foo/bar`, the router will automatically redirect to `https://example.com/foo/bar`. This will allow you to incrementally migrate your app to modern routing without breaking existing links.
