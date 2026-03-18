---
title: "Checkbox Canvas: Games"
date: 2026-03-16T21:00:00-05:00
categories:
  - Programming
tags:
  - JavaScript
  - HTML
  - Checkboxes
  - Games
series:
  - Experiments
  - Checkbox Canvas
featuredImage: /checkboxes/pong.png
---

Games are an interesting stress test for the 1-bit constraint. A simulation can skip frames and still look fine. A game can't. Input latency matters, collision detection matters, and the player is paying close attention in a way that they aren't when watching a visual effect. If the game loop is wrong, you notice immediately.

Both of these work. Unironically.

## **[Pong](/checkboxes/pong.html)** *(interactive)*

Two players. Left paddle: W and S. Right paddle: up and down arrow keys.

The ball is a single checkbox. The paddles are vertical strips a few cells tall. Collision detection uses floating-point bounding-box checks against the paddle positions, not checkbox state. The ball speeds up with each rally. It scores.

Each frame clears the entire grid and redraws everything. At this resolution that's fast enough to not matter.

## **[Snake](/checkboxes/snake.html)** *(interactive)*

Arrow keys or WASD. Classic Snake rules: eat the food, grow the tail, don't hit yourself or the walls.

The tail is represented as a queue of occupied cells. Each frame, a new head cell is checked and, if the snake didn't eat, the oldest tail cell is unchecked. The food spawns at a random unchecked cell. Self-collision is a linear scan of the tail array.

The grid wraps at all edges.

---

*Part of the [Checkbox Canvas](/series/checkbox-canvas/) series. See also: [Simulations](/posts/checkbox-simulations/), [Visual Effects](/posts/checkbox-visual-effects/), [Images & Video](/posts/checkbox-images-and-video/).*
