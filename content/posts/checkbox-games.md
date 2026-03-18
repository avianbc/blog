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
---

Games are an interesting stress test for the 1-bit constraint. A simulation can skip frames and still look fine. A game can't — input latency matters, collision detection matters, and the player is paying close attention in a way that they aren't when watching a visual effect. If the game loop is wrong, you notice immediately.

Both of these work. Unironically.

## Pong

**[Pong](/checkboxes/pong.html)** *(interactive)*

Two players. Left paddle: W and S. Right paddle: up and down arrow keys.

The ball is a single checkbox. The paddles are vertical strips a few cells tall. Collision detection is just "is the cell the ball is moving into currently checked?" — which works fine at this resolution because the ball is one pixel and the paddle is solid. The ball speeds up with each rally. It scores.

The implementation has to be careful about which cells are "paddle" versus "ball" versus "trail from the previous frame." Since clearing and redrawing every cell every frame at full screen resolution would be expensive, most of the rendering is diff-based — only the cells that changed from the previous frame get touched.

## Snake

**[Snake](/checkboxes/snake.html)** *(interactive)*

Arrow keys or WASD. Classic Snake rules: eat the food, grow the tail, don't hit yourself or the walls.

The tail is represented as a queue of occupied cells. Each frame, a new head cell is checked and — if the snake didn't eat — the oldest tail cell is unchecked. The food spawns at a random unchecked cell. Collision is a Set lookup.

The grid wraps... or doesn't, depending on which version of Snake you consider canonical. Open it and find out.

---

*Part of the [Checkbox Canvas](/series/checkbox-canvas/) series. See also: [Simulations](/posts/checkbox-simulations/), [Visual Effects](/posts/checkbox-visual-effects/), [Dither & Webcam](/posts/checkbox-dither/).*
