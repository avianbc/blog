+++
date = 2020-09-18
title = "NgBootstrap Datepicker - US Date Formatter - Improved edition"
categories = ['Programming', 'TypeScript', 'Angular']
+++

In a [previous post](https://bradleycarey.com/posts/ng-bootstrap-us-date-formatter/), I outlined my strategy of using the [ng-bootstrap](https://ng-bootstrap.github.io/) datepicker with a formatter for US dates (mm/dd/yyyy).

In this post, I will provide an updated version. Check the specs below for specifics on improvements. Among these are:

- Allows basically any separator (including none at all!)
- Works with or without zero padding months or days
- Allows entry of double digit years, which will then assume 19XX or 20XX depending on the breakpoint that is set (40 is used below - check tests for details)

## us-date-parser-formatter.ts

{{< highlight typescript >}}
import * as _ from 'lodash-es';
import { NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';

@Injectable()
export class DateParserFormatter extends NgbDateParserFormatter {
  private shortYearBreakpoint = 40;

  parse(value: string): NgbDateStruct {
    if (!value) { return null; }

    let dateParts: string[];
    if (/^(?:\d{6}|\d{8})$/.test(value)) {
      dateParts = /(\d{2})(\d{2})(\d{2}|\d{4})$/.exec(value).slice(1, 4);
    } else if (/^\d{1,2}[-\/]\d{1,2}[-\/](?:\d{2}|\d{4})$/.test(value)) {
      dateParts = value.split(/[-\/]/);
    } else {
      return null;
    }

    let year = _.toInteger(dateParts[2]);
    if (year < 100) {
      year += year <= this.shortYearBreakpoint ? 2000 : 1900;
    }
    return { year, month: _.toInteger(dateParts[0]), day: _.toInteger(dateParts[1]) } as NgbDateStruct;
  }

  format(date: NgbDateStruct): string {
    return date ? `${_.padStart(date.month.toString(), 2, '0')}/${_.padStart(date.day.toString(), 2, '0')}/${date.year}` : '';
  }
}

{{< /highlight >}}

## us-date-parser-formatter.spec.ts

{{< highlight typescript >}}
import { DateParserFormatter } from './date-parser-formatter';

describe('DateParserFormatter', () => {
  let parser: DateParserFormatter;

  beforeEach(() => {
    parser = new DateParserFormatter();
  });

  describe('When a string of the format m/d/yy is parsed', () => {
    it('it returns the correct date object.', () => {
      expect(parser.parse('1/2/34')).toEqual({ year: 2034, month: 1, day: 2 });
    });
  });
  describe('When a string of the format mm/dd/yyyy is parsed', () => {
    it('it returns the correct date object.', () => {
      expect(parser.parse('01/02/1934')).toEqual({ year: 1934, month: 1, day: 2 });
    });
  });
  describe('When a string of the format m/d/yyyy is parsed', () => {
    it('it returns the correct date object.', () => {
      expect(parser.parse('1/2/1934')).toEqual({ year: 1934, month: 1, day: 2 });
    });
  });
  describe('When a string of the format m-d-yy is parsed', () => {
    it('it returns the correct date object.', () => {
      expect(parser.parse('1-2-34')).toEqual({ year: 2034, month: 1, day: 2 });
    });
  });
  describe('When a string of the format mm-dd-yyyy is parsed', () => {
    it('it returns the correct date object.', () => {
      expect(parser.parse('01-02-1934')).toEqual({ year: 1934, month: 1, day: 2 });
    });
  });
  describe('When a string of the format m-d-yyyy is parsed', () => {
    it('it returns the correct date object.', () => {
      expect(parser.parse('1-2-1934')).toEqual({ year: 1934, month: 1, day: 2 });
    });
  });
  describe('When a string of the format mmddyy is parsed', () => {
    it('it returns the correct date object.', () => {
      expect(parser.parse('010234')).toEqual({ year: 2034, month: 1, day: 2 });
    });
  });
  describe('When a string of the format mmdd19yy is parsed', () => {
    it('it returns the correct date object.', () => {
      expect(parser.parse('01021934')).toEqual({ year: 1934, month: 1, day: 2 });
    });
  });
  describe('When a string of the format mmdd20yy is parsed', () => {
    it('it returns the correct date object.', () => {
      expect(parser.parse('01022034')).toEqual({ year: 2034, month: 1, day: 2 });
    });
  });
  describe('When an invalid string with alpha characters', () => {
    it('it returns null.', () => {
      expect(parser.parse('abc')).toBeNull();
    });
  });
  describe('When a valid string with additional invalid chars', () => {
    it('it returns null.', () => {
      expect(parser.parse('123456abc')).toBeNull();
    });
  });
  describe('When an invalid string with numeric characters', () => {
    it('it returns null.', () => {
      expect(parser.parse('12345')).toBeNull();
    });
  });
  describe('When a struct is formatted', () => {
    it('it returns a string in the format mm/dd/yyyy', () => {
      expect(parser.format({ year: 1934, month: 1, day: 2 })).toBe('01/02/1934');
    });
  });
  describe('When a falsey value is formatted', () => {
    it('it returns an empty string.', () => {
      expect(parser.format(undefined)).toBe('');
    });
  });
  describe('When a short year is greater than 40', () => {
    it('it assumes 1900s.', () => {
      expect(parser.parse('1/2/41')).toEqual({ year: 1941, month: 1, day: 2 });
    });
  });
  describe('When a short year is less than or equal to 40', () => {
    it('it assumes 2000s.', () => {
      expect(parser.parse('1/2/40')).toEqual({ year: 2040, month: 1, day: 2 });
    });
  });
});
{{< /highlight >}}
