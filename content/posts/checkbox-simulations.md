---
title: "Checkbox Canvas: Simulations"
date: 2026-03-15T19:45:00-05:00
categories:
  - Programming
tags:
  - JavaScript
  - HTML
  - Checkboxes
  - Algorithms
series:
  - Experiments
  - Checkbox Canvas
---

The 1-bit constraint is most interesting when you stack it against a system with real state. These four demos are simulations. They evolve by rules, and the checkboxes just report what happened. The display isn't the computation; it's the readout.

## **[Slime Mold Simulation](/checkboxes/slime-mold-simulation.html)** *(interactive)*

[Physarum polycephalum](https://en.wikipedia.org/wiki/Physarum_polycephalum) is a slime mold that navigated mazes, solved the shortest path between oat flakes, and independently approximated the Tokyo subway network. It has no brain, no neurons, no central coordination. Researchers at Hokkaido University published [a paper about it in Science in 2010](https://doi.org/10.1126/science.1177894) and everyone was appropriately unsettled.

The simulation approximates its foraging behavior with simple agents. Each agent has a position, a heading, and three sensors (forward-left, forward, forward-right). Every step, it samples the trail concentration at each sensor position, turns toward the highest reading, moves forward, and deposits a small amount of trail. The trail diffuses and decays each frame.

That's the entire rule set. The branching networks, the pulsing veins, the convergence when you click and deposit a blob of trail: all of it comes from that local rule applied to a few thousand agents simultaneously. No global coordination exists anywhere in the code.

At 1-bit resolution the patterns are rougher than they'd be on a canvas, but the structure is still clearly visible and arguably more legible. The discretization forces the networks into sharper shapes.

Click or drag anywhere to deposit trail and watch the agents swarm toward it. The response is immediate and a little unsettling.

![Slime mold simulation running in a checkbox grid](/checkboxes/slime-mold-simulation.png)

## **[Langton's Ant](/checkboxes/langtons-ant.html)**

<div style="margin:1.5rem 0">
<div id="ant-grid" style="display:grid;width:fit-content;line-height:0"></div>
<script>
(function() {
  var COLS = 52, ROWS = 16;
  var g = document.getElementById('ant-grid');
  g.style.gridTemplateColumns = 'repeat(' + COLS + ', auto)';
  var frag = document.createDocumentFragment();
  for (var i = 0; i < COLS * ROWS; i++) {
    var cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.style.pointerEvents = 'none';
    cb.style.cursor = 'default';
    frag.appendChild(cb);
  }
  g.appendChild(frag);
  var cbs = Array.from(g.querySelectorAll('input'));
  var ax = Math.floor(COLS / 2), ay = Math.floor(ROWS / 2), dir = 0;
  var dx = [0, 1, 0, -1], dy = [-1, 0, 1, 0];
  function step() {
    var idx = ay * COLS + ax;
    var on = cbs[idx].checked;
    dir = on ? (dir + 3) % 4 : (dir + 1) % 4;
    cbs[idx].checked = !on;
    ax = ((ax + dx[dir]) + COLS) % COLS;
    ay = ((ay + dy[dir]) + ROWS) % ROWS;
  }
  function tick() { for (var i = 0; i < 8; i++) step(); requestAnimationFrame(tick); }
  tick();
})();
</script>
</div>

[Two rules](https://en.wikipedia.org/wiki/Langton%27s_ant):

1. On a lit cell: turn right, uncheck it, move forward.
2. On a dark cell: turn left, check it, move forward.

That's it. Run it for a few hundred steps and you get something that looks like noise. Run it for about 10,000 steps and it spontaneously starts building a diagonal highway that repeats forever. No one has a clean mathematical proof of why this happens. It's been observed, not derived.

The ant above runs 8 steps per frame so you can watch the early chaos phase compact down into the highway. On the fullscreen page the grid wraps at the edges so it runs indefinitely. Wait for the highway.

## **[Game of Life](/checkboxes/game-of-life.html)** *(interactive)*

[Conway's rules](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life): a live cell with 2 or 3 neighbors survives. A dead cell with exactly 3 neighbors becomes live. Everything else dies or stays dead. The grid wraps at edges.

Click or drag to paint cells. Gliders work. Common oscillators work. They just look blockier than usual. The wrapping means gliders that exit one side re-enter on the other, which can cause collisions that wouldn't happen on an infinite grid.

## **[Maze Generator](/checkboxes/maze.html)**

Generates mazes in real time using iterative [depth-first search](https://en.wikipedia.org/wiki/Depth-first_search) (recursive backtracker). The algorithm maintains a stack, randomly picks an unvisited neighbor, carves a passage, and pushes. When stuck, it pops and backtracks. You can watch the stack unwind.

Every generated maze is a perfect maze: one solution, no loops, no isolated regions. It restarts automatically. Good to leave running if you like watching things get solved that you didn't ask it to solve.

![Maze generator mid-run in a checkbox grid](/checkboxes/maze.png)

---

*Part of the [Checkbox Canvas](/series/checkbox-canvas/) series. See also: [Visual Effects](/posts/checkbox-visual-effects/), [Games](/posts/checkbox-games/), [Dither & Webcam](/posts/checkbox-dither/).*
