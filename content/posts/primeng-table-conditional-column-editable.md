+++
date = 2022-05-10T16:11:00-04:00
title = "Make dynamic PrimeNG table columns condtionally editable"
categories = ['Programming', 'TypeScript', 'Angular', 'PrimeNG']
+++

The [PrimeNG table](https://primeng.org/table) component is a powerful data visualization tool and is a great free alternative to [AG Grid](https://www.ag-grid.com/).

Table columns can be [defined dynamically](https://primeng.org/table#dynamic) using the `*ngFor` directive. However, if you do this there is no apparent way to conditionally mark a column as editable!

There is actually an undocumented `pEditableColumnDisabled` boolean directive that can be used to control if a cell is editable or not. The only documented directives are `pEditableColumn` and `pEditableColumnField`.

Here is a direct link to the directive on the [PrimeNG github](https://github.com/primefaces/primeng/blob/v12.2.3/src/app/components/table/table.ts#L3337).

Using it would be something like: `<td pEditableColumn [pEditableColumnDisabled]="!col.editable" *ngFor="let col of columns" [ngSwitch]="col.field">`
