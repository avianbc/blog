---
id: 295
title: GridView Column Grouping in ASP.NET
date: 2013-02-19T18:39:30-04:00
author: brad
layout: post
guid: http://avian.netne.net/blog/?p=295
permalink: /gridview-column-grouping-in-asp-net/
categories:
  - ASP.NET
  - Programming
  - VB
  - Web Design
---
If you are writing code to show a large amount of records in an ASP.NET GridView control, you should do your best to make them easily readable since it can be overwhelming. I’ve ran across a few different hacks using JQuery to enhance the presentation of GridView records, but this seems to lag the user’s browser when a large number of rows is encountered. I have wrote a small function that performs this action server-side and rids the user of the content-rendering JQuery lag spike.

What kind of grouping am I referring to? Here is an example of what this code does. Here is what a standard GridView would look like:

<img class="alignnone size-full wp-image-299" title="before" src="/images/2013/02/before.png" alt="" width="536" height="236" srcset="/images/2013/02/before.png 536w, /images/2013/02/before-300x132.png 300w" sizes="(max-width: 536px) 100vw, 536px" />

After using this function, this same table would render as:

<img class="alignnone size-full wp-image-300" title="after" src="/images/2013/02/after.png" alt="" width="530" height="239" srcset="/images/2013/02/after.png 530w, /images/2013/02/after-300x135.png 300w" sizes="(max-width: 530px) 100vw, 530px" />

You can specify which columns to group, as well as how many columns to group. There are many ways to use this function. Just make sure to call it after DataBinding has occurred. A good place to ensure this is the DataBound event handler of the GridView itself which fires upon finish of DataBinding.

The syntax for using it is:

`GroupGridView(gridRows As GridViewRowCollection, whichColumn As Integer, howManyColumns As Integer)`

where:

gridRows is a collection of Rows of the Grid,

whichColumn is the index of the column to start the grouping,

howManyColumns is the number of columns to iterate through and group together.

For example:

`GroupGridView(GridViewID.Rows, 0, 3)`

{{< highlight vb >}}
Private Sub GroupGridView(gridRows As GridViewRowCollection, whichColumn As Integer, howManyColumns As Integer)
    If howManyColumns = 0 Then Return

    Dim i As Integer, count As Integer = 1
    Dim rowList As New ArrayList()

    rowList.Add(gridRows(0))
    Dim ctrl = gridRows(0).Cells(whichColumn)

    For i = 1 To gridRows.Count - 1
        Dim nextCell As TableCell = gridRows(i).Cells(whichColumn)
        If ctrl.Text = nextCell.Text Then
            count += 1
            nextCell.Visible = False
            rowList.Add(gridRows(i))
        Else
            If count > 1 Then
                ctrl.RowSpan = count
                GroupGridView(New GridViewRowCollection(rowList), whichColumn + 1, howManyColumns - 1)
            End If
            count = 1
            rowList.Clear()
            ctrl = gridRows(i).Cells(whichColumn)
            rowList.Add(gridRows(i))
        End If
    Next

    If count > 1 Then
        ctrl.RowSpan = count
        GroupGridView(New GridViewRowCollection(rowList), whichColumn + 1, howManyColumns - 1)
    End If
End Sub
{{< /highlight >}}
