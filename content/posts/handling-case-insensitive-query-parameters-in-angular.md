+++
date = 2023-12-15T13:42:39-05:00
title = "Handling Case-Insensitive Query Parameters in Angular"
tags = ['TypeScript', 'JavaScript', 'Angular']
categories = ['Programming']
+++


After searching through Google and StackOverflow and finding nothing, I decided to write my own reusable class to handle case-insensitive query parameters in Angular. I hope this helps someone else!

# How to Use It

Using it is as easy as:

```typescript
import { ActivatedRoute } from '@angular/router';
import { CaseInsensitiveParamMap } from '../case-insensitive-param-map';

constructor(private activatedRoute: ActivatedRoute) {}

ngOnInit(): void {
  // subscribe to query params changes:
  this.activatedRoute.queryParams.snapshot.paramMap
    .subscribe((params) => this.handleQueryParamsChanged(new CaseInsensitiveParamMap(params)));
}

private handleQueryParamsChanged(paramMap: CaseInsensitiveParamMap): void {
  const returnUrl = paramMap.get('returnUrl');
  // Returns the value of the first query param named 'returnUrl' case-insensitively
  // See the test suite below for more examples
}
```

Or if you don't want to subscribe to changes, you can use the snapshot:

```typescript
  // or use the params from the route snapshot:
  const paramMap = new CaseInsensitiveParamMap(this.activatedRoute.snapshot.queryParams);
  const returnUrl = paramMap.get('returnUrl');
```

# case-insensitive-param-map.ts

This is a simple class that wraps the built-in `Params` object and provides case-insensitive access to query string parameters. It works similarly to the [built-in ParamsAsMap class](https://github.com/angular/angular/blob/16.2.x/packages/router/src/shared.ts#L76) except accesses the query params case insensitively.

```typescript
import { ParamMap, Params } from '@angular/router';

export class CaseInsensitiveParamMap implements ParamMap {
  private params: Params;

  constructor(params: Params) {
    this.params = params || {};
  }

  has(name: string): boolean {
    return Object.keys(this.params).some((key) => key.toLowerCase() === name.toLowerCase());
  }

  private getKeysCaseInsensitively(name: string): string[] {
    return Object.keys(this.params).filter((key) => key.toLowerCase() === name.toLowerCase());
  }

  get(name: string): string | null {
    if (this.has(name)) {
      const keys = this.getKeysCaseInsensitively(name);
      const v = this.params[keys[0]];
      return Array.isArray(v) ? v[0] : v;
    }

    return null;
  }

  getNumber(name: string): number | null {
    const v = this.get(name);
    return !v || isNaN(Number(v)) ? null : Number(v);
  }

  getAll(name: string): string[] {
    if (this.has(name)) {
      const result: string[] = [];
      this.getKeysCaseInsensitively(name).forEach((key) => {
        const v = this.params[key];
        result.push(...(Array.isArray(v) ? v : [v]));
      });
      return result;
    }

    return [];
  }

  get keys(): string[] {
    return Object.keys(this.params);
  }
}
```

Also note that I added a `getNumber` helper method that makes it much easier to parse integer query params. It returns `null` if the value is not a number or is not present.

# case-insensitive-param-map.spec.ts
```typescript
import { Params } from '@angular/router';
import { CaseInsensitiveParamMap } from './case-insensitive-param-map';

describe('CaseInsensitiveParamMap', () => {
  it('should return whether a case-insensitive parameter is present', () => {
    const params: Params = { single: 's', multiple: ['m1', 'm2'] };
    const map: CaseInsensitiveParamMap = new CaseInsensitiveParamMap(params);
    expect(map.has('single')).toEqual(true);
    expect(map.has('SINGLE')).toEqual(true);
    expect(map.has('multiple')).toEqual(true);
    expect(map.has('MULTIPLE')).toEqual(true);
    expect(map.has('not here')).toEqual(false);
  });

  it('should return the keys of the parameters', () => {
    const params: Params = { single: 's', multiple: ['m1', 'm2'] };
    const map: CaseInsensitiveParamMap = new CaseInsensitiveParamMap(params);
    expect(map.keys).toEqual(['single', 'multiple']);
  });

  it('should support single valued parameters', () => {
    const params: Params = { single: 's', multiple: ['m1', 'm2'] };
    const map: CaseInsensitiveParamMap = new CaseInsensitiveParamMap(params);
    expect(map.get('single')).toEqual('s');
    expect(map.get('multiple')).toEqual('m1');
  });

  it('should get numeric query string values as numbers', () => {
    const params: Params = { single: '1', multiple: ['2', '3'], nonnumeric: 'foo', empty: '', zero: '0', nullProp: null, undefinedProp: undefined };
    const map: CaseInsensitiveParamMap = new CaseInsensitiveParamMap(params);
    expect(map.getNumber('single')).toEqual(1);
    expect(map.getNumber('multiple')).toEqual(2);
    expect(map.getNumber('zero')).toEqual(0);
    expect(map.getNumber('nullProp')).toEqual(null);
    expect(map.getNumber('undefinedProp')).toEqual(null);
    expect(map.getNumber('nonnumeric')).toEqual(null);
    expect(map.getNumber('not here')).toEqual(null);
    expect(map.getNumber('empty')).toEqual(null);
  });

  it('should support case-insensitive single valued parameters', () => {
    const params: Params = { SINGLE: 'S', MULTIPLE: ['M1', 'M2'] };
    const map: CaseInsensitiveParamMap = new CaseInsensitiveParamMap(params);
    expect(map.get('single')).toEqual('S');
    expect(map.get('SINGLE')).toEqual('S');
    expect(map.get('Single')).toEqual('S');
    expect(map.get('multiple')).toEqual('M1');
    expect(map.get('MULTIPLE')).toEqual('M1');
    expect(map.get('Multiple')).toEqual('M1');
  });

  it('should support multiple valued parameters', () => {
    const params: Params = { single: 's', multiple: ['m1', 'm2'] };
    const map: CaseInsensitiveParamMap = new CaseInsensitiveParamMap(params);
    expect(map.getAll('single')).toEqual(['s']);
    expect(map.getAll('multiple')).toEqual(['m1', 'm2']);
  });

  it('should support case-insensitive multiple valued parameters', () => {
    const params: Params = { SINGLE: 'S', MULTIPLE: ['M1', 'M2'], multiple: ['M3'] };
    const map: CaseInsensitiveParamMap = new CaseInsensitiveParamMap(params);
    expect(map.getAll('single')).toEqual(['S']);
    expect(map.getAll('multiple')).toEqual(['M1', 'M2', 'M3']);
  });

  it('should return null when a single valued element is absent', () => {
    expect(new CaseInsensitiveParamMap({}).get('not here')).toEqual(null);
  });

  it('should return [] when a multiple valued element is absent', () => {
    expect(new CaseInsensitiveParamMap({}).getAll('not here')).toEqual([]);
  });
});
```

# Conclusion

With this solution, you can easily handle case-insensitive query parameters in Angular. Happy coding!
