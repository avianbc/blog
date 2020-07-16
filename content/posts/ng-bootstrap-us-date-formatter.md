+++
date = 2020-06-18
title = "NgBootstrap Datepicker - US Date Formatter mm/ff/yyyy"
categories = ['Programming', 'TypeScript', 'Angular']
+++

If you have used Angular and Bootstrap then you are probably familar with [ng-bootstrap](https://ng-bootstrap.github.io/).

The default formatter that the datepicker uses is the ISO8601 format (yyyy-mm-dd). The docs have a sample that show you how to format the date as dd/mm/yyyy. I have adapted that sample to use the format that is the most widely used in the US (mm/dd/yyyy). Hope you find it useful!

[Click here to see the gist on github.](https://gist.github.com/avianbc/e49d89cce3b3976755b995995db1dae9)

## us-date-parser-formatter.ts

{{< highlight typescript >}}
import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash-es';

@Injectable()
export class UnitedStatesDateParserFormatter extends NgbDateParserFormatter {

  parse(value: string): NgbDateStruct | null {
    if (value != null) {
      const parts = value.split('/');
      if (parts.length === 3 && this.isNumber(parts[0]) && this.isNumber(parts[1]) && this.isNumber(parts[2])) {
        return { month: _.parseInt(parts[0]), day: _.parseInt(parts[1]), year: _.parseInt(parts[2]) };
      }
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date && this.isNumber(date.day) && this.isNumber(date.month) && this.isNumber(date.year)
      ? `${this.padNumber(date.month)}/${this.padNumber(date.day)}/${date.year}`
      : '';
  }

  private isNumber(value: any): value is number {
    return !isNaN(_.parseInt(value));
  }

  private padNumber(value: number) {
    if (this.isNumber(value)) {
      return `0${value}`.slice(-2);
    } else {
      return '';
    }
  }
}
{{< /highlight >}}

## us-date-parser-formatter.spec.ts

{{< highlight typescript >}}
import { UnitedStatesDateParserFormatter } from './us-date-parser-formatter';

describe('UnitedStatesDateParserFormatter', () => {
  let sut: UnitedStatesDateParserFormatter;

  beforeEach(() => { sut = new UnitedStatesDateParserFormatter(); });

  describe('Parsing', () => {
    it('should parse null undefined and empty string as null', () => {
      expect(sut.parse(null as any)).toBeNull();
      expect(sut.parse(undefined as any)).toBeNull();
      expect(sut.parse('')).toBeNull();
      expect(sut.parse('   ')).toBeNull();
    });

    it('should parse valid date', () => {
      expect(sut.parse('05/12/2016')).toEqual({ year: 2016, month: 5, day: 12 });
    });

    it('should parse non-date as null', () => {
      expect(sut.parse('foo/bar/baz')).toBeNull();
      expect(sut.parse('2014/bar')).toBeNull();
      expect(sut.parse('2014/11/12/15')).toBeNull();
      expect(sut.parse('5/7')).toBeNull();
    });
  });

  describe('Formatting', () => {
    it('should format null and undefined as an empty string', () => {
      expect(sut.format(null)).toBe('');
      expect(sut.format(undefined as any)).toBe('');
    });

    it('should format a valid date', () => {
      expect(sut.format({ year: 2016, month: 10, day: 15 })).toBe('10/15/2016');
    });

    it('should format a valid date with padding', () => {
      expect(sut.format({ year: 2016, month: 10, day: 5 })).toBe('10/05/2016');
    });

    it('should return empty string for invalid dates', () => {
      expect(sut.format({ year: 2016, month: NaN, day: undefined } as any)).toBe('');
      expect(sut.format({ year: 2016, month: null, day: 0 } as any)).toBe('');
      expect(sut.format({ year: null, month: null, day: 1 } as any)).toBe('');
    });
  });
});
{{< /highlight >}}
