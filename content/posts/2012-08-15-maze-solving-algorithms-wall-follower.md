---
id: 93
title: 'Maze Solving Algorithms – Wall Follower'
date: 2012-08-15T10:44:53-04:00
author: brad
layout: post
guid: http://avian.netne.net/blog/?p=93
permalink: /maze-solving-algorithms-wall-follower/
categories:
  - programming
  - algorithms
  - csharp
---

Maze solving algorithms are a well known area of research. Of these, one of the most well known solving strategies for simply connected mazes is the [wall follower](http://en.wikipedia.org/wiki/Maze_solving_algorithm#Wall_follower) algorithm. This post will delve into the coding and implementation of such an algorithm (in C#, of course).

<!--more-->

The first step in implementing any algorithm? Lets do some brainstorming. Through the process, this blog will serve as my [rubber duck](http://en.wikipedia.org/wiki/Rubber_duck_debugging).

So, say we want to implement a wall follower who follows the right-hand rule. What information do we need? For starters, we will need to know what direction the maze solver is facing in order to determine which direction to prioritize. How do we determine this? Easy: simple math. We either can have the solver remember the last movement direction using a variable or property or we can compute it manually if we know the previous and current coordinates.

> A quick tangent: this article will use Windows style coordinates. That is: (0,0) is the top left of any windows form and moving to the right is +X and moving down is +Y.

`deltaX = currentPosition.X - previousPositionX;<br /> deltaY = currentPosition.Y - previousPositionY;`

If deltaX is 1, we the solver went east and if -1 it was west. If deltaY is 1 then direction was south and -1 is north.

So we know which direction the movement was. How can we use this? Depending on which direction the movement was, there are 4 priorities:

## Using Right-Hand Rule:

<table>
<tbody>
<tr>
<th>Facing?</th>
<th>1st Priority</th>
<th>2nd Priority</th>
<th>3rd Priority</th>
<th>4th Priority</th>
</tr>
<tr>
<td>North</td>
<td>E</td>
<td>N</td>
<td>W</td>
<td>S</td>
</tr>
<tr>
<td>South</td>
<td>W</td>
<td>S</td>
<td>E</td>
<td>N</td>
</tr>
<tr>
<td>East</td>
<td>S</td>
<td>E</td>
<td>N</td>
<td>W</td>
</tr>
<tr>
<td>West</td>
<td>N</td>
<td>W</td>
<td>S</td>
<td>E</td>
</tr>
</tbody>
</table>

## Using Left-Hand Rule:

<table>
<tbody>
<tr>
<th>Facing?</th>
<th>1st Priority</th>
<th>2nd Priority</th>
<th>3rd Priority</th>
<th>4th Priority</th>
</tr>
<tr>
<td>North</td>
<td>W</td>
<td>N</td>
<td>E</td>
<td>S</td>
</tr>
<tr>
<td>South</td>
<td>E</td>
<td>S</td>
<td>W</td>
<td>N</td>
</tr>
<tr>
<td>East</td>
<td>N</td>
<td>E</td>
<td>S</td>
<td>W</td>
</tr>
<tr>
<td>West</td>
<td>S</td>
<td>W</td>
<td>N</td>
<td>E</td>
</tr>
</tbody>
</table>

See a pattern? The left wall follower is the same as the right wall follower, except the 1st and 3rd priorities are exchanged! This means you can use one algorithm for both by passing one parameter indicating which wall to follow. This is consistent with [DRY](http://en.wikipedia.org/wiki/Don't_repeat_yourself) to avoid duplicate code.

So, lets sum it up with some pseudocode. To initialize the algorithm, make sure to set previousPosition to a neighbor of the start position so it doesnt error on first pass:

`currentX/Y values = startPosition X and Y values`

`previousX/Y = startPosition's X (or Y) value - 1`

{{< highlight js >}}

start loop:
// calculate facing direction using knowledge of current and previous X,Y
deltaX = currentX - previousX
deltaY = currentY - previousY
facing direction = direction calculated from deltaX/Y

// enumerate next movement in order of priority
new array[4]  // declare array to hold priorities
switch(direction) // populate array according to right hand rule results from table above
{
  case North:  array[0] = East, array[1] = North, array[2] = West, array[3] = South
  case South:  array[0] = West, array[1] = South, array[2] = East, array[3] = North
  case East:  array[0] = South, array[1] = East, array[2] = North, array[3] = West
  case West:  array[0] = north, array[1] = West, array[2] = South, array[3] = East
}

if(leftHandRule) { switch positions of array[0] and array[2] }

for each direction in array
{
  calculate new X and Y
  if new X/Y == finish, all done!
  if newX/Y is not out of bounds and is reachable (no walls obstructing passage)
  then previous = current and current = newX/Y (also break out of foreach loop)
}
end loop
{{< /highlight >}}

Final tips: Make sure you [enumerate](http://msdn.microsoft.com/en-us/library/sbbt4032.aspx) the different directions! This method can not reach the exit if it is not connected to the outer wall. It uses little memory since you do not have to track history but can take a long time to solve complex mazes.
