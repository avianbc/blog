---
id: 93
title: 'Maze Solving Algorithms – Wall Follower'
date: 2012-08-15T10:44:53-04:00
author: brad
layout: post
guid: http://avian.netne.net/blog/?p=93
permalink: /maze-solving-algorithms-wall-follower/
categories:
  - Programming
tags:
  - algorithms
  - 'CSharp'
  - maze
  - Programming
---
Maze solving algorithms are a well known area of research. Of these, one of the most well known solving strategies for simply connected mazes is the [wall follower](http://en.wikipedia.org/wiki/Maze_solving_algorithm#Wall_follower) algorithm. This post will delve into the coding and implementation of such an algorithm (in C#, of course).

<!--more-->

The first step in implementing any algorithm?Â Lets do some brainstorming. Through the process, this blog will serve as my [rubber duck](http://en.wikipedia.org/wiki/Rubber_duck_debugging).

So, say we want to implement a wall follower who follows the right-hand rule. What information do we need? For starters, we will need to know what direction the maze solver is facing in order to determine which direction to prioritize. How do we determine this? Easy: simple math. We either can have the solver remember the last movement direction using a variable or property or we can compute it manually if we know the previous and current coordinates.

> A quick tangent: this article will use Windows style coordinates. That is: (0,0) is the top left of any windows form and moving to the right is +X and moving down is +Y.

<div class="codecolorer-container text default" style="overflow:auto;white-space:nowrap;">
  <div class="text codecolorer">
    deltaX = currentPosition.X - previousPositionX;<br /> deltaY = currentPosition.Y - previousPositionY;
  </div>
</div>

If deltaX is 1, we the solver went east and if -1 it was west. If deltaY is 1 then direction was south and -1 is north.

So we know which direction the movement was. How can we use this? Depending on which direction the movement was, there are 4 priorities:<table border=1>

<th colspan="5">
  Using Right-Hand Rule:
</th>

</table>

 <table border=1>

<th colspan="5">
  Using Left-Hand Rule:
</th>

</table>

See a pattern? The left wall follower is the same as the right wall follower, except the 1st and 3rd priorities are exchanged! This means you can use one algorithm for both by passing one parameter indicating which wall to follow. This is consistent with [DRY](http://en.wikipedia.org/wiki/Don't_repeat_yourself) to avoid duplicate code.

So, lets sum it up with some pseudocode. To initialize the algorithm, make sure to set previousPosition to a neighbor of the start position so it doesnt error on first pass:

<div class="codecolorer-container text default" style="overflow:auto;white-space:nowrap;">
  <div class="text codecolorer">
    currentX/Y values = startPosition X and Y values<br /> previousX/Y = startPosition's X (or Y) value - 1
  </div>
</div>

<div class="codecolorer-container text default">
  <div class="text codecolorer">
    start loop:<br /> // calculate facing direction using knowledge of current and previous X,Y<br /> deltaX = currentX - previousX<br /> deltaY = currentY - previousY<br /> facing direction = direction calculated from deltaX/Y<br /> <br /> // enumerate next movement in order of priority<br /> new array[4]  // declare array to hold priorities<br /> switch(direction) // populate array according to right hand rule results from table above<br /> {<br />   case North:  array[0] = East, array[1] = North, array[2] = West, array[3] = South<br />   case South:  array[0] = West, array[1] = South, array[2] = East, array[3] = North<br />   case East:  array[0] = South, array[1] = East, array[2] = North, array[3] = West<br />   case West:  array[0] = north, array[1] = West, array[2] = South, array[3] = East<br /> }<br /> <br /> if(leftHandRule) { switch positions of array[0] and array[2] }<br /> <br /> for each direction in array<br /> {<br />   calculate new X and Y<br />   if new X/Y == finish, all done!<br />   if newX/Y is not out of bounds and is reachable (no walls obstructing passage)<br />   then previous = current and current = newX/Y (also break out of foreach loop)<br /> }<br /> end loop
  </div>
</div>

Final tips: Make sure you [enumerate](http://msdn.microsoft.com/en-us/library/sbbt4032.aspx) the different directions! This method can not reach the exit if it is not connected to the outer wall. It uses little memory since you do not have to track history but can take a long time to solve complex mazes.
