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
If you are writing code to show a large amount of records in an ASP.NET GridView control, you should do your best to make them easily readable since it can be overwhelming. I&#8217;ve ran across a few different hacks using JQuery to enhance the presentation of GridView records, but this seems to lag the user&#8217;s browser when a large number of rows is encountered. I have wrote a small function that performs this action server-side and rids the user of the content-rendering JQuery lag spike.

<!--more-->

What kind of grouping am I referring to? Here is an example of what this code does. Here is what a standard GridView would look like:

[<img class="alignnone size-full wp-image-299" title="before" src="http://br4d.net/wp-content/uploads/2013/02/before.png" alt="" width="536" height="236" srcset="http://br4d.net/wp-content/uploads/2013/02/before.png 536w, http://br4d.net/wp-content/uploads/2013/02/before-300x132.png 300w" sizes="(max-width: 536px) 100vw, 536px" />](http://br4d.net/wp-content/uploads/2013/02/before.png)

After using this function, this same table would render as:

[<img class="alignnone size-full wp-image-300" title="after" src="http://br4d.net/wp-content/uploads/2013/02/after.png" alt="" width="530" height="239" srcset="http://br4d.net/wp-content/uploads/2013/02/after.png 530w, http://br4d.net/wp-content/uploads/2013/02/after-300x135.png 300w" sizes="(max-width: 530px) 100vw, 530px" />](http://br4d.net/wp-content/uploads/2013/02/after.png)

You can specify which columns to group, as well as how many columns to group. There are many ways to use this function. Just make sure to call it after DataBinding has occurred. A good place to ensure this is the DataBound event handler of the GridView itself which fires upon finish of DataBinding.

The syntax for using it is:

GroupGridView(gridRows As GridViewRowCollection, whichColumn As Integer, howManyColumns As Integer)

where:

gridRows is a collection of Rows of the Grid,

whichColumn is the index of the column to start the grouping,

howManyColumns is the number of columns to iterate through and group together.

For example:

GroupGridView(GridViewID.Rows, 0, 3)

<div class="codecolorer-container vb default" style="overflow:auto;white-space:nowrap;height:300px;">
  <div class="vb codecolorer">
    <span class="kw2">Private</span> <span class="kw2">Sub</span> GroupGridView(gridRows <span class="kw4">As</span> GridViewRowCollection, whichColumn <span class="kw4">As</span> <span class="kw1">Integer</span>, howManyColumns <span class="kw4">As</span> <span class="kw1">Integer</span>)<br /> &nbsp; &nbsp; <span class="kw3">If</span> howManyColumns = 0 <span class="kw3">Then</span> Return<br /> <br /> &nbsp; &nbsp; <span class="kw4">Dim</span> i <span class="kw4">As</span> <span class="kw1">Integer</span>, count <span class="kw4">As</span> <span class="kw1">Integer</span> = 1<br /> &nbsp; &nbsp; <span class="kw4">Dim</span> rowList <span class="kw4">As</span> <span class="kw2">New</span> ArrayList()<br /> <br /> &nbsp; &nbsp; rowList.Add(gridRows(0))<br /> &nbsp; &nbsp; <span class="kw4">Dim</span> ctrl = gridRows(0).Cells(whichColumn)<br /> <br /> &nbsp; &nbsp; <span class="kw3">For</span> i = 1 <span class="kw3">To</span> gridRows.Count - 1<br /> &nbsp; &nbsp; &nbsp; &nbsp; <span class="kw4">Dim</span> nextCell <span class="kw4">As</span> TableCell = gridRows(i).Cells(whichColumn)<br /> &nbsp; &nbsp; &nbsp; &nbsp; <span class="kw3">If</span> ctrl.Text = nextCell.Text <span class="kw3">Then</span><br /> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; count += 1<br /> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; nextCell.Visible = <span class="kw5">False</span><br /> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; rowList.Add(gridRows(i))<br /> &nbsp; &nbsp; &nbsp; &nbsp; <span class="kw3">Else</span><br /> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <span class="kw3">If</span> count > 1 <span class="kw3">Then</span><br /> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ctrl.RowSpan = count<br /> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; GroupGridView(<span class="kw2">New</span> GridViewRowCollection(rowList), whichColumn + 1, howManyColumns - 1)<br /> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <span class="kw3">End</span> <span class="kw3">If</span><br /> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; count = 1<br /> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; rowList.Clear()<br /> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ctrl = gridRows(i).Cells(whichColumn)<br /> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; rowList.Add(gridRows(i))<br /> &nbsp; &nbsp; &nbsp; &nbsp; <span class="kw3">End</span> <span class="kw3">If</span><br /> &nbsp; &nbsp; <span class="kw3">Next</span><br /> <br /> &nbsp; &nbsp; <span class="kw3">If</span> count > 1 <span class="kw3">Then</span><br /> &nbsp; &nbsp; &nbsp; &nbsp; ctrl.RowSpan = count<br /> &nbsp; &nbsp; &nbsp; &nbsp; GroupGridView(<span class="kw2">New</span> GridViewRowCollection(rowList), whichColumn + 1, howManyColumns - 1)<br /> &nbsp; &nbsp; <span class="kw3">End</span> <span class="kw3">If</span><br /> <span class="kw3">End</span> <span class="kw2">Sub</span>
  </div>
</div>